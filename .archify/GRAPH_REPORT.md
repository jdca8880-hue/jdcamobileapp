# Graph Report - C:\Users\lenovo\Desktop\WEBBDEV\JDCA (2026-09-26)

## Corpus Check
- 183 files scanned
- 153 code files contributed grounded graph fragments
- Verdict: graph analysis is available without LLM synthesis.

## Summary
- 3272 nodes · 5906 edges · 182 communities
- Warnings: 0 · Ambiguous edges: 4514 (76%)
- Top hubs: 10 · Surprises: 5 · Suggested questions: 5

## God Nodes
1. `react` - degree 105 · community 53 · src/App.jsx
2. `setupDataAndSync()` - degree 71 · community 5 · src/context/CricketContext.jsx
3. `useCricket` - degree 61 · community 53 · src/App.jsx
4. `useState` - degree 54 · community 88 · src/components/BottomNav.jsx
5. `lucide-react` - degree 51 · community 29 · src/components/BottomNav.jsx
6. `async` - degree 49 · community 121 · src/components/NotificationPrompt.jsx
7. `console.error` - degree 46 · community 121 · src/components/NotificationPrompt.jsx
8. `map` - degree 36 · community 2 · src/components/screens/AccessControlScreen.jsx
9. `includes` - degree 35 · community 88 · src/components/BottomNav.jsx
10. `hydrateMatchState()` - degree 33 · community 1 · src/context/CricketContext.jsx

## Surprising Connections
- `toggleShortlist()` --calls--> `prev.includes` [AMBIGUOUS]
  src/context/CricketContext.jsx -> temp_extraction/src/context/CricketContext.jsx · ambiguous relationship, cross-file link, cross-community bridge, cross-boundary directory hop, peripheral-to-hub jump
- `handleRoleChange()` --calls--> `onUpdateTeamRoles` [AMBIGUOUS]
  src/components/screens/AdministrationScreen.jsx -> src/components/selection/SelectedTeam.jsx · ambiguous relationship, cross-file link, cross-community bridge, peripheral-to-hub jump
- `handleCreateUser()` --calls--> `setNewUser` [AMBIGUOUS]
  src/components/screens/AdministrationScreen.jsx -> temp_extraction/src/components/screens/AdministrationScreen.jsx · ambiguous relationship, cross-file link, cross-community bridge, cross-boundary directory hop
- `handleDelete()` --calls--> `api.deletePlayer` [AMBIGUOUS]
  src/components/screens/MatchDetailScreen.jsx -> src/components/screens/PlayerProfileScreen.jsx · ambiguous relationship, cross-file link, cross-community bridge, peripheral-to-hub jump
- `handleDelete()` --calls--> `players.delete` [AMBIGUOUS]
  src/components/screens/MatchDetailScreen.jsx -> src/components/screens/PlayerProfileScreen.jsx · ambiguous relationship, cross-file link, cross-community bridge, peripheral-to-hub jump

## Communities (182 total)
- Community 0: 100 nodes · cohesion 0.02 · age_category_id, ageCategories.forEach, assignManOfTheMatch, assignments.map, assignScorer, away_team_id, BIN, bowler_id
- Community 1: 96 nodes · cohesion 0.04 · Action, api.finalizeMatch, api.getSelectionCandidates, api.hydrateLiveMatch, api.toggleCandidate, batting.find, bowling.find, classList.add
- Community 2: 71 nodes · cohesion 0.05 · map, Number, activeTournaments.map, batters.map, battingXI.filter, bowlingXI.filter, bowlingXI.map, calculateCRR
- Community 3: 67 nodes · cohesion 0.05 · _0_20px_rgba, battingXI.find, bowlingXI.find, charAt, disabledIds.includes, filter, Icons, InningsInitScreen
- Community 4: 57 nodes · cohesion 0.06 · get_eligible_players_for_process, IF, player_registrations, players, profiles, RLS, selection_processes, SELECTOR
- Community 5: 55 nodes · cohesion 0.04 · api.getAnnouncements, api.getOrCreateInnings, auth.getSession, auth.onAuthStateChange, auth.signOut, away_team_id, batStats.find, bowlStats.find
- Community 6: 52 nodes · cohesion 0.05 · Emblem, name.includes, slice, toUpperCase, ../assets/bat-icon.png, join, Math.max, Math.round
- Community 7: 47 nodes · cohesion 0.06 · AdministrationScreen, alert, api.deleteUser, api.getProfiles, api.resetUserPassword, api.updateUserPermissions, api.updateUserRole, api.updateUserStatus
- Community 8: 34 nodes · cohesion 0.07 · activePlayers.map, api.bulkMigratePlayers, api.getAgeCategories, api.getPlayersBySeason, cutoff.getDate, cutoff.getFullYear, cutoff.getMonth, data.filter
- Community 9: 32 nodes · cohesion 0.07 · repeat, availablePlayers.filter, contextTeams.map, filteredDistrictTeams.map, filteredOfficialTeams.map, headCoach.split, homeVenue.split, mappedTeams.filter
- Community 10: 30 nodes · cohesion 0.12 · code.split, console.log, Day, fs.readFileSync, fs.writeFileSync, join, lines.slice, require
- Community 11: 29 nodes · cohesion 0.1 · _2px_10px_rgba, ac.includes, AGE_CATEGORIES.filter, AGE_CATEGORIES.some, avatarPresets.map, BATTING_STYLES.map, BOWLING_STYLES.map, c.includes
- Community 12: 26 nodes · cohesion 0.08 · auto, autoGravity, cld.image, Cloudinary, extension, format, gravity, publicId.indexOf
- Community 13: 24 nodes · cohesion 0.08 · Ball, ctx.addIssue, default, enforcement, FREE_HIT_ALLOWED_DISMISSALS.includes, getTime, int, max
- Community 14: 24 nodes · cohesion 0.13 · constructor, extraType.toUpperCase, listeners.add, listeners.delete, Math.max, offlineQueueFn, startsWith, Violation
- Community 15: 21 nodes · cohesion 0.11 · form.slice, ms.filter, ms.map, onToggle, parseFloat, pointsTable.map, setEditingTournament, setExpandedMatchId
- Community 16: 21 nodes · cohesion 0.1 · Array.from, battingStyle.includes, bowlingStyle.includes, catStr.includes, district.replace, includes, join, matchHistory.slice
- Community 17: 21 nodes · cohesion 0.1 · async, console.error, createClient, delete, env.get, eq, from, JSON.stringify
- Community 18: 21 nodes · cohesion 0.1 · async, deliveries, form.push, in, inningsData.forEach, matches.find, matches.forEach, matches.map
- Community 19: 20 nodes · cohesion 0.11 · allNormalizedPlayers.filter, availableDistricts.filter, CATEGORY_OPTIONS.map, categoryPlayers.filter, confetti, displayedPlayers.map, getAvailableDistricts, ids.includes
- Community 20: 20 nodes · cohesion 0.1 · Analysis, ANNOUNCEMENTS, Balls, Bat, DIRECTIONS, Jr, Kashyap, Kumar
- Community 21: 20 nodes · cohesion 0.12 · age_category_id, api.getDefaults, auth.getUser, data.map, delete, district_id, eq, from
- Community 22: 19 nodes · cohesion 0.11 · activeTournamentPointsTable.map, activeTournamentPointsTable.slice, All, Board, Center, districtStats.filter, districtStats.slice, filteredDistricts.map
- Community 23: 19 nodes · cohesion 0.12 · BallEventSchema.safeParse, currentOverBalls.push, fallOfWickets.push, isNaN, Math.round, notation, Number, over
- Community 24: 18 nodes · cohesion 0.14 · ac.find, ageCategories.filter, dbDistricts.map, districtTeams.find, districtTeams.map, filteredAgeCategories.map, gender, n.includes
- Community 25: 18 nodes · cohesion 0.14 · constructor, document.getElementById, error.toString, getDerivedStateFromError, onNeedRefresh, onOfflineReady, ReactDOM.createRoot, registerSW
- Community 26: 18 nodes · cohesion 0.11 · ageGroups.map, agePlayers.map, districtNames.map, districtPlayers.filter, filteredPlayers.filter, mobileGroups.map, normalized.includes, raw.toLowerCase
- Community 27: 17 nodes · cohesion 0.12 · console.error, console.log, createClient, dotenv.config, fs.readFileSync, part.trim, path.join, process.cwd
- Community 28: 17 nodes · cohesion 0.15 · insert, Notification.requestPermission, NotificationPrompt, pushManager.getSubscription, pushManager.subscribe, rawData.charCodeAt, setIsSubscribed, setIsSupported
- Community 29: 16 nodes · cohesion 0.12 · BottomNav, document.querySelector, navigateTo, scrollContainer.addEventListener, scrollContainer.removeEventListener, setDrawerOpen, setIsVisible, tabs.map
- Community 30: 16 nodes · cohesion 0.12 · count, limit, name.replace, representativeTeams.find, representativeTeams.map, ROLE_FILTERS.map, role.includes, selectedRole.toLowerCase
- Community 31: 16 nodes · cohesion 0.14 · api.getSelectionProcesses, api.getSelectorAssignments, api.updateSelectorAssignments, assignments.find, assignments.some, prev.find, processes.map, Promise.all
- Community 32: 15 nodes · cohesion 0.13 · cat.includes, cat.replace, CATEGORIES.map, categoryFilter.toLowerCase, f.replace, loosely, PlayersScreen, pName.toLowerCase
- Community 33: 15 nodes · cohesion 0.13 · ageCategories.map, Bar, calc, districts.map, List, Only, roleFilters.map, ScoutingHubScreen
- Community 34: 15 nodes · cohesion 0.17 · api.createSeason, api.getSeasons, api.setActiveSeason, SeasonManagementTab, seasons.find, seasons.map, setIsSubmitting, setNewSeason
- Community 35: 14 nodes · cohesion 0.26 · Illustration, Leg, Lines, rotate, Shape, Stumps, translate, url
- Community 36: 14 nodes · cohesion 0.24 · sort, aVal.toLowerCase, bVal.toLowerCase, col.render, columns.map, DataTable, onRowClick, React.useMemo
- Community 37: 14 nodes · cohesion 0.2 · currentPartnershipPlayers.add, currentPartnershipPlayers.clear, deliveries.forEach, forEach, Object.values, out, partnerships.push, deriveScorecardFromDeliveries()
- Community 38: 14 nodes · cohesion 0.14 · client.focus, clients.claim, clients.matchAll, clients.openWindow, data.json, event.waitUntil, icon.startsWith, image.startsWith
- Community 39: 13 nodes · cohesion 0.15 · announcements.filter, api.createAnnouncement, c.startsWith, Date, filteredAnnouncements.map, NewsScreen, setAnnouncements, setIsAddModalOpen
- Community 40: 13 nodes · cohesion 0.21 · api.getRecycleBinItems, api.hardDeleteItem, api.restoreItem, items.filter, items.map, RecycleBinTab, setItems, setProcessingId
- Community 41: 13 nodes · cohesion 0.15 · clearAction, Date.now, db.version, Dexie, getPendingActions, queueOfflineAction, stores, sync_queue.add
- Community 42: 13 nodes · cohesion 0.15 · filtered.forEach, groups.map, haystack.includes, map.entries, map.get, map.has, map.set, push
- Community 43: 12 nodes · cohesion 0.17 · content.replace, content.split, f.read, f.write, file.endswith, join, new_lines.append, open
- Community 44: 12 nodes · cohesion 0.17 · Amber, Blue, compareIds.includes, onToggleCompare, onToggleSelectTeamPlayer, onToggleShortlistPlayer, PlayerPool, selectedTeamPlayerIds.includes
- Community 45: 12 nodes · cohesion 0.18 · customMatches.filter, customMatches.map, participatingTeams.filter, participatingTeams.includes, refreshAdminData, setStep, teams.map, TournamentManagerModal
- Community 46: 12 nodes · cohesion 0.27 · defineConfig, path.resolve, react, tailwindcss, path, @tailwindcss/vite, vite, @vitejs/plugin-react
- Community 47: 11 nodes · cohesion 0.18 · _0_15px_rgba, _0_6px_rgba, ALL_NAV.filter, blur, DrawerMenu, rgba, setIsDarkMode, visible.map
- Community 48: 11 nodes · cohesion 0.18 · allPlayers.filter, consideredPlayers.map, onUpdateTeam, role.replace, selectedPlayerIds.filter, selectedPlayers.forEach, TeamSelectionDashboard, warnings.map
- Community 49: 11 nodes · cohesion 0.18 · allBatters.forEach, allBatters.push, allBatters.sort, allBowlers.forEach, allBowlers.push, allBowlers.sort, heuristic, Object.entries
- Community 50: 11 nodes · cohesion 0.18 · i.test, lines.join, lines.push, performance.join, performance.push, test, topPerformers.find, generateMatchSummary()
- Community 51: 10 nodes · cohesion 0.2 · Complete, onRemove, onSelect, Progress, selectedPlayers.filter, selectedPlayers.map, SelectedTeam, DisciplineTile()
- Community 52: 10 nodes · cohesion 0.2 · actions, errors, events, navigator.vibrate, pattern, trigger, useCallback, react
- Community 53: 9 nodes · cohesion 0.25 · App, drawer, useCricket, motion/react, react, react-router-dom, MainApp(), RootRedirect()
- Community 54: 9 nodes · cohesion 0.22 · completedMatches.map, filtered.filter, MatchesScreen, matching, myScoringMatches.map, trim, upcomingMatches.map, openMatch()
- Community 55: 9 nodes · cohesion 0.22 · AGE_FILTER_OPTIONS.map, BATTING_STYLE_OPTIONS.map, ELIGIBILITY_OPTIONS.map, FilterTiles, Object.values, onFilterChange, quickRoles.map, some
- Community 56: 8 nodes · cohesion 0.25 · api.getPlayerMatchStats, encodeURIComponent, PlayerProfileScreen, rgb, then, recharts, ProfileTabs()
- Community 57: 8 nodes · cohesion 0.25 · CreateTeamModal, defaultSize.toString, setSeason, setTeamSize, Size, TEAM_CATEGORIES.find, TEAM_CATEGORIES.map
- Community 58: 8 nodes · cohesion 0.25 · clipboard.writeText, generateMatchSummary, generateSocialCaption, MatchMediaReport, navigator.share, setCopied, copy()
- Community 59: 8 nodes · cohesion 0.25 · average.toFixed, battingAvg.toFixed, Boundaries, Distinctions, pieData.map, Played, Selected
- Community 60: 8 nodes · cohesion 0.25 · matches.forEach, ms.every, ms.some, setForm, setTab, CreateTournamentForm(), update()
- Community 61: 8 nodes · cohesion 0.21 · api.assignScorer, api.deleteMatch, goBack, location.reload, setIsAssigning, setIsDeleting, handleAssignScorer(), handleDelete()
- Community 62: 7 nodes · cohesion 0.29 · a.findIndex, allMatchPlayers.map, batting.map, fetchReport, MatchResultScreen, setLoading
- Community 63: 7 nodes · cohesion 0.29 · data.find, onSave, setFormData, TeamManagerModal, fetchSeasons(), handleChange()
- Community 64: 7 nodes · cohesion 0.29 · INITIAL_DISTRICTS.map, INITIAL_FORMATS.map, INITIAL_VENUES.map, JDCA, Privileges, setNewUser
- Community 65: 7 nodes · cohesion 0.24 · errors.forEach, PlayerRegistrationSchema.safeParse, registerPlayer, ROLES.map, setFormErrors, setRegisteredSuccess, handleSubmit()
- Community 66: 7 nodes · cohesion 0.29 · console.log, current.some, log, on, subscribe, supabase.channel, setupRealtime()
- Community 67: 7 nodes · cohesion 0.19 · balls.forEach, deliveries.filter, filter, match, replace, wicket_type.toLowerCase, computeInningsStats()
- Community 68: 6 nodes · cohesion 0.33 · district, final, public.districts, public.selection_processes, public.teams
- Community 69: 6 nodes · cohesion 0.33 · calculateMatchHighlights, MatchDetailScreen, matches.find, setSelectedScorer, MatchTabs()
- Community 70: 6 nodes · cohesion 0.33 · bowling.map, find, ScorecardScreen, Sharma, window.print
- Community 71: 6 nodes · cohesion 0.4 · options.map, SelectionFilters, setFilters, FilterSection(), updateFilter()
- Community 72: 6 nodes · cohesion 0.33 · announcements.slice, getHours, quickActions.map, recentMatches.map, userEmail.split
- Community 73: 6 nodes · cohesion 0.33 · auth.signInWithPassword, haptics.error, haptics.success, setErrorMsg, setIsLoading, handleLogin()
- Community 74: 5 nodes · cohesion 0.4 · AuthScreen, Image, setEmailInput, setPasswordInput
- Community 75: 5 nodes · cohesion 0.4 · JdcaManagementTab, registeredUsers.filter, scorers.map, selectors.map
- Community 76: 5 nodes · cohesion 0.4 · metrics.map, PlayerComparisonModal, setCompareModalOpen, setComparePlayer2
- Community 77: 5 nodes · cohesion 0.4 · selectedCategory.replace, SelectorsScreen, setSelectedCategory, Students
- Community 78: 5 nodes · cohesion 0.4 · _0_0_2px_rgba, NAV_ITEMS.filter, Sidebar, activeId()
- Community 79: 5 nodes · cohesion 0.4 · onClick, teamAName.substring, teamBName.substring, MatchCard()
- Community 80: 5 nodes · cohesion 0.4 · api.assignManOfTheMatch, api.getMatchScorecard, setMatchData, setSelectedMotm, handleAssignMotm()
- Community 81: 5 nodes · cohesion 0.1 · api.createDetailedMatches, api.createTournament, api.deleteTournament, api.updateTournament, handleDeleteTournament()
- Community 82: 4 nodes · cohesion 0.5 · delete, eq, from
- Community 83: 4 nodes · cohesion 0.5 · allowed.includes, ProtectedRoute, roleCanAccess()
- Community 84: 4 nodes · cohesion 0.5 · Innings, InningsBreakScreen, handleStartSecondInnings()
- Community 85: 4 nodes · cohesion 0.5 · balls, MatchOverviewScreen, officials.map
- Community 86: 4 nodes · cohesion 0.5 · Badge(), MatchStatusBadge(), RoleBadge()
- Community 87: 4 nodes · cohesion 0.5 · PageHeader(), SectionLabel(), TabBar()
- Community 88: 4 nodes · cohesion 0.33 · allItems.filter, includes, useState, getNavItems()
- Community 89: 4 nodes · cohesion 0.33 · finalizeSelectionProcess, setActiveSelectionTeam, setShowSavedToast, handleSaveSquad()
- Community 90: 4 nodes · cohesion 0.33 · api.rebuildTeams, Districts, setIsRebuildingTeams, handleRebuildTeams()
- Community 91: 4 nodes · cohesion 0.0 · Add, currentList.filter, currentList.includes, handleAssignRole()
- Community 92: 4 nodes · cohesion 0.33 · api.finalizeSquad, setRepresentativeTeams, fetchProfiles(), finalizeSelectionProcess()
- Community 93: 3 nodes · cohesion 0.67 · AccessControlScreen, password.replace
- Community 94: 3 nodes · cohesion 0.67 · onSelectPlayer, PlayerList
- Community 95: 3 nodes · cohesion 0.67 · onToggleShortlist, Shortlist
- Community 96: 3 nodes · cohesion 0.67 · PRIMARY_TABS.filter, translateX
- Community 97: 3 nodes · cohesion 0.67 · battingStyle.toLowerCase, district.toLowerCase
- Community 98: 3 nodes · cohesion 0.33 · prev.includes, Rohan
- Community 99: 3 nodes · cohesion 0.67 · is, player_registrations
- Community 100: 3 nodes · cohesion 0.67 · config, require
- Community 101: 3 nodes · cohesion 0.67 · runs, runTest
- Community 102: 3 nodes · cohesion 0.0 · localStorage.getItem, localStorage.setItem, setTimeout
- Community 103: 3 nodes · cohesion 0.0 · onChange, players.find, useMemo
- Community 104: 3 nodes · cohesion 0.0 · filteredPlayers.map, players.filter, setSearchQuery
- Community 105: 3 nodes · cohesion 0.0 · api.deletePlayer, players.delete, setPlayers
- Community 106: 3 nodes · cohesion 0.33 · Set, setAgeCategories, toggleSelectAll()
- Community 107: 3 nodes · cohesion 0.67 · squad.some, teams.find, getPlayerTeam()
- Community 108: 3 nodes · cohesion 0.0 · gender.toLowerCase, onCreateTeam, parseInt
- Community 109: 2 nodes · cohesion 1.0 · checkEnum
- Community 110: 2 nodes · cohesion 1.0 · AnimatedPage()
- Community 111: 2 nodes · cohesion 1.0 · Header
- Community 112: 2 nodes · cohesion 1.0 · FinalSquad
- Community 113: 2 nodes · cohesion 1.0 · PlayerComparison
- Community 114: 2 nodes · cohesion 1.0 · BottomSheet
- Community 115: 2 nodes · cohesion 1.0 · ErrorState
- Community 116: 2 nodes · cohesion 1.0 · Modal
- Community 117: 2 nodes · cohesion 1.0 · Skeleton
- Community 118: 2 nodes · cohesion 1.0 · selectedSquad.filter
- Community 119: 2 nodes · cohesion 1.0 · MatchFolder
- Community 120: 2 nodes · cohesion 1.0 · console.dir
- Community 121: 2 nodes · cohesion 0.0 · async, console.error
- Community 122: 2 nodes · cohesion 0.0 · haptics.light, useHaptics
- Community 123: 2 nodes · cohesion 0.0 · React.useEffect, setIsSaving
- Community 124: 2 nodes · cohesion 0.0 · contextPlayers.find, searchQuery.trim
- Community 125: 2 nodes · cohesion 1.0 · role.toLowerCase, completeLogin()
- Community 126: 1 nodes · cohesion 1.0 · no non-file members
- Community 127: 1 nodes · cohesion 1.0 · no non-file members
- Community 128: 1 nodes · cohesion 1.0 · no non-file members
- Community 129: 1 nodes · cohesion 1.0 · no non-file members
- Community 130: 1 nodes · cohesion 1.0 · no non-file members
- Community 131: 1 nodes · cohesion 1.0 · no non-file members
- Community 132: 1 nodes · cohesion 1.0 · no non-file members
- Community 133: 1 nodes · cohesion 1.0 · no non-file members
- Community 134: 1 nodes · cohesion 1.0 · no non-file members
- Community 135: 1 nodes · cohesion 1.0 · no non-file members
- Community 136: 1 nodes · cohesion 1.0 · no non-file members
- Community 137: 1 nodes · cohesion 1.0 · no non-file members
- Community 138: 1 nodes · cohesion 1.0 · no non-file members
- Community 139: 1 nodes · cohesion 1.0 · no non-file members
- Community 140: 1 nodes · cohesion 1.0 · no non-file members
- Community 141: 1 nodes · cohesion 1.0 · no non-file members
- Community 142: 1 nodes · cohesion 1.0 · no non-file members
- Community 143: 1 nodes · cohesion 1.0 · no non-file members
- Community 144: 1 nodes · cohesion 1.0 · no non-file members
- Community 145: 1 nodes · cohesion 1.0 · no non-file members
- Community 146: 1 nodes · cohesion 1.0 · no non-file members
- Community 147: 1 nodes · cohesion 1.0 · no non-file members
- Community 148: 1 nodes · cohesion 1.0 · no non-file members
- Community 149: 1 nodes · cohesion 1.0 · useLocation
- Community 150: 1 nodes · cohesion 1.0 · toLowerCase
- Community 151: 1 nodes · cohesion 1.0 · Bat
- Community 152: 1 nodes · cohesion 1.0 · setIsAuthenticated
- Community 153: 1 nodes · cohesion 1.0 · replace
- Community 154: 1 nodes · cohesion 1.0 · console.warn
- Community 155: 1 nodes · cohesion 1.0 · formatOvers
- Community 156: 1 nodes · cohesion 1.0 · setDistrictFilter
- Community 157: 1 nodes · cohesion 1.0 · toFixed
- Community 158: 1 nodes · cohesion 1.0 · setInnings
- Community 159: 1 nodes · cohesion 1.0 · players.map
- Community 160: 1 nodes · cohesion 1.0 · Select
- Community 161: 1 nodes · cohesion 1.0 · toggleShortlist
- Community 162: 1 nodes · cohesion 1.0 · JDCA_DISTRICTS.map
- Community 163: 1 nodes · cohesion 1.0 · None
- Community 164: 1 nodes · cohesion 1.0 · setGender
- Community 165: 1 nodes · cohesion 1.0 · setSelectedPlayer
- Community 166: 1 nodes · cohesion 1.0 · haptics.medium
- Community 167: 1 nodes · cohesion 1.0 · name.split
- Community 168: 1 nodes · cohesion 1.0 · setValidationError
- Community 169: 1 nodes · cohesion 1.0 · e.stopPropagation
- Community 170: 1 nodes · cohesion 1.0 · onClose
- Community 171: 1 nodes · cohesion 1.0 · teams.filter
- Community 172: 1 nodes · cohesion 1.0 · toString
- Community 173: 1 nodes · cohesion 1.0 · padStart
- Community 174: 1 nodes · cohesion 1.0 · Date.now
- Community 175: 1 nodes · cohesion 1.0 · onUpdateTeamRoles
- Community 176: 1 nodes · cohesion 1.0 · map
- Community 177: 1 nodes · cohesion 1.0 · canvas-confetti
- Community 178: 1 nodes · cohesion 1.0 · Date
- Community 179: 1 nodes · cohesion 1.0 · AGE_CATEGORIES.map
- Community 180: 1 nodes · cohesion 1.0 · handleOpenComparison()
- Community 181: 1 nodes · cohesion 1.0 · addMatchRow()

## Ambiguous Edges
- `apply-bug5-sql.js` -> `console.error` · relation `calls` · apply-bug5-sql.js
- `apply-bug5-sql.js` -> `console.error` · relation `calls` · apply-bug5-sql.js
- `apply-bug5-sql.js` -> `console.log` · relation `calls` · apply-bug5-sql.js
- `apply-bug5-sql.js` -> `console.log` · relation `calls` · apply-bug5-sql.js
- `apply-bug5-sql.js` -> `createClient` · relation `calls` · apply-bug5-sql.js
- `apply-bug5-sql.js` -> `dotenv.config` · relation `calls` · apply-bug5-sql.js
- `apply-bug5-sql.js` -> `fs.readFileSync` · relation `calls` · apply-bug5-sql.js
- `apply-bug5-sql.js` -> `part.trim` · relation `calls` · apply-bug5-sql.js
- `apply-bug5-sql.js` -> `path.join` · relation `calls` · apply-bug5-sql.js
- `apply-bug5-sql.js` -> `process.cwd` · relation `calls` · apply-bug5-sql.js

## Knowledge Gaps
- Isolated grounded nodes: 795
- Thin communities: 93, 94, 95, 96, 97, 98, 99, 100, 101, 109, 111, 112, 113, 114, 115, 116, 117, 118, 119, 120, 121, 122, 123, 124, 125, 149, 150, 151, 152, 153, 154, 155, 156, 157, 158, 159, 160, 161, 162, 163, 164, 165, 166, 167, 168, 169, 170, 171, 172, 173, 174, 175, 176, 177, 178, 179, 180, 181
- Sample isolated nodes: `get_eligible_players_for_process`, `RLS`, `SELECTOR`, `selector_assignments`, `its`

## Suggested Questions
- **Why is `react` central to the repository?**
  It has the highest grounded degree in community 53.
- **How does `toggleShortlist()` connect to `prev.includes` across boundaries?**
  ambiguous relationship, cross-file link, cross-community bridge, cross-boundary directory hop, peripheral-to-hub jump
- **What responsibilities are grouped inside Community 0?**
  Representative nodes: age_category_id, ageCategories.forEach, assignManOfTheMatch.
- **What responsibilities are grouped inside Community 1?**
  Representative nodes: Action, api.finalizeMatch, api.getSelectionCandidates.
- **What responsibilities are grouped inside Community 2?**
  Representative nodes: map, Number, activeTournaments.map.
