-- ============================================================
-- SELECTOR AGE CATEGORY ASSIGNMENT
-- Assigns each selector a maximum age category level.
-- Selectors can view/manage players at or below their assigned level.
-- e.g. U-23 selector (rank 5) can see U-19, U-17, U-15, U-13 players
-- but U-19 selector (rank 4) cannot see U-23 players.
-- ============================================================

-- 1. Add selector_age_category_id to profiles
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS selector_age_category_id uuid REFERENCES age_categories(id) ON DELETE SET NULL;

-- 2. Function to check if a selector can view a given age category
CREATE OR REPLACE FUNCTION selector_can_view_category(
  p_selector_id uuid,
  p_target_category_id uuid
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_role app_role;
  v_selector_max_rank integer;
  v_target_rank integer;
BEGIN
  SELECT role INTO v_role FROM profiles WHERE id = p_selector_id;

  -- Admins can see everything
  IF v_role IN ('SUPER_ADMIN', 'DISTRICT_ADMIN') THEN
    RETURN true;
  END IF;

  -- Get selector's assigned max rank level
  SELECT ac.rank_level INTO v_selector_max_rank
  FROM profiles p
  JOIN age_categories ac ON ac.id = p.selector_age_category_id
  WHERE p.id = p_selector_id;

  -- If no age category assigned, deny access
  IF v_selector_max_rank IS NULL THEN
    RETURN false;
  END IF;

  -- Get target category rank
  SELECT rank_level INTO v_target_rank
  FROM age_categories WHERE id = p_target_category_id;

  IF v_target_rank IS NULL THEN
    RETURN false;
  END IF;

  -- Selector can view categories at or below their assigned level
  RETURN v_target_rank <= v_selector_max_rank;
END;
$$;

-- 3. Function to get selector's max age category info
CREATE OR REPLACE FUNCTION get_selector_age_scope(p_selector_id uuid)
RETURNS TABLE (
  age_category_id uuid,
  category_name text,
  short_name text,
  max_rank_level integer
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT
    ac.id,
    ac.name::text,
    ac.short_name::text,
    ac.rank_level
  FROM profiles p
  JOIN age_categories ac ON ac.id = p.selector_age_category_id
  WHERE p.id = p_selector_id;
END;
$$;
