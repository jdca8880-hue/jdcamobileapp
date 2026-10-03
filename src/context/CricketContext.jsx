import React, { createContext, useContext, useState } from 'react';
import { useGlobalUI } from '../hooks/useGlobalUI';
import { useAuth } from '../hooks/useAuth';
import { useDataSync } from '../hooks/useDataSync';
import { useMatchScoring, INITIAL_MATCH_SETUP } from '../hooks/useMatchScoring';
import { api } from '../lib/api';
import { db } from '../lib/db';

export { INITIAL_MATCH_SETUP };

const CricketContext = createContext();

export function CricketProvider({ children }) {
  const ui = useGlobalUI();
  const { 
    currentScreen, activeTab, 
    isAppLoading, setIsAppLoading, 
    loadingProgress, setLoadingProgress, 
    loadingMessage, setLoadingMessage, 
    appError, setAppError, 
    isDarkMode, setIsDarkMode, 
    systemSettings, setSystemSettings, 
    drawerOpen, setDrawerOpen, 
    navigateTo, goBack 
  } = ui;

  const [activeMatchId, setActiveMatchIdState] = useState(() => {
    try { return localStorage.getItem('jdca-active-match-id') || null; }
    catch { return null; }
  });

  const setActiveMatchId = (id) => {
    setActiveMatchIdState(id);
    try {
      if (id) localStorage.setItem('jdca-active-match-id', id);
      else localStorage.removeItem('jdca-active-match-id');
    } catch {}
  };
  
  const auth = useAuth({ setActiveMatchId });
  const {
    isAuthenticated, setIsAuthenticated,
    userEmail, setUserEmail,
    userName, setUserName,
    userId, setUserId,
    userRole, setUserRole,
    userPermissions, setUserPermissions,
    registeredUsers, setRegisteredUsers,
    logout
  } = auth;

  const data = useDataSync({ auth, ui });
  const {
    representativeTeams, setRepresentativeTeams,
    activeSelectionTeam, setActiveSelectionTeam,
    selectorPermissions, setSelectorPermissions,
    players, setPlayers,
    selectedPlayer, setSelectedPlayer,
    shortlistedIds, setShortlistedIds,
    matches, setMatches,
    teams, setTeams,
    tournaments, setTournaments,
    announcements, setAnnouncements,
    refreshAdminData
  } = data;

  const scoring = useMatchScoring({
    activeMatchId,
    setActiveMatchId,
    matches,
    navigateTo,
    refreshAdminData
  });

  // Shortlist toggle for scouting
  const toggleShortlist = async (playerId) => {
    if (!activeSelectionTeam) return;
    const isAdding = !shortlistedIds.includes(playerId);
    
    // Optimistic UI update
    setShortlistedIds((prev) =>
      isAdding
        ? [...prev, playerId]
        : prev.filter((id) => id !== playerId)
    );

    try {
      await api.toggleCandidate(activeSelectionTeam.id, playerId, isAdding);
    } catch (e) {
      console.error('Failed to toggle candidate', e);
      // Revert on failure
      setShortlistedIds((prev) =>
        !isAdding
          ? [...prev, playerId]
          : prev.filter((id) => id !== playerId)
      );
    }
  };

  const finalizeSelectionProcess = async (processId, selectedPlayerIds) => {
    if (!selectedPlayerIds || selectedPlayerIds.length === 0) {
      throw new Error("No players selected for finalization.");
    }
    try {
      await api.finalizeSquad(processId, selectedPlayerIds);
      setRepresentativeTeams(prev => prev.map(t => t.id === processId ? { ...t, status: 'FINALIZED' } : t));
      if (activeSelectionTeam && activeSelectionTeam.id === processId) {
        setActiveSelectionTeam({ ...activeSelectionTeam, status: 'FINALIZED' });
      }
      return true;
    } catch (e) {
      console.error('Failed to finalize squad', e);
      throw e;
    }
  };

  // Register new player
  const registerPlayer = async (playerData) => {
    try {
      const p = await api.registerPlayer(playerData);
      
      const newPlayer = {
        id: p.id,
        name: p.full_name,
        avatar: p.avatar_url || '',
        team: 'Local Club',
        club: 'District XI',
        role: p.primary_role,
        primaryRole: p.primary_role,
        battingStyle: p.batting_style,
        bowlingStyle: p.bowling_style,
        age: 20,
        isPro: false,
        tags: [p.primary_role, 'Registered'],
        careerRuns: 0,
        battingAvg: 0.0,
        strikeRate: 0.0,
        highScore: '0',
        matches: 0,
        innings: 0,
        notOuts: 0,
        fifties: 0,
        hundreds: 0,
        economy: 0.0,
        wickets: 0,
        bestBowling: '0/0',
        fiveFours: 0,
        catches: 0,
        stumpings: 0,
        scoringAreas: {
          offSide: 50,
          legSide: 50,
          behindSquare: 0,
          fine: 0,
        },
        district: playerData.district || '',
        category: playerData.category || '',
        inForm: false,
      };

      await db.players.put(newPlayer);
      setPlayers((prev) => [newPlayer, ...prev]);
      setSelectedPlayer(newPlayer);
      navigateTo('player-profile');
    } catch (e) {
      console.error('Failed to register player:', e);
      alert('Failed to register player. Please check network connection.');
      throw e;
    }
  };

  return (
    <CricketContext.Provider
      value={{
        ...ui,
        ...auth,
        ...data,
        ...scoring,
        activeMatchId,
        setActiveMatchId,
        toggleShortlist,
        finalizeSelectionProcess,
        registerPlayer,
        officials: [],
        districtStats: [],
        selectionHistory: [],
        pointsTable: [],
      }}
    >
      {children}
    </CricketContext.Provider>
  );
}

export function useCricket() {
  const context = useContext(CricketContext);
  if (!context) {
    throw new Error('useCricket must be used within a CricketProvider');
  }
  return context;
}
