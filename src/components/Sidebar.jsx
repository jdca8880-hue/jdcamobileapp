import React from 'react';
import {
  Home, Calendar, Trophy, Users, Clipboard, Radio, Settings,
  ChevronRight, LogOut, Shield, Megaphone
} from 'lucide-react';
import { useCricket } from '../context/CricketContext';
import { RoleBadge } from './ui/Badge';
import { motion } from 'motion/react';

const NAV_ITEMS = [
  { id: 'home',           label: 'Home',          icon: Home,      route: 'home' },
  { id: 'teams',          label: 'Teams',          icon: Shield,    route: 'teams' },
  { id: 'selection',      label: 'Player Selection',      icon: Clipboard, route: 'selection' },
  { id: 'matches',        label: 'Matches',        icon: Calendar,  route: 'matches' },
  { id: 'tournaments',    label: 'Tournaments',    icon: Trophy,    route: 'tournaments' },
  { id: 'scoring',        label: 'Live Score',   icon: Radio,     route: 'scoring', liveIndicator: true },
  { id: 'players',        label: 'Players',        icon: Users,     route: 'players' },
  { id: 'news',           label: 'News',           icon: Megaphone, route: 'news' },
  { id: 'administration', label: 'Administration', icon: Settings,  route: 'administration', adminOnly: true },
];

export default function Sidebar() {
  const { currentScreen, navigateTo, userRole, userEmail, setIsAuthenticated } = useCricket();

  const visible = NAV_ITEMS.filter(item => {
    if (item.adminOnly && !['SUPER_ADMIN', 'DISTRICT_ADMIN'].includes(userRole)) return false;
    if (userRole === 'SUPER_ADMIN' && item.id === 'scoring') return false;
    if (userRole === 'SCORER')   return ['home','matches','scoring','teams','tournaments','news'].includes(item.id);
    if (userRole === 'SELECTOR') return ['home','players','selection','teams','tournaments','news'].includes(item.id);
    if (userRole === 'VIEWER')   return ['home','matches','players','teams','tournaments','news'].includes(item.id);
    return true;
  });

  const activeId = (() => {
    const map = {
      'home': 'home', 'matches': 'matches', 'match-setup': 'matches',
      'match-overview': 'matches', 'match-result': 'matches', 'innings-break': 'matches',
      'tournaments': 'tournaments',
      'teams': 'teams',
      'players': 'players', 'scouting': 'players', 'player-profile': 'players', 'player-registration': 'players',
      'selectors': 'selection', 'selection': 'selection',
      'scoring': 'scoring', 'scorecard': 'scoring',
      'administration': 'administration', 'access-control': 'administration',
    };
    return map[currentScreen] || currentScreen;
  })();

  const handleLogout = () => {
    setIsAuthenticated(false);
    navigateTo('welcome');
  };

  return (
    <aside
      className="hidden lg:flex flex-col h-screen sticky top-0 flex-shrink-0 relative z-20"
      style={{ width: 228, background: '#101827', borderRight: '1px solid rgba(255,255,255,0.06)' }}
    >
      {/* Brand */}
      <div className="px-5 pt-6 pb-5" style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
        <div className="flex items-center gap-3 mb-1">
          <div
            className="flex items-center justify-center flex-shrink-0"
            aria-label="JDCA"
          >
            <img src="/jdca-logo.png" alt="JDCA Logo" style={{ width: 44, height: 44, objectFit: 'contain' }} className="drop-shadow-md" />
          </div>
          <div>
            <div className="font-bold text-white" style={{ fontSize: 16, lineHeight: 1.05, letterSpacing: '0.02em' }}>JDCA</div>
            <div style={{ fontSize: 9, color: '#8a99b0', lineHeight: 1.35, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Jabalpur District Cricket Association</div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 overflow-y-auto no-scrollbar space-y-1">
        <div className="sidebar-kicker px-3 mb-3">JDCA / CURRENT SEASON</div>

        {visible.map((item) => {
          const Icon = item.icon;
          const isActive = activeId === item.id;
          return (
            <button
              key={item.id}
              id={`sidebar-nav-${item.id}`}
              onClick={() => navigateTo(item.route)}
              className={`relative flex items-center gap-3 px-3 py-2.5 rounded-lg w-full transition-colors ${isActive ? 'text-white' : 'text-[#8a99b0] hover:text-white hover:bg-white/5'}`}
            >
              {isActive && (
                <motion.div
                  layoutId="sidebar-active-indicator"
                  className="absolute inset-0 bg-[#2457D6] rounded-lg -z-10"
                  initial={false}
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
              <Icon size={17} strokeWidth={isActive ? 2.5 : 2} className="flex-shrink-0" />
              <span className={`flex-1 text-left ${isActive ? 'font-semibold' : 'font-medium'}`} style={{ fontSize: 14 }}>{item.label}</span>
              {item.liveIndicator && (
                <span className="flex-shrink-0 w-1.5 h-1.5 bg-[#0FA968] rounded-full animate-pulse shadow-[0_0_0_2px_rgba(15,169,104,0.3)]" />
              )}
            </button>
          );
        })}
      </nav>

      {/* User footer */}
      <div className="px-3 pb-5 pt-3" style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}>
        <div className="px-3 py-3 rounded-lg mb-2" style={{ background: 'rgba(255,255,255,0.05)' }}>
          <div className="flex items-center gap-2 mb-1.5">
            <div
              className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0"
              style={{ background: '#2457D6', fontSize: 11, fontWeight: 700, color: '#fff' }}
            >
              {userEmail?.[0]?.toUpperCase() || 'U'}
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-semibold text-white truncate" style={{ fontSize: 12 }}>
                {userEmail || 'Official User'}
              </div>
            </div>
          </div>
          <RoleBadge role={userRole} />
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2 w-full text-[#8a99b0] hover:text-white hover:bg-white/5 rounded-lg transition-colors"
          id="sidebar-logout-btn"
        >
          <LogOut size={15} strokeWidth={2} />
          <span style={{ fontSize: 13 }} className="font-medium">Sign Out</span>
        </button>
      </div>
    </aside>
  );
}
