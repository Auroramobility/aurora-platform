"use server";

import { createClient } from "@/lib/supabase/server";

export type MessageActionState = { ok: boolean; error?: string; success?: string };

export async function sendCustomerMessage(
  _previousState: MessageActionState,
  formData: FormData,
): Promise<MessageActionState> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "Please sign in to send a message." };

  const conversationId = String(formData.get("conversation_id") ?? "");
  const body = String(formData.get("message") ?? "").trim();
  if (!conversationId) return { ok: false, error: "Conversation not found." };
  if (!body) return { ok: false, error: "Write a message before sending." };
  if (body.length > 5000) return { ok: false, error: "Messages must be 5,000 characters or fewer." };

  const { error } = await supabase.from("messages").insert({
    conversation_id: conversationId,
    sender_user_id: user.id,
    sender_role: "customer",
    message: body,
  });

  if (error) return { ok: false, error: "Aurora could not send your message." };
  return { ok: true, success: "Message sent." };
}
