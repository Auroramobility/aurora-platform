alter table public.profiles
add column if not exists drivers_license_front text,
add column if not exists drivers_license_back text;