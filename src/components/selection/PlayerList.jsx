import React from 'react';
import { User, CheckCircle2, Bookmark } from 'lucide-react';
import CloudinaryAvatar from '../ui/CloudinaryAvatar';

export default function PlayerList({ players, activeTeam, selectedPlayerId, onSelectPlayer, onToggleConsider, onToggleSelect }) {
  
  if (players.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-slate-400">
        <User className="w-12 h-12 mb-3 stroke-[1.5] text-slate-300" />
        <p className="text-sm font-medium">No players found matching your criteria</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col font-sans border-t border-slate-200">
      {players.map(p => {
        const isSelected = activeTeam?.selectedPlayerIds?.includes(p.id);
        const isConsidered = activeTeam?.shortlistedPlayerIds?.includes(p.id);
        const isActive = selectedPlayerId === p.id;
        
        let statString = '';
        if (p.primary_role === 'Bowler') {
          statString = `${p.matches} Mat · ${p.wickets} Wkts · Econ ${p.economy}`;
        } else {
          statString = `${p.matches} Mat · ${p.careerRuns} Runs · Avg ${p.battingAvg}`;
        }

        return (
          <div 
            key={p.id}
            onClick={() => onSelectPlayer(p.id)}
            className={`flex items-start p-3 border-b border-slate-200 cursor-pointer transition-colors ${
              isActive ? 'bg-blue-50/60 border-l-2 border-l-blue-600' : 'bg-white hover:bg-slate-50 border-l-2 border-l-transparent'
            }`}
          >
            {/* Avatar */}
            <div className="w-10 h-10 rounded bg-slate-100 border border-slate-200 overflow-hidden shrink-0 flex items-center justify-center mr-3">
              <CloudinaryAvatar src={p.avatar_url} alt={p.full_name} className="w-full h-full object-cover" />
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-0.5">
                <h3 className="text-sm font-bold text-slate-900 truncate pr-2">{p.full_name}</h3>
                
                {/* Status Badges */}
                <div className="flex items-center gap-1 shrink-0">
                  {isSelected && (
                    <span className="flex items-center gap-1 px-1.5 py-0.5 bg-emerald-50 text-emerald-700 rounded text-[9px] font-bold uppercase tracking-wide border border-emerald-100">
                      <CheckCircle2 className="w-3 h-3" /> Selected
                    </span>
                  )}
                  {isConsidered && !isSelected && (
                    <span className="flex items-center gap-1 px-1.5 py-0.5 bg-amber-50 text-amber-700 rounded text-[9px] font-bold uppercase tracking-wide border border-amber-100">
                      <Bookmark className="w-3 h-3" /> Considered
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-center text-xs text-slate-500 mb-1">
                <span className="font-medium text-slate-700">{p.district}</span>
                <span className="mx-1.5">·</span>
                <span>{p.category} {p.gender === 'Women' ? '(W)' : ''}</span>
                <span className="mx-1.5">·</span>
                <span className="text-xs text-slate-400 font-mono">{p.registrationNumber}</span>
              </div>

              <div className="flex items-center text-xs text-slate-600 mb-1.5">
                <span className="font-semibold">{p.primary_role}</span>
                <span className="mx-1.5">·</span>
                <span>{p.batting_style}</span>
                {p.bowling_style !== 'None' && (
                  <>
                    <span className="mx-1.5">·</span>
                    <span>{p.bowling_style}</span>
                  </>
                )}
              </div>

              <div className="text-xs font-medium text-slate-700 bg-slate-100/50 px-2 py-1 rounded inline-block">
                {statString}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
