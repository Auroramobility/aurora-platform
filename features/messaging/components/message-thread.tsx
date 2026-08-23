"use client";

import { useEffect, useState, useCallback } from "react";
import { MessageSquare } from "lucide-react";

import { MessagingRealtime } from "./messaging-realtime";
import { MessageComposer } from "@/components/messaging/message-composer";
import type { Message, SenderRole } from "../types/messaging";

type Props = {
  conversationId: string;
  userId: string;
  currentRole: SenderRole;
  initialMessages: Message[];
  emptyTitle?: string;
  emptyDescription?: string;
  isAdmin?: boolean;
  conversationStatus?: "open" | "closed";
};

export function MessageThread({
  conversationId,
  userId,
  currentRole,
  initialMessages,
  emptyTitle = "No messages yet.",
  emptyDescription,
  isAdmin = false,
  conversationStatus = "open",
}: Props) {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [typingRole, setTypingRole] = useState<SenderRole | null>(null);

  // Sync when switching conversations or server re-renders
  useEffect(() => {
    setMessages(initialMessages);
  }, [conversationId, initialMessages]);

  // Scroll to bottom when messages change
  useEffect(() => {
    const el = document.getElementById("message-scroll-anchor");
    el?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);

  const handleIncoming = useCallback((message: Message) => {
    setMessages((current) =>
      current.some((item) => item.id === message.id)
        ? current
        : [...current, message],
    );

    setTypingRole(null);
  }, []);

  const handleSent = useCallback(
    (message: {
      id: string;
      conversationId: string;
      senderUserId: string;
      senderRole: SenderRole;
      body: string;
      createdAt: string;
      customerReadAt: string | null;
      adminReadAt: string | null;
    }) => {
      setMessages((current) =>
        current.some((item) => item.id === message.id)
          ? current
          : [
              ...current,
              {
                id: message.id,
                conversationId: message.conversationId,
                senderUserId: message.senderUserId,
                senderRole: message.senderRole,
                body: message.body,
                createdAt: message.createdAt,
                customerReadAt: message.customerReadAt,
                adminReadAt: message.adminReadAt,
              },
            ],
      );
    },
    [],
  );

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      {/* Message list */}
      <div className="flex-1 space-y-4 overflow-y-auto p-5">
        <MessagingRealtime
          conversationId={conversationId}
          userId={userId}
          onMessage={handleIncoming}
          onTyping={(typing, role) => setTypingRole(typing ? role : null)}
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
            const isOwn = message.senderRole === currentRole;

            return (
              <div
                key={message.id}
                className={`flex ${isOwn ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-3 ${
                    isOwn ? "bg-primary text-primary-foreground" : "bg-muted"
                  }`}
                >
                  <p className="whitespace-pre-wrap text-sm leading-relaxed">
                    {message.body}
                  </p>

                  <p
                    className={`mt-2 text-[11px] ${
                      isOwn
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
            {typingRole === "admin"
              ? "Aurora is typing…"
              : "Customer is typing…"}
          </p>
        ) : null}

        <div id="message-scroll-anchor" />
      </div>

      {/* Composer */}
      {conversationStatus !== "closed" ? (
        <div className="border-t border-border p-5">
          <MessageComposer
            conversationId={conversationId}
            userId={userId}
            admin={isAdmin}
            onSent={handleSent}
          />
        </div>
      ) : null}
    </div>
  );
}
