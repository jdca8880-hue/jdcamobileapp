import React, { useState, useMemo } from 'react';
import { useCricket } from '../../context/CricketContext';
import { 
  Users, 
  Check, 
  Trash2, 
  Search, 
  Plus,
  ArrowRight, 
  ArrowLeft, 
  Shield, 
  Trophy, 
  Star, 
  X, 
  Printer, 
  CheckCircle2, 
  AlertCircle, 
  Crown,
  MapPin,
  Save,
  SlidersHorizontal,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { 
  normalizeSelectionPlayer,
  getAvailableDistricts
} from './selectionData';
import CloudinaryAvatar from '../ui/CloudinaryAvatar';
import confetti from 'canvas-confetti';
import { motion, AnimatePresence } from 'motion/react';
import BottomSheet from '../ui/BottomSheet';
import PlayerDetail from './PlayerDetail';

const ROLE_BADGES = {
  'Batter': { bg: 'bg-amber-50', text: 'text-amber-800', border: 'border-amber-200' },
  'Bowler': { bg: 'bg-blue-50', text: 'text-blue-800', border: 'border-blue-200' },
  'All-Rounder': { bg: 'bg-purple-50', text: 'text-purple-800', border: 'border-purple-200' },
  'Wicket Keeper': { bg: 'bg-teal-50', text: 'text-teal-800', border: 'border-teal-200' },
};

const CATEGORY_OPTIONS = [
  { id: 'team_2026_senior_men', name: 'Senior Men', category: 'Senior', gender: 'Men' },
  { id: 'team_2026_u23_men', name: 'Under-23 Boys', category: 'Under 23', gender: 'Men' },
  { id: 'team_2026_u19_men', name: 'Under-19 Boys', category: 'Under 19', gender: 'Men' },
  { id: 'team_2026_u17_men', name: 'Under-17 Boys', category: 'Under 17', gender: 'Men' },
  { id: 'team_2026_u15_men', name: 'Under-15 Boys', category: 'Under 15', gender: 'Men' },
  { id: 'team_2026_u13_men', name: 'Under-13 Boys', category: 'Under 13', gender: 'Men' },
  { id: 'team_2026_u19_women', name: 'Under-19 Girls', category: 'Under 19', gender: 'Women' },
];

export default function SelectionWorkspace() {
  const { players: rawPlayers, navigateTo, setSelectedPlayer: setContextPlayer } = useCricket();

  // Master State
  const [teams, setTeams] = useState(CATEGORY_OPTIONS.map(opt => ({
    id: opt.id,
    season: '2026',
    category: opt.category,
    gender: opt.gender,
    name: opt.name,
    targetSize: 15,
    status: 'Draft',
    selectedPlayerIds: [],
    shortlistedPlayerIds: [],
    roles: { captainId: '', viceCaptainId: '', wicketkeeperId: '' }
  })));
  const [activeTeamId, setActiveTeamId] = useState(CATEGORY_OPTIONS[0].id);

  // Tabs: 'all' | 'batters' | 'bowlers' | 'allRounders' | 'wicketKeepers' | 'selected'
  const [activeTab, setActiveTab] = useState('all');

  // Filters
  const [selectedDistrict, setSelectedDistrict] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('runs');
  const [isFiltersExpanded, setIsFiltersExpanded] = useState(false);

  // Drawers & Modals
  const [isTeamDrawerOpen, setIsTeamDrawerOpen] = useState(false);
  const [playerDetails, setPlayerDetails] = useState(null);
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
  const [showSavedNotification, setShowSavedNotification] = useState(false);

  // Active Team Object
  const activeTeam = useMemo(() => {
    return teams.find(t => t.id === activeTeamId) || teams[0];
  }, [teams, activeTeamId]);

  // Normalize players
  const allNormalizedPlayers = useMemo(() => {
    return (rawPlayers || []).map(p => normalizeSelectionPlayer(p));
  }, [rawPlayers]);

  // Players eligible for current team category
  const categoryPlayers = useMemo(() => {
    if (!activeTeam) return [];
    return allNormalizedPlayers.filter(p => {
      return p.category === activeTeam.category && p.gender === activeTeam.gender;
    });
  }, [allNormalizedPlayers, activeTeam]);

  const availableDistricts = useMemo(() => {
    return getAvailableDistricts(categoryPlayers);
  }, [categoryPlayers]);

  // Currently Selected Players
  const selectedPlayers = useMemo(() => {
    const ids = activeTeam?.selectedPlayerIds || [];
    return categoryPlayers.filter(p => ids.includes(p.id));
  }, [categoryPlayers, activeTeam]);

  // Team Player Counts by Role
  const roleCounts = useMemo(() => {
    return selectedPlayers.reduce((acc, p) => {
      if (p.role === 'Batter') acc.batters += 1;
      else if (p.role === 'Bowler') acc.bowlers += 1;
      else if (p.role === 'All-Rounder') acc.allRounders += 1;
      else if (p.role === 'Wicket Keeper') acc.wicketKeepers += 1;
      return acc;
    }, { batters: 0, bowlers: 0, allRounders: 0, wicketKeepers: 0 });
  }, [selectedPlayers]);

  // Filtered & Sorted Players List
  const displayedPlayers = useMemo(() => {
    let list = categoryPlayers.filter(p => {
      // Tab Filter
      if (activeTab === 'batters' && p.role !== 'Batter') return false;
      if (activeTab === 'bowlers' && p.role !== 'Bowler') return false;
      if (activeTab === 'allRounders' && p.role !== 'All-Rounder') return false;
      if (activeTab === 'wicketKeepers' && p.role !== 'Wicket Keeper') return false;
      if (activeTab === 'selected' && !(activeTeam?.selectedPlayerIds || []).includes(p.id)) return false;

      // District Filter
      if (selectedDistrict !== 'All' && p.district !== selectedDistrict) return false;

      // Search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = (p.name || '').toLowerCase().includes(q);
        const matchesDist = (p.district || '').toLowerCase().includes(q);
        if (!matchesName && !matchesDist) return false;
      }

      return true;
    });

    // Sorting
    if (activeTab === 'bowlers' || sortBy === 'wickets') {
      list = [...list].sort((a, b) => (b.wickets || 0) - (a.wickets || 0));
    } else if (sortBy === 'avg') {
      list = [...list].sort((a, b) => parseFloat(b.battingAvg || 0) - parseFloat(a.battingAvg || 0));
    } else if (sortBy === 'runs') {
      list = [...list].sort((a, b) => (b.careerRuns || 0) - (a.careerRuns || 0));
    } else if (sortBy === 'economy') {
      list = [...list].sort((a, b) => parseFloat(a.economy || 99) - parseFloat(b.economy || 99));
    }

    return list;
  }, [categoryPlayers, activeTab, selectedDistrict, searchQuery, sortBy, activeTeam]);

  // Add / Remove Player
  const handleTogglePlayer = (playerId) => {
    if (!activeTeam) return;
    setTeams(prev => prev.map(t => {
      if (t.id !== activeTeam.id) return t;
      const currentList = t.selectedPlayerIds || [];
      const alreadyInTeam = currentList.includes(playerId);

      if (alreadyInTeam) {
        // Remove
        return {
          ...t,
          selectedPlayerIds: currentList.filter(id => id !== playerId),
          roles: {
            captainId: t.roles?.captainId === playerId ? '' : t.roles?.captainId,
            viceCaptainId: t.roles?.viceCaptainId === playerId ? '' : t.roles?.viceCaptainId,
            wicketkeeperId: t.roles?.wicketkeeperId === playerId ? '' : t.roles?.wicketkeeperId,
          }
        };
      } else {
        // Add (max 15)
        if (currentList.length >= 15) {
          alert('You already have 15 players selected for this team. Please remove a player before adding a new one.');
          return t;
        }
        return {
          ...t,
          selectedPlayerIds: [...currentList, playerId]
        };
      }
    }));
  };

  // Assign Captain, Vice-Captain, Wicket Keeper
  const handleAssignRole = (roleKey, playerId) => {
    setTeams(prev => prev.map(t => {
      if (t.id !== activeTeam.id) return t;
      return {
        ...t,
        roles: {
          ...t.roles,
          [roleKey]: playerId
        }
      };
    }));
  };

  // Save Final Team
  const handleSaveTeam = () => {
    setTeams(prev => prev.map(t => {
      if (t.id !== activeTeam.id) return t;
      return {
        ...t,
        status: 'Team Finalized'
      };
    }));
    setIsSaveModalOpen(false);
    setShowSavedNotification(true);
    confetti({
      particleCount: 90,
      spread: 60,
      origin: { y: 0.6 }
    });
  };

  const isSelected = (id) => (activeTeam?.selectedPlayerIds || []).includes(id);
  const selectedCount = selectedPlayers.length;

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-32 font-sans text-slate-900">
      
      {/* ───────────────────────────────────────────────────────────── */}
      {/* PREMIUM HEADER & FILTER WORKSPACE */}
      {/* ───────────────────────────────────────────────────────────── */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto">
          {/* Header & Context */}
          <div className="px-4 py-4 sm:py-5 flex flex-col sm:flex-row sm:items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Shield className="w-6 h-6 text-[#2457D6]" />
                <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">Team Selection</h1>
              </div>
              <p className="text-sm font-semibold text-slate-500 flex items-center gap-2 flex-wrap">
                <span className="text-slate-800">{activeTeam.name.replace(' 2026', '')}</span>
                <span className="text-slate-300">&bull;</span>
                <span>{selectedDistrict === 'All' ? 'Jabalpur Division' : selectedDistrict}</span>
                <span className="text-slate-300">&bull;</span>
                <span>2026-27 Season</span>
              </p>
            </div>
            
            {/* Action Area: Selected Team Progress */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setIsTeamDrawerOpen(true)}
                className="group relative flex items-center gap-3 px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 hover:border-[#2457D6] hover:bg-[#eef2fd] transition-all cursor-pointer shadow-sm"
              >
                <div className="flex flex-col items-start">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 group-hover:text-[#2457D6]">Current Team</span>
                  <span className="text-sm font-black text-slate-900 group-hover:text-[#1b41a8]">{selectedCount} / 15 Selected</span>
                </div>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center shadow-sm transition-colors ${selectedCount >= 15 ? 'bg-[#0FA968] text-white' : 'bg-[#2457D6] text-white'}`}>
                  {selectedCount >= 15 ? <CheckCircle2 size={20} /> : <Users size={20} />}
                </div>
              </button>
              {selectedCount >= 11 && (
                <button
                  type="button"
                  onClick={() => setIsSaveModalOpen(true)}
                  className="px-5 py-2.5 rounded-xl bg-[#0FA968] hover:bg-[#0a7d4e] text-white font-bold transition-colors shadow-sm h-full flex items-center gap-2 cursor-pointer"
                >
                  <Save size={18} />
                  <span className="hidden sm:inline">Finalize Team</span>
                </button>
              )}
            </div>
          </div>

          {/* Compact Filters Bar */}
          <div className="px-4 py-3 bg-slate-50 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center gap-3">
            <div className="flex items-center gap-2 text-sm">
              <SlidersHorizontal size={16} className="text-slate-400" />
              <span className="font-bold text-slate-700 hidden sm:inline">Filters:</span>
            </div>
            
            <div className="grid grid-cols-2 sm:flex items-center gap-2 flex-1">
              <select
                value={activeTeamId}
                onChange={(e) => setActiveTeamId(e.target.value)}
                className="w-full sm:w-auto px-3 py-1.5 text-sm bg-white border border-slate-200 rounded-lg outline-none focus:border-[#2457D6] font-semibold text-slate-800 cursor-pointer shadow-sm h-[38px]"
              >
                {CATEGORY_OPTIONS.map(opt => (
                  <option key={opt.id} value={opt.id}>{opt.name}</option>
                ))}
              </select>

              <select
                value={selectedDistrict}
                onChange={(e) => setSelectedDistrict(e.target.value)}
                className="w-full sm:w-auto px-3 py-1.5 text-sm bg-white border border-slate-200 rounded-lg outline-none focus:border-[#2457D6] font-semibold text-slate-800 cursor-pointer shadow-sm h-[38px]"
              >
                <option value="All">All Districts</option>
                {availableDistricts.filter(d => d !== 'All').map(d => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>

            <div className="relative w-full sm:w-64 shrink-0">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                placeholder="Search players..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 text-sm bg-white border border-slate-200 rounded-lg outline-none focus:border-[#2457D6] font-medium text-slate-800 shadow-sm h-[38px]"
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery('')} className="absolute right-2 top-2.5 text-slate-400 hover:text-slate-600">
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Player Role Tabs */}
          <div className="px-4 flex items-center gap-6 overflow-x-auto no-scrollbar border-t border-slate-100 bg-white">
            {[
              { id: 'all', label: 'All Players', count: categoryPlayers.length },
              { id: 'batters', label: 'Top Batters', count: categoryPlayers.filter(c => c.role === 'Batter').length },
              { id: 'bowlers', label: 'Top Bowlers', count: categoryPlayers.filter(c => c.role === 'Bowler').length },
              { id: 'allRounders', label: 'All-Rounders', count: categoryPlayers.filter(c => c.role === 'All-Rounder').length },
              { id: 'wicketKeepers', label: 'Top Wicket Keepers', count: categoryPlayers.filter(c => c.role === 'Wicket Keeper').length },
            ].map(tab => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-3 text-sm font-bold whitespace-nowrap transition-colors relative cursor-pointer flex items-center gap-2 ${
                    isActive ? 'text-[#2457D6]' : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  <span>{tab.label}</span>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-black ${isActive ? 'bg-[#eef2fd] text-[#2457D6]' : 'bg-slate-100 text-slate-500'}`}>
                    {tab.count}
                  </span>
                  {isActive && (
                    <motion.div layoutId="activeTabIndicator" className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#2457D6]" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* PLAYERS LIST (PREMIUM CARDS) */}
      {/* ───────────────────────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 py-6 space-y-4">
        
        <div className="flex items-center justify-between text-sm text-slate-500">
          <span>Showing <strong className="text-slate-800">{displayedPlayers.length}</strong> eligible players</span>
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-400">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-transparent font-bold text-slate-800 outline-none cursor-pointer"
            >
              <option value="runs">Most Runs</option>
              <option value="avg">Highest Average</option>
              <option value="wickets">Most Wickets</option>
              <option value="economy">Best Economy</option>
            </select>
          </div>
        </div>

        {displayedPlayers.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center space-y-2 shadow-sm">
            <AlertCircle className="w-10 h-10 text-slate-300 mx-auto" />
            <h4 className="text-base font-bold text-slate-800">No players found</h4>
            <p className="text-sm text-slate-500">
              Try selecting another tab, another district, or clearing the search box.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {displayedPlayers.map(player => {
              const inTeam = isSelected(player.id);
              const badgeStyle = ROLE_BADGES[player.role] || { bg: 'bg-slate-50', text: 'text-slate-800', border: 'border-slate-200' };

              return (
                <div
                  key={player.id}
                  className={`bg-white rounded-[16px] border transition-all flex flex-col justify-between overflow-hidden ${
                    inTeam
                      ? 'border-[#0FA968] ring-1 ring-[#0FA968] shadow-md bg-emerald-50/10'
                      : 'border-slate-200 hover:border-slate-300 hover:shadow-md'
                  }`}
                >
                  {/* Top Header */}
                  <div className="p-4 pb-3 flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <CloudinaryAvatar src={player.avatar_url || player.avatar} alt={player.name} className="w-12 h-12 rounded-full object-cover border border-slate-200 shrink-0" />
                      <div className="min-w-0">
                        <h3 className="font-black text-[15px] text-slate-900 truncate" title={player.name}>{player.name}</h3>
                        <div className="text-[11px] font-semibold text-slate-500 truncate flex items-center gap-1.5 mt-0.5">
                          <span className={`px-1.5 py-0.5 rounded uppercase font-bold tracking-wider ${badgeStyle.bg} ${badgeStyle.text}`}>{player.role}</span>
                          <span className="text-slate-300">&bull;</span>
                          <span className="truncate">{player.district}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Core Stats */}
                  <div className="px-4 py-3 bg-slate-50 border-y border-slate-100">
                    <div className="grid grid-cols-4 gap-2 text-center">
                      <div>
                        <div className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Matches</div>
                        <div className="text-sm font-black text-slate-800">{player.matchesPlayed || 0}</div>
                      </div>
                      <div>
                        <div className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Runs</div>
                        <div className="text-sm font-black text-[#2457D6]">{player.careerRuns || 0}</div>
                      </div>
                      <div>
                        <div className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Avg</div>
                        <div className="text-sm font-black text-slate-800">{player.battingAvg || '-'}</div>
                      </div>
                      <div>
                        <div className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Wkts</div>
                        <div className="text-sm font-black text-[#0FA968]">{player.wickets || 0}</div>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="p-3 flex items-center justify-between gap-2 bg-white">
                    <button
                      type="button"
                      onClick={() => setPlayerDetails(player)}
                      className="px-3 py-2 text-xs font-bold text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                    >
                      View Profile
                    </button>

                    <button
                      type="button"
                      onClick={() => handleTogglePlayer(player.id)}
                      className={`inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-lg text-xs font-bold transition-all cursor-pointer shadow-sm ${
                        inTeam
                          ? 'bg-[#0FA968] hover:bg-[#0a7d4e] text-white ring-2 ring-[#0FA968]/30 ring-offset-1'
                          : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300'
                      }`}
                    >
                      {inTeam ? (
                        <>
                          <Check size={14} strokeWidth={3} />
                          <span>Selected</span>
                        </>
                      ) : (
                        <>
                          <Plus size={14} strokeWidth={2.5} />
                          <span>Select Player</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* STICKY MOBILE TEAM BAR (TOGGLE EXPAND DRAWER) */}
      {/* ───────────────────────────────────────────────────────────── */}
      <div className="sm:hidden fixed bottom-[74px] left-3 right-3 z-40 bg-slate-900/95 text-white backdrop-blur-md px-3.5 py-2.5 rounded-2xl border border-slate-700 shadow-2xl flex items-center justify-between animate-in slide-in-from-bottom-2 duration-200">
        <div 
          onClick={() => setIsTeamDrawerOpen(true)}
          className="flex items-center gap-2.5 cursor-pointer flex-1 min-w-0"
        >
          <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center font-black text-sm shrink-0 shadow-xs">
            {selectedCount}
          </div>
          <div className="min-w-0">
            <div className="text-xs font-bold flex items-center gap-1.5 truncate">
              <span>{selectedCount}/15 Selected</span>
              <span className="text-xs text-slate-400 font-normal">({15 - selectedCount > 0 ? `Need ${15 - selectedCount}` : 'Full'})</span>
            </div>
            <div className="text-xs text-slate-300 flex items-center gap-2 mt-0.5">
              <span>🏏 {roleCounts.batters}</span>
              <span>🔥 {roleCounts.bowlers}</span>
              <span>⚡ {roleCounts.allRounders}</span>
              <span>🧤 {roleCounts.wicketKeepers}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          {selectedCount >= 11 ? (
            <button
              type="button"
              onClick={() => setIsSaveModalOpen(true)}
              className="px-3.5 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 active:scale-95 text-white text-xs font-bold transition shadow-xs flex items-center gap-1 cursor-pointer"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setIsTeamDrawerOpen(true)}
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 active:scale-95 text-slate-200 text-xs font-semibold transition border border-slate-700 cursor-pointer"
            >
              <span>View</span>
            </button>
          )}
        </div>
      </div>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* SELECTED PLAYERS SIDEBAR DRAWER */}
      {/* ───────────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {isTeamDrawerOpen && (
          <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/50 backdrop-blur-xs">
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between"
            >
              {/* Header */}
              <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-blue-600" />
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">Selected Players</h3>
                    <span className="text-xs text-slate-500 font-medium">{activeTeam?.name}</span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsTeamDrawerOpen(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Player List */}
              <div className="p-4 overflow-y-auto flex-1 space-y-3">
                <div className="p-3 rounded-xl bg-blue-50/70 border border-blue-100 text-xs">
                  <div className="flex items-center justify-between font-bold text-slate-800">
                    <span>Total Selected:</span>
                    <span>{selectedCount} of 15</span>
                  </div>
                  <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden mt-2">
                    <div
                      className="bg-blue-600 h-full rounded-full transition-all duration-300"
                      style={{ width: `${Math.min(100, (selectedCount / 15) * 100)}%` }}
                    />
                  </div>
                </div>

                {selectedPlayers.length === 0 ? (
                  <div className="py-12 text-center text-slate-400 text-xs">
                    <Users className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                    <p className="font-bold text-slate-600">No players added yet</p>
                    <p className="text-xs mt-1">Click "+ Add Player" on any card to select them.</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {selectedPlayers.map((player) => (
                      <div
                        key={player.id}
                        className="p-3 rounded-xl border border-slate-200 bg-white flex items-center justify-between gap-3 shadow-2xs"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <CloudinaryAvatar
                            src={player.avatar_url || player.avatar}
                            alt={player.name}
                            className="w-9 h-9 rounded-xl object-cover border border-slate-200 shrink-0"
                          />
                          <div className="min-w-0">
                            <h4 className="text-xs font-bold text-slate-900 truncate">
                              {player.name}
                            </h4>
                            <span className="text-xs text-slate-400 block truncate">
                              {player.role} • {player.district}
                            </span>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleTogglePlayer(player.id)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition"
                          title="Remove player"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="p-4 border-t border-slate-100 bg-slate-50">
                <button
                  type="button"
                  onClick={() => {
                    setIsTeamDrawerOpen(false);
                    setIsSaveModalOpen(true);
                  }}
                  disabled={selectedCount === 0}
                  className={`w-full py-2.5 rounded-xl text-xs font-bold text-white transition flex items-center justify-center gap-2 shadow-xs ${
                    selectedCount > 0
                      ? 'bg-blue-600 hover:bg-blue-700 cursor-pointer'
                      : 'bg-slate-300 cursor-not-allowed'
                  }`}
                >
                  <span>Choose Captain & Save ({selectedCount}/15)</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* CHOOSE CAPTAIN & SAVE TEAM MODAL */}
      {/* ───────────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {isSaveModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-2xl w-full p-6 space-y-5 my-auto"
            >
              <div className="flex items-start justify-between border-b border-slate-100 pb-3">
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    Choose Captain & Save Team
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Select the leaders for {activeTeam.name} and save the final 15 players.
                  </p>
                </div>
                <button onClick={() => setIsSaveModalOpen(false)} className="text-slate-400 hover:text-slate-600 p-1">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Leadership Dropdowns */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1">
                    <Crown className="w-3.5 h-3.5 text-amber-500" />
                    <span>Captain</span>
                  </label>
                  <select
                    value={activeTeam.roles?.captainId || ''}
                    onChange={(e) => handleAssignRole('captainId', e.target.value)}
                    className="w-full p-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold outline-none focus:border-blue-600"
                  >
                    <option value="">Select Captain...</option>
                    {selectedPlayers.map(p => (
                      <option key={p.id} value={p.id}>{p.name} ({p.role})</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 text-blue-500" />
                    <span>Vice-Captain</span>
                  </label>
                  <select
                    value={activeTeam.roles?.viceCaptainId || ''}
                    onChange={(e) => handleAssignRole('viceCaptainId', e.target.value)}
                    className="w-full p-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold outline-none focus:border-blue-600"
                  >
                    <option value="">Select Vice-Captain...</option>
                    {selectedPlayers.map(p => (
                      <option key={p.id} value={p.id}>{p.name} ({p.role})</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    🧤 Wicket Keeper
                  </label>
                  <select
                    value={activeTeam.roles?.wicketkeeperId || ''}
                    onChange={(e) => handleAssignRole('wicketkeeperId', e.target.value)}
                    className="w-full p-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold outline-none focus:border-blue-600"
                  >
                    <option value="">Select Wicket Keeper...</option>
                    {selectedPlayers.map(p => (
                      <option key={p.id} value={p.id}>{p.name} ({p.role})</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Review Table */}
              <div className="border border-slate-200 rounded-xl overflow-hidden max-h-56 overflow-y-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead className="bg-slate-50 sticky top-0 border-b border-slate-200 text-xs font-bold text-slate-400 uppercase">
                    <tr>
                      <th className="py-2 px-3">#</th>
                      <th className="py-2 px-3">Player</th>
                      <th className="py-2 px-3">Role</th>
                      <th className="py-2 px-3">District</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                    {selectedPlayers.map((player, idx) => (
                      <tr key={player.id}>
                        <td className="py-2 px-3 font-bold text-slate-400">{idx + 1}</td>
                        <td className="py-2 px-3 font-bold text-slate-900">{player.name}</td>
                        <td className="py-2 px-3">{player.role}</td>
                        <td className="py-2 px-3 text-slate-500">{player.district}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsSaveModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSaveTeam}
                  className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-xs flex items-center gap-1.5"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Team</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* SAVED NOTIFICATION MODAL */}
      {/* ───────────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {showSavedNotification && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-md w-full p-6 text-center space-y-4"
            >
              <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-xs">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <h3 className="text-xl font-bold text-slate-900">
                Team Saved Successfully!
              </h3>
              <p className="text-xs text-slate-500">
                The players for {activeTeam.name} have been saved to the JDCA database.
              </p>

              <div className="flex items-center justify-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => navigateTo('teams')}
                  className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition shadow-xs flex items-center gap-1.5"
                >
                  <Shield className="w-4 h-4" />
                  <span>View in Teams Tab</span>
                </button>
                <button
                  type="button"
                  onClick={() => setShowSavedNotification(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition"
                >
                  Done
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* PLAYER DETAILS BOTTOM SHEET */}
      {/* ───────────────────────────────────────────────────────────── */}
      <BottomSheet 
        isOpen={!!playerDetails} 
        onClose={() => setPlayerDetails(null)}
        title={activeTeam ? `Selecting for ${activeTeam.name}` : 'Player Detail'}
      >
        {playerDetails && (
          <PlayerDetail 
            player={playerDetails} 
            team={activeTeam}
            isSelected={activeTeam && activeTeam.selectedPlayerIds?.includes(playerDetails.id)}
            isConsidered={activeTeam && activeTeam.shortlistedPlayerIds?.includes(playerDetails.id)}
            onToggleSelect={() => {
              handleTogglePlayer(playerDetails.id);
              setPlayerDetails(null);
            }}
            onToggleConsider={() => {}}
            onClose={() => setPlayerDetails(null)}
          />
        )}
      </BottomSheet>

    </div>
  );
}
