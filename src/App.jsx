import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { CricketProvider, useCricket } from './context/CricketContext';
import { AnimatePresence } from 'motion/react';
import Header   from './components/Header';
import BottomNav from './components/BottomNav';
import DrawerMenu from './components/DrawerMenu';
import Sidebar  from './components/Sidebar';
import ProtectedRoute, { ROLE_HOME } from './components/ProtectedRoute';
import AnimatedPage from './components/AnimatedPage';
import NotificationPrompt from './components/NotificationPrompt';

// ── Screens ────────────────────────────────────────────────────
import AuthScreen             from './components/screens/AuthScreen';
import HomeScreen             from './components/screens/HomeScreen';
import MatchesScreen          from './components/screens/MatchesScreen';
import MatchSetupScreen       from './components/screens/MatchSetupScreen';
import ScoringScreen          from './components/screens/ScoringScreen';
import ScorecardScreen        from './components/screens/ScorecardScreen';
import MatchOverviewScreen    from './components/screens/MatchOverviewScreen';
import MatchDetailScreen      from './components/screens/MatchDetailScreen';
import InningsBreakScreen     from './components/screens/InningsBreakScreen';
import MatchResultScreen      from './components/screens/MatchResultScreen';
import TournamentsScreen      from './components/screens/TournamentsScreen';
import TeamsScreen            from './components/screens/TeamsScreen';
import PlayersScreen          from './components/screens/PlayersScreen';
import PlayerProfileScreen    from './components/screens/PlayerProfileScreen';
import PlayerRegistrationScreen from './components/screens/PlayerRegistrationScreen';
import SelectionScreen        from './components/selection/SelectionWorkspace';
import AdministrationScreen   from './components/screens/AdministrationScreen';
import NewsScreen             from './components/screens/NewsScreen';
import PlayerComparisonModal  from './components/screens/PlayerComparisonModal';

// Legacy / still in use
import ScoutingHubScreen      from './components/screens/ScoutingHubScreen';
import SelectorsScreen        from './components/screens/SelectorsScreen';
import AccessControlScreen    from './components/screens/AccessControlScreen';

// Auth-aware root redirect
function RootRedirect() {
  const { isAuthenticated, userRole } = useCricket();
  if (isAuthenticated) {
    return <Navigate to={ROLE_HOME[userRole] || '/home'} replace />;
  }
  return <AuthScreen />;
}

function MainApp() {
  const { currentScreen, isAppLoading } = useCricket();
  const location = useLocation();
  const isAuth = currentScreen === 'welcome';

  if (isAppLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-950 flex flex-col items-center justify-center px-4 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-blue-500/20 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[30rem] h-[30rem] bg-indigo-500/20 rounded-full blur-[120px] pointer-events-none" />
        
        <motion.div
          animate={{ 
            scale: [1, 1.1, 1],
            rotateY: [0, 180, 360]
          }}
          transition={{ 
            duration: 2, 
            ease: "easeInOut",
            repeat: Infinity 
          }}
          className="mb-8 relative"
        >
          <div className="absolute inset-0 bg-blue-500 blur-2xl opacity-40 rounded-full animate-pulse" />
          <img
            src="/jdca-logo.png"
            alt="JDCA Official Emblem"
            className="w-32 h-32 sm:w-40 sm:h-40 object-contain drop-shadow-[0_0_20px_rgba(36,87,214,0.6)] relative z-10"
          />
        </motion.div>
        
        <motion.h2 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-white text-xl sm:text-2xl font-black tracking-widest uppercase mb-3"
        >
          Loading JDCA
        </motion.h2>
        
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-blue-300 text-sm font-medium flex items-center gap-2 bg-blue-900/40 px-4 py-2 rounded-full border border-blue-500/30"
        >
          <div className="w-4 h-4 rounded-full border-2 border-t-transparent border-blue-400 animate-spin" />
          Fetching Live Data...
        </motion.div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ background: '#F7F8F4', fontFamily: "'Inter', system-ui, sans-serif", color: '#101827' }}
    >
      {/* Mobile top bar */}
      <Header />

      {/* Body: sidebar + main content */}
      <div className="flex flex-1 min-h-0 relative">
        {/* Desktop sidebar */}
        {!isAuth && <Sidebar />}

        {/* Main content area */}
        <main className="flex-1 min-w-0 overflow-y-auto overflow-x-hidden relative pb-28 lg:pb-8">
          <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
              {/* Public */}
              <Route path="/"                    element={<AnimatedPage><RootRedirect /></AnimatedPage>} />

              {/* Protected */}
              <Route path="/home"                element={<ProtectedRoute path="/home"                element={<AnimatedPage><HomeScreen /></AnimatedPage>} />} />
              <Route path="/matches"             element={<ProtectedRoute path="/matches"             element={<AnimatedPage><MatchesScreen /></AnimatedPage>} />} />
              <Route path="/match-setup"         element={<ProtectedRoute path="/match-setup"         element={<AnimatedPage><MatchSetupScreen /></AnimatedPage>} />} />
              <Route path="/scoring"             element={<ProtectedRoute path="/scoring"             element={<AnimatedPage><ScoringScreen /></AnimatedPage>} />} />
              <Route path="/scorecard"           element={<ProtectedRoute path="/scorecard"           element={<AnimatedPage><ScorecardScreen /></AnimatedPage>} />} />
              <Route path="/match-detail"        element={<ProtectedRoute path="/match-detail"        element={<AnimatedPage><MatchDetailScreen /></AnimatedPage>} />} />
              <Route path="/match-overview"      element={<ProtectedRoute path="/match-overview"      element={<AnimatedPage><MatchOverviewScreen /></AnimatedPage>} />} />
              <Route path="/innings-break"       element={<ProtectedRoute path="/innings-break"       element={<AnimatedPage><InningsBreakScreen /></AnimatedPage>} />} />
              <Route path="/match-result"        element={<ProtectedRoute path="/match-result"        element={<AnimatedPage><MatchResultScreen /></AnimatedPage>} />} />
              <Route path="/tournaments"         element={<ProtectedRoute path="/tournaments"         element={<AnimatedPage><TournamentsScreen /></AnimatedPage>} />} />
              <Route path="/teams"               element={<ProtectedRoute path="/teams"               element={<AnimatedPage><TeamsScreen /></AnimatedPage>} />} />
              <Route path="/players"             element={<ProtectedRoute path="/players"             element={<AnimatedPage><PlayersScreen /></AnimatedPage>} />} />
              <Route path="/player-profile"      element={<ProtectedRoute path="/player-profile"      element={<AnimatedPage><PlayerProfileScreen /></AnimatedPage>} />} />
              <Route path="/player-registration" element={<ProtectedRoute path="/player-registration" element={<AnimatedPage><PlayerRegistrationScreen /></AnimatedPage>} />} />
              <Route path="/selection"           element={<ProtectedRoute path="/selection"           element={<AnimatedPage><SelectionScreen /></AnimatedPage>} />} />
              <Route path="/administration"      element={<ProtectedRoute path="/administration"      element={<AnimatedPage><AdministrationScreen /></AnimatedPage>} />} />
              <Route path="/news"                element={<ProtectedRoute path="/news"                element={<AnimatedPage><NewsScreen /></AnimatedPage>} />} />

              {/* Legacy aliases */}
              <Route path="/scouting"            element={<Navigate to="/players" replace />} />
              <Route path="/selectors"           element={<Navigate to="/selection" replace />} />
              <Route path="/access-control"      element={<Navigate to="/administration" replace />} />

              {/* Fallback */}
              <Route path="*"                    element={<Navigate to="/home" replace />} />
            </Routes>
          </AnimatePresence>
        </main>
      </div>

      {/* Mobile bottom nav */}
      <BottomNav />

      {/* Slide-out drawer (mobile More menu) */}
      <DrawerMenu />

      {/* Player comparison modal */}
      <PlayerComparisonModal />

      {/* Push Notification Prompt */}
      {!isAuth && <NotificationPrompt />}
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <CricketProvider>
        <MainApp />
      </CricketProvider>
    </BrowserRouter>
  );
}
