-- Aurora Mobility
-- Migration 019: Make financing terminology and payment timing explicit.
-- The financing_terms table remains the contractual financial source of truth.
-- This migration does not calculate financing; it records approved terms.

-- ============================================================
-- FINANCING TERMS: UNAMBIGUOUS CONTRACT TERMS
-- ============================================================

alter table public.financing_terms
  rename column total_contract_amount to total_financed_repayment;

alter table public.financing_terms
  add column if not exists first_payment_date date,
  add column if not exists payment_frequency text not null default 'monthly';

drop constraint if exists financing_terms_contract_total_check on public.financing_terms;
alter table public.financing_terms
  add constraint financing_terms_total_financed_repayment_check
  check (
    total_financed_repayment is null
    or (
      total_financed_repayment >= 0
      and (amount_financed is null or total_financed_repayment >= amount_financed)
    )
  );

drop constraint if exists financing_terms_payment_frequency_check on public.financing_terms;
alter table public.financing_terms
  add constraint financing_terms_payment_frequency_check
  check (payment_frequency in ('monthly'));

-- New financing contracts must have a first payment date once they are prepared.
drop constraint if exists financing_terms_first_payment_check on public.financing_terms;
alter table public.financing_terms
  add constraint financing_terms_first_payment_check
  check (
    first_payment_date is null
    or first_payment_date >= created_at::date
  );

-- ============================================================
-- DRAFT PLAN CREATION: RECORD APPROVED TERMS, DO NOT CALCULATE THEM
-- ============================================================

-- Migration 017 used the same PostgreSQL function signature. Remove it before
-- creating the new signature so there is exactly one draft-plan RPC.
drop function if exists public.create_draft_ownership_plan(
  uuid, text, numeric, numeric, numeric, integer, numeric, numeric
);

create or replace function public.create_draft_ownership_plan(
  p_application_id uuid,
  p_currency text,
  p_vehicle_price numeric,
  p_down_payment numeric,
  p_monthly_payment numeric,
  p_term_months integer,
  p_total_financed_repayment numeric,
  p_first_payment_date date,
  p_payment_frequency text default 'monthly',
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

  if p_payment_frequency <> 'monthly' then
    raise exception 'Unsupported payment frequency';
  end if;

  if p_first_payment_date is null or p_first_payment_date < current_date then
    raise exception 'First payment date must be today or later';
  end if;

  if p_vehicle_price < 0
     or p_down_payment < 0
     or p_monthly_payment <= 0
     or p_total_financed_repayment <= 0
     or p_term_months <= 0 then
    raise exception 'Invalid financial terms';
  end if;

  if p_down_payment > p_vehicle_price then
    raise exception 'Down payment cannot exceed vehicle price';
  end if;

  if p_annual_interest_rate is not null and p_annual_interest_rate < 0 then
    raise exception 'Invalid interest rate';
  end if;

  v_amount_financed := p_vehicle_price - p_down_payment;
  if p_total_financed_repayment < v_amount_financed then
    raise exception 'Total financed repayment cannot be less than amount financed';
  end if;

  -- Aurora records approved financing terms; it does not calculate interest.
  -- The schedule is reconciled to the declared total, with only the final
  -- installment adjusted for exact cents.
  v_last_amount := p_total_financed_repayment - (p_monthly_payment * (p_term_months - 1));
  if v_last_amount <= 0 then
    raise exception 'Monthly payment and term do not produce a valid repayment schedule';
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
    total_financed_repayment,
    annual_interest_rate,
    monthly_payment,
    term_months,
    first_payment_date,
    payment_frequency
  ) values (
    v_plan_id,
    p_currency,
    p_vehicle_price,
    p_down_payment,
    v_amount_financed,
    p_total_financed_repayment,
    p_annual_interest_rate,
    p_monthly_payment,
    p_term_months,
    p_first_payment_date,
    p_payment_frequency
  ) returning id into v_financing_id;

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
      (p_first_payment_date + make_interval(months => v_installment - 1))::date,
      v_amount
    );
  end loop;

  return v_plan_id;
end;
$$;

revoke all on function public.create_draft_ownership_plan(uuid, text, numeric, numeric, numeric, integer, numeric, date, text, numeric) from public;
grant execute on function public.create_draft_ownership_plan(uuid, text, numeric, numeric, numeric, integer, numeric, date, text, numeric) to authenticated;

-- ============================================================
-- PREPARE PLAN: VERIFY TERMS + SCHEDULE + PAYMENT DATE
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
  v_total_financed_repayment numeric;
  v_schedule_total numeric;
  v_schedule_count integer;
  v_term_months integer;
  v_first_payment_date date;
  v_first_schedule_date date;
begin
  if not public.is_admin() then
    return false;
  end if;

  select op.status,
         a.status,
         ft.total_financed_repayment,
         ft.term_months,
         ft.first_payment_date
  into v_status,
       v_application_status,
       v_total_financed_repayment,
       v_term_months,
       v_first_payment_date
  from public.ownership_plans op
  join public.applications a on a.id = op.application_id
  join public.financing_terms ft on ft.plan_id = op.id
  where op.id = p_plan_id
  for update of op;

  if v_status is null
     or v_status <> 'draft'
     or v_application_status <> 'approved'
     or v_total_financed_repayment is null
     or v_first_payment_date is null then
    return false;
  end if;

  select coalesce(sum(amount_due), 0), count(*), min(due_date)
  into v_schedule_total, v_schedule_count, v_first_schedule_date
  from public.payment_schedule ps
  join public.financing_terms ft on ft.id = ps.financing_terms_id
  where ft.plan_id = p_plan_id;

  if v_schedule_total <> v_total_financed_repayment
     or v_schedule_count <> v_term_months
     or v_first_schedule_date <> v_first_payment_date then
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

comment on column public.financing_terms.amount_financed is
  'Principal amount financed: vehicle price minus upfront down payment.';
comment on column public.financing_terms.total_financed_repayment is
  'Total amount scheduled to be repaid through financing installments; excludes upfront down payment.';
comment on column public.financing_terms.first_payment_date is
  'Contractual date of the first scheduled financing installment.';
comment on column public.financing_terms.payment_frequency is
  'Payment cadence. Aurora currently supports monthly schedules only.';
comment on column public.financing_terms.annual_interest_rate is
  'Approved/reference financing rate supplied by the financing source. Aurora does not calculate it in this workflow.';
