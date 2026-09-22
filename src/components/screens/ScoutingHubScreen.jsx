import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  Check, 
  ChevronRight, 
  Star, 
  UserPlus, 
  MapPin, 
  TrendingUp,
  Sparkles,
  SlidersHorizontal
} from 'lucide-react';
import { useCricket } from '../../context/CricketContext';

export default function ScoutingHubScreen() {
  const { 
    players, 
    shortlistedIds = [], 
    toggleShortlist, 
    setSelectedPlayer, 
    navigateTo 
  } = useCricket();

  const [selectedAgeCategory, setSelectedAgeCategory] = useState('Under-13');
  const [selectedRoleFilter, setSelectedRoleFilter] = useState('Top Batsmen');
  const [selectedDistrict, setSelectedDistrict] = useState('All Districts');
  const [searchQuery, setSearchQuery] = useState('');
  const [showOnlyShortlisted, setShowOnlyShortlisted] = useState(false);

  const ageCategories = ['Under-13', 'Under-16', 'Under-19', 'Senior/Open'];
  const roleFilters = ['Top Batsmen', 'Top Bowlers', 'All-Rounders'];
  const districts = ['All Districts', 'Jabalpur', 'Katni', 'Narsinghpur', 'Seoni', 'Mandla', 'Balaghat', 'Chhindwara', 'Dindori', 'Pandhurna'];

  // Filter players logic
  const filteredPlayers = players.filter((player) => {
    const matchesCategory = 
      selectedAgeCategory === 'Senior/Open' 
        ? true 
        : player.category === selectedAgeCategory;

    const matchesRole = 
      selectedRoleFilter === 'Top Batsmen' ? (player.role || '').includes('Batter') :
      selectedRoleFilter === 'Top Bowlers' ? (player.role || '').includes('Bowler') :
      (player.role || '').includes('All-Rounder');

    const matchesDistrict = 
      selectedDistrict === 'All Districts' 
        ? true 
        : player.district === selectedDistrict;

    const matchesSearch = (player.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (player.battingStyle || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (player.district || '').toLowerCase().includes(searchQuery.toLowerCase());

    const matchesShortlist = showOnlyShortlisted ? shortlistedIds.includes(player.id) : true;

    return matchesCategory && matchesRole && matchesDistrict && matchesSearch && matchesShortlist;
  });

  const handlePlayerClick = (player) => {
    setSelectedPlayer(player);
    navigateTo('player-profile');
  };

  return (
    <div className="min-h-[calc(100vh-120px)] bg-slate-100/60 pb-24 px-3.5 pt-3 max-w-xl mx-auto space-y-3.5 animate-in fade-in duration-200">
      
      {/* 1. Header Banner & Register Player Link */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-4 sm:p-5">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight font-display">
                Selection Hub
              </h2>
              <span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 text-xs font-extrabold uppercase">
                Season 2024
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Scout top district talent, review form metrics & manage trial shortlists.
            </p>
          </div>

          <button
            onClick={() => navigateTo('player-registration')}
            className="flex items-center space-x-1.5 px-3 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-xl text-xs font-bold transition-all cursor-pointer"
          >
            <UserPlus className="w-4 h-4" />
            <span className="hidden sm:inline">Add Player</span>
          </button>
        </div>
      </div>

      {/* 2. Age Category Pills Bar (Matches Image 11 & 13) */}
      <div className="flex items-center space-x-2 overflow-x-auto no-scrollbar py-1">
        {ageCategories.map((cat) => {
          const isActive = selectedAgeCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => setSelectedAgeCategory(cat)}
              className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                isActive
                  ? 'bg-[#0B57D0] text-white shadow-sm'
                  : 'bg-white text-slate-700 border border-slate-200/80 hover:bg-slate-50'
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* 3. Role Selector Filter Tabs */}
      <div className="bg-white p-1 rounded-2xl border border-slate-200/80 flex items-center shadow-2xs">
        {roleFilters.map((role) => {
          const isActive = selectedRoleFilter === role;
          return (
            <button
              key={role}
              onClick={() => setSelectedRoleFilter(role)}
              className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                isActive
                  ? 'bg-blue-50 text-[#0B57D0] font-extrabold shadow-2xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              {role}
            </button>
          );
        })}
      </div>

      {/* 4. Search and District Filter Controls */}
      <div className="flex items-center space-x-2">
        {/* Search Bar */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Search players by name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2.5 text-xs bg-white rounded-xl border border-slate-200/90 shadow-2xs outline-none focus:ring-2 focus:ring-blue-500 font-medium"
          />
        </div>

        {/* District Selector */}
        <div className="w-36">
          <select
            value={selectedDistrict}
            onChange={(e) => setSelectedDistrict(e.target.value)}
            className="w-full px-2.5 py-2.5 text-xs bg-white rounded-xl border border-slate-200/90 shadow-2xs text-slate-700 font-semibold outline-none cursor-pointer"
          >
            {districts.map((d) => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
        </div>
      </div>

      {/* 4.5. Shortlisted Filter Toggle */}
      <div className="flex items-center justify-between bg-white px-4 py-2.5 rounded-xl border border-slate-200/90 shadow-2xs">
        <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
          <Star className={`w-4 h-4 ${showOnlyShortlisted ? 'text-amber-500 fill-amber-500' : 'text-slate-400'}`} />
          Show Shortlisted Trials Only ({shortlistedIds.length})
        </span>
        <button
          type="button"
          onClick={() => setShowOnlyShortlisted(!showOnlyShortlisted)}
          className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors cursor-pointer ${
            showOnlyShortlisted ? 'bg-amber-500' : 'bg-slate-300'
          }`}
        >
          <span
            className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${
              showOnlyShortlisted ? 'translate-x-4' : 'translate-x-1'
            }`}
          />
        </button>
      </div>

      {/* 5. Player Cards List (Matches Image 11 & 13) */}
      <div className="space-y-3">
        {filteredPlayers.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center space-y-2">
            <p className="text-sm font-bold text-slate-700">No players match the current filters</p>
            <p className="text-xs text-slate-400">Try selecting "All Districts" or clearing your search.</p>
            <button
              onClick={() => {
                setSelectedDistrict('All Districts');
                setSelectedRoleFilter('Top Batsmen');
                setSearchQuery('');
                setShowOnlyShortlisted(false);
              }}
              className="mt-2 px-4 py-2 bg-blue-50 text-blue-700 text-xs font-bold rounded-xl"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          filteredPlayers.map((player) => {
            const isShortlisted = shortlistedIds.includes(player.id);

            return (
              <div
                key={player.id}
                className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden transition-all hover:shadow-md"
              >
                <div className="p-4 sm:p-5 space-y-3">
                  
                  {/* Top Row: Avatar, Name, District & Details */}
                  <div 
                    onClick={() => handlePlayerClick(player)}
                    className="flex items-center justify-between cursor-pointer group"
                  >
                    <div className="flex items-center space-x-3.5">
                      <div className="relative">
                        <img
                          src={player.avatar}
                          alt={player.name}
                          className="w-13 h-13 rounded-2xl object-cover border border-slate-200 shadow-2xs"
                        />
                        {player.isPro && (
                          <span className="absolute -bottom-1 -right-1 px-1.5 py-0.2 rounded bg-amber-400 text-slate-950 font-black text-[9px]">
                            PRO
                          </span>
                        )}
                      </div>

                      <div>
                        <div className="flex items-center space-x-1.5">
                          <h3 className="font-extrabold text-base text-slate-900 group-hover:text-blue-700 transition-colors">
                            {player.name}
                          </h3>
                          {player.inForm && (
                            <span className="w-2 h-2 rounded-full bg-emerald-500" title="In Form" />
                          )}
                        </div>
                        <p className="text-xs text-slate-500 font-medium">
                          {player.primaryRole || player.role} � {player.battingStyle}
                        </p>
                        <div className="flex items-center space-x-1 text-xs text-slate-400 mt-0.5">
                          <MapPin className="w-3 h-3 text-slate-400" />
                          <span>{player.district}</span>
                        </div>
                      </div>
                    </div>

                    <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-blue-600 transition-colors" />
                  </div>

                  {/* Stats Metric Strip */}
                  <div 
                    onClick={() => handlePlayerClick(player)}
                    className="grid grid-cols-4 gap-2 p-2.5 rounded-xl bg-slate-50 border border-slate-100 cursor-pointer"
                  >
                    <div>
                      <span className="text-xs uppercase font-bold text-slate-400 block">
                        RUNS
                      </span>
                      <span className="text-sm font-extrabold text-slate-900">
                        {player.careerRuns}
                      </span>
                    </div>

                    <div>
                      <span className="text-xs uppercase font-bold text-slate-400 block">
                        AVG
                      </span>
                      <span className="text-sm font-extrabold text-blue-700">
                        {player.battingAvg}
                      </span>
                    </div>

                    <div>
                      <span className="text-xs uppercase font-bold text-slate-400 block">
                        SR
                      </span>
                      <span className="text-sm font-extrabold text-slate-900">
                        {player.strikeRate}
                      </span>
                    </div>

                    <div>
                      <span className="text-xs uppercase font-bold text-slate-400 block">
                        HS
                      </span>
                      <span className="text-sm font-extrabold text-slate-900">
                        {player.highScore}
                      </span>
                    </div>
                  </div>

                  {/* Bottom Row: Shortlist for Trial Switch (Matches Image 11) */}
                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-700">
                      Shortlist for Trial
                    </span>

                    {/* Interactive Toggle Switch */}
                    <button
                      type="button"
                      onClick={() => toggleShortlist(player.id)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer ${
                        isShortlisted ? 'bg-emerald-600' : 'bg-slate-300'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          isShortlisted ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>

                </div>
              </div>
            );
          })
        )}
      </div>

    </div>
  );
}
