-- ============================================================
-- 29_match_events_and_overthrow.sql
--
-- PURPOSE
--   Make two things durable + visible on EVERY device (not just the
--   scorer's phone):
--     1. Overthrow detail on a delivery (currently it folds into the
--        run total and the "it was an overthrow" fact is lost on sync).
--     2. Match interruptions / reduced-overs notes (rain, revised
--        target, etc.) — previously stored only in the scorer's
--        localStorage.
--
-- SAFETY (why nothing breaks)
--   This migration is PURELY ADDITIVE and IDEMPOTENT:
--     * Only `add column if not exists` on deliveries, with defaults,
--       so existing rows + the current INSERT (which doesn't send these
--       columns yet) keep working untouched.
--     * No existing column, constraint, check, trigger, policy, index,
--       enum or view is dropped or altered.
--     * `create table if not exists` + `drop policy if exists` guards
--       make it safe to run more than once.
--   The app code is NOT changed by this file. The new columns/table are
--   simply ignored until the app is updated to read/write them, so you
--   can apply this now with zero effect on live scoring.
--
-- APPLY: paste into the Supabase SQL editor and run. Safe to re-run.
-- ============================================================


-- ------------------------------------------------------------
-- 1. Overthrow detail on deliveries (nullable / defaulted)
-- ------------------------------------------------------------
alter table deliveries
  add column if not exists is_overthrow boolean not null default false;

alter table deliveries
  add column if not exists runs_overthrow integer not null default 0;


-- ------------------------------------------------------------
-- 2. Match events table (interruptions, reduced overs, notes)
-- ------------------------------------------------------------
create table if not exists match_events (
  id              uuid primary key default gen_random_uuid(),
  match_id        uuid not null references matches(id) on delete cascade,
  innings_id      uuid references innings(id) on delete set null,
  innings_number  integer,
  event_type      varchar(40) not null default 'OVERS_REVISED',
  from_overs      integer,
  to_overs        integer,
  revised_target  integer,
  at_over         varchar(12),
  reason          text,
  idempotency_key varchar(160),
  created_by      uuid references profiles(id) on delete set null,
  created_at      timestamptz not null default now()
);

-- Dedupe offline retries. Partial unique index so the many NULL
-- idempotency keys never collide (and it is safe to re-create).
create unique index if not exists match_events_idempotency_uidx
  on match_events(idempotency_key)
  where idempotency_key is not null;

create index if not exists idx_match_events_match
  on match_events(match_id);


-- ------------------------------------------------------------
-- 3. RLS for match_events — mirrors the deliveries/innings rules
--    (public read for non-cancelled matches; scorers may write
--    while the match is live). Isolated to this new table only.
-- ------------------------------------------------------------
alter table match_events enable row level security;

drop policy if exists match_events_public_read on match_events;
create policy match_events_public_read on match_events
for select using (
  exists (
    select 1 from matches m
    where m.id = match_events.match_id
      and m.status <> 'CANCELLED'
  )
);

drop policy if exists match_events_scorer_insert on match_events;
create policy match_events_scorer_insert on match_events
for insert with check (
  can_user_score()
  and exists (
    select 1 from matches m
    where m.id = match_id
      and m.status not in ('COMPLETED', 'ABANDONED', 'CANCELLED')
  )
);

drop policy if exists match_events_scorer_update on match_events;
create policy match_events_scorer_update on match_events
for update using (
  can_user_score()
  and exists (
    select 1 from matches m
    where m.id = match_id
      and m.status not in ('COMPLETED', 'ABANDONED', 'CANCELLED')
  )
)
with check (
  can_user_score()
);

-- Table-level grants so the PostgREST API can reach it (RLS still
-- gates every row). Additive; harmless if already covered by
-- Supabase default privileges.
grant select on match_events to anon;
grant select, insert, update on match_events to authenticated;


-- ------------------------------------------------------------
-- 4. Verify (optional — run after applying)
-- ------------------------------------------------------------
-- select column_name, data_type, column_default
--   from information_schema.columns
--  where table_name = 'deliveries'
--    and column_name in ('is_overthrow','runs_overthrow');
--
-- select policyname, cmd from pg_policies where tablename = 'match_events';
