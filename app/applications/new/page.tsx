import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  BatteryCharging,
  ClipboardCheck,
  FileCheck2,
  ShieldCheck,
  Sparkles,
  WalletCards,
} from "lucide-react";

import { createClient } from "@/lib/supabase/server";
import { getVehicle } from "@/features/vehicles/lib/get-vehicle";
import { ApplicationForm } from "@/components/applications/application-form";
import { getAuroraPricing } from "@/lib/vehicles/aurora-pricing";

type Props = {
  searchParams: Promise<{
    vehicle?: string;
    down_payment_percent?: string;
    term_months?: string;
  }>;
};

function money(value: number | null) {
  if (value == null) return "Price unavailable";

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

export default async function NewApplicationPage({ searchParams }: Props) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const params = await searchParams;

  const vehicleId = params.vehicle;

  if (!vehicleId) {
    notFound();
  }

  const vehicle = await getVehicle(vehicleId);

  if (!vehicle) {
    notFound();
  }

  /*
   * ============================================================
   * CUSTOMER CALCULATOR PREFERENCES
   * ============================================================
   *
   * These values come from the calculator on the vehicle page.
   *
   * They are customer-requested preferences only.
   * They are NOT approved financing or ownership terms.
   */

  const requestedDownPaymentPercent = Number(params.down_payment_percent ?? 10);

  const requestedTermMonths = Number(params.term_months ?? 48);

  const downPaymentPercent = Number.isFinite(requestedDownPaymentPercent)
    ? Math.min(Math.max(requestedDownPaymentPercent, 10), 100)
    : 10;

  const termMonths = Number.isFinite(requestedTermMonths)
    ? Math.min(Math.max(requestedTermMonths, 1), 48)
    : 24;

  /*
   * ============================================================
   * AURORA ACCESS PRICE
   * ============================================================
   *
   * vehicles.price remains the authoritative market/reference price.
   *
   * The customer-facing ownership calculation uses the deterministic
   * Aurora Access Price derived from that market price.
   */

  const pricing = getAuroraPricing(vehicle.price, vehicle.id);

  const marketPrice = pricing.marketPrice ?? 0;
  const vehiclePrice = pricing.auroraAccessPrice ?? 0;

  /*
   * ============================================================
   * CUSTOMER ESTIMATE
   * ============================================================
   */

  const requestedDownPayment = vehiclePrice * (downPaymentPercent / 100);

  const requestedRemainingBalance = Math.max(
    vehiclePrice - requestedDownPayment,
    0,
  );

  const requestedMonthlyPayment =
    termMonths > 0
      ? requestedRemainingBalance / termMonths
      : requestedRemainingBalance;

  const requestedTotalPaid =
    requestedDownPayment + requestedMonthlyPayment * termMonths;

  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Back */}
        <Link
          href={`/vehicles/${vehicle.id}`}
          className="inline-flex items-center gap-2 text-sm text-muted-foreground transition hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to vehicle
        </Link>

        {/* Header */}
        <header className="mt-8 max-w-3xl">
          <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.18em] text-primary">
            <Sparkles className="h-4 w-4" />
            Aurora Ownership
          </div>

          <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
                Begin your ownership journey.
              </h1>

              <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted-foreground">
                Tell Aurora which vehicle you want to pursue. We&apos;ll review
                your application and, if approved, prepare an ownership plan
                with terms specific to you and the vehicle.
              </p>
            </div>

            <div className="bg-card shrink-0 rounded-full border px-4 py-2 text-sm font-medium">
              Step 1 of 4
            </div>
          </div>
        </header>

        {/* Progress */}
        <div className="mt-8 grid grid-cols-4 gap-2">
          <div className="h-1.5 rounded-full bg-primary" />
          <div className="h-1.5 rounded-full bg-muted" />
          <div className="h-1.5 rounded-full bg-muted" />
          <div className="h-1.5 rounded-full bg-muted" />
        </div>

        {/* Vehicle + summary */}
        <section className="bg-card mt-10 overflow-hidden rounded-[2rem] border shadow-sm">
          <div className="grid lg:grid-cols-[1.1fr_0.9fr]">
            {/* Vehicle image */}
            <div className="relative min-h-[320px] bg-muted">
              {vehicle.image_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={vehicle.image_url}
                  alt={`${vehicle.brand} ${vehicle.model}`}
                  className="absolute inset-0 h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full min-h-[320px] items-center justify-center">
                  <BatteryCharging className="h-16 w-16 text-muted-foreground/40" />
                </div>
              )}

              <div className="absolute left-5 top-5 rounded-full border border-white/20 bg-black/60 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-white backdrop-blur">
                Selected vehicle
              </div>
            </div>

            {/* Vehicle details */}
            <div className="p-6 sm:p-8 lg:p-10">
              <p className="text-sm font-medium text-muted-foreground">
                Your selected vehicle
              </p>
              <h2 className="mt-2 text-3xl font-bold tracking-tight">
                {vehicle.brand} {vehicle.model}
              </h2>
              {vehicle.trim ? (
                <p className="mt-1 text-base text-muted-foreground">
                  {vehicle.trim}
                </p>
              ) : null}
              className="mt-8 rounded-2xl border bg-muted/30 p-5"{">"}
              <p className="text-sm text-muted-foreground">Vehicle price</p>
              <div className="mt-6 flex items-start gap-3">
                <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-primary" />

                <p className="text-sm leading-relaxed text-muted-foreground">
                  Your application starts a review process. Submitting it does
                  not mean you are purchasing the vehicle or accepting financing
                  terms.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Requested ownership summary */}
        <section className="bg-card mt-10 overflow-hidden rounded-[2rem] border shadow-sm">
          <div className="border-b p-6 sm:p-8">
            <div className="flex items-start gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <WalletCards className="h-5 w-5" />
              </div>

              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">
                  Your ownership estimate
                </p>

                <h2 className="mt-1 text-2xl font-bold">
                  Calculator preferences
                </h2>

                <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
                  These values were selected on the vehicle page and are being
                  carried into your application. You can review them here before
                  submitting.
                </p>
              </div>
            </div>
          </div>

          <div className="grid gap-4 p-6 sm:grid-cols-2 sm:p-8 lg:grid-cols-4">
            {/* Vehicle price */}
            <div className="rounded-2xl border bg-muted/20 p-5">
              <p className="text-sm text-muted-foreground">
                Aurora Access Price
              </p>

              <p className="mt-1 text-2xl font-bold">{money(vehiclePrice)}</p>
            </div>

            {/* Down payment */}
            <div className="rounded-2xl border bg-muted/20 p-5">
              <p className="text-sm text-muted-foreground">Down payment</p>

              <p className="mt-1 text-2xl font-bold">
                {money(requestedDownPayment)}
              </p>

              <p className="mt-1 text-xs text-muted-foreground">
                {downPaymentPercent}% of Aurora Access Price
              </p>
            </div>

            {/* Remaining balance */}
            <div className="rounded-2xl border bg-muted/20 p-5">
              <p className="text-sm text-muted-foreground">Remaining balance</p>

              <p className="mt-1 text-2xl font-bold">
                {money(requestedRemainingBalance)}
              </p>

              <p className="mt-1 text-xs text-muted-foreground">
                After down payment
              </p>
            </div>

            {/* Monthly */}
            <div className="rounded-2xl border bg-muted/20 p-5">
              <p className="text-sm text-muted-foreground">
                Monthly contribution
              </p>

              <p className="mt-1 text-2xl font-bold text-primary">
                {money(requestedMonthlyPayment)}
              </p>

              <p className="mt-1 text-xs text-muted-foreground">
                Over {termMonths} months
              </p>
            </div>
          </div>

          {/* Duration + total */}
          <div className="border-t bg-muted/10 px-6 py-5 sm:px-8">
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <p className="text-sm text-muted-foreground">
                  Ownership duration
                </p>

                <p className="mt-1 text-xl font-bold">{termMonths} months</p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground">Estimated total</p>

                <p className="mt-1 text-xl font-bold">
                  {money(requestedTotalPaid)}
                </p>
              </div>
            </div>

            <div className="bg-card mt-5 flex items-start gap-3 rounded-2xl border p-4">
              <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-primary" />

              <p className="text-xs leading-relaxed text-muted-foreground">
                This is a simple ownership estimate based on the vehicle price,
                your selected down payment, and your selected duration. It is
                not an approved financing offer. Aurora will determine final
                terms during application review.
              </p>
            </div>
          </div>
        </section>

        {/* Application form */}
        <section className="bg-card mt-10 overflow-hidden rounded-[2rem] border shadow-sm">
          <div className="border-b p-6 sm:p-8">
            <div className="flex items-start gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <ClipboardCheck className="h-5 w-5" />
              </div>

              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">
                  Application
                </p>

                <h2 className="mt-1 text-2xl font-bold">
                  Continue with your application
                </h2>

                <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
                  Submit your application with the ownership preferences shown
                  above. Aurora will review your application before any final
                  ownership or financing terms are established.
                </p>
              </div>
            </div>
          </div>

          <div className="p-6 sm:p-8">
            <ApplicationForm
              vehicleId={vehicle.id}
              vehiclePrice={vehiclePrice}
              downPaymentPercent={downPaymentPercent}
              downPayment={requestedDownPayment}
              remainingBalance={requestedRemainingBalance}
              monthlyPayment={requestedMonthlyPayment}
              termMonths={termMonths}
              totalPaid={requestedTotalPaid}
            />
          </div>
        </section>

        {/* What happens */}
        <section className="mt-10">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">
              Your ownership path
            </p>

            <h2 className="mt-2 text-2xl font-bold sm:text-3xl">
              What happens after you apply?
            </h2>

            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              Aurora keeps each stage visible so you always know where you are
              in the journey.
            </p>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {/* 01 */}
            <div className="bg-card rounded-2xl border p-5">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <ClipboardCheck className="h-5 w-5" />
              </div>

              <p className="mt-5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                01
              </p>

              <h3 className="mt-1 font-semibold">Application review</h3>

              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                Aurora reviews your vehicle application and the information
                associated with your profile.
              </p>
            </div>

            {/* 02 */}
            <div className="bg-card rounded-2xl border p-5">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <ShieldCheck className="h-5 w-5" />
              </div>

              <p className="mt-5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                02
              </p>

              <h3 className="mt-1 font-semibold">Verification</h3>

              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                Complete the required profile and identity information so Aurora
                can move your application forward.
              </p>
            </div>

            {/* 03 */}
            <div className="bg-card rounded-2xl border p-5">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <FileCheck2 className="h-5 w-5" />
              </div>

              <p className="mt-5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                03
              </p>

              <h3 className="mt-1 font-semibold">Ownership plan</h3>

              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                If approved, Aurora prepares the ownership and financing terms
                for your selected vehicle.
              </p>
            </div>

            {/* 04 */}
            <div className="bg-card rounded-2xl border p-5">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <WalletCards className="h-5 w-5" />
              </div>

              <p className="mt-5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                04
              </p>

              <h3 className="mt-1 font-semibold">Finalize ownership</h3>

              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                Once the ownership plan is ready, Aurora will guide you through
                the remaining steps.
              </p>
            </div>
          </div>
        </section>

        {/* Footer navigation */}
        <div className="mt-10 flex flex-col gap-3 border-t pt-8 sm:flex-row sm:items-center sm:justify-between">
          <Link
            href={`/vehicles/${vehicle.id}`}
            className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to vehicle
          </Link>

          <div className="inline-flex items-center gap-2 text-sm text-muted-foreground">
            Application review
            <ArrowRight className="h-4 w-4" />
          </div>
        </div>
      </div>
    </main>
  );
}
