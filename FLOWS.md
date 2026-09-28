# Architecture Flows

## Overview
JDCA contains 182 subsystems, 1021 cross-subsystem flows, 0 processed documents, and 1181 external dependencies derived from 3513 extracted code nodes. Grounded flow summary is derived from 219 entrypoint candidates and 1021 detected flows.

## Confirmed Flows
- **Subsystems:** 182 detected subsystems across the codebase.
- **Services:** 182 detected services.
- **Routes:** 219 detected routes.
- **Tables:** 52 detected tables in the database layer.

Key Flow Areas:
- **`src/lib` (UI / Core Logic)**: Acts as a central hub (e.g., `src/lib/api.js`), heavily depended on by contexts and components.
- **`src/context` (Adapter / Module)**: State management (`CricketContext.jsx`), handles data hydration, syncing, and state resolution. Interacts heavily with `src/components` and `src/services/SyncService.js`.
- **`src/components` (UI)**: Various UI modules (screens, components, icons) communicating with context and lib APIs for rendering and interactions.
- **`src/engine` (Module)**: Core domain logic (`cricketStateMachine.js`, validation schemas) providing utilities for score projection, RR calculation, and delivery processing.
- **`src/services/SyncService.js` (Service)**: Handles background syncing, queue processing, and data persistence.

## Inferred Flow Notes
- Inferred: Repository boundaries likely follow the detected subsystem, service, route, and persistence surfaces.
- Inferred: When evidence is weak, expand this document conservatively and prefer explicit confirmation over assumptions.

## Open Questions / Uncertainty
- Does `subsystem-0-0-src-lib` really depend on `subsystem-16-0-src-components` through `calls`?
- Does `subsystem-0-0-src-lib` really depend on `subsystem-176-0-src-components` through `calls`?
- Does `subsystem-0-0-src-lib` really depend on `subsystem-178-0-src-engine` through `calls`?
- Does `subsystem-0-0-src-lib` really depend on `subsystem-23-0-src-engine` through `calls`?
- Does `subsystem-1-0-src-context` really depend on `subsystem-102-0-src-components` through `calls`?
- Does `subsystem-1-0-src-context` really depend on `subsystem-105-0-src-components` through `calls`?
