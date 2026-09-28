-- Read-Only Orphan Match Report

SELECT 
    m.id AS match_id,
    m.tournament_id,
    m.home_team_id,
    m.away_team_id,
    m.status,
    (SELECT count(*) FROM public.innings i WHERE i.match_id = m.id) AS innings_count,
    (SELECT count(*) FROM public.deliveries d WHERE d.match_id = m.id) AS deliveries_count,
    (SELECT count(*) FROM public.match_rosters r WHERE r.match_id = m.id) AS roster_count
FROM 
    public.matches m
WHERE 
    m.tournament_id IS NULL 
    OR NOT EXISTS (SELECT 1 FROM public.tournaments t WHERE t.id = m.tournament_id);
