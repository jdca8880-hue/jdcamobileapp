import React, { useState, useMemo } from 'react';
import { X, Calculator, ShieldAlert, Clock } from 'lucide-react';
import { formatOvers } from '../../engine/cricketStateMachine';

export default function MatchInterruptionModal({
  isOpen,
  onClose,
  activeMatch,
  tournament,
  innings,
  currentRuns,
  currentWickets,
  currentBalls,
  target,
  matchSetup,
  totalMatchOvers,
  onApplyRevisedOvers,
  onEndMatchEarly,
}) {
  const [tab, setTab] = useState('MANUAL_ADJUST');
  const [totalTimeLost, setTotalTimeLost] = useState(0);
  const [extraTime, setExtraTime] = useState(0);
  const [intervalTimeMadeUp, setIntervalTimeMadeUp] = useState(0);

  // Manual adjust inputs
  const [manualOvers, setManualOvers] = useState('');
  const [manualTarget, setManualTarget] = useState('');

  if (!isOpen || !activeMatch) return null;

  const isMen = tournament?.gender !== 'Women';
  const format = tournament?.format || activeMatch?.match_format || 'T20';
  const isT20 = format === 'T20' || format === 'T10';
  const isOneDay = format === 'ODI' || format === 'One Day' || format === '50 Overs';
  const maxOvers = totalMatchOvers || activeMatch?.max_overs || (isT20 ? 20 : 50);

  const teamAName = matchSetup?.teamA || activeMatch?.home_team?.name || 'Team A';
  const teamBName = matchSetup?.teamB || activeMatch?.away_team?.name || 'Team B';

  const divisor = isT20 ? (isMen ? 4.25 : 3.75) : (isMen ? 4.2 : 3.8);
  const startNetPlayingTime = isT20 ? (isMen ? 170 : 150) : (isMen ? 420 : 380);

  // Determine which team is currently batting
  const isFirstInnings = innings === 1 || innings === 3;
  const battingTeamName = isFirstInnings ? teamAName : teamBName;
  const bowlingTeamName = isFirstInnings ? teamBName : teamAName;

  const oversPlayed = formatOvers(currentBalls || 0);

  // ── MPCA time-loss calculator ───────────────────────────────────────────
  const calculateRevised = () => {
    const effectiveTimeLost = Math.max(0, totalTimeLost - extraTime - intervalTimeMadeUp);
    if (tab === 'DELAY_FIRST') {
      const remainingPlayingTime = startNetPlayingTime - effectiveTimeLost;
      const totalOversBothTeams = remainingPlayingTime / divisor;
      const maxOversPerTeam = Math.ceil(totalOversBothTeams / 2);
      const maxOversPerBowler = Math.floor(maxOversPerTeam / 5);
      return { revisedOvers: maxOversPerTeam, maxOversPerBowler };
    } else {
      const oversLost = Math.floor(effectiveTimeLost / divisor);
      const revisedOvers = Math.max(0, maxOvers - oversLost);
      return { revisedOvers, oversLost };
    }
  };
  const timeLossResults = totalTimeLost > 0 ? calculateRevised() : null;

  // ── End Match logic ─────────────────────────────────────────────────────
  const endMatchInfo = useMemo(() => {
    if (isFirstInnings) {
      return {
        canDetermineWinner: false,
        resultText: `No Result — match ended after ${oversPlayed} overs (${battingTeamName} ${currentRuns || 0}/${currentWickets || 0})`,
        summary: `Match ended during 1st innings. ${battingTeamName} were ${currentRuns || 0}/${currentWickets || 0} after ${oversPlayed} overs. No result can be determined.`,
      };
    }

    const t = target || 0;
    const r = currentRuns || 0;
    const w = currentWickets || 0;
    const firstInningsScore = t > 0 ? t - 1 : 0;

    let winnerId = null;
    let margin = '';
    let resultText = '';

    if (t > 0 && r >= t) {
      const battingTId = matchSetup?.teamAId === activeMatch?.home_team_id
        ? (isFirstInnings ? matchSetup?.teamAId : matchSetup?.teamBId)
        : (isFirstInnings ? matchSetup?.teamBId : matchSetup?.teamAId);
      winnerId = battingTId;
      const wktsLeft = 10 - w;
      margin = `${wktsLeft} wickets`;
      resultText = `${battingTeamName} won by ${wktsLeft} wicket${wktsLeft !== 1 ? 's' : ''} (match ended at ${oversPlayed} ov)`;
    } else if (r < firstInningsScore) {
      const bowlingTId = matchSetup?.teamAId === activeMatch?.home_team_id
        ? (isFirstInnings ? matchSetup?.teamBId : matchSetup?.teamAId)
        : (isFirstInnings ? matchSetup?.teamAId : matchSetup?.teamBId);
      winnerId = bowlingTId;
      const runsDiff = firstInningsScore - r;
      margin = `${runsDiff} runs`;
      resultText = `${bowlingTeamName} won by ${runsDiff} run${runsDiff !== 1 ? 's' : ''} (match ended at ${oversPlayed} ov)`;
    } else if (r === firstInningsScore) {
      resultText = `Match tied — both teams scored ${r} (match ended at ${oversPlayed} ov)`;
      margin = 'Tie';
    } else {
      resultText = `Match ended early at ${oversPlayed} overs — ${battingTeamName} ${r}/${w}`;
    }

    return {
      canDetermineWinner: true,
      winnerId,
      margin,
      resultText,
      summary: `${bowlingTeamName}: ${firstInningsScore} • ${battingTeamName}: ${r}/${w} (${oversPlayed} ov)`,
    };
  }, [innings, currentRuns, currentWickets, currentBalls, target, matchSetup, activeMatch, battingTeamName, bowlingTeamName, oversPlayed, isFirstInnings]);

  // ── Tab definitions ─────────────────────────────────────────────────────
  const tabs = [
    { id: 'MANUAL_ADJUST', label: 'Adjust Overs' },
    { id: 'DELAY_FIRST', label: '1st Inn Calc' },
    { id: 'INTERRUPT_SECOND', label: '2nd Inn Calc' },
    { id: 'END_MATCH', label: 'End Match', color: 'bg-red-500 text-white' },
  ];

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-[20px] w-full max-w-md overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-gray-100 bg-slate-50">
          <div>
            <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
              <ShieldAlert className="text-amber-500" size={20} /> Match Interruption
            </h2>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest mt-1">
              {battingTeamName} {currentRuns || 0}/{currentWickets || 0} ({oversPlayed} ov)
            </p>
          </div>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-200 text-slate-500 hover:bg-red-100 hover:text-red-500 transition-colors">
            <X size={18} />
          </button>
        </div>

        <div className="p-6 overflow-y-auto">
          {/* Tabs */}
          <div className="flex gap-1 mb-6 bg-slate-100 p-1 rounded-xl overflow-x-auto no-scrollbar">
            {tabs.map(t => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`flex-shrink-0 px-3 py-2 rounded-lg text-xs font-bold transition-colors ${
                  tab === t.id
                    ? (t.color || 'bg-white shadow-sm text-slate-900')
                    : 'text-slate-500'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* ═══ MPCA TIME-LOSS TABS (1st & 2nd Innings) ═══ */}
          {(tab === 'DELAY_FIRST' || tab === 'INTERRUPT_SECOND') && (
            <div className="space-y-4">
              <div className="bg-blue-50 text-blue-800 p-3 rounded-lg text-xs mb-4 border border-blue-100">
                <p><strong>Format:</strong> {isT20 ? 'T20' : isOneDay ? 'One-Day' : 'Multi-Day'} ({isMen ? 'Men' : 'Women'})</p>
                <p><strong>Rate:</strong> {divisor} mins/over</p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1"><Clock size={14} /> Total Time Lost (Mins)</label>
                <input
                  type="number" min="0"
                  value={totalTimeLost || ''}
                  onChange={e => setTotalTimeLost(parseInt(e.target.value) || 0)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-900 focus:border-blue-500 focus:outline-none"
                  placeholder="e.g. 45"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Extra Time Available</label>
                  <input
                    type="number" min="0"
                    value={extraTime || ''}
                    onChange={e => setExtraTime(parseInt(e.target.value) || 0)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-900 focus:border-blue-500 focus:outline-none"
                    placeholder="e.g. 30"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Interval Made Up</label>
                  <input
                    type="number" min="0"
                    value={intervalTimeMadeUp || ''}
                    onChange={e => setIntervalTimeMadeUp(parseInt(e.target.value) || 0)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-900 focus:border-blue-500 focus:outline-none"
                    placeholder="e.g. 10"
                  />
                </div>
              </div>

              {timeLossResults && (
                <div className="mt-6 p-4 bg-emerald-50 border border-emerald-200 rounded-xl">
                  <h4 className="text-xs font-black uppercase text-emerald-800 tracking-wider mb-2 flex items-center gap-1"><Calculator size={14} /> Calculated Output</h4>
                  {tab === 'DELAY_FIRST' ? (
                    <div>
                      <p className="text-emerald-900 text-sm font-medium flex justify-between">Revised Max Overs: <strong className="text-lg">{timeLossResults.revisedOvers}</strong></p>
                      <p className="text-emerald-900 text-sm font-medium flex justify-between">Max Overs/Bowler: <strong>{timeLossResults.maxOversPerBowler}</strong></p>
                    </div>
                  ) : (
                    <div>
                      <p className="text-emerald-900 text-sm font-medium flex justify-between">Overs Lost: <strong>{timeLossResults.oversLost}</strong></p>
                      <p className="text-emerald-900 text-sm font-medium flex justify-between">Revised Max Overs: <strong className="text-lg">{timeLossResults.revisedOvers}</strong></p>
                    </div>
                  )}
                </div>
              )}

              <button
                onClick={() => {
                  if (timeLossResults && timeLossResults.revisedOvers !== null) {
                    onApplyRevisedOvers(timeLossResults.revisedOvers);
                    onClose();
                  }
                }}
                disabled={!timeLossResults || timeLossResults.revisedOvers === null}
                className="w-full mt-6 bg-slate-900 hover:bg-slate-800 text-white font-bold py-3.5 rounded-xl transition-colors disabled:opacity-50"
              >
                Apply Revised Overs
              </button>
            </div>
          )}

          {/* ═══ MANUAL ADJUST / INTERRUPT TAB ═══ */}
          {tab === 'MANUAL_ADJUST' && (
            <div className="space-y-4">
              <div className="bg-amber-50 text-amber-800 p-3 rounded-lg text-xs mb-4 border border-amber-100">
                Set the revised overs for the match. Compute the revised target in the <strong>VJD Calculator</strong> (open it from the menu drawer), then enter the result below to update the chase target.
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Revised Match Overs</label>
                <input
                  type="number" min="1"
                  value={manualOvers}
                  onChange={e => setManualOvers(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-900 focus:border-blue-500 focus:outline-none"
                  placeholder="e.g. 15"
                />
              </div>

              {!isFirstInnings && (
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Revised Target (from VJD / DLS)</label>
                  <input
                    type="number" min="1"
                    value={manualTarget}
                    onChange={e => setManualTarget(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-900 focus:border-blue-500 focus:outline-none"
                    placeholder={`Current target: ${target || 'not set'}`}
                  />
                  <p className="text-xs text-slate-400 mt-1">Leave blank to keep the current target unchanged.</p>
                </div>
              )}

              <button
                onClick={() => {
                  const overs = parseInt(manualOvers, 10);
                  const newTarget = manualTarget ? parseInt(manualTarget, 10) : null;
                  if (overs > 0) {
                    onApplyRevisedOvers(overs, newTarget);
                    onClose();
                  }
                }}
                disabled={!manualOvers || parseInt(manualOvers, 10) <= 0}
                className="w-full mt-6 bg-slate-900 hover:bg-slate-800 text-white font-bold py-3.5 rounded-xl transition-colors disabled:opacity-50"
              >
                Apply Revised Overs{manualTarget ? ' & Target' : ''}
              </button>
            </div>
          )}

          {/* ═══ END MATCH TAB ═══ */}
          {tab === 'END_MATCH' && (
            <div className="space-y-4">
              <div className="bg-red-50 text-red-800 p-3 rounded-lg text-xs border border-red-100">
                End the match at the current state. The final scorecard will show the actual overs played and the correct result.
              </div>

              {/* Current score summary */}
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                <h4 className="text-xs font-black uppercase text-slate-500 tracking-wider">Current Match State</h4>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-bold text-slate-700">{battingTeamName}</span>
                  <span className="text-lg font-black text-slate-900">{currentRuns || 0}/{currentWickets || 0}</span>
                </div>
                <div className="flex justify-between text-xs text-slate-500">
                  <span>Overs: {oversPlayed} / {maxOvers}</span>
                  <span>Innings: {innings}</span>
                </div>
                {target > 0 && !isFirstInnings && (
                  <div className="flex justify-between text-xs text-slate-500">
                    <span>Target: {target}</span>
                    <span>Need: {Math.max(0, target - (currentRuns || 0))} from {maxOvers * 6 - (currentBalls || 0)} balls</span>
                  </div>
                )}
              </div>

              {/* Result preview */}
              <div className={`p-4 rounded-xl border ${endMatchInfo.canDetermineWinner ? 'bg-emerald-50 border-emerald-200' : 'bg-amber-50 border-amber-200'}`}>
                <h4 className={`text-xs font-black uppercase tracking-wider mb-2 ${endMatchInfo.canDetermineWinner ? 'text-emerald-800' : 'text-amber-800'}`}>
                  Result Preview
                </h4>
                <p className={`text-sm font-bold ${endMatchInfo.canDetermineWinner ? 'text-emerald-900' : 'text-amber-900'}`}>
                  {endMatchInfo.resultText}
                </p>
                <p className="text-xs text-slate-500 mt-1">{endMatchInfo.summary}</p>
              </div>

              <button
                onClick={() => {
                  if (window.confirm(`End this match now?\n\n${endMatchInfo.resultText}`)) {
                    onEndMatchEarly({
                      winnerId: endMatchInfo.winnerId || null,
                      margin: endMatchInfo.margin || null,
                      resultText: endMatchInfo.resultText,
                      oversPlayed,
                    });
                  }
                }}
                className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3.5 rounded-xl shadow-lg transition-colors"
              >
                Confirm End Match
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
