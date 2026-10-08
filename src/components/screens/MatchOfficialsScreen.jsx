import React, { useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Plus, X, AlertTriangle, ShieldCheck, Award } from 'lucide-react';
import { useCricket } from '../../context/CricketContext';
import { PageHeader } from '../ui/PageHeader';
import { api } from '../../lib/api';
import MatchOfficialsTab from './MatchOfficialsTab';

export default function MatchOfficialsScreen() {
  const { setRegisteredUsers, userRole } = useCricket();
  const [showAddUserModal, setShowAddUserModal] = useState(false);

  // Add User Form State
  const [newEmail, setNewEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newFullName, setNewFullName] = useState('');
  const [newRole, setNewRole] = useState('SCORER');
  const [isCreatingUser, setIsCreatingUser] = useState(false);
  const [createError, setCreateError] = useState('');

  const handleCreateUser = async (e) => {
    e.preventDefault();
    if (!newEmail || !newPassword || !newFullName) return;
    setIsCreatingUser(true);
    setCreateError('');
    try {
      // Use temporary client so admin does not get logged out
      const tempSupabase = createClient(
        import.meta.env.VITE_SUPABASE_URL,
        import.meta.env.VITE_SUPABASE_ANON_KEY,
        { auth: { persistSession: false, autoRefreshToken: false } }
      );

      const { data, error } = await tempSupabase.auth.signUp({
        email: newEmail,
        password: newPassword,
        options: {
          data: {
            full_name: newFullName
          }
        }
      });

      if (error) throw error;

      if (data.user) {
        try {
          await api.updateUserRole(data.user.id, newRole);
        } catch (updateError) {
          console.warn("Failed to set role immediately:", updateError);
        }

        // Refresh registered users in context
        const profiles = await api.getProfiles();
        const mapped = profiles.map(p => ({
          id: p.id,
          name: p.full_name,
          email: p.email || 'N/A',
          role: p.role,
          status: p.is_active ? 'Active' : 'Inactive',
          district: p.district?.name || 'All Districts'
        }));
        setRegisteredUsers(mapped);

        setShowAddUserModal(false);
        setNewEmail('');
        setNewPassword('');
        setNewFullName('');
        setNewRole('SCORER');
      }
    } catch (err) {
      console.error(err);
      setCreateError(err.message || 'Failed to create official user');
    } finally {
      setIsCreatingUser(false);
    }
  };

  return (
    <div className="fade-in-up" style={{ padding: '24px 20px 100px', maxWidth: 1100, margin: '0 auto' }}>
      <PageHeader
        title="Scorers & Umpires"
        subtitle="Certified match officials roster, live match duty tracking, and assignment states"
        action={
          ['SUPER_ADMIN', 'DISTRICT_ADMIN'].includes(userRole) && (
            <button
              id="admin-add-official-btn"
              onClick={() => setShowAddUserModal(true)}
              className="btn-primary"
            >
              <Plus size={16} strokeWidth={2.5} />
              <span>Add Official User</span>
            </button>
          )
        }
      />

      {/* Main Officials Content & Match State Viewer */}
      <div className="mt-5">
        <MatchOfficialsTab onAddUser={() => setShowAddUserModal(true)} />
      </div>

      {/* ── ADD OFFICIAL USER MODAL ────────────────────────────────────── */}
      {showAddUserModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-800/80">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                  <Award size={18} />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-base">Add Match Official User</h3>
                  <p className="text-[11px] text-slate-500">Create an authorized Scorer or Umpire account</p>
                </div>
              </div>
              <button
                onClick={() => setShowAddUserModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X size={18} />
              </button>
            </div>

            {createError && (
              <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg text-sm flex gap-2 items-start">
                <AlertTriangle size={16} className="mt-0.5 shrink-0" />
                <p>{createError}</p>
              </div>
            )}

            <form onSubmit={handleCreateUser}>
              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    value={newFullName}
                    onChange={(e) => setNewFullName(e.target.value)}
                    className="w-full border border-slate-300 rounded-lg p-2 text-sm focus:outline-none focus:border-blue-500"
                    placeholder="e.g. Anil Chaudhary"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address</label>
                  <input
                    type="email"
                    required
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    className="w-full border border-slate-300 rounded-lg p-2 text-sm focus:outline-none focus:border-blue-500"
                    placeholder="e.g. anil.umpire@jdca.org"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Password</label>
                  <input
                    type="password"
                    required
                    minLength={6}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full border border-slate-300 rounded-lg p-2 text-sm focus:outline-none focus:border-blue-500"
                    placeholder="At least 6 characters"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Official Role</label>
                  <select
                    value={newRole}
                    onChange={(e) => setNewRole(e.target.value)}
                    className="w-full border border-slate-300 rounded-lg p-2 text-sm focus:outline-none focus:border-blue-500 font-medium"
                  >
                    <option value="SCORER">Scorer</option>
                    <option value="UMPIRE">Umpire</option>
                    <option value="VIEWER">Viewer (Read Only)</option>
                    <option value="DISTRICT_ADMIN">District Admin</option>
                    <option value="SUPER_ADMIN">Super Admin</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddUserModal(false)}
                  className="px-4 py-2 text-sm font-semibold text-slate-600 hover:text-slate-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isCreatingUser}
                  className="btn-primary text-sm flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isCreatingUser && <div className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />}
                  {isCreatingUser ? 'Creating...' : 'Create Official'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
