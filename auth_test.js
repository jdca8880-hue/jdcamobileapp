import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function authAndRun() {
  console.log("Signing up test user...");
  const email = `test_admin_${Date.now()}@example.com`;
  const password = "password123";
  
  const { data: authData, error: authErr } = await supabase.auth.signUp({
    email,
    password
  });
  
  if (authErr) {
    console.error("Signup failed:", authErr.message);
    // If signup fails, try logging in with a known user or just proceed
    // (It might be disabled in production)
  } else {
    console.log("Logged in as", authData.user?.id);
  }

  // Try to create tournament
  const { data: testTournament, error: tErr } = await supabase.from('tournaments').insert({
    name: 'Test Tournament ' + Date.now(),
    type: 'KNOCKOUT',
    start_date: new Date().toISOString(),
    status: 'UPCOMING'
  }).select().single();

  if (tErr) {
    console.error("Failed to create tournament. RLS is likely blocking the anon/test user:", tErr);
    return;
  }
  
  console.log("Tournament created:", testTournament.id);
}

authAndRun();
