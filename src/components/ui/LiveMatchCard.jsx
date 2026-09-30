import React from 'react';
import { motion } from 'motion/react';
import { Radio, MapPin, Eye, Trophy, ChevronRight, Activity, Zap, Play, Pause } from 'lucide-react';
import { useCricket } from '../../context/CricketContext';
import { useHaptics } from '../../hooks/useHaptics';

export function LiveMatchCard({ match, variant = 'card', className = '', onClick }) {
  const { setActiveMatchId, activeMatchId, navigateTo, userRole, userId, userName, userEmail, isPaused, resumeMatch } = useCricket();
  const haptics = useHaptics();

  if (!match) return null;

  const matchIsPaused = (isPaused && activeMatchId === match.id) || (typeof localStorage !== 'undefined' && localStorage.getItem(`jdca_match_paused_${match.id}`) === 'true');
  const isLive = match.status === 'LIVE' || match.status === 'IN_PROGRESS';
  const teamAName = match.home_team?.name || match.teamA?.name || match.team1?.name || 'Home Team';
  const teamBName = match.away_team?.name || match.teamB?.name || match.team2?.name || 'Away Team';
  const teamAShort = match.home_team?.short_name || match.teamA?.short_name || teamAName.substring(0, 3).toUpperCase();
  const teamBShort = match.away_team?.short_name || match.teamB?.short_name || teamBName.substring(0, 3).toUpperCase();
  const tournamentName = match.tournaments?.name || match.tournament?.name || match.tournament || 'JDCA Championship';
  const venueName = match.venue_name || match.venue || 'Cricket Ground';
  const matchFormat = match.match_format || match.format || 'T20';

  // Check if current user is the assigned scorer or an admin
  const isAssignedScorer = userRole === 'SUPER_ADMIN' || userRole === 'DISTRICT_ADMIN' || (
    userRole === 'SCORER' && (
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
        className={`bg-gradient-to-br from-slate-900 via-slate-950 to-blue-950 text-white rounded-2xl p-4 sm:p-6 border border-slate-800 shadow-xl relative overflow-hidden cursor-pointer group ${className}`}
      >
        <div className="absolute top-0 right-0 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -left-10 -bottom-10 w-60 h-60 bg-blue-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-black shadow-xs ${
                matchIsPaused ? 'bg-amber-500 text-white' : 'bg-rose-500 text-white'
              }`}>
                <span className={`w-1.5 h-1.5 rounded-full ${matchIsPaused ? 'bg-white' : 'bg-white animate-ping'}`} />
                {matchIsPaused ? 'PAUSED' : 'LIVE'}
              </span>
              <span className="text-xs font-bold text-slate-300 bg-white/10 px-2.5 py-0.5 rounded-md border border-white/10 uppercase tracking-wider">
                {matchFormat}
              </span>
              <span className="text-xs font-semibold text-blue-300 truncate max-w-[200px]">
                {tournamentName}
              </span>
            </div>

            <div className="flex items-center gap-3 text-lg sm:text-xl font-black tracking-tight text-white">
              <span className="flex items-center gap-2">
                <span className="w-7 h-7 rounded-full bg-blue-600 flex items-center justify-center text-xs font-bold text-white shadow-xs">
                  {teamAShort}
                </span>
                <span>{teamAName}</span>
              </span>
              <span className="text-xs font-extrabold text-slate-400 px-2 py-0.5 bg-white/5 rounded">VS</span>
              <span className="flex items-center gap-2">
                <span className="w-7 h-7 rounded-full bg-emerald-600 flex items-center justify-center text-xs font-bold text-white shadow-xs">
                  {teamBShort}
                </span>
                <span>{teamBName}</span>
              </span>
            </div>

            <div className="flex items-center gap-3 text-xs text-slate-400">
              <span className="flex items-center gap-1">
                <MapPin size={12} className="text-slate-400 shrink-0" />
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
                className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Radio size={14} className="animate-pulse" />
                <span>Score Match</span>
              </button>
            )}
            <button
              onClick={handleOpenScorecard}
              className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs border border-white/15 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Eye size={14} />
              <span>Live Center</span>
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
      className={`bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all p-4 flex flex-col justify-between relative overflow-hidden cursor-pointer group ${className}`}
    >
      {/* Top Banner Accent */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-rose-500 via-amber-500 to-emerald-500" />

      {/* Header: Tournament + Live Badge */}
      <div className="flex items-center justify-between mb-3 pt-1">
        <div className="flex items-center gap-1.5">
          <span className={`flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
            matchIsPaused ? 'bg-amber-50 border border-amber-300 text-amber-800' : 'bg-rose-50 border border-rose-200 text-rose-700'
          }`}>
            <span className={`w-1.5 h-1.5 rounded-full ${matchIsPaused ? 'bg-amber-500' : 'bg-rose-500 animate-pulse'}`} />
            {matchIsPaused ? 'PAUSED' : 'LIVE'}
          </span>
          <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded uppercase">
            {matchFormat}
          </span>
        </div>
        <span className="text-xs font-semibold text-slate-500 truncate max-w-[150px] text-right">
          {tournamentName}
        </span>
      </div>

      {/* Teams & Scores */}
      <div className="space-y-2.5 my-2">
        {/* Team A */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-[10px] font-black text-white shrink-0 shadow-xs">
              {teamAShort}
            </div>
            <span className="text-sm font-bold text-slate-900 truncate">
              {teamAName}
            </span>
          </div>
          <span className="text-sm font-black text-slate-900 tabular-nums">
            {match.teamA?.score || match.home_team_score || (isLive ? 'Batting' : '0/0')}
          </span>
        </div>

        {/* Team B */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-[10px] font-black text-white shrink-0 shadow-xs">
              {teamBShort}
            </div>
            <span className="text-sm font-bold text-slate-900 truncate">
              {teamBName}
            </span>
          </div>
          <span className="text-sm font-black text-slate-900 tabular-nums">
            {match.teamB?.score || match.away_team_score || (isLive ? 'Yet to bat' : '0/0')}
          </span>
        </div>
      </div>

      {/* Venue & Quick Status */}
      <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 mt-2">
        <span className="flex items-center gap-1 truncate max-w-[180px]">
          <MapPin size={11} className="text-slate-400 shrink-0" />
          <span className="truncate">{venueName}</span>
        </span>
        {match.teamA?.overs && (
          <span className="font-semibold text-emerald-600 shrink-0">
            {match.teamA.overs} ov
          </span>
        )}
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-2 gap-2 mt-3 pt-2 border-t border-slate-100">
        <button
          onClick={handleOpenScorecard}
          className="w-full py-1.5 px-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors flex items-center justify-center gap-1 cursor-pointer"
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
            className={`w-full py-1.5 px-2 rounded-xl text-white font-bold text-xs transition-colors flex items-center justify-center gap-1 cursor-pointer shadow-xs ${
              matchIsPaused ? 'bg-emerald-600 hover:bg-emerald-500 animate-pulse' : 'bg-emerald-600 hover:bg-emerald-500'
            }`}
          >
            {matchIsPaused ? <Play size={12} fill="currentColor" /> : <Radio size={12} className="animate-pulse" />}
            <span>{matchIsPaused ? 'Resume to Continue' : 'Score Live'}</span>
          </button>
        ) : (
          <button
            onClick={handleCardClick}
            className="w-full py-1.5 px-2 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-xs transition-colors flex items-center justify-center gap-1 cursor-pointer"
          >
            <span>Match Center</span>
            <ChevronRight size={12} />
          </button>
        )}
      </div>
    </motion.div>
  );
}

export default LiveMatchCard;
