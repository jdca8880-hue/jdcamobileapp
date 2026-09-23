/**
 * JDCA Player Selection & Team Management Data Architecture
 * Implementing age hierarchy and structured administrative domain model.
 */

export const AGE_HIERARCHY_LEVELS = {
  'U13': 1,
  'U15': 2,
  'U17': 3,
  'U19': 4,
  'U23': 5,
  'Senior': 6,
};

export const TEAM_CATEGORIES = [
  { id: 'u13', name: 'U13', level: 1, gender: 'Men' },
  { id: 'u15', name: 'U15', level: 2, gender: 'Men' },
  { id: 'u17', name: 'U17', level: 3, gender: 'Men' },
  { id: 'u19', name: 'U19', level: 4, gender: 'Men' },
  { id: 'u23', name: 'U23', level: 5, gender: 'Men' },
  { id: 'senior', name: 'Senior', level: 6, gender: 'Men' },
  { id: 'u15_women', name: 'U15', level: 2, gender: 'Women' },
  { id: 'u19_women', name: 'U19', level: 4, gender: 'Women' },
  { id: 'u23_women', name: 'U23', level: 5, gender: 'Women' },
  { id: 'senior_women', name: 'Senior', level: 6, gender: 'Women' },
];



export const BATTING_STYLE_OPTIONS = ['Right-Hand Bat', 'Left-Hand Bat'];
export const BOWLING_STYLE_OPTIONS = [
  'Right-Arm Fast',
  'Right-Arm Medium',
  'Right-Arm Off Spin',
  'Right-Arm Leg Spin',
  'Left-Arm Fast',
  'Left-Arm Medium',
  'Slow Left-Arm Orthodox',
  'Slow Left-Arm Chinaman',
  'None'
];
export const ROLE_FILTER_OPTIONS = ['Batter', 'Bowler', 'All-Rounder', 'Wicket Keeper'];

/**
 * Derives aggregate stats directly from match history to ensure data integrity
 */
export function normalizeSelectionPlayer(p) {
  if (!p) return null;

  // Map older category labels to standard hierarchy
  let catStr = (p.category || p.ageGroup || 'Senior').toUpperCase();
  let category = 'Senior';
  if (catStr.includes('13')) category = 'U13';
  else if (catStr.includes('14') || catStr.includes('15')) category = 'U15';
  else if (catStr.includes('16') || catStr.includes('17')) category = 'U17';
  else if (catStr.includes('19')) category = 'U19';

  let gender = p.gender || 'Men';
  if (p.name && (p.name.includes('Priya') || p.name.includes('Ananya') || p.name.includes('Pooja'))) {
    gender = 'Women';
  }

  const district = p.district ? p.district.replace(' District', '').trim() : 'Jabalpur';
  
  const isBatter = p.role === 'Batter' || p.primaryRole?.includes('Bat');
  const isBowler = p.role === 'Bowler' || p.primaryRole?.includes('Bowl') || p.primaryRole?.includes('Fast') || p.primaryRole?.includes('Spin');
  const isWK = p.role === 'Wicket Keeper' || p.primaryRole?.includes('Keeper') || p.primaryRole?.includes('WK');
  const isAllRounder = p.role === 'All-Rounder' || (!isWK && isBatter && isBowler);

  let standardRole = 'Batter';
  if (isWK) standardRole = 'Wicket Keeper';
  else if (isAllRounder) standardRole = 'All-Rounder';
  else if (isBowler) standardRole = 'Bowler';

  const battingStyle = p.battingStyle && p.battingStyle.includes('Left') ? 'Left-Hand Bat' : 'Right-Hand Bat';
  
  let bowlingStyle = 'None';
  if (isBowler || isAllRounder) {
    if (p.bowlingStyle) {
      if (p.bowlingStyle.includes('Off Spin')) bowlingStyle = 'Right-Arm Off Spin';
      else if (p.bowlingStyle.includes('Leg Spin')) bowlingStyle = 'Right-Arm Leg Spin';
      else if (p.bowlingStyle.includes('Left-Arm Orthodox') || p.bowlingStyle.includes('Slow Left')) bowlingStyle = 'Slow Left-Arm Orthodox';
      else if (p.bowlingStyle.includes('Fast')) bowlingStyle = p.bowlingStyle.includes('Left') ? 'Left-Arm Fast' : 'Right-Arm Fast';
      else bowlingStyle = p.bowlingStyle.includes('Left') ? 'Left-Arm Medium' : 'Right-Arm Medium';
    } else {
      bowlingStyle = 'Right-Arm Medium';
    }
  }

  const matchHistory = p.matchHistory || [];

  // Derive all performance statistics exclusively from matchHistory
  let careerRuns = 0;
  let careerBalls = 0;
  let dismissals = 0;
  let highScore = 0;
  let fifties = 0;
  let hundreds = 0;
  let fours = 0;
  let sixes = 0;

  let careerWickets = 0;
  let careerRunsConceded = 0;
  let careerBallsBowled = 0;
  let maidens = 0;
  let bestBowlingW = -1;
  let bestBowlingR = 999;

  let totalCatches = 0;
  let totalStumpings = 0;
  let totalRunOuts = 0;

  matchHistory.forEach(m => {
    if (m.batting) {
      careerRuns += (m.batting.runs || 0);
      careerBalls += (m.batting.balls || 0);
      fours += (m.batting.fours || 0);
      sixes += (m.batting.sixes || 0);
      
      if (m.batting.runs > highScore) highScore = m.batting.runs;
      if (m.batting.runs >= 100) hundreds++;
      else if (m.batting.runs >= 50) fifties++;
      
      if (!m.batting.notOut && m.batting.runs !== undefined) dismissals++;
    }

    if (m.bowling && parseFloat(m.bowling.overs || 0) > 0) {
      careerWickets += (m.bowling.wickets || 0);
      careerRunsConceded += (m.bowling.runs || 0);
      const overs = parseFloat(m.bowling.overs);
      careerBallsBowled += Math.floor(overs) * 6 + Math.round((overs % 1) * 10);
      maidens += (m.bowling.maidens || 0);

      if (m.bowling.wickets > bestBowlingW || (m.bowling.wickets === bestBowlingW && m.bowling.runs < bestBowlingR)) {
        bestBowlingW = m.bowling.wickets;
        bestBowlingR = m.bowling.runs;
      }
    }

    if (m.fielding) {
      totalCatches += (m.fielding.catches || 0);
      totalStumpings += (m.fielding.stumpings || 0);
      totalRunOuts += (m.fielding.runOuts || 0);
    }
  });

  const matches = matchHistory.length;
  const battingAvg = dismissals > 0 ? (careerRuns / dismissals).toFixed(1) : (careerRuns > 0 ? careerRuns.toFixed(1) : '0.0');
  const strikeRate = careerBalls > 0 ? ((careerRuns / careerBalls) * 100).toFixed(1) : '0.0';
  const highScoreStr = dismissals === matches && matches > 0 ? `${highScore}` : `${highScore}*`;

  const oversBowled = careerBallsBowled > 0 ? Math.floor(careerBallsBowled / 6) + (careerBallsBowled % 6) / 10 : 0;
  const bowlingAvg = careerWickets > 0 ? (careerRunsConceded / careerWickets).toFixed(1) : '-';
  const economy = oversBowled > 0 ? (careerRunsConceded / oversBowled).toFixed(2) : '-';
  const bestBowling = bestBowlingW >= 0 ? `${bestBowlingW}/${bestBowlingR}` : '-';
  const totalDismissals = totalCatches + totalStumpings + totalRunOuts;

  const selectionHistory = p.selectionHistory || [];

  const evalAvg = p.evaluations ? 
    ((p.evaluations.batting + p.evaluations.bowling + p.evaluations.fielding + p.evaluations.fitness + p.evaluations.temperament) / 5).toFixed(1) 
    : '0.0';

  let recentFormString = '';
  if (standardRole === 'Bowler') {
    recentFormString = matchHistory.slice(0, 3).map(m => `${m.bowling?.wickets || 0}/${m.bowling?.runs || 0}`).join(' · ');
  } else {
    recentFormString = matchHistory.slice(0, 3).map(m => `${m.batting?.runs || 0}${m.batting?.notOut ? '*' : ''}`).join(' · ');
  }

  return {
    ...p,
    id: p.id || null,
    name: p.name || 'Unknown Player',
    registrationNumber: p.registrationNumber || null,
    category,
    categoryLevel: AGE_HIERARCHY_LEVELS[category] || 5,
    gender,
    district,
    role: standardRole,
    battingStyle,
    bowlingStyle,
    
    // Performance
    matches,
    careerRuns,
    battingAvg,
    strikeRate,
    highScore: highScoreStr,
    fifties,
    hundreds,
    fours,
    sixes,

    wickets: careerWickets,
    oversBowled,
    runsConceded: careerRunsConceded,
    bowlingAvg,
    economy,
    bestBowling,
    maidens,

    catches: totalCatches,
    stumpings: totalStumpings,
    runOuts: totalRunOuts,
    totalDismissals,

    matchHistory,
    selectionHistory,
    avgEvalScore: evalAvg,
    recentFormString
  };
}



export function getAvailableDistricts(players) {
  const set = new Set();
  players.forEach(p => {
    if (p.district) set.add(p.district);
  });
  return ['All', ...Array.from(set).sort()];
}
