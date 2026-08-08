import { VehicleCard } from "./vehicle-card";
import type { Vehicle } from "@/features/vehicles/types/vehicle";

type Props = {
  vehicles: Vehicle[];
};

export function VehicleGrid({ vehicles }: Props) {
  if (vehicles.length === 0) {
    return (
      <div className="rounded-xl border border-dashed p-12 text-center">
        <h3 className="text-xl font-semibold">No vehicles available</h3>

        <p className="mt-2 text-muted-foreground">
          Check back soon as we add more inventory.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
      {vehicles.map((vehicle) => (
        <VehicleCard key={vehicle.id} vehicle={vehicle} />
      ))}
    </div>
  );
}
