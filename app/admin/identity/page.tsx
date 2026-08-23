import Link from "next/link";
import { redirect } from "next/navigation";

import { AdminDashboardShell } from "@/components/admin/admin-dashboard-shell";
import { requireAdmin } from "@/features/admin/lib/authorization";

export default async function AdminIdentityPage() {
  const { supabase, user, isAdmin } = await requireAdmin();

  if (!user) redirect("/login");
  if (!isAdmin) redirect("/dashboard");

  const { data: profiles, error } = await supabase
    .from("profiles")
    .select(
      "user_id, full_name, identity_verified, identity_verified_at, drivers_license_front, drivers_license_back, updated_at",
    )
    .or("drivers_license_front.not.is.null,drivers_license_back.not.is.null")
    .order("updated_at", { ascending: false })
    .limit(200);

  if (error) {
    console.error("ADMIN IDENTITY LOAD ERROR", error);

    return (
      <AdminDashboardShell
        title="Identity Verification"
        subtitle="Review customer identity documents and verification status."
      >
        <div className="bg-card rounded-3xl border p-6">
          <h2 className="text-lg font-semibold">
            Identity verification unavailable
          </h2>

          <p className="mt-2 text-sm text-muted-foreground">
            Aurora could not load identity records.
          </p>
        </div>
      </AdminDashboardShell>
    );
  }

  const identityRecords = profiles ?? [];

  const pendingCount = identityRecords.filter(
    (profile) => !profile.identity_verified,
  ).length;

  const verifiedCount = identityRecords.filter(
    (profile) => profile.identity_verified,
  ).length;

  const documentsCompleteCount = identityRecords.filter(
    (profile) =>
      Boolean(profile.drivers_license_front) &&
      Boolean(profile.drivers_license_back),
  ).length;

  return (
    <AdminDashboardShell
      title="Identity Verification"
      subtitle="Review customer identity documents and verification status."
    >
      <div className="space-y-6">
        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <div className="bg-card rounded-3xl border p-6">
            <p className="text-sm text-muted-foreground">Identity records</p>

            <p className="mt-2 text-3xl font-semibold">
              {identityRecords.length}
            </p>
          </div>

          <div className="bg-card rounded-3xl border p-6">
            <p className="text-sm text-muted-foreground">
              Pending verification
            </p>

            <p className="mt-2 text-3xl font-semibold">{pendingCount}</p>
          </div>

          <div className="bg-card rounded-3xl border p-6">
            <p className="text-sm text-muted-foreground">Verified</p>

            <p className="mt-2 text-3xl font-semibold">{verifiedCount}</p>
          </div>

          <div className="bg-card rounded-3xl border p-6">
            <p className="text-sm text-muted-foreground">Complete documents</p>

            <p className="mt-2 text-3xl font-semibold">
              {documentsCompleteCount}
            </p>
          </div>
        </section>

        <section className="bg-card rounded-3xl border">
          <div className="border-b p-6">
            <h2 className="text-lg font-semibold">Identity records</h2>

            <p className="mt-1 text-sm text-muted-foreground">
              Customers who have submitted at least one identity document.
            </p>
          </div>

          {identityRecords.length === 0 ? (
            <div className="p-6 text-sm text-muted-foreground">
              No uploaded identity documents found.
            </div>
          ) : (
            <div className="divide-y">
              {identityRecords.map((profile) => {
                const hasFront = Boolean(profile.drivers_license_front);

                const hasBack = Boolean(profile.drivers_license_back);

                return (
                  <article key={profile.user_id} className="p-6">
                    <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-center">
                      <div className="min-w-0">
                        <p className="font-semibold">
                          {profile.full_name || "Unnamed customer"}
                        </p>

                        <div className="mt-2 flex flex-wrap gap-2">
                          <span className="rounded-full border px-3 py-1 text-xs">
                            {profile.identity_verified
                              ? "Identity verified"
                              : "Verification pending"}
                          </span>

                          <span className="rounded-full border px-3 py-1 text-xs">
                            License front: {hasFront ? "Uploaded" : "Missing"}
                          </span>

                          <span className="rounded-full border px-3 py-1 text-xs">
                            License back: {hasBack ? "Uploaded" : "Missing"}
                          </span>
                        </div>

                        {profile.identity_verified_at && (
                          <p className="mt-2 text-xs text-muted-foreground">
                            Verified{" "}
                            {new Date(
                              profile.identity_verified_at,
                            ).toLocaleString()}
                          </p>
                        )}

                        <p className="mt-1 text-xs text-muted-foreground">
                          Updated{" "}
                          {profile.updated_at
                            ? new Date(profile.updated_at).toLocaleString()
                            : "—"}
                        </p>
                      </div>

                      <Link
                        href={`/admin/identity/${profile.user_id}`}
                        className="inline-flex shrink-0 items-center justify-center rounded-xl border px-4 py-2 text-sm font-medium transition-colors hover:bg-muted"
                      >
                        Review identity →
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
