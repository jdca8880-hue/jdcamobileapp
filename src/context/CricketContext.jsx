import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import confetti from 'canvas-confetti';
import { supabase } from '../lib/supabase';
import {
  processDelivery,
  formatOvers,
  calculateCRR,
  calculateProjectedScore,
  canBowlerBowlNextOver,
  MATCH_STATES,
} from '../engine/cricketStateMachine';
import { INITIAL_SCORECARD, FIELD_DIRECTIONS } from '../data/constants';

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
    'administration': 'administration',
    'access-control': 'administration',
  };
  const activeTab = activeTabMap[currentScreen] || 'home';

  // Application Loading State
  const [isAppLoading, setIsAppLoading] = useState(true);

  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [userRole, setUserRole] = useState('Admin'); // SuperAdmin, Admin, Scorer, Selector, Player

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
  const [registeredUsers, setRegisteredUsers] = useState([
    { id: 'usr_001', name: 'Rohan (Super Admin)', email: 'superadmin@jdca.com', password: 'password123', role: 'SuperAdmin' },
    { id: 'usr_002', name: 'Admin User', email: 'admin@jdca.com', password: 'password123', role: 'Admin' },
    { id: 'usr_003', name: 'Scorer One', email: 'scorer@jdca.com', password: 'password123', role: 'Scorer' },
    { id: 'usr_004', name: 'Selector Lead', email: 'selector@jdca.com', password: 'password123', role: 'Selector' },
    { id: 'usr_005', name: 'Player Virat', email: 'player@jdca.com', password: 'password123', role: 'Player' }
  ]);

  // Selection Context State & Representative Teams
  const [representativeTeams, setRepresentativeTeams] = useState([
    { id: 'jdca-u13-m-2026', name: 'JDCA U13 Men 2026', ageCategory: 'Under 13', gender: 'Men', season: '2026', targetSquadSize: 16, ageRankLevel: 1 },
    { id: 'jdca-u15-m-2026', name: 'JDCA U15 Men 2026', ageCategory: 'Under 15', gender: 'Men', season: '2026', targetSquadSize: 16, ageRankLevel: 2 },
    { id: 'jdca-u17-m-2026', name: 'JDCA U17 Men 2026', ageCategory: 'Under 17', gender: 'Men', season: '2026', targetSquadSize: 16, ageRankLevel: 3 },
    { id: 'jdca-u19-m-2026', name: 'JDCA U19 Men 2026', ageCategory: 'Under 19', gender: 'Men', season: '2026', targetSquadSize: 16, ageRankLevel: 4 },
    { id: 'jdca-u23-m-2026', name: 'JDCA U23 Men 2026', ageCategory: 'Under 23', gender: 'Men', season: '2026', targetSquadSize: 16, ageRankLevel: 5 },
    { id: 'jdca-senior-m-2026', name: 'JDCA Senior Men 2026', ageCategory: 'Senior', gender: 'Men', season: '2026', targetSquadSize: 16, ageRankLevel: 6 },
    { id: 'jdca-u19-w-2026', name: 'JDCA U19 Women 2026', ageCategory: 'Under 19', gender: 'Women', season: '2026', targetSquadSize: 16, ageRankLevel: 4 },
    { id: 'jdca-senior-w-2026', name: 'JDCA Senior Women 2026', ageCategory: 'Senior', gender: 'Women', season: '2026', targetSquadSize: 16, ageRankLevel: 6 },
  ]);

  const [activeSelectionTeam, setActiveSelectionTeam] = useState({
    id: 'jdca-u19-m-2026',
    name: 'JDCA U19 Men 2026',
    ageCategory: 'Under 19',
    gender: 'Men',
    season: '2026',
    targetSquadSize: 16,
    ageRankLevel: 4
  });

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
            setIsAuthenticated(true);
            // Fetch role from profiles
            const { data: profile } = await supabase
              .from('profiles')
              .select('role')
              .eq('id', session.user.id)
              .single();
            if (profile) setUserRole(profile.role);
          }
          
          supabase.auth.onAuthStateChange(async (event, session) => {
            if (session?.user) {
              setUserEmail(session.user.email);
              setIsAuthenticated(true);
              const { data: profile } = await supabase
                .from('profiles')
                .select('role')
                .eq('id', session.user.id)
                .single();
              if (profile) setUserRole(profile.role);
            } else {
              setIsAuthenticated(false);
              setUserEmail('');
              setUserRole('Player');
            }
          });
        }

        let localMatches = await db.matches.toArray();
        
        // --- MIGRATION: Purge old mock data from local cache ---
        if (localMatches.some(m => m.id === 'match-live-1' || m.id === 'match-completed-1')) {
          console.log('[CricketContext] Legacy mock data detected in cache. Purging...');
          await db.matches.clear();
          await db.players.clear();
          localMatches = [];
        }

        if (localMatches.length === 0) {
          console.log('[CricketContext] No local matches, fetching from Supabase...');
          if (supabase) {
            const { data, error } = await supabase.from('matches').select('*, home_team:home_team_id(*), away_team:away_team_id(*)');
            if (!error && data && data.length > 0) {
              await db.matches.bulkAdd(data);
              localMatches = data;
            }
          }
        }
        setMatches(localMatches);
        if (localMatches.length > 0) setActiveMatchId(localMatches[0].id);

        // Fetch Teams
        let localTeams = await db.teams.toArray();
        if (localTeams.length === 0 && supabase) {
          console.log('[CricketContext] No local teams, fetching from Supabase...');
          const { data, error } = await supabase.from('teams').select('*, district:district_id(*), age_category:age_category_id(*)');
          if (!error && data) {
            await db.teams.bulkAdd(data);
            localTeams = data;
          }
        }
        setTeams(localTeams);

        let localPlayers = await db.players.toArray();
        if (localPlayers.length === 0 && supabase) {
          console.log('[CricketContext] No local players, fetching from Supabase...');
          const { data, error } = await supabase.from('players').select('*');
          if (!error && data) {
            await db.players.bulkAdd(data);
            localPlayers = data;
          }
        }
        setPlayers(localPlayers);
        if (localPlayers.length > 0) setSelectedPlayer(localPlayers[0]);

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

  // Match Setup State
  const [matchSetup, setMatchSetup] = useState({
    teamA: 'Team A',
    teamB: 'Team B',
    teamAShort: 'TA',
    teamBShort: 'TB',
    tossWinner: 'Team A',
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
    playingXI: []
  });

  // Live Scoring Engine State
  const [innings, setInnings] = useState(1); // 1 or 2
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
  const [striker, setStriker] = useState({
    id: '',
    name: 'Striker',
    runs: 0,
    balls: 0,
    fours: 0,
    sixes: 0,
    strikeRate: '0.0'
  });

  const [nonStriker, setNonStriker] = useState({
    id: '',
    name: 'Non-Striker',
    runs: 0,
    balls: 0,
    fours: 0,
    sixes: 0,
    strikeRate: '0.0'
  });

  const [currentBowler, setCurrentBowler] = useState({
    id: '',
    name: 'Bowler',
    overs: 0,
    ballsBowled: 0,
    maidens: 0,
    runs: 0,
    wickets: 0,
    economy: '0.00',
    wk: ''
  });

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
      setTimeout(() => navigateTo('match-result'), 600);
    }

    return true;
  };

  const recordDeliveryEvent = (event) => {
    const eventId = `delivery-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    setDeliveryLog((prev) => [...prev, {
      id: eventId,
      timestamp: new Date().toISOString(),
      matchId: activeMatchId,
      innings,
      over: formatOvers(balls),
      strikerId: striker.id,
      striker: striker.name,
      nonStrikerId: nonStriker.id,
      nonStriker: nonStriker.name,
      bowlerId: currentBowler.id,
      bowler: currentBowler.name,
      ...event,
    }]);
  };

  const markScoringFirstRunDone = () => {
    setScoringFirstRunDone(true);
    try { localStorage.setItem('jdca-scoring-first-run', '1'); } catch {}
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
      name: player.name || 'Unknown',
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
  const recordRuns = (runAmount, direction = selectedDirection) => {
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
  const undoLastAction = () => {
    if (ballHistory.length === 0) return;
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
    setDeliveryLog((prev) => prev.slice(0, -1));
    if (previousState.scorecard) {
      setScorecard(previousState.scorecard);
    }
    setBallHistory((prev) => prev.slice(0, -1));
    setValidationError(null);
  };

  // Shortlist toggle for scouting
  const toggleShortlist = (playerId) => {
    setShortlistedIds((prev) =>
      prev.includes(playerId)
        ? prev.filter((id) => id !== playerId)
        : [...prev, playerId]
    );
  };

  // Register new player
  const registerPlayer = (playerData) => {
    const newPlayer = {
      id: `player-${Date.now()}`,
      name: playerData.name || 'New Player',
      avatar: playerData.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
      team: playerData.team || 'Local Club',
      club: playerData.district || 'District XI',
      role: playerData.role || 'Batter',
      primaryRole: playerData.role || 'Top Order Batter',
      battingStyle: playerData.battingStyle || 'Right-Hand Batter',
      bowlingStyle: playerData.bowlingStyle || 'None (Pure Batter)',
      age: playerData.age || 20,
      isPro: false,
      tags: [playerData.role || 'Batter', 'Registered'],
      careerRuns: 0,
      battingAvg: 0.0,
      strikeRate: 0.0,
      highScore: '0',
      matches: 0,
      innings: 0,
      notOuts: 0,
      fifties: 0,
      hundreds: 0,
      fours: 0,
      sixes: 0,
      last5Matches: [],
      scoringAreas: {
        offSide: 50,
        legSide: 50,
        behindSquare: 0,
        fine: 0,
      },
      district: playerData.district || 'Indore District',
      category: playerData.category || 'Senior',
      inForm: false,
    };

    setPlayers((prev) => [newPlayer, ...prev]);
    setSelectedPlayer(newPlayer);
    navigateTo('player-profile');
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
        setUserEmail,
        userRole,
        setUserRole,
        isDarkMode,
        setIsDarkMode,
        registeredUsers,
        setRegisteredUsers,
        players,
        setPlayers,
        selectedPlayer,
        setSelectedPlayer,
        shortlistedIds,
        toggleShortlist,
        registerPlayer,
        teams,
        setTeams,
        matches,
        activeMatchId,
        setActiveMatchId,
        matchSetup,
        setMatchSetup,
        innings,
        setInnings,
        matchFormat,
        totalMatchOvers,
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
        handleRetireBatter,
        continueAfterOver,
        scoringFirstRunDone,
        markScoringFirstRunDone,
        isAppLoading,
        officials: [],
        tournaments: [],
        districtStats: [],
        selectionHistory: [],
        announcements: [],
        pointsTable: [],
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
