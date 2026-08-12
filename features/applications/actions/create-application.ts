"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { checkRateLimit, RATE_LIMIT_MESSAGE } from "@/lib/rate-limit";

export type CreateApplicationState = {
  error?: string;
};

export async function createApplication(
  _previousState: CreateApplicationState,
  formData: FormData,
): Promise<CreateApplicationState> {
  const vehicleId = String(formData.get("vehicle_id") ?? "").trim();

  if (!vehicleId) return { error: "Select a vehicle before applying." };

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const allowed = await checkRateLimit({
    action: "create_application",
    maxHits: 10,
    windowSeconds: 60 * 60,
  });

  if (!allowed) {
    return { error: RATE_LIMIT_MESSAGE };
  }

  const { data: vehicle, error: vehicleError } = await supabase
    .from("vehicles")
    .select("id")
    .eq("id", vehicleId)
    .eq("published", true)
    .eq("availability", "available")
    .maybeSingle();

  if (vehicleError || !vehicle) {
    return { error: "This vehicle is no longer available for applications." };
  }

  const { data: existing } = await supabase
    .from("applications")
    .select("id")
    .eq("user_id", user.id)
    .eq("vehicle_id", vehicleId)
    .in("status", ["pending", "reviewing", "approved"])
    .maybeSingle();

  if (existing) {
    return { error: "You already have an active application for this vehicle." };
  }

  const { error } = await supabase.from("applications").insert({
    user_id: user.id,
    vehicle_id: vehicleId,
    status: "pending",
  });

  if (error) {
    return { error: "We couldn't submit your application. Please try again." };
  }

  revalidatePath("/dashboard");
  revalidatePath("/applications");
  redirect("/applications");
}
