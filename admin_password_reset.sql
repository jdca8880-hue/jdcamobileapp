-- This function allows a SUPER_ADMIN to directly change any user's password 
-- in the Supabase auth.users table without sending a reset email.

CREATE OR REPLACE FUNCTION public.admin_reset_password(target_user_id uuid, new_password text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- 1. Verify the caller is a SUPER_ADMIN using the existing helper function
  IF get_user_role() != 'SUPER_ADMIN' THEN
    RAISE EXCEPTION 'Access Denied: Only Super Admins can reset passwords directly';
  END IF;

  -- 2. Update the password in auth.users using the pgcrypto extension
  UPDATE auth.users
  SET encrypted_password = extensions.crypt(new_password, extensions.gen_salt('bf'))
  WHERE id = target_user_id;
END;
$$;
