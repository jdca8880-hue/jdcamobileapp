import { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import { supabase } from '../lib/supabase';
import { api } from '../lib/api';
import { syncService } from '../services/SyncService';
import { queueOfflineAction } from '../lib/db';
import {
  processDelivery,
  processPenaltyEvent,
  formatOvers,
  calculateCRR,
  calculateProjectedScore,
  canBowlerBowlNextOver,
  MATCH_STATES,
} from '../engine/cricketStateMachine';
import { INITIAL_SCORECARD, FIELD_DIRECTIONS } from '../data/constants';
import { normalizeDelivery } from '../engine/deliveryContract.js';

export const INITIAL_MATCH_SETUP = {
  teamA: 'Team A',
  teamAId: null,
  teamB: 'Team B',
  teamBId: null,
  tossWinner: '',
  electedTo: '',
  totalOvers: 20,
  oversPerBowler: 4,
  wideRuns: 1,
  noBallRuns: 1,
  assignedScorerId: null,
  teamAXI: [],
  teamBXI: []
};

export function useMatchScoring({
  activeMatchId,
  setActiveMatchId,
  matches,
  navigateTo,
  refreshAdminData
}) {
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

  // Hydrate Match State on refresh
  const hydrateMatchState = async (matchId) => {
    try {
      let match, home_team_roster, away_team_roster, currentInning, deliveries;
      try {
        const result = await api.hydrateLiveMatch(matchId);
        match = result.match;
        home_team_roster = result.home_team_roster;
        away_team_roster = result.away_team_roster;
        currentInning = result.currentInning;
        deliveries = result.deliveries;
      } catch (err) {
        console.warn('[useMatchScoring] hydrateLiveMatch from API failed, attempting fallback to local state:', err);
        match = matches?.find(m => m.id === matchId);
        
        // DO NOT blindly set rosters to []. 
        // Preserve last known valid state if we have it in memory for THIS match.
        if (matchSetup && matchSetup.teamAId === match?.home_team_id && matchSetup.teamAXI?.length > 0) {
          home_team_roster = matchSetup.teamAXI;
          away_team_roster = matchSetup.teamBXI;
          currentInning = null;
          deliveries = [];
        } else {
          return { success: false, error: 'Network or database fetch failed while loading match. ' + err.message };
        }
      }

      if (!match) return { success: false, error: 'Match not found locally or remotely' };

      // Ensure rosters are enriched with full offline persistent data (district, age, etc.)
      try {
        const { db } = await import('../lib/db.js');
        const localPlayers = await db.players.toArray();
        const enrichRoster = (roster) => {
          if (!roster) return [];
          return roster.map(r => {
            const fullPlayer = localPlayers.find(p => p.id === r.id);
            if (fullPlayer) {
              return { ...fullPlayer, ...r }; // keep roster specific fields like isCaptain/role, but inject full details
            }
            return r;
          });
        };
        home_team_roster = enrichRoster(home_team_roster);
        away_team_roster = enrichRoster(away_team_roster);
      } catch (err) {
        console.warn('Failed to enrich rosters with persistent local data', err);
      }

      setMatchSetup({
        teamA: match.home_team?.name || '',
        teamAId: match.home_team_id,
        teamB: match.away_team?.name || '',
        teamBId: match.away_team_id,
        teamAShort: match.home_team?.short_name || '',
        teamBShort: match.away_team?.short_name || '',
        tossWinnerTeamId: match.toss_winner_id,
        electedTo: match.toss_decision === 'BAT' ? 'Bat' : 'Bowl',
        totalOvers: match.max_overs || 20,
        teamAXI: home_team_roster, // Temporarily alias for components in Phase 1
        teamBXI: away_team_roster  // Temporarily alias for components in Phase 1
      });

      if (currentInning) {
        setInnings(currentInning.innings_number);
        setCurrentInningsId(currentInning.id);
        
        let mergedDeliveries = [...deliveries];
        
        try {
          const { db } = await import('../lib/db.js');
          if (db.sync_queue) {
            const pendingActions = await db.sync_queue.toArray();
            const supabaseKeys = new Set(deliveries.map(d => d.idempotency_key));
            
            const offlineDeliveries = pendingActions
              .filter(a => a.action === 'RECORD_DELIVERY' && 
                (a.payload?.inningsId === currentInning.id || 
                 (a.payload?.matchId === matchId && Number(a.payload?.innings || 1) === currentInning.innings_number))
              )
              .filter(a => !supabaseKeys.has(a.payload.id))
              .map(a => {
                const p = a.payload;
                let extraType = 'NONE';
                if (p.extraType) extraType = p.extraType.toUpperCase();
                
                let wicketType = 'NONE';
                if (p.wicket) {
                  const wMap = {
                    'Bowled': 'BOWLED', 'Caught': 'CAUGHT', 'LBW': 'LBW', 'Run Out': 'RUN_OUT',
                    'Stumped': 'STUMPED', 'Hit Wicket': 'HIT_WICKET', 'Retired Hurt': 'RETIRED_HURT',
                    'Retired Out': 'RETIRED_OUT'
                  };
                  wicketType = wMap[p.dismissalType] || 'NONE';
                }
                
                return {
                  id: p.id,
                  idempotency_key: p.id,
                  runs_total: p.runsTotal ?? p.totalRuns ?? 0,
                  runs_off_bat: p.runsBatter ?? p.runsOffBat ?? 0,
                  runs_extras: p.runsExtras ?? p.extraRuns ?? 0,
                  extra_type: extraType,
                  wicket_type: wicketType,
                  striker: { name: p.striker },
                  dismissed_player_id: p.dismissedPlayerId || (p.wicket ? p.strikerId : null),
                  striker_id: p.strikerId,
                  non_striker_id: p.nonStrikerId,
                  bowler_id: p.bowlerId,
                };
              });
              
            mergedDeliveries = [...mergedDeliveries, ...offlineDeliveries];
          }
        } catch (err) {
          console.error('[useMatchScoring] Failed to merge offline deliveries during hydration:', err);
        }

        let r = 0;
        let w = 0;
        let b = 0;
        
        const mappedLog = [];
        mergedDeliveries.forEach((d) => {
          r += d.runs_total;
          if (d.wicket_type !== 'NONE') w++;
          if (d.extra_type === 'NONE' || d.extra_type === 'BYES' || d.extra_type === 'LEG_BYES') {
            b++;
          }
          
          let t = 'run';
          if (d.wicket_type !== 'NONE') t = 'wicket';
          else if (d.extra_type !== 'NONE') t = 'extra';
          
          mappedLog.push({
            id: d.idempotency_key || d.id,
            type: t,
            runs_total: d.runs_total,
            runs_off_bat: d.runs_off_bat,
            runs_extras: d.runs_extras,
            extra_type: d.extra_type,
            wicket_type: d.wicket_type,
            dismissed_player_id: d.dismissed_player_id,
            outPlayerName: d.dismissed_player_id ? (d.striker?.full_name || d.striker?.name) : null,
            over: Math.floor(b/6) + '.' + (b%6)
          });
        });
        
        setRuns(r);
        setWickets(w);
        setBalls(b);
        setDeliveryLog(mappedLog);

        const currentOverBallsArr = mappedLog.filter(dl => 
          Math.floor((b - 1) / 6) === Math.floor((parseInt(dl.over.split('.')[0]) * 6 + parseInt(dl.over.split('.')[1]) - 1) / 6)
        ).map(dl => ({
          id: dl.id,
          type: dl.type,
          value: dl.runs_total,
          runs: dl.runs_total,
          wicket: dl.wicket_type !== 'NONE',
          extra: dl.extra_type !== 'NONE'
        }));
        setCurrentOverBalls(currentOverBallsArr);

        if (mergedDeliveries.length > 0) {
          let scorecard = null;
          try {
            scorecard = await api.getMatchScorecard(matchId);
          } catch (e) {
            console.warn('[useMatchScoring] Offline: could not fetch remote scorecard, using local data:', e);
          }
          
          // Hydrate target for 2nd/4th innings
          if (scorecard && scorecard.innings) {
            let firstInningsRuns = null;
            if (currentInning.innings_number === 2 && scorecard.innings.length >= 1) {
              firstInningsRuns = scorecard.innings[0].runs || 0;
            } else if (currentInning.innings_number === 4 && scorecard.innings.length >= 3) {
              firstInningsRuns = scorecard.innings[2].runs || 0;
            }

            if (firstInningsRuns !== null) {
              try {
                const { db } = await import('../lib/db.js');
                if (db.sync_queue) {
                  const pendingActions = await db.sync_queue.toArray();
                  const targetInningsNum = currentInning.innings_number === 2 ? 1 : 3;
                  const offlineDelivs = pendingActions.filter(a => a.action === 'RECORD_DELIVERY' && a.payload?.matchId === matchId && Number(a.payload?.innings || 1) === targetInningsNum);
                  const offlineRuns = offlineDelivs.reduce((acc, a) => acc + (a.payload?.runsTotal ?? a.payload?.totalRuns ?? 0), 0);
                  firstInningsRuns += offlineRuns;
                }
              } catch (e) {
                console.warn('[useMatchScoring] Failed to add offline deliveries to target:', e);
              }
              setTarget(firstInningsRuns + 1);
            } else {
              let savedTarget = null;
              try { savedTarget = localStorage.getItem(`jdca-target-${matchId}`); } catch {}
              if (savedTarget) {
                setTarget(Number(savedTarget));
              }
            }
          }

          const currentStats = scorecard?.innings?.[currentInning.innings_number - 1];
          const lastDel = mergedDeliveries[mergedDeliveries.length - 1];

          if (lastDel) {
            if (lastDel.striker_id) {
              let strikerStat = currentStats?.batting?.find(bt => bt.id === lastDel.striker_id);
              if (!strikerStat) {
                // Fallback for offline/unsynced players
                const teamAXI = matchSetup.teamAXI || [];
                const teamBXI = matchSetup.teamBXI || [];
                const p = [...teamAXI, ...teamBXI].find(x => x.id === lastDel.striker_id);
                const pRuns = mergedDeliveries.filter(d => d.striker_id === lastDel.striker_id).reduce((sum, d) => sum + d.runs_off_bat, 0);
                const pBalls = mergedDeliveries.filter(d => d.striker_id === lastDel.striker_id && d.extra_type !== 'WIDE').length;
                strikerStat = p ? { ...p, runs: pRuns, balls: pBalls, fours: 0, sixes: 0, strikeRate: pBalls > 0 ? ((pRuns/pBalls)*100).toFixed(2) : '0.00' } : null;
              }
              if (strikerStat) setStriker({ ...strikerStat, strikeRate: strikerStat.strikeRate || '0.00' });
            }
            if (lastDel.non_striker_id) {
              let nonStrikerStat = currentStats?.batting?.find(bt => bt.id === lastDel.non_striker_id);
              if (!nonStrikerStat) {
                const teamAXI = matchSetup.teamAXI || [];
                const teamBXI = matchSetup.teamBXI || [];
                const p = [...teamAXI, ...teamBXI].find(x => x.id === lastDel.non_striker_id);
                const pRuns = mergedDeliveries.filter(d => d.striker_id === lastDel.non_striker_id).reduce((sum, d) => sum + d.runs_off_bat, 0);
                const pBalls = mergedDeliveries.filter(d => d.striker_id === lastDel.non_striker_id && d.extra_type !== 'WIDE').length;
                nonStrikerStat = p ? { ...p, runs: pRuns, balls: pBalls, fours: 0, sixes: 0, strikeRate: pBalls > 0 ? ((pRuns/pBalls)*100).toFixed(2) : '0.00' } : null;
              }
              if (nonStrikerStat) setNonStriker({ ...nonStrikerStat, strikeRate: nonStrikerStat.strikeRate || '0.00' });
            }
            if (lastDel.bowler_id) {
              let bowlerStat = currentStats?.bowling?.find(bw => bw.id === lastDel.bowler_id);
              if (!bowlerStat) {
                const teamAXI = matchSetup.teamAXI || [];
                const teamBXI = matchSetup.teamBXI || [];
                const p = [...teamAXI, ...teamBXI].find(x => x.id === lastDel.bowler_id);
                const bRuns = mergedDeliveries.filter(d => d.bowler_id === lastDel.bowler_id && d.extra_type !== 'BYE' && d.extra_type !== 'LEG_BYE').reduce((sum, d) => sum + d.runs_total, 0);
                const bBalls = mergedDeliveries.filter(d => d.bowler_id === lastDel.bowler_id && d.extra_type !== 'WIDE' && d.extra_type !== 'NO_BALL').length;
                const bWickets = mergedDeliveries.filter(d => d.bowler_id === lastDel.bowler_id && d.wicket_type !== 'NONE' && d.wicket_type !== 'RUN_OUT').length;
                bowlerStat = p ? { ...p, runsConceded: bRuns, overs: Math.floor(bBalls/6) + '.' + (bBalls%6), wickets: bWickets, maidens: 0, economy: '0.00' } : null;
              }
              if (bowlerStat) setCurrentBowler({ ...bowlerStat, economy: bowlerStat.economy || '0.00', overs: bowlerStat.overs || '0.0' });
              setLastOverBowlerId(lastDel.bowler_id);
            }
          }
        } else {
          // Try to recover from local storage if no deliveries yet (prevents reset on refresh before first ball)
          try {
            const cachedStriker = JSON.parse(localStorage.getItem(`jdca-striker-${matchId}`));
            const cachedNonStriker = JSON.parse(localStorage.getItem(`jdca-nonstriker-${matchId}`));
            const cachedBowler = JSON.parse(localStorage.getItem(`jdca-bowler-${matchId}`));
            if (cachedStriker && cachedNonStriker && cachedBowler) {
              setStriker(cachedStriker);
              setNonStriker(cachedNonStriker);
              setCurrentBowler(cachedBowler);
            } else {
              setStriker(null);
              setNonStriker(null);
              setCurrentBowler(null);
              setLastOverBowlerId(null);
            }
          } catch (e) {
            setStriker(null);
            setNonStriker(null);
            setCurrentBowler(null);
            setLastOverBowlerId(null);
          }
        }
      }
      return { success: true };
    } catch (e) {
      console.error('Failed to hydrate match state', e);
      return { success: false, error: e.message || 'Unknown hydration error' };
    }
  };

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
      console.warn('[useMatchScoring] Dexie cache check failed:', e);
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

        return inn.id;
      }
    } catch (err) {
      console.error('[useMatchScoring] Failed to resolve innings ID from API:', err);
    }

    return null;
  };

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
  const [isPaused, setIsPaused] = useState(() => {
    try {
      return activeMatchId ? localStorage.getItem(`jdca_match_paused_${activeMatchId}`) === 'true' : false;
    } catch {
      return false;
    }
  });

  useEffect(() => {
    setCurrentInningsId(null);
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

  const latestDeliveryLogRef = useRef([]);
  useEffect(() => {
    latestDeliveryLogRef.current = deliveryLog;
  }, [deliveryLog]);

  useEffect(() => {
    if (!activeMatchId) return;

    const handleRealtimeDelivery = async (e) => {
      const payload = e.detail;
      if (payload.type === 'RECONNECT') {
        console.log('[useMatchScoring] Realtime reconnect, hydrating...');
        await hydrateMatchState(activeMatchId);
        return;
      }
      
      if (payload.eventType === 'INSERT') {
        const isLocal = latestDeliveryLogRef.current.some(d => (d.id || d.idempotency_key) === payload.new?.idempotency_key);
        if (!isLocal) {
          console.log('[useMatchScoring] Remote delivery detected, hydrating state...');
          await hydrateMatchState(activeMatchId);
        }
      } else if (payload.eventType === 'DELETE') {
        console.log('[useMatchScoring] Remote delivery delete/undo detected, hydrating state...');
        await hydrateMatchState(activeMatchId);
      }
    };

    window.addEventListener('jdca-realtime-delivery', handleRealtimeDelivery);
    return () => {
      window.removeEventListener('jdca-realtime-delivery', handleRealtimeDelivery);
    };
  }, [activeMatchId]);

  useEffect(() => {
    if (activeMatchId) {
      try {
        setIsPaused(localStorage.getItem(`jdca_match_paused_${activeMatchId}`) === 'true');
      } catch {
        setIsPaused(false);
      }
    } else {
      setIsPaused(false);
    }
  }, [activeMatchId]);

  const pauseMatch = () => {
    setIsPaused(true);
    if (activeMatchId) {
      try {
        localStorage.setItem(`jdca_match_paused_${activeMatchId}`, 'true');
      } catch {}
    }
  };

  const resumeMatch = () => {
    setIsPaused(false);
    if (activeMatchId) {
      try {
        localStorage.removeItem(`jdca_match_paused_${activeMatchId}`);
      } catch {}
    }
  };

  const togglePauseMatch = () => {
    if (isPaused) {
      resumeMatch();
    } else {
      pauseMatch();
    }
  };

  const resetScoringSession = async () => {
    if (activeMatchId) {
      try {
        localStorage.removeItem(`jdca_match_paused_${activeMatchId}`);
        localStorage.removeItem(`jdca_active_match`);
      } catch {}
    }
    setActiveMatchId(null);
    setRuns(0);
    setWickets(0);
    setBalls(0);
    setCurrentOverBalls([]);
    setStriker(null);
    setNonStriker(null);
    setCurrentBowler(null);
    setDeliveryLog([]);
    setBallHistory([]);
    setIsFreeHit(false);
    setIsPaused(false);
    setExtras({ total: 0, byes: 0, legByes: 0, wides: 0, noBalls: 0, penalty: 0 });
    setScorecard(INITIAL_SCORECARD);
    setMatchStatus('IN_PROGRESS');
    setMatchSetup(INITIAL_MATCH_SETUP);
    setCurrentInningsId(null);
    setInnings(1);
    try {
      await refreshAdminData?.();
    } catch (e) {
      console.error('[useMatchScoring] Failed to refresh admin data on reset:', e);
    }
  };

  // Modals & Sheets
  const [dismissalModalOpen, setDismissalModalOpen] = useState(false);
  const [extrasModalOpen, setExtrasModalOpen] = useState(false);
  const [compareModalOpen, setCompareModalOpen] = useState(false);
  const [comparePlayer2, setComparePlayer2] = useState(null);


  // Scorecard detailed tables
  const [scorecard, setScorecard] = useState(INITIAL_SCORECARD);

  // Auto-clear validation errors after 3 seconds
  useEffect(() => {
    if (validationError) {
      const timer = setTimeout(() => setValidationError(null), 3500);
      return () => clearTimeout(timer);
    }
  }, [validationError]);

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
  const captureSnapshot = () => {
    const isTeamABatting = scorecard?.teamBattingId === matchSetup?.teamAId;
    const battingTeamXI = isTeamABatting ? matchSetup?.teamAXI : matchSetup?.teamBXI;
    const bowlingTeamXI = isTeamABatting ? matchSetup?.teamBXI : matchSetup?.teamAXI;

    return {
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
      totalMatchOvers: matchSetup?.totalOvers || 20,
      matchStatus,
      scorecard: JSON.parse(JSON.stringify(scorecard)),
      lastOverBowlerId,
      battingTeamXI,
      bowlingTeamXI,
      battingTeamId: scorecard?.teamBattingId || null,
      pendingPenalties: scorecard?.pendingPenalties || {},
      target
    };
  };

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
        // firstInningsScore is the score set in innings 1. Target = firstInningsScore + 1.
        // newState.target is set as firstInningsScore + 1 via setTarget().
        const firstInningsScore = newState.target ? newState.target - 1 : 0;
        let winnerId = null;
        let margin = null;
        let text = '';
        
        const activeMatch = matches?.find(m => m.id === activeMatchId);
        const teamAName = activeMatch?.home_team?.name || activeMatch?.teamA?.name || 'Unknown Team';
        const teamBName = activeMatch?.away_team?.name || activeMatch?.teamB?.name || 'Unknown Team';
        
        // Determine which team was batting in this innings (innings 2/4)
        const tossWinnerTeamId = matchSetup?.tossWinnerTeamId;
        const electedTo = matchSetup?.electedTo;
        let battingTId = matchSetup?.teamAId;
        let bowlingTId = matchSetup?.teamBId;
        if (tossWinnerTeamId) {
          if (tossWinnerTeamId === matchSetup?.teamAId) {
            battingTId = electedTo === 'Bat' ? matchSetup?.teamAId : matchSetup?.teamBId;
            bowlingTId = electedTo === 'Bat' ? matchSetup?.teamBId : matchSetup?.teamAId;
          } else {
            battingTId = electedTo === 'Bat' ? matchSetup?.teamBId : matchSetup?.teamAId;
            bowlingTId = electedTo === 'Bat' ? matchSetup?.teamAId : matchSetup?.teamBId;
          }
        }
        // In innings 2, teams are swapped (the team that bowled first now bats)
        if (newState.innings === 2 || newState.innings === 3) {
          const tmpId = battingTId;
          battingTId = bowlingTId;
          bowlingTId = tmpId;
        }

        const isBattingTeamA = battingTId === matchSetup?.teamAId;
        const battingName = isBattingTeamA ? teamAName : teamBName;
        const bowlingName = isBattingTeamA ? teamBName : teamAName;
        
        if (newState.target && newState.runs >= newState.target) {
          // Chasing team won
          winnerId = battingTId; 
          const wktsLeft = 10 - newState.wickets;
          margin = `${wktsLeft} wickets`;
          text = `${battingName} won by ${wktsLeft} wicket${wktsLeft !== 1 ? 's' : ''}`;
        } else if (newState.runs < firstInningsScore) {
          // Defending team won (chasing team bowled out or overs done without reaching target)
          winnerId = bowlingTId;
          const runsDiff = firstInningsScore - newState.runs;
          margin = `${runsDiff} runs`;
          text = `${bowlingName} won by ${runsDiff} run${runsDiff !== 1 ? 's' : ''}`;
        } else {
          // Scores level = Tie
          winnerId = null;
          margin = 'Tie';
          text = 'Match tied';
        }
        
        api.updateMatchDetails(activeMatchId, { 
          winner_team_id: winnerId, 
          result_margin: margin, 
          result_text: text 
        }).catch(console.error);
      } catch (e) {
        console.error('[useMatchScoring] Match finalization error:', e);
      }
      setTimeout(() => navigateTo('match-result'), 600);
    }

    return true;
  };

  const recordDeliveryEvent = async (event) => {
    // If it's just a timeline marker like 'innings_start' or 'match_start', store locally but don't treat as a delivery
    if (event.type === 'innings_start' || event.type === 'match_start') {
      const markerPayload = {
        id: `marker-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        timestamp: new Date().toISOString(),
        matchId: activeMatchId,
        innings,
        ...event,
      };
      setDeliveryLog((prev) => [...prev, markerPayload]);
      return;
    }

    const eventId = `delivery-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    
    // Ensure inningsId is always populated with the actual innings UUID for activeMatchId
    let resolvedInningsId = currentInningsId;
    if (activeMatchId) {
      const matchInningsId = await resolveInningsId(activeMatchId, innings);
      if (matchInningsId) {
        resolvedInningsId = matchInningsId;
      }
    }

    // Determine unique delivery sequence for this innings
    const currentInningsDeliveries = deliveryLog.filter(d => (d.innings || 1) === innings && d.type !== 'innings_start' && d.type !== 'match_start');
    const deliverySequence = currentInningsDeliveries.length + 1;

    const payloadRaw = {
      id: eventId,
      timestamp: new Date().toISOString(),
      matchId: activeMatchId,
      inningsId: resolvedInningsId || null,
      innings,
      deliverySequence,
      over: formatOvers(balls),
      balls,
      strikerId: striker?.id || null,
      striker: striker?.name || 'Striker',
      nonStrikerId: nonStriker?.id || null,
      nonStriker: nonStriker?.name || 'Non-Striker',
      bowlerId: currentBowler?.id || null,
      bowler: currentBowler?.name || 'Bowler',
      dismissedPlayerId: event.dismissedPlayerId || (event.wicket ? (striker?.id || null) : null),
      ...event,
    };

    const payload = normalizeDelivery(payloadRaw);

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
        console.warn(`[useMatchScoring] Innings ID missing for match ${activeMatchId}. Queuing delivery for retry.`);
        await queueOfflineAction('RECORD_DELIVERY', payload);
      } else {
        await syncService.executeOrQueue('RECORD_DELIVERY', payload, queueOfflineAction);
      }
    } catch(err) {
      console.error('[useMatchScoring] Failed to save/sync delivery:', err);
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

  const startNextInnings = (targetRuns, nextInningsNum) => {
    setTarget(targetRuns);
    if (activeMatchId && targetRuns) {
      try { localStorage.setItem(`jdca-target-${activeMatchId}`, targetRuns); } catch {}
    }
    setInnings(nextInningsNum);
    setCurrentInningsId(null);
    setRuns(0);
    setWickets(0);
    setBalls(0);
    setCurrentOverBalls([]);
    setStriker(null);
    setNonStriker(null);
    setCurrentBowler(null);
    // startInnings() will be called by InningsInitScreen once the user selects players
  };

  const startSecondInnings = (targetRuns) => startNextInnings(targetRuns, 2);
  const startSuperOver = () => startNextInnings(null, 3);
  const startSuperOverSecondInnings = (targetRuns) => startNextInnings(targetRuns, 4);

  const replaceStriker = (player) => {
    if (!player) return;
    setStriker((prev) => {
      const newState = {
        id: player.id || prev?.id,
        name: player.full_name || player.name || prev?.name || 'Striker',
        runs: Number.isFinite(player.runs) ? player.runs : 0,
        balls: Number.isFinite(player.balls) ? player.balls : 0,
        fours: Number.isFinite(player.fours) ? player.fours : 0,
        sixes: Number.isFinite(player.sixes) ? player.sixes : 0,
        strikeRate: player.strikeRate || '0.0',
      };
      if (activeMatchId) localStorage.setItem(`jdca-striker-${activeMatchId}`, JSON.stringify(newState));
      return newState;
    });
  };

  const replaceBatter = (isStriker, player) => {
    if (!player) return;
    const newBatter = {
      id: player.id || `temp-${Date.now()}`,
      name: player.full_name || player.name || 'Batter',
      runs: Number.isFinite(player.runs) ? player.runs : 0,
      balls: Number.isFinite(player.balls) ? player.balls : 0,
      fours: Number.isFinite(player.fours) ? player.fours : 0,
      sixes: Number.isFinite(player.sixes) ? player.sixes : 0,
      strikeRate: player.strikeRate || '0.0',
    };
    if (isStriker) {
      setStriker(newBatter);
      if (activeMatchId) localStorage.setItem(`jdca-striker-${activeMatchId}`, JSON.stringify(newBatter));
    } else {
      setNonStriker(newBatter);
      if (activeMatchId) localStorage.setItem(`jdca-nonstriker-${activeMatchId}`, JSON.stringify(newBatter));
    }
  };

  const replaceBowler = (player) => {
    if (!player) return;
    const newState = {
      id: player.id,
      name: player.full_name || player.name || 'Bowler',
      overs: 0,
      ballsBowled: 0,
      maidens: 0,
      runs: 0,
      wickets: 0,
      economy: '0.00',
      wk: ''
    };
    setCurrentBowler(newState);
    if (activeMatchId) localStorage.setItem(`jdca-bowler-${activeMatchId}`, JSON.stringify(newState));
  };

  const handleRetireBatter = (isStriker, isRetiredOut) => {
    if (isStriker && !striker) return;
    if (!isStriker && !nonStriker) return;
    const outName = isStriker ? striker?.name || striker?.full_name : nonStriker?.name || nonStriker?.full_name;
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
    setCurrentBowler((prev) => {
      // If the same bowler is selected again (returning for another spell), preserve their cumulative stats
      if (prev && prev.id === bowler.id) {
        return { ...prev };
      }
      // New bowler - start fresh
      return {
        id: bowler.id,
        name: bowler.name,
        overs: 0,
        ballsBowled: 0,
        maidens: 0,
        runs: 0,
        wickets: 0,
        economy: '0.00',
        wk: '',
      };
    });
    setMatchStatus(MATCH_STATES.IN_PROGRESS);
    setCurrentOverBalls([]);
  };

  // 1. Add Runs Action (0..6)
  const validateScoringState = () => {
    if (matchStatus === MATCH_STATES.MATCH_FINISHED || matchStatus === 'COMPLETED') {
      setValidationError("Match has already been completed.");
      return false;
    }
    if (isPaused) {
      setValidationError("Match is currently paused. Please tap 'Resume' to continue scoring.");
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

    const currentState = captureSnapshot();

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

  // 2. Record Extra (Wide, No Ball, Leg Bye, Bye)
  const recordExtra = (rawType, runsWithExtra = 0, isBoundary = false) => {
    if (!validateScoringState()) return;

    const currentState = captureSnapshot();

    const typeMap = { 'wide': 'WIDE', 'no_ball': 'NO_BALL', 'bye': 'BYE', 'leg_bye': 'LEG_BYE' };
    const extraType = typeMap[rawType] || rawType;

    const isNoBall = extraType === 'NO_BALL';
    const isWide = extraType === 'WIDE';
    const extraRunsPenalty = isNoBall ? 1 : (isWide ? 1 + runsWithExtra : runsWithExtra);
    const batRuns = isNoBall ? runsWithExtra : 0;
    const totalRuns = extraRunsPenalty + batRuns;
    
    // Explicit legal delivery flag
    const isLegalDelivery = !['WIDE', 'NO_BALL'].includes(extraType);
    
    const runsCompleted = isBoundary ? 0 : runsWithExtra;

    const result = processDelivery(currentState, {
      extraType: extraType,
      wicketType: 'NONE',
      runsExtras: extraRunsPenalty,
      runsBatter: batRuns,
      runsTotal: totalRuns,
      runsCompleted: runsCompleted,
      isLegalDelivery,
      isBoundary
    });

    const ok = applyStateResult(result);
    if (ok) {
      const extraLabel = isWide
        ? `${totalRuns}Wd`
        : isNoBall
        ? `${totalRuns}Nb`
        : `${totalRuns}${extraType === 'BYE' ? 'B' : 'Lb'}`;

      recordDeliveryEvent({ 
        extraType: extraType, 
        runsExtras: extraRunsPenalty, 
        runsBatter: batRuns,
        runsTotal: totalRuns, 
        runsCompleted,
        isLegalDelivery,
        isBoundary,
        label: extraLabel 
      });
    }
  };

  // 2.5 Record Standalone Penalty Event
  const recordPenaltyEventAction = (recipientTeamId, penaltyRuns = 5, reasonCode = '') => {
    if (!validateScoringState()) return;

    const currentState = captureSnapshot();

    const result = processPenaltyEvent(currentState, {
      eventType: 'PENALTY',
      recipientTeamId,
      penaltyRuns,
      reasonCode
    });

    const ok = applyStateResult(result);
    if (ok) {
      // NOTE: Here we pass the event structure directly to `recordDeliveryEvent`
      // which relies on `normalizePenaltyEvent` later down the line, or we can just pass it directly 
      // if `deliveryLog` takes generic events.
      // `recordDeliveryEvent` currently logs to `deliveryLog`. We'll just push it.
      recordDeliveryEvent({ 
        eventType: 'PENALTY', 
        recipientTeamId,
        penaltyRuns,
        reasonCode,
        label: `+${penaltyRuns} Pen` 
      });
    }
  };

  // 3. Record Wicket / Dismissal (Bowled, Caught, LBW, Run Out, Stumped, etc.)
  const recordWicket = (dismissalType, outPlayerId = null, fielder = '', wicketkeeper = '', runsCompleted = 0) => {
    if (!validateScoringState()) return;

    const currentState = captureSnapshot();

    // Resolve explicit names for legacy events
    const finalOutName = (outPlayerId === striker?.id) ? striker?.name : 
                         (outPlayerId === nonStriker?.id) ? nonStriker?.name : 
                         (dismissalType !== 'Run Out' ? striker?.name : null);

    const result = processDelivery(currentState, {
      type: 'wicket',
      dismissalType,
      dismissedPlayerId: outPlayerId || (dismissalType !== 'Run Out' ? striker?.id : null),
      outPlayerName: finalOutName,
      fielderName: fielder,
      wicketkeeperName: wicketkeeper,
      runsBatter: runsCompleted,
      runsCompleted: runsCompleted
    });

    const ok = applyStateResult(result);
    if (ok) {
      recordDeliveryEvent({ type: 'wicket', wicket: true, dismissalType, outPlayerId, outPlayerName: finalOutName, fielderName: fielder, wicketkeeperName: wicketkeeper, runsBatter: runsCompleted, runsCompleted, label: 'W' });
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

    // Queue UNDO to Supabase
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
      console.error('[useMatchScoring] Failed to persist undo:', err);
    }
  };

  const applyRevisedOvers = async (revisedOvers) => {
    setMatchSetup(prev => ({ ...prev, maxOvers: revisedOvers, totalOvers: revisedOvers }));
    setTotalMatchOvers(revisedOvers);
    
    try {
      await api.updateMatchDetails(activeMatchId, { max_overs: revisedOvers });
    } catch (err) {
      console.error('Failed to update revised overs remotely', err);
    }

    const maxLegalBalls = revisedOvers * 6;
    if (balls >= maxLegalBalls) {
      const currentState = captureSnapshot();
      let newStatus = MATCH_STATES.INNINGS_BREAK;
      if (innings === 2 || innings === 4) {
        newStatus = MATCH_STATES.MATCH_FINISHED;
      }
      applyStateResult({
        success: true,
        newState: {
          ...currentState,
          totalMatchOvers: revisedOvers,
          matchStatus: newStatus
        }
      });
    }
  };

  return {
    matchSetup, setMatchSetup,
    innings, setInnings,
    currentInningsId, setCurrentInningsId,
    target, setTarget,
    hydrateMatchState,
    resolveInningsId,
    matchFormat, setMatchFormat,
    totalMatchOvers, setTotalMatchOvers,
    runs, setRuns,
    wickets, setWickets,
    balls, setBalls,
    currentOverBalls, setCurrentOverBalls,
    extras, setExtras,
    striker, setStriker,
    nonStriker, setNonStriker,
    currentBowler, setCurrentBowler,
    selectedDirection, setSelectedDirection,
    ballHistory, setBallHistory,
    deliveryLog, setDeliveryLog,
    lastOverBowlerId, setLastOverBowlerId,
    scoringFirstRunDone, setScoringFirstRunDone,
    isFreeHit, setIsFreeHit,
    validationError, setValidationError,
    matchStatus, setMatchStatus,
    isPaused, setIsPaused,
    pauseMatch, resumeMatch, togglePauseMatch,
    resetScoringSession,
    dismissalModalOpen, setDismissalModalOpen,
    extrasModalOpen, setExtrasModalOpen,
    compareModalOpen, setCompareModalOpen,
    comparePlayer2, setComparePlayer2,
    scorecard, setScorecard,
    formatOversDisplay,
    formatOvers,
    calculateCRR,
    calculateProjectedScore,
    canBowlerBowlNextOver,
    getCRR, getProjectedScore,
    toggleStriker,
    captureSnapshot, applyStateResult, recordDeliveryEvent,
    markScoringFirstRunDone,
    startInnings, startNextInnings, startSecondInnings, startSuperOver, startSuperOverSecondInnings,
    replaceStriker, replaceBatter, replaceBowler, handleRetireBatter, continueAfterOver,
    validateScoringState, recordRuns, recordExtra, recordPenaltyEvent: recordPenaltyEventAction, recordWicket, undoLastAction,
    applyRevisedOvers,
    MATCH_STATES
  };
}
