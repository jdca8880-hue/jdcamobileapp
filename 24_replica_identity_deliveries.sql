-- Enable REPLICA IDENTITY FULL on deliveries so Supabase Realtime
-- broadcasts the full row payload on DELETE events (undo). Without this,
-- payload.old is empty and viewers cannot process delivery removals.
ALTER TABLE public.deliveries REPLICA IDENTITY FULL;
