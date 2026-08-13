import Link from "next/link";
import { redirect } from "next/navigation";
import { CarFront, CreditCard } from "lucide-react";

import { createClient } from "@/lib/supabase/server";
import { PageHeader } from "@/components/ui/page-header";
import { Badge } from "@/components/ui/badge";
import { getOwnershipPlansForUser } from "@/features/ownership/lib/get-ownership-plans-for-user";
import { getOwnershipPlan } from "@/features/ownership/lib/get-ownership-plan";
import { getOwnershipPlanStatusConfig } from "@/features/ownership/types/ownership-plan";
import type { OwnershipPlanStatus } from "@/features/ownership/types/ownership-plan";

function money(value: number | null, currency = "USD") {
  return value == null
    ? "—"
    : new Intl.NumberFormat("en-US", { style: "currency", currency }).format(value);
}

function statusVariant(status: string) {
  if (status === "active" || status === "accepted") return "success" as const;
  if (status === "ready") return "warning" as const;
  if (status === "declined" || status === "cancelled") return "danger" as const;
  return "default" as const;
}

export default async function PaymentsPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const planSummaries = await getOwnershipPlansForUser();

  // A customer typically has 0-2 ownership plans, so fetching full
  // financing detail per plan (rather than a bespoke bulk query) reuses
  // getOwnershipPlan()'s existing, tested field mapping instead of
  // duplicating it here.
  const plans = await Promise.all(
    planSummaries.map(async (summary) => ({
      summary,
      detail: await getOwnershipPlan(summary.id),
    })),
  );

  return (
    <main className="mx-auto w-full max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <PageHeader
        title="Payments"
        description="Financing terms and payment history for your ownership plans."
      />

      {plans.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-border bg-surface p-12 text-center">
          <CreditCard className="h-10 w-10 text-muted-foreground" />
          <p className="mt-4 font-semibold">No ownership plan yet</p>
          <p className="mt-2 max-w-sm text-sm text-muted-foreground">
            Once you have an approved application and an active ownership
            plan, your financing terms and payment history will show up
            here.
          </p>
          <Link
            href="/vehicles"
            className="mt-6 rounded bg-primary px-6 py-3 text-sm font-medium text-primary-foreground"
          >
            Browse vehicles
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {plans.map(({ summary, detail }) => {
            const config = getOwnershipPlanStatusConfig(
              summary.status as OwnershipPlanStatus,
            );
            const currency = detail?.financingTerms?.currency ?? "USD";

            return (
              <Link
                key={summary.id}
                href={`/ownership/${summary.id}`}
                className="flex items-center gap-5 rounded-xl border border-border bg-surface p-5 transition hover:border-primary/40"
              >
                <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-muted">
                  {summary.vehicle?.image_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={summary.vehicle.image_url}
                      alt={`${summary.vehicle.brand} ${summary.vehicle.model}`}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <CarFront className="h-6 w-6 text-muted-foreground" />
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="truncate font-semibold">
                      {summary.vehicle
                        ? `${summary.vehicle.brand} ${summary.vehicle.model}${summary.vehicle.trim ? ` ${summary.vehicle.trim}` : ""}`
                        : "Vehicle unavailable"}
                    </p>
                    <Badge variant={statusVariant(summary.status)}>
                      {config.label}
                    </Badge>
                  </div>

                  <p className="mt-1 text-sm text-muted-foreground">
                    {detail?.financingTerms
                      ? `${money(detail.financingTerms.monthly_payment, currency)}/mo · Remaining balance ${money(detail.remainingBalance, currency)}`
                      : "Financing terms not prepared yet"}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </main>
  );
}
