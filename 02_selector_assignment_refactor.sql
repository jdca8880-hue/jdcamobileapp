-- ============================================================
-- 1. DROP OLD SELECTOR ACCESS TABLES
-- ============================================================
DROP TABLE IF EXISTS selector_age_access CASCADE;
DROP TABLE IF EXISTS selector_district_access CASCADE;

-- ============================================================
-- 2. CREATE NEW SELECTOR ASSIGNMENTS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS selector_assignments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  selector_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  selection_process_id uuid NOT NULL REFERENCES selection_processes(id) ON DELETE CASCADE,
  is_lead_selector boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(selector_id, selection_process_id)
);

ALTER TABLE selector_assignments ENABLE ROW LEVEL SECURITY;

CREATE POLICY selector_assignments_read ON selector_assignments
FOR SELECT USING (is_admin() OR selector_id = auth.uid());

CREATE POLICY selector_assignments_write ON selector_assignments
FOR ALL USING (is_admin()) WITH CHECK (is_admin());

-- ============================================================
-- 3. ENSURE SELECTION PROCESSES STATUS
-- ============================================================
-- Assuming selection_process_status enum is already ('DRAFT', 'IN_PROGRESS', 'SUBMITTED', 'FINALIZED')
-- If not, you might need to alter it:
-- ALTER TYPE selection_process_status ADD VALUE IF NOT EXISTS 'SUBMITTED';

-- ============================================================
-- 4. UPDATE SELECTOR AUTHORIZATION RPC
-- ============================================================
CREATE OR REPLACE FUNCTION is_selector_authorized_for_player(p_player_id uuid, p_user_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_role app_role;
  v_authorized boolean;
BEGIN
  SELECT role INTO v_role FROM profiles WHERE id = p_user_id;
  
  IF v_role IN ('SUPER_ADMIN', 'DISTRICT_ADMIN') THEN
    RETURN true;
  ELSIF v_role = 'SELECTOR' THEN
    -- A selector is authorized for a player if the player is eligible for ANY of the selector's assigned processes
    SELECT EXISTS (
      SELECT 1 
      FROM selector_assignments sa
      JOIN get_eligible_players_for_process(sa.selection_process_id) ep ON ep.player_id = p_player_id
      WHERE sa.selector_id = p_user_id
    ) INTO v_authorized;
    
    RETURN COALESCE(v_authorized, false);
  ELSE
    RETURN true;
  END IF;
END;
$$;

-- ============================================================
-- 5. CREATE ELIGIBILITY RPC
-- ============================================================
-- This function returns a table of eligible player IDs for a given selection process.
-- Note: Replace the age-cutoff logic with JDCA's specific exact rule when known. 
-- For now, it matches age_category_id and district requirements.
CREATE OR REPLACE FUNCTION get_eligible_players_for_process(p_process_id uuid)
RETURNS TABLE (player_id uuid)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_age_category_id uuid;
  v_gender gender_category;
  v_district_id uuid;
BEGIN
  SELECT age_category_id, gender, district_id 
  INTO v_age_category_id, v_gender, v_district_id
  FROM selection_processes WHERE id = p_process_id;

  RETURN QUERY
  SELECT pr.player_id
  FROM player_registrations pr
  JOIN players p ON p.id = pr.player_id
  WHERE pr.age_category_id = v_age_category_id
    AND pr.registration_status = 'ACTIVE'
    -- If process has a district restriction, enforce it, otherwise allow all districts
    AND (v_district_id IS NULL OR pr.district_id = v_district_id)
    -- If process is gender specific, match it.
    AND (p.gender IS NULL OR p.gender = v_gender);
END;
$$;

-- ============================================================
-- 6. UPDATE RLS POLICIES FOR SELECTION TABLES
-- ============================================================

-- Selection Processes
DROP POLICY IF EXISTS selection_process_read ON selection_processes;
CREATE POLICY selection_process_read ON selection_processes
FOR SELECT USING (
  current_app_role() = 'SUPER_ADMIN'
  OR (current_app_role() = 'SELECTOR' AND EXISTS (SELECT 1 FROM selector_assignments sa WHERE sa.selection_process_id = id AND sa.selector_id = auth.uid()))
  OR (current_app_role() = 'DISTRICT_ADMIN' AND district_id = current_district_id())
);

DROP POLICY IF EXISTS selection_process_write ON selection_processes;
CREATE POLICY selection_process_write ON selection_processes
FOR ALL USING (
  current_app_role() = 'SUPER_ADMIN'
  OR (current_app_role() = 'SELECTOR' AND EXISTS (SELECT 1 FROM selector_assignments sa WHERE sa.selection_process_id = id AND sa.selector_id = auth.uid() AND status IN ('DRAFT', 'IN_PROGRESS')))
  OR (current_app_role() = 'DISTRICT_ADMIN' AND district_id = current_district_id())
);

-- Selection Candidates
DROP POLICY IF EXISTS selection_candidates_read ON selection_candidates;
CREATE POLICY selection_candidates_read ON selection_candidates
FOR SELECT USING (
  current_app_role() = 'SUPER_ADMIN'
  OR (current_app_role() = 'SELECTOR' AND EXISTS (SELECT 1 FROM selector_assignments sa WHERE sa.selection_process_id = selection_candidates.selection_process_id AND sa.selector_id = auth.uid()))
  OR (current_app_role() = 'DISTRICT_ADMIN' AND EXISTS (SELECT 1 FROM selection_processes sp WHERE sp.id = selection_candidates.selection_process_id AND sp.district_id = current_district_id()))
);

DROP POLICY IF EXISTS selection_candidates_write ON selection_candidates;
CREATE POLICY selection_candidates_write ON selection_candidates
FOR ALL USING (
  current_app_role() = 'SUPER_ADMIN'
  OR (current_app_role() = 'SELECTOR' AND EXISTS (SELECT 1 FROM selector_assignments sa JOIN selection_processes sp ON sp.id = sa.selection_process_id WHERE sa.selection_process_id = selection_candidates.selection_process_id AND sa.selector_id = auth.uid() AND sp.status IN ('DRAFT', 'IN_PROGRESS')))
);

-- Selection Decisions
DROP POLICY IF EXISTS decisions_read ON selection_decisions;
CREATE POLICY decisions_read ON selection_decisions
FOR SELECT USING (
  current_app_role() = 'SUPER_ADMIN'
  OR (current_app_role() = 'SELECTOR' AND EXISTS (SELECT 1 FROM selector_assignments sa WHERE sa.selection_process_id = selection_decisions.selection_process_id AND sa.selector_id = auth.uid()))
);

DROP POLICY IF EXISTS decisions_write ON selection_decisions;
CREATE POLICY decisions_write ON selection_decisions
FOR ALL USING (
  current_app_role() = 'SUPER_ADMIN'
  OR (current_app_role() = 'SELECTOR' AND decided_by = auth.uid() AND EXISTS (SELECT 1 FROM selector_assignments sa JOIN selection_processes sp ON sp.id = sa.selection_process_id WHERE sa.selection_process_id = selection_decisions.selection_process_id AND sa.selector_id = auth.uid() AND sp.status IN ('DRAFT', 'IN_PROGRESS')))
);

-- Player Evaluations
DROP POLICY IF EXISTS evaluations_read ON player_evaluations;
CREATE POLICY evaluations_read ON player_evaluations
FOR SELECT USING (
  current_app_role() = 'SUPER_ADMIN'
  OR (current_app_role() = 'SELECTOR' AND EXISTS (SELECT 1 FROM selector_assignments sa WHERE sa.selection_process_id = player_evaluations.selection_process_id AND sa.selector_id = auth.uid()))
);

DROP POLICY IF EXISTS evaluations_write ON player_evaluations;
CREATE POLICY evaluations_write ON player_evaluations
FOR ALL USING (
  current_app_role() = 'SUPER_ADMIN'
  OR (current_app_role() = 'SELECTOR' AND evaluator_id = auth.uid() AND EXISTS (SELECT 1 FROM selector_assignments sa JOIN selection_processes sp ON sp.id = sa.selection_process_id WHERE sa.selection_process_id = player_evaluations.selection_process_id AND sa.selector_id = auth.uid() AND sp.status IN ('DRAFT', 'IN_PROGRESS')))
);
