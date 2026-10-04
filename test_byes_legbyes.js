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

let executedTests = 0;

function runTest(testName, deliveryOverrides, assertFn) {
  const initialState = createInitialState();
  const delivery = {
    extraType: 'BYE',
    wicketType: 'NONE',
    runsBatter: 0,
    runsExtras: 1,
    runsTotal: 1,
    runsCompleted: 1,
    isLegalDelivery: true,
    isBoundary: false,
    ...deliveryOverrides
  };

  const result = processDelivery(initialState, delivery);
  
  try {
    assertFn(result, initialState);
    console.log(`✅ ${testName}`);
    executedTests++;
  } catch (error) {
    console.error(`❌ ${testName} FAILED`);
    console.error(error);
    process.exit(1);
  }
}

function runAllTests() {
  console.log('Running extended tests for Byes and Leg Byes State Machine logic...');

  // --- BYE TESTS ---
  
  runTest('1. Bye +1', {
    extraType: 'BYE', runsBatter: 0, runsExtras: 1, runsTotal: 1, runsCompleted: 1
  }, (result) => {
    assert.strictEqual(result.success, true);
    assert.strictEqual(result.newState.runs, 1);
    assert.strictEqual(result.newState.extras.byes, 1);
  });

  runTest('2. Bye +2', {
    extraType: 'BYE', runsBatter: 0, runsExtras: 2, runsTotal: 2, runsCompleted: 2
  }, (result) => {
    assert.strictEqual(result.newState.runs, 2);
    assert.strictEqual(result.newState.extras.byes, 2);
  });

  runTest('3. Bye +3', {
    extraType: 'BYE', runsBatter: 0, runsExtras: 3, runsTotal: 3, runsCompleted: 3
  }, (result) => {
    assert.strictEqual(result.newState.runs, 3);
    assert.strictEqual(result.newState.extras.byes, 3);
  });

  runTest('4. Bye +4 physically completed', {
    extraType: 'BYE', runsBatter: 0, runsExtras: 4, runsTotal: 4, runsCompleted: 4
  }, (result) => {
    assert.strictEqual(result.newState.runs, 4);
    assert.strictEqual(result.newState.extras.byes, 4);
    assert.strictEqual(result.newState.striker.id, 's-123'); // 4 physical crossings = no net change
  });

  runTest('5. Bye boundary', {
    extraType: 'BYE', runsBatter: 0, runsExtras: 4, runsTotal: 4, runsCompleted: 0, isBoundary: true
  }, (result) => {
    assert.strictEqual(result.newState.runs, 4);
    assert.strictEqual(result.newState.extras.byes, 4);
    assert.strictEqual(result.newState.striker.id, 's-123'); // 0 physical crossings = no net change
  });

  runTest('6. Bye + odd physical runs -> end change', {
    extraType: 'BYE', runsBatter: 0, runsExtras: 1, runsTotal: 1, runsCompleted: 1
  }, (result) => {
    assert.strictEqual(result.newState.striker.id, 'ns-456');
  });

  runTest('7. Bye + even physical runs -> no net end change', {
    extraType: 'BYE', runsBatter: 0, runsExtras: 2, runsTotal: 2, runsCompleted: 2
  }, (result) => {
    assert.strictEqual(result.newState.striker.id, 's-123');
  });

  runTest('8. Bye does not credit batter runs', {
    extraType: 'BYE', runsBatter: 0, runsExtras: 2, runsTotal: 2, runsCompleted: 2
  }, (result) => {
    assert.strictEqual(result.newState.striker.runs, 0);
  });

  runTest('9. Bye does not charge bowler runs', {
    extraType: 'BYE', runsBatter: 0, runsExtras: 2, runsTotal: 2, runsCompleted: 2
  }, (result) => {
    assert.strictEqual(result.newState.currentBowler.runs, 0);
  });

  runTest('10. Bye is legal delivery', {
    extraType: 'BYE', runsBatter: 0, runsExtras: 1, runsTotal: 1, runsCompleted: 1, isLegalDelivery: true
  }, (result) => {
    assert.strictEqual(result.newState.balls, 1);
    assert.strictEqual(result.newState.striker.balls, 0); // old striker faced 1 ball:
    assert.strictEqual(result.newState.nonStriker.balls, 1); 
  });


  // --- LEG BYE TESTS ---

  runTest('11. Leg Bye +1', {
    extraType: 'LEG_BYE', runsBatter: 0, runsExtras: 1, runsTotal: 1, runsCompleted: 1
  }, (result) => {
    assert.strictEqual(result.success, true);
    assert.strictEqual(result.newState.runs, 1);
    assert.strictEqual(result.newState.extras.legByes, 1);
  });

  runTest('12. Leg Bye +2', {
    extraType: 'LEG_BYE', runsBatter: 0, runsExtras: 2, runsTotal: 2, runsCompleted: 2
  }, (result) => {
    assert.strictEqual(result.newState.runs, 2);
    assert.strictEqual(result.newState.extras.legByes, 2);
  });

  runTest('13. Leg Bye +3', {
    extraType: 'LEG_BYE', runsBatter: 0, runsExtras: 3, runsTotal: 3, runsCompleted: 3
  }, (result) => {
    assert.strictEqual(result.newState.runs, 3);
    assert.strictEqual(result.newState.extras.legByes, 3);
  });

  runTest('14. Leg Bye +4 physically completed', {
    extraType: 'LEG_BYE', runsBatter: 0, runsExtras: 4, runsTotal: 4, runsCompleted: 4
  }, (result) => {
    assert.strictEqual(result.newState.runs, 4);
    assert.strictEqual(result.newState.extras.legByes, 4);
    assert.strictEqual(result.newState.striker.id, 's-123'); // 4 physical crossings = no net change
  });

  runTest('15. Leg Bye boundary', {
    extraType: 'LEG_BYE', runsBatter: 0, runsExtras: 4, runsTotal: 4, runsCompleted: 0, isBoundary: true
  }, (result) => {
    assert.strictEqual(result.newState.runs, 4);
    assert.strictEqual(result.newState.extras.legByes, 4);
    assert.strictEqual(result.newState.striker.id, 's-123'); // 0 physical crossings = no net change
  });

  runTest('16. Leg Bye + odd physical runs -> end change', {
    extraType: 'LEG_BYE', runsBatter: 0, runsExtras: 1, runsTotal: 1, runsCompleted: 1
  }, (result) => {
    assert.strictEqual(result.newState.striker.id, 'ns-456');
  });

  runTest('17. Leg Bye + even physical runs -> no net end change', {
    extraType: 'LEG_BYE', runsBatter: 0, runsExtras: 2, runsTotal: 2, runsCompleted: 2
  }, (result) => {
    assert.strictEqual(result.newState.striker.id, 's-123');
  });

  runTest('18. Leg Bye does not credit batter runs', {
    extraType: 'LEG_BYE', runsBatter: 0, runsExtras: 2, runsTotal: 2, runsCompleted: 2
  }, (result) => {
    assert.strictEqual(result.newState.striker.runs, 0);
  });

  runTest('19. Leg Bye does not charge bowler runs', {
    extraType: 'LEG_BYE', runsBatter: 0, runsExtras: 2, runsTotal: 2, runsCompleted: 2
  }, (result) => {
    assert.strictEqual(result.newState.currentBowler.runs, 0);
  });

  runTest('20. Leg Bye is legal delivery', {
    extraType: 'LEG_BYE', runsBatter: 0, runsExtras: 1, runsTotal: 1, runsCompleted: 1, isLegalDelivery: true
  }, (result) => {
    assert.strictEqual(result.newState.balls, 1);
  });

  // --- BOUNDARY SEMANTICS ---

  runTest('21. Bye boundary has runsCompleted=0', {
    extraType: 'BYE', runsBatter: 0, runsExtras: 4, runsTotal: 4, runsCompleted: 0, isBoundary: true
  }, (result) => {
    assert.strictEqual(result.newState.striker.id, 's-123');
    assert.strictEqual(result.newState.runs, 4);
  });

  runTest('22. Leg Bye boundary has runsCompleted=0', {
    extraType: 'LEG_BYE', runsBatter: 0, runsExtras: 4, runsTotal: 4, runsCompleted: 0, isBoundary: true
  }, (result) => {
    assert.strictEqual(result.newState.striker.id, 's-123');
    assert.strictEqual(result.newState.runs, 4);
  });

  runTest('23. Bye +4 completed has runsCompleted=4', {
    extraType: 'BYE', runsBatter: 0, runsExtras: 4, runsTotal: 4, runsCompleted: 4
  }, (result) => {
    assert.strictEqual(result.newState.striker.id, 's-123');
    assert.strictEqual(result.newState.runs, 4);
  });

  runTest('24. Leg Bye +4 completed has runsCompleted=4', {
    extraType: 'LEG_BYE', runsBatter: 0, runsExtras: 4, runsTotal: 4, runsCompleted: 4
  }, (result) => {
    assert.strictEqual(result.newState.striker.id, 's-123');
    assert.strictEqual(result.newState.runs, 4);
  });


  // --- VALIDATION & ACCOUNTING ---

  runTest('25. runsTotal = runsBatter + runsExtras', {
    extraType: 'BYE', runsBatter: 0, runsExtras: 1, runsTotal: 2, runsCompleted: 1
  }, (result) => {
    assert.strictEqual(result.success, false);
    assert.strictEqual(result.error, 'Total runs do not match bat runs + extras.');
  });

  runTest('26. runsBatter > 0 rejected for pure BYE', {
    extraType: 'BYE', runsBatter: 1, runsExtras: 1, runsTotal: 2, runsCompleted: 1
  }, (result) => {
    assert.strictEqual(result.success, false);
    assert.strictEqual(result.error, 'A pure Bye or Leg-Bye cannot have batter runs.');
  });

  runTest('27. runsBatter > 0 rejected for pure LEG_BYE', {
    extraType: 'LEG_BYE', runsBatter: 1, runsExtras: 1, runsTotal: 2, runsCompleted: 1
  }, (result) => {
    assert.strictEqual(result.success, false);
    assert.strictEqual(result.error, 'A pure Bye or Leg-Bye cannot have batter runs.');
  });

  runTest('28. runsExtras <= 0 rejected', {
    extraType: 'BYE', runsBatter: 0, runsExtras: 0, runsTotal: 0, runsCompleted: 0
  }, (result) => {
    assert.strictEqual(result.success, false);
    assert.strictEqual(result.error, 'A pure Bye or Leg-Bye must have at least 1 extra run.');
  });

  runTest('29. isLegalDelivery=false rejected for pure BYE/LEG_BYE', {
    extraType: 'BYE', runsBatter: 0, runsExtras: 1, runsTotal: 1, runsCompleted: 1, isLegalDelivery: false
  }, (result) => {
    assert.strictEqual(result.success, false);
    assert.strictEqual(result.error, 'A pure Bye or Leg-Bye must be a legal delivery.');
  });

  runTest('30. negative runsCompleted rejected', {
    extraType: 'BYE', runsBatter: 0, runsExtras: 1, runsTotal: 1, runsCompleted: -1
  }, (result) => {
    assert.strictEqual(result.success, false);
    // Since Zod validates min(0), it will throw before state machine in UI, 
    // but processDelivery explicitly returns an error:
    assert.strictEqual(result.error, 'Runs cannot be negative.');
  });

  // Additional check: Bye +1 physical + boundary? 
  // User asked "if the current application cannot represent such a combined result safely, report it"
  // runsCompleted = 1, runsExtras = 5 (1 physical + 4 boundary).
  runTest('31. Bye +1 physical + overthrow boundary', {
    extraType: 'BYE', runsBatter: 0, runsExtras: 5, runsTotal: 5, runsCompleted: 1, isBoundary: true
  }, (result) => {
    assert.strictEqual(result.newState.runs, 5);
    assert.strictEqual(result.newState.extras.byes, 5);
    // 1 physical cross = strike rotates!
    assert.strictEqual(result.newState.striker.id, 'ns-456'); 
  });


  console.log(`\nAll ${executedTests} Byes and Leg Byes tests passed successfully!`);
}

runAllTests();
