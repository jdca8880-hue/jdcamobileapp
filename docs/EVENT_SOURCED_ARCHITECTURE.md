# JDCA — Event-Sourced Scoring Engine (Plan B)

Goal: a deterministic, offline-first, realtime scoring engine that handles every
format (Test / multi-day, ODI, T20, T10, draw) identically, survives weak
networks / phone calls / the app being killed, and keeps every device in sync
without hard-blocking a match.

## The core principle
A match **is** an append-only log of events (ball 1, ball 2, wicket, over,
declaration…). We store that log; everything else — the live score, the
scorecard, "who is batting" — is a **pure projection** of the log:

```
state = buildMatchState(events, format)
```

No field is ever the "truth" on its own. The log is the truth. Snapshots are
caches. Sync ships the log. This removes the whole class of bugs we have today
(volatile sequence counter, 7 competing stores, batting-side guessing, hard
blocks).

## Why this survives the field
- Every event is written to local disk (IndexedDB) **before** the UI confirms it
  and **before** it is sent — so a dropped call / killed app / dead battery can
  never lose a confirmed ball.
- Transport is an **outbox**: events upload idempotently (keyed by a stable id),
  so retries are always safe and a single poison event is quarantined, never a
  whole match.
- A **cursor + Supabase Realtime** pull keeps every viewer/device converged;
  realtime is the fast pipe, the log is the truth, so live score is never stuck
  or wrong.

## Stages (each stage keeps the app fully working)
- **Stage 1 — Deterministic core (THIS STAGE).** `formats.js` (formats as data),
  `matchEvents.js` (event model + stable ids + per-innings sequence),
  `matchProjection.js` (`buildMatchState` fold → authoritative state + scorecard
  for all formats). Pure, additive, fully unit-tested. No UI touched.
- **Stage 2 — Local log + outbox.** Dexie `match_events` log + `outbox`, written
  in one transaction; helpers to append an event and derive the next sequence
  from the durable log (never from memory).
- **Stage 3 — Sync protocol.** Outbox push (idempotent upsert, per-event
  quarantine, no per-match block) + cursor pull + Supabase Realtime subscribe.
  Server `match_events` table + RLS. Replaces the fragile SyncService drain.
- **Stage 4 — Wire the live UI.** `useMatchScoring`/`ScoringScreen` emit events
  and seed their live state from `buildMatchState`; keep `processDelivery` for
  in-the-moment interaction. Behind a feature flag per match.
- **Stage 5 — Migration + cutover.** Backfill existing matches' `deliveries`
  into the event log; verify projection == server; flip the flag; retire the old
  paths. Repair the known roster-team swap + the Test innings-3/4 bug.
- **Stage 6 — Reconciler + hardening.** Background "local == server" audit;
  storage persistence (`navigator.storage.persist()`), PWA; full format ×
  online/offline × live-viewer test matrix.

## Non-negotiable invariants
1. The reducer/projection is **pure**: no clock, no RNG, no I/O, no network.
2. Event `id` is client-generated and stable → exactly-once via idempotent upsert.
3. `sequence` per innings is derived from the durable log, never a RAM counter.
4. Identity (match/innings/roster ids) is created deterministically, never
   guessed at sync time from a mutable toss.
5. A format is **data** (`formats.js`), consumed everywhere — no scattered `if (isTest)`.
6. Server scorecards/stats are projections, never hand-mutated rows.
