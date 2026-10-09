import { useEffect, useRef, useCallback } from 'react';
import { liveSubManager } from '../services/LiveSubscriptionManager';
import { api } from '../lib/api';

/**
 * Subscribe to live delivery events for one or more matches.
 * Automatically subscribes on mount / when matchIds change,
 * and unsubscribes when the component unmounts or matchIds go empty.
 *
 * @param {string|string[]} matchIds - single match ID or array of match IDs
 * @param {function} onUpdate - called with (matchId, scorecardData) on each delivery event
 * @param {boolean} enabled - set false to suppress subscription (e.g. when not on live tab)
 */
export function useLiveSubscription(matchIds, onUpdate, enabled = true) {
  const onUpdateRef = useRef(onUpdate);
  useEffect(() => { onUpdateRef.current = onUpdate; }, [onUpdate]);

  const fetchingRef = useRef(new Set());

  const fetchScorecard = useCallback(async (matchId) => {
    if (fetchingRef.current.has(matchId)) return;
    fetchingRef.current.add(matchId);
    try {
      const data = await api.getMatchScorecard(matchId);
      if (data && onUpdateRef.current) {
        onUpdateRef.current(matchId, data);
      }
    } catch (err) {
      console.warn(`[useLiveSubscription] Failed to fetch scorecard for ${matchId}:`, err);
    } finally {
      fetchingRef.current.delete(matchId);
    }
  }, []);

  useEffect(() => {
    if (!enabled) return;

    const ids = Array.isArray(matchIds) ? matchIds : (matchIds ? [matchIds] : []);
    if (ids.length === 0) return;

    const unsubs = ids.map(id =>
      liveSubManager.subscribe(id, (payload) => {
        if (payload._type === 'CONNECTED') {
          fetchScorecard(id);
          return;
        }
        fetchScorecard(id);
      })
    );

    ids.forEach(id => fetchScorecard(id));

    return () => {
      unsubs.forEach(fn => fn());
    };
  }, [enabled, Array.isArray(matchIds) ? matchIds.join(',') : matchIds, fetchScorecard]);
}
