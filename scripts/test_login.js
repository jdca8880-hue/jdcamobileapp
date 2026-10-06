import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

async function run() {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: 'jdca8880@gmail.com',
    password: 'SuperAdmin@2026!'
  });
  
  if (error) {
    console.error('Login Failed:', error.message);
  } else {
    console.log('Login Success for:', data.user.email);
  }
}
run();
