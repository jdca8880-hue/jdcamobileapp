import { useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { db } from '../lib/db';
import { useCricket } from '../context/CricketContext';

export function useLiveMatchesSync() {
  const { setMatches, setTournaments, activeMatchId } = useCricket();

  useEffect(() => {
    let matchesSub = null;
    let deliveriesSub = null;

    if (!supabase) return;

    matchesSub = supabase.channel('public:matches')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'matches' }, async (payload) => {
        if (payload.eventType === 'INSERT' || payload.eventType === 'UPDATE') {
          const matchData = payload.new;
          if (matchData.deleted_at) {
            await db.matches.delete(matchData.id);
            setMatches(prev => prev.filter(m => m.id !== matchData.id));
            return;
          }
          let enriched = { ...matchData };
          try {
            const hTeam = await db.teams.get(matchData.home_team_id);
            const aTeam = await db.teams.get(matchData.away_team_id);
            if (hTeam) enriched.home_team = { id: hTeam.id, name: hTeam.name, short_name: hTeam.short_name || '' };
            if (aTeam) enriched.away_team = { id: aTeam.id, name: aTeam.name, short_name: aTeam.short_name || '' };
          } catch (e) {}

          await db.matches.put(enriched);
          setMatches(prev => {
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
          setMatches(prev => prev.filter(m => m.id !== payload.old.id));
        }
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'tournaments' }, async (payload) => {
        if (payload.eventType === 'INSERT' || payload.eventType === 'UPDATE') {
          const tData = payload.new;
          if (tData.deleted_at) {
            await db.tournaments.delete(tData.id);
            setTournaments(prev => prev.filter(t => t.id !== tData.id));
            return;
          }
          await db.tournaments.put(tData);
          setTournaments(prev => {
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
          setTournaments(prev => prev.filter(t => t.id !== payload.old.id));
        }
      })
      .subscribe();

    // Deliveries Realtime Subscription (Once per active match).
    // Namespaced so useLiveMatch (viewer-side) can keep its own parallel
    // channel on the same table without one tearing the other down.
    if (activeMatchId) {
      const topic = `jdca:useLiveMatchesSync:deliveries:${activeMatchId}`;
      deliveriesSub = supabase.channel(topic);

      deliveriesSub.on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'deliveries',
        filter: `match_id=eq.${activeMatchId}`
      }, async (payload) => {
        // Dispatch global event for local state to hydrate
        window.dispatchEvent(new CustomEvent('jdca-realtime-delivery', { detail: payload }));

        // Patch just this match's score in the directory so the live cards
        // update between the 60s safety poll ticks.
        try {
          const { api } = await import('../lib/api');
          const card = await api.getMatchScorecard(activeMatchId);
          if (card) {
            setMatches(prev => prev.map(m => {
              if (m.id !== activeMatchId) return m;
              return {
                ...m,
                home_team: { ...(m.home_team || {}), score: card.home_team?.score, overs: card.home_team?.overs },
                away_team: { ...(m.away_team || {}), score: card.away_team?.score, overs: card.away_team?.overs },
                result_text: card.resultText || m.result_text,
                scorecard: card
              };
            }));
          }
        } catch (e) { /* non-fatal: 60s poll will catch up */ }
      });
      
      deliveriesSub.on('system', { event: '*' }, (payload) => {
        if (payload.status === 'SUBSCRIBED') {
           // Hydrate state on reconnect
           window.dispatchEvent(new CustomEvent('jdca-realtime-delivery', { detail: { type: 'RECONNECT' } }));
        }
      });

      deliveriesSub.subscribe();
    }

    // Periodic refresh fallback for live scores & matches (every 8 seconds when online)
    const pollLiveMatches = async () => {
      if (!supabase || !navigator.onLine) return;
      try {
        const { data: freshMatches, error } = await supabase
          .from('matches')
          .select('*, tournaments(id, name), home_team:teams!matches_home_team_id_fkey(*), away_team:teams!matches_away_team_id_fkey(*)')
          .is('deleted_at', null)
          .order('scheduled_at', { ascending: false });

        if (!error && freshMatches) {
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

          setMatches(enriched);
          try {
            await db.matches.bulkPut(enriched);
          } catch (e) {}
        }
      } catch (err) {
        console.warn('[useLiveMatchesSync] Polling error:', err);
      }
    };

    pollLiveMatches();
    // Realtime subscriptions above do the heavy lifting; this poll is a
    // *safety net* for missed events. 8s was overloading Supabase (one
    // getMatchScorecard per live match, every 8 seconds); 60s is enough
    // because every real change already pushes via the channel.
    const pollInterval = setInterval(pollLiveMatches, 60000);

    // On tab return, resubscribe + do one immediate poll so a backgrounded
    // tab doesn't sit on stale state while channels silently reconnect.
    const onVisibility = () => {
      if (document.visibilityState === 'visible') {
        pollLiveMatches();
      }
    };
    document.addEventListener('visibilitychange', onVisibility);

    return () => {
      if (matchesSub) supabase.removeChannel(matchesSub);
      if (deliveriesSub) supabase.removeChannel(deliveriesSub);
      clearInterval(pollInterval);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, [setMatches, setTournaments, activeMatchId]);
}
