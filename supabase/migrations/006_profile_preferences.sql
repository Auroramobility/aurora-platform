alter table profiles
add column if not exists currency text,
add column if not exists preferred_language text,
add column if not exists timezone text;