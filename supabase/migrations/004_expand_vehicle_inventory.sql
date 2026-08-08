-- ============================================
-- Expand vehicles table
-- ============================================

alter table public.vehicles
add column if not exists trim text,
add column if not exists description text,
add column if not exists mileage integer,
add column if not exists color text,
add column if not exists battery_capacity numeric,
add column if not exists drivetrain text,
add column if not exists charging_time text,
add column if not exists acceleration text,
add column if not exists top_speed integer,
add column if not exists featured boolean default false,
add column if not exists published boolean default true,
add column if not exists updated_at timestamptz default now();

-- ============================================
-- Vehicle Images
-- ============================================

create table if not exists public.vehicle_images (
    id uuid primary key default uuid_generate_v4(),

    vehicle_id uuid not null
        references public.vehicles(id)
        on delete cascade,

    image_url text not null,

    sort_order integer default 0,

    created_at timestamptz default now()
);

create index if not exists idx_vehicle_images_vehicle
on public.vehicle_images(vehicle_id);
