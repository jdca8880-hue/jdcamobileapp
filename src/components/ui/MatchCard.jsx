import React from 'react';
import { CalendarDays, ArrowRight, MapPin } from 'lucide-react';
import { CloudinaryAvatar } from './CloudinaryAvatar';
import { motion } from 'motion/react';
import { useHaptics } from '../../hooks/useHaptics';
export const MatchCard = ({ match, onClick }) => {
  const isLive = match.status === 'LIVE' || match.status === 'IN_PROGRESS';
  const isCompleted = match.status === 'COMPLETED' || match.status === 'FINISHED';

  // Fetch dynamic data if available
  const dateStr = match.scheduled_at ? new Date(match.scheduled_at).toLocaleString() : 'Date TBD';
  const topPerformer = match.topPerformer || { name: 'TBD', score: '-' };
  const teamAName = match.home_team?.name || match.teamA?.name || match.teamA || 'Home Team';
  const teamBName = match.away_team?.name || match.teamB?.name || match.teamB || 'Away Team';

  // Image placeholders
  const bannerImage = match.bannerImage || "/imageformatchescard.png";
  const playerAvatar = match.topPerformer?.image;

  const haptics = useHaptics();

  return (
    <motion.div 
      whileTap={{ scale: 0.985 }}
      onClick={(e) => {
        haptics.light();
        if (onClick) onClick(e);
      }}
      className={`bg-white rounded-2xl cursor-pointer relative transition-colors border border-slate-200 mb-4 shadow-sm hover:shadow-md group overflow-hidden flex flex-col w-full`}
    >
      {/* Dynamic Banner Header */}
      <div className="h-24 w-full relative">
        <img src={bannerImage} alt="Match Banner" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/40 to-slate-900/20" />
        
        {/* Banner content */}
        <div className="absolute inset-0 p-4 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className={`text-xs font-bold tracking-wider uppercase text-white/90 drop-shadow-sm`}>
                {match.tournament || 'JDCA Official Fixtures'}
              </span>
              {isLive ? (
                <span className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/30 backdrop-blur-sm">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  LIVE
                </span>
              ) : (
                <span className={`text-xs font-bold uppercase tracking-widest ${isCompleted ? 'text-white/70' : 'text-blue-300'}`}>
                  {isCompleted ? 'COMPLETED' : 'UPCOMING'}
                </span>
              )}
            </div>
            
            <div className="flex items-center gap-1.5 text-white/90 text-xs font-medium drop-shadow-md">
                <CalendarDays size={12} className="opacity-80" /> {dateStr}
            </div>
        </div>
      </div>

      <div className="p-4 flex flex-col flex-1">
          {/* Winner on top if completed */}
          {isCompleted && (
            <div className="mb-4 text-xs font-bold text-slate-800 bg-slate-100/80 px-3 py-2 rounded-lg border border-slate-200 flex items-center gap-2">
              <span className="text-lg leading-none">🏆</span> {match.result_text || match.result || 'Result pending'}
            </div>
          )}
          
          {/* Teams and Scores */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-xs font-bold text-white shadow-sm">
                  {teamAName.substring(0,3).toUpperCase()}
                </div>
                <div className="text-base font-bold text-slate-900">
                  {teamAName}
                </div>
              </div>
              {(isLive || isCompleted) && (
                <div className="text-lg font-black text-slate-900">
                  {match.teamA?.score || '0/0'}
                </div>
              )}
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-xs font-bold text-white shadow-sm">
                  {teamBName.substring(0,3).toUpperCase()}
                </div>
                <div className="text-base font-bold text-slate-900">
                  {teamBName}
                </div>
              </div>
              {(isLive || isCompleted) && (
                <div className="text-lg font-black text-slate-900">
                  {match.teamB?.score || (isLive ? 'Yet to bat' : '0/0')}
                </div>
              )}
            </div>
          </div>
          
          {isLive && (
            <div className="mt-4 text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-1.5 rounded-lg inline-block border border-emerald-100">
              CRR: 5.8 · {match.teamA?.overs || '24.2'} overs
            </div>
          )}

          {/* Match Performers Section */}
          {isCompleted && (
            <div className="mt-5 pt-4 border-t border-slate-100 flex flex-col gap-3">
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Match Performers</span>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Man of the Match */}
                <div className="flex items-center gap-3 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                    <CloudinaryAvatar src={playerAvatar} alt={topPerformer.name} className="w-10 h-10 rounded-full object-cover border border-slate-200 shadow-sm shrink-0" />
                    <div className="flex flex-col flex-1">
                       <span className="text-[9px] text-orange-500 font-bold uppercase tracking-wider flex items-center gap-1">🏆 Player of the Match</span>
                       <span className="text-xs font-black text-slate-800">{topPerformer.name}</span>
                       <span className="text-[10px] font-semibold text-slate-500">{topPerformer.score}</span>
                    </div>
                </div>

                {/* Top Batter & Bowler */}
                <div className="flex flex-col justify-center gap-2">
                  <div className="flex items-center justify-between bg-slate-50 p-2 rounded-lg border border-slate-100">
                    <div className="flex items-center gap-2">
                      <span className="text-xs">🏏</span>
                      <div className="flex flex-col">
                        <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider">Top Batter</span>
                        <span className="text-xs font-bold text-slate-800">{match.topBatter?.name || 'TBD'}</span>
                      </div>
                    </div>
                    <span className="text-xs font-black text-slate-700">{match.topBatter?.score || '-'}</span>
                  </div>

                  <div className="flex items-center justify-between bg-slate-50 p-2 rounded-lg border border-slate-100">
                    <div className="flex items-center gap-2">
                      <span className="text-xs">🎯</span>
                      <div className="flex flex-col">
                        <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider">Top Bowler</span>
                        <span className="text-xs font-bold text-slate-800">{match.topBowler?.name || 'TBD'}</span>
                      </div>
                    </div>
                    <span className="text-xs font-black text-slate-700">{match.topBowler?.score || '-'}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* Footer info */}
          <div className={`mt-4 pt-4 flex items-center justify-between text-xs font-medium text-slate-500 ${(!isCompleted && !isLive) ? 'border-t border-slate-100' : ''}`}>
            <div className="flex items-center gap-1.5">
              <MapPin size={12} />
              {match.venue || 'Ranital Cricket Ground'}
            </div>
            <div className="flex items-center gap-1 uppercase tracking-wider font-bold text-blue-600 group-hover:translate-x-1 transition-transform">
              MATCH CENTER
              <ArrowRight size={14} />
            </div>
          </div>
      </div>
    </motion.div>
  );
};
