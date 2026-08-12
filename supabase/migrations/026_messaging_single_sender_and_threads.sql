-- Aurora Mobility
-- Migration: 023_messaging_single_sender_and_threads.sql
-- Purpose: Make sender_user_id/sender_role the sole sender model, scope Realtime,
-- and allow a new open thread after an earlier conversation is closed.

-- Historical admin messages may not have an authenticated sender id. Preserve
-- those records, but remove the legacy sender/user columns so new data has one
-- authoritative sender model.
alter table public.messages
  drop column if exists sender,
  drop column if exists user_id;

-- A customer may have one OPEN thread for a general conversation and one OPEN
-- thread per application. Closed threads remain immutable history and do not
-- block creation of a new open thread.
drop index if exists public.conversations_customer_general_uidx;
drop index if exists public.conversations_customer_application_uidx;

create unique index if not exists conversations_customer_general_open_uidx
  on public.conversations(customer_id)
  where application_id is null
    and ownership_plan_id is null
    and status = 'open';

create unique index if not exists conversations_customer_application_open_uidx
  on public.conversations(customer_id, application_id)
  where application_id is not null
    and status = 'open';

create unique index if not exists conversations_customer_ownership_plan_open_uidx
  on public.conversations(customer_id, ownership_plan_id)
  where ownership_plan_id is not null
    and application_id is null
    and status = 'open';

-- New messages must always identify their authenticated sender. Historical
-- imported admin messages may retain a null sender_user_id because the original
-- system did not store the admin's auth identity.
drop policy if exists "Customers can send conversation messages" on public.messages;
create policy "Customers can send conversation messages"
on public.messages
for insert
to authenticated
with check (
  sender_user_id = auth.uid()
  and sender_role = 'customer'
  and exists (
    select 1
    from public.conversations c
    where c.id = messages.conversation_id
      and c.customer_id = auth.uid()
      and c.status = 'open'
  )
);

drop policy if exists "Admins can send conversation messages" on public.messages;
create policy "Admins can send conversation messages"
on public.messages
for insert
to authenticated
with check (
  sender_user_id = auth.uid()
  and sender_role = 'admin'
  and public.is_admin()
  and exists (
    select 1
    from public.conversations c
    where c.id = messages.conversation_id
      and c.status = 'open'
  )
);

-- Return the existing OPEN thread only. If the previous thread was closed,
-- create a new OPEN thread instead. ON CONFLICT DO NOTHING handles two tabs
-- attempting to start the same new thread concurrently.
create or replace function public.get_or_create_conversation(
  p_application_id uuid default null,
  p_ownership_plan_id uuid default null
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_customer_id uuid := auth.uid();
  v_id uuid;
begin
  if v_customer_id is null then
    return null;
  end if;

  if not public.is_valid_customer_conversation(
    v_customer_id,
    p_application_id,
    p_ownership_plan_id
  ) then
    return null;
  end if;

  select id into v_id
  from public.conversations
  where customer_id = v_customer_id
    and status = 'open'
    and ((p_application_id is null and application_id is null) or application_id = p_application_id)
    and ((p_ownership_plan_id is null and ownership_plan_id is null) or ownership_plan_id = p_ownership_plan_id)
  order by created_at asc
  limit 1;

  if v_id is not null then
    return v_id;
  end if;

  insert into public.conversations(customer_id, application_id, ownership_plan_id)
  values (v_customer_id, p_application_id, p_ownership_plan_id)
  on conflict do nothing
  returning id into v_id;

  if v_id is not null then
    return v_id;
  end if;

  select id into v_id
  from public.conversations
  where customer_id = v_customer_id
    and status = 'open'
    and ((p_application_id is null and application_id is null) or application_id = p_application_id)
    and ((p_ownership_plan_id is null and ownership_plan_id is null) or ownership_plan_id = p_ownership_plan_id)
  order by created_at asc
  limit 1;

  return v_id;
end;
$$;

revoke all on function public.get_or_create_conversation(uuid, uuid) from public;
grant execute on function public.get_or_create_conversation(uuid, uuid) to authenticated;

comment on column public.messages.sender_user_id is 'Authenticated sender identity for all new messages. Null is retained only for legacy imported admin messages.';
comment on column public.messages.sender_role is 'Authoritative sender role: customer or admin.';
