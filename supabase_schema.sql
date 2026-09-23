
begin;

create extension if not exists pgcrypto;

-- ============================================================
-- ENUMS
-- ============================================================

do $$ begin
  create type app_role as enum (
    'SUPER_ADMIN','DISTRICT_ADMIN','SELECTOR','SCORER','VIEWER'
  );
exception when duplicate_object then null; end $$;

do $$ begin
  create type gender_category as enum ('Men','Women');
exception when duplicate_object then null; end $$;

do $$ begin
  create type player_primary_role as enum (
    'Batter','Bowler','All-Rounder','Wicket Keeper'
  );
exception when duplicate_object then null; end $$;

do $$ begin
  create type batting_style as enum ('Right-Hand Bat','Left-Hand Bat');
exception when duplicate_object then null; end $$;

do $$ begin
  create type bowling_style as enum (
    'Right-Arm Fast','Right-Arm Medium','Right-Arm Off Spin',
    'Right-Arm Leg Spin','Left-Arm Fast','Left-Arm Medium',
    'Slow Left-Arm Orthodox','Slow Left-Arm Chinaman',
    'None (WK)','None (Pure Batter)'
  );
exception when duplicate_object then null; end $$;

do $$ begin
  create type registration_status as enum (
    'ACTIVE','INACTIVE','SUSPENDED','EXPIRED'
  );
exception when duplicate_object then null; end $$;

do $$ begin
  create type selection_process_status as enum (
    'DRAFT','OPEN','IN_PROGRESS','COMPLETED','LOCKED'
  );
exception when duplicate_object then null; end $$;

do $$ begin
  create type candidate_status as enum (
    'ELIGIBLE','UNDER_REVIEW','SHORTLISTED','SELECTED',
    'NOT_SELECTED','INELIGIBLE'
  );
exception when duplicate_object then null; end $$;

do $$ begin
  create type tournament_status as enum (
    'UPCOMING','ONGOING','COMPLETED','CANCELLED'
  );
exception when duplicate_object then null; end $$;

do $$ begin
  create type match_status as enum (
    'SCHEDULED','IN_PROGRESS','INNINGS_BREAK',
    'COMPLETED','ABANDONED','CANCELLED'
  );
exception when duplicate_object then null; end $$;

do $$ begin
  create type innings_status as enum (
    'YET_TO_BAT','IN_PROGRESS','COMPLETED'
  );
exception when duplicate_object then null; end $$;

do $$ begin
  create type toss_decision as enum ('BAT','BOWL');
exception when duplicate_object then null; end $$;

do $$ begin
  create type extra_type as enum (
    'NONE','WIDE','NO_BALL','BYE','LEG_BYE','PENALTY'
  );
exception when duplicate_object then null; end $$;

do $$ begin
  create type wicket_type as enum (
    'NONE','BOWLED','CAUGHT','CAUGHT_BEHIND','STUMPED',
    'RUN_OUT','LBW','HIT_WICKET','RETIRED_HURT',
    'RETIRED_OUT','OBSTRUCTING_FIELD'
  );
exception when duplicate_object then null; end $$;

do $$ begin
  create type audit_action as enum (
    'INSERT','UPDATE','DELETE','LOCK','UNLOCK'
  );
exception when duplicate_object then null; end $$;

-- ============================================================
-- ORGANIZATION
-- ============================================================

create table if not exists districts (
  id uuid primary key default gen_random_uuid(),
  name varchar(120) not null unique,
  code varchar(30) not null unique,
  contact_name varchar(160),
  contact_phone varchar(40),
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists venues (
  id uuid primary key default gen_random_uuid(),
  district_id uuid references districts(id) on delete set null,
  name varchar(180) not null,
  pitch_type varchar(80),
  has_floodlights boolean not null default false,
  address text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ============================================================
-- USERS / PROFILES
-- Supabase Auth owns authentication. profiles stores JDCA data.
-- ============================================================

create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name varchar(160) not null,
  email varchar(320) unique,
  role app_role not null default 'VIEWER',
  district_id uuid references districts(id) on delete set null,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Ensure permission columns exist
alter table profiles 
  add column if not exists can_view boolean not null default true,
  add column if not exists can_add boolean not null default false,
  add column if not exists can_edit boolean not null default false,
  add column if not exists can_delete boolean not null default false;

-- ============================================================
-- AGE CATEGORIES
-- ============================================================

create table if not exists age_categories (
  id uuid primary key default gen_random_uuid(),
  name varchar(80) not null unique,
  short_name varchar(30) not null unique,
  rank_level integer not null unique,
  minimum_age integer,
  maximum_age integer,
  cutoff_date_rule varchar(200),
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  constraint age_range_valid check (
    minimum_age is null or maximum_age is null or minimum_age <= maximum_age
  )
);

-- Selector Scope Mapping Tables
create table if not exists selector_age_access (
  selector_id uuid references profiles(id) on delete cascade,
  max_age_category_id uuid references age_categories(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (selector_id)
);

create table if not exists selector_district_access (
  selector_id uuid references profiles(id) on delete cascade,
  district_id uuid references districts(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (selector_id, district_id)
);

-- ============================================================
-- PLAYERS
-- ============================================================

create table if not exists players (
  id uuid primary key default gen_random_uuid(),
  registration_number varchar(80) unique,
  full_name varchar(160) not null,
  date_of_birth date not null,
  gender gender_category not null,
  primary_role player_primary_role not null,
  batting_style batting_style not null,
  bowling_style bowling_style not null,
  avatar_url text,
  is_pro boolean not null default false,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists player_registrations (
  id uuid primary key default gen_random_uuid(),
  player_id uuid not null references players(id) on delete restrict,
  season varchar(20) not null,
  district_id uuid not null references districts(id) on delete restrict,
  registration_status registration_status not null default 'ACTIVE',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(player_id, season)
);

-- ============================================================
-- TEAMS
-- ============================================================

create table if not exists teams (
  id uuid primary key default gen_random_uuid(),
  name varchar(160) not null,
  short_name varchar(50),
  season varchar(20),
  district_id uuid references districts(id) on delete set null,
  age_category_id uuid references age_categories(id) on delete restrict,
  gender gender_category not null,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Ensure teams are unique by name (case-insensitive), season, and district
create unique index if not exists teams_name_season_district_unique_idx 
  on teams (lower(trim(name)), season, district_id) 
  where is_active = true;

create table if not exists team_players (
  id uuid primary key default gen_random_uuid(),
  team_id uuid not null references teams(id) on delete cascade,
  player_id uuid not null references players(id) on delete restrict,
  joined_at timestamptz not null default now(),
  left_at timestamptz,
  unique(team_id, player_id),
  constraint team_player_dates_valid check (
    left_at is null or left_at >= joined_at
  )
);

-- ============================================================
-- SELECTION
-- ============================================================

create table if not exists selection_processes (
  id uuid primary key default gen_random_uuid(),
  name varchar(180) not null,
  season varchar(20) not null,
  age_category_id uuid not null references age_categories(id) on delete restrict,
  gender gender_category not null,
  district_id uuid references districts(id) on delete set null,
  target_team_id uuid references teams(id) on delete set null,
  status selection_process_status not null default 'DRAFT',
  start_date date,
  end_date date,
  target_squad_size integer not null default 15,
  created_by uuid references profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint selection_size_valid check (target_squad_size between 1 and 50),
  constraint selection_dates_valid check (
    end_date is null or start_date is null or end_date >= start_date
  )
);

create table if not exists selection_candidates (
  id uuid primary key default gen_random_uuid(),
  selection_process_id uuid not null references selection_processes(id) on delete cascade,
  player_id uuid not null references players(id) on delete restrict,
  status candidate_status not null default 'ELIGIBLE',
  added_at timestamptz not null default now(),
  unique(selection_process_id, player_id)
);

create table if not exists player_evaluations (
  id uuid primary key default gen_random_uuid(),
  selection_process_id uuid not null references selection_processes(id) on delete cascade,
  player_id uuid not null references players(id) on delete restrict,
  evaluator_id uuid not null references profiles(id) on delete restrict,
  technical_ability integer,
  batting integer,
  bowling integer,
  fielding integer,
  fitness integer,
  temperament integer,
  game_awareness integer,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint evaluation_scores_valid check (
    (technical_ability is null or technical_ability between 1 and 10) and
    (batting is null or batting between 1 and 10) and
    (bowling is null or bowling between 1 and 10) and
    (fielding is null or fielding between 1 and 10) and
    (fitness is null or fitness between 1 and 10) and
    (temperament is null or temperament between 1 and 10) and
    (game_awareness is null or game_awareness between 1 and 10)
  )
);

create table if not exists selection_decisions (
  id uuid primary key default gen_random_uuid(),
  selection_process_id uuid not null references selection_processes(id) on delete cascade,
  player_id uuid not null references players(id) on delete restrict,
  decision candidate_status not null,
  decided_by uuid references profiles(id) on delete set null,
  decision_date timestamptz not null default now(),
  notes text,
  created_at timestamptz not null default now()
);

-- ============================================================
-- TOURNAMENTS
-- ============================================================

create table if not exists tournaments (
  id uuid primary key default gen_random_uuid(),
  name varchar(180) not null,
  season varchar(20) not null,
  format varchar(40) not null,
  age_category_id uuid not null references age_categories(id) on delete restrict,
  gender gender_category not null,
  start_date date,
  end_date date,
  status tournament_status not null default 'UPCOMING',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint tournament_dates_valid check (
    end_date is null or start_date is null or end_date >= start_date
  )
);

create table if not exists tournament_teams (
  tournament_id uuid not null references tournaments(id) on delete cascade,
  team_id uuid not null references teams(id) on delete restrict,
  primary key(tournament_id, team_id)
);

-- ============================================================
-- MATCHES
-- ============================================================

create table if not exists matches (
  id uuid primary key default gen_random_uuid(),
  tournament_id uuid references tournaments(id) on delete set null,
  venue_id uuid references venues(id) on delete set null,
  home_team_id uuid not null references teams(id) on delete restrict,
  away_team_id uuid not null references teams(id) on delete restrict,
  scheduled_at timestamptz,
  status match_status not null default 'SCHEDULED',
  match_format varchar(40) not null,
  max_overs integer,
  toss_winner_id uuid references teams(id) on delete set null,
  toss_decision toss_decision,
  winner_team_id uuid references teams(id) on delete set null,
  result_margin varchar(120),
  result_text text,
  man_of_the_match_id uuid references players(id) on delete set null,
  umpire_name varchar(160),
  scorer_name varchar(160),
  ball_type varchar(20),
  venue_name varchar(160),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint match_different_teams check(home_team_id <> away_team_id),
  constraint match_overs_valid check(max_overs is null or max_overs > 0),
  constraint toss_decision_consistent check(
    toss_decision is null or toss_winner_id is not null
  )
);

-- Ensure active matches are unique by tournament, teams, and schedule time
create unique index if not exists matches_fixture_unique_idx 
  on matches (tournament_id, home_team_id, away_team_id, scheduled_at) 
  where deleted_at is null;

create table if not exists match_rosters (
  id uuid primary key default gen_random_uuid(),
  match_id uuid not null references matches(id) on delete cascade,
  team_id uuid not null references teams(id) on delete restrict,
  player_id uuid not null references players(id) on delete restrict,
  is_playing_xi boolean not null default false,
  is_captain boolean not null default false,
  is_wicketkeeper boolean not null default false,
  batting_order integer,
  created_at timestamptz not null default now(),
  unique(match_id, player_id),
  constraint roster_batting_order_valid check(
    batting_order is null or batting_order between 1 and 20
  )
);

-- ============================================================
-- INNINGS
-- ============================================================

create table if not exists innings (
  id uuid primary key default gen_random_uuid(),
  match_id uuid not null references matches(id) on delete cascade,
  innings_number integer not null,
  batting_team_id uuid not null references teams(id) on delete restrict,
  bowling_team_id uuid not null references teams(id) on delete restrict,
  overs_limit integer,
  status innings_status not null default 'YET_TO_BAT',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(match_id, innings_number),
  constraint innings_number_valid check(innings_number >= 1),
  constraint innings_different_teams check(batting_team_id <> bowling_team_id),
  constraint innings_overs_valid check(overs_limit is null or overs_limit > 0)
);

-- ============================================================
-- DELIVERIES
-- One row = one recorded delivery event.
-- Wides/no-balls remain one delivery event but are not necessarily
-- legal balls; the derived views account for that.
-- ============================================================

create table if not exists deliveries (
  id uuid primary key default gen_random_uuid(),
  match_id uuid not null references matches(id) on delete cascade,
  innings_id uuid not null references innings(id) on delete cascade,
  delivery_sequence integer not null,
  over_number integer not null,
  ball_number integer not null,
  striker_id uuid references players(id) on delete restrict,
  non_striker_id uuid references players(id) on delete restrict,
  bowler_id uuid references players(id) on delete restrict,
  runs_off_bat integer not null default 0,
  runs_extras integer not null default 0,
  runs_total integer not null default 0,
  extra_type extra_type not null default 'NONE',
  wicket_type wicket_type not null default 'NONE',
  dismissed_player_id uuid references players(id) on delete restrict,
  fielder_id uuid references players(id) on delete restrict,
  wicketkeeper_id uuid references players(id) on delete restrict,
  wagon_zone varchar(80),
  idempotency_key varchar(160) not null,
  created_by uuid references profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  unique(idempotency_key),
  unique(innings_id, delivery_sequence),
  constraint delivery_sequence_valid check(delivery_sequence >= 1),
  constraint delivery_over_valid check(over_number >= 0),
  constraint delivery_ball_valid check(ball_number >= 1),
  constraint delivery_runs_valid check(
    runs_off_bat >= 0 and runs_extras >= 0 and runs_total >= 0
  ),
  constraint delivery_total_valid check(
    runs_total = runs_off_bat + runs_extras
  ),
  constraint wicket_player_required check(
    wicket_type = 'NONE' or dismissed_player_id is not null
  ),
  constraint wicket_fielder_consistency check(
    wicket_type in ('CAUGHT','RUN_OUT') or fielder_id is null
  ),
  constraint wicketkeeper_consistency check(
    wicket_type in ('STUMPED','CAUGHT_BEHIND') or wicketkeeper_id is null
  )
);

-- ============================================================
-- AUDIT
-- ============================================================

create table if not exists audit_logs (
  id uuid primary key default gen_random_uuid(),
  table_name varchar(120) not null,
  record_id uuid not null,
  action audit_action not null,
  changed_by uuid references profiles(id) on delete set null,
  old_data jsonb,
  new_data jsonb,
  created_at timestamptz not null default now()
);

-- ============================================================
-- INDEXES
-- ============================================================

create index if not exists idx_venues_district
  on venues(district_id);

create index if not exists idx_profiles_district_role
  on profiles(district_id, role);

create index if not exists idx_players_name
  on players(full_name);

create index if not exists idx_players_gender
  on players(gender);

create index if not exists idx_players_dob
  on players(date_of_birth);

create index if not exists idx_player_registrations_district_season
  on player_registrations(district_id, season);

create index if not exists idx_team_players_player
  on team_players(player_id);

create index if not exists idx_team_players_team
  on team_players(team_id);

create index if not exists idx_selection_candidates_process_status
  on selection_candidates(selection_process_id, status);

create index if not exists idx_evaluations_process_player
  on player_evaluations(selection_process_id, player_id);

create index if not exists idx_selection_decisions_process_player
  on selection_decisions(selection_process_id, player_id);

create index if not exists idx_tournament_teams_team
  on tournament_teams(team_id);

create index if not exists idx_matches_tournament_status
  on matches(tournament_id, status);

create index if not exists idx_matches_scheduled
  on matches(scheduled_at);

create index if not exists idx_match_rosters_match_team
  on match_rosters(match_id, team_id);

create index if not exists idx_match_rosters_player
  on match_rosters(player_id);

create index if not exists idx_innings_match
  on innings(match_id);

create index if not exists idx_deliveries_match_sequence
  on deliveries(match_id, delivery_sequence);

create index if not exists idx_deliveries_innings_sequence
  on deliveries(innings_id, delivery_sequence);

create index if not exists idx_deliveries_bowler
  on deliveries(bowler_id);

create index if not exists idx_deliveries_striker
  on deliveries(striker_id);

create index if not exists idx_deliveries_dismissed
  on deliveries(dismissed_player_id);

create index if not exists idx_deliveries_fielder
  on deliveries(fielder_id);

create index if not exists idx_deliveries_wicketkeeper
  on deliveries(wicketkeeper_id);

create index if not exists idx_audit_record
  on audit_logs(table_name, record_id, created_at desc);

-- ============================================================
-- UPDATED_AT TRIGGER
-- ============================================================

create or replace function set_updated_at()
returns trigger
language plpgsql
security invoker
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_districts_updated_at on districts;
create trigger trg_districts_updated_at before update on districts
for each row execute function set_updated_at();

drop trigger if exists trg_venues_updated_at on venues;
create trigger trg_venues_updated_at before update on venues
for each row execute function set_updated_at();

drop trigger if exists trg_profiles_updated_at on profiles;
create trigger trg_profiles_updated_at before update on profiles
for each row execute function set_updated_at();

drop trigger if exists trg_players_updated_at on players;
create trigger trg_players_updated_at before update on players
for each row execute function set_updated_at();

drop trigger if exists trg_player_registrations_updated_at on player_registrations;
create trigger trg_player_registrations_updated_at before update on player_registrations
for each row execute function set_updated_at();

drop trigger if exists trg_teams_updated_at on teams;
create trigger trg_teams_updated_at before update on teams
for each row execute function set_updated_at();

drop trigger if exists trg_selection_processes_updated_at on selection_processes;
create trigger trg_selection_processes_updated_at before update on selection_processes
for each row execute function set_updated_at();

drop trigger if exists trg_player_evaluations_updated_at on player_evaluations;
create trigger trg_player_evaluations_updated_at before update on player_evaluations
for each row execute function set_updated_at();

drop trigger if exists trg_tournaments_updated_at on tournaments;
create trigger trg_tournaments_updated_at before update on tournaments
for each row execute function set_updated_at();

drop trigger if exists trg_matches_updated_at on matches;
create trigger trg_matches_updated_at before update on matches
for each row execute function set_updated_at();

drop trigger if exists trg_innings_updated_at on innings;
create trigger trg_innings_updated_at before update on innings
for each row execute function set_updated_at();

-- ============================================================
-- CROSS-TABLE MATCH / DELIVERY VALIDATION
-- ============================================================

create or replace function validate_innings()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  m matches%rowtype;
begin
  select * into m from matches where id = new.match_id;

  if m.id is null then
    raise exception 'Match does not exist';
  end if;

  if new.batting_team_id not in (m.home_team_id, m.away_team_id)
     or new.bowling_team_id not in (m.home_team_id, m.away_team_id) then
    raise exception 'Innings teams must belong to the match';
  end if;

  return new;
end;
$$;

drop trigger if exists trg_validate_innings on innings;
create trigger trg_validate_innings
before insert or update on innings
for each row execute function validate_innings();

create or replace function validate_match_roster()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  m matches%rowtype;
begin
  select * into m from matches where id = new.match_id;

  if new.team_id not in (m.home_team_id, m.away_team_id) then
    raise exception 'Roster team must be one of the match teams';
  end if;

  return new;
end;
$$;

drop trigger if exists trg_validate_match_roster on match_rosters;
create trigger trg_validate_match_roster
before insert or update on match_rosters
for each row execute function validate_match_roster();

create or replace function validate_delivery()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  i innings%rowtype;
  striker_ok boolean;
  non_striker_ok boolean;
  bowler_ok boolean;
begin
  select * into i from innings where id = new.innings_id;

  if i.id is null or i.match_id <> new.match_id then
    raise exception 'Delivery innings does not belong to delivery match';
  end if;

  select exists (
    select 1 from match_rosters
    where match_id = new.match_id
      and team_id = i.batting_team_id
      and player_id = new.striker_id
      and is_playing_xi = true
  ) into striker_ok;

  select exists (
    select 1 from match_rosters
    where match_id = new.match_id
      and team_id = i.batting_team_id
      and player_id = new.non_striker_id
      and is_playing_xi = true
  ) into non_striker_ok;

  select exists (
    select 1 from match_rosters
    where match_id = new.match_id
      and team_id = i.bowling_team_id
      and player_id = new.bowler_id
      and is_playing_xi = true
  ) into bowler_ok;

  if new.striker_id is not null and not striker_ok then
    raise exception 'Striker is not in the batting playing XI';
  end if;

  if new.non_striker_id is not null and not non_striker_ok then
    raise exception 'Non-striker is not in the batting playing XI';
  end if;

  if new.bowler_id is not null and not bowler_ok then
    raise exception 'Bowler is not in the bowling playing XI';
  end if;

  if new.wicketkeeper_id is not null and not exists (
    select 1 from match_rosters
    where match_id = new.match_id
      and team_id = i.bowling_team_id
      and player_id = new.wicketkeeper_id
      and is_playing_xi = true
      and is_wicketkeeper = true
  ) then
    raise exception 'Assigned wicketkeeper is not the match wicketkeeper';
  end if;

  return new;
end;
$$;

drop trigger if exists trg_validate_delivery on deliveries;
create trigger trg_validate_delivery
before insert or update on deliveries
for each row execute function validate_delivery();

-- ============================================================
-- DERIVED MATCH BATTING
-- ============================================================

create or replace view v_player_match_batting as
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
where d.striker_id is not null
group by d.match_id, d.innings_id, d.striker_id;

-- ============================================================
-- DERIVED BOWLING
-- ============================================================

create or replace view v_player_match_bowling as
select
  d.match_id,
  d.innings_id,
  d.bowler_id as player_id,
  count(*) filter (
    where d.extra_type not in ('WIDE','NO_BALL')
  )::bigint as legal_balls,
  sum(
    case
      when d.extra_type in ('BYE','LEG_BYE','PENALTY')
      then 0
      else d.runs_total
    end
  )::bigint as runs_conceded,
  count(*) filter (
    where d.wicket_type in
      ('BOWLED','CAUGHT','CAUGHT_BEHIND','STUMPED','LBW','HIT_WICKET')
  )::bigint as wickets,
  count(*) filter (
    where d.runs_total = 0
      and d.extra_type = 'NONE'
  )::bigint as dot_balls
from deliveries d
where d.bowler_id is not null
group by d.match_id, d.innings_id, d.bowler_id;

-- ============================================================
-- DERIVED FIELDING / WK
-- ============================================================

create or replace view v_player_match_fielding as
select
  d.match_id,
  coalesce(d.fielder_id, d.wicketkeeper_id) as player_id,
  count(*) filter (
    where d.wicket_type = 'CAUGHT'
      and d.fielder_id is not null
  )::bigint as catches,
  count(*) filter (
    where d.wicket_type = 'CAUGHT_BEHIND'
      and d.wicketkeeper_id is not null
  )::bigint as catches_behind,
  count(*) filter (
    where d.wicket_type = 'RUN_OUT'
      and d.fielder_id is not null
  )::bigint as run_outs,
  count(*) filter (
    where d.wicket_type = 'STUMPED'
      and d.wicketkeeper_id is not null
  )::bigint as stumpings
from deliveries d
where d.fielder_id is not null
   or d.wicketkeeper_id is not null
group by d.match_id, coalesce(d.fielder_id, d.wicketkeeper_id);

-- ============================================================
-- PLAYER CAREER BATTING
-- ============================================================

create or replace view v_player_career_batting as
select
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
from v_player_match_batting
group by player_id;

-- ============================================================
-- PLAYER CAREER BOWLING
-- ============================================================

create or replace view v_player_career_bowling as
select
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
from v_player_match_bowling
group by player_id;

-- ============================================================
-- PLAYER CAREER FIELDING
-- ============================================================

create or replace view v_player_career_fielding as
select
  player_id,
  sum(catches)::bigint as catches,
  sum(catches_behind)::bigint as catches_behind,
  sum(run_outs)::bigint as run_outs,
  sum(stumpings)::bigint as stumpings
from v_player_match_fielding
group by player_id;

-- ============================================================
-- TOURNAMENT BATTING
-- ============================================================

create or replace view v_player_tournament_batting as
select
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
from v_player_match_batting b
join matches m on m.id = b.match_id
where m.tournament_id is not null
group by m.tournament_id, b.player_id;

-- ============================================================
-- TOURNAMENT BOWLING
-- ============================================================

create or replace view v_player_tournament_bowling as
select
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
from v_player_match_bowling b
join matches m on m.id = b.match_id
where m.tournament_id is not null
group by m.tournament_id, b.player_id;

-- ============================================================
-- PUBLIC MATCH SCORECARD VIEW
-- ============================================================

create or replace view v_match_summary as
select
  m.id as match_id,
  m.tournament_id,
  m.scheduled_at,
  m.status,
  m.match_format,
  m.max_overs,
  m.home_team_id,
  ht.name as home_team_name,
  m.away_team_id,
  at.name as away_team_name,
  m.venue_id,
  v.name as venue_name,
  m.winner_team_id,
  wt.name as winner_team_name,
  m.result_margin,
  m.result_text
from matches m
join teams ht on ht.id = m.home_team_id
join teams at on at.id = m.away_team_id
left join teams wt on wt.id = m.winner_team_id
left join venues v on v.id = m.venue_id;

-- ============================================================
-- RLS
-- ============================================================

alter table districts enable row level security;
alter table venues enable row level security;
alter table profiles enable row level security;
alter table age_categories enable row level security;
alter table players enable row level security;
alter table player_registrations enable row level security;
alter table teams enable row level security;
alter table team_players enable row level security;
alter table selection_processes enable row level security;
alter table selection_candidates enable row level security;
alter table player_evaluations enable row level security;
alter table selection_decisions enable row level security;
alter table tournaments enable row level security;
alter table tournament_teams enable row level security;
alter table matches enable row level security;
alter table match_rosters enable row level security;
alter table innings enable row level security;
alter table deliveries enable row level security;
alter table audit_logs enable row level security;

-- ============================================================
-- HELPER FUNCTIONS FOR RLS
-- ============================================================

create or replace function current_app_role()
returns app_role
language sql
stable
security definer
set search_path = public
as $$
  select role from profiles
  where id = auth.uid() and is_active = true
  limit 1;
$$;

create or replace function current_district_id()
returns uuid
language sql
stable
security definer
set search_path = public
as $$
  select district_id from profiles
  where id = auth.uid() and is_active = true
  limit 1;
$$;

create or replace function is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select coalesce(current_app_role() in ('SUPER_ADMIN','DISTRICT_ADMIN'), false);
$$;

create or replace function is_staff()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select coalesce(current_app_role() in
    ('SUPER_ADMIN','DISTRICT_ADMIN','SELECTOR','SCORER'), false);
$$;

create or replace function is_selector_authorized_for_player(p_player_id uuid, p_user_id uuid)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  v_role app_role;
  v_max_rank integer;
  v_authorized boolean;
begin
  select role into v_role from profiles where id = p_user_id;
  
  if v_role in ('SUPER_ADMIN', 'DISTRICT_ADMIN') then
    return true;
  elsif v_role = 'SELECTOR' then
    select ac.rank_level into v_max_rank
    from selector_age_access saa
    join age_categories ac on ac.id = saa.max_age_category_id
    where saa.selector_id = p_user_id;
    
    if v_max_rank is null then
      return false;
    end if;

    select exists (
      select 1 
      from player_registrations pr
      join age_categories pac on pac.id = pr.age_category_id
      join selector_district_access sda on sda.district_id = pr.district_id
      where pr.player_id = p_player_id
        and sda.selector_id = p_user_id
        and pac.rank_level <= v_max_rank
        and pr.registration_status = 'ACTIVE'
    ) into v_authorized;
    
    return coalesce(v_authorized, false);
  else
    return true;
  end if;
end;
$$;

-- ============================================================
-- PUBLIC READ POLICIES
-- ============================================================

drop policy if exists districts_public_read on districts;
create policy districts_public_read on districts
for select using (is_active = true);

drop policy if exists venues_public_read on venues;
create policy venues_public_read on venues
for select using (is_active = true);

drop policy if exists age_categories_public_read on age_categories;
create policy age_categories_public_read on age_categories
for select using (is_active = true);

drop policy if exists tournaments_public_read on tournaments;
create policy tournaments_public_read on tournaments
for select using (status <> 'CANCELLED');

drop policy if exists matches_public_read on matches;
create policy matches_public_read on matches
for select using (status <> 'CANCELLED');

drop policy if exists rosters_public_read on match_rosters;
create policy rosters_public_read on match_rosters
for select using (
  exists (
    select 1 from matches m
    where m.id = match_rosters.match_id
      and m.status <> 'CANCELLED'
  )
);

drop policy if exists rosters_scorer_write on match_rosters;
create policy rosters_scorer_write on match_rosters
for all using (
  current_app_role() in ('SUPER_ADMIN','DISTRICT_ADMIN','SCORER')
)
with check (
  current_app_role() in ('SUPER_ADMIN','DISTRICT_ADMIN','SCORER')
);

drop policy if exists innings_public_read on innings;
create policy innings_public_read on innings
for select using (
  exists (
    select 1 from matches m
    where m.id = innings.match_id
      and m.status <> 'CANCELLED'
  )
);

drop policy if exists deliveries_public_read on deliveries;
create policy deliveries_public_read on deliveries
for select using (
  exists (
    select 1 from matches m
    where m.id = deliveries.match_id
      and m.status <> 'CANCELLED'
  )
);

-- ============================================================
-- STAFF & SELECTOR READ POLICIES
-- ============================================================

drop policy if exists players_staff_read on players;
create policy players_staff_read on players
for select using (
  auth.uid() is not null 
  and is_selector_authorized_for_player(id, auth.uid())
);

drop policy if exists teams_staff_read on teams;
create policy teams_staff_read on teams
for select using (auth.uid() is not null);

drop policy if exists registrations_staff_read on player_registrations;
create policy registrations_staff_read on player_registrations
for select using (is_staff());

drop policy if exists team_players_staff_read on team_players;
create policy team_players_staff_read on team_players
for select using (is_staff());

drop policy if exists profiles_own_read on profiles;
create policy profiles_own_read on profiles
for select using (id = auth.uid());

-- ============================================================
-- PROFILE WRITE
-- ============================================================

drop policy if exists profiles_own_update on profiles;
create policy profiles_own_update on profiles
for update using (id = auth.uid())
with check (
  id = auth.uid() 
  and role = (select role from profiles where id = auth.uid())
  and is_active = (select is_active from profiles where id = auth.uid())
  and can_view = (select can_view from profiles where id = auth.uid())
  and can_add = (select can_add from profiles where id = auth.uid())
  and can_edit = (select can_edit from profiles where id = auth.uid())
  and can_delete = (select can_delete from profiles where id = auth.uid())
);

drop policy if exists profiles_admin_update on profiles;
create policy profiles_admin_update on profiles
for update using (is_admin())
with check (is_admin());

-- ============================================================
-- ADMIN WRITES
-- ============================================================

drop policy if exists districts_admin_write on districts;
create policy districts_admin_write on districts
for all using (is_admin())
with check (is_admin());

drop policy if exists venues_admin_write on venues;
create policy venues_admin_write on venues
for all using (is_admin())
with check (is_admin());

drop policy if exists players_admin_write on players;
create policy players_admin_write on players
for all using (is_admin())
with check (is_admin());

drop policy if exists registrations_admin_write on player_registrations;
create policy registrations_admin_write on player_registrations
for all using (is_admin())
with check (is_admin());

drop policy if exists teams_admin_write on teams;
create policy teams_admin_write on teams
for all using (is_admin())
with check (is_admin());

drop policy if exists team_players_admin_write on team_players;
create policy team_players_admin_write on team_players
for all using (is_admin())
with check (is_admin());

-- ============================================================
-- SELECTOR SCOPE PERMISSIONS
-- ============================================================

drop policy if exists selector_age_access_read on selector_age_access;
create policy selector_age_access_read on selector_age_access
for select using (is_admin() or selector_id = auth.uid());

drop policy if exists selector_age_access_write on selector_age_access;
create policy selector_age_access_write on selector_age_access
for all using (is_admin()) with check (is_admin());

drop policy if exists selector_district_access_read on selector_district_access;
create policy selector_district_access_read on selector_district_access
for select using (is_admin() or selector_id = auth.uid());

drop policy if exists selector_district_access_write on selector_district_access;
create policy selector_district_access_write on selector_district_access
for all using (is_admin()) with check (is_admin());

-- ============================================================
-- SELECTION WRITE
-- ============================================================

drop policy if exists selection_process_read on selection_processes;
create policy selection_process_read on selection_processes
for select using (
  current_app_role() = 'SUPER_ADMIN'
  or current_app_role() = 'SELECTOR'
  or district_id is null
  or district_id = current_district_id()
);

drop policy if exists selection_process_write on selection_processes;
create policy selection_process_write on selection_processes
for all using (
  current_app_role() in ('SUPER_ADMIN','SELECTOR')
  or (current_app_role() = 'DISTRICT_ADMIN' and district_id = current_district_id())
)
with check (
  current_app_role() in ('SUPER_ADMIN','SELECTOR')
  or (current_app_role() = 'DISTRICT_ADMIN' and district_id = current_district_id())
);

drop policy if exists selection_candidates_read on selection_candidates;
create policy selection_candidates_read on selection_candidates
for select using (
  exists (
    select 1 from selection_processes sp
    where sp.id = selection_candidates.selection_process_id
      and (
        current_app_role() in ('SUPER_ADMIN','SELECTOR')
        or sp.district_id is null
        or sp.district_id = current_district_id()
      )
  )
);

drop policy if exists selection_candidates_write on selection_candidates;
create policy selection_candidates_write on selection_candidates
for all using (
  current_app_role() in ('SUPER_ADMIN','SELECTOR')
)
with check (
  current_app_role() in ('SUPER_ADMIN','SELECTOR')
);

drop policy if exists evaluations_read on player_evaluations;
create policy evaluations_read on player_evaluations
for select using (
  current_app_role() in ('SUPER_ADMIN','SELECTOR')
);

drop policy if exists evaluations_write on player_evaluations;
create policy evaluations_write on player_evaluations
for all using (
  current_app_role() in ('SUPER_ADMIN','SELECTOR')
)
with check (
  current_app_role() in ('SUPER_ADMIN','SELECTOR')
  and evaluator_id = auth.uid()
);

drop policy if exists decisions_read on selection_decisions;
create policy decisions_read on selection_decisions
for select using (
  current_app_role() in ('SUPER_ADMIN','SELECTOR')
);

drop policy if exists decisions_write on selection_decisions;

create policy decisions_write on selection_decisions
for all using (
  current_app_role() in ('SUPER_ADMIN','SELECTOR')
)
with check (
  current_app_role() in ('SUPER_ADMIN','SELECTOR')
  and decided_by = auth.uid()
);

-- ============================================================
-- TOURNAMENT / MATCH ADMINISTRATION
-- ============================================================

drop policy if exists tournaments_admin_write on tournaments;
create policy tournaments_admin_write on tournaments
for all using (is_admin())
with check (is_admin());

drop policy if exists tournament_teams_admin_write on tournament_teams;
create policy tournament_teams_admin_write on tournament_teams
for all using (is_admin())
with check (is_admin());

drop policy if exists matches_admin_write on matches;
create policy matches_admin_write on matches
for all using (
  current_app_role() in ('SUPER_ADMIN','DISTRICT_ADMIN')
)
with check (
  current_app_role() in ('SUPER_ADMIN','DISTRICT_ADMIN')
);

-- ============================================================
-- SCORER WRITE
-- Only scorers/admins can create/update live innings/deliveries.
-- Historical data must be corrected through controlled operations.
-- ============================================================

drop policy if exists innings_scorer_write on innings;
create policy innings_scorer_write on innings
for insert with check (
  current_app_role() in ('SUPER_ADMIN','DISTRICT_ADMIN','SCORER')
);

drop policy if exists innings_scorer_update on innings;
create policy innings_scorer_update on innings
for update using (
  current_app_role() in ('SUPER_ADMIN','DISTRICT_ADMIN','SCORER')
)
with check (
  current_app_role() in ('SUPER_ADMIN','DISTRICT_ADMIN','SCORER')
);

drop policy if exists deliveries_scorer_insert on deliveries;
create policy deliveries_scorer_insert on deliveries
for insert with check (
  current_app_role() in ('SUPER_ADMIN','DISTRICT_ADMIN','SCORER')
  and created_by = auth.uid()
);

drop policy if exists deliveries_scorer_update on deliveries;
create policy deliveries_scorer_update on deliveries
for update using (
  current_app_role() in ('SUPER_ADMIN','DISTRICT_ADMIN','SCORER')
)
with check (
  current_app_role() in ('SUPER_ADMIN','DISTRICT_ADMIN','SCORER')
);

-- Deliberately no normal DELETE policy for deliveries.
-- Corrections should use a controlled correction workflow.

-- ============================================================
-- AUDIT READ
-- ============================================================

drop policy if exists audit_admin_read on audit_logs;
create policy audit_admin_read on audit_logs
for select using (
  current_app_role() in ('SUPER_ADMIN','DISTRICT_ADMIN')
);

-- ============================================================
-- AUDIT TRIGGER
-- ============================================================

create or replace function write_audit_log()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  rid uuid;
begin
  rid := coalesce(new.id, old.id);

  insert into audit_logs(
    table_name, record_id, action, changed_by, old_data, new_data
  )
  values (
    tg_table_name,
    rid,
    case tg_op
      when 'INSERT' then 'INSERT'::audit_action
      when 'UPDATE' then 'UPDATE'::audit_action
      when 'DELETE' then 'DELETE'::audit_action
    end,
    auth.uid(),
    case when tg_op in ('UPDATE','DELETE') then to_jsonb(old) end,
    case when tg_op in ('INSERT','UPDATE') then to_jsonb(new) end
  );

  return coalesce(new, old);
end;
$$;

drop trigger if exists trg_audit_players on players;
create trigger trg_audit_players
after insert or update or delete on players
for each row execute function write_audit_log();

drop trigger if exists trg_audit_selection_decisions on selection_decisions;
create trigger trg_audit_selection_decisions
after insert or update or delete on selection_decisions
for each row execute function write_audit_log();

drop trigger if exists trg_audit_matches on matches;
create trigger trg_audit_matches
after insert or update or delete on matches
for each row execute function write_audit_log();

drop trigger if exists trg_audit_deliveries on deliveries;
create trigger trg_audit_deliveries
after insert or update or delete on deliveries
for each row execute function write_audit_log();

-- ============================================================
-- REALTIME
-- Enable only the tables the live application needs.
-- Supabase Realtime configuration can also be managed in dashboard.
-- ============================================================

do $$
begin
  alter publication supabase_realtime add table matches;
exception when duplicate_object then null; end $$;

do $$
begin
  alter publication supabase_realtime add table innings;
exception when duplicate_object then null; end $$;

do $$
begin
  alter publication supabase_realtime add table deliveries;
exception when duplicate_object then null; end $$;

-- ============================================================
-- SEED AGE CATEGORIES
-- Adjust names/rules to the official JDCA/MPCA competition rules.
-- ============================================================

insert into age_categories
  (name, short_name, rank_level, minimum_age, maximum_age, cutoff_date_rule)
values
  ('Under 13','U13', 1, null, 12, 'Eligibility determined from official competition cutoff date'),
  ('Under 15','U15', 2, null, 14, 'Eligibility determined from official competition cutoff date'),
  ('Under 17','U17', 3, null, 16, 'Eligibility determined from official competition cutoff date'),
  ('Under 19','U19', 4, null, 18, 'Eligibility determined from official competition cutoff date'),
  ('Under 23','U23', 5, 19, 22, 'Eligibility determined from official competition cutoff date'),
  ('Senior','SENIOR', 6, 23, null, 'Senior/open eligibility according to competition rules')
on conflict (short_name) do nothing;

-- ============================================================
-- PUSH NOTIFICATIONS
-- ============================================================
create table if not exists push_subscriptions (
  id uuid primary key default gen_random_uuid(),
  endpoint text not null unique,
  p256dh_key text not null,
  auth_key text not null,
  created_at timestamptz not null default now()
);

alter table push_subscriptions enable row level security;

-- Anyone can insert a subscription (users accepting push prompt)
drop policy if exists push_subscriptions_insert on push_subscriptions;
create policy push_subscriptions_insert on push_subscriptions
for insert with check (true);

-- But only admin/system can read them
drop policy if exists push_subscriptions_read on push_subscriptions;
create policy push_subscriptions_read on push_subscriptions
for select using (current_app_role() in ('SUPER_ADMIN', 'DISTRICT_ADMIN'));

commit;