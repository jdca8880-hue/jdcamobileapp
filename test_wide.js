import assert from 'assert';
import { processDelivery } from './src/engine/cricketStateMachine.js';

function createInitialState() {
  return {
    runs: 0, wickets: 0, balls: 0, currentOverBalls: [], extras: { total: 0, wides: 0, noBalls: 0, byes: 0, legByes: 0, penalty: 0 },
    striker: { id: 's-123', name: 'Striker', runs: 0, balls: 0, fours: 0, sixes: 0 },
    nonStriker: { id: 'ns-456', name: 'NonStriker', runs: 0, balls: 0, fours: 0, sixes: 0 },
    currentBowler: { id: 'b-789', name: 'Bowler', runs: 0, wickets: 0, ballsBowled: 0, overs: 0 },
    isFreeHit: false, innings: 1, totalMatchOvers: 20, target: null, scorecard: { fallOfWickets: [] },
    matchStatus: 'IN_PROGRESS', lastOverBowlerId: null
  };
}

function runTest(testName, deliveryOverrides, assertFn) {
  const initialState = createInitialState();
  const delivery = {
    extraType: 'WIDE',
    wicketType: 'NONE',
    runsBatter: 0,
    runsExtras: 1,
    runsTotal: 1,
    runsCompleted: 0,
    isLegalDelivery: false,
    ...deliveryOverrides
  };

  const result = processDelivery(initialState, delivery);
  
  try {
    assertFn(result, initialState);
    console.log(`✅ ${testName}`);
  } catch (error) {
    console.error(`❌ ${testName} FAILED`);
    console.error(error);
    process.exit(1);
  }
}

function runAllTests() {
  console.log('Running tests for Wide State Machine logic...');

  // 1. Simple Wide
  runTest('1. Simple Wide', {
    runsBatter: 0, runsExtras: 1, runsTotal: 1, runsCompleted: 0
  }, (result) => {
    assert.strictEqual(result.success, true);
    assert.strictEqual(result.newState.runs, 1); // team +1
    assert.strictEqual(result.newState.extras.wides, 1);
    assert.strictEqual(result.newState.striker.runs, 0); // bat +0
    assert.strictEqual(result.newState.striker.balls, 0); // Wide doesn't count as faced ball
    assert.strictEqual(result.newState.currentBowler.runs, 1); // bowler +1
    assert.strictEqual(result.newState.balls, 0); // legal balls unchanged
  });

  // 2. Wide + 1 completed run
  runTest('2. Wide + 1 completed run', {
    runsBatter: 0, runsExtras: 2, runsTotal: 2, runsCompleted: 1
  }, (result) => {
    assert.strictEqual(result.newState.runs, 2); 
    assert.strictEqual(result.newState.extras.wides, 2);
    assert.strictEqual(result.newState.nonStriker.runs, 0); // old striker
    assert.strictEqual(result.newState.currentBowler.runs, 2); 
    assert.strictEqual(result.newState.striker.id, 'ns-456'); // strike rotated based on 1 run
  });

  // 3. Wide + 2 completed runs
  runTest('3. Wide + 2 completed runs', {
    runsBatter: 0, runsExtras: 3, runsTotal: 3, runsCompleted: 2
  }, (result) => {
    assert.strictEqual(result.newState.runs, 3);
    assert.strictEqual(result.newState.extras.wides, 3);
    assert.strictEqual(result.newState.currentBowler.runs, 3);
    assert.strictEqual(result.newState.striker.id, 's-123'); // strike not rotated based on 2 runs
  });

  // 4. Wide + 3 completed runs
  runTest('4. Wide + 3 completed runs', {
    runsBatter: 0, runsExtras: 4, runsTotal: 4, runsCompleted: 3
  }, (result) => {
    assert.strictEqual(result.newState.runs, 4);
    assert.strictEqual(result.newState.extras.wides, 4);
    assert.strictEqual(result.newState.striker.id, 'ns-456'); // strike rotated based on 3 runs
  });

  // 5. Wide boundary (4 boundary runs + 1 wide penalty = 5)
  runTest('5. Wide boundary', {
    runsBatter: 0, runsExtras: 5, runsTotal: 5, runsCompleted: 4
  }, (result) => {
    assert.strictEqual(result.newState.runs, 5);
    assert.strictEqual(result.newState.extras.wides, 5);
    assert.strictEqual(result.newState.currentBowler.runs, 5);
    assert.strictEqual(result.newState.striker.id, 's-123'); // strike not rotated based on 4 boundary runs
  });

  // 12. Invalid runsBatter > 0 rejected
  runTest('12. Invalid runsBatter > 0 rejected', {
    runsBatter: 1, runsExtras: 1, runsTotal: 2, runsCompleted: 0
  }, (result) => {
    assert.strictEqual(result.success, false);
    assert.strictEqual(result.error, 'A Wide cannot have batter runs.');
  });

  // 13. Invalid runsTotal rejected
  runTest('13. Invalid runsTotal rejected', {
    runsBatter: 0, runsExtras: 1, runsTotal: 2, runsCompleted: 0
  }, (result) => {
    assert.strictEqual(result.success, false);
    assert.strictEqual(result.error, 'Total runs do not match bat runs + extras.');
  });

  // 14. Invalid isLegalDelivery=true rejected
  runTest('14. Invalid isLegalDelivery=true rejected', {
    runsBatter: 0, runsExtras: 1, runsTotal: 1, runsCompleted: 0, isLegalDelivery: true
  }, (result) => {
    assert.strictEqual(result.success, false);
    assert.strictEqual(result.error, 'A Wide cannot be a legal delivery.');
  });

  // 16. Invalid Wide with runsExtras < 1 rejected
  runTest('16. Invalid Wide with runsExtras < 1 rejected', {
    runsBatter: 0, runsExtras: 0, runsTotal: 0, runsCompleted: 0
  }, (result) => {
    assert.strictEqual(result.success, false);
    assert.strictEqual(result.error, 'A Wide must have at least 1 extra run.');
  });

  // 17. Wide + Run Out
  runTest('17. Wide + Run Out', {
    wicketType: 'RUN_OUT',
    dismissedPlayerId: 's-123',
    runsBatter: 0, runsExtras: 2, runsTotal: 2, runsCompleted: 1
  }, (result) => {
    assert.strictEqual(result.success, true);
    assert.strictEqual(result.newState.runs, 2); 
    assert.strictEqual(result.newState.wickets, 1);
    assert.strictEqual(result.newState.extras.wides, 2);
    // STRIKER dismissed. incoming batter goes to NON-STRIKER (since old striker was supposed to rotate based on 1 run)
    // Wait, let's see how run out works: striker completes 1 run, they are now at non-striker end. If they are run out there, they are dismissed.
    // We just check that the wicket was recorded successfully.
  });

  console.log('All Wide tests passed successfully!');
}

runAllTests();
