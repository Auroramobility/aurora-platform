# Contributing to Aurora Mobility

Welcome to Aurora Mobility.

We're building more than software—we're building a platform that helps everyday people own electric vehicles.

Every contribution should support that mission.

---

# Our Mission

Aurora exists to make electric vehicle ownership accessible, affordable, and transparent.

Every feature should improve the ownership journey.

---

# Our Core Principles

Before writing code, ask:

- Does this help someone own an EV?
- Does this reduce friction?
- Does this increase trust?
- Does this improve accessibility?
- Is this scalable?

If the answer is "No", rethink the solution.

---

# Development Workflow

Every feature follows the same process.

## 1. Product Discussion

Understand:

- Why are we building this?
- What user problem does it solve?
- How does it fit Aurora's mission?

No code is written before this discussion.

---

## 2. UX Design

Define:

- User journey
- Page flow
- Components
- Edge cases

---

## 3. Technical Design

Plan:

- Database impact
- API changes
- Components
- Server Actions
- Security
- Performance

---

## 4. Implementation

Build in small, reviewable steps.

Avoid giant commits.

Prefer reusable components over duplicated code.

---

## 5. Testing

Every feature should be tested for:

- Functionality
- Responsive design
- Error handling
- Authentication
- Database integrity

---

## 6. Review

Ask:

- Is the code readable?
- Can it be reused?
- Is it secure?
- Does it match Aurora's architecture?

---

## 7. Commit

Use meaningful commit messages.

Examples:

feat(profile): add avatar upload

feat(vehicle): build marketplace listing

fix(auth): resolve session refresh bug

refactor(ui): simplify card components

docs: update roadmap

Avoid commits like:

update

changes

fix

working

---

# Branch Strategy

main

Production-ready code.

develop

Primary development branch.

feature/<name>

New features.

Example:

feature/vehicle-gallery

feature/financing-calculator

feature/application-flow

bugfix/<name>

Bug fixes.

hotfix/<name>

Production fixes.

---

# Project Structure

app/

Application routes.

components/

Reusable UI components.

features/

Business logic grouped by feature.

lib/

Shared utilities.

services/

External services.

types/

TypeScript models.

supabase/

Database schema and migrations.

docs/

Project documentation.

---

# Coding Standards

Use TypeScript.

Prefer Server Components where appropriate.

Use Server Actions for mutations.

Avoid duplicated logic.

Keep components focused.

Name files clearly.

---

# UI Principles

Aurora should feel:

- Premium
- Clean
- Trustworthy
- Human
- Accessible

Never add unnecessary complexity.

---

# Database Rules

Never modify production tables directly.

Always create migrations.

Never delete user data without discussion.

Respect Row Level Security.

---

# Security

Always validate user input.

Never trust client-side data.

Protect private information.

Respect authentication boundaries.

---

# Documentation

Major architectural decisions should update:

- PRODUCT_BLUEPRINT.md
- ROADMAP.md
- TECHNICAL_ARCHITECTURE.md (when created)

Documentation is part of the product.

---

# Definition of Done

A feature is complete only when:

✓ It solves the intended problem.

✓ It follows Aurora's design principles.

✓ It has been tested.

✓ Documentation is updated.

✓ Code has been reviewed.

✓ It is ready for production.

---

# Aurora Mindset

We are not building a vehicle marketplace.

We are building the future of electric vehicle ownership.

Every decision should make ownership easier, more transparent, and more accessible.
