-- Aurora Mobility
-- Migration: 006_security_hardening.sql
-- Tighten database-level authorization and integrity after the initial RLS rollout.

-- =========================
-- APPLICATION INTEGRITY
-- =========================

-- A customer may only create an application for a currently available vehicle.
-- The vehicle check is performed at insert time so client-side checks cannot be bypassed.
drop policy if exists "Users can create applications" on public.applications;
create policy "Users can create applications"
on public.applications
for insert
to authenticated
with check (
  auth.uid() = user_id
  and status = 'pending'
  and exists (
    select 1
    from public.vehicles
    where vehicles.id = applications.vehicle_id
      and vehicles.availability = 'available'
      and vehicles.published = true
  )
);

-- Customers must not be able to mutate application state directly.
-- Status changes/approval should be performed by trusted server/admin workflows later.
drop policy if exists "Users can update own applications" on public.applications;

-- Prevent arbitrary application states at the database level.
alter table public.applications
  drop constraint if exists applications_status_check;

alter table public.applications
  add constraint applications_status_check
  check (status in ('pending', 'reviewing', 'approved', 'rejected', 'cancelled'));

-- =========================
-- VEHICLE INTEGRITY
-- =========================

alter table public.vehicles
  drop constraint if exists vehicles_availability_check;

alter table public.vehicles
  add constraint vehicles_availability_check
  check (availability in ('available', 'reserved', 'sold', 'unavailable'));

-- =========================
-- OWNERSHIP / PAYMENT ACCESS
-- =========================

-- There are intentionally no customer INSERT/UPDATE/DELETE policies for
-- ownership_plans or payments. Those records represent trusted financial state
-- and should be created/changed by server-side workflows.

-- =========================
-- MESSAGES
-- =========================

-- Users can submit messages for themselves, but cannot impersonate an arbitrary
-- sender identity. Until a dedicated sender enum/role model exists, normalize
-- customer-created messages to the customer role.
drop policy if exists "Users can send messages" on public.messages;
create policy "Users can send messages"
on public.messages
for insert
to authenticated
with check (
  auth.uid() = user_id
  and sender = 'user'
);

-- =========================
-- SAVED VEHICLES
-- =========================

-- Saving a vehicle is only allowed for published vehicles.
drop policy if exists "Users can save vehicles" on public.saved_vehicles;
create policy "Users can save vehicles"
on public.saved_vehicles
for insert
to authenticated
with check (
  auth.uid() = user_id
  and exists (
    select 1
    from public.vehicles
    where vehicles.id = saved_vehicles.vehicle_id
      and vehicles.published = true
  )
);
