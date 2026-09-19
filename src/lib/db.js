import Dexie from 'dexie';

// Initialize the local offline-first database
export const db = new Dexie('JDCAScoringAppDB');

db.version(1).stores({
  matches: 'id, tournament, date, status',
  players: 'id, teamId, name, role',
  sync_queue: '++id, action, timestamp'
});

db.version(2).stores({
  // Matches table: primary key is 'id'
  matches: 'id, tournament, date, status',
  
  // Players table: primary key is 'id'
  players: 'id, teamId, name, role',

  // Teams table: primary key is 'id'
  teams: 'id, name, district_id',

  // Sync Queue: auto-incrementing ID for tracking offline actions
  // action: e.g., 'SCORE_BALL', 'UPDATE_MATCH'
  // payload: the data to send to Supabase
  // timestamp: when the action occurred
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
