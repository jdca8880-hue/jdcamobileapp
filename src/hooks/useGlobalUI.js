import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

export function useGlobalUI() {
  const navigate = useNavigate();
  const location = useLocation();

  // Navigation & Screen routing derived from URL
  const pathParts = location.pathname.split('/').filter(Boolean);
  let currentScreen = pathParts.length > 0 ? pathParts[0] : 'welcome';
  if (currentScreen === '') currentScreen = 'welcome';
  
  const activeTabMap = {
    'home': 'home',
    'scoring': 'scoring',
    'scorecard': 'scoring',
    'scouting': 'players',
    'players': 'players',
    'selectors': 'selection',
    'selection': 'selection',
    'player-profile': 'players',
    'player-registration': 'players',
    'matches': 'matches',
    'match-overview': 'matches',
    'match-setup': 'matches',
    'match-result': 'matches',
    'innings-break': 'matches',
    'tournaments': 'tournaments',
    'teams': 'teams',
    'news': 'news',
    'administration': 'administration',
    'access-control': 'administration',
  };
  const activeTab = activeTabMap[currentScreen] || 'home';

  // Application Loading State
  const [isAppLoading, setIsAppLoading] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [loadingMessage, setLoadingMessage] = useState("Initializing...");
  const [appError, setAppError] = useState(null);

  // Drawer State
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Dark Mode Theme State
  const [isDarkMode, setIsDarkMode] = useState(() => {
    try {
      return localStorage.getItem('jdca-dark-mode') === 'true';
    } catch {
      return false;
    }
  });

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('jdca-dark-mode', 'true');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('jdca-dark-mode', 'false');
    }
  }, [isDarkMode]);

  // System Settings
  const [systemSettings, setSystemSettings] = useState(() => {
    try {
      const stored = localStorage.getItem('jdca-system-settings');
      if (stored) return JSON.parse(stored);
    } catch {}
    return { liveSync: true, freeHit: true, notifications: true, watermark: true };
  });

  useEffect(() => {
    localStorage.setItem('jdca-system-settings', JSON.stringify(systemSettings));
  }, [systemSettings]);

  // Navigation helpers
  const navigateTo = (screenName, tabName = null) => {
    const routeMap = {
      'welcome': '/',
      'home': '/home',
      'matches': '/matches',
      'match-setup': '/match-setup',
      'scoring': '/scoring',
      'scorecard': '/scorecard',
      'match-overview': '/match-overview',
      'innings-break': '/innings-break',
      'match-result': '/match-result',
      'match-detail': '/match-detail',
      'tournaments': '/tournaments',
      'teams': '/teams',
      'players': '/players',
      'scouting': '/players',
      'player-profile': '/player-profile',
      'player-registration': '/player-registration',
      'selection': '/selection',
      'selectors': '/selection',
      'administration': '/administration',
      'access-control': '/administration',
      'officials': '/officials',
      'match-officials': '/officials',
      'news': '/news',
    };
    navigate(routeMap[screenName] || '/home');
  };

  const goBack = () => {
    navigate(-1);
  };

  return {
    currentScreen,
    activeTab,
    isAppLoading, setIsAppLoading,
    loadingProgress, setLoadingProgress,
    loadingMessage, setLoadingMessage,
    appError, setAppError,
    isDarkMode, setIsDarkMode,
    systemSettings, setSystemSettings,
    drawerOpen, setDrawerOpen,
    navigateTo,
    goBack
  };
}
