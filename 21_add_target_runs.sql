-- 21_add_target_runs.sql
--
-- Persist the chase target on the innings record itself so that re-opening
-- a match on another device (or after clearing localStorage) still shows
-- the correct target during the 2nd / 4th innings.
--
-- Target is set when the next innings is created. First / third innings
-- rows keep target_runs = NULL — they don't have a target.
--
-- Safe to re-run: all statements use IF NOT EXISTS.

alter table public.innings
  add column if not exists target_runs integer;

comment on column public.innings.target_runs is
  'The target this innings must reach to win. Set at innings creation (1st innings runs + 1 for innings 2; 3rd innings runs + 1 for innings 4). NULL for the first innings of each match / super-over.';

-- Sanity: target must be positive if set.
do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'innings_target_runs_positive'
  ) then
    alter table public.innings
      add constraint innings_target_runs_positive
      check (target_runs is null or target_runs > 0);
  end if;
end$$;


begin;

alter table public.innings disable trigger user;

with prev_totals as (
  select
    i.id,
    i.match_id,
    i.innings_number,
    (
      select coalesce(sum(d.runs_total), 0) + 1
      from public.deliveries d
      join public.innings pi on pi.id = d.innings_id
      where pi.match_id = i.match_id
        and pi.innings_number = i.innings_number - 1
        and coalesce(d.event_type, 'DELIVERY') = 'DELIVERY'
    ) as computed_target
  from public.innings i
  where i.innings_number in (2, 4)
    and i.target_runs is null
)
update public.innings i
   set target_runs = p.computed_target
  from prev_totals p
 where i.id = p.id
   and p.computed_target > 1;

alter table public.innings enable trigger user;

commit;
