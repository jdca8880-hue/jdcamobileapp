import React, { useState } from 'react';

// Modern Batting Table
function BattingTable({ team, players = [] }) {
  return (
    <div className="mb-6">
      <div className="flex items-center justify-between p-3 bg-[#101827] text-white rounded-t-xl">
        <h4 className="font-bold text-[14px]">{team} Batting</h4>
        <div className="font-black text-[16px]">{players.reduce((s,p)=>s+(Number(p.runs)||0),0) || '�'}</div>
      </div>
      <div className="border border-gray-200 border-t-0 rounded-b-xl overflow-hidden">
        <div className="flex bg-[#f0f2f4] text-[#596579] text-xs font-bold uppercase tracking-wider p-2 border-b border-gray-200">
          <div className="flex-[3]">Batter</div>
          <div className="flex-1 text-center">R</div>
          <div className="flex-1 text-center">B</div>
          <div className="flex-1 text-center">4s</div>
          <div className="flex-1 text-center">6s</div>
          <div className="flex-1 text-right">SR</div>
        </div>
        <div className="divide-y divide-gray-100 bg-white">
          {(players.length ? players : [{name:'No data recorded yet'}]).map((p,i) => (
            <div key={p.id || i} className="flex items-center p-2 text-[12px]">
              <div className="flex-[3]">
                <div className="font-bold text-[#101827]">{p.name}</div>
                <div className="text-xs text-[#8a99b0] leading-tight">{p.dismissal || (p.notOut ? 'not out' : '')}</div>
              </div>
              <div className="flex-1 text-center font-black text-[#101827]">{p.runs ?? '�'}</div>
              <div className="flex-1 text-center font-medium text-[#596579]">{p.balls ?? '�'}</div>
              <div className="flex-1 text-center font-medium text-[#596579]">{p.fours ?? '�'}</div>
              <div className="flex-1 text-center font-medium text-[#596579]">{p.sixes ?? '�'}</div>
              <div className="flex-1 text-right font-medium text-[#8a99b0]">{p.strikeRate ?? '�'}</div>
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
      <div className="flex items-center justify-between p-3 bg-[#101827] text-white rounded-t-xl">
        <h4 className="font-bold text-[14px]">{team} Bowling</h4>
      </div>
      <div className="border border-gray-200 border-t-0 rounded-b-xl overflow-hidden">
        <div className="flex bg-[#f0f2f4] text-[#596579] text-xs font-bold uppercase tracking-wider p-2 border-b border-gray-200">
          <div className="flex-[3]">Bowler</div>
          <div className="flex-1 text-center">O</div>
          <div className="flex-1 text-center">M</div>
          <div className="flex-1 text-center">R</div>
          <div className="flex-1 text-center">W</div>
          <div className="flex-1 text-right">Econ</div>
        </div>
        <div className="divide-y divide-gray-100 bg-white">
          {(bowlers.length ? bowlers : [{name:'No data recorded yet'}]).map((p,i) => (
            <div key={p.id || i} className="flex items-center p-2 text-[12px]">
              <div className="flex-[3] font-bold text-[#101827]">{p.name}</div>
              <div className="flex-1 text-center font-medium text-[#596579]">{p.overs ?? '�'}</div>
              <div className="flex-1 text-center font-medium text-[#596579]">{p.maidens ?? '�'}</div>
              <div className="flex-1 text-center font-medium text-[#596579]">{p.runs ?? '�'}</div>
              <div className="flex-1 text-center font-black text-[#F05A47]">{p.wickets ?? '�'}</div>
              <div className="flex-1 text-right font-medium text-[#8a99b0]">{p.economy ?? '�'}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function MatchScorecard({ match }) {
  const scorecard = match.scorecard || {};
  const [inningsTab, setInningsTab] = useState(1);

  return (
    <div>
      <div className="flex bg-gray-100 p-1 rounded-xl mb-4">
        <button
          onClick={() => setInningsTab(1)}
          className={`flex-1 py-2 rounded-lg text-[13px] font-bold transition-all ${inningsTab === 1 ? 'bg-white text-[#101827] shadow-sm' : 'text-[#8a99b0]'}`}
        >
          1st Innings: {match.teamA?.name || 'TBA'}
        </button>
        <button
          onClick={() => setInningsTab(2)}
          className={`flex-1 py-2 rounded-lg text-[13px] font-bold transition-all ${inningsTab === 2 ? 'bg-white text-[#101827] shadow-sm' : 'text-[#8a99b0]'}`}
        >
          2nd Innings: {match.teamB?.name || 'TBA'}
        </button>
      </div>

      {inningsTab === 1 && (
        <>
          <BattingTable team={match.teamA?.name || 'TBA'} players={scorecard.teamA?.batting} />
          <div className="flex items-center justify-between p-3 bg-gray-50 border border-gray-200 rounded-xl mb-6 text-[13px]">
            <span className="font-bold text-[#596579]">Extras</span>
            <span className="font-black text-[#101827]">{scorecard.teamA?.extras ?? match.teamA?.extras ?? '�'}</span>
          </div>
          <BowlingTable team={match.teamB?.name || 'TBA'} bowlers={scorecard.teamB?.bowling || scorecard.bowlingA} />
        </>
      )}

      {inningsTab === 2 && (
        <>
          <BattingTable team={match.teamB?.name || 'TBA'} players={scorecard.teamB?.batting} />
          <div className="flex items-center justify-between p-3 bg-gray-50 border border-gray-200 rounded-xl mb-6 text-[13px]">
            <span className="font-bold text-[#596579]">Extras</span>
            <span className="font-black text-[#101827]">{scorecard.teamB?.extras ?? match.teamB?.extras ?? '�'}</span>
          </div>
          <BowlingTable team={match.teamA?.name || 'TBA'} bowlers={scorecard.teamA?.bowling || scorecard.bowlingB} />
        </>
      )}

      <div className="p-4 bg-gray-50 border border-gray-200 rounded-xl text-[12px]">
        <div className="font-bold uppercase tracking-wider text-[#8a99b0] mb-1">Fall of Wickets</div>
        <div className="font-medium text-[#101827]">{scorecard.fallOfWickets || match.fallOfWickets || 'Data recorded automatically'}</div>
      </div>
    </div>
  );
}
