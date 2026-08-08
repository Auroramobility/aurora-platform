-- Aurora Mobility
-- Migration: 012_ownership_plan_customer_workflow.sql
-- Customer-safe ownership plan review and response workflow.

alter table public.ownership_plans
  add column if not exists accepted_at timestamptz,
  add column if not exists declined_at timestamptz,
  add column if not exists activated_at timestamptz;

alter table public.ownership_plans
  alter column status set default 'draft';

alter table public.ownership_plans
  drop constraint if exists ownership_plans_status_check;

alter table public.ownership_plans
  add constraint ownership_plans_status_check
  check (status in ('draft', 'ready', 'accepted', 'declined', 'active', 'completed', 'paused', 'cancelled'));

-- Customers may read plans connected to their own applications. This policy
-- already existed historically; recreate it here so the intended boundary is explicit.
drop policy if exists "Users can view own ownership plans" on public.ownership_plans;
create policy "Users can view own ownership plans"
on public.ownership_plans
for select
to authenticated
using (
  exists (
    select 1
    from public.applications
    where applications.id = ownership_plans.application_id
      and applications.user_id = auth.uid()
  )
);

-- Customers do not receive a general UPDATE policy. They respond through a
-- narrowly scoped RPC that can only change a ready plan to accepted/declined.
drop policy if exists "Users can respond to ownership plans" on public.ownership_plans;

create or replace function public.respond_to_ownership_plan(
  p_plan_id uuid,
  p_decision text
)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  v_user_id uuid := auth.uid();
  v_application_id uuid;
  v_status text;
begin
  if v_user_id is null then
    return false;
  end if;

  if p_decision not in ('accept', 'decline') then
    return false;
  end if;

  select op.application_id, op.status
  into v_application_id, v_status
  from public.ownership_plans op
  join public.applications a on a.id = op.application_id
  where op.id = p_plan_id
    and a.user_id = v_user_id
    and a.status = 'approved'
  for update of op;

  if v_application_id is null or v_status <> 'ready' then
    return false;
  end if;

  if p_decision = 'accept' then
    update public.ownership_plans
    set status = 'accepted',
        accepted_at = coalesce(accepted_at, now()),
        declined_at = null
    where id = p_plan_id;
  else
    update public.ownership_plans
    set status = 'declined',
        declined_at = coalesce(declined_at, now()),
        accepted_at = null
    where id = p_plan_id;
  end if;

  return true;
end;
$$;

revoke all on function public.respond_to_ownership_plan(uuid, text) from public;
grant execute on function public.respond_to_ownership_plan(uuid, text) to authenticated;
