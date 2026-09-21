import React, { useState } from 'react';
import { 
  ArrowLeft, Star, MapPin, Award, Activity, TrendingUp, Sliders, Calendar, ShieldCheck, CheckCircle2, Trash2
} from 'lucide-react';
import { useCricket } from '../../context/CricketContext';

const ProfileTabs = ({ tabs, active, onChange }) => (
  <div className="flex bg-slate-100 p-1 rounded-xl mb-4 max-w-xl mx-auto">
    {tabs.map(tab => (
      <button
        key={tab.id}
        onClick={() => onChange(tab.id)}
        className={`flex-1 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
          active === tab.id ? 'bg-white text-slate-900 shadow-2xs font-semibold' : 'text-slate-500 hover:text-slate-900'
        }`}
      >
        {tab.label}
      </button>
    ))}
  </div>
);

export default function PlayerProfileScreen() {
  const { selectedPlayer, goBack, shortlistedIds, toggleShortlist, userRole } = useCricket();
  const [activeTab, setActiveTab] = useState('Overview');
  const [isDeleting, setIsDeleting] = useState(false);

  const player = selectedPlayer || {
    id: 'rohan-sharma',
    name: 'Rohan Sharma',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
    team: 'Jabalpur Kings XI',
    role: 'Batter',
    battingStyle: 'Right-Hand Batter',
    bowlingStyle: 'Right-Arm Off Break',
    category: 'Senior',
    district: 'Jabalpur',
    careerRuns: 4258,
    battingAvg: 42.5,
    strikeRate: 145.2,
    matches: 112,
    fifties: 28,
    hundreds: 6,
    fours: 412,
    sixes: 85,
    wickets: 0,
    awards: ['Best Batter 2023-24', 'POTM - District Final'],
  };

  const isShortlisted = shortlistedIds?.includes(player.id);

  const tabs = [
    { id: 'Overview', label: 'Stats' },
    { id: 'Batting', label: 'Batting' },
    { id: 'Bowling', label: 'Bowling' },
    { id: 'Selection', label: 'History' },
  ];

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this player? They will be moved to the Recycle Bin.")) return;
    setIsDeleting(true);
    try {
      const { api } = await import('../../lib/api');
      await api.deletePlayer(player.id);
      alert('Player deleted successfully.');
      goBack();
    } catch (err) {
      console.error(err);
      alert('Failed to delete player.');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="pb-20 bg-[#f8fafc] min-h-screen">
      {/* Header Area */}
      <div className="bg-white border-b border-slate-200 pt-14 sm:pt-6 pb-6 px-4 relative shadow-2xs">
        <div className="max-w-4xl mx-auto relative">
          <button
            onClick={goBack}
            className="absolute top-0 left-0 w-9 h-9 flex items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition cursor-pointer"
            aria-label="Go Back"
          >
            <ArrowLeft size={18} />
          </button>

          <button
            onClick={() => toggleShortlist(player.id)}
            className={`absolute top-0 right-0 w-9 h-9 flex items-center justify-center rounded-lg border transition cursor-pointer ${
              isShortlisted
                ? 'bg-amber-50 border-amber-200 text-amber-600'
                : 'bg-white border-slate-200 text-slate-400 hover:text-slate-600'
            }`}
            aria-label="Toggle Shortlist"
          >
            <Star size={18} fill={isShortlisted ? '#d97706' : 'none'} />
          </button>

          {userRole === 'SUPER_ADMIN' && (
            <button
              onClick={handleDelete}
              disabled={isDeleting}
              className="absolute top-0 right-11 w-9 h-9 flex items-center justify-center rounded-lg border bg-white border-rose-200 text-rose-500 hover:text-rose-700 hover:bg-rose-50 transition cursor-pointer disabled:opacity-50"
              title="Delete Player"
            >
              <Trash2 size={16} />
            </button>
          )}

          <div className="flex flex-col items-center mt-2 text-center">
            <img
              src={player.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80'}
              alt={player.name}
              className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover border-2 border-white shadow-sm mb-3"
            />
            <h1 className="text-xl sm:text-2xl font-semibold text-slate-900 leading-tight mb-1">
              {player.name}
            </h1>
            <div className="text-xs text-slate-500 flex items-center justify-center gap-1.5 mb-3">
              <span className="font-medium text-slate-700">{player.role}</span>
              <span>•</span>
              <MapPin size={12} className="text-blue-600" />
              <span>{player.district}</span>
              <span>•</span>
              <span>{player.team || 'District XI'}</span>
            </div>

            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-md bg-blue-50 text-blue-700 text-xs font-medium border border-blue-100">
                {player.category || 'Senior'}
              </span>
              <span className="px-2.5 py-0.5 rounded-md bg-emerald-50 text-emerald-700 text-xs font-medium border border-emerald-100 flex items-center gap-1">
                <ShieldCheck size={12} /> Registered
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 pt-5">
        <ProfileTabs tabs={tabs} active={activeTab} onChange={setActiveTab} />

        {/* Content Area */}
        <div className="space-y-4">
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'Overview' && (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-2xs">
                  <div className="text-xs font-medium text-slate-400">Career Runs</div>
                  <div className="text-xl sm:text-2xl font-semibold text-blue-700 mt-1">
                    {player.careerRuns || player.runs || 0}
                  </div>
                </div>
                <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-2xs">
                  <div className="text-xs font-medium text-slate-400">Batting Average</div>
                  <div className="text-xl sm:text-2xl font-semibold text-slate-900 mt-1">
                    {player.battingAvg ? player.battingAvg.toFixed(1) : '-'}
                  </div>
                </div>
                <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-2xs">
                  <div className="text-xs font-medium text-slate-400">Strike Rate</div>
                  <div className="text-xl sm:text-2xl font-semibold text-slate-900 mt-1">
                    {player.strikeRate || '-'}
                  </div>
                </div>
                <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-2xs">
                  <div className="text-xs font-medium text-slate-400">Wickets</div>
                  <div className="text-xl sm:text-2xl font-semibold text-slate-900 mt-1">
                    {player.wickets ?? (player.role === 'Bowler' ? 14 : 0)}
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-2xs space-y-3">
                <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                  <Award size={16} className="text-amber-500" />
                  <h3 className="font-semibold text-sm text-slate-900">Distinctions & Honors</h3>
                </div>
                <ul className="space-y-2 text-xs">
                  {(player.awards || ['Best District Batter 2024', 'POTM - District Final']).map((award, i) => (
                    <li key={i} className="flex items-center gap-2 text-slate-700">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" />
                      <span>{award}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </>
          )}

          {/* TAB 2: BATTING */}
          {activeTab === 'Batting' && (
            <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
              <div className="p-4 border-b border-slate-100 bg-slate-50/60 flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-sm text-slate-900">Batting Profile</h3>
                  <p className="text-xs text-slate-500">{player.battingStyle || 'Right-Hand Bat'}</p>
                </div>
              </div>
              <div className="p-4 grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div>
                  <div className="text-xs font-medium text-slate-400">Matches</div>
                  <div className="text-lg font-semibold text-slate-900 mt-0.5">{player.matches || 24}</div>
                </div>
                <div>
                  <div className="text-xs font-medium text-slate-400">Highest Score</div>
                  <div className="text-lg font-semibold text-slate-900 mt-0.5">{player.highScore || '118*'}</div>
                </div>
                <div>
                  <div className="text-xs font-medium text-slate-400">50s / 100s</div>
                  <div className="text-lg font-semibold text-slate-900 mt-0.5">{player.fifties || 0} / {player.hundreds || 0}</div>
                </div>
                <div>
                  <div className="text-xs font-medium text-slate-400">4s / 6s</div>
                  <div className="text-lg font-semibold text-slate-900 mt-0.5">{player.fours || 0} / {player.sixes || 0}</div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: BOWLING */}
          {activeTab === 'Bowling' && (
            <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
              <div className="p-4 border-b border-slate-100 bg-slate-50/60 flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-sm text-slate-900">Bowling Profile</h3>
                  <p className="text-xs text-slate-500">{player.bowlingStyle || 'Right-Arm Medium'}</p>
                </div>
              </div>
              <div className="p-4 grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div>
                  <div className="text-xs font-medium text-slate-400">Wickets</div>
                  <div className="text-lg font-semibold text-slate-900 mt-0.5">{player.wickets || (player.role === 'Bowler' ? 14 : 0)}</div>
                </div>
                <div>
                  <div className="text-xs font-medium text-slate-400">Economy</div>
                  <div className="text-lg font-semibold text-slate-900 mt-0.5">{player.economy || (player.role === 'Bowler' ? '6.4' : '-')}</div>
                </div>
                <div>
                  <div className="text-xs font-medium text-slate-400">Best Figures</div>
                  <div className="text-lg font-semibold text-slate-900 mt-0.5">{player.bestBowling || (player.role === 'Bowler' ? '4/18' : '-')}</div>
                </div>
                <div>
                  <div className="text-xs font-medium text-slate-400">Average</div>
                  <div className="text-lg font-semibold text-slate-900 mt-0.5">{player.average ? player.average.toFixed(1) : '-'}</div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: SELECTION */}
          {activeTab === 'Selection' && (
            <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
              <div className="p-4 border-b border-slate-100 bg-slate-50/60">
                <h3 className="font-semibold text-sm text-slate-900">Official Selection History</h3>
              </div>
              
              <div className="divide-y divide-slate-100">
                <div className="p-4 flex items-center justify-between">
                  <div>
                    <div className="text-sm font-semibold text-slate-900">Senior District Trophy</div>
                    <div className="text-xs text-slate-500 mt-0.5">2026 • {player.district} District XI</div>
                  </div>
                  <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 text-xs font-medium rounded border border-emerald-100 flex items-center gap-1">
                    <CheckCircle2 size={12} /> Selected
                  </span>
                </div>
                <div className="p-4 flex items-center justify-between">
                  <div>
                    <div className="text-sm font-semibold text-slate-900">MPCA Inter-District Championship</div>
                    <div className="text-xs text-slate-500 mt-0.5">2025 • Jabalpur Division</div>
                  </div>
                  <span className="px-2 py-0.5 bg-slate-100 text-slate-600 text-xs font-medium rounded">
                    Participated
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
