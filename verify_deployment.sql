-- JDCA Deployment Verification

-- 1. Verify foreign key
SELECT
    tc.table_name, 
    kcu.column_name, 
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name,
    rc.delete_rule 
FROM 
    information_schema.table_constraints AS tc 
    JOIN information_schema.key_column_usage AS kcu
      ON tc.constraint_name = kcu.constraint_name
      AND tc.table_schema = kcu.table_schema
    JOIN information_schema.constraint_column_usage AS ccu
      ON ccu.constraint_name = tc.constraint_name
      AND ccu.table_schema = tc.table_schema
    JOIN information_schema.referential_constraints AS rc
      ON rc.constraint_name = tc.constraint_name
WHERE tc.constraint_type = 'FOREIGN KEY' AND tc.table_name='matches' AND kcu.column_name='tournament_id';


-- 2. Verify Immutability Function
SELECT routine_name 
FROM information_schema.routines 
WHERE routine_type='FUNCTION' AND routine_schema='public' AND routine_name='check_match_immutable';


-- 3. Verify Triggers
SELECT event_object_table AS table_name, trigger_name, event_manipulation AS event, action_statement
FROM information_schema.triggers
WHERE trigger_name LIKE 'trg_%_immutable';


-- 4. Verify Orphan Count
SELECT count(*) AS orphan_count
FROM public.matches 
WHERE tournament_id IS NULL OR NOT EXISTS (SELECT 1 FROM public.tournaments t WHERE t.id = public.matches.tournament_id);
