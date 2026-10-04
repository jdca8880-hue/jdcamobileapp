import puppeteer from 'puppeteer';

(async () => {
  console.log('Starting puppeteer...');
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  
  // Listen for console logs
  page.on('console', msg => {
    if (msg.type() === 'error' || msg.text().includes('Sync') || msg.text().includes('actions')) {
      console.log('BROWSER CONSOLE:', msg.text());
    }
  });

  await page.goto('http://localhost:5173/', { waitUntil: 'networkidle0' });

  console.log('--- 1. Inspecting current queue ---');
  
  const queueData = await page.evaluate(async () => {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open('jdca_offline_db');
      request.onsuccess = (e) => {
        const db = e.target.result;
        if (!db.objectStoreNames.contains('sync_queue')) {
          resolve({ error: 'sync_queue not found' });
          return;
        }
        const tx = db.transaction('sync_queue', 'readonly');
        const store = tx.objectStore('sync_queue');
        const allReq = store.getAll();
        allReq.onsuccess = () => resolve(allReq.result);
        allReq.onerror = () => reject(allReq.error);
      };
      request.onerror = () => reject(request.error);
    });
  });

  if (queueData.error) {
    console.error('Error fetching queue:', queueData.error);
    await browser.close();
    return;
  }

  const counts = { PENDING: 0, SYNCING: 0, FAILED_PERMANENT: 0, CONFIRMED: 0, malformed: 0, duplicate: 0, mismatch: 0 };
  
  for (const item of queueData) {
    if (counts[item.status] !== undefined) counts[item.status]++;
    else counts[item.status] = 1;
    
    // basic checks
    if (!item.payload || !item.payload.idempotency_key) counts.malformed++;
  }
  
  console.log(`Total queue size: ${queueData.length}`);
  console.log('Counts:', counts);

  const pendingItems = queueData.filter(i => i.status === 'PENDING' || i.status === 'FAILED_PERMANENT');
  
  if (pendingItems.length > 0) {
    console.log('\\n--- 2. First pending delivery ---');
    const first = pendingItems[0];
    console.log(`Action ID: ${first.id}`);
    console.log(`Delivery ID (idem key): ${first.payload?.idempotency_key || first.payload?.id}`);
    console.log(`Match ID: ${first.payload?.matchId}`);
    console.log(`Innings ID: ${first.payload?.inningsId}`);
    console.log(`Sequence: ${first.payload?.deliverySequence}`);

    if (first.payload?.matchId && first.payload?.inningsId) {
      // Check Supabase for the actual innings
      const inningsInfo = await page.evaluate(async (matchId, inningsId) => {
        const mod = await import('/src/lib/supabase.js');
        const supabase = mod.supabase;
        const { data, error } = await supabase.from('innings').select('id, match_id').eq('id', inningsId).single();
        return { data, error };
      }, first.payload.matchId, first.payload.inningsId);
      
      console.log('Innings query result:', inningsInfo);
      
      if (inningsInfo.data && inningsInfo.data.match_id !== first.payload.matchId) {
        console.log('❌ MISMATCH DETECTED: innings.match_id !== payload.matchId');
        counts.mismatch++;
      } else if (!inningsInfo.data) {
        console.log('❌ MISMATCH/NOT FOUND: innings does not exist for payload.inningsId');
      } else {
        console.log('✅ MATCH/INNINGS ALIGNMENT OK');
      }
    }
    
    console.log('\\n--- 3. Recovery process ---');
    // We will do recovery in the browser context so it uses the app's SyncService and DB
    const recoveryResult = await page.evaluate(async () => {
      const results = { recovered: 0, failedPermanent: 0, confirmed: 0 };
      
      const mod = await import('/src/lib/supabase.js');
      const supabase = mod.supabase;
      const { syncService } = await import('/src/services/SyncService.js');
      const { db } = await import('/src/lib/db.js');
      
      const queue = await db.sync_queue.filter(a => a.status === 'PENDING' || a.status === 'FAILED_PERMANENT').toArray();
      
      for (const item of queue) {
        let isRecoverable = false;
        
        // Check if server already has it
        const idemKey = item.payload?.idempotency_key || item.payload?.id;
        if (idemKey) {
          const { data: existing } = await supabase.from('deliveries').select('id').eq('idempotency_key', idemKey).single();
          if (existing) {
            await db.sync_queue.delete(item.id);
            results.confirmed++;
            continue;
          }
        }
        
        // Check match/innings mismatch
        if (item.payload?.inningsId && item.payload?.matchId) {
          const { data: innings } = await supabase.from('innings').select('id, match_id').eq('id', item.payload.inningsId).single();
          
          if (!innings || innings.match_id !== item.payload.matchId) {
            // Find correct innings for this match
            const inningsNum = item.payload.innings || 1;
            const { data: correctInnings } = await supabase
              .from('innings')
              .select('id')
              .eq('match_id', item.payload.matchId)
              .eq('innings_number', inningsNum)
              .single();
              
            if (correctInnings) {
              // Repair metadata
              await db.sync_queue.update(item.id, {
                payload: {
                  ...item.payload,
                  inningsId: correctInnings.id
                },
                status: 'PENDING'
              });
              isRecoverable = true;
              results.recovered++;
            } else {
              // Mark FAILED_PERMANENT
              await db.sync_queue.update(item.id, { status: 'FAILED_PERMANENT', error: 'Could not find correct innings for match' });
              results.failedPermanent++;
            }
          } else {
             // Valid, set to PENDING to retry
             await db.sync_queue.update(item.id, { status: 'PENDING', error: null });
             isRecoverable = true;
          }
        }
      }
      return results;
    });
    
    console.log('Recovery results:', recoveryResult);

    console.log('\\n--- 4. Forcing Queue Drain ---');
    await page.evaluate(async () => {
      const { syncService } = await import('/src/services/SyncService.js');
      await syncService.processQueue();
    });
    
    // Wait for queue to process
    await new Promise(r => setTimeout(r, 5000));
    
    const finalQueue = await page.evaluate(async () => {
      const { db } = await import('/src/lib/db.js');
      return await db.sync_queue.toArray();
    });
    
    console.log(`Final queue size: ${finalQueue.length}`);
    const finalPending = finalQueue.filter(i => i.status === 'PENDING').length;
    console.log(`Final PENDING: ${finalPending}`);
  }
  
  await browser.close();
})();
