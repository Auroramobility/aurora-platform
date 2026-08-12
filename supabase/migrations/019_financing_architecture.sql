-- Aurora Mobility
-- Migration: 016_financing_architecture.sql
-- Establish a clean separation between ownership terms, scheduled obligations,
-- and actual payment transactions. No payment provider is integrated here.

-- =========================
-- FINANCING TERMS
-- =========================

create table if not exists public.financing_terms (
  id uuid primary key default extensions.uuid_generate_v4(),
  plan_id uuid not null references public.ownership_plans(id) on delete cascade,
  currency text not null default 'USD',
  vehicle_price numeric(14,2),
  down_payment numeric(14,2),
  amount_financed numeric(14,2),
  annual_interest_rate numeric(7,4),
  monthly_payment numeric(14,2),
  term_months integer,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint financing_terms_plan_unique unique(plan_id),
  constraint financing_terms_currency_check check (currency ~ '^[A-Z]{3}$'),
  constraint financing_terms_nonnegative_check check (
    (vehicle_price is null or vehicle_price >= 0)
    and (down_payment is null or down_payment >= 0)
    and (amount_financed is null or amount_financed >= 0)
    and (annual_interest_rate is null or annual_interest_rate >= 0)
    and (monthly_payment is null or monthly_payment >= 0)
    and (term_months is null or term_months > 0)
  ),
  constraint financing_terms_down_payment_check check (
    vehicle_price is null
    or down_payment is null
    or down_payment <= vehicle_price
  ),
  constraint financing_terms_amount_check check (
    vehicle_price is null
    or down_payment is null
    or amount_financed is null
    or amount_financed = vehicle_price - down_payment
  ),
  constraint financing_terms_payment_term_check check (
    monthly_payment is null or term_months is not null
  )
);

create index if not exists financing_terms_plan_idx
  on public.financing_terms(plan_id);

alter table public.financing_terms enable row level security;

drop policy if exists "Users can view own financing terms" on public.financing_terms;
create policy "Users can view own financing terms"
on public.financing_terms
for select
to authenticated
using (
  exists (
    select 1
    from public.ownership_plans op
    join public.applications a on a.id = op.application_id
    where op.id = financing_terms.plan_id
      and a.user_id = auth.uid()
  )
);

drop policy if exists "Admins can view financing terms" on public.financing_terms;
create policy "Admins can view financing terms"
on public.financing_terms
for select
to authenticated
using (public.is_admin());

-- =========================
-- PAYMENT SCHEDULE
-- =========================

create table if not exists public.payment_schedule (
  id uuid primary key default extensions.uuid_generate_v4(),
  financing_terms_id uuid not null references public.financing_terms(id) on delete cascade,
  installment_number integer not null,
  due_date date not null,
  amount_due numeric(14,2) not null,
  amount_paid numeric(14,2) not null default 0,
  status text not null default 'scheduled',
  paid_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint payment_schedule_unique_installment unique(financing_terms_id, installment_number),
  constraint payment_schedule_installment_check check (installment_number > 0),
  constraint payment_schedule_amount_check check (amount_due > 0 and amount_paid >= 0 and amount_paid <= amount_due),
  constraint payment_schedule_status_check check (status in ('scheduled', 'partially_paid', 'paid', 'overdue', 'cancelled'))
);

create index if not exists payment_schedule_terms_due_idx
  on public.payment_schedule(financing_terms_id, due_date);

alter table public.payment_schedule enable row level security;

drop policy if exists "Users can view own payment schedule" on public.payment_schedule;
create policy "Users can view own payment schedule"
on public.payment_schedule
for select
to authenticated
using (
  exists (
    select 1
    from public.financing_terms ft
    join public.ownership_plans op on op.id = ft.plan_id
    join public.applications a on a.id = op.application_id
    where ft.id = payment_schedule.financing_terms_id
      and a.user_id = auth.uid()
  )
);

drop policy if exists "Admins can view payment schedule" on public.payment_schedule;
create policy "Admins can view payment schedule"
on public.payment_schedule
for select
to authenticated
using (public.is_admin());

-- =========================
-- PAYMENT TRANSACTIONS
-- =========================

alter table public.payments
  add column if not exists schedule_id uuid references public.payment_schedule(id) on delete set null,
  add column if not exists provider text,
  add column if not exists provider_transaction_id text,
  add column if not exists currency text default 'USD',
  add column if not exists metadata jsonb,
  add column if not exists created_at timestamptz default now(),
  add column if not exists updated_at timestamptz default now();

alter table public.payments
  drop constraint if exists payments_status_check;

alter table public.payments
  add constraint payments_status_check
  check (payment_status in ('pending', 'processing', 'completed', 'failed', 'refunded', 'cancelled'));

alter table public.payments
  drop constraint if exists payments_amount_check;

alter table public.payments
  add constraint payments_amount_check
  check (amount > 0);

alter table public.payments
  drop constraint if exists payments_currency_check;

alter table public.payments
  add constraint payments_currency_check
  check (currency is null or currency ~ '^[A-Z]{3}$');

create index if not exists payments_schedule_idx
  on public.payments(schedule_id, payment_date desc);

create unique index if not exists payments_provider_transaction_unique_idx
  on public.payments(provider, provider_transaction_id)
  where provider is not null and provider_transaction_id is not null;

-- Existing customer SELECT policy remains valid through plan_id. No customer
-- INSERT/UPDATE/DELETE policies are created: payment records are trusted state.
drop policy if exists "Admins can view payments" on public.payments;
create policy "Admins can view payments"
on public.payments
for select
to authenticated
using (public.is_admin());

-- =========================
-- TIMESTAMP MAINTENANCE
-- =========================

drop trigger if exists financing_terms_set_updated_at on public.financing_terms;
create trigger financing_terms_set_updated_at
before update on public.financing_terms
for each row
execute function public.set_updated_at();

drop trigger if exists payment_schedule_set_updated_at on public.payment_schedule;
create trigger payment_schedule_set_updated_at
before update on public.payment_schedule
for each row
execute function public.set_updated_at();

drop trigger if exists payments_set_updated_at on public.payments;
create trigger payments_set_updated_at
before update on public.payments
for each row
execute function public.set_updated_at();

-- =========================
-- BACKFILL EXISTING OWNERSHIP PLANS
-- =========================

insert into public.financing_terms (
  plan_id,
  currency,
  vehicle_price,
  down_payment,
  amount_financed,
  monthly_payment,
  term_months
)
select
  op.id,
  coalesce(nullif(upper(p.currency), ''), 'USD'),
  op.vehicle_price,
  op.down_payment,
  case
    when op.vehicle_price is not null and op.down_payment is not null
      then op.vehicle_price - op.down_payment
    else null
  end,
  op.monthly_payment,
  op.duration_months
from public.ownership_plans op
left join public.applications a on a.id = op.application_id
left join public.profiles p on p.user_id = a.user_id
where not exists (
  select 1 from public.financing_terms ft where ft.plan_id = op.id
)
  and (
    op.vehicle_price is null
    or op.down_payment is null
    or op.down_payment <= op.vehicle_price
  );

-- =========================
-- ATOMIC ADMIN DRAFT CREATION
-- =========================

create or replace function public.create_draft_ownership_plan(
  p_application_id uuid,
  p_currency text,
  p_vehicle_price numeric,
  p_down_payment numeric,
  p_monthly_payment numeric,
  p_term_months integer,
  p_remaining_balance numeric,
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
  v_user_currency text;
begin
  if not public.is_admin() then
    raise exception 'Unauthorized';
  end if;

  if p_currency is null or p_currency !~ '^[A-Z]{3}$' then
    raise exception 'Invalid currency';
  end if;

  if p_vehicle_price < 0 or p_down_payment < 0 or p_monthly_payment < 0
     or p_remaining_balance < 0 or p_term_months <= 0 then
    raise exception 'Invalid financial terms';
  end if;

  if p_down_payment > p_vehicle_price then
    raise exception 'Down payment cannot exceed vehicle price';
  end if;

  if p_annual_interest_rate is not null and p_annual_interest_rate < 0 then
    raise exception 'Invalid interest rate';
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

  insert into public.ownership_plans (
    application_id,
    vehicle_price,
    down_payment,
    monthly_payment,
    duration_months,
    remaining_balance,
    status
  ) values (
    p_application_id,
    p_vehicle_price,
    p_down_payment,
    p_monthly_payment,
    p_term_months,
    p_remaining_balance,
    'draft'
  ) returning id into v_plan_id;

  insert into public.financing_terms (
    plan_id,
    currency,
    vehicle_price,
    down_payment,
    amount_financed,
    annual_interest_rate,
    monthly_payment,
    term_months
  ) values (
    v_plan_id,
    p_currency,
    p_vehicle_price,
    p_down_payment,
    p_vehicle_price - p_down_payment,
    p_annual_interest_rate,
    p_monthly_payment,
    p_term_months
  ) returning id into v_financing_id;

  return v_plan_id;
end;
$$;

revoke all on function public.create_draft_ownership_plan(uuid, text, numeric, numeric, numeric, integer, numeric, numeric) from public;
grant execute on function public.create_draft_ownership_plan(uuid, text, numeric, numeric, numeric, integer, numeric, numeric) to authenticated;
