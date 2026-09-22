import { BallEventSchema, FREE_HIT_ALLOWED_DISMISSALS } from './validationSchemas';

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
export function processDelivery(currentState, ballInput) {
  // 1. Zod Validation
  const validation = BallEventSchema.safeParse({
    ...ballInput,
    isFreeHit: currentState.isFreeHit || false,
  });

  if (!validation.success) {
    const firstError = validation.error.errors[0]?.message || 'Invalid delivery data';
    return { success: false, error: firstError };
  }

  const ball = validation.data;
  const isWide = ball.extraType === 'wide';
  const isNoBall = ball.extraType === 'no_ball';
  const isLegByeOrBye = ball.extraType === 'leg_bye' || ball.extraType === 'bye';
  const isLegalDelivery = !isWide && !isNoBall;

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

  if (ball.type === 'run') {
    runsOffBat = ball.runs;
    runsThisBall = ball.runs;
  } else if (ball.type === 'extra') {
    if (isWide) {
      extraRunsAdded = 1 + ball.extraRuns;
      state.extras.wides = (state.extras.wides || 0) + extraRunsAdded;
      runsThisBall = extraRunsAdded;
    } else if (isNoBall) {
      extraRunsAdded = 1 + ball.extraRuns;
      state.extras.noBalls = (state.extras.noBalls || 0) + extraRunsAdded;
      runsThisBall = extraRunsAdded;
    } else if (isLegByeOrBye) {
      extraRunsAdded = ball.extraRuns || 1;
      if (ball.extraType === 'bye') {
        state.extras.byes = (state.extras.byes || 0) + extraRunsAdded;
      } else {
        state.extras.legByes = (state.extras.legByes || 0) + extraRunsAdded;
      }
      runsThisBall = extraRunsAdded;
    }
  } else if (ball.type === 'wicket') {
    runsThisBall = ball.runs || 0;
    runsOffBat = ball.runs || 0;
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

  // 5. Handle Wicket / Dismissal
  let wasWicket = false;
  if (ball.type === 'wicket') {
    wasWicket = true;
    state.wickets += 1;

    const isBowlerWicket = !['Run Out', 'Obstructing Field', 'Retired Out'].includes(ball.dismissalType);
    if (isBowlerWicket) {
      state.currentBowler.wickets = (state.currentBowler.wickets || 0) + 1;
    }

    // Add Fall of Wicket (FOW)
    state.scorecard.fallOfWickets.push({
      wicketNumber: state.wickets,
      score: state.runs,
      player: ball.outPlayerName || state.striker.name,
      over: `${formatOvers(state.balls)} ov`,
      dismissalType: ball.dismissalType || 'Caught',
    });

    // Handle outgoing batter by setting them to a placeholder so the UI forces selection
    const placeholderBatter = {
      id: null,
      name: '',
      runs: 0,
      balls: 0,
      fours: 0,
      sixes: 0,
      strikeRate: '0.0'
    };

    if (ball.outPlayerName === state.striker.name) {
      state.striker = placeholderBatter;
    } else {
      state.nonStriker = placeholderBatter;
    }
  }

  // 6. Over Pill Visual Labels
  let overPill = { type: ball.type, label: `${runsThisBall}`, runs: runsThisBall };
  if (ball.type === 'wicket') {
    overPill = { type: 'wicket', label: 'W', dismissalType: ball.dismissalType, player: ball.outPlayerName };
  } else if (isWide) {
    overPill = { type: 'extra', label: ball.extraRuns > 0 ? `${ball.extraRuns + 1}Wd` : 'Wd', isWide: true };
  } else if (isNoBall) {
    overPill = { type: 'extra', label: ball.extraRuns > 0 ? `${ball.extraRuns + 1}Nb` : 'Nb', isNoBall: true };
  } else if (isLegByeOrBye) {
    overPill = { type: 'extra', label: `${runsThisBall}${ball.extraType === 'bye' ? 'B' : 'Lb'}` };
  }
  state.currentOverBalls.push(overPill);

  // 7. Strike Rotation (Odd Runs)
  const runsExchanged = runsOffBat + (isLegByeOrBye ? runsThisBall : 0) + (isWide || isNoBall ? ball.extraRuns : 0);
  if (runsExchanged % 2 !== 0 && !wasWicket) {
    const temp = state.striker;
    state.striker = state.nonStriker;
    state.nonStriker = temp;
  }

  // 8. Free Hit State Update
  if (isNoBall) {
    state.isFreeHit = true;
  } else if (isLegalDelivery && state.isFreeHit) {
    state.isFreeHit = false; // Consumed free hit on legal ball
  }

  // 9. Check Over Completion
  const isOverEnd = isLegalDelivery && state.balls > 0 && state.balls % 6 === 0;
  if (isOverEnd) {
    state.currentOverBalls = [];
    // Change ends at over completion
    const temp = state.striker;
    state.striker = state.nonStriker;
    state.nonStriker = temp;
    state.lastOverBowlerId = state.currentBowler.id;
    state.matchStatus = MATCH_STATES.OVER_COMPLETE;
  }

  // 10. Check Innings & Match Termination Conditions
  const maxLegalBalls = state.totalMatchOvers * 6;
  const isAllOut = state.wickets >= 10;
  const isOversFinished = state.balls >= maxLegalBalls;

  if (state.innings === 1) {
    if (isAllOut || isOversFinished) {
      state.matchStatus = MATCH_STATES.INNINGS_BREAK;
    }
  } else if (state.innings === 2) {
    const isTargetChased = state.target && state.runs >= state.target;
    const isAllOut = state.wickets >= 10;
    const isOversFinished = state.balls >= (state.totalMatchOvers * 6);
    
    if (isTargetChased || isAllOut || isOversFinished) {
      state.matchStatus = MATCH_STATES.MATCH_FINISHED;
    }
  }

  return { success: true, newState: state };
}
