"use server";

import { createClient } from "@/lib/supabase/server";

export type DeactivateAccountState = {
  error?: string;
};

export async function deactivateAccountAction(): Promise<DeactivateAccountState> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "You must be signed in." };
  }

  const { error } = await supabase
    .from("profiles")
    .update({ deactivated_at: new Date().toISOString() })
    .eq("user_id", user.id);

  if (error) {
    console.error("Account deactivation failed:", error.message);
    return {
      error: "Something went wrong deactivating your account. Please try again or contact support.",
    };
  }

  // Sign out immediately — the account is deactivated, this session
  // shouldn't continue. The deactivation check in lib/auth/login.ts and
  // app/auth/callback/route.ts prevents signing back in.
  await supabase.auth.signOut();

  return {};
}
