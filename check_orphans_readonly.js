import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

async function runReadOnlyChecks() {
  console.log("=== ORPHAN CHECK ===");
  
  const { data: matches } = await supabase.from('matches').select('id, tournament_id, home_team_id, away_team_id');
  const { data: tournaments } = await supabase.from('tournaments').select('id');
  const { data: teams } = await supabase.from('teams').select('id');
  
  let orphans = 0;
  
  if (matches) {
    for (const m of matches) {
      if (!m.tournament_id) {
        console.log(`Orphan: Match ${m.id} has NULL tournament_id`);
        orphans++;
        continue;
      }
      const tFound = tournaments?.find(t => t.id === m.tournament_id);
      if (!tFound) {
        console.log(`Orphan: Match ${m.id} has invalid tournament_id ${m.tournament_id}`);
        orphans++;
      }
      
      const htFound = teams?.find(t => t.id === m.home_team_id);
      if (!htFound && m.home_team_id) {
        console.log(`Orphan: Match ${m.id} has invalid home_team_id ${m.home_team_id}`);
        orphans++;
      }
      
      const atFound = teams?.find(t => t.id === m.away_team_id);
      if (!atFound && m.away_team_id) {
        console.log(`Orphan: Match ${m.id} has invalid away_team_id ${m.away_team_id}`);
        orphans++;
      }
    }
  }

  const { data: deliveries } = await supabase.from('deliveries').select('id, match_id');
  if (deliveries) {
    for (const d of deliveries) {
      const mFound = matches?.find(m => m.id === d.match_id);
      if (!mFound) {
        console.log(`Orphan: Delivery ${d.id} has invalid match_id ${d.match_id}`);
        orphans++;
      }
    }
  }
  
  const { data: innings } = await supabase.from('innings').select('id, match_id');
  if (innings) {
    for (const i of innings) {
      const mFound = matches?.find(m => m.id === i.match_id);
      if (!mFound) {
        console.log(`Orphan: Innings ${i.id} has invalid match_id ${i.match_id}`);
        orphans++;
      }
    }
  }
  
  const { data: rosters } = await supabase.from('match_rosters').select('id, match_id');
  if (rosters) {
    for (const r of rosters) {
      const mFound = matches?.find(m => m.id === r.match_id);
      if (!mFound) {
        console.log(`Orphan: Roster ${r.id} has invalid match_id ${r.match_id}`);
        orphans++;
      }
    }
  }

  console.log(`\nTotal Orphans Found: ${orphans}`);
}

runReadOnlyChecks();
