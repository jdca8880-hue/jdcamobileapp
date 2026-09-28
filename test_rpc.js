import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

async function testRPC() {
  const { data, error } = await supabase.rpc('exec_sql', { sql_string: 'SELECT 1;' });
  console.log("RPC Error:", error);
  console.log("RPC Data:", data);
}

testRPC();
