import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Radio, ChevronRight, Activity, Zap, Play } from 'lucide-react';
import { useCricket } from '../../context/CricketContext';
import { useNavigate } from 'react-router-dom';

export default function LiveMatchesShowcase() {
  const { matches = [], navigateTo, setActiveMatchId } = useCricket();
  const navigate = useNavigate();

  const liveMatches = matches.filter(m => {
    const s = String(m.status || '').toUpperCase();
    return s === 'LIVE' || s === 'IN_PROGRESS' || s === 'INNINGS_BREAK';
  });

  if (liveMatches.length === 0) return null;

  const handleMatchClick = (id) => {
    setActiveMatchId(id);
    navigate('/match-overview');
  };

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-3 px-1">
        <h3 className="font-black text-slate-900 flex items-center gap-2 uppercase tracking-tight text-sm">
          <div className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
          </div>
          Live Action
        </h3>
        <span className="text-xs font-bold bg-rose-100 text-rose-700 px-2 py-0.5 rounded-full">
          {liveMatches.length} Match{liveMatches.length > 1 ? 'es' : ''} Live
        </span>
      </div>

      <div className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory hide-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0">
        <AnimatePresence>
          {liveMatches.map((match, i) => {
            const t1 = match.home_team?.short_name || match.home_team?.name?.substring(0,3).toUpperCase() || 'T1';
            const t2 = match.away_team?.short_name || match.away_team?.name?.substring(0,3).toUpperCase() || 'T2';
            const t1Name = match.home_team?.name || 'Home Team';
            const t2Name = match.away_team?.name || 'Away Team';
            
            // Random gradient for visual flair
            const gradients = [
              'from-blue-600 to-indigo-900',
              'from-rose-500 to-pink-800',
              'from-emerald-500 to-teal-900',
              'from-violet-600 to-purple-900',
              'from-amber-500 to-orange-800'
            ];
            const g = gradients[i % gradients.length];

            return (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                key={match.id}
                onClick={() => handleMatchClick(match.id)}
                className={"snap-center shrink-0 w-[280px] sm:w-[320px] rounded-2xl p-1 cursor-pointer shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 relative overflow-hidden group " + g}
              >
                {/* Decorative background elements */}
                <div className="absolute -right-6 -top-6 text-white/10 rotate-12 transform group-hover:rotate-45 transition-transform duration-700">
                  <Activity size={100} strokeWidth={1} />
                </div>
                
                <div className="bg-black/20 backdrop-blur-md rounded-xl p-4 h-full border border-white/10 flex flex-col justify-between relative z-10">
                  <div className="flex justify-between items-start mb-4">
                    <span className="text-[10px] font-bold text-white/80 uppercase tracking-widest bg-black/30 px-2 py-1 rounded">
                      {match.format || 'T20'} � {match.tournament?.name || 'Match'}
                    </span>
                    <Radio size={14} className="text-rose-400 animate-pulse" />
                  </div>

                  <div className="flex items-center justify-between mb-4">
                    <div className="flex flex-col items-center">
                      <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center font-black text-white text-lg border border-white/20 shadow-inner">
                        {t1}
                      </div>
                      <span className="text-white/80 text-[10px] font-bold mt-1 max-w-[70px] truncate text-center">{t1Name}</span>
                    </div>
                    
                    <div className="flex flex-col items-center justify-center">
                      <div className="text-white/50 text-xs font-black italic">VS</div>
                      <div className="w-8 h-[1px] bg-white/20 mt-1"></div>
                    </div>

                    <div className="flex flex-col items-center">
                      <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center font-black text-white text-lg border border-white/20 shadow-inner">
                        {t2}
                      </div>
                      <span className="text-white/80 text-[10px] font-bold mt-1 max-w-[70px] truncate text-center">{t2Name}</span>
                    </div>
                  </div>

                  <div className="bg-black/30 rounded-lg p-2.5 flex items-center justify-between border border-white/5 group-hover:bg-white/10 transition-colors">
                    <div className="flex items-center gap-2">
                      <Zap size={14} className="text-amber-400" />
                      <span className="text-xs font-bold text-white">Match Center</span>
                    </div>
                    <div className="w-6 h-6 rounded-full bg-white text-black flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Play size={12} fill="currentColor" />
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
      
      <style>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}


