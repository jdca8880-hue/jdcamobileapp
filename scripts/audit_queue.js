/**
 * JDCA SyncService Queue Audit Script
 * 
 * Instructions:
 * 1. Open the application in Chrome/Edge.
 * 2. Open Developer Tools (F12 or Ctrl+Shift+I).
 * 3. Go to the "Console" tab.
 * 4. Copy and paste this entire script into the console and press Enter.
 * 5. Share the resulting output text.
 */

(async function auditSyncQueue() {
  console.log("Starting JDCA Sync Queue Audit...");
  
  try {
    const dbName = 'JDCAScoringAppDB';
    const request = indexedDB.open(dbName);
    
    request.onerror = (event) => {
      console.error("Database error: ", event.target.errorCode);
    };

    request.onsuccess = (event) => {
      const db = event.target.result;
      
      if (!db.objectStoreNames.contains('sync_queue')) {
        console.error("No sync_queue table found! Are you on the right page?");
        return;
      }

      const transaction = db.transaction(['sync_queue'], 'readonly');
      const objectStore = transaction.objectStore('sync_queue');
      const getAllRequest = objectStore.getAll();

      getAllRequest.onsuccess = (event) => {
        const queue = event.target.result;
        console.log(`\nFound ${queue.length} total deliveries/actions in the queue.`);
        
        let valid = 0;
        let duplicate = 0;
        let malformed = 0;
        let orphan = 0;
        let permanentFailure = 0;
        let transientNetwork = 0;
        
        const errors = {};

        queue.forEach((action, index) => {
          // Check for permanent errors explicitly marked by our system
          if (action.status === 'FAILED_PERMANENT') {
            permanentFailure++;
            const errStr = JSON.stringify(action.error || {});
            errors[errStr] = (errors[errStr] || 0) + 1;
            return;
          }
          
          // Classify based on payload constraints
          const p = action.payload;
          if (!p) {
            malformed++;
            return;
          }
          
          if (!p.matchId || !p.inningsId || !p.deliverySequence) {
            malformed++;
            return;
          }
          
          // We can't perfectly know if it's orphaned without the `matches` table,
          // but we can assume valid if well formed and not marked permanent.
          valid++;
        });

        console.log("\n=== AUDIT REPORT ===");
        console.log(`Total Pending: ${queue.length}`);
        console.log(`Valid/Retryable: ${valid}`);
        console.log(`Permanent Failures: ${permanentFailure}`);
        console.log(`Malformed: ${malformed}`);
        console.log(`Orphans (Requires DB cross-reference): Unknown without API`);
        
        if (Object.keys(errors).length > 0) {
          console.log("\n--- Permanent Error Causes ---");
          for (const [err, count] of Object.entries(errors)) {
            console.log(`- ${count} occurrences: ${err}`);
          }
        }
        
        console.log("\nAction required: Share this report.");
      };
    };
  } catch (err) {
    console.error("Audit script failed:", err);
  }
})();
