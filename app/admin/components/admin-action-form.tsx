"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { reviewApplication, type ReviewApplicationState } from "@/features/admin/actions/review-application";
import { reviewIdentity, type ReviewIdentityState } from "@/features/admin/actions/review-identity";
import { createOwnershipPlan, type OwnershipPlanState } from "@/features/admin/actions/create-ownership-plan";
import { prepareOwnershipPlan, type PreparePlanState } from "@/features/admin/actions/prepare-ownership-plan";
import { activateOwnershipPlan, type ActivatePlanState } from "@/features/admin/actions/activate-ownership-plan";
import { recordManualPayment, type RecordManualPaymentState } from "@/features/admin/actions/record-manual-payment";

const emptyReview: ReviewApplicationState = {};
const emptyIdentity: ReviewIdentityState = {};
const emptyPlan: OwnershipPlanState = {};
const emptyPrepare: PreparePlanState = {};
const emptyActivate: ActivatePlanState = {};
const emptyPayment: RecordManualPaymentState = {};

export function ApplicationReviewForm({ applicationId, status }: { applicationId: string; status: string | null }) {
  const [state, action, pending] = useActionState(reviewApplication, emptyReview);
  if (status === "rejected" || status === "cancelled" || status === "approved") return null;

  return (
    <form action={action} className="mt-4 space-y-3 rounded-2xl border border-border bg-background/40 p-4">
      {state.error ? <p className="text-sm text-red-300">{state.error}</p> : null}
      {state.success ? <p className="text-sm text-primary">{state.success}</p> : null}
      <input type="hidden" name="application_id" value={applicationId} />
      <div className="flex flex-wrap gap-2">
        {status === "pending" ? <Button name="decision" value="reviewing" size="sm" variant="secondary" disabled={pending}>Start review</Button> : null}
        <Button name="decision" value="approved" size="sm" disabled={pending}>Approve</Button>
        <Button name="decision" value="rejected" size="sm" variant="outline" disabled={pending}>Reject</Button>
      </div>
      <input name="rejection_reason" placeholder="Required when rejecting" className="h-10 w-full rounded-xl border border-input bg-background px-3 text-sm" />
    </form>
  );
}

export function IdentityReviewForm({ userId, verified }: { userId: string; verified: boolean }) {
  const [state, action, pending] = useActionState(reviewIdentity, emptyIdentity);
  return (
    <form action={action} className="mt-3 flex flex-wrap items-center gap-2">
      <input type="hidden" name="user_id" value={userId} />
      <input type="hidden" name="verified" value={String(!verified)} />
      <Button size="sm" variant={verified ? "outline" : "default"} disabled={pending}>
        {verified ? "Revoke verification" : "Verify identity"}
      </Button>
      {state.error ? <span className="text-xs text-red-300">{state.error}</span> : null}
      {state.success ? <span className="text-xs text-primary">{state.success}</span> : null}
    </form>
  );
}

export function CreatePlanForm({ applicationId, vehiclePrice }: { applicationId: string; vehiclePrice: number | null }) {
  const [state, action, pending] = useActionState(createOwnershipPlan, emptyPlan);
  return (
    <form action={action} className="mt-4 grid gap-3 rounded-2xl border border-border bg-background/40 p-4 sm:grid-cols-2">
      <input type="hidden" name="application_id" value={applicationId} />
      <input name="currency" type="text" maxLength={3} defaultValue="USD" placeholder="Currency" className="h-10 rounded-xl border border-input bg-background px-3 text-sm uppercase" />
      <input name="annual_interest_rate" type="number" step="0.0001" min="0" placeholder="Approved annual rate (%)" className="h-10 rounded-xl border border-input bg-background px-3 text-sm" />
      <input name="vehicle_price" type="number" step="0.01" min="0" defaultValue={vehiclePrice ?? ""} placeholder="Vehicle price" className="h-10 rounded-xl border border-input bg-background px-3 text-sm" />
      <input name="down_payment" type="number" step="0.01" min="0" placeholder="Down payment" className="h-10 rounded-xl border border-input bg-background px-3 text-sm" />
      <input name="monthly_payment" type="number" step="0.01" min="0.01" placeholder="Monthly payment" className="h-10 rounded-xl border border-input bg-background px-3 text-sm" />
      <input name="term_months" type="number" min="1" placeholder="Term (months)" className="h-10 rounded-xl border border-input bg-background px-3 text-sm" />
      <input name="first_payment_date" type="date" min={new Date().toISOString().slice(0, 10)} className="h-10 rounded-xl border border-input bg-background px-3 text-sm" />
      <input type="hidden" name="payment_frequency" value="monthly" />
      <input name="total_financed_repayment" type="number" step="0.01" min="0.01" placeholder="Total financed repayment (excl. down payment)" className="h-10 rounded-xl border border-input bg-background px-3 text-sm sm:col-span-2" />
      <div className="sm:col-span-2">
        <Button disabled={pending} size="sm">{pending ? "Creating…" : "Create draft plan"}</Button>
        {state.error ? <p className="mt-2 text-xs text-red-300">{state.error}</p> : null}
        {state.success ? <p className="mt-2 text-xs text-primary">{state.success}</p> : null}
      </div>
    </form>
  );
}

export function PreparePlanForm({ planId }: { planId: string }) {
  const [state, action, pending] = useActionState(prepareOwnershipPlan, emptyPrepare);
  return (
    <form action={action} className="mt-3">
      <input type="hidden" name="plan_id" value={planId} />
      <Button size="sm" variant="secondary" disabled={pending}>{pending ? "Preparing…" : "Mark ready for customer"}</Button>
      {state.error ? <p className="mt-2 text-xs text-red-300">{state.error}</p> : null}
      {state.success ? <p className="mt-2 text-xs text-primary">{state.success}</p> : null}
    </form>
  );
}

export function ActivatePlanForm({ planId }: { planId: string }) {
  const [state, action, pending] = useActionState(activateOwnershipPlan, emptyActivate);
  return (
    <form action={action} className="mt-3">
      <input type="hidden" name="plan_id" value={planId} />
      <Button size="sm" disabled={pending}>{pending ? "Activating…" : "Activate ownership"}</Button>
      {state.error ? <p className="mt-2 text-xs text-red-300">{state.error}</p> : null}
      {state.success ? <p className="mt-2 text-xs text-primary">{state.success}</p> : null}
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
  schedule: { id: string; installment_number: number; due_date: string; amount_due: number; amount_paid: number; status: string }[];
  currency: string;
  downPaymentRemaining: number;
}) {
  const [state, action, pending] = useActionState(recordManualPayment, emptyPayment);
  const openInstallments = schedule.filter((item) => item.status !== "paid" && item.status !== "cancelled" && item.amount_due > item.amount_paid);
  return (
    <form action={action} className="mt-4 space-y-3 rounded-2xl border border-border bg-background/40 p-4">
      <input type="hidden" name="plan_id" value={planId} />
      <div className="grid gap-3 sm:grid-cols-2">
        <select name="payment_type" defaultValue="installment" className="h-10 rounded-xl border border-input bg-background px-3 text-sm">
          {downPaymentRemaining > 0 ? <option value="down_payment">Down payment · {currency} {downPaymentRemaining.toLocaleString()}</option> : null}
          <option value="installment">Scheduled installment</option>
        </select>
        <select name="schedule_id" defaultValue={openInstallments[0]?.id ?? ""} className="h-10 rounded-xl border border-input bg-background px-3 text-sm">
          <option value="">Select installment</option>
          {openInstallments.map((item) => (
            <option key={item.id} value={item.id}>
              #{item.installment_number} · {item.due_date} · {currency} {Math.max(0, item.amount_due - item.amount_paid).toLocaleString()} remaining
            </option>
          ))}
        </select>
        <input name="amount" type="number" step="0.01" min="0.01" placeholder="Amount received" className="h-10 rounded-xl border border-input bg-background px-3 text-sm" />
        <input name="payment_date" type="date" defaultValue={new Date().toISOString().slice(0, 10)} className="h-10 rounded-xl border border-input bg-background px-3 text-sm" />
        <input name="transaction_reference" placeholder="Payment reference" className="h-10 rounded-xl border border-input bg-background px-3 text-sm sm:col-span-2" />
      </div>
      <p className="text-xs text-muted-foreground">Only use this action after an authorized operator has confirmed the funds were received outside Aurora. The message thread is not treated as proof of payment.</p>
      <div>
        <Button disabled={pending || (openInstallments.length === 0 && downPaymentRemaining <= 0)} size="sm">{pending ? "Recording…" : "Record confirmed payment"}</Button>
        {state.error ? <p className="mt-2 text-xs text-red-300">{state.error}</p> : null}
        {state.success ? <p className="mt-2 text-xs text-primary">{state.success}</p> : null}
      </div>
    </form>
  );
}
