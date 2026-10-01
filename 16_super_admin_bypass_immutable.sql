BEGIN;

CREATE OR REPLACE FUNCTION public.check_match_immutable()
RETURNS TRIGGER AS $$
DECLARE
  v_match_status VARCHAR;
  v_match_id UUID;
  v_role VARCHAR;
BEGIN
  -- Bypass all immutability checks if the user is a SUPER_ADMIN
  v_role := get_user_role();
  IF v_role = 'SUPER_ADMIN' THEN
    IF TG_OP = 'DELETE' THEN
      RETURN OLD;
    ELSE
      RETURN NEW;
    END IF;
  END IF;

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

COMMIT;
