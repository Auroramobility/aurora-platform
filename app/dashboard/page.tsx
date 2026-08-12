import { redirect } from "next/navigation";
import { getOwnershipJourneyForUser } from "@/features/applications/lib/get-ownership-journey";
import { createClient } from "@/lib/supabase/server";
import { Navigation } from "@/components/dashboard/navigation";
import { StatCard } from "@/components/dashboard/stat-card";
import { Topbar } from "@/components/dashboard/topbar";
import { QuickActions } from "@/components/dashboard/quick-actions";
import { WelcomeHero } from "@/components/dashboard/home/welcome-hero";
import { OwnershipJourney } from "@/components/dashboard/home/ownership-journey";

export default async function DashboardPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, phone, country, state, address, city, postal_code, date_of_birth, employment_status, monthly_income, drivers_license, profile_photo_url")
    .eq("user_id", user.id)
    .maybeSingle();

  const journey = await getOwnershipJourneyForUser();

  const p = profile;
  const [applicationsResult, savedVehiclesResult, messagesResult] = await Promise.all([
    supabase.from("applications").select("id", { count: "exact", head: true }).eq("user_id", user.id),
    supabase.from("saved_vehicles").select("id", { count: "exact", head: true }).eq("user_id", user.id),
    supabase.from("messages").select("id", { count: "exact", head: true }).eq("sender_role", "admin").is("customer_read_at", null),
  ]);


  const fields = [
    p?.full_name,
    p?.phone,
    p?.country,
    p?.state,
    p?.address,
    p?.city,
    p?.postal_code,
    p?.date_of_birth,
    p?.employment_status,
    p?.monthly_income,
    p?.drivers_license,
    p?.profile_photo_url,
  ];

  const completed = fields.filter(Boolean).length;
  const completion = Math.round((completed / fields.length) * 100);

  const firstName =
    p?.full_name?.split(" ")[0] ?? user.email?.split("@")[0] ?? "";

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="grid min-h-screen grid-cols-[260px_1fr]">
        <aside className="border-r border-border bg-surface p-6">
          <h1 className="mb-10 text-2xl font-bold">Aurora Mobility</h1>

          <Navigation />
        </aside>

        <div>
          <Topbar email={user.email ?? ""} />

<main className="space-y-8 p-8">

  <WelcomeHero firstName={firstName} />

            <OwnershipJourney state={journey} />

            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
              <StatCard
                title="Applications"
                value={applicationsResult.count ?? 0}
                subtitle="Applications submitted"
              />

              <StatCard
                title="Saved Vehicles"
                value={savedVehiclesResult.count ?? 0}
                subtitle="Vehicles you're watching"
              />

              <StatCard
                title="Messages"
                value={messagesResult.count ?? 0}
                subtitle="Messages"
              />

              <StatCard
                title="Profile"
                value={`${completion}%`}
                subtitle="Completion"
              />
            </div>

            <QuickActions />
          </main>
        </div>
      </div>
    </div>
  );
}
