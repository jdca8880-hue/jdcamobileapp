import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
);

async function testQuery() {
  const { data, error } = await supabase
    .from('deliveries')
    .select('*, striker:players!striker_id(name), bowler:players!bowler_id(name)')
    .limit(1);
    
  console.log("Error:", error);
}

testQuery();
