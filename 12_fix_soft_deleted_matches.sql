BEGIN;

-- Soft-delete any matches where the parent tournament has already been soft-deleted
UPDATE matches m
SET deleted_at = t.deleted_at
FROM tournaments t
WHERE m.tournament_id = t.id
  AND t.deleted_at IS NOT NULL
  AND m.deleted_at IS NULL;

COMMIT;
