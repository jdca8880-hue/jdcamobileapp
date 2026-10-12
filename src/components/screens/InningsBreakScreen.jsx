import React, { useState, useEffect, useMemo } from 'react';
import { Trophy, ArrowRight, Play, Award, Zap } from 'lucide-react';
import { useCricket } from '../../context/CricketContext';
import { CricketBatIcon, CricketBallIcon } from '../CricketIcons';
import PageHeader from '../ui/PageHeader';
import Badge from '../ui/Badge';
import { api } from '../../lib/api';

const ordinal = (n) => {
  const s = ['th', 'st', 'nd', 'rd'];
  const v = n % 100;
  return `${n}${s[(v - 20) % 10] || s[v] || s[0]}`;
};

export default function InningsBreakScreen() {
  const {
    runs = 0,
    wickets = 0,
    navigateTo,
    startSecondInnings,
    startNextInnings,
    activeMatchId,
    innings = 1,
    isTestMatch = false,
  } = useCricket();
  const [scorecard, setScorecard] = useState(null);

  useEffect(() => {
    let cancelled = false;
    if (!activeMatchId) return;
    api.getMatchScorecard(activeMatchId)
      .then(data => { if (!cancelled) setScorecard(data); })
      .catch(err => console.error('[InningsBreak] scorecard fetch failed', err));
    return () => { cancelled = true; };
  }, [activeMatchId]);

  // The innings that just concluded (the engine keeps `innings` on the current
  // number through the break; it only advances when the next innings starts).
  const completedInnings = isTestMatch ? (innings || 1) : 1;
  const nextInningsNum = isTestMatch ? completedInnings + 1 : 2;
  // Only the chasing innings has a target: an ordinary 2nd innings, or a Test
  // 4th innings. A Test 2nd/3rd innings just continues the match.
  const nextIsChase = isTestMatch ? (nextInningsNum === 4) : true;

  // Stats for the innings that just finished (falls back to live score).
  const completedData = useMemo(() => {
    if (!scorecard) return null;
    return scorecard[`innings_${completedInnings}`] || scorecard.innings_1 || null;
  }, [scorecard, completedInnings]);

  const maxOvers = scorecard?.maxOvers || null;
  const inningsRuns = completedData?.runs ?? runs;
  const inningsWickets = completedData?.wickets ?? wickets;
  const inningsOvers = completedData?.overs || '0.0';
  const legalBalls = completedData?.legalBalls ?? 0;
  const oversForRR = legalBalls > 0 ? legalBalls / 6 : (maxOvers || 1);
  const runRate = oversForRR > 0 ? (inningsRuns / oversForRR).toFixed(2) : '0.00';

  // Target: ordinary chase = 1st-innings runs + 1. Test 4th innings = the
  // runs needed to pass the opposition's two-innings aggregate.
  const targetScore = useMemo(() => {
    if (!nextIsChase) return null;
    if (!isTestMatch) return inningsRuns + 1;
    const sideAggregate = (scorecard?.innings_1?.runs || 0) + (scorecard?.innings_3?.runs || 0);
    const chaserFirstInnings = scorecard?.innings_2?.runs || 0;
    return sideAggregate - chaserFirstInnings + 1;
  }, [nextIsChase, isTestMatch, inningsRuns, scorecard]);

  const chaseBalls = (nextIsChase && !isTestMatch && maxOvers) ? maxOvers * 6 : null;
  const requiredRR = (nextIsChase && !isTestMatch && maxOvers) ? (targetScore / maxOvers).toFixed(2) : null;

  const topBatter = useMemo(() => {
    const list = completedData?.batting || [];
    if (!list.length) return null;
    return list.slice().sort((a, b) => (b.runs || 0) - (a.runs || 0))[0];
  }, [completedData]);

  const topBowler = useMemo(() => {
    const list = completedData?.bowling || [];
    if (!list.length) return null;
    return list.slice().sort((a, b) => (b.wickets || 0) - (a.wickets || 0) || (a.runs || 0) - (b.runs || 0))[0];
  }, [completedData]);

  const handleStartNextInnings = async () => {
    if (isTestMatch) {
      if (startNextInnings) startNextInnings(nextIsChase ? targetScore : null, nextInningsNum);
    } else if (startSecondInnings) {
      startSecondInnings(targetScore);
    }
    if (navigateTo) navigateTo('scoring');
  };

  const ctaLabel = isTestMatch
    ? `Commence ${ordinal(nextInningsNum)} Innings${nextIsChase ? ' (Run Chase)' : ''}`
    : 'Commence 2nd Innings (Run Chase)';

  return (
    <div className="space-y-5 pb-20 max-w-3xl mx-auto animate-in fade-in duration-200">

      {/* 1. Official JDCA Midnight Ink Banner */}
      <div className="rounded-2xl bg-ink text-white p-6 shadow-md relative overflow-hidden">
        <div className="relative z-10 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-mango-400">
              <span className="w-2 h-2 rounded-full bg-mango-400 animate-pulse" />
              <span>Innings Break • {ordinal(completedInnings)} Innings Concluded</span>
            </div>
            <Badge variant="upcoming">{nextIsChase ? 'Target Set' : `${ordinal(nextInningsNum)} Innings`}</Badge>
          </div>

          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-200">
              {ordinal(completedInnings)} Innings Total
            </h2>
            <div className="text-4xl sm:text-5xl font-black text-white tracking-tight mt-1 font-tabular">
              {inningsRuns} <span className="text-2xl text-gray-400 font-bold">/{inningsWickets}</span>
            </div>
            <p className="text-xs text-gray-300 font-medium mt-1">
              Overs: <strong>{inningsOvers}</strong> • Run Rate: <strong>{runRate}</strong>
            </p>
          </div>
        </div>
      </div>

      {/* 2. Target / Next-innings Card */}
      {nextIsChase ? (
        <div className="bg-white dark:bg-[#14171A] rounded-2xl p-6 text-center space-y-2.5 border border-slate-200 dark:border-white/10 border-l-4 border-l-[#A3E635] shadow-sm">
          <div className="inline-flex items-center justify-center space-x-1.5 px-3 py-1 rounded bg-blue-50 dark:bg-emerald-950/40 text-blue-700 dark:text-[#A3E635] text-xs font-bold uppercase tracking-wider border border-blue-100 dark:border-emerald-500/30">
            <CricketBatIcon className="w-3.5 h-3.5" />
            <span>TARGET FOR {ordinal(nextInningsNum).toUpperCase()} INNINGS CHASE</span>
          </div>
          <div className="text-4xl sm:text-5xl font-black text-slate-900 dark:text-[#F3F4F6] font-tabular drop-shadow-sm">
            {targetScore} <span className="text-2xl font-bold text-slate-400">Runs</span>
          </div>
          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
            {chaseBalls ? `Required from ${chaseBalls} legal deliveries` : 'Target set for the final innings'}
            {requiredRR ? ` • Required Run Rate: ${requiredRR} RPO` : ''}
          </p>
        </div>
      ) : (
        <div className="bg-white dark:bg-[#14171A] rounded-2xl p-6 text-center space-y-2.5 border border-slate-200 dark:border-white/10 border-l-4 border-l-[#2457D6] shadow-sm">
          <div className="inline-flex items-center justify-center space-x-1.5 px-3 py-1 rounded bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 text-xs font-bold uppercase tracking-wider border border-blue-100 dark:border-blue-500/30">
            <CricketBatIcon className="w-3.5 h-3.5" />
            <span>MULTI-DAY MATCH • {ordinal(nextInningsNum).toUpperCase()} INNINGS NEXT</span>
          </div>
          <p className="text-sm font-semibold text-slate-600 dark:text-slate-300">
            The {ordinal(nextInningsNum)} innings will now begin. No target is set until the
            final innings of the match.
          </p>
        </div>
      )}

      {/* 3. Top Performers */}
      <div className="bg-white dark:bg-[#14171A] rounded-2xl border border-slate-200/80 dark:border-white/10 p-5 space-y-3.5 shadow-sm">
        <h3 className="text-xs font-black uppercase tracking-wider text-slate-500 dark:text-slate-400">
          Key {ordinal(completedInnings)} Innings Performers
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Top Batter - Amber */}
          <div className="p-4 rounded-2xl bg-white dark:bg-[#1E2226] border border-slate-200 dark:border-white/10 border-l-4 border-l-amber-500 shadow-sm">
            <div className="flex items-center space-x-1.5 text-xs font-bold text-slate-500 dark:text-slate-400 mb-1">
              <CricketBatIcon className="w-3.5 h-3.5 text-amber-500" />
              <span>Top Batter</span>
            </div>
            {topBatter ? (
              <>
                <h4 className="font-black text-base text-slate-900 dark:text-[#F3F4F6]">{topBatter.name}</h4>
                <div className="text-xl font-black text-slate-900 dark:text-[#F3F4F6] mt-1 font-tabular">
                  {topBatter.runs}{topBatter.dismissal === 'not out' ? '*' : ''}{' '}
                  <span className="text-xs font-medium text-slate-400">({topBatter.balls} balls)</span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold mt-1">
                  {topBatter.fours}x4, {topBatter.sixes}x6 • SR: {topBatter.strikeRate}
                </p>
              </>
            ) : (
              <>
                <h4 className="font-black text-base text-slate-400">—</h4>
                <p className="text-xs text-slate-400 font-semibold mt-1">No batting data yet</p>
              </>
            )}
          </div>

          {/* Top Bowler - Blue */}
          <div className="p-4 rounded-2xl bg-white dark:bg-[#1E2226] border border-slate-200 dark:border-white/10 border-l-4 border-l-[#A3E635] shadow-sm">
            <div className="flex items-center space-x-1.5 text-xs font-bold text-slate-500 dark:text-slate-400 mb-1">
              <CricketBallIcon className="w-3.5 h-3.5 text-[#A3E635]" />
              <span>Top Bowler</span>
            </div>
            {topBowler ? (
              <>
                <h4 className="font-black text-base text-slate-900 dark:text-[#F3F4F6]">{topBowler.name}</h4>
                <div className="text-xl font-black text-slate-900 dark:text-[#F3F4F6] mt-1 font-tabular">
                  {topBowler.wickets}/{topBowler.runs}{' '}
                  <span className="text-xs font-medium text-slate-400">({topBowler.overs} ov)</span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold mt-1">
                  Econ: {topBowler.economy}
                </p>
              </>
            ) : (
              <>
                <h4 className="font-black text-base text-slate-400">—</h4>
                <p className="text-xs text-slate-400 font-semibold mt-1">No bowling data yet</p>
              </>
            )}
          </div>
        </div>
      </div>

      {/* 4. Action CTAs */}
      <div className="space-y-2.5 pt-2">
        <button
          type="button"
          onClick={handleStartNextInnings}
          className="w-full py-3.5 bg-[#2457D6] dark:bg-[#A3E635] hover:bg-[#1b41a8] dark:hover:bg-[#bef264] text-white dark:text-[#0A0A0A] font-bold rounded-xl shadow-xs flex items-center justify-center space-x-2 text-sm transition cursor-pointer"
        >
          <CricketBatIcon className="w-4 h-4 text-white dark:text-[#0A0A0A]" />
          <span>{ctaLabel}</span>
        </button>

        <button
          type="button"
          onClick={() => navigateTo('scorecard')}
          className="w-full py-3 bg-white dark:bg-[#181A1D] border border-gray-200 dark:border-white/10 text-gray-700 dark:text-[#F3F4F6] hover:bg-gray-50 dark:hover:bg-[#262B30] font-semibold rounded-xl text-xs sm:text-sm flex items-center justify-center transition cursor-pointer"
        >
          <span>Review {ordinal(completedInnings)} Innings Full Scorecard</span>
        </button>
      </div>


    </div>
  );
}
