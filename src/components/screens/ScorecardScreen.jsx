import React, { useState, useCallback } from 'react';
import { Radio, Users, ShieldCheck, ChevronRight, Share2, Award, Printer, ArrowLeft, Loader2 } from 'lucide-react';
import { useCricket } from '../../context/CricketContext';
import { shareScorecardPdf } from '../../lib/share';
import { PageHeader, TabBar } from '../ui/PageHeader';
import { MatchStatusBadge } from '../ui/Badge';
import { useLiveSubscription } from '../../hooks/useLiveSubscription';

const ordinal = (n) => {
  const s = ['th', 'st', 'nd', 'rd'];
  const v = n % 100;
  return `${n}${s[(v - 20) % 10] || s[v] || s[0]}`;
};

export default function ScorecardScreen() {
  const { activeMatchId, matches, goBack, deliveryLog = [], matchInterruptions = [] } = useCricket();
  const [activeInningsKey, setActiveInningsKey] = useState(null);
  const [fullScorecard, setFullScorecard] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [pdfBusy, setPdfBusy] = useState(null); // 'save' | 'share' | null

  const targetId = activeMatchId || matches?.find(m => ['COMPLETED','FINISHED','LIVE','IN_PROGRESS'].includes(m.status))?.id || matches?.[0]?.id;
  const targetMatch = matches?.find(m => m.id === targetId);
  const isLive = ['LIVE', 'IN_PROGRESS', 'INNINGS_BREAK'].includes(String(targetMatch?.status || '').toUpperCase());

  const handleLiveUpdate = useCallback((_matchId, data) => {
    if (data) setFullScorecard(data);
  }, []);

  // On-demand subscription: active only while viewing a live scorecard
  useLiveSubscription(targetId, handleLiveUpdate, isLive);

  // Initial scorecard load
  React.useEffect(() => {
    let isMounted = true;

    const loadScorecard = async () => {
      try {
        if (!targetId) {
          setIsLoading(false);
          return;
        }
        const { api } = await import('../../lib/api');
        const data = await api.getMatchScorecard(targetId);
        if (isMounted) setFullScorecard(data);
      } catch (err) {
        console.error('Failed to load scorecard', err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    loadScorecard();

    return () => { isMounted = false; };
  }, [targetId]);

  const activeMatch = matches?.find((m) => m.id === targetId);
  const isActiveMatch = targetId && targetId === activeMatchId;

  const teamAName = fullScorecard?.home_team?.name || activeMatch?.home_team?.name || 'Home Team';
  const teamBName = fullScorecard?.away_team?.name || activeMatch?.away_team?.name || 'Away Team';
  const tournamentName = fullScorecard?.tournament || activeMatch?.tournament || 'JDCA Senior District Trophy 2026';
  const venue = fullScorecard?.venue || activeMatch?.venue || 'Wright Town Stadium, Jabalpur';

  // Parse a "R/W" score string into numbers (used by the legacy fallback).
  const parseScore = (str) => {
    const [r, w] = String(str || '').split('/');
    return { runs: Number(r) || 0, wickets: Number(w) || 0 };
  };

  // One view per innings — this is what makes a 4-innings Test show all four
  // innings (not just the first per side). Prefers the API's per-innings array
  // (each entry carries its batting/bowling team); falls back to the legacy
  // two-team scorecard for older/offline data that lacks the innings array.
  const inningsViews = React.useMemo(() => {
    const arr = Array.isArray(fullScorecard?.innings) ? fullScorecard.innings : [];
    if (arr.length > 0) {
      return arr.map((s, i) => ({
        key: String(i),
        inningsNumber: s.inningsNumber ?? (i + 1),
        battingTeamName: s.battingTeamName || (i % 2 === 0 ? teamAName : teamBName),
        bowlingTeamName: s.bowlingTeamName || (i % 2 === 0 ? teamBName : teamAName),
        batting: s.batting || [],
        bowling: s.bowling || [],
        fallOfWickets: s.fallOfWickets || [],
        runs: s.runs ?? 0,
        wickets: s.wickets ?? 0,
        extras: s.extras ?? 0,
        overs: s.overs || '0.0',
        target: s.target ?? null,
      }));
    }
    const sc = fullScorecard?.scorecard;
    if (sc?.home_team || sc?.away_team) {
      const h = parseScore(sc?.home_team?.score);
      const a = parseScore(sc?.away_team?.score);
      return [
        { key: '0', inningsNumber: 1, battingTeamName: teamAName, bowlingTeamName: teamBName, batting: sc?.home_team?.batting || [], bowling: sc?.home_team?.bowling || [], fallOfWickets: sc?.home_team?.fallOfWickets || [], runs: h.runs, wickets: h.wickets, extras: sc?.home_team?.extras || 0, overs: (sc?.home_team?.overs || '0.0').replace(/[()]/g, '').replace(' ov', ''), target: null },
        { key: '1', inningsNumber: 2, battingTeamName: teamBName, bowlingTeamName: teamAName, batting: sc?.away_team?.batting || [], bowling: sc?.away_team?.bowling || [], fallOfWickets: sc?.away_team?.fallOfWickets || [], runs: a.runs, wickets: a.wickets, extras: sc?.away_team?.extras || 0, overs: (sc?.away_team?.overs || '0.0').replace(/[()]/g, '').replace(' ov', ''), target: null },
      ].filter(v => v.batting.length > 0 || v.runs > 0 || v.inningsNumber === 1);
    }
    return [];
  }, [fullScorecard, teamAName, teamBName]);

  // Default the selected tab to the most recent innings when the data loads or
  // the innings count changes (keeps a live match on the current innings).
  React.useEffect(() => {
    if (inningsViews.length === 0) { setActiveInningsKey(null); return; }
    setActiveInningsKey(prev => {
      if (prev != null && inningsViews.some(v => v.key === prev)) return prev;
      return inningsViews[inningsViews.length - 1].key;
    });
  }, [inningsViews]);

  const selectedInnings = inningsViews.find(v => v.key === activeInningsKey) || inningsViews[inningsViews.length - 1] || null;

  // Per-team aggregate score line for the summary header (handles 1 or 2
  // innings per team, e.g. a Test "350 & 180/4").
  const scoreLineFor = (teamName) => {
    const mine = inningsViews.filter(v => v.battingTeamName === teamName);
    if (mine.length === 0) return null;
    return mine.map(v => `${v.runs}/${v.wickets}`).join(' & ');
  };
  const homeScoreLine = scoreLineFor(teamAName);
  const awayScoreLine = scoreLineFor(teamBName);

  // Cross-device match events (interruptions / reduced overs) from the server.
  const [serverEvents, setServerEvents] = useState([]);
  React.useEffect(() => {
    let alive = true;
    (async () => {
      if (!targetId) { setServerEvents([]); return; }
      try {
        const { api } = await import('../../lib/api');
        const ev = await api.getMatchEvents(targetId);
        if (alive) setServerEvents(Array.isArray(ev) ? ev : []);
      } catch { if (alive) setServerEvents([]); }
    })();
    return () => { alive = false; };
  }, [targetId]);

  // Shared label builder — works for both server ballByBall rows and the
  // on-device live deliveryLog entries.
  const describeBall = (d) => {
    const runs = d.runsTotal ?? d.runs_total ?? ((d.runsBatter ?? 0) + (d.runsExtras ?? 0));
    const extra = d.extraType ?? d.extra_type ?? 'NONE';
    const wkt = d.wicketType ?? d.wicket_type ?? 'NONE';
    const overthrow = d.isOverthrow ?? d.is_overthrow ?? false;
    const parts = [];
    if (extra === 'WIDE') parts.push(`Wd${runs > 1 ? `+${runs - 1}` : ''}`);
    else if (extra === 'NO_BALL') parts.push(`Nb${runs > 1 ? `+${runs - 1}` : ''}`);
    else if (extra === 'BYE') parts.push(`${runs}b`);
    else if (extra === 'LEG_BYE') parts.push(`${runs}lb`);
    else parts.push(String(runs));
    if (overthrow) parts.push('OT');
    if (wkt !== 'NONE') parts.push(wkt === 'RETIRED_HURT' || wkt === 'RETIRED_OUT' ? 'Retired' : 'W');
    return parts.join(' · ');
  };

  // Ball-by-ball: prefer the server feed (visible on every device), filtered to
  // the SELECTED innings; fall back to the live on-device log for the active
  // match when the server feed isn't available yet.
  const ballEvents = React.useMemo(() => {
    const server = fullScorecard?.ballByBall;
    const wantInnings = selectedInnings?.inningsNumber;
    if (Array.isArray(server) && server.length > 0) {
      return server
        .filter(d => wantInnings == null || Number(d.inningsNumber) === Number(wantInnings))
        .map(d => ({ id: d.id, over: d.over || '', label: describeBall(d), isWicket: (d.wicketType || 'NONE') !== 'NONE' }))
        .reverse();
    }
    if (isActiveMatch && Array.isArray(deliveryLog)) {
      return deliveryLog
        .filter(d => d && d.type !== 'innings_start' && d.type !== 'match_start' && !String(d.id || '').startsWith('marker-'))
        .filter(d => wantInnings == null || Number(d.innings || 1) === Number(wantInnings))
        .map(d => ({ id: d.id, over: d.over || '', label: describeBall(d), isWicket: (d.wicketType ?? d.wicket_type ?? 'NONE') !== 'NONE' }))
        .reverse();
    }
    return [];
  }, [fullScorecard, selectedInnings, isActiveMatch, deliveryLog]);

  // Match Notes: merge server events with any local-only ones (dedupe by id).
  const interruptions = React.useMemo(() => {
    const local = isActiveMatch && Array.isArray(matchInterruptions) ? matchInterruptions : [];
    const byId = new Map();
    [...serverEvents, ...local].forEach(e => { if (e && e.id) byId.set(e.id, e); });
    return [...byId.values()];
  }, [serverEvents, isActiveMatch, matchInterruptions]);

  const handleExport = async (mode) => {
    if (pdfBusy) return;
    setPdfBusy(mode);
    try {
      await shareScorecardPdf({ ...(fullScorecard || {}), matchNotes: interruptions }, activeMatch || {}, { forceDownload: mode === 'save' });
    } catch (err) {
      console.error('Scorecard PDF failed', err);
      alert('Could not generate the scorecard PDF. Please try again.');
    } finally {
      setPdfBusy(null);
    }
  };

  const inningsTabs = inningsViews.map(v => ({
    id: v.key,
    label: `${v.battingTeamName} (${ordinal(v.inningsNumber)})`,
  }));

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] bg-slate-50 dark:bg-[#0A0A0A] text-slate-500 dark:text-[#CBD5E1] font-bold">
        <div className="w-8 h-8 border-4 border-[#A3E635] border-t-transparent rounded-full animate-spin mr-3"></div>
        <span>Loading Scorecard...</span>
      </div>
    );
  }

  const currentBatting = selectedInnings?.batting || [];
  const currentBowling = selectedInnings?.bowling || [];

  return (
    <div className="fade-in-up bg-slate-50 dark:bg-[#0A0A0A] min-h-screen text-slate-900 dark:text-[#F3F4F6]" style={{ padding: '24px 20px 100px', maxWidth: 1000, margin: '0 auto' }}>

      {/* Top Header & Actions */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={goBack}
          className="flex items-center gap-1.5 text-xs font-bold text-[#2457D6] dark:text-[#A3E635] hover:underline cursor-pointer"
        >
          <ArrowLeft size={14} />
          <span>Back to Match</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={() => handleExport('save')}
            disabled={!!pdfBusy}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-white/10 bg-white dark:bg-[#14171A] text-xs font-bold text-slate-700 dark:text-[#F3F4F6] hover:bg-slate-50 dark:hover:bg-[#262B30] cursor-pointer disabled:opacity-60"
          >
            {pdfBusy === 'save' ? <Loader2 size={13} className="animate-spin" /> : <Printer size={13} />}
            <span className="hidden sm:inline">Save PDF</span>
          </button>
          <button
            onClick={() => handleExport('share')}
            disabled={!!pdfBusy}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#2457D6] dark:bg-[#A3E635] text-white dark:text-[#0A0A0A] text-xs font-bold hover:bg-[#1b41a8] dark:hover:bg-[#bef264] cursor-pointer disabled:opacity-60"
          >
            {pdfBusy === 'share' ? <Loader2 size={13} className="animate-spin" /> : <Share2 size={13} />}
            <span>Share PDF</span>
          </button>
        </div>
      </div>

      {/* Match Summary Header Card */}
      <div className="jdca-card bg-white dark:bg-[#14171A] border border-slate-200 dark:border-white/10 p-5 mb-5 shadow-sm text-slate-900 dark:text-[#F3F4F6]">
        <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-400 mb-2">
          <span>{tournamentName}</span>
          <MatchStatusBadge status={fullScorecard?.status || activeMatch?.status || 'LIVE'} />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-4 border-b border-slate-100 dark:border-white/10">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-[#F3F4F6]">{teamAName}</h2>
            <div className="text-2xl sm:text-3xl font-extrabold text-[#2457D6] dark:text-[#A3E635] font-tabular mt-1 break-words">
              {homeScoreLine || '0/0'}
            </div>
          </div>

          <div className="sm:text-right flex flex-col justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-800 dark:text-[#F3F4F6]">{teamBName}</h2>
              {awayScoreLine ? (
                <div className="text-xl sm:text-2xl font-extrabold text-[#2457D6] dark:text-[#A3E635] font-tabular mt-1 break-words">
                  {awayScoreLine}
                </div>
              ) : (
                <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">Yet to bat</div>
              )}
            </div>
            <div className="text-xs text-slate-400 mt-2">
              Venue: <strong className="text-slate-600 dark:text-slate-300">{venue}</strong>
            </div>
          </div>
        </div>

        {/* Result Banner if Completed */}
        {(fullScorecard?.resultText || activeMatch?.result_text) && (
          <div className="mt-3 p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-500/30 text-emerald-800 dark:text-emerald-300 rounded-xl text-xs font-bold flex items-center gap-2">
            <span className="text-base leading-none">🏆</span>
            <span>{fullScorecard?.resultText || activeMatch?.result_text}</span>
          </div>
        )}

        {/* Early-end / reduced-overs info banner */}
        {fullScorecard?.maxOvers && (fullScorecard?.resultText || '').includes('ended at') && (
          <div className="mt-2 p-2.5 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-500/30 text-amber-800 dark:text-amber-300 rounded-xl text-xs font-medium flex items-center gap-2">
            <ShieldCheck size={14} className="shrink-0" />
            <span>Match was scheduled for {fullScorecard.maxOvers} overs per side</span>
          </div>
        )}

        {/* Player of Match Highlight */}
        {(() => {
          const motmCandidates = [
            fullScorecard?.manOfTheMatch,
            fullScorecard?.man_of_the_match,
            fullScorecard?.playerOfMatch,
            activeMatch?.man_of_the_match,
            activeMatch?.playerOfMatch,
            activeMatch?.manOfTheMatch
          ];
          let motm = null;
          for (const cand of motmCandidates) {
            if (!cand) continue;
            const c = Array.isArray(cand) ? cand[0] : cand;
            if (typeof c === 'string' && c.trim()) {
              motm = c.trim();
              break;
            }
            if (c?.full_name || c?.name) {
              motm = c;
              break;
            }
          }
          const motmName = typeof motm === 'string' ? motm : (motm?.full_name || motm?.name);
          if (!motmName) return null;
          return (
            <div className="mt-3 pt-1 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span className="p-1 rounded bg-amber-50 dark:bg-amber-950/40 text-[#ff6100] dark:text-[#F97316] border border-amber-200 dark:border-amber-500/30">
                  <Award size={15} />
                </span>
                <span className="text-slate-600 dark:text-slate-300 font-medium">
                  Player of the Match: <strong className="text-slate-900 dark:text-[#F3F4F6]">{motmName}</strong>
                </span>
              </div>
              <span className="text-xs font-bold text-[#A3E635]">JDCA Verified</span>
            </div>
          );
        })()}
      </div>

      {/* Innings Selector Tabs — one per innings (1..4) */}
      {inningsTabs.length > 0 && (
        <div className="mb-4 overflow-x-auto">
          <TabBar tabs={inningsTabs} active={activeInningsKey} onChange={setActiveInningsKey} />
        </div>
      )}

      {/* Innings total strip */}
      {selectedInnings && (
        <div className="mb-4 flex items-center justify-between text-sm">
          <div className="font-bold text-slate-900 dark:text-[#F3F4F6]">
            {selectedInnings.battingTeamName} — {ordinal(selectedInnings.inningsNumber)} innings
          </div>
          <div className="font-tabular font-extrabold text-[#2457D6] dark:text-[#A3E635]">
            {selectedInnings.runs}/{selectedInnings.wickets} <span className="text-xs text-slate-400 font-medium">({selectedInnings.overs} ov)</span>
            {selectedInnings.target ? <span className="text-xs text-slate-400 font-medium ml-2">Target {selectedInnings.target}</span> : null}
          </div>
        </div>
      )}

      {/* Batting Scorecard Table */}
      <div className="jdca-card bg-white dark:bg-[#14171A] border border-slate-200 dark:border-white/10 overflow-hidden mb-5 text-slate-900 dark:text-[#F3F4F6]">
        <div className="p-3.5 bg-slate-50 dark:bg-[#1E2226] border-b border-slate-200/80 dark:border-white/10 flex items-center justify-between">
          <h3 className="font-extrabold text-slate-900 dark:text-[#F3F4F6] text-sm">Batting Scorecard</h3>
          <span className="text-xs text-slate-500 dark:text-[#94A3B8] font-medium">{selectedInnings?.battingTeamName || teamAName}</span>
        </div>

        <div className="overflow-x-auto">
          <table className="jdca-table">
            <thead>
              <tr>
                <th style={{ minWidth: 180 }}>Batter</th>
                <th>Dismissal</th>
                <th style={{ textAlign: 'right' }}>R</th>
                <th style={{ textAlign: 'right' }}>B</th>
                <th style={{ textAlign: 'right' }}>4s</th>
                <th style={{ textAlign: 'right' }}>6s</th>
                <th style={{ textAlign: 'right' }}>SR</th>
              </tr>
            </thead>
            <tbody>
              {currentBatting.length > 0 ? (
                currentBatting.map((batter) => (
                  <tr key={batter.id} className="hover:bg-slate-50/80 dark:hover:bg-white/5 transition-colors">
                    <td>
                      <div className="font-bold text-slate-900 dark:text-[#F3F4F6] text-sm flex items-center gap-1.5">
                        <span>{batter.name}</span>
                        {batter.isCaptain && <span className="text-xs text-slate-400 font-normal">(c)</span>}
                        {batter.isStriker && <span className="w-2 h-2 rounded-full bg-[#A3E635]" title="Current Striker" />}
                      </div>
                    </td>
                    <td>
                      <span className="text-xs text-slate-500 dark:text-slate-400">
                        {batter.dismissal || 'not out'}
                      </span>
                    </td>
                    <td style={{ textAlign: 'right' }} className="font-tabular font-extrabold text-slate-900 dark:text-[#F3F4F6] text-sm">
                      {batter.runs}
                    </td>
                    <td style={{ textAlign: 'right' }} className="font-tabular text-slate-600 dark:text-[#CBD5E1] text-xs">
                      {batter.balls}
                    </td>
                    <td style={{ textAlign: 'right' }} className="font-tabular font-semibold text-slate-800 dark:text-[#CBD5E1] text-xs">
                      {batter.fours}
                    </td>
                    <td style={{ textAlign: 'right' }} className="font-tabular font-semibold text-slate-800 dark:text-[#CBD5E1] text-xs">
                      {batter.sixes}
                    </td>
                    <td style={{ textAlign: 'right' }} className="font-tabular font-bold text-[#2457D6] dark:text-[#A3E635] text-xs">
                      {batter.strikeRate}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="text-center py-6 text-slate-400 dark:text-slate-500 text-xs font-semibold">
                    No batting data recorded for this innings yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Extras & Totals Row */}
        <div className="p-4 bg-slate-50 dark:bg-[#1E2226] border-t border-slate-200 dark:border-white/10 text-xs flex items-center justify-between flex-wrap gap-2">
          <div>
            <span className="font-bold text-slate-800 dark:text-slate-300">Extras: </span>
            <span className="text-slate-600 dark:text-slate-400 font-medium">{selectedInnings?.extras || 0}</span>
          </div>
          <div className="font-tabular font-extrabold text-sm text-slate-900 dark:text-[#F3F4F6]">
            Total: {selectedInnings ? `${selectedInnings.runs}/${selectedInnings.wickets}` : '0/0'} ({selectedInnings?.overs || '0.0'} ov)
          </div>
        </div>
      </div>

      {/* Bowling Scorecard Table */}
      <div className="jdca-card bg-white dark:bg-[#14171A] border border-slate-200 dark:border-white/10 overflow-hidden mb-5 text-slate-900 dark:text-[#F3F4F6]">
        <div className="p-3.5 bg-slate-50 dark:bg-[#1E2226] border-b border-slate-200/80 dark:border-white/10 flex items-center justify-between">
          <h3 className="font-extrabold text-slate-900 dark:text-[#F3F4F6] text-sm">Bowling Figures</h3>
          <span className="text-xs text-slate-500 dark:text-[#94A3B8] font-medium">{selectedInnings?.bowlingTeamName || teamBName}</span>
        </div>

        <div className="overflow-x-auto">
          <table className="jdca-table">
            <thead>
              <tr>
                <th style={{ minWidth: 180 }}>Bowler</th>
                <th style={{ textAlign: 'right' }}>O</th>
                <th style={{ textAlign: 'right' }}>M</th>
                <th style={{ textAlign: 'right' }}>R</th>
                <th style={{ textAlign: 'right' }}>W</th>
                <th style={{ textAlign: 'right' }}>Econ</th>
                <th style={{ textAlign: 'right' }}>WD</th>
                <th style={{ textAlign: 'right' }}>NB</th>
              </tr>
            </thead>
            <tbody>
              {currentBowling.length > 0 ? (
                currentBowling.map((bowler) => (
                  <tr key={bowler.id} className="hover:bg-slate-50/80 dark:hover:bg-white/5 transition-colors">
                    <td>
                      <div className="font-bold text-slate-900 dark:text-[#F3F4F6] text-sm">{bowler.name}</div>
                    </td>
                    <td style={{ textAlign: 'right' }} className="font-tabular text-slate-700 dark:text-[#CBD5E1] text-xs">
                      {bowler.overs}
                    </td>
                    <td style={{ textAlign: 'right' }} className="font-tabular text-slate-700 dark:text-[#CBD5E1] text-xs">
                      {bowler.maidens || 0}
                    </td>
                    <td style={{ textAlign: 'right' }} className="font-tabular font-bold text-slate-900 dark:text-[#F3F4F6] text-sm">
                      {bowler.runs}
                    </td>
                    <td style={{ textAlign: 'right' }} className="font-tabular font-extrabold text-[#EF4444] text-sm">
                      {bowler.wickets}
                    </td>
                    <td style={{ textAlign: 'right' }} className="font-tabular font-bold text-[#2457D6] dark:text-[#A3E635] text-xs">
                      {bowler.economy}
                    </td>
                    <td style={{ textAlign: 'right' }} className="font-tabular text-slate-500 dark:text-slate-400 text-xs">
                      {bowler.wides || 0}
                    </td>
                    <td style={{ textAlign: 'right' }} className="font-tabular text-slate-500 dark:text-slate-400 text-xs">
                      {bowler.noBalls || 0}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="text-center py-6 text-slate-400 dark:text-slate-500 text-xs font-semibold">
                    No bowling figures recorded for this innings yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Fall of Wickets */}
      <div className="jdca-card bg-white dark:bg-[#14171A] border border-slate-200 dark:border-white/10 p-4 text-slate-900 dark:text-[#F3F4F6]">
        <h3 className="font-extrabold text-slate-900 dark:text-[#F3F4F6] text-sm mb-2">Fall of Wickets</h3>
        <div className="text-xs text-slate-600 dark:text-[#CBD5E1] leading-relaxed font-tabular">
          {(selectedInnings?.fallOfWickets && selectedInnings.fallOfWickets.length > 0) ? (
            selectedInnings.fallOfWickets.map((f, i) => (
              <span key={i}>
                <strong className="text-slate-900 dark:text-[#F3F4F6]">{f.wicket}-{f.score}</strong> ({f.player}, {f.oversAt} ov){i < selectedInnings.fallOfWickets.length - 1 ? ', ' : ''}
              </span>
            ))
          ) : (
            <span className="text-slate-400">No wickets fallen in this innings.</span>
          )}
        </div>
      </div>

      {/* Match Notes — interruptions / reduced overs */}
      {interruptions.length > 0 && (
        <div className="jdca-card bg-white dark:bg-[#14171A] border border-slate-200 dark:border-white/10 p-4 mt-5 text-slate-900 dark:text-[#F3F4F6]">
          <h3 className="font-extrabold text-slate-900 dark:text-[#F3F4F6] text-sm mb-3">Match Notes</h3>
          <div className="space-y-2">
            {interruptions.map((it) => (
              <div key={it.id} className="flex items-start gap-2 text-xs">
                <span className="px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 font-bold uppercase tracking-wider shrink-0">
                  Reduced
                </span>
                <span className="text-slate-600 dark:text-[#CBD5E1] leading-relaxed">
                  Innings {it.innings}: overs {it.fromOvers ? `reduced ${it.fromOvers} → ` : 'set to '}<strong className="text-slate-900 dark:text-[#F3F4F6]">{it.toOvers}</strong>
                  {it.atOver ? ` (at ${it.atOver} ov)` : ''}
                  {it.revisedTarget ? `, revised target ${it.revisedTarget}` : ''}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Ball-by-ball events (for the selected innings) */}
      {ballEvents.length > 0 && (
        <div className="jdca-card bg-white dark:bg-[#14171A] border border-slate-200 dark:border-white/10 p-4 mt-5 text-slate-900 dark:text-[#F3F4F6]">
          <h3 className="font-extrabold text-slate-900 dark:text-[#F3F4F6] text-sm mb-3">Ball-by-Ball</h3>
          <div className="flex flex-wrap gap-1.5">
            {ballEvents.map((e) => (
              <span
                key={e.id}
                title={e.over ? `${e.over} ov` : ''}
                className={`inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-tabular font-bold border ${
                  e.isWicket
                    ? 'bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-300 border-red-200 dark:border-red-500/30'
                    : 'bg-slate-50 dark:bg-[#1E2226] text-slate-700 dark:text-[#CBD5E1] border-slate-200 dark:border-white/10'
                }`}
              >
                {e.over && <span className="text-[10px] text-slate-400 dark:text-slate-500">{e.over}</span>}
                {e.label}
              </span>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
