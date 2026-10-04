/**
 * deliveryContract.js
 * 
 * Establishes the single canonical delivery/event contract for JDCA Scoring.
 * Used by: UI, state-machine, deliveryLog, derivedScorecard, SyncService.
 */

import { z } from 'zod';

const isUUID = (id) => typeof id === 'string' && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);

export const CanonicalDeliverySchema = z.object({
  // Identifiers
  id: z.string().min(1), // idempotency_key
  matchId: z.string().nullable().optional(),
  inningsId: z.string().nullable().optional(),
  deliverySequence: z.number().int().min(1).optional(),
  
  // Temporal
  timestamp: z.string().optional(),
  
  // Over Context
  overNumber: z.number().int().min(0).default(0), // Full overs completed before this ball
  ballNumber: z.number().int().min(1).max(10).default(1), // Ball in current over (1-indexed)
  
  // Players (Strict UUIDs)
  strikerId: z.string().nullable().optional(),
  nonStrikerId: z.string().nullable().optional(),
  bowlerId: z.string().nullable().optional(),
  
  // Runs
  runsBatter: z.number().int().min(0).default(0), // runs_off_bat
  runsExtras: z.number().int().min(0).default(0), // runs_extras
  runsTotal: z.number().int().min(0).default(0),  // runs_total
  runsCompleted: z.number().int().min(0).default(0), // physical crossings
  isBoundary: z.boolean().default(false), // explicit boundary allowance flag

  // Events
  extraType: z.enum(['NONE', 'WIDE', 'NO_BALL', 'BYE', 'LEG_BYE']).default('NONE'),
  wicketType: z.enum([
    'NONE', 'BOWLED', 'CAUGHT', 'LBW', 'RUN_OUT', 'STUMPED', 
    'HIT_WICKET', 'OBSTRUCTING_FIELD', 'RETIRED_HURT', 'RETIRED_OUT', 
    'TIMED_OUT', 'CAUGHT_BEHIND', 'OTHER'
  ]).default('NONE'),
  
  // Dismissal Details (Strict UUIDs)
  dismissedPlayerId: z.string().nullable().optional(),
  fielderId: z.string().nullable().optional(),
  wicketkeeperId: z.string().nullable().optional(),
  
  // Metadata
  wagonZone: z.string().nullable().optional(),
  
  isLegalDelivery: z.boolean().default(true),

  // UI Compatibility fields (Do not sync to DB)
  dismissedPlayerName: z.string().nullable().optional(),
  fielderName: z.string().nullable().optional(),
  wicketkeeperName: z.string().nullable().optional(),
});

export function normalizeDelivery(event) {
  if (!event) return event;

  // 1. Extra Type Normalization
  let extraType = 'NONE';
  if (event.extraType && event.extraType !== 'NONE') {
    const eMap = {
      'wide': 'WIDE', 'no_ball': 'NO_BALL', 'bye': 'BYE', 'leg_bye': 'LEG_BYE'
    };
    extraType = eMap[event.extraType.toLowerCase()] || event.extraType.toUpperCase();
  } else if (event.extra_type && event.extra_type !== 'NONE') {
    extraType = event.extra_type.toUpperCase();
  } else if (event.type === 'extra') {
    extraType = 'OTHER';
  }

  // 2. Wicket Type Normalization
  let wicketType = 'NONE';
  if (event.wicketType && event.wicketType !== 'NONE') {
    wicketType = event.wicketType.toUpperCase();
  } else if (event.wicket_type && event.wicket_type !== 'NONE') {
    wicketType = event.wicket_type.toUpperCase();
  } else if (event.wicket || event.type === 'wicket' || event.type === 'retire') {
    const wMap = {
      'Bowled': 'BOWLED', 'Caught': 'CAUGHT', 'LBW': 'LBW', 'Run Out': 'RUN_OUT',
      'Stumped': 'STUMPED', 'Hit Wicket': 'HIT_WICKET', 'Retired Hurt': 'RETIRED_HURT',
      'Retired Out': 'RETIRED_OUT', 'Obstructing Field': 'OBSTRUCTING_FIELD', 'Caught Behind': 'CAUGHT_BEHIND',
      'Obstructing The Field': 'OBSTRUCTING_THE_FIELD'
    };
    wicketType = event.dismissalType ? (wMap[event.dismissalType] || 'OTHER') : 'BOWLED'; 
  }

  // 3. Runs Normalization
  let runsBatter = Number(event.runsBatter ?? event.runs_off_bat ?? event.runsOffBat ?? 0) || 0;
  if (event.type === 'run') runsBatter = Number(event.runs) || runsBatter;
  
  const runsExtras = Number(event.runsExtras ?? event.runs_extras ?? event.extraRuns ?? (event.type === 'extra' ? event.runs : 0)) || 0;
  
  let runsTotal = Number(event.runsTotal ?? event.runs_total ?? event.totalRuns) || 0;
  if (runsTotal === 0 && (runsBatter > 0 || runsExtras > 0)) {
    runsTotal = runsBatter + runsExtras;
  }

  let runsCompleted = event.runsCompleted !== undefined ? Number(event.runsCompleted) : 0;
  if (event.runsCompleted === undefined && !event.isBoundary && wicketType === 'NONE' && extraType === 'NONE') {
    // Only infer for pure bat runs backwards compatibility if needed
    runsCompleted = runsBatter;
  }

  // 4. Over/Ball Calculation
  let overNumber = event.overNumber ?? event.over_number ?? 0;
  let ballNumber = event.ballNumber ?? event.ball_number ?? 1;
  if (event.balls !== undefined && event.overNumber === undefined && event.over_number === undefined) {
    overNumber = Math.floor(event.balls / 6);
    ballNumber = (event.balls % 6) + 1;
  }

  // 5. Dismissed Player logic
  let rawOut = event.dismissedPlayerId ?? event.dismissed_player_id ?? event.outPlayerId ?? event.outPlayerName;
  let dismissedPlayerId = null;
  let dismissedPlayerName = event.dismissedPlayerName || null;

  if (rawOut) {
    if (isUUID(rawOut)) {
      dismissedPlayerId = rawOut;
    } else {
      dismissedPlayerName = rawOut;
    }
  }

  let rawFielder = event.fielderId ?? event.fielder_id ?? event.fielderName;
  let fielderId = null;
  let fielderName = event.fielderName || null;
  if (rawFielder) {
    if (isUUID(rawFielder)) fielderId = rawFielder;
    else fielderName = rawFielder;
  }

  let rawWk = event.wicketkeeperId ?? event.wicketkeeper_id ?? event.wicketkeeperName;
  let wicketkeeperId = null;
  let wicketkeeperName = event.wicketkeeperName || null;
  if (rawWk) {
    if (isUUID(rawWk)) wicketkeeperId = rawWk;
    else wicketkeeperName = rawWk;
  }

  const isLegalDelivery = event.isLegalDelivery !== undefined ? event.isLegalDelivery : !['WIDE', 'NO_BALL'].includes(extraType);

  const normalized = {
    id: event.idempotency_key ?? event.id ?? `delivery-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    timestamp: event.timestamp || new Date().toISOString(),
    matchId: event.matchId ?? event.match_id ?? null,
    inningsId: event.inningsId ?? event.innings_id ?? null,
    deliverySequence: event.deliverySequence ?? event.delivery_sequence ?? undefined,
    overNumber,
    ballNumber,
    
    strikerId: event.strikerId ?? event.striker_id ?? null,
    nonStrikerId: event.nonStrikerId ?? event.non_striker_id ?? null,
    bowlerId: event.bowlerId ?? event.bowler_id ?? null,

    runsBatter,
    runsExtras,
    runsTotal,
    runsCompleted,
    isBoundary: !!event.isBoundary,
    
    extraType,
    wicketType,

    dismissedPlayerId,
    fielderId,
    wicketkeeperId,
    wagonZone: event.wagonZone ?? event.wagon_zone ?? null,

    isLegalDelivery,

    // UI-only compat fields
    dismissedPlayerName,
    fielderName,
    wicketkeeperName,
  };

  try {
    return CanonicalDeliverySchema.parse(normalized);
  } catch (e) {
    console.warn('[normalizeDelivery] Schema mismatch, returning normalized object anyway:', e);
    return normalized;
  }
}

export const CanonicalPenaltyEventSchema = z.object({
  id: z.string().min(1),
  eventType: z.literal('PENALTY'),
  matchId: z.string().nullable().optional(),
  inningsId: z.string().nullable().optional(),
  recipientTeamId: z.string().min(1),
  penaltyRuns: z.number().int().min(1),
  timestamp: z.string().optional(),
  reasonCode: z.string().optional(),
});

export function normalizePenaltyEvent(event) {
  const normalized = {
    id: event.id ?? event.idempotency_key ?? `penalty-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    eventType: 'PENALTY',
    matchId: event.matchId ?? event.match_id ?? null,
    inningsId: event.inningsId ?? event.innings_id ?? null,
    recipientTeamId: event.recipientTeamId ?? event.recipient_team_id,
    penaltyRuns: Number(event.penaltyRuns) || 5,
    timestamp: event.timestamp || new Date().toISOString(),
    reasonCode: event.reasonCode || '',
  };

  try {
    return CanonicalPenaltyEventSchema.parse(normalized);
  } catch (e) {
    console.warn('[normalizePenaltyEvent] Schema mismatch:', e);
    return normalized;
  }
}
