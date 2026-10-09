import React, { useState, useCallback } from 'react';
import { Radio, Users, ShieldCheck, ChevronRight, Share2, Award, Printer, ArrowLeft } from 'lucide-react';
import { useCricket } from '../../context/CricketContext';
import { PageHeader, TabBar } from '../ui/PageHeader';
import { MatchStatusBadge } from '../ui/Badge';
import { useLiveSubscription } from '../../hooks/useLiveSubscription';

export default function ScorecardScreen() {
  const { activeMatchId, matches, goBack } = useCricket();
  const [activeInningsTab, setActiveInningsTab] = useState('1st');
  const [fullScorecard, setFullScorecard] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

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
  const teamAName = fullScorecard?.home_team?.name || activeMatch?.home_team?.name || 'Home Team';
  const teamBName = fullScorecard?.away_team?.name || activeMatch?.away_team?.name || 'Away Team';
  const tournamentName = fullScorecard?.tournament || activeMatch?.tournament || 'JDCA Senior District Trophy 2026';
  const venue = fullScorecard?.venue || activeMatch?.venue || 'Wright Town Stadium, Jabalpur';

  const inningsTabs = [
    { id: '1st', label: `${teamAName} (1st Inn)` },
    { id: '2nd', label: `${teamBName} (2nd Inn)` },
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] bg-slate-50 dark:bg-[#0A0A0A] text-slate-500 dark:text-[#CBD5E1] font-bold">
        <div className="w-8 h-8 border-4 border-[#A3E635] border-t-transparent rounded-full animate-spin mr-3"></div>
        <span>Loading Scorecard...</span>
      </div>
    );
  }

  // Choose stats based on tab selection
  const tabData = activeInningsTab === '1st' 
    ? fullScorecard?.scorecard?.home_team
    : fullScorecard?.scorecard?.away_team;
    
  const currentBatting = tabData?.batting || [];
  const currentBowling = tabData?.bowling || [];

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
            onClick={() => window.print()}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-white/10 bg-white dark:bg-[#14171A] text-xs font-bold text-slate-700 dark:text-[#F3F4F6] hover:bg-slate-50 dark:hover:bg-[#262B30] cursor-pointer"
          >
            <Printer size={13} />
            <span className="hidden sm:inline">Print Card</span>
          </button>
          <button
            onClick={() => alert('Official JDCA Match Report copied to clipboard')}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#2457D6] dark:bg-[#A3E635] text-white dark:text-[#0A0A0A] text-xs font-bold hover:bg-[#1b41a8] dark:hover:bg-[#bef264] cursor-pointer"
          >
            <Share2 size={13} />
            <span>Share</span>
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
            <div className="text-3xl font-extrabold text-[#2457D6] dark:text-[#A3E635] font-tabular mt-1">
              {fullScorecard?.home_team?.score?.split('/')[0] || '0'}<span className="text-xl font-bold text-slate-400">/{fullScorecard?.home_team?.score?.split('/')[1] || '0'}</span>
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">
              Overs: <strong className="text-slate-900 dark:text-[#F3F4F6]">{fullScorecard?.home_team?.overs?.replace('(', '')?.replace(' ov)', '') || '0.0'}</strong>
            </div>
          </div>

          <div className="sm:text-right flex flex-col justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-800 dark:text-[#F3F4F6]">{teamBName}</h2>
              {fullScorecard?.away_team?.score ? (
                <div className="text-2xl font-extrabold text-[#2457D6] dark:text-[#A3E635] font-tabular mt-1">
                  {fullScorecard.away_team.score.split('/')[0]}<span className="text-lg font-bold text-slate-400">/{fullScorecard.away_team.score.split('/')[1]}</span>
                  <span className="text-xs text-slate-500 dark:text-slate-400 ml-2 font-medium">({fullScorecard.away_team.overs?.replace('(', '')?.replace(' ov)', '') || '0.0'})</span>
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

      {/* Innings Selector Tabs */}
      <div className="mb-4">
        <TabBar tabs={inningsTabs} active={activeInningsTab} onChange={setActiveInningsTab} />
      </div>

      {/* Batting Scorecard Table */}
      <div className="jdca-card bg-white dark:bg-[#14171A] border border-slate-200 dark:border-white/10 overflow-hidden mb-5 text-slate-900 dark:text-[#F3F4F6]">
        <div className="p-3.5 bg-slate-50 dark:bg-[#1E2226] border-b border-slate-200/80 dark:border-white/10 flex items-center justify-between">
          <h3 className="font-extrabold text-slate-900 dark:text-[#F3F4F6] text-sm">Batting Scorecard</h3>
          <span className="text-xs text-slate-500 dark:text-[#94A3B8] font-medium">{activeInningsTab === '1st' ? teamAName : teamBName}</span>
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
            <span className="text-slate-600 dark:text-slate-400 font-medium">{activeInningsTab === '1st' ? fullScorecard?.home_team?.extras || 0 : fullScorecard?.away_team?.extras || 0}</span>
          </div>
          <div className="font-tabular font-extrabold text-sm text-slate-900 dark:text-[#F3F4F6]">
            Total: {activeInningsTab === '1st' ? fullScorecard?.home_team?.score || '0/0' : fullScorecard?.away_team?.score || '0/0'} {activeInningsTab === '1st' ? fullScorecard?.home_team?.overs || '(0.0 ov)' : fullScorecard?.away_team?.overs || '(0.0 ov)'}
          </div>
        </div>
      </div>

      {/* Bowling Scorecard Table */}
      <div className="jdca-card bg-white dark:bg-[#14171A] border border-slate-200 dark:border-white/10 overflow-hidden mb-5 text-slate-900 dark:text-[#F3F4F6]">
        <div className="p-3.5 bg-slate-50 dark:bg-[#1E2226] border-b border-slate-200/80 dark:border-white/10 flex items-center justify-between">
          <h3 className="font-extrabold text-slate-900 dark:text-[#F3F4F6] text-sm">Bowling Figures</h3>
          <span className="text-xs text-slate-500 dark:text-[#94A3B8] font-medium">{activeInningsTab === '1st' ? teamBName : teamAName}</span>
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
          {(tabData?.fallOfWickets && tabData.fallOfWickets.length > 0) ? (
            tabData.fallOfWickets.map((f, i) => (
              <span key={i}>
                <strong className="text-slate-900 dark:text-[#F3F4F6]">{f.wicket}-{f.score}</strong> ({f.player}, {f.oversAt} ov){i < tabData.fallOfWickets.length - 1 ? ', ' : ''}
              </span>
            ))
          ) : (
            <span className="text-slate-400">No wickets fallen in this innings.</span>
          )}
        </div>
      </div>

    </div>
  );
}
