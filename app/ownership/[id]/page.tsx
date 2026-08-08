import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, CarFront, CheckCircle2, ShieldCheck } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { OwnershipPlanActions } from "@/features/ownership/components/ownership-plan-actions";
import { getOwnershipPlanStatusConfig } from "@/features/ownership/types/ownership-plan";
import { getOwnershipPlan } from "@/features/ownership/lib/get-ownership-plan";
import { createClient } from "@/lib/supabase/server";

function money(value: number | null, currency = "USD") {
  return value == null ? "—" : new Intl.NumberFormat("en-US", { style: "currency", currency }).format(value);
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
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) notFound();

  const planView = await getOwnershipPlan(id);
  if (!planView) notFound();
  const { ownershipPlan: plan, financingTerms, paymentSchedule, payments } = planView;
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
  const canRespond = plan.status === "ready" && application.status === "approved";

  return (
    <main className="mx-auto max-w-5xl space-y-8 p-6 sm:p-8">
      <Button asChild variant="ghost" className="-ml-3">
        <Link href={`/applications/${application.id}`}><ArrowLeft className="h-4 w-4" /> Back to application</Link>
      </Button>

      <header className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">Aurora Ownership</p>
          <h1 className="mt-2 text-3xl font-bold sm:text-4xl">Your ownership plan</h1>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground">Review the ownership terms Aurora prepared for your approved application.</p>
        </div>
        <Badge variant={statusVariant(plan.status)}>{config.label}</Badge>
      </header>

      <section className="overflow-hidden rounded-3xl border bg-card">
        <div className="grid lg:grid-cols-[0.9fr_1.1fr]">
          <div className="aspect-[16/10] bg-muted lg:aspect-auto">
            {vehicle?.image_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={vehicle.image_url} alt={`${vehicle.brand} ${vehicle.model}`} className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full min-h-64 items-center justify-center text-muted-foreground"><CarFront className="h-12 w-12" /></div>
            )}
          </div>
          <div className="p-6 sm:p-8">
            <p className="text-sm text-muted-foreground">Approved vehicle</p>
            <h2 className="mt-2 text-2xl font-bold">{vehicle ? `${vehicle.brand} ${vehicle.model}${vehicle.trim ? ` ${vehicle.trim}` : ""}` : "Vehicle unavailable"}</h2>
            <p className="mt-1 text-sm text-muted-foreground">{vehicle?.year ?? "—"} · Vehicle price {money(financingTerms?.vehicle_price ?? vehicle?.price ?? null, currency)}</p>

            <div className="mt-8 grid grid-cols-2 gap-5 sm:grid-cols-4">
              <div><p className="text-sm text-muted-foreground">Down payment</p><p className="mt-1 text-lg font-semibold">{money(financingTerms?.down_payment ?? null, currency)}</p></div>
              <div><p className="text-sm text-muted-foreground">Monthly</p><p className="mt-1 text-lg font-semibold">{money(financingTerms?.monthly_payment ?? null, currency)}</p></div>
              <div><p className="text-sm text-muted-foreground">Term</p><p className="mt-1 text-lg font-semibold">{financingTerms?.term_months ? `${financingTerms.term_months} mo.` : "—"}</p></div>
              <div><p className="text-sm text-muted-foreground">Total repayment</p><p className="mt-1 text-lg font-semibold">{money(financingTerms?.total_financed_repayment ?? null, currency)}</p></div>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-5 text-sm">
              <div><p className="text-muted-foreground">First payment</p><p className="mt-1 font-semibold">{financingTerms?.first_payment_date ?? "—"}</p></div>
              <div><p className="text-muted-foreground">Frequency</p><p className="mt-1 font-semibold capitalize">{financingTerms?.payment_frequency ?? "monthly"}</p></div>
            </div>
          </div>
        </div>
      </section>

      {financingTerms ? (
        <section className="rounded-3xl border bg-card p-6 sm:p-8">
          <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">Payment schedule</p>
              <h2 className="mt-2 text-xl font-semibold">Your recorded payment history</h2>
              <p className="mt-2 text-sm text-muted-foreground">Payments shown here are recorded by Aurora after an authorized operator confirms receipt.</p>
            </div>
            <div className="text-sm"><span className="text-muted-foreground">Financed balance remaining</span><p className="mt-1 text-lg font-semibold">{money(planView.remainingBalance, currency)}</p></div>
          </div>
          <div className="mt-6 overflow-x-auto">
            <table className="w-full min-w-[620px] text-sm">
              <thead><tr className="border-b text-left text-muted-foreground"><th className="pb-3 pr-4 font-medium">Installment</th><th className="pb-3 pr-4 font-medium">Due</th><th className="pb-3 pr-4 font-medium">Amount</th><th className="pb-3 pr-4 font-medium">Paid</th><th className="pb-3 font-medium">Status</th></tr></thead>
              <tbody>
                {paymentSchedule.map((item) => (
                  <tr key={item.id} className="border-b last:border-0">
                    <td className="py-3 pr-4">#{item.installment_number}</td>
                    <td className="py-3 pr-4">{item.due_date}</td>
                    <td className="py-3 pr-4">{money(item.amount_due, currency)}</td>
                    <td className="py-3 pr-4">{money(item.amount_paid, currency)}</td>
                    <td className="py-3 capitalize">{item.status.replace("_", " ")}</td>
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
                  <div key={payment.id} className="flex flex-col justify-between gap-1 rounded-2xl border p-4 sm:flex-row sm:items-center">
                    <div><p className="font-medium">{payment.payment_type === "down_payment" ? "Down payment" : "Installment"}</p><p className="text-xs text-muted-foreground">{payment.transaction_reference || "No reference"} · {payment.payment_date ? new Date(payment.payment_date).toLocaleDateString() : "—"}</p></div>
                    <p className="font-semibold">{money(payment.amount, currency)}</p>
                  </div>
                ))}
              </div>
            </div>
          ) : null}
        </section>
      ) : null}

      <section className="grid gap-6 lg:grid-cols-[1fr_0.7fr]">
        <div className="rounded-3xl border bg-card p-6 sm:p-8">
          <div className="flex items-center gap-3">
            <ShieldCheck className="h-6 w-6 text-primary" />
            <h2 className="text-xl font-semibold">What happens next</h2>
          </div>
          <p className="mt-3 leading-relaxed text-muted-foreground">{config.description}</p>

          {canRespond ? <div className="mt-6"><OwnershipPlanActions planId={plan.id} /></div> : null}
          <Button asChild variant="outline" className="mt-6">
            <Link href={`/messages?ownershipPlan=${plan.id}`}>Message Aurora about this plan <ArrowLeft className="ml-2 h-4 w-4 rotate-180" /></Link>
          </Button>

          {plan.status === "accepted" ? (
            <div className="mt-6 rounded-2xl border bg-muted/40 p-4 text-sm">
              <div className="flex items-center gap-2 font-semibold"><CheckCircle2 className="h-5 w-5 text-green-500" /> Plan accepted</div>
              <p className="mt-1 text-muted-foreground">Aurora can now move your ownership journey into its next trusted step.</p>
            </div>
          ) : null}
        </div>

        <aside className="rounded-3xl border bg-muted/30 p-6 sm:p-8">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">Important</p>
          <h2 className="mt-2 text-xl font-semibold">Review before proceeding</h2>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">This plan summarizes the terms Aurora has prepared. No payment is requested by this screen. Financial transactions will be handled through a separate, trusted payment workflow.</p>
        </aside>
      </section>
    </main>
  );
}
