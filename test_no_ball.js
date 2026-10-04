import assert from 'assert';
import { processDelivery } from './src/engine/cricketStateMachine.js';

function createInitialState() {
  return {
    runs: 0,
    wickets: 0,
    balls: 0,
    currentOverBalls: [],
    striker: { id: 's-123', name: 'Striker', runs: 0, balls: 0, fours: 0, sixes: 0 },
    nonStriker: { id: 'ns-456', name: 'NonStriker', runs: 0, balls: 0, fours: 0, sixes: 0 },
    currentBowler: { id: 'b-789', name: 'Bowler', runs: 0, wickets: 0, ballsBowled: 0, overs: 0 },
    extras: { total: 0, wides: 0, noBalls: 0, byes: 0, legByes: 0, penalty: 0 },
    isFreeHit: false,
    innings: 1,
    totalMatchOvers: 20,
    target: null,
    scorecard: { fallOfWickets: [] },
    matchStatus: 'IN_PROGRESS',
    lastOverBowlerId: null
  };
}

function runTest(testName, deliveryOverrides, assertFn) {
  const initialState = createInitialState();
  const delivery = {
    type: 'extra',
    extraType: 'NO_BALL',
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
  console.log('Running tests for No-Ball State Machine logic...');

  // 1. NB only
  runTest('1. NB only', {
    runsBatter: 0, runsExtras: 1, runsTotal: 1, runsCompleted: 0
  }, (result) => {
    assert.strictEqual(result.success, true);
    assert.strictEqual(result.newState.runs, 1); // team +1
    assert.strictEqual(result.newState.extras.noBalls, 1);
    assert.strictEqual(result.newState.striker.runs, 0); // bat +0
    assert.strictEqual(result.newState.striker.balls, 1); // NB counts as ball faced
    assert.strictEqual(result.newState.currentBowler.runs, 1); // bowler +1
    assert.strictEqual(result.newState.balls, 0); // legal balls unchanged
    assert.strictEqual(result.newState.isFreeHit, true);
  });

  // 2. NB + 1
  runTest('2. NB + 1 bat run', {
    runsBatter: 1, runsExtras: 1, runsTotal: 2, runsCompleted: 1
  }, (result) => {
    assert.strictEqual(result.newState.runs, 2); // team +2
    assert.strictEqual(result.newState.extras.noBalls, 1);
    assert.strictEqual(result.newState.nonStriker.runs, 1); // old striker rotated
    assert.strictEqual(result.newState.nonStriker.balls, 1); 
    assert.strictEqual(result.newState.currentBowler.runs, 2); // bowler +2
    assert.strictEqual(result.newState.balls, 0); // legal balls unchanged
    assert.strictEqual(result.newState.striker.id, 'ns-456'); // strike rotated
  });

  // 3. NB + 2
  runTest('3. NB + 2 bat runs', {
    runsBatter: 2, runsExtras: 1, runsTotal: 3, runsCompleted: 2
  }, (result) => {
    assert.strictEqual(result.newState.runs, 3);
    assert.strictEqual(result.newState.striker.runs, 2);
    assert.strictEqual(result.newState.currentBowler.runs, 3);
    assert.strictEqual(result.newState.striker.id, 's-123'); // strike not rotated
  });

  // 4. NB + 3
  runTest('4. NB + 3 bat runs', {
    runsBatter: 3, runsExtras: 1, runsTotal: 4, runsCompleted: 3
  }, (result) => {
    assert.strictEqual(result.newState.runs, 4);
    assert.strictEqual(result.newState.nonStriker.runs, 3);
    assert.strictEqual(result.newState.currentBowler.runs, 4);
    assert.strictEqual(result.newState.striker.id, 'ns-456'); // strike rotated
  });

  // 5. NB + 4
  runTest('5. NB + 4 bat runs', {
    runsBatter: 4, runsExtras: 1, runsTotal: 5, runsCompleted: 4
  }, (result) => {
    assert.strictEqual(result.newState.runs, 5);
    assert.strictEqual(result.newState.striker.runs, 4);
    assert.strictEqual(result.newState.striker.fours, 1);
    assert.strictEqual(result.newState.currentBowler.runs, 5);
    assert.strictEqual(result.newState.striker.id, 's-123'); 
  });

  // 6. NB + 5
  runTest('6. NB + 5 bat runs', {
    runsBatter: 5, runsExtras: 1, runsTotal: 6, runsCompleted: 5
  }, (result) => {
    assert.strictEqual(result.newState.runs, 6);
    assert.strictEqual(result.newState.nonStriker.runs, 5);
    assert.strictEqual(result.newState.currentBowler.runs, 6);
    assert.strictEqual(result.newState.striker.id, 'ns-456'); 
  });

  // 7. NB + 6
  runTest('7. NB + 6 bat runs', {
    runsBatter: 6, runsExtras: 1, runsTotal: 7, runsCompleted: 6 // physical boundary handling is outside the SM scope for position, but this forces non-rotation
  }, (result) => {
    assert.strictEqual(result.newState.runs, 7);
    assert.strictEqual(result.newState.striker.runs, 6);
    assert.strictEqual(result.newState.striker.sixes, 1);
    assert.strictEqual(result.newState.currentBowler.runs, 7);
    assert.strictEqual(result.newState.striker.id, 's-123'); 
  });

  // 13. Invalid negative runs rejected
  runTest('13. Invalid negative runs rejected', {
    runsBatter: -1, runsExtras: 1, runsTotal: 0, runsCompleted: 0
  }, (result) => {
    assert.strictEqual(result.success, false);
    assert.strictEqual(result.error, 'Runs cannot be negative.');
  });

  // 14. Invalid runsTotal rejected
  runTest('14. Invalid runsTotal rejected', {
    runsBatter: 1, runsExtras: 1, runsTotal: 3, runsCompleted: 1
  }, (result) => {
    assert.strictEqual(result.success, false);
    assert.strictEqual(result.error, 'Total runs do not match bat runs + extras.');
  });

  // 15. Invalid isLegalDelivery: true rejected for NO_BALL
  runTest('15. Invalid isLegalDelivery: true rejected', {
    runsBatter: 0, runsExtras: 1, runsTotal: 1, runsCompleted: 0, isLegalDelivery: true
  }, (result) => {
    assert.strictEqual(result.success, false);
    assert.strictEqual(result.error, 'A No-Ball cannot be a legal delivery.');
  });

  console.log('All No-Ball tests passed successfully!');
}

runAllTests();
