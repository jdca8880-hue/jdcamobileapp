import React, { useState, useEffect } from 'react';
import {
  Users, Trophy, MapPin, Radio, Calendar, Plus,
  TrendingUp, Megaphone, ChevronRight, Activity,
  Award, Clipboard, Flame, Shield, Eye, Star,
  Zap, BarChart3, UserCheck, Sparkles
} from 'lucide-react';
import { useStandings } from '../../lib/standings';
import { useCricket } from '../../context/CricketContext';
import { motion } from 'motion/react';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.06 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 14 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] }
  }
};

const DISTRICT_BRIGHT_CARDS = [
  { card: 'bg-white border border-slate-200 border-l-4 border-l-blue-500 shadow-sm', badge: 'bg-blue-50 text-blue-700', statBox: 'bg-slate-50 border-slate-100', btn: 'bg-blue-50 text-blue-700 hover:bg-blue-100', accentText: 'text-blue-600' },
  { card: 'bg-white border border-slate-200 border-l-4 border-l-emerald-500 shadow-sm', badge: 'bg-emerald-50 text-emerald-700', statBox: 'bg-slate-50 border-slate-100', btn: 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100', accentText: 'text-emerald-600' },
  { card: 'bg-white border border-slate-200 border-l-4 border-l-amber-500 shadow-sm', badge: 'bg-amber-50 text-amber-700', statBox: 'bg-slate-50 border-slate-100', btn: 'bg-amber-50 text-amber-700 hover:bg-amber-100', accentText: 'text-amber-600' },
  { card: 'bg-white border border-slate-200 border-l-4 border-l-rose-500 shadow-sm', badge: 'bg-rose-50 text-rose-700', statBox: 'bg-slate-50 border-slate-100', btn: 'bg-rose-50 text-rose-700 hover:bg-rose-100', accentText: 'text-rose-600' },
  { card: 'bg-white border border-slate-200 border-l-4 border-l-purple-500 shadow-sm', badge: 'bg-purple-50 text-purple-700', statBox: 'bg-slate-50 border-slate-100', btn: 'bg-purple-50 text-purple-700 hover:bg-purple-100', accentText: 'text-purple-600' },
  { card: 'bg-white border border-slate-200 border-l-4 border-l-cyan-500 shadow-sm', badge: 'bg-cyan-50 text-cyan-700', statBox: 'bg-slate-50 border-slate-100', btn: 'bg-cyan-50 text-cyan-700 hover:bg-cyan-100', accentText: 'text-cyan-600' },
  { card: 'bg-white border border-slate-200 border-l-4 border-l-orange-500 shadow-sm', badge: 'bg-orange-50 text-orange-700', statBox: 'bg-slate-50 border-slate-100', btn: 'bg-orange-50 text-orange-700 hover:bg-orange-100', accentText: 'text-orange-600' },
  { card: 'bg-white border border-slate-200 border-l-4 border-l-teal-500 shadow-sm', badge: 'bg-teal-50 text-teal-700', statBox: 'bg-slate-50 border-slate-100', btn: 'bg-teal-50 text-teal-700 hover:bg-teal-100', accentText: 'text-teal-600' },
  { card: 'bg-white border border-slate-200 border-l-4 border-l-pink-500 shadow-sm', badge: 'bg-pink-50 text-pink-700', statBox: 'bg-slate-50 border-slate-100', btn: 'bg-pink-50 text-pink-700 hover:bg-pink-100', accentText: 'text-pink-600' },
];

const ANNOUNCEMENT_BRIGHT_CARDS = [
  'bg-cyan-50 text-cyan-900 border-cyan-200',
  'bg-emerald-50 text-emerald-900 border-emerald-200',
  'bg-amber-50 text-amber-900 border-amber-200',
  'bg-purple-50 text-purple-900 border-purple-200',
];

export default function HomeScreen() {
  const {
    matches = [],
    players = [],
    shortlistedIds = [],
    tournaments = [],
    districtStats = [],
    announcements = [],
    navigateTo,
    setActiveMatchId,
    setSelectedPlayer,
    runs,
    wickets,
    balls,
    formatOvers,
    striker,
    currentBowler
  } = useCricket();

  const [activeTab, setActiveTab] = useState('overview'); // overview, live, districts, standings
  const [selectedTournamentTab, setSelectedTournamentTab] = useState(null);
  const [districtFilter, setDistrictFilter] = useState('All');

  // Update selected tournament tab if not set and tournaments are loaded
  useEffect(() => {
    if (!selectedTournamentTab && tournaments?.length > 0) {
      setSelectedTournamentTab(tournaments[0].id);
    }
  }, [tournaments, selectedTournamentTab]);

  const activeTournamentPointsTable = useStandings(
    matches.filter(m => m.tournament_id === selectedTournamentTab || m.tournament === selectedTournamentTab)
  );

  const liveMatches = matches.filter(m => m.status === 'LIVE' || m.status === 'IN_PROGRESS');
  const upcomingMatches = matches.filter(m => m.status === 'UPCOMING' || m.status === 'SCHEDULED');

  // Top performers
  const topBatters = [...players]
    .sort((a, b) => (b.careerRuns || 0) - (a.careerRuns || 0))
    .slice(0, 4);

  const topBowlers = [...players]
    .filter(p => (p.wickets || 0) > 0)
    .sort((a, b) => (b.wickets || 0) - (a.wickets || 0))
    .slice(0, 4);

  // Filtered districts
  const filteredDistricts = districtFilter === 'All'
    ? districtStats
    : districtStats.filter(d => d.district === districtFilter);

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="pb-24 bg-[#F8FAFC] min-h-screen relative"
    >
      {/* Ambient Glow */}
      <div className="absolute top-40 -left-20 w-96 h-96 bg-blue-500/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-1/2 -right-20 w-[30rem] h-[30rem] bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-20 left-1/3 w-96 h-96 bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none" />
      {/* ── Top Hero Command Banner ─────────────────────────────────── */}
      <div className="relative text-white border-b border-slate-800 shadow-md overflow-hidden bg-slate-900">
        <div 
          className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat opacity-50 mix-blend-lighten"
          style={{ backgroundImage: `url('/imageforreplacemet.png')` }}
        ></div>
        <div className="absolute inset-0 z-0 bg-gradient-to-b from-slate-900/70 via-transparent to-slate-900/90 pointer-events-none"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8 relative z-10">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 sm:gap-5">
            {/* Title & Badge */}
            <div className="flex items-start gap-3 sm:gap-4">
              <img
                src="/jdca-logo.png"
                alt="JDCA Official Crest"
                className="w-16 h-16 sm:w-20 sm:h-20 object-contain drop-shadow-xl flex-shrink-0 hidden sm:block"
              />
              <div>
                <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mb-1.5 sm:mb-2">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-500/20 text-blue-300 border border-blue-400/30">
                    <Shield size={12} className="text-blue-400" />
                    Jabalpur Division Cricket Association
                  </span>
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    {liveMatches.length} Live
                  </span>
                  <span className="text-xs text-slate-400 hidden sm:inline">Season 2026</span>
                </div>

                <h1 className="text-xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
                  <span>Cricket Operations Hub</span>
                </h1>
                <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
                  Centralized command center for live scoring, player evaluations, district matches, and tournaments across 9 districts.
                </p>
              </div>
            </div>

            {/* Top Right Quick Status */}
            <div className="flex items-center gap-2 bg-white/5 backdrop-blur-md px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl border border-white/10 self-start md:self-center">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs font-semibold text-slate-200">9 Districts Connected</span>
            </div>
          </div>

          {/* ── KPI Stat Summary Cards ──────────────────────────────────── */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-4 mt-4 sm:mt-8">
            {/* Live Matches Card - Emerald */}
            <motion.div
              variants={itemVariants}
              onClick={() => navigateTo('matches')}
              className="bg-white border border-slate-200 border-l-4 border-l-emerald-500 hover:scale-[1.03] transition-all rounded-2xl p-3 sm:p-4 shadow-sm cursor-pointer group relative overflow-hidden"
            >
              <div className="flex items-center justify-between text-slate-500 text-xs font-bold">
                <span className="flex items-center gap-1.5 uppercase tracking-wider text-xs">
                  <Radio size={13} className="text-emerald-500 animate-pulse" />
                  Live Matches
                </span>
                <ChevronRight size={13} className="opacity-70 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all text-emerald-600" />
              </div>
              <div className="text-xl sm:text-3xl font-black text-slate-900 mt-1.5 sm:mt-2 tabular-nums">
                {liveMatches.length}
              </div>
              <div className="text-xs sm:text-xs text-emerald-600 font-medium mt-0.5 flex items-center gap-1 truncate">
                <Activity size={11} />
                <span>In-progress active</span>
              </div>
            </motion.div>

            {/* Registered Players Card - Blue */}
            <motion.div
              variants={itemVariants}
              onClick={() => navigateTo('players')}
              className="bg-white border border-slate-200 border-l-4 border-l-blue-500 hover:scale-[1.03] transition-all rounded-2xl p-3 sm:p-4 shadow-sm cursor-pointer group relative overflow-hidden"
            >
              <div className="flex items-center justify-between text-slate-500 text-xs font-bold">
                <span className="flex items-center gap-1.5 uppercase tracking-wider text-xs">
                  <Users size={13} className="text-blue-500" />
                  Registered Players
                </span>
                <ChevronRight size={13} className="opacity-70 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all text-blue-600" />
              </div>
              <div className="text-xl sm:text-3xl font-black text-slate-900 mt-1.5 sm:mt-2 tabular-nums">
                {players.length}
              </div>
              <div className="text-xs sm:text-xs text-blue-600 font-medium mt-0.5 flex items-center gap-1 truncate">
                <TrendingUp size={11} />
                <span>9 Districts active</span>
              </div>
            </motion.div>

            {/* Tournaments Card - Amber */}
            <motion.div
              variants={itemVariants}
              onClick={() => navigateTo('tournaments')}
              className="bg-white border border-slate-200 border-l-4 border-l-amber-500 hover:scale-[1.03] transition-all rounded-2xl p-3 sm:p-4 shadow-sm cursor-pointer group relative overflow-hidden"
            >
              <div className="flex items-center justify-between text-slate-500 text-xs font-bold">
                <span className="flex items-center gap-1.5 uppercase tracking-wider text-xs">
                  <Trophy size={13} className="text-amber-500" />
                  Tournaments
                </span>
                <ChevronRight size={13} className="opacity-70 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all text-amber-600" />
              </div>
              <div className="text-xl sm:text-3xl font-black text-slate-900 mt-1.5 sm:mt-2 tabular-nums">
                {tournaments.length}
              </div>
              <div className="text-xs sm:text-xs text-amber-600 font-medium mt-0.5 flex items-center gap-1 truncate">
                <Flame size={11} />
                <span>T20 & One Day</span>
              </div>
            </motion.div>

            {/* Selected Talent Card - Purple */}
            <motion.div
              variants={itemVariants}
              onClick={() => navigateTo('selection')}
              className="bg-white border border-slate-200 border-l-4 border-l-purple-500 hover:scale-[1.03] transition-all rounded-2xl p-3 sm:p-4 shadow-sm cursor-pointer group relative overflow-hidden"
            >
              <div className="flex items-center justify-between text-slate-500 text-xs font-bold">
                <span className="flex items-center gap-1.5 uppercase tracking-wider text-xs">
                  <Star size={13} className="text-purple-500" />
                  Selected Talent
                </span>
                <ChevronRight size={13} className="opacity-70 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all text-purple-600" />
              </div>
              <div className="text-xl sm:text-3xl font-black text-slate-900 mt-1.5 sm:mt-2 tabular-nums">
                {shortlistedIds.length}
              </div>
              <div className="text-xs sm:text-xs text-purple-600 font-medium mt-0.5 flex items-center gap-1 truncate">
                <Sparkles size={11} />
                <span>Ready for team</span>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* ── Main Dashboard Body ─────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8 space-y-7">
        
        {/* Navigation / Filter Tabs */}
        <div className="flex items-center justify-between border-b border-slate-200 pb-3">
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
            {[
              { id: 'overview', label: 'Executive Overview', icon: BarChart3 },
              { id: 'live', label: `Live Center (${liveMatches.length})`, icon: Radio },
              { id: 'districts', label: '9 Districts Radar', icon: MapPin },
              { id: 'standings', label: 'Points Standings', icon: Trophy },
            ].map(tab => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition cursor-pointer shrink-0 ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                  }`}
                >
                  <Icon size={15} className={isActive ? 'text-white' : 'text-slate-500'} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* ── TAB 1: EXECUTIVE OVERVIEW ──────────────────────────────── */}
        {activeTab === 'overview' && (
          <div className="space-y-7">
            {/* Quick Actions Grid */}
            <div>
              <div className="flex items-center justify-between mb-3 px-1">
                <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                  <Zap size={14} className="text-amber-500" />
                  <span>Rapid Operations Console</span>
                </h2>
                <span className="text-xs text-slate-400">1-Click Launch</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <motion.div
                  variants={itemVariants}
                  onClick={() => navigateTo('scoring')}
                  className="bg-white p-4 rounded-2xl border border-slate-200 border-l-4 border-l-emerald-500 hover:scale-[1.03] hover:shadow-md shadow-sm transition-all cursor-pointer group flex flex-col justify-between relative overflow-hidden"
                >
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                    <Radio size={20} />
                  </div>
                  <div>
                    <div className="text-sm font-black text-slate-900">
                      Live Scoring Desk
                    </div>
                    <div className="text-xs text-slate-500 mt-0.5 font-medium">Ball-by-ball console & wagon wheel</div>
                  </div>
                </motion.div>

                <motion.div
                  variants={itemVariants}
                  onClick={() => navigateTo('selection')}
                  className="bg-white p-4 rounded-2xl border border-slate-200 border-l-4 border-l-blue-500 hover:scale-[1.03] hover:shadow-md shadow-sm transition-all cursor-pointer group flex flex-col justify-between relative overflow-hidden"
                >
                  <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                    <Clipboard size={20} />
                  </div>
                  <div>
                    <div className="text-sm font-black text-slate-900">
                      Team Selection
                    </div>
                    <div className="text-xs text-slate-500 mt-0.5 font-medium">Choose 15 players for each team</div>
                  </div>
                </motion.div>

                <motion.div
                  variants={itemVariants}
                  onClick={() => navigateTo('player-registration')}
                  className="bg-white p-4 rounded-2xl border border-slate-200 border-l-4 border-l-purple-500 hover:scale-[1.03] hover:shadow-md shadow-sm transition-all cursor-pointer group flex flex-col justify-between relative overflow-hidden"
                >
                  <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                    <Users size={20} />
                  </div>
                  <div>
                    <div className="text-sm font-black text-slate-900">
                      Register Player
                    </div>
                    <div className="text-xs text-slate-500 mt-0.5 font-medium">Onboard talent from 9 districts</div>
                  </div>
                </motion.div>

                <motion.div
                  variants={itemVariants}
                  onClick={() => navigateTo('administration')}
                  className="bg-white p-4 rounded-2xl border border-slate-200 border-l-4 border-l-amber-500 hover:scale-[1.03] hover:shadow-md shadow-sm transition-all cursor-pointer group flex flex-col justify-between relative overflow-hidden"
                >
                  <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                    <Shield size={20} />
                  </div>
                  <div>
                    <div className="text-sm font-black text-slate-900">
                      Admin & Governance
                    </div>
                    <div className="text-xs text-slate-500 mt-0.5 font-medium">Role permissions & grounds</div>
                  </div>
                </motion.div>
              </div>
            </div>

            {/* Featured Live Match Banner / Card */}
            {liveMatches.length > 0 && (
              <motion.div variants={itemVariants} className="space-y-3">
                <div className="flex items-center justify-between px-1">
                  <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                    <span>Featured Live Match Center</span>
                  </h2>
                  <button
                    onClick={() => navigateTo('matches')}
                    className="text-xs text-blue-600 hover:underline font-semibold flex items-center gap-1 cursor-pointer"
                  >
                    <span>View All ({matches.length})</span>
                    <ChevronRight size={13} />
                  </button>
                </div>

                <div className="bg-gradient-to-br from-slate-900 to-blue-950 text-white rounded-2xl p-5 sm:p-6 border border-slate-800 shadow-lg relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
                  
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
                    {/* Left: Tournament & Venue Info */}
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500 text-slate-950">
                          LIVE NOW
                        </span>
                        <span className="text-xs text-blue-300 font-medium">
                          {liveMatches[0].tournament || 'TBA'}
                        </span>
                      </div>
                      <div className="text-xl sm:text-2xl font-black tracking-tight text-white flex items-center gap-3">
                        <span>{liveMatches[0].teamA?.name || liveMatches[0].teamA || 'TBA'}</span>
                        <span className="text-xs font-semibold px-2 py-0.5 bg-white/10 rounded-md text-slate-300">VS</span>
                        <span>{liveMatches[0].teamB?.name || liveMatches[0].teamB || 'TBA'}</span>
                      </div>
                      <div className="text-xs text-slate-400 flex items-center gap-2">
                        <MapPin size={13} className="text-slate-400" />
                        <span>{liveMatches[0].venue || 'TBA'}</span>
                        <span>•</span>
                        <span>Toss: {liveMatches[0].toss_winner_id ? (liveMatches[0].teamA?.id === liveMatches[0].toss_winner_id ? (liveMatches[0].teamA?.name || liveMatches[0].teamA) : (liveMatches[0].teamB?.name || liveMatches[0].teamB)) : 'TBA'} elected to {liveMatches[0].toss_decision?.toLowerCase() || 'bat'}</span>
                      </div>
                    </div>

                    {/* Middle: Live Score Highlight */}
                    <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/10 flex items-center justify-around sm:justify-start gap-6">
                      <div>
                        <div className="text-xs text-slate-300 uppercase tracking-wider font-semibold">
                          {liveMatches[0].teamA?.name || 'Jabalpur'} Score
                        </div>
                        <div className="text-3xl font-extrabold text-white mt-0.5 tabular-nums">
                          {runs}/{wickets}
                        </div>
                        <div className="text-xs text-emerald-300 font-medium mt-0.5">
                          Overs: {formatOvers(balls)} (CRR: {((runs / (balls || 1)) * 6).toFixed(2)})
                        </div>
                      </div>

                      <div className="h-10 w-px bg-white/15" />

                      <div className="text-xs space-y-1">
                        <div className="text-slate-300">
                          <span className="text-slate-400">Striker: </span>
                          <span className="font-semibold text-white">{striker?.name || 'Batter'}</span> ({striker?.runs || 0}*)
                        </div>
                        <div className="text-slate-300">
                          <span className="text-slate-400">Bowler: </span>
                          <span className="font-semibold text-white">{currentBowler?.name || 'Bowler'}</span> ({currentBowler?.wickets || 0}/{currentBowler?.runs || 0})
                        </div>
                      </div>
                    </div>

                    {/* Right: Actions */}
                    <div className="flex flex-col sm:flex-row lg:flex-col gap-2 shrink-0">
                      <button
                        onClick={() => {
                          setActiveMatchId(liveMatches[0].id);
                          navigateTo('scoring');
                        }}
                        className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-md transition flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <Radio size={15} />
                        <span>Open Live Scoring Desk</span>
                      </button>
                      <button
                        onClick={() => {
                          setActiveMatchId(liveMatches[0].id);
                          navigateTo('scorecard');
                        }}
                        className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs border border-white/15 transition flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <Eye size={15} />
                        <span>View Full Scorecard</span>
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* ── Two Column Layout: Top Talent Spotlight & Points Table Preview ── */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left Column: Top Performers (7 cols) */}
              <div className="lg:col-span-7 space-y-6">
                <div className="bg-white/60 backdrop-blur-xl rounded-2xl p-5 border border-white/50 shadow-lg shadow-blue-900/5 space-y-4 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full blur-2xl pointer-events-none" />
                  <div className="flex items-center justify-between pb-3 border-b border-slate-200/50 relative z-10">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-400 to-orange-500 text-white flex items-center justify-center shadow-md shadow-amber-500/20">
                        <Award size={18} />
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-slate-900">Season Leaderboards & Star Performers</h3>
                        <p className="text-xs text-slate-500">Top batting and bowling metrics across JDCA</p>
                      </div>
                    </div>
                    <button
                      onClick={() => navigateTo('players')}
                      className="text-xs font-semibold text-blue-600 hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <span>All Players</span>
                      <ChevronRight size={13} />
                    </button>
                  </div>

                  {/* Top Run Scorers */}
                  <div>
                    <div className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-amber-500" />
                      <span>Leading Run Scorers (Orange Cap Race)</span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 relative z-10">
                      {topBatters.map((batter, idx) => {
                        const bgClass = 'bg-white border-l-4 border-l-amber-500 border-slate-200 shadow-sm hover:shadow-md hover:-translate-y-1';
                        return (
                          <div
                            key={batter.id || idx}
                            onClick={() => {
                              setSelectedPlayer(batter);
                              navigateTo('player-profile');
                            }}
                            className={`p-3.5 rounded-2xl ${bgClass} border hover:scale-[1.03] transition-all duration-300 cursor-pointer flex items-center justify-between group relative overflow-hidden`}
                          >
                            <div className="flex items-center gap-2.5 relative z-10">
                              <span className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-black bg-amber-50 text-amber-700 border border-amber-200 text-slate-900 shadow-sm">
                                {idx + 1}
                              </span>
                              <img
                                src={batter.avatar}
                                alt={batter.name}
                                className="w-10 h-10 rounded-full object-cover border-2 border-slate-200 shadow-sm"
                              />
                              <div>
                                <div className="text-xs font-black text-slate-900">
                                  {batter.name}
                                </div>
                                <div className="text-xs text-slate-500">{batter.district || 'Jabalpur'} • {batter.category || 'Senior'}</div>
                              </div>
                            </div>
                            <div className="text-right relative z-10">
                              <div className="text-base font-black text-slate-900 tabular-nums drop-shadow-sm">
                                {batter.careerRuns || 0}
                              </div>
                              <div className="text-xs font-bold text-slate-500">Avg {batter.battingAvg || 0}</div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Top Wicket Takers */}
                  <div className="pt-2">
                    <div className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-purple-500" />
                      <span>Leading Wicket Takers (Purple Cap Race)</span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 relative z-10">
                      {topBowlers.map((bowler, idx) => {
                        const bgClass = 'bg-white border-l-4 border-l-purple-500 border-slate-200 shadow-sm hover:shadow-md hover:-translate-y-1';
                        return (
                          <div
                            key={bowler.id || idx}
                            onClick={() => {
                              setSelectedPlayer(bowler);
                              navigateTo('player-profile');
                            }}
                            className={`p-3.5 rounded-2xl ${bgClass} border hover:scale-[1.03] transition-all duration-300 cursor-pointer flex items-center justify-between group relative overflow-hidden`}
                          >
                            <div className="flex items-center gap-2.5 relative z-10">
                              <span className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-black bg-purple-50 text-purple-700 border border-purple-200 text-slate-900 shadow-sm">
                                {idx + 1}
                              </span>
                              <img
                                src={bowler.avatar}
                                alt={bowler.name}
                                className="w-10 h-10 rounded-full object-cover border-2 border-slate-200 shadow-sm"
                              />
                              <div>
                                <div className="text-xs font-black text-slate-900">
                                  {bowler.name}
                                </div>
                                <div className="text-xs text-slate-500">{bowler.district || 'Unknown'} • {bowler.role || 'Bowler'}</div>
                              </div>
                            </div>
                            <div className="text-right relative z-10">
                              <div className="text-base font-black text-slate-900 tabular-nums drop-shadow-sm">
                                {bowler.wickets || 0} Wkts
                              </div>
                              <div className="text-xs font-bold text-slate-500">Econ {bowler.economy || '0.0'}</div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* 9 Districts Quick Radar */}
                <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                        <MapPin size={18} />
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-slate-900">JDCA 9-District Overview</h3>
                        <p className="text-xs text-slate-500">Player counts, grounds, and district heads</p>
                      </div>
                    </div>
                    <button
                      onClick={() => setActiveTab('districts')}
                      className="text-xs font-semibold text-blue-600 hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <span>Explore Radar</span>
                      <ChevronRight size={13} />
                    </button>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                    {districtStats.slice(0, 6).map((d, i) => {
                      const cfg = DISTRICT_BRIGHT_CARDS[i % DISTRICT_BRIGHT_CARDS.length];
                      return (
                        <div
                          key={i}
                          onClick={() => {
                            setActiveTab('districts');
                            setDistrictFilter(d.district);
                          }}
                          className={`p-3.5 rounded-2xl ${cfg.card} border transition-all duration-300 hover:scale-[1.04] cursor-pointer relative overflow-hidden`}
                        >
                          <div className="text-xs font-black">{d.district}</div>
                          <div className="text-base font-black mt-1 tabular-nums">
                            {d.totalPlayers} <span className="text-xs font-bold opacity-80">players</span>
                          </div>
                          <div className="text-xs font-medium mt-1 opacity-90 truncate">Top: {d.topPlayer}</div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Right Column: Points Table Snapshot & Official Notice Board (5 cols) */}
              <div className="lg:col-span-5 space-y-6">
                
                {/* Standings Snapshot */}
                <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs space-y-3.5">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                        <Trophy size={18} />
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-slate-900">District Standings</h3>
                        <p className="text-xs text-slate-500">JDCA T20 Blast 2026</p>
                      </div>
                    </div>
                    <button onClick={() => setActiveTab('standings')} className="text-blue-600 text-[11px] font-bold hover:underline cursor-pointer">
                      Full Table →
                    </button>
                  </div>

                  {/* Compact Table */}
                  <div className="overflow-x-auto pb-1">
                    <table className="w-full text-left min-w-[200px] text-[12px]">
                      <thead>
                        <tr className="border-b border-slate-100 text-slate-400">
                          <th className="py-2 px-1 w-6">#</th>
                          <th className="py-2 px-1">Team</th>
                          <th className="py-2 px-1 text-center">Pts</th>
                          <th className="py-2 px-1 text-right">NRR</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {activeTournamentPointsTable.slice(0, 5).map((row, idx) => (
                          <tr key={idx} className="hover:bg-slate-50 transition-colors">
                            <td className="py-2.5 px-1 font-bold text-slate-600">{idx + 1}</td>
                            <td className="py-2.5 px-1 font-semibold text-slate-900 flex items-center gap-1.5">
                              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: row.color || '#2457D6' }} />
                              <span className="truncate max-w-[120px]">{row.team}</span>
                            </td>
                            <td className="py-2.5 px-1 text-center font-extrabold text-blue-700">{row.pts}</td>
                            <td className="py-2.5 px-1 text-right font-mono text-slate-600">{row.nrr}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>



                {/* Upcoming Fixtures Mini List */}
                <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                      <Calendar size={14} className="text-blue-600" />
                      <span>Upcoming Fixtures</span>
                    </h3>
                    <button
                      onClick={() => navigateTo('matches')}
                      className="text-xs text-blue-600 hover:underline font-semibold cursor-pointer"
                    >
                      Full Calendar
                    </button>
                  </div>

                  <div className="space-y-2">
                    {upcomingMatches.slice(0, 2).map((m, i) => {
                      const bg = 'bg-white border border-slate-200 shadow-sm';
                      return (
                        <div key={i} className={`p-3.5 rounded-2xl ${bg} border flex items-center justify-between hover:scale-[1.02] transition-all`}>
                          <div>
                            <div className="text-xs font-black text-slate-900">
                              {m.teamA?.name || m.teamA} vs {m.teamB?.name || m.teamB}
                            </div>
                            <div className="text-xs text-slate-500 mt-0.5 font-medium">
                              {m.date || 'Tomorrow'} • {m.venue || 'Ranital Ground'}
                            </div>
                          </div>
                          <span className="text-xs font-black px-2.5 py-1 bg-slate-100 text-slate-700 rounded-lg border border-slate-200">
                            {m.format || 'T20'}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

              </div>
            </div>
          </div>
        )}

        {/* ── TAB 2: LIVE CENTER ────────────────────────────────────── */}
        {activeTab === 'live' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between px-1">
              <div>
                <h2 className="text-base font-bold text-slate-900">Live Match Console & In-Play Games</h2>
                <p className="text-xs text-slate-500">Real-time ball tracking and match status across grounds</p>
              </div>
              <button
                onClick={() => navigateTo('scoring')}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-sm transition cursor-pointer flex items-center gap-1.5"
              >
                <Radio size={14} />
                <span>Go to Active Scorer Desk</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {liveMatches.map((match, idx) => {
                const liveGradients = [
                  'bg-gradient-to-br from-blue-900 via-indigo-950 to-slate-950 border-2 border-blue-400/50 shadow-xl shadow-blue-950/40 text-white',
                  'bg-gradient-to-br from-emerald-950 via-teal-950 to-slate-900 border-2 border-emerald-400/50 shadow-xl shadow-emerald-950/40 text-white',
                  'bg-gradient-to-br from-purple-950 via-fuchsia-950 to-slate-900 border-2 border-purple-400/50 shadow-xl shadow-purple-950/40 text-white',
                ];
                const bg = liveGradients[idx % liveGradients.length];
                return (
                  <div
                    key={match.id}
                    className={`${bg} rounded-2xl p-5 shadow-lg space-y-4 relative overflow-hidden`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500 text-slate-950 flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-slate-950 animate-pulse" />
                          LIVE
                        </span>
                        <span className="text-xs font-semibold text-slate-200">{match.tournament}</span>
                      </div>
                      <span className="text-xs text-slate-300 font-medium">{match.category || match.format}</span>
                    </div>

                    {/* Team A vs Team B */}
                    <div className="space-y-2.5">
                      <div className="flex items-center justify-between p-3 bg-white/10 backdrop-blur-md rounded-xl border border-white/10">
                        <div className="font-bold text-sm text-white flex items-center gap-2">
                          <span>{match.teamA?.logo || '🏏'}</span>
                          <span>{match.teamA?.name}</span>
                        </div>
                        <div className="text-base font-extrabold text-amber-300 tabular-nums">
                          {match.id === 'match-live-1' ? `${runs}/${wickets}` : match.teamA?.score}
                          <span className="text-xs font-medium text-slate-300 ml-1.5">
                            ({match.id === 'match-live-1' ? formatOvers(balls) : match.teamA?.overs})
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between p-3 bg-white/10 backdrop-blur-md rounded-xl border border-white/10">
                        <div className="font-bold text-sm text-white flex items-center gap-2">
                          <span>{match.teamB?.logo || '⚡'}</span>
                          <span>{match.teamB?.name}</span>
                        </div>
                        <div className="text-sm font-semibold text-slate-300">
                          {match.teamB?.score || 'Yet to bat'}
                        </div>
                      </div>
                    </div>

                    <div className="text-xs text-slate-300 flex items-center gap-2">
                      <MapPin size={13} className="text-slate-400" />
                      <span>{match.venue}</span>
                    </div>

                    {/* Action buttons */}
                    <div className="grid grid-cols-2 gap-2 pt-2 border-t border-white/15">
                      <button
                        onClick={() => {
                          setActiveMatchId(match.id);
                          navigateTo('scoring');
                        }}
                        className="w-full py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-xl text-xs font-bold transition cursor-pointer flex items-center justify-center gap-1.5 shadow-md"
                      >
                        <Radio size={14} />
                        <span>Live Scoring</span>
                      </button>
                      <button
                        onClick={() => {
                          setActiveMatchId(match.id);
                          navigateTo('scorecard');
                        }}
                        className="w-full py-2 bg-white/15 hover:bg-white/25 text-white rounded-xl text-xs font-semibold border border-white/20 transition cursor-pointer flex items-center justify-center gap-1.5"
                      >
                        <Eye size={14} />
                        <span>Scorecard</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ── TAB 3: 9 DISTRICTS RADAR ──────────────────────────────── */}
        {activeTab === 'districts' && (
          <div className="space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-base font-bold text-slate-900">JDCA 9-District Cricket Infrastructure & Talent Pool</h2>
                <p className="text-xs text-slate-500">Distribution of registered cricketers, official grounds, and selectors</p>
              </div>

              {/* District Filter Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-2 py-1">
                {['All', 'Jabalpur', 'Katni', 'Narsinghpur', 'Seoni', 'Mandla', 'Balaghat', 'Chhindwara', 'Dindori', 'Pandhurna'].map(d => (
                  <button
                    key={d}
                    onClick={() => setDistrictFilter(d)}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold transition cursor-pointer shrink-0 ${
                      districtFilter === d
                        ? 'bg-blue-600 text-white'
                        : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                    }`}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredDistricts.map((item, idx) => {
                const cfg = DISTRICT_BRIGHT_CARDS[idx % DISTRICT_BRIGHT_CARDS.length];
                return (
                  <div
                    key={idx}
                    className={`rounded-2xl p-5 ${cfg.card} border shadow-lg hover:scale-[1.02] transition space-y-4 group relative overflow-hidden`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-base font-black text-white group-hover:underline transition-colors">
                          {item.district} District
                        </h3>
                        <p className="text-xs text-slate-500">Official Association Zone</p>
                      </div>
                      <span className="px-2.5 py-1 rounded-lg bg-white/20 text-white text-xs font-bold border border-white/30 backdrop-blur-xs">
                        {item.grounds} Grounds
                      </span>
                    </div>

                    <div className="grid grid-cols-3 gap-2 p-3 bg-white/15 backdrop-blur-md rounded-xl text-center border border-white/20">
                      <div>
                        <div className="text-xs text-slate-500 font-medium">Total</div>
                        <div className="text-base font-black text-white tabular-nums">{item.totalPlayers}</div>
                      </div>
                      <div>
                        <div className="text-xs text-slate-500 font-medium">Senior</div>
                        <div className="text-base font-black text-white tabular-nums">{item.seniorPlayers}</div>
                      </div>
                      <div>
                        <div className="text-xs text-slate-500 font-medium">Under-19</div>
                        <div className="text-base font-black text-white tabular-nums">{item.u19Players}</div>
                      </div>
                    </div>

                    <div className="space-y-1 text-xs">
                      <div className="flex items-center justify-between text-white/90">
                        <span>Top Prospect:</span>
                        <span className="font-bold text-white">{item.topPlayer}</span>
                      </div>
                      <div className="flex items-center justify-between text-white/90">
                        <span>New Registrations:</span>
                        <span className="font-bold text-emerald-200">+{item.registeredThisSeason} this season</span>
                      </div>
                    </div>

                    <button
                      onClick={() => navigateTo('players')}
                      className={`w-full py-2 ${cfg.btn} rounded-xl text-xs font-bold shadow-md transition cursor-pointer flex items-center justify-center gap-1`}
                    >
                      <span>View District Players</span>
                      <ChevronRight size={13} />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ── TAB 4: STANDINGS ──────────────────────────────────────── */}
        {activeTab === 'standings' && (
          <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-2xs space-y-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
              <div>
                <h2 className="text-base font-bold text-slate-900">Official Tournament Points Standings</h2>
                <p className="text-[12px] text-slate-500 mt-0.5">Select a tournament below to view the current points table.</p>
              </div>

              <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1 w-full sm:w-auto">
                {tournaments.length === 0 ? (
                  <span className="text-xs text-slate-400">No tournaments available</span>
                ) : (
                  tournaments.map(t => (
                    <button
                      key={t.id}
                      onClick={() => setSelectedTournamentTab(t.id)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
                        selectedTournamentTab === t.id
                          ? 'bg-blue-600 text-white'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {t.name}
                    </button>
                  ))
                )}
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead>
                  <tr className="bg-slate-50 text-slate-500 font-bold border-y border-slate-200">
                    <th className="py-3 px-3">Rank</th>
                    <th className="py-3 px-3">Team</th>
                    <th className="py-3 px-2 text-center">Played</th>
                    <th className="py-3 px-2 text-center">Won</th>
                    <th className="py-3 px-2 text-center">Lost</th>
                    <th className="py-3 px-2 text-center">Tied/NR</th>
                    <th className="py-3 px-2 text-center">Points</th>
                    <th className="py-3 px-3 text-right">NRR</th>
                    <th className="py-3 px-3 text-center">Recent Form</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {activeTournamentPointsTable.length === 0 ? (
                    <tr>
                      <td colSpan="9" className="py-8 text-center text-slate-400 text-sm">
                        No standings available for this tournament yet.
                      </td>
                    </tr>
                  ) : (
                    activeTournamentPointsTable.map((team, idx) => (
                      <tr key={idx} className="hover:bg-blue-50/40 transition">
                        <td className="py-3 px-3 font-bold text-slate-700">{idx + 1}</td>
                        <td className="py-3 px-3 font-bold text-slate-900 flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: team.color || '#2457D6' }} />
                          <span>{team.team}</span>
                        </td>
                        <td className="py-3 px-2 text-center text-slate-700">{team.m}</td>
                        <td className="py-3 px-2 text-center font-bold text-emerald-600">{team.w}</td>
                        <td className="py-3 px-2 text-center text-rose-600">{team.l}</td>
                      <td className="py-3 px-2 text-center text-slate-500">{team.t || team.nr || 0}</td>
                      <td className="py-3 px-2 text-center font-extrabold text-blue-700 text-sm">{team.pts}</td>
                      <td className="py-3 px-3 text-right font-mono text-slate-700">{team.nrr}</td>
                      <td className="py-3 px-3 text-center">
                        <div className="flex items-center justify-center gap-1">
                          {(team.form || ['W', 'L', 'W', 'W', 'L']).map((res, i) => (
                            <span
                              key={i}
                              className={`w-4 h-4 rounded-full text-[9px] font-bold flex items-center justify-center text-white ${
                                res === 'W' ? 'bg-emerald-500' : 'bg-rose-500'
                              }`}
                            >
                              {res}
                            </span>
                          ))}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </div>
    </motion.div>
  );
}
