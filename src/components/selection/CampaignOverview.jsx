import React from 'react';
import { useCricket } from '../../context/CricketContext';

export default function CampaignOverview({ campaign, onNavigate }) {
  const { players, shortlistedIds } = useCricket();

  // Filter players for this campaign's category (mocking for now)
  const pool = players.filter(p => p.category === campaign.ageGroup);
  const selectedCount = shortlistedIds.length;
  const observedCount = 0;
  const evaluatedCount = 0;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{campaign.name}</h1>
            <p className="text-sm text-gray-500 mt-1">Status: <span className="font-semibold text-cobalt">{campaign.status.replace('_', ' ')}</span></p>
          </div>
          <div className="bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-200 text-xs font-semibold text-gray-600">
            {campaign.season} Season
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 mt-8">
          <StatBox value={pool.length} label="Candidates" />
          <StatBox value={observedCount} label="Observed" />
          <StatBox value={evaluatedCount} label="Evaluated" />
          <StatBox value={selectedCount} label="Shortlisted" />
          <StatBox value="0" label="Selected" highlight={true} />
        </div>

        <div className="mt-10 flex flex-wrap gap-3">
          <button 
            onClick={() => onNavigate('pool')}
            className="px-6 py-3 bg-cobalt hover:bg-cobalt-700 text-white rounded-xl font-semibold shadow-sm transition"
          >
            Continue Selection
          </button>
          <button 
            onClick={() => onNavigate('shortlist')}
            className="px-6 py-3 bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 rounded-xl font-semibold transition"
          >
            View Shortlist
          </button>
          <button 
            onClick={() => onNavigate('squad')}
            className="px-6 py-3 bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 rounded-xl font-semibold transition"
          >
            Final Team
          </button>
        </div>
      </div>
    </div>
  );
}

function StatBox({ value, label, highlight }) {
  return (
    <div className={`p-4 rounded-xl border ${highlight ? 'border-emerald-200 bg-emerald-50' : 'border-gray-100 bg-gray-50'}`}>
      <div className={`text-2xl font-bold ${highlight ? 'text-emerald-700' : 'text-gray-900'}`}>{value}</div>
      <div className="text-xs font-semibold text-gray-500 mt-1">{label}</div>
    </div>
  );
}
