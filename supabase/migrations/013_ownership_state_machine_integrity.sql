-- Aurora Mobility
-- Migration: 013_ownership_state_machine_integrity.sql
-- Enforce valid ownership-plan transitions and basic financial integrity.

-- Basic financial invariants. Values may remain NULL while a plan is being drafted.
alter table public.ownership_plans
  drop constraint if exists ownership_plans_financial_integrity_check;

alter table public.ownership_plans
  add constraint ownership_plans_financial_integrity_check
  check (
    (vehicle_price is null or vehicle_price >= 0)
    and (down_payment is null or down_payment >= 0)
    and (monthly_payment is null or monthly_payment >= 0)
    and (duration_months is null or duration_months > 0)
    and (remaining_balance is null or remaining_balance >= 0)
    and (
      vehicle_price is null
      or down_payment is null
      or down_payment <= vehicle_price
    )
  );

-- A monthly payment is meaningful only when a positive duration is present.
alter table public.ownership_plans
  drop constraint if exists ownership_plans_payment_term_integrity_check;

alter table public.ownership_plans
  add constraint ownership_plans_payment_term_integrity_check
  check (
    monthly_payment is null
    or duration_months is not null
  );

create or replace function public.enforce_ownership_plan_status_transition()
returns trigger
language plpgsql
as $$
begin
  if new.status = old.status then
    return new;
  end if;

  if not (
    (old.status = 'draft' and new.status in ('ready', 'cancelled'))
    or (old.status = 'ready' and new.status in ('accepted', 'declined', 'cancelled'))
    or (old.status = 'accepted' and new.status in ('active', 'cancelled'))
    or (old.status = 'active' and new.status in ('paused', 'completed', 'cancelled'))
    or (old.status = 'paused' and new.status in ('active', 'cancelled'))
  ) then
    raise exception 'Invalid ownership plan status transition: % -> %', old.status, new.status
      using errcode = '22023';
  end if;

  return new;
end;
$$;

drop trigger if exists enforce_ownership_plan_status_transition on public.ownership_plans;

create trigger enforce_ownership_plan_status_transition
before update of status on public.ownership_plans
for each row
execute function public.enforce_ownership_plan_status_transition();
