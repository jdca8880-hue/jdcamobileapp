import React from 'react';
import {
  Home, Calendar, Trophy, Users, Clipboard, Radio, Settings,
  LogOut, Shield, Megaphone, Award
} from 'lucide-react';
import { useCricket } from '../context/CricketContext';
import { RoleBadge } from './ui/Badge';
import { motion } from 'motion/react';

const NAV_ITEMS = [
  { id: 'home',           label: 'Home',              icon: Home,      route: 'home' },
  { id: 'teams',          label: 'Teams',              icon: Shield,    route: 'teams' },
  { id: 'selection',      label: 'Player Selection',   icon: Clipboard, route: 'selection' },
  { id: 'matches',        label: 'Matches',            icon: Calendar,  route: 'matches' },
  { id: 'tournaments',    label: 'Tournaments',        icon: Trophy,    route: 'tournaments' },
  { id: 'scoring',        label: 'Live Score',         icon: Radio,     route: 'scoring', liveIndicator: true },
  { id: 'players',        label: 'Players',            icon: Users,     route: 'players' },
  { id: 'officials',      label: 'Scorers & Umpires',  icon: Award,     route: 'officials', adminOnly: true },
  { id: 'news',           label: 'News',               icon: Megaphone, route: 'news' },
  { id: 'administration', label: 'Administration',      icon: Settings,  route: 'administration', adminOnly: true },
];

export default function Sidebar() {
  const { currentScreen, navigateTo, userRole, userEmail, logout } = useCricket();

  const visible = NAV_ITEMS.map(item => {
    if (userRole === 'SCORER' && item.id === 'administration') {
      return { ...item, label: 'Team Registration' };
    }
    return item;
  }).filter(item => {
    if (item.adminOnly && !['SUPER_ADMIN', 'DISTRICT_ADMIN', 'SCORER'].includes(userRole)) return false;
    if (userRole === 'SUPER_ADMIN' && item.id === 'scoring') return false;
    if (userRole === 'SCORER')   return ['matches','scoring','teams','tournaments','administration'].includes(item.id);
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
      'officials': 'officials', 'match-officials': 'officials',
      'administration': 'administration', 'access-control': 'administration',
      'news': 'news',
    };
    return map[currentScreen] || currentScreen;
  })();

  const userInitial = userEmail?.[0]?.toUpperCase() || 'U';
  const displayEmail = userEmail ? (userEmail.length > 22 ? userEmail.slice(0, 20) + '…' : userEmail) : 'Official User';

  return (
    <aside
      className="hidden lg:flex flex-col h-screen sticky top-0 shrink-0 z-20"
      style={{
        width: 232,
        background: '#0B1628',
        borderRight: '1px solid rgba(255,255,255,0.06)',
      }}
    >
      {/* ── Brand ─────────────────────────────────────── */}
      <div
        className="flex items-center gap-3 px-5 py-5"
        style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}
      >
        <img
          src="/jdca-logo.png"
          alt="JDCA"
          style={{ width: 40, height: 40, objectFit: 'contain', flexShrink: 0 }}
          className="drop-shadow"
        />
        <div className="min-w-0">
          <div
            className="font-bold text-white"
            style={{ fontSize: 15, letterSpacing: '-0.01em', lineHeight: 1.1 }}
          >
            JDCA
          </div>
          <div
            style={{
              fontSize: 9,
              color: '#475569',
              lineHeight: 1.3,
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
            }}
          >
            Jabalpur District Cricket
          </div>
        </div>
      </div>

      {/* ── Navigation ────────────────────────────────── */}
      <nav className="flex-1 px-3 py-4 overflow-y-auto no-scrollbar space-y-0.5">
        <div
          className="px-3 mb-3"
          style={{ fontSize: 9, color: '#334155', fontWeight: 800, letterSpacing: '0.12em', textTransform: 'uppercase' }}
        >
          Navigation
        </div>

        {visible.map((item) => {
          const Icon = item.icon;
          const isActive = activeId === item.id;
          return (
            <button
              key={item.id}
              id={`sidebar-nav-${item.id}`}
              onClick={() => navigateTo(item.route)}
              className="relative flex items-center gap-3 w-full cursor-pointer"
              style={{
                padding: '9px 12px',
                borderRadius: 10,
                border: 'none',
                background: 'transparent',
                textAlign: 'left',
                color: isActive ? '#BFDBFE' : '#475569',
                transition: 'background 0.15s ease, color 0.15s ease',
                minHeight: 40,
              }}
              onMouseEnter={e => { if (!isActive) { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.color = '#94A3B8'; } }}
              onMouseLeave={e => { if (!isActive) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#475569'; } }}
            >
              {isActive && (
                <motion.div
                  layoutId="sidebar-active-bg"
                  className="absolute inset-0"
                  style={{ borderRadius: 10, background: 'rgba(29,78,216,0.20)', zIndex: 0 }}
                  initial={false}
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}
              {/* Left accent bar */}
              {isActive && (
                <div
                  className="absolute left-0 top-2 bottom-2"
                  style={{ width: 3, background: '#3B82F6', borderRadius: '0 3px 3px 0', zIndex: 1 }}
                />
              )}
              <Icon
                size={16}
                strokeWidth={isActive ? 2.5 : 2}
                className="shrink-0 relative z-10"
              />
              <span
                className="flex-1 relative z-10 truncate"
                style={{ fontSize: 13, fontWeight: isActive ? 600 : 500 }}
              >
                {item.label}
              </span>
              {item.liveIndicator && (
                <span
                  className="shrink-0 animate-pulse relative z-10"
                  style={{
                    width: 6,
                    height: 6,
                    background: '#059669',
                    borderRadius: '50%',
                    boxShadow: '0 0 0 2px rgba(5,150,105,0.25)',
                  }}
                />
              )}
            </button>
          );
        })}
      </nav>

      {/* ── User footer ───────────────────────────────── */}
      <div
        className="px-3 pb-4 pt-3"
        style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}
      >
        {/* User card */}
        <div
          className="flex items-center gap-2.5 px-3 py-3 mb-2 rounded-xl"
          style={{ background: 'rgba(255,255,255,0.05)' }}
        >
          <div
            className="flex items-center justify-center shrink-0 rounded-full font-bold text-white"
            style={{
              width: 30,
              height: 30,
              background: '#1D4ED8',
              fontSize: 12,
            }}
          >
            {userInitial}
          </div>
          <div className="flex-1 min-w-0">
            <div
              className="truncate text-white"
              style={{ fontSize: 11, fontWeight: 600, lineHeight: 1.2 }}
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
          onClick={logout}
          id="sidebar-logout-btn"
          className="flex items-center gap-2.5 px-3 py-2 w-full rounded-lg cursor-pointer"
          style={{
            border: 'none',
            background: 'transparent',
            color: '#475569',
            fontSize: 13,
            fontWeight: 500,
            transition: 'background 0.15s, color 0.15s',
          }}
          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.color = '#94A3B8'; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#475569'; }}
        >
          <LogOut size={14} strokeWidth={2} />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}
