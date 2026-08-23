alter table public.application_financing_requests
enable row level security;

create policy "Users can create own financing request"
on public.application_financing_requests
for insert
to authenticated
with check (
  exists (
    select 1
    from public.applications a
    where a.id = application_financing_requests.application_id
      and a.user_id = auth.uid()
  )
);
