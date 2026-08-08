"use server";

import { revalidatePath } from "next/cache";

import { createClient } from "@/lib/supabase/server";

export async function toggleSavedVehicle(vehicleId: string) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  const { data: existing, error: lookupError } = await supabase
    .from("saved_vehicles")
    .select("id")
    .eq("user_id", user.id)
    .eq("vehicle_id", vehicleId)
    .maybeSingle();

  if (lookupError) {
    throw new Error(`Unable to check saved vehicle: ${lookupError.message}`);
  }

  if (existing) {
    const { error } = await supabase
      .from("saved_vehicles")
      .delete()
      .eq("id", existing.id)
      .eq("user_id", user.id);

    if (error) {
      throw new Error(`Unable to remove saved vehicle: ${error.message}`);
    }
  } else {
    const { error } = await supabase.from("saved_vehicles").insert({
      user_id: user.id,
      vehicle_id: vehicleId,
    });

    if (error) {
      throw new Error(`Unable to save vehicle: ${error.message}`);
    }
  }

  revalidatePath("/dashboard");
  revalidatePath("/vehicles");
  revalidatePath(`/vehicles/${vehicleId}`);
}
