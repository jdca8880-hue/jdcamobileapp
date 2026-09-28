import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

async function testAllMatches() {
  const { data: matches, error } = await supabase.from('matches').select('id, status').neq('status', 'COMPLETED');
  if (error) {
    console.log('Error fetching matches:', error);
    return;
  }
  console.log(`Found ${matches.length} active/scheduled matches.`);

  for (const m of matches) {
    try {
      // 1. Fetch match and teams
      const { data: match, error: matchError } = await supabase
        .from('matches')
        .select('*, home_team:home_team_id(*), away_team:away_team_id(*)')
        .eq('id', m.id)
        .single();
        
      if (matchError) throw matchError;

      // 2. Fetch Match Rosters
      const { data: rosters, error: rErr } = await supabase
        .from('match_rosters')
        .select('*, player:player_id(*)')
        .eq('match_id', m.id);
      
      if (rErr) throw rErr;

      // 3. Fetch Innings
      const { data: inningsData, error: iErr } = await supabase
        .from('innings')
        .select('*')
        .eq('match_id', m.id)
        .order('innings_number', { ascending: false })
        .limit(1);

      if (iErr) throw iErr;
      
      const currentInning = inningsData && inningsData.length > 0 ? inningsData[0] : null;
      let deliveries = [];
      if (currentInning) {
        const { data: dData, error: dErr } = await supabase
          .from('deliveries')
          .select('*, striker:striker_id(*), non_striker:non_striker_id(*), bowler:bowler_id(*)')
          .eq('innings_id', currentInning.id)
          .order('delivery_sequence', { ascending: true });
        if (dErr) throw dErr;
        deliveries = dData;
      }
      
      // 4. Test getMatchScorecard (which is called in hydrateMatchState)
      if (deliveries && deliveries.length > 0) {
        const { data: scorecardMatch, error: smErr } = await supabase
          .from('matches')
          .select('*, home_team:home_team_id(*), away_team:away_team_id(*), man_of_the_match:man_of_the_match_id(id, full_name)')
          .eq('id', m.id)
          .single();
        if (smErr) throw new Error("Scorecard Match Fetch Error: " + smErr.message);
      }

      console.log(`Match ${m.id} (${m.status}) hydrated successfully. Deliveries: ${deliveries?.length}`);
    } catch (e) {
      console.log(`Match ${m.id} FAILED hydration:`, e.message || e);
    }
  }
}

testAllMatches();
