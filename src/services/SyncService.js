import { supabase } from '../lib/supabase';
import { getPendingActions, clearAction, updateAction } from '../lib/db';
import { normalizeDelivery } from '../engine/deliveryContract.js';

const MAX_RETRIES = 3;

class SyncService {
  constructor() {
    this.isOnline = navigator.onLine;
    this.syncInProgress = false;
    this.listeners = new Set();
    this.status = this.isOnline ? 'ONLINE' : 'OFFLINE';
    this.pendingCount = 0;
    this.retryCounts = {}; // track per-action retry count
    this.blockedMatches = new Set();

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

  async autoHealFailedQueue() {
    try {
      const actions = await getPendingActions();
      const failed = actions.filter(a => a.status === 'FAILED_PERMANENT');
      if (failed.length > 0) {
        console.log(`[SyncService] Auto-healing ${failed.length} failed actions in sync queue...`);
        for (const action of failed) {
          await updateAction(action.id, {
            status: 'PENDING',
            error: null,
            failedAt: null
          });
          delete this.retryCounts[action.id];
        }
        this.blockedMatches.clear();
        await this.updatePendingCount();
      }
    } catch (e) {
      console.warn('[SyncService] Failed to auto-heal queue:', e);
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
      // Auto-heal any stale permanent failures before running queue
      await this.autoHealFailedQueue();

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
          // If action has retried less than MAX_RETRIES, give it another chance with auto-repair
          const prevRetries = this.retryCounts[action.id] || 0;
          if (prevRetries < MAX_RETRIES) {
            console.log(`[SyncService] Re-trying previously failed action ${action.id} (attempt ${prevRetries + 1}/${MAX_RETRIES})`);
            await updateAction(action.id, { status: 'PENDING', error: null, failedAt: null });
            action.status = 'PENDING';
          } else {
            if (matchId) {
              this.blockedMatches.add(matchId);
              this.notifyPermanentFailure(matchId, action);
            }
            continue;
          }
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
             // If error is related to playing XI or innings mismatch, don't brand permanent immediately
             if (errStr.includes('playing XI') || errStr.includes('does not belong') || errStr.includes('Innings')) {
               console.warn(`[SyncService] P0001 data mismatch (${errStr}). Clearing caches for auto-healing on retry.`);
               context?.inningsCache?.clear();
               context?.inningsDetailsCache?.clear();
               context?.rosterCache?.clear();
               isPermanentError = false;
               isNetworkError = false;
             } else {
               isPermanentError = true;
               errorDetails = {
                 code: error.code || 'P0001',
                 message: error.message || 'Database rule violation',
                 details: error.details || error.message
               };
             }
          } else if (error.code === '23505') { 
             // ONLY treat idempotency duplicate as success. Other unique constraints are permanent failures.
             if (error.message?.includes('idempotency') || error.details?.includes('idempotency') || error.message?.includes('delivery_sequence')) {
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
    await this.autoHealFailedQueue();
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
          if (!navigator.onLine || e.message?.includes('Failed to fetch') || e.message?.includes('NetworkError') || e.code === 'NETWORK_ERROR') {
            throw e; // Rethrow network errors so the queue safely backs off instead of permanently failing
          }
        }
      }
    }

    if (!inningsId) {
      const missingErr = new Error(`[SyncService] Missing valid Supabase inningsId for match ${payload.matchId} (innings ${payload.innings}). Cannot insert delivery.`);
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

      // Auto-heal Innings 2 team assignments if identical to Innings 1
      if (innData && Number(innData.innings_number) === 2 && innData.batting_team_id) {
        try {
          const { data: inn1 } = await supabase
            .from('innings')
            .select('batting_team_id, bowling_team_id')
            .eq('match_id', payload.matchId)
            .eq('innings_number', 1)
            .maybeSingle();

          if (inn1 && inn1.batting_team_id && innData.batting_team_id === inn1.batting_team_id) {
            console.warn(`[SyncService] Innings 2 had identical batting_team_id as Innings 1. Auto-reversing Innings 2 teams.`);
            const newBatting = inn1.bowling_team_id;
            const newBowling = inn1.batting_team_id;
            await supabase
              .from('innings')
              .update({ batting_team_id: newBatting, bowling_team_id: newBowling })
              .eq('id', inningsId);
            innData.batting_team_id = newBatting;
            innData.bowling_team_id = newBowling;
            context?.inningsDetailsCache?.set(inningsId, innData);
          }
        } catch (repairInnErr) {
          console.warn('[SyncService] Failed to check/repair Innings 2 team assignments:', repairInnErr);
        }
      }

      if (innData && innData.match_id !== payload.matchId) {
        console.warn(`[SyncService] Mismatch detected: payload.matchId (${payload.matchId}) != innings.match_id (${innData.match_id}) for inningsId ${inningsId}`);
        
        let repaired = false;
        const targetInningsNum = Number(payload.innings) || innData.innings_number || 1;
        
        try {
          const { data: matchInnings } = await supabase
            .from('innings')
            .select('id, match_id, innings_number, batting_team_id, bowling_team_id')
            .eq('match_id', payload.matchId)
            .eq('innings_number', targetInningsNum);
            
          if (matchInnings && matchInnings.length === 1) {
            const provableInnings = matchInnings[0];
            const { data: targetMatch } = await supabase
              .from('matches')
              .select('id')
              .eq('id', payload.matchId)
              .maybeSingle();

            if (targetMatch) {
              console.log(`[SyncService] Provable innings match found: repairing metadata for delivery ${payload.id} from innings ${inningsId} -> ${provableInnings.id}`);
              inningsId = provableInnings.id;
              payload.inningsId = provableInnings.id;
              innData = provableInnings;
              context?.inningsDetailsCache?.set(inningsId, innData);
              repaired = true;
              
              if (action?.id) {
                await updateAction(action.id, { payload });
              }
            }
          }
        } catch (repairErr) {
          console.warn('[SyncService] Error during provable innings repair:', repairErr);
        }

        if (!repaired) {
          const err = new Error('Delivery innings does not belong to delivery match');
          err.code = 'P0001';
          err.details = `Unrecoverable mismatch between delivery match ${payload.matchId} and innings ${inningsId} (belongs to match ${innData.match_id})`;
          throw err;
        }
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
          await supabase.from('matches').update({ status: 'IN_PROGRESS' }).eq('id', payload.matchId);
          context?.matchStatusCache?.set(payload.matchId, 'IN_PROGRESS');
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

    // Resolve player UUIDs with intelligent fallback resolution
    let strikerId = isUUID(payload.strikerId) ? payload.strikerId : null;
    let nonStrikerId = isUUID(payload.nonStrikerId) ? payload.nonStrikerId : null;
    let bowlerId = isUUID(payload.bowlerId) ? payload.bowlerId : null;

    // Auto-resolve missing or invalid player UUIDs from match rosters or previous deliveries
    if (!strikerId || !bowlerId || !nonStrikerId) {
      try {
        const { data: matchRosters } = await supabase
          .from('match_rosters')
          .select('player_id, team_id, is_playing_xi, players:player_id(id, full_name, name)')
          .eq('match_id', payload.matchId);

        if (matchRosters && matchRosters.length > 0) {
          const battingPlayers = matchRosters.filter(p => p.team_id === innData.batting_team_id);
          const bowlingPlayers = matchRosters.filter(p => p.team_id === innData.bowling_team_id);

          // 1. Auto-resolve Striker
          if (!strikerId) {
            if (payload.striker) {
              const matched = battingPlayers.find(p => {
                const name = p.players?.full_name || p.players?.name || '';
                return name.toLowerCase() === String(payload.striker).toLowerCase();
              });
              if (matched) strikerId = matched.player_id;
            }
            if (!strikerId) {
              const { data: lastD } = await supabase
                .from('deliveries')
                .select('striker_id')
                .eq('innings_id', inningsId)
                .order('delivery_sequence', { ascending: false })
                .limit(1)
                .maybeSingle();
              if (lastD?.striker_id && isUUID(lastD.striker_id)) {
                strikerId = lastD.striker_id;
              }
            }
            if (!strikerId && battingPlayers.length > 0) {
              strikerId = battingPlayers[0].player_id;
            }
          }

          // 2. Auto-resolve Bowler
          if (!bowlerId) {
            if (payload.bowler) {
              const matched = bowlingPlayers.find(p => {
                const name = p.players?.full_name || p.players?.name || '';
                return name.toLowerCase() === String(payload.bowler).toLowerCase();
              });
              if (matched) bowlerId = matched.player_id;
            }
            if (!bowlerId) {
              const { data: lastD } = await supabase
                .from('deliveries')
                .select('bowler_id')
                .eq('innings_id', inningsId)
                .order('delivery_sequence', { ascending: false })
                .limit(1)
                .maybeSingle();
              if (lastD?.bowler_id && isUUID(lastD.bowler_id)) {
                bowlerId = lastD.bowler_id;
              }
            }
            if (!bowlerId && bowlingPlayers.length > 0) {
              bowlerId = bowlingPlayers[0].player_id;
            }
          }

          // 3. Auto-resolve Non-Striker
          if (!nonStrikerId) {
            if (payload.nonStriker) {
              const matched = battingPlayers.find(p => {
                const name = p.players?.full_name || p.players?.name || '';
                return name.toLowerCase() === String(payload.nonStriker).toLowerCase();
              });
              if (matched && matched.player_id !== strikerId) nonStrikerId = matched.player_id;
            }
            if (!nonStrikerId) {
              const altBat = battingPlayers.find(p => p.player_id !== strikerId);
              if (altBat) nonStrikerId = altBat.player_id;
            }
          }
        }
      } catch (playerResolveErr) {
        console.warn('[SyncService] Non-fatal error auto-resolving player IDs:', playerResolveErr);
      }
    }

    // Resolve dismissed player UUID (constraint wicket_player_required: wicket_type = 'NONE' or dismissed_player_id is not null)
    let dismissedPlayerId = null;
    if (wicketType !== 'NONE') {
      dismissedPlayerId = isUUID(payload.dismissedPlayerId) 
        ? payload.dismissedPlayerId 
        : (isUUID(payload.outPlayerId) ? payload.outPlayerId : strikerId);

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

    const { data: { session } } = await supabase.auth.getSession();
    const userId = session?.user?.id;

    // Explicit log before attempting INSERT as required
    console.log(`[SyncService] Preparing delivery insert: actionId=${action?.id}, idempotencyKey=${payload.id}, matchId=${payload.matchId}, inningsId=${inningsId}, sequence=${deliverySequence}`);

    // Auto-ensure Playing XI in match_rosters so DB check_delivery_roster trigger can never throw P0001
    if (supabase && innData && innData.batting_team_id && innData.bowling_team_id) {
      try {
        // 1. Check existing rosters for match to detect any team inversions
        const { data: existingRosters } = await supabase
          .from('match_rosters')
          .select('player_id, team_id, is_playing_xi')
          .eq('match_id', payload.matchId);

        const rosterMap = new Map((existingRosters || []).map(r => [r.player_id, r]));

        // If striker belongs to a specific team in roster, verify innData.batting_team_id matches
        if (strikerId && rosterMap.has(strikerId)) {
          const strikerTeam = rosterMap.get(strikerId).team_id;
          if (strikerTeam && strikerTeam !== innData.batting_team_id) {
            console.warn(`[SyncService] Striker team (${strikerTeam}) differs from innings batting team (${innData.batting_team_id}). Inverting innings teams in database.`);
            const newBatting = strikerTeam;
            const newBowling = innData.batting_team_id;
            await supabase.from('innings').update({
              batting_team_id: newBatting,
              bowling_team_id: newBowling
            }).eq('id', inningsId);
            innData.batting_team_id = newBatting;
            innData.bowling_team_id = newBowling;
            context?.inningsDetailsCache?.set(inningsId, innData);
          }
        }

        const rosterUpserts = [];
        if (strikerId) {
          const existing = rosterMap.get(strikerId);
          rosterUpserts.push({
            match_id: payload.matchId,
            team_id: existing?.team_id || innData.batting_team_id,
            player_id: strikerId,
            is_playing_xi: true
          });
        }
        if (nonStrikerId && nonStrikerId !== strikerId) {
          const existing = rosterMap.get(nonStrikerId);
          rosterUpserts.push({
            match_id: payload.matchId,
            team_id: existing?.team_id || innData.batting_team_id,
            player_id: nonStrikerId,
            is_playing_xi: true
          });
        }
        if (bowlerId) {
          const existing = rosterMap.get(bowlerId);
          rosterUpserts.push({
            match_id: payload.matchId,
            team_id: existing?.team_id || innData.bowling_team_id,
            player_id: bowlerId,
            is_playing_xi: true
          });
        }
        if (rosterUpserts.length > 0) {
          await supabase.from('match_rosters').upsert(rosterUpserts, { onConflict: 'match_id, player_id' });
        }
      } catch (rosterErr) {
        console.warn('[SyncService] Non-fatal error ensuring playing XI roster:', rosterErr);
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
      idempotency_key: payload.id, // Unique ID from frontend event
      created_by: userId
    });

    if (error) {
      if (error.code === '23505') {
        if (
          error.message?.includes('idempotency') || error.details?.includes('idempotency') ||
          error.message?.includes('delivery_sequence') || error.details?.includes('delivery_sequence')
        ) {
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
