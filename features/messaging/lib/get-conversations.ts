import { createClient } from "@/lib/supabase/server";
import type { Conversation, Message } from "../types/messaging";

export async function getConversationsForCurrentUser() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("conversations")
    .select(
      "id, customer_id, application_id, ownership_plan_id, status, created_at, updated_at, last_message_at",
    )
    .order("last_message_at", { ascending: false, nullsFirst: false });

  if (error) throw new Error(`Unable to load conversations: ${error.message}`);

  const conversations = data ?? [];
  if (conversations.length === 0) return [];

  const { data: adminFlag } = await supabase.rpc("is_admin");
  const isAdmin = adminFlag === true;
  const conversationIds = conversations.map((conversation) => conversation.id);
  const { data: unreadMessages, error: unreadError } = await supabase
    .from("messages")
    .select("conversation_id, sender_role, customer_read_at, admin_read_at")
    .in("conversation_id", conversationIds);

  if (unreadError)
    throw new Error(`Unable to load message counts: ${unreadError.message}`);

  const unreadCounts = new Map<string, number>();
  for (const message of unreadMessages ?? []) {
    const unread = isAdmin
      ? message.sender_role === "customer" && message.admin_read_at === null
      : message.sender_role === "admin" && message.customer_read_at === null;
    if (unread)
      unreadCounts.set(
        message.conversation_id,
        (unreadCounts.get(message.conversation_id) ?? 0) + 1,
      );
  }

  return conversations.map<Conversation>((item) => ({
    id: item.id,
    customerId: item.customer_id,
    applicationId: item.application_id,
    ownershipPlanId: item.ownership_plan_id,
    status: item.status as Conversation["status"],
    createdAt: item.created_at!,
    updatedAt: item.updated_at,
    lastMessageAt: item.last_message_at,
    unreadCount: unreadCounts.get(item.id) ?? 0,
  }));
}

export async function getConversationMessages(conversationId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("messages")
    .select(
      "id, conversation_id, sender_user_id, sender_role, message, created_at, customer_read_at, admin_read_at",
    )
    .eq("conversation_id", conversationId)
    .order("created_at", { ascending: true });

  if (error) throw new Error(`Unable to load messages: ${error.message}`);

  return (data ?? []).map<Message>((item) => ({
    id: item.id,
    conversationId: item.conversation_id,
    senderUserId: item.sender_user_id,
    senderRole: item.sender_role as Message["senderRole"],
    body: item.message,
    createdAt: item.created_at!,
    customerReadAt: item.customer_read_at,
    adminReadAt: item.admin_read_at,
  }));
}

export async function markConversationRead(conversationId: string) {
  const supabase = await createClient();
  const { error } = await supabase.rpc("mark_conversation_read", {
    p_conversation_id: conversationId,
  });

  if (error)
    throw new Error(`Unable to mark conversation as read: ${error.message}`);
}

export async function getOrCreateConversation(
  applicationId?: string,
  ownershipPlanId?: string,
) {
  const supabase = await createClient();
  const { data, error } = await supabase.rpc("get_or_create_conversation", {
    p_application_id: applicationId ?? undefined,
    p_ownership_plan_id: ownershipPlanId ?? undefined,
  });

  if (error || !data) {
    throw new Error("Unable to open the Aurora message thread.");
  }

  return data;
}
