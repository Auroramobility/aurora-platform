import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Battery, Zap } from "lucide-react";

import { CompareVehicleButton } from "@/components/vehicles/compare-vehicle-button";
import { Badge } from "@/components/ui/badge";
import type { Vehicle } from "@/features/vehicles/types/vehicle";

export function VehicleCard({ vehicle }: { vehicle: Vehicle }) {
  return (
    <div className="aurora-card group h-full overflow-hidden rounded-2xl border border-border bg-surface shadow-md flex flex-col">

      {/* Image */}
      <div className="relative aspect-[16/10] overflow-hidden bg-muted flex-shrink-0">
        {vehicle.featured && (
          <div className="absolute left-3 top-3 z-10 aurora-gradient rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-background shadow-sm">
            Featured
          </div>
        )}
        <Image
          src={vehicle.image_url || "/images/vehicle-placeholder.svg"}
          alt={`${vehicle.brand} ${vehicle.model}`}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
          className="object-cover transition duration-500 group-hover:scale-105"
        />
        {/* Bottom gradient so card info has depth */}
        <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-surface/80 to-transparent" />
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col space-y-4 p-6">
        {/* Brand + Model */}
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-primary">
            {vehicle.brand}
          </p>
          <h3 className="mt-1 text-2xl font-bold">{vehicle.model}</h3>
          <p className="text-sm text-muted-foreground">
            {vehicle.trim ?? "Standard"} • {vehicle.year ?? "N/A"}
          </p>
        </div>

        {/* Price */}
        <div className="space-y-2">
          <div>
            <p className="text-xs uppercase tracking-wide text-muted-foreground">
              Vehicle price
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

          {/* Aurora ownership highlight */}
          <div className="relative overflow-hidden rounded-xl p-px aurora-gradient">
            <div className="rounded-[11px] bg-surface px-4 py-3">
              <p className="text-[10px] font-bold uppercase tracking-widest text-primary">
                Aurora Ownership Plan
              </p>
              <p className="mt-0.5 text-base font-bold">From $390/month</p>
              <p className="text-xs text-muted-foreground">30% initial contribution</p>
            </div>
          </div>
        </div>

        {/* EV Stats */}
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1.5 aurora-stat rounded-full px-3 py-1.5">
            <Zap size={13} className="text-primary" />
            <span className="font-medium">{vehicle.range_miles ?? "--"} mi</span>
          </div>
          <div className="flex items-center gap-1.5 aurora-stat rounded-full px-3 py-1.5">
            <Battery size={13} className="text-accent" />
            <span className="font-medium">{vehicle.battery_health ?? "--"}%</span>
          </div>
        </div>

        {/* Footer row */}
        <div className="flex items-center justify-between pt-2 mt-auto border-t border-border">
          <Badge variant="success">{vehicle.availability}</Badge>

          <Link
            href={`/vehicles/${vehicle.id}`}
            className="flex items-center gap-1 text-sm font-semibold text-primary opacity-80 transition hover:opacity-100"
          >
            View Details
            <ArrowRight size={15} />
          </Link>
        </div>

        <CompareVehicleButton vehicleId={vehicle.id} />
      </div>
    </div>
  );
}
