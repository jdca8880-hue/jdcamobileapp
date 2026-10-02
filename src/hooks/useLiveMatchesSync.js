import { useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { db } from '../lib/db';
import { useCricket } from '../context/CricketContext';

export function useLiveMatchesSync() {
  const { setMatches, setTournaments } = useCricket();

  useEffect(() => {
    let subscription = null;

    if (!supabase) return;

    subscription = supabase.channel('public:matches')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'matches' }, async (payload) => {
        console.log('[Realtime] Match update received:', payload);
        
        if (payload.eventType === 'INSERT' || payload.eventType === 'UPDATE') {
          const matchData = payload.new;
          
          if (matchData.deleted_at) {
            await db.matches.delete(matchData.id);
            setMatches(prev => prev.filter(m => m.id !== matchData.id));
            return;
          }

          // Update Local Dexie
          await db.matches.put(matchData);
          
          // Update React State
          setMatches(prev => {
            const existingIndex = prev.findIndex(m => m.id === matchData.id);
            if (existingIndex >= 0) {
              const newArr = [...prev];
              newArr[existingIndex] = { ...newArr[existingIndex], ...matchData };
              return newArr;
            }
            return [matchData, ...prev];
          });
        } else if (payload.eventType === 'DELETE') {
          const matchId = payload.old.id;
          await db.matches.delete(matchId);
          setMatches(prev => prev.filter(m => m.id !== matchId));
        }
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'tournaments' }, async (payload) => {
        console.log('[Realtime] Tournament update received:', payload);
        
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
          const tId = payload.old.id;
          await db.tournaments.delete(tId);
          setTournaments(prev => prev.filter(t => t.id !== tId));
        }
      })
      .subscribe((status) => {
        console.log('[Realtime] Subscription status:', status);
      });

    return () => {
      if (subscription) {
        supabase.removeChannel(subscription);
      }
    };
  }, [setMatches, setTournaments]);
}
