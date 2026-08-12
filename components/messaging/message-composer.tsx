"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";

type Props = {
  conversationId: string;
  userId: string;
  admin?: boolean;
  disabled?: boolean;
};

export function MessageComposer({
  conversationId,
  userId,
  admin = false,
  disabled = false,
}: Props) {
  const router = useRouter();
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const body = message.trim();

    if (!body || sending || disabled) {
      return;
    }

    setSending(true);
    setError(null);

    try {
      const supabase = createClient();

      const { error: insertError } = await supabase
        .from("messages")
        .insert({
          conversation_id: conversationId,
          sender_user_id: userId,
          sender_role: admin ? "admin" : "customer",
          message: body,
        });

      if (insertError) {
        throw new Error(insertError.message);
      }

      setMessage("");
      router.refresh();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to send your message.",
      );
    } finally {
      setSending(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <textarea
        value={message}
        onChange={(event) => setMessage(event.target.value)}
        disabled={disabled || sending}
        placeholder={
          admin
            ? "Write a message to the customer..."
            : "Write a message to Aurora..."
        }
        rows={4}
        className="w-full resize-none rounded-2xl border border-border bg-background px-4 py-3 text-sm outline-none transition placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-60"
      />

      {error ? (
        <p className="text-sm text-destructive">
          {error}
        </p>
      ) : null}

      <div className="flex justify-end">
        <Button
          type="submit"
          disabled={
            disabled ||
            sending ||
            !message.trim()
          }
        >
          {sending ? "Sending..." : "Send message"}
        </Button>
      </div>
    </form>
  );
}
