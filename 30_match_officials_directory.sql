-- ============================================================
-- 30_match_officials_directory.sql
--
-- PURPOSE
--   Let a SCORER (or anyone setting up a match) see the registered
--   scorers & umpires in the match-setup dropdowns.
--
--   Root cause: profiles SELECT RLS is `profiles_own_read` (id =
--   auth.uid()) — a non-admin can only read their OWN row, so the
--   officials dropdowns were empty for scorers. We do NOT want to
--   broaden profiles RLS (that would expose every column of every
--   user to all staff).
--
-- SOLUTION
--   A SECURITY DEFINER function that returns ONLY the few non-sensitive
--   fields needed for the dropdowns (id, name, role, can_score), and
--   ONLY for people who can actually be officials (scorers / umpires /
--   admins, or anyone flagged can_score). Callable by any authenticated
--   user. No table, column, policy, or existing function is changed.
--
-- SAFETY: purely additive + idempotent (create or replace). Nothing in
--   the current app breaks — this only ADDS a callable function.
--
-- APPLY: paste into the Supabase SQL editor and run. Safe to re-run.
-- ============================================================

create or replace function public.get_match_officials()
returns table (
  id uuid,
  full_name text,
  email text,
  role text,
  can_score boolean
)
language sql
stable
security definer
set search_path = public
as $$
  select p.id,
         p.full_name,
         p.email,
         p.role::text,
         coalesce(p.can_score, false) as can_score
  from profiles p
  where coalesce(p.is_active, true) = true
    -- Compare as text: the app_role enum has no UMPIRE value, so comparing the
    -- enum directly to 'UMPIRE' errors out. Casting to text keeps this robust
    -- even if an UMPIRE role (or a text role column) is introduced later.
    and (
      p.role::text in ('SCORER', 'SELECTOR', 'UMPIRE', 'SUPER_ADMIN', 'DISTRICT_ADMIN')
      or coalesce(p.can_score, false) = true
    )
  order by p.full_name;
$$;

-- Any signed-in user may read the officials directory for dropdowns.
grant execute on function public.get_match_officials() to authenticated;


-- ------------------------------------------------------------
-- Verify (optional — run after applying)
-- ------------------------------------------------------------
-- select * from public.get_match_officials();
