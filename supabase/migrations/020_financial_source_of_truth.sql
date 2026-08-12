-- Aurora Mobility
-- Migration: 017_financial_source_of_truth.sql
-- Make financing_terms the contractual financial source of truth.
-- Payment obligations are represented by payment_schedule; actual money movement
-- is represented by payments and allocated atomically to schedule items.
-- No payment provider is integrated by this migration.

-- ============================================================
-- FINANCING TERMS: CONTRACTUAL SOURCE OF TRUTH
-- ============================================================

alter table public.financing_terms
  add column if not exists total_contract_amount numeric(14,2);

alter table public.financing_terms
  drop constraint if exists financing_terms_contract_total_check;

alter table public.financing_terms
  add constraint financing_terms_contract_total_check
  check (
    total_contract_amount is null
    or (
      total_contract_amount >= 0
      and (amount_financed is null or total_contract_amount >= amount_financed)
    )
  );

-- Existing plans may not have enough information to infer a contractual total
-- safely. Leave it NULL rather than inventing financial terms. New plans must
-- provide it before they can become ready.

-- ============================================================
-- PAYMENT SCHEDULE: OBLIGATIONS ONLY
-- ============================================================

alter table public.payment_schedule
  drop constraint if exists payment_schedule_status_check;

alter table public.payment_schedule
  add constraint payment_schedule_status_check
  check (status in ('scheduled', 'partially_paid', 'paid', 'overdue', 'cancelled'));

-- A payment schedule is an obligation, not a transaction ledger. amount_paid
-- is maintained by the trusted allocation function below, not by customers.
drop policy if exists "Admins can insert payment schedule" on public.payment_schedule;
drop policy if exists "Admins can update payment schedule" on public.payment_schedule;
drop policy if exists "Admins can delete payment schedule" on public.payment_schedule;

-- ============================================================
-- PAYMENT ALLOCATIONS: TRANSACTION -> OBLIGATION
-- ============================================================

create table if not exists public.payment_allocations (
  payment_id uuid not null references public.payments(id) on delete cascade,
  schedule_id uuid not null references public.payment_schedule(id) on delete restrict,
  amount numeric(14,2) not null,
  created_at timestamptz not null default now(),
  primary key (payment_id, schedule_id),
  constraint payment_allocations_amount_check check (amount > 0)
);

create index if not exists payment_allocations_schedule_idx
  on public.payment_allocations(schedule_id, created_at);

alter table public.payment_allocations enable row level security;

drop policy if exists "Users can view own payment allocations" on public.payment_allocations;
create policy "Users can view own payment allocations"
on public.payment_allocations
for select
to authenticated
using (
  exists (
    select 1
    from public.payments p
    join public.ownership_plans op on op.id = p.plan_id
    join public.applications a on a.id = op.application_id
    where p.id = payment_allocations.payment_id
      and a.user_id = auth.uid()
  )
);

drop policy if exists "Admins can view payment allocations" on public.payment_allocations;
create policy "Admins can view payment allocations"
on public.payment_allocations
for select
to authenticated
using (public.is_admin());

-- ============================================================
-- PAYMENT SCHEDULE MAINTENANCE
-- ============================================================

create or replace function public.sync_payment_schedule_status()
returns trigger
language plpgsql
as $$
begin
  if new.status <> 'cancelled' then
    if new.amount_paid >= new.amount_due then
      new.amount_paid := new.amount_due;
      new.status := 'paid';
      new.paid_at := coalesce(new.paid_at, now());
    elsif new.amount_paid > 0 then
      new.status := 'partially_paid';
      new.paid_at := null;
    elsif new.status <> 'overdue' then
      new.status := 'scheduled';
      new.paid_at := null;
    end if;
  end if;

  return new;
end;
$$;

drop trigger if exists sync_payment_schedule_status on public.payment_schedule;
create trigger sync_payment_schedule_status
before insert or update of amount_paid, amount_due, status on public.payment_schedule
for each row
execute function public.sync_payment_schedule_status();

-- ============================================================
-- ATOMIC PAYMENT ALLOCATION
-- ============================================================

create or replace function public.record_payment_allocation(
  p_payment_id uuid,
  p_schedule_id uuid,
  p_amount numeric
)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  v_payment_amount numeric;
  v_payment_status text;
  v_payment_plan_id uuid;
  v_schedule_terms_id uuid;
  v_schedule_amount_due numeric;
  v_schedule_amount_paid numeric;
  v_existing_allocation numeric;
  v_terms_plan_id uuid;
  v_new_allocated_total numeric;
begin
  if not public.is_admin() then
    raise exception 'Unauthorized';
  end if;

  if p_amount is null or p_amount <= 0 then
    raise exception 'Allocation amount must be greater than zero';
  end if;

  select amount, payment_status, plan_id
  into v_payment_amount, v_payment_status, v_payment_plan_id
  from public.payments
  where id = p_payment_id
  for update;

  if not found then
    raise exception 'Payment not found';
  end if;

  if v_payment_status <> 'completed' then
    raise exception 'Only completed payments can be allocated';
  end if;

  select ps.financing_terms_id, ps.amount_due, ps.amount_paid, ft.plan_id
  into v_schedule_terms_id, v_schedule_amount_due, v_schedule_amount_paid, v_terms_plan_id
  from public.payment_schedule ps
  join public.financing_terms ft on ft.id = ps.financing_terms_id
  where ps.id = p_schedule_id
  for update of ps;

  if not found then
    raise exception 'Payment schedule item not found';
  end if;

  if v_terms_plan_id <> v_payment_plan_id then
    raise exception 'Payment and schedule item belong to different ownership plans';
  end if;

  select coalesce(sum(amount), 0)
  into v_existing_allocation
  from public.payment_allocations
  where payment_id = p_payment_id;

  v_new_allocated_total := v_existing_allocation + p_amount;
  if v_new_allocated_total > v_payment_amount then
    raise exception 'Allocation exceeds payment amount';
  end if;

  if v_schedule_amount_paid + p_amount > v_schedule_amount_due then
    raise exception 'Allocation exceeds scheduled amount';
  end if;

  insert into public.payment_allocations(payment_id, schedule_id, amount)
  values (p_payment_id, p_schedule_id, p_amount)
  on conflict (payment_id, schedule_id)
  do update set amount = public.payment_allocations.amount + excluded.amount;

  update public.payment_schedule
  set amount_paid = v_schedule_amount_paid + p_amount,
      updated_at = now()
  where id = p_schedule_id;

  return true;
end;
$$;

revoke all on function public.record_payment_allocation(uuid, uuid, numeric) from public;
grant execute on function public.record_payment_allocation(uuid, uuid, numeric) to authenticated;

-- ============================================================
-- DRAFT PLAN CREATION: TERMS + SCHEDULE ARE CREATED TOGETHER
-- ============================================================
drop function if exists public.create_draft_ownership_plan(uuid,text,numeric,numeric,numeric,integer,numeric,numeric);

create or replace function public.create_draft_ownership_plan(
  p_application_id uuid,
  p_currency text,
  p_vehicle_price numeric,
  p_down_payment numeric,
  p_monthly_payment numeric,
  p_term_months integer,
  p_total_contract_amount numeric,
  p_annual_interest_rate numeric default null
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_plan_id uuid;
  v_financing_id uuid;
  v_installment integer;
  v_due_date date;
  v_amount numeric;
  v_last_amount numeric;
  v_amount_financed numeric;
begin
  if not public.is_admin() then
    raise exception 'Unauthorized';
  end if;

  if p_currency is null or p_currency !~ '^[A-Z]{3}$' then
    raise exception 'Invalid currency';
  end if;

  if p_vehicle_price < 0 or p_down_payment < 0 or p_monthly_payment <= 0
     or p_total_contract_amount <= 0 or p_term_months <= 0 then
    raise exception 'Invalid financial terms';
  end if;

  if p_down_payment > p_vehicle_price then
    raise exception 'Down payment cannot exceed vehicle price';
  end if;

  if p_annual_interest_rate is not null and p_annual_interest_rate < 0 then
    raise exception 'Invalid interest rate';
  end if;

  v_amount_financed := p_vehicle_price - p_down_payment;
  if p_total_contract_amount < v_amount_financed then
    raise exception 'Contract total cannot be less than amount financed';
  end if;

  -- The stated monthly payment and term must describe a valid schedule.
  -- The final installment may be a small contractual adjustment so that the
  -- schedule reconciles exactly to the declared contract total.
  v_last_amount := p_total_contract_amount - (p_monthly_payment * (p_term_months - 1));
  if v_last_amount <= 0 then
    raise exception 'Monthly payment and term do not produce a valid contract schedule';
  end if;

  perform 1
  from public.applications
  where id = p_application_id
    and status = 'approved'
  for update;

  if not found then
    raise exception 'Only approved applications can receive an ownership plan';
  end if;

  if exists (select 1 from public.ownership_plans where application_id = p_application_id) then
    raise exception 'An ownership plan already exists for this application';
  end if;

  insert into public.ownership_plans (application_id, status)
  values (p_application_id, 'draft')
  returning id into v_plan_id;

  insert into public.financing_terms (
    plan_id,
    currency,
    vehicle_price,
    down_payment,
    amount_financed,
    total_contract_amount,
    annual_interest_rate,
    monthly_payment,
    term_months
  ) values (
    v_plan_id,
    p_currency,
    p_vehicle_price,
    p_down_payment,
    v_amount_financed,
    p_total_contract_amount,
    p_annual_interest_rate,
    p_monthly_payment,
    p_term_months
  ) returning id into v_financing_id;

  v_due_date := current_date;
  for v_installment in 1..p_term_months loop
    v_amount := case
      when v_installment = p_term_months then v_last_amount
      else p_monthly_payment
    end;

    insert into public.payment_schedule (
      financing_terms_id,
      installment_number,
      due_date,
      amount_due
    ) values (
      v_financing_id,
      v_installment,
      (v_due_date + make_interval(months => v_installment - 1))::date,
      v_amount
    );
  end loop;

  return v_plan_id;
end;
$$;

revoke all on function public.create_draft_ownership_plan(uuid, text, numeric, numeric, numeric, integer, numeric, numeric) from public;
grant execute on function public.create_draft_ownership_plan(uuid, text, numeric, numeric, numeric, integer, numeric, numeric) to authenticated;

-- ============================================================
-- PREPARE PLAN: VERIFY CONTRACT + SCHEDULE RECONCILE
-- ============================================================

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
  v_contract_total numeric;
  v_schedule_total numeric;
  v_schedule_count integer;
  v_term_months integer;
begin
  if not public.is_admin() then
    return false;
  end if;

  select op.status, a.status, ft.total_contract_amount, ft.term_months
  into v_status, v_application_status, v_contract_total, v_term_months
  from public.ownership_plans op
  join public.applications a on a.id = op.application_id
  join public.financing_terms ft on ft.plan_id = op.id
  where op.id = p_plan_id
  for update of op;

  if v_status is null or v_status <> 'draft' or v_application_status <> 'approved' then
    return false;
  end if;

  select coalesce(sum(amount_due), 0), count(*)
  into v_schedule_total, v_schedule_count
  from public.payment_schedule ps
  join public.financing_terms ft on ft.id = ps.financing_terms_id
  where ft.plan_id = p_plan_id;

  if v_contract_total is null or v_schedule_total <> v_contract_total then
    return false;
  end if;

  if v_term_months is null or v_schedule_count <> v_term_months then
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

-- ============================================================
-- OWNERSHIP PLAN NO LONGER DUPLICATES FINANCIAL TERMS
-- ============================================================

-- The financing source of truth now lives entirely in financing_terms and
-- payment_schedule. Existing application code must read those tables instead.
-- Remove the legacy duplicated financial columns after all historical values
-- have been migrated by 016.

alter table public.ownership_plans
  drop constraint if exists ownership_plans_financial_integrity_check,
  drop constraint if exists ownership_plans_payment_term_integrity_check;

alter table public.ownership_plans
  drop column if exists vehicle_price,
  drop column if exists down_payment,
  drop column if exists monthly_payment,
  drop column if exists duration_months,
  drop column if exists remaining_balance;

-- Audit only ownership-state fields; financial terms are audited separately
-- through their own table in future operational work.
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
        'activated_at', old.activated_at
      ) end,
      jsonb_build_object(
        'application_id', new.application_id,
        'status', new.status,
        'accepted_at', new.accepted_at,
        'activated_at', new.activated_at
      )
    );
  end if;
  return new;
end;
$$;
