# Design tokens

Aurora Mobility's visual identity is a deep-night palette with a
teal-to-violet "aurora" gradient reserved for signature moments (the
hero background, primary buttons, focus states). The tokens themselves
live as CSS variables in `app/globals.css` and are surfaced to Tailwind
via `tailwind.config.ts`. This file documents intent so the palette
stays disciplined as the product grows.

## Color

| Token        | Value (HSL)   | Use                                |
| ------------ | ------------- | ---------------------------------- |
| `background` | `213 38% 6%`  | Page background (near-black navy)  |
| `surface`    | `213 30% 9%`  | Cards, panels, raised sections     |
| `muted`      | `213 16% 16%` | Subtle fills, disabled states      |
| `primary`    | `172 66% 50%` | Primary actions — aurora teal      |
| `accent`     | `247 65% 68%` | Secondary emphasis — aurora violet |
| `border`     | `213 20% 18%` | Hairline borders and dividers      |

The `aurora.teal` / `aurora.violet` / `aurora.indigo` / `aurora.ember`
scale in `tailwind.config.ts` holds the raw gradient hexes for
decorative use (backgrounds, illustrations) — prefer the semantic
tokens above for UI chrome.

## Type

- **Display** — Space Grotesk (`--font-display`): headlines only, used
  with restraint at large sizes.
- **Body / UI** — Inter (`--font-sans`): everything else — nav, body
  copy, buttons, form controls.

## Motion

- `animate-aurora-drift` — slow (18s) ambient drift for the hero
  background gradients.
- `animate-fade-up` — entrance animation for hero copy.
- Both respect `prefers-reduced-motion` globally (see `globals.css`).
