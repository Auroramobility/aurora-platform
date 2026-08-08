import { getVehicleBrands } from "@/features/vehicles/lib/get-vehicle-brands";
import { VehicleGrid } from "@/components/vehicles/vehicle-grid";
import { VehicleSearch } from "@/components/vehicles/vehicle-search";
import { VehicleFilters } from "@/components/vehicles/vehicle-filters";
import { PageHeader } from "@/components/ui/page-header";
import { BackButton } from "@/components/ui/back-button";
import { getVehicles, type VehicleSort } from "@/features/vehicles/lib/get-vehicles";
import { VehicleBrandFilter } from "@/components/vehicles/vehicle-brand-filter";
import { CompareTray } from "@/components/vehicles/compare-tray";

type SearchParams = {
  brand?: string;
  q?: string;
  sort?: string;
};

const SORTS: VehicleSort[] = ["newest", "price-low", "price-high", "range-high"];

export default async function VehiclesPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const { brand, q, sort } = await searchParams;
  const selectedSort = SORTS.includes(sort as VehicleSort)
    ? (sort as VehicleSort)
    : "newest";

  const vehicles = await getVehicles({
    brand,
    query: q,
    sort: selectedSort,
  });
  const brands = await getVehicleBrands();

  return (
    <main className="mx-auto max-w-7xl space-y-8 p-8">
      <BackButton />

      <PageHeader
        title="Browse Vehicles"
        description="Find your next electric vehicle."
      />

      <VehicleSearch defaultValue={q} />

      <VehicleBrandFilter brands={brands} selectedBrand={brand} />

      <VehicleFilters sort={selectedSort} brand={brand} query={q} />

      <VehicleGrid vehicles={vehicles} />

      <CompareTray />
    </main>
  );
}
