/**
 * matchLog.js — the local durable event log + outbox (Plan B, Stage 2).
 *
 * This is the on-device source of truth. Every scoring action becomes an event
 * that is written to `match_events` AND enqueued in `event_outbox` inside ONE
 * Dexie transaction — so a ball can never exist in the log but not the outbox
 * (or vice-versa), and a dropped call / killed app / dead battery can never
 * leave a half-written ball. The per-innings `seq` is derived from the stored
 * log inside that same transaction, so it can never restart at 1 after a reload
 * (the SEQUENCE_CONFLICT bug). Reading state = fold the log through the pure
 * projection (buildMatchState).
 *
 * The sync layer (Stage 3) drains the outbox with idempotent upserts and a
 * cursor pull; it is intentionally not referenced here so this module stays a
 * clean storage boundary.
 */

import { db } from './db.js';
import { makeEvent, EVENT_TYPES, nextSequence as nextSeqFromList } from '../engine/matchEvents.js';
import { buildMatchState } from '../engine/matchProjection.js';

// Event types that live inside an innings and therefore carry a per-innings
// monotonic sequence (used for identity, dedupe and gap detection). Match-level
// events (MATCH_STARTED / MATCH_ENDED) have no innings sequence.
const SEQUENCED_TYPES = new Set([
  EVENT_TYPES.DELIVERY,
  EVENT_TYPES.PENALTY,
  EVENT_TYPES.RETIREMENT,
]);

function nowIso() { return new Date().toISOString(); }

/**
 * Append one event to the durable log and enqueue it for sync, atomically.
 * Returns the stored event. `seq` is derived from the log for sequenced types.
 */
export async function appendEvent({ matchId, type, inningsNumber = null, payload = {}, createdBy = null, id = null }) {
  if (!matchId) throw new Error('appendEvent requires matchId');
  if (!type || !EVENT_TYPES[type]) throw new Error(`appendEvent: unknown type ${type}`);

  return db.transaction('rw', db.match_events, db.event_outbox, async () => {
    let seq = null;
    if (SEQUENCED_TYPES.has(type)) {
      if (inningsNumber == null) throw new Error(`appendEvent: ${type} requires inningsNumber`);
      // Derive the next sequence from the DURABLE log (never a RAM counter).
      const existing = await db.match_events
        .where('[matchId+inningsNumber]').equals([matchId, inningsNumber]).toArray();
      seq = nextSeqFromList(existing, inningsNumber);
    }

    const event = makeEvent({ id, type, matchId, inningsNumber, seq, payload, createdBy, createdAt: nowIso() });

    // Idempotent append: if this exact event id is already stored, return it.
    const already = await db.match_events.where('id').equals(event.id).first();
    if (already) return already;

    await db.match_events.add(event); // logSeq auto-assigned (global append order)
    await db.event_outbox.add({
      event_id: event.id,
      match_id: matchId,
      op: 'UPSERT',
      status: 'PENDING',
      attempts: 0,
      error: null,
      createdAt: nowIso(),
    });
    return event;
  });
}

/**
 * Deterministic undo: void the target event. If it is still PENDING in the
 * outbox (never reached the server), we just drop that outbox row and mark the
 * local event voided — no server round-trip needed. If it already synced, we
 * enqueue a VOID op so the server voids it too. Never deletes history.
 */
export async function voidEventById(matchId, eventId) {
  if (!matchId || !eventId) return;
  return db.transaction('rw', db.match_events, db.event_outbox, async () => {
    const ev = await db.match_events.where('id').equals(eventId).first();
    if (!ev) return;
    await db.match_events.update(ev.logSeq, { voided: true });

    const pending = await db.event_outbox.where('event_id').equals(eventId).first();
    if (pending && pending.status === 'PENDING' && pending.op === 'UPSERT') {
      // Never left the device — cancel the upload instead of syncing then voiding.
      await db.event_outbox.delete(pending.id);
      return;
    }
    // Already (being) synced — tell the server to void it.
    await db.event_outbox.add({
      event_id: eventId,
      match_id: matchId,
      op: 'VOID',
      status: 'PENDING',
      attempts: 0,
      error: null,
      createdAt: nowIso(),
    });
  });
}

/** All events for a match in global append order (oldest first). */
export async function getMatchEvents(matchId) {
  if (!matchId) return [];
  const rows = await db.match_events.where('matchId').equals(matchId).toArray();
  return rows.sort((a, b) => (a.logSeq || 0) - (b.logSeq || 0));
}

/** Authoritative match state for a match, folded from its durable log. */
export async function getMatchState(matchId, opts = {}) {
  const events = await getMatchEvents(matchId);
  return buildMatchState(events, { matchId, ...opts });
}

/** Outbox rows still awaiting the server, in drain order. */
export async function getPendingOutbox(matchId = null) {
  let rows = matchId
    ? await db.event_outbox.where('[match_id+status]').equals([matchId, 'PENDING']).toArray()
    : await db.event_outbox.where('status').equals('PENDING').toArray();
  return rows.sort((a, b) => (a.id || 0) - (b.id || 0));
}

/** Mark an outbox row acknowledged by the server and remove it. */
export async function ackOutbox(outboxId) {
  await db.event_outbox.delete(outboxId);
}

/** Record a failed sync attempt (kept for retry; status/err surfaced to UI). */
export async function failOutbox(outboxId, errorInfo, permanent = false) {
  const row = await db.event_outbox.get(outboxId);
  if (!row) return;
  await db.event_outbox.update(outboxId, {
    attempts: (row.attempts || 0) + 1,
    status: permanent ? 'FAILED_PERMANENT' : 'PENDING',
    error: errorInfo || null,
  });
}

/** The single event the outbox references (for building the server payload). */
export async function getEventById(eventId) {
  return db.match_events.where('id').equals(eventId).first();
}
