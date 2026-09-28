const fs = require('fs');
let content = fs.readFileSync('src/components/screens/MatchSetupScreen.jsx', 'utf-8');

const oldLines = [
  "                      const activeTeamId = activeTeamTab === 'A' ? matchSetup.teamAId : matchSetup.teamBId;",
  "                      const isAssignedToTeam = !activeTeamId || (p.team_players && p.team_players.some(tp => tp.team_id === activeTeamId));",
  "                      return isAvailable && matchesSearch && isAssignedToTeam;"
].join('\n');

const newLines = [
  "                      // All registered players are shown — team_players assignment not required for grassroots matches",
  "                      return isAvailable && matchesSearch;"
].join('\n');

if (content.includes(oldLines)) {
  content = content.replace(oldLines, newLines);
  fs.writeFileSync('src/components/screens/MatchSetupScreen.jsx', content, 'utf-8');
  console.log('DONE');
} else {
  console.log('NOT FOUND - searching for partial...');
  const idx = content.indexOf('isAssignedToTeam');
  console.log('isAssignedToTeam at index:', idx);
  if (idx !== -1) console.log('context:', JSON.stringify(content.substring(idx - 50, idx + 200)));
}
