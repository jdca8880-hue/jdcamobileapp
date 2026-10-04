import { useState, useEffect, useRef } from 'react';
import { supabase } from '../lib/supabase';
import { api } from '../lib/api';

export function useLiveMatch(matchId, initialMatch) {
  const [liveData, setLiveData] = useState(initialMatch);
  const loadingRef = useRef(false);

  useEffect(() => {
    if (!matchId) return;

    let isMounted = true;
    
    // Initial fetch to get scorecard (if initialMatch doesn't have it fully)
    const loadData = async () => {
      try {
        loadingRef.current = true;
        const fullScorecard = await api.getMatchScorecard(matchId);
        if (isMounted) {
          setLiveData(prev => ({
            ...prev,
            scorecard: fullScorecard
          }));
        }
      } catch (err) {
        console.error('Error fetching initial live match scorecard:', err);
      } finally {
        loadingRef.current = false;
      }
    };
    
    // Only load if it's currently live
    if (initialMatch?.status === 'LIVE' || initialMatch?.status === 'IN_PROGRESS') {
      loadData();
    }

    const topic = `public:deliveries:${matchId}`;
    
    // Clean up any existing channel with this topic
    const existing = supabase.getChannels?.()?.find(ch => ch.topic === `realtime:${topic}`);
    if (existing) {
      supabase.removeChannel(existing);
    }

    const channel = supabase.channel(topic);

    channel.on('postgres_changes', {
      event: '*',
      schema: 'public',
      table: 'deliveries',
      filter: `match_id=eq.${matchId}`
    }, async (payload) => {
      // Re-fetch scorecard when a delivery is added/updated/deleted
      if (loadingRef.current) return; // Debounce or prevent duplicate concurrent fetches
      
      try {
        loadingRef.current = true;
        const fullScorecard = await api.getMatchScorecard(matchId);
        if (isMounted) {
          setLiveData(prev => ({
            ...prev,
            scorecard: fullScorecard
          }));
          
          // Dispatch custom event so other components (like ScorecardScreen) can update
          window.dispatchEvent(new CustomEvent('live-scorecard-updated', { 
            detail: { matchId, scorecard: fullScorecard }
          }));
        }
      } catch (err) {
        console.error('Error hydrating live scorecard on realtime event:', err);
      } finally {
        loadingRef.current = false;
      }
    });
    
    channel.on('system', { event: '*' }, (payload) => {
       if (payload.status === 'SUBSCRIBED') {
          // Re-fetch on reconnect to ensure no missed events!
          loadData();
       }
    });

    channel.subscribe();

    return () => {
      isMounted = false;
      supabase.removeChannel(channel);
    };
  }, [matchId, initialMatch?.status]);

  return liveData;
}
