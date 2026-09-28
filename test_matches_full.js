import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

async function testMatchesExpanded() {
  console.log("=== MATCHES WITH FULL SELECT (as app uses) ===\n");

  const { data, error } = await supabase
    .from('matches')
    .select('*, tournaments!inner(id), home_team:home_team_id(*), away_team:away_team_id(*), man_of_the_match:man_of_the_match_id(id, full_name, avatar_url)')
    .is('deleted_at', null);
    
  if (error) {
    console.log('ERROR:', error.message, error.code);
    return;
  }

  console.log('Matches found:', data.length);
  for (const m of data) {
    console.log(`  Match: ${m.id}`);
    console.log(`    tournament_id: ${m.tournament_id}`);
    console.log(`    status: ${m.status}`);
    console.log(`    home_team: ${m.home_team?.name}`);
    console.log(`    away_team: ${m.away_team?.name}`);
    console.log(`    deleted_at: ${m.deleted_at}`);
  }
}

testMatchesExpanded();
