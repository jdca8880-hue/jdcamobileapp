-- 32_authoritative_player_stats.sql
-- ============================================================================
-- SINGLE SOURCE OF TRUTH for all derived player statistics.
--
-- WHY THIS EXISTS
--   The player-stat views drifted across loose SQL files applied by hand:
--     * supabase_schema.sql  — no event_type guard, no soft-delete filter
--     * 10_age_category_tracking.sql — added age_category_id
--     * 15_fix_stats_soft_delete.sql — added deleted_at filter BUT renamed
--        bowling columns (balls_bowled/wickets_taken) and created
--        v_player_stats_summary — and was NEVER fully applied to prod
--        (v_player_stats_summary does not exist in prod).
--     * 20_add_event_type.sql — the definitions that ACTUALLY match prod today
--        (event_type='DELIVERY' guard + age_category_id) but WITHOUT the
--        soft-delete filter, so soft-deleted matches still pollute stats.
--
--   This migration drops the whole derived-stats stack and rebuilds it ONE way,
--   so the app and the database agree exactly. It is the only file that should
--   define these views from now on.
--
-- SEMANTICS (ball-by-ball → match → career → format → tournament)
--   * Only real deliveries count: event_type = 'DELIVERY'
--     (PENALTY / RETIREMENT rows are excluded from every ball/run/wicket count).
--   * Soft-deleted matches are excluded everywhere: matches.deleted_at IS NULL.
--   * balls faced  = legal + no-ball + byes/leg-byes faced, EXCLUDES wides.
--   * bowler legal balls EXCLUDE wides and no-balls.
--   * runs conceded by bowler EXCLUDE byes / leg-byes / penalties.
--   * bowler wickets EXCLUDE run-outs / retirements / obstruction.
--   * maiden over = a completed over (>=6 legal balls) by one bowler in one
--     innings with 0 runs charged to the bowler.
--
-- Column names are chosen to match what src/hooks/useDataSync.js and
-- src/lib/api.js read. Changing a column here means changing those readers too.
--
-- Idempotent: safe to run repeatedly. Run in the Supabase SQL editor.
-- ============================================================================

BEGIN;

-- Drop dependents first, then the base match views with CASCADE to catch any
-- prod-only dependents we don't know about.
drop view if exists v_player_stats_summary cascade;
drop view if exists v_player_format_batting cascade;
drop view if exists v_player_format_bowling cascade;
drop view if exists v_player_tournament_batting cascade;
drop view if exists v_player_tournament_bowling cascade;
drop view if exists v_player_career_batting cascade;
drop view if exists v_player_career_bowling cascade;
drop view if exists v_player_career_fielding cascade;
drop view if exists v_player_match_batting cascade;
drop view if exists v_player_match_bowling cascade;
drop view if exists v_player_match_fielding cascade;

-- ============================================================================
-- MATCH-LEVEL (one row per player per innings)
-- ============================================================================

-- ---- Batting ----
create view v_player_match_batting as
select
  d.match_id,
  d.innings_id,
  d.striker_id as player_id,
  m.match_format,
  m.scheduled_at,
  m.tournament_id,
  m.age_category_id,
  sum(d.runs_off_bat)::bigint as runs_scored,
  count(*) filter (where d.extra_type <> 'WIDE')::bigint as balls_faced,
  count(*) filter (where d.runs_off_bat = 4)::bigint as fours,
  count(*) filter (where d.runs_off_bat = 6)::bigint as sixes,
  max(
    case when d.wicket_type <> 'NONE' and d.dismissed_player_id = d.striker_id
         then 1 else 0 end
  )::integer as is_dismissed
from deliveries d
join matches m on m.id = d.match_id
where d.striker_id is not null
  and d.event_type = 'DELIVERY'
  and m.deleted_at is null
group by d.match_id, d.innings_id, d.striker_id,
         m.match_format, m.scheduled_at, m.tournament_id, m.age_category_id;

-- ---- Bowling (with maidens) ----
create view v_player_match_bowling as
with over_agg as (
  select
    d.match_id, d.innings_id, d.bowler_id, d.over_number,
    count(*) filter (where d.extra_type not in ('WIDE','NO_BALL')) as legal_balls_in_over,
    sum(case when d.extra_type in ('BYE','LEG_BYE','PENALTY') then 0 else d.runs_total end) as runs_in_over
  from deliveries d
  join matches m on m.id = d.match_id
  where d.bowler_id is not null
    and d.event_type = 'DELIVERY'
    and m.deleted_at is null
  group by d.match_id, d.innings_id, d.bowler_id, d.over_number
),
maiden_agg as (
  select match_id, innings_id, bowler_id,
    count(*) filter (where legal_balls_in_over >= 6 and runs_in_over = 0)::bigint as maidens
  from over_agg
  group by match_id, innings_id, bowler_id
)
select
  d.match_id,
  d.innings_id,
  d.bowler_id as player_id,
  m.match_format,
  m.scheduled_at,
  m.tournament_id,
  m.age_category_id,
  count(*) filter (where d.extra_type not in ('WIDE','NO_BALL'))::bigint as legal_balls,
  sum(case when d.extra_type in ('BYE','LEG_BYE','PENALTY') then 0 else d.runs_total end)::bigint as runs_conceded,
  count(*) filter (where d.wicket_type in
    ('BOWLED','CAUGHT','CAUGHT_BEHIND','STUMPED','LBW','HIT_WICKET'))::bigint as wickets,
  count(*) filter (where d.runs_total = 0 and d.extra_type = 'NONE')::bigint as dot_balls,
  count(*) filter (where d.extra_type = 'WIDE')::bigint as wides,
  count(*) filter (where d.extra_type = 'NO_BALL')::bigint as no_balls,
  coalesce(ma.maidens, 0)::bigint as maidens
from deliveries d
join matches m on m.id = d.match_id
left join maiden_agg ma
  on ma.match_id = d.match_id and ma.innings_id = d.innings_id and ma.bowler_id = d.bowler_id
where d.bowler_id is not null
  and d.event_type = 'DELIVERY'
  and m.deleted_at is null
group by d.match_id, d.innings_id, d.bowler_id,
         m.match_format, m.scheduled_at, m.tournament_id, m.age_category_id, ma.maidens;

-- ---- Fielding / wicketkeeping ----
create view v_player_match_fielding as
select
  d.match_id,
  coalesce(d.fielder_id, d.wicketkeeper_id) as player_id,
  m.match_format,
  m.scheduled_at,
  m.tournament_id,
  m.age_category_id,
  count(*) filter (where d.wicket_type = 'CAUGHT' and d.fielder_id is not null)::bigint as catches,
  count(*) filter (where d.wicket_type = 'CAUGHT_BEHIND' and d.wicketkeeper_id is not null)::bigint as catches_behind,
  count(*) filter (where d.wicket_type = 'RUN_OUT' and d.fielder_id is not null)::bigint as run_outs,
  count(*) filter (where d.wicket_type = 'STUMPED' and d.wicketkeeper_id is not null)::bigint as stumpings
from deliveries d
join matches m on m.id = d.match_id
where (d.fielder_id is not null or d.wicketkeeper_id is not null)
  and d.event_type = 'DELIVERY'
  and m.deleted_at is null
group by d.match_id, coalesce(d.fielder_id, d.wicketkeeper_id),
         m.match_format, m.scheduled_at, m.tournament_id, m.age_category_id;

-- ============================================================================
-- CAREER-LEVEL (one row per player)
-- ============================================================================

create view v_player_career_batting as
select
  player_id,
  count(distinct match_id)::bigint as total_matches,
  count(*)::bigint as innings_batted,
  sum(runs_scored)::bigint as career_runs,
  sum(balls_faced)::bigint as career_balls,
  max(runs_scored)::bigint as highest_score,
  sum(fours)::bigint as total_fours,
  sum(sixes)::bigint as total_sixes,
  count(*) filter (where runs_scored >= 50 and runs_scored < 100)::bigint as fifties,
  count(*) filter (where runs_scored >= 100)::bigint as hundreds,
  sum(is_dismissed)::bigint as times_dismissed,
  (count(*) - sum(is_dismissed))::bigint as not_outs,
  round(case when sum(balls_faced) = 0 then 0
             else sum(runs_scored)::numeric * 100 / sum(balls_faced) end, 2) as strike_rate,
  round(case when sum(is_dismissed) = 0 then sum(runs_scored)::numeric
             else sum(runs_scored)::numeric / sum(is_dismissed) end, 2) as batting_average
from v_player_match_batting
group by player_id;

create view v_player_career_bowling as
select
  player_id,
  count(distinct match_id)::bigint as total_matches,
  count(*)::bigint as innings_bowled,
  sum(legal_balls)::bigint as legal_balls,
  sum(runs_conceded)::bigint as runs_conceded,
  sum(wickets)::bigint as wickets,
  sum(dot_balls)::bigint as dot_balls,
  sum(maidens)::bigint as maidens,
  sum(wides)::bigint as wides,
  sum(no_balls)::bigint as no_balls,
  count(*) filter (where wickets >= 5)::bigint as five_wicket_hauls,
  -- Best bowling in an innings: most wickets, then fewest runs.
  (array_agg(wickets order by wickets desc, runs_conceded asc))[1]::bigint as best_wickets,
  (array_agg(runs_conceded order by wickets desc, runs_conceded asc))[1]::bigint as best_runs,
  round(case when sum(legal_balls) = 0 then 0
             else sum(runs_conceded)::numeric * 6 / sum(legal_balls) end, 2) as economy,
  round(case when sum(wickets) = 0 then 0
             else sum(runs_conceded)::numeric / sum(wickets) end, 2) as bowling_average,
  round(case when sum(wickets) = 0 then 0
             else sum(legal_balls)::numeric / sum(wickets) end, 2) as bowling_strike_rate
from v_player_match_bowling
group by player_id;

create view v_player_career_fielding as
select
  player_id,
  sum(catches)::bigint as catches,
  sum(catches_behind)::bigint as catches_behind,
  sum(run_outs)::bigint as run_outs,
  sum(stumpings)::bigint as stumpings,
  (sum(catches) + sum(catches_behind) + sum(run_outs) + sum(stumpings))::bigint as total_dismissals
from v_player_match_fielding
group by player_id;

-- ============================================================================
-- PER-FORMAT CAREER (one row per player per match_format)
-- ============================================================================

create view v_player_format_batting as
select
  player_id,
  match_format,
  count(distinct match_id)::bigint as total_matches,
  count(*)::bigint as innings_batted,
  sum(runs_scored)::bigint as career_runs,
  sum(balls_faced)::bigint as career_balls,
  max(runs_scored)::bigint as highest_score,
  sum(fours)::bigint as total_fours,
  sum(sixes)::bigint as total_sixes,
  count(*) filter (where runs_scored >= 50 and runs_scored < 100)::bigint as fifties,
  count(*) filter (where runs_scored >= 100)::bigint as hundreds,
  sum(is_dismissed)::bigint as times_dismissed,
  (count(*) - sum(is_dismissed))::bigint as not_outs,
  round(case when sum(balls_faced) = 0 then 0
             else sum(runs_scored)::numeric * 100 / sum(balls_faced) end, 2) as strike_rate,
  round(case when sum(is_dismissed) = 0 then sum(runs_scored)::numeric
             else sum(runs_scored)::numeric / sum(is_dismissed) end, 2) as batting_average
from v_player_match_batting
group by player_id, match_format;

create view v_player_format_bowling as
select
  player_id,
  match_format,
  count(distinct match_id)::bigint as total_matches,
  count(*)::bigint as innings_bowled,
  sum(legal_balls)::bigint as legal_balls,
  sum(runs_conceded)::bigint as runs_conceded,
  sum(wickets)::bigint as wickets,
  sum(dot_balls)::bigint as dot_balls,
  sum(maidens)::bigint as maidens,
  count(*) filter (where wickets >= 5)::bigint as five_wicket_hauls,
  (array_agg(wickets order by wickets desc, runs_conceded asc))[1]::bigint as best_wickets,
  (array_agg(runs_conceded order by wickets desc, runs_conceded asc))[1]::bigint as best_runs,
  round(case when sum(legal_balls) = 0 then 0
             else sum(runs_conceded)::numeric * 6 / sum(legal_balls) end, 2) as economy,
  round(case when sum(wickets) = 0 then 0
             else sum(runs_conceded)::numeric / sum(wickets) end, 2) as bowling_average
from v_player_match_bowling
group by player_id, match_format;

-- ============================================================================
-- TOURNAMENT-LEVEL (one row per player per tournament)
-- ============================================================================

create view v_player_tournament_batting as
select
  tournament_id,
  player_id,
  count(distinct match_id)::bigint as matches_played,
  sum(runs_scored)::bigint as total_runs,
  sum(balls_faced)::bigint as total_balls,
  max(runs_scored)::bigint as highest_score,
  sum(fours)::bigint as fours,
  sum(sixes)::bigint as sixes,
  round(case when sum(balls_faced) = 0 then 0
             else sum(runs_scored)::numeric * 100 / sum(balls_faced) end, 2) as strike_rate,
  round(case when sum(is_dismissed) = 0 then sum(runs_scored)::numeric
             else sum(runs_scored)::numeric / sum(is_dismissed) end, 2) as batting_average
from v_player_match_batting
where tournament_id is not null
group by tournament_id, player_id;

create view v_player_tournament_bowling as
select
  tournament_id,
  player_id,
  count(distinct match_id)::bigint as matches_bowled,
  sum(legal_balls)::bigint as legal_balls,
  sum(runs_conceded)::bigint as runs_conceded,
  sum(wickets)::bigint as wickets,
  sum(dot_balls)::bigint as dot_balls,
  round(case when sum(legal_balls) = 0 then 0
             else sum(runs_conceded)::numeric * 6 / sum(legal_balls) end, 2) as economy
from v_player_match_bowling
where tournament_id is not null
group by tournament_id, player_id;

-- ============================================================================
-- GRANTS (read-only; anon for public pages, authenticated for the app)
-- ============================================================================
do $$
declare v text;
  vs text[] := array[
    'v_player_match_batting','v_player_match_bowling','v_player_match_fielding',
    'v_player_career_batting','v_player_career_bowling','v_player_career_fielding',
    'v_player_format_batting','v_player_format_bowling',
    'v_player_tournament_batting','v_player_tournament_bowling'
  ];
begin
  foreach v in array vs loop
    execute format('grant select on public.%I to anon;', v);
    execute format('grant select on public.%I to authenticated;', v);
  end loop;
end $$;

COMMIT;

-- ============================================================================
-- VERIFICATION (run separately; changes nothing)
-- ============================================================================
-- Confirm columns exist as the app expects:
-- select table_name, string_agg(column_name, ', ' order by ordinal_position)
-- from information_schema.columns
-- where table_schema = 'public' and table_name like 'v_player_%'
-- group by table_name order by table_name;
