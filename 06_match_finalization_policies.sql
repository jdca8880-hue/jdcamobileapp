drop policy if exists matches_scorer_update on matches;
create policy matches_scorer_update on matches
for update using (
  current_app_role() = 'SCORER'
  and status not in ('COMPLETED', 'ABANDONED', 'CANCELLED')
)
with check (
  current_app_role() = 'SCORER'
);

drop policy if exists innings_scorer_write on innings;
create policy innings_scorer_write on innings
for insert with check (
  current_app_role() in ('SUPER_ADMIN','DISTRICT_ADMIN','SCORER')
  and exists (
    select 1 from matches m
    where m.id = match_id
    and m.status not in ('COMPLETED', 'ABANDONED', 'CANCELLED')
  )
);

drop policy if exists innings_scorer_update on innings;
create policy innings_scorer_update on innings
for update using (
  current_app_role() in ('SUPER_ADMIN','DISTRICT_ADMIN','SCORER')
  and exists (
    select 1 from matches m
    where m.id = match_id
    and m.status not in ('COMPLETED', 'ABANDONED', 'CANCELLED')
  )
)
with check (
  current_app_role() in ('SUPER_ADMIN','DISTRICT_ADMIN','SCORER')
);

drop policy if exists deliveries_scorer_insert on deliveries;
create policy deliveries_scorer_insert on deliveries
for insert with check (
  current_app_role() in ('SUPER_ADMIN','DISTRICT_ADMIN','SCORER')
  and created_by = auth.uid()
  and exists (
    select 1 from matches m
    where m.id = match_id
    and m.status not in ('COMPLETED', 'ABANDONED', 'CANCELLED')
  )
);

drop policy if exists deliveries_scorer_update on deliveries;
create policy deliveries_scorer_update on deliveries
for update using (
  current_app_role() in ('SUPER_ADMIN','DISTRICT_ADMIN','SCORER')
  and exists (
    select 1 from matches m
    where m.id = match_id
    and m.status not in ('COMPLETED', 'ABANDONED', 'CANCELLED')
  )
)
with check (
  current_app_role() in ('SUPER_ADMIN','DISTRICT_ADMIN','SCORER')
);
