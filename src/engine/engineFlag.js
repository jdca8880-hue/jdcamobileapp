/**
 * engineFlag.js — gates the new event-sourced engine so the cutover is safe.
 *
 * Default is OFF: with no flag set, the app behaves exactly as today. A match is
 * scored on the new engine only when it is explicitly opted in (globally for
 * testing, or per-match once we start creating v2 matches). This is what lets
 * Stage 4 ship to main without changing any live behaviour until we flip it.
 */

const GLOBAL_KEY = 'jdca-engine-v2';
const MATCH_KEY = (matchId) => `jdca-engine-v2-${matchId}`;

function read(key) {
  try { return localStorage.getItem(key) === '1'; } catch { return false; }
}
function write(key, on) {
  try { on ? localStorage.setItem(key, '1') : localStorage.removeItem(key); } catch { /* ignore */ }
}

/** Global toggle — handy for testing the whole app on the new engine. */
export function isEngineV2Enabled() { return read(GLOBAL_KEY); }
export function setEngineV2(on) { write(GLOBAL_KEY, on); }

/** Is THIS match scored on the new engine? (per-match opt-in, or global on). */
export function isEventMatch(matchId) {
  if (isEngineV2Enabled()) return true;
  return matchId ? read(MATCH_KEY(matchId)) : false;
}
export function markEventMatch(matchId, on = true) { if (matchId) write(MATCH_KEY(matchId), on); }
