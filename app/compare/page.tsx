import { ComparePage } from "@/components/vehicles/compare-page";
import { getVehicles } from "@/features/vehicles/lib/get-vehicles";

export default async function CompareRoute() {
  const vehicles = await getVehicles();

  return <ComparePage vehicles={vehicles} />;
}
