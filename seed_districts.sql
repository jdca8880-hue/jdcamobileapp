-- ============================================================
-- Seed Jabalpur Division districts.
-- Run this once in the Supabase SQL Editor. Safe to re-run:
-- it only inserts when the districts table is empty, so it
-- never clobbers or duplicates districts a live DB already has.
--
-- Fixes: empty district dropdown on team registration and the
-- "invalid input syntax for type uuid" error caused by an empty
-- district_id being sent when no districts exist.
-- ============================================================
do $$
begin
  if not exists (select 1 from districts) then
    insert into districts (name, code) values
      ('Jabalpur',    'JBP'),
      ('Katni',       'KTN'),
      ('Narsinghpur', 'NSP'),
      ('Seoni',       'SEO'),
      ('Mandla',      'MDL'),
      ('Balaghat',    'BLG'),
      ('Chhindwara',  'CWA'),
      ('Dindori',     'DND'),
      ('Pandhurna',   'PDH');
  end if;
end $$;
