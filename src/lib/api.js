import { supabase } from './supabase';

export const calculatePlayerAge = (dob, referenceDate = new Date()) => {
  if (!dob) return 99;
  const birthDate = new Date(dob);
  let age = referenceDate.getFullYear() - birthDate.getFullYear();
  const m = referenceDate.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && referenceDate.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
};

export const parseOversFromFormat = (fmt, fallback = 20) => {
  if (!fmt && fmt !== 0) return fallback;
  if (typeof fmt === 'number') return fmt;
  const str = String(fmt).trim();
  const match = str.match(/(\d+)\s*(?:overs?|ov)?/i);
  if (match) return parseInt(match[1], 10);
  if (/^t20/i.test(str)) return 20;
  if (/^t10/i.test(str)) return 10;
  if (/^odi/i.test(str)) return 50;
  if (/^the hundred/i.test(str) || /^100/i.test(str)) return 20;
  return fallback;
};

export const withTimeout = (promise, ms = 3500) => {
  return Promise.race([
    promise,
    new Promise((_, reject) => setTimeout(() => reject(new Error(`Request timed out after ${ms}ms`)), ms))
  ]);
};

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

    const { data: seasonData } = await supabase.from('seasons').select('name').eq('id', tournamentData.season_id).single();

    const { data, error } = await supabase
      .from('tournaments')
      .insert({
        name: tournamentData.name,
        season_id: tournamentData.season_id,
        season: seasonData?.name || '2024-25',
        format: tournamentData.format || 'T20',
        age_category_id: tournamentData.age_category_id || defaults.age_category_id,
        gender: tournamentData.gender || 'Men',
        start_date: tournamentData.start_date || tournamentData.startDate || null,
        end_date: tournamentData.end_date || tournamentData.endDate || null,
        status: tournamentData.status || 'UPCOMING'
      })
      .select()
      .single();

    if (error) {
      if (error.code === '23505') {
        const customError = new Error('DUPLICATE_TOURNAMENT');
        customError.code = 'DUPLICATE_TOURNAMENT';
        throw customError;
      }
      throw error;
    }

    if (tournamentData.participatingTeams && tournamentData.participatingTeams.length > 0) {
      const teamInserts = tournamentData.participatingTeams.map(teamId => ({
        tournament_id: data.id,
        team_id: teamId
      }));
      const { error: teamErr } = await supabase.from('tournament_teams').insert(teamInserts);
      if (teamErr) throw teamErr;
    }

    return data;
  },

  async updateTournament(id, tournamentData) {
    const { data: seasonData } = await supabase.from('seasons').select('name').eq('id', tournamentData.season_id).single();

    const { data, error } = await supabase
      .from('tournaments')
      .update({
        name: tournamentData.name,
        season_id: tournamentData.season_id,
        season: seasonData?.name || '2024-25',
        format: tournamentData.format,
        age_category_id: tournamentData.age_category_id,
        gender: tournamentData.gender,
        start_date: tournamentData.start_date !== undefined ? tournamentData.start_date : (tournamentData.startDate || null),
        end_date: tournamentData.end_date !== undefined ? tournamentData.end_date : (tournamentData.endDate || null),
        status: tournamentData.status
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    if (tournamentData.participatingTeams) {
      await supabase.from('tournament_teams').delete().eq('tournament_id', id);
      if (tournamentData.participatingTeams.length > 0) {
        const teamInserts = tournamentData.participatingTeams.map(teamId => ({
          tournament_id: id,
          team_id: teamId
        }));
        const { error: teamErr } = await supabase.from('tournament_teams').insert(teamInserts);
        if (teamErr) throw teamErr;
      }
    }

    return data;
  },

  async deleteTournament(id) {
    const timestamp = new Date().toISOString();
    const { data: { user } } = await supabase.auth.getUser();
    const deleted_by = user?.id || null;

    const { error } = await supabase
      .from('tournaments')
      .update({ deleted_at: timestamp, deleted_by })
      .eq('id', id);

    if (error) throw error;

    const { error: matchError } = await supabase
      .from('matches')
      .update({ deleted_at: timestamp, deleted_by })
      .eq('tournament_id', id);
      
    if (matchError) console.error("Failed to soft-delete matches:", matchError);

    return true;
  },

  async deleteMatch(id) {
    const { data: { user } } = await supabase.auth.getUser();
    const { data, error } = await supabase
      .from('matches')
      .update({ deleted_at: new Date().toISOString(), deleted_by: user?.id || null })
      .eq('id', id)
      .select();

    if (error) throw error;
    if (!data || data.length === 0) throw new Error("Permission denied. You cannot delete this match (it might be locked or completed).");
    return true;
  },

  async deletePlayer(id) {
    const { data: { user } } = await supabase.auth.getUser();
    const { data, error } = await supabase
      .from('players')
      .update({ deleted_at: new Date().toISOString(), deleted_by: user?.id || null })
      .eq('id', id)
      .select();

    if (error) throw error;
    if (!data || data.length === 0) throw new Error("Permission denied or player not found");
    return true;
  },

  async deleteTeam(id) {
    const { data: { user } } = await supabase.auth.getUser();
    const { data, error } = await supabase
      .from('teams')
      .update({ deleted_at: new Date().toISOString(), deleted_by: user?.id || null })
      .eq('id', id)
      .select();

    if (error) throw error;
    if (!data || data.length === 0) throw new Error("Permission denied or team not found");
    return true;
  },

  // ==========================================
  // RECYCLE BIN (SOFT DELETES)
  // ==========================================
  async getRecycleBinItems() {
    // We run these in parallel
    const [tRes, mRes, pRes, teamRes] = await Promise.all([
      supabase.from('tournaments').select('id, name, deleted_at, deleted_by').not('deleted_at', 'is', null),
      supabase.from('matches').select('id, match_format, scheduled_at, deleted_at, deleted_by, home_team:teams!matches_home_team_id_fkey(name), away_team:teams!matches_away_team_id_fkey(name)').not('deleted_at', 'is', null),
      supabase.from('players').select('id, full_name, deleted_at, deleted_by').not('deleted_at', 'is', null),
      supabase.from('teams').select('id, name, deleted_at, deleted_by').not('deleted_at', 'is', null)
    ]);

    if (tRes.error) throw tRes.error;
    if (mRes.error) throw mRes.error;
    if (pRes.error) throw pRes.error;
    if (teamRes.error) throw teamRes.error;

    const items = [];

    if (tRes.data) {
      tRes.data.forEach(t => items.push({ id: t.id, type: 'TOURNAMENT', name: t.name, deleted_at: t.deleted_at, deleted_by: t.deleted_by }));
    }
    if (mRes.data) {
      mRes.data.forEach(m => items.push({ 
        id: m.id, 
        type: 'MATCH', 
        name: `${m.home_team?.name} vs ${m.away_team?.name} (${m.match_format})`, 
        deleted_at: m.deleted_at,
        deleted_by: m.deleted_by
      }));
    }
    if (pRes.data) {
      pRes.data.forEach(p => items.push({ id: p.id, type: 'PLAYER', name: p.full_name || 'Unknown Player', deleted_at: p.deleted_at, deleted_by: p.deleted_by }));
    }
    if (teamRes.data) {
      teamRes.data.forEach(team => items.push({ id: team.id, type: 'TEAM', name: team.name, deleted_at: team.deleted_at, deleted_by: team.deleted_by }));
    }
    
    // Sort by deleted_at descending
    return items.sort((a, b) => new Date(b.deleted_at) - new Date(a.deleted_at));
  },

  async restoreItem(type, id) {
    let table = '';
    if (type === 'TOURNAMENT') table = 'tournaments';
    else if (type === 'MATCH') table = 'matches';
    else if (type === 'PLAYER') table = 'players';
    else if (type === 'TEAM') table = 'teams';
    else throw new Error("Invalid type");

    const { data, error } = await supabase.from(table).update({ deleted_at: null, deleted_by: null }).eq('id', id).select();
    if (error) throw error;
    if (!data || data.length === 0) throw new Error("Permission denied. You cannot restore this item.");
    return true;
  },

  async hardDeleteItem(type, id) {
    let table = '';
    if (type === 'TOURNAMENT') table = 'tournaments';
    else if (type === 'MATCH') table = 'matches';
    else if (type === 'PLAYER') table = 'players';
    else if (type === 'TEAM') table = 'teams';
    else throw new Error("Invalid type");

    let avatarUrlToDelete = null;

    // If it's a player, grab the avatar_url before we wipe the row
    if (type === 'PLAYER') {
      const { data: pData } = await supabase
        .from('players')
        .select('avatar_url')
        .eq('id', id)
        .single();
      if (pData && pData.avatar_url) {
        avatarUrlToDelete = pData.avatar_url;
      }
    }

    // Manual Cascade for safety
    if (type === 'TEAM') {
      await supabase.from('team_players').delete().eq('team_id', id);
    } else if (type === 'PLAYER') {
      await supabase.from('team_players').delete().eq('player_id', id);
      await supabase.from('player_registrations').delete().eq('player_id', id);
    } else if (type === 'MATCH') {
      // Find innings first to delete deliveries if no DB cascade exists
      const { data: innings } = await supabase.from('innings').select('id').eq('match_id', id);
      if (innings && innings.length > 0) {
        for (const inning of innings) {
          await supabase.from('deliveries').delete().eq('innings_id', inning.id);
        }
      }
      await supabase.from('innings').delete().eq('match_id', id);
    } else if (type === 'TOURNAMENT') {
      // Matches should theoretically be deleted or we don't allow it. 
      // But let's let DB handle it or fail safely.
    }

    const { data, error } = await supabase.from(table).delete().eq('id', id).select();
    if (error) throw error;
    if (!data || data.length === 0) throw new Error("Permission denied. You can only permanently delete items that you deleted.");

    // After successful hard delete, remove photo from Cloudinary if supported securely
    if (avatarUrlToDelete) {
      try {
        const { deleteCloudinaryImage } = await import('./cloudinary.js');
        await deleteCloudinaryImage(
          avatarUrlToDelete,
          import.meta.env.VITE_CLOUDINARY_API_KEY,
          undefined, // Secrets must not be baked into the client bundle
          import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
        );
      } catch (err) {
        console.warn('[api] Cloudinary deletion skipped (requires backend service key):', err);
      }
    }

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

  async getSelectorAgeCategory(selectorId) {
    const { data, error } = await supabase
      .from('profiles')
      .select('selector_age_category_id, selector_age_category:selector_age_category_id(id, name, short_name, rank_level)')
      .eq('id', selectorId)
      .single();
    if (error) throw error;
    return data?.selector_age_category || null;
  },

  async updateSelectorAgeCategory(selectorId, ageCategoryId) {
    const { error } = await supabase
      .from('profiles')
      .update({ selector_age_category_id: ageCategoryId || null })
      .eq('id', selectorId);
    if (error) throw error;
  },

  async getAgeCategories() {
    const { data, error } = await supabase
      .from('age_categories')
      .select('id, name, short_name, rank_level, minimum_age, maximum_age')
      .eq('is_active', true)
      .order('rank_level', { ascending: true });
    if (error) throw error;
    return data || [];
  },

  async getJdcaDivisionTeams() {
    const { data, error } = await supabase
      .from('teams')
      .select('*, district:district_id(*), age_category:age_category_id(*), team_players(player_id, player:player_id(id, full_name, primary_role, avatar_url, batting_style, bowling_style, date_of_birth))')
      .eq('team_type', 'JDCA_REPRESENTATIVE')
      .is('deleted_at', null);
    if (error) throw error;
    return data || [];
  },

  async createJdcaDivisionTeam(teamData) {
    const { data, error } = await supabase
      .from('teams')
      .insert({
        name: teamData.name,
        short_name: teamData.short_name || teamData.name.substring(0, 5).toUpperCase(),
        season: teamData.season,
        season_id: teamData.season_id,
        age_category_id: teamData.age_category_id,
        gender: teamData.gender || 'Men',
        team_type: 'JDCA_REPRESENTATIVE',
        is_active: true
      })
      .select('*, age_category:age_category_id(*)')
      .single();
    if (error) throw error;
    return data;
  },

  async addPlayersToTeam(teamId, playerIds) {
    const inserts = playerIds.map(pid => ({ team_id: teamId, player_id: pid }));
    const { error } = await supabase.from('team_players').insert(inserts);
    if (error) throw error;
  },

  async removePlayerFromTeam(teamId, playerId) {
    const { error } = await supabase
      .from('team_players')
      .delete()
      .eq('team_id', teamId)
      .eq('player_id', playerId);
    if (error) throw error;
  },

  async saveRepresentativeSquad(teamData, playerIds = [], roles = {}) {
    let teamId = teamData.id;
    const isTempId = !teamId || String(teamId).startsWith('team_');

    if (isTempId) {
      let query = supabase
        .from('teams')
        .select('id')
        .eq('team_type', 'JDCA_REPRESENTATIVE')
        .is('deleted_at', null);

      if (teamData.age_category_id) {
        query = query.eq('age_category_id', teamData.age_category_id).eq('gender', teamData.gender || 'Men');
      } else {
        query = query.eq('name', teamData.name);
      }

      const { data: existing } = await query.maybeSingle();

      if (existing) {
        teamId = existing.id;
      } else {
        const created = await this.createJdcaDivisionTeam(teamData);
        teamId = created.id;
      }
    }

    try {
      await supabase
        .from('teams')
        .update({
          captain_id: roles.captainId || null,
          vice_captain_id: roles.viceCaptainId || null,
          is_active: true
        })
        .eq('id', teamId);
    } catch (e) {
      // Column might not exist in some legacy schemas
    }

    // Refresh roster
    await supabase.from('team_players').delete().eq('team_id', teamId);
    if (playerIds && playerIds.length > 0) {
      const inserts = playerIds.map(pid => ({ team_id: teamId, player_id: pid }));
      const { error: insErr } = await supabase.from('team_players').insert(inserts);
      if (insErr) console.warn('[saveRepresentativeSquad] team_players insert error:', insErr);
    }

    return teamId;
  },

  async rebuildTeams() {
    const { data: districts } = await supabase.from('districts').select('id, name').eq('is_active', true);
    const { data: ageCategories } = await supabase.from('age_categories').select('id, name, short_name, gender').eq('is_active', true);
    if (!districts || !ageCategories) return;

    const teamsToInsert = [];

    const activeSeasonData = await this.getActiveSeason();
    if (!activeSeasonData) return;

    districts.forEach(d => {
      ageCategories.forEach(ac => {
        const g = ac.gender || 'Men'; // Default fallback
        teamsToInsert.push({
          name: `${d.name} ${ac.name}`,
          short_name: `${ac.short_name}`,
          season_id: activeSeasonData.id,
          district_id: d.id,
          age_category_id: ac.id,
          gender: g,
          is_active: true
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
    
    // Resolve the age category based on teamData.age_category_id
    const ageCategoryId = teamData.age_category_id || defaults.age_category_id;

    if (!ageCategoryId) {
      throw new Error("No age categories provided.");
    }

    const { data: seasonData } = await supabase.from('seasons').select('name').eq('id', teamData.season_id).single();
    const seasonName = seasonData?.name || 'Season 2026';

    const { data, error } = await supabase
      .from('teams')
      .insert({
        name: teamData.name,
        short_name: teamData.shortName || teamData.name.substring(0, 3).toUpperCase(),
        season: seasonName,
        season_id: teamData.season_id,
        district_id: defaults.district_id,
        age_category_id: ageCategoryId,
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


  async createDetailedMatches(tournamentId, format, matchesArray) {
    if (!matchesArray || matchesArray.length === 0) return { created: 0, skipped: 0, failed: 0 };
    
    const matchesToInsert = matchesArray.map(m => {
      if (!m.home_team_id && !m.homeTeamId) {
        throw new Error("Please select both Home and Away teams for all matches.");
      }
      const matchFmt = m.match_format || m.format || format || 'T20';
      const scheduledVal = m.scheduled_at || m.date || m.scheduledAt;
      const oversVal = m.max_overs || m.overs || parseOversFromFormat(matchFmt, 20);
      return {
        tournament_id: tournamentId,
        home_team_id: m.home_team_id || m.homeTeamId || null,
        away_team_id: m.away_team_id || m.awayTeamId || null,
        scheduled_at: scheduledVal ? new Date(scheduledVal).toISOString() : new Date().toISOString(),
        status: 'SCHEDULED',
        match_format: matchFmt,
        max_overs: oversVal,
        venue_name: m.venueName || null,
        umpire_name: m.umpireName || null,
        scorer_name: m.scorerName || null,
        ball_type: m.ballType || null
      };
    });

    let createdCount = 0;
    let skippedCount = 0;
    let failedCount = 0;
    const insertedMatches = [];

    // Try bulk insert first for performance
    const { data, error } = await supabase
      .from('matches')
      .insert(matchesToInsert)
      .select();

    if (!error && data) {
      return {
        created: data.length,
        skipped: 0,
        failed: 0,
        data
      };
    }

    if (error.code === '23505') {
      // Concurrency safe fallback: insert one by one
      for (const match of matchesToInsert) {
        const { data: singleData, error: singleError } = await supabase
          .from('matches')
          .insert(match)
          .select()
          .maybeSingle();

        if (!singleError && singleData) {
          createdCount++;
          insertedMatches.push(singleData);
        } else if (singleError && singleError.code === '23505') {
          skippedCount++;
        } else {
          failedCount++;
        }
      }
    } else {
      console.error("[api.js] Database Error during match creation:", error);
      const customError = new Error('UNKNOWN_DATABASE_ERROR');
      customError.code = 'UNKNOWN_DATABASE_ERROR';
      customError.details = error;
      customError.originalMessage = error.message;
      throw customError;
    }

    return {
      created: createdCount,
      skipped: skippedCount,
      failed: failedCount,
      data: insertedMatches
    };
  },

  async updateMatchDetails(matchId, matchData) {
    const updatePayload = {};
    if (matchData.home_team_id !== undefined) updatePayload.home_team_id = matchData.home_team_id;
    else if (matchData.homeTeamId !== undefined) updatePayload.home_team_id = matchData.homeTeamId;
    
    if (matchData.away_team_id !== undefined) updatePayload.away_team_id = matchData.away_team_id;
    else if (matchData.awayTeamId !== undefined) updatePayload.away_team_id = matchData.awayTeamId;
    
    const scheduledVal = matchData.scheduled_at || matchData.scheduledAt || matchData.date;
    if (scheduledVal !== undefined) updatePayload.scheduled_at = new Date(scheduledVal).toISOString();
    if (matchData.format !== undefined) updatePayload.match_format = matchData.format;
    if (matchData.max_overs !== undefined) {
      updatePayload.max_overs = matchData.max_overs;
    } else if (matchData.format !== undefined) {
      updatePayload.max_overs = parseOversFromFormat(matchData.format, 20);
    }
    if (matchData.venueName !== undefined) updatePayload.venue_name = matchData.venueName;
    if (matchData.umpireName !== undefined) updatePayload.umpire_name = matchData.umpireName;
    if (matchData.scorerName !== undefined) updatePayload.scorer_name = matchData.scorerName;
    if (matchData.status !== undefined) updatePayload.status = matchData.status;
    if (matchData.result_text !== undefined) updatePayload.result_text = matchData.result_text;
    if (matchData.winner_team_id !== undefined) updatePayload.winner_team_id = matchData.winner_team_id;
    if (matchData.result_margin !== undefined) updatePayload.result_margin = matchData.result_margin;

    const { data, error } = await supabase
      .from('matches')
      .update(updatePayload)
      .eq('id', matchId)
      .select();

    if (error) throw error;
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
    
    // 1. Fetch match and teams (with offline Dexie fallback)
    let match = null;
    let matchError = null;
    try {
      const res = await withTimeout(
        supabase
          .from('matches')
          .select('*, home_team:teams!matches_home_team_id_fkey(*), away_team:teams!matches_away_team_id_fkey(*)')
          .eq('id', matchId)
          .single(),
        3000
      );
      match = res.data;
      matchError = res.error;
    } catch (err) {
      matchError = err;
    }

    if (matchError || !match) {
      try {
        const { db } = await import('./db');
        match = await db.matches.get(matchId);
      } catch (e) {}
    }

    if (!match) throw (matchError || new Error("Match not found"));

    // 2. Fetch Match Rosters
    let rosters = null;
    try {
      const { data, error } = await withTimeout(
        supabase
          .from('match_rosters')
          .select('*, player:players(*)')
          .eq('match_id', matchId),
        3000
      );
      if (!error && data) rosters = data;
    } catch (e) {}

    let home_team_roster = rosters?.filter(r => r.team_id === match.home_team_id).map(r => ({
      ...(r.player || {}),
      id: r.player_id || r.player?.id,
      name: r.player?.full_name || r.player?.name || 'Player',
      role: r.is_wicketkeeper ? 'Wicket Keeper' : (r.player?.primary_role || r.player?.role || 'Batter'),
      isCaptain: !!r.is_captain
    })) || [];
    let away_team_roster = rosters?.filter(r => r.team_id === match.away_team_id).map(r => ({
      ...(r.player || {}),
      id: r.player_id || r.player?.id,
      name: r.player?.full_name || r.player?.name || 'Player',
      role: r.is_wicketkeeper ? 'Wicket Keeper' : (r.player?.primary_role || r.player?.role || 'Batter'),
      isCaptain: !!r.is_captain
    })) || [];

    // Fallback: If remote rosters are empty, recover from cached setup
    if (home_team_roster.length === 0 || away_team_roster.length === 0) {
      try {
        const cachedSetup = JSON.parse(
          localStorage.getItem(`jdca-match-setup-${matchId}`) ||
          localStorage.getItem(`jdca_match_setup_${matchId}`) ||
          'null'
        );
        if (cachedSetup) {
          if (home_team_roster.length === 0 && Array.isArray(cachedSetup.teamAXI) && cachedSetup.teamAXI.length > 0) {
            home_team_roster = cachedSetup.teamAXI;
          }
          if (away_team_roster.length === 0 && Array.isArray(cachedSetup.teamBXI) && cachedSetup.teamBXI.length > 0) {
            away_team_roster = cachedSetup.teamBXI;
          }
        }
      } catch (e) {}
    }

    // 3. Fetch Innings
    let inningsData = null;
    try {
      const { data } = await withTimeout(
        supabase
          .from('innings')
          .select('*')
          .eq('match_id', matchId)
          .order('innings_number', { ascending: false })
          .limit(1),
        3000
      );
      if (data) inningsData = data;
    } catch (e) {}

    let currentInning = inningsData && inningsData.length > 0 ? inningsData[0] : null;
    if (!currentInning) {
      try {
        const { db } = await import('./db');
        const localInnings = await db.innings.where('match_id').equals(matchId).reverse().sortBy('innings_number');
        if (localInnings && localInnings.length > 0) {
          currentInning = localInnings[0];
        }
      } catch (e) {}
    }

    let deliveries = [];
    if (currentInning) {
      try {
        const { data: dData } = await withTimeout(
          supabase
            .from('deliveries')
            .select('*, striker:striker_id(*), non_striker:non_striker_id(*), bowler:bowler_id(*)')
            .eq('innings_id', currentInning.id)
            .order('delivery_sequence', { ascending: true }),
          3000
        );
        if (dData) deliveries = dData;
      } catch (e) {}

      if (deliveries.length === 0) {
        try {
          const { db } = await import('./db');
          const localDeliveries = await db.deliveries
            .where('innings_id').equals(currentInning.id)
            .sortBy('ball_number');
          if (localDeliveries && localDeliveries.length > 0) {
            deliveries = localDeliveries;
          }
        } catch (e) {}
      }
    }

    return {
      match,
      home_team_roster,
      away_team_roster,
      currentInning,
      deliveries
    };
  },

  // ==========================================
  // MATCH REPORTS & SCORECARDS
  // ==========================================

  async getPlayerMatchStats(playerId) {
    if (!playerId) return { batting: [], bowling: [] };
    try {
      const [batRes, bowlRes] = await Promise.all([
        supabase.from('v_player_match_batting').select('*, matches(scheduled_at, home_team:home_team_id(name), away_team:away_team_id(name))').eq('player_id', playerId).order('match_id'),
        supabase.from('v_player_match_bowling').select('*, matches(scheduled_at, home_team:home_team_id(name), away_team:away_team_id(name))').eq('player_id', playerId).order('match_id')
      ]);

      const processMatches = (data) => {
        return (data || []).sort((a, b) => {
          const dateA = a.matches?.scheduled_at ? new Date(a.matches.scheduled_at) : new Date(0);
          const dateB = b.matches?.scheduled_at ? new Date(b.matches.scheduled_at) : new Date(0);
          return dateA - dateB;
        }).map(stat => ({
          ...stat,
          opponent: stat.matches?.home_team?.name || 'Unknown', // Simplification
          date: stat.matches?.scheduled_at ? new Date(stat.matches.scheduled_at).toLocaleDateString() : 'Unknown'
        }));
      };

      return {
        batting: processMatches(batRes.data),
        bowling: processMatches(bowlRes.data)
      };
    } catch (e) {
      console.error('Error fetching player match stats:', e);
      return { batting: [], bowling: [] };
    }
  },

  async getMatchScorecard(matchId) {
    if (!matchId) return null;

    const isOnline = typeof navigator !== 'undefined' ? navigator.onLine : true;

    // 1. Fetch match and teams (with Dexie offline fallback)
    let matchData = null;
    if (isOnline) {
      try {
        const res = await withTimeout(
          supabase
            .from('matches')
            .select('*, home_team:teams!matches_home_team_id_fkey(*), away_team:teams!matches_away_team_id_fkey(*), man_of_the_match:players!matches_man_of_the_match_id_fkey(id, full_name, avatar_url)')
            .eq('id', matchId)
            .single(),
          3000
        );
        matchData = res.data;
      } catch (e) {}
    }

    if (!matchData) {
      try {
        const { db } = await import('./db');
        matchData = await db.matches.get(matchId);
        if (!matchData) {
          const allLocal = await db.matches.toArray();
          matchData = allLocal.find(m => String(m.id) === String(matchId));
        }
      } catch (e) {}
    }

    if (!matchData) throw new Error("Match not found");

    // Enrich matchData if loaded from local Dexie
    try {
      const { db } = await import('./db');
      const hId = matchData.home_team_id || matchData.team_a_id || matchData.team_a;
      if ((!matchData.home_team || !matchData.home_team.name) && hId) {
        const t = await db.teams.get(hId);
        if (t) {
          matchData.home_team = {
            id: t.id,
            name: t.name,
            short_name: t.short_name || t.name?.slice(0, 3).toUpperCase(),
            score: matchData.home_team?.score || matchData.scorecard?.home_team?.score || '',
            overs: matchData.home_team?.overs || matchData.scorecard?.home_team?.overs || ''
          };
        }
      }
      const aId = matchData.away_team_id || matchData.team_b_id || matchData.team_b;
      if ((!matchData.away_team || !matchData.away_team.name) && aId) {
        const t = await db.teams.get(aId);
        if (t) {
          matchData.away_team = {
            id: t.id,
            name: t.name,
            short_name: t.short_name || t.name?.slice(0, 3).toUpperCase(),
            score: matchData.away_team?.score || matchData.scorecard?.away_team?.score || '',
            overs: matchData.away_team?.overs || matchData.scorecard?.away_team?.overs || ''
          };
        }
      }
      if (!matchData.tournament && matchData.tournament_id) {
        const tourn = await db.tournaments.get(matchData.tournament_id);
        if (tourn) matchData.tournament = tourn.name;
      }
    } catch (e) {}

    // 2. Fetch innings
    let inningsData = null;
    if (isOnline) {
      try {
        const res = await withTimeout(
          supabase
            .from('innings')
            .select('*')
            .eq('match_id', matchId)
            .order('innings_number', { ascending: true }),
          3000
        );
        inningsData = res.data;
      } catch (e) {}
    }

    // 3. Fetch deliveries with players
    let deliveriesData = null;
    if (isOnline) {
      try {
        const res = await withTimeout(
          supabase
            .from('deliveries')
            .select('*, striker:striker_id(full_name), bowler:bowler_id(full_name)')
            .eq('match_id', matchId),
          3000
        );
        deliveriesData = res.data;
      } catch (e) {}
    }

    let innings = inningsData || [];
    let deliveries = deliveriesData || [];

    // Fallback to local DB if Supabase hasn't received sync yet
    try {
      const { db } = await import('./db');
      if (innings.length === 0) {
        const localInnings = await db.innings.where('match_id').equals(matchId).sortBy('innings_number');
        if (localInnings.length > 0) innings = localInnings;
      }
      if (deliveries.length === 0) {
        const localDeliveries = await db.deliveries.where('match_id').equals(matchId).toArray();
        if (localDeliveries.length > 0) deliveries = localDeliveries;
      }
      
      // Augment with LOCAL PENDING deliveries to enable instant scorecard updates
      const pendingQueue = await db.sync_queue
        .where('action').equals('RECORD_DELIVERY')
        .toArray();
        
      const remoteIds = new Set(deliveries.map(d => d.idempotency_key || d.id));
      const pendingDeliveries = [];
      
      for (const p of pendingQueue) {
        const d = p.payload;
        // Strict filtering: must belong to THIS match, and not permanently failed
        if (!d || (d.matchId !== matchId && d.match_id !== matchId) || p.status === 'FAILED_PERMANENT') continue;
        
        const key = d.idempotency_key || d.id;
        if (!remoteIds.has(key)) {
          remoteIds.add(key);
          pendingDeliveries.push({
            id: d.id,
            idempotency_key: key,
            match_id: d.matchId || d.match_id,
            innings_id: d.inningsId || d.innings_id,
            striker_id: d.strikerId || d.striker_id,
            non_striker_id: d.nonStrikerId || d.non_striker_id,
            bowler_id: d.bowlerId || d.bowler_id,
            runs_off_bat: d.runsBatter ?? d.runs_off_bat ?? 0,
            runs_extras: d.runsExtras ?? d.runs_extras ?? 0,
            runs_total: d.runsTotal ?? d.runs_total ?? 0,
            is_legal_delivery: d.isLegalDelivery ?? d.is_legal_delivery ?? true,
            extra_type: d.extraType || d.extra_type || 'NONE',
            wicket_type: d.wicketType || d.wicket_type || 'NONE',
            event_type: d.eventType || d.event_type || (['RETIRED_HURT','RETIRED_OUT'].includes(d.wicketType || d.wicket_type) ? 'RETIREMENT' : 'DELIVERY'),
            dismissed_player_id: d.dismissedPlayerId || d.dismissed_player_id,
            is_pending: true // Marker for UI
          });
        }
      }
      
      if (pendingDeliveries.length > 0) {
        deliveries = [...deliveries, ...pendingDeliveries];
      }
      
      // Resolve missing player names (RLS blocks players table for anon sometimes, or offline players)
      const uniquePlayerIds = new Set();
      deliveries.forEach(d => {
        if (d.striker_id && !d.striker) uniquePlayerIds.add(d.striker_id);
        if (d.bowler_id && !d.bowler) uniquePlayerIds.add(d.bowler_id);
      });
      
      if (uniquePlayerIds.size > 0) {
        const localPlayers = await db.players.where('id').anyOf([...uniquePlayerIds]).toArray();
        deliveries = deliveries.map(d => {
          let st = d.striker;
          let bw = d.bowler;
          if (d.striker_id && !st) {
             const lp = localPlayers.find(p => p.id === d.striker_id);
             if (lp) st = { full_name: lp.full_name || lp.name };
          }
          if (d.bowler_id && !bw) {
             const lp = localPlayers.find(p => p.id === d.bowler_id);
             if (lp) bw = { full_name: lp.full_name || lp.name };
          }
          return { ...d, striker: st, bowler: bw };
        });
      }
    } catch (e) {
      console.warn('[api] Failed offline fallback in scorecard:', e);
    }

    // Helper: Compute stats for an innings
    const computeInningsStats = (inningId) => {
      const balls = deliveries
        .filter(d => d.innings_id === inningId)
        .slice()
        .sort((a, b) => (a.delivery_sequence || 0) - (b.delivery_sequence || 0));
      let runs = 0;
      let wickets = 0;
      let extras = 0;
      let legalBalls = 0;
      const fallOfWickets = [];

      const batters = {};
      const bowlers = {};

      balls.forEach(d => {
        const isDelivery = (d.event_type || 'DELIVERY') === 'DELIVERY';

        // Team total includes penalty runs; penalty runs are extras.
        runs += d.runs_total;
        if (d.extra_type !== 'NONE') extras += d.runs_extras;

        // Wickets: real dismissals from deliveries, plus retired-out.
        const isWicket = (isDelivery && d.wicket_type !== 'NONE') || d.wicket_type === 'RETIRED_OUT';
        if (isWicket) {
          wickets += 1;
          // Record FoW using legal-ball count AFTER this ball (set below for legal deliveries).
          const outName = (d.dismissed_player_id && d.striker_id === d.dismissed_player_id)
            ? (d.striker?.full_name || d.striker?.name)
            : (deliveries.find(x => x.striker_id === d.dismissed_player_id)?.striker?.full_name
               || deliveries.find(x => x.non_striker_id === d.dismissed_player_id)?.non_striker?.full_name
               || null);
          fallOfWickets.push({
            wicket: wickets,
            score: runs, // team total at the moment of fall (includes this ball's runs)
            player: outName || 'Unknown',
            legalBallsAt: legalBalls + ((d.extra_type === 'NONE' || d.extra_type === 'BYE' || d.extra_type === 'LEG_BYE') && isDelivery ? 1 : 0)
          });
        }

        // Penalties / retirements are NOT physical balls: no legal ball, no
        // per-player ball/run/bowler stats.
        if (!isDelivery) return;

        if (d.extra_type !== 'NONE' && d.extra_type !== 'BYE' && d.extra_type !== 'LEG_BYE') {
          // Wides/No-balls don't count as legal
        } else {
          legalBalls += 1;
        }

        // Batter Stats
        if (d.striker_id) {
          if (!batters[d.striker_id]) {
            batters[d.striker_id] = { id: d.striker_id, name: d.striker?.full_name || d.striker?.name || 'Unknown', runs: 0, balls: 0, fours: 0, sixes: 0, dismissal: 'not out' };
          }
          if (d.extra_type === 'NONE' || d.extra_type === 'NO_BALL' || d.extra_type === 'BYE' || d.extra_type === 'LEG_BYE') {
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
            bowlers[d.bowler_id] = { id: d.bowler_id, name: d.bowler?.full_name || d.bowler?.name || 'Unknown', balls: 0, runs: 0, wickets: 0, maidens: 0, wides: 0, noBalls: 0 };
          }
          if (d.extra_type === 'NONE' || d.extra_type === 'BYE' || d.extra_type === 'LEG_BYE') {
            bowlers[d.bowler_id].balls += 1;
          }
          if (d.extra_type !== 'BYE' && d.extra_type !== 'LEG_BYE') {
            bowlers[d.bowler_id].runs += d.runs_total;
          }
          if (d.wicket_type !== 'NONE' && d.wicket_type !== 'RUN_OUT' && d.wicket_type !== 'RETIRED_HURT' && d.wicket_type !== 'OBSTRUCTING_THE_FIELD' && d.wicket_type !== 'TIMED_OUT') {
            bowlers[d.bowler_id].wickets += 1;
          }
          if (d.extra_type === 'WIDE') {
            bowlers[d.bowler_id].wides += d.runs_extras;
          }
          if (d.extra_type === 'NO_BALL') {
            bowlers[d.bowler_id].noBalls += d.runs_extras;
          }
        }
      });

      const batArr = Object.values(batters).map(b => ({
        ...b,
        strikeRate: b.balls > 0 ? ((b.runs / b.balls) * 100).toFixed(1) : '0.0'
      }));

      // Maidens: an over of 6 legal balls where the bowler conceded nothing
      // charged to them (no wides, no-balls, no runs off bat; byes/leg-byes
      // are OK because they're not the bowler's fault). Group deliveries by
      // (bowler_id, over_number).
      const overBuckets = new Map();
      for (const d of balls) {
        if ((d.event_type || 'DELIVERY') !== 'DELIVERY') continue;
        if (!d.bowler_id) continue;
        const key = `${d.bowler_id}::${d.over_number ?? 0}`;
        if (!overBuckets.has(key)) {
          overBuckets.set(key, { legalBalls: 0, chargedRuns: 0, hadWideOrNb: false });
        }
        const bucket = overBuckets.get(key);
        const isLegal = d.extra_type === 'NONE' || d.extra_type === 'BYE' || d.extra_type === 'LEG_BYE';
        if (isLegal) bucket.legalBalls += 1;
        if (d.extra_type === 'WIDE' || d.extra_type === 'NO_BALL') bucket.hadWideOrNb = true;
        if (d.extra_type !== 'BYE' && d.extra_type !== 'LEG_BYE') {
          bucket.chargedRuns += d.runs_total || 0;
        }
      }
      for (const [key, bucket] of overBuckets) {
        if (bucket.legalBalls === 6 && !bucket.hadWideOrNb && bucket.chargedRuns === 0) {
          const bowlerId = key.split('::')[0];
          if (bowlers[bowlerId]) bowlers[bowlerId].maidens = (bowlers[bowlerId].maidens || 0) + 1;
        }
      }

      const bowlArr = Object.values(bowlers).map(b => ({
        ...b,
        overs: `${Math.floor(b.balls / 6)}.${b.balls % 6}`,
        economy: b.balls > 0 ? ((b.runs / b.balls) * 6).toFixed(1) : '0.0'
      }));

      const oversStr = `${Math.floor(legalBalls / 6)}.${legalBalls % 6}`;
      const fowFormatted = fallOfWickets.map(f => ({
        ...f,
        oversAt: `${Math.floor(f.legalBallsAt / 6)}.${f.legalBallsAt % 6}`
      }));
      return {
        runs,
        wickets,
        extras,
        overs: oversStr,
        legalBalls,
        batting: batArr,
        bowling: bowlArr,
        fallOfWickets: fowFormatted
      };
    };

    const stats1 = innings.length > 0 ? computeInningsStats(innings[0].id) : { runs: 0, wickets: 0, extras: 0, overs: '0.0', batting: [], bowling: [] };
    const stats2 = innings.length > 1 ? computeInningsStats(innings[1].id) : { runs: 0, wickets: 0, extras: 0, overs: '0.0', batting: [], bowling: [] };

    // Find Top Performers across both innings
    const allBatters = [...stats1.batting, ...stats2.batting].sort((a, b) => b.runs - a.runs);
    const allBowlers = [...stats1.bowling, ...stats2.bowling].sort((a, b) => b.wickets - a.wickets || a.runs - b.runs);

    const topBatter = allBatters[0] ? { name: allBatters[0].name, stat: `${allBatters[0].runs} (${allBatters[0].balls})` } : null;
    const topBowler = allBowlers[0] ? { name: allBowlers[0].name, stat: `${allBowlers[0].wickets}/${allBowlers[0].runs}` } : null;

    // Best partnership: walk each innings' deliveries in order, break at each
    // dismissal, track runs between the two batters currently at the crease.
    const computeBestPartnership = (inningId) => {
      const inningBalls = deliveries
        .filter(d => d.innings_id === inningId && (d.event_type || 'DELIVERY') === 'DELIVERY')
        .slice()
        .sort((a, b) => (a.delivery_sequence || 0) - (b.delivery_sequence || 0));
      if (!inningBalls.length) return null;

      let best = null;
      let currentPair = null; // { ids:Set, names:Map, runs, balls }

      const startPair = (strikerId, nonStrikerId, strikerName, nonStrikerName) => {
        currentPair = {
          ids: new Set([strikerId, nonStrikerId].filter(Boolean)),
          names: new Map([[strikerId, strikerName], [nonStrikerId, nonStrikerName]]),
          runs: 0,
          balls: 0
        };
      };

      for (const d of inningBalls) {
        if (!currentPair) {
          startPair(d.striker_id, d.non_striker_id, d.striker?.full_name || d.striker?.name, '');
        } else {
          if (d.striker_id && !currentPair.ids.has(d.striker_id)) {
            currentPair.ids.add(d.striker_id);
            currentPair.names.set(d.striker_id, d.striker?.full_name || d.striker?.name);
          }
          if (d.non_striker_id && !currentPair.ids.has(d.non_striker_id)) {
            currentPair.ids.add(d.non_striker_id);
            currentPair.names.set(d.non_striker_id, '');
          }
        }
        currentPair.runs += d.runs_total || 0;
        if (d.extra_type === 'NONE' || d.extra_type === 'BYE' || d.extra_type === 'LEG_BYE' || d.extra_type === 'NO_BALL') {
          currentPair.balls += 1;
        }
        if (d.wicket_type && d.wicket_type !== 'NONE' && d.wicket_type !== 'RETIRED_HURT') {
          if (!best || currentPair.runs > best.runs) best = { ...currentPair };
          currentPair = null;
        }
      }
      if (currentPair && (!best || currentPair.runs > best.runs)) best = currentPair;
      if (!best || !best.ids.size) return null;

      const names = [...best.ids].map(id => best.names.get(id)).filter(Boolean);
      if (names.length < 2) return null;
      return {
        names: names.join(' & '),
        pair: names.join(' & '),
        runs: best.runs,
        balls: best.balls,
        stat: `${best.runs} runs (${best.balls} balls)`
      };
    };

    const partnership1 = innings.length > 0 ? computeBestPartnership(innings[0].id) : null;
    const partnership2 = innings.length > 1 ? computeBestPartnership(innings[1].id) : null;
    let bestPartnership = null;
    if (partnership1 && partnership2) {
      bestPartnership = partnership1.runs >= partnership2.runs ? partnership1 : partnership2;
    } else {
      bestPartnership = partnership1 || partnership2 || null;
    }

    const rawMotm = Array.isArray(matchData.man_of_the_match) ? matchData.man_of_the_match[0] : matchData.man_of_the_match;
    let mvp = (rawMotm && (rawMotm.full_name || rawMotm.name)) ? {
      id: rawMotm.id,
      name: rawMotm.full_name || rawMotm.name,
      full_name: rawMotm.full_name || rawMotm.name,
      avatar_url: rawMotm.avatar_url || rawMotm.image
    } : null;

    if (!mvp && (matchData.playerOfMatch || matchData.manOfTheMatch)) {
      const alt = matchData.playerOfMatch || matchData.manOfTheMatch;
      const rawAlt = Array.isArray(alt) ? alt[0] : alt;
      if (rawAlt && (rawAlt.full_name || rawAlt.name || (typeof rawAlt === 'string' && rawAlt.trim()))) {
        mvp = {
          id: rawAlt.id || null,
          name: typeof rawAlt === 'string' ? rawAlt.trim() : (rawAlt.full_name || rawAlt.name),
          full_name: typeof rawAlt === 'string' ? rawAlt.trim() : (rawAlt.full_name || rawAlt.name),
          avatar_url: rawAlt.avatar_url || rawAlt.image
        };
      }
    }
    
    if (!mvp && matchData.man_of_the_match_id) {
      try {
        const { db } = await import('./db');
        const allPlayers = await db.players.toArray();
        const localPlayer = allPlayers.find(p => String(p.id) === String(matchData.man_of_the_match_id));
        if (localPlayer) {
          mvp = {
            id: localPlayer.id,
            name: localPlayer.full_name || localPlayer.name,
            full_name: localPlayer.full_name || localPlayer.name,
            avatar_url: localPlayer.avatar_url || localPlayer.image
          };
        }
      } catch (err) {
        console.warn('[api] Failed to resolve local player for MOTM:', err);
      }

      if (!mvp) {
        const allStatsPlayers = [...stats1.batting, ...stats2.batting, ...stats1.bowling, ...stats2.bowling];
        const matchPlayer = allStatsPlayers.find(p => String(p.id) === String(matchData.man_of_the_match_id));
        if (matchPlayer) {
          mvp = {
            id: matchPlayer.id,
            name: matchPlayer.name || matchPlayer.full_name,
            full_name: matchPlayer.name || matchPlayer.full_name
          };
        }
      }
    }

    if (!mvp) {
      const playerScores = {};
      [...stats1.batting, ...stats2.batting].forEach(b => {
        if (b.id) {
          if (!playerScores[b.id]) playerScores[b.id] = { id: b.id, name: b.name, score: 0 };
          playerScores[b.id].score += (b.runs || 0);
        }
      });
      [...stats1.bowling, ...stats2.bowling].forEach(b => {
        if (b.id) {
          if (!playerScores[b.id]) playerScores[b.id] = { id: b.id, name: b.name, score: 0 };
          playerScores[b.id].score += (b.wickets || 0) * 25; // 25 points per wicket
        }
      });
      
      let bestScore = -1;
      let topP = null;
      for (const p of Object.values(playerScores)) {
        if (p.score > bestScore) {
          bestScore = p.score;
          topP = p;
        }
      }
      if (topP && bestScore > 0) {
        mvp = { id: topP.id, name: topP.name, full_name: topP.name };
      }
    }

    let homeStats = { runs: 0, wickets: 0, extras: 0, overs: '0.0', batting: [], bowling: [] };
    let awayStats = { runs: 0, wickets: 0, extras: 0, overs: '0.0', batting: [], bowling: [] };

    if (innings.length > 0) {
       if (innings[0].batting_team_id === matchData.home_team_id) {
          homeStats = stats1;
          if (innings.length > 1) awayStats = stats2;
       } else {
          awayStats = stats1;
          if (innings.length > 1) homeStats = stats2;
       }
    }

    const finalResultText = matchData.result_text || matchData.result || matchData.resultText || (matchData.status === 'COMPLETED' ? 'Match Completed' : matchData.status);

    return {
      id: matchData.id,
      tournament: matchData.tournament || matchData.tournament_name || matchData.tournament_id || 'JDCA Tournament',
      venue: matchData.venue_name || matchData.venue || 'JDCA Ground',
      date: matchData.date || (matchData.scheduled_at ? new Date(matchData.scheduled_at).toLocaleDateString() : 'Match Day'),
      resultText: finalResultText,
      result: finalResultText,
      status: matchData.status || 'COMPLETED',
      winner_team_id: matchData.winner_team_id,
      result_margin: matchData.result_margin,
      manOfTheMatch: mvp,
      man_of_the_match: mvp,
      playerOfMatch: mvp,
      home_team: {
        id: matchData.home_team_id,
        name: matchData.home_team?.name || matchData.team_a_name || 'Home Team',
        short_name: matchData.home_team?.short_name || 'HOM',
        score: (homeStats.batting.length > 0 || homeStats.runs > 0)
          ? `${homeStats.runs}/${homeStats.wickets}`
          : (matchData.home_team?.score || matchData.scorecard?.home_team?.score || '-'),
        overs: (homeStats.batting.length > 0 || homeStats.runs > 0)
          ? `(${homeStats.overs} ov)`
          : (matchData.home_team?.overs || matchData.scorecard?.home_team?.overs || ''),
        extras: homeStats.extras
      },
      away_team: {
        id: matchData.away_team_id,
        name: matchData.away_team?.name || matchData.team_b_name || 'Away Team',
        short_name: matchData.away_team?.short_name || 'AWA',
        score: (awayStats.batting.length > 0 || awayStats.runs > 0)
          ? `${awayStats.runs}/${awayStats.wickets}`
          : (matchData.away_team?.score || matchData.scorecard?.away_team?.score || '-'),
        overs: (awayStats.batting.length > 0 || awayStats.runs > 0)
          ? `(${awayStats.overs} ov)`
          : (matchData.away_team?.overs || matchData.scorecard?.away_team?.overs || ''),
        extras: awayStats.extras
      },
      scorecard: {
        home_team: {
          batting: homeStats.batting.length > 0 ? homeStats.batting : (matchData.scorecard?.home_team?.batting || []),
          bowling: awayStats.bowling.length > 0 ? awayStats.bowling : (matchData.scorecard?.home_team?.bowling || []),
          extras: homeStats.extras || matchData.scorecard?.home_team?.extras || 0,
          overs: homeStats.overs !== '0.0' ? homeStats.overs : (matchData.scorecard?.home_team?.overs || matchData.home_team?.overs || ''),
          score: (homeStats.batting.length > 0 || homeStats.runs > 0) ? `${homeStats.runs}/${homeStats.wickets}` : (matchData.scorecard?.home_team?.score || matchData.home_team?.score || '-'),
          fallOfWickets: homeStats.fallOfWickets || matchData.scorecard?.home_team?.fallOfWickets || []
        },
        away_team: {
          batting: awayStats.batting.length > 0 ? awayStats.batting : (matchData.scorecard?.away_team?.batting || []),
          bowling: homeStats.bowling.length > 0 ? homeStats.bowling : (matchData.scorecard?.away_team?.bowling || []),
          extras: awayStats.extras || matchData.scorecard?.away_team?.extras || 0,
          overs: awayStats.overs !== '0.0' ? awayStats.overs : (matchData.scorecard?.away_team?.overs || matchData.away_team?.overs || ''),
          score: (awayStats.batting.length > 0 || awayStats.runs > 0) ? `${awayStats.runs}/${awayStats.wickets}` : (matchData.scorecard?.away_team?.score || matchData.away_team?.score || '-'),
          fallOfWickets: awayStats.fallOfWickets || matchData.scorecard?.away_team?.fallOfWickets || []
        }
      },
      isOfflineDexie: !isOnline || Boolean(matchData.isOfflineDexie),
      maxOvers: matchData.max_overs || null,
      innings_1: stats1,
      innings_2: stats2,
      innings: [stats1, stats2],
      topBatter,
      topBowler,
      bestPartnership
    };
  },

  /**
   * Fetches or creates the Supabase innings record for a match and innings number.
   * Guarantees returning a real innings object with its valid UUID.
   */
  async getOrCreateInnings(matchId, inningsNumber = 1) {
    if (!matchId || !supabase) return null;
    const innNum = Number(inningsNumber) || 1;

    // 1. Check if innings already exists
    const { data: existing, error: fetchErr } = await supabase
      .from('innings')
      .select('*')
      .eq('match_id', matchId)
      .eq('innings_number', innNum)
      .maybeSingle();

    if (!fetchErr && existing) {
      // In innings 2, verify it doesn't match innings 1 batting team
      if (innNum === 2 && existing.batting_team_id) {
        try {
          const { data: inn1 } = await supabase
            .from('innings')
            .select('batting_team_id, bowling_team_id')
            .eq('match_id', matchId)
            .eq('innings_number', 1)
            .maybeSingle();
          if (inn1 && inn1.batting_team_id && existing.batting_team_id === inn1.batting_team_id) {
            console.warn('[api.getOrCreateInnings] Innings 2 batting_team_id was identical to Innings 1. Reversing...');
            const correctBatting = inn1.bowling_team_id;
            const correctBowling = inn1.batting_team_id;
            await supabase.from('innings').update({
              batting_team_id: correctBatting,
              bowling_team_id: correctBowling
            }).eq('id', existing.id);
            existing.batting_team_id = correctBatting;
            existing.bowling_team_id = correctBowling;
          }
        } catch (e) {}
      }
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

    if (innNum === 2) {
      // Check Innings 1 first
      try {
        const { data: inn1 } = await supabase
          .from('innings')
          .select('batting_team_id, bowling_team_id')
          .eq('match_id', matchId)
          .eq('innings_number', 1)
          .maybeSingle();
        if (inn1 && inn1.batting_team_id && inn1.bowling_team_id) {
          battingTeamId = inn1.bowling_team_id;
          bowlingTeamId = inn1.batting_team_id;
        } else {
          // If no Innings 1, determine from match toss then invert
          const tossWinnerBats = String(match.toss_decision || '').toUpperCase() === 'BAT';
          const tossWinnerIsHome = match.toss_winner_id === match.home_team_id;
          const homeBatsFirst = (tossWinnerIsHome && tossWinnerBats) || (!tossWinnerIsHome && !tossWinnerBats);
          battingTeamId = homeBatsFirst ? match.away_team_id : match.home_team_id;
          bowlingTeamId = homeBatsFirst ? match.home_team_id : match.away_team_id;
        }
      } catch (e) {
        battingTeamId = match.away_team_id;
        bowlingTeamId = match.home_team_id;
      }
    } else {
      // Innings 1
      if (match.toss_winner_id) {
        const tossWinnerBats = String(match.toss_decision || '').toUpperCase() === 'BAT';
        const tossWinnerIsHome = match.toss_winner_id === match.home_team_id;
        const homeBatsFirst = (tossWinnerIsHome && tossWinnerBats) || (!tossWinnerIsHome && !tossWinnerBats);
        battingTeamId = homeBatsFirst ? match.home_team_id : match.away_team_id;
        bowlingTeamId = homeBatsFirst ? match.away_team_id : match.home_team_id;
      } else {
        // Fallback to home team batting first if toss not yet recorded
        battingTeamId = match.home_team_id;
        bowlingTeamId = match.away_team_id;
      }
    }

    const { data: newInnings, error: insertErr } = await supabase
      .from('innings')
      .insert({
        match_id: matchId,
        innings_number: innNum,
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
      full_name: playerData.full_name || 'New Player',
      date_of_birth: playerData.date_of_birth || '2000-01-01',
      gender: playerData.gender === 'Women' ? 'Women' : 'Men',
      primary_role: playerData.primary_role || 'Batter',
      batting_style: playerData.batting_style || 'Right-Hand Bat',
      bowling_style: playerData.bowling_style || 'None (Pure Batter)',
      avatar_url: playerData.avatar_url || null,
      phone: playerData.phone || null
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
    const activeSeason = await this.getActiveSeason();
    if (defaults.district_id && activeSeason) {
       // Resolve district: could be a UUID, a name string, or absent (use default)
       let finalDistrictId = defaults.district_id;
       if (playerData.district) {
         const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
         if (uuidRegex.test(playerData.district)) {
           finalDistrictId = playerData.district;
         } else {
           const { data: dData, error: dError } = await supabase
             .from('districts')
             .select('id')
             .eq('name', playerData.district)
             .single();
            if (dError || !dData) {
              throw new Error("District \"" + playerData.district + "\" was not found.");
            }
            finalDistrictId = dData.id;
         }
       }

       await supabase.from('player_registrations').insert({
         player_id: data.id,
         season_id: playerData.season_id || activeSeason.id,
         season: activeSeason.name,
         district_id: finalDistrictId,
         age_category_id: defaults.age_category_id
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
    
    // Resolve toss winner team ID
    let tossWinnerTeamId = setupData.tossWinnerTeamId || null;
    let tossDecision = setupData.tossDecision || 'BAT'; // BAT or BOWL

    // 1. Immediately cache to localStorage & local Dexie DB so scoring is unblocked offline
    try {
      localStorage.setItem(`jdca-match-setup-${matchId}`, JSON.stringify({
        ...setupData,
        matchId,
        tossWinnerTeamId,
        tossDecision,
        teamAXI: setupData.teamAXI || [],
        teamBXI: setupData.teamBXI || []
      }));
      localStorage.setItem(`jdca_match_setup_${matchId}`, JSON.stringify({
        ...setupData,
        matchId,
        tossWinnerTeamId,
        tossDecision,
        teamAXI: setupData.teamAXI || [],
        teamBXI: setupData.teamBXI || []
      }));
    } catch (e) {}

    try {
      const { db } = await import('./db');
      await db.matches.update(matchId, {
        toss_winner_id: tossWinnerTeamId || null,
        toss_decision: tossWinnerTeamId ? tossDecision : null,
        status: 'IN_PROGRESS',
        ...(setupData.totalOvers ? { max_overs: Number(setupData.totalOvers) } : {})
      });
    } catch (e) {}

    // 2. Fetch match to verify it exists and get team IDs if not explicitly passed
    let match = null;
    try {
      const res = await withTimeout(
        supabase
          .from('matches')
          .select('id, home_team_id, away_team_id, status')
          .eq('id', matchId)
          .single(),
        3000
      );
      match = res.data;
    } catch (e) {}
      
    if (!match) {
      try {
        const { db } = await import('./db');
        match = await db.matches.get(matchId);
      } catch (e) {}
    }

    if (!match) {
      match = {
        id: matchId,
        home_team_id: setupData.teamAId,
        away_team_id: setupData.teamBId,
        status: 'IN_PROGRESS'
      };
    }

    // Fallback: resolve from legacy string identifiers if no UUID was provided
    if (!tossWinnerTeamId) {
      if (setupData.tossWinner === 'teamA') {
        tossWinnerTeamId = match.home_team_id;
      } else if (setupData.tossWinner === 'teamB') {
        tossWinnerTeamId = match.away_team_id;
      }
    }

    // 3. Prepare rosters
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

    // Deduplicate roster by player_id
    const seenPlayerIds = new Set();
    const deduplicatedRoster = [];
    for (const player of allRoster) {
      if (!seenPlayerIds.has(player.player_id)) {
        seenPlayerIds.add(player.player_id);
        deduplicatedRoster.push(player);
      }
    }

    // 4. Remote Sync (non-blocking errors)
    try {
      await withTimeout(supabase.from('match_rosters').delete().eq('match_id', matchId), 3000);
      if (deduplicatedRoster.length > 0) {
        await withTimeout(
          supabase
            .from('match_rosters')
            .upsert(deduplicatedRoster, { onConflict: 'match_id, player_id' }),
          3000
        );
      }
    } catch (e) {
      console.warn('Could not sync rosters to Supabase immediately:', e);
    }

    try {
      const matchUpdateFields = {
        toss_winner_id: tossWinnerTeamId || null,
        toss_decision: tossWinnerTeamId ? tossDecision : null,
        status: 'IN_PROGRESS'
      };
      if (setupData.totalOvers) {
        matchUpdateFields.max_overs = Number(setupData.totalOvers);
      }
      await withTimeout(
        supabase
          .from('matches')
          .update(matchUpdateFields)
          .eq('id', matchId),
        3000
      );
    } catch (e) {
      console.warn('Could not update match fields on Supabase immediately:', e);
    }
    
    // 5. Force Upsert Innings 1 to guarantee correct batting team
    if (tossWinnerTeamId && tossDecision) {
      const tossWinnerBats = tossDecision === 'BAT';
      const tossWinnerIsHome = tossWinnerTeamId === match.home_team_id;
      const homeBatsFirst = (tossWinnerIsHome && tossWinnerBats) || (!tossWinnerIsHome && !tossWinnerBats);
      
      const battingTeamId = homeBatsFirst ? match.home_team_id : match.away_team_id;
      const bowlingTeamId = homeBatsFirst ? match.away_team_id : match.home_team_id;

      try {
        const { data: existingInnings } = await withTimeout(
          supabase.from('innings').select('id').eq('match_id', matchId).eq('innings_number', 1).maybeSingle(),
          3000
        );
        if (existingInnings) {
          await withTimeout(
            supabase.from('innings').update({
              batting_team_id: battingTeamId,
              bowling_team_id: bowlingTeamId,
              overs_limit: setupData.totalOvers || 20
            }).eq('id', existingInnings.id),
            3000
          );
        } else {
          await withTimeout(
            supabase.from('innings').insert({
              match_id: matchId,
              innings_number: 1,
              batting_team_id: battingTeamId,
              bowling_team_id: bowlingTeamId,
              overs_limit: setupData.totalOvers || 20,
              status: 'IN_PROGRESS'
            }),
            3000
          );
        }
      } catch (e) {
        console.warn('Could not upsert innings 1 on Supabase immediately:', e);
      }
    }
    
    return true;
  },

  // ==========================================
  // SCORING COMPLETION: UPDATE & FINALIZE MATCH
  // ==========================================

  async updateMatchDetails(matchId, details) {
    if (!matchId) return false;
    try {
      const { db } = await import('./db');
      await db.matches.update(matchId, {
        ...details,
        ...(details.result_text ? { result: details.result_text } : {})
      });
    } catch (e) {
      console.warn('[api] Failed to update local Dexie match details:', e);
    }

    try {
      if (typeof navigator !== 'undefined' && !navigator.onLine) {
        const { queueOfflineAction } = await import('./db');
        await queueOfflineAction('UPDATE_MATCH_DETAILS', { matchId, ...details });
        return true;
      }
      const { error } = await supabase
        .from('matches')
        .update(details)
        .eq('id', matchId);
      if (error) throw error;
    } catch (err) {
      console.warn('[api] Remote updateMatchDetails failed, queueing offline action:', err);
      try {
        const { queueOfflineAction } = await import('./db');
        await queueOfflineAction('UPDATE_MATCH_DETAILS', { matchId, ...details });
      } catch (qe) {}
    }
    return true;
  },

  async finalizeMatch(matchId, winnerId, resultMargin, resultText, manOfTheMatchId = null) {
    if (!matchId) throw new Error("Match ID required");

    const updatePayload = {
      status: 'COMPLETED',
      winner_team_id: winnerId,
      result_margin: resultMargin,
      result_text: resultText,
    };
    if (manOfTheMatchId) {
      updatePayload.man_of_the_match_id = manOfTheMatchId;
    }

    // 1. Immediately update Dexie database so offline state is 100% complete and final result is preserved
    try {
      const { db } = await import('./db');
      let motmObj = null;
      if (manOfTheMatchId) {
        const allPlayers = await db.players.toArray();
        const p = allPlayers.find(pl => String(pl.id) === String(manOfTheMatchId));
        if (p) {
          motmObj = {
            id: p.id,
            name: p.full_name || p.name,
            full_name: p.full_name || p.name,
            avatar_url: p.avatar_url || p.image
          };
        }
      }
      await db.matches.update(matchId, {
        ...updatePayload,
        result: resultText,
        ...(manOfTheMatchId ? {
          man_of_the_match: motmObj,
          playerOfMatch: motmObj,
          manOfTheMatch: motmObj
        } : {})
      });
    } catch (e) {
      console.warn('[api] Local Dexie finalizeMatch update error:', e);
    }

    // 2. If offline, queue for sync and return true without throwing
    if (typeof navigator !== 'undefined' && !navigator.onLine) {
      try {
        const { queueOfflineAction } = await import('./db');
        await queueOfflineAction('FINALIZE_MATCH', { matchId, winnerId, resultMargin, resultText, manOfTheMatchId });
      } catch (qe) {}
      return true;
    }

    // 3. Online: attempt Supabase update
    try {
      const { error } = await supabase
        .from('matches')
        .update(updatePayload)
        .eq('id', matchId);

      if (error) {
        console.warn('[api] Supabase finalizeMatch failed, queueing offline action:', error);
        const { queueOfflineAction } = await import('./db');
        await queueOfflineAction('FINALIZE_MATCH', { matchId, winnerId, resultMargin, resultText, manOfTheMatchId });
      }
    } catch (err) {
      console.warn('[api] Supabase finalizeMatch error, queueing offline action:', err);
      try {
        const { queueOfflineAction } = await import('./db');
        await queueOfflineAction('FINALIZE_MATCH', { matchId, winnerId, resultMargin, resultText, manOfTheMatchId });
      } catch (qe) {}
    }

    return true;
  },

  async assignManOfTheMatch(matchId, playerId) {
    if (!matchId) throw new Error("Match ID required");
    let result = null;
    let motmObj = null;

    try {
      const { db } = await import('./db');
      if (playerId) {
        const allPlayers = await db.players.toArray();
        const p = allPlayers.find(pl => String(pl.id) === String(playerId));
        if (p) {
          motmObj = {
            id: p.id,
            name: p.full_name || p.name,
            full_name: p.full_name || p.name,
            avatar_url: p.avatar_url || p.image
          };
        }
      }
      await db.matches.update(matchId, { 
        man_of_the_match_id: playerId || null,
        man_of_the_match: motmObj,
        playerOfMatch: motmObj,
        manOfTheMatch: motmObj
      });
    } catch (e) {}

    try {
      if (typeof navigator !== 'undefined' && !navigator.onLine) {
        const { queueOfflineAction } = await import('./db');
        await queueOfflineAction('ASSIGN_MOTM', { matchId, playerId });
        return { id: matchId, man_of_the_match_id: playerId, man_of_the_match: motmObj };
      }

      const { data, error } = await supabase
        .from('matches')
        .update({ man_of_the_match_id: playerId || null })
        .eq('id', matchId)
        .select('id, man_of_the_match_id');

      if (error) {
        console.warn('[api] Remote assign man of the match error, queueing offline action:', error);
        const { queueOfflineAction } = await import('./db');
        await queueOfflineAction('ASSIGN_MOTM', { matchId, playerId });
      } else if (data && data.length > 0) {
        result = data[0];
      }
    } catch (e) {
      console.warn('[api] Assign MOTM caught error, queueing offline action:', e);
      try {
        const { queueOfflineAction } = await import('./db');
        await queueOfflineAction('ASSIGN_MOTM', { matchId, playerId });
      } catch (qe) {}
    }

    return result || { id: matchId, man_of_the_match_id: playerId, man_of_the_match: motmObj };
  },

  // ==========================================
  // SCORING COMPLETION: ABANDON/CANCEL MATCH
  // ==========================================

  async abandonMatch(matchId) {
    if (!matchId) throw new Error("Match ID required");

    try {
      const { db } = await import('./db');
      await db.matches.update(matchId, {
        status: 'ABANDONED',
        result_text: 'Match Ended Early / Abandoned',
        result: 'Match Ended Early / Abandoned'
      });
    } catch (e) {}

    if (typeof navigator !== 'undefined' && !navigator.onLine) {
      try {
        const { queueOfflineAction } = await import('./db');
        await queueOfflineAction('ABANDON_MATCH', { matchId });
      } catch (e) {}
      return true;
    }

    try {
      const { error } = await supabase
        .from('matches')
        .update({
          status: 'ABANDONED',
          result_text: 'Match Ended Early / Abandoned'
        })
        .eq('id', matchId);

      if (error) {
        console.warn('[api] Failed to abandon match remotely, queueing offline action:', error);
        const { queueOfflineAction } = await import('./db');
        await queueOfflineAction('ABANDON_MATCH', { matchId });
      }
    } catch (e) {
      console.warn('[api] Failed to abandon match remotely, queueing offline action:', e);
      try {
        const { queueOfflineAction } = await import('./db');
        await queueOfflineAction('ABANDON_MATCH', { matchId });
      } catch (qe) {}
    }

    return true;
  },

  async endMatchEarly(matchId, winnerId, resultMargin, resultText) {
    if (!matchId) throw new Error("Match ID required");

    const updatePayload = {
      status: 'COMPLETED',
      result_text: resultText || 'Match Ended Early',
      result: resultText || 'Match Ended Early'
    };
    if (winnerId) updatePayload.winner_team_id = winnerId;
    if (resultMargin) updatePayload.result_margin = resultMargin;

    // 1. Update Dexie immediately
    try {
      const { db } = await import('./db');
      await db.matches.update(matchId, updatePayload);
    } catch (e) {}

    // 2. Try Supabase or queue offline action
    if (typeof navigator !== 'undefined' && !navigator.onLine) {
      try {
        const { queueOfflineAction } = await import('./db');
        await queueOfflineAction('END_MATCH_EARLY', { matchId, winnerId, resultMargin, resultText });
      } catch (e) {}
      return true;
    }

    try {
      const { error } = await supabase
        .from('matches')
        .update(updatePayload)
        .eq('id', matchId);

      if (error) {
        console.warn('[api] Remote endMatchEarly error, queueing offline action:', error);
        const { queueOfflineAction } = await import('./db');
        await queueOfflineAction('END_MATCH_EARLY', { matchId, winnerId, resultMargin, resultText });
      }
    } catch (e) {
      console.warn('[api] Remote endMatchEarly error, queueing offline action:', e);
      try {
        const { queueOfflineAction } = await import('./db');
        await queueOfflineAction('END_MATCH_EARLY', { matchId, winnerId, resultMargin, resultText });
      } catch (qe) {}
    }

    return true;
  },

  async getPlayerMatchHistory(playerId) {
    if (!playerId) return [];
    try {
      const [batRes, bowlRes, fieldRes] = await Promise.all([
        supabase.from('v_player_match_batting').select('match_id, runs_scored, balls_faced, is_dismissed').eq('player_id', playerId),
        supabase.from('v_player_match_bowling').select('match_id, wickets_taken, runs_conceded, balls_bowled').eq('player_id', playerId),
        supabase.from('v_player_match_fielding').select('match_id, catches, run_outs, stumpings').eq('player_id', playerId)
      ]);

      const batMap = new Map((batRes.data || []).map(d => [d.match_id, d]));
      const bowlMap = new Map((bowlRes.data || []).map(d => [d.match_id, d]));
      const fieldMap = new Map((fieldRes.data || []).map(d => [d.match_id, d]));

      const matchIds = [...new Set([...batMap.keys(), ...bowlMap.keys(), ...fieldMap.keys()])];
      
      if (matchIds.length === 0) return [];

      const { data: matches } = await supabase
        .from('matches')
        .select(`
          id, 
          scheduled_at, 
          tournaments (name), 
          home_team:teams!matches_home_team_id_fkey(name), 
          away_team:teams!matches_away_team_id_fkey(name)
        `)
        .in('id', matchIds)
        .order('scheduled_at', { ascending: false });

      if (!matches) return [];

      return matches.map(m => {
        const bat = batMap.get(m.id);
        const bowl = bowlMap.get(m.id);
        const field = fieldMap.get(m.id);
        const homeName = m.home_team?.name || 'Home';
        const awayName = m.away_team?.name || 'Away';
        
        return {
          id: m.id,
          date: m.scheduled_at ? new Date(m.scheduled_at).toLocaleDateString() : 'Unknown Date',
          tournament: m.tournaments?.name || 'Friendly',
          opponent: `${homeName} vs ${awayName}`,
          batting: bat ? {
            runs: bat.runs_scored,
            balls: bat.balls_faced,
            notOut: bat.is_dismissed === 0
          } : undefined,
          bowling: bowl ? {
            wickets: bowl.wickets_taken,
            runs: bowl.runs_conceded,
            overs: bowl.balls_bowled > 0 ? Math.floor(bowl.balls_bowled / 6) + (bowl.balls_bowled % 6) / 10 : 0
          } : undefined,
          fielding: field ? {
            catches: field.catches || 0,
            stumpings: field.stumpings || 0,
            runOuts: field.run_outs || 0
          } : undefined
        };
      });

    } catch (err) {
      console.error('Error fetching player match history:', err);
      return [];
    }
  }
};

