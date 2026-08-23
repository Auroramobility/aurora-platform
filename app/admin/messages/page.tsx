import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeft, ArrowRight, MessageSquare } from "lucide-react";

import { requireAdmin } from "@/features/admin/lib/authorization";
import {
  getConversationsForCurrentUser,
  getConversationMessages,
  markConversationRead,
} from "@/features/messaging/lib/get-conversations";

import { Button } from "@/components/ui/button";
import { MessageThread } from "@/features/messaging/components/message-thread";
import { ConversationStatusControl } from "@/components/messaging/conversation-status-control";

type Props = {
  searchParams?: Promise<{
    conversation?: string;
  }>;
};

export default async function AdminMessagesPage({ searchParams }: Props) {
  const { supabase, user, isAdmin } = await requireAdmin();

  if (!user) {
    redirect("/login");
  }

  if (!isAdmin) {
    redirect("/dashboard");
  }

  const conversations = await getConversationsForCurrentUser();

  const params = searchParams ? await searchParams : {};

  /*
   * Do not automatically open the first conversation.
   *
   * /admin/messages
   *     = customer list
   *
   * /admin/messages?conversation=...
   *     = selected customer's conversation
   */
  const selectedId =
    params.conversation &&
    conversations.some((item) => item.id === params.conversation)
      ? params.conversation
      : undefined;

  const selected = conversations.find((item) => item.id === selectedId) ?? null;

  const messages = selected ? await getConversationMessages(selected.id) : [];

  if (selected) {
    await markConversationRead(selected.id);
  }

  const refreshedConversations = selected
    ? await getConversationsForCurrentUser()
    : conversations;

  const refreshedSelected =
    refreshedConversations.find((item) => item.id === selectedId) ?? null;

  /*
   * One customer = one entry in the customer list.
   *
   * We do not delete or merge database records.
   * This only controls how the admin inbox is displayed.
   */
  const customerConversationMap = new Map<
    string,
    (typeof refreshedConversations)[number]
  >();

  for (const conversation of refreshedConversations) {
    const existing = customerConversationMap.get(conversation.customerId);

    if (!existing) {
      customerConversationMap.set(conversation.customerId, conversation);
      continue;
    }

    /*
     * Prefer an open conversation over a closed historical
     * conversation.
     */
    if (existing.status !== "open" && conversation.status === "open") {
      customerConversationMap.set(conversation.customerId, conversation);
      continue;
    }

    /*
     * If both have the same status, use the most recently
     * active conversation.
     */
    const existingActivity = new Date(
      existing.lastMessageAt ?? existing.updatedAt,
    ).getTime();

    const conversationActivity = new Date(
      conversation.lastMessageAt ?? conversation.updatedAt,
    ).getTime();

    if (conversationActivity > existingActivity) {
      customerConversationMap.set(conversation.customerId, conversation);
    }
  }

  const customerConversations = Array.from(customerConversationMap.values());

  const customerIds = [
    ...new Set(
      refreshedConversations.map((conversation) => conversation.customerId),
    ),
  ];

  const { data: profiles } = customerIds.length
    ? await supabase
        .from("profiles")
        .select("user_id, full_name, phone")
        .in("user_id", customerIds)
    : { data: [] };

  const profileMap = new Map(
    (profiles ?? []).map((profile) => [profile.user_id, profile]),
  );

  return (
    <>
      <main className="mx-auto max-w-7xl space-y-6 p-6 sm:p-8">
        <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">
              Aurora Operations
            </p>

            <h1 className="mt-2 text-3xl font-bold">Customer messages</h1>

            <p className="mt-2 max-w-2xl text-muted-foreground">
              Communicate with customers without using the conversation itself
              as authoritative business or payment state.
            </p>
          </div>

          <Button asChild variant="outline">
            <Link href="/admin">Back to admin</Link>
          </Button>
        </header>

        {!selected ? (
          /* ─────────────────────────────────────────────
             CUSTOMER LIST
             ───────────────────────────────────────────── */
          <div className="bg-card overflow-hidden rounded-3xl border">
            <div className="border-b border-border p-5">
              <h2 className="font-semibold">Customers</h2>

              <p className="mt-1 text-sm text-muted-foreground">
                Select a customer to open their conversation.
              </p>
            </div>

            <div className="divide-y divide-border">
              {customerConversations.length === 0 ? (
                <div className="p-8 text-sm text-muted-foreground">
                  No customer conversations yet.
                </div>
              ) : (
                customerConversations.map((conversation) => {
                  const profile = profileMap.get(conversation.customerId);

                  return (
                    <Link
                      key={conversation.customerId}
                      href={`/admin/messages?conversation=${conversation.id}`}
                      className="flex items-center justify-between gap-4 p-5 transition hover:bg-muted/40"
                    >
                      <div className="min-w-0">
                        <p className="font-medium">
                          {profile?.full_name || "Customer"}
                        </p>

                        <div className="mt-1 flex items-center gap-2">
                          <span className="text-xs capitalize text-muted-foreground">
                            {conversation.status}
                          </span>

                          {conversation.unreadCount > 0 ? (
                            <span className="rounded-full bg-primary px-2 py-0.5 text-[10px] font-semibold text-primary-foreground">
                              {conversation.unreadCount} unread
                            </span>
                          ) : null}
                        </div>
                      </div>

                      <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground" />
                    </Link>
                  );
                })
              )}
            </div>
          </div>
        ) : (
          /* ─────────────────────────────────────────────
             SELECTED CUSTOMER CONVERSATION
             ───────────────────────────────────────────── */
          <div className="bg-card overflow-hidden rounded-3xl border">
            <div className="border-b border-border p-4">
              <Button asChild variant="ghost" size="sm">
                <Link href="/admin/messages">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to customers
                </Link>
              </Button>
            </div>

            {refreshedSelected ? (
              <section className="flex min-h-[620px] flex-col">
                <div className="border-b border-border p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="font-semibold">
                        {profileMap.get(refreshedSelected.customerId)
                          ?.full_name || "Customer"}
                      </p>

                      <p className="mt-1 text-xs text-muted-foreground">
                        Aurora customer conversation
                      </p>
                    </div>

                    <ConversationStatusControl
                      conversationId={refreshedSelected.id}
                      status={refreshedSelected.status}
                    />
                  </div>
                </div>

                <MessageThread
                  conversationId={refreshedSelected.id}
                  userId={user.id}
                  currentRole="admin"
                  initialMessages={messages}
                  isAdmin
                  conversationStatus={refreshedSelected.status}
                />
              </section>
            ) : (
              <div className="flex min-h-[620px] items-center justify-center p-8 text-center">
                <div>
                  <MessageSquare className="mx-auto h-10 w-10 text-muted-foreground" />

                  <h2 className="mt-4 text-xl font-semibold">
                    Conversation not found
                  </h2>

                  <Button asChild className="mt-5">
                    <Link href="/admin/messages">Back to customers</Link>
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </>
  );
}
