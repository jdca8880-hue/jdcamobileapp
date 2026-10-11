import React, { useState, useEffect, useCallback } from 'react';
import { X, RefreshCw, Trash2, ShieldAlert, Loader2, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { db, clearAction } from '../../lib/db';
import { syncService } from '../../services/SyncService';

/**
 * Sync Repair — an in-app tool to inspect the local sync queue and clear or
 * retry stuck balls, grouped by match. This is the field-usable version of the
 * node scripts (inspect_queue / audit_queue): a scorer whose device has a
 * poisoned old ball can see exactly what's stuck and fix it without a laptop.
 *
 * It never fabricates or re-orders anything — it only reads db.sync_queue and
 * calls the same retry/remove paths the failure banner already uses.
 */
export default function SyncRepairModal({ isOpen, onClose, matches = [] }) {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const all = await db.sync_queue.orderBy('timestamp').toArray();
      setRows(all);
    } catch (e) {
      console.error('[SyncRepair] Failed to read queue:', e);
      setRows([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isOpen) load();
  }, [isOpen, load]);

  if (!isOpen) return null;

  const matchName = (id) => {
    const m = matches.find(x => x.id === id);
    if (!m) return null;
    const h = m.home_team?.name || m.teamA?.name || 'Home';
    const a = m.away_team?.name || m.teamB?.name || 'Away';
    return `${h} vs ${a}`;
  };
  const knownMatchIds = new Set(matches.map(m => m.id));

  // Group actions by their match id.
  const groups = {};
  for (const r of rows) {
    const mid = r.payload?.matchId || 'unknown';
    (groups[mid] = groups[mid] || []).push(r);
  }

  const totalPending = rows.filter(r => r.status !== 'FAILED_PERMANENT').length;
  const totalFailed = rows.filter(r => r.status === 'FAILED_PERMANENT').length;

  const withBusy = async (fn) => {
    if (busy) return;
    setBusy(true);
    try { await fn(); } finally { setBusy(false); await load(); }
  };

  const retryRow = (row) => withBusy(async () => {
    await syncService.retryFailedAction(row.id);
  });
  const removeRow = (row) => withBusy(async () => {
    // deleteFailedAction unblocks + drains; for a non-failed row a plain delete
    // is enough. Use deleteFailedAction for both so the queue re-drains after.
    await syncService.deleteFailedAction(row.id);
  });
  const retryAllFailed = () => withBusy(async () => {
    for (const r of rows.filter(r => r.status === 'FAILED_PERMANENT')) {
      await syncService.retryFailedAction(r.id);
    }
  });
  const removeAllFailed = () => {
    if (!window.confirm(`Remove all ${totalFailed} failed ball(s)? They stay on this device's scorecard but won't be saved to the server.`)) return;
    withBusy(async () => {
      for (const r of rows.filter(r => r.status === 'FAILED_PERMANENT')) {
        await clearAction(r.id);
      }
      await syncService.autoHealAndResume();
    });
  };
  const purgeDeadMatches = () => {
    const dead = rows.filter(r => r.payload?.matchId && !knownMatchIds.has(r.payload.matchId));
    if (dead.length === 0) { window.alert('No queued balls belong to unknown/removed matches.'); return; }
    if (!window.confirm(`Remove ${dead.length} queued ball(s) that belong to matches no longer on this device? This cannot be undone.`)) return;
    withBusy(async () => {
      for (const r of dead) await clearAction(r.id);
      await syncService.autoHealAndResume();
    });
  };

  const groupKeys = Object.keys(groups);

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
      <div className="bg-white rounded-[20px] w-full max-w-md overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-gray-100 bg-slate-50">
          <div>
            <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
              <ShieldAlert className="text-amber-500" size={20} /> Sync Repair
            </h2>
            <p className="text-xs font-semibold text-slate-500 mt-1">
              {totalPending} pending · {totalFailed} failed
            </p>
          </div>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-200 text-slate-500 hover:bg-red-100 hover:text-red-500 transition-colors">
            <X size={18} />
          </button>
        </div>

        <div className="p-5 overflow-y-auto">
          {/* Bulk actions */}
          <div className="flex flex-wrap gap-2 mb-4">
            <button onClick={() => withBusy(() => syncService.forceSync())} disabled={busy} className="flex items-center gap-1 text-xs font-bold bg-blue-600 text-white px-3 py-1.5 rounded-md hover:bg-blue-700 disabled:opacity-50">
              <RefreshCw size={12} /> Sync now
            </button>
            {totalFailed > 0 && (
              <>
                <button onClick={retryAllFailed} disabled={busy} className="text-xs font-bold bg-white border border-slate-300 text-slate-700 px-3 py-1.5 rounded-md hover:bg-slate-50 disabled:opacity-50">
                  Retry all failed
                </button>
                <button onClick={removeAllFailed} disabled={busy} className="text-xs font-bold bg-white border border-red-200 text-red-600 px-3 py-1.5 rounded-md hover:bg-red-50 disabled:opacity-50">
                  Remove all failed
                </button>
              </>
            )}
            <button onClick={purgeDeadMatches} disabled={busy} className="text-xs font-bold bg-white border border-slate-300 text-slate-700 px-3 py-1.5 rounded-md hover:bg-slate-50 disabled:opacity-50">
              Purge removed matches
            </button>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-10 text-slate-500 text-sm font-bold gap-2">
              <Loader2 size={18} className="animate-spin" /> Reading queue…
            </div>
          ) : rows.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 text-slate-500 text-sm font-semibold gap-2">
              <CheckCircle2 size={28} className="text-emerald-500" />
              Nothing stuck. The sync queue is empty.
            </div>
          ) : (
            <div className="space-y-4">
              {groupKeys.map(mid => {
                const list = groups[mid];
                const name = matchName(mid);
                const isUnknown = mid !== 'unknown' && !knownMatchIds.has(mid);
                return (
                  <div key={mid} className="border border-slate-200 rounded-xl overflow-hidden">
                    <div className="bg-slate-50 px-3 py-2 border-b border-slate-200 flex items-center justify-between">
                      <div className="text-xs font-black text-slate-800 truncate">
                        {name || (mid === 'unknown' ? 'Unknown match' : 'Removed match')}
                        {isUnknown && <span className="ml-1 text-[10px] font-bold text-amber-600 uppercase">(not on device)</span>}
                      </div>
                      <span className="text-[11px] font-bold text-slate-500 shrink-0">{list.length} ball(s)</span>
                    </div>
                    <div className="divide-y divide-slate-100">
                      {list.map(row => {
                        const failed = row.status === 'FAILED_PERMANENT';
                        const seq = row.payload?.deliverySequence ?? '?';
                        const inn = row.payload?.innings ?? '?';
                        return (
                          <div key={row.id} className="px-3 py-2 flex items-center gap-2">
                            <div className="flex-1 min-w-0">
                              <div className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                                {failed ? <AlertTriangle size={12} className="text-red-500 shrink-0" /> : <RefreshCw size={12} className="text-amber-500 shrink-0" />}
                                {row.action === 'RECORD_DELIVERY' ? `Ball · inn ${inn} · seq ${seq}` : row.action}
                              </div>
                              {failed && row.error?.message && (
                                <div className="text-[10px] text-red-500 truncate mt-0.5">{row.error.message}</div>
                              )}
                            </div>
                            <button onClick={() => retryRow(row)} disabled={busy} title="Retry" className="p-1.5 rounded-md text-blue-600 hover:bg-blue-50 disabled:opacity-50">
                              <RefreshCw size={14} />
                            </button>
                            <button onClick={() => removeRow(row)} disabled={busy} title="Remove" className="p-1.5 rounded-md text-red-500 hover:bg-red-50 disabled:opacity-50">
                              <Trash2 size={14} />
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          <p className="text-[11px] text-slate-400 mt-4 leading-relaxed">
            Removing a ball keeps it in this device's local scorecard but it will not be saved to the server. Retrying puts it back in line to sync. Your live scoring is never affected by anything here.
          </p>
        </div>
      </div>
    </div>
  );
}
