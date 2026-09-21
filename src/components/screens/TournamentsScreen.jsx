import React, { useMemo, useState, useEffect } from 'react';
import { Trophy, ChevronDown, ChevronUp, ChevronRight, Plus, Edit2, Trash2 } from 'lucide-react';
import { useCricket } from '../../context/CricketContext';
import { MatchCard } from '../ui/MatchCard';
import TournamentManagerModal from '../ui/TournamentManagerModal';
import { api } from '../../lib/api';

const TOURNAMENT_THEMES = [
  {
    header: 'bg-white',
    tag: 'bg-amber-500',
    cardBorder: 'border-slate-200 shadow-sm border-l-4 border-l-amber-500',
    progress: 'bg-amber-500',
    badge: 'bg-amber-50 text-amber-700 border-amber-200',
    textMain: 'text-slate-900',
    statBg: 'bg-slate-50 border-slate-100',
    statText: 'text-slate-800',
    statLabel: 'text-slate-500',
  },
  {
    header: 'bg-white',
    tag: 'bg-blue-500',
    cardBorder: 'border-slate-200 shadow-sm border-l-4 border-l-blue-500',
    progress: 'bg-blue-500',
    badge: 'bg-blue-50 text-blue-700 border-blue-200',
    textMain: 'text-slate-900',
    statBg: 'bg-slate-50 border-slate-100',
    statText: 'text-slate-800',
    statLabel: 'text-slate-500',
  },
  {
    header: 'bg-white',
    tag: 'bg-emerald-500',
    cardBorder: 'border-slate-200 shadow-sm border-l-4 border-l-emerald-500',
    progress: 'bg-emerald-500',
    badge: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    textMain: 'text-slate-900',
    statBg: 'bg-slate-50 border-slate-100',
    statText: 'text-slate-800',
    statLabel: 'text-slate-500',
  },
  {
    header: 'bg-white',
    tag: 'bg-purple-500',
    cardBorder: 'border-slate-200 shadow-sm border-l-4 border-l-purple-500',
    progress: 'bg-purple-500',
    badge: 'bg-purple-50 text-purple-700 border-purple-200',
    textMain: 'text-slate-900',
    statBg: 'bg-slate-50 border-slate-100',
    statText: 'text-slate-800',
    statLabel: 'text-slate-500',
  },
  {
    header: 'bg-white',
    tag: 'bg-rose-500',
    cardBorder: 'border-slate-200 shadow-sm border-l-4 border-l-rose-500',
    progress: 'bg-rose-500',
    badge: 'bg-rose-50 text-rose-700 border-rose-200',
    textMain: 'text-slate-900',
    statBg: 'bg-slate-50 border-slate-100',
    statText: 'text-slate-800',
    statLabel: 'text-slate-500',
  }
];

import { useStandings } from '../../lib/standings';

// Points Table Component
const PointsTableUI = ({ pointsTable }) => {
  if (!pointsTable || pointsTable.length === 0) return <div className="p-4 text-center text-[#8a99b0] text-[13px] font-medium">No standings available yet.</div>;

  return (
    <div className="overflow-x-auto w-full no-scrollbar">
      <table className="w-full text-left border-collapse min-w-[500px]">
        <thead>
          <tr className="border-b border-gray-200">
            <th className="py-3 px-4 text-xs font-bold text-[#8a99b0] uppercase tracking-widest text-left w-6">#</th>
            <th className="py-3 px-2 text-xs font-bold text-[#8a99b0] uppercase tracking-widest text-left">Team</th>
            <th className="py-3 px-2 text-xs font-bold text-[#8a99b0] uppercase tracking-widest text-center w-8">M</th>
            <th className="py-3 px-2 text-xs font-bold text-[#8a99b0] uppercase tracking-widest text-center w-8">W</th>
            <th className="py-3 px-2 text-xs font-bold text-[#8a99b0] uppercase tracking-widest text-center w-8">L</th>
            <th className="py-3 px-2 text-xs font-bold text-[#8a99b0] uppercase tracking-widest text-center w-12">PTS</th>
            <th className="py-3 px-2 text-xs font-bold text-[#8a99b0] uppercase tracking-widest text-center w-16">NRR</th>
            <th className="py-3 px-4 text-xs font-bold text-[#8a99b0] uppercase tracking-widest text-right w-24">Form</th>
          </tr>
        </thead>
        <tbody>
          {pointsTable.map((team, idx) => {
            const isQualified = idx < 4;
            const nrrColor = parseFloat(team.nrr) >= 0 ? 'text-[#0FA968]' : 'text-[#F05A47]';
            
            return (
              <tr key={team.short} className="border-b border-gray-100 last:border-0 relative">
                {/* Qualification indicator line */}
                {isQualified && (
                  <td className="absolute left-0 top-0 bottom-0 w-1 bg-[#0FA968]" style={{ height: '100%' }} />
                )}
                
                <td className="py-3 px-4 text-[12px] font-bold text-[#8a99b0] text-left">{idx + 1}</td>
                <td className="py-3 px-2 text-left">
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-5 h-5 rounded flex items-center justify-center text-[8px] font-black text-white" 
                      style={{ backgroundColor: team.color }}
                    >
                      {team.short}
                    </div>
                    <span className="text-[13px] font-bold text-[#101827] whitespace-nowrap">{team.team}</span>
                  </div>
                </td>
                <td className="py-3 px-2 text-[13px] text-[#596579] font-medium text-center">{team.m}</td>
                <td className="py-3 px-2 text-[13px] text-[#101827] font-bold text-center">{team.w}</td>
                <td className="py-3 px-2 text-[13px] text-[#596579] font-medium text-center">{team.l}</td>
                <td className="py-3 px-2 text-[14px] text-[#2457D6] font-black text-center">{team.pts}</td>
                <td className={`py-3 px-2 text-[12px] font-bold text-center ${nrrColor}`}>{team.nrr}</td>
                <td className="py-3 px-4 text-right">
                  <div className="flex items-center justify-end gap-1">
                    {team.form.slice(-3).map((f, i) => (
                      <span 
                        key={i} 
                        className={`w-4 h-4 rounded-sm flex items-center justify-center text-[8px] font-black text-white ${
                          f === 'W' ? 'bg-[#0FA968]' : f === 'L' ? 'bg-[#F05A47]' : 'bg-[#d2d8e2]'
                        }`}
                      >
                        {f}
                      </span>
                    ))}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <div className="p-3 bg-gray-50 text-xs font-medium text-[#8a99b0] flex items-center gap-4 border-t border-gray-100">
         <div className="flex items-center gap-1.5"><div className="w-2 h-2 bg-[#0FA968] rounded-full"/> Top 4 qualify for Semi-Finals</div>
         <div>NRR = Net Run Rate</div>
      </div>
    </div>
  );
};

const TournamentMatchRow = ({ match, index, isExpanded, onToggle, onOpenDetail }) => {
  const isLive = match.status === 'LIVE' || match.status === 'IN_PROGRESS';
  const isCompleted = match.status === 'COMPLETED' || match.status === 'FINISHED';

  if (isExpanded) {
    return (
      <div className="my-3 relative group">
        <div className="absolute -left-2 top-0 bottom-0 w-1 bg-blue-500 rounded-r-md z-10" />
        <MatchCard match={match} onClick={onOpenDetail} />
        {isCompleted && (
          <div className="mt-2 ml-4 mr-2 bg-slate-50 p-3 rounded-xl border border-gray-100 flex flex-wrap gap-x-6 gap-y-2 text-[12px]">
            {match.playerOfMatch && (
              <div><span className="text-[#8a99b0] uppercase font-bold tracking-wider text-[10px] block">Man of the Match</span> <span className="font-bold text-[#101827]">{match.playerOfMatch.name || match.playerOfMatch}</span></div>
            )}
            {match.topBatter && (
              <div><span className="text-[#8a99b0] uppercase font-bold tracking-wider text-[10px] block">Top Batter</span> <span className="font-bold text-[#101827]">{match.topBatter.name || match.topBatter}</span></div>
            )}
            {match.topBowler && (
              <div><span className="text-[#8a99b0] uppercase font-bold tracking-wider text-[10px] block">Top Bowler</span> <span className="font-bold text-[#101827]">{match.topBowler.name || match.topBowler}</span></div>
            )}
            {match.tossDecision && (
              <div className="w-full mt-1 border-t border-gray-200 pt-1 text-gray-500 italic">Toss: {match.tossDecision}</div>
            )}
          </div>
        )}
        <button 
          onClick={(e) => { e.stopPropagation(); onToggle(); }}
          className="absolute -top-3 -right-2 bg-white border border-slate-200 text-slate-500 rounded-full p-1 shadow-sm hover:text-slate-900 hover:bg-slate-50 z-10"
        >
          <ChevronUp size={16} />
        </button>
      </div>
    );
  }

  return (
    <div 
      onClick={onToggle}
      className="flex items-center justify-between py-3 px-1 border-b border-gray-100 cursor-pointer hover:bg-gray-50/50 transition-colors"
    >
      <div className="flex items-center gap-3">
        <span className="text-[12px] font-bold text-[#8a99b0] w-5">{String(index + 1).padStart(2, '0')}</span>
        <div>
          <div className="text-[14px] font-bold text-[#101827]">
            {match.teamA?.name || match.teamA || match.home_team?.name || 'JBP'} <span className="text-[#8a99b0] font-medium mx-1">vs</span> {match.teamB?.name || match.teamB || match.away_team?.name || 'MDL'}
          </div>
          <div className="text-[12px] text-[#596579] mt-0.5">
            {isLive ? (
              <span className="text-[#0FA968] font-bold">LIVE • {match.teamA?.score || match.home_team?.score || '142/4'}</span>
            ) : isCompleted ? (
              <span className="text-[#2457D6] font-bold">{match.result || 'Match Completed'}</span>
            ) : (
              <span>{match.date || match.scheduled_at?.split('T')[0] || 'Tomorrow'}</span>
            )}
          </div>
        </div>
      </div>
      <ChevronDown size={16} className="text-[#d2d8e2] group-hover:text-blue-500" />
    </div>
  );
};

export default function TournamentsScreen() {
  const { matches = [], tournaments = [], pointsTable = [], teams = [], navigateTo, setActiveMatchId, userRole } = useCricket();
  const [activeTab, setActiveTab] = useState('Matches'); // 'Matches' | 'Standings'
  const [expandedTournament, setExpandedTournament] = useState(null);
  const [expandedMatchId, setExpandedMatchId] = useState(null);
  
  // Tournament Manager state
  const [isManagerOpen, setIsManagerOpen] = useState(false);
  const [editingTournament, setEditingTournament] = useState(null);
  const isAdmin = userRole === 'SUPER_ADMIN' || userRole === 'DISTRICT_ADMIN' || userRole === 'Admin' || userRole === 'SuperAdmin';
  
  // Fallback group matches by tournament ID in case they don't match a tournament
  const getTournamentMatches = (tId) => {
    return matches.filter(m => m.tournament_id === tId || m.tournament === tId);
  };

  // We use the useStandings hook for the actively expanded tournament to calculate points
  const activeTournamentMatches = expandedTournament ? getTournamentMatches(expandedTournament) : [];
  const activeTournamentPointsTable = useStandings(activeTournamentMatches);

  // Set the first tournament as expanded by default when tournaments load
  useEffect(() => {
    if (tournaments.length > 0 && !expandedTournament) {
      setExpandedTournament(tournaments[0].id);
    }
  }, [tournaments]);

  const toggleTournament = (name) => {
    if (expandedTournament === name) {
      setExpandedTournament(null);
      setExpandedMatchId(null);
    } else {
      setExpandedTournament(name);
      setExpandedMatchId(null);
    }
  };

  const toggleMatch = (matchId) => {
    setExpandedMatchId(prev => prev === matchId ? null : matchId);
  };

  const openMatch = (match) => {
    setActiveMatchId(match.id);
    navigateTo('match-detail');
  };

  const handleGenerateSchedule = async (tournamentId) => {
    // Collect unique teams from existing matches
    const tourneyMatches = getTournamentMatches(tournamentId);
    const uniqueTeamsMap = new Map();
    tourneyMatches.forEach(m => {
      const teamA = m.teamA || m.home_team || 'JBP';
      const teamB = m.teamB || m.away_team || 'MDL';
      const tA = teamA?.name || teamA;
      const tB = teamB?.name || teamB;
      if (tA && !uniqueTeamsMap.has(tA)) uniqueTeamsMap.set(tA, teamA);
      if (tB && !uniqueTeamsMap.has(tB)) uniqueTeamsMap.set(tB, teamB);
    });

    const teamsList = Array.from(uniqueTeamsMap.values());
    if (teamsList.length < 2) {
      alert("Not enough teams to generate a schedule.");
      return;
    }

    if (!window.confirm(`Generate Round-Robin schedule for ${teamsList.length} teams in this tournament?`)) return;

    const newMatches = [];
    let baseDate = new Date();
    baseDate.setDate(baseDate.getDate() + 1);

    for (let i = 0; i < teamsList.length; i++) {
      for (let j = i + 1; j < teamsList.length; j++) {
        // Only add if they haven't played each other
        const alreadyPlayed = tourneyMatches.some(m => 
          ((m.teamA?.name || m.teamA || m.home_team?.name) === (teamsList[i].name || teamsList[i]) && (m.teamB?.name || m.teamB || m.away_team?.name) === (teamsList[j].name || teamsList[j])) ||
          ((m.teamA?.name || m.teamA || m.home_team?.name) === (teamsList[j].name || teamsList[j]) && (m.teamB?.name || m.teamB || m.away_team?.name) === (teamsList[i].name || teamsList[i]))
        );

        if (!alreadyPlayed) {
          newMatches.push(teamsList[i]);
          newMatches.push(teamsList[j]);
        }
      }
    }

    if (newMatches.length > 0) {
      try {
        const { api } = await import('../../lib/api');
        await api.generateSchedule(tournamentId, teamsList);
        alert(`Matches generated. Please refresh to see them.`);
        window.location.reload();
      } catch (err) {
        console.error('Failed to generate schedule:', err);
        alert('Error: ' + err.message);
      }
    } else {
      alert("All teams have already played each other. No new matches generated.");
    }
  };

  const handleEditTournament = (e, tournament) => {
    e.stopPropagation();
    setEditingTournament({
      id: tournament.id,
      name: tournament.name,
      season: tournament.season,
      format: tournament.format,
      gender: tournament.gender,
      startDate: tournament.start_date || '',
      endDate: tournament.end_date || '',
      status: tournament.status,
      customMatches: []
    });
    setIsManagerOpen(true);
  };

  const handleDeleteTournament = async (e, id) => {
    e.stopPropagation();
    if (!window.confirm('Are you sure you want to delete this tournament? All associated matches will also be deleted.')) return;
    try {
      const { api } = await import('../../lib/api');
      await api.deleteTournament(id);
      alert('Tournament deleted.');
      window.location.reload();
    } catch (err) {
      alert('Failed to delete: ' + err.message);
    }
  };

  return (
    <div className="pb-[100px] bg-slate-50 min-h-screen">
      <div className="pt-6 px-4 pb-4 bg-white/95 backdrop-blur-md sticky top-0 z-30 border-b border-gray-200 shadow-2xs">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-[28px] font-black text-[#101827] tracking-tight leading-none">Tournaments</h1>
          {isAdmin && (
            <button 
              onClick={() => {
                setEditingTournament(null);
                setIsManagerOpen(true);
              }}
              className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl px-4 py-2 text-[14px] font-bold shadow-sm transition-colors flex items-center gap-2 cursor-pointer"
            >
              <Plus size={16} /> <span className="hidden sm:inline">Create</span>
            </button>
          )}
        </div>
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
          <button 
            onClick={() => setActiveTab('Matches')}
            className={`whitespace-nowrap px-5 py-2.5 rounded-full text-[13px] font-bold transition-colors cursor-pointer ${
              activeTab === 'Matches' ? 'bg-[#101827] text-white shadow-sm' : 'bg-white border border-gray-200 text-[#596579] hover:bg-gray-50'
            }`}
          >
            Matches
          </button>
          <button 
            onClick={() => setActiveTab('Standings')}
            className={`whitespace-nowrap px-5 py-2.5 rounded-full text-[13px] font-bold transition-colors flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'Standings' ? 'bg-[#101827] text-white shadow-sm' : 'bg-white border border-gray-200 text-[#596579] hover:bg-gray-50'
            }`}
          >
            <Trophy size={14} className={activeTab === 'Standings' ? 'text-white' : 'text-[#ff6100]'} /> Points Table
          </button>
        </div>
      </div>

      <div className="px-4 pt-6 space-y-6">
        {tournaments.length === 0 && (
          <div className="text-center p-8 bg-white rounded-2xl shadow-sm">
             <Trophy size={48} className="mx-auto text-slate-300 mb-4" />
             <h3 className="text-lg font-bold text-slate-900">No Tournaments Found</h3>
             <p className="text-slate-500 text-sm mt-1">Check back later or create a new tournament.</p>
          </div>
        )}
        
        {tournaments.map((tournament, i) => {
          const ms = getTournamentMatches(tournament.id);
          const completed = ms.filter(m => ['COMPLETED', 'FINISHED'].includes(m.status)).length;
          const progress = ms.length > 0 ? Math.round((completed / ms.length) * 100) : 0;
          const theme = TOURNAMENT_THEMES[i % TOURNAMENT_THEMES.length];
          const isExpanded = expandedTournament === tournament.id;

          return (
            <div key={tournament.id} className={`bg-white rounded-[22px] shadow-sm border ${theme.cardBorder} overflow-hidden transition-all ${isExpanded ? 'ring-2 ring-blue-500/10' : 'hover:shadow-md'}`}>
              <div 
                onClick={() => toggleTournament(tournament.id)}
                className={`${theme.header} p-5 sm:p-6 relative overflow-hidden cursor-pointer hover:bg-slate-50/50 transition-colors group`}
              >
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-3">
                    <div className={`inline-block px-2.5 py-0.5 rounded-md text-[10px] font-black tracking-widest uppercase border ${theme.badge}`}>
                      Season {tournament.season} • Official JDCA
                    </div>
                    <div className="flex items-center gap-3">
                      {isAdmin && (
                        <div className="hidden group-hover:flex items-center gap-1 mr-2">
                           <button onClick={(e) => handleEditTournament(e, tournament)} className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"><Edit2 size={16}/></button>
                           <button onClick={(e) => handleDeleteTournament(e, tournament.id)} className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"><Trash2 size={16}/></button>
                        </div>
                      )}
                      {isExpanded ? <ChevronUp className="text-slate-400" size={18} /> : <ChevronDown className="text-slate-400" size={18} />}
                    </div>
                  </div>
                  
                  <h2 className={`text-[20px] sm:text-[22px] font-black leading-tight mb-4 tracking-tight ${theme.textMain} pr-6`}>{tournament.name}</h2>
                  
                  <div className="flex items-center gap-4 text-[12px] font-medium">
                    <div className={`${theme.statBg} px-3 py-2 rounded-xl border flex-1`}>
                      <div className={`text-[18px] font-black leading-none ${theme.statText}`}>{ms.length}</div>
                      <div className={`text-[10px] uppercase font-bold tracking-wider ${theme.statLabel} mt-1`}>Total Matches</div>
                    </div>
                    <div className={`${theme.statBg} px-3 py-2 rounded-xl border flex-1`}>
                      <div className={`text-[18px] font-black leading-none ${theme.statText}`}>{completed}</div>
                      <div className={`text-[10px] uppercase font-bold tracking-wider ${theme.statLabel} mt-1`}>Completed</div>
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div className="mt-5 w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                    <div className={`${theme.progress} h-full rounded-full transition-all duration-500`} style={{ width: `${progress}%` }} />
                  </div>
                </div>
              </div>

              {/* Dynamic Content: Matches OR Standings (Expanded State) */}
              {isExpanded && (
                <div className="bg-white animate-in slide-in-from-top-2 duration-300">
                  {activeTab === 'Standings' ? (
                    <PointsTableUI pointsTable={activeTournamentPointsTable} />
                  ) : (
                    <div className="p-4 sm:p-5">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-[12px] font-black uppercase tracking-widest text-[#596579]">League Stage</h3>
                        <div className="flex gap-2 items-center">
                           {isAdmin && <button onClick={() => handleGenerateSchedule(tournament.id)} className="text-[11px] font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 px-2.5 py-1 rounded transition-colors cursor-pointer">Auto Generate</button>}
                           <span className="text-xs font-semibold text-slate-400">{ms.length} Fixtures</span>
                        </div>
                      </div>
                      
                      <div className="flex flex-col">
                        {ms.map((m, idx) => (
                          <TournamentMatchRow 
                            key={m.id} 
                            match={m} 
                            index={idx} 
                            isExpanded={expandedMatchId === m.id}
                            onToggle={() => toggleMatch(m.id)}
                            onOpenDetail={() => openMatch(m)}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

            </div>
          );
        })}
      </div>

      {isAdmin && (
        <TournamentManagerModal 
          isOpen={isManagerOpen}
          teams={teams}
          initialData={editingTournament}
          onClose={() => {
            setIsManagerOpen(false);
            setEditingTournament(null);
          }}
          onSave={async (data) => {
            try {
              if (editingTournament) {
                await api.updateTournament(editingTournament.id, data);
                alert('Tournament updated successfully!');
              } else {
                const newTournament = await api.createTournament(data);
                if (data.customMatches && data.customMatches.length > 0) {
                  await api.createDetailedMatches(newTournament.id, newTournament.format, data.customMatches);
                }
                alert('Tournament created successfully!');
              }
              window.location.reload(); // Quickest way to refresh for now
            } catch (err) {
              console.error('Failed to save tournament:', err);
              alert('Error saving tournament: ' + err.message);
            }
          }}
        />
      )}
    </div>
  );
}
