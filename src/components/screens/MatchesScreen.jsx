import React, { useMemo, useState } from 'react';
import { Plus, Search, CalendarDays, ArrowRight, MapPin } from 'lucide-react';
import { useCricket } from '../../context/CricketContext';
import { MatchStatusBadge } from '../ui/Badge';

import { MatchCard } from '../ui/MatchCard';

export default function MatchesScreen() {
  const { matches = [], navigateTo, setActiveMatchId, userRole, userName } = useCricket();
  const [activeTab, setActiveTab] = useState(userRole === 'SCORER' ? 'my_matches' : 'all');

  const TABS = useMemo(() => {
    const baseTabs = [
      { id: 'all', label: 'All' },
      { id: 'live', label: 'Live' },
      { id: 'upcoming', label: 'Upcoming' },
      { id: 'completed', label: 'Completed' },
    ];
    if (userRole === 'SCORER') {
      return [{ id: 'my_matches', label: 'My Matches' }, ...baseTabs];
    }
    return baseTabs;
  }, [userRole]);

  const filtered = useMemo(() => matches.filter(m => {
    if (activeTab === 'my_matches') {
      // Scorer assignment matching
      return (m.scorer_name === userName && userName) || (m.scorer_id === userName); // Fallback string match
    }

    const status = String(m.status || '').toUpperCase();
    const live = status === 'LIVE' || status === 'IN_PROGRESS';
    const upcoming = status === 'UPCOMING' || status === 'SCHEDULED';
    const completed = status === 'COMPLETED' || status === 'FINISHED';
    
    if (activeTab === 'live') return live;
    if (activeTab === 'upcoming') return upcoming;
    if (activeTab === 'completed') return completed;
    return true;
  }), [matches, activeTab, userName]);

  const openMatch = (match) => {
    setActiveMatchId(match.id);
    navigateTo('match-detail');
  };

  const myScoringMatches = filtered; // When activeTab is my_matches, filtered already has just those
  const liveMatches = filtered.filter(m => m.status === 'LIVE' || m.status === 'IN_PROGRESS');
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
              className={`whitespace-nowrap px-4 py-1.5 rounded-full text-xs font-bold transition-colors cursor-pointer ${
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

      <div className="px-4 pt-6">
        {/* MY MATCHES SECTION */}
        {activeTab === 'my_matches' && myScoringMatches.length > 0 && (
          <div className="mb-6">
            <h2 className="text-[12px] font-black uppercase tracking-widest text-[#2457D6] mb-3 ml-1 flex items-center gap-2">
              <CalendarDays size={14} /> My Assigned Matches
            </h2>
            {myScoringMatches.map(match => (
              <MatchCard key={match.id} match={match} onClick={() => openMatch(match)} />
            ))}
          </div>
        )}

        {/* LIVE SECTION */}
        {(activeTab === 'all' || activeTab === 'live') && liveMatches.length > 0 && (
          <div className="mb-6">
            <h2 className="text-[12px] font-black uppercase tracking-widest text-[#596579] mb-3 ml-1">Today</h2>
            {liveMatches.map(match => (
              <MatchCard key={match.id} match={match} onClick={() => openMatch(match)} />
            ))}
          </div>
        )}

        {/* UPCOMING SECTION */}
        {(activeTab === 'all' || activeTab === 'upcoming') && upcomingMatches.length > 0 && (
          <div className="mb-6">
            <h2 className="text-[12px] font-black uppercase tracking-widest text-[#596579] mb-3 ml-1">Upcoming</h2>
            {upcomingMatches.map(match => (
              <MatchCard key={match.id} match={match} onClick={() => openMatch(match)} />
            ))}
          </div>
        )}

        {/* COMPLETED SECTION */}
        {(activeTab === 'all' || activeTab === 'completed') && completedMatches.length > 0 && (
          <div className="mb-6">
            <h2 className="text-[12px] font-black uppercase tracking-widest text-[#596579] mb-3 ml-1">Completed</h2>
            {completedMatches.map(match => (
              <MatchCard key={match.id} match={match} onClick={() => openMatch(match)} />
            ))}
          </div>
        )}

        {filtered.length === 0 && (
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
