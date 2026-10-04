import puppeteer from 'puppeteer';
import assert from 'assert';

(async () => {
  console.log('Starting puppeteer for new delivery test...');
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  
  page.on('console', msg => {
    if (msg.type() === 'error' || msg.text().includes('Sync') || msg.text().includes('actions')) {
      console.log('BROWSER CONSOLE:', msg.text());
    }
  });

  await page.goto('http://localhost:5173/', { waitUntil: 'domcontentloaded' });
  
  console.log('--- Logging in ---');
  await page.evaluate(async () => {
    const mod = await import('/src/lib/supabase.js');
    const supabase = mod.supabase;
    const { error } = await supabase.auth.signInWithPassword({
      email: 'ayush@jdca.com',
      password: '123456'
    });
    if (error) throw error;
  });
  
  // Wait a bit for auth state to propagate and data to load
  await new Promise(r => setTimeout(r, 4000));

  console.log('--- Creating/Selecting Match and Scoring ---');
  
  const result = await page.evaluate(async () => {
    const { syncService } = await import('/src/services/SyncService.js');
    const { queueOfflineAction, db } = await import('/src/lib/db.js');
    const mod = await import('/src/lib/supabase.js');
    const supabase = mod.supabase;
    
    // Clear any stuck queue to ensure we only test our new delivery
    await db.sync_queue.clear();
    
    // Pick an active match
    const { data: matches } = await supabase.from('matches').select('id').eq('status', 'IN_PROGRESS').limit(1);
    if (!matches || matches.length === 0) return { error: 'No active match found' };
    
    const matchId = matches[0].id;
    
    // Pick an innings
    const { data: innings } = await supabase.from('innings').select('id').eq('match_id', matchId).limit(1);
    if (!innings || innings.length === 0) return { error: 'No innings found' };
    
    const inningsId = innings[0].id;
    
    const deliveryId = `test-deliv-${Date.now()}`;
    const payload = {
      id: deliveryId,
      idempotency_key: deliveryId,
      matchId: matchId,
      inningsId: inningsId,
      runsBatter: 1,
      runsExtras: 0,
      runsTotal: 1,
      isLegalDelivery: true,
      extraType: 'NONE',
      wicketType: 'NONE'
    };
    
    // Queue it
    await queueOfflineAction('RECORD_DELIVERY', payload);
    
    // Process queue
    await syncService.processQueue();
    
    return { matchId, inningsId, deliveryId };
  });

  console.log('Simulated scoring result:', result);
  
  if (result.error) {
    console.error('Failed to simulate:', result.error);
    await browser.close();
    return;
  }
  
  // Wait for sync
  await new Promise(r => setTimeout(r, 4000));
  
  // Verify in DB and queue
  const verifyResult = await page.evaluate(async (deliveryId) => {
    const { db } = await import('/src/lib/db.js');
    const mod = await import('/src/lib/supabase.js');
    const supabase = mod.supabase;
    
    const pending = await db.sync_queue.filter(a => a.payload?.id === deliveryId).toArray();
    
    const { data: remote, error } = await supabase.from('deliveries').select('id, match_id, innings_id').eq('idempotency_key', deliveryId);
    
    return {
      queueCount: pending.length,
      remoteCount: remote ? remote.length : 0,
      remoteData: remote,
      remoteError: error
    };
  }, result.deliveryId);

  console.log('Verification result:', verifyResult);
  
  if (verifyResult.queueCount === 0 && verifyResult.remoteCount === 1) {
    console.log('✅ NEW delivery synced successfully and was removed from the queue.');
    console.log('✅ Found exactly ONE record in Supabase.');
  } else {
    console.log('❌ Sync verification failed.');
  }

  await browser.close();
})();
