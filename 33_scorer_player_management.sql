-- ============================================================
-- 33_scorer_player_management.sql
-- Allow scorers to add, edit, and SOFT-delete players.
--
-- Scope granted to scorers (can_user_score(): SCORER, admins, or any profile
-- holding the can_score capability flag):
--   * INSERT players            -> register a new player
--   * UPDATE players            -> edit details AND soft-delete
--                                  (soft delete = UPDATE players SET deleted_at)
--   * INSERT player_registrations -> the season row written during registration
--
-- Explicitly NOT granted: DELETE on players. Permanent ("hard") delete runs a
-- real DELETE (api.hardDeleteItem) and stays restricted to SUPER_ADMIN via the
-- existing delete policy, so scorers can move a player to the Recycle Bin but
-- can never erase one.
-- ============================================================

begin;

-- Players: let scorers register new players.
drop policy if exists players_scorer_insert on players;
create policy players_scorer_insert on players
for insert
with check (can_user_score());

-- Players: let scorers edit and soft-delete (soft delete is an UPDATE of
-- deleted_at/deleted_by, so it is covered here — no DELETE privilege needed).
drop policy if exists players_scorer_update on players;
create policy players_scorer_update on players
for update
using (can_user_score())
with check (can_user_score());

-- Player registrations: registerPlayer() also inserts the season registration
-- row, so scorers need INSERT here too or registration fails after the player
-- row is created.
drop policy if exists registrations_scorer_insert on player_registrations;
create policy registrations_scorer_insert on player_registrations
for insert
with check (can_user_score());

commit;
