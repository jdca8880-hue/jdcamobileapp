/**
 * useEventMatch — the React adapter over the event-sourced engine (Stage 4).
 *
 * This is the clean API the scoring UI will use for a v2 match:
 *   const { state, record, undo } = useEventMatch(matchId, { format });
 *
 *   state   = buildMatchState(localLog)  — the authoritative projection (score,
 *             scorecard, innings, target, result). Re-folded whenever the local
 *             log changes (local record, outbox push, cursor pull, Realtime).
 *   record  = append an event (ball/wicket/innings-start/...) → log+outbox, then
 *             nudge a push. Offline-safe: it never waits on the network.
 *   undo    = void an event deterministically.
 *
 * The UI stays dumb: it renders `state` and calls `record`. All durability,
 * ordering, dedupe, sync and live updates happen underneath.
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { appendEvent, voidEventById, getMatchEvents } from '../lib/matchLog';
import { buildMatchState } from '../engine/matchProjection';
import { subscribeMatch, pushOutbox, startAutoPush, onSyncChange } from '../services/eventSync';

export function useEventMatch(matchId, { format } = {}) {
  const [state, setState] = useState(null);
  const [error, setError] = useState(null);
  const mounted = useRef(true);

  const refold = useCallback(async () => {
    if (!matchId) return;
    try {
      const events = await getMatchEvents(matchId);
      const next = buildMatchState(events, { matchId, format });
      if (mounted.current) setState(next);
    } catch (e) {
      if (mounted.current) setError(e);
    }
  }, [matchId, format]);

  useEffect(() => {
    mounted.current = true;
    if (!matchId) return undefined;
    refold();
    const unsub = subscribeMatch(matchId, () => refold());   // pull + realtime
    const offChange = onSyncChange(() => refold());          // push/pull activity
    startAutoPush();                                         // keep the outbox draining
    return () => { mounted.current = false; unsub(); offChange(); };
  }, [matchId, refold]);

  const record = useCallback(async (event) => {
    if (!matchId || !event?.type) return null;
    const stored = await appendEvent({ matchId, ...event });
    await refold();                 // optimistic local update (no network wait)
    pushOutbox().catch(() => {});   // fire-and-forget upload
    return stored;
  }, [matchId, refold]);

  const undo = useCallback(async (eventId) => {
    if (!matchId || !eventId) return;
    await voidEventById(matchId, eventId);
    await refold();
    pushOutbox().catch(() => {});
  }, [matchId, refold]);

  return { state, error, record, undo, refold };
}
