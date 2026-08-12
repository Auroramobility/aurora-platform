-- Aurora Mobility
-- Migration: 009_application_vehicle_visibility.sql
-- Let customers continue seeing a vehicle tied to their own application,
-- even after that vehicle leaves public marketplace availability.

drop policy if exists "Users can view vehicles tied to own applications" on public.vehicles;

create policy "Users can view vehicles tied to own applications"
on public.vehicles
for select
to authenticated
using (
  exists (
    select 1
    from public.applications
    where applications.vehicle_id = vehicles.id
      and applications.user_id = auth.uid()
  )
);
