# Aurora Mobility

Making EV ownership accessible.

Engineering foundation for the Aurora Mobility platform: Next.js 15
(App Router) + TypeScript + Tailwind CSS + shadcn/ui, wired for
Supabase and ready for feature work.

## Stack

| Layer       | Choice                                                     |
| ----------- | ---------------------------------------------------------- |
| Framework   | Next.js 15 (App Router, React 19)                          |
| Language    | TypeScript (strict mode)                                   |
| Styling     | Tailwind CSS + shadcn/ui                                   |
| Backend     | Supabase (client prepared, not yet connected to a project) |
| Lint/Format | ESLint (flat config) + Prettier                            |
| Git hooks   | Husky + lint-staged                                        |

## Getting started

```bash
npm install
cp .env.example .env.local   # fill in your Supabase project values
npm run dev
```

Open http://localhost:3000.

## Scripts

| Command                | Purpose                                  |
| ---------------------- | ---------------------------------------- |
| `npm run dev`          | Start the local dev server               |
| `npm run build`        | Production build                         |
| `npm run start`        | Run the production build                 |
| `npm run lint`         | Lint with ESLint                         |
| `npm run lint:fix`     | Lint and auto-fix                        |
| `npm run format`       | Format the codebase with Prettier        |
| `npm run format:check` | Check formatting without writing         |
| `npm run type-check`   | Run the TypeScript compiler with no emit |

`npm run prepare` installs Git hooks via Husky (runs automatically on
`npm install`). The pre-commit hook runs `lint-staged`, which lints and
formats only the files you've staged.

## Project structure

```
app/                  Routes (App Router). Currently only "/".
components/           Shared React components.
components/ui/        shadcn/ui primitives (Button, etc.).
lib/                  Framework-agnostic utilities and clients.
lib/supabase/         Browser and server Supabase client factories.
hooks/                Reusable client-side React hooks.
services/             Supabase-backed data-access layer (no mock data).
types/                Shared TypeScript types, incl. generated Supabase types.
styles/               Design-token documentation (Tailwind holds the source of truth).
public/               Static assets.
docs/                 Architecture and integration notes.
```

See `docs/ARCHITECTURE.md` for the reasoning behind this layout and
`docs/SUPABASE.md` for how to connect a real Supabase project.

## Scope of this foundation

This repository intentionally ships **only**:

- The `/` route, rendering the nav bar and a minimal hero
  ("Aurora Mobility" / "Making EV ownership accessible.").
- The tooling, folder structure, and Supabase client scaffolding
  needed to build the rest of the product on top of it.

Authentication and additional pages are out of scope for this pass —
see `docs/ARCHITECTURE.md` for suggested next steps.
