import React from 'react';
import {
  X, Home, Calendar, Trophy, Users, Clipboard, Radio, Settings, LogOut, Shield, Megaphone, Moon, Sun
} from 'lucide-react';
import { useCricket } from '../context/CricketContext';
import { RoleBadge } from './ui/Badge';
import { motion, AnimatePresence } from 'motion/react';

const ALL_NAV = [
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

const ACTIVE_MAP = {
  'home': 'home', 'matches': 'matches', 'match-setup': 'matches',
  'match-overview': 'matches', 'match-result': 'matches', 'innings-break': 'matches',
  'scoring': 'scoring', 'scorecard': 'scoring',
  'tournaments': 'tournaments',
  'teams': 'teams',
  'players': 'players', 'scouting': 'players', 'player-profile': 'players', 'player-registration': 'players',
  'selection': 'selection', 'selectors': 'selection',
  'administration': 'administration', 'access-control': 'administration',
  'news': 'news',
};

export default function DrawerMenu() {
  const { drawerOpen, setDrawerOpen, navigateTo, currentScreen, userRole, userEmail, setIsAuthenticated, isDarkMode, setIsDarkMode } = useCricket();

  const activeId = ACTIVE_MAP[currentScreen] || currentScreen;

  const visible = ALL_NAV.filter(item => {
    if (item.adminOnly && !['SUPER_ADMIN', 'DISTRICT_ADMIN'].includes(userRole)) return false;
    if (userRole === 'SUPER_ADMIN' && item.id === 'scoring') return false;
    if (userRole === 'SCORER')   return ['home','matches','scoring','teams','tournaments','news'].includes(item.id);
    if (userRole === 'SELECTOR') return ['home','players','selection','teams','tournaments','news'].includes(item.id);
    if (userRole === 'VIEWER')   return ['home','matches','players','teams','tournaments','news'].includes(item.id);
    return true;
  });

  const handleNav = (route) => {
    navigateTo(route);
    setDrawerOpen(false);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setDrawerOpen(false);
    navigateTo('welcome');
  };

  return (
    <AnimatePresence>
      {drawerOpen && (
        <div className="fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm"
            onClick={() => setDrawerOpen(false)}
          />

          {/* Drawer panel */}
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="relative flex flex-col h-full shadow-2xl z-10"
            style={{
              width: 280,
              background: 'rgba(16, 24, 39, 0.85)',
              backdropFilter: 'blur(16px)',
              borderRight: '1px solid rgba(255,255,255,0.1)',
            }}
          >
            {/* Header */}
            <div
              className="flex items-center justify-between px-5 py-4"
              style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}
            >
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center flex-shrink-0">
                  <img src="/jdca-logo.png" alt="JDCA Logo" style={{ width: 42, height: 42, objectFit: 'contain' }} className="drop-shadow-md" />
                </div>
                <div>
                  <div className="font-bold text-white" style={{ fontSize: 14 }}>JDCA</div>
                  <div style={{ fontSize: 10, color: '#8a99b0' }}>Jabalpur District Cricket Association</div>
                </div>
              </div>
              <button
                onClick={() => setDrawerOpen(false)}
                className="flex items-center justify-center w-8 h-8 rounded-lg cursor-pointer transition-colors hover:bg-white/10"
                style={{ background: 'rgba(255,255,255,0.08)', border: 'none' }}
                id="drawer-close-btn"
              >
                <X size={17} style={{ color: '#8a99b0' }} />
              </button>
            </div>

            {/* Nav items */}
            <nav className="flex-1 px-4 py-6 overflow-y-auto no-scrollbar space-y-1.5">
              <div className="px-3 mb-4 font-bold tracking-wider" style={{ color: '#8a99b0', fontSize: 11 }}>
                MENU
              </div>
              {visible.map((item) => {
                const Icon = item.icon;
                const isActive = activeId === item.id;
                return (
                  <button
                    key={item.id}
                    id={`drawer-nav-${item.id}`}
                    onClick={() => handleNav(item.route)}
                    className={`relative flex items-center gap-3 px-3 py-3 rounded-xl w-full transition-colors ${isActive ? 'text-white' : 'text-[#8a99b0] hover:text-white hover:bg-white/5'}`}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="drawer-active-indicator"
                        className="absolute inset-0 bg-[#2457D6] rounded-xl -z-10 shadow-[0_0_15px_rgba(36,87,214,0.3)]"
                        transition={{ type: "spring", stiffness: 400, damping: 30 }}
                      />
                    )}
                    <Icon size={18} strokeWidth={isActive ? 2.5 : 2} className="flex-shrink-0" />
                    <span className={`flex-1 text-left ${isActive ? 'font-bold' : 'font-medium'}`} style={{ fontSize: 15 }}>{item.label}</span>
                    {item.liveIndicator && <span className="w-1.5 h-1.5 bg-[#0FA968] rounded-full animate-pulse shadow-[0_0_6px_rgba(15,169,104,0.5)]" />}
                  </button>
                );
              })}
            </nav>

            {/* User footer */}
            <div className="px-4 pb-6 pt-4" style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}>
              <div className="px-3 py-3 rounded-xl mb-3 border border-white/5" style={{ background: 'rgba(255,255,255,0.05)' }}>
                <div className="font-bold text-white mb-1.5" style={{ fontSize: 13 }}>
                  {userEmail || 'JDCA Official'}
                </div>
                <RoleBadge role={userRole} />
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setIsDarkMode(!isDarkMode)}
                  className="flex flex-1 items-center justify-center gap-2 px-3 py-2.5 text-[#8a99b0] hover:text-white hover:bg-white/5 rounded-xl transition-colors"
                >
                  {isDarkMode ? <Sun size={16} strokeWidth={2} /> : <Moon size={16} strokeWidth={2} />}
                  <span className="font-medium" style={{ fontSize: 14 }}>{isDarkMode ? 'Light' : 'Dark'}</span>
                </button>
                <button
                  onClick={handleLogout}
                  className="flex flex-1 items-center justify-center gap-2 px-3 py-2.5 text-[#8a99b0] hover:text-white hover:bg-white/5 rounded-xl transition-colors"
                  id="drawer-logout-btn"
                >
                  <LogOut size={16} strokeWidth={2} />
                  <span className="font-medium" style={{ fontSize: 14 }}>Sign Out</span>
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
