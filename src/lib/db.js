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

/**
 * Helper to queue an action when offline
 */
export async function queueOfflineAction(action, payload) {
  await db.sync_queue.add({
    action,
    payload,
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
