-- 18_super_admin_delete_policy.sql
-- Grant SUPER_ADMIN full DELETE permissions on all major tables
-- This bypasses the recycle bin restriction (deleted_by = auth.uid()) that applies to other roles.

-- Tournaments
drop policy if exists tournaments_super_admin_delete on tournaments;
create policy tournaments_super_admin_delete on tournaments
for delete using (
  current_app_role() = 'SUPER_ADMIN'
);

-- Matches
drop policy if exists matches_super_admin_delete on matches;
create policy matches_super_admin_delete on matches
for delete using (
  current_app_role() = 'SUPER_ADMIN'
);

-- Players
drop policy if exists players_super_admin_delete on players;
create policy players_super_admin_delete on players
for delete using (
  current_app_role() = 'SUPER_ADMIN'
);

-- Teams
drop policy if exists teams_super_admin_delete on teams;
create policy teams_super_admin_delete on teams
for delete using (
  current_app_role() = 'SUPER_ADMIN'
);
