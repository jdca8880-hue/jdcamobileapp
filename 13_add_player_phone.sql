BEGIN;

-- Add optional phone number to players table
ALTER TABLE players ADD COLUMN IF NOT EXISTS phone varchar(20);

COMMIT;
