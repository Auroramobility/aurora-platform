-- Support for the account Settings and Payments pages.
--
-- 1. Account deactivation: profiles.deactivated_at. Deliberately a soft
--    flag, not a hard delete — this app never uses the Supabase service
--    role key (see docs/DEPLOYMENT.md), and permanently deleting an
--    auth.users row requires it. Permanent deletion is handled by
--    support on request; this column lets a customer immediately sign
--    themselves out and block future sign-in attempts on their own.
--
-- 2. payments customer read access: financing_terms, payment_schedule,
--    and payment_allocations all already have a "Users can view own X"
--    policy (see 019_financing_architecture.sql,
--    020_financial_source_of_truth.sql) — payments itself was missed.
--    Same join pattern as the others, for consistency.

alter table public.profiles
  add column if not exists deactivated_at timestamptz null;

drop policy if exists "Users can view own payments" on public.payments;

create policy "Users can view own payments"
on public.payments
for select
to authenticated
using (
  exists (
    select 1
    from public.ownership_plans op
    join public.applications a on a.id = op.application_id
    where op.id = payments.plan_id
      and a.user_id = auth.uid()
  )
);
