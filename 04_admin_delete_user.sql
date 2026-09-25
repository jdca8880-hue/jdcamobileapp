-- SQL Migration to allow Super Admins to securely delete users from Supabase Auth

CREATE OR REPLACE FUNCTION admin_delete_user(target_user_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_caller_role text;
BEGIN
  -- 1. Get the role of the user calling this function
  SELECT role INTO v_caller_role FROM public.profiles WHERE id = auth.uid();
  
  -- 2. Check if the caller has SUPER_ADMIN privileges
  IF v_caller_role != 'SUPER_ADMIN' THEN
    RAISE EXCEPTION 'Only Super Admins can delete users completely.';
  END IF;

  -- 3. Delete the user from auth.users
  -- This will automatically cascade to public.profiles if your foreign keys are set up correctly with ON DELETE CASCADE.
  -- If not, you might need to also do: DELETE FROM public.profiles WHERE id = target_user_id;
  DELETE FROM auth.users WHERE id = target_user_id;
  
END;
$$;
