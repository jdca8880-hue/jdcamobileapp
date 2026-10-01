BEGIN;

-- Drop all possible old DELETE policies for Tournaments
DROP POLICY IF EXISTS "Super admins can delete tournaments" ON tournaments;
DROP POLICY IF EXISTS tournaments_super_admin_delete ON tournaments;

-- Create an absolute DELETE policy for Tournaments for SUPER_ADMIN
CREATE POLICY "Super admins can delete tournaments" ON tournaments
FOR DELETE USING (
  get_user_role() = 'SUPER_ADMIN' OR current_app_role() = 'SUPER_ADMIN'
);

-- Drop all possible old DELETE policies for Matches
DROP POLICY IF EXISTS "Super admins can delete matches" ON matches;
DROP POLICY IF EXISTS matches_super_admin_delete ON matches;

-- Create an absolute DELETE policy for Matches for SUPER_ADMIN
CREATE POLICY "Super admins can delete matches" ON matches
FOR DELETE USING (
  get_user_role() = 'SUPER_ADMIN' OR current_app_role() = 'SUPER_ADMIN'
);

-- Drop all possible old DELETE policies for Players
DROP POLICY IF EXISTS "Super admins can delete players" ON players;
DROP POLICY IF EXISTS players_super_admin_delete ON players;

-- Create an absolute DELETE policy for Players for SUPER_ADMIN
CREATE POLICY "Super admins can delete players" ON players
FOR DELETE USING (
  get_user_role() = 'SUPER_ADMIN' OR current_app_role() = 'SUPER_ADMIN'
);

-- Drop all possible old DELETE policies for Teams
DROP POLICY IF EXISTS "Super admins can delete teams" ON teams;
DROP POLICY IF EXISTS teams_super_admin_delete ON teams;

-- Create an absolute DELETE policy for Teams for SUPER_ADMIN
CREATE POLICY "Super admins can delete teams" ON teams
FOR DELETE USING (
  get_user_role() = 'SUPER_ADMIN' OR current_app_role() = 'SUPER_ADMIN'
);

COMMIT;
