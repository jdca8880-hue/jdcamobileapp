// INTEGRATION test for the v2 READ PATH that the scoring hook now uses on
// hydrate/undo: getMatchEvents (durable Dexie log) -> buildLiveState (fold).
//
// This is the regression guard for the two bugs the user hit:
//   1. "phone shows 8 wickets, laptop 7" after a restart — caused by re-deriving
//      totals by COUNTING a per-device mix of rows. The fix: both devices fold
//      the SAME durable log, so the number is deterministic and restart-stable.
//   2. "undo only works for 3-4 balls after restart" — caused by undo reading a
//      volatile in-memory stack. The fix: undo = void the last event in the log
//      + re-fold, which works for ANY ball regardless of memory.
//
// Run against an in-memory IndexedDB so it exercises the real storage layer.
import 'fake-indexeddb/auto';
import test from 'node:test';
import assert from 'node:assert/strict';

import { appendEvent, voidEventById, getMatchEvents } from '../../lib/matchLog.js';
import { buildLiveState } from '../liveState.js';
import { EVENT_TYPES } from '../matchEvents.js';

const FMT = 'T20';

// A wicket delivery that dismisses `strikerId` (bowled), on a fresh striker so
// each wicket is a distinct event.
const wicketBall = (strikerId) => ({
  strikerId, nonStrikerId: 'bn', bowlerId: 'bw',
  runsBatter: 0, runsExtras: 0, runsTotal: 0,
  extraType: 'NONE', wicketType: 'BOWLED', isLegalDelivery: true,
  dismissedPlayerId: strikerId,
});
const runBall = (strikerId, r) => ({
  strikerId, nonStrikerId: 'bn', bowlerId: 'bw',
  runsBatter: r, runsExtras: 0, runsTotal: r,
  extraType: 'NONE', wicketType: 'NONE', isLegalDelivery: true,
});

async function start(M) {
  await appendEvent({ matchId: M, type: EVENT_TYPES.MATCH_STARTED, payload: { format: FMT, battedFirstTeamId: 'A', otherTeamId: 'B' } });
  await appendEvent({ matchId: M, type: EVENT_TYPES.INNINGS_STARTED, inningsNumber: 1, payload: { battingTeamId: 'A', bowlingTeamId: 'B' } });
}

// Simulate what hydrateFromEventLog does: read the durable log and fold it.
async function foldDevice(M) {
  const events = await getMatchEvents(M);
  return buildLiveState(events, { format: FMT });
}

test('fold is deterministic across devices (same log -> identical score)', async () => {
  const M = 'm-fold-det';
  await start(M);
  await appendEvent({ matchId: M, type: EVENT_TYPES.DELIVERY, inningsNumber: 1, payload: runBall('b1', 4) });
  await appendEvent({ matchId: M, type: EVENT_TYPES.DELIVERY, inningsNumber: 1, payload: wicketBall('b1') });
  await appendEvent({ matchId: M, type: EVENT_TYPES.DELIVERY, inningsNumber: 1, payload: runBall('b2', 2) });

  // Two independent folds (e.g. phone and laptop) of the same log must agree.
  const phone = await foldDevice(M);
  const laptop = await foldDevice(M);
  assert.deepEqual(
    { runs: phone.runs, wickets: phone.wickets, balls: phone.balls },
    { runs: laptop.runs, wickets: laptop.wickets, balls: laptop.balls },
  );
  assert.equal(phone.runs, 6);
  assert.equal(phone.wickets, 1);
  assert.equal(phone.balls, 3);
});

test('wicket count never drifts after a "restart" (fresh fold)', async () => {
  const M = 'm-fold-wkts';
  await start(M);
  // 7 wickets, each its own legal ball.
  for (let w = 1; w <= 7; w++) {
    await appendEvent({ matchId: M, type: EVENT_TYPES.DELIVERY, inningsNumber: 1, payload: wicketBall(`b${w}`) });
  }
  const before = await foldDevice(M);
  assert.equal(before.wickets, 7);
  assert.equal(before.balls, 7);

  // "Restart": throw away all memory, re-read the durable log and fold again.
  // This is the exact path that used to show 8 — it must still be 7.
  const afterRestart = await foldDevice(M);
  assert.equal(afterRestart.wickets, 7, 'fold after restart must equal the real wicket count, never +1');
  assert.equal(afterRestart.balls, 7);
});

test('appending the same event id twice does not double-count a wicket', async () => {
  const M = 'm-fold-dup';
  await start(M);
  const d = await appendEvent({ matchId: M, type: EVENT_TYPES.DELIVERY, inningsNumber: 1, payload: wicketBall('b1') });
  // A retry / re-sync replays the same id — idempotent, so wickets stay 1.
  await appendEvent({ matchId: M, type: EVENT_TYPES.DELIVERY, inningsNumber: 1, payload: wicketBall('b1'), id: d.id });
  const st = await foldDevice(M);
  assert.equal(st.wickets, 1);
  assert.equal(st.balls, 1);
});

test('undo = void last event + re-fold, works for ANY ball (restart-proof)', async () => {
  const M = 'm-fold-undo';
  await start(M);
  const ids = [];
  for (let w = 1; w <= 7; w++) {
    const d = await appendEvent({ matchId: M, type: EVENT_TYPES.DELIVERY, inningsNumber: 1, payload: wicketBall(`b${w}`) });
    ids.push(d.id);
  }
  assert.equal((await foldDevice(M)).wickets, 7);

  // Undo the last ball the way the hook now does it: find the last real event in
  // the (re-read) log and void it — NOT a RAM stack. Then re-fold.
  const events = await getMatchEvents(M);
  const lastReal = [...events].reverse().find((e) => e.type === 'DELIVERY' && !e.voided);
  await voidEventById(M, lastReal.id);

  const afterUndo = await foldDevice(M);
  assert.equal(afterUndo.wickets, 6, 'undo must drop exactly one wicket');
  assert.equal(afterUndo.balls, 6);

  // And it keeps working repeatedly — undo the next one too.
  const events2 = await getMatchEvents(M);
  const lastReal2 = [...events2].reverse().find((e) => e.type === 'DELIVERY' && !e.voided);
  await voidEventById(M, lastReal2.id);
  assert.equal((await foldDevice(M)).wickets, 5);
});
