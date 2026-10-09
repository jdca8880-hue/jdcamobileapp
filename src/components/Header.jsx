import React, { useState, useEffect } from 'react';
import { ArrowLeft, Search, Bell, BellOff } from 'lucide-react';
import { useCricket } from '../context/CricketContext';

const SCREEN_TITLES = {
  'home':               { title: 'JDCA',                showBack: false },
  'matches':            { title: 'Matches',              showBack: false },
  'match-setup':        { title: 'Match Setup',          showBack: true },
  'scoring':            { title: 'Live Scoring',         showBack: true },
  'scorecard':          { title: 'Official Scorecard',   showBack: true },
  'match-overview':     { title: 'Match Overview',       showBack: true },
  'innings-break':      { title: 'Innings Break',        showBack: true },
  'match-result':       { title: 'Match Result',         showBack: true },
  'tournaments':        { title: 'Tournaments',          showBack: false },
  'teams':              { title: 'Teams',                showBack: false },
  'players':            { title: 'Players',              showBack: false },
  'scouting':           { title: 'Assessment',           showBack: false },
  'player-profile':     { title: 'Player Profile',       showBack: true },
  'player-registration':{ title: 'Add Player',           showBack: true },
  'selection':          { title: 'Team Selection',       showBack: false },
  'selectors':          { title: 'Team Selection',       showBack: false },
  'administration':     { title: 'Administration',       showBack: false },
  'access-control':     { title: 'Administration',       showBack: false },
  'officials':          { title: 'Scorers & Umpires',    showBack: false },
  'news':               { title: 'News',                 showBack: false },
};

export default function Header() {
  const { currentScreen, goBack, userRole, navigateTo, notificationsEnabled, toggleNotifications } = useCricket();
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const scrollContainer = document.querySelector('main');
    let lastY = 0;
    let ticking = false;

    const handleScroll = () => {
      const y = scrollContainer ? scrollContainer.scrollTop : window.scrollY;
      if (!ticking) {
        window.requestAnimationFrame(() => {
          if (y > 60 && y > lastY + 8) {
            setIsVisible(false);
          } else if (y < lastY - 8 || y <= 30) {
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

  if (currentScreen === 'welcome') return null;

  const info = SCREEN_TITLES[currentScreen] || { title: 'JDCA', showBack: false };
  const isHome = currentScreen === 'home';

  return (
    <header
      className={`lg:hidden sticky top-0 z-40 pt-safe transition-transform duration-300 ease-in-out ${
        isVisible ? 'translate-y-0' : '-translate-y-full'
      }`}
      style={{
        background: '#0A0A0A',
        borderBottom: '1px solid rgba(255,255,255,0.08)',
        height: 56,
        display: 'flex',
        alignItems: 'center',
        paddingLeft: 16,
        paddingRight: 16,
      }}
    >
      {/* Left: back button or Logo */}
      <div className="flex items-center gap-3 flex-1 min-w-0">
        {info.showBack ? (
          <button
            onClick={goBack}
            className="flex items-center justify-center flex-shrink-0 cursor-pointer"
            style={{
              width: 34,
              height: 34,
              borderRadius: 9,
              border: '1px solid rgba(255,255,255,0.12)',
              background: 'rgba(255,255,255,0.07)',
              color: '#E2E8F0',
            }}
            aria-label="Go back"
          >
            <ArrowLeft size={16} />
          </button>
        ) : (
          <img
            src="/jdca-logo.png"
            onError={(e) => { e.target.style.display='none'; }}
            alt="JDCA"
            style={{ width: 30, height: 30, objectFit: 'contain', flexShrink: 0 }}
          />
        )}
        <div className="min-w-0">
          {isHome ? (
            <>
              <div className="font-bold text-white truncate flex items-center gap-1.5" style={{ fontSize: 15, letterSpacing: '-0.01em', lineHeight: 1.2 }}>
                JDCA
                <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#A3E635', display: 'inline-block' }} />
              </div>
              <div style={{ fontSize: 10, color: '#64748B', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                Jabalpur District Cricket
              </div>
            </>
          ) : (
            <h1 className="font-semibold text-white truncate" style={{ fontSize: 15, letterSpacing: '-0.01em' }}>
              {info.title}
            </h1>
          )}
        </div>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-1.5">
        {isHome && (
          <button
            id="header-notification-off-btn"
            onClick={toggleNotifications}
            className="flex items-center justify-center relative cursor-pointer"
            style={{
              width: 36,
              height: 36,
              borderRadius: 9,
              color: notificationsEnabled ? '#94A3B8' : '#F87171',
              background: notificationsEnabled ? 'transparent' : 'rgba(239, 68, 68, 0.1)',
              border: 'none',
            }}
            title={notificationsEnabled ? "Notifications are ON (Click to turn OFF)" : "Notifications are OFF (Click to turn ON)"}
            aria-label={notificationsEnabled ? "Turn notifications off" : "Turn notifications on"}
          >
            {notificationsEnabled ? <Bell size={18} /> : <BellOff size={18} className="text-rose-400" />}
            {userRole === 'Admin' && (
              <span
                className="absolute"
                style={{
                  top: 7,
                  right: 7,
                  width: 7,
                  height: 7,
                  background: notificationsEnabled ? '#EF4444' : '#94A3B8',
                  borderRadius: '50%',
                  border: '2px solid #0A0A0A',
                }}
              />
            )}
          </button>
        )}

        <button
          onClick={() => navigateTo('players')}
          className="flex items-center justify-center cursor-pointer"
          style={{
            width: 36,
            height: 36,
            borderRadius: 9,
            color: '#94A3B8',
            background: 'transparent',
            border: 'none',
          }}
          aria-label="Search"
        >
          <Search size={18} />
        </button>

        <div
          className="flex items-center justify-center flex-shrink-0"
          style={{
            padding: '3px 8px',
            background: 'rgba(163,230,53,0.15)',
            border: '1px solid rgba(163,230,53,0.35)',
            borderRadius: 6,
          }}
        >
          <span style={{ fontSize: 10, fontWeight: 700, color: '#A3E635', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
            {userRole?.replace('_', ' ')}
          </span>
        </div>
      </div>
    </header>
  );
}
