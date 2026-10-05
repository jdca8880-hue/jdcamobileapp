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

    // Deliveries Realtime Subscription (Once per active match)
    if (activeMatchId) {
      const topic = `public:deliveries:${activeMatchId}`;
      const existing = supabase.getChannels?.()?.find(ch => ch.topic === `realtime:${topic}`);
      if (existing) {
        supabase.removeChannel(existing);
      }

      deliveriesSub = supabase.channel(topic);

      deliveriesSub.on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'deliveries',
        filter: `match_id=eq.${activeMatchId}`
      }, async (payload) => {
        // Dispatch global event for local state to hydrate
        window.dispatchEvent(new CustomEvent('jdca-realtime-delivery', { detail: payload }));
      });
      
      deliveriesSub.on('system', { event: '*' }, (payload) => {
        if (payload.status === 'SUBSCRIBED') {
           // Hydrate state on reconnect
           window.dispatchEvent(new CustomEvent('jdca-realtime-delivery', { detail: { type: 'RECONNECT' } }));
        }
      });

      deliveriesSub.subscribe();
    }

    return () => {
      if (matchesSub) supabase.removeChannel(matchesSub);
      if (deliveriesSub) supabase.removeChannel(deliveriesSub);
    };
  }, [setMatches, setTournaments, activeMatchId]);
}
