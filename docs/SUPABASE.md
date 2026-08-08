# Connecting Supabase

This project ships with the Supabase client wiring in place but not
connected to a real project. To connect one:

## 1. Create a project

Create a project at https://supabase.com/dashboard, then open
**Project Settings → API**.

## 2. Set environment variables

```bash
cp .env.example .env.local
```

Fill in:

- `NEXT_PUBLIC_SUPABASE_URL` — the "Project URL".
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` — the "anon public" API key.

Both are safe to expose to the browser — Supabase's Row Level Security
(RLS) policies, not key secrecy, are what protect your data. Never put
the **service role** key behind a `NEXT_PUBLIC_` prefix.

## 3. Use the clients

```ts
// In a Server Component, Route Handler, or Server Action:
import { createClient } from "@/lib/supabase/server";

const supabase = await createClient();
const { data } = await supabase.from("vehicles").select();
```

```ts
// In a Client Component:
"use client";
import { createClient } from "@/lib/supabase/client";

const supabase = createClient();
```

Prefer calling these from `services/*.service.ts` files rather than
directly from components/pages — see `services/README.md`.

## 4. Generate types from your schema

Once you've created tables in the Supabase dashboard (or via
migrations), generate real types to replace the placeholder in
`types/supabase.ts`:

```bash
npx supabase login
npx supabase gen types typescript --project-id <your-project-id> > types/supabase.ts
```

This makes every `supabase.from("your_table")` call fully typed.

## 5. (Later) Enable authentication

This foundation intentionally does not implement auth. When that work
starts:

- Add a `middleware.ts` that refreshes the Supabase session on every
  request (standard `@supabase/ssr` pattern).
- Rename `hooks/use-supabase-session.example.ts` → `use-supabase-session.ts`
  and wire it into the components that need session state.
- Add RLS policies in Supabase before storing any user-owned data.
