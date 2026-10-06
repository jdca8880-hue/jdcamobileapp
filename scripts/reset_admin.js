import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

async function run() {
  // Try to find the superadmin profile
  const { data: profiles, error } = await supabase.from('profiles').select('*').limit(10);
  console.log('Profiles:', profiles);
  
  if (profiles) {
    const admin = profiles.find(p => p.role === 'SUPERADMIN' || p.role === 'ADMIN');
    if (admin) {
      console.log('Found Admin:', admin);
      // Try to reset password
      const { data: rpcData, error: rpcError } = await supabase.rpc('admin_reset_password', {
        target_user_id: admin.id,
        new_password: 'new_password123!'
      });
      console.log('RPC Result:', rpcData, 'Error:', rpcError);
    }
  }
}
run();
