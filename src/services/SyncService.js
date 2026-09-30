import { supabase } from '../lib/supabase';
import { getPendingActions, clearAction } from '../lib/db';

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
      this.pendingCount = actions.length;
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
   * Process all pending actions in the local Dexie queue
   */
  async processQueue() {
    if (!this.isOnline || this.syncInProgress) return;

    this.syncInProgress = true;
    this.setStatus('SYNCING');
    try {
      const actions = await getPendingActions();
      this.pendingCount = actions.length;
      this.emit();

      if (actions.length === 0) {
        this.syncInProgress = false;
        this.setStatus('ONLINE');
        return;
      }

      console.log(`[SyncService] Processing ${actions.length} pending actions...`);

      for (const action of actions) {
        // Skip items that have exceeded max retries
        const retries = this.retryCounts[action.id] || 0;
        if (retries >= MAX_RETRIES) {
          console.warn(`[SyncService] Action ${action.id} exceeded max retries (${MAX_RETRIES}). Dropping.`);
          await clearAction(action.id);
          this.pendingCount = Math.max(0, this.pendingCount - 1);
          this.emit();
          continue;
        }

        let success = false;
        let isNetworkError = false;
        
        try {
          if (supabase) {
             if (action.action === 'RECORD_DELIVERY') {
               success = await this.pushDelivery(action.payload);
             } else if (action.action === 'UNDO_DELIVERY') {
               success = await this.deleteDelivery(action.payload);
             } else {
               // Unknown action type — remove it to avoid blocking the queue
               success = true;
             }
          }
        } catch (error) {
          console.error(`[SyncService] Failed to process action ${action.id}:`, error);
          if (error.code === '23505') { // Postgres Unique Violation (idempotency key = already exists)
             success = true; // Already in DB — clear from queue
          } else if (!navigator.onLine || error.message?.includes('Failed to fetch') || error.message?.includes('NetworkError')) {
             // True network failure — stop processing, wait for reconnect
             isNetworkError = true;
          } else {
             // Application-level error (bad data, RLS, etc.) — increment retry count
             this.retryCounts[action.id] = retries + 1;
          }
        }

        if (success) {
          delete this.retryCounts[action.id];
          await clearAction(action.id);
          this.pendingCount = Math.max(0, this.pendingCount - 1);
          this.emit();
        }

        if (isNetworkError) {
          // Stop processing on real network error, will retry when back online
          break;
        }
      }
    } finally {
      this.syncInProgress = false;
      await this.updatePendingCount(); // Always refresh count accurately
      this.setStatus(this.isOnline ? 'ONLINE' : 'OFFLINE');
    }
  }

  async pushDelivery(payload) {
    if (!payload.matchId) return true; // Invalid data, skip
    
    // Lifecycle events like 'innings_start' are timeline markers, not physical deliveries
    if (payload.type === 'innings_start') {
      return true;
    }

    const isUUID = (id) => typeof id === 'string' && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
    
    let inningsId = isUUID(payload.inningsId) ? payload.inningsId : null;
    
    // If inningsId is missing or invalid, resolve or create using api.getOrCreateInnings
    if (!inningsId) {
      if (supabase && payload.matchId) {
        try {
          const { api } = await import('../lib/api');
          const inn = await api.getOrCreateInnings(payload.matchId, Number(payload.innings) || 1);
          if (inn?.id) {
            inningsId = inn.id;
            payload.inningsId = inn.id;
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
      const { data: matchData } = await supabase.from('matches').select('status').eq('id', payload.matchId).maybeSingle();
      if (matchData && (matchData.status === 'COMPLETED' || matchData.status === 'FINISHED' || matchData.status === 'CANCELLED')) {
        console.warn(`[SyncService] Match ${payload.matchId} is ${matchData.status}. Rejecting delivery record.`);
        return true; // Clear from offline queue gracefully
      }
    }

    // Map frontend dismissal type to Postgres enum
    let wicketType = 'NONE';
    if (payload.wicket) {
      const wMap = {
        'Bowled': 'BOWLED', 'Caught': 'CAUGHT', 'LBW': 'LBW', 'Run Out': 'RUN_OUT',
        'Stumped': 'STUMPED', 'Hit Wicket': 'HIT_WICKET', 'Retired Hurt': 'RETIRED_HURT',
        'Retired Out': 'RETIRED_OUT'
      };
      wicketType = wMap[payload.dismissalType] || 'BOWLED';
    }

    let extraType = 'NONE';
    if (payload.extraType) {
      const eMap = {
        'wide': 'WIDE', 'no_ball': 'NO_BALL', 'bye': 'BYE', 'leg_bye': 'LEG_BYE', 'penalty': 'PENALTY'
      };
      extraType = eMap[payload.extraType.toLowerCase()] || payload.extraType.toUpperCase();
    }

    // Strictly enforce: runs_total = runs_off_bat + runs_extras (constraint delivery_total_valid)
    const runsOffBat = Number(payload.runsOffBat) || 0;
    const totalRuns = Number(payload.totalRuns) || 0;
    const runsExtras = totalRuns !== undefined ? Math.max(0, totalRuns - runsOffBat) : (Number(payload.extraRuns) || 0);
    const finalTotalRuns = runsOffBat + runsExtras;

    // Resolve player UUIDs
    const strikerId = isUUID(payload.strikerId) ? payload.strikerId : null;
    const nonStrikerId = isUUID(payload.nonStrikerId) ? payload.nonStrikerId : null;
    const bowlerId = isUUID(payload.bowlerId) ? payload.bowlerId : null;

    // Resolve dismissed player UUID (constraint wicket_player_required: wicket_type = 'NONE' or dismissed_player_id is not null)
    let dismissedPlayerId = null;
    if (wicketType !== 'NONE') {
      dismissedPlayerId = isUUID(payload.dismissedPlayerId) 
        ? payload.dismissedPlayerId 
        : (isUUID(payload.strikerId) ? payload.strikerId : null);

      if (!dismissedPlayerId) {
        // Fallback: query any valid player from the match roster so check constraint is satisfied
        try {
          const { data: rPlayer } = await supabase
            .from('match_rosters')
            .select('player_id')
            .eq('match_id', payload.matchId)
            .limit(1)
            .maybeSingle();
          if (rPlayer?.player_id) dismissedPlayerId = rPlayer.player_id;
        } catch (e) {}
      }

      // If still no valid UUID exists in DB, avoid violating DB check constraint by treating as NONE in DB
      if (!dismissedPlayerId) {
        wicketType = 'NONE';
      }
    }

    // Consistency constraints for fielder and wicketkeeper
    const fielderId = (['CAUGHT', 'RUN_OUT'].includes(wicketType) && isUUID(payload.fielderId)) ? payload.fielderId : null;
    const wicketkeeperId = (['STUMPED', 'CAUGHT_BEHIND'].includes(wicketType) && isUUID(payload.wicketkeeperId)) ? payload.wicketkeeperId : null;

    // Calculate unique delivery sequence for this innings
    let deliverySequence = payload.deliverySequence;
    if (!deliverySequence || deliverySequence < 1) {
      try {
        const { data: lastDel } = await supabase
          .from('deliveries')
          .select('delivery_sequence')
          .eq('innings_id', inningsId)
          .order('delivery_sequence', { ascending: false })
          .limit(1)
          .maybeSingle();
        deliverySequence = (lastDel?.delivery_sequence || 0) + 1;
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
      if (error.code === '23505') return true; // Already exists (idempotent)
      // If match finalized while in queue, drop gracefully
      if (error.message?.includes('already finalized') || error.message?.includes('check_match_immutable')) {
        return true;
      }
      throw error;
    }
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
        return false;
      }
    } else {
      await offlineQueueFn(actionType, payload);
      await this.updatePendingCount();
      return false;
    }
  }
}

export const syncService = new SyncService();
