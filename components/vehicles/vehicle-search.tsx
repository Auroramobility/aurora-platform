import Link from "next/link";
import { Search } from "lucide-react";

export function VehicleSearch({ defaultValue = "" }: { defaultValue?: string }) {
  return (
    <form action="/vehicles" className="relative">
      <Search
        size={18}
        className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground"
      />
      <input
        name="q"
        type="search"
        defaultValue={defaultValue}
        placeholder="Search by brand, model or trim..."
        className="w-full rounded-xl border border-border bg-background py-3 pl-11 pr-24 outline-none transition focus:border-primary"
      />
      <button
        type="submit"
        className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground"
      >
        Search
      </button>
    </form>
  );
}
