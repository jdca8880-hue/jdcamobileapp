/**
 * liveState.js — the LIVE scoring view, rebuilt from the event log (Stage 4).
 *
 * buildMatchState gives totals/scorecards/result. The scoring SCREEN also needs
 * the in-the-moment view: who is on strike, the current over's balls, and
 * whether we're waiting for a new batter / new bowler. buildLiveState rebuilds
 * exactly that by replaying the current innings' deliveries through the proven
 * `processDelivery` state machine — so the live engine logic (rotation, over
 * handling, free-hit, termination) stays byte-identical to today; only the
 * SOURCE of the balls changes (durable event log instead of volatile memory).
 *
 * Pure + node-testable. Replaying already-recorded history, so XI validation is
 * intentionally skipped (those balls were validated when first recorded).
 */

import { buildMatchState } from './matchProjection.js';
import { processDelivery, MATCH_STATES } from './cricketStateMachine.js';
import { resolveFormat } from './formats.js';

function freshRunning() {
  return {
    runs: 0, wickets: 0, balls: 0,
    extras: { wides: 0, noBalls: 0, legByes: 0, byes: 0, penalty: 0 },
    currentOverBalls: [],
    scorecard: { fallOfWickets: [] },
    isFreeHit: false,
    lastOverBowlerId: null,
    matchStatus: MATCH_STATES.IN_PROGRESS,
    _overJustCompleted: false,
  };
}

export function buildLiveState(events, { format } = {}) {
  const proj = buildMatchState(events, { format });
  const f = resolveFormat(proj.format || format);
  const totalMatchOvers = f.oversPerInnings == null ? 9999 : f.oversPerInnings;

  const curNo = proj.currentInnings;
  const cur = curNo ? proj.innings.find((i) => i.inningsNumber === curNo) : null;

  const base = {
    status: proj.status,
    matchStatus: proj.status === 'INNINGS_BREAK' ? MATCH_STATES.INNINGS_BREAK
      : proj.status === 'COMPLETED' ? MATCH_STATES.MATCH_FINISHED
        : MATCH_STATES.IN_PROGRESS,
    innings: curNo || 1,
    runs: cur?.runs || 0,
    wickets: cur?.wickets || 0,
    balls: cur?.legalBalls || 0,
    target: cur?.target ?? null,
    battingTeamId: cur?.battingTeamId || null,
    bowlingTeamId: cur?.bowlingTeamId || null,
    striker: null,
    nonStriker: null,
    currentBowler: null,
    currentOverBalls: [],
    isFreeHit: false,
    lastOverBowlerId: null,
    needsOpeners: false,
    needsNewBatter: false,
    needsNewBowler: false,
    result: proj.result,
    projection: proj,
  };
  if (!cur) return base;

  // Deliveries of the current innings, in order (projection already dedupes /
  // skips voided; we re-filter the raw list the same way, preserving log order).
  const seen = new Set();
  const deliveries = (events || [])
    .filter((e) => e && !e.voided && e.type === 'DELIVERY' && (e.inningsNumber === curNo))
    .filter((e) => (e.id && seen.has(e.id) ? false : (e.id && seen.add(e.id), true)))
    .sort((a, b) => (a.logSeq ?? 0) - (b.logSeq ?? 0));

  if (deliveries.length === 0) {
    base.needsOpeners = true;
    return base;
  }

  const batters = new Map(); // id -> accumulating batter object
  const bowlers = new Map(); // id -> accumulating bowler object (persists across spells)
  // Names are carried in each delivery payload (p.striker/p.nonStriker/p.bowler),
  // so the fold re-uses them. Without this the shaped object keeps name:null and
  // the scoring screen renders "Select Striker" even though the id is valid —
  // which looked like the striker had "disappeared" on undo.
  const getBatter = (id, name = null) => {
    if (!id) return null;
    if (!batters.has(id)) batters.set(id, { id, name, runs: 0, balls: 0, fours: 0, sixes: 0, strikeRate: '0.0' });
    else if (name && !batters.get(id).name) batters.get(id).name = name;
    return batters.get(id);
  };
  const getBowler = (id, name = null) => {
    if (!id) return null;
    if (!bowlers.has(id)) bowlers.set(id, { id, name, runs: 0, wickets: 0, ballsBowled: 0, overs: 0, economy: '0.00' });
    else if (name && !bowlers.get(id).name) bowlers.get(id).name = name;
    return bowlers.get(id);
  };

  let running = freshRunning();
  let striker = null, nonStriker = null, bowler = null;

  for (const e of deliveries) {
    const p = e.payload || {};
    // Personnel decisions come from the payload: a new batter fills a vacated
    // end; the bowler changes at the start of a new over. The payload also
    // carries the display name so the fold restores it after a reload/undo.
    if (!striker) striker = getBatter(p.strikerId, p.striker);
    if (!nonStriker) nonStriker = getBatter(p.nonStrikerId, p.nonStriker);
    if (!bowler || (p.bowlerId && bowler.id !== p.bowlerId)) bowler = getBowler(p.bowlerId, p.bowler);

    if (running._overJustCompleted) { running.currentOverBalls = []; running._overJustCompleted = false; }

    const currentState = {
      ...running,
      striker, nonStriker, currentBowler: bowler,
      innings: curNo,
      totalMatchOvers,
      format: proj.format?.id || format || null,
      target: cur.target ?? null,
    };
    const result = processDelivery(currentState, p);
    if (!result.success) continue; // recorded history should always apply; skip anomalies
    const ns = result.newState;

    running = {
      runs: ns.runs, wickets: ns.wickets, balls: ns.balls,
      extras: ns.extras, currentOverBalls: ns.currentOverBalls,
      scorecard: ns.scorecard, isFreeHit: ns.isFreeHit,
      lastOverBowlerId: ns.lastOverBowlerId,
      matchStatus: ns.matchStatus,
      _overJustCompleted: ns.matchStatus === MATCH_STATES.OVER_COMPLETE,
    };
    striker = ns.striker; nonStriker = ns.nonStriker; bowler = ns.currentBowler;
    if (striker?.id) batters.set(striker.id, striker);
    if (nonStriker?.id) batters.set(nonStriker.id, nonStriker);
    if (bowler?.id) bowlers.set(bowler.id, bowler);
  }

  base.striker = striker;
  base.nonStriker = nonStriker;
  base.currentBowler = bowler;
  base.currentOverBalls = running.currentOverBalls;
  base.isFreeHit = running.isFreeHit;
  base.lastOverBowlerId = running.lastOverBowlerId;
  // Projection is authoritative for terminal status; otherwise use the replay.
  if (base.status !== 'INNINGS_BREAK' && base.status !== 'COMPLETED') {
    base.matchStatus = running.matchStatus;
  }
  base.needsNewBatter = !striker || !nonStriker;
  base.needsNewBowler = running.matchStatus === MATCH_STATES.OVER_COMPLETE;
  return base;
}
