import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import { Sidebar } from "@/components/dashboard/sidebar";
import { Header } from "@/components/dashboard/header";
import { StatCard } from "@/components/dashboard/stat-card";
import { QuickActions } from "@/components/dashboard/quick-actions";

export default async function DashboardPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />

      <main className="flex-1">
        <Header email={user.email ?? "User"} />

        <div className="grid gap-6 p-8 md:grid-cols-2 xl:grid-cols-4">
          <StatCard
            title="Profile Completion"
            value="25%"
            description="Finish your profile to unlock all features."
          />

          <StatCard
            title="Applications"
            value="0"
            description="No financing applications yet."
          />

          <StatCard
            title="Saved Vehicles"
            value="0"
            description="Start browsing electric vehicles."
          />

          <StatCard
            title="Account Status"
            value="Active"
            description="Your account is verified."
          />
        </div>

        <div className="px-8 pb-8">
          <QuickActions />
        </div>
      </main>
    </div>
  );
}
