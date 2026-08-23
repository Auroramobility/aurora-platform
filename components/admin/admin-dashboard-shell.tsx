"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { createClient } from "@/lib/supabase/client";
import { NotificationBell } from "@/features/notifications/notification-bell";
import {
  LayoutDashboard,
  Users,
  CarFront,
  ImagePlus,
  ClipboardList,
  ShieldCheck,
  FileText,
  CreditCard,
  MessageSquare,
  ExternalLink,
  LogOut,
  Menu,
  X,
  CircleDot,
} from "lucide-react";
import { useEffect, useState } from "react";

type AdminDashboardShellProps = {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
};

const navigation = [
  {
    label: "Overview",
    color: "blue",
    items: [
      {
        label: "Dashboard",
        href: "/admin",
        icon: LayoutDashboard,
      },
    ],
  },
  {
    label: "Customers",
    color: "green",
    items: [
      {
        label: "Customers",
        href: "/admin/customers",
        icon: Users,
      },
    ],
  },
  {
    label: "Catalogue",
    color: "purple",
    items: [
      {
        label: "Vehicles",
        href: "/admin/vehicles",
        icon: CarFront,
      },
      {
        label: "Image Management",
        href: "/admin/vehicles/images",
        icon: ImagePlus,
      },
    ],
  },
  {
    label: "Applications",
    color: "yellow",
    items: [
      {
        label: "Applications",
        href: "/admin/applications",
        icon: ClipboardList,
      },
    ],
  },
  {
    label: "Verification",
    color: "blue",
    items: [
      {
        label: "Identity",
        href: "/admin/identity",
        icon: ShieldCheck,
      },
    ],
  },
  {
    label: "Ownership",
    color: "green",
    items: [
      {
        label: "Ownership Plans",
        href: "/admin/ownership",
        icon: FileText,
      },
    ],
  },
  {
    label: "Finance",
    color: "yellow",
    items: [
      {
        label: "Payments",
        href: "/admin/payments",
        icon: CreditCard,
      },
    ],
  },
  {
    label: "Communication",
    color: "red",
    items: [
      {
        label: "Messages",
        href: "/admin/messages",
        icon: MessageSquare,
      },
    ],
  },
] as const;

const groupStyles = {
  blue: {
    label: "text-blue-600 dark:text-blue-400",
    dot: "bg-blue-500",
    active:
      "bg-blue-50 text-blue-700 border-blue-200 shadow-sm hover:bg-blue-100 dark:bg-blue-500/10 dark:text-blue-300 dark:border-blue-400/20 dark:hover:bg-blue-500/15",
    icon: "text-blue-600 dark:text-blue-400 group-hover:text-blue-700 dark:group-hover:text-blue-300",
    activeDot: "bg-blue-500 dark:bg-blue-400",
  },

  green: {
    label: "text-emerald-600 dark:text-emerald-400",
    dot: "bg-emerald-500",
    active:
      "bg-emerald-50 text-emerald-700 border-emerald-200 shadow-sm hover:bg-emerald-100 dark:bg-emerald-500/10 dark:text-emerald-300 dark:border-emerald-400/20 dark:hover:bg-emerald-500/15",
    icon: "text-emerald-600 dark:text-emerald-400 group-hover:text-emerald-700 dark:group-hover:text-emerald-300",
    activeDot: "bg-emerald-500 dark:bg-emerald-400",
  },

  purple: {
    label: "text-violet-600 dark:text-violet-400",
    dot: "bg-violet-500",
    active:
      "bg-violet-50 text-violet-700 border-violet-200 shadow-sm hover:bg-violet-100 dark:bg-violet-500/10 dark:text-violet-300 dark:border-violet-400/20 dark:hover:bg-violet-500/15",
    icon: "text-violet-600 dark:text-violet-400 group-hover:text-violet-700 dark:group-hover:text-violet-300",
    activeDot: "bg-violet-500 dark:bg-violet-400",
  },

  yellow: {
    label: "text-amber-600 dark:text-amber-400",
    dot: "bg-amber-500",
    active:
      "bg-amber-50 text-amber-700 border-amber-200 shadow-sm hover:bg-amber-100 dark:bg-amber-500/10 dark:text-amber-300 dark:border-amber-400/20 dark:hover:bg-amber-500/15",
    icon: "text-amber-600 dark:text-amber-400 group-hover:text-amber-700 dark:group-hover:text-amber-300",
    activeDot: "bg-amber-500 dark:bg-amber-400",
  },

  red: {
    label: "text-rose-600 dark:text-rose-400",
    dot: "bg-rose-500",
    active:
      "bg-rose-50 text-rose-700 border-rose-200 shadow-sm hover:bg-rose-100 dark:bg-rose-500/10 dark:text-rose-300 dark:border-rose-400/20 dark:hover:bg-rose-500/15",
    icon: "text-rose-600 dark:text-rose-400 group-hover:text-rose-700 dark:group-hover:text-rose-300",
    activeDot: "bg-rose-500 dark:bg-rose-400",
  },
} as const;

function isActivePath(pathname: string, href: string) {
  if (href === "/admin") {
    return pathname === "/admin";
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}

export function AdminDashboardShell({
  children,
  title = "Operations",
  subtitle = "Aurora Mobility administration",
}: AdminDashboardShellProps) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const [unreadMessages, setUnreadMessages] = useState(0);
  const [pendingApplications, setPendingApplications] = useState(0);

  useEffect(() => {
    let mounted = true;

    async function loadAdminNotificationCounts() {
      const supabase = createClient();

      const [messagesResult, applicationsResult] = await Promise.all([
        supabase
          .from("messages")
          .select("id", { count: "exact", head: true })
          .eq("sender_role", "customer")
          .is("admin_read_at", null),

        supabase
          .from("applications")
          .select("id", { count: "exact", head: true })
          .in("status", ["pending", "reviewing"]),
      ]);

      if (!mounted) return;

      setUnreadMessages(messagesResult.count ?? 0);
      setPendingApplications(applicationsResult.count ?? 0);
    }

    loadAdminNotificationCounts();

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors">
      {/* Mobile header */}
      <header className="sticky top-0 z-50 flex h-16 items-center justify-between border-b border-border bg-background/95 px-4 shadow-sm backdrop-blur-xl lg:hidden">
        <Link
          href="/admin"
          className="flex items-center gap-3"
          onClick={() => setMobileOpen(false)}
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary shadow-sm shadow-primary/20">
            <span className="text-sm font-black text-primary-foreground">
              A
            </span>
          </div>

          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-foreground">
              Aurora
            </p>

            <p className="text-[10px] font-medium text-muted-foreground">
              Operations
            </p>
          </div>
        </Link>

        <div className="flex items-center gap-2">
          <NotificationBell
            initialUnreadMessages={unreadMessages}
            initialPendingApplications={pendingApplications}
            initialPlanReady={0}
            isAdmin
          />

          <ThemeToggle />

          <button
            type="button"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((value) => !value)}
            className="bg-card rounded-xl border border-border p-2.5 text-muted-foreground shadow-sm transition hover:border-primary/30 hover:bg-muted hover:text-foreground"
          >
            {mobileOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
        </div>
      </header>

      {/* Mobile navigation */}
      {mobileOpen && (
        <div className="fixed inset-0 top-16 z-40 overflow-y-auto border-t border-border bg-background lg:hidden">
          <AdminNavigation
            pathname={pathname}
            mobile
            onNavigate={() => setMobileOpen(false)}
          />
        </div>
      )}

      <div className="flex min-h-screen">
        {/* Desktop sidebar */}
        <aside className="bg-card hidden w-72 shrink-0 border-r border-border lg:block">
          <div className="sticky top-0 flex h-screen flex-col">
            {/* Brand */}
            <div className="from-card via-card border-b border-border bg-gradient-to-br to-primary/[0.04] px-6 py-5">
              <Link href="/admin" className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary shadow-md shadow-primary/20">
                  <span className="text-sm font-black text-primary-foreground">
                    A
                  </span>
                </div>

                <div>
                  <p className="text-[11px] font-black uppercase tracking-[0.2em] text-foreground">
                    Aurora Mobility
                  </p>

                  <p className="mt-0.5 text-[10px] font-medium text-muted-foreground">
                    Operations Console
                  </p>
                </div>
              </Link>
            </div>

            {/* Navigation */}
            <div className="flex-1 overflow-y-auto px-3 py-5">
              <AdminNavigation pathname={pathname} />
            </div>

            {/* Footer */}
            <div className="border-t border-border bg-muted/20 p-3">
              <AdminFooterLinks />
            </div>
          </div>
        </aside>

        {/* Main content */}
        <main className="min-w-0 flex-1 bg-background">
          {/* Page header */}
          <div className="border-b border-border bg-gradient-to-r from-background via-background to-primary/[0.035]">
            <div className="mx-auto max-w-7xl px-6 py-7 lg:px-8">
              <div className="flex items-start justify-between gap-6">
                <div className="flex items-start gap-4">
                  <div className="mt-1 flex h-10 w-1.5 shrink-0 overflow-hidden rounded-full bg-gradient-to-b from-primary via-blue-500 to-violet-500" />

                  <div>
                    <div className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-emerald-500 shadow-sm shadow-emerald-500/40" />

                      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">
                        Aurora Operations
                      </p>

                      <CircleDot className="h-3 w-3 text-muted-foreground/40" />
                    </div>

                    <h1 className="mt-2 text-2xl font-black tracking-tight sm:text-3xl">
                      {title}
                    </h1>

                    <p className="mt-1 max-w-3xl text-sm text-muted-foreground">
                      {subtitle}
                    </p>
                  </div>
                </div>

                {/* Desktop actions */}
                <div className="hidden items-center gap-2 lg:flex">
                  <NotificationBell
                    initialUnreadMessages={unreadMessages}
                    initialPendingApplications={pendingApplications}
                    initialPlanReady={0}
                    isAdmin
                  />

                  <div className="bg-card rounded-xl border border-border p-1.5 shadow-sm">
                    <ThemeToggle />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Page content */}
          <div className="mx-auto max-w-7xl px-6 py-7 lg:px-8">{children}</div>
        </main>
      </div>
    </div>
  );
}

function AdminNavigation({
  pathname,
  mobile = false,
  onNavigate,
}: {
  pathname: string;
  mobile?: boolean;
  onNavigate?: () => void;
}) {
  return (
    <nav className={mobile ? "px-4 py-6" : ""}>
      <div className="space-y-6">
        {navigation.map((group) => {
          const styles = groupStyles[group.color];

          return (
            <div key={group.label}>
              <div className="mb-2 flex items-center gap-2 px-3">
                <span className={`h-1.5 w-1.5 rounded-full ${styles.dot}`} />

                <p
                  className={`text-[9px] font-black uppercase tracking-[0.2em] ${styles.label}`}
                >
                  {group.label}
                </p>
              </div>

              <div className="space-y-1">
                {group.items.map((item) => {
                  const active = isActivePath(pathname, item.href);
                  const Icon = item.icon;

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={onNavigate}
                      className={`group relative flex items-center gap-3 rounded-xl border px-3 py-2.5 text-sm font-semibold transition-all duration-200 ${
                        active
                          ? styles.active
                          : "border-transparent text-muted-foreground hover:border-border hover:bg-muted hover:text-foreground"
                      }`}
                    >
                      <Icon
                        className={`h-4 w-4 shrink-0 transition ${
                          active
                            ? styles.icon
                            : `text-muted-foreground ${styles.icon}`
                        }`}
                      />

                      <span>{item.label}</span>

                      {active ? (
                        <span
                          className={`ml-auto h-1.5 w-1.5 rounded-full ${styles.activeDot}`}
                        />
                      ) : null}
                    </Link>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </nav>
  );
}

function AdminFooterLinks() {
  return (
    <div className="space-y-1">
      <Link
        href="/dashboard"
        className="group flex items-center gap-3 rounded-xl border border-transparent px-3 py-2.5 text-sm font-medium text-muted-foreground transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700 dark:hover:border-blue-400/20 dark:hover:bg-blue-500/10 dark:hover:text-blue-300"
      >
        <ExternalLink className="h-4 w-4 text-blue-500 transition group-hover:text-blue-600 dark:text-blue-400" />
        Customer View
      </Link>

      <form action="/api/auth/signout" method="POST">
        <button
          type="submit"
          className="group flex w-full items-center gap-3 rounded-xl border border-transparent px-3 py-2.5 text-sm font-medium text-muted-foreground transition hover:border-red-200 hover:bg-red-50 hover:text-red-700 dark:hover:border-red-400/20 dark:hover:bg-red-500/10 dark:hover:text-red-300"
        >
          <LogOut className="h-4 w-4 text-red-500 transition group-hover:text-red-600 dark:text-red-400" />
          Sign out
        </button>
      </form>
    </div>
  );
}
