export type ConversationStatus = "open" | "closed";
export type SenderRole = "customer" | "admin";

export type Conversation = {
  id: string;
  customerId: string;
  applicationId: string | null;
  ownershipPlanId: string | null;
  status: ConversationStatus;
  createdAt: string;
  updatedAt: string;
  lastMessageAt: string | null;
  unreadCount: number;
};

export type Message = {
  id: string;
  conversationId: string;
  senderUserId: string | null;
  senderRole: SenderRole;
  body: string;
  createdAt: string;
  customerReadAt: string | null;
  adminReadAt: string | null;
};
