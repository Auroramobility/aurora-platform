import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { createClient } from "@/lib/supabase/server";

const brandColors: Record<string, string> = {
  Audi: "#F50537",
  BMW: "#1C69D4",
  BYD: "#D70C19",
  Ford: "#003478",
  Genesis: "#202020",
  Hyundai: "#002C5F",
  Kia: "#EA0029",
  Lucid: "#242424",
  Polestar: "#111111",
  Rivian: "#E87722",
  Tesla: "#CC0000",
  Volkswagen: "#001E50",
  Volvo: "#1B365D",
};

const cardColors = [
  {
    card: "border-blue-200 bg-blue-50 hover:border-blue-300 dark:border-blue-400/20 dark:bg-blue-500/[0.08] dark:hover:bg-blue-500/[0.14]",
    badge: "bg-blue-500",
  },
  {
    card: "border-emerald-200 bg-emerald-50 hover:border-emerald-300 dark:border-emerald-400/20 dark:bg-emerald-500/[0.08] dark:hover:bg-emerald-500/[0.14]",
    badge: "bg-emerald-500",
  },
  {
    card: "border-purple-200 bg-purple-50 hover:border-purple-300 dark:border-purple-400/20 dark:bg-purple-500/[0.08] dark:hover:bg-purple-500/[0.14]",
    badge: "bg-purple-500",
  },
  {
    card: "border-amber-200 bg-amber-50 hover:border-amber-300 dark:border-amber-400/20 dark:bg-amber-500/[0.08] dark:hover:bg-amber-500/[0.14]",
    badge: "bg-amber-500",
  },
];

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
    <section className="relative overflow-hidden border-y border-border/60 bg-muted/30">
      {/* Ambient color */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute left-[5%] top-20 h-72 w-72 rounded-full bg-blue-500/[0.06] blur-3xl dark:bg-blue-500/[0.08]" />

        <div className="absolute left-[35%] top-1/2 h-64 w-64 rounded-full bg-emerald-500/[0.05] blur-3xl dark:bg-emerald-500/[0.08]" />

        <div className="absolute right-[20%] top-16 h-72 w-72 rounded-full bg-purple-500/[0.06] blur-3xl dark:bg-purple-500/[0.08]" />

        <div className="absolute bottom-0 right-[5%] h-72 w-72 rounded-full bg-amber-500/[0.06] blur-3xl dark:bg-amber-500/[0.08]" />
      </div>

      <div className="relative mx-auto max-w-7xl px-6 py-24 sm:px-8 md:py-28">
        {/* Heading */}
        <div className="max-w-4xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-purple-200 bg-purple-50 px-4 py-2 dark:border-purple-400/20 dark:bg-purple-500/[0.08]">
            <span className="h-1.5 w-1.5 rounded-full bg-purple-500" />

            <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-purple-700 dark:text-purple-300">
              The Aurora Collection
            </span>
          </div>

          <h2 className="mt-6 text-4xl font-bold leading-tight tracking-tight md:text-5xl lg:text-6xl">
            One platform.
            <span className="aurora-gradient-text block">
              More ways to go electric.
            </span>
          </h2>

          <p className="mt-6 max-w-3xl text-base leading-8 text-muted-foreground md:text-lg">
            Aurora is not tied to one manufacturer. We bring together electric
            vehicles from leading brands so you can compare your options, choose
            the vehicle that works for you, and build a clear path toward
            ownership.
          </p>
        </div>

        {/* Aurora color divider */}
        <div className="mt-12 flex h-1 overflow-hidden rounded-full">
          <div className="w-1/4 bg-blue-500" />
          <div className="w-1/4 bg-emerald-500" />
          <div className="w-1/4 bg-purple-500" />
          <div className="w-1/4 bg-amber-500" />
        </div>

        {/* Brand cards */}
        <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {brands.map((brand, index) => {
            const color = brandColors[brand] ?? "#202020";
            const cardColor = cardColors[index % cardColors.length]!;

            return (
              <Link
                key={brand}
                href={`/vehicles?brand=${encodeURIComponent(brand)}`}
                className={`group relative flex min-h-[140px] items-center justify-center overflow-hidden rounded-3xl border p-8 text-center shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${cardColor.card}`}
              >
                {/* Number */}
                <span
                  className={`absolute left-4 top-4 flex h-6 w-6 items-center justify-center rounded-full text-[9px] font-bold text-white ${cardColor.badge}`}
                >
                  {String(index + 1).padStart(2, "0")}
                </span>

                {/* Brand accent */}
                <span
                  aria-hidden="true"
                  className="absolute inset-x-0 bottom-0 h-1 origin-left scale-x-0 transition-transform duration-300 group-hover:scale-x-100"
                  style={{ backgroundColor: color }}
                />

                <div className="relative z-10">
                  <span
                    className="text-2xl font-black tracking-tight transition-transform duration-300 group-hover:scale-105 md:text-3xl"
                    style={{ color }}
                  >
                    {brand}
                  </span>

                  <span className="mt-2 flex items-center justify-center gap-1 text-xs font-semibold text-muted-foreground opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                    View vehicles
                    <ArrowRight className="h-3 w-3" />
                  </span>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Closing message */}
        <div className="relative mt-12 overflow-hidden rounded-3xl border border-emerald-200 bg-emerald-50 p-7 shadow-sm dark:border-emerald-400/20 dark:bg-emerald-500/[0.08] md:p-9">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-amber-400/[0.15] blur-3xl"
          />

          <div
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-20 left-1/3 h-48 w-48 rounded-full bg-purple-400/[0.10] blur-3xl"
          />

          <div className="relative flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div>
              <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-emerald-500/10 px-3 py-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />

                <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-emerald-700 dark:text-emerald-300">
                  Your Choice
                </span>
              </div>

              <p className="text-lg font-semibold tracking-tight">
                Compare the vehicles. Choose what fits your life.
              </p>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
                Different brands, different vehicles, one transparent approach
                to building your path toward ownership.
              </p>
            </div>

            <Link
              href="/vehicles"
              className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-emerald-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-500/20 transition-all duration-300 hover:-translate-y-0.5 hover:bg-emerald-600 hover:shadow-xl"
            >
              Explore All Vehicles
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
