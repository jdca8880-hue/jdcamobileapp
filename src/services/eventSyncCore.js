/**
 * eventSyncCore.js — the PURE, testable core of the event sync protocol.
 *
 * Kept separate from eventSync.js (which does the actual Supabase/Dexie I/O) so
 * the decision logic can be unit-tested in node with no network or browser.
 *
 * The headline fix vs. the old SyncService: errors are classified by an EXPLICIT
 * taxonomy keyed on Postgres/PostgREST codes — never by `message.includes(...)`.
 * Unknown errors default to a bounded retry, never "retry forever", and a poison
 * event is quarantined on its own; it never hard-blocks a whole match.
 */

export const SYNC_RESULT = {
  OK: 'OK',                 // applied (or already present) — ack + remove from outbox
  TRANSIENT: 'TRANSIENT',   // retry later (offline / 5xx / unknown within cap)
  AUTH: 'AUTH',             // session expired — pause, prompt re-login
  SEQ_CONFLICT: 'SEQ_CONFLICT', // this innings' seq is taken by a different event -> re-seq
  PERMANENT: 'PERMANENT',   // will never succeed as-is — quarantine this one event
  DROP: 'DROP',             // the target no longer exists (match deleted) — discard
};

/** Does this event id already occupy the row? (idempotent success) */
function isOwnDuplicate(error, eventId) {
  const t = `${error?.message || ''} ${error?.details || ''}`;
  return error?.code === '23505' && (t.includes(eventId) || t.includes('match_event_log_pkey') || t.includes('(id)'));
}

/**
 * Classify a Supabase insert/update error into a SYNC_RESULT.
 * `isOnline` lets a caller force TRANSIENT when the device is offline.
 */
export function classifyError(error, { eventId = '', isOnline = true } = {}) {
  if (!error) return SYNC_RESULT.OK;
  const code = error.code;
  const msg = `${error.message || ''} ${error.details || ''} ${error.hint || ''}`;

  // Network / offline / transient transport.
  if (!isOnline || code === 'NETWORK_ERROR' || /Failed to fetch|NetworkError|fetch failed|timeout/i.test(msg)) {
    return SYNC_RESULT.TRANSIENT;
  }
  // Auth / session.
  if (code === '401' || /JWT expired|Invalid Refresh Token|Auth session missing|not authenticated/i.test(msg)) {
    return SYNC_RESULT.AUTH;
  }
  // Duplicate primary key = THIS exact event already stored → success (exactly-once).
  if (isOwnDuplicate(error, eventId)) return SYNC_RESULT.OK;
  // Duplicate on the per-innings sequence index = a DIFFERENT event took the seq.
  if (code === '23505' && /innings_seq|delivery_sequence|_seq/i.test(msg)) return SYNC_RESULT.SEQ_CONFLICT;
  if (code === '23505') return SYNC_RESULT.SEQ_CONFLICT; // any other unique clash -> try re-seq once
  // Foreign key violation on match_id = the match row is gone (deleted). Discard.
  if (code === '23503' && /match/i.test(msg)) return SYNC_RESULT.DROP;
  if (code === 'MATCH_MISSING') return SYNC_RESULT.DROP;
  // RLS / permission / schema — never succeeds as-is; quarantine this event only.
  if (code === '42501' || code === '42703' || code === 'PGRST204' || code === 'PGRST205'
      || /row-level security|permission denied|column .* does not exist/i.test(msg)) {
    return SYNC_RESULT.PERMANENT;
  }
  // Check / FK / bad input = bad data; quarantine.
  if (code === '23514' || code === '22P02' || /violates check constraint|invalid input syntax/i.test(msg)) {
    return SYNC_RESULT.PERMANENT;
  }
  // 5xx and everything unknown → bounded retry (caller caps attempts).
  return SYNC_RESULT.TRANSIENT;
}

/**
 * Map a local log event to the server `match_event_log` row shape. `uploaderId`
 * (the current auth uid) is stamped as created_by so the RLS insert policy
 * (`created_by = auth.uid()`) is satisfied regardless of who/when it was first
 * recorded offline.
 */
export function toServerRow(event, uploaderId = null) {
  return {
    id: event.id,
    match_id: event.matchId || event.match_id,
    innings_number: event.inningsNumber ?? event.innings_number ?? null,
    seq: event.seq ?? null,
    type: event.type,
    payload: event.payload || {},
    voided: !!event.voided,
    created_by: uploaderId || event.createdBy || event.created_by || null,
  };
}

/** Max attempts before a TRANSIENT error is escalated to PERMANENT (quarantine). */
export const MAX_ATTEMPTS = 6;

/** Decide the next state for a TRANSIENT failure given how many tries it's had. */
export function escalateIfExhausted(result, attempts) {
  if (result === SYNC_RESULT.TRANSIENT && attempts + 1 >= MAX_ATTEMPTS) {
    return SYNC_RESULT.PERMANENT;
  }
  return result;
}
