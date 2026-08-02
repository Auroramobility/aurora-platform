# Architecture

## Why this layout

Aurora Mobility is structured to keep three concerns separate as the
product grows past a single page:

1. **Routing** (`app/`) stays thin — pages compose components and call
   services; they hold as little logic as possible.
2. **Presentation** (`components/`) is framework-agnostic React.
   `components/ui/` holds shadcn/ui primitives (unstyled-logic,
   Tailwind-styled); everything else in `components/` composes those
   primitives into product UI.
3. **Data access** (`services/`) is the only layer allowed to import a
   Supabase client. Nothing else in the app talks to Supabase
   directly — this keeps query logic testable and swappable, and
   means Server Components/Actions/Route Handlers all read data the
   same way.

`lib/` holds cross-cutting utilities that don't belong to a specific
feature: the Supabase client factories, environment variable access,
and the `cn()` class-merge helper shadcn/ui components expect.

`hooks/` holds client-side React hooks only (anything using
`useState`/`useEffect`). Server-side data fetching belongs in
`services/`, not in a hook.

`types/` is the single import path (`@/types`) for shared types across
the app, including the Supabase-generated `Database` type once a real
schema exists.

## Server vs. client Supabase clients

Two client factories exist on purpose:

- `lib/supabase/client.ts` — for Client Components. Uses the public
  anon key; safe to bundle into browser JS.
- `lib/supabase/server.ts` — for Server Components, Route Handlers,
  and Server Actions. Reads/writes the auth cookie via Next.js'
  `cookies()` API so sessions persist across requests.

Both are typed against `types/supabase.ts`, which is currently a
placeholder (empty schema) — see `docs/SUPABASE.md`.

## Deliberately out of scope (this pass)

- **Authentication.** No sign-in/sign-up flow, no protected routes, no
  middleware session refresh. The Supabase clients above are ready to
  support auth once that work starts — `hooks/use-supabase-session.example.ts`
  and `services/vehicles.service.example.ts` sketch the intended
  pattern without being wired into the app yet.
- **Additional pages.** Only `/` exists. The nav bar's other links
  (`Vehicles`, `How It Works`, `About`, `Contact`) are placeholders
  (`#anchor` hrefs) until those routes are built.
- **Mock/in-memory data.** There is no fake database anywhere in the
  codebase. Every data-access example talks to Supabase directly, so
  the moment a real project + schema exists, that code is real.

## Suggested next steps

1. Create the Supabase project, fill in `.env.local` (see
   `docs/SUPABASE.md`).
2. Design the schema, then run `supabase gen types` to replace the
   placeholder `types/supabase.ts`.
3. Add real routes under `app/` (e.g. `app/vehicles/page.tsx`) backed
   by services in `services/`.
4. Add authentication (Supabase Auth + `@supabase/ssr` middleware)
   when the product needs it — the client setup here is compatible
   with the standard Next.js App Router auth pattern.
