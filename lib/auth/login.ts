import { createClient } from "@/lib/supabase/server";

export async function login(email: string, password: string) {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  console.log("LOGIN RESULT:", {
    user: data.user?.email,
    session: !!data.session,
    error,
  });

  if (error) {
    throw new Error(error.message);
  }

  return data.user;
}
