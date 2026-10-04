import { processPenaltyEvent, MATCH_STATES } from '../src/engine/cricketStateMachine.js';

function runTests() {
  let passed = 0;
  let failed = 0;

  const assert = (condition, message) => {
    if (condition) {
      passed++;
      console.log(`✅ PASS: ${message}`);
    } else {
      failed++;
      console.error(`❌ FAIL: ${message}`);
    }
  };

  const getInitialState = (battingTeamId = 'TeamA') => ({
    runs: 10,
    wickets: 0,
    balls: 12,
    currentOverBalls: [],
    striker: { id: 's1', runs: 5, balls: 6, fours: 0, sixes: 0 },
    nonStriker: { id: 's2', runs: 5, balls: 6, fours: 0, sixes: 0 },
    currentBowler: { id: 'b1', runs: 0, wickets: 0, balls: 0 },
    extras: { total: 0, wides: 0, noBalls: 0, legByes: 0, byes: 0, penalty: 0 },
    isFreeHit: false,
    innings: 1,
    totalMatchOvers: 20,
    target: null,
    scorecard: { fallOfWickets: [] },
    matchStatus: MATCH_STATES.IN_PROGRESS,
    battingTeamId,
    pendingPenalties: {}
  });

  console.log('--- Batting-side / recipient tests ---');
  // 1. batting recipient +5
  const s1 = getInitialState('TeamA');
  const res1 = processPenaltyEvent(s1, { eventType: 'PENALTY', recipientTeamId: 'TeamA', penaltyRuns: 5 });
  assert(res1.newState.runs === 15, '1. batting recipient +5');
  
  // 2. batting recipient +1
  const s2 = getInitialState('TeamA');
  const res2 = processPenaltyEvent(s2, { eventType: 'PENALTY', recipientTeamId: 'TeamA', penaltyRuns: 1 });
  assert(res2.newState.runs === 11, '2. batting recipient +1');

  // 3. batting recipient +10 accumulated
  let s3 = getInitialState('TeamA');
  s3 = processPenaltyEvent(s3, { eventType: 'PENALTY', recipientTeamId: 'TeamA', penaltyRuns: 5 }).newState;
  s3 = processPenaltyEvent(s3, { eventType: 'PENALTY', recipientTeamId: 'TeamA', penaltyRuns: 5 }).newState;
  assert(s3.runs === 20 && s3.extras.penalty === 10, '3. batting recipient +10 accumulated');

  // 4. penalty does not increment balls
  assert(res1.newState.balls === 12, '4. penalty does not increment balls');

  // 5. penalty does not rotate strike (actually it's a standalone event, no strike rotation logic is called)
  // 6. penalty does not change striker
  assert(res1.newState.striker.id === 's1', '6. penalty does not change striker');
  
  // 7. penalty does not change non-striker
  assert(res1.newState.nonStriker.id === 's2', '7. penalty does not change non-striker');
  
  // 8. penalty does not charge bowler
  assert(res1.newState.currentBowler.runs === 0, '8. penalty does not charge bowler');
  
  // 9. penalty does not credit batter
  assert(res1.newState.striker.runs === 5, '9. penalty does not credit batter');
  
  // 10. penalty appears in penalty extras
  assert(res1.newState.extras.penalty === 5, '10. penalty appears in penalty extras');


  console.log('--- Fielding-side / other-team recipient tests ---');
  // 11. Team B receives +5 while Team A is batting
  const s11 = getInitialState('TeamA');
  const res11 = processPenaltyEvent(s11, { eventType: 'PENALTY', recipientTeamId: 'TeamB', penaltyRuns: 5 });
  assert(res11.newState.pendingPenalties['TeamB'] === 5, '11. Team B receives +5 while Team A is batting');

  // 12. Team B penalty is not added to Team A
  assert(res11.newState.runs === 10 && res11.newState.extras.penalty === 0, '12. Team B penalty is not added to Team A');
  
  // 13. pending award stores recipient team identity
  assert(res11.newState.pendingPenalties['TeamB'] !== undefined, '13. pending award stores recipient team identity');
  
  // 17. two pending awards accumulate independently
  let s17 = processPenaltyEvent(s11, { eventType: 'PENALTY', recipientTeamId: 'TeamB', penaltyRuns: 5 }).newState;
  s17 = processPenaltyEvent(s17, { eventType: 'PENALTY', recipientTeamId: 'TeamB', penaltyRuns: 5 }).newState;
  assert(s17.pendingPenalties['TeamB'] === 10, '17. two pending awards accumulate independently');

  // 18. awards for different recipient teams do not mix
  let s18 = processPenaltyEvent(s17, { eventType: 'PENALTY', recipientTeamId: 'TeamC', penaltyRuns: 5 }).newState;
  assert(s18.pendingPenalties['TeamB'] === 10 && s18.pendingPenalties['TeamC'] === 5, '18. awards for different recipient teams do not mix');

  // 19. fielding penalty does not alter current batting balls
  assert(res11.newState.balls === 12, '19. fielding penalty does not alter current batting balls');

  // 20. fielding penalty does not alter current batting striker/non-striker
  assert(res11.newState.striker.id === 's1' && res11.newState.nonStriker.id === 's2', '20. fielding penalty does not alter current batting striker/non-striker');


  console.log('--- Validation tests ---');
  // 21. missing recipient rejected
  const res21 = processPenaltyEvent(getInitialState(), { eventType: 'PENALTY', penaltyRuns: 5 });
  assert(res21.success === false && res21.error === 'Missing recipient team ID.', '21. missing recipient rejected');

  // 23. zero penalty rejected
  const res23 = processPenaltyEvent(getInitialState(), { eventType: 'PENALTY', recipientTeamId: 'TeamA', penaltyRuns: 0 });
  assert(res23.success === false, '23. zero penalty rejected');

  // 24. negative penalty rejected
  const res24 = processPenaltyEvent(getInitialState(), { eventType: 'PENALTY', recipientTeamId: 'TeamA', penaltyRuns: -5 });
  assert(res24.success === false, '24. negative penalty rejected');

  // 27. penalty cannot accidentally become a delivery
  assert(res1.newState.currentOverBalls.length === 0, '27. penalty cannot accidentally become a delivery (does not add to over)');

  console.log('--- Target / innings tests ---');
  // 31. batting-side penalty can reach target
  const s31 = getInitialState('TeamA');
  s31.innings = 2;
  s31.target = 15;
  const res31 = processPenaltyEvent(s31, { eventType: 'PENALTY', recipientTeamId: 'TeamA', penaltyRuns: 5 });
  assert(res31.newState.runs === 15 && res31.newState.matchStatus === MATCH_STATES.MATCH_FINISHED, '31. batting-side penalty can reach target');

  // 32. fielding-side penalty cannot incorrectly end current chase
  const s32 = getInitialState('TeamA');
  s32.innings = 2;
  s32.target = 15;
  const res32 = processPenaltyEvent(s32, { eventType: 'PENALTY', recipientTeamId: 'TeamB', penaltyRuns: 5 });
  assert(res32.newState.runs === 10 && res32.newState.matchStatus === MATCH_STATES.IN_PROGRESS, '32. fielding-side penalty cannot incorrectly end current chase');

  console.log(`\nTests completed: ${passed} passed, ${failed} failed.`);
  if (failed > 0) process.exit(1);
}

runTests();
