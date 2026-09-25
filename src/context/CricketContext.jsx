import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import confetti from 'canvas-confetti';
import { supabase } from '../lib/supabase';
import { api } from '../lib/api';
import {
  processDelivery,
  formatOvers,
  calculateCRR,
  calculateProjectedScore,
  canBowlerBowlNextOver,
  MATCH_STATES,
} from '../engine/cricketStateMachine';
import { INITIAL_SCORECARD, FIELD_DIRECTIONS } from '../data/constants';
import { syncService } from '../services/SyncService';
import { db, queueOfflineAction } from '../lib/db';

const CricketContext = createContext();

export function CricketProvider({ children }) {
  const navigate = useNavigate();
  const location = useLocation();

  // Navigation & Screen routing derived from URL
  const pathParts = location.pathname.split('/').filter(Boolean);
  let currentScreen = pathParts.length > 0 ? pathParts[0] : 'welcome';
  if (currentScreen === '') currentScreen = 'welcome';
  
  const activeTabMap = {
    'home': 'home',
    'scoring': 'scoring',
    'scorecard': 'scoring',
    'scouting': 'players',
    'players': 'players',
    'selectors': 'selection',
    'selection': 'selection',
    'player-profile': 'players',
    'player-registration': 'players',
    'matches': 'matches',
    'match-overview': 'matches',
    'match-setup': 'matches',
    'match-result': 'matches',
    'innings-break': 'matches',
    'tournaments': 'tournaments',
    'teams': 'teams',
    'news': 'news',
    'administration': 'administration',
    'access-control': 'administration',
  };
  const activeTab = activeTabMap[currentScreen] || 'home';

  // Application Loading State
  const [isAppLoading, setIsAppLoading] = useState(true);
  const [appError, setAppError] = useState(null);

  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [userName, setUserName] = useState('');
  const [userId, setUserId] = useState(null);
  const [userRole, setUserRole] = useState('VIEWER'); // SUPER_ADMIN, DISTRICT_ADMIN, SCORER, SELECTOR, VIEWER
  const [userPermissions, setUserPermissions] = useState({ can_add: false, can_edit: false, can_delete: false });

  // Dark Mode Theme State
  const [isDarkMode, setIsDarkMode] = useState(() => {
    try {
      return localStorage.getItem('jdca-dark-mode') === 'true';
    } catch {
      return false;
    }
  });

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('jdca-dark-mode', 'true');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('jdca-dark-mode', 'false');
    }
  }, [isDarkMode]);

  // Registered Users (Super Admin access)
  const [registeredUsers, setRegisteredUsers] = useState([]);

  // System Settings
  const [systemSettings, setSystemSettings] = useState(() => {
    try {
      const stored = localStorage.getItem('jdca-system-settings');
      if (stored) return JSON.parse(stored);
    } catch {}
    return { liveSync: true, freeHit: true, notifications: true, watermark: true };
  });

  useEffect(() => {
    localStorage.setItem('jdca-system-settings', JSON.stringify(systemSettings));
  }, [systemSettings]);

  useEffect(() => {
    if (userRole === 'SUPER_ADMIN' || userRole === 'DISTRICT_ADMIN') {
      const fetchProfiles = async () => {
        try {
          const profiles = await api.getProfiles();
          const mapped = profiles.map(p => ({
            id: p.id,
            name: p.full_name,
            email: p.email || 'N/A',
            role: p.role,
              can_view: p.can_view,
              can_add: p.can_add,
              can_edit: p.can_edit,
              can_delete: p.can_delete,
            status: p.is_active ? 'Active' : 'Inactive',
            district: p.district?.name || 'All Districts'
          }));
          setRegisteredUsers(mapped);
        } catch (e) {
          console.error('[CricketContext] Failed to load profiles', e);
        }
      };
      fetchProfiles();
    }
  }, [userRole]);

  // Selection Context State & Representative Teams
  const [representativeTeams, setRepresentativeTeams] = useState([]);
  const [activeSelectionTeam, setActiveSelectionTeam] = useState(null);

  // Selector Permission Scopes (Age Category Level & Allowed Districts)
  const [selectorPermissions, setSelectorPermissions] = useState({
    maxAgeRankLevel: 4, // Default U19 Selector (Sees U19, U17, U15, U13)
    allowedDistricts: ['Jabalpur', 'Katni', 'Narsinghpur', 'Seoni', 'Mandla', 'Balaghat', 'Chhindwara', 'Dindori', 'Pandhurna'] // All by default unless configured
  });

  // Players & Scouting
  const [players, setPlayers] = useState([]);
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [shortlistedIds, setShortlistedIds] = useState([]);

  // Matches State
  const [matches, setMatches] = useState([]);
  const [activeMatchId, setActiveMatchId] = useState(null);
  
  // Teams State
  const [teams, setTeams] = useState([]);

  // Tournaments State
  const [tournaments, setTournaments] = useState([]);
  const [announcements, setAnnouncements] = useState([]);

  // Offline-First & Realtime Data Sync
  useEffect(() => {
    let subscription = null;

    const setupDataAndSync = async () => {
      try {
        const { db } = await import('../lib/db.js');
        
        // 0. Setup Auth
        let currentSession = null;
        if (supabase) {
          const { data: { session } } = await supabase.auth.getSession();
          currentSession = session;
          
          if (session?.user) {
            setUserEmail(session.user.email);
            setUserId(session.user.id);
            setIsAuthenticated(true);
            // Fetch role from profiles
            const { data: profile, error: profileErr } = await supabase
              .from('profiles')
              .select('role, is_active, can_add, can_edit, can_delete, full_name')
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
              }
            }
          }
          
          supabase.auth.onAuthStateChange(async (event, session) => {
            if (session?.user) {
              setUserEmail(session.user.email);
              setUserId(session.user.id);
              setIsAuthenticated(true);
              const { data: profile, error: profileErr } = await supabase
                .from('profiles')
                .select('role, is_active, can_add, can_edit, can_delete, full_name')
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
                }
              }
            } else {
              setIsAuthenticated(false);
              setUserEmail('');
              setUserRole('VIEWER');
              setUserPermissions({ can_add: false, can_edit: false, can_delete: false });
            }
          });
        }

        // 1. Immediately load whatever is in Dexie (Offline-First)
        let localMatches = await db.matches.toArray();
        let localTeams = await db.teams.toArray();
        let localTournaments = [];
        try { localTournaments = await db.tournaments.toArray(); } catch (e) {}
        let localPlayers = await db.players.toArray();

        // --- MIGRATION: Purge old mock data from local cache ---
        if (localMatches.some(m => m.id === 'match-live-1' || m.id === 'match-completed-1')) {
          console.log('[CricketContext] Legacy mock data detected in cache. Purging...');
          await db.matches.clear();
          await db.players.clear();
          localMatches = [];
          localPlayers = [];
        }

        // Initialize React state immediately with local cache
        setMatches(localMatches);
        if (localMatches.length > 0) setActiveMatchId(localMatches[0].id);
        
        setTeams(localTeams);
        setTournaments(localTournaments);
        
        setPlayers(localPlayers);
        if (localPlayers.length > 0) setSelectedPlayer(localPlayers[0]);

        // 2. If online and Supabase is available, aggressively fetch and reconcile
        if (supabase && navigator.onLine) {
          console.log('[CricketContext] Online: Fetching fresh data from Supabase...');
          
          try {
            const [matchesRes, teamsRes, tournamentsRes, playersRes] = await Promise.allSettled([
              supabase.from('matches').select('*, tournaments!inner(id, deleted_at), home_team:home_team_id(*), away_team:away_team_id(*), man_of_the_match:man_of_the_match_id(id, full_name, avatar_url)').is('deleted_at', null).is('tournaments.deleted_at', null),
              supabase.from('teams').select('*, district:district_id(*), age_category:age_category_id(*)'),
              supabase.from('tournaments').select('*').is('deleted_at', null),
              supabase.from('players').select('*, player_registrations(district:district_id(name), age_category:age_category_id(name))').is('deleted_at', null)
            ]);

            // Reconcile Matches
            if (matchesRes.status === 'fulfilled' && !matchesRes.value.error && matchesRes.value.data) {
              const freshMatches = matchesRes.value.data;
              await db.matches.clear();
              await db.matches.bulkAdd(freshMatches);
              setMatches(freshMatches);
              if (freshMatches.length > 0 && localMatches.length === 0) {
                 setActiveMatchId(freshMatches[0].id);
              }
            }

            // Reconcile Teams
            if (teamsRes.status === 'fulfilled' && !teamsRes.value.error && teamsRes.value.data) {
              const freshTeams = teamsRes.value.data;
              await db.teams.clear();
              await db.teams.bulkAdd(freshTeams);
              setTeams(freshTeams);
            }

            // Reconcile Tournaments
            if (tournamentsRes.status === 'fulfilled' && !tournamentsRes.value.error && tournamentsRes.value.data) {
              const freshTournaments = tournamentsRes.value.data;
              try {
                await db.tournaments.clear();
                await db.tournaments.bulkAdd(freshTournaments);
              } catch (e) {}
              setTournaments(freshTournaments);
            }

            // Reconcile Players
            if (playersRes.status === 'fulfilled' && !playersRes.value.error && playersRes.value.data) {
              const freshPlayers = playersRes.value.data.map(p => {
                let district = 'Unknown';
                let category = 'Unknown';
                if (p.player_registrations && p.player_registrations.length > 0) {
                  const reg = p.player_registrations[0];
                  district = reg.district?.name || district;
                  category = reg.age_category?.name || category;
                }
                return { ...p, district, category };
              });
              await db.players.clear();
              await db.players.bulkAdd(freshPlayers);
              setPlayers(freshPlayers);
              if (freshPlayers.length > 0 && localPlayers.length === 0) {
                 setSelectedPlayer(freshPlayers[0]);
              }
            }

            console.log('[CricketContext] Server reconciliation complete.');
          } catch (e) {
             console.warn('[CricketContext] Error during Supabase reconciliation. Falling back to local Dexie data.', e);
             setAppError(e.message || 'Failed to fetch some live data. You are viewing cached offline data.');
          }
        }

        // Fetch Selection Processes
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
                 isLeadSelector: assignment ? assignment.is_lead_selector : false
               };
             });
             setRepresentativeTeams(formattedProcesses);
             if (formattedProcesses.length > 0) setActiveSelectionTeam(formattedProcesses[0]);
          } catch(e) { console.error('Failed to load selection processes', e); }

          try {
            const anns = await api.getAnnouncements();
            setAnnouncements(anns);
          } catch(e) { console.error('Failed to load announcements', e); }
        }

        setIsAppLoading(false);

        // 2. Setup Supabase Realtime Subscription
        if (supabase) {
          subscription = supabase.channel('public:matches')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'matches' }, async (payload) => {
              console.log('[Realtime] Match update received:', payload);
              
              if (payload.eventType === 'INSERT' || payload.eventType === 'UPDATE') {
                const matchData = payload.new;
                
                // Update Local Dexie
                await db.matches.put(matchData);
                
                // Update React State
                setMatches(prev => {
                  const existingIndex = prev.findIndex(m => m.id === matchData.id);
                  if (existingIndex >= 0) {
                    const newArr = [...prev];
                    newArr[existingIndex] = matchData;
                    return newArr;
                  }
                  return [matchData, ...prev];
                });
              } else if (payload.eventType === 'DELETE') {
                const matchId = payload.old.id;
                await db.matches.delete(matchId);
                setMatches(prev => prev.filter(m => m.id !== matchId));
              }
            })
            .subscribe((status) => {
              console.log('[Realtime] Subscription status:', status);
            });
        }
      } catch (err) {
        console.error('[CricketContext] Sync error:', err);
        setAppError(err.message || 'A critical error occurred while syncing data.');
        setIsAppLoading(false);
      }
    };

    setupDataAndSync();

    return () => {
      if (subscription) {
        supabase.removeChannel(subscription);
      }
    };
  }, []);

  const refreshAdminData = async () => {
    if (!supabase) return;
    try {
      const { db } = await import('../lib/db.js');
      
      const { data: tData, error: tErr } = await supabase.from('tournaments').select('*').is('deleted_at', null);
      if (!tErr && tData) {
        await db.tournaments.clear();
        await db.tournaments.bulkAdd(tData);
        setTournaments(tData);
      }

      const { data: mData, error: mErr } = await supabase.from('matches').select('*, tournaments!inner(id, deleted_at), home_team:home_team_id(*), away_team:away_team_id(*), man_of_the_match:man_of_the_match_id(id, full_name, avatar_url)').is('deleted_at', null).is('tournaments.deleted_at', null);
      if (!mErr && mData) {
        await db.matches.clear();
        await db.matches.bulkAdd(mData);
        setMatches(mData);
      }
    } catch (err) {
      console.error('[CricketContext] Error refreshing admin data:', err);
      setAppError(err.message || 'Failed to refresh admin data.');
    }
  };

  // Match Setup State
  const [matchSetup, setMatchSetup] = useState({
    teamA: '',
    teamAId: null,
    teamB: '',
    teamBId: null,
    teamAShort: '',
    teamBShort: '',
    tossWinner: '',
    tossWinnerTeamId: null,
    electedTo: 'Bat',
    totalOvers: 20,
    widePenalty: 1,
    noBallPenalty: 1,
    umpires: {
      umpire1: '',
      umpire2: '',
      tvUmpire: '',
      referee: ''
    },
    teamAXI: [],
    teamBXI: []
  });

  // Live Scoring Engine State
  const [innings, setInnings] = useState(1); // 1 or 2
  const [currentInningsId, setCurrentInningsId] = useState(null);
  const [target, setTarget] = useState(null);

  const resolveInningsId = async (matchId = activeMatchId, inningsNum = innings) => {
    if (!matchId) return null;
    const num = Number(inningsNum) || 1;

    // 1. Check local Dexie cache first
    try {
      const { db } = await import('../lib/db.js');
      if (db.innings) {
        const cached = await db.innings.where({ match_id: matchId, innings_number: num }).first();
        if (cached?.id) {
          setCurrentInningsId(cached.id);
          return cached.id;
        }
      }
    } catch (e) {
      console.warn('[CricketContext] Dexie cache check failed:', e);
    }

    // 2. Fetch or create via Supabase API
    try {
      const inn = await api.getOrCreateInnings(matchId, num);
      if (inn?.id) {
        setCurrentInningsId(inn.id);
        // Cache to local Dexie
        try {
          const { db } = await import('../lib/db.js');
          if (db.innings) {
            await db.innings.put({
              id: inn.id,
              match_id: matchId,
              innings_number: num,
              batting_team_id: inn.batting_team_id,
              bowling_team_id: inn.bowling_team_id,
              overs_limit: inn.overs_limit,
              status: inn.status
            });
          }
        } catch (cacheErr) {}

        // Calculate Target for second innings
        if (num === 2 && !target) {
          try {
            // Fetch first innings ID
            const { data: firstInn } = await supabase
              .from('innings')
              .select('id')
              .eq('match_id', matchId)
              .eq('innings_number', 1)
              .maybeSingle();
              
            if (firstInn?.id) {
              const { data: deliveries } = await supabase
                .from('deliveries')
                .select('runs_total')
                .eq('match_id', matchId)
                .eq('innings_id', firstInn.id);
                
              if (deliveries) {
                const firstInningsRuns = deliveries.reduce((acc, d) => acc + (d.runs_total || 0), 0);
                setTarget(firstInningsRuns + 1);
              }
            }
          } catch (e) {
            console.error('[CricketContext] Failed to calculate target:', e);
          }
        }

        return inn.id;
      }
    } catch (err) {
      console.error('[CricketContext] Failed to resolve innings ID from API:', err);
    }

    return null;
  };

  useEffect(() => {
    if (activeMatchId) {
      resolveInningsId(activeMatchId, innings);
    }
  }, [activeMatchId, innings]);

  useEffect(() => {
    const activeMatch = matches?.find(m => m.id === activeMatchId);
    if (activeMatch && activeMatch.status === 'COMPLETED') {
      setMatchStatus('COMPLETED');
    }
  }, [activeMatchId, matches]);

  const [matchFormat, setMatchFormat] = useState('T20');
  const [totalMatchOvers, setTotalMatchOvers] = useState(20);
  const [runs, setRuns] = useState(0);
  const [wickets, setWickets] = useState(0);
  const [balls, setBalls] = useState(0);
  const [currentOverBalls, setCurrentOverBalls] = useState([]);
  const [extras, setExtras] = useState({
    wides: 0,
    noBalls: 0,
    legByes: 0,
    byes: 0,
    penalty: 0
  });

  // Current Batters & Bowler on Pitch
  const [striker, setStriker] = useState(null);
  const [nonStriker, setNonStriker] = useState(null);
  const [currentBowler, setCurrentBowler] = useState(null);

  // Ball Direction / Shot Sector & State Machine Attributes
  const [selectedDirection, setSelectedDirection] = useState('Cover');
  const [ballHistory, setBallHistory] = useState([]);
  // Permanent-in-session delivery events: the raw source for scorecards and future analytics.
  const [deliveryLog, setDeliveryLog] = useState([]);
  const [lastOverBowlerId, setLastOverBowlerId] = useState(null);
  const [scoringFirstRunDone, setScoringFirstRunDone] = useState(() => {
    try { return localStorage.getItem('jdca-scoring-first-run') === '1'; } catch { return false; }
  });
  const [isFreeHit, setIsFreeHit] = useState(false);
  const [validationError, setValidationError] = useState(null);
  const [matchStatus, setMatchStatus] = useState('IN_PROGRESS');

  // Modals & Sheets
  const [dismissalModalOpen, setDismissalModalOpen] = useState(false);
  const [extrasModalOpen, setExtrasModalOpen] = useState(false);
  const [compareModalOpen, setCompareModalOpen] = useState(false);
  const [comparePlayer2, setComparePlayer2] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Scorecard detailed tables
  const [scorecard, setScorecard] = useState(INITIAL_SCORECARD);

  useEffect(() => {
    async function loadCandidates() {
      if (!activeSelectionTeam || !supabase) return;
      try {
        const candidateIds = await api.getSelectionCandidates(activeSelectionTeam.id);
        setShortlistedIds(candidateIds);
      } catch (e) {
        console.error('Failed to load selection candidates', e);
      }
    }
    loadCandidates();
  }, [activeSelectionTeam]);

  // Auto-clear validation errors after 3 seconds
  useEffect(() => {
    if (validationError) {
      const timer = setTimeout(() => setValidationError(null), 3500);
      return () => clearTimeout(timer);
    }
  }, [validationError]);

  // Navigation helpers
  const navigateTo = (screenName, tabName = null) => {
    const routeMap = {
      'welcome': '/',
      'home': '/home',
      'matches': '/matches',
      'match-setup': '/match-setup',
      'scoring': '/scoring',
      'scorecard': '/scorecard',
      'match-overview': '/match-overview',
      'innings-break': '/innings-break',
      'match-result': '/match-result',
      'tournaments': '/tournaments',
      'teams': '/teams',
      'players': '/players',
      'scouting': '/players',
      'player-profile': '/player-profile',
      'player-registration': '/player-registration',
      'selection': '/selection',
      'selectors': '/selection',
      'administration': '/administration',
      'access-control': '/administration',
      'news': '/news',
    };
    navigate(routeMap[screenName] || '/home');
  };

  const goBack = () => {
    navigate(-1);
  };

  // Convert raw ball count to cricket overs string
  const formatOversDisplay = (ballCount = balls) => {
    return formatOvers(ballCount);
  };

  // Current Run Rate (CRR)
  const getCRR = () => {
    return calculateCRR(runs, balls);
  };

  // Projected Score
  const getProjectedScore = () => {
    return calculateProjectedScore(runs, balls, matchSetup.totalOvers);
  };

  // Switch striker manually
  const toggleStriker = () => {
    const temp = striker;
    setStriker(nonStriker);
    setNonStriker(temp);
  };

  // Helper to snapshot current state for deterministic Undo
  const captureSnapshot = () => ({
    runs,
    wickets,
    balls,
    currentOverBalls: [...currentOverBalls],
    striker: { ...striker },
    nonStriker: { ...nonStriker },
    currentBowler: { ...currentBowler },
    extras: { ...extras },
    isFreeHit,
    innings,
    matchStatus,
    scorecard: JSON.parse(JSON.stringify(scorecard)),
    lastOverBowlerId,
  });

  // Apply State Machine Result
  const applyStateResult = (result) => {
    if (!result.success) {
      setValidationError(result.error);
      return false;
    }

    const { newState } = result;
    setBallHistory((prev) => [...prev, captureSnapshot()]);

    setRuns(newState.runs);
    setWickets(newState.wickets);
    setBalls(newState.balls);
    setCurrentOverBalls(newState.currentOverBalls);
    setStriker(newState.striker);
    setNonStriker(newState.nonStriker);
    setCurrentBowler(newState.currentBowler);
    setExtras(newState.extras);
    setIsFreeHit(newState.isFreeHit);
    setScorecard(newState.scorecard);
    setMatchStatus(newState.matchStatus);
    if (newState.lastOverBowlerId !== undefined) setLastOverBowlerId(newState.lastOverBowlerId);
    setValidationError(null);

    // Check innings or match termination
    if (newState.matchStatus === MATCH_STATES.INNINGS_BREAK) {
      setTimeout(() => navigateTo('innings-break'), 600);
    } else if (newState.matchStatus === MATCH_STATES.MATCH_FINISHED) {
      // Calculate and finalize match
      try {
        const firstInningsScore = newState.target ? newState.target - 1 : 0;
        let winnerId = null;
        let margin = null;
        let text = '';
        
        const activeMatch = matches?.find(m => m.id === activeMatchId);
        const teamAName = activeMatch?.teamA?.name || activeMatch?.teamA || 'TBA';
        const teamBName = activeMatch?.teamB?.name || activeMatch?.teamB || 'TBA';
        
        // Find team names based on battingTeamId
        const isBattingTeamA = battingTeamId === matchSetup?.teamAId;
        const battingName = isBattingTeamA ? teamAName : teamBName;
        const bowlingName = isBattingTeamA ? teamBName : teamAName;
        
        if (newState.runs > firstInningsScore) {
           winnerId = battingTeamId; 
           const wktsLeft = 10 - newState.wickets;
           margin = `${wktsLeft} wickets`;
           text = `${battingName} won by ${wktsLeft} wicket${wktsLeft !== 1 ? 's' : ''}`;
        } else if (newState.runs < firstInningsScore) {
           winnerId = bowlingTeamId;
           const runsDiff = firstInningsScore - newState.runs;
           margin = `${runsDiff} runs`;
           text = `${bowlingName} won by ${runsDiff} run${runsDiff !== 1 ? 's' : ''}`;
        } else {
           winnerId = null;
           margin = 'Tie';
           text = 'Match tied';
        }
        
        api.finalizeMatch(activeMatchId, winnerId, margin, text).catch(console.error);
      } catch (e) {
        console.error(e);
      }
      setTimeout(() => navigateTo('match-result'), 600);
    }

    return true;
  };

  const recordDeliveryEvent = async (event) => {
    const eventId = `delivery-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    
    // Ensure inningsId is always populated with the actual innings UUID
    let resolvedInningsId = currentInningsId;
    if (!resolvedInningsId && activeMatchId) {
      resolvedInningsId = await resolveInningsId(activeMatchId, innings);
    }

    const payload = {
      id: eventId,
      timestamp: new Date().toISOString(),
      matchId: activeMatchId,
      inningsId: resolvedInningsId || null,
      innings,
      over: formatOvers(balls),
      balls,
      strikerId: striker.id,
      striker: striker.name,
      nonStrikerId: nonStriker.id,
      nonStriker: nonStriker.name,
      bowlerId: currentBowler.id,
      bowler: currentBowler.name,
      ...event,
    };

    // Update local React state array
    setDeliveryLog((prev) => [...prev, payload]);

    try {
      // 1. Save to local Dexie cache
      const { db } = await import('../lib/db.js');
      await db.deliveries.put({
        id: payload.id,
        match_id: payload.matchId,
        innings_id: payload.inningsId,
        over_number: Math.floor((payload.balls || 0) / 6),
        ball_number: ((payload.balls || 0) % 6) + 1,
        payload_blob: payload // Stash full payload for UI viewing if needed offline
      });

      // 2. Queue for Sync to Supabase
      if (!payload.inningsId) {
        console.warn(`[CricketContext] Innings ID missing for match ${activeMatchId}. Queuing delivery for retry.`);
        await queueOfflineAction('RECORD_DELIVERY', payload);
      } else {
        await syncService.executeOrQueue('RECORD_DELIVERY', payload, queueOfflineAction);
      }
    } catch(err) {
      console.error('[CricketContext] Failed to save/sync delivery:', err);
    }
  };

  const markScoringFirstRunDone = () => {
    setScoringFirstRunDone(true);
    try { localStorage.setItem('jdca-scoring-first-run', '1'); } catch {}
  };

  const startInnings = () => {
    recordDeliveryEvent({
      type: 'innings_start',
      runs: 0,
      totalRuns: 0,
      label: 'Start'
    });
    setMatchStatus(MATCH_STATES.IN_PROGRESS);
  };

  const startSecondInnings = (targetRuns) => {
    setTarget(targetRuns);
    setInnings(2);
    setRuns(0);
    setWickets(0);
    setBalls(0);
    setCurrentOverBalls([]);
    setStriker(null);
    setNonStriker(null);
    setCurrentBowler(null);
    // startInnings() will be called by InningsInitScreen once the user selects players
  };

  const replaceStriker = (player) => {
    if (!player) return;
    setStriker((prev) => ({
      id: player.id || prev.id,
      name: player.name || prev.name,
      runs: Number.isFinite(player.runs) ? player.runs : 0,
      balls: Number.isFinite(player.balls) ? player.balls : 0,
      fours: Number.isFinite(player.fours) ? player.fours : 0,
      sixes: Number.isFinite(player.sixes) ? player.sixes : 0,
      strikeRate: player.strikeRate || '0.0',
    }));
  };

  const replaceBatter = (isStriker, player) => {
    if (!player) return;
    const newBatter = {
      id: player.id || `temp-${Date.now()}`,
      name: player.name || 'Batter',
      runs: Number.isFinite(player.runs) ? player.runs : 0,
      balls: Number.isFinite(player.balls) ? player.balls : 0,
      fours: Number.isFinite(player.fours) ? player.fours : 0,
      sixes: Number.isFinite(player.sixes) ? player.sixes : 0,
      strikeRate: player.strikeRate || '0.0',
    };
    if (isStriker) {
      setStriker(newBatter);
    } else {
      setNonStriker(newBatter);
    }
  };

  const replaceBowler = (player) => {
    if (!player) return;
    setCurrentBowler({
      id: player.id,
      name: player.name || 'Bowler',
      overs: 0,
      ballsBowled: 0,
      maidens: 0,
      runs: 0,
      wickets: 0,
      economy: '0.00',
      wk: ''
    });
  };

  const handleRetireBatter = (isStriker, isRetiredOut) => {
    const outName = isStriker ? striker.name : nonStriker.name;
    const dismissalType = isRetiredOut ? 'Retired Out' : 'Retired Hurt';
    
    setBallHistory((prev) => [...prev, captureSnapshot()]);
    
    if (isRetiredOut) {
      setWickets((prev) => prev + 1);
      recordDeliveryEvent({ type: 'wicket', wicket: true, dismissalType, outPlayerName: outName, totalRuns: 0, label: 'W' });
    } else {
      recordDeliveryEvent({ type: 'retire', dismissalType, outPlayerName: outName, totalRuns: 0, label: 'RH' });
    }
  };

  const continueAfterOver = (bowler) => {
    if (!bowler) return;
    setCurrentBowler((prev) => ({
      id: bowler.id,
      name: bowler.name,
      overs: 0,
      ballsBowled: 0,
      maidens: 0,
      runs: 0,
      wickets: 0,
      economy: '0.00',
      wk: '',
    }));
    setMatchStatus(MATCH_STATES.IN_PROGRESS);
    setCurrentOverBalls([]);
  };

  // 1. Add Runs Action (0..6)
  const validateScoringState = () => {
    if (matchStatus === MATCH_STATES.MATCH_FINISHED || matchStatus === 'COMPLETED') {
      setValidationError("Match has already been completed.");
      return false;
    }
    if (!striker?.id || !nonStriker?.id || !currentBowler?.id) {
      setValidationError("Missing active player IDs. Please initialize the innings.");
      return false;
    }
    if (striker.id === nonStriker.id || striker.id === currentBowler.id || nonStriker.id === currentBowler.id) {
      setValidationError("Player IDs must be unique for striker, non-striker, and bowler.");
      return false;
    }
    return true;
  };

  const recordRuns = (runAmount, direction = selectedDirection) => {
    if (!validateScoringState()) return;

    const currentState = {
      runs,
      wickets,
      balls,
      currentOverBalls,
      striker,
      nonStriker,
      currentBowler,
      extras,
      isFreeHit,
      innings,
      totalMatchOvers: matchSetup.totalOvers,
      scorecard,
      lastOverBowlerId,
    };

    const result = processDelivery(currentState, {
      type: 'run',
      runs: runAmount,
      wagonZone: direction,
    });

    const ok = applyStateResult(result);
    if (ok) {
      recordDeliveryEvent({ type: 'run', runs: runAmount, runsOffBat: runAmount, totalRuns: runAmount, label: String(runAmount), wagonZone: direction });
    }
    if (ok && runAmount === 6) {
      confetti({
        particleCount: 40,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#FABB05', '#1D4ED8', '#10B981']
      });
    }
  };

  // 2. Record Extra (Wide, No Ball, Leg Bye, Bye, Penalty)
  const recordExtra = (type, runsWithExtra = 0) => {
    if (!validateScoringState()) return;

    const currentState = {
      runs,
      wickets,
      balls,
      currentOverBalls,
      striker,
      nonStriker,
      currentBowler,
      extras,
      isFreeHit,
      innings,
      totalMatchOvers: matchSetup.totalOvers,
      scorecard,
      lastOverBowlerId,
    };

    const result = processDelivery(currentState, {
      type: 'extra',
      extraType: type,
      extraRuns: runsWithExtra,
    });

    const ok = applyStateResult(result);
    if (ok) {
      const totalRuns = type === 'wide' || type === 'no_ball' ? 1 + runsWithExtra : runsWithExtra;
      recordDeliveryEvent({ type: 'extra', extraType: type, extraRuns: runsWithExtra, totalRuns, label: type === 'wide' ? `${totalRuns}Wd` : type === 'no_ball' ? `${totalRuns}Nb` : `${totalRuns}${type === 'bye' ? 'B' : 'Lb'}` });
    }
  };

  // 3. Record Wicket / Dismissal (Bowled, Caught, LBW, Run Out, Stumped, etc.)
  const recordWicket = (dismissalType, outPlayerName = striker.name, fielder = '', wicketkeeper = '') => {
    if (!validateScoringState()) return;

    const currentState = {
      runs,
      wickets,
      balls,
      currentOverBalls,
      striker,
      nonStriker,
      currentBowler,
      extras,
      isFreeHit,
      innings,
      totalMatchOvers: matchSetup.totalOvers,
      scorecard,
      lastOverBowlerId,
    };

    const result = processDelivery(currentState, {
      type: 'wicket',
      dismissalType,
      outPlayerName,
      fielderName: fielder,
      wicketkeeperName: wicketkeeper,
    });

    const ok = applyStateResult(result);
    if (ok) {
      recordDeliveryEvent({ type: 'wicket', wicket: true, dismissalType, outPlayerName, fielderName: fielder, wicketkeeperName: wicketkeeper, totalRuns: 0, label: 'W' });
      setDismissalModalOpen(false);
    }
  };

  // 4. Undo Last Action (Zero-Drift Event Reversal)
  const undoLastAction = async () => {
    if (ballHistory.length === 0) return;
    if (matchStatus === MATCH_STATES.MATCH_FINISHED || matchStatus === 'COMPLETED') return; // Cannot undo after match completion
    if (deliveryLog.length === 0) return;

    const undoneDelivery = deliveryLog[deliveryLog.length - 1];
    
    // Guard against undoing initialization markers
    if (undoneDelivery.type === 'innings_start' || undoneDelivery.type === 'match_start') {
      return;
    }

    const previousState = ballHistory[ballHistory.length - 1];
    setRuns(previousState.runs);
    setWickets(previousState.wickets);
    setBalls(previousState.balls);
    setCurrentOverBalls(previousState.currentOverBalls);
    setStriker(previousState.striker);
    setNonStriker(previousState.nonStriker);
    setCurrentBowler(previousState.currentBowler);
    setExtras(previousState.extras);
    setIsFreeHit(previousState.isFreeHit);
    setInnings(previousState.innings);
    setMatchStatus(previousState.matchStatus || 'IN_PROGRESS');
    setLastOverBowlerId(previousState.lastOverBowlerId || null);
    
    // Remove from local log
    setDeliveryLog((prev) => prev.slice(0, -1));
    if (previousState.scorecard) {
      setScorecard(previousState.scorecard);
    }
    setBallHistory((prev) => prev.slice(0, -1));
    setValidationError(null);

    // Remove from Dexie & Queue UNDO to Supabase
    try {
      const { db } = await import('../lib/db.js');
      if (db.deliveries) {
        await db.deliveries.where('id').equals(undoneDelivery.id).delete();
      }
      
      const undoPayload = {
        id: undoneDelivery.id,
        matchId: undoneDelivery.matchId,
        inningsId: undoneDelivery.inningsId
      };
      
      await syncService.executeOrQueue('UNDO_DELIVERY', undoPayload, queueOfflineAction);
    } catch (err) {
      console.error('[CricketContext] Failed to persist undo:', err);
    }
  };

  // Shortlist toggle for scouting
  const toggleShortlist = async (playerId) => {
    if (!activeSelectionTeam) return;
    const isAdding = !shortlistedIds.includes(playerId);
    
    // Optimistic UI update
    setShortlistedIds((prev) =>
      isAdding
        ? [...prev, playerId]
        : prev.filter((id) => id !== playerId)
    );

    try {
      await api.toggleCandidate(activeSelectionTeam.id, playerId, isAdding);
    } catch (e) {
      console.error('Failed to toggle candidate', e);
      // Revert on failure
      setShortlistedIds((prev) =>
        !isAdding
          ? [...prev, playerId]
          : prev.filter((id) => id !== playerId)
      );
    }
  };

  const finalizeSelectionProcess = async (processId, selectedPlayerIds) => {
    if (!selectedPlayerIds || selectedPlayerIds.length === 0) {
      throw new Error("No players selected for finalization.");
    }
    try {
      await api.finalizeSquad(processId, selectedPlayerIds);
      setRepresentativeTeams(prev => prev.map(t => t.id === processId ? { ...t, status: 'FINALIZED' } : t));
      if (activeSelectionTeam && activeSelectionTeam.id === processId) {
        setActiveSelectionTeam({ ...activeSelectionTeam, status: 'FINALIZED' });
      }
      return true;
    } catch (e) {
      console.error('Failed to finalize squad', e);
      throw e;
    }
  };

  // Register new player
  const registerPlayer = async (playerData) => {
    try {
      const p = await api.registerPlayer(playerData);
      
      const newPlayer = {
        id: p.id,
        name: p.full_name,
        avatar: p.avatar_url || '',
        team: 'Local Club',
        club: 'District XI',
        role: p.primary_role,
        primaryRole: p.primary_role,
        battingStyle: p.batting_style,
        bowlingStyle: p.bowling_style,
        age: 20,
        isPro: false,
        tags: [p.primary_role, 'Registered'],
        careerRuns: 0,
        battingAvg: 0.0,
        strikeRate: 0.0,
        highScore: '0',
        matches: 0,
        innings: 0,
        notOuts: 0,
        fifties: 0,
        hundreds: 0,
        economy: 0.0,
        wickets: 0,
        bestBowling: '0/0',
        fiveFours: 0,
        catches: 0,
        stumpings: 0,
        scoringAreas: {
          offSide: 50,
          legSide: 50,
          behindSquare: 0,
          fine: 0,
        },
        district: playerData.district || '',
        category: playerData.category || '',
        inForm: false,
      };

      await db.players.put(newPlayer);
      setPlayers((prev) => [newPlayer, ...prev]);
      setSelectedPlayer(newPlayer);
      navigateTo('player-profile');
    } catch (e) {
      console.error('Failed to register player:', e);
      alert('Failed to register player. Please check network connection.');
      throw e;
    }
  };

  return (
    <CricketContext.Provider
      value={{
        currentScreen,
        activeTab,
        navigateTo,
        goBack,
        isAuthenticated,
        setIsAuthenticated,
        userEmail,
        userId,
        userName,
        setUserEmail,
        userRole,
        userPermissions,
        setUserRole,
        isDarkMode,
        setIsDarkMode,
        registeredUsers,
        setRegisteredUsers,
        systemSettings,
        setSystemSettings,
        players,
        setPlayers,
        selectedPlayer,
        setSelectedPlayer,
        shortlistedIds,
        setShortlistedIds,
        toggleShortlist,
        finalizeSelectionProcess,
        registerPlayer,
        teams,
        setTeams,
        tournaments,
        setTournaments,
        refreshAdminData,
        matches,
        activeMatchId,
        setActiveMatchId,
        matchSetup,
        setMatchSetup,
        innings,
        setInnings,
        currentInningsId,
        setCurrentInningsId,
        resolveInningsId,
        matchFormat,
        totalMatchOvers,
        target,
        runs,
        wickets,
        balls,
        formatOvers,
        calculateCRR,
        calculateProjectedScore,
        currentOverBalls,
        extras,
        striker,
        nonStriker,
        currentBowler,
        isFreeHit,
        validationError,
        setValidationError,
        matchStatus,
        canBowlerBowlNextOver,
        MATCH_STATES,
        toggleStriker,
        recordRuns,
        recordExtra,
        recordWicket,
        undoLastAction,
        selectedDirection,
        setSelectedDirection,
        dismissalModalOpen,
        setDismissalModalOpen,
        extrasModalOpen,
        setExtrasModalOpen,
        compareModalOpen,
        setCompareModalOpen,
        comparePlayer2,
        setComparePlayer2,
        drawerOpen,
        setDrawerOpen,
        scorecard,
        setScorecard,
        deliveryLog,
        lastOverBowlerId,
        replaceStriker,
        replaceBatter,
        replaceBowler,
        handleRetireBatter,
        continueAfterOver,
        scoringFirstRunDone,
        markScoringFirstRunDone,
        startInnings,
        startSecondInnings,
        isAppLoading,
        officials: [],
        districtStats: [],
        selectionHistory: [],
        announcements,
        setAnnouncements,
        pointsTable: [],
        appError,
        setAppError,
        representativeTeams,
        setRepresentativeTeams,
        activeSelectionTeam,
        setActiveSelectionTeam,
        selectorPermissions,
        setSelectorPermissions,
      }}
    >
      {children}
    </CricketContext.Provider>
  );
}

export function useCricket() {
  const context = useContext(CricketContext);
  if (!context) {
    throw new Error('useCricket must be used within a CricketProvider');
  }
  return context;
}
