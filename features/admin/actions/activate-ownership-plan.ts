"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/features/admin/lib/authorization";
import { safeAdminError } from "@/features/admin/lib/errors";

export type ActivatePlanState = { error?: string; success?: string };

export async function activateOwnershipPlan(
  _previousState: ActivatePlanState,
  formData: FormData,
): Promise<ActivatePlanState> {
  const { supabase, user, isAdmin } = await requireAdmin();
  if (!user || !isAdmin) return { error: "Unauthorized." };

  const planId = String(formData.get("plan_id") ?? "");
  if (!planId) return { error: "Missing ownership plan." };

  const { data, error } = await supabase.rpc("activate_ownership_plan", {
    p_plan_id: planId,
  });

  if (error || data !== true) {
    return { error: safeAdminError("The ownership plan could not be activated.", error) };
  }

  revalidatePath("/admin");
  revalidatePath("/applications");
  return { success: "Ownership plan activated." };
}
