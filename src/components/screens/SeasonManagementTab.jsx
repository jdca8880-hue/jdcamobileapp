import React, { useState, useEffect } from 'react';
import { api } from '../../lib/api';
import { 
  Calendar, 
  Plus, 
  CheckCircle2, 
  Loader2, 
  ShieldCheck, 
  Info, 
  Clock, 
  Trophy,
  Users,
  Check
} from 'lucide-react';

export default function SeasonManagementTab({ userRole }) {
  const [seasons, setSeasons] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  
  // New Season Form
  const [newSeason, setNewSeason] = useState({
    name: '',
    start_date: '',
    end_date: '',
    is_current_active: false
  });

  const loadSeasons = async () => {
    setIsLoading(true);
    try {
      const data = await api.getSeasons();
      setSeasons(data || []);
    } catch (err) {
      console.error('Failed to load seasons', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadSeasons();
  }, []);

  const handleCreateSeason = async (e) => {
    e.preventDefault();
    if (!newSeason.name || !newSeason.start_date || !newSeason.end_date) {
      alert('Please fill out all required fields.');
      return;
    }
    if (new Date(newSeason.end_date) < new Date(newSeason.start_date)) {
      alert('End date must be on or after the start date.');
      return;
    }

    setIsSubmitting(true);
    try {
      await api.createSeason(newSeason);
      setShowCreateModal(false);
      setNewSeason({ name: '', start_date: '', end_date: '', is_current_active: false });
      await loadSeasons();
      alert('Season created successfully.');
    } catch (err) {
      console.error(err);
      alert('Failed to create season: ' + (err.message || 'Unknown error'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSetActive = async (season) => {
    if (season.is_current_active) return;
    const confirm = window.confirm(`Set "${season.name}" as the active operating season? All new registrations, matches, and selection processes will default to this season.`);
    if (!confirm) return;

    try {
      await api.setActiveSeason(season.id);
      await loadSeasons();
    } catch (err) {
      console.error(err);
      alert('Failed to set active season: ' + err.message);
    }
  };

  const activeSeason = seasons.find(s => s.is_current_active);

  return (
    <div className="space-y-6">
      {/* Information Banner */}
      <div className="bg-gradient-to-r from-blue-900 to-indigo-950 p-5 rounded-2xl text-white shadow-md border border-blue-800">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-blue-500/20 rounded-xl text-blue-300 shrink-0">
            <ShieldCheck size={28} />
          </div>
          <div className="space-y-1">
            <h3 className="font-bold text-base text-white">JDCA Season Context Architecture</h3>
            <p className="text-xs text-blue-200 leading-relaxed">
              Seasons represent operational timeframes for tournament fixtures, player registrations, and selection processes.
              <strong> Player identities and historical match performances are permanent</strong> and are never reset, deleted, or isolated when switching or creating seasons.
            </p>
          </div>
        </div>
      </div>

      {/* Top Bar with Active Season & Create Button */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <span className="text-[11px] font-black uppercase tracking-wider text-slate-400">Current Operating Season</span>
          <div className="flex items-center gap-3 mt-1">
            <span className="text-2xl font-black text-slate-900">
              {activeSeason ? activeSeason.name : 'No Active Season Set'}
            </span>
            {activeSeason && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                <CheckCircle2 size={13} /> Active Default
              </span>
            )}
          </div>
          {activeSeason && (
            <p className="text-xs text-slate-500 mt-1">
              {new Date(activeSeason.start_date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })} — {new Date(activeSeason.end_date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
            </p>
          )}
        </div>

        {userRole === 'SUPER_ADMIN' && (
          <button
            onClick={() => setShowCreateModal(true)}
            className="btn-primary text-xs flex items-center gap-2 py-2.5 px-4 shadow-sm"
          >
            <Plus size={16} />
            <span>Create New Season</span>
          </button>
        )}
      </div>

      {/* Seasons List */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar className="text-blue-600" size={18} />
            <h4 className="font-bold text-sm text-slate-900">Registered JDCA Seasons</h4>
          </div>
          <span className="text-xs font-bold text-slate-500">{seasons.length} configured</span>
        </div>

        {isLoading ? (
          <div className="p-12 text-center text-slate-400">
            <Loader2 className="animate-spin mx-auto mb-2" size={24} />
            <p className="text-sm">Loading seasons...</p>
          </div>
        ) : seasons.length === 0 ? (
          <div className="p-12 text-center text-slate-400">
            <Calendar className="mx-auto mb-2 text-slate-300" size={32} />
            <p className="text-sm font-semibold text-slate-600">No seasons registered yet.</p>
            <p className="text-xs text-slate-400 mt-1">Click "Create New Season" above to define your first season.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {seasons.map((season) => (
              <div 
                key={season.id} 
                className={`p-4.5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors ${
                  season.is_current_active ? 'bg-blue-50/40' : 'hover:bg-slate-50'
                }`}
              >
                <div className="flex items-start sm:items-center gap-3.5">
                  <div className={`p-2.5 rounded-xl shrink-0 ${
                    season.is_current_active 
                      ? 'bg-blue-600 text-white shadow-sm' 
                      : 'bg-slate-100 text-slate-600'
                  }`}>
                    <Calendar size={20} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-black text-slate-900 text-base">{season.name}</span>
                      {season.is_current_active && (
                        <span className="text-[10px] uppercase font-black px-2 py-0.5 rounded-md bg-blue-600 text-white">
                          Current
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                      <Clock size={12} />
                      <span>
                        {new Date(season.start_date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })} to {new Date(season.end_date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {season.is_current_active ? (
                    <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200 flex items-center gap-1.5">
                      <Check size={14} strokeWidth={3} /> Active Operating Season
                    </span>
                  ) : (
                    userRole === 'SUPER_ADMIN' && (
                      <button
                        onClick={() => handleSetActive(season)}
                        className="text-xs font-bold text-slate-700 hover:text-blue-700 bg-white hover:bg-blue-50 border border-slate-300 hover:border-blue-300 px-3 py-1.5 rounded-lg transition"
                      >
                        Set as Active
                      </button>
                    )
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Create Season Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Calendar className="text-blue-600" size={20} />
                <h3 className="font-bold text-slate-900 text-base">Create New Season</h3>
              </div>
              <button 
                onClick={() => setShowCreateModal(false)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateSeason} className="space-y-4 pt-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Season Name *
                </label>
                <input
                  type="text"
                  placeholder="e.g. 2026-27 or 2027-28"
                  value={newSeason.name}
                  onChange={(e) => setNewSeason({ ...newSeason, name: e.target.value })}
                  className="w-full border border-slate-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
                  required
                />
                <span className="text-[11px] text-slate-400 mt-1 block">Standard format: YYYY-YY (e.g. 2026-27)</span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Start Date *
                  </label>
                  <input
                    type="date"
                    value={newSeason.start_date}
                    onChange={(e) => setNewSeason({ ...newSeason, start_date: e.target.value })}
                    className="w-full border border-slate-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    End Date *
                  </label>
                  <input
                    type="date"
                    value={newSeason.end_date}
                    onChange={(e) => setNewSeason({ ...newSeason, end_date: e.target.value })}
                    className="w-full border border-slate-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
                    required
                  />
                </div>
              </div>

              <div className="pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={newSeason.is_current_active}
                    onChange={(e) => setNewSeason({ ...newSeason, is_current_active: e.target.checked })}
                    className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-xs font-bold text-slate-700">Set as Active Operating Season</span>
                </label>
                <p className="text-[11px] text-slate-500 ml-6 mt-0.5">
                  Makes this the default season for upcoming tournaments, match fixtures, and squad trials.
                </p>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-primary text-sm flex items-center gap-2 px-5 py-2"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      <span>Creating...</span>
                    </>
                  ) : (
                    <span>Create Season</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
