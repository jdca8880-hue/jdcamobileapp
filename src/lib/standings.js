import { useState, useEffect } from 'react';
import { supabase } from './supabase';

export const useStandings = (matches) => {
  const [pointsTable, setPointsTable] = useState([]);

  useEffect(() => {
    let isMounted = true;

    const fetchAndCalculate = async () => {
      if (!matches || matches.length === 0) {
        if (isMounted) setPointsTable([]);
        return;
      }

      const standings = new Map();

      // Initialize standings map
      matches.forEach(m => {
        const tA = m.home_team?.name || m.teamA?.name || m.teamA || 'Team A';
        const tB = m.away_team?.name || m.teamB?.name || m.teamB || 'Team B';
        const idA = m.home_team_id || m.home_team?.id || m.teamA?.id || tA;
        const idB = m.away_team_id || m.away_team?.id || m.teamB?.id || tB;

        if (!tA || !tB) return;

        if (!standings.has(idA)) {
          standings.set(idA, { 
            team: tA, short: tA.slice(0, 3).toUpperCase(), 
            m: 0, w: 0, l: 0, t: 0, nr: 0, pts: 0, form: [], color: '#0FA968',
            runs_scored: 0, overs_faced: 0, runs_conceded: 0, overs_bowled: 0 
          });
        }
        if (!standings.has(idB)) {
          standings.set(idB, { 
            team: tB, short: tB.slice(0, 3).toUpperCase(), 
            m: 0, w: 0, l: 0, t: 0, nr: 0, pts: 0, form: [], color: '#2457D6',
            runs_scored: 0, overs_faced: 0, runs_conceded: 0, overs_bowled: 0 
          });
        }

        const sA = standings.get(idA);
        const sB = standings.get(idB);

        if (m.status === 'COMPLETED' || m.status === 'FINISHED' || m.status === 'ABANDONED') {
          sA.m += 1;
          sB.m += 1;
          const resultText = m.result_text || m.result || '';
          const winnerId = m.winner_team_id || m.winnerTeamId;

          let winner = null;
          if (winnerId) {
            winner = winnerId === idA ? idA : (winnerId === idB ? idB : null);
          } else {
            if (resultText.includes(tA)) winner = idA;
            else if (resultText.includes(tB)) winner = idB;
          }

          if (winner === idA) {
            sA.w += 1; sA.pts += 2; sA.form.push('W');
            sB.l += 1; sB.form.push('L');
          } else if (winner === idB) {
            sB.w += 1; sB.pts += 2; sB.form.push('W');
            sA.l += 1; sA.form.push('L');
          } else if (m.status !== 'CANCELLED') {
            if (m.status === 'ABANDONED' || resultText.toLowerCase().includes('abandon') || resultText.toLowerCase().includes('no result')) {
              sA.nr += 1; sB.nr += 1;
              sA.pts += 1; sB.pts += 1;
              sA.form.push('NR'); sB.form.push('NR');
            } else {
              sA.t += 1; sB.t += 1;
              sA.pts += 1; sB.pts += 1;
              sA.form.push('T'); sB.form.push('T');
            }
          }
        }
      });

      // Fetch innings for NRR
      const matchIds = matches.map(m => m.id).filter(Boolean);
      
      if (matchIds.length > 0) {
        const { data: inningsData, error } = await supabase
          .from('innings')
          .select('match_id, batting_team_id, bowling_team_id, overs_limit, deliveries(runs_total, extra_type, wicket_type)')
          .in('match_id', matchIds);

        if (!error && inningsData) {
          inningsData.forEach(inning => {
            const batId = inning.batting_team_id;
            const bowlId = inning.bowling_team_id;
            
            const batStats = standings.get(batId);
            const bowlStats = standings.get(bowlId);
            
            if (batStats && bowlStats && inning.deliveries) {
              let runs = 0;
              let legalBalls = 0;
              let wickets = 0;

              inning.deliveries.forEach(d => {
                runs += (d.runs_total || 0);
                if (d.extra_type !== 'WIDE' && d.extra_type !== 'NO_BALL') {
                  legalBalls += 1;
                }
                if (d.wicket_type && d.wicket_type !== 'NONE') {
                  wickets += 1;
                }
              });

              // If team is all out, their overs faced becomes the max_overs
              const match = matches.find(m => m.id === inning.match_id);
              const maxOvers = inning.overs_limit || match?.max_overs || 20;
              
              const overs = (wickets >= 10) ? maxOvers : (legalBalls / 6);

              batStats.runs_scored += runs;
              batStats.overs_faced += overs;
              
              bowlStats.runs_conceded += runs;
              bowlStats.overs_bowled += overs;
            }
          });
        }
      }

      // Calculate NRR and sort
      const table = Array.from(standings.values()).map(t => {
        const rpf = t.overs_faced > 0 ? (t.runs_scored / t.overs_faced) : 0;
        const rpc = t.overs_bowled > 0 ? (t.runs_conceded / t.overs_bowled) : 0;
        const nrr = (rpf - rpc).toFixed(3);
        
        return {
          ...t,
          nrr: (nrr > 0 ? '+' : '') + nrr
        };
      }).sort((a, b) => b.pts - a.pts || parseFloat(b.nrr) - parseFloat(a.nrr));

      if (isMounted) {
        setPointsTable(table);
      }
    };

    fetchAndCalculate();

    return () => { isMounted = false; };
  }, [matches]);

  return pointsTable;
};
