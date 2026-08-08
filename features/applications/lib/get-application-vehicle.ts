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

export async function getApplicationVehicle(vehicleId: string): Promise<Vehicle | null> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return null;

  const { data, error } = await supabase
    .from("vehicles")
    .select(VEHICLE_SELECT)
    .eq("id", vehicleId)
    .maybeSingle();

  if (error) throw new Error(`Unable to load application vehicle: ${error.message}`);
  return data ? toVehicle(data) : null;
}
