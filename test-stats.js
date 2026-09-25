import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://qxrngeasemveguixlzlf.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF4cm5nZWFzZW12ZWd1aXhsemxmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODkzNzcyNTQsImV4cCI6MjEwNDk1MzI1NH0.XDZmyr34uphmZYhQr6115NRQj2LS3V3yCw7KULeGM8c'
);

async function runTest() {
  console.log('Fetching players...');
  let { data: players } = await supabase.from('players').select('id').limit(3);
  if (!players || players.length < 3) {
    console.log('Creating test players...');
    await supabase.from('players').insert([
      { full_name: 'P1', date_of_birth: '2000-01-01', gender: 'Male', primary_role: 'Batsman', batting_style: 'Right-Hand Bat', bowling_style: 'Right-Arm Medium' },
      { full_name: 'P2', date_of_birth: '2000-01-01', gender: 'Male', primary_role: 'Batsman', batting_style: 'Right-Hand Bat', bowling_style: 'Right-Arm Medium' },
      { full_name: 'P3', date_of_birth: '2000-01-01', gender: 'Male', primary_role: 'Bowler', batting_style: 'Right-Hand Bat', bowling_style: 'Right-Arm Fast' }
    ]);
    const res = await supabase.from('players').select('id').limit(3);
    players = res.data;
  }
  const p1 = players[0].id;
  const p2 = players[1].id;
  const p3 = players[2].id;

  console.log('Creating match...');
  const { data: match } = await supabase.from('matches').insert({
    tournament_id: null,
    home_team_id: null,
    away_team_id: null,
    venue: 'Test Venue',
    status: 'IN_PROGRESS'
  }).select().single();

  const { data: innings } = await supabase.from('innings').insert({
    match_id: match.id,
    batting_team_id: null,
    bowling_team_id: null,
    innings_number: 1,
    status: 'IN_PROGRESS'
  }).select().single();

  console.log('Inserting deliveries...');
  // Score runs (4 runs)
  await supabase.from('deliveries').insert({
    match_id: match.id,
    innings_id: innings.id,
    delivery_sequence: 1,
    over_number: 0,
    ball_number: 1,
    striker_id: p1,
    non_striker_id: p2,
    bowler_id: p3,
    runs_off_bat: 4,
    runs_extras: 0,
    runs_total: 4,
    extra_type: 'NONE',
    wicket_type: 'NONE',
    idempotency_key: 'test1-' + Date.now()
  });

  // Wicket
  await supabase.from('deliveries').insert({
    match_id: match.id,
    innings_id: innings.id,
    delivery_sequence: 2,
    over_number: 0,
    ball_number: 2,
    striker_id: p1,
    non_striker_id: p2,
    bowler_id: p3,
    runs_off_bat: 0,
    runs_extras: 0,
    runs_total: 0,
    extra_type: 'NONE',
    wicket_type: 'BOWLED',
    dismissed_player_id: p1,
    idempotency_key: 'test2-' + Date.now()
  });

  console.log('Querying stats...');
  const { data: batStats } = await supabase.from('v_player_career_batting').select('*').eq('player_id', p1).single();
  const { data: bowlStats } = await supabase.from('v_player_career_bowling').select('*').eq('player_id', p3).single();

  console.log('Batting Stats:', batStats);
  console.log('Bowling Stats:', bowlStats);
  
  // Cleanup
  console.log('Cleaning up match...');
  await supabase.from('matches').delete().eq('id', match.id);
  
  console.log('Done!');
}

runTest().catch(console.error);
