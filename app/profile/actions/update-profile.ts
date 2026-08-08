"use server";

import type { Database } from "@/types/supabase";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

type ProfileUpdate = Database["public"]["Tables"]["profiles"]["Update"];

export async function updateProfile(formData: FormData) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  const updates: ProfileUpdate = {
    full_name: formData.get("full_name") as string,
    phone: formData.get("phone") as string,
    country: formData.get("country") as string,
    state: formData.get("state") as string,
    address: formData.get("address") as string,
    city: formData.get("city") as string,
    postal_code: formData.get("postal_code") as string,
    employment_status: formData.get("employment_status") as string,
    monthly_income: formData.get("monthly_income")
      ? Number(formData.get("monthly_income"))
      : null,
    currency: (formData.get("currency") as string) || null,
    preferred_language: (formData.get("preferred_language") as string) || null,
    timezone: (formData.get("timezone") as string) || null,
    drivers_license: formData.get("drivers_license") as string,
  };

  const { error } = await supabase
    .from("profiles")
    .update(updates)
    .eq("user_id", user.id);

  if (error) {
    throw error;
  }

  revalidatePath("/profile");
  revalidatePath("/dashboard");
}
