-- ============================================================
-- 34_match_event_log.sql  (Plan B — Stage 3: the server event log)
--
-- PURPOSE
--   The server-side append-only event log that mirrors the local
--   Dexie `match_events` log. It is the durable, authoritative record
--   of every scoring event (ball, wicket, penalty, innings start,
--   declaration, match end, void). Scorecards / live score are
--   PROJECTIONS of this log (buildMatchState), never hand-written rows.
--
-- SAFETY  (why nothing you already have breaks)
--   * PURELY ADDITIVE: this ONLY creates ONE new table
--     (`match_event_log`) plus its indexes / RLS policies.
--   * It does NOT touch players, teams, matches, deliveries, innings,
--     match_rosters, or the existing `match_events` (rain/overs) table.
--   * `create table if not exists` + `drop policy if exists` make it
--     safe to run more than once.
--
--   NOTE: the event-sourced log is a NEW name (`match_event_log`) on
--   purpose — migration 29 already uses `match_events` for interruption
--   notes, so the two never collide.
--
-- REQUIRES  (already present in your DB, used by existing policies):
--   * function public.can_user_score()      -- scorer capability check
--   * function public.is_super_admin()       -- (optional) admin cleanup
--   * table    public.profiles(id)           -- author FK
--
-- APPLY: paste into the Supabase SQL editor and run. Safe to re-run.
-- ============================================================


-- ------------------------------------------------------------
-- 1. The log table
-- ------------------------------------------------------------
create table if not exists public.match_event_log (
  -- Stable, CLIENT-generated event id (e.g. 'evt-abc-123'). As the primary
  -- key it gives exactly-once semantics: a retried upload simply conflicts and
  -- is ignored (idempotent). Never server-generated.
  id              text primary key,

  match_id        uuid not null references public.matches(id) on delete cascade,

  -- Innings this event belongs to (null for match-level events like
  -- MATCH_STARTED / MATCH_ENDED).
  innings_number  integer,

  -- Per-innings monotonic sequence for DELIVERY/PENALTY/RETIREMENT events
  -- (null for everything else). Used for identity, dedupe and gap detection.
  seq             integer,

  -- Event type (DELIVERY, INNINGS_STARTED, PENALTY, RETIREMENT, OVERS_REVISED,
  -- DECLARATION, INNINGS_ENDED, MATCH_STARTED, MATCH_ENDED).
  type            varchar(40) not null,

  -- The full event payload (the canonical delivery, teams, result, etc.).
  payload         jsonb not null default '{}'::jsonb,

  -- Deterministic undo: voided events are kept (append-only history) but
  -- skipped by the projection.
  voided          boolean not null default false,

  created_by      uuid references public.profiles(id) on delete set null,
  created_at      timestamptz not null default now(),

  -- GLOBAL monotonic server order, assigned on insert. This is the CURSOR a
  -- viewer / second device pulls by ("give me everything after server_seq N").
  server_seq      bigint generated always as identity
);


-- ------------------------------------------------------------
-- 2. Invariants & query indexes
-- ------------------------------------------------------------

-- The server-side guarantee against cross-device sequence collisions: within
-- one innings, a given seq can be used by at most one event. (Partial, so the
-- many NULL seqs on match-level events never collide.) A second device trying
-- to reuse a seq gets a unique violation, which the sync layer resolves by
-- re-deriving the next free seq — it can NEVER silently overwrite a ball.
create unique index if not exists uq_match_event_log_innings_seq
  on public.match_event_log (match_id, innings_number, seq)
  where seq is not null;

-- Cursor pull for one match (live catch-up after reconnect).
create index if not exists ix_match_event_log_match_cursor
  on public.match_event_log (match_id, server_seq);

-- Global cursor (cross-match pull / admin tooling).
create index if not exists ix_match_event_log_cursor
  on public.match_event_log (server_seq);


-- ------------------------------------------------------------
-- 3. Row-Level Security
-- ------------------------------------------------------------
alter table public.match_event_log enable row level security;

-- Anyone may READ the log (public live scoring / spectator view), matching the
-- existing public-read model for innings/deliveries.
drop policy if exists match_event_log_public_read on public.match_event_log;
create policy match_event_log_public_read on public.match_event_log
  for select using (true);

-- Only a user who can score may APPEND, only as themselves, and only while the
-- match is live (mirrors deliveries_scorer_insert).
drop policy if exists match_event_log_scorer_insert on public.match_event_log;
create policy match_event_log_scorer_insert on public.match_event_log
  for insert with check (
    public.can_user_score()
    and created_by = auth.uid()
    and exists (
      select 1 from public.matches m
      where m.id = match_id
        and m.status not in ('COMPLETED', 'ABANDONED', 'CANCELLED')
    )
  );

-- A scorer may UPDATE only to VOID an event (deterministic undo) on a live
-- match. History is never physically deleted here.
drop policy if exists match_event_log_scorer_update on public.match_event_log;
create policy match_event_log_scorer_update on public.match_event_log
  for update using (
    public.can_user_score()
    and exists (
      select 1 from public.matches m
      where m.id = match_id
        and m.status not in ('COMPLETED', 'ABANDONED', 'CANCELLED')
    )
  )
  with check ( public.can_user_score() );

-- Only a super admin may physically delete log rows (cleanup of throwaway test
-- matches). Normal scoring never deletes.
drop policy if exists match_event_log_admin_delete on public.match_event_log;
create policy match_event_log_admin_delete on public.match_event_log
  for delete using ( public.is_super_admin() );


-- ------------------------------------------------------------
-- 4. Realtime (live match fan-out)
-- ------------------------------------------------------------
-- Let Supabase Realtime broadcast inserts/updates on this table so viewers and
-- second devices get events live. Guarded so re-running never errors.
do $$
begin
  begin
    execute 'alter publication supabase_realtime add table public.match_event_log';
  exception
    when duplicate_object then null;  -- already in the publication
    when undefined_object then null;  -- publication not present (self-hosted); ignore
  end;
end $$;


-- ------------------------------------------------------------
-- 5. Verify (optional — should return the new table with 0 rows)
-- ------------------------------------------------------------
-- select count(*) as event_rows from public.match_event_log;
