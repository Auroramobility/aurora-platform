"use client";

import { useEffect, useMemo, useState, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";

export type Notification = {
  id: string;
  type:
    | "new_message"
    | "application_reviewed"
    | "application_approved"
    | "application_rejected"
    | "plan_ready"
    | "plan_activated"
    | "admin_new_application"
    | "admin_identity_uploaded";
  title: string;
  body: string;
  href: string;
  createdAt: string;
  read: boolean;
};

type InitialCounts = {
  unreadMessages: number;
  pendingApplications: number;
  planReady: number;
  isAdmin: boolean;
};

export function useNotifications(initial: InitialCounts) {
  const supabase = useMemo(() => createClient(), []);

  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadMessages, setUnreadMessages] = useState(initial.unreadMessages);

  const addNotification = useCallback((notif: Omit<Notification, "read">) => {
    setNotifications((prev) => {
      if (prev.some((n) => n.id === notif.id)) {
        return prev;
      }

      return [{ ...notif, read: false }, ...prev].slice(0, 20);
    });
  }, []);

  useEffect(() => {
    const channels: ReturnType<typeof supabase.channel>[] = [];

    const channelPrefix = `aurora-notif-${
      initial.isAdmin ? "admin" : "customer"
    }-${crypto.randomUUID()}`;

    // ============================================================
    // MESSAGES
    // ============================================================

    const msgChannel = supabase
      .channel(`${channelPrefix}-messages`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: initial.isAdmin
            ? "sender_role=eq.customer"
            : "sender_role=eq.admin",
        },
        (payload) => {
          const row = payload.new as {
            id: string;
            conversation_id: string;
            message: string;
            created_at: string;
          };

          setUnreadMessages((count) => count + 1);

          addNotification({
            id: `msg-${row.id}`,
            type: "new_message",
            title: initial.isAdmin
              ? "New customer message"
              : "Message from Aurora",
            body:
              row.message.length > 80
                ? `${row.message.slice(0, 80)}…`
                : row.message,
            href: initial.isAdmin
              ? `/admin/messages?conversation=${row.conversation_id}`
              : `/messages?conversation=${row.conversation_id}`,
            createdAt: row.created_at,
          });
        },
      )
      .subscribe();

    channels.push(msgChannel);

    // ============================================================
    // APPLICATIONS
    // ============================================================

    const appChannel = supabase
      .channel(`${channelPrefix}-applications`)
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "applications",
        },
        (payload) => {
          const row = payload.new as {
            id: string;
            status: string;
            updated_at: string;
          };

          const old = payload.old as {
            status: string;
          };

          if (row.status === old.status) {
            return;
          }

          if (!initial.isAdmin) {
            if (row.status === "reviewing") {
              addNotification({
                id: `app-${row.id}-reviewing`,
                type: "application_reviewed",
                title: "Application under review",
                body: "Aurora is reviewing your application. We'll update you shortly.",
                href: `/applications/${row.id}`,
                createdAt: row.updated_at,
              });
            }

            if (row.status === "approved") {
              addNotification({
                id: `app-${row.id}-approved`,
                type: "application_approved",
                title: "Application approved! 🎉",
                body: "Congratulations — your application has been approved.",
                href: `/applications/${row.id}`,
                createdAt: row.updated_at,
              });
            }

            if (row.status === "rejected") {
              addNotification({
                id: `app-${row.id}-rejected`,
                type: "application_rejected",
                title: "Application update",
                body: "There's an update on your application. Tap to see details.",
                href: `/applications/${row.id}`,
                createdAt: row.updated_at,
              });
            }
          }
        },
      )
      .subscribe();

    channels.push(appChannel);

    // ============================================================
    // OWNERSHIP PLANS
    // ============================================================

    const planChannel = supabase
      .channel(`${channelPrefix}-plans`)
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "ownership_plans",
        },
        (payload) => {
          const row = payload.new as {
            id: string;
            status: string;
            updated_at: string;
          };

          const old = payload.old as {
            status: string;
          };

          if (row.status === old.status) {
            return;
          }

          if (!initial.isAdmin && row.status === "ready") {
            addNotification({
              id: `plan-${row.id}-ready`,
              type: "plan_ready",
              title: "Ownership plan ready",
              body: "Aurora has prepared your ownership plan. Review and accept it.",
              href: `/ownership/${row.id}`,
              createdAt: row.updated_at,
            });
          }

          if (!initial.isAdmin && row.status === "active") {
            addNotification({
              id: `plan-${row.id}-active`,
              type: "plan_activated",
              title: "Ownership plan activated 🚗",
              body: "Your ownership plan is now active. Welcome aboard.",
              href: `/ownership/${row.id}`,
              createdAt: row.updated_at,
            });
          }

          if (initial.isAdmin && row.status === "accepted") {
            addNotification({
              id: `plan-${row.id}-accepted`,
              type: "plan_ready",
              title: "Customer accepted ownership plan",
              body: "A customer has accepted their plan. Ready to activate.",
              href: `/admin`,
              createdAt: row.updated_at,
            });
          }
        },
      )
      .subscribe();

    channels.push(planChannel);

    // ============================================================
    // IDENTITY DOCUMENTS — ADMIN
    // ============================================================

    if (initial.isAdmin) {
      const profileChannel = supabase
        .channel(`${channelPrefix}-profiles`)
        .on(
          "postgres_changes",
          {
            event: "UPDATE",
            schema: "public",
            table: "profiles",
          },
          (payload) => {
            const row = payload.new as {
              user_id: string;
              full_name: string | null;
              drivers_license_front: string | null;
              identity_verified: boolean;
              updated_at: string;
            };

            const old = payload.old as {
              drivers_license_front: string | null;
            };

            if (
              row.drivers_license_front &&
              !old.drivers_license_front &&
              !row.identity_verified
            ) {
              addNotification({
                id: `identity-${row.user_id}-${row.updated_at}`,
                type: "admin_identity_uploaded",
                title: "Identity document uploaded",
                body: `${row.full_name ?? "A customer"} uploaded their driver's license for verification.`,
                href: `/admin/identity/${row.user_id}`,
                createdAt: row.updated_at,
              });
            }
          },
        )
        .subscribe();

      channels.push(profileChannel);
    }

    return () => {
      channels.forEach((channel) => {
        void supabase.removeChannel(channel);
      });
    };
  }, [supabase, initial.isAdmin, addNotification]);

  /*
   * Messages are already represented by unreadMessages.
   * Do not count their notification objects a second time.
   */
  const realtimeNotificationCount = notifications.filter(
    (notification) => !notification.read && notification.type !== "new_message",
  ).length;

  /*
   * Initial server-side attention counts.
   *
   * These are intentionally included in the bell badge because
   * they represent things the user still needs to act on.
   */
  const initialAttentionCount = initial.pendingApplications + initial.planReady;

  /*
   * Final badge:
   *
   * unread messages
   * +
   * pending applications / plan-ready items
   * +
   * new realtime non-message notifications
   */
  const totalUnread =
    unreadMessages + initialAttentionCount + realtimeNotificationCount;

  return {
    notifications,
    unreadMessages,
    totalUnread,
  };
}
