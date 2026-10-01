import React, { useState } from 'react';
import { Activity } from 'lucide-react';

/**
 * Clean, restrained SVG-based Cricket Performance Graphs
 * Provides Runs trend, Wickets bar, Economy rate, and Dismissals without decorative bloat.
 */
export default function PerformanceGraphs({ player }) {
  const [activeTab, setActiveTab] = useState('primary');

  const isBatter = player.primary_role === 'Batter' || player.primary_role?.includes('Bat');
  const isBowler = player.primary_role === 'Bowler' || player.primary_role?.includes('Bowl') || player.primary_role?.includes('Fast') || player.primary_role?.includes('Spin');
  const isWK = player.primary_role === 'Wicket Keeper' || player.primary_role?.includes('Keeper');
  const isAllRounder = player.primary_role === 'All-Rounder' || player.primary_role?.includes('All');

  const history = [...(player.matchHistory || [])].reverse();

  if (history.length === 0) {
    return (
      <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-500 text-center">
        No match performance records available for graphing.
      </div>
    );
  }

  return (
    <div className="space-y-2.5">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-semibold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
          <Activity className="w-3.5 h-3.5 text-blue-600" />
          <span>Performance Trend (Last {history.length} Matches)</span>
        </h3>

        {/* Chart Selector for All-rounders / WK */}
        {(isAllRounder || isWK) && (
          <div className="flex bg-slate-100 p-0.5 rounded-lg text-xs font-medium">
            <button
              onClick={() => setActiveTab('primary')}
              className={`px-2.5 py-0.5 rounded-md transition cursor-pointer ${activeTab === 'primary' ? 'bg-white text-blue-700 shadow-2xs font-semibold' : 'text-slate-600'}`}
            >
              Batting
            </button>
            <button
              onClick={() => setActiveTab('secondary')}
              className={`px-2.5 py-0.5 rounded-md transition cursor-pointer ${activeTab === 'secondary' ? 'bg-white text-blue-700 shadow-2xs font-semibold' : 'text-slate-600'}`}
            >
              {isWK ? 'Dismissals' : 'Bowling'}
            </button>
          </div>
        )}
      </div>

      {/* RENDER GRAPH BASED ON ROLE */}
      <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs space-y-3">
        {/* BATTER OR ALL-ROUNDER (BATTING TAB) */}
        {(isBatter || ((isAllRounder || isWK) && activeTab === 'primary')) && (
          <RunsByMatchChart data={history} />
        )}

        {/* BOWLER OR ALL-ROUNDER (BOWLING TAB) */}
        {(isBowler || (isAllRounder && activeTab === 'secondary')) && (
          <WicketsByMatchChart data={history} />
        )}

        {/* WICKETKEEPER DISMISSALS */}
        {isWK && activeTab === 'secondary' && (
          <WKDismissalsChart data={history} />
        )}
      </div>
    </div>
  );
}

// ── 1. RUNS BY MATCH LINE / POINT CHART ──────────────────────────────────
function RunsByMatchChart({ data }) {
  const [hoveredIdx, setHoveredIdx] = useState(null);

  const runsValues = data.map(m => m.batting?.runs || 0);
  const maxRuns = Math.max(...runsValues, 100);
  const yMax = Math.ceil(maxRuns / 20) * 20;

  const width = 360;
  const height = 130;
  const padLeft = 32;
  const padRight = 16;
  const padTop = 16;
  const padBottom = 26;

  const chartW = width - padLeft - padRight;
  const chartH = height - padTop - padBottom;

  const points = data.map((m, i) => {
    const x = padLeft + (i / Math.max(data.length - 1, 1)) * chartW;
    const y = padTop + chartH - ((m.batting?.runs || 0) / yMax) * chartH;
    return { x, y, runs: m.batting?.runs || 0, balls: m.batting?.balls || 0, opp: m.opponentShort || m.opponent, date: m.date, notOut: m.batting?.notOut };
  });

  const pathD = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');

  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-xs font-medium text-slate-500">
        <span className="text-slate-900 font-semibold">Runs Scored by Match</span>
        <span className="text-emerald-700 font-medium">
          High: {Math.max(...runsValues)} • Avg: {(runsValues.reduce((a, b) => a + b, 0) / runsValues.length).toFixed(1)}
        </span>
      </div>

      <div className="relative w-full overflow-hidden">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto overflow-visible select-none">
          {/* Horizontal Grid lines */}
          {[0, 0.5, 1].map((ratio, idx) => {
            const y = padTop + chartH * (1 - ratio);
            const val = Math.round(yMax * ratio);
            return (
              <g key={idx}>
                <line x1={padLeft} y1={y} x2={width - padRight} y2={y} stroke="#f1f5f9" strokeDasharray="3 3" strokeWidth="1" />
                <text x={padLeft - 6} y={y + 3} textAnchor="end" fontSize="9" fill="#94a3b8" fontWeight="500">
                  {val}
                </text>
              </g>
            );
          })}

          {/* Area Fill */}
          <path
            d={`${pathD} L ${points[points.length - 1].x} ${padTop + chartH} L ${points[0].x} ${padTop + chartH} Z`}
            fill="#2563eb"
            fillOpacity="0.06"
          />

          {/* Trend Line */}
          <path d={pathD} fill="none" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />

          {/* Data Points */}
          {points.map((p, i) => (
            <g key={i} onMouseEnter={() => setHoveredIdx(i)} onMouseLeave={() => setHoveredIdx(null)} className="cursor-pointer">
              <circle
                cx={p.x}
                cy={p.y}
                r={hoveredIdx === i ? 5 : 3.5}
                fill={p.notOut ? '#10b981' : '#2563eb'}
                stroke="#ffffff"
                strokeWidth="1.5"
                className="transition-all"
              />
              {/* X Axis Label */}
              <text x={p.x} y={height - 8} textAnchor="middle" fontSize="9" fill="#64748b" fontWeight="500">
                {p.opp}
              </text>
            </g>
          ))}
        </svg>

        {/* Hover Tooltip */}
        {hoveredIdx !== null && points[hoveredIdx] && (
          <div
            className="absolute top-1 bg-slate-900 text-white text-xs px-2.5 py-1 rounded-md shadow-lg pointer-events-none transform -translate-x-1/2 z-10"
            style={{ left: `${(points[hoveredIdx].x / width) * 100}%` }}
          >
            <div className="font-semibold">
              {points[hoveredIdx].runs} {points[hoveredIdx].notOut ? '(Not Out)' : ''} ({points[hoveredIdx].balls}b)
            </div>
            <div className="text-slate-400 text-xs">vs {points[hoveredIdx].opp} • {points[hoveredIdx].date}</div>
          </div>
        )}
      </div>
    </div>
  );
}

// ── 2. WICKETS BY MATCH BAR CHART ───────────────────────────────────────
function WicketsByMatchChart({ data }) {
  const [hoveredIdx, setHoveredIdx] = useState(null);

  const wicketsValues = data.map(m => m.bowling?.wickets || 0);
  const maxWkts = Math.max(...wicketsValues, 5);

  const width = 360;
  const height = 130;
  const padLeft = 30;
  const padRight = 16;
  const padTop = 16;
  const padBottom = 26;

  const chartW = width - padLeft - padRight;
  const chartH = height - padTop - padBottom;
  const barWidth = Math.min(22, (chartW / data.length) * 0.5);

  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-xs font-medium text-slate-500">
        <span className="text-slate-900 font-semibold">Wickets & Economy per Match</span>
        <span className="text-blue-700 font-medium">
          Total: {wicketsValues.reduce((a, b) => a + b, 0)} Wkts
        </span>
      </div>

      <div className="relative w-full overflow-hidden">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto overflow-visible select-none">
          {/* Grid lines */}
          {[0, 2, 4, Math.max(maxWkts, 5)].map((val, idx) => {
            const y = padTop + chartH - (val / Math.max(maxWkts, 5)) * chartH;
            return (
              <g key={idx}>
                <line x1={padLeft} y1={y} x2={width - padRight} y2={y} stroke="#f1f5f9" strokeDasharray="3 3" strokeWidth="1" />
                <text x={padLeft - 6} y={y + 3} textAnchor="end" fontSize="9" fill="#94a3b8" fontWeight="500">
                  {val}W
                </text>
              </g>
            );
          })}

          {/* Bars */}
          {data.map((m, i) => {
            const wkts = m.bowling?.wickets || 0;
            const x = padLeft + (i + 0.5) * (chartW / data.length) - barWidth / 2;
            const barH = (wkts / Math.max(maxWkts, 5)) * chartH;
            const y = padTop + chartH - barH;

            return (
              <g key={i} onMouseEnter={() => setHoveredIdx(i)} onMouseLeave={() => setHoveredIdx(null)} className="cursor-pointer">
                <rect
                  x={x}
                  y={y}
                  width={barWidth}
                  height={Math.max(barH, 3)}
                  rx="3"
                  fill={hoveredIdx === i ? '#047857' : '#059669'}
                  className="transition-all"
                />
                {wkts > 0 && (
                  <text x={x + barWidth / 2} y={y - 4} textAnchor="middle" fontSize="9" fill="#047857" fontWeight="600">
                    {wkts}
                  </text>
                )}
                {/* X Axis Label */}
                <text x={x + barWidth / 2} y={height - 8} textAnchor="middle" fontSize="9" fill="#64748b" fontWeight="500">
                  {m.opponentShort || m.opponent}
                </text>
              </g>
            );
          })}
        </svg>

        {hoveredIdx !== null && data[hoveredIdx] && (
          <div
            className="absolute top-1 bg-slate-900 text-white text-xs px-2.5 py-1 rounded-md shadow-lg pointer-events-none transform -translate-x-1/2 z-10"
            style={{ left: `${((padLeft + (hoveredIdx + 0.5) * (chartW / data.length)) / width) * 100}%` }}
          >
            <div className="font-semibold">
              {data[hoveredIdx].bowling?.wickets || 0}/{data[hoveredIdx].bowling?.runs || 0} ({data[hoveredIdx].bowling?.overs || '4.0'} ov)
            </div>
            <div className="text-slate-400 text-xs">Econ: {data[hoveredIdx].bowling?.economy || '-'} • vs {data[hoveredIdx].opponentShort}</div>
          </div>
        )}
      </div>
    </div>
  );
}

// ── 3. WICKETKEEPER DISMISSALS CHART ─────────────────────────────────────
function WKDismissalsChart({ data }) {
  return (
    <div className="space-y-2">
      <div className="text-xs font-semibold text-slate-900">
        Wicketkeeping Dismissals Log
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-100 text-center">
          <div className="text-sm font-semibold text-slate-900">
            {data.reduce((sum, m) => sum + (m.fielding?.catches || 0), 0)}
          </div>
          <div className="text-xs font-medium text-slate-500 mt-0.5">Catches</div>
        </div>
        <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-100 text-center">
          <div className="text-sm font-semibold text-slate-900">
            {data.reduce((sum, m) => sum + (m.fielding?.stumpings || 0), 0)}
          </div>
          <div className="text-xs font-medium text-slate-500 mt-0.5">Stumpings</div>
        </div>
        <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-100 text-center">
          <div className="text-sm font-semibold text-slate-900">
            {data.reduce((sum, m) => sum + (m.fielding?.runOuts || 0), 0)}
          </div>
          <div className="text-xs font-medium text-slate-500 mt-0.5">Run Outs</div>
        </div>
        <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-100 text-center">
          <div className="text-sm font-semibold text-emerald-700">0</div>
          <div className="text-xs font-medium text-slate-500 mt-0.5">Byes Conceded</div>
        </div>
      </div>
    </div>
  );
}
