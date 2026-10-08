# JDCA Database Schema

This repo doesn't use a migrations framework (Supabase CLI, Flyway, etc).
All SQL has been applied **manually** in the Supabase SQL editor against the
production database. If you need to rebuild the DB (new environment, dev
reset, DR scenario), apply the files in the order below.

## Apply order

Baseline:
- `supabase_schema.sql` — initial schema (tables, enums, base RLS)

Then, in numeric order:
- `02_selector_assignment_refactor.sql`
- `03_season_management_architecture.sql`
- `04_admin_delete_user.sql`
- `05_team_types.sql`
- `06_match_finalization_policies.sql`
- `07_missing_rls_policies.sql`
- `08_add_soft_delete_columns.sql`
- `09_integrity_fixes_production.sql` *(prefer this over `09_integrity_fixes.sql`)*
- `10_age_category_tracking.sql`
- `10_state_machine_and_tournaments.sql`
- `11_fix_match_cascade.sql`
- `12_allow_soft_delete_completed_match.sql`
- `12_fix_soft_deleted_matches.sql`
- `13_add_player_phone.sql`
- `13_cleanup_and_cascade_soft_delete.sql`
- `14_allow_hard_delete_recycle_bin.sql`
- `14_create_announcements.sql`
- `15_fix_stats_soft_delete.sql`
- `15_super_admin_absolute_delete.sql`
- `16_add_deleted_by_columns.sql`
- `16_super_admin_bypass_immutable.sql`
- `17_add_scorer_delete_policy.sql`
- `18_super_admin_delete_policy.sql`
- `19_capture_permission_functions_and_scorer_delete.sql`
- `20_add_event_type.sql`

Optional / situational (do not run on a healthy DB without reading):
- `admin_password_reset.sql`, `alter_table.sql`, `cleanup_confirmed_orphans.sql`,
  `dummy_data.sql`, `fix_rls.sql`, `generate_teams.sql`,
  `orphan_match_report.sql`, `verify_deployment.sql`.

## Known schema drift (production vs. repo baseline)

These objects exist in production but are **not** fully reflected in
`supabase_schema.sql`. They were captured defensively in migration 19 /
20 — if you rebuild from scratch, those captures bring you back in line.

1. **`age_category_id` on the stat views** — `v_player_match_batting`,
   `v_player_match_bowling`, `v_player_match_fielding` include a joined
   `age_category_id` column from the `matches` table. Migration 20
   recreates these views with that column and with the `event_type`
   guard added.
2. **`user_can_add_*` / `user_can_edit_*` / `user_can_delete_*`
   permission functions** — these were edited directly in Supabase at
   some point and the current definitions were captured in migration
   19 with `set search_path = public` hardening.
3. **`deliveries_scorer_delete` RLS policy** — created in migration 19
   so scorers can retract their own deliveries (needed by the undo
   path in `SyncService.deleteDelivery`).

## Regenerating a fresh snapshot from production

Run this against the production DB and commit the output into
`supabase_schema.sql`:

```bash
pg_dump --schema-only --no-owner --no-privileges \
  "postgresql://<user>:<pw>@<host>:5432/postgres" \
  > supabase_schema.sql
```

Do this before any destructive migration, before cutting a release
branch, and any time someone edits SQL directly in the Supabase editor.

## Minimum sanity check after a rebuild

```sql
-- RLS policies installed on write-sensitive tables
select tablename, policyname from pg_policies
  where tablename in ('deliveries','innings','matches','players','teams')
  order by tablename, policyname;

-- event_type column exists and is populated
select event_type, count(*) from deliveries group by event_type;

-- Permission functions reachable
select proname, prosrc is not null as has_body from pg_proc
  where proname like 'user_can_%' order by proname;
```
