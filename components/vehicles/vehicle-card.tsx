import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Battery, Zap } from "lucide-react";

import { CompareVehicleButton } from "@/components/vehicles/compare-vehicle-button";
import { Badge } from "@/components/ui/badge";
import { getAuroraPricing } from "@/lib/vehicles/aurora-pricing";
import type { Vehicle } from "@/features/vehicles/types/vehicle";

function money(value: number | null) {
  if (value == null) return "Price on request";

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

export function VehicleCard({ vehicle }: { vehicle: Vehicle }) {
  const pricing = getAuroraPricing(vehicle.price, vehicle.id);

  return (
    <div className="aurora-card group flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-surface shadow-md">
      {/* Image */}
      <div className="relative aspect-[16/10] flex-shrink-0 overflow-hidden bg-muted">
        {vehicle.featured && (
          <div className="aurora-gradient absolute left-3 top-3 z-10 rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-background shadow-sm">
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

        {/* Pricing */}
        <div className="space-y-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
              Market Price
            </p>

            <p className="mt-1 text-lg font-medium text-muted-foreground line-through decoration-muted-foreground/60">
              {money(pricing.marketPrice)}
            </p>
          </div>

          {pricing.auroraAccessPrice != null ? (
            <div className="rounded-2xl border border-primary/20 bg-primary/[0.045] p-4 dark:bg-primary/[0.07]">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-primary">
                Aurora Access Price
              </p>

              <p className="mt-1 text-3xl font-bold tracking-tight">
                {money(pricing.auroraAccessPrice)}
              </p>

              <div className="mt-2 inline-flex rounded-full bg-primary px-2.5 py-1 text-xs font-bold text-primary-foreground">
                Save {pricing.discountPercent}%
              </div>
            </div>
          ) : null}

          {/* Aurora ownership entry point */}
          <div className="aurora-gradient relative overflow-hidden rounded-xl p-px">
            <div className="rounded-[11px] bg-surface px-4 py-3">
              <p className="text-[10px] font-bold uppercase tracking-widest text-primary">
                Aurora Ownership Plan
              </p>

              <p className="mt-0.5 text-base font-bold">
                Build your ownership plan
              </p>

              <p className="text-xs text-muted-foreground">
                Choose your contribution and ownership duration
              </p>
            </div>
          </div>
        </div>

        {/* EV Stats + Availability */}
        <div className="flex items-center justify-between gap-3 text-sm">
          <div className="flex items-center gap-3 text-muted-foreground">
            <div className="aurora-stat flex items-center gap-1.5 rounded-full px-3 py-1.5">
              <Zap size={13} className="text-primary" />

              <span className="font-medium">
                {vehicle.range_miles ?? "--"} mi
              </span>
            </div>

            <div className="aurora-stat flex items-center gap-1.5 rounded-full px-3 py-1.5">
              <Battery size={13} className="text-accent" />

              <span className="font-medium">
                {vehicle.battery_health ?? "--"}%
              </span>
            </div>
          </div>

          <Badge variant="success">{vehicle.availability}</Badge>
        </div>

        {/* View Details */}
        <div className="mt-auto border-t border-border pt-4">
          <Link
            href={`/vehicles/${vehicle.id}`}
            className="group/details flex w-full items-center justify-center gap-2 rounded-xl border border-primary/30 bg-primary/10 px-5 py-3.5 text-sm font-bold text-primary transition-all duration-200 hover:border-primary hover:bg-primary hover:text-primary-foreground"
          >
            View Details
            <ArrowRight
              size={17}
              className="transition-transform duration-200 group-hover/details:translate-x-1"
            />
          </Link>
        </div>

        {/* Compare */}
        <CompareVehicleButton vehicleId={vehicle.id} />
      </div>
    </div>
  );
}
