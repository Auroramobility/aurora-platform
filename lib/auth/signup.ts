import { createClient } from "@/lib/supabase/server";

export async function signup(
  email: string,
  password: string,
  fullName: string,
) {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
      },
    },
  });

  if (error) {
    throw new Error(error.message);
  }

  return data.user;
}
