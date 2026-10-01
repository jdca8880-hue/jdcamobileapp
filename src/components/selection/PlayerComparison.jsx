import React from 'react';
import { X, CheckCircle2 } from 'lucide-react';

export default function PlayerComparison({ players, onClose }) {
  if (!players || players.length === 0) return null;

  return (
    <div className="bg-white border border-slate-200 rounded-lg shadow-sm font-sans overflow-x-auto">
      <div className="flex items-center justify-between p-4 border-b border-slate-200 bg-slate-50">
        <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Player Comparison</h3>
        <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
          <X className="w-5 h-5" />
        </button>
      </div>
      
      <table className="w-full text-sm text-left">
        <thead>
          <tr className="bg-slate-50 border-b border-slate-200">
            <th className="p-3 font-semibold text-slate-500 uppercase text-xs w-48">Metric</th>
            {players.map(p => (
              <th key={p.id} className="p-3 font-bold text-slate-900 border-l border-slate-100 min-w-[150px]">
                {p.full_name}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          <tr>
            <td className="p-3 font-medium text-slate-600">Role & District</td>
            {players.map(p => (
              <td key={p.id} className="p-3 border-l border-slate-100">
                <div className="font-semibold">{p.primary_role}</div>
                <div className="text-xs text-slate-500">{p.district}</div>
              </td>
            ))}
          </tr>
          <tr>
            <td className="p-3 font-medium text-slate-600">Batting Average</td>
            {players.map(p => (
              <td key={p.id} className="p-3 border-l border-slate-100 font-mono text-slate-800">{p.battingAvg}</td>
            ))}
          </tr>
          <tr>
            <td className="p-3 font-medium text-slate-600">Strike Rate</td>
            {players.map(p => (
              <td key={p.id} className="p-3 border-l border-slate-100 font-mono text-slate-800">{p.strikeRate}</td>
            ))}
          </tr>
          <tr>
            <td className="p-3 font-medium text-slate-600">Bowling Economy</td>
            {players.map(p => (
              <td key={p.id} className="p-3 border-l border-slate-100 font-mono text-slate-800">{p.economy}</td>
            ))}
          </tr>
          <tr>
            <td className="p-3 font-medium text-slate-600">Recent Form</td>
            {players.map(p => (
              <td key={p.id} className="p-3 border-l border-slate-100 font-mono text-xs text-slate-600">{p.recentFormString || '-'}</td>
            ))}
          </tr>
        </tbody>
      </table>
    </div>
  );
}
