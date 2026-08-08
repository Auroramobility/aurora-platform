"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import {
  setConversationStatus,
  type ConversationStatusActionState,
} from "@/features/messaging/actions/set-conversation-status";

const initialState: ConversationStatusActionState = { ok: false };

type Props = { conversationId: string; status: "open" | "closed" };

export function ConversationStatusControl({ conversationId, status }: Props) {
  const [state, action, pending] = useActionState(setConversationStatus, initialState);
  const nextStatus = status === "open" ? "closed" : "open";

  return (
    <form action={action}>
      <input type="hidden" name="conversation_id" value={conversationId} />
      <input type="hidden" name="status" value={nextStatus} />
      <Button type="submit" variant="outline" size="sm" disabled={pending}>
        {pending ? "Updating…" : status === "open" ? "Close conversation" : "Reopen conversation"}
      </Button>
      {state.error ? <p className="mt-2 text-xs text-destructive">{state.error}</p> : null}
    </form>
  );
}
