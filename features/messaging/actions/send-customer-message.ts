"use server";

import { createClient } from "@/lib/supabase/server";

export type SentMessage = {
  id: string;
  conversationId: string;
  senderUserId: string | null;
  senderRole: "customer" | "admin";
  body: string;
  createdAt: string;
  customerReadAt: string | null;
  adminReadAt: string | null;
};

export type MessageActionState = {
  ok: boolean;
  error?: string;
  success?: string;
  message?: SentMessage;
};

export async function sendCustomerMessage(
  _previousState: MessageActionState,
  formData: FormData,
): Promise<MessageActionState> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      ok: false,
      error: "Please sign in to send a message.",
    };
  }

  const conversationId = String(
    formData.get("conversation_id") ?? "",
  );

  const body = String(formData.get("message") ?? "").trim();

  if (!conversationId) {
    return {
      ok: false,
      error: "Conversation not found.",
    };
  }

  if (!body) {
    return {
      ok: false,
      error: "Write a message before sending.",
    };
  }

  if (body.length > 5000) {
    return {
      ok: false,
      error: "Messages must be 5,000 characters or fewer.",
    };
  }

  const { data, error } = await supabase
    .from("messages")
    .insert({
      conversation_id: conversationId,
      sender_user_id: user.id,
      sender_role: "customer",
      message: body,
    })
    .select(
      "id, conversation_id, sender_user_id, sender_role, message, created_at, customer_read_at, admin_read_at",
    )
    .single();

  if (error || !data) {
    return {
      ok: false,
      error: "Aurora could not send your message.",
    };
  }

  return {
    ok: true,
    success: "Message sent.",
    message: {
      id: data.id,
      conversationId: data.conversation_id,
      senderUserId: data.sender_user_id,
      senderRole: data.sender_role as "customer" | "admin",
      body: data.message,
createdAt: data.created_at!,
      customerReadAt: data.customer_read_at,
      adminReadAt: data.admin_read_at,
    },
  };
}