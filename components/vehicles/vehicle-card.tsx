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
      <div className="relative aspect-[16/9] flex-shrink-0 overflow-hidden bg-muted">
        {vehicle.featured && (
          <div className="aurora-gradient absolute left-2.5 top-2.5 z-10 rounded-full px-2.5 py-1 text-[9px] font-bold uppercase tracking-widest text-background shadow-sm sm:left-3 sm:top-3 sm:px-3 sm:text-[10px]">
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

        <div className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-surface/80 to-transparent sm:h-16" />
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col space-y-3 p-4 sm:space-y-4 sm:p-5">
        {/* Brand + Model */}
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-primary sm:text-xs">
            {vehicle.brand}
          </p>

          <h3 className="mt-0.5 text-xl font-bold sm:mt-1 sm:text-2xl">
            {vehicle.model}
          </h3>

          <p className="text-xs text-muted-foreground sm:text-sm">
            {vehicle.trim ?? "Standard"} • {vehicle.year ?? "N/A"}
          </p>
        </div>

        {/* Pricing */}
        <div className="space-y-2.5 sm:space-y-3">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground sm:text-xs sm:tracking-[0.16em]">
              Market Price
            </p>

            <p className="mt-0.5 text-base font-medium text-muted-foreground line-through decoration-muted-foreground/60 sm:mt-1 sm:text-lg">
              {money(pricing.marketPrice)}
            </p>
          </div>

          {pricing.auroraAccessPrice != null ? (
            <div className="rounded-xl border border-primary/20 bg-primary/[0.045] p-3 dark:bg-primary/[0.07] sm:rounded-2xl sm:p-4">
              <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-primary sm:text-xs sm:tracking-[0.16em]">
                Aurora Access Price
              </p>

              <p className="mt-0.5 text-2xl font-bold tracking-tight sm:mt-1 sm:text-3xl">
                {money(pricing.auroraAccessPrice)}
              </p>

              <div className="mt-1.5 inline-flex rounded-full bg-primary px-2 py-0.5 text-[11px] font-bold text-primary-foreground sm:mt-2 sm:px-2.5 sm:py-1 sm:text-xs">
                Save {pricing.discountPercent}%
              </div>
            </div>
          ) : null}

          {/* Aurora ownership entry point */}
          <div className="aurora-gradient relative overflow-hidden rounded-lg p-px sm:rounded-xl">
            <div className="rounded-[7px] bg-surface px-3 py-2.5 sm:rounded-[11px] sm:px-4 sm:py-3">
              <p className="text-[9px] font-bold uppercase tracking-widest text-primary sm:text-[10px]">
                Aurora Ownership Plan
              </p>

              <p className="mt-0.5 text-sm font-bold sm:text-base">
                Build your ownership plan
              </p>

              <p className="text-[11px] leading-relaxed text-muted-foreground sm:text-xs">
                Choose your contribution and ownership duration
              </p>
            </div>
          </div>
        </div>

        {/* EV Stats + Availability */}
        <div className="flex items-center justify-between gap-2 text-xs sm:gap-3 sm:text-sm">
          <div className="flex items-center gap-2 text-muted-foreground sm:gap-3">
            <div className="aurora-stat flex items-center gap-1 rounded-full px-2.5 py-1 sm:gap-1.5 sm:px-3 sm:py-1.5">
              <Zap size={12} className="text-primary sm:h-[13px] sm:w-[13px]" />

              <span className="font-medium">
                {vehicle.range_miles ?? "--"} mi
              </span>
            </div>

            <div className="aurora-stat flex items-center gap-1 rounded-full px-2.5 py-1 sm:gap-1.5 sm:px-3 sm:py-1.5">
              <Battery
                size={12}
                className="text-accent sm:h-[13px] sm:w-[13px]"
              />

              <span className="font-medium">
                {vehicle.battery_health ?? "--"}%
              </span>
            </div>
          </div>

          <Badge variant="success">{vehicle.availability}</Badge>
        </div>

        {/* View Details */}
        <div className="mt-auto border-t border-border pt-3 sm:pt-4">
          <Link
            href={`/vehicles/${vehicle.id}`}
            className="group/details flex w-full items-center justify-center gap-2 rounded-lg border border-primary/30 bg-primary/10 px-4 py-2.5 text-xs font-bold text-primary transition-all duration-200 hover:border-primary hover:bg-primary hover:text-primary-foreground sm:rounded-xl sm:px-5 sm:py-3.5 sm:text-sm"
          >
            View Details
            <ArrowRight
              size={15}
              className="transition-transform duration-200 group-hover/details:translate-x-1 sm:h-[17px] sm:w-[17px]"
            />
          </Link>
        </div>

        {/* Compare */}
        <CompareVehicleButton vehicleId={vehicle.id} />
      </div>
    </div>
  );
}
