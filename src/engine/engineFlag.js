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

// Tri-state global flag: unset (default) = ON, '1' = ON, '0' = explicit OFF.
// The v2 engine is the default for every match; '0' is only an escape hatch
// (set via ?engine=off) for diagnosing a device.
function readGlobal() {
  try { return localStorage.getItem(GLOBAL_KEY) !== '0'; } catch { return true; }
}
function write(key, on) {
  try { on ? localStorage.setItem(key, '1') : localStorage.removeItem(key); } catch { /* ignore */ }
}

/** Global toggle — v2 is ON unless this device explicitly opted out. */
export function isEngineV2Enabled() { return readGlobal(); }
export function setEngineV2(on) {
  try { localStorage.setItem(GLOBAL_KEY, on ? '1' : '0'); } catch { /* ignore */ }
}

/** Is THIS match scored on the new engine? Default yes (v2 is the engine). */
export function isEventMatch(matchId) {
  if (isEngineV2Enabled()) return true;
  // Opted out globally: a match can still be pinned to v2 explicitly.
  try { return matchId ? localStorage.getItem(MATCH_KEY(matchId)) === '1' : false; } catch { return false; }
}
export function markEventMatch(matchId, on = true) { if (matchId) write(MATCH_KEY(matchId), on); }
