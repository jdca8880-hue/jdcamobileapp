-- Missing RLS Policies for junction and registration tables

-- 11. Team Players
ALTER TABLE team_players ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Anyone can view team_players" ON team_players;
DROP POLICY IF EXISTS "Admins and Selectors can insert team_players" ON team_players;
DROP POLICY IF EXISTS "Admins and Selectors can update team_players" ON team_players;
DROP POLICY IF EXISTS "Super admins can delete team_players" ON team_players;

CREATE POLICY "Anyone can view team_players" ON team_players FOR SELECT USING (true);
CREATE POLICY "Admins and Selectors can insert team_players" ON team_players FOR INSERT WITH CHECK (get_user_role() IN ('SUPER_ADMIN', 'DISTRICT_ADMIN', 'SELECTOR'));
CREATE POLICY "Admins and Selectors can update team_players" ON team_players FOR UPDATE USING (get_user_role() IN ('SUPER_ADMIN', 'DISTRICT_ADMIN', 'SELECTOR'));
CREATE POLICY "Super admins can delete team_players" ON team_players FOR DELETE USING (get_user_role() = 'SUPER_ADMIN');

-- 12. Tournament Teams
ALTER TABLE tournament_teams ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Anyone can view tournament_teams" ON tournament_teams;
DROP POLICY IF EXISTS "Admins can insert tournament_teams" ON tournament_teams;
DROP POLICY IF EXISTS "Admins can update tournament_teams" ON tournament_teams;
DROP POLICY IF EXISTS "Super admins can delete tournament_teams" ON tournament_teams;

CREATE POLICY "Anyone can view tournament_teams" ON tournament_teams FOR SELECT USING (true);
CREATE POLICY "Admins can insert tournament_teams" ON tournament_teams FOR INSERT WITH CHECK (get_user_role() IN ('SUPER_ADMIN', 'DISTRICT_ADMIN'));
CREATE POLICY "Admins can update tournament_teams" ON tournament_teams FOR UPDATE USING (get_user_role() IN ('SUPER_ADMIN', 'DISTRICT_ADMIN'));
CREATE POLICY "Super admins can delete tournament_teams" ON tournament_teams FOR DELETE USING (get_user_role() = 'SUPER_ADMIN');

-- 13. Match Rosters
ALTER TABLE match_rosters ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Anyone can view match_rosters" ON match_rosters;
DROP POLICY IF EXISTS "Admins and Scorers can insert match_rosters" ON match_rosters;
DROP POLICY IF EXISTS "Admins and Scorers can update match_rosters" ON match_rosters;
DROP POLICY IF EXISTS "Super admins can delete match_rosters" ON match_rosters;

CREATE POLICY "Anyone can view match_rosters" ON match_rosters FOR SELECT USING (true);
CREATE POLICY "Admins and Scorers can insert match_rosters" ON match_rosters FOR INSERT WITH CHECK (get_user_role() IN ('SUPER_ADMIN', 'DISTRICT_ADMIN', 'SCORER'));
CREATE POLICY "Admins and Scorers can update match_rosters" ON match_rosters FOR UPDATE USING (get_user_role() IN ('SUPER_ADMIN', 'DISTRICT_ADMIN', 'SCORER'));
CREATE POLICY "Super admins can delete match_rosters" ON match_rosters FOR DELETE USING (get_user_role() = 'SUPER_ADMIN');

-- 14. Player Registrations
ALTER TABLE player_registrations ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Anyone can view player_registrations" ON player_registrations;
DROP POLICY IF EXISTS "Anyone can insert player_registrations" ON player_registrations;
DROP POLICY IF EXISTS "Admins can update player_registrations" ON player_registrations;
DROP POLICY IF EXISTS "Super admins can delete player_registrations" ON player_registrations;

CREATE POLICY "Anyone can view player_registrations" ON player_registrations FOR SELECT USING (true);
CREATE POLICY "Anyone can insert player_registrations" ON player_registrations FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins can update player_registrations" ON player_registrations FOR UPDATE USING (get_user_role() IN ('SUPER_ADMIN', 'DISTRICT_ADMIN'));
CREATE POLICY "Super admins can delete player_registrations" ON player_registrations FOR DELETE USING (get_user_role() = 'SUPER_ADMIN');
