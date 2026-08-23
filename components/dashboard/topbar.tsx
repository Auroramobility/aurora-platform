import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { signOutAction } from "@/app/settings/actions/sign-out";
import { MobileSidebar } from "@/components/dashboard/mobile-sidebar";
import { NotificationBell } from "@/features/notifications/notification-bell";
import { ThemeToggle } from "@/components/theme/theme-toggle";

type Props = {
  title: string;
  email: string;
  backHref?: string;
  backLabel?: string;
};

export async function Topbar({ title, email, backHref, backLabel }: Props) {
  const initial = (email[0] ?? "A").toUpperCase();

  const supabase = await createClient();
  const { data: adminFlag } = await supabase.rpc("is_admin");
  const isAdmin = adminFlag === true;

  const [msgResult, queueResult] = await Promise.all([
    supabase
      .from("messages")
      .select("id", { count: "exact", head: true })
      .eq("sender_role", isAdmin ? "customer" : "admin")
      .is(isAdmin ? "admin_read_at" : "customer_read_at", null),
    isAdmin
      ? supabase
          .from("applications")
          .select("id", { count: "exact", head: true })
          .in("status", ["pending", "reviewing"])
      : supabase
          .from("ownership_plans")
          .select("id", { count: "exact", head: true })
          .eq("status", "ready"),
  ]);

  const unreadMessages = msgResult.count ?? 0;
  const pendingApplications = isAdmin ? (queueResult.count ?? 0) : 0;
  const planReady = isAdmin ? 0 : (queueResult.count ?? 0);

  return (
    <header className="sticky top-0 z-30 flex shrink-0 items-center justify-between border-b border-border bg-surface/90 px-4 py-3 backdrop-blur-sm sm:px-8">
      <div className="flex items-center gap-3">
        <MobileSidebar />

        <div>
          {backHref ? (
            <Link
              href={backHref}
              className="mb-0.5 inline-flex items-center gap-1 text-xs text-muted-foreground transition-colors hover:text-foreground"
            >
              <ChevronLeft className="h-3 w-3" />
              {backLabel ?? "Back"}
            </Link>
          ) : null}
          <h2
            className="aurora-gradient-text text-xl font-semibold"
            style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
          >
            {title}
          </h2>
          <p className="hidden text-xs text-muted-foreground sm:block">
            {email}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3 sm:gap-4">
        <NotificationBell
          initialUnreadMessages={unreadMessages}
          initialPendingApplications={pendingApplications}
          initialPlanReady={planReady}
          isAdmin={isAdmin}
        />
        <ThemeToggle />

        <div
          className="flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold text-white shadow-sm"
          style={{
            background:
              "linear-gradient(135deg, hsl(var(--primary)), hsl(var(--accent)))",
          }}
        >
          {initial}
        </div>

        <form action={signOutAction}>
          <button
            type="submit"
            className="hidden text-sm font-medium text-muted-foreground transition hover:text-primary sm:block"
          >
            Sign out
          </button>
        </form>
      </div>
    </header>
  );
}
