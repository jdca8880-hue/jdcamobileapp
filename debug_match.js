import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env' });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  const { data, error } = await supabase.from('matches').insert({
    tournament_id: '158df532-613d-4c38-89c5-a13a07fc240a',
    home_team_id: '158df532-613d-4c38-89c5-a13a07fc240a',
    away_team_id: '158df532-613d-4c38-89c5-a13a07fc240a',
    scheduled_at: new Date().toISOString(),
    status: 'SCHEDULED',
    match_format: 'T20',
    max_overs: 20
  }).select();
  
  console.log("Error:", error);
}

run();
