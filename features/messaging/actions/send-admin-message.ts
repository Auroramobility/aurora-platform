"use server";

import { requireAdmin } from "@/features/admin/lib/authorization";

export type AdminMessageActionState = { ok: boolean; error?: string; success?: string };

export async function sendAdminMessage(
  _previousState: AdminMessageActionState,
  formData: FormData,
): Promise<AdminMessageActionState> {
  const { supabase, user, isAdmin } = await requireAdmin();
  if (!user || !isAdmin) return { ok: false, error: "You are not authorized to send this message." };

  const conversationId = String(formData.get("conversation_id") ?? "");
  const body = String(formData.get("message") ?? "").trim();
  if (!conversationId) return { ok: false, error: "Conversation not found." };
  if (!body) return { ok: false, error: "Write a message before sending." };
  if (body.length > 5000) return { ok: false, error: "Messages must be 5,000 characters or fewer." };

  const { error } = await supabase.from("messages").insert({
    conversation_id: conversationId,
    sender_user_id: user.id,
    sender_role: "admin",
    message: body,
  });

  if (error) return { ok: false, error: "Aurora could not send the message." };
  return { ok: true, success: "Message sent." };
}
