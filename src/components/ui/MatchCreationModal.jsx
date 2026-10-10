import React, { useState } from 'react';
import { X, Search } from 'lucide-react';
import { api } from '../../lib/api';
import { useCricket } from '../../context/CricketContext';

export default function MatchCreationModal({ isOpen, onClose, tournament, teams, initialData = null }) {
  const { setActiveMatchId, navigateTo, refreshAdminData, registeredUsers = [] } = useCricket();
  
  // Format initial date for the date input
  let formattedDate = '';
  if (initialData?.scheduled_at || initialData?.date) {
    const d = new Date(initialData.scheduled_at || initialData.date);
    if (!isNaN(d.getTime())) {
      formattedDate = d.toISOString().slice(0, 16);
    }
  }

  const [homeTeam, setHomeTeam] = useState(initialData?.home_team_id || initialData?.homeTeamId || '');
  const [awayTeam, setAwayTeam] = useState(initialData?.away_team_id || initialData?.awayTeamId || '');
  const [format, setFormat] = useState(initialData?.match_format || initialData?.format || tournament?.format || 'T20');
  const [customOvers, setCustomOvers] = useState(
    initialData?.max_overs ? String(initialData.max_overs) : ''
  );
  const [scheduledAt, setScheduledAt] = useState(formattedDate);
  const [venueName, setVenueName] = useState(initialData?.venue_name || initialData?.venueName || '');
  const [umpireName, setUmpireName] = useState(initialData?.umpire_name || initialData?.umpireName || '');
  const [scorerName, setScorerName] = useState(initialData?.scorer_name || initialData?.scorerName || '');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // If we get new initialData, we might want to reset state but this is handled by remounting the component
  
  if (!isOpen || !tournament) return null;

  const isEditMode = !!initialData;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!homeTeam || !awayTeam) {
      alert("Please select both Home and Away teams");
      return;
    }
    if (homeTeam === awayTeam) {
      alert("Home and Away teams must be different");
      return;
    }
    if (!scheduledAt) {
      alert("Please select a scheduled date and time");
      return;
    }
    if (!venueName || venueName.trim() === '') {
      alert("Please enter a venue name");
      return;
    }
    const isCustom = format === 'CUSTOM';
    const customOversNum = parseInt(customOvers, 10);
    if (isCustom && (!customOversNum || customOversNum <= 0)) {
      alert("Please enter the number of overs for the custom match");
      return;
    }

    setIsSubmitting(true);
    try {
      if (isEditMode) {
        const updateData = {
          homeTeamId: homeTeam,
          awayTeamId: awayTeam,
          format: format,
          scheduledAt: scheduledAt || null,
          venueName: venueName || null,
          umpireName: umpireName || null,
          scorerName: scorerName || null,
          ...(isCustom ? { max_overs: customOversNum } : {})
        };
        await api.updateMatchDetails(initialData.id, updateData);
        if (refreshAdminData) {
          await refreshAdminData();
        }
        onClose();
      } else {
        const matchesToInsert = [{
          homeTeamId: homeTeam,
          awayTeamId: awayTeam,
          format: format,
          scheduledAt: scheduledAt || null,
          venueName: venueName || null,
          umpireName: umpireName || null,
          scorerName: scorerName || null,
          status: 'SCHEDULED',
          ...(isCustom ? { max_overs: customOversNum } : {})
        }];
        
        const createdMatches = await api.createDetailedMatches(tournament.id, format, matchesToInsert);
        
        if (createdMatches && createdMatches.data && createdMatches.data.length > 0) {
          if (refreshAdminData) {
            await refreshAdminData();
          }
          // Set the newly created match as active and navigate to match setup
          setActiveMatchId(createdMatches.data[0].id);
          onClose();
          navigateTo('/match-setup');
        } else {
          alert("Failed to create match. The database may have rejected it.");
        }
      }
    } catch (err) {
      console.error(err);
      alert("Error saving match: " + (err.originalMessage || err.message || err));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between p-5 border-b border-gray-100 bg-slate-50">
          <div>
            <h2 className="text-lg font-black text-slate-900">Create New Match</h2>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest mt-1">{tournament.name}</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-200 text-slate-500 hover:bg-red-100 hover:text-red-500 transition-colors">
            <X size={18} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-5">
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Home Team</label>
            <select 
              value={homeTeam} 
              onChange={(e) => setHomeTeam(e.target.value)}
              className="w-full bg-slate-50 border-2 border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-900 focus:border-blue-500 focus:outline-none"
              required
            >
              <option value="">Select Home Team</option>
              {teams.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Away Team</label>
            <select 
              value={awayTeam} 
              onChange={(e) => setAwayTeam(e.target.value)}
              className="w-full bg-slate-50 border-2 border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-900 focus:border-blue-500 focus:outline-none"
              required
            >
              <option value="">Select Away Team</option>
              {teams.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
            </select>
          </div>

          <div className="flex flex-col sm:flex-row sm:space-x-4 space-y-4 sm:space-y-0">
            <div className="w-full sm:w-1/2">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Format</label>
              <select 
                value={format} 
                onChange={(e) => setFormat(e.target.value)}
                className="w-full bg-slate-50 border-2 border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-900 focus:border-blue-500 focus:outline-none"
              >
                <option value="T20">T20</option>
                <option value="ODI">ODI</option>
                <option value="TEST">TEST</option>
                <option value="T10">T10</option>
                <option value="CUSTOM">Custom</option>
              </select>
            </div>

            {format === 'CUSTOM' && (
              <div className="w-full sm:w-1/2">
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Overs per Side</label>
                <input
                  type="number" min="1" max="50"
                  value={customOvers}
                  onChange={(e) => setCustomOvers(e.target.value)}
                  placeholder="e.g. 12"
                  className="w-full bg-slate-50 border-2 border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-900 focus:border-blue-500 focus:outline-none"
                  required
                />
              </div>
            )}

            <div className="w-full sm:w-1/2">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Date & Time (Optional)</label>
              <input 
                type="datetime-local" 
                value={scheduledAt} 
                onChange={(e) => setScheduledAt(e.target.value)}
                className="w-full bg-slate-50 border-2 border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-900 focus:border-blue-500 focus:outline-none"
              />
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row sm:space-x-4 space-y-4 sm:space-y-0">
            <div className="w-full sm:w-1/2">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Venue (Optional)</label>
              <input 
                type="text" 
                value={venueName} 
                onChange={(e) => setVenueName(e.target.value)}
                placeholder="e.g. Holkar Stadium"
                className="w-full bg-slate-50 border-2 border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-900 focus:border-blue-500 focus:outline-none"
              />
            </div>
            
            <div className="w-full sm:w-1/2">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Umpire (Optional)</label>
              <select 
                value={umpireName} 
                onChange={(e) => setUmpireName(e.target.value)}
                className="w-full bg-slate-50 border-2 border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-900 focus:border-blue-500 focus:outline-none"
              >
                <option value="">Select Umpire</option>
                {registeredUsers
                  .filter(u => ['UMPIRE', 'SUPER_ADMIN', 'DISTRICT_ADMIN'].includes(u.role?.toUpperCase()))
                  .map(u => (
                    <option key={u.id} value={u.name}>{u.name}</option>
                  ))}
              </select>
            </div>
          </div>
          
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Scorer (Optional)</label>
            <select 
              value={scorerName} 
              onChange={(e) => setScorerName(e.target.value)}
              className="w-full bg-slate-50 border-2 border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-900 focus:border-blue-500 focus:outline-none"
            >
              <option value="">Select Scorer</option>
              {registeredUsers
                .filter(u => ['SCORER', 'SUPER_ADMIN', 'DISTRICT_ADMIN'].includes(u.role?.toUpperCase()))
                .map(u => (
                  <option key={u.id} value={u.name}>{u.name}</option>
                ))}
            </select>
          </div>
          
          <div className="pt-4">
            <button 
              type="submit" 
              disabled={isSubmitting}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-xl transition-colors flex items-center justify-center shadow-lg shadow-blue-500/30 disabled:opacity-50"
            >
              {isSubmitting ? (isEditMode ? 'Saving...' : 'Creating Match...') : (isEditMode ? 'Save Match Details' : 'Create & Proceed to Setup')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
