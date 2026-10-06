import 'fake-indexeddb/auto';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

// Mock Browser Environment for Node
globalThis.window = {
  addEventListener: () => {},
  removeEventListener: () => {},
  dispatchEvent: () => {}
};
Object.defineProperty(globalThis, 'navigator', { value: { onLine: true }, writable: true, configurable: true });

// Now we can safely import our local ESM files
import { syncService } from '../src/services/SyncService.js';
import { db, queueOfflineAction, getPendingActions } from '../src/lib/db.js';

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

async function runE2E() {
  console.log('1. Starting E2E Test (Bypassing Auth to test anonymous insert capability if allowed)...');
  
  console.log('2. Fetching existing Match, Innings, and Players...');
  
  const { data: match } = await supabase.from('matches').select('id').limit(1).single();
  if (!match) {
    console.error('No match found for testing');
    process.exit(1);
  }

  const { data: inn } = await supabase.from('innings').select('id, batting_team_id, bowling_team_id').eq('match_id', match.id).limit(1).single();
  if (!inn) {
    console.error('No innings found for match');
    process.exit(1);
  }

  const { data: battingRoster } = await supabase.from('match_rosters').select('player_id').eq('match_id', match.id).eq('team_id', inn.batting_team_id).limit(2);
  const { data: bowlingRoster } = await supabase.from('match_rosters').select('player_id').eq('match_id', match.id).eq('team_id', inn.bowling_team_id).limit(1);
  
  if (!battingRoster || battingRoster.length < 2 || !bowlingRoster || bowlingRoster.length < 1) {
    console.error('Not enough correctly assigned players in match roster for testing');
    process.exit(1);
  }
  
  const p1 = { id: battingRoster[0].player_id };
  const p2 = { id: battingRoster[1].player_id };
  const p3 = { id: bowlingRoster[0].player_id };
  
  const testId = Date.now().toString().slice(-6);

  const deliveryPayload = {
    id: 'e2e-idempotent-' + testId,
    matchId: match.id,
    inningsId: inn.id,
    strikerId: p1.id,
    nonStrikerId: p2.id,
    bowlerId: p3.id,
    runsBatter: 4,
    runsExtras: 0,
    runsTotal: 4,
    extraType: 'NONE',
    wicketType: 'NONE',
    overNumber: 0,
    ballNumber: 1
  };

  console.log('3. Simulating OFFLINE local acceptance...');
  syncService.isOnline = false; // Mock offline
  
  // The UI calls this pattern
  const offlineQueueFn = async (type, payload) => {
     await queueOfflineAction(type, payload);
  };
  
  await syncService.executeOrQueue('RECORD_DELIVERY', deliveryPayload, offlineQueueFn);

  // Assert local queue
  const pendingActions = await getPendingActions();
  if (pendingActions.length !== 1 || pendingActions[0].payload.id !== deliveryPayload.id) {
    console.error('❌ FAIL: Delivery not found in local IndexedDB queue.');
    process.exit(1);
  }
  console.log('✅ Local delivery safely persisted to IndexedDB (offline).');

  // Assert remote missing
  const { data: missingRemotes } = await supabase.from('deliveries').select('id').eq('idempotency_key', deliveryPayload.id);
  if (missingRemotes.length !== 0) {
    console.error('❌ FAIL: Delivery somehow synced while offline.');
    process.exit(1);
  }
  console.log('✅ Verified delivery is NOT in Supabase.');

  console.log('4. Simulating ONLINE sync recovery...');
  syncService.isOnline = true;
  await syncService.processQueue(); // Manual trigger since we don't have true DOM events

  // Assert remote synced
  const { data: syncedRemotes } = await supabase.from('deliveries').select('id').eq('idempotency_key', deliveryPayload.id);
  if (syncedRemotes.length !== 1) {
    console.error('❌ FAIL: Delivery failed to sync to Supabase after recovery.');
    process.exit(1);
  }
  console.log('✅ Delivery successfully synced to Supabase.');

  // Assert local queue drained
  const drainedActions = await getPendingActions();
  if (drainedActions.length !== 0) {
    console.error('❌ FAIL: Delivery still remains in local queue after successful sync.');
    process.exit(1);
  }
  console.log('✅ Local IndexedDB queue successfully drained.');

  console.log('5. Adversarial: Attempting to sync duplicate idempotency key...');
  // Force a direct duplicate push attempt via queue
  await queueOfflineAction('RECORD_DELIVERY', deliveryPayload);
  await syncService.processQueue();

  const { data: finalRemotes } = await supabase.from('deliveries').select('id').eq('idempotency_key', deliveryPayload.id);
  if (finalRemotes.length !== 1) {
    console.error(`❌ FAIL: Duplicate idempotency keys allowed! Count: ${finalRemotes.length}`);
    process.exit(1);
  }
  console.log('✅ Supabase duplicate rejection handled safely by SyncService. No duplicates created.');

  const finalActions = await getPendingActions();
  if (finalActions.length !== 0) {
    console.error('❌ FAIL: Duplicate delivery stuck in local queue instead of resolving.');
    process.exit(1);
  }
  console.log('✅ IndexedDB successfully cleared duplicate delivery without halting queue.');

  console.log('\n🏆 ALL END-TO-END ADVERSARIAL SYNC TESTS PASSED!');
  process.exit(0);
}

runE2E().catch(console.error);
