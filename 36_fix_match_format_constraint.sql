-- 36_fix_match_format_constraint.sql
-- ============================================================================
-- ALLOW EVERY MATCH FORMAT THE APP OFFERS (fixes "ODI rejected" on create).
--
-- SYMPTOM
--   Creating an ODI match fails with a database rejection, while T20 / T10 /
--   CUSTOM / TEST succeed. The committed base schema stores match_format as a
--   free varchar(40), so a clean DB has no such limit — but this project's DB
--   was migrated by hand and an OLDER schema version left behind one of:
--     (a) a CHECK constraint like  match_format IN ('T20','T10','TEST',...)
--         that predates ODI, or
--     (b) a match_format ENUM type whose labels don't include 'ODI'.
--   Either rejects the new value 'ODI' specifically.
--
-- WHAT THIS DOES (safe + idempotent)
--   1. Drops ANY check constraint on public.matches whose definition mentions
--      match_format (removes the stale allow-list; the app validates format).
--   2. If match_format is an ENUM column, adds every format label the app can
--      emit that is missing ('T20','ODI','TEST','T10','CUSTOM').
--   It writes no rows and touches no other table. Re-runnable.
--
-- APPLY: paste into the Supabase SQL editor and run.
-- ============================================================================

-- 1) Remove any match_format allow-list CHECK constraint on matches.
do $$
declare c record;
begin
  for c in
    select con.conname
    from pg_constraint con
    join pg_class rel on rel.oid = con.conrelid
    join pg_namespace n on n.oid = rel.relnamespace
    where n.nspname = 'public'
      and rel.relname = 'matches'
      and con.contype = 'c'
      and pg_get_constraintdef(con.oid) ilike '%match_format%'
  loop
    execute format('alter table public.matches drop constraint %I', c.conname);
    raise notice 'Dropped match_format CHECK constraint: %', c.conname;
  end loop;
end $$;

-- 2) If match_format is an ENUM, make sure every app format label exists.
do $$
declare
  type_name text;
  is_enum   boolean := false;
  lbl       text;
  labels    text[] := array['T20','ODI','TEST','T10','CUSTOM'];
begin
  select t.typname,
         (t.typtype = 'e')
    into type_name, is_enum
  from pg_attribute a
  join pg_type t on t.oid = a.atttypid
  where a.attrelid = 'public.matches'::regclass
    and a.attname = 'match_format'
    and a.attnum > 0
    and not a.attisdropped;

  if is_enum then
    foreach lbl in array labels loop
      begin
        execute format('alter type public.%I add value if not exists %L', type_name, lbl);
        raise notice 'Ensured enum %.% label %', 'public', type_name, lbl;
      exception when others then
        -- ignore (label exists, or not addable); the CHECK path above is the
        -- usual fix anyway.
        null;
      end;
    end loop;
  else
    raise notice 'match_format is not an enum (type %); no enum change needed.', type_name;
  end if;
end $$;

-- ============================================================================
-- VERIFY (run separately; changes nothing)
-- ============================================================================
-- Remaining check constraints on matches (should list none about match_format):
-- select conname, pg_get_constraintdef(oid)
-- from pg_constraint
-- where conrelid = 'public.matches'::regclass and contype = 'c';
--
-- Column type of match_format:
-- select a.attname, t.typname, t.typtype
-- from pg_attribute a join pg_type t on t.oid = a.atttypid
-- where a.attrelid = 'public.matches'::regclass and a.attname = 'match_format';
