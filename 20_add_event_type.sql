-- 20_add_event_type.sql
-- ============================================================
-- Purpose
--   Introduce deliveries.event_type so PENALTY and RETIREMENT events can be
--   stored WITHOUT being counted as physical/legal balls. The derived player
--   stat views are updated to count only true deliveries (event_type='DELIVERY').
--
-- Safety / behaviour
--   * Backward compatible: the column defaults to 'DELIVERY', and the current
--     client does NOT send event_type, so every ball it inserts is a DELIVERY
--     and counts exactly as it does today.
--   * History is NOT rewritten. Existing rows receive the 'DELIVERY' default at
--     the storage level (a metadata-only column add in PG11+, so the per-row
--     immutability trigger does not fire and finalized matches are untouched).
--   * Penalties/retirements remain local-only until a follow-up client change
--     writes event_type; this migration only makes that possible.
--
--   The view definitions below MATCH PRODUCTION (which includes age_category_id
--   via a JOIN to matches) so CREATE OR REPLACE does not attempt to drop columns.
--
-- Idempotent: safe to run multiple times.
-- ============================================================

-- ------------------------------------------------------------
-- 1. Event type enum
-- ------------------------------------------------------------
do $$ begin
  create type delivery_event_type as enum ('DELIVERY','PENALTY','RETIREMENT');
exception when duplicate_object then null; end $$;

-- ------------------------------------------------------------
-- 2. Column (defaults existing + new rows to 'DELIVERY')
-- ------------------------------------------------------------
alter table deliveries
  add column if not exists event_type delivery_event_type not null default 'DELIVERY';

-- ------------------------------------------------------------
-- 3. Derived views — count ONLY real deliveries.
--    Reproduced from production (incl. age_category_id) + event_type guard.
-- ------------------------------------------------------------
create or replace view v_player_match_batting as
 SELECT d.match_id,
    d.innings_id,
    d.striker_id AS player_id,
    sum(d.runs_off_bat) AS runs_scored,
    count(*) FILTER (WHERE d.extra_type <> 'WIDE'::extra_type) AS balls_faced,
    count(*) FILTER (WHERE d.runs_off_bat = 4) AS fours,
    count(*) FILTER (WHERE d.runs_off_bat = 6) AS sixes,
    max(
        CASE
            WHEN d.wicket_type <> 'NONE'::wicket_type AND d.dismissed_player_id = d.striker_id THEN 1
            ELSE 0
        END) AS is_dismissed,
    m.age_category_id
   FROM deliveries d
     JOIN matches m ON d.match_id = m.id
  WHERE d.striker_id IS NOT NULL
    AND d.event_type = 'DELIVERY'
  GROUP BY d.match_id, d.innings_id, d.striker_id, m.age_category_id;

create or replace view v_player_match_bowling as
 SELECT d.match_id,
    d.innings_id,
    d.bowler_id AS player_id,
    count(*) FILTER (WHERE d.extra_type <> ALL (ARRAY['WIDE'::extra_type, 'NO_BALL'::extra_type])) AS legal_balls,
    sum(
        CASE
            WHEN d.extra_type = ANY (ARRAY['BYE'::extra_type, 'LEG_BYE'::extra_type, 'PENALTY'::extra_type]) THEN 0
            ELSE d.runs_total
        END) AS runs_conceded,
    count(*) FILTER (WHERE d.wicket_type = ANY (ARRAY['BOWLED'::wicket_type, 'CAUGHT'::wicket_type, 'CAUGHT_BEHIND'::wicket_type, 'STUMPED'::wicket_type, 'LBW'::wicket_type, 'HIT_WICKET'::wicket_type])) AS wickets,
    count(*) FILTER (WHERE d.runs_total = 0 AND d.extra_type = 'NONE'::extra_type) AS dot_balls,
    m.age_category_id
   FROM deliveries d
     JOIN matches m ON d.match_id = m.id
  WHERE d.bowler_id IS NOT NULL
    AND d.event_type = 'DELIVERY'
  GROUP BY d.match_id, d.innings_id, d.bowler_id, m.age_category_id;

create or replace view v_player_match_fielding as
 SELECT d.match_id,
    COALESCE(d.fielder_id, d.wicketkeeper_id) AS player_id,
    count(*) FILTER (WHERE d.wicket_type = 'CAUGHT'::wicket_type AND d.fielder_id IS NOT NULL) AS catches,
    count(*) FILTER (WHERE d.wicket_type = 'CAUGHT_BEHIND'::wicket_type AND d.wicketkeeper_id IS NOT NULL) AS catches_behind,
    count(*) FILTER (WHERE d.wicket_type = 'RUN_OUT'::wicket_type AND d.fielder_id IS NOT NULL) AS run_outs,
    count(*) FILTER (WHERE d.wicket_type = 'STUMPED'::wicket_type AND d.wicketkeeper_id IS NOT NULL) AS stumpings,
    m.age_category_id
   FROM deliveries d
     JOIN matches m ON d.match_id = m.id
  WHERE (d.fielder_id IS NOT NULL OR d.wicketkeeper_id IS NOT NULL)
    AND d.event_type = 'DELIVERY'
  GROUP BY d.match_id, (COALESCE(d.fielder_id, d.wicketkeeper_id)), m.age_category_id;
