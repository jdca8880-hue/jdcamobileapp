-- 25_super_admin_absolute_delete_all.sql
-- PURPOSE: Let a SUPER_ADMIN permanently delete ANYTHING from the recycle bin,
-- regardless of who soft-deleted it.
--
-- WHY THIS WAS FAILING:
--   hardDeleteItem() in src/lib/api.js deletes the parent row AND cascades through
--   child tables (deliveries, innings, match_rosters, team_players,
--   player_registrations). RLS DELETE policies were applied inconsistently across
--   the repo: parent tables checked current_app_role(), child tables checked
--   get_user_role() (defined only in fix_rls.sql), and the scorer policy restricts
--   deletes to `deleted_by = auth.uid()`. When the SUPER_ADMIN permissive policy was
--   missing (or its helper function had not been applied) on a given table, the
--   DELETE was filtered to zero rows and the app reported
--   "Permission denied. You can only permanently delete items that you deleted."
--
-- THIS SCRIPT is idempotent and self-contained: it defines ONE reliable check
-- (is_super_admin, reading profiles directly so it does not depend on which helper
-- functions were previously applied) and grants SUPER_ADMIN an absolute DELETE
-- policy on every table involved. Run it in the Supabase SQL editor.

BEGIN;

-- 1. One canonical, drift-proof super-admin check.
--    SECURITY DEFINER so it bypasses profiles RLS; reads the role directly.
create or replace function public.is_super_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.profiles
    where id = auth.uid()
      and role = 'SUPER_ADMIN'
      and coalesce(is_active, true)
  );
$$;

grant execute on function public.is_super_admin() to authenticated;

-- 2. Grant SUPER_ADMIN an absolute DELETE policy on every table the recycle-bin
--    hard-delete touches. Permissive policies are OR-ed with existing ones, so the
--    scorer/owner policies keep working for non-super-admins.
do $$
declare
  t text;
  tables text[] := array[
    'tournaments',
    'matches',
    'players',
    'teams',
    'deliveries',
    'innings',
    'match_rosters',
    'team_players',
    'player_registrations'
  ];
begin
  foreach t in array tables loop
    -- Only touch tables that actually exist in this database.
    if to_regclass('public.' || t) is null then
      raise notice 'Skipping missing table %', t;
      continue;
    end if;

    execute format('alter table public.%I enable row level security;', t);

    -- Remove older super-admin delete policies so there is a single source of truth.
    execute format('drop policy if exists %I on public.%I;', t || '_super_admin_delete_all', t);
    execute format('drop policy if exists %I on public.%I;', t || '_super_admin_delete', t);
    execute format('drop policy if exists %I on public.%I;', 'Super admins can delete ' || t, t);

    execute format(
      'create policy %I on public.%I for delete using ( public.is_super_admin() );',
      t || '_super_admin_delete_all', t
    );
  end loop;
end $$;

COMMIT;

-- ============================================================================
-- VERIFICATION (run these SELECTs separately; they do not change anything)
-- ============================================================================

-- a) Confirm the DELETE policies now exist on every table:
-- select tablename, policyname, cmd
-- from pg_policies
-- where cmd = 'DELETE'
--   and tablename in ('tournaments','matches','players','teams','deliveries',
--                     'innings','match_rosters','team_players','player_registrations')
-- order by tablename, policyname;

-- b) Confirm the account you log in with is actually SUPER_ADMIN and active:
-- select id, email, role, is_active from public.profiles where role = 'SUPER_ADMIN';
--   (If your account is not listed, that is the real problem — fix the profile role.)
