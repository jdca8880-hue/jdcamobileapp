import React, { useState, useEffect, useMemo } from 'react';
import {
  ArrowLeft, Star, MapPin, Award, ShieldCheck, Trash2, Pencil, Hand, Target
} from 'lucide-react';
import { useCricket } from '../../context/CricketContext';
import { api } from '../../lib/api';
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  CartesianGrid, LabelList
} from 'recharts';

// Chart entity colors — validated (dataviz skill) for CVD + contrast on white:
//   batting #D97706 · bowling #1D4ED8 · fielding #059669
const C_BAT = '#D97706';
const C_BOWL = '#1D4ED8';
const C_FIELD = '#059669';
const INK = '#0f172a';
const GRID = '#e2e8f0';

const ProfileTabs = ({ tabs, active, onChange }) => (
  <div className="flex bg-slate-100 dark:bg-[#1E2226]p-1 rounded-xl mb-4 max-w-2xl mx-auto overflow-x-auto">
    {tabs.map(tab => (
      <button
        key={tab.id}
        onClick={() => onChange(tab.id)}
        className={`flex-1 whitespace-nowrap py-1.5 px-2 rounded-lg text-xs font-medium transition-all cursor-pointer ${
          active === tab.id ? 'bg-white dark:bg-[#14171A] text-slate-900 dark:text-[#F3F4F6] shadow-2xs font-semibold' : 'text-slate-500 dark:text-[#94A3B8] hover:text-slate-900 dark:hover:text-[#F3F4F6]'
        }`}
      >
        {tab.label}
      </button>
    ))}
  </div>
);

const Stat = ({ label, value, accent }) => (
  <div className="bg-white dark:bg-[#14171A] rounded-xl p-4 border border-slate-200 dark:border-white/10 shadow-2xs">
    <div className="text-xs font-medium text-slate-400 dark:text-[#64748B]">{label}</div>
    <div className={`text-xl sm:text-2xl font-semibold mt-1 tabular-nums ${accent || 'text-slate-900 dark:text-[#F3F4F6]'}`}>
      {value}
    </div>
  </div>
);

// Shared rich tooltip: names the match, format and the plotted metrics.
function ChartTooltip({ active, payload }) {
  if (!active || !payload || !payload.length) return null;
  const row = payload[0].payload;
  return (
    <div className="rounded-lg bg-white dark:bg-[#14171A] border border-slate-200 dark:border-white/10 shadow-md px-3 py-2 text-xs">
      <div className="font-semibold text-slate-900 dark:text-[#F3F4F6]">{row.matchup}</div>
      <div className="text-slate-500 dark:text-[#94A3B8] mb-1">{row.date} · {row.format}</div>
      {payload.map(p => (
        <div key={p.dataKey} className="flex items-center gap-1.5 text-slate-700 dark:text-[#CBD5E1]">
          <span className="w-2 h-2 rounded-full" style={{ background: p.color }} />
          <span>{p.name}: <span className="font-semibold tabular-nums">{p.value}</span></span>
        </div>
      ))}
    </div>
  );
}

const EmptyChart = ({ text }) => (
  <div className="h-48 flex items-center justify-center text-sm text-slate-400 dark:text-[#64748B] border border-dashed border-slate-200 dark:border-white/10 rounded-lg">
    {text}
  </div>
);

// Bar chart of a single magnitude metric per innings, with direct value labels
// (the contrast-relief the palette validator requires) and a hover tooltip.
function MatchBarChart({ data, dataKey, name, color }) {
  if (!data || data.length === 0) return <EmptyChart text="No match data yet" />;
  return (
    <div className="h-52 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 18, right: 8, left: -12, bottom: 4 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={GRID} />
          <XAxis dataKey="n" tick={{ fontSize: 10, fill: '#94a3b8' }} tickLine={false} axisLine={{ stroke: GRID }} />
          <YAxis tick={{ fontSize: 10, fill: '#94a3b8' }} tickLine={false} axisLine={false} allowDecimals={false} width={28} />
          <Tooltip cursor={{ fill: 'rgba(148,163,184,0.12)' }} content={<ChartTooltip />} />
          <Bar dataKey={dataKey} name={name} fill={color} radius={[4, 4, 0, 0]} maxBarSize={30}>
            <LabelList dataKey={dataKey} position="top" style={{ fontSize: 10, fill: INK, fontWeight: 600 }} />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

// Line chart of a single rate metric per innings (trend over time).
function MatchLineChart({ data, dataKey, name, color }) {
  if (!data || data.length === 0) return <EmptyChart text="No match data yet" />;
  return (
    <div className="h-52 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 18, right: 10, left: -12, bottom: 4 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={GRID} />
          <XAxis dataKey="n" tick={{ fontSize: 10, fill: '#94a3b8' }} tickLine={false} axisLine={{ stroke: GRID }} />
          <YAxis tick={{ fontSize: 10, fill: '#94a3b8' }} tickLine={false} axisLine={false} width={34} />
          <Tooltip content={<ChartTooltip />} />
          <Line type="monotone" dataKey={dataKey} name={name} stroke={color} strokeWidth={2}
            dot={{ r: 3, fill: color, strokeWidth: 0 }} activeDot={{ r: 5 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export default function PlayerProfileScreen() {
  const { selectedPlayer, goBack, shortlistedIds, toggleShortlist, userRole, setPlayers, setEditingPlayer, navigateTo } = useCricket();
  // Scorers can add/edit players and soft-delete them (move to Recycle Bin).
  const canEditPlayer = ['SUPER_ADMIN', 'DISTRICT_ADMIN', 'SCORER'].includes(userRole);
  // Soft delete only — permanent delete from the Recycle Bin stays SUPER_ADMIN.
  const canSoftDeletePlayer = ['SUPER_ADMIN', 'DISTRICT_ADMIN', 'SCORER'].includes(userRole);
  const [activeTab, setActiveTab] = useState('Overview');
  const [isDeleting, setIsDeleting] = useState(false);
  const [matchStats, setMatchStats] = useState({ batting: [], bowling: [], fielding: [] });

  const player = selectedPlayer;

  useEffect(() => {
    if (player?.id) {
      api.getPlayerMatchStats(player.id)
        .then(s => setMatchStats({ batting: s.batting || [], bowling: s.bowling || [], fielding: s.fielding || [] }))
        .catch(console.error);
    }
  }, [player?.id]);

  // Index each innings (#1, #2, …) for compact x-axes; details live in the tooltip.
  const battingSeries = useMemo(
    () => matchStats.batting.map((r, i) => ({ ...r, n: `#${i + 1}` })),
    [matchStats.batting]
  );
  const bowlingSeries = useMemo(
    () => matchStats.bowling.map((r, i) => ({ ...r, n: `#${i + 1}` })),
    [matchStats.bowling]
  );

  // Combined per-match history (newest first) merging batting, bowling, fielding.
  const history = useMemo(() => {
    const map = new Map();
    const touch = (r) => {
      if (!map.has(r.match_id)) {
        map.set(r.match_id, { match_id: r.match_id, date: r.date, format: r.format, matchup: r.matchup, sortTs: r.sortTs || 0 });
      }
      return map.get(r.match_id);
    };
    matchStats.batting.forEach(r => { touch(r).bat = r; });
    matchStats.bowling.forEach(r => { touch(r).bowl = r; });
    matchStats.fielding.forEach(r => { touch(r).field = r; });
    return [...map.values()].sort((a, b) => b.sortTs - a.sortTs);
  }, [matchStats]);

  if (!player) {
    return (
      <div className="pb-20 bg-[#f8fafc] dark:bg-[#0A0A0A] min-h-screen flex flex-col items-center justify-center p-6">
        <div className="bg-white dark:bg-[#14171A] p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-white/10 text-center max-w-md w-full">
          <h2 className="text-xl font-bold text-slate-800 dark:text-[#E5E7EB] mb-2">No Player Selected</h2>
          <p className="text-sm text-slate-500 dark:text-[#94A3B8] mb-4">Please select a player from the directory to view their profile.</p>
          <button onClick={goBack} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition w-full">
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const isShortlisted = shortlistedIds?.includes(player.id);

  const tabs = [
    { id: 'Overview', label: 'Stats' },
    { id: 'Batting', label: 'Batting' },
    { id: 'Bowling', label: 'Bowling' },
    { id: 'Fielding', label: 'Fielding / WK' },
    { id: 'History', label: 'Match History' },
  ];

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this player? They will be moved to the Recycle Bin.")) return;
    setIsDeleting(true);
    try {
      const { api } = await import('../../lib/api');
      await api.deletePlayer(player.id);
      try {
        const { db } = await import('../../lib/db');
        await db.players.delete(player.id);
      } catch (e) {
        console.error("Failed to delete from local DB:", e);
      }
      if (setPlayers) setPlayers(prev => prev.filter(p => p.id !== player.id));
      alert('Player deleted successfully.');
      goBack();
    } catch (err) {
      console.error(err);
      alert('Failed to delete player.');
    } finally {
      setIsDeleting(false);
    }
  };

  const num = (v) => (v === null || v === undefined || v === '' ? '-' : v);

  return (
    <div className="pb-20 bg-[#f8fafc] dark:bg-[#0A0A0A] min-h-screen">
      {/* Header Area */}
      <div className="bg-white dark:bg-[#14171A] border-b border-slate-200 dark:border-white/10 pt-14 sm:pt-6 pb-6 px-4 relative shadow-2xs">
        <div className="max-w-4xl mx-auto relative">
          <button onClick={goBack}
            className="absolute top-0 left-0 w-9 h-9 flex items-center justify-center rounded-lg border border-slate-200 dark:border-white/10 bg-white dark:bg-[#14171A] text-slate-600 dark:text-[#94A3B8] hover:text-slate-900 dark:hover:text-[#F3F4F6] hover:bg-slate-50 dark:hover:bg-[#1E2226] transition cursor-pointer"
            aria-label="Go Back">
            <ArrowLeft size={18} />
          </button>

          <button onClick={() => toggleShortlist(player.id)}
            className={`absolute top-0 right-0 w-9 h-9 flex items-center justify-center rounded-lg border transition cursor-pointer ${
              isShortlisted ? 'bg-amber-50 border-amber-200 text-amber-600' : 'bg-white dark:bg-[#14171A] border-slate-200 dark:border-white/10 text-slate-400 dark:text-[#64748B] hover:text-slate-600 dark:hover:text-[#94A3B8]'
            }`}
            aria-label="Toggle Shortlist">
            <Star size={18} fill={isShortlisted ? '#d97706' : 'none'} />
          </button>

          {canSoftDeletePlayer && (
            <button onClick={handleDelete} disabled={isDeleting}
              className="absolute top-0 right-11 w-9 h-9 flex items-center justify-center rounded-lg border bg-white dark:bg-[#14171A] border-rose-200 text-rose-500 hover:text-rose-700 hover:bg-rose-50 transition cursor-pointer disabled:opacity-50"
              title="Delete Player">
              <Trash2 size={16} />
            </button>
          )}

          {canEditPlayer && (
            <button onClick={() => { setEditingPlayer(player); navigateTo('player-registration'); }}
              className="absolute top-0 right-[88px] w-9 h-9 flex items-center justify-center rounded-lg border bg-white dark:bg-[#14171A] border-blue-200 text-blue-600 hover:text-blue-800 hover:bg-blue-50 transition cursor-pointer"
              title="Edit Player">
              <Pencil size={15} />
            </button>
          )}

          <div className="flex flex-col items-center mt-2 text-center">
            <img
              src={player.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(player.full_name || 'Player')}&background=random`}
              alt={player.full_name}
              className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover border-2 border-white shadow-sm mb-3"
            />
            <h1 className="text-xl sm:text-2xl font-semibold text-slate-900 dark:text-[#F3F4F6] leading-tight mb-1">{player.full_name}</h1>
            <div className="text-xs text-slate-500 dark:text-[#94A3B8] flex flex-wrap items-center justify-center gap-1.5 mb-3">
              <span className="font-medium text-slate-700 dark:text-[#CBD5E1]">{player.primary_role}</span>
              <span>•</span>
              <MapPin size={12} className="text-blue-600" />
              <span>{player.district}</span>
              <span>•</span>
              <span>{player.team || 'District XI'}</span>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-2">
              <span className="px-2.5 py-0.5 rounded-md bg-blue-50 text-blue-700 text-xs font-medium border border-blue-100">
                {player.category || 'Senior'}
              </span>
              {player.batting_style && (
                <span className="px-2.5 py-0.5 rounded-md bg-amber-50 text-amber-700 text-xs font-medium border border-amber-100">
                  {player.batting_style}
                </span>
              )}
              {player.bowling_style && player.bowling_style !== 'None (Pure Batter)' && (
                <span className="px-2.5 py-0.5 rounded-md bg-slate-100 dark:bg-[#1E2226]text-slate-700 dark:text-[#CBD5E1] text-xs font-medium border border-slate-200 dark:border-white/10">
                  {player.bowling_style}
                </span>
              )}
              <span className="px-2.5 py-0.5 rounded-md bg-emerald-50 text-emerald-700 text-xs font-medium border border-emerald-100 flex items-center gap-1">
                <ShieldCheck size={12} /> Registered
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 pt-5">
        <ProfileTabs tabs={tabs} active={activeTab} onChange={setActiveTab} />

        <div className="space-y-4">
          {/* ===== OVERVIEW ===== */}
          {activeTab === 'Overview' && (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <Stat label="Matches" value={player.matches || 0} />
                <Stat label="Career Runs" value={player.careerRuns || 0} accent="text-amber-700" />
                <Stat label="Batting Avg" value={player.battingAvg ? player.battingAvg : '-'} />
                <Stat label="Strike Rate" value={player.strikeRate ? player.strikeRate : '-'} />
                <Stat label="Wickets" value={player.wickets || 0} accent="text-blue-700" />
                <Stat label="Economy" value={player.economy ? player.economy : '-'} />
                <Stat label="Best Bowling" value={num(player.bestBowling)} />
                <Stat label="Dismissals (field)" value={player.dismissalsTaken || 0} accent="text-emerald-700" />
              </div>

              <div className="bg-white dark:bg-[#14171A] rounded-xl p-5 border border-slate-200 dark:border-white/10 shadow-2xs space-y-3">
                <div className="flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-white/10">
                  <Award size={16} className="text-amber-500" />
                  <h3 className="font-semibold text-sm text-slate-900 dark:text-[#F3F4F6]">Distinctions & Honors</h3>
                </div>
                {(player.awards || []).length > 0 ? (
                  <ul className="space-y-2 text-xs">
                    {(player.awards || []).map((award, i) => (
                      <li key={i} className="flex items-center gap-2 text-slate-700 dark:text-[#CBD5E1]">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" />
                        <span>{award}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-xs text-slate-400 dark:text-[#64748B]">No honors recorded yet.</p>
                )}
              </div>
            </>
          )}

          {/* ===== BATTING ===== */}
          {activeTab === 'Batting' && (
            <div className="bg-white dark:bg-[#14171A] rounded-xl border border-slate-200 dark:border-white/10 shadow-2xs overflow-hidden">
              <div className="p-4 border-b border-slate-100 dark:border-white/10 bg-slate-50/60 dark:bg-[#181A1D]">
                <h3 className="font-semibold text-sm text-slate-900 dark:text-[#F3F4F6]">Batting Profile</h3>
                <p className="text-xs text-slate-500 dark:text-[#94A3B8]">{player.batting_style || '-'}</p>
              </div>
              <div className="p-4 grid grid-cols-3 sm:grid-cols-6 gap-4">
                <div><div className="text-xs font-medium text-slate-400 dark:text-[#64748B]">Innings</div><div className="text-lg font-semibold text-slate-900 dark:text-[#F3F4F6] mt-0.5 tabular-nums">{player.inningsBatted || 0}</div></div>
                <div><div className="text-xs font-medium text-slate-400 dark:text-[#64748B]">Not Outs</div><div className="text-lg font-semibold text-slate-900 dark:text-[#F3F4F6] mt-0.5 tabular-nums">{player.notOuts || 0}</div></div>
                <div><div className="text-xs font-medium text-slate-400 dark:text-[#64748B]">High Score</div><div className="text-lg font-semibold text-slate-900 dark:text-[#F3F4F6] mt-0.5 tabular-nums">{player.highScore || 0}</div></div>
                <div><div className="text-xs font-medium text-slate-400 dark:text-[#64748B]">50s / 100s</div><div className="text-lg font-semibold text-slate-900 dark:text-[#F3F4F6] mt-0.5 tabular-nums">{player.fifties || 0} / {player.hundreds || 0}</div></div>
                <div><div className="text-xs font-medium text-slate-400 dark:text-[#64748B]">4s / 6s</div><div className="text-lg font-semibold text-slate-900 dark:text-[#F3F4F6] mt-0.5 tabular-nums">{player.fours || 0} / {player.sixes || 0}</div></div>
                <div><div className="text-xs font-medium text-slate-400 dark:text-[#64748B]">Avg / SR</div><div className="text-lg font-semibold text-slate-900 dark:text-[#F3F4F6] mt-0.5 tabular-nums">{player.battingAvg || 0} / {player.strikeRate || 0}</div></div>
              </div>

              <div className="p-4 border-t border-slate-100 dark:border-white/10">
                <h4 className="font-semibold text-sm text-slate-800 dark:text-[#E5E7EB] mb-3">Runs per innings</h4>
                <MatchBarChart data={battingSeries} dataKey="runs_scored" name="Runs" color={C_BAT} />
              </div>
              <div className="p-4 border-t border-slate-100 dark:border-white/10">
                <h4 className="font-semibold text-sm text-slate-800 dark:text-[#E5E7EB] mb-3">Strike rate trend</h4>
                <MatchLineChart data={battingSeries} dataKey="strike_rate" name="Strike rate" color={C_BAT} />
              </div>
            </div>
          )}

          {/* ===== BOWLING ===== */}
          {activeTab === 'Bowling' && (
            <div className="bg-white dark:bg-[#14171A] rounded-xl border border-slate-200 dark:border-white/10 shadow-2xs overflow-hidden">
              <div className="p-4 border-b border-slate-100 dark:border-white/10 bg-slate-50/60 dark:bg-[#181A1D]">
                <h3 className="font-semibold text-sm text-slate-900 dark:text-[#F3F4F6]">Bowling Profile</h3>
                <p className="text-xs text-slate-500 dark:text-[#94A3B8]">{player.bowling_style || '-'}</p>
              </div>
              <div className="p-4 grid grid-cols-3 sm:grid-cols-6 gap-4">
                <div><div className="text-xs font-medium text-slate-400 dark:text-[#64748B]">Wickets</div><div className="text-lg font-semibold text-slate-900 dark:text-[#F3F4F6] mt-0.5 tabular-nums">{player.wickets || 0}</div></div>
                <div><div className="text-xs font-medium text-slate-400 dark:text-[#64748B]">Economy</div><div className="text-lg font-semibold text-slate-900 dark:text-[#F3F4F6] mt-0.5 tabular-nums">{player.economy || '-'}</div></div>
                <div><div className="text-xs font-medium text-slate-400 dark:text-[#64748B]">Average</div><div className="text-lg font-semibold text-slate-900 dark:text-[#F3F4F6] mt-0.5 tabular-nums">{player.bowlingAvg || '-'}</div></div>
                <div><div className="text-xs font-medium text-slate-400 dark:text-[#64748B]">Best</div><div className="text-lg font-semibold text-slate-900 dark:text-[#F3F4F6] mt-0.5 tabular-nums">{num(player.bestBowling)}</div></div>
                <div><div className="text-xs font-medium text-slate-400 dark:text-[#64748B]">Maidens</div><div className="text-lg font-semibold text-slate-900 dark:text-[#F3F4F6] mt-0.5 tabular-nums">{player.maidens || 0}</div></div>
                <div><div className="text-xs font-medium text-slate-400 dark:text-[#64748B]">5W Hauls</div><div className="text-lg font-semibold text-slate-900 dark:text-[#F3F4F6] mt-0.5 tabular-nums">{player.fiveWicketHauls || 0}</div></div>
              </div>

              <div className="p-4 border-t border-slate-100 dark:border-white/10">
                <h4 className="font-semibold text-sm text-slate-800 dark:text-[#E5E7EB] mb-3">Wickets per innings</h4>
                <MatchBarChart data={bowlingSeries} dataKey="wickets_taken" name="Wickets" color={C_BOWL} />
              </div>
              <div className="p-4 border-t border-slate-100 dark:border-white/10">
                <h4 className="font-semibold text-sm text-slate-800 dark:text-[#E5E7EB] mb-3">Economy trend</h4>
                <MatchLineChart data={bowlingSeries} dataKey="economy" name="Economy" color={C_BOWL} />
              </div>
            </div>
          )}

          {/* ===== FIELDING / WK ===== */}
          {activeTab === 'Fielding' && (
            <div className="bg-white dark:bg-[#14171A] rounded-xl border border-slate-200 dark:border-white/10 shadow-2xs overflow-hidden">
              <div className="p-4 border-b border-slate-100 dark:border-white/10 bg-slate-50/60 dark:bg-[#181A1D] flex items-center gap-2">
                <Hand size={16} className="text-emerald-600" />
                <h3 className="font-semibold text-sm text-slate-900 dark:text-[#F3F4F6]">Fielding & Wicketkeeping</h3>
              </div>
              <div className="p-4 grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div><div className="text-xs font-medium text-slate-400 dark:text-[#64748B]">Catches</div><div className="text-lg font-semibold text-emerald-700 mt-0.5 tabular-nums">{player.catches || 0}</div></div>
                <div><div className="text-xs font-medium text-slate-400 dark:text-[#64748B] flex items-center gap-1"><Target size={12} /> Catches (keeper)</div><div className="text-lg font-semibold text-emerald-700 mt-0.5 tabular-nums">{player.catchesBehind || 0}</div></div>
                <div><div className="text-xs font-medium text-slate-400 dark:text-[#64748B]">Stumpings</div><div className="text-lg font-semibold text-emerald-700 mt-0.5 tabular-nums">{player.stumpings || 0}</div></div>
                <div><div className="text-xs font-medium text-slate-400 dark:text-[#64748B]">Run Outs</div><div className="text-lg font-semibold text-emerald-700 mt-0.5 tabular-nums">{player.runOuts || 0}</div></div>
              </div>
              <div className="px-4 pb-4 text-xs text-slate-500 dark:text-[#94A3B8]">
                Total dismissals contributed in the field: <span className="font-semibold text-slate-800 dark:text-[#E5E7EB] tabular-nums">{player.dismissalsTaken || 0}</span>
              </div>
            </div>
          )}

          {/* ===== MATCH HISTORY ===== */}
          {activeTab === 'History' && (
            <div className="bg-white dark:bg-[#14171A] rounded-xl border border-slate-200 dark:border-white/10 shadow-2xs overflow-hidden">
              <div className="p-4 border-b border-slate-100 dark:border-white/10 bg-slate-50/60 dark:bg-[#181A1D]">
                <h3 className="font-semibold text-sm text-slate-900 dark:text-[#F3F4F6]">Per-Match Performance</h3>
                <p className="text-xs text-slate-500 dark:text-[#94A3B8]">Every match this player has featured in, newest first.</p>
              </div>
              {history.length === 0 ? (
                <div className="p-8 text-center text-slate-400 dark:text-[#64748B] text-sm">No match history yet.</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="text-slate-400 dark:text-[#64748B] text-left border-b border-slate-100 dark:border-white/10">
                        <th className="p-3 font-medium">Match</th>
                        <th className="p-3 font-medium">Format</th>
                        <th className="p-3 font-medium">Batting</th>
                        <th className="p-3 font-medium">Bowling</th>
                        <th className="p-3 font-medium">Fielding</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50 dark:divide-white/10">
                      {history.map(h => {
                        const bat = h.bat
                          ? `${h.bat.runs_scored}${h.bat.not_out ? '*' : ''} (${h.bat.balls_faced})`
                          : '—';
                        const bowl = h.bowl
                          ? `${h.bowl.wickets_taken}/${h.bowl.runs_conceded} (${h.bowl.overs} ov)`
                          : '—';
                        const f = h.field;
                        const fieldParts = f ? [
                          f.catches ? `${f.catches}c` : '',
                          f.catches_behind ? `${f.catches_behind}c(wk)` : '',
                          f.stumpings ? `${f.stumpings}st` : '',
                          f.run_outs ? `${f.run_outs}ro` : ''
                        ].filter(Boolean).join(' ') : '';
                        return (
                          <tr key={h.match_id} className="text-slate-700 dark:text-[#CBD5E1]">
                            <td className="p-3">
                              <div className="font-medium text-slate-900 dark:text-[#F3F4F6]">{h.matchup}</div>
                              <div className="text-slate-400 dark:text-[#64748B]">{h.date}</div>
                            </td>
                            <td className="p-3">{h.format}</td>
                            <td className="p-3 tabular-nums">{bat}</td>
                            <td className="p-3 tabular-nums">{bowl}</td>
                            <td className="p-3 tabular-nums">{fieldParts || '—'}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
