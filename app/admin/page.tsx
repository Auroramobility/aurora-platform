import { redirect } from "next/navigation";
import Link from "next/link";

import { requireAdmin } from "@/features/admin/lib/authorization";
import {
  ApplicationReviewForm,
  CreatePlanForm,
  IdentityReviewForm,
  PreparePlanForm,
  ActivatePlanForm,
  RecordManualPaymentForm,
} from "./components/admin-action-form";
import { getApplicationStatusConfig } from "@/features/applications/types/status";

type PaymentScheduleItem = {
  id: string;
  financing_terms_id: string;
  installment_number: number;
  due_date: string;
  amount_due: number;
  amount_paid: number;
  status: string;
};

type FinancingTerm = {
  id: string;
  plan_id: string;
  currency: string;
  down_payment: number;
  monthly_payment: number;
};

export default async function AdminPage() {
  const { supabase, user, isAdmin } = await requireAdmin();

  if (!user) redirect("/login");
  if (!isAdmin) redirect("/dashboard");

  /*
   * IMPORTANT:
   *
   * financing_terms.plan_id -> ownership_plans.id
   *
   * There is no direct ownership_plans -> financing_terms
   * relationship exposed to PostgREST, so we load the two
   * tables separately and join them in application code.
   *
   * PAGINATION NOTE: the two operational queues below (pending
   * applications, identity verification) are filtered at the database
   * level so they stay accurate and bounded regardless of how large the
   * underlying tables grow. The "All applications" / "All plans" browse
   * tables further down this page are capped at RECENT_LIMIT as a
   * stopgap against unbounded growth — this is not full pagination
   * (older records beyond the cap won't appear here). A proper
   * paginated/searchable table is the right follow-up once volume
   * actually warrants it.
   */
  const RECENT_LIMIT = 200;
  const QUEUE_LIMIT = 100;

  const [
    applicationsResult,
    profilesResult,
    plansResult,
    pendingApplicationsResult,
    identityQueueResult,
  ] = await Promise.all([
    supabase
      .from("applications")
      .select(
        "id, user_id, vehicle_id, status, application_date, reviewed_at, rejection_reason",
      )
      .order("application_date", { ascending: false })
      .limit(RECENT_LIMIT),

    supabase
      .from("profiles")
      .select(
        "user_id, full_name, identity_verified, identity_verified_at, drivers_license_front, drivers_license_back",
      )
      .order("updated_at", { ascending: false })
      .limit(RECENT_LIMIT),

    supabase
      .from("ownership_plans")
      .select("id, application_id, status, accepted_at, activated_at, created_at")
      .order("created_at", { ascending: false })
      .limit(RECENT_LIMIT),

    supabase
      .from("applications")
      .select(
        "id, user_id, vehicle_id, status, application_date, reviewed_at, rejection_reason",
      )
      .in("status", ["pending", "reviewing"])
      .order("application_date", { ascending: false })
      .limit(QUEUE_LIMIT),

    supabase
      .from("profiles")
      .select(
        "user_id, full_name, identity_verified, identity_verified_at, drivers_license_front, drivers_license_back",
      )
      .eq("identity_verified", false)
      .or("drivers_license_front.not.is.null,drivers_license_back.not.is.null")
      .order("updated_at", { ascending: false })
      .limit(QUEUE_LIMIT),
  ]);

  if (
    applicationsResult.error ||
    profilesResult.error ||
    plansResult.error ||
    pendingApplicationsResult.error ||
    identityQueueResult.error
  ) {
    console.error("ADMIN DATA LOAD ERROR", {
      applications: applicationsResult.error
        ? {
            message: applicationsResult.error.message,
            code: applicationsResult.error.code,
            details: applicationsResult.error.details,
            hint: applicationsResult.error.hint,
          }
        : null,

      profiles: profilesResult.error
        ? {
            message: profilesResult.error.message,
            code: profilesResult.error.code,
            details: profilesResult.error.details,
            hint: profilesResult.error.hint,
          }
        : null,

      ownershipPlans: plansResult.error
        ? {
            message: plansResult.error.message,
            code: plansResult.error.code,
            details: plansResult.error.details,
            hint: plansResult.error.hint,
          }
        : null,

      pendingApplications: pendingApplicationsResult.error
        ? {
            message: pendingApplicationsResult.error.message,
            code: pendingApplicationsResult.error.code,
          }
        : null,

      identityQueue: identityQueueResult.error
        ? {
            message: identityQueueResult.error.message,
            code: identityQueueResult.error.code,
          }
        : null,
    });

    return (
      <main className="mx-auto max-w-5xl p-6">
        <h1 className="text-2xl font-semibold">
          Operations unavailable
        </h1>

        <p className="mt-2 text-muted-foreground">
          Aurora could not load the operations workspace.
        </p>
      </main>
    );
  }

  const applications = applicationsResult.data ?? [];
  const profiles = profilesResult.data ?? [];
  const plans = plansResult.data ?? [];

  /*
   * Load vehicles used by applications.
   */
  const vehicleIds = [
    ...new Set(
      applications
        .map((application) => application.vehicle_id)
        .filter(Boolean),
    ),
  ];

  const { data: vehicles, error: vehiclesError } = vehicleIds.length
    ? await supabase
        .from("vehicles")
        .select("id, brand, model, year, price")
        .in("id", vehicleIds)
    : { data: [], error: null };

  if (vehiclesError) {
    console.error("ADMIN VEHICLE LOAD ERROR", vehiclesError);
  }

  const vehicleMap = new Map(
    (vehicles ?? []).map((vehicle) => [vehicle.id, vehicle]),
  );

  /*
   * Load financing terms separately.
   *
   * financing_terms.plan_id references ownership_plans.id.
   */
  const planIds = plans.map((plan) => plan.id);

  const { data: financingTerms, error: financingTermsError } =
    planIds.length
      ? await supabase
          .from("financing_terms")
          .select(
            "id, plan_id, currency, down_payment, monthly_payment",
          )
          .in("plan_id", planIds)
      : { data: [], error: null };

  if (financingTermsError) {
    console.error(
      "ADMIN FINANCING TERMS LOAD ERROR",
      financingTermsError,
    );
  }

  const termsByPlan = new Map<string, FinancingTerm>();

  for (const term of (financingTerms ?? []) as FinancingTerm[]) {
    termsByPlan.set(term.plan_id, term);
  }

  /*
   * Load payment schedules using financing_terms.id.
   */
  const financingIds = (financingTerms ?? [])
    .map((term) => term.id)
    .filter(Boolean);

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
    console.error(
      "ADMIN PAYMENT SCHEDULE LOAD ERROR",
      paymentScheduleError,
    );
  }

  const scheduleByFinancing = new Map<
    string,
    PaymentScheduleItem[]
  >();

  for (const item of (paymentSchedule ?? []) as PaymentScheduleItem[]) {
    const current =
      scheduleByFinancing.get(item.financing_terms_id) ?? [];

    current.push(item);

    scheduleByFinancing.set(item.financing_terms_id, current);
  }

  /*
   * Load completed manual payments.
   */
  const { data: recordedPayments, error: recordedPaymentsError } =
    planIds.length
      ? await supabase
          .from("payments")
          .select("plan_id, amount, payment_type, payment_status")
          .in("plan_id", planIds)
          .eq("payment_status", "completed")
      : { data: [], error: null };

  if (recordedPaymentsError) {
    console.error(
      "ADMIN PAYMENTS LOAD ERROR",
      recordedPaymentsError,
    );
  }

  const recordedDownPayments = new Map<string, number>();

  for (const payment of recordedPayments ?? []) {
    if (payment.payment_type !== "down_payment") continue;

    recordedDownPayments.set(
      payment.plan_id,
      (recordedDownPayments.get(payment.plan_id) ?? 0) +
        Number(payment.amount ?? 0),
    );
  }

  /*
   * Build lookup maps.
   */
  const profileMap = new Map(
    profiles.map((profile) => [profile.user_id, profile]),
  );

  const applicationMap = new Map(
    applications.map((application) => [application.id, application]),
  );

  const planByApplication = new Map(
    plans.map((plan) => [plan.application_id, plan]),
  );

  /*
   * Admin queues. These come from their own targeted, DB-filtered
   * queries (see above) — not from filtering the general applications/
   * profiles arrays, which are capped at RECENT_LIMIT and would silently
   * drop older queue items once the tables grow past that cap.
   */
  const pendingApplications = pendingApplicationsResult.data ?? [];

  const identityQueue = identityQueueResult.data ?? [];

  const approvedWithoutPlan = applications.filter(
    (application) =>
      application.status === "approved" &&
      !planByApplication.has(application.id),
  );

  /*
   * Render Operations Console.
   */
  return (
    <main className="mx-auto max-w-7xl space-y-8 p-6">
      <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
        <div>
          <p className="text-sm font-medium text-muted-foreground">
            Admin Console
          </p>

          <h1 className="mt-1 text-3xl font-semibold">
            Aurora Operations
          </h1>

          <p className="mt-2 max-w-3xl text-muted-foreground">
            Review applications, verify identities, move approved
            ownership plans through trusted operational states, and
            communicate with customers.
          </p>
        </div>

        <Link
          href="/admin/messages"
          className="inline-flex items-center justify-center rounded-xl border px-4 py-2 text-sm font-medium"
        >
          Open customer messages
        </Link>
      </header>

      <section className="grid gap-4 sm:grid-cols-3">
        {[
          ["Review queue", pendingApplications.length],
          ["Identity queue", identityQueue.length],
          ["Plans to prepare", approvedWithoutPlan.length],
        ].map(([label, value]) => (
          <div
            key={String(label)}
            className="rounded-3xl border bg-card p-6"
          >
            <p className="text-sm text-muted-foreground">
              {label}
            </p>

            <p className="mt-2 text-3xl font-semibold">
              {value}
            </p>
          </div>
        ))}
      </section>

      <section className="space-y-4">
        <div>
          <h2 className="text-2xl font-semibold">
            Application review
          </h2>

          <p className="text-sm text-muted-foreground">
            Move applications through the trusted review states.
          </p>
        </div>

        {pendingApplications.length === 0 ? (
          <div className="rounded-3xl border bg-card p-6 text-sm text-muted-foreground">
            No applications are waiting for review.
          </div>
        ) : (
          pendingApplications.map((application) => {
            const vehicle = vehicleMap.get(
              application.vehicle_id,
            );

            const profile = profileMap.get(
              application.user_id,
            );

            return (
              <article
                key={application.id}
                className="rounded-3xl border bg-card p-6"
              >
                <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-start">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      {profile?.full_name || "Customer"}
                    </p>

                    <h3 className="mt-1 text-xl font-semibold">
                      {vehicle
                        ? `${vehicle.brand} ${vehicle.model}${
                            vehicle.year
                              ? ` · ${vehicle.year}`
                              : ""
                          }`
                        : "Vehicle unavailable"}
                    </h3>
                    <Link
  href={`/admin/applications/${application.id}`}
  className="mt-3 inline-flex text-sm font-medium underline underline-offset-4"
>
  View full application →
</Link>

                    <p className="mt-1 text-sm text-muted-foreground">
                      Submitted{" "}
                      {application.application_date
                        ? new Date(
                            application.application_date,
                          ).toLocaleString()
                        : "—"}
                    </p>
                  </div>

                  <span className="rounded-full border px-3 py-1 text-sm">
                    {
                      getApplicationStatusConfig(
                        application.status as
                          | "pending"
                          | "reviewing",
                      ).label
                    }
                  </span>
                </div>

                <div className="mt-6">
                  <ApplicationReviewForm
                    applicationId={application.id}
                    status={application.status}
                  />
                </div>
              </article>
            );
          })
        )}
      </section>
            <section className="space-y-4">
        <div>
          <h2 className="text-2xl font-semibold">
            All applications
          </h2>

          <p className="text-sm text-muted-foreground">
            The {RECENT_LIMIT} most recent customer applications, regardless
            of status. Use the review and identity queues above for items
            needing action.
          </p>
        </div>

        {applications.length === 0 ? (
          <div className="rounded-3xl border bg-card p-6 text-sm text-muted-foreground">
            No applications found.
          </div>
        ) : (
          <div className="space-y-3">
            {applications.map((application) => {
              const profile = profileMap.get(application.user_id);
              const vehicle = vehicleMap.get(application.vehicle_id);

              return (
                <article
                  key={application.id}
                  className="rounded-3xl border bg-card p-5"
                >
                  <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                    <div>
                      <p className="font-semibold">
                        {profile?.full_name || "Customer"}
                      </p>

                      <p className="mt-1 text-sm text-muted-foreground">
                        {vehicle
                          ? `${vehicle.brand} ${vehicle.model}${
                              vehicle.year
                                ? ` · ${vehicle.year}`
                                : ""
                            }`
                          : "Vehicle unavailable"}
                      </p>

                      <p className="mt-1 text-xs text-muted-foreground">
                        {application.application_date
                          ? new Date(
                              application.application_date,
                            ).toLocaleString()
                          : "No submission date"}
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                      <span className="rounded-full border px-3 py-1 text-sm capitalize">
                        {application.status ?? "pending"}
                      </span>

                      <Link
                        href={`/admin/applications/${application.id}`}
                        className="inline-flex items-center rounded-xl border px-4 py-2 text-sm font-medium hover:bg-muted"
                      >
                        View application →
                      </Link>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>

      <section className="space-y-4">
        <div>
          <h2 className="text-2xl font-semibold">
            Identity verification
          </h2>

          <p className="text-sm text-muted-foreground">
            Uploaded documents are not considered verified until
            an authorized operator confirms them.
          </p>
        </div>

        {identityQueue.length === 0 ? (
          <div className="rounded-3xl border bg-card p-6 text-sm text-muted-foreground">
            No uploaded identities are waiting for verification.
          </div>
        ) : (
          identityQueue.map((profile) => (
            <article
              key={profile.user_id}
              className="flex flex-col justify-between gap-4 rounded-3xl border bg-card p-6 sm:flex-row sm:items-center"
            >
              <div>
                <p className="font-semibold">
                  {profile.full_name || "Unnamed customer"}
                </p>

                <p className="mt-1 text-sm text-muted-foreground">
                  Documents uploaded · verification pending
                </p>
              </div>

              <IdentityReviewForm
                userId={profile.user_id}
                verified={profile.identity_verified}
              />
            </article>
          ))
        )}
      </section>

      <section className="space-y-4">
        <div>
          <h2 className="text-2xl font-semibold">
            Ownership operations
          </h2>

          <p className="text-sm text-muted-foreground">
            Prepare plans for approved customers and activate
            accepted plans.
          </p>
        </div>

        {approvedWithoutPlan.length === 0 ? (
          <div className="rounded-3xl border bg-card p-6 text-sm text-muted-foreground">
            No approved applications are waiting for an ownership
            plan.
          </div>
        ) : (
          approvedWithoutPlan.map((application) => {
            const vehicle = vehicleMap.get(
              application.vehicle_id,
            );

            return (
              <article
                key={application.id}
                className="rounded-3xl border bg-card p-6"
              >
                <h3 className="font-semibold">
                  {vehicle
                    ? `${vehicle.brand} ${vehicle.model}`
                    : "Approved application"}
                </h3>

                <p className="mt-1 text-sm text-muted-foreground">
                  Create the first draft ownership plan for this
                  approved application.
                </p>

                <div className="mt-4">
                  <CreatePlanForm
                    applicationId={application.id}
                    vehiclePrice={vehicle?.price ?? null}
                  />
                </div>
              </article>
            );
          })
        )}

        {plans.map((plan) => {
          const application = applicationMap.get(
            plan.application_id,
          );

          const profile = application
            ? profileMap.get(application.user_id)
            : undefined;

          const terms = termsByPlan.get(plan.id);

          const planSchedule = terms?.id
            ? scheduleByFinancing.get(terms.id) ?? []
            : [];

          const recordedDownPayment =
            recordedDownPayments.get(plan.id) ?? 0;

          const downPaymentRemaining = Math.max(
            0,
            Number(terms?.down_payment ?? 0) -
              recordedDownPayment,
          );

          return (
            <article
              key={plan.id}
              className="rounded-3xl border bg-card p-6"
            >
              <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                <div>
                  <p className="font-semibold">
                    {profile?.full_name || "Customer"}
                  </p>

                  <p className="text-sm text-muted-foreground">
                    Plan status: {plan.status}
                  </p>
                </div>

                <div className="text-sm text-muted-foreground">
                  {terms?.currency ?? "USD"}{" "}
                  {Number(
                    terms?.monthly_payment ?? 0,
                  ).toLocaleString()}{" "}
                  / month
                </div>
              </div>

              <div className="mt-6 space-y-4">
                {plan.status === "draft" ? (
                  <PreparePlanForm planId={plan.id} />
                ) : null}

                {plan.status === "accepted" ? (
                  <ActivatePlanForm planId={plan.id} />
                ) : null}

                {plan.status === "active" ||
                plan.status === "accepted" ? (
                  <RecordManualPaymentForm
                    planId={plan.id}
                    schedule={planSchedule}
                    currency={terms?.currency ?? "USD"}
                    downPaymentRemaining={
                      downPaymentRemaining
                    }
                  />
                ) : null}
              </div>
            </article>
          );
        })}
      </section>
    </main>
  );
}
