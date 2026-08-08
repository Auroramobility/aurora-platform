import { PageHeader } from "@/components/ui/page-header";
import { VehicleComparison } from "@/components/vehicles/vehicle-comparison";
import { getVehicles } from "@/features/vehicles/lib/get-vehicles";

export default async function ComparePage({
  searchParams,
}: {
  searchParams: Promise<{
    ids?: string;
  }>;
}) {
  const { ids } = await searchParams;

  const vehicleIds = ids
    ? [...new Set(
        ids
          .split(",")
          .map((id) => id.trim())
          .filter(Boolean),
      )].slice(0, 4)
    : [];

  const vehicles =
    vehicleIds.length >= 2
      ? await getVehicles({ ids: vehicleIds })
      : [];

  return (
    <main className="mx-auto max-w-7xl space-y-10 p-8">
      <PageHeader
        title="Compare Electric Vehicles"
        description="See every important detail side-by-side before making your ownership decision."
      />

      {vehicles.length >= 2 ? (
        <VehicleComparison vehicles={vehicles} />
      ) : (
        <div className="rounded-3xl border p-10 text-center">
          <h2 className="text-2xl font-semibold">
            {vehicleIds.length >= 2
              ? "Some selected vehicles are unavailable"
              : "Select vehicles to compare"}
          </h2>

          <p className="mt-3 text-muted-foreground">
            {vehicleIds.length >= 2
              ? "Only published and available vehicles can be compared. Return to the marketplace and choose another vehicle."
              : "Choose at least two vehicles from the marketplace."}
          </p>

          {vehicleIds.length >= 2 && vehicles.length > 0 ? (
            <p className="mt-2 text-sm text-muted-foreground">
              {vehicles.length} of {vehicleIds.length} selected vehicles are currently available.
            </p>
          ) : null}
        </div>
      )}
    </main>
  );
}