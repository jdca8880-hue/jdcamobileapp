import React, { useState } from 'react';
import { Users, Shield, Edit2, Trash2 } from 'lucide-react';
import { useCricket } from '../../context/CricketContext';

export default function JdcaManagementTab() {
  const { registeredUsers } = useCricket();

  const scorers = registeredUsers.filter(u => u.role?.toUpperCase() === 'SCORER');
  const selectors = registeredUsers.filter(u => u.role?.toUpperCase() === 'SELECTOR');

  return (
    <div className="space-y-6 animate-in fade-in zoom-in-95 duration-200">
      
      {/* Scorers Section */}
      <div className="jdca-card overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center gap-2 bg-blue-50/30">
          <Shield className="w-5 h-5 text-blue-600" />
          <h3 className="font-bold text-slate-900 text-sm uppercase tracking-widest">Official Scorers</h3>
        </div>
        <div className="p-4">
          <p className="text-xs text-slate-500 mb-4">
            These are the designated official scorers. Only users with the SCORER role will appear in the Match Setup drop-downs.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {scorers.length > 0 ? scorers.map(s => (
              <div key={s.id} className="p-3 border border-slate-200 rounded-xl bg-white shadow-sm flex items-center justify-between">
                <div>
                  <div className="font-bold text-slate-900 text-sm">{s.name}</div>
                  <div className="text-xs text-slate-500">{s.email}</div>
                </div>
                <div className="text-[10px] font-bold bg-blue-100 text-blue-700 px-2 py-1 rounded">SCORER</div>
              </div>
            )) : (
              <div className="col-span-full p-4 text-center text-slate-400 text-xs bg-slate-50 rounded-xl">
                No official scorers assigned yet. Go to Staff & Users to create one.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Selectors Section */}
      <div className="jdca-card overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center gap-2 bg-purple-50/30">
          <Users className="w-5 h-5 text-purple-600" />
          <h3 className="font-bold text-slate-900 text-sm uppercase tracking-widest">Selection Committee</h3>
        </div>
        <div className="p-4">
          <p className="text-xs text-slate-500 mb-4">
            These officials have the SELECTOR role and manage team compositions.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {selectors.length > 0 ? selectors.map(s => (
              <div key={s.id} className="p-3 border border-slate-200 rounded-xl bg-white shadow-sm flex items-center justify-between">
                <div>
                  <div className="font-bold text-slate-900 text-sm">{s.name}</div>
                  <div className="text-xs text-slate-500">{s.email}</div>
                </div>
                <div className="text-[10px] font-bold bg-purple-100 text-purple-700 px-2 py-1 rounded">SELECTOR</div>
              </div>
            )) : (
              <div className="col-span-full p-4 text-center text-slate-400 text-xs bg-slate-50 rounded-xl">
                No selectors assigned yet. Go to Staff & Users to assign someone.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Umpires Notice Section */}
      <div className="jdca-card overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center gap-2 bg-emerald-50/30">
          <Edit2 className="w-5 h-5 text-emerald-600" />
          <h3 className="font-bold text-slate-900 text-sm uppercase tracking-widest">Match Umpires</h3>
        </div>
        <div className="p-4">
          <p className="text-xs text-slate-600 font-medium">
            Umpires are filled manually during the Match Setup phase for each specific match. They do not need to be predefined here.
          </p>
        </div>
      </div>

    </div>
  );
}
