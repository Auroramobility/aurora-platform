"use client";

import { useActionState } from "react";
import { ArrowRight, CheckCircle2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  createApplication,
  type CreateApplicationState,
} from "@/features/applications/actions/create-application";

const initialState: CreateApplicationState = {};

type Props = {
  vehicleId: string;
  vehiclePrice: number;
  downPaymentPercent: number;
  downPayment: number;
  remainingBalance: number;
  monthlyPayment: number;
  termMonths: number;
  totalPaid: number;
};

function money(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

export function ApplicationForm({
  vehicleId,
  vehiclePrice,
  downPaymentPercent,
  downPayment,
  remainingBalance,
  monthlyPayment,
  termMonths,
  totalPaid,
}: Props) {
  const [state, formAction, pending] = useActionState(
    createApplication,
    initialState,
  );

  return (
    <form
      action={formAction}
      className="bg-card overflow-hidden rounded-[2rem] border shadow-sm"
    >
      {/* ============================================================
          APPLICATION IDENTIFIER
          ============================================================ */}

      <input type="hidden" name="vehicle_id" value={vehicleId} />

      {/* ============================================================
          CUSTOMER CALCULATOR PREFERENCES
          
          The server treats these as customer-requested preferences.
          It does NOT trust the calculated monetary values from the
          browser.
          ============================================================ */}

      <input
        type="hidden"
        name="down_payment_percent"
        value={downPaymentPercent}
      />

      <input type="hidden" name="term_months" value={termMonths} />

      <div className="p-6 sm:p-8">
        {/* Header */}
        <div className="flex items-start gap-4">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <CheckCircle2 className="h-5 w-5" />
          </div>

          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-primary">
              Ready to begin?
            </p>

            <h2 className="mt-1 text-2xl font-bold">
              Submit your ownership application
            </h2>

            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
              By submitting, you&apos;re asking Aurora to review your
              application and the ownership configuration you selected. You are
              not accepting financing terms or making a payment at this stage.
            </p>
          </div>
        </div>

        {/* ============================================================
            CUSTOMER REQUEST SUMMARY
            ============================================================ */}

        <div className="mt-6 rounded-2xl border bg-muted/20 p-5">
          <p className="text-sm font-semibold">
            Your requested ownership configuration
          </p>

          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <p className="text-xs text-muted-foreground">Vehicle price</p>

              <p className="mt-1 font-semibold">{money(vehiclePrice)}</p>
            </div>

            <div>
              <p className="text-xs text-muted-foreground">Down payment</p>

              <p className="mt-1 font-semibold">
                {downPaymentPercent}% · {money(downPayment)}
              </p>
            </div>

            <div>
              <p className="text-xs text-muted-foreground">Estimated monthly</p>

              <p className="mt-1 font-semibold">{money(monthlyPayment)}</p>
            </div>

            <div>
              <p className="text-xs text-muted-foreground">Duration</p>

              <p className="mt-1 font-semibold">{termMonths} months</p>
            </div>
          </div>

          <div className="mt-4 grid gap-4 border-t pt-4 sm:grid-cols-2">
            <div>
              <p className="text-xs text-muted-foreground">Remaining balance</p>

              <p className="mt-1 font-semibold">{money(remainingBalance)}</p>
            </div>

            <div>
              <p className="text-xs text-muted-foreground">Estimated total</p>

              <p className="mt-1 font-semibold">{money(totalPaid)}</p>
            </div>
          </div>

          <p className="mt-4 text-xs leading-relaxed text-muted-foreground">
            These are the values you entered or calculated. They represent your
            requested ownership preferences only. Aurora will review the
            application and determine the final approved ownership and financing
            terms.
          </p>
        </div>

        {/* Disclaimer */}
        <div className="bg-card mt-6 rounded-2xl border p-4">
          <p className="text-xs leading-relaxed text-muted-foreground">
            Submitting this application does not create a financing agreement,
            guarantee approval, confirm a payment, or establish final ownership
            terms.
          </p>
        </div>

        {/* Error */}
        {state.error ? (
          <p
            role="alert"
            className="mt-6 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-300"
          >
            {state.error}
          </p>
        ) : null}
      </div>

      {/* Footer */}
      <div className="flex flex-col gap-4 border-t bg-muted/20 p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
        <div>
          <p className="text-sm font-medium">Application review</p>

          <p className="mt-1 text-xs text-muted-foreground">
            Aurora will review your vehicle and requested ownership
            configuration before approval.
          </p>
        </div>

        <Button
          type="submit"
          size="lg"
          disabled={pending}
          className="w-full sm:w-auto"
        >
          {pending ? "Submitting…" : "Submit application"}

          {!pending ? <ArrowRight className="h-4 w-4" /> : null}
        </Button>
      </div>
    </form>
  );
}
