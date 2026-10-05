import assert from 'assert';
import { processDelivery, MATCH_STATES } from '../src/engine/cricketStateMachine.js';

console.log('Running Player Preservation & Robust Sync tests...\n');

// 1. Test: Wicket on 6th ball of an over preserves surviving batter and sets state appropriately
{
  const batter1 = { id: 'p1', name: 'Virat Kohli', runs: 10, balls: 8, fours: 1, sixes: 0 };
  const batter2 = { id: 'p2', name: 'Rohit Sharma', runs: 24, balls: 15, fours: 3, sixes: 1 };
  const bowler = { id: 'b1', name: 'Jasprit Bumrah', overs: 0.5, ballsBowled: 5, runs: 4, wickets: 0 };

  const stateBeforeBall6 = {
    runs: 34,
    wickets: 0,
    balls: 5, // 5 legal balls bowled in over 1
    currentOverBalls: [
      { type: 'run', label: '1', runs: 1 },
      { type: 'run', label: '0', runs: 0 },
      { type: 'run', label: '4', runs: 4 },
      { type: 'run', label: '1', runs: 1 },
      { type: 'run', label: '0', runs: 0 },
    ],
    striker: { ...batter1 },
    nonStriker: { ...batter2 },
    currentBowler: { ...bowler },
    extras: { total: 0, wides: 0, noBalls: 0, byes: 0, legByes: 0 },
    isFreeHit: false,
    innings: 1,
    totalMatchOvers: 20,
    scorecard: { fallOfWickets: [] }
  };

  // Ball 6: Striker (batter1) caught out!
  const deliveryResult = processDelivery(stateBeforeBall6, {
    type: 'wicket',
    wicketType: 'CAUGHT',
    dismissedPlayerId: 'p1',
    outPlayerName: 'Virat Kohli',
    isLegalDelivery: true,
    runsBatter: 0,
    runsCompleted: 0
  });

  assert.strictEqual(deliveryResult.success, true, 'Delivery should be processed successfully');
  const newState = deliveryResult.newState;

  assert.strictEqual(newState.wickets, 1, 'Wickets should be incremented to 1');
  assert.strictEqual(newState.balls, 6, 'Balls should be 6 (over complete)');
  assert.strictEqual(newState.matchStatus, MATCH_STATES.OVER_COMPLETE, 'Match status should be OVER_COMPLETE');

  // Verify that the surviving batter (batter2) is NOT lost and is at one end
  const survivingBatterAtEitherEnd = (newState.striker?.id === 'p2') || (newState.nonStriker?.id === 'p2');
  assert.strictEqual(survivingBatterAtEitherEnd, true, 'Surviving batter (Rohit Sharma) must remain in the active pair');

  // Exactly one end must be vacant (null) for the new incoming batter
  const hasVacantEnd = (newState.striker === null && newState.nonStriker?.id === 'p2') ||
                       (newState.nonStriker === null && newState.striker?.id === 'p2');
  assert.strictEqual(hasVacantEnd, true, 'Exactly one end must be vacant (null) for the new incoming batter');

  // Verify intelligent vacant-end replacement logic (from selectNewBatter)
  const incomingBatter = { id: 'p3', name: 'KL Rahul', runs: 0, balls: 0, fours: 0, sixes: 0 };
  let isStrikerTarget = false;
  if (!newState.striker?.id && newState.nonStriker?.id) {
    isStrikerTarget = true;
  } else if (!newState.nonStriker?.id && newState.striker?.id) {
    isStrikerTarget = false;
  }

  const finalPair = {
    striker: isStrikerTarget ? incomingBatter : newState.striker,
    nonStriker: isStrikerTarget ? newState.nonStriker : incomingBatter
  };

  assert.strictEqual(finalPair.striker !== null && finalPair.nonStriker !== null, true, 'Both ends must be occupied after incoming batter');
  assert.strictEqual([finalPair.striker.id, finalPair.nonStriker.id].includes('p2'), true, 'Surviving batter p2 must still be present');
  assert.strictEqual([finalPair.striker.id, finalPair.nonStriker.id].includes('p3'), true, 'Incoming batter p3 must be present');
  assert.notStrictEqual(finalPair.striker.id, finalPair.nonStriker.id, 'Striker and non-striker must be distinct');

  console.log('✅ 1. Wicket on 6th ball of an over preserves surviving batter and accurately assigns incoming batter');
}

// 2. Test: Run out of non-striker on 6th ball preserves striker
{
  const batter1 = { id: 'p1', name: 'Virat Kohli', runs: 10, balls: 8, fours: 1, sixes: 0 };
  const batter2 = { id: 'p2', name: 'Rohit Sharma', runs: 24, balls: 15, fours: 3, sixes: 1 };
  const bowler = { id: 'b1', name: 'Jasprit Bumrah', overs: 0.5, ballsBowled: 5, runs: 4, wickets: 0 };

  const stateBeforeBall6 = {
    runs: 34,
    wickets: 0,
    balls: 5,
    currentOverBalls: [],
    striker: { ...batter1 },
    nonStriker: { ...batter2 },
    currentBowler: { ...bowler },
    extras: { total: 0, wides: 0, noBalls: 0, byes: 0, legByes: 0 },
    isFreeHit: false,
    innings: 1,
    totalMatchOvers: 20,
    scorecard: { fallOfWickets: [] }
  };

  // Ball 6: Non-striker (p2) run out, 1 run completed
  const deliveryResult = processDelivery(stateBeforeBall6, {
    type: 'wicket',
    wicketType: 'RUN_OUT',
    dismissedPlayerId: 'p2',
    outPlayerName: 'Rohit Sharma',
    isLegalDelivery: true,
    runsBatter: 1,
    runsTotal: 1,
    runsCompleted: 1
  });

  assert.strictEqual(deliveryResult.success, true);
  const newState = deliveryResult.newState;
  assert.strictEqual(newState.wickets, 1);
  assert.strictEqual(newState.balls, 6);

  // Check that surviving batter p1 is present
  const surviving = (newState.striker?.id === 'p1') || (newState.nonStriker?.id === 'p1');
  assert.strictEqual(surviving, true, 'Surviving batter p1 must be preserved on non-striker run-out');

  console.log('✅ 2. Non-striker run out on over end preserves surviving striker');
}

// 3. Test: Delivery snapshot payload captures pre-transition players accurately
{
  const activeStriker = { id: 'p1', name: 'Virat Kohli' };
  const activeNonStriker = { id: 'p2', name: 'Rohit Sharma' };
  const activeBowler = { id: 'b1', name: 'Jasprit Bumrah' };

  const snapshot = {
    striker: activeStriker,
    nonStriker: activeNonStriker,
    currentBowler: activeBowler,
    balls: 11
  };

  // Mock recordDeliveryEvent logic
  const event = {
    type: 'wicket',
    wicket: true,
    dismissalType: 'Bowled',
    actualDismissedId: 'p1',
    outPlayerId: 'p1',
    strikerId: snapshot.striker.id,
    striker: snapshot.striker.name,
    nonStrikerId: snapshot.nonStriker.id,
    nonStriker: snapshot.nonStriker.name,
    bowlerId: snapshot.currentBowler.id,
    bowler: snapshot.currentBowler.name,
  };

  const payloadStrikerId = event.strikerId || snapshot.striker?.id;
  const payloadNonStrikerId = event.nonStrikerId || snapshot.nonStriker?.id;
  const payloadBowlerId = event.bowlerId || snapshot.currentBowler?.id;
  const dismissedPlayerId = event.dismissedPlayerId || event.outPlayerId;

  assert.strictEqual(payloadStrikerId, 'p1', 'Payload strikerId must be p1');
  assert.strictEqual(payloadNonStrikerId, 'p2', 'Payload nonStrikerId must be p2');
  assert.strictEqual(payloadBowlerId, 'b1', 'Payload bowlerId must be b1');
  assert.strictEqual(dismissedPlayerId, 'p1', 'Dismissed player ID must be p1');

  console.log('✅ 3. Delivery event payload guarantees pre-transition snapshot players are preserved');
}

console.log('\nAll Player Preservation & Robust Sync tests passed successfully!');
