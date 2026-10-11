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

  // When set, the player-registration screen runs in "edit" mode for this player.
  const [editingPlayer, setEditingPlayer] = useState(null);
  
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
    setMatches,
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

  // Update an existing player's details (name, role, styles, photo, phone).
  const updatePlayer = async (id, playerData) => {
    try {
      const p = await api.updatePlayer(id, playerData);
      const patch = {
        full_name: p.full_name,
        name: p.full_name,
        avatar_url: p.avatar_url || '',
        avatar: p.avatar_url || '',
        date_of_birth: p.date_of_birth,
        primary_role: p.primary_role,
        role: p.primary_role,
        primaryRole: p.primary_role,
        batting_style: p.batting_style,
        battingStyle: p.batting_style,
        bowling_style: p.bowling_style,
        bowlingStyle: p.bowling_style,
        gender: p.gender,
        phone: p.phone || '',
      };
      setPlayers((prev) => prev.map((pl) => (String(pl.id) === String(id) ? { ...pl, ...patch } : pl)));
      setSelectedPlayer((prev) => (prev && String(prev.id) === String(id) ? { ...prev, ...patch } : prev));
      try {
        const existing = await db.players.get(id);
        if (existing) await db.players.put({ ...existing, ...patch });
      } catch {}
      return p;
    } catch (e) {
      console.error('Failed to update player:', e);
      alert('Failed to update player. Please check your connection and permissions.');
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
        scoring,
        activeMatchId,
        setActiveMatchId,
        editingPlayer,
        setEditingPlayer,
        toggleShortlist,
        finalizeSelectionProcess,
        registerPlayer,
        updatePlayer,
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
