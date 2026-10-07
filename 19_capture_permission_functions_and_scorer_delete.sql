-- 19_capture_permission_functions_and_scorer_delete.sql
-- ============================================================
-- Purpose
--   1. Capture into source control three permission helper functions that
--      currently exist ONLY in the Supabase dashboard (schema drift):
--      user_can_add(), user_can_edit(), user_can_delete().
--   2. Add a scorer/admin DELETE policy on `deliveries` so that scoring
--      undo works for SCORER profiles (whose can_delete flag is normally
--      false). RLS permissive policies are OR-ed, so this only WIDENS delete;
--      the existing "Authorized users can delete deliveries" (user_can_delete())
--      policy is left untouched, and the finalized-match immutability trigger
--      still blocks deletes on COMPLETED/ABANDONED/CANCELLED matches.
--
-- Safe to run multiple times (idempotent).
-- ============================================================

-- ------------------------------------------------------------
-- 1. Permission helper functions (hardened with search_path)
--    NOTE: the production versions lacked `set search_path = public`;
--    adding it is a SECURITY DEFINER hardening best practice and matches
--    the convention used by current_app_role() in supabase_schema.sql.
-- ------------------------------------------------------------
create or replace function public.user_can_add()
returns boolean
language sql
security definer
set search_path = public
as $$ select can_add from public.profiles where id = auth.uid(); $$;

create or replace function public.user_can_edit()
returns boolean
language sql
security definer
set search_path = public
as $$ select can_edit from public.profiles where id = auth.uid(); $$;

create or replace function public.user_can_delete()
returns boolean
language sql
security definer
set search_path = public
as $$ select can_delete from public.profiles where id = auth.uid(); $$;

-- ------------------------------------------------------------
-- 2. Scorer/admin DELETE policy for deliveries (enables undo)
-- ------------------------------------------------------------
drop policy if exists deliveries_scorer_delete on deliveries;
create policy deliveries_scorer_delete on deliveries
for delete using (
  current_app_role() in ('SUPER_ADMIN','DISTRICT_ADMIN','SCORER')
  and exists (
    select 1 from matches m
    where m.id = match_id
      and m.status not in ('COMPLETED','ABANDONED','CANCELLED')
  )
);
