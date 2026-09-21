import React, { useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import {
  Users, Shield, Settings, MapPin, Trophy, Calendar, Plus,
  Check, X, Edit, Bell, Lock, UserCheck, AlertTriangle
} from 'lucide-react';
import { useCricket } from '../../context/CricketContext';
import { PageHeader, TabBar } from '../ui/PageHeader';
import { RoleBadge } from '../ui/Badge';
import { api } from '../../lib/api';

const TABS = [
  { id: 'staff',      label: 'Staff & Users' },
  { id: 'jdca',       label: 'JDCA Management' },
  { id: 'system',     label: 'System & Settings' },
];

const ROLES = [
  'Super Admin',
  'District Admin',
  'Tournament Admin',
  'Scorer',
  'Selection Staff',
  'Other Staff'
];

const INITIAL_DISTRICTS = [
  { name: 'Jabalpur', code: 'JBP', grounds: 4, teams: 12, contact: 'Shri R. K. Tiwari', phone: '+91 94251 00001' },
  { name: 'Katni', code: 'KTN', grounds: 3, teams: 8, contact: 'Shri V. P. Patel', phone: '+91 94251 00002' },
  { name: 'Narsinghpur', code: 'NSP', grounds: 2, teams: 8, contact: 'Shri S. K. Dubey', phone: '+91 94251 00003' },
  { name: 'Seoni', code: 'SNI', grounds: 2, teams: 6, contact: 'Shri A. K. Shukla', phone: '+91 94251 00004' },
  { name: 'Mandla', code: 'MDL', grounds: 2, teams: 6, contact: 'Shri M. L. Yadav', phone: '+91 94251 00005' },
  { name: 'Balaghat', code: 'BGT', grounds: 3, teams: 8, contact: 'Shri D. C. Bisen', phone: '+91 94251 00006' },
  { name: 'Chhindwara', code: 'CDW', grounds: 3, teams: 10, contact: 'Shri P. N. Verma', phone: '+91 94251 00007' },
  { name: 'Dindori', code: 'DND', grounds: 1, teams: 4, contact: 'Shri B. S. Maravi', phone: '+91 94251 00008' },
  { name: 'Pandhurna', code: 'PDR', grounds: 2, teams: 6, contact: 'Shri S. R. Deshmukh', phone: '+91 94251 00009' },
];

const INITIAL_VENUES = [
  { name: 'Jabalpur Cricket Stadium (Wright Town)', district: 'Jabalpur', type: 'Stadium (Turf Pitch)', floodlights: 'Yes' },
  { name: 'Ranital Sports Complex', district: 'Jabalpur', type: 'Turf Pitch', floodlights: 'Yes' },
  { name: 'Katni District Sports Ground', district: 'Katni', type: 'Turf Pitch', floodlights: 'No' },
  { name: 'Narsinghpur Stadium Ground', district: 'Narsinghpur', type: 'Matting / Turf', floodlights: 'No' },
  { name: 'Seoni District Ground', district: 'Seoni', type: 'Turf Pitch', floodlights: 'No' },
  { name: 'Police Grounds Chhindwara', district: 'Chhindwara', type: 'Turf Pitch', floodlights: 'No' },
];

const INITIAL_FORMATS = [
  { name: 'T20 Match', overs: 20, ballsPerOver: 6, powerplayOvers: 6, maxBowlerOvers: 4 },
  { name: 'One Day (50 Overs)', overs: 50, ballsPerOver: 6, powerplayOvers: 10, maxBowlerOvers: 10 },
  { name: '40-Over Tournament', overs: 40, ballsPerOver: 6, powerplayOvers: 8, maxBowlerOvers: 8 },
  { name: 'Test / Days Match', overs: 'Multi-Day', ballsPerOver: 6, powerplayOvers: '-', maxBowlerOvers: 'Unlimited' },
];

export default function AdministrationScreen() {
  const { registeredUsers, setRegisteredUsers, userRole, isDarkMode, setIsDarkMode, systemSettings, setSystemSettings } = useCricket();
  const [activeTab, setActiveTab] = useState('staff');
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  
  // Add User State
  const [newEmail, setNewEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newFullName, setNewFullName] = useState('');
  const [newRole, setNewRole] = useState('VIEWER');
  const [isCreatingUser, setIsCreatingUser] = useState(false);
  const [createError, setCreateError] = useState('');

  const handleCreateUser = async (e) => {
    e.preventDefault();
    if (!newEmail || !newPassword || !newFullName) return;
    setIsCreatingUser(true);
    setCreateError('');
    try {
      // Use a temporary client so it doesn't log the admin out!
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
        // The trigger creates the profile. Update the role instantly with the main client's auth session.
        try { await api.updateUserRole(data.user.id, newRole); } catch (updateError) { console.warn("Failed to instantly set role, possibly missing Postgres trigger", updateError); }
        
        // Refresh registered users locally
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
        setNewRole('VIEWER');
      }
    } catch (err) {
      console.error(err);
      setCreateError(err.message || 'Failed to create user');
    } finally {
      setIsCreatingUser(false);
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    try {
      await api.updateUserRole(userId, newRole);
      setRegisteredUsers(prev => prev.map(u => u.id === userId ? { ...u, role: newRole } : u));
    } catch (error) {
      console.error('Failed to update role:', error);
      alert('Failed to update user role');
    }
  };

  const revokeUserAccess = async (userId, currentStatus) => {
    const newStatus = !currentStatus;
    const action = newStatus ? 'activate' : 'revoke access for';
    if(window.confirm(`Are you sure you want to ${action} this user?`)) {
      try {
        await api.updateUserStatus(userId, newStatus);
        setRegisteredUsers(prev => prev.map(u => u.id === userId ? { ...u, is_active: newStatus } : u));
      } catch (error) {
        console.error('Failed to update user status:', error);
        alert('Failed to update user status');
      }
    }
  };

  const toggleSetting = (key) => {
    if (setSystemSettings && systemSettings) {
      setSystemSettings(prev => ({ ...prev, [key]: !prev[key] }));
    }
  };

  return (
    <div className="fade-in-up" style={{ padding: '24px 20px 100px', maxWidth: 1100, margin: '0 auto' }}>
      <PageHeader
        title="JDCA Administration"
        subtitle="Association governance, staff user directory, district affiliations and match parameters"
        action={
          activeTab === 'staff' && (
            <button
              id="admin-add-user-btn"
              onClick={() => setShowAddUserModal(true)}
              className="btn-primary"
            >
              <Plus size={16} strokeWidth={2.5} />
              <span>Add User</span>
            </button>
          )
        }
      />

      {/* Tabs */}
      <div className="mb-5">
        <TabBar tabs={TABS} active={activeTab} onChange={setActiveTab} />
      </div>

      {/* â”€â”€ TAB 1: STAFF & USERS â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      {activeTab === 'staff' && (
        <div className="space-y-5">
          {/* Permission Clarity Banner */}
          <div className="jdca-card p-4 bg-blue-50/40 border border-blue-100 flex items-start gap-3">
            <Shield size={20} className="text-[#2457D6] flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-bold text-slate-900 text-sm">Official Access Control</h4>
              <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                JDCA uses plain-language permissions: <strong>Can view</strong>, <strong>Can add</strong>, <strong>Can edit</strong>, and <strong>Can delete</strong>. 
                Officials have tailored capabilities based on their administrative cricket responsibilities.
              </p>
            </div>
          </div>

          {/* User List Table */}
          <div className="jdca-card overflow-hidden">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-slate-900 text-sm">Authorised Association Users</h3>
                <p className="text-xs text-slate-500">Super Admins, District Admins, Scorers, Selectors and Committee Members</p>
              </div>
              <span className="badge badge-upcoming text-xs font-bold">
                {registeredUsers.length} Users
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="jdca-table">
                <thead>
                  <tr>
                    <th>Official Name</th>
                    <th>Email / Login</th>
                    <th>Assigned Role</th>
                    <th>Can View</th>
                    <th>Can Add</th>
                    <th>Can Edit</th>
                    <th>Can Delete</th>
                    <th style={{ textAlign: 'right' }}>Status</th>
                    <th style={{ textAlign: 'center' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {registeredUsers.map((usr) => {
                    const isSuper = usr.role === 'SuperAdmin' || usr.role === 'Super Admin';
                    return (
                      <tr key={usr.id} className="hover:bg-slate-50">
                        <td>
                          <div className="font-bold text-slate-900 text-sm">{usr.name}</div>
                          <div className="text-xs text-slate-500">{usr.district || 'Jabalpur HQ'}</div>
                        </td>
                        <td className="text-xs text-slate-600 font-medium">
                          {usr.email}
                        </td>
                        <td>
                          {userRole === 'SUPER_ADMIN' ? (
                            <select 
                              value={usr.role} 
                              onChange={(e) => handleRoleChange(usr.id, e.target.value)}
                              className="text-xs border border-slate-200 rounded p-1"
                            >
                              <option value="SUPER_ADMIN">Super Admin</option>
                              <option value="DISTRICT_ADMIN">District Admin</option>
                              <option value="SELECTOR">Selector</option>
                              <option value="SCORER">Scorer</option>
                              <option value="VIEWER">Viewer</option>
                            </select>
                          ) : (
                            <RoleBadge role={usr.role} />
                          )}
                        </td>
                        <td>
                          <span className="inline-flex items-center text-xs font-semibold text-[#0FA968]">
                            <Check size={14} className="mr-1" /> Yes
                          </span>
                        </td>
                        <td>
                          {isSuper || usr.role === 'Admin' || usr.role === 'Scorer' ? (
                            <span className="inline-flex items-center text-xs font-semibold text-[#0FA968]">
                              <Check size={14} className="mr-1" /> Yes
                            </span>
                          ) : (
                            <span className="inline-flex items-center text-xs font-semibold text-slate-400">
                              <X size={14} className="mr-1" /> No
                            </span>
                          )}
                        </td>
                        <td>
                          {isSuper || usr.role === 'Admin' ? (
                            <span className="inline-flex items-center text-xs font-semibold text-[#0FA968]">
                              <Check size={14} className="mr-1" /> Yes
                            </span>
                          ) : (
                            <span className="inline-flex items-center text-xs font-semibold text-slate-400">
                              <X size={14} className="mr-1" /> No
                            </span>
                          )}
                        </td>
                        <td>
                          {isSuper ? (
                            <span className="inline-flex items-center text-xs font-semibold text-[#F05A47]">
                              <Check size={14} className="mr-1" /> Yes
                            </span>
                          ) : (
                            <span className="inline-flex items-center text-xs font-semibold text-slate-400">
                              <X size={14} className="mr-1" /> No
                            </span>
                          )}
                        </td>
                        <td style={{ textAlign: 'right' }}>
                          {usr.is_active === false ? (
                            <span className="badge bg-red-100 text-red-700 border-red-200 text-xs">Revoked</span>
                          ) : (
                            <span className="badge badge-live text-xs">Active</span>
                          )}
                        </td>
                        <td style={{ textAlign: 'center' }}>
                          <div className="flex items-center justify-center gap-2">
                            <button onClick={() => alert('Password reset is managed via Supabase Auth emails in production.')} className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded" title="Reset Password">
                              <Lock size={14} />
                            </button>
                            <button onClick={() => revokeUserAccess(usr.id, usr.is_active)} className={`p-1.5 rounded ${usr.is_active === false ? 'text-green-600 hover:bg-green-50' : 'text-slate-400 hover:text-red-600 hover:bg-red-50'}`} title={usr.is_active === false ? "Restore Access" : "Revoke Access"}>
                              {usr.is_active === false ? <Check size={14} /> : <AlertTriangle size={14} />}
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* â”€â”€ TAB 2: JDCA MANAGEMENT â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      {activeTab === 'jdca' && (
        <div className="space-y-6">
          {/* Hierarchy Banner */}
          <div className="jdca-card p-4 bg-white text-slate-900 flex items-center justify-between">
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-[#2457D6]">Official Association Hierarchy</div>
              <div className="text-sm font-semibold mt-1 flex items-center gap-2 flex-wrap text-slate-700">
                <span className="text-[#2457D6] font-bold">JDCA (Apex)</span>
                <span>â†’</span>
                <span>9 Districts</span>
                <span>â†’</span>
                <span>District Teams</span>
                <span>â†’</span>
                <span>Registered Players</span>
                <span>â†’</span>
                <span>Tournaments & Matches</span>
              </div>
            </div>
            <div className="hidden sm:block text-right">
              <span className="text-xs font-bold text-[#ff6100] bg-amber-950/60 px-3 py-1 rounded border border-amber-800/60">
                MPCA Affiliated
              </span>
            </div>
          </div>

          {/* Districts List */}
          <div className="jdca-card overflow-hidden">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-slate-900 text-sm">Affiliated Districts (9 Units)</h3>
                <p className="text-xs text-slate-500">Official constituent units under Jabalpur District Cricket Association jurisdiction</p>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="jdca-table">
                <thead>
                  <tr>
                    <th>District Name</th>
                    <th>Code</th>
                    <th>Grounds</th>
                    <th>Registered Clubs</th>
                    <th>Secretary / In-charge</th>
                    <th>Official Contact</th>
                    <th style={{ textAlign: 'right' }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {INITIAL_DISTRICTS.map((d) => (
                    <tr key={d.name} className="hover:bg-slate-50">
                      <td className="font-bold text-slate-900 text-sm">{d.name}</td>
                      <td className="font-mono text-xs text-slate-600 font-semibold">{d.code}</td>
                      <td className="font-tabular text-slate-700">{d.grounds} Venues</td>
                      <td className="font-tabular text-slate-700">{d.teams} Teams</td>
                      <td className="text-xs text-slate-800 font-medium">{d.contact}</td>
                      <td className="text-xs text-slate-600">{d.phone}</td>
                      <td style={{ textAlign: 'right' }}>
                        <span className="badge badge-live text-xs">Affiliated</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Venues List */}
          <div className="jdca-card overflow-hidden">
            <div className="p-4 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-sm">Recognised Cricket Venues</h3>
              <p className="text-xs text-slate-500">Approved pitches and grounds for sanctioned JDCA matches</p>
            </div>
            <div className="overflow-x-auto">
              <table className="jdca-table">
                <thead>
                  <tr>
                    <th>Venue Name</th>
                    <th>District</th>
                    <th>Pitch Surface</th>
                    <th>Floodlights</th>
                    <th style={{ textAlign: 'right' }}>Inspection Status</th>
                  </tr>
                </thead>
                <tbody>
                  {INITIAL_VENUES.map((v) => (
                    <tr key={v.name} className="hover:bg-slate-50">
                      <td className="font-bold text-slate-900 text-sm">{v.name}</td>
                      <td className="text-xs text-slate-600">{v.district}</td>
                      <td className="text-xs text-slate-700 font-medium">{v.type}</td>
                      <td className="text-xs text-slate-600">{v.floodlights}</td>
                      <td style={{ textAlign: 'right' }}>
                        <span className="badge badge-live text-xs">Approved</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Configurable Match Formats */}
          <div className="jdca-card overflow-hidden">
            <div className="p-4 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-sm">Configurable Match Formats</h3>
              <p className="text-xs text-slate-500">Overs, powerplay rules, and bowler quota settings for tournaments</p>
            </div>
            <div className="overflow-x-auto">
              <table className="jdca-table">
                <thead>
                  <tr>
                    <th>Format Name</th>
                    <th>Max Overs</th>
                    <th>Balls / Over</th>
                    <th>Powerplay Quota</th>
                    <th>Bowler Limit</th>
                    <th style={{ textAlign: 'right' }}>Ruleset</th>
                  </tr>
                </thead>
                <tbody>
                  {INITIAL_FORMATS.map((f) => (
                    <tr key={f.name} className="hover:bg-slate-50">
                      <td className="font-bold text-slate-900 text-sm">{f.name}</td>
                      <td className="font-tabular font-semibold text-slate-800">{f.overs}</td>
                      <td className="font-tabular text-slate-700">{f.ballsPerOver}</td>
                      <td className="font-tabular text-slate-700">{f.powerplayOvers}</td>
                      <td className="font-tabular font-semibold text-[#2457D6]">{f.maxBowlerOvers}</td>
                      <td style={{ textAlign: 'right' }}>
                        <span className="badge badge-upcoming text-xs">Official JDCA</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* â”€â”€ TAB 3: SYSTEM & SETTINGS â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      {activeTab === 'system' && (
        <div className="space-y-5">
          <div className="jdca-card p-5">
            <h3 className="font-bold text-slate-900 text-base mb-1">Application Configuration</h3>
            <p className="text-xs text-slate-500 mb-4">Official JDCA scoring engine & notification parameters</p>

            <div className="space-y-4 divide-y divide-slate-100">
              <div className="flex items-center justify-between pt-3">
                <div>
                  <div className="font-semibold text-slate-900 text-sm">Live Scoring Realtime Sync</div>
                  <div className="text-xs text-slate-500">Push ball-by-ball updates to all clients instantly via Supabase</div>
                </div>
                <input type="checkbox" checked={systemSettings?.liveSync !== false} onChange={() => toggleSetting('liveSync')} className="w-4 h-4 text-[#2457D6] rounded border-slate-300 cursor-pointer" />
              </div>

              <div className="flex items-center justify-between pt-3">
                <div>
                  <div className="font-semibold text-slate-900 text-sm">Free Hit on No-Ball</div>
                  <div className="text-xs text-slate-500">Apply standard ICC free-hit rule to limited overs matches</div>
                </div>
                <input type="checkbox" checked={systemSettings?.freeHit !== false} onChange={() => toggleSetting('freeHit')} className="w-4 h-4 text-[#2457D6] rounded border-slate-300 cursor-pointer" />
              </div>

              <div className="flex items-center justify-between pt-3">
                <div>
                  <div className="font-semibold text-slate-900 text-sm">Selection Committee Notifications</div>
                  <div className="text-xs text-slate-500">Send WhatsApp / SMS alerts to selectors when new trials are posted</div>
                </div>
                <input type="checkbox" checked={systemSettings?.notifications !== false} onChange={() => toggleSetting('notifications')} className="w-4 h-4 text-[#2457D6] rounded border-slate-300 cursor-pointer" />
              </div>

              <div className="flex items-center justify-between pt-3">
                <div>
                  <div className="font-semibold text-slate-900 text-sm">Official Association Branding Watermark</div>
                  <div className="text-xs text-slate-500">Embed JDCA seal and MPCA affiliation badge onto PDF scorecards</div>
                </div>
                <input type="checkbox" checked={systemSettings?.watermark !== false} onChange={() => toggleSetting('watermark')} className="w-4 h-4 text-[#2457D6] rounded border-slate-300 cursor-pointer" />
              </div>
            </div>
          </div>

          <div className="jdca-card p-5 border border-slate-200">
            <h3 className="font-bold text-slate-900 text-sm mb-2">Association App Version</h3>
            <div className="text-xs text-slate-600 space-y-1">
              <div><strong>Platform:</strong> JDCA Official Management & Live Scoring v2.4</div>
              <div><strong>Affiliation:</strong> Madhya Pradesh Cricket Association (MPCA)</div>
              <div><strong>System Status:</strong> <span className="text-[#0FA968] font-bold">Operational (All 9 District Hubs Connected)</span></div>
            </div>
          </div>
        </div>
      )}

      {/* ── ADD USER MODAL ────────────────────────────────────── */}
      {showAddUserModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-800/80">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-900 text-base">Add Association Staff User</h3>
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
                    placeholder="e.g. Rahul Dravid"
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
                    placeholder="e.g. rahul@jdca.org"
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
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Initial Role</label>
                  <select
                    value={newRole}
                    onChange={(e) => setNewRole(e.target.value)}
                    className="w-full border border-slate-300 rounded-lg p-2 text-sm focus:outline-none focus:border-blue-500"
                  >
                    <option value="VIEWER">Viewer (Read Only)</option>
                    <option value="SCORER">Scorer</option>
                    <option value="SELECTOR">Selector</option>
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
                  {isCreatingUser ? 'Creating...' : 'Create User'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
