import Link from "next/link";
import { redirect } from "next/navigation";
import { MessageSquare } from "lucide-react";

import { createClient } from "@/lib/supabase/server";
import {
  getConversationsForCurrentUser,
  getConversationMessages,
  getOrCreateConversation,
  markConversationRead,
} from "@/features/messaging/lib/get-conversations";
import { Button } from "@/components/ui/button";
import { MessageThread } from "@/features/messaging/components/message-thread";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";

export default async function MessagesPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  /*
   * Aurora has ONE customer/admin conversation.
   *
   * Applications and ownership plans are business records.
   * They do NOT create separate message threads.
   *
   * The conversation is simply:
   *
   *      AURORA ADMIN <-> CUSTOMER
   *
   * All present, past, and future communication stays here.
   */
  let conversations = await getConversationsForCurrentUser();

  /*
   * Find the general Aurora conversation only.
   *
   * A general conversation has:
   * - application_id = null
   * - ownership_plan_id = null
   *
   * We intentionally ignore application-specific and
   * ownership-plan-specific conversations here.
   */
  let conversation =
    conversations.find(
      (item) => item.applicationId === null && item.ownershipPlanId === null,
    ) ?? null;

  /*
   * If the customer does not have the general Aurora
   * conversation yet, create it.
   *
   * No application ID.
   * No ownership plan ID.
   */
  if (!conversation) {
    const conversationId = await getOrCreateConversation();

    conversations = await getConversationsForCurrentUser();

    conversation =
      conversations.find((item) => item.id === conversationId) ?? null;
  }

  /*
   * There is only ONE conversation shown on this page.
   *
   * We deliberately do not:
   * - select a conversation from the URL
   * - create a conversation from application params
   * - create a conversation from ownership-plan params
   * - display vehicles
   * - display application names
   * - display ownership-plan names
   */
  const selected = conversation;

  const messages = selected ? await getConversationMessages(selected.id) : [];

  /*
   * Mark Aurora's messages as read when the customer opens
   * the conversation.
   */
  if (selected) {
    await markConversationRead(selected.id);

    conversations = await getConversationsForCurrentUser();

    conversation =
      conversations.find((item) => item.id === selected.id) ?? selected;
  }

  const unreadCount = conversation?.unreadCount ?? 0;

  return (
    <DashboardShell
      title="Aurora Support"
      email={user.email ?? ""}
      backHref="/dashboard"
      backLabel="Dashboard"
    >
      <div className="mb-4">
        <p className="text-sm text-muted-foreground">
          Talk directly with the Aurora team about your application, payments,
          ownership, or anything else you need help with.
        </p>
      </div>

      <div className="bg-card grid min-h-[620px] overflow-hidden rounded-3xl border">
        {conversation ? (
          <section className="flex min-h-[620px] flex-col overflow-hidden">
            {/* ── Single Aurora conversation header ── */}
            <div className="flex shrink-0 items-center justify-between border-b border-border px-5 py-4">
              <div>
                <p className="text-sm font-semibold">Aurora</p>

                <p className="mt-0.5 text-xs text-muted-foreground">
                  Your conversation with the Aurora team
                </p>
              </div>

              {unreadCount > 0 ? (
                <span className="rounded-full bg-primary px-2.5 py-1 text-[10px] font-semibold text-primary-foreground">
                  {unreadCount} new
                </span>
              ) : null}
            </div>

            {/* ── Single continuous conversation ── */}
            <MessageThread
              conversationId={conversation.id}
              userId={user.id}
              currentRole="customer"
              initialMessages={messages}
              emptyTitle="Start the conversation"
              emptyDescription="Send a message to the Aurora team. Your conversation stays here for future questions, updates, and next steps."
              conversationStatus={conversation.status}
            />
          </section>
        ) : (
          <div className="flex min-h-[620px] items-center justify-center p-8 text-center">
            <div>
              <MessageSquare className="mx-auto h-10 w-10 text-muted-foreground" />

              <h2 className="mt-4 text-xl font-semibold">
                Aurora conversation unavailable
              </h2>

              <p className="mt-2 text-sm text-muted-foreground">
                We could not open your Aurora conversation.
              </p>

              <Button asChild className="mt-5">
                <Link href="/dashboard">Back to Dashboard</Link>
              </Button>
            </div>
          </div>
        )}
      </div>
    </DashboardShell>
  );
}
