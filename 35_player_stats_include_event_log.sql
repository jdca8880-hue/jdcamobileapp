-- 35_player_stats_include_event_log.sql
-- ============================================================================
-- MAKE PLAYER STATS COUNT v2 (EVENT-SOURCED) MATCHES.
--
-- WHY THIS EXISTS
--   Migration 32 built every player-stat view (v_player_*) on the `deliveries`
--   table. But the app now DEFAULTS to the v2 event-sourced engine, which writes
--   each ball ONLY to `match_event_log` on the server (the local `deliveries`
--   Dexie cache is on-device). It never inserts into the server `deliveries`
--   table. Result: a completed v2 match produces ZERO rows in `deliveries`, so
--   batting / bowling / fielding / wicketkeeping stats are all blank on every
--   player profile — even though the match was fully scored.
--
--   This migration rebuilds the derived-stats stack ONE way again, but sources
--   it from a single unified view `v_scoring_deliveries` that normalizes BOTH:
--     * legacy `deliveries` rows (v1 matches), and
--     * `match_event_log` DELIVERY events (v2 matches), projected from their
--       JSONB payload into the same delivery column shape.
--
--   A match is scored by exactly one engine, so the two sources never overlap;
--   as a belt-and-braces guard the legacy branch excludes any match that has
--   event-log deliveries, so nothing can ever be double-counted.
--
-- SAFETY
--   * READ-SIDE ONLY. Touches no scoring, no sync, no writes. It only drops and
--     recreates views (+ one helper function) exactly as migration 32 does.
--   * Column names are unchanged, so src/hooks/useDataSync.js and
--     src/lib/api.js read these views with no code change.
--   * Voided (undone) events are skipped, matching live/scorecard behaviour.
--   * Idempotent: safe to run repeatedly in the Supabase SQL editor.
-- ============================================================================

BEGIN;

-- ----------------------------------------------------------------------------
-- Helper: cast a JSONB text value to uuid only when it really is a uuid, else
-- NULL. Payload ids are uuids, but this keeps a stray non-uuid value from
-- aborting the whole view with a cast error.
-- ----------------------------------------------------------------------------
create or replace function public.jdca_safe_uuid(txt text)
returns uuid language sql immutable as $$
  select case
    when txt ~* '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$'
    then txt::uuid else null end
$$;

-- Drop the whole derived stack (dependents first), same order as migration 32,
-- plus the unified base view.
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
drop view if exists v_scoring_deliveries cascade;

-- ============================================================================
-- UNIFIED DELIVERY SOURCE (legacy deliveries + v2 event-log, same columns)
-- ============================================================================
create view v_scoring_deliveries as
-- 1) Legacy v1 deliveries — but only for matches that have NO event-log
--    deliveries, so a match is never counted from both sources.
select
  d.match_id,
  d.innings_id::text               as innings_id,
  d.over_number::int               as over_number,
  d.striker_id,
  d.non_striker_id,
  d.bowler_id,
  coalesce(d.runs_off_bat, 0)::int as runs_off_bat,
  coalesce(d.runs_extras, 0)::int  as runs_extras,
  coalesce(d.runs_total, 0)::int   as runs_total,
  -- extra_type / wicket_type / event_type are ENUM columns on `deliveries`;
  -- cast to text so the UNION matches the event-log branch (plain text).
  coalesce(d.extra_type::text, 'NONE')     as extra_type,
  coalesce(d.wicket_type::text, 'NONE')    as wicket_type,
  d.dismissed_player_id,
  d.fielder_id,
  d.wicketkeeper_id,
  coalesce(d.event_type::text, 'DELIVERY') as event_type
from deliveries d
where not exists (
  select 1 from match_event_log el
  where el.match_id = d.match_id
    and el.type = 'DELIVERY'
    and el.voided = false
)

union all

-- 2) v2 event-sourced deliveries — projected from the canonical JSONB payload
--    into the delivery column shape. PENALTY / RETIREMENT events are excluded
--    (type = 'DELIVERY' only), matching the event_type='DELIVERY' guard.
select
  el.match_id,
  el.innings_number::text          as innings_id,
  (floor(coalesce(nullif(el.payload->>'balls','')::int, 0) / 6))::int as over_number,
  public.jdca_safe_uuid(el.payload->>'strikerId')      as striker_id,
  public.jdca_safe_uuid(el.payload->>'nonStrikerId')   as non_striker_id,
  public.jdca_safe_uuid(el.payload->>'bowlerId')       as bowler_id,
  coalesce(nullif(el.payload->>'runsBatter','')::int, 0) as runs_off_bat,
  coalesce(nullif(el.payload->>'runsExtras','')::int, 0) as runs_extras,
  coalesce(nullif(el.payload->>'runsTotal','')::int, 0)  as runs_total,
  coalesce(el.payload->>'extraType', 'NONE')  as extra_type,
  coalesce(el.payload->>'wicketType', 'NONE') as wicket_type,
  public.jdca_safe_uuid(el.payload->>'dismissedPlayerId') as dismissed_player_id,
  public.jdca_safe_uuid(el.payload->>'fielderId')         as fielder_id,
  public.jdca_safe_uuid(el.payload->>'wicketkeeperId')    as wicketkeeper_id,
  'DELIVERY'                        as event_type
from match_event_log el
where el.type = 'DELIVERY'
  and el.voided = false;

-- ============================================================================
-- MATCH-LEVEL (one row per player per innings) — unchanged logic, new source.
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
from v_scoring_deliveries d
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
  from v_scoring_deliveries d
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
from v_scoring_deliveries d
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
from v_scoring_deliveries d
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
    'v_scoring_deliveries',
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
-- How many deliveries now feed the stats, split by source engine:
-- select
--   count(*) filter (where source = 'legacy') as legacy_balls,
--   count(*) filter (where source = 'event_log') as event_log_balls
-- from (
--   select 'legacy'::text as source from deliveries d
--     where not exists (select 1 from match_event_log el
--       where el.match_id = d.match_id and el.type='DELIVERY' and el.voided=false)
--   union all
--   select 'event_log' from match_event_log el
--     where el.type='DELIVERY' and el.voided=false
-- ) s;
--
-- Spot-check a player's career batting:
-- select * from v_player_career_batting where player_id = '<player-uuid>';
