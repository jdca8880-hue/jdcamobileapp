BEGIN;

-- 1. Delete all matches that are currently orphaned (have no tournament)
DELETE FROM matches WHERE tournament_id IS NULL;

-- 2. Drop the existing foreign key constraint
-- (Note: In Supabase/PostgreSQL, the default naming convention for this constraint is matches_tournament_id_fkey)
ALTER TABLE matches DROP CONSTRAINT IF EXISTS matches_tournament_id_fkey;

-- 3. Add the new constraint enforcing ON DELETE CASCADE
ALTER TABLE matches 
  ADD CONSTRAINT matches_tournament_id_fkey 
  FOREIGN KEY (tournament_id) 
  REFERENCES tournaments(id) 
  ON DELETE CASCADE;

-- 4. Enforce NOT NULL on tournament_id so no future matches can exist without a tournament
ALTER TABLE matches ALTER COLUMN tournament_id SET NOT NULL;

COMMIT;
