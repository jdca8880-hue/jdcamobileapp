import React, { useState, useEffect } from 'react';
import { api } from '../../lib/api';
import { AlertTriangle, Check, Search, Calendar, ChevronRight, CheckSquare, Square, Loader2, ArrowRightCircle, Trash2 } from 'lucide-react';
import { useCricket } from '../../context/CricketContext';

export default function SeasonMigrationTab({ userRole }) {
  const { teams } = useCricket();
  const [fromSeason, setFromSeason] = useState('2024-01-01');
  const [toSeason, setToSeason] = useState('2025-01-01');
  const [cutoffDate, setCutoffDate] = useState('2025-09-01');
  
  const [ageCategories, setAgeCategories] = useState([]);
  const [players, setPlayers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedIds, setSelectedIds] = useState(new Set());
  
  const [isMigrating, setIsMigrating] = useState(false);
  const [migrationResult, setMigrationResult] = useState(null);

  useEffect(() => {
    api.getAgeCategories().then(data => {
      setAgeCategories(data || []);
    }).catch(err => console.error("Failed to load age categories:", err));
  }, []);

  const loadPlayers = async () => {
    if (!fromSeason) return;
    setIsLoading(true);
    setMigrationResult(null);
    try {
      const data = await api.getPlayersBySeason(fromSeason);
      const activePlayers = data.filter(p => p.is_active);
      
      const projectedPlayers = activePlayers.map(p => {
        const projected = calculateProjectedAgeCategory(p.dob, cutoffDate, ageCategories);
        return {
          ...p,
          projected_age_category_id: projected?.id,
          projected_age_category_name: projected?.short_name || 'Senior / Out of Bounds',
          isEligible: !!projected?.id
        };
      });
      
      setPlayers(projectedPlayers);
      
      const eligibleIds = new Set(projectedPlayers.filter(p => p.isEligible).map(p => p.player_id));
      setSelectedIds(eligibleIds);
    } catch (error) {
      console.error("Error loading players:", error);
      alert("Failed to load players for the selected season.");
    } finally {
      setIsLoading(false);
    }
  };

  const calculateProjectedAgeCategory = (dobString, cutoffString, categories) => {
    if (!dobString || !cutoffString || !categories.length) return null;
    
    const dob = new Date(dobString);
    const cutoff = new Date(cutoffString);
    
    let ageMonths = (cutoff.getFullYear() - dob.getFullYear()) * 12;
    ageMonths -= dob.getMonth();
    ageMonths += cutoff.getMonth();
    
    if (cutoff.getDate() < dob.getDate()) {
      ageMonths--;
    }
    
    for (const cat of categories) {
      if (cat.max_age_months === null || cat.max_age_months === undefined) {
        return cat;
      }
      if (ageMonths <= cat.max_age_months) {
        return cat;
      }
    }
    
    return null;
  };

  const toggleSelectAll = () => {
    if (selectedIds.size === players.filter(p => p.isEligible).length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(players.filter(p => p.isEligible).map(p => p.player_id)));
    }
  };

  const togglePlayer = (playerId) => {
    const newSelected = new Set(selectedIds);
    if (newSelected.has(playerId)) {
      newSelected.delete(playerId);
    } else {
      newSelected.add(playerId);
    }
    setSelectedIds(newSelected);
  };

  const handleMigrate = async () => {
    if (selectedIds.size === 0) {
      alert("Please select at least one player to migrate.");
      return;
    }
    
    const isSuperAdmin = userRole === 'SUPER_ADMIN' || userRole === 'SuperAdmin' || userRole === 'Super Admin';
    if (!isSuperAdmin) {
      alert("Only Super Admins can perform bulk season migrations.");
      return;
    }

    if (!window.confirm(`Are you sure you want to migrate ${selectedIds.size} players to the ${toSeason} season?`)) {
      return;
    }

    setIsMigrating(true);
    setMigrationResult(null);
    
    try {
      const existingInTarget = await api.getPlayersBySeason(toSeason);
      const existingIds = new Set(existingInTarget.map(p => p.player_id));
      
      const registrations = [];
      let skippedCount = 0;
      
      players.forEach(p => {
        if (selectedIds.has(p.player_id) && p.projected_age_category_id) {
          if (existingIds.has(p.player_id)) {
            skippedCount++;
          } else {
            registrations.push({
              player_id: p.player_id,
              district_id: p.district_id,
              age_category_id: p.projected_age_category_id
            });
          }
        }
      });
      
      if (registrations.length > 0) {
        await api.bulkMigratePlayers(toSeason, registrations);
      }
      
      setMigrationResult({
        success: true,
        message: `Successfully migrated ${registrations.length} players to ${toSeason}. ${skippedCount > 0 ? `(${skippedCount} players were skipped because they are already registered in the new season).` : ''}`
      });
      
      setSelectedIds(new Set());
      
    } catch (error) {
      console.error("Migration failed:", error);
      setMigrationResult({
        success: false,
        message: `Migration failed: ${error.message}`
      });
    } finally {
      setIsMigrating(false);
    }
  };

  const handleMigrateSingle = async (p) => {
    if (!window.confirm(`Are you sure you want to migrate ${p.name} to ${toSeason}?`)) return;
    try {
      await api.bulkMigratePlayers(toSeason, [{
        player_id: p.player_id,
        district_id: p.district_id,
        age_category_id: p.projected_age_category_id
      }]);
      alert(`Migrated ${p.name} successfully.`);
      setPlayers(prev => prev.filter(player => player.player_id !== p.player_id));
    } catch (e) {
      alert("Failed to migrate player: " + e.message);
    }
  };

  const handleRemoveSingle = (p) => {
    if (!window.confirm(`Are you sure you want to remove ${p.name} from this list?`)) return;
    setPlayers(prev => prev.filter(player => player.player_id !== p.player_id));
    const newSelected = new Set(selectedIds);
    newSelected.delete(p.player_id);
    setSelectedIds(newSelected);
  };

  const getPlayerTeam = (playerId) => {
    if (!teams || teams.length === 0) return 'Unassigned';
    const team = teams.find(t => t.squad && t.squad.some(member => member.id === playerId));
    return team ? team.name : 'Unassigned';
  };

  return (
    <div className="space-y-5">
      <div className="jdca-card p-5 border-l-4 border-l-blue-500">
        <h3 className="font-bold text-slate-900 text-base mb-1">Player Season Migration</h3>
        <p className="text-sm text-slate-600 mb-5">
          Bulk-migrate active players from a previous season into a new season. 
          The system will automatically calculate their projected age category based on their Date of Birth and the new season's cutoff date. 
          Unselected players will not be modified or deleted, they simply won't have an active registration for the new season.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end bg-slate-50 p-4 rounded-xl border border-slate-200">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase">From Season</label>
            <input 
              type="date" 
              value={fromSeason}
              onChange={e => setFromSeason(e.target.value)}
              className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500" 
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase">To Season</label>
            <input 
              type="date" 
              value={toSeason}
              onChange={e => setToSeason(e.target.value)}
              className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500" 
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase">New Cutoff Date</label>
            <input 
              type="date" 
              value={cutoffDate}
              onChange={e => setCutoffDate(e.target.value)}
              className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500" 
            />
          </div>
          <div>
            <button 
              onClick={loadPlayers}
              disabled={isLoading}
              className="w-full bg-slate-900 text-white font-bold text-sm px-4 py-2 rounded-lg hover:bg-slate-800 transition disabled:opacity-70 flex items-center justify-center gap-2"
            >
              {isLoading ? <Loader2 size={16} className="animate-spin" /> : <Search size={16} />}
              {isLoading ? 'Loading...' : 'Load Players'}
            </button>
          </div>
        </div>
      </div>

      {migrationResult && (
        <div className={`p-4 rounded-xl flex items-start gap-3 ${migrationResult.success ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-rose-50 text-rose-800 border border-rose-200'}`}>
          {migrationResult.success ? <Check size={20} className="mt-0.5 shrink-0" /> : <AlertTriangle size={20} className="mt-0.5 shrink-0" />}
          <div>
            <h4 className="font-bold text-sm">{migrationResult.success ? 'Migration Successful' : 'Migration Failed'}</h4>
            <p className="text-sm mt-0.5">{migrationResult.message}</p>
          </div>
        </div>
      )}

      {players.length > 0 && (
        <div className="jdca-card overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-white">
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Migration Preview</h3>
              <p className="text-xs text-slate-500">
                {selectedIds.size} of {players.length} players selected for migration to {toSeason}.
              </p>
            </div>
            <button 
              onClick={handleMigrate}
              disabled={isMigrating || selectedIds.size === 0}
              className="bg-blue-600 text-white font-bold text-sm px-5 py-2 rounded-lg shadow hover:bg-blue-700 transition disabled:opacity-50 flex items-center gap-2"
            >
              {isMigrating && <Loader2 size={16} className="animate-spin" />}
              {isMigrating ? 'Migrating...' : 'Execute Bulk Migration'}
            </button>
          </div>

          <div className="overflow-x-auto max-h-[500px] overflow-y-auto">
            <table className="jdca-table sticky-header">
              <thead className="sticky top-0 bg-white shadow-sm z-10">
                <tr>
                  <th className="w-12 text-center">
                    <button onClick={toggleSelectAll} className="text-slate-400 hover:text-blue-600 transition">
                      {selectedIds.size === players.filter(p=>p.isEligible).length && players.length > 0 ? (
                        <CheckSquare size={18} className="text-blue-600" />
                      ) : (
                        <Square size={18} />
                      )}
                    </button>
                  </th>
                  <th>Player Details</th>
                  <th>DOB</th>
                  <th>{fromSeason} Category</th>
                  <th className="w-8"></th>
                  <th>Projected {toSeason} Category</th>
                  <th>Team</th>
                  <th className="text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {players.map((p) => (
                  <tr key={p.player_id} className={`hover:bg-slate-50 ${selectedIds.has(p.player_id) ? 'bg-blue-50/30' : ''}`}>
                    <td className="text-center">
                      <button 
                        onClick={() => p.isEligible && togglePlayer(p.player_id)} 
                        disabled={!p.isEligible}
                        className={`transition ${!p.isEligible ? 'opacity-30 cursor-not-allowed' : 'hover:text-blue-600'}`}
                      >
                        {selectedIds.has(p.player_id) ? <CheckSquare size={18} className="text-blue-600" /> : <Square size={18} className="text-slate-300" />}
                      </button>
                    </td>
                    <td>
                      <div className="font-bold text-slate-900 text-sm">{p.name}</div>
                      <div className="text-xs text-slate-500">{p.district_name || 'N/A'} • {p.gender}</div>
                    </td>
                    <td className="text-sm font-medium text-slate-700">
                      {new Date(p.dob).toLocaleDateString()}
                    </td>
                    <td>
                      <span className="badge bg-slate-100 text-slate-700 border-slate-200">
                        {p.current_age_category_name || 'N/A'}
                      </span>
                    </td>
                    <td className="text-center text-slate-300">
                      <ChevronRight size={16} />
                    </td>
                    <td>
                      {p.isEligible ? (
                        <span className={`badge ${p.current_age_category_id !== p.projected_age_category_id ? 'bg-amber-100 text-amber-800 border-amber-200' : 'bg-emerald-100 text-emerald-800 border-emerald-200'}`}>
                          {p.projected_age_category_name}
                        </span>
                      ) : (
                        <span className="badge bg-red-100 text-red-800 border-red-200">
                          {p.projected_age_category_name}
                        </span>
                      )}
                      
                      {p.current_age_category_id !== p.projected_age_category_id && p.isEligible && (
                        <div className="text-[10px] text-amber-600 font-bold mt-1 uppercase tracking-wider">
                          Age Group Changed
                        </div>
                      )}
                    </td>
                    <td className="text-sm font-medium text-slate-700">
                      {getPlayerTeam(p.player_id)}
                    </td>
                    <td className="text-right">
                      <div className="flex justify-end gap-2">
                        <button 
                          onClick={() => handleMigrateSingle(p)}
                          disabled={!p.isEligible}
                          className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition disabled:opacity-30 disabled:cursor-not-allowed"
                          title="Migrate Player"
                        >
                          <ArrowRightCircle size={18} />
                        </button>
                        <button 
                          onClick={() => handleRemoveSingle(p)}
                          className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition"
                          title="Remove from list"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
