import assert from 'node:assert';
import { normalizeDelivery } from './src/engine/deliveryContract.js';
import { processDelivery } from './src/engine/cricketStateMachine.js';

function runTests() {
  console.log('Running tests for Run Out State Machine logic...');

  // Setup initial dummy state
  const getInitialState = () => ({
    runs: 0,
    wickets: 0,
    balls: 0,
    currentOverBalls: [],
    extras: {},
    isFreeHit: false,
    scorecard: { fallOfWickets: [] },
    striker: { id: 's-123', name: 'Striker A', runs: 0, balls: 0, fours: 0, sixes: 0 },
    nonStriker: { id: 'ns-456', name: 'NonStriker B', runs: 0, balls: 0, fours: 0, sixes: 0 },
    currentBowler: { id: 'b-789', name: 'Bowler C', runs: 0, ballsBowled: 0, wickets: 0, overs: 0, economy: 0 },
    innings: 1,
    totalMatchOvers: 20,
    matchStatus: 'IN_PROGRESS'
  });

  // Helper to run a test
  const runTest = (name, rawDelivery, assertions) => {
    try {
      const state = getInitialState();
      const normalized = normalizeDelivery(rawDelivery);
      const result = processDelivery(state, normalized);
      assertions(result);
      console.log(`✅ ${name}`);
    } catch (err) {
      console.error(`❌ ${name}`);
      console.error(err);
      process.exit(1);
    }
  };

  // 1. Striker run out, 0 runs
  runTest('1. Striker run out, 0 runs', {
    type: 'wicket',
    wicketType: 'RUN_OUT',
    dismissedPlayerId: 's-123',
    runsBatter: 0,
    runsCompleted: 0
  }, (result) => {
    assert.strictEqual(result.success, true);
    assert.strictEqual(result.newState.wickets, 1);
    assert.strictEqual(result.newState.runs, 0);
    // Striker got out -> new batter goes to striker's end (represented by placeholder)
    assert.strictEqual(result.newState.striker, null); // Vacant
    assert.strictEqual(result.newState.nonStriker?.id, 'ns-456'); // Non-striker stayed
  });

  // 2. Non-striker run out, 0 runs
  runTest('2. Non-striker run out, 0 runs', {
    type: 'wicket',
    wicketType: 'RUN_OUT',
    dismissedPlayerId: 'ns-456',
    runsBatter: 0,
    runsCompleted: 0
  }, (result) => {
    assert.strictEqual(result.success, true);
    assert.strictEqual(result.newState.wickets, 1);
    assert.strictEqual(result.newState.runs, 0);
    // Non-striker got out -> new batter goes to non-striker's end
    assert.strictEqual(result.newState.striker?.id, 's-123'); // Striker stayed
    assert.strictEqual(result.newState.nonStriker, null); // Vacant
  });

  // 3. Striker run out + 1 completed run
  runTest('3. Striker run out + 1 completed run', {
    type: 'wicket',
    wicketType: 'RUN_OUT',
    dismissedPlayerId: 's-123',
    runsBatter: 1,
    runsCompleted: 1
  }, (result) => {
    assert.strictEqual(result.success, true);
    assert.strictEqual(result.newState.runs, 1);
    // 1 run = odd cross. Striker goes to non-striker end, Non-striker to striker end.
    // Then Striker is run out -> Removed from non-striker end!
    assert.strictEqual(result.newState.nonStriker, null, 'Incoming batter goes to non-striker end');
    assert.strictEqual(result.newState.striker?.id, 'ns-456', 'Old non-striker is now on strike');
  });

  // 4. Striker run out + 2 completed runs
  runTest('4. Striker run out + 2 completed runs', {
    type: 'wicket',
    wicketType: 'RUN_OUT',
    dismissedPlayerId: 's-123',
    runsBatter: 2,
    runsCompleted: 2
  }, (result) => {
    assert.strictEqual(result.success, true);
    assert.strictEqual(result.newState.runs, 2);
    // 2 runs = even cross. Striker back at striker end.
    // Striker run out -> Removed from striker end.
    assert.strictEqual(result.newState.striker, null, 'Incoming batter goes to striker end');
    assert.strictEqual(result.newState.nonStriker?.id, 'ns-456', 'Old non-striker remains at non-striker end');
  });

  // 5. Non-striker run out + 1 completed run
  runTest('5. Non-striker run out + 1 completed run', {
    type: 'wicket',
    wicketType: 'RUN_OUT',
    dismissedPlayerId: 'ns-456',
    runsBatter: 1,
    runsCompleted: 1
  }, (result) => {
    assert.strictEqual(result.success, true);
    assert.strictEqual(result.newState.runs, 1);
    // 1 run = odd cross. Striker -> Non-striker end. Non-striker -> Striker end.
    // Non-striker run out -> Removed from striker end.
    assert.strictEqual(result.newState.striker, null, 'Incoming batter goes to striker end');
    assert.strictEqual(result.newState.nonStriker?.id, 's-123', 'Old striker is now at non-striker end');
  });

  // 6. Non-striker run out + 2 completed runs
  runTest('6. Non-striker run out + 2 completed runs', {
    type: 'wicket',
    wicketType: 'RUN_OUT',
    dismissedPlayerId: 'ns-456',
    runsBatter: 2,
    runsCompleted: 2
  }, (result) => {
    assert.strictEqual(result.success, true);
    assert.strictEqual(result.newState.runs, 2);
    // 2 runs = even cross. Everyone at original ends.
    // Non-striker run out -> Removed from non-striker end.
    assert.strictEqual(result.newState.striker?.id, 's-123', 'Old striker remains at striker end');
    assert.strictEqual(result.newState.nonStriker, null, 'Incoming batter goes to non-striker end');
  });

  // 7. Invalid missing dismissedPlayerId
  runTest('7. Invalid missing dismissedPlayerId', {
    type: 'wicket',
    wicketType: 'RUN_OUT',
    dismissedPlayerId: null,
    dismissedPlayerName: null,
    runsBatter: 0,
    runsCompleted: 0
  }, (result) => {
    assert.strictEqual(result.success, false);
    assert.match(result.error, /requires a dismissed player/);
  });

  // 8. Invalid dismissedPlayerId not matching either batter
  runTest('8. Invalid dismissedPlayerId not matching either batter', {
    type: 'wicket',
    wicketType: 'RUN_OUT',
    dismissedPlayerId: 'some-other-guy',
    runsBatter: 0,
    runsCompleted: 0
  }, (result) => {
    assert.strictEqual(result.success, false);
    assert.match(result.error, /dismissed player must be either the striker or non-striker/);
  });

  // 9. Run out with extras (Byes)
  runTest('9. Run out with extras (Byes)', {
    type: 'wicket',
    wicketType: 'RUN_OUT',
    dismissedPlayerId: 's-123',
    extraType: 'BYE',
    runsBatter: 0,
    runsExtras: 2,
    runsTotal: 2,
    runsCompleted: 2
  }, (result) => {
    assert.strictEqual(result.success, true);
    assert.strictEqual(result.newState.runs, 2);
    assert.strictEqual(result.newState.extras.byes, 2);
    // 2 runs = even cross. Striker back at striker end. Run out.
    assert.strictEqual(result.newState.striker, null);
    assert.strictEqual(result.newState.nonStriker?.id, 'ns-456');
  });

  // Test G: Striker run out, 1 completed bye
  runTest('Test G: Striker run out, 1 completed bye', {
    type: 'wicket',
    wicketType: 'RUN_OUT',
    dismissedPlayerId: 's-123',
    extraType: 'BYE',
    runsBatter: 0,
    runsExtras: 1,
    runsTotal: 1,
    runsCompleted: 1
  }, (result) => {
    assert.strictEqual(result.success, true);
    assert.strictEqual(result.newState.runs, 1);
    assert.strictEqual(result.newState.extras.byes, 1);
    assert.strictEqual(result.newState.striker?.id, 'ns-456', 'Old non-striker is now on strike');
    assert.strictEqual(result.newState.nonStriker, null, 'Incoming batter goes to non-striker end');
  });

  // Test H: Non-striker run out, 2 completed byes
  runTest('Test H: Non-striker run out, 2 completed byes', {
    type: 'wicket',
    wicketType: 'RUN_OUT',
    dismissedPlayerId: 'ns-456',
    extraType: 'BYE',
    runsBatter: 0,
    runsExtras: 2,
    runsTotal: 2,
    runsCompleted: 2
  }, (result) => {
    assert.strictEqual(result.success, true);
    assert.strictEqual(result.newState.runs, 2);
    assert.strictEqual(result.newState.extras.byes, 2);
    assert.strictEqual(result.newState.striker?.id, 's-123', 'Old striker remains at striker end');
    assert.strictEqual(result.newState.nonStriker, null, 'Incoming batter goes to non-striker end');
  });

  console.log('All Run Out tests passed successfully!');
}

runTests();
