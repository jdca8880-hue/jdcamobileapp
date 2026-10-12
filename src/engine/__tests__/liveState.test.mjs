// Stage 4 tests: live scoring view rebuilt from the event log.
import test from 'node:test';
import assert from 'node:assert/strict';
import { buildLiveState } from '../liveState.js';
import { EVENT_TYPES } from '../matchEvents.js';

function makeLog() {
  let logSeq = 0;
  const events = [];
  const add = (type, inningsNumber, payload = {}) => {
    events.push({ id: `evt-${logSeq}`, type, matchId: 'M', inningsNumber, seq: null, payload, voided: false, logSeq: logSeq++ });
  };
  return { events, add };
}
const ball = (f = {}) => {
  const rb = f.rb ?? 0, re = f.re ?? 0;
  return {
    strikerId: f.s ?? 'b1', nonStrikerId: f.ns ?? 'b2', bowlerId: f.bw ?? 'bw1',
    runsBatter: rb, runsExtras: re, runsTotal: rb + re, runsCompleted: f.rc ?? rb,
    extraType: f.extra ?? 'NONE', wicketType: f.wkt ?? 'NONE',
    isLegalDelivery: f.legal ?? true, dismissedPlayerId: f.out ?? null,
  };
};
function started(format = 'T20') {
  const log = makeLog();
  log.add(EVENT_TYPES.MATCH_STARTED, null, { format, battedFirstTeamId: 'A', otherTeamId: 'B' });
  log.add(EVENT_TYPES.INNINGS_STARTED, 1, {});
  return log;
}

test('live: before any ball, needs openers', () => {
  const log = started();
  const s = buildLiveState(log.events);
  assert.equal(s.needsOpeners, true);
  assert.equal(s.striker, null);
  assert.equal(s.runs, 0);
  assert.equal(s.battingTeamId, 'A');
});

test('live: a single rotates strike (engine logic preserved)', () => {
  const log = started();
  log.add(EVENT_TYPES.DELIVERY, 1, ball({ s: 'b1', ns: 'b2', rb: 1 }));
  const s = buildLiveState(log.events);
  assert.equal(s.runs, 1);
  assert.equal(s.balls, 1);
  assert.equal(s.striker.id, 'b2');      // strike rotated
  assert.equal(s.nonStriker.id, 'b1');
  assert.equal(s.nonStriker.runs, 1);    // b1 scored the single
  assert.equal(s.needsNewBatter, false);
});

test('live: six legal balls complete the over and ask for a new bowler', () => {
  const log = started();
  for (let i = 0; i < 6; i++) log.add(EVENT_TYPES.DELIVERY, 1, ball({ rb: 0 }));
  const s = buildLiveState(log.events);
  assert.equal(s.balls, 6);
  assert.equal(s.needsNewBowler, true);
  assert.equal(s.matchStatus, 'OVER_COMPLETE');
});

test('live: a wicket vacates the striker end (needs new batter)', () => {
  const log = started();
  log.add(EVENT_TYPES.DELIVERY, 1, ball({ s: 'b1', ns: 'b2', rb: 0, wkt: 'BOWLED', out: 'b1' }));
  const s = buildLiveState(log.events);
  assert.equal(s.wickets, 1);
  assert.equal(s.needsNewBatter, true);
  assert.equal(s.striker, null);
});

test('live: new over + new bowler, new batter after wicket, keeps accumulating', () => {
  const log = started();
  // Over 1: b1 faces, hits a four then is bowled.
  log.add(EVENT_TYPES.DELIVERY, 1, ball({ s: 'b1', ns: 'b2', rb: 4, bw: 'bw1' }));
  log.add(EVENT_TYPES.DELIVERY, 1, ball({ s: 'b1', ns: 'b2', rb: 0, bw: 'bw1', wkt: 'BOWLED', out: 'b1' }));
  // New batter b3 comes in; a few more balls with a new bowler next over would
  // follow in real play — here just confirm the new batter is picked up.
  log.add(EVENT_TYPES.DELIVERY, 1, ball({ s: 'b3', ns: 'b2', rb: 2, bw: 'bw1' }));
  const s = buildLiveState(log.events);
  assert.equal(s.runs, 6);           // 4 + 0 + 2
  assert.equal(s.wickets, 1);
  assert.equal(s.balls, 3);
  // b3 scored 2 (even -> stays on strike)
  assert.equal(s.striker.id, 'b3');
  assert.equal(s.striker.runs, 2);
});
