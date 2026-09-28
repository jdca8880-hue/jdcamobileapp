# Archify Diagram Prompt

## System Prompt
You are an AI assistant tasked with generating architecture diagrams based on grounded repository context. The `.archify` artifacts are the primary source of truth. Do not invent unverified repository details.

## User Prompt
Please generate a high-level runtime architectural diagram based on the grounded repository context below.

## Grounded Repository Context
- **Project**: JDCA
- **Subsystems**: 182 detected subsystems (key subsystems include UI components, `src/context` for state management, `src/lib` for core API calls, `src/engine` for cricket state machine logic, and `src/services/SyncService.js` for data synchronization).
- **External Dependencies**: Connects heavily to Supabase (backend DB, auth, edge functions).
- **Data Flow**: UI Components -> Context (State) -> Engine (Logic) & Lib (API) -> SyncService -> Supabase.

## Confirmed From Codebase
- UI components (e.g., `ScoringScreen.jsx`, `PlayerProfileScreen.jsx`) interact with `CricketContext.jsx`.
- `CricketContext.jsx` uses `src/lib/api.js` and `src/services/SyncService.js`.
- `src/engine/cricketStateMachine.js` handles score projections and ball-by-ball logic.
- SQL files (`02_selector_assignment_refactor.sql`, etc.) define the database schema on Supabase.

## Inferred Architecture
- *Inferred*: The runtime boundary separates the React frontend (running on Vite/browser) from the Supabase backend.
- *Inferred*: The `SyncService` likely queues offline actions and synchronizes them when online.

## Open Questions / Uncertainty
- Are there any specific edge functions being used other than `send-push`?

## Questions Before Architecture Generation
1. What kind of architecture output do you want next: a high-level diagram, a deployment view, a sequence flow, or a deeper written architecture?
2. Which user journeys, business workflows, or API flows matter most for this architecture pass?
3. What operational constraints should shape the design?
4. Which external systems are in scope?
5. Are there planned changes differing from the current codebase?
6. Which inferred components should be treated as tentative?

## Diagram / Image Generation Instructions
Generate visuals directly if supported, otherwise return render-ready diagram specifications (like Mermaid).
