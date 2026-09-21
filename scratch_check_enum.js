import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

async function checkEnum() {
  const { data, error } = await supabase.rpc('get_enum_values', { enum_type: 'gender_category' });
  if (error) {
    console.error('Error fetching via RPC, trying a raw query or just inserting to see error:', error);
  } else {
    console.log('Enum values:', data);
  }
}

checkEnum();
