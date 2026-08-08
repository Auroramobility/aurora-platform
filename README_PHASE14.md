# Aurora Mobility — Phase 14

## Financial source-of-truth pass

This phase removes duplicated financial state from `ownership_plans`.

### Canonical model

- `ownership_plans` — ownership lifecycle only
- `financing_terms` — contractual financial terms
- `payment_schedule` — payment obligations
- `payments` — trusted payment transactions
- `payment_allocations` — atomic transaction-to-obligation allocation

### Important

No payment provider is integrated. No real-money collection is enabled by this phase.

The new migration is:

`supabase/migrations/017_financial_source_of_truth.sql`

Apply migrations in your normal Supabase migration workflow. Because this changes the ownership-plan schema, test it against a database copy/staging project before production.
