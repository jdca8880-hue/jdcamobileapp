import React, { useEffect, useMemo, useState } from 'react';
import {
  RotateCcw, FileText, ShieldAlert, AlertTriangle, X,
  ChevronRight, RefreshCw, Radio, CircleHelp, WifiOff,
  MoreHorizontal, Users, Trophy, Calendar, ChevronDown, Clock, Pause, Play, CornerUpRight
} from 'lucide-react';
import { useCricket } from '../../context/CricketContext';
import { useHaptics } from '../../hooks/useHaptics';
import { FREE_HIT_ALLOWED_DISMISSALS } from '../../engine/validationSchemas';
import { motion } from 'motion/react';
import Modal from '../ui/Modal';
import { supabase } from '../../lib/supabase';
import { api } from '../../lib/api';
import { syncService } from '../../services/SyncService';
import InningsInitScreen from './InningsInitScreen';
import { MatchCard } from '../ui/MatchCard';
import MatchInterruptionModal from '../ui/MatchInterruptionModal';

const DISMISSALS = ['Bowled', 'Caught', 'LBW', 'Run Out', 'Stumped', 'Hit Wicket', 'Other'];
const QUICK_RUNS = [0, 1, 2, 3, 4, 6];

export default function ScoringScreen() {
  const {
    runs, wickets, balls, formatOvers, calculateCRR, calculateProjectedScore,
    currentOverBalls, striker, nonStriker, currentBowler, isFreeHit, toggleStriker,
    validationError, setValidationError, matchStatus, recordRuns, recordExtra, recordPenaltyEvent,
    recordWicket, undoLastAction, innings, target, navigateTo, activeMatchId, matches,
    currentBattingTeamId, currentBowlingTeamId,
    matchSetup, setMatchSetup, applyRevisedOvers, endMatchEarly, hydrateMatchState, replaceStriker, replaceBatter, handleRetireBatter, continueAfterOver, lastOverBowlerId,
    deliveryLog = [], scoringFirstRunDone, markScoringFirstRunDone, goBack, startSecondInnings,
    startSuperOver, startSuperOverSecondInnings,
    tournaments, setActiveMatchId, isAppLoading, totalMatchOvers,
    isPaused, pauseMatch, resumeMatch, togglePauseMatch, resetScoringSession,
    notificationsEnabled
  } = useCricket();

  const haptics = useHaptics();

  const [dismissalOpen, setDismissalOpen] = useState(false);
  const [selectedDismissal, setSelectedDismissal] = useState('Caught');
  const [fielder, setFielder] = useState('');
  const [runOutPlayerId, setRunOutPlayerId] = useState(null);
  const [runsCompleted, setRunsCompleted] = useState(0);
  const [newBatterOpen, setNewBatterOpen] = useState(false);
  const [replacingBatterType, setReplacingBatterType] = useState('striker');
  const [retireModalOpen, setRetireModalOpen] = useState(false);
  const [retiringBatter, setRetiringBatter] = useState('striker');
  const [retireType, setRetireType] = useState('hurt');
  const [overOpen, setOverOpen] = useState(false);
  const [changeWkOpen, setChangeWkOpen] = useState(false);
  const [extrasOpen, setExtrasOpen] = useState(false);
  const [extraCategory, setExtraCategory] = useState('wide');
  const [overthrowOpen, setOverthrowOpen] = useState(false);
  const [runsCompletedBeforeThrow, setRunsCompletedBeforeThrow] = useState(1);
  const [overthrowRuns, setOverthrowRuns] = useState(1);
  const [overthrowIsBoundary, setOverthrowIsBoundary] = useState(false);
  const [extraRuns, setExtraRuns] = useState(0);
  const [isExtraBoundary, setIsExtraBoundary] = useState(false);
  const [recipientTeamId, setRecipientTeamId] = useState(null);
  const [showHelp, setShowHelp] = useState(false);
  const [syncState, setSyncState] = useState({ status: 'ONLINE', pendingCount: 0 });
  const [syncError, setSyncError] = useState(null);
  const [isHydrating, setIsHydrating] = useState(false);
  const [hydrationError, setHydrationError] = useState(null);
  const [selectedTournament, setSelectedTournament] = useState('');
  const [interruptionModalOpen, setInterruptionModalOpen] = useState(false);

  const activeMatch = matches?.find(m => m.id === activeMatchId);
  const currentTotalOvers = matchSetup?.totalOvers || activeMatch?.max_overs || totalMatchOvers || 20;

  const latestDeliveryLogRef = React.useRef(deliveryLog || []);
  useEffect(() => {
    latestDeliveryLogRef.current = deliveryLog || [];
  }, [deliveryLog]);

  // Guard: if the stored activeMatchId is no longer a valid match in the DB list, clear it
  // This prevents the scorer from getting stuck on a "no network" error after a stale session
  useEffect(() => {
    if (!activeMatchId || !matches || matches.length === 0) return;
    if (isAppLoading) return; // wait until initial app data is loaded
    const exists = matches.some(m => m.id === activeMatchId);
    if (!exists) {
      console.warn('[ScoringScreen] Stored activeMatchId not found in match list. Clearing stale session.');
      setActiveMatchId(null);
      setHydrationError(null);
      navigateTo('matches');
    }
  }, [activeMatchId, matches, isAppLoading]);

  const performHydration = React.useCallback(async () => {
    if (!activeMatchId) return;
    setIsHydrating(true);
    setHydrationError(null);
    try {
      const timeoutPromise = new Promise(resolve => 
        setTimeout(() => resolve({ success: false, timeout: true, error: 'Hydration timed out' }), 4500)
      );
      const result = await Promise.race([hydrateMatchState(activeMatchId), timeoutPromise]);
      setIsHydrating(false);
      if (!result?.success && !result?.timeout) {
        setHydrationError(result?.error || 'Unknown error');
      }
    } catch (err) {
      setIsHydrating(false);
      setHydrationError(err?.message || 'Hydration failed');
    }
  }, [activeMatchId, hydrateMatchState]);

  useEffect(() => {
    let isMounted = true;
    const checkHydration = async () => {
      if (!activeMatchId) return;

      // 1. If matchSetup is already loaded for this match with Playing XI, no need to re-hydrate from database
      if (matchSetup?.matchId === activeMatchId && matchSetup?.teamAXI?.length > 0) {
        if (isMounted) setIsHydrating(false);
        return;
      }

      // 2. Fast local recovery from localStorage
      try {
        const cached = JSON.parse(
          localStorage.getItem(`jdca-match-setup-${activeMatchId}`) ||
          localStorage.getItem(`jdca_match_setup_${activeMatchId}`) ||
          'null'
        );
        if (cached && Array.isArray(cached.teamAXI) && cached.teamAXI.length > 0) {
          setMatchSetup(prev => ({
            ...prev,
            ...cached,
            matchId: activeMatchId
          }));
          if (isMounted) setIsHydrating(false);
          return;
        }
      } catch (e) {}

      // 3. If no setup exists locally, hydrate with a strict timeout so the screen never freezes
      if (!matchSetup?.teamAXI || matchSetup.teamAXI.length === 0 || matchSetup?.matchId !== activeMatchId) {
        setIsHydrating(true);
        setHydrationError(null);

        const timeoutPromise = new Promise(resolve => 
          setTimeout(() => resolve({ success: false, timeout: true, error: 'Hydration timed out' }), 4500)
        );

        try {
          const result = await Promise.race([hydrateMatchState(activeMatchId), timeoutPromise]);
          if (isMounted) {
            setIsHydrating(false);
            if (!result?.success && !result?.timeout) {
              setHydrationError(result?.error || 'Unknown error');
            }
          }
        } catch (err) {
          if (isMounted) {
            setIsHydrating(false);
          }
        }
      }
    };
    checkHydration();
    return () => { isMounted = false; };
  }, [activeMatchId, matchSetup?.matchId]);

  // Auto-retry hydration when connectivity is restored
  useEffect(() => {
    const handleOnline = () => {
      if (hydrationError && activeMatchId) {
        performHydration();
      }
    };
    window.addEventListener('online', handleOnline);
    return () => window.removeEventListener('online', handleOnline);
  }, [hydrationError, activeMatchId, performHydration]);

  const hydrateMatchStateRef = React.useRef(hydrateMatchState);
  useEffect(() => {
    hydrateMatchStateRef.current = hydrateMatchState;
  });

  // Realtime listener for cross-device updates


  useEffect(() => {
    const unsubscribe = syncService.subscribe((state) => {
      setSyncState(state);
    });

    const handleSyncError = (e) => {
      // Show error even if it's for a different match, because it jams the entire queue!
      setSyncError(e.detail);
    };

    window.addEventListener('sync-permanent-failure', handleSyncError);
    return () => {
      unsubscribe();
      window.removeEventListener('sync-permanent-failure', handleSyncError);
    };
  }, [activeMatchId]);



  const teamAName = activeMatch?.home_team?.name || activeMatch?.teamA?.name || 'Unknown Team';
  const teamBName = activeMatch?.away_team?.name || activeMatch?.teamB?.name || 'Unknown Team';
  const matchTournament = tournaments?.find(t => t.id === activeMatch?.tournament_id);
  const tournamentName = activeMatch?.tournament || 'JDCA District Cricket';

  // Resolve XIs based on innings
  const teamAXI = matchSetup?.teamAXI || [];
  const teamBXI = matchSetup?.teamBXI || [];
  const tossWinnerTeamId = matchSetup?.tossWinnerTeamId;
  const electedTo = matchSetup?.electedTo;

  let battingTeamId = matchSetup?.teamAId;
  let bowlingTeamId = matchSetup?.teamBId;

  const authBattingTeamId = currentBattingTeamId;
  const authBowlingTeamId = currentBowlingTeamId;

  if (authBattingTeamId && authBowlingTeamId &&
    (authBattingTeamId === matchSetup?.teamAId || authBattingTeamId === matchSetup?.teamBId)) {
    // Authoritative: use the innings record so the correct team bats (esp. 2nd innings).
    battingTeamId = authBattingTeamId;
    bowlingTeamId = authBowlingTeamId;
  } else {
    if (tossWinnerTeamId) {
      const isBat = String(electedTo || '').toUpperCase() === 'BAT';
      if (tossWinnerTeamId === matchSetup?.teamAId) {
        battingTeamId = isBat ? matchSetup?.teamAId : matchSetup?.teamBId;
        bowlingTeamId = isBat ? matchSetup?.teamBId : matchSetup?.teamAId;
      } else {
        battingTeamId = isBat ? matchSetup?.teamBId : matchSetup?.teamAId;
        bowlingTeamId = isBat ? matchSetup?.teamAId : matchSetup?.teamBId;
      }
    }

    // In innings 2, teams swap. In innings 3 (Super Over 1st innings), the team that batted second bats first, so they stay swapped.
    // In innings 4 (Super Over 2nd innings), they swap back to their original state.
    if (innings === 2 || innings === 3) {
      const temp = battingTeamId;
      battingTeamId = bowlingTeamId;
      bowlingTeamId = temp;
    }
  }

  const battingXI = battingTeamId === matchSetup?.teamAId ? teamAXI : teamBXI;
  const bowlingXI = bowlingTeamId === matchSetup?.teamAId ? teamAXI : teamBXI;
  const currentBattingTeamName = battingTeamId === matchSetup?.teamAId ? teamAName : teamBName;
  const currentBowlingTeamName = bowlingTeamId === matchSetup?.teamAId ? teamAName : teamBName;

  // Only force full InningsInitScreen at the very beginning of the innings
  const needsInitialization = balls === 0 && (!striker?.id || !nonStriker?.id || !currentBowler?.id);

  // Track all dismissed batters in the current innings to prevent selecting already out players
  const dismissedBatterIds = useMemo(() => {
    const ids = new Set();
    deliveryLog.forEach(d => {
      const inn = d.innings || 1;
      if (inn === innings) {
        if (d.dismissedPlayerId) ids.add(String(d.dismissedPlayerId));
        if (d.dismissed_player_id) ids.add(String(d.dismissed_player_id));
        if (d.wicket && d.strikerId) ids.add(String(d.strikerId));
        if (d.wicket && d.striker_id) ids.add(String(d.striker_id));
        if (d.type === 'wicket' && d.outPlayerName) ids.add(d.outPlayerName);
        if (d.type === 'retire' && d.outPlayerName) ids.add(d.outPlayerName);
      }
    });
    return ids;
  }, [deliveryLog, innings]);

  const batters = useMemo(() => battingXI.filter(p => {
    const pName = p?.full_name || p?.name;
    const pId = String(p?.id);
    const isCurrentStriker = pId === String(striker?.id) || (pName && pName === striker?.name);
    const isCurrentNonStriker = pId === String(nonStriker?.id) || (pName && pName === nonStriker?.name);
    const isDismissed = dismissedBatterIds.has(pId) || (pName && dismissedBatterIds.has(pName));
    return pName && !isCurrentStriker && !isCurrentNonStriker && !isDismissed;
  }), [battingXI, striker, nonStriker, dismissedBatterIds]);
  const lastBalls = (currentOverBalls || []).map((b, i) => ({
    id: `temp-${i}`,
    runs: Number(b.runs || b.value || 0),
    wicket: b.type === 'wicket',
    extra: b.type === 'extra',
    label: b.label || b.runs || 0
  }));
  const isOverComplete = matchStatus === 'OVER_COMPLETE';

  useEffect(() => {
    if (isOverComplete) setOverOpen(true);
  }, [isOverComplete]);

  if (!activeMatchId) {
    const activeTournaments = tournaments?.filter(t => t.status === 'ACTIVE' || t.status === 'UPCOMING') || [];
    const filteredMatches = matches?.filter(m => {
      if (m.status === 'COMPLETED' || m.status === 'FINISHED') return false;
      return selectedTournament ? m.tournament_id === selectedTournament : true;
    }) || [];

    return (
      <div className="flex-1 flex flex-col p-4 bg-slate-50 min-h-[80vh]">
        <div className="flex flex-col items-center justify-center py-6 mb-2">
          <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mb-4 text-primary-600 shadow-sm border border-primary-200">
            <Trophy size={32} />
          </div>
          <h2 className="text-2xl font-black text-gray-900 text-center">Select Match to Score</h2>
          <p className="text-sm text-gray-500 mt-2 text-center max-w-xs">
            Choose a live or upcoming match from the list below to begin scoring.
          </p>
        </div>

        <div className="mb-6 relative">
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Filter by Tournament</label>
          <div className="relative">
            <select
              value={selectedTournament}
              onChange={(e) => setSelectedTournament(e.target.value)}
              className="w-full p-3 pl-4 pr-10 appearance-none rounded-xl border border-gray-200 bg-white shadow-sm focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-100 font-semibold text-gray-800 transition-all"
            >
              <option value="">All Tournaments</option>
              {activeTournaments.map(t => (
                <option key={t.id} value={t.id}>{t.name}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={20} />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto pb-20">
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Available Matches ({filteredMatches.length})</label>

          {filteredMatches.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 bg-white rounded-xl border border-gray-100 shadow-sm border-dashed">
              <Calendar className="h-10 w-10 text-gray-300 mb-3" />
              <p className="text-gray-500 font-medium">No matches available to score.</p>
              <p className="text-gray-400 text-xs mt-1">Try selecting a different tournament.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredMatches.map(m => (
                <MatchCard key={m.id} match={m} onClick={() => setActiveMatchId(m.id)} />
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  if (isHydrating) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center min-h-[60vh] p-6 text-center">
        <RefreshCw className="h-10 w-10 text-primary-600 animate-spin mb-4" />
        <h3 className="text-xl font-bold text-gray-800 dark:text-white">Hydrating Match State...</h3>
        <p className="text-gray-500 dark:text-gray-400 mt-2 max-w-sm text-sm">Reconstructing scoring state from database.</p>
        <button
          type="button"
          onClick={() => setIsHydrating(false)}
          className="mt-6 px-4 py-2 bg-gray-200 dark:bg-zinc-800 text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-zinc-700 rounded-lg text-xs font-semibold transition-colors"
        >
          Skip & Continue to Scoring
        </button>
      </div>
    );
  }

  if (hydrationError) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">
        <WifiOff className="h-12 w-12 text-red-500 mb-4" />
        <h3 className="text-xl font-bold text-gray-800 dark:text-white">Failed to Load Match</h3>
        <p className="text-gray-500 dark:text-gray-400 mt-2">Error: {String(hydrationError)}</p>
        <p className="text-gray-400 text-sm mt-1">Please check your network connection and try again.</p>
        <div className="flex items-center gap-3 mt-6">
          <button
            onClick={() => performHydration()}
            className="px-6 py-2 bg-primary-600 text-white rounded-lg font-semibold flex items-center gap-2 hover:bg-primary-700 transition"
          >
            <RefreshCw className="h-4 w-4" /> Retry Loading
          </button>
          <button
            onClick={() => {
              setActiveMatchId(null);
              navigateTo('home');
            }}
            className="px-6 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded-lg font-semibold hover:bg-gray-300 dark:hover:bg-gray-600 transition"
          >
            Return Home
          </button>
        </div>
      </div>
    );
  }

  if (needsInitialization) {
    if (battingXI.length === 0 || bowlingXI.length === 0) {
      return (
        <div className="flex-1 flex flex-col items-center justify-center min-h-[60vh] px-4 text-center bg-slate-50">
          <AlertTriangle className="h-12 w-12 text-amber-500 mb-4" />
          <h3 className="text-xl font-black text-gray-800">No Playing XI Found</h3>
          <p className="text-gray-500 text-sm mt-2 mb-6">
            This match is marked as in-progress, but no playing XI was found in the database.
            You need to set up the playing XI before you can start scoring.
          </p>
          <button
            onClick={() => navigateTo('match-setup')}
            className="px-6 py-3 bg-[#2457D6] text-white rounded-[12px] font-bold shadow-md"
          >
            Go to Match Setup
          </button>
        </div>
      );
    }
    return (
      <InningsInitScreen
        battingXI={battingXI}
        bowlingXI={bowlingXI}
        battingTeamName={currentBattingTeamName}
        bowlingTeamName={currentBowlingTeamName}
        innings={innings}
        target={target}
      />
    );
  }

  const doRun = (value) => {
    recordRuns(value);
    if (!scoringFirstRunDone) markScoringFirstRunDone?.();

    // Send push notification to update score silently, but vibrate for 4s and 6s
    if (notificationsEnabled) {
      const isBoundary = value === 4 || value === 6;
      let title = isBoundary ? (value === 6 ? 'SIX! What a shot!' : 'FOUR!') : 'Live Score Update';
      let bodyText = isBoundary
        ? `${striker?.name} hit a ${value}! ${teamAName} is ${runs + value}/${wickets}`
        : `${teamAName} is ${runs + value}/${wickets} (Last: ${value} run${value !== 1 ? 's' : ''})`;

      supabase.functions.invoke('send-push', {
        body: {
          title,
          body: bodyText,
          url: `/matches`,
          tag: `match-${activeMatchId || 'jdca'}`,
          renotify: isBoundary
        }
      });
    }
  };

  const submitWicket = () => {
    let finalDismissedId = striker?.id;
    let outName = striker?.name;

    if (selectedDismissal === 'Run Out') {
      finalDismissedId = runOutPlayerId;
      outName = runOutPlayerId === striker?.id ? striker?.name : nonStriker?.name;
    }

    let wk = '';
    if (selectedDismissal === 'Stumped') {
      wk = bowlingXI.find(p => /wicket/i.test(p.primary_role || p.role))?.full_name || bowlingXI.find(p => /wicket/i.test(p.primary_role || p.role))?.name || fielder;
    }

    setReplacingBatterType(finalDismissedId === nonStriker?.id ? 'nonStriker' : 'striker');
    recordWicket(selectedDismissal, finalDismissedId, fielder, wk, runsCompleted);

    // Trigger push notification for wicket
    if (notificationsEnabled) {
      supabase.functions.invoke('send-push', {
        body: {
          title: 'WICKET!',
          body: `${outName} is out ${selectedDismissal}! ${teamAName} vs ${teamBName} (${runs}/${wickets + 1})`,
          url: `/matches`,
          tag: `match-${activeMatchId || 'jdca'}`,
          renotify: true
        }
      });
    }

    setDismissalOpen(false);
    setFielder('');
    setRunOutPlayerId(null);
    setRunsCompleted(0);
    setNewBatterOpen(true);
  };

  const submitRetire = () => {
    handleRetireBatter(retiringBatter === 'striker', retireType === 'out');
    setRetireModalOpen(false);
    setReplacingBatterType(retiringBatter);
    setNewBatterOpen(true);
  };

  const selectNewBatter = (player) => {
    if (player) {
      let isStrikerTarget = replacingBatterType === 'striker';
      if (!striker?.id && nonStriker?.id) {
        isStrikerTarget = true;
      } else if (!nonStriker?.id && striker?.id) {
        isStrikerTarget = false;
      }
      replaceBatter(isStrikerTarget, { ...player, runs: 0, balls: 0, fours: 0, sixes: 0, strikeRate: '0.0' });
    }
    setNewBatterOpen(false);
    setReplacingBatterType('striker'); // reset
  };

  const selectNextBowler = (player) => {
    if (!player) return;
    if (lastOverBowlerId && player.id === lastOverBowlerId) {
      setValidationError('The same bowler cannot bowl two consecutive overs.');
      return;
    }
    continueAfterOver?.(player);
    setOverOpen(false);
  };

  const selectNewWk = (player) => {
    if (!player) return;
    const targetArrayName = bowlingTeamId === matchSetup?.teamAId ? 'teamAXI' : 'teamBXI';
    setMatchSetup(prev => ({
      ...prev,
      [targetArrayName]: prev[targetArrayName].map(p => {
        if (p.id === player.id) return { ...p, role: 'Wicket Keeper' };
        if (p.role?.includes('Wicket Keeper')) return { ...p, role: 'Batter' };
        return p;
      })
    }));
    setChangeWkOpen(false);
  };

  const currentWk = bowlingXI.find(p => /wicket/i.test(p.role || ''));


  return (
    <div className="bg-cloud min-h-screen">
      <div className="max-w-md mx-auto relative bg-white border-x border-slate-200 min-h-screen pb-[100px] shadow-2xl">

        {syncError && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 m-4 rounded shadow-sm text-sm z-50">
            <div className="flex justify-between items-start mb-1">
              <strong className="font-bold">Sync Failed</strong>
              <button onClick={() => setSyncError(null)} className="text-red-500 hover:text-red-700">
                <X size={16} />
              </button>
            </div>
            <span className="block mb-3">{syncError.message}</span>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => {
                  const errorDump = `Sync Error: ${syncError.message}\nAction ID: ${syncError.actionId}\nPayload: ${JSON.stringify(syncError.action?.payload, null, 2)}\nError Details: ${JSON.stringify(syncError.action?.error, null, 2)}`;
                  navigator.clipboard.writeText(errorDump);
                  alert("Error details copied to clipboard!");
                }}
                className="bg-slate-800 text-white py-1.5 px-3 rounded hover:bg-slate-900 font-medium text-xs transition-colors cursor-pointer flex items-center gap-1"
              >
                <FileText size={12} /> Copy Error
              </button>
              <button
                onClick={async () => {
                  await syncService.autoHealAndResume();
                  setSyncError(null);
                }}
                className="bg-emerald-600 text-white py-1.5 px-4 rounded hover:bg-emerald-700 font-bold text-xs transition-colors flex items-center gap-1 shadow-sm cursor-pointer"
              >
                <span>⚡ Auto-Heal & Resume All</span>
              </button>
              <button
                onClick={() => {
                  syncService.retryFailedAction(syncError.actionId);
                  setSyncError(null);
                }}
                className="bg-red-600 text-white py-1.5 px-3 rounded hover:bg-red-700 font-medium text-xs transition-colors cursor-pointer"
              >
                Retry
              </button>
              <button
                onClick={() => {
                  if (window.confirm("Are you sure you want to delete this corrupt delivery from the offline queue? Next deliveries will resume syncing.")) {
                    syncService.deleteFailedAction(syncError.actionId);
                    setSyncError(null);
                  }
                }}
                className="bg-white border border-red-200 text-red-600 py-1.5 px-3 rounded hover:bg-red-50 font-medium text-xs transition-colors cursor-pointer"
              >
                Delete Corrupt Ball & Resume
              </button>
              <button
                onClick={async () => {
                  if (window.confirm("DANGER: This will delete ALL pending offline deliveries for ALL matches. Only do this if your queue is permanently corrupted!")) {
                    const { db } = await import('../../lib/db.js');
                    await db.sync_queue.clear();
                    syncService.updatePendingCount();
                    setSyncError(null);
                    alert("Queue cleared!");
                  }
                }}
                className="bg-white border border-red-200 text-red-600 py-1.5 px-4 rounded hover:bg-red-50 font-medium transition-colors ml-auto text-xs"
              >
                Purge All
              </button>
            </div>
          </div>
        )}

        {/* HEADER */}
        <div className="px-4 pt-[60px] pb-4 bg-slate-50 border-b border-slate-100">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-jade-50 text-jade-700 border border-jade-100 text-xs font-bold uppercase tracking-wider">
                <span className="w-1.5 h-1.5 rounded-full bg-jade animate-pulse" />
                LIVE SCORING
              </span>
              {/* Sync Indicator */}
              <div className="flex items-center gap-1 bg-white border border-slate-200 px-2 py-1 rounded-full shadow-sm">
                {syncState.status === 'ONLINE' ? (
                  <span className="w-2 h-2 rounded-full bg-jade" />
                ) : syncState.status === 'SYNCING' ? (
                  <RefreshCw size={10} className="text-cobalt animate-spin" />
                ) : (
                  <WifiOff size={10} className="text-coral" />
                )}
                {syncState.pendingCount > 0 && (
                  <span className="text-[10px] font-bold text-slate-500">{syncState.pendingCount}</span>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => setInterruptionModalOpen(true)} className="px-3 h-10 rounded-full bg-red-50 flex items-center justify-center text-red-600 font-bold text-xs gap-1 hover:bg-red-100 transition-colors"><Clock size={16} /> End/Interrupt</button>
              <button onClick={() => setShowHelp(true)} className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200 transition-colors"><CircleHelp size={18} /></button>
              {isPaused ? (
                <button
                  onClick={() => { haptics.medium(); resumeMatch(); }}
                  className="px-3.5 h-10 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white flex items-center justify-center font-bold text-xs gap-1.5 shadow-sm transition-all animate-pulse"
                  title="Resume scoring to continue"
                >
                  <Play size={15} fill="currentColor" /> Resume
                </button>
              ) : (
                <button
                  onClick={() => { haptics.light(); pauseMatch(); }}
                  className="px-3 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-700 font-bold text-xs gap-1 hover:bg-slate-200 transition-colors"
                  title="Pause scoring"
                >
                  <Pause size={16} /> Pause
                </button>
              )}
            </div>
          </div>

          <div className="text-xs font-bold tracking-widest uppercase text-slate-500 mb-1">{tournamentName}</div>
          <div className="text-[16px] font-black text-slate-900">{teamAName} <span className="text-slate-400">vs</span> {teamBName}</div>

          {isPaused && (
            <div className="mt-3 p-3.5 rounded-2xl bg-amber-50 border border-amber-200 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-xs">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-amber-500 text-white flex items-center justify-center shrink-0">
                  <Pause size={16} />
                </div>
                <div className="text-left">
                  <div className="text-xs font-black text-amber-900">Match Scoring is Paused</div>
                  <div className="text-[11px] font-medium text-amber-700">Scoring controls are on hold. Tap resume to continue.</div>
                </div>
              </div>
              <button
                onClick={() => { haptics.medium(); resumeMatch(); }}
                className="w-full sm:w-auto px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs shadow-xs transition-all flex items-center justify-center gap-1.5 shrink-0 active:scale-95 cursor-pointer"
              >
                <Play size={14} fill="currentColor" />
                <span>Resume to Continue</span>
              </button>
            </div>
          )}
        </div>

        {validationError && (
          <div className="mx-4 mt-4 bg-coral text-white p-3 rounded-[12px] flex items-center justify-between text-[12px] font-bold shadow-md">
            <div className="flex items-center gap-2"><AlertTriangle size={16} /> {validationError}</div>
            <button onClick={() => setValidationError(null)} className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30"><X size={12} /></button>
          </div>
        )}

        {/* SCORE AREA */}
        <div className="px-4 py-6 bg-white">
          <div className="text-center">
            <div className="text-[12px] font-bold uppercase tracking-wider text-slate-500 mb-2">
              {innings === 1 ? '1st Innings' : '2nd Innings'} • {currentBattingTeamName}
            </div>
            <div className="text-[80px] font-black leading-none tracking-tighter tabular-nums mb-2 text-slate-900 flex items-baseline justify-center">
              <motion.span
                key={runs}
                initial={{ opacity: 0, y: -20, scale: 0.8 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              >
                {runs}
              </motion.span>
              <span className="text-[40px] text-slate-300 mx-1">/</span>
              <motion.span
                key={`w-${wickets}`}
                initial={{ opacity: 0, y: -20, scale: 0.8 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                className="text-[40px] text-slate-400"
              >
                {wickets}
              </motion.span>
            </div>
            <div className="flex items-center justify-center gap-4 text-[14px] font-bold mt-4">
              <div className="bg-slate-50 border border-slate-200 px-4 py-1.5 rounded-full text-slate-500">
                Overs <span className="text-slate-900 ml-1">{formatOvers(balls)} / {currentTotalOvers}</span>
              </div>
              <div className="bg-slate-50 border border-slate-200 px-4 py-1.5 rounded-full text-slate-500">
                CRR <span className="text-slate-900 ml-1">{calculateCRR()}</span>
              </div>
            </div>

            {/* Sync Divergence Warning */}
            {syncState.pendingCount > 0 && (
              <div className="mt-4 bg-amber-50 border border-amber-200 px-4 py-3 rounded-xl inline-flex flex-col items-center justify-center text-amber-700 w-full max-w-sm mx-auto">
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center gap-2 text-[14px] font-bold">
                    {syncState.status === 'OFFLINE' ? (
                      <WifiOff size={16} />
                    ) : (
                      <RefreshCw size={16} className="animate-spin" />
                    )}
                    {syncState.status === 'OFFLINE' ? 'Offline' : 'Syncing'}
                  </div>
                  {syncState.status === 'SYNCING' && (
                    <button
                      onClick={() => syncService.forceSync()}
                      className="text-xs bg-amber-600 hover:bg-amber-500 text-white px-3 py-1 rounded-full font-bold shadow-sm transition-colors flex items-center gap-1 active:scale-95"
                    >
                      <RefreshCw size={10} /> Force Sync
                    </button>
                  )}
                </div>
                <div className="text-[12px] opacity-80 text-left leading-tight mt-2 w-full border-t border-amber-200/50 pt-2">
                  {syncState.pendingCount} pending {syncState.pendingCount === 1 ? 'delivery' : 'deliveries'} not saved to database. Local score may diverge.
                </div>
              </div>
            )}

            {syncState.blockedMatches?.has(activeMatchId) && (
              <div className="mt-4 bg-coral text-white border border-coral-200 px-4 py-3 rounded-xl inline-flex flex-col items-center justify-center w-full max-w-sm mx-auto shadow-md">
                <div className="flex items-center gap-2 text-[14px] font-bold">
                  <ShieldAlert size={16} /> Sync Blocked
                </div>
                <div className="text-[12px] opacity-90 text-center leading-tight mt-1">
                  A previous delivery failed to save and requires your attention. Scoring is paused to prevent chronological errors.
                </div>
              </div>
            )}

            {innings === 2 && target && (
              <div className="mt-4 bg-jade-50 border border-jade-100 px-4 py-2 rounded-xl inline-flex flex-col items-center justify-center text-jade-700">
                <div className="text-[12px] font-bold uppercase tracking-widest opacity-80 mb-0.5">Target: {target}</div>
                <div className="text-[15px] font-black">
                  Need {Math.max(0, target - runs)} runs from {Math.max(0, (currentTotalOvers * 6) - balls)} balls
                </div>
              </div>
            )}
          </div>
        </div>

        {/* RECENT BALLS */}
        <div className="px-4 mb-6">
          <div className="bg-slate-50 rounded-[12px] p-3 border border-slate-200 flex items-center justify-between">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-500 w-12 text-center">THIS OVER</div>
            <div className="flex-1 flex items-center gap-2 overflow-x-auto px-2 no-scrollbar min-h-[32px]">
              {lastBalls.map((b, i) => (
                <div key={i} className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-[12px] font-black border ${b.wicket ? 'bg-coral text-white border-coral' :
                    b.extra ? 'bg-mango text-white border-mango' :
                      b.runs >= 4 ? 'bg-cobalt text-white border-cobalt' :
                        'bg-white text-slate-700 border-slate-200'
                  }`}>
                  {b.label || b.runs || 0}
                </div>
              ))}
              {!lastBalls.length && <div className="text-[12px] font-medium text-slate-400 italic">No balls recorded yet</div>}
            </div>
            <div className="text-[12px] font-black text-slate-700 w-8 text-center">{currentOverBalls.length}/6</div>
          </div>
        </div>

        {/* PLAYERS ON FIELD */}
        <div className="px-4 mb-8 pb-80">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Batters</span>
            <button
              onClick={() => toggleStriker?.()}
              className="bg-slate-200 text-slate-700 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest flex items-center gap-1 active:bg-slate-300"
            >
              <RefreshCw size={10} /> Swap Ends
            </button>
          </div>
          <div className="grid grid-cols-2 gap-3 mb-3">
            <button
              onClick={() => {
                if (window.confirm("Do you want to manually change the Striker? (This will not record a wicket/retirement)")) {
                  setReplacingBatterType('striker');
                  setNewBatterOpen(true);
                }
              }}
              className={`bg-white rounded-[12px] p-4 text-left border shadow-sm relative overflow-hidden active:bg-slate-50 transition-colors ${!striker?.id ? 'border-amber-400 ring-2 ring-amber-100 bg-amber-50/20' : 'border-slate-200'}`}
            >
              <div className="absolute top-0 right-0 w-2 h-full bg-jade" />
              <div className="text-xs font-bold text-jade uppercase tracking-wider mb-1 flex items-center gap-1">Striker <span>*</span></div>
              <div className="text-[15px] font-black text-slate-900 truncate mb-2">{striker?.name || 'Select Striker ➕'}</div>
              <div className="text-[18px] font-black tabular-nums leading-none text-slate-900">{striker?.runs ?? 0} <span className="text-[12px] text-slate-500">({striker?.balls ?? 0})</span></div>
            </button>

            <button
              onClick={() => {
                if (window.confirm("Do you want to manually change the Non-Striker? (This will not record a wicket/retirement)")) {
                  setReplacingBatterType('nonStriker');
                  setNewBatterOpen(true);
                }
              }}
              className={`rounded-[12px] p-4 text-left border active:bg-slate-100 transition-colors ${!nonStriker?.id ? 'border-amber-400 ring-2 ring-amber-100 bg-amber-50/20' : 'bg-slate-50 border-slate-200'}`}
            >
              <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Non-Striker</div>
              <div className="text-[15px] font-bold text-slate-700 truncate mb-2">{nonStriker?.name || 'Select Non-Striker ➕'}</div>
              <div className="text-[18px] font-black tabular-nums leading-none text-slate-700">{nonStriker?.runs ?? 0} <span className="text-[12px] text-slate-500">({nonStriker?.balls ?? 0})</span></div>
            </button>
          </div>

          <div
            onClick={() => {
              if (!currentBowler?.id || window.confirm("Do you want to manually change the Bowler mid-over?")) {
                setOverOpen(true);
              }
            }}
            className={`bg-white rounded-[12px] p-4 border flex items-center justify-between mb-3 shadow-sm cursor-pointer hover:bg-slate-50 ${!currentBowler?.id ? 'border-amber-400 ring-2 ring-amber-100' : 'border-slate-200'}`}
          >
            <div>
              <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1 flex items-center gap-1"><RefreshCw size={10} /> Bowler (Tap to Change)</div>
              <div className="text-[15px] font-black text-slate-900">{currentBowler?.name || 'Select Bowler ➕'}</div>
            </div>
            <div className="text-right">
              <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">O-M-R-W</div>
              <div className="text-[16px] font-black tabular-nums text-slate-900">{currentBowler ? `${currentBowler.overs || 0}-${currentBowler.maidens || 0}-${currentBowler.runs || 0}-${currentBowler.wickets || 0}` : '0-0-0-0'}</div>
            </div>
          </div>

          <div className="flex gap-2">
            <button onClick={() => setOverOpen(true)} className="flex-1 bg-white rounded-[10px] py-2.5 text-xs font-bold uppercase tracking-wider border border-slate-200 text-slate-700 flex items-center justify-center gap-1.5 hover:bg-slate-50 active:bg-slate-100 transition-colors">
              <RefreshCw size={14} /> Change Bowler
            </button>
            <button onClick={() => setChangeWkOpen(true)} className="flex-1 bg-white rounded-[10px] py-2.5 text-xs font-bold uppercase tracking-wider border border-slate-200 text-slate-700 flex items-center justify-center gap-1.5 hover:bg-slate-50 active:bg-slate-100 transition-colors">
              <Users size={14} /> Edit WK {currentWk ? `(${(currentWk?.full_name || currentWk?.name || '').split(' ')[0]})` : ''}
            </button>
          </div>
        </div>

        {/* SCORING PAD */}
        <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto z-40 bg-white dark:bg-[#262B30] border-t border-x border-slate-200 dark:border-slate-700/80 p-3 sm:p-5 shadow-[0_-10px_40px_rgba(0,0,0,0.25)] pb-safe pt-4">
          {(!striker?.id || !nonStriker?.id || !currentBowler?.id) && (
            <div className="mb-3 p-3 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-700/50 rounded-xl flex items-center justify-between shadow-xs">
              <div className="flex items-center gap-2">
                <AlertTriangle className="text-amber-600 dark:text-amber-400 flex-shrink-0" size={16} />
                <span className="text-xs font-bold text-amber-900 dark:text-amber-200">
                  {!striker?.id ? 'Select active striker' : !nonStriker?.id ? 'Select non-striker' : 'Select next bowler'}
                </span>
              </div>
              <button
                onClick={() => {
                  if (!striker?.id) {
                    setReplacingBatterType('striker');
                    setNewBatterOpen(true);
                  } else if (!nonStriker?.id) {
                    setReplacingBatterType('nonStriker');
                    setNewBatterOpen(true);
                  } else if (!currentBowler?.id) {
                    setOverOpen(true);
                  }
                }}
                className="px-3 py-1 bg-[#F97316] hover:bg-[#EA580C] text-white rounded-lg text-xs font-bold transition-colors cursor-pointer shadow-xs"
              >
                {!striker?.id ? 'Pick Striker' : !nonStriker?.id ? 'Pick Non-Striker' : 'Pick Bowler'}
              </button>
            </div>
          )}

          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-[16px] font-black text-slate-900 dark:text-[#F3F4F6]">Record Ball</h3>
              <div className="text-[12px] font-medium text-slate-500 dark:text-[#64748B]">Tap the result of the delivery</div>
            </div>
            <motion.button whileTap={{ scale: 0.92 }} onClick={() => { haptics.medium(); undoLastAction(); }} disabled={!deliveryLog.length} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white dark:bg-[#1E2226] border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 text-xs font-bold uppercase tracking-wider shadow-sm disabled:opacity-50 hover:bg-slate-50 dark:hover:bg-[#282d33] transition-colors">
              <RotateCcw size={14} /> Undo
            </motion.button>
          </div>

          <div className="grid grid-cols-3 gap-2.5 mb-2.5">
            {QUICK_RUNS.map(value => (
              <motion.button
                key={value}
                whileTap={{ scale: 0.96 }}
                onClick={() => {
                  if (value === 0) haptics.light();
                  else if (value === 4 || value === 6) haptics.success();
                  else haptics.medium();
                  doRun(value);
                }}
                className={`h-16 rounded-[12px] flex items-center justify-center text-[24px] font-black shadow-sm transition-colors border ${value === 0 ? 'bg-white dark:bg-[#1E2226] text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-[#282d33]' :
                    value >= 4 ? 'bg-[#F97316] text-white border-[#EA580C] shadow-md shadow-orange-500/20 hover:brightness-105 active:bg-[#EA580C]' :
                      'bg-white dark:bg-[#1E2226] text-slate-900 dark:text-[#F3F4F6] border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-[#282d33]'
                  }`}
              >
                {value}
              </motion.button>
            ))}
          </div>

          <div className="grid grid-cols-4 gap-2 mb-4">
            <motion.button whileTap={{ scale: 0.96 }} onClick={() => { haptics.light(); recordExtra('wide', 0); }} className="h-12 rounded-[10px] bg-white dark:bg-[#1E2226] border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-[12px] font-black uppercase tracking-wider hover:bg-slate-50 dark:hover:bg-[#282d33] shadow-sm transition-colors">WD</motion.button>
            <motion.button whileTap={{ scale: 0.96 }} onClick={() => { haptics.light(); recordExtra('no_ball', 0); }} className="h-12 rounded-[10px] bg-white dark:bg-[#1E2226] border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-[12px] font-black uppercase tracking-wider hover:bg-slate-50 dark:hover:bg-[#282d33] shadow-sm transition-colors">NB</motion.button>
            <motion.button whileTap={{ scale: 0.96 }} onClick={() => { haptics.light(); recordExtra('bye', 1); }} className="h-12 rounded-[10px] bg-white dark:bg-[#1E2226] border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-[12px] font-black uppercase tracking-wider hover:bg-slate-50 dark:hover:bg-[#282d33] shadow-sm transition-colors">B</motion.button>
            <motion.button whileTap={{ scale: 0.96 }} onClick={() => { haptics.light(); recordExtra('leg_bye', 1); }} className="h-12 rounded-[10px] bg-white dark:bg-[#1E2226] border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-[12px] font-black uppercase tracking-wider hover:bg-slate-50 dark:hover:bg-[#282d33] shadow-sm transition-colors">LB</motion.button>
          </div>

          <div className="grid grid-cols-2 gap-2.5 mb-2.5">
            <motion.button whileTap={{ scale: 0.96 }} onClick={() => { haptics.heavy(); setDismissalOpen(true); }} className="h-14 rounded-[12px] bg-[#EF4444] text-white flex items-center justify-center gap-1.5 text-[13px] font-black shadow-md shadow-red-500/25 border border-[#DC2626] active:bg-[#DC2626] transition-colors">
              <ShieldAlert size={16} /> WICKET
            </motion.button>
            <motion.button whileTap={{ scale: 0.96 }} onClick={() => { haptics.medium(); setRetireModalOpen(true); }} className="h-14 rounded-[12px] bg-white dark:bg-[#1E2226] border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 flex items-center justify-center gap-1.5 text-[13px] font-black shadow-sm active:bg-slate-50 dark:active:bg-[#282d33] transition-colors">
              RETIRE
            </motion.button>
          </div>
          <div className="grid grid-cols-2 gap-2.5">
            <motion.button whileTap={{ scale: 0.96 }} onClick={() => { haptics.light(); setExtrasOpen(true); }} className="h-14 rounded-[12px] bg-white dark:bg-[#1E2226] border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 flex items-center justify-center gap-1.5 text-[12px] font-bold shadow-sm active:bg-slate-50 dark:active:bg-[#282d33] transition-colors">
              <MoreHorizontal size={16} /> EXTRAS
            </motion.button>
            <motion.button whileTap={{ scale: 0.96 }} onClick={() => { haptics.light(); setOverthrowOpen(true); }} className="h-14 rounded-[12px] bg-white dark:bg-[#1E2226] border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 flex items-center justify-center gap-1.5 text-[12px] font-bold shadow-sm active:bg-slate-50 dark:active:bg-[#282d33] transition-colors">
              <CornerUpRight size={16} /> OVERTHROW
            </motion.button>
          </div>
        </div>

        {/* MODALS */}
        {dismissalOpen && (
          <Modal title="Record Wicket" danger onClose={() => setDismissalOpen(false)}>
            <div className="bg-white border border-slate-100 rounded-[12px] p-3 mb-4 text-center">
              <span className="text-[14px] font-bold text-slate-900">{striker?.name}</span> <span className="text-[12px] text-slate-500">is on strike</span>
            </div>
            <div className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">How out?</div>
            <div className="grid grid-cols-2 gap-2 mb-4">
              {DISMISSALS.map(type => {
                const blocked = isFreeHit && !FREE_HIT_ALLOWED_DISMISSALS.includes(type);
                const selected = selectedDismissal === type;
                return (
                  <button
                    key={type}
                    disabled={blocked}
                    className={`py-3 rounded-[10px] text-[13px] font-bold border transition-colors ${selected ? 'bg-slate-900 text-white border-slate-900' :
                        blocked ? 'opacity-40 bg-slate-50 border-slate-100 cursor-not-allowed' :
                          'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                      }`}
                    onClick={() => setSelectedDismissal(type)}
                  >
                    {type}
                  </button>
                );
              })}
            </div>

            {selectedDismissal === 'Caught' && (
              <div className="mb-4">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2 block">Caught by</label>
                <div className="grid grid-cols-2 gap-2 mb-4">
                  {bowlingXI.filter(p => (p.full_name || p.name) !== striker?.name && (p.full_name || p.name) !== nonStriker?.name).map(p => (
                    <button
                      key={p.id}
                      className={`py-2 px-2 rounded-[8px] text-[12px] font-bold border transition-colors ${fielder === (p.full_name || p.name) ? 'bg-cobalt text-white border-cobalt' : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'}`}
                      onClick={() => setFielder(p.full_name || p.name)}
                    >
                      {p.full_name || p.name} {/wicket/i.test(p.primary_role || p.role) ? '(WK)' : ''}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {selectedDismissal === 'Run Out' && (
              <div className="mb-4">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2 block">Who was run out?</label>
                <div className="grid grid-cols-2 gap-2 mb-4">
                  <button
                    onClick={() => setRunOutPlayerId(striker?.id)}
                    className={`py-2 px-2 rounded-[8px] text-[12px] font-bold border transition-colors ${runOutPlayerId === striker?.id ? 'bg-coral text-white border-coral' : 'bg-white text-slate-700 border-slate-200'}`}
                  >
                    {striker?.name} (Striker)
                  </button>
                  <button
                    onClick={() => setRunOutPlayerId(nonStriker?.id)}
                    className={`py-2 px-2 rounded-[8px] text-[12px] font-bold border transition-colors ${runOutPlayerId === nonStriker?.id ? 'bg-coral text-white border-coral' : 'bg-white text-slate-700 border-slate-200'}`}
                  >
                    {nonStriker?.name} (Non-Striker)
                  </button>
                </div>

                <label className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2 block">Completed Runs before Wicket</label>
                <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
                  {[0, 1, 2, 3].map(r => (
                    <button
                      key={r}
                      onClick={() => setRunsCompleted(r)}
                      className={`min-w-[44px] h-[44px] rounded-full font-bold flex items-center justify-center ${runsCompleted === r ? 'bg-slate-900 text-white' : 'bg-white border border-slate-200 text-slate-700'}`}
                    >
                      {r}
                    </button>
                  ))}
                </div>

                <label className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2 block">Fielder Involved</label>
                <div className="grid grid-cols-2 gap-2 mb-2">
                  {bowlingXI.filter(p => (p.full_name || p.name) !== striker?.name && (p.full_name || p.name) !== nonStriker?.name).map(p => (
                    <button
                      key={p.id}
                      className={`py-2 px-2 rounded-[8px] text-[12px] font-bold border transition-colors ${fielder === (p.full_name || p.name) ? 'bg-cobalt text-white border-cobalt' : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'}`}
                      onClick={() => setFielder(p.full_name || p.name)}
                    >
                      {p.full_name || p.name}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="flex gap-2 mt-6">
              <button className="flex-1 py-3 rounded-[10px] font-bold bg-white dark:bg-[#1E2226] border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300" onClick={() => setDismissalOpen(false)}>Cancel</button>
              <motion.button
                whileTap={{ scale: 0.96 }}
                className="flex-1 py-3 rounded-[10px] font-bold bg-[#EF4444] text-white disabled:opacity-50 shadow-md shadow-red-500/25"
                onClick={() => { haptics.heavy(); submitWicket(); }}
                disabled={((selectedDismissal === 'Caught' || selectedDismissal === 'Run Out') && !fielder) || (selectedDismissal === 'Run Out' && !runOutPlayerId)}
              >
                Confirm Wicket
              </motion.button>
            </div>
          </Modal>
        )}

        {retireModalOpen && (
          <Modal title="Retire Batter" onClose={() => setRetireModalOpen(false)}>
            <div className="mb-4">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2 block">Who is retiring?</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setRetiringBatter('striker')}
                  className={`py-3 rounded-[10px] text-[13px] font-bold border transition-colors ${retiringBatter === 'striker' ? 'bg-[#262B30] text-white border-slate-700' : 'bg-white dark:bg-[#1E2226] text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-50'}`}
                >
                  {striker?.name} (Striker)
                </button>
                <button
                  onClick={() => setRetiringBatter('nonStriker')}
                  className={`py-3 rounded-[10px] text-[13px] font-bold border transition-colors ${retiringBatter === 'nonStriker' ? 'bg-[#262B30] text-white border-slate-700' : 'bg-white dark:bg-[#1E2226] text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-50'}`}
                >
                  {nonStriker?.name} (Non-Striker)
                </button>
              </div>
            </div>

            <div className="mb-6">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2 block">Reason</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setRetireType('hurt')}
                  className={`py-3 px-2 rounded-[10px] text-[13px] font-bold border transition-colors flex flex-col items-center justify-center gap-1 ${retireType === 'hurt' ? 'bg-[#F97316] text-white border-[#EA580C]' : 'bg-white dark:bg-[#1E2226] text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-50'}`}
                >
                  <span>Retired Hurt</span><span className="text-xs font-normal opacity-90">(No Wicket)</span>
                </button>
                <button
                  onClick={() => setRetireType('out')}
                  className={`py-3 px-2 rounded-[10px] text-[13px] font-bold border transition-colors flex flex-col items-center justify-center gap-1 ${retireType === 'out' ? 'bg-[#EF4444] text-white border-[#DC2626]' : 'bg-white dark:bg-[#1E2226] text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-50'}`}
                >
                  <span>Retired Out</span><span className="text-xs font-normal opacity-90">(Counts as Wicket)</span>
                </button>
              </div>
            </div>

            <div className="flex gap-2">
              <button className="flex-1 py-3 rounded-[10px] font-bold bg-white dark:bg-[#1E2226] border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300" onClick={() => setRetireModalOpen(false)}>Cancel</button>
              <button
                className="flex-1 py-3 rounded-[10px] font-black bg-[#A3E635] text-[#0A0A0A] hover:bg-[#90d325] shadow-md shadow-lime-500/20"
                onClick={submitRetire}
              >
                Confirm Retire
              </button>
            </div>
          </Modal>
        )}

        {newBatterOpen && wickets < 10 && (
          <Modal title="New Batter" onClose={() => setNewBatterOpen(false)}>
            <div className="flex items-center justify-between mb-3">
              <p className="text-[13px] text-slate-600">Select next batter for <span className="font-bold text-slate-900">{currentBattingTeamName}</span>.</p>
              <span className="text-[10px] font-black uppercase tracking-wider bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full">
                {currentBattingTeamName}
              </span>
            </div>
            <div className="flex flex-col gap-2 max-h-60 overflow-y-auto pr-1">
              {batters.length === 0 && (
                <div className="py-6 text-center text-sm text-slate-400">No more eligible batters available in Playing XI</div>
              )}
              {batters.map(player => (
                <button
                  key={player.id}
                  onClick={() => selectNewBatter(player)}
                  className="flex items-center justify-between p-3 rounded-[10px] bg-white border border-slate-200 hover:bg-slate-50 active:bg-slate-100 transition-colors"
                >
                  <div>
                    <div className="text-[14px] font-bold text-slate-900 text-left">{player.full_name || player.name}</div>
                    <div className="text-xs text-slate-500 text-left">{player.primary_role || player.role || 'Batter'}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold text-slate-400 bg-slate-50 px-2 py-0.5 rounded">{currentBattingTeamName}</span>
                    <ChevronRight size={16} className="text-slate-300" />
                  </div>
                </button>
              ))}
            </div>
          </Modal>
        )}

        {overOpen && !newBatterOpen && (
          <Modal title={isOverComplete ? "Over Complete" : "Change Bowler"} onClose={() => setOverOpen(false)}>
            {isOverComplete && (
              <div className="bg-cobalt-50 p-4 rounded-[12px] mb-4 text-center border border-cobalt-100">
                <div className="text-[24px] font-black text-cobalt">{runs}/{wickets}</div>
                <div className="text-[12px] font-bold text-slate-600">after {formatOvers(balls)} overs</div>
              </div>
            )}
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Select new bowler</span>
              <span className="text-[10px] font-black uppercase tracking-wider bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full">
                {currentBowlingTeamName}
              </span>
            </div>
            <div className="flex gap-3 overflow-x-auto pb-4 no-scrollbar">
              {bowlingXI.filter(p => p.id !== lastOverBowlerId).map(player => (
                <button
                  key={player.id}
                  onClick={() => selectNextBowler(player)}
                  className="flex items-center justify-between p-3 rounded-[10px] bg-white border border-slate-200 hover:bg-slate-50 active:bg-slate-100 transition-colors shrink-0 min-w-[160px]"
                >
                  <div>
                    <div className="text-[14px] font-bold text-slate-900 text-left">{player.full_name || player.name}</div>
                    <div className="text-xs text-slate-500 text-left">{player.primary_role || player.role || 'Bowler'}</div>
                  </div>
                  <ChevronRight size={16} className="text-slate-300" />
                </button>
              ))}
            </div>
          </Modal>
        )}

        {changeWkOpen && (
          <Modal title="Change Wicket Keeper" onClose={() => setChangeWkOpen(false)}>
            <div className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Select new Wicket Keeper</div>
            <div className="flex flex-col gap-2 max-h-60 overflow-y-auto pr-1">
              {bowlingXI.map(player => {
                const isWk = /wicket/i.test(player.role || '');
                return (
                  <button
                    key={player.id}
                    onClick={() => selectNewWk(player)}
                    className={`flex items-center justify-between p-3 rounded-[10px] border transition-colors ${isWk ? 'bg-mango-50 border-mango text-slate-900' : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-900'}`}
                  >
                    <div className="text-left">
                      <div className="text-[14px] font-bold">{player.full_name || player.name}</div>
                      <div className={`text-xs ${isWk ? 'text-mango-700 font-semibold' : 'text-slate-500'}`}>{player.primary_role || player.role}</div>
                    </div>
                    {isWk && <span className="text-xs font-bold uppercase tracking-widest bg-mango text-white px-2 py-1 rounded">Current WK</span>}
                  </button>
                );
              })}
            </div>
          </Modal>
        )}

        {/* EXTRAS MODAL */}
        {extrasOpen && (
          <Modal title="Record Extras" onClose={() => setExtrasOpen(false)}>
            <div className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Select Extra Type</div>
            <div className="grid grid-cols-3 gap-2 mb-4">
              {[
                { id: 'wide', label: 'Wide (WD)' },
                { id: 'no_ball', label: 'No Ball (NB)' },
                { id: 'bye', label: 'Bye (B)' },
                { id: 'leg_bye', label: 'Leg Bye (LB)' },
                { id: 'penalty', label: 'Penalty (5)' },
              ].map(item => (
                <button
                  key={item.id}
                  onClick={() => {
                    haptics.light();
                    setExtraCategory(item.id);
                    if (item.id === 'wide' || item.id === 'no_ball') setExtraRuns(0);
                    else if (item.id === 'bye' || item.id === 'leg_bye') setExtraRuns(1);
                    else if (item.id === 'penalty') setExtraRuns(5);
                  }}
                  className={`py-3 px-2 rounded-[10px] text-xs font-black border transition-all ${extraCategory === item.id
                      ? 'bg-slate-900 text-white border-slate-900 shadow-sm scale-[1.02]'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                    }`}
                >
                  {item.label}
                </button>
              ))}
            </div>

            <div className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
              {extraCategory === 'wide' ? 'Runs in Addition to 1 Wide (+runs)' :
                extraCategory === 'no_ball' ? 'Runs Scored Off No-Ball (+runs)' :
                  extraCategory === 'penalty' ? 'Penalty Runs Awarded' :
                    'Runs Scored (Byes/Leg Byes)'}
            </div>

            <div className="flex gap-2 mb-4">
              {(extraCategory === 'wide' ? [0, 1, 2, 3, 4] :
                extraCategory === 'no_ball' ? [0, 1, 2, 3, 4, 6] :
                  extraCategory === 'penalty' ? [5] :
                    [1, 2, 3, 4]
              ).map(num => (
                <button
                  key={num}
                  onClick={() => {
                    haptics.light();
                    setExtraRuns(num);
                    if (num !== 4 && num !== 6) setIsExtraBoundary(false);
                  }}
                  className={`flex-1 py-3 rounded-[10px] text-[14px] font-black border transition-all ${extraRuns === num
                      ? 'bg-jade text-white border-jade shadow-sm'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                    }`}
                >
                  {extraCategory === 'wide' || extraCategory === 'no_ball' ? `+${num}` : num}
                </button>
              ))}
            </div>

            {extraCategory === 'penalty' && (
              <div className="mb-4">
                <div className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Award Penalty To</div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setRecipientTeamId(battingTeamId)}
                    className={`flex-1 py-3 rounded-[10px] text-[14px] font-black border transition-all ${recipientTeamId === battingTeamId ? 'bg-jade text-white border-jade shadow-sm' : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'}`}
                  >Batting Side</button>
                  <button
                    onClick={() => setRecipientTeamId(bowlingTeamId)}
                    className={`flex-1 py-3 rounded-[10px] text-[14px] font-black border transition-all ${recipientTeamId === bowlingTeamId ? 'bg-jade text-white border-jade shadow-sm' : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'}`}
                  >Fielding Side</button>
                </div>
              </div>
            )}

            <div className="bg-slate-50 border border-slate-200 rounded-[12px] p-3 mb-5 text-center">
              <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-0.5">Recording Summary</div>
              <div className="text-sm font-extrabold text-slate-900">
                {extraCategory === 'wide' && `${1 + extraRuns} Wide Run${(1 + extraRuns) > 1 ? 's' : ''} (Re-bowled)`}
                {extraCategory === 'no_ball' && `${1 + extraRuns} No-Ball Run${(1 + extraRuns) > 1 ? 's' : ''} (Free Hit Next)`}
                {extraCategory === 'bye' && `${extraRuns} Bye Run${extraRuns > 1 ? 's' : ''} (Legal ball counted)`}
                {extraCategory === 'leg_bye' && `${extraRuns} Leg Bye Run${extraRuns > 1 ? 's' : ''} (Legal ball counted)`}
                {extraCategory === 'penalty' && `${extraRuns} Penalty Runs awarded to ${recipientTeamId === battingTeamId ? 'Batting' : (recipientTeamId === bowlingTeamId ? 'Fielding' : 'Selected')} Side (Standalone event)`}
                {isExtraBoundary && extraRuns >= 4 && <div className="text-emerald-600 mt-1">Boundary Allowance (No physical runs)</div>}
              </div>
            </div>

            {(extraRuns === 4 || extraRuns === 6) && (
              <div className="flex items-center gap-3 mb-5 px-1">
                <input
                  type="checkbox"
                  id="extraBoundary"
                  checked={isExtraBoundary}
                  onChange={(e) => setIsExtraBoundary(e.target.checked)}
                  className="w-5 h-5 rounded text-jade focus:ring-jade border-slate-300"
                />
                <label htmlFor="extraBoundary" className="text-sm font-bold text-slate-700">
                  Mark as Boundary (No physical crossings)
                </label>
              </div>
            )}

            <div className="flex gap-2">
              <button
                className="flex-1 py-3 rounded-[10px] font-bold bg-white dark:bg-[#1E2226] border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50"
                onClick={() => setExtrasOpen(false)}
              >
                Cancel
              </button>
              <button
                className="flex-1 py-3 rounded-[10px] font-black bg-[#A3E635] text-[#0A0A0A] shadow-md shadow-lime-500/20 hover:bg-[#90d325] transition-colors cursor-pointer"
                onClick={() => {
                  haptics.medium();
                  if (extraCategory === 'penalty') {
                    if (!recipientTeamId) {
                      alert('Please select a recipient team for the penalty runs.');
                      return;
                    }
                    recordPenaltyEvent(recipientTeamId, extraRuns, 'UMPIRE_AWARD');
                  } else {
                    recordExtra(extraCategory, extraRuns, isExtraBoundary && extraRuns >= 4);
                  }
                  setExtrasOpen(false);
                }}
              >
                Record Extra
              </button>
            </div>
          </Modal>
        )}

        {overthrowOpen && (
          <Modal title="Record Overthrow" onClose={() => setOverthrowOpen(false)}>
            <div className="bg-slate-50 border border-slate-200 rounded-[12px] p-3 mb-5 text-center">
              <div className="text-[12px] font-bold text-slate-900 mb-1">
                Completed before throw: {runsCompletedBeforeThrow} | Overthrow runs: {overthrowIsBoundary ? '4 (Boundary)' : overthrowRuns}
              </div>
              <div className="text-[14px] font-black text-jade">
                Total Runs: {runsCompletedBeforeThrow + (overthrowIsBoundary ? 4 : overthrowRuns)}
              </div>
            </div>

            <div className="mb-4">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2 block">Runs completed BEFORE the throw</label>
              <div className="flex gap-2">
                {[0, 1, 2, 3, 4].map(num => (
                  <button
                    key={num}
                    onClick={() => { haptics.light(); setRunsCompletedBeforeThrow(num); }}
                    className={`flex-1 py-3 rounded-[10px] text-[14px] font-black border transition-all ${runsCompletedBeforeThrow === num
                        ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                      }`}
                  >
                    {num}
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-4">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2 block">Extra runs from the overthrow</label>
              <div className="flex gap-2">
                {[1, 2, 3, 4].map(num => (
                  <button
                    key={num}
                    onClick={() => {
                      haptics.light();
                      setOverthrowRuns(num);
                      if (num !== 4) setOverthrowIsBoundary(false);
                    }}
                    className={`flex-1 py-3 rounded-[10px] text-[14px] font-black border transition-all ${overthrowRuns === num
                        ? 'bg-jade text-white border-jade shadow-sm'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                      }`}
                  >
                    +{num}
                  </button>
                ))}
              </div>
            </div>

            {overthrowRuns === 4 && (
              <div className="flex items-center gap-3 mb-5 px-1">
                <input
                  type="checkbox"
                  id="overthrowBoundary"
                  checked={overthrowIsBoundary}
                  onChange={(e) => setOverthrowIsBoundary(e.target.checked)}
                  className="w-5 h-5 rounded text-jade focus:ring-jade border-slate-300"
                />
                <label htmlFor="overthrowBoundary" className="text-sm font-bold text-slate-700">
                  Ball reached boundary (No physical crossings)
                </label>
              </div>
            )}

            <div className="flex gap-2">
              <button
                className="flex-1 py-3 rounded-[10px] font-bold bg-white border border-slate-200 text-slate-700 hover:bg-slate-50"
                onClick={() => setOverthrowOpen(false)}
              >
                Cancel
              </button>
              <button
                className="flex-1 py-3 rounded-[10px] font-bold bg-jade text-white shadow-sm hover:bg-emerald-600 transition-colors"
                onClick={() => {
                  haptics.medium();
                  recordRuns(runsCompletedBeforeThrow, undefined, overthrowRuns, overthrowIsBoundary);
                  setOverthrowOpen(false);
                }}
              >
                Record Overthrow
              </button>
            </div>
          </Modal>
        )}

        {matchStatus === 'INNINGS_BREAK' && (innings === 1 || innings === 3) && (
          <div className="fixed inset-0 z-[100] bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white w-full max-w-sm rounded-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
              <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
                <h3 className="font-black text-slate-900">Innings Break {innings === 3 && "(Super Over)"}</h3>
              </div>
              <div className="p-6 text-center">
                <div className="text-[40px] font-black text-slate-900 leading-none mb-2">{runs}/{wickets}</div>
                <div className="text-[14px] font-bold text-slate-500 mb-6">Target for {battingTeamId === matchSetup?.teamAId ? teamBName : teamAName}: {runs + 1}</div>
                <button
                  onClick={() => innings === 3 ? startSuperOverSecondInnings(runs + 1) : startSecondInnings(runs + 1)}
                  className="w-full py-4 rounded-xl font-bold bg-jade text-white shadow-lg active:scale-95 transition-transform"
                >
                  Start 2nd Innings
                </button>
              </div>
            </div>
          </div>
        )}

        {(matchStatus === 'MATCH_FINISHED' || matchStatus === 'COMPLETED' || matchStatus === 'ABANDONED' || matchStatus === 'CANCELLED') && (
          <div className="fixed inset-0 z-[100] bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white w-full max-w-sm rounded-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
              <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
                <h3 className="font-black text-slate-900">
                  {matchStatus === 'ABANDONED' ? 'Match Abandoned' : matchStatus === 'CANCELLED' ? 'Match Cancelled' : 'Match Completed'}
                </h3>
              </div>
              <div className="p-6 text-center">
                <div className="text-[32px] font-black text-slate-900 leading-none mb-2">
                  {matchStatus === 'ABANDONED' ? 'Match Ended Early' :
                    matchStatus === 'CANCELLED' ? 'Match Cancelled' :
                      runs >= target ? `${battingTeamId === matchSetup?.teamAId ? teamAName : teamBName} Won!` :
                        runs === target - 1 ? 'Match Tied!' :
                          `${battingTeamId === matchSetup?.teamAId ? teamBName : teamAName} Won!`}
                </div>
                <div className="text-[14px] font-bold text-slate-500 mb-6">
                  {matchStatus === 'ABANDONED' || matchStatus === 'CANCELLED' ? '' :
                    runs >= target ? `Chased down ${target} runs in ${Math.floor(balls / 6)}.${balls % 6} overs` :
                      runs === target - 1 ? `Scores are level at ${Math.floor(balls / 6)}.${balls % 6} overs` :
                        `Defended the total in ${Math.floor(balls / 6)}.${balls % 6} overs`}
                </div>
                <button
                  onClick={() => {
                    haptics.medium();
                    navigateTo('match-result');
                  }}
                  className="w-full py-4 rounded-xl font-bold bg-[#2457D6] hover:bg-[#1d47b0] text-white shadow-lg active:scale-95 transition-all mb-3 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Trophy size={18} />
                  <span>Review Match & Finalize</span>
                </button>
                <div className="text-[11px] text-slate-500 mb-3 font-medium">
                  Review Top Performers, award Player of the Match, and permanently lock official records.
                </div>
                {runs === target - 1 && (
                  <button
                    onClick={() => {
                      startSuperOver();
                    }}
                    className="w-full py-4 rounded-xl font-bold bg-slate-800 text-white shadow-lg active:scale-95 transition-transform"
                  >
                    Play Super Over
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {interruptionModalOpen && (
          <MatchInterruptionModal
            isOpen={interruptionModalOpen}
            onClose={() => setInterruptionModalOpen(false)}
            activeMatch={activeMatch}
            tournament={matchTournament}
            innings={innings}
            currentRuns={runs}
            currentWickets={wickets}
            currentBalls={balls}
            target={target}
            matchSetup={matchSetup}
            totalMatchOvers={totalMatchOvers}
            onApplyRevisedOvers={async (revisedOvers, revisedTarget) => {
              try {
                await applyRevisedOvers(revisedOvers, revisedTarget);
                alert(revisedTarget
                  ? `Overs revised to ${revisedOvers}, target revised to ${revisedTarget}`
                  : `Match overs revised to ${revisedOvers}`);
              } catch (err) {
                alert("Failed to revise overs: " + err.message);
              }
            }}
            onEndMatchEarly={async (resultInfo) => {
              try {
                await endMatchEarly(resultInfo);
              } catch (err) {
                alert("Failed to end match: " + err.message);
              }
            }}
          />
        )}
      </div>
    </div>
  );
}

