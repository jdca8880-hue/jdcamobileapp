import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();
const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

async function testRosterInsert() {
  console.log("Testing RLS on match_rosters with anon key...");
  const { data: match } = await supabase.from('matches').select('id, home_team_id').limit(1).single();
  const { data: player } = await supabase.from('players').select('id').limit(1).single();
  
  if (!match || !player) {
    console.log("Need a match and player to test.");
    return;
  }
  
  const payload = {
    match_id: match.id,
    team_id: match.home_team_id,
    player_id: player.id,
    is_playing_xi: true,
  };
  
  const { error } = await supabase.from('match_rosters').insert([payload]);
  console.log("Insert result:", error ? error.message : "Success!");
}
testRosterInsert();
