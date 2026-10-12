/**
 * matchEvents.js — the event model (the single source of truth's unit).
 *
 * A match is an append-only list of these events. Each event is immutable and
 * self-describing (it names the innings and the players it concerns), carries a
 * stable client-generated `id` (exactly-once key) and a per-innings monotonic
 * `seq` DERIVED FROM THE DURABLE LOG — never from a RAM counter. "Undo" never
 * deletes history; it appends nothing and instead marks the target event
 * `voided: true`, which the projection skips. This keeps replay deterministic
 * and sync idempotent.
 *
 * PURE module: the only impurity is id/timestamp generation in the factory,
 * which is why the factory is separate from the (pure) projection.
 */

export const EVENT_TYPES = {
  MATCH_STARTED: 'MATCH_STARTED',   // format, teams, toss → fixes batted-first side
  INNINGS_STARTED: 'INNINGS_STARTED', // inningsNumber, batting/bowling team, target?
  DELIVERY: 'DELIVERY',             // a ball (canonical delivery payload)
  PENALTY: 'PENALTY',               // penalty runs to a team
  RETIREMENT: 'RETIREMENT',         // retired hurt / out (no ball bowled)
  OVERS_REVISED: 'OVERS_REVISED',   // rain/reduced overs + optional revised target
  DECLARATION: 'DECLARATION',       // Test: voluntarily close an innings
  INNINGS_ENDED: 'INNINGS_ENDED',   // explicit close (all out / overs done / declared)
  MATCH_ENDED: 'MATCH_ENDED',       // result (winner/margin/draw/abandoned)
  VOID: 'VOID',                     // compensating marker (see voidEvent)
};

const ID_RE = /^evt-[0-9a-z]+-[0-9a-z]+$/i;

function newId() {
  // Stable, collision-resistant, URL-safe. crypto.randomUUID exists in modern
  // browsers and node >=16; fall back to time+random if unavailable.
  const rand = (typeof crypto !== 'undefined' && crypto.randomUUID)
    ? crypto.randomUUID().replace(/-/g, '')
    : Math.random().toString(36).slice(2) + Math.random().toString(36).slice(2);
  return `evt-${Date.now().toString(36)}-${rand.slice(0, 12)}`;
}

/**
 * Derive the next per-innings sequence from the DURABLE event list. This is the
 * fix for the whole SEQUENCE_CONFLICT class of bugs: the next number comes from
 * what is persisted, so a reload / remount / crash can never reuse a number.
 */
export function nextSequence(events, inningsNumber) {
  let max = 0;
  for (const e of events) {
    if (e && e.inningsNumber === inningsNumber && Number.isFinite(e.seq) && e.seq > max) {
      max = e.seq;
    }
  }
  return max + 1;
}

/**
 * Build a well-formed event envelope. `seq` must be supplied by the caller via
 * nextSequence(durableLog, inningsNumber) so it is always derived from storage.
 */
export function makeEvent({ type, matchId, inningsNumber = null, seq = null, payload = {}, createdBy = null, createdAt = null, id = null }) {
  if (!type || !EVENT_TYPES[type]) throw new Error(`Unknown event type: ${type}`);
  if (!matchId) throw new Error('makeEvent requires matchId');
  return {
    id: id || newId(),
    type,
    matchId,
    inningsNumber,
    seq,
    payload: payload || {},
    createdBy: createdBy || null,
    createdAt: createdAt || new Date().toISOString(),
    voided: false,
  };
}

/** Mark an existing event voided (deterministic undo). Returns a new object. */
export function voidEvent(event) {
  return { ...event, voided: true };
}

/**
 * Order a match's events the way an event store does: by a GLOBAL monotonic
 * append offset (`logSeq`), which the durable log assigns on insert. The
 * per-innings `seq` is NOT a global order key — it exists for delivery identity,
 * dedupe and gap detection. When `logSeq` is absent (e.g. a freshly built
 * in-memory list), we preserve the caller's input order with a STABLE sort, so
 * events must already be supplied in append order in that case.
 */
export function orderEvents(events) {
  const list = events || [];
  const allHaveLogSeq = list.length > 0 && list.every((e) => Number.isFinite(e && e.logSeq));
  if (!allHaveLogSeq) return [...list]; // stable: keep append order as given
  return [...list].sort((a, b) => a.logSeq - b.logSeq);
}

export function isValidEventId(id) {
  return typeof id === 'string' && ID_RE.test(id);
}
