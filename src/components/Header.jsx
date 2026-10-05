import React, { useState, useEffect } from 'react';
import { ArrowLeft, Search, Bell } from 'lucide-react';
import { useCricket } from '../context/CricketContext';

// Screen-level titles
const SCREEN_TITLES = {
  'home':               { title: 'JDCA Administration',  showBack: false },
  'matches':            { title: 'Matches',              showBack: false },
  'match-setup':        { title: 'Match Setup',          showBack: true },
  'scoring':            { title: 'Live Match Scoring',   showBack: true },
  'scorecard':          { title: 'Official Scorecard',   showBack: true },
  'match-overview':     { title: 'Match Overview',       showBack: true },
  'innings-break':      { title: 'Innings Break',        showBack: true },
  'match-result':       { title: 'Match Result',         showBack: true },
  'tournaments':        { title: 'Tournaments',          showBack: false },
  'teams':              { title: 'Official Teams',        showBack: false },
  'players':            { title: 'Player Directory',     showBack: false },
  'scouting':           { title: 'Player Assessment',    showBack: false },
  'player-profile':     { title: 'Player Profile',       showBack: true },
  'player-registration':{ title: 'Add New Player',       showBack: true },
  'selection':          { title: 'Team Selection',       showBack: false },
  'selectors':          { title: 'Team Selection',       showBack: false },
  'administration':     { title: 'Administration',       showBack: false },
  'access-control':     { title: 'Administration',       showBack: false },
};

export default function Header() {
  const { currentScreen, goBack, userRole, navigateTo } = useCricket();
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

  return (
    <header className={`lg:hidden sticky top-0 z-40 bg-white/70 backdrop-blur-xl border-b border-slate-200 pt-safe px-4 shadow-none h-[56px] flex items-center justify-between transition-transform duration-300 ease-in-out ${
      isVisible ? 'translate-y-0' : '-translate-y-full'
    }`}>
      {/* Left: back button or Logo */}
      <div className="flex items-center gap-3">
        {info.showBack ? (
          <button
            onClick={goBack}
            className="flex items-center justify-center w-8 h-8 rounded-lg border border-slate-200 bg-white text-slate-700 active:bg-slate-100 transition-colors cursor-pointer"
            aria-label="Back"
          >
            <ArrowLeft size={17} />
          </button>
        ) : (
          <img src="/jdca-logo.png" onError={(e) => e.target.src = 'https://via.placeholder.com/44?text=JDCA'} alt="JDCA Logo" className="w-7 h-7 object-contain flex-shrink-0" />
        )}
        <h1 className="font-semibold text-slate-900 text-base tracking-tight truncate max-w-[200px] sm:max-w-xs">
          {info.title}
        </h1>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-2">
        <span className="hidden sm:inline-flex text-xs font-medium px-2.5 py-0.5 rounded-md bg-blue-50 text-blue-700 border border-blue-100">
          {userRole}
        </span>
        
        {currentScreen === 'home' && (
          <button
            className="flex items-center justify-center w-8 h-8 rounded-lg text-slate-500 hover:text-slate-900 active:bg-slate-100 transition-colors cursor-pointer relative"
          >
            <Bell size={17} />
            {userRole === 'Admin' && <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-white" />}
          </button>
        )}

        <button
          onClick={() => navigateTo('players')}
          className="flex items-center justify-center w-8 h-8 rounded-lg text-slate-500 hover:text-slate-900 active:bg-slate-100 transition-colors cursor-pointer"
          aria-label="Search players"
        >
          <Search size={17} />
        </button>
      </div>
    </header>
  );
}
