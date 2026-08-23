"use client";

import { useActionState, useMemo } from "react";

import { Button } from "@/components/ui/button";

import {
  reviewApplication,
  type ReviewApplicationState,
} from "@/features/admin/actions/review-application";

import {
  deleteApplication,
  type DeleteApplicationState,
} from "@/features/admin/actions/delete-application";

import {
  reviewIdentity,
  type ReviewIdentityState,
} from "@/features/admin/actions/review-identity";

import {
  createOwnershipPlan,
  type OwnershipPlanState,
} from "@/features/admin/actions/create-ownership-plan";

import {
  prepareOwnershipPlan,
  type PreparePlanState,
} from "@/features/admin/actions/prepare-ownership-plan";

import {
  activateOwnershipPlan,
  type ActivatePlanState,
} from "@/features/admin/actions/activate-ownership-plan";

import {
  recordManualPayment,
  type RecordManualPaymentState,
} from "@/features/admin/actions/record-manual-payment";

import { getAuroraPricing } from "@/lib/vehicles/aurora-pricing";

const emptyReview: ReviewApplicationState = {};
const emptyIdentity: ReviewIdentityState = {};
const emptyPlan: OwnershipPlanState = {};
const emptyPrepare: PreparePlanState = {};
const emptyActivate: ActivatePlanState = {};
const emptyPayment: RecordManualPaymentState = {};
const emptyDeleteApplication: DeleteApplicationState = {};

export function ApplicationReviewForm({
  applicationId,
  status,
}: {
  applicationId: string;
  status: string | null;
}) {
  const [state, action, pending] = useActionState(
    reviewApplication,
    emptyReview,
  );

  if (
    status === "rejected" ||
    status === "cancelled" ||
    status === "approved"
  ) {
    return null;
  }

  return (
    <form
      action={action}
      className="mt-4 space-y-3 rounded-2xl border border-border bg-background/40 p-4"
    >
      {state.error ? (
        <p className="text-sm text-red-600 dark:text-red-400">{state.error}</p>
      ) : null}

      {state.success ? (
        <p className="text-sm text-primary">{state.success}</p>
      ) : null}

      <input type="hidden" name="application_id" value={applicationId} />

      <div className="flex flex-wrap gap-2">
        {status === "pending" ? (
          <Button
            name="decision"
            value="reviewing"
            size="sm"
            variant="secondary"
            disabled={pending}
          >
            Start review
          </Button>
        ) : null}

        <Button name="decision" value="approved" size="sm" disabled={pending}>
          Approve
        </Button>

        <Button
          name="decision"
          value="rejected"
          size="sm"
          variant="outline"
          disabled={pending}
        >
          Reject
        </Button>
      </div>

      <input
        name="rejection_reason"
        placeholder="Required when rejecting"
        className="h-10 w-full rounded-xl border border-input bg-background px-3 text-sm"
      />
    </form>
  );
}

export function DeleteApplicationForm({
  applicationId,
}: {
  applicationId: string;
}) {
  const [state, action, pending] = useActionState(
    deleteApplication,
    emptyDeleteApplication,
  );

  return (
    <form
      action={action}
      className="mt-4 rounded-2xl border border-red-200 bg-red-50/50 p-4 dark:border-red-900/50 dark:bg-red-950/20"
      onSubmit={(event) => {
        if (
          !window.confirm(
            "Delete this application permanently? This will remove the application and its associated ownership and financing records. The customer account and identity profile will remain.",
          )
        ) {
          event.preventDefault();
        }
      }}
    >
      <input type="hidden" name="application_id" value={applicationId} />

      <p className="text-sm font-semibold text-red-700 dark:text-red-400">
        Delete application
      </p>

      <p className="mt-1 text-xs text-muted-foreground">
        Permanently removes this application and its associated ownership and
        financing records. The customer account, profile, identity information,
        and messages are not deleted.
      </p>

      {state.error ? (
        <p className="mt-3 text-xs text-red-600 dark:text-red-400">
          {state.error}
        </p>
      ) : null}

      {state.success ? (
        <p className="mt-3 text-xs text-primary">{state.success}</p>
      ) : null}

      <Button
        type="submit"
        size="sm"
        variant="outline"
        className="mt-4 border-red-300 text-red-700 hover:bg-red-50 hover:text-red-800 dark:border-red-900 dark:text-red-400 dark:hover:bg-red-950/40 dark:hover:text-red-300"
        disabled={pending}
      >
        {pending ? "Deleting…" : "Delete application"}
      </Button>
    </form>
  );
}

export function IdentityReviewForm({
  userId,
  verified,
}: {
  userId: string;
  verified: boolean;
}) {
  const [state, action, pending] = useActionState(
    reviewIdentity,
    emptyIdentity,
  );

  return (
    <form action={action} className="mt-3 flex flex-wrap items-center gap-2">
      <input type="hidden" name="user_id" value={userId} />

      <input type="hidden" name="verified" value={String(!verified)} />

      <Button
        size="sm"
        variant={verified ? "outline" : "default"}
        disabled={pending}
      >
        {verified ? "Revoke verification" : "Verify identity"}
      </Button>

      {state.error ? (
        <span className="text-xs text-red-600 dark:text-red-400">
          {state.error}
        </span>
      ) : null}

      {state.success ? (
        <span className="text-xs text-primary">{state.success}</span>
      ) : null}
    </form>
  );
}

export function CreatePlanForm({
  applicationId,
  vehicleId,
  vehicleMarketPrice,
  customerContributionPercent,
  customerTermMonths,
}: {
  applicationId: string;
  vehicleId: string;
  vehicleMarketPrice: number | null;
  customerContributionPercent?: number | null;
  customerTermMonths?: number | null;
}) {
  const [state, action, pending] = useActionState(
    createOwnershipPlan,
    emptyPlan,
  );

  /*
   * ============================================================
   * AURORA PRICING
   * ============================================================
   *
   * vehicles.price remains the market/reference price.
   *
   * Ownership calculations use the Aurora Access Price.
   */

  const pricing = getAuroraPricing(vehicleMarketPrice, vehicleId);

  const marketPrice = pricing.marketPrice ?? 0;

  const auroraAccessPrice = pricing.auroraAccessPrice ?? 0;

  const discountPercent = pricing.discountPercent ?? 0;

  /*
   * ============================================================
   * CUSTOMER CONTRIBUTION
   * ============================================================
   *
   * Customer calculator allows 10%–100%.
   *
   * IMPORTANT:
   * 30% is NOT the minimum contribution.
   *
   * 30% is the Aurora vehicle delivery/ownership threshold.
   * The customer may choose a contribution below or above 30%.
   *
   * The plan itself may therefore be created using the customer's
   * selected contribution percentage.
   */

  const rawContributionPercent =
    customerContributionPercent == null
      ? null
      : Number(customerContributionPercent);

  const validContributionPercent =
    rawContributionPercent != null &&
    Number.isFinite(rawContributionPercent) &&
    rawContributionPercent >= 10 &&
    rawContributionPercent <= 100;

  const contributionPercent = validContributionPercent
    ? rawContributionPercent
    : 0;

  /*
   * Customer/application term.
   *
   * Valid customer range is 1–48 months.
   */

  const rawTermMonths =
    customerTermMonths == null ? null : Number(customerTermMonths);

  const validTermMonths =
    rawTermMonths != null &&
    Number.isFinite(rawTermMonths) &&
    Number.isInteger(rawTermMonths) &&
    rawTermMonths >= 1 &&
    rawTermMonths <= 48;

  const termMonths = validTermMonths ? rawTermMonths : 0;

  /*
   * ============================================================
   * CALCULATIONS
   * ============================================================
   *
   * All calculations use Aurora Access Price.
   *
   * Aurora MVP:
   *
   * - 0% interest
   * - contribution is customer-selected
   * - remaining balance is divided by the selected term
   * - total financed repayment excludes the initial contribution
   */

  const calculated = useMemo(() => {
    const contribution = auroraAccessPrice * (contributionPercent / 100);

    const amountFinanced = Math.max(0, auroraAccessPrice - contribution);

    const monthlyPayment = termMonths > 0 ? amountFinanced / termMonths : 0;

    const totalFinancedRepayment = amountFinanced;

    const ownership =
      auroraAccessPrice > 0 ? (contribution / auroraAccessPrice) * 100 : 0;

    /*
     * Aurora delivery threshold.
     *
     * Vehicle delivery requires at least 30% contribution.
     * This does not prevent the customer from selecting a
     * contribution below 30%; it simply means delivery is not
     * yet unlocked.
     */

    const deliveryThresholdPercent = 30;

    const deliveryThresholdAmount =
      auroraAccessPrice * (deliveryThresholdPercent / 100);

    const deliveryThresholdRemaining = Math.max(
      0,
      deliveryThresholdAmount - contribution,
    );

    const deliveryThresholdReached = contribution >= deliveryThresholdAmount;

    return {
      contribution,
      amountFinanced,
      monthlyPayment,
      totalFinancedRepayment,
      ownership,
      deliveryThresholdPercent,
      deliveryThresholdAmount,
      deliveryThresholdRemaining,
      deliveryThresholdReached,
    };
  }, [auroraAccessPrice, contributionPercent, termMonths]);

  const money = (value: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 2,
    }).format(value);

  const canCreate =
    vehicleId.trim().length > 0 &&
    marketPrice > 0 &&
    auroraAccessPrice > 0 &&
    validContributionPercent &&
    validTermMonths;

  return (
    <form
      action={action}
      className="mt-4 rounded-2xl border border-border bg-background/40 p-5"
    >
      <input type="hidden" name="application_id" value={applicationId} />

      <input type="hidden" name="currency" value="USD" />

      <input
        type="hidden"
        name="vehicle_price"
        value={auroraAccessPrice.toFixed(2)}
      />

      <input
        type="hidden"
        name="down_payment"
        value={calculated.contribution.toFixed(2)}
      />

      <input
        type="hidden"
        name="monthly_payment"
        value={calculated.monthlyPayment.toFixed(2)}
      />

      <input type="hidden" name="term_months" value={termMonths} />

      <input
        type="hidden"
        name="total_financed_repayment"
        value={calculated.totalFinancedRepayment.toFixed(2)}
      />

      <input type="hidden" name="payment_frequency" value="monthly" />

      <input type="hidden" name="annual_interest_rate" value="0" />

      <input
        type="hidden"
        name="first_payment_date"
        value={new Date().toISOString().slice(0, 10)}
      />

      <div className="mb-5">
        <p className="text-sm font-semibold">Create ownership plan</p>

        <p className="mt-1 text-xs text-muted-foreground">
          Review the customer terms and Aurora pricing before creating the draft
          ownership plan.
        </p>
      </div>

      <div className="space-y-4">
        {/* =========================================================
            PRICING
        ========================================================= */}

        <div className="rounded-xl border border-border p-4">
          <p className="text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground">
            Aurora vehicle pricing
          </p>

          <div className="mt-4 grid gap-4 sm:grid-cols-3">
            <div>
              <p className="text-xs text-muted-foreground">Market price</p>

              <p className="mt-1 text-lg font-semibold text-muted-foreground line-through">
                {money(marketPrice)}
              </p>
            </div>

            <div>
              <p className="text-xs text-muted-foreground">
                Aurora Access Price
              </p>

              <p className="mt-1 text-2xl font-bold">
                {money(auroraAccessPrice)}
              </p>
            </div>

            <div>
              <p className="text-xs text-muted-foreground">Aurora savings</p>

              <p className="mt-1 text-2xl font-bold text-primary">
                Save {discountPercent}%
              </p>
            </div>
          </div>

          <p className="mt-4 text-xs text-muted-foreground">
            The market price is the vehicle catalogue reference price. Ownership
            calculations use the Aurora Access Price after the applicable Aurora
            discount.
          </p>
        </div>

        {/* =========================================================
            INITIAL CONTRIBUTION
        ========================================================= */}

        <div className="rounded-xl border border-border p-4">
          <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
            <div>
              <p className="text-xs text-muted-foreground">
                Initial contribution
              </p>

              <p className="mt-1 text-lg font-semibold">
                {validContributionPercent
                  ? `${contributionPercent.toFixed(0)}%`
                  : "Invalid customer contribution"}
              </p>

              <p className="mt-1 text-xs text-muted-foreground">
                Customer range: 10%–100%
              </p>
            </div>

            <p className="text-lg font-semibold">
              {money(calculated.contribution)}
            </p>
          </div>

          {!validContributionPercent ? (
            <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-3 dark:border-red-900/50 dark:bg-red-950/20">
              <p className="text-xs font-medium text-red-700 dark:text-red-400">
                Customer contribution must be between 10% and 100% before the
                ownership plan can be created.
              </p>

              {rawContributionPercent != null ? (
                <p className="mt-1 text-xs text-red-600 dark:text-red-400">
                  Current application value: {rawContributionPercent}%
                </p>
              ) : (
                <p className="mt-1 text-xs text-red-600 dark:text-red-400">
                  No customer contribution percentage was submitted.
                </p>
              )}
            </div>
          ) : null}

          {/* Delivery threshold */}
          <div className="mt-4 rounded-xl border border-border bg-background/40 p-3">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs font-medium">
                  Vehicle delivery threshold
                </p>

                <p className="mt-1 text-xs text-muted-foreground">
                  30% of the Aurora Access Price
                </p>
              </div>

              <span
                className={
                  calculated.deliveryThresholdReached
                    ? "rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary"
                    : "rounded-full bg-muted px-3 py-1 text-xs font-semibold text-muted-foreground"
                }
              >
                {calculated.deliveryThresholdReached
                  ? "Reached"
                  : "Not reached"}
              </span>
            </div>

            {!calculated.deliveryThresholdReached ? (
              <p className="mt-2 text-xs text-muted-foreground">
                {money(calculated.deliveryThresholdRemaining)} more contribution
                is required to reach the 30% delivery threshold.
              </p>
            ) : (
              <p className="mt-2 text-xs text-primary">
                The customer has reached the 30% vehicle delivery threshold.
              </p>
            )}
          </div>
        </div>

        {/* =========================================================
            FINANCING CALCULATIONS
        ========================================================= */}

        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-xl border border-border p-4">
            <p className="text-xs text-muted-foreground">Amount financed</p>

            <p className="mt-1 text-xl font-semibold">
              {money(calculated.amountFinanced)}
            </p>

            <p className="mt-2 text-xs text-muted-foreground">
              Aurora Access Price minus the initial contribution.
            </p>
          </div>

          <div className="rounded-xl border border-border p-4">
            <p className="text-xs text-muted-foreground">Payment term</p>

            <p className="mt-1 text-xl font-semibold">
              {termMonths > 0 ? `${termMonths} months` : "—"}
            </p>

            <p className="mt-2 text-xs text-muted-foreground">
              Taken from the customer/application terms.
            </p>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-xl border border-border p-4">
            <p className="text-xs text-muted-foreground">Monthly payment</p>

            <p className="mt-1 text-xl font-semibold">
              {money(calculated.monthlyPayment)}
            </p>

            <p className="mt-2 text-xs text-muted-foreground">
              Calculated at 0% interest.
            </p>
          </div>

          <div className="rounded-xl border border-border p-4">
            <p className="text-xs text-muted-foreground">
              Total financed repayment
            </p>

            <p className="mt-1 text-xl font-semibold">
              {money(calculated.totalFinancedRepayment)}
            </p>

            <p className="mt-2 text-xs text-muted-foreground">
              Excludes the initial contribution.
            </p>
          </div>
        </div>

        <div className="rounded-xl border border-border p-4">
          <p className="text-xs text-muted-foreground">
            Ownership contribution
          </p>

          <p className="mt-1 text-xl font-semibold">
            {calculated.ownership.toFixed(1)}%
          </p>

          <p className="mt-2 text-xs text-muted-foreground">
            Calculated against the Aurora Access Price.
          </p>
        </div>
      </div>

      {/* =========================================================
          SUMMARY
      ========================================================= */}

      <div className="mt-5 rounded-xl border border-border bg-background/30 p-4">
        <p className="text-sm font-semibold">Ownership summary</p>

        <div className="mt-3 space-y-2 text-sm">
          <div className="flex items-center justify-between gap-4">
            <span className="text-muted-foreground">Market price</span>

            <span className="font-medium text-muted-foreground line-through">
              {money(marketPrice)}
            </span>
          </div>

          <div className="flex items-center justify-between gap-4">
            <span className="text-muted-foreground">Aurora Access Price</span>

            <span className="font-semibold">{money(auroraAccessPrice)}</span>
          </div>

          <div className="flex items-center justify-between gap-4">
            <span className="text-muted-foreground">Aurora savings</span>

            <span className="font-medium text-primary">{discountPercent}%</span>
          </div>

          <div className="my-3 border-t border-border" />

          <div className="flex items-center justify-between gap-4">
            <span className="text-muted-foreground">Initial contribution</span>

            <span className="font-medium">
              {money(calculated.contribution)}
            </span>
          </div>

          <div className="flex items-center justify-between gap-4">
            <span className="text-muted-foreground">Financed amount</span>

            <span className="font-medium">
              {money(calculated.amountFinanced)}
            </span>
          </div>

          <div className="flex items-center justify-between gap-4">
            <span className="text-muted-foreground">Monthly payment</span>

            <span className="font-medium">
              {money(calculated.monthlyPayment)}
            </span>
          </div>

          <div className="flex items-center justify-between gap-4">
            <span className="text-muted-foreground">
              Total financed repayment
            </span>

            <span className="font-medium">
              {money(calculated.totalFinancedRepayment)}
            </span>
          </div>

          <div className="flex items-center justify-between gap-4">
            <span className="text-muted-foreground">Term</span>

            <span className="font-medium">
              {termMonths > 0 ? `${termMonths} months` : "—"}
            </span>
          </div>

          <div className="flex items-center justify-between gap-4">
            <span className="text-muted-foreground">
              Ownership contribution
            </span>

            <span className="font-medium">
              {calculated.ownership.toFixed(1)}%
            </span>
          </div>

          <div className="flex items-center justify-between gap-4">
            <span className="text-muted-foreground">Delivery threshold</span>

            <span className="font-medium">
              {calculated.deliveryThresholdReached
                ? "30% reached"
                : `${money(calculated.deliveryThresholdRemaining)} remaining`}
            </span>
          </div>
        </div>
      </div>

      {/* =========================================================
          CREATE
      ========================================================= */}

      <div className="mt-5 flex flex-col gap-4 border-t border-border pt-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs text-muted-foreground">
            Financing values are calculated from the customer&apos;s requested
            terms and the Aurora Access Price.
          </p>

          {state.error ? (
            <p className="mt-2 text-xs text-red-600 dark:text-red-400">
              {state.error}
            </p>
          ) : null}

          {state.success ? (
            <p className="mt-2 text-xs text-primary">{state.success}</p>
          ) : null}
        </div>

        <Button disabled={pending || !canCreate}>
          {pending ? "Creating…" : "Verify & create"}
        </Button>
      </div>
    </form>
  );
}

export function PreparePlanForm({ planId }: { planId: string }) {
  const [state, action, pending] = useActionState(
    prepareOwnershipPlan,
    emptyPrepare,
  );

  return (
    <form action={action} className="mt-3">
      <input type="hidden" name="plan_id" value={planId} />

      <Button size="sm" variant="secondary" disabled={pending}>
        {pending ? "Preparing…" : "Mark ready for customer"}
      </Button>

      {state.error ? (
        <p className="mt-2 text-xs text-red-600 dark:text-red-400">
          {state.error}
        </p>
      ) : null}

      {state.success ? (
        <p className="mt-2 text-xs text-primary">{state.success}</p>
      ) : null}
    </form>
  );
}

export function ActivatePlanForm({ planId }: { planId: string }) {
  const [state, action, pending] = useActionState(
    activateOwnershipPlan,
    emptyActivate,
  );

  return (
    <form action={action} className="mt-3">
      <input type="hidden" name="plan_id" value={planId} />

      <Button size="sm" disabled={pending}>
        {pending ? "Activating…" : "Activate ownership"}
      </Button>

      {state.error ? (
        <p className="mt-2 text-xs text-red-600 dark:text-red-400">
          {state.error}
        </p>
      ) : null}

      {state.success ? (
        <p className="mt-2 text-xs text-primary">{state.success}</p>
      ) : null}
    </form>
  );
}

export function RecordManualPaymentForm({
  planId,
  schedule,
  currency,
  downPaymentRemaining,
}: {
  planId: string;
  schedule: {
    id: string;
    installment_number: number;
    due_date: string;
    amount_due: number;
    amount_paid: number;
    status: string;
  }[];
  currency: string;
  downPaymentRemaining: number;
}) {
  const [state, action, pending] = useActionState(
    recordManualPayment,
    emptyPayment,
  );

  const openInstallments = schedule.filter(
    (item) =>
      item.status !== "paid" &&
      item.status !== "cancelled" &&
      item.amount_due > item.amount_paid,
  );

  return (
    <form
      action={action}
      className="mt-4 space-y-3 rounded-2xl border border-border bg-background/40 p-4"
    >
      <input type="hidden" name="plan_id" value={planId} />

      <div className="grid gap-3 sm:grid-cols-2">
        <select
          name="payment_type"
          defaultValue="installment"
          className="h-10 rounded-xl border border-input bg-background px-3 text-sm"
        >
          {downPaymentRemaining > 0 ? (
            <option value="down_payment">
              Down payment · {currency} {downPaymentRemaining.toLocaleString()}
            </option>
          ) : null}

          <option value="installment">Scheduled installment</option>
        </select>

        <select
          name="schedule_id"
          defaultValue={openInstallments[0]?.id ?? ""}
          className="h-10 rounded-xl border border-input bg-background px-3 text-sm"
        >
          <option value="">Select installment</option>

          {openInstallments.map((item) => (
            <option key={item.id} value={item.id}>
              #{item.installment_number} · {item.due_date} · {currency}{" "}
              {Math.max(0, item.amount_due - item.amount_paid).toLocaleString()}{" "}
              remaining
            </option>
          ))}
        </select>

        <input
          name="amount"
          type="number"
          step="0.01"
          min="0.01"
          placeholder="Amount received"
          className="h-10 rounded-xl border border-input bg-background px-3 text-sm"
        />

        <input
          name="payment_date"
          type="date"
          defaultValue={new Date().toISOString().slice(0, 10)}
          className="h-10 rounded-xl border border-input bg-background px-3 text-sm"
        />

        <input
          name="transaction_reference"
          placeholder="Payment reference"
          className="h-10 w-full rounded-xl border border-input bg-background px-3 text-sm sm:col-span-2"
        />
      </div>

      <p className="text-xs text-muted-foreground">
        Only use this action after an authorized operator has confirmed the
        funds were received outside Aurora. The message thread is not treated as
        proof of payment.
      </p>

      <div>
        <Button
          disabled={
            pending ||
            (openInstallments.length === 0 && downPaymentRemaining <= 0)
          }
          size="sm"
        >
          {pending ? "Recording…" : "Record confirmed payment"}
        </Button>

        {state.error ? (
          <p className="mt-2 text-xs text-red-600 dark:text-red-400">
            {state.error}
          </p>
        ) : null}

        {state.success ? (
          <p className="mt-2 text-xs text-primary">{state.success}</p>
        ) : null}
      </div>
    </form>
  );
}
