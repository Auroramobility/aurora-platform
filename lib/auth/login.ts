import { createClient } from "@/lib/supabase/server";

export class AccountDeactivatedError extends Error {
  constructor() {
    super(
      "This account has been deactivated. Contact support if you'd like to reactivate it.",
    );
    this.name = "AccountDeactivatedError";
  }
}

export async function login(email: string, password: string) {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    console.error("Supabase auth error:", error);
    throw error;
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("deactivated_at")
    .eq("user_id", data.user.id)
    .single();

  if (profile?.deactivated_at) {
    await supabase.auth.signOut();
    throw new AccountDeactivatedError();
  }

  return data.user;
}
