import { normalizeDelivery } from './deliveryContract.js';

export const MATCH_STATES = {
  IN_PROGRESS: 'IN_PROGRESS',
  OVER_COMPLETE: 'OVER_COMPLETE',
  INNINGS_BREAK: 'INNINGS_BREAK',
  MATCH_FINISHED: 'MATCH_FINISHED'
};

/**
 * Format total legal balls into standard cricket overs notation (e.g. 95 balls -> 15.5)
 */
export function formatOvers(ballCount) {
  const fullOvers = Math.floor(ballCount / 6);
  const remainder = ballCount % 6;
  return `${fullOvers}.${remainder}`;
}

/**
 * Calculate Current Run Rate (CRR)
 */
export function calculateCRR(runs, balls) {
  if (balls === 0) return '0.00';
  const totalOvers = balls / 6;
  return (runs / totalOvers).toFixed(2);
}

/**
 * Calculate Projected Score
 */
export function calculateProjectedScore(runs, balls, totalMatchOvers = 20) {
  const crr = parseFloat(calculateCRR(runs, balls));
  if (isNaN(crr) || crr === 0) return runs;
  return Math.round(crr * totalMatchOvers);
}

/**
 * Validate whether a bowler can bowl the upcoming over (MCC Law: No consecutive overs)
 */
export function canBowlerBowlNextOver(candidateBowlerId, lastOverBowlerId) {
  if (!candidateBowlerId || !lastOverBowlerId) return true;
  return candidateBowlerId !== lastOverBowlerId;
}

/**
 * Pure Deterministic State Machine for Cricket Scoring
 * 
 * @param {Object} currentState Current match state
 * @param {Object} ballInput Raw action payload (runs, extras, wicket)
 * @returns {Object} { success: boolean, newState?: Object, error?: string }
 */

/**
 * Pure helper to resolve physical positioning and dismissals.
 * Returns the final objects to be assigned to striker and nonStriker.
 */
function resolveWicketTransition(originalStriker, originalNonStriker, dismissedIdOrName, runsCompleted) {
  const isOdd = runsCompleted % 2 !== 0;
  
  // Who is where AFTER the runs but BEFORE the dismissal?
  const playerAtStrikerEnd = isOdd ? originalNonStriker : originalStriker;
  const playerAtNonStrikerEnd = isOdd ? originalStriker : originalNonStriker;

  // Evaluate who was dismissed at their current end
  const isDismissedAtStrikerEnd = playerAtStrikerEnd && (dismissedIdOrName === playerAtStrikerEnd.id || dismissedIdOrName === playerAtStrikerEnd.name);
  const isDismissedAtNonStrikerEnd = playerAtNonStrikerEnd && (dismissedIdOrName === playerAtNonStrikerEnd.id || dismissedIdOrName === playerAtNonStrikerEnd.name);

  // Return the new occupants of each end (null means vacated)
  return {
    newStriker: isDismissedAtStrikerEnd ? null : playerAtStrikerEnd,
    newNonStriker: isDismissedAtNonStrikerEnd ? null : playerAtNonStrikerEnd
  };
}
export function processDelivery(currentState, ballInput) {
  console.log(`[ScoringFlow:Engine] Processing delivery intent...`, { input: ballInput });
  // Normalize to canonical contract
  const ball = normalizeDelivery({
    ...ballInput,
    isFreeHit: currentState.isFreeHit || false,
  });
  console.log(`[ScoringFlow:Engine] Normalized canonical delivery:`, ball);

  // Verify MCC Laws for Free Hit
  if (ball.isFreeHit && ball.wicketType !== 'NONE' && !['RUN_OUT', 'OBSTRUCTING_FIELD', 'RETIRED_OUT'].includes(ball.wicketType)) {
    return { success: false, error: `Cannot be dismissed '${ball.wicketType}' on a Free Hit. Only Run Out / Obstructing Field is allowed.` };
  }

  // Wides cannot have certain dismissals
  if (ball.extraType === 'WIDE' && ball.wicketType !== 'NONE') {
    if (['BOWLED', 'LBW', 'CAUGHT'].includes(ball.wicketType)) {
      return { success: false, error: `Cannot be dismissed '${ball.wicketType}' on a Wide.` };
    }
  }

  if (ball.wicketType === 'RUN_OUT') {
    const dismissedIdOrName = ball.dismissedPlayerId || ball.dismissedPlayerName;
    if (!dismissedIdOrName) {
      return { success: false, error: 'Run Out requires a dismissed player.' };
    }
    
    const isStrikerOut = dismissedIdOrName === currentState.striker.id || dismissedIdOrName === currentState.striker.name;
    const isNonStrikerOut = dismissedIdOrName === currentState.nonStriker.id || dismissedIdOrName === currentState.nonStriker.name;
    
    if (!isStrikerOut && !isNonStrikerOut) {
      return { success: false, error: 'Run Out dismissed player must be either the striker or non-striker.' };
    }
  }

  if (ball.runsBatter < 0 || ball.runsExtras < 0 || ball.runsCompleted < 0) {
    return { success: false, error: 'Runs cannot be negative.' };
  }
  if (ball.runsTotal !== ball.runsBatter + ball.runsExtras) {
    return { success: false, error: 'Total runs do not match bat runs + extras.' };
  }
  
  if (ball.extraType === 'NO_BALL' && ball.isLegalDelivery) {
    return { success: false, error: 'A No-Ball cannot be a legal delivery.' };
  }

  if (ball.extraType === 'WIDE') {
    if (ball.isLegalDelivery) {
      return { success: false, error: 'A Wide cannot be a legal delivery.' };
    }
    if (ball.runsBatter > 0) {
      return { success: false, error: 'A Wide cannot have batter runs.' };
    }
    if (ball.runsExtras < 1) {
      return { success: false, error: 'A Wide must have at least 1 extra run.' };
    }
  }

  if (ball.extraType === 'BYE' || ball.extraType === 'LEG_BYE') {
    if (!ball.isLegalDelivery) {
      return { success: false, error: 'A pure Bye or Leg-Bye must be a legal delivery.' };
    }
    if (ball.runsBatter > 0) {
      return { success: false, error: 'A pure Bye or Leg-Bye cannot have batter runs.' };
    }
    if (ball.runsExtras < 1) {
      return { success: false, error: 'A pure Bye or Leg-Bye must have at least 1 extra run.' };
    }
  }
  
  // Base validations
  if (!currentState.striker?.id || !currentState.nonStriker?.id || !currentState.currentBowler?.id) {
    return { success: false, error: 'Missing active batter or bowler.' };
  }

  const sId = currentState.striker.id;
  const nsId = currentState.nonStriker.id;
  const bId = currentState.currentBowler.id;

  if (sId === bId || nsId === bId) {
    return { success: false, error: 'A player cannot be both a batter and the bowler simultaneously.' };
  }
  if (sId === nsId) {
    return { success: false, error: 'The striker and non-striker cannot be the same player.' };
  }

  // Authoritative XI Validation
  if (currentState.battingTeamXI && Array.isArray(currentState.battingTeamXI)) {
    const isStrikerInXI = currentState.battingTeamXI.some(p => p.id === sId);
    if (!isStrikerInXI) return { success: false, error: 'Striker is not in the batting playing XI.' };
    
    const isNonStrikerInXI = currentState.battingTeamXI.some(p => p.id === nsId);
    if (!isNonStrikerInXI) return { success: false, error: 'Non-striker is not in the batting playing XI.' };
  }

  if (currentState.bowlingTeamXI && Array.isArray(currentState.bowlingTeamXI)) {
    const isBowlerInXI = currentState.bowlingTeamXI.some(p => p.id === bId);
    if (!isBowlerInXI) return { success: false, error: 'Bowler is not in the bowling playing XI.' };
  }

  const isWide = ball.extraType === 'WIDE';
  const isNoBall = ball.extraType === 'NO_BALL';
  const isLegByeOrBye = ball.extraType === 'LEG_BYE' || ball.extraType === 'BYE';
  const isLegalDelivery = ball.isLegalDelivery;

  // Clone current state for deterministic update
  const state = {
    runs: currentState.runs,
    wickets: currentState.wickets,
    balls: currentState.balls,
    currentOverBalls: [...currentState.currentOverBalls],
    striker: { ...currentState.striker },
    nonStriker: { ...currentState.nonStriker },
    currentBowler: { ...currentState.currentBowler },
    extras: { ...currentState.extras },
    isFreeHit: currentState.isFreeHit || false,
    innings: currentState.innings || 1,
    totalMatchOvers: currentState.totalMatchOvers || 20,
    target: currentState.target || null,
    scorecard: {
      ...currentState.scorecard,
      fallOfWickets: [...(currentState.scorecard?.fallOfWickets || [])],
    },
    matchStatus: MATCH_STATES.IN_PROGRESS,
    lastOverBowlerId: currentState.lastOverBowlerId || null,
  };

  // 2. Compute Runs & Extras
  let runsThisBall = 0;
  let runsOffBat = 0;
  let extraRunsAdded = 0;

  runsThisBall = ball.runsTotal || 0;
  runsOffBat = ball.runsBatter || 0;
  extraRunsAdded = ball.runsExtras || 0;

  if (ball.extraType !== 'NONE') {
    if (isWide) {
      state.extras.wides = (state.extras.wides || 0) + extraRunsAdded;
    } else if (isNoBall) {
      state.extras.noBalls = (state.extras.noBalls || 0) + extraRunsAdded;
    } else if (isLegByeOrBye) {
      if (ball.extraType === 'BYE') {
        state.extras.byes = (state.extras.byes || 0) + extraRunsAdded;
      } else {
        state.extras.legByes = (state.extras.legByes || 0) + extraRunsAdded;
      }
    }
  }

  // Update total team runs
  state.runs += runsThisBall;

  // 3. Update Bowler Stats
  const bowlerRunsConceded = isLegByeOrBye ? 0 : runsThisBall;
  state.currentBowler.runs = (state.currentBowler.runs || 0) + bowlerRunsConceded;

  if (isLegalDelivery) {
    state.balls += 1;
    // Bowler overs in X.Y format
    const bowlerLegalBalls = Math.round(((state.currentBowler.ballsBowled || 0) + 1));
    state.currentBowler.ballsBowled = bowlerLegalBalls;
    const fullBowlerOvers = Math.floor(bowlerLegalBalls / 6);
    const remBowlerBalls = bowlerLegalBalls % 6;
    state.currentBowler.overs = Number(`${fullBowlerOvers}.${remBowlerBalls}`);
  }

  const bowlerTotalOversFloat = (state.currentBowler.ballsBowled || 1) / 6;
  state.currentBowler.economy = (state.currentBowler.runs / bowlerTotalOversFloat).toFixed(2);

  // 4. Update Striker / Batter Stats
  if (runsOffBat > 0 || isLegalDelivery || isNoBall) {
    state.striker.runs += runsOffBat;
    if (isLegalDelivery || isNoBall) {
      state.striker.balls += 1;
    }
    if (runsOffBat === 4) state.striker.fours += 1;
    if (runsOffBat === 6) state.striker.sixes += 1;
    state.striker.strikeRate = state.striker.balls > 0
      ? ((state.striker.runs / state.striker.balls) * 100).toFixed(1)
      : '0.0';
  }

  // 5. Strike Rotation & Wicket Handling
  let wasWicket = false;
  
  if (ball.wicketType !== 'NONE') {
    wasWicket = true;
    state.wickets += 1;

    const isBowlerWicket = !['RUN_OUT', 'OBSTRUCTING_FIELD', 'RETIRED_OUT'].includes(ball.wicketType);
    if (isBowlerWicket) {
      state.currentBowler.wickets = (state.currentBowler.wickets || 0) + 1;
    }

    const dismissedIdOrName = ball.dismissedPlayerId || ball.dismissedPlayerName;

    // Add Fall of Wicket (FOW)
    state.scorecard.fallOfWickets.push({
      wicketNumber: state.wickets,
      score: state.runs,
      player: dismissedIdOrName || 'Unknown',
      over: `${formatOvers(state.balls)} ov`,
      dismissalType: ball.wicketType,
    });

    // Pure resolution of ends based on crossings and dismissal
    const { newStriker, newNonStriker } = resolveWicketTransition(
      state.striker, 
      state.nonStriker, 
      dismissedIdOrName, 
      ball.runsCompleted
    );

    state.striker = newStriker;
    state.nonStriker = newNonStriker;

  } else {
    // No wicket, just physical crossings
    if (ball.runsCompleted % 2 !== 0) {
      const temp = state.striker;
      state.striker = state.nonStriker;
      state.nonStriker = temp;
    }
  }

  // 7. Over Pill Visual Labels
  let overPill = { type: ball.wicketType !== 'NONE' ? 'wicket' : ball.extraType !== 'NONE' ? 'extra' : 'run', label: `${runsThisBall}`, runs: runsThisBall };
  if (ball.wicketType !== 'NONE') {
    overPill = { type: 'wicket', label: 'W', dismissalType: ball.wicketType, player: ball.dismissedPlayerName || ball.dismissedPlayerId };
  } else if (isWide) {
    overPill = { type: 'extra', label: ball.runsExtras > 1 ? `${ball.runsExtras}Wd` : 'Wd', isWide: true };
  } else if (isNoBall) {
    overPill = { type: 'extra', label: ball.runsExtras > 1 ? `${ball.runsExtras}Nb` : 'Nb', isNoBall: true };
  } else if (isLegByeOrBye) {
    overPill = { type: 'extra', label: `${runsThisBall}${ball.extraType === 'BYE' ? 'B' : 'Lb'}` };
  }
  state.currentOverBalls.push(overPill);

  // 8. Free Hit State Update
  if (isNoBall) {
    state.isFreeHit = true;
  } else if (isLegalDelivery && state.isFreeHit) {
    state.isFreeHit = false; // Consumed free hit on legal ball
  }

  // 9. Check Over Completion
  const isOverEnd = isLegalDelivery && state.balls > 0 && state.balls % 6 === 0;
  if (isOverEnd) {
    // Change ends at over completion
    const temp = state.striker;
    state.striker = state.nonStriker;
    state.nonStriker = temp;
    state.lastOverBowlerId = state.currentBowler.id;
    state.matchStatus = MATCH_STATES.OVER_COMPLETE;
  }

  // 10. Check Innings & Match Termination Conditions
  const isSuperOver = state.innings === 3 || state.innings === 4;
  const maxLegalBalls = isSuperOver ? 6 : (state.totalMatchOvers * 6);
  const maxWickets = isSuperOver ? 2 : 10;
  const isAllOut = state.wickets >= maxWickets;
  const isOversFinished = state.balls >= maxLegalBalls;

  if (state.innings === 1 || state.innings === 3) {
    if (isAllOut || isOversFinished) {
      state.matchStatus = MATCH_STATES.INNINGS_BREAK;
    }
  } else if (state.innings === 2 || state.innings === 4) {
    const isTargetChased = state.target && state.runs >= state.target;
    if (isTargetChased || isAllOut || isOversFinished) {
      state.matchStatus = MATCH_STATES.MATCH_FINISHED;
    }
  }

  return { success: true, newState: state };
}

export function processPenaltyEvent(currentState, penaltyEvent) {
  // Validate penalty event
  if (penaltyEvent.eventType !== 'PENALTY') {
    return { success: false, error: 'Not a penalty event.' };
  }
  if (!penaltyEvent.penaltyRuns || penaltyEvent.penaltyRuns <= 0) {
    return { success: false, error: 'Penalty runs must be greater than zero.' };
  }
  if (!penaltyEvent.recipientTeamId) {
    return { success: false, error: 'Missing recipient team ID.' };
  }

  // Clone current state deterministically
  const state = {
    runs: currentState.runs,
    wickets: currentState.wickets,
    balls: currentState.balls,
    currentOverBalls: [...currentState.currentOverBalls],
    striker: { ...currentState.striker },
    nonStriker: { ...currentState.nonStriker },
    currentBowler: { ...currentState.currentBowler },
    extras: { ...currentState.extras },
    isFreeHit: currentState.isFreeHit || false,
    innings: currentState.innings || 1,
    totalMatchOvers: currentState.totalMatchOvers || 20,
    target: currentState.target || null,
    scorecard: {
      ...currentState.scorecard,
      fallOfWickets: [...(currentState.scorecard?.fallOfWickets || [])],
    },
    matchStatus: currentState.matchStatus || MATCH_STATES.IN_PROGRESS,
    lastOverBowlerId: currentState.lastOverBowlerId || null,
    battingTeamId: currentState.battingTeamId || null,
    pendingPenalties: { ...(currentState.pendingPenalties || {}) }
  };

  const isBattingTeamRecipient = state.battingTeamId && state.battingTeamId === penaltyEvent.recipientTeamId;

  if (isBattingTeamRecipient) {
    state.runs += penaltyEvent.penaltyRuns;
    state.extras.penalty = (state.extras.penalty || 0) + penaltyEvent.penaltyRuns;
    
    // Check if target is chased
    if (state.innings === 2 || state.innings === 4) {
      if (state.target && state.runs >= state.target) {
        state.matchStatus = MATCH_STATES.MATCH_FINISHED;
      }
    }
  } else {
    // A penalty awarded to a team currently NOT batting (or unknown)
    // We add it to a pending field per team that can be applied to their innings externally.
    const currentPending = state.pendingPenalties[penaltyEvent.recipientTeamId] || 0;
    state.pendingPenalties[penaltyEvent.recipientTeamId] = currentPending + penaltyEvent.penaltyRuns;
  }

  return { success: true, newState: state };
}
