// Stage 1 tests for the deterministic truth-projection core.
// Run: npm test   (node --test, no extra deps)
import test from 'node:test';
import assert from 'node:assert/strict';

import { buildMatchState, oversFromBalls } from '../matchProjection.js';
import { EVENT_TYPES, nextSequence, makeEvent } from '../matchEvents.js';
import { resolveFormat, maxLegalBalls, isFinalInnings, battingSideIndex } from '../formats.js';

// ---- tiny log builder: assigns a global append offset (logSeq) ----
function makeLog() {
  let logSeq = 0;
  const events = [];
  const add = (type, inningsNumber, payload = {}) => {
    const e = { id: `evt-x-${logSeq}`, type, matchId: 'M', inningsNumber, seq: null, payload, voided: false, logSeq: logSeq++ };
    events.push(e);
    return e;
  };
  return { events, add };
}
function ball(over, f = {}) {
  const rb = f.rb ?? 0, re = f.re ?? 0;
  return {
    strikerId: f.s ?? 'b1', nonStrikerId: f.ns ?? 'b2', bowlerId: f.bw ?? 'bwl1',
    runsBatter: rb, runsExtras: re, runsTotal: rb + re,
    extraType: f.extra ?? 'NONE', wicketType: f.wkt ?? 'NONE',
    isLegalDelivery: f.legal ?? true, dismissedPlayerId: f.out ?? null, fielderId: f.fielder ?? null,
  };
}
// Emit deliveries summing to `runs` (sixes then a remainder ball) to close a total quickly.
function addRuns(log, inn, runs, s = 'b1', bw = 'bwl1') {
  let left = runs;
  while (left >= 6) { log.add(EVENT_TYPES.DELIVERY, inn, ball(0, { rb: 6, s, bw })); left -= 6; }
  if (left > 0) log.add(EVENT_TYPES.DELIVERY, inn, ball(0, { rb: left, s, bw }));
}

test('formats: resolve + rules are data-driven', () => {
  assert.equal(resolveFormat('TEST').id, 'TEST');
  assert.equal(resolveFormat('t20').id, 'T20');
  assert.equal(resolveFormat('50 overs').id, 'ODI');
  assert.equal(resolveFormat('Multi-day').id, 'TEST');
  assert.equal(resolveFormat(15).oversPerInnings, 15); // custom over count
  assert.equal(maxLegalBalls('T20', 1), 120);
  assert.equal(maxLegalBalls('TEST', 1), Infinity);
  assert.equal(maxLegalBalls('T20', 3), 6); // super over
  assert.equal(isFinalInnings('TEST', 4), true);
  assert.equal(isFinalInnings('TEST', 2), false);
  assert.equal(isFinalInnings('T20', 2), true);
});

test('T20 innings: totals, batter & bowler cards aggregate correctly', () => {
  const log = makeLog();
  log.add(EVENT_TYPES.MATCH_STARTED, null, { format: 'T20', battedFirstTeamId: 'A', otherTeamId: 'B' });
  log.add(EVENT_TYPES.INNINGS_STARTED, 1, {});
  log.add(EVENT_TYPES.DELIVERY, 1, ball(0, { s: 'b1', rb: 4 }));
  log.add(EVENT_TYPES.DELIVERY, 1, ball(0, { s: 'b1', rb: 0 }));
  log.add(EVENT_TYPES.DELIVERY, 1, ball(0, { s: 'b1', rb: 6 }));
  log.add(EVENT_TYPES.DELIVERY, 1, ball(0, { s: 'b1', rb: 1 }));
  log.add(EVENT_TYPES.DELIVERY, 1, ball(0, { s: 'b2', rb: 2 }));
  log.add(EVENT_TYPES.DELIVERY, 1, ball(0, { s: 'b2', rb: 0, wkt: 'BOWLED', out: 'b2' }));

  const st = buildMatchState(log.events);
  const i1 = st.innings[0];
  assert.equal(i1.runs, 13);
  assert.equal(i1.wickets, 1);
  assert.equal(i1.legalBalls, 6);
  assert.equal(oversFromBalls(i1.legalBalls), '1.0');
  assert.deepEqual(i1.extras, { wides: 0, noBalls: 0, byes: 0, legByes: 0, penalty: 0 });
  assert.deepEqual(i1.batting.b1, { playerId: 'b1', runs: 11, balls: 4, fours: 1, sixes: 1, out: false, dismissal: null });
  assert.equal(i1.batting.b2.runs, 2);
  assert.equal(i1.batting.b2.balls, 2);
  assert.equal(i1.batting.b2.out, true);
  assert.deepEqual(i1.bowling.bwl1, { playerId: 'bwl1', balls: 6, runs: 13, wickets: 1 });
  assert.equal(st.errors.length, 0);
});

test('extras: wide / no-ball / bye charged and counted per Law', () => {
  const log = makeLog();
  log.add(EVENT_TYPES.MATCH_STARTED, null, { format: 'T20', battedFirstTeamId: 'A', otherTeamId: 'B' });
  log.add(EVENT_TYPES.INNINGS_STARTED, 1, {});
  log.add(EVENT_TYPES.DELIVERY, 1, ball(0, { extra: 'WIDE', re: 1, legal: false }));
  log.add(EVENT_TYPES.DELIVERY, 1, ball(0, { extra: 'NO_BALL', re: 1, rb: 4, legal: false })); // boundary off a no-ball
  log.add(EVENT_TYPES.DELIVERY, 1, ball(0, { extra: 'BYE', re: 2, legal: true }));

  const i1 = buildMatchState(log.events).innings[0];
  assert.equal(i1.runs, 1 + 5 + 2); // 8
  assert.equal(i1.legalBalls, 1);   // only the bye is a legal ball
  assert.deepEqual(i1.extras, { wides: 1, noBalls: 1, byes: 2, legByes: 0, penalty: 0 });
  assert.equal(i1.batting.b1.runs, 4);       // 4 off the no-ball
  assert.equal(i1.batting.b1.balls, 2);      // faced the no-ball + the bye; the wide is not faced
  assert.equal(i1.bowling.bwl1.runs, 1 + 5); // wide+no-ball charged, bye NOT charged
});

test('determinism: same events -> identical state (any order of calls)', () => {
  const log = makeLog();
  log.add(EVENT_TYPES.MATCH_STARTED, null, { format: 'T20', battedFirstTeamId: 'A', otherTeamId: 'B' });
  log.add(EVENT_TYPES.INNINGS_STARTED, 1, {});
  addRuns(log, 1, 37);
  const norm = (s) => JSON.stringify({ status: s.status, result: s.result, innings: s.innings });
  assert.equal(norm(buildMatchState(log.events)), norm(buildMatchState(log.events)));
  // Shuffling input is fine because logSeq fixes the true order.
  const shuffled = [...log.events].reverse();
  assert.equal(norm(buildMatchState(shuffled)), norm(buildMatchState(log.events)));
});

test('idempotency: a duplicated event id is ignored', () => {
  const log = makeLog();
  log.add(EVENT_TYPES.MATCH_STARTED, null, { format: 'T20', battedFirstTeamId: 'A', otherTeamId: 'B' });
  log.add(EVENT_TYPES.INNINGS_STARTED, 1, {});
  const d = log.add(EVENT_TYPES.DELIVERY, 1, ball(0, { s: 'b1', rb: 4 }));
  const dup = { ...d }; // same id, arrives twice (a retry)
  const withDup = [...log.events, dup];
  assert.equal(buildMatchState(withDup).innings[0].runs, 4); // not 8
});

test('undo: voiding a delivery removes its effect deterministically', () => {
  const log = makeLog();
  log.add(EVENT_TYPES.MATCH_STARTED, null, { format: 'T20', battedFirstTeamId: 'A', otherTeamId: 'B' });
  log.add(EVENT_TYPES.INNINGS_STARTED, 1, {});
  log.add(EVENT_TYPES.DELIVERY, 1, ball(0, { s: 'b1', rb: 4 }));
  const wicket = log.add(EVENT_TYPES.DELIVERY, 1, ball(0, { s: 'b1', rb: 0, wkt: 'BOWLED', out: 'b1' }));
  wicket.voided = true; // scorer undid the wicket

  const i1 = buildMatchState(log.events).innings[0];
  assert.equal(i1.wickets, 0);
  assert.equal(i1.legalBalls, 1);
  assert.equal(i1.batting.b1.out, false);
});

test('Test: batting sides follow A,B,A,B and result is decided on aggregate', () => {
  const log = makeLog();
  log.add(EVENT_TYPES.MATCH_STARTED, null, { format: 'TEST', battedFirstTeamId: 'A', otherTeamId: 'B' });
  log.add(EVENT_TYPES.INNINGS_STARTED, 1, {}); addRuns(log, 1, 20); log.add(EVENT_TYPES.DECLARATION, 1, {});
  log.add(EVENT_TYPES.INNINGS_STARTED, 2, {}); addRuns(log, 2, 10); log.add(EVENT_TYPES.DECLARATION, 2, {});
  log.add(EVENT_TYPES.INNINGS_STARTED, 3, {}); addRuns(log, 3, 15); log.add(EVENT_TYPES.DECLARATION, 3, {});
  log.add(EVENT_TYPES.INNINGS_STARTED, 4, {}); addRuns(log, 4, 26); // target = (20+15)-10+1 = 26 -> chased

  const st = buildMatchState(log.events);
  assert.equal(st.innings[0].battingTeamId, 'A');
  assert.equal(st.innings[1].battingTeamId, 'B');
  assert.equal(st.innings[2].battingTeamId, 'A');
  assert.equal(st.innings[3].battingTeamId, 'B');
  assert.equal(st.innings[3].target, 26);
  assert.equal(st.status, 'COMPLETED');
  assert.equal(st.result.winnerTeamId, 'B'); // 36 vs 35 aggregate
});

test('T20 chase: innings 2 target and win-by-runs result', () => {
  const log = makeLog();
  log.add(EVENT_TYPES.MATCH_STARTED, null, { format: 'T10', battedFirstTeamId: 'A', otherTeamId: 'B' });
  log.add(EVENT_TYPES.INNINGS_STARTED, 1, {}); addRuns(log, 1, 30);
  log.add(EVENT_TYPES.INNINGS_ENDED, 1, {});
  log.add(EVENT_TYPES.INNINGS_STARTED, 2, {});
  assert.equal(buildMatchState(log.events).innings[1].target, 31);
  // Team B all out for 25 (10 wickets) chasing 31 -> A wins by 6 runs.
  addRuns(log, 2, 25, 'b1', 'bwlX');
  for (let i = 0; i < 10; i++) log.add(EVENT_TYPES.DELIVERY, 2, ball(0, { s: `o${i}`, rb: 0, wkt: 'BOWLED', out: `o${i}` }));
  const st = buildMatchState(log.events);
  assert.equal(st.status, 'COMPLETED');
  assert.equal(st.result.winnerTeamId, 'A');
  assert.equal(st.result.margin, '5 runs'); // 30 - 25
});

test('sequence is derived from the durable log, never a counter', () => {
  const events = [
    { id: 'e1', type: EVENT_TYPES.DELIVERY, matchId: 'M', inningsNumber: 1, seq: 1 },
    { id: 'e2', type: EVENT_TYPES.DELIVERY, matchId: 'M', inningsNumber: 1, seq: 2 },
    { id: 'e3', type: EVENT_TYPES.DELIVERY, matchId: 'M', inningsNumber: 2, seq: 1 },
  ];
  assert.equal(nextSequence(events, 1), 3);
  assert.equal(nextSequence(events, 2), 2);
  assert.equal(nextSequence(events, 3), 1);
  // Factory enforces a known type + matchId.
  const e = makeEvent({ type: 'DELIVERY', matchId: 'M', inningsNumber: 1, seq: 1, payload: {} });
  assert.ok(e.id.startsWith('evt-'));
  assert.throws(() => makeEvent({ type: 'BOGUS', matchId: 'M' }));
});
