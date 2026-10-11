-- 26_recycle_bin_admin_read.sql
-- PURPOSE: Guarantee that SUPER_ADMIN / DISTRICT_ADMIN can SEE soft-deleted rows
-- (deleted_at IS NOT NULL) so the Recycle Bin is never wrongly empty.
--
-- WHY: getRecycleBinItems() in src/lib/api.js reads rows where deleted_at IS NOT
-- NULL from tournaments/matches/players/teams. The repo schema grants admins a
-- FOR ALL policy (which includes SELECT), but if that policy drifted or is missing
-- in production, the recycle-bin query returns nothing and the bin looks empty on
-- refresh. This adds an explicit, additive SELECT policy for admins. Permissive
-- policies are OR-ed, so public/staff/scorer reads are unaffected.
--
-- Self-contained and idempotent. Run in the Supabase SQL editor.

BEGIN;

do $$
declare
  t text;
  tables text[] := array['tournaments', 'matches', 'players', 'teams'];
begin
  foreach t in array tables loop
    if to_regclass('public.' || t) is null then
      raise notice 'Skipping missing table %', t;
      continue;
    end if;

    execute format('alter table public.%I enable row level security;', t);

    execute format('drop policy if exists %I on public.%I;', t || '_admin_recyclebin_read', t);

    -- Admins (by profile role, read directly so this doesn't depend on helper
    -- functions that may have drifted) can SELECT every row in these tables,
    -- including soft-deleted ones.
    execute format($f$
      create policy %I on public.%I
      for select using (
        exists (
          select 1 from public.profiles p
          where p.id = auth.uid()
            and p.role in ('SUPER_ADMIN', 'DISTRICT_ADMIN')
            and coalesce(p.is_active, true)
        )
      );
    $f$, t || '_admin_recyclebin_read', t);
  end loop;
end $$;

COMMIT;

-- ============================================================================
-- VERIFICATION (run separately)
-- ============================================================================

-- a) Do soft-deleted rows actually exist in the database?
-- select 'tournaments' tbl, count(*) from tournaments where deleted_at is not null
-- union all select 'matches', count(*) from matches where deleted_at is not null
-- union all select 'players', count(*) from players where deleted_at is not null
-- union all select 'teams',   count(*) from teams   where deleted_at is not null;
--   If these counts are > 0 but the app bin is empty, it was a read-policy problem
--   (this script fixes it). If they are 0, nothing was ever soft-deleted.

-- b) Confirm the SELECT policies now exist:
-- select tablename, policyname from pg_policies
-- where policyname like '%admin_recyclebin_read%' order by tablename;
