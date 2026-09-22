import React, { useEffect, useMemo, useState } from 'react';
import {
  RotateCcw, FileText, ShieldAlert, AlertTriangle, X,
  ChevronRight, RefreshCw, Radio, CircleHelp, WifiOff,
  MoreHorizontal, Users
} from 'lucide-react';
import { useCricket } from '../../context/CricketContext';
import { useHaptics } from '../../hooks/useHaptics';
import { FREE_HIT_ALLOWED_DISMISSALS } from '../../engine/validationSchemas';
import { motion } from 'motion/react';
import Modal from '../ui/Modal';
import { supabase } from '../../lib/supabase';
import { syncService } from '../../services/SyncService';
import InningsInitScreen from './InningsInitScreen';

const DISMISSALS = ['Bowled', 'Caught', 'LBW', 'Run Out', 'Stumped', 'Hit Wicket', 'Other'];
const QUICK_RUNS = [0, 1, 2, 3, 4, 6];

export default function ScoringScreen() {
  const {
    runs, wickets, balls, formatOvers, calculateCRR, calculateProjectedScore,
    currentOverBalls, striker, nonStriker, currentBowler, isFreeHit, toggleStriker,
    validationError, setValidationError, matchStatus, recordRuns, recordExtra,
    recordWicket, undoLastAction, innings, target, navigateTo, activeMatchId, matches,
    matchSetup, setMatchSetup, replaceStriker, replaceBatter, handleRetireBatter, continueAfterOver, lastOverBowlerId,
    deliveryLog = [], scoringFirstRunDone, markScoringFirstRunDone, goBack, startSecondInnings
  } = useCricket();

  const haptics = useHaptics();

  const [dismissalOpen, setDismissalOpen] = useState(false);
  const [selectedDismissal, setSelectedDismissal] = useState('Caught');
  const [fielder, setFielder] = useState('');
  const [runOutPlayer, setRunOutPlayer] = useState('');
  const [newBatterOpen, setNewBatterOpen] = useState(false);
  const [replacingBatterType, setReplacingBatterType] = useState('striker');
  const [retireModalOpen, setRetireModalOpen] = useState(false);
  const [retiringBatter, setRetiringBatter] = useState('striker');
  const [retireType, setRetireType] = useState('hurt');
  const [overOpen, setOverOpen] = useState(false);
  const [changeWkOpen, setChangeWkOpen] = useState(false);
  const [extrasOpen, setExtrasOpen] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [syncState, setSyncState] = useState({ status: 'ONLINE', pendingCount: 0 });

  useEffect(() => {
    const unsubscribe = syncService.subscribe((state) => {
      setSyncState(state);
    });
    return () => unsubscribe();
  }, []);

  const activeMatch = matches?.find(m => m.id === activeMatchId);
  const teamAName = activeMatch?.teamA?.name || activeMatch?.teamA || 'Team A';
  const teamBName = activeMatch?.teamB?.name || activeMatch?.teamB || 'Team B';
  const tournamentName = activeMatch?.tournament || 'JDCA District Cricket';
  
  // Resolve XIs based on innings
  const teamAXI = matchSetup?.teamAXI || [];
  const teamBXI = matchSetup?.teamBXI || [];
  const tossWinnerTeamId = matchSetup?.tossWinnerTeamId;
  const electedTo = matchSetup?.electedTo;
  
  let battingTeamId = matchSetup?.teamAId;
  let bowlingTeamId = matchSetup?.teamBId;
  
  if (tossWinnerTeamId) {
    if (tossWinnerTeamId === matchSetup?.teamAId) {
      battingTeamId = electedTo === 'Bat' ? matchSetup?.teamAId : matchSetup?.teamBId;
      bowlingTeamId = electedTo === 'Bat' ? matchSetup?.teamBId : matchSetup?.teamAId;
    } else {
      battingTeamId = electedTo === 'Bat' ? matchSetup?.teamBId : matchSetup?.teamAId;
      bowlingTeamId = electedTo === 'Bat' ? matchSetup?.teamAId : matchSetup?.teamBId;
    }
  }

  if (innings === 2) {
    const temp = battingTeamId;
    battingTeamId = bowlingTeamId;
    bowlingTeamId = temp;
  }

  const battingXI = battingTeamId === matchSetup?.teamAId ? teamAXI : teamBXI;
  const bowlingXI = bowlingTeamId === matchSetup?.teamAId ? teamAXI : teamBXI;

  // Only force full InningsInitScreen at the very beginning of the innings
  const needsInitialization = balls === 0 && (!striker?.id || !nonStriker?.id || !currentBowler?.id);

  const batters = useMemo(() => battingXI.filter(p => p?.name && p.name !== striker?.name && p.name !== nonStriker?.name), [battingXI, striker?.name, nonStriker?.name]);
  const lastBalls = deliveryLog.length ? deliveryLog.slice(-6) : currentOverBalls.map((b, i) => ({ ...b, id: `temp-${i}`, runs: Number(b.value) || 0, wicket: b.type === 'wicket', extra: b.type === 'extra' }));
  const isOverComplete = matchStatus === 'OVER_COMPLETE';

  useEffect(() => {
    if (isOverComplete) setOverOpen(true);
  }, [isOverComplete]);

  if (needsInitialization) {
    return <InningsInitScreen battingXI={battingXI} bowlingXI={bowlingXI} />;
  }

  const doRun = (value) => {
    recordRuns(value);
    if (!scoringFirstRunDone) markScoringFirstRunDone?.();

    // Send push notification to update score silently, but vibrate for 4s and 6s
    const isBoundary = value === 4 || value === 6;
    let title = isBoundary ? (value === 6 ? 'SIX! What a shot!' : 'FOUR!') : 'Live Score Update';
    let bodyText = isBoundary 
      ? `${striker.name} hit a ${value}! ${teamAName} is ${runs + value}/${wickets}`
      : `${teamAName} is ${runs + value}/${wickets} (Last: ${value} run${value !== 1 ? 's' : ''})`;

    supabase.functions.invoke('send-push', {
      body: {
        title,
        body: bodyText,
        url: `/matches`,
        tag: `match-${activeMatchId || 'jdca'}`,
        renotify: isBoundary
      }
    });
  };

  const submitWicket = () => {
    let outName = striker.name;
    if (selectedDismissal === 'Run Out') outName = runOutPlayer || striker.name;

    let wk = '';
    if (selectedDismissal === 'Stumped') {
      wk = bowlingXI.find(p => /wicket/i.test(p.role))?.name || fielder;
    }

    setReplacingBatterType(outName === nonStriker.name ? 'nonStriker' : 'striker');
    recordWicket(selectedDismissal, outName, fielder, wk);
    
    // Trigger push notification for wicket
    supabase.functions.invoke('send-push', {
      body: {
        title: 'WICKET!',
        body: `${outName} is out ${selectedDismissal}! ${teamAName} vs ${teamBName} (${runs}/${wickets + 1})`,
        url: `/matches`,
        tag: `match-${activeMatchId || 'jdca'}`,
        renotify: true
      }
    });

    setDismissalOpen(false);
    setFielder('');
    setRunOutPlayer('');
    setNewBatterOpen(true);
  };

  const submitRetire = () => {
    handleRetireBatter(retiringBatter === 'striker', retireType === 'out');
    setRetireModalOpen(false);
    setReplacingBatterType(retiringBatter);
    setNewBatterOpen(true);
  };

  const selectNewBatter = (player) => {
    if (player) {
      replaceBatter(replacingBatterType === 'striker', { ...player, runs: 0, balls: 0, fours: 0, sixes: 0, strikeRate: '0.0' });
    }
    setNewBatterOpen(false);
    setReplacingBatterType('striker'); // reset
  };

  const selectNextBowler = (player) => {
    if (!player) return;
    if (lastOverBowlerId && player.id === lastOverBowlerId) {
      setValidationError('The same bowler cannot bowl two consecutive overs.');
      return;
    }
    continueAfterOver?.(player);
    setOverOpen(false);
  };

  const selectNewWk = (player) => {
    if (!player) return;
    const targetArrayName = bowlingTeamId === matchSetup?.teamAId ? 'teamAXI' : 'teamBXI';
    setMatchSetup(prev => ({
      ...prev,
      [targetArrayName]: prev[targetArrayName].map(p => {
        if (p.id === player.id) return { ...p, role: 'Wicket Keeper' };
        if (p.role?.includes('Wicket Keeper')) return { ...p, role: 'Batter' };
        return p;
      })
    }));
    setChangeWkOpen(false);
  };

  const currentWk = bowlingXI.find(p => /wicket/i.test(p.role || ''));

  return (
    <div className="bg-cloud min-h-screen">
      <div className="max-w-md mx-auto relative bg-white border-x border-slate-200 min-h-screen pb-[100px] shadow-2xl">
        
        {/* HEADER */}
        <div className="px-4 pt-[60px] pb-4 bg-slate-50 border-b border-slate-100">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-jade-50 text-jade-700 border border-jade-100 text-xs font-bold uppercase tracking-wider">
                <span className="w-1.5 h-1.5 rounded-full bg-jade animate-pulse" />
                LIVE SCORING
              </span>
              {/* Sync Indicator */}
              <div className="flex items-center gap-1 bg-white border border-slate-200 px-2 py-1 rounded-full shadow-sm">
                {syncState.status === 'ONLINE' ? (
                   <span className="w-2 h-2 rounded-full bg-jade" />
                ) : syncState.status === 'SYNCING' ? (
                   <RefreshCw size={10} className="text-cobalt animate-spin" />
                ) : (
                   <WifiOff size={10} className="text-coral" />
                )}
                {syncState.pendingCount > 0 && (
                   <span className="text-[10px] font-bold text-slate-500">{syncState.pendingCount}</span>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2">
               <button onClick={() => setShowHelp(true)} className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200 transition-colors"><CircleHelp size={18}/></button>
               <button onClick={() => navigateTo('match-detail')} className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200 transition-colors"><X size={18}/></button>
            </div>
          </div>

          <div className="text-xs font-bold tracking-widest uppercase text-slate-500 mb-1">{tournamentName}</div>
          <div className="text-[16px] font-black text-slate-900">{teamAName} <span className="text-slate-400">vs</span> {teamBName}</div>
        </div>

        {validationError && (
          <div className="mx-4 mt-4 bg-coral text-white p-3 rounded-[12px] flex items-center justify-between text-[12px] font-bold shadow-md">
            <div className="flex items-center gap-2"><AlertTriangle size={16} /> {validationError}</div>
            <button onClick={() => setValidationError(null)} className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30"><X size={12} /></button>
          </div>
        )}

        {/* SCORE AREA */}
        <div className="px-4 py-6 bg-white">
          <div className="text-center">
            <div className="text-[12px] font-bold uppercase tracking-wider text-slate-500 mb-2">
              {innings === 1 ? '1st Innings' : '2nd Innings'} • {innings === 1 ? teamAName : teamBName}
            </div>
            <div className="text-[80px] font-black leading-none tracking-tighter tabular-nums mb-2 text-slate-900 flex items-baseline justify-center">
              <motion.span
                key={runs}
                initial={{ opacity: 0, y: -20, scale: 0.8 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              >
                {runs}
              </motion.span>
              <span className="text-[40px] text-slate-300 mx-1">/</span>
              <motion.span
                key={`w-${wickets}`}
                initial={{ opacity: 0, y: -20, scale: 0.8 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                className="text-[40px] text-slate-400"
              >
                {wickets}
              </motion.span>
            </div>
            <div className="flex items-center justify-center gap-4 text-[14px] font-bold mt-4">
              <div className="bg-slate-50 border border-slate-200 px-4 py-1.5 rounded-full text-slate-500">
                Overs <span className="text-slate-900 ml-1">{formatOvers(balls)}</span>
              </div>
              <div className="bg-slate-50 border border-slate-200 px-4 py-1.5 rounded-full text-slate-500">
                CRR <span className="text-slate-900 ml-1">{calculateCRR()}</span>
              </div>
            </div>
            {innings === 2 && target && (
              <div className="mt-4 bg-jade-50 border border-jade-100 px-4 py-2 rounded-xl inline-flex flex-col items-center justify-center text-jade-700">
                <div className="text-[12px] font-bold uppercase tracking-widest opacity-80 mb-0.5">Target: {target}</div>
                <div className="text-[15px] font-black">
                  Need {Math.max(0, target - runs)} runs from {Math.max(0, (totalMatchOvers * 6) - balls)} balls
                </div>
              </div>
            )}
          </div>
        </div>

        {/* RECENT BALLS */}
        <div className="px-4 mb-6">
          <div className="bg-slate-50 rounded-[12px] p-3 border border-slate-200 flex items-center justify-between">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-500 w-12 text-center">THIS OVER</div>
            <div className="flex-1 flex items-center gap-2 overflow-x-auto px-2 no-scrollbar min-h-[32px]">
              {lastBalls.map((b, i) => (
                <div key={i} className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-[12px] font-black border ${
                  b.wicket ? 'bg-coral text-white border-coral' :
                  b.extra ? 'bg-mango text-white border-mango' :
                  b.runs >= 4 ? 'bg-cobalt text-white border-cobalt' :
                  'bg-white text-slate-700 border-slate-200'
                }`}>
                  {b.label || b.runs || 0}
                </div>
              ))}
              {!lastBalls.length && <div className="text-[12px] font-medium text-slate-400 italic">No balls recorded yet</div>}
            </div>
            <div className="text-[12px] font-black text-slate-700 w-8 text-center">{currentOverBalls.length}/6</div>
          </div>
        </div>

        {/* PLAYERS ON FIELD */}
        <div className="px-4 mb-8">
          <div className="grid grid-cols-2 gap-3 mb-3">
            <button onClick={() => toggleStriker?.()} className="bg-white rounded-[12px] p-4 text-left border border-slate-200 shadow-sm relative overflow-hidden active:bg-slate-50 transition-colors">
              <div className="absolute top-0 right-0 w-2 h-full bg-jade" />
              <div className="text-xs font-bold text-jade uppercase tracking-wider mb-1 flex items-center gap-1">Striker <span>*</span></div>
              <div className="text-[15px] font-black text-slate-900 truncate mb-2">{striker.name}</div>
              <div className="text-[18px] font-black tabular-nums leading-none text-slate-900">{striker.runs} <span className="text-[12px] text-slate-500">({striker.balls})</span></div>
            </button>
            
            <button onClick={() => toggleStriker?.()} className="bg-slate-50 rounded-[12px] p-4 text-left border border-slate-200 active:bg-slate-100 transition-colors">
              <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Non-Striker</div>
              <div className="text-[15px] font-bold text-slate-700 truncate mb-2">{nonStriker.name}</div>
              <div className="text-[18px] font-black tabular-nums leading-none text-slate-700">{nonStriker.runs} <span className="text-[12px] text-slate-500">({nonStriker.balls})</span></div>
            </button>
          </div>

          <div className="bg-white rounded-[12px] p-4 border border-slate-200 flex items-center justify-between mb-3 shadow-sm">
             <div>
               <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1 flex items-center gap-1"><RefreshCw size={10}/> Bowler</div>
               <div className="text-[15px] font-black text-slate-900">{currentBowler.name}</div>
             </div>
             <div className="text-right">
               <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">O-M-R-W</div>
               <div className="text-[16px] font-black tabular-nums text-slate-900">{currentBowler.overs}-{currentBowler.maidens}-{currentBowler.runs}-{currentBowler.wickets}</div>
             </div>
          </div>

          <div className="flex gap-2">
             <button onClick={() => setOverOpen(true)} className="flex-1 bg-white rounded-[10px] py-2.5 text-xs font-bold uppercase tracking-wider border border-slate-200 text-slate-700 flex items-center justify-center gap-1.5 hover:bg-slate-50 active:bg-slate-100 transition-colors">
               <RefreshCw size={14} /> Change Bowler
             </button>
             <button onClick={() => setChangeWkOpen(true)} className="flex-1 bg-white rounded-[10px] py-2.5 text-xs font-bold uppercase tracking-wider border border-slate-200 text-slate-700 flex items-center justify-center gap-1.5 hover:bg-slate-50 active:bg-slate-100 transition-colors">
               <Users size={14} /> Edit WK {currentWk ? `(${currentWk.name.split(' ')[0]})` : ''}
             </button>
          </div>
        </div>

        {/* SCORING PAD */}
        <div className="bg-slate-50 border-t border-slate-200 p-5 mt-auto shadow-[0_-10px_40px_rgba(0,0,0,0.03)] pb-24">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-[16px] font-black text-slate-900">Record Ball</h3>
              <div className="text-[12px] font-medium text-slate-500">Tap the result of the delivery</div>
            </div>
            <motion.button whileTap={{ scale: 0.92 }} onClick={() => { haptics.medium(); undoLastAction(); }} disabled={!deliveryLog.length} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-slate-200 text-slate-600 text-xs font-bold uppercase tracking-wider shadow-sm disabled:opacity-50 hover:bg-slate-50 transition-colors">
              <RotateCcw size={14} /> Undo
            </motion.button>
          </div>

          <div className="grid grid-cols-3 gap-2.5 mb-2.5">
            {QUICK_RUNS.map(value => (
              <motion.button 
                key={value} 
                whileTap={{ scale: 0.96 }}
                onClick={() => {
                  if (value === 0) haptics.light();
                  else if (value === 4 || value === 6) haptics.success();
                  else haptics.medium();
                  doRun(value);
                }} 
                className={`h-16 rounded-[12px] flex items-center justify-center text-[24px] font-black shadow-sm transition-colors border ${
                  value === 0 ? 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50' : 
                  value >= 4 ? 'bg-[#E1FF01] text-slate-900 border-[#cbe500] shadow-md hover:brightness-95' : 
                  'bg-white text-slate-900 border-slate-200 hover:bg-slate-50'
                }`}
              >
                {value}
              </motion.button>
            ))}
          </div>

          <div className="grid grid-cols-4 gap-2 mb-4">
             <motion.button whileTap={{ scale: 0.96 }} onClick={() => { haptics.light(); recordExtra('wide', 0); }} className="h-12 rounded-[10px] bg-white border border-slate-200 text-slate-700 text-[12px] font-black uppercase tracking-wider hover:bg-slate-50 shadow-sm transition-colors">WD</motion.button>
             <motion.button whileTap={{ scale: 0.96 }} onClick={() => { haptics.light(); recordExtra('no_ball', 0); }} className="h-12 rounded-[10px] bg-white border border-slate-200 text-slate-700 text-[12px] font-black uppercase tracking-wider hover:bg-slate-50 shadow-sm transition-colors">NB</motion.button>
             <motion.button whileTap={{ scale: 0.96 }} onClick={() => { haptics.light(); recordExtra('bye', 1); }} className="h-12 rounded-[10px] bg-white border border-slate-200 text-slate-700 text-[12px] font-black uppercase tracking-wider hover:bg-slate-50 shadow-sm transition-colors">B</motion.button>
             <motion.button whileTap={{ scale: 0.96 }} onClick={() => { haptics.light(); recordExtra('leg_bye', 1); }} className="h-12 rounded-[10px] bg-white border border-slate-200 text-slate-700 text-[12px] font-black uppercase tracking-wider hover:bg-slate-50 shadow-sm transition-colors">LB</motion.button>
          </div>

          <div className="grid grid-cols-3 gap-2.5">
             <motion.button whileTap={{ scale: 0.96 }} onClick={() => { haptics.heavy(); setDismissalOpen(true); }} className="h-14 rounded-[12px] bg-red-600 text-white flex items-center justify-center gap-1.5 text-[13px] font-black shadow-md border border-red-700">
               <ShieldAlert size={16} /> WICKET
             </motion.button>
             <motion.button whileTap={{ scale: 0.96 }} onClick={() => { haptics.medium(); setRetireModalOpen(true); }} className="h-14 rounded-[12px] bg-white border border-slate-200 text-slate-700 flex items-center justify-center gap-1.5 text-[13px] font-black shadow-sm active:bg-slate-50 transition-colors">
               RETIRE
             </motion.button>
             <motion.button whileTap={{ scale: 0.96 }} onClick={() => { haptics.light(); setExtrasOpen(true); }} className="h-14 rounded-[12px] bg-white border border-slate-200 text-slate-700 flex items-center justify-center gap-1.5 text-[12px] font-bold shadow-sm active:bg-slate-50 transition-colors">
               <MoreHorizontal size={16} /> EXTRAS
             </motion.button>
          </div>
        </div>

        {/* MODALS */}
        {dismissalOpen && (
          <Modal title="Record Wicket" danger onClose={() => setDismissalOpen(false)}>
            <div className="bg-white border border-slate-100 rounded-[12px] p-3 mb-4 text-center">
              <span className="text-[14px] font-bold text-slate-900">{striker.name}</span> <span className="text-[12px] text-slate-500">is on strike</span>
            </div>
            <div className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">How out?</div>
            <div className="grid grid-cols-2 gap-2 mb-4">
              {DISMISSALS.map(type => {
                const blocked = isFreeHit && !FREE_HIT_ALLOWED_DISMISSALS.includes(type);
                const selected = selectedDismissal === type;
                return (
                  <button 
                    key={type} 
                    disabled={blocked} 
                    className={`py-3 rounded-[10px] text-[13px] font-bold border transition-colors ${
                      selected ? 'bg-slate-900 text-white border-slate-900' : 
                      blocked ? 'opacity-40 bg-slate-50 border-slate-100 cursor-not-allowed' : 
                      'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                    }`}
                    onClick={() => setSelectedDismissal(type)}
                  >
                    {type}
                  </button>
                );
              })}
            </div>

            {selectedDismissal === 'Caught' && (
              <div className="mb-4">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2 block">Caught by</label>
                <div className="grid grid-cols-2 gap-2 mb-4">
                  {bowlingXI.filter(p => p.name !== striker.name && p.name !== nonStriker.name).map(p => (
                    <button 
                      key={p.id} 
                      className={`py-2 px-2 rounded-[8px] text-[12px] font-bold border transition-colors ${fielder === p.name ? 'bg-cobalt text-white border-cobalt' : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'}`} 
                      onClick={() => setFielder(p.name)}
                    >
                      {p.name} {/wicket/i.test(p.role) ? '(WK)' : ''}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="flex gap-2 mt-6">
              <button className="flex-1 py-3 rounded-[10px] font-bold bg-white border border-slate-200 text-slate-700" onClick={() => setDismissalOpen(false)}>Cancel</button>
              <motion.button 
                whileTap={{ scale: 0.96 }}
                className="flex-1 py-3 rounded-[10px] font-bold bg-coral text-white disabled:opacity-50 shadow-md" 
                onClick={() => { haptics.heavy(); submitWicket(); }} 
                disabled={(selectedDismissal === 'Caught' || selectedDismissal === 'Run Out') && !fielder}
              >
                Confirm Wicket
              </motion.button>
            </div>
          </Modal>
        )}

        {retireModalOpen && (
          <Modal title="Retire Batter" onClose={() => setRetireModalOpen(false)}>
            <div className="mb-4">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2 block">Who is retiring?</label>
              <div className="grid grid-cols-2 gap-2">
                <button 
                  onClick={() => setRetiringBatter('striker')}
                  className={`py-3 rounded-[10px] text-[13px] font-bold border transition-colors ${retiringBatter === 'striker' ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'}`}
                >
                  {striker.name} (Striker)
                </button>
                <button 
                  onClick={() => setRetiringBatter('nonStriker')}
                  className={`py-3 rounded-[10px] text-[13px] font-bold border transition-colors ${retiringBatter === 'nonStriker' ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'}`}
                >
                  {nonStriker.name} (Non-Striker)
                </button>
              </div>
            </div>

            <div className="mb-6">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2 block">Reason</label>
              <div className="grid grid-cols-2 gap-2">
                <button 
                  onClick={() => setRetireType('hurt')}
                  className={`py-3 px-2 rounded-[10px] text-[13px] font-bold border transition-colors flex flex-col items-center justify-center gap-1 ${retireType === 'hurt' ? 'bg-mango text-white border-mango' : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'}`}
                >
                  <span>Retired Hurt</span><span className="text-xs font-normal opacity-90">(No Wicket)</span>
                </button>
                <button 
                  onClick={() => setRetireType('out')}
                  className={`py-3 px-2 rounded-[10px] text-[13px] font-bold border transition-colors flex flex-col items-center justify-center gap-1 ${retireType === 'out' ? 'bg-coral text-white border-coral' : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'}`}
                >
                  <span>Retired Out</span><span className="text-xs font-normal opacity-90">(Counts as Wicket)</span>
                </button>
              </div>
            </div>

            <div className="flex gap-2">
              <button className="flex-1 py-3 rounded-[10px] font-bold bg-white border border-slate-200 text-slate-700" onClick={() => setRetireModalOpen(false)}>Cancel</button>
              <button 
                className="flex-1 py-3 rounded-[10px] font-bold bg-jade text-white" 
                onClick={submitRetire}
              >
                Confirm Retire
              </button>
            </div>
          </Modal>
        )}

        {newBatterOpen && wickets < 10 && (
          <Modal title="New Batter" onClose={() => setNewBatterOpen(false)}>
            <p className="text-[13px] text-slate-600 mb-4">Select the next batter. The wicket has been recorded.</p>
            <div className="flex flex-col gap-2 max-h-60 overflow-y-auto pr-1">
              {batters.map(player => (
                <button 
                  key={player.id} 
                  onClick={() => selectNewBatter(player)}
                  className="flex items-center justify-between p-3 rounded-[10px] bg-white border border-slate-200 hover:bg-slate-50 active:bg-slate-100 transition-colors"
                >
                  <div>
                    <div className="text-[14px] font-bold text-slate-900 text-left">{player.name}</div>
                    <div className="text-xs text-slate-500 text-left">{player.role || 'Batter'}</div>
                  </div>
                  <ChevronRight size={16} className="text-slate-300"/>
                </button>
              ))}
            </div>
          </Modal>
        )}

        {overOpen && !newBatterOpen && (
          <Modal title={isOverComplete ? "Over Complete" : "Change Bowler"} onClose={() => setOverOpen(false)}>
            {isOverComplete && (
              <div className="bg-cobalt-50 p-4 rounded-[12px] mb-4 text-center border border-cobalt-100">
                <div className="text-[24px] font-black text-cobalt">{runs}/{wickets}</div>
                <div className="text-[12px] font-bold text-slate-600">after {formatOvers(balls)} overs</div>
              </div>
            )}
            <div className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Select new bowler</div>
            <div className="flex gap-3 overflow-x-auto pb-4 no-scrollbar">
              {bowlingXI.filter(p => /bowler|all-rounder/i.test(p.role || '') && p.id !== lastOverBowlerId).map(player => (
                <button 
                  key={player.id} 
                  onClick={() => selectNextBowler(player)}
                  className="flex items-center justify-between p-3 rounded-[10px] bg-white border border-slate-200 hover:bg-slate-50 active:bg-slate-100 transition-colors"
                >
                  <div>
                    <div className="text-[14px] font-bold text-slate-900 text-left">{player.name}</div>
                    <div className="text-xs text-slate-500 text-left">{player.role}</div>
                  </div>
                  <ChevronRight size={16} className="text-slate-300"/>
                </button>
              ))}
            </div>
          </Modal>
        )}

        {changeWkOpen && (
          <Modal title="Change Wicket Keeper" onClose={() => setChangeWkOpen(false)}>
            <div className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Select new Wicket Keeper</div>
            <div className="flex flex-col gap-2 max-h-60 overflow-y-auto pr-1">
              {bowlingXI.map(player => {
                const isWk = /wicket/i.test(player.role || '');
                return (
                  <button 
                    key={player.id} 
                    onClick={() => selectNewWk(player)}
                    className={`flex items-center justify-between p-3 rounded-[10px] border transition-colors ${isWk ? 'bg-mango-50 border-mango text-slate-900' : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-900'}`}
                  >
                    <div className="text-left">
                      <div className="text-[14px] font-bold">{player.name}</div>
                      <div className={`text-xs ${isWk ? 'text-mango-700 font-semibold' : 'text-slate-500'}`}>{player.role}</div>
                    </div>
                    {isWk && <span className="text-xs font-bold uppercase tracking-widest bg-mango text-white px-2 py-1 rounded">Current WK</span>}
                  </button>
                );
              })}
            </div>
          </Modal>
        )}

        {matchStatus === 'INNINGS_BREAK' && innings === 1 && (
          <div className="fixed inset-0 z-[100] bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white w-full max-w-sm rounded-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
              <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
                <h3 className="font-black text-slate-900">Innings Break</h3>
              </div>
              <div className="p-6 text-center">
                <div className="text-[40px] font-black text-slate-900 leading-none mb-2">{runs}/{wickets}</div>
                <div className="text-[14px] font-bold text-slate-500 mb-6">Target for {battingTeamId === matchSetup?.teamAId ? teamBName : teamAName}: {runs + 1}</div>
                <button 
                  onClick={() => startSecondInnings(runs + 1)}
                  className="w-full py-4 rounded-xl font-bold bg-jade text-white shadow-lg active:scale-95 transition-transform"
                >
                  Start 2nd Innings
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
