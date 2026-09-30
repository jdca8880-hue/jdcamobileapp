-- 17_add_scorer_delete_policy.sql

drop policy if exists matches_scorer_delete on matches;
create policy matches_scorer_delete on matches
for delete using (
  current_app_role() = 'SCORER'
  and deleted_by = auth.uid()
);
