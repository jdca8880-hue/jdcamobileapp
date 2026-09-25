import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  const { data, error } = await supabase
    .from('players')
    .select('*, player_registrations(district:district_id(name), age_category:age_category_id(name))')
    .is('deleted_at', null)
    .limit(3);

  console.log('Error:', error);
  console.log('Data:', data);
}

run();
