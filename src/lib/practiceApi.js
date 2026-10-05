import { practiceDb } from './practiceDb';

export const practiceApi = {
  async getAnnouncements() {
    return [];
  },
  
  async getSelectionProcesses() {
    return [];
  },

  async getAgeCategories() {
    return await practiceDb.age_categories.toArray();
  },

  async getDistricts() {
    return await practiceDb.districts.toArray();
  },

  async getTeams() {
    return await practiceDb.teams.toArray();
  },

  async getPlayers() {
    return await practiceDb.players.toArray();
  },

  async getTournaments() {
    return await practiceDb.tournaments.toArray();
  },

  async getDefaults() {
    const ageCategories = await practiceDb.age_categories.toArray();
    const districts = await practiceDb.districts.toArray();
    return {
      age_category_id: ageCategories[0]?.id || null,
      district_id: districts[0]?.id || null
    };
  },

  async createTournament(tournamentData) {
    const defaults = await this.getDefaults();
    const tId = 'tourn-prac-' + Date.now();
    
    const seasonData = await practiceDb.seasons.get(tournamentData.season_id);
    const newTournament = {
      id: tId,
      name: tournamentData.name,
      season_id: tournamentData.season_id,
      season: seasonData?.name || '2026-27',
      format: tournamentData.format || 'T20',
      age_category_id: tournamentData.age_category_id || defaults.age_category_id,
      gender: tournamentData.gender || 'Men',
      start_date: tournamentData.start_date || tournamentData.startDate || null,
      end_date: tournamentData.end_date || tournamentData.endDate || null,
      status: tournamentData.status || 'UPCOMING'
    };
    
    await practiceDb.tournaments.add(newTournament);
    return newTournament;
  },

  async updateTournament(id, tournamentData) {
    await practiceDb.tournaments.update(id, tournamentData);
    return await practiceDb.tournaments.get(id);
  },

  async createTeam(teamData) {
    const defaults = await this.getDefaults();
    const tId = 'team-prac-' + Date.now();
    const seasonData = await practiceDb.seasons.get(teamData.season_id);
    
    const newTeam = {
      id: tId,
      name: teamData.name,
      short_name: teamData.shortName || teamData.name.substring(0, 3).toUpperCase(),
      season: seasonData?.name || '2026-27',
      season_id: teamData.season_id,
      district_id: defaults.district_id,
      age_category_id: teamData.age_category_id || defaults.age_category_id,
      gender: teamData.gender === 'Women' ? 'Women' : 'Men',
      is_active: true
    };
    await practiceDb.teams.add(newTeam);
    return newTeam;
  },

  async registerPlayer(playerData) {
    const pId = 'player-prac-' + Date.now();
    const newPlayer = {
      id: pId,
      full_name: playerData.full_name,
      avatar_url: playerData.avatar_url,
      primary_role: playerData.primary_role,
      batting_style: playerData.batting_style,
      bowling_style: playerData.bowling_style,
      date_of_birth: playerData.date_of_birth,
      gender: playerData.gender,
      district: playerData.district,
      category: playerData.category
    };
    await practiceDb.players.add(newPlayer);
    return newPlayer;
  },

  async createDetailedMatches(tournamentId, format, matchesArray) {
    if (!matchesArray || matchesArray.length === 0) return { created: 0, skipped: 0, failed: 0, data: [] };
    
    const data = [];
    for (const m of matchesArray) {
      const matchFmt = m.match_format || m.format || format || 'T20';
      const scheduledVal = m.scheduled_at || m.date || m.scheduledAt;
      const mId = 'match-prac-' + Date.now() + Math.random().toString().slice(2, 6);
      const newMatch = {
        id: mId,
        tournament_id: tournamentId,
        home_team_id: m.home_team_id || m.homeTeamId || null,
        away_team_id: m.away_team_id || m.awayTeamId || null,
        scheduled_at: scheduledVal ? new Date(scheduledVal).toISOString() : new Date().toISOString(),
        status: 'SCHEDULED',
        match_format: matchFmt,
        max_overs: matchFmt === 'T20' ? 20 : (matchFmt === 'T10' ? 10 : 50),
        venue_name: m.venueName || null,
        umpire_name: m.umpireName || null,
        scorer_name: m.scorerName || null,
        ball_type: m.ballType || null
      };
      await practiceDb.matches.add(newMatch);
      data.push(newMatch);
    }
    return { created: data.length, skipped: 0, failed: 0, data };
  },

  async updateMatchDetails(matchId, matchData) {
    await practiceDb.matches.update(matchId, matchData);
    return await practiceDb.matches.get(matchId);
  },

  async getOrCreateInnings(matchId, inningsNumber) {
    const existing = await practiceDb.innings.where({ match_id: matchId, innings_number: inningsNumber }).first();
    if (existing) return existing;
    
    const match = await practiceDb.matches.get(matchId);
    let batting_team_id = match.home_team_id;
    let bowling_team_id = match.away_team_id;
    if (match.toss_winner_id === match.home_team_id) {
       if (match.toss_decision === 'BOWL') {
           batting_team_id = match.away_team_id;
           bowling_team_id = match.home_team_id;
       }
    } else if (match.toss_winner_id === match.away_team_id) {
       if (match.toss_decision === 'BAT') {
           batting_team_id = match.away_team_id;
           bowling_team_id = match.home_team_id;
       }
    }
    
    if (inningsNumber === 2) {
       const temp = batting_team_id;
       batting_team_id = bowling_team_id;
       bowling_team_id = temp;
    }
    
    const innId = 'inn-prac-' + Date.now();
    const newInn = {
      id: innId,
      match_id: matchId,
      innings_number: inningsNumber,
      batting_team_id,
      bowling_team_id
    };
    await practiceDb.innings.add(newInn);
    return newInn;
  },

  async hydrateLiveMatch(matchId) {
    const match = await practiceDb.matches.get(matchId);
    if (!match) throw new Error("Match not found");
    
    const homeTeam = await practiceDb.teams.get(match.home_team_id);
    const awayTeam = await practiceDb.teams.get(match.away_team_id);
    match.home_team = homeTeam;
    match.away_team = awayTeam;
    
    const rosters = await practiceDb.match_rosters.where({ match_id: matchId }).toArray();
    const allPlayers = await practiceDb.players.toArray();
    
    const processRoster = (teamId) => {
       const teamRosters = rosters.filter(r => r.team_id === teamId);
       return teamRosters.map(r => {
          const p = allPlayers.find(pl => pl.id === r.player_id) || {};
          return {
             ...p,
             id: r.player_id,
             name: p.full_name || p.name || 'Player',
             role: r.is_wicketkeeper ? 'Wicket Keeper' : (p.primary_role || 'Batter'),
             isCaptain: !!r.is_captain
          };
       });
    };
    
    const home_team_roster = processRoster(match.home_team_id);
    const away_team_roster = processRoster(match.away_team_id);
    
    const inningsList = await practiceDb.innings.where({ match_id: matchId }).toArray();
    inningsList.sort((a,b) => b.innings_number - a.innings_number);
    const currentInning = inningsList.length > 0 ? inningsList[0] : null;
    
    let deliveries = [];
    if (currentInning) {
       deliveries = await practiceDb.deliveries.where({ innings_id: currentInning.id }).toArray();
       deliveries.sort((a,b) => a.delivery_sequence - b.delivery_sequence);
       
       deliveries = deliveries.map(d => {
         const striker = allPlayers.find(p => p.id === d.striker_id);
         const nonStriker = allPlayers.find(p => p.id === d.non_striker_id);
         const bowler = allPlayers.find(p => p.id === d.bowler_id);
         return {
           ...d,
           striker,
           non_striker: nonStriker,
           bowler
         };
       });
    }
    
    return {
      match,
      home_team_roster,
      away_team_roster,
      currentInning,
      deliveries
    };
  },
  
  async getMatchScorecard(matchId) {
     return this.hydrateLiveMatch(matchId); // Approximation, sufficient for practice mode UI
  },
  
  async getPlayerMatchStats() {
     return { batting: [], bowling: [] };
  },
  
  async getActiveSeason() {
    return await practiceDb.seasons.where('is_current_active').equals(true).first();
  },
  async getSeasons() {
    return await practiceDb.seasons.toArray();
  },
  async createSeason(seasonData) {
    const sId = 'season-prac-' + Date.now();
    const season = { id: sId, ...seasonData };
    await practiceDb.seasons.add(season);
    return season;
  }
};
