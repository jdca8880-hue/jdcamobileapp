// Stage 2/4 INTEGRATION test: the real Dexie log + outbox + projection pipeline,
// run against an in-memory IndexedDB (fake-indexeddb). Proves appendEvent is
// transactional, derives seq from the DURABLE log (never a RAM counter), folds
// to correct state, and that void cancels an un-sent upload.
import 'fake-indexeddb/auto';
import test from 'node:test';
import assert from 'node:assert/strict';

import { appendEvent, voidEventById, getMatchState, getPendingOutbox } from '../../lib/matchLog.js';
import { EVENT_TYPES } from '../matchEvents.js';

const run = (rb) => ({ strikerId: 'b1', nonStrikerId: 'b2', bowlerId: 'bw', runsBatter: rb, runsExtras: 0, runsTotal: rb, extraType: 'NONE', wicketType: 'NONE', isLegalDelivery: true });

async function startMatch(M, format = 'T20') {
  await appendEvent({ matchId: M, type: EVENT_TYPES.MATCH_STARTED, payload: { format, battedFirstTeamId: 'A', otherTeamId: 'B' } });
  await appendEvent({ matchId: M, type: EVENT_TYPES.INNINGS_STARTED, inningsNumber: 1, payload: {} });
}

test('int: append derives seq from the log, folds to correct state, queues outbox', async () => {
  const M = 'm-int-1';
  await startMatch(M);
  const d1 = await appendEvent({ matchId: M, type: EVENT_TYPES.DELIVERY, inningsNumber: 1, payload: run(4) });
  const d2 = await appendEvent({ matchId: M, type: EVENT_TYPES.DELIVERY, inningsNumber: 1, payload: run(6) });
  assert.equal(d1.seq, 1);
  assert.equal(d2.seq, 2);

  const st = await getMatchState(M, { format: 'T20' });
  assert.equal(st.innings[0].runs, 10);
  assert.equal(st.innings[0].legalBalls, 2);

  const ob = await getPendingOutbox(M);
  assert.equal(ob.length, 4); // match-started + innings-started + 2 deliveries
  assert.ok(ob.every((r) => r.status === 'PENDING' && r.op === 'UPSERT'));
});

test('int: sequence NEVER resets — it continues from the durable log', async () => {
  const M = 'm-int-2';
  await startMatch(M);
  for (let i = 0; i < 5; i++) await appendEvent({ matchId: M, type: EVENT_TYPES.DELIVERY, inningsNumber: 1, payload: run(1) });
  // No in-memory counter is consulted; appendEvent re-reads the stored log every
  // time — this is exactly what a page reload / app restart would do.
  const d6 = await appendEvent({ matchId: M, type: EVENT_TYPES.DELIVERY, inningsNumber: 1, payload: run(1) });
  assert.equal(d6.seq, 6);
  const st = await getMatchState(M, { format: 'T20' });
  assert.equal(st.innings[0].runs, 6);
});

test('int: duplicate event id is ignored (exactly-once append)', async () => {
  const M = 'm-int-dup';
  await startMatch(M);
  const d = await appendEvent({ matchId: M, type: EVENT_TYPES.DELIVERY, inningsNumber: 1, payload: run(4) });
  const again = await appendEvent({ matchId: M, type: EVENT_TYPES.DELIVERY, inningsNumber: 1, payload: run(4), id: d.id });
  assert.equal(again.id, d.id);
  const st = await getMatchState(M, { format: 'T20' });
  assert.equal(st.innings[0].runs, 4); // not 8
});

test('int: void removes a delivery and cancels its un-sent upload', async () => {
  const M = 'm-int-3';
  await startMatch(M);
  const d = await appendEvent({ matchId: M, type: EVENT_TYPES.DELIVERY, inningsNumber: 1, payload: run(4) });
  assert.equal((await getMatchState(M, { format: 'T20' })).innings[0].runs, 4);

  await voidEventById(M, d.id);
  assert.equal((await getMatchState(M, { format: 'T20' })).innings[0].runs, 0);

  // The upload was still PENDING (never sent) so it is cancelled, not synced-then-voided.
  const ob = await getPendingOutbox(M);
  assert.ok(!ob.find((r) => r.event_id === d.id));
});
