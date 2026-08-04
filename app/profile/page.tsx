import { redirect } from "next/navigation";

import { Header } from "@/components/dashboard/header";
import { Sidebar } from "@/components/dashboard/sidebar";
import { ProfileForm } from "@/components/profile/profile-form";
import { ProfileHeader } from "@/components/profile/profile-header";
import { createClient } from "@/lib/supabase/server";

export default async function ProfilePage() {
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

        <div className="mx-auto max-w-5xl p-8">
          <ProfileHeader />
          <ProfileForm />
        </div>
      </main>
    </div>
  );
}
