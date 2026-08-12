import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import { ProfileForm } from "@/components/profile/profile-form";
import { BackButton } from "@/components/ui/back-button";

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
    <main className="mx-auto max-w-5xl space-y-6 p-8">
      <BackButton />

      <ProfileForm profile={profile} />
    </main>
  );
}