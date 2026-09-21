import { supabase } from '../lib/supabase';
import { getPendingActions, clearAction } from '../lib/db';

class SyncService {
  constructor() {
    this.isOnline = navigator.onLine;
    this.syncInProgress = false;
    this.listeners = new Set();
    this.status = this.isOnline ? 'ONLINE' : 'OFFLINE';
    this.pendingCount = 0;

    // Listen for network changes
    window.addEventListener('online', () => this.handleOnline());
    window.addEventListener('offline', () => this.handleOffline());
    
    // Initial fetch of pending count
    this.updatePendingCount();
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
        let success = false;
        
        try {
          if (supabase) {
             if (action.action === 'RECORD_DELIVERY') {
               success = await this.pushDelivery(action.payload);
             } else {
               // Fallback for other potential actions
               success = true;
             }
          }
        } catch (error) {
          console.error(`[SyncService] Failed to process action ${action.id}:`, error);
          if (error.code === '23505') { // Postgres Unique Violation (idempotency key)
             success = true; // Mark as success since it's already there
          } else {
             break; // Network/5xx error, stop processing
          }
        }

        if (success) {
          await clearAction(action.id);
          this.pendingCount = Math.max(0, this.pendingCount - 1);
          this.emit();
        }
      }
    } finally {
      this.syncInProgress = false;
      this.setStatus(this.isOnline ? 'ONLINE' : 'OFFLINE');
      this.updatePendingCount();
    }
  }

  async pushDelivery(payload) {
    if (!payload.matchId || !payload.innings) return true; // Invalid data, skip
    
    let inningsId = payload.inningsId;
    // If inningsId is missing or mistakenly set to matchId, attempt to resolve the real innings UUID from Supabase
    if (!inningsId || inningsId === payload.matchId) {
      if (supabase && payload.matchId && payload.innings) {
        try {
          const { data: inn } = await supabase
            .from('innings')
            .select('id')
            .eq('match_id', payload.matchId)
            .eq('innings_number', Number(payload.innings) || 1)
            .maybeSingle();
          if (inn?.id) {
            inningsId = inn.id;
            payload.inningsId = inn.id;
          }
        } catch (e) {
          console.warn('[SyncService] Failed to auto-resolve inningsId:', e);
        }
      }
    }

    if (!inningsId || inningsId === payload.matchId) {
      throw new Error(`[SyncService] Missing valid Supabase inningsId for match ${payload.matchId} (innings ${payload.innings}). Cannot insert delivery.`);
    }

    // We map frontend `wicket` type to Postgres enum `wicket_type`
    let wicketType = 'NONE';
    if (payload.wicket) {
      // Simplistic mapping for now
      const wMap = {
        'Bowled': 'BOWLED', 'Caught': 'CAUGHT', 'LBW': 'LBW', 'Run Out': 'RUN_OUT',
        'Stumped': 'STUMPED', 'Hit Wicket': 'HIT_WICKET', 'Retired Hurt': 'RETIRED_HURT',
        'Retired Out': 'RETIRED_OUT'
      };
      wicketType = wMap[payload.dismissalType] || 'NONE';
    }

    let extraType = 'NONE';
    if (payload.extraType) {
      extraType = payload.extraType.toUpperCase();
    }

    const { error } = await supabase.from('deliveries').insert({
      match_id: payload.matchId,
      innings_id: inningsId,
      delivery_sequence: payload.balls || 1, // Fallback
      over_number: Math.floor((payload.balls || 0) / 6),
      ball_number: ((payload.balls || 0) % 6) + 1,
      striker_id: String(payload.strikerId).startsWith('player-') ? null : payload.strikerId,
      non_striker_id: String(payload.nonStrikerId).startsWith('player-') ? null : payload.nonStrikerId,
      bowler_id: String(payload.bowlerId).startsWith('player-') ? null : payload.bowlerId,
      runs_off_bat: payload.runsOffBat || 0,
      runs_extras: payload.extraRuns || 0,
      runs_total: payload.totalRuns || 0,
      extra_type: extraType,
      wicket_type: wicketType,
      wagon_zone: payload.wagonZone || null,
      idempotency_key: payload.id // Unique ID from frontend event
    });

    if (error) {
      if (error.code === '23505') return true; // Already exists
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
        }
        console.log(`[SyncService] Executed live: ${actionType}`);
        return true;
      } catch (err) {
        console.warn(`[SyncService] Live execution failed, falling back to queue. Error:`, err);
        await offlineQueueFn(actionType, payload);
        this.updatePendingCount();
        return false;
      }
    } else {
      await offlineQueueFn(actionType, payload);
      this.updatePendingCount();
      return false;
    }
  }
}

export const syncService = new SyncService();
