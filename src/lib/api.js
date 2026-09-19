import { supabase } from './supabase';

export const api = {
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
        season: tournamentData.season || '2026',
        format: tournamentData.format || 'T20',
        age_category_id: defaults.age_category_id,
        gender: 'MEN', // Defaulting to MEN as schema requires it
        start_date: tournamentData.startDate || null,
        end_date: tournamentData.endDate || null,
        status: tournamentData.status || 'UPCOMING'
      })
      .select()
      .single();

    if (error) throw error;
    return data;
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
        season: teamData.season || '2026',
        district_id: defaults.district_id,
        age_category_id: defaults.age_category_id,
        gender: teamData.gender === 'Women' ? 'WOMEN' : 'MEN',
        is_active: true
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async generateSchedule(tournamentId, teams, format = 'T20') {
    const matchesToInsert = [];
    let baseDate = new Date();
    baseDate.setDate(baseDate.getDate() + 1);

    for (let i = 0; i < teams.length; i++) {
      for (let j = i + 1; j < teams.length; j++) {
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

    if (error) throw error;
    return data;
  }
};
