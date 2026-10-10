import React, { useMemo, useEffect, useState } from 'react';
import { Trophy, ArrowRight, Newspaper, ShieldCheck, Lock, CheckCircle2, Trash2, WifiOff, Database } from 'lucide-react';
import { useCricket } from '../../context/CricketContext';
import { api } from '../../lib/api';
import { syncService } from '../../services/SyncService';
import MatchScorecard from '../ui/MatchScorecard';
import MatchMediaReport from '../ui/MatchMediaReport';
import { calculateMatchHighlights } from '../../engine/matchSummaryEngine';

export default function MatchResultScreen() {
  const { matches = [], setMatches, refreshAdminData, activeMatchId, navigateTo, userRole, resetScoringSession } = useCricket();
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
        let targetId = activeMatchId || matches.find(m => ['COMPLETED','FINISHED'].includes(m.status))?.id || matches[0]?.id;
        
        // If not found in memory (e.g. cold start offline), look in local Dexie database
        if (!targetId) {
          try {
            const { db } = await import('../../lib/db');
            const localMatches = await db.matches.toArray();
            if (localMatches && localMatches.length > 0) {
              const fin = localMatches.find(m => ['COMPLETED', 'FINISHED'].includes(m.status)) || localMatches[0];
              targetId = fin?.id;
            }
          } catch (dexieLookupErr) {
            console.warn('[MatchResultScreen] Dexie match target lookup error:', dexieLookupErr);
          }
        }

        if (!targetId) {
          setLoading(false);
          return;
        }

        let data = null;
        try {
          data = await api.getMatchScorecard(targetId);
        } catch (apiErr) {
          console.warn('[MatchResultScreen] api.getMatchScorecard failed, falling back to direct Dexie load:', apiErr);
        }

        // Direct fallback to Dexie database if api returned null or failed
        if (!data) {
          try {
            const { db } = await import('../../lib/db');
            const localMatch = await db.matches.get(targetId) || (await db.matches.toArray()).find(m => String(m.id) === String(targetId));
            if (localMatch) {
              let hTeam = localMatch.home_team;
              let aTeam = localMatch.away_team;
              if ((!hTeam || !hTeam.name) && (localMatch.home_team_id || localMatch.team_a_id)) {
                const t = await db.teams.get(localMatch.home_team_id || localMatch.team_a_id);
                if (t) hTeam = { id: t.id, name: t.name, score: localMatch.home_team?.score || '-' };
              }
              if ((!aTeam || !aTeam.name) && (localMatch.away_team_id || localMatch.team_b_id)) {
                const t = await db.teams.get(localMatch.away_team_id || localMatch.team_b_id);
                if (t) aTeam = { id: t.id, name: t.name, score: localMatch.away_team?.score || '-' };
              }
              const rawRes = localMatch.result_text || localMatch.result || 'Match Completed';
              data = {
                id: localMatch.id,
                tournament: localMatch.tournament || localMatch.tournament_name || 'JDCA Tournament',
                venue: localMatch.venue || localMatch.venue_name || 'JDCA Ground',
                date: localMatch.date || (localMatch.scheduled_at ? new Date(localMatch.scheduled_at).toLocaleDateString() : 'Match Day'),
                resultText: rawRes,
                result: rawRes,
                status: localMatch.status || 'COMPLETED',
                winner_team_id: localMatch.winner_team_id,
                result_margin: localMatch.result_margin,
                man_of_the_match: localMatch.man_of_the_match || localMatch.playerOfMatch,
                manOfTheMatch: localMatch.man_of_the_match || localMatch.playerOfMatch,
                playerOfMatch: localMatch.playerOfMatch || localMatch.man_of_the_match,
                home_team: hTeam || { name: localMatch.team_a_name || 'Home Team', score: '-' },
                away_team: aTeam || { name: localMatch.team_b_name || 'Away Team', score: '-' },
                scorecard: localMatch.scorecard || {
                  home_team: { batting: [], bowling: [], score: hTeam?.score || '-' },
                  away_team: { batting: [], bowling: [], score: aTeam?.score || '-' }
                },
                isOfflineDexie: true
              };
            }
          } catch (dexieErr) {
            console.error('[MatchResultScreen] Direct Dexie load error:', dexieErr);
          }
        }

        if (data) {
          setMatchData(data);
          const rawMotm = data.manOfTheMatch || data.man_of_the_match || data.playerOfMatch;
          const motmObj = Array.isArray(rawMotm) ? rawMotm[0] : rawMotm;
          if (motmObj?.id) {
             setSelectedMotm(motmObj.id);
          } else if (data.man_of_the_match_id) {
             setSelectedMotm(data.man_of_the_match_id);
          }
          setCustomResultText(data.resultText || data.result || 'Match Completed');
        }
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
    const hBowling = hTeam.bowling || [];
    const aBowling = aTeam.bowling || [];

    const tA = [...hBatting, ...hBowling].map(b => ({ id: b.id, name: b.name || b.full_name }));
    const tB = [...aBatting, ...aBowling].map(b => ({ id: b.id, name: b.name || b.full_name }));
    
    return [...tA, ...tB].filter((v, i, a) => v.id && a.findIndex(t => String(t.id) === String(v.id)) === i);
  }, [matchData]);

  if (loading) {
    return <div className="flex items-center justify-center h-screen bg-slate-50 dark:bg-[#0A0A0A]">
      <div className="w-8 h-8 border-4 border-[#A3E635] border-t-transparent rounded-full animate-spin"></div>
    </div>;
  }

  if (!matchData) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">
        <Trophy size={48} className="text-slate-300 dark:text-slate-700 mb-3" />
        <h2 className="text-lg font-bold text-slate-800 dark:text-slate-200">No Final Match Data Found</h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm">
          No completed match result is currently available in the device Dexie database or network.
        </p>
        <button
          onClick={() => navigateTo('matches')}
          className="mt-4 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-sm cursor-pointer"
        >
          Back to Matches Directory
        </button>
      </div>
    );
  }

  const canAssignMotm = ['SUPER_ADMIN', 'DISTRICT_ADMIN', 'SCORER'].includes(userRole);
  const isMatchPermanentlyLocked = matchData.status === 'COMPLETED' && (!activeMatchId || activeMatchId !== matchData.id);

  const handleAssignMotm = async (e) => {
    const playerId = e.target.value;
    setSelectedMotm(playerId);
    if (playerId && matchData) {
      setIsAssigning(true);
      try {
        const res = await api.assignManOfTheMatch(matchData.id, playerId);
        const updatedData = await api.getMatchScorecard(matchData.id);
        setMatchData(updatedData);
        if (setMatches) {
          setMatches(prev => prev.map(m => String(m.id) === String(matchData.id) ? {
            ...m,
            man_of_the_match_id: playerId,
            man_of_the_match: res?.man_of_the_match || updatedData?.man_of_the_match,
            playerOfMatch: res?.man_of_the_match || updatedData?.playerOfMatch || updatedData?.man_of_the_match,
            manOfTheMatch: res?.man_of_the_match || updatedData?.manOfTheMatch || updatedData?.man_of_the_match
          } : m));
        }
        if (refreshAdminData) refreshAdminData();
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
         
         const handlePermanentError = (e) => {
            window.removeEventListener('sync-permanent-failure', handlePermanentError);
            alert("A permanent sync error occurred: " + e.detail.message + "\n\nPlease return to the Scoring screen to resolve it.");
            resolve(syncService.pendingCount);
         };
         window.addEventListener('sync-permanent-failure', handlePermanentError);

         const check = () => {
            if (syncService.pendingCount === 0) {
               window.removeEventListener('sync-permanent-failure', handlePermanentError);
               resolve(0);
            } else if (!syncService.isOnline) {
               window.removeEventListener('sync-permanent-failure', handlePermanentError);
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
         // Don't alert twice if we already alerted on permanent error, but the count logic will handle it
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
      if (setMatches) {
        setMatches(prev => prev.map(m => String(m.id) === String(matchData.id) ? {
          ...m,
          status: 'COMPLETED',
          result_text: finalResultText,
          result: finalResultText,
          man_of_the_match_id: selectedMotm || m.man_of_the_match_id,
          winner_team_id: matchData.winner_team_id || m.winner_team_id,
          result_margin: matchData.result_margin || m.result_margin
        } : m));
      }
      if (refreshAdminData) refreshAdminData();
      await resetScoringSession();
      // Stay on the result screen so the scorer can still share the final card,
      // scorecard PDF and social report. Re-fetch so it shows the locked state.
      try {
        const refreshed = await api.getMatchScorecard(matchData.id);
        if (refreshed) setMatchData(refreshed);
      } catch (refreshErr) {
        console.warn('[MatchResultScreen] Could not refresh after lock:', refreshErr);
      }
      alert(navigator.onLine
        ? "Match has been successfully finalized and permanently locked! You can still share the result and scorecard from this screen."
        : "Match has been successfully finalized and saved in Dexie database offline! It will synchronize automatically when internet returns. You can still share the result from this screen.");
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

  return <div className="match-result-page matches-directory-page pb-24 relative bg-slate-50 dark:bg-[#0A0A0A] min-h-screen text-slate-900 dark:text-[#F3F4F6]">
    <div className="result-hero-light bg-white dark:bg-[#14171A] border border-slate-200 dark:border-white/10 shadow-sm relative text-slate-900 dark:text-[#F3F4F6]">
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
      <div>
        {(!navigator.onLine || matchData?.isOfflineDexie) && (
          <div className="mb-2.5 inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-amber-500/15 border border-amber-400/30 text-amber-700 dark:text-amber-300 text-xs font-bold">
            <WifiOff size={14} className="shrink-0 text-amber-500 animate-pulse" />
            <Database size={14} className="shrink-0 text-amber-500" />
            <span>Offline Mode Active • Final result loaded from Dexie database</span>
          </div>
        )}
        <span className="result-hero-light__kicker text-[#2457D6] dark:text-[#A3E635] font-black text-xs uppercase tracking-wider flex items-center gap-1.5"><Trophy size={14}/> OFFICIAL MATCH RESULT</span>
        <h1 className="text-slate-900 dark:text-[#F3F4F6] font-black text-2xl mt-1">{matchData.resultText || matchData.result || 'Match completed'}</h1>
        <p className="text-slate-500 dark:text-[#94A3B8] text-xs mt-1">{matchData.tournament || 'JDCA Fixture'} • {matchData.venue || 'JDCA Ground'} • {matchData.date || 'Match Day'}</p>
        {(matchData.umpire || matchData.scorer) && (
          <p className="text-slate-400 dark:text-slate-500 text-[11px] mt-0.5">
            {matchData.umpire ? `Umpire: ${matchData.umpire}` : ''}
            {matchData.umpire && matchData.scorer ? ' • ' : ''}
            {matchData.scorer ? `Scorer: ${matchData.scorer}` : ''}
          </p>
        )}
      </div>
      <div className="result-hero-light__scores bg-slate-50 dark:bg-[#1E2226] border border-slate-200 dark:border-white/10 rounded-xl p-3">
        <span className="text-slate-700 dark:text-[#CBD5E1] font-bold text-xs">{matchData.home_team?.name}</span>
        <strong className="text-slate-900 dark:text-[#F3F4F6] font-black text-xl">{matchData.home_team?.score || '-'}</strong>
        <small className="text-slate-500 dark:text-[#94A3B8] text-[11px]">{matchData.home_team?.overs || ''}</small>
        <i className="text-slate-400 dark:text-slate-500 font-black not-italic text-xs">VS</i>
        <span className="text-slate-700 dark:text-[#CBD5E1] font-bold text-xs">{matchData.away_team?.name}</span>
        <strong className="text-slate-900 dark:text-[#F3F4F6] font-black text-xl">{matchData.away_team?.score || '-'}</strong>
        <small className="text-slate-500 dark:text-[#94A3B8] text-[11px]">{matchData.away_team?.overs || ''}</small>
      </div>
    </div>

    <div className="result-section bg-white dark:bg-[#14171A] border border-slate-200 dark:border-white/10 shadow-sm rounded-2xl p-4 sm:p-5 mt-4 text-slate-900 dark:text-[#F3F4F6]">
      <div className="section-kicker text-[#2457D6] dark:text-[#A3E635] flex items-center gap-1.5 font-black text-xs uppercase tracking-wider mb-3"><Trophy size={15}/> COMPLETE SCORECARD</div>
      <MatchScorecard match={matchData}/>
    </div>

    <div className="result-section bg-white dark:bg-[#14171A] border border-slate-200 dark:border-white/10 shadow-sm rounded-2xl p-4 sm:p-5 mt-4 text-slate-900 dark:text-[#F3F4F6]">
      <div className="section-kicker text-[#2457D6] dark:text-[#A3E635] flex items-center gap-1.5 font-black text-xs uppercase tracking-wider mb-3"><ShieldCheck size={15}/> MATCH HIGHLIGHTS</div>
      <div className="result-highlight-row grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="bg-slate-50 dark:bg-[#1E2226] border border-slate-200 dark:border-white/10 rounded-xl p-3">
          <small className="text-slate-400 dark:text-[#94A3B8] text-[10px] font-black uppercase tracking-wider">TOP BATTER</small>
          <b className="text-slate-900 dark:text-[#F3F4F6] font-extrabold text-sm block mt-1">{highlights.topBatter?.name || '-'}</b>
          <span className="text-slate-500 dark:text-[#CBD5E1] text-xs font-semibold block mt-0.5">{highlights.topBatter?.stat || 'Derived from scorecard'}</span>
        </div>
        <div className="bg-slate-50 dark:bg-[#1E2226] border border-slate-200 dark:border-white/10 rounded-xl p-3">
          <small className="text-slate-400 dark:text-[#94A3B8] text-[10px] font-black uppercase tracking-wider">TOP BOWLER</small>
          <b className="text-slate-900 dark:text-[#F3F4F6] font-extrabold text-sm block mt-1">{highlights.topBowler?.name || '-'}</b>
          <span className="text-slate-500 dark:text-[#CBD5E1] text-xs font-semibold block mt-0.5">{highlights.topBowler?.stat || 'Derived from scorecard'}</span>
        </div>
        <div className="bg-slate-50 dark:bg-[#1E2226] border border-slate-200 dark:border-white/10 rounded-xl p-3">
          <small className="text-slate-400 dark:text-[#94A3B8] text-[10px] font-black uppercase tracking-wider">BEST PARTNERSHIP</small>
          <b className="text-slate-900 dark:text-[#F3F4F6] font-extrabold text-sm block mt-1">{highlights.bestPartnership?.names || '-'}</b>
          <span className="text-slate-500 dark:text-[#CBD5E1] text-xs font-semibold block mt-0.5">{highlights.bestPartnership?.stat || 'Derived from scorecard'}</span>
        </div>
        <div className="bg-slate-50 dark:bg-[#1E2226] border border-slate-200 dark:border-white/10 rounded-xl p-3">
          <small className="text-slate-400 dark:text-[#94A3B8] text-[10px] font-black uppercase tracking-wider">PLAYER OF THE MATCH</small>
          {canAssignMotm ? (
            <select 
              value={selectedMotm} 
              onChange={handleAssignMotm}
              disabled={isAssigning}
              className="mt-1 w-full text-xs font-bold bg-white dark:bg-[#14171A] border border-slate-200 dark:border-white/10 text-slate-900 dark:text-[#F3F4F6] rounded-lg px-2 py-1 outline-none focus:border-[#A3E635]"
            >
              <option value="">-- Select Player --</option>
              {allMatchPlayers.map(p => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          ) : (
            <>
              <b className="text-slate-900 dark:text-[#F3F4F6] font-extrabold text-sm block mt-1">{highlights.playerOfMatch?.name || matchData.man_of_the_match?.full_name || matchData.man_of_the_match?.name || matchData.manOfTheMatch?.name || 'Not yet awarded'}</b>
              <span className="text-slate-500 dark:text-[#CBD5E1] text-xs font-semibold block mt-0.5">{highlights.playerOfMatch?.name || matchData.man_of_the_match?.full_name || matchData.man_of_the_match?.name || matchData.manOfTheMatch?.name ? 'Official award' : 'Pending official selection'}</span>
            </>
          )}
        </div>
        <div className="bg-slate-50 dark:bg-[#1E2226] border border-slate-200 dark:border-white/10 rounded-xl p-3">
          <small className="text-slate-400 dark:text-[#94A3B8] text-[10px] font-black uppercase tracking-wider">RESULT</small>
          {canAssignMotm ? (
            <input 
              type="text" 
              value={customResultText} 
              onChange={(e) => setCustomResultText(e.target.value)}
              disabled={isLocking}
              className="mt-1 w-full text-xs font-bold bg-white dark:bg-[#14171A] border border-slate-200 dark:border-white/10 text-slate-900 dark:text-[#F3F4F6] rounded-lg px-2 py-1 outline-none focus:border-[#A3E635]"
              placeholder="e.g. JBP won by 4 wickets"
            />
          ) : (
            <>
              <b className="text-slate-900 dark:text-[#F3F4F6] font-extrabold text-sm block mt-1">{matchData.resultText || matchData.result || 'Match completed'}</b>
              <span className="text-slate-500 dark:text-[#CBD5E1] text-xs font-semibold block mt-0.5">Official Final Status</span>
            </>
          )}
        </div>
      </div>
    </div>

    <div className="result-section bg-white dark:bg-[#14171A] border border-slate-200 dark:border-white/10 shadow-sm rounded-2xl p-4 sm:p-5 mt-4 text-slate-900 dark:text-[#F3F4F6]">
      <div className="section-kicker text-[#2457D6] dark:text-[#A3E635] flex items-center gap-1.5 font-black text-xs uppercase tracking-wider mb-3"><Newspaper size={15}/> MEDIA REPORT</div>
      <MatchMediaReport match={matchData}/>
    </div>

    {canAssignMotm && (
      <div className="result-section bg-white dark:bg-[#14171A] border border-slate-200 dark:border-white/10 shadow-sm rounded-2xl p-4 sm:p-5 mt-4 text-slate-900 dark:text-[#F3F4F6]">
        <div className="section-kicker text-[#2457D6] dark:text-[#A3E635] flex items-center gap-1.5 font-black text-xs uppercase tracking-wider mb-3"><Lock size={15}/> OFFICIAL MATCH CLOSURE & LOCK</div>
        <div className="bg-white dark:bg-[#14171A] p-6 rounded-2xl border border-slate-200 dark:border-white/10 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-white/10">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-black text-slate-900 dark:text-[#F3F4F6]">Official Match Finalization</h3>
                {isMatchPermanentlyLocked ? (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 text-[11px] font-black uppercase tracking-wider border border-emerald-200 dark:border-emerald-500/30">
                    <CheckCircle2 size={12} /> Permanently Locked
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 text-[11px] font-black uppercase tracking-wider border border-amber-200 dark:border-amber-500/30">
                    <Lock size={12} /> Ready for Final End
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 dark:text-[#94A3B8] mt-1 max-w-xl">
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
            <div className="p-3 bg-slate-50 dark:bg-[#1E2226] rounded-xl border border-slate-100 dark:border-white/10">
              <span className="font-bold text-slate-400 dark:text-[#94A3B8] block mb-0.5 uppercase tracking-wider text-[10px]">Verified Result</span>
              <span className="font-extrabold text-slate-900 dark:text-[#F3F4F6]">{customResultText || 'Match Completed'}</span>
            </div>
            <div className="p-3 bg-slate-50 dark:bg-[#1E2226] rounded-xl border border-slate-100 dark:border-white/10">
              <span className="font-bold text-slate-400 dark:text-[#94A3B8] block mb-0.5 uppercase tracking-wider text-[10px]">Player of the Match</span>
              <span className="font-extrabold text-slate-900 dark:text-[#F3F4F6]">{allMatchPlayers.find(p => String(p.id) === String(selectedMotm))?.name || (highlights.playerOfMatch?.name) || (typeof matchData.man_of_the_match === 'string' ? matchData.man_of_the_match : (matchData.man_of_the_match?.full_name || matchData.man_of_the_match?.name)) || matchData.manOfTheMatch?.name || 'Not yet selected'}</span>
            </div>
            <div className="p-3 bg-slate-50 dark:bg-[#1E2226] rounded-xl border border-slate-100 dark:border-white/10">
              <span className="font-bold text-slate-400 dark:text-[#94A3B8] block mb-0.5 uppercase tracking-wider text-[10px]">Scorer Screen Status</span>
              <span className={`font-extrabold ${isMatchPermanentlyLocked ? 'text-emerald-500' : 'text-amber-500'}`}>
                {isMatchPermanentlyLocked ? 'Refreshed & Ready' : 'Awaiting Final Lock'}
              </span>
            </div>
          </div>
        </div>
      </div>
    )}

    <div className="result-actions mt-6 flex justify-end gap-3">
      <button onClick={() => navigateTo('matches')} className="px-5 py-2.5 rounded-xl border border-slate-300 dark:border-white/10 bg-white dark:bg-[#262B30] text-slate-800 dark:text-[#F3F4F6] font-bold text-xs hover:bg-slate-50 dark:hover:bg-[#2D333A] transition cursor-pointer">Back to Matches Directory</button>
      <button onClick={() => navigateTo('scorecard')} className="px-5 py-2.5 rounded-xl bg-[#2457D6] dark:bg-[#A3E635] text-white dark:text-[#0A0A0A] font-bold text-xs hover:bg-[#1b41a8] dark:hover:bg-[#bef264] transition cursor-pointer flex items-center gap-1.5">Open Official Scorecard <ArrowRight size={15}/></button>
    </div>
  </div>;
}
