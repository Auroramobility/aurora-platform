-- Aurora Mobility
-- Migration: 021_direct_messaging.sql
-- Purpose: Replace the legacy one-user message model with secure customer/admin conversations.

create table if not exists public.conversations (
  id uuid primary key default uuid_generate_v4(),
  customer_id uuid references auth.users(id) on delete cascade not null,
  application_id uuid references public.applications(id) on delete set null,
  ownership_plan_id uuid references public.ownership_plans(id) on delete set null,
  status text not null default 'open' check (status in ('open', 'closed')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  last_message_at timestamptz
);

create unique index if not exists conversations_customer_general_uidx
  on public.conversations(customer_id)
  where application_id is null and ownership_plan_id is null;

create unique index if not exists conversations_customer_application_uidx
  on public.conversations(customer_id, application_id)
  where application_id is not null;

create index if not exists conversations_customer_idx
  on public.conversations(customer_id, last_message_at desc nulls last);

create index if not exists conversations_application_idx
  on public.conversations(application_id);

create index if not exists conversations_plan_idx
  on public.conversations(ownership_plan_id);

alter table public.messages
  add column if not exists conversation_id uuid references public.conversations(id) on delete cascade,
  add column if not exists sender_user_id uuid references auth.users(id) on delete cascade,
  add column if not exists sender_role text,
  add column if not exists customer_read_at timestamptz,
  add column if not exists admin_read_at timestamptz;

-- Backfill one general conversation per existing message owner.
insert into public.conversations (customer_id, created_at, updated_at, last_message_at)
select distinct m.user_id, min(m.created_at), max(m.created_at), max(m.created_at)
from public.messages m
where not exists (
  select 1
  from public.conversations c
  where c.customer_id = m.user_id
    and c.application_id is null
    and c.ownership_plan_id is null
)
group by m.user_id;

update public.messages m
set conversation_id = c.id,
    sender_user_id = case when m.sender = 'admin' then null else m.user_id end,
    sender_role = case when m.sender = 'admin' then 'admin' else 'customer' end
from public.conversations c
where c.customer_id = m.user_id
  and c.application_id is null
  and c.ownership_plan_id is null
  and m.conversation_id is null;

-- Legacy admin messages did not retain an authenticated admin id. They remain
-- visible as historical messages but cannot be used as proof of a current sender.
-- New messages must always identify their authenticated sender.

alter table public.messages
  alter column conversation_id set not null,
  alter column sender_user_id drop not null,
  alter column sender_role set not null;

alter table public.messages
  add constraint messages_sender_role_check
  check (sender_role in ('customer', 'admin'));

create index if not exists messages_conversation_created_idx
  on public.messages(conversation_id, created_at asc);

create index if not exists messages_customer_unread_idx
  on public.messages(conversation_id, customer_read_at)
  where sender_role = 'admin' and customer_read_at is null;

create index if not exists messages_admin_unread_idx
  on public.messages(conversation_id, admin_read_at)
  where sender_role = 'customer' and admin_read_at is null;

-- Keep updated_at / last_message_at deterministic for all new messages.
create or replace function public.touch_conversation_after_message()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  update public.conversations
  set last_message_at = new.created_at,
      updated_at = now()
  where id = new.conversation_id;

  return new;
end;
$$;

drop trigger if exists messages_touch_conversation on public.messages;
create trigger messages_touch_conversation
after insert on public.messages
for each row execute function public.touch_conversation_after_message();

-- =========================
-- RLS
-- =========================

alter table public.conversations enable row level security;

drop policy if exists "Customers can view own conversations" on public.conversations;
create policy "Customers can view own conversations"
on public.conversations
for select
to authenticated
using (customer_id = auth.uid());

drop policy if exists "Admins can view conversations" on public.conversations;
create policy "Admins can view conversations"
on public.conversations
for select
to authenticated
using (public.is_admin());

drop policy if exists "Customers can create own conversations" on public.conversations;
create policy "Customers can create own conversations"
on public.conversations
for insert
to authenticated
with check (
  customer_id = auth.uid()
  and (
    (application_id is null and ownership_plan_id is null)
    or exists (
      select 1
      from public.applications a
      where a.id = application_id
        and a.user_id = auth.uid()
    )
    or exists (
      select 1
      from public.ownership_plans op
      join public.applications a on a.id = op.application_id
      where op.id = ownership_plan_id
        and a.user_id = auth.uid()
    )
  )
);

drop policy if exists "Admins can create conversations" on public.conversations;
create policy "Admins can create conversations"
on public.conversations
for insert
to authenticated
with check (public.is_admin());

drop policy if exists "Admins can update conversations" on public.conversations;
create policy "Admins can update conversations"
on public.conversations
for update
to authenticated
using (public.is_admin())
with check (public.is_admin());

-- Messages use the conversation participant as the authorization boundary.
drop policy if exists "Users can view own messages" on public.messages;
drop policy if exists "Users can send messages" on public.messages;

create policy "Participants can view conversation messages"
on public.messages
for select
to authenticated
using (
  exists (
    select 1
    from public.conversations c
    where c.id = messages.conversation_id
      and (c.customer_id = auth.uid() or public.is_admin())
  )
);

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

-- Read markers are controlled by a trusted function so a customer cannot mark
-- admin messages as read for another customer, and vice versa.
create or replace function public.mark_conversation_read(p_conversation_id uuid)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  v_is_admin boolean := public.is_admin();
begin
  if v_is_admin then
    update public.messages
    set admin_read_at = coalesce(admin_read_at, now())
    where conversation_id = p_conversation_id
      and sender_role = 'customer'
      and admin_read_at is null;
    return found;
  end if;

  if not exists (
    select 1 from public.conversations
    where id = p_conversation_id and customer_id = auth.uid()
  ) then
    return false;
  end if;

  update public.messages
  set customer_read_at = coalesce(customer_read_at, now())
  where conversation_id = p_conversation_id
    and sender_role = 'admin'
    and customer_read_at is null;

  return found;
end;
$$;

revoke all on function public.mark_conversation_read(uuid) from public;
grant execute on function public.mark_conversation_read(uuid) to authenticated;

-- Customers can ask for a general or application-linked thread without creating
-- duplicates. The function validates ownership and always returns the thread id.
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

  if p_application_id is not null and not exists (
    select 1 from public.applications
    where id = p_application_id and user_id = v_customer_id
  ) then
    return null;
  end if;

  if p_ownership_plan_id is not null and not exists (
    select 1
    from public.ownership_plans op
    join public.applications a on a.id = op.application_id
    where op.id = p_ownership_plan_id and a.user_id = v_customer_id
  ) then
    return null;
  end if;

  if p_application_id is not null and p_ownership_plan_id is not null and not exists (
    select 1
    from public.ownership_plans op
    where op.id = p_ownership_plan_id and op.application_id = p_application_id
  ) then
    return null;
  end if;

  select id into v_id
  from public.conversations
  where customer_id = v_customer_id
    and ((p_application_id is null and application_id is null) or application_id = p_application_id)
    and ((p_ownership_plan_id is null and ownership_plan_id is null) or ownership_plan_id = p_ownership_plan_id)
  limit 1;

  if v_id is not null then
    return v_id;
  end if;

  insert into public.conversations(customer_id, application_id, ownership_plan_id)
  values (v_customer_id, p_application_id, p_ownership_plan_id)
  returning id into v_id;

  return v_id;
end;
$$;

revoke all on function public.get_or_create_conversation(uuid, uuid) from public;
grant execute on function public.get_or_create_conversation(uuid, uuid) to authenticated;

comment on table public.conversations is 'Secure customer/admin communication threads. Messages are communication only and never authoritative business or payment state.';
comment on table public.messages is 'Customer/admin communication within a conversation. Financial or ownership state must be changed through trusted workflows, not messages.';
