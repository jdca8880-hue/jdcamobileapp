import React, { useState } from 'react';
import { useCricket } from '../../context/CricketContext';

export default function InningsInitScreen({ battingXI, bowlingXI }) {
  const { replaceStriker, replaceBatter, replaceBowler, startInnings } = useCricket();
  
  const [selectedStriker, setSelectedStriker] = useState('');
  const [selectedNonStriker, setSelectedNonStriker] = useState('');
  const [selectedBowler, setSelectedBowler] = useState('');

  const handleStartInnings = () => {
    if (!selectedStriker || !selectedNonStriker || !selectedBowler) {
      alert('Please select a Striker, Non-Striker, and Opening Bowler.');
      return;
    }
    
    if (selectedStriker === selectedNonStriker) {
      alert('Striker and Non-Striker cannot be the same player.');
      return;
    }

    const s = battingXI.find(p => p.id === selectedStriker);
    const ns = battingXI.find(p => p.id === selectedNonStriker);
    const b = bowlingXI.find(p => p.id === selectedBowler);

    if (s && ns && b) {
      if (window.confirm("You are starting the scoring. Are you sure to start?")) {
        replaceStriker({ ...s, runs: 0, balls: 0, fours: 0, sixes: 0, strikeRate: '0.0' });
        replaceBatter(false, { ...ns, runs: 0, balls: 0, fours: 0, sixes: 0, strikeRate: '0.0' });
        replaceBowler(b);
        startInnings();
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6 flex flex-col justify-center max-w-md mx-auto">
      <h2 className="text-2xl font-black text-[#101827] mb-6">Innings Initialization</h2>
      
      <div className="space-y-4">
        <div>
          <label className="block text-xs font-bold text-[#8a99b0] uppercase mb-2">Select Striker</label>
          <select 
            value={selectedStriker} 
            onChange={(e) => setSelectedStriker(e.target.value)}
            className="w-full p-4 rounded-xl border border-gray-200 bg-white"
          >
            <option value="">-- Choose Player --</option>
            {battingXI.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold text-[#8a99b0] uppercase mb-2">Select Non-Striker</label>
          <select 
            value={selectedNonStriker} 
            onChange={(e) => setSelectedNonStriker(e.target.value)}
            className="w-full p-4 rounded-xl border border-gray-200 bg-white"
          >
            <option value="">-- Choose Player --</option>
            {battingXI.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold text-[#8a99b0] uppercase mb-2">Select Opening Bowler</label>
          <select 
            value={selectedBowler} 
            onChange={(e) => setSelectedBowler(e.target.value)}
            className="w-full p-4 rounded-xl border border-gray-200 bg-white"
          >
            <option value="">-- Choose Bowler --</option>
            {bowlingXI.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
        </div>
      </div>

      <button 
        onClick={handleStartInnings}
        className="w-full mt-8 py-4 bg-[#0FA968] text-white font-bold text-[16px] rounded-xl"
      >
        START SCORING
      </button>
    </div>
  );
}
