import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { api } from '../lib/api';

export function useDataSync({ auth, ui }) {
  // Extract ui state setters
  const { setLoadingProgress, setLoadingMessage, setIsAppLoading, setAppError } = ui;
  // Extract auth state setters
  const {
    setIsAuthenticated, setUserEmail, setUserId, setUserName,
    setUserRole, setUserPermissions, setActiveMatchId
  } = auth;

  // Selection Context State & Representative Teams
  const [representativeTeams, setRepresentativeTeams] = useState([]);
  const [activeSelectionTeam, setActiveSelectionTeam] = useState(null);

  // Selector Permission Scopes
  const [selectorPermissions, setSelectorPermissions] = useState({
    maxAgeRankLevel: null,
    ageCategoryId: null,
    ageCategoryName: null,
    allowedDistricts: ['Jabalpur', 'Katni', 'Narsinghpur', 'Seoni', 'Mandla', 'Balaghat', 'Chhindwara', 'Dindori', 'Pandhurna']
  });

  // Players & Scouting
  const [players, setPlayers] = useState([]);
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [shortlistedIds, setShortlistedIds] = useState([]);

  // Matches State
  const [matches, setMatches] = useState([]);

  // Teams State
  const [teams, setTeams] = useState([]);

  // Tournaments State
  const [tournaments, setTournaments] = useState([]);
  const [announcements, setAnnouncements] = useState([]);

  useEffect(() => {
    const setupDataAndSync = async () => {
      try {
        setLoadingProgress(5);
        setLoadingMessage("Connecting to local database...");
        const { db } = await import('../lib/db.js');
        
        // 0. Setup Auth
        setLoadingProgress(10);
        setLoadingMessage("Authenticating session...");
        let currentSession = null;
        if (supabase) {
          const { data: { session } } = await supabase.auth.getSession();
          currentSession = session;
          
          if (session?.user) {
            setUserEmail(session.user.email);
            setUserId(session.user.id);
            setIsAuthenticated(true);
            const { data: profile } = await supabase
              .from('profiles')
              .select('role, is_active, can_add, can_edit, can_delete, full_name, selector_age_category_id, selector_age_category:selector_age_category_id(id, name, short_name, rank_level)')
              .eq('id', session.user.id)
              .single();
            if (profile) {
              setUserName(profile.full_name || '');
              if (profile.is_active === false) {
                await supabase.auth.signOut();
              } else {
                setUserRole(profile.role);
                setUserPermissions({
                  can_add: profile.can_add,
                  can_edit: profile.can_edit,
                  can_delete: profile.can_delete
                });
                if (profile.role === 'SELECTOR' && profile.selector_age_category) {
                  const cat = profile.selector_age_category;
                  setSelectorPermissions(prev => ({
                    ...prev,
                    maxAgeRankLevel: cat.rank_level,
                    ageCategoryId: cat.id,
                    ageCategoryName: cat.name
                  }));
                } else if (profile.role === 'SUPER_ADMIN' || profile.role === 'DISTRICT_ADMIN') {
                  setSelectorPermissions(prev => ({ ...prev, maxAgeRankLevel: 99 }));
                }
              }
            }
          }

          supabase.auth.onAuthStateChange(async (event, session) => {
            if (session?.user) {
              setUserEmail(session.user.email);
              setUserId(session.user.id);
              setIsAuthenticated(true);
              const { data: profile } = await supabase
                .from('profiles')
                .select('role, is_active, can_add, can_edit, can_delete, full_name, selector_age_category_id, selector_age_category:selector_age_category_id(id, name, short_name, rank_level)')
                .eq('id', session.user.id)
                .single();
              if (profile) {
                setUserName(profile.full_name || '');
                if (profile.is_active === false) {
                  await supabase.auth.signOut();
                } else {
                  setUserRole(profile.role);
                  setUserPermissions({
                    can_add: profile.can_add,
                    can_edit: profile.can_edit,
                    can_delete: profile.can_delete
                  });
                  if (profile.role === 'SELECTOR' && profile.selector_age_category) {
                    const cat = profile.selector_age_category;
                    setSelectorPermissions(prev => ({
                      ...prev,
                      maxAgeRankLevel: cat.rank_level,
                      ageCategoryId: cat.id,
                      ageCategoryName: cat.name
                    }));
                  } else if (profile.role === 'SUPER_ADMIN' || profile.role === 'DISTRICT_ADMIN') {
                    setSelectorPermissions(prev => ({ ...prev, maxAgeRankLevel: 99 }));
                  }
                }
              }
            } else {
              setIsAuthenticated(false);
              setUserEmail('');
              setUserRole('VIEWER');
              setUserPermissions({ can_add: false, can_edit: false, can_delete: false });
              if (setActiveMatchId) setActiveMatchId(null);
            }
          });
        }

        // 1. Immediately load whatever is in Dexie (Offline-First)
        setLoadingProgress(20);
        setLoadingMessage("Loading offline cache...");
        let localMatches = await db.matches.toArray();
        let localTeams = await db.teams.toArray();
        let localTournaments = [];
        try { localTournaments = await db.tournaments.toArray(); } catch (e) {}
        let localPlayers = await db.players.toArray();

        // --- MIGRATION: Purge old mock data from local cache ---
        if (localMatches.some(m => m.id === 'match-live-1' || m.id === 'match-completed-1')) {
          console.log('[useDataSync] Legacy mock data detected in cache. Purging...');
          await db.matches.clear();
          await db.players.clear();
          localMatches = [];
          localPlayers = [];
        }

        // Initialize React state immediately with local cache
        setMatches(localMatches);
        setTeams(localTeams);
        setTournaments(localTournaments);
        setPlayers(localPlayers);
        if (localPlayers.length > 0) setSelectedPlayer(localPlayers[0]);

        // 2. If online and Supabase is available, aggressively fetch and reconcile
        if (supabase && navigator.onLine) {
          setLoadingProgress(30);
          setLoadingMessage("Syncing with JDCA Servers...");
          console.log('[useDataSync] Online: Fetching fresh data from Supabase...');
          
          try {
            const [matchesRes, teamsRes, tournamentsRes, playersRes, batStatsRes, bowlStatsRes, fieldStatsRes] = await Promise.allSettled([
              supabase.from('matches').select('*, tournaments(id, name), home_team:teams!matches_home_team_id_fkey(*), away_team:teams!matches_away_team_id_fkey(*), man_of_the_match:players!matches_man_of_the_match_id_fkey(id, full_name, avatar_url)').is('deleted_at', null).then(r => { setLoadingProgress(p => p + 10); setLoadingMessage("Updating matches..."); return r; }),
              supabase.from('teams').select('*, district:district_id(*), age_category:age_category_id(*)').then(r => { setLoadingProgress(p => p + 5); setLoadingMessage("Updating teams..."); return r; }),
              supabase.from('tournaments').select('*, tournament_teams(team_id)').is('deleted_at', null).then(r => { setLoadingProgress(p => p + 5); return r; }),
              supabase.from('players').select('*, player_registrations(district:district_id(name), age_category:age_category_id(name)), team_players(team_id)').is('deleted_at', null).then(r => { setLoadingProgress(p => p + 15); setLoadingMessage("Syncing player registry..."); return r; }),
              supabase.from('v_player_career_batting').select('*').then(r => { setLoadingProgress(p => p + 5); return r; }),
              supabase.from('v_player_career_bowling').select('*').then(r => { setLoadingProgress(p => p + 5); return r; }),
              supabase.from('v_player_career_fielding').select('*').then(r => { setLoadingProgress(p => p + 5); return r; })
            ]);

            setLoadingProgress(80);
            setLoadingMessage("Reconciling local data...");
            // Reconcile Matches
            if (matchesRes.status === 'fulfilled' && !matchesRes.value.error && matchesRes.value.data) {
              const freshPlayers = (playersRes.status === 'fulfilled' && !playersRes.value.error && playersRes.value.data)
                ? playersRes.value.data
                : [];
              const allPlayerPool = [...freshPlayers, ...localPlayers];

              const freshMatches = matchesRes.value.data.map(m => {
                const matchId = m.match_id || m.id;
                const existingLocal = localMatches.find(lm => String(lm.id) === String(matchId));

                const rawMotm = Array.isArray(m.man_of_the_match) ? m.man_of_the_match[0] : m.man_of_the_match;
                const targetPlayerId = m.man_of_the_match_id || rawMotm?.id;
                const motmPlayer = (rawMotm && (rawMotm.full_name || rawMotm.name))
                  ? rawMotm
                  : (targetPlayerId ? allPlayerPool.find(p => String(p.id) === String(targetPlayerId)) : null);

                let motmObj = motmPlayer ? {
                  id: motmPlayer.id,
                  full_name: motmPlayer.full_name || motmPlayer.name,
                  name: motmPlayer.full_name || motmPlayer.name,
                  avatar_url: motmPlayer.avatar_url || motmPlayer.image
                } : null;

                // Never overwrite an existing MOTM with null if remote query didn't resolve it!
                if ((!motmObj || !motmObj.name) && existingLocal?.man_of_the_match) {
                  motmObj = existingLocal.man_of_the_match;
                }
                if ((!motmObj || !motmObj.name) && existingLocal?.playerOfMatch) {
                  motmObj = existingLocal.playerOfMatch;
                }

                return {
                  id: matchId,
                  tournament_id: m.tournament_id,
                  tournament: m.tournaments?.name || m.tournament || existingLocal?.tournament,
                  home_team_id: m.home_team_id,
                  away_team_id: m.away_team_id,
                  home_team: { id: m.home_team_id, name: m.home_team_name || m.home_team?.name || existingLocal?.home_team?.name, short_name: m.home_team?.short_name || existingLocal?.home_team?.short_name || '' },
                  away_team: { id: m.away_team_id, name: m.away_team_name || m.away_team?.name || existingLocal?.away_team?.name, short_name: m.away_team?.short_name || existingLocal?.away_team?.short_name || '' },
                  toss_winner_id: m.toss_winner_id,
                  toss_decision: m.toss_decision,
                  winner_team_id: m.winner_team_id,
                  result_margin: m.result_margin,
                  result_text: m.result_text || existingLocal?.result_text,
                  man_of_the_match_id: m.man_of_the_match_id || motmObj?.id || existingLocal?.man_of_the_match_id,
                  man_of_the_match: motmObj,
                  playerOfMatch: motmObj,
                  scorer_id: m.scorer_id,
                  scorer_name: m.scorer_name,
                  umpire_name: m.umpire_name,
                  ball_type: m.ball_type,
                  scheduled_at: m.scheduled_at,
                  status: m.status,
                  match_format: m.match_format,
                  max_overs: m.max_overs,
                  venue_name: m.venue_name || m.venue || existingLocal?.venue_name,
                  deleted_at: m.deleted_at
                };
              });
              await db.matches.clear();
              await db.matches.bulkPut(freshMatches);
              setMatches(freshMatches);
            }

            // Reconcile Teams
            if (teamsRes.status === 'fulfilled' && !teamsRes.value.error && teamsRes.value.data) {
              const freshTeams = teamsRes.value.data;
              await db.teams.clear();
              await db.teams.bulkPut(freshTeams);
              setTeams(freshTeams);
            }

            // Reconcile Tournaments
            if (tournamentsRes.status === 'fulfilled' && !tournamentsRes.value.error && tournamentsRes.value.data) {
              const freshTournaments = tournamentsRes.value.data;
              try {
                await db.tournaments.clear();
                await db.tournaments.bulkPut(freshTournaments);
              } catch (e) {}
              setTournaments(freshTournaments);
            }

            // Reconcile Players
            if (playersRes.status === 'fulfilled' && !playersRes.value.error && playersRes.value.data) {
              const batStats = batStatsRes?.status === 'fulfilled' ? batStatsRes.value.data || [] : [];
              const bowlStats = bowlStatsRes?.status === 'fulfilled' ? bowlStatsRes.value.data || [] : [];
              const fieldStats = fieldStatsRes?.status === 'fulfilled' ? fieldStatsRes.value.data || [] : [];

              const freshPlayers = playersRes.value.data.map(p => {
                const reg = p.player_registrations && p.player_registrations.length > 0 ? p.player_registrations[0] : null;
                const district = p.district || reg?.district?.name || 'Jabalpur';
                const category = p.category || reg?.age_category?.name || 'Senior';
                
                const batting = batStats.find(s => s.player_id === p.id) || null;
                const bowling = bowlStats.find(s => s.player_id === p.id) || null;
                const fielding = fieldStats.find(s => s.player_id === p.id) || null;

                return { 
                  id: p.id,
                  full_name: p.full_name || 'Unknown Player',
                  avatar_url: p.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(p.full_name || 'Player')}&background=random`,
                  date_of_birth: p.date_of_birth || p.dob,
                  primary_role: p.primary_role,
                  batting_style: p.batting_style,
                  bowling_style: p.bowling_style,
                  district, 
                  category, 
                  career_batting: batting, 
                  career_bowling: bowling, 
                  career_fielding: fielding,
                  careerRuns: batting ? batting.career_runs : 0,
                  wickets: bowling ? bowling.wickets : 0,
                  battingAvg: batting ? batting.average : 0,
                  strikeRate: batting ? batting.strike_rate : 0,
                  matches: batting ? batting.total_matches : (bowling ? bowling.total_matches : 0),
                  highScore: batting ? batting.highest_score : 0,
                  fours: batting ? batting.total_fours : 0,
                  sixes: batting ? batting.total_sixes : 0,
                  fifties: batting ? batting.fifties : 0,
                  hundreds: batting ? batting.hundreds : 0,
                  economy: bowling ? bowling.economy : 0,
                  bestBowling: null,
                  bowlingAvg: null
                };
              });
              await db.players.clear();
              await db.players.bulkPut(freshPlayers);
              setPlayers(freshPlayers);
              if (freshPlayers.length > 0 && localPlayers.length === 0) {
                 setSelectedPlayer(freshPlayers[0]);
              }
            }

            console.log('[useDataSync] Server reconciliation complete.');
          } catch (e) {
             console.warn('[useDataSync] Error during Supabase reconciliation. Falling back to local Dexie data.', e);
             setAppError(e.message || 'Failed to fetch some live data. You are viewing cached offline data.');
          }
        }

        // Fetch Selection Processes
        setLoadingProgress(90);
        setLoadingMessage("Finalizing setup...");
        if (supabase) {
          try {
             const processes = await api.getSelectionProcesses();
             const userId = currentSession?.user?.id;
             const formattedProcesses = processes.map(p => {
               const assignment = p.selector_assignments?.find(a => a.selector_id === userId);
               return {
                 id: p.id,
                 name: p.name,
                 season_id: p.season_id,
                 ageCategory: p.age_category?.name || 'Unknown',
                 gender: p.gender,
                 targetSquadSize: p.target_squad_size,
                 ageRankLevel: 4,
                 status: p.status,
                 processType: p.process_type || 'DISTRICT_TEAM',
                 targetDistrictId: p.target_district_id,
                 targetDistrictName: p.district?.name,
                 isLeadSelector: assignment ? assignment.is_lead_selector : false
               };
             });
             setRepresentativeTeams(formattedProcesses);
          } catch(e) { console.error('Failed to load selection processes', e); }

          try {
            const anns = await api.getAnnouncements();
            setAnnouncements(anns);
          } catch(e) { console.error('Failed to load announcements', e); }
        }

        setLoadingProgress(100);
        setLoadingMessage("Welcome to JDCA!");
        
        setTimeout(() => {
          setIsAppLoading(false);
        }, 500);

      } catch (err) {
        console.error('[useDataSync] Sync error:', err);
        setAppError(err.message || 'A critical error occurred while syncing data.');
        setIsAppLoading(false);
      }
    };

    setupDataAndSync();
  }, []);

  const refreshAdminData = async () => {
    if (!supabase) return;
    try {
      const { db } = await import('../lib/db.js');
      
      const { data: tData, error: tErr } = await supabase.from('tournaments').select('*, tournament_teams(team_id)').is('deleted_at', null);
      if (!tErr && tData) {
        await db.tournaments.clear();
        await db.tournaments.bulkPut(tData);
        setTournaments(tData);
      }

      // LEFT join tournaments (not !inner) so matches not attached to a tournament
      // are still returned; an inner join silently dropped standalone matches from
      // the list on every admin refresh.
      const { data: mData, error: mErr } = await supabase.from('matches').select('*, tournaments(id), home_team:teams!matches_home_team_id_fkey(*), away_team:teams!matches_away_team_id_fkey(*), man_of_the_match:players!matches_man_of_the_match_id_fkey(id, full_name, avatar_url)').is('deleted_at', null);
      if (!mErr && mData) {
        let curPlayers = [];
        let curMatches = [];
        try {
          curPlayers = await db.players.toArray();
          curMatches = await db.matches.toArray();
        } catch (e) {}
        const enrichedMatches = mData.map(m => {
          const matchId = m.match_id || m.id;
          const existing = curMatches.find(cm => String(cm.id) === String(matchId));
          const rawMotm = Array.isArray(m.man_of_the_match) ? m.man_of_the_match[0] : m.man_of_the_match;
          const targetPlayerId = m.man_of_the_match_id || rawMotm?.id;
          const motmPlayer = (rawMotm && (rawMotm.full_name || rawMotm.name))
            ? rawMotm
            : (targetPlayerId ? curPlayers.find(p => String(p.id) === String(targetPlayerId)) : null);
          let motmObj = motmPlayer ? {
            id: motmPlayer.id,
            full_name: motmPlayer.full_name || motmPlayer.name,
            name: motmPlayer.full_name || motmPlayer.name,
            avatar_url: motmPlayer.avatar_url || motmPlayer.image
          } : null;
          if ((!motmObj || !motmObj.name) && existing?.man_of_the_match) {
            motmObj = existing.man_of_the_match;
          }
          if ((!motmObj || !motmObj.name) && existing?.playerOfMatch) {
            motmObj = existing.playerOfMatch;
          }
          return {
            ...m,
            man_of_the_match: motmObj,
            playerOfMatch: motmObj
          };
        });
        await db.matches.clear();
        await db.matches.bulkPut(enrichedMatches);
        setMatches(enrichedMatches);
      }
    } catch (err) {
      console.error('[useDataSync] Error refreshing admin data:', err);
      setAppError(err.message || 'Failed to refresh admin data.');
    }
  };

  return {
    representativeTeams, setRepresentativeTeams,
    activeSelectionTeam, setActiveSelectionTeam,
    selectorPermissions, setSelectorPermissions,
    players, setPlayers,
    selectedPlayer, setSelectedPlayer,
    shortlistedIds, setShortlistedIds,
    matches, setMatches,
    teams, setTeams,
    tournaments, setTournaments,
    announcements, setAnnouncements,
    refreshAdminData
  };
}
