import Link from "next/link";
import { redirect } from "next/navigation";
import {
  ArrowRight,
  CarFront,
  ClipboardList,
  CreditCard,
  FileText,
  ImagePlus,
  MessageSquare,
  ShieldCheck,
  Users,
} from "lucide-react";

import { AdminDashboardShell } from "@/components/admin/admin-dashboard-shell";
import { requireAdmin } from "@/features/admin/lib/authorization";

export default async function AdminPage() {
  const { supabase, user, isAdmin } = await requireAdmin();

  if (!user) redirect("/login");
  if (!isAdmin) redirect("/dashboard");

  /*
   * ============================================================
   * AURORA OPERATIONS COMMAND CENTER
   * ============================================================
   *
   * The detailed operational workflows remain in their existing
   * dedicated workspaces.
   *
   * This page is the operational overview only.
   */

  const [
    pendingApplicationsResult,
    identityQueueResult,
    approvedApplicationsResult,
    activePlansResult,
    customersResult,
    vehiclesResult,
  ] = await Promise.all([
    supabase
      .from("applications")
      .select("id", { count: "exact", head: true })
      .in("status", ["pending", "reviewing"]),

    supabase
      .from("profiles")
      .select("user_id", { count: "exact", head: true })
      .eq("identity_verified", false)
      .or("drivers_license_front.not.is.null,drivers_license_back.not.is.null"),

    supabase
      .from("applications")
      .select("id", { count: "exact", head: true })
      .eq("status", "approved"),

    supabase
      .from("ownership_plans")
      .select("id", { count: "exact", head: true })
      .eq("status", "active"),

    supabase.from("profiles").select("user_id", { count: "exact", head: true }),

    supabase.from("vehicles").select("id", { count: "exact", head: true }),
  ]);

  const pendingApplications = pendingApplicationsResult.count ?? 0;
  const identityQueue = identityQueueResult.count ?? 0;
  const approvedApplications = approvedApplicationsResult.count ?? 0;
  const activePlans = activePlansResult.count ?? 0;
  const customers = customersResult.count ?? 0;
  const vehicles = vehiclesResult.count ?? 0;

  /*
   * Ownership plans requiring operator action.
   */
  const [draftPlansResult, acceptedPlansResult] = await Promise.all([
    supabase
      .from("ownership_plans")
      .select("id", { count: "exact", head: true })
      .eq("status", "draft"),

    supabase
      .from("ownership_plans")
      .select("id", { count: "exact", head: true })
      .eq("status", "accepted"),
  ]);

  const draftPlans = draftPlansResult.count ?? 0;
  const acceptedPlans = acceptedPlansResult.count ?? 0;

  const ownershipActions = draftPlans + acceptedPlans;

  const totalAttention = pendingApplications + identityQueue + ownershipActions;

  return (
    <AdminDashboardShell
      title="Operations Command Center"
      subtitle="Manage the complete Aurora customer, vehicle, application, ownership, payment, and communication lifecycle."
    >
      <div className="space-y-10">
        {/* ======================================================
            COMMAND CENTER HERO
            ====================================================== */}

        <section className="bg-card relative overflow-hidden rounded-[2rem] border border-border shadow-sm">
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
            <div className="absolute -bottom-32 left-1/3 h-64 w-64 rounded-full bg-blue-500/5 blur-3xl" />
          </div>

          <div className="relative p-7 sm:p-9 lg:p-10">
            <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
              <div className="max-w-3xl">
                <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-[10px] font-black uppercase tracking-[0.18em] text-emerald-700 dark:border-emerald-400/20 dark:bg-emerald-500/10 dark:text-emerald-400">
                  <span className="h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_0_4px_rgba(16,185,129,0.12)]" />
                  Live Operations
                </div>

                <h2 className="text-3xl font-black tracking-tight sm:text-4xl lg:text-5xl">
                  Aurora Operations
                </h2>

                <p className="mt-4 max-w-2xl text-sm leading-7 text-muted-foreground sm:text-base">
                  Your central operations workspace. Monitor activity, identify
                  items requiring attention, and move directly into the
                  workspace where each operational task is managed.
                </p>
              </div>

              <div className="min-w-[190px] rounded-2xl border border-primary/20 bg-primary/[0.06] p-5 dark:bg-primary/[0.08]">
                <p className="text-[10px] font-black uppercase tracking-[0.18em] text-primary">
                  Needs attention
                </p>

                <p className="mt-2 text-4xl font-black tracking-tight">
                  {totalAttention}
                </p>

                <p className="mt-1 text-xs text-muted-foreground">
                  Active operational items
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ======================================================
            ATTENTION QUEUES
            ====================================================== */}

        <section className="space-y-5">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">
              Operations
            </p>

            <h2 className="mt-2 text-2xl font-black tracking-tight">
              Needs attention
            </h2>

            <p className="mt-1 text-sm text-muted-foreground">
              Prioritized queues requiring operator review or action.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            <DashboardMetricCard
              href="/admin/applications"
              icon={ClipboardList}
              eyebrow="Applications"
              title="Application review"
              value={pendingApplications}
              description={
                pendingApplications === 1
                  ? "application requires attention"
                  : "applications require attention"
              }
              tone="yellow"
            />

            <DashboardMetricCard
              href="/admin/identity"
              icon={ShieldCheck}
              eyebrow="Verification"
              title="Identity verification"
              value={identityQueue}
              description={
                identityQueue === 1
                  ? "identity requires review"
                  : "identities require review"
              }
              tone="red"
            />

            <DashboardMetricCard
              href="/admin/ownership"
              icon={FileText}
              eyebrow="Ownership"
              title="Ownership actions"
              value={ownershipActions}
              description={
                ownershipActions === 1
                  ? "plan requires action"
                  : "plans require action"
              }
              tone="green"
            />
          </div>
        </section>

        {/* ======================================================
            CORE WORKSPACES
            ====================================================== */}

        <section className="space-y-5">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">
              Workspaces
            </p>

            <h2 className="mt-2 text-2xl font-black tracking-tight">
              Operations
            </h2>

            <p className="mt-1 text-sm text-muted-foreground">
              Enter the dedicated workspace for the operation you need to
              perform.
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            <DashboardWorkspaceCard
              href="/admin/applications"
              icon={ClipboardList}
              title="Applications"
              description="Review customer applications, approve or reject submissions, and manage the application lifecycle."
              stat={`${pendingApplications} awaiting review`}
              tone="blue"
            />

            <DashboardWorkspaceCard
              href="/admin/identity"
              icon={ShieldCheck}
              title="Identity Verification"
              description="Review uploaded identity documents and make authorized verification decisions."
              stat={`${identityQueue} awaiting verification`}
              tone="violet"
            />

            <DashboardWorkspaceCard
              href="/admin/ownership"
              icon={FileText}
              title="Ownership Plans"
              description="Prepare, manage, and activate customer ownership plans."
              stat={`${activePlans} active plans`}
              tone="green"
            />

            <DashboardWorkspaceCard
              href="/admin/payments"
              icon={CreditCard}
              title="Payments"
              description="Review payment activity and record manually confirmed payments."
              stat="Open payment workspace"
              tone="amber"
            />

            <DashboardWorkspaceCard
              href="/admin/customers"
              icon={Users}
              title="Customers"
              description="View and manage Aurora customer records and operational information."
              stat={`${customers} customer records`}
              tone="cyan"
            />

            <DashboardWorkspaceCard
              href="/admin/messages"
              icon={MessageSquare}
              title="Messages"
              description="Communicate with customers through the Aurora operational messaging workspace."
              stat="Open customer messages"
              tone="rose"
            />
          </div>
        </section>

        {/* ======================================================
            CATALOGUE
            ====================================================== */}

        <section className="space-y-5">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">
              Catalogue
            </p>

            <h2 className="mt-2 text-2xl font-black tracking-tight">
              Vehicle operations
            </h2>

            <p className="mt-1 text-sm text-muted-foreground">
              Manage the vehicle catalogue and its imagery.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <DashboardWorkspaceCard
              href="/admin/vehicles"
              icon={CarFront}
              title="Vehicles"
              description="Manage Aurora's vehicle catalogue, specifications, pricing, availability, and vehicle records."
              stat={`${vehicles} vehicles in catalogue`}
              tone="indigo"
            />

            <DashboardWorkspaceCard
              href="/admin/vehicles/images"
              icon={ImagePlus}
              title="Image Management"
              description="Manage vehicle imagery and keep catalogue presentation assets organized."
              stat="Manage vehicle media"
              tone="orange"
            />
          </div>
        </section>

        {/* ======================================================
            SYSTEM OVERVIEW
            ====================================================== */}

        <section className="bg-card overflow-hidden rounded-3xl border border-border shadow-sm">
          <div className="border-b border-border bg-muted/20 px-6 py-5 sm:px-7">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">
              System overview
            </p>

            <h2 className="mt-2 text-xl font-black tracking-tight">
              Aurora at a glance
            </h2>
          </div>

          <div className="grid divide-y divide-border sm:grid-cols-2 sm:divide-x sm:divide-y-0 lg:grid-cols-4">
            <SummaryItem
              label="Customers"
              value={customers}
              href="/admin/customers"
              tone="blue"
            />

            <SummaryItem
              label="Vehicles"
              value={vehicles}
              href="/admin/vehicles"
              tone="green"
            />

            <SummaryItem
              label="Approved applications"
              value={approvedApplications}
              href="/admin/applications"
              tone="violet"
            />

            <SummaryItem
              label="Active ownership plans"
              value={activePlans}
              href="/admin/ownership"
              tone="amber"
            />
          </div>
        </section>

        {/* ======================================================
            QUICK ACTIONS
            ====================================================== */}

        <section className="rounded-3xl border border-border bg-muted/30 p-5 sm:p-6">
          <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-center">
            <div>
              <p className="text-sm font-bold">Quick access</p>

              <p className="mt-1 text-sm text-muted-foreground">
                Jump directly into the operational workspace you need.
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <QuickLink href="/admin/applications">Applications</QuickLink>

              <QuickLink href="/admin/identity">Identity</QuickLink>

              <QuickLink href="/admin/ownership">Ownership</QuickLink>

              <QuickLink href="/admin/payments">Payments</QuickLink>

              <QuickLink href="/admin/messages">Messages</QuickLink>
            </div>
          </div>
        </section>
      </div>
    </AdminDashboardShell>
  );
}

/* ================================================================
   DASHBOARD METRIC CARD
   ================================================================ */

function DashboardMetricCard({
  href,
  icon: Icon,
  eyebrow,
  title,
  value,
  description,
  tone,
}: {
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  eyebrow: string;
  title: string;
  value: number;
  description: string;
  tone: "yellow" | "red" | "green";
}) {
  const toneClasses = {
    yellow: {
      border:
        "border-amber-200 bg-amber-50 dark:border-amber-400/20 dark:bg-amber-500/[0.07]",
      icon: "bg-amber-400 text-black dark:bg-amber-400/20 dark:text-amber-300",
      eyebrow: "text-amber-800 dark:text-amber-300",
      value: "text-amber-950 dark:text-amber-100",
    },

    red: {
      border:
        "border-red-200 bg-red-50 dark:border-red-400/20 dark:bg-red-500/[0.07]",
      icon: "bg-red-500 text-white dark:bg-red-500/20 dark:text-red-300",
      eyebrow: "text-red-800 dark:text-red-300",
      value: "text-red-950 dark:text-red-100",
    },

    green: {
      border:
        "border-emerald-200 bg-emerald-50 dark:border-emerald-400/20 dark:bg-emerald-500/[0.07]",
      icon: "bg-emerald-500 text-black dark:bg-emerald-500/20 dark:text-emerald-300",
      eyebrow: "text-emerald-800 dark:text-emerald-300",
      value: "text-emerald-950 dark:text-emerald-100",
    },
  } as const;

  const styles = toneClasses[tone];

  return (
    <Link
      href={href}
      className={`group relative overflow-hidden rounded-3xl border p-6 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-lg ${styles.border}`}
    >
      <div className="absolute -right-10 -top-10 h-28 w-28 rounded-full bg-white/40 blur-2xl dark:bg-white/5" />

      <div className="relative flex items-start justify-between gap-4">
        <div>
          <p
            className={`text-xs font-black uppercase tracking-[0.15em] ${styles.eyebrow}`}
          >
            {eyebrow}
          </p>

          <h3 className="mt-2 text-lg font-bold">{title}</h3>

          <p
            className={`mt-4 text-4xl font-black tracking-tight ${styles.value}`}
          >
            {value}
          </p>

          <p className="mt-1 text-xs text-muted-foreground">{description}</p>
        </div>

        <div
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ${styles.icon}`}
        >
          <Icon className="h-5 w-5" />
        </div>
      </div>

      <div className="relative mt-6 flex items-center gap-2 text-sm font-semibold">
        Open workspace
        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
      </div>
    </Link>
  );
}

/* ================================================================
   DASHBOARD WORKSPACE CARD
   ================================================================ */

function DashboardWorkspaceCard({
  href,
  icon: Icon,
  title,
  description,
  stat,
  tone,
}: {
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  stat: string;
  tone:
    | "blue"
    | "violet"
    | "green"
    | "amber"
    | "cyan"
    | "rose"
    | "indigo"
    | "orange";
}) {
  const toneClasses = {
    blue: {
      shell:
        "border-blue-200/80 bg-blue-50/70 hover:border-blue-300 hover:bg-blue-50 dark:border-blue-400/20 dark:bg-blue-500/[0.06] dark:hover:bg-blue-500/[0.10]",
      icon: "bg-blue-500/10 text-blue-600 dark:bg-blue-400/15 dark:text-blue-400",
    },

    violet: {
      shell:
        "border-violet-200/80 bg-violet-50/70 hover:border-violet-300 hover:bg-violet-50 dark:border-violet-400/20 dark:bg-violet-500/[0.06] dark:hover:bg-violet-500/[0.10]",
      icon: "bg-violet-500/10 text-violet-600 dark:bg-violet-400/15 dark:text-violet-400",
    },

    green: {
      shell:
        "border-emerald-200/80 bg-emerald-50/70 hover:border-emerald-300 hover:bg-emerald-50 dark:border-emerald-400/20 dark:bg-emerald-500/[0.06] dark:hover:bg-emerald-500/[0.10]",
      icon: "bg-emerald-500/10 text-emerald-600 dark:bg-emerald-400/15 dark:text-emerald-400",
    },

    amber: {
      shell:
        "border-amber-200/80 bg-amber-50/70 hover:border-amber-300 hover:bg-amber-50 dark:border-amber-400/20 dark:bg-amber-500/[0.06] dark:hover:bg-amber-500/[0.10]",
      icon: "bg-amber-500/10 text-amber-600 dark:bg-amber-400/15 dark:text-amber-400",
    },

    cyan: {
      shell:
        "border-cyan-200/80 bg-cyan-50/70 hover:border-cyan-300 hover:bg-cyan-50 dark:border-cyan-400/20 dark:bg-cyan-500/[0.06] dark:hover:bg-cyan-500/[0.10]",
      icon: "bg-cyan-500/10 text-cyan-600 dark:bg-cyan-400/15 dark:text-cyan-400",
    },

    rose: {
      shell:
        "border-rose-200/80 bg-rose-50/70 hover:border-rose-300 hover:bg-rose-50 dark:border-rose-400/20 dark:bg-rose-500/[0.06] dark:hover:bg-rose-500/[0.10]",
      icon: "bg-rose-500/10 text-rose-600 dark:bg-rose-400/15 dark:text-rose-400",
    },

    indigo: {
      shell:
        "border-indigo-200/80 bg-indigo-50/70 hover:border-indigo-300 hover:bg-indigo-50 dark:border-indigo-400/20 dark:bg-indigo-500/[0.06] dark:hover:bg-indigo-500/[0.10]",
      icon: "bg-indigo-500/10 text-indigo-600 dark:bg-indigo-400/15 dark:text-indigo-400",
    },

    orange: {
      shell:
        "border-orange-200/80 bg-orange-50/70 hover:border-orange-300 hover:bg-orange-50 dark:border-orange-400/20 dark:bg-orange-500/[0.06] dark:hover:bg-orange-500/[0.10]",
      icon: "bg-orange-500/10 text-orange-600 dark:bg-orange-400/15 dark:text-orange-400",
    },
  } as const;

  const styles = toneClasses[tone];

  return (
    <Link
      href={href}
      className={`group relative overflow-hidden rounded-3xl border p-6 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-lg ${styles.shell}`}
    >
      <div className="flex items-start justify-between gap-4">
        <div
          className={`flex h-11 w-11 items-center justify-center rounded-2xl ${styles.icon}`}
        >
          <Icon className="h-5 w-5" />
        </div>

        <ArrowRight className="h-4 w-4 text-muted-foreground transition-all group-hover:translate-x-1 group-hover:text-foreground" />
      </div>

      <h3 className="mt-5 text-lg font-bold">{title}</h3>

      <p className="mt-2 text-sm leading-6 text-muted-foreground">
        {description}
      </p>

      <div className="mt-5 border-t border-black/5 pt-4 dark:border-white/10">
        <p className="text-xs font-semibold text-muted-foreground">{stat}</p>
      </div>
    </Link>
  );
}

/* ================================================================
   SUMMARY ITEM
   ================================================================ */

function SummaryItem({
  label,
  value,
  href,
  tone,
}: {
  label: string;
  value: number;
  href: string;
  tone: "blue" | "green" | "violet" | "amber";
}) {
  const toneClasses = {
    blue: "text-blue-600 dark:text-blue-400",
    green: "text-emerald-600 dark:text-emerald-400",
    violet: "text-violet-600 dark:text-violet-400",
    amber: "text-amber-600 dark:text-amber-400",
  } as const;

  return (
    <Link
      href={href}
      className="group p-6 transition-colors hover:bg-muted/50 sm:p-7"
    >
      <p className="text-xs font-semibold text-muted-foreground">{label}</p>

      <p
        className={`mt-2 text-3xl font-black tracking-tight ${toneClasses[tone]}`}
      >
        {value}
      </p>

      <div className="mt-3 flex items-center gap-1 text-xs font-semibold">
        View
        <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
      </div>
    </Link>
  );
}

/* ================================================================
   QUICK LINK
   ================================================================ */

function QuickLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="hover:bg-card inline-flex items-center rounded-xl border border-border bg-background px-3.5 py-2 text-xs font-semibold transition-all hover:border-foreground/20 hover:shadow-sm"
    >
      {children}
    </Link>
  );
}
