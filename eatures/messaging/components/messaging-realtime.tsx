"use client";

import { useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import type { RealtimeChannel } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/client";

type Props = {
  conversationId: string | null;
  userId: string;
};

export function MessagingRealtime({
  conversationId,
  userId,
}: Props) {
  const router = useRouter();
  const supabase = useMemo(() => createClient(), []);

  useEffect(() => {
    if (!conversationId || !userId) {
      return;
    }

    let channel: RealtimeChannel | null = null;

    const setup = async () => {
      channel = supabase
        .channel(`aurora-conversation-${conversationId}`)
        .on(
          "postgres_changes",
          {
            event: "INSERT",
            schema: "public",
            table: "messages",
            filter: `conversation_id=eq.${conversationId}`,
          },
          (payload) => {
            const row = payload.new as {
              id: string;
              conversation_id: string;
              sender_user_id: string | null;
              sender_role: "customer" | "admin";
              message: string;
              created_at: string;
              customer_read_at: string | null;
              admin_read_at: string | null;
            };

            if (row.sender_user_id === userId) {
              return;
            }

            router.refresh();
          },
        )
        .subscribe();
    };

    void setup();

    return () => {
      if (channel) {
        void supabase.removeChannel(channel);
      }
    };
  }, [conversationId, router, supabase, userId]);

  return null;
}