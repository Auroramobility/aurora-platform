# Deployment

## Before every deploy

1. Run `pnpm supabase migration list` against the **linked remote
   project** and confirm local and remote migration history agree.
   `AURORA_MIGRATION_RECOVERY.md` documents a past discrepancy here —
   don't assume it's resolved without checking.
2. `pnpm lint && pnpm type-check && pnpm test && pnpm build` locally
   (CI runs this on every push to `main` and every PR — see
   `.github/workflows/ci.yml` — but check before pushing too).
3. If this migration adds or changes a database function, regenerate
   `types/supabase.ts` with `supabase gen types typescript` and commit
   the result. (`check_rate_limit`'s type was added by hand in this
   pass because a live project wasn't reachable — verify it matches
   after the migration is actually applied.)

## Environment variables

See `.env.example` for the full list with descriptions. Required in
every environment:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

Required in staging/production (defaults to `localhost:3000` otherwise,
which will silently break Google OAuth sign-in and email redirect links
on any real deployment):

- `NEXT_PUBLIC_SITE_URL` — the deployed site's own URL.

Optional, only if server-side code needs to bypass RLS:

- `SUPABASE_SERVICE_ROLE_KEY` — not currently used anywhere in the
  codebase (grep for it before adding a use — every existing admin
  operation goes through RLS-respecting `SECURITY DEFINER` RPC
  functions instead, which is the pattern to keep following).

If deploying on Vercel, set these under Project Settings → Environment
Variables for each environment (Production/Preview/Development)
separately. If using GitHub Actions for anything beyond CI (e.g. a
separate deploy step), also set them as repository secrets — see the
comments in `.github/workflows/ci.yml`.

## Database migrations

Migrations live in `supabase/migrations/`. Apply them with the Supabase
CLI (`supabase db push`) or through the Supabase dashboard's migration
tooling — this repo doesn't run migrations automatically as part of CI
or deploy, which is deliberate: schema changes should be a reviewed,
deliberate step, not something that happens silently on every push.

Note: this repo's git history is young (see `git log`) relative to the
actual number of migrations — a large amount of prior work existed only
on disk before being committed. Going forward, commit each migration in
the same commit or PR as the code that depends on it, so `git log` stays
a trustworthy record of what shipped when.

## Storage buckets

Two private buckets are used: `licenses` (identity documents) and
`avatars`. Confirm both are set to private (not public) in the Supabase
dashboard before going live — this is called out as unverified in
`docs/SECURITY.md` and needs live dashboard access to check, which isn't
available from a code checkout alone.

## Rate limiting

Per-user rate limits on messaging, application submission, and document
uploads are enforced via `check_rate_limit()`
(`supabase/migrations/20260812000000_rate_limiting.sql`). No extra
infrastructure to provision — it's a Postgres function, part of the
regular migration chain above.

## Rollback

There's no automated rollback tooling here. If a deploy needs to be
reverted:

1. Revert the Vercel deployment (or redeploy the previous commit) —
   this is safe and instant for app code.
2. Database migrations are **not** automatically reversible. If a
   migration needs to be undone, write a new migration that reverses
   it — don't edit or delete an already-applied migration file.
