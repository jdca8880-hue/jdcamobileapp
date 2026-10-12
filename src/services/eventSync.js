/**
 * eventSync.js — the transport (Plan B, Stage 3). Ships the local event log to
 * Supabase and back. Thin and "dumb": it moves events idempotently and in order
 * and lets the pure projection decide meaning. It does NOT make cricket
 * decisions (no batting-side guessing, no innings creation).
 *
 * Three jobs:
 *   1. PUSH   — drain `event_outbox` to `match_event_log` with idempotent upsert.
 *               Per-match ordering; a SEQ_CONFLICT is auto-recovered by
 *               re-deriving the next free seq (never a permanent block); a
 *               genuinely poison event is quarantined ALONE (other matches keep
 *               flowing); a deleted-match event is dropped.
 *   2. PULL   — cursor catch-up: fetch everything after the last server_seq we
 *               saw for a match and merge into the local log (dedupe by id).
 *   3. LIVE   — one Supabase Realtime channel per open match; on each change,
 *               merge into the local log and notify. Realtime is the fast pipe;
 *               the cursor pull is the correctness backstop if a message drops.
 *
 * Not wired into the app yet (Stage 4). Requires 34_match_event_log.sql applied.
 */

import { supabase } from '../lib/supabase';
import { db } from '../lib/db';
import { getPendingOutbox, ackOutbox, failOutbox, getEventById } from '../lib/matchLog';
import { classifyError, toServerRow, escalateIfExhausted, SYNC_RESULT } from './eventSyncCore';

const TABLE = 'match_event_log';
const CURSOR_KEY = (matchId) => `jdca-evtcursor-${matchId}`;

function isOnline() {
  return typeof navigator === 'undefined' ? true : navigator.onLine;
}
function getCursor(matchId) {
  try { return Number(localStorage.getItem(CURSOR_KEY(matchId))) || 0; } catch { return 0; }
}
function setCursor(matchId, v) {
  try { localStorage.setItem(CURSOR_KEY(matchId), String(v)); } catch { /* ignore */ }
}
async function uploaderId() {
  try { const { data } = await supabase.auth.getSession(); return data?.session?.user?.id || null; } catch { return null; }
}

// Map a server row back to the local log event shape.
function fromServerRow(r) {
  return {
    id: r.id,
    type: r.type,
    matchId: r.match_id,
    inningsNumber: r.innings_number ?? null,
    seq: r.seq ?? null,
    payload: r.payload || {},
    voided: !!r.voided,
    createdBy: r.created_by || null,
    createdAt: r.created_at || null,
    serverSeq: r.server_seq ?? null,
  };
}

// Merge one server event into the local durable log (idempotent by id).
async function mergeIntoLog(ev) {
  const existing = await db.match_events.where('id').equals(ev.id).first();
  if (!existing) {
    await db.match_events.add({ ...ev, logSeq: undefined }); // logSeq auto-assigned locally
    return true;
  }
  if (ev.voided && !existing.voided) {
    await db.match_events.update(existing.logSeq, { voided: true });
    return true;
  }
  return false;
}

// ---- simple change notifier so the UI can re-fold on sync activity ----
const listeners = new Set();
export function onSyncChange(cb) { listeners.add(cb); return () => listeners.delete(cb); }
function emit(detail) { for (const cb of listeners) { try { cb(detail); } catch { /* */ } } }

/** Re-derive the next free seq for an innings from the SERVER, then persist it. */
async function reSequence(ev) {
  const { data } = await supabase
    .from(TABLE).select('seq')
    .eq('match_id', ev.matchId || ev.match_id)
    .eq('innings_number', ev.inningsNumber ?? ev.innings_number)
    .not('seq', 'is', null)
    .order('seq', { ascending: false })
    .limit(1);
  const newSeq = ((data && data[0]?.seq) || 0) + 1;
  // Persist on the local log row so projection + future pushes agree.
  const row = await db.match_events.where('id').equals(ev.id).first();
  if (row) await db.match_events.update(row.logSeq, { seq: newSeq });
  ev.seq = newSeq;
  return newSeq;
}

/** Push one outbox row. Returns a SYNC_RESULT. */
async function pushOne(obRow, uid) {
  // VOID op: flip the server row's voided flag.
  if (obRow.op === 'VOID') {
    const { error } = await supabase.from(TABLE).update({ voided: true }).eq('id', obRow.event_id);
    if (!error) return SYNC_RESULT.OK;
    return classifyError(error, { eventId: obRow.event_id, isOnline: isOnline() });
  }

  const ev = await getEventById(obRow.event_id);
  if (!ev) return SYNC_RESULT.OK; // event vanished locally (e.g. voided+cancelled) — nothing to send

  const attempt = async () => supabase.from(TABLE).insert(toServerRow(ev, uid));

  let { error } = await attempt();
  if (!error) return SYNC_RESULT.OK;

  let result = classifyError(error, { eventId: ev.id, isOnline: isOnline() });

  // Auto-recover a sequence clash once: take the next free seq and retry.
  if (result === SYNC_RESULT.SEQ_CONFLICT) {
    await reSequence(ev);
    ({ error } = await attempt());
    if (!error) return SYNC_RESULT.OK;
    result = classifyError(error, { eventId: ev.id, isOnline: isOnline() });
  }
  return result;
}

/**
 * Drain the whole outbox. Per-match in-order; a stuck match pauses only itself.
 * Returns a summary useful for the UI/tests.
 */
export async function pushOutbox() {
  if (!supabase || !isOnline()) return { pushed: 0, paused: false };
  const uid = await uploaderId();
  const pending = await getPendingOutbox();
  if (pending.length === 0) return { pushed: 0, paused: false };

  // Group by match, preserving outbox (append) order within each match.
  const byMatch = new Map();
  for (const row of pending) {
    if (!byMatch.has(row.match_id)) byMatch.set(row.match_id, []);
    byMatch.get(row.match_id).push(row);
  }

  let pushed = 0;
  let authPaused = false;

  for (const [matchId, rows] of byMatch) {
    for (const row of rows) {
      let result;
      try {
        result = await pushOne(row, uid);
      } catch (e) {
        result = classifyError(e, { eventId: row.event_id, isOnline: isOnline() });
      }
      result = escalateIfExhausted(result, row.attempts || 0);

      if (result === SYNC_RESULT.OK || result === SYNC_RESULT.DROP) {
        await ackOutbox(row.id);
        pushed += 1;
        continue;
      }
      if (result === SYNC_RESULT.AUTH) {
        authPaused = true;
        emit({ type: 'auth-expired', matchId });
        break; // stop the whole drain until re-login
      }
      if (result === SYNC_RESULT.PERMANENT) {
        await failOutbox(row.id, { event_id: row.event_id }, true);
        emit({ type: 'event-quarantined', matchId, eventId: row.event_id });
        break; // stop THIS match (avoid a server gap); other matches continue
      }
      // TRANSIENT: keep for retry, stop this match's drain this pass.
      await failOutbox(row.id, null, false);
      break;
    }
    if (authPaused) break;
  }

  if (pushed > 0) emit({ type: 'pushed', count: pushed });
  return { pushed, paused: authPaused };
}

/**
 * Cursor pull for a match: fetch everything after the last server_seq we saw
 * and merge into the local log. Idempotent; safe to call any time.
 */
export async function pullMatch(matchId) {
  if (!supabase || !matchId || !isOnline()) return { merged: 0 };
  const cursor = getCursor(matchId);
  const { data, error } = await supabase
    .from(TABLE).select('*')
    .eq('match_id', matchId)
    .gt('server_seq', cursor)
    .order('server_seq', { ascending: true });
  if (error) { console.warn('[eventSync] pullMatch failed:', error.message); return { merged: 0, error }; }

  let merged = 0;
  let maxSeen = cursor;
  for (const r of (data || [])) {
    if (await mergeIntoLog(fromServerRow(r))) merged += 1;
    if (Number.isFinite(r.server_seq) && r.server_seq > maxSeen) maxSeen = r.server_seq;
  }
  if (maxSeen > cursor) setCursor(matchId, maxSeen);
  if (merged > 0) emit({ type: 'pulled', matchId, count: merged });
  return { merged };
}

/**
 * Subscribe to live changes for one match. Does an initial cursor pull (so we
 * never miss events that happened while away), then listens on a single
 * Realtime channel. Returns an unsubscribe function.
 */
export function subscribeMatch(matchId, onChange) {
  if (!supabase || !matchId) return () => {};
  const notify = () => { try { onChange && onChange(matchId); } catch { /* */ } };

  // Catch up first, then go live.
  pullMatch(matchId).then(() => notify());

  const channel = supabase
    .channel(`melog:${matchId}`)
    .on('postgres_changes',
      { event: '*', schema: 'public', table: TABLE, filter: `match_id=eq.${matchId}` },
      async (payload) => {
        const row = payload.new || payload.old;
        if (!row) return;
        const changed = await mergeIntoLog(fromServerRow(row));
        // Advance the cursor so a later reconnect pull doesn't re-fetch this.
        if (Number.isFinite(row.server_seq) && row.server_seq > getCursor(matchId)) {
          setCursor(matchId, row.server_seq);
        }
        if (changed) { emit({ type: 'live', matchId }); notify(); }
      })
    .subscribe();

  return () => { try { supabase.removeChannel(channel); } catch { /* */ } };
}

// ---- lifecycle: keep the outbox draining without blocking the UI ----
let _flushTimer = null;
export function startAutoPush(intervalMs = 15000) {
  stopAutoPush();
  const tick = () => { if (isOnline()) pushOutbox().catch(() => {}); };
  if (typeof window !== 'undefined') {
    window.addEventListener('online', tick);
    document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'visible') tick(); });
  }
  _flushTimer = setInterval(tick, intervalMs);
  tick();
}
export function stopAutoPush() {
  if (_flushTimer) { clearInterval(_flushTimer); _flushTimer = null; }
}
