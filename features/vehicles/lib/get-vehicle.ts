import { createClient } from "@/lib/supabase/server";
import { toVehicle, type Vehicle } from "@/features/vehicles/types/vehicle";

const VEHICLE_SELECT = `
  id,
  brand,
  model,
  trim,
  price,
  image_url,
  year,
  range_miles,
  battery_health,
  availability,
  description,
  mileage,
  color,
  battery_capacity,
  drivetrain,
  charging_time,
  acceleration,
  top_speed,
  featured,
  published,
  created_at,
  updated_at
` as const;

export async function getVehicle(id: string): Promise<Vehicle | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("vehicles")
    .select(VEHICLE_SELECT)
    .eq("id", id)
    .eq("published", true)
    .eq("availability", "available")
    .single();

  if (error) {
    if (error.code === "PGRST116") {
      return null;
    }

    throw new Error(`Unable to load vehicle: ${error.message}`);
  }

  return toVehicle(data);
}
