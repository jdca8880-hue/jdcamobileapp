import { useState, useEffect, useRef, useCallback } from 'react';
import confetti from 'canvas-confetti';
import { supabase } from '../lib/supabase';
import { api, parseOversFromFormat } from '../lib/api';
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
  setMatches,
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
  // Authoritative batting/bowling team for the CURRENT innings, taken from the
  // innings record in the DB (api.getOrCreateInnings decides innings-2 by
  // inverting innings-1). The client trusts this instead of re-deriving from the
  // toss, so the right team always bats in the 2nd innings.
  const [currentBattingTeamId, setCurrentBattingTeamId] = useState(null);
  const [currentBowlingTeamId, setCurrentBowlingTeamId] = useState(null);
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
        console.warn('[useMatchScoring] hydrateLiveMatch from API failed, attempting fallback to local snapshot:', err);

        // Try to restore from the atomic match snapshot saved after every scoring action
        try {
          const { db } = await import('../lib/db.js');
          const snapshot = await db.match_state.get(matchId);
          if (snapshot && snapshot.matchSetup) {
            console.log('[useMatchScoring] Restoring from local match snapshot, updatedAt:', snapshot.updatedAt);
            setMatchSetup(snapshot.matchSetup);
            setInnings(snapshot.innings ?? 1);
            setCurrentInningsId(snapshot.currentInningsId);
            if (snapshot.currentBattingTeamId) setCurrentBattingTeamId(snapshot.currentBattingTeamId);
            if (snapshot.currentBowlingTeamId) setCurrentBowlingTeamId(snapshot.currentBowlingTeamId);
            setRuns(snapshot.runs ?? 0);
            setWickets(snapshot.wickets ?? 0);
            setBalls(snapshot.balls ?? 0);
            setTarget(snapshot.target);
            setStriker(snapshot.striker);
            setNonStriker(snapshot.nonStriker);
            setCurrentBowler(snapshot.currentBowler);
            setDeliveryLog(snapshot.deliveryLog ?? []);
            setCurrentOverBalls(snapshot.currentOverBalls ?? []);
            setExtras(snapshot.extras ?? { wides: 0, noBalls: 0, legByes: 0, byes: 0, penalty: 0 });
            setIsFreeHit(snapshot.isFreeHit ?? false);
            setMatchStatus(snapshot.matchStatus ?? 'IN_PROGRESS');
            setIsPaused(snapshot.isPaused ?? false);
            if (snapshot.scorecard) setScorecard(snapshot.scorecard);
            if (snapshot.lastOverBowlerId !== undefined) setLastOverBowlerId(snapshot.lastOverBowlerId);
            if (snapshot.totalMatchOvers) setTotalMatchOvers(snapshot.totalMatchOvers);
            if (snapshot.inningsSeqCounters) {
              Object.assign(inningsSeqRef.current, snapshot.inningsSeqCounters);
            }
            return { success: true };
          }
        } catch (snapErr) {
          console.warn('[useMatchScoring] Snapshot recovery failed:', snapErr);
        }

        // Final fallback: recover what we can from localStorage (match setup only — no scoring state)
        match = matches?.find(m => m.id === matchId);
        if (!match) {
          try {
            const { db } = await import('../lib/db.js');
            match = await db.matches.get(matchId);
          } catch (e) {}
        }

        let cachedSetup = null;
        try {
          cachedSetup = JSON.parse(
            localStorage.getItem(`jdca-match-setup-${matchId}`) ||
            localStorage.getItem(`jdca_match_setup_${matchId}`) ||
            'null'
          );
        } catch (e) {}

        if (cachedSetup && Array.isArray(cachedSetup.teamAXI) && cachedSetup.teamAXI.length > 0) {
          home_team_roster = cachedSetup.teamAXI;
          away_team_roster = cachedSetup.teamBXI || [];
          currentInning = null;
          deliveries = [];
        } else if (matchSetup && (matchSetup.matchId === matchId || matchSetup.teamAId === match?.home_team_id) && matchSetup.teamAXI?.length > 0) {
          home_team_roster = matchSetup.teamAXI;
          away_team_roster = matchSetup.teamBXI;
          currentInning = null;
          deliveries = [];
        } else {
          return { success: false, error: 'Network or database fetch failed while loading match. ' + (err?.message || '') };
        }
      }

      if (!match) return { success: false, error: 'Match not found locally or remotely' };

      // Fallback: If rosters are empty from API, recover from cached setup in localStorage
      if (!home_team_roster || home_team_roster.length === 0 || !away_team_roster || away_team_roster.length === 0) {
        try {
          const cachedSetup = JSON.parse(
            localStorage.getItem(`jdca-match-setup-${matchId}`) ||
            localStorage.getItem(`jdca_match_setup_${matchId}`) ||
            'null'
          );
          if (cachedSetup) {
            if ((!home_team_roster || home_team_roster.length === 0) && cachedSetup.teamAXI?.length > 0) {
              home_team_roster = cachedSetup.teamAXI;
            }
            if ((!away_team_roster || away_team_roster.length === 0) && cachedSetup.teamBXI?.length > 0) {
              away_team_roster = cachedSetup.teamBXI;
            }
          }
        } catch (e) {}
      }

      // Ensure rosters are enriched with full offline persistent data (district, age, etc.)
      try {
        const { db } = await import('../lib/db.js');
        const localPlayers = await db.players.toArray();
        const enrichRoster = (roster) => {
          if (!roster) return [];
          return roster.map(r => {
            const fullPlayer = localPlayers.find(p => String(p.id) === String(r.id));
            if (fullPlayer) {
              return { ...fullPlayer, ...r };
            }
            return r;
          });
        };
        home_team_roster = enrichRoster(home_team_roster);
        away_team_roster = enrichRoster(away_team_roster);
      } catch (err) {
        console.warn('Failed to enrich rosters with persistent local data', err);
      }

      const effectiveOvers = match.max_overs || 20;
      setTotalMatchOvers(effectiveOvers);
      setMatchSetup({
        matchId: match.id,
        teamA: match.home_team?.name || '',
        teamAId: match.home_team_id,
        teamB: match.away_team?.name || '',
        teamBId: match.away_team_id,
        teamAShort: match.home_team?.short_name || '',
        teamBShort: match.away_team?.short_name || '',
        tossWinnerTeamId: match.toss_winner_id,
        electedTo: String(match.toss_decision || '').toUpperCase() === 'BAT' ? 'Bat' : 'Bowl',
        totalOvers: effectiveOvers,
        teamAXI: home_team_roster,
        teamBXI: away_team_roster
      });

      // Cache setup and enriched rosters to localStorage for bulletproof offline recovery
      try {
        localStorage.setItem(`jdca-match-setup-${matchId}`, JSON.stringify({
          matchId: match.id,
          teamAId: match.home_team_id,
          teamBId: match.away_team_id,
          teamA: match.home_team?.name || '',
          teamB: match.away_team?.name || '',
          tossWinnerTeamId: match.toss_winner_id,
          tossDecision: match.toss_decision,
          totalOvers: effectiveOvers,
          teamAXI: home_team_roster,
          teamBXI: away_team_roster
        }));
      } catch (e) {}

      if (currentInning) {
        if (currentInning.overs_limit) {
          setTotalMatchOvers(currentInning.overs_limit);
        }
        setInnings(currentInning.innings_number);
        setCurrentInningsId(currentInning.id);
        if (currentInning.batting_team_id) setCurrentBattingTeamId(currentInning.batting_team_id);
        if (currentInning.bowling_team_id) setCurrentBowlingTeamId(currentInning.bowling_team_id);

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
                // Queued payloads are already in the canonical contract shape,
                // so read the canonical fields directly (the old code read the
                // pre-normalization `p.wicket`/`p.dismissalType`, which no longer
                // exist, silently dropping every offline wicket on hydration).
                const extraType = p.extraType || 'NONE';
                const wicketType = p.wicketType || 'NONE';

                return {
                  id: p.id,
                  idempotency_key: p.id,
                  delivery_sequence: p.deliverySequence,
                  runs_total: p.runsTotal ?? p.totalRuns ?? 0,
                  runs_off_bat: p.runsBatter ?? p.runsOffBat ?? 0,
                  runs_extras: p.runsExtras ?? p.extraRuns ?? 0,
                  extra_type: extraType,
                  wicket_type: wicketType,
                  striker: { name: p.striker },
                  dismissed_player_id: p.dismissedPlayerId || (wicketType !== 'NONE' ? p.strikerId : null),
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

        // Guard: if NOTHING came back (remote + Dexie + queue all empty) yet a
        // richer local snapshot exists, the deliveries fetch almost certainly
        // timed out. Restore the snapshot instead of zeroing the live score —
        // and crucially skip the post-hydration snapshot save below, which would
        // otherwise overwrite the good snapshot with those zeros.
        if (mergedDeliveries.length === 0) {
          try {
            const { db } = await import('../lib/db.js');
            const snapshot = await db.match_state.get(matchId);
            const snapHasData = snapshot && (
              (snapshot.runs ?? 0) > 0 ||
              (snapshot.balls ?? 0) > 0 ||
              (Array.isArray(snapshot.deliveryLog) && snapshot.deliveryLog.length > 0)
            );
            if (snapHasData) {
              console.warn('[useMatchScoring] Hydration returned 0 deliveries but snapshot has data. Restoring snapshot to avoid score reset.');
              setInnings(snapshot.innings ?? currentInning.innings_number);
              setCurrentInningsId(snapshot.currentInningsId ?? currentInning.id);
              if (snapshot.currentBattingTeamId) setCurrentBattingTeamId(snapshot.currentBattingTeamId);
              if (snapshot.currentBowlingTeamId) setCurrentBowlingTeamId(snapshot.currentBowlingTeamId);
              setRuns(snapshot.runs ?? 0);
              setWickets(snapshot.wickets ?? 0);
              setBalls(snapshot.balls ?? 0);
              if (snapshot.target !== undefined) setTarget(snapshot.target);
              setStriker(snapshot.striker ?? null);
              setNonStriker(snapshot.nonStriker ?? null);
              setCurrentBowler(snapshot.currentBowler ?? null);
              setDeliveryLog(snapshot.deliveryLog ?? []);
              setCurrentOverBalls(snapshot.currentOverBalls ?? []);
              setExtras(snapshot.extras ?? { wides: 0, noBalls: 0, legByes: 0, byes: 0, penalty: 0 });
              setIsFreeHit(snapshot.isFreeHit ?? false);
              if (snapshot.matchStatus) setMatchStatus(snapshot.matchStatus);
              if (snapshot.lastOverBowlerId !== undefined) setLastOverBowlerId(snapshot.lastOverBowlerId);
              if (snapshot.scorecard) setScorecard(snapshot.scorecard);
              if (snapshot.inningsSeqCounters) {
                Object.assign(inningsSeqRef.current, snapshot.inningsSeqCounters);
              }
              return { success: true, restoredFromSnapshot: true };
            }
          } catch (snapErr) {
            console.warn('[useMatchScoring] Snapshot guard during hydration failed:', snapErr);
          }
        }

        // Seed the monotonic sequence counter so freshly recorded balls continue
        // AFTER the highest sequence already persisted (server) or queued (offline).
        let seqMax = 0;
        mergedDeliveries.forEach((d) => {
          const s = Number(d.delivery_sequence ?? d.deliverySequence ?? 0);
          if (Number.isFinite(s) && s > seqMax) seqMax = s;
        });
        inningsSeqRef.current[currentInning.innings_number] = seqMax;

        let r = 0;
        let w = 0;
        let b = 0;

        const mappedLog = [];
        mergedDeliveries.forEach((d) => {
          r += d.runs_total;
          if (d.wicket_type !== 'NONE') w++;
          if (d.extra_type === 'NONE' || d.extra_type === 'BYE' || d.extra_type === 'LEG_BYE') {
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

        let scorecard = null;
        try {
          scorecard = await api.getMatchScorecard(matchId);
        } catch (e) {
          console.warn('[useMatchScoring] Offline: could not fetch remote scorecard, using local data:', e);
        }
        
        // Hydrate target for 2nd/4th innings.
        // Prefer the authoritative DB value (target_runs on the current
        // innings row) — it survives localStorage clears and travels
        // across devices. Fall back to re-deriving from scorecard runs,
        // then to localStorage.
        if (currentInning?.target_runs && Number(currentInning.target_runs) > 0) {
          setTarget(Number(currentInning.target_runs));
        } else if (scorecard && scorecard.innings) {
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
        } else {
          let savedTarget = null;
          try { savedTarget = localStorage.getItem(`jdca-target-${matchId}`); } catch {}
          if (savedTarget) {
            setTarget(Number(savedTarget));
          }
        }

        const currentInningsNum = currentInning?.innings_number || 1;
        let currentBattingXI = home_team_roster;
        let currentBowlingXI = away_team_roster;
        if (currentInning?.batting_team_id) {
          currentBattingXI = currentInning.batting_team_id === match.home_team_id ? home_team_roster : away_team_roster;
          currentBowlingXI = currentInning.bowling_team_id === match.home_team_id ? home_team_roster : away_team_roster;
        } else {
          const tossWinnerBats = String(match.toss_decision || '').toUpperCase() === 'BAT';
          const tossWinnerIsHome = match.toss_winner_id === match.home_team_id;
          const homeBatsFirst = (tossWinnerIsHome && tossWinnerBats) || (!tossWinnerIsHome && !tossWinnerBats);
          const inn1Batting = homeBatsFirst ? match.home_team_id : match.away_team_id;
          const isHomeBatting = currentInningsNum === 2 ? inn1Batting !== match.home_team_id : inn1Batting === match.home_team_id;
          currentBattingXI = isHomeBatting ? home_team_roster : away_team_roster;
          currentBowlingXI = isHomeBatting ? away_team_roster : home_team_roster;
        }

        let cachedStriker = null;
        let cachedNonStriker = null;
        let cachedBowler = null;
        try {
          cachedStriker = JSON.parse(localStorage.getItem(`jdca-striker-${matchId}`));
          cachedNonStriker = JSON.parse(localStorage.getItem(`jdca-nonstriker-${matchId}`));
          cachedBowler = JSON.parse(localStorage.getItem(`jdca-bowler-${matchId}`));
        } catch {}

        const currentStats = scorecard?.innings?.[currentInning.innings_number - 1];
        const lastDel = mergedDeliveries.length > 0 ? mergedDeliveries[mergedDeliveries.length - 1] : null;

        // Dismissed Batters set (prevents resurrecting out players as striker/non-striker)
        const dismissedBatterIds = new Set();
        for (const d of mergedDeliveries) {
          if (d.wicket_type && d.wicket_type !== 'NONE') {
            const dismissed = d.dismissed_player_id || (d.wicket_type !== 'RUN_OUT' ? d.striker_id : null);
            if (dismissed) dismissedBatterIds.add(String(dismissed));
          }
        }
        if (currentStats?.batting) {
          for (const bt of currentStats.batting) {
            if (bt.dismissal && bt.dismissal !== 'not out' && bt.id) {
              dismissedBatterIds.add(String(bt.id));
            }
          }
        }

        const isStrikerValid = cachedStriker && 
          currentBattingXI.some(p => String(p.id) === String(cachedStriker.id)) &&
          !dismissedBatterIds.has(String(cachedStriker.id));

        const isNonStrikerValid = cachedNonStriker && 
          currentBattingXI.some(p => String(p.id) === String(cachedNonStriker.id)) &&
          !dismissedBatterIds.has(String(cachedNonStriker.id)) &&
          (!cachedStriker || String(cachedStriker.id) !== String(cachedNonStriker.id));

        const isBowlerValid = cachedBowler && currentBowlingXI.some(p => String(p.id) === String(cachedBowler.id));

        // 1. Resolve Striker
        if (isStrikerValid) {
          const stat = currentStats?.batting?.find(bt => String(bt.id) === String(cachedStriker.id));
          setStriker({ ...cachedStriker, ...(stat || {}), strikeRate: stat?.strikeRate || cachedStriker.strikeRate || '0.00' });
        } else if (lastDel && lastDel.striker_id && !dismissedBatterIds.has(String(lastDel.striker_id))) {
          let strikerStat = currentStats?.batting?.find(bt => String(bt.id) === String(lastDel.striker_id));
          if (!strikerStat) {
            const p = currentBattingXI.find(x => String(x.id) === String(lastDel.striker_id));
            const pRuns = mergedDeliveries.filter(d => String(d.striker_id) === String(lastDel.striker_id)).reduce((sum, d) => sum + (d.runs_off_bat || 0), 0);
            const pBalls = mergedDeliveries.filter(d => String(d.striker_id) === String(lastDel.striker_id) && d.extra_type !== 'WIDE').length;
            strikerStat = p ? { ...p, runs: pRuns, balls: pBalls, fours: 0, sixes: 0, strikeRate: pBalls > 0 ? ((pRuns/pBalls)*100).toFixed(2) : '0.00' } : null;
          }
          if (strikerStat) setStriker({ ...strikerStat, strikeRate: strikerStat.strikeRate || '0.00' });
          else setStriker(null);
        } else {
          setStriker(null);
        }

        // 2. Resolve Non-Striker
        if (isNonStrikerValid) {
          const stat = currentStats?.batting?.find(bt => String(bt.id) === String(cachedNonStriker.id));
          setNonStriker({ ...cachedNonStriker, ...(stat || {}), strikeRate: stat?.strikeRate || cachedNonStriker.strikeRate || '0.00' });
        } else if (lastDel && lastDel.non_striker_id && !dismissedBatterIds.has(String(lastDel.non_striker_id))) {
          let nonStrikerStat = currentStats?.batting?.find(bt => String(bt.id) === String(lastDel.non_striker_id));
          if (!nonStrikerStat) {
            const p = currentBattingXI.find(x => String(x.id) === String(lastDel.non_striker_id));
            const pRuns = mergedDeliveries.filter(d => String(d.striker_id) === String(lastDel.non_striker_id)).reduce((sum, d) => sum + (d.runs_off_bat || 0), 0);
            const pBalls = mergedDeliveries.filter(d => String(d.striker_id) === String(lastDel.non_striker_id) && d.extra_type !== 'WIDE').length;
            nonStrikerStat = p ? { ...p, runs: pRuns, balls: pBalls, fours: 0, sixes: 0, strikeRate: pBalls > 0 ? ((pRuns/pBalls)*100).toFixed(2) : '0.00' } : null;
          }
          if (nonStrikerStat) setNonStriker({ ...nonStrikerStat, strikeRate: nonStrikerStat.strikeRate || '0.00' });
          else setNonStriker(null);
        } else {
          setNonStriker(null);
        }

        // 3. Resolve Bowler & Over State
        const legalBalls = mergedDeliveries.filter(d => d.extra_type !== 'WIDE' && d.extra_type !== 'NO_BALL').length;
        const isOverEnd = (legalBalls > 0 && legalBalls % 6 === 0);

        if (isOverEnd) {
          // Over just finished!
          if (lastDel?.bowler_id) {
            setLastOverBowlerId(lastDel.bowler_id);
          }
          // If cached bowler is valid AND not the one who just bowled this over, keep them
          if (isBowlerValid && lastDel && String(cachedBowler.id) !== String(lastDel.bowler_id)) {
            const stat = currentStats?.bowling?.find(bw => String(bw.id) === String(cachedBowler.id));
            setCurrentBowler({ ...cachedBowler, ...(stat || {}) });
          } else {
            // Bowler cannot bowl consecutive overs; prompt scorer for new bowler
            setCurrentBowler(null);
          }
        } else {
          // Mid-over or over 1 start
          if (legalBalls >= 6) {
            let legalCount = 0;
            let prevOverLastDel = null;
            const prevOverTargetCount = Math.floor(legalBalls / 6) * 6;
            for (const d of mergedDeliveries) {
              if (d.extra_type !== 'WIDE' && d.extra_type !== 'NO_BALL') {
                legalCount++;
              }
              if (legalCount === prevOverTargetCount) {
                prevOverLastDel = d;
                break;
              }
            }
            if (prevOverLastDel?.bowler_id) {
              setLastOverBowlerId(prevOverLastDel.bowler_id);
            }
          } else {
            setLastOverBowlerId(null);
          }

          if (isBowlerValid) {
            const stat = currentStats?.bowling?.find(bw => String(bw.id) === String(cachedBowler.id));
            setCurrentBowler({ ...cachedBowler, ...(stat || {}) });
          } else if (lastDel && lastDel.bowler_id) {
            let bowlerStat = currentStats?.bowling?.find(bw => String(bw.id) === String(lastDel.bowler_id));
            if (!bowlerStat) {
              const p = currentBowlingXI.find(x => String(x.id) === String(lastDel.bowler_id));
              const bRuns = mergedDeliveries.filter(d => String(d.bowler_id) === String(lastDel.bowler_id) && d.extra_type !== 'BYE' && d.extra_type !== 'LEG_BYE').reduce((sum, d) => sum + (d.runs_total || 0), 0);
              const bBalls = mergedDeliveries.filter(d => String(d.bowler_id) === String(lastDel.bowler_id) && d.extra_type !== 'WIDE' && d.extra_type !== 'NO_BALL').length;
              const bWickets = mergedDeliveries.filter(d => String(d.bowler_id) === String(lastDel.bowler_id) && d.wicket_type !== 'NONE' && d.wicket_type !== 'RUN_OUT').length;
              bowlerStat = p ? { ...p, runsConceded: bRuns, overs: Math.floor(bBalls/6) + '.' + (bBalls%6), wickets: bWickets, maidens: 0, economy: '0.00' } : null;
            }
            if (bowlerStat) setCurrentBowler({ ...bowlerStat, economy: bowlerStat.economy || '0.00', overs: bowlerStat.overs || '0.0' });
          }
        }
      }

      // Save snapshot after successful API hydration so future offline opens can restore instantly.
      // Deferred so React state setters have committed before we read them.
      setTimeout(() => saveMatchSnapshot(), 0);

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
          if (cached.batting_team_id) setCurrentBattingTeamId(cached.batting_team_id);
          if (cached.bowling_team_id) setCurrentBowlingTeamId(cached.bowling_team_id);
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
        if (inn.batting_team_id) setCurrentBattingTeamId(inn.batting_team_id);
        if (inn.bowling_team_id) setCurrentBowlingTeamId(inn.bowling_team_id);
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
  // Monotonic per-innings delivery sequence. Keyed by innings number.
  // Assigned synchronously so rapid taps cannot collide, and never reused after
  // an undo (so a new ball can never clash with the sequence of an undone one).
  const inningsSeqRef = useRef({});
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

  // When the ACTIVE MATCH actually changes, reset innings-scoped state so a
  // previous match's innings number can't leak into a new one. Without this, a
  // session that reached innings 2 in an earlier match left innings=2, so the
  // next match's 1st innings was treated as the 2nd and immediately declared a
  // winner. Does NOT fire on initial mount (so a directly-resumed match is left
  // for hydrateMatchState to populate from the DB).
  const prevActiveMatchRef = useRef(activeMatchId);
  useEffect(() => {
    if (prevActiveMatchRef.current !== activeMatchId) {
      prevActiveMatchRef.current = activeMatchId;
      setInnings(1);
      setTarget(null);
      setCurrentInningsId(null);
      setCurrentBattingTeamId(null);
      setCurrentBowlingTeamId(null);
      inningsSeqRef.current = {};
    }
  }, [activeMatchId]);

  // Hydration state — owned here so there is exactly ONE place that sets
  // isHydrating true/false. ScoringScreen reads it, never writes it.
  const [isHydrating, setIsHydrating] = useState(false);
  const [hydrationError, setHydrationError] = useState(null);
  const hydrationRanForMatch = useRef(null);

  // Unified hydration: local snapshot first (instant), then API (authoritative).
  // Runs once per activeMatchId when scoring state is at defaults (page refresh /
  // app restart). SPA navigation keeps CricketContext alive, so state is already
  // populated and the guard `innings !== 1 || balls !== 0` skips this.
  useEffect(() => {
    if (!activeMatchId) {
      hydrationRanForMatch.current = null;
      setIsHydrating(false);
      setHydrationError(null);
      return;
    }
    if (innings !== 1 || balls !== 0) return;
    if (hydrationRanForMatch.current === activeMatchId) return;
    hydrationRanForMatch.current = activeMatchId;

    const activeMatch = matches?.find(m => m.id === activeMatchId);
    if (activeMatch && ['COMPLETED', 'ABANDONED', 'CANCELLED'].includes(activeMatch.status)) return;

    let cancelled = false;

    (async () => {
      // --- Step 1: instant local restore from Dexie snapshot ---
      let restoredLocally = false;
      try {
        const { db } = await import('../lib/db.js');
        const snapshot = await db.match_state.get(activeMatchId);
        if (!cancelled && snapshot && (snapshot.innings > 1 || snapshot.balls > 0 || snapshot.matchSetup)) {
          console.log('[useMatchScoring] Restoring from local snapshot');
          setInnings(snapshot.innings ?? 1);
          setCurrentInningsId(snapshot.currentInningsId);
          if (snapshot.currentBattingTeamId) setCurrentBattingTeamId(snapshot.currentBattingTeamId);
          if (snapshot.currentBowlingTeamId) setCurrentBowlingTeamId(snapshot.currentBowlingTeamId);
          setRuns(snapshot.runs ?? 0);
          setWickets(snapshot.wickets ?? 0);
          setBalls(snapshot.balls ?? 0);
          setTarget(snapshot.target);
          setStriker(snapshot.striker);
          setNonStriker(snapshot.nonStriker);
          setCurrentBowler(snapshot.currentBowler);
          setDeliveryLog(snapshot.deliveryLog ?? []);
          setCurrentOverBalls(snapshot.currentOverBalls ?? []);
          setExtras(snapshot.extras ?? { wides: 0, noBalls: 0, legByes: 0, byes: 0, penalty: 0 });
          setIsFreeHit(snapshot.isFreeHit ?? false);
          setMatchStatus(snapshot.matchStatus ?? 'IN_PROGRESS');
          setIsPaused(snapshot.isPaused ?? false);
          if (snapshot.scorecard) setScorecard(snapshot.scorecard);
          if (snapshot.lastOverBowlerId !== undefined) setLastOverBowlerId(snapshot.lastOverBowlerId);
          if (snapshot.totalMatchOvers) setTotalMatchOvers(snapshot.totalMatchOvers);
          if (snapshot.inningsSeqCounters) {
            Object.assign(inningsSeqRef.current, snapshot.inningsSeqCounters);
          }
          if (snapshot.matchSetup) setMatchSetup(snapshot.matchSetup);
          restoredLocally = true;
        }
      } catch (e) {
        console.warn('[useMatchScoring] Local snapshot restore failed:', e);
      }

      if (cancelled) return;

      // --- Step 2: full API hydration for authoritative server data ---
      // Show loading only when there was no local data to display.
      if (!restoredLocally) setIsHydrating(true);
      setHydrationError(null);

      try {
        const result = await hydrateMatchState(activeMatchId);
        if (!cancelled) {
          setIsHydrating(false);
          if (!result?.success && !restoredLocally) {
            setHydrationError(result?.error || 'Failed to load match data');
          }
        }
      } catch (e) {
        if (!cancelled) {
          setIsHydrating(false);
          if (!restoredLocally) {
            setHydrationError(e?.message || 'Failed to load match data');
          }
        }
      }
    })();

    return () => { cancelled = true; };
  }, [activeMatchId]);

  // Retry hydration (exposed to UI for the "Retry" button and online recovery)
  const retryHydration = useCallback(async () => {
    if (!activeMatchId) return;
    setIsHydrating(true);
    setHydrationError(null);
    try {
      const result = await hydrateMatchState(activeMatchId);
      setIsHydrating(false);
      if (!result?.success) {
        setHydrationError(result?.error || 'Retry failed');
      }
    } catch (e) {
      setIsHydrating(false);
      setHydrationError(e?.message || 'Retry failed');
    }
  }, [activeMatchId]);

  // Auto-retry when connectivity is restored after a hydration failure
  useEffect(() => {
    if (!hydrationError || !activeMatchId) return;
    const handleOnline = () => retryHydration();
    window.addEventListener('online', handleOnline);
    return () => window.removeEventListener('online', handleOnline);
  }, [hydrationError, activeMatchId, retryHydration]);

  const prevMatchForResolve = useRef(activeMatchId);
  useEffect(() => {
    // Only clear innings IDs when the active match changes. When innings
    // changes within the same match (e.g. snapshot restore setting innings=2),
    // keep the existing IDs until resolveInningsId provides new ones — clearing
    // them would briefly null out the correct values the restore just set.
    if (prevMatchForResolve.current !== activeMatchId) {
      prevMatchForResolve.current = activeMatchId;
      setCurrentInningsId(null);
      setCurrentBattingTeamId(null);
      setCurrentBowlingTeamId(null);
    }
    if (activeMatchId) {
      resolveInningsId(activeMatchId, innings);
    }
  }, [activeMatchId, innings]);

  useEffect(() => {
    const activeMatch = matches?.find(m => m.id === activeMatchId);
    if (activeMatch) {
      if (['COMPLETED', 'ABANDONED', 'CANCELLED'].includes(activeMatch.status)) {
        setMatchStatus(activeMatch.status);
      }
      const effectiveOvers = activeMatch.max_overs || activeMatch.overs || parseOversFromFormat(activeMatch.match_format, null);
      if (effectiveOvers) {
        setTotalMatchOvers(effectiveOvers);
      }
    }
  }, [activeMatchId, matches]);

  useEffect(() => {
    if (matchSetup?.totalOvers) {
      setTotalMatchOvers(matchSetup.totalOvers);
    }
  }, [matchSetup?.totalOvers]);

  const latestDeliveryLogRef = useRef([]);
  useEffect(() => {
    latestDeliveryLogRef.current = deliveryLog;
  }, [deliveryLog]);

  // (Removed) A listener for a `jdca-realtime-delivery` window event used to live
  // here, but nothing ever dispatched that event, so it was dead code. Cross-user
  // live VIEWING is handled by LiveSubscriptionManager + getMatchScorecard in the
  // viewer screens (HomeScreen / MatchDetailScreen). Auto-rehydrating the active
  // SCORER'S screen on every remote change is intentionally avoided, since it can
  // clobber in-progress local entry.

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
    setCurrentBattingTeamId(null);
    setCurrentBowlingTeamId(null);
    inningsSeqRef.current = {};
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
    return calculateProjectedScore(runs, balls, totalMatchOvers || matchSetup?.totalOvers || 20);
  };

  // Switch striker manually
  const toggleStriker = () => {
    const temp = striker;
    setStriker(nonStriker);
    setNonStriker(temp);
    if (activeMatchId) {
      try {
        if (nonStriker) localStorage.setItem(`jdca-striker-${activeMatchId}`, JSON.stringify(nonStriker));
        else localStorage.removeItem(`jdca-striker-${activeMatchId}`);
        if (temp) localStorage.setItem(`jdca-nonstriker-${activeMatchId}`, JSON.stringify(temp));
        else localStorage.removeItem(`jdca-nonstriker-${activeMatchId}`);
      } catch {}
    }
  };

  // Helper to snapshot current state for deterministic Undo
  const captureSnapshot = () => {
    let battingTId = matchSetup?.teamAId;
    let bowlingTId = matchSetup?.teamBId;

    // Prefer the authoritative innings record (set by resolveInningsId) when we
    // have it — this is what makes the 2nd innings reliable. Fall back to the
    // toss-based derivation only when the innings hasn't resolved yet.
    if (currentBattingTeamId && currentBowlingTeamId &&
        (currentBattingTeamId === matchSetup?.teamAId || currentBattingTeamId === matchSetup?.teamBId)) {
      battingTId = currentBattingTeamId;
      bowlingTId = currentBowlingTeamId;
    } else {
      if (matchSetup?.tossWinnerTeamId) {
        const isBat = String(matchSetup.electedTo || '').toUpperCase() === 'BAT';
        if (matchSetup.tossWinnerTeamId === matchSetup?.teamAId) {
          battingTId = isBat ? matchSetup?.teamAId : matchSetup?.teamBId;
          bowlingTId = isBat ? matchSetup?.teamBId : matchSetup?.teamAId;
        } else {
          battingTId = isBat ? matchSetup?.teamBId : matchSetup?.teamAId;
          bowlingTId = isBat ? matchSetup?.teamAId : matchSetup?.teamBId;
        }
      }

      if (innings === 2 || innings === 3) {
        const temp = battingTId;
        battingTId = bowlingTId;
        bowlingTId = temp;
      }
    }

    const isTeamABatting = battingTId === matchSetup?.teamAId;
    const battingTeamXI = isTeamABatting ? matchSetup?.teamAXI : matchSetup?.teamBXI;
    const bowlingTeamXI = isTeamABatting ? matchSetup?.teamBXI : matchSetup?.teamAXI;

    return {
      runs,
      wickets,
      balls,
      currentOverBalls: [...currentOverBalls],
      striker: striker ? { ...striker } : null,
      nonStriker: nonStriker ? { ...nonStriker } : null,
      currentBowler: currentBowler ? { ...currentBowler } : null,
      extras: { ...extras },
      isFreeHit,
      innings,
      totalMatchOvers: totalMatchOvers || matchSetup?.totalOvers || 20,
      matchStatus,
      scorecard: JSON.parse(JSON.stringify(scorecard)),
      lastOverBowlerId,
      battingTeamXI,
      bowlingTeamXI,
      battingTeamId: battingTId,
      pendingPenalties: scorecard?.pendingPenalties || {},
      target
    };
  };

  const saveMatchSnapshot = async (stateOverrides = {}) => {
    if (!activeMatchId) return;
    try {
      const { db } = await import('../lib/db.js');
      const s = stateOverrides;
      await db.match_state.put({
        id: activeMatchId,
        matchSetup: matchSetup ? JSON.parse(JSON.stringify(matchSetup)) : null,
        innings: s.innings ?? innings,
        currentInningsId: s.currentInningsId ?? currentInningsId,
        currentBattingTeamId: s.currentBattingTeamId ?? currentBattingTeamId,
        currentBowlingTeamId: s.currentBowlingTeamId ?? currentBowlingTeamId,
        runs: s.runs ?? runs,
        wickets: s.wickets ?? wickets,
        balls: s.balls ?? balls,
        target: s.target ?? target,
        striker: s.striker !== undefined ? s.striker : (striker ? { ...striker } : null),
        nonStriker: s.nonStriker !== undefined ? s.nonStriker : (nonStriker ? { ...nonStriker } : null),
        currentBowler: s.currentBowler !== undefined ? s.currentBowler : (currentBowler ? { ...currentBowler } : null),
        deliveryLog: s.deliveryLog ?? (deliveryLog ? [...deliveryLog] : []),
        currentOverBalls: s.currentOverBalls ?? (currentOverBalls ? [...currentOverBalls] : []),
        extras: s.extras ?? { ...extras },
        isFreeHit: s.isFreeHit ?? isFreeHit,
        matchStatus: s.matchStatus ?? matchStatus,
        isPaused: s.isPaused ?? isPaused,
        scorecard: s.scorecard ?? (scorecard ? JSON.parse(JSON.stringify(scorecard)) : null),
        lastOverBowlerId: s.lastOverBowlerId !== undefined ? s.lastOverBowlerId : lastOverBowlerId,
        totalMatchOvers: s.totalMatchOvers ?? totalMatchOvers,
        inningsSeqCounters: { ...inningsSeqRef.current },
        updatedAt: Date.now()
      });
    } catch (e) {
      console.warn('[useMatchScoring] Failed to save match snapshot:', e);
    }
  };

  // Broadcast Live Score Updates across all tabs and devices
  const broadcastLiveScore = (overrides = {}) => {
    if (!activeMatchId) return;
    const currentRuns = overrides.runs !== undefined ? overrides.runs : runs;
    const currentWickets = overrides.wickets !== undefined ? overrides.wickets : wickets;
    const currentBalls = overrides.balls !== undefined ? overrides.balls : balls;
    const currentInn = overrides.innings !== undefined ? overrides.innings : innings;
    const currentBatId = overrides.battingTeamId || currentBattingTeamId;

    const oversStr = `${Math.floor(currentBalls / 6)}.${currentBalls % 6}`;
    const scoreStr = `${currentRuns}/${currentWickets}`;

    if (setMatches) {
      setMatches(prev => prev.map(m => {
        if (m.id !== activeMatchId) return m;
        const isHomeBatting = currentBatId ? currentBatId === m.home_team_id : currentInn === 1;
        return {
          ...m,
          status: 'IN_PROGRESS',
          home_team: {
            ...(m.home_team || {}),
            ...(isHomeBatting ? { score: scoreStr, overs: oversStr } : {})
          },
          away_team: {
            ...(m.away_team || {}),
            ...(!isHomeBatting ? { score: scoreStr, overs: oversStr } : {})
          }
        };
      }));
    }

    try {
      if (typeof BroadcastChannel !== 'undefined') {
        const bc = new BroadcastChannel('jdca_match_sync');
        bc.postMessage({
          type: 'MATCH_LIVE_UPDATE',
          matchId: activeMatchId,
          status: 'IN_PROGRESS',
          scoreData: {
            home_team: { score: scoreStr, overs: oversStr },
            away_team: { score: scoreStr, overs: oversStr }
          }
        });
        bc.close();
      }
    } catch (e) {}

    // NOTE: We deliberately do NOT push a Supabase broadcast of the score here.
    // Cross-device live updates are driven by the authoritative `deliveries`
    // postgres_changes subscription (LiveSubscriptionManager → getMatchScorecard),
    // which other viewers attach on-demand in HomeScreen / MatchDetailScreen.
    // The previous broadcast was never subscribed to and also mislabeled the
    // batting score as BOTH teams' scores, so it could only corrupt listeners.
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

    // Immediately broadcast updated live score to all screens & devices
    broadcastLiveScore(newState);

    if (activeMatchId) {
      try {
        if (newState.striker) {
          localStorage.setItem(`jdca-striker-${activeMatchId}`, JSON.stringify(newState.striker));
        } else {
          localStorage.removeItem(`jdca-striker-${activeMatchId}`);
        }
        if (newState.nonStriker) {
          localStorage.setItem(`jdca-nonstriker-${activeMatchId}`, JSON.stringify(newState.nonStriker));
        } else {
          localStorage.removeItem(`jdca-nonstriker-${activeMatchId}`);
        }
        if (newState.currentBowler) {
          localStorage.setItem(`jdca-bowler-${activeMatchId}`, JSON.stringify(newState.currentBowler));
        }
      } catch (e) {}
    }

    saveMatchSnapshot(newState);

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
        
        const isSuperOverFinal = (newState.innings || innings) >= 4;
        const superOverSuffix = isSuperOverFinal ? ' (Super Over)' : '';

        if (newState.target && newState.runs >= newState.target) {
          // Chasing team won
          winnerId = battingTId;
          if (isSuperOverFinal) {
            margin = 'Super Over';
            text = `${battingName} won the Super Over`;
          } else {
            const wktsLeft = 10 - newState.wickets;
            margin = `${wktsLeft} wickets`;
            text = `${battingName} won by ${wktsLeft} wicket${wktsLeft !== 1 ? 's' : ''}`;
          }
        } else if (newState.runs < firstInningsScore) {
          // Defending team won (chasing team bowled out or overs done without reaching target)
          winnerId = bowlingTId;
          const runsDiff = firstInningsScore - newState.runs;
          if (isSuperOverFinal) {
            margin = 'Super Over';
            text = `${bowlingName} won the Super Over by ${runsDiff} run${runsDiff !== 1 ? 's' : ''}`;
          } else {
            margin = `${runsDiff} runs`;
            text = `${bowlingName} won by ${runsDiff} run${runsDiff !== 1 ? 's' : ''}`;
          }
        } else {
          // Scores level = Tie. In a Super Over this means another Super Over
          // is required; in a normal match the match is tied.
          winnerId = null;
          margin = 'Tie';
          text = isSuperOverFinal
            ? 'Super Over tied — another Super Over required'
            : 'Match tied';
        }
        if (isSuperOverFinal && text && !text.includes('Super Over')) text += superOverSuffix;
        
        api.updateMatchDetails(activeMatchId, { 
          winner_team_id: winnerId, 
          result_margin: margin, 
          result_text: text 
        }).then(() => {
          setMatches(prev => prev.map(m => m.id === activeMatchId ? {
            ...m,
            winner_team_id: winnerId,
            result_margin: margin,
            result_text: text
          } : m));
        }).catch(console.error);
      } catch (e) {
        console.error('[useMatchScoring] Match finalization error:', e);
      }
      setTimeout(() => navigateTo('match-result'), 600);

      // Match is done — clean up the offline snapshot so it doesn't resurrect a finished match
      if (activeMatchId) {
        import('../lib/db.js').then(({ db }) => db.match_state.delete(activeMatchId)).catch(() => {});
      }
    }

    return true;
  };

  const recordDeliveryEvent = async (event, snapshot = null) => {
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

    // Non-ball events (penalties, retirements) ARE persisted, but as their own
    // event_type so the DB views/scorecard never count them as physical balls.
    // Exception: a penalty awarded to the team that is NOT currently batting
    // cannot be attributed to this innings, so it is marked syncToServer:false
    // and kept in local state only until that team bats.
    const isNonBallEvent =
      event.eventType === 'PENALTY' ||
      event.type === 'retire' ||
      event.dismissalType === 'Retired Hurt' ||
      event.dismissalType === 'Retired Out';

    if (isNonBallEvent && event.syncToServer === false) {
      const localEntry = {
        id: eventId,
        timestamp: new Date().toISOString(),
        matchId: activeMatchId,
        innings,
        localOnly: true,
        ...event,
      };
      setDeliveryLog((prev) => [...prev, localEntry]);
      return;
    }

    // Assign the per-innings sequence SYNCHRONOUSLY, before any await, so two
    // rapid taps can never read the same stale value and collide.
    const deliverySequence = (inningsSeqRef.current[innings] || 0) + 1;
    inningsSeqRef.current[innings] = deliverySequence;

    // Ensure inningsId is always populated with the actual innings UUID for activeMatchId
    let resolvedInningsId = currentInningsId;
    if (activeMatchId) {
      const matchInningsId = await resolveInningsId(activeMatchId, innings);
      if (matchInningsId) {
        resolvedInningsId = matchInningsId;
      }
    }

    // Use immutable snapshot players from the exact moment of delivery
    const activeStriker = snapshot?.striker || striker;
    const activeNonStriker = snapshot?.nonStriker || nonStriker;
    const activeBowler = snapshot?.currentBowler || currentBowler;
    const activeBalls = Number.isFinite(snapshot?.balls) ? snapshot.balls : balls;

    const payloadRaw = {
      id: eventId,
      timestamp: new Date().toISOString(),
      matchId: activeMatchId,
      inningsId: resolvedInningsId || null,
      innings,
      deliverySequence,
      over: formatOvers(activeBalls),
      balls: activeBalls,
      strikerId: event.strikerId || activeStriker?.id || null,
      striker: event.striker || activeStriker?.name || 'Striker',
      nonStrikerId: event.nonStrikerId || activeNonStriker?.id || null,
      nonStriker: event.nonStriker || activeNonStriker?.name || 'Non-Striker',
      bowlerId: event.bowlerId || activeBowler?.id || null,
      bowler: event.bowler || activeBowler?.name || 'Bowler',
      dismissedPlayerId: event.dismissedPlayerId || event.outPlayerId || (event.wicket ? (activeStriker?.id || null) : null),
      ...event,
    };

    console.log(`[ScoringFlow:UI] Formed raw payload for delivery:`, payloadRaw);

    const payload = normalizeDelivery(payloadRaw);
    console.log(`[ScoringFlow:UI] Normalized payload for queueing:`, payload);

    // Update local React state array
    setDeliveryLog((prev) => [...prev, payload]);

    try {
      // 1. Save to local Dexie cache.
      // Persist the FLAT snake_case columns (not just the blob) so the offline
      // rebuilders — hydrateMatchState's merge loop and api.getMatchScorecard's
      // aggregator — read real numbers. Storing only payload_blob made every
      // d.runs_total undefined on an offline/timeout rebuild → NaN scores.
      const { db } = await import('../lib/db.js');
      await db.deliveries.put({
        id: payload.id,
        idempotency_key: payload.id,
        match_id: payload.matchId,
        innings_id: payload.inningsId,
        innings_number: payload.innings ?? null,
        delivery_sequence: payload.deliverySequence ?? null,
        over_number: Math.floor((payload.balls || 0) / 6),
        ball_number: ((payload.balls || 0) % 6) + 1,
        striker_id: payload.strikerId ?? null,
        non_striker_id: payload.nonStrikerId ?? null,
        bowler_id: payload.bowlerId ?? null,
        runs_off_bat: payload.runsBatter ?? 0,
        runs_extras: payload.runsExtras ?? 0,
        runs_total: payload.runsTotal ?? 0,
        extra_type: payload.extraType ?? 'NONE',
        wicket_type: payload.wicketType ?? 'NONE',
        dismissed_player_id: payload.dismissedPlayerId ?? null,
        fielder_id: payload.fielderId ?? null,
        wicketkeeper_id: payload.wicketkeeperId ?? null,
        is_legal_delivery: payload.isLegalDelivery ?? true,
        event_type: payload.eventType === 'PENALTY'
          ? 'PENALTY'
          : (['RETIRED_HURT', 'RETIRED_OUT'].includes(payload.wicketType) ? 'RETIREMENT' : 'DELIVERY'),
        payload_blob: payload // Stash full payload for UI viewing if needed offline
      });

      // 2. Queue for Sync to Supabase
      if (!payload.inningsId) {
        console.warn(`[ScoringFlow:Sync] Innings ID missing for match ${activeMatchId}. Queuing delivery for retry.`);
        await queueOfflineAction('RECORD_DELIVERY', payload);
      } else {
        console.log(`[ScoringFlow:Sync] Handing over normalized payload to SyncService...`, { id: payload.id, inningsId: payload.inningsId });
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
    broadcastLiveScore({ runs: 0, wickets: 0, balls: 0, status: 'IN_PROGRESS' });

    // Eagerly resolve & cache innings in Supabase and Dexie
    if (activeMatchId) {
      resolveInningsId(activeMatchId, innings).catch(err => {
        console.warn('[useMatchScoring] Eager innings resolution non-fatal warning:', err);
      });
    }

    // Update match status in database so all other viewers see the match LIVE
    if (activeMatchId && supabase) {
      (async () => {
        const maxAttempts = 3;
        for (let attempt = 1; attempt <= maxAttempts; attempt++) {
          try {
            const { error } = await supabase.from('matches').update({ status: 'IN_PROGRESS' }).eq('id', activeMatchId);
            if (!error) {
              setMatches(prev => prev.map(m => m.id === activeMatchId ? { ...m, status: 'IN_PROGRESS' } : m));
              return;
            }
            console.warn(`[useMatchScoring] Match status update attempt ${attempt}/${maxAttempts} failed:`, error.message);
          } catch (err) {
            console.warn(`[useMatchScoring] Match status update attempt ${attempt}/${maxAttempts} error:`, err);
          }
          if (attempt < maxAttempts) await new Promise(r => setTimeout(r, 1000 * attempt));
        }
        setMatches(prev => prev.map(m => m.id === activeMatchId ? { ...m, status: 'IN_PROGRESS' } : m));
      })();
    }
  };

  const startNextInnings = (targetRuns, nextInningsNum) => {
    setTarget(targetRuns);
    if (activeMatchId && targetRuns) {
      try { localStorage.setItem(`jdca-target-${activeMatchId}`, targetRuns); } catch {}
      // Persist to the DB innings row so another device / a browser refresh
      // on a cleared cache still sees the correct target.
      (async () => {
        try {
          const inningsId = await resolveInningsId(activeMatchId, nextInningsNum);
          if (inningsId && supabase) {
            await supabase.from('innings').update({ target_runs: targetRuns }).eq('id', inningsId);
          }
        } catch (err) {
          console.warn('[useMatchScoring] Could not persist target_runs to DB (keeping localStorage fallback):', err);
        }
      })();
    }
    setInnings(nextInningsNum);
    setCurrentInningsId(null);
    // Clear the resolved batting/bowling team so the next innings re-resolves
    // authoritatively from its own innings record (effect on [innings] change).
    setCurrentBattingTeamId(null);
    setCurrentBowlingTeamId(null);
    // Fresh innings => sequence starts over at 1 for this innings number.
    inningsSeqRef.current[nextInningsNum] = 0;
    setRuns(0);
    setWickets(0);
    setBalls(0);
    setCurrentOverBalls([]);
    setStriker(null);
    setNonStriker(null);
    setCurrentBowler(null);
    setLastOverBowlerId(null);

    // Clear stale openers from localStorage to prevent cross-innings pollution
    if (activeMatchId) {
      try {
        localStorage.removeItem(`jdca-striker-${activeMatchId}`);
        localStorage.removeItem(`jdca-nonstriker-${activeMatchId}`);
        localStorage.removeItem(`jdca-bowler-${activeMatchId}`);
      } catch {}
    }

    saveMatchSnapshot({
      innings: nextInningsNum,
      currentInningsId: null,
      currentBattingTeamId: null,
      currentBowlingTeamId: null,
      runs: 0, wickets: 0, balls: 0,
      target: targetRuns,
      striker: null, nonStriker: null, currentBowler: null,
      lastOverBowlerId: null,
      currentOverBalls: [],
      deliveryLog: [],
    });
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
      saveMatchSnapshot({ striker: newState });
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
      saveMatchSnapshot({ striker: newBatter });
    } else {
      setNonStriker(newBatter);
      if (activeMatchId) localStorage.setItem(`jdca-nonstriker-${activeMatchId}`, JSON.stringify(newBatter));
      saveMatchSnapshot({ nonStriker: newBatter });
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
    saveMatchSnapshot({ currentBowler: newState });
  };

  const handleRetireBatter = (isStriker, isRetiredOut) => {
    if (isStriker && !striker) return;
    if (!isStriker && !nonStriker) return;
    const retiree = isStriker ? striker : nonStriker;
    const outId = retiree?.id || null;
    const outName = retiree?.name || retiree?.full_name;
    const dismissalType = isRetiredOut ? 'Retired Out' : 'Retired Hurt';

    setBallHistory((prev) => [...prev, captureSnapshot()]);

    // Shared identity fields so the RETIREMENT row records WHO retired.
    const ids = {
      dismissedPlayerId: outId,
      outPlayerId: outId,
      outPlayerName: outName,
      strikerId: striker?.id || null,
      nonStrikerId: nonStriker?.id || null,
      bowlerId: currentBowler?.id || null,
      runsBatter: 0,
      runsExtras: 0,
      runsTotal: 0,
      totalRuns: 0,
    };

    if (isRetiredOut) {
      setWickets((prev) => prev + 1);
      recordDeliveryEvent({ type: 'wicket', wicket: true, dismissalType, ...ids, label: 'W' });
    } else {
      recordDeliveryEvent({ type: 'retire', dismissalType, ...ids, label: 'RH' });
    }
  };

  const continueAfterOver = (bowler) => {
    if (!bowler) return;
    const bName = bowler.full_name || bowler.name || 'Bowler';
    setCurrentBowler((prev) => {
      // If the same bowler is selected again (returning for another spell), preserve their cumulative stats
      if (prev && prev.id === bowler.id) {
        return { ...prev };
      }
      // New bowler - start fresh
      const newBowlerState = {
        id: bowler.id,
        name: bName,
        overs: 0,
        ballsBowled: 0,
        maidens: 0,
        runs: 0,
        wickets: 0,
        economy: '0.00',
        wk: '',
      };
      if (activeMatchId) {
        try { localStorage.setItem(`jdca-bowler-${activeMatchId}`, JSON.stringify(newBowlerState)); } catch {}
      }
      return newBowlerState;
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

  const recordRuns = (runAmount, direction = selectedDirection, overthrowRuns = 0, isBoundaryOverthrow = false) => {
    if (!validateScoringState()) return;

    const currentState = captureSnapshot();
    const actualRunsCompleted = runAmount + (isBoundaryOverthrow ? 0 : overthrowRuns);
    const totalRuns = runAmount + overthrowRuns + (isBoundaryOverthrow ? 4 : 0);
    const isOverthrow = overthrowRuns > 0 || isBoundaryOverthrow;

    const result = processDelivery(currentState, {
      runsTotal: totalRuns,
      runsBatter: totalRuns,
      runsCompleted: actualRunsCompleted,
      wagonZone: direction,
      isOverthrow,
      runsOverthrow: overthrowRuns + (isBoundaryOverthrow ? 4 : 0),
    });

    const ok = applyStateResult(result);
    if (ok) {
      recordDeliveryEvent({
        type: 'run',
        runsOffBat: totalRuns,
        totalRuns: totalRuns,
        label: isOverthrow ? `${totalRuns} (OT)` : String(totalRuns),
        wagonZone: direction,
        strikerId: currentState.striker.id,
        striker: currentState.striker.name,
        nonStrikerId: currentState.nonStriker.id,
        nonStriker: currentState.nonStriker.name,
        bowlerId: currentState.currentBowler.id,
        bowler: currentState.currentBowler.name,
        isOverthrow,
        runsOverthrow: overthrowRuns + (isBoundaryOverthrow ? 4 : 0)
      }, currentState);
    }
    if (ok && runAmount === 6) {
      confetti({
        particleCount: 40,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#A3E635', '#F97316', '#FFFFFF']
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
        label: extraLabel,
        strikerId: currentState.striker.id,
        striker: currentState.striker.name,
        nonStrikerId: currentState.nonStriker.id,
        nonStriker: currentState.nonStriker.name,
        bowlerId: currentState.currentBowler.id,
        bowler: currentState.currentBowler.name,
      }, currentState);
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
      // Only persist to this innings when the batting side receives the runs.
      // A penalty against the batting side (awarded to the fielding team) is
      // held locally until that team bats (can't attribute to this innings).
      const isBattingRecipient = !!currentState.battingTeamId && currentState.battingTeamId === recipientTeamId;
      recordDeliveryEvent({
        eventType: 'PENALTY',
        extraType: 'PENALTY',
        recipientTeamId,
        penaltyRuns,
        reasonCode,
        runsBatter: 0,
        runsExtras: penaltyRuns,
        runsTotal: penaltyRuns,
        isLegalDelivery: false,
        syncToServer: isBattingRecipient,
        label: `+${penaltyRuns} Pen`
      }, currentState);
    }
  };

  // 3. Record Wicket / Dismissal (Bowled, Caught, LBW, Run Out, Stumped, etc.)
  const recordWicket = (dismissalType, outPlayerId = null, fielder = '', wicketkeeper = '', runsCompleted = 0) => {
    if (!validateScoringState()) return;

    const currentState = captureSnapshot();

    const actualDismissedId = outPlayerId || (dismissalType !== 'Run Out' ? currentState.striker?.id : null);
    const finalOutName = (actualDismissedId === currentState.striker?.id) ? currentState.striker?.name : 
                         (actualDismissedId === currentState.nonStriker?.id) ? currentState.nonStriker?.name : 
                         (dismissalType !== 'Run Out' ? currentState.striker?.name : null);

    const result = processDelivery(currentState, {
      type: 'wicket',
      dismissalType,
      dismissedPlayerId: actualDismissedId,
      outPlayerName: finalOutName,
      fielderName: fielder,
      wicketkeeperName: wicketkeeper,
      runsBatter: runsCompleted,
      runsCompleted: runsCompleted
    });

    const ok = applyStateResult(result);
    if (ok) {
      recordDeliveryEvent({
        type: 'wicket',
        wicket: true,
        dismissalType,
        dismissedPlayerId: actualDismissedId,
        outPlayerId: actualDismissedId,
        outPlayerName: finalOutName,
        fielderName: fielder,
        wicketkeeperName: wicketkeeper,
        runsBatter: runsCompleted,
        runsCompleted,
        label: 'W',
        strikerId: currentState.striker.id,
        striker: currentState.striker.name,
        nonStrikerId: currentState.nonStriker.id,
        nonStriker: currentState.nonStriker.name,
        bowlerId: currentState.currentBowler.id,
        bowler: currentState.currentBowler.name,
      }, currentState);
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

    // Local-only events (penalties, retirements) never reached the server, so
    // just revert local state — no queue action and no database call.
    if (undoneDelivery.localOnly) {
      const prev = ballHistory[ballHistory.length - 1];
      if (prev) {
        setRuns(prev.runs);
        setWickets(prev.wickets);
        setBalls(prev.balls);
        setCurrentOverBalls(prev.currentOverBalls);
        setStriker(prev.striker);
        setNonStriker(prev.nonStriker);
        setCurrentBowler(prev.currentBowler);
        setExtras(prev.extras);
        setIsFreeHit(prev.isFreeHit);
        setInnings(prev.innings);
        setMatchStatus(prev.matchStatus || 'IN_PROGRESS');
        setLastOverBowlerId(prev.lastOverBowlerId || null);
        if (prev.scorecard) setScorecard(prev.scorecard);
      }
      setDeliveryLog((p) => p.slice(0, -1));
      setBallHistory((p) => p.slice(0, -1));
      setValidationError(null);
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

    // Persist the undo safely with respect to sync-queue ordering.
    try {
      const { db } = await import('../lib/db.js');
      if (db.deliveries) {
        await db.deliveries.where('id').equals(undoneDelivery.id).delete();
      }

      // If this ball's INSERT is still pending in the queue and nothing is
      // currently draining it, cancel the insert instead of racing a DELETE
      // against it (which would otherwise resurrect the ball as a ghost row).
      let cancelledPendingInsert = false;
      if (db.sync_queue && !syncService.syncInProgress) {
        const pendingInserts = await db.sync_queue.where('action').equals('RECORD_DELIVERY').toArray();
        const row = pendingInserts.find(a => a.payload?.id === undoneDelivery.id && a.status !== 'FAILED_PERMANENT');
        if (row) {
          await db.sync_queue.delete(row.id);
          cancelledPendingInsert = true;
          await syncService.updatePendingCount();
        }
      }

      if (!cancelledPendingInsert) {
        // Already synced (or mid-flight): enqueue a DELETE. The single FIFO
        // queue drainer runs it only after the matching INSERT has completed.
        const undoPayload = {
          id: undoneDelivery.id,
          matchId: undoneDelivery.matchId,
          inningsId: undoneDelivery.inningsId
        };
        await syncService.executeOrQueue('UNDO_DELIVERY', undoPayload, queueOfflineAction);
      }
    } catch (err) {
      console.error('[useMatchScoring] Failed to persist undo:', err);
    }

    saveMatchSnapshot(previousState);
  };

  const applyRevisedOvers = async (revisedOvers, revisedTarget = null) => {
    setMatchSetup(prev => ({ ...prev, maxOvers: revisedOvers, totalOvers: revisedOvers }));
    setTotalMatchOvers(revisedOvers);

    if (revisedTarget !== null && revisedTarget > 0) {
      setTarget(revisedTarget);
    }

    try {
      await api.updateMatchDetails(activeMatchId, { max_overs: revisedOvers });

      if (currentInningsId && supabase) {
        const inningsUpdate = { overs_limit: revisedOvers };
        if (revisedTarget !== null && revisedTarget > 0) {
          inningsUpdate.target_runs = revisedTarget;
        }
        await supabase.from('innings').update(inningsUpdate).eq('id', currentInningsId);

        try {
          const { db } = await import('../lib/db.js');
          if (db.innings) {
            await db.innings.update(currentInningsId, inningsUpdate);
          }
        } catch (e) {}
      }
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

  const endMatchEarly = async ({ winnerId, margin, resultText }) => {
    try {
      await api.endMatchEarly(activeMatchId, winnerId, margin, resultText);
      setMatchStatus('COMPLETED');
      setTimeout(() => navigateTo('match-result'), 400);
    } catch (err) {
      console.error('[useMatchScoring] endMatchEarly failed:', err);
      throw err;
    }
  };

  return {
    matchSetup, setMatchSetup,
    innings, setInnings,
    currentInningsId, setCurrentInningsId,
    currentBattingTeamId, currentBowlingTeamId,
    target, setTarget,
    isHydrating, setIsHydrating,
    hydrationError, setHydrationError,
    retryHydration,
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
    endMatchEarly,
    MATCH_STATES
  };
}
