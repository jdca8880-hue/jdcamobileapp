-- Cleanup Confirmed Orphan Matches
-- These 7 matches have 0 deliveries, 0 statistics, and no valid tournament.
-- They are confirmed to be test garbage and safe for deletion.

BEGIN;

DELETE FROM public.innings WHERE match_id IN (
    'b1dfe465-aef2-4dea-a977-a5f690ef07fb',
    '0b30730a-9fcb-41cb-84df-2023d47f8fb6',
    '2d9c14f4-7a42-495b-8906-f487e70d1547',
    'b63a8ec3-5c5c-45e5-bb63-fff0b81b8510',
    '899c26c3-18b1-4418-b8af-9663cde077ba',
    '527afc08-de9c-4472-8b10-0b8ac29b58b0',
    'fed5c316-6c0d-434f-9811-c899614a2c3a'
);

DELETE FROM public.match_rosters WHERE match_id IN (
    '0b30730a-9fcb-41cb-84df-2023d47f8fb6'
);

DELETE FROM public.matches WHERE id IN (
    'b1dfe465-aef2-4dea-a977-a5f690ef07fb',
    '0b30730a-9fcb-41cb-84df-2023d47f8fb6',
    '2d9c14f4-7a42-495b-8906-f487e70d1547',
    'b63a8ec3-5c5c-45e5-bb63-fff0b81b8510',
    '899c26c3-18b1-4418-b8af-9663cde077ba',
    '527afc08-de9c-4472-8b10-0b8ac29b58b0',
    'fed5c316-6c0d-434f-9811-c899614a2c3a'
);

COMMIT;
