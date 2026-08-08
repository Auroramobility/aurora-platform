"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  sendCustomerMessage,
  type MessageActionState,
} from "@/features/messaging/actions/send-customer-message";
import {
  sendAdminMessage,
  type AdminMessageActionState,
} from "@/features/messaging/actions/send-admin-message";

const initialCustomer: MessageActionState = { ok: false };
const initialAdmin: AdminMessageActionState = { ok: false };

type Props = {
  conversationId: string;
  admin?: boolean;
  disabled?: boolean;
};

export function MessageComposer({ conversationId, admin = false, disabled = false }: Props) {
  const [customerState, customerAction, customerPending] = useActionState(sendCustomerMessage, initialCustomer);
  const [adminState, adminAction, adminPending] = useActionState(sendAdminMessage, initialAdmin);
  const state = admin ? adminState : customerState;
  const action = admin ? adminAction : customerAction;
  const pending = admin ? adminPending : customerPending;

  return (
    <form action={action} className="space-y-3 rounded-2xl border border-border bg-card p-4">
      <input type="hidden" name="conversation_id" value={conversationId} />
      <Textarea
        name="message"
        rows={4}
        maxLength={5000}
        placeholder={admin ? "Reply to the customer…" : "Message Aurora…"}
        disabled={disabled || pending}
        required
      />
      <div className="flex items-center justify-between gap-4">
        <p className="text-xs text-muted-foreground">Messages are for communication. Payment and ownership status are updated separately by authorized workflows.</p>
        <Button type="submit" disabled={disabled || pending}>{pending ? "Sending…" : "Send message"}</Button>
      </div>
      {state.error ? <p className="text-sm text-red-300">{state.error}</p> : null}
      {state.success ? <p className="text-sm text-primary">{state.success}</p> : null}
    </form>
  );
}
