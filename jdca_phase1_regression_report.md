# Phase 1 Regression Suite Report: State Machine & Identity Enforcement

I have simulated the deployment of the Phase 1 Database State Machine Trigger (`check_valid_match_transition`) and the Tournament Identity Constraint (`tournaments_identity_unique_idx`) in an isolated test layer. I then executed a full static regression trace across the entire React frontend to identify which application workflows would break.

## 1. Workflows That Will Break (Requiring App-Level Fixes)

### A. Tournament Creation Modal Crash (T-02 violation mapping)
**Trigger:** Admin attempts to create a new tournament with the same `(name, season, age_category, gender)`.
**Current App Behavior:** The API succeeds, creating a duplicate.
**New DB Behavior:** PostgreSQL rejects the insert with `23505 (unique_violation)`.
**Workflow Breakage:** `api.createTournament()` currently has no logic to catch a `23505` error. The UI will throw an unhandled promise rejection, freezing the `<TournamentManagerModal>` in a perpetual `isSaving(true)` state without notifying the user that the tournament already exists.
**Required App Fix:** Add specific error parsing in `TournamentManagerModal.jsx` around `api.createTournament()` to catch duplicate violations and display: *"A tournament with this exact name, season, category, and gender already exists."*

### B. Fixture Generation Crash (T-03 violation mapping)
**Trigger:** Admin generates a schedule that contains at least one match fixture that already exists.
**Current App Behavior:** Postgres' existing `matches_fixture_unique_idx` blocks it, but `api.createDetailedMatches()` maps inserts into a `Promise.all()`. 
**New DB Behavior:** The database strictly prevents duplicates.
**Workflow Breakage:** If a single match fails the unique index check, the entire `Promise.all()` rejects, the modal crashes, and the administrator receives no feedback on which matches succeeded and which failed.
**Required App Fix:** `api.createDetailedMatches()` must use an `UPSERT` (on conflict do nothing) pattern rather than blindly inserting arrays.

### C. Double-Click Finalization Crash (M-03 mapping)
**Trigger:** A scorer clicks "Finalize Match" twice in rapid succession before the UI redirects.
**Current App Behavior:** The database rejects the second update because the first made it `COMPLETED` (via `trg_matches_immutable`). The UI throws a console error but redirects anyway.
**New DB Behavior:** The State Machine trigger also violently rejects `COMPLETED -> COMPLETED`.
**Workflow Breakage:** While it doesn't corrupt data, it throws a 500 error in the background sync.
**Required App Fix:** `finalizeMatch()` in `api.js` needs idempotency logic: if `match.status === 'COMPLETED'` and the requested winner is identical, catch the Postgres exception and silently return `true`.

## 2. Workflows That Successfully Survived the Regression

Through tracing all `updateMatchDetails` and `persistMatchSetup` calls:

*   **`startMatch()` (`api.js:1255`)**: Attempts `SCHEDULED -> IN_PROGRESS`. Validated and survives.
*   **`processDelivery()` triggering innings completion**: State machine evaluates `IN_PROGRESS -> INNINGS_BREAK`. Validated and survives.
*   **Starting Innings 2**: `api.createInnings()` is called, and `CricketContext` updates `matchStatus` to `IN_PROGRESS`. DB evaluates `INNINGS_BREAK -> IN_PROGRESS`. Validated and survives.
*   **End Match Early (`ScoringScreen.jsx:1008`)**: Sets `COMPLETED` from either `IN_PROGRESS` or `INNINGS_BREAK`. The updated DB trigger explicitly permits `INNINGS_BREAK -> COMPLETED` for rain/DLS scenarios. Validated and survives.
*   **Updating Unrelated Fields:** `CricketContext.jsx:1138` updates `winner_team_id` but does NOT pass `status`. The DB trigger receives `NEW.status = OLD.status` and bypasses the state checks, allowing the update to merge perfectly. Validated and survives.

## 3. The New Authorized Caller Matrix

Going forward, these are the **only** functions authorized to invoke the state transitions. Generic component-level `updateMatchDetails({status: ...})` calls must be migrated to these explicit domain functions:

| Transition | Authorized API Function | UI Component Caller |
| :--- | :--- | :--- |
| `SCHEDULED` → `IN_PROGRESS` | `api.persistMatchSetup()` | `<MatchSetupScreen>` |
| `IN_PROGRESS` → `INNINGS_BREAK` | `api.endInnings()` *(to be implemented)* | `<CricketContext>` engine |
| `INNINGS_BREAK` → `IN_PROGRESS` | `api.startNextInnings()` *(to be implemented)* | `<ScoringScreen>` |
| `*` → `COMPLETED` | `api.finalizeMatch()` | `<MatchResultScreen>` / `<ScoringScreen>` |
| `*` → `ABANDONED` / `CANCELLED` | `api.abandonMatch()` *(to be implemented)* | `<ScoringScreen>` (End Early) |

## Conclusion

The database constraints are safe to deploy **after** we patch `TournamentManagerModal.jsx` and `api.createDetailedMatches()` to handle `23505` conflicts gracefully. 
