import { createClient } from "@/lib/supabase/server";
import { getVehicles } from "@/features/vehicles/lib/get-vehicles";
import type { SavedVehicle } from "@/features/saved-vehicles/types/saved-vehicle";

export async function getSavedVehicles(): Promise<SavedVehicle[]> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return [];

  const { data: savedRows, error } = await supabase
    .from("saved_vehicles")
    .select("id, vehicle_id, created_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(`Unable to load saved vehicles: ${error.message}`);
  }

  if (!savedRows?.length) return [];

  const vehicles = await getVehicles({
    ids: savedRows.map((row) => row.vehicle_id),
  });

  const vehiclesById = new Map(
    vehicles.map((vehicle) => [vehicle.id, vehicle]),
  );

  return savedRows.flatMap((row) => {
    const vehicle = vehiclesById.get(row.vehicle_id);

    if (!vehicle) return [];

    return [
      {
        id: row.id,
        vehicleId: row.vehicle_id,
        createdAt: row.created_at,
        vehicle: {
          id: vehicle.id,
          brand: vehicle.brand,
          model: vehicle.model,
          price: vehicle.price,
          image_url: vehicle.image_url,
        },
      },
    ];
  });
}
