import Link from "next/link";

import { getVehicles } from "@/features/vehicles/lib/get-vehicles";

export async function FeaturedVehicles() {
  const vehicles = await getVehicles();

  const featuredVehicles = vehicles.slice(0, 4);

  return (
    <section className="space-y-6 rounded-3xl border border-border bg-background p-8">
      <div>
        <h2 className="text-3xl font-semibold">
          Featured Electric Vehicles
        </h2>

        <p className="mt-2 max-w-3xl text-muted-foreground">
          Explore premium electric vehicles available through Aurora's
          transparent ownership model.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        {featuredVehicles.map((vehicle) => (
          <Link
            key={vehicle.id}
            href={`/vehicles/${vehicle.id}`}
            className="rounded-3xl border border-border p-6 transition hover:shadow-lg"
          >
            <h3 className="text-xl font-semibold">
              {vehicle.brand} {vehicle.model}
            </h3>

            <p className="mt-2 text-sm text-muted-foreground">
              {vehicle.trim}
            </p>

            <div className="mt-6 space-y-2 text-sm">
              <p>
                Price:{" "}
                <span className="font-medium">
                  ${vehicle.price?.toLocaleString()}
                </span>
              </p>

              <p>
                Range: {vehicle.range_miles} miles
              </p>

              <p>
                Battery: {vehicle.battery_capacity} kWh
              </p>
            </div>

            <div className="mt-6 rounded-xl bg-muted p-3 text-center text-sm font-medium">
              View Ownership Plan
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}