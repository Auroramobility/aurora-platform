import Link from "next/link";
import { ArrowRight, Calculator, CheckCircle2, Zap } from "lucide-react";

import { Button } from "@/components/ui/button";

export function CTA() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-20 sm:px-8 md:py-24">
      <div className="relative overflow-hidden rounded-[2.5rem] border border-primary/20 bg-gradient-to-br from-emerald-50 via-background to-violet-50 p-px shadow-2xl dark:from-emerald-950/40 dark:via-background dark:to-violet-950/40">
        {/* Outer atmosphere */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -left-24 -top-24 h-80 w-80 rounded-full bg-emerald-400/20 blur-3xl dark:bg-emerald-400/10"
        />

        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-24 -top-20 h-72 w-72 rounded-full bg-yellow-400/20 blur-3xl dark:bg-yellow-400/10"
        />

        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-28 left-1/3 h-80 w-80 rounded-full bg-violet-500/20 blur-3xl dark:bg-violet-500/10"
        />

        <div className="relative overflow-hidden rounded-[2.4rem] bg-background px-7 py-16 text-center md:px-16 md:py-20">
          {/* Internal color washes */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_15%_20%,hsl(var(--primary)/0.10),transparent_30%),radial-gradient(circle_at_85%_20%,rgba(250,204,21,0.10),transparent_28%),radial-gradient(circle_at_50%_100%,rgba(139,92,246,0.10),transparent_35%)]"
          />

          {/* Color atmosphere */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute left-[7%] top-32 h-24 w-24 rounded-full bg-emerald-400/10 blur-2xl"
          />

          <div
            aria-hidden="true"
            className="pointer-events-none absolute right-[8%] top-40 h-28 w-28 rounded-full bg-yellow-400/10 blur-2xl"
          />

          <div
            aria-hidden="true"
            className="pointer-events-none absolute bottom-20 left-1/2 h-32 w-32 -translate-x-1/2 rounded-full bg-violet-500/10 blur-3xl"
          />

          {/* Subtle grid */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 opacity-[0.025]"
            style={{
              backgroundImage:
                "linear-gradient(currentColor 1px, transparent 1px), linear-gradient(90deg, currentColor 1px, transparent 1px)",
              backgroundSize: "64px 64px",
            }}
          />

          <div className="relative z-10">
            {/* Eyebrow */}
            <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-emerald-300/50 bg-emerald-100/70 px-4 py-2 shadow-sm dark:border-emerald-400/20 dark:bg-emerald-500/10">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500/15">
                <Zap className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
              </span>

              <span className="text-xs font-semibold uppercase tracking-[0.22em] text-emerald-700 dark:text-emerald-400">
                The Aurora Access Programme
              </span>
            </div>

            {/* Heading */}
            <h2 className="mx-auto max-w-4xl text-4xl font-bold leading-tight tracking-tight md:text-6xl lg:text-7xl">
              The vehicle you want.
              <span className="aurora-gradient-text block">
                A clearer path to ownership.
              </span>
            </h2>

            {/* Description */}
            <p className="mx-auto mt-7 max-w-3xl text-base leading-8 text-muted-foreground md:text-lg">
              Aurora owns and offers selected electric vehicles through the
              Aurora Access Programme. Each eligible vehicle has an Aurora
              Access Price, giving you a clear starting point for your ownership
              plan.
            </p>

            <p className="mx-auto mt-4 max-w-3xl text-base leading-8 text-muted-foreground md:text-lg">
              Choose the vehicle you want, choose your contribution and
              ownership duration, and see the numbers before you move forward.
              There is no interest added to your plan.
            </p>

            {/* Key points */}
            <div className="mx-auto mt-10 grid max-w-4xl gap-4 text-left sm:grid-cols-3">
              {/* Aurora Access Price */}
              <div className="group rounded-2xl border border-emerald-200 bg-emerald-50/90 p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-emerald-300 hover:shadow-lg dark:border-emerald-400/20 dark:bg-emerald-500/[0.08]">
                <div className="mb-4 h-1.5 w-10 rounded-full bg-emerald-500" />

                <p className="text-xl font-bold text-emerald-700 dark:text-emerald-400">
                  Aurora Access Price
                </p>

                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  The vehicle price used to build your Aurora ownership plan.
                </p>
              </div>

              {/* Zero interest */}
              <div className="group rounded-2xl border border-blue-200 bg-blue-50/90 p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-blue-300 hover:shadow-lg dark:border-blue-400/20 dark:bg-blue-500/[0.08]">
                <div className="mb-4 h-1.5 w-10 rounded-full bg-blue-500" />

                <p className="text-xl font-bold text-blue-700 dark:text-blue-400">
                  0% Interest
                </p>

                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  Your ownership plan is built without interest charges.
                </p>
              </div>

              {/* Delivery threshold */}
              <div className="group rounded-2xl border border-violet-200 bg-violet-50/90 p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-violet-300 hover:shadow-lg dark:border-violet-400/20 dark:bg-violet-500/[0.08]">
                <div className="mb-4 h-1.5 w-10 rounded-full bg-violet-500" />

                <p className="text-xl font-bold text-violet-700 dark:text-violet-400">
                  30% Threshold
                </p>

                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  Reach 30% of the Aurora Access Price before vehicle delivery.
                </p>
              </div>
            </div>

            {/* Ownership explanation */}
            <div className="mx-auto mt-8 max-w-4xl rounded-2xl border border-border/70 bg-background/80 p-5 text-left shadow-sm backdrop-blur-sm md:p-6">
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                  <CheckCircle2 className="h-5 w-5" />
                </div>

                <div>
                  <p className="font-semibold tracking-tight">
                    Build toward ownership with a plan you can understand.
                  </p>

                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    Your contribution plan is calculated from the Aurora Access
                    Price. Once the required 30% threshold is reached, Aurora
                    can move forward with vehicle delivery while you continue
                    toward completing the remaining balance.
                  </p>
                </div>
              </div>
            </div>

            {/* CTAs */}
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button
                size="lg"
                className="bg-emerald-600 font-semibold text-white shadow-lg shadow-emerald-500/25 transition-all hover:scale-105 hover:bg-emerald-700 hover:shadow-emerald-500/40 dark:bg-emerald-500 dark:hover:bg-emerald-400"
                asChild
              >
                <Link href="/vehicles">
                  Explore Vehicles
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>

              <Button
                size="lg"
                className="border-2 border-violet-300 bg-violet-50 font-semibold text-violet-700 shadow-sm hover:bg-violet-100 dark:border-violet-400/30 dark:bg-violet-500/10 dark:text-violet-300 dark:hover:bg-violet-500/20"
                asChild
              >
                <Link href="/signup">
                  <Calculator className="mr-2 h-4 w-4" />
                  Calculate Your Plan
                </Link>
              </Button>
            </div>

            {/* Closing statement */}
            <div className="mx-auto mt-12 max-w-2xl border-t border-border/60 pt-8">
              <p className="text-lg font-semibold tracking-tight md:text-xl">
                Choose the vehicle.
                <span className="text-emerald-600 dark:text-emerald-400">
                  {" "}
                  See the Aurora Access Price.
                </span>
                <br />
                <span className="text-violet-600 dark:text-violet-400">
                  Build your path toward ownership.
                </span>
              </p>

              <p className="mt-3 text-sm text-muted-foreground">
                Aurora owns the vehicle. We set the Access Price. You choose the
                plan.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
