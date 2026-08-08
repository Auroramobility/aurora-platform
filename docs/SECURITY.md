# Aurora Security Baseline

## Current database rules

- Row Level Security is enabled on all application tables.
- Customer profiles are readable/updatable only by their owning user.
- Customers can only create applications for published, available vehicles.
- New customer applications must start in `pending` status.
- Application status changes are reserved for trusted server/admin workflows.
- Ownership plans and payments have no customer write policies.
- Customer-created messages must use `sender = 'user'`.
- Saved vehicles can only reference published vehicles owned by the authenticated user.
- Vehicle images are publicly readable; identity-document storage remains private.

## Migration history

The repository contains legacy migrations with duplicate numeric prefixes (`002` and `003`).
Do not rename or reorder migrations that may already have been applied to a remote Supabase
project without first checking the remote migration history. New changes should use the next
unused migration number.

## Next security work

1. Add explicit trusted admin/server workflows for application, ownership-plan, and payment writes.
2. Audit Storage policies separately from database RLS.
3. Add server-side file-content validation for identity documents.
4. Add audit logging for financial and application state transitions.
5. Add automated database policy tests before production launch.
