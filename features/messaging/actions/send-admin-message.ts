"use server";

import { requireAdmin } from "@/features/admin/lib/authorization";

export type SentAdminMessage = {
  id: string;
  conversationId: string;
  senderUserId: string | null;
  senderRole: "customer" | "admin";
  body: string;
  createdAt: string;
  customerReadAt: string | null;
  adminReadAt: string | null;
};

export type AdminMessageActionState = {
  ok: boolean;
  error?: string;
  success?: string;
  message?: SentAdminMessage;
};

export async function sendAdminMessage(
  _previousState: AdminMessageActionState,
  formData: FormData,
): Promise<AdminMessageActionState> {
  const { supabase, user, isAdmin } = await requireAdmin();

  if (!user || !isAdmin) {
    return {
      ok: false,
      error: "You are not authorized to send this message.",
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
      sender_role: "admin",
      message: body,
    })
    .select(
      "id, conversation_id, sender_user_id, sender_role, message, created_at, customer_read_at, admin_read_at",
    )
    .single();

  if (error || !data) {
    return {
      ok: false,
      error: "Aurora could not send the message.",
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