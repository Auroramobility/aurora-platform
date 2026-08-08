-- Keep application status timestamps consistent for the customer timeline.

create or replace function public.sync_application_status_timestamps()
returns trigger
language plpgsql
security invoker
set search_path = public
as $$
begin
  if new.status = 'approved' and old.status is distinct from 'approved' then
    new.approved_date = coalesce(new.approved_date, now());
  elsif new.status is distinct from 'approved' and old.status = 'approved' then
    new.approved_date = null;
  end if;

  return new;
end;
$$;

drop trigger if exists applications_sync_status_timestamps on public.applications;

create trigger applications_sync_status_timestamps
before update on public.applications
for each row
execute function public.sync_application_status_timestamps();
