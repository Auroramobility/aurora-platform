-- Aurora Mobility
-- Migration: 005_security_and_schema_alignment.sql
-- Stabilize schema, enable RLS, and align database with application code.

-- =========================
-- ENABLE ROW LEVEL SECURITY
-- =========================

alter table public.profiles enable row level security;
alter table public.vehicles enable row level security;
alter table public.applications enable row level security;
alter table public.ownership_plans enable row level security;
alter table public.payments enable row level security;
alter table public.messages enable row level security;
alter table public.vehicle_images enable row level security;

-- =========================
-- VEHICLE SCHEMA ALIGNMENT
-- =========================

alter table public.vehicles
add column if not exists image_url text;

-- =========================
-- SAVED VEHICLES
-- =========================

create table if not exists public.saved_vehicles (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id) on delete cascade not null,
  vehicle_id uuid references public.vehicles(id) on delete cascade not null,
  created_at timestamptz default now(),
  unique(user_id, vehicle_id)
);

create index if not exists idx_saved_vehicles_user
on public.saved_vehicles(user_id);

create index if not exists idx_saved_vehicles_vehicle
on public.saved_vehicles(vehicle_id);

alter table public.saved_vehicles enable row level security;

create policy "Users can view own saved vehicles"
on public.saved_vehicles
for select
using (auth.uid() = user_id);

create policy "Users can save vehicles"
on public.saved_vehicles
for insert
with check (auth.uid() = user_id);

create policy "Users can remove own saved vehicles"
on public.saved_vehicles
for delete
using (auth.uid() = user_id);

-- =========================
-- VEHICLE IMAGE ACCESS
-- =========================

create policy "Anyone can view vehicle images"
on public.vehicle_images
for select
using (true);

-- =========================
-- PROFILE TIMESTAMP
-- =========================

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

 drop trigger if exists profiles_set_updated_at on public.profiles;
create trigger profiles_set_updated_at
before update on public.profiles
for each row
execute function public.set_updated_at();

 drop trigger if exists vehicles_set_updated_at on public.vehicles;
create trigger vehicles_set_updated_at
before update on public.vehicles
for each row
execute function public.set_updated_at();
