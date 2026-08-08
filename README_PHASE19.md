# Aurora Mobility — Phase 19

## Messaging Integrity + Realtime

This phase hardens the customer/admin messaging MVP without turning messages into business-state authority.

### Included

- Conversation creation now requires internally consistent customer/application/ownership-plan relationships.
- Customers cannot directly update conversation status.
- Admins close/reopen conversations through a trusted RPC.
- Conversation close/reopen actions are written to the admin audit log.
- Closed conversations reject new customer/admin messages through existing RLS policies.
- Supabase Realtime is enabled for new message events.
- Messaging pages refresh when an authorized new message arrives.
- Conversation lists display unread counts.
- Selected conversations are marked read before the refreshed list is rendered.
- Existing ownership-plan audit trigger was corrected for the post-financing schema; its historical migration remains unchanged.

### Business boundary

Messages are communication only. A message cannot change application, ownership, financing, or payment state.

Payment confirmation still requires the authorized admin payment-recording workflow.

### Conversation lifecycle

```text
open → closed
  ↑      │
  └──────┘

Admin only controls close/reopen.
```

### Realtime

The client subscribes to `public.messages` and refreshes the server-rendered page on authorized inserts. Supabase Row Level Security remains the data-access boundary.
