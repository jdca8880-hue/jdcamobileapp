import React from 'react';
import { Bookmark, Scale, ChevronRight, X } from 'lucide-react';

/**
 * Shared JDCA role palette — same tokens as PlayerPool for visual consistency.
 */
const ROLE_THEMES = {
  'Batter': {
    border:  'border-l-amber-500',
    badge:   'bg-amber-50 text-amber-700 border-amber-200',
    statBox: 'bg-amber-50 border-amber-100',
    statVal: 'text-amber-700',
    statLbl: 'text-amber-500',
    ring:    'ring-amber-300',
    pill:    'bg-amber-50 text-amber-700 border-amber-200',
  },
  'Bowler': {
    border:  'border-l-blue-600',
    badge:   'bg-blue-50 text-blue-700 border-blue-200',
    statBox: 'bg-blue-50 border-blue-100',
    statVal: 'text-blue-700',
    statLbl: 'text-blue-400',
    ring:    'ring-blue-300',
    pill:    'bg-blue-50 text-blue-700 border-blue-200',
  },
  'All-Rounder': {
    border:  'border-l-violet-600',
    badge:   'bg-violet-50 text-violet-700 border-violet-200',
    statBox: 'bg-violet-50 border-violet-100',
    statVal: 'text-violet-700',
    statLbl: 'text-violet-400',
    ring:    'ring-violet-300',
    pill:    'bg-violet-50 text-violet-700 border-violet-200',
  },
  'Wicket Keeper': {
    border:  'border-l-teal-600',
    badge:   'bg-teal-50 text-teal-700 border-teal-200',
    statBox: 'bg-teal-50 border-teal-100',
    statVal: 'text-teal-700',
    statLbl: 'text-teal-500',
    ring:    'ring-teal-300',
    pill:    'bg-teal-50 text-teal-700 border-teal-200',
  },
};
const DEFAULT_THEME = {
  border:  'border-l-slate-400',
  badge:   'bg-slate-100 text-slate-600 border-slate-200',
  statBox: 'bg-slate-50 border-slate-100',
  statVal: 'text-slate-700',
  statLbl: 'text-slate-400',
  ring:    'ring-slate-300',
  pill:    'bg-slate-100 text-slate-600 border-slate-200',
};

export default function Shortlist({
  players,
  selectedPlayerId,
  onSelectPlayer,
  onToggleShortlist,
  compareIds,
  onToggleCompare,
  onNavigateToCompare,
}) {
  if (!players || players.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 p-10 text-center space-y-3">
        <div className="w-11 h-11 rounded-xl bg-indigo-50 text-indigo-500 flex items-center justify-center mx-auto border border-indigo-100">
          <Bookmark className="w-5 h-5" />
        </div>
        <h3 className="text-sm font-semibold text-slate-900">No Players Shortlisted Yet</h3>
        <p className="text-xs text-slate-500 max-w-sm mx-auto">
          Browse the Candidate pool and click <span className="font-medium text-slate-700">"Shortlist"</span> to add prospective players here.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-2.5 pb-6">
      {/* TOOLBAR */}
      <div className="flex items-center justify-between bg-white p-3 rounded-xl border border-slate-200 shadow-sm">
        <div className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
          Shortlisted · {players.length} candidates
        </div>
        {compareIds.length >= 2 && (
          <button
            onClick={onNavigateToCompare}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-white rounded-lg text-xs font-semibold transition shadow-sm cursor-pointer"
          >
            <Scale className="w-3.5 h-3.5" />
            <span>Compare {compareIds.length} Players</span>
          </button>
        )}
      </div>

      {/* PLAYER ROWS */}
      <div className="space-y-2">
        {players.map(player => {
          const isSelected = selectedPlayerId === player.id;
          const isInCompare = compareIds.includes(player.id);
          const isBowler =
            player.primary_role === 'Bowler' ||
            player.primary_role?.includes('Bowl') ||
            player.primary_role?.includes('Fast') ||
            player.primary_role?.includes('Spin');
          const t = ROLE_THEMES[player.primary_role] || DEFAULT_THEME;

          return (
            <div
              key={player.id}
              onClick={() => onSelectPlayer(player.id)}
              className={`group bg-white rounded-xl border border-slate-200 border-l-4 ${t.border} p-3.5 transition cursor-pointer shadow-sm hover:shadow-md ${
                isSelected ? `ring-2 ${t.ring} ring-offset-1` : 'hover:border-slate-300'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                {/* IDENTITY */}
                <div className="flex items-start gap-3 min-w-0 flex-1">
                  <img
                    src={player.avatar_url}
                    alt={player.full_name}
                    className="w-10 h-10 rounded-lg object-cover border border-slate-200 shrink-0"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className="font-semibold text-sm text-slate-900 truncate">
                        {player.full_name}
                      </span>
                      <span className={`text-xs font-semibold px-1.5 py-0.5 border rounded uppercase tracking-wide ${t.pill}`}>
                        {player.primary_role === 'Wicket Keeper' ? 'WK' : player.primary_role}
                      </span>
                      <span className="text-xs font-medium px-2 py-0.5 bg-slate-100 text-slate-500 border border-slate-200 rounded">
                        {player.district}
                      </span>
                      <span className="text-xs font-medium px-2 py-0.5 bg-slate-100 text-slate-500 border border-slate-200 rounded">
                        {player.ageGroup}
                      </span>
                    </div>
                    <div className="text-xs text-slate-400 font-normal truncate mt-0.5">
                      <span className="text-slate-600 font-medium">{player.primary_role}</span>
                      <span className="mx-1.5">·</span>
                      <span>{player.batting_style}</span>
                    </div>
                  </div>
                </div>

                {/* STATS */}
                <div className="flex items-center gap-3">
                  <div className={`${t.statBox} border px-2.5 py-1.5 rounded-lg text-center min-w-[56px]`}>
                    <div className={`text-xs font-medium ${t.statLbl}`}>Recent Form</div>
                    <div className={`text-xs font-semibold ${t.statVal} mt-0.5`}>
                      {player.recentFormString || '–'}
                    </div>
                  </div>

                  <div className={`${t.statBox} border px-2.5 py-1.5 rounded-lg text-center min-w-[52px]`}>
                    <div className={`text-xs font-medium ${t.statLbl}`}>
                      {isBowler ? 'Wickets' : 'Runs'}
                    </div>
                    <div className={`text-xs font-bold ${t.statVal} mt-0.5`}>
                      {isBowler ? `${player.wickets}` : `${player.careerRuns || player.runs}`}
                    </div>
                  </div>

                  <div className={`hidden sm:block ${t.statBox} border px-2.5 py-1.5 rounded-lg text-center min-w-[52px]`}>
                    <div className={`text-xs font-medium ${t.statLbl}`}>
                      {isBowler ? 'Economy' : 'Avg'}
                    </div>
                    <div className={`text-xs font-semibold ${t.statVal} mt-0.5`}>
                      {isBowler ? player.economy : player.battingAvg}
                    </div>
                  </div>
                </div>

                {/* ACTIONS */}
                <div className="flex items-center gap-1.5 shrink-0" onClick={e => e.stopPropagation()}>
                  <button
                    type="button"
                    onClick={() => onToggleCompare(player.id)}
                    className={`p-1.5 rounded-lg border text-xs font-medium transition flex items-center gap-1 cursor-pointer ${
                      isInCompare
                        ? 'bg-amber-500 text-white border-amber-600'
                        : 'bg-white text-slate-500 border-slate-200 hover:border-slate-300 hover:text-slate-700'
                    }`}
                    title={isInCompare ? 'Remove from Compare' : 'Add to Compare'}
                  >
                    <Scale className="w-3.5 h-3.5" />
                    <span className="hidden lg:inline text-xs">
                      {isInCompare ? 'Compared' : 'Compare'}
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => onToggleShortlist(player.id)}
                    className="p-1.5 rounded-lg border border-slate-200 bg-white text-rose-500 hover:bg-rose-50 hover:border-rose-300 transition cursor-pointer"
                    title="Remove from Shortlist"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>

                  <button
                    type="button"
                    onClick={() => onSelectPlayer(player.id)}
                    className="p-1.5 rounded-lg bg-slate-100 text-slate-500 hover:bg-slate-800 hover:text-white transition cursor-pointer border border-slate-200"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
