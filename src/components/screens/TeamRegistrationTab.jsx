import React, { useState, useEffect } from 'react';
import { useCricket } from '../../context/CricketContext';
import { Users, Shield, Plus, X, Search, CheckCircle2 } from 'lucide-react';
import { api } from '../../lib/api';
import { supabase } from '../../lib/supabase';

const JDCA_DISTRICTS = [
  'Jabalpur', 'Katni', 'Narsinghpur', 'Seoni', 'Mandla', 
  'Balaghat', 'Chhindwara', 'Dindori', 'Pandhurna'
];

export default function TeamRegistrationTab({ userRole }) {
  const { players = [], teams = [], setTeams } = useCricket();
  
  const [districtTeams, setDistrictTeams] = useState([]);
  const [isCreating, setIsCreating] = useState(false);
  
  const [newTeamName, setNewTeamName] = useState('');
  const [newTeamDistrict, setNewTeamDistrict] = useState(JDCA_DISTRICTS[0]);
  const [newTeamCategory, setNewTeamCategory] = useState('Senior');
  const [newTeamGender, setNewTeamGender] = useState('Men');
  
  const [activeTeamId, setActiveTeamId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [teamPlayers, setTeamPlayers] = useState([]);
  
  const [ageCategories, setAgeCategories] = useState([]);
  const [dbDistricts, setDbDistricts] = useState([]);

  useEffect(() => {
    const fetchDropdowns = async () => {
      const [{ data: ac }, { data: dist }] = await Promise.all([
        supabase.from('age_categories').select('*').eq('is_active', true),
        supabase.from('districts').select('*').eq('is_active', true)
      ]);
      if (ac && ac.length > 0) {
        setAgeCategories(ac);
        // Find a default that matches the initial gender ('Men')
        const defaultAc = ac.find(a => {
          const n = a.name.toLowerCase();
          return n.includes('men') || n.includes('boy') || (!n.includes('women') && !n.includes('girl'));
        });
        if(defaultAc) setNewTeamCategory(defaultAc.id);
        else setNewTeamCategory(ac[0].id);
      }
      if (dist && dist.length > 0) {
        setDbDistricts(dist);
        setNewTeamDistrict(dist[0].id);
      } else {
        // Fallback to manual if DB fails
        const mockDistricts = JDCA_DISTRICTS.map((d, i) => ({ id: `mock-${i}`, name: d }));
        setDbDistricts(mockDistricts);
        setNewTeamDistrict(mockDistricts[0].id);
      }
    };
    fetchDropdowns();
  }, []);

  useEffect(() => {
    // Filter out only DISTRICT_TEAM
    const dTeams = teams.filter(t => t.team_type === 'DISTRICT_TEAM');
    setDistrictTeams(dTeams);
  }, [teams]);

  useEffect(() => {
    if (activeTeamId) {
      loadTeamPlayers(activeTeamId);
    }
  }, [activeTeamId]);

  const loadTeamPlayers = async (teamId) => {
    try {
      const { data, error } = await supabase
        .from('team_players')
        .select('player_id')
        .eq('team_id', teamId);
      if (error) throw error;
      setTeamPlayers(data.map(tp => tp.player_id));
    } catch (e) {
      console.error(e);
    }
  };

  const handleCreateTeam = async (e) => {
    e.preventDefault();
    if (!newTeamName) return;
    
    try {
      const defaults = await api.getDefaults();
      
      const { data: teamData, error: teamError } = await supabase
        .from('teams')
        .insert([{
          name: newTeamName,
          short_name: newTeamName.substring(0, 3).toUpperCase(),
          season: new Date().getFullYear().toString(),
          district_id: newTeamDistrict.startsWith('mock-') ? defaults.district_id : newTeamDistrict,
          age_category_id: newTeamCategory,
          gender: newTeamGender,
          is_active: true,
          team_type: 'DISTRICT_TEAM'
        }])
        .select('*, district:district_id(*), age_category:age_category_id(*)')
        .single();
        
      if (teamError) throw teamError;
      
      // Also create a selection process so it shows up in Team Selection!
      const { data: processData, error: processError } = await supabase
        .from('selection_processes')
        .insert([{
          name: newTeamName + ' Selection',
          season_id: 1, // Default to first season or similar
          age_category_id: newTeamCategory,
          gender: newTeamGender,
          target_squad_size: 15,
          status: 'UPCOMING',
          process_type: 'DISTRICT_TEAM',
          target_district_id: newTeamDistrict.startsWith('mock-') ? defaults.district_id : newTeamDistrict
        }])
        .select()
        .single();
        
      if (!processError && processData) {
        // Assign the current admin to this process so they can see it
        const { data: userData } = await supabase.auth.getUser();
        if (userData?.user?.id) {
          await supabase.from('selector_assignments').insert([{
            selection_process_id: processData.id,
            selector_id: userData.user.id,
            is_lead_selector: true
          }]);
        }
      }
      
      setTeams(prev => [teamData, ...prev]);
      setIsCreating(false);
      setNewTeamName('');
    } catch (err) {
      console.error(err);
      alert('Failed to create team: ' + err.message);
    }
  };

  const handleTogglePlayer = async (playerId) => {
    if (!activeTeamId) return;
    
    const isAssigned = teamPlayers.includes(playerId);
    try {
      if (isAssigned) {
        await supabase
          .from('team_players')
          .delete()
          .eq('team_id', activeTeamId)
          .eq('player_id', playerId);
        setTeamPlayers(prev => prev.filter(id => id !== playerId));
      } else {
        await supabase
          .from('team_players')
          .insert([{ team_id: activeTeamId, player_id: playerId }]);
        setTeamPlayers(prev => [...prev, playerId]);
      }
    } catch (err) {
      console.error(err);
      alert('Failed to update player assignment');
    }
  };

  const activeTeam = districtTeams.find(t => t.id === activeTeamId);

  const filteredPlayers = players.filter(p => {
    // Only filter by gender if both the team and player have gender set
    if (activeTeam?.gender && p.gender && p.gender !== activeTeam.gender) return false;
    if (searchQuery) {
      const pName = p.name || p.full_name || '';
      return pName.toLowerCase().includes(searchQuery.toLowerCase()) || 
             (p.district || '').toLowerCase().includes(searchQuery.toLowerCase());
    }
    return true;
  });

  const filteredAgeCategories = ageCategories.filter(ac => {
    const n = ac.name.toLowerCase();
    if (newTeamGender === 'Women') {
      return n.includes('women') || n.includes('girl') || (!n.includes('men') && !n.includes('boy'));
    } else {
      return n.includes('men') || n.includes('boy') || (!n.includes('women') && !n.includes('girl'));
    }
  });

  return (
    <div className="space-y-6 animate-in fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-bold text-slate-900">District Team Management</h3>
          <p className="text-xs text-slate-500">Create local teams and manually assign players to grant them district tags.</p>
        </div>
        <button 
          onClick={() => setIsCreating(true)}
          className="btn-primary text-xs flex items-center gap-1.5"
        >
          <Plus size={14} /> New District Team
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Left Side: Teams List */}
        <div className="md:col-span-4 space-y-4">
          <div className="jdca-card p-4 h-[600px] overflow-y-auto">
            <h4 className="font-bold text-sm text-slate-800 mb-3 flex items-center gap-2">
              <Shield size={16} className="text-cobalt" />
              Registered District Teams
            </h4>
            
            {districtTeams.length === 0 ? (
              <div className="text-center p-6 text-slate-400">
                <p className="text-xs">No district teams created yet.</p>
              </div>
            ) : (
              <div className="space-y-2">
                {districtTeams.map(team => (
                  <div 
                    key={team.id}
                    onClick={() => setActiveTeamId(team.id)}
                    className={`p-3 rounded-xl border cursor-pointer transition ${activeTeamId === team.id ? 'border-cobalt bg-blue-50/50' : 'border-slate-200 hover:border-slate-300 bg-white'}`}
                  >
                    <div className="font-bold text-sm text-slate-900">{team.name}</div>
                    <div className="text-xs text-slate-500 flex justify-between mt-1">
                      <span>{team.age_category?.name || 'Category'} • {team.gender}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Player Assignment */}
        <div className="md:col-span-8">
          <div className="jdca-card p-5 h-[600px] flex flex-col">
            {!activeTeam ? (
              <div className="flex-1 flex flex-col items-center justify-center text-slate-400">
                <Users size={48} className="mb-3 opacity-50" />
                <p>Select a team to manage its players</p>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-4">
                  <div>
                    <h4 className="font-bold text-base text-slate-900">{activeTeam.name}</h4>
                    <p className="text-xs text-slate-500">Currently assigned: {teamPlayers.length} players</p>
                  </div>
                  <div className="relative w-64">
                    <Search className="absolute left-3 top-2.5 text-slate-400" size={14} />
                    <input 
                      type="text" 
                      placeholder="Search players..."
                      value={searchQuery}
                      onChange={e => setSearchQuery(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-cobalt"
                    />
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto pr-2 space-y-2">
                  {filteredPlayers.map(player => {
                    const isAssigned = teamPlayers.includes(player.id);
                    return (
                      <div 
                        key={player.id}
                        className="flex items-center justify-between p-3 bg-white border border-slate-100 rounded-xl hover:bg-slate-50 transition"
                      >
                        <div className="flex items-center gap-3">
                          <img 
                            src={player.avatar || player.avatar_url || ''} 
                            alt={player.name || player.full_name}
                            className="w-10 h-10 rounded-full bg-slate-200 object-cover"
                          />
                          <div>
                            <div className="font-bold text-sm text-slate-900">{player.name || player.full_name || 'Unknown Player'}</div>
                            <div className="text-xs text-slate-500">{player.district || 'Unknown District'} • {player.primary_role || player.primaryRole || 'Player'}</div>
                          </div>
                        </div>
                        <button
                          onClick={() => handleTogglePlayer(player.id)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${isAssigned ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                        >
                          {isAssigned ? <><CheckCircle2 size={14} /> Assigned</> : <><Plus size={14} /> Assign</>}
                        </button>
                      </div>
                    );
                  })}
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* CREATE MODAL */}
      {isCreating && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-800/80">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-900 text-base">Register District Team</h3>
              <button onClick={() => setIsCreating(false)} className="text-slate-400 hover:text-slate-600">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateTeam} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Team Name</label>
                <input
                  type="text"
                  required
                  value={newTeamName}
                  onChange={(e) => setNewTeamName(e.target.value)}
                  className="w-full border border-slate-300 rounded-lg p-2 text-sm focus:outline-none focus:border-blue-500"
                  placeholder="e.g. Star Cricket Club Jabalpur"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">District Focus</label>
                <select
                  value={newTeamDistrict}
                  onChange={(e) => setNewTeamDistrict(e.target.value)}
                  className="w-full border border-slate-300 rounded-lg p-2 text-sm focus:outline-none focus:border-blue-500"
                >
                  {dbDistricts.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Gender</label>
                  <select
                    value={newTeamGender}
                    onChange={(e) => setNewTeamGender(e.target.value)}
                    className="w-full border border-slate-300 rounded-lg p-2 text-sm focus:outline-none focus:border-blue-500"
                  >
                    <option value="Men">Men's Cricket</option>
                    <option value="Women">Women's Cricket</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Age Category</label>
                  <select
                    value={newTeamCategory}
                    onChange={(e) => setNewTeamCategory(e.target.value)}
                    className="w-full border border-slate-300 rounded-lg p-2 text-sm focus:outline-none focus:border-blue-500"
                  >
                    {filteredAgeCategories.map(ac => <option key={ac.id} value={ac.id}>{ac.name}</option>)}
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 mt-6">
                <button type="button" onClick={() => setIsCreating(false)} className="px-4 py-2 text-sm font-semibold text-slate-600">
                  Cancel
                </button>
                <button type="submit" className="btn-primary text-sm">
                  Register Team
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
