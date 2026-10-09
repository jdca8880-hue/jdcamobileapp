import { supabase } from '../lib/supabase';
import { getPendingActions, clearAction, updateAction } from '../lib/db';
import { normalizeDelivery } from '../engine/deliveryContract.js';
import { captureException, captureMessage } from '../lib/sentry';

const MAX_RETRIES = 3;

class SyncService {
  constructor() {
    this.isOnline = typeof navigator !== 'undefined' ? navigator.onLine : true;
    this.syncInProgress = false;
    this.listeners = new Set();
    this.status = this.isOnline ? 'ONLINE' : 'OFFLINE';
    this.pendingCount = 0;
    this.retryCounts = {}; // track per-action retry count
    this.blockedMatches = new Set();

    // Listen for network changes
    if (typeof window !== 'undefined') {
      window.addEventListener('online', () => this.handleOnline());
      window.addEventListener('offline', () => this.handleOffline());
      // Mobile browsers don't fire 'online' when returning from background.
      // Re-drain the queue whenever the tab becomes visible again.
      document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'visible' && this.isOnline && !this.syncInProgress && this.pendingCount > 0) {
          console.log('[SyncService] Tab visible again. Draining pending queue...');
          this.processQueue();
        }
      });
    }
    
    // Initial fetch of pending count
    this.updatePendingCount();

    // Periodic flush: retry every 30s even if the 'online' event was missed
    this._flushTimer = setInterval(() => {
      if (this.isOnline && this.pendingCount > 0 && !this.syncInProgress) {
        console.log('[SyncService] Periodic flush: processing pending queue...');
        this.processQueue();
      }
    }, 30000);
  }

  subscribe(callback) {
    this.listeners.add(callback);
    callback({ status: this.status, pendingCount: this.pendingCount });
    return () => this.listeners.delete(callback);
  }

  emit() {
    for (const listener of this.listeners) {
      listener({ 
        status: this.status, 
        pendingCount: this.pendingCount,
        blockedMatches: new Set(this.blockedMatches)
      });
    }
  }

  async updatePendingCount() {
    try {
      const actions = await getPendingActions();
      this.pendingCount = actions.filter(a => a.status !== 'FAILED_PERMANENT').length;
      this.emit();
    } catch(e) {}
  }

  setStatus(newStatus) {
    this.status = newStatus;
    this.emit();
  }

  handleOnline() {
    console.log('[SyncService] Back online. Initiating sync...');
    this.isOnline = true;
    this.setStatus('ONLINE');
    this.processQueue();
  }

  handleOffline() {
    console.log('[SyncService] Went offline. Actions will be queued.');
    this.isOnline = false;
    this.setStatus('OFFLINE');
  }

  /**
   * Force reset the sync state and re-trigger a sync. 
   * Useful if the sync gets stuck in SYNCING state.
   */
  async forceSync() {
    console.log('[SyncService] Force sync triggered by user.');
    this.syncInProgress = false;
    if (this.isOnline) {
      await this.processQueue();
    }
  }

  /**
   * Process all pending actions in the local Dexie queue
   */
  async processQueue() {
    if (!this.isOnline || this.syncInProgress) return;

    this.syncInProgress = true;
    this.setStatus('SYNCING');
    let actions = [];
    try {
      try {
        actions = await getPendingActions();
      } catch (err) {
        console.error('[SyncService] Failed to load pending actions from storage:', err);
        return;
      }
      this.pendingCount = actions.filter(a => a.status !== 'FAILED_PERMANENT').length;
      this.emit();

      if (actions.length === 0) {
        this.setStatus('ONLINE');
        return;
      }

      console.log(`[SyncService] Processing ${actions.length} pending actions...`);

      this.blockedMatches.clear();
      const transientBlockedMatches = new Set();
      const context = {
        matchStatusCache: new Map(),
        inningsCache: new Map(),
        inningsDetailsCache: new Map(),
        lastSequenceCache: new Map(),
        rosterCache: new Map()
      };

      for (const action of actions) {
        const matchId = action.payload?.matchId;

        if (action.status === 'FAILED_PERMANENT') {
          if (matchId) {
            this.blockedMatches.add(matchId);
            this.notifyPermanentFailure(matchId, action);
          }
          continue;
        }

        if (matchId && (this.blockedMatches.has(matchId) || transientBlockedMatches.has(matchId))) {
          console.warn(`[SyncService] Skipping action ${action.id} because match ${matchId} is blocked.`);
          continue;
        }

        let success = false;
        let isNetworkError = false;
        let isPermanentError = false;
        let errorDetails = null;
        let isAuthError = false;
        let progressMade = false;
        
        try {
          if (supabase) {
             if (action.action === 'RECORD_DELIVERY') {
               success = await this.pushDelivery(action.payload, context, action);
             } else if (action.action === 'UNDO_DELIVERY') {
               success = await this.deleteDelivery(action.payload);
             } else {
               success = true; // Unknown action type
             }
          }
        } catch (error) {
          console.error(`[SyncService] Failed to process action ${action.id}:`, error);
          errorDetails = { code: error.code, message: error.message, details: error.details };

          if (error.code === 'P0001') {
             const errStr = String(error.message || error.details || '');
             
             console.error(`[SyncService] 🚨 DATABASE EXCEPTION (P0001) in Action ${action.id} (${action.action}):`, errStr);
             console.error(`[SyncService] 📦 FAILED PAYLOAD DUMP:`, JSON.stringify(action.payload, null, 2));
             
             if (errStr.includes('already finalized') || errStr.includes('ABANDONED')) {
                console.error(`[SyncService] 🛑 FATAL: Attempted to sync data for a match that is locked/finalized. Match ID: ${matchId}`);
             }

             // If error is related to playing XI or innings mismatch, don't brand permanent immediately
             if (errStr.includes('playing XI') || errStr.includes('does not belong') || errStr.includes('Innings')) {
               console.warn(`[SyncService] P0001 data mismatch (${errStr}). Clearing caches for auto-healing on retry.`);
               context?.inningsCache?.clear();
               context?.inningsDetailsCache?.clear();
               context?.rosterCache?.clear();
               isPermanentError = false;
               isNetworkError = false;
             } else {
               console.error(`[SyncService] ❌ Marking P0001 error as PERMANENT FAILURE.`);
               isPermanentError = true;
               errorDetails = {
                 code: error.code || 'P0001',
                 message: error.message || 'Database rule violation',
                 details: error.details || error.message
               };
             }
          } else if (error.code === 'SEQUENCE_CONFLICT' || error.code === 'MISSING_SEQUENCE' || error.code === 'UNDO_REJECTED' || error.code === 'MATCH_FINALIZED') {
             // Our own guarded integrity errors: the ball/undo cannot be applied
             // as-is. Block the match so a human resolves it, rather than looping.
             isPermanentError = true;
          } else if (error.code === '23505') {
             // ONLY an idempotency duplicate means "already recorded" (success).
             // A sequence duplicate must NEVER be silently treated as success.
             if (error.message?.includes('idempotency') || error.details?.includes('idempotency')) {
                success = true;
             } else {
                isPermanentError = true;
             }
          } else if (!navigator.onLine || error.message?.includes('Failed to fetch') || error.message?.includes('NetworkError') || error.code === 'NETWORK_ERROR') {
             isNetworkError = true;
          } else if (error.code === '401' || error.code === '42501' || error.message?.includes('JWT') || error.message?.includes('Auth')) {
             isAuthError = true;
          } else if (error.message?.includes('State Transition Error') || error.message?.includes('already finalized') || error.message?.includes('immutable') || error.message?.includes('check_match_immutable')) {
             isPermanentError = true;
          } else if (error.code === '23514' || error.code === '23503' || error.code === '22P02' || error.message?.includes('violates check constraint') || error.message?.includes('violates foreign key constraint') || error.message?.includes('invalid input syntax') || error.message?.includes('invalid UUID')) {
             isPermanentError = true;
          } else {
             // Unknown error -> assume transient until max retries to be safe. (e.g. 500, 502, 503, 504)
             isNetworkError = true;
          }
        }

        const retries = this.retryCounts[action.id] || 0;
        
        if (isAuthError) {
           console.warn(`[SyncService] Authentication error on action ${action.id}. Pausing queue.`);
           this.notifySessionExpired(matchId, action);
           break; // Stop processing the queue until user logs in
        }

        if (!success && !isNetworkError && !isPermanentError) {
           if (retries + 1 >= MAX_RETRIES) {
              isPermanentError = true;
              errorDetails = errorDetails || { message: 'Max retries reached' };
           } else {
              this.retryCounts[action.id] = retries + 1;
           }
        }

        if (isPermanentError) {
           console.error(`[SyncService] Action ${action.id} failed permanently. Blocking match ${matchId}.`);
           await updateAction(action.id, {
             status: 'FAILED_PERMANENT',
             error: errorDetails,
             failedAt: Date.now()
           });
           if (matchId) {
             this.blockedMatches.add(matchId);
             this.emit();
           }
           delete this.retryCounts[action.id];
           
           this.notifyPermanentFailure(matchId, action);
           continue;
        }

        if (success) {
          progressMade = true;
          delete this.retryCounts[action.id];
          await clearAction(action.id);
        } else {
          // If a delivery fails (even transiently), we MUST stop processing the queue for this match.
          // Otherwise, we violate delivery order (pushing D2 before D1).
          console.warn(`[SyncService] Halting queue for match ${matchId} due to action ${action.id} failure.`);
          if (matchId) transientBlockedMatches.add(matchId);
          if (isNetworkError) break; // Also break entirely if network is down
        }
      }
    } catch (unexpectedErr) {
      console.error('[SyncService] Unexpected error in processQueue loop:', unexpectedErr);
    } finally {
      this.syncInProgress = false;
      try {
        await this.updatePendingCount(); 
        this.setStatus(this.isOnline ? 'ONLINE' : 'OFFLINE');
        
        // Auto-drain: if more actions were queued while syncing, start again shortly.
        // But if we're looping without progress (e.g. hitting persistent network/auth errors), back off to 5 seconds.
        if (this.pendingCount > 0 && this.isOnline) {
          const initialCount = Array.isArray(actions) ? actions.length : 0;
          const delay = this.pendingCount === initialCount ? 5000 : 500;
          setTimeout(() => {
            if (this.isOnline && !this.syncInProgress) {
              this.processQueue().catch(err => {
                console.error('[SyncService] Error in auto-drain loop:', err);
              });
            }
          }, delay);
        }
      } catch (countErr) {
        console.error('[SyncService] Error updating pending count in finally:', countErr);
      }
    }
  }

  notifySessionExpired(matchId, action) {
    const msg = `Session expired / please sign in again to continue syncing.`;
    const event = new CustomEvent('sync-permanent-failure', {
      detail: { matchId, actionId: action.id, message: msg, action, isAuthError: true }
    });
    window.dispatchEvent(event);
  }

  notifyPermanentFailure(matchId, action) {
    const seq = action.payload?.deliverySequence || '?';
    const errCode = action.error?.code ? ` [${action.error.code}]` : '';
    const errDesc = action.error?.message || 'Data integrity mismatch';
    const msg = `Match sync stopped at delivery ${seq}${errCode}: ${errDesc}. Match and innings data are inconsistent.`;

    // Report to Sentry so we can see cross-user patterns, not just the one
    // scorer in front of us. Scrub the action payload a little before sending.
    try {
      captureMessage(`[sync-permanent-failure] ${action.error?.code || 'UNKNOWN'}`, {
        matchId,
        actionId: action.id,
        actionType: action.action,
        deliverySequence: seq,
        errorCode: action.error?.code,
        errorMessage: errDesc
      });
    } catch { /* never let telemetry break sync */ }

    // Broadcast a custom event for the UI to pick up
    const event = new CustomEvent('sync-permanent-failure', {
      detail: { matchId, actionId: action.id, message: msg, action }
    });
    window.dispatchEvent(event);
  }

  async retryFailedAction(actionId) {
    this.blockedMatches.clear();
    await updateAction(actionId, { status: 'PENDING', error: null, failedAt: null });
    delete this.retryCounts[actionId];
    await this.updatePendingCount();
    if (this.isOnline) {
      this.processQueue();
    }
  }

  async deleteFailedAction(actionId) {
    this.blockedMatches.clear();
    await clearAction(actionId);
    delete this.retryCounts[actionId];
    await this.updatePendingCount();
    if (this.isOnline) {
      this.processQueue();
    }
  }

  async autoHealAndResume() {
    this.blockedMatches.clear();
    await this.updatePendingCount();
    if (this.isOnline) {
      await this.processQueue();
    }
  }

  async pushDelivery(rawPayload, context = null, action = null) {
    const payload = normalizeDelivery(rawPayload);
    if (!payload.matchId) return true; // Invalid data, skip
    
    // Lifecycle events like 'innings_start' are timeline markers, not physical deliveries
    if (payload.type === 'innings_start') {
      return true;
    }

    const isUUID = (id) => typeof id === 'string' && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
    
    let inningsId = isUUID(payload.inningsId) ? payload.inningsId : null;
    
    // Ensure inningsId exists and is a valid UUID
    if (!inningsId) {
      const cacheKey = `${payload.matchId}_${payload.innings}`;
      if (context?.inningsCache?.has(cacheKey)) {
        inningsId = context.inningsCache.get(cacheKey);
        payload.inningsId = inningsId;
      }
    }

    if (!inningsId) {
      const missingErr = new Error(`[SyncService] Missing valid inningsId for match ${payload.matchId}.`);
      missingErr.code = 'P0001';
      throw missingErr;
    }

    // Verify database relationship: innings.id = payload.inningsId and innings.match_id = payload.matchId
    if (supabase && inningsId) {
      let innData = null;
      if (context?.inningsDetailsCache?.has(inningsId)) {
        innData = context.inningsDetailsCache.get(inningsId);
      } else {
        try {
          const { data } = await supabase
            .from('innings')
            .select('id, match_id, innings_number, batting_team_id, bowling_team_id')
            .eq('id', inningsId)
            .maybeSingle();
          if (data) {
            innData = data;
            context?.inningsDetailsCache?.set(inningsId, innData);
          }
        } catch (fetchInnErr) {
          console.warn('[SyncService] Failed to verify innings details from Supabase:', fetchInnErr);
        }
      }

      if (innData && innData.match_id !== payload.matchId) {
        const err = new Error('Delivery innings does not belong to delivery match');
        err.code = 'P0001';
        err.details = `Mismatch between delivery match ${payload.matchId} and innings ${inningsId} (belongs to match ${innData.match_id})`;
        throw err;
      }
    }

    // Backend verification: Prevent delivery if match is COMPLETED
    if (supabase) {
      let matchStatus = context?.matchStatusCache?.get(payload.matchId);
      if (!matchStatus) {
        const { data: matchData } = await supabase.from('matches').select('status').eq('id', payload.matchId).maybeSingle();
        if (matchData) {
          matchStatus = matchData.status;
          context?.matchStatusCache?.set(payload.matchId, matchStatus);
        }
      }
      
      if (matchStatus === 'COMPLETED' || matchStatus === 'FINISHED' || matchStatus === 'CANCELLED') {
        const finalizedErr = new Error(`Match ${payload.matchId} is ${matchStatus}. Cannot insert delivery.`);
        finalizedErr.code = 'MATCH_FINALIZED';
        throw finalizedErr;
      }

      // Ensure active match status in DB is IN_PROGRESS so other users see it LIVE
      if (matchStatus && !['IN_PROGRESS', 'INNINGS_BREAK', 'COMPLETED', 'FINISHED', 'CANCELLED', 'ABANDONED'].includes(matchStatus)) {
        try {
          const { error: statusErr } = await supabase.from('matches').update({ status: 'IN_PROGRESS' }).eq('id', payload.matchId);
          if (statusErr) {
            console.warn('[SyncService] Failed to update match status to IN_PROGRESS:', statusErr.message);
          } else {
            context?.matchStatusCache?.set(payload.matchId, 'IN_PROGRESS');
          }
        } catch (statusUpdateErr) {
          console.warn('[SyncService] Failed to update match status to IN_PROGRESS:', statusUpdateErr);
        }
      }
    }

    const wicketType = payload.wicketType;
    const extraType = payload.extraType;

    const runsOffBat = payload.runsBatter;
    const runsExtras = payload.runsExtras;
    const finalTotalRuns = payload.runsTotal;

    // Classify the event. PENALTY / RETIREMENT are stored but never counted as
    // physical balls (via deliveries.event_type + the guarded stat views).
    const eventType =
      payload.eventType === 'PENALTY' ? 'PENALTY'
      : (['RETIRED_HURT', 'RETIRED_OUT'].includes(wicketType) ? 'RETIREMENT' : 'DELIVERY');
    const isSpecialEvent = eventType !== 'DELIVERY';

    // Resolve player UUIDs with intelligent fallback resolution
    let strikerId = isUUID(payload.strikerId) ? payload.strikerId : null;
    let nonStrikerId = isUUID(payload.nonStrikerId) ? payload.nonStrikerId : null;
    let bowlerId = isUUID(payload.bowlerId) ? payload.bowlerId : null;

    // Require player UUIDs ONLY for real deliveries. Penalties have no bowler
    // and retirements aren't bowled; their player columns are left null so the
    // validate_delivery XI checks (which skip null players) don't reject them.
    if (!isSpecialEvent && (!strikerId || !bowlerId || !nonStrikerId)) {
      const err = new Error(`Missing required valid UUIDs for striker (${strikerId}), non-striker (${nonStrikerId}), or bowler (${bowlerId}).`);
      err.code = 'P0001';
      throw err;
    }
    if (isSpecialEvent) {
      strikerId = null;
      nonStrikerId = null;
      bowlerId = null;
    }

    // Resolve dismissed player UUID (constraint wicket_player_required: wicket_type = 'NONE' or dismissed_player_id is not null)
    let dismissedPlayerId = null;
    if (wicketType !== 'NONE') {
      dismissedPlayerId = isUUID(payload.dismissedPlayerId)
        ? payload.dismissedPlayerId
        : (isUUID(payload.outPlayerId) ? payload.outPlayerId : null);
      if (!dismissedPlayerId) {
        const err = new Error(`Dismissal event for ball ${payload.id} is missing a valid dismissed player id.`);
        err.code = 'P0001';
        throw err;
      }
    }

    // Consistency constraints for fielder and wicketkeeper
    const fielderId = (['CAUGHT', 'RUN_OUT'].includes(wicketType) && isUUID(payload.fielderId)) ? payload.fielderId : null;
    const wicketkeeperId = (['STUMPED', 'CAUGHT_BEHIND'].includes(wicketType) && isUUID(payload.wicketkeeperId)) ? payload.wicketkeeperId : null;

    // The client assigns a monotonic per-innings sequence. We must NOT guess a
    // replacement here: guessing "server max + 1" is exactly what silently
    // overwrote and dropped balls. A missing sequence is a real defect we
    // surface instead of papering over.
    const deliverySequence = payload.deliverySequence;
    if (!deliverySequence || deliverySequence < 1) {
      const err = new Error(`Missing delivery_sequence for ball ${payload.id} in innings ${inningsId}.`);
      err.code = 'MISSING_SEQUENCE';
      throw err;
    }

    const { data: { session } } = await supabase.auth.getSession();
    const userId = session?.user?.id;

    // Explicit log before attempting INSERT as required
    console.log(`[ScoringFlow:Sync] Preparing delivery insert to Supabase:`, {
      actionId: action?.id,
      idempotencyKey: payload.id,
      matchId: payload.matchId,
      inningsId: inningsId,
      sequence: deliverySequence,
      rawPayload: rawPayload
    });

    // Player assignments must be established prior to sync. No roster auto-repair.

    const { error } = await supabase.from('deliveries').insert({
      match_id: payload.matchId,
      innings_id: inningsId,
      delivery_sequence: deliverySequence,
      over_number: Math.floor((payload.balls || 0) / 6),
      ball_number: ((payload.balls || 0) % 6) + 1,
      striker_id: strikerId,
      non_striker_id: nonStrikerId,
      bowler_id: bowlerId,
      runs_off_bat: runsOffBat,
      runs_extras: runsExtras,
      runs_total: finalTotalRuns,
      extra_type: extraType,
      wicket_type: wicketType,
      dismissed_player_id: dismissedPlayerId,
      fielder_id: fielderId,
      wicketkeeper_id: wicketkeeperId,
      wagon_zone: payload.wagonZone || null,
      idempotency_key: payload.id, // Unique ID from frontend event
      created_by: userId,
      event_type: eventType
    });

    if (error) {
      if (error.code === '23505') {
        const dupMsg = `${error.message || ''} ${error.details || ''}`;
        const isIdempotencyDup = dupMsg.includes('idempotency');
        const isSequenceDup = dupMsg.includes('delivery_sequence') || dupMsg.includes('innings_id');

        // Same idempotency key already present => THIS exact ball was already
        // recorded (a genuine retry). Safe to treat as success.
        if (isIdempotencyDup) {
          context?.lastSequenceCache?.set(inningsId, deliverySequence);
          return true;
        }

        // Sequence collision: a success ONLY if our own idempotency key is the
        // one occupying that sequence. Otherwise a DIFFERENT ball took the slot
        // and this ball must not be dropped — surface it as a hard conflict.
        if (isSequenceDup) {
          const { data: mine } = await supabase
            .from('deliveries')
            .select('idempotency_key')
            .eq('idempotency_key', payload.id)
            .maybeSingle();
          if (mine) {
            context?.lastSequenceCache?.set(inningsId, deliverySequence);
            return true;
          }
          const seqErr = new Error(`Delivery sequence ${deliverySequence} is already used in innings ${inningsId} by a different ball (${payload.id}).`);
          seqErr.code = 'SEQUENCE_CONFLICT';
          seqErr.details = dupMsg;
          throw seqErr;
        }

        throw error;
      }
      // Ensure finalized rejections are bubbled up instead of silently dropped
      throw error;
    }
    
    console.log(`[ScoringFlow:Sync] ✅ Successfully inserted delivery into Supabase!`, { id: payload.id });
    context?.lastSequenceCache?.set(inningsId, deliverySequence);
    return true;
  }

  async deleteDelivery(payload) {
    if (!payload.id || !payload.matchId) return true; // Invalid data, skip

    // Backend verification: Prevent undo if match is COMPLETED
    if (supabase) {
      const { data: matchData } = await supabase.from('matches').select('status').eq('id', payload.matchId).maybeSingle();
      if (matchData && matchData.status === 'COMPLETED') {
        console.warn(`[SyncService] Match ${payload.matchId} is COMPLETED. Rejecting undo record.`);
        return true;
      }
    }
    
    // idempotency_key is globally unique; scope to the match as a safety net.
    // .select() returns the rows actually deleted so we can detect a silent no-op.
    const { data: deleted, error } = await supabase.from('deliveries')
      .delete()
      .eq('idempotency_key', payload.id)
      .eq('match_id', payload.matchId)
      .select();

    if (error) {
      console.error('[SyncService] Failed to delete delivery:', error);
      throw error;
    }

    const deletedCount = Array.isArray(deleted) ? deleted.length : 0;
    if (deletedCount === 0) {
      // Nothing deleted. Either it was already gone (fine, idempotent), or an
      // RLS DELETE policy silently blocked us (NOT fine) — tell them apart.
      const { data: still } = await supabase.from('deliveries')
        .select('idempotency_key')
        .eq('idempotency_key', payload.id)
        .maybeSingle();
      if (still) {
        const err = new Error(`Undo rejected: delivery ${payload.id} still exists after delete (likely no DELETE RLS policy on 'deliveries').`);
        err.code = 'UNDO_REJECTED';
        throw err;
      }
    }
    return true;
  }

  /**
   * Attempt to perform an action immediately if online,
   * otherwise queue it for later.
   */
  async executeOrQueue(actionType, payload, offlineQueueFn) {
    // Every action goes through the single FIFO queue, drained by one worker.
    // The previous "execute immediately when online" fast-path allowed a live
    // UNDO delete to overtake a still-queued INSERT (and two live writes to land
    // out of order). Enqueueing everything guarantees ordered, serialized sync.
    await offlineQueueFn(actionType, payload);
    await this.updatePendingCount();
    if (this.isOnline && !this.syncInProgress) {
      this.processQueue();
    }
    return false;
  }
}

export const syncService = new SyncService();
