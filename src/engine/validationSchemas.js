import { z } from 'zod';

// Allowed dismissal types under MCC Laws
export const DISMISSAL_TYPES = [
  'Bowled',
  'Caught',
  'LBW',
  'Run Out',
  'Stumped',
  'Hit Wicket',
  'Obstructing Field',
  'Retired Out',
  'Other'
];

// Dismissals allowed during a Free Hit or No-Ball (Law 21.18)
export const FREE_HIT_ALLOWED_DISMISSALS = [
  'Run Out',
  'Obstructing Field',
  'Retired Out'
];

/**
 * Zod schema for individual ball delivery events
 */
export const BallEventSchema = z.object({
  type: z.enum(['run', 'extra', 'wicket']),
  runs: z.number().int().min(0).max(6).default(0),
  extraType: z.enum(['wide', 'no_ball', 'bye', 'leg_bye', 'penalty']).nullable().optional(),
  extraRuns: z.number().int().min(0).max(6).default(0),
  isFreeHit: z.boolean().default(false),
  dismissalType: z.enum(DISMISSAL_TYPES).nullable().optional(),
  outPlayerName: z.string().optional(),
  fielderName: z.string().optional(),
  wicketkeeperName: z.string().optional(),
  wagonZone: z.string().optional(),
  pitchCoord: z.object({ x: z.number(), y: z.number() }).optional(),
}).superRefine((data, ctx) => {
  // Free Hit / No-Ball Dismissal Rule enforcement (MCC Law 21.18)
  if (data.isFreeHit && data.type === 'wicket' && data.dismissalType) {
    if (!FREE_HIT_ALLOWED_DISMISSALS.includes(data.dismissalType)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `Cannot be dismissed '${data.dismissalType}' on a Free Hit. Only Run Out / Obstructing Field is allowed.`,
        path: ['dismissalType'],
      });
    }
  }

  // Wides cannot have Bowled, LBW, Caught dismissals
  if (data.extraType === 'wide' && data.type === 'wicket' && data.dismissalType) {
    if (['Bowled', 'LBW', 'Caught'].includes(data.dismissalType)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `Cannot be dismissed '${data.dismissalType}' on a Wide.`,
        path: ['dismissalType'],
      });
    }
  }
});

/**
 * Zod schema for Player Registration
 */
export const PlayerRegistrationSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, { message: 'Player name must be at least 2 characters' })
    .max(50, { message: 'Player name cannot exceed 50 characters' }),
  role: z.enum(['Batter', 'Bowler', 'All-Rounder', 'Wicket Keeper'], {
    errorMap: () => ({ message: 'Please select a valid role' }),
  }),
  battingStyle: z.enum(['Right-Hand Bat', 'Left-Hand Bat'], {
    errorMap: () => ({ message: 'Please select a batting style' }),
  }),
  bowlingStyle: z.string().min(2, { message: 'Bowling style is required' }),
  district: z.string().min(2, { message: 'District name is required' }),
  category: z.string().min(2),
  gender: z.enum(['Men', 'Women']),
  dob: z.string().refine((date) => {
    return new Date(date).getTime() > 0;
  }, { message: 'Invalid Date of Birth' }),
  avatar: z.string().url().or(z.string().min(1)),
});

/**
 * Zod schema for Match Setup configuration
 */
export const MatchSetupSchema = z.object({
  teamA: z.string().trim().min(2, { message: 'Team A name is required (min 2 chars)' }),
  teamB: z.string().trim().min(2, { message: 'Team B name is required (min 2 chars)' }),
  teamAShort: z.string().trim().max(4).optional(),
  teamBShort: z.string().trim().max(4).optional(),
  totalOvers: z.number().int().min(1, { message: 'Overs must be at least 1' }).max(50, { message: 'Overs cannot exceed 50' }),
  tossWinner: z.string().min(1, { message: 'Please select toss winner' }),
  electedTo: z.enum(['Bat', 'Bowl'], { message: 'Please select toss decision' }),
  pitchType: z.string().optional(),
  venue: z.string().optional(),
});
