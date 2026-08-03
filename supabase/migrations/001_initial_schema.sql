-- Aurora Mobility Initial Database Schema
-- Migration: 001_initial_schema.sql

-- Enable UUID generation
create extension if not exists "uuid-ossp";


-- =========================
-- PROFILES
-- =========================

create table public.profiles (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id) on delete cascade not null,
  full_name text,
  phone text,
  country text,
  state text,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),

  unique(user_id)
);


-- =========================
-- VEHICLES
-- =========================

create table public.vehicles (
  id uuid primary key default uuid_generate_v4(),
  brand text not null,
  model text not null,
  year integer,
  range_miles integer,
  price numeric,
  battery_health numeric,
  availability text default 'available',
  created_at timestamptz default now()
);


-- =========================
-- APPLICATIONS
-- =========================

create table public.applications (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references public.profiles(user_id)
    on delete cascade not null,

  vehicle_id uuid references public.vehicles(id)
    on delete cascade not null,

  status text default 'pending',

  application_date timestamptz default now(),
  approved_date timestamptz
);


-- =========================
-- OWNERSHIP PLANS
-- =========================

create table public.ownership_plans (
  id uuid primary key default uuid_generate_v4(),

  application_id uuid references public.applications(id)
    on delete cascade not null,

  vehicle_price numeric,
  down_payment numeric,
  monthly_payment numeric,
  duration_months integer,
  remaining_balance numeric,

  status text default 'active',

  created_at timestamptz default now()
);


-- =========================
-- PAYMENTS
-- =========================

create table public.payments (
  id uuid primary key default uuid_generate_v4(),

  plan_id uuid references public.ownership_plans(id)
    on delete cascade not null,

  amount numeric not null,

  payment_date timestamptz default now(),

  payment_status text default 'pending',

  transaction_reference text
);


-- =========================
-- MESSAGES
-- =========================

create table public.messages (
  id uuid primary key default uuid_generate_v4(),

  user_id uuid references public.profiles(user_id)
    on delete cascade not null,

  sender text not null,

  message text not null,

  created_at timestamptz default now()
);