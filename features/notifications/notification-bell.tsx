"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  Bell,
  MessageSquare,
  FileText,
  CheckCircle2,
  XCircle,
  Zap,
  X,
} from "lucide-react";

import { useNotifications } from "./use-notifications";
import type { Notification } from "./use-notifications";

type Props = {
  initialUnreadMessages: number;
  initialPendingApplications: number;
  initialPlanReady: number;
  isAdmin: boolean;
};

function NotifIcon({ type }: { type: Notification["type"] }) {
  const icons: Record<Notification["type"], React.ReactNode> = {
    new_message: <MessageSquare className="h-4 w-4 text-primary" />,
    application_reviewed: <FileText className="h-4 w-4 text-yellow-500" />,
    application_approved: <CheckCircle2 className="h-4 w-4 text-green-500" />,
    application_rejected: <XCircle className="text-destructive h-4 w-4" />,
    plan_ready: <Zap className="h-4 w-4 text-accent" />,
    plan_activated: <CheckCircle2 className="h-4 w-4 text-green-500" />,
    admin_new_application: <FileText className="h-4 w-4 text-primary" />,
    admin_identity_uploaded: <FileText className="h-4 w-4 text-yellow-500" />,
  };

  return <>{icons[type]}</>;
}

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();

  const mins = Math.floor(diff / 60000);

  if (mins < 1) {
    return "just now";
  }

  if (mins < 60) {
    return `${mins}m ago`;
  }

  const hrs = Math.floor(mins / 60);

  if (hrs < 24) {
    return `${hrs}h ago`;
  }

  return `${Math.floor(hrs / 24)}d ago`;
}

export function NotificationBell({
  initialUnreadMessages,
  initialPendingApplications,
  initialPlanReady,
  isAdmin,
}: Props) {
  const [open, setOpen] = useState(false);

  const panelRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const { notifications, unreadMessages, totalUnread } = useNotifications({
    unreadMessages: initialUnreadMessages,
    pendingApplications: initialPendingApplications,
    planReady: initialPlanReady,
    isAdmin,
  });

  useEffect(() => {
    function handleClick(event: MouseEvent) {
      if (
        panelRef.current &&
        !panelRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClick);

    return () => {
      document.removeEventListener("mousedown", handleClick);
    };
  }, []);

  function handleOpen() {
    setOpen((value) => !value);
  }

  const hasInitial =
    initialUnreadMessages > 0 ||
    initialPendingApplications > 0 ||
    initialPlanReady > 0;

  const hasNotifications = notifications.length > 0 || hasInitial;

  return (
    <div className="relative">
      <button
        ref={buttonRef}
        type="button"
        onClick={handleOpen}
        aria-label={`Notifications${
          totalUnread > 0 ? ` — ${totalUnread} unread` : ""
        }`}
        className="relative flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-background text-muted-foreground transition hover:bg-muted hover:text-foreground"
      >
        <Bell className="h-4 w-4" />

        {totalUnread > 0 ? (
          <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[9px] font-bold text-primary-foreground">
            {totalUnread > 9 ? "9+" : totalUnread}
          </span>
        ) : null}
      </button>

      {open ? (
        <div
          ref={panelRef}
          className="absolute right-0 top-12 z-50 w-80 overflow-hidden rounded-2xl border border-border bg-surface shadow-2xl shadow-black/20"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-border px-5 py-4">
            <div>
              <p className="text-sm font-semibold">Notifications</p>

              {unreadMessages > 0 ? (
                <p className="mt-0.5 text-xs text-primary">
                  {unreadMessages} unread message
                  {unreadMessages !== 1 ? "s" : ""}
                </p>
              ) : null}
            </div>

            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close notifications"
              className="flex h-7 w-7 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Items */}
          <div className="max-h-[380px] divide-y divide-border overflow-y-auto">
            {/* Unread messages */}
            {initialUnreadMessages > 0 ? (
              <Link
                href={isAdmin ? "/admin/messages" : "/messages"}
                onClick={() => setOpen(false)}
                className="flex items-start gap-3 px-5 py-4 transition hover:bg-muted/40"
              >
                <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10">
                  <MessageSquare className="h-4 w-4 text-primary" />
                </div>

                <div>
                  <p className="text-sm font-semibold">
                    {initialUnreadMessages} unread message
                    {initialUnreadMessages !== 1 ? "s" : ""}
                  </p>

                  <p className="mt-0.5 text-xs text-muted-foreground">
                    Tap to open your conversation
                  </p>
                </div>
              </Link>
            ) : null}

            {/* Customer ownership plan ready */}
            {!isAdmin && initialPlanReady > 0 ? (
              <Link
                href="/applications"
                onClick={() => setOpen(false)}
                className="flex items-start gap-3 px-5 py-4 transition hover:bg-muted/40"
              >
                <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent/10">
                  <Zap className="h-4 w-4 text-accent" />
                </div>

                <div>
                  <p className="text-sm font-semibold">Ownership plan ready</p>

                  <p className="mt-0.5 text-xs text-muted-foreground">
                    Aurora has prepared your ownership terms. Review and accept.
                  </p>
                </div>
              </Link>
            ) : null}

            {/* Admin pending applications */}
            {isAdmin && initialPendingApplications > 0 ? (
              <Link
                href="/admin"
                onClick={() => setOpen(false)}
                className="flex items-start gap-3 px-5 py-4 transition hover:bg-muted/40"
              >
                <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10">
                  <FileText className="h-4 w-4 text-primary" />
                </div>

                <div>
                  <p className="text-sm font-semibold">
                    {initialPendingApplications} application
                    {initialPendingApplications !== 1 ? "s" : ""} pending review
                  </p>

                  <p className="mt-0.5 text-xs text-muted-foreground">
                    Open the admin console to review
                  </p>
                </div>
              </Link>
            ) : null}

            {/* Realtime notifications */}
            {notifications.map((notification) => (
              <Link
                key={notification.id}
                href={notification.href}
                onClick={() => setOpen(false)}
                className={`flex items-start gap-3 px-5 py-4 transition hover:bg-muted/40 ${
                  !notification.read ? "bg-primary/5" : ""
                }`}
              >
                <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted">
                  <NotifIcon type={notification.type} />
                </div>

                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold">{notification.title}</p>

                  <p className="mt-0.5 line-clamp-2 text-xs text-muted-foreground">
                    {notification.body}
                  </p>

                  <p className="mt-1 text-[10px] text-muted-foreground/60">
                    {timeAgo(notification.createdAt)}
                  </p>
                </div>

                {!notification.read ? (
                  <div className="mt-2 h-2 w-2 shrink-0 rounded-full bg-primary" />
                ) : null}
              </Link>
            ))}

            {!hasNotifications ? (
              <div className="flex flex-col items-center justify-center gap-2 py-12 text-center">
                <Bell className="h-8 w-8 text-muted-foreground/30" />

                <p className="text-sm font-medium text-muted-foreground">
                  You're all caught up
                </p>

                <p className="text-xs text-muted-foreground/60">
                  New notifications appear here in real-time
                </p>
              </div>
            ) : null}
          </div>

          {/* Footer */}
          <div className="border-t border-border px-5 py-3">
            <Link
              href={isAdmin ? "/admin/messages" : "/messages"}
              onClick={() => setOpen(false)}
              className="text-xs font-semibold text-primary hover:underline"
            >
              View all messages →
            </Link>
          </div>
        </div>
      ) : null}
    </div>
  );
}
