import Link from "next/link";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/features/admin/lib/authorization";
import { AdminDashboardShell } from "@/components/admin/admin-dashboard-shell";

export default async function AdminCustomersPage() {
  const { supabase, user, isAdmin } = await requireAdmin();

  if (!user) redirect("/login");
  if (!isAdmin) redirect("/dashboard");

  const { data: profiles, error } = await supabase
    .from("profiles")
    .select(
      "user_id, full_name, phone, country, state, city, identity_verified, updated_at",
    )
    .order("updated_at", { ascending: false })
    .limit(200);

  if (error) {
    console.error("ADMIN CUSTOMERS LOAD ERROR", error);

    return (
      <AdminDashboardShell
        title="Customers"
        subtitle="Manage Aurora customers and review their account status."
      >
        <div className="bg-card rounded-3xl border p-6">
          <h2 className="text-lg font-semibold">Customers unavailable</h2>

          <p className="mt-2 text-sm text-muted-foreground">
            Aurora could not load customer records.
          </p>
        </div>
      </AdminDashboardShell>
    );
  }

  const customers = profiles ?? [];

  return (
    <AdminDashboardShell
      title="Customers"
      subtitle="Manage Aurora customers and review their account status."
    >
      <div className="space-y-6">
        <section className="grid gap-4 sm:grid-cols-3">
          <div className="bg-card rounded-3xl border p-6">
            <p className="text-sm text-muted-foreground">Total customers</p>

            <p className="mt-2 text-3xl font-semibold">{customers.length}</p>
          </div>

          <div className="bg-card rounded-3xl border p-6">
            <p className="text-sm text-muted-foreground">Verified identities</p>

            <p className="mt-2 text-3xl font-semibold">
              {
                customers.filter((customer) => customer.identity_verified)
                  .length
              }
            </p>
          </div>

          <div className="bg-card rounded-3xl border p-6">
            <p className="text-sm text-muted-foreground">Pending identity</p>

            <p className="mt-2 text-3xl font-semibold">
              {
                customers.filter((customer) => !customer.identity_verified)
                  .length
              }
            </p>
          </div>
        </section>

        <section className="bg-card rounded-3xl border">
          <div className="border-b p-6">
            <h2 className="text-lg font-semibold">Customer accounts</h2>

            <p className="mt-1 text-sm text-muted-foreground">
              The most recently updated customer profiles.
            </p>
          </div>

          {customers.length === 0 ? (
            <div className="p-6 text-sm text-muted-foreground">
              No customers found.
            </div>
          ) : (
            <div className="divide-y">
              {customers.map((customer) => (
                <div
                  key={customer.user_id}
                  className="flex flex-col justify-between gap-4 p-6 sm:flex-row sm:items-center"
                >
                  <div className="min-w-0">
                    <p className="font-semibold">
                      {customer.full_name || "Unnamed customer"}
                    </p>

                    <p className="mt-1 text-sm text-muted-foreground">
                      {[customer.city, customer.state, customer.country]
                        .filter(Boolean)
                        .join(", ") || "Location not provided"}
                    </p>

                    {customer.phone && (
                      <p className="mt-1 text-xs text-muted-foreground">
                        {customer.phone}
                      </p>
                    )}
                  </div>

                  <div className="flex shrink-0 items-center gap-3">
                    <span className="rounded-full border px-3 py-1 text-xs">
                      {customer.identity_verified
                        ? "Identity verified"
                        : "Identity pending"}
                    </span>

                    <Link
                      href={`/admin/identity/${customer.user_id}`}
                      className="inline-flex items-center rounded-xl border px-4 py-2 text-sm font-medium transition-colors hover:bg-muted"
                    >
                      View customer →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </AdminDashboardShell>
  );
}
