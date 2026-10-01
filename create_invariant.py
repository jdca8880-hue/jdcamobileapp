report = """# JDCA Invariant Specification (Corrected Baseline)

This document is the verified architectural blueprint for JDCA. Every invariant has been mathematically vetted against the actual PostgreSQL schema and business domain rules.

---

## 1. Match State Invariants (Database Enforceable)

### Legal Transition Matrix
The database currently allows unrestricted transitions between `SCHEDULED`, `IN_PROGRESS`, and `INNINGS_BREAK`. The only enforced rule is that a `COMPLETED` match cannot be changed. 
The *Required DB* matrix below dictates what a new PostgreSQL trigger must strictly enforce:

| Current | Requested | Should allow? | Current DB | Required DB |
|---|---|---|---|---|
| `SCHEDULED` | `IN_PROGRESS` | ✅ Yes | ✅ Allowed | ✅ Allowed |
| `SCHEDULED` | `INNINGS_BREAK` | ❌ No | ⚠️ Allowed | ❌ Blocked |
| `SCHEDULED` | `COMPLETED` | ❌ No | ⚠️ Allowed | ❌ Blocked |
| `IN_PROGRESS` | `INNINGS_BREAK` | ✅ Yes | ✅ Allowed | ✅ Allowed |
| `IN_PROGRESS` | `COMPLETED` | ✅ Yes | ✅ Allowed | ✅ Allowed |
| `IN_PROGRESS` | `SCHEDULED` | ❌ No | ⚠️ Allowed | ❌ Blocked |
| `INNINGS_BREAK` | `IN_PROGRESS` | ✅ Yes | ✅ Allowed | ✅ Allowed |
| `INNINGS_BREAK` | `COMPLETED` | ❌ No | ⚠️ Allowed | ❌ Blocked |
| `INNINGS_BREAK` | `SCHEDULED` | ❌ No | ⚠️ Allowed | ❌ Blocked |
| `COMPLETED` | `ANY` | ❌ No | ❌ Blocked | ❌ Blocked |

*Note: ABANDONED/CANCELLED can be transitioned into from SCHEDULED or IN_PROGRESS, but cannot be reversed.*

### Invariant List
| ID | Invariant Rule | Enforcer | Status |
| :--- | :--- | :--- | :--- |
| **M-01** | The legal state transition graph (above) must be strictly followed. | PostgreSQL Trigger | ❌ Fail (Needs Trigger) |
| **M-02** | A finalized match (`COMPLETED`, `ABANDONED`, `CANCELLED`) is immutable. | PostgreSQL `trg_matches_immutable` | ✅ Pass |
| **M-03** | Finalization behavior (`finalizeMatch`) should be **strictly idempotent**. If called with the exact same payload on an already finalized match, it should return success silently rather than crashing the UI with a 23505/trigger exception. | API Layer | ❌ Fail |
| **M-04** | "Playing XI" data must be derived from `match_rosters` where `is_playing_xi = true`. It is impossible for PostgreSQL to enforce 11 players strictly during match setup (as teams sometimes play short), but the application UI must enforce a soft limit and not crash if length < 11. | App Layer | ❌ Fail |
| **M-05** | If `hydrateLiveMatch` fails due to network error, the app must preserve the previous state (or show an explicit `ERROR` UI) rather than wiping the local XI to `[]`. | App Layer (React) | ❌ Fail |

---

## 2. Synchronization & Offline Invariants

### Queue State Machine Definition
The offline queue for recorded deliveries must follow a structured, observable lifecycle:

- `PENDING` → `SYNCING` → `SUCCESS` (Clear from IndexedDB)
- `PENDING` → `SYNCING` → `FAILED` (Network) → `PENDING` (Wait for online)
- `PENDING` → `SYNCING` → `FAILED` (DB Rejection) → `RETRYING` (Wait/Backoff)
- `RETRYING` → `FAILED_PERMANENT` (Max retries hit)

**Crucial Resolution:** A `FAILED_PERMANENT` delivery **must not be deleted**. It must pause the sequential sync queue for that specific `match_id` until the user manually resolves or discards it. Deleting it silently corrupts the scorer's local state.

### Invariant List
| ID | Invariant Rule | Enforcer | Status |
| :--- | :--- | :--- | :--- |
| **S-01** | An action that exhausts `MAX_RETRIES` must be flagged as `FAILED_PERMANENT` and surfaced to the UI. | `SyncService` | ❌ Fail (Silently Drops) |
| **S-02** | A `FAILED_PERMANENT` action must block subsequent actions for the **same match** to prevent chronological corruption, while allowing actions from other matches to proceed. | `SyncService` | ❌ Fail |
| **S-03** | Retrying an action must not create duplicate deliveries. (Enforced by `deliverySequence` calculations + `UNIQUE` DB indexes on `(innings_id, delivery_sequence)`). | PostgreSQL Constraint | ✅ Pass |

---

## 3. Tournament & Identity Invariants

### Invariant List
| ID | Invariant Rule | Enforcer | Status |
| :--- | :--- | :--- | :--- |
| **T-01** | A match fixture cannot be duplicated exactly (same tournament, teams, and time). | PostgreSQL `matches_fixture_unique_idx` | ✅ Pass |
| **T-02** | Tournament identity must be unique according to business definition. A tournament is uniquely identified by the combination of its `name`, `season`, `age_category_id`, and `gender`. | PostgreSQL Unique Index | ❌ Fail (Missing) |
| **T-03** | Schedule generation (`createDetailedMatches`) is currently protected from duplications by `matches_fixture_unique_idx`, but throws a hard error if partially generated. It should be refactored to an `UPSERT` (Idempotent) model. | API Layer | ⚠️ Partial |
| **T-04** | Concurrent partial updates to a match (e.g., Request A sets `max_overs`, Request B sets `result_text`) **safely merge** in PostgreSQL because `UPDATE` clauses only modify provided keys. No explicit row lock is required for non-overlapping column updates. | PostgreSQL Architecture | ✅ Pass (False Positive in initial audit) |

---

## 4. Remediation Order

No production changes have been made. The specification is finalized. The order of execution should be:

1. **Database Hardening:** Apply the PostgreSQL Transition Matrix Trigger and the composite Unique Index for Tournaments.
2. **Sync Recovery Layer:** Rewrite the `SyncService.js` error handling to support the `FAILED_PERMANENT` state and sequence blocking.
3. **Hydration Integrity:** Fix the `CricketContext.jsx` catch block so an API failure triggers an Error View rather than an Empty XI Setup View.
4. **Idempotency Wrappers:** Update `finalizeMatch` and `createDetailedMatches` to catch "already exists" exceptions and return success instead of crashing.
"""

with open('c:\\Users\\lenovo\\Desktop\\WEBBDEV\\JDCA\\jdca_invariant_specification.md', 'w', encoding='utf-8') as f:
    f.write(report)

print("Created jdca_invariant_specification.md successfully.")
