import React from 'react';
import {
  Users,
  Shield,
  Award,
  Crown,
  CheckCircle2,
  AlertTriangle,
  ChevronRight,
  UserX,
} from 'lucide-react';
import CloudinaryAvatar from '../ui/CloudinaryAvatar';

export default function SelectedTeam({
  team,
  selectedPlayers,
  onSelectPlayer,
  onRemovePlayerFromTeam,
  onUpdateTeamRoles,
}) {
  const targetSize = team.targetSize || 20;
  const count = selectedPlayers.length;

  const batters = selectedPlayers.filter(p => p.primary_role === 'Batter');
  const allRounders = selectedPlayers.filter(p => p.primary_role === 'All-Rounder');
  const wicketkeepers = selectedPlayers.filter(p => p.primary_role === 'Wicket Keeper');
  const fastBowlers = selectedPlayers.filter(p => p.primary_role === 'Bowler' && (p.bowling_style?.toLowerCase().includes('fast') || p.bowling_style?.toLowerCase().includes('medium')));
  const spinners = selectedPlayers.filter(p => p.primary_role === 'Bowler' && !p.bowling_style?.toLowerCase().includes('fast') && !p.bowling_style?.toLowerCase().includes('medium'));

  const minBatters = team.minBatters || 0;
  const minAllRounders = team.minAllRounders || 0;
  const minWKs = team.minWKs || 0;
  const minFastBowlers = team.minFastBowlers || 0;
  const minSpinners = team.minSpinners || 0;

  const isCompositionValid =
    batters.length >= minBatters &&
    allRounders.length >= minAllRounders &&
    wicketkeepers.length >= minWKs &&
    fastBowlers.length >= minFastBowlers &&
    spinners.length >= minSpinners;

  const currentCaptain = team.roles?.captainId || '';
  const currentViceCaptain = team.roles?.viceCaptainId || '';
  const currentWK = team.roles?.wicketkeeperId || '';

  const handleRoleChange = (roleKey, playerId) => {
    onUpdateTeamRoles({
      ...team.roles,
      [roleKey]: playerId,
    });
  };

  return (
    <div className="space-y-5 pb-8 max-w-5xl mx-auto">
      {/* TEAM OVERVIEW BANNER */}
      <div className="bg-white border border-slate-200/80 rounded-xl p-5 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-100/60">
                {team.season} • {team.category}
              </span>
              <span className="text-xs text-slate-400 font-medium">
                Official JDCA Selection
              </span>
            </div>
            <h2 className="text-xl font-semibold text-slate-900 mt-1">
              {team.name}
            </h2>
            <p className="text-xs text-slate-500 font-normal">
              Target Team: {targetSize} Players • {count} Players Selected
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-slate-50 px-4 py-2.5 rounded-lg border border-slate-100 text-center">
              <div className="text-xl font-semibold text-slate-900">
                <span className={count === targetSize ? 'text-emerald-700' : count > targetSize ? 'text-rose-600' : 'text-blue-700'}>
                  {count}
                </span>
                <span className="text-xs font-normal text-slate-400"> / {targetSize}</span>
              </div>
              <div className="text-xs font-medium text-slate-500">Team Size</div>
            </div>
          </div>
        </div>

        {/* TEAM ROLE APPOINTMENTS */}
        <div className="mt-5 pt-4 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Captain */}
          <div className="bg-amber-50/50 border border-amber-200/70 p-3 rounded-lg space-y-1">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-900">
              <Crown className="w-3.5 h-3.5 text-amber-600" />
              <span>Team Captain</span>
            </div>
            <select
              value={currentCaptain}
              onChange={e => handleRoleChange('captainId', e.target.value)}
              className="w-full bg-white border border-amber-200 rounded-lg p-1.5 text-xs font-medium text-slate-800 outline-none"
            >
              <option value="">-- Assign Captain --</option>
              {selectedPlayers.map(p => (
                <option key={p.id} value={p.id}>
                  {p.full_name} ({p.primary_role})
                </option>
              ))}
            </select>
          </div>

          {/* Vice Captain */}
          <div className="bg-blue-50/50 border border-blue-200/70 p-3 rounded-lg space-y-1">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-blue-900">
              <Award className="w-3.5 h-3.5 text-blue-600" />
              <span>Vice Captain</span>
            </div>
            <select
              value={currentViceCaptain}
              onChange={e => handleRoleChange('viceCaptainId', e.target.value)}
              className="w-full bg-white border border-blue-200 rounded-lg p-1.5 text-xs font-medium text-slate-800 outline-none"
            >
              <option value="">-- Assign Vice Captain --</option>
              {selectedPlayers.map(p => (
                <option key={p.id} value={p.id}>
                  {p.full_name} ({p.primary_role})
                </option>
              ))}
            </select>
          </div>

          {/* Designated Wicketkeeper */}
          <div className="bg-emerald-50/50 border border-emerald-200/70 p-3 rounded-lg space-y-1">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-900">
              <Shield className="w-3.5 h-3.5 text-emerald-600" />
              <span>Designated Wicketkeeper</span>
            </div>
            <select
              value={currentWK}
              onChange={e => handleRoleChange('wicketkeeperId', e.target.value)}
              className="w-full bg-white border border-emerald-200 rounded-lg p-1.5 text-xs font-medium text-slate-800 outline-none"
            >
              <option value="">-- Assign Wicketkeeper --</option>
              {selectedPlayers.map(p => (
                <option key={p.id} value={p.id}>
                  {p.full_name} {p.primary_role === 'Wicket Keeper' ? '(Specialist WK)' : ''}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* DISCIPLINE TILES */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
        <DisciplineTile label="Batters" count={batters.length} min={minBatters} />
        <DisciplineTile label="All-Rounders" count={allRounders.length} min={minAllRounders} />
        <DisciplineTile label="Wicketkeepers" count={wicketkeepers.length} min={minWKs} />
        <DisciplineTile label="Fast Bowlers" count={fastBowlers.length} min={minFastBowlers} />
        <DisciplineTile label="Spinners" count={spinners.length} min={minSpinners} />
      </div>

      {/* COMPOSITION ALERT */}
      <div
        className={`p-3.5 rounded-lg border text-xs flex items-start gap-3 ${
          isCompositionValid && count === targetSize
            ? 'bg-emerald-50/70 border-emerald-200 text-emerald-900'
            : 'bg-amber-50/70 border-amber-200 text-amber-900'
        }`}
      >
        {isCompositionValid && count === targetSize ? (
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
        ) : (
          <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
        )}
        <div className="space-y-0.5">
          <div className="font-semibold text-slate-900">
            {isCompositionValid && count === targetSize
              ? `Team Complete (${count} Players Selected)`
              : `Team Selection In Progress (${count} / ${targetSize} Players)`}
          </div>
          <div className="text-xs text-slate-600 font-normal">
            {isCompositionValid && count === targetSize
              ? `The ${team.name} satisfies all JDCA balance criteria across all disciplines.`
              : `Ensure minimum required players per role are selected before finalizing official approval.`}
          </div>
        </div>
      </div>

      {/* SELECTED TEAM PLAYERS */}
      <div className="space-y-4">
        <PlayerGroup
          title="Specialist Batters"
          players={batters}
          teamRoles={team.roles}
          onSelect={onSelectPlayer}
          onRemove={onRemovePlayerFromTeam}
        />
        <PlayerGroup
          title="All-Rounders"
          players={allRounders}
          teamRoles={team.roles}
          onSelect={onSelectPlayer}
          onRemove={onRemovePlayerFromTeam}
        />
        <PlayerGroup
          title="Wicketkeepers"
          players={wicketkeepers}
          teamRoles={team.roles}
          onSelect={onSelectPlayer}
          onRemove={onRemovePlayerFromTeam}
        />
        <PlayerGroup
          title="Fast Bowlers"
          players={fastBowlers}
          teamRoles={team.roles}
          onSelect={onSelectPlayer}
          onRemove={onRemovePlayerFromTeam}
        />
        <PlayerGroup
          title="Spin Bowlers"
          players={spinners}
          teamRoles={team.roles}
          onSelect={onSelectPlayer}
          onRemove={onRemovePlayerFromTeam}
        />

        {selectedPlayers.length === 0 && (
          <div className="bg-white rounded-xl border border-slate-200 p-12 text-center space-y-2">
            <Users className="w-8 h-8 text-slate-300 mx-auto" />
            <div className="text-sm font-medium text-slate-700">No Players Selected Yet</div>
            <p className="text-xs text-slate-400">Go to the Candidates tab to evaluate and select players for this team.</p>
          </div>
        )}
      </div>
    </div>
  );
}

const DISCIPLINE_THEMES = {
  'Batters':       { tile: 'bg-white border-l-4 border-l-amber-500', count: 'text-amber-700 text-xl font-bold', label: 'text-slate-600 text-xs', status: 'text-slate-400 text-xs' },
  'All-Rounders':  { tile: 'bg-white border-l-4 border-l-violet-600', count: 'text-violet-700 text-xl font-bold', label: 'text-slate-600 text-xs', status: 'text-slate-400 text-xs' },
  'Wicketkeepers': { tile: 'bg-white border-l-4 border-l-teal-600', count: 'text-teal-700 text-xl font-bold', label: 'text-slate-600 text-xs', status: 'text-slate-400 text-xs' },
  'Fast Bowlers':  { tile: 'bg-white border-l-4 border-l-rose-600', count: 'text-rose-700 text-xl font-bold', label: 'text-slate-600 text-xs', status: 'text-slate-400 text-xs' },
  'Spinners':      { tile: 'bg-white border-l-4 border-l-blue-600', count: 'text-blue-700 text-xl font-bold', label: 'text-slate-600 text-xs', status: 'text-slate-400 text-xs' },
};

function DisciplineTile({ label, count, min }) {
  const isSatisfied = count >= min;
  const t = DISCIPLINE_THEMES[label] || { tile: 'bg-white border-l-4 border-l-slate-400', count: 'text-slate-700 text-xl font-bold', label: 'text-slate-600 text-xs', status: 'text-slate-400 text-xs' };
  return (
    <div
      className={`p-3 rounded-xl border border-slate-200 text-center shadow-sm ${t.tile} ${!isSatisfied ? 'ring-2 ring-red-400/60' : ''}`}
    >
      <div className={t.count}>{count}</div>
      <div className={`${t.label} font-medium mt-0.5`}>{label}</div>
      <div className={`${t.status} font-normal mt-0.5`}>
        Min: {min} {isSatisfied ? '✓' : '⚠'}
      </div>
    </div>
  );
}

const PLAYER_GROUP_THEMES = {
  'Batters':       { header: 'bg-amber-50/50', text: 'text-amber-800', icon: '🏏', border: 'border-amber-200', accent: 'bg-white hover:bg-amber-50/30 border-l-4 border-l-amber-400' },
  'All-Rounders':  { header: 'bg-violet-50/50', text: 'text-violet-800', icon: '⚡', border: 'border-violet-200', accent: 'bg-white hover:bg-violet-50/30 border-l-4 border-l-violet-400' },
  'Wicketkeepers': { header: 'bg-teal-50/50', text: 'text-teal-800', icon: '🧤', border: 'border-teal-200', accent: 'bg-white hover:bg-teal-50/30 border-l-4 border-l-teal-400' },
  'Fast Bowlers':  { header: 'bg-rose-50/50', text: 'text-rose-800', icon: '🔥', border: 'border-rose-200', accent: 'bg-white hover:bg-rose-50/30 border-l-4 border-l-rose-400' },
  'Spinners':      { header: 'bg-blue-50/50', text: 'text-blue-800', icon: '🌀', border: 'border-blue-200', accent: 'bg-white hover:bg-blue-50/30 border-l-4 border-l-blue-400' },
};

function PlayerGroup({ title, players, teamRoles, onSelect, onRemove }) {
  if (players.length === 0) return null;

  const t = PLAYER_GROUP_THEMES[title] || { header: 'bg-slate-50', text: 'text-slate-800', icon: '👤', border: 'border-slate-200', accent: 'bg-white hover:bg-slate-50/50 border-l-4 border-l-slate-400' };

  return (
    <div className={`rounded-xl border ${t.border} overflow-hidden shadow-sm`}>
      <div className={`px-4 py-2.5 ${t.header} border-b ${t.border} flex items-center justify-between`}>
        <span className={`text-xs font-semibold ${t.text} flex items-center gap-1.5`}>
          <span>{t.icon}</span> {title}
        </span>
        <span className="text-xs font-medium text-slate-500 bg-white/60 px-2 py-0.5 rounded border border-black/5">{players.length} Players</span>
      </div>

      <div className="divide-y divide-slate-100 bg-white">
        {players.map(p => {
          const isCaptain = teamRoles?.captainId === p.id;
          const isViceCaptain = teamRoles?.viceCaptainId === p.id;
          const isWK = teamRoles?.wicketkeeperId === p.id;

          return (
            <div
              key={p.id}
              onClick={() => onSelect(p.id)}
              className={`p-3 flex items-center justify-between hover:bg-slate-50 transition cursor-pointer ${t.accent}`}
            >
              <div className="flex items-center gap-3 min-w-0 flex-1">
                <CloudinaryAvatar src={p.avatar_url} alt={p.full_name} className="w-10 h-10 rounded-lg object-cover border border-slate-100 shrink-0" />
                <div className="min-w-0 flex-1 space-y-0.5">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-semibold text-sm text-slate-900">{p.full_name}</span>
                    <span className="text-xs font-normal text-slate-500">
                      {p.district}
                    </span>
                    {isCaptain && (
                      <span className="text-xs font-semibold bg-amber-100 text-amber-800 border border-amber-300/60 px-2 py-0.5 rounded flex items-center gap-1">
                        <Crown className="w-3 h-3 text-amber-600" /> Captain
                      </span>
                    )}
                    {isViceCaptain && (
                      <span className="text-xs font-semibold bg-blue-100 text-blue-800 border border-blue-300/60 px-2 py-0.5 rounded flex items-center gap-1">
                        <Award className="w-3 h-3 text-blue-600" /> Vice Captain
                      </span>
                    )}
                    {isWK && (
                      <span className="text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-300/60 px-2 py-0.5 rounded flex items-center gap-1">
                        <Shield className="w-3 h-3 text-emerald-600" /> WK
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-slate-500 font-normal">
                    {p.primary_role} • {p.batting_style} {p.bowling_style && `• ${p.bowling_style}`}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3" onClick={e => e.stopPropagation()}>
                <div className="text-right text-xs hidden sm:block">
                  <div className="font-semibold text-slate-800">{p.careerRuns || p.runs} Runs</div>
                  <div className="text-xs text-slate-400 font-normal">{p.wickets || 0} Wickets</div>
                </div>

                <button
                  type="button"
                  onClick={() => onRemove(p.id)}
                  className="p-1.5 rounded-lg border border-rose-200 bg-rose-50 text-rose-500 hover:bg-rose-100 hover:border-rose-300 transition cursor-pointer"
                  title="Remove from Selected Team"
                >
                  <UserX className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={() => onSelect(p.id)}
                  className="p-1.5 rounded-lg bg-slate-100 text-slate-600 hover:bg-blue-600 hover:text-white transition cursor-pointer"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
