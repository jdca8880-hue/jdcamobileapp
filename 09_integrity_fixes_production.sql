-- JDCA Production Deployment: Integrity Fixes

BEGIN;

-- 1. Prevent orphans by changing ON DELETE SET NULL to ON DELETE RESTRICT for matches.tournament_id
ALTER TABLE public.matches 
  DROP CONSTRAINT IF EXISTS matches_tournament_id_fkey;

ALTER TABLE public.matches 
  ADD CONSTRAINT matches_tournament_id_fkey 
  FOREIGN KEY (tournament_id) 
  REFERENCES public.tournaments(id) 
  ON DELETE RESTRICT;

-- 2. Server-side Immutability for Completed Matches
CREATE OR REPLACE FUNCTION public.check_match_immutable()
RETURNS TRIGGER AS $$
DECLARE
  v_match_status VARCHAR;
  v_match_id UUID;
BEGIN
  IF TG_TABLE_NAME = 'matches' THEN
    IF TG_OP = 'UPDATE' THEN
      v_match_status := OLD.status;
      IF v_match_status IN ('COMPLETED', 'CANCELLED', 'FINISHED', 'ABANDONED') THEN
        RAISE EXCEPTION 'Cannot modify a match that is already finalized (%).', v_match_status;
      END IF;
    ELSIF TG_OP = 'DELETE' THEN
      v_match_status := OLD.status;
      IF v_match_status IN ('COMPLETED', 'CANCELLED', 'FINISHED', 'ABANDONED') THEN
        RAISE EXCEPTION 'Cannot delete a match that is already finalized (%).', v_match_status;
      END IF;
    END IF;
  ELSE
    IF TG_OP = 'INSERT' OR TG_OP = 'UPDATE' THEN
      v_match_id := NEW.match_id;
    ELSIF TG_OP = 'DELETE' THEN
      v_match_id := OLD.match_id;
    END IF;
    
    SELECT status INTO v_match_status FROM public.matches WHERE id = v_match_id;
    
    IF v_match_status IN ('COMPLETED', 'CANCELLED', 'FINISHED', 'ABANDONED') THEN
      RAISE EXCEPTION 'Cannot modify % because the match is already finalized (%).', TG_TABLE_NAME, v_match_status;
    END IF;
  END IF;
  
  IF TG_OP = 'DELETE' THEN
    RETURN OLD;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply triggers
DROP TRIGGER IF EXISTS trg_deliveries_immutable ON public.deliveries;
CREATE TRIGGER trg_deliveries_immutable
BEFORE INSERT OR UPDATE OR DELETE ON public.deliveries
FOR EACH ROW EXECUTE FUNCTION public.check_match_immutable();

DROP TRIGGER IF EXISTS trg_innings_immutable ON public.innings;
CREATE TRIGGER trg_innings_immutable
BEFORE INSERT OR UPDATE OR DELETE ON public.innings
FOR EACH ROW EXECUTE FUNCTION public.check_match_immutable();

DROP TRIGGER IF EXISTS trg_match_rosters_immutable ON public.match_rosters;
CREATE TRIGGER trg_match_rosters_immutable
BEFORE INSERT OR UPDATE OR DELETE ON public.match_rosters
FOR EACH ROW EXECUTE FUNCTION public.check_match_immutable();

DROP TRIGGER IF EXISTS trg_matches_immutable ON public.matches;
CREATE TRIGGER trg_matches_immutable
BEFORE UPDATE OR DELETE ON public.matches
FOR EACH ROW EXECUTE FUNCTION public.check_match_immutable();

COMMIT;
