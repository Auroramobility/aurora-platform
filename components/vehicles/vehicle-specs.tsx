import {
  Battery,
  Gauge,
  GaugeCircle,
  Palette,
  PlugZap,
  Route,
  Timer,
} from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import type { Vehicle } from "@/features/vehicles/types/vehicle";

function formatPrice(value: number | null) {
  if (value == null) return "—";

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

function formatNumber(value: number | null, suffix = "") {
  if (value == null) return "—";
  return `${value.toLocaleString()}${suffix}`;
}

export function VehicleSpecs({ vehicle }: { vehicle: Vehicle }) {
  const specs = [
    {
      label: "Vehicle Price",
      value: formatPrice(vehicle.price),
      icon: <GaugeCircle className="h-4 w-4" />,
    },
    {
      label: "Range",
      value: formatNumber(vehicle.range_miles, " mi"),
      icon: <Route className="h-4 w-4" />,
    },
    {
      label: "Battery",
      value: formatNumber(vehicle.battery_capacity, " kWh"),
      icon: <Battery className="h-4 w-4" />,
    },
    {
      label: "Battery Health",
      value: formatNumber(vehicle.battery_health, "%"),
      icon: <Battery className="h-4 w-4" />,
    },
    {
      label: "Mileage",
      value: formatNumber(vehicle.mileage, " mi"),
      icon: <Route className="h-4 w-4" />,
    },
    {
      label: "Drivetrain",
      value: vehicle.drivetrain ?? "—",
      icon: <Gauge className="h-4 w-4" />,
    },
    {
      label: "Charging Time",
      value: vehicle.charging_time ?? "—",
      icon: <PlugZap className="h-4 w-4" />,
    },
    {
      label: "Acceleration",
      value: vehicle.acceleration ?? "—",
      icon: <Timer className="h-4 w-4" />,
    },
    {
      label: "Top Speed",
      value: formatNumber(vehicle.top_speed, " mph"),
      icon: <Gauge className="h-4 w-4" />,
    },
    {
      label: "Exterior Color",
      value: vehicle.color ?? "—",
      icon: <Palette className="h-4 w-4" />,
    },
  ];

  return (
    <Card className="overflow-hidden">
      <CardContent className="space-y-8 pt-6">
        <div>
          <div className="mb-5">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">
              Vehicle specifications
            </p>
            <h2 className="mt-1 text-2xl font-bold">
              Everything you need to know
            </h2>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {specs.map((spec) => (
              <div
                key={spec.label}
                className="flex items-center justify-between gap-4 rounded-xl border border-border bg-muted/20 px-4 py-4"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    {spec.icon}
                  </div>

                  <span className="text-sm font-medium text-muted-foreground">
                    {spec.label}
                  </span>
                </div>

                <span className="text-right text-sm font-semibold">
                  {spec.value}
                </span>
              </div>
            ))}
          </div>
        </div>

        {vehicle.description ? (
          <div className="rounded-2xl border border-border bg-muted/20 p-6">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">
              Overview
            </p>

            <h2 className="mt-1 text-xl font-semibold">About this vehicle</h2>

            <p className="mt-4 leading-7 text-muted-foreground">
              {vehicle.description}
            </p>
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}
