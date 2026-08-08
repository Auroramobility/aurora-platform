import type { Tables } from "@/types/supabase";

export type VehicleRow = Tables<"vehicles">;

export type VehicleAvailability =
  | "available"
  | "reserved"
  | "sold"
  | "unavailable";

/**
 * Domain representation used by the vehicle feature and UI.
 * Database-specific typing stays at the data-access boundary.
 */
export type Vehicle = Omit<
  VehicleRow,
  "availability"
> & {
  availability: VehicleAvailability;
};

export function toVehicle(row: VehicleRow): Vehicle {
  const availability = row.availability;

  return {
    ...row,
    availability:
      availability === "available" ||
      availability === "reserved" ||
      availability === "sold" ||
      availability === "unavailable"
        ? availability
        : "unavailable",
  };
}
