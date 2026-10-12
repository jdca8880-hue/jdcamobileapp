import Dexie from 'dexie';

// Initialize the local offline-first database
export const db = new Dexie('JDCAScoringAppDB');

db.version(1).stores({
  matches: 'id, tournament, date, status',
  players: 'id, teamId, name, role',
  sync_queue: '++id, action, timestamp'
});

db.version(2).stores({
  matches: 'id, tournament, date, status',
  players: 'id, teamId, name, role',
  teams: 'id, name, district_id',
  sync_queue: '++id, action, timestamp'
});

db.version(3).stores({
  matches: 'id, tournament, date, status',
  players: 'id, teamId, name, role',
  teams: 'id, name, district_id',
  tournaments: 'id, name, status',
  sync_queue: '++id, action, timestamp'
});

db.version(4).stores({
  matches: 'id, tournament, date, status',
  players: 'id, teamId, name, role',
  teams: 'id, name, district_id',
  tournaments: 'id, name, status',
  deliveries: 'id, match_id, innings_id, over_number, ball_number',
  sync_queue: '++id, action, timestamp'
});

db.version(5).stores({
  matches: 'id, tournament, date, status',
  players: 'id, teamId, name, role',
  teams: 'id, name, district_id',
  tournaments: 'id, name, status',
  deliveries: 'id, match_id, innings_id, over_number, ball_number',
  innings: 'id, match_id, innings_number',
  sync_queue: '++id, action, timestamp'
});

db.version(6).stores({
  matches: 'id, tournament, date, status',
  players: 'id, teamId, name, role',
  teams: 'id, name, district_id',
  tournaments: 'id, name, status',
  deliveries: 'id, match_id, innings_id, over_number, ball_number',
  innings: 'id, match_id, innings_number, [match_id+innings_number]',
  sync_queue: '++id, action, timestamp'
});

db.version(7).stores({
  matches: 'id, tournament, date, status',
  players: 'id, teamId, name, role',
  teams: 'id, name, district_id',
  tournaments: 'id, name, status',
  deliveries: 'id, match_id, innings_id, over_number, ball_number',
  innings: 'id, match_id, innings_number, [match_id+innings_number]',
  match_state: 'id',
  sync_queue: '++id, action, timestamp'
});

// Version 8 — Event-sourced engine (Plan B, Stage 2). PURELY ADDITIVE: all v7
// stores are carried over untouched, so existing offline data and the current
// scoring/sync paths keep working. The two new stores are not used by the app
// until the live UI is wired to them (Stage 4), behind a per-match flag.
//
//   match_events — the durable, append-only match log (THE local source of
//     truth). `++logSeq` is the global append offset used for ordering; `&id`
//     is the stable client event id used for exactly-once dedupe.
//   event_outbox — events awaiting server acknowledgement. One row per event
//     (`&event_id`); drained in `logSeq`/`id` order and deleted on ack.
db.version(8).stores({
  matches: 'id, tournament, date, status',
  players: 'id, teamId, name, role',
  teams: 'id, name, district_id',
  tournaments: 'id, name, status',
  deliveries: 'id, match_id, innings_id, over_number, ball_number',
  innings: 'id, match_id, innings_number, [match_id+innings_number]',
  match_state: 'id',
  sync_queue: '++id, action, timestamp',
  match_events: '++logSeq, &id, match_id, [match_id+inningsNumber]',
  event_outbox: '++id, &event_id, match_id, status, [match_id+status]'
});


/**
 * Helper to queue an action when offline
 */
export async function queueOfflineAction(action, payload) {
  await db.sync_queue.add({
    action,
    payload,
    status: 'PENDING',
    timestamp: Date.now()
  });
  console.log(`[Offline Sync] Action queued: ${action}`);
}

/**
 * Fetch all pending actions
 */
export async function getPendingActions() {
  return await db.sync_queue.orderBy('timestamp').toArray();
}

/**
 * Clear an action from the queue after successful sync
 */
export async function clearAction(id) {
  await db.sync_queue.delete(id);
}

/**
 * Update an existing action in the queue (e.g. status changes)
 */
export async function updateAction(id, changes) {
  await db.sync_queue.update(id, changes);
}
