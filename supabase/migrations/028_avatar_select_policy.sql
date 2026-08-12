-- ============================================================
-- Aurora Avatar Storage Read Policy
-- ============================================================

create policy "Users can view their own avatar"
on storage.objects
for select
to authenticated
using (
  bucket_id = 'avatars'
  and (storage.foldername(name))[1] = auth.uid()::text
);