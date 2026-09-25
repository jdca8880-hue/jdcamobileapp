import React, { useState } from 'react';
import { Check, Edit2, Search, ArrowRight, ArrowLeft, Plus, Trash2, X, Settings2, Users, Coins } from 'lucide-react';
import { useCricket } from '../../context/CricketContext';
import { api } from '../../lib/api';

export default function MatchSetupScreen() {
  const { matchSetup, setMatchSetup, navigateTo, goBack, players, activeMatchId, matches = [], registeredUsers = [] } = useCricket();
  
  React.useEffect(() => {
    const activeMatch = matches.find(m => m.id === activeMatchId);
    if (activeMatch) {
      setMatchSetup(prev => ({
        ...prev,
        teamA: activeMatch.home_team?.name || activeMatch.teamA?.name || prev.teamA || 'Team A',
        teamAId: activeMatch.home_team_id || activeMatch.teamA?.id || prev.teamAId,
        teamB: activeMatch.away_team?.name || activeMatch.teamB?.name || prev.teamB || 'Team B',
        teamBId: activeMatch.away_team_id || activeMatch.teamB?.id || prev.teamBId,
        assignedScorerId: activeMatch.scorer_id || prev.assignedScorerId,
      }));
    }
  }, [activeMatchId, matches, setMatchSetup]);
  const [currentStep, setCurrentStep] = useState(1);
  const [activeTeamTab, setActiveTeamTab] = useState('A');
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isEditingXI, setIsEditingXI] = useState(false);
  const [isAddPlayerModalOpen, setIsAddPlayerModalOpen] = useState(false);
  const [rosterSearchQuery, setRosterSearchQuery] = useState('');

  const activeXI = activeTeamTab === 'A' ? matchSetup.teamAXI : matchSetup.teamBXI;
  const targetArrayName = activeTeamTab === 'A' ? 'teamAXI' : 'teamBXI';

  const addPlayerToXI = (player) => {
    if (activeXI.length >= 11) return alert(`Maximum 11 players allowed in ${activeTeamTab === 'A' ? matchSetup.teamA : matchSetup.teamB} XI.`);
    if (activeXI.find(p => p.id === player.id)) return alert("Player already in Playing XI.");
    
    setMatchSetup(prev => ({
      ...prev,
      [targetArrayName]: [...prev[targetArrayName], { ...player, isCaptain: false, role: player.role || 'Batter' }]
    }));
  };

  const removePlayerFromXI = (playerId) => {
    setMatchSetup(prev => ({ ...prev, [targetArrayName]: prev[targetArrayName].filter(p => p.id !== playerId) }));
  };

  const toggleRole = (playerId, roleType) => {
    setMatchSetup(prev => ({
      ...prev,
      [targetArrayName]: prev[targetArrayName].map(p => {
        if (p.id === playerId) {
          if (roleType === 'captain') return { ...p, isCaptain: !p.isCaptain };
          if (roleType === 'wk') return { ...p, role: p.role?.includes('Wicket Keeper') ? 'Batter' : 'Wicket Keeper' };
        } else {
          if (roleType === 'captain') return { ...p, isCaptain: false };
          if (roleType === 'wk' && p.role?.includes('Wicket Keeper')) return { ...p, role: 'Batter' };
        }
        return p;
      })
    }));
  };

  const steps = [
    { num: 1, label: 'Teams', icon: Users },
    { num: 2, label: 'Toss', icon: Coins },
    { num: 3, label: 'Rules', icon: Settings2 },
  ];

  const filteredPlayers = activeXI.filter((p) => (p.full_name || p.name || '').toLowerCase().includes((searchQuery || '').toLowerCase()));
  const availableScorers = registeredUsers.filter(u => u.role === 'SCORER');

  const handleStartMatch = async () => {
    if (matchSetup.teamAXI.length === 0 || matchSetup.teamBXI.length === 0) {
      alert("Both teams must have at least one player in their Playing XI.");
      return;
    }
    
    setIsSaving(true);
    setSaveError('');
    try {
      // Find tossWinnerTeamId
      let tossWinnerTeamId = null;
      if (matchSetup.tossWinner === matchSetup.teamA) tossWinnerTeamId = matchSetup.teamAId;
      else if (matchSetup.tossWinner === matchSetup.teamB) tossWinnerTeamId = matchSetup.teamBId;
      
      const setupPayload = {
        ...matchSetup,
        tossWinnerTeamId
      };
      
      await api.persistMatchSetup(activeMatchId, setupPayload);
      navigateTo('scoring');
    } catch (err) {
      console.error("Failed to persist setup:", err);
      setSaveError(err.message || "Failed to save match setup. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="pb-[120px] bg-slate-50 min-h-screen">
      
      {/* HEADER */}
      <div className="bg-white px-4 pt-[60px] pb-4 border-b border-gray-100 shadow-[0_2px_10px_rgba(0,0,0,0.02)] sticky top-0 z-20">
        <div className="flex items-center justify-between mb-4">
          <button onClick={goBack} className="w-9 h-9 flex items-center justify-center rounded-full bg-gray-50 text-[#101827] active:bg-gray-100 transition-colors">
            <ArrowLeft size={20} strokeWidth={2.5} />
          </button>
          <div className="text-[14px] font-black text-[#101827] uppercase tracking-wider">Setup Match</div>
          <div className="w-9"></div>
        </div>

        {/* PROGRESS TABS */}
        <div className="flex items-center justify-between max-w-sm mx-auto">
          {steps.map((s, idx) => (
            <div key={s.num} className="flex-1 text-center relative">
               <div className={`text-xs font-bold uppercase tracking-wider mb-2 ${s.num === currentStep ? 'text-[#2457D6]' : s.num < currentStep ? 'text-[#0FA968]' : 'text-[#8a99b0]'}`}>
                 {s.label}
               </div>
               <div className="flex items-center justify-center relative z-10">
                 <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white border-2 border-white shadow-sm transition-colors ${
                    s.num === currentStep ? 'bg-[#2457D6]' : s.num < currentStep ? 'bg-[#0FA968]' : 'bg-[#d2d8e2]'
                 }`}>
                   {s.num < currentStep ? <Check size={14} strokeWidth={3} /> : <s.icon size={14} />}
                 </div>
               </div>
               {idx < steps.length - 1 && (
                 <div className="absolute top-[26px] left-[50%] w-full h-[3px] bg-[#eef2fd] -z-0">
                    <div className="h-full bg-[#0FA968] transition-all" style={{ width: s.num < currentStep ? '100%' : '0%' }} />
                 </div>
               )}
            </div>
          ))}
        </div>
      </div>

      <div className="p-4 space-y-6">
        
        {/* STEP 1: TEAMS */}
        {currentStep === 1 && (
          <div className="bg-white rounded-[20px] p-5 shadow-sm border border-gray-100 animate-slide-up">
            <h2 className="text-[12px] font-black uppercase tracking-widest text-[#596579] mb-4">Match Teams</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#8a99b0] uppercase tracking-wider mb-1.5">Team A Name *</label>
                <input 
                  type="text" value={matchSetup.teamA} readOnly
                  className="w-full bg-slate-50 rounded-[12px] p-4 text-[16px] font-black outline-none border border-transparent text-gray-500 cursor-not-allowed"
                />
              </div>
              <div className="text-center font-black text-[12px] text-[#8a99b0] uppercase tracking-widest">VS</div>
              <div>
                <label className="block text-xs font-bold text-[#8a99b0] uppercase tracking-wider mb-1.5">Team B Name *</label>
                <input 
                  type="text" value={matchSetup.teamB} readOnly
                  className="w-full bg-slate-50 rounded-[12px] p-4 text-[16px] font-black outline-none border border-transparent text-gray-500 cursor-not-allowed"
                />
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: TOSS & SQUAD */}
        {currentStep === 2 && (
          <div className="space-y-4 animate-slide-up">
            <div className="bg-white rounded-[20px] p-5 shadow-sm border border-gray-100">
              <h2 className="text-[12px] font-black uppercase tracking-widest text-[#596579] mb-4">Toss Details</h2>
              <label className="block text-xs font-bold text-[#8a99b0] uppercase tracking-wider mb-2">Toss Winner</label>
              <div className="grid grid-cols-2 gap-3 mb-6">
                {[matchSetup.teamA, matchSetup.teamB].map(team => (
                  <button key={team} onClick={() => setMatchSetup(p => ({ ...p, tossWinner: team }))} className={`py-4 rounded-[12px] font-bold text-[14px] border-2 transition-colors ${matchSetup.tossWinner === team ? 'bg-[#2457D6] text-white border-[#2457D6]' : 'bg-transparent text-[#596579] border-gray-200'}`}>
                    {team}
                  </button>
                ))}
              </div>

              <label className="block text-xs font-bold text-[#8a99b0] uppercase tracking-wider mb-2">Elected To</label>
              <div className="grid grid-cols-2 gap-3">
                {['Bat', 'Bowl'].map(decision => (
                  <button key={decision} onClick={() => setMatchSetup(p => ({ ...p, electedTo: decision }))} className={`py-4 rounded-[12px] font-bold text-[14px] border-2 transition-colors ${matchSetup.electedTo === decision ? 'bg-[#ff6100] text-[#101827] border-[#ff6100]' : 'bg-transparent text-[#596579] border-gray-200'}`}>
                    {decision} First
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-[20px] p-5 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-[12px] font-black uppercase tracking-widest text-[#596579]">Playing XIs</h2>
                <button onClick={() => setIsEditingXI(!isEditingXI)} className="text-xs font-bold uppercase tracking-wider text-[#2457D6] flex items-center gap-1">
                  <Edit2 size={12}/> {isEditingXI ? 'DONE' : 'EDIT'}
                </button>
              </div>

              <div className="flex mb-4 bg-slate-100 p-1 rounded-lg">
                <button onClick={() => setActiveTeamTab('A')} className={`flex-1 py-2 text-xs font-bold rounded-md ${activeTeamTab === 'A' ? 'bg-white shadow-sm text-[#101827]' : 'text-[#8a99b0]'}`}>
                  {matchSetup.teamA} ({matchSetup.teamAXI.length})
                </button>
                <button onClick={() => setActiveTeamTab('B')} className={`flex-1 py-2 text-xs font-bold rounded-md ${activeTeamTab === 'B' ? 'bg-white shadow-sm text-[#101827]' : 'text-[#8a99b0]'}`}>
                  {matchSetup.teamB} ({matchSetup.teamBXI.length})
                </button>
              </div>

              <div className="space-y-2">
                {filteredPlayers.map(p => (
                  <div key={p.id} className="flex items-center justify-between bg-slate-50 p-3 rounded-[12px]">
                    <div className="flex-1">
                       <div className="font-bold text-[14px] text-[#101827] flex items-center gap-1.5">
                         {p.full_name || p.name} 
                         {p.isCaptain && <span className="bg-[#2457D6] text-white text-[9px] px-1.5 py-0.5 rounded-sm">C</span>}
                         {p.role?.includes('Wicket Keeper') && <span className="bg-[#ff6100] text-[#101827] text-[9px] px-1.5 py-0.5 rounded-sm">WK</span>}
                       </div>
                       <div className="text-xs font-medium text-[#8a99b0]">{p.role}</div>
                    </div>
                    {isEditingXI && (
                      <div className="flex gap-1.5">
                         <button onClick={() => toggleRole(p.id, 'captain')} className="w-8 h-8 rounded-full bg-white border border-gray-200 text-[#101827] text-xs font-bold shadow-sm">C</button>
                         <button onClick={() => toggleRole(p.id, 'wk')} className="w-8 h-8 rounded-full bg-white border border-gray-200 text-[#101827] text-xs font-bold shadow-sm">WK</button>
                         <button onClick={() => removePlayerFromXI(p.id)} className="w-8 h-8 rounded-full bg-[#fef0ee] text-[#F05A47] flex items-center justify-center"><Trash2 size={14}/></button>
                      </div>
                    )}
                  </div>
                ))}
                
                {isEditingXI && activeXI.length < 11 && (
                  <button onClick={() => setIsAddPlayerModalOpen(true)} className="w-full py-4 border-2 border-dashed border-gray-300 rounded-[12px] flex flex-col items-center justify-center text-[#8a99b0] active:bg-gray-50">
                     <Plus size={20} className="mb-1" />
                     <span className="text-[12px] font-bold uppercase tracking-wider">Add Player</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: RULES */}
        {currentStep === 3 && (
          <div className="bg-white rounded-[20px] p-5 shadow-sm border border-gray-100 animate-slide-up">
             <h2 className="text-[12px] font-black uppercase tracking-widest text-[#596579] mb-4">Match Rules</h2>
             
             {saveError && (
               <div className="mb-4 p-3 bg-red-50 border-l-4 border-red-500 text-red-700 text-xs font-bold rounded">
                 {saveError}
               </div>
             )}
             
             <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-[#8a99b0] uppercase tracking-wider mb-1.5">Total Overs</label>
                  <select value={matchSetup.totalOvers} onChange={e => setMatchSetup(p => ({ ...p, totalOvers: Number(e.target.value) }))} className="w-full bg-slate-50 rounded-[12px] p-3 text-[14px] font-bold outline-none border border-transparent appearance-none">
                    <option value={20}>20 Overs (T20)</option>
                    <option value={40}>40 Overs (One Day)</option>
                    <option value={50}>50 Overs (ODI)</option>
                    <option value={10}>10 Overs (Sprint)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#8a99b0] uppercase tracking-wider mb-1.5">Wide Penalty</label>
                  <select value={matchSetup.widePenalty} onChange={e => setMatchSetup(p => ({ ...p, widePenalty: Number(e.target.value) }))} className="w-full bg-slate-50 rounded-[12px] p-3 text-[14px] font-bold outline-none border border-transparent appearance-none">
                    <option value={1}>1 Run + Re-bowl</option>
                    <option value={2}>2 Runs (No Re-bowl)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#8a99b0] uppercase tracking-wider mb-1.5">Official Scorer</label>
                  <select 
                    value={matchSetup.assignedScorerId || ''} 
                    onChange={e => setMatchSetup(p => ({ ...p, assignedScorerId: e.target.value }))} 
                    className="w-full bg-slate-50 rounded-[12px] p-3 text-[14px] font-bold outline-none border border-transparent appearance-none"
                  >
                    <option value="">Select a scorer...</option>
                    {availableScorers.map(s => (
                      <option key={s.id} value={s.id}>{s.email || s.name}</option>
                    ))}
                  </select>
                </div>

                <div className="pt-4 border-t border-gray-100">
                  <h3 className="text-[12px] font-black uppercase tracking-widest text-[#596579] mb-4">Match Officials (Manually Assigned)</h3>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-[#8a99b0] uppercase tracking-wider mb-1.5">Umpire 1</label>
                      <input 
                        type="text" value={matchSetup.umpires?.umpire1 || ''} onChange={e => setMatchSetup(p => ({ ...p, umpires: { ...p.umpires, umpire1: e.target.value } }))}
                        placeholder="Enter Name"
                        className="w-full bg-slate-50 rounded-[12px] p-3 text-[14px] font-bold outline-none border focus:border-[#2457D6] border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-[#8a99b0] uppercase tracking-wider mb-1.5">Umpire 2</label>
                      <input 
                        type="text" value={matchSetup.umpires?.umpire2 || ''} onChange={e => setMatchSetup(p => ({ ...p, umpires: { ...p.umpires, umpire2: e.target.value } }))}
                        placeholder="Enter Name"
                        className="w-full bg-slate-50 rounded-[12px] p-3 text-[14px] font-bold outline-none border focus:border-[#2457D6] border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-[#8a99b0] uppercase tracking-wider mb-1.5">TV Umpire (Optional)</label>
                      <input 
                        type="text" value={matchSetup.umpires?.tvUmpire || ''} onChange={e => setMatchSetup(p => ({ ...p, umpires: { ...p.umpires, tvUmpire: e.target.value } }))}
                        placeholder="Enter Name"
                        className="w-full bg-slate-50 rounded-[12px] p-3 text-[14px] font-bold outline-none border focus:border-[#2457D6] border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-[#8a99b0] uppercase tracking-wider mb-1.5">Match Referee</label>
                      <input 
                        type="text" value={matchSetup.umpires?.referee || ''} onChange={e => setMatchSetup(p => ({ ...p, umpires: { ...p.umpires, referee: e.target.value } }))}
                        placeholder="Enter Name"
                        className="w-full bg-slate-50 rounded-[12px] p-3 text-[14px] font-bold outline-none border focus:border-[#2457D6] border-transparent"
                      />
                    </div>
                  </div>
                </div>
             </div>
          </div>
        )}

      </div>

      {/* BOTTOM ACTIONS */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-100 shadow-[0_-10px_20px_rgba(0,0,0,0.02)] z-30">
        <div className="flex gap-3">
          {currentStep > 1 && (
            <button onClick={() => setCurrentStep(c => c - 1)} className="flex-1 py-4 rounded-[16px] bg-slate-50 text-[#101827] text-[14px] font-bold border border-gray-200 active:bg-gray-100">
              Back
            </button>
          )}
          <button 
            disabled={isSaving}
            onClick={() => currentStep < 3 ? setCurrentStep(c => c + 1) : handleStartMatch()}
            className={`py-4 rounded-[16px] text-white text-[14px] font-bold shadow-md active:opacity-90 flex items-center justify-center gap-2 ${currentStep > 1 ? 'flex-[2]' : 'w-full'} ${currentStep === 3 ? 'bg-[#0FA968]' : 'bg-[#2457D6]'} ${isSaving ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            {isSaving ? 'Saving...' : currentStep === 3 ? 'Start Match' : 'Continue'} {!isSaving && <ArrowRight size={16} />}
          </button>
        </div>
      </div>

      {/* ADD PLAYER MODAL */}
      {isAddPlayerModalOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-[#101827]/65 p-3 sm:p-5">
           <div className="w-full max-w-sm bg-white rounded-[24px] shadow-2xl overflow-hidden animate-slide-up">
              <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
                <h3 className="text-[16px] font-black text-[#101827]">Available Players</h3>
                <button onClick={() => setIsAddPlayerModalOpen(false)} className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center"><X size={16} className="text-[#596579]" /></button>
              </div>
              <div className="p-4">
                 <input type="text" placeholder="Search players..." value={rosterSearchQuery} onChange={e => setRosterSearchQuery(e.target.value)} className="w-full bg-slate-50 rounded-[12px] p-3 text-[14px] outline-none mb-4" />
                 <div className="max-h-60 overflow-y-auto space-y-2">
                    {players.filter(p => !activeXI.find(xi => xi.id === p.id) && (p.full_name || p.name || '').toLowerCase().includes((rosterSearchQuery || '').toLowerCase())).map(p => (
                       <button key={p.id} onClick={() => { addPlayerToXI(p); setIsAddPlayerModalOpen(false); }} className="w-full flex items-center justify-between p-3 bg-white border border-gray-200 rounded-[12px] active:bg-gray-50">
                          <div className="text-left">
                            <div className="font-bold text-[14px] text-[#101827]">{p.full_name || p.name}</div>
                            <div className="text-xs text-[#8a99b0]">{p.role}</div>
                          </div>
                          <Plus size={18} className="text-[#2457D6]"/>
                       </button>
                    ))}
                 </div>
              </div>
           </div>
        </div>
      )}

    </div>
  );
}
