"use client";

import { useState, useRef } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { sendAdminMessage } from "@/features/messaging/actions/send-admin-message";

type Props = {
  conversationId: string;
  userId: string;
  admin?: boolean;
  disabled?: boolean;
  onSent?: (message: {
    id: string;
    conversationId: string;
    senderUserId: string;
    senderRole: "customer" | "admin";
    body: string;
    createdAt: string;
    customerReadAt: string | null;
    adminReadAt: string | null;
  }) => void;
};

export function MessageComposer({
  conversationId,
  userId,
  admin = false,
  disabled = false,
  onSent,
}: Props) {
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const body = message.trim();

    if (!body || sending || disabled) {
      return;
    }

    setSending(true);
    setError(null);

    try {
      /*
       * ==========================================================
       * ADMIN MESSAGES
       * ==========================================================
       *
       * Admin messages go through the trusted server action.
       * This ensures requireAdmin() and the server-side Supabase
       * client establish the authenticated admin context before
       * the RLS policy evaluates the insert.
       */
      if (admin) {
        const formData = new FormData();

        formData.set("conversation_id", conversationId);

        formData.set("message", body);

        const result = await sendAdminMessage({ ok: false }, formData);

        if (!result.ok || !result.message) {
          throw new Error(result.error ?? "Aurora could not send the message.");
        }

        onSent?.({
          id: result.message.id,
          conversationId: result.message.conversationId,
          senderUserId: result.message.senderUserId ?? userId,
          senderRole: result.message.senderRole,
          body: result.message.body,
          createdAt: result.message.createdAt,
          customerReadAt: result.message.customerReadAt,
          adminReadAt: result.message.adminReadAt,
        });

        setMessage("");
        textareaRef.current?.focus();

        return;
      }

      /*
       * ==========================================================
       * CUSTOMER MESSAGES
       * ==========================================================
       *
       * Customers continue using the existing client-side insert
       * and customer RLS policy.
       */
      const supabase = createClient();

      const { data, error: insertError } = await supabase
        .from("messages")
        .insert({
          conversation_id: conversationId,
          sender_user_id: userId,
          sender_role: "customer",
          message: body,
        })
        .select("id, created_at")
        .single();

      if (insertError || !data) {
        throw new Error(insertError?.message ?? "Unable to send your message.");
      }

      onSent?.({
        id: data.id,
        conversationId,
        senderUserId: userId,
        senderRole: "customer",
        body,
        createdAt: data.created_at!,
        customerReadAt: null,
        adminReadAt: null,
      });

      setMessage("");
      textareaRef.current?.focus();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Unable to send your message.",
      );
    } finally {
      setSending(false);
    }
  }

  function handleChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    setMessage(e.target.value);

    const ta = e.target;

    ta.style.height = "auto";
    ta.style.height = `${Math.min(ta.scrollHeight, 160)}px`;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <textarea
        ref={textareaRef}
        value={message}
        onChange={handleChange}
        disabled={disabled || sending}
        placeholder={
          admin
            ? "Write a message to the customer..."
            : "Write a message to Aurora..."
        }
        rows={3}
        className="w-full resize-none rounded-2xl border border-border bg-background px-4 py-3 text-sm outline-none transition placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-60"
        style={{
          minHeight: "80px",
          maxHeight: "160px",
          overflow: "auto",
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
            e.preventDefault();
            e.currentTarget.form?.requestSubmit();
          }
        }}
      />

      {error ? <p className="text-destructive text-sm">{error}</p> : null}

      <div className="flex items-center justify-between">
        <p className="text-[11px] text-muted-foreground">Cmd+Enter to send</p>

        <Button type="submit" disabled={disabled || sending || !message.trim()}>
          {sending ? "Sending..." : "Send message"}
        </Button>
      </div>
    </form>
  );
}
