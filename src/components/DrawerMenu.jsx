import React from 'react';
import {
  X, Home, Calendar, Trophy, Users, Clipboard, Radio, Settings, LogOut, Shield, Megaphone, Award, Sun, Moon, Bell, BellOff
} from 'lucide-react';
import { useCricket } from '../context/CricketContext';
import { RoleBadge } from './ui/Badge';
import { motion, AnimatePresence } from 'motion/react';

const ALL_NAV = [
  { id: 'home', label: 'Home', icon: Home, route: 'home' },
  { id: 'teams', label: 'Teams', icon: Shield, route: 'teams' },
  { id: 'selection', label: 'Player Selection', icon: Clipboard, route: 'selection' },
  { id: 'matches', label: 'Matches', icon: Calendar, route: 'matches' },
  { id: 'tournaments', label: 'Tournaments', icon: Trophy, route: 'tournaments' },
  { id: 'scoring', label: 'Live Score', icon: Radio, route: 'scoring', liveIndicator: true },
  { id: 'players', label: 'Players', icon: Users, route: 'players' },
  { id: 'officials', label: 'Scorers & Umpires', icon: Award, route: 'officials', adminOnly: true },
  { id: 'news', label: 'News', icon: Megaphone, route: 'news' },
  { id: 'administration', label: 'Administration', icon: Settings, route: 'administration', adminOnly: true },
];

const ACTIVE_MAP = {
  'home': 'home', 'matches': 'matches', 'match-setup': 'matches',
  'match-overview': 'matches', 'match-result': 'matches', 'innings-break': 'matches',
  'scoring': 'scoring', 'scorecard': 'scoring',
  'tournaments': 'tournaments',
  'teams': 'teams',
  'players': 'players', 'scouting': 'players', 'player-profile': 'players', 'player-registration': 'players',
  'selection': 'selection', 'selectors': 'selection',
  'officials': 'officials', 'match-officials': 'officials',
  'administration': 'administration', 'access-control': 'administration',
  'news': 'news',
};

export default function DrawerMenu() {
  const { drawerOpen, setDrawerOpen, navigateTo, currentScreen, userRole, userEmail, logout, isDarkMode, setIsDarkMode, notificationsEnabled, toggleNotifications } = useCricket();

  const activeId = ACTIVE_MAP[currentScreen] || currentScreen;

  const visible = ALL_NAV.map(item => {
    if (userRole === 'SCORER' && item.id === 'administration') {
      return { ...item, label: 'Team Registration' };
    }
    return item;
  }).filter(item => {
    if (item.adminOnly && !['SUPER_ADMIN', 'DISTRICT_ADMIN', 'SCORER'].includes(userRole)) return false;
    if (userRole === 'SUPER_ADMIN' && item.id === 'scoring') return false;
    if (userRole === 'SCORER') return ['matches', 'scoring', 'teams', 'tournaments', 'administration'].includes(item.id);
    if (userRole === 'SELECTOR') return ['home', 'players', 'selection', 'teams', 'tournaments', 'news'].includes(item.id);
    if (userRole === 'VIEWER') return ['home', 'matches', 'players', 'teams', 'tournaments', 'news'].includes(item.id);
    return true;
  });

  const handleNav = (route) => {
    navigateTo(route);
    setDrawerOpen(false);
  };

  const handleLogout = () => {
    setDrawerOpen(false);
    logout();
  };

  const userInitial = userEmail?.[0]?.toUpperCase() || 'U';
  const displayEmail = userEmail
    ? (userEmail.length > 26 ? userEmail.slice(0, 24) + '…' : userEmail)
    : 'JDCA Official';

  return (
    <AnimatePresence>
      {drawerOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.55)' }}
            onClick={() => setDrawerOpen(false)}
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 26, stiffness: 220 }}
            className="relative flex flex-col h-full z-10 overflow-hidden"
            style={{
              width: 288,
              background: '#0A0A0A',
              borderRight: '1px solid rgba(255,255,255,0.08)',
            }}
          >
            {/* Header */}
            <div
              className="flex items-center justify-between px-5 py-4"
              style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}
            >
              <div className="flex items-center gap-3">
                <img
                  src="/jdca-logo.png"
                  alt="JDCA"
                  style={{ width: 38, height: 38, objectFit: 'contain', flexShrink: 0 }}
                />
                <div>
                  <div className="font-bold text-white flex items-center gap-1.5" style={{ fontSize: 14, letterSpacing: '-0.01em' }}>
                    JDCA
                    <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#A3E635', display: 'inline-block' }} />
                  </div>
                  <div style={{ fontSize: 9, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.07em' }}>
                    Jabalpur District Cricket
                  </div>
                </div>
              </div>
              <button
                onClick={() => setDrawerOpen(false)}
                id="drawer-close-btn"
                className="flex items-center justify-center cursor-pointer"
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 8,
                  border: '1px solid rgba(255,255,255,0.10)',
                  background: 'rgba(255,255,255,0.06)',
                  color: '#64748B',
                }}
              >
                <X size={16} />
              </button>
            </div>

            {/* Nav */}
            <nav className="flex-1 px-3 py-4 overflow-y-auto no-scrollbar space-y-0.5">
              <div
                className="px-3 mb-3"
                style={{ fontSize: 9, color: '#64748B', fontWeight: 800, letterSpacing: '0.12em', textTransform: 'uppercase' }}
              >
                Menu
              </div>

              {visible.map((item) => {
                const Icon = item.icon;
                const isActive = activeId === item.id;
                return (
                  <button
                    key={item.id}
                    id={`drawer-nav-${item.id}`}
                    onClick={() => handleNav(item.route)}
                    className="relative flex items-center gap-3 w-full cursor-pointer"
                    style={{
                      padding: '10px 13px',
                      borderRadius: 10,
                      border: 'none',
                      background: isActive ? 'rgba(163,230,53,0.15)' : 'transparent',
                      color: isActive ? '#A3E635' : '#64748B',
                      textAlign: 'left',
                      minHeight: 44,
                      transition: 'background 0.15s, color 0.15s',
                    }}
                  >
                    {isActive && (
                      <div
                        className="absolute left-0 top-2 bottom-2"
                        style={{ width: 3, background: '#A3E635', borderRadius: '0 3px 3px 0', boxShadow: '0 0 8px rgba(163,230,53,0.6)' }}
                      />
                    )}
                    <Icon
                      size={17}
                      strokeWidth={isActive ? 2.5 : 2}
                      className="shrink-0"
                    />
                    <span
                      className="flex-1"
                      style={{ fontSize: 15, fontWeight: isActive ? 700 : 500 }}
                    >
                      {item.label}
                    </span>
                    {item.liveIndicator && (
                      <span
                        className="shrink-0 animate-pulse"
                        style={{
                          width: 7,
                          height: 7,
                          background: '#A3E635',
                          borderRadius: '50%',
                          boxShadow: '0 0 8px rgba(163,230,53,0.7)',
                        }}
                      />
                    )}
                  </button>
                );
              })}
            </nav>

            {/* User footer */}
            <div
              className="px-3 pb-6 pt-3"
              style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}
            >
              {/* Notification Off / On Toggle Button */}
              <button
                type="button"
                id="drawer-notification-off-btn"
                onClick={toggleNotifications}
                className="flex items-center justify-between w-full px-3 py-2 mb-2 rounded-xl cursor-pointer transition-colors duration-150 group"
                style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.07)',
                  color: '#F3F4F6',
                }}
                aria-label={notificationsEnabled ? 'Turn Notifications Off' : 'Turn Notifications On'}
                title={notificationsEnabled ? 'Notifications are ON (Click to turn OFF)' : 'Notifications are OFF (Click to turn ON)'}
              >
                <div className="flex items-center gap-2.5">
                  <div
                    className="flex items-center justify-center rounded-lg w-6 h-6 transition-colors"
                    style={{
                      background: notificationsEnabled ? 'rgba(163, 230, 53, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                      color: notificationsEnabled ? '#A3E635' : '#EF4444',
                    }}
                  >
                    {notificationsEnabled ? <Bell size={13} className="text-[#A3E635]" /> : <BellOff size={13} className="text-rose-400" />}
                  </div>
                  <span style={{ fontSize: 13, fontWeight: 600, color: '#E2E8F0' }}>
                    {notificationsEnabled ? 'Notifications: On' : 'Notifications: Off'}
                  </span>
                </div>

                <div
                  className="relative flex items-center p-0.5 rounded-full transition-colors duration-200"
                  style={{
                    width: 32,
                    height: 18,
                    background: notificationsEnabled ? '#A3E635' : 'rgba(255, 255, 255, 0.20)',
                    boxShadow: notificationsEnabled ? '0 0 8px rgba(163, 230, 53, 0.4)' : 'none',
                  }}
                >
                  <motion.div
                    className="rounded-full shadow-xs"
                    style={{
                      width: 14,
                      height: 14,
                      background: notificationsEnabled ? '#0A0A0A' : '#FFFFFF',
                    }}
                    animate={{ x: notificationsEnabled ? 14 : 0 }}
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  />
                </div>
              </button>

              {/* Dark Mode Little Toggle Button */}
              <button
                type="button"
                id="drawer-dark-mode-toggle"
                onClick={() => setIsDarkMode(prev => !prev)}
                className="flex items-center justify-between w-full px-3 py-2 mb-2 rounded-xl cursor-pointer transition-colors duration-150 group"
                style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.07)',
                  color: '#F3F4F6',
                }}
                aria-label={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              >
                <div className="flex items-center gap-2.5">
                  <div
                    className="flex items-center justify-center rounded-lg w-6 h-6 transition-colors"
                    style={{
                      background: isDarkMode ? 'rgba(163, 230, 53, 0.15)' : 'rgba(255, 255, 255, 0.10)',
                      color: isDarkMode ? '#A3E635' : '#94A3B8',
                    }}
                  >
                    {isDarkMode ? <Moon size={13} className="text-[#A3E635]" /> : <Sun size={13} className="text-amber-400" />}
                  </div>
                  <span style={{ fontSize: 13, fontWeight: 600, color: '#E2E8F0' }}>
                    Dark Mode
                  </span>
                </div>

                {/* Little Toggle Switch */}
                <div
                  className="relative flex items-center p-0.5 rounded-full transition-colors duration-200"
                  style={{
                    width: 32,
                    height: 18,
                    background: isDarkMode ? '#A3E635' : 'rgba(255, 255, 255, 0.20)',
                    boxShadow: isDarkMode ? '0 0 8px rgba(163, 230, 53, 0.4)' : 'none',
                  }}
                >
                  <motion.div
                    className="rounded-full shadow-xs"
                    style={{
                      width: 14,
                      height: 14,
                      background: isDarkMode ? '#0A0A0A' : '#FFFFFF',
                    }}
                    animate={{ x: isDarkMode ? 14 : 0 }}
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  />
                </div>
              </button>

              {/* User info */}
              <div
                className="flex items-center gap-3 px-3 py-3 mb-2 rounded-xl"
                style={{ background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.06)' }}
              >
                <div
                  className="flex items-center justify-center shrink-0 rounded-full font-black text-[#0A0A0A]"
                  style={{ width: 32, height: 32, background: '#A3E635', fontSize: 13, boxShadow: '0 0 10px rgba(163,230,53,0.3)' }}
                >
                  {userInitial}
                </div>
                <div className="flex-1 min-w-0">
                  <div
                    className="text-white truncate"
                    style={{ fontSize: 12, fontWeight: 600 }}
                  >
                    {displayEmail}
                  </div>
                  <div className="mt-1">
                    <RoleBadge role={userRole} />
                  </div>
                </div>
              </div>

              {/* Sign out */}
              <button
                onClick={handleLogout}
                id="drawer-logout-btn"
                className="flex items-center gap-3 px-3 py-2.5 w-full rounded-lg cursor-pointer"
                style={{
                  border: 'none',
                  background: 'transparent',
                  color: '#64748B',
                  fontSize: 14,
                  fontWeight: 500,
                  transition: 'background 0.15s, color 0.15s',
                }}
              >
                <LogOut size={15} strokeWidth={2} />
                <span>Sign Out</span>
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
