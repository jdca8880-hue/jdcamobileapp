/**
 * scorecardProjection.js — a PURE shaping adapter from the canonical match
 * projection (buildMatchState) into the scorecard shape the app already renders.
 *
 * It is NOT a second scoring engine: it duplicates no cricket rules. Every number
 * (runs, balls, wickets, extras, maidens, fall of wickets, dismissals) is read
 * straight off `buildMatchState`'s innings objects. Its only job is to RESHAPE
 * the projection's `{batting:{}, bowling:{}}` maps into the `{batting:[], bowling:[]}`
 * arrays (with display strings: overs, economy, strike rate) that
 * `api.getMatchScorecard` and the scorecard/PDF screens expect — so a v2 match's
 * scorecard can be driven by the SAME projection that drives live play and
 * hydration, instead of a separate aggregation that can silently diverge.
 */

function oversStr(legalBalls, ballsPerOver = 6) {
  return `${Math.floor(legalBalls / ballsPerOver)}.${legalBalls % ballsPerOver}`;
}

function dismissalText(batter) {
  if (!batter || !batter.out) return 'not out';
  const type = batter.dismissal?.type || 'OUT';
  return String(type).toLowerCase().replace(/_/g, ' ');
}

function parseLegalBalls(overBall) {
  // "X.Y" -> X*6 + Y
  if (typeof overBall !== 'string') return 0;
  const [o, b] = overBall.split('.').map((n) => parseInt(n, 10) || 0);
  return o * 6 + b;
}

/** Reshape one projection innings into the scorecard innings-stats shape. */
export function projectionInningsToScorecard(inn) {
  const extras = inn.extras || {};
  const extrasTotal =
    (extras.wides || 0) + (extras.noBalls || 0) + (extras.byes || 0) + (extras.legByes || 0) + (extras.penalty || 0);

  const batting = (inn.battingOrder || []).map((id) => {
    const b = inn.batting[id] || {};
    return {
      id,
      name: b.name || 'Unknown',
      runs: b.runs || 0,
      balls: b.balls || 0,
      fours: b.fours || 0,
      sixes: b.sixes || 0,
      dismissal: dismissalText(b),
      strikeRate: (b.balls || 0) > 0 ? (((b.runs || 0) / b.balls) * 100).toFixed(1) : '0.0',
    };
  });

  const bowling = (inn.bowlingOrder || []).map((id) => {
    const bw = inn.bowling[id] || {};
    const balls = bw.balls || 0;
    return {
      id,
      name: bw.name || 'Unknown',
      balls,
      runs: bw.runs || 0,
      wickets: bw.wickets || 0,
      maidens: bw.maidens || 0,
      wides: bw.wides || 0,
      noBalls: bw.noBalls || 0,
      overs: oversStr(balls),
      economy: balls > 0 ? (((bw.runs || 0) / balls) * 6).toFixed(1) : '0.0',
    };
  });

  const fallOfWickets = (inn.fallOfWickets || []).map((f) => {
    const legalBallsAt = parseLegalBalls(f.overBall);
    return {
      wicket: f.wicketNumber,
      score: f.runs,
      player: f.playerName || 'Unknown',
      legalBallsAt,
      oversAt: oversStr(legalBallsAt),
    };
  });

  return {
    runs: inn.runs || 0,
    wickets: inn.wickets || 0,
    extras: extrasTotal,
    overs: oversStr(inn.legalBalls || 0),
    legalBalls: inn.legalBalls || 0,
    batting,
    bowling,
    fallOfWickets,
  };
}

/**
 * Full projection -> ordered scorecard innings (1..N), each enriched with its own
 * batting/bowling team ids and target. `teamNameById` is optional (adds names).
 */
export function projectionToScorecard(proj, { teamNameById } = {}) {
  const ordered = [...(proj?.innings || [])].sort((a, b) => a.inningsNumber - b.inningsNumber);
  const nameOf = typeof teamNameById === 'function' ? teamNameById : () => undefined;
  return ordered.map((inn) => ({
    ...projectionInningsToScorecard(inn),
    inningsNumber: inn.inningsNumber,
    battingTeamId: inn.battingTeamId ?? null,
    bowlingTeamId: inn.bowlingTeamId ?? null,
    battingTeamName: nameOf(inn.battingTeamId),
    bowlingTeamName: nameOf(inn.bowlingTeamId),
    target: inn.target ?? null,
    status: inn.status,
  }));
}
