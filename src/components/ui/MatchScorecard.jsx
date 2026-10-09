import React, { useState } from 'react';

// Modern Batting Table
function BattingTable({ team, players = [] }) {
  return (
    <div className="mb-6">
      <div className="flex items-center justify-between p-3 bg-[#101827] dark:bg-[#14171A] text-white rounded-t-xl border-b border-transparent dark:border-white/10">
        <h4 className="font-bold text-[14px] text-white">{team} Batting</h4>
        <div className="font-black text-[16px] text-[#A3E635]">{players.reduce((s,p)=>s+(Number(p.runs)||0),0) || '—'}</div>
      </div>
      <div className="border border-gray-200 dark:border-white/10 border-t-0 rounded-b-xl overflow-hidden">
        <div className="flex bg-[#f0f2f4] dark:bg-[#181A1D] text-[#596579] dark:text-[#94A3B8] text-xs font-bold uppercase tracking-wider p-2 border-b border-gray-200 dark:border-white/10">
          <div className="flex-[3]">Batter</div>
          <div className="flex-1 text-center">R</div>
          <div className="flex-1 text-center">B</div>
          <div className="flex-1 text-center">4s</div>
          <div className="flex-1 text-center">6s</div>
          <div className="flex-1 text-right">SR</div>
        </div>
        <div className="divide-y divide-gray-100 dark:divide-white/5 bg-white dark:bg-[#0A0A0A]">
          {(players.length ? players : [{name:'No data recorded yet'}]).map((p,i) => (
            <div key={p.id || i} className="flex items-center p-2 text-[12px] hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
              <div className="flex-[3]">
                <div className="font-bold text-[#101827] dark:text-[#F3F4F6]">{p.name}</div>
                <div className="text-xs text-[#8a99b0] dark:text-slate-400 leading-tight">{p.dismissal || (p.notOut ? 'not out' : '')}</div>
              </div>
              <div className="flex-1 text-center font-black text-[#101827] dark:text-[#F3F4F6]">{p.runs ?? '—'}</div>
              <div className="flex-1 text-center font-medium text-[#596579] dark:text-[#CBD5E1]">{p.balls ?? '—'}</div>
              <div className="flex-1 text-center font-medium text-[#596579] dark:text-[#CBD5E1]">{p.fours ?? '—'}</div>
              <div className="flex-1 text-center font-medium text-[#596579] dark:text-[#CBD5E1]">{p.sixes ?? '—'}</div>
              <div className="flex-1 text-right font-medium text-[#8a99b0] dark:text-[#A3E635]">{p.strikeRate ?? '—'}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Modern Bowling Table
function BowlingTable({ team, bowlers = [] }) {
  return (
    <div className="mb-6">
      <div className="flex items-center justify-between p-3 bg-[#101827] dark:bg-[#14171A] text-white rounded-t-xl border-b border-transparent dark:border-white/10">
        <h4 className="font-bold text-[14px] text-white">{team} Bowling</h4>
      </div>
      <div className="border border-gray-200 dark:border-white/10 border-t-0 rounded-b-xl overflow-hidden">
        <div className="flex bg-[#f0f2f4] dark:bg-[#181A1D] text-[#596579] dark:text-[#94A3B8] text-xs font-bold uppercase tracking-wider p-2 border-b border-gray-200 dark:border-white/10">
          <div className="flex-[3]">Bowler</div>
          <div className="flex-1 text-center">O</div>
          <div className="flex-1 text-center">M</div>
          <div className="flex-1 text-center">R</div>
          <div className="flex-1 text-center">W</div>
          <div className="flex-1 text-right">Econ</div>
        </div>
        <div className="divide-y divide-gray-100 dark:divide-white/5 bg-white dark:bg-[#0A0A0A]">
          {(bowlers.length ? bowlers : [{name:'No data recorded yet'}]).map((p,i) => (
            <div key={p.id || i} className="flex items-center p-2 text-[12px] hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
              <div className="flex-[3] font-bold text-[#101827] dark:text-[#F3F4F6]">{p.name}</div>
              <div className="flex-1 text-center font-medium text-[#596579] dark:text-[#CBD5E1]">{p.overs ?? '—'}</div>
              <div className="flex-1 text-center font-medium text-[#596579] dark:text-[#CBD5E1]">{p.maidens ?? '—'}</div>
              <div className="flex-1 text-center font-medium text-[#596579] dark:text-[#CBD5E1]">{p.runs ?? '—'}</div>
              <div className="flex-1 text-center font-black text-[#EF4444]">{p.wickets ?? '—'}</div>
              <div className="flex-1 text-right font-medium text-[#8a99b0] dark:text-[#A3E635]">{p.economy ?? '—'}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function MatchScorecard({ match = {} }) {
  const scorecard = match?.scorecard || {};
  const [inningsTab, setInningsTab] = useState(1);

  return (
    <div>
      <div className="flex bg-gray-100 dark:bg-[#181A1D] p-1 rounded-xl mb-4 border border-transparent dark:border-white/10">
        <button
          onClick={() => setInningsTab(1)}
          className={`flex-1 py-2 rounded-lg text-[13px] font-bold transition-all ${
            inningsTab === 1 
              ? 'bg-white dark:bg-[#262B30] text-[#101827] dark:text-[#A3E635] shadow-sm' 
              : 'text-[#8a99b0] dark:text-slate-400 hover:text-slate-700 dark:hover:text-[#F3F4F6]'
          }`}
        >
          1st Innings: {match?.home_team?.name || 'Unknown Team'}
        </button>
        <button
          onClick={() => setInningsTab(2)}
          className={`flex-1 py-2 rounded-lg text-[13px] font-bold transition-all ${
            inningsTab === 2 
              ? 'bg-white dark:bg-[#262B30] text-[#101827] dark:text-[#A3E635] shadow-sm' 
              : 'text-[#8a99b0] dark:text-slate-400 hover:text-slate-700 dark:hover:text-[#F3F4F6]'
          }`}
        >
          2nd Innings: {match?.away_team?.name || 'Unknown Team'}
        </button>
      </div>

      {inningsTab === 1 && (
        <>
          <BattingTable team={match?.home_team?.name || 'Unknown Team'} players={scorecard?.home_team?.batting} />
          <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-[#14171A] border border-gray-200 dark:border-white/10 rounded-xl mb-6 text-[13px]">
            <span className="font-bold text-[#596579] dark:text-slate-400">Extras</span>
            <span className="font-black text-[#101827] dark:text-[#F3F4F6]">{scorecard?.home_team?.extras ?? match?.home_team?.extras ?? '0'}</span>
          </div>
          <BowlingTable team={match?.away_team?.name || 'Unknown Team'} bowlers={scorecard?.away_team?.bowling || scorecard?.bowlingA} />
        </>
      )}

      {inningsTab === 2 && (
        <>
          <BattingTable team={match?.away_team?.name || 'Unknown Team'} players={scorecard?.away_team?.batting} />
          <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-[#14171A] border border-gray-200 dark:border-white/10 rounded-xl mb-6 text-[13px]">
            <span className="font-bold text-[#596579] dark:text-slate-400">Extras</span>
            <span className="font-black text-[#101827] dark:text-[#F3F4F6]">{scorecard?.away_team?.extras ?? match?.away_team?.extras ?? '0'}</span>
          </div>
          <BowlingTable team={match?.home_team?.name || 'Unknown Team'} bowlers={scorecard?.home_team?.bowling || scorecard?.bowlingB} />
        </>
      )}

      <div className="p-4 bg-gray-50 dark:bg-[#14171A] border border-gray-200 dark:border-white/10 rounded-xl text-[12px]">
        <div className="font-bold uppercase tracking-wider text-[#8a99b0] dark:text-slate-400 mb-1">Fall of Wickets</div>
        <div className="font-medium text-[#101827] dark:text-[#F3F4F6]">{scorecard?.fallOfWickets || match?.fallOfWickets || 'Data recorded automatically'}</div>
      </div>
    </div>
  );
}
