import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import { ProfileForm } from "@/components/profile/profile-form";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";

export default async function ProfilePage() {
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

  return (
    <DashboardShell
      title="Profile"
      email={user.email ?? ""}
      backHref="/dashboard"
      backLabel="Dashboard"
    >
      <div className="mx-auto max-w-3xl">
        <ProfileForm profile={profile} />
      </div>
    </DashboardShell>
  );
}
