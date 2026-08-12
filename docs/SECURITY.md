# Aurora Security Baseline

## Current database rules

- Row Level Security is enabled on all application tables.
- Customer profiles are readable/updatable only by their owning user.
- Customers can only create applications for published, available vehicles.
- New customer applications must start in `pending` status.
- Application status changes are reserved for trusted server/admin workflows.
- Ownership plans and payments have no customer write policies.
- Customer-created messages must use `sender = 'user'`.
- Saved vehicles can only reference published vehicles owned by the authenticated user.
- Vehicle images are publicly readable; identity-document storage remains private.

## Migration history

The repository contains legacy migrations with duplicate numeric prefixes (`002` and `003`).
Do not rename or reorder migrations that may already have been applied to a remote Supabase
project without first checking the remote migration history. New changes should use the next
unused migration number.

## Next security work

Status as of the production-readiness pass (see git log for details):

1. ✅ Trusted admin/server workflows for application, ownership-plan, and
   payment writes — implemented via `SECURITY DEFINER` RPC functions
   (`017_admin_operations_foundation.sql` through
   `023_admin_manual_payment_recording.sql`). This list was stale; the
   work was done but never marked complete here.
2. ⬜ **Still open.** Audit Storage bucket policies separately from
   database RLS — specifically confirm the `licenses` and
   `government-ids` buckets are private in the Supabase dashboard. This
   requires access to the live project and hasn't been verified from a
   code checkout alone.
3. ✅ Server-side file-content validation for identity documents —
   `lib/storage/file-validation.ts` sniffs actual file byte signatures
   (not client-reported filename/type) before any license or avatar
   upload is accepted, with size limits enforced.
4. ✅ Audit logging for financial and application state transitions —
   `018_operations_integrity_and_audit.sql`.
5. ⬜ **Partially open.** Application-level tests now cover the
   highest-risk logic (`requireAdmin()` fails closed on RPC error, file
   validation rejects disguised files, rate limiter fails open by
   design — see `pnpm test`). True database policy tests (verifying RLS
   itself, e.g. via pgTAP against a local Supabase instance) still need
   to be written and require Docker + the Supabase CLI locally, which
   wasn't available in the environment this pass was done in.

Also added, not on the original list:
- Per-user rate limiting on messaging, application submission, and
  document uploads (`supabase/migrations/20260812000000_rate_limiting.sql`,
  `lib/rate-limit.ts`) — mitigates spam/abuse and brute-force-style
  hammering of these endpoints.
- Defense-in-depth auth check in `middleware.ts` for all authenticated
  route groups, in addition to each page's own check.
