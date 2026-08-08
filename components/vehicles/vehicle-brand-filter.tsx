import Link from "next/link";

type Props = {
  brands: string[];
  selectedBrand?: string;
};

export function VehicleBrandFilter({ brands, selectedBrand }: Props) {
  return (
    <div className="flex flex-wrap gap-3">
      <Link
        href="/vehicles"
        className={`rounded-full border px-4 py-2 text-sm transition ${
          !selectedBrand
            ? "bg-primary text-primary-foreground"
            : "hover:bg-muted"
        }`}
      >
        All
      </Link>

      {brands.map((brand) => (
        <Link
          key={brand}
          href={`/vehicles?brand=${encodeURIComponent(brand)}`}
          className={`rounded-full border px-4 py-2 text-sm transition ${
            selectedBrand === brand
              ? "bg-primary text-primary-foreground"
              : "hover:bg-muted"
          }`}
        >
          {brand}
        </Link>
      ))}
    </div>
  );
}
