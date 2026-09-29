-- 10_age_category_tracking.sql
-- Migration to enforce age category constraints and preserve historical performance categories.
-- Wrapped in an atomic transaction for safety.

BEGIN;

-- 1. Add age_cutoff_date to tournaments
ALTER TABLE public.tournaments
ADD COLUMN IF NOT EXISTS age_cutoff_date DATE;

-- 2. Add age_category_id to matches
ALTER TABLE public.matches
ADD COLUMN IF NOT EXISTS age_category_id UUID REFERENCES public.age_categories(id) ON DELETE RESTRICT;

-- 3. Backfill existing matches with conflict resolution
-- RULE: The Tournament category always wins. If a U13 team "plays up" in a U16 tournament, 
-- the competition level is U16, so the match and resulting statistics must be classified as U16.
UPDATE public.matches m
SET age_category_id = COALESCE(
    (SELECT age_category_id FROM public.tournaments t WHERE t.id = m.tournament_id),
    (SELECT age_category_id FROM public.teams tm WHERE tm.id = m.home_team_id)
)
WHERE m.age_category_id IS NULL;

-- 4. Reset views safely within the transaction
-- We use CASCADE here safely because we immediately recreate all known dependent views 
-- within the same atomic transaction. If anything fails, it rolls back.
DROP VIEW IF EXISTS public.v_player_match_batting CASCADE;
DROP VIEW IF EXISTS public.v_player_match_bowling CASCADE;
DROP VIEW IF EXISTS public.v_player_match_fielding CASCADE;

CREATE OR REPLACE VIEW public.v_player_match_batting AS
SELECT
  d.match_id,
  d.innings_id,
  d.striker_id AS player_id,
  SUM(d.runs_off_bat)::bigint AS runs_scored,
  COUNT(*) FILTER (WHERE d.extra_type <> 'WIDE')::bigint AS balls_faced,
  COUNT(*) FILTER (WHERE d.runs_off_bat = 4)::bigint AS fours,
  COUNT(*) FILTER (WHERE d.runs_off_bat = 6)::bigint AS sixes,
  MAX(
    CASE
      WHEN d.wicket_type <> 'NONE'
       AND d.dismissed_player_id = d.striker_id
      THEN 1 ELSE 0
    END
  )::integer AS is_dismissed,
  m.age_category_id
FROM public.deliveries d
JOIN public.matches m ON d.match_id = m.id
WHERE d.striker_id IS NOT NULL
GROUP BY d.match_id, d.innings_id, d.striker_id, m.age_category_id;

CREATE OR REPLACE VIEW public.v_player_match_bowling AS
SELECT
  d.match_id,
  d.innings_id,
  d.bowler_id AS player_id,
  COUNT(*) FILTER (
    WHERE d.extra_type NOT IN ('WIDE','NO_BALL')
  )::bigint AS legal_balls,
  SUM(
    CASE
      WHEN d.extra_type IN ('BYE','LEG_BYE','PENALTY')
      THEN 0
      ELSE d.runs_total
    END
  )::bigint AS runs_conceded,
  COUNT(*) FILTER (
    WHERE d.wicket_type IN
      ('BOWLED','CAUGHT','CAUGHT_BEHIND','STUMPED','LBW','HIT_WICKET')
  )::bigint AS wickets,
  COUNT(*) FILTER (
    WHERE d.runs_total = 0
      AND d.extra_type = 'NONE'
  )::bigint AS dot_balls,
  m.age_category_id
FROM public.deliveries d
JOIN public.matches m ON d.match_id = m.id
WHERE d.bowler_id IS NOT NULL
GROUP BY d.match_id, d.innings_id, d.bowler_id, m.age_category_id;

CREATE OR REPLACE VIEW public.v_player_match_fielding AS
SELECT
  d.match_id,
  COALESCE(d.fielder_id, d.wicketkeeper_id) AS player_id,
  COUNT(*) FILTER (
    WHERE d.wicket_type = 'CAUGHT'
      AND d.fielder_id IS NOT NULL
  )::bigint AS catches,
  COUNT(*) FILTER (
    WHERE d.wicket_type = 'CAUGHT_BEHIND'
      AND d.wicketkeeper_id IS NOT NULL
  )::bigint AS catches_behind,
  COUNT(*) FILTER (
    WHERE d.wicket_type = 'RUN_OUT'
      AND d.fielder_id IS NOT NULL
  )::bigint AS run_outs,
  COUNT(*) FILTER (
    WHERE d.wicket_type = 'STUMPED'
      AND d.wicketkeeper_id IS NOT NULL
  )::bigint AS stumpings,
  m.age_category_id
FROM public.deliveries d
JOIN public.matches m ON d.match_id = m.id
WHERE d.fielder_id IS NOT NULL
   OR d.wicketkeeper_id IS NOT NULL
GROUP BY d.match_id, COALESCE(d.fielder_id, d.wicketkeeper_id), m.age_category_id;


-- 5. Recreate ALL core dependent views
CREATE OR REPLACE VIEW public.v_player_career_batting AS
SELECT
  player_id,
  count(distinct match_id)::bigint as total_matches,
  sum(runs_scored)::bigint as career_runs,
  sum(balls_faced)::bigint as career_balls,
  max(runs_scored)::bigint as highest_score,
  sum(fours)::bigint as total_fours,
  sum(sixes)::bigint as total_sixes,
  count(*) filter (where runs_scored >= 50 and runs_scored < 100)::bigint as fifties,
  count(*) filter (where runs_scored >= 100)::bigint as hundreds,
  round(
    case
      when sum(balls_faced) = 0 then 0
      else sum(runs_scored)::numeric * 100 / sum(balls_faced)
    end, 2
  ) as strike_rate,
  round(
    case
      when sum(is_dismissed) = 0 then sum(runs_scored)::numeric
      else sum(runs_scored)::numeric / sum(is_dismissed)
    end, 2
  ) as batting_average
FROM public.v_player_match_batting
GROUP BY player_id;

CREATE OR REPLACE VIEW public.v_player_career_bowling AS
SELECT
  player_id,
  count(distinct match_id)::bigint as total_matches,
  sum(legal_balls)::bigint as legal_balls,
  sum(runs_conceded)::bigint as runs_conceded,
  sum(wickets)::bigint as wickets,
  sum(dot_balls)::bigint as dot_balls,
  round(
    case
      when sum(legal_balls) = 0 then 0
      else sum(runs_conceded)::numeric * 6 / sum(legal_balls)
    end, 2
  ) as economy
FROM public.v_player_match_bowling
GROUP BY player_id;

CREATE OR REPLACE VIEW public.v_player_career_fielding AS
SELECT
  player_id,
  sum(catches)::bigint as catches,
  sum(catches_behind)::bigint as catches_behind,
  sum(run_outs)::bigint as run_outs,
  sum(stumpings)::bigint as stumpings
FROM public.v_player_match_fielding
GROUP BY player_id;

CREATE OR REPLACE VIEW public.v_player_tournament_batting AS
SELECT
  m.tournament_id,
  b.player_id,
  count(distinct b.match_id)::bigint as matches_played,
  sum(b.runs_scored)::bigint as total_runs,
  sum(b.balls_faced)::bigint as total_balls,
  max(b.runs_scored)::bigint as highest_score,
  sum(b.fours)::bigint as fours,
  sum(b.sixes)::bigint as sixes,
  round(
    case
      when sum(b.balls_faced) = 0 then 0
      else sum(b.runs_scored)::numeric * 100 / sum(b.balls_faced)
    end, 2
  ) as strike_rate,
  round(
    case
      when sum(b.is_dismissed) = 0 then sum(b.runs_scored)::numeric
      else sum(b.runs_scored)::numeric / sum(b.is_dismissed)
    end, 2
  ) as batting_average
FROM public.v_player_match_batting b
JOIN public.matches m ON m.id = b.match_id
WHERE m.tournament_id IS NOT NULL
GROUP BY m.tournament_id, b.player_id;

CREATE OR REPLACE VIEW public.v_player_tournament_bowling AS
SELECT
  m.tournament_id,
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
FROM public.v_player_match_bowling b
JOIN public.matches m ON m.id = b.match_id
WHERE m.tournament_id IS NOT NULL
GROUP BY m.tournament_id, b.player_id;

CREATE OR REPLACE VIEW public.v_player_season_batting AS
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
FROM public.v_player_match_batting b
JOIN public.matches m ON m.id = b.match_id
WHERE m.season_id IS NOT NULL
GROUP BY m.season_id, b.player_id;

CREATE OR REPLACE VIEW public.v_player_season_bowling AS
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
FROM public.v_player_match_bowling b
JOIN public.matches m ON m.id = b.match_id
WHERE m.season_id IS NOT NULL
GROUP BY m.season_id, b.player_id;


-- 6. Create NEW category-specific views so frontend can filter stats without breaking global career stats
CREATE OR REPLACE VIEW public.v_player_category_batting AS
SELECT
  player_id,
  age_category_id,
  count(distinct match_id)::bigint as matches_played,
  sum(runs_scored)::bigint as total_runs,
  sum(balls_faced)::bigint as total_balls,
  max(runs_scored)::bigint as highest_score,
  sum(fours)::bigint as fours,
  sum(sixes)::bigint as sixes,
  round(
    case
      when sum(balls_faced) = 0 then 0
      else sum(runs_scored)::numeric * 100 / sum(balls_faced)
    end, 2
  ) as strike_rate,
  round(
    case
      when sum(is_dismissed) = 0 then sum(runs_scored)::numeric
      else sum(runs_scored)::numeric / sum(is_dismissed)
    end, 2
  ) as batting_average
FROM public.v_player_match_batting
WHERE age_category_id IS NOT NULL
GROUP BY player_id, age_category_id;

CREATE OR REPLACE VIEW public.v_player_category_bowling AS
SELECT
  player_id,
  age_category_id,
  count(distinct match_id)::bigint as matches_bowled,
  sum(legal_balls)::bigint as legal_balls,
  sum(runs_conceded)::bigint as runs_conceded,
  sum(wickets)::bigint as wickets,
  sum(dot_balls)::bigint as dot_balls,
  round(
    case
      when sum(legal_balls) = 0 then 0
      else sum(runs_conceded)::numeric * 6 / sum(legal_balls)
    end, 2
  ) as economy
FROM public.v_player_match_bowling
WHERE age_category_id IS NOT NULL
GROUP BY player_id, age_category_id;

CREATE OR REPLACE VIEW public.v_player_category_fielding AS
SELECT
  player_id,
  age_category_id,
  sum(catches)::bigint as catches,
  sum(catches_behind)::bigint as catches_behind,
  sum(run_outs)::bigint as run_outs,
  sum(stumpings)::bigint as stumpings
FROM public.v_player_match_fielding
WHERE age_category_id IS NOT NULL
GROUP BY player_id, age_category_id;

COMMIT;
