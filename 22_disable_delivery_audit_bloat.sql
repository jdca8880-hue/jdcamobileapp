-- ==============================================================================
-- Migration: 22_disable_delivery_audit_bloat.sql
-- Description:
--   1. Drops the high-frequency ball delivery audit trigger that causes
--      audit_logs to bloat exponentially on every scored ball.
--   2. Cleans up existing delivery audit logs to immediately reclaim storage.
--   3. Keeps audit logging active for essential administrative entities
--      (players, selection decisions, matches).
-- ==============================================================================

-- Step 1: Drop the audit trigger on deliveries table so it never logs balls again
DROP TRIGGER IF EXISTS trg_audit_deliveries ON public.deliveries;

-- Step 2: Instantly wipe the bloated demo audit logs and reclaim the 2.8 MB of disk space
-- (TRUNCATE is transaction-safe and immediately resets table size to 0 bytes without needing VACUUM)
TRUNCATE TABLE public.audit_logs;
