import React, { useState } from 'react';
import { useCricket } from '../../context/CricketContext';
import { Megaphone, Bell, Calendar, ChevronRight, Plus, X, Loader2 } from 'lucide-react';
import { api } from '../../lib/api';

const ANNOUNCEMENT_THEMES = {
  Alert: 'bg-rose-50 text-rose-900 border-rose-200 tag-bg-rose-100 tag-text-rose-700',
  Circular: 'bg-blue-50 text-blue-900 border-blue-200 tag-bg-blue-100 tag-text-blue-700',
  Trial: 'bg-emerald-50 text-emerald-900 border-emerald-200 tag-bg-emerald-100 tag-text-emerald-700',
  Update: 'bg-amber-50 text-amber-900 border-amber-200 tag-bg-amber-100 tag-text-amber-700',
};

export default function NewsScreen() {
  const { announcements = [], setAnnouncements, userPermissions } = useCricket();
  const [activeTab, setActiveTab] = useState('All');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [newNotice, setNewNotice] = useState({ title: '', body: '', type: 'Update' });

  const tabs = ['All', 'Alert', 'Circular', 'Trial', 'Update'];

  const filteredAnnouncements = activeTab === 'All' 
    ? announcements 
    : announcements.filter(a => a.type === activeTab);

  return (
    <div className="pb-[100px] bg-slate-50 min-h-screen">
      <div className="pt-6 px-4 pb-4 bg-white/95 backdrop-blur-md sticky top-0 z-30 border-b border-gray-200 shadow-2xs">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <Megaphone className="text-rose-600" size={24} />
            News & Notices
          </h1>
          {userPermissions?.can_add && (
            <button 
              onClick={() => setIsAddModalOpen(true)}
              className="inline-flex items-center gap-1.5 bg-blue-600 text-white px-4 py-2 rounded-xl text-sm font-bold shadow hover:bg-blue-700 transition"
            >
              <Plus size={16} /> Add Notice
            </button>
          )}
        </div>
        
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
          {tabs.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`whitespace-nowrap px-4 py-1.5 rounded-full text-xs font-bold transition-colors cursor-pointer ${
                activeTab === tab 
                  ? 'bg-slate-900 text-white shadow-xs' 
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      <div className="px-4 pt-6 space-y-4">
        {filteredAnnouncements.length === 0 ? (
          <div className="text-center py-12 px-4 bg-white rounded-2xl border border-gray-100 mt-4 shadow-sm">
            <Bell size={32} className="mx-auto text-slate-300 mb-3" />
            <h3 className="text-base font-bold text-slate-900 mb-1">No Notices Found</h3>
            <p className="text-xs text-slate-500">There are no {activeTab !== 'All' ? activeTab : ''} announcements at this time.</p>
          </div>
        ) : (
          filteredAnnouncements.map((ann, idx) => {
            const theme = ANNOUNCEMENT_THEMES[ann.type] || ANNOUNCEMENT_THEMES['Update'];
            const cardStyle = theme.split(' ').filter(c => c.startsWith('bg-') || c.startsWith('text-') || c.startsWith('border-')).join(' ');
            
            let tagBg = 'bg-amber-100 text-amber-700';
            if (theme.includes('tag-bg-rose-100')) tagBg = 'bg-rose-100 text-rose-700';
            if (theme.includes('tag-bg-blue-100')) tagBg = 'bg-blue-100 text-blue-700';
            if (theme.includes('tag-bg-emerald-100')) tagBg = 'bg-emerald-100 text-emerald-700';

            return (
              <div
                key={ann.id || idx}
                className={`p-4 sm:p-5 rounded-2xl ${cardStyle} border hover:scale-[1.01] hover:shadow-md shadow-sm transition-all cursor-pointer relative overflow-hidden group`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                  <span className={`text-xs font-black uppercase tracking-wider px-2.5 py-1 rounded-md backdrop-blur-xs w-fit ${tagBg}`}>
                    {ann.type}
                  </span>
                  <span className="text-xs opacity-70 font-bold flex items-center gap-1.5">
                    <Calendar size={12} /> {ann.date}
                  </span>
                </div>
                <div className="text-base font-black leading-tight mb-2 pr-6 group-hover:text-rose-700 transition-colors">
                  {ann.title}
                </div>
                <p className="text-sm opacity-90 leading-relaxed font-semibold">
                  {ann.body}
                </p>
                <ChevronRight className="absolute right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-50 transition-all -translate-x-4 group-hover:translate-x-0" />
              </div>
            );
          })
        )}
      </div>

      {/* Add Notice Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden flex flex-col">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-slate-50">
              <h2 className="text-[18px] font-black text-slate-900">Post New Notice</h2>
              <button 
                onClick={() => setIsAddModalOpen(false)}
                className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-slate-200 text-slate-400 transition"
              >
                <X size={18} />
              </button>
            </div>
            
            <form onSubmit={async (e) => {
              e.preventDefault();
              setIsSaving(true);
              try {
                const dateOpts = { month: 'short', day: 'numeric', year: 'numeric' };
                const formattedDate = new Date().toLocaleDateString('en-US', dateOpts);
                const saved = await api.createAnnouncement({ ...newNotice, date: formattedDate });
                setAnnouncements(prev => [saved, ...prev]);
                setIsAddModalOpen(false);
                setNewNotice({ title: '', body: '', type: 'Update' });
              } catch(err) {
                console.error(err);
                alert("Failed to post notice.");
              } finally {
                setIsSaving(false);
              }
            }} className="p-6 space-y-4">
              
              <div className="space-y-1.5">
                <label className="text-[12px] font-bold text-slate-700 uppercase">Notice Title</label>
                <input 
                  type="text" 
                  value={newNotice.title}
                  onChange={e => setNewNotice({...newNotice, title: e.target.value})}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-[14px] font-medium text-slate-900 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[12px] font-bold text-slate-700 uppercase">Notice Type</label>
                <select 
                  value={newNotice.type}
                  onChange={e => setNewNotice({...newNotice, type: e.target.value})}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-[14px] font-medium text-slate-900 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                >
                  <option value="Update">Update</option>
                  <option value="Alert">Alert</option>
                  <option value="Circular">Circular</option>
                  <option value="Trial">Trial</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-[12px] font-bold text-slate-700 uppercase">Message Details</label>
                <textarea 
                  value={newNotice.body}
                  onChange={e => setNewNotice({...newNotice, body: e.target.value})}
                  rows={4}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-[14px] font-medium text-slate-900 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 resize-none"
                  required
                />
              </div>

              <button 
                type="submit"
                disabled={isSaving}
                className="w-full py-3.5 rounded-xl text-[14px] font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-sm transition disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isSaving && <Loader2 size={16} className="animate-spin" />}
                {isSaving ? 'Posting...' : 'Post Notice'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
