import React, { useState } from 'react';
import { ArrowLeft, CalendarDays, MapPin, Radio, ShieldCheck, Trophy, Users, FileText, Trash2, Play, Pause, Award } from 'lucide-react';
import { useCricket } from '../../context/CricketContext';
import MatchScorecard from '../ui/MatchScorecard';
import MatchMediaReport from '../ui/MatchMediaReport';
import { calculateMatchHighlights } from '../../engine/matchSummaryEngine';

const MatchTabs = ({ tabs, active, onChange }) => (
  <div className="flex bg-gray-100 p-1 rounded-xl mb-4 mx-4">
    {tabs.map(tab => (
      <button
        key={tab.id}
        onClick={() => onChange(tab.id)}
        className={`flex-1 py-2 rounded-lg text-[13px] font-bold transition-all ${active === tab.id ? 'bg-white text-[#101827] shadow-sm' : 'text-[#8a99b0]'}`}
      >
        {tab.label}
      </button>
    ))}
  </div>
);

export default function MatchDetailScreen() {
  const { matches = [], activeMatchId, navigateTo, goBack, userRole, registeredUsers = [], isPaused, resumeMatch } = useCricket();
  const [activeTab, setActiveTab] = useState('info');
  const [isDeleting, setIsDeleting] = useState(false);
  const [selectedScorer, setSelectedScorer] = useState('');
  const [isAssigning, setIsAssigning] = useState(false);
  const [scorecardData, setScorecardData] = useState(null);

  const match = matches.find(m => m.id === activeMatchId) || matches[0];

  React.useEffect(() => {
    let isMounted = true;
    const loadScorecard = async () => {
      const targetId = activeMatchId || match?.id;
      if (!targetId) return;
      try {
        const { api } = await import('../../lib/api');
        const data = await api.getMatchScorecard(targetId);
        if (isMounted && data) {
          setScorecardData(data);
        }
      } catch (err) {
        console.error('[MatchDetailScreen] Failed to load scorecard:', err);
      }
    };
    loadScorecard();

    const isLive = ['LIVE', 'IN_PROGRESS', 'INNINGS_BREAK'].includes(String(match?.status || '').toUpperCase());
    let interval = null;
    if (isLive) {
      interval = setInterval(loadScorecard, 8000);
    }

    return () => {
      isMounted = false;
      if (interval) clearInterval(interval);
    };
  }, [activeMatchId, match?.id, match?.status]);

  if (!match) return null;

  const displayMatch = {
    ...match,
    ...(scorecardData || {}),
    man_of_the_match: (scorecardData?.man_of_the_match?.name || scorecardData?.man_of_the_match?.full_name || (typeof scorecardData?.man_of_the_match === 'string' && scorecardData.man_of_the_match.trim()))
      ? scorecardData.man_of_the_match
      : (match?.man_of_the_match || match?.playerOfMatch || match?.manOfTheMatch || scorecardData?.man_of_the_match),
    playerOfMatch: (scorecardData?.playerOfMatch?.name || scorecardData?.playerOfMatch?.full_name || (typeof scorecardData?.playerOfMatch === 'string' && scorecardData.playerOfMatch.trim()))
      ? scorecardData.playerOfMatch
      : (match?.playerOfMatch || match?.man_of_the_match || match?.manOfTheMatch || scorecardData?.playerOfMatch),
    manOfTheMatch: (scorecardData?.manOfTheMatch?.name || scorecardData?.manOfTheMatch?.full_name || (typeof scorecardData?.manOfTheMatch === 'string' && scorecardData.manOfTheMatch.trim()))
      ? scorecardData.manOfTheMatch
      : (match?.manOfTheMatch || match?.man_of_the_match || match?.playerOfMatch || scorecardData?.manOfTheMatch),
    home_team: {
      ...(match?.home_team || {}),
      ...(scorecardData?.home_team || {})
    },
    away_team: {
      ...(match?.away_team || {}),
      ...(scorecardData?.away_team || {})
    },
    scorecard: scorecardData?.scorecard || match?.scorecard
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this match? It will be moved to the Recycle Bin.")) return;
    setIsDeleting(true);
    try {
      const { api } = await import('../../lib/api');
      await api.deleteMatch(match.id);
      alert('Match deleted successfully.');
      goBack();
    } catch (err) {
      console.error(err);
      alert(err.message || 'Failed to delete match.');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleAssignScorer = async () => {
    if (!selectedScorer) return;
    setIsAssigning(true);
    try {
      const { api } = await import('../../lib/api');
      await api.assignScorer(match.id, selectedScorer);
      alert('Scorer assigned successfully.');
      window.location.reload();
    } catch (err) {
      console.error(err);
      alert('Failed to assign scorer.');
    } finally {
      setIsAssigning(false);
    }
  };
  
  const h = calculateMatchHighlights(displayMatch);
  const live = displayMatch.status === 'LIVE' || displayMatch.status === 'IN_PROGRESS' || displayMatch.status === 'INNINGS_BREAK';
  const isCompleted = displayMatch.status === 'COMPLETED' || displayMatch.status === 'FINISHED';

  const tabs = [
    { id: 'info', label: 'Info' },
    { id: 'scorecard', label: 'Scorecard' },
    { id: 'highlights', label: 'Highlights' },
    { id: 'media', label: 'Media' }
  ];

  return (
    <div className="pb-[100px] bg-slate-50 min-h-screen">
      {/* ── Match Hero ── */}
      <div className={`text-white pb-6 pt-[60px] px-4 relative ${live ? 'bg-emerald-600' : 'bg-slate-900'}`}>
        <button
          onClick={goBack}
          className="absolute top-4 left-4 w-9 h-9 flex items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
        >
          <ArrowLeft size={20} strokeWidth={2.5} />
        </button>

        {(userRole === 'SUPER_ADMIN' || userRole === 'DISTRICT_ADMIN' || userRole === 'SCORER') && (
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="absolute top-4 right-4 w-9 h-9 flex items-center justify-center rounded-full bg-rose-500/20 text-rose-300 hover:bg-rose-500/40 hover:text-white transition-colors cursor-pointer disabled:opacity-50 border border-rose-500/30"
            title="Delete Match"
          >
            <Trash2 size={16} strokeWidth={2.5} />
          </button>
        )}

        <div className="text-center mt-6">
          <div className="text-xs font-bold tracking-widest uppercase text-white/60 mb-3">
            {displayMatch.tournament || 'JDCA Official Fixture'}
          </div>

          {live && (
            <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold mb-4 ${
              isPaused && activeMatchId === displayMatch.id ? 'bg-amber-500/30 text-amber-200 border border-amber-400/40' : 'bg-white/20 text-white'
            }`}>
              <span className={`w-2 h-2 rounded-full ${isPaused && activeMatchId === displayMatch.id ? 'bg-amber-400' : 'bg-[#0FA968] animate-pulse'}`} />
              {isPaused && activeMatchId === displayMatch.id ? 'PAUSED' : 'LIVE MATCH'}
            </div>
          )}

          {isCompleted && (
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold mb-4 bg-white/10 border border-white/20 text-white">
              <span>🏆 COMPLETED</span>
            </div>
          )}

          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="flex-1 text-right">
              <div className="text-[20px] font-black leading-tight mb-1">{displayMatch.home_team?.name || 'Home Team'}</div>
              <div className="text-[32px] font-black text-[#ff6100] tracking-tighter leading-none">{displayMatch.home_team?.score || (live ? 'Batting' : '')}</div>
              {displayMatch.home_team?.overs && <div className="text-[12px] font-bold text-white/80 mt-1">{displayMatch.home_team.overs}</div>}
            </div>
            
            <div className="w-8 flex-shrink-0 flex flex-col items-center justify-center text-white/40">
              <div className="h-4 w-px bg-white/20 mb-2"></div>
              <div className="text-xs font-black uppercase">VS</div>
              <div className="h-4 w-px bg-white/20 mt-2"></div>
            </div>

            <div className="flex-1 text-left">
              <div className="text-[20px] font-black leading-tight mb-1">{displayMatch.away_team?.name || 'Away Team'}</div>
              <div className="text-[32px] font-black text-white tracking-tighter leading-none">{displayMatch.away_team?.score || (live ? 'Yet to bat' : '')}</div>
              {displayMatch.away_team?.overs && <div className="text-[12px] font-bold text-white/80 mt-1">{displayMatch.away_team.overs}</div>}
            </div>
          </div>

          <div className="text-[13px] font-bold text-white/90 bg-white/10 py-2 px-4 rounded-xl inline-block max-w-[90%] mx-auto">
            {isCompleted
              ? (displayMatch.result_text || displayMatch.resultText || 'Match Completed')
              : (live
                ? (displayMatch.toss_winner_id === displayMatch.home_team_id ? displayMatch.home_team?.name : displayMatch.away_team?.name) + ' elected to ' + (String(displayMatch.toss_decision || '').toUpperCase() === 'BAT' ? 'bat' : 'bowl')
                : (displayMatch.result_text || 'Fixture Scheduled')
              )
            }
          </div>

          {isCompleted && (() => {
            const potm = (h?.playerOfMatch?.name && h.playerOfMatch) ||
              (displayMatch.man_of_the_match?.name || displayMatch.man_of_the_match?.full_name ? displayMatch.man_of_the_match : null) ||
              (displayMatch.playerOfMatch?.name || displayMatch.playerOfMatch?.full_name ? displayMatch.playerOfMatch : null) ||
              (displayMatch.manOfTheMatch?.name || displayMatch.manOfTheMatch?.full_name ? displayMatch.manOfTheMatch : null) ||
              (match.man_of_the_match?.name || match.man_of_the_match?.full_name ? match.man_of_the_match : null) ||
              (match.playerOfMatch?.name || match.playerOfMatch?.full_name ? match.playerOfMatch : null) ||
              (typeof displayMatch.man_of_the_match === 'string' ? displayMatch.man_of_the_match : null) ||
              (typeof match.man_of_the_match === 'string' ? match.man_of_the_match : null);
            const potmName = typeof potm === 'string' ? potm : (potm?.full_name || potm?.name);
            if (!potmName) return null;
            return (
              <div className="mt-3 block">
                <span className="text-xs font-bold text-amber-300 bg-amber-500/20 border border-amber-400/30 py-1.5 px-3.5 rounded-full inline-flex items-center gap-1.5 backdrop-blur-xs shadow-xs">
                  <Award size={14} className="text-amber-400 shrink-0" />
                  <span>Player of the Match: <strong>{potmName}</strong></span>
                </span>
              </div>
            );
          })()}
        </div>
      </div>

      {/* ── Tabs ── */}
      <div className="pt-4 sticky top-[60px] bg-slate-50 z-20 shadow-sm border-b border-slate-200">
        <MatchTabs tabs={tabs} active={activeTab} onChange={setActiveTab} />
      </div>

      <div className="px-4 pb-8 space-y-4 pt-4">
        {/* ── TAB 1: INFO ── */}
        {activeTab === 'info' && (
          <div className="space-y-4">
            <div className="bg-white rounded-[16px] shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-4 border-b border-gray-50 flex items-center gap-2 text-[#596579]">
                <ShieldCheck size={16} />
                <h3 className="font-bold text-[14px] uppercase tracking-wider">Match Details</h3>
              </div>
              <div className="divide-y divide-gray-50 text-[13px]">
                <div className="flex justify-between p-4">
                  <span className="text-[#8a99b0] font-medium">Format</span>
                  <span className="font-bold text-[#101827]">{match.match_format || match.format || 'Not Specified'} · {match.ballType || 'White Ball'}</span>
                </div>
                <div className="flex justify-between p-4">
                  <span className="text-[#8a99b0] font-medium">Category</span>
                  <span className="font-bold text-[#101827]">{match.category || match.ageGroup || 'Senior Division'}</span>
                </div>
                <div className="flex justify-between p-4">
                  <span className="text-[#8a99b0] font-medium">Venue</span>
                  <span className="font-bold text-[#101827]">{match.venue_name || match.venue || 'Unknown Venue'}</span>
                </div>
                <div className="flex justify-between p-4">
                  <span className="text-[#8a99b0] font-medium">Toss</span>
                  <span className="font-bold text-[#101827]">{match.tossDecision || 'Jabalpur won, elected to bat'}</span>
                </div>
                {isCompleted && (() => {
                  const potm = (h?.playerOfMatch?.name && h.playerOfMatch) ||
                    (displayMatch.man_of_the_match?.name || displayMatch.man_of_the_match?.full_name ? displayMatch.man_of_the_match : null) ||
                    (displayMatch.playerOfMatch?.name || displayMatch.playerOfMatch?.full_name ? displayMatch.playerOfMatch : null) ||
                    (displayMatch.manOfTheMatch?.name || displayMatch.manOfTheMatch?.full_name ? displayMatch.manOfTheMatch : null) ||
                    (match.man_of_the_match?.name || match.man_of_the_match?.full_name ? match.man_of_the_match : null) ||
                    (match.playerOfMatch?.name || match.playerOfMatch?.full_name ? match.playerOfMatch : null) ||
                    (typeof displayMatch.man_of_the_match === 'string' ? displayMatch.man_of_the_match : null) ||
                    (typeof match.man_of_the_match === 'string' ? match.man_of_the_match : null);
                  const potmName = typeof potm === 'string' ? potm : (potm?.full_name || potm?.name);
                  if (!potmName) return null;
                  return (
                    <div className="flex justify-between p-4 bg-amber-50/70">
                      <span className="text-amber-800 font-bold flex items-center gap-1.5">
                        <Award size={15} className="text-[#ff6100]" /> Player of the Match
                      </span>
                      <span className="font-extrabold text-[#101827]">{potmName}</span>
                    </div>
                  );
                })()}
              </div>
            </div>

            <div className="bg-white rounded-[16px] shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-4 border-b border-gray-50 flex items-center gap-2 text-[#596579]">
                <Users size={16} />
                <h3 className="font-bold text-[14px] uppercase tracking-wider">Officials</h3>
              </div>
              <div className="p-4 text-[13px] font-bold text-[#101827]">
                <div className="mb-3">
                  <span className="text-[#8a99b0] font-medium block mb-1">Scorer</span>
                  {match.scorer_name || match.scorerName || 'Not Assigned'}
                </div>
                {['SUPER_ADMIN', 'DISTRICT_ADMIN'].includes(userRole) && (
                  <div className="mt-3 pt-3 border-t border-gray-50 flex gap-2">
                    <select 
                      className="flex-1 p-2 rounded-lg border border-gray-200 text-[13px]"
                      value={selectedScorer}
                      onChange={(e) => setSelectedScorer(e.target.value)}
                    >
                      <option value="">-- Select Scorer --</option>
                      {registeredUsers.filter(u => ['SCORER', 'SUPER_ADMIN', 'DISTRICT_ADMIN'].includes(u.role?.toUpperCase())).map(u => (
                        <option key={u.id} value={u.name || u.email}>{u.name || u.email}</option>
                      ))}
                    </select>
                    <button 
                      onClick={handleAssignScorer}
                      disabled={isAssigning || !selectedScorer}
                      className="bg-[#2457D6] text-white px-3 py-2 rounded-lg font-bold disabled:opacity-50"
                    >
                      Assign
                    </button>
                  </div>
                )}
              </div>
            </div>
            
            {(() => {
              const isAuthorizedScorer = ['SUPER_ADMIN', 'DISTRICT_ADMIN', 'SCORER'].includes(userRole);
              const upcoming = match.status === 'SCHEDULED' || match.status === 'UPCOMING';
              
              return (
                <>
                  {upcoming && isAuthorizedScorer && (
                    <button 
                      onClick={() => navigateTo('match-setup')}
                      className="w-full bg-[#2457D6] text-white rounded-[12px] py-4 font-bold text-[16px] shadow-md active:bg-[#1a41a3] transition-colors flex items-center justify-center gap-2"
                    >
                      START SCORING
                    </button>
                  )}
                  {live && isAuthorizedScorer && (
                    isPaused && activeMatchId === match.id ? (
                      <button 
                        onClick={() => {
                          resumeMatch();
                          navigateTo('scoring');
                        }}
                        className="w-full bg-emerald-600 hover:bg-emerald-500 text-white rounded-[12px] py-4 font-bold text-[16px] shadow-md active:scale-98 transition-all flex items-center justify-center gap-2 animate-pulse cursor-pointer"
                      >
                        <Play size={20} fill="currentColor" /> RESUME SCORING TO CONTINUE
                      </button>
                    ) : (
                      <button 
                        onClick={() => navigateTo('scoring')}
                        className="w-full bg-[#0FA968] text-white rounded-[12px] py-4 font-bold text-[16px] shadow-md active:bg-[#0a7d4e] transition-colors flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <Radio size={20} /> LIVE SCORING CONSOLE
                      </button>
                    )
                  )}
                </>
              );
            })()}
          </div>
        )}

        {/* â”€â”€ TAB 2: SCORECARD â”€â”€ */}
        {activeTab === 'scorecard' && (
          <div className="space-y-4">
            <div className="bg-white rounded-[16px] shadow-sm border border-gray-100 p-4">
              <MatchScorecard match={displayMatch} />
            </div>
            <div className="text-center pt-2">
              <button
                onClick={() => navigateTo('scorecard')}
                className="px-4 py-2 bg-[#2457D6] hover:bg-[#1b41a8] text-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer inline-flex items-center gap-1.5"
              >
                <span>Open Full Official Scorecard (Print / Share)</span>
              </button>
            </div>
          </div>
        )}

        {/* ── TAB 3: HIGHLIGHTS ── */}
        {activeTab === 'highlights' && (() => {
          const potmPlayer = (h?.playerOfMatch?.name && h.playerOfMatch) ||
            (displayMatch.man_of_the_match?.name || displayMatch.man_of_the_match?.full_name ? displayMatch.man_of_the_match : null) ||
            (displayMatch.playerOfMatch?.name || displayMatch.playerOfMatch?.full_name ? displayMatch.playerOfMatch : null) ||
            (displayMatch.manOfTheMatch?.name || displayMatch.manOfTheMatch?.full_name ? displayMatch.manOfTheMatch : null) ||
            (match.man_of_the_match?.name || match.man_of_the_match?.full_name ? match.man_of_the_match : null) ||
            (match.playerOfMatch?.name || match.playerOfMatch?.full_name ? match.playerOfMatch : null) ||
            (typeof displayMatch.man_of_the_match === 'string' ? { name: displayMatch.man_of_the_match } : null) ||
            (typeof match.man_of_the_match === 'string' ? { name: match.man_of_the_match } : null);
          return (
            <div className="space-y-4">
              {[['TOP BATTER', h.topBatter, '#2457D6'], ['TOP BOWLER', h.topBowler, '#F05A47'], ['POTM', potmPlayer, '#ff6100']].map(([label, p, color], i) => (
                <div key={label} className="bg-white rounded-[16px] p-5 border border-gray-100 shadow-sm relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-2 h-full" style={{ backgroundColor: color }} />
                  <div className="text-xs font-bold tracking-widest uppercase text-[#8a99b0] mb-2">{label}</div>
                  <div className="text-[18px] font-black text-[#101827] mb-1">{p?.name || p?.full_name || (typeof p === 'string' ? p : 'Waiting for completion')}</div>
                  <div className="text-[14px] font-bold text-[#596579]">{p?.stat || p?.batting || p?.bowling || (label === 'POTM' && (p?.name || p?.full_name) ? 'Official Award' : 'Data recorded soon')}</div>
                </div>
              ))}
            </div>
          );
        })()}

        {/* â”€â”€ TAB 4: MEDIA â”€â”€ */}
        {activeTab === 'media' && (
          <div className="bg-white rounded-[16px] shadow-sm border border-gray-100 p-4">
            {live ? (
              <div className="text-center py-8">
                <FileText size={32} className="mx-auto text-[#d2d8e2] mb-3" />
                <h3 className="text-[16px] font-bold text-[#101827] mb-1">Media Report Pending</h3>
                <p className="text-[13px] text-[#8a99b0]">The automated match report will be generated when the match completes.</p>
              </div>
            ) : (
              <MatchMediaReport match={match} />
            )}
          </div>
        )}
      </div>
    </div>
  );
}
