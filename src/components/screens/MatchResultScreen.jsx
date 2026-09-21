import React, { useMemo, useEffect, useState } from 'react';
import { Trophy, ArrowRight, Newspaper, ShieldCheck } from 'lucide-react';
import { useCricket } from '../../context/CricketContext';
import { api } from '../../lib/api';
import MatchScorecard from '../ui/MatchScorecard';
import MatchMediaReport from '../ui/MatchMediaReport';
import { calculateMatchHighlights } from '../../engine/matchSummaryEngine';

export default function MatchResultScreen() {
  const { matches = [], activeMatchId, navigateTo } = useCricket();
  const [matchData, setMatchData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchReport() {
      try {
        const targetId = activeMatchId || matches.find(m => ['COMPLETED','FINISHED'].includes(m.status))?.id || matches[0]?.id;
        if (!targetId) {
          setLoading(false);
          return;
        }
        const data = await api.getMatchScorecard(targetId);
        setMatchData(data);
      } catch (err) {
        console.error("Failed to load match scorecard", err);
      } finally {
        setLoading(false);
      }
    }
    fetchReport();
  }, [activeMatchId, matches]);

  const highlights = useMemo(() => calculateMatchHighlights(matchData || {}), [matchData]);

  if (loading) {
    return <div className="flex items-center justify-center h-screen bg-slate-50">
      <div className="w-8 h-8 border-4 border-cobalt border-t-transparent rounded-full animate-spin"></div>
    </div>;
  }

  if (!matchData) return null;

  return <div className="match-result-page matches-directory-page">
    <div className="result-hero-light">
      <div><span className="result-hero-light__kicker"><Trophy size={14}/> OFFICIAL MATCH RESULT</span><h1>{matchData.resultText || matchData.result || 'Match completed'}</h1><p>{matchData.tournament || 'JDCA Fixture'} • {matchData.venue || 'JDCA Ground'} • {matchData.date || 'Match Day'}</p></div>
      <div className="result-hero-light__scores"><span>{matchData.teamA?.name}</span><strong>{matchData.teamA?.score || '-'}</strong><small>{matchData.teamA?.overs || ''}</small><i>VS</i><span>{matchData.teamB?.name}</span><strong>{matchData.teamB?.score || '-'}</strong><small>{matchData.teamB?.overs || ''}</small></div>
    </div>

    <div className="result-section"><div className="section-kicker"><Trophy size={15}/> COMPLETE SCORECARD</div><MatchScorecard match={matchData}/></div>

    <div className="result-section"><div className="section-kicker"><ShieldCheck size={15}/> MATCH HIGHLIGHTS</div><div className="result-highlight-row">
      <div><small>TOP BATTER</small><b>{highlights.topBatter?.name || '-'}</b><span>{highlights.topBatter?.stat || 'Derived from scorecard'}</span></div>
      <div><small>TOP BOWLER</small><b>{highlights.topBowler?.name || '-'}</b><span>{highlights.topBowler?.stat || 'Derived from scorecard'}</span></div>
      <div><small>BEST PARTNERSHIP</small><b>{highlights.bestPartnership?.names || '-'}</b><span>{highlights.bestPartnership?.stat || 'Derived from scorecard'}</span></div>
      <div><small>PLAYER OF THE MATCH</small><b>{highlights.playerOfMatch?.name || 'Official selection'}</b><span>{highlights.playerOfMatch?.batting || highlights.playerOfMatch?.bowling || 'Official award'}</span></div>
      <div><small>RESULT</small><b>{matchData.resultText || matchData.result || 'Match completed'}</b><span>Official Final Status</span></div>
    </div></div>
    <div className="result-section"><div className="section-kicker"><Newspaper size={15}/> MEDIA REPORT</div><MatchMediaReport match={matchData}/></div>
    <div className="result-actions"><button onClick={() => navigateTo('matches')} className="btn-secondary">Back to Matches Directory</button><button onClick={() => navigateTo('scorecard')} className="btn-primary">Open Official Scorecard <ArrowRight size={15}/></button></div>
  </div>;
}
