# Aurora Mobility — Roadmap

Consumer EV marketplace and ownership platform. This replaces the
prior 25-phase enterprise/fleet roadmap — that described a different,
much larger product (multi-tenant B2B platform for fleets and OEMs).
That may be worth pursuing eventually, but as a deliberate, separate
decision — not the default continuation of this one. Everything below
is scoped to what a small team can actually ship and maintain for
individual customers buying and owning one EV at a time.

This doc is organized by actual status, verified against the codebase,
not aspiration:

- 🔴 **Broken** — exists in the UI (a link, a nav item) but the page
  behind it doesn't exist. These are bugs, not features to plan.
- 🟢 **Built** — real, working, verified by reading the code.
- 🟡 **Next** — realistic near-term scope.
- ⚪ **Deferred** — legitimate ideas, deliberately not now.

---

## 🔴 Fix first — broken right now, not roadmap items

Every one of these is a dead link that a real customer or visitor can
click today.

| Route | Linked from | Impact |
|---|---|---|
| `/settings` | Dashboard sidebar (shown on every authenticated page) + dashboard Quick Actions | Every logged-in customer sees this in their primary nav. |
| `/payments` | Dashboard sidebar (shown on every authenticated page) | Same — primary nav, always visible. |
| `/about` | Public footer | Any visitor, including pre-signup. |
| `/contact` | Public footer | Any visitor. Also just generally expected to exist. |
| `/faq` | Public footer | Any visitor. |
| `/ownership` (index) | Public footer | Only `/ownership/[id]` exists (an authenticated, per-plan detail page) — the footer links to a bare index that was never built. |

These should be built as real, minimal pages — not "coming soon"
placeholders, which would just move the trust problem instead of
fixing it:

- **Settings**: account email, password change, notification
  preferences (even if just message-related for now), and a delete/
  deactivate account flow. This is a page every SaaS product has;
  its absence is the kind of thing that makes a product feel unfinished
  even to someone who'll never click it, because it's *there* in the
  nav.
- **Payments**: for now, this can be a read view of `payments` /
  `financing_terms` — the underlying data model already exists (see
  `023_admin_manual_payment_recording.sql`). It doesn't need to *do*
  anything yet, just show the customer their own payment/financing
  history honestly.
- **About / Contact / FAQ**: real marketing copy, not lorem ipsum.
  Contact needs at least an email or a form that goes somewhere real —
  a contact page with no actual way to make contact is worse than no
  contact page.
- **Ownership index**: either build a real "how ownership works"
  marketing page (most likely correct, given it's a public footer
  link), or change the footer link to point somewhere real if that
  was the actual intent. Worth confirming which before building either.

---

## 🟢 Already built — verified, not assumed

This is what's actually working today, confirmed by reading the code
during this pass (not inferred from docs, which have been shown to
drift from reality more than once in this repo):

- Auth (email + Google OAuth), RLS on all core tables
- Vehicle browsing and detail pages
- **Vehicle comparison** (`/compare`) — fully functional, not a stub
- Application submission and review workflow
- Identity document upload with server-side content validation
- Ownership plan preparation and activation (admin-driven)
- Manual payment recording (admin-driven)
- Realtime customer ↔ admin messaging, both directions
- Admin operations console: review queue, identity queue, plan
  preparation queue
- Audit logging on state-changing operations
- Rate limiting on messaging, applications, and uploads
- Security headers, error boundaries, a real (if narrow) test suite, CI

The instinct to treat this as needing to be "built from scratch" was
wrong. The instinct to treat it as "done" was also wrong — see below.

---

## 🟡 Next — realistic near-term scope

Roughly in order, after the broken-links fix above:

1. **Vehicle specs, scoped down.** Not the full battery/range/
   charging/performance/efficiency/dimensions/warranty system from the
   original doc — that's a data-sourcing project on its own (see
   ⚪ below). Start with what a buyer actually decides on: price, range,
   charging speed, 0–60, warranty. Add fields when a real need shows up,
   not preemptively.
2. **Vehicle cards, matched to the trimmed spec set** — price, range,
   availability, a save/favorite action. Don't build UI for data fields
   that don't exist yet.
3. **Search and filtering** — price, range, body type, availability.
   The original doc's filter list (12+ facets) can wait until there's
   evidence customers need that granularity.
4. **Customer dashboard completeness** — once Settings and Payments
   exist, the dashboard nav is no longer lying about what's behind it.
   This is as much "make the existing thing honest" as "build something
   new."
5. **Notifications, minimal** — in-app only to start (new message,
   application status change). Email notifications are a separate,
   bigger scope (deliverability, templates, unsubscribe handling) —
   don't bundle it into this.

---

## ⚪ Deliberately deferred

Real ideas, not dismissed — just not now, and not implied by finishing
the list above:

- **EV Intelligence** (range/cost estimation, "which EV fits my
  commute"). Before this is a UI feature, it's a data question: where
  do real-world range and cost numbers come from, and who's accountable
  if they're wrong on a purchase this size? That needs an answer before
  design work starts, not after.
- **Financing/lending regulatory review.** Recording financing terms
  and payment status (`ownership_plans`, `financing_terms`,
  `payments`) may brush against lending disclosure requirements
  depending on exactly how "admin selects the provider" works in
  practice. Worth a real answer from someone qualified to give one
  before this area gets built out further — not urgent to block current
  work, but shouldn't be silently assumed fine either.
- **AI recommendations / comparisons layer.** Explicitly sequenced
  after real structured vehicle data exists — an AI feature answering
  "which EV fits my commute" from three seed vehicles isn't useful and
  actively erodes trust if it's confidently wrong.
- **Fleet / multi-tenant / enterprise.** A genuinely different product
  — different data model (every RLS policy gets rewritten around an
  organization boundary, not extended), different buyer, different
  sales motion. Worth having as a deliberate, explicit decision someday,
  not an inevitability implied by numbering it as "the next phase."
- **Delivery/logistics tracking, charging network integration, OEM/
  insurer APIs, analytics/experimentation platform.** All legitimate,
  all premature before the product has real customer volume to justify
  them.

---

## Still open from the production-readiness pass

Not roadmap items — pre-existing action items that haven't been closed
yet, tracked here so they don't get lost:

- Live migration-state verification against the linked Supabase project
  (`AURORA_MIGRATION_RECOVERY.md`)
- Storage bucket privacy confirmation (`licenses`, `avatars`) in the
  Supabase dashboard
- Real database policy (RLS) tests — see `docs/TESTING.md`
