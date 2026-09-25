import { supabase } from './supabase';

export const api = {
  // ANNOUNCEMENTS
  // ==========================================
  async getAnnouncements() {
    const { data, error } = await supabase
      .from('announcements')
      .select('*')
      .order('created_at', { ascending: false });
    if (error && error.code !== '42P01') throw error;
    return data || [];
  },
  async createAnnouncement(announcementData) {
    const { data, error } = await supabase
      .from('announcements')
      .insert([{ ...announcementData }])
      .select()
      .single();
    if (error) throw error;
    return data;
  },
  async deleteAnnouncement(id) {
    const { error } = await supabase.from('announcements').delete().eq('id', id);
    if (error) throw error;
  },

  // SEASONS
  // ==========================================
  async getSeasons() {
    const { data, error } = await supabase
      .from('seasons')
      .select('*')
      .neq('name', '2024-25')
      .order('start_date', { ascending: false });
    if (error && error.code !== '42P01') throw error;
    return data || [];
  },

  async getActiveSeason() {
    const { data, error } = await supabase
      .from('seasons')
      .select('*')
      .eq('is_current_active', true)
      .neq('name', '2024-25')
      .maybeSingle();
    if (error && error.code !== '42P01') throw error;
    return data;
  },

  async createSeason(seasonData) {
    const { data, error } = await supabase
      .from('seasons')
      .insert([{
        name: seasonData.name,
        start_date: seasonData.start_date,
        end_date: seasonData.end_date,
        is_current_active: seasonData.is_current_active || false
      }])
      .select()
      .single();
    if (error) throw error;
    if (seasonData.is_current_active) {
      await this.setActiveSeason(data.id);
    }
    return data;
  },

  async setActiveSeason(seasonId) {
    const { error } = await supabase.rpc('set_active_season', { p_season_id: seasonId });
    if (error) {
      await supabase.from('seasons').update({ is_current_active: false }).neq('id', seasonId);
      const { error: updErr } = await supabase.from('seasons').update({ is_current_active: true }).eq('id', seasonId);
      if (updErr) throw updErr;
    }
  },

  /**
   * Fetches the first available age category and district to use as defaults
   * since the current UI doesn't always specify them but the schema requires them.
   */
  async getDefaults() {
    const { data: ageCategories } = await supabase.from('age_categories').select('*').limit(1);
    const { data: districts } = await supabase.from('districts').select('*').limit(1);
    
    return {
      age_category_id: ageCategories?.[0]?.id || null,
      district_id: districts?.[0]?.id || null
    };
  },

  async createTournament(tournamentData) {
    const defaults = await this.getDefaults();
    
    if (!defaults.age_category_id) {
      throw new Error("No age categories found in the database. Please seed age_categories table first.");
    }

    const { data, error } = await supabase
      .from('tournaments')
      .insert({
        name: tournamentData.name,
        season_id: tournamentData.season_id,
        format: tournamentData.format || 'T20',
        age_category_id: defaults.age_category_id,
        gender: tournamentData.gender || 'Men',
        start_date: tournamentData.startDate || null,
        end_date: tournamentData.endDate || null,
        status: tournamentData.status || 'UPCOMING'
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async updateTournament(id, tournamentData) {
    const { data, error } = await supabase
      .from('tournaments')
      .update({
        name: tournamentData.name,
        season_id: tournamentData.season_id,
        format: tournamentData.format,
        gender: tournamentData.gender,
        start_date: tournamentData.startDate || null,
        end_date: tournamentData.endDate || null,
        status: tournamentData.status
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async deleteTournament(id) {
    const { error } = await supabase
      .from('tournaments')
      .update({ deleted_at: new Date().toISOString() })
      .eq('id', id);

    if (error) throw error;
    return true;
  },

  async deleteMatch(id) {
    const { error } = await supabase
      .from('matches')
      .update({ deleted_at: new Date().toISOString() })
      .eq('id', id);

    if (error) throw error;
    return true;
  },

  async deletePlayer(id) {
    const { data, error } = await supabase
      .from('players')
      .update({ deleted_at: new Date().toISOString() })
      .eq('id', id)
      .select();

    if (error) throw error;
    if (!data || data.length === 0) throw new Error("Permission denied or player not found");
    return true;
  },

  // ==========================================
  // RECYCLE BIN (SOFT DELETES)
  // ==========================================
  async getRecycleBinItems() {
    // We run these in parallel
    const [tRes, mRes, pRes] = await Promise.all([
      supabase.from('tournaments').select('id, name, deleted_at').not('deleted_at', 'is', null),
      supabase.from('matches').select('id, match_format, scheduled_at, deleted_at, home_team:home_team_id(name), away_team:away_team_id(name)').not('deleted_at', 'is', null),
      supabase.from('players').select('id, full_name, deleted_at').not('deleted_at', 'is', null)
    ]);

    if (tRes.error) throw tRes.error;
    if (mRes.error) throw mRes.error;
    if (pRes.error) throw pRes.error;

    const items = [];

    if (tRes.data) {
      tRes.data.forEach(t => items.push({ id: t.id, type: 'TOURNAMENT', name: t.name, deleted_at: t.deleted_at }));
    }
    if (mRes.data) {
      mRes.data.forEach(m => items.push({ 
        id: m.id, 
        type: 'MATCH', 
        name: `${m.home_team?.name} vs ${m.away_team?.name} (${m.match_format})`, 
        deleted_at: m.deleted_at 
      }));
    }
    if (pRes.data) {
      pRes.data.forEach(p => items.push({ id: p.id, type: 'PLAYER', name: p.full_name || 'Unknown Player', deleted_at: p.deleted_at }));
    }
    
    // Sort by deleted_at descending
    return items.sort((a, b) => new Date(b.deleted_at) - new Date(a.deleted_at));
  },

  async restoreItem(type, id) {
    let table = '';
    if (type === 'TOURNAMENT') table = 'tournaments';
    else if (type === 'MATCH') table = 'matches';
    else if (type === 'PLAYER') table = 'players';
    else throw new Error("Invalid type");

    const { error } = await supabase.from(table).update({ deleted_at: null }).eq('id', id);
    if (error) throw error;
    return true;
  },

  async hardDeleteItem(type, id) {
    let table = '';
    if (type === 'TOURNAMENT') table = 'tournaments';
    else if (type === 'MATCH') table = 'matches';
    else if (type === 'PLAYER') table = 'players';
    else throw new Error("Invalid type");

    const { error } = await supabase.from(table).delete().eq('id', id);
    if (error) throw error;
    return true;
  },

  // ==========================================
  // SELECTOR ACCESS MANAGEMENT
  // ==========================================
  async getSelectorAssignments(selectorId) {
    const { data, error } = await supabase
      .from('selector_assignments')
      .select('selection_process_id, is_lead_selector')
      .eq('selector_id', selectorId);
    if (error) throw error;
    return data || [];
  },

  async updateSelectorAssignments(selectorId, assignments) {
    // assignments: array of { selection_process_id, is_lead_selector }
    // 1. Delete existing assignments
    await supabase.from('selector_assignments').delete().eq('selector_id', selectorId);
    
    // 2. Insert new ones if any
    if (assignments && assignments.length > 0) {
      const inserts = assignments.map(a => ({
        selector_id: selectorId,
        selection_process_id: a.selection_process_id,
        is_lead_selector: a.is_lead_selector || false
      }));
      const { error } = await supabase.from('selector_assignments').insert(inserts);
      if (error) throw error;
    }
  },
  async rebuildTeams() {
    const { data: districts } = await supabase.from('districts').select('id, name').eq('is_active', true);
    const { data: ageCategories } = await supabase.from('age_categories').select('id, name, short_name').eq('is_active', true);
    if (!districts || !ageCategories) return;

    const genders = ['Men', 'Women'];
    const teamsToInsert = [];

    const activeSeasonData = await this.getActiveSeason();
    if (!activeSeasonData) return;

    districts.forEach(d => {
      ageCategories.forEach(ac => {
        genders.forEach(g => {
          teamsToInsert.push({
            name: `${d.name} ${ac.name} ${g}`,
            short_name: `${ac.short_name}-${g.substring(0, 1)}`,
            season_id: activeSeasonData.id,
            district_id: d.id,
            age_category_id: ac.id,
            gender: g,
            is_active: true
          });
        });
      });
    });

    if (teamsToInsert.length > 0) {
      const { data: existingTeams } = await supabase.from('teams').select('name, season_id, district_id');
      const existingSet = new Set(existingTeams?.map(t => `${(t.name || '').trim().toLowerCase()}_${t.season_id}_${t.district_id}`) || []);

      const newTeams = teamsToInsert.filter(t => !existingSet.has(`${t.name.trim().toLowerCase()}_${t.season_id}_${t.district_id}`));

      if (newTeams.length > 0) {
        const { error } = await supabase.from('teams').insert(newTeams);
        if (error) throw error;
      }
    }
    return true;
  },

  async createTeam(teamData) {
    const defaults = await this.getDefaults();
    
    if (!defaults.age_category_id) {
      throw new Error("No age categories found in the database.");
    }

    const { data, error } = await supabase
      .from('teams')
      .insert({
        name: teamData.name,
        short_name: teamData.shortName || teamData.name.substring(0, 3).toUpperCase(),
        season_id: teamData.season_id,
        district_id: defaults.district_id,
        age_category_id: defaults.age_category_id,
        gender: teamData.gender === 'Women' ? 'Women' : 'Men',
        is_active: true
      })
      .select()
      .single();

    if (error) {
      if (error.code === '23505') {
        throw new Error("A team with this name already exists for this district and season.");
      }
      throw error;
    }
    return data;
  },

  async generateSchedule(tournamentId, teams, format = 'T20') {
    const matchesToInsert = [];
    let baseDate = new Date();
    baseDate.setDate(baseDate.getDate() + 1);

    for (let i = 0; i < teams.length; i++) {
      for (let j = i + 1; j < teams.length; j++) {
        if (!teams[i].id || !teams[j].id) {
            throw new Error("Cannot generate schedule: One or more teams have missing IDs.");
        }
        const matchDate = new Date(baseDate);
        matchDate.setDate(matchDate.getDate() + matchesToInsert.length + 1);
        
        matchesToInsert.push({
          tournament_id: tournamentId,
          home_team_id: teams[i].id,
          away_team_id: teams[j].id,
          scheduled_at: matchDate.toISOString(),
          status: 'SCHEDULED',
          match_format: format,
          max_overs: format === 'T20' ? 20 : (format === 'T10' ? 10 : 50)
        });
      }
    }

    if (matchesToInsert.length === 0) return [];

    const { data, error } = await supabase
      .from('matches')
      .insert(matchesToInsert)
      .select();

    if (error) {
      if (error.code === '23505') {
        throw new Error("One or more of these matches already exist (duplicate fixture).");
      }
      throw error;
    }
    return data;
  },

  async createDetailedMatches(tournamentId, format, matchesArray) {
    if (!matchesArray || matchesArray.length === 0) return [];
    
    const matchesToInsert = matchesArray.map(m => {
      if (!m.homeTeamId || !m.awayTeamId) {
        throw new Error("Please select both Home and Away teams for all matches.");
      }
      return {
        tournament_id: tournamentId,
        home_team_id: m.homeTeamId || null,
        away_team_id: m.awayTeamId || null,
        scheduled_at: m.date ? new Date(m.date).toISOString() : new Date().toISOString(),
      status: 'SCHEDULED',
      match_format: format,
      max_overs: format === 'T20' ? 20 : (format === 'T10' ? 10 : 50),
      venue_name: m.venueName || null,
      umpire_name: m.umpireName || null,
      scorer_name: m.scorerName || null,
      ball_type: m.ballType || null
      };
    });

    const { data, error } = await supabase
      .from('matches')
      .insert(matchesToInsert)
      .select();

    if (error) {
      if (error.code === '23505') {
        throw new Error("One or more of these matches already exist (duplicate fixture).");
      }
      throw error;
    }
    return data;
  },

  // ==========================================
  // SELECTION WORKFLOW
  // ==========================================

  async getSelectionProcesses() {
    const { data, error } = await supabase
      .from('selection_processes')
      .select('*, age_category:age_category_id(*), district:district_id(*), selector_assignments(selector_id, is_lead_selector)');
    if (error) throw error;
    return data;
  },

  async getSelectionCandidates(processId) {
    if (!processId) return [];
    const { data, error } = await supabase
      .from('selection_candidates')
      .select('player_id')
      .eq('selection_process_id', processId);
    if (error) throw error;
    return data.map(c => c.player_id);
  },

  async toggleCandidate(processId, playerId, isAdding) {
    if (isAdding) {
      const { error } = await supabase
        .from('selection_candidates')
        .insert({
          selection_process_id: processId,
          player_id: playerId,
          status: 'ELIGIBLE'
        });
      if (error && error.code !== '23505') throw error; // Ignore if already exists
    } else {
      const { error } = await supabase
        .from('selection_candidates')
        .delete()
        .match({
          selection_process_id: processId,
          player_id: playerId
        });
      if (error) throw error;
    }
  },

  async finalizeSquad(processId, selectedPlayerIds) {
    if (!selectedPlayerIds || selectedPlayerIds.length === 0) {
      throw new Error("No players selected for finalization.");
    }

    // 1. Find process and target team
    const { data: process, error: processError } = await supabase
      .from('selection_processes')
      .select('target_team_id')
      .eq('id', processId)
      .single();
      
    if (processError) throw processError;
    const targetTeamId = process?.target_team_id;

    if (!targetTeamId) {
      throw new Error("This selection process has no target team configured. Cannot finalize the squad.");
    }

    // 2. Persist to selection_decisions (delete existing to prevent duplicates)
    await supabase.from('selection_decisions').delete().eq('selection_process_id', processId);

    const decisions = selectedPlayerIds.map(playerId => ({
      selection_process_id: processId,
      player_id: playerId,
      decision: 'SELECTED'
    }));

    if (decisions.length > 0) {
      const { error: insertError } = await supabase
        .from('selection_decisions')
        .insert(decisions);
      if (insertError) throw insertError;
    }

    // 3. Persist into team_players if targetTeamId exists
    if (targetTeamId) {
      const teamPlayers = selectedPlayerIds.map(playerId => ({
        team_id: targetTeamId,
        player_id: playerId
      }));

      // Insert team_players in bulk, ignoring duplicates to preserve existing legitimate members
      const { error: tpError } = await supabase
        .from('team_players')
        .upsert(teamPlayers, { onConflict: 'team_id,player_id', ignoreDuplicates: true });
        
      if (tpError) {
        console.error('[api] Failed to bulk insert team_players:', tpError);
        // Throw on genuine failures to halt progression safely against partial/duplicate writes
        throw tpError;
      }
    }

    // 4. Mark process as FINALIZED
    const { error: updateError } = await supabase
      .from('selection_processes')
      .update({ status: 'FINALIZED' })
      .eq('id', processId);
    
    if (updateError) throw updateError;
    return true;
  },

  // ==========================================
  // HYDRATE MATCH STATE
  // ==========================================
  
  async hydrateLiveMatch(matchId) {
    if (!matchId) throw new Error("Match ID required");
    
    // 1. Fetch match and teams
    const { data: match, error: matchError } = await supabase
      .from('matches')
      .select('*, home_team:home_team_id(*), away_team:away_team_id(*)')
      .eq('id', matchId)
      .single();
      
    if (matchError) throw matchError;

    // 2. Fetch Match Rosters
    const { data: rosters } = await supabase
      .from('match_rosters')
      .select('*, player:player_id(*)')
      .eq('match_id', matchId);

    const teamAXI = rosters?.filter(r => r.team_id === match.home_team_id).map(r => ({ ...r.player, role: r.is_wicketkeeper ? 'Wicket Keeper' : r.player.primary_role, isCaptain: r.is_captain })) || [];
    const teamBXI = rosters?.filter(r => r.team_id === match.away_team_id).map(r => ({ ...r.player, role: r.is_wicketkeeper ? 'Wicket Keeper' : r.player.primary_role, isCaptain: r.is_captain })) || [];

    // 3. Fetch Innings
    const { data: inningsData } = await supabase
      .from('innings')
      .select('*')
      .eq('match_id', matchId)
      .order('innings_number', { ascending: false })
      .limit(1);

    const currentInning = inningsData && inningsData.length > 0 ? inningsData[0] : null;
    let deliveries = [];
    
    if (currentInning) {
      const { data: dData } = await supabase
        .from('deliveries')
        .select('*, striker:striker_id(*), non_striker:non_striker_id(*), bowler:bowler_id(*)')
        .eq('innings_id', currentInning.id)
        .order('delivery_sequence', { ascending: true });
      if (dData) deliveries = dData;
    }

    return {
      match,
      teamAXI,
      teamBXI,
      currentInning,
      deliveries
    };
  },

  // ==========================================
  // MATCH REPORTS & SCORECARDS
  // ==========================================

  async getMatchScorecard(matchId) {
    if (!matchId) return null;

    // 1. Fetch match and teams
    const { data: matchData, error: matchError } = await supabase
      .from('matches')
      .select('*, home_team:home_team_id(*), away_team:away_team_id(*), man_of_the_match:man_of_the_match_id(id, full_name)')
      .eq('id', matchId)
      .single();

    if (matchError) throw matchError;
    if (!matchData) throw new Error("Match not found");

    // 2. Fetch innings
    const { data: inningsData } = await supabase
      .from('innings')
      .select('*')
      .eq('match_id', matchId)
      .order('innings_number', { ascending: true });

    // 3. Fetch deliveries with players
    const { data: deliveriesData } = await supabase
      .from('deliveries')
      .select('*, striker:striker_id(name), bowler:bowler_id(name)')
      .eq('match_id', matchId);

    const innings = inningsData || [];
    const deliveries = deliveriesData || [];

    // Helper: Compute stats for an innings
    const computeInningsStats = (inningId) => {
      const balls = deliveries.filter(d => d.innings_id === inningId);
      let runs = 0;
      let wickets = 0;
      let extras = 0;
      let legalBalls = 0;
      
      const batters = {};
      const bowlers = {};

      balls.forEach(d => {
        runs += d.runs_total;
        if (d.wicket_type !== 'NONE') wickets += 1;
        if (d.extra_type !== 'NONE' && d.extra_type !== 'BYES' && d.extra_type !== 'LEG_BYES') {
          // Wides/No-balls don't count as legal
        } else {
          legalBalls += 1;
        }
        
        if (d.extra_type !== 'NONE') extras += d.runs_extras;

        // Batter Stats
        if (d.striker_id) {
          if (!batters[d.striker_id]) {
            batters[d.striker_id] = { id: d.striker_id, name: d.striker?.name || 'Unknown', runs: 0, balls: 0, fours: 0, sixes: 0, dismissal: 'not out' };
          }
          if (d.extra_type === 'NONE' || d.extra_type === 'NO_BALL' || d.extra_type === 'BYES' || d.extra_type === 'LEG_BYES') {
            batters[d.striker_id].balls += 1;
          }
          if (d.extra_type === 'NONE' || d.extra_type === 'NO_BALL') {
             batters[d.striker_id].runs += d.runs_off_bat;
             if (d.runs_off_bat === 4) batters[d.striker_id].fours += 1;
             if (d.runs_off_bat === 6) batters[d.striker_id].sixes += 1;
          }
          if (d.wicket_type !== 'NONE' && d.dismissed_player_id === d.striker_id) {
            batters[d.striker_id].dismissal = d.wicket_type.toLowerCase().replace('_', ' ');
          }
        }

        // Bowler Stats
        if (d.bowler_id) {
          if (!bowlers[d.bowler_id]) {
            bowlers[d.bowler_id] = { id: d.bowler_id, name: d.bowler?.name || 'Unknown', balls: 0, runs: 0, wickets: 0, maidens: 0 };
          }
          if (d.extra_type === 'NONE' || d.extra_type === 'BYES' || d.extra_type === 'LEG_BYES') {
            bowlers[d.bowler_id].balls += 1;
          }
          if (d.extra_type !== 'BYES' && d.extra_type !== 'LEG_BYES') {
            bowlers[d.bowler_id].runs += d.runs_total;
          }
          if (d.wicket_type !== 'NONE' && d.wicket_type !== 'RUN_OUT') {
            bowlers[d.bowler_id].wickets += 1;
          }
        }
      });

      const batArr = Object.values(batters).map(b => ({
        ...b,
        strikeRate: b.balls > 0 ? ((b.runs / b.balls) * 100).toFixed(1) : '0.0'
      }));

      const bowlArr = Object.values(bowlers).map(b => ({
        ...b,
        overs: `${Math.floor(b.balls / 6)}.${b.balls % 6}`,
        economy: b.balls > 0 ? ((b.runs / b.balls) * 6).toFixed(1) : '0.0'
      }));

      const oversStr = `${Math.floor(legalBalls / 6)}.${legalBalls % 6}`;
      return { runs, wickets, extras, overs: oversStr, batting: batArr, bowling: bowlArr };
    };

    const stats1 = innings.length > 0 ? computeInningsStats(innings[0].id) : { runs: 0, wickets: 0, extras: 0, overs: '0.0', batting: [], bowling: [] };
    const stats2 = innings.length > 1 ? computeInningsStats(innings[1].id) : { runs: 0, wickets: 0, extras: 0, overs: '0.0', batting: [], bowling: [] };

    // Find Top Performers across both innings
    const allBatters = [...stats1.batting, ...stats2.batting].sort((a, b) => b.runs - a.runs);
    const allBowlers = [...stats1.bowling, ...stats2.bowling].sort((a, b) => b.wickets - a.wickets || a.runs - b.runs);

    const topBatter = allBatters[0] ? { name: allBatters[0].name, stat: `${allBatters[0].runs} (${allBatters[0].balls})` } : null;
    const topBowler = allBowlers[0] ? { name: allBowlers[0].name, stat: `${allBowlers[0].wickets}/${allBowlers[0].runs}` } : null;

    return {
      id: matchData.id,
      tournament: matchData.tournament_id,
      venue: matchData.venue_name || 'JDCA Ground',
      date: matchData.scheduled_at ? new Date(matchData.scheduled_at).toLocaleDateString() : 'Unknown Date',
      resultText: matchData.result_text || matchData.status,
      manOfTheMatch: matchData.man_of_the_match ? { id: matchData.man_of_the_match.id, name: matchData.man_of_the_match.full_name } : null,
      teamA: {
        name: matchData.home_team?.name || 'Home Team',
        score: innings.length > 0 ? `${stats1.runs}/${stats1.wickets}` : '',
        overs: innings.length > 0 ? `(${stats1.overs} ov)` : '',
        extras: stats1.extras
      },
      teamB: {
        name: matchData.away_team?.name || 'Away Team',
        score: innings.length > 1 ? `${stats2.runs}/${stats2.wickets}` : '',
        overs: innings.length > 1 ? `(${stats2.overs} ov)` : '',
        extras: stats2.extras
      },
      scorecard: {
        teamA: { batting: stats1.batting, bowling: stats2.bowling },
        teamB: { batting: stats2.batting, bowling: stats1.bowling }
      },
      topBatter,
      topBowler
    };
  },

  /**
   * Fetches or creates the Supabase innings record for a match and innings number.
   * Guarantees returning a real innings object with its valid UUID.
   */
  async getOrCreateInnings(matchId, inningsNumber = 1) {
    if (!matchId || !supabase) return null;

    // 1. Check if innings already exists
    const { data: existing, error: fetchErr } = await supabase
      .from('innings')
      .select('*')
      .eq('match_id', matchId)
      .eq('innings_number', Number(inningsNumber) || 1)
      .maybeSingle();

    if (!fetchErr && existing) {
      return existing;
    }

    // 2. Fetch match to determine home/away teams
    const { data: match, error: matchErr } = await supabase
      .from('matches')
      .select('id, home_team_id, away_team_id, max_overs, toss_winner_id, toss_decision')
      .eq('id', matchId)
      .single();

    if (matchErr) throw matchErr;
    if (!match || !match.home_team_id || !match.away_team_id) {
      throw new Error("Cannot create innings: match details missing or teams not set.");
    }

    // Determine batting and bowling team
    let battingTeamId = match.home_team_id;
    let bowlingTeamId = match.away_team_id;

    if (match.toss_winner_id) {
      const tossWinnerBats = match.toss_decision === 'BAT';
      const tossWinnerIsHome = match.toss_winner_id === match.home_team_id;
      const homeBatsFirst = (tossWinnerIsHome && tossWinnerBats) || (!tossWinnerIsHome && !tossWinnerBats);
      battingTeamId = homeBatsFirst ? match.home_team_id : match.away_team_id;
      bowlingTeamId = homeBatsFirst ? match.away_team_id : match.home_team_id;
    }

    if (Number(inningsNumber) === 2) {
      const temp = battingTeamId;
      battingTeamId = bowlingTeamId;
      bowlingTeamId = temp;
    }

    const { data: newInnings, error: insertErr } = await supabase
      .from('innings')
      .insert({
        match_id: matchId,
        innings_number: Number(inningsNumber) || 1,
        batting_team_id: battingTeamId,
        bowling_team_id: bowlingTeamId,
        overs_limit: match.max_overs || 20,
        status: 'IN_PROGRESS'
      })
      .select()
      .single();

    if (insertErr) {
      // In case another client created it simultaneously
      const { data: retry } = await supabase
        .from('innings')
        .select('*')
        .eq('match_id', matchId)
        .eq('innings_number', Number(inningsNumber) || 1)
        .maybeSingle();
      if (retry) return retry;

      throw insertErr;
    }

    return newInnings;
  },

  // ==========================================
  // PLAYERS & SEASON MIGRATION
  // ==========================================
  
  async getAgeCategories() {
    const { data, error } = await supabase
      .from('age_categories')
      .select('*')
      .order('rank_level', { ascending: true });
    if (error) throw error;
    return data;
  },

  async getPlayersBySeason(seasonId) {
    const { data, error } = await supabase
      .from('player_registrations')
      .select(`
        id,
        season_id,
        age_category:age_category_id(id, name, short_name, max_age_months),
        district:district_id(id, name),
        player:player_id (
          id,
          full_name,
          date_of_birth,
          gender,
          primary_role,
          batting_style,
          bowling_style,
          is_active
        )
      `)
      .eq('season_id', seasonId);
      
    if (error) throw error;
    
    // Flatten structure for easier use in UI
    return data.map(reg => ({
      registration_id: reg.id,
      player_id: reg.player.id,
      name: reg.player.full_name,
      dob: reg.player.date_of_birth,
      gender: reg.player.gender,
      district_id: reg.district?.id,
      district_name: reg.district?.name,
      current_age_category_id: reg.age_category?.id,
      current_age_category_name: reg.age_category?.short_name,
      is_active: reg.player.is_active
    }));
  },

  async bulkMigratePlayers(targetSeason, registrations) {
    // registrations is an array of { player_id, district_id, age_category_id }
    const mapped = registrations.map(r => ({
      player_id: r.player_id,
      district_id: r.district_id,
      age_category_id: r.age_category_id,
      season_id: targetSeason,
      status: 'APPROVED'
    }));

    // Use upsert or standard insert? Prevent duplicate constraint error using Postgres ON CONFLICT if we had a unique constraint on (player_id, season). 
    // Wait, let's just insert. We will filter duplicates in UI.
    const { data, error } = await supabase
      .from('player_registrations')
      .insert(mapped);

    if (error) throw error;
    return data;
  },

  async registerPlayer(playerData) {
    // Map form fields to schema
    const p = {
      full_name: playerData.name || 'New Player',
      date_of_birth: playerData.dob || '2000-01-01',
      gender: playerData.gender === 'Women' ? 'Women' : 'Men',
      primary_role: playerData.role || 'Batter',
      batting_style: playerData.battingStyle || 'Right-Hand Bat',
      bowling_style: playerData.bowlingStyle || 'None (Pure Batter)',
      avatar_url: playerData.avatar || null
    };

    const { data, error } = await supabase
      .from('players')
      .insert(p)
      .select()
      .single();

    if (error) {
      console.error('[api] Failed to register player:', error);
      throw error;
    }
    
    // Also create registration mapping
    const defaults = await this.getDefaults();
    if (defaults.district_id) {
       await supabase.from('player_registrations').insert({
         player_id: data.id,
         season_id: playerData.season_id,
         district_id: defaults.district_id
       });
    }

    return data;
  },

  // ==========================================
  // USERS / ADMIN
  // ==========================================
  
  async getProfiles() {
    const { data, error } = await supabase
      .from('profiles')
      .select('*, district:district_id(name)')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  },

  async updateUserPermissions(userId, permissions) {
    const { data, error } = await supabase
      .from('profiles')
      .update({ 
        can_view: permissions.can_view, 
        can_add: permissions.can_add, 
        can_edit: permissions.can_edit, 
        can_delete: permissions.can_delete 
      })
      .eq('id', userId)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async updateUserRole(userId, newRole) {
    const { data, error } = await supabase
      .from('profiles')
      .update({ role: newRole })
      .eq('id', userId)
      .select()
      .single();
      
    if (error) throw error;
    return data;
  },

  async updateUserStatus(userId, isActive) {
    const { error } = await supabase.from('profiles').update({ is_active: isActive }).eq('id', userId);
    if (error) throw error;
  },

  async deleteUser(userId) {
    const { error } = await supabase.rpc('admin_delete_user', { target_user_id: userId });
    
    if (error) {
      // Fallback: If the SQL function isn't deployed, at least delete from profiles
      if (error.message && error.message.includes('Could not find the function')) {
        const { error: profileError } = await supabase.from('profiles').delete().eq('id', userId);
        if (profileError) throw profileError;
      } else {
        throw error;
      }
    }
  },

  async resetUserPassword(userId, newPassword) {
    const { error } = await supabase.rpc('admin_reset_password', { 
      target_user_id: userId, 
      new_password: newPassword 
    });
    if (error) throw error;
  },

  async assignScorer(matchId, scorerName) {
    const { error } = await supabase
      .from('matches')
      .update({ scorer_name: scorerName })
      .eq('id', matchId);
    if (error) throw error;
    return true;
  },

  // ==========================================
  // SCORING READINESS: MATCH SETUP
  // ==========================================

  async persistMatchSetup(matchId, setupData) {
    if (!matchId || !setupData) throw new Error("Match ID and setup data are required.");
    
    // 1. Fetch match to verify it exists and get team IDs if not explicitly passed
    const { data: match, error: matchError } = await supabase
      .from('matches')
      .select('id, home_team_id, away_team_id, status')
      .eq('id', matchId)
      .single();
      
    if (matchError || !match) {
      throw new Error("Match not found.");
    }
    
    if (match.status === 'COMPLETED' || match.status === 'CANCELLED') {
      throw new Error(`Cannot setup a match that is ${match.status}.`);
    }

    // Resolve toss winner team ID
    let tossWinnerTeamId = null;
    let tossDecision = setupData.tossDecision || 'BAT'; // BAT or BOWL

    if (setupData.tossWinner === 'teamA') {
      tossWinnerTeamId = match.home_team_id;
    } else if (setupData.tossWinner === 'teamB') {
      tossWinnerTeamId = match.away_team_id;
    }

    // 2. Prepare rosters
    const homeRoster = setupData.teamAXI?.map((p, i) => ({
      match_id: matchId,
      team_id: match.home_team_id,
      player_id: p.id,
      is_playing_xi: true,
      is_captain: !!p.isCaptain,
      is_wicketkeeper: p.role === 'Wicket Keeper',
      batting_order: i + 1
    })) || [];

    const awayRoster = setupData.teamBXI?.map((p, i) => ({
      match_id: matchId,
      team_id: match.away_team_id,
      player_id: p.id,
      is_playing_xi: true,
      is_captain: !!p.isCaptain,
      is_wicketkeeper: p.role === 'Wicket Keeper',
      batting_order: i + 1
    })) || [];
    
    const allRoster = [...homeRoster, ...awayRoster];

    if (allRoster.length === 0) {
       console.warn("No playing XI provided, creating match without roster.");
    }

    // Delete existing rosters for this match to ensure clean state
    await supabase.from('match_rosters').delete().eq('match_id', matchId);

    // Insert new rosters
    if (allRoster.length > 0) {
      const { error: rosterError } = await supabase
        .from('match_rosters')
        .insert(allRoster);
        
      if (rosterError) throw rosterError;
    }

    // 3. Update Match Status and Toss
    const { error: updateError } = await supabase
      .from('matches')
      .update({
        toss_winner_id: tossWinnerTeamId || null,
        toss_decision: tossWinnerTeamId ? tossDecision : null,
        status: 'IN_PROGRESS'
      })
      .eq('id', matchId);
      
    if (updateError) throw updateError;
    
    return true;
  },

  // ==========================================
  // SCORING COMPLETION: FINALIZE MATCH
  // ==========================================

  async finalizeMatch(matchId, winnerId, resultMargin, resultText, manOfTheMatchId = null) {
    if (!matchId) throw new Error("Match ID required");
    
    const { error } = await supabase
      .from('matches')
      .update({
        status: 'COMPLETED',
        winner_team_id: winnerId,
        result_margin: resultMargin,
        result_text: resultText,
        man_of_the_match_id: manOfTheMatchId
      })
      .eq('id', matchId);
      
    if (error) {
      console.error('[api] Failed to finalize match:', error);
      throw error;
    }
    
    return true;
  },

  async assignManOfTheMatch(matchId, playerId) {
    if (!matchId) throw new Error("Match ID required");
    const { error } = await supabase
      .from('matches')
      .update({ man_of_the_match_id: playerId })
      .eq('id', matchId);
    
    if (error) throw error;
    return true;
  }
};
