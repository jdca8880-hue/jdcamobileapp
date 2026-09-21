import React, { useState, useEffect } from 'react';
import { api } from '../../lib/api';
import { AlertTriangle, Check, RotateCcw, Trash2, Loader2, Database } from 'lucide-react';

export default function RecycleBinTab({ userRole }) {
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [processingId, setProcessingId] = useState(null);

  const loadItems = async () => {
    setIsLoading(true);
    try {
      const data = await api.getRecycleBinItems();
      setItems(data || []);
    } catch (err) {
      console.error(err);
      alert("Failed to load recycle bin items");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadItems();
  }, []);

  const handleRestore = async (type, id) => {
    if (!window.confirm("Are you sure you want to restore this item?")) return;
    setProcessingId(id);
    try {
      await api.restoreItem(type, id);
      setItems(items.filter(item => item.id !== id));
      alert("Item restored successfully! You may need to refresh the page to see it in the main views.");
    } catch (err) {
      console.error(err);
      alert("Failed to restore item.");
    } finally {
      setProcessingId(null);
    }
  };

  const handleHardDelete = async (type, id) => {
    if (!window.confirm("WARNING: This action is permanent and cannot be undone. Are you absolutely sure you want to permanently delete this item?")) return;
    setProcessingId(id);
    try {
      await api.hardDeleteItem(type, id);
      setItems(items.filter(item => item.id !== id));
    } catch (err) {
      console.error(err);
      alert("Failed to permanently delete item.");
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <div className="space-y-5">
      <div className="jdca-card p-5 border-l-4 border-l-amber-500">
        <h3 className="font-bold text-slate-900 text-base mb-1">Recycle Bin</h3>
        <p className="text-sm text-slate-600 mb-0">
          View and manage soft-deleted items. You can restore them to active status or permanently delete them from the database.
        </p>
      </div>

      <div className="jdca-card overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-white">
          <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
            <Database size={16} className="text-slate-400" />
            Deleted Items
          </h3>
          <button onClick={loadItems} className="text-sm text-blue-600 font-semibold hover:underline">
            Refresh
          </button>
        </div>

        {isLoading ? (
          <div className="p-10 text-center text-slate-400 flex flex-col items-center">
            <Loader2 className="animate-spin mb-2" size={24} />
            <p className="text-sm">Loading recycle bin...</p>
          </div>
        ) : items.length === 0 ? (
          <div className="p-10 text-center text-slate-400">
            <Trash2 size={32} className="mx-auto mb-3 opacity-20" />
            <p className="text-sm">Recycle bin is empty</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="jdca-table">
              <thead>
                <tr>
                  <th>Type</th>
                  <th>Name / Details</th>
                  <th>Deleted At</th>
                  <th className="text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {items.map(item => (
                  <tr key={item.id}>
                    <td>
                      <span className="badge bg-slate-100 text-slate-700 text-[10px] font-bold">
                        {item.type}
                      </span>
                    </td>
                    <td className="font-medium text-slate-800 text-sm">
                      {item.name}
                    </td>
                    <td className="text-xs text-slate-500">
                      {new Date(item.deleted_at).toLocaleString()}
                    </td>
                    <td className="text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => handleRestore(item.type, item.id)}
                          disabled={processingId === item.id}
                          className="px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-bold rounded hover:bg-emerald-100 transition disabled:opacity-50 flex items-center gap-1"
                        >
                          <RotateCcw size={14} /> Restore
                        </button>
                        <button
                          onClick={() => handleHardDelete(item.type, item.id)}
                          disabled={processingId === item.id}
                          className="px-3 py-1 bg-rose-50 text-rose-700 text-xs font-bold rounded hover:bg-rose-100 transition disabled:opacity-50 flex items-center gap-1"
                        >
                          <Trash2 size={14} /> Delete Forever
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
