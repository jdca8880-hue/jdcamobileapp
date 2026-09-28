# Architecture Context

## System

- Project: `JDCA`
- Target Path: `C:\Users\lenovo\Desktop\WEBBDEV\JDCA`
- Dominant Directories: `src`, `temp_extraction`, `02_selector_assignment_refactor.sql`, `03_season_management_architecture.sql`, `04_admin_delete_user.sql`
- Dependency Shape: 1021 subsystem links, 4514 ambiguous edges, 4 tagged entrypoints, 0 enriched docs
- Summary: JDCA contains 182 subsystems, 1021 cross-subsystem flows, 0 processed documents, and 1181 external dependencies derived from 3513 extracted code nodes.

## Subsystem Inventory

### src/lib [MEDIUM]

- Kind: `ui`
- Summary: src/lib is a ui subsystem covering 1 paths and 99 symbols; strongest evidence: calls x472, imports x14.
- Paths: `src/lib/api.js`
- Key Symbols: `select`, `processMatches()`, `console.warn`, `limit`, `supabase.from`
- Depends On: `subsystem-130-0-src-lib`, `subsystem-16-0-src-components`, `subsystem-176-0-src-components`, `subsystem-178-0-src-engine`, `subsystem-23-0-src-engine`, `subsystem-27-0-apply-bug5-sql-js`, `subsystem-67-0-src-lib`, `subsystem-82-0-delete-season-js`
- Depended On By: `subsystem-1-0-src-context`, `subsystem-100-0-test-players3-js`, `subsystem-101-0-test-stats-js`, `subsystem-120-0-test-players-js`, `subsystem-130-0-src-lib`, `subsystem-14-0-src-services`, `subsystem-15-0-src-components`, `subsystem-18-0-src-lib`, `subsystem-20-0-temp-extraction`, `subsystem-24-0-src-components`, `subsystem-3-0-src-components`, `subsystem-31-0-src-components`, `subsystem-34-0-src-components`, `subsystem-39-0-src-components`, `subsystem-40-0-src-components`, `subsystem-45-0-src-components`, `subsystem-56-0-src-components`, `subsystem-62-0-src-components`, `subsystem-7-0-src-components`, `subsystem-8-0-src-components`, `subsystem-99-0-test-players2-js`
- Responsibilities: Primary symbols: call_reference x98, function x1.; Internal relations: calls x278, contains x1.; Exposes 100 interface candidates.
- Evidence: src/lib/api.js:processMatches(), src/lib/api.js:BIN, src/lib/api.js:Error

### src/context [MEDIUM]

- Kind: `adapter`
- Summary: src/context is a adapter subsystem covering 1 paths and 95 symbols; strongest evidence: calls x376, contains x53.
- Paths: `src/context/CricketContext.jsx`
- Key Symbols: `hydrateMatchState()`, `applyStateResult()`, `undoLastAction()`, `recordDeliveryEvent()`, `registerPlayer()`
- Depends On: `subsystem-0-0-src-lib`, `subsystem-102-0-src-components`, `subsystem-105-0-src-components`, `subsystem-106-0-src-components`, `subsystem-108-0-src-components`, `subsystem-121-0-src-components`, `subsystem-127-0-src-data`, `subsystem-130-0-src-lib`, `subsystem-14-0-src-services`, `subsystem-149-0-src-app-jsx`, `subsystem-154-0-src-components`, `subsystem-155-0-src-components`, `subsystem-158-0-src-components`, `subsystem-163-0-src-components`, `subsystem-165-0-src-components`, `subsystem-168-0-src-components`, `subsystem-172-0-src-components`, `subsystem-174-0-src-components`, `subsystem-177-0-src-components`, `subsystem-19-0-src-components`, `subsystem-2-0-src-components`, `subsystem-21-0-src-components`, `subsystem-29-0-src-components`, `subsystem-3-0-src-components`, `subsystem-33-0-src-components`, `subsystem-39-0-src-components`, `subsystem-41-0-src-lib`, `subsystem-5-0-src-context`, `subsystem-53-0-src-app-jsx`, `subsystem-6-0-src-components`, `subsystem-7-0-src-components`, `subsystem-70-0-src-components`, `subsystem-80-0-src-components`, `subsystem-88-0-src-components`, `subsystem-92-0-src-context`, `subsystem-98-0-temp-extraction`
- Depended On By: `subsystem-11-0-src-components`, `subsystem-111-0-src-components`, `subsystem-15-0-src-components`, `subsystem-19-0-src-components`, `subsystem-2-0-src-components`, `subsystem-22-0-src-components`, `subsystem-24-0-src-components`, `subsystem-29-0-src-components`, `subsystem-3-0-src-components`, `subsystem-30-0-src-components`, `subsystem-32-0-src-components`, `subsystem-33-0-src-components`, `subsystem-39-0-src-components`, `subsystem-45-0-src-components`, `subsystem-47-0-src-components`, `subsystem-53-0-src-app-jsx`, `subsystem-54-0-src-components`, `subsystem-56-0-src-components`, `subsystem-6-0-src-components`, `subsystem-62-0-src-components`, `subsystem-69-0-src-components`, `subsystem-7-0-src-components`, `subsystem-70-0-src-components`, `subsystem-74-0-src-components`, `subsystem-75-0-src-components`, `subsystem-76-0-src-components`, `subsystem-77-0-src-components`, `subsystem-78-0-src-components`, `subsystem-8-0-src-components`, `subsystem-83-0-src-components`, `subsystem-84-0-src-components`, `subsystem-85-0-src-components`, `subsystem-9-0-src-components`, `subsystem-92-0-src-context`, `subsystem-93-0-src-components`, `subsystem-98-0-temp-extraction`
- Responsibilities: Primary symbols: call_reference x67, function x28.; Internal relations: calls x213, contains x28.; Exposes 11 interface candidates.
- Evidence: src/context/CricketContext.jsx:CricketProvider(), src/context/CricketContext.jsx:applyStateResult(), src/context/CricketContext.jsx:captureSnapshot()

### src/components [MEDIUM]

- Kind: `ui`
- Summary: src/components is a ui subsystem covering 7 paths and 67 symbols; strongest evidence: calls x300, imports x21.
- Paths: `src/components/screens/AccessControlScreen.jsx`, `src/components/screens/MatchSetupScreen.jsx`, `src/components/screens/ScoringScreen.jsx`, `src/components/ui/MatchScorecard.jsx`, `src/context/CricketContext.jsx`, `temp_extraction/src/components/screens/ScoringScreen.jsx`, `temp_extraction/src/components/ui/MatchScorecard.jsx`
- Key Symbols: `map`, `submitWicket()`, `Number`, `checkHydration()`, `selectNewBatter()`
- Depends On: `subsystem-1-0-src-context`, `subsystem-103-0-src-components`, `subsystem-116-0-src-components`, `subsystem-121-0-src-components`, `subsystem-122-0-src-components`, `subsystem-13-0-src-engine`, `subsystem-130-0-src-lib`, `subsystem-14-0-src-services`, `subsystem-148-0-temp-extraction`, `subsystem-155-0-src-components`, `subsystem-166-0-src-components`, `subsystem-167-0-src-components`, `subsystem-168-0-src-components`, `subsystem-22-0-src-components`, `subsystem-29-0-src-components`, `subsystem-3-0-src-components`, `subsystem-52-0-src-hooks`, `subsystem-53-0-src-app-jsx`, `subsystem-56-0-src-components`, `subsystem-6-0-src-components`, `subsystem-66-0-src-components`, `subsystem-70-0-src-components`, `subsystem-73-0-src-components`, `subsystem-79-0-src-components`, `subsystem-88-0-src-components`, `subsystem-98-0-temp-extraction`
- Depended On By: `subsystem-1-0-src-context`, `subsystem-106-0-src-components`, `subsystem-131-0-temp-extraction`, `subsystem-135-0-temp-extraction`, `subsystem-138-0-temp-extraction`, `subsystem-140-0-temp-extraction`, `subsystem-141-0-temp-extraction`, `subsystem-143-0-temp-extraction`, `subsystem-15-0-src-components`, `subsystem-19-0-src-components`, `subsystem-22-0-src-components`, `subsystem-26-0-temp-extraction`, `subsystem-3-0-src-components`, `subsystem-42-0-temp-extraction`, `subsystem-45-0-src-components`, `subsystem-48-0-src-components`, `subsystem-5-0-src-context`, `subsystem-53-0-src-app-jsx`, `subsystem-56-0-src-components`, `subsystem-57-0-src-components`, `subsystem-59-0-temp-extraction`, `subsystem-6-0-src-components`, `subsystem-60-0-temp-extraction`, `subsystem-62-0-src-components`, `subsystem-65-0-src-components`, `subsystem-66-0-src-components`, `subsystem-69-0-src-components`, `subsystem-72-0-temp-extraction`, `subsystem-76-0-src-components`, `subsystem-77-0-src-components`, `subsystem-8-0-src-components`, `subsystem-9-0-src-components`, `subsystem-93-0-src-components`
- Responsibilities: Primary symbols: call_reference x56, function x11.; Internal relations: calls x159, contains x17.; Exposes 7 interface candidates.
- Evidence: src/components/screens/AccessControlScreen.jsx:map, src/components/screens/MatchSetupScreen.jsx:Number, src/components/screens/ScoringScreen.jsx:checkHydration()

### src/components [MEDIUM]

- Kind: `ui`
- Summary: src/components is a ui subsystem covering 4 paths and 64 symbols; strongest evidence: calls x300, contains x20.
- Paths: `src/App.jsx`, `src/components/screens/InningsInitScreen.jsx`, `src/components/screens/MatchSetupScreen.jsx`, `temp_extraction/src/components/screens/MatchSetupScreen.jsx`
- Key Symbols: `handleStartMatch()`, `filter`, `String`, `handleStartInnings()`, `setMatchSetup`
- Depends On: `subsystem-0-0-src-lib`, `subsystem-1-0-src-context`, `subsystem-103-0-src-components`, `subsystem-104-0-src-components`, `subsystem-11-0-src-components`, `subsystem-121-0-src-components`, `subsystem-123-0-src-components`, `subsystem-150-0-src-components`, `subsystem-159-0-src-components`, `subsystem-160-0-src-components`, `subsystem-167-0-src-components`, `subsystem-2-0-src-components`, `subsystem-24-0-src-components`, `subsystem-29-0-src-components`, `subsystem-30-0-src-components`, `subsystem-32-0-src-components`, `subsystem-53-0-src-app-jsx`, `subsystem-6-0-src-components`, `subsystem-61-0-src-components`, `subsystem-69-0-src-components`, `subsystem-7-0-src-components`, `subsystem-75-0-src-components`, `subsystem-88-0-src-components`, `subsystem-98-0-temp-extraction`
- Depended On By: `subsystem-1-0-src-context`, `subsystem-119-0-temp-extraction`, `subsystem-131-0-temp-extraction`, `subsystem-15-0-src-components`, `subsystem-2-0-src-components`, `subsystem-26-0-temp-extraction`, `subsystem-32-0-src-components`, `subsystem-39-0-src-components`, `subsystem-42-0-temp-extraction`, `subsystem-45-0-src-components`, `subsystem-53-0-src-app-jsx`, `subsystem-54-0-src-components`, `subsystem-60-0-temp-extraction`, `subsystem-62-0-src-components`, `subsystem-72-0-temp-extraction`, `subsystem-9-0-src-components`, `subsystem-98-0-temp-extraction`
- Responsibilities: Primary symbols: call_reference x51, function x13.; Internal relations: calls x160, contains x20.; Exposes 5 interface candidates.
- Evidence: src/App.jsx:_0_20px_rgba, src/components/screens/InningsInitScreen.jsx:BallIcon(), src/components/screens/InningsInitScreen.jsx:BatIcon()

### 02_selector_assignment_refactor.sql [LOW]

- Kind: `data_layer`
- Summary: 02_selector_assignment_refactor.sql is a data_layer subsystem covering 10 paths and 47 symbols; strongest evidence: queries x95, updates x65.
- Paths: `02_selector_assignment_refactor.sql`, `03_season_management_architecture.sql`, `04_admin_delete_user.sql`, `06_match_finalization_policies.sql`, `admin_password_reset.sql`, `alter_table.sql`, `dummy_data.sql`, `fix_rls.sql`, `generate_teams.sql`, `supabase_schema.sql`
- Key Symbols: `matches`, `players`, `teams`, `selection_processes`, `age_categories`
- Depends On: `none`
- Depended On By: `none`
- Responsibilities: Primary symbols: sql_table x47.; Internal relations: queries x95, updates x65.; Exposes 57 interface candidates.
- Evidence: 02_selector_assignment_refactor.sql:IF, 02_selector_assignment_refactor.sql:RLS, 02_selector_assignment_refactor.sql:SELECTOR

### src/context [MEDIUM]

- Kind: `module`
- Summary: src/context is a module subsystem covering 1 paths and 55 symbols; strongest evidence: calls x181, contains x3.
- Paths: `src/context/CricketContext.jsx`
- Key Symbols: `setupDataAndSync()`, `refreshAdminData()`, `resolveInningsId()`, `away_team_id`, `home_team_id`
- Depends On: `subsystem-105-0-src-components`, `subsystem-121-0-src-components`, `subsystem-152-0-src-components`, `subsystem-154-0-src-components`, `subsystem-160-0-src-components`, `subsystem-165-0-src-components`, `subsystem-2-0-src-components`, `subsystem-21-0-src-components`, `subsystem-28-0-src-components`, `subsystem-31-0-src-components`, `subsystem-39-0-src-components`, `subsystem-56-0-src-components`, `subsystem-66-0-src-components`, `subsystem-7-0-src-components`, `subsystem-70-0-src-components`, `subsystem-92-0-src-context`
- Depended On By: `subsystem-1-0-src-context`, `subsystem-125-0-temp-extraction`
- Responsibilities: Primary symbols: call_reference x52, function x3.; Internal relations: calls x92.; Exposes 2 interface candidates.
- Evidence: src/context/CricketContext.jsx:refreshAdminData(), src/context/CricketContext.jsx:resolveInningsId(), src/context/CricketContext.jsx:setupDataAndSync()

### src/components [MEDIUM]

- Kind: `ui`
- Summary: src/components is a ui subsystem covering 8 paths and 47 symbols; strongest evidence: calls x111, contains x30.
- Paths: `src/components/CricketIcons.jsx`, `src/components/screens/NewsScreen.jsx`, `src/components/screens/ScoringScreen.jsx`, `src/components/screens/TournamentsScreen.jsx`, `src/components/selection/CampaignOverview.jsx`, `src/components/selection/PerformanceGraphs.jsx`, `src/components/selection/PlayerDetail.jsx`, `temp_extraction/src/components/CricketIcons.jsx`
- Key Symbols: `toUpperCase`, `slice`, `../assets/bat-icon.png`, `join`, `Math.max`
- Depends On: `subsystem-1-0-src-context`, `subsystem-104-0-src-components`, `subsystem-12-0-src-components`, `subsystem-150-0-src-components`, `subsystem-153-0-src-components`, `subsystem-157-0-src-components`, `subsystem-2-0-src-components`, `subsystem-21-0-src-components`, `subsystem-22-0-src-components`, `subsystem-29-0-src-components`, `subsystem-36-0-src-components`, `subsystem-53-0-src-app-jsx`, `subsystem-88-0-src-components`
- Depended On By: `subsystem-1-0-src-context`, `subsystem-132-0-temp-extraction`, `subsystem-137-0-temp-extraction`, `subsystem-138-0-temp-extraction`, `subsystem-144-0-temp-extraction`, `subsystem-15-0-src-components`, `subsystem-19-0-src-components`, `subsystem-2-0-src-components`, `subsystem-21-0-src-components`, `subsystem-3-0-src-components`, `subsystem-39-0-src-components`, `subsystem-42-0-temp-extraction`, `subsystem-45-0-src-components`, `subsystem-54-0-src-components`, `subsystem-69-0-src-components`, `subsystem-72-0-temp-extraction`, `subsystem-75-0-src-components`, `subsystem-78-0-src-components`, `subsystem-79-0-src-components`, `subsystem-84-0-src-components`, `subsystem-9-0-src-components`
- Responsibilities: Primary symbols: call_reference x28, function x18.; Internal relations: calls x59, contains x30.; Exposes 2 interface candidates.
- Evidence: src/components/CricketIcons.jsx:CricketAppLogo(), src/components/CricketIcons.jsx:CricketBallIcon(), src/components/CricketIcons.jsx:CricketBatAsset()

### src/components [MEDIUM]

- Kind: `ui`
- Summary: src/components is a ui subsystem covering 1 paths and 46 symbols; strongest evidence: calls x231, imports x13.
- Paths: `src/components/screens/AdministrationScreen.jsx`
- Key Symbols: `alert`, `handleCreateUser()`, `window.confirm`, `handleResetPassword()`, `handlePermissionChange()`
- Depends On: `subsystem-0-0-src-lib`, `subsystem-1-0-src-context`, `subsystem-102-0-src-components`, `subsystem-121-0-src-components`, `subsystem-126-0-src-components`, `subsystem-154-0-src-components`, `subsystem-174-0-src-components`, `subsystem-175-0-src-components`, `subsystem-24-0-src-components`, `subsystem-31-0-src-components`, `subsystem-34-0-src-components`, `subsystem-40-0-src-components`, `subsystem-53-0-src-app-jsx`, `subsystem-64-0-temp-extraction`, `subsystem-75-0-src-components`, `subsystem-8-0-src-components`, `subsystem-86-0-src-components`, `subsystem-88-0-src-components`
- Depended On By: `subsystem-1-0-src-context`, `subsystem-11-0-src-components`, `subsystem-136-0-temp-extraction`, `subsystem-142-0-temp-extraction`, `subsystem-15-0-src-components`, `subsystem-19-0-src-components`, `subsystem-21-0-src-components`, `subsystem-3-0-src-components`, `subsystem-31-0-src-components`, `subsystem-34-0-src-components`, `subsystem-39-0-src-components`, `subsystem-40-0-src-components`, `subsystem-45-0-src-components`, `subsystem-5-0-src-context`, `subsystem-51-0-src-components`, `subsystem-53-0-src-app-jsx`, `subsystem-61-0-src-components`, `subsystem-64-0-temp-extraction`, `subsystem-65-0-src-components`, `subsystem-70-0-src-components`, `subsystem-73-0-src-components`, `subsystem-8-0-src-components`, `subsystem-80-0-src-components`, `subsystem-81-0-src-components`, `subsystem-89-0-src-components`, `subsystem-9-0-src-components`, `subsystem-90-0-src-components`, `subsystem-91-0-src-components`, `subsystem-92-0-src-context`
- Responsibilities: Primary symbols: call_reference x38, function x7.; Internal relations: calls x89, contains x7.; Exposes 9 interface candidates.
- Evidence: src/components/screens/AdministrationScreen.jsx:deleteUserRecord(), src/components/screens/AdministrationScreen.jsx:handleCreateUser(), src/components/screens/AdministrationScreen.jsx:handlePermissionChange()

### src/components [MEDIUM]

- Kind: `ui`
- Summary: src/components is a ui subsystem covering 1 paths and 33 symbols; strongest evidence: calls x93, contains x8.
- Paths: `src/components/screens/SeasonMigrationTab.jsx`
- Key Symbols: `handleMigrate()`, `loadPlayers()`, `calculateProjectedAgeCategory()`, `handleMigrateSingle()`, `handleRemoveSingle()`
- Depends On: `subsystem-0-0-src-lib`, `subsystem-1-0-src-context`, `subsystem-104-0-src-components`, `subsystem-105-0-src-components`, `subsystem-106-0-src-components`, `subsystem-107-0-src-components`, `subsystem-121-0-src-components`, `subsystem-159-0-src-components`, `subsystem-2-0-src-components`, `subsystem-29-0-src-components`, `subsystem-39-0-src-components`, `subsystem-53-0-src-app-jsx`, `subsystem-56-0-src-components`, `subsystem-7-0-src-components`, `subsystem-73-0-src-components`, `subsystem-88-0-src-components`
- Depended On By: `subsystem-106-0-src-components`, `subsystem-7-0-src-components`
- Responsibilities: Primary symbols: call_reference x27, function x6.; Internal relations: calls x43, contains x6.; Exposes 4 interface candidates.
- Evidence: src/components/screens/SeasonMigrationTab.jsx:calculateProjectedAgeCategory(), src/components/screens/SeasonMigrationTab.jsx:handleMigrate(), src/components/screens/SeasonMigrationTab.jsx:handleMigrateSingle()

### src/components [MEDIUM]

- Kind: `ui`
- Summary: src/components is a ui subsystem covering 4 paths and 29 symbols; strongest evidence: calls x101, imports x11.
- Paths: `src/components/NotificationPrompt.jsx`, `src/components/screens/TeamsScreen.jsx`, `src/components/ui/StatCard.jsx`, `temp_extraction/src/components/ui/StatCard.jsx`
- Key Symbols: `repeat`, `handlePrintRoster()`, `Stats`, `StatCard()`, `StatStrip()`
- Depends On: `subsystem-1-0-src-context`, `subsystem-102-0-src-components`, `subsystem-103-0-src-components`, `subsystem-104-0-src-components`, `subsystem-107-0-src-components`, `subsystem-12-0-src-components`, `subsystem-124-0-src-components`, `subsystem-126-0-src-components`, `subsystem-150-0-src-components`, `subsystem-167-0-src-components`, `subsystem-169-0-src-components`, `subsystem-173-0-src-components`, `subsystem-2-0-src-components`, `subsystem-22-0-src-components`, `subsystem-29-0-src-components`, `subsystem-3-0-src-components`, `subsystem-32-0-src-components`, `subsystem-53-0-src-app-jsx`, `subsystem-56-0-src-components`, `subsystem-6-0-src-components`, `subsystem-7-0-src-components`, `subsystem-70-0-src-components`, `subsystem-88-0-src-components`, `subsystem-90-0-src-components`
- Depended On By: `subsystem-118-0-temp-extraction`, `subsystem-28-0-src-components`, `subsystem-30-0-src-components`, `subsystem-53-0-src-app-jsx`, `subsystem-72-0-temp-extraction`
- Responsibilities: Primary symbols: call_reference x26, function x3.; Internal relations: calls x35, contains x5.
- Evidence: src/components/NotificationPrompt.jsx:repeat, src/components/screens/TeamsScreen.jsx:handlePrintRoster(), src/components/screens/TeamsScreen.jsx:Representative

### clean.cjs [LOW]

- Kind: `ui`
- Summary: clean.cjs is a ui subsystem covering 5 paths and 25 symbols; strongest evidence: calls x39, imports x12.
- Paths: `clean.cjs`, `test-batting.cjs`, `test-players-real.cjs`, `test-players3.cjs`, `test-players4.cjs`
- Key Symbols: `@supabase/supabase-js`, `require`, `config`, `createClient`, `limit`
- Depends On: `none`
- Depended On By: `none`
- Responsibilities: Primary symbols: call_reference x17, import_reference x8.; Internal relations: calls x39, imports x12.; Exposes 2 interface candidates.
- Evidence: clean.cjs:../../context/CricketContext, clean.cjs:../../lib/api, clean.cjs:../ui/Badge

### src/components [MEDIUM]

- Kind: `ui`
- Summary: src/components is a ui subsystem covering 3 paths and 27 symbols; strongest evidence: calls x80, imports x12.
- Paths: `src/components/screens/MatchSetupScreen.jsx`, `src/components/screens/PlayerRegistrationScreen.jsx`, `temp_extraction/src/components/screens/PlayerRegistrationScreen.jsx`
- Key Symbols: `handleImageUpload()`, `setAvatar`, `_2px_10px_rgba`, `BATTING_STYLES.map`, `BOWLING_STYLES.map`
- Depends On: `subsystem-1-0-src-context`, `subsystem-12-0-src-components`, `subsystem-121-0-src-components`, `subsystem-13-0-src-engine`, `subsystem-148-0-temp-extraction`, `subsystem-162-0-src-components`, `subsystem-163-0-src-components`, `subsystem-164-0-src-components`, `subsystem-179-0-temp-extraction`, `subsystem-29-0-src-components`, `subsystem-53-0-src-app-jsx`, `subsystem-65-0-src-components`, `subsystem-7-0-src-components`, `subsystem-87-0-temp-extraction`, `subsystem-88-0-src-components`, `subsystem-98-0-temp-extraction`
- Depended On By: `subsystem-131-0-temp-extraction`, `subsystem-3-0-src-components`, `subsystem-53-0-src-app-jsx`
- Responsibilities: Primary symbols: call_reference x26, function x1.; Internal relations: calls x41, contains x1.
- Evidence: src/components/screens/MatchSetupScreen.jsx:_2px_10px_rgba, src/components/screens/PlayerRegistrationScreen.jsx:handleImageUpload(), src/components/screens/PlayerRegistrationScreen.jsx:AGE_CATEGORIES.filter

### src/components [MEDIUM]

- Kind: `ui`
- Summary: src/components is a ui subsystem covering 1 paths and 25 symbols; strongest evidence: calls x26, imports x15.
- Paths: `src/components/ui/CloudinaryAvatar.jsx`
- Key Symbols: `CloudinaryAvatar()`, `@cloudinary/react`, `@cloudinary/url-gen`, `@cloudinary/url-gen/actions/resize`, `@cloudinary/url-gen/qualifiers/gravity`
- Depends On: `subsystem-53-0-src-app-jsx`, `subsystem-56-0-src-components`
- Depended On By: `subsystem-11-0-src-components`, `subsystem-19-0-src-components`, `subsystem-32-0-src-components`, `subsystem-44-0-src-components`, `subsystem-48-0-src-components`, `subsystem-51-0-src-components`, `subsystem-6-0-src-components`, `subsystem-79-0-src-components`, `subsystem-9-0-src-components`, `subsystem-94-0-src-components`
- Responsibilities: Primary symbols: call_reference x20, import_reference x4.; Internal relations: calls x25, imports x4.
- Evidence: src/components/ui/CloudinaryAvatar.jsx:CloudinaryAvatar(), src/components/ui/CloudinaryAvatar.jsx:@cloudinary/react, src/components/ui/CloudinaryAvatar.jsx:@cloudinary/url-gen

### src/engine [MEDIUM]

- Kind: `ui`
- Summary: src/engine is a ui subsystem covering 1 paths and 23 symbols; strongest evidence: calls x169, imports x5.
- Paths: `src/engine/validationSchemas.js`
- Key Symbols: `string`, `zod`, `Ball`, `FREE_HIT_ALLOWED_DISMISSALS.includes`, `ctx.addIssue`
- Depends On: `subsystem-16-0-src-components`, `subsystem-178-0-src-engine`
- Depended On By: `subsystem-11-0-src-components`, `subsystem-14-0-src-services`, `subsystem-148-0-temp-extraction`, `subsystem-2-0-src-components`, `subsystem-23-0-src-engine`, `subsystem-50-0-temp-extraction`
- Responsibilities: Primary symbols: call_reference x22, import_reference x1.; Internal relations: calls x81, imports x1.
- Evidence: src/engine/validationSchemas.js:zod, src/engine/validationSchemas.js:Ball, src/engine/validationSchemas.js:FREE_HIT_ALLOWED_DISMISSALS.includes

### src/services [MEDIUM]

- Kind: `service`
- Summary: src/services is a service subsystem covering 1 paths and 23 symbols; strongest evidence: calls x74, contains x14.
- Paths: `src/services/SyncService.js`
- Key Symbols: `SyncService.pushDelivery()`, `SyncService`, `SyncService.processQueue()`, `SyncService.deleteDelivery()`, `SyncService.executeOrQueue()`
- Depends On: `subsystem-0-0-src-lib`, `subsystem-13-0-src-engine`, `subsystem-130-0-src-lib`, `subsystem-16-0-src-components`, `subsystem-23-0-src-engine`, `subsystem-27-0-apply-bug5-sql-js`, `subsystem-41-0-src-lib`, `subsystem-82-0-delete-season-js`
- Depended On By: `subsystem-1-0-src-context`, `subsystem-2-0-src-components`
- Responsibilities: Primary symbols: method x13, call_reference x9.; Internal relations: calls x34, contains x14.; Exposes 12 interface candidates.
- Evidence: src/services/SyncService.js:SyncService, src/services/SyncService.js:SyncService.callback(), src/services/SyncService.js:SyncService.deleteDelivery()

### src/components [MEDIUM]

- Kind: `ui`
- Summary: src/components is a ui subsystem covering 1 paths and 20 symbols; strongest evidence: calls x66, imports x8.
- Paths: `src/components/screens/TournamentsScreen.jsx`
- Key Symbols: `handleEditTournament()`, `toggleTournament()`, `getTournamentMatches()`, `toggleMatch()`, `TournamentsScreen`
- Depends On: `subsystem-0-0-src-lib`, `subsystem-1-0-src-context`, `subsystem-107-0-src-components`, `subsystem-121-0-src-components`, `subsystem-129-0-src-lib`, `subsystem-169-0-src-components`, `subsystem-173-0-src-components`, `subsystem-2-0-src-components`, `subsystem-22-0-src-components`, `subsystem-29-0-src-components`, `subsystem-3-0-src-components`, `subsystem-45-0-src-components`, `subsystem-53-0-src-app-jsx`, `subsystem-54-0-src-components`, `subsystem-6-0-src-components`, `subsystem-61-0-src-components`, `subsystem-7-0-src-components`, `subsystem-79-0-src-components`, `subsystem-81-0-src-components`, `subsystem-88-0-src-components`
- Depended On By: `subsystem-19-0-src-components`, `subsystem-53-0-src-app-jsx`, `subsystem-60-0-temp-extraction`
- Responsibilities: Primary symbols: call_reference x14, function x6.; Internal relations: calls x28, contains x6.; Exposes 2 interface candidates.
- Evidence: src/components/screens/TournamentsScreen.jsx:PointsTableUI(), src/components/screens/TournamentsScreen.jsx:TournamentMatchRow(), src/components/screens/TournamentsScreen.jsx:getTournamentMatches()

### src/components [MEDIUM]

- Kind: `ui`
- Summary: src/components is a ui subsystem covering 1 paths and 20 symbols; strongest evidence: calls x98, imports x2.
- Paths: `src/components/selection/selectionData.js`
- Key Symbols: `normalizeSelectionPlayer()`, `getAvailableDistricts()`, `includes`, `toFixed`, `Math.floor`
- Depends On: `subsystem-176-0-src-components`
- Depended On By: `subsystem-0-0-src-lib`, `subsystem-13-0-src-engine`, `subsystem-14-0-src-services`, `subsystem-148-0-temp-extraction`, `subsystem-18-0-src-lib`, `subsystem-23-0-src-engine`, `subsystem-37-0-src-engine`, `subsystem-50-0-temp-extraction`, `subsystem-57-0-src-components`, `subsystem-67-0-src-lib`, `subsystem-71-0-src-components`
- Responsibilities: Primary symbols: call_reference x18, function x2.; Internal relations: calls x43, contains x2.
- Evidence: src/components/selection/selectionData.js:getAvailableDistricts(), src/components/selection/selectionData.js:normalizeSelectionPlayer(), src/components/selection/selectionData.js:Array.from

### supabase [MEDIUM]

- Kind: `adapter`
- Summary: supabase is a adapter subsystem covering 1 paths and 20 symbols; strongest evidence: calls x25, imports x3.
- Paths: `supabase/functions/send-push/index.ts`
- Key Symbols: `https://deno.land/std@0.168.0/http/server.ts`, `https://esm.sh/@supabase/supabase-js@2`, `https://esm.sh/web-push@3.6.7`, `JSON.stringify`, `Promise.all`
- Depends On: `none`
- Depended On By: `none`
- Responsibilities: Primary symbols: call_reference x17, import_reference x3.; Internal relations: calls x25, imports x3.; Exposes 4 interface candidates.
- Evidence: supabase/functions/send-push/index.ts:https://deno.land/std@0.168.0/http/server.ts, supabase/functions/send-push/index.ts:https://esm.sh/@supabase/supabase-js@2, supabase/functions/send-push/index.ts:https://esm.sh/web-push@3.6.7

### src/lib [MEDIUM]

- Kind: `module`
- Summary: src/lib is a module subsystem covering 1 paths and 21 symbols; strongest evidence: calls x48, contains x2.
- Paths: `src/lib/standings.js`
- Key Symbols: `fetchAndCalculate()`, `useStandings()`, `matches.map`, `async`, `deliveries`
- Depends On: `subsystem-0-0-src-lib`, `subsystem-16-0-src-components`, `subsystem-176-0-src-components`, `subsystem-23-0-src-engine`, `subsystem-37-0-src-engine`, `subsystem-67-0-src-lib`, `subsystem-82-0-delete-season-js`
- Depended On By: `subsystem-129-0-src-lib`
- Responsibilities: Primary symbols: call_reference x19, function x2.; Internal relations: calls x33, contains x1.; Exposes 1 interface candidate.
- Evidence: src/lib/standings.js:fetchAndCalculate(), src/lib/standings.js:useStandings(), src/lib/standings.js:async

### src/components [MEDIUM]

- Kind: `ui`
- Summary: src/components is a ui subsystem covering 1 paths and 19 symbols; strongest evidence: calls x101, imports x8.
- Paths: `src/components/selection/SelectionWorkspace.jsx`
- Key Symbols: `handleSaveTeam()`, `confetti`, `setIsSaveModalOpen`, `setShowSavedNotification`, `isSelected()`
- Depends On: `subsystem-1-0-src-context`, `subsystem-103-0-src-components`, `subsystem-104-0-src-components`, `subsystem-107-0-src-components`, `subsystem-114-0-src-components`, `subsystem-12-0-src-components`, `subsystem-124-0-src-components`, `subsystem-15-0-src-components`, `subsystem-150-0-src-components`, `subsystem-177-0-src-components`, `subsystem-2-0-src-components`, `subsystem-21-0-src-components`, `subsystem-22-0-src-components`, `subsystem-24-0-src-components`, `subsystem-29-0-src-components`, `subsystem-30-0-src-components`, `subsystem-32-0-src-components`, `subsystem-33-0-src-components`, `subsystem-36-0-src-components`, `subsystem-51-0-src-components`, `subsystem-53-0-src-app-jsx`, `subsystem-6-0-src-components`, `subsystem-7-0-src-components`, `subsystem-88-0-src-components`, `subsystem-91-0-src-components`
- Depended On By: `subsystem-1-0-src-context`, `subsystem-53-0-src-app-jsx`
- Responsibilities: Primary symbols: call_reference x17, function x2.; Internal relations: calls x37, contains x2.
- Evidence: src/components/selection/SelectionWorkspace.jsx:handleSaveTeam(), src/components/selection/SelectionWorkspace.jsx:isSelected(), src/components/selection/SelectionWorkspace.jsx:CATEGORY_OPTIONS.map

### temp_extraction [MEDIUM]

- Kind: `module`
- Summary: temp_extraction is a module subsystem covering 1 paths and 19 symbols; strongest evidence: calls x46, contains x1.
- Paths: `temp_extraction/src/data/mockData.js`
- Key Symbols: `mkAreas()`, `ANNOUNCEMENTS`, `Analysis`, `Balls`, `Bat`
- Depends On: `subsystem-0-0-src-lib`, `subsystem-37-0-src-engine`
- Depended On By: `none`
- Responsibilities: Primary symbols: call_reference x18, function x1.; Internal relations: calls x43, contains x1.
- Evidence: temp_extraction/src/data/mockData.js:mkAreas(), temp_extraction/src/data/mockData.js:ANNOUNCEMENTS, temp_extraction/src/data/mockData.js:Analysis

### src/components [MEDIUM]

- Kind: `ui`
- Summary: src/components is a ui subsystem covering 1 paths and 20 symbols; strongest evidence: calls x92, contains x4.
- Paths: `src/components/screens/TeamRegistrationTab.jsx`
- Key Symbols: `handleCreateTeam()`, `handleTogglePlayer()`, `loadTeamPlayers()`, `eq`, `from`
- Depends On: `subsystem-121-0-src-components`, `subsystem-160-0-src-components`, `subsystem-172-0-src-components`, `subsystem-28-0-src-components`, `subsystem-39-0-src-components`, `subsystem-6-0-src-components`, `subsystem-7-0-src-components`, `subsystem-91-0-src-components`
- Depended On By: `subsystem-1-0-src-context`, `subsystem-19-0-src-components`, `subsystem-24-0-src-components`, `subsystem-5-0-src-context`, `subsystem-6-0-src-components`, `subsystem-91-0-src-components`
- Responsibilities: Primary symbols: call_reference x17, function x3.; Internal relations: calls x28.; Exposes 1 interface candidate.
- Evidence: src/components/screens/TeamRegistrationTab.jsx:handleCreateTeam(), src/components/screens/TeamRegistrationTab.jsx:handleTogglePlayer(), src/components/screens/TeamRegistrationTab.jsx:loadTeamPlayers()

### src/components [MEDIUM]

- Kind: `ui`
- Summary: src/components is a ui subsystem covering 1 paths and 18 symbols; strongest evidence: calls x88, imports x5.
- Paths: `src/components/screens/HomeScreen.jsx`
- Key Symbols: `setActiveTab`, `matches.filter`, `setActiveMatchId`, `liveMatches.map`, `HomeScreen`
- Depends On: `subsystem-1-0-src-context`, `subsystem-129-0-src-lib`, `subsystem-150-0-src-components`, `subsystem-155-0-src-components`, `subsystem-156-0-src-components`, `subsystem-157-0-src-components`, `subsystem-2-0-src-components`, `subsystem-29-0-src-components`, `subsystem-35-0-src-components`, `subsystem-53-0-src-app-jsx`, `subsystem-88-0-src-components`
- Depended On By: `subsystem-15-0-src-components`, `subsystem-19-0-src-components`, `subsystem-2-0-src-components`, `subsystem-39-0-src-components`, `subsystem-42-0-temp-extraction`, `subsystem-53-0-src-app-jsx`, `subsystem-54-0-src-components`, `subsystem-6-0-src-components`, `subsystem-72-0-temp-extraction`, `subsystem-9-0-src-components`
- Responsibilities: Primary symbols: call_reference x18.; Internal relations: calls x27.; Exposes 2 interface candidates.
- Evidence: src/components/screens/HomeScreen.jsx:All, src/components/screens/HomeScreen.jsx:Board, src/components/screens/HomeScreen.jsx:Center

### src/engine [MEDIUM]

- Kind: `module`
- Summary: src/engine is a module subsystem covering 1 paths and 18 symbols; strongest evidence: calls x59, contains x11.
- Paths: `src/engine/cricketStateMachine.js`
- Key Symbols: `processDelivery()`, `calculateProjectedScore()`, `formatOvers()`, `Number`, `calculateCRR()`
- Depends On: `subsystem-13-0-src-engine`, `subsystem-16-0-src-components`
- Depended On By: `subsystem-0-0-src-lib`, `subsystem-14-0-src-services`, `subsystem-147-0-temp-extraction`, `subsystem-148-0-temp-extraction`, `subsystem-18-0-src-lib`, `subsystem-37-0-src-engine`, `subsystem-49-0-src-engine`, `subsystem-50-0-temp-extraction`
- Responsibilities: Primary symbols: call_reference x13, function x5.; Internal relations: calls x28, contains x5.
- Evidence: src/engine/cricketStateMachine.js:calculateCRR(), src/engine/cricketStateMachine.js:calculateProjectedScore(), src/engine/cricketStateMachine.js:canBowlerBowlNextOver()

### src/components [MEDIUM]

- Kind: `ui`
- Summary: src/components is a ui subsystem covering 1 paths and 17 symbols; strongest evidence: calls x73, imports x6.
- Paths: `src/components/screens/TeamRegistrationTab.jsx`
- Key Symbols: `fetchDropdowns()`, `name.toLowerCase`, `n.includes`, `setActiveTeamId`, `setNewTeamCategory`
- Depends On: `subsystem-0-0-src-lib`, `subsystem-1-0-src-context`, `subsystem-104-0-src-components`, `subsystem-106-0-src-components`, `subsystem-121-0-src-components`, `subsystem-130-0-src-lib`, `subsystem-150-0-src-components`, `subsystem-160-0-src-components`, `subsystem-162-0-src-components`, `subsystem-171-0-src-components`, `subsystem-21-0-src-components`, `subsystem-28-0-src-components`, `subsystem-29-0-src-components`, `subsystem-31-0-src-components`, `subsystem-32-0-src-components`, `subsystem-53-0-src-app-jsx`, `subsystem-88-0-src-components`
- Depended On By: `subsystem-143-0-temp-extraction`, `subsystem-19-0-src-components`, `subsystem-3-0-src-components`, `subsystem-60-0-temp-extraction`, `subsystem-7-0-src-components`, `subsystem-97-0-temp-extraction`
- Responsibilities: Primary symbols: call_reference x16, function x1.; Internal relations: calls x25, contains x1.
- Evidence: src/components/screens/TeamRegistrationTab.jsx:fetchDropdowns(), src/components/screens/TeamRegistrationTab.jsx:TeamRegistrationTab, src/components/screens/TeamRegistrationTab.jsx:ac.find

### src/main.jsx [MEDIUM]

- Kind: `ui`
- Summary: src/main.jsx is a ui subsystem covering 2 paths and 16 symbols; strongest evidence: calls x23, contains x10.
- Paths: `src/main.jsx`, `temp_extraction/src/main.jsx`
- Key Symbols: `ErrorBoundary`, `ErrorBoundary.render()`, `ErrorBoundary.componentDidCatch()`, `react-dom/client`, `ReactDOM.createRoot`
- Depends On: `subsystem-121-0-src-components`, `subsystem-131-0-temp-extraction`, `subsystem-29-0-src-components`, `subsystem-53-0-src-app-jsx`, `subsystem-66-0-src-components`
- Depended On By: `none`
- Responsibilities: Primary symbols: call_reference x9, method x4.; Internal relations: calls x18, contains x10.; Exposes 18 interface candidates.
- Evidence: src/main.jsx:ErrorBoundary, src/main.jsx:ErrorBoundary.componentDidCatch(), src/main.jsx:ErrorBoundary.render()

### temp_extraction [MEDIUM]

- Kind: `ui`
- Summary: temp_extraction is a ui subsystem covering 1 paths and 17 symbols; strongest evidence: calls x91, imports x5.
- Paths: `temp_extraction/src/components/screens/PlayersScreen.jsx`
- Key Symbols: `getMobileAge()`, `toggleMobileAge()`, `toggleMobileDistrict()`, `normalizeCat()`, `ageGroups.map`
- Depends On: `subsystem-104-0-src-components`, `subsystem-106-0-src-components`, `subsystem-145-0-temp-extraction`, `subsystem-150-0-src-components`, `subsystem-153-0-src-components`, `subsystem-159-0-src-components`, `subsystem-161-0-src-components`, `subsystem-162-0-src-components`, `subsystem-169-0-src-components`, `subsystem-179-0-temp-extraction`, `subsystem-2-0-src-components`, `subsystem-29-0-src-components`, `subsystem-3-0-src-components`, `subsystem-30-0-src-components`, `subsystem-32-0-src-components`, `subsystem-33-0-src-components`, `subsystem-36-0-src-components`, `subsystem-53-0-src-app-jsx`, `subsystem-59-0-temp-extraction`, `subsystem-65-0-src-components`, `subsystem-77-0-src-components`, `subsystem-87-0-temp-extraction`, `subsystem-88-0-src-components`, `subsystem-98-0-temp-extraction`
- Depended On By: `subsystem-131-0-temp-extraction`
- Responsibilities: Primary symbols: call_reference x13, function x4.; Internal relations: calls x23, contains x4.
- Evidence: temp_extraction/src/components/screens/PlayersScreen.jsx:getMobileAge(), temp_extraction/src/components/screens/PlayersScreen.jsx:normalizeCat(), temp_extraction/src/components/screens/PlayersScreen.jsx:toggleMobileAge()

### apply-bug5-sql.js [MEDIUM]

- Kind: `adapter`
- Summary: apply-bug5-sql.js is a adapter subsystem covering 1 paths and 16 symbols; strongest evidence: calls x67, imports x15.
- Paths: `apply-bug5-sql.js`
- Key Symbols: `console.log`, `@supabase/supabase-js`, `console.error`, `createClient`, `dotenv`
- Depends On: `none`
- Depended On By: `subsystem-0-0-src-lib`, `subsystem-100-0-test-players3-js`, `subsystem-101-0-test-stats-js`, `subsystem-109-0-scratch-check-enum-js`, `subsystem-120-0-test-players-js`, `subsystem-130-0-src-lib`, `subsystem-14-0-src-services`, `subsystem-38-0-src-sw-js`, `subsystem-41-0-src-lib`, `subsystem-82-0-delete-season-js`, `subsystem-99-0-test-players2-js`
- Responsibilities: Primary symbols: call_reference x12, import_reference x4.; Internal relations: calls x15, imports x4.; Exposes 17 interface candidates.
- Evidence: apply-bug5-sql.js:@supabase/supabase-js, apply-bug5-sql.js:dotenv, apply-bug5-sql.js:fs

### src/components [MEDIUM]

- Kind: `ui`
- Summary: src/components is a ui subsystem covering 1 paths and 16 symbols; strongest evidence: calls x51, imports x5.
- Paths: `src/components/NotificationPrompt.jsx`
- Key Symbols: `handleSubscribe()`, `checkSubscription()`, `urlBase64ToUint8Array()`, `supabase.from`, `insert`
- Depends On: `subsystem-102-0-src-components`, `subsystem-121-0-src-components`, `subsystem-130-0-src-lib`, `subsystem-153-0-src-components`, `subsystem-29-0-src-components`, `subsystem-53-0-src-app-jsx`, `subsystem-88-0-src-components`, `subsystem-9-0-src-components`
- Depended On By: `subsystem-21-0-src-components`, `subsystem-24-0-src-components`, `subsystem-5-0-src-context`, `subsystem-53-0-src-app-jsx`
- Responsibilities: Primary symbols: call_reference x13, function x3.; Internal relations: calls x20, contains x3.
- Evidence: src/components/NotificationPrompt.jsx:checkSubscription(), src/components/NotificationPrompt.jsx:handleSubscribe(), src/components/NotificationPrompt.jsx:urlBase64ToUint8Array()

### src/components [MEDIUM]

- Kind: `ui`
- Summary: src/components is a ui subsystem covering 1 paths and 15 symbols; strongest evidence: calls x153, imports x55.
- Paths: `src/components/BottomNav.jsx`
- Key Symbols: `lucide-react`, `navigateTo`, `useEffect`, `tabs.map`, `setDrawerOpen`
- Depends On: `subsystem-1-0-src-context`, `subsystem-53-0-src-app-jsx`, `subsystem-88-0-src-components`
- Depended On By: `subsystem-1-0-src-context`, `subsystem-11-0-src-components`, `subsystem-111-0-src-components`, `subsystem-113-0-src-components`, `subsystem-114-0-src-components`, `subsystem-115-0-src-components`, `subsystem-116-0-src-components`, `subsystem-119-0-temp-extraction`, `subsystem-125-0-temp-extraction`, `subsystem-132-0-temp-extraction`, `subsystem-133-0-temp-extraction`, `subsystem-135-0-temp-extraction`, `subsystem-136-0-temp-extraction`, `subsystem-137-0-temp-extraction`, `subsystem-138-0-temp-extraction`, `subsystem-139-0-temp-extraction`, `subsystem-140-0-temp-extraction`, `subsystem-141-0-temp-extraction`, `subsystem-142-0-temp-extraction`, `subsystem-144-0-temp-extraction`, `subsystem-146-0-temp-extraction`, `subsystem-15-0-src-components`, `subsystem-19-0-src-components`, `subsystem-2-0-src-components`, `subsystem-22-0-src-components`, `subsystem-24-0-src-components`, `subsystem-25-0-src-main-jsx`, `subsystem-26-0-temp-extraction`, `subsystem-28-0-src-components`, `subsystem-3-0-src-components`, `subsystem-31-0-src-components`, `subsystem-32-0-src-components`, `subsystem-33-0-src-components`, `subsystem-34-0-src-components`, `subsystem-36-0-src-components`, `subsystem-39-0-src-components`, `subsystem-40-0-src-components`, `subsystem-42-0-temp-extraction`, `subsystem-45-0-src-components`, `subsystem-47-0-src-components`, `subsystem-53-0-src-app-jsx`, `subsystem-54-0-src-components`, `subsystem-55-0-src-components`, `subsystem-56-0-src-components`, `subsystem-57-0-src-components`, `subsystem-58-0-src-components`, `subsystem-6-0-src-components`, `subsystem-60-0-temp-extraction`, `subsystem-62-0-src-components`, `subsystem-63-0-src-components`, `subsystem-69-0-src-components`, `subsystem-70-0-src-components`, `subsystem-71-0-src-components`, `subsystem-72-0-temp-extraction`, `subsystem-74-0-src-components`, `subsystem-75-0-src-components`, `subsystem-76-0-src-components`, `subsystem-78-0-src-components`, `subsystem-79-0-src-components`, `subsystem-8-0-src-components`, `subsystem-84-0-src-components`, `subsystem-85-0-src-components`, `subsystem-87-0-temp-extraction`, `subsystem-9-0-src-components`, `subsystem-93-0-src-components`, `subsystem-94-0-src-components`, `subsystem-95-0-src-components`, `subsystem-96-0-temp-extraction`, `subsystem-97-0-temp-extraction`, `subsystem-98-0-temp-extraction`
- Responsibilities: Primary symbols: call_reference x12, function x2.; Internal relations: calls x18, contains x2.; Exposes 2 interface candidates.
- Evidence: src/components/BottomNav.jsx:handleClick(), src/components/BottomNav.jsx:handleScroll(), src/components/BottomNav.jsx:lucide-react

### src/components [MEDIUM]

- Kind: `ui`
- Summary: src/components is a ui subsystem covering 1 paths and 15 symbols; strongest evidence: calls x84, imports x6.
- Paths: `src/components/screens/SelectionScreen.jsx`
- Key Symbols: `role.includes`, `selectedRole.toLowerCase`, `setSelectedRole`, `ROLE_FILTERS.map`, `SelectionScreen`
- Depends On: `subsystem-1-0-src-context`, `subsystem-104-0-src-components`, `subsystem-106-0-src-components`, `subsystem-126-0-src-components`, `subsystem-150-0-src-components`, `subsystem-161-0-src-components`, `subsystem-162-0-src-components`, `subsystem-167-0-src-components`, `subsystem-180-0-src-components`, `subsystem-32-0-src-components`, `subsystem-33-0-src-components`, `subsystem-53-0-src-app-jsx`, `subsystem-54-0-src-components`, `subsystem-86-0-src-components`, `subsystem-88-0-src-components`, `subsystem-89-0-src-components`, `subsystem-9-0-src-components`
- Depended On By: `subsystem-118-0-temp-extraction`, `subsystem-136-0-temp-extraction`, `subsystem-19-0-src-components`, `subsystem-26-0-temp-extraction`, `subsystem-3-0-src-components`, `subsystem-97-0-temp-extraction`
- Responsibilities: Primary symbols: call_reference x15.; Internal relations: calls x23.
- Evidence: src/components/screens/SelectionScreen.jsx:ROLE_FILTERS.map, src/components/screens/SelectionScreen.jsx:SelectionScreen, src/components/screens/SelectionScreen.jsx:Squad

### src/components [MEDIUM]

- Kind: `ui`
- Summary: src/components is a ui subsystem covering 1 paths and 15 symbols; strongest evidence: calls x38, imports x4.
- Paths: `src/components/screens/SelectorAssignmentModal.jsx`
- Key Symbols: `loadData()`, `handleSave()`, `toggleLead()`, `toggleProcess()`, `setAssignments`
- Depends On: `subsystem-0-0-src-lib`, `subsystem-121-0-src-components`, `subsystem-123-0-src-components`, `subsystem-169-0-src-components`, `subsystem-170-0-src-components`, `subsystem-29-0-src-components`, `subsystem-53-0-src-app-jsx`, `subsystem-7-0-src-components`, `subsystem-73-0-src-components`, `subsystem-88-0-src-components`
- Depended On By: `subsystem-24-0-src-components`, `subsystem-5-0-src-context`, `subsystem-7-0-src-components`
- Responsibilities: Primary symbols: call_reference x11, function x4.; Internal relations: calls x16, contains x4.; Exposes 3 interface candidates.
- Evidence: src/components/screens/SelectorAssignmentModal.jsx:handleSave(), src/components/screens/SelectorAssignmentModal.jsx:loadData(), src/components/screens/SelectorAssignmentModal.jsx:toggleLead()

### src/components [MEDIUM]

- Kind: `ui`
- Summary: src/components is a ui subsystem covering 1 paths and 14 symbols; strongest evidence: calls x105, contains x10.
- Paths: `src/components/screens/PlayersScreen.jsx`
- Key Symbols: `handlePlayerClick()`, `searchQuery.toLowerCase`, `CATEGORIES.map`, `PlayersScreen`, `cat.replace`
- Depends On: `subsystem-1-0-src-context`, `subsystem-104-0-src-components`, `subsystem-12-0-src-components`, `subsystem-124-0-src-components`, `subsystem-150-0-src-components`, `subsystem-153-0-src-components`, `subsystem-156-0-src-components`, `subsystem-162-0-src-components`, `subsystem-165-0-src-components`, `subsystem-29-0-src-components`, `subsystem-3-0-src-components`, `subsystem-53-0-src-app-jsx`, `subsystem-88-0-src-components`
- Depended On By: `subsystem-118-0-temp-extraction`, `subsystem-143-0-temp-extraction`, `subsystem-19-0-src-components`, `subsystem-24-0-src-components`, `subsystem-26-0-temp-extraction`, `subsystem-3-0-src-components`, `subsystem-30-0-src-components`, `subsystem-33-0-src-components`, `subsystem-53-0-src-app-jsx`, `subsystem-77-0-src-components`, `subsystem-9-0-src-components`, `subsystem-97-0-temp-extraction`
- Responsibilities: Primary symbols: call_reference x12, function x2.; Internal relations: calls x14, contains x2.; Exposes 2 interface candidates.
- Evidence: src/components/screens/PlayersScreen.jsx:PlayerListItem(), src/components/screens/PlayersScreen.jsx:handlePlayerClick(), src/components/screens/PlayersScreen.jsx:CATEGORIES.map

### src/components [MEDIUM]

- Kind: `ui`
- Summary: src/components is a ui subsystem covering 1 paths and 14 symbols; strongest evidence: calls x85, imports x3.
- Paths: `src/components/screens/ScoutingHubScreen.jsx`
- Key Symbols: `setSelectedDistrict`, `shortlistedIds.includes`, `districts.map`, `calc`, `Bar`
- Depends On: `subsystem-1-0-src-context`, `subsystem-104-0-src-components`, `subsystem-150-0-src-components`, `subsystem-161-0-src-components`, `subsystem-29-0-src-components`, `subsystem-32-0-src-components`, `subsystem-53-0-src-app-jsx`, `subsystem-88-0-src-components`
- Depended On By: `subsystem-1-0-src-context`, `subsystem-118-0-temp-extraction`, `subsystem-143-0-temp-extraction`, `subsystem-19-0-src-components`, `subsystem-26-0-temp-extraction`, `subsystem-30-0-src-components`, `subsystem-53-0-src-app-jsx`, `subsystem-55-0-src-components`, `subsystem-77-0-src-components`, `subsystem-97-0-temp-extraction`
- Responsibilities: Primary symbols: call_reference x14.; Internal relations: calls x18.
- Evidence: src/components/screens/ScoutingHubScreen.jsx:Bar, src/components/screens/ScoutingHubScreen.jsx:List, src/components/screens/ScoutingHubScreen.jsx:Only

### src/components [MEDIUM]

- Kind: `ui`
- Summary: src/components is a ui subsystem covering 1 paths and 14 symbols; strongest evidence: calls x55, imports x3.
- Paths: `src/components/screens/SeasonManagementTab.jsx`
- Key Symbols: `handleCreateSeason()`, `loadSeasons()`, `handleSetActive()`, `seasons.map`, `api.getSeasons`
- Depends On: `subsystem-0-0-src-lib`, `subsystem-121-0-src-components`, `subsystem-29-0-src-components`, `subsystem-39-0-src-components`, `subsystem-53-0-src-app-jsx`, `subsystem-7-0-src-components`, `subsystem-73-0-src-components`, `subsystem-88-0-src-components`
- Depended On By: `subsystem-45-0-src-components`, `subsystem-63-0-src-components`, `subsystem-7-0-src-components`
- Responsibilities: Primary symbols: call_reference x11, function x3.; Internal relations: calls x23, contains x3.; Exposes 3 interface candidates.
- Evidence: src/components/screens/SeasonManagementTab.jsx:handleCreateSeason(), src/components/screens/SeasonManagementTab.jsx:handleSetActive(), src/components/screens/SeasonManagementTab.jsx:loadSeasons()

### src/components [MEDIUM]

- Kind: `ui`
- Summary: src/components is a ui subsystem covering 2 paths and 12 symbols; strongest evidence: calls x53, contains x8.
- Paths: `src/components/CricketIllustrations.jsx`, `temp_extraction/src/components/CricketIllustrations.jsx`
- Key Symbols: `url`, `CricketBatsmanActionIllustration()`, `CricketScoutingRadarIllustration()`, `CricketStadiumHeroIllustration()`, `CricketTrophyBannerIllustration()`
- Depends On: `subsystem-151-0-src-components`, `subsystem-53-0-src-app-jsx`
- Depended On By: `subsystem-22-0-src-components`
- Responsibilities: Primary symbols: call_reference x8, function x4.; Internal relations: calls x50, contains x8.
- Evidence: src/components/CricketIllustrations.jsx:CricketBatsmanActionIllustration(), src/components/CricketIllustrations.jsx:CricketScoutingRadarIllustration(), src/components/CricketIllustrations.jsx:CricketStadiumHeroIllustration()

### src/components [MEDIUM]

- Kind: `ui`
- Summary: src/components is a ui subsystem covering 3 paths and 12 symbols; strongest evidence: calls x42, imports x4.
- Paths: `src/components/selection/PlayerDetail.jsx`, `src/components/ui/DataTable.jsx`, `temp_extraction/src/components/ui/DataTable.jsx`
- Key Symbols: `sort`, `handleSort()`, `DataTable`, `React.useMemo`, `aVal.toLowerCase`
- Depends On: `subsystem-29-0-src-components`, `subsystem-53-0-src-app-jsx`, `subsystem-88-0-src-components`
- Depended On By: `subsystem-19-0-src-components`, `subsystem-26-0-temp-extraction`, `subsystem-6-0-src-components`
- Responsibilities: Primary symbols: call_reference x11, function x1.; Internal relations: calls x32, contains x2.; Exposes 13 interface candidates.
- Evidence: src/components/selection/PlayerDetail.jsx:sort, src/components/ui/DataTable.jsx:handleSort(), src/components/ui/DataTable.jsx:DataTable

### src/engine [MEDIUM]

- Kind: `module`
- Summary: src/engine is a module subsystem covering 1 paths and 13 symbols; strongest evidence: calls x43, contains x7.
- Paths: `src/engine/derivedScorecard.js`
- Key Symbols: `deriveScorecardFromDeliveries()`, `formatDismissalText()`, `Object.values`, `initBatter()`, `initBowler()`
- Depends On: `subsystem-16-0-src-components`, `subsystem-23-0-src-engine`
- Depended On By: `subsystem-18-0-src-lib`, `subsystem-20-0-temp-extraction`, `subsystem-49-0-src-engine`, `subsystem-67-0-src-lib`
- Responsibilities: Primary symbols: call_reference x7, function x6.; Internal relations: calls x24, contains x6.
- Evidence: src/engine/derivedScorecard.js:deriveScorecardFromDeliveries(), src/engine/derivedScorecard.js:formatDismissalText(), src/engine/derivedScorecard.js:initBatter()

### src/sw.js [MEDIUM]

- Kind: `adapter`
- Summary: src/sw.js is a adapter subsystem covering 1 paths and 13 symbols; strongest evidence: calls x21.
- Paths: `src/sw.js`
- Key Symbols: `then`, `client.focus`, `clients.claim`, `clients.matchAll`, `clients.openWindow`
- Depends On: `subsystem-27-0-apply-bug5-sql-js`
- Depended On By: `subsystem-100-0-test-players3-js`
- Responsibilities: Primary symbols: call_reference x13.; Internal relations: calls x19.; Exposes 4 interface candidates.
- Evidence: src/sw.js:client.focus, src/sw.js:clients.claim, src/sw.js:clients.matchAll

### src/components [MEDIUM]

- Kind: `ui`
- Summary: src/components is a ui subsystem covering 1 paths and 12 symbols; strongest evidence: calls x52, imports x5.
- Paths: `src/components/screens/NewsScreen.jsx`
- Key Symbols: `Date`, `toLocaleDateString`, `setAnnouncements`, `NewsScreen`, `announcements.filter`
- Depends On: `subsystem-0-0-src-lib`, `subsystem-1-0-src-context`, `subsystem-121-0-src-components`, `subsystem-123-0-src-components`, `subsystem-22-0-src-components`, `subsystem-29-0-src-components`, `subsystem-3-0-src-components`, `subsystem-53-0-src-app-jsx`, `subsystem-6-0-src-components`, `subsystem-7-0-src-components`, `subsystem-88-0-src-components`
- Depended On By: `subsystem-1-0-src-context`, `subsystem-21-0-src-components`, `subsystem-34-0-src-components`, `subsystem-40-0-src-components`, `subsystem-5-0-src-context`, `subsystem-53-0-src-app-jsx`, `subsystem-72-0-temp-extraction`, `subsystem-79-0-src-components`, `subsystem-8-0-src-components`
- Responsibilities: Primary symbols: call_reference x12.; Internal relations: calls x19.; Exposes 1 interface candidate.
- Evidence: src/components/screens/NewsScreen.jsx:Date, src/components/screens/NewsScreen.jsx:NewsScreen, src/components/screens/NewsScreen.jsx:announcements.filter

### src/components [MEDIUM]

- Kind: `ui`
- Summary: src/components is a ui subsystem covering 1 paths and 12 symbols; strongest evidence: calls x38, imports x4.
- Paths: `src/components/screens/RecycleBinTab.jsx`
- Key Symbols: `handleHardDelete()`, `handleRestore()`, `loadItems()`, `setItems`, `items.filter`
- Depends On: `subsystem-0-0-src-lib`, `subsystem-121-0-src-components`, `subsystem-29-0-src-components`, `subsystem-39-0-src-components`, `subsystem-53-0-src-app-jsx`, `subsystem-7-0-src-components`, `subsystem-73-0-src-components`, `subsystem-88-0-src-components`
- Depended On By: `subsystem-7-0-src-components`, `subsystem-79-0-src-components`
- Responsibilities: Primary symbols: call_reference x9, function x3.; Internal relations: calls x18, contains x3.; Exposes 4 interface candidates.
- Evidence: src/components/screens/RecycleBinTab.jsx:handleHardDelete(), src/components/screens/RecycleBinTab.jsx:handleRestore(), src/components/screens/RecycleBinTab.jsx:loadItems()

### src/lib [MEDIUM]

- Kind: `module`
- Summary: src/lib is a module subsystem covering 1 paths and 12 symbols; strongest evidence: calls x25, imports x3.
- Paths: `src/lib/db.js`
- Key Symbols: `getPendingActions`, `Date.now`, `clearAction`, `dexie`, `Dexie`
- Depends On: `subsystem-27-0-apply-bug5-sql-js`
- Depended On By: `subsystem-1-0-src-context`, `subsystem-101-0-test-stats-js`, `subsystem-14-0-src-services`
- Responsibilities: Primary symbols: call_reference x11, import_reference x1.; Internal relations: calls x19, imports x1.; Exposes 1 interface candidate.
- Evidence: src/lib/db.js:dexie, src/lib/db.js:Date.now, src/lib/db.js:Dexie

### temp_extraction [MEDIUM]

- Kind: `ui`
- Summary: temp_extraction is a ui subsystem covering 1 paths and 12 symbols; strongest evidence: calls x35, imports x6.
- Paths: `temp_extraction/src/components/screens/MatchesScreen.jsx`
- Key Symbols: `groups.map`, `map.entries`, `map.get`, `map.has`, `map.set`
- Depends On: `subsystem-103-0-src-components`, `subsystem-119-0-temp-extraction`, `subsystem-150-0-src-components`, `subsystem-173-0-src-components`, `subsystem-2-0-src-components`, `subsystem-22-0-src-components`, `subsystem-29-0-src-components`, `subsystem-3-0-src-components`, `subsystem-53-0-src-app-jsx`, `subsystem-54-0-src-components`, `subsystem-6-0-src-components`, `subsystem-87-0-temp-extraction`, `subsystem-88-0-src-components`, `subsystem-98-0-temp-extraction`
- Depended On By: `subsystem-131-0-temp-extraction`, `subsystem-60-0-temp-extraction`
- Responsibilities: Primary symbols: call_reference x12.; Internal relations: calls x12.
- Evidence: temp_extraction/src/components/screens/MatchesScreen.jsx:filtered.forEach, temp_extraction/src/components/screens/MatchesScreen.jsx:groups.map, temp_extraction/src/components/screens/MatchesScreen.jsx:haystack.includes

### fix_logo.py [MEDIUM]

- Kind: `module`
- Summary: fix_logo.py is a module subsystem covering 1 paths and 11 symbols; strongest evidence: calls x15, imports x1.
- Paths: `fix_logo.py`
- Key Symbols: `os`, `content.replace`, `content.split`, `f.read`, `f.write`
- Depends On: `none`
- Depended On By: `none`
- Responsibilities: Primary symbols: call_reference x10, import_reference x1.; Internal relations: calls x15, imports x1.
- Evidence: fix_logo.py:os, fix_logo.py:content.replace, fix_logo.py:content.split

### src/components [MEDIUM]

- Kind: `ui`
- Summary: src/components is a ui subsystem covering 1 paths and 11 symbols; strongest evidence: calls x20, imports x4.
- Paths: `src/components/selection/PlayerPool.jsx`
- Key Symbols: `compareIds.includes`, `onToggleCompare`, `Amber`, `Blue`, `PlayerPool`
- Depends On: `subsystem-12-0-src-components`, `subsystem-122-0-src-components`, `subsystem-159-0-src-components`, `subsystem-169-0-src-components`, `subsystem-52-0-src-hooks`, `subsystem-53-0-src-app-jsx`, `subsystem-88-0-src-components`, `subsystem-94-0-src-components`
- Depended On By: `subsystem-95-0-src-components`
- Responsibilities: Primary symbols: call_reference x11.; Internal relations: calls x11.
- Evidence: src/components/selection/PlayerPool.jsx:Amber, src/components/selection/PlayerPool.jsx:Blue, src/components/selection/PlayerPool.jsx:PlayerPool

### src/components [MEDIUM]

- Kind: `ui`
- Summary: src/components is a ui subsystem covering 1 paths and 11 symbols; strongest evidence: calls x43, contains x7.
- Paths: `src/components/ui/TournamentManagerModal.jsx`
- Key Symbols: `handleNextStep()`, `removeMatchRow()`, `updateMatchRow()`, `customMatches.map`, `setStep`
- Depends On: `subsystem-0-0-src-lib`, `subsystem-1-0-src-context`, `subsystem-123-0-src-components`, `subsystem-171-0-src-components`, `subsystem-181-0-src-components`, `subsystem-2-0-src-components`, `subsystem-29-0-src-components`, `subsystem-3-0-src-components`, `subsystem-34-0-src-components`, `subsystem-53-0-src-app-jsx`, `subsystem-6-0-src-components`, `subsystem-63-0-src-components`, `subsystem-65-0-src-components`, `subsystem-7-0-src-components`, `subsystem-88-0-src-components`
- Depended On By: `subsystem-15-0-src-components`, `subsystem-65-0-src-components`
- Responsibilities: Primary symbols: call_reference x8, function x3.; Internal relations: calls x19, contains x3.
- Evidence: src/components/ui/TournamentManagerModal.jsx:handleNextStep(), src/components/ui/TournamentManagerModal.jsx:removeMatchRow(), src/components/ui/TournamentManagerModal.jsx:updateMatchRow()

### temp_extraction [MEDIUM]

- Kind: `ui`
- Summary: temp_extraction is a ui subsystem covering 2 paths and 10 symbols; strongest evidence: calls x9, imports x9.
- Paths: `temp_extraction/vite.config.ts`, `vite.config.ts`
- Key Symbols: `@tailwindcss/vite`, `@vitejs/plugin-react`, `path`, `vite`, `defineConfig`
- Depends On: `none`
- Depended On By: `none`
- Responsibilities: Primary symbols: import_reference x5, call_reference x5.; Internal relations: calls x9, imports x9.
- Evidence: temp_extraction/vite.config.ts:@tailwindcss/vite, temp_extraction/vite.config.ts:@vitejs/plugin-react, temp_extraction/vite.config.ts:path

### src/components [MEDIUM]

- Kind: `ui`
- Summary: src/components is a ui subsystem covering 1 paths and 10 symbols; strongest evidence: calls x61, contains x6.
- Paths: `src/components/DrawerMenu.jsx`
- Key Symbols: `handleLogout()`, `rgba`, `handleNav()`, `visible.map`, `ALL_NAV.filter`
- Depends On: `subsystem-1-0-src-context`, `subsystem-152-0-src-components`, `subsystem-29-0-src-components`, `subsystem-53-0-src-app-jsx`, `subsystem-86-0-src-components`, `subsystem-88-0-src-components`
- Depended On By: `subsystem-132-0-temp-extraction`, `subsystem-133-0-temp-extraction`, `subsystem-144-0-temp-extraction`, `subsystem-53-0-src-app-jsx`, `subsystem-78-0-src-components`, `subsystem-96-0-temp-extraction`
- Responsibilities: Primary symbols: call_reference x8, function x2.; Internal relations: calls x14, contains x2.
- Evidence: src/components/DrawerMenu.jsx:handleLogout(), src/components/DrawerMenu.jsx:handleNav(), src/components/DrawerMenu.jsx:ALL_NAV.filter

### src/components [MEDIUM]

- Kind: `ui`
- Summary: src/components is a ui subsystem covering 1 paths and 10 symbols; strongest evidence: calls x20, imports x2.
- Paths: `src/components/selection/TeamSelectionDashboard.jsx`
- Key Symbols: `PlayerRow()`, `TeamSelectionDashboard`, `allPlayers.filter`, `consideredPlayers.map`, `onUpdateTeam`
- Depends On: `subsystem-12-0-src-components`, `subsystem-169-0-src-components`, `subsystem-2-0-src-components`, `subsystem-51-0-src-components`, `subsystem-53-0-src-app-jsx`, `subsystem-88-0-src-components`, `subsystem-94-0-src-components`
- Depended On By: `none`
- Responsibilities: Primary symbols: call_reference x9, function x1.; Internal relations: calls x13, contains x1.
- Evidence: src/components/selection/TeamSelectionDashboard.jsx:PlayerRow(), src/components/selection/TeamSelectionDashboard.jsx:TeamSelectionDashboard, src/components/selection/TeamSelectionDashboard.jsx:allPlayers.filter

### src/engine [MEDIUM]

- Kind: `module`
- Summary: src/engine is a module subsystem covering 1 paths and 10 symbols; strongest evidence: calls x19, contains x2.
- Paths: `src/engine/matchHighlights.js`
- Key Symbols: `calculateMatchHighlights()`, `Object.entries`, `allBatters.forEach`, `allBatters.push`, `allBatters.sort`
- Depends On: `subsystem-23-0-src-engine`, `subsystem-37-0-src-engine`
- Depended On By: `subsystem-50-0-temp-extraction`
- Responsibilities: Primary symbols: call_reference x9, function x1.; Internal relations: calls x12, contains x1.
- Evidence: src/engine/matchHighlights.js:calculateMatchHighlights(), src/engine/matchHighlights.js:Object.entries, src/engine/matchHighlights.js:allBatters.forEach

### temp_extraction [MEDIUM]

- Kind: `module`
- Summary: temp_extraction is a module subsystem covering 1 paths and 10 symbols; strongest evidence: calls x20, contains x4.
- Paths: `temp_extraction/src/engine/matchSummaryEngine.js`
- Key Symbols: `parseScore()`, `generateMatchSummary()`, `generateSocialCaption()`, `i.test`, `lines.join`
- Depends On: `subsystem-13-0-src-engine`, `subsystem-16-0-src-components`, `subsystem-23-0-src-engine`, `subsystem-49-0-src-engine`, `subsystem-67-0-src-lib`
- Depended On By: `subsystem-138-0-temp-extraction`, `subsystem-140-0-temp-extraction`, `subsystem-146-0-temp-extraction`
- Responsibilities: Primary symbols: call_reference x7, function x3.; Internal relations: calls x14, contains x3.
- Evidence: temp_extraction/src/engine/matchSummaryEngine.js:generateMatchSummary(), temp_extraction/src/engine/matchSummaryEngine.js:generateSocialCaption(), temp_extraction/src/engine/matchSummaryEngine.js:parseScore()

### src/components [MEDIUM]

- Kind: `ui`
- Summary: src/components is a ui subsystem covering 1 paths and 9 symbols; strongest evidence: calls x29, imports x3.
- Paths: `src/components/selection/SelectedTeam.jsx`
- Key Symbols: `selectedPlayers.map`, `DisciplineTile()`, `PlayerGroup()`, `Complete`, `Progress`
- Depends On: `subsystem-12-0-src-components`, `subsystem-150-0-src-components`, `subsystem-159-0-src-components`, `subsystem-169-0-src-components`, `subsystem-53-0-src-app-jsx`, `subsystem-7-0-src-components`, `subsystem-88-0-src-components`
- Depended On By: `subsystem-112-0-src-components`, `subsystem-19-0-src-components`, `subsystem-48-0-src-components`
- Responsibilities: Primary symbols: call_reference x7, function x2.; Internal relations: calls x14, contains x2.
- Evidence: src/components/selection/SelectedTeam.jsx:DisciplineTile(), src/components/selection/SelectedTeam.jsx:PlayerGroup(), src/components/selection/SelectedTeam.jsx:Complete

### src/hooks [MEDIUM]

- Kind: `ui`
- Summary: src/hooks is a ui subsystem covering 1 paths and 9 symbols; strongest evidence: calls x11, imports x7.
- Paths: `src/hooks/useHaptics.js`
- Key Symbols: `useHaptics()`, `react`, `actions`, `errors`, `events`
- Depends On: `none`
- Depended On By: `subsystem-129-0-src-lib`, `subsystem-2-0-src-components`, `subsystem-44-0-src-components`, `subsystem-71-0-src-components`, `subsystem-74-0-src-components`, `subsystem-79-0-src-components`
- Responsibilities: Primary symbols: call_reference x7, function x1.; Internal relations: calls x11, imports x1.
- Evidence: src/hooks/useHaptics.js:useHaptics(), src/hooks/useHaptics.js:react, src/hooks/useHaptics.js:actions

### src/App.jsx [MEDIUM]

- Kind: `ui`
- Summary: src/App.jsx is a ui subsystem covering 1 paths and 8 symbols; strongest evidence: imports x161, calls x69.
- Paths: `src/App.jsx`
- Key Symbols: `react`, `useCricket`, `motion/react`, `MainApp()`, `react-router-dom`
- Depends On: `subsystem-1-0-src-context`, `subsystem-11-0-src-components`, `subsystem-110-0-src-components`, `subsystem-111-0-src-components`, `subsystem-149-0-src-app-jsx`, `subsystem-15-0-src-components`, `subsystem-19-0-src-components`, `subsystem-2-0-src-components`, `subsystem-22-0-src-components`, `subsystem-28-0-src-components`, `subsystem-29-0-src-components`, `subsystem-3-0-src-components`, `subsystem-32-0-src-components`, `subsystem-33-0-src-components`, `subsystem-39-0-src-components`, `subsystem-47-0-src-components`, `subsystem-54-0-src-components`, `subsystem-56-0-src-components`, `subsystem-62-0-src-components`, `subsystem-69-0-src-components`, `subsystem-7-0-src-components`, `subsystem-70-0-src-components`, `subsystem-74-0-src-components`, `subsystem-76-0-src-components`, `subsystem-77-0-src-components`, `subsystem-78-0-src-components`, `subsystem-83-0-src-components`, `subsystem-84-0-src-components`, `subsystem-85-0-src-components`, `subsystem-9-0-src-components`, `subsystem-93-0-src-components`
- Depended On By: `subsystem-1-0-src-context`, `subsystem-11-0-src-components`, `subsystem-110-0-src-components`, `subsystem-111-0-src-components`, `subsystem-112-0-src-components`, `subsystem-113-0-src-components`, `subsystem-114-0-src-components`, `subsystem-115-0-src-components`, `subsystem-116-0-src-components`, `subsystem-117-0-src-components`, `subsystem-118-0-temp-extraction`, `subsystem-119-0-temp-extraction`, `subsystem-12-0-src-components`, `subsystem-131-0-temp-extraction`, `subsystem-132-0-temp-extraction`, `subsystem-133-0-temp-extraction`, `subsystem-134-0-temp-extraction`, `subsystem-135-0-temp-extraction`, `subsystem-136-0-temp-extraction`, `subsystem-137-0-temp-extraction`, `subsystem-138-0-temp-extraction`, `subsystem-139-0-temp-extraction`, `subsystem-140-0-temp-extraction`, `subsystem-141-0-temp-extraction`, `subsystem-142-0-temp-extraction`, `subsystem-143-0-temp-extraction`, `subsystem-144-0-temp-extraction`, `subsystem-145-0-temp-extraction`, `subsystem-146-0-temp-extraction`, `subsystem-15-0-src-components`, `subsystem-19-0-src-components`, `subsystem-2-0-src-components`, `subsystem-22-0-src-components`, `subsystem-24-0-src-components`, `subsystem-25-0-src-main-jsx`, `subsystem-26-0-temp-extraction`, `subsystem-28-0-src-components`, `subsystem-29-0-src-components`, `subsystem-3-0-src-components`, `subsystem-30-0-src-components`, `subsystem-31-0-src-components`, `subsystem-32-0-src-components`, `subsystem-33-0-src-components`, `subsystem-34-0-src-components`, `subsystem-35-0-src-components`, `subsystem-36-0-src-components`, `subsystem-39-0-src-components`, `subsystem-40-0-src-components`, `subsystem-42-0-temp-extraction`, `subsystem-44-0-src-components`, `subsystem-45-0-src-components`, `subsystem-47-0-src-components`, `subsystem-48-0-src-components`, `subsystem-51-0-src-components`, `subsystem-54-0-src-components`, `subsystem-55-0-src-components`, `subsystem-56-0-src-components`, `subsystem-57-0-src-components`, `subsystem-58-0-src-components`, `subsystem-59-0-temp-extraction`, `subsystem-6-0-src-components`, `subsystem-60-0-temp-extraction`, `subsystem-62-0-src-components`, `subsystem-63-0-src-components`, `subsystem-64-0-temp-extraction`, `subsystem-69-0-src-components`, `subsystem-7-0-src-components`, `subsystem-70-0-src-components`, `subsystem-71-0-src-components`, `subsystem-72-0-temp-extraction`, `subsystem-74-0-src-components`, `subsystem-75-0-src-components`, `subsystem-76-0-src-components`, `subsystem-77-0-src-components`, `subsystem-78-0-src-components`, `subsystem-79-0-src-components`, `subsystem-8-0-src-components`, `subsystem-83-0-src-components`, `subsystem-84-0-src-components`, `subsystem-85-0-src-components`, `subsystem-86-0-src-components`, `subsystem-87-0-temp-extraction`, `subsystem-9-0-src-components`, `subsystem-93-0-src-components`, `subsystem-94-0-src-components`, `subsystem-95-0-src-components`, `subsystem-96-0-temp-extraction`, `subsystem-97-0-temp-extraction`, `subsystem-98-0-temp-extraction`
- Responsibilities: Primary symbols: import_reference x3, call_reference x3.; Internal relations: calls x7, imports x3.; Exposes 9 interface candidates.
- Evidence: src/App.jsx:MainApp(), src/App.jsx:RootRedirect(), src/App.jsx:motion/react

### src/components [MEDIUM]

- Kind: `ui`
- Summary: src/components is a ui subsystem covering 1 paths and 8 symbols; strongest evidence: calls x41, imports x6.
- Paths: `src/components/screens/MatchesScreen.jsx`
- Key Symbols: `openMatch()`, `MatchesScreen`, `trim`, `upcomingMatches.map`, `completedMatches.map`
- Depends On: `subsystem-1-0-src-context`, `subsystem-103-0-src-components`, `subsystem-150-0-src-components`, `subsystem-22-0-src-components`, `subsystem-29-0-src-components`, `subsystem-3-0-src-components`, `subsystem-53-0-src-app-jsx`, `subsystem-6-0-src-components`, `subsystem-79-0-src-components`, `subsystem-86-0-src-components`, `subsystem-88-0-src-components`
- Depended On By: `subsystem-15-0-src-components`, `subsystem-30-0-src-components`, `subsystem-42-0-temp-extraction`, `subsystem-53-0-src-app-jsx`, `subsystem-60-0-temp-extraction`, `subsystem-72-0-temp-extraction`
- Responsibilities: Primary symbols: call_reference x7, function x1.; Internal relations: calls x15, contains x1.
- Evidence: src/components/screens/MatchesScreen.jsx:openMatch(), src/components/screens/MatchesScreen.jsx:MatchesScreen, src/components/screens/MatchesScreen.jsx:completedMatches.map

### src/components [MEDIUM]

- Kind: `ui`
- Summary: src/components is a ui subsystem covering 1 paths and 8 symbols; strongest evidence: calls x16, imports x2.
- Paths: `src/components/selection/FilterTiles.jsx`
- Key Symbols: `AGE_FILTER_OPTIONS.map`, `BATTING_STYLE_OPTIONS.map`, `ELIGIBILITY_OPTIONS.map`, `FilterTiles`, `Object.values`
- Depends On: `subsystem-29-0-src-components`, `subsystem-33-0-src-components`, `subsystem-53-0-src-app-jsx`, `subsystem-88-0-src-components`
- Depended On By: `none`
- Responsibilities: Primary symbols: call_reference x8.; Internal relations: calls x14.
- Evidence: src/components/selection/FilterTiles.jsx:AGE_FILTER_OPTIONS.map, src/components/selection/FilterTiles.jsx:BATTING_STYLE_OPTIONS.map, src/components/selection/FilterTiles.jsx:ELIGIBILITY_OPTIONS.map

### src/components [MEDIUM]

- Kind: `ui`
- Summary: src/components is a ui subsystem covering 1 paths and 7 symbols; strongest evidence: calls x22, imports x6.
- Paths: `src/components/screens/PlayerProfileScreen.jsx`
- Key Symbols: `encodeURIComponent`, `then`, `recharts`, `PlayerProfileScreen`, `ProfileTabs()`
- Depends On: `subsystem-0-0-src-lib`, `subsystem-1-0-src-context`, `subsystem-103-0-src-components`, `subsystem-161-0-src-components`, `subsystem-2-0-src-components`, `subsystem-29-0-src-components`, `subsystem-53-0-src-app-jsx`, `subsystem-61-0-src-components`, `subsystem-88-0-src-components`
- Depended On By: `subsystem-12-0-src-components`, `subsystem-2-0-src-components`, `subsystem-5-0-src-context`, `subsystem-53-0-src-app-jsx`, `subsystem-59-0-temp-extraction`, `subsystem-8-0-src-components`, `subsystem-9-0-src-components`
- Responsibilities: Primary symbols: call_reference x5, function x1.; Internal relations: calls x6, imports x1.; Exposes 1 interface candidate.
- Evidence: src/components/screens/PlayerProfileScreen.jsx:ProfileTabs(), src/components/screens/PlayerProfileScreen.jsx:recharts, src/components/screens/PlayerProfileScreen.jsx:PlayerProfileScreen

### src/components [MEDIUM]

- Kind: `ui`
- Summary: src/components is a ui subsystem covering 1 paths and 7 symbols; strongest evidence: calls x15, imports x3.
- Paths: `src/components/selection/CreateTeamModal.jsx`
- Key Symbols: `CreateTeamModal`, `Size`, `TEAM_CATEGORIES.find`, `TEAM_CATEGORIES.map`, `defaultSize.toString`
- Depends On: `subsystem-16-0-src-components`, `subsystem-164-0-src-components`, `subsystem-2-0-src-components`, `subsystem-29-0-src-components`, `subsystem-53-0-src-app-jsx`, `subsystem-65-0-src-components`, `subsystem-77-0-src-components`, `subsystem-88-0-src-components`
- Depended On By: `none`
- Responsibilities: Primary symbols: call_reference x7.; Internal relations: calls x8.
- Evidence: src/components/selection/CreateTeamModal.jsx:CreateTeamModal, src/components/selection/CreateTeamModal.jsx:Size, src/components/selection/CreateTeamModal.jsx:TEAM_CATEGORIES.find

### src/components [MEDIUM]

- Kind: `ui`
- Summary: src/components is a ui subsystem covering 1 paths and 7 symbols; strongest evidence: calls x28, imports x5.
- Paths: `src/components/ui/MatchMediaReport.jsx`
- Key Symbols: `copy()`, `MatchMediaReport`, `generateMatchSummary`, `generateSocialCaption`, `navigator.share`
- Depends On: `subsystem-102-0-src-components`, `subsystem-103-0-src-components`, `subsystem-121-0-src-components`, `subsystem-128-0-src-engine`, `subsystem-29-0-src-components`, `subsystem-53-0-src-app-jsx`, `subsystem-69-0-src-components`, `subsystem-88-0-src-components`
- Depended On By: `subsystem-146-0-temp-extraction`, `subsystem-62-0-src-components`, `subsystem-69-0-src-components`
- Responsibilities: Primary symbols: call_reference x6, function x1.; Internal relations: calls x11, contains x1.; Exposes 8 interface candidates.
- Evidence: src/components/ui/MatchMediaReport.jsx:copy(), src/components/ui/MatchMediaReport.jsx:MatchMediaReport, src/components/ui/MatchMediaReport.jsx:clipboard.writeText

### temp_extraction [MEDIUM]

- Kind: `ui`
- Summary: temp_extraction is a ui subsystem covering 1 paths and 7 symbols; strongest evidence: calls x17, imports x5.
- Paths: `temp_extraction/src/components/screens/PlayerProfileScreen.jsx`
- Key Symbols: `battingAvg.toFixed`, `Boundaries`, `Distinctions`, `Played`, `Selected`
- Depends On: `subsystem-161-0-src-components`, `subsystem-2-0-src-components`, `subsystem-53-0-src-app-jsx`, `subsystem-56-0-src-components`, `subsystem-76-0-src-components`, `subsystem-87-0-temp-extraction`, `subsystem-88-0-src-components`, `subsystem-98-0-temp-extraction`
- Depended On By: `subsystem-131-0-temp-extraction`, `subsystem-26-0-temp-extraction`
- Responsibilities: Primary symbols: call_reference x7.; Internal relations: calls x8.
- Evidence: temp_extraction/src/components/screens/PlayerProfileScreen.jsx:Boundaries, temp_extraction/src/components/screens/PlayerProfileScreen.jsx:Distinctions, temp_extraction/src/components/screens/PlayerProfileScreen.jsx:Played

### temp_extraction [MEDIUM]

- Kind: `ui`
- Summary: temp_extraction is a ui subsystem covering 1 paths and 7 symbols; strongest evidence: calls x41, imports x6.
- Paths: `temp_extraction/src/components/screens/TournamentsScreen.jsx`
- Key Symbols: `update()`, `CreateTournamentForm()`, `matches.forEach`, `ms.every`, `ms.some`
- Depends On: `subsystem-103-0-src-components`, `subsystem-119-0-temp-extraction`, `subsystem-15-0-src-components`, `subsystem-173-0-src-components`, `subsystem-2-0-src-components`, `subsystem-24-0-src-components`, `subsystem-29-0-src-components`, `subsystem-3-0-src-components`, `subsystem-42-0-temp-extraction`, `subsystem-53-0-src-app-jsx`, `subsystem-54-0-src-components`, `subsystem-87-0-temp-extraction`, `subsystem-88-0-src-components`, `subsystem-98-0-temp-extraction`
- Depended On By: `subsystem-131-0-temp-extraction`
- Responsibilities: Primary symbols: call_reference x5, function x2.; Internal relations: calls x14, contains x2.
- Evidence: temp_extraction/src/components/screens/TournamentsScreen.jsx:CreateTournamentForm(), temp_extraction/src/components/screens/TournamentsScreen.jsx:update(), temp_extraction/src/components/screens/TournamentsScreen.jsx:matches.forEach

### src/components [MEDIUM]

- Kind: `ui`
- Summary: src/components is a ui subsystem covering 1 paths and 8 symbols; strongest evidence: calls x39, contains x3.
- Paths: `src/components/screens/MatchDetailScreen.jsx`
- Key Symbols: `handleDelete()`, `handleAssignScorer()`, `goBack`, `location.reload`, `setIsAssigning`
- Depends On: `subsystem-105-0-src-components`, `subsystem-121-0-src-components`, `subsystem-7-0-src-components`
- Depended On By: `subsystem-15-0-src-components`, `subsystem-3-0-src-components`, `subsystem-56-0-src-components`, `subsystem-65-0-src-components`, `subsystem-69-0-src-components`, `subsystem-80-0-src-components`, `subsystem-81-0-src-components`, `subsystem-90-0-src-components`
- Responsibilities: Primary symbols: call_reference x6, function x2.; Internal relations: calls x11.; Exposes 2 interface candidates.
- Evidence: src/components/screens/MatchDetailScreen.jsx:handleAssignScorer(), src/components/screens/MatchDetailScreen.jsx:handleDelete(), src/components/screens/MatchDetailScreen.jsx:api.assignScorer

### src/components [MEDIUM]

- Kind: `ui`
- Summary: src/components is a ui subsystem covering 1 paths and 6 symbols; strongest evidence: calls x30, imports x8.
- Paths: `src/components/screens/MatchResultScreen.jsx`
- Key Symbols: `batting.map`, `MatchResultScreen`, `a.findIndex`, `allMatchPlayers.map`, `fetchReport`
- Depends On: `subsystem-0-0-src-lib`, `subsystem-1-0-src-context`, `subsystem-103-0-src-components`, `subsystem-121-0-src-components`, `subsystem-128-0-src-engine`, `subsystem-2-0-src-components`, `subsystem-29-0-src-components`, `subsystem-3-0-src-components`, `subsystem-53-0-src-app-jsx`, `subsystem-58-0-src-components`, `subsystem-69-0-src-components`, `subsystem-80-0-src-components`, `subsystem-88-0-src-components`
- Depended On By: `subsystem-140-0-temp-extraction`, `subsystem-142-0-temp-extraction`, `subsystem-53-0-src-app-jsx`, `subsystem-70-0-src-components`
- Responsibilities: Primary symbols: call_reference x6.; Internal relations: calls x9.; Exposes 1 interface candidate.
- Evidence: src/components/screens/MatchResultScreen.jsx:MatchResultScreen, src/components/screens/MatchResultScreen.jsx:a.findIndex, src/components/screens/MatchResultScreen.jsx:allMatchPlayers.map

### src/components [MEDIUM]

- Kind: `ui`
- Summary: src/components is a ui subsystem covering 1 paths and 6 symbols; strongest evidence: calls x27, contains x5.
- Paths: `src/components/ui/TeamManagerModal.jsx`
- Key Symbols: `fetchSeasons()`, `setFormData`, `handleChange()`, `TeamManagerModal`, `data.find`
- Depends On: `subsystem-121-0-src-components`, `subsystem-123-0-src-components`, `subsystem-29-0-src-components`, `subsystem-34-0-src-components`, `subsystem-53-0-src-app-jsx`, `subsystem-65-0-src-components`, `subsystem-88-0-src-components`
- Depended On By: `subsystem-181-0-src-components`, `subsystem-45-0-src-components`, `subsystem-65-0-src-components`
- Responsibilities: Primary symbols: call_reference x4, function x2.; Internal relations: calls x8, contains x2.
- Evidence: src/components/ui/TeamManagerModal.jsx:fetchSeasons(), src/components/ui/TeamManagerModal.jsx:handleChange(), src/components/ui/TeamManagerModal.jsx:TeamManagerModal

### temp_extraction [MEDIUM]

- Kind: `ui`
- Summary: temp_extraction is a ui subsystem covering 1 paths and 6 symbols; strongest evidence: calls x30, imports x5.
- Paths: `temp_extraction/src/components/screens/AdministrationScreen.jsx`
- Key Symbols: `setNewUser`, `INITIAL_DISTRICTS.map`, `INITIAL_FORMATS.map`, `INITIAL_VENUES.map`, `JDCA`
- Depends On: `subsystem-145-0-temp-extraction`, `subsystem-53-0-src-app-jsx`, `subsystem-65-0-src-components`, `subsystem-7-0-src-components`, `subsystem-87-0-temp-extraction`, `subsystem-88-0-src-components`, `subsystem-90-0-src-components`, `subsystem-98-0-temp-extraction`
- Depended On By: `subsystem-131-0-temp-extraction`, `subsystem-7-0-src-components`
- Responsibilities: Primary symbols: call_reference x6.; Internal relations: calls x14.
- Evidence: temp_extraction/src/components/screens/AdministrationScreen.jsx:INITIAL_DISTRICTS.map, temp_extraction/src/components/screens/AdministrationScreen.jsx:INITIAL_FORMATS.map, temp_extraction/src/components/screens/AdministrationScreen.jsx:INITIAL_VENUES.map

### src/components [MEDIUM]

- Kind: `ui`
- Summary: src/components is a ui subsystem covering 1 paths and 7 symbols; strongest evidence: calls x48, contains x5.
- Paths: `src/components/screens/PlayerRegistrationScreen.jsx`
- Key Symbols: `handleSubmit()`, `ROLES.map`, `PlayerRegistrationSchema.safeParse`, `errors.forEach`, `registerPlayer`
- Depends On: `subsystem-102-0-src-components`, `subsystem-108-0-src-components`, `subsystem-121-0-src-components`, `subsystem-123-0-src-components`, `subsystem-170-0-src-components`, `subsystem-174-0-src-components`, `subsystem-2-0-src-components`, `subsystem-45-0-src-components`, `subsystem-61-0-src-components`, `subsystem-63-0-src-components`, `subsystem-7-0-src-components`, `subsystem-73-0-src-components`, `subsystem-81-0-src-components`
- Depended On By: `subsystem-11-0-src-components`, `subsystem-136-0-temp-extraction`, `subsystem-26-0-temp-extraction`, `subsystem-45-0-src-components`, `subsystem-57-0-src-components`, `subsystem-63-0-src-components`, `subsystem-64-0-temp-extraction`
- Responsibilities: Primary symbols: call_reference x6, function x1.; Internal relations: calls x12.
- Evidence: src/components/screens/PlayerRegistrationScreen.jsx:handleSubmit(), src/components/screens/PlayerRegistrationScreen.jsx:PlayerRegistrationSchema.safeParse, src/components/screens/PlayerRegistrationScreen.jsx:ROLES.map

### src/components [MEDIUM]

- Kind: `ui`
- Summary: src/components is a ui subsystem covering 1 paths and 7 symbols; strongest evidence: calls x21, contains x1.
- Paths: `src/components/screens/ScoringScreen.jsx`
- Key Symbols: `setupRealtime()`, `console.log`, `on`, `subscribe`, `supabase.channel`
- Depends On: `subsystem-121-0-src-components`, `subsystem-2-0-src-components`
- Depended On By: `subsystem-2-0-src-components`, `subsystem-25-0-src-main-jsx`, `subsystem-5-0-src-context`
- Responsibilities: Primary symbols: call_reference x6, function x1.; Internal relations: calls x6.
- Evidence: src/components/screens/ScoringScreen.jsx:setupRealtime(), src/components/screens/ScoringScreen.jsx:console.log, src/components/screens/ScoringScreen.jsx:current.some

### src/lib [MEDIUM]

- Kind: `module`
- Summary: src/lib is a module subsystem covering 1 paths and 7 symbols; strongest evidence: calls x20, contains x1.
- Paths: `src/lib/api.js`
- Key Symbols: `computeInningsStats()`, `filter`, `match`, `replace`, `balls.forEach`
- Depends On: `subsystem-16-0-src-components`, `subsystem-176-0-src-components`, `subsystem-37-0-src-engine`
- Depended On By: `subsystem-0-0-src-lib`, `subsystem-18-0-src-lib`, `subsystem-50-0-temp-extraction`
- Responsibilities: Primary symbols: call_reference x6, function x1.; Internal relations: calls x4.; Exposes 7 interface candidates.
- Evidence: src/lib/api.js:computeInningsStats(), src/lib/api.js:balls.forEach, src/lib/api.js:deliveries.filter

### 05_team_types.sql [HIGH]

- Kind: `data_layer`
- Summary: 05_team_types.sql is a data_layer subsystem covering 1 paths and 5 symbols; strongest evidence: alters x3, queries x2.
- Paths: `05_team_types.sql`
- Key Symbols: `district`, `final`, `public.districts`, `public.selection_processes`, `public.teams`
- Depends On: `none`
- Depended On By: `none`
- Responsibilities: Primary symbols: sql_table x5.; Internal relations: alters x3, queries x2.; Exposes 6 interface candidates.
- Evidence: 05_team_types.sql:district, 05_team_types.sql:final, 05_team_types.sql:public.districts

### src/components [MEDIUM]

- Kind: `ui`
- Summary: src/components is a ui subsystem covering 1 paths and 5 symbols; strongest evidence: calls x30, imports x7.
- Paths: `src/components/screens/MatchDetailScreen.jsx`
- Key Symbols: `calculateMatchHighlights`, `matches.find`, `MatchDetailScreen`, `MatchTabs()`, `setSelectedScorer`
- Depends On: `subsystem-1-0-src-context`, `subsystem-103-0-src-components`, `subsystem-128-0-src-engine`, `subsystem-2-0-src-components`, `subsystem-29-0-src-components`, `subsystem-53-0-src-app-jsx`, `subsystem-58-0-src-components`, `subsystem-6-0-src-components`, `subsystem-61-0-src-components`, `subsystem-75-0-src-components`, `subsystem-88-0-src-components`
- Depended On By: `subsystem-138-0-temp-extraction`, `subsystem-140-0-temp-extraction`, `subsystem-146-0-temp-extraction`, `subsystem-3-0-src-components`, `subsystem-53-0-src-app-jsx`, `subsystem-58-0-src-components`, `subsystem-62-0-src-components`
- Responsibilities: Primary symbols: call_reference x4, function x1.; Internal relations: calls x4, contains x1.
- Evidence: src/components/screens/MatchDetailScreen.jsx:MatchTabs(), src/components/screens/MatchDetailScreen.jsx:MatchDetailScreen, src/components/screens/MatchDetailScreen.jsx:calculateMatchHighlights

### src/components [MEDIUM]

- Kind: `ui`
- Summary: src/components is a ui subsystem covering 1 paths and 5 symbols; strongest evidence: calls x22, imports x6.
- Paths: `src/components/screens/ScorecardScreen.jsx`
- Key Symbols: `find`, `window.print`, `ScorecardScreen`, `Sharma`, `bowling.map`
- Depends On: `subsystem-1-0-src-context`, `subsystem-126-0-src-components`, `subsystem-151-0-src-components`, `subsystem-29-0-src-components`, `subsystem-53-0-src-app-jsx`, `subsystem-62-0-src-components`, `subsystem-7-0-src-components`, `subsystem-86-0-src-components`, `subsystem-88-0-src-components`
- Depended On By: `subsystem-1-0-src-context`, `subsystem-142-0-temp-extraction`, `subsystem-146-0-temp-extraction`, `subsystem-2-0-src-components`, `subsystem-5-0-src-context`, `subsystem-53-0-src-app-jsx`, `subsystem-9-0-src-components`
- Responsibilities: Primary symbols: call_reference x5.; Internal relations: calls x5.
- Evidence: src/components/screens/ScorecardScreen.jsx:ScorecardScreen, src/components/screens/ScorecardScreen.jsx:Sharma, src/components/screens/ScorecardScreen.jsx:bowling.map

### src/components [MEDIUM]

- Kind: `ui`
- Summary: src/components is a ui subsystem covering 1 paths and 5 symbols; strongest evidence: calls x12, imports x5.
- Paths: `src/components/selection/SelectionFilters.jsx`
- Key Symbols: `updateFilter()`, `setFilters`, `FilterSection()`, `SelectionFilters`, `options.map`
- Depends On: `subsystem-104-0-src-components`, `subsystem-122-0-src-components`, `subsystem-16-0-src-components`, `subsystem-166-0-src-components`, `subsystem-29-0-src-components`, `subsystem-52-0-src-hooks`, `subsystem-53-0-src-app-jsx`
- Depended On By: `none`
- Responsibilities: Primary symbols: call_reference x3, function x2.; Internal relations: calls x6, contains x2.
- Evidence: src/components/selection/SelectionFilters.jsx:FilterSection(), src/components/selection/SelectionFilters.jsx:updateFilter(), src/components/selection/SelectionFilters.jsx:SelectionFilters

### temp_extraction [MEDIUM]

- Kind: `ui`
- Summary: temp_extraction is a ui subsystem covering 1 paths and 5 symbols; strongest evidence: calls x30, imports x5.
- Paths: `temp_extraction/src/components/screens/HomeScreen.jsx`
- Key Symbols: `announcements.slice`, `getHours`, `quickActions.map`, `recentMatches.map`, `userEmail.split`
- Depends On: `subsystem-145-0-temp-extraction`, `subsystem-2-0-src-components`, `subsystem-22-0-src-components`, `subsystem-29-0-src-components`, `subsystem-3-0-src-components`, `subsystem-39-0-src-components`, `subsystem-53-0-src-app-jsx`, `subsystem-54-0-src-components`, `subsystem-6-0-src-components`, `subsystem-87-0-temp-extraction`, `subsystem-9-0-src-components`, `subsystem-98-0-temp-extraction`
- Depended On By: `subsystem-131-0-temp-extraction`
- Responsibilities: Primary symbols: call_reference x5.; Internal relations: calls x5.
- Evidence: temp_extraction/src/components/screens/HomeScreen.jsx:announcements.slice, temp_extraction/src/components/screens/HomeScreen.jsx:getHours, temp_extraction/src/components/screens/HomeScreen.jsx:quickActions.map

### src/components [MEDIUM]

- Kind: `ui`
- Summary: src/components is a ui subsystem covering 1 paths and 6 symbols; strongest evidence: calls x25, contains x2.
- Paths: `src/components/screens/AuthScreen.jsx`
- Key Symbols: `handleLogin()`, `setIsLoading`, `haptics.success`, `setErrorMsg`, `auth.signInWithPassword`
- Depends On: `subsystem-121-0-src-components`, `subsystem-122-0-src-components`, `subsystem-125-0-temp-extraction`, `subsystem-7-0-src-components`
- Depended On By: `subsystem-136-0-temp-extraction`, `subsystem-2-0-src-components`, `subsystem-31-0-src-components`, `subsystem-34-0-src-components`, `subsystem-40-0-src-components`, `subsystem-65-0-src-components`, `subsystem-74-0-src-components`, `subsystem-8-0-src-components`
- Responsibilities: Primary symbols: call_reference x5, function x1.; Internal relations: calls x10.
- Evidence: src/components/screens/AuthScreen.jsx:handleLogin(), src/components/screens/AuthScreen.jsx:auth.signInWithPassword, src/components/screens/AuthScreen.jsx:haptics.error

### src/components [MEDIUM]

- Kind: `ui`
- Summary: src/components is a ui subsystem covering 1 paths and 4 symbols; strongest evidence: calls x13, imports x8.
- Paths: `src/components/screens/AuthScreen.jsx`
- Key Symbols: `AuthScreen`, `setEmailInput`, `Image`, `setPasswordInput`
- Depends On: `subsystem-1-0-src-context`, `subsystem-111-0-src-components`, `subsystem-122-0-src-components`, `subsystem-130-0-src-lib`, `subsystem-29-0-src-components`, `subsystem-52-0-src-hooks`, `subsystem-53-0-src-app-jsx`, `subsystem-73-0-src-components`, `subsystem-83-0-src-components`, `subsystem-88-0-src-components`
- Depended On By: `subsystem-136-0-temp-extraction`, `subsystem-53-0-src-app-jsx`
- Responsibilities: Primary symbols: call_reference x4.; Internal relations: calls x4.
- Evidence: src/components/screens/AuthScreen.jsx:AuthScreen, src/components/screens/AuthScreen.jsx:Image, src/components/screens/AuthScreen.jsx:setEmailInput

### src/components [MEDIUM]

- Kind: `ui`
- Summary: src/components is a ui subsystem covering 1 paths and 4 symbols; strongest evidence: calls x10, imports x4.
- Paths: `src/components/screens/JdcaManagementTab.jsx`
- Key Symbols: `registeredUsers.filter`, `JdcaManagementTab`, `scorers.map`, `selectors.map`
- Depends On: `subsystem-1-0-src-context`, `subsystem-29-0-src-components`, `subsystem-53-0-src-app-jsx`, `subsystem-6-0-src-components`
- Depended On By: `subsystem-3-0-src-components`, `subsystem-69-0-src-components`, `subsystem-7-0-src-components`
- Responsibilities: Primary symbols: call_reference x4.; Internal relations: calls x5.
- Evidence: src/components/screens/JdcaManagementTab.jsx:JdcaManagementTab, src/components/screens/JdcaManagementTab.jsx:registeredUsers.filter, src/components/screens/JdcaManagementTab.jsx:scorers.map

### src/components [MEDIUM]

- Kind: `ui`
- Summary: src/components is a ui subsystem covering 1 paths and 4 symbols; strongest evidence: calls x18, imports x5.
- Paths: `src/components/screens/PlayerComparisonModal.jsx`
- Key Symbols: `setCompareModalOpen`, `setComparePlayer2`, `PlayerComparisonModal`, `metrics.map`
- Depends On: `subsystem-1-0-src-context`, `subsystem-103-0-src-components`, `subsystem-104-0-src-components`, `subsystem-2-0-src-components`, `subsystem-29-0-src-components`, `subsystem-53-0-src-app-jsx`
- Depended On By: `subsystem-141-0-temp-extraction`, `subsystem-180-0-src-components`, `subsystem-53-0-src-app-jsx`, `subsystem-59-0-temp-extraction`
- Responsibilities: Primary symbols: call_reference x4.; Internal relations: calls x6.
- Evidence: src/components/screens/PlayerComparisonModal.jsx:PlayerComparisonModal, src/components/screens/PlayerComparisonModal.jsx:metrics.map, src/components/screens/PlayerComparisonModal.jsx:setCompareModalOpen

### src/components [MEDIUM]

- Kind: `ui`
- Summary: src/components is a ui subsystem covering 1 paths and 4 symbols; strongest evidence: calls x42, imports x3.
- Paths: `src/components/screens/SelectorsScreen.jsx`
- Key Symbols: `setSelectedCategory`, `selectedCategory.replace`, `SelectorsScreen`, `Students`
- Depends On: `subsystem-1-0-src-context`, `subsystem-104-0-src-components`, `subsystem-150-0-src-components`, `subsystem-153-0-src-components`, `subsystem-161-0-src-components`, `subsystem-167-0-src-components`, `subsystem-2-0-src-components`, `subsystem-32-0-src-components`, `subsystem-33-0-src-components`, `subsystem-53-0-src-app-jsx`, `subsystem-88-0-src-components`
- Depended On By: `subsystem-118-0-temp-extraction`, `subsystem-143-0-temp-extraction`, `subsystem-26-0-temp-extraction`, `subsystem-53-0-src-app-jsx`, `subsystem-57-0-src-components`
- Responsibilities: Primary symbols: call_reference x4.; Internal relations: calls x4.
- Evidence: src/components/screens/SelectorsScreen.jsx:SelectorsScreen, src/components/screens/SelectorsScreen.jsx:Students, src/components/screens/SelectorsScreen.jsx:selectedCategory.replace

### src/components [MEDIUM]

- Kind: `ui`
- Summary: src/components is a ui subsystem covering 1 paths and 4 symbols; strongest evidence: calls x17, imports x5.
- Paths: `src/components/Sidebar.jsx`
- Key Symbols: `activeId()`, `NAV_ITEMS.filter`, `Sidebar`, `_0_0_2px_rgba`
- Depends On: `subsystem-1-0-src-context`, `subsystem-29-0-src-components`, `subsystem-47-0-src-components`, `subsystem-53-0-src-app-jsx`, `subsystem-6-0-src-components`, `subsystem-86-0-src-components`, `subsystem-88-0-src-components`
- Depended On By: `subsystem-144-0-temp-extraction`, `subsystem-53-0-src-app-jsx`
- Responsibilities: Primary symbols: call_reference x3, function x1.; Internal relations: calls x3, contains x1.
- Evidence: src/components/Sidebar.jsx:activeId(), src/components/Sidebar.jsx:NAV_ITEMS.filter, src/components/Sidebar.jsx:Sidebar

### src/components [MEDIUM]

- Kind: `ui`
- Summary: src/components is a ui subsystem covering 1 paths and 4 symbols; strongest evidence: calls x9, imports x8.
- Paths: `src/components/ui/MatchCard.jsx`
- Key Symbols: `MatchCard()`, `onClick`, `teamAName.substring`, `teamBName.substring`
- Depends On: `subsystem-12-0-src-components`, `subsystem-122-0-src-components`, `subsystem-29-0-src-components`, `subsystem-39-0-src-components`, `subsystem-40-0-src-components`, `subsystem-52-0-src-hooks`, `subsystem-53-0-src-app-jsx`, `subsystem-6-0-src-components`
- Depended On By: `subsystem-15-0-src-components`, `subsystem-2-0-src-components`, `subsystem-54-0-src-components`
- Responsibilities: Primary symbols: call_reference x3, function x1.; Internal relations: calls x3, contains x1.; Exposes 1 interface candidate.
- Evidence: src/components/ui/MatchCard.jsx:MatchCard(), src/components/ui/MatchCard.jsx:onClick, src/components/ui/MatchCard.jsx:teamAName.substring

### src/components [MEDIUM]

- Kind: `ui`
- Summary: src/components is a ui subsystem covering 1 paths and 5 symbols; strongest evidence: calls x13, contains x1.
- Paths: `src/components/screens/MatchResultScreen.jsx`
- Key Symbols: `handleAssignMotm()`, `api.getMatchScorecard`, `setMatchData`, `setSelectedMotm`, `api.assignManOfTheMatch`
- Depends On: `subsystem-121-0-src-components`, `subsystem-61-0-src-components`, `subsystem-7-0-src-components`
- Depended On By: `subsystem-1-0-src-context`, `subsystem-62-0-src-components`
- Responsibilities: Primary symbols: call_reference x4, function x1.; Internal relations: calls x4.; Exposes 2 interface candidates.
- Evidence: src/components/screens/MatchResultScreen.jsx:handleAssignMotm(), src/components/screens/MatchResultScreen.jsx:api.assignManOfTheMatch, src/components/screens/MatchResultScreen.jsx:api.getMatchScorecard

### src/components [MEDIUM]

- Kind: `ui`
- Summary: src/components is a ui subsystem covering 1 paths and 5 symbols; strongest evidence: calls x14, contains x1.
- Paths: `src/components/screens/TournamentsScreen.jsx`
- Key Symbols: `handleDeleteTournament()`, `api.createDetailedMatches`, `api.createTournament`, `api.updateTournament`, `api.deleteTournament`
- Depends On: `subsystem-121-0-src-components`, `subsystem-169-0-src-components`, `subsystem-61-0-src-components`, `subsystem-7-0-src-components`
- Depended On By: `subsystem-15-0-src-components`, `subsystem-65-0-src-components`
- Responsibilities: Primary symbols: call_reference x4, function x1.; Internal relations: calls x1.; Exposes 4 interface candidates.
- Evidence: src/components/screens/TournamentsScreen.jsx:handleDeleteTournament(), src/components/screens/TournamentsScreen.jsx:api.createDetailedMatches, src/components/screens/TournamentsScreen.jsx:api.createTournament

### delete_season.js [MEDIUM]

- Kind: `module`
- Summary: delete_season.js is a module subsystem covering 1 paths and 3 symbols; strongest evidence: calls x125, imports x2.
- Paths: `delete_season.js`
- Key Symbols: `from`, `eq`, `delete`
- Depends On: `subsystem-27-0-apply-bug5-sql-js`
- Depended On By: `subsystem-0-0-src-lib`, `subsystem-101-0-test-stats-js`, `subsystem-120-0-test-players-js`, `subsystem-14-0-src-services`, `subsystem-18-0-src-lib`, `subsystem-99-0-test-players2-js`
- Responsibilities: Primary symbols: call_reference x3.; Internal relations: calls x3.
- Evidence: delete_season.js:delete, delete_season.js:eq, delete_season.js:from

### src/components [MEDIUM]

- Kind: `ui`
- Summary: src/components is a ui subsystem covering 1 paths and 3 symbols; strongest evidence: calls x7, imports x5.
- Paths: `src/components/ProtectedRoute.jsx`
- Key Symbols: `roleCanAccess()`, `ProtectedRoute`, `allowed.includes`
- Depends On: `subsystem-1-0-src-context`, `subsystem-53-0-src-app-jsx`
- Depended On By: `subsystem-134-0-temp-extraction`, `subsystem-53-0-src-app-jsx`, `subsystem-74-0-src-components`
- Responsibilities: Primary symbols: call_reference x2, function x1.; Internal relations: calls x4, contains x1.; Exposes 4 interface candidates.
- Evidence: src/components/ProtectedRoute.jsx:roleCanAccess(), src/components/ProtectedRoute.jsx:ProtectedRoute, src/components/ProtectedRoute.jsx:allowed.includes

### src/components [MEDIUM]

- Kind: `ui`
- Summary: src/components is a ui subsystem covering 1 paths and 3 symbols; strongest evidence: calls x12, imports x7.
- Paths: `src/components/screens/InningsBreakScreen.jsx`
- Key Symbols: `handleStartSecondInnings()`, `Innings`, `InningsBreakScreen`
- Depends On: `subsystem-1-0-src-context`, `subsystem-126-0-src-components`, `subsystem-157-0-src-components`, `subsystem-158-0-src-components`, `subsystem-29-0-src-components`, `subsystem-53-0-src-app-jsx`, `subsystem-6-0-src-components`, `subsystem-86-0-src-components`
- Depended On By: `subsystem-137-0-temp-extraction`, `subsystem-53-0-src-app-jsx`
- Responsibilities: Primary symbols: call_reference x2, function x1.; Internal relations: calls x2, contains x1.
- Evidence: src/components/screens/InningsBreakScreen.jsx:handleStartSecondInnings(), src/components/screens/InningsBreakScreen.jsx:Innings, src/components/screens/InningsBreakScreen.jsx:InningsBreakScreen

### src/components [MEDIUM]

- Kind: `ui`
- Summary: src/components is a ui subsystem covering 1 paths and 3 symbols; strongest evidence: calls x9, imports x5.
- Paths: `src/components/screens/MatchOverviewScreen.jsx`
- Key Symbols: `MatchOverviewScreen`, `balls`, `officials.map`
- Depends On: `subsystem-1-0-src-context`, `subsystem-126-0-src-components`, `subsystem-29-0-src-components`, `subsystem-53-0-src-app-jsx`, `subsystem-86-0-src-components`
- Depended On By: `subsystem-139-0-temp-extraction`, `subsystem-53-0-src-app-jsx`
- Responsibilities: Primary symbols: call_reference x3.; Internal relations: calls x3.
- Evidence: src/components/screens/MatchOverviewScreen.jsx:MatchOverviewScreen, src/components/screens/MatchOverviewScreen.jsx:balls, src/components/screens/MatchOverviewScreen.jsx:officials.map

### src/components [HIGH]

- Kind: `ui`
- Summary: src/components is a ui subsystem covering 1 paths and 3 symbols; strongest evidence: imports x9, contains x6.
- Paths: `src/components/ui/Badge.jsx`
- Key Symbols: `Badge()`, `MatchStatusBadge()`, `RoleBadge()`
- Depends On: `subsystem-53-0-src-app-jsx`
- Depended On By: `subsystem-145-0-temp-extraction`, `subsystem-30-0-src-components`, `subsystem-47-0-src-components`, `subsystem-54-0-src-components`, `subsystem-7-0-src-components`, `subsystem-70-0-src-components`, `subsystem-78-0-src-components`, `subsystem-84-0-src-components`, `subsystem-85-0-src-components`
- Responsibilities: Primary symbols: function x3.; Internal relations: contains x3.
- Evidence: src/components/ui/Badge.jsx:Badge(), src/components/ui/Badge.jsx:MatchStatusBadge(), src/components/ui/Badge.jsx:RoleBadge()

### temp_extraction [MEDIUM]

- Kind: `ui`
- Summary: temp_extraction is a ui subsystem covering 1 paths and 3 symbols; strongest evidence: imports x12, contains x3.
- Paths: `temp_extraction/src/components/ui/PageHeader.jsx`
- Key Symbols: `PageHeader()`, `SectionLabel()`, `TabBar()`
- Depends On: `subsystem-103-0-src-components`, `subsystem-29-0-src-components`, `subsystem-53-0-src-app-jsx`
- Depended On By: `subsystem-11-0-src-components`, `subsystem-118-0-temp-extraction`, `subsystem-137-0-temp-extraction`, `subsystem-139-0-temp-extraction`, `subsystem-142-0-temp-extraction`, `subsystem-26-0-temp-extraction`, `subsystem-42-0-temp-extraction`, `subsystem-59-0-temp-extraction`, `subsystem-60-0-temp-extraction`, `subsystem-64-0-temp-extraction`, `subsystem-72-0-temp-extraction`
- Responsibilities: Primary symbols: function x3.; Internal relations: contains x3.
- Evidence: temp_extraction/src/components/ui/PageHeader.jsx:PageHeader(), temp_extraction/src/components/ui/PageHeader.jsx:SectionLabel(), temp_extraction/src/components/ui/PageHeader.jsx:TabBar()

### src/components [MEDIUM]

- Kind: `ui`
- Summary: src/components is a ui subsystem covering 1 paths and 4 symbols; strongest evidence: calls x438, contains x1.
- Paths: `src/components/BottomNav.jsx`
- Key Symbols: `useState`, `includes`, `getNavItems()`, `allItems.filter`
- Depends On: `none`
- Depended On By: `subsystem-1-0-src-context`, `subsystem-11-0-src-components`, `subsystem-111-0-src-components`, `subsystem-118-0-temp-extraction`, `subsystem-119-0-temp-extraction`, `subsystem-132-0-temp-extraction`, `subsystem-136-0-temp-extraction`, `subsystem-140-0-temp-extraction`, `subsystem-142-0-temp-extraction`, `subsystem-143-0-temp-extraction`, `subsystem-144-0-temp-extraction`, `subsystem-146-0-temp-extraction`, `subsystem-15-0-src-components`, `subsystem-19-0-src-components`, `subsystem-2-0-src-components`, `subsystem-22-0-src-components`, `subsystem-24-0-src-components`, `subsystem-26-0-temp-extraction`, `subsystem-28-0-src-components`, `subsystem-29-0-src-components`, `subsystem-3-0-src-components`, `subsystem-30-0-src-components`, `subsystem-31-0-src-components`, `subsystem-32-0-src-components`, `subsystem-33-0-src-components`, `subsystem-34-0-src-components`, `subsystem-36-0-src-components`, `subsystem-39-0-src-components`, `subsystem-40-0-src-components`, `subsystem-42-0-temp-extraction`, `subsystem-44-0-src-components`, `subsystem-45-0-src-components`, `subsystem-47-0-src-components`, `subsystem-48-0-src-components`, `subsystem-51-0-src-components`, `subsystem-54-0-src-components`, `subsystem-55-0-src-components`, `subsystem-56-0-src-components`, `subsystem-57-0-src-components`, `subsystem-58-0-src-components`, `subsystem-59-0-temp-extraction`, `subsystem-6-0-src-components`, `subsystem-60-0-temp-extraction`, `subsystem-62-0-src-components`, `subsystem-63-0-src-components`, `subsystem-64-0-temp-extraction`, `subsystem-69-0-src-components`, `subsystem-7-0-src-components`, `subsystem-70-0-src-components`, `subsystem-74-0-src-components`, `subsystem-77-0-src-components`, `subsystem-78-0-src-components`, `subsystem-8-0-src-components`, `subsystem-9-0-src-components`, `subsystem-94-0-src-components`, `subsystem-95-0-src-components`, `subsystem-96-0-temp-extraction`, `subsystem-97-0-temp-extraction`, `subsystem-98-0-temp-extraction`
- Responsibilities: Primary symbols: call_reference x3, function x1.; Internal relations: calls x3.
- Evidence: src/components/BottomNav.jsx:getNavItems(), src/components/BottomNav.jsx:allItems.filter, src/components/BottomNav.jsx:includes

### src/components [MEDIUM]

- Kind: `ui`
- Summary: src/components is a ui subsystem covering 1 paths and 4 symbols; strongest evidence: calls x13, contains x2.
- Paths: `src/components/screens/SelectionScreen.jsx`
- Key Symbols: `handleSaveSquad()`, `setActiveSelectionTeam`, `finalizeSelectionProcess`, `setShowSavedToast`
- Depends On: `subsystem-102-0-src-components`, `subsystem-121-0-src-components`, `subsystem-7-0-src-components`
- Depended On By: `subsystem-118-0-temp-extraction`, `subsystem-30-0-src-components`, `subsystem-92-0-src-context`
- Responsibilities: Primary symbols: call_reference x3, function x1.; Internal relations: calls x5.
- Evidence: src/components/screens/SelectionScreen.jsx:handleSaveSquad(), src/components/screens/SelectionScreen.jsx:finalizeSelectionProcess, src/components/screens/SelectionScreen.jsx:setActiveSelectionTeam

### src/components [MEDIUM]

- Kind: `ui`
- Summary: src/components is a ui subsystem covering 1 paths and 4 symbols; strongest evidence: calls x11, contains x1.
- Paths: `src/components/screens/TeamsScreen.jsx`
- Key Symbols: `handleRebuildTeams()`, `Districts`, `api.rebuildTeams`, `setIsRebuildingTeams`
- Depends On: `subsystem-121-0-src-components`, `subsystem-61-0-src-components`, `subsystem-7-0-src-components`
- Depended On By: `subsystem-64-0-temp-extraction`, `subsystem-9-0-src-components`
- Responsibilities: Primary symbols: call_reference x3, function x1.; Internal relations: calls x3.; Exposes 2 interface candidates.
- Evidence: src/components/screens/TeamsScreen.jsx:handleRebuildTeams(), src/components/screens/TeamsScreen.jsx:Districts, src/components/screens/TeamsScreen.jsx:api.rebuildTeams

### src/components [MEDIUM]

- Kind: `ui`
- Summary: src/components is a ui subsystem covering 1 paths and 4 symbols; strongest evidence: calls x8, contains x1.
- Paths: `src/components/selection/SelectionWorkspace.jsx`
- Key Symbols: `handleAssignRole()`, `Add`, `currentList.filter`, `currentList.includes`
- Depends On: `subsystem-21-0-src-components`, `subsystem-7-0-src-components`
- Depended On By: `subsystem-19-0-src-components`, `subsystem-21-0-src-components`
- Responsibilities: Primary symbols: call_reference x3, function x1.
- Evidence: src/components/selection/SelectionWorkspace.jsx:handleAssignRole(), src/components/selection/SelectionWorkspace.jsx:Add, src/components/selection/SelectionWorkspace.jsx:currentList.filter

### src/context [MEDIUM]

- Kind: `module`
- Summary: src/context is a module subsystem covering 1 paths and 4 symbols; strongest evidence: calls x14, contains x2.
- Paths: `src/context/CricketContext.jsx`
- Key Symbols: `finalizeSelectionProcess()`, `fetchProfiles()`, `setRepresentativeTeams`, `api.finalizeSquad`
- Depends On: `subsystem-1-0-src-context`, `subsystem-121-0-src-components`, `subsystem-7-0-src-components`, `subsystem-89-0-src-components`
- Depended On By: `subsystem-1-0-src-context`, `subsystem-5-0-src-context`
- Responsibilities: Primary symbols: function x2, call_reference x2.; Internal relations: calls x2.; Exposes 1 interface candidate.
- Evidence: src/context/CricketContext.jsx:fetchProfiles(), src/context/CricketContext.jsx:finalizeSelectionProcess(), src/context/CricketContext.jsx:api.finalizeSquad

### src/components [MEDIUM]

- Kind: `ui`
- Summary: src/components is a ui subsystem covering 1 paths and 2 symbols; strongest evidence: calls x6, imports x4.
- Paths: `src/components/screens/AccessControlScreen.jsx`
- Key Symbols: `AccessControlScreen`, `password.replace`
- Depends On: `subsystem-1-0-src-context`, `subsystem-2-0-src-components`, `subsystem-29-0-src-components`, `subsystem-53-0-src-app-jsx`
- Depended On By: `subsystem-135-0-temp-extraction`, `subsystem-53-0-src-app-jsx`
- Responsibilities: Primary symbols: call_reference x2.; Internal relations: calls x2.
- Evidence: src/components/screens/AccessControlScreen.jsx:AccessControlScreen, src/components/screens/AccessControlScreen.jsx:password.replace, src/components/screens/AccessControlScreen.jsx:src/components/screens/AccessControlScreen.jsx

### src/components [MEDIUM]

- Kind: `ui`
- Summary: src/components is a ui subsystem covering 1 paths and 2 symbols; strongest evidence: calls x10, imports x3.
- Paths: `src/components/selection/PlayerList.jsx`
- Key Symbols: `onSelectPlayer`, `PlayerList`
- Depends On: `subsystem-12-0-src-components`, `subsystem-159-0-src-components`, `subsystem-29-0-src-components`, `subsystem-53-0-src-app-jsx`, `subsystem-88-0-src-components`
- Depended On By: `subsystem-44-0-src-components`, `subsystem-48-0-src-components`, `subsystem-95-0-src-components`
- Responsibilities: Primary symbols: call_reference x2.; Internal relations: calls x2.
- Evidence: src/components/selection/PlayerList.jsx:PlayerList, src/components/selection/PlayerList.jsx:onSelectPlayer, src/components/selection/PlayerList.jsx:src/components/selection/PlayerList.jsx

### src/components [MEDIUM]

- Kind: `ui`
- Summary: src/components is a ui subsystem covering 1 paths and 2 symbols; strongest evidence: calls x11, imports x2.
- Paths: `src/components/selection/Shortlist.jsx`
- Key Symbols: `Shortlist`, `onToggleShortlist`
- Depends On: `subsystem-159-0-src-components`, `subsystem-169-0-src-components`, `subsystem-29-0-src-components`, `subsystem-44-0-src-components`, `subsystem-53-0-src-app-jsx`, `subsystem-88-0-src-components`, `subsystem-94-0-src-components`
- Depended On By: `none`
- Responsibilities: Primary symbols: call_reference x2.; Internal relations: calls x2.
- Evidence: src/components/selection/Shortlist.jsx:Shortlist, src/components/selection/Shortlist.jsx:onToggleShortlist, src/components/selection/Shortlist.jsx:src/components/selection/Shortlist.jsx

### temp_extraction [MEDIUM]

- Kind: `ui`
- Summary: temp_extraction is a ui subsystem covering 1 paths and 2 symbols; strongest evidence: calls x11, imports x3.
- Paths: `temp_extraction/src/components/BottomNav.jsx`
- Key Symbols: `translateX`, `PRIMARY_TABS.filter`
- Depends On: `subsystem-29-0-src-components`, `subsystem-47-0-src-components`, `subsystem-53-0-src-app-jsx`, `subsystem-88-0-src-components`, `subsystem-98-0-temp-extraction`
- Depended On By: `subsystem-131-0-temp-extraction`, `subsystem-132-0-temp-extraction`
- Responsibilities: Primary symbols: call_reference x2.; Internal relations: calls x2.
- Evidence: temp_extraction/src/components/BottomNav.jsx:PRIMARY_TABS.filter, temp_extraction/src/components/BottomNav.jsx:translateX, temp_extraction/src/components/BottomNav.jsx:temp_extraction/src/components/BottomNav.jsx

### temp_extraction [MEDIUM]

- Kind: `ui`
- Summary: temp_extraction is a ui subsystem covering 1 paths and 2 symbols; strongest evidence: calls x45, imports x3.
- Paths: `temp_extraction/src/components/screens/ScoutingHubScreen.jsx`
- Key Symbols: `district.toLowerCase`, `battingStyle.toLowerCase`
- Depends On: `subsystem-104-0-src-components`, `subsystem-161-0-src-components`, `subsystem-24-0-src-components`, `subsystem-29-0-src-components`, `subsystem-30-0-src-components`, `subsystem-32-0-src-components`, `subsystem-33-0-src-components`, `subsystem-53-0-src-app-jsx`, `subsystem-88-0-src-components`, `subsystem-98-0-temp-extraction`
- Depended On By: `subsystem-131-0-temp-extraction`, `subsystem-143-0-temp-extraction`
- Responsibilities: Primary symbols: call_reference x2.; Internal relations: calls x2.
- Evidence: temp_extraction/src/components/screens/ScoutingHubScreen.jsx:battingStyle.toLowerCase, temp_extraction/src/components/screens/ScoutingHubScreen.jsx:district.toLowerCase, temp_extraction/src/components/screens/ScoutingHubScreen.jsx:temp_extraction/src/components/screens/ScoutingHubScreen.jsx

### temp_extraction [MEDIUM]

- Kind: `module`
- Summary: temp_extraction is a module subsystem covering 1 paths and 2 symbols; strongest evidence: calls x53, imports x29.
- Paths: `temp_extraction/src/context/CricketContext.jsx`
- Key Symbols: `Rohan`, `prev.includes`
- Depends On: `subsystem-1-0-src-context`, `subsystem-102-0-src-components`, `subsystem-149-0-src-app-jsx`, `subsystem-168-0-src-components`, `subsystem-177-0-src-components`, `subsystem-29-0-src-components`, `subsystem-3-0-src-components`, `subsystem-53-0-src-app-jsx`, `subsystem-88-0-src-components`
- Depended On By: `subsystem-1-0-src-context`, `subsystem-11-0-src-components`, `subsystem-118-0-temp-extraction`, `subsystem-131-0-temp-extraction`, `subsystem-132-0-temp-extraction`, `subsystem-133-0-temp-extraction`, `subsystem-134-0-temp-extraction`, `subsystem-135-0-temp-extraction`, `subsystem-136-0-temp-extraction`, `subsystem-137-0-temp-extraction`, `subsystem-138-0-temp-extraction`, `subsystem-139-0-temp-extraction`, `subsystem-140-0-temp-extraction`, `subsystem-141-0-temp-extraction`, `subsystem-142-0-temp-extraction`, `subsystem-143-0-temp-extraction`, `subsystem-144-0-temp-extraction`, `subsystem-2-0-src-components`, `subsystem-26-0-temp-extraction`, `subsystem-3-0-src-components`, `subsystem-42-0-temp-extraction`, `subsystem-59-0-temp-extraction`, `subsystem-60-0-temp-extraction`, `subsystem-64-0-temp-extraction`, `subsystem-72-0-temp-extraction`, `subsystem-96-0-temp-extraction`, `subsystem-97-0-temp-extraction`
- Responsibilities: Primary symbols: call_reference x2.; Internal relations: calls x1.
- Evidence: temp_extraction/src/context/CricketContext.jsx:Rohan, temp_extraction/src/context/CricketContext.jsx:prev.includes, temp_extraction/src/context/CricketContext.jsx:temp_extraction/src/context/CricketContext.jsx

### test-players2.js [MEDIUM]

- Kind: `module`
- Summary: test-players2.js is a module subsystem covering 1 paths and 2 symbols; strongest evidence: calls x16, imports x2.
- Paths: `test-players2.js`
- Key Symbols: `player_registrations`, `is`
- Depends On: `subsystem-0-0-src-lib`, `subsystem-27-0-apply-bug5-sql-js`, `subsystem-82-0-delete-season-js`
- Depended On By: `subsystem-100-0-test-players3-js`, `subsystem-120-0-test-players-js`
- Responsibilities: Primary symbols: call_reference x2.; Internal relations: calls x2.
- Evidence: test-players2.js:is, test-players2.js:player_registrations, test-players2.js:test-players2.js

### test-players3.js [MEDIUM]

- Kind: `ui`
- Summary: test-players3.js is a ui subsystem covering 1 paths and 2 symbols; strongest evidence: calls x9, imports x1.
- Paths: `test-players3.js`
- Key Symbols: `config`, `require`
- Depends On: `subsystem-0-0-src-lib`, `subsystem-27-0-apply-bug5-sql-js`, `subsystem-38-0-src-sw-js`, `subsystem-99-0-test-players2-js`
- Depended On By: `none`
- Responsibilities: Primary symbols: call_reference x2.; Internal relations: calls x2.
- Evidence: test-players3.js:config, test-players3.js:require, test-players3.js:test-players3.js

### test-stats.js [MEDIUM]

- Kind: `module`
- Summary: test-stats.js is a module subsystem covering 1 paths and 2 symbols; strongest evidence: calls x46, imports x1.
- Paths: `test-stats.js`
- Key Symbols: `runTest`, `runs`
- Depends On: `subsystem-0-0-src-lib`, `subsystem-27-0-apply-bug5-sql-js`, `subsystem-41-0-src-lib`, `subsystem-82-0-delete-season-js`
- Depended On By: `none`
- Responsibilities: Primary symbols: call_reference x2.; Internal relations: calls x3.; Exposes 2 interface candidates.
- Evidence: test-stats.js:runTest, test-stats.js:runs, test-stats.js:test-stats.js

### src/components [MEDIUM]

- Kind: `ui`
- Summary: src/components is a ui subsystem covering 1 paths and 3 symbols; strongest evidence: calls x27.
- Paths: `src/components/NotificationPrompt.jsx`
- Key Symbols: `setTimeout`, `localStorage.setItem`, `localStorage.getItem`
- Depends On: `none`
- Depended On By: `subsystem-1-0-src-context`, `subsystem-28-0-src-components`, `subsystem-58-0-src-components`, `subsystem-65-0-src-components`, `subsystem-7-0-src-components`, `subsystem-89-0-src-components`, `subsystem-9-0-src-components`, `subsystem-98-0-temp-extraction`
- Responsibilities: Primary symbols: call_reference x3.
- Evidence: src/components/NotificationPrompt.jsx:localStorage.getItem, src/components/NotificationPrompt.jsx:localStorage.setItem, src/components/NotificationPrompt.jsx:setTimeout

### src/components [MEDIUM]

- Kind: `ui`
- Summary: src/components is a ui subsystem covering 1 paths and 3 symbols; strongest evidence: calls x45.
- Paths: `src/components/screens/InningsInitScreen.jsx`
- Key Symbols: `useMemo`, `onChange`, `players.find`
- Depends On: `none`
- Depended On By: `subsystem-140-0-temp-extraction`, `subsystem-141-0-temp-extraction`, `subsystem-146-0-temp-extraction`, `subsystem-180-0-src-components`, `subsystem-19-0-src-components`, `subsystem-2-0-src-components`, `subsystem-3-0-src-components`, `subsystem-42-0-temp-extraction`, `subsystem-54-0-src-components`, `subsystem-56-0-src-components`, `subsystem-58-0-src-components`, `subsystem-60-0-temp-extraction`, `subsystem-62-0-src-components`, `subsystem-69-0-src-components`, `subsystem-76-0-src-components`, `subsystem-87-0-temp-extraction`, `subsystem-9-0-src-components`
- Responsibilities: Primary symbols: call_reference x3.
- Evidence: src/components/screens/InningsInitScreen.jsx:onChange, src/components/screens/InningsInitScreen.jsx:players.find, src/components/screens/InningsInitScreen.jsx:useMemo

### src/components [MEDIUM]

- Kind: `ui`
- Summary: src/components is a ui subsystem covering 1 paths and 3 symbols; strongest evidence: calls x57.
- Paths: `src/components/screens/MatchSetupScreen.jsx`
- Key Symbols: `players.filter`, `setSearchQuery`, `filteredPlayers.map`
- Depends On: `none`
- Depended On By: `subsystem-106-0-src-components`, `subsystem-118-0-temp-extraction`, `subsystem-141-0-temp-extraction`, `subsystem-143-0-temp-extraction`, `subsystem-19-0-src-components`, `subsystem-24-0-src-components`, `subsystem-26-0-temp-extraction`, `subsystem-3-0-src-components`, `subsystem-30-0-src-components`, `subsystem-32-0-src-components`, `subsystem-33-0-src-components`, `subsystem-6-0-src-components`, `subsystem-71-0-src-components`, `subsystem-76-0-src-components`, `subsystem-77-0-src-components`, `subsystem-8-0-src-components`, `subsystem-9-0-src-components`, `subsystem-97-0-temp-extraction`
- Responsibilities: Primary symbols: call_reference x3.; Exposes 1 interface candidate.
- Evidence: src/components/screens/MatchSetupScreen.jsx:filteredPlayers.map, src/components/screens/MatchSetupScreen.jsx:players.filter, src/components/screens/MatchSetupScreen.jsx:setSearchQuery

### src/components [MEDIUM]

- Kind: `ui`
- Summary: src/components is a ui subsystem covering 1 paths and 3 symbols; strongest evidence: calls x10.
- Paths: `src/components/screens/PlayerProfileScreen.jsx`
- Key Symbols: `setPlayers`, `api.deletePlayer`, `players.delete`
- Depends On: `none`
- Depended On By: `subsystem-1-0-src-context`, `subsystem-5-0-src-context`, `subsystem-61-0-src-components`, `subsystem-8-0-src-components`
- Responsibilities: Primary symbols: call_reference x3.; Exposes 1 interface candidate.
- Evidence: src/components/screens/PlayerProfileScreen.jsx:api.deletePlayer, src/components/screens/PlayerProfileScreen.jsx:players.delete, src/components/screens/PlayerProfileScreen.jsx:setPlayers

### src/components [MEDIUM]

- Kind: `ui`
- Summary: src/components is a ui subsystem covering 1 paths and 3 symbols; strongest evidence: calls x19, contains x1.
- Paths: `src/components/screens/SeasonMigrationTab.jsx`
- Key Symbols: `Set`, `toggleSelectAll()`, `setAgeCategories`
- Depends On: `subsystem-104-0-src-components`, `subsystem-2-0-src-components`, `subsystem-8-0-src-components`
- Depended On By: `subsystem-1-0-src-context`, `subsystem-118-0-temp-extraction`, `subsystem-24-0-src-components`, `subsystem-26-0-temp-extraction`, `subsystem-30-0-src-components`, `subsystem-8-0-src-components`
- Responsibilities: Primary symbols: call_reference x2, function x1.; Internal relations: calls x2.
- Evidence: src/components/screens/SeasonMigrationTab.jsx:toggleSelectAll(), src/components/screens/SeasonMigrationTab.jsx:Set, src/components/screens/SeasonMigrationTab.jsx:setAgeCategories

### src/components [MEDIUM]

- Kind: `ui`
- Summary: src/components is a ui subsystem covering 1 paths and 3 symbols; strongest evidence: calls x6, contains x1.
- Paths: `src/components/screens/SeasonMigrationTab.jsx`
- Key Symbols: `getPlayerTeam()`, `teams.find`, `squad.some`
- Depends On: `none`
- Depended On By: `subsystem-15-0-src-components`, `subsystem-19-0-src-components`, `subsystem-8-0-src-components`, `subsystem-9-0-src-components`
- Responsibilities: Primary symbols: call_reference x2, function x1.; Internal relations: calls x2.
- Evidence: src/components/screens/SeasonMigrationTab.jsx:getPlayerTeam(), src/components/screens/SeasonMigrationTab.jsx:squad.some, src/components/screens/SeasonMigrationTab.jsx:teams.find

### src/components [MEDIUM]

- Kind: `ui`
- Summary: src/components is a ui subsystem covering 1 paths and 3 symbols; strongest evidence: calls x4.
- Paths: `src/components/selection/CreateTeamModal.jsx`
- Key Symbols: `parseInt`, `gender.toLowerCase`, `onCreateTeam`
- Depends On: `none`
- Depended On By: `subsystem-1-0-src-context`, `subsystem-65-0-src-components`
- Responsibilities: Primary symbols: call_reference x3.
- Evidence: src/components/selection/CreateTeamModal.jsx:gender.toLowerCase, src/components/selection/CreateTeamModal.jsx:onCreateTeam, src/components/selection/CreateTeamModal.jsx:parseInt

### scratch_check_enum.js [MEDIUM]

- Kind: `module`
- Summary: scratch_check_enum.js is a module subsystem covering 1 paths and 1 symbols; strongest evidence: calls x7, imports x2.
- Paths: `scratch_check_enum.js`
- Key Symbols: `checkEnum`
- Depends On: `subsystem-27-0-apply-bug5-sql-js`
- Depended On By: `none`
- Responsibilities: Primary symbols: call_reference x1.; Internal relations: calls x2.
- Evidence: scratch_check_enum.js:checkEnum, scratch_check_enum.js:scratch_check_enum.js, scratch_check_enum.js:calls

### src/components [HIGH]

- Kind: `ui`
- Summary: src/components is a ui subsystem covering 1 paths and 1 symbols; strongest evidence: imports x3, contains x1.
- Paths: `src/components/AnimatedPage.jsx`
- Key Symbols: `AnimatedPage()`
- Depends On: `subsystem-53-0-src-app-jsx`
- Depended On By: `subsystem-53-0-src-app-jsx`
- Responsibilities: Primary symbols: function x1.; Internal relations: contains x1.
- Evidence: src/components/AnimatedPage.jsx:AnimatedPage(), src/components/AnimatedPage.jsx:src/components/AnimatedPage.jsx, src/App.jsx:imports

### src/components [MEDIUM]

- Kind: `ui`
- Summary: src/components is a ui subsystem covering 1 paths and 1 symbols; strongest evidence: calls x12, imports x4.
- Paths: `src/components/Header.jsx`
- Key Symbols: `Header`
- Depends On: `subsystem-1-0-src-context`, `subsystem-29-0-src-components`, `subsystem-53-0-src-app-jsx`, `subsystem-88-0-src-components`
- Depended On By: `subsystem-133-0-temp-extraction`, `subsystem-53-0-src-app-jsx`, `subsystem-74-0-src-components`
- Responsibilities: Primary symbols: call_reference x1.; Internal relations: calls x1.
- Evidence: src/components/Header.jsx:Header, src/components/Header.jsx:src/components/Header.jsx, src/App.jsx:imports

### src/components [MEDIUM]

- Kind: `ui`
- Summary: src/components is a ui subsystem covering 1 paths and 1 symbols; strongest evidence: imports x2, calls x1.
- Paths: `src/components/selection/FinalSquad.jsx`
- Key Symbols: `FinalSquad`
- Depends On: `subsystem-51-0-src-components`, `subsystem-53-0-src-app-jsx`
- Depended On By: `none`
- Responsibilities: Primary symbols: call_reference x1.; Internal relations: calls x1.
- Evidence: src/components/selection/FinalSquad.jsx:FinalSquad, src/components/selection/FinalSquad.jsx:src/components/selection/FinalSquad.jsx, src/components/selection/FinalSquad.jsx:calls

### src/components [MEDIUM]

- Kind: `ui`
- Summary: src/components is a ui subsystem covering 1 paths and 1 symbols; strongest evidence: calls x7, imports x2.
- Paths: `src/components/selection/PlayerComparison.jsx`
- Key Symbols: `PlayerComparison`
- Depends On: `subsystem-159-0-src-components`, `subsystem-29-0-src-components`, `subsystem-53-0-src-app-jsx`
- Depended On By: `none`
- Responsibilities: Primary symbols: call_reference x1.; Internal relations: calls x1.
- Evidence: src/components/selection/PlayerComparison.jsx:PlayerComparison, src/components/selection/PlayerComparison.jsx:src/components/selection/PlayerComparison.jsx, src/components/selection/PlayerComparison.jsx:calls

### src/components [MEDIUM]

- Kind: `ui`
- Summary: src/components is a ui subsystem covering 1 paths and 1 symbols; strongest evidence: imports x4, calls x3.
- Paths: `src/components/ui/BottomSheet.jsx`
- Key Symbols: `BottomSheet`
- Depends On: `subsystem-170-0-src-components`, `subsystem-29-0-src-components`, `subsystem-53-0-src-app-jsx`
- Depended On By: `subsystem-19-0-src-components`
- Responsibilities: Primary symbols: call_reference x1.; Internal relations: calls x1.
- Evidence: src/components/ui/BottomSheet.jsx:BottomSheet, src/components/ui/BottomSheet.jsx:src/components/ui/BottomSheet.jsx, src/components/selection/SelectionWorkspace.jsx:imports

### src/components [MEDIUM]

- Kind: `ui`
- Summary: src/components is a ui subsystem covering 1 paths and 1 symbols; strongest evidence: imports x2, calls x1.
- Paths: `src/components/ui/ErrorState.jsx`
- Key Symbols: `ErrorState`
- Depends On: `subsystem-29-0-src-components`, `subsystem-53-0-src-app-jsx`
- Depended On By: `none`
- Responsibilities: Primary symbols: call_reference x1.; Internal relations: calls x1.
- Evidence: src/components/ui/ErrorState.jsx:ErrorState, src/components/ui/ErrorState.jsx:src/components/ui/ErrorState.jsx, src/components/ui/ErrorState.jsx:calls

### src/components [MEDIUM]

- Kind: `ui`
- Summary: src/components is a ui subsystem covering 1 paths and 1 symbols; strongest evidence: imports x3, calls x1.
- Paths: `src/components/ui/Modal.jsx`
- Key Symbols: `Modal`
- Depends On: `subsystem-29-0-src-components`, `subsystem-53-0-src-app-jsx`
- Depended On By: `subsystem-2-0-src-components`
- Responsibilities: Primary symbols: call_reference x1.; Internal relations: calls x1.
- Evidence: src/components/ui/Modal.jsx:Modal, src/components/ui/Modal.jsx:src/components/ui/Modal.jsx, src/components/screens/ScoringScreen.jsx:imports

### src/components [MEDIUM]

- Kind: `ui`
- Summary: src/components is a ui subsystem covering 1 paths and 1 symbols; strongest evidence: imports x1, calls x1.
- Paths: `src/components/ui/Skeleton.jsx`
- Key Symbols: `Skeleton`
- Depends On: `subsystem-53-0-src-app-jsx`
- Depended On By: `none`
- Responsibilities: Primary symbols: call_reference x1.; Internal relations: calls x1.
- Evidence: src/components/ui/Skeleton.jsx:Skeleton, src/components/ui/Skeleton.jsx:src/components/ui/Skeleton.jsx, src/components/ui/Skeleton.jsx:calls

### temp_extraction [MEDIUM]

- Kind: `ui`
- Summary: temp_extraction is a ui subsystem covering 1 paths and 1 symbols; strongest evidence: calls x48, imports x6.
- Paths: `temp_extraction/src/components/screens/SelectionScreen.jsx`
- Key Symbols: `selectedSquad.filter`
- Depends On: `subsystem-104-0-src-components`, `subsystem-106-0-src-components`, `subsystem-145-0-temp-extraction`, `subsystem-150-0-src-components`, `subsystem-153-0-src-components`, `subsystem-161-0-src-components`, `subsystem-162-0-src-components`, `subsystem-167-0-src-components`, `subsystem-179-0-temp-extraction`, `subsystem-30-0-src-components`, `subsystem-32-0-src-components`, `subsystem-33-0-src-components`, `subsystem-53-0-src-app-jsx`, `subsystem-77-0-src-components`, `subsystem-87-0-temp-extraction`, `subsystem-88-0-src-components`, `subsystem-89-0-src-components`, `subsystem-9-0-src-components`, `subsystem-98-0-temp-extraction`
- Depended On By: `subsystem-131-0-temp-extraction`
- Responsibilities: Primary symbols: call_reference x1.; Internal relations: calls x1.
- Evidence: temp_extraction/src/components/screens/SelectionScreen.jsx:selectedSquad.filter, temp_extraction/src/components/screens/SelectionScreen.jsx:temp_extraction/src/components/screens/SelectionScreen.jsx, temp_extraction/src/App.jsx:imports

### temp_extraction [MEDIUM]

- Kind: `ui`
- Summary: temp_extraction is a ui subsystem covering 1 paths and 1 symbols; strongest evidence: imports x5, calls x3.
- Paths: `temp_extraction/src/components/ui/MatchFolder.jsx`
- Key Symbols: `MatchFolder`
- Depends On: `subsystem-145-0-temp-extraction`, `subsystem-29-0-src-components`, `subsystem-3-0-src-components`, `subsystem-53-0-src-app-jsx`, `subsystem-88-0-src-components`
- Depended On By: `subsystem-42-0-temp-extraction`, `subsystem-60-0-temp-extraction`
- Responsibilities: Primary symbols: call_reference x1.; Internal relations: calls x1.
- Evidence: temp_extraction/src/components/ui/MatchFolder.jsx:MatchFolder, temp_extraction/src/components/ui/MatchFolder.jsx:temp_extraction/src/components/ui/MatchFolder.jsx, temp_extraction/src/components/screens/MatchesScreen.jsx:imports

### test-players.js [MEDIUM]

- Kind: `module`
- Summary: test-players.js is a module subsystem covering 1 paths and 1 symbols; strongest evidence: calls x14, imports x2.
- Paths: `test-players.js`
- Key Symbols: `console.dir`
- Depends On: `subsystem-0-0-src-lib`, `subsystem-27-0-apply-bug5-sql-js`, `subsystem-82-0-delete-season-js`, `subsystem-99-0-test-players2-js`
- Depended On By: `none`
- Responsibilities: Primary symbols: call_reference x1.; Internal relations: calls x1.
- Evidence: test-players.js:console.dir, test-players.js:test-players.js, test-players.js:calls

### src/components [MEDIUM]

- Kind: `ui`
- Summary: src/components is a ui subsystem covering 1 paths and 2 symbols; strongest evidence: calls x113.
- Paths: `src/components/NotificationPrompt.jsx`
- Key Symbols: `async`, `console.error`
- Depends On: `none`
- Depended On By: `subsystem-1-0-src-context`, `subsystem-11-0-src-components`, `subsystem-15-0-src-components`, `subsystem-2-0-src-components`, `subsystem-21-0-src-components`, `subsystem-24-0-src-components`, `subsystem-25-0-src-main-jsx`, `subsystem-28-0-src-components`, `subsystem-3-0-src-components`, `subsystem-31-0-src-components`, `subsystem-34-0-src-components`, `subsystem-39-0-src-components`, `subsystem-40-0-src-components`, `subsystem-5-0-src-context`, `subsystem-58-0-src-components`, `subsystem-61-0-src-components`, `subsystem-62-0-src-components`, `subsystem-63-0-src-components`, `subsystem-65-0-src-components`, `subsystem-66-0-src-components`, `subsystem-7-0-src-components`, `subsystem-73-0-src-components`, `subsystem-8-0-src-components`, `subsystem-80-0-src-components`, `subsystem-81-0-src-components`, `subsystem-89-0-src-components`, `subsystem-90-0-src-components`, `subsystem-92-0-src-context`
- Responsibilities: Primary symbols: call_reference x2.
- Evidence: src/components/NotificationPrompt.jsx:async, src/components/NotificationPrompt.jsx:console.error, src/components/screens/MatchResultScreen.jsx:calls

### src/components [MEDIUM]

- Kind: `ui`
- Summary: src/components is a ui subsystem covering 1 paths and 2 symbols; strongest evidence: calls x15.
- Paths: `src/components/screens/AuthScreen.jsx`
- Key Symbols: `haptics.light`, `useHaptics`
- Depends On: `none`
- Depended On By: `subsystem-2-0-src-components`, `subsystem-44-0-src-components`, `subsystem-71-0-src-components`, `subsystem-73-0-src-components`, `subsystem-74-0-src-components`, `subsystem-79-0-src-components`
- Responsibilities: Primary symbols: call_reference x2.
- Evidence: src/components/screens/AuthScreen.jsx:haptics.light, src/components/screens/AuthScreen.jsx:useHaptics, src/components/screens/AuthScreen.jsx:calls

### src/components [MEDIUM]

- Kind: `ui`
- Summary: src/components is a ui subsystem covering 1 paths and 2 symbols; strongest evidence: calls x11.
- Paths: `src/components/screens/MatchSetupScreen.jsx`
- Key Symbols: `setIsSaving`, `React.useEffect`
- Depends On: `none`
- Depended On By: `subsystem-3-0-src-components`, `subsystem-31-0-src-components`, `subsystem-39-0-src-components`, `subsystem-45-0-src-components`, `subsystem-63-0-src-components`, `subsystem-65-0-src-components`
- Responsibilities: Primary symbols: call_reference x2.
- Evidence: src/components/screens/MatchSetupScreen.jsx:React.useEffect, src/components/screens/MatchSetupScreen.jsx:setIsSaving, src/components/screens/MatchSetupScreen.jsx:calls

### src/components [MEDIUM]

- Kind: `ui`
- Summary: src/components is a ui subsystem covering 1 paths and 2 symbols; strongest evidence: calls x4.
- Paths: `src/components/screens/TeamsScreen.jsx`
- Key Symbols: `searchQuery.trim`, `contextPlayers.find`
- Depends On: `none`
- Depended On By: `subsystem-19-0-src-components`, `subsystem-32-0-src-components`, `subsystem-9-0-src-components`
- Responsibilities: Primary symbols: call_reference x2.; Exposes 1 interface candidate.
- Evidence: src/components/screens/TeamsScreen.jsx:contextPlayers.find, src/components/screens/TeamsScreen.jsx:searchQuery.trim, src/components/screens/TeamsScreen.jsx:calls

### temp_extraction [MEDIUM]

- Kind: `ui`
- Summary: temp_extraction is a ui subsystem covering 1 paths and 2 symbols; strongest evidence: calls x9, contains x1.
- Paths: `temp_extraction/src/components/screens/AuthScreen.jsx`
- Key Symbols: `completeLogin()`, `role.toLowerCase`
- Depends On: `subsystem-152-0-src-components`, `subsystem-29-0-src-components`, `subsystem-5-0-src-context`
- Depended On By: `subsystem-136-0-temp-extraction`, `subsystem-73-0-src-components`
- Responsibilities: Primary symbols: function x1, call_reference x1.; Internal relations: calls x1.
- Evidence: temp_extraction/src/components/screens/AuthScreen.jsx:completeLogin(), temp_extraction/src/components/screens/AuthScreen.jsx:role.toLowerCase, temp_extraction/src/components/screens/AuthScreen.jsx:contains

### src/components [MEDIUM]

- Kind: `ui`
- Summary: src/components is a ui subsystem covering 1 paths and 0 symbols; strongest evidence: imports x6.
- Paths: `src/components/ui/PageHeader.jsx`
- Key Symbols: `none`
- Depends On: `none`
- Depended On By: `subsystem-30-0-src-components`, `subsystem-7-0-src-components`, `subsystem-70-0-src-components`, `subsystem-84-0-src-components`, `subsystem-85-0-src-components`, `subsystem-9-0-src-components`
- Responsibilities: none
- Evidence: src/components/ui/PageHeader.jsx:src/components/ui/PageHeader.jsx, src/components/screens/AdministrationScreen.jsx:imports, src/components/screens/InningsBreakScreen.jsx:imports

### src/data [MEDIUM]

- Kind: `module`
- Summary: src/data is a module subsystem covering 1 paths and 0 symbols; strongest evidence: imports x1.
- Paths: `src/data/constants.js`
- Key Symbols: `none`
- Depends On: `none`
- Depended On By: `subsystem-1-0-src-context`
- Responsibilities: none
- Evidence: src/data/constants.js:src/data/constants.js, src/context/CricketContext.jsx:imports

### src/engine [MEDIUM]

- Kind: `module`
- Summary: src/engine is a module subsystem covering 1 paths and 0 symbols; strongest evidence: imports x3.
- Paths: `src/engine/matchSummaryEngine.js`
- Key Symbols: `none`
- Depends On: `none`
- Depended On By: `subsystem-58-0-src-components`, `subsystem-62-0-src-components`, `subsystem-69-0-src-components`
- Responsibilities: none
- Evidence: src/engine/matchSummaryEngine.js:src/engine/matchSummaryEngine.js, src/components/screens/MatchDetailScreen.jsx:imports, src/components/screens/MatchResultScreen.jsx:imports

### src/lib [MEDIUM]

- Kind: `module`
- Summary: src/lib is a module subsystem covering 1 paths and 0 symbols; strongest evidence: imports x4, contains x1.
- Paths: `src/lib/standings.js`
- Key Symbols: `none`
- Depends On: `subsystem-130-0-src-lib`, `subsystem-18-0-src-lib`, `subsystem-52-0-src-hooks`
- Depended On By: `subsystem-15-0-src-components`, `subsystem-22-0-src-components`
- Responsibilities: none
- Evidence: src/lib/standings.js:src/lib/standings.js, src/components/screens/HomeScreen.jsx:imports, src/components/screens/TournamentsScreen.jsx:imports

### src/lib [MEDIUM]

- Kind: `module`
- Summary: src/lib is a module subsystem covering 1 paths and 0 symbols; strongest evidence: imports x9, calls x2.
- Paths: `src/lib/supabase.js`
- Key Symbols: `none`
- Depends On: `subsystem-0-0-src-lib`, `subsystem-27-0-apply-bug5-sql-js`
- Depended On By: `subsystem-0-0-src-lib`, `subsystem-1-0-src-context`, `subsystem-129-0-src-lib`, `subsystem-14-0-src-services`, `subsystem-2-0-src-components`, `subsystem-24-0-src-components`, `subsystem-28-0-src-components`, `subsystem-74-0-src-components`
- Responsibilities: none
- Evidence: src/lib/supabase.js:src/lib/supabase.js, src/components/NotificationPrompt.jsx:imports, src/components/screens/AuthScreen.jsx:imports

### temp_extraction [MEDIUM]

- Kind: `module`
- Summary: temp_extraction is a module subsystem covering 1 paths and 0 symbols; strongest evidence: imports x29, contains x2.
- Paths: `temp_extraction/src/App.jsx`
- Key Symbols: `none`
- Depends On: `subsystem-11-0-src-components`, `subsystem-118-0-temp-extraction`, `subsystem-132-0-temp-extraction`, `subsystem-133-0-temp-extraction`, `subsystem-134-0-temp-extraction`, `subsystem-135-0-temp-extraction`, `subsystem-136-0-temp-extraction`, `subsystem-137-0-temp-extraction`, `subsystem-138-0-temp-extraction`, `subsystem-139-0-temp-extraction`, `subsystem-140-0-temp-extraction`, `subsystem-141-0-temp-extraction`, `subsystem-142-0-temp-extraction`, `subsystem-143-0-temp-extraction`, `subsystem-144-0-temp-extraction`, `subsystem-2-0-src-components`, `subsystem-26-0-temp-extraction`, `subsystem-3-0-src-components`, `subsystem-42-0-temp-extraction`, `subsystem-53-0-src-app-jsx`, `subsystem-59-0-temp-extraction`, `subsystem-60-0-temp-extraction`, `subsystem-64-0-temp-extraction`, `subsystem-72-0-temp-extraction`, `subsystem-96-0-temp-extraction`, `subsystem-97-0-temp-extraction`, `subsystem-98-0-temp-extraction`
- Depended On By: `subsystem-25-0-src-main-jsx`
- Responsibilities: Exposes 1 interface candidate.
- Evidence: temp_extraction/src/App.jsx:temp_extraction/src/App.jsx, temp_extraction/src/App.jsx:calls, temp_extraction/src/App.jsx:contains

### temp_extraction [MEDIUM]

- Kind: `ui`
- Summary: temp_extraction is a ui subsystem covering 1 paths and 0 symbols; strongest evidence: calls x20, imports x5.
- Paths: `temp_extraction/src/components/DrawerMenu.jsx`
- Key Symbols: `none`
- Depends On: `subsystem-145-0-temp-extraction`, `subsystem-29-0-src-components`, `subsystem-47-0-src-components`, `subsystem-53-0-src-app-jsx`, `subsystem-6-0-src-components`, `subsystem-88-0-src-components`, `subsystem-96-0-temp-extraction`, `subsystem-98-0-temp-extraction`
- Depended On By: `subsystem-131-0-temp-extraction`
- Responsibilities: none
- Evidence: temp_extraction/src/components/DrawerMenu.jsx:temp_extraction/src/components/DrawerMenu.jsx, temp_extraction/src/App.jsx:imports, temp_extraction/src/components/DrawerMenu.jsx:calls

### temp_extraction [MEDIUM]

- Kind: `ui`
- Summary: temp_extraction is a ui subsystem covering 1 paths and 0 symbols; strongest evidence: calls x7, imports x4.
- Paths: `temp_extraction/src/components/Header.jsx`
- Key Symbols: `none`
- Depends On: `subsystem-111-0-src-components`, `subsystem-145-0-temp-extraction`, `subsystem-29-0-src-components`, `subsystem-47-0-src-components`, `subsystem-53-0-src-app-jsx`, `subsystem-98-0-temp-extraction`
- Depended On By: `subsystem-131-0-temp-extraction`
- Responsibilities: none
- Evidence: temp_extraction/src/components/Header.jsx:temp_extraction/src/components/Header.jsx, temp_extraction/src/App.jsx:imports, temp_extraction/src/components/Header.jsx:calls

### temp_extraction [MEDIUM]

- Kind: `ui`
- Summary: temp_extraction is a ui subsystem covering 1 paths and 0 symbols; strongest evidence: imports x5, calls x3.
- Paths: `temp_extraction/src/components/ProtectedRoute.jsx`
- Key Symbols: `none`
- Depends On: `subsystem-53-0-src-app-jsx`, `subsystem-83-0-src-components`, `subsystem-98-0-temp-extraction`
- Depended On By: `subsystem-131-0-temp-extraction`, `subsystem-136-0-temp-extraction`
- Responsibilities: Exposes 1 interface candidate.
- Evidence: temp_extraction/src/components/ProtectedRoute.jsx:temp_extraction/src/components/ProtectedRoute.jsx, temp_extraction/src/App.jsx:imports, temp_extraction/src/components/ProtectedRoute.jsx:calls

### temp_extraction [MEDIUM]

- Kind: `ui`
- Summary: temp_extraction is a ui subsystem covering 1 paths and 0 symbols; strongest evidence: imports x4, calls x4.
- Paths: `temp_extraction/src/components/screens/AccessControlScreen.jsx`
- Key Symbols: `none`
- Depends On: `subsystem-2-0-src-components`, `subsystem-29-0-src-components`, `subsystem-53-0-src-app-jsx`, `subsystem-93-0-src-components`, `subsystem-98-0-temp-extraction`
- Depended On By: `subsystem-131-0-temp-extraction`
- Responsibilities: none
- Evidence: temp_extraction/src/components/screens/AccessControlScreen.jsx:temp_extraction/src/components/screens/AccessControlScreen.jsx, temp_extraction/src/App.jsx:imports, temp_extraction/src/components/screens/AccessControlScreen.jsx:calls

### temp_extraction [MEDIUM]

- Kind: `ui`
- Summary: temp_extraction is a ui subsystem covering 1 paths and 0 symbols; strongest evidence: calls x9, imports x5.
- Paths: `temp_extraction/src/components/screens/AuthScreen.jsx`
- Key Symbols: `none`
- Depends On: `subsystem-125-0-temp-extraction`, `subsystem-134-0-temp-extraction`, `subsystem-29-0-src-components`, `subsystem-30-0-src-components`, `subsystem-53-0-src-app-jsx`, `subsystem-65-0-src-components`, `subsystem-7-0-src-components`, `subsystem-73-0-src-components`, `subsystem-74-0-src-components`, `subsystem-88-0-src-components`, `subsystem-98-0-temp-extraction`
- Depended On By: `subsystem-131-0-temp-extraction`
- Responsibilities: none
- Evidence: temp_extraction/src/components/screens/AuthScreen.jsx:temp_extraction/src/components/screens/AuthScreen.jsx, temp_extraction/src/App.jsx:imports, temp_extraction/src/components/screens/AuthScreen.jsx:calls

### temp_extraction [MEDIUM]

- Kind: `ui`
- Summary: temp_extraction is a ui subsystem covering 1 paths and 0 symbols; strongest evidence: imports x7, calls x6.
- Paths: `temp_extraction/src/components/screens/InningsBreakScreen.jsx`
- Key Symbols: `none`
- Depends On: `subsystem-145-0-temp-extraction`, `subsystem-157-0-src-components`, `subsystem-29-0-src-components`, `subsystem-53-0-src-app-jsx`, `subsystem-6-0-src-components`, `subsystem-84-0-src-components`, `subsystem-87-0-temp-extraction`, `subsystem-98-0-temp-extraction`
- Depended On By: `subsystem-131-0-temp-extraction`
- Responsibilities: none
- Evidence: temp_extraction/src/components/screens/InningsBreakScreen.jsx:temp_extraction/src/components/screens/InningsBreakScreen.jsx, temp_extraction/src/App.jsx:imports, temp_extraction/src/components/screens/InningsBreakScreen.jsx:calls

### temp_extraction [MEDIUM]

- Kind: `ui`
- Summary: temp_extraction is a ui subsystem covering 1 paths and 0 symbols; strongest evidence: calls x8, imports x7.
- Paths: `temp_extraction/src/components/screens/MatchDetailScreen.jsx`
- Key Symbols: `none`
- Depends On: `subsystem-146-0-temp-extraction`, `subsystem-2-0-src-components`, `subsystem-29-0-src-components`, `subsystem-50-0-temp-extraction`, `subsystem-53-0-src-app-jsx`, `subsystem-6-0-src-components`, `subsystem-69-0-src-components`, `subsystem-98-0-temp-extraction`
- Depended On By: `subsystem-131-0-temp-extraction`
- Responsibilities: none
- Evidence: temp_extraction/src/components/screens/MatchDetailScreen.jsx:temp_extraction/src/components/screens/MatchDetailScreen.jsx, temp_extraction/src/App.jsx:imports, temp_extraction/src/components/screens/MatchDetailScreen.jsx:calls

### temp_extraction [MEDIUM]

- Kind: `ui`
- Summary: temp_extraction is a ui subsystem covering 1 paths and 0 symbols; strongest evidence: calls x6, imports x5.
- Paths: `temp_extraction/src/components/screens/MatchOverviewScreen.jsx`
- Key Symbols: `none`
- Depends On: `subsystem-145-0-temp-extraction`, `subsystem-29-0-src-components`, `subsystem-53-0-src-app-jsx`, `subsystem-85-0-src-components`, `subsystem-87-0-temp-extraction`, `subsystem-98-0-temp-extraction`
- Depended On By: `subsystem-131-0-temp-extraction`
- Responsibilities: none
- Evidence: temp_extraction/src/components/screens/MatchOverviewScreen.jsx:temp_extraction/src/components/screens/MatchOverviewScreen.jsx, temp_extraction/src/App.jsx:imports, temp_extraction/src/components/screens/MatchOverviewScreen.jsx:calls

### temp_extraction [MEDIUM]

- Kind: `ui`
- Summary: temp_extraction is a ui subsystem covering 1 paths and 0 symbols; strongest evidence: imports x7, calls x7.
- Paths: `temp_extraction/src/components/screens/MatchResultScreen.jsx`
- Key Symbols: `none`
- Depends On: `subsystem-103-0-src-components`, `subsystem-146-0-temp-extraction`, `subsystem-2-0-src-components`, `subsystem-29-0-src-components`, `subsystem-50-0-temp-extraction`, `subsystem-53-0-src-app-jsx`, `subsystem-62-0-src-components`, `subsystem-69-0-src-components`, `subsystem-88-0-src-components`, `subsystem-98-0-temp-extraction`
- Depended On By: `subsystem-131-0-temp-extraction`
- Responsibilities: none
- Evidence: temp_extraction/src/components/screens/MatchResultScreen.jsx:temp_extraction/src/components/screens/MatchResultScreen.jsx, temp_extraction/src/App.jsx:imports, temp_extraction/src/components/screens/MatchResultScreen.jsx:calls

### temp_extraction [MEDIUM]

- Kind: `ui`
- Summary: temp_extraction is a ui subsystem covering 1 paths and 0 symbols; strongest evidence: calls x9, imports x4.
- Paths: `temp_extraction/src/components/screens/PlayerComparisonModal.jsx`
- Key Symbols: `none`
- Depends On: `subsystem-103-0-src-components`, `subsystem-104-0-src-components`, `subsystem-2-0-src-components`, `subsystem-29-0-src-components`, `subsystem-53-0-src-app-jsx`, `subsystem-76-0-src-components`, `subsystem-98-0-temp-extraction`
- Depended On By: `subsystem-131-0-temp-extraction`
- Responsibilities: none
- Evidence: temp_extraction/src/components/screens/PlayerComparisonModal.jsx:temp_extraction/src/components/screens/PlayerComparisonModal.jsx, temp_extraction/src/App.jsx:imports, temp_extraction/src/components/screens/PlayerComparisonModal.jsx:calls

### temp_extraction [MEDIUM]

- Kind: `ui`
- Summary: temp_extraction is a ui subsystem covering 1 paths and 0 symbols; strongest evidence: calls x10, imports x6.
- Paths: `temp_extraction/src/components/screens/ScorecardScreen.jsx`
- Key Symbols: `none`
- Depends On: `subsystem-145-0-temp-extraction`, `subsystem-151-0-src-components`, `subsystem-29-0-src-components`, `subsystem-53-0-src-app-jsx`, `subsystem-62-0-src-components`, `subsystem-7-0-src-components`, `subsystem-70-0-src-components`, `subsystem-87-0-temp-extraction`, `subsystem-88-0-src-components`, `subsystem-98-0-temp-extraction`
- Depended On By: `subsystem-131-0-temp-extraction`
- Responsibilities: none
- Evidence: temp_extraction/src/components/screens/ScorecardScreen.jsx:temp_extraction/src/components/screens/ScorecardScreen.jsx, temp_extraction/src/App.jsx:imports, temp_extraction/src/components/screens/ScorecardScreen.jsx:calls

### temp_extraction [MEDIUM]

- Kind: `ui`
- Summary: temp_extraction is a ui subsystem covering 1 paths and 0 symbols; strongest evidence: calls x33, imports x3.
- Paths: `temp_extraction/src/components/screens/SelectorsScreen.jsx`
- Key Symbols: `none`
- Depends On: `subsystem-104-0-src-components`, `subsystem-150-0-src-components`, `subsystem-153-0-src-components`, `subsystem-161-0-src-components`, `subsystem-167-0-src-components`, `subsystem-2-0-src-components`, `subsystem-24-0-src-components`, `subsystem-32-0-src-components`, `subsystem-33-0-src-components`, `subsystem-53-0-src-app-jsx`, `subsystem-77-0-src-components`, `subsystem-88-0-src-components`, `subsystem-97-0-temp-extraction`, `subsystem-98-0-temp-extraction`
- Depended On By: `subsystem-131-0-temp-extraction`
- Responsibilities: none
- Evidence: temp_extraction/src/components/screens/SelectorsScreen.jsx:temp_extraction/src/components/screens/SelectorsScreen.jsx, temp_extraction/src/App.jsx:imports, temp_extraction/src/components/screens/SelectorsScreen.jsx:calls

### temp_extraction [MEDIUM]

- Kind: `ui`
- Summary: temp_extraction is a ui subsystem covering 1 paths and 0 symbols; strongest evidence: calls x14, imports x5.
- Paths: `temp_extraction/src/components/Sidebar.jsx`
- Key Symbols: `none`
- Depends On: `subsystem-145-0-temp-extraction`, `subsystem-29-0-src-components`, `subsystem-47-0-src-components`, `subsystem-53-0-src-app-jsx`, `subsystem-6-0-src-components`, `subsystem-78-0-src-components`, `subsystem-88-0-src-components`, `subsystem-98-0-temp-extraction`
- Depended On By: `subsystem-131-0-temp-extraction`
- Responsibilities: none
- Evidence: temp_extraction/src/components/Sidebar.jsx:temp_extraction/src/components/Sidebar.jsx, temp_extraction/src/App.jsx:imports, temp_extraction/src/components/Sidebar.jsx:calls

### temp_extraction [MEDIUM]

- Kind: `ui`
- Summary: temp_extraction is a ui subsystem covering 1 paths and 0 symbols; strongest evidence: imports x12, contains x3.
- Paths: `temp_extraction/src/components/ui/Badge.jsx`
- Key Symbols: `none`
- Depends On: `subsystem-53-0-src-app-jsx`, `subsystem-86-0-src-components`
- Depended On By: `subsystem-118-0-temp-extraction`, `subsystem-119-0-temp-extraction`, `subsystem-132-0-temp-extraction`, `subsystem-133-0-temp-extraction`, `subsystem-137-0-temp-extraction`, `subsystem-139-0-temp-extraction`, `subsystem-142-0-temp-extraction`, `subsystem-144-0-temp-extraction`, `subsystem-26-0-temp-extraction`, `subsystem-64-0-temp-extraction`, `subsystem-72-0-temp-extraction`
- Responsibilities: none
- Evidence: temp_extraction/src/components/ui/Badge.jsx:temp_extraction/src/components/ui/Badge.jsx, temp_extraction/src/components/DrawerMenu.jsx:imports, temp_extraction/src/components/Header.jsx:imports

### temp_extraction [MEDIUM]

- Kind: `ui`
- Summary: temp_extraction is a ui subsystem covering 1 paths and 0 symbols; strongest evidence: calls x14, imports x5.
- Paths: `temp_extraction/src/components/ui/MatchMediaReport.jsx`
- Key Symbols: `none`
- Depends On: `subsystem-103-0-src-components`, `subsystem-29-0-src-components`, `subsystem-50-0-temp-extraction`, `subsystem-53-0-src-app-jsx`, `subsystem-58-0-src-components`, `subsystem-69-0-src-components`, `subsystem-70-0-src-components`, `subsystem-88-0-src-components`
- Depended On By: `subsystem-138-0-temp-extraction`, `subsystem-140-0-temp-extraction`
- Responsibilities: Exposes 1 interface candidate.
- Evidence: temp_extraction/src/components/ui/MatchMediaReport.jsx:temp_extraction/src/components/ui/MatchMediaReport.jsx, temp_extraction/src/components/screens/MatchDetailScreen.jsx:imports, temp_extraction/src/components/screens/MatchResultScreen.jsx:imports

### temp_extraction [MEDIUM]

- Kind: `module`
- Summary: temp_extraction is a module subsystem covering 1 paths and 0 symbols; strongest evidence: contains x5, calls x4.
- Paths: `temp_extraction/src/engine/cricketStateMachine.js`
- Key Symbols: `none`
- Depends On: `subsystem-148-0-temp-extraction`, `subsystem-23-0-src-engine`
- Depended On By: `none`
- Responsibilities: none
- Evidence: temp_extraction/src/engine/cricketStateMachine.js:temp_extraction/src/engine/cricketStateMachine.js, temp_extraction/src/engine/cricketStateMachine.js:calls, temp_extraction/src/engine/cricketStateMachine.js:calls

### temp_extraction [MEDIUM]

- Kind: `module`
- Summary: temp_extraction is a module subsystem covering 1 paths and 0 symbols; strongest evidence: calls x84, imports x4.
- Paths: `temp_extraction/src/engine/validationSchemas.js`
- Key Symbols: `none`
- Depends On: `subsystem-13-0-src-engine`, `subsystem-16-0-src-components`, `subsystem-23-0-src-engine`
- Depended On By: `subsystem-11-0-src-components`, `subsystem-147-0-temp-extraction`, `subsystem-2-0-src-components`
- Responsibilities: none
- Evidence: temp_extraction/src/engine/validationSchemas.js:temp_extraction/src/engine/validationSchemas.js, temp_extraction/src/components/screens/PlayerRegistrationScreen.jsx:imports, temp_extraction/src/components/screens/ScoringScreen.jsx:imports

### src/App.jsx [MEDIUM]

- Kind: `module`
- Summary: src/App.jsx is a module subsystem covering 1 paths and 1 symbols; strongest evidence: calls x3.
- Paths: `src/App.jsx`
- Key Symbols: `useLocation`
- Depends On: `none`
- Depended On By: `subsystem-1-0-src-context`, `subsystem-53-0-src-app-jsx`, `subsystem-98-0-temp-extraction`
- Responsibilities: Primary symbols: call_reference x1.; Exposes 1 interface candidate.
- Evidence: src/App.jsx:useLocation, src/context/CricketContext.jsx:calls, temp_extraction/src/context/CricketContext.jsx:calls

### src/components [MEDIUM]

- Kind: `ui`
- Summary: src/components is a ui subsystem covering 1 paths and 1 symbols; strongest evidence: calls x51.
- Paths: `src/components/CricketIcons.jsx`
- Key Symbols: `toLowerCase`
- Depends On: `none`
- Depended On By: `subsystem-118-0-temp-extraction`, `subsystem-143-0-temp-extraction`, `subsystem-19-0-src-components`, `subsystem-22-0-src-components`, `subsystem-24-0-src-components`, `subsystem-26-0-temp-extraction`, `subsystem-3-0-src-components`, `subsystem-30-0-src-components`, `subsystem-32-0-src-components`, `subsystem-33-0-src-components`, `subsystem-42-0-temp-extraction`, `subsystem-51-0-src-components`, `subsystem-54-0-src-components`, `subsystem-6-0-src-components`, `subsystem-77-0-src-components`, `subsystem-9-0-src-components`
- Responsibilities: Primary symbols: call_reference x1.
- Evidence: src/components/CricketIcons.jsx:toLowerCase, src/components/CricketIcons.jsx:calls, src/components/screens/HomeScreen.jsx:calls

### src/components [MEDIUM]

- Kind: `ui`
- Summary: src/components is a ui subsystem covering 1 paths and 1 symbols; strongest evidence: calls x4.
- Paths: `src/components/CricketIllustrations.jsx`
- Key Symbols: `Bat`
- Depends On: `none`
- Depended On By: `subsystem-142-0-temp-extraction`, `subsystem-35-0-src-components`, `subsystem-70-0-src-components`
- Responsibilities: Primary symbols: call_reference x1.
- Evidence: src/components/CricketIllustrations.jsx:Bat, src/components/CricketIllustrations.jsx:calls, src/components/screens/ScorecardScreen.jsx:calls

### src/components [MEDIUM]

- Kind: `ui`
- Summary: src/components is a ui subsystem covering 1 paths and 1 symbols; strongest evidence: calls x8.
- Paths: `src/components/DrawerMenu.jsx`
- Key Symbols: `setIsAuthenticated`
- Depends On: `none`
- Depended On By: `subsystem-125-0-temp-extraction`, `subsystem-47-0-src-components`, `subsystem-5-0-src-context`
- Responsibilities: Primary symbols: call_reference x1.
- Evidence: src/components/DrawerMenu.jsx:setIsAuthenticated, src/components/DrawerMenu.jsx:calls, src/components/Sidebar.jsx:calls

### src/components [MEDIUM]

- Kind: `ui`
- Summary: src/components is a ui subsystem covering 1 paths and 1 symbols; strongest evidence: calls x8.
- Paths: `src/components/NotificationPrompt.jsx`
- Key Symbols: `replace`
- Depends On: `none`
- Depended On By: `subsystem-118-0-temp-extraction`, `subsystem-143-0-temp-extraction`, `subsystem-26-0-temp-extraction`, `subsystem-28-0-src-components`, `subsystem-32-0-src-components`, `subsystem-6-0-src-components`, `subsystem-77-0-src-components`
- Responsibilities: Primary symbols: call_reference x1.
- Evidence: src/components/NotificationPrompt.jsx:replace, src/components/screens/PlayersScreen.jsx:calls, src/components/screens/PlayersScreen.jsx:calls

### src/components [MEDIUM]

- Kind: `ui`
- Summary: src/components is a ui subsystem covering 1 paths and 1 symbols; strongest evidence: calls x4.
- Paths: `src/components/screens/AdministrationScreen.jsx`
- Key Symbols: `console.warn`
- Depends On: `none`
- Depended On By: `subsystem-1-0-src-context`, `subsystem-5-0-src-context`, `subsystem-7-0-src-components`
- Responsibilities: Primary symbols: call_reference x1.
- Evidence: src/components/screens/AdministrationScreen.jsx:console.warn, src/components/screens/AdministrationScreen.jsx:calls, src/context/CricketContext.jsx:calls

### src/components [MEDIUM]

- Kind: `ui`
- Summary: src/components is a ui subsystem covering 1 paths and 1 symbols; strongest evidence: calls x10.
- Paths: `src/components/screens/HomeScreen.jsx`
- Key Symbols: `formatOvers`
- Depends On: `none`
- Depended On By: `subsystem-1-0-src-context`, `subsystem-2-0-src-components`, `subsystem-22-0-src-components`
- Responsibilities: Primary symbols: call_reference x1.
- Evidence: src/components/screens/HomeScreen.jsx:formatOvers, src/components/screens/HomeScreen.jsx:calls, src/components/screens/HomeScreen.jsx:calls

### src/components [MEDIUM]

- Kind: `ui`
- Summary: src/components is a ui subsystem covering 1 paths and 1 symbols; strongest evidence: calls x3.
- Paths: `src/components/screens/HomeScreen.jsx`
- Key Symbols: `setDistrictFilter`
- Depends On: `none`
- Depended On By: `subsystem-22-0-src-components`, `subsystem-32-0-src-components`
- Responsibilities: Primary symbols: call_reference x1.
- Evidence: src/components/screens/HomeScreen.jsx:setDistrictFilter, src/components/screens/HomeScreen.jsx:calls, src/components/screens/HomeScreen.jsx:calls

### src/components [MEDIUM]

- Kind: `ui`
- Summary: src/components is a ui subsystem covering 1 paths and 1 symbols; strongest evidence: calls x6.
- Paths: `src/components/screens/HomeScreen.jsx`
- Key Symbols: `toFixed`
- Depends On: `none`
- Depended On By: `subsystem-137-0-temp-extraction`, `subsystem-22-0-src-components`, `subsystem-6-0-src-components`, `subsystem-84-0-src-components`
- Responsibilities: Primary symbols: call_reference x1.
- Evidence: src/components/screens/HomeScreen.jsx:toFixed, src/components/screens/HomeScreen.jsx:calls, src/components/screens/InningsBreakScreen.jsx:calls

### src/components [MEDIUM]

- Kind: `ui`
- Summary: src/components is a ui subsystem covering 1 paths and 1 symbols; strongest evidence: calls x6.
- Paths: `src/components/screens/InningsBreakScreen.jsx`
- Key Symbols: `setInnings`
- Depends On: `none`
- Depended On By: `subsystem-1-0-src-context`, `subsystem-84-0-src-components`
- Responsibilities: Primary symbols: call_reference x1.
- Evidence: src/components/screens/InningsBreakScreen.jsx:setInnings, src/components/screens/InningsBreakScreen.jsx:calls, temp_extraction/src/components/screens/InningsBreakScreen.jsx:calls

### src/components [MEDIUM]

- Kind: `ui`
- Summary: src/components is a ui subsystem covering 1 paths and 1 symbols; strongest evidence: calls x14.
- Paths: `src/components/screens/InningsInitScreen.jsx`
- Key Symbols: `players.map`
- Depends On: `none`
- Depended On By: `subsystem-113-0-src-components`, `subsystem-26-0-temp-extraction`, `subsystem-3-0-src-components`, `subsystem-44-0-src-components`, `subsystem-51-0-src-components`, `subsystem-8-0-src-components`, `subsystem-94-0-src-components`, `subsystem-95-0-src-components`
- Responsibilities: Primary symbols: call_reference x1.
- Evidence: src/components/screens/InningsInitScreen.jsx:players.map, src/components/screens/InningsInitScreen.jsx:calls, src/components/screens/MatchSetupScreen.jsx:calls

### src/components [MEDIUM]

- Kind: `ui`
- Summary: src/components is a ui subsystem covering 1 paths and 1 symbols; strongest evidence: calls x19.
- Paths: `src/components/screens/MatchSetupScreen.jsx`
- Key Symbols: `Select`
- Depends On: `none`
- Depended On By: `subsystem-21-0-src-components`, `subsystem-24-0-src-components`, `subsystem-3-0-src-components`, `subsystem-5-0-src-context`
- Responsibilities: Primary symbols: call_reference x1.
- Evidence: src/components/screens/MatchSetupScreen.jsx:Select, src/components/screens/MatchSetupScreen.jsx:calls, src/components/screens/TeamRegistrationTab.jsx:calls

### src/components [MEDIUM]

- Kind: `ui`
- Summary: src/components is a ui subsystem covering 1 paths and 1 symbols; strongest evidence: calls x10.
- Paths: `src/components/screens/PlayerProfileScreen.jsx`
- Key Symbols: `toggleShortlist`
- Depends On: `none`
- Depended On By: `subsystem-118-0-temp-extraction`, `subsystem-143-0-temp-extraction`, `subsystem-26-0-temp-extraction`, `subsystem-30-0-src-components`, `subsystem-33-0-src-components`, `subsystem-56-0-src-components`, `subsystem-59-0-temp-extraction`, `subsystem-77-0-src-components`, `subsystem-97-0-temp-extraction`
- Responsibilities: Primary symbols: call_reference x1.
- Evidence: src/components/screens/PlayerProfileScreen.jsx:toggleShortlist, src/components/screens/PlayerProfileScreen.jsx:calls, src/components/screens/ScoutingHubScreen.jsx:calls

### src/components [MEDIUM]

- Kind: `ui`
- Summary: src/components is a ui subsystem covering 1 paths and 1 symbols; strongest evidence: calls x7.
- Paths: `src/components/screens/PlayerRegistrationScreen.jsx`
- Key Symbols: `JDCA_DISTRICTS.map`
- Depends On: `none`
- Depended On By: `subsystem-11-0-src-components`, `subsystem-118-0-temp-extraction`, `subsystem-24-0-src-components`, `subsystem-26-0-temp-extraction`, `subsystem-30-0-src-components`, `subsystem-32-0-src-components`
- Responsibilities: Primary symbols: call_reference x1.
- Evidence: src/components/screens/PlayerRegistrationScreen.jsx:JDCA_DISTRICTS.map, src/components/screens/PlayerRegistrationScreen.jsx:calls, src/components/screens/PlayersScreen.jsx:calls

### src/components [MEDIUM]

- Kind: `ui`
- Summary: src/components is a ui subsystem covering 1 paths and 1 symbols; strongest evidence: calls x5.
- Paths: `src/components/screens/PlayerRegistrationScreen.jsx`
- Key Symbols: `None`
- Depends On: `none`
- Depended On By: `subsystem-1-0-src-context`, `subsystem-11-0-src-components`
- Responsibilities: Primary symbols: call_reference x1.
- Evidence: src/components/screens/PlayerRegistrationScreen.jsx:None, src/components/screens/PlayerRegistrationScreen.jsx:calls, src/components/screens/PlayerRegistrationScreen.jsx:calls

### src/components [MEDIUM]

- Kind: `ui`
- Summary: src/components is a ui subsystem covering 1 paths and 1 symbols; strongest evidence: calls x2.
- Paths: `src/components/screens/PlayerRegistrationScreen.jsx`
- Key Symbols: `setGender`
- Depends On: `none`
- Depended On By: `subsystem-11-0-src-components`, `subsystem-57-0-src-components`
- Responsibilities: Primary symbols: call_reference x1.
- Evidence: src/components/screens/PlayerRegistrationScreen.jsx:setGender, src/components/screens/PlayerRegistrationScreen.jsx:calls, src/components/selection/CreateTeamModal.jsx:calls

### src/components [MEDIUM]

- Kind: `ui`
- Summary: src/components is a ui subsystem covering 1 paths and 1 symbols; strongest evidence: calls x14.
- Paths: `src/components/screens/PlayersScreen.jsx`
- Key Symbols: `setSelectedPlayer`
- Depends On: `none`
- Depended On By: `subsystem-1-0-src-context`, `subsystem-180-0-src-components`, `subsystem-32-0-src-components`, `subsystem-5-0-src-context`
- Responsibilities: Primary symbols: call_reference x1.
- Evidence: src/components/screens/PlayersScreen.jsx:setSelectedPlayer, src/components/screens/PlayersScreen.jsx:calls, src/components/screens/ScoutingHubScreen.jsx:calls

### src/components [MEDIUM]

- Kind: `ui`
- Summary: src/components is a ui subsystem covering 1 paths and 1 symbols; strongest evidence: calls x4.
- Paths: `src/components/screens/ScoringScreen.jsx`
- Key Symbols: `haptics.medium`
- Depends On: `none`
- Depended On By: `subsystem-2-0-src-components`, `subsystem-71-0-src-components`
- Responsibilities: Primary symbols: call_reference x1.
- Evidence: src/components/screens/ScoringScreen.jsx:haptics.medium, src/components/screens/ScoringScreen.jsx:calls, src/components/screens/ScoringScreen.jsx:calls

### src/components [MEDIUM]

- Kind: `ui`
- Summary: src/components is a ui subsystem covering 1 paths and 1 symbols; strongest evidence: calls x7.
- Paths: `src/components/screens/ScoringScreen.jsx`
- Key Symbols: `name.split`
- Depends On: `none`
- Depended On By: `subsystem-118-0-temp-extraction`, `subsystem-143-0-temp-extraction`, `subsystem-2-0-src-components`, `subsystem-3-0-src-components`, `subsystem-30-0-src-components`, `subsystem-77-0-src-components`, `subsystem-9-0-src-components`
- Responsibilities: Primary symbols: call_reference x1.
- Evidence: src/components/screens/ScoringScreen.jsx:name.split, src/components/screens/ScoringScreen.jsx:calls, src/components/screens/SelectionScreen.jsx:calls

### src/components [MEDIUM]

- Kind: `ui`
- Summary: src/components is a ui subsystem covering 1 paths and 1 symbols; strongest evidence: calls x15.
- Paths: `src/components/screens/ScoringScreen.jsx`
- Key Symbols: `setValidationError`
- Depends On: `none`
- Depended On By: `subsystem-1-0-src-context`, `subsystem-2-0-src-components`, `subsystem-98-0-temp-extraction`
- Responsibilities: Primary symbols: call_reference x1.
- Evidence: src/components/screens/ScoringScreen.jsx:setValidationError, src/components/screens/ScoringScreen.jsx:calls, src/context/CricketContext.jsx:calls

### src/components [MEDIUM]

- Kind: `ui`
- Summary: src/components is a ui subsystem covering 1 paths and 1 symbols; strongest evidence: calls x14.
- Paths: `src/components/screens/SelectorAssignmentModal.jsx`
- Key Symbols: `e.stopPropagation`
- Depends On: `none`
- Depended On By: `subsystem-15-0-src-components`, `subsystem-26-0-temp-extraction`, `subsystem-31-0-src-components`, `subsystem-44-0-src-components`, `subsystem-48-0-src-components`, `subsystem-51-0-src-components`, `subsystem-81-0-src-components`, `subsystem-9-0-src-components`, `subsystem-95-0-src-components`
- Responsibilities: Primary symbols: call_reference x1.
- Evidence: src/components/screens/SelectorAssignmentModal.jsx:e.stopPropagation, src/components/screens/SelectorAssignmentModal.jsx:calls, src/components/screens/TeamsScreen.jsx:calls

### src/components [MEDIUM]

- Kind: `ui`
- Summary: src/components is a ui subsystem covering 1 paths and 1 symbols; strongest evidence: calls x5.
- Paths: `src/components/screens/SelectorAssignmentModal.jsx`
- Key Symbols: `onClose`
- Depends On: `none`
- Depended On By: `subsystem-114-0-src-components`, `subsystem-31-0-src-components`, `subsystem-65-0-src-components`
- Responsibilities: Primary symbols: call_reference x1.
- Evidence: src/components/screens/SelectorAssignmentModal.jsx:onClose, src/components/ui/BottomSheet.jsx:calls, src/components/selection/CreateTeamModal.jsx:calls

### src/components [MEDIUM]

- Kind: `ui`
- Summary: src/components is a ui subsystem covering 1 paths and 1 symbols; strongest evidence: calls x2.
- Paths: `src/components/screens/TeamRegistrationTab.jsx`
- Key Symbols: `teams.filter`
- Depends On: `none`
- Depended On By: `subsystem-24-0-src-components`, `subsystem-45-0-src-components`
- Responsibilities: Primary symbols: call_reference x1.
- Evidence: src/components/screens/TeamRegistrationTab.jsx:teams.filter, src/components/screens/TeamRegistrationTab.jsx:calls, src/components/ui/TournamentManagerModal.jsx:calls

### src/components [MEDIUM]

- Kind: `ui`
- Summary: src/components is a ui subsystem covering 1 paths and 1 symbols; strongest evidence: calls x4.
- Paths: `src/components/screens/TeamRegistrationTab.jsx`
- Key Symbols: `toString`
- Depends On: `none`
- Depended On By: `subsystem-1-0-src-context`, `subsystem-181-0-src-components`, `subsystem-21-0-src-components`
- Responsibilities: Primary symbols: call_reference x1.
- Evidence: src/components/screens/TeamRegistrationTab.jsx:toString, src/components/screens/TeamRegistrationTab.jsx:calls, src/components/ui/TournamentManagerModal.jsx:calls

### src/components [MEDIUM]

- Kind: `ui`
- Summary: src/components is a ui subsystem covering 1 paths and 1 symbols; strongest evidence: calls x4.
- Paths: `src/components/screens/TeamsScreen.jsx`
- Key Symbols: `padStart`
- Depends On: `none`
- Depended On By: `subsystem-15-0-src-components`, `subsystem-42-0-temp-extraction`, `subsystem-60-0-temp-extraction`, `subsystem-9-0-src-components`
- Responsibilities: Primary symbols: call_reference x1.
- Evidence: src/components/screens/TeamsScreen.jsx:padStart, src/components/screens/TeamsScreen.jsx:calls, src/components/screens/TournamentsScreen.jsx:calls

### src/components [MEDIUM]

- Kind: `ui`
- Summary: src/components is a ui subsystem covering 1 paths and 1 symbols; strongest evidence: calls x7.
- Paths: `src/components/selection/CreateTeamModal.jsx`
- Key Symbols: `Date.now`
- Depends On: `none`
- Depended On By: `subsystem-1-0-src-context`, `subsystem-181-0-src-components`, `subsystem-65-0-src-components`, `subsystem-7-0-src-components`
- Responsibilities: Primary symbols: call_reference x1.
- Evidence: src/components/selection/CreateTeamModal.jsx:Date.now, temp_extraction/src/components/screens/AdministrationScreen.jsx:calls, src/components/selection/CreateTeamModal.jsx:calls

### src/components [MEDIUM]

- Kind: `ui`
- Summary: src/components is a ui subsystem covering 1 paths and 1 symbols; strongest evidence: calls x1.
- Paths: `src/components/selection/SelectedTeam.jsx`
- Key Symbols: `onUpdateTeamRoles`
- Depends On: `none`
- Depended On By: `subsystem-7-0-src-components`
- Responsibilities: Primary symbols: call_reference x1.
- Evidence: src/components/selection/SelectedTeam.jsx:onUpdateTeamRoles, src/components/selection/SelectedTeam.jsx:calls

### src/components [MEDIUM]

- Kind: `ui`
- Summary: src/components is a ui subsystem covering 1 paths and 1 symbols; strongest evidence: calls x12.
- Paths: `src/components/selection/selectionData.js`
- Key Symbols: `map`
- Depends On: `none`
- Depended On By: `subsystem-0-0-src-lib`, `subsystem-16-0-src-components`, `subsystem-18-0-src-lib`, `subsystem-67-0-src-lib`
- Responsibilities: Primary symbols: call_reference x1.
- Evidence: src/components/selection/selectionData.js:map, src/lib/api.js:calls, src/lib/api.js:calls

### src/components [MEDIUM]

- Kind: `ui`
- Summary: src/components is a ui subsystem covering 1 paths and 1 symbols; strongest evidence: imports x3.
- Paths: `src/components/selection/SelectionWorkspace.jsx`
- Key Symbols: `canvas-confetti`
- Depends On: `none`
- Depended On By: `subsystem-1-0-src-context`, `subsystem-19-0-src-components`, `subsystem-98-0-temp-extraction`
- Responsibilities: Primary symbols: import_reference x1.
- Evidence: src/components/selection/SelectionWorkspace.jsx:canvas-confetti, src/components/selection/SelectionWorkspace.jsx:imports, src/context/CricketContext.jsx:imports

### src/engine [MEDIUM]

- Kind: `module`
- Summary: src/engine is a module subsystem covering 1 paths and 1 symbols; strongest evidence: calls x10.
- Paths: `src/engine/validationSchemas.js`
- Key Symbols: `Date`
- Depends On: `none`
- Depended On By: `subsystem-0-0-src-lib`, `subsystem-13-0-src-engine`
- Responsibilities: Primary symbols: call_reference x1.
- Evidence: src/engine/validationSchemas.js:Date, src/engine/validationSchemas.js:calls, src/lib/api.js:calls

### temp_extraction [MEDIUM]

- Kind: `ui`
- Summary: temp_extraction is a ui subsystem covering 1 paths and 1 symbols; strongest evidence: calls x3.
- Paths: `temp_extraction/src/components/screens/PlayerRegistrationScreen.jsx`
- Key Symbols: `AGE_CATEGORIES.map`
- Depends On: `none`
- Depended On By: `subsystem-11-0-src-components`, `subsystem-118-0-temp-extraction`, `subsystem-26-0-temp-extraction`
- Responsibilities: Primary symbols: call_reference x1.
- Evidence: temp_extraction/src/components/screens/PlayerRegistrationScreen.jsx:AGE_CATEGORIES.map, temp_extraction/src/components/screens/PlayerRegistrationScreen.jsx:calls, temp_extraction/src/components/screens/PlayersScreen.jsx:calls

### src/components [MEDIUM]

- Kind: `ui`
- Summary: src/components is a ui subsystem covering 1 paths and 1 symbols; strongest evidence: calls x5, contains x1.
- Paths: `src/components/screens/SelectionScreen.jsx`
- Key Symbols: `handleOpenComparison()`
- Depends On: `subsystem-103-0-src-components`, `subsystem-165-0-src-components`, `subsystem-76-0-src-components`
- Depended On By: `subsystem-30-0-src-components`
- Responsibilities: Primary symbols: function x1.
- Evidence: src/components/screens/SelectionScreen.jsx:handleOpenComparison(), src/components/screens/SelectionScreen.jsx:calls, src/components/screens/SelectionScreen.jsx:contains

### src/components [MEDIUM]

- Kind: `ui`
- Summary: src/components is a ui subsystem covering 1 paths and 1 symbols; strongest evidence: calls x3, contains x1.
- Paths: `src/components/ui/TournamentManagerModal.jsx`
- Key Symbols: `addMatchRow()`
- Depends On: `subsystem-172-0-src-components`, `subsystem-174-0-src-components`, `subsystem-63-0-src-components`
- Depended On By: `subsystem-45-0-src-components`
- Responsibilities: Primary symbols: function x1.
- Evidence: src/components/ui/TournamentManagerModal.jsx:addMatchRow(), src/components/ui/TournamentManagerModal.jsx:contains, src/components/ui/TournamentManagerModal.jsx:calls

## Interfaces

- `BIN` [HIGH] in `subsystem-0-0-src-lib` as `route` from `src/lib/api.js`.
  Evidence: src/lib/api.js:BIN, src/lib/api.js:calls
- `Error` [HIGH] in `subsystem-0-0-src-lib` as `route` from `src/lib/api.js`.
  Evidence: src/lib/api.js:Error, src/lib/api.js:calls, src/lib/api.js:calls
- `None` [HIGH] in `subsystem-0-0-src-lib` as `route` from `src/lib/api.js`.
  Evidence: src/lib/api.js:None, src/lib/api.js:calls, temp_extraction/src/data/mockData.js:calls
- `Promise.all` [HIGH] in `subsystem-0-0-src-lib` as `route` from `src/lib/api.js`.
  Evidence: src/lib/api.js:Promise.all, src/lib/api.js:calls, src/lib/api.js:calls
- `ageCategories.forEach` [HIGH] in `subsystem-0-0-src-lib` as `route` from `src/lib/api.js`.
  Evidence: src/lib/api.js:ageCategories.forEach, src/lib/api.js:calls
- `age_category_id` [HIGH] in `subsystem-0-0-src-lib` as `route` from `src/lib/api.js`.
  Evidence: src/lib/api.js:age_category_id, src/lib/api.js:calls, src/lib/api.js:calls
- `assignManOfTheMatch` [HIGH] in `subsystem-0-0-src-lib` as `route` from `src/lib/api.js`.
  Evidence: src/lib/api.js:assignManOfTheMatch, src/lib/api.js:calls
- `assignScorer` [HIGH] in `subsystem-0-0-src-lib` as `route` from `src/lib/api.js`.
  Evidence: src/lib/api.js:assignScorer, src/lib/api.js:calls
- `assignments.map` [HIGH] in `subsystem-0-0-src-lib` as `route` from `src/lib/api.js`.
  Evidence: src/lib/api.js:assignments.map, src/lib/api.js:calls
- `away_team_id` [HIGH] in `subsystem-0-0-src-lib` as `route` from `src/lib/api.js`.
  Evidence: src/lib/api.js:away_team_id, src/lib/api.js:calls, src/lib/api.js:calls
- `bowler_id` [HIGH] in `subsystem-0-0-src-lib` as `route` from `src/lib/api.js`.
  Evidence: src/lib/api.js:bowler_id, src/lib/api.js:calls, src/lib/api.js:calls
- `bulkMigratePlayers` [HIGH] in `subsystem-0-0-src-lib` as `route` from `src/lib/api.js`.
  Evidence: src/lib/api.js:bulkMigratePlayers, src/lib/api.js:calls
- `console.warn` [HIGH] in `subsystem-0-0-src-lib` as `route` from `src/lib/api.js`.
  Evidence: src/lib/api.js:console.warn, src/lib/api.js:calls, src/lib/supabase.js:calls
- `createAnnouncement` [HIGH] in `subsystem-0-0-src-lib` as `route` from `src/lib/api.js`.
  Evidence: src/lib/api.js:createAnnouncement, src/lib/api.js:calls
- `createDetailedMatches` [HIGH] in `subsystem-0-0-src-lib` as `route` from `src/lib/api.js`.
  Evidence: src/lib/api.js:createDetailedMatches, src/lib/api.js:calls
- `createSeason` [HIGH] in `subsystem-0-0-src-lib` as `route` from `src/lib/api.js`.
  Evidence: src/lib/api.js:createSeason, src/lib/api.js:calls
- `createTeam` [HIGH] in `subsystem-0-0-src-lib` as `route` from `src/lib/api.js`.
  Evidence: src/lib/api.js:createTeam, src/lib/api.js:calls
- `createTournament` [HIGH] in `subsystem-0-0-src-lib` as `route` from `src/lib/api.js`.
  Evidence: src/lib/api.js:createTournament, src/lib/api.js:calls
- `data.forEach` [HIGH] in `subsystem-0-0-src-lib` as `route` from `src/lib/api.js`.
  Evidence: src/lib/api.js:data.forEach, src/lib/api.js:calls, src/lib/api.js:calls
- `data.map` [HIGH] in `subsystem-0-0-src-lib` as `route` from `src/lib/api.js`.
  Evidence: src/lib/api.js:data.map, src/lib/api.js:calls, src/lib/api.js:calls
- `deleteAnnouncement` [HIGH] in `subsystem-0-0-src-lib` as `route` from `src/lib/api.js`.
  Evidence: src/lib/api.js:deleteAnnouncement, src/lib/api.js:calls
- `deleteMatch` [HIGH] in `subsystem-0-0-src-lib` as `route` from `src/lib/api.js`.
  Evidence: src/lib/api.js:deleteMatch, src/lib/api.js:calls
- `deletePlayer` [HIGH] in `subsystem-0-0-src-lib` as `route` from `src/lib/api.js`.
  Evidence: src/lib/api.js:deletePlayer, src/lib/api.js:calls
- `deleteTournament` [HIGH] in `subsystem-0-0-src-lib` as `route` from `src/lib/api.js`.
  Evidence: src/lib/api.js:deleteTournament, src/lib/api.js:calls
- `deleteUser` [HIGH] in `subsystem-0-0-src-lib` as `route` from `src/lib/api.js`.
  Evidence: src/lib/api.js:deleteUser, src/lib/api.js:calls
- `district_id` [HIGH] in `subsystem-0-0-src-lib` as `route` from `src/lib/api.js`.
  Evidence: src/lib/api.js:district_id, src/lib/api.js:calls, src/lib/api.js:calls
- `districts.forEach` [HIGH] in `subsystem-0-0-src-lib` as `route` from `src/lib/api.js`.
  Evidence: src/lib/api.js:districts.forEach, src/lib/api.js:calls
- `exist` [HIGH] in `subsystem-0-0-src-lib` as `route` from `src/lib/api.js`.
  Evidence: src/lib/api.js:exist, src/lib/api.js:calls
- `existingSet.has` [HIGH] in `subsystem-0-0-src-lib` as `route` from `src/lib/api.js`.
  Evidence: src/lib/api.js:existingSet.has, src/lib/api.js:calls
- `finalizeMatch` [HIGH] in `subsystem-0-0-src-lib` as `route` from `src/lib/api.js`.
  Evidence: src/lib/api.js:finalizeMatch, src/lib/api.js:calls
- `finalizeSquad` [HIGH] in `subsystem-0-0-src-lib` as `route` from `src/lib/api.js`.
  Evidence: src/lib/api.js:finalizeSquad, src/lib/api.js:calls
- `g.substring` [HIGH] in `subsystem-0-0-src-lib` as `route` from `src/lib/api.js`.
  Evidence: src/lib/api.js:g.substring, src/lib/api.js:calls
- `genders.forEach` [HIGH] in `subsystem-0-0-src-lib` as `route` from `src/lib/api.js`.
  Evidence: src/lib/api.js:genders.forEach, src/lib/api.js:calls
- `getActiveSeason` [HIGH] in `subsystem-0-0-src-lib` as `route` from `src/lib/api.js`.
  Evidence: src/lib/api.js:getActiveSeason, src/lib/api.js:calls
- `getAgeCategories` [HIGH] in `subsystem-0-0-src-lib` as `route` from `src/lib/api.js`.
  Evidence: src/lib/api.js:getAgeCategories, src/lib/api.js:calls
- `getAnnouncements` [HIGH] in `subsystem-0-0-src-lib` as `route` from `src/lib/api.js`.
  Evidence: src/lib/api.js:getAnnouncements, src/lib/api.js:calls
- `getDefaults` [HIGH] in `subsystem-0-0-src-lib` as `route` from `src/lib/api.js`.
  Evidence: src/lib/api.js:getDefaults, src/lib/api.js:calls
- `getMatchScorecard` [HIGH] in `subsystem-0-0-src-lib` as `route` from `src/lib/api.js`.
  Evidence: src/lib/api.js:getMatchScorecard, src/lib/api.js:calls
- `getOrCreateInnings` [HIGH] in `subsystem-0-0-src-lib` as `route` from `src/lib/api.js`.
  Evidence: src/lib/api.js:getOrCreateInnings, src/lib/api.js:calls
- `getPlayerMatchStats` [HIGH] in `subsystem-0-0-src-lib` as `route` from `src/lib/api.js`.
  Evidence: src/lib/api.js:getPlayerMatchStats, src/lib/api.js:calls
- `getPlayersBySeason` [HIGH] in `subsystem-0-0-src-lib` as `route` from `src/lib/api.js`.
  Evidence: src/lib/api.js:getPlayersBySeason, src/lib/api.js:calls
- `getProfiles` [HIGH] in `subsystem-0-0-src-lib` as `route` from `src/lib/api.js`.
  Evidence: src/lib/api.js:getProfiles, src/lib/api.js:calls
- `getRecycleBinItems` [HIGH] in `subsystem-0-0-src-lib` as `route` from `src/lib/api.js`.
  Evidence: src/lib/api.js:getRecycleBinItems, src/lib/api.js:calls
- `getSeasons` [HIGH] in `subsystem-0-0-src-lib` as `route` from `src/lib/api.js`.
  Evidence: src/lib/api.js:getSeasons, src/lib/api.js:calls
- `getSelectionCandidates` [HIGH] in `subsystem-0-0-src-lib` as `route` from `src/lib/api.js`.
  Evidence: src/lib/api.js:getSelectionCandidates, src/lib/api.js:calls
- `getSelectionProcesses` [HIGH] in `subsystem-0-0-src-lib` as `route` from `src/lib/api.js`.
  Evidence: src/lib/api.js:getSelectionProcesses, src/lib/api.js:calls
- `getSelectorAssignments` [HIGH] in `subsystem-0-0-src-lib` as `route` from `src/lib/api.js`.
  Evidence: src/lib/api.js:getSelectorAssignments, src/lib/api.js:calls
- `hardDeleteItem` [HIGH] in `subsystem-0-0-src-lib` as `route` from `src/lib/api.js`.
  Evidence: src/lib/api.js:hardDeleteItem, src/lib/api.js:calls
- `home_team_id` [HIGH] in `subsystem-0-0-src-lib` as `route` from `src/lib/api.js`.
  Evidence: src/lib/api.js:home_team_id, src/lib/api.js:calls, src/lib/api.js:calls
- `hydrateLiveMatch` [HIGH] in `subsystem-0-0-src-lib` as `route` from `src/lib/api.js`.
  Evidence: src/lib/api.js:hydrateLiveMatch, src/lib/api.js:calls
- `insert` [HIGH] in `subsystem-0-0-src-lib` as `route` from `src/lib/api.js`.
  Evidence: src/lib/api.js:insert, src/lib/api.js:calls, src/lib/api.js:calls
- `items.push` [HIGH] in `subsystem-0-0-src-lib` as `route` from `src/lib/api.js`.
  Evidence: src/lib/api.js:items.push, src/lib/api.js:calls, src/lib/api.js:calls
- `items.sort` [HIGH] in `subsystem-0-0-src-lib` as `route` from `src/lib/api.js`.
  Evidence: src/lib/api.js:items.sort, src/lib/api.js:calls
- `limit` [HIGH] in `subsystem-0-0-src-lib` as `route` from `src/lib/api.js`.
  Evidence: src/lib/api.js:limit, src/lib/api.js:calls, src/lib/api.js:calls
- `man_of_the_match_id` [HIGH] in `subsystem-0-0-src-lib` as `route` from `src/lib/api.js`.
  Evidence: src/lib/api.js:man_of_the_match_id, src/lib/api.js:calls
- `matches` [HIGH] in `subsystem-0-0-src-lib` as `route` from `src/lib/api.js`.
  Evidence: src/lib/api.js:matches, src/lib/api.js:calls, src/lib/api.js:calls
- `matchesArray.map` [HIGH] in `subsystem-0-0-src-lib` as `route` from `src/lib/api.js`.
  Evidence: src/lib/api.js:matchesArray.map, src/lib/api.js:calls
- `maybeSingle` [HIGH] in `subsystem-0-0-src-lib` as `route` from `src/lib/api.js`.
  Evidence: src/lib/api.js:maybeSingle, src/lib/api.js:calls, src/lib/api.js:calls
- `message.includes` [HIGH] in `subsystem-0-0-src-lib` as `route` from `src/lib/api.js`.
  Evidence: src/lib/api.js:message.includes, src/lib/api.js:calls
- `name.substring` [HIGH] in `subsystem-0-0-src-lib` as `route` from `src/lib/api.js`.
  Evidence: src/lib/api.js:name.substring, src/lib/api.js:calls
- `name.trim` [HIGH] in `subsystem-0-0-src-lib` as `route` from `src/lib/api.js`.
  Evidence: src/lib/api.js:name.trim, src/lib/api.js:calls
- `neq` [HIGH] in `subsystem-0-0-src-lib` as `route` from `src/lib/api.js`.
  Evidence: src/lib/api.js:neq, src/lib/api.js:calls, src/lib/api.js:calls
- `non_striker_id` [HIGH] in `subsystem-0-0-src-lib` as `route` from `src/lib/api.js`.
  Evidence: src/lib/api.js:non_striker_id, src/lib/api.js:calls
- `not` [HIGH] in `subsystem-0-0-src-lib` as `route` from `src/lib/api.js`.
  Evidence: src/lib/api.js:not, src/lib/api.js:calls, src/lib/api.js:calls
- `on` [HIGH] in `subsystem-0-0-src-lib` as `route` from `src/lib/api.js`.
  Evidence: src/lib/api.js:on, src/lib/api.js:calls
- `order` [HIGH] in `subsystem-0-0-src-lib` as `route` from `src/lib/api.js`.
  Evidence: src/lib/api.js:order, src/lib/api.js:calls, src/lib/api.js:calls
- `participatingTeams.map` [HIGH] in `subsystem-0-0-src-lib` as `route` from `src/lib/api.js`.
  Evidence: src/lib/api.js:participatingTeams.map, src/lib/api.js:calls, src/lib/api.js:calls
- `persistMatchSetup` [HIGH] in `subsystem-0-0-src-lib` as `route` from `src/lib/api.js`.
  Evidence: src/lib/api.js:persistMatchSetup, src/lib/api.js:calls
- `player_id` [HIGH] in `subsystem-0-0-src-lib` as `route` from `src/lib/api.js`.
  Evidence: src/lib/api.js:player_id, src/lib/api.js:calls, src/lib/api.js:calls
- `processMatches()` [HIGH] in `subsystem-0-0-src-lib` as `route` from `src/lib/api.js`.
  Evidence: src/lib/api.js:processMatches(), src/lib/api.js:calls, src/lib/api.js:calls
- `rebuildTeams` [HIGH] in `subsystem-0-0-src-lib` as `route` from `src/lib/api.js`.
  Evidence: src/lib/api.js:rebuildTeams, src/lib/api.js:calls
- `registerPlayer` [HIGH] in `subsystem-0-0-src-lib` as `route` from `src/lib/api.js`.
  Evidence: src/lib/api.js:registerPlayer, src/lib/api.js:calls
- `registrations.map` [HIGH] in `subsystem-0-0-src-lib` as `route` from `src/lib/api.js`.
  Evidence: src/lib/api.js:registrations.map, src/lib/api.js:calls
- `resetUserPassword` [HIGH] in `subsystem-0-0-src-lib` as `route` from `src/lib/api.js`.
  Evidence: src/lib/api.js:resetUserPassword, src/lib/api.js:calls
- `restoreItem` [HIGH] in `subsystem-0-0-src-lib` as `route` from `src/lib/api.js`.
  Evidence: src/lib/api.js:restoreItem, src/lib/api.js:calls
- `select` [HIGH] in `subsystem-0-0-src-lib` as `route` from `src/lib/api.js`.
  Evidence: src/lib/api.js:select, src/lib/api.js:calls, src/lib/api.js:calls
- `selectedPlayerIds.map` [HIGH] in `subsystem-0-0-src-lib` as `route` from `src/lib/api.js`.
  Evidence: src/lib/api.js:selectedPlayerIds.map, src/lib/api.js:calls, src/lib/api.js:calls
- `selection_decisions` [HIGH] in `subsystem-0-0-src-lib` as `route` from `src/lib/api.js`.
  Evidence: src/lib/api.js:selection_decisions, src/lib/api.js:calls
- `selector_assignments` [HIGH] in `subsystem-0-0-src-lib` as `route` from `src/lib/api.js`.
  Evidence: src/lib/api.js:selector_assignments, src/lib/api.js:calls
- `setActiveSeason` [HIGH] in `subsystem-0-0-src-lib` as `route` from `src/lib/api.js`.
  Evidence: src/lib/api.js:setActiveSeason, src/lib/api.js:calls
- `single` [HIGH] in `subsystem-0-0-src-lib` as `route` from `src/lib/api.js`.
  Evidence: src/lib/api.js:single, src/lib/api.js:calls, src/lib/api.js:calls
- `src/lib/api.js` [HIGH] in `subsystem-0-0-src-lib` as `route` from `src/lib/api.js`.
  Evidence: src/lib/api.js:src/lib/api.js, src/components/screens/AdministrationScreen.jsx:imports, src/components/screens/MatchResultScreen.jsx:imports
- `striker_id` [HIGH] in `subsystem-0-0-src-lib` as `route` from `src/lib/api.js`.
  Evidence: src/lib/api.js:striker_id, src/lib/api.js:calls, src/lib/api.js:calls
- `supabase.from` [HIGH] in `subsystem-0-0-src-lib` as `route` from `src/lib/api.js`.
  Evidence: src/lib/api.js:supabase.from, src/lib/api.js:calls, src/lib/api.js:calls
- `teamsToInsert.filter` [HIGH] in `subsystem-0-0-src-lib` as `route` from `src/lib/api.js`.
  Evidence: src/lib/api.js:teamsToInsert.filter, src/lib/api.js:calls
- `teamsToInsert.push` [HIGH] in `subsystem-0-0-src-lib` as `route` from `src/lib/api.js`.
  Evidence: src/lib/api.js:teamsToInsert.push, src/lib/api.js:calls
- `this.getActiveSeason` [HIGH] in `subsystem-0-0-src-lib` as `route` from `src/lib/api.js`.
  Evidence: src/lib/api.js:this.getActiveSeason, src/lib/api.js:calls, src/lib/api.js:calls
- `this.getDefaults` [HIGH] in `subsystem-0-0-src-lib` as `route` from `src/lib/api.js`.
  Evidence: src/lib/api.js:this.getDefaults, src/lib/api.js:calls, src/lib/api.js:calls
- `this.setActiveSeason` [HIGH] in `subsystem-0-0-src-lib` as `route` from `src/lib/api.js`.
  Evidence: src/lib/api.js:this.setActiveSeason, src/lib/api.js:calls
- `toISOString` [HIGH] in `subsystem-0-0-src-lib` as `route` from `src/lib/api.js`.
  Evidence: src/lib/api.js:toISOString, src/lib/api.js:calls, src/lib/api.js:calls
- `toLocaleDateString` [HIGH] in `subsystem-0-0-src-lib` as `route` from `src/lib/api.js`.
  Evidence: src/lib/api.js:toLocaleDateString, src/lib/api.js:calls, src/lib/api.js:calls
- `toLowerCase` [HIGH] in `subsystem-0-0-src-lib` as `route` from `src/lib/api.js`.
  Evidence: src/lib/api.js:toLowerCase, src/lib/api.js:calls, src/lib/api.js:calls
- `toggleCandidate` [HIGH] in `subsystem-0-0-src-lib` as `route` from `src/lib/api.js`.
  Evidence: src/lib/api.js:toggleCandidate, src/lib/api.js:calls
- `update` [HIGH] in `subsystem-0-0-src-lib` as `route` from `src/lib/api.js`.
  Evidence: src/lib/api.js:update, src/lib/api.js:calls, src/lib/api.js:calls
- `updateSelectorAssignments` [HIGH] in `subsystem-0-0-src-lib` as `route` from `src/lib/api.js`.
  Evidence: src/lib/api.js:updateSelectorAssignments, src/lib/api.js:calls
- `updateTournament` [HIGH] in `subsystem-0-0-src-lib` as `route` from `src/lib/api.js`.
  Evidence: src/lib/api.js:updateTournament, src/lib/api.js:calls
- `updateUserPermissions` [HIGH] in `subsystem-0-0-src-lib` as `route` from `src/lib/api.js`.
  Evidence: src/lib/api.js:updateUserPermissions, src/lib/api.js:calls
- `updateUserRole` [HIGH] in `subsystem-0-0-src-lib` as `route` from `src/lib/api.js`.
  Evidence: src/lib/api.js:updateUserRole, src/lib/api.js:calls
- `updateUserStatus` [HIGH] in `subsystem-0-0-src-lib` as `route` from `src/lib/api.js`.
  Evidence: src/lib/api.js:updateUserStatus, src/lib/api.js:calls
- `upsert` [HIGH] in `subsystem-0-0-src-lib` as `route` from `src/lib/api.js`.
  Evidence: src/lib/api.js:upsert, src/lib/api.js:calls
- `api.finalizeMatch` [HIGH] in `subsystem-1-0-src-context` as `route` from `src/context/CricketContext.jsx`.
  Evidence: src/context/CricketContext.jsx:api.finalizeMatch, src/context/CricketContext.jsx:calls
- `api.getSelectionCandidates` [HIGH] in `subsystem-1-0-src-context` as `route` from `src/context/CricketContext.jsx`.
  Evidence: src/context/CricketContext.jsx:api.getSelectionCandidates, src/context/CricketContext.jsx:calls
- `api.hydrateLiveMatch` [HIGH] in `subsystem-1-0-src-context` as `route` from `src/context/CricketContext.jsx`.
  Evidence: src/context/CricketContext.jsx:api.hydrateLiveMatch, src/context/CricketContext.jsx:calls
- `api.toggleCandidate` [HIGH] in `subsystem-1-0-src-context` as `route` from `src/context/CricketContext.jsx`.
  Evidence: src/context/CricketContext.jsx:api.toggleCandidate, src/context/CricketContext.jsx:calls
- `handleRetireBatter()` [HIGH] in `subsystem-1-0-src-context` as `route` from `src/context/CricketContext.jsx`.
  Evidence: src/context/CricketContext.jsx:handleRetireBatter(), src/context/CricketContext.jsx:contains, src/context/CricketContext.jsx:calls
- `markScoringFirstRunDone()` [HIGH] in `subsystem-1-0-src-context` as `cli` from `src/context/CricketContext.jsx`.
  Evidence: src/context/CricketContext.jsx:markScoringFirstRunDone(), src/context/CricketContext.jsx:contains, temp_extraction/src/context/CricketContext.jsx:contains
- `recordRuns()` [HIGH] in `subsystem-1-0-src-context` as `cli` from `src/context/CricketContext.jsx`.
  Evidence: src/context/CricketContext.jsx:recordRuns(), src/context/CricketContext.jsx:contains, temp_extraction/src/context/CricketContext.jsx:contains
- `setRuns` [HIGH] in `subsystem-1-0-src-context` as `cli` from `src/context/CricketContext.jsx`.
  Evidence: src/context/CricketContext.jsx:setRuns, src/context/CricketContext.jsx:calls, temp_extraction/src/context/CricketContext.jsx:calls
- `CricketProvider()` [MEDIUM] in `subsystem-1-0-src-context` as `service` from `src/context/CricketContext.jsx`.
  Evidence: src/context/CricketContext.jsx:CricketProvider(), src/context/CricketContext.jsx:contains, temp_extraction/src/context/CricketContext.jsx:contains
- `setScoringFirstRunDone` [MEDIUM] in `subsystem-1-0-src-context` as `cli` from `src/context/CricketContext.jsx`.
  Evidence: src/context/CricketContext.jsx:setScoringFirstRunDone, src/context/CricketContext.jsx:calls, temp_extraction/src/context/CricketContext.jsx:calls
- `syncService.executeOrQueue` [MEDIUM] in `subsystem-1-0-src-context` as `service` from `src/context/CricketContext.jsx`.
  Evidence: src/context/CricketContext.jsx:syncService.executeOrQueue, src/context/CricketContext.jsx:calls, src/context/CricketContext.jsx:calls
- `../../lib/api` [HIGH] in `subsystem-10-0-clean-cjs` as `route` from `clean.cjs`.
  Evidence: clean.cjs:../../lib/api, clean.cjs:imports
- `createClient` [HIGH] in `subsystem-10-0-clean-cjs` as `cli` from `test-batting.cjs`.
  Evidence: test-batting.cjs:createClient, test-batting.cjs:calls, test-players3.cjs:calls
- `runTest` [MEDIUM] in `subsystem-101-0-test-stats-js` as `cli` from `test-stats.js`.
  Evidence: test-stats.js:runTest, test-stats.js:calls, test-stats.js:calls
- `runs` [MEDIUM] in `subsystem-101-0-test-stats-js` as `cli` from `test-stats.js`.
  Evidence: test-stats.js:runs, test-stats.js:calls
- `setSearchQuery` [MEDIUM] in `subsystem-104-0-src-components` as `database` from `src/components/screens/MatchSetupScreen.jsx`.
  Evidence: src/components/screens/MatchSetupScreen.jsx:setSearchQuery, src/components/screens/MatchSetupScreen.jsx:calls, src/components/screens/MatchSetupScreen.jsx:calls
- `api.deletePlayer` [HIGH] in `subsystem-105-0-src-components` as `route` from `src/components/screens/PlayerProfileScreen.jsx`.
  Evidence: src/components/screens/PlayerProfileScreen.jsx:api.deletePlayer, src/components/screens/PlayerProfileScreen.jsx:calls
- `searchQuery.trim` [MEDIUM] in `subsystem-124-0-src-components` as `database` from `src/components/screens/TeamsScreen.jsx`.
  Evidence: src/components/screens/TeamsScreen.jsx:searchQuery.trim, src/components/screens/TeamsScreen.jsx:calls, src/components/screens/TeamsScreen.jsx:calls
- `temp_extraction/src/App.jsx` [HIGH] in `subsystem-131-0-temp-extraction` as `entrypoint` from `temp_extraction/src/App.jsx`.
  Evidence: temp_extraction/src/App.jsx:temp_extraction/src/App.jsx, temp_extraction/src/App.jsx:calls, temp_extraction/src/App.jsx:contains
- `temp_extraction/src/components/ProtectedRoute.jsx` [HIGH] in `subsystem-134-0-temp-extraction` as `route` from `temp_extraction/src/components/ProtectedRoute.jsx`.
  Evidence: temp_extraction/src/components/ProtectedRoute.jsx:temp_extraction/src/components/ProtectedRoute.jsx, temp_extraction/src/App.jsx:imports, temp_extraction/src/components/ProtectedRoute.jsx:calls
- `SyncService` [MEDIUM] in `subsystem-14-0-src-services` as `service` from `src/services/SyncService.js`.
  Evidence: src/services/SyncService.js:SyncService, src/services/SyncService.js:calls, src/services/SyncService.js:contains
- `SyncService.deleteDelivery()` [MEDIUM] in `subsystem-14-0-src-services` as `service` from `src/services/SyncService.js`.
  Evidence: src/services/SyncService.js:SyncService.deleteDelivery(), src/services/SyncService.js:contains, src/services/SyncService.js:calls
- `SyncService.emit()` [MEDIUM] in `subsystem-14-0-src-services` as `service` from `src/services/SyncService.js`.
  Evidence: src/services/SyncService.js:SyncService.emit(), src/services/SyncService.js:contains, src/services/SyncService.js:contains
- `SyncService.executeOrQueue()` [MEDIUM] in `subsystem-14-0-src-services` as `service` from `src/services/SyncService.js`.
  Evidence: src/services/SyncService.js:SyncService.executeOrQueue(), src/services/SyncService.js:contains, src/services/SyncService.js:calls
- `SyncService.handleOffline()` [MEDIUM] in `subsystem-14-0-src-services` as `service` from `src/services/SyncService.js`.
  Evidence: src/services/SyncService.js:SyncService.handleOffline(), src/services/SyncService.js:calls, src/services/SyncService.js:contains
- `SyncService.handleOnline()` [MEDIUM] in `subsystem-14-0-src-services` as `service` from `src/services/SyncService.js`.
  Evidence: src/services/SyncService.js:SyncService.handleOnline(), src/services/SyncService.js:calls, src/services/SyncService.js:contains
- `SyncService.processQueue()` [MEDIUM] in `subsystem-14-0-src-services` as `service` from `src/services/SyncService.js`.
  Evidence: src/services/SyncService.js:SyncService.processQueue(), src/services/SyncService.js:contains, src/services/SyncService.js:calls
- `SyncService.pushDelivery()` [MEDIUM] in `subsystem-14-0-src-services` as `service` from `src/services/SyncService.js`.
  Evidence: src/services/SyncService.js:SyncService.pushDelivery(), src/services/SyncService.js:contains, src/services/SyncService.js:calls
- `SyncService.setStatus()` [MEDIUM] in `subsystem-14-0-src-services` as `service` from `src/services/SyncService.js`.
  Evidence: src/services/SyncService.js:SyncService.setStatus(), src/services/SyncService.js:contains, src/services/SyncService.js:calls
- `SyncService.subscribe()` [MEDIUM] in `subsystem-14-0-src-services` as `service` from `src/services/SyncService.js`.
  Evidence: src/services/SyncService.js:SyncService.subscribe(), src/services/SyncService.js:contains, src/services/SyncService.js:calls
- `SyncService.updatePendingCount()` [MEDIUM] in `subsystem-14-0-src-services` as `service` from `src/services/SyncService.js`.
  Evidence: src/services/SyncService.js:SyncService.updatePendingCount(), src/services/SyncService.js:calls, src/services/SyncService.js:contains
- `src/services/SyncService.js` [MEDIUM] in `subsystem-14-0-src-services` as `service` from `src/services/SyncService.js`.
  Evidence: src/services/SyncService.js:src/services/SyncService.js, src/components/screens/ScoringScreen.jsx:imports, src/context/CricketContext.jsx:imports
- `temp_extraction/src/components/ui/MatchMediaReport.jsx` [MEDIUM] in `subsystem-146-0-temp-extraction` as `database` from `temp_extraction/src/components/ui/MatchMediaReport.jsx`.
  Evidence: temp_extraction/src/components/ui/MatchMediaReport.jsx:temp_extraction/src/components/ui/MatchMediaReport.jsx, temp_extraction/src/components/screens/MatchDetailScreen.jsx:imports, temp_extraction/src/components/screens/MatchResultScreen.jsx:imports
- `useLocation` [HIGH] in `subsystem-149-0-src-app-jsx` as `entrypoint` from `src/App.jsx`.
  Evidence: src/App.jsx:useLocation, src/context/CricketContext.jsx:calls, temp_extraction/src/context/CricketContext.jsx:calls
- `PointsTableUI()` [MEDIUM] in `subsystem-15-0-src-components` as `database` from `src/components/screens/TournamentsScreen.jsx`.
  Evidence: src/components/screens/TournamentsScreen.jsx:PointsTableUI(), src/components/screens/TournamentsScreen.jsx:contains
- `pointsTable.map` [MEDIUM] in `subsystem-15-0-src-components` as `database` from `src/components/screens/TournamentsScreen.jsx`.
  Evidence: src/components/screens/TournamentsScreen.jsx:pointsTable.map, src/components/screens/TournamentsScreen.jsx:calls
- `webpush.setVapidDetails` [HIGH] in `subsystem-17-0-supabase` as `route` from `supabase/functions/send-push/index.ts`.
  Evidence: supabase/functions/send-push/index.ts:webpush.setVapidDetails, supabase/functions/send-push/index.ts:calls
- `createClient` [MEDIUM] in `subsystem-17-0-supabase` as `cli` from `supabase/functions/send-push/index.ts`.
  Evidence: supabase/functions/send-push/index.ts:createClient, supabase/functions/send-push/index.ts:calls
- `https://deno.land/std@0.168.0/http/server.ts` [MEDIUM] in `subsystem-17-0-supabase` as `cli` from `supabase/functions/send-push/index.ts`.
  Evidence: supabase/functions/send-push/index.ts:https://deno.land/std@0.168.0/http/server.ts, supabase/functions/send-push/index.ts:imports
- `serve` [MEDIUM] in `subsystem-17-0-supabase` as `cli` from `supabase/functions/send-push/index.ts`.
  Evidence: supabase/functions/send-push/index.ts:serve, supabase/functions/send-push/index.ts:calls
- `setPointsTable` [MEDIUM] in `subsystem-18-0-src-lib` as `database` from `src/lib/standings.js`.
  Evidence: src/lib/standings.js:setPointsTable, src/lib/standings.js:calls, src/lib/standings.js:calls
- `QUICK_RUNS.map` [HIGH] in `subsystem-2-0-src-components` as `cli` from `src/components/screens/ScoringScreen.jsx`.
  Evidence: src/components/screens/ScoringScreen.jsx:QUICK_RUNS.map, src/components/screens/ScoringScreen.jsx:calls, temp_extraction/src/components/screens/ScoringScreen.jsx:calls
- `doRun()` [HIGH] in `subsystem-2-0-src-components` as `cli` from `src/components/screens/ScoringScreen.jsx`.
  Evidence: src/components/screens/ScoringScreen.jsx:doRun(), src/components/screens/ScoringScreen.jsx:calls, src/components/screens/ScoringScreen.jsx:contains
- `handleRetireBatter` [HIGH] in `subsystem-2-0-src-components` as `route` from `src/components/screens/ScoringScreen.jsx`.
  Evidence: src/components/screens/ScoringScreen.jsx:handleRetireBatter, src/components/screens/ScoringScreen.jsx:calls
- `BattingTable()` [MEDIUM] in `subsystem-2-0-src-components` as `database` from `src/components/ui/MatchScorecard.jsx`.
  Evidence: src/components/ui/MatchScorecard.jsx:BattingTable(), src/components/ui/MatchScorecard.jsx:contains, temp_extraction/src/components/ui/MatchScorecard.jsx:contains
- `BowlingTable()` [MEDIUM] in `subsystem-2-0-src-components` as `database` from `src/components/ui/MatchScorecard.jsx`.
  Evidence: src/components/ui/MatchScorecard.jsx:BowlingTable(), src/components/ui/MatchScorecard.jsx:contains, temp_extraction/src/components/ui/MatchScorecard.jsx:contains
- `recordRuns` [MEDIUM] in `subsystem-2-0-src-components` as `cli` from `src/components/screens/ScoringScreen.jsx`.
  Evidence: src/components/screens/ScoringScreen.jsx:recordRuns, src/components/screens/ScoringScreen.jsx:calls, temp_extraction/src/components/screens/ScoringScreen.jsx:calls
- `setRunOutPlayer` [MEDIUM] in `subsystem-2-0-src-components` as `cli` from `src/components/screens/ScoringScreen.jsx`.
  Evidence: src/components/screens/ScoringScreen.jsx:setRunOutPlayer, src/components/screens/ScoringScreen.jsx:calls
- `api.getDefaults` [HIGH] in `subsystem-21-0-src-components` as `route` from `src/components/screens/TeamRegistrationTab.jsx`.
  Evidence: src/components/screens/TeamRegistrationTab.jsx:api.getDefaults, src/components/screens/TeamRegistrationTab.jsx:calls
- `activeTournamentPointsTable.map` [MEDIUM] in `subsystem-22-0-src-components` as `database` from `src/components/screens/HomeScreen.jsx`.
  Evidence: src/components/screens/HomeScreen.jsx:activeTournamentPointsTable.map, src/components/screens/HomeScreen.jsx:calls
- `activeTournamentPointsTable.slice` [MEDIUM] in `subsystem-22-0-src-components` as `database` from `src/components/screens/HomeScreen.jsx`.
  Evidence: src/components/screens/HomeScreen.jsx:activeTournamentPointsTable.slice, src/components/screens/HomeScreen.jsx:calls
- `ErrorBoundary` [HIGH] in `subsystem-25-0-src-main-jsx` as `entrypoint` from `src/main.jsx`.
  Evidence: src/main.jsx:ErrorBoundary, src/main.jsx:contains, temp_extraction/src/main.jsx:contains
- `ErrorBoundary.componentDidCatch()` [HIGH] in `subsystem-25-0-src-main-jsx` as `entrypoint` from `src/main.jsx`.
  Evidence: src/main.jsx:ErrorBoundary.componentDidCatch(), src/main.jsx:contains, temp_extraction/src/main.jsx:contains
- `ErrorBoundary.render()` [HIGH] in `subsystem-25-0-src-main-jsx` as `entrypoint` from `src/main.jsx`.
  Evidence: src/main.jsx:ErrorBoundary.render(), src/main.jsx:calls, temp_extraction/src/main.jsx:calls
- `ErrorBoundary.return()` [HIGH] in `subsystem-25-0-src-main-jsx` as `entrypoint` from `src/main.jsx`.
  Evidence: src/main.jsx:ErrorBoundary.return(), src/main.jsx:contains, temp_extraction/src/main.jsx:contains
- `ErrorBoundary.super()` [HIGH] in `subsystem-25-0-src-main-jsx` as `entrypoint` from `src/main.jsx`.
  Evidence: src/main.jsx:ErrorBoundary.super(), src/main.jsx:calls, temp_extraction/src/main.jsx:calls
- `ReactDOM.createRoot` [HIGH] in `subsystem-25-0-src-main-jsx` as `entrypoint` from `src/main.jsx`.
  Evidence: src/main.jsx:ReactDOM.createRoot, src/main.jsx:calls, temp_extraction/src/main.jsx:calls
- `constructor` [HIGH] in `subsystem-25-0-src-main-jsx` as `entrypoint` from `src/main.jsx`.
  Evidence: src/main.jsx:constructor, src/main.jsx:calls, temp_extraction/src/main.jsx:calls
- `document.getElementById` [HIGH] in `subsystem-25-0-src-main-jsx` as `entrypoint` from `src/main.jsx`.
  Evidence: src/main.jsx:document.getElementById, src/main.jsx:calls, temp_extraction/src/main.jsx:calls
- `error.toString` [HIGH] in `subsystem-25-0-src-main-jsx` as `entrypoint` from `src/main.jsx`.
  Evidence: src/main.jsx:error.toString, src/main.jsx:calls, temp_extraction/src/main.jsx:calls
- `getDerivedStateFromError` [HIGH] in `subsystem-25-0-src-main-jsx` as `entrypoint` from `src/main.jsx`.
  Evidence: src/main.jsx:getDerivedStateFromError, src/main.jsx:calls, temp_extraction/src/main.jsx:calls
- `onNeedRefresh` [HIGH] in `subsystem-25-0-src-main-jsx` as `entrypoint` from `src/main.jsx`.
  Evidence: src/main.jsx:onNeedRefresh, src/main.jsx:calls
- `onOfflineReady` [HIGH] in `subsystem-25-0-src-main-jsx` as `entrypoint` from `src/main.jsx`.
  Evidence: src/main.jsx:onOfflineReady, src/main.jsx:calls
- `react-dom/client` [HIGH] in `subsystem-25-0-src-main-jsx` as `entrypoint` from `src/main.jsx`.
  Evidence: src/main.jsx:react-dom/client, src/main.jsx:imports, temp_extraction/src/main.jsx:imports
- `registerSW` [HIGH] in `subsystem-25-0-src-main-jsx` as `entrypoint` from `src/main.jsx`.
  Evidence: src/main.jsx:registerSW, src/main.jsx:calls
- `src/main.jsx` [HIGH] in `subsystem-25-0-src-main-jsx` as `entrypoint` from `src/main.jsx`.
  Evidence: src/main.jsx:src/main.jsx, src/main.jsx:calls, src/main.jsx:calls
- `temp_extraction/src/main.jsx` [HIGH] in `subsystem-25-0-src-main-jsx` as `entrypoint` from `temp_extraction/src/main.jsx`.
  Evidence: temp_extraction/src/main.jsx:temp_extraction/src/main.jsx, temp_extraction/src/main.jsx:calls, temp_extraction/src/main.jsx:calls
- `updateSW` [HIGH] in `subsystem-25-0-src-main-jsx` as `entrypoint` from `src/main.jsx`.
  Evidence: src/main.jsx:updateSW, src/main.jsx:calls
- `virtual:pwa-register` [HIGH] in `subsystem-25-0-src-main-jsx` as `entrypoint` from `src/main.jsx`.
  Evidence: src/main.jsx:virtual:pwa-register, src/main.jsx:imports
- `createClient` [HIGH] in `subsystem-27-0-apply-bug5-sql-js` as `cli` from `apply-bug5-sql.js`.
  Evidence: apply-bug5-sql.js:createClient, apply-bug5-sql.js:calls, delete_season.js:calls
- `run` [HIGH] in `subsystem-27-0-apply-bug5-sql-js` as `cli` from `apply-bug5-sql.js`.
  Evidence: apply-bug5-sql.js:run, apply-bug5-sql.js:calls, apply-bug5-sql.js:calls
- `@supabase/supabase-js` [MEDIUM] in `subsystem-27-0-apply-bug5-sql-js` as `database` from `apply-bug5-sql.js`.
  Evidence: apply-bug5-sql.js:@supabase/supabase-js, apply-bug5-sql.js:imports, delete_season.js:imports
- `apply-bug5-sql.js` [MEDIUM] in `subsystem-27-0-apply-bug5-sql-js` as `database` from `apply-bug5-sql.js`.
  Evidence: apply-bug5-sql.js:apply-bug5-sql.js, apply-bug5-sql.js:calls, apply-bug5-sql.js:calls
- `console.error` [MEDIUM] in `subsystem-27-0-apply-bug5-sql-js` as `database` from `apply-bug5-sql.js`.
  Evidence: apply-bug5-sql.js:console.error, apply-bug5-sql.js:calls, apply-bug5-sql.js:calls
- `console.log` [MEDIUM] in `subsystem-27-0-apply-bug5-sql-js` as `database` from `apply-bug5-sql.js`.
  Evidence: apply-bug5-sql.js:console.log, apply-bug5-sql.js:calls, apply-bug5-sql.js:calls
- `dotenv` [MEDIUM] in `subsystem-27-0-apply-bug5-sql-js` as `database` from `apply-bug5-sql.js`.
  Evidence: apply-bug5-sql.js:dotenv, apply-bug5-sql.js:imports, delete_season.js:imports
- `dotenv.config` [MEDIUM] in `subsystem-27-0-apply-bug5-sql-js` as `database` from `apply-bug5-sql.js`.
  Evidence: apply-bug5-sql.js:dotenv.config, apply-bug5-sql.js:calls, delete_season.js:calls
- `fs` [MEDIUM] in `subsystem-27-0-apply-bug5-sql-js` as `database` from `apply-bug5-sql.js`.
  Evidence: apply-bug5-sql.js:fs, apply-bug5-sql.js:imports
- `fs.readFileSync` [MEDIUM] in `subsystem-27-0-apply-bug5-sql-js` as `database` from `apply-bug5-sql.js`.
  Evidence: apply-bug5-sql.js:fs.readFileSync, apply-bug5-sql.js:calls
- `part.trim` [MEDIUM] in `subsystem-27-0-apply-bug5-sql-js` as `database` from `apply-bug5-sql.js`.
  Evidence: apply-bug5-sql.js:part.trim, apply-bug5-sql.js:calls
- `path` [MEDIUM] in `subsystem-27-0-apply-bug5-sql-js` as `database` from `apply-bug5-sql.js`.
  Evidence: apply-bug5-sql.js:path, apply-bug5-sql.js:imports
- `path.join` [MEDIUM] in `subsystem-27-0-apply-bug5-sql-js` as `database` from `apply-bug5-sql.js`.
  Evidence: apply-bug5-sql.js:path.join, apply-bug5-sql.js:calls
- `process.cwd` [MEDIUM] in `subsystem-27-0-apply-bug5-sql-js` as `database` from `apply-bug5-sql.js`.
  Evidence: apply-bug5-sql.js:process.cwd, apply-bug5-sql.js:calls
- `process.exit` [MEDIUM] in `subsystem-27-0-apply-bug5-sql-js` as `database` from `apply-bug5-sql.js`.
  Evidence: apply-bug5-sql.js:process.exit, apply-bug5-sql.js:calls, delete_season.js:calls
- `sql.split` [MEDIUM] in `subsystem-27-0-apply-bug5-sql-js` as `database` from `apply-bug5-sql.js`.
  Evidence: apply-bug5-sql.js:sql.split, apply-bug5-sql.js:calls
- `supabase.rpc` [MEDIUM] in `subsystem-27-0-apply-bug5-sql-js` as `database` from `apply-bug5-sql.js`.
  Evidence: apply-bug5-sql.js:supabase.rpc, apply-bug5-sql.js:calls, scratch_check_enum.js:calls
- `handleClick()` [HIGH] in `subsystem-29-0-src-components` as `cli` from `src/components/BottomNav.jsx`.
  Evidence: src/components/BottomNav.jsx:handleClick(), src/components/BottomNav.jsx:contains, temp_extraction/src/components/BottomNav.jsx:contains
- `document.querySelector` [MEDIUM] in `subsystem-29-0-src-components` as `database` from `src/components/BottomNav.jsx`.
  Evidence: src/components/BottomNav.jsx:document.querySelector, src/components/BottomNav.jsx:calls, src/components/Header.jsx:calls
- `Runs` [HIGH] in `subsystem-3-0-src-components` as `cli` from `src/components/screens/MatchSetupScreen.jsx`.
  Evidence: src/components/screens/MatchSetupScreen.jsx:Runs, src/components/screens/MatchSetupScreen.jsx:calls, temp_extraction/src/components/screens/MatchSetupScreen.jsx:calls
- `_0_20px_rgba` [HIGH] in `subsystem-3-0-src-components` as `entrypoint` from `src/App.jsx`.
  Evidence: src/App.jsx:_0_20px_rgba, src/components/screens/InningsInitScreen.jsx:calls, src/components/screens/MatchSetupScreen.jsx:calls
- `api.persistMatchSetup` [HIGH] in `subsystem-3-0-src-components` as `route` from `src/components/screens/MatchSetupScreen.jsx`.
  Evidence: src/components/screens/MatchSetupScreen.jsx:api.persistMatchSetup, src/components/screens/MatchSetupScreen.jsx:calls
- `rosterSearchQuery.toLowerCase` [MEDIUM] in `subsystem-3-0-src-components` as `database` from `temp_extraction/src/components/screens/MatchSetupScreen.jsx`.
  Evidence: temp_extraction/src/components/screens/MatchSetupScreen.jsx:rosterSearchQuery.toLowerCase, temp_extraction/src/components/screens/MatchSetupScreen.jsx:calls
- `setRosterSearchQuery` [MEDIUM] in `subsystem-3-0-src-components` as `database` from `src/components/screens/MatchSetupScreen.jsx`.
  Evidence: src/components/screens/MatchSetupScreen.jsx:setRosterSearchQuery, src/components/screens/MatchSetupScreen.jsx:calls, temp_extraction/src/components/screens/MatchSetupScreen.jsx:calls
- `api.getSelectionProcesses` [HIGH] in `subsystem-31-0-src-components` as `route` from `src/components/screens/SelectorAssignmentModal.jsx`.
  Evidence: src/components/screens/SelectorAssignmentModal.jsx:api.getSelectionProcesses, src/components/screens/SelectorAssignmentModal.jsx:calls, src/context/CricketContext.jsx:calls
- `api.getSelectorAssignments` [HIGH] in `subsystem-31-0-src-components` as `route` from `src/components/screens/SelectorAssignmentModal.jsx`.
  Evidence: src/components/screens/SelectorAssignmentModal.jsx:api.getSelectorAssignments, src/components/screens/SelectorAssignmentModal.jsx:calls
- `api.updateSelectorAssignments` [HIGH] in `subsystem-31-0-src-components` as `route` from `src/components/screens/SelectorAssignmentModal.jsx`.
  Evidence: src/components/screens/SelectorAssignmentModal.jsx:api.updateSelectorAssignments, src/components/screens/SelectorAssignmentModal.jsx:calls
- `handlePlayerClick()` [HIGH] in `subsystem-32-0-src-components` as `cli` from `src/components/screens/PlayersScreen.jsx`.
  Evidence: src/components/screens/PlayersScreen.jsx:handlePlayerClick(), src/components/screens/PlayersScreen.jsx:calls, src/components/screens/PlayersScreen.jsx:contains
- `searchQuery.toLowerCase` [MEDIUM] in `subsystem-32-0-src-components` as `database` from `src/components/screens/PlayersScreen.jsx`.
  Evidence: src/components/screens/PlayersScreen.jsx:searchQuery.toLowerCase, src/components/screens/PlayersScreen.jsx:calls, src/components/screens/ScoutingHubScreen.jsx:calls
- `api.createSeason` [HIGH] in `subsystem-34-0-src-components` as `route` from `src/components/screens/SeasonManagementTab.jsx`.
  Evidence: src/components/screens/SeasonManagementTab.jsx:api.createSeason, src/components/screens/SeasonManagementTab.jsx:calls
- `api.getSeasons` [HIGH] in `subsystem-34-0-src-components` as `route` from `src/components/screens/SeasonManagementTab.jsx`.
  Evidence: src/components/screens/SeasonManagementTab.jsx:api.getSeasons, src/components/screens/SeasonManagementTab.jsx:calls, src/components/ui/TeamManagerModal.jsx:calls
- `api.setActiveSeason` [HIGH] in `subsystem-34-0-src-components` as `route` from `src/components/screens/SeasonManagementTab.jsx`.
  Evidence: src/components/screens/SeasonManagementTab.jsx:api.setActiveSeason, src/components/screens/SeasonManagementTab.jsx:calls
- `onRowClick` [HIGH] in `subsystem-36-0-src-components` as `cli` from `src/components/ui/DataTable.jsx`.
  Evidence: src/components/ui/DataTable.jsx:onRowClick, src/components/ui/DataTable.jsx:calls, temp_extraction/src/components/ui/DataTable.jsx:calls
- `DataTable` [MEDIUM] in `subsystem-36-0-src-components` as `database` from `src/components/ui/DataTable.jsx`.
  Evidence: src/components/ui/DataTable.jsx:DataTable, src/components/ui/DataTable.jsx:calls, temp_extraction/src/components/ui/DataTable.jsx:calls
- `React.useMemo` [MEDIUM] in `subsystem-36-0-src-components` as `database` from `src/components/ui/DataTable.jsx`.
  Evidence: src/components/ui/DataTable.jsx:React.useMemo, src/components/ui/DataTable.jsx:calls, temp_extraction/src/components/ui/DataTable.jsx:calls
- `aVal.toLowerCase` [MEDIUM] in `subsystem-36-0-src-components` as `database` from `src/components/ui/DataTable.jsx`.
  Evidence: src/components/ui/DataTable.jsx:aVal.toLowerCase, src/components/ui/DataTable.jsx:calls, temp_extraction/src/components/ui/DataTable.jsx:calls
- `bVal.toLowerCase` [MEDIUM] in `subsystem-36-0-src-components` as `database` from `src/components/ui/DataTable.jsx`.
  Evidence: src/components/ui/DataTable.jsx:bVal.toLowerCase, src/components/ui/DataTable.jsx:calls, temp_extraction/src/components/ui/DataTable.jsx:calls
- `col.render` [MEDIUM] in `subsystem-36-0-src-components` as `database` from `src/components/ui/DataTable.jsx`.
  Evidence: src/components/ui/DataTable.jsx:col.render, src/components/ui/DataTable.jsx:calls, temp_extraction/src/components/ui/DataTable.jsx:calls
- `columns.map` [MEDIUM] in `subsystem-36-0-src-components` as `database` from `src/components/ui/DataTable.jsx`.
  Evidence: src/components/ui/DataTable.jsx:columns.map, src/components/ui/DataTable.jsx:calls, src/components/ui/DataTable.jsx:calls
- `handleSort()` [MEDIUM] in `subsystem-36-0-src-components` as `database` from `src/components/ui/DataTable.jsx`.
  Evidence: src/components/ui/DataTable.jsx:handleSort(), src/components/ui/DataTable.jsx:calls, src/components/ui/DataTable.jsx:contains
- `setSortDir` [MEDIUM] in `subsystem-36-0-src-components` as `database` from `src/components/ui/DataTable.jsx`.
  Evidence: src/components/ui/DataTable.jsx:setSortDir, src/components/ui/DataTable.jsx:calls, src/components/ui/DataTable.jsx:calls
- `setSortKey` [MEDIUM] in `subsystem-36-0-src-components` as `database` from `src/components/ui/DataTable.jsx`.
  Evidence: src/components/ui/DataTable.jsx:setSortKey, src/components/ui/DataTable.jsx:calls, src/components/ui/DataTable.jsx:calls
- `sortedData.map` [MEDIUM] in `subsystem-36-0-src-components` as `database` from `src/components/ui/DataTable.jsx`.
  Evidence: src/components/ui/DataTable.jsx:sortedData.map, src/components/ui/DataTable.jsx:calls, temp_extraction/src/components/ui/DataTable.jsx:calls
- `src/components/ui/DataTable.jsx` [MEDIUM] in `subsystem-36-0-src-components` as `database` from `src/components/ui/DataTable.jsx`.
  Evidence: src/components/ui/DataTable.jsx:src/components/ui/DataTable.jsx, src/components/ui/DataTable.jsx:calls, src/components/ui/DataTable.jsx:calls
- `temp_extraction/src/components/ui/DataTable.jsx` [MEDIUM] in `subsystem-36-0-src-components` as `database` from `temp_extraction/src/components/ui/DataTable.jsx`.
  Evidence: temp_extraction/src/components/ui/DataTable.jsx:temp_extraction/src/components/ui/DataTable.jsx, temp_extraction/src/components/ui/DataTable.jsx:calls, temp_extraction/src/components/ui/DataTable.jsx:calls
- `client.focus` [MEDIUM] in `subsystem-38-0-src-sw-js` as `cli` from `src/sw.js`.
  Evidence: src/sw.js:client.focus, src/sw.js:calls
- `clients.claim` [MEDIUM] in `subsystem-38-0-src-sw-js` as `cli` from `src/sw.js`.
  Evidence: src/sw.js:clients.claim, src/sw.js:calls
- `clients.matchAll` [MEDIUM] in `subsystem-38-0-src-sw-js` as `cli` from `src/sw.js`.
  Evidence: src/sw.js:clients.matchAll, src/sw.js:calls
- `clients.openWindow` [MEDIUM] in `subsystem-38-0-src-sw-js` as `cli` from `src/sw.js`.
  Evidence: src/sw.js:clients.openWindow, src/sw.js:calls
- `api.createAnnouncement` [HIGH] in `subsystem-39-0-src-components` as `route` from `src/components/screens/NewsScreen.jsx`.
  Evidence: src/components/screens/NewsScreen.jsx:api.createAnnouncement, src/components/screens/NewsScreen.jsx:calls
- `02_selector_assignment_refactor.sql` [MEDIUM] in `subsystem-4-0-02-selector-assignment-refactor-sql` as `database` from `02_selector_assignment_refactor.sql`.
  Evidence: 02_selector_assignment_refactor.sql:02_selector_assignment_refactor.sql, 02_selector_assignment_refactor.sql:alters, 02_selector_assignment_refactor.sql:defines
- `03_season_management_architecture.sql` [MEDIUM] in `subsystem-4-0-02-selector-assignment-refactor-sql` as `database` from `03_season_management_architecture.sql`.
  Evidence: 03_season_management_architecture.sql:03_season_management_architecture.sql, 03_season_management_architecture.sql:alters, 03_season_management_architecture.sql:alters
- `04_admin_delete_user.sql` [MEDIUM] in `subsystem-4-0-02-selector-assignment-refactor-sql` as `database` from `04_admin_delete_user.sql`.
  Evidence: 04_admin_delete_user.sql:04_admin_delete_user.sql, 04_admin_delete_user.sql:deletes, 04_admin_delete_user.sql:deletes
- `06_match_finalization_policies.sql` [MEDIUM] in `subsystem-4-0-02-selector-assignment-refactor-sql` as `database` from `06_match_finalization_policies.sql`.
  Evidence: 06_match_finalization_policies.sql:06_match_finalization_policies.sql, 06_match_finalization_policies.sql:queries, 06_match_finalization_policies.sql:queries
- `IF` [MEDIUM] in `subsystem-4-0-02-selector-assignment-refactor-sql` as `database` from `02_selector_assignment_refactor.sql`.
  Evidence: 02_selector_assignment_refactor.sql:IF, 02_selector_assignment_refactor.sql:defines, 03_season_management_architecture.sql:defines
- `LATERAL` [MEDIUM] in `subsystem-4-0-02-selector-assignment-refactor-sql` as `database` from `03_season_management_architecture.sql`.
  Evidence: 03_season_management_architecture.sql:LATERAL, 03_season_management_architecture.sql:joins
- `RLS` [MEDIUM] in `subsystem-4-0-02-selector-assignment-refactor-sql` as `database` from `02_selector_assignment_refactor.sql`.
  Evidence: 02_selector_assignment_refactor.sql:RLS, 02_selector_assignment_refactor.sql:updates
- `SELECTOR` [MEDIUM] in `subsystem-4-0-02-selector-assignment-refactor-sql` as `database` from `02_selector_assignment_refactor.sql`.
  Evidence: 02_selector_assignment_refactor.sql:SELECTOR, 02_selector_assignment_refactor.sql:updates
- `Supabase` [MEDIUM] in `subsystem-4-0-02-selector-assignment-refactor-sql` as `database` from `04_admin_delete_user.sql`.
  Evidence: 04_admin_delete_user.sql:Supabase, 04_admin_delete_user.sql:queries
- `admin_password_reset.sql` [MEDIUM] in `subsystem-4-0-02-selector-assignment-refactor-sql` as `database` from `admin_password_reset.sql`.
  Evidence: admin_password_reset.sql:admin_password_reset.sql, admin_password_reset.sql:updates, admin_password_reset.sql:updates
- `age_categories` [MEDIUM] in `subsystem-4-0-02-selector-assignment-refactor-sql` as `database` from `03_season_management_architecture.sql`.
  Evidence: 03_season_management_architecture.sql:age_categories, 03_season_management_architecture.sql:references, dummy_data.sql:queries
- `alter_table.sql` [MEDIUM] in `subsystem-4-0-02-selector-assignment-refactor-sql` as `database` from `alter_table.sql`.
  Evidence: alter_table.sql:alter_table.sql, alter_table.sql:alters
- `audit_logs` [MEDIUM] in `subsystem-4-0-02-selector-assignment-refactor-sql` as `database` from `supabase_schema.sql`.
  Evidence: supabase_schema.sql:audit_logs, supabase_schema.sql:alters, supabase_schema.sql:writes
- `auth.users` [MEDIUM] in `subsystem-4-0-02-selector-assignment-refactor-sql` as `database` from `04_admin_delete_user.sql`.
  Evidence: 04_admin_delete_user.sql:auth.users, 04_admin_delete_user.sql:deletes, 04_admin_delete_user.sql:queries
- `decisions` [MEDIUM] in `subsystem-4-0-02-selector-assignment-refactor-sql` as `database` from `fix_rls.sql`.
  Evidence: fix_rls.sql:decisions, fix_rls.sql:updates, fix_rls.sql:updates
- `deliveries` [MEDIUM] in `subsystem-4-0-02-selector-assignment-refactor-sql` as `database` from `03_season_management_architecture.sql`.
  Evidence: 03_season_management_architecture.sql:deliveries, 03_season_management_architecture.sql:queries, 03_season_management_architecture.sql:queries
- `districts` [MEDIUM] in `subsystem-4-0-02-selector-assignment-refactor-sql` as `database` from `dummy_data.sql`.
  Evidence: dummy_data.sql:districts, dummy_data.sql:queries, dummy_data.sql:queries
- `dummy_data.sql` [MEDIUM] in `subsystem-4-0-02-selector-assignment-refactor-sql` as `database` from `dummy_data.sql`.
  Evidence: dummy_data.sql:dummy_data.sql, dummy_data.sql:queries, dummy_data.sql:queries
- `fix_rls.sql` [MEDIUM] in `subsystem-4-0-02-selector-assignment-refactor-sql` as `database` from `fix_rls.sql`.
  Evidence: fix_rls.sql:fix_rls.sql, fix_rls.sql:alters, fix_rls.sql:alters
- `generate_teams.sql` [MEDIUM] in `subsystem-4-0-02-selector-assignment-refactor-sql` as `database` from `generate_teams.sql`.
  Evidence: generate_teams.sql:generate_teams.sql, generate_teams.sql:queries, generate_teams.sql:queries
- `get_eligible_players_for_process` [MEDIUM] in `subsystem-4-0-02-selector-assignment-refactor-sql` as `database` from `02_selector_assignment_refactor.sql`.
  Evidence: 02_selector_assignment_refactor.sql:get_eligible_players_for_process, 02_selector_assignment_refactor.sql:joins
- `innings` [MEDIUM] in `subsystem-4-0-02-selector-assignment-refactor-sql` as `database` from `fix_rls.sql`.
  Evidence: fix_rls.sql:innings, fix_rls.sql:alters, fix_rls.sql:updates
- `its` [MEDIUM] in `subsystem-4-0-02-selector-assignment-refactor-sql` as `database` from `03_season_management_architecture.sql`.
  Evidence: 03_season_management_architecture.sql:its, 03_season_management_architecture.sql:queries
- `live` [MEDIUM] in `subsystem-4-0-02-selector-assignment-refactor-sql` as `database` from `supabase_schema.sql`.
  Evidence: supabase_schema.sql:live, supabase_schema.sql:updates
- `match_rosters` [MEDIUM] in `subsystem-4-0-02-selector-assignment-refactor-sql` as `database` from `dummy_data.sql`.
  Evidence: dummy_data.sql:match_rosters, dummy_data.sql:writes, supabase_schema.sql:alters
- `matches` [MEDIUM] in `subsystem-4-0-02-selector-assignment-refactor-sql` as `database` from `03_season_management_architecture.sql`.
  Evidence: 03_season_management_architecture.sql:matches, 03_season_management_architecture.sql:alters, 03_season_management_architecture.sql:joins
- `official` [MEDIUM] in `subsystem-4-0-02-selector-assignment-refactor-sql` as `database` from `supabase_schema.sql`.
  Evidence: supabase_schema.sql:official, supabase_schema.sql:queries, supabase_schema.sql:queries
- `on` [MEDIUM] in `subsystem-4-0-02-selector-assignment-refactor-sql` as `database` from `supabase_schema.sql`.
  Evidence: supabase_schema.sql:on, supabase_schema.sql:updates, supabase_schema.sql:updates
- `or` [MEDIUM] in `subsystem-4-0-02-selector-assignment-refactor-sql` as `database` from `supabase_schema.sql`.
  Evidence: supabase_schema.sql:or, supabase_schema.sql:updates, supabase_schema.sql:updates
- `pg_constraint` [MEDIUM] in `subsystem-4-0-02-selector-assignment-refactor-sql` as `database` from `03_season_management_architecture.sql`.
  Evidence: 03_season_management_architecture.sql:pg_constraint, 03_season_management_architecture.sql:queries
- `player_evaluations` [MEDIUM] in `subsystem-4-0-02-selector-assignment-refactor-sql` as `database` from `supabase_schema.sql`.
  Evidence: supabase_schema.sql:player_evaluations, supabase_schema.sql:alters
- `player_registrations` [MEDIUM] in `subsystem-4-0-02-selector-assignment-refactor-sql` as `database` from `02_selector_assignment_refactor.sql`.
  Evidence: 02_selector_assignment_refactor.sql:player_registrations, 02_selector_assignment_refactor.sql:queries, 03_season_management_architecture.sql:alters
- `players` [MEDIUM] in `subsystem-4-0-02-selector-assignment-refactor-sql` as `database` from `02_selector_assignment_refactor.sql`.
  Evidence: 02_selector_assignment_refactor.sql:players, 02_selector_assignment_refactor.sql:joins, 03_season_management_architecture.sql:joins
- `processes` [MEDIUM] in `subsystem-4-0-02-selector-assignment-refactor-sql` as `database` from `fix_rls.sql`.
  Evidence: fix_rls.sql:processes, fix_rls.sql:updates, fix_rls.sql:updates
- `profiles` [MEDIUM] in `subsystem-4-0-02-selector-assignment-refactor-sql` as `database` from `02_selector_assignment_refactor.sql`.
  Evidence: 02_selector_assignment_refactor.sql:profiles, 02_selector_assignment_refactor.sql:queries, 02_selector_assignment_refactor.sql:references
- `public.profiles` [MEDIUM] in `subsystem-4-0-02-selector-assignment-refactor-sql` as `database` from `04_admin_delete_user.sql`.
  Evidence: 04_admin_delete_user.sql:public.profiles, 04_admin_delete_user.sql:deletes, 04_admin_delete_user.sql:queries
- `push_subscriptions` [MEDIUM] in `subsystem-4-0-02-selector-assignment-refactor-sql` as `database` from `supabase_schema.sql`.
  Evidence: supabase_schema.sql:push_subscriptions, supabase_schema.sql:alters
- `ranked_matches` [MEDIUM] in `subsystem-4-0-02-selector-assignment-refactor-sql` as `database` from `03_season_management_architecture.sql`.
  Evidence: 03_season_management_architecture.sql:ranked_matches, 03_season_management_architecture.sql:queries
- `seasons` [MEDIUM] in `subsystem-4-0-02-selector-assignment-refactor-sql` as `database` from `03_season_management_architecture.sql`.
  Evidence: 03_season_management_architecture.sql:seasons, 03_season_management_architecture.sql:alters, 03_season_management_architecture.sql:queries
- `selection` [MEDIUM] in `subsystem-4-0-02-selector-assignment-refactor-sql` as `database` from `fix_rls.sql`.
  Evidence: fix_rls.sql:selection, fix_rls.sql:updates, fix_rls.sql:updates
- `selection_candidates` [MEDIUM] in `subsystem-4-0-02-selector-assignment-refactor-sql` as `database` from `fix_rls.sql`.
  Evidence: fix_rls.sql:selection_candidates, fix_rls.sql:alters, supabase_schema.sql:alters
- `selection_decisions` [MEDIUM] in `subsystem-4-0-02-selector-assignment-refactor-sql` as `database` from `fix_rls.sql`.
  Evidence: fix_rls.sql:selection_decisions, fix_rls.sql:alters, supabase_schema.sql:alters
- `selection_processes` [MEDIUM] in `subsystem-4-0-02-selector-assignment-refactor-sql` as `database` from `02_selector_assignment_refactor.sql`.
  Evidence: 02_selector_assignment_refactor.sql:selection_processes, 02_selector_assignment_refactor.sql:joins, 02_selector_assignment_refactor.sql:joins
- `selector_age_access` [MEDIUM] in `subsystem-4-0-02-selector-assignment-refactor-sql` as `database` from `supabase_schema.sql`.
  Evidence: supabase_schema.sql:selector_age_access, supabase_schema.sql:queries, supabase_schema.sql:queries
- `selector_assignments` [MEDIUM] in `subsystem-4-0-02-selector-assignment-refactor-sql` as `database` from `02_selector_assignment_refactor.sql`.
  Evidence: 02_selector_assignment_refactor.sql:selector_assignments, 02_selector_assignment_refactor.sql:alters, 02_selector_assignment_refactor.sql:queries
- `selector_district_access` [MEDIUM] in `subsystem-4-0-02-selector-assignment-refactor-sql` as `database` from `supabase_schema.sql`.
  Evidence: supabase_schema.sql:selector_district_access, supabase_schema.sql:joins, supabase_schema.sql:queries
- `supabase_schema.sql` [MEDIUM] in `subsystem-4-0-02-selector-assignment-refactor-sql` as `database` from `supabase_schema.sql`.
  Evidence: supabase_schema.sql:supabase_schema.sql, supabase_schema.sql:alters, supabase_schema.sql:alters
- `team_players` [MEDIUM] in `subsystem-4-0-02-selector-assignment-refactor-sql` as `database` from `dummy_data.sql`.
  Evidence: dummy_data.sql:team_players, dummy_data.sql:writes, supabase_schema.sql:alters
- `teams` [MEDIUM] in `subsystem-4-0-02-selector-assignment-refactor-sql` as `database` from `03_season_management_architecture.sql`.
  Evidence: 03_season_management_architecture.sql:teams, 03_season_management_architecture.sql:alters, 03_season_management_architecture.sql:updates
- `the` [MEDIUM] in `subsystem-4-0-02-selector-assignment-refactor-sql` as `database` from `admin_password_reset.sql`.
  Evidence: admin_password_reset.sql:the, admin_password_reset.sql:updates
- `tournament_teams` [MEDIUM] in `subsystem-4-0-02-selector-assignment-refactor-sql` as `database` from `dummy_data.sql`.
  Evidence: dummy_data.sql:tournament_teams, dummy_data.sql:writes, supabase_schema.sql:alters
- `tournaments` [MEDIUM] in `subsystem-4-0-02-selector-assignment-refactor-sql` as `database` from `03_season_management_architecture.sql`.
  Evidence: 03_season_management_architecture.sql:tournaments, 03_season_management_architecture.sql:alters, 03_season_management_architecture.sql:joins
- `using` [MEDIUM] in `subsystem-4-0-02-selector-assignment-refactor-sql` as `database` from `06_match_finalization_policies.sql`.
  Evidence: 06_match_finalization_policies.sql:using, 06_match_finalization_policies.sql:updates, 06_match_finalization_policies.sql:updates
- `v_player_match_batting` [MEDIUM] in `subsystem-4-0-02-selector-assignment-refactor-sql` as `database` from `03_season_management_architecture.sql`.
  Evidence: 03_season_management_architecture.sql:v_player_match_batting, 03_season_management_architecture.sql:queries, supabase_schema.sql:queries
- `v_player_match_bowling` [MEDIUM] in `subsystem-4-0-02-selector-assignment-refactor-sql` as `database` from `03_season_management_architecture.sql`.
  Evidence: 03_season_management_architecture.sql:v_player_match_bowling, 03_season_management_architecture.sql:queries, supabase_schema.sql:queries
- `v_player_match_fielding` [MEDIUM] in `subsystem-4-0-02-selector-assignment-refactor-sql` as `database` from `supabase_schema.sql`.
  Evidence: supabase_schema.sql:v_player_match_fielding, supabase_schema.sql:queries
- `venues` [MEDIUM] in `subsystem-4-0-02-selector-assignment-refactor-sql` as `database` from `dummy_data.sql`.
  Evidence: dummy_data.sql:venues, dummy_data.sql:writes, supabase_schema.sql:alters
- `api.getRecycleBinItems` [HIGH] in `subsystem-40-0-src-components` as `route` from `src/components/screens/RecycleBinTab.jsx`.
  Evidence: src/components/screens/RecycleBinTab.jsx:api.getRecycleBinItems, src/components/screens/RecycleBinTab.jsx:calls
- `api.hardDeleteItem` [HIGH] in `subsystem-40-0-src-components` as `route` from `src/components/screens/RecycleBinTab.jsx`.
  Evidence: src/components/screens/RecycleBinTab.jsx:api.hardDeleteItem, src/components/screens/RecycleBinTab.jsx:calls
- `api.restoreItem` [HIGH] in `subsystem-40-0-src-components` as `route` from `src/components/screens/RecycleBinTab.jsx`.
  Evidence: src/components/screens/RecycleBinTab.jsx:api.restoreItem, src/components/screens/RecycleBinTab.jsx:calls
- `handleRestore()` [HIGH] in `subsystem-40-0-src-components` as `route` from `src/components/screens/RecycleBinTab.jsx`.
  Evidence: src/components/screens/RecycleBinTab.jsx:handleRestore(), src/components/screens/RecycleBinTab.jsx:calls, src/components/screens/RecycleBinTab.jsx:contains
- `stores` [MEDIUM] in `subsystem-41-0-src-lib` as `database` from `src/lib/db.js`.
  Evidence: src/lib/db.js:stores, src/lib/db.js:calls, src/lib/db.js:calls
- `api.getAnnouncements` [HIGH] in `subsystem-5-0-src-context` as `route` from `src/context/CricketContext.jsx`.
  Evidence: src/context/CricketContext.jsx:api.getAnnouncements, src/context/CricketContext.jsx:calls
- `api.getOrCreateInnings` [HIGH] in `subsystem-5-0-src-context` as `route` from `src/context/CricketContext.jsx`.
  Evidence: src/context/CricketContext.jsx:api.getOrCreateInnings, src/context/CricketContext.jsx:calls
- `App` [HIGH] in `subsystem-53-0-src-app-jsx` as `entrypoint` from `src/App.jsx`.
  Evidence: src/App.jsx:App, src/App.jsx:calls, temp_extraction/src/App.jsx:calls
- `MainApp()` [HIGH] in `subsystem-53-0-src-app-jsx` as `entrypoint` from `src/App.jsx`.
  Evidence: src/App.jsx:MainApp(), src/App.jsx:contains, temp_extraction/src/App.jsx:contains
- `RootRedirect()` [HIGH] in `subsystem-53-0-src-app-jsx` as `entrypoint` from `src/App.jsx`.
  Evidence: src/App.jsx:RootRedirect(), src/App.jsx:contains, temp_extraction/src/App.jsx:contains
- `drawer` [HIGH] in `subsystem-53-0-src-app-jsx` as `entrypoint` from `src/App.jsx`.
  Evidence: src/App.jsx:drawer, src/App.jsx:calls, temp_extraction/src/App.jsx:calls
- `motion/react` [HIGH] in `subsystem-53-0-src-app-jsx` as `entrypoint` from `src/App.jsx`.
  Evidence: src/App.jsx:motion/react, src/App.jsx:imports, src/components/AnimatedPage.jsx:imports
- `react` [HIGH] in `subsystem-53-0-src-app-jsx` as `entrypoint` from `src/App.jsx`.
  Evidence: src/App.jsx:react, src/App.jsx:imports, src/components/AnimatedPage.jsx:imports
- `react-router-dom` [HIGH] in `subsystem-53-0-src-app-jsx` as `entrypoint` from `src/App.jsx`.
  Evidence: src/App.jsx:react-router-dom, src/App.jsx:imports, src/components/ProtectedRoute.jsx:imports
- `src/App.jsx` [HIGH] in `subsystem-53-0-src-app-jsx` as `entrypoint` from `src/App.jsx`.
  Evidence: src/App.jsx:src/App.jsx, src/App.jsx:calls, src/App.jsx:contains
- `useCricket` [HIGH] in `subsystem-53-0-src-app-jsx` as `entrypoint` from `src/App.jsx`.
  Evidence: src/App.jsx:useCricket, src/components/BottomNav.jsx:calls, src/components/DrawerMenu.jsx:calls
- `api.getPlayerMatchStats` [HIGH] in `subsystem-56-0-src-components` as `route` from `src/components/screens/PlayerProfileScreen.jsx`.
  Evidence: src/components/screens/PlayerProfileScreen.jsx:api.getPlayerMatchStats, src/components/screens/PlayerProfileScreen.jsx:calls
- `MatchMediaReport` [MEDIUM] in `subsystem-58-0-src-components` as `database` from `src/components/ui/MatchMediaReport.jsx`.
  Evidence: src/components/ui/MatchMediaReport.jsx:MatchMediaReport, src/components/ui/MatchMediaReport.jsx:calls, temp_extraction/src/components/ui/MatchMediaReport.jsx:calls
- `clipboard.writeText` [MEDIUM] in `subsystem-58-0-src-components` as `cli` from `src/components/ui/MatchMediaReport.jsx`.
  Evidence: src/components/ui/MatchMediaReport.jsx:clipboard.writeText, src/components/ui/MatchMediaReport.jsx:calls, temp_extraction/src/components/ui/MatchMediaReport.jsx:calls
- `copy()` [MEDIUM] in `subsystem-58-0-src-components` as `database` from `src/components/ui/MatchMediaReport.jsx`.
  Evidence: src/components/ui/MatchMediaReport.jsx:copy(), src/components/ui/MatchMediaReport.jsx:calls, src/components/ui/MatchMediaReport.jsx:calls
- `generateMatchSummary` [MEDIUM] in `subsystem-58-0-src-components` as `database` from `src/components/ui/MatchMediaReport.jsx`.
  Evidence: src/components/ui/MatchMediaReport.jsx:generateMatchSummary, src/components/ui/MatchMediaReport.jsx:calls, temp_extraction/src/components/ui/MatchMediaReport.jsx:calls
- `generateSocialCaption` [MEDIUM] in `subsystem-58-0-src-components` as `database` from `src/components/ui/MatchMediaReport.jsx`.
  Evidence: src/components/ui/MatchMediaReport.jsx:generateSocialCaption, src/components/ui/MatchMediaReport.jsx:calls, temp_extraction/src/components/ui/MatchMediaReport.jsx:calls
- `navigator.share` [MEDIUM] in `subsystem-58-0-src-components` as `database` from `src/components/ui/MatchMediaReport.jsx`.
  Evidence: src/components/ui/MatchMediaReport.jsx:navigator.share, src/components/ui/MatchMediaReport.jsx:calls, temp_extraction/src/components/ui/MatchMediaReport.jsx:calls
- `setCopied` [MEDIUM] in `subsystem-58-0-src-components` as `database` from `src/components/ui/MatchMediaReport.jsx`.
  Evidence: src/components/ui/MatchMediaReport.jsx:setCopied, src/components/ui/MatchMediaReport.jsx:calls, temp_extraction/src/components/ui/MatchMediaReport.jsx:calls
- `src/components/ui/MatchMediaReport.jsx` [MEDIUM] in `subsystem-58-0-src-components` as `database` from `src/components/ui/MatchMediaReport.jsx`.
  Evidence: src/components/ui/MatchMediaReport.jsx:src/components/ui/MatchMediaReport.jsx, src/components/screens/MatchDetailScreen.jsx:imports, src/components/screens/MatchResultScreen.jsx:imports
- `RunsByMatchChart()` [MEDIUM] in `subsystem-6-0-src-components` as `cli` from `src/components/selection/PerformanceGraphs.jsx`.
  Evidence: src/components/selection/PerformanceGraphs.jsx:RunsByMatchChart(), src/components/selection/PerformanceGraphs.jsx:contains
- `runsValues.reduce` [MEDIUM] in `subsystem-6-0-src-components` as `cli` from `src/components/selection/PerformanceGraphs.jsx`.
  Evidence: src/components/selection/PerformanceGraphs.jsx:runsValues.reduce, src/components/selection/PerformanceGraphs.jsx:calls
- `api.assignScorer` [HIGH] in `subsystem-61-0-src-components` as `route` from `src/components/screens/MatchDetailScreen.jsx`.
  Evidence: src/components/screens/MatchDetailScreen.jsx:api.assignScorer, src/components/screens/MatchDetailScreen.jsx:calls
- `api.deleteMatch` [HIGH] in `subsystem-61-0-src-components` as `route` from `src/components/screens/MatchDetailScreen.jsx`.
  Evidence: src/components/screens/MatchDetailScreen.jsx:api.deleteMatch, src/components/screens/MatchDetailScreen.jsx:calls
- `fetchReport` [MEDIUM] in `subsystem-62-0-src-components` as `database` from `src/components/screens/MatchResultScreen.jsx`.
  Evidence: src/components/screens/MatchResultScreen.jsx:fetchReport, src/components/screens/MatchResultScreen.jsx:calls, src/components/screens/MatchResultScreen.jsx:calls
- `balls.forEach` [HIGH] in `subsystem-67-0-src-lib` as `route` from `src/lib/api.js`.
  Evidence: src/lib/api.js:balls.forEach, src/lib/api.js:calls
- `computeInningsStats()` [HIGH] in `subsystem-67-0-src-lib` as `route` from `src/lib/api.js`.
  Evidence: src/lib/api.js:computeInningsStats(), src/lib/api.js:calls, src/lib/api.js:calls
- `deliveries.filter` [HIGH] in `subsystem-67-0-src-lib` as `route` from `src/lib/api.js`.
  Evidence: src/lib/api.js:deliveries.filter, src/lib/api.js:calls
- `filter` [HIGH] in `subsystem-67-0-src-lib` as `route` from `src/lib/api.js`.
  Evidence: src/lib/api.js:filter, src/lib/api.js:calls, src/lib/api.js:calls
- `match` [HIGH] in `subsystem-67-0-src-lib` as `route` from `src/lib/api.js`.
  Evidence: src/lib/api.js:match, src/lib/api.js:calls, temp_extraction/src/engine/matchSummaryEngine.js:calls
- `replace` [HIGH] in `subsystem-67-0-src-lib` as `route` from `src/lib/api.js`.
  Evidence: src/lib/api.js:replace, temp_extraction/src/engine/matchSummaryEngine.js:calls, src/lib/api.js:calls
- `wicket_type.toLowerCase` [HIGH] in `subsystem-67-0-src-lib` as `route` from `src/lib/api.js`.
  Evidence: src/lib/api.js:wicket_type.toLowerCase, src/lib/api.js:calls
- `05_team_types.sql` [MEDIUM] in `subsystem-68-0-05-team-types-sql` as `database` from `05_team_types.sql`.
  Evidence: 05_team_types.sql:05_team_types.sql, 05_team_types.sql:alters, 05_team_types.sql:alters
- `district` [MEDIUM] in `subsystem-68-0-05-team-types-sql` as `database` from `05_team_types.sql`.
  Evidence: 05_team_types.sql:district, 05_team_types.sql:queries
- `final` [MEDIUM] in `subsystem-68-0-05-team-types-sql` as `database` from `05_team_types.sql`.
  Evidence: 05_team_types.sql:final, 05_team_types.sql:queries
- `public.districts` [MEDIUM] in `subsystem-68-0-05-team-types-sql` as `database` from `05_team_types.sql`.
  Evidence: 05_team_types.sql:public.districts, 05_team_types.sql:references
- `public.selection_processes` [MEDIUM] in `subsystem-68-0-05-team-types-sql` as `database` from `05_team_types.sql`.
  Evidence: 05_team_types.sql:public.selection_processes, 05_team_types.sql:alters, 05_team_types.sql:alters
- `public.teams` [MEDIUM] in `subsystem-68-0-05-team-types-sql` as `database` from `05_team_types.sql`.
  Evidence: 05_team_types.sql:public.teams, 05_team_types.sql:alters
- `api.deleteUser` [HIGH] in `subsystem-7-0-src-components` as `route` from `src/components/screens/AdministrationScreen.jsx`.
  Evidence: src/components/screens/AdministrationScreen.jsx:api.deleteUser, src/components/screens/AdministrationScreen.jsx:calls
- `api.getProfiles` [HIGH] in `subsystem-7-0-src-components` as `route` from `src/components/screens/AdministrationScreen.jsx`.
  Evidence: src/components/screens/AdministrationScreen.jsx:api.getProfiles, src/components/screens/AdministrationScreen.jsx:calls, src/components/screens/AdministrationScreen.jsx:calls
- `api.resetUserPassword` [HIGH] in `subsystem-7-0-src-components` as `route` from `src/components/screens/AdministrationScreen.jsx`.
  Evidence: src/components/screens/AdministrationScreen.jsx:api.resetUserPassword, src/components/screens/AdministrationScreen.jsx:calls
- `api.updateUserPermissions` [HIGH] in `subsystem-7-0-src-components` as `route` from `src/components/screens/AdministrationScreen.jsx`.
  Evidence: src/components/screens/AdministrationScreen.jsx:api.updateUserPermissions, src/components/screens/AdministrationScreen.jsx:calls
- `api.updateUserRole` [HIGH] in `subsystem-7-0-src-components` as `route` from `src/components/screens/AdministrationScreen.jsx`.
  Evidence: src/components/screens/AdministrationScreen.jsx:api.updateUserRole, src/components/screens/AdministrationScreen.jsx:calls, src/components/screens/AdministrationScreen.jsx:calls
- `api.updateUserStatus` [HIGH] in `subsystem-7-0-src-components` as `route` from `src/components/screens/AdministrationScreen.jsx`.
  Evidence: src/components/screens/AdministrationScreen.jsx:api.updateUserStatus, src/components/screens/AdministrationScreen.jsx:calls
- `handleResetPassword()` [HIGH] in `subsystem-7-0-src-components` as `route` from `src/components/screens/AdministrationScreen.jsx`.
  Evidence: src/components/screens/AdministrationScreen.jsx:handleResetPassword(), src/components/screens/AdministrationScreen.jsx:contains, src/components/screens/AdministrationScreen.jsx:calls
- `handleRoleChange()` [HIGH] in `subsystem-7-0-src-components` as `route` from `src/components/screens/AdministrationScreen.jsx`.
  Evidence: src/components/screens/AdministrationScreen.jsx:handleRoleChange(), src/components/screens/AdministrationScreen.jsx:calls, src/components/screens/AdministrationScreen.jsx:contains
- `createClient` [MEDIUM] in `subsystem-7-0-src-components` as `cli` from `src/components/screens/AdministrationScreen.jsx`.
  Evidence: src/components/screens/AdministrationScreen.jsx:createClient, src/components/screens/AdministrationScreen.jsx:calls
- `onClick` [MEDIUM] in `subsystem-79-0-src-components` as `cli` from `src/components/ui/MatchCard.jsx`.
  Evidence: src/components/ui/MatchCard.jsx:onClick, src/components/ui/MatchCard.jsx:calls
- `api.bulkMigratePlayers` [HIGH] in `subsystem-8-0-src-components` as `route` from `src/components/screens/SeasonMigrationTab.jsx`.
  Evidence: src/components/screens/SeasonMigrationTab.jsx:api.bulkMigratePlayers, src/components/screens/SeasonMigrationTab.jsx:calls, src/components/screens/SeasonMigrationTab.jsx:calls
- `api.getAgeCategories` [HIGH] in `subsystem-8-0-src-components` as `route` from `src/components/screens/SeasonMigrationTab.jsx`.
  Evidence: src/components/screens/SeasonMigrationTab.jsx:api.getAgeCategories, src/components/screens/SeasonMigrationTab.jsx:calls
- `api.getPlayersBySeason` [HIGH] in `subsystem-8-0-src-components` as `route` from `src/components/screens/SeasonMigrationTab.jsx`.
  Evidence: src/components/screens/SeasonMigrationTab.jsx:api.getPlayersBySeason, src/components/screens/SeasonMigrationTab.jsx:calls, src/components/screens/SeasonMigrationTab.jsx:calls
- `handleRemoveSingle()` [HIGH] in `subsystem-8-0-src-components` as `route` from `src/components/screens/SeasonMigrationTab.jsx`.
  Evidence: src/components/screens/SeasonMigrationTab.jsx:handleRemoveSingle(), src/components/screens/SeasonMigrationTab.jsx:calls, src/components/screens/SeasonMigrationTab.jsx:contains
- `api.assignManOfTheMatch` [HIGH] in `subsystem-80-0-src-components` as `route` from `src/components/screens/MatchResultScreen.jsx`.
  Evidence: src/components/screens/MatchResultScreen.jsx:api.assignManOfTheMatch, src/components/screens/MatchResultScreen.jsx:calls
- `api.getMatchScorecard` [HIGH] in `subsystem-80-0-src-components` as `route` from `src/components/screens/MatchResultScreen.jsx`.
  Evidence: src/components/screens/MatchResultScreen.jsx:api.getMatchScorecard, src/components/screens/MatchResultScreen.jsx:calls, src/components/screens/MatchResultScreen.jsx:calls
- `api.createDetailedMatches` [HIGH] in `subsystem-81-0-src-components` as `route` from `src/components/screens/TournamentsScreen.jsx`.
  Evidence: src/components/screens/TournamentsScreen.jsx:api.createDetailedMatches, src/components/screens/TournamentsScreen.jsx:calls, src/components/ui/TournamentManagerModal.jsx:calls
- `api.createTournament` [HIGH] in `subsystem-81-0-src-components` as `route` from `src/components/screens/TournamentsScreen.jsx`.
  Evidence: src/components/screens/TournamentsScreen.jsx:api.createTournament, src/components/screens/TournamentsScreen.jsx:calls, src/components/ui/TournamentManagerModal.jsx:calls
- `api.deleteTournament` [HIGH] in `subsystem-81-0-src-components` as `route` from `src/components/screens/TournamentsScreen.jsx`.
  Evidence: src/components/screens/TournamentsScreen.jsx:api.deleteTournament, src/components/screens/TournamentsScreen.jsx:calls
- `api.updateTournament` [HIGH] in `subsystem-81-0-src-components` as `route` from `src/components/screens/TournamentsScreen.jsx`.
  Evidence: src/components/screens/TournamentsScreen.jsx:api.updateTournament, src/components/screens/TournamentsScreen.jsx:calls, src/components/ui/TournamentManagerModal.jsx:calls
- `ProtectedRoute` [HIGH] in `subsystem-83-0-src-components` as `route` from `src/components/ProtectedRoute.jsx`.
  Evidence: src/components/ProtectedRoute.jsx:ProtectedRoute, src/components/ProtectedRoute.jsx:calls, temp_extraction/src/components/ProtectedRoute.jsx:calls
- `allowed.includes` [HIGH] in `subsystem-83-0-src-components` as `route` from `src/components/ProtectedRoute.jsx`.
  Evidence: src/components/ProtectedRoute.jsx:allowed.includes, src/components/ProtectedRoute.jsx:calls, temp_extraction/src/components/ProtectedRoute.jsx:calls
- `roleCanAccess()` [HIGH] in `subsystem-83-0-src-components` as `route` from `src/components/ProtectedRoute.jsx`.
  Evidence: src/components/ProtectedRoute.jsx:roleCanAccess(), src/components/ProtectedRoute.jsx:calls, src/components/ProtectedRoute.jsx:contains
- `src/components/ProtectedRoute.jsx` [HIGH] in `subsystem-83-0-src-components` as `route` from `src/components/ProtectedRoute.jsx`.
  Evidence: src/components/ProtectedRoute.jsx:src/components/ProtectedRoute.jsx, src/App.jsx:imports, src/components/ProtectedRoute.jsx:calls
- `api.rebuildTeams` [HIGH] in `subsystem-90-0-src-components` as `route` from `src/components/screens/TeamsScreen.jsx`.
  Evidence: src/components/screens/TeamsScreen.jsx:api.rebuildTeams, src/components/screens/TeamsScreen.jsx:calls
- `handleRebuildTeams()` [HIGH] in `subsystem-90-0-src-components` as `route` from `src/components/screens/TeamsScreen.jsx`.
  Evidence: src/components/screens/TeamsScreen.jsx:handleRebuildTeams(), src/components/screens/TeamsScreen.jsx:contains, src/components/screens/TeamsScreen.jsx:calls
- `api.finalizeSquad` [HIGH] in `subsystem-92-0-src-context` as `route` from `src/context/CricketContext.jsx`.
  Evidence: src/context/CricketContext.jsx:api.finalizeSquad, src/context/CricketContext.jsx:calls

## Key Flows

- `subsystem-0-0-src-lib` -> `subsystem-130-0-src-lib` [MEDIUM] via `imports`: imports x1 Evidence: src/lib/api.js:imports
- `subsystem-0-0-src-lib` -> `subsystem-16-0-src-components` [LOW] via `calls`: calls x6 Evidence: src/lib/api.js:calls, src/lib/api.js:calls, src/lib/api.js:calls
- `subsystem-0-0-src-lib` -> `subsystem-176-0-src-components` [LOW] via `calls`: calls x6 Evidence: src/lib/api.js:calls, src/lib/api.js:calls, src/lib/api.js:calls
- `subsystem-0-0-src-lib` -> `subsystem-178-0-src-engine` [LOW] via `calls`: calls x9 Evidence: src/lib/api.js:calls, src/lib/api.js:calls, src/lib/api.js:calls
- `subsystem-0-0-src-lib` -> `subsystem-23-0-src-engine` [LOW] via `calls`: calls x4 Evidence: src/lib/api.js:calls, src/lib/api.js:calls, src/lib/api.js:calls
- `subsystem-0-0-src-lib` -> `subsystem-27-0-apply-bug5-sql-js` [LOW] via `calls`: calls x7 Evidence: src/lib/api.js:calls, src/lib/api.js:calls, src/lib/api.js:calls
- `subsystem-0-0-src-lib` -> `subsystem-67-0-src-lib` [HIGH] via `calls`: calls x5, contains x1 Evidence: src/lib/api.js:calls, src/lib/api.js:calls, src/lib/api.js:calls
- `subsystem-0-0-src-lib` -> `subsystem-82-0-delete-season-js` [LOW] via `calls`: calls x98 Evidence: src/lib/api.js:calls, src/lib/api.js:calls, src/lib/api.js:calls
- `subsystem-1-0-src-context` -> `subsystem-0-0-src-lib` [MEDIUM] via `imports`: imports x1 Evidence: src/context/CricketContext.jsx:imports
- `subsystem-1-0-src-context` -> `subsystem-102-0-src-components` [LOW] via `calls`: calls x13 Evidence: src/context/CricketContext.jsx:calls, src/context/CricketContext.jsx:calls, src/context/CricketContext.jsx:calls
- `subsystem-1-0-src-context` -> `subsystem-105-0-src-components` [LOW] via `calls`: calls x2 Evidence: src/context/CricketContext.jsx:calls, temp_extraction/src/context/CricketContext.jsx:calls
- `subsystem-1-0-src-context` -> `subsystem-106-0-src-components` [LOW] via `calls`: calls x1 Evidence: src/context/CricketContext.jsx:calls
- `subsystem-1-0-src-context` -> `subsystem-108-0-src-components` [LOW] via `calls`: calls x1 Evidence: src/context/CricketContext.jsx:calls
- `subsystem-1-0-src-context` -> `subsystem-121-0-src-components` [LOW] via `calls`: calls x13 Evidence: src/context/CricketContext.jsx:calls, src/context/CricketContext.jsx:calls, src/context/CricketContext.jsx:calls
- `subsystem-1-0-src-context` -> `subsystem-127-0-src-data` [MEDIUM] via `imports`: imports x1 Evidence: src/context/CricketContext.jsx:imports
- `subsystem-1-0-src-context` -> `subsystem-130-0-src-lib` [MEDIUM] via `imports`: imports x1 Evidence: src/context/CricketContext.jsx:imports
- `subsystem-1-0-src-context` -> `subsystem-14-0-src-services` [MEDIUM] via `imports`: imports x1 Evidence: src/context/CricketContext.jsx:imports
- `subsystem-1-0-src-context` -> `subsystem-149-0-src-app-jsx` [LOW] via `calls`: calls x1 Evidence: src/context/CricketContext.jsx:calls
- `subsystem-1-0-src-context` -> `subsystem-154-0-src-components` [LOW] via `calls`: calls x1 Evidence: src/context/CricketContext.jsx:calls
- `subsystem-1-0-src-context` -> `subsystem-155-0-src-components` [LOW] via `calls`: calls x4 Evidence: src/context/CricketContext.jsx:calls, temp_extraction/src/context/CricketContext.jsx:calls, src/context/CricketContext.jsx:calls
- `subsystem-1-0-src-context` -> `subsystem-158-0-src-components` [LOW] via `calls`: calls x4 Evidence: src/context/CricketContext.jsx:calls, src/context/CricketContext.jsx:calls, src/context/CricketContext.jsx:calls
- `subsystem-1-0-src-context` -> `subsystem-163-0-src-components` [LOW] via `calls`: calls x1 Evidence: temp_extraction/src/context/CricketContext.jsx:calls
- `subsystem-1-0-src-context` -> `subsystem-165-0-src-components` [LOW] via `calls`: calls x2 Evidence: src/context/CricketContext.jsx:calls, temp_extraction/src/context/CricketContext.jsx:calls
- `subsystem-1-0-src-context` -> `subsystem-168-0-src-components` [LOW] via `calls`: calls x10 Evidence: src/context/CricketContext.jsx:calls, src/context/CricketContext.jsx:calls, src/context/CricketContext.jsx:calls
- `subsystem-1-0-src-context` -> `subsystem-172-0-src-components` [LOW] via `calls`: calls x2 Evidence: src/context/CricketContext.jsx:calls, temp_extraction/src/context/CricketContext.jsx:calls
- `subsystem-1-0-src-context` -> `subsystem-174-0-src-components` [LOW] via `calls`: calls x4 Evidence: src/context/CricketContext.jsx:calls, temp_extraction/src/context/CricketContext.jsx:calls, temp_extraction/src/context/CricketContext.jsx:calls
- `subsystem-1-0-src-context` -> `subsystem-177-0-src-components` [HIGH] via `imports`: imports x1 Evidence: src/context/CricketContext.jsx:imports
- `subsystem-1-0-src-context` -> `subsystem-19-0-src-components` [LOW] via `calls`: calls x2 Evidence: src/context/CricketContext.jsx:calls, temp_extraction/src/context/CricketContext.jsx:calls
- `subsystem-1-0-src-context` -> `subsystem-2-0-src-components` [LOW] via `calls`: calls x7 Evidence: src/context/CricketContext.jsx:calls, src/context/CricketContext.jsx:calls, temp_extraction/src/context/CricketContext.jsx:calls
- `subsystem-1-0-src-context` -> `subsystem-21-0-src-components` [LOW] via `calls`: calls x1 Evidence: src/context/CricketContext.jsx:calls
- `subsystem-1-0-src-context` -> `subsystem-29-0-src-components` [LOW] via `calls`: calls x8 Evidence: src/context/CricketContext.jsx:calls, src/context/CricketContext.jsx:calls, src/context/CricketContext.jsx:calls
- `subsystem-1-0-src-context` -> `subsystem-3-0-src-components` [LOW] via `calls`: calls x6 Evidence: src/context/CricketContext.jsx:calls, src/context/CricketContext.jsx:calls, src/context/CricketContext.jsx:calls
- `subsystem-1-0-src-context` -> `subsystem-33-0-src-components` [LOW] via `calls`: calls x1 Evidence: src/context/CricketContext.jsx:calls
- `subsystem-1-0-src-context` -> `subsystem-39-0-src-components` [LOW] via `calls`: calls x2 Evidence: src/context/CricketContext.jsx:calls, temp_extraction/src/context/CricketContext.jsx:calls
- `subsystem-1-0-src-context` -> `subsystem-41-0-src-lib` [MEDIUM] via `imports`: imports x1 Evidence: src/context/CricketContext.jsx:imports
- `subsystem-1-0-src-context` -> `subsystem-5-0-src-context` [HIGH] via `calls`: calls x5, contains x3 Evidence: src/context/CricketContext.jsx:calls, src/context/CricketContext.jsx:calls, src/context/CricketContext.jsx:contains
- `subsystem-1-0-src-context` -> `subsystem-53-0-src-app-jsx` [HIGH] via `imports`: imports x2 Evidence: src/context/CricketContext.jsx:imports, src/context/CricketContext.jsx:imports
- `subsystem-1-0-src-context` -> `subsystem-6-0-src-components` [LOW] via `calls`: calls x2 Evidence: src/context/CricketContext.jsx:calls, temp_extraction/src/context/CricketContext.jsx:calls
- `subsystem-1-0-src-context` -> `subsystem-7-0-src-components` [LOW] via `calls`: calls x4 Evidence: src/context/CricketContext.jsx:calls, src/context/CricketContext.jsx:calls, src/context/CricketContext.jsx:calls
- `subsystem-1-0-src-context` -> `subsystem-70-0-src-components` [LOW] via `calls`: calls x2 Evidence: src/context/CricketContext.jsx:calls, src/context/CricketContext.jsx:calls
- `subsystem-1-0-src-context` -> `subsystem-80-0-src-components` [LOW] via `calls`: calls x1 Evidence: src/context/CricketContext.jsx:calls
- `subsystem-1-0-src-context` -> `subsystem-88-0-src-components` [LOW] via `calls`: calls x50 Evidence: src/context/CricketContext.jsx:calls, src/context/CricketContext.jsx:calls, src/context/CricketContext.jsx:calls
- `subsystem-1-0-src-context` -> `subsystem-92-0-src-context` [HIGH] via `contains`: contains x2, calls x1 Evidence: src/context/CricketContext.jsx:calls, src/context/CricketContext.jsx:contains, src/context/CricketContext.jsx:contains
- `subsystem-1-0-src-context` -> `subsystem-98-0-temp-extraction` [LOW] via `calls`: calls x1 Evidence: temp_extraction/src/context/CricketContext.jsx:calls
- `subsystem-100-0-test-players3-js` -> `subsystem-0-0-src-lib` [LOW] via `calls`: calls x4 Evidence: test-players3.js:calls, test-players3.js:calls, test-players3.js:calls
- `subsystem-100-0-test-players3-js` -> `subsystem-27-0-apply-bug5-sql-js` [HIGH] via `calls`: calls x1, imports x1 Evidence: test-players3.js:calls, test-players3.js:imports
- `subsystem-100-0-test-players3-js` -> `subsystem-38-0-src-sw-js` [LOW] via `calls`: calls x1 Evidence: test-players3.js:calls
- `subsystem-100-0-test-players3-js` -> `subsystem-99-0-test-players2-js` [LOW] via `calls`: calls x1 Evidence: test-players3.js:calls
- `subsystem-101-0-test-stats-js` -> `subsystem-0-0-src-lib` [LOW] via `calls`: calls x27 Evidence: test-stats.js:calls, test-stats.js:calls, test-stats.js:calls
- `subsystem-101-0-test-stats-js` -> `subsystem-27-0-apply-bug5-sql-js` [HIGH] via `calls`: calls x10, imports x1 Evidence: test-stats.js:calls, test-stats.js:calls, test-stats.js:calls
- `subsystem-101-0-test-stats-js` -> `subsystem-41-0-src-lib` [LOW] via `calls`: calls x2 Evidence: test-stats.js:calls, test-stats.js:calls
- `subsystem-101-0-test-stats-js` -> `subsystem-82-0-delete-season-js` [LOW] via `calls`: calls x4 Evidence: test-stats.js:calls, test-stats.js:calls, test-stats.js:calls
- `subsystem-106-0-src-components` -> `subsystem-104-0-src-components` [LOW] via `calls`: calls x2 Evidence: src/components/screens/SeasonMigrationTab.jsx:calls, src/components/screens/SeasonMigrationTab.jsx:calls
- `subsystem-106-0-src-components` -> `subsystem-2-0-src-components` [LOW] via `calls`: calls x1 Evidence: src/components/screens/SeasonMigrationTab.jsx:calls
- `subsystem-106-0-src-components` -> `subsystem-8-0-src-components` [LOW] via `calls`: calls x2 Evidence: src/components/screens/SeasonMigrationTab.jsx:calls, src/components/screens/SeasonMigrationTab.jsx:calls
- `subsystem-109-0-scratch-check-enum-js` -> `subsystem-27-0-apply-bug5-sql-js` [HIGH] via `calls`: calls x5, imports x2 Evidence: scratch_check_enum.js:calls, scratch_check_enum.js:calls, scratch_check_enum.js:calls
- `subsystem-11-0-src-components` -> `subsystem-1-0-src-context` [MEDIUM] via `imports`: imports x1 Evidence: src/components/screens/PlayerRegistrationScreen.jsx:imports
- `subsystem-11-0-src-components` -> `subsystem-12-0-src-components` [MEDIUM] via `imports`: imports x1 Evidence: src/components/screens/PlayerRegistrationScreen.jsx:imports
- `subsystem-11-0-src-components` -> `subsystem-121-0-src-components` [LOW] via `calls`: calls x2 Evidence: src/components/screens/PlayerRegistrationScreen.jsx:calls, src/components/screens/PlayerRegistrationScreen.jsx:calls
- `subsystem-11-0-src-components` -> `subsystem-13-0-src-engine` [MEDIUM] via `imports`: imports x1 Evidence: src/components/screens/PlayerRegistrationScreen.jsx:imports
- `subsystem-11-0-src-components` -> `subsystem-148-0-temp-extraction` [MEDIUM] via `imports`: imports x1 Evidence: temp_extraction/src/components/screens/PlayerRegistrationScreen.jsx:imports
- `subsystem-11-0-src-components` -> `subsystem-162-0-src-components` [LOW] via `calls`: calls x2 Evidence: src/components/screens/PlayerRegistrationScreen.jsx:calls, temp_extraction/src/components/screens/PlayerRegistrationScreen.jsx:calls
- `subsystem-11-0-src-components` -> `subsystem-163-0-src-components` [LOW] via `calls`: calls x4 Evidence: src/components/screens/PlayerRegistrationScreen.jsx:calls, src/components/screens/PlayerRegistrationScreen.jsx:calls, temp_extraction/src/components/screens/PlayerRegistrationScreen.jsx:calls
- `subsystem-11-0-src-components` -> `subsystem-164-0-src-components` [LOW] via `calls`: calls x1 Evidence: src/components/screens/PlayerRegistrationScreen.jsx:calls
- `subsystem-11-0-src-components` -> `subsystem-179-0-temp-extraction` [LOW] via `calls`: calls x1 Evidence: temp_extraction/src/components/screens/PlayerRegistrationScreen.jsx:calls
- `subsystem-11-0-src-components` -> `subsystem-29-0-src-components` [HIGH] via `imports`: imports x2 Evidence: src/components/screens/PlayerRegistrationScreen.jsx:imports, temp_extraction/src/components/screens/PlayerRegistrationScreen.jsx:imports
- `subsystem-11-0-src-components` -> `subsystem-53-0-src-app-jsx` [HIGH] via `calls`: calls x2, imports x2 Evidence: src/components/screens/PlayerRegistrationScreen.jsx:calls, src/components/screens/PlayerRegistrationScreen.jsx:imports, temp_extraction/src/components/screens/PlayerRegistrationScreen.jsx:calls
- `subsystem-11-0-src-components` -> `subsystem-65-0-src-components` [HIGH] via `calls`: calls x2, contains x2 Evidence: src/components/screens/PlayerRegistrationScreen.jsx:calls, src/components/screens/PlayerRegistrationScreen.jsx:contains, temp_extraction/src/components/screens/PlayerRegistrationScreen.jsx:calls
- `subsystem-11-0-src-components` -> `subsystem-7-0-src-components` [LOW] via `calls`: calls x2 Evidence: src/components/screens/PlayerRegistrationScreen.jsx:calls, src/components/screens/PlayerRegistrationScreen.jsx:calls
- `subsystem-11-0-src-components` -> `subsystem-87-0-temp-extraction` [MEDIUM] via `imports`: imports x1 Evidence: temp_extraction/src/components/screens/PlayerRegistrationScreen.jsx:imports
- `subsystem-11-0-src-components` -> `subsystem-88-0-src-components` [LOW] via `calls`: calls x22 Evidence: src/components/screens/PlayerRegistrationScreen.jsx:calls, src/components/screens/PlayerRegistrationScreen.jsx:calls, src/components/screens/PlayerRegistrationScreen.jsx:calls
- `subsystem-11-0-src-components` -> `subsystem-98-0-temp-extraction` [MEDIUM] via `imports`: imports x1 Evidence: temp_extraction/src/components/screens/PlayerRegistrationScreen.jsx:imports
- `subsystem-110-0-src-components` -> `subsystem-53-0-src-app-jsx` [HIGH] via `imports`: imports x2 Evidence: src/components/AnimatedPage.jsx:imports, src/components/AnimatedPage.jsx:imports
- `subsystem-111-0-src-components` -> `subsystem-1-0-src-context` [MEDIUM] via `imports`: imports x1 Evidence: src/components/Header.jsx:imports
- `subsystem-111-0-src-components` -> `subsystem-29-0-src-components` [HIGH] via `calls`: calls x7, imports x1 Evidence: src/components/Header.jsx:calls, src/components/Header.jsx:calls, src/components/Header.jsx:calls
- `subsystem-111-0-src-components` -> `subsystem-53-0-src-app-jsx` [HIGH] via `calls`: calls x1, imports x1 Evidence: src/components/Header.jsx:calls, src/components/Header.jsx:imports
- `subsystem-111-0-src-components` -> `subsystem-88-0-src-components` [LOW] via `calls`: calls x1 Evidence: src/components/Header.jsx:calls
- `subsystem-112-0-src-components` -> `subsystem-51-0-src-components` [MEDIUM] via `imports`: imports x1 Evidence: src/components/selection/FinalSquad.jsx:imports
- `subsystem-112-0-src-components` -> `subsystem-53-0-src-app-jsx` [HIGH] via `imports`: imports x1 Evidence: src/components/selection/FinalSquad.jsx:imports
- `subsystem-113-0-src-components` -> `subsystem-159-0-src-components` [LOW] via `calls`: calls x6 Evidence: src/components/selection/PlayerComparison.jsx:calls, src/components/selection/PlayerComparison.jsx:calls, src/components/selection/PlayerComparison.jsx:calls
- `subsystem-113-0-src-components` -> `subsystem-29-0-src-components` [HIGH] via `imports`: imports x1 Evidence: src/components/selection/PlayerComparison.jsx:imports
- `subsystem-113-0-src-components` -> `subsystem-53-0-src-app-jsx` [HIGH] via `imports`: imports x1 Evidence: src/components/selection/PlayerComparison.jsx:imports
- `subsystem-114-0-src-components` -> `subsystem-170-0-src-components` [LOW] via `calls`: calls x1 Evidence: src/components/ui/BottomSheet.jsx:calls
- `subsystem-114-0-src-components` -> `subsystem-29-0-src-components` [HIGH] via `calls`: calls x1, imports x1 Evidence: src/components/ui/BottomSheet.jsx:calls, src/components/ui/BottomSheet.jsx:imports
- `subsystem-114-0-src-components` -> `subsystem-53-0-src-app-jsx` [HIGH] via `imports`: imports x2 Evidence: src/components/ui/BottomSheet.jsx:imports, src/components/ui/BottomSheet.jsx:imports
- `subsystem-115-0-src-components` -> `subsystem-29-0-src-components` [HIGH] via `imports`: imports x1 Evidence: src/components/ui/ErrorState.jsx:imports
- `subsystem-115-0-src-components` -> `subsystem-53-0-src-app-jsx` [HIGH] via `imports`: imports x1 Evidence: src/components/ui/ErrorState.jsx:imports
- `subsystem-116-0-src-components` -> `subsystem-29-0-src-components` [HIGH] via `imports`: imports x1 Evidence: src/components/ui/Modal.jsx:imports
- `subsystem-116-0-src-components` -> `subsystem-53-0-src-app-jsx` [HIGH] via `imports`: imports x1 Evidence: src/components/ui/Modal.jsx:imports
- `subsystem-117-0-src-components` -> `subsystem-53-0-src-app-jsx` [HIGH] via `imports`: imports x1 Evidence: src/components/ui/Skeleton.jsx:imports
- `subsystem-118-0-temp-extraction` -> `subsystem-104-0-src-components` [LOW] via `calls`: calls x4 Evidence: temp_extraction/src/components/screens/SelectionScreen.jsx:calls, temp_extraction/src/components/screens/SelectionScreen.jsx:calls, temp_extraction/src/components/screens/SelectionScreen.jsx:calls
- `subsystem-118-0-temp-extraction` -> `subsystem-106-0-src-components` [LOW] via `calls`: calls x1 Evidence: temp_extraction/src/components/screens/SelectionScreen.jsx:calls
- `subsystem-118-0-temp-extraction` -> `subsystem-145-0-temp-extraction` [MEDIUM] via `imports`: imports x1 Evidence: temp_extraction/src/components/screens/SelectionScreen.jsx:imports
- `subsystem-118-0-temp-extraction` -> `subsystem-150-0-src-components` [LOW] via `calls`: calls x6 Evidence: temp_extraction/src/components/screens/SelectionScreen.jsx:calls, temp_extraction/src/components/screens/SelectionScreen.jsx:calls, temp_extraction/src/components/screens/SelectionScreen.jsx:calls
- `subsystem-118-0-temp-extraction` -> `subsystem-153-0-src-components` [LOW] via `calls`: calls x1 Evidence: temp_extraction/src/components/screens/SelectionScreen.jsx:calls
- `subsystem-118-0-temp-extraction` -> `subsystem-161-0-src-components` [LOW] via `calls`: calls x1 Evidence: temp_extraction/src/components/screens/SelectionScreen.jsx:calls
- `subsystem-118-0-temp-extraction` -> `subsystem-162-0-src-components` [LOW] via `calls`: calls x1 Evidence: temp_extraction/src/components/screens/SelectionScreen.jsx:calls
- `subsystem-118-0-temp-extraction` -> `subsystem-167-0-src-components` [LOW] via `calls`: calls x1 Evidence: temp_extraction/src/components/screens/SelectionScreen.jsx:calls
- `subsystem-118-0-temp-extraction` -> `subsystem-179-0-temp-extraction` [LOW] via `calls`: calls x1 Evidence: temp_extraction/src/components/screens/SelectionScreen.jsx:calls
- `subsystem-118-0-temp-extraction` -> `subsystem-30-0-src-components` [LOW] via `calls`: calls x13 Evidence: temp_extraction/src/components/screens/SelectionScreen.jsx:calls, temp_extraction/src/components/screens/SelectionScreen.jsx:calls, temp_extraction/src/components/screens/SelectionScreen.jsx:calls
- `subsystem-118-0-temp-extraction` -> `subsystem-32-0-src-components` [HIGH] via `calls`: calls x5, contains x1 Evidence: temp_extraction/src/components/screens/SelectionScreen.jsx:calls, temp_extraction/src/components/screens/SelectionScreen.jsx:calls, temp_extraction/src/components/screens/SelectionScreen.jsx:calls
- `subsystem-118-0-temp-extraction` -> `subsystem-33-0-src-components` [LOW] via `calls`: calls x3 Evidence: temp_extraction/src/components/screens/SelectionScreen.jsx:calls, temp_extraction/src/components/screens/SelectionScreen.jsx:calls, temp_extraction/src/components/screens/SelectionScreen.jsx:calls
- `subsystem-118-0-temp-extraction` -> `subsystem-53-0-src-app-jsx` [HIGH] via `calls`: calls x1, imports x1 Evidence: temp_extraction/src/components/screens/SelectionScreen.jsx:calls, temp_extraction/src/components/screens/SelectionScreen.jsx:imports
- `subsystem-118-0-temp-extraction` -> `subsystem-77-0-src-components` [LOW] via `calls`: calls x2 Evidence: temp_extraction/src/components/screens/SelectionScreen.jsx:calls, temp_extraction/src/components/screens/SelectionScreen.jsx:calls
- `subsystem-118-0-temp-extraction` -> `subsystem-87-0-temp-extraction` [MEDIUM] via `imports`: imports x1 Evidence: temp_extraction/src/components/screens/SelectionScreen.jsx:imports
- `subsystem-118-0-temp-extraction` -> `subsystem-88-0-src-components` [LOW] via `calls`: calls x7 Evidence: temp_extraction/src/components/screens/SelectionScreen.jsx:calls, temp_extraction/src/components/screens/SelectionScreen.jsx:calls, temp_extraction/src/components/screens/SelectionScreen.jsx:calls
- `subsystem-118-0-temp-extraction` -> `subsystem-89-0-src-components` [HIGH] via `contains`: contains x1 Evidence: temp_extraction/src/components/screens/SelectionScreen.jsx:contains
- `subsystem-118-0-temp-extraction` -> `subsystem-9-0-src-components` [MEDIUM] via `imports`: imports x1 Evidence: temp_extraction/src/components/screens/SelectionScreen.jsx:imports
- `subsystem-118-0-temp-extraction` -> `subsystem-98-0-temp-extraction` [MEDIUM] via `imports`: imports x1 Evidence: temp_extraction/src/components/screens/SelectionScreen.jsx:imports
- `subsystem-119-0-temp-extraction` -> `subsystem-145-0-temp-extraction` [MEDIUM] via `imports`: imports x1 Evidence: temp_extraction/src/components/ui/MatchFolder.jsx:imports
- `subsystem-119-0-temp-extraction` -> `subsystem-29-0-src-components` [HIGH] via `imports`: imports x1 Evidence: temp_extraction/src/components/ui/MatchFolder.jsx:imports
- `subsystem-119-0-temp-extraction` -> `subsystem-3-0-src-components` [LOW] via `calls`: calls x1 Evidence: temp_extraction/src/components/ui/MatchFolder.jsx:calls
- `subsystem-119-0-temp-extraction` -> `subsystem-53-0-src-app-jsx` [HIGH] via `imports`: imports x1 Evidence: temp_extraction/src/components/ui/MatchFolder.jsx:imports
- `subsystem-119-0-temp-extraction` -> `subsystem-88-0-src-components` [LOW] via `calls`: calls x1 Evidence: temp_extraction/src/components/ui/MatchFolder.jsx:calls
- `subsystem-12-0-src-components` -> `subsystem-53-0-src-app-jsx` [HIGH] via `imports`: imports x1 Evidence: src/components/ui/CloudinaryAvatar.jsx:imports
- `subsystem-12-0-src-components` -> `subsystem-56-0-src-components` [LOW] via `calls`: calls x1 Evidence: src/components/ui/CloudinaryAvatar.jsx:calls
- `subsystem-120-0-test-players-js` -> `subsystem-0-0-src-lib` [LOW] via `calls`: calls x4 Evidence: test-players.js:calls, test-players.js:calls, test-players.js:calls
- `subsystem-120-0-test-players-js` -> `subsystem-27-0-apply-bug5-sql-js` [HIGH] via `calls`: calls x6, imports x2 Evidence: test-players.js:calls, test-players.js:calls, test-players.js:calls
- `subsystem-120-0-test-players-js` -> `subsystem-82-0-delete-season-js` [LOW] via `calls`: calls x1 Evidence: test-players.js:calls
- `subsystem-120-0-test-players-js` -> `subsystem-99-0-test-players2-js` [LOW] via `calls`: calls x2 Evidence: test-players.js:calls, test-players.js:calls
- `subsystem-125-0-temp-extraction` -> `subsystem-152-0-src-components` [LOW] via `calls`: calls x1 Evidence: temp_extraction/src/components/screens/AuthScreen.jsx:calls
- `subsystem-125-0-temp-extraction` -> `subsystem-29-0-src-components` [LOW] via `calls`: calls x4 Evidence: temp_extraction/src/components/screens/AuthScreen.jsx:calls, temp_extraction/src/components/screens/AuthScreen.jsx:calls, temp_extraction/src/components/screens/AuthScreen.jsx:calls
- `subsystem-125-0-temp-extraction` -> `subsystem-5-0-src-context` [LOW] via `calls`: calls x2 Evidence: temp_extraction/src/components/screens/AuthScreen.jsx:calls, temp_extraction/src/components/screens/AuthScreen.jsx:calls
- `subsystem-129-0-src-lib` -> `subsystem-130-0-src-lib` [MEDIUM] via `imports`: imports x1 Evidence: src/lib/standings.js:imports
- `subsystem-129-0-src-lib` -> `subsystem-18-0-src-lib` [HIGH] via `contains`: contains x1 Evidence: src/lib/standings.js:contains
- `subsystem-129-0-src-lib` -> `subsystem-52-0-src-hooks` [HIGH] via `imports`: imports x1 Evidence: src/lib/standings.js:imports
- `subsystem-13-0-src-engine` -> `subsystem-16-0-src-components` [LOW] via `calls`: calls x6 Evidence: src/engine/validationSchemas.js:calls, src/engine/validationSchemas.js:calls, src/engine/validationSchemas.js:calls
- `subsystem-13-0-src-engine` -> `subsystem-178-0-src-engine` [LOW] via `calls`: calls x1 Evidence: src/engine/validationSchemas.js:calls
- `subsystem-130-0-src-lib` -> `subsystem-0-0-src-lib` [LOW] via `calls`: calls x1 Evidence: src/lib/supabase.js:calls
- `subsystem-130-0-src-lib` -> `subsystem-27-0-apply-bug5-sql-js` [HIGH] via `calls`: calls x1, imports x1 Evidence: src/lib/supabase.js:calls, src/lib/supabase.js:imports
- `subsystem-131-0-temp-extraction` -> `subsystem-11-0-src-components` [MEDIUM] via `imports`: imports x1 Evidence: temp_extraction/src/App.jsx:imports
- `subsystem-131-0-temp-extraction` -> `subsystem-118-0-temp-extraction` [MEDIUM] via `imports`: imports x1 Evidence: temp_extraction/src/App.jsx:imports
- `subsystem-131-0-temp-extraction` -> `subsystem-132-0-temp-extraction` [MEDIUM] via `imports`: imports x1 Evidence: temp_extraction/src/App.jsx:imports
- `subsystem-131-0-temp-extraction` -> `subsystem-133-0-temp-extraction` [MEDIUM] via `imports`: imports x1 Evidence: temp_extraction/src/App.jsx:imports
- `subsystem-131-0-temp-extraction` -> `subsystem-134-0-temp-extraction` [MEDIUM] via `imports`: imports x1 Evidence: temp_extraction/src/App.jsx:imports
- `subsystem-131-0-temp-extraction` -> `subsystem-135-0-temp-extraction` [MEDIUM] via `imports`: imports x1 Evidence: temp_extraction/src/App.jsx:imports
- `subsystem-131-0-temp-extraction` -> `subsystem-136-0-temp-extraction` [MEDIUM] via `imports`: imports x1 Evidence: temp_extraction/src/App.jsx:imports
- `subsystem-131-0-temp-extraction` -> `subsystem-137-0-temp-extraction` [MEDIUM] via `imports`: imports x1 Evidence: temp_extraction/src/App.jsx:imports
- `subsystem-131-0-temp-extraction` -> `subsystem-138-0-temp-extraction` [MEDIUM] via `imports`: imports x1 Evidence: temp_extraction/src/App.jsx:imports
- `subsystem-131-0-temp-extraction` -> `subsystem-139-0-temp-extraction` [MEDIUM] via `imports`: imports x1 Evidence: temp_extraction/src/App.jsx:imports
- `subsystem-131-0-temp-extraction` -> `subsystem-140-0-temp-extraction` [MEDIUM] via `imports`: imports x1 Evidence: temp_extraction/src/App.jsx:imports
- `subsystem-131-0-temp-extraction` -> `subsystem-141-0-temp-extraction` [MEDIUM] via `imports`: imports x1 Evidence: temp_extraction/src/App.jsx:imports
- `subsystem-131-0-temp-extraction` -> `subsystem-142-0-temp-extraction` [MEDIUM] via `imports`: imports x1 Evidence: temp_extraction/src/App.jsx:imports
- `subsystem-131-0-temp-extraction` -> `subsystem-143-0-temp-extraction` [MEDIUM] via `imports`: imports x1 Evidence: temp_extraction/src/App.jsx:imports
- `subsystem-131-0-temp-extraction` -> `subsystem-144-0-temp-extraction` [MEDIUM] via `imports`: imports x1 Evidence: temp_extraction/src/App.jsx:imports
- `subsystem-131-0-temp-extraction` -> `subsystem-2-0-src-components` [MEDIUM] via `imports`: imports x1 Evidence: temp_extraction/src/App.jsx:imports
- `subsystem-131-0-temp-extraction` -> `subsystem-26-0-temp-extraction` [MEDIUM] via `imports`: imports x1 Evidence: temp_extraction/src/App.jsx:imports
- `subsystem-131-0-temp-extraction` -> `subsystem-3-0-src-components` [MEDIUM] via `imports`: imports x1 Evidence: temp_extraction/src/App.jsx:imports
- `subsystem-131-0-temp-extraction` -> `subsystem-42-0-temp-extraction` [MEDIUM] via `imports`: imports x1 Evidence: temp_extraction/src/App.jsx:imports
- `subsystem-131-0-temp-extraction` -> `subsystem-53-0-src-app-jsx` [HIGH] via `contains`: imports x2, contains x2 Evidence: temp_extraction/src/App.jsx:calls, temp_extraction/src/App.jsx:contains, temp_extraction/src/App.jsx:contains
- `subsystem-131-0-temp-extraction` -> `subsystem-59-0-temp-extraction` [MEDIUM] via `imports`: imports x1 Evidence: temp_extraction/src/App.jsx:imports
- `subsystem-131-0-temp-extraction` -> `subsystem-60-0-temp-extraction` [MEDIUM] via `imports`: imports x1 Evidence: temp_extraction/src/App.jsx:imports
- `subsystem-131-0-temp-extraction` -> `subsystem-64-0-temp-extraction` [MEDIUM] via `imports`: imports x1 Evidence: temp_extraction/src/App.jsx:imports
- `subsystem-131-0-temp-extraction` -> `subsystem-72-0-temp-extraction` [MEDIUM] via `imports`: imports x1 Evidence: temp_extraction/src/App.jsx:imports
- `subsystem-131-0-temp-extraction` -> `subsystem-96-0-temp-extraction` [MEDIUM] via `imports`: imports x1 Evidence: temp_extraction/src/App.jsx:imports
- `subsystem-131-0-temp-extraction` -> `subsystem-97-0-temp-extraction` [MEDIUM] via `imports`: imports x1 Evidence: temp_extraction/src/App.jsx:imports
- `subsystem-131-0-temp-extraction` -> `subsystem-98-0-temp-extraction` [MEDIUM] via `imports`: imports x1 Evidence: temp_extraction/src/App.jsx:imports
- `subsystem-132-0-temp-extraction` -> `subsystem-145-0-temp-extraction` [MEDIUM] via `imports`: imports x1 Evidence: temp_extraction/src/components/DrawerMenu.jsx:imports
- `subsystem-132-0-temp-extraction` -> `subsystem-29-0-src-components` [LOW] via `calls`: calls x2 Evidence: temp_extraction/src/components/DrawerMenu.jsx:calls, temp_extraction/src/components/DrawerMenu.jsx:calls
- `subsystem-132-0-temp-extraction` -> `subsystem-47-0-src-components` [HIGH] via `calls`: calls x11, contains x2 Evidence: temp_extraction/src/components/DrawerMenu.jsx:calls, temp_extraction/src/components/DrawerMenu.jsx:calls, temp_extraction/src/components/DrawerMenu.jsx:calls
- `subsystem-132-0-temp-extraction` -> `subsystem-53-0-src-app-jsx` [HIGH] via `calls`: calls x1, imports x1 Evidence: temp_extraction/src/components/DrawerMenu.jsx:calls, temp_extraction/src/components/DrawerMenu.jsx:imports
- `subsystem-132-0-temp-extraction` -> `subsystem-6-0-src-components` [LOW] via `imports`: imports x1 Evidence: temp_extraction/src/components/DrawerMenu.jsx:imports
- `subsystem-132-0-temp-extraction` -> `subsystem-88-0-src-components` [LOW] via `calls`: calls x4 Evidence: temp_extraction/src/components/DrawerMenu.jsx:calls, temp_extraction/src/components/DrawerMenu.jsx:calls, temp_extraction/src/components/DrawerMenu.jsx:calls
- `subsystem-132-0-temp-extraction` -> `subsystem-96-0-temp-extraction` [LOW] via `calls`: calls x2 Evidence: temp_extraction/src/components/DrawerMenu.jsx:calls, temp_extraction/src/components/DrawerMenu.jsx:calls
- `subsystem-132-0-temp-extraction` -> `subsystem-98-0-temp-extraction` [MEDIUM] via `imports`: imports x1 Evidence: temp_extraction/src/components/DrawerMenu.jsx:imports
- `subsystem-133-0-temp-extraction` -> `subsystem-111-0-src-components` [LOW] via `calls`: calls x1 Evidence: temp_extraction/src/components/Header.jsx:calls
- `subsystem-133-0-temp-extraction` -> `subsystem-145-0-temp-extraction` [MEDIUM] via `imports`: imports x1 Evidence: temp_extraction/src/components/Header.jsx:imports
- `subsystem-133-0-temp-extraction` -> `subsystem-29-0-src-components` [LOW] via `calls`: calls x1 Evidence: temp_extraction/src/components/Header.jsx:calls
- `subsystem-133-0-temp-extraction` -> `subsystem-47-0-src-components` [LOW] via `calls`: calls x4 Evidence: temp_extraction/src/components/Header.jsx:calls, temp_extraction/src/components/Header.jsx:calls, temp_extraction/src/components/Header.jsx:calls
- `subsystem-133-0-temp-extraction` -> `subsystem-53-0-src-app-jsx` [HIGH] via `calls`: calls x1, imports x1 Evidence: temp_extraction/src/components/Header.jsx:calls, temp_extraction/src/components/Header.jsx:imports
- `subsystem-133-0-temp-extraction` -> `subsystem-98-0-temp-extraction` [MEDIUM] via `imports`: imports x1 Evidence: temp_extraction/src/components/Header.jsx:imports
- `subsystem-134-0-temp-extraction` -> `subsystem-53-0-src-app-jsx` [HIGH] via `imports`: imports x2, calls x1 Evidence: temp_extraction/src/components/ProtectedRoute.jsx:calls, temp_extraction/src/components/ProtectedRoute.jsx:imports, temp_extraction/src/components/ProtectedRoute.jsx:imports
- `subsystem-134-0-temp-extraction` -> `subsystem-83-0-src-components` [HIGH] via `calls`: calls x2, contains x1 Evidence: temp_extraction/src/components/ProtectedRoute.jsx:calls, temp_extraction/src/components/ProtectedRoute.jsx:calls, temp_extraction/src/components/ProtectedRoute.jsx:contains
- `subsystem-134-0-temp-extraction` -> `subsystem-98-0-temp-extraction` [MEDIUM] via `imports`: imports x1 Evidence: temp_extraction/src/components/ProtectedRoute.jsx:imports
- `subsystem-135-0-temp-extraction` -> `subsystem-2-0-src-components` [LOW] via `calls`: calls x1 Evidence: temp_extraction/src/components/screens/AccessControlScreen.jsx:calls
- `subsystem-135-0-temp-extraction` -> `subsystem-29-0-src-components` [HIGH] via `imports`: imports x1 Evidence: temp_extraction/src/components/screens/AccessControlScreen.jsx:imports
- `subsystem-135-0-temp-extraction` -> `subsystem-53-0-src-app-jsx` [HIGH] via `calls`: calls x1, imports x1 Evidence: temp_extraction/src/components/screens/AccessControlScreen.jsx:calls, temp_extraction/src/components/screens/AccessControlScreen.jsx:imports
- `subsystem-135-0-temp-extraction` -> `subsystem-93-0-src-components` [LOW] via `calls`: calls x2 Evidence: temp_extraction/src/components/screens/AccessControlScreen.jsx:calls, temp_extraction/src/components/screens/AccessControlScreen.jsx:calls
- `subsystem-135-0-temp-extraction` -> `subsystem-98-0-temp-extraction` [MEDIUM] via `imports`: imports x1 Evidence: temp_extraction/src/components/screens/AccessControlScreen.jsx:imports
- `subsystem-136-0-temp-extraction` -> `subsystem-125-0-temp-extraction` [HIGH] via `contains`: contains x1 Evidence: temp_extraction/src/components/screens/AuthScreen.jsx:contains
- `subsystem-136-0-temp-extraction` -> `subsystem-134-0-temp-extraction` [MEDIUM] via `imports`: imports x1 Evidence: temp_extraction/src/components/screens/AuthScreen.jsx:imports
- `subsystem-136-0-temp-extraction` -> `subsystem-29-0-src-components` [HIGH] via `imports`: imports x1 Evidence: temp_extraction/src/components/screens/AuthScreen.jsx:imports
- `subsystem-136-0-temp-extraction` -> `subsystem-30-0-src-components` [LOW] via `calls`: calls x2 Evidence: temp_extraction/src/components/screens/AuthScreen.jsx:calls, temp_extraction/src/components/screens/AuthScreen.jsx:calls
- `subsystem-136-0-temp-extraction` -> `subsystem-53-0-src-app-jsx` [HIGH] via `calls`: calls x1, imports x1 Evidence: temp_extraction/src/components/screens/AuthScreen.jsx:calls, temp_extraction/src/components/screens/AuthScreen.jsx:imports
- `subsystem-136-0-temp-extraction` -> `subsystem-65-0-src-components` [LOW] via `calls`: calls x1 Evidence: temp_extraction/src/components/screens/AuthScreen.jsx:calls
- `subsystem-136-0-temp-extraction` -> `subsystem-7-0-src-components` [LOW] via `calls`: calls x1 Evidence: temp_extraction/src/components/screens/AuthScreen.jsx:calls
- `subsystem-136-0-temp-extraction` -> `subsystem-73-0-src-components` [HIGH] via `contains`: contains x1 Evidence: temp_extraction/src/components/screens/AuthScreen.jsx:contains
- `subsystem-136-0-temp-extraction` -> `subsystem-74-0-src-components` [LOW] via `calls`: calls x2 Evidence: temp_extraction/src/components/screens/AuthScreen.jsx:calls, temp_extraction/src/components/screens/AuthScreen.jsx:calls
- `subsystem-136-0-temp-extraction` -> `subsystem-88-0-src-components` [LOW] via `calls`: calls x2 Evidence: temp_extraction/src/components/screens/AuthScreen.jsx:calls, temp_extraction/src/components/screens/AuthScreen.jsx:calls
- `subsystem-136-0-temp-extraction` -> `subsystem-98-0-temp-extraction` [MEDIUM] via `imports`: imports x1 Evidence: temp_extraction/src/components/screens/AuthScreen.jsx:imports
- `subsystem-137-0-temp-extraction` -> `subsystem-145-0-temp-extraction` [MEDIUM] via `imports`: imports x1 Evidence: temp_extraction/src/components/screens/InningsBreakScreen.jsx:imports
- `subsystem-137-0-temp-extraction` -> `subsystem-157-0-src-components` [LOW] via `calls`: calls x2 Evidence: temp_extraction/src/components/screens/InningsBreakScreen.jsx:calls, temp_extraction/src/components/screens/InningsBreakScreen.jsx:calls
- `subsystem-137-0-temp-extraction` -> `subsystem-29-0-src-components` [HIGH] via `calls`: calls x1, imports x1 Evidence: temp_extraction/src/components/screens/InningsBreakScreen.jsx:calls, temp_extraction/src/components/screens/InningsBreakScreen.jsx:imports
- `subsystem-137-0-temp-extraction` -> `subsystem-53-0-src-app-jsx` [HIGH] via `calls`: calls x1, imports x1 Evidence: temp_extraction/src/components/screens/InningsBreakScreen.jsx:calls, temp_extraction/src/components/screens/InningsBreakScreen.jsx:imports
- `subsystem-137-0-temp-extraction` -> `subsystem-6-0-src-components` [MEDIUM] via `imports`: imports x1 Evidence: temp_extraction/src/components/screens/InningsBreakScreen.jsx:imports
- `subsystem-137-0-temp-extraction` -> `subsystem-84-0-src-components` [HIGH] via `calls`: calls x2, contains x1 Evidence: temp_extraction/src/components/screens/InningsBreakScreen.jsx:calls, temp_extraction/src/components/screens/InningsBreakScreen.jsx:calls, temp_extraction/src/components/screens/InningsBreakScreen.jsx:contains
- `subsystem-137-0-temp-extraction` -> `subsystem-87-0-temp-extraction` [MEDIUM] via `imports`: imports x1 Evidence: temp_extraction/src/components/screens/InningsBreakScreen.jsx:imports
- `subsystem-137-0-temp-extraction` -> `subsystem-98-0-temp-extraction` [MEDIUM] via `imports`: imports x1 Evidence: temp_extraction/src/components/screens/InningsBreakScreen.jsx:imports
- `subsystem-138-0-temp-extraction` -> `subsystem-146-0-temp-extraction` [MEDIUM] via `imports`: imports x1 Evidence: temp_extraction/src/components/screens/MatchDetailScreen.jsx:imports
- `subsystem-138-0-temp-extraction` -> `subsystem-2-0-src-components` [MEDIUM] via `calls`: calls x2, imports x1 Evidence: temp_extraction/src/components/screens/MatchDetailScreen.jsx:calls, temp_extraction/src/components/screens/MatchDetailScreen.jsx:calls, temp_extraction/src/components/screens/MatchDetailScreen.jsx:imports
- `subsystem-138-0-temp-extraction` -> `subsystem-29-0-src-components` [HIGH] via `calls`: calls x1, imports x1 Evidence: temp_extraction/src/components/screens/MatchDetailScreen.jsx:calls, temp_extraction/src/components/screens/MatchDetailScreen.jsx:imports
- `subsystem-138-0-temp-extraction` -> `subsystem-50-0-temp-extraction` [MEDIUM] via `imports`: imports x1 Evidence: temp_extraction/src/components/screens/MatchDetailScreen.jsx:imports
- `subsystem-138-0-temp-extraction` -> `subsystem-53-0-src-app-jsx` [HIGH] via `calls`: calls x1, imports x1 Evidence: temp_extraction/src/components/screens/MatchDetailScreen.jsx:calls, temp_extraction/src/components/screens/MatchDetailScreen.jsx:imports
- `subsystem-138-0-temp-extraction` -> `subsystem-6-0-src-components` [LOW] via `calls`: calls x1 Evidence: temp_extraction/src/components/screens/MatchDetailScreen.jsx:calls
- `subsystem-138-0-temp-extraction` -> `subsystem-69-0-src-components` [LOW] via `calls`: calls x3 Evidence: temp_extraction/src/components/screens/MatchDetailScreen.jsx:calls, temp_extraction/src/components/screens/MatchDetailScreen.jsx:calls, temp_extraction/src/components/screens/MatchDetailScreen.jsx:calls
- `subsystem-138-0-temp-extraction` -> `subsystem-98-0-temp-extraction` [MEDIUM] via `imports`: imports x1 Evidence: temp_extraction/src/components/screens/MatchDetailScreen.jsx:imports
- `subsystem-139-0-temp-extraction` -> `subsystem-145-0-temp-extraction` [MEDIUM] via `imports`: imports x1 Evidence: temp_extraction/src/components/screens/MatchOverviewScreen.jsx:imports
- `subsystem-139-0-temp-extraction` -> `subsystem-29-0-src-components` [LOW] via `calls`: calls x2 Evidence: temp_extraction/src/components/screens/MatchOverviewScreen.jsx:calls, temp_extraction/src/components/screens/MatchOverviewScreen.jsx:calls
- `subsystem-139-0-temp-extraction` -> `subsystem-53-0-src-app-jsx` [HIGH] via `calls`: calls x1, imports x1 Evidence: temp_extraction/src/components/screens/MatchOverviewScreen.jsx:calls, temp_extraction/src/components/screens/MatchOverviewScreen.jsx:imports
- `subsystem-139-0-temp-extraction` -> `subsystem-85-0-src-components` [LOW] via `calls`: calls x3 Evidence: temp_extraction/src/components/screens/MatchOverviewScreen.jsx:calls, temp_extraction/src/components/screens/MatchOverviewScreen.jsx:calls, temp_extraction/src/components/screens/MatchOverviewScreen.jsx:calls
- `subsystem-139-0-temp-extraction` -> `subsystem-87-0-temp-extraction` [MEDIUM] via `imports`: imports x1 Evidence: temp_extraction/src/components/screens/MatchOverviewScreen.jsx:imports
- `subsystem-139-0-temp-extraction` -> `subsystem-98-0-temp-extraction` [MEDIUM] via `imports`: imports x1 Evidence: temp_extraction/src/components/screens/MatchOverviewScreen.jsx:imports
- `subsystem-14-0-src-services` -> `subsystem-0-0-src-lib` [LOW] via `calls`: calls x16 Evidence: src/services/SyncService.js:calls, src/services/SyncService.js:calls, src/services/SyncService.js:calls
- `subsystem-14-0-src-services` -> `subsystem-13-0-src-engine` [LOW] via `calls`: calls x3 Evidence: src/services/SyncService.js:calls, src/services/SyncService.js:calls, src/services/SyncService.js:calls
- `subsystem-14-0-src-services` -> `subsystem-130-0-src-lib` [MEDIUM] via `imports`: imports x1 Evidence: src/services/SyncService.js:imports
- `subsystem-14-0-src-services` -> `subsystem-16-0-src-components` [LOW] via `calls`: calls x2 Evidence: src/services/SyncService.js:calls, src/services/SyncService.js:calls
- `subsystem-14-0-src-services` -> `subsystem-23-0-src-engine` [LOW] via `calls`: calls x1 Evidence: src/services/SyncService.js:calls
- `subsystem-14-0-src-services` -> `subsystem-27-0-apply-bug5-sql-js` [LOW] via `calls`: calls x6 Evidence: src/services/SyncService.js:calls, src/services/SyncService.js:calls, src/services/SyncService.js:calls
- `subsystem-14-0-src-services` -> `subsystem-41-0-src-lib` [MEDIUM] via `calls`: calls x3, imports x1 Evidence: src/services/SyncService.js:imports, src/services/SyncService.js:calls, src/services/SyncService.js:calls
- `subsystem-14-0-src-services` -> `subsystem-82-0-delete-season-js` [LOW] via `calls`: calls x9 Evidence: src/services/SyncService.js:calls, src/services/SyncService.js:calls, src/services/SyncService.js:calls
- `subsystem-140-0-temp-extraction` -> `subsystem-103-0-src-components` [LOW] via `calls`: calls x1 Evidence: temp_extraction/src/components/screens/MatchResultScreen.jsx:calls
- `subsystem-140-0-temp-extraction` -> `subsystem-146-0-temp-extraction` [MEDIUM] via `imports`: imports x1 Evidence: temp_extraction/src/components/screens/MatchResultScreen.jsx:imports
- `subsystem-140-0-temp-extraction` -> `subsystem-2-0-src-components` [MEDIUM] via `imports`: imports x1 Evidence: temp_extraction/src/components/screens/MatchResultScreen.jsx:imports
- `subsystem-140-0-temp-extraction` -> `subsystem-29-0-src-components` [HIGH] via `calls`: calls x1, imports x1 Evidence: temp_extraction/src/components/screens/MatchResultScreen.jsx:calls, temp_extraction/src/components/screens/MatchResultScreen.jsx:imports
- `subsystem-140-0-temp-extraction` -> `subsystem-50-0-temp-extraction` [MEDIUM] via `imports`: imports x1 Evidence: temp_extraction/src/components/screens/MatchResultScreen.jsx:imports
- `subsystem-140-0-temp-extraction` -> `subsystem-53-0-src-app-jsx` [HIGH] via `calls`: calls x1, imports x1 Evidence: temp_extraction/src/components/screens/MatchResultScreen.jsx:calls, temp_extraction/src/components/screens/MatchResultScreen.jsx:imports
- `subsystem-140-0-temp-extraction` -> `subsystem-62-0-src-components` [LOW] via `calls`: calls x1 Evidence: temp_extraction/src/components/screens/MatchResultScreen.jsx:calls
- `subsystem-140-0-temp-extraction` -> `subsystem-69-0-src-components` [LOW] via `calls`: calls x2 Evidence: temp_extraction/src/components/screens/MatchResultScreen.jsx:calls, temp_extraction/src/components/screens/MatchResultScreen.jsx:calls
- `subsystem-140-0-temp-extraction` -> `subsystem-88-0-src-components` [LOW] via `calls`: calls x1 Evidence: temp_extraction/src/components/screens/MatchResultScreen.jsx:calls
- `subsystem-140-0-temp-extraction` -> `subsystem-98-0-temp-extraction` [MEDIUM] via `imports`: imports x1 Evidence: temp_extraction/src/components/screens/MatchResultScreen.jsx:imports
- `subsystem-141-0-temp-extraction` -> `subsystem-103-0-src-components` [LOW] via `calls`: calls x1 Evidence: temp_extraction/src/components/screens/PlayerComparisonModal.jsx:calls
- `subsystem-141-0-temp-extraction` -> `subsystem-104-0-src-components` [LOW] via `calls`: calls x1 Evidence: temp_extraction/src/components/screens/PlayerComparisonModal.jsx:calls
- `subsystem-141-0-temp-extraction` -> `subsystem-2-0-src-components` [LOW] via `calls`: calls x1 Evidence: temp_extraction/src/components/screens/PlayerComparisonModal.jsx:calls
- `subsystem-141-0-temp-extraction` -> `subsystem-29-0-src-components` [HIGH] via `imports`: imports x1 Evidence: temp_extraction/src/components/screens/PlayerComparisonModal.jsx:imports
- `subsystem-141-0-temp-extraction` -> `subsystem-53-0-src-app-jsx` [HIGH] via `calls`: calls x1, imports x1 Evidence: temp_extraction/src/components/screens/PlayerComparisonModal.jsx:calls, temp_extraction/src/components/screens/PlayerComparisonModal.jsx:imports
- `subsystem-141-0-temp-extraction` -> `subsystem-76-0-src-components` [LOW] via `calls`: calls x5 Evidence: temp_extraction/src/components/screens/PlayerComparisonModal.jsx:calls, temp_extraction/src/components/screens/PlayerComparisonModal.jsx:calls, temp_extraction/src/components/screens/PlayerComparisonModal.jsx:calls
- `subsystem-141-0-temp-extraction` -> `subsystem-98-0-temp-extraction` [MEDIUM] via `imports`: imports x1 Evidence: temp_extraction/src/components/screens/PlayerComparisonModal.jsx:imports
- `subsystem-142-0-temp-extraction` -> `subsystem-145-0-temp-extraction` [MEDIUM] via `imports`: imports x1 Evidence: temp_extraction/src/components/screens/ScorecardScreen.jsx:imports
- `subsystem-142-0-temp-extraction` -> `subsystem-151-0-src-components` [LOW] via `calls`: calls x1 Evidence: temp_extraction/src/components/screens/ScorecardScreen.jsx:calls
- `subsystem-142-0-temp-extraction` -> `subsystem-29-0-src-components` [HIGH] via `imports`: imports x1 Evidence: temp_extraction/src/components/screens/ScorecardScreen.jsx:imports
- `subsystem-142-0-temp-extraction` -> `subsystem-53-0-src-app-jsx` [HIGH] via `calls`: calls x1, imports x1 Evidence: temp_extraction/src/components/screens/ScorecardScreen.jsx:calls, temp_extraction/src/components/screens/ScorecardScreen.jsx:imports
- `subsystem-142-0-temp-extraction` -> `subsystem-62-0-src-components` [LOW] via `calls`: calls x1 Evidence: temp_extraction/src/components/screens/ScorecardScreen.jsx:calls
- `subsystem-142-0-temp-extraction` -> `subsystem-7-0-src-components` [LOW] via `calls`: calls x1 Evidence: temp_extraction/src/components/screens/ScorecardScreen.jsx:calls
- `subsystem-142-0-temp-extraction` -> `subsystem-70-0-src-components` [LOW] via `calls`: calls x5 Evidence: temp_extraction/src/components/screens/ScorecardScreen.jsx:calls, temp_extraction/src/components/screens/ScorecardScreen.jsx:calls, temp_extraction/src/components/screens/ScorecardScreen.jsx:calls
- `subsystem-142-0-temp-extraction` -> `subsystem-87-0-temp-extraction` [MEDIUM] via `imports`: imports x1 Evidence: temp_extraction/src/components/screens/ScorecardScreen.jsx:imports
- `subsystem-142-0-temp-extraction` -> `subsystem-88-0-src-components` [LOW] via `calls`: calls x1 Evidence: temp_extraction/src/components/screens/ScorecardScreen.jsx:calls
- `subsystem-142-0-temp-extraction` -> `subsystem-98-0-temp-extraction` [MEDIUM] via `imports`: imports x1 Evidence: temp_extraction/src/components/screens/ScorecardScreen.jsx:imports
- `subsystem-143-0-temp-extraction` -> `subsystem-104-0-src-components` [LOW] via `calls`: calls x4 Evidence: temp_extraction/src/components/screens/SelectorsScreen.jsx:calls, temp_extraction/src/components/screens/SelectorsScreen.jsx:calls, temp_extraction/src/components/screens/SelectorsScreen.jsx:calls
- `subsystem-143-0-temp-extraction` -> `subsystem-150-0-src-components` [LOW] via `calls`: calls x2 Evidence: temp_extraction/src/components/screens/SelectorsScreen.jsx:calls, temp_extraction/src/components/screens/SelectorsScreen.jsx:calls
- `subsystem-143-0-temp-extraction` -> `subsystem-153-0-src-components` [LOW] via `calls`: calls x1 Evidence: temp_extraction/src/components/screens/SelectorsScreen.jsx:calls
- `subsystem-143-0-temp-extraction` -> `subsystem-161-0-src-components` [LOW] via `calls`: calls x1 Evidence: temp_extraction/src/components/screens/SelectorsScreen.jsx:calls
- `subsystem-143-0-temp-extraction` -> `subsystem-167-0-src-components` [LOW] via `calls`: calls x1 Evidence: temp_extraction/src/components/screens/SelectorsScreen.jsx:calls
- `subsystem-143-0-temp-extraction` -> `subsystem-2-0-src-components` [LOW] via `calls`: calls x1 Evidence: temp_extraction/src/components/screens/SelectorsScreen.jsx:calls
- `subsystem-143-0-temp-extraction` -> `subsystem-24-0-src-components` [LOW] via `calls`: calls x1 Evidence: temp_extraction/src/components/screens/SelectorsScreen.jsx:calls
- `subsystem-143-0-temp-extraction` -> `subsystem-32-0-src-components` [HIGH] via `calls`: calls x6, contains x1 Evidence: temp_extraction/src/components/screens/SelectorsScreen.jsx:calls, temp_extraction/src/components/screens/SelectorsScreen.jsx:calls, temp_extraction/src/components/screens/SelectorsScreen.jsx:calls
- `subsystem-143-0-temp-extraction` -> `subsystem-33-0-src-components` [LOW] via `calls`: calls x5 Evidence: temp_extraction/src/components/screens/SelectorsScreen.jsx:calls, temp_extraction/src/components/screens/SelectorsScreen.jsx:calls, temp_extraction/src/components/screens/SelectorsScreen.jsx:calls
- `subsystem-143-0-temp-extraction` -> `subsystem-53-0-src-app-jsx` [HIGH] via `calls`: calls x1, imports x1 Evidence: temp_extraction/src/components/screens/SelectorsScreen.jsx:calls, temp_extraction/src/components/screens/SelectorsScreen.jsx:imports
- `subsystem-143-0-temp-extraction` -> `subsystem-77-0-src-components` [LOW] via `calls`: calls x4 Evidence: temp_extraction/src/components/screens/SelectorsScreen.jsx:calls, temp_extraction/src/components/screens/SelectorsScreen.jsx:calls, temp_extraction/src/components/screens/SelectorsScreen.jsx:calls
- `subsystem-143-0-temp-extraction` -> `subsystem-88-0-src-components` [LOW] via `calls`: calls x5 Evidence: temp_extraction/src/components/screens/SelectorsScreen.jsx:calls, temp_extraction/src/components/screens/SelectorsScreen.jsx:calls, temp_extraction/src/components/screens/SelectorsScreen.jsx:calls
- `subsystem-143-0-temp-extraction` -> `subsystem-97-0-temp-extraction` [LOW] via `calls`: calls x1 Evidence: temp_extraction/src/components/screens/SelectorsScreen.jsx:calls
- `subsystem-143-0-temp-extraction` -> `subsystem-98-0-temp-extraction` [MEDIUM] via `imports`: imports x1 Evidence: temp_extraction/src/components/screens/SelectorsScreen.jsx:imports
- `subsystem-144-0-temp-extraction` -> `subsystem-145-0-temp-extraction` [MEDIUM] via `imports`: imports x1 Evidence: temp_extraction/src/components/Sidebar.jsx:imports
- `subsystem-144-0-temp-extraction` -> `subsystem-29-0-src-components` [LOW] via `calls`: calls x1 Evidence: temp_extraction/src/components/Sidebar.jsx:calls
- `subsystem-144-0-temp-extraction` -> `subsystem-47-0-src-components` [HIGH] via `calls`: calls x5, contains x1 Evidence: temp_extraction/src/components/Sidebar.jsx:calls, temp_extraction/src/components/Sidebar.jsx:calls, temp_extraction/src/components/Sidebar.jsx:calls
- `subsystem-144-0-temp-extraction` -> `subsystem-53-0-src-app-jsx` [HIGH] via `calls`: calls x1, imports x1 Evidence: temp_extraction/src/components/Sidebar.jsx:calls, temp_extraction/src/components/Sidebar.jsx:imports
- `subsystem-144-0-temp-extraction` -> `subsystem-6-0-src-components` [LOW] via `calls`: calls x1, imports x1 Evidence: temp_extraction/src/components/Sidebar.jsx:calls, temp_extraction/src/components/Sidebar.jsx:imports
- `subsystem-144-0-temp-extraction` -> `subsystem-78-0-src-components` [HIGH] via `calls`: calls x2, contains x1 Evidence: temp_extraction/src/components/Sidebar.jsx:calls, temp_extraction/src/components/Sidebar.jsx:calls, temp_extraction/src/components/Sidebar.jsx:contains
- `subsystem-144-0-temp-extraction` -> `subsystem-88-0-src-components` [LOW] via `calls`: calls x4 Evidence: temp_extraction/src/components/Sidebar.jsx:calls, temp_extraction/src/components/Sidebar.jsx:calls, temp_extraction/src/components/Sidebar.jsx:calls
- `subsystem-144-0-temp-extraction` -> `subsystem-98-0-temp-extraction` [MEDIUM] via `imports`: imports x1 Evidence: temp_extraction/src/components/Sidebar.jsx:imports
- `subsystem-145-0-temp-extraction` -> `subsystem-53-0-src-app-jsx` [HIGH] via `imports`: imports x1 Evidence: temp_extraction/src/components/ui/Badge.jsx:imports
- `subsystem-145-0-temp-extraction` -> `subsystem-86-0-src-components` [HIGH] via `contains`: contains x3 Evidence: temp_extraction/src/components/ui/Badge.jsx:contains, temp_extraction/src/components/ui/Badge.jsx:contains, temp_extraction/src/components/ui/Badge.jsx:contains
- `subsystem-146-0-temp-extraction` -> `subsystem-103-0-src-components` [LOW] via `calls`: calls x3 Evidence: temp_extraction/src/components/ui/MatchMediaReport.jsx:calls, temp_extraction/src/components/ui/MatchMediaReport.jsx:calls, temp_extraction/src/components/ui/MatchMediaReport.jsx:calls
- `subsystem-146-0-temp-extraction` -> `subsystem-29-0-src-components` [HIGH] via `imports`: imports x1 Evidence: temp_extraction/src/components/ui/MatchMediaReport.jsx:imports
- `subsystem-146-0-temp-extraction` -> `subsystem-50-0-temp-extraction` [MEDIUM] via `imports`: imports x1 Evidence: temp_extraction/src/components/ui/MatchMediaReport.jsx:imports
- `subsystem-146-0-temp-extraction` -> `subsystem-53-0-src-app-jsx` [HIGH] via `imports`: imports x1 Evidence: temp_extraction/src/components/ui/MatchMediaReport.jsx:imports
- `subsystem-146-0-temp-extraction` -> `subsystem-58-0-src-components` [HIGH] via `calls`: calls x8, contains x1 Evidence: temp_extraction/src/components/ui/MatchMediaReport.jsx:calls, temp_extraction/src/components/ui/MatchMediaReport.jsx:calls, temp_extraction/src/components/ui/MatchMediaReport.jsx:calls
- `subsystem-146-0-temp-extraction` -> `subsystem-69-0-src-components` [LOW] via `calls`: calls x1 Evidence: temp_extraction/src/components/ui/MatchMediaReport.jsx:calls
- `subsystem-146-0-temp-extraction` -> `subsystem-70-0-src-components` [LOW] via `calls`: calls x1 Evidence: temp_extraction/src/components/ui/MatchMediaReport.jsx:calls
- `subsystem-146-0-temp-extraction` -> `subsystem-88-0-src-components` [LOW] via `calls`: calls x1 Evidence: temp_extraction/src/components/ui/MatchMediaReport.jsx:calls
- `subsystem-147-0-temp-extraction` -> `subsystem-148-0-temp-extraction` [MEDIUM] via `imports`: imports x1 Evidence: temp_extraction/src/engine/cricketStateMachine.js:imports
- `subsystem-147-0-temp-extraction` -> `subsystem-23-0-src-engine` [HIGH] via `contains`: contains x5, calls x4 Evidence: temp_extraction/src/engine/cricketStateMachine.js:calls, temp_extraction/src/engine/cricketStateMachine.js:calls, temp_extraction/src/engine/cricketStateMachine.js:calls
- `subsystem-148-0-temp-extraction` -> `subsystem-13-0-src-engine` [HIGH] via `calls`: calls x77, imports x1 Evidence: temp_extraction/src/engine/validationSchemas.js:calls, temp_extraction/src/engine/validationSchemas.js:calls, temp_extraction/src/engine/validationSchemas.js:calls
- `subsystem-148-0-temp-extraction` -> `subsystem-16-0-src-components` [LOW] via `calls`: calls x6 Evidence: temp_extraction/src/engine/validationSchemas.js:calls, temp_extraction/src/engine/validationSchemas.js:calls, temp_extraction/src/engine/validationSchemas.js:calls
- `subsystem-148-0-temp-extraction` -> `subsystem-23-0-src-engine` [LOW] via `calls`: calls x1 Evidence: temp_extraction/src/engine/validationSchemas.js:calls
- `subsystem-15-0-src-components` -> `subsystem-0-0-src-lib` [MEDIUM] via `imports`: imports x1 Evidence: src/components/screens/TournamentsScreen.jsx:imports
- `subsystem-15-0-src-components` -> `subsystem-1-0-src-context` [MEDIUM] via `imports`: imports x1 Evidence: src/components/screens/TournamentsScreen.jsx:imports
- `subsystem-15-0-src-components` -> `subsystem-107-0-src-components` [LOW] via `calls`: calls x1 Evidence: src/components/screens/TournamentsScreen.jsx:calls
- `subsystem-15-0-src-components` -> `subsystem-121-0-src-components` [LOW] via `calls`: calls x2 Evidence: src/components/screens/TournamentsScreen.jsx:calls, src/components/screens/TournamentsScreen.jsx:calls
- `subsystem-15-0-src-components` -> `subsystem-129-0-src-lib` [MEDIUM] via `imports`: imports x1 Evidence: src/components/screens/TournamentsScreen.jsx:imports
- `subsystem-15-0-src-components` -> `subsystem-169-0-src-components` [LOW] via `calls`: calls x2 Evidence: src/components/screens/TournamentsScreen.jsx:calls, src/components/screens/TournamentsScreen.jsx:calls
- `subsystem-15-0-src-components` -> `subsystem-173-0-src-components` [LOW] via `calls`: calls x1 Evidence: src/components/screens/TournamentsScreen.jsx:calls
- `subsystem-15-0-src-components` -> `subsystem-2-0-src-components` [LOW] via `calls`: calls x2 Evidence: src/components/screens/TournamentsScreen.jsx:calls, src/components/screens/TournamentsScreen.jsx:calls
- `subsystem-15-0-src-components` -> `subsystem-22-0-src-components` [LOW] via `calls`: calls x6 Evidence: src/components/screens/TournamentsScreen.jsx:calls, src/components/screens/TournamentsScreen.jsx:calls, src/components/screens/TournamentsScreen.jsx:calls
- `subsystem-15-0-src-components` -> `subsystem-29-0-src-components` [HIGH] via `calls`: calls x1, imports x1 Evidence: src/components/screens/TournamentsScreen.jsx:calls, src/components/screens/TournamentsScreen.jsx:imports
- `subsystem-15-0-src-components` -> `subsystem-3-0-src-components` [LOW] via `calls`: calls x1 Evidence: src/components/screens/TournamentsScreen.jsx:calls
- `subsystem-15-0-src-components` -> `subsystem-45-0-src-components` [MEDIUM] via `imports`: imports x1 Evidence: src/components/screens/TournamentsScreen.jsx:imports
- `subsystem-15-0-src-components` -> `subsystem-53-0-src-app-jsx` [HIGH] via `calls`: calls x1, imports x1 Evidence: src/components/screens/TournamentsScreen.jsx:calls, src/components/screens/TournamentsScreen.jsx:imports
- `subsystem-15-0-src-components` -> `subsystem-54-0-src-components` [HIGH] via `calls`: calls x1, contains x1 Evidence: src/components/screens/TournamentsScreen.jsx:calls, src/components/screens/TournamentsScreen.jsx:contains
- `subsystem-15-0-src-components` -> `subsystem-6-0-src-components` [LOW] via `calls`: calls x1 Evidence: src/components/screens/TournamentsScreen.jsx:calls
- `subsystem-15-0-src-components` -> `subsystem-61-0-src-components` [LOW] via `calls`: calls x1 Evidence: src/components/screens/TournamentsScreen.jsx:calls
- `subsystem-15-0-src-components` -> `subsystem-7-0-src-components` [LOW] via `calls`: calls x3 Evidence: src/components/screens/TournamentsScreen.jsx:calls, src/components/screens/TournamentsScreen.jsx:calls, src/components/screens/TournamentsScreen.jsx:calls
- `subsystem-15-0-src-components` -> `subsystem-79-0-src-components` [MEDIUM] via `imports`: imports x1 Evidence: src/components/screens/TournamentsScreen.jsx:imports
- `subsystem-15-0-src-components` -> `subsystem-81-0-src-components` [HIGH] via `calls`: calls x4, contains x1 Evidence: src/components/screens/TournamentsScreen.jsx:calls, src/components/screens/TournamentsScreen.jsx:calls, src/components/screens/TournamentsScreen.jsx:calls
- `subsystem-15-0-src-components` -> `subsystem-88-0-src-components` [LOW] via `calls`: calls x6 Evidence: src/components/screens/TournamentsScreen.jsx:calls, src/components/screens/TournamentsScreen.jsx:calls, src/components/screens/TournamentsScreen.jsx:calls
- `subsystem-16-0-src-components` -> `subsystem-176-0-src-components` [LOW] via `calls`: calls x2 Evidence: src/components/selection/selectionData.js:calls, src/components/selection/selectionData.js:calls
- `subsystem-18-0-src-lib` -> `subsystem-0-0-src-lib` [LOW] via `calls`: calls x1 Evidence: src/lib/standings.js:calls
- `subsystem-18-0-src-lib` -> `subsystem-16-0-src-components` [LOW] via `calls`: calls x8 Evidence: src/lib/standings.js:calls, src/lib/standings.js:calls, src/lib/standings.js:calls
- `subsystem-18-0-src-lib` -> `subsystem-176-0-src-components` [LOW] via `calls`: calls x2 Evidence: src/lib/standings.js:calls, src/lib/standings.js:calls
- `subsystem-18-0-src-lib` -> `subsystem-23-0-src-engine` [LOW] via `calls`: calls x1 Evidence: src/lib/standings.js:calls
- `subsystem-18-0-src-lib` -> `subsystem-37-0-src-engine` [LOW] via `calls`: calls x1 Evidence: src/lib/standings.js:calls
- `subsystem-18-0-src-lib` -> `subsystem-67-0-src-lib` [LOW] via `calls`: calls x1 Evidence: src/lib/standings.js:calls
- `subsystem-18-0-src-lib` -> `subsystem-82-0-delete-season-js` [LOW] via `calls`: calls x1 Evidence: src/lib/standings.js:calls
- `subsystem-180-0-src-components` -> `subsystem-103-0-src-components` [LOW] via `calls`: calls x1 Evidence: src/components/screens/SelectionScreen.jsx:calls
- `subsystem-180-0-src-components` -> `subsystem-165-0-src-components` [LOW] via `calls`: calls x1 Evidence: src/components/screens/SelectionScreen.jsx:calls
- `subsystem-180-0-src-components` -> `subsystem-76-0-src-components` [LOW] via `calls`: calls x2 Evidence: src/components/screens/SelectionScreen.jsx:calls, src/components/screens/SelectionScreen.jsx:calls
- `subsystem-181-0-src-components` -> `subsystem-172-0-src-components` [LOW] via `calls`: calls x1 Evidence: src/components/ui/TournamentManagerModal.jsx:calls
- `subsystem-181-0-src-components` -> `subsystem-174-0-src-components` [LOW] via `calls`: calls x1 Evidence: src/components/ui/TournamentManagerModal.jsx:calls
- `subsystem-181-0-src-components` -> `subsystem-63-0-src-components` [LOW] via `calls`: calls x1 Evidence: src/components/ui/TournamentManagerModal.jsx:calls
- `subsystem-19-0-src-components` -> `subsystem-1-0-src-context` [MEDIUM] via `imports`: imports x1 Evidence: src/components/selection/SelectionWorkspace.jsx:imports
- `subsystem-19-0-src-components` -> `subsystem-103-0-src-components` [LOW] via `calls`: calls x7 Evidence: src/components/selection/SelectionWorkspace.jsx:calls, src/components/selection/SelectionWorkspace.jsx:calls, src/components/selection/SelectionWorkspace.jsx:calls
- `subsystem-19-0-src-components` -> `subsystem-104-0-src-components` [LOW] via `calls`: calls x2 Evidence: src/components/selection/SelectionWorkspace.jsx:calls, src/components/selection/SelectionWorkspace.jsx:calls
- `subsystem-19-0-src-components` -> `subsystem-107-0-src-components` [LOW] via `calls`: calls x1 Evidence: src/components/selection/SelectionWorkspace.jsx:calls
- `subsystem-19-0-src-components` -> `subsystem-114-0-src-components` [MEDIUM] via `imports`: imports x1 Evidence: src/components/selection/SelectionWorkspace.jsx:imports
- `subsystem-19-0-src-components` -> `subsystem-12-0-src-components` [MEDIUM] via `imports`: imports x1 Evidence: src/components/selection/SelectionWorkspace.jsx:imports
- `subsystem-19-0-src-components` -> `subsystem-124-0-src-components` [LOW] via `calls`: calls x1 Evidence: src/components/selection/SelectionWorkspace.jsx:calls
- `subsystem-19-0-src-components` -> `subsystem-15-0-src-components` [LOW] via `calls`: calls x2 Evidence: src/components/selection/SelectionWorkspace.jsx:calls, src/components/selection/SelectionWorkspace.jsx:calls
- `subsystem-19-0-src-components` -> `subsystem-150-0-src-components` [LOW] via `calls`: calls x2 Evidence: src/components/selection/SelectionWorkspace.jsx:calls, src/components/selection/SelectionWorkspace.jsx:calls
- `subsystem-19-0-src-components` -> `subsystem-177-0-src-components` [HIGH] via `imports`: imports x1 Evidence: src/components/selection/SelectionWorkspace.jsx:imports
- `subsystem-19-0-src-components` -> `subsystem-2-0-src-components` [LOW] via `calls`: calls x3 Evidence: src/components/selection/SelectionWorkspace.jsx:calls, src/components/selection/SelectionWorkspace.jsx:calls, src/components/selection/SelectionWorkspace.jsx:calls
- `subsystem-19-0-src-components` -> `subsystem-21-0-src-components` [HIGH] via `calls`: calls x4, contains x1 Evidence: src/components/selection/SelectionWorkspace.jsx:calls, src/components/selection/SelectionWorkspace.jsx:calls, src/components/selection/SelectionWorkspace.jsx:calls
- `subsystem-19-0-src-components` -> `subsystem-22-0-src-components` [LOW] via `calls`: calls x1 Evidence: src/components/selection/SelectionWorkspace.jsx:calls
- `subsystem-19-0-src-components` -> `subsystem-24-0-src-components` [LOW] via `calls`: calls x1 Evidence: src/components/selection/SelectionWorkspace.jsx:calls
- `subsystem-19-0-src-components` -> `subsystem-29-0-src-components` [LOW] via `calls`: calls x1 Evidence: src/components/selection/SelectionWorkspace.jsx:calls
- `subsystem-19-0-src-components` -> `subsystem-30-0-src-components` [LOW] via `calls`: calls x1 Evidence: src/components/selection/SelectionWorkspace.jsx:calls
- `subsystem-19-0-src-components` -> `subsystem-32-0-src-components` [LOW] via `calls`: calls x1 Evidence: src/components/selection/SelectionWorkspace.jsx:calls
- `subsystem-19-0-src-components` -> `subsystem-33-0-src-components` [LOW] via `calls`: calls x3 Evidence: src/components/selection/SelectionWorkspace.jsx:calls, src/components/selection/SelectionWorkspace.jsx:calls, src/components/selection/SelectionWorkspace.jsx:calls
- `subsystem-19-0-src-components` -> `subsystem-36-0-src-components` [LOW] via `calls`: calls x4 Evidence: src/components/selection/SelectionWorkspace.jsx:calls, src/components/selection/SelectionWorkspace.jsx:calls, src/components/selection/SelectionWorkspace.jsx:calls
- `subsystem-19-0-src-components` -> `subsystem-51-0-src-components` [LOW] via `calls`: calls x5 Evidence: src/components/selection/SelectionWorkspace.jsx:calls, src/components/selection/SelectionWorkspace.jsx:calls, src/components/selection/SelectionWorkspace.jsx:calls
- `subsystem-19-0-src-components` -> `subsystem-53-0-src-app-jsx` [HIGH] via `imports`: imports x2, calls x1 Evidence: src/components/selection/SelectionWorkspace.jsx:calls, src/components/selection/SelectionWorkspace.jsx:imports, src/components/selection/SelectionWorkspace.jsx:imports
- `subsystem-19-0-src-components` -> `subsystem-6-0-src-components` [MEDIUM] via `calls`: imports x1, calls x1 Evidence: src/components/selection/SelectionWorkspace.jsx:calls, src/components/selection/SelectionWorkspace.jsx:imports
- `subsystem-19-0-src-components` -> `subsystem-7-0-src-components` [LOW] via `calls`: calls x1 Evidence: src/components/selection/SelectionWorkspace.jsx:calls
- `subsystem-19-0-src-components` -> `subsystem-88-0-src-components` [LOW] via `calls`: calls x17 Evidence: src/components/selection/SelectionWorkspace.jsx:calls, src/components/selection/SelectionWorkspace.jsx:calls, src/components/selection/SelectionWorkspace.jsx:calls
- `subsystem-19-0-src-components` -> `subsystem-91-0-src-components` [HIGH] via `calls`: calls x3, contains x1 Evidence: src/components/selection/SelectionWorkspace.jsx:calls, src/components/selection/SelectionWorkspace.jsx:calls, src/components/selection/SelectionWorkspace.jsx:calls
- `subsystem-2-0-src-components` -> `subsystem-1-0-src-context` [MEDIUM] via `imports`: imports x1 Evidence: src/components/screens/ScoringScreen.jsx:imports
- `subsystem-2-0-src-components` -> `subsystem-103-0-src-components` [LOW] via `calls`: calls x2 Evidence: src/components/screens/ScoringScreen.jsx:calls, temp_extraction/src/components/screens/ScoringScreen.jsx:calls
- `subsystem-2-0-src-components` -> `subsystem-116-0-src-components` [MEDIUM] via `imports`: imports x1 Evidence: src/components/screens/ScoringScreen.jsx:imports
- `subsystem-2-0-src-components` -> `subsystem-121-0-src-components` [LOW] via `calls`: calls x1 Evidence: src/components/screens/ScoringScreen.jsx:calls
- `subsystem-2-0-src-components` -> `subsystem-122-0-src-components` [LOW] via `calls`: calls x7 Evidence: src/components/screens/ScoringScreen.jsx:calls, src/components/screens/ScoringScreen.jsx:calls, src/components/screens/ScoringScreen.jsx:calls
- `subsystem-2-0-src-components` -> `subsystem-13-0-src-engine` [MEDIUM] via `imports`: imports x1 Evidence: src/components/screens/ScoringScreen.jsx:imports
- `subsystem-2-0-src-components` -> `subsystem-130-0-src-lib` [MEDIUM] via `imports`: imports x1 Evidence: src/components/screens/ScoringScreen.jsx:imports
- `subsystem-2-0-src-components` -> `subsystem-14-0-src-services` [MEDIUM] via `imports`: imports x1 Evidence: src/components/screens/ScoringScreen.jsx:imports
- `subsystem-2-0-src-components` -> `subsystem-148-0-temp-extraction` [MEDIUM] via `imports`: imports x1 Evidence: temp_extraction/src/components/screens/ScoringScreen.jsx:imports
- `subsystem-2-0-src-components` -> `subsystem-155-0-src-components` [LOW] via `calls`: calls x4 Evidence: src/components/screens/ScoringScreen.jsx:calls, src/components/screens/ScoringScreen.jsx:calls, temp_extraction/src/components/screens/ScoringScreen.jsx:calls
- `subsystem-2-0-src-components` -> `subsystem-166-0-src-components` [LOW] via `calls`: calls x3 Evidence: src/components/screens/ScoringScreen.jsx:calls, src/components/screens/ScoringScreen.jsx:calls, src/components/screens/ScoringScreen.jsx:calls
- `subsystem-2-0-src-components` -> `subsystem-167-0-src-components` [LOW] via `calls`: calls x1 Evidence: src/components/screens/ScoringScreen.jsx:calls
- `subsystem-2-0-src-components` -> `subsystem-168-0-src-components` [LOW] via `calls`: calls x4 Evidence: src/components/screens/ScoringScreen.jsx:calls, temp_extraction/src/components/screens/ScoringScreen.jsx:calls, src/components/screens/ScoringScreen.jsx:calls
- `subsystem-2-0-src-components` -> `subsystem-22-0-src-components` [LOW] via `calls`: calls x1 Evidence: src/components/screens/ScoringScreen.jsx:calls
- `subsystem-2-0-src-components` -> `subsystem-29-0-src-components` [LOW] via `calls`: calls x12 Evidence: src/components/screens/ScoringScreen.jsx:calls, src/components/screens/ScoringScreen.jsx:calls, src/components/screens/ScoringScreen.jsx:calls
- `subsystem-2-0-src-components` -> `subsystem-3-0-src-components` [MEDIUM] via `calls`: calls x9, imports x1 Evidence: src/components/screens/ScoringScreen.jsx:calls, src/components/screens/ScoringScreen.jsx:calls, src/components/screens/ScoringScreen.jsx:calls
- `subsystem-2-0-src-components` -> `subsystem-52-0-src-hooks` [MEDIUM] via `imports`: imports x1 Evidence: src/components/screens/ScoringScreen.jsx:imports
- `subsystem-2-0-src-components` -> `subsystem-53-0-src-app-jsx` [HIGH] via `imports`: imports x5, calls x2 Evidence: src/components/screens/ScoringScreen.jsx:calls, src/components/screens/ScoringScreen.jsx:imports, src/components/screens/ScoringScreen.jsx:imports
- `subsystem-2-0-src-components` -> `subsystem-56-0-src-components` [LOW] via `calls`: calls x1 Evidence: src/components/screens/ScoringScreen.jsx:calls
- `subsystem-2-0-src-components` -> `subsystem-6-0-src-components` [LOW] via `calls`: calls x2 Evidence: src/components/screens/ScoringScreen.jsx:calls, temp_extraction/src/components/screens/ScoringScreen.jsx:calls
- `subsystem-2-0-src-components` -> `subsystem-66-0-src-components` [HIGH] via `calls`: calls x1, contains x1 Evidence: src/components/screens/ScoringScreen.jsx:calls, src/components/screens/ScoringScreen.jsx:contains
- `subsystem-2-0-src-components` -> `subsystem-70-0-src-components` [LOW] via `calls`: calls x2 Evidence: src/components/screens/ScoringScreen.jsx:calls, temp_extraction/src/components/screens/ScoringScreen.jsx:calls
- `subsystem-2-0-src-components` -> `subsystem-73-0-src-components` [LOW] via `calls`: calls x1 Evidence: src/components/screens/ScoringScreen.jsx:calls
- `subsystem-2-0-src-components` -> `subsystem-79-0-src-components` [MEDIUM] via `imports`: imports x1 Evidence: src/components/screens/ScoringScreen.jsx:imports
- `subsystem-2-0-src-components` -> `subsystem-88-0-src-components` [LOW] via `calls`: calls x27 Evidence: src/components/screens/ScoringScreen.jsx:calls, src/components/screens/ScoringScreen.jsx:calls, src/components/screens/ScoringScreen.jsx:calls
- `subsystem-2-0-src-components` -> `subsystem-98-0-temp-extraction` [MEDIUM] via `imports`: imports x1 Evidence: temp_extraction/src/components/screens/ScoringScreen.jsx:imports
- `subsystem-20-0-temp-extraction` -> `subsystem-0-0-src-lib` [LOW] via `calls`: calls x2 Evidence: temp_extraction/src/data/mockData.js:calls, temp_extraction/src/data/mockData.js:calls
- `subsystem-20-0-temp-extraction` -> `subsystem-37-0-src-engine` [LOW] via `calls`: calls x1 Evidence: temp_extraction/src/data/mockData.js:calls
- `subsystem-21-0-src-components` -> `subsystem-121-0-src-components` [LOW] via `calls`: calls x6 Evidence: src/components/screens/TeamRegistrationTab.jsx:calls, src/components/screens/TeamRegistrationTab.jsx:calls, src/components/screens/TeamRegistrationTab.jsx:calls
- `subsystem-21-0-src-components` -> `subsystem-160-0-src-components` [LOW] via `calls`: calls x3 Evidence: src/components/screens/TeamRegistrationTab.jsx:calls, src/components/screens/TeamRegistrationTab.jsx:calls, src/components/screens/TeamRegistrationTab.jsx:calls
- `subsystem-21-0-src-components` -> `subsystem-172-0-src-components` [LOW] via `calls`: calls x1 Evidence: src/components/screens/TeamRegistrationTab.jsx:calls
- `subsystem-21-0-src-components` -> `subsystem-28-0-src-components` [LOW] via `calls`: calls x5 Evidence: src/components/screens/TeamRegistrationTab.jsx:calls, src/components/screens/TeamRegistrationTab.jsx:calls, src/components/screens/TeamRegistrationTab.jsx:calls
- `subsystem-21-0-src-components` -> `subsystem-39-0-src-components` [LOW] via `calls`: calls x1 Evidence: src/components/screens/TeamRegistrationTab.jsx:calls
- `subsystem-21-0-src-components` -> `subsystem-6-0-src-components` [LOW] via `calls`: calls x1 Evidence: src/components/screens/TeamRegistrationTab.jsx:calls
- `subsystem-21-0-src-components` -> `subsystem-7-0-src-components` [LOW] via `calls`: calls x6 Evidence: src/components/screens/TeamRegistrationTab.jsx:calls, src/components/screens/TeamRegistrationTab.jsx:calls, src/components/screens/TeamRegistrationTab.jsx:calls
- `subsystem-21-0-src-components` -> `subsystem-91-0-src-components` [LOW] via `calls`: calls x3 Evidence: src/components/selection/SelectionWorkspace.jsx:calls, src/components/selection/SelectionWorkspace.jsx:calls, src/components/selection/SelectionWorkspace.jsx:calls
- `subsystem-22-0-src-components` -> `subsystem-1-0-src-context` [MEDIUM] via `imports`: imports x1 Evidence: src/components/screens/HomeScreen.jsx:imports
- `subsystem-22-0-src-components` -> `subsystem-129-0-src-lib` [MEDIUM] via `imports`: imports x1 Evidence: src/components/screens/HomeScreen.jsx:imports
- `subsystem-22-0-src-components` -> `subsystem-150-0-src-components` [LOW] via `calls`: calls x1 Evidence: src/components/screens/HomeScreen.jsx:calls
- `subsystem-22-0-src-components` -> `subsystem-155-0-src-components` [LOW] via `calls`: calls x2 Evidence: src/components/screens/HomeScreen.jsx:calls, src/components/screens/HomeScreen.jsx:calls
- `subsystem-22-0-src-components` -> `subsystem-156-0-src-components` [LOW] via `calls`: calls x2 Evidence: src/components/screens/HomeScreen.jsx:calls, src/components/screens/HomeScreen.jsx:calls
- `subsystem-22-0-src-components` -> `subsystem-157-0-src-components` [LOW] via `calls`: calls x1 Evidence: src/components/screens/HomeScreen.jsx:calls
- `subsystem-22-0-src-components` -> `subsystem-2-0-src-components` [LOW] via `calls`: calls x6 Evidence: src/components/screens/HomeScreen.jsx:calls, src/components/screens/HomeScreen.jsx:calls, src/components/screens/HomeScreen.jsx:calls
- `subsystem-22-0-src-components` -> `subsystem-29-0-src-components` [LOW] via `calls`: calls x18 Evidence: src/components/screens/HomeScreen.jsx:calls, src/components/screens/HomeScreen.jsx:calls, src/components/screens/HomeScreen.jsx:calls
- `subsystem-22-0-src-components` -> `subsystem-35-0-src-components` [LOW] via `calls`: calls x1 Evidence: src/components/screens/HomeScreen.jsx:calls
- `subsystem-22-0-src-components` -> `subsystem-53-0-src-app-jsx` [HIGH] via `imports`: imports x2, calls x1 Evidence: src/components/screens/HomeScreen.jsx:calls, src/components/screens/HomeScreen.jsx:imports, src/components/screens/HomeScreen.jsx:imports
- `subsystem-22-0-src-components` -> `subsystem-88-0-src-components` [LOW] via `calls`: calls x3 Evidence: src/components/screens/HomeScreen.jsx:calls, src/components/screens/HomeScreen.jsx:calls, src/components/screens/HomeScreen.jsx:calls
- `subsystem-23-0-src-engine` -> `subsystem-13-0-src-engine` [MEDIUM] via `imports`: imports x1 Evidence: src/engine/cricketStateMachine.js:imports
- `subsystem-23-0-src-engine` -> `subsystem-16-0-src-components` [LOW] via `calls`: calls x13 Evidence: src/engine/cricketStateMachine.js:calls, temp_extraction/src/engine/cricketStateMachine.js:calls, src/engine/cricketStateMachine.js:calls
- `subsystem-24-0-src-components` -> `subsystem-0-0-src-lib` [MEDIUM] via `imports`: imports x1 Evidence: src/components/screens/TeamRegistrationTab.jsx:imports
- `subsystem-24-0-src-components` -> `subsystem-1-0-src-context` [MEDIUM] via `imports`: imports x1 Evidence: src/components/screens/TeamRegistrationTab.jsx:imports
- `subsystem-24-0-src-components` -> `subsystem-104-0-src-components` [LOW] via `calls`: calls x3 Evidence: src/components/screens/TeamRegistrationTab.jsx:calls, src/components/screens/TeamRegistrationTab.jsx:calls, src/components/screens/TeamRegistrationTab.jsx:calls
- `subsystem-24-0-src-components` -> `subsystem-106-0-src-components` [LOW] via `calls`: calls x1 Evidence: src/components/screens/TeamRegistrationTab.jsx:calls
- `subsystem-24-0-src-components` -> `subsystem-121-0-src-components` [LOW] via `calls`: calls x1 Evidence: src/components/screens/TeamRegistrationTab.jsx:calls
- `subsystem-24-0-src-components` -> `subsystem-130-0-src-lib` [MEDIUM] via `imports`: imports x1 Evidence: src/components/screens/TeamRegistrationTab.jsx:imports
- `subsystem-24-0-src-components` -> `subsystem-150-0-src-components` [LOW] via `calls`: calls x1 Evidence: src/components/screens/TeamRegistrationTab.jsx:calls
- `subsystem-24-0-src-components` -> `subsystem-160-0-src-components` [LOW] via `calls`: calls x2 Evidence: src/components/screens/TeamRegistrationTab.jsx:calls, src/components/screens/TeamRegistrationTab.jsx:calls
- `subsystem-24-0-src-components` -> `subsystem-162-0-src-components` [LOW] via `calls`: calls x1 Evidence: src/components/screens/TeamRegistrationTab.jsx:calls
- `subsystem-24-0-src-components` -> `subsystem-171-0-src-components` [LOW] via `calls`: calls x1 Evidence: src/components/screens/TeamRegistrationTab.jsx:calls
- `subsystem-24-0-src-components` -> `subsystem-21-0-src-components` [HIGH] via `calls`: calls x9, contains x3 Evidence: src/components/screens/TeamRegistrationTab.jsx:calls, src/components/screens/TeamRegistrationTab.jsx:calls, src/components/screens/TeamRegistrationTab.jsx:calls
- `subsystem-24-0-src-components` -> `subsystem-28-0-src-components` [LOW] via `calls`: calls x2 Evidence: src/components/screens/TeamRegistrationTab.jsx:calls, src/components/screens/TeamRegistrationTab.jsx:calls
- `subsystem-24-0-src-components` -> `subsystem-29-0-src-components` [HIGH] via `calls`: calls x3, imports x1 Evidence: src/components/screens/TeamRegistrationTab.jsx:calls, src/components/screens/TeamRegistrationTab.jsx:calls, src/components/screens/TeamRegistrationTab.jsx:calls
- `subsystem-24-0-src-components` -> `subsystem-31-0-src-components` [LOW] via `calls`: calls x1 Evidence: src/components/screens/TeamRegistrationTab.jsx:calls
- `subsystem-24-0-src-components` -> `subsystem-32-0-src-components` [LOW] via `calls`: calls x3 Evidence: src/components/screens/TeamRegistrationTab.jsx:calls, src/components/screens/TeamRegistrationTab.jsx:calls, src/components/screens/TeamRegistrationTab.jsx:calls
- `subsystem-24-0-src-components` -> `subsystem-53-0-src-app-jsx` [HIGH] via `calls`: calls x1, imports x1 Evidence: src/components/screens/TeamRegistrationTab.jsx:calls, src/components/screens/TeamRegistrationTab.jsx:imports
- `subsystem-24-0-src-components` -> `subsystem-88-0-src-components` [LOW] via `calls`: calls x13 Evidence: src/components/screens/TeamRegistrationTab.jsx:calls, src/components/screens/TeamRegistrationTab.jsx:calls, src/components/screens/TeamRegistrationTab.jsx:calls
- `subsystem-25-0-src-main-jsx` -> `subsystem-121-0-src-components` [LOW] via `calls`: calls x2 Evidence: src/main.jsx:calls, temp_extraction/src/main.jsx:calls
- `subsystem-25-0-src-main-jsx` -> `subsystem-131-0-temp-extraction` [MEDIUM] via `imports`: imports x1 Evidence: temp_extraction/src/main.jsx:imports
- `subsystem-25-0-src-main-jsx` -> `subsystem-29-0-src-components` [LOW] via `calls`: calls x2 Evidence: src/main.jsx:calls, temp_extraction/src/main.jsx:calls
- `subsystem-25-0-src-main-jsx` -> `subsystem-53-0-src-app-jsx` [HIGH] via `imports`: imports x3 Evidence: src/main.jsx:imports, src/main.jsx:imports, temp_extraction/src/main.jsx:imports
- `subsystem-25-0-src-main-jsx` -> `subsystem-66-0-src-components` [LOW] via `calls`: calls x1 Evidence: src/main.jsx:calls
- `subsystem-26-0-temp-extraction` -> `subsystem-104-0-src-components` [LOW] via `calls`: calls x6 Evidence: temp_extraction/src/components/screens/PlayersScreen.jsx:calls, temp_extraction/src/components/screens/PlayersScreen.jsx:calls, temp_extraction/src/components/screens/PlayersScreen.jsx:calls
- `subsystem-26-0-temp-extraction` -> `subsystem-106-0-src-components` [LOW] via `calls`: calls x1 Evidence: temp_extraction/src/components/screens/PlayersScreen.jsx:calls
- `subsystem-26-0-temp-extraction` -> `subsystem-145-0-temp-extraction` [MEDIUM] via `imports`: imports x1 Evidence: temp_extraction/src/components/screens/PlayersScreen.jsx:imports
- `subsystem-26-0-temp-extraction` -> `subsystem-150-0-src-components` [LOW] via `calls`: calls x8 Evidence: temp_extraction/src/components/screens/PlayersScreen.jsx:calls, temp_extraction/src/components/screens/PlayersScreen.jsx:calls, temp_extraction/src/components/screens/PlayersScreen.jsx:calls
- `subsystem-26-0-temp-extraction` -> `subsystem-153-0-src-components` [LOW] via `calls`: calls x1 Evidence: temp_extraction/src/components/screens/PlayersScreen.jsx:calls
- `subsystem-26-0-temp-extraction` -> `subsystem-159-0-src-components` [LOW] via `calls`: calls x1 Evidence: temp_extraction/src/components/screens/PlayersScreen.jsx:calls
- `subsystem-26-0-temp-extraction` -> `subsystem-161-0-src-components` [LOW] via `calls`: calls x2 Evidence: temp_extraction/src/components/screens/PlayersScreen.jsx:calls, temp_extraction/src/components/screens/PlayersScreen.jsx:calls
- `subsystem-26-0-temp-extraction` -> `subsystem-162-0-src-components` [LOW] via `calls`: calls x1 Evidence: temp_extraction/src/components/screens/PlayersScreen.jsx:calls
- `subsystem-26-0-temp-extraction` -> `subsystem-169-0-src-components` [LOW] via `calls`: calls x3 Evidence: temp_extraction/src/components/screens/PlayersScreen.jsx:calls, temp_extraction/src/components/screens/PlayersScreen.jsx:calls, temp_extraction/src/components/screens/PlayersScreen.jsx:calls
- `subsystem-26-0-temp-extraction` -> `subsystem-179-0-temp-extraction` [LOW] via `calls`: calls x1 Evidence: temp_extraction/src/components/screens/PlayersScreen.jsx:calls
- `subsystem-26-0-temp-extraction` -> `subsystem-2-0-src-components` [LOW] via `calls`: calls x1 Evidence: temp_extraction/src/components/screens/PlayersScreen.jsx:calls
- `subsystem-26-0-temp-extraction` -> `subsystem-29-0-src-components` [LOW] via `calls`: calls x1 Evidence: temp_extraction/src/components/screens/PlayersScreen.jsx:calls
- `subsystem-26-0-temp-extraction` -> `subsystem-3-0-src-components` [LOW] via `calls`: calls x5 Evidence: temp_extraction/src/components/screens/PlayersScreen.jsx:calls, temp_extraction/src/components/screens/PlayersScreen.jsx:calls, temp_extraction/src/components/screens/PlayersScreen.jsx:calls
- `subsystem-26-0-temp-extraction` -> `subsystem-30-0-src-components` [LOW] via `calls`: calls x3 Evidence: temp_extraction/src/components/screens/PlayersScreen.jsx:calls, temp_extraction/src/components/screens/PlayersScreen.jsx:calls, temp_extraction/src/components/screens/PlayersScreen.jsx:calls
- `subsystem-26-0-temp-extraction` -> `subsystem-32-0-src-components` [HIGH] via `calls`: calls x9, contains x1 Evidence: temp_extraction/src/components/screens/PlayersScreen.jsx:calls, temp_extraction/src/components/screens/PlayersScreen.jsx:calls, temp_extraction/src/components/screens/PlayersScreen.jsx:calls
- `subsystem-26-0-temp-extraction` -> `subsystem-33-0-src-components` [LOW] via `calls`: calls x2 Evidence: temp_extraction/src/components/screens/PlayersScreen.jsx:calls, temp_extraction/src/components/screens/PlayersScreen.jsx:calls
- `subsystem-26-0-temp-extraction` -> `subsystem-36-0-src-components` [LOW] via `calls`: calls x1 Evidence: temp_extraction/src/components/screens/PlayersScreen.jsx:calls
- `subsystem-26-0-temp-extraction` -> `subsystem-53-0-src-app-jsx` [HIGH] via `calls`: calls x1, imports x1 Evidence: temp_extraction/src/components/screens/PlayersScreen.jsx:calls, temp_extraction/src/components/screens/PlayersScreen.jsx:imports
- `subsystem-26-0-temp-extraction` -> `subsystem-59-0-temp-extraction` [LOW] via `calls`: calls x2 Evidence: temp_extraction/src/components/screens/PlayersScreen.jsx:calls, temp_extraction/src/components/screens/PlayersScreen.jsx:calls
- `subsystem-26-0-temp-extraction` -> `subsystem-65-0-src-components` [LOW] via `calls`: calls x1 Evidence: temp_extraction/src/components/screens/PlayersScreen.jsx:calls
- `subsystem-26-0-temp-extraction` -> `subsystem-77-0-src-components` [LOW] via `calls`: calls x2 Evidence: temp_extraction/src/components/screens/PlayersScreen.jsx:calls, temp_extraction/src/components/screens/PlayersScreen.jsx:calls
- `subsystem-26-0-temp-extraction` -> `subsystem-87-0-temp-extraction` [MEDIUM] via `imports`: imports x1 Evidence: temp_extraction/src/components/screens/PlayersScreen.jsx:imports
- `subsystem-26-0-temp-extraction` -> `subsystem-88-0-src-components` [LOW] via `calls`: calls x16 Evidence: temp_extraction/src/components/screens/PlayersScreen.jsx:calls, temp_extraction/src/components/screens/PlayersScreen.jsx:calls, temp_extraction/src/components/screens/PlayersScreen.jsx:calls
- `subsystem-26-0-temp-extraction` -> `subsystem-98-0-temp-extraction` [MEDIUM] via `imports`: imports x1 Evidence: temp_extraction/src/components/screens/PlayersScreen.jsx:imports
- `subsystem-28-0-src-components` -> `subsystem-102-0-src-components` [LOW] via `calls`: calls x4 Evidence: src/components/NotificationPrompt.jsx:calls, src/components/NotificationPrompt.jsx:calls, src/components/NotificationPrompt.jsx:calls
- `subsystem-28-0-src-components` -> `subsystem-121-0-src-components` [LOW] via `calls`: calls x5 Evidence: src/components/NotificationPrompt.jsx:calls, src/components/NotificationPrompt.jsx:calls, src/components/NotificationPrompt.jsx:calls
- `subsystem-28-0-src-components` -> `subsystem-130-0-src-lib` [MEDIUM] via `imports`: imports x1 Evidence: src/components/NotificationPrompt.jsx:imports
- `subsystem-28-0-src-components` -> `subsystem-153-0-src-components` [LOW] via `calls`: calls x1 Evidence: src/components/NotificationPrompt.jsx:calls
- `subsystem-28-0-src-components` -> `subsystem-29-0-src-components` [HIGH] via `calls`: calls x1, imports x1 Evidence: src/components/NotificationPrompt.jsx:calls, src/components/NotificationPrompt.jsx:imports
- `subsystem-28-0-src-components` -> `subsystem-53-0-src-app-jsx` [HIGH] via `imports`: imports x2 Evidence: src/components/NotificationPrompt.jsx:imports, src/components/NotificationPrompt.jsx:imports
- `subsystem-28-0-src-components` -> `subsystem-88-0-src-components` [LOW] via `calls`: calls x3 Evidence: src/components/NotificationPrompt.jsx:calls, src/components/NotificationPrompt.jsx:calls, src/components/NotificationPrompt.jsx:calls
- `subsystem-28-0-src-components` -> `subsystem-9-0-src-components` [LOW] via `calls`: calls x1 Evidence: src/components/NotificationPrompt.jsx:calls
- `subsystem-29-0-src-components` -> `subsystem-1-0-src-context` [MEDIUM] via `imports`: imports x1 Evidence: src/components/BottomNav.jsx:imports
- `subsystem-29-0-src-components` -> `subsystem-53-0-src-app-jsx` [HIGH] via `imports`: imports x2, calls x1 Evidence: src/components/BottomNav.jsx:calls, src/components/BottomNav.jsx:imports, src/components/BottomNav.jsx:imports
- `subsystem-29-0-src-components` -> `subsystem-88-0-src-components` [HIGH] via `calls`: calls x2, contains x1 Evidence: src/components/BottomNav.jsx:calls, src/components/BottomNav.jsx:calls, src/components/BottomNav.jsx:contains
- `subsystem-3-0-src-components` -> `subsystem-0-0-src-lib` [MEDIUM] via `imports`: imports x1 Evidence: src/components/screens/MatchSetupScreen.jsx:imports
- `subsystem-3-0-src-components` -> `subsystem-1-0-src-context` [MEDIUM] via `imports`: imports x2 Evidence: src/components/screens/InningsInitScreen.jsx:imports, src/components/screens/MatchSetupScreen.jsx:imports
- `subsystem-3-0-src-components` -> `subsystem-103-0-src-components` [LOW] via `calls`: calls x12 Evidence: src/components/screens/InningsInitScreen.jsx:calls, src/components/screens/InningsInitScreen.jsx:calls, src/components/screens/InningsInitScreen.jsx:calls
- `subsystem-3-0-src-components` -> `subsystem-104-0-src-components` [LOW] via `calls`: calls x8 Evidence: src/components/screens/MatchSetupScreen.jsx:calls, src/components/screens/MatchSetupScreen.jsx:calls, src/components/screens/MatchSetupScreen.jsx:calls
- `subsystem-3-0-src-components` -> `subsystem-11-0-src-components` [LOW] via `calls`: calls x1 Evidence: src/components/screens/MatchSetupScreen.jsx:calls
- `subsystem-3-0-src-components` -> `subsystem-121-0-src-components` [LOW] via `calls`: calls x2 Evidence: src/components/screens/MatchSetupScreen.jsx:calls, src/components/screens/MatchSetupScreen.jsx:calls
- `subsystem-3-0-src-components` -> `subsystem-123-0-src-components` [LOW] via `calls`: calls x3 Evidence: src/components/screens/MatchSetupScreen.jsx:calls, src/components/screens/MatchSetupScreen.jsx:calls, src/components/screens/MatchSetupScreen.jsx:calls
- `subsystem-3-0-src-components` -> `subsystem-150-0-src-components` [LOW] via `calls`: calls x2 Evidence: src/components/screens/MatchSetupScreen.jsx:calls, src/components/screens/MatchSetupScreen.jsx:calls
- `subsystem-3-0-src-components` -> `subsystem-159-0-src-components` [LOW] via `calls`: calls x2 Evidence: src/components/screens/InningsInitScreen.jsx:calls, src/components/screens/MatchSetupScreen.jsx:calls
- `subsystem-3-0-src-components` -> `subsystem-160-0-src-components` [LOW] via `calls`: calls x1 Evidence: src/components/screens/MatchSetupScreen.jsx:calls
- `subsystem-3-0-src-components` -> `subsystem-167-0-src-components` [LOW] via `calls`: calls x1 Evidence: temp_extraction/src/components/screens/MatchSetupScreen.jsx:calls
- `subsystem-3-0-src-components` -> `subsystem-2-0-src-components` [LOW] via `calls`: calls x11 Evidence: src/components/screens/InningsInitScreen.jsx:calls, src/components/screens/MatchSetupScreen.jsx:calls, src/components/screens/MatchSetupScreen.jsx:calls
- `subsystem-3-0-src-components` -> `subsystem-24-0-src-components` [LOW] via `calls`: calls x2 Evidence: temp_extraction/src/components/screens/MatchSetupScreen.jsx:calls, temp_extraction/src/components/screens/MatchSetupScreen.jsx:calls
- `subsystem-3-0-src-components` -> `subsystem-29-0-src-components` [HIGH] via `imports`: imports x3, calls x2 Evidence: src/components/screens/InningsInitScreen.jsx:imports, src/components/screens/MatchSetupScreen.jsx:imports, temp_extraction/src/components/screens/MatchSetupScreen.jsx:calls
- `subsystem-3-0-src-components` -> `subsystem-30-0-src-components` [LOW] via `calls`: calls x6 Evidence: temp_extraction/src/components/screens/MatchSetupScreen.jsx:calls, temp_extraction/src/components/screens/MatchSetupScreen.jsx:calls, temp_extraction/src/components/screens/MatchSetupScreen.jsx:calls
- `subsystem-3-0-src-components` -> `subsystem-32-0-src-components` [LOW] via `calls`: calls x1 Evidence: temp_extraction/src/components/screens/MatchSetupScreen.jsx:calls
- `subsystem-3-0-src-components` -> `subsystem-53-0-src-app-jsx` [HIGH] via `imports`: imports x5, calls x3 Evidence: src/components/screens/InningsInitScreen.jsx:calls, src/components/screens/InningsInitScreen.jsx:imports, src/components/screens/InningsInitScreen.jsx:imports
- `subsystem-3-0-src-components` -> `subsystem-6-0-src-components` [MEDIUM] via `calls`: calls x4, imports x1 Evidence: src/components/screens/InningsInitScreen.jsx:calls, src/components/screens/MatchSetupScreen.jsx:calls, src/components/screens/MatchSetupScreen.jsx:calls
- `subsystem-3-0-src-components` -> `subsystem-61-0-src-components` [LOW] via `calls`: calls x2 Evidence: src/components/screens/MatchSetupScreen.jsx:calls, temp_extraction/src/components/screens/MatchSetupScreen.jsx:calls
- `subsystem-3-0-src-components` -> `subsystem-69-0-src-components` [LOW] via `calls`: calls x1 Evidence: src/components/screens/MatchSetupScreen.jsx:calls
- `subsystem-3-0-src-components` -> `subsystem-7-0-src-components` [LOW] via `calls`: calls x9 Evidence: src/components/screens/InningsInitScreen.jsx:calls, src/components/screens/InningsInitScreen.jsx:calls, src/components/screens/MatchSetupScreen.jsx:calls
- `subsystem-3-0-src-components` -> `subsystem-75-0-src-components` [LOW] via `calls`: calls x1 Evidence: src/components/screens/MatchSetupScreen.jsx:calls
- `subsystem-3-0-src-components` -> `subsystem-88-0-src-components` [LOW] via `calls`: calls x28 Evidence: src/components/screens/InningsInitScreen.jsx:calls, src/components/screens/InningsInitScreen.jsx:calls, src/components/screens/InningsInitScreen.jsx:calls
- `subsystem-3-0-src-components` -> `subsystem-98-0-temp-extraction` [MEDIUM] via `imports`: imports x1 Evidence: temp_extraction/src/components/screens/MatchSetupScreen.jsx:imports
- `subsystem-30-0-src-components` -> `subsystem-1-0-src-context` [MEDIUM] via `imports`: imports x1 Evidence: src/components/screens/SelectionScreen.jsx:imports
- `subsystem-30-0-src-components` -> `subsystem-104-0-src-components` [LOW] via `calls`: calls x4 Evidence: src/components/screens/SelectionScreen.jsx:calls, src/components/screens/SelectionScreen.jsx:calls, src/components/screens/SelectionScreen.jsx:calls
- `subsystem-30-0-src-components` -> `subsystem-106-0-src-components` [LOW] via `calls`: calls x1 Evidence: src/components/screens/SelectionScreen.jsx:calls
- `subsystem-30-0-src-components` -> `subsystem-126-0-src-components` [MEDIUM] via `imports`: imports x1 Evidence: src/components/screens/SelectionScreen.jsx:imports
- `subsystem-30-0-src-components` -> `subsystem-150-0-src-components` [LOW] via `calls`: calls x4 Evidence: src/components/screens/SelectionScreen.jsx:calls, src/components/screens/SelectionScreen.jsx:calls, src/components/screens/SelectionScreen.jsx:calls
- `subsystem-30-0-src-components` -> `subsystem-161-0-src-components` [LOW] via `calls`: calls x1 Evidence: src/components/screens/SelectionScreen.jsx:calls
- `subsystem-30-0-src-components` -> `subsystem-162-0-src-components` [LOW] via `calls`: calls x1 Evidence: src/components/screens/SelectionScreen.jsx:calls
- `subsystem-30-0-src-components` -> `subsystem-167-0-src-components` [LOW] via `calls`: calls x1 Evidence: src/components/screens/SelectionScreen.jsx:calls
- `subsystem-30-0-src-components` -> `subsystem-180-0-src-components` [HIGH] via `calls`: calls x1, contains x1 Evidence: src/components/screens/SelectionScreen.jsx:calls, src/components/screens/SelectionScreen.jsx:contains
- `subsystem-30-0-src-components` -> `subsystem-32-0-src-components` [HIGH] via `calls`: calls x5, contains x1 Evidence: src/components/screens/SelectionScreen.jsx:calls, src/components/screens/SelectionScreen.jsx:calls, src/components/screens/SelectionScreen.jsx:calls
- `subsystem-30-0-src-components` -> `subsystem-33-0-src-components` [LOW] via `calls`: calls x3 Evidence: src/components/screens/SelectionScreen.jsx:calls, src/components/screens/SelectionScreen.jsx:calls, src/components/screens/SelectionScreen.jsx:calls
- `subsystem-30-0-src-components` -> `subsystem-53-0-src-app-jsx` [HIGH] via `imports`: imports x2, calls x1 Evidence: src/components/screens/SelectionScreen.jsx:calls, src/components/screens/SelectionScreen.jsx:imports, src/components/screens/SelectionScreen.jsx:imports
- `subsystem-30-0-src-components` -> `subsystem-54-0-src-components` [LOW] via `calls`: calls x1 Evidence: src/components/screens/SelectionScreen.jsx:calls
- `subsystem-30-0-src-components` -> `subsystem-86-0-src-components` [MEDIUM] via `imports`: imports x1 Evidence: src/components/screens/SelectionScreen.jsx:imports
- `subsystem-30-0-src-components` -> `subsystem-88-0-src-components` [LOW] via `calls`: calls x8 Evidence: src/components/screens/SelectionScreen.jsx:calls, src/components/screens/SelectionScreen.jsx:calls, src/components/screens/SelectionScreen.jsx:calls
- `subsystem-30-0-src-components` -> `subsystem-89-0-src-components` [HIGH] via `calls`: calls x2, contains x1 Evidence: src/components/screens/SelectionScreen.jsx:calls, src/components/screens/SelectionScreen.jsx:calls, src/components/screens/SelectionScreen.jsx:contains
- `subsystem-30-0-src-components` -> `subsystem-9-0-src-components` [MEDIUM] via `imports`: imports x1 Evidence: src/components/screens/SelectionScreen.jsx:imports
- `subsystem-31-0-src-components` -> `subsystem-0-0-src-lib` [MEDIUM] via `imports`: imports x1 Evidence: src/components/screens/SelectorAssignmentModal.jsx:imports
- `subsystem-31-0-src-components` -> `subsystem-121-0-src-components` [LOW] via `calls`: calls x4 Evidence: src/components/screens/SelectorAssignmentModal.jsx:calls, src/components/screens/SelectorAssignmentModal.jsx:calls, src/components/screens/SelectorAssignmentModal.jsx:calls
- `subsystem-31-0-src-components` -> `subsystem-123-0-src-components` [LOW] via `calls`: calls x2 Evidence: src/components/screens/SelectorAssignmentModal.jsx:calls, src/components/screens/SelectorAssignmentModal.jsx:calls
- `subsystem-31-0-src-components` -> `subsystem-169-0-src-components` [LOW] via `calls`: calls x2 Evidence: src/components/screens/SelectorAssignmentModal.jsx:calls, src/components/screens/SelectorAssignmentModal.jsx:calls
- `subsystem-31-0-src-components` -> `subsystem-170-0-src-components` [LOW] via `calls`: calls x1 Evidence: src/components/screens/SelectorAssignmentModal.jsx:calls
- `subsystem-31-0-src-components` -> `subsystem-29-0-src-components` [HIGH] via `calls`: calls x1, imports x1 Evidence: src/components/screens/SelectorAssignmentModal.jsx:calls, src/components/screens/SelectorAssignmentModal.jsx:imports
- `subsystem-31-0-src-components` -> `subsystem-53-0-src-app-jsx` [HIGH] via `imports`: imports x1 Evidence: src/components/screens/SelectorAssignmentModal.jsx:imports
- `subsystem-31-0-src-components` -> `subsystem-7-0-src-components` [LOW] via `calls`: calls x4 Evidence: src/components/screens/SelectorAssignmentModal.jsx:calls, src/components/screens/SelectorAssignmentModal.jsx:calls, src/components/screens/SelectorAssignmentModal.jsx:calls
- `subsystem-31-0-src-components` -> `subsystem-73-0-src-components` [LOW] via `calls`: calls x1 Evidence: src/components/screens/SelectorAssignmentModal.jsx:calls
- `subsystem-31-0-src-components` -> `subsystem-88-0-src-components` [LOW] via `calls`: calls x4 Evidence: src/components/screens/SelectorAssignmentModal.jsx:calls, src/components/screens/SelectorAssignmentModal.jsx:calls, src/components/screens/SelectorAssignmentModal.jsx:calls
- `subsystem-32-0-src-components` -> `subsystem-1-0-src-context` [MEDIUM] via `imports`: imports x1 Evidence: src/components/screens/PlayersScreen.jsx:imports
- `subsystem-32-0-src-components` -> `subsystem-104-0-src-components` [LOW] via `calls`: calls x3 Evidence: src/components/screens/PlayersScreen.jsx:calls, src/components/screens/PlayersScreen.jsx:calls, src/components/screens/PlayersScreen.jsx:calls
- `subsystem-32-0-src-components` -> `subsystem-12-0-src-components` [MEDIUM] via `imports`: imports x1 Evidence: src/components/screens/PlayersScreen.jsx:imports
- `subsystem-32-0-src-components` -> `subsystem-124-0-src-components` [LOW] via `calls`: calls x1 Evidence: src/components/screens/TeamsScreen.jsx:calls
- `subsystem-32-0-src-components` -> `subsystem-150-0-src-components` [LOW] via `calls`: calls x2 Evidence: src/components/screens/PlayersScreen.jsx:calls, src/components/screens/PlayersScreen.jsx:calls
- `subsystem-32-0-src-components` -> `subsystem-153-0-src-components` [LOW] via `calls`: calls x2 Evidence: src/components/screens/PlayersScreen.jsx:calls, src/components/screens/PlayersScreen.jsx:calls
- `subsystem-32-0-src-components` -> `subsystem-156-0-src-components` [LOW] via `calls`: calls x1 Evidence: src/components/screens/PlayersScreen.jsx:calls
- `subsystem-32-0-src-components` -> `subsystem-162-0-src-components` [LOW] via `calls`: calls x1 Evidence: src/components/screens/PlayersScreen.jsx:calls
- `subsystem-32-0-src-components` -> `subsystem-165-0-src-components` [LOW] via `calls`: calls x9 Evidence: src/components/screens/PlayersScreen.jsx:calls, src/components/screens/ScoutingHubScreen.jsx:calls, src/components/screens/SelectionScreen.jsx:calls
- `subsystem-32-0-src-components` -> `subsystem-29-0-src-components` [HIGH] via `calls`: calls x10, imports x1 Evidence: src/components/screens/PlayersScreen.jsx:calls, src/components/screens/PlayersScreen.jsx:imports, src/components/screens/PlayersScreen.jsx:calls
- `subsystem-32-0-src-components` -> `subsystem-3-0-src-components` [LOW] via `calls`: calls x2 Evidence: src/components/screens/PlayersScreen.jsx:calls, src/components/screens/PlayersScreen.jsx:calls
- `subsystem-32-0-src-components` -> `subsystem-53-0-src-app-jsx` [HIGH] via `calls`: calls x1, imports x1 Evidence: src/components/screens/PlayersScreen.jsx:calls, src/components/screens/PlayersScreen.jsx:imports
- `subsystem-32-0-src-components` -> `subsystem-88-0-src-components` [LOW] via `calls`: calls x7 Evidence: src/components/screens/PlayersScreen.jsx:calls, src/components/screens/PlayersScreen.jsx:calls, src/components/screens/PlayersScreen.jsx:calls
- `subsystem-33-0-src-components` -> `subsystem-1-0-src-context` [MEDIUM] via `imports`: imports x1 Evidence: src/components/screens/ScoutingHubScreen.jsx:imports
- `subsystem-33-0-src-components` -> `subsystem-104-0-src-components` [LOW] via `calls`: calls x4 Evidence: src/components/screens/ScoutingHubScreen.jsx:calls, src/components/screens/ScoutingHubScreen.jsx:calls, src/components/screens/ScoutingHubScreen.jsx:calls
- `subsystem-33-0-src-components` -> `subsystem-150-0-src-components` [LOW] via `calls`: calls x3 Evidence: src/components/screens/ScoutingHubScreen.jsx:calls, src/components/screens/ScoutingHubScreen.jsx:calls, src/components/screens/ScoutingHubScreen.jsx:calls
- `subsystem-33-0-src-components` -> `subsystem-161-0-src-components` [LOW] via `calls`: calls x1 Evidence: src/components/screens/ScoutingHubScreen.jsx:calls
- `subsystem-33-0-src-components` -> `subsystem-29-0-src-components` [LOW] via `calls`: calls x1 Evidence: src/components/screens/ScoutingHubScreen.jsx:calls
- `subsystem-33-0-src-components` -> `subsystem-32-0-src-components` [HIGH] via `calls`: calls x5, contains x1 Evidence: src/components/screens/ScoutingHubScreen.jsx:calls, src/components/screens/ScoutingHubScreen.jsx:calls, src/components/screens/ScoutingHubScreen.jsx:calls
- `subsystem-33-0-src-components` -> `subsystem-53-0-src-app-jsx` [HIGH] via `calls`: calls x1, imports x1 Evidence: src/components/screens/ScoutingHubScreen.jsx:calls, src/components/screens/ScoutingHubScreen.jsx:imports
- `subsystem-33-0-src-components` -> `subsystem-88-0-src-components` [LOW] via `calls`: calls x11 Evidence: src/components/screens/ScoutingHubScreen.jsx:calls, src/components/screens/ScoutingHubScreen.jsx:calls, src/components/screens/ScoutingHubScreen.jsx:calls
- `subsystem-34-0-src-components` -> `subsystem-0-0-src-lib` [MEDIUM] via `imports`: imports x1 Evidence: src/components/screens/SeasonManagementTab.jsx:imports
- `subsystem-34-0-src-components` -> `subsystem-121-0-src-components` [LOW] via `calls`: calls x6 Evidence: src/components/screens/SeasonManagementTab.jsx:calls, src/components/screens/SeasonManagementTab.jsx:calls, src/components/screens/SeasonManagementTab.jsx:calls
- `subsystem-34-0-src-components` -> `subsystem-29-0-src-components` [LOW] via `calls`: calls x1 Evidence: src/components/screens/SeasonManagementTab.jsx:calls
- `subsystem-34-0-src-components` -> `subsystem-39-0-src-components` [LOW] via `calls`: calls x5 Evidence: src/components/screens/SeasonManagementTab.jsx:calls, src/components/screens/SeasonManagementTab.jsx:calls, src/components/screens/SeasonManagementTab.jsx:calls
- `subsystem-34-0-src-components` -> `subsystem-53-0-src-app-jsx` [HIGH] via `imports`: imports x1 Evidence: src/components/screens/SeasonManagementTab.jsx:imports
- `subsystem-34-0-src-components` -> `subsystem-7-0-src-components` [LOW] via `calls`: calls x7 Evidence: src/components/screens/SeasonManagementTab.jsx:calls, src/components/screens/SeasonManagementTab.jsx:calls, src/components/screens/SeasonManagementTab.jsx:calls
- `subsystem-34-0-src-components` -> `subsystem-73-0-src-components` [LOW] via `calls`: calls x2 Evidence: src/components/screens/SeasonManagementTab.jsx:calls, src/components/screens/SeasonManagementTab.jsx:calls
- `subsystem-34-0-src-components` -> `subsystem-88-0-src-components` [LOW] via `calls`: calls x5 Evidence: src/components/screens/SeasonManagementTab.jsx:calls, src/components/screens/SeasonManagementTab.jsx:calls, src/components/screens/SeasonManagementTab.jsx:calls
- `subsystem-35-0-src-components` -> `subsystem-151-0-src-components` [LOW] via `calls`: calls x2 Evidence: src/components/CricketIllustrations.jsx:calls, temp_extraction/src/components/CricketIllustrations.jsx:calls
- `subsystem-35-0-src-components` -> `subsystem-53-0-src-app-jsx` [HIGH] via `imports`: imports x2 Evidence: src/components/CricketIllustrations.jsx:imports, temp_extraction/src/components/CricketIllustrations.jsx:imports
- `subsystem-36-0-src-components` -> `subsystem-29-0-src-components` [HIGH] via `imports`: imports x2 Evidence: src/components/ui/DataTable.jsx:imports, temp_extraction/src/components/ui/DataTable.jsx:imports
- `subsystem-36-0-src-components` -> `subsystem-53-0-src-app-jsx` [HIGH] via `imports`: imports x2 Evidence: src/components/ui/DataTable.jsx:imports, temp_extraction/src/components/ui/DataTable.jsx:imports
- `subsystem-36-0-src-components` -> `subsystem-88-0-src-components` [LOW] via `calls`: calls x4 Evidence: src/components/ui/DataTable.jsx:calls, src/components/ui/DataTable.jsx:calls, temp_extraction/src/components/ui/DataTable.jsx:calls
- `subsystem-37-0-src-engine` -> `subsystem-16-0-src-components` [LOW] via `calls`: calls x6 Evidence: src/engine/derivedScorecard.js:calls, src/engine/derivedScorecard.js:calls, src/engine/derivedScorecard.js:calls
- `subsystem-37-0-src-engine` -> `subsystem-23-0-src-engine` [HIGH] via `calls`: calls x4, contains x1 Evidence: src/engine/derivedScorecard.js:contains, src/engine/derivedScorecard.js:calls, src/engine/derivedScorecard.js:calls
- `subsystem-38-0-src-sw-js` -> `subsystem-27-0-apply-bug5-sql-js` [LOW] via `calls`: calls x1 Evidence: src/sw.js:calls
- `subsystem-39-0-src-components` -> `subsystem-0-0-src-lib` [MEDIUM] via `imports`: imports x1 Evidence: src/components/screens/NewsScreen.jsx:imports
- `subsystem-39-0-src-components` -> `subsystem-1-0-src-context` [MEDIUM] via `imports`: imports x1 Evidence: src/components/screens/NewsScreen.jsx:imports
- `subsystem-39-0-src-components` -> `subsystem-121-0-src-components` [LOW] via `calls`: calls x2 Evidence: src/components/screens/NewsScreen.jsx:calls, src/components/screens/NewsScreen.jsx:calls
- `subsystem-39-0-src-components` -> `subsystem-123-0-src-components` [LOW] via `calls`: calls x2 Evidence: src/components/screens/NewsScreen.jsx:calls, src/components/screens/NewsScreen.jsx:calls
- `subsystem-39-0-src-components` -> `subsystem-22-0-src-components` [LOW] via `calls`: calls x1 Evidence: src/components/screens/NewsScreen.jsx:calls
- `subsystem-39-0-src-components` -> `subsystem-29-0-src-components` [HIGH] via `calls`: calls x1, imports x1 Evidence: src/components/screens/NewsScreen.jsx:calls, src/components/screens/NewsScreen.jsx:imports
- `subsystem-39-0-src-components` -> `subsystem-3-0-src-components` [LOW] via `calls`: calls x1 Evidence: src/components/screens/NewsScreen.jsx:calls
- `subsystem-39-0-src-components` -> `subsystem-53-0-src-app-jsx` [HIGH] via `calls`: calls x1, imports x1 Evidence: src/components/screens/NewsScreen.jsx:calls, src/components/screens/NewsScreen.jsx:imports
- `subsystem-39-0-src-components` -> `subsystem-6-0-src-components` [LOW] via `calls`: calls x1 Evidence: src/components/screens/NewsScreen.jsx:calls
- `subsystem-39-0-src-components` -> `subsystem-7-0-src-components` [LOW] via `calls`: calls x2 Evidence: src/components/screens/NewsScreen.jsx:calls, src/components/screens/NewsScreen.jsx:calls
- `subsystem-39-0-src-components` -> `subsystem-88-0-src-components` [LOW] via `calls`: calls x4 Evidence: src/components/screens/NewsScreen.jsx:calls, src/components/screens/NewsScreen.jsx:calls, src/components/screens/NewsScreen.jsx:calls
- `subsystem-40-0-src-components` -> `subsystem-0-0-src-lib` [MEDIUM] via `imports`: imports x1 Evidence: src/components/screens/RecycleBinTab.jsx:imports
- `subsystem-40-0-src-components` -> `subsystem-121-0-src-components` [LOW] via `calls`: calls x6 Evidence: src/components/screens/RecycleBinTab.jsx:calls, src/components/screens/RecycleBinTab.jsx:calls, src/components/screens/RecycleBinTab.jsx:calls
- `subsystem-40-0-src-components` -> `subsystem-29-0-src-components` [HIGH] via `calls`: calls x1, imports x1 Evidence: src/components/screens/RecycleBinTab.jsx:calls, src/components/screens/RecycleBinTab.jsx:imports
- `subsystem-40-0-src-components` -> `subsystem-39-0-src-components` [LOW] via `calls`: calls x1 Evidence: src/components/screens/RecycleBinTab.jsx:calls
- `subsystem-40-0-src-components` -> `subsystem-53-0-src-app-jsx` [HIGH] via `imports`: imports x1 Evidence: src/components/screens/RecycleBinTab.jsx:imports
- `subsystem-40-0-src-components` -> `subsystem-7-0-src-components` [LOW] via `calls`: calls x6 Evidence: src/components/screens/RecycleBinTab.jsx:calls, src/components/screens/RecycleBinTab.jsx:calls, src/components/screens/RecycleBinTab.jsx:calls
- `subsystem-40-0-src-components` -> `subsystem-73-0-src-components` [LOW] via `calls`: calls x2 Evidence: src/components/screens/RecycleBinTab.jsx:calls, src/components/screens/RecycleBinTab.jsx:calls
- `subsystem-40-0-src-components` -> `subsystem-88-0-src-components` [LOW] via `calls`: calls x3 Evidence: src/components/screens/RecycleBinTab.jsx:calls, src/components/screens/RecycleBinTab.jsx:calls, src/components/screens/RecycleBinTab.jsx:calls
- `subsystem-41-0-src-lib` -> `subsystem-27-0-apply-bug5-sql-js` [LOW] via `calls`: calls x1 Evidence: src/lib/db.js:calls
- `subsystem-42-0-temp-extraction` -> `subsystem-103-0-src-components` [LOW] via `calls`: calls x2 Evidence: temp_extraction/src/components/screens/MatchesScreen.jsx:calls, temp_extraction/src/components/screens/MatchesScreen.jsx:calls
- `subsystem-42-0-temp-extraction` -> `subsystem-119-0-temp-extraction` [MEDIUM] via `imports`: imports x1 Evidence: temp_extraction/src/components/screens/MatchesScreen.jsx:imports
- `subsystem-42-0-temp-extraction` -> `subsystem-150-0-src-components` [LOW] via `calls`: calls x1 Evidence: temp_extraction/src/components/screens/MatchesScreen.jsx:calls
- `subsystem-42-0-temp-extraction` -> `subsystem-173-0-src-components` [LOW] via `calls`: calls x1 Evidence: temp_extraction/src/components/screens/MatchesScreen.jsx:calls
- `subsystem-42-0-temp-extraction` -> `subsystem-2-0-src-components` [LOW] via `calls`: calls x1 Evidence: temp_extraction/src/components/screens/MatchesScreen.jsx:calls
- `subsystem-42-0-temp-extraction` -> `subsystem-22-0-src-components` [LOW] via `calls`: calls x1 Evidence: temp_extraction/src/components/screens/MatchesScreen.jsx:calls
- `subsystem-42-0-temp-extraction` -> `subsystem-29-0-src-components` [HIGH] via `calls`: calls x1, imports x1 Evidence: temp_extraction/src/components/screens/MatchesScreen.jsx:calls, temp_extraction/src/components/screens/MatchesScreen.jsx:imports
- `subsystem-42-0-temp-extraction` -> `subsystem-3-0-src-components` [LOW] via `calls`: calls x2 Evidence: temp_extraction/src/components/screens/MatchesScreen.jsx:calls, temp_extraction/src/components/screens/MatchesScreen.jsx:calls
- `subsystem-42-0-temp-extraction` -> `subsystem-53-0-src-app-jsx` [HIGH] via `calls`: calls x1, imports x1 Evidence: temp_extraction/src/components/screens/MatchesScreen.jsx:calls, temp_extraction/src/components/screens/MatchesScreen.jsx:imports
- `subsystem-42-0-temp-extraction` -> `subsystem-54-0-src-components` [HIGH] via `calls`: calls x1, contains x1 Evidence: temp_extraction/src/components/screens/MatchesScreen.jsx:calls, temp_extraction/src/components/screens/MatchesScreen.jsx:contains
- `subsystem-42-0-temp-extraction` -> `subsystem-6-0-src-components` [LOW] via `calls`: calls x1 Evidence: temp_extraction/src/components/screens/MatchesScreen.jsx:calls
- `subsystem-42-0-temp-extraction` -> `subsystem-87-0-temp-extraction` [MEDIUM] via `imports`: imports x1 Evidence: temp_extraction/src/components/screens/MatchesScreen.jsx:imports
- `subsystem-42-0-temp-extraction` -> `subsystem-88-0-src-components` [LOW] via `calls`: calls x3 Evidence: temp_extraction/src/components/screens/MatchesScreen.jsx:calls, temp_extraction/src/components/screens/MatchesScreen.jsx:calls, temp_extraction/src/components/screens/MatchesScreen.jsx:calls
- `subsystem-42-0-temp-extraction` -> `subsystem-98-0-temp-extraction` [MEDIUM] via `imports`: imports x1 Evidence: temp_extraction/src/components/screens/MatchesScreen.jsx:imports
- `subsystem-44-0-src-components` -> `subsystem-12-0-src-components` [MEDIUM] via `imports`: imports x1 Evidence: src/components/selection/PlayerPool.jsx:imports
- `subsystem-44-0-src-components` -> `subsystem-122-0-src-components` [LOW] via `calls`: calls x2 Evidence: src/components/selection/PlayerPool.jsx:calls, src/components/selection/PlayerPool.jsx:calls
- `subsystem-44-0-src-components` -> `subsystem-159-0-src-components` [LOW] via `calls`: calls x1 Evidence: src/components/selection/PlayerPool.jsx:calls
- `subsystem-44-0-src-components` -> `subsystem-169-0-src-components` [LOW] via `calls`: calls x1 Evidence: src/components/selection/PlayerPool.jsx:calls
- `subsystem-44-0-src-components` -> `subsystem-52-0-src-hooks` [MEDIUM] via `imports`: imports x1 Evidence: src/components/selection/PlayerPool.jsx:imports
- `subsystem-44-0-src-components` -> `subsystem-53-0-src-app-jsx` [HIGH] via `imports`: imports x2 Evidence: src/components/selection/PlayerPool.jsx:imports, src/components/selection/PlayerPool.jsx:imports
- `subsystem-44-0-src-components` -> `subsystem-88-0-src-components` [LOW] via `calls`: calls x1 Evidence: src/components/selection/PlayerPool.jsx:calls
- `subsystem-44-0-src-components` -> `subsystem-94-0-src-components` [LOW] via `calls`: calls x2 Evidence: src/components/selection/PlayerPool.jsx:calls, src/components/selection/PlayerPool.jsx:calls
- `subsystem-45-0-src-components` -> `subsystem-0-0-src-lib` [MEDIUM] via `imports`: imports x1 Evidence: src/components/ui/TournamentManagerModal.jsx:imports
- `subsystem-45-0-src-components` -> `subsystem-1-0-src-context` [MEDIUM] via `imports`: imports x1 Evidence: src/components/ui/TournamentManagerModal.jsx:imports
- `subsystem-45-0-src-components` -> `subsystem-123-0-src-components` [LOW] via `calls`: calls x1 Evidence: src/components/ui/TournamentManagerModal.jsx:calls
- `subsystem-45-0-src-components` -> `subsystem-171-0-src-components` [LOW] via `calls`: calls x1 Evidence: src/components/ui/TournamentManagerModal.jsx:calls
- `subsystem-45-0-src-components` -> `subsystem-181-0-src-components` [HIGH] via `contains`: contains x1 Evidence: src/components/ui/TournamentManagerModal.jsx:contains
- `subsystem-45-0-src-components` -> `subsystem-2-0-src-components` [LOW] via `calls`: calls x2 Evidence: src/components/ui/TournamentManagerModal.jsx:calls, src/components/ui/TournamentManagerModal.jsx:calls
- `subsystem-45-0-src-components` -> `subsystem-29-0-src-components` [HIGH] via `imports`: imports x1 Evidence: src/components/ui/TournamentManagerModal.jsx:imports
- `subsystem-45-0-src-components` -> `subsystem-3-0-src-components` [LOW] via `calls`: calls x1 Evidence: src/components/ui/TournamentManagerModal.jsx:calls
- `subsystem-45-0-src-components` -> `subsystem-34-0-src-components` [LOW] via `calls`: calls x1 Evidence: src/components/ui/TournamentManagerModal.jsx:calls
- `subsystem-45-0-src-components` -> `subsystem-53-0-src-app-jsx` [HIGH] via `calls`: calls x1, imports x1 Evidence: src/components/ui/TournamentManagerModal.jsx:calls, src/components/ui/TournamentManagerModal.jsx:imports
- `subsystem-45-0-src-components` -> `subsystem-6-0-src-components` [LOW] via `calls`: calls x1 Evidence: src/components/ui/TournamentManagerModal.jsx:calls
- `subsystem-45-0-src-components` -> `subsystem-63-0-src-components` [HIGH] via `calls`: calls x4, contains x2 Evidence: src/components/ui/TournamentManagerModal.jsx:calls, src/components/ui/TournamentManagerModal.jsx:calls, src/components/ui/TournamentManagerModal.jsx:contains
- `subsystem-45-0-src-components` -> `subsystem-65-0-src-components` [HIGH] via `contains`: contains x1 Evidence: src/components/ui/TournamentManagerModal.jsx:contains
- `subsystem-45-0-src-components` -> `subsystem-7-0-src-components` [LOW] via `calls`: calls x5 Evidence: src/components/ui/TournamentManagerModal.jsx:calls, src/components/ui/TournamentManagerModal.jsx:calls, src/components/ui/TournamentManagerModal.jsx:calls
- `subsystem-45-0-src-components` -> `subsystem-88-0-src-components` [LOW] via `calls`: calls x6 Evidence: src/components/ui/TournamentManagerModal.jsx:calls, src/components/ui/TournamentManagerModal.jsx:calls, src/components/ui/TournamentManagerModal.jsx:calls
- `subsystem-47-0-src-components` -> `subsystem-1-0-src-context` [MEDIUM] via `imports`: imports x1 Evidence: src/components/DrawerMenu.jsx:imports
- `subsystem-47-0-src-components` -> `subsystem-152-0-src-components` [LOW] via `calls`: calls x4 Evidence: src/components/DrawerMenu.jsx:calls, src/components/Sidebar.jsx:calls, temp_extraction/src/components/DrawerMenu.jsx:calls
- `subsystem-47-0-src-components` -> `subsystem-29-0-src-components` [LOW] via `calls`: calls x12 Evidence: src/components/DrawerMenu.jsx:calls, src/components/DrawerMenu.jsx:calls, src/components/DrawerMenu.jsx:calls
- `subsystem-47-0-src-components` -> `subsystem-53-0-src-app-jsx` [HIGH] via `imports`: imports x2, calls x1 Evidence: src/components/DrawerMenu.jsx:calls, src/components/DrawerMenu.jsx:imports, src/components/DrawerMenu.jsx:imports
- `subsystem-47-0-src-components` -> `subsystem-86-0-src-components` [MEDIUM] via `imports`: imports x1 Evidence: src/components/DrawerMenu.jsx:imports
- `subsystem-47-0-src-components` -> `subsystem-88-0-src-components` [LOW] via `calls`: calls x4 Evidence: src/components/DrawerMenu.jsx:calls, src/components/DrawerMenu.jsx:calls, src/components/DrawerMenu.jsx:calls
- `subsystem-48-0-src-components` -> `subsystem-12-0-src-components` [MEDIUM] via `imports`: imports x1 Evidence: src/components/selection/TeamSelectionDashboard.jsx:imports
- `subsystem-48-0-src-components` -> `subsystem-169-0-src-components` [LOW] via `calls`: calls x2 Evidence: src/components/selection/TeamSelectionDashboard.jsx:calls, src/components/selection/TeamSelectionDashboard.jsx:calls
- `subsystem-48-0-src-components` -> `subsystem-2-0-src-components` [LOW] via `calls`: calls x1 Evidence: src/components/selection/TeamSelectionDashboard.jsx:calls
- `subsystem-48-0-src-components` -> `subsystem-51-0-src-components` [LOW] via `calls`: calls x1 Evidence: src/components/selection/TeamSelectionDashboard.jsx:calls
- `subsystem-48-0-src-components` -> `subsystem-53-0-src-app-jsx` [HIGH] via `imports`: imports x1 Evidence: src/components/selection/TeamSelectionDashboard.jsx:imports
- `subsystem-48-0-src-components` -> `subsystem-88-0-src-components` [LOW] via `calls`: calls x2 Evidence: src/components/selection/TeamSelectionDashboard.jsx:calls, src/components/selection/TeamSelectionDashboard.jsx:calls
- `subsystem-48-0-src-components` -> `subsystem-94-0-src-components` [LOW] via `calls`: calls x1 Evidence: src/components/selection/TeamSelectionDashboard.jsx:calls
- `subsystem-49-0-src-engine` -> `subsystem-23-0-src-engine` [LOW] via `calls`: calls x2 Evidence: src/engine/matchHighlights.js:calls, src/engine/matchHighlights.js:calls
- `subsystem-49-0-src-engine` -> `subsystem-37-0-src-engine` [LOW] via `calls`: calls x5 Evidence: src/engine/matchHighlights.js:calls, src/engine/matchHighlights.js:calls, src/engine/matchHighlights.js:calls
- `subsystem-5-0-src-context` -> `subsystem-105-0-src-components` [LOW] via `calls`: calls x2 Evidence: src/context/CricketContext.jsx:calls, src/context/CricketContext.jsx:calls
- `subsystem-5-0-src-context` -> `subsystem-121-0-src-components` [LOW] via `calls`: calls x12 Evidence: src/context/CricketContext.jsx:calls, src/context/CricketContext.jsx:calls, src/context/CricketContext.jsx:calls
- `subsystem-5-0-src-context` -> `subsystem-152-0-src-components` [LOW] via `calls`: calls x3 Evidence: src/context/CricketContext.jsx:calls, src/context/CricketContext.jsx:calls, src/context/CricketContext.jsx:calls
- `subsystem-5-0-src-context` -> `subsystem-154-0-src-components` [LOW] via `calls`: calls x2 Evidence: src/context/CricketContext.jsx:calls, src/context/CricketContext.jsx:calls
- `subsystem-5-0-src-context` -> `subsystem-160-0-src-components` [LOW] via `calls`: calls x13 Evidence: src/context/CricketContext.jsx:calls, src/context/CricketContext.jsx:calls, src/context/CricketContext.jsx:calls
- `subsystem-5-0-src-context` -> `subsystem-165-0-src-components` [LOW] via `calls`: calls x2 Evidence: src/context/CricketContext.jsx:calls, src/context/CricketContext.jsx:calls
- `subsystem-5-0-src-context` -> `subsystem-2-0-src-components` [LOW] via `calls`: calls x1 Evidence: src/context/CricketContext.jsx:calls
- `subsystem-5-0-src-context` -> `subsystem-21-0-src-components` [LOW] via `calls`: calls x18 Evidence: src/context/CricketContext.jsx:calls, src/context/CricketContext.jsx:calls, src/context/CricketContext.jsx:calls
- `subsystem-5-0-src-context` -> `subsystem-28-0-src-components` [LOW] via `calls`: calls x9 Evidence: src/context/CricketContext.jsx:calls, src/context/CricketContext.jsx:calls, src/context/CricketContext.jsx:calls
- `subsystem-5-0-src-context` -> `subsystem-31-0-src-components` [LOW] via `calls`: calls x2 Evidence: src/context/CricketContext.jsx:calls, src/context/CricketContext.jsx:calls
- `subsystem-5-0-src-context` -> `subsystem-39-0-src-components` [LOW] via `calls`: calls x1 Evidence: src/context/CricketContext.jsx:calls
- `subsystem-5-0-src-context` -> `subsystem-56-0-src-components` [LOW] via `calls`: calls x1 Evidence: src/context/CricketContext.jsx:calls
- `subsystem-5-0-src-context` -> `subsystem-66-0-src-components` [LOW] via `calls`: calls x10 Evidence: src/context/CricketContext.jsx:calls, src/context/CricketContext.jsx:calls, src/context/CricketContext.jsx:calls
- `subsystem-5-0-src-context` -> `subsystem-7-0-src-components` [LOW] via `calls`: calls x4 Evidence: src/context/CricketContext.jsx:calls, src/context/CricketContext.jsx:calls, src/context/CricketContext.jsx:calls
- `subsystem-5-0-src-context` -> `subsystem-70-0-src-components` [LOW] via `calls`: calls x1 Evidence: src/context/CricketContext.jsx:calls
- `subsystem-5-0-src-context` -> `subsystem-92-0-src-context` [LOW] via `calls`: calls x1 Evidence: src/context/CricketContext.jsx:calls
- `subsystem-50-0-temp-extraction` -> `subsystem-13-0-src-engine` [LOW] via `calls`: calls x1 Evidence: temp_extraction/src/engine/matchSummaryEngine.js:calls
- `subsystem-50-0-temp-extraction` -> `subsystem-16-0-src-components` [LOW] via `calls`: calls x2 Evidence: temp_extraction/src/engine/matchSummaryEngine.js:calls, temp_extraction/src/engine/matchSummaryEngine.js:calls
- `subsystem-50-0-temp-extraction` -> `subsystem-23-0-src-engine` [LOW] via `calls`: calls x1 Evidence: temp_extraction/src/engine/matchSummaryEngine.js:calls
- `subsystem-50-0-temp-extraction` -> `subsystem-49-0-src-engine` [HIGH] via `contains`: contains x1 Evidence: temp_extraction/src/engine/matchSummaryEngine.js:contains
- `subsystem-50-0-temp-extraction` -> `subsystem-67-0-src-lib` [LOW] via `calls`: calls x2 Evidence: temp_extraction/src/engine/matchSummaryEngine.js:calls, temp_extraction/src/engine/matchSummaryEngine.js:calls
- `subsystem-51-0-src-components` -> `subsystem-12-0-src-components` [MEDIUM] via `imports`: imports x1 Evidence: src/components/selection/SelectedTeam.jsx:imports
- `subsystem-51-0-src-components` -> `subsystem-150-0-src-components` [LOW] via `calls`: calls x2 Evidence: src/components/selection/SelectedTeam.jsx:calls, src/components/selection/SelectedTeam.jsx:calls
- `subsystem-51-0-src-components` -> `subsystem-159-0-src-components` [LOW] via `calls`: calls x1 Evidence: src/components/selection/SelectedTeam.jsx:calls
- `subsystem-51-0-src-components` -> `subsystem-169-0-src-components` [LOW] via `calls`: calls x1 Evidence: src/components/selection/SelectedTeam.jsx:calls
- `subsystem-51-0-src-components` -> `subsystem-53-0-src-app-jsx` [HIGH] via `imports`: imports x1 Evidence: src/components/selection/SelectedTeam.jsx:imports
- `subsystem-51-0-src-components` -> `subsystem-7-0-src-components` [HIGH] via `calls`: calls x3, contains x1 Evidence: src/components/selection/SelectedTeam.jsx:calls, src/components/selection/SelectedTeam.jsx:calls, src/components/selection/SelectedTeam.jsx:calls
- `subsystem-51-0-src-components` -> `subsystem-88-0-src-components` [LOW] via `calls`: calls x2 Evidence: src/components/selection/SelectedTeam.jsx:calls, src/components/selection/SelectedTeam.jsx:calls
- `subsystem-53-0-src-app-jsx` -> `subsystem-1-0-src-context` [MEDIUM] via `imports`: imports x1 Evidence: src/App.jsx:imports
- `subsystem-53-0-src-app-jsx` -> `subsystem-11-0-src-components` [MEDIUM] via `imports`: imports x1 Evidence: src/App.jsx:imports
- `subsystem-53-0-src-app-jsx` -> `subsystem-110-0-src-components` [MEDIUM] via `imports`: imports x1 Evidence: src/App.jsx:imports
- `subsystem-53-0-src-app-jsx` -> `subsystem-111-0-src-components` [MEDIUM] via `imports`: imports x1 Evidence: src/App.jsx:imports
- `subsystem-53-0-src-app-jsx` -> `subsystem-149-0-src-app-jsx` [LOW] via `calls`: calls x1 Evidence: src/App.jsx:calls
- `subsystem-53-0-src-app-jsx` -> `subsystem-15-0-src-components` [MEDIUM] via `imports`: imports x1 Evidence: src/App.jsx:imports
- `subsystem-53-0-src-app-jsx` -> `subsystem-19-0-src-components` [MEDIUM] via `imports`: imports x1 Evidence: src/App.jsx:imports
- `subsystem-53-0-src-app-jsx` -> `subsystem-2-0-src-components` [MEDIUM] via `imports`: imports x1 Evidence: src/App.jsx:imports
- `subsystem-53-0-src-app-jsx` -> `subsystem-22-0-src-components` [MEDIUM] via `imports`: imports x1 Evidence: src/App.jsx:imports
- `subsystem-53-0-src-app-jsx` -> `subsystem-28-0-src-components` [MEDIUM] via `imports`: imports x1 Evidence: src/App.jsx:imports
- `subsystem-53-0-src-app-jsx` -> `subsystem-29-0-src-components` [MEDIUM] via `imports`: imports x1 Evidence: src/App.jsx:imports
- `subsystem-53-0-src-app-jsx` -> `subsystem-3-0-src-components` [MEDIUM] via `calls`: imports x1, calls x1 Evidence: src/App.jsx:imports, src/App.jsx:calls
- `subsystem-53-0-src-app-jsx` -> `subsystem-32-0-src-components` [MEDIUM] via `imports`: imports x1 Evidence: src/App.jsx:imports
- `subsystem-53-0-src-app-jsx` -> `subsystem-33-0-src-components` [MEDIUM] via `imports`: imports x1 Evidence: src/App.jsx:imports
- `subsystem-53-0-src-app-jsx` -> `subsystem-39-0-src-components` [MEDIUM] via `imports`: imports x1 Evidence: src/App.jsx:imports
- `subsystem-53-0-src-app-jsx` -> `subsystem-47-0-src-components` [MEDIUM] via `imports`: imports x1 Evidence: src/App.jsx:imports
- `subsystem-53-0-src-app-jsx` -> `subsystem-54-0-src-components` [MEDIUM] via `imports`: imports x1 Evidence: src/App.jsx:imports
- `subsystem-53-0-src-app-jsx` -> `subsystem-56-0-src-components` [MEDIUM] via `imports`: imports x1 Evidence: src/App.jsx:imports
- `subsystem-53-0-src-app-jsx` -> `subsystem-62-0-src-components` [MEDIUM] via `imports`: imports x1 Evidence: src/App.jsx:imports
- `subsystem-53-0-src-app-jsx` -> `subsystem-69-0-src-components` [MEDIUM] via `imports`: imports x1 Evidence: src/App.jsx:imports
- `subsystem-53-0-src-app-jsx` -> `subsystem-7-0-src-components` [MEDIUM] via `imports`: imports x1 Evidence: src/App.jsx:imports
- `subsystem-53-0-src-app-jsx` -> `subsystem-70-0-src-components` [MEDIUM] via `imports`: imports x1 Evidence: src/App.jsx:imports
- `subsystem-53-0-src-app-jsx` -> `subsystem-74-0-src-components` [MEDIUM] via `imports`: imports x1 Evidence: src/App.jsx:imports
- `subsystem-53-0-src-app-jsx` -> `subsystem-76-0-src-components` [MEDIUM] via `imports`: imports x1 Evidence: src/App.jsx:imports
- `subsystem-53-0-src-app-jsx` -> `subsystem-77-0-src-components` [MEDIUM] via `imports`: imports x1 Evidence: src/App.jsx:imports
- `subsystem-53-0-src-app-jsx` -> `subsystem-78-0-src-components` [MEDIUM] via `imports`: imports x1 Evidence: src/App.jsx:imports
- `subsystem-53-0-src-app-jsx` -> `subsystem-83-0-src-components` [MEDIUM] via `imports`: imports x1 Evidence: src/App.jsx:imports
- `subsystem-53-0-src-app-jsx` -> `subsystem-84-0-src-components` [MEDIUM] via `imports`: imports x1 Evidence: src/App.jsx:imports
- `subsystem-53-0-src-app-jsx` -> `subsystem-85-0-src-components` [MEDIUM] via `imports`: imports x1 Evidence: src/App.jsx:imports
- `subsystem-53-0-src-app-jsx` -> `subsystem-9-0-src-components` [MEDIUM] via `imports`: imports x1 Evidence: src/App.jsx:imports
- `subsystem-53-0-src-app-jsx` -> `subsystem-93-0-src-components` [MEDIUM] via `imports`: imports x1 Evidence: src/App.jsx:imports
- `subsystem-54-0-src-components` -> `subsystem-1-0-src-context` [MEDIUM] via `imports`: imports x1 Evidence: src/components/screens/MatchesScreen.jsx:imports
- `subsystem-54-0-src-components` -> `subsystem-103-0-src-components` [LOW] via `calls`: calls x2 Evidence: src/components/screens/MatchesScreen.jsx:calls, src/components/screens/MatchesScreen.jsx:calls
- `subsystem-54-0-src-components` -> `subsystem-150-0-src-components` [LOW] via `calls`: calls x3 Evidence: src/components/screens/MatchesScreen.jsx:calls, src/components/screens/MatchesScreen.jsx:calls, src/components/screens/MatchesScreen.jsx:calls
- `subsystem-54-0-src-components` -> `subsystem-22-0-src-components` [LOW] via `calls`: calls x7 Evidence: src/components/screens/MatchesScreen.jsx:calls, src/components/screens/MatchesScreen.jsx:calls, src/components/screens/MatchesScreen.jsx:calls
- `subsystem-54-0-src-components` -> `subsystem-29-0-src-components` [HIGH] via `calls`: calls x6, imports x1 Evidence: src/components/screens/MatchesScreen.jsx:calls, src/components/screens/MatchesScreen.jsx:imports, src/components/screens/MatchesScreen.jsx:calls
- `subsystem-54-0-src-components` -> `subsystem-3-0-src-components` [LOW] via `calls`: calls x1 Evidence: src/components/screens/MatchesScreen.jsx:calls
- `subsystem-54-0-src-components` -> `subsystem-53-0-src-app-jsx` [HIGH] via `calls`: calls x1, imports x1 Evidence: src/components/screens/MatchesScreen.jsx:calls, src/components/screens/MatchesScreen.jsx:imports
- `subsystem-54-0-src-components` -> `subsystem-6-0-src-components` [LOW] via `calls`: calls x1 Evidence: src/components/screens/MatchesScreen.jsx:calls
- `subsystem-54-0-src-components` -> `subsystem-79-0-src-components` [MEDIUM] via `imports`: imports x1 Evidence: src/components/screens/MatchesScreen.jsx:imports
- `subsystem-54-0-src-components` -> `subsystem-86-0-src-components` [MEDIUM] via `imports`: imports x1 Evidence: src/components/screens/MatchesScreen.jsx:imports
- `subsystem-54-0-src-components` -> `subsystem-88-0-src-components` [LOW] via `calls`: calls x1 Evidence: src/components/screens/MatchesScreen.jsx:calls
- `subsystem-55-0-src-components` -> `subsystem-29-0-src-components` [HIGH] via `imports`: imports x1 Evidence: src/components/selection/FilterTiles.jsx:imports
- `subsystem-55-0-src-components` -> `subsystem-33-0-src-components` [LOW] via `calls`: calls x1 Evidence: src/components/selection/FilterTiles.jsx:calls
- `subsystem-55-0-src-components` -> `subsystem-53-0-src-app-jsx` [HIGH] via `imports`: imports x1 Evidence: src/components/selection/FilterTiles.jsx:imports
- `subsystem-55-0-src-components` -> `subsystem-88-0-src-components` [LOW] via `calls`: calls x1 Evidence: src/components/selection/FilterTiles.jsx:calls
- `subsystem-56-0-src-components` -> `subsystem-0-0-src-lib` [MEDIUM] via `imports`: imports x1 Evidence: src/components/screens/PlayerProfileScreen.jsx:imports
- `subsystem-56-0-src-components` -> `subsystem-1-0-src-context` [MEDIUM] via `imports`: imports x1 Evidence: src/components/screens/PlayerProfileScreen.jsx:imports
- `subsystem-56-0-src-components` -> `subsystem-103-0-src-components` [LOW] via `calls`: calls x1 Evidence: src/components/screens/PlayerProfileScreen.jsx:calls
- `subsystem-56-0-src-components` -> `subsystem-161-0-src-components` [LOW] via `calls`: calls x1 Evidence: src/components/screens/PlayerProfileScreen.jsx:calls
- `subsystem-56-0-src-components` -> `subsystem-2-0-src-components` [LOW] via `calls`: calls x1 Evidence: src/components/screens/PlayerProfileScreen.jsx:calls
- `subsystem-56-0-src-components` -> `subsystem-29-0-src-components` [LOW] via `calls`: calls x2 Evidence: src/components/screens/PlayerProfileScreen.jsx:calls, src/components/screens/PlayerProfileScreen.jsx:calls
- `subsystem-56-0-src-components` -> `subsystem-53-0-src-app-jsx` [HIGH] via `calls`: calls x1, imports x1 Evidence: src/components/screens/PlayerProfileScreen.jsx:calls, src/components/screens/PlayerProfileScreen.jsx:imports
- `subsystem-56-0-src-components` -> `subsystem-61-0-src-components` [HIGH] via `contains`: contains x1 Evidence: src/components/screens/PlayerProfileScreen.jsx:contains
- `subsystem-56-0-src-components` -> `subsystem-88-0-src-components` [LOW] via `calls`: calls x4 Evidence: src/components/screens/PlayerProfileScreen.jsx:calls, src/components/screens/PlayerProfileScreen.jsx:calls, src/components/screens/PlayerProfileScreen.jsx:calls
- `subsystem-57-0-src-components` -> `subsystem-16-0-src-components` [MEDIUM] via `imports`: imports x1 Evidence: src/components/selection/CreateTeamModal.jsx:imports
- `subsystem-57-0-src-components` -> `subsystem-164-0-src-components` [LOW] via `calls`: calls x1 Evidence: src/components/selection/CreateTeamModal.jsx:calls
- `subsystem-57-0-src-components` -> `subsystem-2-0-src-components` [LOW] via `calls`: calls x1 Evidence: src/components/selection/CreateTeamModal.jsx:calls
- `subsystem-57-0-src-components` -> `subsystem-29-0-src-components` [HIGH] via `imports`: imports x1 Evidence: src/components/selection/CreateTeamModal.jsx:imports
- `subsystem-57-0-src-components` -> `subsystem-53-0-src-app-jsx` [HIGH] via `imports`: imports x1 Evidence: src/components/selection/CreateTeamModal.jsx:imports
- `subsystem-57-0-src-components` -> `subsystem-65-0-src-components` [HIGH] via `contains`: contains x1 Evidence: src/components/selection/CreateTeamModal.jsx:contains
- `subsystem-57-0-src-components` -> `subsystem-77-0-src-components` [LOW] via `calls`: calls x1 Evidence: src/components/selection/CreateTeamModal.jsx:calls
- `subsystem-57-0-src-components` -> `subsystem-88-0-src-components` [LOW] via `calls`: calls x4 Evidence: src/components/selection/CreateTeamModal.jsx:calls, src/components/selection/CreateTeamModal.jsx:calls, src/components/selection/CreateTeamModal.jsx:calls
- `subsystem-58-0-src-components` -> `subsystem-102-0-src-components` [LOW] via `calls`: calls x2 Evidence: src/components/ui/MatchMediaReport.jsx:calls, temp_extraction/src/components/ui/MatchMediaReport.jsx:calls
- `subsystem-58-0-src-components` -> `subsystem-103-0-src-components` [LOW] via `calls`: calls x3 Evidence: src/components/ui/MatchMediaReport.jsx:calls, src/components/ui/MatchMediaReport.jsx:calls, src/components/ui/MatchMediaReport.jsx:calls
- `subsystem-58-0-src-components` -> `subsystem-121-0-src-components` [LOW] via `calls`: calls x2 Evidence: src/components/ui/MatchMediaReport.jsx:calls, temp_extraction/src/components/ui/MatchMediaReport.jsx:calls
- `subsystem-58-0-src-components` -> `subsystem-128-0-src-engine` [MEDIUM] via `imports`: imports x1 Evidence: src/components/ui/MatchMediaReport.jsx:imports
- `subsystem-58-0-src-components` -> `subsystem-29-0-src-components` [HIGH] via `imports`: imports x1 Evidence: src/components/ui/MatchMediaReport.jsx:imports
- `subsystem-58-0-src-components` -> `subsystem-53-0-src-app-jsx` [HIGH] via `imports`: imports x1 Evidence: src/components/ui/MatchMediaReport.jsx:imports
- `subsystem-58-0-src-components` -> `subsystem-69-0-src-components` [LOW] via `calls`: calls x1 Evidence: src/components/ui/MatchMediaReport.jsx:calls
- `subsystem-58-0-src-components` -> `subsystem-88-0-src-components` [LOW] via `calls`: calls x1 Evidence: src/components/ui/MatchMediaReport.jsx:calls
- `subsystem-59-0-temp-extraction` -> `subsystem-161-0-src-components` [LOW] via `calls`: calls x1 Evidence: temp_extraction/src/components/screens/PlayerProfileScreen.jsx:calls
- `subsystem-59-0-temp-extraction` -> `subsystem-2-0-src-components` [LOW] via `calls`: calls x1 Evidence: temp_extraction/src/components/screens/PlayerProfileScreen.jsx:calls
- `subsystem-59-0-temp-extraction` -> `subsystem-53-0-src-app-jsx` [HIGH] via `calls`: calls x1, imports x1 Evidence: temp_extraction/src/components/screens/PlayerProfileScreen.jsx:calls, temp_extraction/src/components/screens/PlayerProfileScreen.jsx:imports
- `subsystem-59-0-temp-extraction` -> `subsystem-56-0-src-components` [HIGH] via `calls`: calls x1, imports x1 Evidence: temp_extraction/src/components/screens/PlayerProfileScreen.jsx:calls, temp_extraction/src/components/screens/PlayerProfileScreen.jsx:imports
- `subsystem-59-0-temp-extraction` -> `subsystem-76-0-src-components` [LOW] via `calls`: calls x1 Evidence: temp_extraction/src/components/screens/PlayerProfileScreen.jsx:calls
- `subsystem-59-0-temp-extraction` -> `subsystem-87-0-temp-extraction` [MEDIUM] via `imports`: imports x1 Evidence: temp_extraction/src/components/screens/PlayerProfileScreen.jsx:imports
- `subsystem-59-0-temp-extraction` -> `subsystem-88-0-src-components` [LOW] via `calls`: calls x2 Evidence: temp_extraction/src/components/screens/PlayerProfileScreen.jsx:calls, temp_extraction/src/components/screens/PlayerProfileScreen.jsx:calls
- `subsystem-59-0-temp-extraction` -> `subsystem-98-0-temp-extraction` [MEDIUM] via `imports`: imports x1 Evidence: temp_extraction/src/components/screens/PlayerProfileScreen.jsx:imports
- `subsystem-6-0-src-components` -> `subsystem-1-0-src-context` [MEDIUM] via `imports`: imports x1 Evidence: src/components/selection/CampaignOverview.jsx:imports
- `subsystem-6-0-src-components` -> `subsystem-104-0-src-components` [LOW] via `calls`: calls x1 Evidence: src/components/selection/CampaignOverview.jsx:calls
- `subsystem-6-0-src-components` -> `subsystem-12-0-src-components` [MEDIUM] via `imports`: imports x1 Evidence: src/components/selection/PlayerDetail.jsx:imports
- `subsystem-6-0-src-components` -> `subsystem-150-0-src-components` [LOW] via `calls`: calls x2 Evidence: src/components/CricketIcons.jsx:calls, temp_extraction/src/components/CricketIcons.jsx:calls
- `subsystem-6-0-src-components` -> `subsystem-153-0-src-components` [LOW] via `calls`: calls x1 Evidence: src/components/selection/PlayerDetail.jsx:calls
- `subsystem-6-0-src-components` -> `subsystem-157-0-src-components` [LOW] via `calls`: calls x1 Evidence: src/components/selection/PerformanceGraphs.jsx:calls
- `subsystem-6-0-src-components` -> `subsystem-2-0-src-components` [LOW] via `calls`: calls x4 Evidence: src/components/selection/PerformanceGraphs.jsx:calls, src/components/selection/PerformanceGraphs.jsx:calls, src/components/selection/PlayerDetail.jsx:calls
- `subsystem-6-0-src-components` -> `subsystem-21-0-src-components` [LOW] via `calls`: calls x5 Evidence: src/components/selection/PerformanceGraphs.jsx:calls, src/components/selection/PerformanceGraphs.jsx:calls, src/components/selection/PerformanceGraphs.jsx:calls
- `subsystem-6-0-src-components` -> `subsystem-22-0-src-components` [LOW] via `calls`: calls x2 Evidence: src/components/selection/PerformanceGraphs.jsx:calls, src/components/selection/PerformanceGraphs.jsx:calls
- `subsystem-6-0-src-components` -> `subsystem-29-0-src-components` [HIGH] via `imports`: imports x1 Evidence: src/components/selection/PerformanceGraphs.jsx:imports
- `subsystem-6-0-src-components` -> `subsystem-36-0-src-components` [LOW] via `calls`: calls x1 Evidence: src/components/selection/PlayerDetail.jsx:calls
- `subsystem-6-0-src-components` -> `subsystem-53-0-src-app-jsx` [HIGH] via `imports`: imports x5, calls x1 Evidence: src/components/CricketIcons.jsx:imports, src/components/selection/CampaignOverview.jsx:calls, src/components/selection/CampaignOverview.jsx:imports
- `subsystem-6-0-src-components` -> `subsystem-88-0-src-components` [LOW] via `calls`: calls x7 Evidence: src/components/selection/PerformanceGraphs.jsx:calls, src/components/selection/PerformanceGraphs.jsx:calls, src/components/selection/PerformanceGraphs.jsx:calls
- `subsystem-60-0-temp-extraction` -> `subsystem-103-0-src-components` [LOW] via `calls`: calls x1 Evidence: temp_extraction/src/components/screens/TournamentsScreen.jsx:calls
- `subsystem-60-0-temp-extraction` -> `subsystem-119-0-temp-extraction` [MEDIUM] via `imports`: imports x1 Evidence: temp_extraction/src/components/screens/TournamentsScreen.jsx:imports
- `subsystem-60-0-temp-extraction` -> `subsystem-15-0-src-components` [LOW] via `calls`: calls x3 Evidence: temp_extraction/src/components/screens/TournamentsScreen.jsx:calls, temp_extraction/src/components/screens/TournamentsScreen.jsx:calls, temp_extraction/src/components/screens/TournamentsScreen.jsx:calls
- `subsystem-60-0-temp-extraction` -> `subsystem-173-0-src-components` [LOW] via `calls`: calls x1 Evidence: temp_extraction/src/components/screens/TournamentsScreen.jsx:calls
- `subsystem-60-0-temp-extraction` -> `subsystem-2-0-src-components` [LOW] via `calls`: calls x1 Evidence: temp_extraction/src/components/screens/TournamentsScreen.jsx:calls
- `subsystem-60-0-temp-extraction` -> `subsystem-24-0-src-components` [LOW] via `calls`: calls x1 Evidence: temp_extraction/src/components/screens/TournamentsScreen.jsx:calls
- `subsystem-60-0-temp-extraction` -> `subsystem-29-0-src-components` [HIGH] via `imports`: imports x1 Evidence: temp_extraction/src/components/screens/TournamentsScreen.jsx:imports
- `subsystem-60-0-temp-extraction` -> `subsystem-3-0-src-components` [LOW] via `calls`: calls x3 Evidence: temp_extraction/src/components/screens/TournamentsScreen.jsx:calls, temp_extraction/src/components/screens/TournamentsScreen.jsx:calls, temp_extraction/src/components/screens/TournamentsScreen.jsx:calls
- `subsystem-60-0-temp-extraction` -> `subsystem-42-0-temp-extraction` [LOW] via `calls`: calls x8 Evidence: temp_extraction/src/components/screens/TournamentsScreen.jsx:calls, temp_extraction/src/components/screens/TournamentsScreen.jsx:calls, temp_extraction/src/components/screens/TournamentsScreen.jsx:calls
- `subsystem-60-0-temp-extraction` -> `subsystem-53-0-src-app-jsx` [HIGH] via `calls`: calls x1, imports x1 Evidence: temp_extraction/src/components/screens/TournamentsScreen.jsx:calls, temp_extraction/src/components/screens/TournamentsScreen.jsx:imports
- `subsystem-60-0-temp-extraction` -> `subsystem-54-0-src-components` [HIGH] via `contains`: contains x1 Evidence: temp_extraction/src/components/screens/TournamentsScreen.jsx:contains
- `subsystem-60-0-temp-extraction` -> `subsystem-87-0-temp-extraction` [MEDIUM] via `imports`: imports x1 Evidence: temp_extraction/src/components/screens/TournamentsScreen.jsx:imports
- `subsystem-60-0-temp-extraction` -> `subsystem-88-0-src-components` [LOW] via `calls`: calls x8 Evidence: temp_extraction/src/components/screens/TournamentsScreen.jsx:calls, temp_extraction/src/components/screens/TournamentsScreen.jsx:calls, temp_extraction/src/components/screens/TournamentsScreen.jsx:calls
- `subsystem-60-0-temp-extraction` -> `subsystem-98-0-temp-extraction` [MEDIUM] via `imports`: imports x1 Evidence: temp_extraction/src/components/screens/TournamentsScreen.jsx:imports
- `subsystem-61-0-src-components` -> `subsystem-105-0-src-components` [LOW] via `calls`: calls x3 Evidence: src/components/screens/PlayerProfileScreen.jsx:calls, src/components/screens/PlayerProfileScreen.jsx:calls, src/components/screens/PlayerProfileScreen.jsx:calls
- `subsystem-61-0-src-components` -> `subsystem-121-0-src-components` [LOW] via `calls`: calls x7 Evidence: src/components/screens/MatchDetailScreen.jsx:calls, src/components/screens/MatchDetailScreen.jsx:calls, src/components/screens/MatchDetailScreen.jsx:calls
- `subsystem-61-0-src-components` -> `subsystem-7-0-src-components` [LOW] via `calls`: calls x9 Evidence: src/components/screens/MatchDetailScreen.jsx:calls, src/components/screens/MatchDetailScreen.jsx:calls, src/components/screens/MatchDetailScreen.jsx:calls
- `subsystem-62-0-src-components` -> `subsystem-0-0-src-lib` [MEDIUM] via `imports`: imports x1 Evidence: src/components/screens/MatchResultScreen.jsx:imports
- `subsystem-62-0-src-components` -> `subsystem-1-0-src-context` [MEDIUM] via `imports`: imports x1 Evidence: src/components/screens/MatchResultScreen.jsx:imports
- `subsystem-62-0-src-components` -> `subsystem-103-0-src-components` [LOW] via `calls`: calls x2 Evidence: src/components/screens/MatchResultScreen.jsx:calls, src/components/screens/MatchResultScreen.jsx:calls
- `subsystem-62-0-src-components` -> `subsystem-121-0-src-components` [LOW] via `calls`: calls x1 Evidence: src/components/screens/MatchResultScreen.jsx:calls
- `subsystem-62-0-src-components` -> `subsystem-128-0-src-engine` [MEDIUM] via `imports`: imports x1 Evidence: src/components/screens/MatchResultScreen.jsx:imports
- `subsystem-62-0-src-components` -> `subsystem-2-0-src-components` [MEDIUM] via `imports`: imports x1 Evidence: src/components/screens/MatchResultScreen.jsx:imports
- `subsystem-62-0-src-components` -> `subsystem-29-0-src-components` [HIGH] via `calls`: calls x2, imports x1 Evidence: src/components/screens/MatchResultScreen.jsx:calls, src/components/screens/MatchResultScreen.jsx:calls, src/components/screens/MatchResultScreen.jsx:imports
- `subsystem-62-0-src-components` -> `subsystem-3-0-src-components` [LOW] via `calls`: calls x1 Evidence: src/components/screens/MatchResultScreen.jsx:calls
- `subsystem-62-0-src-components` -> `subsystem-53-0-src-app-jsx` [HIGH] via `calls`: calls x1, imports x1 Evidence: src/components/screens/MatchResultScreen.jsx:calls, src/components/screens/MatchResultScreen.jsx:imports
- `subsystem-62-0-src-components` -> `subsystem-58-0-src-components` [MEDIUM] via `imports`: imports x1 Evidence: src/components/screens/MatchResultScreen.jsx:imports
- `subsystem-62-0-src-components` -> `subsystem-69-0-src-components` [LOW] via `calls`: calls x2 Evidence: src/components/screens/MatchResultScreen.jsx:calls, src/components/screens/MatchResultScreen.jsx:calls
- `subsystem-62-0-src-components` -> `subsystem-80-0-src-components` [HIGH] via `calls`: calls x3, contains x1 Evidence: src/components/screens/MatchResultScreen.jsx:calls, src/components/screens/MatchResultScreen.jsx:calls, src/components/screens/MatchResultScreen.jsx:calls
- `subsystem-62-0-src-components` -> `subsystem-88-0-src-components` [LOW] via `calls`: calls x6 Evidence: src/components/screens/MatchResultScreen.jsx:calls, src/components/screens/MatchResultScreen.jsx:calls, src/components/screens/MatchResultScreen.jsx:calls
- `subsystem-63-0-src-components` -> `subsystem-121-0-src-components` [LOW] via `calls`: calls x4 Evidence: src/components/ui/TeamManagerModal.jsx:calls, src/components/ui/TournamentManagerModal.jsx:calls, src/components/ui/TeamManagerModal.jsx:calls
- `subsystem-63-0-src-components` -> `subsystem-123-0-src-components` [LOW] via `calls`: calls x1 Evidence: src/components/ui/TeamManagerModal.jsx:calls
- `subsystem-63-0-src-components` -> `subsystem-29-0-src-components` [HIGH] via `imports`: imports x1 Evidence: src/components/ui/TeamManagerModal.jsx:imports
- `subsystem-63-0-src-components` -> `subsystem-34-0-src-components` [LOW] via `calls`: calls x5 Evidence: src/components/ui/TeamManagerModal.jsx:calls, src/components/ui/TeamManagerModal.jsx:calls, src/components/ui/TournamentManagerModal.jsx:calls
- `subsystem-63-0-src-components` -> `subsystem-53-0-src-app-jsx` [HIGH] via `imports`: imports x1 Evidence: src/components/ui/TeamManagerModal.jsx:imports
- `subsystem-63-0-src-components` -> `subsystem-65-0-src-components` [HIGH] via `contains`: contains x1 Evidence: src/components/ui/TeamManagerModal.jsx:contains
- `subsystem-63-0-src-components` -> `subsystem-88-0-src-components` [LOW] via `calls`: calls x2 Evidence: src/components/ui/TeamManagerModal.jsx:calls, src/components/ui/TeamManagerModal.jsx:calls
- `subsystem-64-0-temp-extraction` -> `subsystem-145-0-temp-extraction` [MEDIUM] via `imports`: imports x1 Evidence: temp_extraction/src/components/screens/AdministrationScreen.jsx:imports
- `subsystem-64-0-temp-extraction` -> `subsystem-53-0-src-app-jsx` [HIGH] via `calls`: calls x1, imports x1 Evidence: temp_extraction/src/components/screens/AdministrationScreen.jsx:calls, temp_extraction/src/components/screens/AdministrationScreen.jsx:imports
- `subsystem-64-0-temp-extraction` -> `subsystem-65-0-src-components` [LOW] via `calls`: calls x1 Evidence: temp_extraction/src/components/screens/AdministrationScreen.jsx:calls
- `subsystem-64-0-temp-extraction` -> `subsystem-7-0-src-components` [HIGH] via `calls`: calls x9, contains x1 Evidence: temp_extraction/src/components/screens/AdministrationScreen.jsx:calls, temp_extraction/src/components/screens/AdministrationScreen.jsx:calls, temp_extraction/src/components/screens/AdministrationScreen.jsx:calls
- `subsystem-64-0-temp-extraction` -> `subsystem-87-0-temp-extraction` [MEDIUM] via `imports`: imports x1 Evidence: temp_extraction/src/components/screens/AdministrationScreen.jsx:imports
- `subsystem-64-0-temp-extraction` -> `subsystem-88-0-src-components` [LOW] via `calls`: calls x3 Evidence: temp_extraction/src/components/screens/AdministrationScreen.jsx:calls, temp_extraction/src/components/screens/AdministrationScreen.jsx:calls, temp_extraction/src/components/screens/AdministrationScreen.jsx:calls
- `subsystem-64-0-temp-extraction` -> `subsystem-90-0-src-components` [LOW] via `calls`: calls x1 Evidence: temp_extraction/src/components/screens/AdministrationScreen.jsx:calls
- `subsystem-64-0-temp-extraction` -> `subsystem-98-0-temp-extraction` [MEDIUM] via `imports`: imports x1 Evidence: temp_extraction/src/components/screens/AdministrationScreen.jsx:imports
- `subsystem-65-0-src-components` -> `subsystem-102-0-src-components` [LOW] via `calls`: calls x2 Evidence: src/components/screens/PlayerRegistrationScreen.jsx:calls, temp_extraction/src/components/screens/PlayerRegistrationScreen.jsx:calls
- `subsystem-65-0-src-components` -> `subsystem-108-0-src-components` [LOW] via `calls`: calls x3 Evidence: src/components/selection/CreateTeamModal.jsx:calls, src/components/selection/CreateTeamModal.jsx:calls, src/components/selection/CreateTeamModal.jsx:calls
- `subsystem-65-0-src-components` -> `subsystem-121-0-src-components` [LOW] via `calls`: calls x4 Evidence: src/components/screens/PlayerRegistrationScreen.jsx:calls, src/components/ui/TournamentManagerModal.jsx:calls, src/components/screens/PlayerRegistrationScreen.jsx:calls
- `subsystem-65-0-src-components` -> `subsystem-123-0-src-components` [LOW] via `calls`: calls x2 Evidence: src/components/ui/TournamentManagerModal.jsx:calls, src/components/ui/TournamentManagerModal.jsx:calls
- `subsystem-65-0-src-components` -> `subsystem-170-0-src-components` [LOW] via `calls`: calls x3 Evidence: src/components/selection/CreateTeamModal.jsx:calls, src/components/ui/TeamManagerModal.jsx:calls, src/components/ui/TournamentManagerModal.jsx:calls
- `subsystem-65-0-src-components` -> `subsystem-174-0-src-components` [LOW] via `calls`: calls x1 Evidence: src/components/selection/CreateTeamModal.jsx:calls
- `subsystem-65-0-src-components` -> `subsystem-2-0-src-components` [LOW] via `calls`: calls x1 Evidence: temp_extraction/src/components/screens/PlayerRegistrationScreen.jsx:calls
- `subsystem-65-0-src-components` -> `subsystem-45-0-src-components` [LOW] via `calls`: calls x1 Evidence: src/components/ui/TournamentManagerModal.jsx:calls
- `subsystem-65-0-src-components` -> `subsystem-61-0-src-components` [LOW] via `calls`: calls x2 Evidence: src/components/screens/PlayerRegistrationScreen.jsx:calls, temp_extraction/src/components/screens/PlayerRegistrationScreen.jsx:calls
- `subsystem-65-0-src-components` -> `subsystem-63-0-src-components` [LOW] via `calls`: calls x2 Evidence: src/components/ui/TeamManagerModal.jsx:calls, src/components/ui/TournamentManagerModal.jsx:calls
- `subsystem-65-0-src-components` -> `subsystem-7-0-src-components` [LOW] via `calls`: calls x5 Evidence: src/components/screens/PlayerRegistrationScreen.jsx:calls, src/components/selection/CreateTeamModal.jsx:calls, src/components/ui/TeamManagerModal.jsx:calls
- `subsystem-65-0-src-components` -> `subsystem-73-0-src-components` [LOW] via `calls`: calls x2 Evidence: src/components/ui/TournamentManagerModal.jsx:calls, src/components/ui/TournamentManagerModal.jsx:calls
- `subsystem-65-0-src-components` -> `subsystem-81-0-src-components` [LOW] via `calls`: calls x3 Evidence: src/components/ui/TournamentManagerModal.jsx:calls, src/components/ui/TournamentManagerModal.jsx:calls, src/components/ui/TournamentManagerModal.jsx:calls
- `subsystem-66-0-src-components` -> `subsystem-121-0-src-components` [LOW] via `calls`: calls x2 Evidence: src/components/screens/ScoringScreen.jsx:calls, src/components/screens/ScoringScreen.jsx:calls
- `subsystem-66-0-src-components` -> `subsystem-2-0-src-components` [LOW] via `calls`: calls x1 Evidence: src/components/screens/ScoringScreen.jsx:calls
- `subsystem-67-0-src-lib` -> `subsystem-16-0-src-components` [LOW] via `calls`: calls x4 Evidence: src/lib/api.js:calls, src/lib/api.js:calls, src/lib/api.js:calls
- `subsystem-67-0-src-lib` -> `subsystem-176-0-src-components` [LOW] via `calls`: calls x2 Evidence: src/lib/api.js:calls, src/lib/api.js:calls
- `subsystem-67-0-src-lib` -> `subsystem-37-0-src-engine` [LOW] via `calls`: calls x2 Evidence: src/lib/api.js:calls, src/lib/api.js:calls
- `subsystem-69-0-src-components` -> `subsystem-1-0-src-context` [MEDIUM] via `imports`: imports x1 Evidence: src/components/screens/MatchDetailScreen.jsx:imports
- `subsystem-69-0-src-components` -> `subsystem-103-0-src-components` [LOW] via `calls`: calls x1 Evidence: src/components/screens/MatchDetailScreen.jsx:calls
- `subsystem-69-0-src-components` -> `subsystem-128-0-src-engine` [MEDIUM] via `imports`: imports x1 Evidence: src/components/screens/MatchDetailScreen.jsx:imports
- `subsystem-69-0-src-components` -> `subsystem-2-0-src-components` [MEDIUM] via `calls`: calls x2, imports x1 Evidence: src/components/screens/MatchDetailScreen.jsx:calls, src/components/screens/MatchDetailScreen.jsx:calls, src/components/screens/MatchDetailScreen.jsx:imports
- `subsystem-69-0-src-components` -> `subsystem-29-0-src-components` [HIGH] via `calls`: calls x3, imports x1 Evidence: src/components/screens/MatchDetailScreen.jsx:calls, src/components/screens/MatchDetailScreen.jsx:calls, src/components/screens/MatchDetailScreen.jsx:calls
- `subsystem-69-0-src-components` -> `subsystem-53-0-src-app-jsx` [HIGH] via `calls`: calls x1, imports x1 Evidence: src/components/screens/MatchDetailScreen.jsx:calls, src/components/screens/MatchDetailScreen.jsx:imports
- `subsystem-69-0-src-components` -> `subsystem-58-0-src-components` [MEDIUM] via `imports`: imports x1 Evidence: src/components/screens/MatchDetailScreen.jsx:imports
- `subsystem-69-0-src-components` -> `subsystem-6-0-src-components` [LOW] via `calls`: calls x1 Evidence: src/components/screens/MatchDetailScreen.jsx:calls
- `subsystem-69-0-src-components` -> `subsystem-61-0-src-components` [HIGH] via `contains`: contains x2 Evidence: src/components/screens/MatchDetailScreen.jsx:contains, src/components/screens/MatchDetailScreen.jsx:contains
- `subsystem-69-0-src-components` -> `subsystem-75-0-src-components` [LOW] via `calls`: calls x1 Evidence: src/components/screens/MatchDetailScreen.jsx:calls
- `subsystem-69-0-src-components` -> `subsystem-88-0-src-components` [LOW] via `calls`: calls x7 Evidence: src/components/screens/MatchDetailScreen.jsx:calls, src/components/screens/MatchDetailScreen.jsx:calls, src/components/screens/MatchDetailScreen.jsx:calls
- `subsystem-7-0-src-components` -> `subsystem-0-0-src-lib` [MEDIUM] via `imports`: imports x1 Evidence: src/components/screens/AdministrationScreen.jsx:imports
- `subsystem-7-0-src-components` -> `subsystem-1-0-src-context` [MEDIUM] via `imports`: imports x1 Evidence: src/components/screens/AdministrationScreen.jsx:imports
- `subsystem-7-0-src-components` -> `subsystem-102-0-src-components` [LOW] via `calls`: calls x1 Evidence: src/components/screens/AdministrationScreen.jsx:calls
- `subsystem-7-0-src-components` -> `subsystem-121-0-src-components` [LOW] via `calls`: calls x12 Evidence: src/components/screens/AdministrationScreen.jsx:calls, src/components/screens/AdministrationScreen.jsx:calls, src/components/screens/AdministrationScreen.jsx:calls
- `subsystem-7-0-src-components` -> `subsystem-126-0-src-components` [MEDIUM] via `imports`: imports x1 Evidence: src/components/screens/AdministrationScreen.jsx:imports
- `subsystem-7-0-src-components` -> `subsystem-154-0-src-components` [LOW] via `calls`: calls x1 Evidence: src/components/screens/AdministrationScreen.jsx:calls
- `subsystem-7-0-src-components` -> `subsystem-174-0-src-components` [LOW] via `calls`: calls x1 Evidence: temp_extraction/src/components/screens/AdministrationScreen.jsx:calls
- `subsystem-7-0-src-components` -> `subsystem-175-0-src-components` [LOW] via `calls`: calls x1 Evidence: src/components/selection/SelectedTeam.jsx:calls
- `subsystem-7-0-src-components` -> `subsystem-24-0-src-components` [MEDIUM] via `imports`: imports x1 Evidence: src/components/screens/AdministrationScreen.jsx:imports
- `subsystem-7-0-src-components` -> `subsystem-31-0-src-components` [MEDIUM] via `imports`: imports x1 Evidence: src/components/screens/AdministrationScreen.jsx:imports
- `subsystem-7-0-src-components` -> `subsystem-34-0-src-components` [MEDIUM] via `imports`: imports x1 Evidence: src/components/screens/AdministrationScreen.jsx:imports
- `subsystem-7-0-src-components` -> `subsystem-40-0-src-components` [MEDIUM] via `imports`: imports x1 Evidence: src/components/screens/AdministrationScreen.jsx:imports
- `subsystem-7-0-src-components` -> `subsystem-53-0-src-app-jsx` [HIGH] via `calls`: calls x1, imports x1 Evidence: src/components/screens/AdministrationScreen.jsx:calls, src/components/screens/AdministrationScreen.jsx:imports
- `subsystem-7-0-src-components` -> `subsystem-64-0-temp-extraction` [LOW] via `calls`: calls x1 Evidence: temp_extraction/src/components/screens/AdministrationScreen.jsx:calls
- `subsystem-7-0-src-components` -> `subsystem-75-0-src-components` [MEDIUM] via `imports`: imports x1 Evidence: src/components/screens/AdministrationScreen.jsx:imports
- `subsystem-7-0-src-components` -> `subsystem-8-0-src-components` [MEDIUM] via `imports`: imports x1 Evidence: src/components/screens/AdministrationScreen.jsx:imports
- `subsystem-7-0-src-components` -> `subsystem-86-0-src-components` [MEDIUM] via `imports`: imports x1 Evidence: src/components/screens/AdministrationScreen.jsx:imports
- `subsystem-7-0-src-components` -> `subsystem-88-0-src-components` [LOW] via `calls`: calls x15 Evidence: src/components/screens/AdministrationScreen.jsx:calls, src/components/screens/AdministrationScreen.jsx:calls, src/components/screens/AdministrationScreen.jsx:calls
- `subsystem-70-0-src-components` -> `subsystem-1-0-src-context` [MEDIUM] via `imports`: imports x1 Evidence: src/components/screens/ScorecardScreen.jsx:imports
- `subsystem-70-0-src-components` -> `subsystem-126-0-src-components` [MEDIUM] via `imports`: imports x1 Evidence: src/components/screens/ScorecardScreen.jsx:imports
- `subsystem-70-0-src-components` -> `subsystem-151-0-src-components` [LOW] via `calls`: calls x1 Evidence: src/components/screens/ScorecardScreen.jsx:calls
- `subsystem-70-0-src-components` -> `subsystem-29-0-src-components` [HIGH] via `imports`: imports x1 Evidence: src/components/screens/ScorecardScreen.jsx:imports
- `subsystem-70-0-src-components` -> `subsystem-53-0-src-app-jsx` [HIGH] via `calls`: calls x1, imports x1 Evidence: src/components/screens/ScorecardScreen.jsx:calls, src/components/screens/ScorecardScreen.jsx:imports
- `subsystem-70-0-src-components` -> `subsystem-62-0-src-components` [LOW] via `calls`: calls x1 Evidence: src/components/screens/ScorecardScreen.jsx:calls
- `subsystem-70-0-src-components` -> `subsystem-7-0-src-components` [LOW] via `calls`: calls x1 Evidence: src/components/screens/ScorecardScreen.jsx:calls
- `subsystem-70-0-src-components` -> `subsystem-86-0-src-components` [MEDIUM] via `imports`: imports x1 Evidence: src/components/screens/ScorecardScreen.jsx:imports
- `subsystem-70-0-src-components` -> `subsystem-88-0-src-components` [LOW] via `calls`: calls x1 Evidence: src/components/screens/ScorecardScreen.jsx:calls
- `subsystem-71-0-src-components` -> `subsystem-104-0-src-components` [LOW] via `calls`: calls x3 Evidence: src/components/selection/SelectionFilters.jsx:calls, src/components/selection/SelectionFilters.jsx:calls, src/components/selection/SelectionFilters.jsx:calls
- `subsystem-71-0-src-components` -> `subsystem-122-0-src-components` [LOW] via `calls`: calls x2 Evidence: src/components/selection/SelectionFilters.jsx:calls, src/components/selection/SelectionFilters.jsx:calls
- `subsystem-71-0-src-components` -> `subsystem-16-0-src-components` [MEDIUM] via `imports`: imports x1 Evidence: src/components/selection/SelectionFilters.jsx:imports
- `subsystem-71-0-src-components` -> `subsystem-166-0-src-components` [LOW] via `calls`: calls x1 Evidence: src/components/selection/SelectionFilters.jsx:calls
- `subsystem-71-0-src-components` -> `subsystem-29-0-src-components` [HIGH] via `imports`: imports x1 Evidence: src/components/selection/SelectionFilters.jsx:imports
- `subsystem-71-0-src-components` -> `subsystem-52-0-src-hooks` [MEDIUM] via `imports`: imports x1 Evidence: src/components/selection/SelectionFilters.jsx:imports
- `subsystem-71-0-src-components` -> `subsystem-53-0-src-app-jsx` [HIGH] via `imports`: imports x2 Evidence: src/components/selection/SelectionFilters.jsx:imports, src/components/selection/SelectionFilters.jsx:imports
- `subsystem-72-0-temp-extraction` -> `subsystem-145-0-temp-extraction` [MEDIUM] via `imports`: imports x1 Evidence: temp_extraction/src/components/screens/HomeScreen.jsx:imports
- `subsystem-72-0-temp-extraction` -> `subsystem-2-0-src-components` [LOW] via `calls`: calls x2 Evidence: temp_extraction/src/components/screens/HomeScreen.jsx:calls, temp_extraction/src/components/screens/HomeScreen.jsx:calls
- `subsystem-72-0-temp-extraction` -> `subsystem-22-0-src-components` [LOW] via `calls`: calls x6 Evidence: temp_extraction/src/components/screens/HomeScreen.jsx:calls, temp_extraction/src/components/screens/HomeScreen.jsx:calls, temp_extraction/src/components/screens/HomeScreen.jsx:calls
- `subsystem-72-0-temp-extraction` -> `subsystem-29-0-src-components` [LOW] via `calls`: calls x7 Evidence: temp_extraction/src/components/screens/HomeScreen.jsx:calls, temp_extraction/src/components/screens/HomeScreen.jsx:calls, temp_extraction/src/components/screens/HomeScreen.jsx:calls
- `subsystem-72-0-temp-extraction` -> `subsystem-3-0-src-components` [LOW] via `calls`: calls x1 Evidence: temp_extraction/src/components/screens/HomeScreen.jsx:calls
- `subsystem-72-0-temp-extraction` -> `subsystem-39-0-src-components` [LOW] via `calls`: calls x3 Evidence: temp_extraction/src/components/screens/HomeScreen.jsx:calls, temp_extraction/src/components/screens/HomeScreen.jsx:calls, temp_extraction/src/components/screens/HomeScreen.jsx:calls
- `subsystem-72-0-temp-extraction` -> `subsystem-53-0-src-app-jsx` [HIGH] via `calls`: calls x1, imports x1 Evidence: temp_extraction/src/components/screens/HomeScreen.jsx:calls, temp_extraction/src/components/screens/HomeScreen.jsx:imports
- `subsystem-72-0-temp-extraction` -> `subsystem-54-0-src-components` [LOW] via `calls`: calls x1 Evidence: temp_extraction/src/components/screens/HomeScreen.jsx:calls
- `subsystem-72-0-temp-extraction` -> `subsystem-6-0-src-components` [LOW] via `calls`: calls x2 Evidence: temp_extraction/src/components/screens/HomeScreen.jsx:calls, temp_extraction/src/components/screens/HomeScreen.jsx:calls
- `subsystem-72-0-temp-extraction` -> `subsystem-87-0-temp-extraction` [MEDIUM] via `imports`: imports x1 Evidence: temp_extraction/src/components/screens/HomeScreen.jsx:imports
- `subsystem-72-0-temp-extraction` -> `subsystem-9-0-src-components` [LOW] via `calls`: calls x2 Evidence: temp_extraction/src/components/screens/HomeScreen.jsx:calls, temp_extraction/src/components/screens/HomeScreen.jsx:calls
- `subsystem-72-0-temp-extraction` -> `subsystem-98-0-temp-extraction` [MEDIUM] via `imports`: imports x1 Evidence: temp_extraction/src/components/screens/HomeScreen.jsx:imports
- `subsystem-73-0-src-components` -> `subsystem-121-0-src-components` [LOW] via `calls`: calls x1 Evidence: src/components/screens/AuthScreen.jsx:calls
- `subsystem-73-0-src-components` -> `subsystem-122-0-src-components` [LOW] via `calls`: calls x1 Evidence: src/components/screens/AuthScreen.jsx:calls
- `subsystem-73-0-src-components` -> `subsystem-125-0-temp-extraction` [MEDIUM] via `calls`: calls x1 Evidence: temp_extraction/src/components/screens/AuthScreen.jsx:calls
- `subsystem-73-0-src-components` -> `subsystem-7-0-src-components` [LOW] via `calls`: calls x2 Evidence: src/components/screens/AuthScreen.jsx:calls, temp_extraction/src/components/screens/AuthScreen.jsx:calls
- `subsystem-74-0-src-components` -> `subsystem-1-0-src-context` [MEDIUM] via `imports`: imports x1 Evidence: src/components/screens/AuthScreen.jsx:imports
- `subsystem-74-0-src-components` -> `subsystem-111-0-src-components` [LOW] via `calls`: calls x1 Evidence: src/components/screens/AuthScreen.jsx:calls
- `subsystem-74-0-src-components` -> `subsystem-122-0-src-components` [LOW] via `calls`: calls x1 Evidence: src/components/screens/AuthScreen.jsx:calls
- `subsystem-74-0-src-components` -> `subsystem-130-0-src-lib` [MEDIUM] via `imports`: imports x1 Evidence: src/components/screens/AuthScreen.jsx:imports
- `subsystem-74-0-src-components` -> `subsystem-29-0-src-components` [HIGH] via `imports`: imports x1 Evidence: src/components/screens/AuthScreen.jsx:imports
- `subsystem-74-0-src-components` -> `subsystem-52-0-src-hooks` [MEDIUM] via `imports`: imports x1 Evidence: src/components/screens/AuthScreen.jsx:imports
- `subsystem-74-0-src-components` -> `subsystem-53-0-src-app-jsx` [HIGH] via `imports`: imports x2, calls x1 Evidence: src/components/screens/AuthScreen.jsx:calls, src/components/screens/AuthScreen.jsx:imports, src/components/screens/AuthScreen.jsx:imports
- `subsystem-74-0-src-components` -> `subsystem-73-0-src-components` [HIGH] via `contains`: contains x1 Evidence: src/components/screens/AuthScreen.jsx:contains
- `subsystem-74-0-src-components` -> `subsystem-83-0-src-components` [MEDIUM] via `imports`: imports x1 Evidence: src/components/screens/AuthScreen.jsx:imports
- `subsystem-74-0-src-components` -> `subsystem-88-0-src-components` [LOW] via `calls`: calls x4 Evidence: src/components/screens/AuthScreen.jsx:calls, src/components/screens/AuthScreen.jsx:calls, src/components/screens/AuthScreen.jsx:calls
- `subsystem-75-0-src-components` -> `subsystem-1-0-src-context` [MEDIUM] via `imports`: imports x1 Evidence: src/components/screens/JdcaManagementTab.jsx:imports
- `subsystem-75-0-src-components` -> `subsystem-29-0-src-components` [HIGH] via `imports`: imports x1 Evidence: src/components/screens/JdcaManagementTab.jsx:imports
- `subsystem-75-0-src-components` -> `subsystem-53-0-src-app-jsx` [HIGH] via `calls`: calls x1, imports x1 Evidence: src/components/screens/JdcaManagementTab.jsx:calls, src/components/screens/JdcaManagementTab.jsx:imports
- `subsystem-75-0-src-components` -> `subsystem-6-0-src-components` [LOW] via `calls`: calls x2 Evidence: src/components/screens/JdcaManagementTab.jsx:calls, src/components/screens/JdcaManagementTab.jsx:calls
- `subsystem-76-0-src-components` -> `subsystem-1-0-src-context` [MEDIUM] via `imports`: imports x1 Evidence: src/components/screens/PlayerComparisonModal.jsx:imports
- `subsystem-76-0-src-components` -> `subsystem-103-0-src-components` [LOW] via `calls`: calls x1 Evidence: src/components/screens/PlayerComparisonModal.jsx:calls
- `subsystem-76-0-src-components` -> `subsystem-104-0-src-components` [LOW] via `calls`: calls x1 Evidence: src/components/screens/PlayerComparisonModal.jsx:calls
- `subsystem-76-0-src-components` -> `subsystem-2-0-src-components` [LOW] via `calls`: calls x1 Evidence: src/components/screens/PlayerComparisonModal.jsx:calls
- `subsystem-76-0-src-components` -> `subsystem-29-0-src-components` [HIGH] via `imports`: imports x1 Evidence: src/components/screens/PlayerComparisonModal.jsx:imports
- `subsystem-76-0-src-components` -> `subsystem-53-0-src-app-jsx` [HIGH] via `imports`: imports x2, calls x1 Evidence: src/components/screens/PlayerComparisonModal.jsx:calls, src/components/screens/PlayerComparisonModal.jsx:imports, src/components/screens/PlayerComparisonModal.jsx:imports
- `subsystem-77-0-src-components` -> `subsystem-1-0-src-context` [MEDIUM] via `imports`: imports x1 Evidence: src/components/screens/SelectorsScreen.jsx:imports
- `subsystem-77-0-src-components` -> `subsystem-104-0-src-components` [LOW] via `calls`: calls x4 Evidence: src/components/screens/SelectorsScreen.jsx:calls, src/components/screens/SelectorsScreen.jsx:calls, src/components/screens/SelectorsScreen.jsx:calls
- `subsystem-77-0-src-components` -> `subsystem-150-0-src-components` [LOW] via `calls`: calls x4 Evidence: src/components/screens/SelectorsScreen.jsx:calls, src/components/screens/SelectorsScreen.jsx:calls, src/components/screens/SelectorsScreen.jsx:calls
- `subsystem-77-0-src-components` -> `subsystem-153-0-src-components` [LOW] via `calls`: calls x1 Evidence: src/components/screens/SelectorsScreen.jsx:calls
- `subsystem-77-0-src-components` -> `subsystem-161-0-src-components` [LOW] via `calls`: calls x1 Evidence: src/components/screens/SelectorsScreen.jsx:calls
- `subsystem-77-0-src-components` -> `subsystem-167-0-src-components` [LOW] via `calls`: calls x1 Evidence: src/components/screens/SelectorsScreen.jsx:calls
- `subsystem-77-0-src-components` -> `subsystem-2-0-src-components` [LOW] via `calls`: calls x1 Evidence: src/components/screens/SelectorsScreen.jsx:calls
- `subsystem-77-0-src-components` -> `subsystem-32-0-src-components` [HIGH] via `calls`: calls x6, contains x1 Evidence: src/components/screens/SelectorsScreen.jsx:calls, src/components/screens/SelectorsScreen.jsx:calls, src/components/screens/SelectorsScreen.jsx:calls
- `subsystem-77-0-src-components` -> `subsystem-33-0-src-components` [LOW] via `calls`: calls x5 Evidence: src/components/screens/SelectorsScreen.jsx:calls, src/components/screens/SelectorsScreen.jsx:calls, src/components/screens/SelectorsScreen.jsx:calls
- `subsystem-77-0-src-components` -> `subsystem-53-0-src-app-jsx` [HIGH] via `calls`: calls x1, imports x1 Evidence: src/components/screens/SelectorsScreen.jsx:calls, src/components/screens/SelectorsScreen.jsx:imports
- `subsystem-77-0-src-components` -> `subsystem-88-0-src-components` [LOW] via `calls`: calls x5 Evidence: src/components/screens/SelectorsScreen.jsx:calls, src/components/screens/SelectorsScreen.jsx:calls, src/components/screens/SelectorsScreen.jsx:calls
- `subsystem-78-0-src-components` -> `subsystem-1-0-src-context` [MEDIUM] via `imports`: imports x1 Evidence: src/components/Sidebar.jsx:imports
- `subsystem-78-0-src-components` -> `subsystem-29-0-src-components` [LOW] via `calls`: calls x1 Evidence: src/components/Sidebar.jsx:calls
- `subsystem-78-0-src-components` -> `subsystem-47-0-src-components` [HIGH] via `calls`: calls x5, contains x1 Evidence: src/components/Sidebar.jsx:calls, src/components/Sidebar.jsx:calls, src/components/Sidebar.jsx:calls
- `subsystem-78-0-src-components` -> `subsystem-53-0-src-app-jsx` [HIGH] via `imports`: imports x2, calls x1 Evidence: src/components/Sidebar.jsx:calls, src/components/Sidebar.jsx:imports, src/components/Sidebar.jsx:imports
- `subsystem-78-0-src-components` -> `subsystem-6-0-src-components` [LOW] via `calls`: calls x1 Evidence: src/components/Sidebar.jsx:calls
- `subsystem-78-0-src-components` -> `subsystem-86-0-src-components` [MEDIUM] via `imports`: imports x1 Evidence: src/components/Sidebar.jsx:imports
- `subsystem-78-0-src-components` -> `subsystem-88-0-src-components` [LOW] via `calls`: calls x4 Evidence: src/components/Sidebar.jsx:calls, src/components/Sidebar.jsx:calls, src/components/Sidebar.jsx:calls
- `subsystem-79-0-src-components` -> `subsystem-12-0-src-components` [MEDIUM] via `imports`: imports x1 Evidence: src/components/ui/MatchCard.jsx:imports
- `subsystem-79-0-src-components` -> `subsystem-122-0-src-components` [LOW] via `calls`: calls x2 Evidence: src/components/ui/MatchCard.jsx:calls, src/components/ui/MatchCard.jsx:calls
- `subsystem-79-0-src-components` -> `subsystem-29-0-src-components` [HIGH] via `imports`: imports x1 Evidence: src/components/ui/MatchCard.jsx:imports
- `subsystem-79-0-src-components` -> `subsystem-39-0-src-components` [LOW] via `calls`: calls x1 Evidence: src/components/ui/MatchCard.jsx:calls
- `subsystem-79-0-src-components` -> `subsystem-40-0-src-components` [LOW] via `calls`: calls x1 Evidence: src/components/ui/MatchCard.jsx:calls
- `subsystem-79-0-src-components` -> `subsystem-52-0-src-hooks` [MEDIUM] via `imports`: imports x1 Evidence: src/components/ui/MatchCard.jsx:imports
- `subsystem-79-0-src-components` -> `subsystem-53-0-src-app-jsx` [HIGH] via `imports`: imports x2 Evidence: src/components/ui/MatchCard.jsx:imports, src/components/ui/MatchCard.jsx:imports
- `subsystem-79-0-src-components` -> `subsystem-6-0-src-components` [LOW] via `calls`: calls x2 Evidence: src/components/ui/MatchCard.jsx:calls, src/components/ui/MatchCard.jsx:calls
- `subsystem-8-0-src-components` -> `subsystem-0-0-src-lib` [MEDIUM] via `imports`: imports x1 Evidence: src/components/screens/SeasonMigrationTab.jsx:imports
- `subsystem-8-0-src-components` -> `subsystem-1-0-src-context` [MEDIUM] via `imports`: imports x1 Evidence: src/components/screens/SeasonMigrationTab.jsx:imports
- `subsystem-8-0-src-components` -> `subsystem-104-0-src-components` [LOW] via `calls`: calls x1 Evidence: src/components/screens/SeasonMigrationTab.jsx:calls
- `subsystem-8-0-src-components` -> `subsystem-105-0-src-components` [LOW] via `calls`: calls x3 Evidence: src/components/screens/SeasonMigrationTab.jsx:calls, src/components/screens/SeasonMigrationTab.jsx:calls, src/components/screens/SeasonMigrationTab.jsx:calls
- `subsystem-8-0-src-components` -> `subsystem-106-0-src-components` [HIGH] via `calls`: calls x7, contains x1 Evidence: src/components/screens/SeasonMigrationTab.jsx:calls, src/components/screens/SeasonMigrationTab.jsx:calls, src/components/screens/SeasonMigrationTab.jsx:contains
- `subsystem-8-0-src-components` -> `subsystem-107-0-src-components` [HIGH] via `calls`: calls x1, contains x1 Evidence: src/components/screens/SeasonMigrationTab.jsx:calls, src/components/screens/SeasonMigrationTab.jsx:contains
- `subsystem-8-0-src-components` -> `subsystem-121-0-src-components` [LOW] via `calls`: calls x6 Evidence: src/components/screens/SeasonMigrationTab.jsx:calls, src/components/screens/SeasonMigrationTab.jsx:calls, src/components/screens/SeasonMigrationTab.jsx:calls
- `subsystem-8-0-src-components` -> `subsystem-159-0-src-components` [LOW] via `calls`: calls x1 Evidence: src/components/screens/SeasonMigrationTab.jsx:calls
- `subsystem-8-0-src-components` -> `subsystem-2-0-src-components` [LOW] via `calls`: calls x1 Evidence: src/components/screens/SeasonMigrationTab.jsx:calls
- `subsystem-8-0-src-components` -> `subsystem-29-0-src-components` [HIGH] via `calls`: calls x1, imports x1 Evidence: src/components/screens/SeasonMigrationTab.jsx:calls, src/components/screens/SeasonMigrationTab.jsx:imports
- `subsystem-8-0-src-components` -> `subsystem-39-0-src-components` [LOW] via `calls`: calls x4 Evidence: src/components/screens/SeasonMigrationTab.jsx:calls, src/components/screens/SeasonMigrationTab.jsx:calls, src/components/screens/SeasonMigrationTab.jsx:calls
- `subsystem-8-0-src-components` -> `subsystem-53-0-src-app-jsx` [HIGH] via `calls`: calls x1, imports x1 Evidence: src/components/screens/SeasonMigrationTab.jsx:calls, src/components/screens/SeasonMigrationTab.jsx:imports
- `subsystem-8-0-src-components` -> `subsystem-56-0-src-components` [LOW] via `calls`: calls x1 Evidence: src/components/screens/SeasonMigrationTab.jsx:calls
- `subsystem-8-0-src-components` -> `subsystem-7-0-src-components` [LOW] via `calls`: calls x10 Evidence: src/components/screens/SeasonMigrationTab.jsx:calls, src/components/screens/SeasonMigrationTab.jsx:calls, src/components/screens/SeasonMigrationTab.jsx:calls
- `subsystem-8-0-src-components` -> `subsystem-73-0-src-components` [LOW] via `calls`: calls x2 Evidence: src/components/screens/SeasonMigrationTab.jsx:calls, src/components/screens/SeasonMigrationTab.jsx:calls
- `subsystem-8-0-src-components` -> `subsystem-88-0-src-components` [LOW] via `calls`: calls x9 Evidence: src/components/screens/SeasonMigrationTab.jsx:calls, src/components/screens/SeasonMigrationTab.jsx:calls, src/components/screens/SeasonMigrationTab.jsx:calls
- `subsystem-80-0-src-components` -> `subsystem-121-0-src-components` [LOW] via `calls`: calls x2 Evidence: src/components/screens/MatchResultScreen.jsx:calls, src/components/screens/MatchResultScreen.jsx:calls
- `subsystem-80-0-src-components` -> `subsystem-61-0-src-components` [LOW] via `calls`: calls x2 Evidence: src/components/screens/MatchResultScreen.jsx:calls, src/components/screens/MatchResultScreen.jsx:calls
- `subsystem-80-0-src-components` -> `subsystem-7-0-src-components` [LOW] via `calls`: calls x1 Evidence: src/components/screens/MatchResultScreen.jsx:calls
- `subsystem-81-0-src-components` -> `subsystem-121-0-src-components` [LOW] via `calls`: calls x1 Evidence: src/components/screens/TournamentsScreen.jsx:calls
- `subsystem-81-0-src-components` -> `subsystem-169-0-src-components` [LOW] via `calls`: calls x1 Evidence: src/components/screens/TournamentsScreen.jsx:calls
- `subsystem-81-0-src-components` -> `subsystem-61-0-src-components` [LOW] via `calls`: calls x1 Evidence: src/components/screens/TournamentsScreen.jsx:calls
- `subsystem-81-0-src-components` -> `subsystem-7-0-src-components` [LOW] via `calls`: calls x3 Evidence: src/components/screens/TournamentsScreen.jsx:calls, src/components/screens/TournamentsScreen.jsx:calls, src/components/screens/TournamentsScreen.jsx:calls
- `subsystem-82-0-delete-season-js` -> `subsystem-27-0-apply-bug5-sql-js` [HIGH] via `calls`: calls x8, imports x2 Evidence: delete_season.js:calls, delete_season.js:calls, delete_season.js:calls
- `subsystem-83-0-src-components` -> `subsystem-1-0-src-context` [MEDIUM] via `imports`: imports x1 Evidence: src/components/ProtectedRoute.jsx:imports
- `subsystem-83-0-src-components` -> `subsystem-53-0-src-app-jsx` [HIGH] via `imports`: imports x2, calls x1 Evidence: src/components/ProtectedRoute.jsx:calls, src/components/ProtectedRoute.jsx:imports, src/components/ProtectedRoute.jsx:imports
- `subsystem-84-0-src-components` -> `subsystem-1-0-src-context` [MEDIUM] via `imports`: imports x1 Evidence: src/components/screens/InningsBreakScreen.jsx:imports
- `subsystem-84-0-src-components` -> `subsystem-126-0-src-components` [MEDIUM] via `imports`: imports x1 Evidence: src/components/screens/InningsBreakScreen.jsx:imports
- `subsystem-84-0-src-components` -> `subsystem-157-0-src-components` [LOW] via `calls`: calls x2 Evidence: src/components/screens/InningsBreakScreen.jsx:calls, src/components/screens/InningsBreakScreen.jsx:calls
- `subsystem-84-0-src-components` -> `subsystem-158-0-src-components` [LOW] via `calls`: calls x2 Evidence: src/components/screens/InningsBreakScreen.jsx:calls, temp_extraction/src/components/screens/InningsBreakScreen.jsx:calls
- `subsystem-84-0-src-components` -> `subsystem-29-0-src-components` [HIGH] via `calls`: calls x3, imports x1 Evidence: src/components/screens/InningsBreakScreen.jsx:calls, src/components/screens/InningsBreakScreen.jsx:imports, src/components/screens/InningsBreakScreen.jsx:calls
- `subsystem-84-0-src-components` -> `subsystem-53-0-src-app-jsx` [HIGH] via `calls`: calls x1, imports x1 Evidence: src/components/screens/InningsBreakScreen.jsx:calls, src/components/screens/InningsBreakScreen.jsx:imports
- `subsystem-84-0-src-components` -> `subsystem-6-0-src-components` [MEDIUM] via `imports`: imports x1 Evidence: src/components/screens/InningsBreakScreen.jsx:imports
- `subsystem-84-0-src-components` -> `subsystem-86-0-src-components` [MEDIUM] via `imports`: imports x1 Evidence: src/components/screens/InningsBreakScreen.jsx:imports
- `subsystem-85-0-src-components` -> `subsystem-1-0-src-context` [MEDIUM] via `imports`: imports x1 Evidence: src/components/screens/MatchOverviewScreen.jsx:imports
- `subsystem-85-0-src-components` -> `subsystem-126-0-src-components` [MEDIUM] via `imports`: imports x1 Evidence: src/components/screens/MatchOverviewScreen.jsx:imports
- `subsystem-85-0-src-components` -> `subsystem-29-0-src-components` [LOW] via `calls`: calls x2 Evidence: src/components/screens/MatchOverviewScreen.jsx:calls, src/components/screens/MatchOverviewScreen.jsx:calls
- `subsystem-85-0-src-components` -> `subsystem-53-0-src-app-jsx` [HIGH] via `calls`: calls x1, imports x1 Evidence: src/components/screens/MatchOverviewScreen.jsx:calls, src/components/screens/MatchOverviewScreen.jsx:imports
- `subsystem-85-0-src-components` -> `subsystem-86-0-src-components` [MEDIUM] via `imports`: imports x1 Evidence: src/components/screens/MatchOverviewScreen.jsx:imports
- `subsystem-86-0-src-components` -> `subsystem-53-0-src-app-jsx` [HIGH] via `imports`: imports x1 Evidence: src/components/ui/Badge.jsx:imports
- `subsystem-87-0-temp-extraction` -> `subsystem-103-0-src-components` [LOW] via `calls`: calls x1 Evidence: temp_extraction/src/components/ui/PageHeader.jsx:calls
- `subsystem-87-0-temp-extraction` -> `subsystem-29-0-src-components` [LOW] via `calls`: calls x1 Evidence: temp_extraction/src/components/ui/PageHeader.jsx:calls
- `subsystem-87-0-temp-extraction` -> `subsystem-53-0-src-app-jsx` [HIGH] via `imports`: imports x1 Evidence: temp_extraction/src/components/ui/PageHeader.jsx:imports
- `subsystem-89-0-src-components` -> `subsystem-102-0-src-components` [LOW] via `calls`: calls x2 Evidence: src/components/screens/SelectionScreen.jsx:calls, temp_extraction/src/components/screens/SelectionScreen.jsx:calls
- `subsystem-89-0-src-components` -> `subsystem-121-0-src-components` [LOW] via `calls`: calls x1 Evidence: src/components/screens/SelectionScreen.jsx:calls
- `subsystem-89-0-src-components` -> `subsystem-7-0-src-components` [LOW] via `calls`: calls x2 Evidence: src/components/screens/SelectionScreen.jsx:calls, src/components/screens/SelectionScreen.jsx:calls
- `subsystem-9-0-src-components` -> `subsystem-1-0-src-context` [MEDIUM] via `imports`: imports x1 Evidence: src/components/screens/TeamsScreen.jsx:imports
- `subsystem-9-0-src-components` -> `subsystem-102-0-src-components` [LOW] via `calls`: calls x1 Evidence: src/components/screens/TeamsScreen.jsx:calls
- `subsystem-9-0-src-components` -> `subsystem-103-0-src-components` [LOW] via `calls`: calls x4 Evidence: src/components/screens/TeamsScreen.jsx:calls, src/components/screens/TeamsScreen.jsx:calls, src/components/screens/TeamsScreen.jsx:calls
- `subsystem-9-0-src-components` -> `subsystem-104-0-src-components` [LOW] via `calls`: calls x2 Evidence: src/components/screens/TeamsScreen.jsx:calls, src/components/screens/TeamsScreen.jsx:calls
- `subsystem-9-0-src-components` -> `subsystem-107-0-src-components` [LOW] via `calls`: calls x1 Evidence: src/components/screens/TeamsScreen.jsx:calls
- `subsystem-9-0-src-components` -> `subsystem-12-0-src-components` [MEDIUM] via `imports`: imports x1 Evidence: src/components/screens/TeamsScreen.jsx:imports
- `subsystem-9-0-src-components` -> `subsystem-124-0-src-components` [LOW] via `calls`: calls x2 Evidence: src/components/screens/TeamsScreen.jsx:calls, src/components/screens/TeamsScreen.jsx:calls
- `subsystem-9-0-src-components` -> `subsystem-126-0-src-components` [MEDIUM] via `imports`: imports x1 Evidence: src/components/screens/TeamsScreen.jsx:imports
- `subsystem-9-0-src-components` -> `subsystem-150-0-src-components` [LOW] via `calls`: calls x8 Evidence: src/components/screens/TeamsScreen.jsx:calls, src/components/screens/TeamsScreen.jsx:calls, src/components/screens/TeamsScreen.jsx:calls
- `subsystem-9-0-src-components` -> `subsystem-167-0-src-components` [LOW] via `calls`: calls x1 Evidence: src/components/screens/TeamsScreen.jsx:calls
- `subsystem-9-0-src-components` -> `subsystem-169-0-src-components` [LOW] via `calls`: calls x1 Evidence: src/components/screens/TeamsScreen.jsx:calls
- `subsystem-9-0-src-components` -> `subsystem-173-0-src-components` [LOW] via `calls`: calls x1 Evidence: src/components/screens/TeamsScreen.jsx:calls
- `subsystem-9-0-src-components` -> `subsystem-2-0-src-components` [LOW] via `calls`: calls x2 Evidence: src/components/screens/TeamsScreen.jsx:calls, src/components/screens/TeamsScreen.jsx:calls
- `subsystem-9-0-src-components` -> `subsystem-22-0-src-components` [LOW] via `calls`: calls x1 Evidence: src/components/screens/TeamsScreen.jsx:calls
- `subsystem-9-0-src-components` -> `subsystem-29-0-src-components` [LOW] via `calls`: calls x2 Evidence: src/components/screens/TeamsScreen.jsx:calls, src/components/screens/TeamsScreen.jsx:calls
- `subsystem-9-0-src-components` -> `subsystem-3-0-src-components` [LOW] via `calls`: calls x2 Evidence: src/components/screens/TeamsScreen.jsx:calls, src/components/screens/TeamsScreen.jsx:calls
- `subsystem-9-0-src-components` -> `subsystem-32-0-src-components` [HIGH] via `calls`: calls x6, contains x1 Evidence: src/components/screens/TeamsScreen.jsx:calls, src/components/screens/TeamsScreen.jsx:calls, src/components/screens/TeamsScreen.jsx:calls
- `subsystem-9-0-src-components` -> `subsystem-53-0-src-app-jsx` [HIGH] via `imports`: imports x4, calls x1 Evidence: src/components/screens/TeamsScreen.jsx:calls, src/components/screens/TeamsScreen.jsx:imports, src/components/screens/TeamsScreen.jsx:imports
- `subsystem-9-0-src-components` -> `subsystem-56-0-src-components` [LOW] via `calls`: calls x1 Evidence: src/components/screens/TeamsScreen.jsx:calls
- `subsystem-9-0-src-components` -> `subsystem-6-0-src-components` [LOW] via `calls`: calls x2 Evidence: src/components/screens/TeamsScreen.jsx:calls, src/components/screens/TeamsScreen.jsx:calls
- `subsystem-9-0-src-components` -> `subsystem-7-0-src-components` [LOW] via `calls`: calls x1 Evidence: src/components/screens/TeamsScreen.jsx:calls
- `subsystem-9-0-src-components` -> `subsystem-70-0-src-components` [LOW] via `calls`: calls x1 Evidence: src/components/screens/TeamsScreen.jsx:calls
- `subsystem-9-0-src-components` -> `subsystem-88-0-src-components` [LOW] via `calls`: calls x22 Evidence: src/components/screens/TeamsScreen.jsx:calls, src/components/screens/TeamsScreen.jsx:calls, src/components/screens/TeamsScreen.jsx:calls
- `subsystem-9-0-src-components` -> `subsystem-90-0-src-components` [HIGH] via `calls`: calls x1, contains x1 Evidence: src/components/screens/TeamsScreen.jsx:calls, src/components/screens/TeamsScreen.jsx:contains
- `subsystem-90-0-src-components` -> `subsystem-121-0-src-components` [LOW] via `calls`: calls x2 Evidence: src/components/screens/TeamsScreen.jsx:calls, src/components/screens/TeamsScreen.jsx:calls
- `subsystem-90-0-src-components` -> `subsystem-61-0-src-components` [LOW] via `calls`: calls x1 Evidence: src/components/screens/TeamsScreen.jsx:calls
- `subsystem-90-0-src-components` -> `subsystem-7-0-src-components` [LOW] via `calls`: calls x3 Evidence: src/components/screens/TeamsScreen.jsx:calls, src/components/screens/TeamsScreen.jsx:calls, src/components/screens/TeamsScreen.jsx:calls
- `subsystem-91-0-src-components` -> `subsystem-21-0-src-components` [LOW] via `calls`: calls x1 Evidence: src/components/selection/SelectionWorkspace.jsx:calls
- `subsystem-91-0-src-components` -> `subsystem-7-0-src-components` [LOW] via `calls`: calls x1 Evidence: src/components/selection/SelectionWorkspace.jsx:calls
- `subsystem-92-0-src-context` -> `subsystem-1-0-src-context` [LOW] via `calls`: calls x1 Evidence: src/context/CricketContext.jsx:calls
- `subsystem-92-0-src-context` -> `subsystem-121-0-src-components` [LOW] via `calls`: calls x4 Evidence: src/context/CricketContext.jsx:calls, src/context/CricketContext.jsx:calls, src/context/CricketContext.jsx:calls
- `subsystem-92-0-src-context` -> `subsystem-7-0-src-components` [LOW] via `calls`: calls x4 Evidence: src/context/CricketContext.jsx:calls, src/context/CricketContext.jsx:calls, src/context/CricketContext.jsx:calls
- `subsystem-92-0-src-context` -> `subsystem-89-0-src-components` [LOW] via `calls`: calls x1 Evidence: src/context/CricketContext.jsx:calls
- `subsystem-93-0-src-components` -> `subsystem-1-0-src-context` [MEDIUM] via `imports`: imports x1 Evidence: src/components/screens/AccessControlScreen.jsx:imports
- `subsystem-93-0-src-components` -> `subsystem-2-0-src-components` [LOW] via `calls`: calls x1 Evidence: src/components/screens/AccessControlScreen.jsx:calls
- `subsystem-93-0-src-components` -> `subsystem-29-0-src-components` [HIGH] via `imports`: imports x1 Evidence: src/components/screens/AccessControlScreen.jsx:imports
- `subsystem-93-0-src-components` -> `subsystem-53-0-src-app-jsx` [HIGH] via `calls`: calls x1, imports x1 Evidence: src/components/screens/AccessControlScreen.jsx:calls, src/components/screens/AccessControlScreen.jsx:imports
- `subsystem-94-0-src-components` -> `subsystem-12-0-src-components` [MEDIUM] via `imports`: imports x1 Evidence: src/components/selection/PlayerList.jsx:imports
- `subsystem-94-0-src-components` -> `subsystem-159-0-src-components` [LOW] via `calls`: calls x1 Evidence: src/components/selection/PlayerList.jsx:calls
- `subsystem-94-0-src-components` -> `subsystem-29-0-src-components` [HIGH] via `imports`: imports x1 Evidence: src/components/selection/PlayerList.jsx:imports
- `subsystem-94-0-src-components` -> `subsystem-53-0-src-app-jsx` [HIGH] via `imports`: imports x1 Evidence: src/components/selection/PlayerList.jsx:imports
- `subsystem-94-0-src-components` -> `subsystem-88-0-src-components` [LOW] via `calls`: calls x2 Evidence: src/components/selection/PlayerList.jsx:calls, src/components/selection/PlayerList.jsx:calls
- `subsystem-95-0-src-components` -> `subsystem-159-0-src-components` [LOW] via `calls`: calls x1 Evidence: src/components/selection/Shortlist.jsx:calls
- `subsystem-95-0-src-components` -> `subsystem-169-0-src-components` [LOW] via `calls`: calls x1 Evidence: src/components/selection/Shortlist.jsx:calls
- `subsystem-95-0-src-components` -> `subsystem-29-0-src-components` [HIGH] via `imports`: imports x1 Evidence: src/components/selection/Shortlist.jsx:imports
- `subsystem-95-0-src-components` -> `subsystem-44-0-src-components` [LOW] via `calls`: calls x2 Evidence: src/components/selection/Shortlist.jsx:calls, src/components/selection/Shortlist.jsx:calls
- `subsystem-95-0-src-components` -> `subsystem-53-0-src-app-jsx` [HIGH] via `imports`: imports x1 Evidence: src/components/selection/Shortlist.jsx:imports
- `subsystem-95-0-src-components` -> `subsystem-88-0-src-components` [LOW] via `calls`: calls x3 Evidence: src/components/selection/Shortlist.jsx:calls, src/components/selection/Shortlist.jsx:calls, src/components/selection/Shortlist.jsx:calls
- `subsystem-95-0-src-components` -> `subsystem-94-0-src-components` [LOW] via `calls`: calls x2 Evidence: src/components/selection/Shortlist.jsx:calls, src/components/selection/Shortlist.jsx:calls
- `subsystem-96-0-temp-extraction` -> `subsystem-29-0-src-components` [HIGH] via `calls`: calls x2, contains x1 Evidence: temp_extraction/src/components/BottomNav.jsx:calls, temp_extraction/src/components/BottomNav.jsx:calls, temp_extraction/src/components/BottomNav.jsx:contains
- `subsystem-96-0-temp-extraction` -> `subsystem-47-0-src-components` [LOW] via `calls`: calls x1 Evidence: temp_extraction/src/components/BottomNav.jsx:calls
- `subsystem-96-0-temp-extraction` -> `subsystem-53-0-src-app-jsx` [HIGH] via `calls`: calls x1, imports x1 Evidence: temp_extraction/src/components/BottomNav.jsx:calls, temp_extraction/src/components/BottomNav.jsx:imports
- `subsystem-96-0-temp-extraction` -> `subsystem-88-0-src-components` [LOW] via `calls`: calls x3 Evidence: temp_extraction/src/components/BottomNav.jsx:calls, temp_extraction/src/components/BottomNav.jsx:calls, temp_extraction/src/components/BottomNav.jsx:calls
- `subsystem-96-0-temp-extraction` -> `subsystem-98-0-temp-extraction` [MEDIUM] via `imports`: imports x1 Evidence: temp_extraction/src/components/BottomNav.jsx:imports
- `subsystem-97-0-temp-extraction` -> `subsystem-104-0-src-components` [LOW] via `calls`: calls x4 Evidence: temp_extraction/src/components/screens/ScoutingHubScreen.jsx:calls, temp_extraction/src/components/screens/ScoutingHubScreen.jsx:calls, temp_extraction/src/components/screens/ScoutingHubScreen.jsx:calls
- `subsystem-97-0-temp-extraction` -> `subsystem-161-0-src-components` [LOW] via `calls`: calls x1 Evidence: temp_extraction/src/components/screens/ScoutingHubScreen.jsx:calls
- `subsystem-97-0-temp-extraction` -> `subsystem-24-0-src-components` [LOW] via `calls`: calls x1 Evidence: temp_extraction/src/components/screens/ScoutingHubScreen.jsx:calls
- `subsystem-97-0-temp-extraction` -> `subsystem-29-0-src-components` [LOW] via `calls`: calls x1 Evidence: temp_extraction/src/components/screens/ScoutingHubScreen.jsx:calls
- `subsystem-97-0-temp-extraction` -> `subsystem-30-0-src-components` [LOW] via `calls`: calls x3 Evidence: temp_extraction/src/components/screens/ScoutingHubScreen.jsx:calls, temp_extraction/src/components/screens/ScoutingHubScreen.jsx:calls, temp_extraction/src/components/screens/ScoutingHubScreen.jsx:calls
- `subsystem-97-0-temp-extraction` -> `subsystem-32-0-src-components` [HIGH] via `calls`: calls x5, contains x1 Evidence: temp_extraction/src/components/screens/ScoutingHubScreen.jsx:calls, temp_extraction/src/components/screens/ScoutingHubScreen.jsx:calls, temp_extraction/src/components/screens/ScoutingHubScreen.jsx:calls
- `subsystem-97-0-temp-extraction` -> `subsystem-33-0-src-components` [LOW] via `calls`: calls x18 Evidence: temp_extraction/src/components/screens/ScoutingHubScreen.jsx:calls, temp_extraction/src/components/screens/ScoutingHubScreen.jsx:calls, temp_extraction/src/components/screens/ScoutingHubScreen.jsx:calls
- `subsystem-97-0-temp-extraction` -> `subsystem-53-0-src-app-jsx` [HIGH] via `calls`: calls x1, imports x1 Evidence: temp_extraction/src/components/screens/ScoutingHubScreen.jsx:calls, temp_extraction/src/components/screens/ScoutingHubScreen.jsx:imports
- `subsystem-97-0-temp-extraction` -> `subsystem-88-0-src-components` [LOW] via `calls`: calls x8 Evidence: temp_extraction/src/components/screens/ScoutingHubScreen.jsx:calls, temp_extraction/src/components/screens/ScoutingHubScreen.jsx:calls, temp_extraction/src/components/screens/ScoutingHubScreen.jsx:calls
- `subsystem-97-0-temp-extraction` -> `subsystem-98-0-temp-extraction` [MEDIUM] via `imports`: imports x1 Evidence: temp_extraction/src/components/screens/ScoutingHubScreen.jsx:imports
- `subsystem-98-0-temp-extraction` -> `subsystem-1-0-src-context` [HIGH] via `contains`: contains x20, calls x10 Evidence: temp_extraction/src/context/CricketContext.jsx:calls, temp_extraction/src/context/CricketContext.jsx:calls, temp_extraction/src/context/CricketContext.jsx:calls
- `subsystem-98-0-temp-extraction` -> `subsystem-102-0-src-components` [LOW] via `calls`: calls x2 Evidence: temp_extraction/src/context/CricketContext.jsx:calls, temp_extraction/src/context/CricketContext.jsx:calls
- `subsystem-98-0-temp-extraction` -> `subsystem-149-0-src-app-jsx` [LOW] via `calls`: calls x1 Evidence: temp_extraction/src/context/CricketContext.jsx:calls
- `subsystem-98-0-temp-extraction` -> `subsystem-168-0-src-components` [LOW] via `calls`: calls x1 Evidence: temp_extraction/src/context/CricketContext.jsx:calls
- `subsystem-98-0-temp-extraction` -> `subsystem-177-0-src-components` [HIGH] via `imports`: imports x1 Evidence: temp_extraction/src/context/CricketContext.jsx:imports
- `subsystem-98-0-temp-extraction` -> `subsystem-29-0-src-components` [LOW] via `calls`: calls x1 Evidence: temp_extraction/src/context/CricketContext.jsx:calls
- `subsystem-98-0-temp-extraction` -> `subsystem-3-0-src-components` [LOW] via `calls`: calls x1 Evidence: temp_extraction/src/context/CricketContext.jsx:calls
- `subsystem-98-0-temp-extraction` -> `subsystem-53-0-src-app-jsx` [HIGH] via `imports`: imports x2 Evidence: temp_extraction/src/context/CricketContext.jsx:imports, temp_extraction/src/context/CricketContext.jsx:imports
- `subsystem-98-0-temp-extraction` -> `subsystem-88-0-src-components` [LOW] via `calls`: calls x35 Evidence: temp_extraction/src/context/CricketContext.jsx:calls, temp_extraction/src/context/CricketContext.jsx:calls, temp_extraction/src/context/CricketContext.jsx:calls
- `subsystem-99-0-test-players2-js` -> `subsystem-0-0-src-lib` [LOW] via `calls`: calls x4 Evidence: test-players2.js:calls, test-players2.js:calls, test-players2.js:calls
- `subsystem-99-0-test-players2-js` -> `subsystem-27-0-apply-bug5-sql-js` [HIGH] via `calls`: calls x6, imports x2 Evidence: test-players2.js:calls, test-players2.js:calls, test-players2.js:calls
- `subsystem-99-0-test-players2-js` -> `subsystem-82-0-delete-season-js` [LOW] via `calls`: calls x1 Evidence: test-players2.js:calls

## Cross-Cutting Concerns

- `auth` [HIGH] touches `subsystem-0-0-src-lib`, `subsystem-1-0-src-context`, `subsystem-122-0-src-components`, `subsystem-125-0-temp-extraction`, `subsystem-136-0-temp-extraction`, `subsystem-152-0-src-components`, `subsystem-21-0-src-components`, `subsystem-28-0-src-components`, `subsystem-4-0-02-selector-assignment-refactor-sql`, `subsystem-5-0-src-context`, `subsystem-7-0-src-components`, `subsystem-73-0-src-components`, `subsystem-74-0-src-components`: auth signals appear across 13 subsystems via 31 matched nodes. Evidence: src/components/screens/AuthScreen.jsx:src/components/screens/AuthScreen.jsx, temp_extraction/src/components/screens/AuthScreen.jsx:temp_extraction/src/components/screens/AuthScreen.jsx, 04_admin_delete_user.sql:auth.users
- `config` [HIGH] touches `subsystem-10-0-clean-cjs`, `subsystem-100-0-test-players3-js`, `subsystem-17-0-supabase`, `subsystem-27-0-apply-bug5-sql-js`, `subsystem-3-0-src-components`, `subsystem-46-0-temp-extraction`, `subsystem-7-0-src-components`: config signals appear across 7 subsystems via 19 matched nodes. Evidence: temp_extraction/vite.config.ts:temp_extraction/vite.config.ts, vite.config.ts:vite.config.ts, apply-bug5-sql.js:dotenv.config
- `errors` [HIGH] touches `subsystem-0-0-src-lib`, `subsystem-1-0-src-context`, `subsystem-115-0-src-components`, `subsystem-121-0-src-components`, `subsystem-168-0-src-components`, `subsystem-17-0-supabase`, `subsystem-2-0-src-components`, `subsystem-25-0-src-main-jsx`, `subsystem-27-0-apply-bug5-sql-js`, `subsystem-3-0-src-components`, `subsystem-5-0-src-context`, `subsystem-52-0-src-hooks`, `subsystem-65-0-src-components`, `subsystem-7-0-src-components`, `subsystem-73-0-src-components`: errors signals appear across 15 subsystems via 25 matched nodes. Evidence: src/components/ui/ErrorState.jsx:src/components/ui/ErrorState.jsx, apply-bug5-sql.js:console.error, src/components/NotificationPrompt.jsx:console.error
- `logging` [HIGH] touches `subsystem-1-0-src-context`, `subsystem-10-0-clean-cjs`, `subsystem-125-0-temp-extraction`, `subsystem-2-0-src-components`, `subsystem-27-0-apply-bug5-sql-js`, `subsystem-4-0-02-selector-assignment-refactor-sql`, `subsystem-43-0-fix-logo-py`, `subsystem-47-0-src-components`, `subsystem-6-0-src-components`, `subsystem-66-0-src-components`, `subsystem-73-0-src-components`: logging signals appear across 11 subsystems via 25 matched nodes. Evidence: fix_logo.py:fix_logo.py, apply-bug5-sql.js:console.log, clean.cjs:console.log
- `persistence` [HIGH] touches `subsystem-0-0-src-lib`, `subsystem-146-0-temp-extraction`, `subsystem-24-0-src-components`, `subsystem-27-0-apply-bug5-sql-js`, `subsystem-4-0-02-selector-assignment-refactor-sql`, `subsystem-40-0-src-components`, `subsystem-41-0-src-lib`, `subsystem-49-0-src-engine`, `subsystem-58-0-src-components`, `subsystem-62-0-src-components`, `subsystem-68-0-05-team-types-sql`: persistence signals appear across 11 subsystems via 109 matched nodes. Evidence: 02_selector_assignment_refactor.sql:02_selector_assignment_refactor.sql, 03_season_management_architecture.sql:03_season_management_architecture.sql, 04_admin_delete_user.sql:04_admin_delete_user.sql
- `caching` [MEDIUM] touches `subsystem-103-0-src-components`, `subsystem-36-0-src-components`: caching signals appear across 2 subsystems via 2 matched nodes. Evidence: src/components/screens/InningsInitScreen.jsx:useMemo, src/components/ui/DataTable.jsx:React.useMemo, src/components/screens/InningsInitScreen.jsx:calls

## Entrypoints

- `BIN` [HIGH] from `src/lib/api.js` in `subsystem-0-0-src-lib`. Ranked as an entrypoint because it is tagged or named like a runtime root and has degree 1. Evidence: src/lib/api.js:BIN, src/lib/api.js:calls
- `Error` [HIGH] from `src/lib/api.js` in `subsystem-0-0-src-lib`. Ranked as an entrypoint because it is tagged or named like a runtime root and has degree 2. Evidence: src/lib/api.js:Error, src/lib/api.js:calls, src/lib/api.js:calls
- `None` [HIGH] from `src/lib/api.js` in `subsystem-0-0-src-lib`. Ranked as an entrypoint because it is tagged or named like a runtime root and has degree 2. Evidence: src/lib/api.js:None, src/lib/api.js:calls, temp_extraction/src/data/mockData.js:calls
- `Promise.all` [HIGH] from `src/lib/api.js` in `subsystem-0-0-src-lib`. Ranked as an entrypoint because it is tagged or named like a runtime root and has degree 1. Evidence: src/lib/api.js:Promise.all, src/lib/api.js:calls, src/lib/api.js:calls
- `ageCategories.forEach` [HIGH] from `src/lib/api.js` in `subsystem-0-0-src-lib`. Ranked as an entrypoint because it is tagged or named like a runtime root and has degree 1. Evidence: src/lib/api.js:ageCategories.forEach, src/lib/api.js:calls
- `age_category_id` [HIGH] from `src/lib/api.js` in `subsystem-0-0-src-lib`. Ranked as an entrypoint because it is tagged or named like a runtime root and has degree 3. Evidence: src/lib/api.js:age_category_id, src/lib/api.js:calls, src/lib/api.js:calls
- `assignManOfTheMatch` [HIGH] from `src/lib/api.js` in `subsystem-0-0-src-lib`. Ranked as an entrypoint because it is tagged or named like a runtime root and has degree 1. Evidence: src/lib/api.js:assignManOfTheMatch, src/lib/api.js:calls
- `assignScorer` [HIGH] from `src/lib/api.js` in `subsystem-0-0-src-lib`. Ranked as an entrypoint because it is tagged or named like a runtime root and has degree 1. Evidence: src/lib/api.js:assignScorer, src/lib/api.js:calls
- `assignments.map` [HIGH] from `src/lib/api.js` in `subsystem-0-0-src-lib`. Ranked as an entrypoint because it is tagged or named like a runtime root and has degree 1. Evidence: src/lib/api.js:assignments.map, src/lib/api.js:calls
- `away_team_id` [HIGH] from `src/lib/api.js` in `subsystem-0-0-src-lib`. Ranked as an entrypoint because it is tagged or named like a runtime root and has degree 1. Evidence: src/lib/api.js:away_team_id, src/lib/api.js:calls, src/lib/api.js:calls
- `bowler_id` [HIGH] from `src/lib/api.js` in `subsystem-0-0-src-lib`. Ranked as an entrypoint because it is tagged or named like a runtime root and has degree 1. Evidence: src/lib/api.js:bowler_id, src/lib/api.js:calls, src/lib/api.js:calls
- `bulkMigratePlayers` [HIGH] from `src/lib/api.js` in `subsystem-0-0-src-lib`. Ranked as an entrypoint because it is tagged or named like a runtime root and has degree 1. Evidence: src/lib/api.js:bulkMigratePlayers, src/lib/api.js:calls
- `console.warn` [HIGH] from `src/lib/api.js` in `subsystem-0-0-src-lib`. Ranked as an entrypoint because it is tagged or named like a runtime root and has degree 5. Evidence: src/lib/api.js:console.warn, src/lib/api.js:calls, src/lib/supabase.js:calls
- `createAnnouncement` [HIGH] from `src/lib/api.js` in `subsystem-0-0-src-lib`. Ranked as an entrypoint because it is tagged or named like a runtime root and has degree 1. Evidence: src/lib/api.js:createAnnouncement, src/lib/api.js:calls
- `createDetailedMatches` [HIGH] from `src/lib/api.js` in `subsystem-0-0-src-lib`. Ranked as an entrypoint because it is tagged or named like a runtime root and has degree 1. Evidence: src/lib/api.js:createDetailedMatches, src/lib/api.js:calls
- `createSeason` [HIGH] from `src/lib/api.js` in `subsystem-0-0-src-lib`. Ranked as an entrypoint because it is tagged or named like a runtime root and has degree 1. Evidence: src/lib/api.js:createSeason, src/lib/api.js:calls
- `createTeam` [HIGH] from `src/lib/api.js` in `subsystem-0-0-src-lib`. Ranked as an entrypoint because it is tagged or named like a runtime root and has degree 1. Evidence: src/lib/api.js:createTeam, src/lib/api.js:calls
- `createTournament` [HIGH] from `src/lib/api.js` in `subsystem-0-0-src-lib`. Ranked as an entrypoint because it is tagged or named like a runtime root and has degree 1. Evidence: src/lib/api.js:createTournament, src/lib/api.js:calls
- `data.forEach` [HIGH] from `src/lib/api.js` in `subsystem-0-0-src-lib`. Ranked as an entrypoint because it is tagged or named like a runtime root and has degree 1. Evidence: src/lib/api.js:data.forEach, src/lib/api.js:calls, src/lib/api.js:calls
- `data.map` [HIGH] from `src/lib/api.js` in `subsystem-0-0-src-lib`. Ranked as an entrypoint because it is tagged or named like a runtime root and has degree 1. Evidence: src/lib/api.js:data.map, src/lib/api.js:calls, src/lib/api.js:calls
- `deleteAnnouncement` [HIGH] from `src/lib/api.js` in `subsystem-0-0-src-lib`. Ranked as an entrypoint because it is tagged or named like a runtime root and has degree 1. Evidence: src/lib/api.js:deleteAnnouncement, src/lib/api.js:calls
- `deleteMatch` [HIGH] from `src/lib/api.js` in `subsystem-0-0-src-lib`. Ranked as an entrypoint because it is tagged or named like a runtime root and has degree 1. Evidence: src/lib/api.js:deleteMatch, src/lib/api.js:calls
- `deletePlayer` [HIGH] from `src/lib/api.js` in `subsystem-0-0-src-lib`. Ranked as an entrypoint because it is tagged or named like a runtime root and has degree 1. Evidence: src/lib/api.js:deletePlayer, src/lib/api.js:calls
- `deleteTournament` [HIGH] from `src/lib/api.js` in `subsystem-0-0-src-lib`. Ranked as an entrypoint because it is tagged or named like a runtime root and has degree 1. Evidence: src/lib/api.js:deleteTournament, src/lib/api.js:calls
- `deleteUser` [HIGH] from `src/lib/api.js` in `subsystem-0-0-src-lib`. Ranked as an entrypoint because it is tagged or named like a runtime root and has degree 1. Evidence: src/lib/api.js:deleteUser, src/lib/api.js:calls
- `district_id` [HIGH] from `src/lib/api.js` in `subsystem-0-0-src-lib`. Ranked as an entrypoint because it is tagged or named like a runtime root and has degree 4. Evidence: src/lib/api.js:district_id, src/lib/api.js:calls, src/lib/api.js:calls
- `districts.forEach` [HIGH] from `src/lib/api.js` in `subsystem-0-0-src-lib`. Ranked as an entrypoint because it is tagged or named like a runtime root and has degree 1. Evidence: src/lib/api.js:districts.forEach, src/lib/api.js:calls
- `exist` [HIGH] from `src/lib/api.js` in `subsystem-0-0-src-lib`. Ranked as an entrypoint because it is tagged or named like a runtime root and has degree 1. Evidence: src/lib/api.js:exist, src/lib/api.js:calls
- `existingSet.has` [HIGH] from `src/lib/api.js` in `subsystem-0-0-src-lib`. Ranked as an entrypoint because it is tagged or named like a runtime root and has degree 1. Evidence: src/lib/api.js:existingSet.has, src/lib/api.js:calls
- `finalizeMatch` [HIGH] from `src/lib/api.js` in `subsystem-0-0-src-lib`. Ranked as an entrypoint because it is tagged or named like a runtime root and has degree 1. Evidence: src/lib/api.js:finalizeMatch, src/lib/api.js:calls
- `finalizeSquad` [HIGH] from `src/lib/api.js` in `subsystem-0-0-src-lib`. Ranked as an entrypoint because it is tagged or named like a runtime root and has degree 1. Evidence: src/lib/api.js:finalizeSquad, src/lib/api.js:calls
- `g.substring` [HIGH] from `src/lib/api.js` in `subsystem-0-0-src-lib`. Ranked as an entrypoint because it is tagged or named like a runtime root and has degree 1. Evidence: src/lib/api.js:g.substring, src/lib/api.js:calls
- `genders.forEach` [HIGH] from `src/lib/api.js` in `subsystem-0-0-src-lib`. Ranked as an entrypoint because it is tagged or named like a runtime root and has degree 1. Evidence: src/lib/api.js:genders.forEach, src/lib/api.js:calls
- `getActiveSeason` [HIGH] from `src/lib/api.js` in `subsystem-0-0-src-lib`. Ranked as an entrypoint because it is tagged or named like a runtime root and has degree 1. Evidence: src/lib/api.js:getActiveSeason, src/lib/api.js:calls
- `getAgeCategories` [HIGH] from `src/lib/api.js` in `subsystem-0-0-src-lib`. Ranked as an entrypoint because it is tagged or named like a runtime root and has degree 1. Evidence: src/lib/api.js:getAgeCategories, src/lib/api.js:calls
- `getAnnouncements` [HIGH] from `src/lib/api.js` in `subsystem-0-0-src-lib`. Ranked as an entrypoint because it is tagged or named like a runtime root and has degree 1. Evidence: src/lib/api.js:getAnnouncements, src/lib/api.js:calls
- `getDefaults` [HIGH] from `src/lib/api.js` in `subsystem-0-0-src-lib`. Ranked as an entrypoint because it is tagged or named like a runtime root and has degree 1. Evidence: src/lib/api.js:getDefaults, src/lib/api.js:calls
- `getMatchScorecard` [HIGH] from `src/lib/api.js` in `subsystem-0-0-src-lib`. Ranked as an entrypoint because it is tagged or named like a runtime root and has degree 1. Evidence: src/lib/api.js:getMatchScorecard, src/lib/api.js:calls
- `getOrCreateInnings` [HIGH] from `src/lib/api.js` in `subsystem-0-0-src-lib`. Ranked as an entrypoint because it is tagged or named like a runtime root and has degree 1. Evidence: src/lib/api.js:getOrCreateInnings, src/lib/api.js:calls
- `getPlayerMatchStats` [HIGH] from `src/lib/api.js` in `subsystem-0-0-src-lib`. Ranked as an entrypoint because it is tagged or named like a runtime root and has degree 1. Evidence: src/lib/api.js:getPlayerMatchStats, src/lib/api.js:calls
- `getPlayersBySeason` [HIGH] from `src/lib/api.js` in `subsystem-0-0-src-lib`. Ranked as an entrypoint because it is tagged or named like a runtime root and has degree 1. Evidence: src/lib/api.js:getPlayersBySeason, src/lib/api.js:calls
- `getProfiles` [HIGH] from `src/lib/api.js` in `subsystem-0-0-src-lib`. Ranked as an entrypoint because it is tagged or named like a runtime root and has degree 1. Evidence: src/lib/api.js:getProfiles, src/lib/api.js:calls
- `getRecycleBinItems` [HIGH] from `src/lib/api.js` in `subsystem-0-0-src-lib`. Ranked as an entrypoint because it is tagged or named like a runtime root and has degree 1. Evidence: src/lib/api.js:getRecycleBinItems, src/lib/api.js:calls
- `getSeasons` [HIGH] from `src/lib/api.js` in `subsystem-0-0-src-lib`. Ranked as an entrypoint because it is tagged or named like a runtime root and has degree 1. Evidence: src/lib/api.js:getSeasons, src/lib/api.js:calls
- `getSelectionCandidates` [HIGH] from `src/lib/api.js` in `subsystem-0-0-src-lib`. Ranked as an entrypoint because it is tagged or named like a runtime root and has degree 1. Evidence: src/lib/api.js:getSelectionCandidates, src/lib/api.js:calls
- `getSelectionProcesses` [HIGH] from `src/lib/api.js` in `subsystem-0-0-src-lib`. Ranked as an entrypoint because it is tagged or named like a runtime root and has degree 1. Evidence: src/lib/api.js:getSelectionProcesses, src/lib/api.js:calls
- `getSelectorAssignments` [HIGH] from `src/lib/api.js` in `subsystem-0-0-src-lib`. Ranked as an entrypoint because it is tagged or named like a runtime root and has degree 1. Evidence: src/lib/api.js:getSelectorAssignments, src/lib/api.js:calls
- `hardDeleteItem` [HIGH] from `src/lib/api.js` in `subsystem-0-0-src-lib`. Ranked as an entrypoint because it is tagged or named like a runtime root and has degree 1. Evidence: src/lib/api.js:hardDeleteItem, src/lib/api.js:calls
- `home_team_id` [HIGH] from `src/lib/api.js` in `subsystem-0-0-src-lib`. Ranked as an entrypoint because it is tagged or named like a runtime root and has degree 1. Evidence: src/lib/api.js:home_team_id, src/lib/api.js:calls, src/lib/api.js:calls
- `hydrateLiveMatch` [HIGH] from `src/lib/api.js` in `subsystem-0-0-src-lib`. Ranked as an entrypoint because it is tagged or named like a runtime root and has degree 1. Evidence: src/lib/api.js:hydrateLiveMatch, src/lib/api.js:calls
- `insert` [HIGH] from `src/lib/api.js` in `subsystem-0-0-src-lib`. Ranked as an entrypoint because it is tagged or named like a runtime root and has degree 3. Evidence: src/lib/api.js:insert, src/lib/api.js:calls, src/lib/api.js:calls
- `items.push` [HIGH] from `src/lib/api.js` in `subsystem-0-0-src-lib`. Ranked as an entrypoint because it is tagged or named like a runtime root and has degree 1. Evidence: src/lib/api.js:items.push, src/lib/api.js:calls, src/lib/api.js:calls
- `items.sort` [HIGH] from `src/lib/api.js` in `subsystem-0-0-src-lib`. Ranked as an entrypoint because it is tagged or named like a runtime root and has degree 1. Evidence: src/lib/api.js:items.sort, src/lib/api.js:calls
- `limit` [HIGH] from `src/lib/api.js` in `subsystem-0-0-src-lib`. Ranked as an entrypoint because it is tagged or named like a runtime root and has degree 5. Evidence: src/lib/api.js:limit, src/lib/api.js:calls, src/lib/api.js:calls
- `man_of_the_match_id` [HIGH] from `src/lib/api.js` in `subsystem-0-0-src-lib`. Ranked as an entrypoint because it is tagged or named like a runtime root and has degree 1. Evidence: src/lib/api.js:man_of_the_match_id, src/lib/api.js:calls
- `matches` [HIGH] from `src/lib/api.js` in `subsystem-0-0-src-lib`. Ranked as an entrypoint because it is tagged or named like a runtime root and has degree 2. Evidence: src/lib/api.js:matches, src/lib/api.js:calls, src/lib/api.js:calls
- `matchesArray.map` [HIGH] from `src/lib/api.js` in `subsystem-0-0-src-lib`. Ranked as an entrypoint because it is tagged or named like a runtime root and has degree 1. Evidence: src/lib/api.js:matchesArray.map, src/lib/api.js:calls
- `maybeSingle` [HIGH] from `src/lib/api.js` in `subsystem-0-0-src-lib`. Ranked as an entrypoint because it is tagged or named like a runtime root and has degree 3. Evidence: src/lib/api.js:maybeSingle, src/lib/api.js:calls, src/lib/api.js:calls
- `message.includes` [HIGH] from `src/lib/api.js` in `subsystem-0-0-src-lib`. Ranked as an entrypoint because it is tagged or named like a runtime root and has degree 1. Evidence: src/lib/api.js:message.includes, src/lib/api.js:calls
- `name.substring` [HIGH] from `src/lib/api.js` in `subsystem-0-0-src-lib`. Ranked as an entrypoint because it is tagged or named like a runtime root and has degree 1. Evidence: src/lib/api.js:name.substring, src/lib/api.js:calls
- `name.trim` [HIGH] from `src/lib/api.js` in `subsystem-0-0-src-lib`. Ranked as an entrypoint because it is tagged or named like a runtime root and has degree 1. Evidence: src/lib/api.js:name.trim, src/lib/api.js:calls
- `neq` [HIGH] from `src/lib/api.js` in `subsystem-0-0-src-lib`. Ranked as an entrypoint because it is tagged or named like a runtime root and has degree 1. Evidence: src/lib/api.js:neq, src/lib/api.js:calls, src/lib/api.js:calls
- `non_striker_id` [HIGH] from `src/lib/api.js` in `subsystem-0-0-src-lib`. Ranked as an entrypoint because it is tagged or named like a runtime root and has degree 1. Evidence: src/lib/api.js:non_striker_id, src/lib/api.js:calls
- `not` [HIGH] from `src/lib/api.js` in `subsystem-0-0-src-lib`. Ranked as an entrypoint because it is tagged or named like a runtime root and has degree 1. Evidence: src/lib/api.js:not, src/lib/api.js:calls, src/lib/api.js:calls
- `on` [HIGH] from `src/lib/api.js` in `subsystem-0-0-src-lib`. Ranked as an entrypoint because it is tagged or named like a runtime root and has degree 1. Evidence: src/lib/api.js:on, src/lib/api.js:calls
- `order` [HIGH] from `src/lib/api.js` in `subsystem-0-0-src-lib`. Ranked as an entrypoint because it is tagged or named like a runtime root and has degree 1. Evidence: src/lib/api.js:order, src/lib/api.js:calls, src/lib/api.js:calls
- `participatingTeams.map` [HIGH] from `src/lib/api.js` in `subsystem-0-0-src-lib`. Ranked as an entrypoint because it is tagged or named like a runtime root and has degree 1. Evidence: src/lib/api.js:participatingTeams.map, src/lib/api.js:calls, src/lib/api.js:calls
- `persistMatchSetup` [HIGH] from `src/lib/api.js` in `subsystem-0-0-src-lib`. Ranked as an entrypoint because it is tagged or named like a runtime root and has degree 1. Evidence: src/lib/api.js:persistMatchSetup, src/lib/api.js:calls
- `player_id` [HIGH] from `src/lib/api.js` in `subsystem-0-0-src-lib`. Ranked as an entrypoint because it is tagged or named like a runtime root and has degree 1. Evidence: src/lib/api.js:player_id, src/lib/api.js:calls, src/lib/api.js:calls
- `processMatches()` [HIGH] from `src/lib/api.js` in `subsystem-0-0-src-lib`. Ranked as an entrypoint because it is tagged or named like a runtime root and has degree 5. Evidence: src/lib/api.js:processMatches(), src/lib/api.js:calls, src/lib/api.js:calls
- `rebuildTeams` [HIGH] from `src/lib/api.js` in `subsystem-0-0-src-lib`. Ranked as an entrypoint because it is tagged or named like a runtime root and has degree 1. Evidence: src/lib/api.js:rebuildTeams, src/lib/api.js:calls
- `registerPlayer` [HIGH] from `src/lib/api.js` in `subsystem-0-0-src-lib`. Ranked as an entrypoint because it is tagged or named like a runtime root and has degree 1. Evidence: src/lib/api.js:registerPlayer, src/lib/api.js:calls
- `registrations.map` [HIGH] from `src/lib/api.js` in `subsystem-0-0-src-lib`. Ranked as an entrypoint because it is tagged or named like a runtime root and has degree 1. Evidence: src/lib/api.js:registrations.map, src/lib/api.js:calls
- `resetUserPassword` [HIGH] from `src/lib/api.js` in `subsystem-0-0-src-lib`. Ranked as an entrypoint because it is tagged or named like a runtime root and has degree 1. Evidence: src/lib/api.js:resetUserPassword, src/lib/api.js:calls
- `restoreItem` [HIGH] from `src/lib/api.js` in `subsystem-0-0-src-lib`. Ranked as an entrypoint because it is tagged or named like a runtime root and has degree 1. Evidence: src/lib/api.js:restoreItem, src/lib/api.js:calls
- `select` [HIGH] from `src/lib/api.js` in `subsystem-0-0-src-lib`. Ranked as an entrypoint because it is tagged or named like a runtime root and has degree 8. Evidence: src/lib/api.js:select, src/lib/api.js:calls, src/lib/api.js:calls
- `selectedPlayerIds.map` [HIGH] from `src/lib/api.js` in `subsystem-0-0-src-lib`. Ranked as an entrypoint because it is tagged or named like a runtime root and has degree 1. Evidence: src/lib/api.js:selectedPlayerIds.map, src/lib/api.js:calls, src/lib/api.js:calls
- `selection_decisions` [HIGH] from `src/lib/api.js` in `subsystem-0-0-src-lib`. Ranked as an entrypoint because it is tagged or named like a runtime root and has degree 1. Evidence: src/lib/api.js:selection_decisions, src/lib/api.js:calls
- `selector_assignments` [HIGH] from `src/lib/api.js` in `subsystem-0-0-src-lib`. Ranked as an entrypoint because it is tagged or named like a runtime root and has degree 1. Evidence: src/lib/api.js:selector_assignments, src/lib/api.js:calls
- `setActiveSeason` [HIGH] from `src/lib/api.js` in `subsystem-0-0-src-lib`. Ranked as an entrypoint because it is tagged or named like a runtime root and has degree 1. Evidence: src/lib/api.js:setActiveSeason, src/lib/api.js:calls
- `single` [HIGH] from `src/lib/api.js` in `subsystem-0-0-src-lib`. Ranked as an entrypoint because it is tagged or named like a runtime root and has degree 2. Evidence: src/lib/api.js:single, src/lib/api.js:calls, src/lib/api.js:calls
- `src/lib/api.js` [HIGH] from `src/lib/api.js` in `subsystem-0-0-src-lib`. Ranked as an entrypoint because it is tagged or named like a runtime root and has degree 128. Evidence: src/lib/api.js:src/lib/api.js, src/components/screens/AdministrationScreen.jsx:imports, src/components/screens/MatchResultScreen.jsx:imports
- `striker_id` [HIGH] from `src/lib/api.js` in `subsystem-0-0-src-lib`. Ranked as an entrypoint because it is tagged or named like a runtime root and has degree 1. Evidence: src/lib/api.js:striker_id, src/lib/api.js:calls, src/lib/api.js:calls
- `supabase.from` [HIGH] from `src/lib/api.js` in `subsystem-0-0-src-lib`. Ranked as an entrypoint because it is tagged or named like a runtime root and has degree 5. Evidence: src/lib/api.js:supabase.from, src/lib/api.js:calls, src/lib/api.js:calls
- `teamsToInsert.filter` [HIGH] from `src/lib/api.js` in `subsystem-0-0-src-lib`. Ranked as an entrypoint because it is tagged or named like a runtime root and has degree 1. Evidence: src/lib/api.js:teamsToInsert.filter, src/lib/api.js:calls
- `teamsToInsert.push` [HIGH] from `src/lib/api.js` in `subsystem-0-0-src-lib`. Ranked as an entrypoint because it is tagged or named like a runtime root and has degree 1. Evidence: src/lib/api.js:teamsToInsert.push, src/lib/api.js:calls
- `this.getActiveSeason` [HIGH] from `src/lib/api.js` in `subsystem-0-0-src-lib`. Ranked as an entrypoint because it is tagged or named like a runtime root and has degree 1. Evidence: src/lib/api.js:this.getActiveSeason, src/lib/api.js:calls, src/lib/api.js:calls
- `this.getDefaults` [HIGH] from `src/lib/api.js` in `subsystem-0-0-src-lib`. Ranked as an entrypoint because it is tagged or named like a runtime root and has degree 1. Evidence: src/lib/api.js:this.getDefaults, src/lib/api.js:calls, src/lib/api.js:calls
- `this.setActiveSeason` [HIGH] from `src/lib/api.js` in `subsystem-0-0-src-lib`. Ranked as an entrypoint because it is tagged or named like a runtime root and has degree 1. Evidence: src/lib/api.js:this.setActiveSeason, src/lib/api.js:calls
- `toISOString` [HIGH] from `src/lib/api.js` in `subsystem-0-0-src-lib`. Ranked as an entrypoint because it is tagged or named like a runtime root and has degree 1. Evidence: src/lib/api.js:toISOString, src/lib/api.js:calls, src/lib/api.js:calls
- `toLocaleDateString` [HIGH] from `src/lib/api.js` in `subsystem-0-0-src-lib`. Ranked as an entrypoint because it is tagged or named like a runtime root and has degree 2. Evidence: src/lib/api.js:toLocaleDateString, src/lib/api.js:calls, src/lib/api.js:calls
- `toLowerCase` [HIGH] from `src/lib/api.js` in `subsystem-0-0-src-lib`. Ranked as an entrypoint because it is tagged or named like a runtime root and has degree 1. Evidence: src/lib/api.js:toLowerCase, src/lib/api.js:calls, src/lib/api.js:calls
- `toggleCandidate` [HIGH] from `src/lib/api.js` in `subsystem-0-0-src-lib`. Ranked as an entrypoint because it is tagged or named like a runtime root and has degree 1. Evidence: src/lib/api.js:toggleCandidate, src/lib/api.js:calls
- `update` [HIGH] from `src/lib/api.js` in `subsystem-0-0-src-lib`. Ranked as an entrypoint because it is tagged or named like a runtime root and has degree 1. Evidence: src/lib/api.js:update, src/lib/api.js:calls, src/lib/api.js:calls
- `updateSelectorAssignments` [HIGH] from `src/lib/api.js` in `subsystem-0-0-src-lib`. Ranked as an entrypoint because it is tagged or named like a runtime root and has degree 1. Evidence: src/lib/api.js:updateSelectorAssignments, src/lib/api.js:calls
- `updateTournament` [HIGH] from `src/lib/api.js` in `subsystem-0-0-src-lib`. Ranked as an entrypoint because it is tagged or named like a runtime root and has degree 1. Evidence: src/lib/api.js:updateTournament, src/lib/api.js:calls
- `updateUserPermissions` [HIGH] from `src/lib/api.js` in `subsystem-0-0-src-lib`. Ranked as an entrypoint because it is tagged or named like a runtime root and has degree 1. Evidence: src/lib/api.js:updateUserPermissions, src/lib/api.js:calls
- `updateUserRole` [HIGH] from `src/lib/api.js` in `subsystem-0-0-src-lib`. Ranked as an entrypoint because it is tagged or named like a runtime root and has degree 1. Evidence: src/lib/api.js:updateUserRole, src/lib/api.js:calls
- `updateUserStatus` [HIGH] from `src/lib/api.js` in `subsystem-0-0-src-lib`. Ranked as an entrypoint because it is tagged or named like a runtime root and has degree 1. Evidence: src/lib/api.js:updateUserStatus, src/lib/api.js:calls
- `upsert` [HIGH] from `src/lib/api.js` in `subsystem-0-0-src-lib`. Ranked as an entrypoint because it is tagged or named like a runtime root and has degree 1. Evidence: src/lib/api.js:upsert, src/lib/api.js:calls
- `api.finalizeMatch` [HIGH] from `src/context/CricketContext.jsx` in `subsystem-1-0-src-context`. Ranked as an entrypoint because it is tagged or named like a runtime root and has degree 1. Evidence: src/context/CricketContext.jsx:api.finalizeMatch, src/context/CricketContext.jsx:calls
- `api.getSelectionCandidates` [HIGH] from `src/context/CricketContext.jsx` in `subsystem-1-0-src-context`. Ranked as an entrypoint because it is tagged or named like a runtime root and has degree 1. Evidence: src/context/CricketContext.jsx:api.getSelectionCandidates, src/context/CricketContext.jsx:calls
- `api.hydrateLiveMatch` [HIGH] from `src/context/CricketContext.jsx` in `subsystem-1-0-src-context`. Ranked as an entrypoint because it is tagged or named like a runtime root and has degree 1. Evidence: src/context/CricketContext.jsx:api.hydrateLiveMatch, src/context/CricketContext.jsx:calls
- `api.toggleCandidate` [HIGH] from `src/context/CricketContext.jsx` in `subsystem-1-0-src-context`. Ranked as an entrypoint because it is tagged or named like a runtime root and has degree 1. Evidence: src/context/CricketContext.jsx:api.toggleCandidate, src/context/CricketContext.jsx:calls
- `handleRetireBatter()` [HIGH] from `src/context/CricketContext.jsx` in `subsystem-1-0-src-context`. Ranked as an entrypoint because it is tagged or named like a runtime root and has degree 5. Evidence: src/context/CricketContext.jsx:handleRetireBatter(), src/context/CricketContext.jsx:contains, src/context/CricketContext.jsx:calls
- `markScoringFirstRunDone()` [HIGH] from `src/context/CricketContext.jsx` in `subsystem-1-0-src-context`. Ranked as an entrypoint because it is tagged or named like a runtime root and has degree 4. Evidence: src/context/CricketContext.jsx:markScoringFirstRunDone(), src/context/CricketContext.jsx:contains, temp_extraction/src/context/CricketContext.jsx:contains
- `recordRuns()` [HIGH] from `src/context/CricketContext.jsx` in `subsystem-1-0-src-context`. Ranked as an entrypoint because it is tagged or named like a runtime root and has degree 8. Evidence: src/context/CricketContext.jsx:recordRuns(), src/context/CricketContext.jsx:contains, temp_extraction/src/context/CricketContext.jsx:contains
- `setRuns` [HIGH] from `src/context/CricketContext.jsx` in `subsystem-1-0-src-context`. Ranked as an entrypoint because it is tagged or named like a runtime root and has degree 4. Evidence: src/context/CricketContext.jsx:setRuns, src/context/CricketContext.jsx:calls, temp_extraction/src/context/CricketContext.jsx:calls
- `../../lib/api` [HIGH] from `clean.cjs` in `subsystem-10-0-clean-cjs`. Ranked as an entrypoint because it is tagged or named like a runtime root and has degree 1. Evidence: clean.cjs:../../lib/api, clean.cjs:imports
- `createClient` [HIGH] from `test-batting.cjs` in `subsystem-10-0-clean-cjs`. Ranked as an entrypoint because it is tagged or named like a runtime root and has degree 4. Evidence: test-batting.cjs:createClient, test-batting.cjs:calls, test-players3.cjs:calls
- `api.deletePlayer` [HIGH] from `src/components/screens/PlayerProfileScreen.jsx` in `subsystem-105-0-src-components`. Ranked as an entrypoint because it is tagged or named like a runtime root and has degree 1. Evidence: src/components/screens/PlayerProfileScreen.jsx:api.deletePlayer, src/components/screens/PlayerProfileScreen.jsx:calls
- `temp_extraction/src/App.jsx` [HIGH] from `temp_extraction/src/App.jsx` in `subsystem-131-0-temp-extraction`. Ranked as an entrypoint because it is tagged or named like a runtime root and has degree 32. Evidence: temp_extraction/src/App.jsx:temp_extraction/src/App.jsx, temp_extraction/src/App.jsx:calls, temp_extraction/src/App.jsx:contains
- `temp_extraction/src/components/ProtectedRoute.jsx` [HIGH] from `temp_extraction/src/components/ProtectedRoute.jsx` in `subsystem-134-0-temp-extraction`. Ranked as an entrypoint because it is tagged or named like a runtime root and has degree 8. Evidence: temp_extraction/src/components/ProtectedRoute.jsx:temp_extraction/src/components/ProtectedRoute.jsx, temp_extraction/src/App.jsx:imports, temp_extraction/src/components/ProtectedRoute.jsx:calls
- `useLocation` [HIGH] from `src/App.jsx` in `subsystem-149-0-src-app-jsx`. Ranked as an entrypoint because it is tagged or named like a runtime root and has degree 3. Evidence: src/App.jsx:useLocation, src/context/CricketContext.jsx:calls, temp_extraction/src/context/CricketContext.jsx:calls
- `webpush.setVapidDetails` [HIGH] from `supabase/functions/send-push/index.ts` in `subsystem-17-0-supabase`. Ranked as an entrypoint because it is tagged or named like a runtime root and has degree 1. Evidence: supabase/functions/send-push/index.ts:webpush.setVapidDetails, supabase/functions/send-push/index.ts:calls
- `QUICK_RUNS.map` [HIGH] from `src/components/screens/ScoringScreen.jsx` in `subsystem-2-0-src-components`. Ranked as an entrypoint because it is tagged or named like a runtime root and has degree 2. Evidence: src/components/screens/ScoringScreen.jsx:QUICK_RUNS.map, src/components/screens/ScoringScreen.jsx:calls, temp_extraction/src/components/screens/ScoringScreen.jsx:calls
- `doRun()` [HIGH] from `src/components/screens/ScoringScreen.jsx` in `subsystem-2-0-src-components`. Ranked as an entrypoint because it is tagged or named like a runtime root and has degree 4. Evidence: src/components/screens/ScoringScreen.jsx:doRun(), src/components/screens/ScoringScreen.jsx:calls, src/components/screens/ScoringScreen.jsx:contains
- `handleRetireBatter` [HIGH] from `src/components/screens/ScoringScreen.jsx` in `subsystem-2-0-src-components`. Ranked as an entrypoint because it is tagged or named like a runtime root and has degree 1. Evidence: src/components/screens/ScoringScreen.jsx:handleRetireBatter, src/components/screens/ScoringScreen.jsx:calls
- `api.getDefaults` [HIGH] from `src/components/screens/TeamRegistrationTab.jsx` in `subsystem-21-0-src-components`. Ranked as an entrypoint because it is tagged or named like a runtime root and has degree 1. Evidence: src/components/screens/TeamRegistrationTab.jsx:api.getDefaults, src/components/screens/TeamRegistrationTab.jsx:calls
- `ErrorBoundary` [HIGH] from `src/main.jsx` in `subsystem-25-0-src-main-jsx`. Ranked as an entrypoint because it is tagged or named like a runtime root and has degree 7. Evidence: src/main.jsx:ErrorBoundary, src/main.jsx:contains, temp_extraction/src/main.jsx:contains
- `ErrorBoundary.componentDidCatch()` [HIGH] from `src/main.jsx` in `subsystem-25-0-src-main-jsx`. Ranked as an entrypoint because it is tagged or named like a runtime root and has degree 2. Evidence: src/main.jsx:ErrorBoundary.componentDidCatch(), src/main.jsx:contains, temp_extraction/src/main.jsx:contains
- `ErrorBoundary.render()` [HIGH] from `src/main.jsx` in `subsystem-25-0-src-main-jsx`. Ranked as an entrypoint because it is tagged or named like a runtime root and has degree 5. Evidence: src/main.jsx:ErrorBoundary.render(), src/main.jsx:calls, temp_extraction/src/main.jsx:calls
- `ErrorBoundary.return()` [HIGH] from `src/main.jsx` in `subsystem-25-0-src-main-jsx`. Ranked as an entrypoint because it is tagged or named like a runtime root and has degree 1. Evidence: src/main.jsx:ErrorBoundary.return(), src/main.jsx:contains, temp_extraction/src/main.jsx:contains
- `ErrorBoundary.super()` [HIGH] from `src/main.jsx` in `subsystem-25-0-src-main-jsx`. Ranked as an entrypoint because it is tagged or named like a runtime root and has degree 1. Evidence: src/main.jsx:ErrorBoundary.super(), src/main.jsx:calls, temp_extraction/src/main.jsx:calls
- `ReactDOM.createRoot` [HIGH] from `src/main.jsx` in `subsystem-25-0-src-main-jsx`. Ranked as an entrypoint because it is tagged or named like a runtime root and has degree 2. Evidence: src/main.jsx:ReactDOM.createRoot, src/main.jsx:calls, temp_extraction/src/main.jsx:calls
- `constructor` [HIGH] from `src/main.jsx` in `subsystem-25-0-src-main-jsx`. Ranked as an entrypoint because it is tagged or named like a runtime root and has degree 1. Evidence: src/main.jsx:constructor, src/main.jsx:calls, temp_extraction/src/main.jsx:calls
- `document.getElementById` [HIGH] from `src/main.jsx` in `subsystem-25-0-src-main-jsx`. Ranked as an entrypoint because it is tagged or named like a runtime root and has degree 2. Evidence: src/main.jsx:document.getElementById, src/main.jsx:calls, temp_extraction/src/main.jsx:calls
- `error.toString` [HIGH] from `src/main.jsx` in `subsystem-25-0-src-main-jsx`. Ranked as an entrypoint because it is tagged or named like a runtime root and has degree 1. Evidence: src/main.jsx:error.toString, src/main.jsx:calls, temp_extraction/src/main.jsx:calls
- `getDerivedStateFromError` [HIGH] from `src/main.jsx` in `subsystem-25-0-src-main-jsx`. Ranked as an entrypoint because it is tagged or named like a runtime root and has degree 1. Evidence: src/main.jsx:getDerivedStateFromError, src/main.jsx:calls, temp_extraction/src/main.jsx:calls
- `onNeedRefresh` [HIGH] from `src/main.jsx` in `subsystem-25-0-src-main-jsx`. Ranked as an entrypoint because it is tagged or named like a runtime root and has degree 1. Evidence: src/main.jsx:onNeedRefresh, src/main.jsx:calls
- `onOfflineReady` [HIGH] from `src/main.jsx` in `subsystem-25-0-src-main-jsx`. Ranked as an entrypoint because it is tagged or named like a runtime root and has degree 1. Evidence: src/main.jsx:onOfflineReady, src/main.jsx:calls
- `react-dom/client` [HIGH] from `src/main.jsx` in `subsystem-25-0-src-main-jsx`. Ranked as an entrypoint because it is tagged or named like a runtime root and has degree 2. Evidence: src/main.jsx:react-dom/client, src/main.jsx:imports, temp_extraction/src/main.jsx:imports
- `registerSW` [HIGH] from `src/main.jsx` in `subsystem-25-0-src-main-jsx`. Ranked as an entrypoint because it is tagged or named like a runtime root and has degree 1. Evidence: src/main.jsx:registerSW, src/main.jsx:calls
- `src/main.jsx` [HIGH] from `src/main.jsx` in `subsystem-25-0-src-main-jsx`. Ranked as an entrypoint because it is tagged or named like a runtime root and has degree 14. Evidence: src/main.jsx:src/main.jsx, src/main.jsx:calls, src/main.jsx:calls
- `temp_extraction/src/main.jsx` [HIGH] from `temp_extraction/src/main.jsx` in `subsystem-25-0-src-main-jsx`. Ranked as an entrypoint because it is tagged or named like a runtime root and has degree 8. Evidence: temp_extraction/src/main.jsx:temp_extraction/src/main.jsx, temp_extraction/src/main.jsx:calls, temp_extraction/src/main.jsx:calls
- `updateSW` [HIGH] from `src/main.jsx` in `subsystem-25-0-src-main-jsx`. Ranked as an entrypoint because it is tagged or named like a runtime root and has degree 1. Evidence: src/main.jsx:updateSW, src/main.jsx:calls
- `virtual:pwa-register` [HIGH] from `src/main.jsx` in `subsystem-25-0-src-main-jsx`. Ranked as an entrypoint because it is tagged or named like a runtime root and has degree 1. Evidence: src/main.jsx:virtual:pwa-register, src/main.jsx:imports
- `createClient` [HIGH] from `apply-bug5-sql.js` in `subsystem-27-0-apply-bug5-sql-js`. Ranked as an entrypoint because it is tagged or named like a runtime root and has degree 8. Evidence: apply-bug5-sql.js:createClient, apply-bug5-sql.js:calls, delete_season.js:calls
- `run` [HIGH] from `apply-bug5-sql.js` in `subsystem-27-0-apply-bug5-sql-js`. Ranked as an entrypoint because it is tagged or named like a runtime root and has degree 4. Evidence: apply-bug5-sql.js:run, apply-bug5-sql.js:calls, apply-bug5-sql.js:calls
- `handleClick()` [HIGH] from `src/components/BottomNav.jsx` in `subsystem-29-0-src-components`. Ranked as an entrypoint because it is tagged or named like a runtime root and has degree 4. Evidence: src/components/BottomNav.jsx:handleClick(), src/components/BottomNav.jsx:contains, temp_extraction/src/components/BottomNav.jsx:contains
- `Runs` [HIGH] from `src/components/screens/MatchSetupScreen.jsx` in `subsystem-3-0-src-components`. Ranked as an entrypoint because it is tagged or named like a runtime root and has degree 2. Evidence: src/components/screens/MatchSetupScreen.jsx:Runs, src/components/screens/MatchSetupScreen.jsx:calls, temp_extraction/src/components/screens/MatchSetupScreen.jsx:calls
- `_0_20px_rgba` [HIGH] from `src/App.jsx` in `subsystem-3-0-src-components`. Ranked as an entrypoint because it is tagged or named like a runtime root and has degree 3. Evidence: src/App.jsx:_0_20px_rgba, src/components/screens/InningsInitScreen.jsx:calls, src/components/screens/MatchSetupScreen.jsx:calls
- `api.persistMatchSetup` [HIGH] from `src/components/screens/MatchSetupScreen.jsx` in `subsystem-3-0-src-components`. Ranked as an entrypoint because it is tagged or named like a runtime root and has degree 1. Evidence: src/components/screens/MatchSetupScreen.jsx:api.persistMatchSetup, src/components/screens/MatchSetupScreen.jsx:calls
- `api.getSelectionProcesses` [HIGH] from `src/components/screens/SelectorAssignmentModal.jsx` in `subsystem-31-0-src-components`. Ranked as an entrypoint because it is tagged or named like a runtime root and has degree 2. Evidence: src/components/screens/SelectorAssignmentModal.jsx:api.getSelectionProcesses, src/components/screens/SelectorAssignmentModal.jsx:calls, src/context/CricketContext.jsx:calls
- `api.getSelectorAssignments` [HIGH] from `src/components/screens/SelectorAssignmentModal.jsx` in `subsystem-31-0-src-components`. Ranked as an entrypoint because it is tagged or named like a runtime root and has degree 1. Evidence: src/components/screens/SelectorAssignmentModal.jsx:api.getSelectorAssignments, src/components/screens/SelectorAssignmentModal.jsx:calls
- `api.updateSelectorAssignments` [HIGH] from `src/components/screens/SelectorAssignmentModal.jsx` in `subsystem-31-0-src-components`. Ranked as an entrypoint because it is tagged or named like a runtime root and has degree 1. Evidence: src/components/screens/SelectorAssignmentModal.jsx:api.updateSelectorAssignments, src/components/screens/SelectorAssignmentModal.jsx:calls
- `handlePlayerClick()` [HIGH] from `src/components/screens/PlayersScreen.jsx` in `subsystem-32-0-src-components`. Ranked as an entrypoint because it is tagged or named like a runtime root and has degree 12. Evidence: src/components/screens/PlayersScreen.jsx:handlePlayerClick(), src/components/screens/PlayersScreen.jsx:calls, src/components/screens/PlayersScreen.jsx:contains
- `api.createSeason` [HIGH] from `src/components/screens/SeasonManagementTab.jsx` in `subsystem-34-0-src-components`. Ranked as an entrypoint because it is tagged or named like a runtime root and has degree 1. Evidence: src/components/screens/SeasonManagementTab.jsx:api.createSeason, src/components/screens/SeasonManagementTab.jsx:calls
- `api.getSeasons` [HIGH] from `src/components/screens/SeasonManagementTab.jsx` in `subsystem-34-0-src-components`. Ranked as an entrypoint because it is tagged or named like a runtime root and has degree 2. Evidence: src/components/screens/SeasonManagementTab.jsx:api.getSeasons, src/components/screens/SeasonManagementTab.jsx:calls, src/components/ui/TeamManagerModal.jsx:calls
- `api.setActiveSeason` [HIGH] from `src/components/screens/SeasonManagementTab.jsx` in `subsystem-34-0-src-components`. Ranked as an entrypoint because it is tagged or named like a runtime root and has degree 1. Evidence: src/components/screens/SeasonManagementTab.jsx:api.setActiveSeason, src/components/screens/SeasonManagementTab.jsx:calls
- `onRowClick` [HIGH] from `src/components/ui/DataTable.jsx` in `subsystem-36-0-src-components`. Ranked as an entrypoint because it is tagged or named like a runtime root and has degree 2. Evidence: src/components/ui/DataTable.jsx:onRowClick, src/components/ui/DataTable.jsx:calls, temp_extraction/src/components/ui/DataTable.jsx:calls
- `api.createAnnouncement` [HIGH] from `src/components/screens/NewsScreen.jsx` in `subsystem-39-0-src-components`. Ranked as an entrypoint because it is tagged or named like a runtime root and has degree 1. Evidence: src/components/screens/NewsScreen.jsx:api.createAnnouncement, src/components/screens/NewsScreen.jsx:calls
- `api.getRecycleBinItems` [HIGH] from `src/components/screens/RecycleBinTab.jsx` in `subsystem-40-0-src-components`. Ranked as an entrypoint because it is tagged or named like a runtime root and has degree 1. Evidence: src/components/screens/RecycleBinTab.jsx:api.getRecycleBinItems, src/components/screens/RecycleBinTab.jsx:calls
- `api.hardDeleteItem` [HIGH] from `src/components/screens/RecycleBinTab.jsx` in `subsystem-40-0-src-components`. Ranked as an entrypoint because it is tagged or named like a runtime root and has degree 1. Evidence: src/components/screens/RecycleBinTab.jsx:api.hardDeleteItem, src/components/screens/RecycleBinTab.jsx:calls
- `api.restoreItem` [HIGH] from `src/components/screens/RecycleBinTab.jsx` in `subsystem-40-0-src-components`. Ranked as an entrypoint because it is tagged or named like a runtime root and has degree 1. Evidence: src/components/screens/RecycleBinTab.jsx:api.restoreItem, src/components/screens/RecycleBinTab.jsx:calls
- `handleRestore()` [HIGH] from `src/components/screens/RecycleBinTab.jsx` in `subsystem-40-0-src-components`. Ranked as an entrypoint because it is tagged or named like a runtime root and has degree 9. Evidence: src/components/screens/RecycleBinTab.jsx:handleRestore(), src/components/screens/RecycleBinTab.jsx:calls, src/components/screens/RecycleBinTab.jsx:contains
- `api.getAnnouncements` [HIGH] from `src/context/CricketContext.jsx` in `subsystem-5-0-src-context`. Ranked as an entrypoint because it is tagged or named like a runtime root and has degree 1. Evidence: src/context/CricketContext.jsx:api.getAnnouncements, src/context/CricketContext.jsx:calls
- `api.getOrCreateInnings` [HIGH] from `src/context/CricketContext.jsx` in `subsystem-5-0-src-context`. Ranked as an entrypoint because it is tagged or named like a runtime root and has degree 1. Evidence: src/context/CricketContext.jsx:api.getOrCreateInnings, src/context/CricketContext.jsx:calls
- `App` [HIGH] from `src/App.jsx` in `subsystem-53-0-src-app-jsx`. Ranked as an entrypoint because it is tagged or named like a runtime root and has degree 2. Evidence: src/App.jsx:App, src/App.jsx:calls, temp_extraction/src/App.jsx:calls
- `MainApp()` [HIGH] from `src/App.jsx` in `subsystem-53-0-src-app-jsx`. Ranked as an entrypoint because it is tagged or named like a runtime root and has degree 6. Evidence: src/App.jsx:MainApp(), src/App.jsx:contains, temp_extraction/src/App.jsx:contains
- `RootRedirect()` [HIGH] from `src/App.jsx` in `subsystem-53-0-src-app-jsx`. Ranked as an entrypoint because it is tagged or named like a runtime root and has degree 3. Evidence: src/App.jsx:RootRedirect(), src/App.jsx:contains, temp_extraction/src/App.jsx:contains
- `drawer` [HIGH] from `src/App.jsx` in `subsystem-53-0-src-app-jsx`. Ranked as an entrypoint because it is tagged or named like a runtime root and has degree 1. Evidence: src/App.jsx:drawer, src/App.jsx:calls, temp_extraction/src/App.jsx:calls
- `motion/react` [HIGH] from `src/App.jsx` in `subsystem-53-0-src-app-jsx`. Ranked as an entrypoint because it is tagged or named like a runtime root and has degree 19. Evidence: src/App.jsx:motion/react, src/App.jsx:imports, src/components/AnimatedPage.jsx:imports
- `react` [HIGH] from `src/App.jsx` in `subsystem-53-0-src-app-jsx`. Ranked as an entrypoint because it is tagged or named like a runtime root and has degree 105. Evidence: src/App.jsx:react, src/App.jsx:imports, src/components/AnimatedPage.jsx:imports
- `react-router-dom` [HIGH] from `src/App.jsx` in `subsystem-53-0-src-app-jsx`. Ranked as an entrypoint because it is tagged or named like a runtime root and has degree 6. Evidence: src/App.jsx:react-router-dom, src/App.jsx:imports, src/components/ProtectedRoute.jsx:imports
- `src/App.jsx` [HIGH] from `src/App.jsx` in `subsystem-53-0-src-app-jsx`. Ranked as an entrypoint because it is tagged or named like a runtime root and has degree 37. Evidence: src/App.jsx:src/App.jsx, src/App.jsx:calls, src/App.jsx:contains
- `useCricket` [HIGH] from `src/App.jsx` in `subsystem-53-0-src-app-jsx`. Ranked as an entrypoint because it is tagged or named like a runtime root and has degree 61. Evidence: src/App.jsx:useCricket, src/components/BottomNav.jsx:calls, src/components/DrawerMenu.jsx:calls
- `api.getPlayerMatchStats` [HIGH] from `src/components/screens/PlayerProfileScreen.jsx` in `subsystem-56-0-src-components`. Ranked as an entrypoint because it is tagged or named like a runtime root and has degree 1. Evidence: src/components/screens/PlayerProfileScreen.jsx:api.getPlayerMatchStats, src/components/screens/PlayerProfileScreen.jsx:calls
- `api.assignScorer` [HIGH] from `src/components/screens/MatchDetailScreen.jsx` in `subsystem-61-0-src-components`. Ranked as an entrypoint because it is tagged or named like a runtime root and has degree 1. Evidence: src/components/screens/MatchDetailScreen.jsx:api.assignScorer, src/components/screens/MatchDetailScreen.jsx:calls
- `api.deleteMatch` [HIGH] from `src/components/screens/MatchDetailScreen.jsx` in `subsystem-61-0-src-components`. Ranked as an entrypoint because it is tagged or named like a runtime root and has degree 1. Evidence: src/components/screens/MatchDetailScreen.jsx:api.deleteMatch, src/components/screens/MatchDetailScreen.jsx:calls
- `balls.forEach` [HIGH] from `src/lib/api.js` in `subsystem-67-0-src-lib`. Ranked as an entrypoint because it is tagged or named like a runtime root and has degree 1. Evidence: src/lib/api.js:balls.forEach, src/lib/api.js:calls
- `computeInningsStats()` [HIGH] from `src/lib/api.js` in `subsystem-67-0-src-lib`. Ranked as an entrypoint because it is tagged or named like a runtime root and has degree 9. Evidence: src/lib/api.js:computeInningsStats(), src/lib/api.js:calls, src/lib/api.js:calls
- `deliveries.filter` [HIGH] from `src/lib/api.js` in `subsystem-67-0-src-lib`. Ranked as an entrypoint because it is tagged or named like a runtime root and has degree 1. Evidence: src/lib/api.js:deliveries.filter, src/lib/api.js:calls
- `filter` [HIGH] from `src/lib/api.js` in `subsystem-67-0-src-lib`. Ranked as an entrypoint because it is tagged or named like a runtime root and has degree 2. Evidence: src/lib/api.js:filter, src/lib/api.js:calls, src/lib/api.js:calls
- `match` [HIGH] from `src/lib/api.js` in `subsystem-67-0-src-lib`. Ranked as an entrypoint because it is tagged or named like a runtime root and has degree 2. Evidence: src/lib/api.js:match, src/lib/api.js:calls, temp_extraction/src/engine/matchSummaryEngine.js:calls
- `replace` [HIGH] from `src/lib/api.js` in `subsystem-67-0-src-lib`. Ranked as an entrypoint because it is tagged or named like a runtime root and has degree 2. Evidence: src/lib/api.js:replace, temp_extraction/src/engine/matchSummaryEngine.js:calls, src/lib/api.js:calls
- `wicket_type.toLowerCase` [HIGH] from `src/lib/api.js` in `subsystem-67-0-src-lib`. Ranked as an entrypoint because it is tagged or named like a runtime root and has degree 1. Evidence: src/lib/api.js:wicket_type.toLowerCase, src/lib/api.js:calls
- `api.deleteUser` [HIGH] from `src/components/screens/AdministrationScreen.jsx` in `subsystem-7-0-src-components`. Ranked as an entrypoint because it is tagged or named like a runtime root and has degree 1. Evidence: src/components/screens/AdministrationScreen.jsx:api.deleteUser, src/components/screens/AdministrationScreen.jsx:calls
- `api.getProfiles` [HIGH] from `src/components/screens/AdministrationScreen.jsx` in `subsystem-7-0-src-components`. Ranked as an entrypoint because it is tagged or named like a runtime root and has degree 3. Evidence: src/components/screens/AdministrationScreen.jsx:api.getProfiles, src/components/screens/AdministrationScreen.jsx:calls, src/components/screens/AdministrationScreen.jsx:calls
- `api.resetUserPassword` [HIGH] from `src/components/screens/AdministrationScreen.jsx` in `subsystem-7-0-src-components`. Ranked as an entrypoint because it is tagged or named like a runtime root and has degree 1. Evidence: src/components/screens/AdministrationScreen.jsx:api.resetUserPassword, src/components/screens/AdministrationScreen.jsx:calls
- `api.updateUserPermissions` [HIGH] from `src/components/screens/AdministrationScreen.jsx` in `subsystem-7-0-src-components`. Ranked as an entrypoint because it is tagged or named like a runtime root and has degree 1. Evidence: src/components/screens/AdministrationScreen.jsx:api.updateUserPermissions, src/components/screens/AdministrationScreen.jsx:calls
- `api.updateUserRole` [HIGH] from `src/components/screens/AdministrationScreen.jsx` in `subsystem-7-0-src-components`. Ranked as an entrypoint because it is tagged or named like a runtime root and has degree 2. Evidence: src/components/screens/AdministrationScreen.jsx:api.updateUserRole, src/components/screens/AdministrationScreen.jsx:calls, src/components/screens/AdministrationScreen.jsx:calls
- `api.updateUserStatus` [HIGH] from `src/components/screens/AdministrationScreen.jsx` in `subsystem-7-0-src-components`. Ranked as an entrypoint because it is tagged or named like a runtime root and has degree 1. Evidence: src/components/screens/AdministrationScreen.jsx:api.updateUserStatus, src/components/screens/AdministrationScreen.jsx:calls
- `handleResetPassword()` [HIGH] from `src/components/screens/AdministrationScreen.jsx` in `subsystem-7-0-src-components`. Ranked as an entrypoint because it is tagged or named like a runtime root and has degree 11. Evidence: src/components/screens/AdministrationScreen.jsx:handleResetPassword(), src/components/screens/AdministrationScreen.jsx:contains, src/components/screens/AdministrationScreen.jsx:calls
- `handleRoleChange()` [HIGH] from `src/components/screens/AdministrationScreen.jsx` in `subsystem-7-0-src-components`. Ranked as an entrypoint because it is tagged or named like a runtime root and has degree 9. Evidence: src/components/screens/AdministrationScreen.jsx:handleRoleChange(), src/components/screens/AdministrationScreen.jsx:calls, src/components/screens/AdministrationScreen.jsx:contains
- `api.bulkMigratePlayers` [HIGH] from `src/components/screens/SeasonMigrationTab.jsx` in `subsystem-8-0-src-components`. Ranked as an entrypoint because it is tagged or named like a runtime root and has degree 2. Evidence: src/components/screens/SeasonMigrationTab.jsx:api.bulkMigratePlayers, src/components/screens/SeasonMigrationTab.jsx:calls, src/components/screens/SeasonMigrationTab.jsx:calls
- `api.getAgeCategories` [HIGH] from `src/components/screens/SeasonMigrationTab.jsx` in `subsystem-8-0-src-components`. Ranked as an entrypoint because it is tagged or named like a runtime root and has degree 1. Evidence: src/components/screens/SeasonMigrationTab.jsx:api.getAgeCategories, src/components/screens/SeasonMigrationTab.jsx:calls
- `api.getPlayersBySeason` [HIGH] from `src/components/screens/SeasonMigrationTab.jsx` in `subsystem-8-0-src-components`. Ranked as an entrypoint because it is tagged or named like a runtime root and has degree 2. Evidence: src/components/screens/SeasonMigrationTab.jsx:api.getPlayersBySeason, src/components/screens/SeasonMigrationTab.jsx:calls, src/components/screens/SeasonMigrationTab.jsx:calls
- `handleRemoveSingle()` [HIGH] from `src/components/screens/SeasonMigrationTab.jsx` in `subsystem-8-0-src-components`. Ranked as an entrypoint because it is tagged or named like a runtime root and has degree 7. Evidence: src/components/screens/SeasonMigrationTab.jsx:handleRemoveSingle(), src/components/screens/SeasonMigrationTab.jsx:calls, src/components/screens/SeasonMigrationTab.jsx:contains
- `api.assignManOfTheMatch` [HIGH] from `src/components/screens/MatchResultScreen.jsx` in `subsystem-80-0-src-components`. Ranked as an entrypoint because it is tagged or named like a runtime root and has degree 1. Evidence: src/components/screens/MatchResultScreen.jsx:api.assignManOfTheMatch, src/components/screens/MatchResultScreen.jsx:calls
- `api.getMatchScorecard` [HIGH] from `src/components/screens/MatchResultScreen.jsx` in `subsystem-80-0-src-components`. Ranked as an entrypoint because it is tagged or named like a runtime root and has degree 3. Evidence: src/components/screens/MatchResultScreen.jsx:api.getMatchScorecard, src/components/screens/MatchResultScreen.jsx:calls, src/components/screens/MatchResultScreen.jsx:calls
- `api.createDetailedMatches` [HIGH] from `src/components/screens/TournamentsScreen.jsx` in `subsystem-81-0-src-components`. Ranked as an entrypoint because it is tagged or named like a runtime root and has degree 2. Evidence: src/components/screens/TournamentsScreen.jsx:api.createDetailedMatches, src/components/screens/TournamentsScreen.jsx:calls, src/components/ui/TournamentManagerModal.jsx:calls
- `api.createTournament` [HIGH] from `src/components/screens/TournamentsScreen.jsx` in `subsystem-81-0-src-components`. Ranked as an entrypoint because it is tagged or named like a runtime root and has degree 2. Evidence: src/components/screens/TournamentsScreen.jsx:api.createTournament, src/components/screens/TournamentsScreen.jsx:calls, src/components/ui/TournamentManagerModal.jsx:calls
- `api.deleteTournament` [HIGH] from `src/components/screens/TournamentsScreen.jsx` in `subsystem-81-0-src-components`. Ranked as an entrypoint because it is tagged or named like a runtime root and has degree 1. Evidence: src/components/screens/TournamentsScreen.jsx:api.deleteTournament, src/components/screens/TournamentsScreen.jsx:calls
- `api.updateTournament` [HIGH] from `src/components/screens/TournamentsScreen.jsx` in `subsystem-81-0-src-components`. Ranked as an entrypoint because it is tagged or named like a runtime root and has degree 2. Evidence: src/components/screens/TournamentsScreen.jsx:api.updateTournament, src/components/screens/TournamentsScreen.jsx:calls, src/components/ui/TournamentManagerModal.jsx:calls
- `ProtectedRoute` [HIGH] from `src/components/ProtectedRoute.jsx` in `subsystem-83-0-src-components`. Ranked as an entrypoint because it is tagged or named like a runtime root and has degree 2. Evidence: src/components/ProtectedRoute.jsx:ProtectedRoute, src/components/ProtectedRoute.jsx:calls, temp_extraction/src/components/ProtectedRoute.jsx:calls
- `allowed.includes` [HIGH] from `src/components/ProtectedRoute.jsx` in `subsystem-83-0-src-components`. Ranked as an entrypoint because it is tagged or named like a runtime root and has degree 1. Evidence: src/components/ProtectedRoute.jsx:allowed.includes, src/components/ProtectedRoute.jsx:calls, temp_extraction/src/components/ProtectedRoute.jsx:calls
- `roleCanAccess()` [HIGH] from `src/components/ProtectedRoute.jsx` in `subsystem-83-0-src-components`. Ranked as an entrypoint because it is tagged or named like a runtime root and has degree 3. Evidence: src/components/ProtectedRoute.jsx:roleCanAccess(), src/components/ProtectedRoute.jsx:calls, src/components/ProtectedRoute.jsx:contains
- `src/components/ProtectedRoute.jsx` [HIGH] from `src/components/ProtectedRoute.jsx` in `subsystem-83-0-src-components`. Ranked as an entrypoint because it is tagged or named like a runtime root and has degree 8. Evidence: src/components/ProtectedRoute.jsx:src/components/ProtectedRoute.jsx, src/App.jsx:imports, src/components/ProtectedRoute.jsx:calls
- `api.rebuildTeams` [HIGH] from `src/components/screens/TeamsScreen.jsx` in `subsystem-90-0-src-components`. Ranked as an entrypoint because it is tagged or named like a runtime root and has degree 1. Evidence: src/components/screens/TeamsScreen.jsx:api.rebuildTeams, src/components/screens/TeamsScreen.jsx:calls
- `handleRebuildTeams()` [HIGH] from `src/components/screens/TeamsScreen.jsx` in `subsystem-90-0-src-components`. Ranked as an entrypoint because it is tagged or named like a runtime root and has degree 8. Evidence: src/components/screens/TeamsScreen.jsx:handleRebuildTeams(), src/components/screens/TeamsScreen.jsx:contains, src/components/screens/TeamsScreen.jsx:calls
- `api.finalizeSquad` [HIGH] from `src/context/CricketContext.jsx` in `subsystem-92-0-src-context`. Ranked as an entrypoint because it is tagged or named like a runtime root and has degree 1. Evidence: src/context/CricketContext.jsx:api.finalizeSquad, src/context/CricketContext.jsx:calls
- `setScoringFirstRunDone` [MEDIUM] from `src/context/CricketContext.jsx` in `subsystem-1-0-src-context`. Ranked as an entrypoint because it is tagged or named like a runtime root and has degree 1. Evidence: src/context/CricketContext.jsx:setScoringFirstRunDone, src/context/CricketContext.jsx:calls, temp_extraction/src/context/CricketContext.jsx:calls
- `runTest` [MEDIUM] from `test-stats.js` in `subsystem-101-0-test-stats-js`. Ranked as an entrypoint because it is tagged or named like a runtime root and has degree 1. Evidence: test-stats.js:runTest, test-stats.js:calls, test-stats.js:calls
- `runs` [MEDIUM] from `test-stats.js` in `subsystem-101-0-test-stats-js`. Ranked as an entrypoint because it is tagged or named like a runtime root and has degree 1. Evidence: test-stats.js:runs, test-stats.js:calls
- `createClient` [MEDIUM] from `supabase/functions/send-push/index.ts` in `subsystem-17-0-supabase`. Ranked as an entrypoint because it is tagged or named like a runtime root and has degree 1. Evidence: supabase/functions/send-push/index.ts:createClient, supabase/functions/send-push/index.ts:calls
- `https://deno.land/std@0.168.0/http/server.ts` [MEDIUM] from `supabase/functions/send-push/index.ts` in `subsystem-17-0-supabase`. Ranked as an entrypoint because it is tagged or named like a runtime root and has degree 1. Evidence: supabase/functions/send-push/index.ts:https://deno.land/std@0.168.0/http/server.ts, supabase/functions/send-push/index.ts:imports
- `serve` [MEDIUM] from `supabase/functions/send-push/index.ts` in `subsystem-17-0-supabase`. Ranked as an entrypoint because it is tagged or named like a runtime root and has degree 1. Evidence: supabase/functions/send-push/index.ts:serve, supabase/functions/send-push/index.ts:calls
- `recordRuns` [MEDIUM] from `src/components/screens/ScoringScreen.jsx` in `subsystem-2-0-src-components`. Ranked as an entrypoint because it is tagged or named like a runtime root and has degree 1. Evidence: src/components/screens/ScoringScreen.jsx:recordRuns, src/components/screens/ScoringScreen.jsx:calls, temp_extraction/src/components/screens/ScoringScreen.jsx:calls
- `setRunOutPlayer` [MEDIUM] from `src/components/screens/ScoringScreen.jsx` in `subsystem-2-0-src-components`. Ranked as an entrypoint because it is tagged or named like a runtime root and has degree 1. Evidence: src/components/screens/ScoringScreen.jsx:setRunOutPlayer, src/components/screens/ScoringScreen.jsx:calls
- `client.focus` [MEDIUM] from `src/sw.js` in `subsystem-38-0-src-sw-js`. Ranked as an entrypoint because it is tagged or named like a runtime root and has degree 1. Evidence: src/sw.js:client.focus, src/sw.js:calls
- `clients.claim` [MEDIUM] from `src/sw.js` in `subsystem-38-0-src-sw-js`. Ranked as an entrypoint because it is tagged or named like a runtime root and has degree 1. Evidence: src/sw.js:clients.claim, src/sw.js:calls
- `clients.matchAll` [MEDIUM] from `src/sw.js` in `subsystem-38-0-src-sw-js`. Ranked as an entrypoint because it is tagged or named like a runtime root and has degree 1. Evidence: src/sw.js:clients.matchAll, src/sw.js:calls
- `clients.openWindow` [MEDIUM] from `src/sw.js` in `subsystem-38-0-src-sw-js`. Ranked as an entrypoint because it is tagged or named like a runtime root and has degree 1. Evidence: src/sw.js:clients.openWindow, src/sw.js:calls
- `clipboard.writeText` [MEDIUM] from `src/components/ui/MatchMediaReport.jsx` in `subsystem-58-0-src-components`. Ranked as an entrypoint because it is tagged or named like a runtime root and has degree 1. Evidence: src/components/ui/MatchMediaReport.jsx:clipboard.writeText, src/components/ui/MatchMediaReport.jsx:calls, temp_extraction/src/components/ui/MatchMediaReport.jsx:calls
- `RunsByMatchChart()` [MEDIUM] from `src/components/selection/PerformanceGraphs.jsx` in `subsystem-6-0-src-components`. Ranked as an entrypoint because it is tagged or named like a runtime root and has degree 1. Evidence: src/components/selection/PerformanceGraphs.jsx:RunsByMatchChart(), src/components/selection/PerformanceGraphs.jsx:contains
- `runsValues.reduce` [MEDIUM] from `src/components/selection/PerformanceGraphs.jsx` in `subsystem-6-0-src-components`. Ranked as an entrypoint because it is tagged or named like a runtime root and has degree 1. Evidence: src/components/selection/PerformanceGraphs.jsx:runsValues.reduce, src/components/selection/PerformanceGraphs.jsx:calls
- `createClient` [MEDIUM] from `src/components/screens/AdministrationScreen.jsx` in `subsystem-7-0-src-components`. Ranked as an entrypoint because it is tagged or named like a runtime root and has degree 1. Evidence: src/components/screens/AdministrationScreen.jsx:createClient, src/components/screens/AdministrationScreen.jsx:calls
- `onClick` [MEDIUM] from `src/components/ui/MatchCard.jsx` in `subsystem-79-0-src-components`. Ranked as an entrypoint because it is tagged or named like a runtime root and has degree 1. Evidence: src/components/ui/MatchCard.jsx:onClick, src/components/ui/MatchCard.jsx:calls

## External Dependencies

- `@supabase/supabase-js` [MEDIUM] used by `subsystem-10-0-clean-cjs`, `subsystem-27-0-apply-bug5-sql-js`, `subsystem-7-0-src-components` from `apply-bug5-sql.js`, `clean.cjs`, `src/components/screens/AdministrationScreen.jsx`. Evidence: apply-bug5-sql.js:@supabase/supabase-js, clean.cjs:@supabase/supabase-js, src/components/screens/AdministrationScreen.jsx:@supabase/supabase-js
- `Bat` [MEDIUM] used by `subsystem-151-0-src-components`, `subsystem-20-0-temp-extraction` from `src/components/CricketIllustrations.jsx`, `temp_extraction/src/data/mockData.js`. Evidence: src/components/CricketIllustrations.jsx:Bat, temp_extraction/src/data/mockData.js:Bat, src/components/CricketIllustrations.jsx:calls
- `Date` [MEDIUM] used by `subsystem-178-0-src-engine`, `subsystem-39-0-src-components` from `src/components/screens/NewsScreen.jsx`, `src/engine/validationSchemas.js`. Evidence: src/components/screens/NewsScreen.jsx:Date, src/engine/validationSchemas.js:Date, src/components/screens/NewsScreen.jsx:calls
- `Date.now` [MEDIUM] used by `subsystem-174-0-src-components`, `subsystem-41-0-src-lib` from `src/components/selection/CreateTeamModal.jsx`, `src/lib/db.js`. Evidence: src/components/selection/CreateTeamModal.jsx:Date.now, src/lib/db.js:Date.now, src/lib/db.js:calls
- `Day` [MEDIUM] used by `subsystem-10-0-clean-cjs`, `subsystem-7-0-src-components` from `clean.cjs`, `src/components/screens/AdministrationScreen.jsx`. Evidence: clean.cjs:Day, src/components/screens/AdministrationScreen.jsx:Day, clean.cjs:calls
- `Dexie` [MEDIUM] used by `subsystem-41-0-src-lib`, `subsystem-5-0-src-context` from `src/context/CricketContext.jsx`, `src/lib/db.js`. Evidence: src/context/CricketContext.jsx:Dexie, src/lib/db.js:Dexie, src/lib/db.js:calls
- `Error` [MEDIUM] used by `subsystem-0-0-src-lib`, `subsystem-1-0-src-context` from `src/context/CricketContext.jsx`, `src/lib/api.js`. Evidence: src/context/CricketContext.jsx:Error, src/lib/api.js:Error, src/lib/api.js:calls
- `FREE_HIT_ALLOWED_DISMISSALS.includes` [MEDIUM] used by `subsystem-13-0-src-engine`, `subsystem-2-0-src-components` from `src/components/screens/ScoringScreen.jsx`, `src/engine/validationSchemas.js`. Evidence: src/components/screens/ScoringScreen.jsx:FREE_HIT_ALLOWED_DISMISSALS.includes, src/engine/validationSchemas.js:FREE_HIT_ALLOWED_DISMISSALS.includes, src/components/screens/ScoringScreen.jsx:calls
- `JSON.stringify` [MEDIUM] used by `subsystem-1-0-src-context`, `subsystem-17-0-supabase` from `src/context/CricketContext.jsx`, `supabase/functions/send-push/index.ts`. Evidence: src/context/CricketContext.jsx:JSON.stringify, supabase/functions/send-push/index.ts:JSON.stringify, src/context/CricketContext.jsx:calls
- `Math.floor` [MEDIUM] used by `subsystem-1-0-src-context`, `subsystem-16-0-src-components` from `src/components/selection/selectionData.js`, `src/context/CricketContext.jsx`. Evidence: src/components/selection/selectionData.js:Math.floor, src/context/CricketContext.jsx:Math.floor, src/components/selection/selectionData.js:calls
- `Math.max` [MEDIUM] used by `subsystem-14-0-src-services`, `subsystem-6-0-src-components` from `src/components/screens/ScoringScreen.jsx`, `src/services/SyncService.js`. Evidence: src/components/screens/ScoringScreen.jsx:Math.max, src/services/SyncService.js:Math.max, src/components/screens/ScoringScreen.jsx:calls
- `Math.round` [MEDIUM] used by `subsystem-23-0-src-engine`, `subsystem-6-0-src-components` from `src/components/screens/TournamentsScreen.jsx`, `src/engine/cricketStateMachine.js`. Evidence: src/components/screens/TournamentsScreen.jsx:Math.round, src/engine/cricketStateMachine.js:Math.round, src/components/screens/TournamentsScreen.jsx:calls
- `None` [MEDIUM] used by `subsystem-0-0-src-lib`, `subsystem-163-0-src-components` from `src/components/screens/PlayerRegistrationScreen.jsx`, `src/lib/api.js`. Evidence: src/components/screens/PlayerRegistrationScreen.jsx:None, src/lib/api.js:None, src/components/screens/PlayerRegistrationScreen.jsx:calls
- `Number` [MEDIUM] used by `subsystem-2-0-src-components`, `subsystem-23-0-src-engine` from `src/components/screens/MatchSetupScreen.jsx`, `src/engine/cricketStateMachine.js`. Evidence: src/components/screens/MatchSetupScreen.jsx:Number, src/engine/cricketStateMachine.js:Number, src/components/screens/MatchSetupScreen.jsx:calls
- `Object.values` [MEDIUM] used by `subsystem-37-0-src-engine`, `subsystem-55-0-src-components` from `src/components/selection/FilterTiles.jsx`, `src/engine/derivedScorecard.js`. Evidence: src/components/selection/FilterTiles.jsx:Object.values, src/engine/derivedScorecard.js:Object.values, src/components/selection/FilterTiles.jsx:calls
- `Promise.all` [MEDIUM] used by `subsystem-0-0-src-lib`, `subsystem-17-0-supabase`, `subsystem-31-0-src-components` from `src/components/screens/SelectorAssignmentModal.jsx`, `src/lib/api.js`, `supabase/functions/send-push/index.ts`. Evidence: src/components/screens/SelectorAssignmentModal.jsx:Promise.all, src/lib/api.js:Promise.all, supabase/functions/send-push/index.ts:Promise.all
- `Rate` [MEDIUM] used by `subsystem-1-0-src-context`, `subsystem-23-0-src-engine` from `src/context/CricketContext.jsx`, `src/engine/cricketStateMachine.js`. Evidence: src/context/CricketContext.jsx:Rate, src/engine/cricketStateMachine.js:Rate, src/context/CricketContext.jsx:calls
- `Set` [MEDIUM] used by `subsystem-106-0-src-components`, `subsystem-16-0-src-components` from `src/components/screens/SeasonMigrationTab.jsx`, `src/components/selection/selectionData.js`. Evidence: src/components/screens/SeasonMigrationTab.jsx:Set, src/components/selection/selectionData.js:Set, src/components/screens/SeasonMigrationTab.jsx:calls
- `Sharma` [MEDIUM] used by `subsystem-20-0-temp-extraction`, `subsystem-70-0-src-components` from `src/components/screens/ScorecardScreen.jsx`, `temp_extraction/src/data/mockData.js`. Evidence: src/components/screens/ScorecardScreen.jsx:Sharma, temp_extraction/src/data/mockData.js:Sharma, src/components/screens/ScorecardScreen.jsx:calls
- `Stadium` [MEDIUM] used by `subsystem-10-0-clean-cjs`, `subsystem-7-0-src-components` from `clean.cjs`, `src/components/screens/AdministrationScreen.jsx`. Evidence: clean.cjs:Stadium, src/components/screens/AdministrationScreen.jsx:Stadium, clean.cjs:calls
- `age_category_id` [MEDIUM] used by `subsystem-0-0-src-lib`, `subsystem-21-0-src-components` from `src/components/screens/TeamRegistrationTab.jsx`, `src/lib/api.js`. Evidence: src/components/screens/TeamRegistrationTab.jsx:age_category_id, src/lib/api.js:age_category_id, src/lib/api.js:calls
- `async` [MEDIUM] used by `subsystem-121-0-src-components`, `subsystem-17-0-supabase`, `subsystem-18-0-src-lib` from `src/components/NotificationPrompt.jsx`, `src/lib/standings.js`, `supabase/functions/send-push/index.ts`. Evidence: src/components/NotificationPrompt.jsx:async, src/lib/standings.js:async, supabase/functions/send-push/index.ts:async
- `away_team_id` [MEDIUM] used by `subsystem-0-0-src-lib`, `subsystem-5-0-src-context` from `src/context/CricketContext.jsx`, `src/lib/api.js`. Evidence: src/context/CricketContext.jsx:away_team_id, src/lib/api.js:away_team_id, src/lib/api.js:calls
- `config` [MEDIUM] used by `subsystem-10-0-clean-cjs`, `subsystem-100-0-test-players3-js` from `test-batting.cjs`, `test-players3.js`. Evidence: test-batting.cjs:config, test-players3.js:config, test-batting.cjs:calls
- `console.error` [MEDIUM] used by `subsystem-121-0-src-components`, `subsystem-17-0-supabase`, `subsystem-27-0-apply-bug5-sql-js` from `apply-bug5-sql.js`, `src/components/NotificationPrompt.jsx`, `supabase/functions/send-push/index.ts`. Evidence: apply-bug5-sql.js:console.error, src/components/NotificationPrompt.jsx:console.error, supabase/functions/send-push/index.ts:console.error
- `console.log` [MEDIUM] used by `subsystem-10-0-clean-cjs`, `subsystem-27-0-apply-bug5-sql-js`, `subsystem-66-0-src-components` from `apply-bug5-sql.js`, `clean.cjs`, `src/components/screens/ScoringScreen.jsx`. Evidence: apply-bug5-sql.js:console.log, clean.cjs:console.log, src/components/screens/ScoringScreen.jsx:console.log
- `console.warn` [MEDIUM] used by `subsystem-0-0-src-lib`, `subsystem-154-0-src-components` from `src/components/screens/AdministrationScreen.jsx`, `src/lib/api.js`. Evidence: src/components/screens/AdministrationScreen.jsx:console.warn, src/lib/api.js:console.warn, src/lib/api.js:calls
- `constructor` [MEDIUM] used by `subsystem-14-0-src-services`, `subsystem-25-0-src-main-jsx` from `src/main.jsx`, `src/services/SyncService.js`. Evidence: src/main.jsx:constructor, src/services/SyncService.js:constructor, src/main.jsx:calls
- `createClient` [MEDIUM] used by `subsystem-10-0-clean-cjs`, `subsystem-17-0-supabase`, `subsystem-27-0-apply-bug5-sql-js`, `subsystem-7-0-src-components` from `apply-bug5-sql.js`, `src/components/screens/AdministrationScreen.jsx`, `supabase/functions/send-push/index.ts`, `test-batting.cjs`. Evidence: apply-bug5-sql.js:createClient, src/components/screens/AdministrationScreen.jsx:createClient, supabase/functions/send-push/index.ts:createClient
- `data.map` [MEDIUM] used by `subsystem-0-0-src-lib`, `subsystem-21-0-src-components` from `src/components/screens/TeamRegistrationTab.jsx`, `src/lib/api.js`. Evidence: src/components/screens/TeamRegistrationTab.jsx:data.map, src/lib/api.js:data.map, src/components/selection/PerformanceGraphs.jsx:calls
- `delete` [MEDIUM] used by `subsystem-17-0-supabase`, `subsystem-21-0-src-components`, `subsystem-82-0-delete-season-js` from `delete_season.js`, `src/components/screens/TeamRegistrationTab.jsx`, `supabase/functions/send-push/index.ts`. Evidence: delete_season.js:delete, src/components/screens/TeamRegistrationTab.jsx:delete, supabase/functions/send-push/index.ts:delete
- `district_id` [MEDIUM] used by `subsystem-0-0-src-lib`, `subsystem-10-0-clean-cjs`, `subsystem-21-0-src-components` from `src/components/screens/TeamRegistrationTab.jsx`, `src/lib/api.js`, `test-players3.cjs`. Evidence: src/components/screens/TeamRegistrationTab.jsx:district_id, src/lib/api.js:district_id, test-players3.cjs:district_id
- `eq` [MEDIUM] used by `subsystem-17-0-supabase`, `subsystem-21-0-src-components`, `subsystem-82-0-delete-season-js` from `delete_season.js`, `src/components/screens/TeamRegistrationTab.jsx`, `supabase/functions/send-push/index.ts`. Evidence: delete_season.js:eq, src/components/screens/TeamRegistrationTab.jsx:eq, supabase/functions/send-push/index.ts:eq
- `extraType.toUpperCase` [MEDIUM] used by `subsystem-1-0-src-context`, `subsystem-14-0-src-services` from `src/context/CricketContext.jsx`, `src/services/SyncService.js`. Evidence: src/context/CricketContext.jsx:extraType.toUpperCase, src/services/SyncService.js:extraType.toUpperCase, src/context/CricketContext.jsx:calls
- `filter` [MEDIUM] used by `subsystem-3-0-src-components`, `subsystem-67-0-src-lib` from `src/components/screens/InningsInitScreen.jsx`, `src/lib/api.js`. Evidence: src/components/screens/InningsInitScreen.jsx:filter, src/lib/api.js:filter, src/components/screens/InningsInitScreen.jsx:calls
- `from` [MEDIUM] used by `subsystem-17-0-supabase`, `subsystem-21-0-src-components`, `subsystem-82-0-delete-season-js` from `delete_season.js`, `src/components/screens/TeamRegistrationTab.jsx`, `supabase/functions/send-push/index.ts`. Evidence: delete_season.js:from, src/components/screens/TeamRegistrationTab.jsx:from, supabase/functions/send-push/index.ts:from
- `fs` [MEDIUM] used by `subsystem-10-0-clean-cjs`, `subsystem-27-0-apply-bug5-sql-js` from `apply-bug5-sql.js`, `clean.cjs`. Evidence: apply-bug5-sql.js:fs, clean.cjs:fs, apply-bug5-sql.js:imports
- `fs.readFileSync` [MEDIUM] used by `subsystem-10-0-clean-cjs`, `subsystem-27-0-apply-bug5-sql-js` from `apply-bug5-sql.js`, `clean.cjs`. Evidence: apply-bug5-sql.js:fs.readFileSync, clean.cjs:fs.readFileSync, apply-bug5-sql.js:calls
- `home_team_id` [MEDIUM] used by `subsystem-0-0-src-lib`, `subsystem-5-0-src-context` from `src/context/CricketContext.jsx`, `src/lib/api.js`. Evidence: src/context/CricketContext.jsx:home_team_id, src/lib/api.js:home_team_id, src/lib/api.js:calls
- `i.test` [MEDIUM] used by `subsystem-2-0-src-components`, `subsystem-50-0-temp-extraction` from `src/components/screens/ScoringScreen.jsx`, `temp_extraction/src/engine/matchSummaryEngine.js`. Evidence: src/components/screens/ScoringScreen.jsx:i.test, temp_extraction/src/engine/matchSummaryEngine.js:i.test, src/components/screens/ScoringScreen.jsx:calls
- `includes` [MEDIUM] used by `subsystem-16-0-src-components`, `subsystem-88-0-src-components` from `src/components/BottomNav.jsx`, `src/components/selection/selectionData.js`. Evidence: src/components/BottomNav.jsx:includes, src/components/selection/selectionData.js:includes, src/components/DrawerMenu.jsx:calls
- `insert` [MEDIUM] used by `subsystem-0-0-src-lib`, `subsystem-28-0-src-components` from `src/components/NotificationPrompt.jsx`, `src/lib/api.js`. Evidence: src/components/NotificationPrompt.jsx:insert, src/lib/api.js:insert, src/lib/api.js:calls
- `is` [MEDIUM] used by `subsystem-5-0-src-context`, `subsystem-99-0-test-players2-js` from `src/context/CricketContext.jsx`, `test-players2.js`. Evidence: src/context/CricketContext.jsx:is, test-players2.js:is, test-players2.js:calls
- `join` [MEDIUM] used by `subsystem-10-0-clean-cjs`, `subsystem-16-0-src-components`, `subsystem-43-0-fix-logo-py`, `subsystem-6-0-src-components` from `clean.cjs`, `fix_logo.py`, `src/components/screens/NewsScreen.jsx`, `src/components/selection/selectionData.js`. Evidence: clean.cjs:join, fix_logo.py:join, src/components/screens/NewsScreen.jsx:join
- `limit` [MEDIUM] used by `subsystem-0-0-src-lib`, `subsystem-10-0-clean-cjs`, `subsystem-30-0-src-components` from `src/components/screens/SelectionScreen.jsx`, `src/lib/api.js`, `test-batting.cjs`. Evidence: src/components/screens/SelectionScreen.jsx:limit, src/lib/api.js:limit, test-batting.cjs:limit
- `man_of_the_match_id` [MEDIUM] used by `subsystem-0-0-src-lib`, `subsystem-5-0-src-context` from `src/context/CricketContext.jsx`, `src/lib/api.js`. Evidence: src/context/CricketContext.jsx:man_of_the_match_id, src/lib/api.js:man_of_the_match_id, src/lib/api.js:calls
- `map` [MEDIUM] used by `subsystem-176-0-src-components`, `subsystem-2-0-src-components` from `src/components/screens/AccessControlScreen.jsx`, `src/components/selection/selectionData.js`. Evidence: src/components/screens/AccessControlScreen.jsx:map, src/components/selection/selectionData.js:map, src/components/screens/AccessControlScreen.jsx:calls
- `matchHistory.slice` [MEDIUM] used by `subsystem-16-0-src-components`, `subsystem-6-0-src-components` from `src/components/selection/PlayerDetail.jsx`, `src/components/selection/selectionData.js`. Evidence: src/components/selection/PlayerDetail.jsx:matchHistory.slice, src/components/selection/selectionData.js:matchHistory.slice, src/components/selection/PlayerDetail.jsx:calls
- `matches.find` [MEDIUM] used by `subsystem-18-0-src-lib`, `subsystem-69-0-src-components` from `src/components/screens/MatchDetailScreen.jsx`, `src/lib/standings.js`. Evidence: src/components/screens/MatchDetailScreen.jsx:matches.find, src/lib/standings.js:matches.find, src/components/screens/MatchDetailScreen.jsx:calls
- `matches.forEach` [MEDIUM] used by `subsystem-18-0-src-lib`, `subsystem-60-0-temp-extraction` from `src/lib/standings.js`, `temp_extraction/src/components/screens/TournamentsScreen.jsx`. Evidence: src/lib/standings.js:matches.forEach, temp_extraction/src/components/screens/TournamentsScreen.jsx:matches.forEach, temp_extraction/src/components/screens/TournamentsScreen.jsx:calls
- `maybeSingle` [MEDIUM] used by `subsystem-0-0-src-lib`, `subsystem-5-0-src-context` from `src/context/CricketContext.jsx`, `src/lib/api.js`. Evidence: src/context/CricketContext.jsx:maybeSingle, src/lib/api.js:maybeSingle, src/lib/api.js:calls
- `name.substring` [MEDIUM] used by `subsystem-0-0-src-lib`, `subsystem-9-0-src-components` from `src/components/screens/TeamsScreen.jsx`, `src/lib/api.js`. Evidence: src/components/screens/TeamsScreen.jsx:name.substring, src/lib/api.js:name.substring, src/components/screens/TeamsScreen.jsx:calls
- `on` [MEDIUM] used by `subsystem-0-0-src-lib`, `subsystem-66-0-src-components` from `src/components/screens/ScoringScreen.jsx`, `src/lib/api.js`. Evidence: src/components/screens/ScoringScreen.jsx:on, src/lib/api.js:on, src/lib/api.js:calls
- `parseFloat` [MEDIUM] used by `subsystem-15-0-src-components`, `subsystem-23-0-src-engine` from `src/components/screens/TournamentsScreen.jsx`, `src/engine/cricketStateMachine.js`. Evidence: src/components/screens/TournamentsScreen.jsx:parseFloat, src/engine/cricketStateMachine.js:parseFloat, src/components/screens/TournamentsScreen.jsx:calls
- `parseInt` [MEDIUM] used by `subsystem-108-0-src-components`, `subsystem-16-0-src-components` from `src/components/selection/CreateTeamModal.jsx`, `src/components/selection/selectionData.js`. Evidence: src/components/selection/CreateTeamModal.jsx:parseInt, src/components/selection/selectionData.js:parseInt, src/components/selection/CreateTeamModal.jsx:calls
- `path` [MEDIUM] used by `subsystem-27-0-apply-bug5-sql-js`, `subsystem-46-0-temp-extraction` from `apply-bug5-sql.js`, `temp_extraction/vite.config.ts`. Evidence: apply-bug5-sql.js:path, temp_extraction/vite.config.ts:path, apply-bug5-sql.js:imports
- `player_registrations` [MEDIUM] used by `subsystem-10-0-clean-cjs`, `subsystem-5-0-src-context`, `subsystem-99-0-test-players2-js` from `src/context/CricketContext.jsx`, `test-players2.js`, `test-players3.cjs`. Evidence: src/context/CricketContext.jsx:player_registrations, test-players2.js:player_registrations, test-players3.cjs:player_registrations
- `players.forEach` [MEDIUM] used by `subsystem-16-0-src-components`, `subsystem-8-0-src-components` from `src/components/screens/SeasonMigrationTab.jsx`, `src/components/selection/selectionData.js`. Evidence: src/components/screens/SeasonMigrationTab.jsx:players.forEach, src/components/selection/selectionData.js:players.forEach, src/components/screens/SeasonMigrationTab.jsx:calls
- `queueOfflineAction` [MEDIUM] used by `subsystem-1-0-src-context`, `subsystem-41-0-src-lib` from `src/context/CricketContext.jsx`, `src/lib/db.js`. Evidence: src/context/CricketContext.jsx:queueOfflineAction, src/lib/db.js:queueOfflineAction, src/lib/db.js:calls
- `react` [MEDIUM] used by `subsystem-10-0-clean-cjs`, `subsystem-46-0-temp-extraction`, `subsystem-52-0-src-hooks`, `subsystem-53-0-src-app-jsx` from `clean.cjs`, `src/App.jsx`, `src/hooks/useHaptics.js`, `temp_extraction/vite.config.ts`. Evidence: clean.cjs:react, src/App.jsx:react, src/hooks/useHaptics.js:react
- `registerPlayer` [MEDIUM] used by `subsystem-0-0-src-lib`, `subsystem-65-0-src-components` from `src/components/screens/PlayerRegistrationScreen.jsx`, `src/lib/api.js`. Evidence: src/components/screens/PlayerRegistrationScreen.jsx:registerPlayer, src/lib/api.js:registerPlayer, src/lib/api.js:calls
- `replace` [MEDIUM] used by `subsystem-153-0-src-components`, `subsystem-67-0-src-lib` from `src/components/NotificationPrompt.jsx`, `src/lib/api.js`. Evidence: src/components/NotificationPrompt.jsx:replace, src/lib/api.js:replace, src/components/screens/PlayersScreen.jsx:calls
- `require` [MEDIUM] used by `subsystem-10-0-clean-cjs`, `subsystem-100-0-test-players3-js` from `clean.cjs`, `test-players3.js`. Evidence: clean.cjs:require, test-players3.js:require, clean.cjs:calls
- `select` [MEDIUM] used by `subsystem-0-0-src-lib`, `subsystem-10-0-clean-cjs`, `subsystem-17-0-supabase` from `src/lib/api.js`, `supabase/functions/send-push/index.ts`, `test-batting.cjs`. Evidence: src/lib/api.js:select, supabase/functions/send-push/index.ts:select, test-batting.cjs:select
- `single` [MEDIUM] used by `subsystem-0-0-src-lib`, `subsystem-21-0-src-components` from `src/components/screens/TeamRegistrationTab.jsx`, `src/lib/api.js`. Evidence: src/components/screens/TeamRegistrationTab.jsx:single, src/lib/api.js:single, src/lib/api.js:calls
- `sort` [MEDIUM] used by `subsystem-16-0-src-components`, `subsystem-36-0-src-components` from `src/components/selection/PlayerDetail.jsx`, `src/components/selection/selectionData.js`. Evidence: src/components/selection/PlayerDetail.jsx:sort, src/components/selection/selectionData.js:sort, src/components/selection/PlayerDetail.jsx:calls
- `supabase.from` [MEDIUM] used by `subsystem-0-0-src-lib`, `subsystem-10-0-clean-cjs`, `subsystem-28-0-src-components` from `src/components/NotificationPrompt.jsx`, `src/lib/api.js`, `test-batting.cjs`. Evidence: src/components/NotificationPrompt.jsx:supabase.from, src/lib/api.js:supabase.from, test-batting.cjs:supabase.from
- `then` [MEDIUM] used by `subsystem-10-0-clean-cjs`, `subsystem-38-0-src-sw-js`, `subsystem-56-0-src-components` from `src/components/screens/PlayerProfileScreen.jsx`, `src/sw.js`, `test-batting.cjs`. Evidence: src/components/screens/PlayerProfileScreen.jsx:then, src/sw.js:then, test-batting.cjs:then
- `toFixed` [MEDIUM] used by `subsystem-157-0-src-components`, `subsystem-16-0-src-components` from `src/components/screens/HomeScreen.jsx`, `src/components/selection/selectionData.js`. Evidence: src/components/screens/HomeScreen.jsx:toFixed, src/components/selection/selectionData.js:toFixed, src/components/screens/HomeScreen.jsx:calls
- `toISOString` [MEDIUM] used by `subsystem-0-0-src-lib`, `subsystem-1-0-src-context` from `src/context/CricketContext.jsx`, `src/lib/api.js`. Evidence: src/context/CricketContext.jsx:toISOString, src/lib/api.js:toISOString, src/lib/api.js:calls
- `toLocaleDateString` [MEDIUM] used by `subsystem-0-0-src-lib`, `subsystem-39-0-src-components` from `src/components/screens/NewsScreen.jsx`, `src/lib/api.js`. Evidence: src/components/screens/NewsScreen.jsx:toLocaleDateString, src/lib/api.js:toLocaleDateString, src/components/screens/NewsScreen.jsx:calls
- `toLowerCase` [MEDIUM] used by `subsystem-0-0-src-lib`, `subsystem-150-0-src-components` from `src/components/CricketIcons.jsx`, `src/lib/api.js`. Evidence: src/components/CricketIcons.jsx:toLowerCase, src/lib/api.js:toLowerCase, src/components/CricketIcons.jsx:calls
- `toUpperCase` [MEDIUM] used by `subsystem-16-0-src-components`, `subsystem-6-0-src-components` from `src/components/CricketIcons.jsx`, `src/components/selection/selectionData.js`. Evidence: src/components/CricketIcons.jsx:toUpperCase, src/components/selection/selectionData.js:toUpperCase, src/components/CricketIcons.jsx:calls
- `trim` [MEDIUM] used by `subsystem-16-0-src-components`, `subsystem-54-0-src-components` from `src/components/screens/MatchesScreen.jsx`, `src/components/selection/selectionData.js`. Evidence: src/components/screens/MatchesScreen.jsx:trim, src/components/selection/selectionData.js:trim, src/components/screens/MatchesScreen.jsx:calls
- `url` [MEDIUM] used by `subsystem-13-0-src-engine`, `subsystem-35-0-src-components` from `src/components/CricketIllustrations.jsx`, `src/engine/validationSchemas.js`. Evidence: src/components/CricketIllustrations.jsx:url, src/engine/validationSchemas.js:url, src/components/CricketIllustrations.jsx:calls
- `useEffect` [MEDIUM] used by `subsystem-18-0-src-lib`, `subsystem-29-0-src-components` from `src/components/BottomNav.jsx`, `src/lib/standings.js`. Evidence: src/components/BottomNav.jsx:useEffect, src/lib/standings.js:useEffect, src/components/BottomNav.jsx:calls
- `useState` [MEDIUM] used by `subsystem-18-0-src-lib`, `subsystem-88-0-src-components` from `src/components/BottomNav.jsx`, `src/lib/standings.js`. Evidence: src/components/BottomNav.jsx:useState, src/lib/standings.js:useState, src/components/BottomNav.jsx:calls
- `window.addEventListener` [MEDIUM] used by `subsystem-14-0-src-services`, `subsystem-29-0-src-components` from `src/components/BottomNav.jsx`, `src/services/SyncService.js`. Evidence: src/components/BottomNav.jsx:window.addEventListener, src/services/SyncService.js:window.addEventListener, src/components/BottomNav.jsx:calls
- `../../context/CricketContext` [LOW] used by `subsystem-10-0-clean-cjs` from `clean.cjs`. Evidence: clean.cjs:../../context/CricketContext, clean.cjs:imports
- `../../lib/api` [LOW] used by `subsystem-10-0-clean-cjs` from `clean.cjs`. Evidence: clean.cjs:../../lib/api, clean.cjs:imports
- `../assets/bat-icon.png` [LOW] used by `subsystem-6-0-src-components` from `src/components/CricketIcons.jsx`. Evidence: src/components/CricketIcons.jsx:../assets/bat-icon.png, src/components/CricketIcons.jsx:imports, temp_extraction/src/components/CricketIcons.jsx:imports
- `../ui/Badge` [LOW] used by `subsystem-10-0-clean-cjs` from `clean.cjs`. Evidence: clean.cjs:../ui/Badge, clean.cjs:imports
- `../ui/PageHeader` [LOW] used by `subsystem-10-0-clean-cjs` from `clean.cjs`. Evidence: clean.cjs:../ui/PageHeader, clean.cjs:imports
- `./SeasonMigrationTab` [LOW] used by `subsystem-10-0-clean-cjs` from `clean.cjs`. Evidence: clean.cjs:./SeasonMigrationTab, clean.cjs:imports
- `@cloudinary/react` [LOW] used by `subsystem-12-0-src-components` from `src/components/ui/CloudinaryAvatar.jsx`. Evidence: src/components/ui/CloudinaryAvatar.jsx:@cloudinary/react, src/components/ui/CloudinaryAvatar.jsx:imports
- `@cloudinary/url-gen` [LOW] used by `subsystem-12-0-src-components` from `src/components/ui/CloudinaryAvatar.jsx`. Evidence: src/components/ui/CloudinaryAvatar.jsx:@cloudinary/url-gen, src/components/ui/CloudinaryAvatar.jsx:imports
- `@cloudinary/url-gen/actions/resize` [LOW] used by `subsystem-12-0-src-components` from `src/components/ui/CloudinaryAvatar.jsx`. Evidence: src/components/ui/CloudinaryAvatar.jsx:@cloudinary/url-gen/actions/resize, src/components/ui/CloudinaryAvatar.jsx:imports
- `@cloudinary/url-gen/qualifiers/gravity` [LOW] used by `subsystem-12-0-src-components` from `src/components/ui/CloudinaryAvatar.jsx`. Evidence: src/components/ui/CloudinaryAvatar.jsx:@cloudinary/url-gen/qualifiers/gravity, src/components/ui/CloudinaryAvatar.jsx:imports
- `@tailwindcss/vite` [LOW] used by `subsystem-46-0-temp-extraction` from `temp_extraction/vite.config.ts`. Evidence: temp_extraction/vite.config.ts:@tailwindcss/vite, temp_extraction/vite.config.ts:imports, vite.config.ts:imports
- `@vitejs/plugin-react` [LOW] used by `subsystem-46-0-temp-extraction` from `temp_extraction/vite.config.ts`. Evidence: temp_extraction/vite.config.ts:@vitejs/plugin-react, temp_extraction/vite.config.ts:imports, vite.config.ts:imports
- `A` [LOW] used by `subsystem-3-0-src-components` from `src/components/screens/MatchSetupScreen.jsx`. Evidence: src/components/screens/MatchSetupScreen.jsx:A, src/components/screens/MatchSetupScreen.jsx:calls
- `AGE_CATEGORIES.filter` [LOW] used by `subsystem-11-0-src-components` from `src/components/screens/PlayerRegistrationScreen.jsx`. Evidence: src/components/screens/PlayerRegistrationScreen.jsx:AGE_CATEGORIES.filter, src/components/screens/PlayerRegistrationScreen.jsx:calls
- `AGE_CATEGORIES.map` [LOW] used by `subsystem-179-0-temp-extraction` from `temp_extraction/src/components/screens/PlayerRegistrationScreen.jsx`. Evidence: temp_extraction/src/components/screens/PlayerRegistrationScreen.jsx:AGE_CATEGORIES.map, temp_extraction/src/components/screens/PlayerRegistrationScreen.jsx:calls, temp_extraction/src/components/screens/PlayersScreen.jsx:calls
- `AGE_CATEGORIES.some` [LOW] used by `subsystem-11-0-src-components` from `src/components/screens/PlayerRegistrationScreen.jsx`. Evidence: src/components/screens/PlayerRegistrationScreen.jsx:AGE_CATEGORIES.some, src/components/screens/PlayerRegistrationScreen.jsx:calls
- `AGE_FILTER_OPTIONS.map` [LOW] used by `subsystem-55-0-src-components` from `src/components/selection/FilterTiles.jsx`. Evidence: src/components/selection/FilterTiles.jsx:AGE_FILTER_OPTIONS.map, src/components/selection/FilterTiles.jsx:calls
- `ALL_NAV.filter` [LOW] used by `subsystem-47-0-src-components` from `src/components/DrawerMenu.jsx`. Evidence: src/components/DrawerMenu.jsx:ALL_NAV.filter, src/components/DrawerMenu.jsx:calls, temp_extraction/src/components/DrawerMenu.jsx:calls
- `ANNOUNCEMENTS` [LOW] used by `subsystem-20-0-temp-extraction` from `temp_extraction/src/data/mockData.js`. Evidence: temp_extraction/src/data/mockData.js:ANNOUNCEMENTS, temp_extraction/src/data/mockData.js:calls
- `AccessControlScreen` [LOW] used by `subsystem-93-0-src-components` from `src/components/screens/AccessControlScreen.jsx`. Evidence: src/components/screens/AccessControlScreen.jsx:AccessControlScreen, src/components/screens/AccessControlScreen.jsx:calls, temp_extraction/src/components/screens/AccessControlScreen.jsx:calls
- `Action` [LOW] used by `subsystem-1-0-src-context` from `src/context/CricketContext.jsx`. Evidence: src/context/CricketContext.jsx:Action, src/context/CricketContext.jsx:calls, src/context/CricketContext.jsx:calls
- `Add` [LOW] used by `subsystem-91-0-src-components` from `src/components/selection/SelectionWorkspace.jsx`. Evidence: src/components/selection/SelectionWorkspace.jsx:Add, src/components/selection/SelectionWorkspace.jsx:calls
- `AdministrationScreen` [LOW] used by `subsystem-7-0-src-components` from `src/components/screens/AdministrationScreen.jsx`. Evidence: src/components/screens/AdministrationScreen.jsx:AdministrationScreen, src/components/screens/AdministrationScreen.jsx:calls, temp_extraction/src/components/screens/AdministrationScreen.jsx:calls
- `Age` [LOW] used by `subsystem-11-0-src-components` from `temp_extraction/src/components/screens/PlayerRegistrationScreen.jsx`. Evidence: temp_extraction/src/components/screens/PlayerRegistrationScreen.jsx:Age, temp_extraction/src/components/screens/PlayerRegistrationScreen.jsx:calls
- `All` [LOW] used by `subsystem-22-0-src-components` from `src/components/screens/HomeScreen.jsx`. Evidence: src/components/screens/HomeScreen.jsx:All, src/components/screens/HomeScreen.jsx:calls
- `Amber` [LOW] used by `subsystem-44-0-src-components` from `src/components/selection/PlayerPool.jsx`. Evidence: src/components/selection/PlayerPool.jsx:Amber, src/components/selection/PlayerPool.jsx:calls
- `Analysis` [LOW] used by `subsystem-20-0-temp-extraction` from `temp_extraction/src/data/mockData.js`. Evidence: temp_extraction/src/data/mockData.js:Analysis, temp_extraction/src/data/mockData.js:calls
- `App` [LOW] used by `subsystem-53-0-src-app-jsx` from `src/App.jsx`. Evidence: src/App.jsx:App, src/App.jsx:calls, temp_extraction/src/App.jsx:calls
- `Array.from` [LOW] used by `subsystem-16-0-src-components` from `src/components/selection/selectionData.js`. Evidence: src/components/selection/selectionData.js:Array.from, src/components/selection/selectionData.js:calls, src/engine/derivedScorecard.js:calls
- `Association` [LOW] used by `subsystem-7-0-src-components` from `src/components/screens/AdministrationScreen.jsx`. Evidence: src/components/screens/AdministrationScreen.jsx:Association, src/components/screens/AdministrationScreen.jsx:calls, src/components/screens/TeamsScreen.jsx:calls
- `AuthScreen` [LOW] used by `subsystem-74-0-src-components` from `src/components/screens/AuthScreen.jsx`. Evidence: src/components/screens/AuthScreen.jsx:AuthScreen, src/components/screens/AuthScreen.jsx:calls, temp_extraction/src/components/screens/AuthScreen.jsx:calls
- `B` [LOW] used by `subsystem-3-0-src-components` from `src/components/screens/MatchSetupScreen.jsx`. Evidence: src/components/screens/MatchSetupScreen.jsx:B, src/components/screens/MatchSetupScreen.jsx:calls
- `BATTING_STYLES.map` [LOW] used by `subsystem-11-0-src-components` from `src/components/screens/PlayerRegistrationScreen.jsx`. Evidence: src/components/screens/PlayerRegistrationScreen.jsx:BATTING_STYLES.map, src/components/screens/PlayerRegistrationScreen.jsx:calls, temp_extraction/src/components/screens/PlayerRegistrationScreen.jsx:calls
- `BATTING_STYLE_OPTIONS.map` [LOW] used by `subsystem-55-0-src-components` from `src/components/selection/FilterTiles.jsx`. Evidence: src/components/selection/FilterTiles.jsx:BATTING_STYLE_OPTIONS.map, src/components/selection/FilterTiles.jsx:calls
- `BIN` [LOW] used by `subsystem-0-0-src-lib` from `src/lib/api.js`. Evidence: src/lib/api.js:BIN, src/lib/api.js:calls
- `BOWLING_STYLES.map` [LOW] used by `subsystem-11-0-src-components` from `src/components/screens/PlayerRegistrationScreen.jsx`. Evidence: src/components/screens/PlayerRegistrationScreen.jsx:BOWLING_STYLES.map, src/components/screens/PlayerRegistrationScreen.jsx:calls, temp_extraction/src/components/screens/PlayerRegistrationScreen.jsx:calls
- `Ball` [LOW] used by `subsystem-13-0-src-engine` from `src/engine/validationSchemas.js`. Evidence: src/engine/validationSchemas.js:Ball, src/engine/validationSchemas.js:calls, temp_extraction/src/engine/validationSchemas.js:calls
- `BallEventSchema.safeParse` [LOW] used by `subsystem-23-0-src-engine` from `src/engine/cricketStateMachine.js`. Evidence: src/engine/cricketStateMachine.js:BallEventSchema.safeParse, src/engine/cricketStateMachine.js:calls, temp_extraction/src/engine/cricketStateMachine.js:calls
- `Balls` [LOW] used by `subsystem-20-0-temp-extraction` from `temp_extraction/src/data/mockData.js`. Evidence: temp_extraction/src/data/mockData.js:Balls, temp_extraction/src/data/mockData.js:calls
- `Bar` [LOW] used by `subsystem-33-0-src-components` from `src/components/screens/ScoutingHubScreen.jsx`. Evidence: src/components/screens/ScoutingHubScreen.jsx:Bar, src/components/screens/ScoutingHubScreen.jsx:calls, src/components/selection/SelectionWorkspace.jsx:calls
- `Blue` [LOW] used by `subsystem-44-0-src-components` from `src/components/selection/PlayerPool.jsx`. Evidence: src/components/selection/PlayerPool.jsx:Blue, src/components/selection/PlayerPool.jsx:calls
- `Board` [LOW] used by `subsystem-22-0-src-components` from `src/components/screens/HomeScreen.jsx`. Evidence: src/components/screens/HomeScreen.jsx:Board, src/components/screens/HomeScreen.jsx:calls
- `BottomNav` [LOW] used by `subsystem-29-0-src-components` from `src/components/BottomNav.jsx`. Evidence: src/components/BottomNav.jsx:BottomNav, src/components/BottomNav.jsx:calls, temp_extraction/src/components/BottomNav.jsx:calls
- `BottomSheet` [LOW] used by `subsystem-114-0-src-components` from `src/components/ui/BottomSheet.jsx`. Evidence: src/components/ui/BottomSheet.jsx:BottomSheet, src/components/ui/BottomSheet.jsx:calls
- `Boundaries` [LOW] used by `subsystem-59-0-temp-extraction` from `temp_extraction/src/components/screens/PlayerProfileScreen.jsx`. Evidence: temp_extraction/src/components/screens/PlayerProfileScreen.jsx:Boundaries, temp_extraction/src/components/screens/PlayerProfileScreen.jsx:calls
- `Bowling` [LOW] used by `subsystem-6-0-src-components` from `src/components/selection/PlayerDetail.jsx`. Evidence: src/components/selection/PlayerDetail.jsx:Bowling, src/components/selection/PlayerDetail.jsx:calls
- `CATEGORIES.map` [LOW] used by `subsystem-32-0-src-components` from `src/components/screens/PlayersScreen.jsx`. Evidence: src/components/screens/PlayersScreen.jsx:CATEGORIES.map, src/components/screens/PlayersScreen.jsx:calls, src/components/screens/SelectorsScreen.jsx:calls
- `CATEGORY_OPTIONS.map` [LOW] used by `subsystem-19-0-src-components` from `src/components/selection/SelectionWorkspace.jsx`. Evidence: src/components/selection/SelectionWorkspace.jsx:CATEGORY_OPTIONS.map, src/components/selection/SelectionWorkspace.jsx:calls, src/components/selection/SelectionWorkspace.jsx:calls
- `CampaignOverview` [LOW] used by `subsystem-6-0-src-components` from `src/components/selection/CampaignOverview.jsx`. Evidence: src/components/selection/CampaignOverview.jsx:CampaignOverview, src/components/selection/CampaignOverview.jsx:calls
- `Center` [LOW] used by `subsystem-22-0-src-components` from `src/components/screens/HomeScreen.jsx`. Evidence: src/components/screens/HomeScreen.jsx:Center, src/components/screens/HomeScreen.jsx:calls
- `Cloudinary` [LOW] used by `subsystem-12-0-src-components` from `src/components/ui/CloudinaryAvatar.jsx`. Evidence: src/components/ui/CloudinaryAvatar.jsx:Cloudinary, src/components/ui/CloudinaryAvatar.jsx:calls
- `Complete` [LOW] used by `subsystem-51-0-src-components` from `src/components/selection/SelectedTeam.jsx`. Evidence: src/components/selection/SelectedTeam.jsx:Complete, src/components/selection/SelectedTeam.jsx:calls
- `Config` [LOW] used by `subsystem-3-0-src-components` from `temp_extraction/src/components/screens/MatchSetupScreen.jsx`. Evidence: temp_extraction/src/components/screens/MatchSetupScreen.jsx:Config, temp_extraction/src/components/screens/MatchSetupScreen.jsx:calls
- `CreateTeamModal` [LOW] used by `subsystem-57-0-src-components` from `src/components/selection/CreateTeamModal.jsx`. Evidence: src/components/selection/CreateTeamModal.jsx:CreateTeamModal, src/components/selection/CreateTeamModal.jsx:calls
- `DIRECTIONS` [LOW] used by `subsystem-20-0-temp-extraction` from `temp_extraction/src/data/mockData.js`. Evidence: temp_extraction/src/data/mockData.js:DIRECTIONS, temp_extraction/src/data/mockData.js:calls
- `DISMISSALS.map` [LOW] used by `subsystem-2-0-src-components` from `src/components/screens/ScoringScreen.jsx`. Evidence: src/components/screens/ScoringScreen.jsx:DISMISSALS.map, src/components/screens/ScoringScreen.jsx:calls, temp_extraction/src/components/screens/ScoringScreen.jsx:calls
- `DataTable` [LOW] used by `subsystem-36-0-src-components` from `src/components/ui/DataTable.jsx`. Evidence: src/components/ui/DataTable.jsx:DataTable, src/components/ui/DataTable.jsx:calls, temp_extraction/src/components/ui/DataTable.jsx:calls
- `Delivery` [LOW] used by `subsystem-3-0-src-components` from `temp_extraction/src/components/screens/MatchSetupScreen.jsx`. Evidence: temp_extraction/src/components/screens/MatchSetupScreen.jsx:Delivery, temp_extraction/src/components/screens/MatchSetupScreen.jsx:calls
- `Dismissal` [LOW] used by `subsystem-1-0-src-context` from `src/context/CricketContext.jsx`. Evidence: src/context/CricketContext.jsx:Dismissal, src/context/CricketContext.jsx:calls, temp_extraction/src/context/CricketContext.jsx:calls
- `Distinctions` [LOW] used by `subsystem-59-0-temp-extraction` from `temp_extraction/src/components/screens/PlayerProfileScreen.jsx`. Evidence: temp_extraction/src/components/screens/PlayerProfileScreen.jsx:Distinctions, temp_extraction/src/components/screens/PlayerProfileScreen.jsx:calls
- `Districts` [LOW] used by `subsystem-90-0-src-components` from `src/components/screens/TeamsScreen.jsx`. Evidence: src/components/screens/TeamsScreen.jsx:Districts, src/components/screens/TeamsScreen.jsx:calls, temp_extraction/src/components/screens/AdministrationScreen.jsx:calls
- `DrawerMenu` [LOW] used by `subsystem-47-0-src-components` from `src/components/DrawerMenu.jsx`. Evidence: src/components/DrawerMenu.jsx:DrawerMenu, src/components/DrawerMenu.jsx:calls, temp_extraction/src/components/DrawerMenu.jsx:calls
- `ELIGIBILITY_OPTIONS.map` [LOW] used by `subsystem-55-0-src-components` from `src/components/selection/FilterTiles.jsx`. Evidence: src/components/selection/FilterTiles.jsx:ELIGIBILITY_OPTIONS.map, src/components/selection/FilterTiles.jsx:calls
- `Emblem` [LOW] used by `subsystem-6-0-src-components` from `src/components/CricketIcons.jsx`. Evidence: src/components/CricketIcons.jsx:Emblem, src/components/CricketIcons.jsx:calls, temp_extraction/src/components/CricketIcons.jsx:calls
- `ErrorState` [LOW] used by `subsystem-115-0-src-components` from `src/components/ui/ErrorState.jsx`. Evidence: src/components/ui/ErrorState.jsx:ErrorState, src/components/ui/ErrorState.jsx:calls
- `Extra` [LOW] used by `subsystem-1-0-src-context` from `src/context/CricketContext.jsx`. Evidence: src/context/CricketContext.jsx:Extra, src/context/CricketContext.jsx:calls, temp_extraction/src/context/CricketContext.jsx:calls
- `FilterTiles` [LOW] used by `subsystem-55-0-src-components` from `src/components/selection/FilterTiles.jsx`. Evidence: src/components/selection/FilterTiles.jsx:FilterTiles, src/components/selection/FilterTiles.jsx:calls
- `FinalSquad` [LOW] used by `subsystem-112-0-src-components` from `src/components/selection/FinalSquad.jsx`. Evidence: src/components/selection/FinalSquad.jsx:FinalSquad, src/components/selection/FinalSquad.jsx:calls
- `Form` [LOW] used by `subsystem-6-0-src-components` from `src/components/selection/PlayerDetail.jsx`. Evidence: src/components/selection/PlayerDetail.jsx:Form, src/components/selection/PlayerDetail.jsx:calls
- `FormData` [LOW] used by `subsystem-11-0-src-components` from `src/components/screens/PlayerRegistrationScreen.jsx`. Evidence: src/components/screens/PlayerRegistrationScreen.jsx:FormData, src/components/screens/PlayerRegistrationScreen.jsx:calls
- `Header` [LOW] used by `subsystem-111-0-src-components` from `src/components/Header.jsx`. Evidence: src/components/Header.jsx:Header, src/components/Header.jsx:calls, src/components/screens/AuthScreen.jsx:calls
- `HomeScreen` [LOW] used by `subsystem-22-0-src-components` from `src/components/screens/HomeScreen.jsx`. Evidence: src/components/screens/HomeScreen.jsx:HomeScreen, src/components/screens/HomeScreen.jsx:calls, temp_extraction/src/components/screens/HomeScreen.jsx:calls
- `INITIAL_DISTRICTS.map` [LOW] used by `subsystem-64-0-temp-extraction` from `temp_extraction/src/components/screens/AdministrationScreen.jsx`. Evidence: temp_extraction/src/components/screens/AdministrationScreen.jsx:INITIAL_DISTRICTS.map, temp_extraction/src/components/screens/AdministrationScreen.jsx:calls, temp_extraction/src/components/screens/AdministrationScreen.jsx:calls
- `INITIAL_FORMATS.map` [LOW] used by `subsystem-64-0-temp-extraction` from `temp_extraction/src/components/screens/AdministrationScreen.jsx`. Evidence: temp_extraction/src/components/screens/AdministrationScreen.jsx:INITIAL_FORMATS.map, temp_extraction/src/components/screens/AdministrationScreen.jsx:calls
- `INITIAL_VENUES.map` [LOW] used by `subsystem-64-0-temp-extraction` from `temp_extraction/src/components/screens/AdministrationScreen.jsx`. Evidence: temp_extraction/src/components/screens/AdministrationScreen.jsx:INITIAL_VENUES.map, temp_extraction/src/components/screens/AdministrationScreen.jsx:calls
- `Icons` [LOW] used by `subsystem-3-0-src-components` from `src/components/screens/InningsInitScreen.jsx`. Evidence: src/components/screens/InningsInitScreen.jsx:Icons, src/components/screens/InningsInitScreen.jsx:calls, src/components/screens/MatchSetupScreen.jsx:calls
- `Illustration` [LOW] used by `subsystem-35-0-src-components` from `src/components/CricketIllustrations.jsx`. Evidence: src/components/CricketIllustrations.jsx:Illustration, src/components/CricketIllustrations.jsx:calls, src/components/CricketIllustrations.jsx:calls
- `Image` [LOW] used by `subsystem-74-0-src-components` from `src/components/screens/AuthScreen.jsx`. Evidence: src/components/screens/AuthScreen.jsx:Image, src/components/screens/AuthScreen.jsx:calls
- `Innings` [LOW] used by `subsystem-84-0-src-components` from `src/components/screens/InningsBreakScreen.jsx`. Evidence: src/components/screens/InningsBreakScreen.jsx:Innings, src/components/screens/InningsBreakScreen.jsx:calls, temp_extraction/src/components/screens/InningsBreakScreen.jsx:calls
- `InningsBreakScreen` [LOW] used by `subsystem-84-0-src-components` from `src/components/screens/InningsBreakScreen.jsx`. Evidence: src/components/screens/InningsBreakScreen.jsx:InningsBreakScreen, src/components/screens/InningsBreakScreen.jsx:calls, temp_extraction/src/components/screens/InningsBreakScreen.jsx:calls
- `InningsInitScreen` [LOW] used by `subsystem-3-0-src-components` from `src/components/screens/InningsInitScreen.jsx`. Evidence: src/components/screens/InningsInitScreen.jsx:InningsInitScreen, src/components/screens/InningsInitScreen.jsx:calls
- `JDCA` [LOW] used by `subsystem-64-0-temp-extraction` from `temp_extraction/src/components/screens/AdministrationScreen.jsx`. Evidence: temp_extraction/src/components/screens/AdministrationScreen.jsx:JDCA, temp_extraction/src/components/screens/AdministrationScreen.jsx:calls
- `JDCA_DISTRICTS.map` [LOW] used by `subsystem-162-0-src-components` from `src/components/screens/PlayerRegistrationScreen.jsx`. Evidence: src/components/screens/PlayerRegistrationScreen.jsx:JDCA_DISTRICTS.map, src/components/screens/PlayerRegistrationScreen.jsx:calls, src/components/screens/PlayersScreen.jsx:calls
- `JSON.parse` [LOW] used by `subsystem-1-0-src-context` from `src/context/CricketContext.jsx`. Evidence: src/context/CricketContext.jsx:JSON.parse, src/context/CricketContext.jsx:calls, src/context/CricketContext.jsx:calls
- `JdcaManagementTab` [LOW] used by `subsystem-75-0-src-components` from `src/components/screens/JdcaManagementTab.jsx`. Evidence: src/components/screens/JdcaManagementTab.jsx:JdcaManagementTab, src/components/screens/JdcaManagementTab.jsx:calls
- `Jr` [LOW] used by `subsystem-20-0-temp-extraction` from `temp_extraction/src/data/mockData.js`. Evidence: temp_extraction/src/data/mockData.js:Jr, temp_extraction/src/data/mockData.js:calls
- `Kashyap` [LOW] used by `subsystem-20-0-temp-extraction` from `temp_extraction/src/data/mockData.js`. Evidence: temp_extraction/src/data/mockData.js:Kashyap, temp_extraction/src/data/mockData.js:calls
- `Keeper` [LOW] used by `subsystem-2-0-src-components` from `temp_extraction/src/components/screens/ScoringScreen.jsx`. Evidence: temp_extraction/src/components/screens/ScoringScreen.jsx:Keeper, temp_extraction/src/components/screens/ScoringScreen.jsx:calls
- `Kumar` [LOW] used by `subsystem-20-0-temp-extraction` from `temp_extraction/src/data/mockData.js`. Evidence: temp_extraction/src/data/mockData.js:Kumar, temp_extraction/src/data/mockData.js:calls
- `Leg` [LOW] used by `subsystem-35-0-src-components` from `src/components/CricketIllustrations.jsx`. Evidence: src/components/CricketIllustrations.jsx:Leg, src/components/CricketIllustrations.jsx:calls, src/components/CricketIllustrations.jsx:calls
- `Lines` [LOW] used by `subsystem-35-0-src-components` from `src/components/CricketIllustrations.jsx`. Evidence: src/components/CricketIllustrations.jsx:Lines, src/components/CricketIllustrations.jsx:calls, temp_extraction/src/components/CricketIllustrations.jsx:calls
- `List` [LOW] used by `subsystem-33-0-src-components` from `src/components/screens/ScoutingHubScreen.jsx`. Evidence: src/components/screens/ScoutingHubScreen.jsx:List, src/components/screens/ScoutingHubScreen.jsx:calls, src/components/selection/SelectionWorkspace.jsx:calls
- `MatchDetailScreen` [LOW] used by `subsystem-69-0-src-components` from `src/components/screens/MatchDetailScreen.jsx`. Evidence: src/components/screens/MatchDetailScreen.jsx:MatchDetailScreen, src/components/screens/MatchDetailScreen.jsx:calls, temp_extraction/src/components/screens/MatchDetailScreen.jsx:calls
- `MatchFolder` [LOW] used by `subsystem-119-0-temp-extraction` from `temp_extraction/src/components/ui/MatchFolder.jsx`. Evidence: temp_extraction/src/components/ui/MatchFolder.jsx:MatchFolder, temp_extraction/src/components/ui/MatchFolder.jsx:calls
- `MatchMediaReport` [LOW] used by `subsystem-58-0-src-components` from `src/components/ui/MatchMediaReport.jsx`. Evidence: src/components/ui/MatchMediaReport.jsx:MatchMediaReport, src/components/ui/MatchMediaReport.jsx:calls, temp_extraction/src/components/ui/MatchMediaReport.jsx:calls
- `MatchOverviewScreen` [LOW] used by `subsystem-85-0-src-components` from `src/components/screens/MatchOverviewScreen.jsx`. Evidence: src/components/screens/MatchOverviewScreen.jsx:MatchOverviewScreen, src/components/screens/MatchOverviewScreen.jsx:calls, temp_extraction/src/components/screens/MatchOverviewScreen.jsx:calls
- `MatchResultScreen` [LOW] used by `subsystem-62-0-src-components` from `src/components/screens/MatchResultScreen.jsx`. Evidence: src/components/screens/MatchResultScreen.jsx:MatchResultScreen, src/components/screens/MatchResultScreen.jsx:calls, temp_extraction/src/components/screens/MatchResultScreen.jsx:calls
- `MatchScorecard` [LOW] used by `subsystem-2-0-src-components` from `src/components/ui/MatchScorecard.jsx`. Evidence: src/components/ui/MatchScorecard.jsx:MatchScorecard, src/components/ui/MatchScorecard.jsx:calls, temp_extraction/src/components/ui/MatchScorecard.jsx:calls
- `MatchSetupScreen` [LOW] used by `subsystem-3-0-src-components` from `src/components/screens/MatchSetupScreen.jsx`. Evidence: src/components/screens/MatchSetupScreen.jsx:MatchSetupScreen, src/components/screens/MatchSetupScreen.jsx:calls, temp_extraction/src/components/screens/MatchSetupScreen.jsx:calls
- `Matches` [LOW] used by `subsystem-2-0-src-components` from `src/components/screens/ScoringScreen.jsx`. Evidence: src/components/screens/ScoringScreen.jsx:Matches, src/components/screens/ScoringScreen.jsx:calls
- `MatchesScreen` [LOW] used by `subsystem-54-0-src-components` from `src/components/screens/MatchesScreen.jsx`. Evidence: src/components/screens/MatchesScreen.jsx:MatchesScreen, src/components/screens/MatchesScreen.jsx:calls, temp_extraction/src/components/screens/MatchesScreen.jsx:calls
- `Math.ceil` [LOW] used by `subsystem-6-0-src-components` from `src/components/selection/PerformanceGraphs.jsx`. Evidence: src/components/selection/PerformanceGraphs.jsx:Math.ceil, src/components/selection/PerformanceGraphs.jsx:calls
- `Math.min` [LOW] used by `subsystem-6-0-src-components` from `src/components/selection/PerformanceGraphs.jsx`. Evidence: src/components/selection/PerformanceGraphs.jsx:Math.min, src/components/selection/PerformanceGraphs.jsx:calls, src/components/selection/SelectionWorkspace.jsx:calls
- `Math.random` [LOW] used by `subsystem-1-0-src-context` from `src/context/CricketContext.jsx`. Evidence: src/context/CricketContext.jsx:Math.random, src/context/CricketContext.jsx:calls, temp_extraction/src/context/CricketContext.jsx:calls
- `Mercer` [LOW] used by `subsystem-20-0-temp-extraction` from `temp_extraction/src/data/mockData.js`. Evidence: temp_extraction/src/data/mockData.js:Mercer, temp_extraction/src/data/mockData.js:calls
- `Modal` [LOW] used by `subsystem-116-0-src-components` from `src/components/ui/Modal.jsx`. Evidence: src/components/ui/Modal.jsx:Modal, src/components/ui/Modal.jsx:calls
- `NAV_ITEMS.filter` [LOW] used by `subsystem-78-0-src-components` from `src/components/Sidebar.jsx`. Evidence: src/components/Sidebar.jsx:NAV_ITEMS.filter, src/components/Sidebar.jsx:calls, temp_extraction/src/components/Sidebar.jsx:calls
- `NewsScreen` [LOW] used by `subsystem-39-0-src-components` from `src/components/screens/NewsScreen.jsx`. Evidence: src/components/screens/NewsScreen.jsx:NewsScreen, src/components/screens/NewsScreen.jsx:calls
- `Notification.requestPermission` [LOW] used by `subsystem-28-0-src-components` from `src/components/NotificationPrompt.jsx`. Evidence: src/components/NotificationPrompt.jsx:Notification.requestPermission, src/components/NotificationPrompt.jsx:calls
- `NotificationPrompt` [LOW] used by `subsystem-28-0-src-components` from `src/components/NotificationPrompt.jsx`. Evidence: src/components/NotificationPrompt.jsx:NotificationPrompt, src/components/NotificationPrompt.jsx:calls
- `Number.isFinite` [LOW] used by `subsystem-1-0-src-context` from `src/context/CricketContext.jsx`. Evidence: src/context/CricketContext.jsx:Number.isFinite, src/context/CricketContext.jsx:calls, src/context/CricketContext.jsx:calls
- `Object.entries` [LOW] used by `subsystem-49-0-src-engine` from `src/engine/matchHighlights.js`. Evidence: src/engine/matchHighlights.js:Object.entries, src/engine/matchHighlights.js:calls
- `Officials` [LOW] used by `subsystem-3-0-src-components` from `src/components/screens/MatchSetupScreen.jsx`. Evidence: src/components/screens/MatchSetupScreen.jsx:Officials, src/components/screens/MatchSetupScreen.jsx:calls
- `Only` [LOW] used by `subsystem-33-0-src-components` from `src/components/screens/ScoutingHubScreen.jsx`. Evidence: src/components/screens/ScoutingHubScreen.jsx:Only, src/components/screens/ScoutingHubScreen.jsx:calls, temp_extraction/src/components/screens/ScoutingHubScreen.jsx:calls
- `Openers` [LOW] used by `subsystem-3-0-src-components` from `src/components/screens/MatchSetupScreen.jsx`. Evidence: src/components/screens/MatchSetupScreen.jsx:Openers, src/components/screens/MatchSetupScreen.jsx:calls
- `Operational` [LOW] used by `subsystem-7-0-src-components` from `src/components/screens/AdministrationScreen.jsx`. Evidence: src/components/screens/AdministrationScreen.jsx:Operational, src/components/screens/AdministrationScreen.jsx:calls, temp_extraction/src/components/screens/AdministrationScreen.jsx:calls
- `Over` [LOW] used by `subsystem-3-0-src-components` from `temp_extraction/src/components/screens/MatchSetupScreen.jsx`. Evidence: temp_extraction/src/components/screens/MatchSetupScreen.jsx:Over, temp_extraction/src/components/screens/MatchSetupScreen.jsx:calls
- `Overs` [LOW] used by `subsystem-3-0-src-components` from `src/components/screens/MatchSetupScreen.jsx`. Evidence: src/components/screens/MatchSetupScreen.jsx:Overs, src/components/screens/MatchSetupScreen.jsx:calls, src/components/screens/MatchSetupScreen.jsx:calls
- `PRIMARY_TABS.filter` [LOW] used by `subsystem-96-0-temp-extraction` from `temp_extraction/src/components/BottomNav.jsx`. Evidence: temp_extraction/src/components/BottomNav.jsx:PRIMARY_TABS.filter, temp_extraction/src/components/BottomNav.jsx:calls
- `Pandey` [LOW] used by `subsystem-20-0-temp-extraction` from `temp_extraction/src/data/mockData.js`. Evidence: temp_extraction/src/data/mockData.js:Pandey, temp_extraction/src/data/mockData.js:calls, temp_extraction/src/data/mockData.js:calls
- `Panel` [LOW] used by `subsystem-20-0-temp-extraction` from `temp_extraction/src/data/mockData.js`. Evidence: temp_extraction/src/data/mockData.js:Panel, temp_extraction/src/data/mockData.js:calls
- `Pathak` [LOW] used by `subsystem-20-0-temp-extraction` from `temp_extraction/src/data/mockData.js`. Evidence: temp_extraction/src/data/mockData.js:Pathak, temp_extraction/src/data/mockData.js:calls
- `PerformanceGraphs` [LOW] used by `subsystem-6-0-src-components` from `src/components/selection/PerformanceGraphs.jsx`. Evidence: src/components/selection/PerformanceGraphs.jsx:PerformanceGraphs, src/components/selection/PerformanceGraphs.jsx:calls
- `Performers` [LOW] used by `subsystem-22-0-src-components` from `src/components/screens/HomeScreen.jsx`. Evidence: src/components/screens/HomeScreen.jsx:Performers, src/components/screens/HomeScreen.jsx:calls
- `Played` [LOW] used by `subsystem-59-0-temp-extraction` from `temp_extraction/src/components/screens/PlayerProfileScreen.jsx`. Evidence: temp_extraction/src/components/screens/PlayerProfileScreen.jsx:Played, temp_extraction/src/components/screens/PlayerProfileScreen.jsx:calls
- `Player` [LOW] used by `subsystem-3-0-src-components` from `temp_extraction/src/components/screens/MatchSetupScreen.jsx`. Evidence: temp_extraction/src/components/screens/MatchSetupScreen.jsx:Player, temp_extraction/src/components/screens/MatchSetupScreen.jsx:calls
- `PlayerComparison` [LOW] used by `subsystem-113-0-src-components` from `src/components/selection/PlayerComparison.jsx`. Evidence: src/components/selection/PlayerComparison.jsx:PlayerComparison, src/components/selection/PlayerComparison.jsx:calls
- `PlayerComparisonModal` [LOW] used by `subsystem-76-0-src-components` from `src/components/screens/PlayerComparisonModal.jsx`. Evidence: src/components/screens/PlayerComparisonModal.jsx:PlayerComparisonModal, src/components/screens/PlayerComparisonModal.jsx:calls, temp_extraction/src/components/screens/PlayerComparisonModal.jsx:calls
- `PlayerDetail` [LOW] used by `subsystem-6-0-src-components` from `src/components/selection/PlayerDetail.jsx`. Evidence: src/components/selection/PlayerDetail.jsx:PlayerDetail, src/components/selection/PlayerDetail.jsx:calls
- `PlayerList` [LOW] used by `subsystem-94-0-src-components` from `src/components/selection/PlayerList.jsx`. Evidence: src/components/selection/PlayerList.jsx:PlayerList, src/components/selection/PlayerList.jsx:calls
- `PlayerPool` [LOW] used by `subsystem-44-0-src-components` from `src/components/selection/PlayerPool.jsx`. Evidence: src/components/selection/PlayerPool.jsx:PlayerPool, src/components/selection/PlayerPool.jsx:calls
- `PlayerProfileScreen` [LOW] used by `subsystem-56-0-src-components` from `src/components/screens/PlayerProfileScreen.jsx`. Evidence: src/components/screens/PlayerProfileScreen.jsx:PlayerProfileScreen, src/components/screens/PlayerProfileScreen.jsx:calls, temp_extraction/src/components/screens/PlayerProfileScreen.jsx:calls
- `PlayerRegistrationSchema.safeParse` [LOW] used by `subsystem-65-0-src-components` from `src/components/screens/PlayerRegistrationScreen.jsx`. Evidence: src/components/screens/PlayerRegistrationScreen.jsx:PlayerRegistrationSchema.safeParse, src/components/screens/PlayerRegistrationScreen.jsx:calls, temp_extraction/src/components/screens/PlayerRegistrationScreen.jsx:calls
- `PlayerRegistrationScreen` [LOW] used by `subsystem-11-0-src-components` from `src/components/screens/PlayerRegistrationScreen.jsx`. Evidence: src/components/screens/PlayerRegistrationScreen.jsx:PlayerRegistrationScreen, src/components/screens/PlayerRegistrationScreen.jsx:calls, temp_extraction/src/components/screens/PlayerRegistrationScreen.jsx:calls
- `Players` [LOW] used by `subsystem-20-0-temp-extraction` from `temp_extraction/src/data/mockData.js`. Evidence: temp_extraction/src/data/mockData.js:Players, temp_extraction/src/data/mockData.js:calls
- `PlayersScreen` [LOW] used by `subsystem-32-0-src-components` from `src/components/screens/PlayersScreen.jsx`. Evidence: src/components/screens/PlayersScreen.jsx:PlayersScreen, src/components/screens/PlayersScreen.jsx:calls, temp_extraction/src/components/screens/PlayersScreen.jsx:calls
- `Privileges` [LOW] used by `subsystem-64-0-temp-extraction` from `temp_extraction/src/components/screens/AdministrationScreen.jsx`. Evidence: temp_extraction/src/components/screens/AdministrationScreen.jsx:Privileges, temp_extraction/src/components/screens/AdministrationScreen.jsx:calls
- `Progress` [LOW] used by `subsystem-51-0-src-components` from `src/components/selection/SelectedTeam.jsx`. Evidence: src/components/selection/SelectedTeam.jsx:Progress, src/components/selection/SelectedTeam.jsx:calls
- `Promise.allSettled` [LOW] used by `subsystem-5-0-src-context` from `src/context/CricketContext.jsx`. Evidence: src/context/CricketContext.jsx:Promise.allSettled, src/context/CricketContext.jsx:calls
- `ProtectedRoute` [LOW] used by `subsystem-83-0-src-components` from `src/components/ProtectedRoute.jsx`. Evidence: src/components/ProtectedRoute.jsx:ProtectedRoute, src/components/ProtectedRoute.jsx:calls, temp_extraction/src/components/ProtectedRoute.jsx:calls
- `QUICK_RUNS.map` [LOW] used by `subsystem-2-0-src-components` from `src/components/screens/ScoringScreen.jsx`. Evidence: src/components/screens/ScoringScreen.jsx:QUICK_RUNS.map, src/components/screens/ScoringScreen.jsx:calls, temp_extraction/src/components/screens/ScoringScreen.jsx:calls
- `ROLES.map` [LOW] used by `subsystem-65-0-src-components` from `src/components/screens/PlayerRegistrationScreen.jsx`. Evidence: src/components/screens/PlayerRegistrationScreen.jsx:ROLES.map, src/components/screens/PlayerRegistrationScreen.jsx:calls, temp_extraction/src/components/screens/AdministrationScreen.jsx:calls
- `ROLE_FILTERS.map` [LOW] used by `subsystem-30-0-src-components` from `src/components/screens/SelectionScreen.jsx`. Evidence: src/components/screens/SelectionScreen.jsx:ROLE_FILTERS.map, src/components/screens/SelectionScreen.jsx:calls, temp_extraction/src/components/screens/SelectionScreen.jsx:calls
- `ROUNDER` [LOW] used by `subsystem-6-0-src-components` from `src/components/selection/PerformanceGraphs.jsx`. Evidence: src/components/selection/PerformanceGraphs.jsx:ROUNDER, src/components/selection/PerformanceGraphs.jsx:calls, src/components/selection/PerformanceGraphs.jsx:calls
- `React.useEffect` [LOW] used by `subsystem-123-0-src-components` from `src/components/screens/MatchSetupScreen.jsx`. Evidence: src/components/screens/MatchSetupScreen.jsx:React.useEffect, src/components/screens/MatchSetupScreen.jsx:calls, src/components/ui/TeamManagerModal.jsx:calls
- `React.useMemo` [LOW] used by `subsystem-36-0-src-components` from `src/components/ui/DataTable.jsx`. Evidence: src/components/ui/DataTable.jsx:React.useMemo, src/components/ui/DataTable.jsx:calls, temp_extraction/src/components/ui/DataTable.jsx:calls
- `React.useRef` [LOW] used by `subsystem-2-0-src-components` from `src/components/screens/ScoringScreen.jsx`. Evidence: src/components/screens/ScoringScreen.jsx:React.useRef, src/components/screens/ScoringScreen.jsx:calls
- `ReactDOM.createRoot` [LOW] used by `subsystem-25-0-src-main-jsx` from `src/main.jsx`. Evidence: src/main.jsx:ReactDOM.createRoot, src/main.jsx:calls, temp_extraction/src/main.jsx:calls
- `RecycleBinTab` [LOW] used by `subsystem-40-0-src-components` from `src/components/screens/RecycleBinTab.jsx`. Evidence: src/components/screens/RecycleBinTab.jsx:RecycleBinTab, src/components/screens/RecycleBinTab.jsx:calls
- `Representative` [LOW] used by `subsystem-9-0-src-components` from `src/components/screens/TeamsScreen.jsx`. Evidence: src/components/screens/TeamsScreen.jsx:Representative, src/components/screens/TeamsScreen.jsx:calls
- `Response` [LOW] used by `subsystem-17-0-supabase` from `supabase/functions/send-push/index.ts`. Evidence: supabase/functions/send-push/index.ts:Response, supabase/functions/send-push/index.ts:calls, supabase/functions/send-push/index.ts:calls
- `Rohan` [LOW] used by `subsystem-98-0-temp-extraction` from `temp_extraction/src/context/CricketContext.jsx`. Evidence: temp_extraction/src/context/CricketContext.jsx:Rohan, temp_extraction/src/context/CricketContext.jsx:calls
- `Rotation` [LOW] used by `subsystem-23-0-src-engine` from `src/engine/cricketStateMachine.js`. Evidence: src/engine/cricketStateMachine.js:Rotation, src/engine/cricketStateMachine.js:calls, temp_extraction/src/engine/cricketStateMachine.js:calls
- `Runs` [LOW] used by `subsystem-3-0-src-components` from `src/components/screens/MatchSetupScreen.jsx`. Evidence: src/components/screens/MatchSetupScreen.jsx:Runs, src/components/screens/MatchSetupScreen.jsx:calls, temp_extraction/src/components/screens/MatchSetupScreen.jsx:calls
- `Save` [LOW] used by `subsystem-19-0-src-components` from `src/components/selection/SelectionWorkspace.jsx`. Evidence: src/components/selection/SelectionWorkspace.jsx:Save, src/components/selection/SelectionWorkspace.jsx:calls
- `Scopes` [LOW] used by `subsystem-1-0-src-context` from `src/context/CricketContext.jsx`. Evidence: src/context/CricketContext.jsx:Scopes, src/context/CricketContext.jsx:calls
- `ScorecardScreen` [LOW] used by `subsystem-70-0-src-components` from `src/components/screens/ScorecardScreen.jsx`. Evidence: src/components/screens/ScorecardScreen.jsx:ScorecardScreen, src/components/screens/ScorecardScreen.jsx:calls, temp_extraction/src/components/screens/ScorecardScreen.jsx:calls
- `ScoringScreen` [LOW] used by `subsystem-2-0-src-components` from `src/components/screens/ScoringScreen.jsx`. Evidence: src/components/screens/ScoringScreen.jsx:ScoringScreen, src/components/screens/ScoringScreen.jsx:calls, temp_extraction/src/components/screens/ScoringScreen.jsx:calls
- `ScoutingHubScreen` [LOW] used by `subsystem-33-0-src-components` from `src/components/screens/ScoutingHubScreen.jsx`. Evidence: src/components/screens/ScoutingHubScreen.jsx:ScoutingHubScreen, src/components/screens/ScoutingHubScreen.jsx:calls, temp_extraction/src/components/screens/ScoutingHubScreen.jsx:calls
- `SeasonManagementTab` [LOW] used by `subsystem-34-0-src-components` from `src/components/screens/SeasonManagementTab.jsx`. Evidence: src/components/screens/SeasonManagementTab.jsx:SeasonManagementTab, src/components/screens/SeasonManagementTab.jsx:calls
- `SeasonMigrationTab` [LOW] used by `subsystem-8-0-src-components` from `src/components/screens/SeasonMigrationTab.jsx`. Evidence: src/components/screens/SeasonMigrationTab.jsx:SeasonMigrationTab, src/components/screens/SeasonMigrationTab.jsx:calls
- `Select` [LOW] used by `subsystem-160-0-src-components` from `src/components/screens/MatchSetupScreen.jsx`. Evidence: src/components/screens/MatchSetupScreen.jsx:Select, src/components/screens/MatchSetupScreen.jsx:calls, src/components/screens/TeamRegistrationTab.jsx:calls
- `Selected` [LOW] used by `subsystem-59-0-temp-extraction` from `temp_extraction/src/components/screens/PlayerProfileScreen.jsx`. Evidence: temp_extraction/src/components/screens/PlayerProfileScreen.jsx:Selected, temp_extraction/src/components/screens/PlayerProfileScreen.jsx:calls
- `SelectedTeam` [LOW] used by `subsystem-51-0-src-components` from `src/components/selection/SelectedTeam.jsx`. Evidence: src/components/selection/SelectedTeam.jsx:SelectedTeam, src/components/selection/SelectedTeam.jsx:calls
- `SelectionFilters` [LOW] used by `subsystem-71-0-src-components` from `src/components/selection/SelectionFilters.jsx`. Evidence: src/components/selection/SelectionFilters.jsx:SelectionFilters, src/components/selection/SelectionFilters.jsx:calls
- `SelectionScreen` [LOW] used by `subsystem-30-0-src-components` from `src/components/screens/SelectionScreen.jsx`. Evidence: src/components/screens/SelectionScreen.jsx:SelectionScreen, src/components/screens/SelectionScreen.jsx:calls, temp_extraction/src/components/screens/SelectionScreen.jsx:calls
- `SelectionWorkspace` [LOW] used by `subsystem-19-0-src-components` from `src/components/selection/SelectionWorkspace.jsx`. Evidence: src/components/selection/SelectionWorkspace.jsx:SelectionWorkspace, src/components/selection/SelectionWorkspace.jsx:calls
- `Selector` [LOW] used by `subsystem-1-0-src-context` from `src/context/CricketContext.jsx`. Evidence: src/context/CricketContext.jsx:Selector, src/context/CricketContext.jsx:calls
- `SelectorAssignmentModal` [LOW] used by `subsystem-31-0-src-components` from `src/components/screens/SelectorAssignmentModal.jsx`. Evidence: src/components/screens/SelectorAssignmentModal.jsx:SelectorAssignmentModal, src/components/screens/SelectorAssignmentModal.jsx:calls
- `SelectorsScreen` [LOW] used by `subsystem-77-0-src-components` from `src/components/screens/SelectorsScreen.jsx`. Evidence: src/components/screens/SelectorsScreen.jsx:SelectorsScreen, src/components/screens/SelectorsScreen.jsx:calls, temp_extraction/src/components/screens/SelectorsScreen.jsx:calls
- `Shape` [LOW] used by `subsystem-35-0-src-components` from `src/components/CricketIllustrations.jsx`. Evidence: src/components/CricketIllustrations.jsx:Shape, src/components/CricketIllustrations.jsx:calls, temp_extraction/src/components/CricketIllustrations.jsx:calls
- `Shortlist` [LOW] used by `subsystem-95-0-src-components` from `src/components/selection/Shortlist.jsx`. Evidence: src/components/selection/Shortlist.jsx:Shortlist, src/components/selection/Shortlist.jsx:calls
- `Shukla` [LOW] used by `subsystem-20-0-temp-extraction` from `temp_extraction/src/data/mockData.js`. Evidence: temp_extraction/src/data/mockData.js:Shukla, temp_extraction/src/data/mockData.js:calls
- `Sidebar` [LOW] used by `subsystem-78-0-src-components` from `src/components/Sidebar.jsx`. Evidence: src/components/Sidebar.jsx:Sidebar, src/components/Sidebar.jsx:calls, temp_extraction/src/components/Sidebar.jsx:calls
- `Size` [LOW] used by `subsystem-57-0-src-components` from `src/components/selection/CreateTeamModal.jsx`. Evidence: src/components/selection/CreateTeamModal.jsx:Size, src/components/selection/CreateTeamModal.jsx:calls
- `Skeleton` [LOW] used by `subsystem-117-0-src-components` from `src/components/ui/Skeleton.jsx`. Evidence: src/components/ui/Skeleton.jsx:Skeleton, src/components/ui/Skeleton.jsx:calls
- `Spin` [LOW] used by `subsystem-20-0-temp-extraction` from `temp_extraction/src/data/mockData.js`. Evidence: temp_extraction/src/data/mockData.js:Spin, temp_extraction/src/data/mockData.js:calls, temp_extraction/src/data/mockData.js:calls
- `Squad` [LOW] used by `subsystem-30-0-src-components` from `src/components/screens/SelectionScreen.jsx`. Evidence: src/components/screens/SelectionScreen.jsx:Squad, src/components/screens/SelectionScreen.jsx:calls, temp_extraction/src/components/screens/SelectionScreen.jsx:calls
- `Standings` [LOW] used by `subsystem-15-0-src-components` from `src/components/screens/TournamentsScreen.jsx`. Evidence: src/components/screens/TournamentsScreen.jsx:Standings, src/components/screens/TournamentsScreen.jsx:calls
- `Stats` [LOW] used by `subsystem-9-0-src-components` from `src/components/screens/TeamsScreen.jsx`. Evidence: src/components/screens/TeamsScreen.jsx:Stats, src/components/screens/TeamsScreen.jsx:calls, temp_extraction/src/components/ui/StatCard.jsx:calls
- `String` [LOW] used by `subsystem-3-0-src-components` from `src/components/screens/InningsInitScreen.jsx`. Evidence: src/components/screens/InningsInitScreen.jsx:String, src/components/screens/InningsInitScreen.jsx:calls, src/components/screens/InningsInitScreen.jsx:calls
- `Strip` [LOW] used by `subsystem-9-0-src-components` from `src/components/screens/TeamsScreen.jsx`. Evidence: src/components/screens/TeamsScreen.jsx:Strip, src/components/screens/TeamsScreen.jsx:calls
- `Students` [LOW] used by `subsystem-77-0-src-components` from `src/components/screens/SelectorsScreen.jsx`. Evidence: src/components/screens/SelectorsScreen.jsx:Students, src/components/screens/SelectorsScreen.jsx:calls, temp_extraction/src/components/screens/SelectorsScreen.jsx:calls
- `Stumps` [LOW] used by `subsystem-35-0-src-components` from `src/components/CricketIllustrations.jsx`. Evidence: src/components/CricketIllustrations.jsx:Stumps, src/components/CricketIllustrations.jsx:calls, temp_extraction/src/components/CricketIllustrations.jsx:calls
- `Switch` [LOW] used by `subsystem-33-0-src-components` from `src/components/screens/ScoutingHubScreen.jsx`. Evidence: src/components/screens/ScoutingHubScreen.jsx:Switch, src/components/screens/ScoutingHubScreen.jsx:calls, temp_extraction/src/components/screens/ScoutingHubScreen.jsx:calls
- `TEAM_CATEGORIES.find` [LOW] used by `subsystem-57-0-src-components` from `src/components/selection/CreateTeamModal.jsx`. Evidence: src/components/selection/CreateTeamModal.jsx:TEAM_CATEGORIES.find, src/components/selection/CreateTeamModal.jsx:calls
- `TEAM_CATEGORIES.map` [LOW] used by `subsystem-57-0-src-components` from `src/components/selection/CreateTeamModal.jsx`. Evidence: src/components/selection/CreateTeamModal.jsx:TEAM_CATEGORIES.map, src/components/selection/CreateTeamModal.jsx:calls
- `TOURNAMENTS` [LOW] used by `subsystem-20-0-temp-extraction` from `temp_extraction/src/data/mockData.js`. Evidence: temp_extraction/src/data/mockData.js:TOURNAMENTS, temp_extraction/src/data/mockData.js:calls
- `Teal` [LOW] used by `subsystem-44-0-src-components` from `src/components/selection/PlayerPool.jsx`. Evidence: src/components/selection/PlayerPool.jsx:Teal, src/components/selection/PlayerPool.jsx:calls
- `TeamManagerModal` [LOW] used by `subsystem-63-0-src-components` from `src/components/ui/TeamManagerModal.jsx`. Evidence: src/components/ui/TeamManagerModal.jsx:TeamManagerModal, src/components/ui/TeamManagerModal.jsx:calls
- `TeamRegistrationTab` [LOW] used by `subsystem-24-0-src-components` from `src/components/screens/TeamRegistrationTab.jsx`. Evidence: src/components/screens/TeamRegistrationTab.jsx:TeamRegistrationTab, src/components/screens/TeamRegistrationTab.jsx:calls
- `TeamSelectionDashboard` [LOW] used by `subsystem-48-0-src-components` from `src/components/selection/TeamSelectionDashboard.jsx`. Evidence: src/components/selection/TeamSelectionDashboard.jsx:TeamSelectionDashboard, src/components/selection/TeamSelectionDashboard.jsx:calls
- `Teams` [LOW] used by `subsystem-3-0-src-components` from `src/components/screens/MatchSetupScreen.jsx`. Evidence: src/components/screens/MatchSetupScreen.jsx:Teams, src/components/screens/MatchSetupScreen.jsx:calls
- `TeamsScreen` [LOW] used by `subsystem-9-0-src-components` from `src/components/screens/TeamsScreen.jsx`. Evidence: src/components/screens/TeamsScreen.jsx:TeamsScreen, src/components/screens/TeamsScreen.jsx:calls
- `To` [LOW] used by `subsystem-3-0-src-components` from `temp_extraction/src/components/screens/MatchSetupScreen.jsx`. Evidence: temp_extraction/src/components/screens/MatchSetupScreen.jsx:To, temp_extraction/src/components/screens/MatchSetupScreen.jsx:calls, temp_extraction/src/components/screens/MatchSetupScreen.jsx:calls
- `Toss` [LOW] used by `subsystem-3-0-src-components` from `src/components/screens/MatchSetupScreen.jsx`. Evidence: src/components/screens/MatchSetupScreen.jsx:Toss, src/components/screens/MatchSetupScreen.jsx:calls
- `TournamentManagerModal` [LOW] used by `subsystem-45-0-src-components` from `src/components/ui/TournamentManagerModal.jsx`. Evidence: src/components/ui/TournamentManagerModal.jsx:TournamentManagerModal, src/components/ui/TournamentManagerModal.jsx:calls
- `TournamentsScreen` [LOW] used by `subsystem-15-0-src-components` from `src/components/screens/TournamentsScreen.jsx`. Evidence: src/components/screens/TournamentsScreen.jsx:TournamentsScreen, src/components/screens/TournamentsScreen.jsx:calls, temp_extraction/src/components/screens/TournamentsScreen.jsx:calls
- `Trend` [LOW] used by `subsystem-6-0-src-components` from `src/components/selection/PerformanceGraphs.jsx`. Evidence: src/components/selection/PerformanceGraphs.jsx:Trend, src/components/selection/PerformanceGraphs.jsx:calls
- `URLs` [LOW] used by `subsystem-12-0-src-components` from `src/components/ui/CloudinaryAvatar.jsx`. Evidence: src/components/ui/CloudinaryAvatar.jsx:URLs, src/components/ui/CloudinaryAvatar.jsx:calls, src/components/ui/CloudinaryAvatar.jsx:calls
- `Uint8Array` [LOW] used by `subsystem-28-0-src-components` from `src/components/NotificationPrompt.jsx`. Evidence: src/components/NotificationPrompt.jsx:Uint8Array, src/components/NotificationPrompt.jsx:calls
- `Umpire` [LOW] used by `subsystem-3-0-src-components` from `src/components/screens/MatchSetupScreen.jsx`. Evidence: src/components/screens/MatchSetupScreen.jsx:Umpire, src/components/screens/MatchSetupScreen.jsx:calls
- `Unlimited` [LOW] used by `subsystem-3-0-src-components` from `temp_extraction/src/components/screens/MatchSetupScreen.jsx`. Evidence: temp_extraction/src/components/screens/MatchSetupScreen.jsx:Unlimited, temp_extraction/src/components/screens/MatchSetupScreen.jsx:calls
- `Users` [LOW] used by `subsystem-1-0-src-context` from `src/context/CricketContext.jsx`. Evidence: src/context/CricketContext.jsx:Users, src/context/CricketContext.jsx:calls, temp_extraction/src/context/CricketContext.jsx:calls
- `Viewer` [LOW] used by `subsystem-7-0-src-components` from `src/components/screens/AdministrationScreen.jsx`. Evidence: src/components/screens/AdministrationScreen.jsx:Viewer, src/components/screens/AdministrationScreen.jsx:calls
- `Violation` [LOW] used by `subsystem-14-0-src-services` from `src/services/SyncService.js`. Evidence: src/services/SyncService.js:Violation, src/services/SyncService.js:calls
- `Violet` [LOW] used by `subsystem-44-0-src-components` from `src/components/selection/PlayerPool.jsx`. Evidence: src/components/selection/PlayerPool.jsx:Violet, src/components/selection/PlayerPool.jsx:calls
- `VitePWA` [LOW] used by `subsystem-46-0-temp-extraction` from `vite.config.ts`. Evidence: vite.config.ts:VitePWA, vite.config.ts:calls
- `Wicket` [LOW] used by `subsystem-23-0-src-engine` from `src/engine/cricketStateMachine.js`. Evidence: src/engine/cricketStateMachine.js:Wicket, src/engine/cricketStateMachine.js:calls, temp_extraction/src/engine/cricketStateMachine.js:calls
- `XI` [LOW] used by `subsystem-3-0-src-components` from `temp_extraction/src/components/screens/MatchSetupScreen.jsx`. Evidence: temp_extraction/src/components/screens/MatchSetupScreen.jsx:XI, temp_extraction/src/components/screens/MatchSetupScreen.jsx:calls
- `XIs` [LOW] used by `subsystem-3-0-src-components` from `src/components/screens/MatchSetupScreen.jsx`. Evidence: src/components/screens/MatchSetupScreen.jsx:XIs, src/components/screens/MatchSetupScreen.jsx:calls
- `YY` [LOW] used by `subsystem-34-0-src-components` from `src/components/screens/SeasonManagementTab.jsx`. Evidence: src/components/screens/SeasonManagementTab.jsx:YY, src/components/screens/SeasonManagementTab.jsx:calls
- `Yadav` [LOW] used by `subsystem-20-0-temp-extraction` from `temp_extraction/src/data/mockData.js`. Evidence: temp_extraction/src/data/mockData.js:Yadav, temp_extraction/src/data/mockData.js:calls
- `_0_0_2px_rgba` [LOW] used by `subsystem-78-0-src-components` from `src/components/Sidebar.jsx`. Evidence: src/components/Sidebar.jsx:_0_0_2px_rgba, src/components/Sidebar.jsx:calls
- `_0_15px_rgba` [LOW] used by `subsystem-47-0-src-components` from `src/components/DrawerMenu.jsx`. Evidence: src/components/DrawerMenu.jsx:_0_15px_rgba, src/components/DrawerMenu.jsx:calls
- `_0_20px_rgba` [LOW] used by `subsystem-3-0-src-components` from `src/App.jsx`. Evidence: src/App.jsx:_0_20px_rgba, src/components/screens/InningsInitScreen.jsx:calls, src/components/screens/MatchSetupScreen.jsx:calls
- `_0_6px_rgba` [LOW] used by `subsystem-47-0-src-components` from `src/components/DrawerMenu.jsx`. Evidence: src/components/DrawerMenu.jsx:_0_6px_rgba, src/components/DrawerMenu.jsx:calls
- `_2px_10px_rgba` [LOW] used by `subsystem-11-0-src-components` from `src/components/screens/MatchSetupScreen.jsx`. Evidence: src/components/screens/MatchSetupScreen.jsx:_2px_10px_rgba, src/components/screens/MatchSetupScreen.jsx:calls, src/components/screens/PlayerRegistrationScreen.jsx:calls
- `a.findIndex` [LOW] used by `subsystem-62-0-src-components` from `src/components/screens/MatchResultScreen.jsx`. Evidence: src/components/screens/MatchResultScreen.jsx:a.findIndex, src/components/screens/MatchResultScreen.jsx:calls
- `aVal.toLowerCase` [LOW] used by `subsystem-36-0-src-components` from `src/components/ui/DataTable.jsx`. Evidence: src/components/ui/DataTable.jsx:aVal.toLowerCase, src/components/ui/DataTable.jsx:calls, temp_extraction/src/components/ui/DataTable.jsx:calls
- `ac.find` [LOW] used by `subsystem-24-0-src-components` from `src/components/screens/TeamRegistrationTab.jsx`. Evidence: src/components/screens/TeamRegistrationTab.jsx:ac.find, src/components/screens/TeamRegistrationTab.jsx:calls
- `ac.includes` [LOW] used by `subsystem-11-0-src-components` from `src/components/screens/PlayerRegistrationScreen.jsx`. Evidence: src/components/screens/PlayerRegistrationScreen.jsx:ac.includes, src/components/screens/PlayerRegistrationScreen.jsx:calls
- `actions` [LOW] used by `subsystem-52-0-src-hooks` from `src/hooks/useHaptics.js`. Evidence: src/hooks/useHaptics.js:actions, src/hooks/useHaptics.js:calls
- `activePlayers.map` [LOW] used by `subsystem-8-0-src-components` from `src/components/screens/SeasonMigrationTab.jsx`. Evidence: src/components/screens/SeasonMigrationTab.jsx:activePlayers.map, src/components/screens/SeasonMigrationTab.jsx:calls
- `activeTournamentPointsTable.map` [LOW] used by `subsystem-22-0-src-components` from `src/components/screens/HomeScreen.jsx`. Evidence: src/components/screens/HomeScreen.jsx:activeTournamentPointsTable.map, src/components/screens/HomeScreen.jsx:calls
- `activeTournamentPointsTable.slice` [LOW] used by `subsystem-22-0-src-components` from `src/components/screens/HomeScreen.jsx`. Evidence: src/components/screens/HomeScreen.jsx:activeTournamentPointsTable.slice, src/components/screens/HomeScreen.jsx:calls
- `activeTournaments.map` [LOW] used by `subsystem-2-0-src-components` from `src/components/screens/ScoringScreen.jsx`. Evidence: src/components/screens/ScoringScreen.jsx:activeTournaments.map, src/components/screens/ScoringScreen.jsx:calls
- `activeXI.filter` [LOW] used by `subsystem-3-0-src-components` from `src/components/screens/MatchSetupScreen.jsx`. Evidence: src/components/screens/MatchSetupScreen.jsx:activeXI.filter, src/components/screens/MatchSetupScreen.jsx:calls
- `activeXI.find` [LOW] used by `subsystem-3-0-src-components` from `src/components/screens/MatchSetupScreen.jsx`. Evidence: src/components/screens/MatchSetupScreen.jsx:activeXI.find, src/components/screens/MatchSetupScreen.jsx:calls, src/components/screens/MatchSetupScreen.jsx:calls
- `ageCategories.filter` [LOW] used by `subsystem-24-0-src-components` from `src/components/screens/TeamRegistrationTab.jsx`. Evidence: src/components/screens/TeamRegistrationTab.jsx:ageCategories.filter, src/components/screens/TeamRegistrationTab.jsx:calls
- `ageCategories.forEach` [LOW] used by `subsystem-0-0-src-lib` from `src/lib/api.js`. Evidence: src/lib/api.js:ageCategories.forEach, src/lib/api.js:calls
- `ageCategories.map` [LOW] used by `subsystem-33-0-src-components` from `src/components/screens/ScoutingHubScreen.jsx`. Evidence: src/components/screens/ScoutingHubScreen.jsx:ageCategories.map, src/components/screens/ScoutingHubScreen.jsx:calls, temp_extraction/src/components/screens/ScoutingHubScreen.jsx:calls
- `ageGroups.map` [LOW] used by `subsystem-26-0-temp-extraction` from `temp_extraction/src/components/screens/PlayersScreen.jsx`. Evidence: temp_extraction/src/components/screens/PlayersScreen.jsx:ageGroups.map, temp_extraction/src/components/screens/PlayersScreen.jsx:calls
- `agePlayers.map` [LOW] used by `subsystem-26-0-temp-extraction` from `temp_extraction/src/components/screens/PlayersScreen.jsx`. Evidence: temp_extraction/src/components/screens/PlayersScreen.jsx:agePlayers.map, temp_extraction/src/components/screens/PlayersScreen.jsx:calls
- `alert` [LOW] used by `subsystem-7-0-src-components` from `src/components/screens/AdministrationScreen.jsx`. Evidence: src/components/screens/AdministrationScreen.jsx:alert, src/components/screens/NewsScreen.jsx:calls, src/components/screens/ScorecardScreen.jsx:calls
- `allBatters.forEach` [LOW] used by `subsystem-49-0-src-engine` from `src/engine/matchHighlights.js`. Evidence: src/engine/matchHighlights.js:allBatters.forEach, src/engine/matchHighlights.js:calls
- `allBatters.push` [LOW] used by `subsystem-49-0-src-engine` from `src/engine/matchHighlights.js`. Evidence: src/engine/matchHighlights.js:allBatters.push, src/engine/matchHighlights.js:calls, src/engine/matchHighlights.js:calls
- `allBatters.sort` [LOW] used by `subsystem-49-0-src-engine` from `src/engine/matchHighlights.js`. Evidence: src/engine/matchHighlights.js:allBatters.sort, src/engine/matchHighlights.js:calls
- `allBowlers.forEach` [LOW] used by `subsystem-49-0-src-engine` from `src/engine/matchHighlights.js`. Evidence: src/engine/matchHighlights.js:allBowlers.forEach, src/engine/matchHighlights.js:calls
- `allBowlers.push` [LOW] used by `subsystem-49-0-src-engine` from `src/engine/matchHighlights.js`. Evidence: src/engine/matchHighlights.js:allBowlers.push, src/engine/matchHighlights.js:calls, src/engine/matchHighlights.js:calls
- `allBowlers.sort` [LOW] used by `subsystem-49-0-src-engine` from `src/engine/matchHighlights.js`. Evidence: src/engine/matchHighlights.js:allBowlers.sort, src/engine/matchHighlights.js:calls
- `allItems.filter` [LOW] used by `subsystem-88-0-src-components` from `src/components/BottomNav.jsx`. Evidence: src/components/BottomNav.jsx:allItems.filter, src/components/BottomNav.jsx:calls
- `allMatchPlayers.map` [LOW] used by `subsystem-62-0-src-components` from `src/components/screens/MatchResultScreen.jsx`. Evidence: src/components/screens/MatchResultScreen.jsx:allMatchPlayers.map, src/components/screens/MatchResultScreen.jsx:calls
- `allNormalizedPlayers.filter` [LOW] used by `subsystem-19-0-src-components` from `src/components/selection/SelectionWorkspace.jsx`. Evidence: src/components/selection/SelectionWorkspace.jsx:allNormalizedPlayers.filter, src/components/selection/SelectionWorkspace.jsx:calls
- `allPlayers.filter` [LOW] used by `subsystem-48-0-src-components` from `src/components/selection/TeamSelectionDashboard.jsx`. Evidence: src/components/selection/TeamSelectionDashboard.jsx:allPlayers.filter, src/components/selection/TeamSelectionDashboard.jsx:calls, src/components/selection/TeamSelectionDashboard.jsx:calls
- `allowed.includes` [LOW] used by `subsystem-83-0-src-components` from `src/components/ProtectedRoute.jsx`. Evidence: src/components/ProtectedRoute.jsx:allowed.includes, src/components/ProtectedRoute.jsx:calls, temp_extraction/src/components/ProtectedRoute.jsx:calls
- `announcements.filter` [LOW] used by `subsystem-39-0-src-components` from `src/components/screens/NewsScreen.jsx`. Evidence: src/components/screens/NewsScreen.jsx:announcements.filter, src/components/screens/NewsScreen.jsx:calls
- `announcements.slice` [LOW] used by `subsystem-72-0-temp-extraction` from `temp_extraction/src/components/screens/HomeScreen.jsx`. Evidence: temp_extraction/src/components/screens/HomeScreen.jsx:announcements.slice, temp_extraction/src/components/screens/HomeScreen.jsx:calls
- `api.assignManOfTheMatch` [LOW] used by `subsystem-80-0-src-components` from `src/components/screens/MatchResultScreen.jsx`. Evidence: src/components/screens/MatchResultScreen.jsx:api.assignManOfTheMatch, src/components/screens/MatchResultScreen.jsx:calls
- `api.assignScorer` [LOW] used by `subsystem-61-0-src-components` from `src/components/screens/MatchDetailScreen.jsx`. Evidence: src/components/screens/MatchDetailScreen.jsx:api.assignScorer, src/components/screens/MatchDetailScreen.jsx:calls
- `api.bulkMigratePlayers` [LOW] used by `subsystem-8-0-src-components` from `src/components/screens/SeasonMigrationTab.jsx`. Evidence: src/components/screens/SeasonMigrationTab.jsx:api.bulkMigratePlayers, src/components/screens/SeasonMigrationTab.jsx:calls, src/components/screens/SeasonMigrationTab.jsx:calls
- `api.createAnnouncement` [LOW] used by `subsystem-39-0-src-components` from `src/components/screens/NewsScreen.jsx`. Evidence: src/components/screens/NewsScreen.jsx:api.createAnnouncement, src/components/screens/NewsScreen.jsx:calls
- `api.createDetailedMatches` [LOW] used by `subsystem-81-0-src-components` from `src/components/screens/TournamentsScreen.jsx`. Evidence: src/components/screens/TournamentsScreen.jsx:api.createDetailedMatches, src/components/screens/TournamentsScreen.jsx:calls, src/components/ui/TournamentManagerModal.jsx:calls
- `api.createSeason` [LOW] used by `subsystem-34-0-src-components` from `src/components/screens/SeasonManagementTab.jsx`. Evidence: src/components/screens/SeasonManagementTab.jsx:api.createSeason, src/components/screens/SeasonManagementTab.jsx:calls
- `api.createTournament` [LOW] used by `subsystem-81-0-src-components` from `src/components/screens/TournamentsScreen.jsx`. Evidence: src/components/screens/TournamentsScreen.jsx:api.createTournament, src/components/screens/TournamentsScreen.jsx:calls, src/components/ui/TournamentManagerModal.jsx:calls
- `api.deleteMatch` [LOW] used by `subsystem-61-0-src-components` from `src/components/screens/MatchDetailScreen.jsx`. Evidence: src/components/screens/MatchDetailScreen.jsx:api.deleteMatch, src/components/screens/MatchDetailScreen.jsx:calls
- `api.deletePlayer` [LOW] used by `subsystem-105-0-src-components` from `src/components/screens/PlayerProfileScreen.jsx`. Evidence: src/components/screens/PlayerProfileScreen.jsx:api.deletePlayer, src/components/screens/PlayerProfileScreen.jsx:calls
- `api.deleteTournament` [LOW] used by `subsystem-81-0-src-components` from `src/components/screens/TournamentsScreen.jsx`. Evidence: src/components/screens/TournamentsScreen.jsx:api.deleteTournament, src/components/screens/TournamentsScreen.jsx:calls
- `api.deleteUser` [LOW] used by `subsystem-7-0-src-components` from `src/components/screens/AdministrationScreen.jsx`. Evidence: src/components/screens/AdministrationScreen.jsx:api.deleteUser, src/components/screens/AdministrationScreen.jsx:calls
- `api.finalizeMatch` [LOW] used by `subsystem-1-0-src-context` from `src/context/CricketContext.jsx`. Evidence: src/context/CricketContext.jsx:api.finalizeMatch, src/context/CricketContext.jsx:calls
- `api.finalizeSquad` [LOW] used by `subsystem-92-0-src-context` from `src/context/CricketContext.jsx`. Evidence: src/context/CricketContext.jsx:api.finalizeSquad, src/context/CricketContext.jsx:calls
- `api.getAgeCategories` [LOW] used by `subsystem-8-0-src-components` from `src/components/screens/SeasonMigrationTab.jsx`. Evidence: src/components/screens/SeasonMigrationTab.jsx:api.getAgeCategories, src/components/screens/SeasonMigrationTab.jsx:calls
- `api.getAnnouncements` [LOW] used by `subsystem-5-0-src-context` from `src/context/CricketContext.jsx`. Evidence: src/context/CricketContext.jsx:api.getAnnouncements, src/context/CricketContext.jsx:calls
- `api.getDefaults` [LOW] used by `subsystem-21-0-src-components` from `src/components/screens/TeamRegistrationTab.jsx`. Evidence: src/components/screens/TeamRegistrationTab.jsx:api.getDefaults, src/components/screens/TeamRegistrationTab.jsx:calls
- `api.getMatchScorecard` [LOW] used by `subsystem-80-0-src-components` from `src/components/screens/MatchResultScreen.jsx`. Evidence: src/components/screens/MatchResultScreen.jsx:api.getMatchScorecard, src/components/screens/MatchResultScreen.jsx:calls, src/components/screens/MatchResultScreen.jsx:calls
- `api.getOrCreateInnings` [LOW] used by `subsystem-5-0-src-context` from `src/context/CricketContext.jsx`. Evidence: src/context/CricketContext.jsx:api.getOrCreateInnings, src/context/CricketContext.jsx:calls
- `api.getPlayerMatchStats` [LOW] used by `subsystem-56-0-src-components` from `src/components/screens/PlayerProfileScreen.jsx`. Evidence: src/components/screens/PlayerProfileScreen.jsx:api.getPlayerMatchStats, src/components/screens/PlayerProfileScreen.jsx:calls
- `api.getPlayersBySeason` [LOW] used by `subsystem-8-0-src-components` from `src/components/screens/SeasonMigrationTab.jsx`. Evidence: src/components/screens/SeasonMigrationTab.jsx:api.getPlayersBySeason, src/components/screens/SeasonMigrationTab.jsx:calls, src/components/screens/SeasonMigrationTab.jsx:calls
- `api.getProfiles` [LOW] used by `subsystem-7-0-src-components` from `src/components/screens/AdministrationScreen.jsx`. Evidence: src/components/screens/AdministrationScreen.jsx:api.getProfiles, src/components/screens/AdministrationScreen.jsx:calls, src/components/screens/AdministrationScreen.jsx:calls
- `api.getRecycleBinItems` [LOW] used by `subsystem-40-0-src-components` from `src/components/screens/RecycleBinTab.jsx`. Evidence: src/components/screens/RecycleBinTab.jsx:api.getRecycleBinItems, src/components/screens/RecycleBinTab.jsx:calls
- `api.getSeasons` [LOW] used by `subsystem-34-0-src-components` from `src/components/screens/SeasonManagementTab.jsx`. Evidence: src/components/screens/SeasonManagementTab.jsx:api.getSeasons, src/components/screens/SeasonManagementTab.jsx:calls, src/components/ui/TeamManagerModal.jsx:calls
- `api.getSelectionCandidates` [LOW] used by `subsystem-1-0-src-context` from `src/context/CricketContext.jsx`. Evidence: src/context/CricketContext.jsx:api.getSelectionCandidates, src/context/CricketContext.jsx:calls
- `api.getSelectionProcesses` [LOW] used by `subsystem-31-0-src-components` from `src/components/screens/SelectorAssignmentModal.jsx`. Evidence: src/components/screens/SelectorAssignmentModal.jsx:api.getSelectionProcesses, src/components/screens/SelectorAssignmentModal.jsx:calls, src/context/CricketContext.jsx:calls
- `api.getSelectorAssignments` [LOW] used by `subsystem-31-0-src-components` from `src/components/screens/SelectorAssignmentModal.jsx`. Evidence: src/components/screens/SelectorAssignmentModal.jsx:api.getSelectorAssignments, src/components/screens/SelectorAssignmentModal.jsx:calls
- `api.hardDeleteItem` [LOW] used by `subsystem-40-0-src-components` from `src/components/screens/RecycleBinTab.jsx`. Evidence: src/components/screens/RecycleBinTab.jsx:api.hardDeleteItem, src/components/screens/RecycleBinTab.jsx:calls
- `api.hydrateLiveMatch` [LOW] used by `subsystem-1-0-src-context` from `src/context/CricketContext.jsx`. Evidence: src/context/CricketContext.jsx:api.hydrateLiveMatch, src/context/CricketContext.jsx:calls
- `api.persistMatchSetup` [LOW] used by `subsystem-3-0-src-components` from `src/components/screens/MatchSetupScreen.jsx`. Evidence: src/components/screens/MatchSetupScreen.jsx:api.persistMatchSetup, src/components/screens/MatchSetupScreen.jsx:calls
- `api.rebuildTeams` [LOW] used by `subsystem-90-0-src-components` from `src/components/screens/TeamsScreen.jsx`. Evidence: src/components/screens/TeamsScreen.jsx:api.rebuildTeams, src/components/screens/TeamsScreen.jsx:calls
- `api.resetUserPassword` [LOW] used by `subsystem-7-0-src-components` from `src/components/screens/AdministrationScreen.jsx`. Evidence: src/components/screens/AdministrationScreen.jsx:api.resetUserPassword, src/components/screens/AdministrationScreen.jsx:calls
- `api.restoreItem` [LOW] used by `subsystem-40-0-src-components` from `src/components/screens/RecycleBinTab.jsx`. Evidence: src/components/screens/RecycleBinTab.jsx:api.restoreItem, src/components/screens/RecycleBinTab.jsx:calls
- `api.setActiveSeason` [LOW] used by `subsystem-34-0-src-components` from `src/components/screens/SeasonManagementTab.jsx`. Evidence: src/components/screens/SeasonManagementTab.jsx:api.setActiveSeason, src/components/screens/SeasonManagementTab.jsx:calls
- `api.toggleCandidate` [LOW] used by `subsystem-1-0-src-context` from `src/context/CricketContext.jsx`. Evidence: src/context/CricketContext.jsx:api.toggleCandidate, src/context/CricketContext.jsx:calls
- `api.updateSelectorAssignments` [LOW] used by `subsystem-31-0-src-components` from `src/components/screens/SelectorAssignmentModal.jsx`. Evidence: src/components/screens/SelectorAssignmentModal.jsx:api.updateSelectorAssignments, src/components/screens/SelectorAssignmentModal.jsx:calls
- `api.updateTournament` [LOW] used by `subsystem-81-0-src-components` from `src/components/screens/TournamentsScreen.jsx`. Evidence: src/components/screens/TournamentsScreen.jsx:api.updateTournament, src/components/screens/TournamentsScreen.jsx:calls, src/components/ui/TournamentManagerModal.jsx:calls
- `api.updateUserPermissions` [LOW] used by `subsystem-7-0-src-components` from `src/components/screens/AdministrationScreen.jsx`. Evidence: src/components/screens/AdministrationScreen.jsx:api.updateUserPermissions, src/components/screens/AdministrationScreen.jsx:calls
- `api.updateUserRole` [LOW] used by `subsystem-7-0-src-components` from `src/components/screens/AdministrationScreen.jsx`. Evidence: src/components/screens/AdministrationScreen.jsx:api.updateUserRole, src/components/screens/AdministrationScreen.jsx:calls, src/components/screens/AdministrationScreen.jsx:calls
- `api.updateUserStatus` [LOW] used by `subsystem-7-0-src-components` from `src/components/screens/AdministrationScreen.jsx`. Evidence: src/components/screens/AdministrationScreen.jsx:api.updateUserStatus, src/components/screens/AdministrationScreen.jsx:calls
- `assignManOfTheMatch` [LOW] used by `subsystem-0-0-src-lib` from `src/lib/api.js`. Evidence: src/lib/api.js:assignManOfTheMatch, src/lib/api.js:calls
- `assignScorer` [LOW] used by `subsystem-0-0-src-lib` from `src/lib/api.js`. Evidence: src/lib/api.js:assignScorer, src/lib/api.js:calls
- `assignments.find` [LOW] used by `subsystem-31-0-src-components` from `src/components/screens/SelectorAssignmentModal.jsx`. Evidence: src/components/screens/SelectorAssignmentModal.jsx:assignments.find, src/components/screens/SelectorAssignmentModal.jsx:calls
- `assignments.map` [LOW] used by `subsystem-0-0-src-lib` from `src/lib/api.js`. Evidence: src/lib/api.js:assignments.map, src/lib/api.js:calls
- `assignments.some` [LOW] used by `subsystem-31-0-src-components` from `src/components/screens/SelectorAssignmentModal.jsx`. Evidence: src/components/screens/SelectorAssignmentModal.jsx:assignments.some, src/components/screens/SelectorAssignmentModal.jsx:calls
- `auth.getSession` [LOW] used by `subsystem-5-0-src-context` from `src/context/CricketContext.jsx`. Evidence: src/context/CricketContext.jsx:auth.getSession, src/context/CricketContext.jsx:calls
- `auth.getUser` [LOW] used by `subsystem-21-0-src-components` from `src/components/screens/TeamRegistrationTab.jsx`. Evidence: src/components/screens/TeamRegistrationTab.jsx:auth.getUser, src/components/screens/TeamRegistrationTab.jsx:calls
- `auth.onAuthStateChange` [LOW] used by `subsystem-5-0-src-context` from `src/context/CricketContext.jsx`. Evidence: src/context/CricketContext.jsx:auth.onAuthStateChange, src/context/CricketContext.jsx:calls
- `auth.signInWithPassword` [LOW] used by `subsystem-73-0-src-components` from `src/components/screens/AuthScreen.jsx`. Evidence: src/components/screens/AuthScreen.jsx:auth.signInWithPassword, src/components/screens/AuthScreen.jsx:calls
- `auth.signOut` [LOW] used by `subsystem-5-0-src-context` from `src/context/CricketContext.jsx`. Evidence: src/context/CricketContext.jsx:auth.signOut, src/context/CricketContext.jsx:calls, src/context/CricketContext.jsx:calls
- `auth.signUp` [LOW] used by `subsystem-7-0-src-components` from `src/components/screens/AdministrationScreen.jsx`. Evidence: src/components/screens/AdministrationScreen.jsx:auth.signUp, src/components/screens/AdministrationScreen.jsx:calls
- `auto` [LOW] used by `subsystem-12-0-src-components` from `src/components/ui/CloudinaryAvatar.jsx`. Evidence: src/components/ui/CloudinaryAvatar.jsx:auto, src/components/ui/CloudinaryAvatar.jsx:calls
- `autoGravity` [LOW] used by `subsystem-12-0-src-components` from `src/components/ui/CloudinaryAvatar.jsx`. Evidence: src/components/ui/CloudinaryAvatar.jsx:autoGravity, src/components/ui/CloudinaryAvatar.jsx:calls
- `availableDistricts.filter` [LOW] used by `subsystem-19-0-src-components` from `src/components/selection/SelectionWorkspace.jsx`. Evidence: src/components/selection/SelectionWorkspace.jsx:availableDistricts.filter, src/components/selection/SelectionWorkspace.jsx:calls
- `availablePlayers.filter` [LOW] used by `subsystem-9-0-src-components` from `src/components/screens/TeamsScreen.jsx`. Evidence: src/components/screens/TeamsScreen.jsx:availablePlayers.filter, src/components/screens/TeamsScreen.jsx:calls
- `availableScorers.map` [LOW] used by `subsystem-3-0-src-components` from `src/components/screens/MatchSetupScreen.jsx`. Evidence: src/components/screens/MatchSetupScreen.jsx:availableScorers.map, src/components/screens/MatchSetupScreen.jsx:calls
- `avatarPresets.map` [LOW] used by `subsystem-11-0-src-components` from `src/components/screens/PlayerRegistrationScreen.jsx`. Evidence: src/components/screens/PlayerRegistrationScreen.jsx:avatarPresets.map, src/components/screens/PlayerRegistrationScreen.jsx:calls, temp_extraction/src/components/screens/PlayerRegistrationScreen.jsx:calls
- `average.toFixed` [LOW] used by `subsystem-59-0-temp-extraction` from `temp_extraction/src/components/screens/PlayerProfileScreen.jsx`. Evidence: temp_extraction/src/components/screens/PlayerProfileScreen.jsx:average.toFixed, temp_extraction/src/components/screens/PlayerProfileScreen.jsx:calls
- `bVal.toLowerCase` [LOW] used by `subsystem-36-0-src-components` from `src/components/ui/DataTable.jsx`. Evidence: src/components/ui/DataTable.jsx:bVal.toLowerCase, src/components/ui/DataTable.jsx:calls, temp_extraction/src/components/ui/DataTable.jsx:calls
- `balls` [LOW] used by `subsystem-85-0-src-components` from `src/components/screens/MatchOverviewScreen.jsx`. Evidence: src/components/screens/MatchOverviewScreen.jsx:balls, src/components/screens/MatchOverviewScreen.jsx:calls, temp_extraction/src/components/screens/MatchOverviewScreen.jsx:calls
- `balls.forEach` [LOW] used by `subsystem-67-0-src-lib` from `src/lib/api.js`. Evidence: src/lib/api.js:balls.forEach, src/lib/api.js:calls
- `batStats.find` [LOW] used by `subsystem-5-0-src-context` from `src/context/CricketContext.jsx`. Evidence: src/context/CricketContext.jsx:batStats.find, src/context/CricketContext.jsx:calls
- `batters.map` [LOW] used by `subsystem-2-0-src-components` from `src/components/screens/ScoringScreen.jsx`. Evidence: src/components/screens/ScoringScreen.jsx:batters.map, src/components/screens/ScoringScreen.jsx:calls, temp_extraction/src/components/screens/ScoringScreen.jsx:calls
- `batting.find` [LOW] used by `subsystem-1-0-src-context` from `src/context/CricketContext.jsx`. Evidence: src/context/CricketContext.jsx:batting.find, src/context/CricketContext.jsx:calls, src/context/CricketContext.jsx:calls
- `batting.map` [LOW] used by `subsystem-62-0-src-components` from `src/components/screens/MatchResultScreen.jsx`. Evidence: src/components/screens/MatchResultScreen.jsx:batting.map, src/components/screens/MatchResultScreen.jsx:calls, src/components/screens/MatchResultScreen.jsx:calls
- `battingAvg.toFixed` [LOW] used by `subsystem-59-0-temp-extraction` from `temp_extraction/src/components/screens/PlayerProfileScreen.jsx`. Evidence: temp_extraction/src/components/screens/PlayerProfileScreen.jsx:battingAvg.toFixed, temp_extraction/src/components/screens/PlayerProfileScreen.jsx:calls, temp_extraction/src/components/screens/PlayersScreen.jsx:calls
- `battingStyle.includes` [LOW] used by `subsystem-16-0-src-components` from `src/components/selection/selectionData.js`. Evidence: src/components/selection/selectionData.js:battingStyle.includes, src/components/selection/selectionData.js:calls
- `battingStyle.toLowerCase` [LOW] used by `subsystem-97-0-temp-extraction` from `temp_extraction/src/components/screens/ScoutingHubScreen.jsx`. Evidence: temp_extraction/src/components/screens/ScoutingHubScreen.jsx:battingStyle.toLowerCase, temp_extraction/src/components/screens/ScoutingHubScreen.jsx:calls
- `battingXI.filter` [LOW] used by `subsystem-2-0-src-components` from `src/components/screens/ScoringScreen.jsx`. Evidence: src/components/screens/ScoringScreen.jsx:battingXI.filter, src/components/screens/ScoringScreen.jsx:calls
- `battingXI.find` [LOW] used by `subsystem-3-0-src-components` from `src/components/screens/InningsInitScreen.jsx`. Evidence: src/components/screens/InningsInitScreen.jsx:battingXI.find, src/components/screens/MatchSetupScreen.jsx:calls, src/components/screens/InningsInitScreen.jsx:calls
- `blur` [LOW] used by `subsystem-47-0-src-components` from `src/components/DrawerMenu.jsx`. Evidence: src/components/DrawerMenu.jsx:blur, src/components/DrawerMenu.jsx:calls, temp_extraction/src/components/DrawerMenu.jsx:calls
- `bowlStats.find` [LOW] used by `subsystem-5-0-src-context` from `src/context/CricketContext.jsx`. Evidence: src/context/CricketContext.jsx:bowlStats.find, src/context/CricketContext.jsx:calls
- `bowler_id` [LOW] used by `subsystem-0-0-src-lib` from `src/lib/api.js`. Evidence: src/lib/api.js:bowler_id, src/lib/api.js:calls, src/lib/api.js:calls
- `bowling.find` [LOW] used by `subsystem-1-0-src-context` from `src/context/CricketContext.jsx`. Evidence: src/context/CricketContext.jsx:bowling.find, src/context/CricketContext.jsx:calls
- `bowling.map` [LOW] used by `subsystem-70-0-src-components` from `src/components/screens/ScorecardScreen.jsx`. Evidence: src/components/screens/ScorecardScreen.jsx:bowling.map, src/components/screens/ScorecardScreen.jsx:calls, temp_extraction/src/components/screens/ScorecardScreen.jsx:calls
- `bowlingStyle.includes` [LOW] used by `subsystem-16-0-src-components` from `src/components/selection/selectionData.js`. Evidence: src/components/selection/selectionData.js:bowlingStyle.includes, src/components/selection/selectionData.js:calls, src/components/selection/selectionData.js:calls
- `bowlingXI.filter` [LOW] used by `subsystem-2-0-src-components` from `src/components/screens/ScoringScreen.jsx`. Evidence: src/components/screens/ScoringScreen.jsx:bowlingXI.filter, src/components/screens/ScoringScreen.jsx:calls, src/components/screens/ScoringScreen.jsx:calls
- `bowlingXI.find` [LOW] used by `subsystem-3-0-src-components` from `src/components/screens/InningsInitScreen.jsx`. Evidence: src/components/screens/InningsInitScreen.jsx:bowlingXI.find, src/components/screens/MatchSetupScreen.jsx:calls, src/components/screens/ScoringScreen.jsx:calls
- `bowlingXI.map` [LOW] used by `subsystem-2-0-src-components` from `src/components/screens/ScoringScreen.jsx`. Evidence: src/components/screens/ScoringScreen.jsx:bowlingXI.map, src/components/screens/ScoringScreen.jsx:calls
- `bulkMigratePlayers` [LOW] used by `subsystem-0-0-src-lib` from `src/lib/api.js`. Evidence: src/lib/api.js:bulkMigratePlayers, src/lib/api.js:calls
- `c.includes` [LOW] used by `subsystem-11-0-src-components` from `src/components/screens/PlayerRegistrationScreen.jsx`. Evidence: src/components/screens/PlayerRegistrationScreen.jsx:c.includes, src/components/screens/PlayerRegistrationScreen.jsx:calls, src/components/screens/PlayerRegistrationScreen.jsx:calls
- `c.replace` [LOW] used by `subsystem-11-0-src-components` from `src/components/screens/PlayerRegistrationScreen.jsx`. Evidence: src/components/screens/PlayerRegistrationScreen.jsx:c.replace, src/components/screens/PlayerRegistrationScreen.jsx:calls
- `c.startsWith` [LOW] used by `subsystem-39-0-src-components` from `src/components/screens/NewsScreen.jsx`. Evidence: src/components/screens/NewsScreen.jsx:c.startsWith, src/components/screens/NewsScreen.jsx:calls
- `calc` [LOW] used by `subsystem-33-0-src-components` from `src/components/screens/ScoutingHubScreen.jsx`. Evidence: src/components/screens/ScoutingHubScreen.jsx:calc, src/components/screens/ScoutingHubScreen.jsx:calls, src/components/screens/SelectorsScreen.jsx:calls
- `calculateCRR` [LOW] used by `subsystem-2-0-src-components` from `src/components/screens/ScoringScreen.jsx`. Evidence: src/components/screens/ScoringScreen.jsx:calculateCRR, src/components/screens/ScoringScreen.jsx:calls, temp_extraction/src/components/screens/ScoringScreen.jsx:calls
- `calculateMatchHighlights` [LOW] used by `subsystem-69-0-src-components` from `src/components/screens/MatchDetailScreen.jsx`. Evidence: src/components/screens/MatchDetailScreen.jsx:calculateMatchHighlights, src/components/screens/MatchDetailScreen.jsx:calls, src/components/screens/MatchResultScreen.jsx:calls
- `calculateProjectedScore` [LOW] used by `subsystem-2-0-src-components` from `src/context/CricketContext.jsx`. Evidence: src/context/CricketContext.jsx:calculateProjectedScore, temp_extraction/src/components/screens/ScoringScreen.jsx:calls, src/context/CricketContext.jsx:calls
- `canvas-confetti` [LOW] used by `subsystem-177-0-src-components` from `src/components/selection/SelectionWorkspace.jsx`. Evidence: src/components/selection/SelectionWorkspace.jsx:canvas-confetti, src/components/selection/SelectionWorkspace.jsx:imports, src/context/CricketContext.jsx:imports
- `cat.includes` [LOW] used by `subsystem-32-0-src-components` from `src/components/screens/PlayersScreen.jsx`. Evidence: src/components/screens/PlayersScreen.jsx:cat.includes, src/components/screens/PlayersScreen.jsx:calls
- `cat.replace` [LOW] used by `subsystem-32-0-src-components` from `src/components/screens/PlayersScreen.jsx`. Evidence: src/components/screens/PlayersScreen.jsx:cat.replace, src/components/screens/PlayersScreen.jsx:calls, temp_extraction/src/components/screens/PlayersScreen.jsx:calls
- `catStr.includes` [LOW] used by `subsystem-16-0-src-components` from `src/components/selection/selectionData.js`. Evidence: src/components/selection/selectionData.js:catStr.includes, src/components/selection/selectionData.js:calls, src/components/selection/selectionData.js:calls
- `category` [LOW] used by `subsystem-6-0-src-components` from `src/components/selection/CampaignOverview.jsx`. Evidence: src/components/selection/CampaignOverview.jsx:category, src/components/selection/CampaignOverview.jsx:calls
- `categoryFilter.toLowerCase` [LOW] used by `subsystem-32-0-src-components` from `src/components/screens/PlayersScreen.jsx`. Evidence: src/components/screens/PlayersScreen.jsx:categoryFilter.toLowerCase, src/components/screens/PlayersScreen.jsx:calls
- `categoryPlayers.filter` [LOW] used by `subsystem-19-0-src-components` from `src/components/selection/SelectionWorkspace.jsx`. Evidence: src/components/selection/SelectionWorkspace.jsx:categoryPlayers.filter, src/components/selection/SelectionWorkspace.jsx:calls, src/components/selection/SelectionWorkspace.jsx:calls
- `charAt` [LOW] used by `subsystem-3-0-src-components` from `src/components/screens/InningsInitScreen.jsx`. Evidence: src/components/screens/InningsInitScreen.jsx:charAt, src/components/screens/InningsInitScreen.jsx:calls, src/components/screens/MatchSetupScreen.jsx:calls
- `checkEnum` [LOW] used by `subsystem-109-0-scratch-check-enum-js` from `scratch_check_enum.js`. Evidence: scratch_check_enum.js:checkEnum, scratch_check_enum.js:calls, scratch_check_enum.js:calls
- `classList.add` [LOW] used by `subsystem-1-0-src-context` from `src/context/CricketContext.jsx`. Evidence: src/context/CricketContext.jsx:classList.add, src/context/CricketContext.jsx:calls
- `classList.remove` [LOW] used by `subsystem-1-0-src-context` from `src/context/CricketContext.jsx`. Evidence: src/context/CricketContext.jsx:classList.remove, src/context/CricketContext.jsx:calls
- `cld.image` [LOW] used by `subsystem-12-0-src-components` from `src/components/ui/CloudinaryAvatar.jsx`. Evidence: src/components/ui/CloudinaryAvatar.jsx:cld.image, src/components/ui/CloudinaryAvatar.jsx:calls, src/components/ui/CloudinaryAvatar.jsx:calls
- `clearAction` [LOW] used by `subsystem-41-0-src-lib` from `src/lib/db.js`. Evidence: src/lib/db.js:clearAction, src/lib/db.js:calls, src/services/SyncService.js:calls
- `clearTimeout` [LOW] used by `subsystem-1-0-src-context` from `src/context/CricketContext.jsx`. Evidence: src/context/CricketContext.jsx:clearTimeout, src/context/CricketContext.jsx:calls, temp_extraction/src/context/CricketContext.jsx:calls
- `client.focus` [LOW] used by `subsystem-38-0-src-sw-js` from `src/sw.js`. Evidence: src/sw.js:client.focus, src/sw.js:calls
- `clients.claim` [LOW] used by `subsystem-38-0-src-sw-js` from `src/sw.js`. Evidence: src/sw.js:clients.claim, src/sw.js:calls
- `clients.matchAll` [LOW] used by `subsystem-38-0-src-sw-js` from `src/sw.js`. Evidence: src/sw.js:clients.matchAll, src/sw.js:calls
- `clients.openWindow` [LOW] used by `subsystem-38-0-src-sw-js` from `src/sw.js`. Evidence: src/sw.js:clients.openWindow, src/sw.js:calls
- `clipboard.writeText` [LOW] used by `subsystem-58-0-src-components` from `src/components/ui/MatchMediaReport.jsx`. Evidence: src/components/ui/MatchMediaReport.jsx:clipboard.writeText, src/components/ui/MatchMediaReport.jsx:calls, temp_extraction/src/components/ui/MatchMediaReport.jsx:calls
- `code.split` [LOW] used by `subsystem-10-0-clean-cjs` from `clean.cjs`. Evidence: clean.cjs:code.split, clean.cjs:calls
- `col.render` [LOW] used by `subsystem-36-0-src-components` from `src/components/ui/DataTable.jsx`. Evidence: src/components/ui/DataTable.jsx:col.render, src/components/ui/DataTable.jsx:calls, temp_extraction/src/components/ui/DataTable.jsx:calls
- `columns.map` [LOW] used by `subsystem-36-0-src-components` from `src/components/ui/DataTable.jsx`. Evidence: src/components/ui/DataTable.jsx:columns.map, src/components/ui/DataTable.jsx:calls, src/components/ui/DataTable.jsx:calls
- `compareIds.includes` [LOW] used by `subsystem-44-0-src-components` from `src/components/selection/PlayerPool.jsx`. Evidence: src/components/selection/PlayerPool.jsx:compareIds.includes, src/components/selection/PlayerPool.jsx:calls, src/components/selection/Shortlist.jsx:calls
- `completedMatches.map` [LOW] used by `subsystem-54-0-src-components` from `src/components/screens/MatchesScreen.jsx`. Evidence: src/components/screens/MatchesScreen.jsx:completedMatches.map, src/components/screens/MatchesScreen.jsx:calls
- `confetti` [LOW] used by `subsystem-19-0-src-components` from `src/components/selection/SelectionWorkspace.jsx`. Evidence: src/components/selection/SelectionWorkspace.jsx:confetti, src/components/selection/SelectionWorkspace.jsx:calls, src/context/CricketContext.jsx:calls
- `consideredPlayers.map` [LOW] used by `subsystem-48-0-src-components` from `src/components/selection/TeamSelectionDashboard.jsx`. Evidence: src/components/selection/TeamSelectionDashboard.jsx:consideredPlayers.map, src/components/selection/TeamSelectionDashboard.jsx:calls
- `console.dir` [LOW] used by `subsystem-120-0-test-players-js` from `test-players.js`. Evidence: test-players.js:console.dir, test-players.js:calls
- `content.replace` [LOW] used by `subsystem-43-0-fix-logo-py` from `fix_logo.py`. Evidence: fix_logo.py:content.replace, fix_logo.py:calls, fix_logo.py:calls
- `content.split` [LOW] used by `subsystem-43-0-fix-logo-py` from `fix_logo.py`. Evidence: fix_logo.py:content.split, fix_logo.py:calls
- `contextPlayers.find` [LOW] used by `subsystem-124-0-src-components` from `src/components/screens/TeamsScreen.jsx`. Evidence: src/components/screens/TeamsScreen.jsx:contextPlayers.find, src/components/screens/TeamsScreen.jsx:calls
- `contextTeams.map` [LOW] used by `subsystem-9-0-src-components` from `src/components/screens/TeamsScreen.jsx`. Evidence: src/components/screens/TeamsScreen.jsx:contextTeams.map, src/components/screens/TeamsScreen.jsx:calls
- `count` [LOW] used by `subsystem-30-0-src-components` from `src/components/screens/SelectionScreen.jsx`. Evidence: src/components/screens/SelectionScreen.jsx:count, src/components/screens/SelectionScreen.jsx:calls
- `createAnnouncement` [LOW] used by `subsystem-0-0-src-lib` from `src/lib/api.js`. Evidence: src/lib/api.js:createAnnouncement, src/lib/api.js:calls
- `createContext` [LOW] used by `subsystem-1-0-src-context` from `src/context/CricketContext.jsx`. Evidence: src/context/CricketContext.jsx:createContext, src/context/CricketContext.jsx:calls, temp_extraction/src/context/CricketContext.jsx:calls
- `createDetailedMatches` [LOW] used by `subsystem-0-0-src-lib` from `src/lib/api.js`. Evidence: src/lib/api.js:createDetailedMatches, src/lib/api.js:calls
- `createSeason` [LOW] used by `subsystem-0-0-src-lib` from `src/lib/api.js`. Evidence: src/lib/api.js:createSeason, src/lib/api.js:calls
- `createTeam` [LOW] used by `subsystem-0-0-src-lib` from `src/lib/api.js`. Evidence: src/lib/api.js:createTeam, src/lib/api.js:calls
- `createTournament` [LOW] used by `subsystem-0-0-src-lib` from `src/lib/api.js`. Evidence: src/lib/api.js:createTournament, src/lib/api.js:calls
- `ctx.addIssue` [LOW] used by `subsystem-13-0-src-engine` from `src/engine/validationSchemas.js`. Evidence: src/engine/validationSchemas.js:ctx.addIssue, src/engine/validationSchemas.js:calls, src/engine/validationSchemas.js:calls
- `current.some` [LOW] used by `subsystem-66-0-src-components` from `src/components/screens/ScoringScreen.jsx`. Evidence: src/components/screens/ScoringScreen.jsx:current.some, src/components/screens/ScoringScreen.jsx:calls
- `currentList.filter` [LOW] used by `subsystem-91-0-src-components` from `src/components/selection/SelectionWorkspace.jsx`. Evidence: src/components/selection/SelectionWorkspace.jsx:currentList.filter, src/components/selection/SelectionWorkspace.jsx:calls
- `currentList.includes` [LOW] used by `subsystem-91-0-src-components` from `src/components/selection/SelectionWorkspace.jsx`. Evidence: src/components/selection/SelectionWorkspace.jsx:currentList.includes, src/components/selection/SelectionWorkspace.jsx:calls
- `currentOverBalls.map` [LOW] used by `subsystem-2-0-src-components` from `src/components/screens/ScoringScreen.jsx`. Evidence: src/components/screens/ScoringScreen.jsx:currentOverBalls.map, src/components/screens/ScoringScreen.jsx:calls, temp_extraction/src/components/screens/ScoringScreen.jsx:calls
- `currentOverBalls.push` [LOW] used by `subsystem-23-0-src-engine` from `src/engine/cricketStateMachine.js`. Evidence: src/engine/cricketStateMachine.js:currentOverBalls.push, src/engine/cricketStateMachine.js:calls, temp_extraction/src/engine/cricketStateMachine.js:calls
- `currentPartnershipPlayers.add` [LOW] used by `subsystem-37-0-src-engine` from `src/engine/derivedScorecard.js`. Evidence: src/engine/derivedScorecard.js:currentPartnershipPlayers.add, src/engine/derivedScorecard.js:calls, src/engine/derivedScorecard.js:calls
- `currentPartnershipPlayers.clear` [LOW] used by `subsystem-37-0-src-engine` from `src/engine/derivedScorecard.js`. Evidence: src/engine/derivedScorecard.js:currentPartnershipPlayers.clear, src/engine/derivedScorecard.js:calls
- `customMatches.filter` [LOW] used by `subsystem-45-0-src-components` from `src/components/ui/TournamentManagerModal.jsx`. Evidence: src/components/ui/TournamentManagerModal.jsx:customMatches.filter, src/components/ui/TournamentManagerModal.jsx:calls
- `customMatches.map` [LOW] used by `subsystem-45-0-src-components` from `src/components/ui/TournamentManagerModal.jsx`. Evidence: src/components/ui/TournamentManagerModal.jsx:customMatches.map, src/components/ui/TournamentManagerModal.jsx:calls, src/components/ui/TournamentManagerModal.jsx:calls
- `cutoff.getDate` [LOW] used by `subsystem-8-0-src-components` from `src/components/screens/SeasonMigrationTab.jsx`. Evidence: src/components/screens/SeasonMigrationTab.jsx:cutoff.getDate, src/components/screens/SeasonMigrationTab.jsx:calls
- `cutoff.getFullYear` [LOW] used by `subsystem-8-0-src-components` from `src/components/screens/SeasonMigrationTab.jsx`. Evidence: src/components/screens/SeasonMigrationTab.jsx:cutoff.getFullYear, src/components/screens/SeasonMigrationTab.jsx:calls
- `cutoff.getMonth` [LOW] used by `subsystem-8-0-src-components` from `src/components/screens/SeasonMigrationTab.jsx`. Evidence: src/components/screens/SeasonMigrationTab.jsx:cutoff.getMonth, src/components/screens/SeasonMigrationTab.jsx:calls
- `data.filter` [LOW] used by `subsystem-8-0-src-components` from `src/components/screens/SeasonMigrationTab.jsx`. Evidence: src/components/screens/SeasonMigrationTab.jsx:data.filter, src/components/screens/SeasonMigrationTab.jsx:calls
- `data.find` [LOW] used by `subsystem-63-0-src-components` from `src/components/ui/TeamManagerModal.jsx`. Evidence: src/components/ui/TeamManagerModal.jsx:data.find, src/components/ui/TeamManagerModal.jsx:calls, src/components/ui/TournamentManagerModal.jsx:calls
- `data.forEach` [LOW] used by `subsystem-0-0-src-lib` from `src/lib/api.js`. Evidence: src/lib/api.js:data.forEach, src/lib/api.js:calls, src/lib/api.js:calls
- `data.json` [LOW] used by `subsystem-38-0-src-sw-js` from `src/sw.js`. Evidence: src/sw.js:data.json, src/sw.js:calls
- `data.reduce` [LOW] used by `subsystem-6-0-src-components` from `src/components/selection/PerformanceGraphs.jsx`. Evidence: src/components/selection/PerformanceGraphs.jsx:data.reduce, src/components/selection/PerformanceGraphs.jsx:calls, src/components/selection/PerformanceGraphs.jsx:calls
- `db.version` [LOW] used by `subsystem-41-0-src-lib` from `src/lib/db.js`. Evidence: src/lib/db.js:db.version, src/lib/db.js:calls, src/lib/db.js:calls
- `dbDistricts.map` [LOW] used by `subsystem-24-0-src-components` from `src/components/screens/TeamRegistrationTab.jsx`. Evidence: src/components/screens/TeamRegistrationTab.jsx:dbDistricts.map, src/components/screens/TeamRegistrationTab.jsx:calls
- `default` [LOW] used by `subsystem-13-0-src-engine` from `src/engine/validationSchemas.js`. Evidence: src/engine/validationSchemas.js:default, src/engine/validationSchemas.js:calls, src/engine/validationSchemas.js:calls
- `defaultSize.toString` [LOW] used by `subsystem-57-0-src-components` from `src/components/selection/CreateTeamModal.jsx`. Evidence: src/components/selection/CreateTeamModal.jsx:defaultSize.toString, src/components/selection/CreateTeamModal.jsx:calls
- `defineConfig` [LOW] used by `subsystem-46-0-temp-extraction` from `temp_extraction/vite.config.ts`. Evidence: temp_extraction/vite.config.ts:defineConfig, temp_extraction/vite.config.ts:calls, vite.config.ts:calls
- `deleteAnnouncement` [LOW] used by `subsystem-0-0-src-lib` from `src/lib/api.js`. Evidence: src/lib/api.js:deleteAnnouncement, src/lib/api.js:calls
- `deleteMatch` [LOW] used by `subsystem-0-0-src-lib` from `src/lib/api.js`. Evidence: src/lib/api.js:deleteMatch, src/lib/api.js:calls
- `deletePlayer` [LOW] used by `subsystem-0-0-src-lib` from `src/lib/api.js`. Evidence: src/lib/api.js:deletePlayer, src/lib/api.js:calls
- `deleteTournament` [LOW] used by `subsystem-0-0-src-lib` from `src/lib/api.js`. Evidence: src/lib/api.js:deleteTournament, src/lib/api.js:calls
- `deleteUser` [LOW] used by `subsystem-0-0-src-lib` from `src/lib/api.js`. Evidence: src/lib/api.js:deleteUser, src/lib/api.js:calls
- `deliveries` [LOW] used by `subsystem-18-0-src-lib` from `src/lib/standings.js`. Evidence: src/lib/standings.js:deliveries, src/lib/standings.js:calls
- `deliveries.filter` [LOW] used by `subsystem-67-0-src-lib` from `src/lib/api.js`. Evidence: src/lib/api.js:deliveries.filter, src/lib/api.js:calls
- `deliveries.forEach` [LOW] used by `subsystem-37-0-src-engine` from `src/engine/derivedScorecard.js`. Evidence: src/engine/derivedScorecard.js:deliveries.forEach, src/engine/derivedScorecard.js:calls, src/lib/standings.js:calls
- `deliveries.map` [LOW] used by `subsystem-1-0-src-context` from `src/context/CricketContext.jsx`. Evidence: src/context/CricketContext.jsx:deliveries.map, src/context/CricketContext.jsx:calls
- `deliveries.put` [LOW] used by `subsystem-1-0-src-context` from `src/context/CricketContext.jsx`. Evidence: src/context/CricketContext.jsx:deliveries.put, src/context/CricketContext.jsx:calls
- `deliveries.reduce` [LOW] used by `subsystem-5-0-src-context` from `src/context/CricketContext.jsx`. Evidence: src/context/CricketContext.jsx:deliveries.reduce, src/context/CricketContext.jsx:calls
- `deliveries.where` [LOW] used by `subsystem-1-0-src-context` from `src/context/CricketContext.jsx`. Evidence: src/context/CricketContext.jsx:deliveries.where, src/context/CricketContext.jsx:calls
- `deliveryLog.slice` [LOW] used by `subsystem-2-0-src-components` from `src/components/screens/ScoringScreen.jsx`. Evidence: src/components/screens/ScoringScreen.jsx:deliveryLog.slice, src/components/screens/ScoringScreen.jsx:calls, temp_extraction/src/components/screens/ScoringScreen.jsx:calls
- `dexie` [LOW] used by `subsystem-41-0-src-lib` from `src/lib/db.js`. Evidence: src/lib/db.js:dexie, src/lib/db.js:imports
- `disabledIds.includes` [LOW] used by `subsystem-3-0-src-components` from `src/components/screens/InningsInitScreen.jsx`. Evidence: src/components/screens/InningsInitScreen.jsx:disabledIds.includes, src/components/screens/InningsInitScreen.jsx:calls, src/components/screens/MatchSetupScreen.jsx:calls
- `displayedPlayers.map` [LOW] used by `subsystem-19-0-src-components` from `src/components/selection/SelectionWorkspace.jsx`. Evidence: src/components/selection/SelectionWorkspace.jsx:displayedPlayers.map, src/components/selection/SelectionWorkspace.jsx:calls
- `district.replace` [LOW] used by `subsystem-16-0-src-components` from `src/components/selection/selectionData.js`. Evidence: src/components/selection/selectionData.js:district.replace, src/components/selection/selectionData.js:calls
- `district.toLowerCase` [LOW] used by `subsystem-97-0-temp-extraction` from `temp_extraction/src/components/screens/ScoutingHubScreen.jsx`. Evidence: temp_extraction/src/components/screens/ScoutingHubScreen.jsx:district.toLowerCase, temp_extraction/src/components/screens/ScoutingHubScreen.jsx:calls, temp_extraction/src/components/screens/SelectorsScreen.jsx:calls
- `districtNames.map` [LOW] used by `subsystem-26-0-temp-extraction` from `temp_extraction/src/components/screens/PlayersScreen.jsx`. Evidence: temp_extraction/src/components/screens/PlayersScreen.jsx:districtNames.map, temp_extraction/src/components/screens/PlayersScreen.jsx:calls
- `districtPlayers.filter` [LOW] used by `subsystem-26-0-temp-extraction` from `temp_extraction/src/components/screens/PlayersScreen.jsx`. Evidence: temp_extraction/src/components/screens/PlayersScreen.jsx:districtPlayers.filter, temp_extraction/src/components/screens/PlayersScreen.jsx:calls
- `districtStats.filter` [LOW] used by `subsystem-22-0-src-components` from `src/components/screens/HomeScreen.jsx`. Evidence: src/components/screens/HomeScreen.jsx:districtStats.filter, src/components/screens/HomeScreen.jsx:calls
- `districtStats.slice` [LOW] used by `subsystem-22-0-src-components` from `src/components/screens/HomeScreen.jsx`. Evidence: src/components/screens/HomeScreen.jsx:districtStats.slice, src/components/screens/HomeScreen.jsx:calls
- `districtTeams.find` [LOW] used by `subsystem-24-0-src-components` from `src/components/screens/TeamRegistrationTab.jsx`. Evidence: src/components/screens/TeamRegistrationTab.jsx:districtTeams.find, src/components/screens/TeamRegistrationTab.jsx:calls
- `districtTeams.map` [LOW] used by `subsystem-24-0-src-components` from `src/components/screens/TeamRegistrationTab.jsx`. Evidence: src/components/screens/TeamRegistrationTab.jsx:districtTeams.map, src/components/screens/TeamRegistrationTab.jsx:calls
- `districts.forEach` [LOW] used by `subsystem-0-0-src-lib` from `src/lib/api.js`. Evidence: src/lib/api.js:districts.forEach, src/lib/api.js:calls
- `districts.map` [LOW] used by `subsystem-33-0-src-components` from `src/components/screens/ScoutingHubScreen.jsx`. Evidence: src/components/screens/ScoutingHubScreen.jsx:districts.map, src/components/screens/ScoutingHubScreen.jsx:calls, src/components/screens/SelectorsScreen.jsx:calls
- `dob.getDate` [LOW] used by `subsystem-8-0-src-components` from `src/components/screens/SeasonMigrationTab.jsx`. Evidence: src/components/screens/SeasonMigrationTab.jsx:dob.getDate, src/components/screens/SeasonMigrationTab.jsx:calls
- `dob.getFullYear` [LOW] used by `subsystem-8-0-src-components` from `src/components/screens/SeasonMigrationTab.jsx`. Evidence: src/components/screens/SeasonMigrationTab.jsx:dob.getFullYear, src/components/screens/SeasonMigrationTab.jsx:calls
- `dob.getMonth` [LOW] used by `subsystem-8-0-src-components` from `src/components/screens/SeasonMigrationTab.jsx`. Evidence: src/components/screens/SeasonMigrationTab.jsx:dob.getMonth, src/components/screens/SeasonMigrationTab.jsx:calls
- `document.getElementById` [LOW] used by `subsystem-25-0-src-main-jsx` from `src/main.jsx`. Evidence: src/main.jsx:document.getElementById, src/main.jsx:calls, temp_extraction/src/main.jsx:calls
- `document.querySelector` [LOW] used by `subsystem-29-0-src-components` from `src/components/BottomNav.jsx`. Evidence: src/components/BottomNav.jsx:document.querySelector, src/components/BottomNav.jsx:calls, src/components/Header.jsx:calls
- `dotenv` [LOW] used by `subsystem-27-0-apply-bug5-sql-js` from `apply-bug5-sql.js`. Evidence: apply-bug5-sql.js:dotenv, apply-bug5-sql.js:imports, delete_season.js:imports
- `dotenv.config` [LOW] used by `subsystem-27-0-apply-bug5-sql-js` from `apply-bug5-sql.js`. Evidence: apply-bug5-sql.js:dotenv.config, apply-bug5-sql.js:calls, delete_season.js:calls
- `drawer` [LOW] used by `subsystem-53-0-src-app-jsx` from `src/App.jsx`. Evidence: src/App.jsx:drawer, src/App.jsx:calls, temp_extraction/src/App.jsx:calls
- `e.preventDefault` [LOW] used by `subsystem-7-0-src-components` from `src/components/screens/AdministrationScreen.jsx`. Evidence: src/components/screens/AdministrationScreen.jsx:e.preventDefault, src/components/screens/NewsScreen.jsx:calls, src/components/screens/AdministrationScreen.jsx:calls
- `e.stopPropagation` [LOW] used by `subsystem-169-0-src-components` from `src/components/screens/SelectorAssignmentModal.jsx`. Evidence: src/components/screens/SelectorAssignmentModal.jsx:e.stopPropagation, src/components/screens/SelectorAssignmentModal.jsx:calls, src/components/screens/TeamsScreen.jsx:calls
- `encodeURIComponent` [LOW] used by `subsystem-56-0-src-components` from `src/components/screens/PlayerProfileScreen.jsx`. Evidence: src/components/screens/PlayerProfileScreen.jsx:encodeURIComponent, src/components/screens/PlayerProfileScreen.jsx:calls, src/components/screens/TeamsScreen.jsx:calls
- `enforcement` [LOW] used by `subsystem-13-0-src-engine` from `src/engine/validationSchemas.js`. Evidence: src/engine/validationSchemas.js:enforcement, src/engine/validationSchemas.js:calls, temp_extraction/src/engine/validationSchemas.js:calls
- `env.get` [LOW] used by `subsystem-17-0-supabase` from `supabase/functions/send-push/index.ts`. Evidence: supabase/functions/send-push/index.ts:env.get, supabase/functions/send-push/index.ts:calls, supabase/functions/send-push/index.ts:calls
- `equals` [LOW] used by `subsystem-1-0-src-context` from `src/context/CricketContext.jsx`. Evidence: src/context/CricketContext.jsx:equals, src/context/CricketContext.jsx:calls
- `error.toString` [LOW] used by `subsystem-25-0-src-main-jsx` from `src/main.jsx`. Evidence: src/main.jsx:error.toString, src/main.jsx:calls, temp_extraction/src/main.jsx:calls
- `errors` [LOW] used by `subsystem-52-0-src-hooks` from `src/hooks/useHaptics.js`. Evidence: src/hooks/useHaptics.js:errors, src/hooks/useHaptics.js:calls
- `errors.forEach` [LOW] used by `subsystem-65-0-src-components` from `src/components/screens/PlayerRegistrationScreen.jsx`. Evidence: src/components/screens/PlayerRegistrationScreen.jsx:errors.forEach, src/components/screens/PlayerRegistrationScreen.jsx:calls, temp_extraction/src/components/screens/PlayerRegistrationScreen.jsx:calls
- `event.waitUntil` [LOW] used by `subsystem-38-0-src-sw-js` from `src/sw.js`. Evidence: src/sw.js:event.waitUntil, src/sw.js:calls, src/sw.js:calls
- `events` [LOW] used by `subsystem-52-0-src-hooks` from `src/hooks/useHaptics.js`. Evidence: src/hooks/useHaptics.js:events, src/hooks/useHaptics.js:calls
- `exist` [LOW] used by `subsystem-0-0-src-lib` from `src/lib/api.js`. Evidence: src/lib/api.js:exist, src/lib/api.js:calls
- `existingIds.has` [LOW] used by `subsystem-8-0-src-components` from `src/components/screens/SeasonMigrationTab.jsx`. Evidence: src/components/screens/SeasonMigrationTab.jsx:existingIds.has, src/components/screens/SeasonMigrationTab.jsx:calls
- `existingInTarget.map` [LOW] used by `subsystem-8-0-src-components` from `src/components/screens/SeasonMigrationTab.jsx`. Evidence: src/components/screens/SeasonMigrationTab.jsx:existingInTarget.map, src/components/screens/SeasonMigrationTab.jsx:calls
- `existingSet.has` [LOW] used by `subsystem-0-0-src-lib` from `src/lib/api.js`. Evidence: src/lib/api.js:existingSet.has, src/lib/api.js:calls
- `extension` [LOW] used by `subsystem-12-0-src-components` from `src/components/ui/CloudinaryAvatar.jsx`. Evidence: src/components/ui/CloudinaryAvatar.jsx:extension, src/components/ui/CloudinaryAvatar.jsx:calls
- `extra_type.toLowerCase` [LOW] used by `subsystem-1-0-src-context` from `src/context/CricketContext.jsx`. Evidence: src/context/CricketContext.jsx:extra_type.toLowerCase, src/context/CricketContext.jsx:calls
- `f.read` [LOW] used by `subsystem-43-0-fix-logo-py` from `fix_logo.py`. Evidence: fix_logo.py:f.read, fix_logo.py:calls
- `f.replace` [LOW] used by `subsystem-32-0-src-components` from `src/components/screens/PlayersScreen.jsx`. Evidence: src/components/screens/PlayersScreen.jsx:f.replace, src/components/screens/PlayersScreen.jsx:calls
- `f.write` [LOW] used by `subsystem-43-0-fix-logo-py` from `fix_logo.py`. Evidence: fix_logo.py:f.write, fix_logo.py:calls
- `fallOfWickets.push` [LOW] used by `subsystem-23-0-src-engine` from `src/engine/cricketStateMachine.js`. Evidence: src/engine/cricketStateMachine.js:fallOfWickets.push, src/engine/cricketStateMachine.js:calls, temp_extraction/src/engine/cricketStateMachine.js:calls
- `fetch` [LOW] used by `subsystem-11-0-src-components` from `src/components/screens/PlayerRegistrationScreen.jsx`. Evidence: src/components/screens/PlayerRegistrationScreen.jsx:fetch, src/components/screens/PlayerRegistrationScreen.jsx:calls
- `fetchReport` [LOW] used by `subsystem-62-0-src-components` from `src/components/screens/MatchResultScreen.jsx`. Evidence: src/components/screens/MatchResultScreen.jsx:fetchReport, src/components/screens/MatchResultScreen.jsx:calls, src/components/screens/MatchResultScreen.jsx:calls
- `fieldStats.find` [LOW] used by `subsystem-5-0-src-context` from `src/context/CricketContext.jsx`. Evidence: src/context/CricketContext.jsx:fieldStats.find, src/context/CricketContext.jsx:calls
- `file.endswith` [LOW] used by `subsystem-43-0-fix-logo-py` from `fix_logo.py`. Evidence: fix_logo.py:file.endswith, fix_logo.py:calls
- `filtered.filter` [LOW] used by `subsystem-54-0-src-components` from `src/components/screens/MatchesScreen.jsx`. Evidence: src/components/screens/MatchesScreen.jsx:filtered.filter, src/components/screens/MatchesScreen.jsx:calls, src/components/screens/MatchesScreen.jsx:calls
- `filtered.forEach` [LOW] used by `subsystem-42-0-temp-extraction` from `temp_extraction/src/components/screens/MatchesScreen.jsx`. Evidence: temp_extraction/src/components/screens/MatchesScreen.jsx:filtered.forEach, temp_extraction/src/components/screens/MatchesScreen.jsx:calls
- `filteredAgeCategories.map` [LOW] used by `subsystem-24-0-src-components` from `src/components/screens/TeamRegistrationTab.jsx`. Evidence: src/components/screens/TeamRegistrationTab.jsx:filteredAgeCategories.map, src/components/screens/TeamRegistrationTab.jsx:calls
- `filteredAnnouncements.map` [LOW] used by `subsystem-39-0-src-components` from `src/components/screens/NewsScreen.jsx`. Evidence: src/components/screens/NewsScreen.jsx:filteredAnnouncements.map, src/components/screens/NewsScreen.jsx:calls
- `filteredCategories.map` [LOW] used by `subsystem-11-0-src-components` from `src/components/screens/PlayerRegistrationScreen.jsx`. Evidence: src/components/screens/PlayerRegistrationScreen.jsx:filteredCategories.map, src/components/screens/PlayerRegistrationScreen.jsx:calls
- `filteredDistrictTeams.map` [LOW] used by `subsystem-9-0-src-components` from `src/components/screens/TeamsScreen.jsx`. Evidence: src/components/screens/TeamsScreen.jsx:filteredDistrictTeams.map, src/components/screens/TeamsScreen.jsx:calls
- `filteredDistricts.map` [LOW] used by `subsystem-22-0-src-components` from `src/components/screens/HomeScreen.jsx`. Evidence: src/components/screens/HomeScreen.jsx:filteredDistricts.map, src/components/screens/HomeScreen.jsx:calls
- `filteredMatches.map` [LOW] used by `subsystem-2-0-src-components` from `src/components/screens/ScoringScreen.jsx`. Evidence: src/components/screens/ScoringScreen.jsx:filteredMatches.map, src/components/screens/ScoringScreen.jsx:calls
- `filteredOfficialTeams.map` [LOW] used by `subsystem-9-0-src-components` from `src/components/screens/TeamsScreen.jsx`. Evidence: src/components/screens/TeamsScreen.jsx:filteredOfficialTeams.map, src/components/screens/TeamsScreen.jsx:calls
- `filteredPlayers.filter` [LOW] used by `subsystem-26-0-temp-extraction` from `temp_extraction/src/components/screens/PlayersScreen.jsx`. Evidence: temp_extraction/src/components/screens/PlayersScreen.jsx:filteredPlayers.filter, temp_extraction/src/components/screens/PlayersScreen.jsx:calls, temp_extraction/src/components/screens/PlayersScreen.jsx:calls
- `filteredPlayers.map` [LOW] used by `subsystem-104-0-src-components` from `src/components/screens/MatchSetupScreen.jsx`. Evidence: src/components/screens/MatchSetupScreen.jsx:filteredPlayers.map, src/components/screens/MatchSetupScreen.jsx:calls, src/components/screens/PlayersScreen.jsx:calls
- `finalizeMatch` [LOW] used by `subsystem-0-0-src-lib` from `src/lib/api.js`. Evidence: src/lib/api.js:finalizeMatch, src/lib/api.js:calls
- `finalizeSelectionProcess` [LOW] used by `subsystem-89-0-src-components` from `src/components/screens/SelectionScreen.jsx`. Evidence: src/components/screens/SelectionScreen.jsx:finalizeSelectionProcess, src/components/screens/SelectionScreen.jsx:calls
- `finalizeSquad` [LOW] used by `subsystem-0-0-src-lib` from `src/lib/api.js`. Evidence: src/lib/api.js:finalizeSquad, src/lib/api.js:calls
- `find` [LOW] used by `subsystem-70-0-src-components` from `src/components/screens/ScorecardScreen.jsx`. Evidence: src/components/screens/ScorecardScreen.jsx:find, src/components/screens/ScorecardScreen.jsx:calls, src/components/screens/ScoringScreen.jsx:calls
- `first` [LOW] used by `subsystem-5-0-src-context` from `src/context/CricketContext.jsx`. Evidence: src/context/CricketContext.jsx:first, src/context/CricketContext.jsx:calls
- `forEach` [LOW] used by `subsystem-37-0-src-engine` from `src/engine/derivedScorecard.js`. Evidence: src/engine/derivedScorecard.js:forEach, src/engine/derivedScorecard.js:calls, src/engine/derivedScorecard.js:calls
- `form.push` [LOW] used by `subsystem-18-0-src-lib` from `src/lib/standings.js`. Evidence: src/lib/standings.js:form.push, src/lib/standings.js:calls, src/lib/standings.js:calls
- `form.slice` [LOW] used by `subsystem-15-0-src-components` from `src/components/screens/TournamentsScreen.jsx`. Evidence: src/components/screens/TournamentsScreen.jsx:form.slice, src/components/screens/TournamentsScreen.jsx:calls
- `formData.append` [LOW] used by `subsystem-11-0-src-components` from `src/components/screens/PlayerRegistrationScreen.jsx`. Evidence: src/components/screens/PlayerRegistrationScreen.jsx:formData.append, src/components/screens/PlayerRegistrationScreen.jsx:calls, src/components/screens/PlayerRegistrationScreen.jsx:calls
- `format` [LOW] used by `subsystem-12-0-src-components` from `src/components/ui/CloudinaryAvatar.jsx`. Evidence: src/components/ui/CloudinaryAvatar.jsx:format, src/components/ui/CloudinaryAvatar.jsx:calls
- `formatOvers` [LOW] used by `subsystem-155-0-src-components` from `src/components/screens/HomeScreen.jsx`. Evidence: src/components/screens/HomeScreen.jsx:formatOvers, src/components/screens/HomeScreen.jsx:calls, src/components/screens/HomeScreen.jsx:calls
- `fs.writeFileSync` [LOW] used by `subsystem-10-0-clean-cjs` from `clean.cjs`. Evidence: clean.cjs:fs.writeFileSync, clean.cjs:calls
- `functions.invoke` [LOW] used by `subsystem-2-0-src-components` from `src/components/screens/ScoringScreen.jsx`. Evidence: src/components/screens/ScoringScreen.jsx:functions.invoke, src/components/screens/ScoringScreen.jsx:calls, src/components/screens/ScoringScreen.jsx:calls
- `g.substring` [LOW] used by `subsystem-0-0-src-lib` from `src/lib/api.js`. Evidence: src/lib/api.js:g.substring, src/lib/api.js:calls
- `gender` [LOW] used by `subsystem-24-0-src-components` from `src/components/screens/TeamRegistrationTab.jsx`. Evidence: src/components/screens/TeamRegistrationTab.jsx:gender, src/components/screens/TeamRegistrationTab.jsx:calls
- `gender.toLowerCase` [LOW] used by `subsystem-108-0-src-components` from `src/components/selection/CreateTeamModal.jsx`. Evidence: src/components/selection/CreateTeamModal.jsx:gender.toLowerCase, src/components/selection/CreateTeamModal.jsx:calls
- `genders.forEach` [LOW] used by `subsystem-0-0-src-lib` from `src/lib/api.js`. Evidence: src/lib/api.js:genders.forEach, src/lib/api.js:calls
- `generateMatchSummary` [LOW] used by `subsystem-58-0-src-components` from `src/components/ui/MatchMediaReport.jsx`. Evidence: src/components/ui/MatchMediaReport.jsx:generateMatchSummary, src/components/ui/MatchMediaReport.jsx:calls, temp_extraction/src/components/ui/MatchMediaReport.jsx:calls
- `generateSocialCaption` [LOW] used by `subsystem-58-0-src-components` from `src/components/ui/MatchMediaReport.jsx`. Evidence: src/components/ui/MatchMediaReport.jsx:generateSocialCaption, src/components/ui/MatchMediaReport.jsx:calls, temp_extraction/src/components/ui/MatchMediaReport.jsx:calls
- `getActiveSeason` [LOW] used by `subsystem-0-0-src-lib` from `src/lib/api.js`. Evidence: src/lib/api.js:getActiveSeason, src/lib/api.js:calls
- `getAgeCategories` [LOW] used by `subsystem-0-0-src-lib` from `src/lib/api.js`. Evidence: src/lib/api.js:getAgeCategories, src/lib/api.js:calls
- `getAnnouncements` [LOW] used by `subsystem-0-0-src-lib` from `src/lib/api.js`. Evidence: src/lib/api.js:getAnnouncements, src/lib/api.js:calls
- `getAvailableDistricts` [LOW] used by `subsystem-19-0-src-components` from `src/components/selection/SelectionWorkspace.jsx`. Evidence: src/components/selection/SelectionWorkspace.jsx:getAvailableDistricts, src/components/selection/SelectionWorkspace.jsx:calls
- `getDefaults` [LOW] used by `subsystem-0-0-src-lib` from `src/lib/api.js`. Evidence: src/lib/api.js:getDefaults, src/lib/api.js:calls
- `getDerivedStateFromError` [LOW] used by `subsystem-25-0-src-main-jsx` from `src/main.jsx`. Evidence: src/main.jsx:getDerivedStateFromError, src/main.jsx:calls, temp_extraction/src/main.jsx:calls
- `getFullYear` [LOW] used by `subsystem-21-0-src-components` from `src/components/screens/TeamRegistrationTab.jsx`. Evidence: src/components/screens/TeamRegistrationTab.jsx:getFullYear, src/components/screens/TeamRegistrationTab.jsx:calls
- `getHours` [LOW] used by `subsystem-72-0-temp-extraction` from `temp_extraction/src/components/screens/HomeScreen.jsx`. Evidence: temp_extraction/src/components/screens/HomeScreen.jsx:getHours, temp_extraction/src/components/screens/HomeScreen.jsx:calls
- `getMatchScorecard` [LOW] used by `subsystem-0-0-src-lib` from `src/lib/api.js`. Evidence: src/lib/api.js:getMatchScorecard, src/lib/api.js:calls
- `getOrCreateInnings` [LOW] used by `subsystem-0-0-src-lib` from `src/lib/api.js`. Evidence: src/lib/api.js:getOrCreateInnings, src/lib/api.js:calls
- `getPendingActions` [LOW] used by `subsystem-41-0-src-lib` from `src/lib/db.js`. Evidence: src/lib/db.js:getPendingActions, src/lib/db.js:calls, src/services/SyncService.js:calls
- `getPlayerMatchStats` [LOW] used by `subsystem-0-0-src-lib` from `src/lib/api.js`. Evidence: src/lib/api.js:getPlayerMatchStats, src/lib/api.js:calls
- `getPlayersBySeason` [LOW] used by `subsystem-0-0-src-lib` from `src/lib/api.js`. Evidence: src/lib/api.js:getPlayersBySeason, src/lib/api.js:calls
- `getProfiles` [LOW] used by `subsystem-0-0-src-lib` from `src/lib/api.js`. Evidence: src/lib/api.js:getProfiles, src/lib/api.js:calls
- `getRecycleBinItems` [LOW] used by `subsystem-0-0-src-lib` from `src/lib/api.js`. Evidence: src/lib/api.js:getRecycleBinItems, src/lib/api.js:calls
- `getSeasons` [LOW] used by `subsystem-0-0-src-lib` from `src/lib/api.js`. Evidence: src/lib/api.js:getSeasons, src/lib/api.js:calls
- `getSelectionCandidates` [LOW] used by `subsystem-0-0-src-lib` from `src/lib/api.js`. Evidence: src/lib/api.js:getSelectionCandidates, src/lib/api.js:calls
- `getSelectionProcesses` [LOW] used by `subsystem-0-0-src-lib` from `src/lib/api.js`. Evidence: src/lib/api.js:getSelectionProcesses, src/lib/api.js:calls
- `getSelectorAssignments` [LOW] used by `subsystem-0-0-src-lib` from `src/lib/api.js`. Evidence: src/lib/api.js:getSelectorAssignments, src/lib/api.js:calls
- `getTime` [LOW] used by `subsystem-13-0-src-engine` from `src/engine/validationSchemas.js`. Evidence: src/engine/validationSchemas.js:getTime, src/engine/validationSchemas.js:calls
- `goBack` [LOW] used by `subsystem-61-0-src-components` from `src/components/screens/MatchDetailScreen.jsx`. Evidence: src/components/screens/MatchDetailScreen.jsx:goBack, src/components/screens/MatchSetupScreen.jsx:calls, temp_extraction/src/components/screens/MatchSetupScreen.jsx:calls
- `gravity` [LOW] used by `subsystem-12-0-src-components` from `src/components/ui/CloudinaryAvatar.jsx`. Evidence: src/components/ui/CloudinaryAvatar.jsx:gravity, src/components/ui/CloudinaryAvatar.jsx:calls
- `groups.map` [LOW] used by `subsystem-42-0-temp-extraction` from `temp_extraction/src/components/screens/MatchesScreen.jsx`. Evidence: temp_extraction/src/components/screens/MatchesScreen.jsx:groups.map, temp_extraction/src/components/screens/MatchesScreen.jsx:calls, temp_extraction/src/components/screens/TournamentsScreen.jsx:calls
- `handleRetireBatter` [LOW] used by `subsystem-2-0-src-components` from `src/components/screens/ScoringScreen.jsx`. Evidence: src/components/screens/ScoringScreen.jsx:handleRetireBatter, src/components/screens/ScoringScreen.jsx:calls
- `haptics.error` [LOW] used by `subsystem-73-0-src-components` from `src/components/screens/AuthScreen.jsx`. Evidence: src/components/screens/AuthScreen.jsx:haptics.error, src/components/screens/AuthScreen.jsx:calls, src/components/screens/AuthScreen.jsx:calls
- `haptics.heavy` [LOW] used by `subsystem-2-0-src-components` from `src/components/screens/ScoringScreen.jsx`. Evidence: src/components/screens/ScoringScreen.jsx:haptics.heavy, src/components/screens/ScoringScreen.jsx:calls, src/components/screens/ScoringScreen.jsx:calls
- `haptics.light` [LOW] used by `subsystem-122-0-src-components` from `src/components/screens/AuthScreen.jsx`. Evidence: src/components/screens/AuthScreen.jsx:haptics.light, src/components/screens/ScoringScreen.jsx:calls, src/components/screens/ScoringScreen.jsx:calls
- `haptics.medium` [LOW] used by `subsystem-166-0-src-components` from `src/components/screens/ScoringScreen.jsx`. Evidence: src/components/screens/ScoringScreen.jsx:haptics.medium, src/components/screens/ScoringScreen.jsx:calls, src/components/screens/ScoringScreen.jsx:calls
- `haptics.success` [LOW] used by `subsystem-73-0-src-components` from `src/components/screens/AuthScreen.jsx`. Evidence: src/components/screens/AuthScreen.jsx:haptics.success, src/components/screens/ScoringScreen.jsx:calls, src/components/screens/AuthScreen.jsx:calls
- `hardDeleteItem` [LOW] used by `subsystem-0-0-src-lib` from `src/lib/api.js`. Evidence: src/lib/api.js:hardDeleteItem, src/lib/api.js:calls
- `haystack.includes` [LOW] used by `subsystem-42-0-temp-extraction` from `temp_extraction/src/components/screens/MatchesScreen.jsx`. Evidence: temp_extraction/src/components/screens/MatchesScreen.jsx:haystack.includes, temp_extraction/src/components/screens/MatchesScreen.jsx:calls
- `headCoach.split` [LOW] used by `subsystem-9-0-src-components` from `src/components/screens/TeamsScreen.jsx`. Evidence: src/components/screens/TeamsScreen.jsx:headCoach.split, src/components/screens/TeamsScreen.jsx:calls
- `heuristic` [LOW] used by `subsystem-49-0-src-engine` from `src/engine/matchHighlights.js`. Evidence: src/engine/matchHighlights.js:heuristic, src/engine/matchHighlights.js:calls
- `homeVenue.split` [LOW] used by `subsystem-9-0-src-components` from `src/components/screens/TeamsScreen.jsx`. Evidence: src/components/screens/TeamsScreen.jsx:homeVenue.split, src/components/screens/TeamsScreen.jsx:calls
- `https://deno.land/std@0.168.0/http/server.ts` [LOW] used by `subsystem-17-0-supabase` from `supabase/functions/send-push/index.ts`. Evidence: supabase/functions/send-push/index.ts:https://deno.land/std@0.168.0/http/server.ts, supabase/functions/send-push/index.ts:imports
- `https://esm.sh/@supabase/supabase-js@2` [LOW] used by `subsystem-17-0-supabase` from `supabase/functions/send-push/index.ts`. Evidence: supabase/functions/send-push/index.ts:https://esm.sh/@supabase/supabase-js@2, supabase/functions/send-push/index.ts:imports
- `https://esm.sh/web-push@3.6.7` [LOW] used by `subsystem-17-0-supabase` from `supabase/functions/send-push/index.ts`. Evidence: supabase/functions/send-push/index.ts:https://esm.sh/web-push@3.6.7, supabase/functions/send-push/index.ts:imports
- `hydrateLiveMatch` [LOW] used by `subsystem-0-0-src-lib` from `src/lib/api.js`. Evidence: src/lib/api.js:hydrateLiveMatch, src/lib/api.js:calls
- `hydrateMatchState` [LOW] used by `subsystem-2-0-src-components` from `src/components/screens/ScoringScreen.jsx`. Evidence: src/components/screens/ScoringScreen.jsx:hydrateMatchState, src/components/screens/ScoringScreen.jsx:calls, src/components/screens/ScoringScreen.jsx:calls
- `icon.startsWith` [LOW] used by `subsystem-38-0-src-sw-js` from `src/sw.js`. Evidence: src/sw.js:icon.startsWith, src/sw.js:calls
- `ids.includes` [LOW] used by `subsystem-19-0-src-components` from `src/components/selection/SelectionWorkspace.jsx`. Evidence: src/components/selection/SelectionWorkspace.jsx:ids.includes, src/components/selection/SelectionWorkspace.jsx:calls
- `image.startsWith` [LOW] used by `subsystem-38-0-src-sw-js` from `src/sw.js`. Evidence: src/sw.js:image.startsWith, src/sw.js:calls
- `in` [LOW] used by `subsystem-18-0-src-lib` from `src/lib/standings.js`. Evidence: src/lib/standings.js:in, src/lib/standings.js:calls
- `inner` [LOW] used by `subsystem-5-0-src-context` from `src/context/CricketContext.jsx`. Evidence: src/context/CricketContext.jsx:inner, src/context/CricketContext.jsx:calls, src/context/CricketContext.jsx:calls
- `innings.put` [LOW] used by `subsystem-5-0-src-context` from `src/context/CricketContext.jsx`. Evidence: src/context/CricketContext.jsx:innings.put, src/context/CricketContext.jsx:calls
- `innings.where` [LOW] used by `subsystem-5-0-src-context` from `src/context/CricketContext.jsx`. Evidence: src/context/CricketContext.jsx:innings.where, src/context/CricketContext.jsx:calls
- `inningsData.forEach` [LOW] used by `subsystem-18-0-src-lib` from `src/lib/standings.js`. Evidence: src/lib/standings.js:inningsData.forEach, src/lib/standings.js:calls
- `int` [LOW] used by `subsystem-13-0-src-engine` from `src/engine/validationSchemas.js`. Evidence: src/engine/validationSchemas.js:int, src/engine/validationSchemas.js:calls, src/engine/validationSchemas.js:calls
- `isNaN` [LOW] used by `subsystem-23-0-src-engine` from `src/engine/cricketStateMachine.js`. Evidence: src/engine/cricketStateMachine.js:isNaN, src/engine/cricketStateMachine.js:calls, temp_extraction/src/engine/cricketStateMachine.js:calls
- `items.filter` [LOW] used by `subsystem-40-0-src-components` from `src/components/screens/RecycleBinTab.jsx`. Evidence: src/components/screens/RecycleBinTab.jsx:items.filter, src/components/screens/RecycleBinTab.jsx:calls, src/components/screens/RecycleBinTab.jsx:calls
- `items.map` [LOW] used by `subsystem-40-0-src-components` from `src/components/screens/RecycleBinTab.jsx`. Evidence: src/components/screens/RecycleBinTab.jsx:items.map, src/components/screens/RecycleBinTab.jsx:calls
- `items.push` [LOW] used by `subsystem-0-0-src-lib` from `src/lib/api.js`. Evidence: src/lib/api.js:items.push, src/lib/api.js:calls, src/lib/api.js:calls
- `items.sort` [LOW] used by `subsystem-0-0-src-lib` from `src/lib/api.js`. Evidence: src/lib/api.js:items.sort, src/lib/api.js:calls
- `label.replace` [LOW] used by `subsystem-2-0-src-components` from `temp_extraction/src/components/screens/ScoringScreen.jsx`. Evidence: temp_extraction/src/components/screens/ScoringScreen.jsx:label.replace, temp_extraction/src/components/screens/ScoringScreen.jsx:calls
- `lastBalls.map` [LOW] used by `subsystem-2-0-src-components` from `src/components/screens/ScoringScreen.jsx`. Evidence: src/components/screens/ScoringScreen.jsx:lastBalls.map, src/components/screens/ScoringScreen.jsx:calls, temp_extraction/src/components/screens/ScoringScreen.jsx:calls
- `lines.join` [LOW] used by `subsystem-50-0-temp-extraction` from `temp_extraction/src/engine/matchSummaryEngine.js`. Evidence: temp_extraction/src/engine/matchSummaryEngine.js:lines.join, temp_extraction/src/engine/matchSummaryEngine.js:calls
- `lines.push` [LOW] used by `subsystem-50-0-temp-extraction` from `temp_extraction/src/engine/matchSummaryEngine.js`. Evidence: temp_extraction/src/engine/matchSummaryEngine.js:lines.push, temp_extraction/src/engine/matchSummaryEngine.js:calls, temp_extraction/src/engine/matchSummaryEngine.js:calls
- `lines.slice` [LOW] used by `subsystem-10-0-clean-cjs` from `clean.cjs`. Evidence: clean.cjs:lines.slice, clean.cjs:calls
- `listeners.add` [LOW] used by `subsystem-14-0-src-services` from `src/services/SyncService.js`. Evidence: src/services/SyncService.js:listeners.add, src/services/SyncService.js:calls
- `listeners.delete` [LOW] used by `subsystem-14-0-src-services` from `src/services/SyncService.js`. Evidence: src/services/SyncService.js:listeners.delete, src/services/SyncService.js:calls
- `liveMatches.map` [LOW] used by `subsystem-22-0-src-components` from `src/components/screens/HomeScreen.jsx`. Evidence: src/components/screens/HomeScreen.jsx:liveMatches.map, src/components/screens/HomeScreen.jsx:calls, src/components/screens/MatchesScreen.jsx:calls
- `loadCandidates` [LOW] used by `subsystem-1-0-src-context` from `src/context/CricketContext.jsx`. Evidence: src/context/CricketContext.jsx:loadCandidates, src/context/CricketContext.jsx:calls, src/context/CricketContext.jsx:calls
- `localMatches.some` [LOW] used by `subsystem-5-0-src-context` from `src/context/CricketContext.jsx`. Evidence: src/context/CricketContext.jsx:localMatches.some, src/context/CricketContext.jsx:calls
- `localStorage.getItem` [LOW] used by `subsystem-102-0-src-components` from `src/components/NotificationPrompt.jsx`. Evidence: src/components/NotificationPrompt.jsx:localStorage.getItem, src/context/CricketContext.jsx:calls, src/context/CricketContext.jsx:calls
- `localStorage.setItem` [LOW] used by `subsystem-102-0-src-components` from `src/components/NotificationPrompt.jsx`. Evidence: src/components/NotificationPrompt.jsx:localStorage.setItem, src/components/NotificationPrompt.jsx:calls, src/context/CricketContext.jsx:calls
- `location.reload` [LOW] used by `subsystem-61-0-src-components` from `src/components/screens/MatchDetailScreen.jsx`. Evidence: src/components/screens/MatchDetailScreen.jsx:location.reload, src/components/screens/TournamentsScreen.jsx:calls, src/components/screens/MatchDetailScreen.jsx:calls
- `log` [LOW] used by `subsystem-66-0-src-components` from `src/components/screens/ScoringScreen.jsx`. Evidence: src/components/screens/ScoringScreen.jsx:log, src/components/screens/ScoringScreen.jsx:calls
- `loosely` [LOW] used by `subsystem-32-0-src-components` from `src/components/screens/PlayersScreen.jsx`. Evidence: src/components/screens/PlayersScreen.jsx:loosely, src/components/screens/PlayersScreen.jsx:calls
- `lucide-react` [LOW] used by `subsystem-29-0-src-components` from `src/components/BottomNav.jsx`. Evidence: src/components/BottomNav.jsx:lucide-react, src/components/BottomNav.jsx:imports, src/components/Header.jsx:imports
- `map.entries` [LOW] used by `subsystem-42-0-temp-extraction` from `temp_extraction/src/components/screens/MatchesScreen.jsx`. Evidence: temp_extraction/src/components/screens/MatchesScreen.jsx:map.entries, temp_extraction/src/components/screens/MatchesScreen.jsx:calls, temp_extraction/src/components/screens/TournamentsScreen.jsx:calls
- `map.get` [LOW] used by `subsystem-42-0-temp-extraction` from `temp_extraction/src/components/screens/MatchesScreen.jsx`. Evidence: temp_extraction/src/components/screens/MatchesScreen.jsx:map.get, temp_extraction/src/components/screens/MatchesScreen.jsx:calls, temp_extraction/src/components/screens/TournamentsScreen.jsx:calls
- `map.has` [LOW] used by `subsystem-42-0-temp-extraction` from `temp_extraction/src/components/screens/MatchesScreen.jsx`. Evidence: temp_extraction/src/components/screens/MatchesScreen.jsx:map.has, temp_extraction/src/components/screens/MatchesScreen.jsx:calls, temp_extraction/src/components/screens/TournamentsScreen.jsx:calls
- `map.set` [LOW] used by `subsystem-42-0-temp-extraction` from `temp_extraction/src/components/screens/MatchesScreen.jsx`. Evidence: temp_extraction/src/components/screens/MatchesScreen.jsx:map.set, temp_extraction/src/components/screens/MatchesScreen.jsx:calls, temp_extraction/src/components/screens/TournamentsScreen.jsx:calls
- `mappedLog.filter` [LOW] used by `subsystem-1-0-src-context` from `src/context/CricketContext.jsx`. Evidence: src/context/CricketContext.jsx:mappedLog.filter, src/context/CricketContext.jsx:calls
- `mappedLog.push` [LOW] used by `subsystem-1-0-src-context` from `src/context/CricketContext.jsx`. Evidence: src/context/CricketContext.jsx:mappedLog.push, src/context/CricketContext.jsx:calls
- `mappedTeams.filter` [LOW] used by `subsystem-9-0-src-components` from `src/components/screens/TeamsScreen.jsx`. Evidence: src/components/screens/TeamsScreen.jsx:mappedTeams.filter, src/components/screens/TeamsScreen.jsx:calls, src/components/screens/TeamsScreen.jsx:calls
- `mappedTeams.reduce` [LOW] used by `subsystem-9-0-src-components` from `src/components/screens/TeamsScreen.jsx`. Evidence: src/components/screens/TeamsScreen.jsx:mappedTeams.reduce, src/components/screens/TeamsScreen.jsx:calls
- `match` [LOW] used by `subsystem-67-0-src-lib` from `src/lib/api.js`. Evidence: src/lib/api.js:match, src/lib/api.js:calls, temp_extraction/src/engine/matchSummaryEngine.js:calls
- `matchHistory.map` [LOW] used by `subsystem-6-0-src-components` from `src/components/selection/PlayerDetail.jsx`. Evidence: src/components/selection/PlayerDetail.jsx:matchHistory.map, src/components/selection/PlayerDetail.jsx:calls, src/components/selection/PlayerDetail.jsx:calls
- `matches` [LOW] used by `subsystem-0-0-src-lib` from `src/lib/api.js`. Evidence: src/lib/api.js:matches, src/lib/api.js:calls, src/lib/api.js:calls
- `matches.bulkAdd` [LOW] used by `subsystem-5-0-src-context` from `src/context/CricketContext.jsx`. Evidence: src/context/CricketContext.jsx:matches.bulkAdd, src/context/CricketContext.jsx:calls, src/context/CricketContext.jsx:calls
- `matches.clear` [LOW] used by `subsystem-5-0-src-context` from `src/context/CricketContext.jsx`. Evidence: src/context/CricketContext.jsx:matches.clear, src/context/CricketContext.jsx:calls, src/context/CricketContext.jsx:calls
- `matches.delete` [LOW] used by `subsystem-5-0-src-context` from `src/context/CricketContext.jsx`. Evidence: src/context/CricketContext.jsx:matches.delete, src/context/CricketContext.jsx:calls, src/context/CricketContext.jsx:calls
- `matches.filter` [LOW] used by `subsystem-22-0-src-components` from `src/components/screens/HomeScreen.jsx`. Evidence: src/components/screens/HomeScreen.jsx:matches.filter, src/components/screens/HomeScreen.jsx:calls, src/components/screens/HomeScreen.jsx:calls
- `matches.map` [LOW] used by `subsystem-18-0-src-lib` from `src/lib/standings.js`. Evidence: src/lib/standings.js:matches.map, src/lib/standings.js:calls, src/lib/standings.js:calls
- `matches.put` [LOW] used by `subsystem-5-0-src-context` from `src/context/CricketContext.jsx`. Evidence: src/context/CricketContext.jsx:matches.put, src/context/CricketContext.jsx:calls
- `matches.toArray` [LOW] used by `subsystem-5-0-src-context` from `src/context/CricketContext.jsx`. Evidence: src/context/CricketContext.jsx:matches.toArray, src/context/CricketContext.jsx:calls
- `matchesArray.map` [LOW] used by `subsystem-0-0-src-lib` from `src/lib/api.js`. Evidence: src/lib/api.js:matchesArray.map, src/lib/api.js:calls
- `matching` [LOW] used by `subsystem-54-0-src-components` from `src/components/screens/MatchesScreen.jsx`. Evidence: src/components/screens/MatchesScreen.jsx:matching, src/components/screens/MatchesScreen.jsx:calls
- `max` [LOW] used by `subsystem-13-0-src-engine` from `src/engine/validationSchemas.js`. Evidence: src/engine/validationSchemas.js:max, src/engine/validationSchemas.js:calls, src/engine/validationSchemas.js:calls
- `mergedDeliveries.forEach` [LOW] used by `subsystem-1-0-src-context` from `src/context/CricketContext.jsx`. Evidence: src/context/CricketContext.jsx:mergedDeliveries.forEach, src/context/CricketContext.jsx:calls
- `message.includes` [LOW] used by `subsystem-0-0-src-lib` from `src/lib/api.js`. Evidence: src/lib/api.js:message.includes, src/lib/api.js:calls
- `metrics.map` [LOW] used by `subsystem-76-0-src-components` from `src/components/screens/PlayerComparisonModal.jsx`. Evidence: src/components/screens/PlayerComparisonModal.jsx:metrics.map, src/components/screens/PlayerComparisonModal.jsx:calls, temp_extraction/src/components/screens/PlayerComparisonModal.jsx:calls
- `min` [LOW] used by `subsystem-13-0-src-engine` from `src/engine/validationSchemas.js`. Evidence: src/engine/validationSchemas.js:min, src/engine/validationSchemas.js:calls, src/engine/validationSchemas.js:calls
- `mobileGroups.map` [LOW] used by `subsystem-26-0-temp-extraction` from `temp_extraction/src/components/screens/PlayersScreen.jsx`. Evidence: temp_extraction/src/components/screens/PlayersScreen.jsx:mobileGroups.map, temp_extraction/src/components/screens/PlayersScreen.jsx:calls
- `motion/react` [LOW] used by `subsystem-53-0-src-app-jsx` from `src/App.jsx`. Evidence: src/App.jsx:motion/react, src/App.jsx:imports, src/components/AnimatedPage.jsx:imports
- `ms.every` [LOW] used by `subsystem-60-0-temp-extraction` from `temp_extraction/src/components/screens/TournamentsScreen.jsx`. Evidence: temp_extraction/src/components/screens/TournamentsScreen.jsx:ms.every, temp_extraction/src/components/screens/TournamentsScreen.jsx:calls
- `ms.filter` [LOW] used by `subsystem-15-0-src-components` from `src/components/screens/TournamentsScreen.jsx`. Evidence: src/components/screens/TournamentsScreen.jsx:ms.filter, src/components/screens/TournamentsScreen.jsx:calls, temp_extraction/src/components/screens/TournamentsScreen.jsx:calls
- `ms.map` [LOW] used by `subsystem-15-0-src-components` from `src/components/screens/TournamentsScreen.jsx`. Evidence: src/components/screens/TournamentsScreen.jsx:ms.map, src/components/screens/TournamentsScreen.jsx:calls, temp_extraction/src/components/screens/TournamentsScreen.jsx:calls
- `ms.some` [LOW] used by `subsystem-60-0-temp-extraction` from `temp_extraction/src/components/screens/TournamentsScreen.jsx`. Evidence: temp_extraction/src/components/screens/TournamentsScreen.jsx:ms.some, temp_extraction/src/components/screens/TournamentsScreen.jsx:calls
- `myScoringMatches.map` [LOW] used by `subsystem-54-0-src-components` from `src/components/screens/MatchesScreen.jsx`. Evidence: src/components/screens/MatchesScreen.jsx:myScoringMatches.map, src/components/screens/MatchesScreen.jsx:calls
- `n.includes` [LOW] used by `subsystem-24-0-src-components` from `src/components/screens/TeamRegistrationTab.jsx`. Evidence: src/components/screens/TeamRegistrationTab.jsx:n.includes, src/components/screens/TeamRegistrationTab.jsx:calls, src/components/screens/TeamRegistrationTab.jsx:calls
- `name.includes` [LOW] used by `subsystem-6-0-src-components` from `src/components/CricketIcons.jsx`. Evidence: src/components/CricketIcons.jsx:name.includes, src/components/CricketIcons.jsx:calls, src/components/CricketIcons.jsx:calls
- `name.replace` [LOW] used by `subsystem-30-0-src-components` from `src/components/screens/SelectionScreen.jsx`. Evidence: src/components/screens/SelectionScreen.jsx:name.replace, src/components/screens/SelectionScreen.jsx:calls, src/components/selection/SelectionWorkspace.jsx:calls
- `name.split` [LOW] used by `subsystem-167-0-src-components` from `src/components/screens/ScoringScreen.jsx`. Evidence: src/components/screens/ScoringScreen.jsx:name.split, src/components/screens/ScoringScreen.jsx:calls, src/components/screens/SelectionScreen.jsx:calls
- `name.toLowerCase` [LOW] used by `subsystem-24-0-src-components` from `src/components/screens/TeamRegistrationTab.jsx`. Evidence: src/components/screens/TeamRegistrationTab.jsx:name.toLowerCase, src/components/screens/TeamRegistrationTab.jsx:calls, temp_extraction/src/components/screens/MatchSetupScreen.jsx:calls
- `name.trim` [LOW] used by `subsystem-0-0-src-lib` from `src/lib/api.js`. Evidence: src/lib/api.js:name.trim, src/lib/api.js:calls
- `navigate` [LOW] used by `subsystem-1-0-src-context` from `src/context/CricketContext.jsx`. Evidence: src/context/CricketContext.jsx:navigate, src/context/CricketContext.jsx:calls, temp_extraction/src/context/CricketContext.jsx:calls
- `navigateTo` [LOW] used by `subsystem-29-0-src-components` from `src/components/BottomNav.jsx`. Evidence: src/components/BottomNav.jsx:navigateTo, src/components/Header.jsx:calls, src/components/screens/HomeScreen.jsx:calls
- `navigator.share` [LOW] used by `subsystem-58-0-src-components` from `src/components/ui/MatchMediaReport.jsx`. Evidence: src/components/ui/MatchMediaReport.jsx:navigator.share, src/components/ui/MatchMediaReport.jsx:calls, temp_extraction/src/components/ui/MatchMediaReport.jsx:calls
- `navigator.vibrate` [LOW] used by `subsystem-52-0-src-hooks` from `src/hooks/useHaptics.js`. Evidence: src/hooks/useHaptics.js:navigator.vibrate, src/hooks/useHaptics.js:calls
- `neq` [LOW] used by `subsystem-0-0-src-lib` from `src/lib/api.js`. Evidence: src/lib/api.js:neq, src/lib/api.js:calls, src/lib/api.js:calls
- `newSelected.add` [LOW] used by `subsystem-8-0-src-components` from `src/components/screens/SeasonMigrationTab.jsx`. Evidence: src/components/screens/SeasonMigrationTab.jsx:newSelected.add, src/components/screens/SeasonMigrationTab.jsx:calls
- `newSelected.delete` [LOW] used by `subsystem-8-0-src-components` from `src/components/screens/SeasonMigrationTab.jsx`. Evidence: src/components/screens/SeasonMigrationTab.jsx:newSelected.delete, src/components/screens/SeasonMigrationTab.jsx:calls, src/components/screens/SeasonMigrationTab.jsx:calls
- `newSelected.has` [LOW] used by `subsystem-8-0-src-components` from `src/components/screens/SeasonMigrationTab.jsx`. Evidence: src/components/screens/SeasonMigrationTab.jsx:newSelected.has, src/components/screens/SeasonMigrationTab.jsx:calls
- `newTeamDistrict.startsWith` [LOW] used by `subsystem-21-0-src-components` from `src/components/screens/TeamRegistrationTab.jsx`. Evidence: src/components/screens/TeamRegistrationTab.jsx:newTeamDistrict.startsWith, src/components/screens/TeamRegistrationTab.jsx:calls, src/components/screens/TeamRegistrationTab.jsx:calls
- `newTeamName.substring` [LOW] used by `subsystem-21-0-src-components` from `src/components/screens/TeamRegistrationTab.jsx`. Evidence: src/components/screens/TeamRegistrationTab.jsx:newTeamName.substring, src/components/screens/TeamRegistrationTab.jsx:calls
- `new_lines.append` [LOW] used by `subsystem-43-0-fix-logo-py` from `fix_logo.py`. Evidence: fix_logo.py:new_lines.append, fix_logo.py:calls
- `non_striker_id` [LOW] used by `subsystem-0-0-src-lib` from `src/lib/api.js`. Evidence: src/lib/api.js:non_striker_id, src/lib/api.js:calls
- `normalizeSelectionPlayer` [LOW] used by `subsystem-19-0-src-components` from `src/components/selection/SelectionWorkspace.jsx`. Evidence: src/components/selection/SelectionWorkspace.jsx:normalizeSelectionPlayer, src/components/selection/SelectionWorkspace.jsx:calls
- `normalized.includes` [LOW] used by `subsystem-26-0-temp-extraction` from `temp_extraction/src/components/screens/PlayersScreen.jsx`. Evidence: temp_extraction/src/components/screens/PlayersScreen.jsx:normalized.includes, temp_extraction/src/components/screens/PlayersScreen.jsx:calls, temp_extraction/src/components/screens/PlayersScreen.jsx:calls
- `not` [LOW] used by `subsystem-0-0-src-lib` from `src/lib/api.js`. Evidence: src/lib/api.js:not, src/lib/api.js:calls, src/lib/api.js:calls
- `notation` [LOW] used by `subsystem-23-0-src-engine` from `src/engine/cricketStateMachine.js`. Evidence: src/engine/cricketStateMachine.js:notation, src/engine/cricketStateMachine.js:calls, temp_extraction/src/engine/cricketStateMachine.js:calls
- `notification.close` [LOW] used by `subsystem-38-0-src-sw-js` from `src/sw.js`. Evidence: src/sw.js:notification.close, src/sw.js:calls
- `nullable` [LOW] used by `subsystem-13-0-src-engine` from `src/engine/validationSchemas.js`. Evidence: src/engine/validationSchemas.js:nullable, src/engine/validationSchemas.js:calls, src/engine/validationSchemas.js:calls
- `officials.map` [LOW] used by `subsystem-85-0-src-components` from `src/components/screens/MatchOverviewScreen.jsx`. Evidence: src/components/screens/MatchOverviewScreen.jsx:officials.map, src/components/screens/MatchOverviewScreen.jsx:calls, temp_extraction/src/components/screens/MatchOverviewScreen.jsx:calls
- `offlineQueueFn` [LOW] used by `subsystem-14-0-src-services` from `src/services/SyncService.js`. Evidence: src/services/SyncService.js:offlineQueueFn, src/services/SyncService.js:calls, src/services/SyncService.js:calls
- `onChange` [LOW] used by `subsystem-103-0-src-components` from `src/components/screens/InningsInitScreen.jsx`. Evidence: src/components/screens/InningsInitScreen.jsx:onChange, src/components/screens/InningsInitScreen.jsx:calls, src/components/screens/MatchDetailScreen.jsx:calls
- `onClick` [LOW] used by `subsystem-79-0-src-components` from `src/components/ui/MatchCard.jsx`. Evidence: src/components/ui/MatchCard.jsx:onClick, src/components/ui/MatchCard.jsx:calls
- `onClose` [LOW] used by `subsystem-170-0-src-components` from `src/components/screens/SelectorAssignmentModal.jsx`. Evidence: src/components/screens/SelectorAssignmentModal.jsx:onClose, src/components/ui/BottomSheet.jsx:calls, src/components/selection/CreateTeamModal.jsx:calls
- `onCreateTeam` [LOW] used by `subsystem-108-0-src-components` from `src/components/selection/CreateTeamModal.jsx`. Evidence: src/components/selection/CreateTeamModal.jsx:onCreateTeam, src/components/selection/CreateTeamModal.jsx:calls
- `onFilterChange` [LOW] used by `subsystem-55-0-src-components` from `src/components/selection/FilterTiles.jsx`. Evidence: src/components/selection/FilterTiles.jsx:onFilterChange, src/components/selection/FilterTiles.jsx:calls, src/components/selection/FilterTiles.jsx:calls
- `onNavigate` [LOW] used by `subsystem-6-0-src-components` from `src/components/selection/CampaignOverview.jsx`. Evidence: src/components/selection/CampaignOverview.jsx:onNavigate, src/components/selection/CampaignOverview.jsx:calls, src/components/selection/CampaignOverview.jsx:calls
- `onNeedRefresh` [LOW] used by `subsystem-25-0-src-main-jsx` from `src/main.jsx`. Evidence: src/main.jsx:onNeedRefresh, src/main.jsx:calls
- `onOfflineReady` [LOW] used by `subsystem-25-0-src-main-jsx` from `src/main.jsx`. Evidence: src/main.jsx:onOfflineReady, src/main.jsx:calls
- `onRemove` [LOW] used by `subsystem-51-0-src-components` from `src/components/selection/SelectedTeam.jsx`. Evidence: src/components/selection/SelectedTeam.jsx:onRemove, src/components/selection/SelectedTeam.jsx:calls
- `onRowClick` [LOW] used by `subsystem-36-0-src-components` from `src/components/ui/DataTable.jsx`. Evidence: src/components/ui/DataTable.jsx:onRowClick, src/components/ui/DataTable.jsx:calls, temp_extraction/src/components/ui/DataTable.jsx:calls
- `onSave` [LOW] used by `subsystem-63-0-src-components` from `src/components/ui/TeamManagerModal.jsx`. Evidence: src/components/ui/TeamManagerModal.jsx:onSave, src/components/ui/TeamManagerModal.jsx:calls, src/components/ui/TournamentManagerModal.jsx:calls
- `onSelect` [LOW] used by `subsystem-51-0-src-components` from `src/components/selection/SelectedTeam.jsx`. Evidence: src/components/selection/SelectedTeam.jsx:onSelect, src/components/selection/SelectedTeam.jsx:calls, src/components/selection/SelectedTeam.jsx:calls
- `onSelectPlayer` [LOW] used by `subsystem-94-0-src-components` from `src/components/selection/PlayerList.jsx`. Evidence: src/components/selection/PlayerList.jsx:onSelectPlayer, src/components/selection/PlayerList.jsx:calls, src/components/selection/PlayerPool.jsx:calls
- `onToggle` [LOW] used by `subsystem-15-0-src-components` from `src/components/screens/TournamentsScreen.jsx`. Evidence: src/components/screens/TournamentsScreen.jsx:onToggle, src/components/screens/TournamentsScreen.jsx:calls
- `onToggleCompare` [LOW] used by `subsystem-44-0-src-components` from `src/components/selection/PlayerPool.jsx`. Evidence: src/components/selection/PlayerPool.jsx:onToggleCompare, src/components/selection/PlayerPool.jsx:calls, src/components/selection/Shortlist.jsx:calls
- `onToggleSelectTeamPlayer` [LOW] used by `subsystem-44-0-src-components` from `src/components/selection/PlayerPool.jsx`. Evidence: src/components/selection/PlayerPool.jsx:onToggleSelectTeamPlayer, src/components/selection/PlayerPool.jsx:calls
- `onToggleShortlist` [LOW] used by `subsystem-95-0-src-components` from `src/components/selection/Shortlist.jsx`. Evidence: src/components/selection/Shortlist.jsx:onToggleShortlist, src/components/selection/Shortlist.jsx:calls
- `onToggleShortlistPlayer` [LOW] used by `subsystem-44-0-src-components` from `src/components/selection/PlayerPool.jsx`. Evidence: src/components/selection/PlayerPool.jsx:onToggleShortlistPlayer, src/components/selection/PlayerPool.jsx:calls
- `onUpdateTeam` [LOW] used by `subsystem-48-0-src-components` from `src/components/selection/TeamSelectionDashboard.jsx`. Evidence: src/components/selection/TeamSelectionDashboard.jsx:onUpdateTeam, src/components/selection/TeamSelectionDashboard.jsx:calls, src/components/selection/TeamSelectionDashboard.jsx:calls
- `onUpdateTeamRoles` [LOW] used by `subsystem-175-0-src-components` from `src/components/selection/SelectedTeam.jsx`. Evidence: src/components/selection/SelectedTeam.jsx:onUpdateTeamRoles, src/components/selection/SelectedTeam.jsx:calls
- `open` [LOW] used by `subsystem-43-0-fix-logo-py` from `fix_logo.py`. Evidence: fix_logo.py:open, fix_logo.py:calls, fix_logo.py:calls
- `optional` [LOW] used by `subsystem-13-0-src-engine` from `src/engine/validationSchemas.js`. Evidence: src/engine/validationSchemas.js:optional, src/engine/validationSchemas.js:calls, src/engine/validationSchemas.js:calls
- `options.map` [LOW] used by `subsystem-71-0-src-components` from `src/components/selection/SelectionFilters.jsx`. Evidence: src/components/selection/SelectionFilters.jsx:options.map, src/components/selection/SelectionFilters.jsx:calls
- `or` [LOW] used by `subsystem-13-0-src-engine` from `src/engine/validationSchemas.js`. Evidence: src/engine/validationSchemas.js:or, src/engine/validationSchemas.js:calls, temp_extraction/src/engine/validationSchemas.js:calls
- `order` [LOW] used by `subsystem-0-0-src-lib` from `src/lib/api.js`. Evidence: src/lib/api.js:order, src/lib/api.js:calls, src/lib/api.js:calls
- `os` [LOW] used by `subsystem-43-0-fix-logo-py` from `fix_logo.py`. Evidence: fix_logo.py:os, fix_logo.py:imports
- `os.walk` [LOW] used by `subsystem-43-0-fix-logo-py` from `fix_logo.py`. Evidence: fix_logo.py:os.walk, fix_logo.py:calls
- `out` [LOW] used by `subsystem-37-0-src-engine` from `src/engine/derivedScorecard.js`. Evidence: src/engine/derivedScorecard.js:out, temp_extraction/src/data/mockData.js:calls, src/engine/derivedScorecard.js:calls
- `over` [LOW] used by `subsystem-23-0-src-engine` from `src/engine/cricketStateMachine.js`. Evidence: src/engine/cricketStateMachine.js:over, src/engine/cricketStateMachine.js:calls, temp_extraction/src/engine/cricketStateMachine.js:calls
- `over.split` [LOW] used by `subsystem-1-0-src-context` from `src/context/CricketContext.jsx`. Evidence: src/context/CricketContext.jsx:over.split, src/context/CricketContext.jsx:calls
- `pName.toLowerCase` [LOW] used by `subsystem-32-0-src-components` from `src/components/screens/PlayersScreen.jsx`. Evidence: src/components/screens/PlayersScreen.jsx:pName.toLowerCase, src/components/screens/PlayersScreen.jsx:calls, src/components/screens/TeamRegistrationTab.jsx:calls
- `padStart` [LOW] used by `subsystem-173-0-src-components` from `src/components/screens/TeamsScreen.jsx`. Evidence: src/components/screens/TeamsScreen.jsx:padStart, src/components/screens/TeamsScreen.jsx:calls, src/components/screens/TournamentsScreen.jsx:calls
- `part.trim` [LOW] used by `subsystem-27-0-apply-bug5-sql-js` from `apply-bug5-sql.js`. Evidence: apply-bug5-sql.js:part.trim, apply-bug5-sql.js:calls
- `participatingTeams.filter` [LOW] used by `subsystem-45-0-src-components` from `src/components/ui/TournamentManagerModal.jsx`. Evidence: src/components/ui/TournamentManagerModal.jsx:participatingTeams.filter, src/components/ui/TournamentManagerModal.jsx:calls
- `participatingTeams.includes` [LOW] used by `subsystem-45-0-src-components` from `src/components/ui/TournamentManagerModal.jsx`. Evidence: src/components/ui/TournamentManagerModal.jsx:participatingTeams.includes, src/components/ui/TournamentManagerModal.jsx:calls
- `participatingTeams.map` [LOW] used by `subsystem-0-0-src-lib` from `src/lib/api.js`. Evidence: src/lib/api.js:participatingTeams.map, src/lib/api.js:calls, src/lib/api.js:calls
- `partnerships.push` [LOW] used by `subsystem-37-0-src-engine` from `src/engine/derivedScorecard.js`. Evidence: src/engine/derivedScorecard.js:partnerships.push, src/engine/derivedScorecard.js:calls, src/engine/derivedScorecard.js:calls
- `password.replace` [LOW] used by `subsystem-93-0-src-components` from `src/components/screens/AccessControlScreen.jsx`. Evidence: src/components/screens/AccessControlScreen.jsx:password.replace, src/components/screens/AccessControlScreen.jsx:calls, temp_extraction/src/components/screens/AccessControlScreen.jsx:calls
- `path.join` [LOW] used by `subsystem-27-0-apply-bug5-sql-js` from `apply-bug5-sql.js`. Evidence: apply-bug5-sql.js:path.join, apply-bug5-sql.js:calls
- `path.resolve` [LOW] used by `subsystem-46-0-temp-extraction` from `temp_extraction/vite.config.ts`. Evidence: temp_extraction/vite.config.ts:path.resolve, temp_extraction/vite.config.ts:calls, vite.config.ts:calls
- `pathname.split` [LOW] used by `subsystem-1-0-src-context` from `src/context/CricketContext.jsx`. Evidence: src/context/CricketContext.jsx:pathname.split, src/context/CricketContext.jsx:calls, temp_extraction/src/context/CricketContext.jsx:calls
- `pattern` [LOW] used by `subsystem-52-0-src-hooks` from `src/hooks/useHaptics.js`. Evidence: src/hooks/useHaptics.js:pattern, src/hooks/useHaptics.js:calls
- `payload` [LOW] used by `subsystem-23-0-src-engine` from `src/engine/cricketStateMachine.js`. Evidence: src/engine/cricketStateMachine.js:payload, src/engine/cricketStateMachine.js:calls, temp_extraction/src/engine/cricketStateMachine.js:calls
- `performance.join` [LOW] used by `subsystem-50-0-temp-extraction` from `temp_extraction/src/engine/matchSummaryEngine.js`. Evidence: temp_extraction/src/engine/matchSummaryEngine.js:performance.join, temp_extraction/src/engine/matchSummaryEngine.js:calls
- `performance.push` [LOW] used by `subsystem-50-0-temp-extraction` from `temp_extraction/src/engine/matchSummaryEngine.js`. Evidence: temp_extraction/src/engine/matchSummaryEngine.js:performance.push, temp_extraction/src/engine/matchSummaryEngine.js:calls, temp_extraction/src/engine/matchSummaryEngine.js:calls
- `persistMatchSetup` [LOW] used by `subsystem-0-0-src-lib` from `src/lib/api.js`. Evidence: src/lib/api.js:persistMatchSetup, src/lib/api.js:calls
- `pieData.map` [LOW] used by `subsystem-59-0-temp-extraction` from `temp_extraction/src/components/screens/PlayerProfileScreen.jsx`. Evidence: temp_extraction/src/components/screens/PlayerProfileScreen.jsx:pieData.map, temp_extraction/src/components/screens/PlayerProfileScreen.jsx:calls, temp_extraction/src/components/screens/PlayerProfileScreen.jsx:calls
- `playerName.includes` [LOW] used by `subsystem-16-0-src-components` from `src/components/selection/selectionData.js`. Evidence: src/components/selection/selectionData.js:playerName.includes, src/components/selection/selectionData.js:calls
- `player_id` [LOW] used by `subsystem-0-0-src-lib` from `src/lib/api.js`. Evidence: src/lib/api.js:player_id, src/lib/api.js:calls, src/lib/api.js:calls
- `players.bulkAdd` [LOW] used by `subsystem-5-0-src-context` from `src/context/CricketContext.jsx`. Evidence: src/context/CricketContext.jsx:players.bulkAdd, src/context/CricketContext.jsx:calls
- `players.clear` [LOW] used by `subsystem-5-0-src-context` from `src/context/CricketContext.jsx`. Evidence: src/context/CricketContext.jsx:players.clear, src/context/CricketContext.jsx:calls, src/context/CricketContext.jsx:calls
- `players.delete` [LOW] used by `subsystem-105-0-src-components` from `src/components/screens/PlayerProfileScreen.jsx`. Evidence: src/components/screens/PlayerProfileScreen.jsx:players.delete, src/components/screens/PlayerProfileScreen.jsx:calls
- `players.filter` [LOW] used by `subsystem-104-0-src-components` from `src/components/screens/MatchSetupScreen.jsx`. Evidence: src/components/screens/MatchSetupScreen.jsx:players.filter, src/components/screens/MatchSetupScreen.jsx:calls, src/components/screens/PlayerComparisonModal.jsx:calls
- `players.find` [LOW] used by `subsystem-103-0-src-components` from `src/components/screens/InningsInitScreen.jsx`. Evidence: src/components/screens/InningsInitScreen.jsx:players.find, src/components/screens/InningsInitScreen.jsx:calls, src/components/screens/MatchSetupScreen.jsx:calls
- `players.map` [LOW] used by `subsystem-159-0-src-components` from `src/components/screens/InningsInitScreen.jsx`. Evidence: src/components/screens/InningsInitScreen.jsx:players.map, src/components/screens/InningsInitScreen.jsx:calls, src/components/screens/MatchSetupScreen.jsx:calls
- `players.put` [LOW] used by `subsystem-1-0-src-context` from `src/context/CricketContext.jsx`. Evidence: src/context/CricketContext.jsx:players.put, src/context/CricketContext.jsx:calls
- `players.reduce` [LOW] used by `subsystem-2-0-src-components` from `src/components/ui/MatchScorecard.jsx`. Evidence: src/components/ui/MatchScorecard.jsx:players.reduce, src/components/ui/MatchScorecard.jsx:calls, temp_extraction/src/components/ui/MatchScorecard.jsx:calls
- `players.toArray` [LOW] used by `subsystem-5-0-src-context` from `src/context/CricketContext.jsx`. Evidence: src/context/CricketContext.jsx:players.toArray, src/context/CricketContext.jsx:calls
- `playingXI.filter` [LOW] used by `subsystem-3-0-src-components` from `temp_extraction/src/components/screens/MatchSetupScreen.jsx`. Evidence: temp_extraction/src/components/screens/MatchSetupScreen.jsx:playingXI.filter, temp_extraction/src/components/screens/MatchSetupScreen.jsx:calls, temp_extraction/src/components/screens/ScoringScreen.jsx:calls
- `playingXI.find` [LOW] used by `subsystem-3-0-src-components` from `temp_extraction/src/components/screens/MatchSetupScreen.jsx`. Evidence: temp_extraction/src/components/screens/MatchSetupScreen.jsx:playingXI.find, temp_extraction/src/components/screens/MatchSetupScreen.jsx:calls, temp_extraction/src/components/screens/MatchSetupScreen.jsx:calls
- `playingXI.map` [LOW] used by `subsystem-3-0-src-components` from `temp_extraction/src/components/screens/MatchSetupScreen.jsx`. Evidence: temp_extraction/src/components/screens/MatchSetupScreen.jsx:playingXI.map, temp_extraction/src/components/screens/MatchSetupScreen.jsx:calls
- `points.map` [LOW] used by `subsystem-6-0-src-components` from `src/components/selection/PerformanceGraphs.jsx`. Evidence: src/components/selection/PerformanceGraphs.jsx:points.map, src/components/selection/PerformanceGraphs.jsx:calls, src/components/selection/PerformanceGraphs.jsx:calls
- `pointsTable.map` [LOW] used by `subsystem-15-0-src-components` from `src/components/screens/TournamentsScreen.jsx`. Evidence: src/components/screens/TournamentsScreen.jsx:pointsTable.map, src/components/screens/TournamentsScreen.jsx:calls
- `prev.filter` [LOW] used by `subsystem-7-0-src-components` from `src/components/screens/AdministrationScreen.jsx`. Evidence: src/components/screens/AdministrationScreen.jsx:prev.filter, src/components/screens/AdministrationScreen.jsx:calls, src/components/screens/PlayerProfileScreen.jsx:calls
- `prev.find` [LOW] used by `subsystem-31-0-src-components` from `src/components/screens/SelectorAssignmentModal.jsx`. Evidence: src/components/screens/SelectorAssignmentModal.jsx:prev.find, src/components/screens/SelectorAssignmentModal.jsx:calls
- `prev.findIndex` [LOW] used by `subsystem-5-0-src-context` from `src/context/CricketContext.jsx`. Evidence: src/context/CricketContext.jsx:prev.findIndex, src/context/CricketContext.jsx:calls, src/context/CricketContext.jsx:calls
- `prev.includes` [LOW] used by `subsystem-98-0-temp-extraction` from `temp_extraction/src/context/CricketContext.jsx`. Evidence: temp_extraction/src/context/CricketContext.jsx:prev.includes, temp_extraction/src/context/CricketContext.jsx:calls
- `prev.map` [LOW] used by `subsystem-7-0-src-components` from `src/components/screens/AdministrationScreen.jsx`. Evidence: src/components/screens/AdministrationScreen.jsx:prev.map, src/components/screens/AdministrationScreen.jsx:calls, src/components/screens/AdministrationScreen.jsx:calls
- `prev.slice` [LOW] used by `subsystem-1-0-src-context` from `src/context/CricketContext.jsx`. Evidence: src/context/CricketContext.jsx:prev.slice, src/context/CricketContext.jsx:calls, src/context/CricketContext.jsx:calls
- `print` [LOW] used by `subsystem-43-0-fix-logo-py` from `fix_logo.py`. Evidence: fix_logo.py:print, fix_logo.py:calls
- `process.cwd` [LOW] used by `subsystem-27-0-apply-bug5-sql-js` from `apply-bug5-sql.js`. Evidence: apply-bug5-sql.js:process.cwd, apply-bug5-sql.js:calls
- `process.exit` [LOW] used by `subsystem-27-0-apply-bug5-sql-js` from `apply-bug5-sql.js`. Evidence: apply-bug5-sql.js:process.exit, apply-bug5-sql.js:calls, delete_season.js:calls
- `processDelivery` [LOW] used by `subsystem-1-0-src-context` from `src/context/CricketContext.jsx`. Evidence: src/context/CricketContext.jsx:processDelivery, src/context/CricketContext.jsx:calls, temp_extraction/src/context/CricketContext.jsx:calls
- `processes.map` [LOW] used by `subsystem-31-0-src-components` from `src/components/screens/SelectorAssignmentModal.jsx`. Evidence: src/components/screens/SelectorAssignmentModal.jsx:processes.map, src/components/screens/SelectorAssignmentModal.jsx:calls, src/context/CricketContext.jsx:calls
- `profiles.map` [LOW] used by `subsystem-7-0-src-components` from `src/components/screens/AdministrationScreen.jsx`. Evidence: src/components/screens/AdministrationScreen.jsx:profiles.map, src/components/screens/AdministrationScreen.jsx:calls, src/components/screens/AdministrationScreen.jsx:calls
- `projectedPlayers.filter` [LOW] used by `subsystem-8-0-src-components` from `src/components/screens/SeasonMigrationTab.jsx`. Evidence: src/components/screens/SeasonMigrationTab.jsx:projectedPlayers.filter, src/components/screens/SeasonMigrationTab.jsx:calls
- `publicId.indexOf` [LOW] used by `subsystem-12-0-src-components` from `src/components/ui/CloudinaryAvatar.jsx`. Evidence: src/components/ui/CloudinaryAvatar.jsx:publicId.indexOf, src/components/ui/CloudinaryAvatar.jsx:calls
- `publicId.match` [LOW] used by `subsystem-12-0-src-components` from `src/components/ui/CloudinaryAvatar.jsx`. Evidence: src/components/ui/CloudinaryAvatar.jsx:publicId.match, src/components/ui/CloudinaryAvatar.jsx:calls
- `publicId.split` [LOW] used by `subsystem-12-0-src-components` from `src/components/ui/CloudinaryAvatar.jsx`. Evidence: src/components/ui/CloudinaryAvatar.jsx:publicId.split, src/components/ui/CloudinaryAvatar.jsx:calls
- `publicId.substring` [LOW] used by `subsystem-12-0-src-components` from `src/components/ui/CloudinaryAvatar.jsx`. Evidence: src/components/ui/CloudinaryAvatar.jsx:publicId.substring, src/components/ui/CloudinaryAvatar.jsx:calls
- `push` [LOW] used by `subsystem-42-0-temp-extraction` from `temp_extraction/src/components/screens/MatchesScreen.jsx`. Evidence: temp_extraction/src/components/screens/MatchesScreen.jsx:push, temp_extraction/src/components/screens/MatchesScreen.jsx:calls, temp_extraction/src/components/screens/TournamentsScreen.jsx:calls
- `pushManager.getSubscription` [LOW] used by `subsystem-28-0-src-components` from `src/components/NotificationPrompt.jsx`. Evidence: src/components/NotificationPrompt.jsx:pushManager.getSubscription, src/components/NotificationPrompt.jsx:calls
- `pushManager.subscribe` [LOW] used by `subsystem-28-0-src-components` from `src/components/NotificationPrompt.jsx`. Evidence: src/components/NotificationPrompt.jsx:pushManager.subscribe, src/components/NotificationPrompt.jsx:calls
- `px_20px_rgba` [LOW] used by `subsystem-3-0-src-components` from `src/components/screens/MatchSetupScreen.jsx`. Evidence: src/components/screens/MatchSetupScreen.jsx:px_20px_rgba, src/components/screens/MatchSetupScreen.jsx:calls
- `px_40px_rgba` [LOW] used by `subsystem-2-0-src-components` from `src/components/screens/ScoringScreen.jsx`. Evidence: src/components/screens/ScoringScreen.jsx:px_40px_rgba, src/components/screens/ScoringScreen.jsx:calls
- `quality` [LOW] used by `subsystem-12-0-src-components` from `src/components/ui/CloudinaryAvatar.jsx`. Evidence: src/components/ui/CloudinaryAvatar.jsx:quality, src/components/ui/CloudinaryAvatar.jsx:calls
- `quickActions.map` [LOW] used by `subsystem-72-0-temp-extraction` from `temp_extraction/src/components/screens/HomeScreen.jsx`. Evidence: temp_extraction/src/components/screens/HomeScreen.jsx:quickActions.map, temp_extraction/src/components/screens/HomeScreen.jsx:calls
- `quickRoles.map` [LOW] used by `subsystem-55-0-src-components` from `src/components/selection/FilterTiles.jsx`. Evidence: src/components/selection/FilterTiles.jsx:quickRoles.map, src/components/selection/FilterTiles.jsx:calls
- `raw.toLowerCase` [LOW] used by `subsystem-26-0-temp-extraction` from `temp_extraction/src/components/screens/PlayersScreen.jsx`. Evidence: temp_extraction/src/components/screens/PlayersScreen.jsx:raw.toLowerCase, temp_extraction/src/components/screens/PlayersScreen.jsx:calls
- `rawData.charCodeAt` [LOW] used by `subsystem-28-0-src-components` from `src/components/NotificationPrompt.jsx`. Evidence: src/components/NotificationPrompt.jsx:rawData.charCodeAt, src/components/NotificationPrompt.jsx:calls
- `react-dom/client` [LOW] used by `subsystem-25-0-src-main-jsx` from `src/main.jsx`. Evidence: src/main.jsx:react-dom/client, src/main.jsx:imports, temp_extraction/src/main.jsx:imports
- `react-router-dom` [LOW] used by `subsystem-53-0-src-app-jsx` from `src/App.jsx`. Evidence: src/App.jsx:react-router-dom, src/App.jsx:imports, src/components/ProtectedRoute.jsx:imports
- `rebuildTeams` [LOW] used by `subsystem-0-0-src-lib` from `src/lib/api.js`. Evidence: src/lib/api.js:rebuildTeams, src/lib/api.js:calls
- `recentMatches.map` [LOW] used by `subsystem-72-0-temp-extraction` from `temp_extraction/src/components/screens/HomeScreen.jsx`. Evidence: temp_extraction/src/components/screens/HomeScreen.jsx:recentMatches.map, temp_extraction/src/components/screens/HomeScreen.jsx:calls
- `recharts` [LOW] used by `subsystem-56-0-src-components` from `src/components/screens/PlayerProfileScreen.jsx`. Evidence: src/components/screens/PlayerProfileScreen.jsx:recharts, src/components/screens/PlayerProfileScreen.jsx:imports, temp_extraction/src/components/screens/PlayerProfileScreen.jsx:imports
- `recordExtra` [LOW] used by `subsystem-2-0-src-components` from `src/components/screens/ScoringScreen.jsx`. Evidence: src/components/screens/ScoringScreen.jsx:recordExtra, src/components/screens/ScoringScreen.jsx:calls, src/components/screens/ScoringScreen.jsx:calls
- `recordRuns` [LOW] used by `subsystem-2-0-src-components` from `src/components/screens/ScoringScreen.jsx`. Evidence: src/components/screens/ScoringScreen.jsx:recordRuns, src/components/screens/ScoringScreen.jsx:calls, temp_extraction/src/components/screens/ScoringScreen.jsx:calls
- `recordWicket` [LOW] used by `subsystem-2-0-src-components` from `src/components/screens/ScoringScreen.jsx`. Evidence: src/components/screens/ScoringScreen.jsx:recordWicket, src/components/screens/ScoringScreen.jsx:calls, temp_extraction/src/components/screens/ScoringScreen.jsx:calls
- `refine` [LOW] used by `subsystem-13-0-src-engine` from `src/engine/validationSchemas.js`. Evidence: src/engine/validationSchemas.js:refine, src/engine/validationSchemas.js:calls
- `refreshAdminData` [LOW] used by `subsystem-45-0-src-components` from `src/components/ui/TournamentManagerModal.jsx`. Evidence: src/components/ui/TournamentManagerModal.jsx:refreshAdminData, src/components/ui/TournamentManagerModal.jsx:calls
- `registerSW` [LOW] used by `subsystem-25-0-src-main-jsx` from `src/main.jsx`. Evidence: src/main.jsx:registerSW, src/main.jsx:calls
- `registeredUsers.filter` [LOW] used by `subsystem-75-0-src-components` from `src/components/screens/JdcaManagementTab.jsx`. Evidence: src/components/screens/JdcaManagementTab.jsx:registeredUsers.filter, src/components/screens/JdcaManagementTab.jsx:calls, src/components/screens/JdcaManagementTab.jsx:calls
- `registeredUsers.find` [LOW] used by `subsystem-7-0-src-components` from `src/components/screens/AdministrationScreen.jsx`. Evidence: src/components/screens/AdministrationScreen.jsx:registeredUsers.find, src/components/screens/AdministrationScreen.jsx:calls
- `registeredUsers.map` [LOW] used by `subsystem-7-0-src-components` from `src/components/screens/AdministrationScreen.jsx`. Evidence: src/components/screens/AdministrationScreen.jsx:registeredUsers.map, src/components/screens/AdministrationScreen.jsx:calls, temp_extraction/src/components/screens/AdministrationScreen.jsx:calls
- `registration.showNotification` [LOW] used by `subsystem-38-0-src-sw-js` from `src/sw.js`. Evidence: src/sw.js:registration.showNotification, src/sw.js:calls
- `registrations.map` [LOW] used by `subsystem-0-0-src-lib` from `src/lib/api.js`. Evidence: src/lib/api.js:registrations.map, src/lib/api.js:calls
- `registrations.push` [LOW] used by `subsystem-8-0-src-components` from `src/components/screens/SeasonMigrationTab.jsx`. Evidence: src/components/screens/SeasonMigrationTab.jsx:registrations.push, src/components/screens/SeasonMigrationTab.jsx:calls
- `repeat` [LOW] used by `subsystem-9-0-src-components` from `src/components/NotificationPrompt.jsx`. Evidence: src/components/NotificationPrompt.jsx:repeat, src/components/ui/StatCard.jsx:calls, temp_extraction/src/components/screens/HomeScreen.jsx:calls
- `replaceBatter` [LOW] used by `subsystem-3-0-src-components` from `src/components/screens/InningsInitScreen.jsx`. Evidence: src/components/screens/InningsInitScreen.jsx:replaceBatter, src/components/screens/InningsInitScreen.jsx:calls, src/components/screens/MatchSetupScreen.jsx:calls
- `replaceBowler` [LOW] used by `subsystem-3-0-src-components` from `src/components/screens/InningsInitScreen.jsx`. Evidence: src/components/screens/InningsInitScreen.jsx:replaceBowler, src/components/screens/InningsInitScreen.jsx:calls, src/components/screens/MatchSetupScreen.jsx:calls
- `replaceStriker` [LOW] used by `subsystem-3-0-src-components` from `src/components/screens/InningsInitScreen.jsx`. Evidence: src/components/screens/InningsInitScreen.jsx:replaceStriker, src/components/screens/InningsInitScreen.jsx:calls, src/components/screens/MatchSetupScreen.jsx:calls
- `representativeTeams.find` [LOW] used by `subsystem-30-0-src-components` from `src/components/screens/SelectionScreen.jsx`. Evidence: src/components/screens/SelectionScreen.jsx:representativeTeams.find, src/components/screens/SelectionScreen.jsx:calls
- `representativeTeams.map` [LOW] used by `subsystem-30-0-src-components` from `src/components/screens/SelectionScreen.jsx`. Evidence: src/components/screens/SelectionScreen.jsx:representativeTeams.map, src/components/screens/SelectionScreen.jsx:calls, src/components/screens/SelectionScreen.jsx:calls
- `req.json` [LOW] used by `subsystem-17-0-supabase` from `supabase/functions/send-push/index.ts`. Evidence: supabase/functions/send-push/index.ts:req.json, supabase/functions/send-push/index.ts:calls
- `required` [LOW] used by `subsystem-13-0-src-engine` from `src/engine/validationSchemas.js`. Evidence: src/engine/validationSchemas.js:required, src/engine/validationSchemas.js:calls, src/engine/validationSchemas.js:calls
- `res.json` [LOW] used by `subsystem-11-0-src-components` from `src/components/screens/PlayerRegistrationScreen.jsx`. Evidence: src/components/screens/PlayerRegistrationScreen.jsx:res.json, src/components/screens/PlayerRegistrationScreen.jsx:calls
- `resetUserPassword` [LOW] used by `subsystem-0-0-src-lib` from `src/lib/api.js`. Evidence: src/lib/api.js:resetUserPassword, src/lib/api.js:calls
- `resize` [LOW] used by `subsystem-12-0-src-components` from `src/components/ui/CloudinaryAvatar.jsx`. Evidence: src/components/ui/CloudinaryAvatar.jsx:resize, src/components/ui/CloudinaryAvatar.jsx:calls
- `restoreItem` [LOW] used by `subsystem-0-0-src-lib` from `src/lib/api.js`. Evidence: src/lib/api.js:restoreItem, src/lib/api.js:calls
- `resultText.includes` [LOW] used by `subsystem-18-0-src-lib` from `src/lib/standings.js`. Evidence: src/lib/standings.js:resultText.includes, src/lib/standings.js:calls, src/lib/standings.js:calls
- `resultText.toLowerCase` [LOW] used by `subsystem-18-0-src-lib` from `src/lib/standings.js`. Evidence: src/lib/standings.js:resultText.toLowerCase, src/lib/standings.js:calls
- `reverse` [LOW] used by `subsystem-6-0-src-components` from `src/components/selection/PerformanceGraphs.jsx`. Evidence: src/components/selection/PerformanceGraphs.jsx:reverse, src/components/selection/PerformanceGraphs.jsx:calls, src/components/selection/PlayerDetail.jsx:calls
- `rgb` [LOW] used by `subsystem-56-0-src-components` from `src/components/screens/PlayerProfileScreen.jsx`. Evidence: src/components/screens/PlayerProfileScreen.jsx:rgb, src/components/screens/PlayerProfileScreen.jsx:calls, src/components/screens/PlayerProfileScreen.jsx:calls
- `rgba` [LOW] used by `subsystem-47-0-src-components` from `src/components/DrawerMenu.jsx`. Evidence: src/components/DrawerMenu.jsx:rgba, src/components/DrawerMenu.jsx:calls, src/components/DrawerMenu.jsx:calls
- `role.includes` [LOW] used by `subsystem-30-0-src-components` from `src/components/screens/SelectionScreen.jsx`. Evidence: src/components/screens/SelectionScreen.jsx:role.includes, src/components/screens/SelectionScreen.jsx:calls, src/components/screens/SelectionScreen.jsx:calls
- `role.replace` [LOW] used by `subsystem-48-0-src-components` from `src/components/selection/TeamSelectionDashboard.jsx`. Evidence: src/components/selection/TeamSelectionDashboard.jsx:role.replace, src/components/selection/TeamSelectionDashboard.jsx:calls
- `role.toLowerCase` [LOW] used by `subsystem-125-0-temp-extraction` from `temp_extraction/src/components/screens/AuthScreen.jsx`. Evidence: temp_extraction/src/components/screens/AuthScreen.jsx:role.toLowerCase, temp_extraction/src/components/screens/AuthScreen.jsx:calls
- `roleFilters.map` [LOW] used by `subsystem-33-0-src-components` from `src/components/screens/ScoutingHubScreen.jsx`. Evidence: src/components/screens/ScoutingHubScreen.jsx:roleFilters.map, src/components/screens/ScoutingHubScreen.jsx:calls, temp_extraction/src/components/screens/ScoutingHubScreen.jsx:calls
- `rosterSearchQuery.toLowerCase` [LOW] used by `subsystem-3-0-src-components` from `temp_extraction/src/components/screens/MatchSetupScreen.jsx`. Evidence: temp_extraction/src/components/screens/MatchSetupScreen.jsx:rosterSearchQuery.toLowerCase, temp_extraction/src/components/screens/MatchSetupScreen.jsx:calls
- `rotate` [LOW] used by `subsystem-35-0-src-components` from `src/components/CricketIllustrations.jsx`. Evidence: src/components/CricketIllustrations.jsx:rotate, src/components/CricketIllustrations.jsx:calls, src/components/CricketIllustrations.jsx:calls
- `run` [LOW] used by `subsystem-27-0-apply-bug5-sql-js` from `apply-bug5-sql.js`. Evidence: apply-bug5-sql.js:run, apply-bug5-sql.js:calls, apply-bug5-sql.js:calls
- `runTest` [LOW] used by `subsystem-101-0-test-stats-js` from `test-stats.js`. Evidence: test-stats.js:runTest, test-stats.js:calls, test-stats.js:calls
- `runs` [LOW] used by `subsystem-101-0-test-stats-js` from `test-stats.js`. Evidence: test-stats.js:runs, test-stats.js:calls
- `runsValues.reduce` [LOW] used by `subsystem-6-0-src-components` from `src/components/selection/PerformanceGraphs.jsx`. Evidence: src/components/selection/PerformanceGraphs.jsx:runsValues.reduce, src/components/selection/PerformanceGraphs.jsx:calls
- `scorers.map` [LOW] used by `subsystem-75-0-src-components` from `src/components/screens/JdcaManagementTab.jsx`. Evidence: src/components/screens/JdcaManagementTab.jsx:scorers.map, src/components/screens/JdcaManagementTab.jsx:calls
- `scrollContainer.addEventListener` [LOW] used by `subsystem-29-0-src-components` from `src/components/BottomNav.jsx`. Evidence: src/components/BottomNav.jsx:scrollContainer.addEventListener, src/components/BottomNav.jsx:calls, src/components/Header.jsx:calls
- `scrollContainer.removeEventListener` [LOW] used by `subsystem-29-0-src-components` from `src/components/BottomNav.jsx`. Evidence: src/components/BottomNav.jsx:scrollContainer.removeEventListener, src/components/BottomNav.jsx:calls, src/components/Header.jsx:calls
- `search.toLowerCase` [LOW] used by `subsystem-42-0-temp-extraction` from `temp_extraction/src/components/screens/MatchesScreen.jsx`. Evidence: temp_extraction/src/components/screens/MatchesScreen.jsx:search.toLowerCase, temp_extraction/src/components/screens/MatchesScreen.jsx:calls, temp_extraction/src/components/screens/TournamentsScreen.jsx:calls
- `searchQuery.toLowerCase` [LOW] used by `subsystem-32-0-src-components` from `src/components/screens/PlayersScreen.jsx`. Evidence: src/components/screens/PlayersScreen.jsx:searchQuery.toLowerCase, src/components/screens/PlayersScreen.jsx:calls, src/components/screens/ScoutingHubScreen.jsx:calls
- `searchQuery.trim` [LOW] used by `subsystem-124-0-src-components` from `src/components/screens/TeamsScreen.jsx`. Evidence: src/components/screens/TeamsScreen.jsx:searchQuery.trim, src/components/screens/TeamsScreen.jsx:calls, src/components/screens/TeamsScreen.jsx:calls
- `seasons.find` [LOW] used by `subsystem-34-0-src-components` from `src/components/screens/SeasonManagementTab.jsx`. Evidence: src/components/screens/SeasonManagementTab.jsx:seasons.find, src/components/screens/SeasonManagementTab.jsx:calls
- `seasons.map` [LOW] used by `subsystem-34-0-src-components` from `src/components/screens/SeasonManagementTab.jsx`. Evidence: src/components/screens/SeasonManagementTab.jsx:seasons.map, src/components/screens/SeasonManagementTab.jsx:calls, src/components/ui/TeamManagerModal.jsx:calls
- `selectedCategory.replace` [LOW] used by `subsystem-77-0-src-components` from `src/components/screens/SelectorsScreen.jsx`. Evidence: src/components/screens/SelectorsScreen.jsx:selectedCategory.replace, src/components/screens/SelectorsScreen.jsx:calls, temp_extraction/src/components/screens/SelectionScreen.jsx:calls
- `selectedDistrict.toLowerCase` [LOW] used by `subsystem-26-0-temp-extraction` from `temp_extraction/src/components/screens/PlayersScreen.jsx`. Evidence: temp_extraction/src/components/screens/PlayersScreen.jsx:selectedDistrict.toLowerCase, temp_extraction/src/components/screens/PlayersScreen.jsx:calls
- `selectedIds.has` [LOW] used by `subsystem-8-0-src-components` from `src/components/screens/SeasonMigrationTab.jsx`. Evidence: src/components/screens/SeasonMigrationTab.jsx:selectedIds.has, src/components/screens/SeasonMigrationTab.jsx:calls, src/components/screens/SeasonMigrationTab.jsx:calls
- `selectedPlayerIds.filter` [LOW] used by `subsystem-48-0-src-components` from `src/components/selection/TeamSelectionDashboard.jsx`. Evidence: src/components/selection/TeamSelectionDashboard.jsx:selectedPlayerIds.filter, src/components/selection/TeamSelectionDashboard.jsx:calls
- `selectedPlayerIds.map` [LOW] used by `subsystem-0-0-src-lib` from `src/lib/api.js`. Evidence: src/lib/api.js:selectedPlayerIds.map, src/lib/api.js:calls, src/lib/api.js:calls
- `selectedPlayers.filter` [LOW] used by `subsystem-51-0-src-components` from `src/components/selection/SelectedTeam.jsx`. Evidence: src/components/selection/SelectedTeam.jsx:selectedPlayers.filter, src/components/selection/SelectedTeam.jsx:calls, src/components/selection/SelectedTeam.jsx:calls
- `selectedPlayers.forEach` [LOW] used by `subsystem-48-0-src-components` from `src/components/selection/TeamSelectionDashboard.jsx`. Evidence: src/components/selection/TeamSelectionDashboard.jsx:selectedPlayers.forEach, src/components/selection/TeamSelectionDashboard.jsx:calls
- `selectedPlayers.map` [LOW] used by `subsystem-51-0-src-components` from `src/components/selection/SelectedTeam.jsx`. Evidence: src/components/selection/SelectedTeam.jsx:selectedPlayers.map, src/components/selection/SelectedTeam.jsx:calls, src/components/selection/SelectedTeam.jsx:calls
- `selectedPlayers.reduce` [LOW] used by `subsystem-19-0-src-components` from `src/components/selection/SelectionWorkspace.jsx`. Evidence: src/components/selection/SelectionWorkspace.jsx:selectedPlayers.reduce, src/components/selection/SelectionWorkspace.jsx:calls
- `selectedRole.toLowerCase` [LOW] used by `subsystem-30-0-src-components` from `src/components/screens/SelectionScreen.jsx`. Evidence: src/components/screens/SelectionScreen.jsx:selectedRole.toLowerCase, src/components/screens/SelectionScreen.jsx:calls, temp_extraction/src/components/screens/AuthScreen.jsx:calls
- `selectedSquad.filter` [LOW] used by `subsystem-118-0-temp-extraction` from `temp_extraction/src/components/screens/SelectionScreen.jsx`. Evidence: temp_extraction/src/components/screens/SelectionScreen.jsx:selectedSquad.filter, temp_extraction/src/components/screens/SelectionScreen.jsx:calls
- `selectedSquad.map` [LOW] used by `subsystem-30-0-src-components` from `src/components/screens/SelectionScreen.jsx`. Evidence: src/components/screens/SelectionScreen.jsx:selectedSquad.map, src/components/screens/SelectionScreen.jsx:calls, src/components/screens/SelectionScreen.jsx:calls
- `selectedSquad.reduce` [LOW] used by `subsystem-30-0-src-components` from `src/components/screens/SelectionScreen.jsx`. Evidence: src/components/screens/SelectionScreen.jsx:selectedSquad.reduce, src/components/screens/SelectionScreen.jsx:calls, temp_extraction/src/components/screens/SelectionScreen.jsx:calls
- `selectedTeamPlayerIds.includes` [LOW] used by `subsystem-44-0-src-components` from `src/components/selection/PlayerPool.jsx`. Evidence: src/components/selection/PlayerPool.jsx:selectedTeamPlayerIds.includes, src/components/selection/PlayerPool.jsx:calls
- `selectionHistory.map` [LOW] used by `subsystem-6-0-src-components` from `src/components/selection/PlayerDetail.jsx`. Evidence: src/components/selection/PlayerDetail.jsx:selectionHistory.map, src/components/selection/PlayerDetail.jsx:calls
- `selection_decisions` [LOW] used by `subsystem-0-0-src-lib` from `src/lib/api.js`. Evidence: src/lib/api.js:selection_decisions, src/lib/api.js:calls
- `selector_assignments` [LOW] used by `subsystem-0-0-src-lib` from `src/lib/api.js`. Evidence: src/lib/api.js:selector_assignments, src/lib/api.js:calls
- `selectors.map` [LOW] used by `subsystem-75-0-src-components` from `src/components/screens/JdcaManagementTab.jsx`. Evidence: src/components/screens/JdcaManagementTab.jsx:selectors.map, src/components/screens/JdcaManagementTab.jsx:calls
- `self.addEventListener` [LOW] used by `subsystem-38-0-src-sw-js` from `src/sw.js`. Evidence: src/sw.js:self.addEventListener, src/sw.js:calls, src/sw.js:calls
- `self.skipWaiting` [LOW] used by `subsystem-38-0-src-sw-js` from `src/sw.js`. Evidence: src/sw.js:self.skipWaiting, src/sw.js:calls
- `serve` [LOW] used by `subsystem-17-0-supabase` from `supabase/functions/send-push/index.ts`. Evidence: supabase/functions/send-push/index.ts:serve, supabase/functions/send-push/index.ts:calls
- `sessionStorage.getItem` [LOW] used by `subsystem-1-0-src-context` from `src/context/CricketContext.jsx`. Evidence: src/context/CricketContext.jsx:sessionStorage.getItem, src/context/CricketContext.jsx:calls
- `sessionStorage.removeItem` [LOW] used by `subsystem-1-0-src-context` from `src/context/CricketContext.jsx`. Evidence: src/context/CricketContext.jsx:sessionStorage.removeItem, src/context/CricketContext.jsx:calls
- `sessionStorage.setItem` [LOW] used by `subsystem-1-0-src-context` from `src/context/CricketContext.jsx`. Evidence: src/context/CricketContext.jsx:sessionStorage.setItem, src/context/CricketContext.jsx:calls
- `set.add` [LOW] used by `subsystem-16-0-src-components` from `src/components/selection/selectionData.js`. Evidence: src/components/selection/selectionData.js:set.add, src/components/selection/selectionData.js:calls
- `setActiveMatchId` [LOW] used by `subsystem-22-0-src-components` from `src/components/screens/HomeScreen.jsx`. Evidence: src/components/screens/HomeScreen.jsx:setActiveMatchId, src/components/screens/HomeScreen.jsx:calls, src/components/screens/HomeScreen.jsx:calls
- `setActiveMatchIdState` [LOW] used by `subsystem-1-0-src-context` from `src/context/CricketContext.jsx`. Evidence: src/context/CricketContext.jsx:setActiveMatchIdState, src/context/CricketContext.jsx:calls
- `setActiveRosterTeam` [LOW] used by `subsystem-9-0-src-components` from `src/components/screens/TeamsScreen.jsx`. Evidence: src/components/screens/TeamsScreen.jsx:setActiveRosterTeam, src/components/screens/TeamsScreen.jsx:calls, src/components/screens/TeamsScreen.jsx:calls
- `setActiveSeason` [LOW] used by `subsystem-0-0-src-lib` from `src/lib/api.js`. Evidence: src/lib/api.js:setActiveSeason, src/lib/api.js:calls
- `setActiveSelectionTeam` [LOW] used by `subsystem-89-0-src-components` from `src/components/screens/SelectionScreen.jsx`. Evidence: src/components/screens/SelectionScreen.jsx:setActiveSelectionTeam, src/components/screens/SelectionScreen.jsx:calls, src/components/screens/SelectionScreen.jsx:calls
- `setActiveTab` [LOW] used by `subsystem-22-0-src-components` from `src/components/screens/HomeScreen.jsx`. Evidence: src/components/screens/HomeScreen.jsx:setActiveTab, src/components/screens/HomeScreen.jsx:calls, src/components/screens/HomeScreen.jsx:calls
- `setActiveTeamId` [LOW] used by `subsystem-24-0-src-components` from `src/components/screens/TeamRegistrationTab.jsx`. Evidence: src/components/screens/TeamRegistrationTab.jsx:setActiveTeamId, src/components/screens/TeamRegistrationTab.jsx:calls, src/components/selection/SelectionWorkspace.jsx:calls
- `setActiveTeamTab` [LOW] used by `subsystem-3-0-src-components` from `src/components/screens/MatchSetupScreen.jsx`. Evidence: src/components/screens/MatchSetupScreen.jsx:setActiveTeamTab, src/components/screens/MatchSetupScreen.jsx:calls, src/components/screens/MatchSetupScreen.jsx:calls
- `setAge` [LOW] used by `subsystem-11-0-src-components` from `temp_extraction/src/components/screens/PlayerRegistrationScreen.jsx`. Evidence: temp_extraction/src/components/screens/PlayerRegistrationScreen.jsx:setAge, temp_extraction/src/components/screens/PlayerRegistrationScreen.jsx:calls
- `setAgeCategories` [LOW] used by `subsystem-106-0-src-components` from `src/components/screens/SeasonMigrationTab.jsx`. Evidence: src/components/screens/SeasonMigrationTab.jsx:setAgeCategories, src/components/screens/SeasonMigrationTab.jsx:calls, src/components/screens/TeamRegistrationTab.jsx:calls
- `setAnnouncements` [LOW] used by `subsystem-39-0-src-components` from `src/components/screens/NewsScreen.jsx`. Evidence: src/components/screens/NewsScreen.jsx:setAnnouncements, src/components/screens/NewsScreen.jsx:calls, src/context/CricketContext.jsx:calls
- `setAppError` [LOW] used by `subsystem-5-0-src-context` from `src/context/CricketContext.jsx`. Evidence: src/context/CricketContext.jsx:setAppError, src/context/CricketContext.jsx:calls, src/context/CricketContext.jsx:calls
- `setAssignments` [LOW] used by `subsystem-31-0-src-components` from `src/components/screens/SelectorAssignmentModal.jsx`. Evidence: src/components/screens/SelectorAssignmentModal.jsx:setAssignments, src/components/screens/SelectorAssignmentModal.jsx:calls, src/components/screens/SelectorAssignmentModal.jsx:calls
- `setAvatar` [LOW] used by `subsystem-11-0-src-components` from `src/components/screens/PlayerRegistrationScreen.jsx`. Evidence: src/components/screens/PlayerRegistrationScreen.jsx:setAvatar, src/components/screens/PlayerRegistrationScreen.jsx:calls, temp_extraction/src/components/screens/PlayerRegistrationScreen.jsx:calls
- `setBallHistory` [LOW] used by `subsystem-1-0-src-context` from `src/context/CricketContext.jsx`. Evidence: src/context/CricketContext.jsx:setBallHistory, src/context/CricketContext.jsx:calls, temp_extraction/src/context/CricketContext.jsx:calls
- `setBalls` [LOW] used by `subsystem-1-0-src-context` from `src/context/CricketContext.jsx`. Evidence: src/context/CricketContext.jsx:setBalls, src/context/CricketContext.jsx:calls, temp_extraction/src/context/CricketContext.jsx:calls
- `setBattingStyle` [LOW] used by `subsystem-11-0-src-components` from `src/components/screens/PlayerRegistrationScreen.jsx`. Evidence: src/components/screens/PlayerRegistrationScreen.jsx:setBattingStyle, src/components/screens/PlayerRegistrationScreen.jsx:calls, temp_extraction/src/components/screens/PlayerRegistrationScreen.jsx:calls
- `setBowlingStyle` [LOW] used by `subsystem-11-0-src-components` from `src/components/screens/PlayerRegistrationScreen.jsx`. Evidence: src/components/screens/PlayerRegistrationScreen.jsx:setBowlingStyle, src/components/screens/PlayerRegistrationScreen.jsx:calls, temp_extraction/src/components/screens/PlayerRegistrationScreen.jsx:calls
- `setCategory` [LOW] used by `subsystem-11-0-src-components` from `src/components/screens/PlayerRegistrationScreen.jsx`. Evidence: src/components/screens/PlayerRegistrationScreen.jsx:setCategory, src/components/screens/PlayerRegistrationScreen.jsx:calls, temp_extraction/src/components/screens/PlayerRegistrationScreen.jsx:calls
- `setCategoryFilter` [LOW] used by `subsystem-32-0-src-components` from `src/components/screens/PlayersScreen.jsx`. Evidence: src/components/screens/PlayersScreen.jsx:setCategoryFilter, src/components/screens/PlayersScreen.jsx:calls
- `setChangeWkOpen` [LOW] used by `subsystem-2-0-src-components` from `src/components/screens/ScoringScreen.jsx`. Evidence: src/components/screens/ScoringScreen.jsx:setChangeWkOpen, src/components/screens/ScoringScreen.jsx:calls, src/components/screens/ScoringScreen.jsx:calls
- `setCompareModalOpen` [LOW] used by `subsystem-76-0-src-components` from `src/components/screens/PlayerComparisonModal.jsx`. Evidence: src/components/screens/PlayerComparisonModal.jsx:setCompareModalOpen, src/components/screens/PlayerComparisonModal.jsx:calls, src/components/screens/PlayerComparisonModal.jsx:calls
- `setComparePlayer2` [LOW] used by `subsystem-76-0-src-components` from `src/components/screens/PlayerComparisonModal.jsx`. Evidence: src/components/screens/PlayerComparisonModal.jsx:setComparePlayer2, src/components/screens/PlayerComparisonModal.jsx:calls, temp_extraction/src/components/screens/PlayerComparisonModal.jsx:calls
- `setCopied` [LOW] used by `subsystem-58-0-src-components` from `src/components/ui/MatchMediaReport.jsx`. Evidence: src/components/ui/MatchMediaReport.jsx:setCopied, src/components/ui/MatchMediaReport.jsx:calls, temp_extraction/src/components/ui/MatchMediaReport.jsx:calls
- `setCreateError` [LOW] used by `subsystem-7-0-src-components` from `src/components/screens/AdministrationScreen.jsx`. Evidence: src/components/screens/AdministrationScreen.jsx:setCreateError, src/components/screens/AdministrationScreen.jsx:calls, src/components/screens/AdministrationScreen.jsx:calls
- `setCurrentBowler` [LOW] used by `subsystem-1-0-src-context` from `src/context/CricketContext.jsx`. Evidence: src/context/CricketContext.jsx:setCurrentBowler, src/context/CricketContext.jsx:calls, temp_extraction/src/context/CricketContext.jsx:calls
- `setCurrentInningsId` [LOW] used by `subsystem-5-0-src-context` from `src/context/CricketContext.jsx`. Evidence: src/context/CricketContext.jsx:setCurrentInningsId, src/context/CricketContext.jsx:calls, src/context/CricketContext.jsx:calls
- `setCurrentOverBalls` [LOW] used by `subsystem-1-0-src-context` from `src/context/CricketContext.jsx`. Evidence: src/context/CricketContext.jsx:setCurrentOverBalls, src/context/CricketContext.jsx:calls, temp_extraction/src/context/CricketContext.jsx:calls
- `setCurrentStep` [LOW] used by `subsystem-3-0-src-components` from `src/components/screens/MatchSetupScreen.jsx`. Evidence: src/components/screens/MatchSetupScreen.jsx:setCurrentStep, src/components/screens/MatchSetupScreen.jsx:calls, src/components/screens/MatchSetupScreen.jsx:calls
- `setCutoffDate` [LOW] used by `subsystem-8-0-src-components` from `src/components/screens/SeasonMigrationTab.jsx`. Evidence: src/components/screens/SeasonMigrationTab.jsx:setCutoffDate, src/components/screens/SeasonMigrationTab.jsx:calls
- `setDbDistricts` [LOW] used by `subsystem-24-0-src-components` from `src/components/screens/TeamRegistrationTab.jsx`. Evidence: src/components/screens/TeamRegistrationTab.jsx:setDbDistricts, src/components/screens/TeamRegistrationTab.jsx:calls, src/components/screens/TeamRegistrationTab.jsx:calls
- `setDeliveryLog` [LOW] used by `subsystem-1-0-src-context` from `src/context/CricketContext.jsx`. Evidence: src/context/CricketContext.jsx:setDeliveryLog, src/context/CricketContext.jsx:calls, src/context/CricketContext.jsx:calls
- `setDeliveryType` [LOW] used by `subsystem-12-0-src-components` from `src/components/ui/CloudinaryAvatar.jsx`. Evidence: src/components/ui/CloudinaryAvatar.jsx:setDeliveryType, src/components/ui/CloudinaryAvatar.jsx:calls, src/components/ui/CloudinaryAvatar.jsx:calls
- `setDismissalModalOpen` [LOW] used by `subsystem-1-0-src-context` from `src/context/CricketContext.jsx`. Evidence: src/context/CricketContext.jsx:setDismissalModalOpen, src/context/CricketContext.jsx:calls, temp_extraction/src/context/CricketContext.jsx:calls
- `setDismissalOpen` [LOW] used by `subsystem-2-0-src-components` from `src/components/screens/ScoringScreen.jsx`. Evidence: src/components/screens/ScoringScreen.jsx:setDismissalOpen, src/components/screens/ScoringScreen.jsx:calls, src/components/screens/ScoringScreen.jsx:calls
- `setDistrict` [LOW] used by `subsystem-11-0-src-components` from `src/components/screens/PlayerRegistrationScreen.jsx`. Evidence: src/components/screens/PlayerRegistrationScreen.jsx:setDistrict, src/components/screens/PlayerRegistrationScreen.jsx:calls, temp_extraction/src/components/screens/PlayerRegistrationScreen.jsx:calls
- `setDistrictFilter` [LOW] used by `subsystem-156-0-src-components` from `src/components/screens/HomeScreen.jsx`. Evidence: src/components/screens/HomeScreen.jsx:setDistrictFilter, src/components/screens/HomeScreen.jsx:calls, src/components/screens/HomeScreen.jsx:calls
- `setDistrictTeams` [LOW] used by `subsystem-24-0-src-components` from `src/components/screens/TeamRegistrationTab.jsx`. Evidence: src/components/screens/TeamRegistrationTab.jsx:setDistrictTeams, src/components/screens/TeamRegistrationTab.jsx:calls
- `setDob` [LOW] used by `subsystem-11-0-src-components` from `src/components/screens/PlayerRegistrationScreen.jsx`. Evidence: src/components/screens/PlayerRegistrationScreen.jsx:setDob, src/components/screens/PlayerRegistrationScreen.jsx:calls
- `setDrawerOpen` [LOW] used by `subsystem-29-0-src-components` from `src/components/BottomNav.jsx`. Evidence: src/components/BottomNav.jsx:setDrawerOpen, src/components/DrawerMenu.jsx:calls, src/components/DrawerMenu.jsx:calls
- `setEditingTournament` [LOW] used by `subsystem-15-0-src-components` from `src/components/screens/TournamentsScreen.jsx`. Evidence: src/components/screens/TournamentsScreen.jsx:setEditingTournament, src/components/screens/TournamentsScreen.jsx:calls, src/components/screens/TournamentsScreen.jsx:calls
- `setEmailInput` [LOW] used by `subsystem-74-0-src-components` from `src/components/screens/AuthScreen.jsx`. Evidence: src/components/screens/AuthScreen.jsx:setEmailInput, src/components/screens/AuthScreen.jsx:calls, temp_extraction/src/components/screens/AuthScreen.jsx:calls
- `setErrorMsg` [LOW] used by `subsystem-73-0-src-components` from `src/components/screens/AuthScreen.jsx`. Evidence: src/components/screens/AuthScreen.jsx:setErrorMsg, src/components/screens/AuthScreen.jsx:calls, src/components/screens/AuthScreen.jsx:calls
- `setExpandedMatchId` [LOW] used by `subsystem-15-0-src-components` from `src/components/screens/TournamentsScreen.jsx`. Evidence: src/components/screens/TournamentsScreen.jsx:setExpandedMatchId, src/components/screens/TournamentsScreen.jsx:calls, src/components/screens/TournamentsScreen.jsx:calls
- `setExpandedTournament` [LOW] used by `subsystem-15-0-src-components` from `src/components/screens/TournamentsScreen.jsx`. Evidence: src/components/screens/TournamentsScreen.jsx:setExpandedTournament, src/components/screens/TournamentsScreen.jsx:calls, src/components/screens/TournamentsScreen.jsx:calls
- `setExtras` [LOW] used by `subsystem-1-0-src-context` from `src/context/CricketContext.jsx`. Evidence: src/context/CricketContext.jsx:setExtras, src/context/CricketContext.jsx:calls, temp_extraction/src/context/CricketContext.jsx:calls
- `setExtrasOpen` [LOW] used by `subsystem-2-0-src-components` from `src/components/screens/ScoringScreen.jsx`. Evidence: src/components/screens/ScoringScreen.jsx:setExtrasOpen, src/components/screens/ScoringScreen.jsx:calls, temp_extraction/src/components/screens/ScoringScreen.jsx:calls
- `setFielder` [LOW] used by `subsystem-2-0-src-components` from `src/components/screens/ScoringScreen.jsx`. Evidence: src/components/screens/ScoringScreen.jsx:setFielder, src/components/screens/ScoringScreen.jsx:calls, temp_extraction/src/components/screens/ScoringScreen.jsx:calls
- `setFilters` [LOW] used by `subsystem-71-0-src-components` from `src/components/selection/SelectionFilters.jsx`. Evidence: src/components/selection/SelectionFilters.jsx:setFilters, src/components/selection/SelectionFilters.jsx:calls, src/components/selection/SelectionFilters.jsx:calls
- `setForm` [LOW] used by `subsystem-60-0-temp-extraction` from `temp_extraction/src/components/screens/TournamentsScreen.jsx`. Evidence: temp_extraction/src/components/screens/TournamentsScreen.jsx:setForm, temp_extraction/src/components/screens/TournamentsScreen.jsx:calls
- `setFormData` [LOW] used by `subsystem-63-0-src-components` from `src/components/ui/TeamManagerModal.jsx`. Evidence: src/components/ui/TeamManagerModal.jsx:setFormData, src/components/ui/TournamentManagerModal.jsx:calls, src/components/ui/TeamManagerModal.jsx:calls
- `setFormErrors` [LOW] used by `subsystem-65-0-src-components` from `src/components/screens/PlayerRegistrationScreen.jsx`. Evidence: src/components/screens/PlayerRegistrationScreen.jsx:setFormErrors, src/components/screens/PlayerRegistrationScreen.jsx:calls, src/components/screens/PlayerRegistrationScreen.jsx:calls
- `setFromSeason` [LOW] used by `subsystem-8-0-src-components` from `src/components/screens/SeasonMigrationTab.jsx`. Evidence: src/components/screens/SeasonMigrationTab.jsx:setFromSeason, src/components/screens/SeasonMigrationTab.jsx:calls
- `setGender` [LOW] used by `subsystem-164-0-src-components` from `src/components/screens/PlayerRegistrationScreen.jsx`. Evidence: src/components/screens/PlayerRegistrationScreen.jsx:setGender, src/components/screens/PlayerRegistrationScreen.jsx:calls, src/components/selection/CreateTeamModal.jsx:calls
- `setGenderTab` [LOW] used by `subsystem-32-0-src-components` from `src/components/screens/PlayersScreen.jsx`. Evidence: src/components/screens/PlayersScreen.jsx:setGenderTab, src/components/screens/PlayersScreen.jsx:calls, src/components/screens/PlayersScreen.jsx:calls
- `setHoveredIdx` [LOW] used by `subsystem-6-0-src-components` from `src/components/selection/PerformanceGraphs.jsx`. Evidence: src/components/selection/PerformanceGraphs.jsx:setHoveredIdx, src/components/selection/PerformanceGraphs.jsx:calls, src/components/selection/PerformanceGraphs.jsx:calls
- `setHydrationError` [LOW] used by `subsystem-2-0-src-components` from `src/components/screens/ScoringScreen.jsx`. Evidence: src/components/screens/ScoringScreen.jsx:setHydrationError, src/components/screens/ScoringScreen.jsx:calls, src/components/screens/ScoringScreen.jsx:calls
- `setInnings` [LOW] used by `subsystem-158-0-src-components` from `src/components/screens/InningsBreakScreen.jsx`. Evidence: src/components/screens/InningsBreakScreen.jsx:setInnings, src/components/screens/InningsBreakScreen.jsx:calls, temp_extraction/src/components/screens/InningsBreakScreen.jsx:calls
- `setInningsTab` [LOW] used by `subsystem-2-0-src-components` from `src/components/ui/MatchScorecard.jsx`. Evidence: src/components/ui/MatchScorecard.jsx:setInningsTab, src/components/ui/MatchScorecard.jsx:calls, src/components/ui/MatchScorecard.jsx:calls
- `setIsAddModalOpen` [LOW] used by `subsystem-39-0-src-components` from `src/components/screens/NewsScreen.jsx`. Evidence: src/components/screens/NewsScreen.jsx:setIsAddModalOpen, src/components/screens/NewsScreen.jsx:calls, src/components/screens/NewsScreen.jsx:calls
- `setIsAddPlayerModalOpen` [LOW] used by `subsystem-3-0-src-components` from `src/components/screens/MatchSetupScreen.jsx`. Evidence: src/components/screens/MatchSetupScreen.jsx:setIsAddPlayerModalOpen, src/components/screens/MatchSetupScreen.jsx:calls, src/components/screens/MatchSetupScreen.jsx:calls
- `setIsAppLoading` [LOW] used by `subsystem-5-0-src-context` from `src/context/CricketContext.jsx`. Evidence: src/context/CricketContext.jsx:setIsAppLoading, src/context/CricketContext.jsx:calls, src/context/CricketContext.jsx:calls
- `setIsAssigning` [LOW] used by `subsystem-61-0-src-components` from `src/components/screens/MatchDetailScreen.jsx`. Evidence: src/components/screens/MatchDetailScreen.jsx:setIsAssigning, src/components/screens/MatchDetailScreen.jsx:calls, src/components/screens/MatchDetailScreen.jsx:calls
- `setIsAuthenticated` [LOW] used by `subsystem-152-0-src-components` from `src/components/DrawerMenu.jsx`. Evidence: src/components/DrawerMenu.jsx:setIsAuthenticated, src/components/DrawerMenu.jsx:calls, src/components/Sidebar.jsx:calls
- `setIsCreating` [LOW] used by `subsystem-21-0-src-components` from `src/components/screens/TeamRegistrationTab.jsx`. Evidence: src/components/screens/TeamRegistrationTab.jsx:setIsCreating, src/components/screens/TeamRegistrationTab.jsx:calls, src/components/screens/TeamRegistrationTab.jsx:calls
- `setIsCreatingUser` [LOW] used by `subsystem-7-0-src-components` from `src/components/screens/AdministrationScreen.jsx`. Evidence: src/components/screens/AdministrationScreen.jsx:setIsCreatingUser, src/components/screens/AdministrationScreen.jsx:calls, src/components/screens/AdministrationScreen.jsx:calls
- `setIsDarkMode` [LOW] used by `subsystem-47-0-src-components` from `src/components/DrawerMenu.jsx`. Evidence: src/components/DrawerMenu.jsx:setIsDarkMode, src/components/DrawerMenu.jsx:calls
- `setIsDeleting` [LOW] used by `subsystem-61-0-src-components` from `src/components/screens/MatchDetailScreen.jsx`. Evidence: src/components/screens/MatchDetailScreen.jsx:setIsDeleting, src/components/screens/MatchDetailScreen.jsx:calls, src/components/screens/MatchDetailScreen.jsx:calls
- `setIsEditingXI` [LOW] used by `subsystem-3-0-src-components` from `src/components/screens/MatchSetupScreen.jsx`. Evidence: src/components/screens/MatchSetupScreen.jsx:setIsEditingXI, src/components/screens/MatchSetupScreen.jsx:calls, temp_extraction/src/components/screens/MatchSetupScreen.jsx:calls
- `setIsFreeHit` [LOW] used by `subsystem-1-0-src-context` from `src/context/CricketContext.jsx`. Evidence: src/context/CricketContext.jsx:setIsFreeHit, src/context/CricketContext.jsx:calls, temp_extraction/src/context/CricketContext.jsx:calls
- `setIsHydrating` [LOW] used by `subsystem-2-0-src-components` from `src/components/screens/ScoringScreen.jsx`. Evidence: src/components/screens/ScoringScreen.jsx:setIsHydrating, src/components/screens/ScoringScreen.jsx:calls, src/components/screens/ScoringScreen.jsx:calls
- `setIsLoading` [LOW] used by `subsystem-73-0-src-components` from `src/components/screens/AuthScreen.jsx`. Evidence: src/components/screens/AuthScreen.jsx:setIsLoading, src/components/screens/AuthScreen.jsx:calls, src/components/screens/AuthScreen.jsx:calls
- `setIsManagerOpen` [LOW] used by `subsystem-15-0-src-components` from `src/components/screens/TournamentsScreen.jsx`. Evidence: src/components/screens/TournamentsScreen.jsx:setIsManagerOpen, src/components/screens/TournamentsScreen.jsx:calls, src/components/screens/TournamentsScreen.jsx:calls
- `setIsMigrating` [LOW] used by `subsystem-8-0-src-components` from `src/components/screens/SeasonMigrationTab.jsx`. Evidence: src/components/screens/SeasonMigrationTab.jsx:setIsMigrating, src/components/screens/SeasonMigrationTab.jsx:calls, src/components/screens/SeasonMigrationTab.jsx:calls
- `setIsRebuildingTeams` [LOW] used by `subsystem-90-0-src-components` from `src/components/screens/TeamsScreen.jsx`. Evidence: src/components/screens/TeamsScreen.jsx:setIsRebuildingTeams, src/components/screens/TeamsScreen.jsx:calls, src/components/screens/TeamsScreen.jsx:calls
- `setIsResetting` [LOW] used by `subsystem-7-0-src-components` from `src/components/screens/AdministrationScreen.jsx`. Evidence: src/components/screens/AdministrationScreen.jsx:setIsResetting, src/components/screens/AdministrationScreen.jsx:calls, src/components/screens/AdministrationScreen.jsx:calls
- `setIsSaveModalOpen` [LOW] used by `subsystem-19-0-src-components` from `src/components/selection/SelectionWorkspace.jsx`. Evidence: src/components/selection/SelectionWorkspace.jsx:setIsSaveModalOpen, src/components/selection/SelectionWorkspace.jsx:calls, src/components/selection/SelectionWorkspace.jsx:calls
- `setIsSaving` [LOW] used by `subsystem-123-0-src-components` from `src/components/screens/MatchSetupScreen.jsx`. Evidence: src/components/screens/MatchSetupScreen.jsx:setIsSaving, src/components/screens/NewsScreen.jsx:calls, src/components/screens/NewsScreen.jsx:calls
- `setIsSubmitting` [LOW] used by `subsystem-34-0-src-components` from `src/components/screens/SeasonManagementTab.jsx`. Evidence: src/components/screens/SeasonManagementTab.jsx:setIsSubmitting, src/components/screens/SeasonManagementTab.jsx:calls, src/components/screens/SeasonManagementTab.jsx:calls
- `setIsSubscribed` [LOW] used by `subsystem-28-0-src-components` from `src/components/NotificationPrompt.jsx`. Evidence: src/components/NotificationPrompt.jsx:setIsSubscribed, src/components/NotificationPrompt.jsx:calls, src/components/NotificationPrompt.jsx:calls
- `setIsSupported` [LOW] used by `subsystem-28-0-src-components` from `src/components/NotificationPrompt.jsx`. Evidence: src/components/NotificationPrompt.jsx:setIsSupported, src/components/NotificationPrompt.jsx:calls
- `setIsTeamDrawerOpen` [LOW] used by `subsystem-19-0-src-components` from `src/components/selection/SelectionWorkspace.jsx`. Evidence: src/components/selection/SelectionWorkspace.jsx:setIsTeamDrawerOpen, src/components/selection/SelectionWorkspace.jsx:calls, src/components/selection/SelectionWorkspace.jsx:calls
- `setIsUploading` [LOW] used by `subsystem-11-0-src-components` from `src/components/screens/PlayerRegistrationScreen.jsx`. Evidence: src/components/screens/PlayerRegistrationScreen.jsx:setIsUploading, src/components/screens/PlayerRegistrationScreen.jsx:calls, src/components/screens/PlayerRegistrationScreen.jsx:calls
- `setIsVisible` [LOW] used by `subsystem-29-0-src-components` from `src/components/BottomNav.jsx`. Evidence: src/components/BottomNav.jsx:setIsVisible, src/components/BottomNav.jsx:calls, src/components/BottomNav.jsx:calls
- `setItems` [LOW] used by `subsystem-40-0-src-components` from `src/components/screens/RecycleBinTab.jsx`. Evidence: src/components/screens/RecycleBinTab.jsx:setItems, src/components/screens/RecycleBinTab.jsx:calls, src/components/screens/RecycleBinTab.jsx:calls
- `setLastOverBowlerId` [LOW] used by `subsystem-1-0-src-context` from `src/context/CricketContext.jsx`. Evidence: src/context/CricketContext.jsx:setLastOverBowlerId, src/context/CricketContext.jsx:calls, temp_extraction/src/context/CricketContext.jsx:calls
- `setLoading` [LOW] used by `subsystem-62-0-src-components` from `src/components/screens/MatchResultScreen.jsx`. Evidence: src/components/screens/MatchResultScreen.jsx:setLoading, src/components/screens/MatchResultScreen.jsx:calls, src/components/screens/MatchResultScreen.jsx:calls
- `setMatchData` [LOW] used by `subsystem-80-0-src-components` from `src/components/screens/MatchResultScreen.jsx`. Evidence: src/components/screens/MatchResultScreen.jsx:setMatchData, src/components/screens/MatchResultScreen.jsx:calls, src/components/screens/MatchResultScreen.jsx:calls
- `setMatchSetup` [LOW] used by `subsystem-3-0-src-components` from `src/components/screens/MatchSetupScreen.jsx`. Evidence: src/components/screens/MatchSetupScreen.jsx:setMatchSetup, src/components/screens/MatchSetupScreen.jsx:calls, src/components/screens/MatchSetupScreen.jsx:calls
- `setMatchStatus` [LOW] used by `subsystem-1-0-src-context` from `src/context/CricketContext.jsx`. Evidence: src/context/CricketContext.jsx:setMatchStatus, src/context/CricketContext.jsx:calls, src/context/CricketContext.jsx:calls
- `setMatches` [LOW] used by `subsystem-5-0-src-context` from `src/context/CricketContext.jsx`. Evidence: src/context/CricketContext.jsx:setMatches, src/context/CricketContext.jsx:calls, src/context/CricketContext.jsx:calls
- `setMigrationResult` [LOW] used by `subsystem-8-0-src-components` from `src/components/screens/SeasonMigrationTab.jsx`. Evidence: src/components/screens/SeasonMigrationTab.jsx:setMigrationResult, src/components/screens/SeasonMigrationTab.jsx:calls, src/components/screens/SeasonMigrationTab.jsx:calls
- `setName` [LOW] used by `subsystem-11-0-src-components` from `src/components/screens/PlayerRegistrationScreen.jsx`. Evidence: src/components/screens/PlayerRegistrationScreen.jsx:setName, src/components/screens/PlayerRegistrationScreen.jsx:calls, temp_extraction/src/components/screens/PlayerRegistrationScreen.jsx:calls
- `setNewBatterOpen` [LOW] used by `subsystem-2-0-src-components` from `src/components/screens/ScoringScreen.jsx`. Evidence: src/components/screens/ScoringScreen.jsx:setNewBatterOpen, src/components/screens/ScoringScreen.jsx:calls, temp_extraction/src/components/screens/ScoringScreen.jsx:calls
- `setNewEmail` [LOW] used by `subsystem-7-0-src-components` from `src/components/screens/AdministrationScreen.jsx`. Evidence: src/components/screens/AdministrationScreen.jsx:setNewEmail, src/components/screens/AdministrationScreen.jsx:calls, src/components/screens/AdministrationScreen.jsx:calls
- `setNewFullName` [LOW] used by `subsystem-7-0-src-components` from `src/components/screens/AdministrationScreen.jsx`. Evidence: src/components/screens/AdministrationScreen.jsx:setNewFullName, src/components/screens/AdministrationScreen.jsx:calls, src/components/screens/AdministrationScreen.jsx:calls
- `setNewNotice` [LOW] used by `subsystem-39-0-src-components` from `src/components/screens/NewsScreen.jsx`. Evidence: src/components/screens/NewsScreen.jsx:setNewNotice, src/components/screens/NewsScreen.jsx:calls, src/components/screens/NewsScreen.jsx:calls
- `setNewPassword` [LOW] used by `subsystem-7-0-src-components` from `src/components/screens/AdministrationScreen.jsx`. Evidence: src/components/screens/AdministrationScreen.jsx:setNewPassword, src/components/screens/AdministrationScreen.jsx:calls, src/components/screens/AdministrationScreen.jsx:calls
- `setNewRole` [LOW] used by `subsystem-7-0-src-components` from `src/components/screens/AdministrationScreen.jsx`. Evidence: src/components/screens/AdministrationScreen.jsx:setNewRole, src/components/screens/AdministrationScreen.jsx:calls, src/components/screens/AdministrationScreen.jsx:calls
- `setNewSeason` [LOW] used by `subsystem-34-0-src-components` from `src/components/screens/SeasonManagementTab.jsx`. Evidence: src/components/screens/SeasonManagementTab.jsx:setNewSeason, src/components/screens/SeasonManagementTab.jsx:calls, src/components/screens/SeasonManagementTab.jsx:calls
- `setNewTeamCategory` [LOW] used by `subsystem-24-0-src-components` from `src/components/screens/TeamRegistrationTab.jsx`. Evidence: src/components/screens/TeamRegistrationTab.jsx:setNewTeamCategory, src/components/screens/TeamRegistrationTab.jsx:calls, src/components/screens/TeamRegistrationTab.jsx:calls
- `setNewTeamDistrict` [LOW] used by `subsystem-24-0-src-components` from `src/components/screens/TeamRegistrationTab.jsx`. Evidence: src/components/screens/TeamRegistrationTab.jsx:setNewTeamDistrict, src/components/screens/TeamRegistrationTab.jsx:calls, src/components/screens/TeamRegistrationTab.jsx:calls
- `setNewTeamGender` [LOW] used by `subsystem-24-0-src-components` from `src/components/screens/TeamRegistrationTab.jsx`. Evidence: src/components/screens/TeamRegistrationTab.jsx:setNewTeamGender, src/components/screens/TeamRegistrationTab.jsx:calls
- `setNewTeamName` [LOW] used by `subsystem-21-0-src-components` from `src/components/screens/TeamRegistrationTab.jsx`. Evidence: src/components/screens/TeamRegistrationTab.jsx:setNewTeamName, src/components/screens/TeamRegistrationTab.jsx:calls, src/components/screens/TeamRegistrationTab.jsx:calls
- `setNewUser` [LOW] used by `subsystem-64-0-temp-extraction` from `temp_extraction/src/components/screens/AdministrationScreen.jsx`. Evidence: temp_extraction/src/components/screens/AdministrationScreen.jsx:setNewUser, temp_extraction/src/components/screens/AdministrationScreen.jsx:calls, temp_extraction/src/components/screens/AdministrationScreen.jsx:calls
- `setNonStriker` [LOW] used by `subsystem-1-0-src-context` from `src/context/CricketContext.jsx`. Evidence: src/context/CricketContext.jsx:setNonStriker, src/context/CricketContext.jsx:calls, temp_extraction/src/context/CricketContext.jsx:calls
- `setOpen` [LOW] used by `subsystem-3-0-src-components` from `src/components/screens/InningsInitScreen.jsx`. Evidence: src/components/screens/InningsInitScreen.jsx:setOpen, src/components/screens/InningsInitScreen.jsx:calls, src/components/screens/InningsInitScreen.jsx:calls
- `setOpenMobileAges` [LOW] used by `subsystem-26-0-temp-extraction` from `temp_extraction/src/components/screens/PlayersScreen.jsx`. Evidence: temp_extraction/src/components/screens/PlayersScreen.jsx:setOpenMobileAges, temp_extraction/src/components/screens/PlayersScreen.jsx:calls
- `setOpenMobileDistricts` [LOW] used by `subsystem-26-0-temp-extraction` from `temp_extraction/src/components/screens/PlayersScreen.jsx`. Evidence: temp_extraction/src/components/screens/PlayersScreen.jsx:setOpenMobileDistricts, temp_extraction/src/components/screens/PlayersScreen.jsx:calls
- `setOpenTournaments` [LOW] used by `subsystem-42-0-temp-extraction` from `temp_extraction/src/components/screens/MatchesScreen.jsx`. Evidence: temp_extraction/src/components/screens/MatchesScreen.jsx:setOpenTournaments, temp_extraction/src/components/screens/MatchesScreen.jsx:calls
- `setOverOpen` [LOW] used by `subsystem-2-0-src-components` from `src/components/screens/ScoringScreen.jsx`. Evidence: src/components/screens/ScoringScreen.jsx:setOverOpen, src/components/screens/ScoringScreen.jsx:calls, src/components/screens/ScoringScreen.jsx:calls
- `setPasswordInput` [LOW] used by `subsystem-74-0-src-components` from `src/components/screens/AuthScreen.jsx`. Evidence: src/components/screens/AuthScreen.jsx:setPasswordInput, src/components/screens/AuthScreen.jsx:calls
- `setPlayerDetails` [LOW] used by `subsystem-19-0-src-components` from `src/components/selection/SelectionWorkspace.jsx`. Evidence: src/components/selection/SelectionWorkspace.jsx:setPlayerDetails, src/components/selection/SelectionWorkspace.jsx:calls, src/components/selection/SelectionWorkspace.jsx:calls
- `setPlayers` [LOW] used by `subsystem-105-0-src-components` from `src/components/screens/PlayerProfileScreen.jsx`. Evidence: src/components/screens/PlayerProfileScreen.jsx:setPlayers, src/components/screens/PlayerProfileScreen.jsx:calls, src/components/screens/SeasonMigrationTab.jsx:calls
- `setPointsTable` [LOW] used by `subsystem-18-0-src-lib` from `src/lib/standings.js`. Evidence: src/lib/standings.js:setPointsTable, src/lib/standings.js:calls, src/lib/standings.js:calls
- `setPracticeStep` [LOW] used by `subsystem-2-0-src-components` from `temp_extraction/src/components/screens/ScoringScreen.jsx`. Evidence: temp_extraction/src/components/screens/ScoringScreen.jsx:setPracticeStep, temp_extraction/src/components/screens/ScoringScreen.jsx:calls
- `setPrintSuccessToast` [LOW] used by `subsystem-9-0-src-components` from `src/components/screens/TeamsScreen.jsx`. Evidence: src/components/screens/TeamsScreen.jsx:setPrintSuccessToast, src/components/screens/TeamsScreen.jsx:calls, src/components/screens/TeamsScreen.jsx:calls
- `setProcesses` [LOW] used by `subsystem-31-0-src-components` from `src/components/screens/SelectorAssignmentModal.jsx`. Evidence: src/components/screens/SelectorAssignmentModal.jsx:setProcesses, src/components/screens/SelectorAssignmentModal.jsx:calls
- `setProcessingId` [LOW] used by `subsystem-40-0-src-components` from `src/components/screens/RecycleBinTab.jsx`. Evidence: src/components/screens/RecycleBinTab.jsx:setProcessingId, src/components/screens/RecycleBinTab.jsx:calls, src/components/screens/RecycleBinTab.jsx:calls
- `setRegisteredSuccess` [LOW] used by `subsystem-65-0-src-components` from `src/components/screens/PlayerRegistrationScreen.jsx`. Evidence: src/components/screens/PlayerRegistrationScreen.jsx:setRegisteredSuccess, src/components/screens/PlayerRegistrationScreen.jsx:calls, temp_extraction/src/components/screens/PlayerRegistrationScreen.jsx:calls
- `setRegisteredUsers` [LOW] used by `subsystem-7-0-src-components` from `src/components/screens/AdministrationScreen.jsx`. Evidence: src/components/screens/AdministrationScreen.jsx:setRegisteredUsers, src/components/screens/AdministrationScreen.jsx:calls, src/components/screens/AdministrationScreen.jsx:calls
- `setReplacingBatterType` [LOW] used by `subsystem-2-0-src-components` from `src/components/screens/ScoringScreen.jsx`. Evidence: src/components/screens/ScoringScreen.jsx:setReplacingBatterType, src/components/screens/ScoringScreen.jsx:calls, src/components/screens/ScoringScreen.jsx:calls
- `setRepresentativeTeams` [LOW] used by `subsystem-92-0-src-context` from `src/context/CricketContext.jsx`. Evidence: src/context/CricketContext.jsx:setRepresentativeTeams, src/context/CricketContext.jsx:calls, src/context/CricketContext.jsx:calls
- `setResetError` [LOW] used by `subsystem-7-0-src-components` from `src/components/screens/AdministrationScreen.jsx`. Evidence: src/components/screens/AdministrationScreen.jsx:setResetError, src/components/screens/AdministrationScreen.jsx:calls, src/components/screens/AdministrationScreen.jsx:calls
- `setResetPassword` [LOW] used by `subsystem-7-0-src-components` from `src/components/screens/AdministrationScreen.jsx`. Evidence: src/components/screens/AdministrationScreen.jsx:setResetPassword, src/components/screens/AdministrationScreen.jsx:calls, src/components/screens/AdministrationScreen.jsx:calls
- `setResetSuccess` [LOW] used by `subsystem-7-0-src-components` from `src/components/screens/AdministrationScreen.jsx`. Evidence: src/components/screens/AdministrationScreen.jsx:setResetSuccess, src/components/screens/AdministrationScreen.jsx:calls, src/components/screens/AdministrationScreen.jsx:calls
- `setResetTargetUser` [LOW] used by `subsystem-7-0-src-components` from `src/components/screens/AdministrationScreen.jsx`. Evidence: src/components/screens/AdministrationScreen.jsx:setResetTargetUser, src/components/screens/AdministrationScreen.jsx:calls
- `setRetireModalOpen` [LOW] used by `subsystem-2-0-src-components` from `src/components/screens/ScoringScreen.jsx`. Evidence: src/components/screens/ScoringScreen.jsx:setRetireModalOpen, src/components/screens/ScoringScreen.jsx:calls, src/components/screens/ScoringScreen.jsx:calls
- `setRetireType` [LOW] used by `subsystem-2-0-src-components` from `src/components/screens/ScoringScreen.jsx`. Evidence: src/components/screens/ScoringScreen.jsx:setRetireType, src/components/screens/ScoringScreen.jsx:calls, src/components/screens/ScoringScreen.jsx:calls
- `setRetiringBatter` [LOW] used by `subsystem-2-0-src-components` from `src/components/screens/ScoringScreen.jsx`. Evidence: src/components/screens/ScoringScreen.jsx:setRetiringBatter, src/components/screens/ScoringScreen.jsx:calls, src/components/screens/ScoringScreen.jsx:calls
- `setRole` [LOW] used by `subsystem-11-0-src-components` from `src/components/screens/PlayerRegistrationScreen.jsx`. Evidence: src/components/screens/PlayerRegistrationScreen.jsx:setRole, src/components/screens/PlayerRegistrationScreen.jsx:calls, temp_extraction/src/components/screens/PlayerRegistrationScreen.jsx:calls
- `setRosterSearchQuery` [LOW] used by `subsystem-3-0-src-components` from `src/components/screens/MatchSetupScreen.jsx`. Evidence: src/components/screens/MatchSetupScreen.jsx:setRosterSearchQuery, src/components/screens/MatchSetupScreen.jsx:calls, temp_extraction/src/components/screens/MatchSetupScreen.jsx:calls
- `setRunOutPlayer` [LOW] used by `subsystem-2-0-src-components` from `src/components/screens/ScoringScreen.jsx`. Evidence: src/components/screens/ScoringScreen.jsx:setRunOutPlayer, src/components/screens/ScoringScreen.jsx:calls
- `setRuns` [LOW] used by `subsystem-1-0-src-context` from `src/context/CricketContext.jsx`. Evidence: src/context/CricketContext.jsx:setRuns, src/context/CricketContext.jsx:calls, temp_extraction/src/context/CricketContext.jsx:calls
- `setSaveError` [LOW] used by `subsystem-3-0-src-components` from `src/components/screens/MatchSetupScreen.jsx`. Evidence: src/components/screens/MatchSetupScreen.jsx:setSaveError, src/components/screens/MatchSetupScreen.jsx:calls, src/components/screens/MatchSetupScreen.jsx:calls
- `setScorecard` [LOW] used by `subsystem-1-0-src-context` from `src/context/CricketContext.jsx`. Evidence: src/context/CricketContext.jsx:setScorecard, src/context/CricketContext.jsx:calls, temp_extraction/src/context/CricketContext.jsx:calls
- `setScoringFirstRunDone` [LOW] used by `subsystem-1-0-src-context` from `src/context/CricketContext.jsx`. Evidence: src/context/CricketContext.jsx:setScoringFirstRunDone, src/context/CricketContext.jsx:calls, temp_extraction/src/context/CricketContext.jsx:calls
- `setSearch` [LOW] used by `subsystem-42-0-temp-extraction` from `temp_extraction/src/components/screens/MatchesScreen.jsx`. Evidence: temp_extraction/src/components/screens/MatchesScreen.jsx:setSearch, temp_extraction/src/components/screens/MatchesScreen.jsx:calls, temp_extraction/src/components/screens/TournamentsScreen.jsx:calls
- `setSearchQuery` [LOW] used by `subsystem-104-0-src-components` from `src/components/screens/MatchSetupScreen.jsx`. Evidence: src/components/screens/MatchSetupScreen.jsx:setSearchQuery, src/components/screens/MatchSetupScreen.jsx:calls, src/components/screens/MatchSetupScreen.jsx:calls
- `setSeason` [LOW] used by `subsystem-57-0-src-components` from `src/components/selection/CreateTeamModal.jsx`. Evidence: src/components/selection/CreateTeamModal.jsx:setSeason, src/components/selection/CreateTeamModal.jsx:calls
- `setSeasons` [LOW] used by `subsystem-34-0-src-components` from `src/components/screens/SeasonManagementTab.jsx`. Evidence: src/components/screens/SeasonManagementTab.jsx:setSeasons, src/components/screens/SeasonManagementTab.jsx:calls, src/components/ui/TeamManagerModal.jsx:calls
- `setSelectedAgeCategory` [LOW] used by `subsystem-33-0-src-components` from `src/components/screens/ScoutingHubScreen.jsx`. Evidence: src/components/screens/ScoutingHubScreen.jsx:setSelectedAgeCategory, src/components/screens/ScoutingHubScreen.jsx:calls, temp_extraction/src/components/screens/ScoutingHubScreen.jsx:calls
- `setSelectedCategory` [LOW] used by `subsystem-77-0-src-components` from `src/components/screens/SelectorsScreen.jsx`. Evidence: src/components/screens/SelectorsScreen.jsx:setSelectedCategory, src/components/screens/SelectorsScreen.jsx:calls, src/components/selection/CreateTeamModal.jsx:calls
- `setSelectedDismissal` [LOW] used by `subsystem-2-0-src-components` from `src/components/screens/ScoringScreen.jsx`. Evidence: src/components/screens/ScoringScreen.jsx:setSelectedDismissal, src/components/screens/ScoringScreen.jsx:calls, temp_extraction/src/components/screens/ScoringScreen.jsx:calls
- `setSelectedDistrict` [LOW] used by `subsystem-33-0-src-components` from `src/components/screens/ScoutingHubScreen.jsx`. Evidence: src/components/screens/ScoutingHubScreen.jsx:setSelectedDistrict, src/components/screens/ScoutingHubScreen.jsx:calls, src/components/screens/ScoutingHubScreen.jsx:calls
- `setSelectedGender` [LOW] used by `subsystem-9-0-src-components` from `src/components/screens/TeamsScreen.jsx`. Evidence: src/components/screens/TeamsScreen.jsx:setSelectedGender, src/components/screens/TeamsScreen.jsx:calls
- `setSelectedIds` [LOW] used by `subsystem-8-0-src-components` from `src/components/screens/SeasonMigrationTab.jsx`. Evidence: src/components/screens/SeasonMigrationTab.jsx:setSelectedIds, src/components/screens/SeasonMigrationTab.jsx:calls, src/components/screens/SeasonMigrationTab.jsx:calls
- `setSelectedMotm` [LOW] used by `subsystem-80-0-src-components` from `src/components/screens/MatchResultScreen.jsx`. Evidence: src/components/screens/MatchResultScreen.jsx:setSelectedMotm, src/components/screens/MatchResultScreen.jsx:calls, src/components/screens/MatchResultScreen.jsx:calls
- `setSelectedPlayer` [LOW] used by `subsystem-165-0-src-components` from `src/components/screens/PlayersScreen.jsx`. Evidence: src/components/screens/PlayersScreen.jsx:setSelectedPlayer, src/components/screens/PlayersScreen.jsx:calls, src/components/screens/ScoutingHubScreen.jsx:calls
- `setSelectedRole` [LOW] used by `subsystem-30-0-src-components` from `src/components/screens/SelectionScreen.jsx`. Evidence: src/components/screens/SelectionScreen.jsx:setSelectedRole, src/components/screens/SelectionScreen.jsx:calls, temp_extraction/src/components/screens/AuthScreen.jsx:calls
- `setSelectedRoleFilter` [LOW] used by `subsystem-33-0-src-components` from `src/components/screens/ScoutingHubScreen.jsx`. Evidence: src/components/screens/ScoutingHubScreen.jsx:setSelectedRoleFilter, src/components/screens/ScoutingHubScreen.jsx:calls, src/components/screens/ScoutingHubScreen.jsx:calls
- `setSelectedScorer` [LOW] used by `subsystem-69-0-src-components` from `src/components/screens/MatchDetailScreen.jsx`. Evidence: src/components/screens/MatchDetailScreen.jsx:setSelectedScorer, src/components/screens/MatchDetailScreen.jsx:calls
- `setSelectedTournament` [LOW] used by `subsystem-2-0-src-components` from `src/components/screens/ScoringScreen.jsx`. Evidence: src/components/screens/ScoringScreen.jsx:setSelectedTournament, src/components/screens/ScoringScreen.jsx:calls
- `setSelectedTournamentTab` [LOW] used by `subsystem-22-0-src-components` from `src/components/screens/HomeScreen.jsx`. Evidence: src/components/screens/HomeScreen.jsx:setSelectedTournamentTab, src/components/screens/HomeScreen.jsx:calls, src/components/screens/HomeScreen.jsx:calls
- `setSelectorUserToAssign` [LOW] used by `subsystem-7-0-src-components` from `src/components/screens/AdministrationScreen.jsx`. Evidence: src/components/screens/AdministrationScreen.jsx:setSelectorUserToAssign, src/components/screens/AdministrationScreen.jsx:calls, src/components/screens/AdministrationScreen.jsx:calls
- `setShortlistedIds` [LOW] used by `subsystem-1-0-src-context` from `src/context/CricketContext.jsx`. Evidence: src/context/CricketContext.jsx:setShortlistedIds, src/context/CricketContext.jsx:calls, src/context/CricketContext.jsx:calls
- `setShowAddUserModal` [LOW] used by `subsystem-7-0-src-components` from `src/components/screens/AdministrationScreen.jsx`. Evidence: src/components/screens/AdministrationScreen.jsx:setShowAddUserModal, src/components/screens/AdministrationScreen.jsx:calls, src/components/screens/AdministrationScreen.jsx:calls
- `setShowCreateModal` [LOW] used by `subsystem-34-0-src-components` from `src/components/screens/SeasonManagementTab.jsx`. Evidence: src/components/screens/SeasonManagementTab.jsx:setShowCreateModal, src/components/screens/SeasonManagementTab.jsx:calls, src/components/screens/SeasonManagementTab.jsx:calls
- `setShowFilters` [LOW] used by `subsystem-32-0-src-components` from `src/components/screens/PlayersScreen.jsx`. Evidence: src/components/screens/PlayersScreen.jsx:setShowFilters, src/components/screens/PlayersScreen.jsx:calls
- `setShowHelp` [LOW] used by `subsystem-2-0-src-components` from `src/components/screens/ScoringScreen.jsx`. Evidence: src/components/screens/ScoringScreen.jsx:setShowHelp, src/components/screens/ScoringScreen.jsx:calls, temp_extraction/src/components/screens/ScoringScreen.jsx:calls
- `setShowOnlyShortlisted` [LOW] used by `subsystem-33-0-src-components` from `src/components/screens/ScoutingHubScreen.jsx`. Evidence: src/components/screens/ScoutingHubScreen.jsx:setShowOnlyShortlisted, src/components/screens/ScoutingHubScreen.jsx:calls, src/components/screens/ScoutingHubScreen.jsx:calls
- `setShowOverviewStats` [LOW] used by `subsystem-9-0-src-components` from `src/components/screens/TeamsScreen.jsx`. Evidence: src/components/screens/TeamsScreen.jsx:setShowOverviewStats, src/components/screens/TeamsScreen.jsx:calls
- `setShowPrompt` [LOW] used by `subsystem-28-0-src-components` from `src/components/NotificationPrompt.jsx`. Evidence: src/components/NotificationPrompt.jsx:setShowPrompt, src/components/NotificationPrompt.jsx:calls, src/components/NotificationPrompt.jsx:calls
- `setShowResetPasswordModal` [LOW] used by `subsystem-7-0-src-components` from `src/components/screens/AdministrationScreen.jsx`. Evidence: src/components/screens/AdministrationScreen.jsx:setShowResetPasswordModal, src/components/screens/AdministrationScreen.jsx:calls, src/components/screens/AdministrationScreen.jsx:calls
- `setShowSavedNotification` [LOW] used by `subsystem-19-0-src-components` from `src/components/selection/SelectionWorkspace.jsx`. Evidence: src/components/selection/SelectionWorkspace.jsx:setShowSavedNotification, src/components/selection/SelectionWorkspace.jsx:calls, src/components/selection/SelectionWorkspace.jsx:calls
- `setShowSavedToast` [LOW] used by `subsystem-89-0-src-components` from `src/components/screens/SelectionScreen.jsx`. Evidence: src/components/screens/SelectionScreen.jsx:setShowSavedToast, src/components/screens/SelectionScreen.jsx:calls, src/components/screens/SelectionScreen.jsx:calls
- `setSortBy` [LOW] used by `subsystem-19-0-src-components` from `src/components/selection/SelectionWorkspace.jsx`. Evidence: src/components/selection/SelectionWorkspace.jsx:setSortBy, src/components/selection/SelectionWorkspace.jsx:calls
- `setSortDir` [LOW] used by `subsystem-36-0-src-components` from `src/components/ui/DataTable.jsx`. Evidence: src/components/ui/DataTable.jsx:setSortDir, src/components/ui/DataTable.jsx:calls, src/components/ui/DataTable.jsx:calls
- `setSortKey` [LOW] used by `subsystem-36-0-src-components` from `src/components/ui/DataTable.jsx`. Evidence: src/components/ui/DataTable.jsx:setSortKey, src/components/ui/DataTable.jsx:calls, src/components/ui/DataTable.jsx:calls
- `setStep` [LOW] used by `subsystem-45-0-src-components` from `src/components/ui/TournamentManagerModal.jsx`. Evidence: src/components/ui/TournamentManagerModal.jsx:setStep, src/components/ui/TournamentManagerModal.jsx:calls, src/components/ui/TournamentManagerModal.jsx:calls
- `setStriker` [LOW] used by `subsystem-1-0-src-context` from `src/context/CricketContext.jsx`. Evidence: src/context/CricketContext.jsx:setStriker, src/context/CricketContext.jsx:calls, temp_extraction/src/context/CricketContext.jsx:calls
- `setSyncState` [LOW] used by `subsystem-2-0-src-components` from `src/components/screens/ScoringScreen.jsx`. Evidence: src/components/screens/ScoringScreen.jsx:setSyncState, src/components/screens/ScoringScreen.jsx:calls
- `setSystemSettings` [LOW] used by `subsystem-7-0-src-components` from `src/components/screens/AdministrationScreen.jsx`. Evidence: src/components/screens/AdministrationScreen.jsx:setSystemSettings, src/components/screens/AdministrationScreen.jsx:calls
- `setTab` [LOW] used by `subsystem-60-0-temp-extraction` from `temp_extraction/src/components/screens/TournamentsScreen.jsx`. Evidence: temp_extraction/src/components/screens/TournamentsScreen.jsx:setTab, temp_extraction/src/components/screens/TournamentsScreen.jsx:calls, temp_extraction/src/components/screens/TournamentsScreen.jsx:calls
- `setTarget` [LOW] used by `subsystem-5-0-src-context` from `src/context/CricketContext.jsx`. Evidence: src/context/CricketContext.jsx:setTarget, src/context/CricketContext.jsx:calls, src/context/CricketContext.jsx:calls
- `setTeamPlayers` [LOW] used by `subsystem-21-0-src-components` from `src/components/screens/TeamRegistrationTab.jsx`. Evidence: src/components/screens/TeamRegistrationTab.jsx:setTeamPlayers, src/components/screens/TeamRegistrationTab.jsx:calls, src/components/screens/TeamRegistrationTab.jsx:calls
- `setTeamSize` [LOW] used by `subsystem-57-0-src-components` from `src/components/selection/CreateTeamModal.jsx`. Evidence: src/components/selection/CreateTeamModal.jsx:setTeamSize, src/components/selection/CreateTeamModal.jsx:calls, src/components/selection/CreateTeamModal.jsx:calls
- `setTeams` [LOW] used by `subsystem-21-0-src-components` from `src/components/screens/TeamRegistrationTab.jsx`. Evidence: src/components/screens/TeamRegistrationTab.jsx:setTeams, src/components/screens/TeamRegistrationTab.jsx:calls, src/components/selection/SelectionWorkspace.jsx:calls
- `setTimeout` [LOW] used by `subsystem-102-0-src-components` from `src/components/NotificationPrompt.jsx`. Evidence: src/components/NotificationPrompt.jsx:setTimeout, src/context/CricketContext.jsx:calls, temp_extraction/src/context/CricketContext.jsx:calls
- `setToSeason` [LOW] used by `subsystem-8-0-src-components` from `src/components/screens/SeasonMigrationTab.jsx`. Evidence: src/components/screens/SeasonMigrationTab.jsx:setToSeason, src/components/screens/SeasonMigrationTab.jsx:calls
- `setTournaments` [LOW] used by `subsystem-5-0-src-context` from `src/context/CricketContext.jsx`. Evidence: src/context/CricketContext.jsx:setTournaments, src/context/CricketContext.jsx:calls, src/context/CricketContext.jsx:calls
- `setUserEmail` [LOW] used by `subsystem-5-0-src-context` from `src/context/CricketContext.jsx`. Evidence: src/context/CricketContext.jsx:setUserEmail, src/context/CricketContext.jsx:calls, src/context/CricketContext.jsx:calls
- `setUserId` [LOW] used by `subsystem-5-0-src-context` from `src/context/CricketContext.jsx`. Evidence: src/context/CricketContext.jsx:setUserId, src/context/CricketContext.jsx:calls, src/context/CricketContext.jsx:calls
- `setUserName` [LOW] used by `subsystem-5-0-src-context` from `src/context/CricketContext.jsx`. Evidence: src/context/CricketContext.jsx:setUserName, src/context/CricketContext.jsx:calls, src/context/CricketContext.jsx:calls
- `setUserPermissions` [LOW] used by `subsystem-5-0-src-context` from `src/context/CricketContext.jsx`. Evidence: src/context/CricketContext.jsx:setUserPermissions, src/context/CricketContext.jsx:calls, src/context/CricketContext.jsx:calls
- `setUserRole` [LOW] used by `subsystem-5-0-src-context` from `src/context/CricketContext.jsx`. Evidence: src/context/CricketContext.jsx:setUserRole, src/context/CricketContext.jsx:calls, src/context/CricketContext.jsx:calls
- `setValidationError` [LOW] used by `subsystem-168-0-src-components` from `src/components/screens/ScoringScreen.jsx`. Evidence: src/components/screens/ScoringScreen.jsx:setValidationError, src/components/screens/ScoringScreen.jsx:calls, src/context/CricketContext.jsx:calls
- `setViewMode` [LOW] used by `subsystem-26-0-temp-extraction` from `temp_extraction/src/components/screens/PlayersScreen.jsx`. Evidence: temp_extraction/src/components/screens/PlayersScreen.jsx:setViewMode, temp_extraction/src/components/screens/PlayersScreen.jsx:calls, temp_extraction/src/components/screens/PlayersScreen.jsx:calls
- `setViewScope` [LOW] used by `subsystem-9-0-src-components` from `src/components/screens/TeamsScreen.jsx`. Evidence: src/components/screens/TeamsScreen.jsx:setViewScope, src/components/screens/TeamsScreen.jsx:calls, src/components/screens/TeamsScreen.jsx:calls
- `setWickets` [LOW] used by `subsystem-1-0-src-context` from `src/context/CricketContext.jsx`. Evidence: src/context/CricketContext.jsx:setWickets, src/context/CricketContext.jsx:calls, temp_extraction/src/context/CricketContext.jsx:calls
- `shortlistedIds.includes` [LOW] used by `subsystem-33-0-src-components` from `src/components/screens/ScoutingHubScreen.jsx`. Evidence: src/components/screens/ScoutingHubScreen.jsx:shortlistedIds.includes, src/components/screens/ScoutingHubScreen.jsx:calls, src/components/screens/ScoutingHubScreen.jsx:calls
- `shortlistedPlayerIds.includes` [LOW] used by `subsystem-44-0-src-components` from `src/components/selection/PlayerPool.jsx`. Evidence: src/components/selection/PlayerPool.jsx:shortlistedPlayerIds.includes, src/components/selection/PlayerPool.jsx:calls
- `slice` [LOW] used by `subsystem-6-0-src-components` from `src/components/CricketIcons.jsx`. Evidence: src/components/CricketIcons.jsx:slice, src/components/CricketIcons.jsx:calls, src/components/screens/TeamsScreen.jsx:calls
- `some` [LOW] used by `subsystem-55-0-src-components` from `src/components/selection/FilterTiles.jsx`. Evidence: src/components/selection/FilterTiles.jsx:some, src/components/selection/FilterTiles.jsx:calls
- `sortedBatters.sort` [LOW] used by `subsystem-49-0-src-engine` from `src/engine/matchHighlights.js`. Evidence: src/engine/matchHighlights.js:sortedBatters.sort, src/engine/matchHighlights.js:calls, src/engine/matchHighlights.js:calls
- `sortedData.map` [LOW] used by `subsystem-36-0-src-components` from `src/components/ui/DataTable.jsx`. Evidence: src/components/ui/DataTable.jsx:sortedData.map, src/components/ui/DataTable.jsx:calls, temp_extraction/src/components/ui/DataTable.jsx:calls
- `sources` [LOW] used by `subsystem-12-0-src-components` from `src/components/ui/CloudinaryAvatar.jsx`. Evidence: src/components/ui/CloudinaryAvatar.jsx:sources, src/components/ui/CloudinaryAvatar.jsx:calls
- `split` [LOW] used by `subsystem-15-0-src-components` from `src/components/screens/TournamentsScreen.jsx`. Evidence: src/components/screens/TournamentsScreen.jsx:split, src/components/screens/TournamentsScreen.jsx:calls
- `sql.split` [LOW] used by `subsystem-27-0-apply-bug5-sql-js` from `apply-bug5-sql.js`. Evidence: apply-bug5-sql.js:sql.split, apply-bug5-sql.js:calls
- `squad.find` [LOW] used by `subsystem-9-0-src-components` from `src/components/screens/TeamsScreen.jsx`. Evidence: src/components/screens/TeamsScreen.jsx:squad.find, src/components/screens/TeamsScreen.jsx:calls
- `squad.forEach` [LOW] used by `subsystem-9-0-src-components` from `src/components/screens/TeamsScreen.jsx`. Evidence: src/components/screens/TeamsScreen.jsx:squad.forEach, src/components/screens/TeamsScreen.jsx:calls
- `squad.map` [LOW] used by `subsystem-9-0-src-components` from `src/components/screens/TeamsScreen.jsx`. Evidence: src/components/screens/TeamsScreen.jsx:squad.map, src/components/screens/TeamsScreen.jsx:calls
- `squad.slice` [LOW] used by `subsystem-9-0-src-components` from `src/components/screens/TeamsScreen.jsx`. Evidence: src/components/screens/TeamsScreen.jsx:squad.slice, src/components/screens/TeamsScreen.jsx:calls
- `squad.some` [LOW] used by `subsystem-107-0-src-components` from `src/components/screens/SeasonMigrationTab.jsx`. Evidence: src/components/screens/SeasonMigrationTab.jsx:squad.some, src/components/screens/TeamsScreen.jsx:calls, src/components/screens/SeasonMigrationTab.jsx:calls
- `squadWarnings.map` [LOW] used by `subsystem-30-0-src-components` from `src/components/screens/SelectionScreen.jsx`. Evidence: src/components/screens/SelectionScreen.jsx:squadWarnings.map, src/components/screens/SelectionScreen.jsx:calls
- `squadWarnings.push` [LOW] used by `subsystem-30-0-src-components` from `src/components/screens/SelectionScreen.jsx`. Evidence: src/components/screens/SelectionScreen.jsx:squadWarnings.push, src/components/screens/SelectionScreen.jsx:calls, src/components/screens/SelectionScreen.jsx:calls
- `src.includes` [LOW] used by `subsystem-12-0-src-components` from `src/components/ui/CloudinaryAvatar.jsx`. Evidence: src/components/ui/CloudinaryAvatar.jsx:src.includes, src/components/ui/CloudinaryAvatar.jsx:calls
- `src.split` [LOW] used by `subsystem-12-0-src-components` from `src/components/ui/CloudinaryAvatar.jsx`. Evidence: src/components/ui/CloudinaryAvatar.jsx:src.split, src/components/ui/CloudinaryAvatar.jsx:calls
- `src.startsWith` [LOW] used by `subsystem-12-0-src-components` from `src/components/ui/CloudinaryAvatar.jsx`. Evidence: src/components/ui/CloudinaryAvatar.jsx:src.startsWith, src/components/ui/CloudinaryAvatar.jsx:calls
- `standings.get` [LOW] used by `subsystem-18-0-src-lib` from `src/lib/standings.js`. Evidence: src/lib/standings.js:standings.get, src/lib/standings.js:calls, src/lib/standings.js:calls
- `standings.has` [LOW] used by `subsystem-18-0-src-lib` from `src/lib/standings.js`. Evidence: src/lib/standings.js:standings.has, src/lib/standings.js:calls, src/lib/standings.js:calls
- `standings.set` [LOW] used by `subsystem-18-0-src-lib` from `src/lib/standings.js`. Evidence: src/lib/standings.js:standings.set, src/lib/standings.js:calls, src/lib/standings.js:calls
- `standings.values` [LOW] used by `subsystem-18-0-src-lib` from `src/lib/standings.js`. Evidence: src/lib/standings.js:standings.values, src/lib/standings.js:calls
- `startInnings` [LOW] used by `subsystem-3-0-src-components` from `src/components/screens/InningsInitScreen.jsx`. Evidence: src/components/screens/InningsInitScreen.jsx:startInnings, src/components/screens/InningsInitScreen.jsx:calls, src/components/screens/MatchSetupScreen.jsx:calls
- `startSecondInnings` [LOW] used by `subsystem-2-0-src-components` from `src/components/screens/ScoringScreen.jsx`. Evidence: src/components/screens/ScoringScreen.jsx:startSecondInnings, src/components/screens/ScoringScreen.jsx:calls
- `startsWith` [LOW] used by `subsystem-14-0-src-services` from `src/services/SyncService.js`. Evidence: src/services/SyncService.js:startsWith, src/services/SyncService.js:calls, src/services/SyncService.js:calls
- `stats.map` [LOW] used by `subsystem-9-0-src-components` from `src/components/ui/StatCard.jsx`. Evidence: src/components/ui/StatCard.jsx:stats.map, src/components/ui/StatCard.jsx:calls, temp_extraction/src/components/ui/StatCard.jsx:calls
- `status.replace` [LOW] used by `subsystem-6-0-src-components` from `src/components/selection/CampaignOverview.jsx`. Evidence: src/components/selection/CampaignOverview.jsx:status.replace, src/components/selection/CampaignOverview.jsx:calls
- `steps.map` [LOW] used by `subsystem-3-0-src-components` from `src/components/screens/MatchSetupScreen.jsx`. Evidence: src/components/screens/MatchSetupScreen.jsx:steps.map, src/components/screens/MatchSetupScreen.jsx:calls, temp_extraction/src/components/screens/MatchSetupScreen.jsx:calls
- `stores` [LOW] used by `subsystem-41-0-src-lib` from `src/lib/db.js`. Evidence: src/lib/db.js:stores, src/lib/db.js:calls, src/lib/db.js:calls
- `striker_id` [LOW] used by `subsystem-0-0-src-lib` from `src/lib/api.js`. Evidence: src/lib/api.js:striker_id, src/lib/api.js:calls, src/lib/api.js:calls
- `string` [LOW] used by `subsystem-13-0-src-engine` from `src/engine/validationSchemas.js`. Evidence: src/engine/validationSchemas.js:string, src/engine/validationSchemas.js:calls, temp_extraction/src/engine/validationSchemas.js:calls
- `subscribe` [LOW] used by `subsystem-66-0-src-components` from `src/components/screens/ScoringScreen.jsx`. Evidence: src/components/screens/ScoringScreen.jsx:subscribe, src/components/screens/ScoringScreen.jsx:calls, src/context/CricketContext.jsx:calls
- `subscription.toJSON` [LOW] used by `subsystem-28-0-src-components` from `src/components/NotificationPrompt.jsx`. Evidence: src/components/NotificationPrompt.jsx:subscription.toJSON, src/components/NotificationPrompt.jsx:calls
- `subscriptions.map` [LOW] used by `subsystem-17-0-supabase` from `supabase/functions/send-push/index.ts`. Evidence: supabase/functions/send-push/index.ts:subscriptions.map, supabase/functions/send-push/index.ts:calls
- `supabase.channel` [LOW] used by `subsystem-66-0-src-components` from `src/components/screens/ScoringScreen.jsx`. Evidence: src/components/screens/ScoringScreen.jsx:supabase.channel, src/components/screens/ScoringScreen.jsx:calls, src/context/CricketContext.jsx:calls
- `supabase.removeChannel` [LOW] used by `subsystem-2-0-src-components` from `src/components/screens/ScoringScreen.jsx`. Evidence: src/components/screens/ScoringScreen.jsx:supabase.removeChannel, src/components/screens/ScoringScreen.jsx:calls, src/context/CricketContext.jsx:calls
- `supabase.rpc` [LOW] used by `subsystem-27-0-apply-bug5-sql-js` from `apply-bug5-sql.js`. Evidence: apply-bug5-sql.js:supabase.rpc, apply-bug5-sql.js:calls, scratch_check_enum.js:calls
- `supabaseAdmin.from` [LOW] used by `subsystem-17-0-supabase` from `supabase/functions/send-push/index.ts`. Evidence: supabase/functions/send-push/index.ts:supabaseAdmin.from, supabase/functions/send-push/index.ts:calls
- `supabaseKeys.has` [LOW] used by `subsystem-1-0-src-context` from `src/context/CricketContext.jsx`. Evidence: src/context/CricketContext.jsx:supabaseKeys.has, src/context/CricketContext.jsx:calls
- `superRefine` [LOW] used by `subsystem-13-0-src-engine` from `src/engine/validationSchemas.js`. Evidence: src/engine/validationSchemas.js:superRefine, src/engine/validationSchemas.js:calls, temp_extraction/src/engine/validationSchemas.js:calls
- `syncService.executeOrQueue` [LOW] used by `subsystem-1-0-src-context` from `src/context/CricketContext.jsx`. Evidence: src/context/CricketContext.jsx:syncService.executeOrQueue, src/context/CricketContext.jsx:calls, src/context/CricketContext.jsx:calls
- `syncService.subscribe` [LOW] used by `subsystem-2-0-src-components` from `src/components/screens/ScoringScreen.jsx`. Evidence: src/components/screens/ScoringScreen.jsx:syncService.subscribe, src/components/screens/ScoringScreen.jsx:calls
- `sync_queue.add` [LOW] used by `subsystem-41-0-src-lib` from `src/lib/db.js`. Evidence: src/lib/db.js:sync_queue.add, src/lib/db.js:calls
- `sync_queue.delete` [LOW] used by `subsystem-41-0-src-lib` from `src/lib/db.js`. Evidence: src/lib/db.js:sync_queue.delete, src/lib/db.js:calls
- `sync_queue.orderBy` [LOW] used by `subsystem-41-0-src-lib` from `src/lib/db.js`. Evidence: src/lib/db.js:sync_queue.orderBy, src/lib/db.js:calls
- `sync_queue.toArray` [LOW] used by `subsystem-1-0-src-context` from `src/context/CricketContext.jsx`. Evidence: src/context/CricketContext.jsx:sync_queue.toArray, src/context/CricketContext.jsx:calls
- `tA.slice` [LOW] used by `subsystem-18-0-src-lib` from `src/lib/standings.js`. Evidence: src/lib/standings.js:tA.slice, src/lib/standings.js:calls
- `tB.slice` [LOW] used by `subsystem-18-0-src-lib` from `src/lib/standings.js`. Evidence: src/lib/standings.js:tB.slice, src/lib/standings.js:calls
- `tabs.map` [LOW] used by `subsystem-29-0-src-components` from `src/components/BottomNav.jsx`. Evidence: src/components/BottomNav.jsx:tabs.map, src/components/BottomNav.jsx:calls, src/components/screens/MatchDetailScreen.jsx:calls
- `tailwindcss` [LOW] used by `subsystem-46-0-temp-extraction` from `temp_extraction/vite.config.ts`. Evidence: temp_extraction/vite.config.ts:tailwindcss, temp_extraction/vite.config.ts:calls, vite.config.ts:calls
- `team` [LOW] used by `subsystem-3-0-src-components` from `src/components/screens/MatchSetupScreen.jsx`. Evidence: src/components/screens/MatchSetupScreen.jsx:team, src/components/screens/MatchSetupScreen.jsx:calls
- `teamAName.substring` [LOW] used by `subsystem-79-0-src-components` from `src/components/ui/MatchCard.jsx`. Evidence: src/components/ui/MatchCard.jsx:teamAName.substring, src/components/ui/MatchCard.jsx:calls
- `teamBName.substring` [LOW] used by `subsystem-79-0-src-components` from `src/components/ui/MatchCard.jsx`. Evidence: src/components/ui/MatchCard.jsx:teamBName.substring, src/components/ui/MatchCard.jsx:calls
- `teamPlayers.includes` [LOW] used by `subsystem-21-0-src-components` from `src/components/screens/TeamRegistrationTab.jsx`. Evidence: src/components/screens/TeamRegistrationTab.jsx:teamPlayers.includes, src/components/screens/TeamRegistrationTab.jsx:calls, src/components/screens/TeamRegistrationTab.jsx:calls
- `teamPlayers.map` [LOW] used by `subsystem-9-0-src-components` from `src/components/screens/TeamsScreen.jsx`. Evidence: src/components/screens/TeamsScreen.jsx:teamPlayers.map, src/components/screens/TeamsScreen.jsx:calls
- `team_players` [LOW] used by `subsystem-5-0-src-context` from `src/context/CricketContext.jsx`. Evidence: src/context/CricketContext.jsx:team_players, src/context/CricketContext.jsx:calls
- `team_players.map` [LOW] used by `subsystem-9-0-src-components` from `src/components/screens/TeamsScreen.jsx`. Evidence: src/components/screens/TeamsScreen.jsx:team_players.map, src/components/screens/TeamsScreen.jsx:calls
- `team_players.some` [LOW] used by `subsystem-3-0-src-components` from `src/components/screens/MatchSetupScreen.jsx`. Evidence: src/components/screens/MatchSetupScreen.jsx:team_players.some, src/components/screens/MatchSetupScreen.jsx:calls
- `teams.bulkAdd` [LOW] used by `subsystem-5-0-src-context` from `src/context/CricketContext.jsx`. Evidence: src/context/CricketContext.jsx:teams.bulkAdd, src/context/CricketContext.jsx:calls
- `teams.clear` [LOW] used by `subsystem-5-0-src-context` from `src/context/CricketContext.jsx`. Evidence: src/context/CricketContext.jsx:teams.clear, src/context/CricketContext.jsx:calls
- `teams.filter` [LOW] used by `subsystem-171-0-src-components` from `src/components/screens/TeamRegistrationTab.jsx`. Evidence: src/components/screens/TeamRegistrationTab.jsx:teams.filter, src/components/screens/TeamRegistrationTab.jsx:calls, src/components/ui/TournamentManagerModal.jsx:calls
- `teams.find` [LOW] used by `subsystem-107-0-src-components` from `src/components/screens/SeasonMigrationTab.jsx`. Evidence: src/components/screens/SeasonMigrationTab.jsx:teams.find, src/components/screens/TournamentsScreen.jsx:calls, src/components/selection/SelectionWorkspace.jsx:calls
- `teams.map` [LOW] used by `subsystem-45-0-src-components` from `src/components/ui/TournamentManagerModal.jsx`. Evidence: src/components/ui/TournamentManagerModal.jsx:teams.map, src/components/ui/TournamentManagerModal.jsx:calls, src/components/ui/TournamentManagerModal.jsx:calls
- `teams.toArray` [LOW] used by `subsystem-5-0-src-context` from `src/context/CricketContext.jsx`. Evidence: src/context/CricketContext.jsx:teams.toArray, src/context/CricketContext.jsx:calls
- `teamsToInsert.filter` [LOW] used by `subsystem-0-0-src-lib` from `src/lib/api.js`. Evidence: src/lib/api.js:teamsToInsert.filter, src/lib/api.js:calls
- `teamsToInsert.push` [LOW] used by `subsystem-0-0-src-lib` from `src/lib/api.js`. Evidence: src/lib/api.js:teamsToInsert.push, src/lib/api.js:calls
- `test` [LOW] used by `subsystem-50-0-temp-extraction` from `temp_extraction/src/engine/matchSummaryEngine.js`. Evidence: temp_extraction/src/engine/matchSummaryEngine.js:test, temp_extraction/src/engine/matchSummaryEngine.js:calls, temp_extraction/src/engine/matchSummaryEngine.js:calls
- `theme.includes` [LOW] used by `subsystem-39-0-src-components` from `src/components/screens/NewsScreen.jsx`. Evidence: src/components/screens/NewsScreen.jsx:theme.includes, src/components/screens/NewsScreen.jsx:calls, src/components/screens/NewsScreen.jsx:calls
- `theme.split` [LOW] used by `subsystem-39-0-src-components` from `src/components/screens/NewsScreen.jsx`. Evidence: src/components/screens/NewsScreen.jsx:theme.split, src/components/screens/NewsScreen.jsx:calls
- `this.getActiveSeason` [LOW] used by `subsystem-0-0-src-lib` from `src/lib/api.js`. Evidence: src/lib/api.js:this.getActiveSeason, src/lib/api.js:calls, src/lib/api.js:calls
- `this.getDefaults` [LOW] used by `subsystem-0-0-src-lib` from `src/lib/api.js`. Evidence: src/lib/api.js:this.getDefaults, src/lib/api.js:calls, src/lib/api.js:calls
- `this.setActiveSeason` [LOW] used by `subsystem-0-0-src-lib` from `src/lib/api.js`. Evidence: src/lib/api.js:this.setActiveSeason, src/lib/api.js:calls
- `toArray` [LOW] used by `subsystem-41-0-src-lib` from `src/lib/db.js`. Evidence: src/lib/db.js:toArray, src/lib/db.js:calls
- `toLocaleString` [LOW] used by `subsystem-40-0-src-components` from `src/components/screens/RecycleBinTab.jsx`. Evidence: src/components/screens/RecycleBinTab.jsx:toLocaleString, src/components/screens/RecycleBinTab.jsx:calls, src/components/ui/MatchCard.jsx:calls
- `toString` [LOW] used by `subsystem-172-0-src-components` from `src/components/screens/TeamRegistrationTab.jsx`. Evidence: src/components/screens/TeamRegistrationTab.jsx:toString, src/components/screens/TeamRegistrationTab.jsx:calls, src/components/ui/TournamentManagerModal.jsx:calls
- `toggleCandidate` [LOW] used by `subsystem-0-0-src-lib` from `src/lib/api.js`. Evidence: src/lib/api.js:toggleCandidate, src/lib/api.js:calls
- `toggleShortlist` [LOW] used by `subsystem-161-0-src-components` from `src/components/screens/PlayerProfileScreen.jsx`. Evidence: src/components/screens/PlayerProfileScreen.jsx:toggleShortlist, src/components/screens/PlayerProfileScreen.jsx:calls, src/components/screens/ScoutingHubScreen.jsx:calls
- `topPerformers.find` [LOW] used by `subsystem-50-0-temp-extraction` from `temp_extraction/src/engine/matchSummaryEngine.js`. Evidence: temp_extraction/src/engine/matchSummaryEngine.js:topPerformers.find, temp_extraction/src/engine/matchSummaryEngine.js:calls, temp_extraction/src/engine/matchSummaryEngine.js:calls
- `tournamentMatches.map` [LOW] used by `subsystem-42-0-temp-extraction` from `temp_extraction/src/components/screens/MatchesScreen.jsx`. Evidence: temp_extraction/src/components/screens/MatchesScreen.jsx:tournamentMatches.map, temp_extraction/src/components/screens/MatchesScreen.jsx:calls
- `tournament_teams` [LOW] used by `subsystem-5-0-src-context` from `src/context/CricketContext.jsx`. Evidence: src/context/CricketContext.jsx:tournament_teams, src/context/CricketContext.jsx:calls, src/context/CricketContext.jsx:calls
- `tournament_teams.map` [LOW] used by `subsystem-15-0-src-components` from `src/components/screens/TournamentsScreen.jsx`. Evidence: src/components/screens/TournamentsScreen.jsx:tournament_teams.map, src/components/screens/TournamentsScreen.jsx:calls
- `tournaments.bulkAdd` [LOW] used by `subsystem-5-0-src-context` from `src/context/CricketContext.jsx`. Evidence: src/context/CricketContext.jsx:tournaments.bulkAdd, src/context/CricketContext.jsx:calls, src/context/CricketContext.jsx:calls
- `tournaments.clear` [LOW] used by `subsystem-5-0-src-context` from `src/context/CricketContext.jsx`. Evidence: src/context/CricketContext.jsx:tournaments.clear, src/context/CricketContext.jsx:calls, src/context/CricketContext.jsx:calls
- `tournaments.delete` [LOW] used by `subsystem-5-0-src-context` from `src/context/CricketContext.jsx`. Evidence: src/context/CricketContext.jsx:tournaments.delete, src/context/CricketContext.jsx:calls, src/context/CricketContext.jsx:calls
- `tournaments.map` [LOW] used by `subsystem-22-0-src-components` from `src/components/screens/HomeScreen.jsx`. Evidence: src/components/screens/HomeScreen.jsx:tournaments.map, src/components/screens/HomeScreen.jsx:calls, src/components/screens/TournamentsScreen.jsx:calls
- `tournaments.put` [LOW] used by `subsystem-5-0-src-context` from `src/context/CricketContext.jsx`. Evidence: src/context/CricketContext.jsx:tournaments.put, src/context/CricketContext.jsx:calls
- `tournaments.toArray` [LOW] used by `subsystem-5-0-src-context` from `src/context/CricketContext.jsx`. Evidence: src/context/CricketContext.jsx:tournaments.toArray, src/context/CricketContext.jsx:calls
- `translate` [LOW] used by `subsystem-35-0-src-components` from `src/components/CricketIllustrations.jsx`. Evidence: src/components/CricketIllustrations.jsx:translate, src/components/CricketIllustrations.jsx:calls, temp_extraction/src/components/CricketIllustrations.jsx:calls
- `translateX` [LOW] used by `subsystem-96-0-temp-extraction` from `temp_extraction/src/components/BottomNav.jsx`. Evidence: temp_extraction/src/components/BottomNav.jsx:translateX, temp_extraction/src/components/BottomNav.jsx:calls, temp_extraction/src/components/DrawerMenu.jsx:calls
- `translateY` [LOW] used by `subsystem-26-0-temp-extraction` from `temp_extraction/src/components/screens/PlayersScreen.jsx`. Evidence: temp_extraction/src/components/screens/PlayersScreen.jsx:translateY, temp_extraction/src/components/screens/PlayersScreen.jsx:calls
- `trigger` [LOW] used by `subsystem-52-0-src-hooks` from `src/hooks/useHaptics.js`. Evidence: src/hooks/useHaptics.js:trigger, src/hooks/useHaptics.js:calls, src/hooks/useHaptics.js:calls
- `undoLastAction` [LOW] used by `subsystem-2-0-src-components` from `src/components/screens/ScoringScreen.jsx`. Evidence: src/components/screens/ScoringScreen.jsx:undoLastAction, src/components/screens/ScoringScreen.jsx:calls
- `unsubscribe` [LOW] used by `subsystem-2-0-src-components` from `src/components/screens/ScoringScreen.jsx`. Evidence: src/components/screens/ScoringScreen.jsx:unsubscribe, src/components/screens/ScoringScreen.jsx:calls
- `upcomingMatches.map` [LOW] used by `subsystem-54-0-src-components` from `src/components/screens/MatchesScreen.jsx`. Evidence: src/components/screens/MatchesScreen.jsx:upcomingMatches.map, src/components/screens/MatchesScreen.jsx:calls, temp_extraction/src/components/screens/HomeScreen.jsx:calls
- `upcomingMatches.slice` [LOW] used by `subsystem-22-0-src-components` from `src/components/screens/HomeScreen.jsx`. Evidence: src/components/screens/HomeScreen.jsx:upcomingMatches.slice, src/components/screens/HomeScreen.jsx:calls
- `update` [LOW] used by `subsystem-0-0-src-lib` from `src/lib/api.js`. Evidence: src/lib/api.js:update, src/lib/api.js:calls, src/lib/api.js:calls
- `updateSW` [LOW] used by `subsystem-25-0-src-main-jsx` from `src/main.jsx`. Evidence: src/main.jsx:updateSW, src/main.jsx:calls
- `updateSelectorAssignments` [LOW] used by `subsystem-0-0-src-lib` from `src/lib/api.js`. Evidence: src/lib/api.js:updateSelectorAssignments, src/lib/api.js:calls
- `updateTournament` [LOW] used by `subsystem-0-0-src-lib` from `src/lib/api.js`. Evidence: src/lib/api.js:updateTournament, src/lib/api.js:calls
- `updateUserPermissions` [LOW] used by `subsystem-0-0-src-lib` from `src/lib/api.js`. Evidence: src/lib/api.js:updateUserPermissions, src/lib/api.js:calls
- `updateUserRole` [LOW] used by `subsystem-0-0-src-lib` from `src/lib/api.js`. Evidence: src/lib/api.js:updateUserRole, src/lib/api.js:calls
- `updateUserStatus` [LOW] used by `subsystem-0-0-src-lib` from `src/lib/api.js`. Evidence: src/lib/api.js:updateUserStatus, src/lib/api.js:calls
- `upsert` [LOW] used by `subsystem-0-0-src-lib` from `src/lib/api.js`. Evidence: src/lib/api.js:upsert, src/lib/api.js:calls
- `useCallback` [LOW] used by `subsystem-52-0-src-hooks` from `src/hooks/useHaptics.js`. Evidence: src/hooks/useHaptics.js:useCallback, src/hooks/useHaptics.js:calls
- `useContext` [LOW] used by `subsystem-1-0-src-context` from `src/context/CricketContext.jsx`. Evidence: src/context/CricketContext.jsx:useContext, src/context/CricketContext.jsx:calls, temp_extraction/src/context/CricketContext.jsx:calls
- `useCricket` [LOW] used by `subsystem-53-0-src-app-jsx` from `src/App.jsx`. Evidence: src/App.jsx:useCricket, src/components/BottomNav.jsx:calls, src/components/DrawerMenu.jsx:calls
- `useHaptics` [LOW] used by `subsystem-122-0-src-components` from `src/components/screens/AuthScreen.jsx`. Evidence: src/components/screens/AuthScreen.jsx:useHaptics, src/components/screens/AuthScreen.jsx:calls, src/components/screens/ScoringScreen.jsx:calls
- `useLocation` [LOW] used by `subsystem-149-0-src-app-jsx` from `src/App.jsx`. Evidence: src/App.jsx:useLocation, src/context/CricketContext.jsx:calls, temp_extraction/src/context/CricketContext.jsx:calls
- `useMemo` [LOW] used by `subsystem-103-0-src-components` from `src/components/screens/InningsInitScreen.jsx`. Evidence: src/components/screens/InningsInitScreen.jsx:useMemo, src/components/screens/InningsInitScreen.jsx:calls, src/components/screens/InningsInitScreen.jsx:calls
- `useNavigate` [LOW] used by `subsystem-1-0-src-context` from `src/context/CricketContext.jsx`. Evidence: src/context/CricketContext.jsx:useNavigate, src/context/CricketContext.jsx:calls, temp_extraction/src/context/CricketContext.jsx:calls
- `useStandings` [LOW] used by `subsystem-22-0-src-components` from `src/components/screens/HomeScreen.jsx`. Evidence: src/components/screens/HomeScreen.jsx:useStandings, src/components/screens/HomeScreen.jsx:calls, src/components/screens/TournamentsScreen.jsx:calls
- `userEmail.split` [LOW] used by `subsystem-72-0-temp-extraction` from `temp_extraction/src/components/screens/HomeScreen.jsx`. Evidence: temp_extraction/src/components/screens/HomeScreen.jsx:userEmail.split, temp_extraction/src/components/screens/HomeScreen.jsx:calls
- `version` [LOW] used by `subsystem-12-0-src-components` from `src/components/ui/CloudinaryAvatar.jsx`. Evidence: src/components/ui/CloudinaryAvatar.jsx:version, src/components/ui/CloudinaryAvatar.jsx:calls
- `virtual:pwa-register` [LOW] used by `subsystem-25-0-src-main-jsx` from `src/main.jsx`. Evidence: src/main.jsx:virtual:pwa-register, src/main.jsx:imports
- `visible.map` [LOW] used by `subsystem-47-0-src-components` from `src/components/DrawerMenu.jsx`. Evidence: src/components/DrawerMenu.jsx:visible.map, src/components/DrawerMenu.jsx:calls, src/components/Sidebar.jsx:calls
- `vite` [LOW] used by `subsystem-46-0-temp-extraction` from `temp_extraction/vite.config.ts`. Evidence: temp_extraction/vite.config.ts:vite, temp_extraction/vite.config.ts:imports, vite.config.ts:imports
- `vite-plugin-pwa` [LOW] used by `subsystem-46-0-temp-extraction` from `vite.config.ts`. Evidence: vite.config.ts:vite-plugin-pwa, vite.config.ts:imports
- `warnings.map` [LOW] used by `subsystem-48-0-src-components` from `src/components/selection/TeamSelectionDashboard.jsx`. Evidence: src/components/selection/TeamSelectionDashboard.jsx:warnings.map, src/components/selection/TeamSelectionDashboard.jsx:calls
- `warnings.push` [LOW] used by `subsystem-48-0-src-components` from `src/components/selection/TeamSelectionDashboard.jsx`. Evidence: src/components/selection/TeamSelectionDashboard.jsx:warnings.push, src/components/selection/TeamSelectionDashboard.jsx:calls, src/components/selection/TeamSelectionDashboard.jsx:calls
- `webpush.sendNotification` [LOW] used by `subsystem-17-0-supabase` from `supabase/functions/send-push/index.ts`. Evidence: supabase/functions/send-push/index.ts:webpush.sendNotification, supabase/functions/send-push/index.ts:calls
- `webpush.setVapidDetails` [LOW] used by `subsystem-17-0-supabase` from `supabase/functions/send-push/index.ts`. Evidence: supabase/functions/send-push/index.ts:webpush.setVapidDetails, supabase/functions/send-push/index.ts:calls
- `wicket_type.toLowerCase` [LOW] used by `subsystem-67-0-src-lib` from `src/lib/api.js`. Evidence: src/lib/api.js:wicket_type.toLowerCase, src/lib/api.js:calls
- `wicketsValues.reduce` [LOW] used by `subsystem-6-0-src-components` from `src/components/selection/PerformanceGraphs.jsx`. Evidence: src/components/selection/PerformanceGraphs.jsx:wicketsValues.reduce, src/components/selection/PerformanceGraphs.jsx:calls
- `window.atob` [LOW] used by `subsystem-28-0-src-components` from `src/components/NotificationPrompt.jsx`. Evidence: src/components/NotificationPrompt.jsx:window.atob, src/components/NotificationPrompt.jsx:calls
- `window.confirm` [LOW] used by `subsystem-7-0-src-components` from `src/components/screens/AdministrationScreen.jsx`. Evidence: src/components/screens/AdministrationScreen.jsx:window.confirm, src/components/screens/AdministrationScreen.jsx:calls, src/components/screens/AdministrationScreen.jsx:calls
- `window.print` [LOW] used by `subsystem-70-0-src-components` from `src/components/screens/ScorecardScreen.jsx`. Evidence: src/components/screens/ScorecardScreen.jsx:window.print, src/components/screens/ScorecardScreen.jsx:calls, temp_extraction/src/components/screens/ScorecardScreen.jsx:calls
- `window.removeEventListener` [LOW] used by `subsystem-29-0-src-components` from `src/components/BottomNav.jsx`. Evidence: src/components/BottomNav.jsx:window.removeEventListener, src/components/BottomNav.jsx:calls, src/components/Header.jsx:calls
- `window.requestAnimationFrame` [LOW] used by `subsystem-29-0-src-components` from `src/components/BottomNav.jsx`. Evidence: src/components/BottomNav.jsx:window.requestAnimationFrame, src/components/BottomNav.jsx:calls, src/components/Header.jsx:calls
- `z.boolean` [LOW] used by `subsystem-13-0-src-engine` from `src/engine/validationSchemas.js`. Evidence: src/engine/validationSchemas.js:z.boolean, src/engine/validationSchemas.js:calls, temp_extraction/src/engine/validationSchemas.js:calls
- `z.enum` [LOW] used by `subsystem-13-0-src-engine` from `src/engine/validationSchemas.js`. Evidence: src/engine/validationSchemas.js:z.enum, src/engine/validationSchemas.js:calls, src/engine/validationSchemas.js:calls
- `z.number` [LOW] used by `subsystem-13-0-src-engine` from `src/engine/validationSchemas.js`. Evidence: src/engine/validationSchemas.js:z.number, src/engine/validationSchemas.js:calls, src/engine/validationSchemas.js:calls
- `z.object` [LOW] used by `subsystem-13-0-src-engine` from `src/engine/validationSchemas.js`. Evidence: src/engine/validationSchemas.js:z.object, src/engine/validationSchemas.js:calls, src/engine/validationSchemas.js:calls
- `z.string` [LOW] used by `subsystem-13-0-src-engine` from `src/engine/validationSchemas.js`. Evidence: src/engine/validationSchemas.js:z.string, src/engine/validationSchemas.js:calls, src/engine/validationSchemas.js:calls
- `zod` [LOW] used by `subsystem-13-0-src-engine` from `src/engine/validationSchemas.js`. Evidence: src/engine/validationSchemas.js:zod, src/engine/validationSchemas.js:imports, temp_extraction/src/engine/validationSchemas.js:imports

## Open Questions

- LOW: Does `subsystem-0-0-src-lib` really depend on `subsystem-16-0-src-components` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: src/lib/api.js:calls, src/lib/api.js:calls, src/lib/api.js:calls
- LOW: Does `subsystem-0-0-src-lib` really depend on `subsystem-176-0-src-components` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: src/lib/api.js:calls, src/lib/api.js:calls, src/lib/api.js:calls
- LOW: Does `subsystem-0-0-src-lib` really depend on `subsystem-178-0-src-engine` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: src/lib/api.js:calls, src/lib/api.js:calls, src/lib/api.js:calls
- LOW: Does `subsystem-0-0-src-lib` really depend on `subsystem-23-0-src-engine` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: src/lib/api.js:calls, src/lib/api.js:calls, src/lib/api.js:calls
- LOW: Does `subsystem-0-0-src-lib` really depend on `subsystem-27-0-apply-bug5-sql-js` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: src/lib/api.js:calls, src/lib/api.js:calls, src/lib/api.js:calls
- LOW: Does `subsystem-0-0-src-lib` really depend on `subsystem-82-0-delete-season-js` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: src/lib/api.js:calls, src/lib/api.js:calls, src/lib/api.js:calls
- LOW: Does `subsystem-1-0-src-context` really depend on `subsystem-102-0-src-components` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: src/context/CricketContext.jsx:calls, src/context/CricketContext.jsx:calls, src/context/CricketContext.jsx:calls
- LOW: Does `subsystem-1-0-src-context` really depend on `subsystem-105-0-src-components` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: src/context/CricketContext.jsx:calls, temp_extraction/src/context/CricketContext.jsx:calls
- LOW: Does `subsystem-1-0-src-context` really depend on `subsystem-106-0-src-components` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: src/context/CricketContext.jsx:calls
- LOW: Does `subsystem-1-0-src-context` really depend on `subsystem-108-0-src-components` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: src/context/CricketContext.jsx:calls
- LOW: Does `subsystem-1-0-src-context` really depend on `subsystem-121-0-src-components` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: src/context/CricketContext.jsx:calls, src/context/CricketContext.jsx:calls, src/context/CricketContext.jsx:calls
- LOW: Does `subsystem-1-0-src-context` really depend on `subsystem-149-0-src-app-jsx` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: src/context/CricketContext.jsx:calls
- LOW: Does `subsystem-1-0-src-context` really depend on `subsystem-154-0-src-components` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: src/context/CricketContext.jsx:calls
- LOW: Does `subsystem-1-0-src-context` really depend on `subsystem-155-0-src-components` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: src/context/CricketContext.jsx:calls, temp_extraction/src/context/CricketContext.jsx:calls, src/context/CricketContext.jsx:calls
- LOW: Does `subsystem-1-0-src-context` really depend on `subsystem-158-0-src-components` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: src/context/CricketContext.jsx:calls, src/context/CricketContext.jsx:calls, src/context/CricketContext.jsx:calls
- LOW: Does `subsystem-1-0-src-context` really depend on `subsystem-163-0-src-components` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: temp_extraction/src/context/CricketContext.jsx:calls
- LOW: Does `subsystem-1-0-src-context` really depend on `subsystem-165-0-src-components` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: src/context/CricketContext.jsx:calls, temp_extraction/src/context/CricketContext.jsx:calls
- LOW: Does `subsystem-1-0-src-context` really depend on `subsystem-168-0-src-components` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: src/context/CricketContext.jsx:calls, src/context/CricketContext.jsx:calls, src/context/CricketContext.jsx:calls
- LOW: Does `subsystem-1-0-src-context` really depend on `subsystem-172-0-src-components` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: src/context/CricketContext.jsx:calls, temp_extraction/src/context/CricketContext.jsx:calls
- LOW: Does `subsystem-1-0-src-context` really depend on `subsystem-174-0-src-components` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: src/context/CricketContext.jsx:calls, temp_extraction/src/context/CricketContext.jsx:calls, temp_extraction/src/context/CricketContext.jsx:calls
- LOW: Does `subsystem-1-0-src-context` really depend on `subsystem-19-0-src-components` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: src/context/CricketContext.jsx:calls, temp_extraction/src/context/CricketContext.jsx:calls
- LOW: Does `subsystem-1-0-src-context` really depend on `subsystem-2-0-src-components` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: src/context/CricketContext.jsx:calls, src/context/CricketContext.jsx:calls, temp_extraction/src/context/CricketContext.jsx:calls
- LOW: Does `subsystem-1-0-src-context` really depend on `subsystem-21-0-src-components` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: src/context/CricketContext.jsx:calls
- LOW: Does `subsystem-1-0-src-context` really depend on `subsystem-29-0-src-components` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: src/context/CricketContext.jsx:calls, src/context/CricketContext.jsx:calls, src/context/CricketContext.jsx:calls
- LOW: Does `subsystem-1-0-src-context` really depend on `subsystem-3-0-src-components` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: src/context/CricketContext.jsx:calls, src/context/CricketContext.jsx:calls, src/context/CricketContext.jsx:calls
- LOW: Does `subsystem-1-0-src-context` really depend on `subsystem-33-0-src-components` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: src/context/CricketContext.jsx:calls
- LOW: Does `subsystem-1-0-src-context` really depend on `subsystem-39-0-src-components` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: src/context/CricketContext.jsx:calls, temp_extraction/src/context/CricketContext.jsx:calls
- LOW: Does `subsystem-1-0-src-context` really depend on `subsystem-6-0-src-components` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: src/context/CricketContext.jsx:calls, temp_extraction/src/context/CricketContext.jsx:calls
- LOW: Does `subsystem-1-0-src-context` really depend on `subsystem-7-0-src-components` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: src/context/CricketContext.jsx:calls, src/context/CricketContext.jsx:calls, src/context/CricketContext.jsx:calls
- LOW: Does `subsystem-1-0-src-context` really depend on `subsystem-70-0-src-components` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: src/context/CricketContext.jsx:calls, src/context/CricketContext.jsx:calls
- LOW: Does `subsystem-1-0-src-context` really depend on `subsystem-80-0-src-components` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: src/context/CricketContext.jsx:calls
- LOW: Does `subsystem-1-0-src-context` really depend on `subsystem-88-0-src-components` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: src/context/CricketContext.jsx:calls, src/context/CricketContext.jsx:calls, src/context/CricketContext.jsx:calls
- LOW: Does `subsystem-1-0-src-context` really depend on `subsystem-98-0-temp-extraction` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: temp_extraction/src/context/CricketContext.jsx:calls
- LOW: Does `subsystem-100-0-test-players3-js` really depend on `subsystem-0-0-src-lib` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: test-players3.js:calls, test-players3.js:calls, test-players3.js:calls
- LOW: Does `subsystem-100-0-test-players3-js` really depend on `subsystem-38-0-src-sw-js` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: test-players3.js:calls
- LOW: Does `subsystem-100-0-test-players3-js` really depend on `subsystem-99-0-test-players2-js` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: test-players3.js:calls
- LOW: Does `subsystem-101-0-test-stats-js` really depend on `subsystem-0-0-src-lib` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: test-stats.js:calls, test-stats.js:calls, test-stats.js:calls
- LOW: Does `subsystem-101-0-test-stats-js` really depend on `subsystem-41-0-src-lib` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: test-stats.js:calls, test-stats.js:calls
- LOW: Does `subsystem-101-0-test-stats-js` really depend on `subsystem-82-0-delete-season-js` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: test-stats.js:calls, test-stats.js:calls, test-stats.js:calls
- LOW: Does `subsystem-106-0-src-components` really depend on `subsystem-104-0-src-components` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: src/components/screens/SeasonMigrationTab.jsx:calls, src/components/screens/SeasonMigrationTab.jsx:calls
- LOW: Does `subsystem-106-0-src-components` really depend on `subsystem-2-0-src-components` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: src/components/screens/SeasonMigrationTab.jsx:calls
- LOW: Does `subsystem-106-0-src-components` really depend on `subsystem-8-0-src-components` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: src/components/screens/SeasonMigrationTab.jsx:calls, src/components/screens/SeasonMigrationTab.jsx:calls
- LOW: Does `subsystem-11-0-src-components` really depend on `subsystem-121-0-src-components` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: src/components/screens/PlayerRegistrationScreen.jsx:calls, src/components/screens/PlayerRegistrationScreen.jsx:calls
- LOW: Does `subsystem-11-0-src-components` really depend on `subsystem-162-0-src-components` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: src/components/screens/PlayerRegistrationScreen.jsx:calls, temp_extraction/src/components/screens/PlayerRegistrationScreen.jsx:calls
- LOW: Does `subsystem-11-0-src-components` really depend on `subsystem-163-0-src-components` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: src/components/screens/PlayerRegistrationScreen.jsx:calls, src/components/screens/PlayerRegistrationScreen.jsx:calls, temp_extraction/src/components/screens/PlayerRegistrationScreen.jsx:calls
- LOW: Does `subsystem-11-0-src-components` really depend on `subsystem-164-0-src-components` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: src/components/screens/PlayerRegistrationScreen.jsx:calls
- LOW: Does `subsystem-11-0-src-components` really depend on `subsystem-179-0-temp-extraction` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: temp_extraction/src/components/screens/PlayerRegistrationScreen.jsx:calls
- LOW: Does `subsystem-11-0-src-components` really depend on `subsystem-7-0-src-components` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: src/components/screens/PlayerRegistrationScreen.jsx:calls, src/components/screens/PlayerRegistrationScreen.jsx:calls
- LOW: Does `subsystem-11-0-src-components` really depend on `subsystem-88-0-src-components` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: src/components/screens/PlayerRegistrationScreen.jsx:calls, src/components/screens/PlayerRegistrationScreen.jsx:calls, src/components/screens/PlayerRegistrationScreen.jsx:calls
- LOW: Does `subsystem-111-0-src-components` really depend on `subsystem-88-0-src-components` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: src/components/Header.jsx:calls
- LOW: Does `subsystem-113-0-src-components` really depend on `subsystem-159-0-src-components` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: src/components/selection/PlayerComparison.jsx:calls, src/components/selection/PlayerComparison.jsx:calls, src/components/selection/PlayerComparison.jsx:calls
- LOW: Does `subsystem-114-0-src-components` really depend on `subsystem-170-0-src-components` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: src/components/ui/BottomSheet.jsx:calls
- LOW: Does `subsystem-118-0-temp-extraction` really depend on `subsystem-104-0-src-components` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: temp_extraction/src/components/screens/SelectionScreen.jsx:calls, temp_extraction/src/components/screens/SelectionScreen.jsx:calls, temp_extraction/src/components/screens/SelectionScreen.jsx:calls
- LOW: Does `subsystem-118-0-temp-extraction` really depend on `subsystem-106-0-src-components` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: temp_extraction/src/components/screens/SelectionScreen.jsx:calls
- LOW: Does `subsystem-118-0-temp-extraction` really depend on `subsystem-150-0-src-components` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: temp_extraction/src/components/screens/SelectionScreen.jsx:calls, temp_extraction/src/components/screens/SelectionScreen.jsx:calls, temp_extraction/src/components/screens/SelectionScreen.jsx:calls
- LOW: Does `subsystem-118-0-temp-extraction` really depend on `subsystem-153-0-src-components` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: temp_extraction/src/components/screens/SelectionScreen.jsx:calls
- LOW: Does `subsystem-118-0-temp-extraction` really depend on `subsystem-161-0-src-components` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: temp_extraction/src/components/screens/SelectionScreen.jsx:calls
- LOW: Does `subsystem-118-0-temp-extraction` really depend on `subsystem-162-0-src-components` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: temp_extraction/src/components/screens/SelectionScreen.jsx:calls
- LOW: Does `subsystem-118-0-temp-extraction` really depend on `subsystem-167-0-src-components` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: temp_extraction/src/components/screens/SelectionScreen.jsx:calls
- LOW: Does `subsystem-118-0-temp-extraction` really depend on `subsystem-179-0-temp-extraction` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: temp_extraction/src/components/screens/SelectionScreen.jsx:calls
- LOW: Does `subsystem-118-0-temp-extraction` really depend on `subsystem-30-0-src-components` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: temp_extraction/src/components/screens/SelectionScreen.jsx:calls, temp_extraction/src/components/screens/SelectionScreen.jsx:calls, temp_extraction/src/components/screens/SelectionScreen.jsx:calls
- LOW: Does `subsystem-118-0-temp-extraction` really depend on `subsystem-33-0-src-components` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: temp_extraction/src/components/screens/SelectionScreen.jsx:calls, temp_extraction/src/components/screens/SelectionScreen.jsx:calls, temp_extraction/src/components/screens/SelectionScreen.jsx:calls
- LOW: Does `subsystem-118-0-temp-extraction` really depend on `subsystem-77-0-src-components` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: temp_extraction/src/components/screens/SelectionScreen.jsx:calls, temp_extraction/src/components/screens/SelectionScreen.jsx:calls
- LOW: Does `subsystem-118-0-temp-extraction` really depend on `subsystem-88-0-src-components` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: temp_extraction/src/components/screens/SelectionScreen.jsx:calls, temp_extraction/src/components/screens/SelectionScreen.jsx:calls, temp_extraction/src/components/screens/SelectionScreen.jsx:calls
- LOW: Does `subsystem-119-0-temp-extraction` really depend on `subsystem-3-0-src-components` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: temp_extraction/src/components/ui/MatchFolder.jsx:calls
- LOW: Does `subsystem-119-0-temp-extraction` really depend on `subsystem-88-0-src-components` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: temp_extraction/src/components/ui/MatchFolder.jsx:calls
- LOW: Does `subsystem-12-0-src-components` really depend on `subsystem-56-0-src-components` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: src/components/ui/CloudinaryAvatar.jsx:calls
- LOW: Does `subsystem-120-0-test-players-js` really depend on `subsystem-0-0-src-lib` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: test-players.js:calls, test-players.js:calls, test-players.js:calls
- LOW: Does `subsystem-120-0-test-players-js` really depend on `subsystem-82-0-delete-season-js` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: test-players.js:calls
- LOW: Does `subsystem-120-0-test-players-js` really depend on `subsystem-99-0-test-players2-js` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: test-players.js:calls, test-players.js:calls
- LOW: Does `subsystem-125-0-temp-extraction` really depend on `subsystem-152-0-src-components` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: temp_extraction/src/components/screens/AuthScreen.jsx:calls
- LOW: Does `subsystem-125-0-temp-extraction` really depend on `subsystem-29-0-src-components` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: temp_extraction/src/components/screens/AuthScreen.jsx:calls, temp_extraction/src/components/screens/AuthScreen.jsx:calls, temp_extraction/src/components/screens/AuthScreen.jsx:calls
- LOW: Does `subsystem-125-0-temp-extraction` really depend on `subsystem-5-0-src-context` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: temp_extraction/src/components/screens/AuthScreen.jsx:calls, temp_extraction/src/components/screens/AuthScreen.jsx:calls
- LOW: Does `subsystem-13-0-src-engine` really depend on `subsystem-16-0-src-components` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: src/engine/validationSchemas.js:calls, src/engine/validationSchemas.js:calls, src/engine/validationSchemas.js:calls
- LOW: Does `subsystem-13-0-src-engine` really depend on `subsystem-178-0-src-engine` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: src/engine/validationSchemas.js:calls
- LOW: Does `subsystem-130-0-src-lib` really depend on `subsystem-0-0-src-lib` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: src/lib/supabase.js:calls
- LOW: Does `subsystem-132-0-temp-extraction` really depend on `subsystem-29-0-src-components` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: temp_extraction/src/components/DrawerMenu.jsx:calls, temp_extraction/src/components/DrawerMenu.jsx:calls
- LOW: Does `subsystem-132-0-temp-extraction` really depend on `subsystem-6-0-src-components` through `imports`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: temp_extraction/src/components/DrawerMenu.jsx:imports
- LOW: Does `subsystem-132-0-temp-extraction` really depend on `subsystem-88-0-src-components` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: temp_extraction/src/components/DrawerMenu.jsx:calls, temp_extraction/src/components/DrawerMenu.jsx:calls, temp_extraction/src/components/DrawerMenu.jsx:calls
- LOW: Does `subsystem-132-0-temp-extraction` really depend on `subsystem-96-0-temp-extraction` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: temp_extraction/src/components/DrawerMenu.jsx:calls, temp_extraction/src/components/DrawerMenu.jsx:calls
- LOW: Does `subsystem-133-0-temp-extraction` really depend on `subsystem-111-0-src-components` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: temp_extraction/src/components/Header.jsx:calls
- LOW: Does `subsystem-133-0-temp-extraction` really depend on `subsystem-29-0-src-components` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: temp_extraction/src/components/Header.jsx:calls
- LOW: Does `subsystem-133-0-temp-extraction` really depend on `subsystem-47-0-src-components` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: temp_extraction/src/components/Header.jsx:calls, temp_extraction/src/components/Header.jsx:calls, temp_extraction/src/components/Header.jsx:calls
- LOW: Does `subsystem-135-0-temp-extraction` really depend on `subsystem-2-0-src-components` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: temp_extraction/src/components/screens/AccessControlScreen.jsx:calls
- LOW: Does `subsystem-135-0-temp-extraction` really depend on `subsystem-93-0-src-components` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: temp_extraction/src/components/screens/AccessControlScreen.jsx:calls, temp_extraction/src/components/screens/AccessControlScreen.jsx:calls
- LOW: Does `subsystem-136-0-temp-extraction` really depend on `subsystem-30-0-src-components` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: temp_extraction/src/components/screens/AuthScreen.jsx:calls, temp_extraction/src/components/screens/AuthScreen.jsx:calls
- LOW: Does `subsystem-136-0-temp-extraction` really depend on `subsystem-65-0-src-components` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: temp_extraction/src/components/screens/AuthScreen.jsx:calls
- LOW: Does `subsystem-136-0-temp-extraction` really depend on `subsystem-7-0-src-components` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: temp_extraction/src/components/screens/AuthScreen.jsx:calls
- LOW: Does `subsystem-136-0-temp-extraction` really depend on `subsystem-74-0-src-components` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: temp_extraction/src/components/screens/AuthScreen.jsx:calls, temp_extraction/src/components/screens/AuthScreen.jsx:calls
- LOW: Does `subsystem-136-0-temp-extraction` really depend on `subsystem-88-0-src-components` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: temp_extraction/src/components/screens/AuthScreen.jsx:calls, temp_extraction/src/components/screens/AuthScreen.jsx:calls
- LOW: Does `subsystem-137-0-temp-extraction` really depend on `subsystem-157-0-src-components` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: temp_extraction/src/components/screens/InningsBreakScreen.jsx:calls, temp_extraction/src/components/screens/InningsBreakScreen.jsx:calls
- LOW: Does `subsystem-138-0-temp-extraction` really depend on `subsystem-6-0-src-components` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: temp_extraction/src/components/screens/MatchDetailScreen.jsx:calls
- LOW: Does `subsystem-138-0-temp-extraction` really depend on `subsystem-69-0-src-components` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: temp_extraction/src/components/screens/MatchDetailScreen.jsx:calls, temp_extraction/src/components/screens/MatchDetailScreen.jsx:calls, temp_extraction/src/components/screens/MatchDetailScreen.jsx:calls
- LOW: Does `subsystem-139-0-temp-extraction` really depend on `subsystem-29-0-src-components` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: temp_extraction/src/components/screens/MatchOverviewScreen.jsx:calls, temp_extraction/src/components/screens/MatchOverviewScreen.jsx:calls
- LOW: Does `subsystem-139-0-temp-extraction` really depend on `subsystem-85-0-src-components` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: temp_extraction/src/components/screens/MatchOverviewScreen.jsx:calls, temp_extraction/src/components/screens/MatchOverviewScreen.jsx:calls, temp_extraction/src/components/screens/MatchOverviewScreen.jsx:calls
- LOW: Does `subsystem-14-0-src-services` really depend on `subsystem-0-0-src-lib` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: src/services/SyncService.js:calls, src/services/SyncService.js:calls, src/services/SyncService.js:calls
- LOW: Does `subsystem-14-0-src-services` really depend on `subsystem-13-0-src-engine` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: src/services/SyncService.js:calls, src/services/SyncService.js:calls, src/services/SyncService.js:calls
- LOW: Does `subsystem-14-0-src-services` really depend on `subsystem-16-0-src-components` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: src/services/SyncService.js:calls, src/services/SyncService.js:calls
- LOW: Does `subsystem-14-0-src-services` really depend on `subsystem-23-0-src-engine` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: src/services/SyncService.js:calls
- LOW: Does `subsystem-14-0-src-services` really depend on `subsystem-27-0-apply-bug5-sql-js` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: src/services/SyncService.js:calls, src/services/SyncService.js:calls, src/services/SyncService.js:calls
- LOW: Does `subsystem-14-0-src-services` really depend on `subsystem-82-0-delete-season-js` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: src/services/SyncService.js:calls, src/services/SyncService.js:calls, src/services/SyncService.js:calls
- LOW: Does `subsystem-140-0-temp-extraction` really depend on `subsystem-103-0-src-components` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: temp_extraction/src/components/screens/MatchResultScreen.jsx:calls
- LOW: Does `subsystem-140-0-temp-extraction` really depend on `subsystem-62-0-src-components` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: temp_extraction/src/components/screens/MatchResultScreen.jsx:calls
- LOW: Does `subsystem-140-0-temp-extraction` really depend on `subsystem-69-0-src-components` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: temp_extraction/src/components/screens/MatchResultScreen.jsx:calls, temp_extraction/src/components/screens/MatchResultScreen.jsx:calls
- LOW: Does `subsystem-140-0-temp-extraction` really depend on `subsystem-88-0-src-components` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: temp_extraction/src/components/screens/MatchResultScreen.jsx:calls
- LOW: Does `subsystem-141-0-temp-extraction` really depend on `subsystem-103-0-src-components` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: temp_extraction/src/components/screens/PlayerComparisonModal.jsx:calls
- LOW: Does `subsystem-141-0-temp-extraction` really depend on `subsystem-104-0-src-components` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: temp_extraction/src/components/screens/PlayerComparisonModal.jsx:calls
- LOW: Does `subsystem-141-0-temp-extraction` really depend on `subsystem-2-0-src-components` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: temp_extraction/src/components/screens/PlayerComparisonModal.jsx:calls
- LOW: Does `subsystem-141-0-temp-extraction` really depend on `subsystem-76-0-src-components` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: temp_extraction/src/components/screens/PlayerComparisonModal.jsx:calls, temp_extraction/src/components/screens/PlayerComparisonModal.jsx:calls, temp_extraction/src/components/screens/PlayerComparisonModal.jsx:calls
- LOW: Does `subsystem-142-0-temp-extraction` really depend on `subsystem-151-0-src-components` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: temp_extraction/src/components/screens/ScorecardScreen.jsx:calls
- LOW: Does `subsystem-142-0-temp-extraction` really depend on `subsystem-62-0-src-components` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: temp_extraction/src/components/screens/ScorecardScreen.jsx:calls
- LOW: Does `subsystem-142-0-temp-extraction` really depend on `subsystem-7-0-src-components` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: temp_extraction/src/components/screens/ScorecardScreen.jsx:calls
- LOW: Does `subsystem-142-0-temp-extraction` really depend on `subsystem-70-0-src-components` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: temp_extraction/src/components/screens/ScorecardScreen.jsx:calls, temp_extraction/src/components/screens/ScorecardScreen.jsx:calls, temp_extraction/src/components/screens/ScorecardScreen.jsx:calls
- LOW: Does `subsystem-142-0-temp-extraction` really depend on `subsystem-88-0-src-components` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: temp_extraction/src/components/screens/ScorecardScreen.jsx:calls
- LOW: Does `subsystem-143-0-temp-extraction` really depend on `subsystem-104-0-src-components` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: temp_extraction/src/components/screens/SelectorsScreen.jsx:calls, temp_extraction/src/components/screens/SelectorsScreen.jsx:calls, temp_extraction/src/components/screens/SelectorsScreen.jsx:calls
- LOW: Does `subsystem-143-0-temp-extraction` really depend on `subsystem-150-0-src-components` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: temp_extraction/src/components/screens/SelectorsScreen.jsx:calls, temp_extraction/src/components/screens/SelectorsScreen.jsx:calls
- LOW: Does `subsystem-143-0-temp-extraction` really depend on `subsystem-153-0-src-components` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: temp_extraction/src/components/screens/SelectorsScreen.jsx:calls
- LOW: Does `subsystem-143-0-temp-extraction` really depend on `subsystem-161-0-src-components` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: temp_extraction/src/components/screens/SelectorsScreen.jsx:calls
- LOW: Does `subsystem-143-0-temp-extraction` really depend on `subsystem-167-0-src-components` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: temp_extraction/src/components/screens/SelectorsScreen.jsx:calls
- LOW: Does `subsystem-143-0-temp-extraction` really depend on `subsystem-2-0-src-components` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: temp_extraction/src/components/screens/SelectorsScreen.jsx:calls
- LOW: Does `subsystem-143-0-temp-extraction` really depend on `subsystem-24-0-src-components` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: temp_extraction/src/components/screens/SelectorsScreen.jsx:calls
- LOW: Does `subsystem-143-0-temp-extraction` really depend on `subsystem-33-0-src-components` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: temp_extraction/src/components/screens/SelectorsScreen.jsx:calls, temp_extraction/src/components/screens/SelectorsScreen.jsx:calls, temp_extraction/src/components/screens/SelectorsScreen.jsx:calls
- LOW: Does `subsystem-143-0-temp-extraction` really depend on `subsystem-77-0-src-components` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: temp_extraction/src/components/screens/SelectorsScreen.jsx:calls, temp_extraction/src/components/screens/SelectorsScreen.jsx:calls, temp_extraction/src/components/screens/SelectorsScreen.jsx:calls
- LOW: Does `subsystem-143-0-temp-extraction` really depend on `subsystem-88-0-src-components` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: temp_extraction/src/components/screens/SelectorsScreen.jsx:calls, temp_extraction/src/components/screens/SelectorsScreen.jsx:calls, temp_extraction/src/components/screens/SelectorsScreen.jsx:calls
- LOW: Does `subsystem-143-0-temp-extraction` really depend on `subsystem-97-0-temp-extraction` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: temp_extraction/src/components/screens/SelectorsScreen.jsx:calls
- LOW: Does `subsystem-144-0-temp-extraction` really depend on `subsystem-29-0-src-components` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: temp_extraction/src/components/Sidebar.jsx:calls
- LOW: Does `subsystem-144-0-temp-extraction` really depend on `subsystem-6-0-src-components` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: temp_extraction/src/components/Sidebar.jsx:calls, temp_extraction/src/components/Sidebar.jsx:imports
- LOW: Does `subsystem-144-0-temp-extraction` really depend on `subsystem-88-0-src-components` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: temp_extraction/src/components/Sidebar.jsx:calls, temp_extraction/src/components/Sidebar.jsx:calls, temp_extraction/src/components/Sidebar.jsx:calls
- LOW: Does `subsystem-146-0-temp-extraction` really depend on `subsystem-103-0-src-components` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: temp_extraction/src/components/ui/MatchMediaReport.jsx:calls, temp_extraction/src/components/ui/MatchMediaReport.jsx:calls, temp_extraction/src/components/ui/MatchMediaReport.jsx:calls
- LOW: Does `subsystem-146-0-temp-extraction` really depend on `subsystem-69-0-src-components` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: temp_extraction/src/components/ui/MatchMediaReport.jsx:calls
- LOW: Does `subsystem-146-0-temp-extraction` really depend on `subsystem-70-0-src-components` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: temp_extraction/src/components/ui/MatchMediaReport.jsx:calls
- LOW: Does `subsystem-146-0-temp-extraction` really depend on `subsystem-88-0-src-components` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: temp_extraction/src/components/ui/MatchMediaReport.jsx:calls
- LOW: Does `subsystem-148-0-temp-extraction` really depend on `subsystem-16-0-src-components` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: temp_extraction/src/engine/validationSchemas.js:calls, temp_extraction/src/engine/validationSchemas.js:calls, temp_extraction/src/engine/validationSchemas.js:calls
- LOW: Does `subsystem-148-0-temp-extraction` really depend on `subsystem-23-0-src-engine` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: temp_extraction/src/engine/validationSchemas.js:calls
- LOW: Does `subsystem-15-0-src-components` really depend on `subsystem-107-0-src-components` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: src/components/screens/TournamentsScreen.jsx:calls
- LOW: Does `subsystem-15-0-src-components` really depend on `subsystem-121-0-src-components` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: src/components/screens/TournamentsScreen.jsx:calls, src/components/screens/TournamentsScreen.jsx:calls
- LOW: Does `subsystem-15-0-src-components` really depend on `subsystem-169-0-src-components` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: src/components/screens/TournamentsScreen.jsx:calls, src/components/screens/TournamentsScreen.jsx:calls
- LOW: Does `subsystem-15-0-src-components` really depend on `subsystem-173-0-src-components` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: src/components/screens/TournamentsScreen.jsx:calls
- LOW: Does `subsystem-15-0-src-components` really depend on `subsystem-2-0-src-components` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: src/components/screens/TournamentsScreen.jsx:calls, src/components/screens/TournamentsScreen.jsx:calls
- LOW: Does `subsystem-15-0-src-components` really depend on `subsystem-22-0-src-components` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: src/components/screens/TournamentsScreen.jsx:calls, src/components/screens/TournamentsScreen.jsx:calls, src/components/screens/TournamentsScreen.jsx:calls
- LOW: Does `subsystem-15-0-src-components` really depend on `subsystem-3-0-src-components` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: src/components/screens/TournamentsScreen.jsx:calls
- LOW: Does `subsystem-15-0-src-components` really depend on `subsystem-6-0-src-components` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: src/components/screens/TournamentsScreen.jsx:calls
- LOW: Does `subsystem-15-0-src-components` really depend on `subsystem-61-0-src-components` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: src/components/screens/TournamentsScreen.jsx:calls
- LOW: Does `subsystem-15-0-src-components` really depend on `subsystem-7-0-src-components` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: src/components/screens/TournamentsScreen.jsx:calls, src/components/screens/TournamentsScreen.jsx:calls, src/components/screens/TournamentsScreen.jsx:calls
- LOW: Does `subsystem-15-0-src-components` really depend on `subsystem-88-0-src-components` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: src/components/screens/TournamentsScreen.jsx:calls, src/components/screens/TournamentsScreen.jsx:calls, src/components/screens/TournamentsScreen.jsx:calls
- LOW: Does `subsystem-16-0-src-components` really depend on `subsystem-176-0-src-components` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: src/components/selection/selectionData.js:calls, src/components/selection/selectionData.js:calls
- LOW: Does `subsystem-18-0-src-lib` really depend on `subsystem-0-0-src-lib` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: src/lib/standings.js:calls
- LOW: Does `subsystem-18-0-src-lib` really depend on `subsystem-16-0-src-components` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: src/lib/standings.js:calls, src/lib/standings.js:calls, src/lib/standings.js:calls
- LOW: Does `subsystem-18-0-src-lib` really depend on `subsystem-176-0-src-components` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: src/lib/standings.js:calls, src/lib/standings.js:calls
- LOW: Does `subsystem-18-0-src-lib` really depend on `subsystem-23-0-src-engine` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: src/lib/standings.js:calls
- LOW: Does `subsystem-18-0-src-lib` really depend on `subsystem-37-0-src-engine` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: src/lib/standings.js:calls
- LOW: Does `subsystem-18-0-src-lib` really depend on `subsystem-67-0-src-lib` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: src/lib/standings.js:calls
- LOW: Does `subsystem-18-0-src-lib` really depend on `subsystem-82-0-delete-season-js` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: src/lib/standings.js:calls
- LOW: Does `subsystem-180-0-src-components` really depend on `subsystem-103-0-src-components` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: src/components/screens/SelectionScreen.jsx:calls
- LOW: Does `subsystem-180-0-src-components` really depend on `subsystem-165-0-src-components` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: src/components/screens/SelectionScreen.jsx:calls
- LOW: Does `subsystem-180-0-src-components` really depend on `subsystem-76-0-src-components` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: src/components/screens/SelectionScreen.jsx:calls, src/components/screens/SelectionScreen.jsx:calls
- LOW: Does `subsystem-181-0-src-components` really depend on `subsystem-172-0-src-components` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: src/components/ui/TournamentManagerModal.jsx:calls
- LOW: Does `subsystem-181-0-src-components` really depend on `subsystem-174-0-src-components` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: src/components/ui/TournamentManagerModal.jsx:calls
- LOW: Does `subsystem-181-0-src-components` really depend on `subsystem-63-0-src-components` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: src/components/ui/TournamentManagerModal.jsx:calls
- LOW: Does `subsystem-19-0-src-components` really depend on `subsystem-103-0-src-components` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: src/components/selection/SelectionWorkspace.jsx:calls, src/components/selection/SelectionWorkspace.jsx:calls, src/components/selection/SelectionWorkspace.jsx:calls
- LOW: Does `subsystem-19-0-src-components` really depend on `subsystem-104-0-src-components` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: src/components/selection/SelectionWorkspace.jsx:calls, src/components/selection/SelectionWorkspace.jsx:calls
- LOW: Does `subsystem-19-0-src-components` really depend on `subsystem-107-0-src-components` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: src/components/selection/SelectionWorkspace.jsx:calls
- LOW: Does `subsystem-19-0-src-components` really depend on `subsystem-124-0-src-components` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: src/components/selection/SelectionWorkspace.jsx:calls
- LOW: Does `subsystem-19-0-src-components` really depend on `subsystem-15-0-src-components` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: src/components/selection/SelectionWorkspace.jsx:calls, src/components/selection/SelectionWorkspace.jsx:calls
- LOW: Does `subsystem-19-0-src-components` really depend on `subsystem-150-0-src-components` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: src/components/selection/SelectionWorkspace.jsx:calls, src/components/selection/SelectionWorkspace.jsx:calls
- LOW: Does `subsystem-19-0-src-components` really depend on `subsystem-2-0-src-components` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: src/components/selection/SelectionWorkspace.jsx:calls, src/components/selection/SelectionWorkspace.jsx:calls, src/components/selection/SelectionWorkspace.jsx:calls
- LOW: Does `subsystem-19-0-src-components` really depend on `subsystem-22-0-src-components` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: src/components/selection/SelectionWorkspace.jsx:calls
- LOW: Does `subsystem-19-0-src-components` really depend on `subsystem-24-0-src-components` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: src/components/selection/SelectionWorkspace.jsx:calls
- LOW: Does `subsystem-19-0-src-components` really depend on `subsystem-29-0-src-components` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: src/components/selection/SelectionWorkspace.jsx:calls
- LOW: Does `subsystem-19-0-src-components` really depend on `subsystem-30-0-src-components` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: src/components/selection/SelectionWorkspace.jsx:calls
- LOW: Does `subsystem-19-0-src-components` really depend on `subsystem-32-0-src-components` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: src/components/selection/SelectionWorkspace.jsx:calls
- LOW: Does `subsystem-19-0-src-components` really depend on `subsystem-33-0-src-components` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: src/components/selection/SelectionWorkspace.jsx:calls, src/components/selection/SelectionWorkspace.jsx:calls, src/components/selection/SelectionWorkspace.jsx:calls
- LOW: Does `subsystem-19-0-src-components` really depend on `subsystem-36-0-src-components` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: src/components/selection/SelectionWorkspace.jsx:calls, src/components/selection/SelectionWorkspace.jsx:calls, src/components/selection/SelectionWorkspace.jsx:calls
- LOW: Does `subsystem-19-0-src-components` really depend on `subsystem-51-0-src-components` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: src/components/selection/SelectionWorkspace.jsx:calls, src/components/selection/SelectionWorkspace.jsx:calls, src/components/selection/SelectionWorkspace.jsx:calls
- LOW: Does `subsystem-19-0-src-components` really depend on `subsystem-7-0-src-components` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: src/components/selection/SelectionWorkspace.jsx:calls
- LOW: Does `subsystem-19-0-src-components` really depend on `subsystem-88-0-src-components` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: src/components/selection/SelectionWorkspace.jsx:calls, src/components/selection/SelectionWorkspace.jsx:calls, src/components/selection/SelectionWorkspace.jsx:calls
- LOW: Does `subsystem-2-0-src-components` really depend on `subsystem-103-0-src-components` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: src/components/screens/ScoringScreen.jsx:calls, temp_extraction/src/components/screens/ScoringScreen.jsx:calls
- LOW: Does `subsystem-2-0-src-components` really depend on `subsystem-121-0-src-components` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: src/components/screens/ScoringScreen.jsx:calls
- LOW: Does `subsystem-2-0-src-components` really depend on `subsystem-122-0-src-components` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: src/components/screens/ScoringScreen.jsx:calls, src/components/screens/ScoringScreen.jsx:calls, src/components/screens/ScoringScreen.jsx:calls
- LOW: Does `subsystem-2-0-src-components` really depend on `subsystem-155-0-src-components` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: src/components/screens/ScoringScreen.jsx:calls, src/components/screens/ScoringScreen.jsx:calls, temp_extraction/src/components/screens/ScoringScreen.jsx:calls
- LOW: Does `subsystem-2-0-src-components` really depend on `subsystem-166-0-src-components` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: src/components/screens/ScoringScreen.jsx:calls, src/components/screens/ScoringScreen.jsx:calls, src/components/screens/ScoringScreen.jsx:calls
- LOW: Does `subsystem-2-0-src-components` really depend on `subsystem-167-0-src-components` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: src/components/screens/ScoringScreen.jsx:calls
- LOW: Does `subsystem-2-0-src-components` really depend on `subsystem-168-0-src-components` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: src/components/screens/ScoringScreen.jsx:calls, temp_extraction/src/components/screens/ScoringScreen.jsx:calls, src/components/screens/ScoringScreen.jsx:calls
- LOW: Does `subsystem-2-0-src-components` really depend on `subsystem-22-0-src-components` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: src/components/screens/ScoringScreen.jsx:calls
- LOW: Does `subsystem-2-0-src-components` really depend on `subsystem-29-0-src-components` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: src/components/screens/ScoringScreen.jsx:calls, src/components/screens/ScoringScreen.jsx:calls, src/components/screens/ScoringScreen.jsx:calls
- LOW: Does `subsystem-2-0-src-components` really depend on `subsystem-56-0-src-components` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: src/components/screens/ScoringScreen.jsx:calls
- LOW: Does `subsystem-2-0-src-components` really depend on `subsystem-6-0-src-components` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: src/components/screens/ScoringScreen.jsx:calls, temp_extraction/src/components/screens/ScoringScreen.jsx:calls
- LOW: Does `subsystem-2-0-src-components` really depend on `subsystem-70-0-src-components` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: src/components/screens/ScoringScreen.jsx:calls, temp_extraction/src/components/screens/ScoringScreen.jsx:calls
- LOW: Does `subsystem-2-0-src-components` really depend on `subsystem-73-0-src-components` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: src/components/screens/ScoringScreen.jsx:calls
- LOW: Does `subsystem-2-0-src-components` really depend on `subsystem-88-0-src-components` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: src/components/screens/ScoringScreen.jsx:calls, src/components/screens/ScoringScreen.jsx:calls, src/components/screens/ScoringScreen.jsx:calls
- LOW: Does `subsystem-20-0-temp-extraction` really depend on `subsystem-0-0-src-lib` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: temp_extraction/src/data/mockData.js:calls, temp_extraction/src/data/mockData.js:calls
- LOW: Does `subsystem-20-0-temp-extraction` really depend on `subsystem-37-0-src-engine` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: temp_extraction/src/data/mockData.js:calls
- LOW: Does `subsystem-21-0-src-components` really depend on `subsystem-121-0-src-components` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: src/components/screens/TeamRegistrationTab.jsx:calls, src/components/screens/TeamRegistrationTab.jsx:calls, src/components/screens/TeamRegistrationTab.jsx:calls
- LOW: Does `subsystem-21-0-src-components` really depend on `subsystem-160-0-src-components` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: src/components/screens/TeamRegistrationTab.jsx:calls, src/components/screens/TeamRegistrationTab.jsx:calls, src/components/screens/TeamRegistrationTab.jsx:calls
- LOW: Does `subsystem-21-0-src-components` really depend on `subsystem-172-0-src-components` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: src/components/screens/TeamRegistrationTab.jsx:calls
- LOW: Does `subsystem-21-0-src-components` really depend on `subsystem-28-0-src-components` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: src/components/screens/TeamRegistrationTab.jsx:calls, src/components/screens/TeamRegistrationTab.jsx:calls, src/components/screens/TeamRegistrationTab.jsx:calls
- LOW: Does `subsystem-21-0-src-components` really depend on `subsystem-39-0-src-components` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: src/components/screens/TeamRegistrationTab.jsx:calls
- LOW: Does `subsystem-21-0-src-components` really depend on `subsystem-6-0-src-components` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: src/components/screens/TeamRegistrationTab.jsx:calls
- LOW: Does `subsystem-21-0-src-components` really depend on `subsystem-7-0-src-components` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: src/components/screens/TeamRegistrationTab.jsx:calls, src/components/screens/TeamRegistrationTab.jsx:calls, src/components/screens/TeamRegistrationTab.jsx:calls
- LOW: Does `subsystem-21-0-src-components` really depend on `subsystem-91-0-src-components` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: src/components/selection/SelectionWorkspace.jsx:calls, src/components/selection/SelectionWorkspace.jsx:calls, src/components/selection/SelectionWorkspace.jsx:calls
- LOW: Does `subsystem-22-0-src-components` really depend on `subsystem-150-0-src-components` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: src/components/screens/HomeScreen.jsx:calls
- LOW: Does `subsystem-22-0-src-components` really depend on `subsystem-155-0-src-components` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: src/components/screens/HomeScreen.jsx:calls, src/components/screens/HomeScreen.jsx:calls
- LOW: Does `subsystem-22-0-src-components` really depend on `subsystem-156-0-src-components` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: src/components/screens/HomeScreen.jsx:calls, src/components/screens/HomeScreen.jsx:calls
- LOW: Does `subsystem-22-0-src-components` really depend on `subsystem-157-0-src-components` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: src/components/screens/HomeScreen.jsx:calls
- LOW: Does `subsystem-22-0-src-components` really depend on `subsystem-2-0-src-components` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: src/components/screens/HomeScreen.jsx:calls, src/components/screens/HomeScreen.jsx:calls, src/components/screens/HomeScreen.jsx:calls
- LOW: Does `subsystem-22-0-src-components` really depend on `subsystem-29-0-src-components` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: src/components/screens/HomeScreen.jsx:calls, src/components/screens/HomeScreen.jsx:calls, src/components/screens/HomeScreen.jsx:calls
- LOW: Does `subsystem-22-0-src-components` really depend on `subsystem-35-0-src-components` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: src/components/screens/HomeScreen.jsx:calls
- LOW: Does `subsystem-22-0-src-components` really depend on `subsystem-88-0-src-components` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: src/components/screens/HomeScreen.jsx:calls, src/components/screens/HomeScreen.jsx:calls, src/components/screens/HomeScreen.jsx:calls
- LOW: Does `subsystem-23-0-src-engine` really depend on `subsystem-16-0-src-components` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: src/engine/cricketStateMachine.js:calls, temp_extraction/src/engine/cricketStateMachine.js:calls, src/engine/cricketStateMachine.js:calls
- LOW: Does `subsystem-24-0-src-components` really depend on `subsystem-104-0-src-components` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: src/components/screens/TeamRegistrationTab.jsx:calls, src/components/screens/TeamRegistrationTab.jsx:calls, src/components/screens/TeamRegistrationTab.jsx:calls
- LOW: Does `subsystem-24-0-src-components` really depend on `subsystem-106-0-src-components` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: src/components/screens/TeamRegistrationTab.jsx:calls
- LOW: Does `subsystem-24-0-src-components` really depend on `subsystem-121-0-src-components` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: src/components/screens/TeamRegistrationTab.jsx:calls
- LOW: Does `subsystem-24-0-src-components` really depend on `subsystem-150-0-src-components` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: src/components/screens/TeamRegistrationTab.jsx:calls
- LOW: Does `subsystem-24-0-src-components` really depend on `subsystem-160-0-src-components` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: src/components/screens/TeamRegistrationTab.jsx:calls, src/components/screens/TeamRegistrationTab.jsx:calls
- LOW: Does `subsystem-24-0-src-components` really depend on `subsystem-162-0-src-components` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: src/components/screens/TeamRegistrationTab.jsx:calls
- LOW: Does `subsystem-24-0-src-components` really depend on `subsystem-171-0-src-components` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: src/components/screens/TeamRegistrationTab.jsx:calls
- LOW: Does `subsystem-24-0-src-components` really depend on `subsystem-28-0-src-components` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: src/components/screens/TeamRegistrationTab.jsx:calls, src/components/screens/TeamRegistrationTab.jsx:calls
- LOW: Does `subsystem-24-0-src-components` really depend on `subsystem-31-0-src-components` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: src/components/screens/TeamRegistrationTab.jsx:calls
- LOW: Does `subsystem-24-0-src-components` really depend on `subsystem-32-0-src-components` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: src/components/screens/TeamRegistrationTab.jsx:calls, src/components/screens/TeamRegistrationTab.jsx:calls, src/components/screens/TeamRegistrationTab.jsx:calls
- LOW: Does `subsystem-24-0-src-components` really depend on `subsystem-88-0-src-components` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: src/components/screens/TeamRegistrationTab.jsx:calls, src/components/screens/TeamRegistrationTab.jsx:calls, src/components/screens/TeamRegistrationTab.jsx:calls
- LOW: Does `subsystem-25-0-src-main-jsx` really depend on `subsystem-121-0-src-components` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: src/main.jsx:calls, temp_extraction/src/main.jsx:calls
- LOW: Does `subsystem-25-0-src-main-jsx` really depend on `subsystem-29-0-src-components` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: src/main.jsx:calls, temp_extraction/src/main.jsx:calls
- LOW: Does `subsystem-25-0-src-main-jsx` really depend on `subsystem-66-0-src-components` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: src/main.jsx:calls
- LOW: Does `subsystem-26-0-temp-extraction` really depend on `subsystem-104-0-src-components` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: temp_extraction/src/components/screens/PlayersScreen.jsx:calls, temp_extraction/src/components/screens/PlayersScreen.jsx:calls, temp_extraction/src/components/screens/PlayersScreen.jsx:calls
- LOW: Does `subsystem-26-0-temp-extraction` really depend on `subsystem-106-0-src-components` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: temp_extraction/src/components/screens/PlayersScreen.jsx:calls
- LOW: Does `subsystem-26-0-temp-extraction` really depend on `subsystem-150-0-src-components` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: temp_extraction/src/components/screens/PlayersScreen.jsx:calls, temp_extraction/src/components/screens/PlayersScreen.jsx:calls, temp_extraction/src/components/screens/PlayersScreen.jsx:calls
- LOW: Does `subsystem-26-0-temp-extraction` really depend on `subsystem-153-0-src-components` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: temp_extraction/src/components/screens/PlayersScreen.jsx:calls
- LOW: Does `subsystem-26-0-temp-extraction` really depend on `subsystem-159-0-src-components` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: temp_extraction/src/components/screens/PlayersScreen.jsx:calls
- LOW: Does `subsystem-26-0-temp-extraction` really depend on `subsystem-161-0-src-components` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: temp_extraction/src/components/screens/PlayersScreen.jsx:calls, temp_extraction/src/components/screens/PlayersScreen.jsx:calls
- LOW: Does `subsystem-26-0-temp-extraction` really depend on `subsystem-162-0-src-components` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: temp_extraction/src/components/screens/PlayersScreen.jsx:calls
- LOW: Does `subsystem-26-0-temp-extraction` really depend on `subsystem-169-0-src-components` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: temp_extraction/src/components/screens/PlayersScreen.jsx:calls, temp_extraction/src/components/screens/PlayersScreen.jsx:calls, temp_extraction/src/components/screens/PlayersScreen.jsx:calls
- LOW: Does `subsystem-26-0-temp-extraction` really depend on `subsystem-179-0-temp-extraction` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: temp_extraction/src/components/screens/PlayersScreen.jsx:calls
- LOW: Does `subsystem-26-0-temp-extraction` really depend on `subsystem-2-0-src-components` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: temp_extraction/src/components/screens/PlayersScreen.jsx:calls
- LOW: Does `subsystem-26-0-temp-extraction` really depend on `subsystem-29-0-src-components` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: temp_extraction/src/components/screens/PlayersScreen.jsx:calls
- LOW: Does `subsystem-26-0-temp-extraction` really depend on `subsystem-3-0-src-components` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: temp_extraction/src/components/screens/PlayersScreen.jsx:calls, temp_extraction/src/components/screens/PlayersScreen.jsx:calls, temp_extraction/src/components/screens/PlayersScreen.jsx:calls
- LOW: Does `subsystem-26-0-temp-extraction` really depend on `subsystem-30-0-src-components` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: temp_extraction/src/components/screens/PlayersScreen.jsx:calls, temp_extraction/src/components/screens/PlayersScreen.jsx:calls, temp_extraction/src/components/screens/PlayersScreen.jsx:calls
- LOW: Does `subsystem-26-0-temp-extraction` really depend on `subsystem-33-0-src-components` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: temp_extraction/src/components/screens/PlayersScreen.jsx:calls, temp_extraction/src/components/screens/PlayersScreen.jsx:calls
- LOW: Does `subsystem-26-0-temp-extraction` really depend on `subsystem-36-0-src-components` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: temp_extraction/src/components/screens/PlayersScreen.jsx:calls
- LOW: Does `subsystem-26-0-temp-extraction` really depend on `subsystem-59-0-temp-extraction` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: temp_extraction/src/components/screens/PlayersScreen.jsx:calls, temp_extraction/src/components/screens/PlayersScreen.jsx:calls
- LOW: Does `subsystem-26-0-temp-extraction` really depend on `subsystem-65-0-src-components` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: temp_extraction/src/components/screens/PlayersScreen.jsx:calls
- LOW: Does `subsystem-26-0-temp-extraction` really depend on `subsystem-77-0-src-components` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: temp_extraction/src/components/screens/PlayersScreen.jsx:calls, temp_extraction/src/components/screens/PlayersScreen.jsx:calls
- LOW: Does `subsystem-26-0-temp-extraction` really depend on `subsystem-88-0-src-components` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: temp_extraction/src/components/screens/PlayersScreen.jsx:calls, temp_extraction/src/components/screens/PlayersScreen.jsx:calls, temp_extraction/src/components/screens/PlayersScreen.jsx:calls
- LOW: Does `subsystem-28-0-src-components` really depend on `subsystem-102-0-src-components` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: src/components/NotificationPrompt.jsx:calls, src/components/NotificationPrompt.jsx:calls, src/components/NotificationPrompt.jsx:calls
- LOW: Does `subsystem-28-0-src-components` really depend on `subsystem-121-0-src-components` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: src/components/NotificationPrompt.jsx:calls, src/components/NotificationPrompt.jsx:calls, src/components/NotificationPrompt.jsx:calls
- LOW: Does `subsystem-28-0-src-components` really depend on `subsystem-153-0-src-components` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: src/components/NotificationPrompt.jsx:calls
- LOW: Does `subsystem-28-0-src-components` really depend on `subsystem-88-0-src-components` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: src/components/NotificationPrompt.jsx:calls, src/components/NotificationPrompt.jsx:calls, src/components/NotificationPrompt.jsx:calls
- LOW: Does `subsystem-28-0-src-components` really depend on `subsystem-9-0-src-components` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: src/components/NotificationPrompt.jsx:calls
- LOW: Does `subsystem-3-0-src-components` really depend on `subsystem-103-0-src-components` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: src/components/screens/InningsInitScreen.jsx:calls, src/components/screens/InningsInitScreen.jsx:calls, src/components/screens/InningsInitScreen.jsx:calls
- LOW: Does `subsystem-3-0-src-components` really depend on `subsystem-104-0-src-components` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: src/components/screens/MatchSetupScreen.jsx:calls, src/components/screens/MatchSetupScreen.jsx:calls, src/components/screens/MatchSetupScreen.jsx:calls
- LOW: Does `subsystem-3-0-src-components` really depend on `subsystem-11-0-src-components` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: src/components/screens/MatchSetupScreen.jsx:calls
- LOW: Does `subsystem-3-0-src-components` really depend on `subsystem-121-0-src-components` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: src/components/screens/MatchSetupScreen.jsx:calls, src/components/screens/MatchSetupScreen.jsx:calls
- LOW: Does `subsystem-3-0-src-components` really depend on `subsystem-123-0-src-components` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: src/components/screens/MatchSetupScreen.jsx:calls, src/components/screens/MatchSetupScreen.jsx:calls, src/components/screens/MatchSetupScreen.jsx:calls
- LOW: Does `subsystem-3-0-src-components` really depend on `subsystem-150-0-src-components` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: src/components/screens/MatchSetupScreen.jsx:calls, src/components/screens/MatchSetupScreen.jsx:calls
- LOW: Does `subsystem-3-0-src-components` really depend on `subsystem-159-0-src-components` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: src/components/screens/InningsInitScreen.jsx:calls, src/components/screens/MatchSetupScreen.jsx:calls
- LOW: Does `subsystem-3-0-src-components` really depend on `subsystem-160-0-src-components` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: src/components/screens/MatchSetupScreen.jsx:calls
- LOW: Does `subsystem-3-0-src-components` really depend on `subsystem-167-0-src-components` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: temp_extraction/src/components/screens/MatchSetupScreen.jsx:calls
- LOW: Does `subsystem-3-0-src-components` really depend on `subsystem-2-0-src-components` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: src/components/screens/InningsInitScreen.jsx:calls, src/components/screens/MatchSetupScreen.jsx:calls, src/components/screens/MatchSetupScreen.jsx:calls
- LOW: Does `subsystem-3-0-src-components` really depend on `subsystem-24-0-src-components` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: temp_extraction/src/components/screens/MatchSetupScreen.jsx:calls, temp_extraction/src/components/screens/MatchSetupScreen.jsx:calls
- LOW: Does `subsystem-3-0-src-components` really depend on `subsystem-30-0-src-components` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: temp_extraction/src/components/screens/MatchSetupScreen.jsx:calls, temp_extraction/src/components/screens/MatchSetupScreen.jsx:calls, temp_extraction/src/components/screens/MatchSetupScreen.jsx:calls
- LOW: Does `subsystem-3-0-src-components` really depend on `subsystem-32-0-src-components` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: temp_extraction/src/components/screens/MatchSetupScreen.jsx:calls
- LOW: Does `subsystem-3-0-src-components` really depend on `subsystem-61-0-src-components` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: src/components/screens/MatchSetupScreen.jsx:calls, temp_extraction/src/components/screens/MatchSetupScreen.jsx:calls
- LOW: Does `subsystem-3-0-src-components` really depend on `subsystem-69-0-src-components` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: src/components/screens/MatchSetupScreen.jsx:calls
- LOW: Does `subsystem-3-0-src-components` really depend on `subsystem-7-0-src-components` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: src/components/screens/InningsInitScreen.jsx:calls, src/components/screens/InningsInitScreen.jsx:calls, src/components/screens/MatchSetupScreen.jsx:calls
- LOW: Does `subsystem-3-0-src-components` really depend on `subsystem-75-0-src-components` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: src/components/screens/MatchSetupScreen.jsx:calls
- LOW: Does `subsystem-3-0-src-components` really depend on `subsystem-88-0-src-components` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: src/components/screens/InningsInitScreen.jsx:calls, src/components/screens/InningsInitScreen.jsx:calls, src/components/screens/InningsInitScreen.jsx:calls
- LOW: Does `subsystem-30-0-src-components` really depend on `subsystem-104-0-src-components` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: src/components/screens/SelectionScreen.jsx:calls, src/components/screens/SelectionScreen.jsx:calls, src/components/screens/SelectionScreen.jsx:calls
- LOW: Does `subsystem-30-0-src-components` really depend on `subsystem-106-0-src-components` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: src/components/screens/SelectionScreen.jsx:calls
- LOW: Does `subsystem-30-0-src-components` really depend on `subsystem-150-0-src-components` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: src/components/screens/SelectionScreen.jsx:calls, src/components/screens/SelectionScreen.jsx:calls, src/components/screens/SelectionScreen.jsx:calls
- LOW: Does `subsystem-30-0-src-components` really depend on `subsystem-161-0-src-components` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: src/components/screens/SelectionScreen.jsx:calls
- LOW: Does `subsystem-30-0-src-components` really depend on `subsystem-162-0-src-components` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: src/components/screens/SelectionScreen.jsx:calls
- LOW: Does `subsystem-30-0-src-components` really depend on `subsystem-167-0-src-components` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: src/components/screens/SelectionScreen.jsx:calls
- LOW: Does `subsystem-30-0-src-components` really depend on `subsystem-33-0-src-components` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: src/components/screens/SelectionScreen.jsx:calls, src/components/screens/SelectionScreen.jsx:calls, src/components/screens/SelectionScreen.jsx:calls
- LOW: Does `subsystem-30-0-src-components` really depend on `subsystem-54-0-src-components` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: src/components/screens/SelectionScreen.jsx:calls
- LOW: Does `subsystem-30-0-src-components` really depend on `subsystem-88-0-src-components` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: src/components/screens/SelectionScreen.jsx:calls, src/components/screens/SelectionScreen.jsx:calls, src/components/screens/SelectionScreen.jsx:calls
- LOW: Does `subsystem-31-0-src-components` really depend on `subsystem-121-0-src-components` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: src/components/screens/SelectorAssignmentModal.jsx:calls, src/components/screens/SelectorAssignmentModal.jsx:calls, src/components/screens/SelectorAssignmentModal.jsx:calls
- LOW: Does `subsystem-31-0-src-components` really depend on `subsystem-123-0-src-components` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: src/components/screens/SelectorAssignmentModal.jsx:calls, src/components/screens/SelectorAssignmentModal.jsx:calls
- LOW: Does `subsystem-31-0-src-components` really depend on `subsystem-169-0-src-components` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: src/components/screens/SelectorAssignmentModal.jsx:calls, src/components/screens/SelectorAssignmentModal.jsx:calls
- LOW: Does `subsystem-31-0-src-components` really depend on `subsystem-170-0-src-components` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: src/components/screens/SelectorAssignmentModal.jsx:calls
- LOW: Does `subsystem-31-0-src-components` really depend on `subsystem-7-0-src-components` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: src/components/screens/SelectorAssignmentModal.jsx:calls, src/components/screens/SelectorAssignmentModal.jsx:calls, src/components/screens/SelectorAssignmentModal.jsx:calls
- LOW: Does `subsystem-31-0-src-components` really depend on `subsystem-73-0-src-components` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: src/components/screens/SelectorAssignmentModal.jsx:calls
- LOW: Does `subsystem-31-0-src-components` really depend on `subsystem-88-0-src-components` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: src/components/screens/SelectorAssignmentModal.jsx:calls, src/components/screens/SelectorAssignmentModal.jsx:calls, src/components/screens/SelectorAssignmentModal.jsx:calls
- LOW: Does `subsystem-32-0-src-components` really depend on `subsystem-104-0-src-components` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: src/components/screens/PlayersScreen.jsx:calls, src/components/screens/PlayersScreen.jsx:calls, src/components/screens/PlayersScreen.jsx:calls
- LOW: Does `subsystem-32-0-src-components` really depend on `subsystem-124-0-src-components` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: src/components/screens/TeamsScreen.jsx:calls
- LOW: Does `subsystem-32-0-src-components` really depend on `subsystem-150-0-src-components` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: src/components/screens/PlayersScreen.jsx:calls, src/components/screens/PlayersScreen.jsx:calls
- LOW: Does `subsystem-32-0-src-components` really depend on `subsystem-153-0-src-components` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: src/components/screens/PlayersScreen.jsx:calls, src/components/screens/PlayersScreen.jsx:calls
- LOW: Does `subsystem-32-0-src-components` really depend on `subsystem-156-0-src-components` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: src/components/screens/PlayersScreen.jsx:calls
- LOW: Does `subsystem-32-0-src-components` really depend on `subsystem-162-0-src-components` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: src/components/screens/PlayersScreen.jsx:calls
- LOW: Does `subsystem-32-0-src-components` really depend on `subsystem-165-0-src-components` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: src/components/screens/PlayersScreen.jsx:calls, src/components/screens/ScoutingHubScreen.jsx:calls, src/components/screens/SelectionScreen.jsx:calls
- LOW: Does `subsystem-32-0-src-components` really depend on `subsystem-3-0-src-components` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: src/components/screens/PlayersScreen.jsx:calls, src/components/screens/PlayersScreen.jsx:calls
- LOW: Does `subsystem-32-0-src-components` really depend on `subsystem-88-0-src-components` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: src/components/screens/PlayersScreen.jsx:calls, src/components/screens/PlayersScreen.jsx:calls, src/components/screens/PlayersScreen.jsx:calls
- LOW: Does `subsystem-33-0-src-components` really depend on `subsystem-104-0-src-components` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: src/components/screens/ScoutingHubScreen.jsx:calls, src/components/screens/ScoutingHubScreen.jsx:calls, src/components/screens/ScoutingHubScreen.jsx:calls
- LOW: Does `subsystem-33-0-src-components` really depend on `subsystem-150-0-src-components` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: src/components/screens/ScoutingHubScreen.jsx:calls, src/components/screens/ScoutingHubScreen.jsx:calls, src/components/screens/ScoutingHubScreen.jsx:calls
- LOW: Does `subsystem-33-0-src-components` really depend on `subsystem-161-0-src-components` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: src/components/screens/ScoutingHubScreen.jsx:calls
- LOW: Does `subsystem-33-0-src-components` really depend on `subsystem-29-0-src-components` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: src/components/screens/ScoutingHubScreen.jsx:calls
- LOW: Does `subsystem-33-0-src-components` really depend on `subsystem-88-0-src-components` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: src/components/screens/ScoutingHubScreen.jsx:calls, src/components/screens/ScoutingHubScreen.jsx:calls, src/components/screens/ScoutingHubScreen.jsx:calls
- LOW: Does `subsystem-34-0-src-components` really depend on `subsystem-121-0-src-components` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: src/components/screens/SeasonManagementTab.jsx:calls, src/components/screens/SeasonManagementTab.jsx:calls, src/components/screens/SeasonManagementTab.jsx:calls
- LOW: Does `subsystem-34-0-src-components` really depend on `subsystem-29-0-src-components` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: src/components/screens/SeasonManagementTab.jsx:calls
- LOW: Does `subsystem-34-0-src-components` really depend on `subsystem-39-0-src-components` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: src/components/screens/SeasonManagementTab.jsx:calls, src/components/screens/SeasonManagementTab.jsx:calls, src/components/screens/SeasonManagementTab.jsx:calls
- LOW: Does `subsystem-34-0-src-components` really depend on `subsystem-7-0-src-components` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: src/components/screens/SeasonManagementTab.jsx:calls, src/components/screens/SeasonManagementTab.jsx:calls, src/components/screens/SeasonManagementTab.jsx:calls
- LOW: Does `subsystem-34-0-src-components` really depend on `subsystem-73-0-src-components` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: src/components/screens/SeasonManagementTab.jsx:calls, src/components/screens/SeasonManagementTab.jsx:calls
- LOW: Does `subsystem-34-0-src-components` really depend on `subsystem-88-0-src-components` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: src/components/screens/SeasonManagementTab.jsx:calls, src/components/screens/SeasonManagementTab.jsx:calls, src/components/screens/SeasonManagementTab.jsx:calls
- LOW: Does `subsystem-35-0-src-components` really depend on `subsystem-151-0-src-components` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: src/components/CricketIllustrations.jsx:calls, temp_extraction/src/components/CricketIllustrations.jsx:calls
- LOW: Does `subsystem-36-0-src-components` really depend on `subsystem-88-0-src-components` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: src/components/ui/DataTable.jsx:calls, src/components/ui/DataTable.jsx:calls, temp_extraction/src/components/ui/DataTable.jsx:calls
- LOW: Does `subsystem-37-0-src-engine` really depend on `subsystem-16-0-src-components` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: src/engine/derivedScorecard.js:calls, src/engine/derivedScorecard.js:calls, src/engine/derivedScorecard.js:calls
- LOW: Does `subsystem-38-0-src-sw-js` really depend on `subsystem-27-0-apply-bug5-sql-js` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: src/sw.js:calls
- LOW: Does `subsystem-39-0-src-components` really depend on `subsystem-121-0-src-components` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: src/components/screens/NewsScreen.jsx:calls, src/components/screens/NewsScreen.jsx:calls
- LOW: Does `subsystem-39-0-src-components` really depend on `subsystem-123-0-src-components` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: src/components/screens/NewsScreen.jsx:calls, src/components/screens/NewsScreen.jsx:calls
- LOW: Does `subsystem-39-0-src-components` really depend on `subsystem-22-0-src-components` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: src/components/screens/NewsScreen.jsx:calls
- LOW: Does `subsystem-39-0-src-components` really depend on `subsystem-3-0-src-components` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: src/components/screens/NewsScreen.jsx:calls
- LOW: Does `subsystem-39-0-src-components` really depend on `subsystem-6-0-src-components` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: src/components/screens/NewsScreen.jsx:calls
- LOW: Does `subsystem-39-0-src-components` really depend on `subsystem-7-0-src-components` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: src/components/screens/NewsScreen.jsx:calls, src/components/screens/NewsScreen.jsx:calls
- LOW: Does `subsystem-39-0-src-components` really depend on `subsystem-88-0-src-components` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: src/components/screens/NewsScreen.jsx:calls, src/components/screens/NewsScreen.jsx:calls, src/components/screens/NewsScreen.jsx:calls
- LOW: Does `subsystem-40-0-src-components` really depend on `subsystem-121-0-src-components` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: src/components/screens/RecycleBinTab.jsx:calls, src/components/screens/RecycleBinTab.jsx:calls, src/components/screens/RecycleBinTab.jsx:calls
- LOW: Does `subsystem-40-0-src-components` really depend on `subsystem-39-0-src-components` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: src/components/screens/RecycleBinTab.jsx:calls
- LOW: Does `subsystem-40-0-src-components` really depend on `subsystem-7-0-src-components` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: src/components/screens/RecycleBinTab.jsx:calls, src/components/screens/RecycleBinTab.jsx:calls, src/components/screens/RecycleBinTab.jsx:calls
- LOW: Does `subsystem-40-0-src-components` really depend on `subsystem-73-0-src-components` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: src/components/screens/RecycleBinTab.jsx:calls, src/components/screens/RecycleBinTab.jsx:calls
- LOW: Does `subsystem-40-0-src-components` really depend on `subsystem-88-0-src-components` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: src/components/screens/RecycleBinTab.jsx:calls, src/components/screens/RecycleBinTab.jsx:calls, src/components/screens/RecycleBinTab.jsx:calls
- LOW: Does `subsystem-41-0-src-lib` really depend on `subsystem-27-0-apply-bug5-sql-js` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: src/lib/db.js:calls
- LOW: Does `subsystem-42-0-temp-extraction` really depend on `subsystem-103-0-src-components` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: temp_extraction/src/components/screens/MatchesScreen.jsx:calls, temp_extraction/src/components/screens/MatchesScreen.jsx:calls
- LOW: Does `subsystem-42-0-temp-extraction` really depend on `subsystem-150-0-src-components` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: temp_extraction/src/components/screens/MatchesScreen.jsx:calls
- LOW: Does `subsystem-42-0-temp-extraction` really depend on `subsystem-173-0-src-components` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: temp_extraction/src/components/screens/MatchesScreen.jsx:calls
- LOW: Does `subsystem-42-0-temp-extraction` really depend on `subsystem-2-0-src-components` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: temp_extraction/src/components/screens/MatchesScreen.jsx:calls
- LOW: Does `subsystem-42-0-temp-extraction` really depend on `subsystem-22-0-src-components` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: temp_extraction/src/components/screens/MatchesScreen.jsx:calls
- LOW: Does `subsystem-42-0-temp-extraction` really depend on `subsystem-3-0-src-components` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: temp_extraction/src/components/screens/MatchesScreen.jsx:calls, temp_extraction/src/components/screens/MatchesScreen.jsx:calls
- LOW: Does `subsystem-42-0-temp-extraction` really depend on `subsystem-6-0-src-components` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: temp_extraction/src/components/screens/MatchesScreen.jsx:calls
- LOW: Does `subsystem-42-0-temp-extraction` really depend on `subsystem-88-0-src-components` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: temp_extraction/src/components/screens/MatchesScreen.jsx:calls, temp_extraction/src/components/screens/MatchesScreen.jsx:calls, temp_extraction/src/components/screens/MatchesScreen.jsx:calls
- LOW: Does `subsystem-44-0-src-components` really depend on `subsystem-122-0-src-components` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: src/components/selection/PlayerPool.jsx:calls, src/components/selection/PlayerPool.jsx:calls
- LOW: Does `subsystem-44-0-src-components` really depend on `subsystem-159-0-src-components` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: src/components/selection/PlayerPool.jsx:calls
- LOW: Does `subsystem-44-0-src-components` really depend on `subsystem-169-0-src-components` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: src/components/selection/PlayerPool.jsx:calls
- LOW: Does `subsystem-44-0-src-components` really depend on `subsystem-88-0-src-components` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: src/components/selection/PlayerPool.jsx:calls
- LOW: Does `subsystem-44-0-src-components` really depend on `subsystem-94-0-src-components` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: src/components/selection/PlayerPool.jsx:calls, src/components/selection/PlayerPool.jsx:calls
- LOW: Does `subsystem-45-0-src-components` really depend on `subsystem-123-0-src-components` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: src/components/ui/TournamentManagerModal.jsx:calls
- LOW: Does `subsystem-45-0-src-components` really depend on `subsystem-171-0-src-components` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: src/components/ui/TournamentManagerModal.jsx:calls
- LOW: Does `subsystem-45-0-src-components` really depend on `subsystem-2-0-src-components` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: src/components/ui/TournamentManagerModal.jsx:calls, src/components/ui/TournamentManagerModal.jsx:calls
- LOW: Does `subsystem-45-0-src-components` really depend on `subsystem-3-0-src-components` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: src/components/ui/TournamentManagerModal.jsx:calls
- LOW: Does `subsystem-45-0-src-components` really depend on `subsystem-34-0-src-components` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: src/components/ui/TournamentManagerModal.jsx:calls
- LOW: Does `subsystem-45-0-src-components` really depend on `subsystem-6-0-src-components` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: src/components/ui/TournamentManagerModal.jsx:calls
- LOW: Does `subsystem-45-0-src-components` really depend on `subsystem-7-0-src-components` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: src/components/ui/TournamentManagerModal.jsx:calls, src/components/ui/TournamentManagerModal.jsx:calls, src/components/ui/TournamentManagerModal.jsx:calls
- LOW: Does `subsystem-45-0-src-components` really depend on `subsystem-88-0-src-components` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: src/components/ui/TournamentManagerModal.jsx:calls, src/components/ui/TournamentManagerModal.jsx:calls, src/components/ui/TournamentManagerModal.jsx:calls
- LOW: Does `subsystem-47-0-src-components` really depend on `subsystem-152-0-src-components` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: src/components/DrawerMenu.jsx:calls, src/components/Sidebar.jsx:calls, temp_extraction/src/components/DrawerMenu.jsx:calls
- LOW: Does `subsystem-47-0-src-components` really depend on `subsystem-29-0-src-components` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: src/components/DrawerMenu.jsx:calls, src/components/DrawerMenu.jsx:calls, src/components/DrawerMenu.jsx:calls
- LOW: Does `subsystem-47-0-src-components` really depend on `subsystem-88-0-src-components` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: src/components/DrawerMenu.jsx:calls, src/components/DrawerMenu.jsx:calls, src/components/DrawerMenu.jsx:calls
- LOW: Does `subsystem-48-0-src-components` really depend on `subsystem-169-0-src-components` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: src/components/selection/TeamSelectionDashboard.jsx:calls, src/components/selection/TeamSelectionDashboard.jsx:calls
- LOW: Does `subsystem-48-0-src-components` really depend on `subsystem-2-0-src-components` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: src/components/selection/TeamSelectionDashboard.jsx:calls
- LOW: Does `subsystem-48-0-src-components` really depend on `subsystem-51-0-src-components` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: src/components/selection/TeamSelectionDashboard.jsx:calls
- LOW: Does `subsystem-48-0-src-components` really depend on `subsystem-88-0-src-components` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: src/components/selection/TeamSelectionDashboard.jsx:calls, src/components/selection/TeamSelectionDashboard.jsx:calls
- LOW: Does `subsystem-48-0-src-components` really depend on `subsystem-94-0-src-components` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: src/components/selection/TeamSelectionDashboard.jsx:calls
- LOW: Does `subsystem-49-0-src-engine` really depend on `subsystem-23-0-src-engine` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: src/engine/matchHighlights.js:calls, src/engine/matchHighlights.js:calls
- LOW: Does `subsystem-49-0-src-engine` really depend on `subsystem-37-0-src-engine` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: src/engine/matchHighlights.js:calls, src/engine/matchHighlights.js:calls, src/engine/matchHighlights.js:calls
- LOW: Does `subsystem-5-0-src-context` really depend on `subsystem-105-0-src-components` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: src/context/CricketContext.jsx:calls, src/context/CricketContext.jsx:calls
- LOW: Does `subsystem-5-0-src-context` really depend on `subsystem-121-0-src-components` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: src/context/CricketContext.jsx:calls, src/context/CricketContext.jsx:calls, src/context/CricketContext.jsx:calls
- LOW: Does `subsystem-5-0-src-context` really depend on `subsystem-152-0-src-components` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: src/context/CricketContext.jsx:calls, src/context/CricketContext.jsx:calls, src/context/CricketContext.jsx:calls
- LOW: Does `subsystem-5-0-src-context` really depend on `subsystem-154-0-src-components` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: src/context/CricketContext.jsx:calls, src/context/CricketContext.jsx:calls
- LOW: Does `subsystem-5-0-src-context` really depend on `subsystem-160-0-src-components` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: src/context/CricketContext.jsx:calls, src/context/CricketContext.jsx:calls, src/context/CricketContext.jsx:calls
- LOW: Does `subsystem-5-0-src-context` really depend on `subsystem-165-0-src-components` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: src/context/CricketContext.jsx:calls, src/context/CricketContext.jsx:calls
- LOW: Does `subsystem-5-0-src-context` really depend on `subsystem-2-0-src-components` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: src/context/CricketContext.jsx:calls
- LOW: Does `subsystem-5-0-src-context` really depend on `subsystem-21-0-src-components` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: src/context/CricketContext.jsx:calls, src/context/CricketContext.jsx:calls, src/context/CricketContext.jsx:calls
- LOW: Does `subsystem-5-0-src-context` really depend on `subsystem-28-0-src-components` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: src/context/CricketContext.jsx:calls, src/context/CricketContext.jsx:calls, src/context/CricketContext.jsx:calls
- LOW: Does `subsystem-5-0-src-context` really depend on `subsystem-31-0-src-components` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: src/context/CricketContext.jsx:calls, src/context/CricketContext.jsx:calls
- LOW: Does `subsystem-5-0-src-context` really depend on `subsystem-39-0-src-components` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: src/context/CricketContext.jsx:calls
- LOW: Does `subsystem-5-0-src-context` really depend on `subsystem-56-0-src-components` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: src/context/CricketContext.jsx:calls
- LOW: Does `subsystem-5-0-src-context` really depend on `subsystem-66-0-src-components` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: src/context/CricketContext.jsx:calls, src/context/CricketContext.jsx:calls, src/context/CricketContext.jsx:calls
- LOW: Does `subsystem-5-0-src-context` really depend on `subsystem-7-0-src-components` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: src/context/CricketContext.jsx:calls, src/context/CricketContext.jsx:calls, src/context/CricketContext.jsx:calls
- LOW: Does `subsystem-5-0-src-context` really depend on `subsystem-70-0-src-components` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: src/context/CricketContext.jsx:calls
- LOW: Does `subsystem-5-0-src-context` really depend on `subsystem-92-0-src-context` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: src/context/CricketContext.jsx:calls
- LOW: Does `subsystem-50-0-temp-extraction` really depend on `subsystem-13-0-src-engine` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: temp_extraction/src/engine/matchSummaryEngine.js:calls
- LOW: Does `subsystem-50-0-temp-extraction` really depend on `subsystem-16-0-src-components` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: temp_extraction/src/engine/matchSummaryEngine.js:calls, temp_extraction/src/engine/matchSummaryEngine.js:calls
- LOW: Does `subsystem-50-0-temp-extraction` really depend on `subsystem-23-0-src-engine` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: temp_extraction/src/engine/matchSummaryEngine.js:calls
- LOW: Does `subsystem-50-0-temp-extraction` really depend on `subsystem-67-0-src-lib` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: temp_extraction/src/engine/matchSummaryEngine.js:calls, temp_extraction/src/engine/matchSummaryEngine.js:calls
- LOW: Does `subsystem-51-0-src-components` really depend on `subsystem-150-0-src-components` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: src/components/selection/SelectedTeam.jsx:calls, src/components/selection/SelectedTeam.jsx:calls
- LOW: Does `subsystem-51-0-src-components` really depend on `subsystem-159-0-src-components` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: src/components/selection/SelectedTeam.jsx:calls
- LOW: Does `subsystem-51-0-src-components` really depend on `subsystem-169-0-src-components` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: src/components/selection/SelectedTeam.jsx:calls
- LOW: Does `subsystem-51-0-src-components` really depend on `subsystem-88-0-src-components` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: src/components/selection/SelectedTeam.jsx:calls, src/components/selection/SelectedTeam.jsx:calls
- LOW: Does `subsystem-53-0-src-app-jsx` really depend on `subsystem-149-0-src-app-jsx` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: src/App.jsx:calls
- LOW: Does `subsystem-54-0-src-components` really depend on `subsystem-103-0-src-components` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: src/components/screens/MatchesScreen.jsx:calls, src/components/screens/MatchesScreen.jsx:calls
- LOW: Does `subsystem-54-0-src-components` really depend on `subsystem-150-0-src-components` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: src/components/screens/MatchesScreen.jsx:calls, src/components/screens/MatchesScreen.jsx:calls, src/components/screens/MatchesScreen.jsx:calls
- LOW: Does `subsystem-54-0-src-components` really depend on `subsystem-22-0-src-components` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: src/components/screens/MatchesScreen.jsx:calls, src/components/screens/MatchesScreen.jsx:calls, src/components/screens/MatchesScreen.jsx:calls
- LOW: Does `subsystem-54-0-src-components` really depend on `subsystem-3-0-src-components` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: src/components/screens/MatchesScreen.jsx:calls
- LOW: Does `subsystem-54-0-src-components` really depend on `subsystem-6-0-src-components` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: src/components/screens/MatchesScreen.jsx:calls
- LOW: Does `subsystem-54-0-src-components` really depend on `subsystem-88-0-src-components` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: src/components/screens/MatchesScreen.jsx:calls
- LOW: Does `subsystem-55-0-src-components` really depend on `subsystem-33-0-src-components` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: src/components/selection/FilterTiles.jsx:calls
- LOW: Does `subsystem-55-0-src-components` really depend on `subsystem-88-0-src-components` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: src/components/selection/FilterTiles.jsx:calls
- LOW: Does `subsystem-56-0-src-components` really depend on `subsystem-103-0-src-components` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: src/components/screens/PlayerProfileScreen.jsx:calls
- LOW: Does `subsystem-56-0-src-components` really depend on `subsystem-161-0-src-components` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: src/components/screens/PlayerProfileScreen.jsx:calls
- LOW: Does `subsystem-56-0-src-components` really depend on `subsystem-2-0-src-components` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: src/components/screens/PlayerProfileScreen.jsx:calls
- LOW: Does `subsystem-56-0-src-components` really depend on `subsystem-29-0-src-components` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: src/components/screens/PlayerProfileScreen.jsx:calls, src/components/screens/PlayerProfileScreen.jsx:calls
- LOW: Does `subsystem-56-0-src-components` really depend on `subsystem-88-0-src-components` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: src/components/screens/PlayerProfileScreen.jsx:calls, src/components/screens/PlayerProfileScreen.jsx:calls, src/components/screens/PlayerProfileScreen.jsx:calls
- LOW: Does `subsystem-57-0-src-components` really depend on `subsystem-164-0-src-components` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: src/components/selection/CreateTeamModal.jsx:calls
- LOW: Does `subsystem-57-0-src-components` really depend on `subsystem-2-0-src-components` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: src/components/selection/CreateTeamModal.jsx:calls
- LOW: Does `subsystem-57-0-src-components` really depend on `subsystem-77-0-src-components` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: src/components/selection/CreateTeamModal.jsx:calls
- LOW: Does `subsystem-57-0-src-components` really depend on `subsystem-88-0-src-components` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: src/components/selection/CreateTeamModal.jsx:calls, src/components/selection/CreateTeamModal.jsx:calls, src/components/selection/CreateTeamModal.jsx:calls
- LOW: Does `subsystem-58-0-src-components` really depend on `subsystem-102-0-src-components` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: src/components/ui/MatchMediaReport.jsx:calls, temp_extraction/src/components/ui/MatchMediaReport.jsx:calls
- LOW: Does `subsystem-58-0-src-components` really depend on `subsystem-103-0-src-components` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: src/components/ui/MatchMediaReport.jsx:calls, src/components/ui/MatchMediaReport.jsx:calls, src/components/ui/MatchMediaReport.jsx:calls
- LOW: Does `subsystem-58-0-src-components` really depend on `subsystem-121-0-src-components` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: src/components/ui/MatchMediaReport.jsx:calls, temp_extraction/src/components/ui/MatchMediaReport.jsx:calls
- LOW: Does `subsystem-58-0-src-components` really depend on `subsystem-69-0-src-components` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: src/components/ui/MatchMediaReport.jsx:calls
- LOW: Does `subsystem-58-0-src-components` really depend on `subsystem-88-0-src-components` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: src/components/ui/MatchMediaReport.jsx:calls
- LOW: Does `subsystem-59-0-temp-extraction` really depend on `subsystem-161-0-src-components` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: temp_extraction/src/components/screens/PlayerProfileScreen.jsx:calls
- LOW: Does `subsystem-59-0-temp-extraction` really depend on `subsystem-2-0-src-components` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: temp_extraction/src/components/screens/PlayerProfileScreen.jsx:calls
- LOW: Does `subsystem-59-0-temp-extraction` really depend on `subsystem-76-0-src-components` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: temp_extraction/src/components/screens/PlayerProfileScreen.jsx:calls
- LOW: Does `subsystem-59-0-temp-extraction` really depend on `subsystem-88-0-src-components` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: temp_extraction/src/components/screens/PlayerProfileScreen.jsx:calls, temp_extraction/src/components/screens/PlayerProfileScreen.jsx:calls
- LOW: Does `subsystem-6-0-src-components` really depend on `subsystem-104-0-src-components` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: src/components/selection/CampaignOverview.jsx:calls
- LOW: Does `subsystem-6-0-src-components` really depend on `subsystem-150-0-src-components` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: src/components/CricketIcons.jsx:calls, temp_extraction/src/components/CricketIcons.jsx:calls
- LOW: Does `subsystem-6-0-src-components` really depend on `subsystem-153-0-src-components` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: src/components/selection/PlayerDetail.jsx:calls
- LOW: Does `subsystem-6-0-src-components` really depend on `subsystem-157-0-src-components` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: src/components/selection/PerformanceGraphs.jsx:calls
- LOW: Does `subsystem-6-0-src-components` really depend on `subsystem-2-0-src-components` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: src/components/selection/PerformanceGraphs.jsx:calls, src/components/selection/PerformanceGraphs.jsx:calls, src/components/selection/PlayerDetail.jsx:calls
- LOW: Does `subsystem-6-0-src-components` really depend on `subsystem-21-0-src-components` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: src/components/selection/PerformanceGraphs.jsx:calls, src/components/selection/PerformanceGraphs.jsx:calls, src/components/selection/PerformanceGraphs.jsx:calls
- LOW: Does `subsystem-6-0-src-components` really depend on `subsystem-22-0-src-components` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: src/components/selection/PerformanceGraphs.jsx:calls, src/components/selection/PerformanceGraphs.jsx:calls
- LOW: Does `subsystem-6-0-src-components` really depend on `subsystem-36-0-src-components` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: src/components/selection/PlayerDetail.jsx:calls
- LOW: Does `subsystem-6-0-src-components` really depend on `subsystem-88-0-src-components` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: src/components/selection/PerformanceGraphs.jsx:calls, src/components/selection/PerformanceGraphs.jsx:calls, src/components/selection/PerformanceGraphs.jsx:calls
- LOW: Does `subsystem-60-0-temp-extraction` really depend on `subsystem-103-0-src-components` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: temp_extraction/src/components/screens/TournamentsScreen.jsx:calls
- LOW: Does `subsystem-60-0-temp-extraction` really depend on `subsystem-15-0-src-components` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: temp_extraction/src/components/screens/TournamentsScreen.jsx:calls, temp_extraction/src/components/screens/TournamentsScreen.jsx:calls, temp_extraction/src/components/screens/TournamentsScreen.jsx:calls
- LOW: Does `subsystem-60-0-temp-extraction` really depend on `subsystem-173-0-src-components` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: temp_extraction/src/components/screens/TournamentsScreen.jsx:calls
- LOW: Does `subsystem-60-0-temp-extraction` really depend on `subsystem-2-0-src-components` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: temp_extraction/src/components/screens/TournamentsScreen.jsx:calls
- LOW: Does `subsystem-60-0-temp-extraction` really depend on `subsystem-24-0-src-components` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: temp_extraction/src/components/screens/TournamentsScreen.jsx:calls
- LOW: Does `subsystem-60-0-temp-extraction` really depend on `subsystem-3-0-src-components` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: temp_extraction/src/components/screens/TournamentsScreen.jsx:calls, temp_extraction/src/components/screens/TournamentsScreen.jsx:calls, temp_extraction/src/components/screens/TournamentsScreen.jsx:calls
- LOW: Does `subsystem-60-0-temp-extraction` really depend on `subsystem-42-0-temp-extraction` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: temp_extraction/src/components/screens/TournamentsScreen.jsx:calls, temp_extraction/src/components/screens/TournamentsScreen.jsx:calls, temp_extraction/src/components/screens/TournamentsScreen.jsx:calls
- LOW: Does `subsystem-60-0-temp-extraction` really depend on `subsystem-88-0-src-components` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: temp_extraction/src/components/screens/TournamentsScreen.jsx:calls, temp_extraction/src/components/screens/TournamentsScreen.jsx:calls, temp_extraction/src/components/screens/TournamentsScreen.jsx:calls
- LOW: Does `subsystem-61-0-src-components` really depend on `subsystem-105-0-src-components` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: src/components/screens/PlayerProfileScreen.jsx:calls, src/components/screens/PlayerProfileScreen.jsx:calls, src/components/screens/PlayerProfileScreen.jsx:calls
- LOW: Does `subsystem-61-0-src-components` really depend on `subsystem-121-0-src-components` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: src/components/screens/MatchDetailScreen.jsx:calls, src/components/screens/MatchDetailScreen.jsx:calls, src/components/screens/MatchDetailScreen.jsx:calls
- LOW: Does `subsystem-61-0-src-components` really depend on `subsystem-7-0-src-components` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: src/components/screens/MatchDetailScreen.jsx:calls, src/components/screens/MatchDetailScreen.jsx:calls, src/components/screens/MatchDetailScreen.jsx:calls
- LOW: Does `subsystem-62-0-src-components` really depend on `subsystem-103-0-src-components` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: src/components/screens/MatchResultScreen.jsx:calls, src/components/screens/MatchResultScreen.jsx:calls
- LOW: Does `subsystem-62-0-src-components` really depend on `subsystem-121-0-src-components` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: src/components/screens/MatchResultScreen.jsx:calls
- LOW: Does `subsystem-62-0-src-components` really depend on `subsystem-3-0-src-components` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: src/components/screens/MatchResultScreen.jsx:calls
- LOW: Does `subsystem-62-0-src-components` really depend on `subsystem-69-0-src-components` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: src/components/screens/MatchResultScreen.jsx:calls, src/components/screens/MatchResultScreen.jsx:calls
- LOW: Does `subsystem-62-0-src-components` really depend on `subsystem-88-0-src-components` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: src/components/screens/MatchResultScreen.jsx:calls, src/components/screens/MatchResultScreen.jsx:calls, src/components/screens/MatchResultScreen.jsx:calls
- LOW: Does `subsystem-63-0-src-components` really depend on `subsystem-121-0-src-components` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: src/components/ui/TeamManagerModal.jsx:calls, src/components/ui/TournamentManagerModal.jsx:calls, src/components/ui/TeamManagerModal.jsx:calls
- LOW: Does `subsystem-63-0-src-components` really depend on `subsystem-123-0-src-components` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: src/components/ui/TeamManagerModal.jsx:calls
- LOW: Does `subsystem-63-0-src-components` really depend on `subsystem-34-0-src-components` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: src/components/ui/TeamManagerModal.jsx:calls, src/components/ui/TeamManagerModal.jsx:calls, src/components/ui/TournamentManagerModal.jsx:calls
- LOW: Does `subsystem-63-0-src-components` really depend on `subsystem-88-0-src-components` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: src/components/ui/TeamManagerModal.jsx:calls, src/components/ui/TeamManagerModal.jsx:calls
- LOW: Does `subsystem-64-0-temp-extraction` really depend on `subsystem-65-0-src-components` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: temp_extraction/src/components/screens/AdministrationScreen.jsx:calls
- LOW: Does `subsystem-64-0-temp-extraction` really depend on `subsystem-88-0-src-components` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: temp_extraction/src/components/screens/AdministrationScreen.jsx:calls, temp_extraction/src/components/screens/AdministrationScreen.jsx:calls, temp_extraction/src/components/screens/AdministrationScreen.jsx:calls
- LOW: Does `subsystem-64-0-temp-extraction` really depend on `subsystem-90-0-src-components` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: temp_extraction/src/components/screens/AdministrationScreen.jsx:calls
- LOW: Does `subsystem-65-0-src-components` really depend on `subsystem-102-0-src-components` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: src/components/screens/PlayerRegistrationScreen.jsx:calls, temp_extraction/src/components/screens/PlayerRegistrationScreen.jsx:calls
- LOW: Does `subsystem-65-0-src-components` really depend on `subsystem-108-0-src-components` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: src/components/selection/CreateTeamModal.jsx:calls, src/components/selection/CreateTeamModal.jsx:calls, src/components/selection/CreateTeamModal.jsx:calls
- LOW: Does `subsystem-65-0-src-components` really depend on `subsystem-121-0-src-components` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: src/components/screens/PlayerRegistrationScreen.jsx:calls, src/components/ui/TournamentManagerModal.jsx:calls, src/components/screens/PlayerRegistrationScreen.jsx:calls
- LOW: Does `subsystem-65-0-src-components` really depend on `subsystem-123-0-src-components` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: src/components/ui/TournamentManagerModal.jsx:calls, src/components/ui/TournamentManagerModal.jsx:calls
- LOW: Does `subsystem-65-0-src-components` really depend on `subsystem-170-0-src-components` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: src/components/selection/CreateTeamModal.jsx:calls, src/components/ui/TeamManagerModal.jsx:calls, src/components/ui/TournamentManagerModal.jsx:calls
- LOW: Does `subsystem-65-0-src-components` really depend on `subsystem-174-0-src-components` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: src/components/selection/CreateTeamModal.jsx:calls
- LOW: Does `subsystem-65-0-src-components` really depend on `subsystem-2-0-src-components` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: temp_extraction/src/components/screens/PlayerRegistrationScreen.jsx:calls
- LOW: Does `subsystem-65-0-src-components` really depend on `subsystem-45-0-src-components` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: src/components/ui/TournamentManagerModal.jsx:calls
- LOW: Does `subsystem-65-0-src-components` really depend on `subsystem-61-0-src-components` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: src/components/screens/PlayerRegistrationScreen.jsx:calls, temp_extraction/src/components/screens/PlayerRegistrationScreen.jsx:calls
- LOW: Does `subsystem-65-0-src-components` really depend on `subsystem-63-0-src-components` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: src/components/ui/TeamManagerModal.jsx:calls, src/components/ui/TournamentManagerModal.jsx:calls
- LOW: Does `subsystem-65-0-src-components` really depend on `subsystem-7-0-src-components` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: src/components/screens/PlayerRegistrationScreen.jsx:calls, src/components/selection/CreateTeamModal.jsx:calls, src/components/ui/TeamManagerModal.jsx:calls
- LOW: Does `subsystem-65-0-src-components` really depend on `subsystem-73-0-src-components` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: src/components/ui/TournamentManagerModal.jsx:calls, src/components/ui/TournamentManagerModal.jsx:calls
- LOW: Does `subsystem-65-0-src-components` really depend on `subsystem-81-0-src-components` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: src/components/ui/TournamentManagerModal.jsx:calls, src/components/ui/TournamentManagerModal.jsx:calls, src/components/ui/TournamentManagerModal.jsx:calls
- LOW: Does `subsystem-66-0-src-components` really depend on `subsystem-121-0-src-components` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: src/components/screens/ScoringScreen.jsx:calls, src/components/screens/ScoringScreen.jsx:calls
- LOW: Does `subsystem-66-0-src-components` really depend on `subsystem-2-0-src-components` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: src/components/screens/ScoringScreen.jsx:calls
- LOW: Does `subsystem-67-0-src-lib` really depend on `subsystem-16-0-src-components` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: src/lib/api.js:calls, src/lib/api.js:calls, src/lib/api.js:calls
- LOW: Does `subsystem-67-0-src-lib` really depend on `subsystem-176-0-src-components` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: src/lib/api.js:calls, src/lib/api.js:calls
- LOW: Does `subsystem-67-0-src-lib` really depend on `subsystem-37-0-src-engine` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: src/lib/api.js:calls, src/lib/api.js:calls
- LOW: Does `subsystem-69-0-src-components` really depend on `subsystem-103-0-src-components` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: src/components/screens/MatchDetailScreen.jsx:calls
- LOW: Does `subsystem-69-0-src-components` really depend on `subsystem-6-0-src-components` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: src/components/screens/MatchDetailScreen.jsx:calls
- LOW: Does `subsystem-69-0-src-components` really depend on `subsystem-75-0-src-components` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: src/components/screens/MatchDetailScreen.jsx:calls
- LOW: Does `subsystem-69-0-src-components` really depend on `subsystem-88-0-src-components` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: src/components/screens/MatchDetailScreen.jsx:calls, src/components/screens/MatchDetailScreen.jsx:calls, src/components/screens/MatchDetailScreen.jsx:calls
- LOW: Does `subsystem-7-0-src-components` really depend on `subsystem-102-0-src-components` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: src/components/screens/AdministrationScreen.jsx:calls
- LOW: Does `subsystem-7-0-src-components` really depend on `subsystem-121-0-src-components` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: src/components/screens/AdministrationScreen.jsx:calls, src/components/screens/AdministrationScreen.jsx:calls, src/components/screens/AdministrationScreen.jsx:calls
- LOW: Does `subsystem-7-0-src-components` really depend on `subsystem-154-0-src-components` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: src/components/screens/AdministrationScreen.jsx:calls
- LOW: Does `subsystem-7-0-src-components` really depend on `subsystem-174-0-src-components` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: temp_extraction/src/components/screens/AdministrationScreen.jsx:calls
- LOW: Does `subsystem-7-0-src-components` really depend on `subsystem-175-0-src-components` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: src/components/selection/SelectedTeam.jsx:calls
- LOW: Does `subsystem-7-0-src-components` really depend on `subsystem-64-0-temp-extraction` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: temp_extraction/src/components/screens/AdministrationScreen.jsx:calls
- LOW: Does `subsystem-7-0-src-components` really depend on `subsystem-88-0-src-components` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: src/components/screens/AdministrationScreen.jsx:calls, src/components/screens/AdministrationScreen.jsx:calls, src/components/screens/AdministrationScreen.jsx:calls
- LOW: Does `subsystem-70-0-src-components` really depend on `subsystem-151-0-src-components` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: src/components/screens/ScorecardScreen.jsx:calls
- LOW: Does `subsystem-70-0-src-components` really depend on `subsystem-62-0-src-components` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: src/components/screens/ScorecardScreen.jsx:calls
- LOW: Does `subsystem-70-0-src-components` really depend on `subsystem-7-0-src-components` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: src/components/screens/ScorecardScreen.jsx:calls
- LOW: Does `subsystem-70-0-src-components` really depend on `subsystem-88-0-src-components` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: src/components/screens/ScorecardScreen.jsx:calls
- LOW: Does `subsystem-71-0-src-components` really depend on `subsystem-104-0-src-components` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: src/components/selection/SelectionFilters.jsx:calls, src/components/selection/SelectionFilters.jsx:calls, src/components/selection/SelectionFilters.jsx:calls
- LOW: Does `subsystem-71-0-src-components` really depend on `subsystem-122-0-src-components` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: src/components/selection/SelectionFilters.jsx:calls, src/components/selection/SelectionFilters.jsx:calls
- LOW: Does `subsystem-71-0-src-components` really depend on `subsystem-166-0-src-components` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: src/components/selection/SelectionFilters.jsx:calls
- LOW: Does `subsystem-72-0-temp-extraction` really depend on `subsystem-2-0-src-components` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: temp_extraction/src/components/screens/HomeScreen.jsx:calls, temp_extraction/src/components/screens/HomeScreen.jsx:calls
- LOW: Does `subsystem-72-0-temp-extraction` really depend on `subsystem-22-0-src-components` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: temp_extraction/src/components/screens/HomeScreen.jsx:calls, temp_extraction/src/components/screens/HomeScreen.jsx:calls, temp_extraction/src/components/screens/HomeScreen.jsx:calls
- LOW: Does `subsystem-72-0-temp-extraction` really depend on `subsystem-29-0-src-components` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: temp_extraction/src/components/screens/HomeScreen.jsx:calls, temp_extraction/src/components/screens/HomeScreen.jsx:calls, temp_extraction/src/components/screens/HomeScreen.jsx:calls
- LOW: Does `subsystem-72-0-temp-extraction` really depend on `subsystem-3-0-src-components` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: temp_extraction/src/components/screens/HomeScreen.jsx:calls
- LOW: Does `subsystem-72-0-temp-extraction` really depend on `subsystem-39-0-src-components` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: temp_extraction/src/components/screens/HomeScreen.jsx:calls, temp_extraction/src/components/screens/HomeScreen.jsx:calls, temp_extraction/src/components/screens/HomeScreen.jsx:calls
- LOW: Does `subsystem-72-0-temp-extraction` really depend on `subsystem-54-0-src-components` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: temp_extraction/src/components/screens/HomeScreen.jsx:calls
- LOW: Does `subsystem-72-0-temp-extraction` really depend on `subsystem-6-0-src-components` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: temp_extraction/src/components/screens/HomeScreen.jsx:calls, temp_extraction/src/components/screens/HomeScreen.jsx:calls
- LOW: Does `subsystem-72-0-temp-extraction` really depend on `subsystem-9-0-src-components` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: temp_extraction/src/components/screens/HomeScreen.jsx:calls, temp_extraction/src/components/screens/HomeScreen.jsx:calls
- LOW: Does `subsystem-73-0-src-components` really depend on `subsystem-121-0-src-components` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: src/components/screens/AuthScreen.jsx:calls
- LOW: Does `subsystem-73-0-src-components` really depend on `subsystem-122-0-src-components` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: src/components/screens/AuthScreen.jsx:calls
- LOW: Does `subsystem-73-0-src-components` really depend on `subsystem-7-0-src-components` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: src/components/screens/AuthScreen.jsx:calls, temp_extraction/src/components/screens/AuthScreen.jsx:calls
- LOW: Does `subsystem-74-0-src-components` really depend on `subsystem-111-0-src-components` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: src/components/screens/AuthScreen.jsx:calls
- LOW: Does `subsystem-74-0-src-components` really depend on `subsystem-122-0-src-components` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: src/components/screens/AuthScreen.jsx:calls
- LOW: Does `subsystem-74-0-src-components` really depend on `subsystem-88-0-src-components` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: src/components/screens/AuthScreen.jsx:calls, src/components/screens/AuthScreen.jsx:calls, src/components/screens/AuthScreen.jsx:calls
- LOW: Does `subsystem-75-0-src-components` really depend on `subsystem-6-0-src-components` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: src/components/screens/JdcaManagementTab.jsx:calls, src/components/screens/JdcaManagementTab.jsx:calls
- LOW: Does `subsystem-76-0-src-components` really depend on `subsystem-103-0-src-components` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: src/components/screens/PlayerComparisonModal.jsx:calls
- LOW: Does `subsystem-76-0-src-components` really depend on `subsystem-104-0-src-components` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: src/components/screens/PlayerComparisonModal.jsx:calls
- LOW: Does `subsystem-76-0-src-components` really depend on `subsystem-2-0-src-components` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: src/components/screens/PlayerComparisonModal.jsx:calls
- LOW: Does `subsystem-77-0-src-components` really depend on `subsystem-104-0-src-components` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: src/components/screens/SelectorsScreen.jsx:calls, src/components/screens/SelectorsScreen.jsx:calls, src/components/screens/SelectorsScreen.jsx:calls
- LOW: Does `subsystem-77-0-src-components` really depend on `subsystem-150-0-src-components` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: src/components/screens/SelectorsScreen.jsx:calls, src/components/screens/SelectorsScreen.jsx:calls, src/components/screens/SelectorsScreen.jsx:calls
- LOW: Does `subsystem-77-0-src-components` really depend on `subsystem-153-0-src-components` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: src/components/screens/SelectorsScreen.jsx:calls
- LOW: Does `subsystem-77-0-src-components` really depend on `subsystem-161-0-src-components` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: src/components/screens/SelectorsScreen.jsx:calls
- LOW: Does `subsystem-77-0-src-components` really depend on `subsystem-167-0-src-components` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: src/components/screens/SelectorsScreen.jsx:calls
- LOW: Does `subsystem-77-0-src-components` really depend on `subsystem-2-0-src-components` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: src/components/screens/SelectorsScreen.jsx:calls
- LOW: Does `subsystem-77-0-src-components` really depend on `subsystem-33-0-src-components` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: src/components/screens/SelectorsScreen.jsx:calls, src/components/screens/SelectorsScreen.jsx:calls, src/components/screens/SelectorsScreen.jsx:calls
- LOW: Does `subsystem-77-0-src-components` really depend on `subsystem-88-0-src-components` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: src/components/screens/SelectorsScreen.jsx:calls, src/components/screens/SelectorsScreen.jsx:calls, src/components/screens/SelectorsScreen.jsx:calls
- LOW: Does `subsystem-78-0-src-components` really depend on `subsystem-29-0-src-components` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: src/components/Sidebar.jsx:calls
- LOW: Does `subsystem-78-0-src-components` really depend on `subsystem-6-0-src-components` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: src/components/Sidebar.jsx:calls
- LOW: Does `subsystem-78-0-src-components` really depend on `subsystem-88-0-src-components` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: src/components/Sidebar.jsx:calls, src/components/Sidebar.jsx:calls, src/components/Sidebar.jsx:calls
- LOW: Does `subsystem-79-0-src-components` really depend on `subsystem-122-0-src-components` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: src/components/ui/MatchCard.jsx:calls, src/components/ui/MatchCard.jsx:calls
- LOW: Does `subsystem-79-0-src-components` really depend on `subsystem-39-0-src-components` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: src/components/ui/MatchCard.jsx:calls
- LOW: Does `subsystem-79-0-src-components` really depend on `subsystem-40-0-src-components` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: src/components/ui/MatchCard.jsx:calls
- LOW: Does `subsystem-79-0-src-components` really depend on `subsystem-6-0-src-components` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: src/components/ui/MatchCard.jsx:calls, src/components/ui/MatchCard.jsx:calls
- LOW: Does `subsystem-8-0-src-components` really depend on `subsystem-104-0-src-components` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: src/components/screens/SeasonMigrationTab.jsx:calls
- LOW: Does `subsystem-8-0-src-components` really depend on `subsystem-105-0-src-components` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: src/components/screens/SeasonMigrationTab.jsx:calls, src/components/screens/SeasonMigrationTab.jsx:calls, src/components/screens/SeasonMigrationTab.jsx:calls
- LOW: Does `subsystem-8-0-src-components` really depend on `subsystem-121-0-src-components` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: src/components/screens/SeasonMigrationTab.jsx:calls, src/components/screens/SeasonMigrationTab.jsx:calls, src/components/screens/SeasonMigrationTab.jsx:calls
- LOW: Does `subsystem-8-0-src-components` really depend on `subsystem-159-0-src-components` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: src/components/screens/SeasonMigrationTab.jsx:calls
- LOW: Does `subsystem-8-0-src-components` really depend on `subsystem-2-0-src-components` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: src/components/screens/SeasonMigrationTab.jsx:calls
- LOW: Does `subsystem-8-0-src-components` really depend on `subsystem-39-0-src-components` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: src/components/screens/SeasonMigrationTab.jsx:calls, src/components/screens/SeasonMigrationTab.jsx:calls, src/components/screens/SeasonMigrationTab.jsx:calls
- LOW: Does `subsystem-8-0-src-components` really depend on `subsystem-56-0-src-components` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: src/components/screens/SeasonMigrationTab.jsx:calls
- LOW: Does `subsystem-8-0-src-components` really depend on `subsystem-7-0-src-components` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: src/components/screens/SeasonMigrationTab.jsx:calls, src/components/screens/SeasonMigrationTab.jsx:calls, src/components/screens/SeasonMigrationTab.jsx:calls
- LOW: Does `subsystem-8-0-src-components` really depend on `subsystem-73-0-src-components` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: src/components/screens/SeasonMigrationTab.jsx:calls, src/components/screens/SeasonMigrationTab.jsx:calls
- LOW: Does `subsystem-8-0-src-components` really depend on `subsystem-88-0-src-components` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: src/components/screens/SeasonMigrationTab.jsx:calls, src/components/screens/SeasonMigrationTab.jsx:calls, src/components/screens/SeasonMigrationTab.jsx:calls
- LOW: Does `subsystem-80-0-src-components` really depend on `subsystem-121-0-src-components` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: src/components/screens/MatchResultScreen.jsx:calls, src/components/screens/MatchResultScreen.jsx:calls
- LOW: Does `subsystem-80-0-src-components` really depend on `subsystem-61-0-src-components` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: src/components/screens/MatchResultScreen.jsx:calls, src/components/screens/MatchResultScreen.jsx:calls
- LOW: Does `subsystem-80-0-src-components` really depend on `subsystem-7-0-src-components` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: src/components/screens/MatchResultScreen.jsx:calls
- LOW: Does `subsystem-81-0-src-components` really depend on `subsystem-121-0-src-components` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: src/components/screens/TournamentsScreen.jsx:calls
- LOW: Does `subsystem-81-0-src-components` really depend on `subsystem-169-0-src-components` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: src/components/screens/TournamentsScreen.jsx:calls
- LOW: Does `subsystem-81-0-src-components` really depend on `subsystem-61-0-src-components` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: src/components/screens/TournamentsScreen.jsx:calls
- LOW: Does `subsystem-81-0-src-components` really depend on `subsystem-7-0-src-components` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: src/components/screens/TournamentsScreen.jsx:calls, src/components/screens/TournamentsScreen.jsx:calls, src/components/screens/TournamentsScreen.jsx:calls
- LOW: Does `subsystem-84-0-src-components` really depend on `subsystem-157-0-src-components` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: src/components/screens/InningsBreakScreen.jsx:calls, src/components/screens/InningsBreakScreen.jsx:calls
- LOW: Does `subsystem-84-0-src-components` really depend on `subsystem-158-0-src-components` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: src/components/screens/InningsBreakScreen.jsx:calls, temp_extraction/src/components/screens/InningsBreakScreen.jsx:calls
- LOW: Does `subsystem-85-0-src-components` really depend on `subsystem-29-0-src-components` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: src/components/screens/MatchOverviewScreen.jsx:calls, src/components/screens/MatchOverviewScreen.jsx:calls
- LOW: Does `subsystem-87-0-temp-extraction` really depend on `subsystem-103-0-src-components` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: temp_extraction/src/components/ui/PageHeader.jsx:calls
- LOW: Does `subsystem-87-0-temp-extraction` really depend on `subsystem-29-0-src-components` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: temp_extraction/src/components/ui/PageHeader.jsx:calls
- LOW: Does `subsystem-89-0-src-components` really depend on `subsystem-102-0-src-components` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: src/components/screens/SelectionScreen.jsx:calls, temp_extraction/src/components/screens/SelectionScreen.jsx:calls
- LOW: Does `subsystem-89-0-src-components` really depend on `subsystem-121-0-src-components` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: src/components/screens/SelectionScreen.jsx:calls
- LOW: Does `subsystem-89-0-src-components` really depend on `subsystem-7-0-src-components` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: src/components/screens/SelectionScreen.jsx:calls, src/components/screens/SelectionScreen.jsx:calls
- LOW: Does `subsystem-9-0-src-components` really depend on `subsystem-102-0-src-components` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: src/components/screens/TeamsScreen.jsx:calls
- LOW: Does `subsystem-9-0-src-components` really depend on `subsystem-103-0-src-components` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: src/components/screens/TeamsScreen.jsx:calls, src/components/screens/TeamsScreen.jsx:calls, src/components/screens/TeamsScreen.jsx:calls
- LOW: Does `subsystem-9-0-src-components` really depend on `subsystem-104-0-src-components` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: src/components/screens/TeamsScreen.jsx:calls, src/components/screens/TeamsScreen.jsx:calls
- LOW: Does `subsystem-9-0-src-components` really depend on `subsystem-107-0-src-components` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: src/components/screens/TeamsScreen.jsx:calls
- LOW: Does `subsystem-9-0-src-components` really depend on `subsystem-124-0-src-components` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: src/components/screens/TeamsScreen.jsx:calls, src/components/screens/TeamsScreen.jsx:calls
- LOW: Does `subsystem-9-0-src-components` really depend on `subsystem-150-0-src-components` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: src/components/screens/TeamsScreen.jsx:calls, src/components/screens/TeamsScreen.jsx:calls, src/components/screens/TeamsScreen.jsx:calls
- LOW: Does `subsystem-9-0-src-components` really depend on `subsystem-167-0-src-components` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: src/components/screens/TeamsScreen.jsx:calls
- LOW: Does `subsystem-9-0-src-components` really depend on `subsystem-169-0-src-components` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: src/components/screens/TeamsScreen.jsx:calls
- LOW: Does `subsystem-9-0-src-components` really depend on `subsystem-173-0-src-components` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: src/components/screens/TeamsScreen.jsx:calls
- LOW: Does `subsystem-9-0-src-components` really depend on `subsystem-2-0-src-components` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: src/components/screens/TeamsScreen.jsx:calls, src/components/screens/TeamsScreen.jsx:calls
- LOW: Does `subsystem-9-0-src-components` really depend on `subsystem-22-0-src-components` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: src/components/screens/TeamsScreen.jsx:calls
- LOW: Does `subsystem-9-0-src-components` really depend on `subsystem-29-0-src-components` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: src/components/screens/TeamsScreen.jsx:calls, src/components/screens/TeamsScreen.jsx:calls
- LOW: Does `subsystem-9-0-src-components` really depend on `subsystem-3-0-src-components` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: src/components/screens/TeamsScreen.jsx:calls, src/components/screens/TeamsScreen.jsx:calls
- LOW: Does `subsystem-9-0-src-components` really depend on `subsystem-56-0-src-components` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: src/components/screens/TeamsScreen.jsx:calls
- LOW: Does `subsystem-9-0-src-components` really depend on `subsystem-6-0-src-components` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: src/components/screens/TeamsScreen.jsx:calls, src/components/screens/TeamsScreen.jsx:calls
- LOW: Does `subsystem-9-0-src-components` really depend on `subsystem-7-0-src-components` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: src/components/screens/TeamsScreen.jsx:calls
- LOW: Does `subsystem-9-0-src-components` really depend on `subsystem-70-0-src-components` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: src/components/screens/TeamsScreen.jsx:calls
- LOW: Does `subsystem-9-0-src-components` really depend on `subsystem-88-0-src-components` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: src/components/screens/TeamsScreen.jsx:calls, src/components/screens/TeamsScreen.jsx:calls, src/components/screens/TeamsScreen.jsx:calls
- LOW: Does `subsystem-90-0-src-components` really depend on `subsystem-121-0-src-components` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: src/components/screens/TeamsScreen.jsx:calls, src/components/screens/TeamsScreen.jsx:calls
- LOW: Does `subsystem-90-0-src-components` really depend on `subsystem-61-0-src-components` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: src/components/screens/TeamsScreen.jsx:calls
- LOW: Does `subsystem-90-0-src-components` really depend on `subsystem-7-0-src-components` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: src/components/screens/TeamsScreen.jsx:calls, src/components/screens/TeamsScreen.jsx:calls, src/components/screens/TeamsScreen.jsx:calls
- LOW: Does `subsystem-91-0-src-components` really depend on `subsystem-21-0-src-components` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: src/components/selection/SelectionWorkspace.jsx:calls
- LOW: Does `subsystem-91-0-src-components` really depend on `subsystem-7-0-src-components` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: src/components/selection/SelectionWorkspace.jsx:calls
- LOW: Does `subsystem-92-0-src-context` really depend on `subsystem-1-0-src-context` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: src/context/CricketContext.jsx:calls
- LOW: Does `subsystem-92-0-src-context` really depend on `subsystem-121-0-src-components` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: src/context/CricketContext.jsx:calls, src/context/CricketContext.jsx:calls, src/context/CricketContext.jsx:calls
- LOW: Does `subsystem-92-0-src-context` really depend on `subsystem-7-0-src-components` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: src/context/CricketContext.jsx:calls, src/context/CricketContext.jsx:calls, src/context/CricketContext.jsx:calls
- LOW: Does `subsystem-92-0-src-context` really depend on `subsystem-89-0-src-components` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: src/context/CricketContext.jsx:calls
- LOW: Does `subsystem-93-0-src-components` really depend on `subsystem-2-0-src-components` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: src/components/screens/AccessControlScreen.jsx:calls
- LOW: Does `subsystem-94-0-src-components` really depend on `subsystem-159-0-src-components` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: src/components/selection/PlayerList.jsx:calls
- LOW: Does `subsystem-94-0-src-components` really depend on `subsystem-88-0-src-components` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: src/components/selection/PlayerList.jsx:calls, src/components/selection/PlayerList.jsx:calls
- LOW: Does `subsystem-95-0-src-components` really depend on `subsystem-159-0-src-components` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: src/components/selection/Shortlist.jsx:calls
- LOW: Does `subsystem-95-0-src-components` really depend on `subsystem-169-0-src-components` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: src/components/selection/Shortlist.jsx:calls
- LOW: Does `subsystem-95-0-src-components` really depend on `subsystem-44-0-src-components` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: src/components/selection/Shortlist.jsx:calls, src/components/selection/Shortlist.jsx:calls
- LOW: Does `subsystem-95-0-src-components` really depend on `subsystem-88-0-src-components` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: src/components/selection/Shortlist.jsx:calls, src/components/selection/Shortlist.jsx:calls, src/components/selection/Shortlist.jsx:calls
- LOW: Does `subsystem-95-0-src-components` really depend on `subsystem-94-0-src-components` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: src/components/selection/Shortlist.jsx:calls, src/components/selection/Shortlist.jsx:calls
- LOW: Does `subsystem-96-0-temp-extraction` really depend on `subsystem-47-0-src-components` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: temp_extraction/src/components/BottomNav.jsx:calls
- LOW: Does `subsystem-96-0-temp-extraction` really depend on `subsystem-88-0-src-components` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: temp_extraction/src/components/BottomNav.jsx:calls, temp_extraction/src/components/BottomNav.jsx:calls, temp_extraction/src/components/BottomNav.jsx:calls
- LOW: Does `subsystem-97-0-temp-extraction` really depend on `subsystem-104-0-src-components` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: temp_extraction/src/components/screens/ScoutingHubScreen.jsx:calls, temp_extraction/src/components/screens/ScoutingHubScreen.jsx:calls, temp_extraction/src/components/screens/ScoutingHubScreen.jsx:calls
- LOW: Does `subsystem-97-0-temp-extraction` really depend on `subsystem-161-0-src-components` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: temp_extraction/src/components/screens/ScoutingHubScreen.jsx:calls
- LOW: Does `subsystem-97-0-temp-extraction` really depend on `subsystem-24-0-src-components` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: temp_extraction/src/components/screens/ScoutingHubScreen.jsx:calls
- LOW: Does `subsystem-97-0-temp-extraction` really depend on `subsystem-29-0-src-components` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: temp_extraction/src/components/screens/ScoutingHubScreen.jsx:calls
- LOW: Does `subsystem-97-0-temp-extraction` really depend on `subsystem-30-0-src-components` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: temp_extraction/src/components/screens/ScoutingHubScreen.jsx:calls, temp_extraction/src/components/screens/ScoutingHubScreen.jsx:calls, temp_extraction/src/components/screens/ScoutingHubScreen.jsx:calls
- LOW: Does `subsystem-97-0-temp-extraction` really depend on `subsystem-33-0-src-components` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: temp_extraction/src/components/screens/ScoutingHubScreen.jsx:calls, temp_extraction/src/components/screens/ScoutingHubScreen.jsx:calls, temp_extraction/src/components/screens/ScoutingHubScreen.jsx:calls
- LOW: Does `subsystem-97-0-temp-extraction` really depend on `subsystem-88-0-src-components` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: temp_extraction/src/components/screens/ScoutingHubScreen.jsx:calls, temp_extraction/src/components/screens/ScoutingHubScreen.jsx:calls, temp_extraction/src/components/screens/ScoutingHubScreen.jsx:calls
- LOW: Does `subsystem-98-0-temp-extraction` really depend on `subsystem-102-0-src-components` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: temp_extraction/src/context/CricketContext.jsx:calls, temp_extraction/src/context/CricketContext.jsx:calls
- LOW: Does `subsystem-98-0-temp-extraction` really depend on `subsystem-149-0-src-app-jsx` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: temp_extraction/src/context/CricketContext.jsx:calls
- LOW: Does `subsystem-98-0-temp-extraction` really depend on `subsystem-168-0-src-components` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: temp_extraction/src/context/CricketContext.jsx:calls
- LOW: Does `subsystem-98-0-temp-extraction` really depend on `subsystem-29-0-src-components` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: temp_extraction/src/context/CricketContext.jsx:calls
- LOW: Does `subsystem-98-0-temp-extraction` really depend on `subsystem-3-0-src-components` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: temp_extraction/src/context/CricketContext.jsx:calls
- LOW: Does `subsystem-98-0-temp-extraction` really depend on `subsystem-88-0-src-components` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: temp_extraction/src/context/CricketContext.jsx:calls, temp_extraction/src/context/CricketContext.jsx:calls, temp_extraction/src/context/CricketContext.jsx:calls
- LOW: Does `subsystem-99-0-test-players2-js` really depend on `subsystem-0-0-src-lib` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: test-players2.js:calls, test-players2.js:calls, test-players2.js:calls
- LOW: Does `subsystem-99-0-test-players2-js` really depend on `subsystem-82-0-delete-season-js` through `calls`? Why: The strongest cross-subsystem signal is backed by ambiguous or sparse evidence. Evidence: test-players2.js:calls
- LOW: How does `toggleShortlist()` connect to `prev.includes` across boundaries? Why: ambiguous relationship, cross-file link, cross-community bridge, cross-boundary directory hop, peripheral-to-hub jump Evidence: src/App.jsx:react, src/context/CricketContext.jsx:setupDataAndSync()
- LOW: Should `02_selector_assignment_refactor.sql` stay grouped as one subsystem? Why: Its membership spans multiple path prefixes or relies on low-confidence evidence. Evidence: 02_selector_assignment_refactor.sql:IF, 02_selector_assignment_refactor.sql:RLS, 02_selector_assignment_refactor.sql:SELECTOR
- LOW: Should `clean.cjs` stay grouped as one subsystem? Why: Its membership spans multiple path prefixes or relies on low-confidence evidence. Evidence: clean.cjs:../../context/CricketContext, clean.cjs:../../lib/api, clean.cjs:../ui/Badge
- LOW: Should `src/components` stay grouped as one subsystem? Why: Its membership spans multiple path prefixes or relies on low-confidence evidence. Evidence: src/components/screens/AccessControlScreen.jsx:map, src/components/screens/MatchSetupScreen.jsx:Number, src/components/screens/ScoringScreen.jsx:checkHydration()
- LOW: Should `src/main.jsx` stay grouped as one subsystem? Why: Its membership spans multiple path prefixes or relies on low-confidence evidence. Evidence: src/main.jsx:ErrorBoundary, src/main.jsx:ErrorBoundary.componentDidCatch(), src/main.jsx:ErrorBoundary.render()
- LOW: Should `temp_extraction` stay grouped as one subsystem? Why: Its membership spans multiple path prefixes or relies on low-confidence evidence. Evidence: temp_extraction/vite.config.ts:@tailwindcss/vite, temp_extraction/vite.config.ts:@vitejs/plugin-react, temp_extraction/vite.config.ts:path
- LOW: What responsibilities are grouped inside Community 0? Why: Representative nodes: age_category_id, ageCategories.forEach, assignManOfTheMatch. Evidence: src/App.jsx:react, src/context/CricketContext.jsx:setupDataAndSync()
- LOW: What responsibilities are grouped inside Community 1? Why: Representative nodes: Action, api.finalizeMatch, api.getSelectionCandidates. Evidence: src/App.jsx:react, src/context/CricketContext.jsx:setupDataAndSync()
- LOW: What responsibilities are grouped inside Community 2? Why: Representative nodes: map, Number, activeTournaments.map. Evidence: src/App.jsx:react, src/context/CricketContext.jsx:setupDataAndSync()
- LOW: Why is `react` central to the repository? Why: It has the highest grounded degree in community 53. Evidence: src/App.jsx:react, src/context/CricketContext.jsx:setupDataAndSync()
