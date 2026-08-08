-- Aurora Mobility
-- Migration: 007_public_vehicle_visibility.sql
-- Make public marketplace visibility consistent at the database boundary.

-- Public vehicle reads must only expose inventory that is both published and available.
drop policy if exists "Anyone can view available vehicles" on public.vehicles;
drop policy if exists "Anyone can view published available vehicles" on public.vehicles;

create policy "Anyone can view published available vehicles"
on public.vehicles
for select
to anon, authenticated
using (
  published = true
  and availability = 'available'
);

-- Vehicle images follow the visibility of their parent vehicle.
drop policy if exists "Anyone can view vehicle images" on public.vehicle_images;
drop policy if exists "Anyone can view images for public vehicles" on public.vehicle_images;

create policy "Anyone can view images for public vehicles"
on public.vehicle_images
for select
to anon, authenticated
using (
  exists (
    select 1
    from public.vehicles
    where vehicles.id = vehicle_images.vehicle_id
      and vehicles.published = true
      and vehicles.availability = 'available'
  )
);
