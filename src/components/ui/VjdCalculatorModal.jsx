import React, { useState, useMemo } from 'react';
import { X, Calculator, Share2, Image as ImageIcon, CheckCircle2, Sparkles, Info, Clock } from 'lucide-react';
import { createPortal } from 'react-dom';
import { useCricket } from '../../context/CricketContext';
import { calculateRevisedTarget } from '../../engine/vjdMethod';
import { shareVjdCardImage } from '../../lib/share';

/**
 * Standalone VJD (V. Jayadevan) Method calculator.
 *
 * This is a self-contained tool opened from the scorer's drawer. It does NOT
 * touch live match state — scorers compute the revised target here and then
 * enter the result into the scoring screen's "Adjust Overs" flow. Keeping the
 * calculation out of the scoring pane means the scoring screen only ever
 * consumes a final, human-verified number.
 */
const FORMAT_PRESETS = [
  { id: 'T20', label: 'T20', overs: 20 },
  { id: 'ODI', label: 'ODI / 50', overs: 50 },
  { id: 'CUSTOM', label: 'Custom', overs: null },
];

export default function VjdCalculatorModal() {
  const { vjdCalcOpen, setVjdCalcOpen } = useCricket();

  const [preset, setPreset] = useState('T20');
  const [customOvers, setCustomOvers] = useState('');
  const [team1Name, setTeam1Name] = useState('');
  const [team2Name, setTeam2Name] = useState('');
  const [team1Score, setTeam1Score] = useState('');
  const [team1Overs, setTeam1Overs] = useState('');
  const [team1Wickets, setTeam1Wickets] = useState('');
  const [revisedOvers, setRevisedOvers] = useState('');
  const [sharing, setSharing] = useState(false);
  const [shared, setShared] = useState(false);

  // Optional time-lost → revised-overs helper
  const [useTimeCalc, setUseTimeCalc] = useState(false);
  const [minutesLost, setMinutesLost] = useState('');

  const maxOvers = useMemo(() => {
    const p = FORMAT_PRESETS.find(f => f.id === preset);
    if (p && p.overs) return p.overs;
    const c = parseInt(customOvers, 10);
    return isNaN(c) || c <= 0 ? null : c;
  }, [preset, customOvers]);

  // Standard over-rate (minutes per over) used to convert lost time into overs.
  const minsPerOver = preset === 'ODI' ? 4.2 : 4.25;

  // When the time-lost helper is on, the revised overs are derived from minutes
  // lost; otherwise the scorer types them directly.
  const timeCalc = useMemo(() => {
    if (!useTimeCalc || !maxOvers) return null;
    const mins = parseFloat(minutesLost);
    if (isNaN(mins) || mins < 0) return null;
    const oversLost = Math.floor(mins / minsPerOver);
    return { oversLost, revisedOvers: Math.max(0, maxOvers - oversLost) };
  }, [useTimeCalc, minutesLost, maxOvers, minsPerOver]);

  const effectiveRevisedOvers = useTimeCalc
    ? (timeCalc ? timeCalc.revisedOvers : NaN)
    : parseFloat(revisedOvers);

  const result = useMemo(() => {
    if (!maxOvers) return null;
    const t1Score = parseInt(team1Score, 10);
    const t1Overs = parseFloat(team1Overs);
    const t1Wkts = parseInt(team1Wickets, 10);
    const revOvers = effectiveRevisedOvers;
    if ([t1Score, t1Overs, t1Wkts, revOvers].some(v => isNaN(v))) return null;
    if (t1Score < 0 || t1Overs <= 0 || t1Wkts < 0 || t1Wkts > 10 || revOvers <= 0) return null;
    if (revOvers > maxOvers || t1Overs > maxOvers) return null;
    return { ...calculateRevisedTarget(t1Score, t1Overs, t1Wkts, revOvers, 10, maxOvers), t1Score, t1Overs, t1Wkts, revOvers };
  }, [maxOvers, team1Score, team1Overs, team1Wickets, effectiveRevisedOvers]);

  if (!vjdCalcOpen) return null;

  const close = () => { setVjdCalcOpen(false); setShared(false); };

  const handleShare = async () => {
    if (!result || sharing) return;
    setSharing(true);
    try {
      const outcome = await shareVjdCardImage({
        team1Name: team1Name || 'Team 1',
        team1Score: result.t1Score,
        team1Wickets: result.t1Wkts,
        team1Overs: result.t1Overs,
        team2Name: team2Name || 'Team 2',
        revisedTarget: result.revisedTarget,
        revisedOvers: result.revOvers,
        parScore: result.parScore,
        r1: result.r1,
        r2: result.r2,
        maxOvers,
        wicketsInHand: 10,
      });
      if (outcome === 'shared' || outcome === 'downloaded') {
        setShared(true);
        setTimeout(() => setShared(false), 2500);
      }
    } catch (e) {
      console.error('[VJD] share failed', e);
    } finally {
      setSharing(false);
    }
  };

  const maxBowlerOvers = result ? Math.floor(result.revOvers / 5) : 0;

  const inputCls = "w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-3 text-sm font-bold text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:border-violet-500 focus:outline-none transition-colors";
  const labelCls = "block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2";

  return createPortal(
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4" onClick={close}>
      <div
        className="bg-white dark:bg-[#141A20] rounded-[24px] w-full max-w-md overflow-hidden shadow-2xl flex flex-col max-h-[92vh] border border-transparent dark:border-white/10"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-100 dark:border-white/10 bg-gradient-to-br from-violet-50 to-white dark:from-violet-500/10 dark:to-transparent">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-violet-700 flex items-center justify-center shadow-lg shadow-violet-500/30">
              <Calculator className="text-white" size={20} />
            </div>
            <div>
              <h2 className="text-lg font-black text-slate-900 dark:text-white leading-tight">VJD Calculator</h2>
              <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-widest">V. Jayadevan Method</p>
            </div>
          </div>
          <button onClick={close} className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 dark:bg-white/10 text-slate-500 dark:text-slate-300 hover:bg-red-100 hover:text-red-500 transition-colors">
            <X size={18} />
          </button>
        </div>

        <div className="p-6 overflow-y-auto space-y-4">
          <div className="flex items-start gap-2 bg-violet-50 dark:bg-violet-500/10 text-violet-800 dark:text-violet-200 p-3 rounded-lg text-xs border border-violet-100 dark:border-violet-500/20">
            <Info size={14} className="shrink-0 mt-0.5" />
            <span>Compute the revised target for a rain-shortened chase. Enter it into the scoring screen&rsquo;s <strong>Adjust Overs</strong> option to apply it.</span>
          </div>

          {/* Format */}
          <div>
            <label className={labelCls}>Match Format</label>
            <div className="grid grid-cols-3 gap-2">
              {FORMAT_PRESETS.map(f => (
                <button
                  key={f.id}
                  onClick={() => setPreset(f.id)}
                  className={`py-2.5 rounded-xl text-sm font-bold transition-all ${
                    preset === f.id
                      ? 'bg-violet-600 text-white shadow-md shadow-violet-500/30'
                      : 'bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-white/10'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
            {preset === 'CUSTOM' && (
              <input
                type="number" min="1" value={customOvers}
                onChange={e => setCustomOvers(e.target.value)}
                className={`${inputCls} mt-2`}
                placeholder="Total overs per side (e.g. 40)"
              />
            )}
          </div>

          {/* Team names (optional) */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Team 1 (batted first)</label>
              <input type="text" value={team1Name} onChange={e => setTeam1Name(e.target.value)} className={inputCls} placeholder="Optional" />
            </div>
            <div>
              <label className={labelCls}>Team 2 (chasing)</label>
              <input type="text" value={team2Name} onChange={e => setTeam2Name(e.target.value)} className={inputCls} placeholder="Optional" />
            </div>
          </div>

          <div>
            <label className={labelCls}>Team 1 Score (runs)</label>
            <input type="number" min="0" value={team1Score} onChange={e => setTeam1Score(e.target.value)} className={inputCls} placeholder="e.g. 180" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Overs Played</label>
              <input type="number" min="0" step="0.1" value={team1Overs} onChange={e => setTeam1Overs(e.target.value)} className={inputCls} placeholder="e.g. 20" />
            </div>
            <div>
              <label className={labelCls}>Wickets Lost</label>
              <input type="number" min="0" max="10" value={team1Wickets} onChange={e => setTeam1Wickets(e.target.value)} className={inputCls} placeholder="e.g. 6" />
            </div>
          </div>

          {/* Revised overs — manual, or derived from time lost (optional) */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Revised Overs for Team 2</label>
              <button
                type="button"
                onClick={() => setUseTimeCalc(v => !v)}
                className={`flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full transition-colors ${
                  useTimeCalc
                    ? 'bg-violet-600 text-white'
                    : 'bg-slate-100 dark:bg-white/10 text-slate-500 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-white/15'
                }`}
              >
                <Clock size={12} /> From time lost
              </button>
            </div>

            {useTimeCalc ? (
              <div className="space-y-2">
                <input
                  type="number" min="0" value={minutesLost}
                  onChange={e => setMinutesLost(e.target.value)}
                  className={inputCls}
                  placeholder="Minutes lost (e.g. 45)"
                />
                <div className="flex items-center justify-between px-1 text-xs text-slate-500 dark:text-slate-400">
                  <span>Rate: {minsPerOver} min/over</span>
                  {timeCalc && (
                    <span className="font-bold text-violet-600 dark:text-violet-300">
                      −{timeCalc.oversLost} ov → {timeCalc.revisedOvers} overs
                    </span>
                  )}
                </div>
              </div>
            ) : (
              <input type="number" min="1" step="1" value={revisedOvers} onChange={e => setRevisedOvers(e.target.value)} className={inputCls} placeholder="e.g. 15" />
            )}
          </div>

          {result ? (
            <div className="mt-2 p-5 rounded-2xl bg-gradient-to-br from-violet-600 to-violet-800 text-white shadow-xl shadow-violet-500/20">
              <div className="flex items-center gap-1.5 text-[11px] font-black uppercase tracking-widest text-violet-200 mb-3">
                <Sparkles size={13} /> VJD Result
              </div>
              <div className="flex items-end justify-between mb-4">
                <div>
                  <div className="text-[11px] font-semibold uppercase tracking-wider text-violet-200">Revised Target</div>
                  <div className="text-5xl font-black leading-none mt-1">{result.revisedTarget}</div>
                </div>
                <div className="text-right">
                  <div className="text-[11px] font-semibold uppercase tracking-wider text-violet-200">Par Score</div>
                  <div className="text-2xl font-black leading-none mt-1">{result.parScore}</div>
                </div>
              </div>
              <div className="bg-white/10 rounded-xl p-3 text-sm font-bold leading-relaxed">
                {team2Name || 'Team 2'} need <strong className="text-white">{result.revisedTarget}</strong> runs
                in <strong className="text-white">{result.revOvers}</strong> overs
                with <strong className="text-white">10</strong> wickets in hand
                <span className="block text-xs font-semibold text-violet-200 mt-1">
                  Max {maxBowlerOvers} over{maxBowlerOvers !== 1 ? 's' : ''}/bowler · Full match {maxOvers} overs/side
                </span>
              </div>
              <div className="border-t border-white/20 mt-3 pt-3 grid grid-cols-2 gap-2 text-xs text-violet-100">
                <span>Team 1 resources: <strong className="text-white">{result.r1}%</strong></span>
                <span className="text-right">Team 2 resources: <strong className="text-white">{result.r2}%</strong></span>
              </div>
              <button
                onClick={handleShare}
                disabled={sharing}
                className="w-full mt-4 bg-white/15 hover:bg-white/25 backdrop-blur text-white font-bold py-3 rounded-xl transition-colors flex items-center justify-center gap-2 disabled:opacity-60"
              >
                {sharing ? (<><ImageIcon size={16} className="animate-pulse" /> Preparing image…</>)
                  : shared ? (<><CheckCircle2 size={16} /> Shared!</>)
                  : navigator.share ? (<><Share2 size={16} /> Share as image</>)
                  : (<><ImageIcon size={16} /> Download image</>)}
              </button>
            </div>
          ) : (
            <div className="mt-2 p-4 rounded-2xl border border-dashed border-slate-200 dark:border-white/10 text-center text-xs text-slate-400 dark:text-slate-500">
              Fill in all fields to see the revised target.
            </div>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
}
