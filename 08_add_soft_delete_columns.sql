-- 08_add_soft_delete_columns.sql
-- Run this in your Supabase SQL Editor to enable the Recycle Bin functionality

ALTER TABLE public.tournaments ADD COLUMN IF NOT EXISTS deleted_at timestamptz;
ALTER TABLE public.matches ADD COLUMN IF NOT EXISTS deleted_at timestamptz;
ALTER TABLE public.players ADD COLUMN IF NOT EXISTS deleted_at timestamptz;
ALTER TABLE public.teams ADD COLUMN IF NOT EXISTS deleted_at timestamptz;

-- Optional: Create indexes to speed up the Recycle Bin queries and normal active queries
CREATE INDEX IF NOT EXISTS idx_tournaments_deleted_at ON public.tournaments(deleted_at);
CREATE INDEX IF NOT EXISTS idx_matches_deleted_at ON public.matches(deleted_at);
CREATE INDEX IF NOT EXISTS idx_players_deleted_at ON public.players(deleted_at);
CREATE INDEX IF NOT EXISTS idx_teams_deleted_at ON public.teams(deleted_at);
