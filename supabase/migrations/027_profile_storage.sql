-- ============================================================
-- Aurora Profile Storage
-- ============================================================

-- Create buckets
insert into storage.buckets (id, name, public)
values
  ('avatars', 'avatars', true),
  ('licenses', 'licenses', false)
on conflict (id) do nothing;


-- ============================================================
-- AVATARS
-- ============================================================

create policy "Users can upload their own avatar"
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'avatars'
  and (storage.foldername(name))[1] = auth.uid()::text
);

create policy "Users can update their own avatar"
on storage.objects
for update
to authenticated
using (
  bucket_id = 'avatars'
  and (storage.foldername(name))[1] = auth.uid()::text
)
with check (
  bucket_id = 'avatars'
  and (storage.foldername(name))[1] = auth.uid()::text
);

create policy "Users can delete their own avatar"
on storage.objects
for delete
to authenticated
using (
  bucket_id = 'avatars'
  and (storage.foldername(name))[1] = auth.uid()::text
);


-- ============================================================
-- LICENSES
-- ============================================================

create policy "Users can upload their own licenses"
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'licenses'
  and (storage.foldername(name))[1] = auth.uid()::text
);

create policy "Users can update their own licenses"
on storage.objects
for update
to authenticated
using (
  bucket_id = 'licenses'
  and (storage.foldername(name))[1] = auth.uid()::text
)
with check (
  bucket_id = 'licenses'
  and (storage.foldername(name))[1] = auth.uid()::text
);

create policy "Users can delete their own licenses"
on storage.objects
for delete
to authenticated
using (
  bucket_id = 'licenses'
  and (storage.foldername(name))[1] = auth.uid()::text
);


-- ============================================================
-- LICENSE READ ACCESS
-- ============================================================

create policy "Users can view their own licenses"
on storage.objects
for select
to authenticated
using (
  bucket_id = 'licenses'
  and (storage.foldername(name))[1] = auth.uid()::text
);


-- ============================================================
-- ADMIN LICENSE ACCESS
-- ============================================================

create policy "Admins can view licenses"
on storage.objects
for select
to authenticated
using (
  bucket_id = 'licenses'
  and public.is_admin()
);