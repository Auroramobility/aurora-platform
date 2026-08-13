import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { EmailSettingsForm } from "@/features/settings/components/email-settings-form";
import { PasswordSettingsForm } from "@/features/settings/components/password-settings-form";
import { DeactivateAccountCard } from "@/features/settings/components/deactivate-account-card";

export default async function SettingsPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  // Password change only makes sense for email/password accounts —
  // Google-authenticated accounts don't have an Aurora-managed password.
  const isEmailProvider = user.app_metadata?.provider === "email";

  return (
    <DashboardShell title="Settings" email={user.email ?? ""}>
      <div className="mx-auto max-w-2xl space-y-6">
        <EmailSettingsForm currentEmail={user.email ?? ""} />

        {isEmailProvider ? (
          <PasswordSettingsForm />
        ) : (
          <div className="rounded-xl border border-border bg-surface p-6 text-sm text-muted-foreground">
            You signed in with Google, so your password is managed by
            Google — there&apos;s nothing to change here.
          </div>
        )}

        <DeactivateAccountCard />
      </div>
    </DashboardShell>
  );
}
