-- Run this in your Supabase SQL editor to add the new match configuration columns
ALTER TABLE matches 
ADD COLUMN IF NOT EXISTS umpire_name varchar(160),
ADD COLUMN IF NOT EXISTS scorer_name varchar(160),
ADD COLUMN IF NOT EXISTS ball_type varchar(20),
ADD COLUMN IF NOT EXISTS venue_name varchar(160);
