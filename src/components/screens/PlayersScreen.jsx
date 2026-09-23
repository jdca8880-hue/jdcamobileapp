import React, { useState, useMemo } from 'react';
import CloudinaryAvatar from '../ui/CloudinaryAvatar';
import { Search, ChevronRight, UserPlus, Filter, User } from 'lucide-react';
import { useCricket } from '../../context/CricketContext';

const JDCA_DISTRICTS = ['All', 'Jabalpur', 'Katni', 'Narsinghpur', 'Seoni', 'Mandla', 'Balaghat', 'Chhindwara', 'Dindori', 'Pandhurna'];
const CATEGORIES = ['All', 'Senior', 'U-22', 'U-19', 'U-16', 'U-15', 'U-13'];

const ROLE_BRIGHT_BADGES = {
  Batter: 'bg-amber-500 text-white shadow-xs',
  Batsman: 'bg-amber-500 text-white shadow-xs',
  Bowler: 'bg-purple-600 text-white shadow-xs',
  'All-Rounder': 'bg-emerald-600 text-white shadow-xs',
  'All-rounder': 'bg-emerald-600 text-white shadow-xs',
  'Wicket-Keeper': 'bg-cyan-600 text-white shadow-xs',
  'Wicketkeeper': 'bg-cyan-600 text-white shadow-xs',
};

const PlayerListItem = ({ player, onClick }) => {
  const playerRole = player.primary_role || player.role;
  const roleBadge = ROLE_BRIGHT_BADGES[playerRole] || 'bg-blue-600 text-white';

  return (
    <div 
      onClick={onClick}
      className="flex items-center justify-between p-3.5 sm:p-4 bg-white hover:bg-blue-50/40 border-b border-slate-100 cursor-pointer active:bg-blue-50 transition-all group relative overflow-hidden"
    >
      <div className="flex items-center gap-3.5 min-w-0">
        <div className="relative shrink-0">
          <CloudinaryAvatar
            src={player.avatar_url || player.avatar}
            alt={player.full_name || player.name}
            className="w-11 h-11 sm:w-12 sm:h-12 rounded-full object-cover border-2 border-white shadow-md ring-2 ring-blue-500/20"
          />
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition truncate">
              {player.full_name || player.name}
            </span>
            <span className={`px-2 py-0.5 rounded-full text-xs font-black uppercase tracking-wider ${roleBadge}`}>
              {playerRole || 'Batter'}
            </span>
          </div>
          <div className="text-xs text-slate-500 mt-1 truncate flex items-center gap-1.5">
            <span className="font-semibold text-slate-700">{player.district || 'Jabalpur'}</span>
            {player.category && (
              <>
                <span className="text-slate-300">•</span>
                <span className="text-slate-600 font-bold">{player.category}</span>
              </>
            )}
          </div>
        </div>
      </div>
      <div className="flex items-center gap-4 shrink-0">
        <div className="text-right hidden sm:block">
          <div className="text-sm font-black text-blue-700 tabular-nums">{player.careerRuns || player.runs || 0}</div>
          <div className="text-xs font-bold text-slate-400">Career Runs</div>
        </div>
        <ChevronRight size={16} className="text-slate-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
      </div>
    </div>
  );
};

export default function PlayersScreen() {
  const { players, setSelectedPlayer, navigateTo } = useCricket();

  const [genderTab, setGenderTab] = useState('Men');
  const [searchQuery, setSearchQuery] = useState('');
  const [districtFilter, setDistrictFilter] = useState('All');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [showFilters, setShowFilters] = useState(false);

  const filteredPlayers = players.filter(p => {
    const isWomen = String(p.category || '').toLowerCase().includes('women');
    if (genderTab === 'Men' && isWomen) return false;
    if (genderTab === 'Women' && !isWomen) return false;

    if (searchQuery) {
      const pName = p.full_name || p.name || '';
      const matchSearch = pName.toLowerCase().includes(searchQuery.toLowerCase());
      if (!matchSearch) return false;
    }

    if (districtFilter !== 'All' && p.district !== districtFilter) return false;
    
    if (categoryFilter !== 'All') {
      const cat = String(p.category || 'Senior').toLowerCase();
      const f = categoryFilter.toLowerCase().replace('-', '');
      if (!cat.includes(f)) return false;
    }

    return true;
  });

  const handlePlayerClick = (player) => {
    setSelectedPlayer(player);
    navigateTo('player-profile');
  };

  return (
    <div className="pb-20 bg-[#f8fafc] min-h-screen">
      <div className="bg-white sticky top-0 z-30 border-b border-slate-200 shadow-2xs">
        <div className="max-w-5xl mx-auto px-4 py-3 sm:py-4 space-y-2.5 sm:space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs text-slate-500 font-medium">Player Directory</div>
              <h1 className="text-lg sm:text-2xl font-bold text-slate-900 tracking-tight">Registered Players</h1>
            </div>
            <button 
              onClick={() => navigateTo('player-registration')}
              className="px-3 py-1.5 rounded-lg bg-blue-600 text-white text-xs font-semibold flex items-center gap-1.5 hover:bg-blue-700 transition cursor-pointer shadow-2xs"
            >
              <UserPlus size={14} />
              <span>Add Player</span>
            </button>
          </div>

          <div className="flex bg-slate-100 p-1 rounded-xl w-full sm:w-64">
            <button
              onClick={() => setGenderTab('Men')}
              className={`flex-1 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                genderTab === 'Men' ? 'bg-white text-slate-900 shadow-2xs font-semibold' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Men
            </button>
            <button
              onClick={() => setGenderTab('Women')}
              className={`flex-1 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                genderTab === 'Women' ? 'bg-white text-slate-900 shadow-2xs font-semibold' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Women
            </button>
          </div>

          <div className="flex flex-col sm:flex-row gap-2">
            <div className="relative flex-1">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search players by name, club or role..." 
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full bg-slate-50 rounded-xl py-2 pl-9 pr-4 text-xs font-medium text-slate-800 outline-none border border-slate-200 focus:border-blue-600 focus:bg-white transition"
              />
            </div>

            {/* Mobile Filter Toggle Button */}
            <div className="sm:hidden flex items-center justify-between">
              <button
                type="button"
                onClick={() => setShowFilters(!showFilters)}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold border transition cursor-pointer ${
                  showFilters || districtFilter !== 'All' || categoryFilter !== 'All'
                    ? 'bg-blue-50 text-blue-700 border-blue-200'
                    : 'bg-white text-slate-700 border-slate-200 shadow-2xs'
                }`}
              >
                <Filter size={13} />
                <span>{showFilters ? 'Hide Filters' : 'District & Category Filters'}</span>
                {(districtFilter !== 'All' || categoryFilter !== 'All') && (
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />
                )}
              </button>

              <span className="text-xs font-semibold text-slate-500">
                {filteredPlayers.length} players
              </span>
            </div>

            {/* Filter Dropdowns: Collapsible on Mobile, Flex on Desktop */}
            <div className={`${showFilters ? 'grid grid-cols-2' : 'hidden'} sm:flex flex-col sm:flex-row gap-2 animate-in fade-in duration-150`}>
              <select 
                value={districtFilter}
                onChange={e => setDistrictFilter(e.target.value)}
                className="bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium text-slate-700 outline-none hover:border-slate-300 transition w-full sm:w-auto cursor-pointer"
              >
                {JDCA_DISTRICTS.map(d => <option key={d} value={d}>{d === 'All' ? 'All Districts' : d}</option>)}
              </select>
              <select 
                value={categoryFilter}
                onChange={e => setCategoryFilter(e.target.value)}
                className="bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-medium text-slate-700 outline-none hover:border-slate-300 transition w-full sm:w-auto cursor-pointer"
              >
                {CATEGORIES.map(c => <option key={c} value={c}>{c === 'All' ? 'All Categories' : c}</option>)}
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 pt-5">
        <div className="flex items-center justify-between mb-3 px-1">
          <span className="text-xs font-medium text-slate-500">
            {filteredPlayers.length} {filteredPlayers.length === 1 ? 'Player' : 'Players'} Found
          </span>
        </div>
        
        <div className="bg-white rounded-xl shadow-2xs border border-slate-200 overflow-hidden flex flex-col divide-y divide-slate-100">
          {filteredPlayers.map(p => (
            <PlayerListItem key={p.id} player={p} onClick={() => handlePlayerClick(p)} />
          ))}

          {filteredPlayers.length === 0 && (
            <div className="text-center py-16 px-4">
              <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Filter size={20} className="text-slate-400" />
              </div>
              <h3 className="text-sm font-semibold text-slate-900 mb-1">No players match the criteria</h3>
              <p className="text-xs text-slate-500">Try adjusting your filters or search keywords.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
