import assert from 'node:assert';
import { normalizeDelivery } from './src/engine/deliveryContract.js';
import { processDelivery } from './src/engine/cricketStateMachine.js';

function runTests() {
  console.log('Running tests for Canonical Delivery Contract...');

  // Test 1: Legacy Wicket Normalization
  const legacyWicket = {
    type: 'wicket',
    runs: 0,
    dismissalType: 'Caught',
    outPlayerName: 'player-xyz', // UI-only field mock
    fielderName: 'fielder-abc',
    wicketkeeperName: 'wk-123',
    wicket: true,
  };

  const normalizedWicket = normalizeDelivery(legacyWicket);
  
  assert.strictEqual(normalizedWicket.wicketType, 'CAUGHT', 'wicketType should map from dismissalType');
  assert.strictEqual(normalizedWicket.dismissedPlayerName, 'player-xyz', 'dismissedPlayerName should be extracted');
  assert.strictEqual(normalizedWicket.fielderName, 'fielder-abc', 'fielderName should be extracted');
  assert.strictEqual(normalizedWicket.runsBatter, 0, 'runsBatter should be 0');
  
  // Verify strict removal of aliases
  assert.strictEqual(normalizedWicket.outPlayerName, undefined, 'outPlayerName alias must be removed');
  assert.strictEqual(normalizedWicket.dismissalType, undefined, 'dismissalType alias must be removed');
  assert.strictEqual(normalizedWicket.runs, undefined, 'runs alias must be removed');

  // Test 2: Legacy Extra Normalization (Wide)
  const legacyExtra = {
    type: 'extra',
    extraType: 'wide',
    runs: 2,
    extraRuns: 2,
    totalRuns: 2
  };

  const normalizedExtra = normalizeDelivery(legacyExtra);
  
  assert.strictEqual(normalizedExtra.extraType, 'WIDE', 'extraType should be uppercased');
  assert.strictEqual(normalizedExtra.runsExtras, 2, 'runsExtras should map from extraRuns');
  assert.strictEqual(normalizedExtra.runsBatter, 0, 'runsBatter should be 0 for extras');
  assert.strictEqual(normalizedExtra.runsTotal, 2, 'runsTotal should map from totalRuns');
  assert.strictEqual(normalizedExtra.isLegalDelivery, false, 'Wides are not legal deliveries');

  // Verify strict removal of aliases
  assert.strictEqual(normalizedExtra.extraRuns, undefined, 'extraRuns alias must be removed');
  assert.strictEqual(normalizedExtra.type, undefined, 'type alias must be removed');

  // Test 3: State Machine wide consumption
  const dummyState = {
    runs: 0, wickets: 0, balls: 0, currentOverBalls: [], extras: {}, isFreeHit: false, scorecard: { fallOfWickets: [] },
    striker: { id: 's-1', runs: 0, balls: 0, fours: 0, sixes: 0 },
    nonStriker: { id: 'ns-2', runs: 0, balls: 0, fours: 0, sixes: 0 },
    currentBowler: { id: 'b-1', runs: 0, ballsBowled: 0, wickets: 0, overs: 0, economy: 0 }
  };

  const smResult = processDelivery(dummyState, legacyExtra);
  assert.strictEqual(smResult.success, true, 'State machine should accept canonical wide');
  assert.strictEqual(smResult.newState.extras.wides, 2, 'State machine should add runsExtras to wides');
  assert.strictEqual(smResult.newState.runs, 2, 'State machine should add to team runs correctly');

  console.log('All tests passed successfully!');
}

runTests();
