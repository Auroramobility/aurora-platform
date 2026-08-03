# Aurora Mobility Product Requirements Document

Version: 0.1
Status: Development

---

# 1. Product Vision

Aurora Mobility exists to make electric vehicle ownership accessible by creating affordable pathways for customers who want to transition into EV ownership.

The platform connects customers with available EV opportunities through structured ownership programs, payment plans, and support.

---

# 2. Target Users

## Customers

Primary users who want access to affordable EV ownership.

Customers can:

- Create an account
- Browse EV opportunities
- Apply for ownership programs
- Track application status
- Track payments
- Communicate with support

---

# 3. MVP Features

## Authentication

Users can:

- Register with email/password
- Login
- Logout
- Login with Google
- Manage basic profile information

Technology:

- Supabase Authentication

---

## Customer Dashboard

Users can view:

- Account information
- Application status
- Vehicle information
- Payment progress
- Support messages

---

## EV Opportunity System

Users can:

- View available EV vehicles
- View vehicle details
- Submit ownership applications

---

## Payment Tracking

Users can view:

- Payment plan
- Amount paid
- Remaining balance
- Payment history

---

# 4. User Journey

Visitor

↓

Create account

↓

Login

↓

Browse EV opportunities

↓

Submit application

↓

Application review

↓

Ownership plan created

↓

Payment tracking

↓

Vehicle ownership completion

---

# 5. User Roles

## Customer

Can:

- Manage account
- Apply for EV ownership
- View payments
- Contact support

---

## Administrator (Future)

Can:

- Manage vehicles
- Review applications
- Manage users
- Manage payments

---

# 6. Technical Architecture

Frontend:

- Next.js
- React
- Tailwind CSS
- shadcn/ui

Backend:

- Supabase
- PostgreSQL

Authentication:

- Supabase Auth

---

# 7. Future Features

Later releases may include:

- AI vehicle assistant
- Financing partners
- Mobile application
- Charging network integration
- Vehicle marketplace
- Advanced eligibility scoring