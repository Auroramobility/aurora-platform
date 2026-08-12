import { createClient } from "@/lib/supabase/server";

export async function signup(
  email: string,
  password: string,
  fullName: string,
) {
  const supabase = await createClient();

  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
      },
      emailRedirectTo: `${siteUrl}/auth/callback`,
    },
  });

  if (error) {
    throw new Error(error.message);
  }

  return data.user;
}