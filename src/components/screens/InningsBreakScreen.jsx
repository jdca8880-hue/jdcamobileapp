import React from 'react';
import { Trophy, ArrowRight, Play, Award, Zap } from 'lucide-react';
import { useCricket } from '../../context/CricketContext';
import { CricketBatIcon, CricketBallIcon } from '../CricketIcons';
import PageHeader from '../ui/PageHeader';
import Badge from '../ui/Badge';

export default function InningsBreakScreen() {
  const { runs = 0, wickets = 0, setInnings, navigateTo, activeMatchId, resolveInningsId } = useCricket();

  const targetScore = (runs || 184) + 1;

  const handleStartSecondInnings = async () => {
    if (setInnings) setInnings(2);
    if (resolveInningsId && activeMatchId) {
      await resolveInningsId(activeMatchId, 2);
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
              {runs || 184} <span className="text-2xl text-gray-400 font-bold">/{wickets || 4}</span>
            </div>
            <p className="text-xs text-gray-300 font-medium mt-1">
              Overs: <strong>20.0</strong> • Run Rate: <strong>{(((runs || 184) / 20)).toFixed(2)}</strong>
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
          Required from 120 legal deliveries • Required Run Rate: {(targetScore / 20).toFixed(2)} RPO
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
            <h4 className="font-black text-base text-slate-900">R. Sharma</h4>
            <div className="text-xl font-black text-slate-900 mt-1 font-tabular">
              68* <span className="text-xs font-medium text-slate-400">(42 balls)</span>
            </div>
            <p className="text-xs text-slate-500 font-semibold mt-1">6x4, 2x6 • SR: 161.9</p>
          </div>

          {/* Top Bowler - Blue */}
          <div className="p-4 rounded-2xl bg-white border border-slate-200 border-l-4 border-l-blue-500 shadow-sm">
            <div className="flex items-center space-x-1.5 text-xs font-bold text-slate-500 mb-1">
              <CricketBallIcon className="w-3.5 h-3.5 text-blue-500" />
              <span>Top Bowler</span>
            </div>
            <h4 className="font-black text-base text-slate-900">A. Patel</h4>
            <div className="text-xl font-black text-slate-900 mt-1 font-tabular">
              3/24 <span className="text-xs font-medium text-slate-400">(4.0 ov)</span>
            </div>
            <p className="text-xs text-slate-500 font-semibold mt-1">Econ: 6.00 • 11 Dots</p>
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
