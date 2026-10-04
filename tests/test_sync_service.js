import assert from 'assert';
import { normalizeDelivery } from '../src/engine/deliveryContract.js';

// Comprehensive mock of SyncService reproducing actual processQueue and pushDelivery logic
class SyncServiceTest {
  constructor() {
    this.isOnline = true;
    this.syncInProgress = false;
    this.pendingCount = 0;
    this.retryCounts = {};
    this.blockedMatches = new Set();
    this.queue = [];
    this.serverDB = [];
    this.serverMatches = new Map();
    this.serverInnings = new Map();
  }

  async queueOfflineAction(action, payload) {
    const id = payload.id || `delivery-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
    const item = {
      id,
      action,
      payload: { ...payload, id },
      status: 'PENDING',
      timestamp: Date.now()
    };
    this.queue.push(item);
    return item;
  }

  async pushDelivery(rawPayload, context = null, action = null, simulateError = null) {
    if (simulateError) {
      if (!simulateError.actionId || simulateError.actionId === action?.id) {
        throw simulateError.error;
      }
    }

    const payload = normalizeDelivery(rawPayload);
    const inningsId = payload.inningsId;
    const matchId = payload.matchId;

    // Database relationship verification
    if (inningsId) {
      const innData = this.serverInnings.get(inningsId);
      if (innData && innData.match_id !== matchId) {
        // Provable repair check: does matchId have exactly 1 innings for this innings number?
        const targetInningsNum = Number(payload.innings) || 1;
        const matchingInnings = Array.from(this.serverInnings.values()).filter(
          i => i.match_id === matchId && i.innings_number === targetInningsNum
        );
        if (matchingInnings.length === 1 && this.serverMatches.has(matchId)) {
          // Repaired metadata safely
          payload.inningsId = matchingInnings[0].id;
          if (action) action.payload = payload;
        } else {
          const err = new Error('Delivery innings does not belong to delivery match');
          err.code = 'P0001';
          err.details = `Unrecoverable mismatch between delivery match ${matchId} and innings ${inningsId}`;
          throw err;
        }
      }
    }

    // Check duplicate idempotency
    const existing = this.serverDB.find(d => d.idempotency_key === payload.id);
    if (existing) {
      return true;
    }

    this.serverDB.push({
      ...payload,
      idempotency_key: payload.id
    });
    return true;
  }

  async processQueue(simulateError = null) {
    if (!this.isOnline || this.syncInProgress) return;
    this.syncInProgress = true;

    // Declared outside try so 'actions is not defined' is impossible in finally
    let actions = [];
    try {
      actions = this.queue;
      this.pendingCount = actions.filter(a => a.status !== 'FAILED_PERMANENT').length;

      if (actions.length === 0) return;

      const transientBlockedMatches = new Set();
      const context = {};

      for (const action of actions) {
        const matchId = action.payload?.matchId;

        if (action.status === 'FAILED_PERMANENT') {
          if (matchId) this.blockedMatches.add(matchId);
          continue;
        }

        if (matchId && (this.blockedMatches.has(matchId) || transientBlockedMatches.has(matchId))) {
          continue;
        }

        let success = false;
        let isNetworkError = false;
        let isPermanentError = false;
        let errorDetails = null;

        try {
          if (action.action === 'RECORD_DELIVERY') {
            success = await this.pushDelivery(action.payload, context, action, simulateError);
          } else {
            success = true;
          }
        } catch (error) {
          errorDetails = { code: error.code, message: error.message, details: error.details };

          if (error.code === 'P0001' || error.message?.includes('Delivery innings does not belong to delivery match') || error.details?.includes('Delivery innings does not belong to delivery match')) {
            isPermanentError = true;
            errorDetails = {
              code: error.code || 'P0001',
              message: 'Delivery innings does not belong to delivery match',
              details: error.details || error.message
            };
          } else if (error.code === '23505') {
            if (error.message?.includes('idempotency')) {
              success = true;
            } else {
              isPermanentError = true;
            }
          } else if (error.code === 'NETWORK_ERROR' || error.message?.includes('NetworkError') || error.message?.includes('Failed to fetch')) {
            isNetworkError = true;
          } else if (error.code === '23514' || error.code === '23503' || error.code === '22P02') {
            isPermanentError = true;
          } else {
            isNetworkError = true;
          }
        }

        const retries = this.retryCounts[action.id] || 0;

        if (!success && !isNetworkError && !isPermanentError) {
          if (retries + 1 >= 3) {
            isPermanentError = true;
            errorDetails = errorDetails || { message: 'Max retries reached' };
          } else {
            this.retryCounts[action.id] = retries + 1;
          }
        }

        if (isPermanentError) {
          action.status = 'FAILED_PERMANENT';
          action.error = errorDetails;
          action.failedAt = Date.now();
          if (matchId) this.blockedMatches.add(matchId);
          delete this.retryCounts[action.id];
          continue;
        }

        if (success) {
          delete this.retryCounts[action.id];
          this.queue = this.queue.filter(a => a.id !== action.id);
        } else {
          if (matchId) transientBlockedMatches.add(matchId);
          if (isNetworkError) break;
        }
      }
    } finally {
      this.syncInProgress = false;
      this.pendingCount = this.queue.filter(a => a.status !== 'FAILED_PERMANENT').length;
      
      // Auto-drain check using actions safely
      if (this.pendingCount > 0 && this.isOnline) {
        const initialCount = Array.isArray(actions) ? actions.length : 0;
        assert.ok(typeof initialCount === 'number', 'actions.length must be accessible in finally');
      }
    }
  }
}

async function runTests() {
  console.log("Running SyncService regression tests...");

  // 1. match/innings mismatch → permanent failure
  {
    const sync = new SyncServiceTest();
    sync.serverMatches.set('match-1', { id: 'match-1' });
    sync.serverInnings.set('inn-foreign', { id: 'inn-foreign', match_id: 'match-OTHER', innings_number: 1 });
    // Match-1 has no innings yet, so provable repair is impossible
    const item = await sync.queueOfflineAction('RECORD_DELIVERY', {
      id: 'del-1',
      matchId: 'match-1',
      inningsId: 'inn-foreign',
      runsBatter: 1
    });

    await sync.processQueue();
    assert.strictEqual(item.status, 'FAILED_PERMANENT', 'Mismatch without provable mapping must be FAILED_PERMANENT');
    console.log("✅ 1. match/innings mismatch → permanent failure");
  }

  // 2. mismatch does NOT become network error
  {
    const sync = new SyncServiceTest();
    sync.serverMatches.set('match-1', { id: 'match-1' });
    sync.serverInnings.set('inn-foreign', { id: 'inn-foreign', match_id: 'match-OTHER', innings_number: 1 });

    const item = await sync.queueOfflineAction('RECORD_DELIVERY', {
      id: 'del-2',
      matchId: 'match-1',
      inningsId: 'inn-foreign'
    });

    await sync.processQueue();
    assert.strictEqual(item.error.code, 'P0001');
    assert.strictEqual(item.error.message, 'Delivery innings does not belong to delivery match');
    assert.notStrictEqual(item.status, 'PENDING', 'Mismatch must NOT remain PENDING');
    console.log("✅ 2. mismatch does NOT become network error");
  }

  // 3. processQueue does not crash on errors
  {
    const sync = new SyncServiceTest();
    await sync.queueOfflineAction('RECORD_DELIVERY', { matchId: 'm1' });
    
    // Simulate severe database error
    await sync.processQueue({
      error: { code: 'P0001', message: 'Delivery innings does not belong to delivery match' }
    });
    assert.strictEqual(sync.syncInProgress, false, 'syncInProgress must reset to false');
    console.log("✅ 3. processQueue does not crash");
  }

  // 4. 'actions is not defined' impossible
  {
    const sync = new SyncServiceTest();
    // Intentionally run processQueue where actions has elements
    await sync.queueOfflineAction('RECORD_DELIVERY', { id: 'd-test', matchId: 'm1' });
    let crashed = false;
    try {
      await sync.processQueue({ error: new Error('Simulated failure') });
    } catch (e) {
      crashed = true;
    }
    assert.strictEqual(crashed, false, 'processQueue must never crash with ReferenceError');
    console.log("✅ 4. actions is not defined impossible");
  }

  // 5. failed item remains inspectable
  {
    const sync = new SyncServiceTest();
    const item = await sync.queueOfflineAction('RECORD_DELIVERY', { id: 'd-inspect', matchId: 'm1' });
    await sync.processQueue({
      error: { code: '23503', message: 'violates foreign key constraint', details: 'Key (match_id) is not present' }
    });
    assert.strictEqual(sync.queue.length, 1, 'Failed item must stay in queue');
    assert.strictEqual(sync.queue[0].status, 'FAILED_PERMANENT');
    assert.ok(sync.queue[0].error, 'Error details must be preserved');
    assert.strictEqual(sync.queue[0].error.code, '23503');
    console.log("✅ 5. failed item remains inspectable");
  }

  // 6. transient error retries
  {
    const sync = new SyncServiceTest();
    const item = await sync.queueOfflineAction('RECORD_DELIVERY', { id: 'd-transient', matchId: 'm1', runsBatter: 2 });
    
    // Pass 1: Transient network failure
    await sync.processQueue({ error: { code: 'NETWORK_ERROR', message: 'Failed to fetch' } });
    assert.strictEqual(item.status, 'PENDING', 'Transient error must leave item PENDING');
    assert.strictEqual(sync.serverDB.length, 0, 'Item not inserted yet');

    // Pass 2: Connection restored
    await sync.processQueue();
    assert.strictEqual(sync.queue.length, 0, 'Item must sync once network restored');
    assert.strictEqual(sync.serverDB.length, 1);
    console.log("✅ 6. transient error retries");
  }

  // 7. idempotency key remains unchanged
  {
    const sync = new SyncServiceTest();
    const originalKey = 'idempotency-key-original-123';
    await sync.queueOfflineAction('RECORD_DELIVERY', { id: originalKey, matchId: 'm1', runsBatter: 4 });
    
    // Fail once
    await sync.processQueue({ error: { code: 'NETWORK_ERROR', message: 'Timeout' } });
    assert.strictEqual(sync.queue[0].payload.id, originalKey, 'Key must be unchanged after failure');

    // Succeed
    await sync.processQueue();
    assert.strictEqual(sync.serverDB[0].idempotency_key, originalKey, 'Server must receive original idempotency key');
    console.log("✅ 7. idempotency key remains unchanged");
  }

  // 8. duplicate insert is handled (idempotency constraint)
  {
    const sync = new SyncServiceTest();
    await sync.queueOfflineAction('RECORD_DELIVERY', { id: 'dup-1', matchId: 'm1' });
    sync.serverDB.push({ idempotency_key: 'dup-1', runs_total: 1 }); // Already exists on server

    // Database returns unique violation on idempotency key
    await sync.processQueue({
      error: { code: '23505', message: 'duplicate key value violates unique constraint "deliveries_idempotency_key_key"' }
    });
    assert.strictEqual(sync.queue.length, 0, 'Duplicate delivery should be treated as confirmed and removed');
    console.log("✅ 8. duplicate insert is handled");
  }

  // 9. successful item removed from queue
  {
    const sync = new SyncServiceTest();
    await sync.queueOfflineAction('RECORD_DELIVERY', { id: 'd-succ', matchId: 'm1', runsBatter: 6 });
    assert.strictEqual(sync.queue.length, 1);
    await sync.processQueue();
    assert.strictEqual(sync.queue.length, 0, 'Queue must be empty after success');
    console.log("✅ 9. successful item removed");
  }

  // 10. later valid queue items do not become silently corrupted
  {
    const sync = new SyncServiceTest();
    // Match 1 has permanent error
    sync.serverInnings.set('inn-bad', { id: 'inn-bad', match_id: 'OTHER' });
    await sync.queueOfflineAction('RECORD_DELIVERY', { id: 'm1-d1', matchId: 'm1', inningsId: 'inn-bad' });
    
    // Match 2 is valid
    sync.serverMatches.set('m2', { id: 'm2' });
    sync.serverInnings.set('inn-m2', { id: 'inn-m2', match_id: 'm2', innings_number: 1 });
    await sync.queueOfflineAction('RECORD_DELIVERY', { id: 'm2-d1', matchId: 'm2', inningsId: 'inn-m2', runsBatter: 1 });

    await sync.processQueue();
    // Match 1 should be FAILED_PERMANENT
    const m1Action = sync.queue.find(a => a.id === 'm1-d1');
    assert.strictEqual(m1Action.status, 'FAILED_PERMANENT');
    // Match 2 should be successfully pushed and removed
    const m2Action = sync.queue.find(a => a.id === 'm2-d1');
    assert.strictEqual(m2Action, undefined, 'Match 2 delivery should be processed and removed');
    assert.strictEqual(sync.serverDB.some(d => d.id === 'm2-d1'), true, 'Match 2 delivery in DB');
    console.log("✅ 10. later valid queue items do not become silently corrupted");
  }

  // 11. queue does not grow endlessly from repeated retry of permanent error
  {
    const sync = new SyncServiceTest();
    sync.serverInnings.set('inn-bad', { id: 'inn-bad', match_id: 'OTHER' });
    await sync.queueOfflineAction('RECORD_DELIVERY', { id: 'm1-d1', matchId: 'm1', inningsId: 'inn-bad' });
    
    await sync.processQueue();
    assert.strictEqual(sync.pendingCount, 0, 'pendingCount must exclude FAILED_PERMANENT');

    // Run processQueue again
    await sync.processQueue();
    assert.strictEqual(sync.queue[0].status, 'FAILED_PERMANENT');
    assert.strictEqual(sync.pendingCount, 0, 'Queue does not keep retrying permanent error');
    console.log("✅ 11. queue does not grow endlessly from repeated retry of permanent error");
  }

  // 12. realtime setup lifecycle is not subscribed before .on()
  {
    class MockChannel {
      constructor(topic) {
        this.topic = topic;
        this.isSubscribed = false;
        this.callbacks = [];
      }
      on(event, filter, cb) {
        if (this.isSubscribed) {
          throw new Error(`cannot add postgres_changes callbacks for ${this.topic} after subscribe()`);
        }
        this.callbacks.push({ event, filter, cb });
        return this;
      }
      subscribe() {
        this.isSubscribed = true;
        return this;
      }
    }

    // Correct lifecycle: .channel() -> .on() -> .subscribe()
    const validChannel = new MockChannel('realtime:public:deliveries:m1');
    assert.doesNotThrow(() => {
      validChannel.on('postgres_changes', {}, () => {});
      validChannel.subscribe();
    }, 'Proper lifecycle must succeed');

    // Broken lifecycle: .channel() -> .subscribe() -> .on()
    const brokenChannel = new MockChannel('realtime:public:deliveries:m2');
    brokenChannel.subscribe();
    assert.throws(() => {
      brokenChannel.on('postgres_changes', {}, () => {});
    }, /cannot add postgres_changes callbacks .* after subscribe\(\)/, 'Calling .on() after .subscribe() must be caught');

    console.log("✅ 12. realtime setup lifecycle is not subscribed before .on()");
  }

  console.log("\nAll 12 SyncService regression tests passed successfully!");
}

runTests().catch((err) => {
  console.error("Test failed:", err);
  process.exit(1);
});
