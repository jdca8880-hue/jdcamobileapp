-- ============================================================
-- 24_can_score_capability.sql
-- Adds a "Can Score" capability flag to profiles.
--
-- A person keeps a single primary role (e.g. SELECTOR), but when
-- can_score = true they also show up in the scorer-assignment list
-- AND are allowed to write live scoring data. This avoids a full
-- multi-role rework for people who wear more than one hat.
-- ============================================================

-- 1. The flag -------------------------------------------------
alter table profiles
  add column if not exists can_score boolean not null default false;

-- Existing scorers/admins are implicitly allowed by role, so no
-- backfill is required; the flag is purely additive.

-- 2. Authorization helper -------------------------------------
-- True when the current user may write scoring data: either their
-- role already allows it, or they have been granted the flag.
create or replace function can_user_score()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select coalesce(current_app_role() in ('SUPER_ADMIN','DISTRICT_ADMIN','SCORER'), false)
      or coalesce((select can_score from profiles where id = auth.uid()), false);
$$;

-- 3. Re-point the scoring write policies to the helper --------

-- match_rosters
drop policy if exists rosters_scorer_write on match_rosters;
create policy rosters_scorer_write on match_rosters
for all using (
  can_user_score()
)
with check (
  can_user_score()
);

-- matches (live in-match updates by scorers)
drop policy if exists matches_scorer_update on matches;
create policy matches_scorer_update on matches
for update using (
  can_user_score()
  and status not in ('COMPLETED', 'ABANDONED', 'CANCELLED')
)
with check (
  can_user_score()
);

-- innings
drop policy if exists innings_scorer_write on innings;
create policy innings_scorer_write on innings
for insert with check (
  can_user_score()
  and exists (
    select 1 from matches m
    where m.id = match_id
    and m.status not in ('COMPLETED', 'ABANDONED', 'CANCELLED')
  )
);

drop policy if exists innings_scorer_update on innings;
create policy innings_scorer_update on innings
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

-- deliveries
drop policy if exists deliveries_scorer_insert on deliveries;
create policy deliveries_scorer_insert on deliveries
for insert with check (
  can_user_score()
  and created_by = auth.uid()
  and exists (
    select 1 from matches m
    where m.id = match_id
    and m.status not in ('COMPLETED', 'ABANDONED', 'CANCELLED')
  )
);

drop policy if exists deliveries_scorer_update on deliveries;
create policy deliveries_scorer_update on deliveries
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
