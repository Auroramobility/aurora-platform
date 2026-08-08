import Link from "next/link";

import { getVehicles } from "@/features/vehicles/lib/get-vehicles";
import { Button } from "@/components/ui/button";

export async function FeaturedVehicles() {
  const vehicles = await getVehicles();

  const featuredVehicles = vehicles
    .filter((vehicle) => vehicle.featured)
    .slice(0, 3);

  return (
    <section className="bg-muted/30 py-24">
      <div className="mx-auto max-w-7xl px-8">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-muted-foreground">
              Featured Vehicles
            </p>

            <h2 className="mt-4 text-4xl font-bold tracking-tight md:text-5xl">
              Discover Your Next
              <span className="block text-primary">Electric Vehicle</span>
            </h2>

            <p className="mt-6 max-w-2xl text-lg text-muted-foreground">
              Explore premium electric vehicles selected for performance,
              innovation, and everyday ownership.
            </p>
          </div>

          <Button asChild variant="outline">
            <Link href="/vehicles">Browse All Vehicles</Link>
          </Button>
        </div>

        <div className="mt-16 grid gap-10 lg:grid-cols-3">
          {featuredVehicles.map((vehicle) => (
            <div
              key={vehicle.id}
              className="group overflow-hidden rounded-3xl border bg-background transition hover:shadow-xl"
            >
              <div className="relative aspect-[4/3] overflow-hidden">
                {vehicle.image_url && (
                  <img
                    src={vehicle.image_url}
                    alt={`${vehicle.brand} ${vehicle.model}`}
                    className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                  />
                )}
              </div>

              <div className="space-y-6 p-8">
                <div>
                  <h3 className="text-2xl font-bold">
                    {vehicle.brand} {vehicle.model}
                  </h3>

                  <p className="mt-2 text-muted-foreground">{vehicle.trim}</p>
                </div>

                <div className="grid grid-cols-3 gap-3 text-center text-sm">
                  <div>
                    <p className="font-bold">{vehicle.range_miles ?? "—"}</p>
                    <p className="text-muted-foreground">Miles</p>
                  </div>

                  <div>
                    <p className="font-bold">{vehicle.drivetrain}</p>
                    <p className="text-muted-foreground">Drive</p>
                  </div>

                  <div>
                    <p className="font-bold">{vehicle.acceleration}s</p>
                    <p className="text-muted-foreground">0-60</p>
                  </div>
                </div>

                <div className="rounded-2xl bg-muted p-5">
                  <p className="text-sm text-muted-foreground">
                    Aurora Ownership Plan
                  </p>

                  <p className="mt-2 text-3xl font-bold">
                    {vehicle.price == null
                      ? "—"
                      : `$${Math.round(vehicle.price * 0.0083)}`}
                    <span className="text-base font-normal text-muted-foreground">
                      /month
                    </span>
                  </p>
                </div>

                <Button asChild className="w-full">
                  <Link href={`/vehicles/${vehicle.id}`}>View Vehicle</Link>
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
