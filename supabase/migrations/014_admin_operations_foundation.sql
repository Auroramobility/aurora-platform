-- Aurora Mobility
-- Migration: 014_admin_operations_foundation.sql
-- Trusted Aurora operations layer for application review, identity verification,
-- and ownership-plan preparation/activation.

-- =========================
-- ADMIN ROLE + AUDIT FIELDS
-- =========================

alter table public.profiles
  add column if not exists role text not null default 'customer',
  add column if not exists identity_verified_at timestamptz,
  add column if not exists identity_verified_by uuid references auth.users(id);

alter table public.profiles
  drop constraint if exists profiles_role_check;

alter table public.profiles
  add constraint profiles_role_check
  check (role in ('customer', 'admin'));

alter table public.applications
  add column if not exists reviewed_at timestamptz,
  add column if not exists reviewed_by uuid references auth.users(id),
  add column if not exists rejection_reason text;

-- =========================
-- ADMIN AUTHORIZATION HELPER
-- =========================

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.profiles
    where profiles.user_id = auth.uid()
      and profiles.role = 'admin'
  );
$$;

revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to authenticated;

-- Prevent ordinary users from escalating themselves or marking their own
-- identity as verified. Admins may change these fields through trusted workflows.
create or replace function public.protect_profile_trusted_fields()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.is_admin() then
    if tg_op = 'INSERT' then
      new.role := 'customer';
      new.identity_verified := false;
      new.identity_verified_at := null;
      new.identity_verified_by := null;
    elsif auth.uid() = old.user_id then
      new.role := old.role;
      new.identity_verified := old.identity_verified;
      new.identity_verified_at := old.identity_verified_at;
      new.identity_verified_by := old.identity_verified_by;
    end if;
  end if;

  return new;
end;
$$;

drop trigger if exists protect_profile_trusted_fields on public.profiles;
drop trigger if exists protect_profile_trusted_fields_insert on public.profiles;
create trigger protect_profile_trusted_fields
before update on public.profiles
for each row
execute function public.protect_profile_trusted_fields();

create trigger protect_profile_trusted_fields_insert
before insert on public.profiles
for each row
execute function public.protect_profile_trusted_fields();

-- =========================
-- ADMIN READ ACCESS
-- =========================

drop policy if exists "Admins can view all profiles" on public.profiles;
create policy "Admins can view all profiles"
on public.profiles
for select
to authenticated
using (public.is_admin());

drop policy if exists "Admins can view all applications" on public.applications;
create policy "Admins can view all applications"
on public.applications
for select
to authenticated
using (public.is_admin());

drop policy if exists "Admins can view all ownership plans" on public.ownership_plans;
create policy "Admins can view all ownership plans"
on public.ownership_plans
for select
to authenticated
using (public.is_admin());

-- =========================
-- APPLICATION REVIEW
-- =========================

create or replace function public.review_application(
  p_application_id uuid,
  p_decision text,
  p_rejection_reason text default null
)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  v_current_status text;
begin
  if not public.is_admin() then
    return false;
  end if;

  if p_decision not in ('reviewing', 'approved', 'rejected') then
    return false;
  end if;

  select a.status
  into v_current_status
  from public.applications a
  join public.profiles p on p.user_id = a.user_id
  where a.id = p_application_id
  for update of a;

  if v_current_status is null then
    return false;
  end if;

  if p_decision = 'reviewing' and v_current_status <> 'pending' then
    return false;
  end if;

  if p_decision in ('approved', 'rejected')
     and v_current_status not in ('pending', 'reviewing') then
    return false;
  end if;

  if p_decision = 'rejected' and nullif(trim(p_rejection_reason), '') is null then
    return false;
  end if;

  if p_decision = 'approved' and not exists (
    select 1
    from public.applications a
    join public.profiles p on p.user_id = a.user_id
    where a.id = p_application_id
      and p.identity_verified = true
  ) then
    return false;
  end if;

  update public.applications
  set status = p_decision,
      reviewed_at = case
        when p_decision in ('approved', 'rejected') then coalesce(reviewed_at, now())
        else reviewed_at
      end,
      reviewed_by = case
        when p_decision in ('approved', 'rejected') then auth.uid()
        else reviewed_by
      end,
      approved_date = case
        when p_decision = 'approved' then coalesce(approved_date, now())
        when p_decision = 'rejected' then null
        else approved_date
      end,
      rejection_reason = case
        when p_decision = 'rejected' then nullif(trim(p_rejection_reason), '')
        else null
      end
  where id = p_application_id;

  return true;
end;
$$;

revoke all on function public.review_application(uuid, text, text) from public;
grant execute on function public.review_application(uuid, text, text) to authenticated;

-- =========================
-- IDENTITY VERIFICATION
-- =========================

create or replace function public.review_identity_verification(
  p_user_id uuid,
  p_verified boolean
)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.is_admin() then
    return false;
  end if;

  update public.profiles
  set identity_verified = p_verified,
      identity_verified_at = case when p_verified then now() else null end,
      identity_verified_by = case when p_verified then auth.uid() else null end
  where user_id = p_user_id;

  return found;
end;
$$;

revoke all on function public.review_identity_verification(uuid, boolean) from public;
grant execute on function public.review_identity_verification(uuid, boolean) to authenticated;

-- =========================
-- OWNERSHIP PLAN OPERATIONS
-- =========================

drop policy if exists "Admins can create ownership plans" on public.ownership_plans;
create policy "Admins can create ownership plans"
on public.ownership_plans
for insert
to authenticated
with check (
  public.is_admin()
  and exists (
    select 1
    from public.applications
    where applications.id = ownership_plans.application_id
      and applications.status = 'approved'
  )
);

drop policy if exists "Admins can update ownership plans" on public.ownership_plans;

create or replace function public.prepare_ownership_plan(
  p_plan_id uuid
)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  v_status text;
  v_application_status text;
  v_vehicle_price numeric;
  v_down_payment numeric;
  v_monthly_payment numeric;
  v_duration_months integer;
  v_remaining_balance numeric;
begin
  if not public.is_admin() then
    return false;
  end if;

  select op.status, a.status, op.vehicle_price, op.down_payment, op.monthly_payment, op.duration_months, op.remaining_balance
  into v_status, v_application_status, v_vehicle_price, v_down_payment, v_monthly_payment, v_duration_months, v_remaining_balance
  from public.ownership_plans op
  join public.applications a on a.id = op.application_id
  where op.id = p_plan_id
  for update of op;

  if v_status is null or v_status <> 'draft' or v_application_status <> 'approved' then
    return false;
  end if;

  if v_vehicle_price is null or v_down_payment is null or v_monthly_payment is null
     or v_duration_months is null or v_remaining_balance is null then
    return false;
  end if;

  update public.ownership_plans
  set status = 'ready'
  where id = p_plan_id;

  return true;
end;
$$;

revoke all on function public.prepare_ownership_plan(uuid) from public;
grant execute on function public.prepare_ownership_plan(uuid) to authenticated;

create or replace function public.activate_ownership_plan(
  p_plan_id uuid
)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  v_status text;
  v_application_status text;
begin
  if not public.is_admin() then
    return false;
  end if;

  select op.status, a.status
  into v_status, v_application_status
  from public.ownership_plans op
  join public.applications a on a.id = op.application_id
  where op.id = p_plan_id
  for update of op;

  if v_status is null or v_application_status <> 'approved' then
    return false;
  end if;

  if v_status <> 'accepted' then
    return false;
  end if;

  update public.ownership_plans
  set status = 'active',
      activated_at = coalesce(activated_at, now())
  where id = p_plan_id;

  return true;
end;
$$;

revoke all on function public.activate_ownership_plan(uuid) from public;
grant execute on function public.activate_ownership_plan(uuid) to authenticated;
