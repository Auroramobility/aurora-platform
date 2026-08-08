-- Aurora Mobility
-- Migration: 008_application_ownership_foundation.sql
-- Application/ownership integrity for the customer journey.

alter table public.applications
  alter column status set default 'pending';

create index if not exists applications_user_id_application_date_idx
  on public.applications(user_id, application_date desc);

create index if not exists applications_vehicle_id_idx
  on public.applications(vehicle_id);

-- Prevent duplicate active applications for the same vehicle while allowing
-- a customer to re-apply after a rejected/cancelled application.
create unique index if not exists applications_one_active_per_vehicle_idx
  on public.applications(user_id, vehicle_id)
  where status in ('pending', 'reviewing', 'approved');

alter table public.ownership_plans
  drop constraint if exists ownership_plans_status_check;

alter table public.ownership_plans
  add constraint ownership_plans_status_check
  check (status in ('active', 'completed', 'paused', 'cancelled'));

alter table public.payments
  drop constraint if exists payments_status_check;

alter table public.payments
  add constraint payments_status_check
  check (payment_status in ('pending', 'completed', 'failed', 'refunded'));
