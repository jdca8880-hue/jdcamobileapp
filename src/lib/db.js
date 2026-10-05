import Dexie from 'dexie';

// Initialize the local offline-first database
export const db = new Dexie('JDCAScoringAppDB');

export const getActiveDb = async () => {
  try {
    if (localStorage.getItem('JDCA_PRACTICE_MODE') === 'true') {
      const { practiceDb, initializePracticeDb } = await import('./practiceDb.js');
      await initializePracticeDb();
      return practiceDb;
    }
  } catch (e) {}
  return db;
};

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


/**
 * Helper to queue an action when offline
 */
export async function queueOfflineAction(action, payload) {
  const targetDb = await getActiveDb();
  if (targetDb.name === 'JDCAPracticeDB') {
    // In practice mode, we don't sync to the server, so we immediately process the action into the local database
    if (action === 'RECORD_DELIVERY') {
      await targetDb.deliveries.add({
        id: payload.id,
        match_id: payload.matchId,
        innings_id: payload.inningsId,
        innings_number: payload.innings,
        delivery_sequence: payload.deliverySequence || Date.now(),
        over_number: payload.over,
        ball_number: payload.ball,
        striker_id: payload.strikerId,
        non_striker_id: payload.nonStrikerId,
        bowler_id: payload.bowlerId,
        runs_total: payload.runsTotal || payload.totalRuns || 0,
        runs_off_bat: payload.runsBatter || payload.runsOffBat || 0,
        runs_extras: payload.runsExtras || payload.extraRuns || 0,
        extra_type: payload.extraType || 'NONE',
        wicket_type: payload.wicket ? payload.dismissalType : 'NONE',
        dismissed_player_id: payload.dismissedPlayerId || null,
        dismissed_by_id: payload.fielderId || null,
        idempotency_key: payload.id
      });
    } else if (action === 'PENALTY_EVENT') {
      // Ignored for now
    } else if (action === 'NEW_MATCH') {
       // handled by api
    }
    return;
  }
  await targetDb.sync_queue.add({
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
  const targetDb = await getActiveDb();
  if (targetDb.name === 'JDCAPracticeDB') return [];
  return await targetDb.sync_queue.orderBy('timestamp').toArray();
}

/**
 * Clear an action from the queue after successful sync
 */
export async function clearAction(id) {
  const targetDb = await getActiveDb();
  if (targetDb.name === 'JDCAPracticeDB') return;
  await targetDb.sync_queue.delete(id);
}

/**
 * Update an existing action in the queue (e.g. status changes)
 */
export async function updateAction(id, changes) {
  const targetDb = await getActiveDb();
  if (targetDb.name === 'JDCAPracticeDB') return;
  await targetDb.sync_queue.update(id, changes);
}
