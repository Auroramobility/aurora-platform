import Link from "next/link";
import { redirect } from "next/navigation";
import { MessageSquare, ArrowRight } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import {
  getConversationsForCurrentUser,
  getConversationMessages,
  getOrCreateConversation,
  markConversationRead,
} from "@/features/messaging/lib/get-conversations";
import { MessageComposer } from "@/components/messaging/message-composer";
import { Button } from "@/components/ui/button";
import { MessagingRealtime } from "@/features/messaging/components/messaging-realtime";

type Props = {
  searchParams?: Promise<{
    conversation?: string;
    application?: string;
    ownershipPlan?: string;
    new?: string;
  }>;
};

export default async function MessagesPage({ searchParams }: Props) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  let conversations = await getConversationsForCurrentUser();
  const params = searchParams ? await searchParams : {};

  if (
    params.new === "1" ||
    (!params.conversation &&
      (params.application || params.ownershipPlan))
  ) {
    const createdId = await getOrCreateConversation(
      params.application,
      params.ownershipPlan,
    );

    conversations = await getConversationsForCurrentUser();
    params.conversation = createdId;
  } else if (conversations.length === 0) {
    const createdId = await getOrCreateConversation();
    conversations = await getConversationsForCurrentUser();
    params.conversation = createdId;
  }

  const selectedId =
    params.conversation &&
    conversations.some((item) => item.id === params.conversation)
      ? params.conversation
      : conversations[0]?.id;

  const selected =
    conversations.find((item) => item.id === selectedId) ?? null;

  const messages = selected
    ? await getConversationMessages(selected.id)
    : [];

  if (selected) {
    await markConversationRead(selected.id);
    conversations = await getConversationsForCurrentUser();
  }

  const refreshedSelected =
    conversations.find((item) => item.id === selectedId) ?? null;

  const applicationIds = conversations
    .map((item) => item.applicationId)
    .filter(Boolean) as string[];

  const { data: applications } = applicationIds.length
    ? await supabase
        .from("applications")
        .select("id, vehicle_id, status")
        .in("id", applicationIds)
    : { data: [] };

  const vehicleIds = (applications ?? []).map(
    (item) => item.vehicle_id,
  );

  const { data: vehicles } = vehicleIds.length
    ? await supabase
        .from("vehicles")
        .select("id, brand, model, year")
        .in("id", vehicleIds)
    : { data: [] };

  const vehicleMap = new Map(
    (vehicles ?? []).map((vehicle) => [vehicle.id, vehicle]),
  );

  const appMap = new Map(
    (applications ?? []).map((application) => [
      application.id,
      application,
    ]),
  );

  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <MessagingRealtime
        userId={user.id}
        conversationId={refreshedSelected?.id ?? null}
      />

      <div className="mb-6">
        <h1 className="text-2xl font-semibold">Aurora Support</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Talk directly with the Aurora team about your application,
          ownership plan, or next steps.
        </p>
      </div>

      <div className="grid min-h-[620px] overflow-hidden rounded-3xl border bg-card lg:grid-cols-[320px_1fr]">
        <aside className="border-b border-border lg:border-b-0 lg:border-r">
          <div className="p-5">
            <h2 className="font-semibold">Conversations</h2>
          </div>

          <div className="divide-y divide-border">
            {conversations.map((conversation) => {
              const application = conversation.applicationId
                ? appMap.get(conversation.applicationId)
                : undefined;

              const vehicle = application
                ? vehicleMap.get(application.vehicle_id)
                : undefined;

              const label = vehicle
                ? `${vehicle.brand} ${vehicle.model}`
                : conversation.ownershipPlanId
                  ? "Ownership plan"
                  : "Aurora support";

              return (
                <Link
                  key={conversation.id}
                  href={`/messages?conversation=${conversation.id}`}
                  className={`block p-5 transition hover:bg-muted/40 ${
                    conversation.id === selectedId
                      ? "bg-muted/50"
                      : ""
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <p className="font-medium">{label}</p>
                    <ArrowRight className="h-4 w-4 text-muted-foreground" />
                  </div>

                  <div className="mt-1 flex items-center gap-2">
                    <p className="text-xs capitalize text-muted-foreground">
                      {conversation.status}
                    </p>

                    {conversation.unreadCount > 0 ? (
                      <span className="rounded-full bg-primary px-2 py-0.5 text-[10px] font-semibold text-primary-foreground">
                        {conversation.unreadCount} unread
                      </span>
                    ) : null}
                  </div>
                </Link>
              );
            })}
          </div>
        </aside>

        <section className="flex min-h-[620px] flex-col">
          {refreshedSelected ? (
            <>
              <div className="border-b border-border p-5">
                <p className="font-semibold">
                  {refreshedSelected.applicationId
                    ? "Application conversation"
                    : "Aurora support"}
                </p>

                <p className="mt-1 text-xs text-muted-foreground">
                  Aurora team messages appear here. Payment status is never
                  changed through chat.
                </p>
              </div>

              <div className="flex-1 space-y-4 overflow-y-auto p-5">
                {messages.length === 0 ? (
                  <div className="flex h-full min-h-64 flex-col items-center justify-center text-center">
                    <MessageSquare className="h-10 w-10 text-muted-foreground" />

                    <h2 className="mt-4 text-lg font-semibold">
                      Start the conversation
                    </h2>

                    <p className="mt-2 max-w-sm text-sm text-muted-foreground">
                      Ask about your application, ownership plan,
                      financing terms, or anything Aurora needs from you.
                    </p>
                  </div>
                ) : (
                  messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${
                        message.senderRole === "customer"
                          ? "justify-end"
                          : "justify-start"
                      }`}
                    >
                      <div
                        className={`max-w-[85%] rounded-2xl px-4 py-3 ${
                          message.senderRole === "customer"
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted"
                        }`}
                      >
                        <p className="whitespace-pre-wrap text-sm leading-relaxed">
                          {message.body}
                        </p>

                        <p
                          className={`mt-2 text-[11px] ${
                            message.senderRole === "customer"
                              ? "text-primary-foreground/70"
                              : "text-muted-foreground"
                          }`}
                        >
                          {new Date(message.createdAt).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>

              <div className="border-t border-border p-5">
                {refreshedSelected.status === "closed" ? (
                  <div className="flex flex-col gap-3 rounded-2xl border border-border bg-muted/30 p-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="text-sm font-medium">
                        This conversation is closed.
                      </p>

                      <p className="mt-1 text-xs text-muted-foreground">
                        Start a new thread if you need to continue the
                        conversation.
                      </p>
                    </div>

                    <Button asChild size="sm">
                      <Link
                        href={`/messages?new=1${
                          refreshedSelected.applicationId
                            ? `&application=${refreshedSelected.applicationId}`
                            : refreshedSelected.ownershipPlanId
                              ? `&ownershipPlan=${refreshedSelected.ownershipPlanId}`
                              : ""
                        }`}
                      >
                        Start new conversation
                      </Link>
                    </Button>
                  </div>
                ) : (
                  <MessageComposer
                    conversationId={refreshedSelected.id}
                  />
                )}
              </div>
            </>
          ) : (
            <div className="flex flex-1 items-center justify-center p-8 text-center">
              <div>
                <MessageSquare className="mx-auto h-10 w-10 text-muted-foreground" />

                <h2 className="mt-4 text-xl font-semibold">
                  No conversation selected
                </h2>

                <Button asChild className="mt-5">
                  <Link href="/messages">Open Aurora support</Link>
                </Button>
              </div>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}