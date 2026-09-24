-- ============================================================
-- 03_season_management_architecture.sql
-- JDCA CLEAN SEASON MANAGEMENT ARCHITECTURE
-- ============================================================

BEGIN;

-- 1. SEASONS TABLE
CREATE TABLE IF NOT EXISTS seasons (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name varchar(40) NOT NULL UNIQUE,       -- e.g., '2024-25', '2025-26', '2026-27'
  start_date date NOT NULL,
  end_date date NOT NULL,
  is_current_active boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT season_dates_valid CHECK (end_date >= start_date)
);

-- Enforce exactly one active season at any time
CREATE UNIQUE INDEX IF NOT EXISTS idx_single_active_season 
  ON seasons (is_current_active) 
  WHERE is_current_active = true;

-- Seed standard JDCA seasons if table is empty
INSERT INTO seasons (name, start_date, end_date, is_current_active)
SELECT '2024-25', '2024-09-01'::date, '2025-05-31'::date, false
WHERE NOT EXISTS (SELECT 1 FROM seasons WHERE name = '2024-25');

INSERT INTO seasons (name, start_date, end_date, is_current_active)
SELECT '2025-26', '2025-09-01'::date, '2026-05-31'::date, true
WHERE NOT EXISTS (SELECT 1 FROM seasons WHERE name = '2025-26');

INSERT INTO seasons (name, start_date, end_date, is_current_active)
SELECT '2026-27', '2026-09-01'::date, '2027-05-31'::date, false
WHERE NOT EXISTS (SELECT 1 FROM seasons WHERE name = '2026-27');

-- 2. LINK SEASONS TO EXISTING TABLES

-- A. Player Registrations (Season-specific participation & age category)
ALTER TABLE player_registrations 
  ADD COLUMN IF NOT EXISTS season_id uuid REFERENCES seasons(id) ON DELETE CASCADE,
  ADD COLUMN IF NOT EXISTS age_category_id uuid REFERENCES age_categories(id) ON DELETE RESTRICT,
  ADD COLUMN IF NOT EXISTS jersey_number integer;

-- Backfill season_id for any existing registrations based on name match or default active
UPDATE player_registrations pr
SET season_id = s.id
FROM seasons s
WHERE pr.season_id IS NULL AND (s.name = pr.season OR s.is_current_active = true);

-- Add unique constraint on (player_id, season_id)
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'player_registrations_player_season_unique'
  ) THEN
    ALTER TABLE player_registrations ADD CONSTRAINT player_registrations_player_season_unique UNIQUE(player_id, season_id);
  END IF;
END $$;

-- B. Teams
ALTER TABLE teams
  ADD COLUMN IF NOT EXISTS season_id uuid REFERENCES seasons(id) ON DELETE SET NULL;

UPDATE teams t
SET season_id = s.id
FROM seasons s
WHERE t.season_id IS NULL AND (s.name = t.season OR s.is_current_active = true);

-- C. Tournaments
ALTER TABLE tournaments
  ADD COLUMN IF NOT EXISTS season_id uuid REFERENCES seasons(id) ON DELETE CASCADE;

UPDATE tournaments t
SET season_id = s.id
FROM seasons s
WHERE t.season_id IS NULL AND (s.name = t.season OR s.is_current_active = true);

-- D. Matches
ALTER TABLE matches
  ADD COLUMN IF NOT EXISTS season_id uuid REFERENCES seasons(id) ON DELETE SET NULL;

-- Automatically backfill match season from its tournament, or fallback to active season
UPDATE matches m
SET season_id = COALESCE(t.season_id, (SELECT id FROM seasons WHERE is_current_active = true LIMIT 1))
FROM tournaments t
WHERE m.tournament_id = t.id AND m.season_id IS NULL;

-- E. Selection Processes
ALTER TABLE selection_processes
  ADD COLUMN IF NOT EXISTS season_id uuid REFERENCES seasons(id) ON DELETE CASCADE;

UPDATE selection_processes sp
SET season_id = s.id
FROM seasons s
WHERE sp.season_id IS NULL AND (s.name = sp.season OR s.is_current_active = true);

-- 3. HELPER FUNCTIONS & RPCS

-- Set active season transactionally
CREATE OR REPLACE FUNCTION set_active_season(p_season_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM seasons WHERE id = p_season_id) THEN
    RAISE EXCEPTION 'Season not found';
  END IF;

  UPDATE seasons SET is_current_active = false WHERE is_current_active = true;
  UPDATE seasons SET is_current_active = true WHERE id = p_season_id;
END;
$$;

-- Get current active season
CREATE OR REPLACE FUNCTION get_active_season()
RETURNS seasons
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT * FROM seasons WHERE is_current_active = true LIMIT 1;
$$;

-- Refined Eligibility RPC taking season into account
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
  v_season_id uuid;
BEGIN
  SELECT age_category_id, gender, district_id, season_id
  INTO v_age_category_id, v_gender, v_district_id, v_season_id
  FROM selection_processes WHERE id = p_process_id;

  -- Default to active season if process has no season_id set
  IF v_season_id IS NULL THEN
    SELECT id INTO v_season_id FROM seasons WHERE is_current_active = true LIMIT 1;
  END IF;

  RETURN QUERY
  SELECT pr.player_id
  FROM player_registrations pr
  JOIN players p ON p.id = pr.player_id
  WHERE (pr.season_id = v_season_id OR pr.season_id IS NULL)
    AND pr.age_category_id = v_age_category_id
    AND pr.registration_status = 'ACTIVE'
    AND (v_district_id IS NULL OR pr.district_id = v_district_id)
    AND (p.gender IS NULL OR p.gender = v_gender);
END;
$$;

-- 4. PERFORMANCE VIEWS (CAREER, SEASON, RECENT FORM)

-- A. Season Batting
CREATE OR REPLACE VIEW v_player_season_batting AS
SELECT
  coalesce(m.season_id, t.season_id) AS season_id,
  d.striker_id AS player_id,
  count(distinct d.match_id)::bigint AS matches_played,
  count(distinct d.innings_id)::bigint AS innings_batted,
  sum(d.runs_off_bat)::bigint AS total_runs,
  count(*) filter (where d.extra_type <> 'WIDE')::bigint AS balls_faced,
  max(b_inn.inn_runs)::bigint AS highest_score,
  sum(d.runs_off_bat) filter (where d.runs_off_bat = 4)::bigint / 4 AS fours,
  sum(d.runs_off_bat) filter (where d.runs_off_bat = 6)::bigint / 6 AS sixes,
  round(
    case
      when count(*) filter (where d.extra_type <> 'WIDE') = 0 then 0
      else sum(d.runs_off_bat)::numeric * 100 / count(*) filter (where d.extra_type <> 'WIDE')
    end, 2
  ) AS strike_rate,
  round(
    case
      when count(distinct d.innings_id) filter (where d.wicket_type <> 'NONE' and d.dismissed_player_id = d.striker_id) = 0 
      then sum(d.runs_off_bat)::numeric
      else sum(d.runs_off_bat)::numeric / count(distinct d.innings_id) filter (where d.wicket_type <> 'NONE' and d.dismissed_player_id = d.striker_id)
    end, 2
  ) AS batting_average
FROM deliveries d
JOIN matches m ON m.id = d.match_id
LEFT JOIN tournaments t ON t.id = m.tournament_id
LEFT JOIN LATERAL (
  SELECT sum(d2.runs_off_bat) AS inn_runs
  FROM deliveries d2
  WHERE d2.innings_id = d.innings_id AND d2.striker_id = d.striker_id
) b_inn ON true
WHERE d.striker_id IS NOT NULL
GROUP BY coalesce(m.season_id, t.season_id), d.striker_id;

-- B. Season Bowling
CREATE OR REPLACE VIEW v_player_season_bowling AS
SELECT
  coalesce(m.season_id, t.season_id) AS season_id,
  d.bowler_id AS player_id,
  count(distinct d.match_id)::bigint AS matches_played,
  count(*) filter (where d.extra_type not in ('WIDE','NO_BALL'))::bigint AS legal_balls,
  sum(case when d.extra_type in ('BYE','LEG_BYE','PENALTY') then 0 else d.runs_total end)::bigint AS runs_conceded,
  count(*) filter (where d.wicket_type in ('BOWLED','CAUGHT','CAUGHT_BEHIND','STUMPED','LBW','HIT_WICKET'))::bigint AS wickets,
  count(*) filter (where d.runs_total = 0 and d.extra_type = 'NONE')::bigint AS dot_balls,
  round(
    case
      when count(*) filter (where d.extra_type not in ('WIDE','NO_BALL')) = 0 then 0
      else sum(case when d.extra_type in ('BYE','LEG_BYE','PENALTY') then 0 else d.runs_total end)::numeric * 6 / count(*) filter (where d.extra_type not in ('WIDE','NO_BALL'))
    end, 2
  ) AS economy
FROM deliveries d
JOIN matches m ON m.id = d.match_id
LEFT JOIN tournaments t ON t.id = m.tournament_id
WHERE d.bowler_id IS NOT NULL
GROUP BY coalesce(m.season_id, t.season_id), d.bowler_id;

-- C. Recent Form (Last 5 matches for any player)
CREATE OR REPLACE VIEW v_player_recent_form_batting AS
WITH ranked_matches AS (
  SELECT 
    d.striker_id AS player_id,
    d.match_id,
    m.scheduled_at,
    sum(d.runs_off_bat)::bigint AS runs_scored,
    count(*) filter (where d.extra_type <> 'WIDE')::bigint AS balls_faced,
    max(case when d.wicket_type <> 'NONE' and d.dismissed_player_id = d.striker_id then 1 else 0 end) AS is_dismissed,
    DENSE_RANK() OVER (PARTITION BY d.striker_id ORDER BY m.scheduled_at DESC NULLS LAST, m.created_at DESC) AS match_rank
  FROM deliveries d
  JOIN matches m ON m.id = d.match_id
  WHERE d.striker_id IS NOT NULL AND m.status = 'COMPLETED'
  GROUP BY d.striker_id, d.match_id, m.scheduled_at, m.created_at
)
SELECT
  player_id,
  count(*)::bigint AS matches_count,
  sum(runs_scored)::bigint AS recent_runs,
  sum(balls_faced)::bigint AS recent_balls,
  round(
    case 
      when sum(balls_faced) = 0 then 0 
      else sum(runs_scored)::numeric * 100 / sum(balls_faced) 
    end, 2
  ) AS recent_strike_rate,
  round(
    case 
      when sum(is_dismissed) = 0 then sum(runs_scored)::numeric 
      else sum(runs_scored)::numeric / sum(is_dismissed) 
    end, 2
  ) AS recent_average
FROM ranked_matches
WHERE match_rank <= 5
GROUP BY player_id;

-- 5. RLS POLICIES FOR SEASONS
ALTER TABLE seasons ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS seasons_public_read ON seasons;
CREATE POLICY seasons_public_read ON seasons
FOR SELECT USING (true);

DROP POLICY IF EXISTS seasons_admin_write ON seasons;
CREATE POLICY seasons_admin_write ON seasons
FOR ALL USING (is_admin()) WITH CHECK (is_admin());

COMMIT;
-- ============================================================
-- 5. SEASON-LEVEL STATISTICAL VIEWS
-- ============================================================

DROP VIEW IF EXISTS v_player_season_batting CASCADE;
CREATE OR REPLACE VIEW v_player_season_batting AS
SELECT
  m.season_id,
  b.player_id,
  count(distinct b.match_id)::bigint as matches_batted,
  sum(b.runs_scored)::bigint as runs_scored,
  sum(b.balls_faced)::bigint as balls_faced,
  sum(b.fours)::bigint as fours,
  sum(b.sixes)::bigint as sixes,
  sum(b.is_dismissed)::bigint as times_dismissed,
  max(b.runs_scored)::bigint as highest_score,
  round(
    case
      when sum(b.is_dismissed) = 0 then sum(b.runs_scored)
      else sum(b.runs_scored)::numeric / sum(b.is_dismissed)
    end, 2
  ) as average,
  round(
    case
      when sum(b.balls_faced) = 0 then 0
      else sum(b.runs_scored)::numeric * 100 / sum(b.balls_faced)
    end, 2
  ) as strike_rate
FROM v_player_match_batting b
JOIN matches m ON m.id = b.match_id
WHERE m.season_id IS NOT NULL
GROUP BY m.season_id, b.player_id;

DROP VIEW IF EXISTS v_player_season_bowling CASCADE;
CREATE OR REPLACE VIEW v_player_season_bowling AS
SELECT
  m.season_id,
  b.player_id,
  count(distinct b.match_id)::bigint as matches_bowled,
  sum(b.legal_balls)::bigint as legal_balls,
  sum(b.runs_conceded)::bigint as runs_conceded,
  sum(b.wickets)::bigint as wickets,
  sum(b.dot_balls)::bigint as dot_balls,
  round(
    case
      when sum(b.legal_balls) = 0 then 0
      else sum(b.runs_conceded)::numeric * 6 / sum(b.legal_balls)
    end, 2
  ) as economy
FROM v_player_match_bowling b
JOIN matches m ON m.id = b.match_id
WHERE m.season_id IS NOT NULL
GROUP BY m.season_id, b.player_id;
