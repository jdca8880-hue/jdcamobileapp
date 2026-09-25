-- SQL Migration to support Multi-Stage Selection Pipeline
-- Differentiating District Teams from final JDCA Representative Teams

-- 1. Add team_type to teams table
ALTER TABLE public.teams ADD COLUMN IF NOT EXISTS team_type text DEFAULT 'DISTRICT_TEAM';
-- Possible values: 'DISTRICT_TEAM', 'JDCA_REPRESENTATIVE'

-- 2. Add process_type to selection_processes table
ALTER TABLE public.selection_processes ADD COLUMN IF NOT EXISTS process_type text DEFAULT 'DISTRICT_TEAM';
-- Possible values: 'DISTRICT_TEAM', 'JDCA_REPRESENTATIVE'

-- 3. Add district_id to selection_processes table (Optional, for district-specific selection processes)
ALTER TABLE public.selection_processes ADD COLUMN IF NOT EXISTS target_district_id uuid REFERENCES public.districts(id) ON DELETE SET NULL;

-- Explanation:
-- When process_type = 'DISTRICT_TEAM', target_district_id should be set to filter the pool.
-- When process_type = 'JDCA_REPRESENTATIVE', target_district_id is NULL, and the pool consists of top performers from district teams.
