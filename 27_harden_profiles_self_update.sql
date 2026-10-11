-- 27_harden_profiles_self_update.sql
-- PURPOSE: Close a privilege-escalation gap introduced when can_score was added.
--
-- WHY: profiles_own_update (supabase_schema.sql) lets a user update their own
-- profile row, and its WITH CHECK pins role, is_active, can_view, can_add,
-- can_edit and can_delete to their CURRENT values so a user cannot elevate
-- themselves. But 24_can_score_capability.sql later added the can_score column
-- WITHOUT adding it to that pin. Because can_user_score() grants live-scoring
-- write access (matches/innings/deliveries/rosters) to anyone with can_score =
-- true, a non-privileged authenticated user could run:
--     update profiles set can_score = true where id = auth.uid();
-- and silently grant themselves scoring rights. This recreates the policy with
-- can_score pinned as well, so only an admin (profiles_admin_update) can change it.
--
-- Self-contained and idempotent. Run in the Supabase SQL editor.

BEGIN;

alter table public.profiles enable row level security;

drop policy if exists profiles_own_update on public.profiles;
create policy profiles_own_update on public.profiles
for update using (id = auth.uid())
with check (
  id = auth.uid()
  and role      = (select role      from public.profiles where id = auth.uid())
  and is_active = (select is_active from public.profiles where id = auth.uid())
  and can_view  = (select can_view  from public.profiles where id = auth.uid())
  and can_add   = (select can_add   from public.profiles where id = auth.uid())
  and can_edit  = (select can_edit  from public.profiles where id = auth.uid())
  and can_delete= (select can_delete from public.profiles where id = auth.uid())
  and can_score = (select can_score from public.profiles where id = auth.uid())
);

COMMIT;

-- ============================================================================
-- VERIFICATION (run separately)
-- ============================================================================

-- As a NON-admin user, this should now be rejected by RLS (0 rows / policy error):
--   update public.profiles set can_score = true where id = auth.uid();

-- Confirm the policy exists and references can_score:
-- select polname, pg_get_expr(polwithcheck, polrelid) as with_check
-- from pg_policy where polname = 'profiles_own_update';
