import React, { useState, useMemo } from 'react';
import CloudinaryAvatar from '../ui/CloudinaryAvatar';
import { 
  Shield, 
  Users, 
  Award, 
  MapPin, 
  Trophy, 
  Search, 
  Filter, 
  ChevronRight, 
  Printer, 
  Download, 
  CheckCircle2, 
  ExternalLink,
  X,
  UserCheck,
  Star,
  Activity,
  Layers,
  Sparkles,
  ChevronDown
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useCricket } from '../../context/CricketContext';
import { PageHeader } from '../ui/PageHeader';
import StatCard from '../ui/StatCard';
import TeamManagerModal from '../ui/TeamManagerModal';

const ROLE_COLORS = {
  'Batter': { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200', tag: 'bg-amber-500' },
  'Bowler': { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200', tag: 'bg-blue-500' },
  'All-Rounder': { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200', tag: 'bg-purple-500' },
  'Wicket Keeper': { bg: 'bg-teal-50', text: 'text-teal-700', border: 'border-teal-200', tag: 'bg-teal-500' },
};

const CATEGORIES = [
  'All Categories',
  'Senior Men',
  'Senior Women',
  'Under-23',
  'Under-19 Men',
  'Under-19 Women',
  'Under-17',
  'Under-15',
  'Under-13'
];

export default function TeamsScreen() {
  const { navigateTo, setSelectedPlayer, players: contextPlayers = [], teams: contextTeams = [], userRole } = useCricket();

  const [activeTab, setActiveTab] = useState('All Categories');
  const [viewScope, setViewScope] = useState('representative'); // 'representative' | 'districts'
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGender, setSelectedGender] = useState('All'); // 'All' | 'Men' | 'Women'
  const [activeRosterTeam, setActiveRosterTeam] = useState(null);
  const [printSuccessToast, setPrintSuccessToast] = useState(false);
  const [showOverviewStats, setShowOverviewStats] = useState(false);
  const [isTeamManagerOpen, setIsTeamManagerOpen] = useState(false);
  const isAdmin = userRole === 'Admin' || userRole === 'SuperAdmin';

  // Map Supabase teams to UI expected format
  const mappedTeams = useMemo(() => {
    // Distribute context players among teams for demonstration
    const availablePlayers = [...contextPlayers];
    
    return contextTeams.map((team, index) => {
      // Pick up to 15 players for this team from contextPlayers, trying to match gender/category if possible, or just slice
      // For a real app, this should join with team_players.
      const teamPlayers = availablePlayers.filter(p => p.gender === team.gender || !p.gender).slice(0, 15);
      
      const squad = teamPlayers.map(p => ({
        id: p.id,
        name: p.full_name || p.name,
        role: p.primary_role || p.role || 'Batter',
        district: p.district || team.district?.name || 'TBD',
        avatar: p.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(p.full_name || p.name)}&background=random`
      }));

      // Calculate composition
      const composition = { batters: 0, bowlers: 0, allRounders: 0, wicketKeepers: 0 };
      squad.forEach(p => {
        if (p.role?.includes('Batter')) composition.batters++;
        else if (p.role?.includes('Bowler')) composition.bowlers++;
        else if (p.role?.includes('All-Rounder')) composition.allRounders++;
        else if (p.role?.includes('Wicket')) composition.wicketKeepers++;
      });

      return {
        id: team.id,
        name: team.name,
        short: team.short_name || team.name.substring(0, 3).toUpperCase(),
        category: team.age_category?.name || 'Category TBD',
        gender: team.gender || 'All',
        season: team.season || 'TBD',
        level: 'Official Match Team',
        status: team.is_active ? 'Active' : 'Inactive',
        homeVenue: 'Venue TBD',
        district: team.district?.name || 'TBD',
        captain: squad.length > 0 ? squad[0].name : 'TBD',
        viceCaptain: squad.length > 1 ? squad[1].name : 'TBD',
        wicketKeeper: squad.find(p => p.role?.includes('Wicket'))?.name || 'TBD',
        headCoach: 'Head Coach',
        leadSelector: 'Lead Selector',
        squadSize: 15,
        composition,
        squad,
        trophies: 0,
        activePlayers: squad.length,
        homeGround: 'Venue TBD',
        standing: 'TBD',
        primaryColor: '#3b82f6'
      };
    });
  }, [contextTeams, contextPlayers]);

  // Filter Representative Teams
  const filteredOfficialTeams = useMemo(() => {
    return mappedTeams.filter(team => {
      // Category filter
      if (activeTab === 'Senior Men' && (team.category !== 'Senior' || team.gender !== 'Men')) return false;
      if (activeTab === 'Senior Women' && (team.category !== 'Senior' || team.gender !== 'Women')) return false;
      if (activeTab === 'Under-23' && team.category !== 'Under-23') return false;
      if (activeTab === 'Under-19 Men' && (team.category !== 'Under-19' || team.gender !== 'Men')) return false;
      if (activeTab === 'Under-19 Women' && (team.category !== 'Under-19' || team.gender !== 'Women')) return false;
      if (activeTab === 'Under-17' && team.category !== 'Under-17') return false;
      if (activeTab === 'Under-15' && team.category !== 'Under-15') return false;
      if (activeTab === 'Under-13' && team.category !== 'Under-13') return false;

      // Gender filter
      if (selectedGender !== 'All' && team.gender !== selectedGender) return false;

      // Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = (team.name || '').toLowerCase().includes(q);
        const matchesCaptain = (team.captain || '').toLowerCase().includes(q);
        const matchesCoach = (team.headCoach || '').toLowerCase().includes(q);
        const matchesPlayer = team.squad.some(p => (p.name || '').toLowerCase().includes(q) || (p.district || '').toLowerCase().includes(q));
        if (!matchesName && !matchesCaptain && !matchesCoach && !matchesPlayer) return false;
      }

      return true;
    });
  }, [activeTab, selectedGender, searchQuery]);

  // Filter District Teams
  const filteredDistrictTeams = useMemo(() => {
    return mappedTeams.filter(team => {
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      return (
        (team.name || '').toLowerCase().includes(q) ||
        (team.district || '').toLowerCase().includes(q) ||
        (team.captain || '').toLowerCase().includes(q) ||
        (team.homeGround || '').toLowerCase().includes(q)
      );
    });
  }, [searchQuery]);

  // Aggregate metrics
  const totalPlayersCount = useMemo(() => {
    return mappedTeams.reduce((acc, t) => acc + (t.squad?.length || 0), 0);
  }, [mappedTeams]);

  const handlePlayerClick = (player) => {
    // Find player in context or construct player object
    const matchedPlayer = contextPlayers.find(p => p.id === player.id) || {
      ...player,
      team: activeRosterTeam?.name || 'JDCA',
      category: activeRosterTeam?.category || 'Senior',
      careerRuns: player.runs,
      battingAvg: player.average,
      primaryRole: player.role,
    };

    if (setSelectedPlayer) {
      setSelectedPlayer(matchedPlayer);
    }
    if (navigateTo) {
      navigateTo('player-profile');
    }
  };

  const handlePrintRoster = () => {
    setPrintSuccessToast(true);
    setTimeout(() => {
      window.print();
      setPrintSuccessToast(false);
    }, 400);
  };

  return (
    <div className="space-y-6 pb-24 font-sans text-slate-900">
      {/* Toast Notification */}
      {printSuccessToast && (
        <div className="fixed top-20 right-6 z-50 flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-3 text-white shadow-2xl border border-slate-700 animate-in fade-in slide-in-from-top-2">
          <Printer className="w-4 h-4 text-blue-400" />
          <span className="text-xs font-semibold">Generating Official JDCA Team Sheet for printing...</span>
        </div>
      )}

      {/* Page Header */}
      <PageHeader
        title="Official Teams"
        subtitle="Jabalpur District Cricket Association · Season 2026 Directory of Teams"
        actions={
          <div className="flex items-center gap-2">
            {isAdmin && (
              <button
                type="button"
                onClick={() => setIsTeamManagerOpen(true)}
                className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-3.5 py-2 text-xs font-semibold text-white shadow-xs hover:bg-blue-700 transition cursor-pointer"
              >
                <Shield className="w-3.5 h-3.5 text-blue-200" />
                <span>Create Team</span>
              </button>
            )}
            <button
              type="button"
              onClick={() => navigateTo('selection')}
              className="inline-flex items-center gap-1.5 rounded-lg bg-slate-900 px-3.5 py-2 text-xs font-semibold text-white shadow-xs hover:bg-slate-800 transition cursor-pointer"
            >
              <Shield className="w-3.5 h-3.5 text-blue-400" />
              <span>Team Selection</span>
            </button>
          </div>
        }
      />

      {/* Mobile Toggle Disappear UX for Overview Stats */}
      <div className="sm:hidden flex items-center justify-between px-1 pt-1">
        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
          JDCA Category Overview
        </span>
        <button
          type="button"
          onClick={() => setShowOverviewStats(!showOverviewStats)}
          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold transition border cursor-pointer ${
            showOverviewStats
              ? 'bg-blue-50 text-blue-700 border-blue-300 shadow-2xs'
              : 'bg-white text-slate-700 border-slate-200 shadow-2xs hover:bg-slate-50'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>{showOverviewStats ? 'Hide Stats' : 'Show Stats (4)'}</span>
          <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${showOverviewStats ? 'rotate-180' : ''}`} />
        </button>
      </div>

      {/* Institutional Top Stat Strip (Collapsible on Mobile, Grid on Desktop) */}
      <div className={`${showOverviewStats ? 'grid' : 'hidden'} sm:grid grid-cols-2 sm:grid-cols-4 gap-3.5 animate-in fade-in slide-in-from-top-1 duration-150`}>
        <StatCard
          label="Representative Teams"
          value={mappedTeams.length}
          subtext="Official Category Teams"
          icon={Shield}
          tone="primary"
        />
        <StatCard
          label="Total Registered Players"
          value={totalPlayersCount}
          subtext="Selected JDCA Players"
          icon={Users}
          tone="success"
        />
        <StatCard
          label="Age Categories Covered"
          value="7"
          subtext="Senior down to Under-13"
          icon={Layers}
          tone="info"
        />
        <StatCard
          label="District Representation"
          value="100%"
          subtext="All 9 JDCA Member Districts"
          icon={MapPin}
          tone="warning"
        />
      </div>

      {/* View Scope Switcher: Official Representative Teams vs District Inter-Zonal League */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3 sm:p-3.5 rounded-2xl border border-slate-200 shadow-xs">
        <div className="grid grid-cols-2 p-1 bg-slate-100 rounded-xl w-full sm:w-auto">
          <button
            type="button"
            onClick={() => setViewScope('representative')}
            className={`px-2.5 sm:px-4 py-2 rounded-lg text-xs font-bold transition cursor-pointer flex items-center justify-center gap-1.5 sm:gap-2 ${
              viewScope === 'representative'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Shield className="w-3.5 h-3.5 text-blue-600 shrink-0" />
            <span className="truncate">Representative ({mappedTeams.length})</span>
          </button>
          <button
            type="button"
            onClick={() => setViewScope('districts')}
            className={`px-2.5 sm:px-4 py-2 rounded-lg text-xs font-bold transition cursor-pointer flex items-center justify-center gap-1.5 sm:gap-2 ${
              viewScope === 'districts'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Trophy className="w-3.5 h-3.5 text-amber-500 shrink-0" />
            <span className="truncate">Districts ({mappedTeams.length})</span>
          </button>
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search teams, players, districts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:border-blue-600 font-medium text-slate-800"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Main Content Area */}
      {viewScope === 'representative' ? (
        <div className="space-y-4">
          {/* Category Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
            {CATEGORIES.map((cat) => {
              const isActive = activeTab === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setActiveTab(cat)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'bg-white text-slate-600 hover:bg-slate-50 hover:text-slate-900 border border-slate-200'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>

          {/* Gender Sub-Filter */}
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 pt-1">
            <span>Filter Gender:</span>
            {['All', 'Men', 'Women'].map((g) => (
              <button
                key={g}
                type="button"
                onClick={() => setSelectedGender(g)}
                className={`px-2.5 py-1 rounded-lg transition ${
                  selectedGender === g
                    ? 'bg-slate-900 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {g === 'All' ? 'All Genders' : `${g}'s Cricket`}
              </button>
            ))}
          </div>

          {/* Teams Grid */}
          {filteredOfficialTeams.length === 0 ? (
            <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center space-y-2 shadow-xs">
              <Shield className="w-8 h-8 text-slate-300 mx-auto" />
              <h4 className="text-sm font-bold text-slate-800">No official teams found</h4>
              <p className="text-xs text-slate-500">
                Try selecting another category or clearing your search criteria.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {filteredOfficialTeams.map((team) => (
                <div
                  key={team.id}
                  className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs hover:shadow-md transition flex flex-col justify-between relative overflow-hidden"
                >
                  {/* Top Bar with Category Accent */}
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-slate-900 text-white flex items-center justify-center font-black text-sm shadow-xs shrink-0 border border-slate-800">
                        <Shield className="w-6 h-6 text-blue-400" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 border border-blue-100">
                            {team.category} {team.gender}
                          </span>
                          <span className="text-xs font-bold text-slate-400">
                            Season {team.season}
                          </span>
                        </div>
                        <h3 className="text-base font-bold text-slate-900 mt-1">
                          {team.name}
                        </h3>
                        <p className="text-xs text-slate-500 truncate max-w-[280px]">
                          {team.level}
                        </p>
                      </div>
                    </div>

                    <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-lg shrink-0">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{team.status}</span>
                    </span>
                  </div>

                  {/* Key Leadership Personnel */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 py-3 px-3.5 rounded-xl bg-slate-50 border border-slate-100 text-xs mb-4">
                    <div>
                      <span className="text-xs uppercase font-bold text-slate-400 block">
                        Captain
                      </span>
                      <span className="font-bold text-slate-900 truncate block">
                        {team.captain}
                      </span>
                    </div>
                    <div>
                      <span className="text-xs uppercase font-bold text-slate-400 block">
                        Vice-Captain
                      </span>
                      <span className="font-bold text-slate-900 truncate block">
                        {team.viceCaptain}
                      </span>
                    </div>
                    <div className="col-span-2 sm:col-span-1">
                      <span className="text-xs uppercase font-bold text-slate-400 block">
                        Head Coach
                      </span>
                      <span className="font-medium text-slate-700 truncate block">
                        {team.headCoach.split('(')[0]}
                      </span>
                    </div>
                  </div>

                  {/* Squad Balance Strip */}
                  <div className="space-y-1.5 mb-4">
                    <div className="flex items-center justify-between text-xs font-semibold text-slate-600">
                      <span>Team Size: <strong className="text-slate-900">{team.squad.length} Players</strong></span>
                      <span>Target: {team.squadSize} Players</span>
                    </div>
                    {/* Visual Ratio Bar */}
                    <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden flex">
                      <div className="bg-amber-500 h-full" style={{ width: `${(team.composition.batters / team.squadSize) * 100}%` }} title={`Batters: ${team.composition.batters}`} />
                      <div className="bg-blue-500 h-full" style={{ width: `${(team.composition.bowlers / team.squadSize) * 100}%` }} title={`Bowlers: ${team.composition.bowlers}`} />
                      <div className="bg-purple-500 h-full" style={{ width: `${(team.composition.allRounders / team.squadSize) * 100}%` }} title={`All-Rounders: ${team.composition.allRounders}`} />
                      <div className="bg-teal-500 h-full" style={{ width: `${(team.composition.wicketKeepers / team.squadSize) * 100}%` }} title={`Wicket Keepers: ${team.composition.wicketKeepers}`} />
                    </div>
                    <div className="flex items-center justify-between text-xs text-slate-500 pt-0.5">
                      <span className="flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-amber-500 inline-block" /> {team.composition.batters} Bat
                      </span>
                      <span className="flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-blue-500 inline-block" /> {team.composition.bowlers} Bowl
                      </span>
                      <span className="flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-purple-500 inline-block" /> {team.composition.allRounders} AR
                      </span>
                      <span className="flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-teal-500 inline-block" /> {team.composition.wicketKeepers} WK
                      </span>
                    </div>
                  </div>

                  {/* Player Avatars Strip */}
                  <div className="flex items-center gap-2 mb-4 pt-2 border-t border-slate-100 overflow-x-auto no-scrollbar py-1">
                    {team.squad.slice(0, 7).map((player) => (
                      <div
                        key={player.id}
                        onClick={() => handlePlayerClick(player)}
                        className="group relative cursor-pointer flex flex-col items-center shrink-0"
                        title={`${player.name} (${player.role} - ${player.district})`}
                      >
                        <CloudinaryAvatar
                          src={player.avatar}
                          alt={player.name}
                          className="w-8 h-8 rounded-full object-cover border border-slate-200 group-hover:border-blue-600 transition"
                        />
                        <span className="text-[9px] font-medium text-slate-500 truncate w-10 text-center mt-0.5">
                          {player.name.split(' ')[0]}
                        </span>
                      </div>
                    ))}
                    {team.squad.length > 7 && (
                      <div
                        onClick={() => setActiveRosterTeam(team)}
                        className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-xs font-bold text-slate-600 shrink-0 cursor-pointer hover:bg-slate-200 transition"
                      >
                        +{team.squad.length - 7}
                      </div>
                    )}
                  </div>

                  {/* Bottom Action Buttons */}
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                    <span className="text-xs text-slate-400 truncate flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      <span className="truncate">{team.homeVenue.split(',')[0]}</span>
                    </span>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setActiveRosterTeam(team)}
                        className="inline-flex items-center gap-1 px-3.5 py-1.5 rounded-lg text-xs font-bold bg-slate-900 hover:bg-slate-800 text-white transition shadow-2xs"
                      >
                        <span>View Players</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        /* DISTRICT INTER-ZONAL LEAGUE TEAMS */
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-slate-500 px-1">
            <span className="font-semibold">All 9 Affiliated Districts of Jabalpur Division</span>
            <span>Senior District Trophy Season 2026</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredDistrictTeams.map((team) => (
              <div
                key={team.id}
                className="bg-white border border-slate-200 rounded-2xl p-4.5 shadow-xs hover:shadow-md transition flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2.5">
                    <div className="flex items-center gap-2.5">
                      <div 
                        className="w-10 h-10 rounded-xl flex items-center justify-center font-black text-xs text-white shadow-2xs"
                        style={{ backgroundColor: team.primaryColor }}
                      >
                        {team.short}
                      </div>
                      <div>
                        <h4 className="font-bold text-sm text-slate-900 leading-tight">
                          {team.name}
                        </h4>
                        <span className="text-xs text-slate-500 font-medium">
                          {team.district} District
                        </span>
                      </div>
                    </div>

                    <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-amber-50 text-amber-700 border border-amber-200 shrink-0 flex items-center gap-1">
                      <Trophy className="w-3 h-3 text-amber-500" />
                      <span>{team.trophies} Titles</span>
                    </span>
                  </div>

                  <div className="space-y-1.5 my-3 p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">District Captain:</span>
                      <strong className="text-slate-900">{team.captain}</strong>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">Active Pool:</span>
                      <strong className="text-slate-900">{team.activePlayers} Registered</strong>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">Home Ground:</span>
                      <span className="font-medium text-slate-700 truncate max-w-[150px]">{team.homeGround}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-xs font-semibold text-slate-500">
                    Status: <strong className="text-blue-600">{team.standing}</strong>
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      navigateTo('selection');
                    }}
                    className="text-xs font-bold text-blue-600 hover:text-blue-800 transition flex items-center gap-1"
                  >
                    <span>View Players</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* DISCIPLINED OFFICIAL TEAM ROSTER MODAL */}
      <AnimatePresence>
        {activeRosterTeam && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.2 }}
              className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-5xl max-h-[90vh] flex flex-col overflow-hidden my-auto"
            >
              {/* Institutional Header */}
              <div className="bg-slate-900 text-white p-5 shrink-0 flex items-start justify-between border-b border-slate-800">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400 shrink-0">
                    <Shield className="w-7 h-7" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-black uppercase tracking-wider px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-400/30">
                        {activeRosterTeam.category} {activeRosterTeam.gender}
                      </span>
                      <span className="text-xs text-slate-400 font-semibold">
                        Official Team Sheet · Season {activeRosterTeam.season}
                      </span>
                    </div>
                    <h2 className="text-xl font-bold text-white mt-1">
                      {activeRosterTeam.name}
                    </h2>
                    <p className="text-xs text-slate-400 mt-0.5 flex items-center gap-2">
                      <span>{activeRosterTeam.homeVenue}</span>
                      <span>•</span>
                      <span>Head Coach: <strong className="text-slate-200">{activeRosterTeam.headCoach}</strong></span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handlePrintRoster}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>Print Team Sheet</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveRosterTeam(null)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Team Sheet Content */}
              <div className="p-5 overflow-y-auto flex-1 space-y-5">
                {/* Officers / Leadership Summary */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                  <div>
                    <span className="text-xs uppercase font-bold text-slate-400 block">Captain</span>
                    <strong className="text-slate-900 text-sm block">{activeRosterTeam.captain}</strong>
                    <span className="text-xs text-slate-500">Designated Skipper</span>
                  </div>
                  <div>
                    <span className="text-xs uppercase font-bold text-slate-400 block">Vice-Captain</span>
                    <strong className="text-slate-900 text-sm block">{activeRosterTeam.viceCaptain}</strong>
                    <span className="text-xs text-slate-500">Vice Skipper</span>
                  </div>
                  <div>
                    <span className="text-xs uppercase font-bold text-slate-400 block">Wicket Keeper</span>
                    <strong className="text-slate-900 text-sm block">{activeRosterTeam.wicketKeeper}</strong>
                    <span className="text-xs text-slate-500">Primary Gloveman</span>
                  </div>
                  <div>
                    <span className="text-xs uppercase font-bold text-slate-400 block">Lead Selector</span>
                    <strong className="text-slate-900 text-sm block">{activeRosterTeam.leadSelector}</strong>
                    <span className="text-xs text-slate-500">JDCA Selection Panel</span>
                  </div>
                </div>

                {/* Team Members Official Table */}
                <div className="border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
                  <div className="px-4 py-2.5 bg-slate-100 border-b border-slate-200 flex items-center justify-between text-xs font-bold text-slate-700">
                    <span>Official 15-Member Team List</span>
                    <span className="text-xs font-semibold text-slate-500">Click any player to inspect full profile</span>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="bg-slate-50/80 border-b border-slate-200 text-xs font-bold text-slate-400 uppercase tracking-wider">
                          <th className="py-2.5 px-3">Cap #</th>
                          <th className="py-2.5 px-3">Player</th>
                          <th className="py-2.5 px-3">Role</th>
                          <th className="py-2.5 px-3">Designation</th>
                          <th className="py-2.5 px-3">District</th>
                          <th className="py-2.5 px-3 text-right">M</th>
                          <th className="py-2.5 px-3 text-right">Runs</th>
                          <th className="py-2.5 px-3 text-right">Avg</th>
                          <th className="py-2.5 px-3 text-right">SR</th>
                          <th className="py-2.5 px-3 text-right">Wkts</th>
                          <th className="py-2.5 px-3 text-right">Econ</th>
                          <th className="py-2.5 px-3 text-center">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                        {activeRosterTeam.squad.map((player, idx) => {
                          const roleStyle = ROLE_COLORS[player.role] || { bg: 'bg-slate-50', text: 'text-slate-700', border: 'border-slate-200' };

                          return (
                            <tr
                              key={player.id}
                              className="hover:bg-blue-50/40 transition group cursor-pointer"
                              onClick={() => handlePlayerClick(player)}
                            >
                              <td className="py-2.5 px-3 font-mono font-bold text-slate-400">
                                {player.capNumber || `JDCA-${String(idx + 1).padStart(2, '0')}`}
                              </td>
                              <td className="py-2.5 px-3">
                                <div className="flex items-center gap-2.5">
                                  <CloudinaryAvatar
                                    src={player.avatar}
                                    alt={player.name}
                                    className="w-7 h-7 rounded-full object-cover border border-slate-200 shrink-0"
                                  />
                                  <div className="min-w-0">
                                    <div className="font-bold text-slate-900 group-hover:text-blue-600 transition flex items-center gap-1">
                                      <span>{player.name}</span>
                                      {player.inForm && (
                                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" title="In Form" />
                                      )}
                                    </div>
                                    <span className="text-xs text-slate-400 block truncate">
                                      {player.battingStyle}
                                    </span>
                                  </div>
                                </div>
                              </td>
                              <td className="py-2.5 px-3">
                                <span className={`inline-block px-2 py-0.5 rounded-md text-xs font-bold border ${roleStyle.bg} ${roleStyle.text} ${roleStyle.border}`}>
                                  {player.role}
                                </span>
                              </td>
                              <td className="py-2.5 px-3 font-semibold text-slate-900">
                                {player.designation}
                              </td>
                              <td className="py-2.5 px-3 text-slate-600">
                                {player.district}
                              </td>
                              <td className="py-2.5 px-3 text-right font-semibold text-slate-900">
                                {player.matches}
                              </td>
                              <td className="py-2.5 px-3 text-right font-bold text-slate-900">
                                {player.runs}
                              </td>
                              <td className="py-2.5 px-3 text-right text-blue-600 font-bold">
                                {player.average}
                              </td>
                              <td className="py-2.5 px-3 text-right text-slate-600">
                                {player.strikeRate}
                              </td>
                              <td className="py-2.5 px-3 text-right font-bold text-emerald-700">
                                {player.wickets}
                              </td>
                              <td className="py-2.5 px-3 text-right text-slate-600">
                                {player.economy}
                              </td>
                              <td className="py-2.5 px-3 text-center">
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handlePlayerClick(player);
                                  }}
                                  className="p-1 rounded text-slate-400 hover:text-blue-600 hover:bg-slate-100 transition"
                                  title="View Player Profile"
                                >
                                  <ExternalLink className="w-3.5 h-3.5" />
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              {/* Roster Footer */}
              <div className="px-5 py-3.5 bg-slate-50 border-t border-slate-200 shrink-0 flex items-center justify-between text-xs text-slate-500">
                <span>Official Record of Jabalpur District Cricket Association (JDCA)</span>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setActiveRosterTeam(null)}
                    className="px-4 py-1.5 rounded-lg border border-slate-300 font-bold text-slate-700 hover:bg-slate-100 transition"
                  >
                    Close
                  </button>
                  <button
                    type="button"
                    onClick={handlePrintRoster}
                    className="px-4 py-1.5 rounded-lg bg-blue-600 font-bold text-white hover:bg-blue-700 transition flex items-center gap-1.5"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>Print Official Team Sheet</span>
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {isAdmin && (
        <TeamManagerModal 
          isOpen={isTeamManagerOpen}
          onClose={() => setIsTeamManagerOpen(false)}
          onSave={async (data) => {
            try {
              const { api } = await import('../../lib/api');
              await api.createTeam(data);
              alert('Team created successfully!');
              window.location.reload(); // Quickest way to refresh for now
            } catch (err) {
              console.error('Failed to create team:', err);
              alert('Error creating team: ' + err.message);
            }
          }}
        />
      )}
    </div>
  );
}
