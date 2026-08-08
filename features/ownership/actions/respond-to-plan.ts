"use server";

import { createClient } from "@/lib/supabase/server";

export type OwnershipPlanDecision = "accept" | "decline";

export async function respondToOwnershipPlan(planId: string, decision: OwnershipPlanDecision) {
  if (!planId || !["accept", "decline"].includes(decision)) {
    return { ok: false, error: "Invalid ownership plan response." };
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "Please sign in to continue." };

  const { data, error } = await supabase.rpc("respond_to_ownership_plan", {
    p_plan_id: planId,
    p_decision: decision,
  });

  if (error) {
    return { ok: false, error: error.message };
  }

  if (!data) {
    return { ok: false, error: "The ownership plan could not be updated." };
  }

  return { ok: true };
}
