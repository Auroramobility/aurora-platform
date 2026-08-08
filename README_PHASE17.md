# Aurora Phase 17 — Admin-Confirmed Manual Payments

## Decision

Aurora does not integrate a payment provider in this MVP. Financing and payment details are managed operationally by authorized Aurora administrators.

A payment is considered authoritative only after an authorized operator confirms that funds were received outside Aurora and records the transaction in the system.

Direct messages are communication only. A message saying that a payment was made does not change payment or ownership state.

## Admin flow

1. Customer and Aurora discuss financing/payment details through the operational communication channel.
2. Financing terms remain stored in `financing_terms`.
3. Customer pays through the agreed external method.
4. Admin confirms receipt.
5. Admin records the payment from `/admin` with:
   - payment type (`down_payment` or `installment`)
   - amount
   - payment date
   - transaction reference
   - installment when applicable
6. `record_manual_payment()` validates the plan, amount, currency, schedule ownership, and remaining obligation.
7. Installment payments are atomically allocated to the selected schedule item.
8. The schedule status and `amount_paid` are updated by the existing database trigger.
9. The payment and admin action are auditable.

## Security boundary

Customers have read access to their own payment history and schedule, but no direct payment writes.

The manual payment RPC requires `is_admin()` and performs all validation in the database. The browser cannot mark a payment as completed.

## Payment types

- `down_payment`: recorded against the contractual down payment. It is not part of the recurring financing schedule.
- `installment`: recorded against one scheduled financing obligation.

Installment payments may be partial, subject to the remaining scheduled amount.

## Future integration

If Aurora later integrates a payment provider, the same transaction/allocation model can remain. Provider webhooks should become another trusted source of completed transactions, with idempotency and signature verification. The customer UI should never be allowed to declare a payment successful.
