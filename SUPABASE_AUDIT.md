# JDCA Supabase Integration Audit

## 1. Current Architecture
- **Frontend Core**: React 19 + Vite, styled with Tailwind CSS v4.
- **State Management**: Centralized in `CricketContext.jsx`. The context relies heavily on local React state (`useState`), populated initially by Dexie.
- **Local Database (Offline-First)**: `dexie` is used to cache `matches`, `teams`, `tournaments`, and `players`. 
- **Sync Engine**: `SyncService.js` is set up to listen to online/offline events and process queues, but the queue processor uses mock timeout promises instead of actual Supabase mutations.
- **Backend Service**: Supabase is initialized via `src/lib/supabase.js`.

## 2. Supabase Integration Status
- **Read Operations**: Partially implemented. `CricketContext.jsx` successfully attempts to fetch `matches`, `teams`, `tournaments`, and `players` from Supabase on mount if the local Dexie store is empty.
- **Realtime Data**: Partially implemented. A channel subscription (`public:matches`) exists in Context that updates local state and Dexie when matches are inserted/updated/deleted by other clients.
- **Write Operations (Mutations)**: **Not implemented.** All writes (scoring a delivery, registering a player, creating a tournament) are currently updating local React state only. `SyncService.js` has placeholder comments where real mutations should occur.

## 3. Authentication Status
- **Client**: `supabase.auth` is integrated and handles session persistence (e.g., `signInWithPassword` in `AuthScreen.jsx`).
- **Profiles Mapping**: Successfully fetches the logged-in user's `role` from the `profiles` table in `CricketContext.jsx` (`onAuthStateChange`).
- **Debt**: Local mock data (`registeredUsers` in Context) still exists and should be phased out.

## 4. Role/Permission Status
- **UI Logic**: Role checks (SuperAdmin, Admin, Scorer, Selector, Player) are strictly enforced in the frontend using the `userRole` state.
- **Database Logic (RLS)**: The `profiles` table uses the `app_role` enum. The frontend depends on this, but Row Level Security (RLS) policies need to be audited (in `fix_rls.sql` / Supabase dashboard) to ensure an API user cannot bypass frontend UI checks.

## 5. Feature / Data Mapping

| Feature | Current Data Source | Current Read Operation | Current Write Operation | Target Supabase Table | Missing Work |
|---------|---------------------|------------------------|-------------------------|-----------------------|--------------|
| **Users/Auth** | Supabase Auth + Profiles | `supabase.auth.getSession()` | `signInWithPassword()` | `auth.users` / `profiles` | Remove `registeredUsers` mock array. |
| **Roles** | Context `userRole` | `supabase.from('profiles')` | Local UI state | `profiles.role` | None for reads. RLS needed for writes. |
| **Players** | Dexie / Supabase | `supabase.from('players')` | `registerPlayer` (Local) | `players` / `player_registrations` | Sync new player creations to DB. |
| **Teams** | Dexie / Supabase | `supabase.from('teams')` | Local UI state | `teams` / `team_players` | Sync team compositions. |
| **Tournaments** | Dexie / Supabase | `supabase.from('tournaments')`| `TournamentManagerModal` | `tournaments` | Implement form submission mutation. |
| **Matches** | Dexie / Supabase | `supabase.from('matches')` | Local state changes | `matches` | Sync match metadata and toss decisions. |
| **Match Scoring** | Local `setDeliveryLog` | Local arrays | Local state updates | `deliveries` / `innings` / `match_rosters` | Pipe `recordDeliveryEvent` into `SyncService` for insert to `deliveries` table. |
| **Selection/Shortlist** | Context Mock State | `shortlistedIds` (Local array) | `toggleShortlist` (Local) | `selection_candidates` | Wire up the Dashboard to actual DB records. |
| **Match Reports** | N/A | N/A | N/A | (Derived Views) | Need to implement querying of derived views (`v_player_match_batting`) for PDF/UI generation. |

## 6. Missing Mutations
1. **Tournament Creation**: `TournamentManagerModal.jsx` handles state but does not push to the `tournaments` or `matches` tables.
2. **Team Selection**: `TeamSelectionDashboard.jsx` handles UI selection but does not save data to `selection_candidates` or `selection_decisions`.
3. **Live Scoring**: Every delivery, extra, or wicket currently just pushes to `setBallHistory` and `setDeliveryLog`. These need to be queued in `SyncService` to insert into the `deliveries` table, and update the `innings` table.
4. **Player Registration**: `registerPlayer` just updates the local `players` array.

## 7. Missing Queries
- The app fetches the base entities (`players`, `matches`) but doesn't fetch complex joins yet (e.g., getting a match's existing `deliveries` to hydrate the scorecard if a scorer reloads the app midway through a match).
- Selection process data (`selection_processes`, `selection_candidates`) is currently mocked in context (`representativeTeams`, `activeSelectionTeam`).

## 8. Schema Gaps
The `supabase_schema.sql` is highly robust and accurately models the domain.
- **Match Setup**: `TournamentManagerModal.jsx` creates match rows with `umpireName` and `scorerName`. This perfectly maps to the `matches.umpire_name` and `matches.scorer_name` varchar fields.
- **Team Balance Roles**: UI uses 'Batter', 'Bowler', 'All-Rounder', 'Wicket Keeper'. This exactly matches the `player_primary_role` enum.
- **Conclusion**: **No schema gaps identified.** The schema is ready to support the UI.

## 9. Security/RLS Concerns
- **Critical Risk**: Since the frontend queries Supabase directly, robust Row Level Security (RLS) policies must be implemented. Without them, a user logged in as a 'Player' could potentially POST to the `deliveries` table. Ensure `fix_rls.sql` enforces roles based on `auth.uid() = profiles.id -> role`.

## 10. Offline-Sync Concerns
- **Implementation Required**: `SyncService.executeOrQueue` needs to be fully wired up. The scoring engine should not call `supabase.from().insert()` directly; it must always use `SyncService` so that if a scorer drops connection in a stadium, the deliveries are cached in Dexie and bulk-inserted upon reconnection.

## 11. Recommended Implementation Order
1. **Cleanup**: Remove mock data arrays from `CricketContext.jsx` (e.g., `registeredUsers`, `representativeTeams`).
2. **Admin Flow (Tournaments)**: Connect `TournamentManagerModal.jsx` to Supabase `tournaments` and `matches` tables to allow admins to create schedules.
3. **Selection Flow**: Connect `TeamSelectionDashboard.jsx` to `selection_candidates` and `team_players` tables.
4. **Scoring Flow (Complex)**: Update the scoring engine state machine to map local delivery logs to `SyncService.js` queued mutations for the `deliveries` table.
5. **RLS Verification**: Ensure database policies restrict operations correctly.

---

### Exact Files to Modify in the Next Step (Step 1 & 2):
If we begin with cleanup and Admin Tournament Flow:
1. `src/context/CricketContext.jsx` (Remove mock arrays, fetch `selection_processes`)
2. `src/components/ui/TournamentManagerModal.jsx` (Hook up onSave to call an API method)
3. `src/lib/api.js` (Create mutation wrappers for `createTournament` and `createMatch`)
