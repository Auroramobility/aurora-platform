import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import { StatCard } from "@/components/dashboard/stat-card";

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
    .select("*")
    .eq("user_id", user.id)
    .single();

  const fields = [
    profile?.full_name,
    profile?.phone,
    profile?.country,
    profile?.state,
    profile?.address,
    profile?.city,
    profile?.postal_code,
    profile?.date_of_birth,
    profile?.employment_status,
    profile?.monthly_income,
    profile?.drivers_license,
    profile?.profile_photo_url,
  ];

  const completed = fields.filter(Boolean).length;
  const completion = Math.round((completed / fields.length) * 100);

  const firstName =
    profile?.full_name?.split(" ")[0] ?? user.email?.split("@")[0];

  return (
    <main className="min-h-screen bg-background p-8 text-foreground">
      <div className="mx-auto max-w-7xl space-y-8">
        <div>
          <h1 className="text-4xl font-bold">Welcome back, {firstName}</h1>

          <p className="mt-2 text-muted-foreground">
            Complete your profile to unlock financing.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          <StatCard
            title="Applications"
            value={0}
            subtitle="Active financing requests"
          />

          <StatCard
            title="Saved Vehicles"
            value={0}
            subtitle="Vehicles you're watching"
          />

          <StatCard
            title="Messages"
            value={0}
            subtitle="Unread conversations"
          />

          <StatCard
            title="Profile"
            value={`${completion}%`}
            subtitle="Completion"
          />
        </div>
      </div>
    </main>
  );
}
