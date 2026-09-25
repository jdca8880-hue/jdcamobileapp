import React, { useState } from 'react';
import { ArrowLeft, CalendarDays, MapPin, Radio, ShieldCheck, Trophy, Users, FileText, Trash2 } from 'lucide-react';
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
  const { matches = [], activeMatchId, navigateTo, goBack, userRole, registeredUsers = [] } = useCricket();
  const [activeTab, setActiveTab] = useState('info');
  const [isDeleting, setIsDeleting] = useState(false);
  const [selectedScorer, setSelectedScorer] = useState('');
  const [isAssigning, setIsAssigning] = useState(false);

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
      alert('Failed to delete match.');
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

  const match = matches.find(m => m.id === activeMatchId) || matches[0];
  if (!match) return null;
  
  const h = calculateMatchHighlights(match);
  const live = match.status === 'LIVE' || match.status === 'IN_PROGRESS';

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

        {userRole === 'SUPER_ADMIN' && (
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
            {match.tournament || 'JDCA Official Fixture'}
          </div>

          {live && (
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-white text-xs font-bold mb-4">
              <span className="w-2 h-2 rounded-full bg-[#0FA968] animate-pulse" />
              LIVE MATCH
            </div>
          )}

          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="flex-1 text-right">
              <div className="text-[20px] font-black leading-tight mb-1">{match.teamA?.name || 'JABALPUR'}</div>
              <div className="text-[32px] font-black text-[#ff6100] tracking-tighter leading-none">{match.teamA?.score || (live ? '142/4' : '186/4')}</div>
              {live && <div className="text-[12px] font-bold text-white/80 mt-1">{match.teamA?.overs || '24.2'} ov</div>}
            </div>
            
            <div className="w-8 flex-shrink-0 flex flex-col items-center justify-center text-white/40">
              <div className="h-4 w-px bg-white/20 mb-2"></div>
              <div className="text-xs font-black uppercase">VS</div>
              <div className="h-4 w-px bg-white/20 mt-2"></div>
            </div>

            <div className="flex-1 text-left">
              <div className="text-[20px] font-black leading-tight mb-1">{match.teamB?.name || 'MANDLA'}</div>
              <div className="text-[32px] font-black text-white tracking-tighter leading-none">{match.teamB?.score || (live ? '—' : '184/8')}</div>
              {!live && <div className="text-[12px] font-bold text-white/80 mt-1">40.0 ov</div>}
            </div>
          </div>

          <div className="text-[13px] font-bold text-white/90 bg-white/10 py-2 px-4 rounded-xl inline-block max-w-[90%] mx-auto">
            {live ? 'Jabalpur elected to bat first' : (match.resultText || match.result || 'Jabalpur won by 2 runs')}
          </div>
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
                  <span className="font-bold text-[#101827]">{match.format || '40 Overs'} Â· {match.ballType || 'White Ball'}</span>
                </div>
                <div className="flex justify-between p-4">
                  <span className="text-[#8a99b0] font-medium">Category</span>
                  <span className="font-bold text-[#101827]">{match.category || match.ageGroup || 'Senior Division'}</span>
                </div>
                <div className="flex justify-between p-4">
                  <span className="text-[#8a99b0] font-medium">Venue</span>
                  <span className="font-bold text-[#101827]">{match.venue || 'Ranital Cricket Ground'}</span>
                </div>
                <div className="flex justify-between p-4">
                  <span className="text-[#8a99b0] font-medium">Toss</span>
                  <span className="font-bold text-[#101827]">{match.tossDecision || 'Jabalpur won, elected to bat'}</span>
                </div>
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
                        <option key={u.id} value={u.name}>{u.name}</option>
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
                      SETUP & START MATCH
                    </button>
                  )}
                  {live && isAuthorizedScorer && (
                    <button 
                      onClick={() => navigateTo('scoring')}
                      className="w-full bg-[#0FA968] text-white rounded-[12px] py-4 font-bold text-[16px] shadow-md active:bg-[#0a7d4e] transition-colors flex items-center justify-center gap-2"
                    >
                      <Radio size={20} /> LIVE SCORING CONSOLE
                    </button>
                  )}
                </>
              );
            })()}
          </div>
        )}

        {/* â”€â”€ TAB 2: SCORECARD â”€â”€ */}
        {activeTab === 'scorecard' && (
          <div className="bg-white rounded-[16px] shadow-sm border border-gray-100 p-4">
            <MatchScorecard match={match} />
          </div>
        )}

        {/* â”€â”€ TAB 3: HIGHLIGHTS â”€â”€ */}
        {activeTab === 'highlights' && (
          <div className="space-y-4">
            {[['TOP BATTER', h.topBatter, '#2457D6'], ['TOP BOWLER', h.topBowler, '#F05A47'], ['POTM', h.playerOfMatch, '#ff6100']].map(([label, p, color], i) => (
              <div key={label} className="bg-white rounded-[16px] p-5 border border-gray-100 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 w-2 h-full" style={{ backgroundColor: color }} />
                <div className="text-xs font-bold tracking-widest uppercase text-[#8a99b0] mb-2">{label}</div>
                <div className="text-[18px] font-black text-[#101827] mb-1">{p?.name || 'Waiting for completion'}</div>
                <div className="text-[14px] font-bold text-[#596579]">{p?.stat || p?.batting || p?.bowling || 'Data recorded soon'}</div>
              </div>
            ))}
          </div>
        )}

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
