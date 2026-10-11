-- 31_player_delete_selection_policies.sql
-- PURPOSE: Allow permanent deletion of a player (from the recycle bin) to also
--   clear the player's selection-process links.
--
-- WHY THIS IS NEEDED:
--   hardDeleteItem('PLAYER', ...) in src/lib/api.js must clear EVERY table that
--   references players(id) with ON DELETE RESTRICT before the player row can be
--   deleted. 25_super_admin_absolute_delete_all.sql granted SUPER_ADMIN a DELETE
--   policy on tournaments/matches/players/teams/deliveries/innings/match_rosters/
--   team_players/player_registrations, but NOT on the three selection tables that
--   also reference players(id) with RESTRICT. If a player is in a selection process,
--   those child deletes get silently filtered to zero rows by RLS, and the final
--   player DELETE then fails with a foreign-key violation.
--
--   This script grants SUPER_ADMIN the same absolute DELETE policy on those tables.
--   It is idempotent and self-contained; run it in the Supabase SQL editor. It
--   depends on public.is_super_admin() created by 25_super_admin_absolute_delete_all.sql.

BEGIN;

-- Ensure the canonical super-admin check exists (safe to re-create).
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

do $$
declare
  t text;
  tables text[] := array[
    'selection_candidates',
    'player_evaluations',
    'selection_decisions'
  ];
begin
  foreach t in array tables loop
    -- Only touch tables that actually exist in this database.
    if to_regclass('public.' || t) is null then
      raise notice 'Skipping missing table %', t;
      continue;
    end if;

    execute format('alter table public.%I enable row level security;', t);

    -- Single source of truth: drop any prior variants, then create one policy.
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
-- VERIFICATION (run separately; changes nothing)
-- ============================================================================
-- select tablename, policyname, cmd
-- from pg_policies
-- where cmd = 'DELETE'
--   and tablename in ('selection_candidates','player_evaluations','selection_decisions')
-- order by tablename, policyname;
