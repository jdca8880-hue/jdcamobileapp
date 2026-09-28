import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

async function analyzeOrphans() {
  console.log("=== ORPHAN ANALYSIS ===");
  
  const { data: matches } = await supabase.from('matches').select('id, tournament_id, home_team_id, away_team_id, status');
  const { data: tournaments } = await supabase.from('tournaments').select('id');
  
  let orphans = [];
  
  if (matches) {
    for (const m of matches) {
      if (!m.tournament_id || !tournaments?.find(t => t.id === m.tournament_id)) {
        orphans.push(m);
      }
    }
  }

  for (const o of orphans) {
    const { count: inningsCount } = await supabase.from('innings').select('id', { count: 'exact' }).eq('match_id', o.id);
    const { count: deliveriesCount } = await supabase.from('deliveries').select('id', { count: 'exact' }).eq('match_id', o.id);
    const { count: rosterCount } = await supabase.from('match_rosters').select('id', { count: 'exact' }).eq('match_id', o.id);
    
    console.log(`\nMatch ID: ${o.id}`);
    console.log(`tournament_id: ${o.tournament_id}`);
    console.log(`home_team_id: ${o.home_team_id}`);
    console.log(`away_team_id: ${o.away_team_id}`);
    console.log(`status: ${o.status}`);
    console.log(`innings: ${inningsCount}`);
    console.log(`deliveries: ${deliveriesCount}`);
    console.log(`roster: ${rosterCount}`);
  }
}

analyzeOrphans();
