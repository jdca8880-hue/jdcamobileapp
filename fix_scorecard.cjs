const fs = require('fs');
let content = fs.readFileSync('src/components/screens/ScorecardScreen.jsx', 'utf8');
content = content.replace(/Total: 184\/4 \(18\.2 Overs\) . RR: 10\.09/g, "Total: {activeInningsTab === '1st' ? fullScorecard?.home_team?.score || '0/0' : fullScorecard?.away_team?.score || '0/0'} {activeInningsTab === '1st' ? fullScorecard?.home_team?.overs || '(0.0 ov)' : fullScorecard?.away_team?.overs || '(0.0 ov)'}");
content = content.replace(/12 \(wd 6, nb 2, b 2, lb 2\)/g, "{activeInningsTab === '1st' ? fullScorecard?.home_team?.extras || 0 : fullScorecard?.away_team?.extras || 0}");
fs.writeFileSync('src/components/screens/ScorecardScreen.jsx', content);
