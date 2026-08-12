alter table public.profiles
add column if not exists address text,
add column if not exists city text,
add column if not exists postal_code text,
add column if not exists date_of_birth date,
add column if not exists employment_status text,
add column if not exists monthly_income numeric,
add column if not exists drivers_license text,
add column if not exists profile_photo_url text;