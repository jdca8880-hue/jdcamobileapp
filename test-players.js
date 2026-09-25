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

  if (error) {
    console.error('Error fetching players:', error);
  } else {
    console.log('Players array:');
    console.dir(data, { depth: null });
  }
}

run();
