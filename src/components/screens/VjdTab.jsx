import React, { useState, useMemo, useEffect } from 'react';
import {
  Calculator, Clock, CloudRain, Share2, Copy, CheckCircle2,
  AlertTriangle, RefreshCw, Trophy, Sparkles, ShieldAlert,
  ArrowLeft, Info, Check, ChevronDown
} from 'lucide-react';
import { calculateRevisedTarget, calculateParScoreAtPoint, formatVJDResult } from '../../engine/vjdMethod';
import { shareVjdCardImage } from '../../lib/share';
import { formatOvers } from '../../engine/cricketStateMachine';

/**
 * Dedicated VJD (V. Jayadevan) Method & Time-Based Calculation Tab for Scoring Screen.
 *
 * Implements official BCCI/MPCA Playing Conditions:
 * 1. Time-Loss & Over-Reduction calculation based on match format & gender.
 * 2. VJD resource calculations for revised target and live Par score.
 * 3. Direct application of revised overs & targets into the active match session.
 * 4. Official branded PNG card sharing & copyable text report.
 * 5. Rain-affected early conclusion / result determination (min 5 ov T20 / 20 ov ODI).
 */
export default function VjdTab({
  activeMatch,
  tournament,
  matchSetup,
  innings = 1,
  currentRuns = 0,
  currentWickets = 0,
  currentBalls = 0,
  target = null,
  totalMatchOvers = 20,
  onApplyRevisedOvers,
  onEndMatchEarly,
  onBackToConsole,
}) {
  // ── Match & Format Context ──────────────────────────────────────────────
  const isFirstInnings = innings === 1 || innings === 3;
  const teamAName = matchSetup?.teamA || activeMatch?.home_team?.name || 'Team A';
  const teamBName = matchSetup?.teamB || activeMatch?.away_team?.name || 'Team B';

  // In 2nd innings, Team 1 batted first; Team 2 is currently chasing
  const team1DefaultName = isFirstInnings ? teamAName : teamBName;
  const team2DefaultName = isFirstInnings ? teamBName : teamAName;

  const rawFormat = tournament?.format || activeMatch?.match_format || 'T20';
  const isODI = rawFormat.toLowerCase().includes('odi') || rawFormat.toLowerCase().includes('one day') || rawFormat.includes('50');
  const [selectedFormat, setSelectedFormat] = useState(isODI ? 'ODI' : 'T20');
  const [gender, setGender] = useState(tournament?.gender === 'Women' ? 'Women' : 'Men');

  const maxOriginalOvers = totalMatchOvers || activeMatch?.max_overs || (selectedFormat === 'ODI' ? 50 : 20);

  // ── Calculation Mode & Sub-Tabs ─────────────────────────────────────────
  const [activeSubTab, setActiveSubTab] = useState('vjd'); // 'vjd' | 'time' | 'end_match'

  // ── Team 1 Inputs ───────────────────────────────────────────────────────
  // If in 2nd innings and target exists, Team 1 scored target - 1
  const inferredT1Score = !isFirstInnings && target && target > 0 ? (target - 1) : 150;
  const [team1Name, setTeam1Name] = useState(team1DefaultName);
  const [team1Score, setTeam1Score] = useState(String(inferredT1Score));
  const [team1Overs, setTeam1Overs] = useState(String(maxOriginalOvers));
  const [team1Wickets, setTeam1Wickets] = useState('10');

  // ── Team 2 Inputs ───────────────────────────────────────────────────────
  const [team2Name, setTeam2Name] = useState(team2DefaultName);
  const [revisedOversInput, setRevisedOversInput] = useState('');
  const [team2WicketsInHand, setTeam2WicketsInHand] = useState('10');

  // ── Time-Loss Inputs (MPCA Rules) ───────────────────────────────────────
  const [timeLossMode, setTimeLossMode] = useState(isFirstInnings ? 'first_innings' : 'second_innings');
  const [totalTimeLost, setTotalTimeLost] = useState(0);
  const [extraTime, setExtraTime] = useState(0);
  const [intervalMadeUp, setIntervalMadeUp] = useState(0);

  // Status flags
  const [appliedSuccess, setAppliedSuccess] = useState(false);
  const [copiedSuccess, setCopiedSuccess] = useState(false);
  const [sharing, setSharing] = useState(false);

  // ── Rates according to MPCA Playing Conditions ──────────────────────────
  // T20: Men 4.25 mins/over (170 mins total) | Women 3.75 mins/over (150 mins total)
  // ODI: Men 4.20 mins/over (420 mins total) | Women 3.80 mins/over (380 mins total)
  const isMen = gender === 'Men';
  const minsPerOver = selectedFormat === 'T20'
    ? (isMen ? 4.25 : 3.75)
    : (isMen ? 4.20 : 3.80);
  const startNetPlayingTime = selectedFormat === 'T20'
    ? (isMen ? 170 : 150)
    : (isMen ? 420 : 380);

  // ── Time-Loss Derivation ────────────────────────────────────────────────
  const timeCalculation = useMemo(() => {
    const effectiveTimeLost = Math.max(0, (Number(totalTimeLost) || 0) - (Number(extraTime) || 0) - (Number(intervalMadeUp) || 0));

    if (timeLossMode === 'first_innings') {
      // Both innings reduced equally
      const remainingTime = Math.max(0, startNetPlayingTime - effectiveTimeLost);
      const totalOversBothTeams = remainingTime / minsPerOver;
      const maxOversPerTeam = Math.max(0, Math.min(maxOriginalOvers, Math.ceil(totalOversBothTeams / 2)));
      const oversLostPerTeam = Math.max(0, maxOriginalOvers - maxOversPerTeam);
      const maxOversPerBowler = Math.floor(maxOversPerTeam / 5);
      return {
        effectiveTimeLost,
        oversLost: oversLostPerTeam,
        revisedOvers: maxOversPerTeam,
        maxOversPerBowler,
      };
    } else {
      // 2nd innings interruption only
      const oversLost = Math.floor(effectiveTimeLost / minsPerOver);
      const revisedOvers = Math.max(0, maxOriginalOvers - oversLost);
      const maxOversPerBowler = Math.floor(revisedOvers / 5);
      return {
        effectiveTimeLost,
        oversLost,
        revisedOvers,
        maxOversPerBowler,
      };
    }
  }, [totalTimeLost, extraTime, intervalMadeUp, timeLossMode, startNetPlayingTime, minsPerOver, maxOriginalOvers]);

  // Sync derived overs from time calculation when user clicks "Use Derived Overs"
  const handleUseTimeDerivedOvers = () => {
    if (timeCalculation && timeCalculation.revisedOvers > 0) {
      setRevisedOversInput(String(timeCalculation.revisedOvers));
      setActiveSubTab('vjd');
    }
  };

  // Effective revised overs for VJD calculation
  const effectiveRevisedOvers = useMemo(() => {
    const val = parseFloat(revisedOversInput);
    if (!isNaN(val) && val > 0 && val <= maxOriginalOvers) return val;
    // Fallback if time calculation has an active reduction
    if (timeCalculation && timeCalculation.effectiveTimeLost > 0 && timeCalculation.revisedOvers > 0) {
      return timeCalculation.revisedOvers;
    }
    return maxOriginalOvers;
  }, [revisedOversInput, maxOriginalOvers, timeCalculation]);

  // ── VJD Calculation Result ──────────────────────────────────────────────
  const vjdResult = useMemo(() => {
    const t1S = parseInt(team1Score, 10);
    const t1O = parseFloat(team1Overs);
    const t1W = parseInt(team1Wickets, 10);
    const t2RevO = effectiveRevisedOvers;
    const t2WkInHand = parseInt(team2WicketsInHand, 10) || 10;

    if (isNaN(t1S) || isNaN(t1O) || isNaN(t1W) || isNaN(t2RevO)) return null;
    if (t1S < 0 || t1O <= 0 || t1W < 0 || t1W > 10 || t2RevO <= 0) return null;

    const calc = calculateRevisedTarget(t1S, t1O, t1W, t2RevO, t2WkInHand, maxOriginalOvers);
    return {
      ...calc,
      team1Score: t1S,
      team1Overs: t1O,
      team1Wickets: t1W,
      team2RevisedOvers: t2RevO,
      team2WicketsInHand: t2WkInHand,
      maxBowlerOvers: Math.floor(t2RevO / 5),
    };
  }, [team1Score, team1Overs, team1Wickets, effectiveRevisedOvers, team2WicketsInHand, maxOriginalOvers]);

  // ── Par Score At Current Point (Live Match In 2nd Innings) ──────────────
  const liveInterruptionState = useMemo(() => {
    if (isFirstInnings) return null;
    const t1S = parseInt(team1Score, 10) || 0;
    const t1O = parseFloat(team1Overs) || maxOriginalOvers;
    const t1W = parseInt(team1Wickets, 10) || 10;

    const t2OversCompleted = Math.floor(currentBalls / 6) + (currentBalls % 6) / 10;
    const t2Runs = currentRuns || 0;
    const t2WktsLost = currentWickets || 0;

    const parCalc = calculateParScoreAtPoint(
      t1S,
      t1O,
      t1W,
      t2OversCompleted,
      t2WktsLost,
      maxOriginalOvers
    );

    const diff = t2Runs - parCalc.parScore;
    let parStatus = 'LEVEL';
    if (diff > 0) parStatus = 'AHEAD';
    else if (diff < 0) parStatus = 'BEHIND';

    // Minimum overs for official result: T20 min 5 ov, ODI min 20 ov
    const minOversRequired = selectedFormat === 'T20' ? 5 : 20;
    const completedFullOvers = Math.floor(currentBalls / 6);
    const hasReachedMinOvers = completedFullOvers >= minOversRequired;

    return {
      ...parCalc,
      oversFaced: formatOvers(currentBalls),
      runs: t2Runs,
      wickets: t2WktsLost,
      diff,
      parStatus,
      minOversRequired,
      hasReachedMinOvers,
    };
  }, [isFirstInnings, team1Score, team1Overs, team1Wickets, currentBalls, currentRuns, currentWickets, maxOriginalOvers, selectedFormat]);

  // ── Apply to Active Match ───────────────────────────────────────────────
  const handleApplyToMatch = async () => {
    if (!vjdResult) return;
    try {
      await onApplyRevisedOvers(vjdResult.team2RevisedOvers, vjdResult.revisedTarget);
      setAppliedSuccess(true);
      setTimeout(() => setAppliedSuccess(false), 3000);
    } catch (err) {
      alert('Failed to apply revised overs: ' + (err?.message || err));
    }
  };

  // ── Share Branded Card ──────────────────────────────────────────────────
  const handleShareCard = async () => {
    if (!vjdResult || sharing) return;
    setSharing(true);
    try {
      await shareVjdCardImage({
        team1Name,
        team1Score: vjdResult.team1Score,
        team1Wickets: vjdResult.team1Wickets,
        team1Overs: vjdResult.team1Overs,
        team2Name,
        revisedTarget: vjdResult.revisedTarget,
        revisedOvers: vjdResult.team2RevisedOvers,
        parScore: vjdResult.parScore,
        r1: vjdResult.r1,
        r2: vjdResult.r2,
        maxOvers: maxOriginalOvers,
        wicketsInHand: vjdResult.team2WicketsInHand,
      });
    } catch (err) {
      console.error('[VJD] Share card failed:', err);
    } finally {
      setSharing(false);
    }
  };

  // ── Copy VJD Summary ────────────────────────────────────────────────────
  const handleCopyText = async () => {
    if (!vjdResult) return;
    const text = formatVJDResult({
      team1Name,
      team1Score: vjdResult.team1Score,
      team1Overs: vjdResult.team1Overs,
      team1Wickets: vjdResult.team1Wickets,
      team2Name,
      revisedOvers: vjdResult.team2RevisedOvers,
      revisedTarget: vjdResult.revisedTarget,
      parScore: vjdResult.parScore,
      r1: vjdResult.r1,
      r2: vjdResult.r2,
      maxOvers: maxOriginalOvers,
    });
    try {
      await navigator.clipboard.writeText(text);
      setCopiedSuccess(true);
      setTimeout(() => setCopiedSuccess(false), 2000);
    } catch (err) {
      alert('Copying failed, please copy manually.');
    }
  };

  // ── End Match Preview & Confirmation ────────────────────────────────────
  const endMatchInfo = useMemo(() => {
    const oversPlayed = formatOvers(currentBalls || 0);
    if (isFirstInnings) {
      return {
        canDetermineWinner: false,
        resultText: `No Result — Match abandoned due to rain (${team1Name} ${currentRuns}/${currentWickets} in ${oversPlayed} ov)`,
        summary: `Match interrupted during 1st innings. Under MPCA rules, both teams must bat minimum ${selectedFormat === 'T20' ? '5' : '20'} overs for a result.`,
      };
    }

    if (!liveInterruptionState) {
      return {
        canDetermineWinner: false,
        resultText: 'Match Ended Early',
        summary: 'No result data available.',
      };
    }

    if (!liveInterruptionState.hasReachedMinOvers) {
      return {
        canDetermineWinner: false,
        resultText: `No Result — Rain wash-out before minimum overs (${liveInterruptionState.minOversRequired} ov required, only ${oversPlayed} played)`,
        summary: `${team2Name} only batted ${oversPlayed} overs. Minimum ${liveInterruptionState.minOversRequired} overs required for VJD par result.`,
      };
    }

    // Winner decided by VJD par score!
    const battingTId = matchSetup?.teamAId === activeMatch?.home_team_id
      ? matchSetup?.teamBId
      : matchSetup?.teamAId;
    const bowlingTId = matchSetup?.teamAId === activeMatch?.home_team_id
      ? matchSetup?.teamAId
      : matchSetup?.teamBId;

    if (liveInterruptionState.parStatus === 'AHEAD') {
      const margin = `${liveInterruptionState.diff} runs (VJD Method)`;
      return {
        canDetermineWinner: true,
        winnerId: battingTId,
        margin,
        resultText: `${team2Name} won by ${liveInterruptionState.diff} run${liveInterruptionState.diff !== 1 ? 's' : ''} (VJD Method)`,
        summary: `At ${oversPlayed} overs with ${liveInterruptionState.wickets} down, Par was ${liveInterruptionState.parScore}. ${team2Name} scored ${liveInterruptionState.runs}.`,
      };
    } else if (liveInterruptionState.parStatus === 'BEHIND') {
      const margin = `${Math.abs(liveInterruptionState.diff)} runs (VJD Method)`;
      return {
        canDetermineWinner: true,
        winnerId: bowlingTId,
        margin,
        resultText: `${team1Name} won by ${Math.abs(liveInterruptionState.diff)} run${Math.abs(liveInterruptionState.diff) !== 1 ? 's' : ''} (VJD Method)`,
        summary: `At ${oversPlayed} overs with ${liveInterruptionState.wickets} down, Par was ${liveInterruptionState.parScore}. ${team2Name} scored ${liveInterruptionState.runs}.`,
      };
    } else {
      return {
        canDetermineWinner: true,
        winnerId: null,
        margin: 'Tie (VJD Method)',
        resultText: `Match Tied (VJD Method) — Score equal to Par (${liveInterruptionState.parScore}) at ${oversPlayed} ov`,
        summary: `${team2Name} score of ${liveInterruptionState.runs} exactly matches the VJD Par score of ${liveInterruptionState.parScore}.`,
      };
    }
  }, [isFirstInnings, currentBalls, team1Name, currentRuns, currentWickets, selectedFormat, liveInterruptionState, matchSetup, activeMatch, team2Name]);

  return (
    <div className="w-full max-w-3xl mx-auto px-4 py-5 pb-28 text-slate-900 dark:text-slate-100 animate-fadeIn">
      {/* ── Sub-Navigation / Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <button
            onClick={onBackToConsole}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-violet-600 dark:text-violet-400 hover:text-violet-700 transition-colors mb-1.5 cursor-pointer"
          >
            <ArrowLeft size={14} /> Back to Live Scoring Console
          </button>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-violet-600 text-white flex items-center justify-center shadow-sm">
              <Calculator size={18} />
            </div>
            <div>
              <h2 className="text-xl font-black text-slate-900 dark:text-white leading-tight">
                VJD Method & Match Timing
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                Official BCCI / MPCA Playing Conditions Rain Target System
              </p>
            </div>
          </div>
        </div>

        {/* Format & Gender Switchers */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="inline-flex rounded-xl bg-slate-100 dark:bg-slate-800 p-1 border border-slate-200 dark:border-slate-700">
            <button
              onClick={() => setSelectedFormat('T20')}
              className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
                selectedFormat === 'T20'
                  ? 'bg-white dark:bg-slate-900 text-violet-600 dark:text-violet-400 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              T20 (20 ov)
            </button>
            <button
              onClick={() => setSelectedFormat('ODI')}
              className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
                selectedFormat === 'ODI'
                  ? 'bg-white dark:bg-slate-900 text-violet-600 dark:text-violet-400 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              One-Day (50 ov)
            </button>
          </div>

          <div className="inline-flex rounded-xl bg-slate-100 dark:bg-slate-800 p-1 border border-slate-200 dark:border-slate-700">
            <button
              onClick={() => setGender('Men')}
              className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all ${
                gender === 'Men'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-500'
              }`}
            >
              Men / Boys
            </button>
            <button
              onClick={() => setGender('Women')}
              className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all ${
                gender === 'Women'
                  ? 'bg-white dark:bg-slate-900 text-pink-600 dark:text-pink-400 shadow-xs'
                  : 'text-slate-500'
              }`}
            >
              Women / Girls
            </button>
          </div>
        </div>
      </div>

      {/* ── Sub-Tabs Segmented Bar ── */}
      <div className="flex gap-2 p-1 bg-slate-100 dark:bg-slate-800/80 rounded-2xl mb-6">
        <button
          onClick={() => setActiveSubTab('vjd')}
          className={`flex-1 py-2.5 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all ${
            activeSubTab === 'vjd'
              ? 'bg-white dark:bg-slate-900 text-violet-600 dark:text-violet-400 shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
          }`}
        >
          <Sparkles size={14} /> VJD Target Revision
        </button>
        <button
          onClick={() => setActiveSubTab('time')}
          className={`flex-1 py-2.5 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all ${
            activeSubTab === 'time'
              ? 'bg-white dark:bg-slate-900 text-violet-600 dark:text-violet-400 shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
          }`}
        >
          <Clock size={14} /> Time-Loss Calculator
        </button>
        <button
          onClick={() => setActiveSubTab('end_match')}
          className={`flex-1 py-2.5 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all ${
            activeSubTab === 'end_match'
              ? 'bg-red-500 text-white shadow-sm'
              : 'text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30'
          }`}
        >
          <ShieldAlert size={14} /> Match Conclusion
        </button>
      </div>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* ── SUB-TAB 1: VJD TARGET REVISION ─────────────────────────── */}
      {/* ───────────────────────────────────────────────────────────── */}
      {activeSubTab === 'vjd' && (
        <div className="space-y-6">
          {/* Live Context Banner */}
          {!isFirstInnings && liveInterruptionState && (
            <div className="p-4 rounded-2xl bg-gradient-to-r from-violet-500/10 via-indigo-500/10 to-transparent border border-violet-200 dark:border-violet-800/40">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-black uppercase tracking-wider text-violet-700 dark:text-violet-300 flex items-center gap-1.5">
                  <CloudRain size={15} /> 2nd Innings Rain Interruption Context
                </span>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-violet-100 dark:bg-violet-900/50 text-violet-700 dark:text-violet-300">
                  {liveInterruptionState.oversFaced} ov bowled
                </span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-3">
                <div className="bg-white/80 dark:bg-slate-900/60 p-2.5 rounded-xl border border-violet-100 dark:border-violet-900/30">
                  <span className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400">Current Score</span>
                  <span className="text-lg font-black text-slate-900 dark:text-white">
                    {liveInterruptionState.runs}/{liveInterruptionState.wickets}
                  </span>
                </div>
                <div className="bg-white/80 dark:bg-slate-900/60 p-2.5 rounded-xl border border-violet-100 dark:border-violet-900/30">
                  <span className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400">VJD Par Score</span>
                  <span className="text-lg font-black text-violet-700 dark:text-violet-300">
                    {liveInterruptionState.parScore}
                  </span>
                </div>
                <div className="bg-white/80 dark:bg-slate-900/60 p-2.5 rounded-xl border border-violet-100 dark:border-violet-900/30">
                  <span className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400">Par Position</span>
                  <span className={`text-sm font-black ${
                    liveInterruptionState.diff > 0
                      ? 'text-emerald-600'
                      : liveInterruptionState.diff < 0
                        ? 'text-red-500'
                        : 'text-amber-500'
                  }`}>
                    {liveInterruptionState.diff > 0
                      ? `Ahead by +${liveInterruptionState.diff}`
                      : liveInterruptionState.diff < 0
                        ? `Behind by ${liveInterruptionState.diff}`
                        : 'Level with Par'}
                  </span>
                </div>
                <div className="bg-white/80 dark:bg-slate-900/60 p-2.5 rounded-xl border border-violet-100 dark:border-violet-900/30">
                  <span className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400">Result Status</span>
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    {liveInterruptionState.hasReachedMinOvers
                      ? 'Valid Result (≥5 ov)'
                      : `Needs ${liveInterruptionState.minOversRequired} ov`}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Form: Team 1 & Team 2 Parameters */}
          <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-5">
            <div>
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-violet-600" />
                Team 1 (1st Innings Score)
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                <div className="sm:col-span-1">
                  <label className="block text-[11px] font-bold text-slate-500 mb-1">Team Name</label>
                  <input
                    type="text"
                    value={team1Name}
                    onChange={e => setTeam1Name(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2.5 text-xs font-bold focus:border-violet-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 mb-1">Runs Scored</label>
                  <input
                    type="number"
                    min="0"
                    value={team1Score}
                    onChange={e => setTeam1Score(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2.5 text-sm font-black focus:border-violet-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 mb-1">Overs Faced</label>
                  <input
                    type="number"
                    step="0.1"
                    min="1"
                    max={maxOriginalOvers}
                    value={team1Overs}
                    onChange={e => setTeam1Overs(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2.5 text-sm font-black focus:border-violet-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 mb-1">Wickets Lost</label>
                  <input
                    type="number"
                    min="0"
                    max="10"
                    value={team1Wickets}
                    onChange={e => setTeam1Wickets(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2.5 text-sm font-black focus:border-violet-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-indigo-500" />
                  Team 2 (Revised Chase Equation)
                </span>
                {timeCalculation && timeCalculation.effectiveTimeLost > 0 && (
                  <button
                    onClick={handleUseTimeDerivedOvers}
                    className="text-[11px] text-violet-600 dark:text-violet-400 hover:underline font-bold flex items-center gap-1 cursor-pointer"
                  >
                    <Clock size={12} /> Auto-fill {timeCalculation.revisedOvers} ov from Time Calc
                  </button>
                )}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 mb-1">Team Name</label>
                  <input
                    type="text"
                    value={team2Name}
                    onChange={e => setTeam2Name(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2.5 text-xs font-bold focus:border-violet-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 mb-1">
                    Revised Overs for Chase (Max: {maxOriginalOvers})
                  </label>
                  <input
                    type="number"
                    min="1"
                    max={maxOriginalOvers}
                    value={revisedOversInput}
                    onChange={e => setRevisedOversInput(e.target.value)}
                    placeholder={`e.g. 15 (default ${maxOriginalOvers})`}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2.5 text-sm font-black focus:border-violet-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 mb-1">
                    Wickets In Hand at Start
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={team2WicketsInHand}
                    onChange={e => setTeam2WicketsInHand(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2.5 text-sm font-black focus:border-violet-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* ── VJD Calculation Output Card ── */}
          {vjdResult && (
            <div className="bg-gradient-to-br from-[#1E1B4B] to-[#0F172A] text-white p-6 rounded-3xl shadow-xl border border-violet-800/40 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
                <Calculator size={180} />
              </div>

              <div className="flex items-center justify-between mb-4 relative z-10">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded-full bg-violet-500/20 text-violet-300 border border-violet-400/30 text-[10px] font-black uppercase tracking-widest">
                    VJD Method Output
                  </span>
                  <span className="text-xs text-slate-400 font-bold">
                    {selectedFormat} ({gender})
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[11px] text-slate-400 block font-medium">Original Overs</span>
                  <span className="text-xs font-black text-slate-200">{maxOriginalOvers} ov per side</span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 my-4 relative z-10">
                <div className="sm:col-span-2 flex flex-col justify-center">
                  <span className="text-xs font-extrabold uppercase tracking-widest text-violet-300 mb-1">
                    Revised Target for {team2Name}
                  </span>
                  <div className="flex items-baseline gap-3">
                    <span className="text-6xl font-black text-white tracking-tight tabular-nums">
                      {vjdResult.revisedTarget}
                    </span>
                    <span className="text-sm font-bold text-slate-300">
                      runs in <strong className="text-white text-base">{vjdResult.team2RevisedOvers} overs</strong>
                    </span>
                  </div>
                  <p className="text-xs text-violet-200/80 mt-2 font-medium">
                    Par score to tie is <strong>{vjdResult.parScore}</strong>. Max {vjdResult.maxBowlerOvers} overs per bowler.
                  </p>
                </div>

                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10 flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-wider text-slate-300 block mb-2">
                      Resource Consumption
                    </span>
                    <div className="space-y-1.5 text-xs">
                      <div className="flex justify-between">
                        <span className="text-slate-300">Team 1 Used (R1):</span>
                        <strong className="text-white">{vjdResult.r1}%</strong>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-300">Team 2 Avail (R2):</span>
                        <strong className="text-white">{vjdResult.r2}%</strong>
                      </div>
                    </div>
                  </div>
                  <div className="mt-3 pt-2 border-t border-white/10 text-[11px] text-slate-300">
                    Formula: (Runs × R2 / R1) + 1
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 border-t border-white/10 relative z-10">
                <button
                  onClick={handleApplyToMatch}
                  className="sm:col-span-1 bg-violet-600 hover:bg-violet-500 text-white font-extrabold text-xs py-3 px-4 rounded-xl shadow-md transition-all flex items-center justify-center gap-1.5 active:scale-95 cursor-pointer"
                >
                  {appliedSuccess ? (
                    <>
                      <CheckCircle2 size={16} className="text-emerald-300" />
                      <span>Target Applied!</span>
                    </>
                  ) : (
                    <>
                      <Check size={16} />
                      <span>Apply to Active Match</span>
                    </>
                  )}
                </button>

                <button
                  onClick={handleShareCard}
                  disabled={sharing}
                  className="bg-white/15 hover:bg-white/20 text-white font-bold text-xs py-3 px-4 rounded-xl transition-all flex items-center justify-center gap-1.5 active:scale-95 cursor-pointer disabled:opacity-50"
                >
                  <Share2 size={15} />
                  <span>{sharing ? 'Generating Card...' : 'Share Official Card'}</span>
                </button>

                <button
                  onClick={handleCopyText}
                  className="bg-white/10 hover:bg-white/15 text-white font-bold text-xs py-3 px-4 rounded-xl transition-all flex items-center justify-center gap-1.5 active:scale-95 cursor-pointer"
                >
                  {copiedSuccess ? (
                    <>
                      <CheckCircle2 size={15} className="text-emerald-300" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy size={15} />
                      <span>Copy Text Report</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ───────────────────────────────────────────────────────────── */}
      {/* ── SUB-TAB 2: MPCA TIME-LOSS CALCULATOR ───────────────────── */}
      {/* ───────────────────────────────────────────────────────────── */}
      {activeSubTab === 'time' && (
        <div className="space-y-6">
          {/* Rules Banner */}
          <div className="p-4 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/50 text-blue-900 dark:text-blue-200">
            <div className="flex items-center gap-2 mb-1">
              <Clock size={16} className="text-blue-600 dark:text-blue-400 shrink-0" />
              <h4 className="text-xs font-black uppercase tracking-wider">
                MPCA Playing Conditions 2025–26 Timing Constants
              </h4>
            </div>
            <p className="text-xs leading-relaxed opacity-90 mt-1">
              Format: <strong>{selectedFormat} ({gender})</strong> • Rate: <strong>{minsPerOver} mins/over</strong> • Total Net Playing Time: <strong>{startNetPlayingTime} mins</strong>.
              Overs are deducted from remaining playing time after subtracting extra allocated time and interval savings.
            </p>
          </div>

          <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-5">
            {/* Mode selection */}
            <div>
              <label className="block text-xs font-black uppercase tracking-wider text-slate-500 mb-2">
                Interruption Timing Scenario
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  onClick={() => setTimeLossMode('first_innings')}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    timeLossMode === 'first_innings'
                      ? 'border-violet-500 bg-violet-50/50 dark:bg-violet-950/30'
                      : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800'
                  }`}
                >
                  <span className="block text-xs font-black text-slate-900 dark:text-white">
                    1st Innings Delay / Rain
                  </span>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400">
                    Both innings reduced equally
                  </span>
                </button>

                <button
                  onClick={() => setTimeLossMode('second_innings')}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    timeLossMode === 'second_innings'
                      ? 'border-violet-500 bg-violet-50/50 dark:bg-violet-950/30'
                      : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800'
                  }`}
                >
                  <span className="block text-xs font-black text-slate-900 dark:text-white">
                    2nd Innings Rain Interruption
                  </span>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400">
                    Only Team 2 chase overs reduced
                  </span>
                </button>
              </div>
            </div>

            {/* Inputs */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-3 border-t border-slate-100 dark:border-slate-800">
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1 flex items-center gap-1">
                  <Clock size={13} /> Total Minutes Lost
                </label>
                <input
                  type="number"
                  min="0"
                  value={totalTimeLost || ''}
                  onChange={e => setTotalTimeLost(parseInt(e.target.value, 10) || 0)}
                  placeholder="e.g. 45"
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2.5 text-sm font-black focus:border-violet-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">
                  Extra Time Available (mins)
                </label>
                <input
                  type="number"
                  min="0"
                  value={extraTime || ''}
                  onChange={e => setExtraTime(parseInt(e.target.value, 10) || 0)}
                  placeholder="e.g. 30"
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2.5 text-sm font-black focus:border-violet-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">
                  Interval Time Saved (mins)
                </label>
                <input
                  type="number"
                  min="0"
                  value={intervalMadeUp || ''}
                  onChange={e => setIntervalMadeUp(parseInt(e.target.value, 10) || 0)}
                  placeholder="e.g. 10"
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2.5 text-sm font-black focus:border-violet-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Time Loss Calculation Output */}
            {timeCalculation && (
              <div className="mt-4 p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                    <Calculator size={15} /> Calculated Playing Time & Overs
                  </h4>
                  <span className="text-xs font-bold text-slate-500">
                    Net Lost: <strong>{timeCalculation.effectiveTimeLost} mins</strong>
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700">
                    <span className="block text-[11px] font-bold text-slate-500">Overs Deducted</span>
                    <span className="text-xl font-black text-red-500">-{timeCalculation.oversLost}</span>
                  </div>
                  <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700">
                    <span className="block text-[11px] font-bold text-slate-500">Revised Max Overs</span>
                    <span className="text-xl font-black text-violet-600 dark:text-violet-400">
                      {timeCalculation.revisedOvers} ov
                    </span>
                  </div>
                  <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700">
                    <span className="block text-[11px] font-bold text-slate-500">Max / Bowler</span>
                    <span className="text-xl font-black text-slate-800 dark:text-slate-200">
                      {timeCalculation.maxOversPerBowler} ov
                    </span>
                  </div>
                  <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700">
                    <span className="block text-[11px] font-bold text-slate-500">Minimum to Result</span>
                    <span className="text-xl font-black text-slate-800 dark:text-slate-200">
                      {selectedFormat === 'T20' ? '5 ov' : '20 ov'}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  <button
                    onClick={handleUseTimeDerivedOvers}
                    className="flex-1 bg-violet-600 hover:bg-violet-700 text-white font-extrabold text-xs py-3 px-4 rounded-xl shadow-sm transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Sparkles size={15} /> Transfer {timeCalculation.revisedOvers} Overs to VJD Tab
                  </button>
                  <button
                    onClick={() => onApplyRevisedOvers(timeCalculation.revisedOvers)}
                    className="flex-1 bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs py-3 px-4 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Check size={15} /> Apply {timeCalculation.revisedOvers} Overs to Match Directly
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ───────────────────────────────────────────────────────────── */}
      {/* ── SUB-TAB 3: MATCH CONCLUSION (EARLY END / RAIN OUT) ─────── */}
      {/* ───────────────────────────────────────────────────────────── */}
      {activeSubTab === 'end_match' && (
        <div className="space-y-6">
          <div className="p-4 rounded-2xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/50 text-red-900 dark:text-red-200">
            <div className="flex items-center gap-2 mb-1">
              <ShieldAlert size={16} className="text-red-600 dark:text-red-400 shrink-0" />
              <h4 className="text-xs font-black uppercase tracking-wider">
                Official Rain Abandonment & Result Determination
              </h4>
            </div>
            <p className="text-xs leading-relaxed opacity-90 mt-1">
              If rain or ground conditions prevent further play, end the match here. The result will be calculated strictly under BCCI / MPCA Playing Conditions (Par score comparison if minimum overs faced, else No Result).
            </p>
          </div>

          <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Current Match State at Stoppage
            </h4>
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div>
                <span className="text-slate-500 block">Current Innings</span>
                <strong className="text-slate-900 dark:text-white text-sm">
                  {innings === 1 ? '1st Innings' : '2nd Innings'}
                </strong>
              </div>
              <div>
                <span className="text-slate-500 block">Batting Side</span>
                <strong className="text-slate-900 dark:text-white text-sm">{team2Name}</strong>
              </div>
              <div>
                <span className="text-slate-500 block">Score</span>
                <strong className="text-slate-900 dark:text-white text-sm">
                  {currentRuns}/{currentWickets} ({formatOvers(currentBalls)} ov)
                </strong>
              </div>
              <div>
                <span className="text-slate-500 block">Target / Par</span>
                <strong className="text-slate-900 dark:text-white text-sm">
                  {target ? `${target} (Par: ${liveInterruptionState?.parScore || '—'})` : '1st Innings'}
                </strong>
              </div>
            </div>

            {/* Result Preview Box */}
            <div className={`p-5 rounded-2xl border ${
              endMatchInfo.canDetermineWinner
                ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-100'
                : 'bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-100'
            }`}>
              <span className="text-[10px] font-black uppercase tracking-widest block mb-1 opacity-70">
                Official Result Preview
              </span>
              <h3 className="text-base font-black mb-1">
                {endMatchInfo.resultText}
              </h3>
              <p className="text-xs opacity-80 leading-relaxed font-medium">
                {endMatchInfo.summary}
              </p>
            </div>

            <button
              onClick={() => {
                if (window.confirm(`Are you sure you want to officially end this match early?\n\nResult: ${endMatchInfo.resultText}`)) {
                  onEndMatchEarly({
                    winnerId: endMatchInfo.winnerId || null,
                    margin: endMatchInfo.margin || null,
                    resultText: endMatchInfo.resultText,
                    oversPlayed: formatOvers(currentBalls),
                  });
                }
              }}
              className="w-full bg-red-600 hover:bg-red-700 text-white font-extrabold text-sm py-4 rounded-xl shadow-lg transition-all active:scale-95 cursor-pointer flex items-center justify-center gap-2"
            >
              <Trophy size={18} />
              <span>Confirm & Lock Match Result</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
