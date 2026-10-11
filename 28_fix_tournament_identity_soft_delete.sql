-- 28_fix_tournament_identity_soft_delete.sql
-- PURPOSE: Fix "duplicate tournament" errors when creating a tournament whose
-- name/season/category/gender matches a tournament that was already SOFT-DELETED.
--
-- WHY: 10_state_machine_and_tournaments.sql created
--     tournaments_identity_unique_idx on (name, season, age_category_id, gender)
-- with NO "where deleted_at is null" clause. Soft-deleted tournaments keep their
-- row (deleted_at is set, hidden from the UI), so that row still occupies the
-- unique identity. Recreating a tournament with the same identity then hits a
-- 23505 unique violation -> the app shows "duplicate tournament" even though no
-- such tournament is visible anywhere. The matches table already does this
-- correctly (matches_fixture_unique_idx ... where deleted_at is null); this
-- brings tournaments in line.
--
-- Safe to run: it only enforces uniqueness among LIVE (non-deleted) tournaments.
-- If two ACTIVE tournaments already share an identity, the index rebuild will
-- fail and tell you — resolve that duplicate first, then re-run.
--
-- Idempotent and self-contained. Run in the Supabase SQL editor.

BEGIN;

drop index if exists tournaments_identity_unique_idx;

create unique index tournaments_identity_unique_idx
  on tournaments (name, season, age_category_id, gender)
  where deleted_at is null;

COMMIT;

-- ============================================================================
-- VERIFICATION (run separately)
-- ============================================================================

-- a) Confirm the index is now partial (indexpred should be non-null):
-- select indexname, indexdef from pg_indexes
-- where indexname = 'tournaments_identity_unique_idx';

-- b) If the rebuild failed, find the live duplicates to clean up first:
-- select name, season, age_category_id, gender, count(*)
-- from tournaments where deleted_at is null
-- group by name, season, age_category_id, gender
-- having count(*) > 1;
