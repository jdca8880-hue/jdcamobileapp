CREATE OR REPLACE FUNCTION public.check_match_immutable()
RETURNS TRIGGER AS $$
DECLARE
  v_match_status VARCHAR;
  v_match_deleted_at TIMESTAMPTZ;
  v_match_id UUID;
BEGIN
  IF TG_TABLE_NAME = 'matches' THEN
    IF TG_OP = 'UPDATE' THEN
      v_match_status := OLD.status;
      
      -- EXCEPTION: Allow soft deletion (setting deleted_at) even if the match is completed
      IF OLD.deleted_at IS NULL AND NEW.deleted_at IS NOT NULL THEN
        RETURN NEW;
      END IF;

      -- EXCEPTION: Allow restoring (un-setting deleted_at) even if the match is completed
      IF OLD.deleted_at IS NOT NULL AND NEW.deleted_at IS NULL THEN
        RETURN NEW;
      END IF;

      IF v_match_status IN ('COMPLETED', 'CANCELLED', 'FINISHED', 'ABANDONED') THEN
        RAISE EXCEPTION 'Cannot modify a match that is already finalized (%).', v_match_status;
      END IF;
    ELSIF TG_OP = 'DELETE' THEN
      v_match_status := OLD.status;
      
      -- EXCEPTION: Allow hard deletion if the match is ALREADY soft-deleted (in the recycle bin)
      IF OLD.deleted_at IS NOT NULL THEN
        RETURN OLD;
      END IF;

      IF v_match_status IN ('COMPLETED', 'CANCELLED', 'FINISHED', 'ABANDONED') THEN
        RAISE EXCEPTION 'Cannot delete a match that is already finalized (%).', v_match_status;
      END IF;
    END IF;
  ELSE
    IF TG_OP = 'INSERT' OR TG_OP = 'UPDATE' THEN
      v_match_id := NEW.match_id;
    ELSE
      v_match_id := OLD.match_id;
    END IF;

    SELECT status, deleted_at INTO v_match_status, v_match_deleted_at FROM public.matches WHERE id = v_match_id;
    
    -- EXCEPTION: Allow hard deletion of child records (deliveries, innings, rosters) 
    -- if the match is already soft-deleted. This allows emptying the recycle bin.
    IF TG_OP = 'DELETE' AND v_match_deleted_at IS NOT NULL THEN
      RETURN OLD;
    END IF;

    IF v_match_status IN ('COMPLETED', 'CANCELLED', 'FINISHED', 'ABANDONED') THEN
      RAISE EXCEPTION 'Cannot modify match data (%) because the match is already finalized (%).', TG_TABLE_NAME, v_match_status;
    END IF;
  END IF;

  IF TG_OP = 'DELETE' THEN
    RETURN OLD;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
