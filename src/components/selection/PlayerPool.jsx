import React from 'react';
import {
  Bookmark,
  CheckCircle2,
  Scale,
  ChevronRight,
  UserPlus,
  UserCheck,
  AlertTriangle,
} from 'lucide-react';
import CloudinaryAvatar from '../ui/CloudinaryAvatar';
import { motion } from 'motion/react';
import { useHaptics } from '../../hooks/useHaptics';

/**
 * JDCA ROLE PALETTE
 * Cohesive set: Amber (bat/runs), Blue (sky/precision), Violet (all-round), Teal (gloves).
 * Cards: white bg, 4px left border accent, tinted stat boxes, solid role badge.
 */
const ROLE_THEMES = {
  'Batter': {
    border:   'border-l-amber-500',
    badge:    'bg-amber-50 text-amber-700 border-amber-200',
    statBox:  'bg-amber-50 border-amber-100',
    statVal:  'text-amber-700',
    statLbl:  'text-amber-500',
    divider:  'border-slate-100',
    ringOn:   'ring-amber-300',
    label:    'Batter',
  },
  'Bowler': {
    border:   'border-l-blue-600',
    badge:    'bg-blue-50 text-blue-700 border-blue-200',
    statBox:  'bg-blue-50 border-blue-100',
    statVal:  'text-blue-700',
    statLbl:  'text-blue-400',
    divider:  'border-slate-100',
    ringOn:   'ring-blue-300',
    label:    'Bowler',
  },
  'All-Rounder': {
    border:   'border-l-violet-600',
    badge:    'bg-violet-50 text-violet-700 border-violet-200',
    statBox:  'bg-violet-50 border-violet-100',
    statVal:  'text-violet-700',
    statLbl:  'text-violet-400',
    divider:  'border-slate-100',
    ringOn:   'ring-violet-300',
    label:    'All-Rounder',
  },
  'Wicket Keeper': {
    border:   'border-l-teal-600',
    badge:    'bg-teal-50 text-teal-700 border-teal-200',
    statBox:  'bg-teal-50 border-teal-100',
    statVal:  'text-teal-700',
    statLbl:  'text-teal-500',
    divider:  'border-slate-100',
    ringOn:   'ring-teal-300',
    label:    'WK',
  },
};
const DEFAULT_THEME = {
  border:   'border-l-slate-400',
  badge:    'bg-slate-100 text-slate-600 border-slate-200',
  statBox:  'bg-slate-50 border-slate-100',
  statVal:  'text-slate-700',
  statLbl:  'text-slate-400',
  divider:  'border-slate-100',
  ringOn:   'ring-slate-300',
  label:    '',
};

export default function PlayerPool({
  players,
  team,
  selectedPlayerId,
  onSelectPlayer,
  selectedTeamPlayerIds,
  onToggleSelectTeamPlayer,
  shortlistedPlayerIds,
  onToggleShortlistPlayer,
  compareIds,
  onToggleCompare,
}) {
  const haptics = useHaptics();
  if (!players || players.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 p-8 text-center space-y-2">
        <div className="text-slate-500 text-sm font-medium">No candidates found matching the selected filters.</div>
        <p className="text-xs text-slate-400 font-normal">Try adjusting your District, Role, or Eligibility filters above.</p>
      </div>
    );
  }

  return (
    <div className="space-y-2.5 pb-8">
      {players.map(player => {
        const isSelectedInDetail = selectedPlayerId === player.id;
        const isInSelectedTeam = selectedTeamPlayerIds.includes(player.id);
        const isShortlisted = shortlistedPlayerIds.includes(player.id);
        const isInCompare = compareIds.includes(player.id);
        const isEligible = player.eligibility?.isEligible;
        const isBowler = player.primary_role === 'Bowler' || player.primary_role?.includes('Bowl') || player.primary_role?.includes('Fast') || player.primary_role?.includes('Spin');
        const t = ROLE_THEMES[player.primary_role] || DEFAULT_THEME;

        return (
          <motion.div
            key={player.id}
            whileTap={{ scale: 0.985 }}
            onClick={() => {
              haptics.light();
              onSelectPlayer(player.id);
            }}
            className={`group bg-white rounded-xl border border-slate-200 border-l-4 ${t.border} p-4 transition-colors cursor-pointer shadow-sm hover:shadow-md ${
              isSelectedInDetail
                ? `ring-2 ${t.ringOn} ring-offset-1`
                : isInSelectedTeam
                ? 'border-l-emerald-500 bg-emerald-50/30'
                : 'hover:border-slate-300'
            }`}
          >
            {/* 1. HEADER: AVATAR + NAME + STATUS */}
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <CloudinaryAvatar
                  src={player.avatar_url}
                  alt={player.full_name}
                  className="w-11 h-11 rounded-lg object-cover border border-slate-200 shrink-0"
                />
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-semibold text-sm text-slate-900 group-hover:text-slate-700 transition truncate">
                      {player.full_name}
                    </span>
                    {/* Role badge */}
                    <span className={`text-xs font-semibold px-1.5 py-0.5 border rounded uppercase tracking-wide ${t.badge}`}>
                      {t.label || player.primary_role}
                    </span>
                  </div>
                  <div className="text-xs text-slate-400 font-normal mt-0.5 truncate">
                    <span className="font-medium text-slate-600">{player.district}</span>
                    <span className="mx-1.5">·</span>
                    <span>{player.ageGroup} · {player.age}y</span>
                    <span className="mx-1.5">·</span>
                    <span>{player.primary_role || player.primary_role}</span>
                  </div>
                </div>
              </div>

              {/* Status chip */}
              <div className="shrink-0">
                {isInSelectedTeam ? (
                  <span className="text-xs font-semibold px-2 py-0.5 bg-emerald-100 text-emerald-700 border border-emerald-200 rounded-md flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Selected
                  </span>
                ) : !isEligible ? (
                  <span
                    className="text-xs font-semibold px-2 py-0.5 bg-rose-50 text-rose-600 border border-rose-200 rounded-md flex items-center gap-1"
                    title={player.eligibility?.reason}
                  >
                    <AlertTriangle className="w-3 h-3" /> Ineligible
                  </span>
                ) : isShortlisted ? (
                  <span className="text-xs font-semibold px-2 py-0.5 bg-indigo-50 text-indigo-600 border border-indigo-200 rounded-md">
                    Shortlisted
                  </span>
                ) : (
                  <span className="text-xs font-medium px-2 py-0.5 bg-slate-100 text-slate-500 border border-slate-200 rounded-md">
                    Available
                  </span>
                )}
              </div>
            </div>

            {/* 2. STATS GRID */}
            <div className={`grid grid-cols-4 gap-2 mt-3 pt-3 border-t ${t.divider} text-center`}>
              <div className={`${t.statBox} border p-2 rounded-lg`}>
                <div className={`text-xs font-medium ${t.statLbl}`}>Recent Form</div>
                <div className={`text-xs font-semibold ${t.statVal} mt-0.5 truncate`}>
                  {player.recentFormString || '–'}
                </div>
              </div>
              <div className={`${t.statBox} border p-2 rounded-lg`}>
                <div className={`text-xs font-medium ${t.statLbl}`}>
                  {isBowler ? 'Wickets' : 'Runs'}
                </div>
                <div className={`text-xs font-bold ${t.statVal} mt-0.5 truncate`}>
                  {isBowler ? `${player.wickets} wk` : `${player.careerRuns || player.runs}`}
                </div>
              </div>
              <div className={`${t.statBox} border p-2 rounded-lg`}>
                <div className={`text-xs font-medium ${t.statLbl}`}>
                  {isBowler ? 'Economy' : 'Avg'}
                </div>
                <div className={`text-xs font-semibold ${t.statVal} mt-0.5 truncate`}>
                  {isBowler ? player.economy : player.battingAvg}
                </div>
              </div>
              <div className={`${t.statBox} border p-2 rounded-lg`}>
                <div className={`text-xs font-medium ${t.statLbl}`}>
                  {isBowler ? 'Best' : '50s/100s'}
                </div>
                <div className={`text-xs font-semibold ${t.statVal} mt-0.5 truncate`}>
                  {isBowler ? player.bestBowling : `${player.fifties || 0}/${player.hundreds || 0}`}
                </div>
              </div>
            </div>

            {/* 3. FOOTER ACTIONS */}
            <div className="flex items-center justify-between gap-2 mt-3 pt-2.5 border-t border-slate-100" onClick={e => e.stopPropagation()}>
              <button
                type="button"
                onClick={() => onToggleSelectTeamPlayer(player.id)}
                disabled={!isEligible && !isInSelectedTeam}
                className={`flex-1 py-1.5 px-3 rounded-lg border text-xs font-semibold transition flex items-center justify-center gap-1.5 cursor-pointer ${
                  isInSelectedTeam
                    ? 'bg-emerald-600 text-white border-emerald-700 hover:bg-emerald-700'
                    : !isEligible
                    ? 'bg-slate-50 text-slate-400 border-slate-200 cursor-not-allowed'
                    : 'bg-white text-slate-700 border-slate-300 hover:border-slate-400 hover:text-slate-900'
                }`}
                title={isInSelectedTeam ? 'Remove from Team' : isEligible ? 'Select for Team' : player.eligibility?.reason}
              >
                {isInSelectedTeam ? <UserCheck className="w-3.5 h-3.5" /> : <UserPlus className="w-3.5 h-3.5" />}
                <span>{isInSelectedTeam ? 'In Team' : 'Select'}</span>
              </button>

              <button
                type="button"
                onClick={() => onToggleCompare(player.id)}
                className={`p-2 rounded-lg border text-xs font-medium transition cursor-pointer ${
                  isInCompare
                    ? 'bg-amber-500 text-white border-amber-600'
                    : 'bg-white text-slate-500 border-slate-200 hover:border-slate-300 hover:text-slate-700'
                }`}
                title={isInCompare ? 'Remove from Comparison' : 'Add to Compare'}
              >
                <Scale className="w-3.5 h-3.5" />
              </button>

              <button
                type="button"
                onClick={() => onToggleShortlistPlayer(player.id)}
                className={`p-2 rounded-lg border text-xs font-medium transition cursor-pointer ${
                  isShortlisted
                    ? 'bg-indigo-600 text-white border-indigo-700'
                    : 'bg-white text-slate-500 border-slate-200 hover:border-slate-300 hover:text-slate-700'
                }`}
                title={isShortlisted ? 'Remove from Shortlist' : 'Shortlist'}
              >
                <Bookmark className="w-3.5 h-3.5" />
              </button>

              <button
                type="button"
                onClick={() => onSelectPlayer(player.id)}
                className="p-2 rounded-lg bg-slate-100 text-slate-500 hover:bg-slate-800 hover:text-white transition cursor-pointer border border-slate-200"
                title="Open Profile"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
