import type { Vehicle } from "@/features/vehicles/types/vehicle";

export type SavedVehicle = {
  id: string;
  vehicleId: string;
  createdAt: string | null;
  vehicle: Pick<
    Vehicle,
    "id" | "brand" | "model" | "price" | "image_url"
  >;
};
