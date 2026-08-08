# Aurora Mobility — Technical Architecture

Version: 1.0

Status: Living Document

---

# Purpose

This document describes the technical architecture of Aurora Mobility.

It defines how the application is structured, how data flows through the system, and the engineering principles that guide development.

This document should evolve alongside the platform.

---

# Architecture Philosophy

Aurora follows a feature-first architecture.

Business logic is grouped by feature rather than by technology.

The goal is to keep the application modular, maintainable, and scalable.

---

# Technology Stack

## Frontend

- Next.js 15
- React
- TypeScript
- Tailwind CSS
- shadcn/ui

---

## Backend

- Supabase
- PostgreSQL
- Row Level Security (RLS)
- Storage Buckets
- Authentication

---

## Infrastructure

- Vercel
- GitHub
- Supabase Cloud

---

# Project Structure

```
app/
components/
features/
lib/
services/
supabase/
types/
docs/
public/
```

---

# Folder Responsibilities

## app/

Contains all application routes.

Responsible for:

- Pages
- Layouts
- Server Components
- Loading UI
- Error UI

Business logic should remain minimal.

---

## components/

Reusable UI components.

Examples:

- Button
- Card
- BackButton
- VehicleCard
- ProfileForm

Components should be reusable.

Avoid page-specific logic.

---

## features/

Contains business logic.

Example:

```
features/

    vehicles/

        lib/

        types/

        actions/

        hooks/

    profile/

    applications/

    payments/
```

Every feature owns its own logic.

---

## lib/

Shared utilities.

Examples:

- Supabase clients
- Environment variables
- Helpers
- Formatting utilities

---

## services/

External integrations.

Examples:

- Payment providers
- Email
- SMS
- Maps

---

## types/

Global TypeScript types.

Generated Supabase types.

Shared interfaces.

---

## supabase/

Database migrations.

Policies.

Seeds.

Storage configuration.

---

# Application Layers

```
UI

↓

Server Component

↓

Server Action

↓

Feature Logic

↓

Supabase

↓

Database
```

Each layer has one responsibility.

---

# Data Flow Example

Vehicle Marketplace

```
User

↓

Vehicle Page

↓

getVehicles()

↓

Supabase Client

↓

vehicles table

↓

VehicleGrid

↓

VehicleCard
```

---

Application Submission

```
User

↓

Apply Button

↓

Server Action

↓

Validation

↓

applications table

↓

Dashboard
```

---

# Database Relationships

```
auth.users

↓

profiles

↓

applications

↓

ownership_plans

↓

payments
```

Vehicles

```
vehicles

↓

vehicle_images
```

Future

```
applications

↓

documents

↓

verification
```

---

# Authentication

Supabase Authentication.

Protected routes use middleware.

Server Components use authenticated server clients.

Never trust client-side authentication.

---

# Authorization

All sensitive data is protected using Row Level Security.

Policies must exist before exposing any table.

Never bypass RLS.

---

# File Uploads

Current

- Profile Avatar
- Driver License

Future

- Proof of Address
- Insurance
- Vehicle Documents

Uploads should always use Supabase Storage.

---

# Server Actions

Use Server Actions for:

- Creating applications
- Updating profiles
- Uploading documents
- Payments

Avoid unnecessary API routes.

---

# UI Principles

Components should be:

- Reusable
- Small
- Accessible
- Typed

Avoid giant page files.

---

# State Management

Prefer:

Server Components

↓

Props

↓

Local state

Only introduce global state when necessary.

---

# Error Handling

Every database operation should:

- Validate input
- Handle errors
- Return meaningful messages

Never expose internal errors to users.

---

# Performance

Use:

- Server Components
- Lazy loading
- Image optimization
- Database indexes
- Pagination where appropriate

Avoid unnecessary client-side rendering.

---

# Security

Always:

Validate inputs.

Respect authentication.

Respect authorization.

Protect private data.

Use HTTPS.

Never expose service keys.

---

# Testing Strategy

Every feature should be tested for:

- Happy path
- Empty state
- Error state
- Unauthorized access
- Mobile responsiveness

---

# Logging

Development:

Detailed console logging.

Production:

Structured logging.

Never log sensitive user information.

---

# Git Workflow

main

↓

develop

↓

feature/*

↓

Pull Request

↓

Review

↓

Merge

Every merge should leave the application in a deployable state.

---

# Scalability Principles

Aurora should scale without major architectural rewrites.

Prefer:

Reusable modules

↓

Shared components

↓

Feature isolation

↓

Database normalization

↓

Clear interfaces

---

# Future Architecture

Future integrations may include:

- Stripe
- Mobile Money
- AI Assistant
- Push Notifications
- Dealer Portal
- Fleet Management

The current architecture should support these additions without restructuring the project.

---

# Engineering Principles

Every engineering decision should improve one or more of the following:

- Maintainability
- Scalability
- Security
- Performance
- Accessibility
- Developer Experience

---

# North Star

Aurora's architecture exists to support a seamless, secure, and trustworthy electric vehicle ownership journey.
