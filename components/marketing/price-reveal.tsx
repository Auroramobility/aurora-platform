import Link from "next/link";
import { ArrowRight, TrendingDown } from "lucide-react";

import { getVehicles } from "@/features/vehicles/lib/get-vehicles";
import { getAuroraPricing } from "@/lib/vehicles/aurora-pricing";
import { Button } from "@/components/ui/button";

function money(value: number | null) {
  if (value == null) return "—";

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

export async function PriceReveal() {
  const vehicles = await getVehicles();

  const pricedVehicles = vehicles
    .map((vehicle) => ({
      vehicle,
      pricing: getAuroraPricing(vehicle.price, vehicle.id),
    }))
    .filter(
      ({ pricing }) =>
        pricing.marketPrice != null &&
        pricing.auroraAccessPrice != null &&
        pricing.discountPercent != null,
    )
    .sort(
      (a, b) =>
        (b.pricing.discountPercent ?? 0) - (a.pricing.discountPercent ?? 0),
    )
    .slice(0, 3);

  const featured = pricedVehicles[0];

  return (
    <section className="relative overflow-hidden border-y border-border/60 bg-background">
      {/* Ambient background */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute -left-40 top-24 h-96 w-96 rounded-full bg-emerald-500/[0.06] blur-3xl dark:bg-emerald-500/[0.08]" />

        <div className="absolute right-[-10rem] top-1/3 h-[28rem] w-[28rem] rounded-full bg-purple-500/[0.05] blur-3xl dark:bg-purple-500/[0.07]" />
      </div>

      <div className="relative mx-auto max-w-7xl px-6 py-24 md:px-8 md:py-32">
        {/* Introduction */}
        <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-end lg:gap-20">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.25em] text-emerald-600 dark:text-emerald-400">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              Aurora Access Price
            </div>

            <h2 className="mt-5 text-4xl font-bold leading-[1.05] tracking-tight md:text-5xl lg:text-6xl">
              The price should make{" "}
              <span className="aurora-gradient-text">sense.</span>
            </h2>
          </div>

          <div className="max-w-2xl lg:pb-1">
            <p className="text-base leading-8 text-muted-foreground md:text-lg">
              Aurora gives you a clear starting point before you begin your
              ownership plan. Compare the market reference price with the Aurora
              Access Price and see the difference for yourself.
            </p>

            <p className="mt-5 text-base leading-8 text-muted-foreground md:text-lg">
              Selected vehicles are typically offered at{" "}
              <span className="font-semibold text-foreground">
                30% to 40% below comparable market pricing
              </span>
              , giving you a more attainable starting point for ownership.
            </p>
          </div>
        </div>

        {/* Main pricing reveal */}
        {featured ? (
          <div className="mt-16 border-y border-border/70">
            <div className="grid lg:grid-cols-[1fr_auto] lg:items-center">
              <div className="py-10 md:py-14 lg:pr-16">
                <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                    Example vehicle
                  </p>

                  <span className="h-1 w-1 rounded-full bg-border" />

                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                    {featured.vehicle.brand}
                  </p>
                </div>

                <h3 className="mt-4 text-3xl font-bold tracking-tight md:text-4xl">
                  {featured.vehicle.model}
                </h3>

                <p className="mt-2 text-base text-muted-foreground">
                  {featured.vehicle.trim}
                </p>

                <div className="mt-10 flex flex-wrap items-end gap-x-12 gap-y-8">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-muted-foreground">
                      Market Price
                    </p>

                    <p className="mt-2 text-2xl font-medium text-muted-foreground line-through md:text-3xl">
                      {money(featured.pricing.marketPrice)}
                    </p>
                  </div>

                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-emerald-600 dark:text-emerald-400">
                      Aurora Access Price
                    </p>

                    <p className="mt-2 text-4xl font-bold tracking-tight md:text-5xl">
                      {money(featured.pricing.auroraAccessPrice)}
                    </p>
                  </div>

                  <div className="pb-1">
                    <div className="inline-flex items-center gap-2 text-sm font-bold text-emerald-600 dark:text-emerald-400">
                      <TrendingDown className="h-4 w-4" />
                      Save {featured.pricing.discountPercent}%
                    </div>

                    {featured.pricing.savings != null ? (
                      <p className="mt-1 text-sm text-muted-foreground">
                        {money(featured.pricing.savings)} below market
                      </p>
                    ) : null}
                  </div>
                </div>
              </div>

              <div className="border-t border-border/70 py-8 lg:border-l lg:border-t-0 lg:py-14 lg:pl-12">
                <p className="max-w-xs text-sm leading-6 text-muted-foreground">
                  The Aurora Access Price is the vehicle price used to build
                  your ownership plan.
                </p>

                <Button asChild className="mt-6">
                  <Link href={`/vehicles/${featured.vehicle.id}`}>
                    View Vehicle
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        ) : null}

        {/* Other examples */}
        {pricedVehicles.length > 1 ? (
          <div className="mt-16">
            <div className="flex flex-col gap-3 border-b border-border/70 pb-5 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                  More examples
                </p>

                <h3 className="mt-2 text-2xl font-semibold tracking-tight">
                  Different vehicles. Same pricing principle.
                </h3>
              </div>

              <Link
                href="/vehicles"
                className="inline-flex items-center gap-2 text-sm font-semibold text-primary transition-colors hover:text-primary/80"
              >
                Explore all vehicles
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="divide-y divide-border/70">
              {pricedVehicles.slice(1).map(({ vehicle, pricing }) => (
                <Link
                  key={vehicle.id}
                  href={`/vehicles/${vehicle.id}`}
                  className="group flex flex-col gap-5 py-7 transition-colors hover:bg-muted/20 md:flex-row md:items-center md:justify-between md:gap-8"
                >
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                      <span className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                        {vehicle.brand}
                      </span>

                      <span className="h-1 w-1 rounded-full bg-border" />

                      <span className="text-xs text-muted-foreground">
                        {vehicle.trim}
                      </span>
                    </div>

                    <h4 className="mt-2 text-xl font-semibold tracking-tight group-hover:text-primary">
                      {vehicle.model}
                    </h4>
                  </div>

                  <div className="flex flex-wrap items-end gap-8 md:shrink-0">
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-muted-foreground">
                        Market
                      </p>

                      <p className="mt-1 text-sm text-muted-foreground line-through">
                        {money(pricing.marketPrice)}
                      </p>
                    </div>

                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-emerald-600 dark:text-emerald-400">
                        Aurora Access
                      </p>

                      <p className="mt-1 text-xl font-bold">
                        {money(pricing.auroraAccessPrice)}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 pb-1 text-sm font-bold text-emerald-600 dark:text-emerald-400">
                      <TrendingDown className="h-4 w-4" />
                      {pricing.discountPercent}%
                    </div>

                    <ArrowRight className="hidden h-5 w-5 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-primary md:block" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        ) : null}

        {/* Closing explanation */}
        <div className="mt-16 border-t border-border/70 pt-10">
          <div className="grid gap-6 md:grid-cols-[1fr_auto] md:items-end">
            <div>
              <p className="text-xl font-semibold tracking-tight md:text-2xl">
                Market price is the reference.
                <span className="text-primary">
                  {" "}
                  Aurora Access Price is where your plan starts.
                </span>
              </p>

              <p className="mt-3 max-w-3xl text-sm leading-7 text-muted-foreground md:text-base">
                From there, the ownership calculator lets you choose your
                contribution and ownership duration and shows the resulting
                monthly amount before you apply.
              </p>
            </div>

            <Button asChild variant="outline">
              <Link href="/vehicles">
                Explore All Vehicles
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
