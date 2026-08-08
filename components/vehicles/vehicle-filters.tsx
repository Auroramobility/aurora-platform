import Link from "next/link";
import type { VehicleSort } from "@/features/vehicles/lib/get-vehicles";

type Props = {
  sort?: VehicleSort;
  brand?: string;
  query?: string;
};

export function VehicleFilters({ sort = "newest", brand, query }: Props) {
  const params = new URLSearchParams();
  if (brand) params.set("brand", brand);
  if (query) params.set("q", query);

  const hrefFor = (nextSort: VehicleSort) => {
    const next = new URLSearchParams(params);
    next.set("sort", nextSort);
    return `/vehicles?${next.toString()}`;
  };

  return (
    <div className="flex flex-wrap items-center gap-3">
      <span className="text-sm font-medium text-muted-foreground">Sort:</span>
      {(
        [
          ["newest", "Newest"],
          ["price-low", "Lowest price"],
          ["price-high", "Highest price"],
          ["range-high", "Longest range"],
        ] as const
      ).map(([value, label]) => (
        <Link
          key={value}
          href={hrefFor(value)}
          className={`rounded-full border px-4 py-2 text-sm transition ${
            sort === value ? "bg-primary text-primary-foreground" : "hover:bg-muted"
          }`}
        >
          {label}
        </Link>
      ))}
    </div>
  );
}
