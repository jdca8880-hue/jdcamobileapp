import { useEffect, useRef } from 'react';
import { supabase } from '../lib/supabase';
import { db } from '../lib/db';
import { useCricket } from '../context/CricketContext';

export function useLiveMatchesSync() {
  const { setMatches, setTournaments, activeMatchId } = useCricket();
  const setMatchesRef = useRef(setMatches);
  const setTournamentsRef = useRef(setTournaments);

  useEffect(() => {
    setMatchesRef.current = setMatches;
    setTournamentsRef.current = setTournaments;
  }, [setMatches, setTournaments]);

  useEffect(() => {
    let matchesSub = null;
    let deliveriesSub = null;
    let broadcastSub = null;
    let bc = null;
    let isMounted = true;

    if (!supabase) return;

    // Helper to fetch and patch scorecard for a specific match
    const patchScorecardForMatch = async (targetMatchId) => {
      if (!targetMatchId) return;
      try {
        const { api } = await import('../lib/api');
        const card = await api.getMatchScorecard(targetMatchId);
        if (card && isMounted) {
          setMatchesRef.current(prev => prev.map(m => {
            if (m.id !== targetMatchId) return m;
            return {
              ...m,
              status: ['COMPLETED', 'FINISHED'].includes(m.status) ? m.status : 'IN_PROGRESS',
              home_team: { ...(m.home_team || {}), score: card.home_team?.score, overs: card.home_team?.overs },
              away_team: { ...(m.away_team || {}), score: card.away_team?.score, overs: card.away_team?.overs },
              result_text: card.resultText || m.result_text,
              scorecard: card
            };
          }));
        }
      } catch (e) {
        console.warn('[useLiveMatchesSync] Failed to patch scorecard for match:', targetMatchId, e);
      }
    };

    // 1. Matches Realtime Channel (Updates & Status changes)
    matchesSub = supabase.channel('public:matches_live_sync')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'matches' }, async (payload) => {
        if (!isMounted) return;
        if (payload.eventType === 'INSERT' || payload.eventType === 'UPDATE') {
          const matchData = payload.new;
          if (matchData.deleted_at) {
            await db.matches.delete(matchData.id);
            setMatchesRef.current(prev => prev.filter(m => m.id !== matchData.id));
            return;
          }

          let enriched = { ...matchData };
          try {
            const hTeam = await db.teams.get(matchData.home_team_id);
            const aTeam = await db.teams.get(matchData.away_team_id);
            if (hTeam) enriched.home_team = { id: hTeam.id, name: hTeam.name, short_name: hTeam.short_name || '' };
            if (aTeam) enriched.away_team = { id: aTeam.id, name: aTeam.name, short_name: aTeam.short_name || '' };
          } catch (e) {}

          const isLive = ['LIVE', 'IN_PROGRESS', 'INNINGS_BREAK'].includes(String(matchData.status || '').toUpperCase());
          if (isLive) {
            try {
              const { api } = await import('../lib/api');
              const card = await api.getMatchScorecard(matchData.id);
              if (card) {
                enriched.home_team = { ...(enriched.home_team || {}), score: card.home_team?.score, overs: card.home_team?.overs };
                enriched.away_team = { ...(enriched.away_team || {}), score: card.away_team?.score, overs: card.away_team?.overs };
                enriched.result_text = card.resultText || enriched.result_text;
                enriched.scorecard = card;
              }
            } catch (e) {}
          }

          await db.matches.put(enriched);
          setMatchesRef.current(prev => {
            const existingIndex = prev.findIndex(m => m.id === matchData.id);
            if (existingIndex >= 0) {
              const newArr = [...prev];
              newArr[existingIndex] = { ...newArr[existingIndex], ...enriched };
              return newArr;
            }
            return [enriched, ...prev];
          });
        } else if (payload.eventType === 'DELETE') {
          await db.matches.delete(payload.old.id);
          setMatchesRef.current(prev => prev.filter(m => m.id !== payload.old.id));
        }
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'tournaments' }, async (payload) => {
        if (!isMounted) return;
        if (payload.eventType === 'INSERT' || payload.eventType === 'UPDATE') {
          const tData = payload.new;
          if (tData.deleted_at) {
            await db.tournaments.delete(tData.id);
            setTournamentsRef.current(prev => prev.filter(t => t.id !== tData.id));
            return;
          }
          await db.tournaments.put(tData);
          setTournamentsRef.current(prev => {
            const existingIndex = prev.findIndex(t => t.id === tData.id);
            if (existingIndex >= 0) {
              const newArr = [...prev];
              newArr[existingIndex] = { ...newArr[existingIndex], ...tData };
              return newArr;
            }
            return [tData, ...prev];
          });
        } else if (payload.eventType === 'DELETE') {
          await db.tournaments.delete(payload.old.id);
          setTournamentsRef.current(prev => prev.filter(t => t.id !== payload.old.id));
        }
      })
      .subscribe();

    // 2. Global Deliveries Realtime Channel (so ALL screens get live ball updates, not just the scorer)
    deliveriesSub = supabase.channel('jdca:global_live_deliveries')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'deliveries'
      }, async (payload) => {
        if (!isMounted) return;
        const targetMatchId = payload.new?.match_id || payload.old?.match_id || activeMatchId;
        window.dispatchEvent(new CustomEvent('jdca-realtime-delivery', { detail: payload }));
        if (targetMatchId) {
          await patchScorecardForMatch(targetMatchId);
        }
      })
      .subscribe();

    // 3. Supabase Realtime Broadcast (instant low-latency event between devices)
    try {
      broadcastSub = supabase.channel('jdca_broadcast_feed')
        .on('broadcast', { event: 'score_update' }, async ({ payload }) => {
          if (!isMounted || !payload?.matchId) return;
          const { matchId, status, scoreData } = payload;
          setMatchesRef.current(prev => prev.map(m => {
            if (m.id !== matchId) return m;
            return {
              ...m,
              status: status || m.status,
              ...(scoreData || {})
            };
          }));
          window.dispatchEvent(new CustomEvent('live-scorecard-updated', { detail: { matchId, scoreData } }));
        })
        .subscribe();
    } catch (e) {}

    // 4. Local Browser BroadcastChannel (instant zero-delay sync across tabs and windows)
    try {
      if (typeof BroadcastChannel !== 'undefined') {
        bc = new BroadcastChannel('jdca_match_sync');
        bc.onmessage = (event) => {
          if (!isMounted) return;
          const { type, matchId, scoreData, status } = event.data || {};
          if (type === 'MATCH_LIVE_UPDATE' && matchId) {
            setMatchesRef.current(prev => prev.map(m => {
              if (m.id !== matchId) return m;
              return {
                ...m,
                status: status || scoreData?.status || 'IN_PROGRESS',
                ...(scoreData || {})
              };
            }));
            window.dispatchEvent(new CustomEvent('live-scorecard-updated', { detail: { matchId, scoreData } }));
          }
        };
      }
    } catch (e) {}

    // 5. Periodic polling fallback (every 6 seconds for live matches, 20s otherwise)
    const pollLiveMatches = async () => {
      if (!supabase || !navigator.onLine || !isMounted) return;
      try {
        const { data: freshMatches, error } = await supabase
          .from('matches')
          .select('*, tournaments(id, name), home_team:teams!matches_home_team_id_fkey(*), away_team:teams!matches_away_team_id_fkey(*)')
          .is('deleted_at', null)
          .order('scheduled_at', { ascending: false });

        if (!error && freshMatches && isMounted) {
          const { api } = await import('../lib/api');
          const enriched = await Promise.all(freshMatches.map(async (m) => {
            const isLive = ['LIVE', 'IN_PROGRESS', 'INNINGS_BREAK'].includes(String(m.status || '').toUpperCase());
            const base = {
              ...m,
              tournament: m.tournaments?.name || m.tournament,
              home_team: {
                id: m.home_team_id,
                name: m.home_team?.name || 'Home Team',
                short_name: m.home_team?.short_name || ''
              },
              away_team: {
                id: m.away_team_id,
                name: m.away_team?.name || 'Away Team',
                short_name: m.away_team?.short_name || ''
              }
            };

            if (isLive || m.status === 'COMPLETED' || m.status === 'FINISHED') {
              try {
                const card = await api.getMatchScorecard(m.id);
                if (card) {
                  base.home_team.score = card.home_team?.score;
                  base.home_team.overs = card.home_team?.overs;
                  base.away_team.score = card.away_team?.score;
                  base.away_team.overs = card.away_team?.overs;
                  base.result_text = card.resultText || base.result_text;
                  base.scorecard = card;
                }
              } catch (e) {}
            }
            return base;
          }));

          if (isMounted) {
            setMatchesRef.current(enriched);
            try {
              await db.matches.bulkPut(enriched);
            } catch (e) {}
          }
        }
      } catch (err) {
        console.warn('[useLiveMatchesSync] Polling error:', err);
      }
    };

    pollLiveMatches();
    const pollInterval = setInterval(pollLiveMatches, 6000);

    const onVisibility = () => {
      if (document.visibilityState === 'visible') {
        pollLiveMatches();
      }
    };
    document.addEventListener('visibilitychange', onVisibility);

    return () => {
      isMounted = false;
      if (matchesSub) supabase.removeChannel(matchesSub);
      if (deliveriesSub) supabase.removeChannel(deliveriesSub);
      if (broadcastSub) supabase.removeChannel(broadcastSub);
      if (bc) bc.close();
      clearInterval(pollInterval);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, [activeMatchId]);
}
