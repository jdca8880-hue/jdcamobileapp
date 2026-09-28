import dotenv from 'dotenv';
dotenv.config();
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

async function run() {
  const p = await supabase.from('players').select('id').is('deleted_at', null).limit(1);
  console.log("Players Error:", p.error?.message);

  const m = await supabase.from('matches').select('id').is('deleted_at', null).limit(1);
  console.log("Matches Error:", m.error?.message);

  const t = await supabase.from('tournaments').select('id').is('deleted_at', null).limit(1);
  console.log("Tournaments Error:", t.error?.message);
}
run();
