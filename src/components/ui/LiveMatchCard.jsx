import React from 'react';
import { motion } from 'motion/react';
import { Radio, MapPin, Eye, Trophy, ChevronRight, Activity, Zap, Play, Pause } from 'lucide-react';
import { useCricket } from '../../context/CricketContext';
import { useHaptics } from '../../hooks/useHaptics';

export function LiveMatchCard({ match, variant = 'card', className = '', onClick }) {
  const { setActiveMatchId, activeMatchId, navigateTo, userRole, userPermissions, userId, userName, userEmail, isPaused, resumeMatch } = useCricket();
  const haptics = useHaptics();

  if (!match) return null;

  const matchIsPaused = (isPaused && activeMatchId === match.id) || (typeof localStorage !== 'undefined' && localStorage.getItem(`jdca_match_paused_${match.id}`) === 'true');
  const isLive = match.status === 'LIVE' || match.status === 'IN_PROGRESS';
  const teamAName = match.home_team?.name || 'Home Team';
  const teamBName = match.away_team?.name || 'Away Team';
  const teamAShort = match.home_team?.short_name || teamAName.substring(0, 3).toUpperCase();
  const teamBShort = match.away_team?.short_name || teamBName.substring(0, 3).toUpperCase();
  const tournamentName = match.tournaments?.name || match.tournament?.name || match.tournament || 'JDCA Championship';
  const venueName = match.venue_name || match.venue || 'Cricket Ground';
  const matchFormat = match.match_format || match.format || 'T20';

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

  const umpireName = match.umpire_name || match.umpireName || match.umpire || 
    (match.matchSetup?.umpires?.umpire1 ? [match.matchSetup.umpires.umpire1, match.matchSetup.umpires.umpire2].filter(Boolean).join(' & ') : null);
  const scorerName = match.scorer_name || match.scorerName || match.scorer || null;

  // Check if current user is the assigned scorer or an admin
  const isAssignedScorer = userRole === 'SUPER_ADMIN' || userRole === 'DISTRICT_ADMIN' || (
    (userRole === 'SCORER' || userPermissions?.can_score) && (
      match.scorer_id === userId ||
      (match.scorer_name && userName && match.scorer_name.trim().toLowerCase() === userName.trim().toLowerCase()) ||
      (match.scorer_name && userEmail && match.scorer_name.trim().toLowerCase() === userEmail.trim().toLowerCase())
    )
  );

  const handleOpenScorecard = (e) => {
    e.stopPropagation();
    haptics.light();
    setActiveMatchId(match.id);
    navigateTo('match-detail');
  };

  // "View Live" → opens the Live Center (MatchDetailScreen), which attaches the
  // on-demand realtime deliveries subscription (LiveSubscriptionManager) so the
  // viewer sees ball-by-ball updates as the scorer records them.
  const handleViewLive = (e) => {
    e.stopPropagation();
    haptics.medium();
    setActiveMatchId(match.id);
    navigateTo('match-detail');
  };

  const handleOpenScoring = (e) => {
    e.stopPropagation();
    haptics.medium();
    setActiveMatchId(match.id);
    navigateTo('scoring');
  };

  const handleCardClick = (e) => {
    haptics.light();
    if (onClick) {
      onClick(match);
    } else {
      setActiveMatchId(match.id);
      navigateTo('match-detail');
    }
  };

  // Banner variant (wide, featured header style)
  if (variant === 'banner') {
    return (
      <motion.div
        whileHover={{ y: -2 }}
        whileTap={{ scale: 0.99 }}
        onClick={handleCardClick}
        className={`bg-[#0A0A0A] text-white rounded-2xl p-4 sm:p-6 border border-[#262B30] shadow-xl relative overflow-hidden cursor-pointer group ${className}`}
      >
        <div className="absolute top-0 right-0 w-72 h-72 bg-[#A3E635]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -left-10 -bottom-10 w-60 h-60 bg-[#262B30]/40 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-black shadow-xs ${
                matchIsPaused ? 'bg-[#F97316] text-white' : 'bg-[#A3E635] text-[#0A0A0A]'
              }`}>
                <span className={`w-1.5 h-1.5 rounded-full ${matchIsPaused ? 'bg-white' : 'bg-[#0A0A0A] animate-ping'}`} />
                {matchIsPaused ? 'PAUSED' : 'LIVE'}
              </span>
              <span className="text-xs font-bold text-slate-300 bg-white/10 px-2.5 py-0.5 rounded-md border border-white/10 uppercase tracking-wider">
                {totalOvers ? `${totalOvers} Overs` : matchFormat}
              </span>
              <span className="text-xs font-semibold text-[#A3E635] truncate max-w-[200px]">
                {tournamentName}
              </span>
            </div>

            <div className="flex items-center gap-3 text-lg sm:text-xl font-black tracking-tight text-white">
              <span className="flex items-center gap-2">
                <span className="w-7 h-7 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-xs font-bold text-[#A3E635] shadow-xs">
                  {teamAShort}
                </span>
                <span>{teamAName}</span>
              </span>
              <span className="text-xs font-extrabold text-[#64748B] px-2 py-0.5 bg-white/5 rounded">VS</span>
              <span className="flex items-center gap-2">
                <span className="w-7 h-7 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-xs font-bold text-white shadow-xs">
                  {teamBShort}
                </span>
                <span>{teamBName}</span>
              </span>
            </div>

            <div className="flex items-center gap-3 text-xs text-[#64748B]">
              <span className="flex items-center gap-1">
                <MapPin size={12} className="text-[#64748B] shrink-0" />
                <span className="truncate">{venueName}</span>
              </span>
              {match.toss_decision && (
                <>
                  <span>•</span>
                  <span className="italic text-slate-300">Toss: {match.toss_decision}</span>
                </>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0 pt-2 md:pt-0">
            {isAssignedScorer && (
              <button
                onClick={handleOpenScoring}
                className="px-4 py-2 rounded-xl bg-[#A3E635] hover:bg-[#92d926] text-[#0A0A0A] font-black text-xs shadow-md shadow-lime-500/25 transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Radio size={14} className="animate-pulse" />
                <span>Score Match</span>
              </button>
            )}
            <button
              onClick={handleViewLive}
              className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs border border-white/15 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              {isLive ? <Radio size={14} className="animate-pulse" /> : <Eye size={14} />}
              <span>{isLive ? 'View Live' : 'Live Center'}</span>
            </button>
          </div>
        </div>
      </motion.div>
    );
  }

  // Standard Card variant
  return (
    <motion.div
      whileHover={{ y: -3 }}
      whileTap={{ scale: 0.985 }}
      onClick={handleCardClick}
      className={`bg-white dark:bg-[#262B30] rounded-2xl border border-slate-200 dark:border-white/10 shadow-sm hover:shadow-md hover:border-[#A3E635] transition-all p-4 flex flex-col justify-between relative overflow-hidden cursor-pointer group ${className}`}
    >
      {/* Top Banner Accent */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#A3E635] via-[#F97316] to-[#EF4444]" />

      {/* Header: Tournament + Live Badge */}
      <div className="flex items-center justify-between mb-3 pt-1">
        <div className="flex items-center gap-1.5">
          <span className={`flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
            matchIsPaused ? 'bg-amber-500/15 border border-amber-500/30 text-[#F97316]' : 'bg-[#A3E635]/15 border border-[#A3E635]/35 text-[#A3E635]'
          }`}>
            <span className={`w-1.5 h-1.5 rounded-full ${matchIsPaused ? 'bg-[#F97316]' : 'bg-[#A3E635] animate-pulse'}`} />
            {matchIsPaused ? 'PAUSED' : 'LIVE'}
          </span>
          <span className="text-[10px] font-black text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-[#1E2226] px-1.5 py-0.5 rounded uppercase">
            {totalOvers ? `${totalOvers} Ov` : matchFormat}
          </span>
        </div>
        <span className="text-xs font-semibold text-slate-500 dark:text-[#64748B] truncate max-w-[150px] text-right">
          {tournamentName}
        </span>
      </div>

      {/* Teams & Scores */}
      <div className="space-y-2.5 my-2">
        {/* Team A */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-7 h-7 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-[10px] font-black text-[#A3E635] shrink-0 shadow-xs">
              {teamAShort}
            </div>
            <span className="text-sm font-bold text-slate-900 dark:text-[#F3F4F6] truncate">
              {teamAName}
            </span>
          </div>
          <span className="text-sm font-black text-slate-900 dark:text-[#F3F4F6] tabular-nums">
            {match.home_team?.score || (isLive ? 'Batting' : '0/0')}
          </span>
        </div>

        {/* Team B */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-7 h-7 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-[10px] font-black text-white shrink-0 shadow-xs">
              {teamBShort}
            </div>
            <span className="text-sm font-bold text-slate-900 dark:text-[#F3F4F6] truncate">
              {teamBName}
            </span>
          </div>
          <span className="text-sm font-black text-slate-900 dark:text-[#F3F4F6] tabular-nums">
            {match.away_team?.score || (isLive ? 'Yet to bat' : '0/0')}
          </span>
        </div>
      </div>

      {/* Venue & Quick Status */}
      <div className="pt-2 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between text-xs text-slate-500 dark:text-[#64748B] mt-2">
        <span className="flex items-center gap-1 truncate max-w-[180px]">
          <MapPin size={11} className="text-slate-400 shrink-0" />
          <span className="truncate">{venueName}</span>
        </span>
        {match.home_team?.overs && (
          <span className="font-semibold text-[#A3E635] shrink-0">
            {match.home_team.overs} ov
          </span>
        )}
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-2 gap-2 mt-3 pt-2 border-t border-slate-100 dark:border-slate-700/60">
        <button
          onClick={handleOpenScorecard}
          className="w-full py-1.5 px-2 rounded-xl bg-slate-100 dark:bg-[#1E2226] hover:bg-slate-200 dark:hover:bg-[#282d33] text-slate-700 dark:text-[#F3F4F6] font-bold text-xs transition-colors flex items-center justify-center gap-1 cursor-pointer"
        >
          <Eye size={12} />
          <span>Scorecard</span>
        </button>

        {isAssignedScorer ? (
          <button
            onClick={(e) => {
              if (matchIsPaused) resumeMatch();
              handleOpenScoring(e);
            }}
            className="w-full py-1.5 px-2 rounded-xl bg-[#A3E635] hover:bg-[#92d926] text-[#0A0A0A] font-black text-xs transition-colors flex items-center justify-center gap-1 cursor-pointer shadow-md shadow-lime-500/20"
          >
            {matchIsPaused ? <Play size={12} fill="currentColor" /> : <Radio size={12} className="animate-pulse" />}
            <span>{matchIsPaused ? 'Resume' : 'Score Live'}</span>
          </button>
        ) : (
          <button
            onClick={handleViewLive}
            className="w-full py-1.5 px-2 rounded-xl bg-[#A3E635]/10 hover:bg-[#A3E635]/20 text-[#A3E635] font-bold text-xs transition-colors flex items-center justify-center gap-1 cursor-pointer"
          >
            {isLive ? <Radio size={12} className="animate-pulse" /> : <ChevronRight size={12} />}
            <span>{isLive ? 'View Live' : 'Match Center'}</span>
          </button>
        )}
      </div>
    </motion.div>
  );
}

export default LiveMatchCard;
