import React, { useMemo, useEffect, useState } from 'react';
import { Trophy, ArrowRight, Newspaper, ShieldCheck, Lock, CheckCircle2, Trash2 } from 'lucide-react';
import { useCricket } from '../../context/CricketContext';
import { api } from '../../lib/api';
import { syncService } from '../../services/SyncService';
import MatchScorecard from '../ui/MatchScorecard';
import MatchMediaReport from '../ui/MatchMediaReport';
import { calculateMatchHighlights } from '../../engine/matchSummaryEngine';

export default function MatchResultScreen() {
  const { matches = [], activeMatchId, navigateTo, userRole, resetScoringSession } = useCricket();
  const [matchData, setMatchData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedMotm, setSelectedMotm] = useState('');
  const [isAssigning, setIsAssigning] = useState(false);
  const [isLocking, setIsLocking] = useState(false);
  const [syncStatus, setSyncStatus] = useState({ isSyncing: false, pendingCount: 0, initialCount: 0 });
  const [isDeleting, setIsDeleting] = useState(false);
  const [customResultText, setCustomResultText] = useState('');

  useEffect(() => {
    async function fetchReport() {
      try {
        const targetId = activeMatchId || matches.find(m => ['COMPLETED','FINISHED'].includes(m.status))?.id || matches[0]?.id;
        if (!targetId) {
          setLoading(false);
          return;
        }
        const data = await api.getMatchScorecard(targetId);
        setMatchData(data);
        if (data.manOfTheMatch) {
           setSelectedMotm(data.manOfTheMatch.id);
        }
        setCustomResultText(data.resultText || data.result || 'Match Completed');
      } catch (err) {
        console.error("Failed to load match scorecard", err);
      } finally {
        setLoading(false);
      }
    }
    fetchReport();
  }, [activeMatchId, matches]);

  const highlights = useMemo(() => calculateMatchHighlights(matchData || {}), [matchData]);

  const allMatchPlayers = useMemo(() => {
    if (!matchData || !matchData.scorecard) return [];
    
    const hTeam = matchData.scorecard.home_team || {};
    const aTeam = matchData.scorecard.away_team || {};
    const hBatting = hTeam.batting || [];
    const aBatting = aTeam.batting || [];

    const tA = hBatting.map(b => ({ id: b.id, name: b.name }));
    const tB = aBatting.map(b => ({ id: b.id, name: b.name }));
    
    return [...tA, ...tB].filter((v, i, a) => a.findIndex(t => (t.id === v.id)) === i);
  }, [matchData]);

  if (loading) {
    return <div className="flex items-center justify-center h-screen bg-slate-50">
      <div className="w-8 h-8 border-4 border-cobalt border-t-transparent rounded-full animate-spin"></div>
    </div>;
  }

  if (!matchData) return null;

  const canAssignMotm = ['SUPER_ADMIN', 'DISTRICT_ADMIN', 'SCORER'].includes(userRole);
  const isMatchPermanentlyLocked = matchData.status === 'COMPLETED' && (!activeMatchId || activeMatchId !== matchData.id);

  const handleAssignMotm = async (e) => {
    const playerId = e.target.value;
    setSelectedMotm(playerId);
    if (playerId && matchData) {
      setIsAssigning(true);
      try {
        await api.assignManOfTheMatch(matchData.id, playerId);
        const updatedData = await api.getMatchScorecard(matchData.id);
        setMatchData(updatedData);
      } catch (err) {
        console.error("Failed to assign MotM:", err);
        alert("Failed to assign Man of the Match.");
      } finally {
        setIsAssigning(false);
      }
    }
  };

  const handleFinalEndAndLock = async () => {
    if (syncService.pendingCount > 0) {
      if (!window.confirm(`There are still ${syncService.pendingCount} deliveries waiting to sync. Do you want to sync them now before locking the match?`)) {
        return;
      }
      
      setIsLocking(true);
      setSyncStatus({ isSyncing: true, pendingCount: syncService.pendingCount, initialCount: syncService.pendingCount });
      syncService.processQueue();
      
      const waitForSync = () => new Promise(resolve => {
         let backoffAttempts = 0;
         const check = () => {
            if (syncService.pendingCount === 0) {
               resolve(0);
            } else if (!syncService.isOnline) {
               resolve(syncService.pendingCount);
            } else {
               setSyncStatus(prev => ({ ...prev, pendingCount: syncService.pendingCount }));
               
               // If it backed off due to a transient error, force a retry periodically
               if (!syncService.syncInProgress) {
                 backoffAttempts++;
                 if (backoffAttempts > 5) {
                   syncService.forceSync();
                   backoffAttempts = 0;
                 }
               } else {
                 backoffAttempts = 0;
               }
               
               setTimeout(check, 1000);
            }
         };
         check();
      });

      const finalCount = await waitForSync();
      setSyncStatus({ isSyncing: false, pendingCount: finalCount, initialCount: 0 });

      if (finalCount > 0) {
         setIsLocking(false);
         alert(`Sync failed or paused. ${finalCount} deliveries remain. Please check your network and try again.`);
         return;
      }
    }
    
    if (!window.confirm("Are you sure you want to permanently lock this match? All match statistics, scores, and player awards will be officially sealed, and the scorer screen will be refreshed.")) {
      setIsLocking(false);
      return;
    }

    setIsLocking(true);
    try {
      if (selectedMotm) {
        await api.assignManOfTheMatch(matchData.id, selectedMotm);
      }
      const finalResultText = customResultText.trim() || 'Match Completed';
      await api.finalizeMatch(
        matchData.id, 
        matchData.winner_team_id || null, 
        matchData.result_margin || null, 
        finalResultText, 
        selectedMotm || null
      );
      await resetScoringSession();
      alert("Match has been successfully finalized and permanently locked! Scorer console is refreshed and ready.");
      navigateTo('matches');
    } catch (err) {
      console.error("Failed to finalize and lock match:", err);
      alert("Error locking match: " + (err.message || 'Please check network'));
    } finally {
      setIsLocking(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this match? It will be moved to the Recycle Bin.")) return;
    
    setIsDeleting(true);
    try {
      await api.deleteMatch(matchData.id);
      alert('Match moved to Recycle Bin.');
      navigateTo('matches');
    } catch (err) {
      console.error(err);
      alert(err.message || 'Failed to delete match.');
    } finally {
      setIsDeleting(false);
    }
  };

  return <div className="match-result-page matches-directory-page pb-24 relative">
    <div className="result-hero-light relative">
      {(userRole === 'SUPER_ADMIN' || userRole === 'DISTRICT_ADMIN' || userRole === 'SCORER') && (
        <button
          onClick={handleDelete}
          disabled={isDeleting}
          className="absolute top-4 right-4 w-9 h-9 flex items-center justify-center rounded-full bg-rose-500/20 text-rose-300 hover:bg-rose-500/40 hover:text-white transition-colors cursor-pointer disabled:opacity-50 border border-rose-500/30 z-10"
          title="Delete Match"
        >
          <Trash2 size={16} strokeWidth={2.5} />
        </button>
      )}
      <div><span className="result-hero-light__kicker"><Trophy size={14}/> OFFICIAL MATCH RESULT</span><h1>{matchData.resultText || matchData.result || 'Match completed'}</h1><p>{matchData.tournament || 'JDCA Fixture'} • {matchData.venue || 'JDCA Ground'} • {matchData.date || 'Match Day'}</p></div>
      <div className="result-hero-light__scores"><span>{matchData.home_team?.name}</span><strong>{matchData.home_team?.score || '-'}</strong><small>{matchData.home_team?.overs || ''}</small><i>VS</i><span>{matchData.away_team?.name}</span><strong>{matchData.away_team?.score || '-'}</strong><small>{matchData.away_team?.overs || ''}</small></div>
    </div>

    <div className="result-section"><div className="section-kicker"><Trophy size={15}/> COMPLETE SCORECARD</div><MatchScorecard match={matchData}/></div>

    <div className="result-section"><div className="section-kicker"><ShieldCheck size={15}/> MATCH HIGHLIGHTS</div><div className="result-highlight-row">
      <div><small>TOP BATTER</small><b>{highlights.topBatter?.name || '-'}</b><span>{highlights.topBatter?.stat || 'Derived from scorecard'}</span></div>
      <div><small>TOP BOWLER</small><b>{highlights.topBowler?.name || '-'}</b><span>{highlights.topBowler?.stat || 'Derived from scorecard'}</span></div>
      <div><small>BEST PARTNERSHIP</small><b>{highlights.bestPartnership?.names || '-'}</b><span>{highlights.bestPartnership?.stat || 'Derived from scorecard'}</span></div>
      <div>
        <small>PLAYER OF THE MATCH</small>
        {canAssignMotm ? (
          <select 
            value={selectedMotm} 
            onChange={handleAssignMotm}
            disabled={isAssigning}
            className="mt-1 w-full text-xs font-bold bg-white border border-slate-200 rounded-lg px-2 py-1 outline-none focus:border-cobalt"
          >
            <option value="">-- Select Player --</option>
            {allMatchPlayers.map(p => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
        ) : (
          <>
            <b>{highlights.playerOfMatch?.name || matchData.manOfTheMatch?.name || 'Not yet awarded'}</b>
            <span>{highlights.playerOfMatch?.name ? 'Official award' : 'Pending official selection'}</span>
          </>
        )}
      </div>
      <div>
        <small>RESULT</small>
        {canAssignMotm ? (
          <input 
            type="text" 
            value={customResultText} 
            onChange={(e) => setCustomResultText(e.target.value)}
            disabled={isLocking}
            className="mt-1 w-full text-xs font-bold bg-white border border-slate-200 rounded-lg px-2 py-1 outline-none focus:border-cobalt"
            placeholder="e.g. JBP won by 4 wickets"
          />
        ) : (
          <>
            <b>{matchData.resultText || matchData.result || 'Match completed'}</b>
            <span>Official Final Status</span>
          </>
        )}
      </div>
    </div></div>

    <div className="result-section"><div className="section-kicker"><Newspaper size={15}/> MEDIA REPORT</div><MatchMediaReport match={matchData}/></div>

    {canAssignMotm && (
      <div className="result-section">
        <div className="section-kicker"><Lock size={15}/> OFFICIAL MATCH CLOSURE & LOCK</div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-black text-slate-900">Official Match Finalization</h3>
                {isMatchPermanentlyLocked ? (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[11px] font-black uppercase tracking-wider border border-emerald-200">
                    <CheckCircle2 size={12} /> Permanently Locked
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-700 text-[11px] font-black uppercase tracking-wider border border-amber-200">
                    <Lock size={12} /> Ready for Final End
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 mt-1 max-w-xl">
                {isMatchPermanentlyLocked
                  ? 'This match has been officially concluded and permanently locked in the JDCA registry.'
                  : 'Review the score, winners, and assign Player of the Match above. Clicking "Final End Match" will permanently lock this fixture and refresh the scorer screen for next games.'}
              </p>
            </div>

            {!isMatchPermanentlyLocked && (
              <button
                onClick={handleFinalEndAndLock}
                disabled={isLocking}
                className="px-6 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95 disabled:opacity-50 shrink-0 relative overflow-hidden"
              >
                {syncStatus.isSyncing && (
                  <div 
                    className="absolute top-0 left-0 h-full bg-emerald-700/50 transition-all duration-500" 
                    style={{ width: `${Math.max(5, 100 - (syncStatus.pendingCount / syncStatus.initialCount) * 100)}%` }}
                  />
                )}
                <div className="flex items-center gap-2 relative z-10">
                  {syncStatus.isSyncing ? (
                    <div className="w-4 h-4 rounded-full border-2 border-t-transparent border-white animate-spin" />
                  ) : (
                    <Lock size={16} />
                  )}
                  <span>
                    {syncStatus.isSyncing 
                      ? `Syncing ${syncStatus.pendingCount} left...` 
                      : (isLocking ? 'Locking Match...' : 'Final End Match & Permanently Lock')}
                  </span>
                </div>
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
              <span className="font-bold text-slate-400 block mb-0.5 uppercase tracking-wider text-[10px]">Verified Result</span>
              <span className="font-extrabold text-slate-900">{customResultText || 'Match Completed'}</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
              <span className="font-bold text-slate-400 block mb-0.5 uppercase tracking-wider text-[10px]">Player of the Match</span>
              <span className="font-extrabold text-slate-900">{allMatchPlayers.find(p => p.id === selectedMotm)?.name || matchData.manOfTheMatch?.name || 'Not yet selected'}</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
              <span className="font-bold text-slate-400 block mb-0.5 uppercase tracking-wider text-[10px]">Scorer Screen Status</span>
              <span className={`font-extrabold ${isMatchPermanentlyLocked ? 'text-emerald-600' : 'text-amber-600'}`}>
                {isMatchPermanentlyLocked ? 'Refreshed & Ready' : 'Awaiting Final Lock'}
              </span>
            </div>
          </div>
        </div>
      </div>
    )}

    <div className="result-actions">
      <button onClick={() => navigateTo('matches')} className="btn-secondary">Back to Matches Directory</button>
      <button onClick={() => navigateTo('scorecard')} className="btn-primary">Open Official Scorecard <ArrowRight size={15}/></button>
    </div>
  </div>;
}
