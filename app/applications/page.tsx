import Link from "next/link";
import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import { getApplicationsForUser } from "@/features/applications/lib/get-applications";
import { getApplicationVehicle } from "@/features/applications/lib/get-application-vehicle";
import { getApplicationStatusConfig } from "@/features/applications/types/status";
import { Button } from "@/components/ui/button";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";

export default async function ApplicationsPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const applications = await getApplicationsForUser();

  const vehicles = await Promise.all(
    applications.map((application) =>
      getApplicationVehicle(application.vehicle_id),
    ),
  );

  return (
    <DashboardShell
      title="Application"
      email={user?.email ?? ""}
      backHref="/dashboard"
      backLabel="My Dashboard"
    >
      <p className="text-muted-foreground">
        Track every vehicle application and its ownership progress.
      </p>

      {applications.length === 0 ? (
        <div className="bg-card rounded-3xl border p-10 text-center">
          <h2 className="text-xl font-semibold">No applications yet</h2>

          <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
            Find an available vehicle and start your Aurora ownership journey.
          </p>

          <Button asChild className="mt-6">
            <Link href="/vehicles">Browse vehicles</Link>
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {applications.map((application, index) => {
            const vehicle = vehicles[index];

            return (
              <Link
                href={`/applications/${application.id}`}
                key={application.id}
                className="bg-card block rounded-3xl border p-6 transition hover:border-primary/40 hover:bg-muted/20"
              >
                <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                  <div>
                    <p className="text-sm text-muted-foreground">Application</p>

                    <h2 className="mt-1 text-xl font-semibold">
                      {vehicle
                        ? `${vehicle.brand} ${vehicle.model}`
                        : "Vehicle unavailable"}
                    </h2>

                    <p className="mt-1 text-sm text-muted-foreground">
                      Submitted{" "}
                      {application.application_date
                        ? new Date(
                            application.application_date,
                          ).toLocaleDateString()
                        : "—"}
                    </p>
                  </div>

                  <span className="rounded-full border px-3 py-1 text-sm">
                    {getApplicationStatusConfig(application.status).label}
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </DashboardShell>
  );
}
