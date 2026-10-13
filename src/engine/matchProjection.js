/**
 * matchProjection.js — the pure fold: events -> authoritative match state.
 *
 *     state = buildMatchState(events)
 *
 * This is the SINGLE SOURCE OF TRUTH for display, scorecards, result and sync
 * verification. It is a pure, total function: same events always produce the
 * same state on any device (determinism), duplicate event ids are ignored
 * (idempotency), and voided events are skipped (deterministic undo). It does
 * NOT do any I/O, clock or RNG, and it never throws on bad data — anomalies are
 * collected in `state.errors` for diagnostics.
 *
 * It deliberately does NOT reuse the live positional engine (processDelivery):
 * each DELIVERY event is self-describing (it names its own striker/bowler), so
 * the projection folds raw facts directly. The live UI keeps processDelivery for
 * in-the-moment interaction; this fold is the truth the UI is reconciled against.
 */

import { EVENT_TYPES, orderEvents } from './matchEvents.js';
import {
  resolveFormat,
  maxLegalBalls,
  maxWicketsForInnings,
  isFinalInnings,
  battingSideIndex,
} from './formats.js';

const BOWLER_CREDITED = new Set(['BOWLED', 'CAUGHT', 'CAUGHT_BEHIND', 'STUMPED', 'LBW', 'HIT_WICKET']);
const NOT_BOWLER_CONCEDED = new Set(['BYE', 'LEG_BYE']);

function emptyInnings(inningsNumber, battingTeamId, bowlingTeamId) {
  return {
    inningsNumber,
    battingTeamId: battingTeamId || null,
    bowlingTeamId: bowlingTeamId || null,
    runs: 0,
    legalBalls: 0,
    wickets: 0,
    extras: { wides: 0, noBalls: 0, byes: 0, legByes: 0, penalty: 0 },
    fallOfWickets: [],
    batting: {},       // playerId -> { playerId, runs, balls, fours, sixes, out, dismissal }
    bowling: {},       // playerId -> { playerId, balls, runs, wickets }
    battingOrder: [],
    bowlingOrder: [],
    target: null,
    oversLimitOverride: null, // set by OVERS_REVISED (number of overs) if any
    declared: false,
    status: 'IN_PROGRESS', // IN_PROGRESS | BREAK | COMPLETE
  };
}

function ensureBatter(inn, id) {
  if (!id) return null;
  if (!inn.batting[id]) {
    inn.batting[id] = { playerId: id, runs: 0, balls: 0, fours: 0, sixes: 0, out: false, dismissal: null };
    inn.battingOrder.push(id);
  }
  return inn.batting[id];
}
function ensureBowler(inn, id) {
  if (!id) return null;
  if (!inn.bowling[id]) {
    inn.bowling[id] = { playerId: id, balls: 0, runs: 0, wickets: 0 };
    inn.bowlingOrder.push(id);
  }
  return inn.bowling[id];
}

function effectiveMaxBalls(format, inn) {
  if (inn.oversLimitOverride != null) return inn.oversLimitOverride * resolveFormat(format).ballsPerOver;
  return maxLegalBalls(format, inn.inningsNumber);
}

/** Team id for a given batting-side index (0 = batted first, 1 = other). */
function teamForIndex(state, index) {
  return index === 0 ? state.battedFirstTeamId : state.otherTeamId;
}

/** Compute the chasing/aggregate target for an innings, if determinable. */
function computeTarget(state, inningsNumber) {
  const f = state.format;
  const innByNo = (n) => state.innings.find((i) => i.inningsNumber === n);
  if (f.result === 'CHASE') {
    // Limited overs: innings 2 chases innings 1; super-over innings 4 chases 3.
    const prev = inningsNumber === 2 ? innByNo(1) : inningsNumber === 4 ? innByNo(3) : null;
    if (prev) return prev.runs + 1;
    return null;
  }
  // Test/multi-day targets depend on the batting ORDER (follow-on can make it
  // A,B,B,A), so they are computed by TEAM aggregate in deriveTestOutcome, not
  // from fixed innings positions here.
  return null;
}

/** Decide innings status after a scoring event (auto all-out / overs / chase). */
function refreshInningsStatus(state, inn) {
  if (inn.status === 'COMPLETE' || inn.declared) return;
  const allOut = inn.wickets >= maxWicketsForInnings(state.format, inn.inningsNumber);
  const oversDone = inn.legalBalls >= effectiveMaxBalls(state.format, inn);
  const chased = inn.target != null && inn.runs >= inn.target;
  if (allOut || oversDone || chased) {
    inn.status = 'COMPLETE';
  }
}

/** Derive the match result once the final innings is complete. */
function computeResult(state) {
  const f = state.format;
  const innByNo = (n) => state.innings.find((i) => i.inningsNumber === n);
  if (f.result === 'CHASE') {
    const finalNo = state.innings.some((i) => i.inningsNumber === 4) ? 4 : 2;
    const chase = innByNo(finalNo);
    const first = innByNo(finalNo === 4 ? 3 : 1);
    if (!chase || !first) return null;
    const target = first.runs + 1;
    const chasingTeam = chase.battingTeamId;
    const defendingTeam = chase.bowlingTeamId;
    if (chase.runs >= target) {
      const wktsLeft = maxWicketsForInnings(f, finalNo) - chase.wickets;
      return { winnerTeamId: chasingTeam, isDraw: false, margin: `${wktsLeft} wkt${wktsLeft === 1 ? '' : 's'}`, text: 'won by wickets' };
    }
    if (chase.runs === first.runs) {
      return { winnerTeamId: null, isDraw: false, isTie: true, margin: 'Tie', text: 'Match tied' };
    }
    const by = first.runs - chase.runs;
    return { winnerTeamId: defendingTeam, isDraw: false, margin: `${by} run${by === 1 ? '' : 's'}`, text: 'won by runs' };
  }
  // Test/multi-day (AGGREGATE) is handled by deriveTestOutcome (team-based).
  return null;
}

/**
 * Test / multi-day outcome, computed by TEAM aggregate so it is correct for any
 * batting order (normal A,B,A,B or a follow-on A,B,B,A). Returns the current
 * innings' chase target (if any), the match status, and the result when decided.
 *
 * Rules encoded (per the user's spec):
 *   - Each team bats up to 2 innings; innings end only on all-out / declaration
 *     (unlimited overs); when one side is out, the other bats.
 *   - The deciding "chase" is a team's 2nd innings once the opponent has used
 *     both of theirs: target = opponentAggregate − ownPreviousRuns + 1.
 *   - Innings victory: if a side that has batted twice still trails a side that
 *     has batted once, that side wins "by an innings and N runs" — the match
 *     ends without the 4th innings.
 */
function deriveTestOutcome(state) {
  const order = [...state.innings].sort((a, b) => a.inningsNumber - b.inningsNumber);
  const curr = order[order.length - 1];
  if (!curr) return { target: null, status: state.status, result: null };

  const first = state.battedFirstTeamId;
  const other = state.otherTeamId;
  const battingTeam = curr.battingTeamId;
  const bowlingTeam = battingTeam === first ? other : first;

  const aggOf = (team) => order.filter((i) => i.battingTeamId === team).reduce((s, i) => s + i.runs, 0);
  const innCountOf = (team) => order.filter((i) => i.battingTeamId === team).length;
  const prevRunsOf = (team) => order
    .filter((i) => i.battingTeamId === team && i.inningsNumber < curr.inningsNumber)
    .reduce((s, i) => s + i.runs, 0);

  const oppDoneBatting = innCountOf(bowlingTeam) >= 2;
  const isChase = innCountOf(battingTeam) >= 2 && oppDoneBatting;
  const target = isChase ? aggOf(bowlingTeam) - prevRunsOf(battingTeam) + 1 : null;

  const winByWkts = (inn) => {
    const w = maxWicketsForInnings(state.format, inn.inningsNumber) - inn.wickets;
    return { winnerTeamId: battingTeam, isDraw: false, margin: `${w} wkt${w === 1 ? '' : 's'}`, text: 'won by wickets' };
  };

  if (curr.status !== 'COMPLETE') {
    // Live: a chase can be won mid-innings the moment the target is passed.
    if (isChase && target != null && curr.runs >= target) return { target, status: 'COMPLETED', result: winByWkts(curr) };
    return { target, status: state.status === 'INNINGS_BREAK' ? 'INNINGS_BREAK' : 'IN_PROGRESS', result: null };
  }

  // Current innings is complete.
  if (isChase) {
    const batAgg = aggOf(battingTeam);
    const oppAgg = aggOf(bowlingTeam);
    if (batAgg > oppAgg) return { target, status: 'COMPLETED', result: winByWkts(curr) };
    if (oppAgg > batAgg) {
      const by = oppAgg - batAgg;
      return { target, status: 'COMPLETED', result: { winnerTeamId: bowlingTeam, isDraw: false, margin: `${by} run${by === 1 ? '' : 's'}`, text: 'won by runs' } };
    }
    return { target, status: 'COMPLETED', result: { winnerTeamId: null, isDraw: false, isTie: true, margin: 'Tie', text: 'Match tied' } };
  }

  // Innings victory: the side that just finished its 2nd innings still trails the
  // side that has batted only once → that side wins by an innings (no 4th innings).
  if (innCountOf(battingTeam) >= 2 && innCountOf(bowlingTeam) === 1) {
    const batAgg = aggOf(battingTeam);
    const oppAgg = aggOf(bowlingTeam);
    if (oppAgg > batAgg) {
      const by = oppAgg - batAgg;
      return { target: null, status: 'COMPLETED', result: { winnerTeamId: bowlingTeam, isDraw: false, margin: `an innings and ${by} run${by === 1 ? '' : 's'}`, text: 'won by an innings' } };
    }
    // Opponent must bat its 2nd innings to chase — not decided yet.
    return { target: null, status: 'INNINGS_BREAK', result: null };
  }

  // All four innings complete → decide on aggregate.
  if (innCountOf(first) >= 2 && innCountOf(other) >= 2 && order.every((i) => i.status === 'COMPLETE')) {
    const a = aggOf(first);
    const b = aggOf(other);
    if (a === b) return { target: null, status: 'COMPLETED', result: { winnerTeamId: null, isDraw: true, margin: 'Draw', text: 'Match drawn' } };
    const winner = a > b ? first : other;
    const by = Math.abs(a - b);
    return { target: null, status: 'COMPLETED', result: { winnerTeamId: winner, isDraw: false, margin: `${by} run${by === 1 ? '' : 's'}`, text: 'won by runs (aggregate)' } };
  }

  // Otherwise an innings just closed and more innings are to come.
  return { target: null, status: 'INNINGS_BREAK', result: null };
}

function applyDelivery(state, inn, p, pushError) {
  const extraType = p.extraType || 'NONE';
  const wicketType = p.wicketType || 'NONE';
  const runsTotal = Number(p.runsTotal) || 0;
  const runsBatter = Number(p.runsBatter) || 0;
  const runsExtras = Number(p.runsExtras) || 0;
  // Canonical: wides & no-balls are never legal deliveries; everything else
  // respects the flag (default true when absent).
  const isLegal = extraType === 'WIDE' || extraType === 'NO_BALL' ? false : (p.isLegalDelivery !== false);

  // Team runs + extras bucket
  inn.runs += runsTotal;
  if (extraType === 'WIDE') inn.extras.wides += runsExtras;
  else if (extraType === 'NO_BALL') inn.extras.noBalls += runsExtras;
  else if (extraType === 'BYE') inn.extras.byes += runsExtras;
  else if (extraType === 'LEG_BYE') inn.extras.legByes += runsExtras;

  if (isLegal) inn.legalBalls += 1;

  // Batter card (striker faces the ball). Balls faced count for legal + no-balls.
  const striker = ensureBatter(inn, p.strikerId);
  ensureBatter(inn, p.nonStrikerId); // keep non-striker in the order/card
  if (striker) {
    striker.runs += runsBatter;
    if (isLegal || extraType === 'NO_BALL') striker.balls += 1;
    if (runsBatter === 4) striker.fours += 1;
    if (runsBatter === 6) striker.sixes += 1;
  }

  // Bowler card. Byes/leg-byes are not charged to the bowler.
  const bowler = ensureBowler(inn, p.bowlerId);
  if (bowler) {
    if (isLegal) bowler.balls += 1;
    bowler.runs += NOT_BOWLER_CONCEDED.has(extraType) ? 0 : runsTotal;
  }

  // Wicket
  if (wicketType !== 'NONE') {
    inn.wickets += 1;
    const dismissedId = p.dismissedPlayerId || p.strikerId || null;
    const dismissed = ensureBatter(inn, dismissedId);
    if (dismissed) {
      dismissed.out = true;
      dismissed.dismissal = { type: wicketType, bowlerId: p.bowlerId || null, fielderId: p.fielderId || null };
    }
    inn.fallOfWickets.push({ wicketNumber: inn.wickets, runs: inn.runs, playerId: dismissedId, overBall: `${Math.floor(inn.legalBalls / 6)}.${inn.legalBalls % 6}` });
    if (bowler && BOWLER_CREDITED.has(wicketType)) bowler.wickets += 1;
  }

  if (runsTotal !== runsBatter + runsExtras) {
    pushError(`Delivery runsTotal(${runsTotal}) != runsBatter(${runsBatter})+runsExtras(${runsExtras}) [event ${p.id || '?'}]`);
  }
}

/**
 * Fold an ordered, de-duplicated, non-voided event stream into match state.
 */
export function buildMatchState(rawEvents, opts = {}) {
  const errors = [];
  const pushError = (m) => errors.push(m);

  const state = {
    matchId: opts.matchId || null,
    format: resolveFormat(opts.format || 'T20'),
    status: 'NOT_STARTED', // NOT_STARTED | IN_PROGRESS | INNINGS_BREAK | COMPLETED | ABANDONED
    battedFirstTeamId: null,
    otherTeamId: null,
    currentInnings: null,
    innings: [],
    result: null,
    errors,
  };

  const seen = new Set();
  const events = orderEvents((rawEvents || []).filter((e) => e && !e.voided));

  const innByNo = (n) => state.innings.find((i) => i.inningsNumber === n);

  for (const e of events) {
    if (e.id) {
      if (seen.has(e.id)) continue; // idempotency: ignore duplicate event ids
      seen.add(e.id);
    }
    const p = e.payload || {};

    switch (e.type) {
      case EVENT_TYPES.MATCH_STARTED: {
        if (p.format) state.format = resolveFormat(p.format, p.oversPerInnings);
        state.battedFirstTeamId = p.battedFirstTeamId || p.battingFirstTeamId || null;
        state.otherTeamId = p.otherTeamId || null;
        state.status = 'IN_PROGRESS';
        break;
      }
      case EVENT_TYPES.INNINGS_STARTED: {
        const n = e.inningsNumber || p.inningsNumber;
        if (!n) { pushError('INNINGS_STARTED without inningsNumber'); break; }
        if (innByNo(n)) break; // already started (idempotent)
        // Prefer explicit teams; else derive from the format's batting-side index.
        let batId = p.battingTeamId;
        let bowlId = p.bowlingTeamId;
        if (!batId || !bowlId) {
          const idx = battingSideIndex(state.format, n);
          batId = teamForIndex(state, idx);
          bowlId = teamForIndex(state, idx === 0 ? 1 : 0);
        }
        const inn = emptyInnings(n, batId, bowlId);
        inn.target = p.target != null ? p.target : computeTarget({ ...state, innings: state.innings }, n);
        state.innings.push(inn);
        state.currentInnings = n;
        state.status = 'IN_PROGRESS';
        break;
      }
      case EVENT_TYPES.DELIVERY: {
        const n = e.inningsNumber || p.innings;
        const inn = innByNo(n);
        if (!inn) { pushError(`DELIVERY for innings ${n} that was never started`); break; }
        applyDelivery(state, inn, p, pushError);
        refreshInningsStatus(state, inn);
        break;
      }
      case EVENT_TYPES.PENALTY: {
        const n = e.inningsNumber || p.innings;
        const inn = innByNo(n);
        if (!inn) { pushError('PENALTY for unknown innings'); break; }
        const runs = Number(p.penaltyRuns || p.runs) || 0;
        // Penalty to the batting side adds to this innings; to the bowling side
        // it is held until that side bats (recorded as a note on their innings).
        if (!p.recipientTeamId || p.recipientTeamId === inn.battingTeamId) {
          inn.runs += runs;
          inn.extras.penalty += runs;
          refreshInningsStatus(state, inn);
        } else {
          inn._pendingPenalty = (inn._pendingPenalty || 0) + runs;
        }
        break;
      }
      case EVENT_TYPES.RETIREMENT: {
        const n = e.inningsNumber || p.innings;
        const inn = innByNo(n);
        if (!inn) { pushError('RETIREMENT for unknown innings'); break; }
        const id = p.playerId || p.dismissedPlayerId;
        const b = ensureBatter(inn, id);
        const retiredOut = (p.wicketType || p.type) === 'RETIRED_OUT';
        if (b) {
          b.out = retiredOut;
          b.dismissal = { type: retiredOut ? 'RETIRED_OUT' : 'RETIRED_HURT', bowlerId: null, fielderId: null };
        }
        if (retiredOut) {
          inn.wickets += 1;
          inn.fallOfWickets.push({ wicketNumber: inn.wickets, runs: inn.runs, playerId: id, overBall: `${Math.floor(inn.legalBalls / 6)}.${inn.legalBalls % 6}` });
          refreshInningsStatus(state, inn);
        }
        break;
      }
      case EVENT_TYPES.OVERS_REVISED: {
        const n = e.inningsNumber || p.innings;
        const inn = innByNo(n);
        if (inn && p.toOvers != null) inn.oversLimitOverride = Number(p.toOvers);
        if (inn && p.revisedTarget != null) inn.target = Number(p.revisedTarget);
        if (inn) refreshInningsStatus(state, inn);
        break;
      }
      case EVENT_TYPES.DECLARATION: {
        const n = e.inningsNumber || p.innings;
        const inn = innByNo(n);
        if (inn) { inn.declared = true; inn.status = 'COMPLETE'; }
        break;
      }
      case EVENT_TYPES.INNINGS_ENDED: {
        const n = e.inningsNumber || p.innings;
        const inn = innByNo(n);
        if (inn) inn.status = 'COMPLETE';
        break;
      }
      case EVENT_TYPES.MATCH_ENDED: {
        state.status = p.abandoned ? 'ABANDONED' : 'COMPLETED';
        state.result = p.abandoned
          ? { winnerTeamId: null, isDraw: false, abandoned: true, margin: 'Abandoned', text: p.resultText || 'Match abandoned' }
          : (p.isDraw
            ? { winnerTeamId: null, isDraw: true, margin: 'Draw', text: p.resultText || 'Match drawn' }
            : { winnerTeamId: p.winnerTeamId || null, isDraw: false, margin: p.margin || null, text: p.resultText || 'Match completed' });
        break;
      }
      default:
        pushError(`Unknown event type ${e.type}`);
    }
  }

  // Derive match-level status/result from innings when not explicitly ended.
  if (state.status !== 'COMPLETED' && state.status !== 'ABANDONED') {
    if (state.format.result === 'AGGREGATE') {
      // Test / multi-day: team-aggregate, follow-on-aware, innings-victory-aware.
      const outcome = deriveTestOutcome(state);
      const curr = state.currentInnings ? innByNo(state.currentInnings) : null;
      if (curr) curr.target = outcome.target;
      if (outcome.status === 'COMPLETED') { state.status = 'COMPLETED'; state.result = outcome.result; }
      else if (outcome.status === 'INNINGS_BREAK') state.status = 'INNINGS_BREAK';
    } else {
      const current = state.currentInnings ? innByNo(state.currentInnings) : null;
      if (current && current.status === 'COMPLETE') {
        if (isFinalInnings(state.format, current.inningsNumber)) {
          const result = computeResult(state);
          if (result) { state.status = 'COMPLETED'; state.result = result; }
        } else {
          state.status = 'INNINGS_BREAK';
        }
      }
    }
  }

  return state;
}

/** Convenience: overs string from legal balls (e.g. 95 -> "15.5"). */
export function oversFromBalls(legalBalls, ballsPerOver = 6) {
  return `${Math.floor(legalBalls / ballsPerOver)}.${legalBalls % ballsPerOver}`;
}
