import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

async function testMatchesQuery() {
  console.log("=== TESTING MATCHES QUERIES ===\n");

  // Test 1: matches without inner join
  const { data: d1, error: e1 } = await supabase
    .from('matches')
    .select('id, tournament_id, status')
    .is('deleted_at', null);
  console.log("1. Matches WITHOUT inner join:", d1?.length ?? 'error', e1?.message || '');

  // Test 2: matches WITH inner join (what the app uses)
  const { data: d2, error: e2 } = await supabase
    .from('matches')
    .select('id, tournament_id, status, tournaments!inner(id)')
    .is('deleted_at', null);
  console.log("2. Matches WITH inner join on tournaments:", d2?.length ?? 'error', e2?.message || '');

  // Test 3: tournaments visible
  const { data: d3, error: e3 } = await supabase
    .from('tournaments')
    .select('id, name')
    .is('deleted_at', null);
  console.log("3. Tournaments visible:", d3?.length ?? 'error', e3?.message || '', d3?.map(t=>t.name));

  // Test 4: matches LEFT JOIN style (no inner)
  const { data: d4, error: e4 } = await supabase
    .from('matches')
    .select('id, tournament_id, status, tournaments(id)')
    .is('deleted_at', null);
  console.log("4. Matches with LEFT join on tournaments:", d4?.length ?? 'error', e4?.message || '');
}

testMatchesQuery();
