"use server";

import { requireAdmin } from "@/features/admin/lib/authorization";

export type ConversationStatusActionState = { ok: boolean; error?: string; success?: string };

export async function setConversationStatus(
  _previousState: ConversationStatusActionState,
  formData: FormData,
): Promise<ConversationStatusActionState> {
  const { supabase, user, isAdmin } = await requireAdmin();
  if (!user || !isAdmin) return { ok: false, error: "You are not authorized to manage this conversation." };

  const conversationId = String(formData.get("conversation_id") ?? "");
  const status = String(formData.get("status") ?? "");
  if (!conversationId || !["open", "closed"].includes(status)) {
    return { ok: false, error: "Invalid conversation status request." };
  }

  const { data, error } = await supabase.rpc("set_conversation_status", {
    p_conversation_id: conversationId,
    p_status: status,
  });

  if (error || data !== true) return { ok: false, error: "Aurora could not update this conversation." };
  return { ok: true, success: status === "closed" ? "Conversation closed." : "Conversation reopened." };
}
