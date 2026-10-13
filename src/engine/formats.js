/**
 * formats.js — Match formats as DATA, not code branches.
 *
 * Every format-specific rule (how many innings, over limit, how the batting
 * side alternates, how the result is decided, whether a super over / draw /
 * declaration applies) lives in one descriptor here. The projection, the live
 * engine, the UI and the sync layer all read these fields instead of scattering
 * `if (isTest)` checks around the codebase. Adding a new format = adding a row.
 *
 * This module is PURE: no imports, no I/O, no clock. Safe to run in node tests.
 */

// Sentinel for "no per-innings over limit" (multi-day / Test). Kept as null in
// the descriptor; callers that need a number for display can treat null as
// unlimited. (Mirrors api.TEST_UNLIMITED_OVERS but we never score off a magic
// number — Test behaviour is gated on the descriptor, not on 9999.)
export const UNLIMITED_OVERS = null;

/**
 * swap: how the batting side alternates across innings, expressed as the
 *       batting-team INDEX (0 = the side that batted first; 1 = the other side)
 *       for each innings number. Encoded as a function so new patterns are easy.
 *
 *   - 'AB'  limited overs (+ super over tie-breaker on innings 3/4). Innings
 *           1 & 4 → side 0, innings 2 & 3 → side 1. (Preserves the app's
 *           existing super-over behaviour exactly.)
 *   - 'ABAB' Test / multi-day fixed order A,B,A,B. Odd innings → side 0, even → 1.
 */
function battingIndexAB(inningsNumber) {
  return inningsNumber === 2 || inningsNumber === 3 ? 1 : 0;
}
function battingIndexABAB(inningsNumber) {
  return inningsNumber % 2 === 0 ? 1 : 0;
}

export const FORMATS = {
  TEST: {
    id: 'TEST',
    label: 'Test / Multi-day',
    // JDCA multi-day: ONE innings per side (2 total), just with no per-innings
    // over limit (unlimited overs → innings ends only on all-out / declaration).
    // It is NOT 4-innings Test cricket — no follow-on, no aggregate, no innings
    // victory. The only thing that sets it apart from a limited match is the
    // absent over cap; the result is a straight chase of the 1st-innings total.
    inningsCount: 2,
    oversPerInnings: UNLIMITED_OVERS,
    ballsPerOver: 6,
    maxWickets: 10,
    swap: 'AB',
    battingIndex: battingIndexAB,
    result: 'CHASE',
    superOver: false,
    allowDeclare: true,
    allowDraw: true,
    perBowlerOverCap: false,
  },
  ODI: {
    id: 'ODI',
    label: 'One Day (50 overs)',
    inningsCount: 2,
    oversPerInnings: 50,
    ballsPerOver: 6,
    maxWickets: 10,
    swap: 'AB',
    battingIndex: battingIndexAB,
    result: 'CHASE',
    superOver: true,
    allowDeclare: false,
    allowDraw: false,
    perBowlerOverCap: true, // oversPerInnings / 5
  },
  T20: {
    id: 'T20',
    label: 'Twenty20',
    inningsCount: 2,
    oversPerInnings: 20,
    ballsPerOver: 6,
    maxWickets: 10,
    swap: 'AB',
    battingIndex: battingIndexAB,
    result: 'CHASE',
    superOver: true,
    allowDeclare: false,
    allowDraw: false,
    perBowlerOverCap: true,
  },
  T10: {
    id: 'T10',
    label: 'Ten10',
    inningsCount: 2,
    oversPerInnings: 10,
    ballsPerOver: 6,
    maxWickets: 10,
    swap: 'AB',
    battingIndex: battingIndexAB,
    result: 'CHASE',
    superOver: true,
    allowDeclare: false,
    allowDraw: false,
    perBowlerOverCap: true,
  },
};

const DEFAULT_FORMAT = FORMATS.T20;

/**
 * Resolve any user/DB format value (e.g. 'TEST', 't20', '50', '50 overs',
 * 'Multi-day', a number of overs) to a canonical descriptor. Unknown values
 * fall back to a generic limited-overs descriptor built around the given overs
 * so a custom over count (e.g. 15) still scores correctly.
 */
export function resolveFormat(input, overridesOvers = null) {
  if (input && typeof input === 'object' && input.id && input.battingIndex) {
    return input; // already a descriptor
  }
  const raw = input == null ? '' : String(input).trim();
  const upper = raw.toUpperCase();

  if (/^TEST/.test(upper) || /MULTI.?DAY/.test(upper)) return FORMATS.TEST;
  if (/^ODI/.test(upper) || /(^|\D)50(\D|$)/.test(upper)) return FORMATS.ODI;
  if (/^T20/.test(upper) || /(^|\D)20(\D|$)/.test(upper)) return FORMATS.T20;
  if (/^T10/.test(upper) || /(^|\D)10(\D|$)/.test(upper)) return FORMATS.T10;

  // A bare / custom over count → generic limited-overs descriptor.
  const overs = Number(overridesOvers != null ? overridesOvers : (raw.match(/\d+/)?.[0]));
  if (Number.isFinite(overs) && overs > 0) {
    return {
      ...FORMATS.T20,
      id: `LIMITED_${overs}`,
      label: `${overs} overs`,
      oversPerInnings: overs,
    };
  }
  return DEFAULT_FORMAT;
}

/** Legal balls that end an innings for this format/innings (Infinity for Test). */
export function maxLegalBalls(format, inningsNumber) {
  const f = resolveFormat(format);
  const isSuperOver = f.superOver && (inningsNumber === 3 || inningsNumber === 4);
  if (isSuperOver) return f.ballsPerOver; // one over per super-over innings
  if (f.oversPerInnings == null) return Infinity; // Test: no over limit
  return f.oversPerInnings * f.ballsPerOver;
}

/** Wickets that end an innings (2 in a super over, else the format's max). */
export function maxWicketsForInnings(format, inningsNumber) {
  const f = resolveFormat(format);
  const isSuperOver = f.superOver && (inningsNumber === 3 || inningsNumber === 4);
  return isSuperOver ? 2 : f.maxWickets;
}

/** True if finishing this innings finishes the MATCH (vs. an innings break). */
export function isFinalInnings(format, inningsNumber) {
  // Every supported format is decided by its 2nd innings (super-over tie-breaks
  // add innings 3 & 4, whose 4th is the last). Test/multi-day is now 2 innings
  // too, so it no longer needs a special case.
  return inningsNumber === 2 || inningsNumber === 4;
}

/**
 * Which side (0 = batted-first side, 1 = other side) bats in this innings.
 * Caller maps 0/1 to the real team ids once (from the toss), so the batting
 * team is derived identically everywhere and never re-guessed.
 */
export function battingSideIndex(format, inningsNumber) {
  return resolveFormat(format).battingIndex(inningsNumber);
}

/**
 * True for any multi-day / Test format, however it is spelled — 'TEST',
 * 'Multi-Day', 'multi day', 'multiday', etc. The scoring engine and the hook
 * MUST use this instead of `format === 'TEST'`: a match stored as 'Multi-Day'
 * was otherwise treated as a 2-innings limited chase and finished on the first
 * ball ("won by 10 wickets" against an empty-innings target of 1).
 */
export function isTestFormat(fmt) {
  return resolveFormat(fmt).id === 'TEST';
}

/** Per-bowler over cap (Law 17) for limited overs; null if none (Test). */
export function perBowlerOverCap(format) {
  const f = resolveFormat(format);
  if (!f.perBowlerOverCap || f.oversPerInnings == null) return null;
  return Math.floor(f.oversPerInnings / 5);
}
