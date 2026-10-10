import React, { useState, useMemo, useEffect } from 'react';
import { useCricket } from '../../context/CricketContext';
import { 
  Users, 
  Check, 
  Trash2, 
  Search, 
  Plus, 
  Shield, 
  X, 
  Printer, 
  CheckCircle2, 
  AlertCircle, 
  Crown, 
  MapPin, 
  Save, 
  SlidersHorizontal,
  Star,
  ArrowRight,
  AlertTriangle
} from 'lucide-react';
import {
  normalizeSelectionPlayer,
  getAvailableDistricts,
} from './selectionData';
import CloudinaryAvatar from '../ui/CloudinaryAvatar';
import confetti from 'canvas-confetti';
import { motion, AnimatePresence } from 'motion/react';
import BottomSheet from '../ui/BottomSheet';
import PlayerDetail from './PlayerDetail';
import { calculatePlayerAge, api } from '../../lib/api';
import { supabase } from '../../lib/supabase';

// Role chip styles - minimal & clean
const ROLE_BADGES = {
  'Batter': 'bg-amber-50 text-amber-700 border-amber-200',
  'Bowler': 'bg-blue-50 text-blue-700 border-blue-200',
  'All-Rounder': 'bg-purple-50 text-purple-700 border-purple-200',
  'Wicket Keeper': 'bg-teal-50 text-teal-700 border-teal-200',
};

const BASE_CATEGORIES = [
  { id: 'team_senior_men', name: 'Senior Men', shortName: 'Senior', category: 'Senior', gender: 'Men', maxAge: 99, rankLevel: 6 },
  { id: 'team_u23_men', name: 'Under-23 Boys', shortName: 'U-23', category: 'Under 23', gender: 'Men', maxAge: 23, rankLevel: 5 },
  { id: 'team_u19_men', name: 'Under-19 Boys', shortName: 'U-19', category: 'Under 19', gender: 'Men', maxAge: 19, rankLevel: 4 },
  { id: 'team_u17_men', name: 'Under-17 Boys', shortName: 'U-17', category: 'Under 17', gender: 'Men', maxAge: 17, rankLevel: 3 },
  { id: 'team_u15_men', name: 'Under-15 Boys', shortName: 'U-15', category: 'Under 15', gender: 'Men', maxAge: 15, rankLevel: 2 },
  { id: 'team_u13_men', name: 'Under-13 Boys', shortName: 'U-13', category: 'Under 13', gender: 'Men', maxAge: 13, rankLevel: 1 },
  { id: 'team_u19_women', name: 'Under-19 Girls', shortName: 'U-19 Girls', category: 'Under 19', gender: 'Women', maxAge: 19, rankLevel: 4 },
];

export default function SelectionWorkspace() {
  const { 
    players: rawPlayers, 
    navigateTo, 
    selectorPermissions, 
    userRole,
    refreshAdminData
  } = useCricket();

  const isAdmin = userRole === 'SUPER_ADMIN' || userRole === 'DISTRICT_ADMIN';
  const maxRank = selectorPermissions?.maxAgeRankLevel;

  const [dbAgeCategories, setDbAgeCategories] = useState([]);
  const [isSaving, setIsSaving] = useState(false);
  const [activeSeason, setActiveSeason] = useState('2026-27');
  const [activeTab, setActiveTab] = useState('pool'); // 'pool' | 'squad'

  // Load database age categories & season
  useEffect(() => {
    let mounted = true;
    async function init() {
      try {
        const cats = await api.getAgeCategories();
        if (mounted && cats?.length > 0) setDbAgeCategories(cats);
        const { data: sData } = await supabase.from('seasons').select('name').eq('is_current_active', true).maybeSingle();
        if (mounted && sData?.name) setActiveSeason(sData.name);
      } catch (e) {
        console.warn('Metadata load error:', e);
      }
    }
    init();
    return () => { mounted = false; };
  }, []);

  // Filter categories by selector permission rank level
  const categoryOptions = useMemo(() => {
    const list = BASE_CATEGORIES.map(base => {
      const match = dbAgeCategories.find(dbCat => 
        dbCat.rank_level === base.rankLevel || 
        dbCat.short_name?.toUpperCase() === base.shortName.toUpperCase()
      );
      return {
        ...base,
        age_category_id: match ? match.id : null,
        rankLevel: match ? match.rank_level : base.rankLevel,
        maxAge: match?.maximum_age || base.maxAge
      };
    });

    if (isAdmin || !maxRank) return list;
    return list.filter(opt => opt.rankLevel <= maxRank);
  }, [isAdmin, maxRank, dbAgeCategories]);

  // Master Teams state
  const [teams, setTeams] = useState(() => categoryOptions.map(opt => ({
    id: opt.id,
    season: '2026-27',
    age_category_id: opt.age_category_id,
    category: opt.category,
    gender: opt.gender,
    name: `JDCA ${opt.name}`,
    selectedPlayerIds: [],
    roles: { captainId: '', viceCaptainId: '', wicketkeeperId: '' }
  })));

  const [activeTeamId, setActiveTeamId] = useState(categoryOptions[0]?.id || BASE_CATEGORIES[0].id);

  // Sync category changes
  useEffect(() => {
    setTeams(prev => {
      return categoryOptions.map(opt => {
        const existing = prev.find(t => t.id === opt.id);
        if (existing) return { ...existing, age_category_id: opt.age_category_id || existing.age_category_id };
        return {
          id: opt.id,
          season: activeSeason,
          age_category_id: opt.age_category_id,
          category: opt.category,
          gender: opt.gender,
          name: `JDCA ${opt.name}`,
          selectedPlayerIds: [],
          roles: { captainId: '', viceCaptainId: '', wicketkeeperId: '' }
        };
      });
    });
    if (categoryOptions.length > 0 && !categoryOptions.find(o => o.id === activeTeamId)) {
      setActiveTeamId(categoryOptions[0].id);
    }
  }, [categoryOptions, activeSeason]);

  // Load existing saved representative teams from Supabase
  useEffect(() => {
    let active = true;
    async function loadSaved() {
      try {
        const saved = await api.getJdcaDivisionTeams();
        if (active && saved && saved.length > 0) {
          setTeams(prev => prev.map(t => {
            const match = saved.find(s => 
              (t.age_category_id && s.age_category_id === t.age_category_id && s.gender === t.gender) ||
              s.name === t.name
            );
            if (match) {
              const pIds = (match.team_players || []).map(tp => tp.player_id);
              return {
                ...t,
                id: match.id,
                dbTeamId: match.id,
                selectedPlayerIds: pIds.length > 0 ? pIds : t.selectedPlayerIds,
                roles: {
                  captainId: match.captain_id || t.roles.captainId,
                  viceCaptainId: match.vice_captain_id || t.roles.viceCaptainId,
                  wicketkeeperId: t.roles.wicketkeeperId
                }
              };
            }
            return t;
          }));
        }
      } catch (err) {
        console.warn('Note loading representative teams:', err);
      }
    }
    loadSaved();
    return () => { active = false; };
  }, [dbAgeCategories]);

  // Current active team
  const activeTeam = useMemo(() => {
    return teams.find(t => t.id === activeTeamId) || teams[0];
  }, [teams, activeTeamId]);

  // Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRole, setSelectedRole] = useState('All');
  const [selectedDistrict, setSelectedDistrict] = useState('All');
  const [sortBy, setSortBy] = useState('runs');

  // Modals & Sheets
  const [playerDetails, setPlayerDetails] = useState(null);
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);
  const [showSavedModal, setShowSavedModal] = useState(false);

  // Normalize players directly from raw DB results
  const allNormalizedPlayers = useMemo(() => {
    return (rawPlayers || []).map(p => normalizeSelectionPlayer(p)).filter(Boolean);
  }, [rawPlayers]);

  // Players eligible for current team division & gender
  const categoryPlayers = useMemo(() => {
    if (!activeTeam) return [];
    const maxAge = activeTeam.maxAge || 99;
    const teamGender = activeTeam.gender || 'Men';

    return allNormalizedPlayers.filter(p => {
      // 1. Gender check
      const pGender = p.gender || 'Men';
      if (pGender !== teamGender) return false;

      // 2. Age eligibility check
      const pAge = calculatePlayerAge(p.date_of_birth || p.dob);
      if (pAge && pAge > 0) {
        if (pAge <= maxAge) return true;
        if (maxAge >= 90) return true; // Senior division allows all ages
        return false;
      }

      // 3. Category string fallback
      const pCat = String(p.category || '').toLowerCase();
      const tCat = String(activeTeam.category || activeTeam.name || '').toLowerCase();
      if (pCat && tCat) {
        if (pCat === tCat || pCat.includes(tCat) || tCat.includes(pCat)) return true;
        const pNum = pCat.match(/\d+/)?.[0];
        const tNum = tCat.match(/\d+/)?.[0];
        if (pNum && tNum) {
          return parseInt(pNum, 10) <= parseInt(tNum, 10);
        }
      }

      if (maxAge >= 90) return true;
      return true;
    });
  }, [allNormalizedPlayers, activeTeam]);

  // Complete list of JDCA districts (always includes all 10 official districts)
  const availableDistricts = useMemo(() => {
    const base = [
      'All Districts',
      'Jabalpur',
      'Katni',
      'Narsinghpur',
      'Seoni',
      'Mandla',
      'Balaghat',
      'Chhindwara',
      'Dindori',
      'Pandhurna'
    ];
    categoryPlayers.forEach(p => {
      if (p.district && !base.includes(p.district)) base.push(p.district);
    });
    return base;
  }, [categoryPlayers]);

  // Selected Players in Squad
  const selectedPlayers = useMemo(() => {
    const ids = activeTeam?.selectedPlayerIds || [];
    return allNormalizedPlayers.filter(p => ids.includes(p.id));
  }, [allNormalizedPlayers, activeTeam]);

  // Role Breakdown
  const roleCounts = useMemo(() => {
    return selectedPlayers.reduce((acc, p) => {
      if (p.primary_role === 'Batter') acc.batters++;
      else if (p.primary_role === 'Bowler') acc.bowlers++;
      else if (p.primary_role === 'All-Rounder') acc.allRounders++;
      else if (p.primary_role === 'Wicket Keeper') acc.wicketKeepers++;
      return acc;
    }, { batters: 0, bowlers: 0, allRounders: 0, wicketKeepers: 0 });
  }, [selectedPlayers]);

  // Filtered & Sorted Players List
  const displayedPlayers = useMemo(() => {
    let list = categoryPlayers.filter(p => {
      if (selectedRole !== 'All' && p.primary_role !== selectedRole) return false;
      if (selectedDistrict !== 'All' && selectedDistrict !== 'All Districts') {
        const pDist = (p.district || 'Jabalpur').toLowerCase();
        const sDist = selectedDistrict.toLowerCase();
        if (!pDist.includes(sDist)) return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = (p.full_name || '').toLowerCase().includes(q);
        const matchDist = (p.district || '').toLowerCase().includes(q);
        if (!matchName && !matchDist) return false;
      }
      return true;
    });

    list.sort((a, b) => {
      if (sortBy === 'runs') return (b.careerRuns || 0) - (a.careerRuns || 0);
      if (sortBy === 'avg') return parseFloat(b.battingAvg || 0) - parseFloat(a.battingAvg || 0);
      if (sortBy === 'wickets') return (b.wickets || 0) - (a.wickets || 0);
      if (sortBy === 'matches') return (b.matches || 0) - (a.matches || 0);
      return 0;
    });

    return list;
  }, [categoryPlayers, selectedRole, selectedDistrict, searchQuery, sortBy]);

  // Add / Remove Player from Squad
  const handleTogglePlayer = (playerId) => {
    if (!activeTeam) return;
    setTeams(prev => prev.map(t => {
      if (t.id !== activeTeam.id) return t;
      const current = t.selectedPlayerIds || [];
      const exists = current.includes(playerId);

      if (exists) {
        return {
          ...t,
          selectedPlayerIds: current.filter(id => id !== playerId),
          roles: {
            captainId: t.roles?.captainId === playerId ? '' : t.roles?.captainId,
            viceCaptainId: t.roles?.viceCaptainId === playerId ? '' : t.roles?.viceCaptainId,
            wicketkeeperId: t.roles?.wicketkeeperId === playerId ? '' : t.roles?.wicketkeeperId,
          }
        };
      } else {
        if (current.length >= 20) {
          alert('Maximum squad size is 20 players. Please remove a player first.');
          return t;
        }
        return {
          ...t,
          selectedPlayerIds: [...current, playerId]
        };
      }
    }));
  };

  // Assign Leadership Roles
  const handleAssignRole = (roleKey, playerId) => {
    if (!activeTeam) return;
    setTeams(prev => prev.map(t => {
      if (t.id !== activeTeam.id) return t;
      return {
        ...t,
        roles: {
          ...t.roles,
          [roleKey]: t.roles?.[roleKey] === playerId ? '' : playerId
        }
      };
    }));
  };

  // Save Squad to Supabase Database
  const handleSaveSquad = async () => {
    if (!activeTeam || selectedPlayers.length === 0) {
      alert('Please select at least one player before saving.');
      return;
    }

    setIsSaving(true);
    try {
      const activeCat = categoryOptions.find(o => o.id === activeTeam.id);
      const teamData = {
        id: activeTeam.dbTeamId || activeTeam.id,
        name: activeTeam.name,
        short_name: (activeCat?.shortName || activeTeam.category || 'JDCA').substring(0, 5).toUpperCase(),
        season: activeSeason,
        age_category_id: activeCat?.age_category_id || activeTeam.age_category_id,
        gender: activeTeam.gender || 'Men',
      };

      const savedId = await api.saveRepresentativeSquad(
        teamData,
        activeTeam.selectedPlayerIds || [],
        activeTeam.roles || {}
      );

      setTeams(prev => prev.map(t => {
        if (t.id !== activeTeam.id) return t;
        return {
          ...t,
          id: savedId || t.id,
          dbTeamId: savedId || t.dbTeamId,
        };
      }));

      setShowSavedModal(true);
      confetti({ particleCount: 80, spread: 60, origin: { y: 0.6 } });
      if (refreshAdminData) refreshAdminData();
    } catch (err) {
      console.error('Failed to save squad:', err);
      alert('Squad saved locally. (Offline mode)');
      setShowSavedModal(true);
    } finally {
      setIsSaving(false);
    }
  };

  const isSelected = (id) => (activeTeam?.selectedPlayerIds || []).includes(id);
  const selectedCount = selectedPlayers.length;
  const activeCatMeta = categoryOptions.find(opt => opt.id === activeTeamId);

  // If selector has no assigned category
  if (!isAdmin && userRole === 'SELECTOR' && !maxRank) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 max-w-md text-center space-y-4">
          <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center mx-auto border border-amber-200">
            <AlertCircle className="w-6 h-6" />
          </div>
          <h2 className="text-lg font-bold text-slate-900">No Age Division Assigned</h2>
          <p className="text-sm text-slate-500 leading-relaxed">
            Your selector account has not been assigned an age division yet. Please ask an administrator to assign your age category under <strong>Administration &gt; Staff &amp; Users</strong>.
          </p>
          <button
            onClick={() => navigateTo('home')}
            className="w-full py-2.5 rounded-xl bg-slate-900 text-white text-sm font-bold hover:bg-slate-800 transition cursor-pointer"
          >
            Go to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans pb-32">

      {/* ───────────────────────────────────────────────────────────── */}
      {/* 1. CLEAN HEADER (UNCLUTTERED, ELEGANT) */}
      {/* ───────────────────────────────────────────────────────────── */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-2xs">
        <div className="max-w-6xl mx-auto px-4 py-3.5 sm:py-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            
            {/* Title & Division Selector */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center shrink-0">
                <Shield className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-lg sm:text-xl font-bold text-slate-900">
                    Player Selection
                  </h1>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-semibold">
                    {activeSeason}
                  </span>
                </div>
                <div className="flex items-center gap-2 mt-0.5">
                  <select
                    value={activeTeamId}
                    onChange={(e) => setActiveTeamId(e.target.value)}
                    className="text-xs font-bold text-blue-600 bg-transparent border-0 outline-none cursor-pointer hover:underline"
                  >
                    {categoryOptions.map(opt => (
                      <option key={opt.id} value={opt.id}>
                        Division: {opt.name} ({teams.find(t => t.id === opt.id)?.selectedPlayerIds?.length || 0}/20)
                      </option>
                    ))}
                  </select>
                  {!isAdmin && selectorPermissions?.ageCategoryName && (
                    <span className="text-[11px] text-slate-400 font-medium">
                      &bull; Scope: {selectorPermissions.ageCategoryName} &amp; below
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Quick Squad Status & Actions */}
            <div className="flex items-center gap-2.5 self-end sm:self-auto">
              <button
                type="button"
                onClick={() => setActiveTab(activeTab === 'squad' ? 'pool' : 'squad')}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer border ${
                  activeTab === 'squad'
                    ? 'bg-slate-900 text-white border-slate-900'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                }`}
              >
                <Users className="w-4 h-4 text-blue-500" />
                <span>Squad: <strong>{selectedCount} / 20</strong></span>
              </button>

              <button
                type="button"
                disabled={isSaving || selectedCount === 0}
                onClick={handleSaveSquad}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer shadow-xs ${
                  selectedCount >= 15
                    ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                    : selectedCount > 0
                    ? 'bg-blue-600 hover:bg-blue-700 text-white'
                    : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                }`}
              >
                {isSaving ? (
                  <span>Saving...</span>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    <span>Save Squad</span>
                  </>
                )}
              </button>
            </div>

          </div>

          {/* Clean 2-Tab Navigation */}
          <div className="flex items-center gap-6 mt-3 border-t border-slate-100 pt-2 text-sm font-semibold">
            <button
              type="button"
              onClick={() => setActiveTab('pool')}
              className={`pb-2 relative cursor-pointer transition ${
                activeTab === 'pool' ? 'text-blue-600 font-bold' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Available Players ({categoryPlayers.length})
              {activeTab === 'pool' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600" />
              )}
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('squad')}
              className={`pb-2 relative cursor-pointer transition flex items-center gap-1.5 ${
                activeTab === 'squad' ? 'text-blue-600 font-bold' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <span>Selected Squad</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                selectedCount >= 15 ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'
              }`}>
                {selectedCount}/20
              </span>
              {activeTab === 'squad' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600" />
              )}
            </button>
          </div>

        </div>
      </header>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* 2. MAIN CONTENT AREA */}
      {/* ───────────────────────────────────────────────────────────── */}
      <main className="max-w-6xl mx-auto px-4 py-5">

        {/* ═══════════════════════════════════════════════════════════ */}
        {/* TAB 1: AVAILABLE PLAYERS (CLEAN SCOUTING POOL) */}
        {/* ═══════════════════════════════════════════════════════════ */}
        {activeTab === 'pool' && (
          <div className="space-y-4">

            {/* Clean Single Filter Bar */}
            <div className="bg-white rounded-xl border border-slate-200 p-3 shadow-2xs space-y-3">
              
              <div className="flex flex-col sm:flex-row items-center gap-2.5">
                {/* Search */}
                <div className="relative flex-1 w-full">
                  <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search by player name or district..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-3 py-1.5 text-sm bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-blue-600 focus:bg-white text-slate-900"
                  />
                  {searchQuery && (
                    <button onClick={() => setSearchQuery('')} className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600">
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {/* District Filter */}
                <select
                  value={selectedDistrict}
                  onChange={(e) => setSelectedDistrict(e.target.value)}
                  className="w-full sm:w-auto px-3 py-1.5 text-xs font-semibold bg-slate-50 border border-slate-200 rounded-lg outline-none cursor-pointer h-[34px]"
                >
                  <option value="All">All Districts ({categoryPlayers.length})</option>
                  {availableDistricts.filter(d => d !== 'All' && d !== 'All Districts').map(d => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>

                {/* Sort Filter */}
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full sm:w-auto px-3 py-1.5 text-xs font-semibold bg-slate-50 border border-slate-200 rounded-lg outline-none cursor-pointer h-[34px]"
                >
                  <option value="runs">Most Runs</option>
                  <option value="avg">Highest Average</option>
                  <option value="wickets">Most Wickets</option>
                  <option value="matches">Most Matches</option>
                </select>
              </div>

              {/* Role Filter Pills */}
              <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pt-1 border-t border-slate-100">
                {[
                  { id: 'All', label: 'All Roles' },
                  { id: 'Batter', label: 'Batters' },
                  { id: 'Bowler', label: 'Bowlers' },
                  { id: 'All-Rounder', label: 'All-Rounders' },
                  { id: 'Wicket Keeper', label: 'Wicket Keepers' },
                ].map(role => (
                  <button
                    key={role.id}
                    type="button"
                    onClick={() => setSelectedRole(role.id)}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold transition cursor-pointer whitespace-nowrap ${
                      selectedRole === role.id
                        ? 'bg-slate-900 text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {role.label}
                  </button>
                ))}
              </div>

            </div>

            {/* Players Grid */}
            {displayedPlayers.length === 0 ? (
              <div className="bg-white rounded-xl border border-slate-200 p-12 text-center text-slate-500">
                <Users className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                <p className="font-semibold text-slate-700">No players match the criteria</p>
                <p className="text-xs text-slate-400 mt-1">Try clearing your search or switching districts.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {displayedPlayers.map(player => {
                  const inSquad = isSelected(player.id);
                  const roleStyle = ROLE_BADGES[player.primary_role] || 'bg-slate-100 text-slate-700 border-slate-200';

                  // Over-age check
                  const maxAge = activeCatMeta?.maxAge;
                  const playerAge = calculatePlayerAge(player.date_of_birth || player.dob);
                  const isOverAge = maxAge && playerAge > maxAge;

                  return (
                    <div
                      key={player.id}
                      className={`bg-white rounded-xl border transition p-4 flex flex-col justify-between shadow-2xs ${
                        inSquad
                          ? 'border-emerald-500 ring-1 ring-emerald-500 bg-emerald-50/20'
                          : isOverAge
                          ? 'border-slate-200 bg-slate-50 opacity-70'
                          : 'border-slate-200 hover:border-slate-300 hover:shadow-xs'
                      }`}
                    >
                      {/* Top Info */}
                      <div>
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-center gap-2.5 min-w-0">
                            <CloudinaryAvatar
                              src={player.avatar_url}
                              alt={player.full_name}
                              className="w-10 h-10 rounded-lg object-cover border border-slate-200 shrink-0"
                            />
                            <div className="min-w-0">
                              <h3 className="font-bold text-sm text-slate-900 truncate" title={player.full_name}>
                                {player.full_name}
                              </h3>
                              <div className="flex items-center gap-1.5 mt-0.5 text-xs text-slate-500">
                                <span className={`px-1.5 py-0.2 rounded text-[10px] font-bold border ${roleStyle}`}>
                                  {player.primary_role}
                                </span>
                                <span>&bull;</span>
                                <span className="truncate">{player.district || 'Jabalpur'}</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Clean Core Stats */}
                        <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t border-slate-100 text-center">
                          <div>
                            <span className="text-[10px] uppercase font-bold text-slate-400 block">Matches</span>
                            <span className="text-xs font-bold text-slate-800">{player.matches || 0}</span>
                          </div>
                          <div>
                            <span className="text-[10px] uppercase font-bold text-slate-400 block">Runs</span>
                            <span className="text-xs font-bold text-amber-700">{player.careerRuns || 0}</span>
                          </div>
                          <div>
                            <span className="text-[10px] uppercase font-bold text-slate-400 block">Wickets</span>
                            <span className="text-xs font-bold text-blue-700">{player.wickets || 0}</span>
                          </div>
                        </div>
                      </div>

                      {/* Card Actions */}
                      <div className="flex items-center justify-between gap-2 mt-3 pt-3 border-t border-slate-100">
                        <button
                          type="button"
                          onClick={() => setPlayerDetails(player)}
                          className="text-xs font-semibold text-slate-500 hover:text-slate-900 cursor-pointer"
                        >
                          Profile &amp; Stats
                        </button>

                        {isOverAge ? (
                          <span className="text-[11px] font-bold text-rose-600 bg-rose-50 px-2 py-1 rounded border border-rose-200">
                            Age {playerAge} &gt; {maxAge}
                          </span>
                        ) : (
                          <button
                            type="button"
                            onClick={() => handleTogglePlayer(player.id)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1 cursor-pointer ${
                              inSquad
                                ? 'bg-emerald-600 text-white hover:bg-rose-600'
                                : 'bg-slate-900 hover:bg-slate-800 text-white'
                            }`}
                          >
                            {inSquad ? (
                              <>
                                <Check className="w-3.5 h-3.5" />
                                <span>Selected</span>
                              </>
                            ) : (
                              <>
                                <Plus className="w-3.5 h-3.5" />
                                <span>Select</span>
                              </>
                            )}
                          </button>
                        )}
                      </div>

                    </div>
                  );
                })}
              </div>
            )}

            {/* Clean Floating Bottom Bar */}
            <div className="fixed bottom-4 left-4 right-4 max-w-2xl mx-auto z-40 bg-slate-900 text-white p-3 rounded-2xl shadow-xl border border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-emerald-500 text-white font-bold text-xs flex items-center justify-center shrink-0">
                  {selectedCount}
                </div>
                <div>
                  <div className="text-xs font-bold">
                    {selectedCount} of 20 Players Selected
                  </div>
                  <div className="text-[11px] text-slate-400">
                    🏏 {roleCounts.batters} &bull; 🔥 {roleCounts.bowlers} &bull; ⚡ {roleCounts.allRounders} &bull; 🧤 {roleCounts.wicketKeepers}
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setActiveTab('squad')}
                className="px-4 py-1.5 rounded-xl bg-white text-slate-900 text-xs font-bold hover:bg-slate-100 transition flex items-center gap-1 cursor-pointer"
              >
                <span>Review Squad</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

          </div>
        )}

        {/* ═══════════════════════════════════════════════════════════ */}
        {/* TAB 2: SELECTED SQUAD & LEADERSHIP */}
        {/* ═══════════════════════════════════════════════════════════ */}
        {activeTab === 'squad' && (
          <div className="space-y-4">

            {/* Squad Summary Card */}
            <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-base font-bold text-slate-900">
                  {activeTeam.name} Roster
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Assigned players for the representative tournament. Recommended squad size: 15 to 20 players.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsPrintModalOpen(true)}
                  className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 flex items-center gap-1.5 cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print Sheet</span>
                </button>
                <button
                  type="button"
                  disabled={isSaving || selectedCount === 0}
                  onClick={handleSaveSquad}
                  className="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Save Squad</span>
                </button>
              </div>
            </div>

            {/* Leadership Dropdowns */}
            <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs space-y-3">
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Assign Team Leadership
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1">
                    <Crown className="w-3.5 h-3.5 text-amber-500" />
                    <span>Captain</span>
                  </label>
                  <select
                    value={activeTeam.roles?.captainId || ''}
                    onChange={(e) => handleAssignRole('captainId', e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold outline-none focus:border-blue-600"
                  >
                    <option value="">Select Captain...</option>
                    {selectedPlayers.map(p => (
                      <option key={p.id} value={p.id}>{p.full_name} ({p.primary_role} - {p.district})</option>
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
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold outline-none focus:border-blue-600"
                  >
                    <option value="">Select Vice-Captain...</option>
                    {selectedPlayers.map(p => (
                      <option key={p.id} value={p.id}>{p.full_name} ({p.primary_role} - {p.district})</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Selected Players Table */}
            {selectedPlayers.length === 0 ? (
              <div className="bg-white rounded-xl border border-slate-200 p-12 text-center text-slate-500">
                <Users className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                <p className="font-semibold text-slate-700">No players assigned yet</p>
                <p className="text-xs text-slate-400 mt-1">
                  Switch to the "Available Players" tab to select candidates for this squad.
                </p>
              </div>
            ) : (
              <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase text-[10px]">
                    <tr>
                      <th className="py-2.5 px-3 w-10">#</th>
                      <th className="py-2.5 px-3">Player</th>
                      <th className="py-2.5 px-3">Role</th>
                      <th className="py-2.5 px-3">District</th>
                      <th className="py-2.5 px-3">Leadership</th>
                      <th className="py-2.5 px-3 text-right">Remove</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                    {selectedPlayers.map((player, idx) => {
                      const isCapt = activeTeam.roles?.captainId === player.id;
                      const isVC = activeTeam.roles?.viceCaptainId === player.id;

                      return (
                        <tr key={player.id} className="hover:bg-slate-50 transition">
                          <td className="py-2.5 px-3 text-slate-400 font-bold">{idx + 1}</td>
                          <td className="py-2.5 px-3 font-bold text-slate-900">
                            <div className="flex items-center gap-2">
                              <CloudinaryAvatar src={player.avatar_url} alt={player.full_name} className="w-7 h-7 rounded-lg object-cover" />
                              <span>{player.full_name}</span>
                            </div>
                          </td>
                          <td className="py-2.5 px-3">{player.primary_role}</td>
                          <td className="py-2.5 px-3 text-slate-500">{player.district || 'Jabalpur'}</td>
                          <td className="py-2.5 px-3">
                            {isCapt ? (
                              <span className="px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 text-[10px] font-bold">
                                👑 Captain
                              </span>
                            ) : isVC ? (
                              <span className="px-1.5 py-0.5 rounded bg-blue-100 text-blue-800 text-[10px] font-bold">
                                ⭐ Vice-Captain
                              </span>
                            ) : '-'}
                          </td>
                          <td className="py-2.5 px-3 text-right">
                            <button
                              type="button"
                              onClick={() => handleTogglePlayer(player.id)}
                              className="p-1 text-slate-400 hover:text-rose-600 transition"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}

          </div>
        )}

      </main>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* 3. PRINT MODAL */}
      {/* ───────────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {isPrintModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl shadow-xl border border-slate-200 max-w-2xl w-full p-6 space-y-4"
            >
              <div className="text-center border-b pb-3">
                <h2 className="text-base font-bold text-slate-900 uppercase">
                  Jabalpur Division Cricket Association
                </h2>
                <p className="text-xs font-semibold text-slate-500">
                  Official Squad Sheet: {activeTeam.name} ({activeSeason})
                </p>
              </div>

              <div className="max-h-72 overflow-y-auto">
                <table className="w-full text-xs text-left border">
                  <thead className="bg-slate-100 text-slate-700 font-bold uppercase text-[10px]">
                    <tr>
                      <th className="p-2 border-b w-8">#</th>
                      <th className="p-2 border-b">Player Name</th>
                      <th className="p-2 border-b">Role</th>
                      <th className="p-2 border-b">District</th>
                      <th className="p-2 border-b">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y text-slate-800">
                    {selectedPlayers.map((p, idx) => (
                      <tr key={p.id}>
                        <td className="p-2 text-slate-400">{idx + 1}</td>
                        <td className="p-2 font-bold">{p.full_name}</td>
                        <td className="p-2">{p.primary_role}</td>
                        <td className="p-2">{p.district || 'Jabalpur'}</td>
                        <td className="p-2 font-bold">
                          {activeTeam.roles?.captainId === p.id ? 'Captain (C)' :
                           activeTeam.roles?.viceCaptainId === p.id ? 'Vice-Captain (VC)' :
                           idx >= 15 ? 'Reserve' : 'Playing Squad'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t">
                <button
                  type="button"
                  onClick={() => setIsPrintModalOpen(false)}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-100"
                >
                  Close
                </button>
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="px-4 py-1.5 rounded-lg text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 flex items-center gap-1.5"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print Document</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* 4. SAVED TO SUPABASE SUCCESS MODAL */}
      {/* ───────────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {showSavedModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl shadow-xl border border-slate-200 max-w-sm w-full p-6 text-center space-y-4"
            >
              <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Squad Saved Successfully!
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  The {selectedCount} players have been saved to the JDCA database and assigned to <strong>{activeTeam.name}</strong>.
                </p>
              </div>
              <div className="flex items-center justify-center gap-2">
                <button
                  type="button"
                  onClick={() => navigateTo('teams')}
                  className="px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 transition"
                >
                  View in Teams Tab
                </button>
                <button
                  type="button"
                  onClick={() => setShowSavedModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 text-xs font-semibold hover:bg-slate-200 transition"
                >
                  Done
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ───────────────────────────────────────────────────────────── */}
      {/* 5. PLAYER DETAILS SHEET */}
      {/* ───────────────────────────────────────────────────────────── */}
      <BottomSheet 
        isOpen={!!playerDetails} 
        onClose={() => setPlayerDetails(null)}
        title={activeTeam ? `Candidate for ${activeTeam.name}` : 'Player Profile'}
      >
        {playerDetails && (
          <PlayerDetail 
            player={playerDetails} 
            team={activeTeam}
            isSelected={isSelected(playerDetails.id)}
            isConsidered={false}
            onToggleSelect={() => {
              handleTogglePlayer(playerDetails.id);
            }}
            onToggleConsider={() => {}}
            onClose={() => setPlayerDetails(null)}
          />
        )}
      </BottomSheet>

    </div>
  );
}
