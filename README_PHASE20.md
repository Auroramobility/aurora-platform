# Aurora Mobility — Phase 20

## Messaging data cleanup + lifecycle polish

Phase 20 makes the messaging model authoritative and separates closed history from new communication threads.

### Sender model

`messages.sender_user_id` and `messages.sender_role` are now the only current sender fields.

The legacy `messages.user_id` and `messages.sender` columns are removed by migration `023_messaging_single_sender_and_threads.sql`.

Historical imported admin messages may retain a null `sender_user_id` because the legacy system did not store the authenticated admin identity. New customer/admin inserts are required by RLS to identify the authenticated sender.

### Conversation lifecycle

A customer may have one **open** general conversation and one **open** conversation per application. Closed conversations remain as history and no longer block a new thread.

The customer flow is:

```text
Open conversation
      ↓
Admin closes thread
      ↓
Customer cannot reply to closed thread
      ↓
Customer starts a new conversation
```

The new conversation is created by the existing `get_or_create_conversation()` RPC, which now returns only an open thread and creates one when the previous thread is closed.

### Realtime

Realtime subscriptions are scoped to the currently selected conversation:

```text
messages INSERT
      ↓
conversation_id filter
      ↓
active conversation refreshes
```

RLS remains the database authorization boundary.

### Important boundary

Messaging is still communication only. A message cannot change application, ownership, financing, or payment state.

### Migration note

Apply migration `023_messaging_single_sender_and_threads.sql` after migrations `001`–`022`.

Because the migration removes legacy columns from `messages`, test it against a staging/copy of the real Supabase database before production deployment.

### Verification limitation

The supplied project does not contain installed dependencies. A package-manager install could not be performed because the environment cannot reach the npm registry. Therefore a full Next.js/TypeScript build has not been claimed as passing.
