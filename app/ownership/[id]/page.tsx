import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  CarFront,
  CheckCircle2,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { OwnershipPlanActions } from "@/features/ownership/components/ownership-plan-actions";
import { getOwnershipPlanStatusConfig } from "@/features/ownership/types/ownership-plan";
import { getOwnershipPlan } from "@/features/ownership/lib/get-ownership-plan";
import { createClient } from "@/lib/supabase/server";
import { BackButton } from "@/components/ui/back-button";

function money(value: number | null, currency = "USD") {
  return value == null
    ? "—"
    : new Intl.NumberFormat("en-US", {
        style: "currency",
        currency,
      }).format(value);
}

function statusVariant(status: string) {
  if (status === "active" || status === "accepted") return "success" as const;
  if (status === "ready") return "warning" as const;
  if (status === "declined" || status === "cancelled") return "danger" as const;
  return "default" as const;
}

type Props = { params: Promise<{ id: string }> };

export default async function OwnershipPlanPage({ params }: Props) {
  const { id } = await params;

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) notFound();

  const planView = await getOwnershipPlan(id);

  if (!planView) notFound();

  const {
    ownershipPlan: plan,
    financingTerms,
    paymentSchedule,
    payments,
  } = planView;

  const currency = financingTerms?.currency ?? "USD";

  const { data: application } = await supabase
    .from("applications")
    .select("id, vehicle_id, status")
    .eq("id", plan.application_id)
    .eq("user_id", user.id)
    .maybeSingle();

  if (!application) notFound();

  const { data: vehicle } = await supabase
    .from("vehicles")
    .select("id, brand, model, trim, image_url, price, year")
    .eq("id", application.vehicle_id)
    .maybeSingle();

  const config = getOwnershipPlanStatusConfig(plan.status);

  const canRespond =
    plan.status === "ready" && application.status === "approved";

  /*
   * Aurora Access Price is the financial foundation for this plan.
   *
   * Do not fall back to vehicle.price here. The ownership and payment
   * progress calculations must remain anchored to the Aurora Access
   * Price stored in financing_terms.vehicle_price.
   */
  const auroraAccessPrice = financingTerms?.vehicle_price ?? 0;

  /*
   * Aurora ownership / delivery threshold:
   * 30% of the Aurora Access Price.
   */
  const ownershipThreshold = auroraAccessPrice * 0.3;

  /*
   * Only completed payments count toward ownership progress.
   */
  const amountPaid = payments
    .filter((payment) => payment.payment_status === "completed")
    .reduce((sum, payment) => sum + payment.amount, 0);

  /*
   * Main journey gauge:
   * actual amount paid against the full Aurora Access Price.
   */
  const progressPercent =
    auroraAccessPrice > 0
      ? Math.min(100, (amountPaid / auroraAccessPrice) * 100)
      : 0;

  /*
   * Progress toward the fixed 30% threshold.
   */
  const thresholdProgressPercent =
    ownershipThreshold > 0
      ? Math.min(100, (amountPaid / ownershipThreshold) * 100)
      : 0;

  const amountToThreshold = Math.max(0, ownershipThreshold - amountPaid);

  const thresholdReached =
    ownershipThreshold > 0 && amountPaid >= ownershipThreshold;

  return (
    <DashboardShell title="Ownership Plan" email={user.email ?? ""}>
      <BackButton />

      <header className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">
            Aurora Ownership
          </p>

          <h1 className="mt-2 text-3xl font-bold sm:text-4xl">
            Your ownership plan
          </h1>

          <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
            Review the ownership terms Aurora prepared for your approved
            application.
          </p>
        </div>

        <Badge variant={statusVariant(plan.status)}>{config.label}</Badge>
      </header>

      {/* Vehicle / Financial Summary */}
      <section className="bg-card overflow-hidden rounded-3xl border">
        <div className="grid lg:grid-cols-[0.9fr_1.1fr]">
          <div className="aspect-[16/10] bg-muted lg:aspect-auto">
            {vehicle?.image_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={vehicle.image_url}
                alt={`${vehicle.brand} ${vehicle.model}`}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full min-h-64 items-center justify-center text-muted-foreground">
                <CarFront className="h-12 w-12" />
              </div>
            )}
          </div>

          <div className="p-6 sm:p-8">
            <p className="text-sm text-muted-foreground">Approved vehicle</p>

            <h2 className="mt-2 text-2xl font-bold">
              {vehicle
                ? `${vehicle.brand} ${vehicle.model}${
                    vehicle.trim ? ` ${vehicle.trim}` : ""
                  }`
                : "Vehicle unavailable"}
            </h2>

            <p className="mt-1 text-sm text-muted-foreground">
              {vehicle?.year ?? "—"} · Aurora Access Price{" "}
              {money(financingTerms?.vehicle_price ?? null, currency)}
            </p>

            <div className="mt-8 grid grid-cols-2 gap-5 sm:grid-cols-4">
              <div>
                <p className="text-sm text-muted-foreground">Down payment</p>
                <p className="mt-1 text-lg font-semibold">
                  {money(financingTerms?.down_payment ?? null, currency)}
                </p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground">Monthly</p>
                <p className="mt-1 text-lg font-semibold">
                  {money(financingTerms?.monthly_payment ?? null, currency)}
                </p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground">Term</p>
                <p className="mt-1 text-lg font-semibold">
                  {financingTerms?.term_months
                    ? `${financingTerms.term_months} mo.`
                    : "—"}
                </p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground">Total repayment</p>
                <p className="mt-1 text-lg font-semibold">
                  {money(
                    financingTerms?.total_financed_repayment ?? null,
                    currency,
                  )}
                </p>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-5 text-sm">
              <div>
                <p className="text-muted-foreground">First payment</p>

                <p className="mt-1 font-semibold">
                  {financingTerms?.first_payment_date ?? "—"}
                </p>
              </div>

              <div>
                <p className="text-muted-foreground">Frequency</p>

                <p className="mt-1 font-semibold capitalize">
                  {financingTerms?.payment_frequency ?? "monthly"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {financingTerms ? (
        <>
          {/* Aurora Ownership Journey */}
          <section className="via-card relative overflow-hidden rounded-3xl border border-primary/20 bg-gradient-to-br from-primary/10 to-accent/10 p-6 shadow-sm sm:p-8">
            <div
              className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-primary/10 blur-3xl"
              aria-hidden="true"
            />

            <div
              className="pointer-events-none absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-accent/10 blur-3xl"
              aria-hidden="true"
            />

            <div className="relative">
              <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-start">
                <div>
                  <div className="flex items-center gap-2">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/15 text-primary">
                      <Sparkles className="h-5 w-5" />
                    </div>

                    <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">
                      Aurora Ownership Journey
                    </p>
                  </div>

                  <h2 className="mt-4 text-2xl font-bold sm:text-3xl">
                    You&apos;re building toward ownership
                  </h2>

                  <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
                    Every completed payment moves you closer to your Aurora
                    ownership milestone. Your vehicle delivery threshold is
                    reached at 30% of your Aurora Access Price.
                  </p>
                </div>

                <div className="rounded-2xl border border-primary/20 bg-background/70 px-5 py-4 text-left backdrop-blur-sm sm:min-w-36 sm:text-right">
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Paid
                  </p>

                  <p className="mt-1 text-2xl font-bold text-primary">
                    {progressPercent.toFixed(1)}%
                  </p>

                  <p className="mt-1 text-xs text-muted-foreground">
                    of Aurora Access Price
                  </p>
                </div>
              </div>

              {/* Main Journey Gauge */}
              <div className="mt-10">
                <div className="flex items-end justify-between gap-4">
                  <div>
                    <p className="text-sm font-semibold">Ownership progress</p>

                    <p className="mt-1 text-sm text-muted-foreground">
                      {money(amountPaid, currency)} paid
                    </p>
                  </div>

                  <p className="text-sm font-semibold text-muted-foreground">
                    {money(auroraAccessPrice, currency)}
                  </p>
                </div>

                <div className="relative mt-4">
                  {/* Gauge track */}
                  <div className="h-7 overflow-hidden rounded-full border border-primary/15 bg-background/80 p-1 shadow-inner">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-primary via-primary/80 to-accent shadow-sm transition-all"
                      style={{
                        width: `${progressPercent}%`,
                      }}
                    />
                  </div>

                  {/* 30% threshold marker */}
                  <div
                    className="absolute top-1/2 z-10 -translate-x-1/2 -translate-y-1/2"
                    style={{ left: "30%" }}
                    aria-hidden="true"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-full border-4 border-background bg-foreground shadow-lg">
                      <div className="h-2.5 w-2.5 rounded-full bg-background" />
                    </div>
                  </div>
                </div>

                {/* Gauge labels */}
                <div className="relative mt-4 h-12 text-xs">
                  <div className="absolute left-0">
                    <p className="font-semibold text-foreground">0%</p>
                    <p className="mt-1 text-muted-foreground">Starting point</p>
                  </div>

                  <div
                    className="absolute -translate-x-1/2 text-center"
                    style={{ left: "30%" }}
                  >
                    <p className="font-bold text-primary">30%</p>
                    <p className="mt-1 whitespace-nowrap text-muted-foreground">
                      Ownership milestone
                    </p>
                  </div>

                  <div className="absolute right-0 text-right">
                    <p className="font-semibold text-foreground">100%</p>
                    <p className="mt-1 text-muted-foreground">Fully paid</p>
                  </div>
                </div>
              </div>

              {/* Progress Stats */}
              <div className="mt-8 grid gap-4 sm:grid-cols-3">
                <div className="rounded-2xl border border-primary/15 bg-background/60 p-5 backdrop-blur-sm">
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Aurora Access Price
                  </p>

                  <p className="mt-2 text-xl font-bold">
                    {money(auroraAccessPrice, currency)}
                  </p>
                </div>

                <div className="rounded-2xl border border-primary/15 bg-background/60 p-5 backdrop-blur-sm">
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    30% Threshold
                  </p>

                  <p className="mt-2 text-xl font-bold">
                    {money(ownershipThreshold, currency)}
                  </p>
                </div>

                <div className="rounded-2xl border border-primary/15 bg-background/60 p-5 backdrop-blur-sm">
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Completed Payments
                  </p>

                  <p className="mt-2 text-xl font-bold">
                    {money(amountPaid, currency)}
                  </p>
                </div>
              </div>

              {/* Milestone Message */}
              {thresholdReached ? (
                <div className="mt-6 overflow-hidden rounded-2xl border border-green-500/30 bg-green-500/10">
                  <div className="flex items-start gap-4 p-5">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-green-500/15">
                      <CheckCircle2 className="h-5 w-5 text-green-500" />
                    </div>

                    <div>
                      <p className="font-bold">
                        30% ownership milestone reached
                      </p>

                      <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                        You have reached the required{" "}
                        {money(ownershipThreshold, currency)} threshold. Your
                        vehicle has reached the Aurora ownership / delivery
                        milestone.
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="mt-6 flex flex-col justify-between gap-4 rounded-2xl border border-primary/15 bg-background/60 p-5 backdrop-blur-sm sm:flex-row sm:items-center">
                  <div>
                    <p className="font-semibold">
                      {money(amountToThreshold, currency)} to your ownership
                      milestone
                    </p>

                    <p className="mt-1 text-sm text-muted-foreground">
                      Keep building your completed payment balance toward the
                      30% Aurora threshold.
                    </p>
                  </div>

                  <div className="shrink-0 rounded-xl bg-primary/10 px-4 py-3 text-center">
                    <p className="text-xs font-semibold uppercase tracking-wider text-primary">
                      Progress to milestone
                    </p>

                    <p className="mt-1 text-lg font-bold text-primary">
                      {thresholdProgressPercent.toFixed(1)}%
                    </p>
                  </div>
                </div>
              )}
            </div>
          </section>

          {/* Existing Payment Schedule */}
          <section className="bg-card rounded-3xl border p-6 sm:p-8">
            <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">
                  Payment schedule
                </p>

                <h2 className="mt-2 text-xl font-semibold">
                  Your recorded payment history
                </h2>

                <p className="mt-2 text-sm text-muted-foreground">
                  Payments shown here are recorded by Aurora after an authorized
                  operator confirms receipt.
                </p>
              </div>

              <div className="text-sm">
                <span className="text-muted-foreground">
                  Financed balance remaining
                </span>

                <p className="mt-1 text-lg font-semibold">
                  {money(planView.remainingBalance, currency)}
                </p>
              </div>
            </div>

            <div className="mt-6 overflow-x-auto">
              <table className="w-full min-w-[620px] text-sm">
                <thead>
                  <tr className="border-b text-left text-muted-foreground">
                    <th className="pb-3 pr-4 font-medium">Installment</th>

                    <th className="pb-3 pr-4 font-medium">Due</th>

                    <th className="pb-3 pr-4 font-medium">Amount</th>

                    <th className="pb-3 pr-4 font-medium">Paid</th>

                    <th className="pb-3 font-medium">Status</th>
                  </tr>
                </thead>

                <tbody>
                  {paymentSchedule.map((item) => (
                    <tr key={item.id} className="border-b last:border-0">
                      <td className="py-3 pr-4">#{item.installment_number}</td>

                      <td className="py-3 pr-4">{item.due_date}</td>

                      <td className="py-3 pr-4">
                        {money(item.amount_due, currency)}
                      </td>

                      <td className="py-3 pr-4">
                        {money(item.amount_paid, currency)}
                      </td>

                      <td className="py-3 capitalize">
                        {item.status.replace("_", " ")}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {payments.length > 0 ? (
              <div className="mt-8">
                <h3 className="font-semibold">Confirmed payments</h3>

                <div className="mt-3 space-y-2">
                  {payments.map((payment) => (
                    <div
                      key={payment.id}
                      className="flex flex-col justify-between gap-1 rounded-2xl border p-4 sm:flex-row sm:items-center"
                    >
                      <div>
                        <p className="font-medium">
                          {payment.payment_type === "down_payment"
                            ? "Down payment"
                            : "Installment"}
                        </p>

                        <p className="text-xs text-muted-foreground">
                          {payment.transaction_reference || "No reference"} ·{" "}
                          {payment.payment_date
                            ? new Date(
                                payment.payment_date,
                              ).toLocaleDateString()
                            : "—"}
                        </p>
                      </div>

                      <p className="font-semibold">
                        {money(payment.amount, currency)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}
          </section>
        </>
      ) : null}

      <section className="grid gap-6 lg:grid-cols-[1fr_0.7fr]">
        <div className="bg-card rounded-3xl border p-6 sm:p-8">
          <div className="flex items-center gap-3">
            <ShieldCheck className="h-6 w-6 text-primary" />

            <h2 className="text-xl font-semibold">What happens next</h2>
          </div>

          <p className="mt-3 leading-relaxed text-muted-foreground">
            {config.description}
          </p>

          {canRespond ? (
            <div className="mt-6">
              <OwnershipPlanActions planId={plan.id} />
            </div>
          ) : null}

          <Button asChild variant="outline" className="mt-6">
            <Link href={`/messages?ownershipPlan=${plan.id}`}>
              Message Aurora about this plan
              <ArrowLeft className="ml-2 h-4 w-4 rotate-180" />
            </Link>
          </Button>

          {plan.status === "accepted" ? (
            <div className="mt-6 rounded-2xl border bg-muted/40 p-4 text-sm">
              <div className="flex items-center gap-2 font-semibold">
                <CheckCircle2 className="h-5 w-5 text-green-500" />
                Plan accepted
              </div>

              <p className="mt-1 text-muted-foreground">
                Aurora can now move your ownership journey into its next trusted
                step.
              </p>
            </div>
          ) : null}
        </div>

        <aside className="rounded-3xl border bg-muted/30 p-6 sm:p-8">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">
            Important
          </p>

          <h2 className="mt-2 text-xl font-semibold">
            Review before proceeding
          </h2>

          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            This plan summarizes the terms Aurora has prepared. No payment is
            requested by this screen. Financial transactions will be handled
            through a separate, trusted payment workflow.
          </p>
        </aside>
      </section>
    </DashboardShell>
  );
}
