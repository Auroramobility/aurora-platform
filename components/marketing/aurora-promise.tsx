import { ShieldCheck, Eye, Headphones, Sparkles } from "lucide-react";

const promises = [
  {
    icon: Eye,
    number: "01",
    title: "Clear Pricing",
    description:
      "See the market reference price, Aurora Access Price, and your savings before you decide.",
    color: "blue",
  },
  {
    icon: ShieldCheck,
    number: "02",
    title: "Transparent Plans",
    description:
      "Know your contribution, ownership duration, estimated monthly amount, and the path ahead.",
    color: "green",
  },
  {
    icon: Headphones,
    number: "03",
    title: "Real Support",
    description:
      "Aurora administrators are available to help you understand your application and ownership journey.",
    color: "purple",
  },
  {
    icon: Sparkles,
    number: "04",
    title: "Built Around Access",
    description:
      "Selected premium EVs, Aurora pricing, and a defined path toward ownership.",
    color: "amber",
  },
] as const;

const colors = {
  blue: {
    icon: "bg-blue-500/10 text-blue-600 ring-1 ring-blue-500/15 dark:bg-blue-400/10 dark:text-blue-400 dark:ring-blue-400/20",
    number: "text-blue-600/30 dark:text-blue-400/30",
    accent: "bg-blue-500",
  },
  green: {
    icon: "bg-emerald-500/10 text-emerald-600 ring-1 ring-emerald-500/15 dark:bg-emerald-400/10 dark:text-emerald-400 dark:ring-emerald-400/20",
    number: "text-emerald-600/30 dark:text-emerald-400/30",
    accent: "bg-emerald-500",
  },
  purple: {
    icon: "bg-purple-500/10 text-purple-600 ring-1 ring-purple-500/15 dark:bg-purple-400/10 dark:text-purple-400 dark:ring-purple-400/20",
    number: "text-purple-600/30 dark:text-purple-400/30",
    accent: "bg-purple-500",
  },
  amber: {
    icon: "bg-amber-500/10 text-amber-600 ring-1 ring-amber-500/15 dark:bg-amber-400/10 dark:text-amber-400 dark:ring-amber-400/20",
    number: "text-amber-600/30 dark:text-amber-400/30",
    accent: "bg-amber-500",
  },
} as const;

export function AuroraPromise() {
  return (
    <section className="relative overflow-hidden border-y border-border/60 bg-background">
      {/* Ambient background */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute -left-32 top-16 h-80 w-80 rounded-full bg-emerald-500/[0.06] blur-3xl dark:bg-emerald-500/[0.09]" />

        <div className="absolute -right-32 bottom-0 h-96 w-96 rounded-full bg-purple-500/[0.06] blur-3xl dark:bg-purple-500/[0.09]" />
      </div>

      <div className="relative mx-auto max-w-7xl px-6 py-20 sm:px-8 md:py-24">
        {/* Introduction */}
        <div className="grid gap-10 lg:grid-cols-[0.75fr_1.25fr] lg:gap-20">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/15 bg-primary/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-primary">
              <span
                aria-hidden="true"
                className="h-1.5 w-1.5 rounded-full bg-primary"
              />
              The Aurora Promise
            </div>

            <h2 className="mt-6 max-w-xl text-4xl font-bold leading-[1.05] tracking-tight md:text-5xl">
              What you should expect
              <span className="aurora-gradient-text block">from Aurora.</span>
            </h2>
          </div>

          <div className="max-w-2xl lg:pt-10">
            <p className="text-base leading-8 text-muted-foreground md:text-lg">
              We believe the process of getting into an EV should be easier to
              understand from the beginning.
            </p>

            <p className="mt-4 text-base leading-8 text-muted-foreground md:text-lg">
              The vehicle should be clear. The price should be clear. Your
              contribution and the path toward ownership should be clear.
            </p>

            <p className="mt-4 text-base leading-8 text-muted-foreground md:text-lg">
              <span className="font-semibold text-foreground">
                That is the standard we are building Aurora around.
              </span>
            </p>
          </div>
        </div>

        {/* Promise list */}
        <div className="mt-14 border-y border-border/70">
          {promises.map((promise, index) => {
            const Icon = promise.icon;
            const style = colors[promise.color];

            return (
              <div
                key={promise.number}
                className="group border-b border-border/70 last:border-b-0"
              >
                <div className="flex items-start gap-5 py-7 md:gap-8 md:py-8">
                  {/* Number */}
                  <div className="w-8 shrink-0 pt-1">
                    <span
                      className={`text-sm font-bold tracking-[0.15em] ${style.number}`}
                    >
                      {promise.number}
                    </span>
                  </div>

                  {/* Icon */}
                  <div
                    className={`mt-0.5 flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ${style.icon}`}
                  >
                    <Icon className="h-5 w-5" />
                  </div>

                  {/* Content */}
                  <div className="min-w-0 max-w-2xl">
                    <div className="flex items-center gap-3">
                      <h3 className="text-lg font-semibold tracking-tight md:text-xl">
                        {promise.title}
                      </h3>

                      <span
                        aria-hidden="true"
                        className={`hidden h-1.5 w-1.5 rounded-full sm:block ${style.accent}`}
                      />
                    </div>

                    <p className="mt-2 text-sm leading-7 text-muted-foreground md:text-base">
                      {promise.description}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Closing statement */}
        <div className="mt-12 flex flex-col gap-5 border-t border-border/70 pt-10 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-2xl font-semibold tracking-tight md:text-3xl">
              Clear from the beginning.
            </p>

            <p className="mt-2 text-lg font-medium tracking-tight">
              Clear through the journey.
            </p>
          </div>

          <p className="max-w-xl text-sm leading-7 text-muted-foreground md:text-right">
            Aurora is built to give you the information, tools, and support
            needed to understand your vehicle and your path toward ownership
            before you commit.
          </p>
        </div>
      </div>
    </section>
  );
}
