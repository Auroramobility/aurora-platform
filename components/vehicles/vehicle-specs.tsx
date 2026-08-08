import { Card, CardContent } from "@/components/ui/card";
import type { Vehicle } from "@/features/vehicles/types/vehicle";

export function VehicleSpecs({ vehicle }: { vehicle: Vehicle }) {
  const specs = [
    ["Price", vehicle.price ? `$${vehicle.price.toLocaleString()}` : "—"],
    ["Range", vehicle.range_miles ? `${vehicle.range_miles} mi` : "—"],
    [
      "Battery",
      vehicle.battery_capacity ? `${vehicle.battery_capacity} kWh` : "—",
    ],
    [
      "Mileage",
      vehicle.mileage ? `${vehicle.mileage.toLocaleString()} mi` : "—",
    ],
    ["Drivetrain", vehicle.drivetrain ?? "—"],
    ["Charging Time", vehicle.charging_time ?? "—"],
    ["Acceleration", vehicle.acceleration ?? "—"],
    ["Top Speed", vehicle.top_speed ? `${vehicle.top_speed} mph` : "—"],
    ["Color", vehicle.color ?? "—"],
  ];

  return (
    <Card>
      <CardContent className="space-y-6 pt-6">
        <div className="flex aspect-[16/9] items-center justify-center rounded-xl bg-muted">
          Vehicle Gallery Coming Soon
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {specs.map(([label, value]) => (
            <div
              key={label}
              className="flex justify-between rounded-lg border p-4"
            >
              <span className="font-medium">{label}</span>
              <span>{value}</span>
            </div>
          ))}
        </div>

        {vehicle.description && (
          <div className="rounded-xl border p-6">
            <h2 className="mb-3 text-xl font-semibold">Description</h2>

            <p className="leading-7 text-muted-foreground">
              {vehicle.description}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
