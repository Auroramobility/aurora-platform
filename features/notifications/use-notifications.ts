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
      if (prev.some((n) => n.id === notif.id)) return prev;

      return [{ ...notif, read: false }, ...prev].slice(0, 20);
    });
  }, []);

  const markAllRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    setUnreadMessages(0);
  }, []);

  useEffect(() => {
    const channels: ReturnType<typeof supabase.channel>[] = [];

    /*
     * Every hook instance gets its own channel names.
     *
     * This prevents Next.js/React development remounts from trying to
     * register callbacks on an already-subscribed Realtime channel.
     */
    const channelPrefix = `aurora-notif-${
      initial.isAdmin ? "admin" : "customer"
    }-${crypto.randomUUID()}`;

    // ============================================================
    // Messages
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

          setUnreadMessages((c) => c + 1);

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
    // Applications
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

          if (row.status === old.status) return;

          // Admin notification
          if (initial.isAdmin && row.status === "pending") {
            addNotification({
              id: `app-${row.id}-pending`,
              type: "admin_new_application",
              title: "New application submitted",
              body: "A customer has submitted a new vehicle application.",
              href: `/admin/applications/${row.id}`,
              createdAt: row.updated_at,
            });

            return;
          }

          // Customer notifications
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
            } else if (row.status === "approved") {
              addNotification({
                id: `app-${row.id}-approved`,
                type: "application_approved",
                title: "Application approved! 🎉",
                body: "Congratulations — your application has been approved.",
                href: `/applications/${row.id}`,
                createdAt: row.updated_at,
              });
            } else if (row.status === "rejected") {
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
    // Ownership plans
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

          if (row.status === old.status) return;

          // Customer: plan ready
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

          // Customer: plan activated
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

          // Admin: customer accepted plan
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
    // Identity documents — admin only
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
                href: `/admin`,
                createdAt: row.updated_at,
              });
            }
          },
        )
        .subscribe();

      channels.push(profileChannel);
    }

    // ============================================================
    // Cleanup
    // ============================================================

    return () => {
      channels.forEach((channel) => {
        void supabase.removeChannel(channel);
      });
    };
  }, [supabase, initial.isAdmin, addNotification]);

  const totalUnread =
    notifications.filter((n) => !n.read).length + unreadMessages;

  return {
    notifications,
    unreadMessages,
    totalUnread,
    markAllRead,
  };
}
