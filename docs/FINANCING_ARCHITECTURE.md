# Aurora Financing Architecture

## Source of truth

- `ownership_plans` owns the ownership relationship and lifecycle state only.
- `financing_terms` owns the contractual financial terms.
- `payment_schedule` owns contractual payment obligations.
- `payments` owns trusted payment transactions.
- `payment_allocations` connects completed transactions to scheduled obligations.

## Balance

Customer-visible remaining balance is derived from non-cancelled schedule items:

`sum(amount_due - amount_paid)`

`amount_financed` is the principal after the upfront down payment. `total_financed_repayment` is the approved total of the financing installments and excludes the upfront down payment. The difference between them is the financing cost represented by the approved terms.

It is not stored as a second balance column.

## Integrity

- A financing plan has one financing-terms row.
- A draft plan creates its financing terms and payment schedule atomically.
- The final installment is adjusted so the schedule reconciles exactly to the approved total financed repayment.
- `first_payment_date` is explicit; new plans do not default the first installment to the creation date.
- `payment_frequency` is explicit and currently restricted to monthly.
- `annual_interest_rate` is recorded as an approved/reference rate; Aurora does not calculate financing from it in this workflow.
- Completed payments can only be allocated through the trusted allocation function.
- Allocation cannot exceed either the payment amount or the scheduled obligation.
- No customer-facing mutation can write payment transactions or payment allocations.

## Payment provider boundary

A future provider/webhook integration should create or confirm a `payments` transaction first, then allocate the completed transaction to schedule items. Provider events must be idempotent using `provider + provider_transaction_id`.
