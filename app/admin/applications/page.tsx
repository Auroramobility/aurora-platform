import Link from "next/link";
import { redirect } from "next/navigation";
import { DeleteApplicationButton } from "./delete-application-button";
import { AdminDashboardShell } from "@/components/admin/admin-dashboard-shell";
import { requireAdmin } from "@/features/admin/lib/authorization";

export default async function AdminApplicationsPage() {
  const { supabase, user, isAdmin } = await requireAdmin();

  if (!user) redirect("/login");
  if (!isAdmin) redirect("/dashboard");

  const { data: applications, error: applicationsError } = await supabase
    .from("applications")
    .select(
      "id, user_id, vehicle_id, status, application_date, reviewed_at, rejection_reason",
    )
    .order("application_date", { ascending: false })
    .limit(200);

  if (applicationsError) {
    console.error("ADMIN APPLICATIONS LOAD ERROR", applicationsError);

    return (
      <AdminDashboardShell
        title="Applications"
        subtitle="Review and manage customer vehicle applications."
      >
        <div className="bg-card rounded-3xl border p-6">
          <h2 className="text-lg font-semibold">Applications unavailable</h2>

          <p className="mt-2 text-sm text-muted-foreground">
            Aurora could not load customer applications.
          </p>
        </div>
      </AdminDashboardShell>
    );
  }

  const applicationRows = applications ?? [];

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
    console.error(
      "ADMIN APPLICATION PROFILES LOAD ERROR",
      profilesResult.error,
    );
  }

  if (vehiclesResult.error) {
    console.error(
      "ADMIN APPLICATION VEHICLES LOAD ERROR",
      vehiclesResult.error,
    );
  }

  const profileMap = new Map(
    (profilesResult.data ?? []).map((profile) => [profile.user_id, profile]),
  );

  const vehicleMap = new Map(
    (vehiclesResult.data ?? []).map((vehicle) => [vehicle.id, vehicle]),
  );

  const pendingCount = applicationRows.filter(
    (application) => application.status === "pending",
  ).length;

  const reviewingCount = applicationRows.filter(
    (application) => application.status === "reviewing",
  ).length;

  const approvedCount = applicationRows.filter(
    (application) => application.status === "approved",
  ).length;

  const rejectedCount = applicationRows.filter(
    (application) => application.status === "rejected",
  ).length;

  return (
    <AdminDashboardShell
      title="Applications"
      subtitle="Review and manage customer vehicle applications."
    >
      <div className="space-y-6">
        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
          <div className="bg-card rounded-3xl border p-6">
            <p className="text-sm text-muted-foreground">Total applications</p>

            <p className="mt-2 text-3xl font-semibold">
              {applicationRows.length}
            </p>
          </div>

          <div className="bg-card rounded-3xl border p-6">
            <p className="text-sm text-muted-foreground">Pending</p>

            <p className="mt-2 text-3xl font-semibold">{pendingCount}</p>
          </div>

          <div className="bg-card rounded-3xl border p-6">
            <p className="text-sm text-muted-foreground">Reviewing</p>

            <p className="mt-2 text-3xl font-semibold">{reviewingCount}</p>
          </div>

          <div className="bg-card rounded-3xl border p-6">
            <p className="text-sm text-muted-foreground">Approved</p>

            <p className="mt-2 text-3xl font-semibold">{approvedCount}</p>
          </div>

          <div className="bg-card rounded-3xl border p-6">
            <p className="text-sm text-muted-foreground">Rejected</p>

            <p className="mt-2 text-3xl font-semibold">{rejectedCount}</p>
          </div>
        </section>

        <section className="bg-card rounded-3xl border">
          <div className="border-b p-6">
            <h2 className="text-lg font-semibold">Customer applications</h2>

            <p className="mt-1 text-sm text-muted-foreground">
              The 200 most recent applications submitted through Aurora.
            </p>
          </div>

          {applicationRows.length === 0 ? (
            <div className="p-6 text-sm text-muted-foreground">
              No applications found.
            </div>
          ) : (
            <div className="divide-y">
              {applicationRows.map((application) => {
                const profile = profileMap.get(application.user_id);

                const vehicle = vehicleMap.get(application.vehicle_id);

                return (
                  <article key={application.id} className="p-6">
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

                      <p className="mt-1 text-xs text-muted-foreground">
                        Submitted{" "}
                        {application.application_date
                          ? new Date(
                              application.application_date,
                            ).toLocaleString()
                          : "No submission date"}
                      </p>

                      {application.reviewed_at && (
                        <p className="mt-1 text-xs text-muted-foreground">
                          Reviewed{" "}
                          {new Date(application.reviewed_at).toLocaleString()}
                        </p>
                      )}
                    </div>

                    <div className="flex shrink-0 flex-wrap items-center gap-3">
                      <span className="rounded-full border px-3 py-1 text-xs capitalize">
                        {application.status ?? "pending"}
                      </span>

                      <Link
                        href={`/admin/applications/${application.id}`}
                        className="inline-flex items-center rounded-xl border px-4 py-2 text-sm font-medium transition-colors hover:bg-muted"
                      >
                        View application →
                      </Link>

                      <DeleteApplicationButton
                        applicationId={application.id}
                        customerName={profile?.full_name || "this customer"}
                      />
                    </div>

                    {application.rejection_reason && (
                      <div className="border-destructive/20 bg-destructive/5 mt-4 rounded-2xl border p-4">
                        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                          Rejection reason
                        </p>

                        <p className="mt-1 text-sm">
                          {application.rejection_reason}
                        </p>
                      </div>
                    )}
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
