"use server";

import { revalidatePath } from "next/cache";

import { createClient } from "@/lib/supabase/server";

export async function updateProfile(formData: FormData) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  const textValue = (name: string) => {
    const value = formData.get(name);

    if (typeof value !== "string") {
      return null;
    }

    const trimmed = value.trim();

    return trimmed.length > 0 ? trimmed : null;
  };

  const monthlyIncomeValue = formData.get("monthly_income");

  const monthlyIncome =
    typeof monthlyIncomeValue === "string" &&
    monthlyIncomeValue.trim().length > 0
      ? Number(monthlyIncomeValue)
      : null;

  const updates = {
    user_id: user.id,

    full_name: textValue("full_name"),
    phone: textValue("phone"),
    country: textValue("country"),
    state: textValue("state"),
    address: textValue("address"),
    city: textValue("city"),
    postal_code: textValue("postal_code"),

    date_of_birth: textValue("date_of_birth"),

    employment_status: textValue("employment_status"),

    monthly_income:
      monthlyIncome !== null && Number.isFinite(monthlyIncome)
        ? monthlyIncome
        : null,

    currency: textValue("currency"),
    preferred_language: textValue("preferred_language"),
    timezone: textValue("timezone"),

    drivers_license: textValue("drivers_license"),
  };

  /*
   * Use upsert instead of relying on UPDATE alone.
   *
   * This makes the profile save work whether the customer already
   * has a profile row or the row is missing.
   */
  const { error } = await supabase.from("profiles").upsert(updates, {
    onConflict: "user_id",
  });

  if (error) {
    console.error("[updateProfile] Profile save error:", error);

    throw new Error("Your profile could not be saved.");
  }

  /*
   * Refresh every page that depends on profile information.
   */
  revalidatePath("/profile");
  revalidatePath("/dashboard");
  revalidatePath("/applications");
  revalidatePath("/admin");
}
