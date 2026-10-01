BEGIN;

-- 1. Clean up existing orphaned matches
-- Soft-delete any matches where the parent tournament has been soft-deleted
UPDATE public.matches m
SET 
  deleted_at = t.deleted_at, 
  deleted_by = t.deleted_by
FROM public.tournaments t
WHERE m.tournament_id = t.id
  AND t.deleted_at IS NOT NULL
  AND m.deleted_at IS NULL;

-- 2. Create a trigger to automatically soft-delete matches when a tournament is soft-deleted
CREATE OR REPLACE FUNCTION public.cascade_tournament_soft_delete()
RETURNS TRIGGER AS $$
BEGIN
  -- If the tournament is being soft-deleted (deleted_at changes from NULL to NOT NULL)
  IF OLD.deleted_at IS NULL AND NEW.deleted_at IS NOT NULL THEN
    UPDATE public.matches
    SET 
      deleted_at = NEW.deleted_at,
      deleted_by = NEW.deleted_by
    WHERE tournament_id = NEW.id
      AND deleted_at IS NULL;
  END IF;

  -- If the tournament is being restored (deleted_at changes from NOT NULL to NULL)
  IF OLD.deleted_at IS NOT NULL AND NEW.deleted_at IS NULL THEN
    UPDATE public.matches
    SET 
      deleted_at = NULL,
      deleted_by = NULL
    WHERE tournament_id = NEW.id
      -- Only restore matches that were deleted at the exact same time
      AND deleted_at = OLD.deleted_at;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_cascade_tournament_soft_delete ON public.tournaments;
CREATE TRIGGER trg_cascade_tournament_soft_delete
AFTER UPDATE OF deleted_at ON public.tournaments
FOR EACH ROW
EXECUTE FUNCTION public.cascade_tournament_soft_delete();

COMMIT;
