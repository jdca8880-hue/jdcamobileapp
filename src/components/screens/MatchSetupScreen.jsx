import React, { useState, useMemo } from 'react';
import { Check, Edit2, Search, ArrowRight, ArrowLeft, Plus, Trash2, X, Settings2, Users, Coins, Shield, ChevronDown, Zap, AlertTriangle } from 'lucide-react';
import { useCricket } from '../../context/CricketContext';
import { api } from '../../lib/api';
import { motion, AnimatePresence } from 'motion/react';

/* ────────── Inline SVG Icons (cricket-themed) ────────── */
const BatIcon = ({ className = '' }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M3 21l4-4" />
    <path d="M7 17l8.5-8.5c1-1 2.5-1 3.5 0l.5.5c1 1 1 2.5 0 3.5L11 21" />
    <path d="M14 7l3 3" />
  </svg>
);

const BallIcon = ({ className = '' }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className={className}>
    <circle cx="12" cy="12" r="10" />
    <path d="M8 2.5C8 2.5 9.5 7 9.5 12S8 21.5 8 21.5" />
    <path d="M16 2.5C16 2.5 14.5 7 14.5 12S16 21.5 16 21.5" />
  </svg>
);

/* ────────── Role badge color map ────────── */
const roleColors = {
  'Batter':        'bg-cobalt-50 text-cobalt-700',
  'Batsman':       'bg-cobalt-50 text-cobalt-700',
  'Bowler':        'bg-jade-50 text-jade-700',
  'All-Rounder':   'bg-mango-50 text-mango-700',
  'All Rounder':   'bg-mango-50 text-mango-700',
  'Wicket Keeper': 'bg-coral-50 text-coral-700',
  'WK-Batter':     'bg-coral-50 text-coral-700',
};
const getRoleBadge = (role) => roleColors[role] || 'bg-ink-50 text-ink-600';

/* ────────── Custom Player Select (for Step 4 openers) ────────── */
function PlayerSelect({ icon: Icon, label, sublabel, value, onChange, players, disabledIds = [], completed }) {
  const [open, setOpen] = useState(false);
  const selectedPlayer = players.find(p => String(p.id) === String(value));

  return (
    <div className="relative">
      <div className={`
        rounded-2xl border-2 transition-all duration-300 overflow-hidden
        ${completed
          ? 'border-jade/30 bg-jade-50/40 shadow-[0_0_20px_rgba(15,169,104,0.08)]'
          : open
            ? 'border-cobalt/50 bg-white shadow-lg shadow-cobalt/5'
            : 'border-ink-100/60 bg-white shadow-sm hover:border-ink-300/50 hover:shadow-md'
        }
      `}>
        {/* Label Header */}
        <div className="flex items-center gap-3 px-4 pt-4 pb-2">
          <div className={`
            w-10 h-10 rounded-xl flex items-center justify-center transition-colors duration-300
            ${completed ? 'bg-jade text-white' : 'bg-ink-50 text-ink-300'}
          `}>
            {completed ? <Check size={18} strokeWidth={3} /> : <Icon className="w-5 h-5" />}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-[11px] font-bold uppercase tracking-[0.08em] text-ink-300">{label}</div>
            <div className="text-[10px] text-ink-300/70 mt-0.5">{sublabel}</div>
          </div>
          {selectedPlayer?.isCaptain && (
            <span className="text-[10px] font-black uppercase tracking-wider bg-mango-50 text-mango-700 px-2 py-0.5 rounded-full">C</span>
          )}
        </div>

        {/* Select Trigger */}
        <button
          type="button"
          onClick={() => setOpen(!open)}
          className="w-full flex items-center justify-between px-4 pb-4 pt-1 text-left group"
        >
          <span className={`text-[15px] font-semibold truncate ${selectedPlayer ? 'text-ink' : 'text-ink-300'}`}>
            {selectedPlayer ? (selectedPlayer.name || selectedPlayer.full_name) : '— Select Player —'}
          </span>
          <div className="flex items-center gap-2">
            {selectedPlayer?.role && (
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${getRoleBadge(selectedPlayer.role)}`}>
                {selectedPlayer.role}
              </span>
            )}
            <motion.div animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }}>
              <ChevronDown size={16} className="text-ink-300" />
            </motion.div>
          </div>
        </button>

        {/* Dropdown Panel */}
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25, ease: 'easeInOut' }}
              className="overflow-hidden"
            >
              <div className="border-t border-ink-100/40 max-h-52 overflow-y-auto">
                {players.length === 0 && (
                  <div className="px-4 py-6 text-center text-sm text-ink-300">No players available</div>
                )}
                {players.map(p => {
                  const isDisabled = disabledIds.includes(String(p.id));
                  const isSelected = String(p.id) === String(value);
                  const displayName = p.name || p.full_name;
                  return (
                    <button
                      key={p.id}
                      type="button"
                      disabled={isDisabled}
                      onClick={() => { onChange(String(p.id)); setOpen(false); }}
                      className={`
                        w-full flex items-center justify-between px-4 py-3 text-left transition-colors
                        ${isSelected
                          ? 'bg-cobalt-50 text-cobalt-700'
                          : isDisabled
                            ? 'opacity-35 cursor-not-allowed bg-ink-50/30'
                            : 'hover:bg-ink-50/60 active:bg-ink-50'
                        }
                      `}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className={`
                          w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-black
                          ${isSelected ? 'bg-cobalt text-white' : 'bg-ink-50 text-ink-300'}
                        `}>
                          {displayName?.charAt(0)?.toUpperCase() || '?'}
                        </div>
                        <div className="truncate">
                          <span className={`text-[14px] font-medium ${isSelected ? 'text-cobalt-700' : 'text-ink'}`}>
                            {displayName}
                          </span>
                          {p.isCaptain && <span className="ml-1.5 text-[10px] font-black text-mango">(C)</span>}
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0 ml-2">
                        {p.role && (
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${getRoleBadge(p.role)}`}>
                            {p.role}
                          </span>
                        )}
                        {isSelected && <Check size={14} strokeWidth={3} className="text-cobalt" />}
                        {isDisabled && !isSelected && (
                          <span className="text-[9px] font-bold text-ink-300 uppercase">Selected</span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════
   MAIN COMPONENT — 5-Step Setup Wizard
   Step 1: Teams (confirm)
   Step 2: Playing XIs (add players to both teams)
   Step 3: Toss (winner + elected to)
   Step 4: Openers (striker, non-striker, bowler)
   Step 5: Rules & Start Match
   ════════════════════════════════════════════════════════════════ */
export default function MatchSetupScreen() {
  const {
    matchSetup, setMatchSetup, navigateTo, goBack, players,
    activeMatchId, matches = [], registeredUsers = [],
    replaceStriker, replaceBatter, replaceBowler, startInnings
  } = useCricket();
  
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
  
  // Step 4: Openers state
  const [selectedStriker, setSelectedStriker] = useState('');
  const [selectedNonStriker, setSelectedNonStriker] = useState('');
  const [selectedBowler, setSelectedBowler] = useState('');

  const activeXI = activeTeamTab === 'A' ? matchSetup.teamAXI : matchSetup.teamBXI;
  const targetArrayName = activeTeamTab === 'A' ? 'teamAXI' : 'teamBXI';

  // ─── Compute batting/bowling teams based on toss ───
  const tossWinnerTeamId = useMemo(() => {
    if (matchSetup.tossWinner === matchSetup.teamA) return matchSetup.teamAId;
    if (matchSetup.tossWinner === matchSetup.teamB) return matchSetup.teamBId;
    return null;
  }, [matchSetup.tossWinner, matchSetup.teamA, matchSetup.teamB, matchSetup.teamAId, matchSetup.teamBId]);

  const { battingXI, bowlingXI } = useMemo(() => {
    let battingTeamId = matchSetup.teamAId;
    let bowlingTeamId = matchSetup.teamBId;

    if (tossWinnerTeamId) {
      if (tossWinnerTeamId === matchSetup.teamAId) {
        battingTeamId = matchSetup.electedTo === 'Bat' ? matchSetup.teamAId : matchSetup.teamBId;
        bowlingTeamId = matchSetup.electedTo === 'Bat' ? matchSetup.teamBId : matchSetup.teamAId;
      } else {
        battingTeamId = matchSetup.electedTo === 'Bat' ? matchSetup.teamBId : matchSetup.teamAId;
        bowlingTeamId = matchSetup.electedTo === 'Bat' ? matchSetup.teamAId : matchSetup.teamBId;
      }
    }

    return {
      battingXI: battingTeamId === matchSetup.teamAId ? matchSetup.teamAXI : matchSetup.teamBXI,
      bowlingXI: bowlingTeamId === matchSetup.teamAId ? matchSetup.teamAXI : matchSetup.teamBXI,
    };
  }, [tossWinnerTeamId, matchSetup.electedTo, matchSetup.teamAId, matchSetup.teamBId, matchSetup.teamAXI, matchSetup.teamBXI]);

  // Opener validation
  const strikerDisabledIds = useMemo(() => selectedNonStriker ? [selectedNonStriker] : [], [selectedNonStriker]);
  const nonStrikerDisabledIds = useMemo(() => selectedStriker ? [selectedStriker] : [], [selectedStriker]);
  const hasDuplicate = selectedStriker && selectedNonStriker && selectedStriker === selectedNonStriker;
  const openersReady = selectedStriker && selectedNonStriker && selectedBowler && !hasDuplicate;

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

  const TOTAL_STEPS = 5;
  const steps = [
    { num: 1, label: 'Teams',   icon: Users },
    { num: 2, label: 'Players', icon: Shield },
    { num: 3, label: 'Toss',    icon: Coins },
    { num: 4, label: 'Openers', icon: Zap },
    { num: 5, label: 'Rules',   icon: Settings2 },
  ];

  const filteredPlayers = activeXI.filter((p) => (p.full_name || p.name || '').toLowerCase().includes((searchQuery || '').toLowerCase()));
  const availableScorers = registeredUsers.filter(u => u.role?.toUpperCase() === 'SCORER');

  /* ─── Step validation before advancing ─── */
  const canAdvance = () => {
    if (currentStep === 1) return true; // Teams are pre-filled
    if (currentStep === 2) {
      // Need at least 2 players per team (for openers) but allow 1 to be flexible
      if (matchSetup.teamAXI.length === 0 || matchSetup.teamBXI.length === 0) {
        alert("Both teams must have at least one player in their Playing XI.");
        return false;
      }
      return true;
    }
    if (currentStep === 3) {
      if (!matchSetup.tossWinner) {
        alert("Please select the toss winner.");
        return false;
      }
      return true;
    }
    if (currentStep === 4) {
      if (!openersReady) {
        alert("Please select a Striker, Non-Striker, and Opening Bowler.");
        return false;
      }
      return true;
    }
    return true;
  };

  const handleNext = () => {
    if (!canAdvance()) return;
    if (currentStep < TOTAL_STEPS) {
      setCurrentStep(c => c + 1);
    } else {
      handleStartMatch();
    }
  };

  const handleStartMatch = async () => {
    setIsSaving(true);
    setSaveError('');
    try {
      // Map toss decision to API format
      const tossDecision = matchSetup.electedTo === 'Bat' ? 'BAT' : 'BOWL';
      
      const setupPayload = {
        ...matchSetup,
        tossWinnerTeamId,
        tossDecision,
      };
      
      await api.persistMatchSetup(activeMatchId, setupPayload);

      // Set up openers in cricket context before navigating
      const s = battingXI.find(p => String(p.id) === String(selectedStriker));
      const ns = battingXI.find(p => String(p.id) === String(selectedNonStriker));
      const b = bowlingXI.find(p => String(p.id) === String(selectedBowler));

      if (s && ns && b) {
        // Also update matchSetup with resolved toss winner for the scoring screen
        setMatchSetup(prev => ({
          ...prev,
          tossWinnerTeamId,
        }));

        replaceStriker({ ...s, runs: 0, balls: 0, fours: 0, sixes: 0, strikeRate: '0.0' });
        replaceBatter(false, { ...ns, runs: 0, balls: 0, fours: 0, sixes: 0, strikeRate: '0.0' });
        replaceBowler(b);
        startInnings();
        navigateTo('scoring');
      } else {
        setSaveError("Could not find selected players. Please go back and re-select.");
      }
    } catch (err) {
      console.error("Failed to persist setup:", err);
      setSaveError(err.message || "Failed to save match setup. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  /* ─── Batting team name for Step 4 display ─── */
  const battingTeamName = useMemo(() => {
    if (!tossWinnerTeamId) return matchSetup.teamA;
    if (tossWinnerTeamId === matchSetup.teamAId) {
      return matchSetup.electedTo === 'Bat' ? matchSetup.teamA : matchSetup.teamB;
    }
    return matchSetup.electedTo === 'Bat' ? matchSetup.teamB : matchSetup.teamA;
  }, [tossWinnerTeamId, matchSetup]);

  const bowlingTeamName = useMemo(() => {
    if (!tossWinnerTeamId) return matchSetup.teamB;
    if (tossWinnerTeamId === matchSetup.teamAId) {
      return matchSetup.electedTo === 'Bat' ? matchSetup.teamB : matchSetup.teamA;
    }
    return matchSetup.electedTo === 'Bat' ? matchSetup.teamA : matchSetup.teamB;
  }, [tossWinnerTeamId, matchSetup]);

  return (
    <div className="pb-[120px] bg-slate-50 min-h-screen">
      
      {/* HEADER */}
      <div className="bg-white px-4 pt-[60px] pb-4 border-b border-gray-100 shadow-[0_2px_10px_rgba(0,0,0,0.02)] sticky top-0 z-20">
        <div className="flex items-center justify-between mb-4">
          <button onClick={() => currentStep > 1 ? setCurrentStep(c => c - 1) : goBack()} className="w-9 h-9 flex items-center justify-center rounded-full bg-gray-50 text-[#101827] active:bg-gray-100 transition-colors">
            <ArrowLeft size={20} strokeWidth={2.5} />
          </button>
          <div className="text-[14px] font-black text-[#101827] uppercase tracking-wider">Setup Match</div>
          <div className="w-9"></div>
        </div>

        {/* PROGRESS TABS */}
        <div className="flex items-center justify-between max-w-lg mx-auto">
          {steps.map((s, idx) => (
            <div key={s.num} className="flex-1 text-center relative">
               <div className={`text-[9px] sm:text-xs font-bold uppercase tracking-wider mb-2 ${s.num === currentStep ? 'text-[#2457D6]' : s.num < currentStep ? 'text-[#0FA968]' : 'text-[#8a99b0]'}`}>
                 {s.label}
               </div>
               <div className="flex items-center justify-center relative z-10">
                 <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-white border-2 border-white shadow-sm transition-colors ${
                    s.num === currentStep ? 'bg-[#2457D6]' : s.num < currentStep ? 'bg-[#0FA968]' : 'bg-[#d2d8e2]'
                 }`}>
                   {s.num < currentStep ? <Check size={14} strokeWidth={3} /> : <s.icon size={13} />}
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
        
        {/* ═══════════ STEP 1: TEAMS ═══════════ */}
        {currentStep === 1 && (
          <div className="bg-white rounded-[20px] p-5 shadow-sm border border-gray-100 animate-slide-up">
            <h2 className="text-[12px] font-black uppercase tracking-widest text-[#596579] mb-4">Match Teams</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#8a99b0] uppercase tracking-wider mb-1.5">Team A (Home) *</label>
                <input 
                  type="text" value={matchSetup.teamA} readOnly
                  className="w-full bg-slate-50 rounded-[12px] p-4 text-[16px] font-black outline-none border border-transparent text-gray-500 cursor-not-allowed"
                />
              </div>
              <div className="text-center font-black text-[12px] text-[#8a99b0] uppercase tracking-widest">VS</div>
              <div>
                <label className="block text-xs font-bold text-[#8a99b0] uppercase tracking-wider mb-1.5">Team B (Away) *</label>
                <input 
                  type="text" value={matchSetup.teamB} readOnly
                  className="w-full bg-slate-50 rounded-[12px] p-4 text-[16px] font-black outline-none border border-transparent text-gray-500 cursor-not-allowed"
                />
              </div>
            </div>
          </div>
        )}

        {/* ═══════════ STEP 2: PLAYING XIs ═══════════ */}
        {currentStep === 2 && (
          <div className="space-y-4 animate-slide-up">
            <div className="bg-white rounded-[20px] p-5 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-[12px] font-black uppercase tracking-widest text-[#596579]">Playing XIs</h2>
                <button onClick={() => setIsEditingXI(!isEditingXI)} className="text-xs font-bold uppercase tracking-wider text-[#2457D6] flex items-center gap-1">
                  <Edit2 size={12}/> {isEditingXI ? 'DONE' : 'EDIT'}
                </button>
              </div>

              <div className="flex mb-4 bg-slate-100 p-1 rounded-lg">
                <button onClick={() => { setActiveTeamTab('A'); setSearchQuery(''); }} className={`flex-1 py-2 text-xs font-bold rounded-md ${activeTeamTab === 'A' ? 'bg-white shadow-sm text-[#101827]' : 'text-[#8a99b0]'}`}>
                  {matchSetup.teamA} ({matchSetup.teamAXI.length})
                </button>
                <button onClick={() => { setActiveTeamTab('B'); setSearchQuery(''); }} className={`flex-1 py-2 text-xs font-bold rounded-md ${activeTeamTab === 'B' ? 'bg-white shadow-sm text-[#101827]' : 'text-[#8a99b0]'}`}>
                  {matchSetup.teamB} ({matchSetup.teamBXI.length})
                </button>
              </div>

              {/* Search within XI */}
              {activeXI.length > 3 && (
                <div className="relative mb-3">
                  <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8a99b0]" />
                  <input type="text" placeholder="Search players..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="w-full bg-slate-50 rounded-[10px] pl-8 pr-3 py-2.5 text-[13px] outline-none" />
                </div>
              )}

              <div className="space-y-2">
                {filteredPlayers.length === 0 && activeXI.length === 0 && (
                  <div className="text-center py-8 text-[#8a99b0]">
                    <Users size={32} className="mx-auto mb-2 opacity-40" />
                    <p className="text-xs font-bold uppercase tracking-wider">No players added yet</p>
                    <p className="text-[10px] mt-1">Tap Edit → Add Player to build the Playing XI</p>
                  </div>
                )}
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

        {/* ═══════════ STEP 3: TOSS ═══════════ */}
        {currentStep === 3 && (
          <div className="bg-white rounded-[20px] p-5 shadow-sm border border-gray-100 animate-slide-up">
            <h2 className="text-[12px] font-black uppercase tracking-widest text-[#596579] mb-4">Toss Details</h2>
            <label className="block text-xs font-bold text-[#8a99b0] uppercase tracking-wider mb-2">Who Won the Toss?</label>
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

            {/* Toss Summary */}
            {matchSetup.tossWinner && (
              <div className="mt-5 p-3 bg-cobalt-50 rounded-xl border border-cobalt-200/40">
                <p className="text-xs font-bold text-cobalt-700 text-center">
                  {matchSetup.tossWinner} won the toss and elected to {matchSetup.electedTo} first
                </p>
              </div>
            )}
          </div>
        )}

        {/* ═══════════ STEP 4: OPENERS ═══════════ */}
        {currentStep === 4 && (
          <div className="space-y-4 animate-slide-up">
            {/* Context Banner */}
            <div className="bg-cobalt-50 rounded-[16px] p-4 border border-cobalt-200/30">
              <p className="text-[11px] font-bold text-cobalt-700 text-center leading-relaxed">
                <span className="font-black">{battingTeamName}</span> bats first vs <span className="font-black">{bowlingTeamName}</span>
              </p>
            </div>

            {/* Insufficient Players Warning */}
            {battingXI.length < 2 && (
              <div className="p-4 rounded-2xl bg-mango-50 border border-mango-400/30 flex items-start gap-3">
                <AlertTriangle size={18} className="text-mango shrink-0 mt-0.5" />
                <div>
                  <div className="text-[13px] font-bold text-mango-700">Not Enough Batters</div>
                  <p className="text-[11px] text-mango-700/70 mt-1">
                    {battingTeamName} has only <strong>{battingXI.length}</strong> player{battingXI.length !== 1 ? 's' : ''} — need at least 2 openers.
                    Go back to Step 2 to add more players.
                  </p>
                </div>
              </div>
            )}

            {/* Striker */}
            <PlayerSelect
              icon={BatIcon}
              label="Striker"
              sublabel={`Opening batter for ${battingTeamName}`}
              value={selectedStriker}
              onChange={setSelectedStriker}
              players={battingXI}
              disabledIds={strikerDisabledIds}
              completed={!!selectedStriker}
            />

            {/* Non-Striker */}
            <PlayerSelect
              icon={BatIcon}
              label="Non-Striker"
              sublabel={`Second opener for ${battingTeamName}`}
              value={selectedNonStriker}
              onChange={setSelectedNonStriker}
              players={battingXI}
              disabledIds={nonStrikerDisabledIds}
              completed={!!selectedNonStriker}
            />

            {/* Opening Bowler */}
            <PlayerSelect
              icon={BallIcon}
              label="Opening Bowler"
              sublabel={`First over bowler from ${bowlingTeamName}`}
              value={selectedBowler}
              onChange={setSelectedBowler}
              players={bowlingXI}
              disabledIds={[]}
              completed={!!selectedBowler}
            />

            {/* Duplicate Warning */}
            <AnimatePresence>
              {hasDuplicate && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="px-4 py-3 rounded-xl bg-coral-50 border border-coral-400/30 flex items-center gap-2"
                >
                  <AlertTriangle size={14} className="text-coral shrink-0" />
                  <span className="text-[12px] font-semibold text-coral-700">Striker and Non-Striker cannot be the same player.</span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

        {/* ═══════════ STEP 5: RULES ═══════════ */}
        {currentStep === 5 && (
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
                    <option value={5}>5 Overs (Quick Match)</option>
                    <option value={10}>10 Overs (Sprint)</option>
                    <option value={15}>15 Overs</option>
                    <option value={20}>20 Overs (T20)</option>
                    <option value={30}>30 Overs</option>
                    <option value={40}>40 Overs (One Day)</option>
                    <option value={50}>50 Overs (ODI)</option>
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
                  <h3 className="text-[12px] font-black uppercase tracking-widest text-[#596579] mb-4">Match Officials (Optional)</h3>
                  
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

                {/* Pre-start Summary */}
                <div className="pt-4 border-t border-gray-100 space-y-2">
                  <h3 className="text-[12px] font-black uppercase tracking-widest text-[#596579] mb-3">Match Summary</h3>
                  <div className="bg-slate-50 rounded-xl p-4 space-y-2 text-[13px]">
                    <div className="flex justify-between"><span className="text-[#8a99b0] font-medium">Match</span><span className="font-bold text-ink">{matchSetup.teamA} vs {matchSetup.teamB}</span></div>
                    <div className="flex justify-between"><span className="text-[#8a99b0] font-medium">Toss</span><span className="font-bold text-ink">{matchSetup.tossWinner} ({matchSetup.electedTo})</span></div>
                    <div className="flex justify-between"><span className="text-[#8a99b0] font-medium">Overs</span><span className="font-bold text-ink">{matchSetup.totalOvers}</span></div>
                    <div className="flex justify-between"><span className="text-[#8a99b0] font-medium">Batting First</span><span className="font-bold text-ink">{battingTeamName}</span></div>
                    {selectedStriker && <div className="flex justify-between"><span className="text-[#8a99b0] font-medium">Striker</span><span className="font-bold text-ink">{battingXI.find(p => String(p.id) === selectedStriker)?.name || '—'}</span></div>}
                    {selectedBowler && <div className="flex justify-between"><span className="text-[#8a99b0] font-medium">Bowler</span><span className="font-bold text-ink">{bowlingXI.find(p => String(p.id) === selectedBowler)?.name || '—'}</span></div>}
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
            onClick={handleNext}
            className={`py-4 rounded-[16px] text-white text-[14px] font-bold shadow-md active:opacity-90 flex items-center justify-center gap-2 ${currentStep > 1 ? 'flex-[2]' : 'w-full'} ${currentStep === TOTAL_STEPS ? 'bg-[#0FA968]' : 'bg-[#2457D6]'} ${isSaving ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            {isSaving ? 'Saving...' : currentStep === TOTAL_STEPS ? '🏏 Start Match' : 'Continue'} {!isSaving && currentStep < TOTAL_STEPS && <ArrowRight size={16} />}
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
                    {players.filter(p => {
                      const isAvailable = !activeXI.find(xi => xi.id === p.id);
                      const matchesSearch = (p.full_name || p.name || '').toLowerCase().includes((rosterSearchQuery || '').toLowerCase());
                      const activeTeamId = activeTeamTab === 'A' ? matchSetup.teamAId : matchSetup.teamBId;
                      const isAssignedToTeam = !activeTeamId || (p.team_players && p.team_players.some(tp => tp.team_id === activeTeamId));
                      return isAvailable && matchesSearch && isAssignedToTeam;
                    }).map(p => (
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
