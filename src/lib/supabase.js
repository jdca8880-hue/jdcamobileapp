import { createClient } from '@supabase/supabase-js';

const env = (typeof process !== 'undefined' && process.env.VITE_SUPABASE_URL) 
  ? process.env 
  : import.meta.env;

const supabaseUrl = env.VITE_SUPABASE_URL;
const supabaseAnonKey = env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase credentials are missing. Check your .env file.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
