import React from 'react';
import { 
  ShieldCheck, 
  Award, 
  Activity, 
  Clock, 
  Radio, 
  ArrowLeft, 
  ArrowRight,
  UserCheck
} from 'lucide-react';
import { useCricket } from '../../context/CricketContext';
import PageHeader from '../ui/PageHeader';
import Badge from '../ui/Badge';

export default function MatchOverviewScreen() {
  const { officials = [], navigateTo, goBack, scoring } = useCricket();

  return (
    <div className="space-y-5 pb-20 max-w-5xl mx-auto animate-in fade-in duration-200">
      
      {/* 1. Page Header */}
      <PageHeader
        title="Active Match Overview"
        subtitle="Live statistics, partnership progression, and playing 11 list"
        actions={
          <div className="flex items-center gap-2">
            <span className="badge badge-live inline-flex items-center gap-1.5 px-3 py-1 text-xs">
              <span className="live-dot" />
              LIVE MATCH
            </span>
          </div>
        }
      />

      {/* 2. Key Metrics 4-Column Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
        {/* Metric 1: Score */}
        <div className="bg-white dark:bg-[#14171A] rounded-2xl p-4.5 border border-slate-200 dark:border-white/10 border-l-4 border-l-[#A3E635] shadow-sm hover:shadow-md hover:scale-[1.02] transition-all">
          <span className="text-xs uppercase font-black tracking-wider text-slate-500 dark:text-slate-400 block mb-1">
            Current Score
          </span>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-[#F3F4F6] font-tabular leading-none">
            {scoring.runs}/{scoring.wickets}
          </div>
          <div className="text-xs text-slate-500 dark:text-slate-400 font-semibold mt-1.5">
            Overs: <strong className="text-blue-600 dark:text-[#A3E635]">{scoring.formatOversDisplay()}</strong>
          </div>
        </div>

        {/* Metric 2: Current Striker */}
        <div className="bg-white dark:bg-[#14171A] rounded-2xl p-4.5 border border-slate-200 dark:border-white/10 border-l-4 border-l-emerald-500 shadow-sm hover:shadow-md hover:scale-[1.02] transition-all">
          <span className="text-xs uppercase font-black tracking-wider text-slate-500 dark:text-slate-400 block mb-1">
            Current Striker
          </span>
          <div className="text-lg sm:text-xl font-black text-slate-900 dark:text-[#F3F4F6] leading-none truncate mb-1">
            {scoring.striker?.name || 'Waiting...'}
          </div>
          <div className="text-xs text-slate-500 dark:text-slate-400 font-semibold">
            {scoring.striker?.id ? `Batting` : '-'}
          </div>
        </div>

        {/* Metric 3: Current Non-Striker */}
        <div className="bg-white dark:bg-[#14171A] rounded-2xl p-4.5 border border-slate-200 dark:border-white/10 border-l-4 border-l-amber-500 shadow-sm hover:shadow-md hover:scale-[1.02] transition-all">
          <span className="text-xs uppercase font-black tracking-wider text-slate-500 dark:text-slate-400 block mb-1">
            Non-Striker
          </span>
          <div className="text-lg sm:text-xl font-black text-slate-900 dark:text-[#F3F4F6] leading-none truncate mb-1">
            {scoring.nonStriker?.name || 'Waiting...'}
          </div>
          <div className="text-xs text-slate-500 dark:text-slate-400 font-semibold">
            {scoring.nonStriker?.id ? `Batting` : '-'}
          </div>
        </div>

        {/* Metric 4: Current Bowler */}
        <div className="bg-white dark:bg-[#14171A] rounded-2xl p-4.5 border border-slate-200 dark:border-white/10 border-l-4 border-l-purple-500 shadow-sm hover:shadow-md hover:scale-[1.02] transition-all">
          <span className="text-xs uppercase font-black tracking-wider text-slate-500 dark:text-slate-400 block mb-1">
            Current Bowler
          </span>
          <div className="text-lg sm:text-xl font-black text-slate-900 dark:text-[#F3F4F6] leading-none truncate mb-1">
            {scoring.currentBowler?.name || 'Waiting...'}
          </div>
          <div className="text-xs text-slate-500 dark:text-slate-400 font-semibold">
            {scoring.currentBowler?.id ? `Bowling` : '-'}
          </div>
        </div>
      </div>

      
      {/* 2.5 Recent Balls */}
      <div className="jdca-card p-4 space-y-2 mt-4">
         <span className="text-xs uppercase font-black tracking-wider text-slate-500 block mb-1">
            Recent Deliveries
          </span>
          <div className="flex items-center gap-2 flex-wrap">
             {scoring.deliveryLog?.slice(-12).map((d, i) => (
                <div key={d.id || i} className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                   d.wicket_type !== 'NONE' || d.wicket ? 'bg-red-500 text-white' : 
                   d.runs_total === 4 ? 'bg-blue-500 text-white' : 
                   d.runs_total === 6 ? 'bg-purple-600 text-white' : 
                   d.extra_type !== 'NONE' && d.extra_type ? 'bg-amber-100 text-amber-800 border border-amber-200' :
                   'bg-slate-100 text-slate-700'
                }`}>
                   {d.label || (d.wicket_type !== 'NONE' || d.wicket ? 'W' : d.extra_type !== 'NONE' && d.extra_type ? 'Ex' : d.runs_total || '0')}
                </div>
             ))}
             {(!scoring.deliveryLog || scoring.deliveryLog.length === 0) && (
                <span className="text-slate-400 text-sm italic">No recent deliveries</span>
             )}
          </div>
      </div>

      {/* 3. Official Assignments Card */}
      <div className="jdca-card bg-white dark:bg-[#14171A] border border-slate-200 dark:border-white/10 p-5 space-y-3">
        <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-white/10">
          <div className="flex items-center space-x-2">
            <ShieldCheck className="w-5 h-5 text-[#2457D6] dark:text-[#A3E635]" />
            <h3 className="text-base font-bold text-slate-900 dark:text-[#F3F4F6]">
              Official Assignments & Match Observers
            </h3>
          </div>
          <Badge variant="upcoming">MPCA / JDCA Certified</Badge>
        </div>

        {/* Officials List Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
          {officials.map((official) => (
            <div
              key={official.id}
              className="p-3.5 rounded-xl bg-gray-50/70 dark:bg-[#1E2226] border border-gray-150 dark:border-white/10 flex items-center justify-between"
            >
              <div className="flex items-center space-x-3">
                <img
                  src={official.avatar}
                  alt={official.name}
                  className="w-10 h-10 rounded-full object-cover border border-gray-200 dark:border-white/10 shadow-2xs"
                />
                <div>
                  <h4 className="font-bold text-sm text-gray-900 dark:text-[#F3F4F6]">{official.name}</h4>
                  <p className="text-xs text-gray-500 dark:text-[#94A3B8] font-medium">{official.role}</p>
                </div>
              </div>

              <span className="px-2 py-0.5 rounded-md bg-cobalt-50 dark:bg-[#262B30] text-[#2457D6] dark:text-[#A3E635] text-xs font-bold">
                {official.experience}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* 4. Action Buttons */}
      <div className="flex flex-wrap items-center gap-3 pt-2">
        <button
          type="button"
          onClick={() => navigateTo('scoring')}
          className="flex-1 min-w-[180px] py-3 px-4 bg-[#2457D6] dark:bg-[#A3E635] text-white dark:text-[#0A0A0A] font-bold rounded-xl text-xs sm:text-sm flex items-center justify-center space-x-2 shadow-xs transition cursor-pointer"
        >
          <span>Return to Scoring Console</span>
          <ArrowRight className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={() => navigateTo('scorecard')}
          className="flex-1 min-w-[180px] py-3 px-4 bg-white dark:bg-[#14171A] border border-gray-300 dark:border-white/10 text-gray-700 dark:text-[#F3F4F6] hover:bg-gray-50 dark:hover:bg-[#262B30] font-bold rounded-xl text-xs sm:text-sm flex items-center justify-center transition cursor-pointer"
        >
          <span>Official Scorecard Table</span>
        </button>
      </div>

    </div>
  );
}
