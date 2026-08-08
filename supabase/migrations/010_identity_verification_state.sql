-- Aurora Mobility
-- Migration: 010_identity_verification_state.sql
-- Separate identity-document submission from actual verification.

alter table public.profiles
  add column if not exists identity_verified boolean not null default false;
