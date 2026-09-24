import React, { useState, useEffect } from 'react';
import { api } from '../../lib/api';
import { Shield, X, Loader2, Check } from 'lucide-react';

export default function SelectorAssignmentModal({ user, onClose }) {
  const [processes, setProcesses] = useState([]);
  const [assignments, setAssignments] = useState([]); // array of { selection_process_id, is_lead_selector }
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [procData, accessData] = await Promise.all([
          api.getSelectionProcesses(),
          api.getSelectorAssignments(user.id)
        ]);

        setProcesses(procData || []);
        setAssignments(accessData || []);
      } catch (err) {
        console.error("Failed to load selector access data", err);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, [user.id]);

  const toggleProcess = (processId) => {
    setAssignments(prev => {
      const exists = prev.find(a => a.selection_process_id === processId);
      if (exists) {
        return prev.filter(a => a.selection_process_id !== processId);
      } else {
        return [...prev, { selection_process_id: processId, is_lead_selector: false }];
      }
    });
  };

  const toggleLead = (processId, e) => {
    e.stopPropagation();
    setAssignments(prev => {
      return prev.map(a => {
        if (a.selection_process_id === processId) {
          return { ...a, is_lead_selector: !a.is_lead_selector };
        }
        return a;
      });
    });
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await api.updateSelectorAssignments(user.id, assignments);
      alert("Selector permissions updated successfully.");
      onClose();
    } catch (err) {
      console.error(err);
      alert("Failed to save permissions.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-800/80">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl p-6 animate-in fade-in zoom-in-95 max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3 shrink-0">
          <div className="flex items-center gap-2">
            <Shield className="text-blue-600" size={20} />
            <h3 className="font-bold text-slate-900 text-base">Assign Selection Processes</h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X size={18} />
          </button>
        </div>

        {isLoading ? (
          <div className="p-10 text-center text-slate-400">
            <Loader2 className="animate-spin mx-auto mb-2" size={24} />
            <p>Loading permissions...</p>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto space-y-6">
            <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 shrink-0">
              <p className="text-sm font-semibold text-slate-800">{user.email || user.name}</p>
              <p className="text-xs text-slate-500">Assign specific teams/processes to this selector</p>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-800 mb-2">Available Processes</label>
              {processes.length === 0 ? (
                <p className="text-xs text-slate-500">No active selection processes found.</p>
              ) : (
                <div className="space-y-2">
                  {processes.map(proc => {
                    const isAssigned = assignments.some(a => a.selection_process_id === proc.id);
                    const isLead = assignments.find(a => a.selection_process_id === proc.id)?.is_lead_selector || false;
                    
                    return (
                      <div 
                        key={proc.id}
                        className={`flex items-center justify-between p-3 border rounded-lg cursor-pointer transition-colors ${isAssigned ? 'border-blue-500 bg-blue-50/30' : 'border-slate-200 hover:bg-slate-50'}`}
                        onClick={() => toggleProcess(proc.id)}
                      >
                        <div>
                          <div className="font-semibold text-sm text-slate-900">{proc.name}</div>
                          <div className="text-xs text-slate-500">{proc.season} · {proc.status}</div>
                        </div>
                        
                        <div className="flex items-center gap-4">
                          {isAssigned && (
                            <label 
                              className="flex items-center gap-1.5 text-xs font-bold text-slate-700 cursor-pointer"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <input 
                                type="checkbox" 
                                checked={isLead} 
                                onChange={(e) => toggleLead(proc.id, e)}
                                className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
                              />
                              Lead Selector
                            </label>
                          )}
                          
                          <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${isAssigned ? 'bg-blue-600 border-blue-600 text-white' : 'border-slate-300'}`}>
                            {isAssigned && <Check size={12} strokeWidth={3} />}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}

        <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 mt-6 shrink-0">
          <button onClick={onClose} className="px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100 rounded">
            Cancel
          </button>
          <button 
            onClick={handleSave} 
            disabled={isSaving}
            className="btn-primary text-sm flex items-center gap-2"
          >
            {isSaving ? 'Saving...' : 'Save Assignments'}
          </button>
        </div>
      </div>
    </div>
  );
}
