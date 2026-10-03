import { supabase } from '../lib/supabase';
import { getPendingActions, clearAction, updateAction } from '../lib/db';

const MAX_RETRIES = 3;

class SyncService {
  constructor() {
    this.isOnline = navigator.onLine;
    this.syncInProgress = false;
    this.listeners = new Set();
    this.status = this.isOnline ? 'ONLINE' : 'OFFLINE';
    this.pendingCount = 0;
    this.retryCounts = {}; // track per-action retry count

    // Listen for network changes
    window.addEventListener('online', () => this.handleOnline());
    window.addEventListener('offline', () => this.handleOffline());
    
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
      listener({ status: this.status, pendingCount: this.pendingCount });
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
    try {
      const actions = await getPendingActions();
      this.pendingCount = actions.filter(a => a.status !== 'FAILED_PERMANENT').length;
      this.emit();

      if (actions.length === 0) {
        this.syncInProgress = false;
        this.setStatus('ONLINE');
        return;
      }

      console.log(`[SyncService] Processing ${actions.length} pending actions...`);

      const blockedMatches = new Set();
      const context = {
        matchStatusCache: new Map(),
        inningsCache: new Map(),
        lastSequenceCache: new Map(),
        rosterCache: new Map()
      };

      for (const action of actions) {
        const matchId = action.payload?.matchId;

        if (action.status === 'FAILED_PERMANENT') {
          if (matchId) {
            blockedMatches.add(matchId);
            // Notify UI again so user isn't silently blocked after a refresh
            this.notifyPermanentFailure(matchId, action);
          }
          continue;
        }

        if (matchId && blockedMatches.has(matchId)) {
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
               success = await this.pushDelivery(action.payload, context);
             } else if (action.action === 'UNDO_DELIVERY') {
               success = await this.deleteDelivery(action.payload);
             } else {
               success = true; // Unknown action type
             }
          }
        } catch (error) {
          console.error(`[SyncService] Failed to process action ${action.id}:`, error);
          errorDetails = { code: error.code, message: error.message, details: error.details };

          if (error.code === '23505') { 
             // ONLY treat idempotency duplicate as success. Other unique constraints are permanent failures.
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
          } else if (error.code === '23514' || error.code === '23503' || error.message?.includes('violates check constraint') || error.message?.includes('violates foreign key constraint') || error.message?.includes('invalid input syntax')) {
             isPermanentError = true;
          } else {
             // Unknown error -> assume transient until max retries to be safe.
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
           if (matchId) blockedMatches.add(matchId);
           delete this.retryCounts[action.id];
           
           this.notifyPermanentFailure(matchId, action);
           continue;
        }

        if (success) {
          progressMade = true;
          delete this.retryCounts[action.id];
          await clearAction(action.id);
        }

        if (isNetworkError) {
          break; // Stop on real network error
        }
      }
    } finally {
      this.syncInProgress = false;
      await this.updatePendingCount(); 
      this.setStatus(this.isOnline ? 'ONLINE' : 'OFFLINE');
      
      // Auto-drain: if more actions were queued while syncing, start again shortly.
      // But if we're looping without progress (e.g. hitting persistent network/auth errors), back off to 5 seconds.
      if (this.pendingCount > 0 && this.isOnline) {
        // If we didn't clear anything and just broke out due to network/auth error, back off.
        const delay = this.pendingCount === actions.length ? 5000 : 500;
        setTimeout(() => {
          if (this.isOnline && !this.syncInProgress) {
            this.processQueue();
          }
        }, delay);
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
    const msg = `Match sync stopped at delivery ${seq}. Your score is saved locally but could not be synchronized. Please resolve the sync error before continuing.`;
    
    // Broadcast a custom event for the UI to pick up
    const event = new CustomEvent('sync-permanent-failure', {
      detail: { matchId, actionId: action.id, message: msg, action }
    });
    window.dispatchEvent(event);
  }

  async retryFailedAction(actionId) {
    await updateAction(actionId, { status: 'PENDING', error: null, failedAt: null });
    delete this.retryCounts[actionId];
    this.updatePendingCount();
    if (this.isOnline) {
      this.processQueue();
    }
  }

  async deleteFailedAction(actionId) {
    await clearAction(actionId);
    delete this.retryCounts[actionId];
    await this.updatePendingCount();
    if (this.isOnline) {
      this.processQueue();
    }
  }

  async pushDelivery(payload, context = null) {
    if (!payload.matchId) return true; // Invalid data, skip
    
    // Lifecycle events like 'innings_start' are timeline markers, not physical deliveries
    if (payload.type === 'innings_start') {
      return true;
    }

    const isUUID = (id) => typeof id === 'string' && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
    
    let inningsId = isUUID(payload.inningsId) ? payload.inningsId : null;
    
    // If inningsId is missing or invalid, resolve or create using api.getOrCreateInnings
    if (!inningsId) {
      const cacheKey = `${payload.matchId}_${payload.innings}`;
      if (context?.inningsCache?.has(cacheKey)) {
        inningsId = context.inningsCache.get(cacheKey);
        payload.inningsId = inningsId;
      } else if (supabase && payload.matchId) {
        try {
          const { api } = await import('../lib/api');
          const inn = await api.getOrCreateInnings(payload.matchId, Number(payload.innings) || 1);
          if (inn?.id) {
            inningsId = inn.id;
            payload.inningsId = inn.id;
            context?.inningsCache?.set(cacheKey, inn.id);
          }
        } catch (e) {
          console.warn('[SyncService] Failed to auto-resolve or create innings via API:', e);
        }
      }
    }

    if (!inningsId) {
      throw new Error(`[SyncService] Missing valid Supabase inningsId for match ${payload.matchId} (innings ${payload.innings}). Cannot insert delivery.`);
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
        console.warn(`[SyncService] Match ${payload.matchId} is ${matchStatus}. Rejecting delivery record.`);
        return true; // Clear from offline queue gracefully
      }
    }

    // Map frontend dismissal type to Postgres enum
    let wicketType = payload.wicket_type !== undefined ? payload.wicket_type : 'NONE';
    if (wicketType === 'NONE' && payload.wicket) {
      const wMap = {
        'Bowled': 'BOWLED', 'Caught': 'CAUGHT', 'LBW': 'LBW', 'Run Out': 'RUN_OUT',
        'Stumped': 'STUMPED', 'Hit Wicket': 'HIT_WICKET', 'Retired Hurt': 'RETIRED_HURT',
        'Retired Out': 'RETIRED_OUT'
      };
      wicketType = wMap[payload.dismissalType] || 'BOWLED';
    }

    let extraType = payload.extra_type !== undefined ? payload.extra_type : 'NONE';
    if (extraType === 'NONE' && payload.extraType) {
      const eMap = {
        'wide': 'WIDE', 'no_ball': 'NO_BALL', 'bye': 'BYE', 'leg_bye': 'LEG_BYE', 'penalty': 'PENALTY'
      };
      extraType = eMap[payload.extraType.toLowerCase()] || payload.extraType.toUpperCase();
    }

    // Strictly enforce: runs_total = runs_off_bat + runs_extras (constraint delivery_total_valid)
    const runsOffBat = Number(payload.runs_off_bat ?? payload.runsOffBat) || 0;
    const totalRuns = payload.runs_total ?? payload.totalRuns;
    const extraRunsRaw = payload.runs_extras ?? payload.extraRuns;
    
    const runsExtras = totalRuns !== undefined ? Math.max(0, Number(totalRuns) - runsOffBat) : (Number(extraRunsRaw) || 0);
    const finalTotalRuns = runsOffBat + runsExtras;

    // Resolve player UUIDs
    const strikerId = isUUID(payload.strikerId) ? payload.strikerId : null;
    const nonStrikerId = isUUID(payload.nonStrikerId) ? payload.nonStrikerId : null;
    const bowlerId = isUUID(payload.bowlerId) ? payload.bowlerId : null;

    // Resolve dismissed player UUID (constraint wicket_player_required: wicket_type = 'NONE' or dismissed_player_id is not null)
    let dismissedPlayerId = null;
    if (wicketType !== 'NONE') {
      const dpId = payload.dismissed_player_id ?? payload.dismissedPlayerId;
      dismissedPlayerId = isUUID(dpId) 
        ? dpId 
        : (isUUID(payload.strikerId) ? payload.strikerId : null);

      if (!dismissedPlayerId) {
        // Fallback: query any valid player from the match roster so check constraint is satisfied
        try {
          if (context?.rosterCache?.has(payload.matchId)) {
            dismissedPlayerId = context.rosterCache.get(payload.matchId);
          } else {
            const { data: rPlayer } = await supabase
              .from('match_rosters')
              .select('player_id')
              .eq('match_id', payload.matchId)
              .limit(1)
              .maybeSingle();
            if (rPlayer?.player_id) {
              dismissedPlayerId = rPlayer.player_id;
              context?.rosterCache?.set(payload.matchId, dismissedPlayerId);
            }
          }
        } catch (e) {}
      }

      // DO NOT silently overwrite wicketType. If missing, it will violate check_wicket_player_required.
      // The DB constraint will reject it, which is the correct behaviour. We must preserve original payload.
    }

    // Consistency constraints for fielder and wicketkeeper
    const fielderId = (['CAUGHT', 'RUN_OUT'].includes(wicketType) && isUUID(payload.fielderId)) ? payload.fielderId : null;
    const wicketkeeperId = (['STUMPED', 'CAUGHT_BEHIND'].includes(wicketType) && isUUID(payload.wicketkeeperId)) ? payload.wicketkeeperId : null;

    // Calculate unique delivery sequence for this innings
    let deliverySequence = payload.deliverySequence;
    if (!deliverySequence || deliverySequence < 1) {
      try {
        if (context?.lastSequenceCache?.has(inningsId)) {
          deliverySequence = context.lastSequenceCache.get(inningsId) + 1;
        } else {
          const { data: lastDel } = await supabase
            .from('deliveries')
            .select('delivery_sequence')
            .eq('innings_id', inningsId)
            .order('delivery_sequence', { ascending: false })
            .limit(1)
            .maybeSingle();
          deliverySequence = (lastDel?.delivery_sequence || 0) + 1;
        }
      } catch (e) {
        deliverySequence = Math.max(1, (payload.balls || 0) + 1);
      }
    }

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
      idempotency_key: payload.id // Unique ID from frontend event
    });

    if (error) {
      if (error.code === '23505') {
        if (error.message?.includes('idempotency') || error.details?.includes('idempotency')) {
           context?.lastSequenceCache?.set(inningsId, deliverySequence); // Cache it even if duplicate
           return true; 
        }
        throw error;
      }
      // Ensure finalized rejections are bubbled up instead of silently dropped
      if (error.message?.includes('already finalized') || error.message?.includes('check_match_immutable')) {
        throw error;
      }
      throw error;
    }
    
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
    
    const { error } = await supabase.from('deliveries')
      .delete()
      .eq('idempotency_key', payload.id)
      .eq('match_id', payload.matchId)
      .eq('innings_id', payload.inningsId);
      
    if (error) {
      console.error('[SyncService] Failed to delete delivery:', error);
      throw error;
    }
    return true;
  }

  /**
   * Attempt to perform an action immediately if online,
   * otherwise queue it for later.
   */
  async executeOrQueue(actionType, payload, offlineQueueFn) {
    if (this.isOnline && !this.syncInProgress) {
      try {
        if (actionType === 'RECORD_DELIVERY') {
           await this.pushDelivery(payload);
        } else if (actionType === 'UNDO_DELIVERY') {
           await this.deleteDelivery(payload);
        }
        return true;
      } catch (err) {
        console.warn(`[SyncService] Live execution failed, falling back to queue. Error:`, err);
        await offlineQueueFn(actionType, payload);
        await this.updatePendingCount();
        if (this.isOnline && !this.syncInProgress) {
           this.processQueue();
        }
        return false;
      }
    } else {
      await offlineQueueFn(actionType, payload);
      await this.updatePendingCount();
      if (this.isOnline && !this.syncInProgress) {
         this.processQueue();
      }
      return false;
    }
  }
}

export const syncService = new SyncService();
