// VJD (Vijay Jayadevan) Method — resource-based target revision
// Used in Indian domestic cricket for rain-interrupted limited-overs matches.
//
// Resources represent the scoring potential remaining at any point in an
// innings, expressed as a percentage of a full innings (10 wickets, all overs).
// The table below is indexed by [oversRemaining][wicketsInHand] and holds the
// resource percentage available from that point onward.

// ── 50-over resource table ────────────────────────────────────────────────────
// Rows: overs remaining (0 → 50 in steps of 5)
// Cols: wickets in hand (1 → 10)
const TABLE_50 = [
  //  1     2     3     4     5     6     7     8     9    10   ← wickets in hand
  [  0.0,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0], //  0 overs left
  [  2.6,  5.6,  8.5, 10.8, 12.4, 13.4, 14.0, 14.5, 14.8, 14.9], //  5
  [  3.2,  7.3, 12.1, 16.6, 20.1, 22.5, 24.2, 25.3, 26.1, 26.5], // 10
  [  3.5,  8.4, 14.3, 20.5, 25.8, 29.8, 32.6, 34.6, 36.0, 36.8], // 15
  [  3.8,  9.2, 16.0, 23.7, 30.7, 36.2, 40.3, 43.2, 45.4, 46.7], // 20
  [  4.0,  9.9, 17.5, 26.4, 35.0, 42.2, 47.7, 51.7, 54.7, 56.6], // 25
  [  4.2, 10.4, 18.8, 28.8, 38.8, 47.6, 54.7, 59.9, 63.9, 66.5], // 30
  [  4.4, 10.9, 19.8, 30.8, 42.1, 52.4, 60.9, 67.5, 72.6, 76.1], // 35
  [  4.5, 11.3, 20.7, 32.5, 44.9, 56.5, 66.4, 74.3, 80.5, 85.1], // 40
  [  4.6, 11.6, 21.4, 33.8, 47.2, 59.9, 71.1, 80.2, 87.5, 93.2], // 45
  [  4.7, 11.9, 22.0, 34.9, 49.0, 62.7, 74.9, 85.1, 93.4,100.0], // 50
];
const ROWS_50 = [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50];

// ── 20-over (T20) resource table ──────────────────────────────────────────────
const TABLE_20 = [
  [  0.0,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0,  0.0], //  0
  [  2.2,  4.6,  6.9,  8.8, 10.1, 10.8, 11.3, 11.7, 11.9, 12.0], //  2
  [  3.0,  6.7, 10.9, 14.8, 17.8, 19.8, 21.1, 22.0, 22.7, 23.0], //  4
  [  3.4,  8.1, 13.6, 19.3, 24.1, 27.6, 30.0, 31.8, 33.0, 33.7], //  6
  [  3.7,  9.0, 15.5, 22.7, 29.3, 34.4, 38.1, 40.8, 42.8, 44.0], //  8
  [  3.9,  9.7, 17.1, 25.6, 33.8, 40.6, 45.7, 49.6, 52.5, 54.2], // 10
  [  4.1, 10.3, 18.5, 28.2, 37.8, 46.2, 52.9, 57.9, 61.7, 64.3], // 12
  [  4.3, 10.8, 19.6, 30.4, 41.3, 51.4, 59.6, 65.9, 70.7, 74.1], // 14
  [  4.5, 11.2, 20.5, 32.1, 44.3, 55.6, 65.3, 73.1, 79.0, 83.5], // 16
  [  4.6, 11.5, 21.3, 33.6, 46.8, 59.3, 70.4, 79.5, 86.6, 92.2], // 18
  [  4.7, 11.9, 22.0, 34.9, 49.0, 62.7, 74.9, 85.1, 93.4,100.0], // 20
];
const ROWS_20 = [0, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20];

function lerp(a, b, t) {
  return a + (b - a) * t;
}

function bilinearLookup(table, rowKeys, oversRemaining, wicketsInHand) {
  const wIdx = Math.max(0, Math.min(wicketsInHand, 10)) - 1;
  if (wIdx < 0) return 0;

  const capped = Math.max(0, Math.min(oversRemaining, rowKeys[rowKeys.length - 1]));

  let lo = 0;
  for (let i = 0; i < rowKeys.length - 1; i++) {
    if (rowKeys[i + 1] >= capped) { lo = i; break; }
  }
  const hi = Math.min(lo + 1, rowKeys.length - 1);
  const t = rowKeys[hi] === rowKeys[lo] ? 0 : (capped - rowKeys[lo]) / (rowKeys[hi] - rowKeys[lo]);

  if (Number.isInteger(wicketsInHand)) {
    return lerp(table[lo][wIdx], table[hi][wIdx], t);
  }
  const wLo = Math.floor(wicketsInHand) - 1;
  const wHi = Math.ceil(wicketsInHand) - 1;
  const wt = wicketsInHand - Math.floor(wicketsInHand);
  const vLo = lerp(table[lo][wLo], table[hi][wLo], t);
  const vHi = lerp(table[lo][wHi], table[hi][wHi], t);
  return lerp(vLo, vHi, wt);
}

export function getResourcePct(oversRemaining, wicketsInHand, maxOvers) {
  if (maxOvers <= 20) return bilinearLookup(TABLE_20, ROWS_20, oversRemaining, wicketsInHand);
  return bilinearLookup(TABLE_50, ROWS_50, oversRemaining, wicketsInHand);
}

// ── Public API ────────────────────────────────────────────────────────────────

/**
 * Calculate revised target when Team 2's innings is shortened.
 *
 * @param {number} team1Score       Runs scored by Team 1
 * @param {number} team1OversUsed   Overs faced by Team 1 (e.g. 20)
 * @param {number} team1Wickets     Wickets lost by Team 1
 * @param {number} team2OversAvail  Revised overs available for Team 2
 * @param {number} team2WicketsInHand Wickets in hand for Team 2 at start (usually 10)
 * @param {number} maxOvers         Original max overs for the match
 * @returns {{ revisedTarget: number, parScore: number, r1: number, r2: number }}
 */
export function calculateRevisedTarget(
  team1Score,
  team1OversUsed,
  team1Wickets,
  team2OversAvail,
  team2WicketsInHand,
  maxOvers
) {
  const team1OversRem = Math.max(0, maxOvers - team1OversUsed);
  const team1WktsHand = 10 - team1Wickets;

  const r1Full = getResourcePct(maxOvers, 10, maxOvers);
  const r1Unused = getResourcePct(team1OversRem, team1WktsHand, maxOvers);
  const r1 = r1Full - r1Unused;

  const r2 = getResourcePct(team2OversAvail, team2WicketsInHand, maxOvers);

  if (r1 <= 0) return { revisedTarget: team1Score + 1, parScore: team1Score, r1: 100, r2 };

  const parScore = Math.round((team1Score * r2) / r1);
  const revisedTarget = parScore + 1;

  return { revisedTarget, parScore, r1: +r1.toFixed(1), r2: +r2.toFixed(1) };
}

/**
 * Calculate par score at the current point during Team 2's innings.
 * Used when the match is ended mid-innings to determine who is ahead.
 *
 * @param {number} team1Score        Runs scored by Team 1
 * @param {number} team1OversUsed    Overs faced by Team 1
 * @param {number} team1Wickets      Wickets lost by Team 1
 * @param {number} team2OversUsed    Overs faced by Team 2 so far
 * @param {number} team2WicketsLost  Wickets lost by Team 2 so far
 * @param {number} maxOvers          Original max overs for the match
 * @returns {{ parScore: number, r1: number, r2Used: number }}
 */
export function calculateParScoreAtPoint(
  team1Score,
  team1OversUsed,
  team1Wickets,
  team2OversUsed,
  team2WicketsLost,
  maxOvers
) {
  const team1OversRem = Math.max(0, maxOvers - team1OversUsed);
  const team1WktsHand = 10 - team1Wickets;
  const r1Full = getResourcePct(maxOvers, 10, maxOvers);
  const r1Unused = getResourcePct(team1OversRem, team1WktsHand, maxOvers);
  const r1 = r1Full - r1Unused;

  const team2OversRem = Math.max(0, maxOvers - team2OversUsed);
  const team2WktsHand = 10 - team2WicketsLost;
  const r2Full = getResourcePct(maxOvers, 10, maxOvers);
  const r2Unused = getResourcePct(team2OversRem, team2WktsHand, maxOvers);
  const r2Used = r2Full - r2Unused;

  if (r1 <= 0) return { parScore: 0, r1: 100, r2Used };

  const parScore = Math.round((team1Score * r2Used) / r1);
  return { parScore, r1: +r1.toFixed(1), r2Used: +r2Used.toFixed(1) };
}

/**
 * Format VJD result as a shareable text string.
 */
export function formatVJDResult({
  team1Name, team1Score, team1Overs, team1Wickets,
  team2Name, revisedOvers, revisedTarget, parScore,
  r1, r2, maxOvers
}) {
  const lines = [
    `━━ VJD Method Calculation ━━`,
    ``,
    `${team1Name}: ${team1Score}/${team1Wickets} (${team1Overs} ov)`,
    `Original overs: ${maxOvers}`,
    ``,
    `Team 1 resources used: ${r1}%`,
    `Team 2 resources available: ${r2}%`,
    ``,
    `${team2Name} revised target: ${revisedTarget} (in ${revisedOvers} overs)`,
    `Par score: ${parScore}`,
    ``,
    `— JDCA Scoring App (VJD Method)`,
  ];
  return lines.join('\n');
}
