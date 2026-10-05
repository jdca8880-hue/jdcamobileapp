import React, { useMemo, useState } from 'react';
import { Plus, Search, CalendarDays, ArrowRight, MapPin, Radio, Activity, Clock } from 'lucide-react';
import { useCricket } from '../../context/CricketContext';
import { MatchStatusBadge } from '../ui/Badge';
import { MatchCard } from '../ui/MatchCard';
import { LiveMatchCard } from '../ui/LiveMatchCard';
import { useLiveMatchesSync } from '../../hooks/useLiveMatchesSync';

export default function MatchesScreen() {
  useLiveMatchesSync();
  const { matches = [], navigateTo, setActiveMatchId, userRole, userName, userEmail, userId } = useCricket();
  const [activeTab, setActiveTab] = useState(userRole === 'SCORER' ? 'my_matches' : 'all');

  const isMatchLive = (status) => {
    const s = String(status || '').toUpperCase();
    return s === 'LIVE' || s === 'IN_PROGRESS' || s === 'INNINGS_BREAK';
  };

  const allLiveMatches = useMemo(() => {
    return matches.filter(m => isMatchLive(m.status));
  }, [matches]);

  const TABS = useMemo(() => {
    const liveCount = allLiveMatches.length;
    const baseTabs = [
      { id: 'all', label: 'All Fixtures' },
      { 
        id: 'live', 
        label: (
          <span className="flex items-center gap-1.5">
            {liveCount > 0 && <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />}
            <span>Live Matches</span>
            {liveCount > 0 && (
              <span className="bg-rose-500 text-white text-[10px] font-black px-1.5 py-0.2 rounded-full shadow-2xs">
                {liveCount}
              </span>
            )}
          </span>
        ) 
      },
      { id: 'upcoming', label: 'Upcoming' },
      { id: 'completed', label: 'Completed' },
    ];
    if (userRole === 'SCORER') {
      return [{ id: 'my_matches', label: 'My Matches' }, ...baseTabs];
    }
    return baseTabs;
  }, [userRole, allLiveMatches.length]);

  const filtered = useMemo(() => matches.filter(m => {
    if (activeTab === 'my_matches') {
      // Scorer assignment matching (by name or email fallback)
      const sName = m.scorer_name?.trim().toLowerCase();
      const uName = userName?.trim().toLowerCase();
      const uEmail = userEmail?.trim().toLowerCase();
      return (sName === uName && !!uName) || (sName === uEmail && !!uEmail) || (m.scorer_id === userId);
    }

    const status = String(m.status || '').toUpperCase();
    const live = isMatchLive(status);
    const upcoming = status === 'UPCOMING' || status === 'SCHEDULED';
    const completed = status === 'COMPLETED' || status === 'FINISHED';
    
    if (activeTab === 'live') return live;
    if (activeTab === 'upcoming') return upcoming;
    if (activeTab === 'completed') return completed;
    return true;
  }), [matches, activeTab, userName, userEmail, userId]);

  const openMatch = (match) => {
    setActiveMatchId(match.id);
    navigateTo('match-overview');
  };

  const myScoringMatches = filtered;
  const liveMatches = activeTab === 'all' 
    ? allLiveMatches 
    : filtered.filter(m => isMatchLive(m.status));
  const upcomingMatches = filtered.filter(m => m.status === 'UPCOMING' || m.status === 'SCHEDULED');
  const completedMatches = filtered.filter(m => m.status === 'COMPLETED' || m.status === 'FINISHED');

  return (
    <div className="pb-[100px] bg-slate-50 min-h-screen">
      {/* Header Tabs */}
      <div className="bg-white/95 backdrop-blur-md px-4 pt-3 pb-2 border-b border-gray-200 sticky top-0 z-30 shadow-2xs">
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
          {TABS.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`whitespace-nowrap px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === tab.id 
                  ? 'bg-[#101827] text-white shadow-xs' 
                  : 'bg-[#f0f2f4] text-[#596579] hover:bg-[#e5e8ec]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="px-4 pt-5">
        {/* DEDICATED LIVE TAB VIEW */}
        {activeTab === 'live' && (
          <div className="space-y-4">
            <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping" />
                  <h1 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">
                    JDCA Live Match Center
                  </h1>
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  Real-time live scores, ball tracking, and scorer controls for all in-progress matches.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-black bg-rose-50 text-rose-700 border border-rose-200 px-3 py-1 rounded-full shadow-2xs flex items-center gap-1.5">
                  <Activity size={13} className="text-rose-600 animate-pulse" />
                  {allLiveMatches.length} {allLiveMatches.length === 1 ? 'Match' : 'Matches'} Live
                </span>
              </div>
            </div>

            {liveMatches.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {liveMatches.map(match => (
                  <LiveMatchCard key={match.id} match={match} onClick={() => openMatch(match)} />
                ))}
              </div>
            ) : (
              <div className="text-center py-16 px-4 bg-white rounded-2xl border border-slate-200 shadow-2xs">
                <Radio size={40} className="mx-auto text-slate-300 mb-3" />
                <h3 className="text-base font-bold text-slate-900 mb-1">No Matches Currently Live</h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto mb-4">
                  When tournament fixtures commence on ground, their real-time live scorecards and scoring desks will appear here.
                </p>
                <button
                  onClick={() => setActiveTab('upcoming')}
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
                >
                  View Upcoming Fixtures
                </button>
              </div>
            )}
          </div>
        )}

        {/* MY MATCHES TAB (For Scorer) */}
        {activeTab === 'my_matches' && (
          <div className="space-y-4">
            <h2 className="text-[12px] font-black uppercase tracking-widest text-[#2457D6] mb-2 ml-1 flex items-center gap-2">
              <CalendarDays size={14} /> My Assigned Matches
            </h2>
            {myScoringMatches.length > 0 ? (
              <div className="space-y-3">
                {myScoringMatches.map(match => {
                  const isLive = isMatchLive(match.status);
                  if (isLive) {
                    return <LiveMatchCard key={match.id} match={match} onClick={() => openMatch(match)} />;
                  }
                  return <MatchCard key={match.id} match={match} onClick={() => openMatch(match)} />;
                })}
              </div>
            ) : (
              <div className="text-center py-12 px-4 bg-white rounded-[16px] border border-gray-100">
                <CalendarDays size={32} className="mx-auto text-[#d2d8e2] mb-3" />
                <h3 className="text-[16px] font-bold text-[#101827] mb-1">No Assigned Matches</h3>
                <p className="text-[13px] text-[#8a99b0]">You currently have no matches assigned to score.</p>
              </div>
            )}
          </div>
        )}

        {/* ALL FIXTURES TAB */}
        {activeTab === 'all' && (
          <div className="space-y-6">
            {/* Live in progress games first */}
            {liveMatches.length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center justify-between ml-1">
                  <h2 className="text-[12px] font-black uppercase tracking-widest text-slate-900 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
                    Live In Progress
                  </h2>
                  <span className="text-xs font-black bg-rose-50 text-rose-700 px-2.5 py-0.5 rounded-full border border-rose-200 shadow-2xs">
                    {liveMatches.length} Live
                  </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                  {liveMatches.map(match => (
                    <LiveMatchCard key={match.id} match={match} onClick={() => openMatch(match)} />
                  ))}
                </div>
              </div>
            )}

            {/* Upcoming */}
            {upcomingMatches.length > 0 && (
              <div>
                <h2 className="text-[12px] font-black uppercase tracking-widest text-[#596579] mb-3 ml-1">Upcoming Fixtures</h2>
                {upcomingMatches.map(match => (
                  <MatchCard key={match.id} match={match} onClick={() => openMatch(match)} />
                ))}
              </div>
            )}

            {/* Completed */}
            {completedMatches.length > 0 && (
              <div>
                <h2 className="text-[12px] font-black uppercase tracking-widest text-[#596579] mb-3 ml-1">Completed Results</h2>
                {completedMatches.map(match => (
                  <MatchCard key={match.id} match={match} onClick={() => openMatch(match)} />
                ))}
              </div>
            )}
          </div>
        )}

        {/* UPCOMING TAB */}
        {activeTab === 'upcoming' && (
          <div>
            <h2 className="text-[12px] font-black uppercase tracking-widest text-[#596579] mb-3 ml-1">Upcoming Fixtures</h2>
            {upcomingMatches.length > 0 ? (
              upcomingMatches.map(match => (
                <MatchCard key={match.id} match={match} onClick={() => openMatch(match)} />
              ))
            ) : (
              <div className="text-center py-12 px-4 bg-white rounded-[16px] border border-gray-100">
                <Clock size={32} className="mx-auto text-[#d2d8e2] mb-3" />
                <h3 className="text-[16px] font-bold text-[#101827] mb-1">No Upcoming Matches</h3>
                <p className="text-[13px] text-[#8a99b0]">No upcoming tournament fixtures scheduled.</p>
              </div>
            )}
          </div>
        )}

        {/* COMPLETED TAB */}
        {activeTab === 'completed' && (
          <div>
            <h2 className="text-[12px] font-black uppercase tracking-widest text-[#596579] mb-3 ml-1">Completed Results</h2>
            {completedMatches.length > 0 ? (
              completedMatches.map(match => (
                <MatchCard key={match.id} match={match} onClick={() => openMatch(match)} />
              ))
            ) : (
              <div className="text-center py-12 px-4 bg-white rounded-[16px] border border-gray-100">
                <CalendarDays size={32} className="mx-auto text-[#d2d8e2] mb-3" />
                <h3 className="text-[16px] font-bold text-[#101827] mb-1">No Completed Matches</h3>
                <p className="text-[13px] text-[#8a99b0]">No finalized matches found.</p>
              </div>
            )}
          </div>
        )}

        {filtered.length === 0 && activeTab !== 'live' && activeTab !== 'upcoming' && activeTab !== 'completed' && activeTab !== 'my_matches' && (
          <div className="text-center py-12 px-4 bg-white rounded-[16px] border border-gray-100 mt-4">
            <CalendarDays size={32} className="mx-auto text-[#d2d8e2] mb-3" />
            <h3 className="text-[16px] font-bold text-[#101827] mb-1">No Matches Found</h3>
            <p className="text-[13px] text-[#8a99b0]">No matches match the selected criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
}
