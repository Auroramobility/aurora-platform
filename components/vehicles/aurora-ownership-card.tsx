"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, Calculator, CheckCircle2 } from "lucide-react";

import { getAuroraPricing } from "@/lib/vehicles/aurora-pricing";

type Props = {
  price: number;
  vehicleId: string;
};

function money(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

export function AuroraOwnershipCard({ price, vehicleId }: Props) {
  const [downPaymentPercent, setDownPaymentPercent] = useState(20);
  const [termMonths, setTermMonths] = useState(24);

  const pricing = useMemo(
    () => getAuroraPricing(price, vehicleId),
    [price, vehicleId],
  );

  const calculation = useMemo(() => {
    const vehiclePrice = Number.isFinite(pricing.auroraAccessPrice ?? NaN)
      ? Math.max(pricing.auroraAccessPrice ?? 0, 0)
      : 0;

    const downPayment = vehiclePrice * (downPaymentPercent / 100);

    const remainingBalance = Math.max(vehiclePrice - downPayment, 0);

    const monthlyPayment =
      termMonths > 0 ? remainingBalance / termMonths : remainingBalance;

    const totalPaid = downPayment + monthlyPayment * termMonths;

    return {
      marketPrice: pricing.marketPrice ?? 0,
      vehiclePrice,
      downPayment,
      remainingBalance,
      monthlyPayment,
      totalPaid,
    };
  }, [
    pricing.auroraAccessPrice,
    pricing.marketPrice,
    downPaymentPercent,
    termMonths,
  ]);

  const continueHref =
    `/applications/new?vehicle=${encodeURIComponent(vehicleId)}` +
    `&down_payment_percent=${downPaymentPercent}` +
    `&term_months=${termMonths}`;

  return (
    <div className="bg-card overflow-hidden rounded-[2rem] border shadow-sm">
      {/* Header */}
      <div className="border-b p-6 sm:p-8">
        <div className="flex items-start gap-4">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Calculator className="h-5 w-5" />
          </div>

          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">
              Aurora Ownership Calculator
            </p>

            <h2 className="mt-1 text-2xl font-bold">
              Explore your ownership estimate
            </h2>

            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
              Choose how much you want to contribute and how long you want to
              take to complete your ownership plan.
            </p>
          </div>
        </div>
      </div>

      {/* Pricing summary */}
      <div className="grid gap-4 border-b p-6 sm:grid-cols-3 sm:p-8">
        <div>
          <p className="text-xs uppercase tracking-wide text-muted-foreground">
            Market Price
          </p>

          <p className="mt-1 text-lg font-medium text-muted-foreground line-through">
            {money(calculation.marketPrice)}
          </p>
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-primary">
            Aurora Access Price
          </p>

          <p className="mt-1 text-2xl font-bold">
            {money(calculation.vehiclePrice)}
          </p>
        </div>

        {pricing.discountPercent != null ? (
          <div className="flex items-center sm:justify-end">
            <span className="rounded-full bg-primary px-3 py-1.5 text-sm font-bold text-primary-foreground">
              Save {pricing.discountPercent}%
            </span>
          </div>
        ) : null}
      </div>

      {/* Controls */}
      <div className="grid gap-8 p-6 sm:grid-cols-2 sm:p-8">
        {/* Contribution */}
        <div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold">Your contribution</p>

              <p className="mt-1 text-xs text-muted-foreground">
                Choose from 0% to 100%.
              </p>
            </div>

            <span className="rounded-full border bg-muted/30 px-3 py-1 text-sm font-semibold">
              {downPaymentPercent}%
            </span>
          </div>

          <input
            type="range"
            min={0}
            max={100}
            step={10}
            value={downPaymentPercent}
            onChange={(event) =>
              setDownPaymentPercent(Number(event.target.value))
            }
            className="mt-6 w-full accent-primary"
            aria-label="Contribution percentage"
          />

          <div className="mt-2 flex justify-between text-xs text-muted-foreground">
            <span>0%</span>
            <span>100%</span>
          </div>
        </div>

        {/* Ownership duration */}
        <div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold">Ownership duration</p>

              <p className="mt-1 text-xs text-muted-foreground">
                Choose between 1 and 48 months.
              </p>
            </div>

            <span className="rounded-full border bg-muted/30 px-3 py-1 text-sm font-semibold">
              {termMonths} months
            </span>
          </div>

          <input
            type="range"
            min={1}
            max={48}
            step={1}
            value={termMonths}
            onChange={(event) => setTermMonths(Number(event.target.value))}
            className="mt-6 w-full accent-primary"
            aria-label="Ownership duration in months"
          />

          <div className="mt-2 flex justify-between text-xs text-muted-foreground">
            <span>1 month</span>
            <span>48 months</span>
          </div>
        </div>
      </div>

      {/* Estimate */}
      <div className="border-t bg-muted/10 p-6 sm:p-8">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="bg-card rounded-2xl border p-5">
            <p className="text-xs text-muted-foreground">Aurora Access Price</p>

            <p className="mt-1 text-xl font-bold">
              {money(calculation.vehiclePrice)}
            </p>
          </div>

          <div className="bg-card rounded-2xl border p-5">
            <p className="text-xs text-muted-foreground">Your contribution</p>

            <p className="mt-1 text-xl font-bold">
              {money(calculation.downPayment)}
            </p>

            <p className="mt-1 text-xs text-muted-foreground">
              {downPaymentPercent}% of Aurora Access Price
            </p>
          </div>

          <div className="bg-card rounded-2xl border p-5">
            <p className="text-xs text-muted-foreground">Remaining balance</p>

            <p className="mt-1 text-xl font-bold">
              {money(calculation.remainingBalance)}
            </p>
          </div>

          <div className="bg-card rounded-2xl border p-5">
            <p className="text-xs text-muted-foreground">Estimated monthly</p>

            <p className="mt-1 text-xl font-bold text-primary">
              {money(calculation.monthlyPayment)}
            </p>

            <p className="mt-1 text-xs text-muted-foreground">
              {termMonths} months
            </p>
          </div>

          <div className="bg-card rounded-2xl border p-5">
            <p className="text-xs text-muted-foreground">Estimated total</p>

            <p className="mt-1 text-xl font-bold">
              {money(calculation.totalPaid)}
            </p>
          </div>
        </div>

        <div className="bg-card mt-6 flex items-start gap-3 rounded-2xl border p-4">
          <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-primary" />

          <p className="text-xs leading-relaxed text-muted-foreground">
            Your estimate is based on the Aurora Access Price and the
            contribution and duration you select. Reaching the required
            ownership threshold may be necessary before vehicle delivery. Final
            ownership terms are determined by Aurora after review.
          </p>
        </div>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs leading-relaxed text-muted-foreground">
            Continue with these preferences when you apply.
          </p>

          <Link
            href={continueHref}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-bold text-primary-foreground transition hover:opacity-90"
          >
            Continue
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
