create table if not exists public.application_financing_requests (
id uuid primary key default gen_random_uuid(),

  application_id uuid not null
    references public.applications(id)
    on delete cascade,

  vehicle_price numeric not null,
  currency text not null default 'USD',

  down_payment_percent numeric not null,
  requested_down_payment numeric not null,
  requested_amount_financed numeric not null,

  requested_term_months integer not null,

  estimated_monthly_payment numeric not null,
  estimated_total_paid numeric not null,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint application_financing_requests_currency_check
    check (currency ~ '^[A-Z]{3}$'),

  constraint application_financing_requests_down_percent_check
    check (
      down_payment_percent >= 0
      and down_payment_percent <= 100
    ),

  constraint application_financing_requests_vehicle_price_check
    check (vehicle_price >= 0),

  constraint application_financing_requests_down_payment_check
    check (requested_down_payment >= 0),

  constraint application_financing_requests_amount_financed_check
    check (requested_amount_financed >= 0),

  constraint application_financing_requests_term_check
    check (requested_term_months > 0),

  constraint application_financing_requests_monthly_check
    check (estimated_monthly_payment > 0),

  constraint application_financing_requests_total_check
    check (estimated_total_paid >= 0),

  constraint application_financing_requests_unique_application
    unique (application_id)
);

create index if not exists
  application_financing_requests_application_id_idx
on public.application_financing_requests(application_id);

alter table public.application_financing_requests
enable row level security;

-- Customer can view their own calculator request.
create policy "Users can view own financing request"
on public.application_financing_requests
for select
to authenticated
using (
  exists (
    select 1
    from public.applications a
    where a.id = application_financing_requests.application_id
      and a.user_id = auth.uid()
  )
);

-- Admins can view calculator requests.
create policy "Admins can view financing requests"
on public.application_financing_requests
for select
to authenticated
using (
  public.is_admin()
);

-- Admins may manage requests operationally.
create policy "Admins can manage financing requests"
on public.application_financing_requests
for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

-- Updated timestamp.
drop trigger if exists
  set_application_financing_request_updated_at
on public.application_financing_requests;

create trigger
  set_application_financing_request_updated_at
before update on public.application_financing_requests
for each row
execute function public.set_updated_at();