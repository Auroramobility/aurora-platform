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
  });

  if (error) {
    throw new Error(error.message);
  }

  if (!data.user) {
    throw new Error("Unable to create user");
  }

  const { error: profileError } = await supabase.from("profiles").insert({
    user_id: data.user.id,
    full_name: fullName,
  });

  if (profileError) {
    throw new Error(profileError.message);
  }

  return data.user;
}
