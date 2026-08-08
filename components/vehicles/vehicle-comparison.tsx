import type { Vehicle } from "@/features/vehicles/types/vehicle";

type Props = {
  vehicles: Vehicle[];
};

export function VehicleComparison({ vehicles }: Props) {
  return (
    <div className="overflow-x-auto rounded-3xl border">
      <table className="w-full">
        <thead className="bg-muted">
          <tr>
            <th className="p-6 text-left">Specification</th>

            {vehicles.map((vehicle) => (
              <th key={vehicle.model} className="p-6 text-center">
                {vehicle.brand}
                <br />
                <strong>{vehicle.model}</strong>
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          <Row
            label="Price"
            values={vehicles.map((v) =>
              v.price == null ? "—" : `$${v.price.toLocaleString()}`,
            )}
          />

          <Row
            label="Range"
            values={vehicles.map((v) =>
              v.range_miles == null ? "—" : `${v.range_miles} mi`,
            )}
          />

          <Row
            label="Battery"
            values={vehicles.map((v) =>
              v.battery_capacity == null ? "—" : `${v.battery_capacity} kWh`,
            )}
          />

          <Row
            label="Charging"
            values={vehicles.map((v) => v.charging_time ?? "—")}
          />

          <Row
            label="Drivetrain"
            values={vehicles.map((v) => v.drivetrain ?? "—")}
          />

          <Row
            label="Acceleration"
            values={vehicles.map((v) => v.acceleration ?? "—")}
          />

          <Row
            label="Top Speed"
            values={vehicles.map((v) =>
              v.top_speed == null ? "—" : `${v.top_speed} mph`,
            )}
          />
        </tbody>
      </table>
    </div>
  );
}

function Row({ label, values }: { label: string; values: string[] }) {
  return (
    <tr className="border-t">
      <td className="p-5 font-semibold">{label}</td>

      {values.map((value, index) => (
        <td key={index} className="p-5 text-center">
          {value}
        </td>
      ))}
    </tr>
  );
}
