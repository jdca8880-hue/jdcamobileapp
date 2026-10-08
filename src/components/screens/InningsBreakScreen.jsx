import React, { useState, useEffect, useMemo } from 'react';
import { Trophy, ArrowRight, Play, Award, Zap } from 'lucide-react';
import { useCricket } from '../../context/CricketContext';
import { CricketBatIcon, CricketBallIcon } from '../CricketIcons';
import PageHeader from '../ui/PageHeader';
import Badge from '../ui/Badge';
import { api } from '../../lib/api';

export default function InningsBreakScreen() {
  const { runs = 0, wickets = 0, navigateTo, startSecondInnings, activeMatchId } = useCricket();
  const [scorecard, setScorecard] = useState(null);

  useEffect(() => {
    let cancelled = false;
    if (!activeMatchId) return;
    api.getMatchScorecard(activeMatchId)
      .then(data => { if (!cancelled) setScorecard(data); })
      .catch(err => console.error('[InningsBreak] scorecard fetch failed', err));
    return () => { cancelled = true; };
  }, [activeMatchId]);

  // First-innings data from the computed scorecard (robust to home/away ordering).
  const firstInnings = useMemo(() => {
    if (!scorecard) return null;
    return scorecard.innings_1 || null;
  }, [scorecard]);

  const maxOvers = scorecard?.maxOvers || null;
  const inningsRuns = firstInnings?.runs ?? runs;
  const inningsWickets = firstInnings?.wickets ?? wickets;
  const inningsOvers = firstInnings?.overs || '0.0';
  const legalBalls = firstInnings?.legalBalls ?? 0;
  const oversForRR = legalBalls > 0 ? legalBalls / 6 : (maxOvers || 1);
  const runRate = oversForRR > 0 ? (inningsRuns / oversForRR).toFixed(2) : '0.00';
  const targetScore = inningsRuns + 1;
  const chaseBalls = maxOvers ? maxOvers * 6 : null;
  const requiredRR = maxOvers ? (targetScore / maxOvers).toFixed(2) : null;

  const topBatter = useMemo(() => {
    const list = firstInnings?.batting || [];
    if (!list.length) return null;
    return list.slice().sort((a, b) => (b.runs || 0) - (a.runs || 0))[0];
  }, [firstInnings]);

  const topBowler = useMemo(() => {
    const list = firstInnings?.bowling || [];
    if (!list.length) return null;
    return list.slice().sort((a, b) => (b.wickets || 0) - (a.wickets || 0) || (a.runs || 0) - (b.runs || 0))[0];
  }, [firstInnings]);

  const handleStartSecondInnings = async () => {
    if (startSecondInnings) {
      startSecondInnings(targetScore);
    }
    if (navigateTo) navigateTo('scoring');
  };

  return (
    <div className="space-y-5 pb-20 max-w-3xl mx-auto animate-in fade-in duration-200">
      
      {/* 1. Official JDCA Midnight Ink Banner */}
      <div className="rounded-2xl bg-ink text-white p-6 shadow-md relative overflow-hidden">
        <div className="relative z-10 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider text-mango-400">
              <span className="w-2 h-2 rounded-full bg-mango-400 animate-pulse" />
              <span>Innings Break • 1st Innings Concluded</span>
            </div>
            <Badge variant="upcoming">Target Set</Badge>
          </div>

          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-200">
              1st Innings Total
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

      {/* 2. Target Challenge Card */}
      <div className="bg-white rounded-2xl p-6 text-center space-y-2.5 border border-slate-200 border-l-4 border-l-blue-500 shadow-sm">
        <div className="inline-flex items-center justify-center space-x-1.5 px-3 py-1 rounded bg-blue-50 text-blue-700 text-xs font-bold uppercase tracking-wider border border-blue-100">
          <CricketBatIcon className="w-3.5 h-3.5" />
          <span>TARGET FOR 2ND INNINGS CHASE</span>
        </div>
        <div className="text-4xl sm:text-5xl font-black text-slate-900 font-tabular drop-shadow-sm">
          {targetScore} <span className="text-2xl font-bold text-slate-400">Runs</span>
        </div>
        <p className="text-xs font-semibold text-slate-500">
          {chaseBalls ? `Required from ${chaseBalls} legal deliveries` : 'Target set for 2nd innings'}
          {requiredRR ? ` • Required Run Rate: ${requiredRR} RPO` : ''}
        </p>
      </div>

      {/* 3. Top Performers */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 space-y-3.5 shadow-sm">
        <h3 className="text-xs font-black uppercase tracking-wider text-slate-500">
          Key 1st Innings Performers
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Top Batter - Amber */}
          <div className="p-4 rounded-2xl bg-white border border-slate-200 border-l-4 border-l-amber-500 shadow-sm">
            <div className="flex items-center space-x-1.5 text-xs font-bold text-slate-500 mb-1">
              <CricketBatIcon className="w-3.5 h-3.5 text-amber-500" />
              <span>Top Batter</span>
            </div>
            {topBatter ? (
              <>
                <h4 className="font-black text-base text-slate-900">{topBatter.name}</h4>
                <div className="text-xl font-black text-slate-900 mt-1 font-tabular">
                  {topBatter.runs}{topBatter.dismissal === 'not out' ? '*' : ''}{' '}
                  <span className="text-xs font-medium text-slate-400">({topBatter.balls} balls)</span>
                </div>
                <p className="text-xs text-slate-500 font-semibold mt-1">
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
          <div className="p-4 rounded-2xl bg-white border border-slate-200 border-l-4 border-l-blue-500 shadow-sm">
            <div className="flex items-center space-x-1.5 text-xs font-bold text-slate-500 mb-1">
              <CricketBallIcon className="w-3.5 h-3.5 text-blue-500" />
              <span>Top Bowler</span>
            </div>
            {topBowler ? (
              <>
                <h4 className="font-black text-base text-slate-900">{topBowler.name}</h4>
                <div className="text-xl font-black text-slate-900 mt-1 font-tabular">
                  {topBowler.wickets}/{topBowler.runs}{' '}
                  <span className="text-xs font-medium text-slate-400">({topBowler.overs} ov)</span>
                </div>
                <p className="text-xs text-slate-500 font-semibold mt-1">
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
          onClick={handleStartSecondInnings}
          className="w-full py-3.5 bg-cobalt hover:bg-cobalt-700 text-white font-bold rounded-xl shadow-xs flex items-center justify-center space-x-2 text-sm transition cursor-pointer"
        >
          <CricketBatIcon className="w-4 h-4 text-white" />
          <span>Commence 2nd Innings (Run Chase)</span>
        </button>

        <button
          type="button"
          onClick={() => navigateTo('scorecard')}
          className="w-full py-3 bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 font-semibold rounded-xl text-xs sm:text-sm flex items-center justify-center transition cursor-pointer"
        >
          <span>Review 1st Innings Full Scorecard</span>
        </button>
      </div>

    </div>
  );
}
