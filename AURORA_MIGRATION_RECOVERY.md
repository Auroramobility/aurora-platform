# Aurora Mobility — Migration Recovery / Canonicalization Record

Date: 2026-08-09

## Purpose

This document records the state of the Aurora Supabase migration system before
migration cleanup/reconstruction.

The goal is to establish one clean canonical local migration chain without
destroying the remote database migration history.

---

## Remote database state

Confirmed through:

    pnpm supabase migration list

Remote migrations currently marked applied:

    001
    002
    003
    004
    005
    006
    007
    008
    009
    010
    011
    012
    013
    014
    015
    016
    017
    018

Remote migrations currently pending:

    019
    020
    021
    022
    023
    024
    025
    026

IMPORTANT:

Do NOT reset, delete, or rewrite remote migration history for 001–018.

Do NOT re-run 001–018 against the remote database.

---

## Remote schema finding

A complete public schema dump was created at:

    /tmp/aurora-remote-schema.sql

The remote schema does NOT contain:

    public.set_updated_at()

However, local historical migration 008 contains the definition:

    create or replace function public.set_updated_at()
    returns trigger
    language plpgsql
    ...

This discrepancy must be explicitly reconciled before assuming later migrations
can safely depend on that function.

---

## Migration renumbering findings

A content/hash comparison established that many old tracked migrations are
byte-for-byte identical to newer working-tree migrations.

Confirmed identical mappings:

    002_expand_profiles.sql
        -> 003_expand_profiles.sql

    003_create_profile_trigger.sql
        -> 004_create_profile_trigger.sql

    003_driver_license_upload.sql
        -> 005_driver_license_upload.sql

    003_profile_preferences.sql
        -> 006_profile_preferences.sql

    004_expand_vehicle_inventory.sql
        -> 007_expand_vehicle_inventory.sql

    005_security_and_schema_alignment.sql
        -> 008_security_and_schema_alignment.sql

    006_security_hardening.sql
        -> 009_security_hardening.sql

    007_public_vehicle_visibility.sql
        -> 010_public_vehicle_visibility.sql

    008_application_ownership_foundation.sql
        -> 011_application_ownership_foundation.sql

    009_application_vehicle_visibility.sql
        -> 012_application_vehicle_visibility.sql

    010_identity_verification_state.sql
        -> 013_identity_verification_state.sql

    011_application_status_timestamps.sql
        -> 014_application_status_timestamps.sql

    012_ownership_plan_customer_workflow.sql
        -> 015_ownership_plan_customer_workflow.sql

    013_ownership_state_machine_integrity.sql
        -> 016_ownership_state_machine_integrity.sql

    014_admin_operations_foundation.sql
        -> 017_admin_operations_foundation.sql

    015_operations_integrity_and_audit.sql
        -> 018_operations_integrity_and_audit.sql

    018_financial_domain_cleanup.sql
        -> 021_financial_domain_cleanup.sql

    021_direct_messaging.sql
        -> 024_direct_messaging.sql

    022_messaging_integrity_realtime.sql
        -> 025_messaging_integrity_realtime.sql

    023_messaging_single_sender_and_threads.sql
        -> 026_messaging_single_sender_and_threads.sql

---

## Migrations containing intentional/current differences

Old:

    016_financing_architecture.sql

Current:

    019_financing_architecture.sql

Difference:

    uuid_generate_v4()
        -> extensions.uuid_generate_v4()

This UUID qualification was intentionally introduced because the remote
environment uses the extensions schema for the UUID function.

Current 019 is therefore the intended working version, subject to final
migration reconstruction.

---

Old:

    017_financial_source_of_truth.sql

Current:

    020_financial_source_of_truth.sql

Current version adds an explicit DROP FUNCTION IF EXISTS before recreating
create_draft_ownership_plan(...).

This appears to be an idempotency/safety improvement and must be preserved
unless later review proves otherwise.

---

Old:

    019_financing_contract_clarity.sql

Current:

    022_financing_contract_clarity.sql

IMPORTANT: current 022 contains suspicious/corrupted SQL.

Observed problems include:

    DROP CONSTRAINT IF EXISTS constraint_name_here;

and an empty CHECK constraint structure.

The old migration contains the meaningful intended constraint logic.

Current 022 must NOT be pushed as-is.

---

Old:

    020_admin_manual_payment_recording.sql

Current:

    023_admin_manual_payment_recording.sql

Current version updates the migration comment from 020 to 023 and rewrites
constraint removal using explicit ALTER TABLE syntax.

Current 023 appears to be the intended version.

---

## Special historical migration

Git contains:

    002_enable_rls_policies.sql

There is no current working-tree file with that name.

Its contents include RLS policies such as:

    "Users can view own profile"

This file is NOT yet classified as obsolete.

Its functionality must be reconciled against the canonical chain before deletion.

---

## Current database migration blocker

The first attempt to push 019 initially failed because:

    uuid_generate_v4()

was not resolved.

The two UUID defaults in current 019 were changed to:

    extensions.uuid_generate_v4()

After that correction, 019 progressed further but failed when creating
updated_at triggers because:

    public.set_updated_at()

does not exist in the remote schema.

This must be resolved as part of canonical migration reconstruction.

---

## Frontend work is separate

Current unrelated working-tree modifications:

    app/page.tsx
    components/marketing/navbar.tsx

These files may contain frontend corruption/unfinished work and must not be
accidentally reset while cleaning migrations.

---

## Aurora MVP financial architecture

The MVP does NOT expose automated financing/provider selection or payment
processing as a customer-facing provider integration.

Aurora admins handle:

    financing/provider selection operationally
    payment confirmation
    authorized financial state updates

Direct messages are communication only.

Messages must never be treated as payment proof.

Structured database fields remain the authoritative financial source of truth.

---

## Recovery backup

Before cleanup, the complete migration directory was copied to:

    /tmp/aurora-migration-recovery-2026-08-09/migrations

This backup must be preserved until canonical migration reconstruction and
verification are complete.

---

## Cleanup rule

The final repository should contain ONE canonical migration chain.

Obsolete duplicate/renumbered migration files should not remain in the working
migration directory once their replacements have been verified.

Remote migration history must remain intact.

No destructive Supabase migration-history repair should be performed merely to
make the local directory look clean.

---

## Current objective

Establish:

    001
    002
    003
    ...
    026

as one coherent canonical local migration chain.

Then:

    verify locally
    -> push only genuinely pending migrations
    -> verify remote schema
    -> commit clean migration state
    -> return to Aurora frontend/product work
