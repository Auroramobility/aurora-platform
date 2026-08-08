"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/features/admin/lib/authorization";
import { safeAdminError } from "@/features/admin/lib/errors";

export type PreparePlanState = { error?: string; success?: string };

export async function prepareOwnershipPlan(
  _previousState: PreparePlanState,
  formData: FormData,
): Promise<PreparePlanState> {
  const { supabase, user, isAdmin } = await requireAdmin();
  if (!user || !isAdmin) return { error: "Unauthorized." };

  const planId = String(formData.get("plan_id") ?? "");
  if (!planId) return { error: "Missing ownership plan." };

  const { data, error } = await supabase.rpc("prepare_ownership_plan", {
    p_plan_id: planId,
  });

  if (error || data !== true) return { error: safeAdminError("The ownership plan could not be prepared.", error) };

  revalidatePath("/admin");
  return { success: "Ownership plan is ready for customer review." };
}
