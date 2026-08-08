"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/features/admin/lib/authorization";
import { safeAdminError } from "@/features/admin/lib/errors";

export type ReviewIdentityState = {
  error?: string;
  success?: string;
};

export async function reviewIdentity(
  _previousState: ReviewIdentityState,
  formData: FormData,
): Promise<ReviewIdentityState> {
  const { supabase, user, isAdmin } = await requireAdmin();
  if (!user || !isAdmin) return { error: "Unauthorized." };

  const userId = String(formData.get("user_id") ?? "");
  const verified = String(formData.get("verified") ?? "") === "true";

  if (!userId) return { error: "Missing user." };

  const { data, error } = await supabase.rpc("review_identity_verification", {
    p_user_id: userId,
    p_verified: verified,
  });

  if (error || data !== true) {
    return { error: safeAdminError("Identity verification could not be updated.", error) };
  }

  revalidatePath("/admin");
  revalidatePath("/dashboard");
  revalidatePath("/profile");
  return { success: verified ? "Identity verified." : "Identity verification revoked." };
}
