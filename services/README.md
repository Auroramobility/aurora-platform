# services/

Data-access layer. Each file here should wrap Supabase queries for a
single domain (e.g. `vehicles.service.ts`, `bookings.service.ts`) and
export plain async functions — never React components or hooks.

Conventions:

- Import the Supabase client from `@/lib/supabase/server` for anything
  called from Server Components, Route Handlers, or Server Actions.
- Import from `@/lib/supabase/client` only inside client-side hooks
  (see `hooks/`), never inside a service consumed by both.
- Return typed data using `@/types`, or a feature-specific type file
  re-exported from `@/types`. Never return the raw Supabase response.
- Throw on unexpected errors; let the caller (a Server Component,
  Server Action, or Route Handler) decide how to present the failure.

No mock or in-memory data lives in this layer — every function here is
expected to talk to the real Supabase project configured via the
environment variables in `.env.local`.
