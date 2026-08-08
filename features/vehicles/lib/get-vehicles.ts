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

export type VehicleSort =
  | "newest"
  | "price-low"
  | "price-high"
  | "range-high";

type VehicleFilters = {
  brand?: string;
  query?: string;
  sort?: VehicleSort;
  ids?: string[];
};

export async function getVehicles({
  brand,
  query: search,
  sort = "newest",
  ids,
}: VehicleFilters = {}): Promise<Vehicle[]> {
  const supabase = await createClient();

  let query = supabase
    .from("vehicles")
    .select(VEHICLE_SELECT)
    .eq("published", true)
    .eq("availability", "available");

  if (brand) {
    query = query.eq("brand", brand);
  }

  if (search) {
    const escaped = search.replace(/[%_,]/g, "").trim();
    if (escaped) {
      query = query.or(
        `brand.ilike.%${escaped}%,model.ilike.%${escaped}%,trim.ilike.%${escaped}%`,
      );
    }
  }

  if (ids && ids.length > 0) {
    query = query.in("id", ids);
  }

  switch (sort) {
    case "price-low":
      query = query.order("price", { ascending: true, nullsFirst: false });
      break;
    case "price-high":
      query = query.order("price", { ascending: false, nullsFirst: false });
      break;
    case "range-high":
      query = query.order("range_miles", { ascending: false, nullsFirst: false });
      break;
    default:
      query = query.order("created_at", { ascending: false });
  }

  const { data, error } = await query;

  if (error) {
    throw new Error(`Unable to load vehicles: ${error.message}`);
  }

  return (data ?? []).map(toVehicle);
}
