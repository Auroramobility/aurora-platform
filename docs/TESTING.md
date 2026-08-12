# Testing

## What exists today

Vitest, covering the highest-risk pure/mockable logic added or touched
during the production-readiness pass:

- `lib/storage/file-validation.test.ts` — the upload content-sniffing
  logic. Includes the specific attack this exists to prevent: a file
  with an executable's byte signature, renamed with a `.jpg` extension
  and an `image/jpeg` Content-Type, is rejected because the actual
  bytes don't match.
- `features/admin/lib/authorization.test.ts` — `requireAdmin()`. Locks
  in that an error from the `is_admin()` RPC call fails **closed**
  (treated as not-admin), not open.
- `lib/rate-limit.test.ts` — `checkRateLimit()`. Locks in the opposite,
  deliberate choice: an error from the rate-limiter's own RPC call
  fails **open** (allowed), so an infra hiccup in the limiter doesn't
  block real users.

Run with:

```bash
pnpm test           # run once
pnpm test:watch     # watch mode
pnpm test:coverage  # with coverage report
```

CI runs `pnpm test` on every push/PR — see `.github/workflows/ci.yml`.

## What doesn't exist yet

**Database policy (RLS) tests.** The most valuable tests for this
codebase would verify the actual Postgres RLS policies directly —
e.g. "a customer cannot read another customer's profile", "a customer
cannot write to `ownership_plans` directly", "an unauthenticated
request is rejected by every table's policies". These need a real
Postgres instance to run against, via `supabase start` (requires Docker)
and a tool like [pgTAP](https://pgtap.org/) or
[Supabase's own testing helpers](https://supabase.com/docs/guides/database/testing).
This wasn't done in this pass because the environment it was done in
doesn't have Docker or a running Postgres instance available. Suggested
next step:

1. Install the Supabase CLI locally and run `supabase start`.
2. Add `supabase/tests/` with pgTAP `.sql` test files — one per
   sensitive table (`profiles`, `applications`, `ownership_plans`,
   `payments`, `messages`), asserting both the "correct user can" and
   "wrong user/anon cannot" cases for select/insert/update/delete.
3. Run via `supabase test db`, and add that as a CI job once it's fast
   and reliable enough to run on every PR (it needs a Postgres service
   container in CI, which `.github/workflows/ci.yml` doesn't set up
   yet).

**Component/integration tests.** Nothing here renders a React
component or exercises a Server Action end-to-end against a test
database. The current suite is deliberately narrow — it covers logic
where getting it wrong has real security consequences (auth, file
validation, rate limiting), not general UI behavior. Expanding
component test coverage is reasonable future work, but wasn't the
priority for this pass.

**End-to-end tests.** No Playwright/Cypress setup. Worth adding once
the app is deployed somewhere stable enough to point E2E tests at.
