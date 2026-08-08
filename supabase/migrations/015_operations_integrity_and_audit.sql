-- Aurora Mobility
-- Migration: 015_operations_integrity_and_audit.sql
-- Enforce one ownership plan per application and record trusted operations.

-- =========================
-- ONE PLAN PER APPLICATION
-- =========================

create unique index if not exists ownership_plans_one_per_application_idx
  on public.ownership_plans(application_id);

-- =========================
-- OPERATIONS AUDIT LOG
-- =========================

create table if not exists public.admin_audit_log (
  id uuid primary key default gen_random_uuid(),
  actor_id uuid not null references auth.users(id),
  action text not null,
  entity_type text not null,
  entity_id uuid not null,
  before_state jsonb,
  after_state jsonb,
  created_at timestamptz not null default now()
);

create index if not exists admin_audit_log_entity_idx
  on public.admin_audit_log(entity_type, entity_id, created_at desc);

create index if not exists admin_audit_log_actor_idx
  on public.admin_audit_log(actor_id, created_at desc);

alter table public.admin_audit_log enable row level security;

drop policy if exists "Admins can view audit log" on public.admin_audit_log;
create policy "Admins can view audit log"
on public.admin_audit_log
for select
to authenticated
using (public.is_admin());

create or replace function public.write_admin_audit_log(
  p_action text,
  p_entity_type text,
  p_entity_id uuid,
  p_before jsonb default null,
  p_after jsonb default null
)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if auth.uid() is null or not public.is_admin() then
    return;
  end if;

  insert into public.admin_audit_log (
    actor_id, action, entity_type, entity_id, before_state, after_state
  )
  values (
    auth.uid(), p_action, p_entity_type, p_entity_id, p_before, p_after
  );
end;
$$;

revoke all on function public.write_admin_audit_log(text, text, uuid, jsonb, jsonb) from public;
grant execute on function public.write_admin_audit_log(text, text, uuid, jsonb, jsonb) to authenticated;

-- Audit trusted changes made by admins. Customer RPCs are intentionally not
-- treated as admin operations and therefore do not create admin audit rows.
create or replace function public.audit_admin_application_changes()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if public.is_admin() then
    perform public.write_admin_audit_log(
      case
        when tg_op = 'INSERT' then 'application_created'
        when new.status is distinct from old.status then 'application_status_changed'
        else 'application_updated'
      end,
      'application',
      new.id,
      case when tg_op = 'INSERT' then null else jsonb_build_object(
        'status', old.status,
        'reviewed_at', old.reviewed_at,
        'reviewed_by', old.reviewed_by,
        'approved_date', old.approved_date,
        'rejection_reason', old.rejection_reason
      ) end,
      jsonb_build_object(
        'status', new.status,
        'reviewed_at', new.reviewed_at,
        'reviewed_by', new.reviewed_by,
        'approved_date', new.approved_date,
        'rejection_reason', new.rejection_reason
      )
    );
  end if;
  return new;
end;
$$;

drop trigger if exists audit_admin_application_changes on public.applications;
create trigger audit_admin_application_changes
after insert or update on public.applications
for each row
execute function public.audit_admin_application_changes();

create or replace function public.audit_admin_profile_changes()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if public.is_admin() and (
    new.identity_verified is distinct from old.identity_verified
    or new.identity_verified_at is distinct from old.identity_verified_at
    or new.identity_verified_by is distinct from old.identity_verified_by
    or new.role is distinct from old.role
  ) then
    perform public.write_admin_audit_log(
      'profile_trusted_fields_changed',
      'profile',
      new.user_id,
      jsonb_build_object(
        'user_id', old.user_id,
        'role', old.role,
        'identity_verified', old.identity_verified,
        'identity_verified_at', old.identity_verified_at,
        'identity_verified_by', old.identity_verified_by
      ),
      jsonb_build_object(
        'user_id', new.user_id,
        'role', new.role,
        'identity_verified', new.identity_verified,
        'identity_verified_at', new.identity_verified_at,
        'identity_verified_by', new.identity_verified_by
      )
    );
  end if;
  return new;
end;
$$;

drop trigger if exists audit_admin_profile_changes on public.profiles;
create trigger audit_admin_profile_changes
after update on public.profiles
for each row
execute function public.audit_admin_profile_changes();

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
        'vehicle_price', old.vehicle_price,
        'down_payment', old.down_payment,
        'monthly_payment', old.monthly_payment,
        'duration_months', old.duration_months,
        'remaining_balance', old.remaining_balance,
        'accepted_at', old.accepted_at,
        'activated_at', old.activated_at
      ) end,
      jsonb_build_object(
        'application_id', new.application_id,
        'status', new.status,
        'vehicle_price', new.vehicle_price,
        'down_payment', new.down_payment,
        'monthly_payment', new.monthly_payment,
        'duration_months', new.duration_months,
        'remaining_balance', new.remaining_balance,
        'accepted_at', new.accepted_at,
        'activated_at', new.activated_at
      )
    );
  end if;
  return new;
end;
$$;

drop trigger if exists audit_admin_ownership_plan_changes on public.ownership_plans;
create trigger audit_admin_ownership_plan_changes
after insert or update on public.ownership_plans
for each row
execute function public.audit_admin_ownership_plan_changes();
