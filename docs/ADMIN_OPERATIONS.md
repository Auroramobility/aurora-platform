# Aurora Admin Operations

## Integrity rules

- One ownership plan exists per application.
- Customers cannot create, approve, prepare, or activate ownership plans.
- Application approval requires verified identity.
- Rejections require a customer-facing reason.
- Ownership status transitions are enforced in the database.
- Admin operations are recorded in `public.admin_audit_log`.

## Audit log

The audit log records trusted admin changes to applications, trusted profile fields, and ownership plans. It stores the actor, action, entity, and before/after snapshots.

Database details and SQL errors are not exposed directly in the admin UI.
