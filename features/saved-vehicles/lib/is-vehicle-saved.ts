import { createClient } from "@/lib/supabase/server";

export async function isVehicleSaved(vehicleId: string) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return false;

  const { data } = await supabase
    .from("saved_vehicles")
    .select("id")
    .eq("user_id", user.id)
    .eq("vehicle_id", vehicleId)
    .maybeSingle();

  return !!data;
}
