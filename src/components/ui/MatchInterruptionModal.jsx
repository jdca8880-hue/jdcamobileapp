import React, { useState, useMemo } from 'react';
import { X, Calculator, ShieldAlert, AlertCircle, Clock } from 'lucide-react';
import { api } from '../../lib/api';

export default function MatchInterruptionModal({ 
  isOpen, 
  onClose, 
  activeMatch, 
  tournament, 
  innings, 
  onApplyRevisedOvers,
  onEndMatchNow 
}) {
  const [interruptionType, setInterruptionType] = useState('DELAY_FIRST_INNINGS'); // DELAY_FIRST_INNINGS, INTERRUPT_SECOND_INNINGS, MULTI_DAY, END_NOW
  const [totalTimeLost, setTotalTimeLost] = useState(0);
  const [extraTime, setExtraTime] = useState(0);
  const [intervalTimeMadeUp, setIntervalTimeMadeUp] = useState(0);

  // Multi-day specific
  const [resumesPriorToLastHour, setResumesPriorToLastHour] = useState(true);

  if (!isOpen || !activeMatch) return null;

  const isMen = tournament?.gender !== 'Women'; // Default to men if not specified
  const format = tournament?.format || activeMatch?.match_format || 'T20';

  // Constants
  const isT20 = format === 'T20' || format === 'T10'; // Assuming T10 might use T20 rates or just handle T20 explicitly
  const isOneDay = format === 'ODI' || format === 'One Day' || format === '50 Overs';
  const isMultiDay = format === 'TEST' || format === 'Multi Day' || format === 'Days';

  const divisor = isT20 ? (isMen ? 4.25 : 3.75) : (isMen ? 4.2 : 3.8);
  const startNetPlayingTime = isT20 ? (isMen ? 170 : 150) : (isMen ? 420 : 380);

  const calculateRevised = () => {
    if (isMultiDay) {
      // Multi-day calculation (Appendix F)
      // Overs lost at 4 minutes per over
      const effectiveTimeLost = Math.max(0, totalTimeLost - extraTime);
      const oversLost = Math.floor(effectiveTimeLost / 4);
      return { oversLost, revisedOvers: null };
    } else {
      // One-Day & T20 Calculations
      const effectiveTimeLost = Math.max(0, totalTimeLost - extraTime - intervalTimeMadeUp);
      
      if (interruptionType === 'DELAY_FIRST_INNINGS') {
        const remainingPlayingTime = startNetPlayingTime - effectiveTimeLost;
        const totalOversBothTeams = remainingPlayingTime / divisor;
        const maxOversPerTeam = Math.ceil(totalOversBothTeams / 2);
        const maxOversPerBowler = Math.floor(maxOversPerTeam / 5);
        return { revisedOvers: maxOversPerTeam, maxOversPerBowler };
      } else {
        // Second innings interruption (Table 3 & 4)
        // Overs lost during interruption
        const oversLost = Math.floor(effectiveTimeLost / divisor);
        const previousMaxOvers = activeMatch.max_overs || (isT20 ? 20 : 50);
        const revisedOvers = Math.max(0, previousMaxOvers - oversLost);
        return { revisedOvers, oversLost };
      }
    }
  };

  const results = totalTimeLost > 0 ? calculateRevised() : null;

  const handleApply = () => {
    if (results && results.revisedOvers !== null) {
      onApplyRevisedOvers(results.revisedOvers);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-[20px] w-full max-w-md overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between p-5 border-b border-gray-100 bg-slate-50">
          <div>
            <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
              <ShieldAlert className="text-amber-500" size={20} /> Match Interruption
            </h2>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest mt-1">MPCA Playing Conditions</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-200 text-slate-500 hover:bg-red-100 hover:text-red-500 transition-colors">
            <X size={18} />
          </button>
        </div>
        
        <div className="p-6 overflow-y-auto">
          <div className="flex gap-2 mb-6 bg-slate-100 p-1 rounded-xl">
            <button 
              onClick={() => setInterruptionType('DELAY_FIRST_INNINGS')}
              className={`flex-1 py-2 rounded-lg text-xs font-bold transition-colors ${interruptionType === 'DELAY_FIRST_INNINGS' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500'}`}
            >
              1st Innings
            </button>
            <button 
              onClick={() => setInterruptionType('INTERRUPT_SECOND_INNINGS')}
              className={`flex-1 py-2 rounded-lg text-xs font-bold transition-colors ${interruptionType === 'INTERRUPT_SECOND_INNINGS' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500'}`}
            >
              2nd Innings
            </button>
            <button 
              onClick={() => setInterruptionType('END_NOW')}
              className={`flex-1 py-2 rounded-lg text-xs font-bold transition-colors ${interruptionType === 'END_NOW' ? 'bg-red-500 text-white shadow-sm' : 'text-slate-500'}`}
            >
              End Now
            </button>
          </div>

          {interruptionType === 'END_NOW' ? (
            <div className="text-center py-6">
              <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-slate-900 mb-2">End Match Early</h3>
              <p className="text-sm text-slate-500 mb-6">This will mark the match as Abandoned, No Result, or Draw depending on format and completion status.</p>
              <button 
                onClick={onEndMatchNow}
                className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3.5 rounded-xl shadow-lg transition-colors"
              >
                Confirm End Match
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="bg-blue-50 text-blue-800 p-3 rounded-lg text-xs mb-4 border border-blue-100">
                <p><strong>Format:</strong> {isMultiDay ? 'Multi-Day' : isT20 ? 'T20' : 'One-Day'} ({isMen ? 'Men' : 'Women'})</p>
                {!isMultiDay && <p><strong>Rate:</strong> {divisor} mins/over</p>}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1"><Clock size={14}/> Total Time Lost (Mins)</label>
                <input 
                  type="number" 
                  min="0"
                  value={totalTimeLost || ''} 
                  onChange={(e) => setTotalTimeLost(parseInt(e.target.value) || 0)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-900 focus:border-blue-500 focus:outline-none"
                  placeholder="e.g. 45"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Extra Time Available</label>
                  <input 
                    type="number" 
                    min="0"
                    value={extraTime || ''} 
                    onChange={(e) => setExtraTime(parseInt(e.target.value) || 0)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-900 focus:border-blue-500 focus:outline-none"
                    placeholder="e.g. 30"
                  />
                </div>
                {!isMultiDay && (
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Interval Made Up</label>
                    <input 
                      type="number" 
                      min="0"
                      value={intervalTimeMadeUp || ''} 
                      onChange={(e) => setIntervalTimeMadeUp(parseInt(e.target.value) || 0)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-900 focus:border-blue-500 focus:outline-none"
                      placeholder="e.g. 10"
                    />
                  </div>
                )}
              </div>

              {isMultiDay && (
                <div className="flex items-center gap-3 mt-4">
                  <input 
                    type="checkbox" 
                    id="resumesLastHour"
                    checked={!resumesPriorToLastHour}
                    onChange={(e) => setResumesPriorToLastHour(!e.target.checked)}
                    className="w-5 h-5 text-blue-600 rounded"
                  />
                  <label htmlFor="resumesLastHour" className="text-sm font-bold text-slate-700">Resumes IN the last hour</label>
                </div>
              )}

              {results && (
                <div className="mt-6 p-4 bg-emerald-50 border border-emerald-200 rounded-xl">
                  <h4 className="text-xs font-black uppercase text-emerald-800 tracking-wider mb-2 flex items-center gap-1"><Calculator size={14}/> Calculated Output</h4>
                  
                  {isMultiDay ? (
                    <p className="text-emerald-900 text-sm font-medium">Overs Lost: <strong className="text-lg">{results.oversLost}</strong> overs (at 4 mins/over)</p>
                  ) : interruptionType === 'DELAY_FIRST_INNINGS' ? (
                    <div>
                      <p className="text-emerald-900 text-sm font-medium flex justify-between">Revised Max Overs: <strong className="text-lg">{results.revisedOvers}</strong></p>
                      <p className="text-emerald-900 text-sm font-medium flex justify-between">Max Overs/Bowler: <strong>{results.maxOversPerBowler}</strong></p>
                    </div>
                  ) : (
                    <div>
                      <p className="text-emerald-900 text-sm font-medium flex justify-between">Overs Lost: <strong>{results.oversLost}</strong></p>
                      <p className="text-emerald-900 text-sm font-medium flex justify-between">Revised Max Overs: <strong className="text-lg">{results.revisedOvers}</strong></p>
                    </div>
                  )}
                </div>
              )}

              <button 
                onClick={handleApply}
                disabled={!results || results.revisedOvers === null}
                className="w-full mt-6 bg-slate-900 hover:bg-slate-800 text-white font-bold py-3.5 rounded-xl transition-colors disabled:opacity-50"
              >
                Apply Revised Overs
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
