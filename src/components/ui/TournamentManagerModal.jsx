import React, { useState, useContext } from 'react';
import { X, Calendar, Trophy, Plus, Trash2, ArrowRight, Loader2 } from 'lucide-react';
import { api } from '../../lib/api';
import { useCricket } from '../../context/CricketContext';

export default function TournamentManagerModal({ isOpen, onClose, initialData = null, teams = [], refreshAdminData, onSave }) {
  const { registeredUsers = [] } = useCricket();
  const [step, setStep] = useState(1); // 1: Tournament Details, 2: Configure Matches
  const [isSaving, setIsSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [formData, setFormData] = useState(
    initialData || {
      name: '',
      shortName: '',
      season_id: '',
      format: 'T20',
      startDate: '',
      endDate: '',
      status: 'UPCOMING',
      participatingTeams: [],
      venues: [],
      customMatches: []
    }
  );

  const [seasons, setSeasons] = useState([]);

  React.useEffect(() => {
    const fetchSeasons = async () => {
      try {
        const data = await api.getSeasons();
        setSeasons(data || []);
        if (!initialData?.season_id && data?.length > 0) {
          const active = data.find(s => s.is_current_active);
          setFormData(prev => ({ ...prev, season_id: active ? active.id : data[0].id }));
        }
      } catch (err) {
        console.error('Failed to fetch seasons:', err);
      }
    };
    if (isOpen) {
      fetchSeasons();
    }
  }, [isOpen, initialData]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleNextStep = (e) => {
    e.preventDefault();
    setStep(2);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setIsSaving(true);
    
    try {
      if (onSave) {
        await onSave(formData);
      } else {
        let savedTournament;
        if (initialData?.id) {
          savedTournament = await api.updateTournament(initialData.id, formData);
        } else {
          savedTournament = await api.createTournament(formData);
        }

        if (formData.customMatches && formData.customMatches.length > 0) {
          await api.createDetailedMatches(savedTournament.id, formData.format, formData.customMatches);
        }

        if (refreshAdminData) {
          await refreshAdminData();
        }
        
        onClose();
      }
    } catch (err) {
      console.error(err);
      setErrorMsg(err.message || 'Failed to save tournament');
    } finally {
      setIsSaving(false);
    }
  };

  const addMatchRow = () => {
    setFormData(prev => ({
      ...prev,
      customMatches: [
        ...prev.customMatches,
        {
          id: Date.now().toString(),
          homeTeamId: '',
          awayTeamId: '',
          date: '',
          venueId: null,
          umpireName: '',
          scorerName: '',
          ballType: 'WHITE'
        }
      ]
    }));
  };

  const removeMatchRow = (id) => {
    setFormData(prev => ({
      ...prev,
      customMatches: prev.customMatches.filter(m => m.id !== id)
    }));
  };

  const updateMatchRow = (id, field, value) => {
    setFormData(prev => ({
      ...prev,
      customMatches: prev.customMatches.map(m => 
        m.id === id ? { ...m, [field]: value } : m
      )
    }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl w-full max-w-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-slate-50 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600">
              <Trophy size={20} />
            </div>
            <div>
              <h2 className="text-[18px] font-black text-slate-900 leading-tight">
                {initialData ? 'Edit Tournament' : 'Create Tournament'}
              </h2>
              <p className="text-[12px] font-medium text-slate-500">
                {step === 1 ? 'Step 1: Tournament Details' : 'Step 2: Configure Initial Matches'}
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-slate-200 text-slate-400 transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto flex-1 custom-scrollbar bg-white">
          {errorMsg && (
            <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm border border-red-100">
              {errorMsg}
            </div>
          )}
          {step === 1 ? (
            <form id="tournament-form" onSubmit={handleNextStep} className="space-y-5">
              <div className="space-y-1.5">
                <label className="text-[12px] font-bold text-slate-700 uppercase tracking-wider">Tournament Name</label>
                <input 
                  type="text" 
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g. JDCA District Cup"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-[14px] font-medium text-slate-900 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[12px] font-bold text-slate-700 uppercase tracking-wider">Season</label>
                  <select 
                    name="season_id"
                    value={formData.season_id}
                    onChange={handleChange}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-[14px] font-medium text-slate-900 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                  >
                    {seasons.map(season => (
                      <option key={season.id} value={season.id}>
                        {season.name} {season.is_current_active ? '(Active)' : ''}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[12px] font-bold text-slate-700 uppercase tracking-wider">Format</label>
                  <select 
                    name="format"
                    value={formData.format}
                    onChange={handleChange}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-[14px] font-medium text-slate-900 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                  >
                    <option value="T20">T20</option>
                    <option value="One Day">One Day (50 Overs)</option>
                    <option value="Multi-Day">Multi-Day (Test)</option>
                    <option value="T10">T10</option>
                  </select>
                </div>
                
                <div className="space-y-1.5">
                  <label className="text-[12px] font-bold text-slate-700 uppercase tracking-wider">Category</label>
                  <select 
                    name="gender"
                    value={formData.gender || 'Men'}
                    onChange={handleChange}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-[14px] font-medium text-slate-900 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                  >
                    <option value="Men">Men's Tournament</option>
                    <option value="Women">Women's Tournament</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[12px] font-bold text-slate-700 uppercase tracking-wider">Start Date</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Calendar size={16} className="text-slate-400" />
                    </div>
                    <input 
                      type="date" 
                      name="startDate"
                      value={formData.startDate}
                      onChange={handleChange}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-3 text-[14px] font-medium text-slate-900 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[12px] font-bold text-slate-700 uppercase tracking-wider">End Date</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Calendar size={16} className="text-slate-400" />
                    </div>
                    <input 
                      type="date" 
                      name="endDate"
                      value={formData.endDate}
                      onChange={handleChange}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-3 text-[14px] font-medium text-slate-900 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[12px] font-bold text-slate-700 uppercase tracking-wider">Status</label>
                <select 
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-[14px] font-medium text-slate-900 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                >
                  <option value="UPCOMING">Upcoming</option>
                  <option value="ONGOING">Ongoing</option>
                  <option value="COMPLETED">Completed</option>
                  <option value="CANCELLED">Cancelled</option>
                </select>
              </div>
            </form>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-800">Custom Matches</h3>
                <button 
                  type="button" 
                  onClick={addMatchRow}
                  className="inline-flex items-center gap-1.5 bg-blue-50 text-blue-700 px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-blue-100 transition"
                >
                  <Plus size={14} /> Add Match
                </button>
              </div>
              
              {formData.customMatches.length === 0 ? (
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 text-center text-sm text-slate-500">
                  No matches configured yet. You can add specific matches now, or use "Auto Generate" later.
                </div>
              ) : (
                <div className="space-y-3">
                  {formData.customMatches.map((match, index) => (
                    <div key={match.id} className="bg-slate-50 border border-slate-200 p-4 rounded-xl relative group">
                      <button 
                        onClick={() => removeMatchRow(match.id)}
                        className="absolute -top-2 -right-2 bg-rose-100 text-rose-600 p-1.5 rounded-full shadow-sm hover:bg-rose-200 opacity-0 group-hover:opacity-100 transition"
                      >
                        <Trash2 size={14} />
                      </button>
                      
                      <div className="flex flex-col gap-3">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-slate-400">Match {index + 1}</span>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-3">
                          <select 
                            value={match.homeTeamId} 
                            onChange={(e) => updateMatchRow(match.id, 'homeTeamId', e.target.value)}
                            className="bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs font-medium text-slate-900"
                            required
                          >
                            <option value="">Select Team 1</option>
                            {teams.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                          </select>
                          
                          <select 
                            value={match.awayTeamId} 
                            onChange={(e) => updateMatchRow(match.id, 'awayTeamId', e.target.value)}
                            className="bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs font-medium text-slate-900"
                            required
                          >
                            <option value="">Select Team 2</option>
                            {teams.filter(t => t.id !== match.homeTeamId).map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                          </select>
                        </div>

                        <div className="grid grid-cols-3 gap-3">
                          <input 
                            type="datetime-local" 
                            value={match.date}
                            onChange={(e) => updateMatchRow(match.id, 'date', e.target.value)}
                            className="bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs font-medium text-slate-900"
                            required
                          />
                          <input
                            type="text"
                            placeholder="Venue"
                            value={match.venueName}
                            onChange={(e) => updateMatchRow(match.id, 'venueName', e.target.value)}
                            className="bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs font-medium text-slate-900"
                          />
                          <select 
                            value={match.ballType} 
                            onChange={(e) => updateMatchRow(match.id, 'ballType', e.target.value)}
                            className="bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs font-medium text-slate-900"
                          >
                            <option value="WHITE">White Ball</option>
                            <option value="RED">Red Ball</option>
                          </select>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-3">
                          <input 
                            type="text" 
                            placeholder="Umpire Name"
                            value={match.umpireName}
                            onChange={(e) => updateMatchRow(match.id, 'umpireName', e.target.value)}
                            className="bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs font-medium text-slate-900"
                          />
                          <select 
                            value={match.scorerName}
                            onChange={(e) => updateMatchRow(match.id, 'scorerName', e.target.value)}
                            className="bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs font-medium text-slate-900"
                          >
                            <option value="">Select Scorer</option>
                            {registeredUsers
                              .filter(u => ['SCORER', 'SUPER_ADMIN', 'DISTRICT_ADMIN'].includes(u.role?.toUpperCase()))
                              .map(u => (
                                <option key={u.id} value={u.name}>{u.name}</option>
                              ))}
                          </select>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-100 bg-gray-50 flex justify-between shrink-0">
          {step === 2 ? (
            <button 
              type="button"
              onClick={() => setStep(1)}
              className="px-5 py-2.5 rounded-xl text-[14px] font-bold text-slate-600 hover:bg-slate-200 transition-colors cursor-pointer"
            >
              Back
            </button>
          ) : (
            <button 
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl text-[14px] font-bold text-slate-600 hover:bg-slate-200 transition-colors cursor-pointer"
            >
              Cancel
            </button>
          )}

          {step === 1 ? (
            <button 
              type="button"
              onClick={(e) => {
                if (!formData.name) {
                  alert('Tournament Name is required');
                  return;
                }
                setStep(2);
              }}
              className="px-6 py-2.5 rounded-xl text-[14px] font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-sm hover:shadow transition-all flex items-center gap-2 cursor-pointer"
            >
              Next Step <ArrowRight size={16} />
            </button>
          ) : (
            <button 
              onClick={handleSubmit}
              disabled={isSaving}
              className="px-6 py-2.5 rounded-xl text-[14px] font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-sm hover:shadow transition-all cursor-pointer disabled:opacity-50 flex items-center gap-2"
            >
              {isSaving && <Loader2 size={16} className="animate-spin" />}
              {isSaving ? 'Saving...' : 'Save & Finish'}
            </button>
          )}
        </div>

      </div>
    </div>
  );
}
