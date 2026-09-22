import React, { useState } from 'react';
import { 
  Search, 
  MapPin, 
  ChevronRight, 
  UserPlus
} from 'lucide-react';
import { useCricket } from '../../context/CricketContext';

export default function SelectorsScreen() {
  const { 
    players = [], 
    shortlistedIds = [], 
    toggleShortlist, 
    setSelectedPlayer, 
    navigateTo 
  } = useCricket();

  const categories = ['Under 14', 'Under 26', 'Under 19', 'Under 23'];
  const districts = ['All Districts', 'Jabalpur', 'Katni', 'Narsinghpur', 'Seoni', 'Mandla', 'Balaghat', 'Chhindwara', 'Dindori', 'Pandhurna'];
  
  const [selectedCategory, setSelectedCategory] = useState('Under 14');
  const [selectedDistrict, setSelectedDistrict] = useState('All Districts');
  const [searchQuery, setSearchQuery] = useState('');

  // Filter players by selected category and search query
  const filteredPlayers = players.filter((player) => {
    // Normalizing category strings to handle variations like "Under-14" vs "Under 14"
    const normalizedPlayerCategory = (player.category || '').replace('-', ' ').toLowerCase();
    const normalizedSelectedCategory = selectedCategory.replace('-', ' ').toLowerCase();
    
    const matchesCategory = normalizedPlayerCategory === normalizedSelectedCategory;

    const matchesDistrict = 
      selectedDistrict === 'All Districts' 
        ? true 
        : player.district === selectedDistrict;

    const matchesSearch = (player.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (player.district || '').toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCategory && matchesDistrict && matchesSearch;
  });

  const handlePlayerClick = (player) => {
    setSelectedPlayer(player);
    navigateTo('player-profile');
  };

  return (
    <div className="min-h-[calc(100vh-120px)] bg-slate-100/60 pb-24 px-3.5 pt-3 max-w-xl mx-auto space-y-3.5 animate-in fade-in duration-200">
      
      {/* Header Banner */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs p-4 sm:p-5">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight font-display">
                Selection Panel
              </h2>
            </div>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Dedicated selection panel by age groups.
            </p>
          </div>
        </div>
      </div>

      {/* Selected Students List */}
      {shortlistedIds.length > 0 && (
        <div className="bg-emerald-50 rounded-2xl border border-emerald-100 p-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-800 mb-3">
            Selected Students ({shortlistedIds.length})
          </h3>
          <div className="flex space-x-3 overflow-x-auto pb-2 no-scrollbar">
            {players.filter(p => shortlistedIds.includes(p.id)).map(player => (
              <div 
                key={player.id} 
                onClick={() => handlePlayerClick(player)}
                className="flex flex-col items-center space-y-1.5 min-w-[60px] cursor-pointer"
              >
                <img 
                  src={player.avatar} 
                  alt={player.name} 
                  className="w-12 h-12 rounded-full object-cover border-2 border-emerald-500 shadow-sm"
                />
                <span className="text-xs font-bold text-slate-800 truncate w-14 text-center">
                  {player.name.split(' ')[0]}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Category Tabs */}
      <div className="flex items-center space-x-2 overflow-x-auto no-scrollbar py-1">
        {categories.map((cat) => {
          const isActive = selectedCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
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

      {/* Search and District Filter */}
      <div className="flex items-center space-x-2">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            placeholder={`Search ${selectedCategory} players...`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2.5 text-xs bg-white rounded-xl border border-slate-200/90 shadow-2xs outline-none focus:ring-2 focus:ring-blue-500 font-medium"
          />
        </div>
        
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

      {/* Player Cards List */}
      <div className="space-y-3">
        {filteredPlayers.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center space-y-2">
            <p className="text-sm font-bold text-slate-700">No players found in {selectedCategory}</p>
            <p className="text-xs text-slate-400">Try adjusting your search or register new players.</p>
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
                          {player.primaryRole || player.role} • {player.battingStyle}
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
                        {player.careerRuns || player.runs || 0}
                      </span>
                    </div>

                    <div>
                      <span className="text-xs uppercase font-bold text-slate-400 block">
                        AVG
                      </span>
                      <span className="text-sm font-extrabold text-blue-700">
                        {player.battingAvg || player.average || 0}
                      </span>
                    </div>

                    <div>
                      <span className="text-xs uppercase font-bold text-slate-400 block">
                        SR
                      </span>
                      <span className="text-sm font-extrabold text-slate-900">
                        {player.strikeRate || 0}
                      </span>
                    </div>

                    <div>
                      <span className="text-xs uppercase font-bold text-slate-400 block">
                        HS
                      </span>
                      <span className="text-sm font-extrabold text-slate-900">
                        {player.highScore || '0'}
                      </span>
                    </div>
                  </div>

                  {/* Bottom Row: Shortlist for Trial Switch */}
                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-700">
                      Select for Team
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

