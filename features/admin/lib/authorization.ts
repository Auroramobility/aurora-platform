import { createClient } from "@/lib/supabase/server";

export async function requireAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { supabase, user: null, isAdmin: false } as const;
  }

  const { data, error } = await supabase.rpc("is_admin");

  return {
    supabase,
    user,
    isAdmin: !error && data === true,
  } as const;
}
