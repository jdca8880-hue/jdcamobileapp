import React from 'react';
import { 
  ArrowLeft, Users, Bookmark, CheckCircle2, AlertTriangle, ShieldCheck, User
} from 'lucide-react';
import CloudinaryAvatar from '../ui/CloudinaryAvatar';

export default function TeamSelectionDashboard({ team, allPlayers, onBack, onUpdateTeam, onSelectPlayer }) {
  if (!team) return null;

  const selectedPlayers = allPlayers.filter(p => team.selectedPlayerIds?.includes(p.id));
  const consideredPlayers = allPlayers.filter(p => team.shortlistedPlayerIds?.includes(p.id) && !team.selectedPlayerIds?.includes(p.id));

  // Role Breakdown
  const counts = {
    'Batter': 0,
    'Bowler': 0,
    'All-Rounder': 0,
    'Wicket Keeper': 0
  };

  selectedPlayers.forEach(p => {
    if (counts[p.primary_role] !== undefined) counts[p.primary_role]++;
  });

  // Balance Warnings
  const warnings = [];
  if (counts['Wicket Keeper'] === 0 && selectedPlayers.length > 5) {
    warnings.push("Add at least 1 Wicket Keeper to the team.");
  }
  if (counts['Bowler'] < 3 && selectedPlayers.length > 8) {
    warnings.push("Team contains fewer than 3 specialist bowlers.");
  }
  if (counts['Batter'] > 8) {
    warnings.push("Team is heavily weighted toward pure batters.");
  }

  const isLocked = team.status === 'Locked';

  const PlayerRow = ({ player, isSelected }) => (
    <div 
      onClick={() => onSelectPlayer(player.id)}
      className="flex items-center p-3 bg-white border border-slate-200 rounded-md mb-2 cursor-pointer hover:border-blue-300 hover:shadow-sm transition-all"
    >
      <div className="w-10 h-10 rounded bg-slate-100 overflow-hidden shrink-0 flex items-center justify-center mr-3 border border-slate-200">
        {player.avatar_url ? (
          <CloudinaryAvatar src={player.avatar_url} alt={player.full_name} className="w-full h-full object-cover" />
        ) : (
          <User className="w-5 h-5 text-slate-400" />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="text-sm font-bold text-slate-900">{player.full_name}</h4>
        <div className="text-xs text-slate-500 font-medium">
          {player.district} · {player.primary_role}
        </div>
      </div>
      <div className="text-right">
        {isSelected ? (
          <button 
            disabled={isLocked}
            onClick={(e) => {
              e.stopPropagation();
              onUpdateTeam({ ...team, selectedPlayerIds: team.selectedPlayerIds.filter(id => id !== player.id) });
            }}
            className="text-xs font-bold uppercase tracking-wider text-rose-600 bg-rose-50 px-2 py-1 rounded border border-rose-100 hover:bg-rose-100 disabled:opacity-50"
          >
            Remove
          </button>
        ) : (
          <button 
            disabled={isLocked}
            onClick={(e) => {
              e.stopPropagation();
              onUpdateTeam({ ...team, selectedPlayerIds: [...(team.selectedPlayerIds || []), player.id] });
            }}
            className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-1 rounded border border-emerald-200 hover:bg-emerald-100 disabled:opacity-50"
          >
            Select
          </button>
        )}
      </div>
    </div>
  );

  return (
    <div className="flex flex-col h-full bg-[#f8fafc] font-sans">
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6">
           
           {/* LEFT: TEAM OVERVIEW */}
           <div className="lg:col-span-8 flex flex-col gap-6">
             
             {/* Team Balance */}
             <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-sm">
                <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
                  <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-blue-600" /> Team Composition
                  </h3>
                  <div className="text-sm font-bold text-slate-700 bg-slate-100 px-3 py-1 rounded">
                    {selectedPlayers.length} / {team.targetSize} Selected
                  </div>
                </div>
                
                <div className="grid grid-cols-4 gap-3 mb-4">
                   {['Batter', 'All-Rounder', 'Bowler', 'Wicket Keeper'].map(role => (
                     <div key={role} className="flex flex-col p-3 bg-slate-50 border border-slate-100 rounded text-center">
                       <span className="text-2xl font-bold text-slate-800">{counts[role] || 0}</span>
                       <span className="text-xs font-bold uppercase tracking-wider text-slate-500 mt-1">{role.replace('Wicket Keeper', 'WK')}</span>
                     </div>
                   ))}
                </div>

                {warnings.length > 0 && (
                  <div className="flex flex-col gap-2 mt-4 pt-4 border-t border-slate-100">
                    {warnings.map((w, i) => (
                      <div key={i} className="flex items-start gap-2 text-xs font-semibold text-amber-700 bg-amber-50 p-2 rounded border border-amber-100">
                        <AlertTriangle className="w-4 h-4 shrink-0" />
                        <span>{w}</span>
                      </div>
                    ))}
                  </div>
                )}
             </div>

             {/* Selected List */}
             <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-sm">
                <h3 className="text-sm font-bold text-emerald-800 uppercase tracking-wider mb-4 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" /> Selected Team
                </h3>
                {selectedPlayers.length === 0 ? (
                  <div className="text-center p-8 text-slate-400 bg-slate-50 rounded border border-slate-100 border-dashed">
                    <Users className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm font-medium">No players selected yet.</p>
                  </div>
                ) : (
                  <div className="flex flex-col">
                    {selectedPlayers.map(p => <PlayerRow key={p.id} player={p} isSelected={true} />)}
                  </div>
                )}
             </div>

           </div>

           {/* RIGHT: CONSIDERED POOL */}
           <div className="lg:col-span-4 flex flex-col">
             <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-sm h-full flex flex-col">
               <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-4 flex items-center gap-2">
                  <Bookmark className="w-4 h-4 text-amber-500" /> Considered Players
                </h3>
                {consideredPlayers.length === 0 ? (
                  <div className="flex-1 flex flex-col items-center justify-center p-6 text-slate-400 bg-slate-50 rounded border border-slate-100 border-dashed">
                    <Bookmark className="w-8 h-8 mb-2 opacity-50" />
                    <p className="text-sm font-medium text-center">Bookmark players from the categories to consider them here.</p>
                  </div>
                ) : (
                  <div className="flex-1 overflow-y-auto">
                    {consideredPlayers.map(p => <PlayerRow key={p.id} player={p} isSelected={false} />)}
                  </div>
                )}
             </div>
           </div>

        </div>
      </div>
    </div>
  );
}
