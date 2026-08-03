-- Aurora Mobility
-- Migration: 002_enable_rls_policies.sql
-- Row Level Security Policies


-- =========================
-- PROFILES
-- =========================

create policy "Users can view own profile"
on public.profiles
for select
using (
  auth.uid() = user_id
);


create policy "Users can update own profile"
on public.profiles
for update
using (
  auth.uid() = user_id
);


create policy "Users can create own profile"
on public.profiles
for insert
with check (
  auth.uid() = user_id
);



-- =========================
-- VEHICLES
-- =========================

create policy "Anyone can view available vehicles"
on public.vehicles
for select
using (
  availability = 'available'
);



-- =========================
-- APPLICATIONS
-- =========================

create policy "Users can view own applications"
on public.applications
for select
using (
  auth.uid() = user_id
);


create policy "Users can create applications"
on public.applications
for insert
with check (
  auth.uid() = user_id
);



-- =========================
-- OWNERSHIP PLANS
-- =========================

create policy "Users can view own ownership plans"
on public.ownership_plans
for select
using (
  exists (
    select 1
    from public.applications
    where applications.id = ownership_plans.application_id
    and applications.user_id = auth.uid()
  )
);



-- =========================
-- PAYMENTS
-- =========================

create policy "Users can view own payments"
on public.payments
for select
using (
  exists (
    select 1
    from public.ownership_plans
    join public.applications
    on applications.id = ownership_plans.application_id
    where ownership_plans.id = payments.plan_id
    and applications.user_id = auth.uid()
  )
);



-- =========================
-- MESSAGES
-- =========================

create policy "Users can view own messages"
on public.messages
for select
using (
  auth.uid() = user_id
);


create policy "Users can send messages"
on public.messages
for insert
with check (
  auth.uid() = user_id
);