import React, { useState, useEffect } from 'react';
import { api } from '../../lib/api';
import { Shield, X, Loader2 } from 'lucide-react';

export default function SelectorAssignmentModal({ user, onClose }) {
  const [ageCategories, setAgeCategories] = useState([]);
  const [districts, setDistricts] = useState([]);
  
  const [maxAgeId, setMaxAgeId] = useState('');
  const [selectedDistricts, setSelectedDistricts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [acData, accessData] = await Promise.all([
          api.getAgeCategories(),
          api.getSelectorAccess(user.id)
        ]);

        setAgeCategories(acData || []);
        if (accessData) {
          setMaxAgeId(accessData.max_age_category_id || '');
          setSelectedDistricts(accessData.district_ids || []);
        }
      } catch (err) {
        console.error("Failed to load selector access data", err);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, [user.id]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await api.updateSelectorAccess(user.id, maxAgeId || null, selectedDistricts);
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
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg p-6 animate-in fade-in zoom-in-95">
        <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <Shield className="text-blue-600" size={20} />
            <h3 className="font-bold text-slate-900 text-base">Assign Selector Access</h3>
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
          <div className="space-y-6">
            <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
              <p className="text-sm font-semibold text-slate-800">{user.email || user.name}</p>
              <p className="text-xs text-slate-500">Selector Role</p>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-800 mb-1">Maximum Age Category Access</label>
              <p className="text-xs text-slate-500 mb-2">Selectors can view players up to and including this age category's rank.</p>
              <select 
                value={maxAgeId} 
                onChange={(e) => setMaxAgeId(e.target.value)}
                className="w-full border border-slate-300 rounded p-2 text-sm"
              >
                <option value="">-- No Age Access --</option>
                {ageCategories.map(ac => (
                  <option key={ac.id} value={ac.id}>{ac.name} (Rank: {ac.rank_level})</option>
                ))}
              </select>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 mt-6">
              <button onClick={onClose} className="px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100 rounded">
                Cancel
              </button>
              <button 
                onClick={handleSave} 
                disabled={isSaving}
                className="btn-primary text-sm flex items-center gap-2"
              >
                {isSaving ? 'Saving...' : 'Save Permissions'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
