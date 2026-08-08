import { redirect } from "next/navigation";
import { requireAdmin } from "@/features/admin/lib/authorization";
import { ApplicationReviewForm, CreatePlanForm, IdentityReviewForm, PreparePlanForm, ActivatePlanForm, RecordManualPaymentForm } from "./components/admin-action-form";
import { getApplicationStatusConfig } from "@/features/applications/types/status";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function AdminPage() {
  const { supabase, user, isAdmin } = await requireAdmin();
  if (!user) redirect("/login");
  if (!isAdmin) redirect("/dashboard");

  const [applicationsResult, profilesResult, plansResult] = await Promise.all([
    supabase.from("applications").select("id, user_id, vehicle_id, status, application_date, reviewed_at, rejection_reason").order("application_date", { ascending: false }),
    supabase.from("profiles").select("user_id, full_name, identity_verified, identity_verified_at, drivers_license_front, drivers_license_back").order("updated_at", { ascending: false }),
    supabase.from("ownership_plans").select("id, application_id, status, accepted_at, activated_at, financing_terms(*)").order("created_at", { ascending: false }),
  ]);

  if (applicationsResult.error || profilesResult.error || plansResult.error) {
    return (
      <main className="mx-auto max-w-6xl px-6 py-16">
        <div className="rounded-3xl border bg-card p-8">
          <h1 className="text-2xl font-semibold">Operations unavailable</h1>
          <p className="mt-2 text-sm text-muted-foreground">Aurora could not load the operations workspace. No database details are exposed here.</p>
        </div>
      </main>
    );
  }

  const applications = applicationsResult.data;
  const profiles = profilesResult.data;
  const plans = plansResult.data;

  const vehicleIds = [...new Set((applications ?? []).map((application) => application.vehicle_id))];
  const { data: vehicles } = vehicleIds.length
    ? await supabase.from("vehicles").select("id, brand, model, year, price").in("id", vehicleIds)
    : { data: [] };

  const vehicleMap = new Map((vehicles ?? []).map((vehicle) => [vehicle.id, vehicle]));
  const financingIds = (plans ?? []).flatMap((plan) => {
    const terms = Array.isArray(plan.financing_terms) ? plan.financing_terms[0] : plan.financing_terms;
    return terms?.id ? [terms.id] : [];
  });
  const { data: paymentSchedule } = financingIds.length
    ? await supabase.from("payment_schedule").select("id, financing_terms_id, installment_number, due_date, amount_due, amount_paid, status").in("financing_terms_id", financingIds).order("installment_number", { ascending: true })
    : { data: [] };
  const planIds = (plans ?? []).map((plan) => plan.id);
  const { data: recordedPayments } = planIds.length
    ? await supabase.from("payments").select("plan_id, amount, payment_type, payment_status").in("plan_id", planIds).eq("payment_status", "completed")
    : { data: [] };
  const recordedDownPayments = new Map<string, number>();
  for (const payment of recordedPayments ?? []) {
    if (payment.payment_type !== "down_payment") continue;
    recordedDownPayments.set(payment.plan_id, (recordedDownPayments.get(payment.plan_id) ?? 0) + Number(payment.amount ?? 0));
  }
  const scheduleByFinancing = new Map<string, typeof paymentSchedule>();
  for (const item of paymentSchedule ?? []) {
    const current = scheduleByFinancing.get(item.financing_terms_id) ?? [];
    current.push(item);
    scheduleByFinancing.set(item.financing_terms_id, current);
  }
  const profileMap = new Map((profiles ?? []).map((profile) => [profile.user_id, profile]));
  const applicationMap = new Map((applications ?? []).map((application) => [application.id, application]));
  const planByApplication = new Map((plans ?? []).map((plan) => [plan.application_id, plan]));

  const pendingApplications = (applications ?? []).filter((application) => ["pending", "reviewing"].includes(application.status ?? ""));
  const identityQueue = (profiles ?? []).filter((profile) => !profile.identity_verified && (profile.drivers_license_front || profile.drivers_license_back));
  const approvedWithoutPlan = (applications ?? []).filter((application) => application.status === "approved" && !planByApplication.has(application.id));

  return (
    <main className="mx-auto max-w-7xl space-y-10 p-6 sm:p-8">
      <header>
        <p className="text-sm font-medium text-primary">Aurora Operations</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight">Admin Console</h1>
        <p className="mt-2 max-w-2xl text-muted-foreground">Review applications, verify identities, move approved ownership plans through trusted operational states, and communicate with customers.</p>
        <Button asChild variant="outline" className="mt-4"><Link href="/admin/messages">Open customer messages</Link></Button>
      </header>

      <section className="grid gap-4 sm:grid-cols-3">
        {[
          ["Review queue", pendingApplications.length],
          ["Identity queue", identityQueue.length],
          ["Plans to prepare", approvedWithoutPlan.length],
        ].map(([label, value]) => (
          <div key={String(label)} className="rounded-3xl border bg-card p-6">
            <p className="text-sm text-muted-foreground">{label}</p>
            <p className="mt-2 text-3xl font-semibold">{value}</p>
          </div>
        ))}
      </section>

      <section className="space-y-4">
        <div><h2 className="text-2xl font-semibold">Application review</h2><p className="text-sm text-muted-foreground">Move applications through the trusted review states.</p></div>
        {pendingApplications.length === 0 ? <div className="rounded-3xl border bg-card p-6 text-sm text-muted-foreground">No applications are waiting for review.</div> : pendingApplications.map((application) => {
          const vehicle = vehicleMap.get(application.vehicle_id);
          const profile = profileMap.get(application.user_id);
          return (
            <article key={application.id} className="rounded-3xl border bg-card p-6">
              <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-start">
                <div>
                  <p className="text-sm text-muted-foreground">{profile?.full_name || "Customer"}</p>
                  <h3 className="mt-1 text-xl font-semibold">{vehicle ? `${vehicle.brand} ${vehicle.model}${vehicle.year ? ` · ${vehicle.year}` : ""}` : "Vehicle unavailable"}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">Submitted {application.application_date ? new Date(application.application_date).toLocaleString() : "—"}</p>
                </div>
                <span className="rounded-full border px-3 py-1 text-sm">{getApplicationStatusConfig(application.status as "pending" | "reviewing").label}</span>
              </div>
              <ApplicationReviewForm applicationId={application.id} status={application.status} />
            </article>
          );
        })}
      </section>

      <section className="space-y-4">
        <div><h2 className="text-2xl font-semibold">Identity verification</h2><p className="text-sm text-muted-foreground">Uploaded documents are not considered verified until an authorized operator confirms them.</p></div>
        {identityQueue.length === 0 ? <div className="rounded-3xl border bg-card p-6 text-sm text-muted-foreground">No uploaded identities are waiting for verification.</div> : identityQueue.map((profile) => (
          <article key={profile.user_id} className="flex flex-col justify-between gap-4 rounded-3xl border bg-card p-6 sm:flex-row sm:items-center">
            <div><p className="font-semibold">{profile.full_name || "Unnamed customer"}</p><p className="mt-1 text-sm text-muted-foreground">Documents uploaded · verification pending</p></div>
            <IdentityReviewForm userId={profile.user_id} verified={profile.identity_verified} />
          </article>
        ))}
      </section>

      <section className="space-y-4">
        <div><h2 className="text-2xl font-semibold">Ownership operations</h2><p className="text-sm text-muted-foreground">Prepare plans for approved customers and activate accepted plans.</p></div>
        {approvedWithoutPlan.map((application) => {
          const vehicle = vehicleMap.get(application.vehicle_id);
          return <article key={application.id} className="rounded-3xl border bg-card p-6"><h3 className="font-semibold">{vehicle ? `${vehicle.brand} ${vehicle.model}` : "Approved application"}</h3><p className="mt-1 text-sm text-muted-foreground">Create the first draft ownership plan for this approved application.</p><CreatePlanForm applicationId={application.id} vehiclePrice={vehicle?.price ?? null} /></article>;
        })}
        {(plans ?? []).map((plan) => {
          const application = applicationMap.get(plan.application_id);
          const profile = application ? profileMap.get(application.user_id) : undefined;
          const terms = Array.isArray(plan.financing_terms) ? plan.financing_terms[0] : plan.financing_terms;
          const planSchedule = terms?.id ? (scheduleByFinancing.get(terms.id) ?? []) : [];
          const recordedDownPayment = recordedDownPayments.get(plan.id) ?? 0;
          const downPaymentRemaining = Math.max(0, Number(terms?.down_payment ?? 0) - recordedDownPayment);
          return <article key={plan.id} className="rounded-3xl border bg-card p-6">
            <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
              <div><p className="font-semibold">{profile?.full_name || "Customer"}</p><p className="text-sm text-muted-foreground">Plan status: {plan.status}</p></div>
              <div className="text-sm text-muted-foreground">{terms?.currency ?? "USD"} {Number(terms?.monthly_payment ?? 0).toLocaleString()} / month</div>
            </div>
            {plan.status === "draft" ? <PreparePlanForm planId={plan.id} /> : null}
            {plan.status === "accepted" ? <ActivatePlanForm planId={plan.id} /> : null}
            {plan.status === "active" || plan.status === "accepted" ? (
              <RecordManualPaymentForm
                planId={plan.id}
                schedule={planSchedule}
                currency={terms?.currency ?? "USD"}
                downPaymentRemaining={downPaymentRemaining}
              />
            ) : null}
          </article>;
        })}
      </section>
    </main>
  );
}
