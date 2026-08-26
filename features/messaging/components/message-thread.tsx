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

  useEffect(() => {
    setMessages(initialMessages);
  }, [conversationId, initialMessages]);

  useEffect(() => {
    const el = document.getElementById("message-scroll-anchor");

    el?.scrollIntoView({
      behavior: "smooth",
    });
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
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
      <div className="flex min-h-0 flex-1 flex-col overflow-y-auto">
        <MessagingRealtime
          conversationId={conversationId}
          userId={userId}
          onMessage={handleIncoming}
          onTyping={(typing, role) => {
            setTypingRole(typing ? role : null);
          }}
        />

        <div className="flex min-w-0 flex-1 flex-col gap-5 p-5">
          {messages.length === 0 ? (
            <div className="flex min-h-64 flex-1 flex-col items-center justify-center text-center">
              <MessageSquare className="h-10 w-10 text-muted-foreground" />

              <p className="mt-4 font-semibold">{emptyTitle}</p>

              {emptyDescription ? (
                <p className="mt-2 max-w-sm text-sm leading-relaxed text-muted-foreground">
                  {emptyDescription}
                </p>
              ) : null}
            </div>
          ) : (
            messages.map((message) => {
              const isOwnMessage = message.senderRole === currentRole;

              const senderLabel =
                message.senderRole === currentRole
                  ? "You"
                  : message.senderRole === "admin"
                    ? "Aurora"
                    : "Customer";

              return (
                <div key={message.id} className="flex w-full min-w-0 shrink-0">
                  <div
                    className={`flex w-full min-w-0 ${
                      isOwnMessage ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`flex min-w-0 max-w-[min(72vw,42rem)] flex-col ${
                        isOwnMessage ? "items-end" : "items-start"
                      }`}
                    >
                      <p className="mb-1.5 px-1 text-[11px] font-semibold text-muted-foreground">
                        {senderLabel}
                      </p>

                      <div
                        className={[
                          "w-fit max-w-full",
                          "rounded-2xl px-4 py-3",
                          "whitespace-normal break-words",
                          "shadow-sm",
                          isOwnMessage
                            ? "rounded-br-md bg-primary text-primary-foreground"
                            : "rounded-bl-md border border-border bg-muted text-foreground",
                        ].join(" ")}
                      >
                        <p className="whitespace-pre-wrap break-words text-sm leading-relaxed">
                          {message.body}
                        </p>

                        <p
                          className={[
                            "mt-2 text-[10px]",
                            isOwnMessage
                              ? "text-primary-foreground/65"
                              : "text-muted-foreground/70",
                          ].join(" ")}
                        >
                          {new Date(message.createdAt).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}

          {typingRole && typingRole !== currentRole ? (
            <div className="flex w-full min-w-0 shrink-0 justify-start">
              <div className="flex max-w-[min(72vw,42rem)] items-start">
                <div className="rounded-2xl rounded-bl-md bg-muted px-4 py-3">
                  <p className="text-xs italic text-muted-foreground">
                    {typingRole === "admin"
                      ? "Aurora is typing…"
                      : "You are typing…"}
                  </p>
                </div>
              </div>
            </div>
          ) : null}

          <div id="message-scroll-anchor" className="h-px shrink-0" />
        </div>
      </div>

      {conversationStatus !== "closed" ? (
        <div className="bg-card shrink-0 border-t border-border p-5">
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
