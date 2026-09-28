import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

async function checkDB() {
  console.log("=== DB SCHEMA & DATA AUDIT ===");

  // 1. Teams
  const { data: teams, error: e1 } = await supabase.from('teams').select('*');
  console.log(`Teams count: ${teams?.length} (Error: ${e1?.message})`);

  // 2. Age Categories
  const { data: ageCategories } = await supabase.from('age_categories').select('*');
  console.log(`Age Categories:`, ageCategories?.map(c => ({ id: c.id, name: c.name })));

  // 3. Tournaments
  const { data: tournaments, error: e2 } = await supabase.from('tournaments').select('*');
  console.log(`Tournaments count: ${tournaments?.length} (Error: ${e2?.message})`);

  // 4. Matches
  const { data: matches, error: e3 } = await supabase.from('matches').select('*');
  console.log(`Matches count: ${matches?.length} (Error: ${e3?.message})`);
  if (matches && matches.length > 0) {
    const m = matches[0];
    console.log("Sample Match Columns:", Object.keys(m).join(', '));
  }

  // 5. Orphan Checks
  if (matches) {
    const invalidTournament = matches.filter(m => !tournaments.find(t => t.id === m.tournament_id));
    const invalidHomeTeam = matches.filter(m => !teams.find(t => t.id === m.home_team_id));
    console.log(`Orphan Matches (Invalid Tournament): ${invalidTournament.length}`);
    console.log(`Orphan Matches (Invalid Home Team): ${invalidHomeTeam.length}`);
  }

  if (teams) {
    const invalidAgeCat = teams.filter(t => !ageCategories?.find(c => c.id === t.age_category_id));
    console.log(`Orphan Teams (Invalid Age Category): ${invalidAgeCat.length}`);
  }
}
checkDB();
