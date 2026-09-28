import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

async function testScorerHydration() {
  // 1. Login as Scorer
  const { data: authData, error: authErr } = await supabase.auth.signInWithPassword({
    email: 'scorer@jdca.com',
    password: 'password123'
  });
  
  if (authErr) {
    console.log('Login error:', authErr.message);
    return;
  }
  
  console.log('Logged in as scorer:', authData.user.id);
  
  // 2. Fetch a valid active match (one that has a tournament)
  const { data: matches, error: mErr } = await supabase
    .from('matches')
    .select('id, tournament_id')
    .not('tournament_id', 'is', null)
    .not('status', 'in', '("COMPLETED")')
    .limit(1);
    
  if (mErr) {
    console.log('Matches fetch error:', mErr.message);
    return;
  }
  
  if (!matches || matches.length === 0) {
    console.log('No active valid matches found to test.');
    return;
  }
  
  const matchId = matches[0].id;
  console.log('Testing hydration for match:', matchId);

  // 3. Test hydrateLiveMatch queries
  try {
    const { data: match, error: matchError } = await supabase
      .from('matches')
      .select('*, home_team:home_team_id(*), away_team:away_team_id(*)')
      .eq('id', matchId)
      .single();
    if (matchError) throw new Error("Match Error: " + matchError.message);

    const { data: rosters, error: rErr } = await supabase
      .from('match_rosters')
      .select('*, player:player_id(*)')
      .eq('match_id', matchId);
    if (rErr) throw new Error("Rosters Error: " + rErr.message);

    const { data: inningsData, error: iErr } = await supabase
      .from('innings')
      .select('*')
      .eq('match_id', matchId)
      .order('innings_number', { ascending: false })
      .limit(1);
    if (iErr) throw new Error("Innings Error: " + iErr.message);
    
    let currentInning = inningsData && inningsData.length > 0 ? inningsData[0] : null;
    if (currentInning) {
      const { data: dData, error: dErr } = await supabase
        .from('deliveries')
        .select('*, striker:striker_id(*), non_striker:non_striker_id(*), bowler:bowler_id(*)')
        .eq('innings_id', currentInning.id)
        .order('delivery_sequence', { ascending: true });
      if (dErr) throw new Error("Deliveries Error: " + dErr.message);
    }
    
    console.log('Hydration test SUCCESS!');
  } catch (e) {
    console.log('Hydration test FAILED:', e.message);
  }
}

testScorerHydration();
