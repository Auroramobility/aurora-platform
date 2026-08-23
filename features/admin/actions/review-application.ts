"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/features/admin/lib/authorization";
import { safeAdminError } from "@/features/admin/lib/errors";

export type ReviewApplicationState = {
  error?: string;
  success?: string;
};

export async function reviewApplication(
  _previousState: ReviewApplicationState,
  formData: FormData,
): Promise<ReviewApplicationState> {
  const { supabase, user, isAdmin } = await requireAdmin();
  if (!user || !isAdmin) return { error: "Unauthorized." };

  const applicationId = String(formData.get("application_id") ?? "");
  const decision = String(formData.get("decision") ?? "");
  const rejectionReason = String(formData.get("rejection_reason") ?? "");

  if (
    !applicationId ||
    !["reviewing", "approved", "rejected"].includes(decision)
  ) {
    return { error: "Invalid review request." };
  }

  const { data, error } = await supabase.rpc("review_application", {
    p_application_id: applicationId,
    p_decision: decision,
    p_rejection_reason: rejectionReason || undefined,
  });

  if (error || data !== true) {
    return {
      error: safeAdminError("The application could not be updated.", error),
    };
  }

  revalidatePath("/admin");
  revalidatePath(`/admin/applications/${applicationId}`);
  revalidatePath("/dashboard");
  return { success: `Application ${decision}.` };
}
