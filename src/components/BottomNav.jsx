import React, { useState, useEffect } from 'react';
import { useCricket } from '../context/CricketContext';
import { Home, Calendar, Radio, Shield, MoreHorizontal } from 'lucide-react';
import { motion } from 'motion/react';

export default function BottomNav() {
  const { currentScreen, navigateTo, userRole, drawerOpen, setDrawerOpen } = useCricket();
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const scrollContainer = document.querySelector('main');
    let lastY = 0;
    let ticking = false;

    const handleScroll = () => {
      const y = scrollContainer ? scrollContainer.scrollTop : window.scrollY;
      if (!ticking) {
        window.requestAnimationFrame(() => {
          if (y > 80 && y > lastY + 10) {
            setIsVisible(false);
          } else if (y < lastY - 10 || y <= 30) {
            setIsVisible(true);
          }
          lastY = y;
          ticking = false;
        });
        ticking = true;
      }
    };

    if (scrollContainer) scrollContainer.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      if (scrollContainer) scrollContainer.removeEventListener('scroll', handleScroll);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  if (currentScreen === 'welcome' || currentScreen === 'scoring') return null;

  const ACTIVE_MAP = {
    'home': 'home',
    'matches': 'matches', 'match-setup': 'matches', 'match-overview': 'matches',
    'match-result': 'matches', 'innings-break': 'matches',
    'scoring': 'scoring', 'scorecard': 'scoring',
    'teams': 'teams',
    'players': 'players', 'scouting': 'players',
    'player-profile': 'players',
    'player-registration': 'players',
    'selection': 'selection', 'selectors': 'selection',
    'administration': 'administration', 'access-control': 'administration',
    'officials': 'more', 'match-officials': 'more',
    'tournaments': 'more',
    'news': 'more',
  };

  const activeId = ACTIVE_MAP[currentScreen] || 'home';

  const getNavItems = () => {
    const allItems = [
      { id: 'home',    label: 'Home',    icon: Home,          route: 'home' },
      { id: 'matches', label: 'Matches', icon: Calendar,      route: 'matches' },
      { id: 'scoring', label: 'Score',   icon: Radio,         route: 'scoring', liveIndicator: true },
      { id: 'teams',   label: 'Teams',   icon: Shield,        route: 'teams' },
      { id: 'more',    label: 'More',    icon: MoreHorizontal, route: '#' },
    ];

    return allItems.filter(item => {
      if (item.id === 'more' || item.id === 'teams') return true;
      if (item.id === 'home') return userRole !== 'SCORER';
      if (item.id === 'scoring') return ['DISTRICT_ADMIN', 'SCORER'].includes(userRole);
      if (item.id === 'matches') return ['SUPER_ADMIN', 'DISTRICT_ADMIN', 'SCORER', 'VIEWER'].includes(userRole);
      return true;
    });
  };

  const tabs = getNavItems();

  return (
    <nav
      className={`lg:hidden fixed bottom-0 left-0 right-0 z-50 transition-transform duration-300 ease-in-out ${
        isVisible ? 'translate-y-0' : 'translate-y-full'
      }`}
      style={{
        background: '#0A0A0A',
        borderTop: '1px solid rgba(255,255,255,0.08)',
        paddingBottom: 'max(8px, env(safe-area-inset-bottom))',
        height: 'calc(64px + max(0px, env(safe-area-inset-bottom)))',
      }}
    >
      <div
        className="flex items-stretch justify-around no-scrollbar"
        style={{ height: 64 }}
      >
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeId === tab.id;
          const isMore = tab.id === 'more';
          const isMoreOpen = isMore && drawerOpen;

          const handleClick = () => {
            if (isMore) setDrawerOpen(true);
            else navigateTo(tab.route);
          };

          return (
            <button
              key={tab.id}
              onClick={handleClick}
              className="flex flex-col items-center justify-center flex-1 gap-1 cursor-pointer outline-none relative"
              style={{ border: 'none', background: 'transparent' }}
            >
              {/* Active glow indicator at top */}
              {(isActive && !isMore) && (
                <motion.div
                  layoutId="bottom-nav-top-bar"
                  className="absolute top-0 left-1/2"
                  style={{
                    height: 2.5,
                    width: 28,
                    background: '#A3E635',
                    borderRadius: '0 0 4px 4px',
                    transform: 'translateX(-50%)',
                    boxShadow: '0 0 10px rgba(163,230,53,0.8)',
                  }}
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}

              {/* Icon container */}
              <div
                className="relative flex items-center justify-center"
                style={{
                  width: 40,
                  height: 30,
                  borderRadius: 8,
                  background: (isActive && !isMore) ? 'rgba(163,230,53,0.15)' : 'transparent',
                  transition: 'background 0.2s ease',
                }}
              >
                <Icon
                  size={isActive ? 21 : 20}
                  strokeWidth={isActive ? 2.5 : 2}
                  color={
                    (isActive && !isMore) ? '#A3E635' :
                    isMoreOpen ? '#F3F4F6' :
                    '#64748B'
                  }
                  style={{ transition: 'all 0.2s ease' }}
                />
                {tab.liveIndicator && (
                  <span
                    className="absolute animate-pulse"
                    style={{
                      top: 2,
                      right: 4,
                      width: 6,
                      height: 6,
                      background: '#A3E635',
                      borderRadius: '50%',
                      border: '1.5px solid #0A0A0A',
                      boxShadow: '0 0 6px rgba(163,230,53,0.8)',
                    }}
                  />
                )}
              </div>

              {/* Label */}
              <span
                style={{
                  fontSize: 10,
                  fontWeight: (isActive && !isMore) ? 700 : 500,
                  color: (isActive && !isMore) ? '#A3E635' : isMoreOpen ? '#F3F4F6' : '#64748B',
                  letterSpacing: '0.01em',
                  transition: 'color 0.2s ease',
                  lineHeight: 1,
                }}
              >
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
