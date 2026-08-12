-- Aurora financial data must only be mutated through trusted server/RPC workflows.
-- RLS protects row visibility, while table privileges prevent direct destructive
-- operations such as TRUNCATE.

REVOKE TRUNCATE, REFERENCES, TRIGGER, MAINTAIN
ON TABLE public.payments
FROM anon, authenticated;

REVOKE TRUNCATE, REFERENCES, TRIGGER, MAINTAIN
ON TABLE public.payment_schedule
FROM anon, authenticated;

REVOKE TRUNCATE, REFERENCES, TRIGGER, MAINTAIN
ON TABLE public.payment_allocations
FROM anon, authenticated;

-- Customers/admins need SELECT for the existing RLS policies to control
-- which financial rows they can see.
GRANT SELECT
ON TABLE public.payments
TO authenticated;

GRANT SELECT
ON TABLE public.payment_schedule
TO authenticated;

GRANT SELECT
ON TABLE public.payment_allocations
TO authenticated;

-- Keep financial writes behind the trusted RPC layer.
REVOKE INSERT, UPDATE, DELETE
ON TABLE public.payments
FROM anon, authenticated;

REVOKE INSERT, UPDATE, DELETE
ON TABLE public.payment_schedule
FROM anon, authenticated;

REVOKE INSERT, UPDATE, DELETE
ON TABLE public.payment_allocations
FROM anon, authenticated;

-- Explicitly scope RPC execution to authenticated users.
REVOKE ALL
ON FUNCTION public.record_manual_payment(
  uuid,
  text,
  numeric,
  timestamptz,
  text,
  uuid
)
FROM PUBLIC;

GRANT EXECUTE
ON FUNCTION public.record_manual_payment(
  uuid,
  text,
  numeric,
  timestamptz,
  text,
  uuid
)
TO authenticated;

REVOKE ALL
ON FUNCTION public.record_payment_allocation(
  uuid,
  uuid,
  numeric
)
FROM PUBLIC;

GRANT EXECUTE
ON FUNCTION public.record_payment_allocation(
  uuid,
  uuid,
  numeric
)
TO authenticated;

REVOKE ALL
ON FUNCTION public.create_draft_ownership_plan(
  uuid,
  text,
  numeric,
  numeric,
  numeric,
  integer,
  numeric,
  date,
  text,
  numeric
)
FROM PUBLIC;

GRANT EXECUTE
ON FUNCTION public.create_draft_ownership_plan(
  uuid,
  text,
  numeric,
  numeric,
  numeric,
  integer,
  numeric,
  date,
  text,
  numeric
)
TO authenticated;

REVOKE ALL
ON FUNCTION public.prepare_ownership_plan(uuid)
FROM PUBLIC;

GRANT EXECUTE
ON FUNCTION public.prepare_ownership_plan(uuid)
TO authenticated;

REVOKE ALL
ON FUNCTION public.activate_ownership_plan(uuid)
FROM PUBLIC;

GRANT EXECUTE
ON FUNCTION public.activate_ownership_plan(uuid)
TO authenticated;

REVOKE ALL
ON FUNCTION public.respond_to_ownership_plan(uuid, text)
FROM PUBLIC;

GRANT EXECUTE
ON FUNCTION public.respond_to_ownership_plan(uuid, text)
TO authenticated;
