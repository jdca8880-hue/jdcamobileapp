/**
 * JDCA Derived Scorecard Engine
 * 
 * Supabase is the source of truth. A Delivery is the fundamental scoring event.
 * Do not manually store derived statistics when they can be calculated from deliveries.
 */

import { normalizeDelivery, normalizePenaltyEvent } from './deliveryContract.js';

export function deriveScorecardFromDeliveries(deliveries, teamBattingId, teamBowlingId) {
  const scorecard = {
    teamBattingId,
    teamBowlingId,
    runs: 0,
    wickets: 0,
    balls: 0,
    overs: '0.0',
    extras: { total: 0, wides: 0, noBalls: 0, byes: 0, legByes: 0, penalty: 0 },
    batting: {}, // Map of strikerId -> Stats
    bowling: {}, // Map of bowlerId -> Stats
    fielding: {}, 
    wicketkeeping: {},
    wicketSummary: {
      'BOWLED': 0, 'CAUGHT': 0, 'LBW': 0, 'RUN_OUT': 0, 'STUMPED': 0, 'HIT_WICKET': 0, 'OTHER': 0
    },
    fallOfWickets: [],
    partnerships: [],
    pendingPenalties: {}
  };

  if (!deliveries || deliveries.length === 0) return scorecard;

  let currentPartnershipRuns = 0;
  let currentPartnershipBalls = 0;
  let currentPartnershipPlayers = new Set();
  
  // Over tracking for Maidens
  let activeOver = { bowlerId: null, runsConceded: 0, legalBalls: 0 };

  deliveries.forEach((rawDelivery) => {
    if (rawDelivery.eventType === 'PENALTY') {
      const penalty = normalizePenaltyEvent(rawDelivery);
      if (teamBattingId && penalty.recipientTeamId === teamBattingId) {
        scorecard.runs += penalty.penaltyRuns;
        scorecard.extras.penalty += penalty.penaltyRuns;
        scorecard.extras.total += penalty.penaltyRuns;
      } else if (penalty.recipientTeamId) {
        // According to requirements: create a deterministic pending state per team
        scorecard.pendingPenalties[penalty.recipientTeamId] = (scorecard.pendingPenalties[penalty.recipientTeamId] || 0) + penalty.penaltyRuns;
      }
      return;
    }

    const delivery = normalizeDelivery(rawDelivery);
    const { 
      runsBatter, runsExtras, extraType, wicketType, dismissedPlayerId, dismissedPlayerName,
      strikerId, nonStrikerId, bowlerId, fielderName, fielderId, wicketkeeperName, wicketkeeperId,
      isLegalDelivery
    } = delivery;

    // Initialize players
    if (strikerId && !scorecard.batting[strikerId]) initBatter(scorecard.batting, strikerId);
    if (nonStrikerId && !scorecard.batting[nonStrikerId]) initBatter(scorecard.batting, nonStrikerId);
    if (bowlerId && !scorecard.bowling[bowlerId]) initBowler(scorecard.bowling, bowlerId);

    if (strikerId) currentPartnershipPlayers.add(strikerId);
    if (nonStrikerId) currentPartnershipPlayers.add(nonStrikerId);

    const isWide = extraType === 'WIDE';
    const isNoBall = extraType === 'NO_BALL';
    const isBye = extraType === 'BYE';
    const isLegBye = extraType === 'LEG_BYE';

    const runsThisBall = delivery.runsTotal || 0;
    const extrasThisBall = delivery.runsExtras || 0;

    // Update Team Totals
    scorecard.runs += runsThisBall;
    if (isLegalDelivery) scorecard.balls += 1;

    // Update Extras
    if (extraType !== 'NONE') {
      if (isWide) scorecard.extras.wides += extrasThisBall;
      if (isNoBall) scorecard.extras.noBalls += extrasThisBall;
      if (isBye) scorecard.extras.byes += extrasThisBall;
      if (isLegBye) scorecard.extras.legByes += extrasThisBall;
      scorecard.extras.total += extrasThisBall;
    }

    // Update Batter
    if (strikerId && (runsBatter > 0 || isLegalDelivery || isNoBall)) {
      scorecard.batting[strikerId].runs += runsBatter;
      if (isLegalDelivery || isNoBall) scorecard.batting[strikerId].balls += 1;
      if (runsBatter === 4) scorecard.batting[strikerId].fours += 1;
      if (runsBatter === 6) scorecard.batting[strikerId].sixes += 1;
    }

    // Update Bowler & Maidens
    let bowlerChargeableRuns = 0;
    if (!isBye && !isLegBye) {
      bowlerChargeableRuns = runsThisBall;
    }

    if (bowlerId) {
      if (activeOver.bowlerId !== bowlerId) {
        // Change of bowler mid-over or start of new over
        if (activeOver.legalBalls === 6 && activeOver.runsConceded === 0 && activeOver.bowlerId) {
          if (scorecard.bowling[activeOver.bowlerId]) scorecard.bowling[activeOver.bowlerId].maidens += 1;
        }
        activeOver = { bowlerId, runsConceded: 0, legalBalls: 0 };
      }

      activeOver.runsConceded += bowlerChargeableRuns;
      
      if (isLegalDelivery) {
        scorecard.bowling[bowlerId].balls += 1;
        activeOver.legalBalls += 1;
      }
      
      scorecard.bowling[bowlerId].runs += bowlerChargeableRuns;
      if (isWide) scorecard.bowling[bowlerId].wides += extrasThisBall;
      if (isNoBall) scorecard.bowling[bowlerId].noBalls += extrasThisBall;

      if (activeOver.legalBalls === 6) {
        if (activeOver.runsConceded === 0) {
          scorecard.bowling[bowlerId].maidens += 1;
        }
        activeOver = { bowlerId: null, runsConceded: 0, legalBalls: 0 };
      }
    }

    // Partnership Tracker
    currentPartnershipRuns += runsThisBall;
    if (isLegalDelivery || isNoBall) currentPartnershipBalls += 1;

    // Handle Wickets
    if (wicketType !== 'NONE') {
      scorecard.wickets += 1;
      
      const outId = dismissedPlayerId || strikerId;
      const finalFielderName = fielderName || fielderId;
      const finalWkName = wicketkeeperName || wicketkeeperId;

      if (outId && scorecard.batting[outId]) {
        scorecard.batting[outId].dismissalType = wicketType || 'CAUGHT';
        scorecard.batting[outId].bowlerId = bowlerId;
        scorecard.batting[outId].fielderName = finalFielderName;
        scorecard.batting[outId].wicketkeeperName = finalWkName;
        
        // Format dismissal text properly based on type
        scorecard.batting[outId].dismissal = formatDismissalText(wicketType, finalFielderName, finalWkName, bowlerId);
      }

      // Wicket Summary
      const sumType = scorecard.wicketSummary[wicketType] !== undefined ? wicketType : 'OTHER';
      scorecard.wicketSummary[sumType] += 1;

      // Bowler Wickets
      const isBowlerWicket = !['RUN_OUT', 'OBSTRUCTING_FIELD', 'RETIRED_OUT'].includes(wicketType);
      if (isBowlerWicket && bowlerId) {
        scorecard.bowling[bowlerId].wickets += 1;
      }

      // Fielding & Wicketkeeping Stats
      if (wicketType === 'CAUGHT' && finalFielderName) {
        if (!scorecard.fielding[finalFielderName]) initFielder(scorecard.fielding, finalFielderName);
        scorecard.fielding[finalFielderName].catches += 1;
        scorecard.fielding[finalFielderName].totalDismissals += 1;
      } else if (wicketType === 'STUMPED' && finalWkName) {
        if (!scorecard.wicketkeeping[finalWkName]) initWicketkeeper(scorecard.wicketkeeping, finalWkName);
        scorecard.wicketkeeping[finalWkName].stumpings += 1;
        scorecard.wicketkeeping[finalWkName].totalDismissals += 1;
      } else if (wicketType === 'RUN_OUT' && finalFielderName) {
        if (!scorecard.fielding[finalFielderName]) initFielder(scorecard.fielding, finalFielderName);
        scorecard.fielding[finalFielderName].runOuts += 1;
        scorecard.fielding[finalFielderName].totalDismissals += 1;
      }

      // FOW
      scorecard.fallOfWickets.push({
        wicket: scorecard.wickets,
        score: scorecard.runs,
        over: formatOvers(scorecard.balls),
        playerId: outId
      });

      // Partnership
      scorecard.partnerships.push({
        runs: currentPartnershipRuns,
        balls: currentPartnershipBalls,
        players: Array.from(currentPartnershipPlayers)
      });

      currentPartnershipRuns = 0;
      currentPartnershipBalls = 0;
      currentPartnershipPlayers.clear();
      if (strikerId !== outId) currentPartnershipPlayers.add(strikerId);
      if (nonStrikerId !== outId) currentPartnershipPlayers.add(nonStrikerId);
    }
  });

  // Calculate Strike Rates & Economy
  Object.values(scorecard.batting).forEach(b => {
    b.strikeRate = b.balls > 0 ? ((b.runs / b.balls) * 100).toFixed(2) : '0.00';
  });

  Object.values(scorecard.bowling).forEach(b => {
    b.overs = formatOvers(b.balls);
    const totalOversDec = b.balls / 6;
    b.economy = totalOversDec > 0 ? (b.runs / totalOversDec).toFixed(2) : '0.00';
  });

  // Push unbroken partnership if match ends
  if (currentPartnershipRuns > 0 || currentPartnershipBalls > 0) {
    scorecard.partnerships.push({
      runs: currentPartnershipRuns,
      balls: currentPartnershipBalls,
      players: Array.from(currentPartnershipPlayers),
      unbroken: true
    });
  }

  scorecard.batting = Object.values(scorecard.batting);
  scorecard.bowling = Object.values(scorecard.bowling);
  scorecard.fielding = Object.values(scorecard.fielding);
  scorecard.wicketkeeping = Object.values(scorecard.wicketkeeping);

  scorecard.overs = formatOvers(scorecard.balls);
  return scorecard;
}

function initBatter(map, id) {
  map[id] = { id, runs: 0, balls: 0, fours: 0, sixes: 0, dismissal: 'Not Out', dismissalType: null, bowlerId: null, fielderName: null, wicketkeeperName: null, strikeRate: '0.00' };
}

function initBowler(map, id) {
  map[id] = { id, balls: 0, overs: '0.0', maidens: 0, runs: 0, wickets: 0, wides: 0, noBalls: 0, economy: '0.00' };
}

function initFielder(map, id) {
  map[id] = { id, catches: 0, runOuts: 0, totalDismissals: 0 };
}

function initWicketkeeper(map, id) {
  map[id] = { id, catches: 0, stumpings: 0, runOuts: 0, totalDismissals: 0 };
}

function formatDismissalText(type, fielder, wk, bowler) {
  if (type === 'CAUGHT') return `c ${fielder || 'Unknown'} b ${bowler || 'Unknown'}`;
  if (type === 'STUMPED') return `st ${wk || 'Unknown'} b ${bowler || 'Unknown'}`;
  if (type === 'RUN_OUT') return `run out (${fielder || 'Unknown'})`;
  if (type === 'BOWLED') return `b ${bowler || 'Unknown'}`;
  if (type === 'LBW') return `lbw b ${bowler || 'Unknown'}`;
  if (type === 'HIT_WICKET') return `hit wicket b ${bowler || 'Unknown'}`;
  return type || 'Out';
}

export function formatOvers(balls) {
  const overs = Math.floor(balls / 6);
  const rem = balls % 6;
  return `${overs}.${rem}`;
}
