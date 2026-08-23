import { notFound } from "next/navigation";
import { SaveVehicleButton } from "@/components/vehicles/save-vehicle-button";
import { isVehicleSaved } from "@/features/saved-vehicles/lib/is-vehicle-saved";
import { BackButton } from "@/components/ui/back-button";
import { PageHeader } from "@/components/ui/page-header";
import { AuroraOwnershipCard } from "@/components/vehicles/aurora-ownership-card";
import { VehicleGallery } from "@/components/vehicles/vehicle-gallery";
import { VehicleSpecs } from "@/components/vehicles/vehicle-specs";
import { getVehicle } from "@/features/vehicles/lib/get-vehicle";
import { createClient } from "@/lib/supabase/server";

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

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const saved = await isVehicleSaved(vehicle.id);

  // Fetch all gallery images ordered by sort_order
  const { data: galleryImages } = await supabase
    .from("vehicle_images")
    .select("image_url")
    .eq("vehicle_id", vehicle.id)
    .order("sort_order", { ascending: true });

  // Gallery images first, fall back to single image_url
  const images =
    galleryImages && galleryImages.length > 0
      ? galleryImages.map((img) => img.image_url)
      : vehicle.image_url
        ? [vehicle.image_url]
        : [];

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
            images={images}
            name={`${vehicle.brand} ${vehicle.model}`}
          />

          <VehicleSpecs vehicle={vehicle} />
        </div>

        <div className="space-y-6">
          {vehicle.price != null ? (
            <div className="space-y-4">
              <AuroraOwnershipCard
                price={vehicle.price}
                vehicleId={vehicle.id}
              />

              <SaveVehicleButton
                vehicleId={vehicle.id}
                saved={saved}
                isAuthenticated={!!user}
              />
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
