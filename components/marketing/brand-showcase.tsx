import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export async function BrandShowcase() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("vehicles")
    .select("brand")
    .eq("availability", "available")
    .order("brand", { ascending: true });

  const brands = [...new Set((data ?? []).map((v) => v.brand))].filter(Boolean);

  if (brands.length === 0) return null;

  return (
    <section className="mx-auto max-w-7xl px-8 py-24">
      <div className="max-w-3xl">
        <p className="text-sm font-bold uppercase tracking-[0.3em] text-primary">
          Brands
        </p>
        <h2 className="mt-4 text-4xl font-bold md:text-5xl">
          The world&apos;s most{" "}
          <span className="aurora-gradient-text">innovative</span>{" "}
          electric manufacturers.
        </h2>
        <p className="mt-6 text-lg text-muted-foreground">
          Discover electric vehicles from some of the most forward-thinking
          automotive companies in the world.
        </p>
      </div>

      <div className="aurora-divider mt-12 mb-10" />

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {brands.map((brand) => (
          <Link
            key={brand}
            href={`/vehicles?brand=${encodeURIComponent(brand)}`}
            className="aurora-card group relative overflow-hidden rounded-2xl border border-border bg-surface p-8 text-center shadow-sm"
          >
            {/* Hover glow */}
            <div className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity aurora-glow-teal" />

            <span className="relative z-10 text-2xl font-bold tracking-tight transition-all duration-300 group-hover:aurora-gradient-text md:text-3xl">
              {brand}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
