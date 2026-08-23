import Link from "next/link";
import { redirect } from "next/navigation";

import { AdminDashboardShell } from "@/components/admin/admin-dashboard-shell";
import { requireAdmin } from "@/features/admin/lib/authorization";
import { Button } from "@/components/ui/button";

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

export default async function AdminOwnershipPage() {
  const { supabase, user, isAdmin } = await requireAdmin();

  if (!user) redirect("/login");
  if (!isAdmin) redirect("/dashboard");

  const { data: plans, error: plansError } = await supabase
    .from("ownership_plans")
    .select("id, application_id, status, accepted_at, activated_at, created_at")
    .order("created_at", { ascending: false })
    .limit(200);

  if (plansError) {
    console.error("ADMIN OWNERSHIP PLANS LOAD ERROR", plansError);

    return (
      <AdminDashboardShell
        title="Ownership Plans"
        subtitle="Manage customer ownership plans and operational status."
      >
        <div className="bg-card rounded-3xl border p-6">
          <h2 className="text-lg font-semibold">Ownership plans unavailable</h2>

          <p className="mt-2 text-sm text-muted-foreground">
            Aurora could not load ownership plans.
          </p>
        </div>
      </AdminDashboardShell>
    );
  }

  const ownershipPlans = (plans ?? []) as OwnershipPlan[];

  const applicationIds = [
    ...new Set(
      ownershipPlans.map((plan) => plan.application_id).filter(Boolean),
    ),
  ];

  const { data: applications, error: applicationsError } = applicationIds.length
    ? await supabase
        .from("applications")
        .select("id, user_id, vehicle_id, status")
        .in("id", applicationIds)
    : { data: [], error: null };

  if (applicationsError) {
    console.error("ADMIN OWNERSHIP APPLICATIONS LOAD ERROR", applicationsError);
  }

  const applicationRows = (applications ?? []) as Application[];

  const userIds = [
    ...new Set(
      applicationRows.map((application) => application.user_id).filter(Boolean),
    ),
  ];

  const vehicleIds = [
    ...new Set(
      applicationRows
        .map((application) => application.vehicle_id)
        .filter(Boolean),
    ),
  ];

  const [profilesResult, vehiclesResult] = await Promise.all([
    userIds.length
      ? supabase
          .from("profiles")
          .select("user_id, full_name")
          .in("user_id", userIds)
      : { data: [], error: null },

    vehicleIds.length
      ? supabase
          .from("vehicles")
          .select("id, brand, model, year")
          .in("id", vehicleIds)
      : { data: [], error: null },
  ]);

  if (profilesResult.error) {
    console.error("ADMIN OWNERSHIP PROFILES LOAD ERROR", profilesResult.error);
  }

  if (vehiclesResult.error) {
    console.error("ADMIN OWNERSHIP VEHICLES LOAD ERROR", vehiclesResult.error);
  }

  const profileMap = new Map(
    ((profilesResult.data as Profile[] | null) ?? []).map((profile) => [
      profile.user_id,
      profile,
    ]),
  );

  const vehicleMap = new Map(
    ((vehiclesResult.data as Vehicle[] | null) ?? []).map((vehicle) => [
      vehicle.id,
      vehicle,
    ]),
  );

  const planIds = ownershipPlans.map((plan) => plan.id);

  const { data: financingTerms, error: financingTermsError } = planIds.length
    ? await supabase
        .from("financing_terms")
        .select("id, plan_id, currency, down_payment, monthly_payment")
        .in("plan_id", planIds)
    : { data: [], error: null };

  if (financingTermsError) {
    console.error(
      "ADMIN OWNERSHIP FINANCING TERMS LOAD ERROR",
      financingTermsError,
    );
  }

  const termsMap = new Map<string, FinancingTerm>();

  for (const term of (financingTerms ?? []) as FinancingTerm[]) {
    termsMap.set(term.plan_id, term);
  }

  const applicationMap = new Map(
    applicationRows.map((application) => [application.id, application]),
  );

  const draftCount = ownershipPlans.filter(
    (plan) => plan.status === "draft",
  ).length;

  const acceptedCount = ownershipPlans.filter(
    (plan) => plan.status === "accepted",
  ).length;

  const activeCount = ownershipPlans.filter(
    (plan) => plan.status === "active",
  ).length;

  const completedCount = ownershipPlans.filter(
    (plan) => plan.status === "completed",
  ).length;

  return (
    <AdminDashboardShell
      title="Ownership Plans"
      subtitle="Manage customer ownership plans and operational status."
    >
      <div className="mb-4">
        <Button asChild variant="outline">
          <Link href="/admin">← Back to admin</Link>
        </Button>
      </div>

      <div className="space-y-6">
        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
          <div className="bg-card rounded-3xl border p-6">
            <p className="text-sm text-muted-foreground">Total plans</p>

            <p className="mt-2 text-3xl font-semibold">
              {ownershipPlans.length}
            </p>
          </div>

          <div className="bg-card rounded-3xl border p-6">
            <p className="text-sm text-muted-foreground">Draft</p>

            <p className="mt-2 text-3xl font-semibold">{draftCount}</p>
          </div>

          <div className="bg-card rounded-3xl border p-6">
            <p className="text-sm text-muted-foreground">Accepted</p>

            <p className="mt-2 text-3xl font-semibold">{acceptedCount}</p>
          </div>

          <div className="bg-card rounded-3xl border p-6">
            <p className="text-sm text-muted-foreground">Active</p>

            <p className="mt-2 text-3xl font-semibold">{activeCount}</p>
          </div>

          <div className="bg-card rounded-3xl border p-6">
            <p className="text-sm text-muted-foreground">Completed</p>

            <p className="mt-2 text-3xl font-semibold">{completedCount}</p>
          </div>
        </section>

        <section className="bg-card rounded-3xl border">
          <div className="border-b p-6">
            <h2 className="text-lg font-semibold">Ownership plans</h2>

            <p className="mt-1 text-sm text-muted-foreground">
              Customer ownership plans currently recorded in Aurora.
            </p>
          </div>

          {ownershipPlans.length === 0 ? (
            <div className="p-6 text-sm text-muted-foreground">
              No ownership plans found.
            </div>
          ) : (
            <div className="divide-y">
              {ownershipPlans.map((plan) => {
                const application = applicationMap.get(plan.application_id);

                const profile = application
                  ? profileMap.get(application.user_id)
                  : undefined;

                const vehicle = application
                  ? vehicleMap.get(application.vehicle_id)
                  : undefined;

                const terms = termsMap.get(plan.id);

                return (
                  <article key={plan.id} className="p-6">
                    <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-center">
                      <div className="min-w-0">
                        <p className="font-semibold">
                          {profile?.full_name || "Unnamed customer"}
                        </p>

                        <p className="mt-1 text-sm text-muted-foreground">
                          {vehicle
                            ? `${vehicle.brand} ${vehicle.model}${
                                vehicle.year ? ` · ${vehicle.year}` : ""
                              }`
                            : "Vehicle unavailable"}
                        </p>

                        <div className="mt-3 flex flex-wrap items-center gap-2">
                          <span className="rounded-full border px-3 py-1 text-xs capitalize">
                            {plan.status}
                          </span>

                          {terms && (
                            <span className="rounded-full border px-3 py-1 text-xs">
                              {terms.currency}{" "}
                              {Number(terms.monthly_payment).toLocaleString()} /
                              month
                            </span>
                          )}
                        </div>

                        <p className="mt-2 text-xs text-muted-foreground">
                          Created{" "}
                          {plan.created_at
                            ? new Date(plan.created_at).toLocaleString()
                            : "—"}
                        </p>
                      </div>

                      <Link
                        href={`/admin/applications/${plan.application_id}`}
                        className="inline-flex shrink-0 items-center justify-center rounded-xl border px-4 py-2 text-sm font-medium transition-colors hover:bg-muted"
                      >
                        View application →
                      </Link>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </AdminDashboardShell>
  );
}
