import Link from "next/link";
import { redirect } from "next/navigation";

import { AdminDashboardShell } from "@/components/admin/admin-dashboard-shell";
import { RecordManualPaymentForm } from "@/app/admin/components/admin-action-form";
import { requireAdmin } from "@/features/admin/lib/authorization";

type PaymentScheduleItem = {
  id: string;
  financing_terms_id: string;
  installment_number: number;
  due_date: string;
  amount_due: number;
  amount_paid: number;
  status: string;
};

type OwnershipPlan = {
  id: string;
  application_id: string;
  status: string;
  accepted_at: string | null;
  activated_at: string | null;
  created_at: string;
};

type Application = {
  id: string;
  user_id: string;
  vehicle_id: string;
  status: string;
};

type Profile = {
  user_id: string;
  full_name: string | null;
};

type Vehicle = {
  id: string;
  brand: string;
  model: string;
  year: number | null;
};

type FinancingTerm = {
  id: string;
  plan_id: string;
  currency: string;
  down_payment: number;
  monthly_payment: number;
};

type RecordedPayment = {
  plan_id: string;
  amount: number | null;
  payment_type: string;
  payment_status: string;
};

export default async function AdminPaymentsPage() {
  const { supabase, user, isAdmin } = await requireAdmin();

  if (!user) redirect("/login");
  if (!isAdmin) redirect("/dashboard");

  /*
   * Load ownership plans.
   */
  const { data: plans, error: plansError } = await supabase
    .from("ownership_plans")
    .select("id, application_id, status, accepted_at, activated_at, created_at")
    .order("created_at", { ascending: false })
    .limit(200);

  if (plansError) {
    console.error("ADMIN PAYMENTS PLANS LOAD ERROR", plansError);

    return (
      <AdminDashboardShell
        title="Payments"
        subtitle="Record and review confirmed customer payments."
      >
        <div className="bg-card rounded-3xl border p-6">
          <h2 className="text-lg font-semibold">Payments unavailable</h2>

          <p className="mt-2 text-sm text-muted-foreground">
            Aurora could not load ownership plans for payment operations.
          </p>
        </div>
      </AdminDashboardShell>
    );
  }

  const ownershipPlans = (plans ?? []) as OwnershipPlan[];

  if (ownershipPlans.length === 0) {
    return (
      <AdminDashboardShell
        title="Payments"
        subtitle="Record and review confirmed customer payments."
      >
        <div className="bg-card rounded-3xl border p-6">
          <h2 className="text-lg font-semibold">No ownership plans</h2>

          <p className="mt-2 text-sm text-muted-foreground">
            There are currently no ownership plans available for payment
            operations.
          </p>
        </div>
      </AdminDashboardShell>
    );
  }

  /*
   * Load applications attached to the ownership plans.
   */
  const applicationIds = ownershipPlans.map((plan) => plan.application_id);

  const { data: applications, error: applicationsError } = await supabase
    .from("applications")
    .select("id, user_id, vehicle_id, status")
    .in("id", applicationIds);

  if (applicationsError) {
    console.error("ADMIN PAYMENTS APPLICATIONS LOAD ERROR", applicationsError);

    return (
      <AdminDashboardShell
        title="Payments"
        subtitle="Record and review confirmed customer payments."
      >
        <div className="bg-card rounded-3xl border p-6">
          <h2 className="text-lg font-semibold">Payments unavailable</h2>

          <p className="mt-2 text-sm text-muted-foreground">
            Aurora could not load the applications connected to ownership plans.
          </p>
        </div>
      </AdminDashboardShell>
    );
  }

  const applicationRows = (applications ?? []) as Application[];

  /*
   * Load customer profiles.
   */
  const userIds = [
    ...new Set(
      applicationRows.map((application) => application.user_id).filter(Boolean),
    ),
  ];

  const { data: profiles, error: profilesError } = userIds.length
    ? await supabase
        .from("profiles")
        .select("user_id, full_name")
        .in("user_id", userIds)
    : { data: [], error: null };

  if (profilesError) {
    console.error("ADMIN PAYMENTS PROFILES LOAD ERROR", profilesError);
  }

  /*
   * Load vehicles.
   */
  const vehicleIds = [
    ...new Set(
      applicationRows
        .map((application) => application.vehicle_id)
        .filter(Boolean),
    ),
  ];

  const { data: vehicles, error: vehiclesError } = vehicleIds.length
    ? await supabase
        .from("vehicles")
        .select("id, brand, model, year")
        .in("id", vehicleIds)
    : { data: [], error: null };

  if (vehiclesError) {
    console.error("ADMIN PAYMENTS VEHICLES LOAD ERROR", vehiclesError);
  }

  /*
   * Load financing terms.
   */
  const planIds = ownershipPlans.map((plan) => plan.id);

  const { data: financingTerms, error: financingTermsError } = await supabase
    .from("financing_terms")
    .select("id, plan_id, currency, down_payment, monthly_payment")
    .in("plan_id", planIds);

  if (financingTermsError) {
    console.error(
      "ADMIN PAYMENTS FINANCING TERMS LOAD ERROR",
      financingTermsError,
    );

    return (
      <AdminDashboardShell
        title="Payments"
        subtitle="Record and review confirmed customer payments."
      >
        <div className="bg-card rounded-3xl border p-6">
          <h2 className="text-lg font-semibold">Payments unavailable</h2>

          <p className="mt-2 text-sm text-muted-foreground">
            Aurora could not load financing terms for the ownership plans.
          </p>
        </div>
      </AdminDashboardShell>
    );
  }

  const terms = (financingTerms ?? []) as FinancingTerm[];

  /*
   * Load payment schedules.
   */
  const financingIds = terms.map((term) => term.id);

  const { data: paymentSchedule, error: paymentScheduleError } =
    financingIds.length
      ? await supabase
          .from("payment_schedule")
          .select(
            "id, financing_terms_id, installment_number, due_date, amount_due, amount_paid, status",
          )
          .in("financing_terms_id", financingIds)
          .order("installment_number", { ascending: true })
      : { data: [], error: null };

  if (paymentScheduleError) {
    console.error("ADMIN PAYMENTS SCHEDULE LOAD ERROR", paymentScheduleError);
  }

  /*
   * Load completed manual payments.
   *
   * These records are the financial source of truth.
   * Customer messages are never used as payment proof.
   */
  const { data: recordedPayments, error: recordedPaymentsError } =
    await supabase
      .from("payments")
      .select("plan_id, amount, payment_type, payment_status")
      .in("plan_id", planIds)
      .eq("payment_status", "completed");

  if (recordedPaymentsError) {
    console.error(
      "ADMIN PAYMENTS RECORDED PAYMENTS LOAD ERROR",
      recordedPaymentsError,
    );
  }

  const profileMap = new Map(
    ((profiles ?? []) as Profile[]).map((profile) => [
      profile.user_id,
      profile,
    ]),
  );

  const applicationMap = new Map(
    applicationRows.map((application) => [application.id, application]),
  );

  const vehicleMap = new Map(
    ((vehicles ?? []) as Vehicle[]).map((vehicle) => [vehicle.id, vehicle]),
  );

  const termsByPlan = new Map<string, FinancingTerm>();

  for (const term of terms) {
    termsByPlan.set(term.plan_id, term);
  }

  const scheduleByFinancing = new Map<string, PaymentScheduleItem[]>();

  for (const item of (paymentSchedule ?? []) as PaymentScheduleItem[]) {
    const current = scheduleByFinancing.get(item.financing_terms_id) ?? [];

    current.push(item);
    scheduleByFinancing.set(item.financing_terms_id, current);
  }

  const recordedDownPayments = new Map<string, number>();

  for (const payment of (recordedPayments ?? []) as RecordedPayment[]) {
    if (payment.payment_type !== "down_payment") continue;

    recordedDownPayments.set(
      payment.plan_id,
      (recordedDownPayments.get(payment.plan_id) ?? 0) +
        Number(payment.amount ?? 0),
    );
  }

  const paymentRows = ownershipPlans.map((plan) => {
    const application = applicationMap.get(plan.application_id);

    const profile = application
      ? profileMap.get(application.user_id)
      : undefined;

    const vehicle = application
      ? vehicleMap.get(application.vehicle_id)
      : undefined;

    const financingTerm = termsByPlan.get(plan.id);

    const schedule = financingTerm?.id
      ? (scheduleByFinancing.get(financingTerm.id) ?? [])
      : [];

    const recordedDownPayment = recordedDownPayments.get(plan.id) ?? 0;

    const downPaymentRemaining = Math.max(
      0,
      Number(financingTerm?.down_payment ?? 0) - recordedDownPayment,
    );

    const totalScheduled = schedule.reduce(
      (total, item) => total + Number(item.amount_due ?? 0),
      0,
    );

    const totalPaidOnSchedule = schedule.reduce(
      (total, item) => total + Number(item.amount_paid ?? 0),
      0,
    );

    return {
      plan,
      application,
      profile,
      vehicle,
      financingTerm,
      schedule,
      downPaymentRemaining,
      totalScheduled,
      totalPaidOnSchedule,
    };
  });

  const activePlans = paymentRows.filter(
    ({ plan }) => plan.status === "active" || plan.status === "accepted",
  );

  const totalCompletedPayments = (
    (recordedPayments ?? []) as RecordedPayment[]
  ).reduce((total, payment) => total + Number(payment.amount ?? 0), 0);

  const totalOutstanding = paymentRows.reduce((total, row) => {
    const financingAmount = Number(row.financingTerm?.down_payment ?? 0);

    return (
      total +
      row.downPaymentRemaining +
      Math.max(0, row.totalScheduled - row.totalPaidOnSchedule)
    );
  }, 0);

  return (
    <AdminDashboardShell
      title="Payments"
      subtitle="Record and review confirmed customer payments."
    >
      <div className="space-y-6">
        <section className="grid gap-4 sm:grid-cols-3">
          <div className="bg-card rounded-3xl border p-6">
            <p className="text-sm text-muted-foreground">
              Active payment plans
            </p>

            <p className="mt-2 text-3xl font-semibold">{activePlans.length}</p>
          </div>

          <div className="bg-card rounded-3xl border p-6">
            <p className="text-sm text-muted-foreground">Completed payments</p>

            <p className="mt-2 text-3xl font-semibold">
              {totalCompletedPayments.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </p>
          </div>

          <div className="bg-card rounded-3xl border p-6">
            <p className="text-sm text-muted-foreground">Outstanding</p>

            <p className="mt-2 text-3xl font-semibold">
              {totalOutstanding.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </p>
          </div>
        </section>

        <section className="bg-card rounded-3xl border">
          <div className="border-b p-6">
            <h2 className="text-lg font-semibold">Payment operations</h2>

            <p className="mt-1 text-sm text-muted-foreground">
              Record payments only after an authorized operator has confirmed
              that funds were received outside Aurora.
            </p>
          </div>

          {paymentRows.length === 0 ? (
            <div className="p-6 text-sm text-muted-foreground">
              No ownership plans found.
            </div>
          ) : (
            <div className="divide-y">
              {paymentRows.map((row) => (
                <article key={row.plan.id} className="p-6">
                  <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-start">
                    <div>
                      <p className="font-semibold">
                        {row.profile?.full_name || "Customer"}
                      </p>

                      <div className="mt-1 flex flex-wrap items-center gap-3">
                        <p className="text-sm text-muted-foreground">
                          {row.vehicle
                            ? `${row.vehicle.brand} ${row.vehicle.model}${
                                row.vehicle.year ? ` · ${row.vehicle.year}` : ""
                              }`
                            : "Vehicle unavailable"}
                        </p>

                        <span className="rounded-full border px-3 py-1 text-xs capitalize">
                          {row.plan.status}
                        </span>
                      </div>

                      {row.application && (
                        <Link
                          href={`/admin/applications/${row.application.id}`}
                          className="mt-3 inline-flex text-sm font-medium underline underline-offset-4"
                        >
                          View application →
                        </Link>
                      )}
                    </div>

                    <div className="text-left lg:text-right">
                      <p className="text-sm text-muted-foreground">
                        Monthly payment
                      </p>

                      <p className="mt-1 text-lg font-semibold">
                        {row.financingTerm?.currency ?? "USD"}{" "}
                        {Number(
                          row.financingTerm?.monthly_payment ?? 0,
                        ).toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </p>
                    </div>
                  </div>

                  <div className="mt-6 grid gap-3 sm:grid-cols-3">
                    <div className="rounded-2xl border bg-background/40 p-4">
                      <p className="text-xs text-muted-foreground">
                        Down payment
                      </p>

                      <p className="mt-1 font-semibold">
                        {row.financingTerm?.currency ?? "USD"}{" "}
                        {Number(
                          row.financingTerm?.down_payment ?? 0,
                        ).toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </p>
                    </div>

                    <div className="rounded-2xl border bg-background/40 p-4">
                      <p className="text-xs text-muted-foreground">
                        Down payment remaining
                      </p>

                      <p className="mt-1 font-semibold">
                        {row.financingTerm?.currency ?? "USD"}{" "}
                        {row.downPaymentRemaining.toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </p>
                    </div>

                    <div className="rounded-2xl border bg-background/40 p-4">
                      <p className="text-xs text-muted-foreground">
                        Scheduled balance
                      </p>

                      <p className="mt-1 font-semibold">
                        {row.financingTerm?.currency ?? "USD"}{" "}
                        {Math.max(
                          0,
                          row.totalScheduled - row.totalPaidOnSchedule,
                        ).toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </p>
                    </div>
                  </div>

                  {row.plan.status === "active" ||
                  row.plan.status === "accepted" ? (
                    <RecordManualPaymentForm
                      planId={row.plan.id}
                      schedule={row.schedule}
                      currency={row.financingTerm?.currency ?? "USD"}
                      downPaymentRemaining={row.downPaymentRemaining}
                    />
                  ) : (
                    <div className="mt-4 rounded-2xl border bg-background/40 p-4 text-sm text-muted-foreground">
                      Payment recording becomes available when this ownership
                      plan is accepted or active.
                    </div>
                  )}
                </article>
              ))}
            </div>
          )}
        </section>

        <div className="rounded-2xl border border-border bg-background/40 p-4 text-xs text-muted-foreground">
          <strong className="font-medium text-foreground">
            Financial control:
          </strong>{" "}
          Only use manual payment recording after an authorized operator has
          independently confirmed the funds were received outside Aurora.
          Customer messages are not treated as proof of payment.
        </div>
      </div>
    </AdminDashboardShell>
  );
}
