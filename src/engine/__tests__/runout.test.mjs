// Run-out through the REAL pipeline: the same payload shape the scoring UI
// produces (recordWicket -> recordDeliveryEvent -> normalizeDelivery), then folded
// by both the projection (viewers / scorecard) and the live replay (scorer screen).
import test from 'node:test';
import assert from 'node:assert/strict';
import { normalizeDelivery } from '../deliveryContract.js';
import { buildMatchState } from '../matchProjection.js';
import { buildLiveState } from '../liveState.js';

// Shape produced by useMatchScoring.recordWicket + recordDeliveryEvent.
function runOutUi({ dismissedId, runsCompleted, strikerId, nonStrikerId }) {
  return normalizeDelivery({
    type: 'wicket',
    wicket: true,
    dismissalType: 'Run Out',
    dismissedPlayerId: dismissedId,
    outPlayerId: dismissedId,
    fielderName: 'Fielder',
    runsBatter: runsCompleted,
    runsCompleted,
    strikerId,
    nonStrikerId,
    bowlerId: 'bw',
    balls: 0,
  });
}

const ev = (id, seq, payload) => ({
  id, type: 'DELIVERY', matchId: 'M', inningsNumber: 1, seq,
  logSeq: seq, payload, voided: false,
});

const START = [
  { id: 'ms', type: 'MATCH_STARTED', matchId: 'M', logSeq: 0, payload: { format: 'T20', battedFirstTeamId: 'A', otherTeamId: 'B' } },
  { id: 'is', type: 'INNINGS_STARTED', matchId: 'M', inningsNumber: 1, logSeq: 0.5, payload: { battingTeamId: 'A', bowlingTeamId: 'B' } },
];

test('run-out of NON-striker (1 run completed) counts as a wicket in projection and live view', () => {
  const p1 = runOutUi({ dismissedId: 'nonS', runsCompleted: 1, strikerId: 'S', nonStrikerId: 'nonS' });
  // Ball 1: a normal run-out of the non-striker.
  const events = [...START, ev('d1', 1, p1)];
  // Give the normalized payload the fields the projection/replay read.
  events[2].payload = { ...p1, strikerId: 'S', nonStrikerId: 'nonS', bowlerId: 'bw' };

  const proj = buildMatchState(events, { format: 'T20' });
  assert.equal(proj.innings[0].wickets, 1, 'projection: one wicket');
  assert.equal(proj.innings[0].runs, 1, 'projection: one run completed');

  const live = buildLiveState(events, { format: 'T20' });
  assert.equal(live.wickets, 1, 'live replay must not silently drop the run-out');
  assert.equal(live.runs, 1);
  assert.equal(live.balls, 1);
});

test('run-out of STRIKER is replayed identically to the projection', () => {
  const p1 = runOutUi({ dismissedId: 'S', runsCompleted: 0, strikerId: 'S', nonStrikerId: 'nonS' });
  const events = [...START, ev('d1', 1, { ...p1, strikerId: 'S', nonStrikerId: 'nonS', bowlerId: 'bw' })];
  const proj = buildMatchState(events, { format: 'T20' });
  const live = buildLiveState(events, { format: 'T20' });
  assert.equal(proj.innings[0].wickets, 1);
  assert.equal(live.wickets, proj.innings[0].wickets, 'live and projection must agree on wickets');
  assert.equal(live.runs, proj.innings[0].runs);
});
