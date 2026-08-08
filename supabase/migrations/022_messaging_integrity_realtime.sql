-- Aurora Mobility
-- Migration: 022_messaging_integrity_realtime.sql
-- Purpose: Harden conversation relationships, centralize close/reopen authority,
-- and enable Supabase Realtime for customer/admin messaging.

-- A conversation may reference an application and/or ownership plan, but when
-- both are present they MUST describe the same customer relationship.
create or replace function public.is_valid_customer_conversation(
  p_customer_id uuid,
  p_application_id uuid,
  p_ownership_plan_id uuid
)
returns boolean
language plpgsql
stable
security definer
set search_path = public
as $$
begin
  if p_customer_id is null then
    return false;
  end if;

  if p_application_id is null and p_ownership_plan_id is null then
    return true;
  end if;

  if p_application_id is not null and not exists (
    select 1 from public.applications a
    where a.id = p_application_id
      and a.user_id = p_customer_id
  ) then
    return false;
  end if;

  if p_ownership_plan_id is not null and not exists (
    select 1
    from public.ownership_plans op
    join public.applications a on a.id = op.application_id
    where op.id = p_ownership_plan_id
      and a.user_id = p_customer_id
  ) then
    return false;
  end if;

  if p_application_id is not null
     and p_ownership_plan_id is not null
     and not exists (
       select 1
       from public.ownership_plans op
       where op.id = p_ownership_plan_id
         and op.application_id = p_application_id
     ) then
    return false;
  end if;

  return true;
end;
$$;

revoke all on function public.is_valid_customer_conversation(uuid, uuid, uuid) from public;
grant execute on function public.is_valid_customer_conversation(uuid, uuid, uuid) to authenticated;

-- Replace the broader insert policy with one relationship-consistency check.
drop policy if exists "Customers can create own conversations" on public.conversations;
create policy "Customers can create own conversations"
on public.conversations
for insert
to authenticated
with check (
  customer_id = auth.uid()
  and public.is_valid_customer_conversation(customer_id, application_id, ownership_plan_id)
);

-- Customers never update conversations directly. Admins change lifecycle state
-- through the trusted RPC below, which also writes an audit entry.
drop policy if exists "Admins can update conversations" on public.conversations;

create or replace function public.set_conversation_status(
  p_conversation_id uuid,
  p_status text
)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  v_old_status text;
  v_customer_id uuid;
begin
  if auth.uid() is null or not public.is_admin() then
    return false;
  end if;

  if p_status not in ('open', 'closed') then
    return false;
  end if;

  select status, customer_id
  into v_old_status, v_customer_id
  from public.conversations
  where id = p_conversation_id
  for update;

  if not found then
    return false;
  end if;

  if v_old_status = p_status then
    return true;
  end if;

  update public.conversations
  set status = p_status,
      updated_at = now()
  where id = p_conversation_id;

  perform public.write_admin_audit_log(
    case when p_status = 'closed' then 'conversation_closed' else 'conversation_reopened' end,
    'conversation',
    p_conversation_id,
    jsonb_build_object('status', v_old_status, 'customer_id', v_customer_id),
    jsonb_build_object('status', p_status, 'customer_id', v_customer_id)
  );

  return true;
end;
$$;

revoke all on function public.set_conversation_status(uuid, text) from public;
grant execute on function public.set_conversation_status(uuid, text) to authenticated;

-- Realtime delivers inserts/updates to authorized clients. RLS remains the
-- authorization boundary for which rows a subscriber can receive.
do $$
begin
  alter publication supabase_realtime add table public.messages;
exception
  when duplicate_object then null;
  when undefined_object then null;
end $$;

-- Keep current audit trigger compatible with the post-financing ownership schema.
-- The original trigger referenced financial columns removed from ownership_plans.
create or replace function public.audit_admin_ownership_plan_changes()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if public.is_admin() then
    perform public.write_admin_audit_log(
      case
        when tg_op = 'INSERT' then 'ownership_plan_created'
        when new.status is distinct from old.status then 'ownership_plan_status_changed'
        else 'ownership_plan_updated'
      end,
      'ownership_plan',
      new.id,
      case when tg_op = 'INSERT' then null else jsonb_build_object(
        'application_id', old.application_id,
        'status', old.status,
        'accepted_at', old.accepted_at,
        'activated_at', old.activated_at,
        'declined_at', old.declined_at
      ) end,
      jsonb_build_object(
        'application_id', new.application_id,
        'status', new.status,
        'accepted_at', new.accepted_at,
        'activated_at', new.activated_at,
        'declined_at', new.declined_at
      )
    );
  end if;
  return new;
end;
$$;
