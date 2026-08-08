# Aurora Mobility — Phase 18

## Direct messaging

Phase 18 adds a secure customer/admin messaging subsystem.

### Product boundary

Messages are communication only. A message cannot approve an application, verify identity, change financing terms, activate ownership, or confirm a payment. Those actions remain in trusted workflows.

### Conversation model

- `conversations` identifies the customer and optional application/ownership-plan context.
- `messages` stores the communication inside a conversation.
- Customers can only access their own conversations.
- Admins can access and respond to all conversations.
- New messages identify the authenticated sender and role.
- Read markers are tracked separately for customers and admins.

### Customer flow

- `/messages` provides the customer inbox.
- `/messages?application=<id>` opens/creates an application-linked thread.
- `/messages?ownershipPlan=<id>` opens/creates an ownership-plan-linked thread.

### Admin flow

- `/admin/messages` provides the operations inbox.
- Admin replies are authenticated and role-checked.

### Security

RLS is enforced at the conversation boundary. Customer and admin message inserts require the authenticated sender identity and matching role. The `mark_conversation_read` RPC controls read markers without exposing arbitrary message updates.

### Payment separation

The message thread is never treated as payment proof. Admins must use the trusted manual-payment workflow after confirming funds outside Aurora.
