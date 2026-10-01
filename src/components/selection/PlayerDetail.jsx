import React from 'react';
import { 
  User, CheckCircle2, Bookmark, X, Star, Calendar, 
  MapPin, Shield, Activity, Award
} from 'lucide-react';
import CloudinaryAvatar from '../ui/CloudinaryAvatar';

export default function PlayerDetail({ 
  player, team, onClose, onToggleConsider, onToggleSelect, isConsidered, isSelected 
}) {
  if (!player) return null;

  const SectionHeading = ({ icon: Icon, title }) => (
    <h3 className="flex items-center gap-1.5 text-xs font-bold text-slate-800 uppercase tracking-wider mb-3 pb-2 border-b border-slate-100">
      <Icon className="w-4 h-4 text-blue-600" />
      {title}
    </h3>
  );

  const DataItem = ({ label, value }) => (
    <div className="flex flex-col">
      <span className="text-xs uppercase text-slate-400 font-semibold tracking-wider mb-0.5">{label}</span>
      <span className="text-sm font-medium text-slate-800">{value}</span>
    </div>
  );

  const StatBox = ({ label, value }) => (
    <div className="bg-slate-50 border border-slate-200 rounded p-2 flex flex-col items-center justify-center text-center">
      <span className="text-lg font-bold text-slate-900 leading-tight">{value}</span>
      <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 mt-1">{label}</span>
    </div>
  );

  const TrendChart = ({ data, color, label }) => {
    const maxVal = Math.max(...data, 1);
    return (
      <div className="flex flex-col flex-1 bg-slate-50 border border-slate-200 rounded p-2">
        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">{label} Trend</span>
        <div className="flex items-end h-16 gap-1 w-full mt-auto">
          {data.map((val, i) => (
            <div key={i} className="flex-1 flex flex-col justify-end h-full relative group">
              <div 
                className={`w-full rounded-t-sm ${color} transition-all duration-300`} 
                style={{ height: `${(val / maxVal) * 100}%`, minHeight: '4px' }}
              ></div>
              {/* Tooltip */}
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 hidden group-hover:block bg-slate-800 text-white text-xs py-0.5 px-1.5 rounded whitespace-nowrap z-10">
                {val}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const battingTrend = player.matchHistory.map(m => m.batting?.runs || 0).reverse();
  const bowlingTrend = player.matchHistory.map(m => m.bowling?.wickets || 0).reverse();

  return (
    <div className="flex flex-col h-full bg-white font-sans overflow-hidden">
      
      {/* Header */}
      <div className="shrink-0 border-b border-slate-200 bg-slate-50 p-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
             <div className="w-14 h-14 rounded-md bg-white border border-slate-200 shadow-sm flex items-center justify-center overflow-hidden">
                  <CloudinaryAvatar src={player.avatar_url} alt={player.full_name} className="w-full h-full object-cover" />
             </div>
             <div>
                <h2 className="text-lg font-bold text-slate-900 leading-tight">{player.full_name}</h2>
                <p className="text-xs font-mono text-slate-500 mt-0.5">{player.registrationNumber}</p>
             </div>
          </div>
        </div>

        {/* Actions */}
        {team && (
          <div className="flex items-center gap-2 mt-4 pt-3 border-t border-slate-200">
            <button 
              onClick={onToggleSelect}
              className={`flex-1 py-3 px-4 rounded-xl flex items-center justify-center gap-1.5 text-[13px] font-black uppercase tracking-widest transition-transform active:scale-95 ${
                isSelected 
                  ? 'bg-slate-900 text-white' 
                  : 'bg-[#E1FF01] text-[#27272A] hover:brightness-95'
              }`}
            >
              <CheckCircle2 className="w-4 h-4" />
              {isSelected ? 'SELECTED' : `SELECT FOR ${team?.name?.replace(' 2026', '').toUpperCase() || 'TEAM'}`}
            </button>
            <button 
              onClick={onToggleConsider}
              className={`flex-none p-3 rounded-xl flex items-center justify-center gap-1.5 transition-transform active:scale-95 ${
                isConsidered
                  ? 'bg-amber-100 text-amber-800' 
                  : 'bg-white border-2 border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
              title="Consider Player"
            >
              <Bookmark className={`w-5 h-5 ${isConsidered ? 'fill-current' : ''}`} />
            </button>
          </div>
        )}
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        
        {/* Registration & Identity */}
        <section>
          <SectionHeading icon={User} title="Registration & Identity" />
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-y-4 gap-x-2">
            <DataItem label="District" value={player.district} />
            <DataItem label="Age Category" value={player.category} />
            <DataItem label="Gender" value={player.gender} />
            <DataItem label="Date of Birth" value={player.dob || 'Not Provided'} />
            <DataItem label="Primary Role" value={player.primary_role} />
            <DataItem label="Batting Style" value={player.batting_style} />
            <DataItem label="Bowling Style" value={player.bowling_style} />
          </div>
        </section>

        {/* Performance - Batting */}
        <section>
          <SectionHeading icon={Activity} title="Batting Performance" />
          <div className="grid grid-cols-4 gap-2 mb-3">
            <StatBox label="Matches" value={player.matches} />
            <StatBox label="Runs" value={player.careerRuns} />
            <StatBox label="Average" value={player.battingAvg} />
            <StatBox label="Strike Rate" value={player.strikeRate} />
          </div>
          <div className="grid grid-cols-4 gap-2">
            <StatBox label="Highest" value={player.highScore} />
            <StatBox label="50s/100s" value={`${player.fifties}/${player.hundreds}`} />
            <StatBox label="Fours" value={player.fours} />
            <StatBox label="Sixes" value={player.sixes} />
          </div>
        </section>

        {/* Performance - Bowling (Only if Bowler/All-Rounder) */}
        {(player.primary_role === 'Bowler' || player.primary_role === 'All-Rounder') && (
          <section>
            <SectionHeading icon={Activity} title="Bowling Performance" />
            <div className="grid grid-cols-4 gap-2 mb-3">
              <StatBox label="Overs" value={player.oversBowled} />
              <StatBox label="Wickets" value={player.wickets} />
              <StatBox label="Economy" value={player.economy} />
              <StatBox label="Average" value={player.bowlingAvg} />
            </div>
            <div className="grid grid-cols-3 gap-2">
              <StatBox label="Runs Conceded" value={player.runsConceded} />
              <StatBox label="Best Bowling" value={player.bestBowling} />
              <StatBox label="Maidens" value={player.maidens} />
            </div>
          </section>
        )}

        {/* Fielding */}
        <section>
          <SectionHeading icon={Shield} title="Fielding Performance" />
          <div className="grid grid-cols-4 gap-2">
            <StatBox label="Catches" value={player.catches} />
            {player.primary_role === 'Wicket Keeper' && (
               <StatBox label="Stumpings" value={player.stumpings} />
            )}
            <StatBox label="Run Outs" value={player.runOuts} />
            <StatBox label="Total" value={player.totalDismissals} />
          </div>
        </section>

        {/* Graphs */}
        <section>
          <SectionHeading icon={Activity} title="Performance Trends" />
          <div className="flex gap-3 h-32">
            <TrendChart data={battingTrend} color="bg-blue-500" label="Runs" />
            {(player.primary_role === 'Bowler' || player.primary_role === 'All-Rounder') && (
               <TrendChart data={bowlingTrend} color="bg-emerald-500" label="Wickets" />
            )}
          </div>
        </section>

        {/* Recent Form */}
        <section>
          <SectionHeading icon={Activity} title="Recent Form (Last 5 Matches)" />
          <div className="flex gap-2">
            {player.matchHistory.slice(0, 5).map((m, i) => (
              <div key={i} className="flex-1 bg-slate-50 border border-slate-200 rounded py-2 text-center">
                <div className="text-sm sm:text-base font-bold text-slate-800">
                  {player.primary_role === 'Bowler' 
                    ? `${m.bowling?.wickets || 0}/${m.bowling?.runs || 0}`
                    : `${m.batting?.runs || 0}${m.batting?.notOut ? '*' : ''}`
                  }
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Best Performances */}
        <section>
          <SectionHeading icon={CheckCircle2} title="Best Performances" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[...player.matchHistory]
              .sort((a, b) => {
                const scoreA = (a.batting?.runs || 0) + (a.bowling?.wickets || 0) * 20;
                const scoreB = (b.batting?.runs || 0) + (b.bowling?.wickets || 0) * 20;
                return scoreB - scoreA;
              })
              .slice(0, 3)
              .map((m, i) => (
              <div key={i} className="p-3 bg-amber-50/50 border border-amber-200 rounded-md">
                <div className="text-xs font-bold text-amber-900 mb-1.5">vs {m.opponent}</div>
                <div className="text-sm font-semibold text-amber-800 flex flex-col gap-0.5">
                  {(m.batting?.runs > 0) && <span>{m.batting.runs} runs{m.batting.balls ? ` (${m.batting.balls} balls)` : ''}</span>}
                  {(m.bowling?.wickets > 0) && <span>{m.bowling.wickets} wickets</span>}
                  {(m.fielding?.catches > 0) && <span>{m.fielding.catches} catch{m.fielding.catches > 1 ? 'es' : ''}</span>}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Match History */}
        <section>
          <SectionHeading icon={Calendar} title="Match History" />
          <div className="border border-slate-200 rounded-md overflow-hidden bg-slate-50">
            {player.matchHistory.map((m, i) => (
              <div key={m.id} className={`flex items-center p-3 cursor-pointer bg-white hover:bg-slate-50 transition-colors ${i !== player.matchHistory.length - 1 ? 'border-b border-slate-200' : ''}`}>
                <div className="w-10 h-10 bg-slate-50 rounded-full flex items-center justify-center shrink-0 mr-4 border border-slate-200">
                  <Trophy className="w-4 h-4 text-slate-400" />
                </div>
                <div className="flex-1 min-w-0 flex flex-col justify-center">
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <span className="text-xs font-bold uppercase text-slate-500">{m.date}</span>
                    <span className="text-slate-300">·</span>
                    <span className="text-xs font-bold uppercase text-slate-700 truncate">{m.tournament}</span>
                  </div>
                  <div className="text-sm font-semibold text-slate-900 leading-tight">vs {m.opponent}</div>
                  <div className="text-xs font-medium text-slate-500 flex items-center gap-2 mt-1">
                    {m.batting?.runs !== undefined && (
                       <span className="bg-slate-100 px-1.5 rounded">Bat: <span className="text-slate-800 font-bold">{m.batting.runs}{m.batting.notOut ? '*' : ''}</span> <span className="opacity-75">({m.batting.balls})</span></span>
                    )}
                    {m.bowling?.overs > 0 && (
                       <span className="bg-slate-100 px-1.5 rounded">Bowl: <span className="text-slate-800 font-bold">{m.bowling.wickets}/{m.bowling.runs}</span></span>
                    )}
                  </div>
                </div>
                <div className="flex items-center justify-center pl-2">
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Selection History */}
        {player.selectionHistory && player.selectionHistory.length > 0 && (
          <section>
            <SectionHeading icon={History} title="Selection History" />
            <div className="space-y-3">
              {player.selectionHistory.map((h, i) => (
                <div key={i} className="flex flex-col p-3 bg-slate-50 border border-slate-200 rounded">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-slate-800">{h.process}</span>
                    <span className={`text-xs font-bold uppercase px-1.5 py-0.5 rounded ${
                      h.status === 'Selected' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-700'
                    }`}>
                      {h.status}
                    </span>
                  </div>
                  <div className="text-xs text-slate-500 font-medium">
                    {h.category} · Season {h.season} · Date: {h.date}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

      </div>
    </div>
  );
}
