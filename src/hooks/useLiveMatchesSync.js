import { useEffect, useRef } from 'react';
import { supabase } from '../lib/supabase';
import { db } from '../lib/db';
import { useCricket } from '../context/CricketContext';

/**
 * useLiveMatchesSync:
 * Lightweight matches catalog sync. Does NOT automatically subscribe all devices to deliveries.
 * Realtime deliveries are subscribed on-demand only when a user specifically views a live match or live tab.
 */
export function useLiveMatchesSync() {
  const { setMatches, setTournaments } = useCricket();
  const setMatchesRef = useRef(setMatches);
  const setTournamentsRef = useRef(setTournaments);

  useEffect(() => {
    setMatchesRef.current = setMatches;
    setTournamentsRef.current = setTournaments;
  }, [setMatches, setTournaments]);

  useEffect(() => {
    let matchesSub = null;
    let bc = null;
    let isMounted = true;

    if (!supabase) return;

    // 1. Matches & Tournaments Realtime Channel (Only for fixture updates, creations, deletions)
    matchesSub = supabase.channel('public:matches_catalog')
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

    // 2. Local Browser BroadcastChannel (Instant local cross-tab sync without remote network overhead)
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

    // 3. Gentle background poll (every 30 seconds for matches directory)
    const pollMatches = async () => {
      if (!supabase || !navigator.onLine || !isMounted) return;
      try {
        const { data: freshMatches, error } = await supabase
          .from('matches')
          .select('*, tournaments(id, name), home_team:teams!matches_home_team_id_fkey(*), away_team:teams!matches_away_team_id_fkey(*)')
          .is('deleted_at', null)
          .order('scheduled_at', { ascending: false });

        if (!error && freshMatches && isMounted) {
          const enriched = freshMatches.map(m => ({
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
          }));

          setMatchesRef.current(enriched);
          try {
            await db.matches.bulkPut(enriched);
          } catch (e) {}
        }
      } catch (err) {
        console.warn('[useLiveMatchesSync] Polling error:', err);
      }
    };

    pollMatches();
    const pollInterval = setInterval(pollMatches, 30000);

    const onVisibility = () => {
      if (document.visibilityState === 'visible') {
        pollMatches();
      }
    };
    document.addEventListener('visibilitychange', onVisibility);

    return () => {
      isMounted = false;
      if (matchesSub) supabase.removeChannel(matchesSub);
      if (bc) bc.close();
      clearInterval(pollInterval);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, []);
}
