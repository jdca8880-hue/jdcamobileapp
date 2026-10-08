import React, { useState, useMemo } from 'react';
import {
  Users, Shield, Award, Radio, CheckCircle2, Clock, Calendar,
  MapPin, AlertCircle, Eye, Search, Filter, ChevronDown, ChevronUp,
  Activity, FileText, ArrowRight, Sparkles, Check, Phone, Mail
} from 'lucide-react';
import { useCricket } from '../../context/CricketContext';
import { MatchStatusBadge, RoleBadge } from '../ui/Badge';

export default function MatchOfficialsTab({ onAddUser }) {
  const { registeredUsers = [], matches = [], setActiveMatchId, navigateTo } = useCricket();

  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL'); // ALL, SCORER, UMPIRE, LIVE, ASSIGNED
  const [expandedOfficials, setExpandedOfficials] = useState({});

  // Toggle accordion for an official
  const toggleExpand = (id) => {
    setExpandedOfficials(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  // Compile unified officials list
  const officials = useMemo(() => {
    const list = [];
    const seenNames = new Set();
    const seenIds = new Set();

    // 1. Registered users who are Scorers, Umpires, or Admins
    registeredUsers.forEach(u => {
      const uRole = String(u.role || '').toUpperCase();
      const isScorer = uRole === 'SCORER';
      const isUmpire = uRole === 'UMPIRE';
      const isAdmin = uRole === 'SUPER_ADMIN' || uRole === 'DISTRICT_ADMIN';

      // Check if this user has any assigned matches
      const uNameLower = String(u.name || '').trim().toLowerCase();
      const uEmailLower = String(u.email || '').trim().toLowerCase();
      const uIdStr = String(u.id || '');

      const assignedAsScorer = matches.filter(m => {
        const mScorerId = String(m.scorer_id || m.scorerId || '');
        const mScorerName = String(m.scorer_name || m.scorerName || '').trim().toLowerCase();
        return (mScorerId && mScorerId === uIdStr) ||
               (mScorerName && (mScorerName === uNameLower || mScorerName === uEmailLower));
      });

      const assignedAsUmpire = matches.filter(m => {
        const mUmpireName = String(m.umpire_name || m.umpireName || '').trim().toLowerCase();
        const setupUmpires = m.matchSetup?.umpires || {};
        const isNamedInSetup = Object.values(setupUmpires).some(name => 
          typeof name === 'string' && name.trim().toLowerCase() === uNameLower
        );
        return (mUmpireName && mUmpireName === uNameLower) || isNamedInSetup;
      });

      // Include if role is Scorer/Umpire OR if they have assignments
      if (isScorer || isUmpire || assignedAsScorer.length > 0 || assignedAsUmpire.length > 0) {
        seenIds.add(uIdStr);
        if (uNameLower) seenNames.add(uNameLower);

        // Combine all unique matches
        const allAssignedMatchesMap = new Map();
        assignedAsScorer.forEach(m => allAssignedMatchesMap.set(m.id, { match: m, roleOnMatch: 'SCORER' }));
        assignedAsUmpire.forEach(m => {
          if (allAssignedMatchesMap.has(m.id)) {
            allAssignedMatchesMap.set(m.id, { match: m, roleOnMatch: 'BOTH' });
          } else {
            allAssignedMatchesMap.set(m.id, { match: m, roleOnMatch: 'UMPIRE' });
          }
        });

        const assignedMatchesList = Array.from(allAssignedMatchesMap.values());

        // Determine specific official type
        let primaryType = 'OFFICIAL';
        if (isScorer && isUmpire) primaryType = 'BOTH';
        else if (isScorer || (assignedAsScorer.length > 0 && assignedAsUmpire.length === 0)) primaryType = 'SCORER';
        else if (isUmpire || (assignedAsUmpire.length > 0 && assignedAsScorer.length === 0)) primaryType = 'UMPIRE';
        else if (assignedAsScorer.length > 0 && assignedAsUmpire.length > 0) primaryType = 'BOTH';

        list.push({
          id: u.id,
          name: u.name,
          email: u.email || 'N/A',
          officialType: primaryType,
          originalRole: u.role,
          district: u.district || 'Jabalpur District',
          status: u.status || 'Active',
          isRegisteredUser: true,
          assignedMatches: assignedMatchesList
        });
      }
    });

    // 2. Discover any additional officials assigned by name in matches that are not registered accounts
    matches.forEach(m => {
      const sName = String(m.scorer_name || m.scorerName || '').trim();
      if (sName && !seenNames.has(sName.toLowerCase())) {
        seenNames.add(sName.toLowerCase());
        const scorerMatches = matches.filter(om => 
          String(om.scorer_name || om.scorerName || '').trim().toLowerCase() === sName.toLowerCase()
        ).map(om => ({ match: om, roleOnMatch: 'SCORER' }));

        list.push({
          id: `match-scorer-${sName.toLowerCase().replace(/\s+/g, '-')}`,
          name: sName,
          email: 'Match-Assigned Scorer',
          officialType: 'SCORER',
          originalRole: 'SCORER',
          district: 'Jabalpur District',
          status: 'Active',
          isRegisteredUser: false,
          assignedMatches: scorerMatches
        });
      }

      const uName = String(m.umpire_name || m.umpireName || '').trim();
      if (uName && !seenNames.has(uName.toLowerCase())) {
        seenNames.add(uName.toLowerCase());
        const umpireMatches = matches.filter(om => 
          String(om.umpire_name || om.umpireName || '').trim().toLowerCase() === uName.toLowerCase()
        ).map(om => ({ match: om, roleOnMatch: 'UMPIRE' }));

        list.push({
          id: `match-umpire-${uName.toLowerCase().replace(/\s+/g, '-')}`,
          name: uName,
          email: 'Match-Assigned Umpire',
          officialType: 'UMPIRE',
          originalRole: 'UMPIRE',
          district: 'Jabalpur District',
          status: 'Active',
          isRegisteredUser: false,
          assignedMatches: umpireMatches
        });
      }
    });

    return list;
  }, [registeredUsers, matches]);

  // Officials categorized & live duty calculation
  const enrichedOfficials = useMemo(() => {
    return officials.map(off => {
      const liveMatches = off.assignedMatches.filter(item => 
        ['LIVE', 'IN_PROGRESS', 'INNINGS_BREAK'].includes(String(item.match?.status || '').toUpperCase())
      );
      const scheduledMatches = off.assignedMatches.filter(item => 
        ['SCHEDULED', 'UPCOMING'].includes(String(item.match?.status || '').toUpperCase())
      );
      const completedMatches = off.assignedMatches.filter(item => 
        ['COMPLETED', 'FINISHED'].includes(String(item.match?.status || '').toUpperCase())
      );

      let dutyStatus = 'IDLE';
      if (liveMatches.length > 0) dutyStatus = 'ON_LIVE_DUTY';
      else if (scheduledMatches.length > 0) dutyStatus = 'ASSIGNED_UPCOMING';
      else if (completedMatches.length > 0) dutyStatus = 'COMPLETED';

      return {
        ...off,
        liveMatches,
        scheduledMatches,
        completedMatches,
        dutyStatus,
        totalAssigned: off.assignedMatches.length
      };
    });
  }, [officials]);

  // Filtered officials list based on Search & Tabs
  const filteredOfficials = useMemo(() => {
    return enrichedOfficials.filter(off => {
      // Role / Duty Filter
      if (roleFilter === 'SCORER' && off.officialType !== 'SCORER' && off.officialType !== 'BOTH') return false;
      if (roleFilter === 'UMPIRE' && off.officialType !== 'UMPIRE' && off.officialType !== 'BOTH') return false;
      if (roleFilter === 'LIVE' && off.dutyStatus !== 'ON_LIVE_DUTY') return false;
      if (roleFilter === 'ASSIGNED' && off.totalAssigned === 0) return false;

      // Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesQuery = off.name.toLowerCase().includes(q) ||
          off.email.toLowerCase().includes(q) ||
          off.district.toLowerCase().includes(q) ||
          off.assignedMatches.some(m => 
            String(m.match?.home_team?.name || '').toLowerCase().includes(q) ||
            String(m.match?.away_team?.name || '').toLowerCase().includes(q) ||
            String(m.match?.tournament || '').toLowerCase().includes(q) ||
            String(m.match?.venue_name || '').toLowerCase().includes(q)
          );
        if (!matchesQuery) return false;
      }

      return true;
    });
  }, [enrichedOfficials, roleFilter, searchQuery]);

  // Overall statistics
  const stats = useMemo(() => {
    const total = enrichedOfficials.length;
    const scorers = enrichedOfficials.filter(o => o.officialType === 'SCORER' || o.officialType === 'BOTH').length;
    const umpires = enrichedOfficials.filter(o => o.officialType === 'UMPIRE' || o.officialType === 'BOTH').length;
    const onLiveDuty = enrichedOfficials.filter(o => o.dutyStatus === 'ON_LIVE_DUTY').length;
    const withAssignments = enrichedOfficials.filter(o => o.totalAssigned > 0).length;

    return { total, scorers, umpires, onLiveDuty, withAssignments };
  }, [enrichedOfficials]);

  const handleOpenMatch = (matchId) => {
    if (!matchId) return;
    setActiveMatchId(matchId);
    navigateTo('match-detail');
  };

  return (
    <div className="space-y-6 animate-in fade-in zoom-in-95 duration-200">
      
      {/* ── Top Header & KPI Dashboard ── */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold shrink-0">
            <Users size={22} />
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900 font-tabular">{stats.total}</div>
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Officials</div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold shrink-0">
            <Radio size={22} className={stats.onLiveDuty > 0 ? "animate-pulse" : ""} />
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900 font-tabular flex items-center gap-2">
              {stats.onLiveDuty}
              {stats.onLiveDuty > 0 && (
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              )}
            </div>
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Live On Duty</div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold shrink-0">
            <FileText size={22} />
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900 font-tabular">{stats.scorers}</div>
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Active Scorers</div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold shrink-0">
            <Award size={22} />
          </div>
          <div>
            <div className="text-2xl font-black text-slate-900 font-tabular">{stats.umpires}</div>
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Match Umpires</div>
          </div>
        </div>
      </div>

      {/* ── Control Bar: Search & Filter Tabs ── */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          {/* Search Box */}
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search official by name, email, district or match team..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-blue-500 focus:outline-none transition-all"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 font-bold"
              >
                ✕
              </button>
            )}
          </div>

          {/* Action to create new official user */}
          {onAddUser && (
            <button
              onClick={onAddUser}
              className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 shrink-0 shadow-sm"
            >
              <span>+ Add Official User</span>
            </button>
          )}
        </div>

        {/* Filter Chips */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none text-xs font-bold">
          <span className="text-slate-400 text-[11px] uppercase tracking-wider shrink-0 mr-1 flex items-center gap-1">
            <Filter size={12} /> Filter:
          </span>
          {[
            { id: 'ALL', label: `All (${enrichedOfficials.length})` },
            { id: 'LIVE', label: `On Live Duty (${stats.onLiveDuty})`, badgeColor: stats.onLiveDuty > 0 ? 'bg-emerald-500 text-white' : '' },
            { id: 'SCORER', label: `Scorers (${stats.scorers})` },
            { id: 'UMPIRE', label: `Umpires (${stats.umpires})` },
            { id: 'ASSIGNED', label: `With Matches (${stats.withAssignments})` },
          ].map(f => (
            <button
              key={f.id}
              onClick={() => setRoleFilter(f.id)}
              className={`px-3 py-1.5 rounded-lg transition-all shrink-0 cursor-pointer ${
                roleFilter === f.id
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Officials Profiles & Match State Cards ── */}
      {filteredOfficials.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center shadow-sm">
          <div className="w-14 h-14 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-3 text-slate-400">
            <Users size={24} />
          </div>
          <h4 className="text-base font-bold text-slate-900">No Officials Found</h4>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            No scorers or umpires match your current search or filter criteria. Try resetting the filters.
          </p>
          <button
            onClick={() => { setSearchQuery(''); setRoleFilter('ALL'); }}
            className="mt-4 px-4 py-2 bg-slate-100 text-slate-700 text-xs font-bold rounded-xl hover:bg-slate-200 transition cursor-pointer"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOfficials.map(official => {
            const isExpanded = !!expandedOfficials[official.id];
            const hasMatches = official.assignedMatches.length > 0;

            // Duty status badge styling
            let dutyBadgeBg = 'bg-slate-100 text-slate-600 border-slate-200';
            let dutyLabel = 'Off Duty';
            let dotColor = 'bg-slate-400';

            if (official.dutyStatus === 'ON_LIVE_DUTY') {
              dutyBadgeBg = 'bg-emerald-50 text-emerald-700 border-emerald-200 shadow-xs';
              dutyLabel = `${official.liveMatches.length} Live Match Active`;
              dotColor = 'bg-emerald-500 animate-ping';
            } else if (official.dutyStatus === 'ASSIGNED_UPCOMING') {
              dutyBadgeBg = 'bg-blue-50 text-blue-700 border-blue-200';
              dutyLabel = `${official.scheduledMatches.length} Scheduled`;
              dotColor = 'bg-blue-500';
            } else if (official.dutyStatus === 'COMPLETED') {
              dutyBadgeBg = 'bg-slate-100 text-slate-700 border-slate-200';
              dutyLabel = 'Past Duties Completed';
              dotColor = 'bg-slate-400';
            }

            // Role visual theme
            const isScorerType = official.officialType === 'SCORER' || official.officialType === 'BOTH';
            const isUmpireType = official.officialType === 'UMPIRE' || official.officialType === 'BOTH';

            return (
              <div
                key={official.id}
                className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden transition-all hover:border-slate-300"
              >
                {/* ── Official Profile Header ── */}
                <div className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100">
                  <div className="flex items-start sm:items-center gap-3.5">
                    {/* Official Avatar with Role Ring */}
                    <div className="relative shrink-0">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-sm font-black text-white shadow-sm ${
                        official.officialType === 'BOTH'
                          ? 'bg-gradient-to-br from-blue-600 to-purple-600'
                          : official.officialType === 'UMPIRE'
                            ? 'bg-gradient-to-br from-purple-600 to-indigo-600'
                            : 'bg-gradient-to-br from-blue-600 to-cyan-600'
                      }`}>
                        {official.name.substring(0, 2).toUpperCase()}
                      </div>
                      {official.dutyStatus === 'ON_LIVE_DUTY' && (
                        <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-white flex items-center justify-center">
                          <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                        </span>
                      )}
                    </div>

                    {/* Official Credentials */}
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-extrabold text-slate-900 text-base">{official.name}</h3>
                        
                        {/* Official Badges */}
                        <div className="flex items-center gap-1.5">
                          {isScorerType && (
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-700 border border-blue-200">
                              Scorer
                            </span>
                          )}
                          {isUmpireType && (
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-100 text-purple-700 border border-purple-200">
                              Umpire
                            </span>
                          )}
                          {!official.isRegisteredUser && (
                            <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-amber-50 text-amber-700 border border-amber-200">
                              Fixture Nominated
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-y-1 gap-x-3 mt-1 text-xs text-slate-500 font-medium">
                        <span className="flex items-center gap-1">
                          <Mail size={12} className="text-slate-400" /> {official.email}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin size={12} className="text-slate-400" /> {official.district}
                        </span>
                        <span className="inline-flex items-center gap-1 text-[11px] text-slate-400 font-semibold">
                          ● {official.status} Account
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Duty Status Badge & Quick Match Count */}
                  <div className="flex items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-50">
                    <div className={`px-3 py-1.5 rounded-xl border text-xs font-bold flex items-center gap-2 ${dutyBadgeBg}`}>
                      <span className={`w-2 h-2 rounded-full ${dotColor}`} />
                      <span>{dutyLabel}</span>
                    </div>

                    <button
                      onClick={() => toggleExpand(official.id)}
                      className="px-3 py-1.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-xs font-bold text-slate-700 flex items-center gap-1.5 transition cursor-pointer"
                    >
                      <span>Matches ({official.totalAssigned})</span>
                      {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                    </button>
                  </div>
                </div>

                {/* ── Match Assignments Breakdown ── */}
                <div className="bg-slate-50/60 p-4 sm:p-5">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                      <Calendar size={13} className="text-slate-400" />
                      Assigned Match Roster ({official.totalAssigned})
                    </span>

                    {hasMatches && (
                      <span className="text-xs text-slate-500 font-medium">
                        {official.liveMatches.length > 0 && <span className="text-emerald-600 font-bold">{official.liveMatches.length} Live</span>}
                        {official.liveMatches.length > 0 && official.scheduledMatches.length > 0 && " · "}
                        {official.scheduledMatches.length > 0 && <span className="text-blue-600 font-bold">{official.scheduledMatches.length} Upcoming</span>}
                      </span>
                    )}
                  </div>

                  {!hasMatches ? (
                    <div className="bg-white rounded-xl border border-dashed border-slate-300 p-4 text-center text-xs text-slate-500">
                      No match duty assignments recorded for this official yet. When assigned during fixture creation or match setup, live states will appear here.
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {/* If expanded show all matches, otherwise show up to 2 priority matches */}
                      {(isExpanded ? official.assignedMatches : official.assignedMatches.slice(0, 2)).map(({ match, roleOnMatch }) => {
                        const mStatus = String(match?.status || 'SCHEDULED').toUpperCase();
                        const isLiveMatch = ['LIVE', 'IN_PROGRESS', 'INNINGS_BREAK'].includes(mStatus);
                        const isCompletedMatch = ['COMPLETED', 'FINISHED'].includes(mStatus);
                        const isScheduledMatch = ['SCHEDULED', 'UPCOMING'].includes(mStatus);

                        const homeName = match?.home_team?.name || match?.home_team_name || 'Home Team';
                        const awayName = match?.away_team?.name || match?.away_team_name || 'Away Team';
                        const matchDateStr = match?.scheduled_at ? new Date(match.scheduled_at).toLocaleDateString(undefined, {
                          month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
                        }) : 'Date TBD';

                        // Card border styling based on match live state
                        let cardBorder = 'border-slate-200 bg-white';
                        if (isLiveMatch) cardBorder = 'border-emerald-300 bg-emerald-50/20 shadow-sm';
                        else if (isCompletedMatch) cardBorder = 'border-slate-200 bg-white/90';

                        return (
                          <div
                            key={match?.id || Math.random()}
                            className={`p-3.5 rounded-xl border flex flex-col justify-between transition-all ${cardBorder}`}
                          >
                            <div>
                              {/* Header: Tournament & Status */}
                              <div className="flex items-center justify-between gap-2 mb-2">
                                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 truncate max-w-[65%]">
                                  {match?.tournament || 'JDCA Fixture'}
                                </span>
                                <MatchStatusBadge status={mStatus} />
                              </div>

                              {/* Teams & Scores */}
                              <div className="space-y-1.5 my-2">
                                <div className="flex items-center justify-between text-xs font-bold text-slate-900">
                                  <span className="truncate pr-2">{homeName}</span>
                                  <span className="font-tabular text-slate-700">
                                    {match?.home_team?.score || (isLiveMatch ? 'Batting' : '')}
                                  </span>
                                </div>
                                <div className="flex items-center justify-between text-xs font-bold text-slate-900">
                                  <span className="truncate pr-2">{awayName}</span>
                                  <span className="font-tabular text-slate-700">
                                    {match?.away_team?.score || (isLiveMatch ? 'Yet to bat' : '')}
                                  </span>
                                </div>
                              </div>

                              {/* Live Match State Highlight */}
                              {isLiveMatch && (
                                <div className="mt-2 py-1.5 px-2.5 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center justify-between text-[11px] font-bold text-emerald-800">
                                  <span className="flex items-center gap-1.5">
                                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                    Scoring Active
                                  </span>
                                  <span>{match?.home_team?.overs || match?.away_team?.overs || 'Over 1'}</span>
                                </div>
                              )}

                              {/* Completed Match Result */}
                              {isCompletedMatch && (match?.result_text || match?.result) && (
                                <div className="mt-2 py-1 px-2 rounded-lg bg-slate-50 border border-slate-200 text-[11px] font-bold text-slate-700 truncate">
                                  🏆 {match.result_text || match.result}
                                </div>
                              )}
                            </div>

                            {/* Footer: Date, Venue, Role on match & Link */}
                            <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px]">
                              <div className="text-slate-500 font-medium truncate max-w-[65%]">
                                <span className="font-bold text-slate-700">
                                  {roleOnMatch === 'SCORER' ? '📝 Primary Scorer' : roleOnMatch === 'UMPIRE' ? '⚖️ On-Field Umpire' : '📝 Scorer & Umpire'}
                                </span>
                                <div className="text-[10px] text-slate-400 mt-0.5 truncate">
                                  {matchDateStr} {match?.venue_name ? `· ${match.venue_name}` : ''}
                                </div>
                              </div>

                              <button
                                onClick={() => handleOpenMatch(match?.id)}
                                className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg font-bold text-[10px] flex items-center gap-1 transition cursor-pointer"
                              >
                                <span>Match Center</span>
                                <ArrowRight size={10} />
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* Show "View more matches" trigger if not expanded and there are > 2 matches */}
                  {hasMatches && !isExpanded && official.assignedMatches.length > 2 && (
                    <button
                      onClick={() => toggleExpand(official.id)}
                      className="mt-3 w-full py-1.5 text-center text-xs font-bold text-blue-600 hover:text-blue-700 bg-white rounded-xl border border-slate-200 transition cursor-pointer"
                    >
                      + View {official.assignedMatches.length - 2} more assigned matches
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
