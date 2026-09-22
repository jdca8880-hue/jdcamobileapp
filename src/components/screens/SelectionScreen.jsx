import React, { useState } from 'react';
import { 
  Search, 
  MapPin, 
  ChevronRight, 
  CheckCircle2, 
  Users, 
  Filter, 
  Award, 
  Download, 
  Save, 
  Sparkles,
  ShieldAlert,
  Sliders,
  AlertTriangle,
  Trophy
} from 'lucide-react';
import { useCricket } from '../../context/CricketContext';
import { PageHeader, SectionLabel } from '../ui/PageHeader';
import { Badge } from '../ui/Badge';
import StatCard from '../ui/StatCard';
import { motion, AnimatePresence } from 'motion/react';

const listVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.05 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1, transition: { type: 'spring', stiffness: 300, damping: 24 } }
};

const JDCA_DISTRICTS = [
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

const ROLE_FILTERS = ['All Roles', 'Batsman', 'Bowler', 'All-Rounder', 'Wicket-Keeper'];

export default function SelectionScreen() {
  const { 
    players = [], 
    shortlistedIds = [], 
    toggleShortlist, 
    setSelectedPlayer,
    setCompareModalOpen,
    setComparePlayer2,
    representativeTeams = [],
    activeSelectionTeam,
    setActiveSelectionTeam,
    selectorPermissions,
    finalizeSelectionProcess,
    navigateTo 
  } = useCricket();

  const [selectedDistrict, setSelectedDistrict] = useState('All Districts');
  const [selectedRole, setSelectedRole] = useState('All Roles');
  const [searchQuery, setSearchQuery] = useState('');
  const [showSavedToast, setShowSavedToast] = useState(false);

  const currentTeam = activeSelectionTeam || representativeTeams[0];
  
  if (!currentTeam) {
    return (
      <div className="flex items-center justify-center h-screen bg-slate-50">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-cobalt border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <h3 className="text-slate-600 font-bold">Loading Selection Processes...</h3>
        </div>
      </div>
    );
  }

  // Filter players according to authorized age rank and district permissions
  const filteredPlayers = players.filter((player) => {
    // 1. Selector Permission Level Check (Max Age Rank Level)
    const maxRank = selectorPermissions?.maxAgeRankLevel || 6;
    const playerCategoryRank = 
      player.category === 'Under 13' || player.category === 'U13' ? 1 :
      player.category === 'Under 15' || player.category === 'U15' ? 2 :
      player.category === 'Under 17' || player.category === 'U17' ? 3 :
      player.category === 'Under 19' || player.category === 'U19' ? 4 :
      player.category === 'Under 23' || player.category === 'U23' ? 5 : 6;

    if (playerCategoryRank > maxRank) return false;

    // 2. Category Match with Active Target Team
    const normalizedPlayerCategory = (player.category || '').replace('-', ' ').toLowerCase();
    const normalizedTargetCategory = (currentTeam.ageCategory || '').replace('-', ' ').toLowerCase();
    const matchesCategory = normalizedPlayerCategory === normalizedTargetCategory || playerCategoryRank <= (currentTeam.ageRankLevel || 4);

    // 3. District Access Filter
    const matchesDistrict = 
      selectedDistrict === 'All Districts' ? true : player.district === selectedDistrict;

    // 4. Role Filter
    const matchesRole = 
      selectedRole === 'All Roles' ? true : (player.primaryRole || player.role || '').toLowerCase().includes(selectedRole.toLowerCase());

    // 5. Search Filter
    const matchesSearch = 
      (player.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (player.district || '').toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCategory && matchesDistrict && matchesRole && matchesSearch;
  });

  const selectedSquad = players.filter(p => shortlistedIds.includes(p.id));

  // Squad composition breakdown
  const squadComposition = selectedSquad.reduce((acc, p) => {
    const role = (p.primaryRole || p.role || '').toLowerCase();
    if (role.includes('bat')) acc.batsmen += 1;
    else if (role.includes('bowl')) acc.bowlers += 1;
    else if (role.includes('all')) acc.allRounders += 1;
    else if (role.includes('keeper') || role.includes('wk')) acc.wicketKeepers += 1;
    else acc.others += 1;
    return acc;
  }, { batsmen: 0, bowlers: 0, allRounders: 0, wicketKeepers: 0, others: 0 });

  // Factual Warnings
  const squadWarnings = [];
  if (selectedSquad.length > 0) {
    if (squadComposition.wicketKeepers < 1) {
      squadWarnings.push('Warning: No Wicketkeeper selected in the squad.');
    } else if (squadComposition.wicketKeepers === 1) {
      squadWarnings.push('Notice: Only 1 Wicketkeeper selected.');
    }
    if (squadComposition.bowlers < 3) {
      squadWarnings.push('Warning: Fewer than 3 specialized bowlers selected.');
    }
    if (selectedSquad.length > currentTeam.targetSquadSize) {
      squadWarnings.push(`Caution: Squad count (${selectedSquad.length}) exceeds target limit (${currentTeam.targetSquadSize}).`);
    }
  }

  const handlePlayerClick = (player) => {
    if (setSelectedPlayer) setSelectedPlayer(player);
    if (navigateTo) navigateTo('player-profile');
  };

  const handleSaveSquad = async () => {
    try {
      if (!currentTeam.selectedPlayerIds || currentTeam.selectedPlayerIds.length === 0) {
        alert("Cannot lock an empty squad. Please select at least one player.");
        return;
      }
      await finalizeSelectionProcess(currentTeam.id, currentTeam.selectedPlayerIds);
      setShowSavedToast(true);
      setTimeout(() => setShowSavedToast(false), 3000);
    } catch (e) {
      alert("Failed to lock squad. You might not have the correct permissions.");
    }
  };

  const handleOpenComparison = (player1) => {
    setSelectedPlayer(player1);
    const otherPlayer = players.find(p => p.id !== player1.id) || players[1];
    setComparePlayer2(otherPlayer);
    setCompareModalOpen(true);
  };

  return (
    <div className="space-y-6 pb-24">
      {/* Toast Notification */}
      {showSavedToast && (
        <div className="fixed top-20 right-6 z-50 flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-3 text-white shadow-xl animate-in fade-in slide-in-from-top-2">
          <CheckCircle2 className="w-5 h-5" />
          <span className="text-sm font-semibold">Representative Squad choice recorded successfully!</span>
        </div>
      )}

      {/* Page Header */}
      <PageHeader
        title="Player Selection"
        subtitle="Form Official JDCA Representative Teams for Age Categories"
        actions={
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleSaveSquad}
              disabled={currentTeam.status === 'FINALIZED'}
              className="inline-flex items-center gap-1.5 rounded-xl bg-cobalt px-4 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-cobalt-700 transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save className="w-4 h-4" />
              <span>
                 {currentTeam.status === 'FINALIZED' ? 'Squad Locked' : `Finalize ${currentTeam.name} (${shortlistedIds.length}/${currentTeam.targetSquadSize})`}
              </span>
            </button>
          </div>
        }
      />

      {/* STEP 1: DESTINATION TEAM SELECTION BANNER */}
      <div className="jdca-card p-4.5 bg-gradient-to-r from-slate-900 to-slate-800 text-white rounded-2xl shadow-lg border border-slate-700">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-[#E1FF01] text-slate-950">
              <Trophy className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] uppercase tracking-wider font-extrabold text-[#E1FF01]">
                CURRENT SELECTION TARGET
              </span>
              <h2 className="text-lg font-black text-white flex items-center gap-2">
                {currentTeam.name}
              </h2>
              <p className="text-xs text-slate-300">
                Season {currentTeam.season} • Category: {currentTeam.ageCategory} • Gender: {currentTeam.gender}
              </p>
            </div>
          </div>

          {/* Team Switcher Dropdown */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-400 whitespace-nowrap">Target Team:</span>
            <select
              value={currentTeam.id}
              onChange={(e) => {
                const team = representativeTeams.find(t => t.id === e.target.value);
                if (team) setActiveSelectionTeam(team);
              }}
              className="bg-slate-800 border border-slate-600 rounded-xl px-3 py-2 text-xs font-bold text-white outline-none focus:border-[#E1FF01] cursor-pointer"
            >
              {representativeTeams.map((team) => {
                const isAuthorized = (team.ageRankLevel || 1) <= (selectorPermissions?.maxAgeRankLevel || 6);
                return (
                  <option 
                    key={team.id} 
                    value={team.id}
                    disabled={!isAuthorized}
                  >
                    {team.name} {!isAuthorized ? '(Restricted)' : ''}
                  </option>
                );
              })}
            </select>
          </div>
        </div>
      </div>

      {/* Squad Overview & Composition Indicators */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <StatCard
          label="Eligible Players"
          value={filteredPlayers.length}
          subtext={`Authorized for ${currentTeam.ageCategory}`}
          icon={Users}
        />
        <StatCard
          label="Selected in Squad"
          value={`${shortlistedIds.length} / ${currentTeam.targetSquadSize}`}
          subtext="Target squad size"
          tone={shortlistedIds.length >= currentTeam.targetSquadSize - 2 ? 'success' : 'primary'}
          icon={CheckCircle2}
        />
        <StatCard
          label="Districts Included"
          value={new Set(selectedSquad.map(p => p.district)).size}
          subtext="Across Jabalpur Division"
          tone="warning"
          icon={MapPin}
        />
        <StatCard
          label="Squad Wicketkeepers"
          value={squadComposition.wicketKeepers}
          subtext="Minimum 1 recommended"
          tone={squadComposition.wicketKeepers > 0 ? 'info' : 'danger'}
          icon={Sparkles}
        />
      </div>

      {/* Factual Squad Warnings if any */}
      {squadWarnings.length > 0 && (
        <div className="space-y-2">
          {squadWarnings.map((warn, idx) => (
            <div key={idx} className="flex items-center gap-2.5 p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs font-bold">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
              <span>{warn}</span>
            </div>
          ))}
        </div>
      )}

      {/* Selected Team Strip */}
      {shortlistedIds.length > 0 && (
        <div className="jdca-card p-4 bg-emerald-50/90 border-emerald-200 rounded-2xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="inline-block w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <h3 className="text-sm font-black text-slate-900">
                  {currentTeam.name} — Current Squad ({shortlistedIds.length})
                </h3>
              </div>
              <div className="flex flex-wrap items-center gap-3 mt-1 text-xs text-slate-600 font-medium">
                <span>Batters: <strong className="text-slate-900">{squadComposition.batsmen}</strong></span>
                <span>•</span>
                <span>Bowlers: <strong className="text-slate-900">{squadComposition.bowlers}</strong></span>
                <span>•</span>
                <span>All-Rounders: <strong className="text-slate-900">{squadComposition.allRounders}</strong></span>
                <span>•</span>
                <span>Wicket-Keepers: <strong className="text-slate-900">{squadComposition.wicketKeepers}</strong></span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleSaveSquad}
              disabled={currentTeam.status === 'FINALIZED'}
              className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-emerald-700 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{currentTeam.status === 'FINALIZED' ? 'LOCKED' : 'Confirm & Lock Squad'}</span>
            </button>
          </div>

          <div className="flex items-center gap-3 overflow-x-auto pb-1 no-scrollbar">
            <AnimatePresence mode="popLayout">
              {selectedSquad.map((player) => (
                <motion.div
                  key={player.id}
                  layout
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.5 }}
                  onClick={() => handlePlayerClick(player)}
                  className="group relative flex flex-col items-center min-w-[76px] cursor-pointer rounded-xl p-2 bg-white border border-emerald-200 shadow-2xs hover:shadow-xs transition"
                >
                  <img
                    src={player.avatar || `https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80`}
                    alt={player.name}
                    className="w-11 h-11 rounded-full object-cover border-2 border-emerald-500 shadow-2xs"
                  />
                  <span className="text-xs font-bold text-slate-900 truncate w-16 text-center mt-1">
                    {player.name ? player.name.split(' ')[0] : 'Player'}
                  </span>
                  <span className="text-[9px] font-semibold text-slate-500 truncate max-w-[64px]">
                    {player.district}
                  </span>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      )}

      {/* Filter Toolbar */}
      <div className="jdca-card p-4 space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-2.5">
          {/* Search */}
          <div className="relative sm:col-span-6">
            <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              placeholder={`Search ${currentTeam.ageCategory} players by name or district...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs bg-gray-50/70 border border-gray-200 rounded-xl outline-none focus:bg-white focus:border-cobalt font-medium text-gray-900"
            />
          </div>

          {/* District Filter */}
          <div className="sm:col-span-3">
            <select
              value={selectedDistrict}
              onChange={(e) => setSelectedDistrict(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-gray-50/70 border border-gray-200 rounded-xl outline-none focus:bg-white focus:border-cobalt font-semibold text-gray-700 cursor-pointer"
            >
              {JDCA_DISTRICTS.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>

          {/* Role Filter */}
          <div className="sm:col-span-3">
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-gray-50/70 border border-gray-200 rounded-xl outline-none focus:bg-white focus:border-cobalt font-semibold text-gray-700 cursor-pointer"
            >
              {ROLE_FILTERS.map((r) => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Candidate Players Grid */}
      <div>
        {filteredPlayers.length === 0 ? (
          <div className="jdca-card p-12 text-center space-y-2">
            <ShieldAlert className="w-8 h-8 text-gray-300 mx-auto" />
            <h4 className="text-sm font-bold text-gray-700">No players found for {currentTeam.name}</h4>
            <p className="text-xs text-gray-400">
              Try adjusting your district or role filter to view authorized players.
            </p>
          </div>
        ) : (
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
            variants={listVariants}
            initial="hidden"
            animate="visible"
          >
            {filteredPlayers.map((player) => {
              const isShortlisted = shortlistedIds.includes(player.id);

              return (
                <motion.div
                  variants={itemVariants}
                  whileHover={{ scale: 1.01, y: -2 }}
                  key={player.id}
                  className={`jdca-card p-4 flex flex-col justify-between transition-all duration-200 ${
                    isShortlisted
                      ? 'border-emerald-400 ring-2 ring-emerald-500/20 bg-emerald-50/30'
                      : 'hover:border-cobalt-200 bg-white'
                  }`}
                >
                  {/* Top Info */}
                  <div>
                    <div className="flex items-start justify-between gap-3">
                      <div 
                        onClick={() => handlePlayerClick(player)}
                        className="flex items-center gap-3 cursor-pointer group flex-1 min-w-0"
                      >
                        <div className="relative shrink-0">
                          <img
                            src={player.avatar || `https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80`}
                            alt={player.name}
                            className="w-12 h-12 rounded-xl object-cover border border-gray-200"
                          />
                          {player.isPro && (
                            <span className="absolute -bottom-1 -right-1 px-1 py-0.2 rounded bg-mango-400 text-ink font-black text-[9px]">
                              PRO
                            </span>
                          )}
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-1.5">
                            <h4 className="font-bold text-sm text-slate-900 truncate group-hover:text-cobalt transition">
                              {player.name}
                            </h4>
                            {player.inForm && (
                              <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" title="In Form" />
                            )}
                          </div>
                          <p className="text-xs text-slate-500 truncate mt-0.5">
                            {player.primaryRole || player.role || 'Player'} • {player.district || 'Jabalpur'}
                          </p>
                          <div className="flex items-center gap-1.5 text-[11px] text-slate-400 mt-1">
                            <Badge variant="neutral" size="xs">{player.category || currentTeam.ageCategory}</Badge>
                            <span>{player.battingStyle || 'RHB'}</span>
                          </div>
                        </div>
                      </div>

                      <Badge variant={isShortlisted ? 'success' : 'neutral'} size="xs">
                        {isShortlisted ? 'Selected' : 'Candidate'}
                      </Badge>
                    </div>

                    {/* Factual Performance Stats derived from match data */}
                    <div 
                      onClick={() => handlePlayerClick(player)}
                      className="grid grid-cols-4 gap-2 my-3 p-2.5 rounded-xl bg-slate-50 border border-slate-100 cursor-pointer text-center"
                    >
                      <div>
                        <span className="text-[10px] uppercase font-bold text-slate-400 block">RUNS</span>
                        <span className="text-xs font-black text-slate-900">{player.careerRuns || player.runs || 0}</span>
                      </div>

                      <div>
                        <span className="text-[10px] uppercase font-bold text-slate-400 block">AVG</span>
                        <span className="text-xs font-black text-cobalt">{player.battingAvg || player.average || 0}</span>
                      </div>

                      <div>
                        <span className="text-[10px] uppercase font-bold text-slate-400 block">SR</span>
                        <span className="text-xs font-black text-slate-900">{player.strikeRate || 0}</span>
                      </div>

                      <div>
                        <span className="text-[10px] uppercase font-bold text-slate-400 block">50/100</span>
                        <span className="text-xs font-black text-slate-900">{player.fifties || 0}/{player.hundreds || 0}</span>
                      </div>
                    </div>
                  </div>

                  {/* Bottom Action Bar */}
                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
                    <button
                      type="button"
                      onClick={() => handleOpenComparison(player)}
                      className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-bold text-slate-600 hover:bg-slate-100 transition cursor-pointer"
                      title="Compare with another player"
                    >
                      <Sliders className="w-3.5 h-3.5 text-cobalt" />
                      <span>Compare</span>
                    </button>

                    <button
                      type="button"
                      disabled={currentTeam.status === 'FINALIZED'}
                      onClick={() => toggleShortlist(player.id)}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${
                        isShortlisted
                          ? 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-xs'
                          : 'bg-slate-900 text-white hover:bg-cobalt shadow-xs'
                      }`}
                    >
                      {isShortlisted ? (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>In {currentTeam.shortName || currentTeam.ageCategory} Squad</span>
                        </>
                      ) : (
                        <span>+ Select for {currentTeam.name.replace('2026', '').trim()}</span>
                      )}
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </div>
    </div>
  );
}

