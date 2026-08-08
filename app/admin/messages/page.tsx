import Link from "next/link";
import { redirect } from "next/navigation";
import { MessageSquare, ArrowRight } from "lucide-react";
import { requireAdmin } from "@/features/admin/lib/authorization";
import { getConversationsForCurrentUser, getConversationMessages, markConversationRead } from "@/features/messaging/lib/get-conversations";
import { MessageComposer } from "@/components/messaging/message-composer";
import { Button } from "@/components/ui/button";
import { MessagingRealtime } from "@/features/messaging/components/messaging-realtime";
import { ConversationStatusControl } from "@/components/messaging/conversation-status-control";

type Props = { searchParams?: Promise<{ conversation?: string }> };

export default async function AdminMessagesPage({ searchParams }: Props) {
  const { supabase, user, isAdmin } = await requireAdmin();
  if (!user) redirect("/login");
  if (!isAdmin) redirect("/dashboard");

  const conversations = await getConversationsForCurrentUser();
  const params = searchParams ? await searchParams : {};
  const selectedId = params.conversation && conversations.some((item) => item.id === params.conversation)
    ? params.conversation
    : conversations[0]?.id;
  const selected = conversations.find((item) => item.id === selectedId) ?? null;
  const messages = selected ? await getConversationMessages(selected.id) : [];
  if (selected) {
    await markConversationRead(selected.id);
  }

  const refreshedConversations = selected ? await getConversationsForCurrentUser() : conversations;
  const refreshedSelected = refreshedConversations.find((item) => item.id === selectedId) ?? null;
  const customerIds = [...new Set(conversations.map((item) => item.customerId))];
  const { data: profiles } = customerIds.length
    ? await supabase.from("profiles").select("user_id, full_name, phone").in("user_id", customerIds)
    : { data: [] };
  const profileMap = new Map((profiles ?? []).map((profile) => [profile.user_id, profile]));

  const applicationIds = conversations.map((item) => item.applicationId).filter(Boolean) as string[];
  const { data: applications } = applicationIds.length
    ? await supabase.from("applications").select("id, vehicle_id, status").in("id", applicationIds)
    : { data: [] };
  const vehicleIds = (applications ?? []).map((item) => item.vehicle_id);
  const { data: vehicles } = vehicleIds.length
    ? await supabase.from("vehicles").select("id, brand, model, year").in("id", vehicleIds)
    : { data: [] };
  const vehicleMap = new Map((vehicles ?? []).map((vehicle) => [vehicle.id, vehicle]));
  const appMap = new Map((applications ?? []).map((application) => [application.id, application]));

  return (
    <>
      <MessagingRealtime userId={user.id} conversationId={refreshedSelected?.id ?? null} />
      <main className="mx-auto max-w-7xl space-y-6 p-6 sm:p-8">
      <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end"><div><p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">Aurora Operations</p><h1 className="mt-2 text-3xl font-bold">Customer messages</h1><p className="mt-2 max-w-2xl text-muted-foreground">Communicate with customers without using the conversation itself as authoritative business or payment state.</p></div><Button asChild variant="outline"><Link href="/admin">Back to admin</Link></Button></header>
      <div className="grid min-h-[620px] overflow-hidden rounded-3xl border bg-card lg:grid-cols-[340px_1fr]">
        <aside className="border-b border-border lg:border-b-0 lg:border-r"><div className="p-5"><h2 className="font-semibold">Customer threads</h2></div><div className="divide-y divide-border">
          {refreshedConversations.length === 0 ? <div className="p-5 text-sm text-muted-foreground">No customer conversations yet.</div> : refreshedConversations.map((conversation) => { const profile = profileMap.get(conversation.customerId); const app = conversation.applicationId ? appMap.get(conversation.applicationId) : undefined; const vehicle = app ? vehicleMap.get(app.vehicle_id) : undefined; return <Link key={conversation.id} href={`/admin/messages?conversation=${conversation.id}`} className={`block p-5 transition hover:bg-muted/40 ${conversation.id === selectedId ? "bg-muted/50" : ""}`}><div className="flex items-start justify-between gap-3"><div><p className="font-medium">{profile?.full_name || "Customer"}</p><p className="mt-1 text-xs text-muted-foreground">{vehicle ? `${vehicle.brand} ${vehicle.model}` : "General support"}</p></div><ArrowRight className="h-4 w-4 text-muted-foreground" /></div><div className="mt-2 flex items-center gap-2"><p className="text-xs capitalize text-muted-foreground">{conversation.status}</p>{conversation.unreadCount > 0 ? <span className="rounded-full bg-primary px-2 py-0.5 text-[10px] font-semibold text-primary-foreground">{conversation.unreadCount} unread</span> : null}</div></Link>; })}
        </div></aside>
        <section className="flex min-h-[620px] flex-col">{refreshedSelected ? <><div className="border-b border-border p-5"><div className="flex items-start justify-between gap-4"><div><p className="font-semibold">{profileMap.get(refreshedSelected.customerId)?.full_name || "Customer"}</p><p className="mt-1 text-xs text-muted-foreground">{refreshedSelected.applicationId ? `Application ${refreshedSelected.applicationId}` : "General support conversation"}</p></div><ConversationStatusControl conversationId={refreshedSelected.id} status={refreshedSelected.status} /></div></div><div className="flex-1 space-y-4 overflow-y-auto p-5">{messages.length === 0 ? <div className="flex h-full min-h-64 items-center justify-center text-center"><div><MessageSquare className="mx-auto h-10 w-10 text-muted-foreground" /><p className="mt-4 font-semibold">No messages yet.</p></div></div> : messages.map((message) => <div key={message.id} className={`flex ${message.senderRole === "admin" ? "justify-end" : "justify-start"}`}><div className={`max-w-[85%] rounded-2xl px-4 py-3 ${message.senderRole === "admin" ? "bg-primary text-primary-foreground" : "bg-muted"}`}><p className="whitespace-pre-wrap text-sm leading-relaxed">{message.body}</p><p className={`mt-2 text-[11px] ${message.senderRole === "admin" ? "text-primary-foreground/70" : "text-muted-foreground"}`}>{new Date(message.createdAt).toLocaleString()}</p></div></div>)}</div><div className="border-t border-border p-5"><MessageComposer conversationId={refreshedSelected.id} admin disabled={refreshedSelected.status === "closed"} /></div></> : <div className="flex flex-1 items-center justify-center p-8 text-center"><div><MessageSquare className="mx-auto h-10 w-10 text-muted-foreground" /><h2 className="mt-4 text-xl font-semibold">No conversation selected</h2></div></div>}</section>
      </div>
    </main>
    </>
  );
}
