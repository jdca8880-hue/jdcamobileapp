import { processDelivery } from '../src/engine/cricketStateMachine.js';
import assert from 'assert';

console.log('Running Validation Tests...');

const createBaseState = (striker, nonStriker, bowler) => ({
  striker: { id: striker.id, name: striker.name, runs: 0, balls: 0, fours: 0, sixes: 0 },
  nonStriker: { id: nonStriker.id, name: nonStriker.name, runs: 0, balls: 0, fours: 0, sixes: 0 },
  currentBowler: { id: bowler.id, name: bowler.name, runs: 0, wickets: 0, ballsBowled: 0 },
  runs: 0,
  wickets: 0,
  balls: 0,
  currentOverBalls: [],
  extras: { wides: 0, noBalls: 0, byes: 0, legByes: 0 },
  scorecard: { fallOfWickets: [] },
});

const baseBallInput = {
  runsTotal: 1,
  runsBatter: 1,
  runsExtras: 0,
  runsCompleted: 1,
  extraType: 'NONE',
  wicketType: 'NONE',
  isLegalDelivery: true
};

function runTest(name, fn) {
  try {
    fn();
    console.log(`✅ ${name}`);
  } catch (err) {
    console.error(`❌ ${name}`);
    console.error(err.message);
    process.exit(1);
  }
}

// 1. Striker / Bowler ID collision
runTest('1. Reject striker === bowler by ID', () => {
  const state = createBaseState(
    { id: 'player-1', name: 'John Doe' },
    { id: 'player-2', name: 'Jane Doe' },
    { id: 'player-1', name: 'John Doe' } // collision
  );
  const result = processDelivery(state, baseBallInput);
  assert.strictEqual(result.success, false);
  assert.strictEqual(result.error, 'A player cannot be both a batter and the bowler simultaneously.');
});

// 2. Non-Striker / Bowler ID collision
runTest('2. Reject nonStriker === bowler by ID', () => {
  const state = createBaseState(
    { id: 'player-1', name: 'John Doe' },
    { id: 'player-2', name: 'Jane Doe' },
    { id: 'player-2', name: 'Jane Doe' } // collision
  );
  const result = processDelivery(state, baseBallInput);
  assert.strictEqual(result.success, false);
  assert.strictEqual(result.error, 'A player cannot be both a batter and the bowler simultaneously.');
});

// 3. Striker / Non-Striker ID collision
runTest('3. Reject striker === nonStriker by ID', () => {
  const state = createBaseState(
    { id: 'player-1', name: 'John Doe' },
    { id: 'player-1', name: 'John Doe' }, // collision
    { id: 'player-3', name: 'Jim Doe' }
  );
  const result = processDelivery(state, baseBallInput);
  assert.strictEqual(result.success, false);
  assert.strictEqual(result.error, 'The striker and non-striker cannot be the same player.');
});

// 4. Name collisions (allowed)
runTest('4. Allow name collisions if IDs are different', () => {
  const state = createBaseState(
    { id: 'player-1', name: 'John Smith' },
    { id: 'player-2', name: 'Jane Doe' },
    { id: 'player-3', name: 'John Smith' } // Same name, different ID
  );
  const result = processDelivery(state, baseBallInput);
  assert.strictEqual(result.success, true);
});

// 5. Valid selection
runTest('5. Allow valid selection with different IDs', () => {
  const state = createBaseState(
    { id: 'p-1', name: 'Alice' },
    { id: 'p-2', name: 'Bob' },
    { id: 'p-3', name: 'Charlie' }
  );
  const result = processDelivery(state, baseBallInput);
  assert.strictEqual(result.success, true);
});

console.log('\\nAll scoring validation tests passed!');
