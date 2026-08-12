-- Aurora financial-domain cleanup
--
-- Migration 017 replaced the ownership-plan financial columns with the
-- financing_terms source of truth. PostgreSQL function identity is based on
-- argument types, not argument names, so migration 017 replaced the earlier
-- create_draft_ownership_plan signature rather than creating an overload.
-- No destructive DROP is required here.

comment on table public.ownership_plans is
  'Ownership relationship and lifecycle state. Financial terms live in financing_terms.';

comment on table public.financing_terms is
  'Contractual financial terms for an ownership plan. Source of truth for financing.';

comment on table public.payment_schedule is
  'Contractual payment obligations generated from financing_terms.';

comment on table public.payments is
  'Trusted payment transactions. Transactions are separate from scheduled obligations.';

comment on table public.payment_allocations is
  'Trusted allocation of completed payment transactions to scheduled obligations.';

comment on function public.create_draft_ownership_plan(uuid, text, numeric, numeric, numeric, integer, numeric, numeric) is
  'Creates an ownership plan draft with financing terms and a reconciled payment schedule. Admin-only.';
