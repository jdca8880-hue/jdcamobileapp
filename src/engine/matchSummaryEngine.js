export function parseScore(score = '') {
  const match = String(score).match(/(\d+)\/(\d+)/);
  return match ? { runs: Number(match[1]), wickets: Number(match[2]) } : null;
}

export function calculateMatchHighlights(match = {}) {
  const topPerformers = match.topPerformers || [];
  const pom = match.playerOfTheMatch || null;
  const batter = topPerformers.find((p) => /batter|opening|wk/i.test(`${p.role} ${p.stat}`) && !/\//.test(p.stat)) || topPerformers[1] || null;
  const bowler = topPerformers.find((p) => /\//.test(p.stat)) || topPerformers[0] || null;
  return {
    topBatter: match.topBatter || batter,
    topBowler: match.topBowler || bowler,
    playerOfMatch: pom,
    mostBoundaries: match.mostBoundaries || null,
    bestPartnership: match.bestPartnership || null,
  };
}

export function generateMatchSummary(match = {}, highlights = calculateMatchHighlights(match)) {
  const teamA = match.teamA?.name || 'TBA';
  const teamB = match.teamB?.name || 'TBA';
  const result = match.resultText || match.result || 'Match result recorded officially.';
  const aScore = match.teamA?.score || '';
  const bScore = match.teamB?.score || '';
  const topBatter = highlights.topBatter;
  const topBowler = highlights.topBowler;
  const pom = highlights.playerOfMatch;

  const scoreSentence = aScore && bScore ? `${teamA} posted ${aScore}, while ${teamB} replied with ${bScore}.` : `${teamA} and ${teamB} completed their innings.`;
  const performance = [];
  if (topBatter?.name && topBatter?.stat) performance.push(`${topBatter.name} top-scored with ${topBatter.stat}`);
  if (topBowler?.name && topBowler?.stat) performance.push(`${topBowler.name} returned ${topBowler.stat}`);
  if (pom?.name) performance.push(`${pom.name} was named Player of the Match`);

  return `${result}. ${scoreSentence}${performance.length ? ` ${performance.join('. ')}.` : ''}`.replace(/\.\./g, '.');
}

export function generateSocialCaption(match = {}, highlights = calculateMatchHighlights(match)) {
  const teamA = match.teamA?.name || 'TBA';
  const teamB = match.teamB?.name || 'TBA';
  const lines = [`🏏 ${teamA} vs ${teamB}`, `🏆 ${match.resultText || match.result || 'Official result recorded'}`];
  if (highlights.topBatter?.name) lines.push(`🏏 Top Batter: ${highlights.topBatter.name} � ${highlights.topBatter.stat || ''}`.trim());
  if (highlights.topBowler?.name) lines.push(`🎯 Top Bowler: ${highlights.topBowler.name} � ${highlights.topBowler.stat || ''}`.trim());
  if (highlights.playerOfMatch?.name) lines.push(`⭐ Player of the Match: ${highlights.playerOfMatch.name}`);
  lines.push('#JDCA #Cricket #JabalpurDistrictCricketAssociation');
  return lines.join('\n');
}
