import React, { useState } from 'react';
import { Radio, Users, ShieldCheck, ChevronRight, Share2, Award, Printer, ArrowLeft } from 'lucide-react';
import { useCricket } from '../../context/CricketContext';
import { PageHeader, TabBar } from '../ui/PageHeader';
import { MatchStatusBadge } from '../ui/Badge';

export default function ScorecardScreen() {
  const { scorecard, navigateTo, activeMatchId, matches, goBack } = useCricket();
  const [activeInningsTab, setActiveInningsTab] = useState('1st');

  const activeMatch = matches?.find((m) => m.id === activeMatchId);
  const teamAName = activeMatch?.home_team?.name || 'Home Team';
  const teamBName = activeMatch?.away_team?.name || 'Away Team';
  const tournamentName = activeMatch?.tournament || 'JDCA Senior District Trophy 2026';
  const venue = activeMatch?.venue || 'Wright Town Stadium, Jabalpur';

  // Innings tabs
  const inningsTabs = [
    { id: '1st', label: `${teamAName} (1st Inn)` },
    { id: '2nd', label: `${teamBName} (2nd Inn)` },
  ];

  return (
    <div className="fade-in-up" style={{ padding: '24px 20px 100px', maxWidth: 1000, margin: '0 auto' }}>
      
      {/* Top Header & Actions */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={goBack}
          className="flex items-center gap-1.5 text-xs font-bold text-[#2457D6] hover:underline cursor-pointer"
        >
          <ArrowLeft size={14} />
          <span>Back to Match</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={() => window.print()}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-xs font-bold text-slate-700 hover:bg-slate-50 cursor-pointer"
          >
            <Printer size={13} />
            <span className="hidden sm:inline">Print Card</span>
          </button>
          <button
            onClick={() => alert('Official JDCA Match Report copied to clipboard')}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#2457D6] text-white text-xs font-bold hover:bg-[#1b41a8] cursor-pointer"
          >
            <Share2 size={13} />
            <span>Share</span>
          </button>
        </div>
      </div>

      {/* Match Summary Header Card */}
      <div className="jdca-card p-5 mb-5">
        <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
          <span>{tournamentName}</span>
          <MatchStatusBadge status="LIVE" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-4 border-b border-slate-100">
          <div>
            <h2 className="text-xl font-bold text-slate-900">{teamAName}</h2>
            <div className="text-3xl font-extrabold text-[#2457D6] font-tabular mt-1">
              184<span className="text-xl font-bold text-slate-400">/4</span>
            </div>
            <div className="text-xs text-slate-500 mt-1 font-medium">
              Overs: <strong className="text-slate-900">18.2</strong> / 20.0 (CRR: 10.09)
            </div>
          </div>

          <div className="sm:text-right flex flex-col justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-800">{teamBName}</h2>
              <div className="text-xs text-slate-500 mt-1">Yet to bat (Target: 185)</div>
            </div>
            <div className="text-xs text-slate-400 mt-2">
              Venue: <strong className="text-slate-600">{venue}</strong>
            </div>
          </div>
        </div>

        {/* Player of Match Highlight */}
        <div className="mt-3 pt-1 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <span className="p-1 rounded bg-amber-50 text-[#ff6100] border border-amber-200">
              <Award size={15} />
            </span>
            <span className="text-slate-600 font-medium">
              Impact Player: <strong className="text-slate-900">Virat Sharma (74* off 42)</strong>
            </span>
          </div>
          <span className="text-xs font-bold text-[#0FA968]">JDCA Verified</span>
        </div>
      </div>

      {/* Innings Selector Tabs */}
      <div className="mb-4">
        <TabBar tabs={inningsTabs} active={activeInningsTab} onChange={setActiveInningsTab} />
      </div>

      {/* Batting Scorecard Table */}
      <div className="jdca-card overflow-hidden mb-5">
        <div className="p-3.5 bg-slate-50 border-b border-slate-200/80 flex items-center justify-between">
          <h3 className="font-extrabold text-slate-900 text-sm">Batting Scorecard</h3>
          <span className="text-xs text-slate-500 font-medium">{activeInningsTab === '1st' ? teamAName : teamBName}</span>
        </div>

        <div className="overflow-x-auto">
          <table className="jdca-table">
            <thead>
              <tr>
                <th style={{ minWidth: 180 }}>Batter</th>
                <th>Dismissal</th>
                <th style={{ textAlign: 'right' }}>R</th>
                <th style={{ textAlign: 'right' }}>B</th>
                <th style={{ textAlign: 'right' }}>4s</th>
                <th style={{ textAlign: 'right' }}>6s</th>
                <th style={{ textAlign: 'right' }}>SR</th>
              </tr>
            </thead>
            <tbody>
              {scorecard.batting.map((batter) => (
                <tr key={batter.id} className="hover:bg-slate-50/80">
                  <td>
                    <div className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                      <span>{batter.name}</span>
                      {batter.isCaptain && <span className="text-xs text-slate-400 font-normal">(c)</span>}
                      {batter.isStriker && <span className="w-2 h-2 rounded-full bg-[#0FA968]" title="Current Striker" />}
                    </div>
                  </td>
                  <td>
                    <span className="text-xs text-slate-500">
                      {batter.dismissal}
                    </span>
                  </td>
                  <td style={{ textAlign: 'right' }} className="font-tabular font-extrabold text-slate-900 text-sm">
                    {batter.runs}
                  </td>
                  <td style={{ textAlign: 'right' }} className="font-tabular text-slate-600 text-xs">
                    {batter.balls}
                  </td>
                  <td style={{ textAlign: 'right' }} className="font-tabular font-semibold text-slate-800 text-xs">
                    {batter.fours}
                  </td>
                  <td style={{ textAlign: 'right' }} className="font-tabular font-semibold text-slate-800 text-xs">
                    {batter.sixes}
                  </td>
                  <td style={{ textAlign: 'right' }} className="font-tabular font-bold text-[#2457D6] text-xs">
                    {batter.strikeRate}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Extras & Totals Row */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 text-xs flex items-center justify-between flex-wrap gap-2">
          <div>
            <span className="font-bold text-slate-800">Extras: </span>
            <span className="text-slate-600 font-medium">12 (wd 6, nb 2, b 2, lb 2)</span>
          </div>
          <div className="font-tabular font-extrabold text-sm text-slate-900">
            Total: 184/4 (18.2 Overs) � RR: 10.09
          </div>
        </div>
      </div>

      {/* Bowling Scorecard Table */}
      <div className="jdca-card overflow-hidden mb-5">
        <div className="p-3.5 bg-slate-50 border-b border-slate-200/80 flex items-center justify-between">
          <h3 className="font-extrabold text-slate-900 text-sm">Bowling Figures</h3>
          <span className="text-xs text-slate-500 font-medium">{activeInningsTab === '1st' ? teamBName : teamAName}</span>
        </div>

        <div className="overflow-x-auto">
          <table className="jdca-table">
            <thead>
              <tr>
                <th style={{ minWidth: 180 }}>Bowler</th>
                <th style={{ textAlign: 'right' }}>O</th>
                <th style={{ textAlign: 'right' }}>M</th>
                <th style={{ textAlign: 'right' }}>R</th>
                <th style={{ textAlign: 'right' }}>W</th>
                <th style={{ textAlign: 'right' }}>Econ</th>
                <th style={{ textAlign: 'right' }}>WD</th>
                <th style={{ textAlign: 'right' }}>NB</th>
              </tr>
            </thead>
            <tbody>
              {scorecard.bowling.map((bowler) => (
                <tr key={bowler.id} className="hover:bg-slate-50/80">
                  <td>
                    <div className="font-bold text-slate-900 text-sm">{bowler.name}</div>
                  </td>
                  <td style={{ textAlign: 'right' }} className="font-tabular text-slate-700 text-xs">
                    {bowler.overs}
                  </td>
                  <td style={{ textAlign: 'right' }} className="font-tabular text-slate-700 text-xs">
                    {bowler.maidens}
                  </td>
                  <td style={{ textAlign: 'right' }} className="font-tabular font-bold text-slate-900 text-sm">
                    {bowler.runs}
                  </td>
                  <td style={{ textAlign: 'right' }} className="font-tabular font-extrabold text-[#F05A47] text-sm">
                    {bowler.wickets}
                  </td>
                  <td style={{ textAlign: 'right' }} className="font-tabular font-bold text-[#2457D6] text-xs">
                    {bowler.economy}
                  </td>
                  <td style={{ textAlign: 'right' }} className="font-tabular text-slate-500 text-xs">
                    2
                  </td>
                  <td style={{ textAlign: 'right' }} className="font-tabular text-slate-500 text-xs">
                    1
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Fall of Wickets */}
      <div className="jdca-card p-4">
        <h3 className="font-extrabold text-slate-900 text-sm mb-2">Fall of Wickets</h3>
        <div className="text-xs text-slate-600 leading-relaxed font-tabular">
          <strong>1-28</strong> (A. Rawat, 3.2 ov), <strong>2-84</strong> (R. Yadav, 9.1 ov), <strong>3-142</strong> (S. Sen, 14.5 ov), <strong>4-168</strong> (A. Patel, 17.2 ov)
        </div>
      </div>

    </div>
  );
}
