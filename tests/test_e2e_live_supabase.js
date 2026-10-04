import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

async function runE2E() {
  console.log('--- Starting LIVE Supabase E2E Test ---');

  const { data: teamA, error: errA } = await supabase.from('teams').insert({ name: `Team A ${Date.now()}`, short_name: 'TA' }).select().single();
  const { data: teamB, error: errB } = await supabase.from('teams').insert({ name: `Team B ${Date.now()}`, short_name: 'TB' }).select().single();
  if (errA || errB) {
    console.error('Cannot run E2E: Failed to create teams', errA, errB);
    process.exit(1);
  }
  console.log(`Using Team A: ${teamA.name}, Team B: ${teamB.name}`);

  // Create match
  console.log('1. Creating Match...');
  const { data: match, error: matchErr } = await supabase.from('matches').insert({
    home_team_id: teamA.id,
    away_team_id: teamB.id,
    scheduled_at: new Date().toISOString(),
    match_format: 'T20',
    max_overs: 2, // short for test
    status: 'SCHEDULED'
  }).select().single();
  
  if (matchErr) throw matchErr;
  const matchId = match.id;
  console.log(`✅ Match created: ${matchId}`);

  // 2. Complete toss
  console.log('2. Completing Toss (Team A chooses BAT)...');
  await supabase.from('matches').update({
    toss_winner_id: teamA.id,
    toss_decision: 'BAT',
    status: 'IN_PROGRESS'
  }).eq('id', matchId);
  console.log('✅ Toss completed.');

  // 3. Start Innings 1 (equivalent to api.getOrCreateInnings logic)
  console.log('3. Starting Innings 1...');
  let battingTeamId = teamA.id;
  let bowlingTeamId = teamB.id;
  
  const { data: innings1, error: inn1Err } = await supabase.from('innings').insert({
    match_id: matchId,
    innings_number: 1,
    batting_team_id: battingTeamId,
    bowling_team_id: bowlingTeamId,
    overs_limit: 2,
    status: 'IN_PROGRESS'
  }).select().single();
  if (inn1Err) throw inn1Err;
  console.log(`✅ Innings 1 created. Batting: ${innings1.batting_team_id} (Expected Team A)`);
  if (innings1.batting_team_id !== teamA.id) throw new Error('Wrong batting team assigned');

  // Generate unique dummy player IDs to act as striker/non-striker/bowler
  const sId = `strik-${Date.now()}`;
  const nsId = `nstri-${Date.now()}`;
  const bId = `bowle-${Date.now()}`;

  // 4, 5, 6. Simulate scoring
  console.log('4-7. Scoring deliveries (1, 4, Wide, No-ball, 2, wicket)...');
  const deliveries = [
    { runs_off_bat: 1, runs_extras: 0, runs_total: 1, extra_type: 'NONE', wicket_type: 'NONE', balls: 1, deliverySequence: 1 },
    { runs_off_bat: 4, runs_extras: 0, runs_total: 4, extra_type: 'NONE', wicket_type: 'NONE', balls: 2, deliverySequence: 2 },
    { runs_off_bat: 0, runs_extras: 1, runs_total: 1, extra_type: 'WIDE', wicket_type: 'NONE', balls: 2, deliverySequence: 3 },
    { runs_off_bat: 0, runs_extras: 1, runs_total: 1, extra_type: 'NO_BALL', wicket_type: 'NONE', balls: 2, deliverySequence: 4 },
    { runs_off_bat: 2, runs_extras: 0, runs_total: 2, extra_type: 'NONE', wicket_type: 'NONE', balls: 3, deliverySequence: 5 },
    { runs_off_bat: 0, runs_extras: 0, runs_total: 0, extra_type: 'NONE', wicket_type: 'BOWLED', balls: 4, deliverySequence: 6 }
  ];

  let totalRuns = 0;
  for (let d of deliveries) {
    totalRuns += d.runs_total;
    const { error: delErr } = await supabase.from('deliveries').insert({
      idempotency_key: `del-${matchId}-1-${d.deliverySequence}`,
      match_id: matchId,
      innings_id: innings1.id,
      striker_id: sId,
      non_striker_id: nsId,
      bowler_id: bId,
      runs_total: d.runs_total,
      runs_off_bat: d.runs_off_bat,
      runs_extras: d.runs_extras,
      extra_type: d.extra_type,
      wicket_type: d.wicket_type,
      over_number: 0,
      ball_number: d.balls
    });
    if (delErr) throw delErr;
  }
  console.log(`✅ Deliveries synced. Innings 1 score: ${totalRuns}`);

  // 8 & 9. Refresh / Verify
  console.log('8-9. Verifying persistence...');
  const { data: verifyDel, error: vErr } = await supabase.from('deliveries').select('*').eq('innings_id', innings1.id);
  if (vErr) throw vErr;
  if (verifyDel.length !== 6) throw new Error(`Expected 6 deliveries, got ${verifyDel.length}`);
  const firstDel = verifyDel.find(x => x.ball_number === 1);
  if (firstDel.striker_id !== sId) throw new Error('Striker ID mismatch in DB');
  console.log('✅ Persistence verified. All deliveries accurately mapped in DB.');

  // Finish Innings 1, start Innings 2
  console.log('12. Finishing innings 1 and starting innings 2...');
  await supabase.from('innings').update({ status: 'COMPLETED' }).eq('id', innings1.id);

  const { data: innings2, error: inn2Err } = await supabase.from('innings').insert({
    match_id: matchId,
    innings_number: 2,
    batting_team_id: teamB.id,
    bowling_team_id: teamA.id,
    overs_limit: 2,
    status: 'IN_PROGRESS'
  }).select().single();
  if (inn2Err) throw inn2Err;
  console.log(`✅ Innings 2 created. Batting: ${innings2.batting_team_id} (Expected Team B)`);
  if (innings2.batting_team_id !== teamB.id) throw new Error('Wrong batting team assigned to innings 2');

  // Verify target
  // Emulate target calculation from api.js getMatchScorecard behavior
  const { data: scoreRaw } = await supabase.from('deliveries').select('runs_total').eq('innings_id', innings1.id);
  const inn1Score = scoreRaw.reduce((sum, d) => sum + d.runs_total, 0);
  const expectedTarget = totalRuns + 1;
  const target = inn1Score + 1;
  console.log(`✅ Target Calculation: DB sum = ${inn1Score}, Target = ${target}`);
  if (target !== expectedTarget) throw new Error(`Target mismatch! Expected ${expectedTarget}, got ${target}`);

  // 19. Score balls in innings 2
  const s2Id = `strik2-${Date.now()}`;
  const ns2Id = `nstri2-${Date.now()}`;
  const b2Id = `bowle2-${Date.now()}`;
  
  await supabase.from('deliveries').insert({
    idempotency_key: `del-${matchId}-2-1`,
    match_id: matchId,
    innings_id: innings2.id,
    striker_id: s2Id,
    non_striker_id: ns2Id,
    bowler_id: b2Id,
    runs_total: 4,
    runs_off_bat: 4,
    runs_extras: 0,
    extra_type: 'NONE',
    wicket_type: 'NONE',
    over_number: 0,
    ball_number: 1
  });
  console.log('✅ Innings 2 deliveries persisted.');

  // Refresh and verify both innings remain intact
  const { data: allInn } = await supabase.from('innings').select('id, innings_number').eq('match_id', matchId);
  if (allInn.length !== 2) throw new Error('Innings 1 did not survive Innings 2 creation');
  console.log('✅ Verified both innings exist for the match.');

  console.log('🎉 LIVE SUPABASE E2E INTEGRATION TEST PASSED!');
  process.exit(0);
}

runE2E().catch(console.error);
