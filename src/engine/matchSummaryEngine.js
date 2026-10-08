// Match summary / media engine.
// Reads the canonical shape produced by api.getMatchScorecard:
//   { home_team:{name,score,overs}, away_team:{...},
//     scorecard:{ home_team:{batting,bowling}, away_team:{batting,bowling} },
//     innings_1, innings_2, topBatter, topBowler, manOfTheMatch,
//     bestPartnership, resultText, venue, tournament }
// Legacy aliases (teamA/teamB, playerOfTheMatch) are still accepted so older
// callers don't break.

export function parseScore(score = '') {
  const match = String(score).match(/(\d+)\/(\d+)/);
  return match ? { runs: Number(match[1]), wickets: Number(match[2]) } : null;
}

function teamName(match, side /* 'home' | 'away' */) {
  const legacy = side === 'home' ? match.teamA : match.teamB;
  const current = side === 'home' ? match.home_team : match.away_team;
  return current?.name || legacy?.name || (side === 'home' ? 'Home' : 'Away');
}

function teamScore(match, side) {
  const legacy = side === 'home' ? match.teamA : match.teamB;
  const current = side === 'home' ? match.home_team : match.away_team;
  return current?.score || legacy?.score || '';
}

function pickTopBatter(match) {
  if (match.topBatter?.name) return match.topBatter;
  const all = [
    ...(match.scorecard?.home_team?.batting || []),
    ...(match.scorecard?.away_team?.batting || []),
    ...(match.innings_1?.batting || []),
    ...(match.innings_2?.batting || [])
  ];
  if (!all.length) return null;
  const seen = new Map();
  for (const b of all) if (b?.id && !seen.has(b.id)) seen.set(b.id, b);
  const list = seen.size ? [...seen.values()] : all;
  const top = list.slice().sort((a, b) => (b.runs || 0) - (a.runs || 0))[0];
  return top ? { name: top.name, stat: `${top.runs || 0} (${top.balls || 0})` } : null;
}

function pickTopBowler(match) {
  if (match.topBowler?.name) return match.topBowler;
  const all = [
    ...(match.scorecard?.home_team?.bowling || []),
    ...(match.scorecard?.away_team?.bowling || []),
    ...(match.innings_1?.bowling || []),
    ...(match.innings_2?.bowling || [])
  ];
  if (!all.length) return null;
  const seen = new Map();
  for (const b of all) if (b?.id && !seen.has(b.id)) seen.set(b.id, b);
  const list = seen.size ? [...seen.values()] : all;
  const top = list.slice().sort((a, b) =>
    (b.wickets || 0) - (a.wickets || 0) || (a.runs || 0) - (b.runs || 0)
  )[0];
  return top ? { name: top.name, stat: `${top.wickets || 0}/${top.runs || 0}` } : null;
}

function pickPlayerOfMatch(match) {
  const src = match.man_of_the_match || match.manOfTheMatch || match.playerOfTheMatch || match.playerOfMatch;
  if (!src) return null;
  if (typeof src === 'string') return { id: null, name: src };
  const playerName = src.full_name || src.name;
  if (playerName) return { id: src.id || null, name: playerName };
  
  // If only ID exists, attempt lookup in scorecard
  if (src.id && match.scorecard) {
    const all = [
      ...(match.scorecard.home_team?.batting || []),
      ...(match.scorecard.home_team?.bowling || []),
      ...(match.scorecard.away_team?.batting || []),
      ...(match.scorecard.away_team?.bowling || [])
    ];
    const found = all.find(p => p.id === src.id);
    if (found?.name) return { id: src.id, name: found.name };
  }
  return src.id ? { id: src.id, name: null } : null;
}

function pickBestPartnership(match) {
  if (match.bestPartnership?.names) return match.bestPartnership;
  if (match.bestPartnership?.pair) {
    return {
      names: match.bestPartnership.pair,
      stat: match.bestPartnership.stat || `${match.bestPartnership.runs || 0} runs`
    };
  }
  return null;
}

export function calculateMatchHighlights(match = {}) {
  return {
    topBatter: pickTopBatter(match),
    topBowler: pickTopBowler(match),
    playerOfMatch: pickPlayerOfMatch(match),
    bestPartnership: pickBestPartnership(match),
    mostBoundaries: match.mostBoundaries || null
  };
}

export function generateMatchSummary(match = {}, highlights = calculateMatchHighlights(match)) {
  const home = teamName(match, 'home');
  const away = teamName(match, 'away');
  const result = match.resultText || match.result || 'Match result recorded officially';
  const homeScore = teamScore(match, 'home');
  const awayScore = teamScore(match, 'away');

  const scoreSentence = homeScore && awayScore
    ? `${home} posted ${homeScore}, while ${away} replied with ${awayScore}.`
    : `${home} and ${away} completed their innings.`;

  const bits = [];
  if (highlights.topBatter?.name && highlights.topBatter?.stat) {
    bits.push(`${highlights.topBatter.name} top-scored with ${highlights.topBatter.stat}`);
  }
  if (highlights.topBowler?.name && highlights.topBowler?.stat) {
    bits.push(`${highlights.topBowler.name} returned ${highlights.topBowler.stat}`);
  }
  if (highlights.playerOfMatch?.name) {
    bits.push(`${highlights.playerOfMatch.name} was named Player of the Match`);
  }

  return `${result}. ${scoreSentence}${bits.length ? ` ${bits.join('. ')}.` : ''}`.replace(/\.\./g, '.');
}

export function generateSocialCaption(match = {}, highlights = calculateMatchHighlights(match)) {
  const home = teamName(match, 'home');
  const away = teamName(match, 'away');
  const lines = [
    `🏏 ${home} vs ${away}`,
    `🏆 ${match.resultText || match.result || 'Official result recorded'}`
  ];
  if (highlights.topBatter?.name) {
    lines.push(`🏏 Top Batter: ${highlights.topBatter.name} — ${highlights.topBatter.stat || ''}`.trim());
  }
  if (highlights.topBowler?.name) {
    lines.push(`🎯 Top Bowler: ${highlights.topBowler.name} — ${highlights.topBowler.stat || ''}`.trim());
  }
  if (highlights.bestPartnership?.names) {
    lines.push(`🤝 Best Partnership: ${highlights.bestPartnership.names} — ${highlights.bestPartnership.stat || ''}`.trim());
  }
  if (highlights.playerOfMatch?.name) {
    lines.push(`⭐ Player of the Match: ${highlights.playerOfMatch.name}`);
  }
  lines.push('#JDCA #Cricket #JabalpurDistrictCricketAssociation');
  return lines.join('\n');
}
