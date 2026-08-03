# Aurora Mobility Database Design

## Purpose

This document defines the database architecture for Aurora Mobility.

Aurora Mobility is an EV ownership accessibility platform that allows customers to discover, apply for, finance, and track ownership progress of electric vehicles.

---

# Database Architecture Overview

Aurora Mobility uses:

- Supabase Authentication for user accounts
- PostgreSQL database for application data
- Row Level Security for data protection

Architecture:

User
|
|
Authentication
|
|
Profile
|
|
Application
|
|
Vehicle
|
|
Ownership Plan
|
|
Payments

---

# Entity Relationship Diagram

auth.users

|
|
v

profiles

|
|
+----------------+
| |
v v

applications messages

|
|
v

vehicles

|
|
v

ownership_plans

|
|
v

payments

---

# Tables

## 1. Profiles

Purpose:

Stores Aurora Mobility customer information connected to Supabase authentication.

Fields:

| Field      | Type      | Description        |
| ---------- | --------- | ------------------ |
| id         | uuid      | Primary key        |
| user_id    | uuid      | Supabase auth user |
| full_name  | text      | Customer name      |
| phone      | text      | Contact number     |
| country    | text      | Customer country   |
| state      | text      | Customer state     |
| created_at | timestamp | Creation date      |
| updated_at | timestamp | Last update        |

---

# 2. Vehicles

Purpose:

Stores available EV inventory.

Supports multiple manufacturers:

- Tesla
- Rivian
- Ford
- Hyundai
- BYD
- Future manufacturers

Fields:

| Field          | Type      | Description          |
| -------------- | --------- | -------------------- |
| id             | uuid      | Primary key          |
| brand          | text      | Vehicle manufacturer |
| model          | text      | Vehicle model        |
| year           | integer   | Manufacturing year   |
| range_miles    | integer   | Battery range        |
| price          | decimal   | Vehicle price        |
| battery_health | decimal   | Battery condition    |
| availability   | text      | Available status     |
| created_at     | timestamp | Creation date        |

---

# 3. Applications

Purpose:

Tracks customer requests for vehicle ownership opportunities.

Fields:

| Field            | Type      |
| ---------------- | --------- |
| id               | uuid      |
| user_id          | uuid      |
| vehicle_id       | uuid      |
| status           | text      |
| application_date | timestamp |
| approved_date    | timestamp |

Statuses:

- pending
- reviewing
- approved
- rejected

---

# 4. Ownership Plans

Purpose:

Defines payment-to-ownership agreements.

Fields:

| Field             | Type    |
| ----------------- | ------- |
| id                | uuid    |
| application_id    | uuid    |
| vehicle_price     | decimal |
| down_payment      | decimal |
| monthly_payment   | decimal |
| duration_months   | integer |
| remaining_balance | decimal |
| status            | text    |

---

# 5. Payments

Purpose:

Tracks customer payment progress.

Fields:

| Field                 | Type      |
| --------------------- | --------- |
| id                    | uuid      |
| plan_id               | uuid      |
| amount                | decimal   |
| payment_date          | timestamp |
| payment_status        | text      |
| transaction_reference | text      |

---

# 6. Messages

Purpose:

Customer communication with Aurora Mobility support.

Fields:

| Field      | Type      |
| ---------- | --------- |
| id         | uuid      |
| user_id    | uuid      |
| sender     | text      |
| message    | text      |
| created_at | timestamp |

---

# Future Tables

These are not MVP:

- vehicle_inspections
- insurance_records
- maintenance_history
- AI_assistant_conversations
- referrals
- credit_assessment
