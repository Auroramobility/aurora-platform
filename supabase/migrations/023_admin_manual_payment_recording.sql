-- Aurora Mobility
-- Migration 023: Admin-confirmed manual payment recording.
-- No payment provider is integrated. Authorized Aurora operators record a
-- payment only after confirming that funds were received externally.

alter table public.payments
  add column if not exists payment_type text not null default 'installment';

ALTER TABLE public.payments
DROP CONSTRAINT IF EXISTS payments_payment_type_check;
alter table public.payments
  add constraint payments_payment_type_check
  check (payment_type in ('down_payment', 'installment'));

create unique index if not exists payments_manual_reference_unique_idx
  on public.payments(lower(transaction_reference))
  where provider = 'manual' and transaction_reference is not null;

comment on column public.payments.payment_type is
  'Whether the trusted payment is an upfront down payment or a scheduled financing installment.';
comment on column public.payments.provider is
  'Payment source. Manual means an authorized Aurora operator confirmed receipt outside an automated provider integration.';

create or replace function public.record_manual_payment(
  p_plan_id uuid,
  p_payment_type text,
  p_amount numeric,
  p_payment_date timestamptz,
  p_transaction_reference text,
  p_schedule_id uuid default null
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_payment_id uuid;
  v_currency text;
  v_down_payment numeric;
  v_existing_down_payment numeric;
  v_schedule_plan_id uuid;
  v_schedule_outstanding numeric;
  v_reference text;
begin
  if not public.is_admin() then
    raise exception 'Unauthorized';
  end if;

  v_reference := nullif(trim(p_transaction_reference), '');
  if p_amount is null or p_amount <= 0 then
    raise exception 'Payment amount must be greater than zero';
  end if;
  if p_payment_date is null then
    raise exception 'Payment date is required';
  end if;
  if v_reference is null then
    raise exception 'Payment reference is required';
  end if;
  if p_payment_type not in ('down_payment', 'installment') then
    raise exception 'Invalid payment type';
  end if;

  select ft.currency, ft.down_payment
  into v_currency, v_down_payment
  from public.ownership_plans op
  join public.financing_terms ft on ft.plan_id = op.id
  where op.id = p_plan_id
    and op.status in ('accepted', 'active')
  for update of op;

  if not found then
    raise exception 'Payment can only be recorded for an accepted or active ownership plan';
  end if;

  if p_payment_type = 'down_payment' then
    if v_down_payment is null or v_down_payment <= 0 then
      raise exception 'This plan has no recorded down payment requirement';
    end if;

    select coalesce(sum(amount), 0)
    into v_existing_down_payment
    from public.payments
    where plan_id = p_plan_id
      and provider = 'manual'
      and payment_type = 'down_payment'
      and payment_status = 'completed';

    if v_existing_down_payment + p_amount > v_down_payment then
      raise exception 'Payment exceeds the remaining down payment';
    end if;
  else
    if p_schedule_id is null then
      raise exception 'A payment schedule item is required for an installment';
    end if;

    select ft.plan_id, greatest(ps.amount_due - ps.amount_paid, 0)
    into v_schedule_plan_id, v_schedule_outstanding
    from public.payment_schedule ps
    join public.financing_terms ft on ft.id = ps.financing_terms_id
    where ps.id = p_schedule_id
    for update of ps;

    if not found or v_schedule_plan_id <> p_plan_id then
      raise exception 'Payment schedule item does not belong to this ownership plan';
    end if;

    if v_schedule_outstanding <= 0 then
      raise exception 'This payment schedule item is already fully paid';
    end if;

    if p_amount > v_schedule_outstanding then
      raise exception 'Payment exceeds the remaining scheduled amount';
    end if;
  end if;

  insert into public.payments (
    plan_id,
    schedule_id,
    amount,
    payment_date,
    payment_status,
    transaction_reference,
    provider,
    currency,
    metadata,
    payment_type
  ) values (
    p_plan_id,
    case when p_payment_type = 'installment' then p_schedule_id else null end,
    p_amount,
    p_payment_date,
    'completed',
    v_reference,
    'manual',
    v_currency,
    jsonb_build_object('source', 'admin_confirmed_offline', 'recorded_by', auth.uid()),
    p_payment_type
  )
  returning id into v_payment_id;

  if p_payment_type = 'installment' then
    perform public.record_payment_allocation(v_payment_id, p_schedule_id, p_amount);
  end if;

  perform public.write_admin_audit_log(
    'payment_recorded',
    'payment',
    v_payment_id,
    null,
    jsonb_build_object(
      'plan_id', p_plan_id,
      'payment_type', p_payment_type,
      'amount', p_amount,
      'currency', v_currency,
      'payment_status', 'completed',
      'payment_date', p_payment_date,
      'transaction_reference', v_reference,
      'schedule_id', p_schedule_id
    )
  );

  return v_payment_id;
end;
$$;

revoke all on function public.record_manual_payment(uuid, text, numeric, timestamptz, text, uuid) from public;
grant execute on function public.record_manual_payment(uuid, text, numeric, timestamptz, text, uuid) to authenticated;
