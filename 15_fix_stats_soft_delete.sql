-- Fix player stats views to exclude soft-deleted matches
-- When a match or tournament is soft-deleted, we must not include its deliveries in player stats.

-- 1. Batting View
drop view if exists v_player_match_batting cascade;
create view v_player_match_batting as
select
  d.match_id,
  d.innings_id,
  d.striker_id as player_id,
  sum(d.runs_off_bat)::bigint as runs_scored,
  count(*) filter (where d.extra_type <> 'WIDE')::bigint as balls_faced,
  count(*) filter (where d.runs_off_bat = 4)::bigint as fours,
  count(*) filter (where d.runs_off_bat = 6)::bigint as sixes,
  max(
    case
      when d.wicket_type <> 'NONE'
       and d.dismissed_player_id = d.striker_id
      then 1 else 0
    end
  )::integer as is_dismissed
from deliveries d
join matches m on d.match_id = m.id
where d.striker_id is not null and m.deleted_at is null
group by d.match_id, d.innings_id, d.striker_id;

-- 2. Bowling View
drop view if exists v_player_match_bowling cascade;
create view v_player_match_bowling as
select
  d.match_id,
  d.innings_id,
  d.bowler_id as player_id,
  count(*) filter (
    where d.extra_type not in ('BYES', 'LEG_BYES', 'PENALTY')
  )::bigint as balls_bowled,
  sum(
    case
      when d.extra_type not in ('BYES', 'LEG_BYES', 'PENALTY')
      then d.runs_total
      else 0
    end
  )::bigint as runs_conceded,
  count(*) filter (
    where d.wicket_type not in ('NONE', 'RUN_OUT', 'RETIRED_HURT', 'RETIRED_OUT', 'OBSTRUCTING_THE_FIELD')
  )::bigint as wickets_taken,
  count(*) filter (where d.extra_type = 'WIDE')::bigint as wides,
  count(*) filter (where d.extra_type = 'NO_BALL')::bigint as no_balls
from deliveries d
join matches m on d.match_id = m.id
where d.bowler_id is not null and m.deleted_at is null
group by d.match_id, d.innings_id, d.bowler_id;

-- 3. Fielding View
drop view if exists v_player_match_fielding cascade;
create view v_player_match_fielding as
select
  d.match_id,
  d.innings_id,
  p.id as player_id,
  count(*) filter (where d.wicket_type = 'CAUGHT' and d.fielder_id = p.id)::bigint as catches,
  count(*) filter (where d.wicket_type = 'RUN_OUT' and d.fielder_id = p.id)::bigint as run_outs,
  count(*) filter (where d.wicket_type = 'STUMPED' and d.wicketkeeper_id = p.id)::bigint as stumpings
from deliveries d
join matches m on d.match_id = m.id
join players p on (p.id = d.fielder_id or p.id = d.wicketkeeper_id)
where d.wicket_type in ('CAUGHT', 'RUN_OUT', 'STUMPED') and m.deleted_at is null
group by d.match_id, d.innings_id, p.id;

-- 4. Recreate Overall Stats View (v_player_stats_summary)
create or replace view v_player_stats_summary as
with batting_agg as (
  select
    player_id,
    count(distinct match_id) as matches_played,
    count(innings_id) as innings_batted,
    sum(runs_scored) as total_runs,
    sum(balls_faced) as total_balls_faced,
    sum(fours) as total_fours,
    sum(sixes) as total_sixes,
    sum(is_dismissed) as times_dismissed,
    max(runs_scored) as highest_score,
    count(*) filter (where runs_scored >= 50 and runs_scored < 100) as fifties,
    count(*) filter (where runs_scored >= 100) as hundreds
  from v_player_match_batting
  group by player_id
),
bowling_agg as (
  select
    player_id,
    count(innings_id) as innings_bowled,
    sum(balls_bowled) as total_balls_bowled,
    sum(runs_conceded) as total_runs_conceded,
    sum(wickets_taken) as total_wickets,
    count(*) filter (where wickets_taken >= 5) as five_wicket_hauls
  from v_player_match_bowling
  group by player_id
),
fielding_agg as (
  select
    player_id,
    sum(catches) as total_catches,
    sum(run_outs) as total_run_outs,
    sum(stumpings) as total_stumpings
  from v_player_match_fielding
  group by player_id
)
select
  p.id as player_id,
  p.full_name as player_name,
  coalesce(b.matches_played, 0) as matches_played,
  coalesce(b.innings_batted, 0) as innings_batted,
  coalesce(b.total_runs, 0) as total_runs,
  coalesce(b.total_balls_faced, 0) as total_balls_faced,
  case
    when coalesce(b.times_dismissed, 0) > 0
    then round(b.total_runs::numeric / b.times_dismissed::numeric, 2)
    else coalesce(b.total_runs, 0)::numeric
  end as batting_average,
  case
    when coalesce(b.total_balls_faced, 0) > 0
    then round((b.total_runs::numeric / b.total_balls_faced::numeric) * 100, 2)
    else 0.00
  end as batting_strike_rate,
  coalesce(b.highest_score, 0) as highest_score,
  coalesce(b.fifties, 0) as fifties,
  coalesce(b.hundreds, 0) as hundreds,
  coalesce(bw.innings_bowled, 0) as innings_bowled,
  coalesce(bw.total_balls_bowled, 0) as total_balls_bowled,
  coalesce(bw.total_runs_conceded, 0) as total_runs_conceded,
  coalesce(bw.total_wickets, 0) as total_wickets,
  case
    when coalesce(bw.total_wickets, 0) > 0
    then round(bw.total_runs_conceded::numeric / bw.total_wickets::numeric, 2)
    else 0.00
  end as bowling_average,
  case
    when coalesce(bw.total_balls_bowled, 0) > 0
    then round(bw.total_runs_conceded::numeric / (bw.total_balls_bowled::numeric / 6.0), 2)
    else 0.00
  end as bowling_economy,
  coalesce(bw.five_wicket_hauls, 0) as five_wicket_hauls,
  coalesce(f.total_catches, 0) as total_catches,
  coalesce(f.total_run_outs, 0) as total_run_outs,
  coalesce(f.total_stumpings, 0) as total_stumpings
from players p
left join batting_agg b on p.id = b.player_id
left join bowling_agg bw on p.id = bw.player_id
left join fielding_agg f on p.id = f.player_id;
