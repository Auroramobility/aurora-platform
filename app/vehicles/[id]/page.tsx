import { notFound } from "next/navigation";
import { SaveVehicleButton } from "@/components/vehicles/save-vehicle-button";
import { isVehicleSaved } from "@/features/saved-vehicles/lib/is-vehicle-saved";
import { BackButton } from "@/components/ui/back-button";
import { PageHeader } from "@/components/ui/page-header";
import { AuroraOwnershipCard } from "@/components/vehicles/aurora-ownership-card";
import { VehicleGallery } from "@/components/vehicles/vehicle-gallery";
import { VehicleSpecs } from "@/components/vehicles/vehicle-specs";

import { getVehicle } from "@/features/vehicles/lib/get-vehicle";

type VehicleDetailsPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function VehicleDetailsPage({
  params,
}: VehicleDetailsPageProps) {
  const { id } = await params;

  const vehicle = await getVehicle(id);

  if (!vehicle) {
    notFound();
  }
  const saved = await isVehicleSaved(vehicle.id);
  return (
    <main className="mx-auto max-w-7xl p-8">
      <BackButton />

      <PageHeader
        title={`${vehicle.brand} ${vehicle.model}`}
        description={vehicle.trim ?? ""}
      />

      <div className="mt-10 grid gap-10 lg:grid-cols-3">
        <div className="space-y-8 lg:col-span-2">
          <VehicleGallery
            image={vehicle.image_url ?? undefined}
            name={`${vehicle.brand} ${vehicle.model}`}
          />

          <VehicleSpecs vehicle={vehicle} />
        </div>

        <div className="space-y-6">
          {vehicle.price != null ? (
            <div className="space-y-4">
              <AuroraOwnershipCard price={vehicle.price} vehicleId={vehicle.id} />

              <SaveVehicleButton vehicleId={vehicle.id} saved={saved} />
            </div>
          ) : (
            <div className="bg-card rounded-3xl border p-8 text-sm text-muted-foreground">
              Price unavailable for this vehicle.
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
