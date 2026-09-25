import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing SUPABASE URL or SERVICE ROLE KEY");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  const sql = fs.readFileSync(path.join(process.cwd(), '06_match_finalization_policies.sql'), 'utf-8');
  
  const { data, error } = await supabase.rpc('exec_sql', { sql_string: sql });
  if (error) {
    console.error('Failed to execute SQL via RPC:', error);
    
    // Attempt REST approach if RPC doesn't exist
    const parts = sql.split(';');
    for(const part of parts) {
      if(part.trim() === '') continue;
      // We can't actually do this easily via REST API. Let's just output instructions if exec_sql fails.
      console.log('You might need to run this directly in the Supabase SQL editor.');
    }
  } else {
    console.log('Successfully updated RLS policies.');
  }
}

run();
