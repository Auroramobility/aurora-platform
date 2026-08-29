import Link from "next/link";
import Image from "next/image";
import { ArrowRight, ChevronRight } from "lucide-react";

import { getVehicles } from "@/features/vehicles/lib/get-vehicles";
import { getAuroraPricing } from "@/lib/vehicles/aurora-pricing";
import { Button } from "@/components/ui/button";

const showcaseBrands = [
  "Tesla",
  "BYD",
  "Lucid",
  "Audi",
  "BMW",
  "Hyundai",
  "Kia",
  "Rivian",
];

const brandAccents: Record<
  string,
  {
    border: string;
    background: string;
    dot: string;
  }
> = {
  Tesla: {
    border: "border-red-200 dark:border-red-400/20",
    background: "bg-red-50/60 dark:bg-red-500/[0.06]",
    dot: "bg-red-500",
  },
  BYD: {
    border: "border-red-200 dark:border-red-400/20",
    background: "bg-red-50/60 dark:bg-red-500/[0.06]",
    dot: "bg-red-500",
  },
  Lucid: {
    border: "border-violet-200 dark:border-violet-400/20",
    background: "bg-violet-50/60 dark:bg-violet-500/[0.06]",
    dot: "bg-violet-500",
  },
  Audi: {
    border: "border-rose-200 dark:border-rose-400/20",
    background: "bg-rose-50/60 dark:bg-rose-500/[0.06]",
    dot: "bg-rose-500",
  },
  BMW: {
    border: "border-blue-200 dark:border-blue-400/20",
    background: "bg-blue-50/60 dark:bg-blue-500/[0.06]",
    dot: "bg-blue-500",
  },
  Hyundai: {
    border: "border-sky-200 dark:border-sky-400/20",
    background: "bg-sky-50/60 dark:bg-sky-500/[0.06]",
    dot: "bg-sky-500",
  },
  Kia: {
    border: "border-pink-200 dark:border-pink-400/20",
    background: "bg-pink-50/60 dark:bg-pink-500/[0.06]",
    dot: "bg-pink-500",
  },
  Rivian: {
    border: "border-orange-200 dark:border-orange-400/20",
    background: "bg-orange-50/60 dark:bg-orange-500/[0.06]",
    dot: "bg-orange-500",
  },
};

function money(value: number | null) {
  if (value == null) return "—";

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

export async function FeaturedVehicles() {
  const vehicles = await getVehicles();

  const featuredVehicles = showcaseBrands
    .map((brand) => {
      const brandVehicles = vehicles.filter(
        (vehicle) => vehicle.brand.toLowerCase() === brand.toLowerCase(),
      );

      return (
        brandVehicles.find((vehicle) => vehicle.featured) ?? brandVehicles[0]
      );
    })
    .filter((vehicle): vehicle is (typeof vehicles)[number] =>
      Boolean(vehicle),
    );

  return (
    <section className="relative overflow-hidden border-y border-border/60 bg-background">
      {/* Ambient color */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute -left-32 top-24 h-80 w-80 rounded-full bg-emerald-500/[0.06] blur-3xl dark:bg-emerald-500/[0.09]" />

        <div className="absolute right-[-8rem] top-1/3 h-96 w-96 rounded-full bg-purple-500/[0.05] blur-3xl dark:bg-purple-500/[0.08]" />

        <div className="absolute bottom-0 left-[42%] h-64 w-64 rounded-full bg-blue-500/[0.04] blur-3xl dark:bg-blue-500/[0.07]" />
      </div>

      <div className="relative mx-auto max-w-7xl px-6 py-20 sm:px-8 md:py-24">
        {/* Header */}
        <div className="flex flex-col gap-8 border-b border-border/70 pb-10 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-4xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-emerald-700 dark:text-emerald-400">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              Featured Vehicles
            </div>

            <h2 className="mt-6 text-4xl font-bold leading-[1.05] tracking-tight md:text-5xl lg:text-6xl">
              Premium EVs.
              <span className="aurora-gradient-text block">
                Aurora ownership.
              </span>
            </h2>

            <p className="mt-6 max-w-3xl text-base leading-8 text-muted-foreground md:text-lg">
              Explore vehicles Aurora owns and makes available through the
              Aurora Access Programme, with clear pricing and an ownership path
              built around the vehicle you choose.
            </p>

            {/* Principles */}
            <div className="mt-7 flex flex-wrap gap-x-6 gap-y-3">
              <div className="flex items-center gap-2 text-sm font-medium text-emerald-700 dark:text-emerald-400">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                30%–40% below comparable market pricing
              </div>

              <div className="flex items-center gap-2 text-sm font-medium text-purple-700 dark:text-purple-400">
                <span className="h-2 w-2 rounded-full bg-purple-500" />
                Ownership-focused plans
              </div>

              <div className="flex items-center gap-2 text-sm font-medium text-blue-700 dark:text-blue-400">
                <span className="h-2 w-2 rounded-full bg-blue-500" />
                Premium EV brands
              </div>
            </div>
          </div>

          <Button
            asChild
            variant="outline"
            className="group shrink-0 self-start lg:self-auto"
          >
            <Link href="/vehicles">
              Browse All Vehicles
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
        </div>

        {/* Vehicle list */}
        <div className="mt-8 divide-y divide-border/70 border-b border-border/70">
          {featuredVehicles.map((vehicle, index) => {
            const pricing = getAuroraPricing(vehicle.price, vehicle.id);

            const accent = brandAccents[vehicle.brand] ?? {
              border: "border-emerald-200 dark:border-emerald-400/20",
              background: "bg-emerald-50/60 dark:bg-emerald-500/[0.05]",
              dot: "bg-emerald-500",
            };

            return (
              <Link
                key={vehicle.id}
                href={`/vehicles/${vehicle.id}`}
                className="group block"
              >
                <div className="grid items-center gap-4 py-5 md:grid-cols-[180px_minmax(0,1fr)_auto] md:gap-5 md:py-6 lg:grid-cols-[220px_minmax(0,1fr)_minmax(260px,auto)_auto]">
                  {/* Image */}
                  <div
                    className={`relative overflow-hidden rounded-2xl border ${accent.border} ${accent.background}`}
                  >
                    <div className="relative aspect-[16/10] overflow-hidden">
                      {vehicle.image_url ? (
                        <Image
                          src={vehicle.image_url}
                          alt={`${vehicle.brand} ${vehicle.model}`}
                          fill
                          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 180px, 220px"
                          className="object-cover transition duration-500 group-hover:scale-[1.04]"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center text-xs text-muted-foreground">
                          Image unavailable
                        </div>
                      )}
                    </div>
                    <div className="absolute left-3 top-3 rounded-full border border-white/20 bg-black/45 px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.16em] text-white backdrop-blur-md">
                      {vehicle.brand}
                    </div>
                  </div>

                  {/* Vehicle information */}
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                        0{index + 1}
                      </span>

                      <span className="h-px w-5 bg-border" />
                    </div>

                    <h3 className="mt-2 truncate text-xl font-bold tracking-tight md:text-2xl">
                      {vehicle.model}
                    </h3>

                    <p className="mt-1 truncate text-sm text-muted-foreground">
                      {vehicle.trim}
                    </p>

                    {/* Specs */}
                    <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-muted-foreground">
                      <span>
                        <strong className="font-semibold text-foreground">
                          {vehicle.range_miles ?? "—"}
                        </strong>{" "}
                        mi
                      </span>

                      <span className="h-3 w-px bg-border" />

                      <span>
                        <strong className="font-semibold text-foreground">
                          {vehicle.drivetrain ?? "—"}
                        </strong>
                      </span>

                      <span className="h-3 w-px bg-border" />

                      <span>
                        <strong className="font-semibold text-foreground">
                          {vehicle.acceleration != null
                            ? `${vehicle.acceleration}s`
                            : "—"}
                        </strong>{" "}
                        0–60
                      </span>
                    </div>
                  </div>

                  {/* Pricing */}
                  <div className="flex items-center justify-between gap-6 md:justify-start">
                    <div>
                      <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-muted-foreground">
                        Market Price
                      </p>

                      <p className="mt-1 text-sm font-medium text-muted-foreground line-through">
                        {money(pricing.marketPrice)}
                      </p>
                    </div>

                    <div className="h-9 w-px bg-border" />

                    <div>
                      <div className="flex items-center gap-2">
                        <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-emerald-700 dark:text-emerald-400">
                          Aurora Access
                        </p>

                        {pricing.discountPercent != null ? (
                          <span className="rounded-full bg-emerald-500 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide text-white">
                            Save {pricing.discountPercent}%
                          </span>
                        ) : null}
                      </div>

                      <p className="mt-1 text-xl font-bold tracking-tight md:text-2xl">
                        {money(pricing.auroraAccessPrice)}
                      </p>
                    </div>
                  </div>

                  {/* Arrow */}
                  <div className="hidden h-10 w-10 shrink-0 items-center justify-center rounded-full border border-border bg-background text-muted-foreground transition-all duration-300 group-hover:border-primary/30 group-hover:bg-primary/5 group-hover:text-primary lg:flex">
                    <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Closing message */}
        <div className="mt-10 flex flex-col gap-5 border-t border-border/70 pt-8 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xl font-semibold tracking-tight md:text-2xl">
              The vehicle you want should feel closer.
            </p>

            <p className="mt-2 max-w-2xl text-sm leading-7 text-muted-foreground">
              Compare the vehicle, see the Aurora Access Price, and use the
              ownership calculator to understand your path forward.
            </p>
          </div>

          <Button asChild variant="outline" className="group shrink-0">
            <Link href="/vehicles">
              Explore the catalogue
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
