"use client";

import { useEffect, useState } from "react";
import { MessageSquare } from "lucide-react";

import { MessagingRealtime } from "./messaging-realtime";
import type { Message, SenderRole } from "../types/messaging";

type Props = {
  conversationId: string;
  userId: string;
  /** Which side of the conversation the viewer is on — controls bubble alignment. */
  currentRole: SenderRole;
  initialMessages: Message[];
  emptyTitle?: string;
  emptyDescription?: string;
};

/**
 * Shared, realtime-aware message thread used by both the customer
 * (`/messages`) and admin (`/admin/messages`) conversation views.
 *
 * Replaces the previous inline rendering in each page, which mounted
 * `MessagingRealtime` with placeholder `onMessage`/`onTyping` handlers
 * that threw "Function not implemented." the moment a realtime event
 * arrived — i.e. any incoming message or typing event crashed the page.
 */
export function MessageThread({
  conversationId,
  userId,
  currentRole,
  initialMessages,
  emptyTitle = "No messages yet.",
  emptyDescription,
}: Props) {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [typingRole, setTypingRole] = useState<SenderRole | null>(null);

  // The server gives us a fresh snapshot whenever the page re-renders
  // (switching conversations, or a `router.refresh()` after sending).
  // Sync local state to it so we don't drift or duplicate.
  useEffect(() => {
    setMessages(initialMessages);
  }, [conversationId, initialMessages]);

  return (
    <div className="flex-1 space-y-4 overflow-y-auto p-5">
      <MessagingRealtime
        conversationId={conversationId}
        userId={userId}
        onMessage={(message) => {
          setMessages((current) =>
            current.some((item) => item.id === message.id)
              ? current
              : [...current, message],
          );
          setTypingRole(null);
        }}
        onTyping={(typing, role) => {
          setTypingRole(typing ? role : null);
        }}
      />

      {messages.length === 0 ? (
        <div className="flex h-full min-h-64 flex-col items-center justify-center text-center">
          <MessageSquare className="h-10 w-10 text-muted-foreground" />
          <p className="mt-4 font-semibold">{emptyTitle}</p>
          {emptyDescription ? (
            <p className="mt-2 max-w-sm text-sm text-muted-foreground">
              {emptyDescription}
            </p>
          ) : null}
        </div>
      ) : (
        messages.map((message) => {
          const isOwnSide = message.senderRole === currentRole;

          return (
            <div
              key={message.id}
              className={`flex ${isOwnSide ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[85%] rounded-2xl px-4 py-3 ${
                  isOwnSide
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted"
                }`}
              >
                <p className="whitespace-pre-wrap text-sm leading-relaxed">
                  {message.body}
                </p>
                <p
                  className={`mt-2 text-[11px] ${
                    isOwnSide
                      ? "text-primary-foreground/70"
                      : "text-muted-foreground"
                  }`}
                >
                  {new Date(message.createdAt).toLocaleString()}
                </p>
              </div>
            </div>
          );
        })
      )}

      {typingRole && typingRole !== currentRole ? (
        <p className="text-xs italic text-muted-foreground">
          {typingRole === "admin" ? "Aurora is typing…" : "Customer is typing…"}
        </p>
      ) : null}
    </div>
  );
}
