import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Battery, Zap } from "lucide-react";

import { CompareVehicleButton } from "@/components/vehicles/compare-vehicle-button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Vehicle } from "@/features/vehicles/types/vehicle";

export function VehicleCard({ vehicle }: { vehicle: Vehicle }) {
  return (
    <Card className="group h-full overflow-hidden transition hover:shadow-xl">
      <div className="relative aspect-[16/10] overflow-hidden bg-muted">
        {vehicle.featured && (
          <div className="absolute left-4 top-4 z-10 rounded-full bg-primary px-3 py-1 text-xs font-semibold text-white">
            FEATURED
          </div>
        )}

        <Image
          src={vehicle.image_url || "/images/vehicle-placeholder.svg"}
          alt={`${vehicle.brand} ${vehicle.model}`}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
          className="object-cover transition duration-500 group-hover:scale-105"
        />
      </div>

      <CardContent className="space-y-5 p-6">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-primary">
            {vehicle.brand}
          </p>

          <h3 className="mt-2 text-2xl font-bold">{vehicle.model}</h3>

          <p className="text-sm text-muted-foreground">
            {vehicle.trim ?? "Standard"} • {vehicle.year ?? "N/A"}
          </p>
        </div>

        <div className="space-y-3">
          <div>
            <p className="text-xs uppercase tracking-wide text-muted-foreground">
              Traditional Purchase
            </p>

            <p className="text-2xl font-bold">
              {vehicle.price !== null
                ? new Intl.NumberFormat("en-US", {
                    style: "currency",
                    currency: "USD",
                    maximumFractionDigits: 0,
                  }).format(vehicle.price)
                : "Price on request"}
            </p>
          </div>

          <div className="rounded-2xl bg-primary/10 p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-primary">
              Aurora Ownership Plan
            </p>

            <p className="mt-1 text-lg font-bold">Starting from $390/month</p>

            <p className="text-xs text-muted-foreground">
              30% initial contribution
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Zap size={16} />
            <span>{vehicle.range_miles ?? "--"} mi</span>
          </div>

          <div className="flex items-center gap-2">
            <Battery size={16} />
            <span>{vehicle.battery_health ?? "--"}%</span>
          </div>
        </div>

        <div className="flex items-center justify-between gap-3">
          <Badge variant="success">{vehicle.availability}</Badge>

          <Link
            href={`/vehicles/${vehicle.id}`}
            className="flex items-center gap-1 font-medium text-primary opacity-90 transition hover:opacity-100"
          >
            View Details
            <ArrowRight size={16} />
          </Link>
        </div>

        <CompareVehicleButton vehicleId={vehicle.id} />
      </CardContent>
    </Card>
  );
}
