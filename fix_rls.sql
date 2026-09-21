-- Comprehensive RLS Policies for JDCA
-- This script replaces the temporary "DISABLE ROW LEVEL SECURITY" bypass.

-- 1. Create Helper Functions (Security Definer avoids recursive RLS checks on profiles)
CREATE OR REPLACE FUNCTION get_user_role()
RETURNS app_role
LANGUAGE sql SECURITY DEFINER
AS $$
  SELECT role FROM public.profiles WHERE id = auth.uid();
$$;

CREATE OR REPLACE FUNCTION get_user_district()
RETURNS uuid
LANGUAGE sql SECURITY DEFINER
AS $$
  SELECT district_id FROM public.profiles WHERE id = auth.uid();
$$;

-- 2. Tournaments
ALTER TABLE tournaments ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Anyone can view tournaments" ON tournaments;
DROP POLICY IF EXISTS "Super and District admins can insert tournaments" ON tournaments;
DROP POLICY IF EXISTS "Super and District admins can update tournaments" ON tournaments;
DROP POLICY IF EXISTS "Super admins can delete tournaments" ON tournaments;

CREATE POLICY "Anyone can view tournaments" ON tournaments FOR SELECT USING (true);
CREATE POLICY "Super and District admins can insert tournaments" ON tournaments FOR INSERT WITH CHECK (get_user_role() IN ('SUPER_ADMIN', 'DISTRICT_ADMIN'));
CREATE POLICY "Super and District admins can update tournaments" ON tournaments FOR UPDATE USING (get_user_role() IN ('SUPER_ADMIN', 'DISTRICT_ADMIN'));
CREATE POLICY "Super admins can delete tournaments" ON tournaments FOR DELETE USING (get_user_role() = 'SUPER_ADMIN');

-- 3. Matches
ALTER TABLE matches ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Anyone can view matches" ON matches;
DROP POLICY IF EXISTS "Admins can insert matches" ON matches;
DROP POLICY IF EXISTS "Admins and Scorers can update matches" ON matches;
DROP POLICY IF EXISTS "Super admins can delete matches" ON matches;

CREATE POLICY "Anyone can view matches" ON matches FOR SELECT USING (true);
CREATE POLICY "Admins can insert matches" ON matches FOR INSERT WITH CHECK (get_user_role() IN ('SUPER_ADMIN', 'DISTRICT_ADMIN'));
CREATE POLICY "Admins and Scorers can update matches" ON matches FOR UPDATE USING (get_user_role() IN ('SUPER_ADMIN', 'DISTRICT_ADMIN', 'SCORER'));
CREATE POLICY "Super admins can delete matches" ON matches FOR DELETE USING (get_user_role() = 'SUPER_ADMIN');

-- 4. Teams
ALTER TABLE teams ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Anyone can view teams" ON teams;
DROP POLICY IF EXISTS "Admins and Selectors can insert teams" ON teams;
DROP POLICY IF EXISTS "Admins and Selectors can update teams" ON teams;
DROP POLICY IF EXISTS "Super admins can delete teams" ON teams;

CREATE POLICY "Anyone can view teams" ON teams FOR SELECT USING (true);
CREATE POLICY "Admins and Selectors can insert teams" ON teams FOR INSERT WITH CHECK (get_user_role() IN ('SUPER_ADMIN', 'DISTRICT_ADMIN', 'SELECTOR'));
CREATE POLICY "Admins and Selectors can update teams" ON teams FOR UPDATE USING (get_user_role() IN ('SUPER_ADMIN', 'DISTRICT_ADMIN', 'SELECTOR'));
CREATE POLICY "Super admins can delete teams" ON teams FOR DELETE USING (get_user_role() = 'SUPER_ADMIN');

-- 5. Players
ALTER TABLE players ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Anyone can view players" ON players;
DROP POLICY IF EXISTS "Anyone can insert players (registration)" ON players;
DROP POLICY IF EXISTS "Admins and Selectors can update players" ON players;
DROP POLICY IF EXISTS "Super admins can delete players" ON players;

CREATE POLICY "Anyone can view players" ON players FOR SELECT USING (true);
CREATE POLICY "Anyone can insert players (registration)" ON players FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins and Selectors can update players" ON players FOR UPDATE USING (get_user_role() IN ('SUPER_ADMIN', 'DISTRICT_ADMIN', 'SELECTOR'));
CREATE POLICY "Super admins can delete players" ON players FOR DELETE USING (get_user_role() = 'SUPER_ADMIN');

-- 6. Deliveries
ALTER TABLE deliveries ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Anyone can view deliveries" ON deliveries;
DROP POLICY IF EXISTS "Scorers and Admins can insert deliveries" ON deliveries;
DROP POLICY IF EXISTS "Scorers and Admins can update deliveries" ON deliveries;
DROP POLICY IF EXISTS "Scorers and Admins can delete deliveries" ON deliveries;

CREATE POLICY "Anyone can view deliveries" ON deliveries FOR SELECT USING (true);
CREATE POLICY "Scorers and Admins can insert deliveries" ON deliveries FOR INSERT WITH CHECK (get_user_role() IN ('SCORER', 'SUPER_ADMIN', 'DISTRICT_ADMIN'));
CREATE POLICY "Scorers and Admins can update deliveries" ON deliveries FOR UPDATE USING (get_user_role() IN ('SCORER', 'SUPER_ADMIN', 'DISTRICT_ADMIN'));
CREATE POLICY "Scorers and Admins can delete deliveries" ON deliveries FOR DELETE USING (get_user_role() IN ('SCORER', 'SUPER_ADMIN', 'DISTRICT_ADMIN'));

-- 7. Innings
ALTER TABLE innings ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Anyone can view innings" ON innings;
DROP POLICY IF EXISTS "Scorers and Admins can insert innings" ON innings;
DROP POLICY IF EXISTS "Scorers and Admins can update innings" ON innings;

CREATE POLICY "Anyone can view innings" ON innings FOR SELECT USING (true);
CREATE POLICY "Scorers and Admins can insert innings" ON innings FOR INSERT WITH CHECK (get_user_role() IN ('SCORER', 'SUPER_ADMIN', 'DISTRICT_ADMIN'));
CREATE POLICY "Scorers and Admins can update innings" ON innings FOR UPDATE USING (get_user_role() IN ('SCORER', 'SUPER_ADMIN', 'DISTRICT_ADMIN'));

-- 8. Selection Candidates
ALTER TABLE selection_candidates ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Selectors and Admins can view selection candidates" ON selection_candidates;
DROP POLICY IF EXISTS "Selectors and Admins can insert selection candidates" ON selection_candidates;
DROP POLICY IF EXISTS "Selectors and Admins can update selection candidates" ON selection_candidates;

CREATE POLICY "Selectors and Admins can view selection candidates" ON selection_candidates FOR SELECT USING (get_user_role() IN ('SELECTOR', 'SUPER_ADMIN', 'DISTRICT_ADMIN'));
CREATE POLICY "Selectors and Admins can insert selection candidates" ON selection_candidates FOR INSERT WITH CHECK (get_user_role() IN ('SELECTOR', 'SUPER_ADMIN', 'DISTRICT_ADMIN'));
CREATE POLICY "Selectors and Admins can update selection candidates" ON selection_candidates FOR UPDATE USING (get_user_role() IN ('SELECTOR', 'SUPER_ADMIN', 'DISTRICT_ADMIN'));

-- 9. Selection Processes
ALTER TABLE selection_processes ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Anyone can view selection processes" ON selection_processes;
DROP POLICY IF EXISTS "Selectors and Admins can insert processes" ON selection_processes;
DROP POLICY IF EXISTS "Selectors and Admins can update processes" ON selection_processes;

CREATE POLICY "Anyone can view selection processes" ON selection_processes FOR SELECT USING (true);
CREATE POLICY "Selectors and Admins can insert processes" ON selection_processes FOR INSERT WITH CHECK (get_user_role() IN ('SELECTOR', 'SUPER_ADMIN', 'DISTRICT_ADMIN'));
CREATE POLICY "Selectors and Admins can update processes" ON selection_processes FOR UPDATE USING (get_user_role() IN ('SELECTOR', 'SUPER_ADMIN', 'DISTRICT_ADMIN'));

-- 10. Selection Decisions
ALTER TABLE selection_decisions ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Selectors and Admins can view decisions" ON selection_decisions;
DROP POLICY IF EXISTS "Selectors and Admins can insert decisions" ON selection_decisions;
DROP POLICY IF EXISTS "Selectors and Admins can update decisions" ON selection_decisions;

CREATE POLICY "Selectors and Admins can view decisions" ON selection_decisions FOR SELECT USING (get_user_role() IN ('SELECTOR', 'SUPER_ADMIN', 'DISTRICT_ADMIN'));
CREATE POLICY "Selectors and Admins can insert decisions" ON selection_decisions FOR INSERT WITH CHECK (get_user_role() IN ('SELECTOR', 'SUPER_ADMIN', 'DISTRICT_ADMIN'));
CREATE POLICY "Selectors and Admins can update decisions" ON selection_decisions FOR UPDATE USING (get_user_role() IN ('SELECTOR', 'SUPER_ADMIN', 'DISTRICT_ADMIN'));
