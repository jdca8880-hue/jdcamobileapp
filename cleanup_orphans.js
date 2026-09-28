import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

async function cleanup() {
  console.log("=== DB CLEANUP ===");
  const { data: matches } = await supabase.from('matches').select('*');
  const { data: tournaments } = await supabase.from('tournaments').select('*');
  
  const invalidMatches = matches.filter(m => !tournaments.find(t => t.id === m.tournament_id));
  for (const m of invalidMatches) {
    await supabase.from('matches').delete().eq('id', m.id);
    console.log(`Deleted orphan match: ${m.id}`);
  }
}
cleanup();
