-- Create announcements table
create table if not exists announcements (
  id uuid primary key default gen_random_uuid(),
  title varchar(255) not null,
  content text not null,
  priority varchar(50) default 'NORMAL',
  is_active boolean default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Enable RLS
alter table announcements enable row level security;

-- Create policies
create policy announcements_public_read on announcements
  for select using (true);

-- Only admins should be able to create/update/delete, but assuming standard admin policies:
create policy announcements_admin_all on announcements
  for all using (
    exists (
      select 1 from profiles
      where profiles.id = auth.uid()
      and profiles.role in ('SUPER_ADMIN', 'DISTRICT_ADMIN')
    )
  );

-- Optional: Insert a welcome announcement
insert into announcements (title, content, priority)
values ('Welcome to JDCA Live Scoring', 'The new JDCA live scoring app is now online!', 'HIGH')
on conflict do nothing;
