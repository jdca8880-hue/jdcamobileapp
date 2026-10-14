// Phase 3/6 tests: the v2 scorecard is driven by the ONE canonical projection
// (buildMatchState) reshaped by projectionToScorecard — no second aggregation.
// Realistic event fixtures; asserts the figures api.getMatchScorecard now serves
// for a v2 match. Covers: returning bowler, non-striker run-out, every extra +
// legal-ball accounting, maidens, away-team-batting-first, multi-innings, and
// fold determinism.
import test from 'node:test';
import assert from 'node:assert/strict';

import { buildMatchState } from '../matchProjection.js';
import { projectionToScorecard } from '../scorecardProjection.js';
import { EVENT_TYPES } from '../matchEvents.js';

let _seq = 0;
function log() {
  _seq = 0;
  const events = [];
  const add = (type, inningsNumber, payload = {}) => {
    events.push({ id: `e${_seq}`, type, matchId: 'M', inningsNumber, seq: null, payload, voided: false, logSeq: _seq++ });
  };
  return { events, add };
}
// delivery payload with explicit personnel + names
const d = (f = {}) => ({
  strikerId: f.s ?? 'b1', nonStrikerId: f.ns ?? 'b2', bowlerId: f.bw ?? 'bw1',
  striker: f.sn ?? 'Striker', nonStriker: f.nsn ?? 'NonStriker', bowler: f.bwn ?? 'Bowler',
  runsBatter: f.rb ?? 0, runsExtras: f.re ?? 0, runsTotal: (f.rb ?? 0) + (f.re ?? 0),
  extraType: f.extra ?? 'NONE', wicketType: f.wkt ?? 'NONE', isLegalDelivery: f.legal ?? true,
  dismissedPlayerId: f.out ?? null, dismissedPlayerName: f.outName ?? null,
});
const scorecardOf = (events, format = 'T20') => projectionToScorecard(buildMatchState(events, { format }));

test('returning bowler keeps cumulative figures across spells (not reset)', () => {
  const l = log();
  l.add(EVENT_TYPES.MATCH_STARTED, null, { format: 'T20', battedFirstTeamId: 'A', otherTeamId: 'B' });
  l.add(EVENT_TYPES.INNINGS_STARTED, 1, { battingTeamId: 'A', bowlingTeamId: 'B' });
  // Over 1 — bw1 (6 legal, 4 runs)
  l.add(EVENT_TYPES.DELIVERY, 1, d({ bw: 'bw1', rb: 4 }));
  for (let i = 0; i < 5; i++) l.add(EVENT_TYPES.DELIVERY, 1, d({ bw: 'bw1', rb: 0 }));
  // Over 2 — bw2 (6 legal, 2 runs)
  l.add(EVENT_TYPES.DELIVERY, 1, d({ bw: 'bw2', rb: 2 }));
  for (let i = 0; i < 5; i++) l.add(EVENT_TYPES.DELIVERY, 1, d({ bw: 'bw2', rb: 0 }));
  // Over 3 — bw1 RETURNS (3 legal, 6 runs)
  l.add(EVENT_TYPES.DELIVERY, 1, d({ bw: 'bw1', rb: 6 }));
  l.add(EVENT_TYPES.DELIVERY, 1, d({ bw: 'bw1', rb: 0 }));
  l.add(EVENT_TYPES.DELIVERY, 1, d({ bw: 'bw1', rb: 0 }));

  const inn = scorecardOf(l.events)[0];
  const bw1 = inn.bowling.find((b) => b.id === 'bw1');
  assert.equal(bw1.balls, 9, 'returning bowler balls accumulate (6 + 3)');
  assert.equal(bw1.runs, 10, 'returning bowler runs accumulate (4 + 6)');
  assert.equal(bw1.overs, '1.3');
});

test('non-striker run-out attributes to the non-striker; bowler not credited', () => {
  const l = log();
  l.add(EVENT_TYPES.MATCH_STARTED, null, { format: 'T20', battedFirstTeamId: 'A', otherTeamId: 'B' });
  l.add(EVENT_TYPES.INNINGS_STARTED, 1, { battingTeamId: 'A', bowlingTeamId: 'B' });
  l.add(EVENT_TYPES.DELIVERY, 1, d({ s: 'b1', ns: 'b2', sn: 'Alice', nsn: 'Bob', rb: 1 }));
  // non-striker b2 run out going for a 2nd
  l.add(EVENT_TYPES.DELIVERY, 1, d({ s: 'b1', ns: 'b2', sn: 'Alice', nsn: 'Bob', rb: 1, wkt: 'RUN_OUT', out: 'b2', outName: 'Bob' }));

  const inn = scorecardOf(l.events)[0];
  const alice = inn.batting.find((b) => b.id === 'b1');
  const bob = inn.batting.find((b) => b.id === 'b2');
  assert.equal(bob.dismissal, 'run out', 'the NON-striker is the one out');
  assert.equal(alice.dismissal, 'not out', 'striker stays not out');
  assert.equal(inn.wickets, 1);
  assert.equal(inn.fallOfWickets[0].player, 'Bob');
  const bw = inn.bowling.find((b) => b.id === 'bw1');
  assert.equal(bw.wickets, 0, 'run-out is never credited to the bowler');
});

test('all extras + legal-ball accounting + per-bowler wides/no-balls', () => {
  const l = log();
  l.add(EVENT_TYPES.MATCH_STARTED, null, { format: 'T20', battedFirstTeamId: 'A', otherTeamId: 'B' });
  l.add(EVENT_TYPES.INNINGS_STARTED, 1, { battingTeamId: 'A', bowlingTeamId: 'B' });
  l.add(EVENT_TYPES.DELIVERY, 1, d({ extra: 'WIDE', re: 1, legal: false }));
  l.add(EVENT_TYPES.DELIVERY, 1, d({ extra: 'NO_BALL', re: 1, rb: 4, legal: false }));
  l.add(EVENT_TYPES.DELIVERY, 1, d({ extra: 'BYE', re: 1, legal: true }));
  l.add(EVENT_TYPES.DELIVERY, 1, d({ extra: 'LEG_BYE', re: 1, legal: true }));
  l.add(EVENT_TYPES.PENALTY, 1, { penaltyRuns: 5, recipientTeamId: 'A' });

  const inn = scorecardOf(l.events)[0];
  assert.equal(inn.runs, 13, 'wide1 + noball(1+4) + bye1 + legbye1 + penalty5');
  assert.equal(inn.extras, 9, 'wides1+noBalls1+byes1+legByes1+penalty5');
  assert.equal(inn.legalBalls, 2, 'only bye + leg-bye are legal');
  assert.equal(inn.overs, '0.2');
  const bw = inn.bowling.find((b) => b.id === 'bw1');
  assert.equal(bw.wides, 1);
  assert.equal(bw.noBalls, 1);
  assert.equal(bw.runs, 6, 'wide1 + noball5; byes/leg-byes not charged to bowler');
  assert.equal(bw.balls, 2);
  const striker = inn.batting.find((b) => b.id === 'b1');
  assert.equal(striker.runs, 4, 'the 4 off the no-ball is the batter’s');
  assert.equal(striker.balls, 3, 'no-ball + bye + leg-bye are faced; wide is not');
});

test('maiden over counted; an over with a wide is not a maiden', () => {
  const l = log();
  l.add(EVENT_TYPES.MATCH_STARTED, null, { format: 'T20', battedFirstTeamId: 'A', otherTeamId: 'B' });
  l.add(EVENT_TYPES.INNINGS_STARTED, 1, { battingTeamId: 'A', bowlingTeamId: 'B' });
  // Over 1 — bw1 six dot balls -> maiden
  for (let i = 0; i < 6; i++) l.add(EVENT_TYPES.DELIVERY, 1, d({ bw: 'bw1', rb: 0 }));
  // Over 2 — bw2 a wide then 6 dots -> NOT a maiden
  l.add(EVENT_TYPES.DELIVERY, 1, d({ bw: 'bw2', extra: 'WIDE', re: 1, legal: false }));
  for (let i = 0; i < 6; i++) l.add(EVENT_TYPES.DELIVERY, 1, d({ bw: 'bw2', rb: 0 }));

  const inn = scorecardOf(l.events)[0];
  assert.equal(inn.bowling.find((b) => b.id === 'bw1').maidens, 1);
  assert.equal(inn.bowling.find((b) => b.id === 'bw2').maidens, 0);
});

test('away team batting first is honoured (not hardcoded home)', () => {
  const l = log();
  l.add(EVENT_TYPES.MATCH_STARTED, null, { format: 'T20', battedFirstTeamId: 'AWAY', otherTeamId: 'HOME' });
  l.add(EVENT_TYPES.INNINGS_STARTED, 1, { battingTeamId: 'AWAY', bowlingTeamId: 'HOME' });
  l.add(EVENT_TYPES.DELIVERY, 1, d({ rb: 4 }));
  const sc = scorecardOf(l.events);
  assert.equal(sc[0].battingTeamId, 'AWAY');
  assert.equal(sc[0].bowlingTeamId, 'HOME');
});

test('multi-innings (Test) produces one ordered scorecard entry per innings', () => {
  const l = log();
  l.add(EVENT_TYPES.MATCH_STARTED, null, { format: 'TEST', battedFirstTeamId: 'A', otherTeamId: 'B' });
  l.add(EVENT_TYPES.INNINGS_STARTED, 1, { battingTeamId: 'A', bowlingTeamId: 'B' });
  l.add(EVENT_TYPES.DELIVERY, 1, d({ rb: 6 }));
  l.add(EVENT_TYPES.DECLARATION, 1, {});
  l.add(EVENT_TYPES.INNINGS_STARTED, 2, { battingTeamId: 'B', bowlingTeamId: 'A' });
  l.add(EVENT_TYPES.DELIVERY, 2, d({ s: 'c1', bw: 'bw9', rb: 2 }));
  l.add(EVENT_TYPES.DECLARATION, 2, {});
  l.add(EVENT_TYPES.INNINGS_STARTED, 3, { battingTeamId: 'A', bowlingTeamId: 'B' });
  l.add(EVENT_TYPES.DELIVERY, 3, d({ rb: 1 }));

  const sc = scorecardOf(l.events, 'TEST');
  assert.equal(sc.length, 3);
  assert.deepEqual(sc.map((s) => s.inningsNumber), [1, 2, 3]);
  assert.equal(sc[0].runs, 6);
  assert.equal(sc[1].runs, 2);
  assert.equal(sc[1].battingTeamId, 'B');
  assert.equal(sc[2].runs, 1);
});

test('duplicate event id is not double-counted in the scorecard', () => {
  const l = log();
  l.add(EVENT_TYPES.MATCH_STARTED, null, { format: 'T20', battedFirstTeamId: 'A', otherTeamId: 'B' });
  l.add(EVENT_TYPES.INNINGS_STARTED, 1, { battingTeamId: 'A', bowlingTeamId: 'B' });
  l.add(EVENT_TYPES.DELIVERY, 1, d({ rb: 4 }));
  // a replayed/duplicated copy with the SAME id
  l.events.push({ ...l.events[l.events.length - 1], logSeq: _seq++ });
  const inn = scorecardOf(l.events)[0];
  assert.equal(inn.runs, 4);
  assert.equal(inn.legalBalls, 1);
});

test('folding the same history repeatedly yields an identical scorecard (determinism)', () => {
  const l = log();
  l.add(EVENT_TYPES.MATCH_STARTED, null, { format: 'T20', battedFirstTeamId: 'A', otherTeamId: 'B' });
  l.add(EVENT_TYPES.INNINGS_STARTED, 1, { battingTeamId: 'A', bowlingTeamId: 'B' });
  l.add(EVENT_TYPES.DELIVERY, 1, d({ rb: 4 }));
  l.add(EVENT_TYPES.DELIVERY, 1, d({ rb: 1 }));
  l.add(EVENT_TYPES.DELIVERY, 1, d({ s: 'b2', rb: 0, wkt: 'BOWLED', out: 'b2', outName: 'Bob' }));
  const a = scorecardOf(l.events);
  const b = scorecardOf(l.events);
  assert.deepEqual(a, b);
});
