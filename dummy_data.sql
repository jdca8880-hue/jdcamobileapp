-- ==============================================================================
-- JDCA Dummy Data Script
-- WARNING: Development/test fixture — never executed automatically in production.
-- Run this in your Supabase SQL Editor after running the main schema.
-- It uses DO block to fetch existing UUIDs and link everything automatically.
-- ==============================================================================

DO $$
DECLARE
  jbp_id uuid;
  ktn_id uuid;
  snr_id uuid;
  ven_id uuid;
  tourn_id uuid;
  team_home_id uuid;
  team_away_id uuid;
  p1_id uuid; p2_id uuid; p3_id uuid; p4_id uuid;
  match_1_id uuid;
BEGIN
  -- 1. Fetch Existing Reference Data (Districts & Age Categories)
  SELECT id INTO jbp_id FROM districts WHERE code = 'JBP' LIMIT 1;
  SELECT id INTO ktn_id FROM districts WHERE code = 'KTN' LIMIT 1;
  SELECT id INTO snr_id FROM age_categories WHERE short_name = 'Senior' LIMIT 1;

  IF jbp_id IS NULL OR ktn_id IS NULL OR snr_id IS NULL THEN
      RAISE EXCEPTION 'Reference data not found. Please ensure districts and age_categories are seeded.';
  END IF;

  -- 2. Create Venues
  INSERT INTO venues (district_id, name, pitch_type, has_floodlights)
  VALUES (jbp_id, 'Ranital Sports Stadium', 'Turf', true)
  RETURNING id INTO ven_id;

  -- 3. Create Dummy Players
  INSERT INTO players (full_name, date_of_birth, gender, primary_role, batting_style, bowling_style)
  VALUES ('Virat Sharma', '1995-05-10', 'Men', 'Batter', 'Right-Hand Bat', 'None (Pure Batter)')
  RETURNING id INTO p1_id;

  INSERT INTO players (full_name, date_of_birth, gender, primary_role, batting_style, bowling_style)
  VALUES ('Rohit Singh', '1996-08-15', 'Men', 'Batter', 'Right-Hand Bat', 'Right-Arm Off Spin')
  RETURNING id INTO p2_id;

  INSERT INTO players (full_name, date_of_birth, gender, primary_role, batting_style, bowling_style)
  VALUES ('Bumrah Patel', '1998-12-01', 'Men', 'Bowler', 'Right-Hand Bat', 'Right-Arm Fast')
  RETURNING id INTO p3_id;

  INSERT INTO players (full_name, date_of_birth, gender, primary_role, batting_style, bowling_style)
  VALUES ('MS Dhoni', '1992-07-07', 'Men', 'Wicket Keeper', 'Right-Hand Bat', 'None (WK)')
  RETURNING id INTO p4_id;

  -- 4. Create Teams
  INSERT INTO teams (name, short_name, season, district_id, age_category_id, gender)
  VALUES ('Jabalpur Jaguars', 'JBP-J', '2026', jbp_id, snr_id, 'Men')
  RETURNING id INTO team_home_id;

  INSERT INTO teams (name, short_name, season, district_id, age_category_id, gender)
  VALUES ('Katni Kings', 'KTN-K', '2026', ktn_id, snr_id, 'Men')
  RETURNING id INTO team_away_id;

  -- 5. Assign Players to Teams
  INSERT INTO team_players (team_id, player_id) VALUES 
  (team_home_id, p1_id),
  (team_home_id, p3_id),
  (team_away_id, p2_id),
  (team_away_id, p4_id);

  -- 6. Create a Tournament
  INSERT INTO tournaments (name, season, format, age_category_id, gender, status)
  VALUES ('Inter-District T20 Championship', '2026', 'T20', snr_id, 'Men', 'ONGOING')
  RETURNING id INTO tourn_id;

  -- Link Teams to Tournament
  INSERT INTO tournament_teams (tournament_id, team_id) VALUES 
  (tourn_id, team_home_id),
  (tourn_id, team_away_id);

  -- 7. Create Matches
  INSERT INTO matches (tournament_id, venue_id, home_team_id, away_team_id, match_format, max_overs, status)
  VALUES (tourn_id, ven_id, team_home_id, team_away_id, 'T20', 20, 'SCHEDULED')
  RETURNING id INTO match_1_id;

  -- 8. Setup Match Rosters
  INSERT INTO match_rosters (match_id, team_id, player_id, is_playing_xi, is_captain, is_wicketkeeper)
  VALUES 
  (match_1_id, team_home_id, p1_id, true, true, false),
  (match_1_id, team_home_id, p3_id, true, false, false),
  (match_1_id, team_away_id, p2_id, true, true, false),
  (match_1_id, team_away_id, p4_id, true, false, true);

END $$;
