import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, CarFront, CheckCircle2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { createClient } from "@/lib/supabase/server";
import { ApplicationStatusTimeline } from "@/components/applications/application-status-timeline";
import { getApplicationDetail } from "@/features/applications/lib/get-application-detail";
import {
  getApplicationNextAction,
  getApplicationStatusConfig,
} from "@/features/applications/types/status";

function statusVariant(status: string) {
  if (status === "approved") return "success" as const;
  if (status === "reviewing") return "warning" as const;
  if (status === "rejected" || status === "cancelled") {
    return "danger" as const;
  }

  return "default" as const;
}

function money(value: number | null | undefined) {
  return value == null ? "—" : `$${Number(value).toLocaleString()}`;
}

function moneyPrecise(value: number | null | undefined) {
  return value == null
    ? "—"
    : `$${Number(value).toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`;
}

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export default async function ApplicationDetailPage({ params }: Props) {
  const { id } = await params;

  const detail = await getApplicationDetail(id);

  if (!detail) {
    notFound();
  }

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { application, profile, vehicle, financingRequest, ownershipPlan } =
    detail;

  /*
   * ============================================================
   * APPLICATION READINESS
   * ============================================================
   */

  const profileComplete = Boolean(profile);

  const identityVerified = profile?.identity_verified === true;

  /*
   * ============================================================
   * NEXT ACTION
   * ============================================================
   */

  const nextAction = getApplicationNextAction({
    status: application.status,
    profileComplete,
    identityVerified,
    hasOwnershipPlan: Boolean(ownershipPlan),
    ownershipPlanId: ownershipPlan?.id,
    ownershipPlanStatus: ownershipPlan?.status,
  });

  const statusConfig = getApplicationStatusConfig(application.status);

  return (
    <DashboardShell
      title="Application"
      email={user?.email ?? ""}
      backHref="/applications"
      backLabel="My Applications"
    >
      {/* ======================================================
          HEADER
      ======================================================= */}

      <header className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">
            Aurora Ownership
          </p>

          <h1 className="mt-2 text-3xl font-bold sm:text-4xl">
            Application details
          </h1>

          <p className="mt-2 text-sm text-muted-foreground">
            Application ID: {application.id}
          </p>
        </div>

        <Badge variant={statusVariant(application.status)}>
          {statusConfig.label}
        </Badge>
      </header>

      {/* ======================================================
          VEHICLE + NEXT STEP
      ======================================================= */}

      <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
        {/* Vehicle */}

        <section className="bg-card overflow-hidden rounded-3xl border">
          <div className="aspect-[16/8] bg-muted">
            {vehicle?.image_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={vehicle.image_url}
                alt={`${vehicle.brand} ${vehicle.model}`}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full items-center justify-center text-muted-foreground">
                <CarFront className="h-12 w-12" />
              </div>
            )}
          </div>

          <div className="p-6 sm:p-8">
            <p className="text-sm text-muted-foreground">Selected vehicle</p>

            <h2 className="mt-2 text-2xl font-bold">
              {vehicle
                ? `${vehicle.brand} ${vehicle.model}${
                    vehicle.trim ? ` ${vehicle.trim}` : ""
                  }`
                : "Vehicle unavailable"}
            </h2>

            <div className="mt-5 grid grid-cols-2 gap-4 text-sm sm:grid-cols-4">
              <div>
                <p className="text-muted-foreground">Year</p>

                <p className="mt-1 font-semibold">{vehicle?.year ?? "—"}</p>
              </div>

              <div>
                <p className="text-muted-foreground">Range</p>

                <p className="mt-1 font-semibold">
                  {vehicle?.range_miles ? `${vehicle.range_miles} mi` : "—"}
                </p>
              </div>

              <div>
                <p className="text-muted-foreground">Price</p>

                <p className="mt-1 font-semibold">
                  {money(vehicle?.price ?? null)}
                </p>
              </div>

              <div>
                <p className="text-muted-foreground">Applied</p>

                <p className="mt-1 font-semibold">
                  {application.application_date
                    ? new Date(
                        application.application_date,
                      ).toLocaleDateString()
                    : "—"}
                </p>
              </div>
            </div>

            {vehicle ? (
              <Button asChild variant="outline" className="mt-6">
                <Link href={`/vehicles/${vehicle.id}`}>
                  View vehicle
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            ) : null}
          </div>
        </section>

        {/* Next Step */}

        <section className="bg-card rounded-3xl border p-6 sm:p-8">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">
            Next step
          </p>

          <h2 className="mt-2 text-2xl font-bold">{nextAction.title}</h2>

          <p className="mt-3 leading-relaxed text-muted-foreground">
            {nextAction.description}
          </p>

          {nextAction.actionLabel !== "Message Aurora" &&
          nextAction.href &&
          nextAction.actionLabel ? (
            <Button asChild className="mt-6">
              <Link href={nextAction.href}>
                {nextAction.actionLabel}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          ) : null}

          {application.status === "approved" && ownershipPlan ? (
            <div className="mt-6 rounded-2xl border bg-muted/40 p-4">
              <div className="flex items-center gap-2 font-semibold">
                <CheckCircle2 className="h-5 w-5 text-green-500" />
                Ownership plan
              </div>

              <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Down payment</p>

                  <p className="mt-1 font-semibold">
                    {money(ownershipPlan.financing?.down_payment ?? null)}
                  </p>
                </div>

                <div>
                  <p className="text-muted-foreground">Monthly</p>

                  <p className="mt-1 font-semibold">
                    {money(ownershipPlan.financing?.monthly_payment ?? null)}
                  </p>
                </div>

                <div>
                  <p className="text-muted-foreground">Term</p>

                  <p className="mt-1 font-semibold">
                    {ownershipPlan.financing?.term_months
                      ? `${ownershipPlan.financing.term_months} months`
                      : "—"}
                  </p>
                </div>

                <div>
                  <p className="text-muted-foreground">Total repayment</p>

                  <p className="mt-1 font-semibold">
                    {money(ownershipPlan.financing?.contract_amount ?? null)}
                  </p>
                </div>

                <div>
                  <p className="text-muted-foreground">First payment</p>

                  <p className="mt-1 font-semibold">
                    {ownershipPlan.financing?.first_payment_date ?? "—"}
                  </p>
                </div>
              </div>

              <Button asChild className="mt-5">
                <Link href={`/ownership/${ownershipPlan.id}`}>
                  View ownership plan
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          ) : null}

          <div className="mt-6 rounded-2xl border bg-muted/30 p-4">
            <p className="text-sm font-semibold">
              Current status: {statusConfig.label}
            </p>

            <p className="mt-1 text-sm text-muted-foreground">
              {statusConfig.description}
            </p>
          </div>
        </section>
      </div>

      {/* ======================================================
          CUSTOMER FINANCING REQUEST
      ======================================================= */}

      <section className="bg-card rounded-3xl border p-6 sm:p-8">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">
            Ownership preferences
          </p>

          <h2 className="mt-2 text-2xl font-bold">Your financing request</h2>

          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
            These figures are the estimates you submitted with your application.
            They are not financing approval or final ownership terms.
          </p>
        </div>

        {!financingRequest ? (
          <div className="mt-6 rounded-2xl border bg-muted/30 p-5">
            <p className="font-medium">No financing request found.</p>

            <p className="mt-1 text-sm text-muted-foreground">
              Your application does not currently have saved ownership
              preferences.
            </p>
          </div>
        ) : (
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-2xl border p-5">
              <p className="text-sm text-muted-foreground">Vehicle price</p>

              <p className="mt-2 text-xl font-semibold">
                {money(financingRequest.vehicle_price)}
              </p>
            </div>

            <div className="rounded-2xl border p-5">
              <p className="text-sm text-muted-foreground">Down payment</p>

              <p className="mt-2 text-xl font-semibold">
                {money(financingRequest.requested_down_payment)}
              </p>

              <p className="mt-1 text-sm text-muted-foreground">
                {financingRequest.down_payment_percent}%
              </p>
            </div>

            <div className="rounded-2xl border p-5">
              <p className="text-sm text-muted-foreground">Amount financed</p>

              <p className="mt-2 text-xl font-semibold">
                {money(financingRequest.requested_amount_financed)}
              </p>
            </div>

            <div className="rounded-2xl border p-5">
              <p className="text-sm text-muted-foreground">
                Ownership duration
              </p>

              <p className="mt-2 text-xl font-semibold">
                {financingRequest.requested_term_months} months
              </p>
            </div>

            <div className="rounded-2xl border p-5">
              <p className="text-sm text-muted-foreground">
                Estimated monthly payment
              </p>

              <p className="mt-2 text-xl font-semibold">
                {moneyPrecise(financingRequest.estimated_monthly_payment)}
              </p>
            </div>

            <div className="rounded-2xl border p-5">
              <p className="text-sm text-muted-foreground">
                Estimated total paid
              </p>

              <p className="mt-2 text-xl font-semibold">
                {moneyPrecise(financingRequest.estimated_total_paid)}
              </p>
            </div>
          </div>
        )}

        {financingRequest?.created_at ? (
          <p className="mt-5 text-xs text-muted-foreground">
            Submitted {new Date(financingRequest.created_at).toLocaleString()}
          </p>
        ) : null}
      </section>

      {/* ======================================================
          APPLICATION TIMELINE
      ======================================================= */}
      <ApplicationStatusTimeline
        applicationId={application.id}
        status={application.status}
        submittedAt={application.application_date}
        approvedAt={application.approved_date}
      />

      {/* ======================================================
          MESSAGES
      ======================================================= */}

      <div className="flex justify-center pb-8">
        <Button asChild variant="outline">
          <Link href={`/messages?application=${application.id}`}>
            Message Aurora
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>
    </DashboardShell>
  );
}
