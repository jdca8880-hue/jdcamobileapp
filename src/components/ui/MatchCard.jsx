import React, { useState, useEffect } from 'react';
import { CalendarDays, ArrowRight, MapPin } from 'lucide-react';
import { CloudinaryAvatar } from './CloudinaryAvatar';
import { motion } from 'motion/react';
import { useHaptics } from '../../hooks/useHaptics';
import { useCricket } from '../../context/CricketContext';

export const MatchCard = ({ match, onClick }) => {
  const cricketContext = useCricket() || {};
  const players = cricketContext.players || [];
  const haptics = useHaptics();

  const statusUpper = String(match.status || '').toUpperCase();
  const isLive = statusUpper === 'LIVE' || statusUpper === 'IN_PROGRESS';
  const isCompleted = statusUpper === 'COMPLETED' || statusUpper === 'FINISHED' || Boolean(match.result_text || match.result);

  // Fetch dynamic date & teams
  const dateStr = match.scheduled_at ? new Date(match.scheduled_at).toLocaleString() : 'Date Not Set';
  const teamAName = match.home_team?.name || 'Home Team';
  const teamBName = match.away_team?.name || 'Away Team';

  // Dynamic overs calculation (not hardcoded)
  const totalOvers = match.max_overs || match.overs || match.total_overs || (() => {
    const fmt = String(match.match_format || match.format || '').toUpperCase();
    if (fmt === 'T20') return 20;
    if (fmt === 'T10') return 10;
    if (fmt === 'THE HUNDRED') return 100;
    if (fmt === 'ODI') return 50;
    const digits = fmt.match(/\d+/);
    return digits ? Number(digits[0]) : null;
  })();

  const formatText = match.match_format || match.format || (totalOvers ? `${totalOvers} Overs` : null);

  // Dynamic officials: Umpire and Scorer
  const umpireName = match.umpire_name || match.umpireName || match.umpire || 
    (match.matchSetup?.umpires?.umpire1 
      ? [match.matchSetup.umpires.umpire1, match.matchSetup.umpires.umpire2].filter(Boolean).join(' & ') 
      : null);

  const scorerName = match.scorer_name || match.scorerName || match.scorer || match.matchSetup?.scorerName || null;

  // Resolve Man of the Match
  const rawPlayerOfMatch = match.man_of_the_match || match.playerOfMatch || match.manOfTheMatch || null;
  const playerOfMatch = Array.isArray(rawPlayerOfMatch) ? rawPlayerOfMatch[0] : rawPlayerOfMatch;

  const motmId = match.man_of_the_match_id || 
    (typeof rawPlayerOfMatch === 'object' ? rawPlayerOfMatch?.id : null) || 
    (typeof rawPlayerOfMatch === 'string' && (/^[0-9a-f-]{10,}$/i.test(rawPlayerOfMatch) || !isNaN(rawPlayerOfMatch)) ? rawPlayerOfMatch : null);

  const matchedPlayer = motmId ? players.find(p => String(p.id) === String(motmId)) : null;

  const [asyncPlayer, setAsyncPlayer] = useState(null);

  useEffect(() => {
    if (!motmId || matchedPlayer) return;
    let isMounted = true;
    import('../../lib/db').then(({ db }) => {
      db.players.get(motmId).then(p => {
        if (p && isMounted) setAsyncPlayer(p);
        else {
          db.players.toArray().then(all => {
            const found = all.find(pl => String(pl.id) === String(motmId));
            if (found && isMounted) setAsyncPlayer(found);
          });
        }
      }).catch(() => {});
    }).catch(() => {});
    return () => { isMounted = false; };
  }, [motmId, matchedPlayer]);

  const finalPlayer = matchedPlayer || asyncPlayer || (typeof playerOfMatch === 'object' ? playerOfMatch : null);

  const potmDisplayName = 
    finalPlayer?.full_name || 
    finalPlayer?.name || 
    (typeof playerOfMatch === 'string' && !/^[0-9a-f-]{10,}$/i.test(playerOfMatch) && isNaN(playerOfMatch) ? playerOfMatch : null) || 
    (motmId ? 'Official Award' : 'Not Awarded');

  const hasPotm = Boolean(potmDisplayName && potmDisplayName !== 'Not Awarded');
  const playerAvatar = finalPlayer?.avatar_url || finalPlayer?.image || null;

  // Image placeholders
  const bannerImage = match.bannerImage || "/imageformatchescard.png";

  return (
    <motion.div 
      whileTap={{ scale: 0.985 }}
      onClick={(e) => {
        haptics.light();
        if (onClick) onClick(e);
      }}
      className={`bg-white dark:bg-[#262B30] rounded-2xl cursor-pointer relative border border-slate-200 dark:border-white/10 mb-4 shadow-sm hover:shadow-xl hover:-translate-y-1 hover:border-[#A3E635] transition-all duration-300 group overflow-hidden flex flex-col w-full`}
    >
      {/* Dynamic Banner Header */}
      <div className="h-24 w-full relative">
        <img src={bannerImage} alt="Match Banner" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/40 to-slate-900/20" />
        
        {/* Banner content */}
        <div className="absolute inset-0 p-4 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 flex-wrap">
                <span className={`text-xs font-bold tracking-wider uppercase text-white/90 drop-shadow-sm`}>
                  {match.tournament || 'JDCA Official Fixtures'}
                </span>
                {totalOvers && (
                  <span className="px-2 py-0.5 rounded bg-white/20 text-white text-[10px] font-black uppercase backdrop-blur-sm border border-white/20 tracking-wider">
                    {totalOvers} Ov
                  </span>
                )}
              </div>
              {isLive ? (
                <span className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-[#A3E635]/20 text-[#A3E635] text-xs font-bold border border-[#A3E635]/40 backdrop-blur-sm">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#A3E635] animate-pulse" />
                  LIVE
                </span>
              ) : (
                <span className={`text-xs font-bold uppercase tracking-widest ${isCompleted ? 'text-white/70' : 'text-[#A3E635]'}`}>
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
            <div className="mb-4 text-xs font-bold text-slate-800 dark:text-[#F3F4F6] bg-slate-100/80 dark:bg-[#1E2226] px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700/80 flex items-center gap-2">
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
                <div className="text-base font-bold text-slate-900 dark:text-[#F3F4F6]">
                  {teamAName}
                </div>
              </div>
              {(isLive || isCompleted) && (match.home_team?.score || isLive) && (
                <div className="text-lg font-black text-slate-900 dark:text-[#F3F4F6]">
                  {match.home_team?.score || (isLive ? 'Batting' : '')}
                </div>
              )}
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-xs font-bold text-white shadow-sm">
                  {teamBName.substring(0,3).toUpperCase()}
                </div>
                <div className="text-base font-bold text-slate-900 dark:text-[#F3F4F6]">
                  {teamBName}
                </div>
              </div>
              {(isLive || isCompleted) && (match.away_team?.score || isLive) && (
                <div className="text-lg font-black text-slate-900 dark:text-[#F3F4F6]">
                  {match.away_team?.score || (isLive ? 'Yet to bat' : '')}
                </div>
              )}
            </div>
          </div>
          
          {isLive && (() => {
            const parseScore = (s) => {
              const m = String(s || '').match(/^(\d+)\/(\d+)/);
              return m ? { runs: Number(m[1]), wickets: Number(m[2]) } : null;
            };
            const parseOvers = (s) => {
              const m = String(s || '').match(/(\d+)(?:\.(\d))?/);
              if (!m) return null;
              const o = Number(m[1]);
              const b = Number(m[2] || 0);
              return o + b / 6;
            };
            const battingSide = match.home_team?.score ? match.home_team : match.away_team?.score ? match.away_team : null;
            const sc = battingSide ? parseScore(battingSide.score) : null;
            const ov = battingSide ? parseOvers(battingSide.overs) : null;
            const crr = sc && ov && ov > 0 ? (sc.runs / ov).toFixed(2) : null;
            if (!crr && !battingSide?.overs) {
              return (
                <div className="mt-4 text-xs font-semibold text-[#A3E635] bg-[#A3E635]/10 px-2.5 py-1.5 rounded-lg inline-block border border-[#A3E635]/25">
                  Scoring in progress
                </div>
              );
            }
            return (
              <div className="mt-4 text-xs font-semibold text-[#A3E635] bg-[#A3E635]/10 px-2.5 py-1.5 rounded-lg inline-block border border-[#A3E635]/25">
                {crr ? `CRR: ${crr}` : 'Live'}{battingSide?.overs ? ` · ${battingSide.overs} overs` : ''}
              </div>
            );
          })()}

          {/* Match Details Bar: Overs, Umpire, Scorer */}
          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-700/60 grid grid-cols-3 gap-2 text-[11px]">
            {/* Dynamic Overs */}
            <div className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-[#1E2226] px-2.5 py-1.5 rounded-xl border border-slate-100 dark:border-slate-700/60 min-w-0">
              <span className="text-sm shrink-0">🏏</span>
              <div className="flex flex-col min-w-0">
                <span className="text-[9px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider">Overs</span>
                <span className="font-black text-slate-900 dark:text-[#F3F4F6] truncate">
                  {totalOvers ? `${totalOvers} Ov` : (formatText || 'Standard')}
                </span>
              </div>
            </div>

            {/* Umpire */}
            <div className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-[#1E2226] px-2.5 py-1.5 rounded-xl border border-slate-100 dark:border-slate-700/60 min-w-0">
              <span className="text-sm shrink-0">⚖️</span>
              <div className="flex flex-col min-w-0">
                <span className="text-[9px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider">Umpire</span>
                <span className="font-black text-slate-900 dark:text-[#F3F4F6] truncate" title={umpireName || 'Not Assigned'}>
                  {umpireName || 'Not Assigned'}
                </span>
              </div>
            </div>

            {/* Scorer */}
            <div className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-[#1E2226] px-2.5 py-1.5 rounded-xl border border-slate-100 dark:border-slate-700/60 min-w-0">
              <span className="text-sm shrink-0">📋</span>
              <div className="flex flex-col min-w-0">
                <span className="text-[9px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider">Scorer</span>
                <span className="font-black text-slate-900 dark:text-[#F3F4F6] truncate" title={scorerName || 'Not Assigned'}>
                  {scorerName || 'Not Assigned'}
                </span>
              </div>
            </div>
          </div>

          {/* Match Performers Section */}
          {(hasPotm || isCompleted) && (
            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-700/60 flex flex-col gap-2.5">
              <span className="text-[10px] text-slate-500 dark:text-[#64748B] font-bold uppercase tracking-widest">Match Performers</span>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {/* Man of the Match */}
                <div className="flex items-center gap-3 bg-amber-500/10 dark:bg-amber-500/15 p-2.5 rounded-xl border border-amber-500/30 shadow-xs">
                    <CloudinaryAvatar src={playerAvatar} alt={potmDisplayName} className="w-10 h-10 rounded-full object-cover border-2 border-amber-400 shadow-sm shrink-0" />
                    <div className="flex flex-col flex-1 min-w-0">
                       <span className="text-[9px] text-[#F97316] dark:text-amber-400 font-black uppercase tracking-wider flex items-center gap-1">🏆 Player of the Match</span>
                       <span className="text-xs font-black text-slate-900 dark:text-[#F3F4F6] truncate">{potmDisplayName}</span>
                       <span className="text-[10px] font-semibold text-amber-700 dark:text-amber-300/80">Official Award</span>
                    </div>
                </div>

                {/* Top Batter & Bowler */}
                {(match.topBatter || match.topBowler) && (
                  <div className="flex flex-col justify-center gap-2">
                    {match.topBatter && (
                      <div className="flex items-center justify-between bg-slate-50 dark:bg-[#1E2226] p-2 rounded-lg border border-slate-100 dark:border-slate-700/60">
                        <div className="flex items-center gap-2">
                          <span className="text-xs">🏏</span>
                          <div className="flex flex-col">
                            <span className="text-[9px] text-slate-500 dark:text-[#64748B] font-bold uppercase tracking-wider">Top Batter</span>
                            <span className="text-xs font-bold text-slate-800 dark:text-[#F3F4F6]">{match.topBatter.name}</span>
                          </div>
                        </div>
                        <span className="text-xs font-black text-slate-700 dark:text-[#F3F4F6]">{match.topBatter.score || '-'}</span>
                      </div>
                    )}

                    {match.topBowler && (
                      <div className="flex items-center justify-between bg-slate-50 dark:bg-[#1E2226] p-2 rounded-lg border border-slate-100 dark:border-slate-700/60">
                        <div className="flex items-center gap-2">
                          <span className="text-xs">🎯</span>
                          <div className="flex flex-col">
                            <span className="text-[9px] text-slate-500 dark:text-[#64748B] font-bold uppercase tracking-wider">Top Bowler</span>
                            <span className="text-xs font-bold text-slate-800 dark:text-[#F3F4F6]">{match.topBowler.name}</span>
                          </div>
                        </div>
                        <span className="text-xs font-black text-slate-700 dark:text-[#F3F4F6]">{match.topBowler.score || '-'}</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
          
          {/* Footer info */}
          <div className={`mt-4 pt-3 flex items-center justify-between text-xs font-medium text-slate-500 dark:text-[#64748B] ${(!hasPotm && !isCompleted && !isLive) ? 'border-t border-slate-100 dark:border-slate-700/60' : ''}`}>
            <div className="flex items-center gap-1.5">
              <MapPin size={12} />
              {match.venue_name || match.venue || 'Unknown Venue'}
            </div>
            <div className="flex items-center gap-1 uppercase tracking-wider font-bold text-[#A3E635] group-hover:translate-x-1 transition-transform">
              MATCH CENTER
              <ArrowRight size={14} />
            </div>
          </div>
      </div>
    </motion.div>
  );
};

