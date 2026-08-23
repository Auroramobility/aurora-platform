import {
  Calculator,
  WalletCards,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";

const points = [
  {
    icon: Calculator,
    number: "01",
    title: "See the numbers first",
    description:
      "Choose your contribution and ownership duration, then see what your plan could look like before you apply.",
    accent: "text-blue-600 dark:text-blue-400",
    iconBg:
      "bg-blue-500/10 text-blue-600 ring-1 ring-blue-500/15 dark:bg-blue-400/10 dark:text-blue-400 dark:ring-blue-400/15",
  },
  {
    icon: WalletCards,
    number: "02",
    title: "Build toward ownership",
    description:
      "Your selected contribution and term create a clear path toward completing the balance on your Aurora vehicle.",
    accent: "text-purple-600 dark:text-purple-400",
    iconBg:
      "bg-purple-500/10 text-purple-600 ring-1 ring-purple-500/15 dark:bg-purple-400/10 dark:text-purple-400 dark:ring-purple-400/15",
  },
  {
    icon: CheckCircle2,
    number: "03",
    title: "Reach the delivery threshold",
    description:
      "Reach the required 30% contribution threshold before Aurora moves forward with vehicle delivery.",
    accent: "text-emerald-600 dark:text-emerald-400",
    iconBg:
      "bg-emerald-500/10 text-emerald-600 ring-1 ring-emerald-500/15 dark:bg-emerald-400/10 dark:text-emerald-400 dark:ring-emerald-400/15",
  },
] as const;

export function DifferentWayToOwn() {
  return (
    <section className="relative overflow-hidden border-y border-border/60 bg-background">
      {/* Ambient background */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute -left-32 top-16 h-96 w-96 rounded-full bg-blue-500/[0.05] blur-3xl dark:bg-blue-500/[0.08]" />

        <div className="absolute -right-32 bottom-0 h-96 w-96 rounded-full bg-purple-500/[0.05] blur-3xl dark:bg-purple-500/[0.08]" />
      </div>

      <div className="relative mx-auto max-w-7xl px-6 py-24 sm:px-8 md:py-32">
        {/* Header */}
        <div className="max-w-5xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/15 bg-primary/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.28em] text-primary">
            <span
              aria-hidden="true"
              className="h-1.5 w-1.5 rounded-full bg-primary"
            />
            A Different Way to Own
          </div>

          <h2 className="mt-7 max-w-4xl text-4xl font-bold leading-[1.05] tracking-tight md:text-5xl lg:text-6xl">
            Ownership should feel{" "}
            <span className="aurora-gradient-text">
              clear, not complicated.
            </span>
          </h2>

          <p className="mt-7 max-w-3xl text-base leading-8 text-muted-foreground md:text-lg">
            Aurora gives you the vehicle, the price, the numbers, and a clear
            path forward before you commit.
          </p>
        </div>

        {/* Process */}
        <div className="mx-auto mt-14 max-w-4xl border-y border-border/70">
          {points.map((point, index) => {
            const Icon = point.icon;

            return (
              <div
                key={point.number}
                className="group border-b border-border/70 py-7 last:border-b-0 md:py-8"
              >
                <div className="flex items-start gap-5 md:gap-7">
                  {/* Number */}
                  <div className="w-8 shrink-0 pt-1">
                    <span
                      className={`text-xs font-bold tracking-[0.18em] ${point.accent}`}
                    >
                      {point.number}
                    </span>
                  </div>

                  {/* Icon */}
                  <div
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${point.iconBg}`}
                  >
                    <Icon className="h-4 w-4" />
                  </div>

                  {/* Content */}
                  <div className="min-w-0 max-w-2xl">
                    <div className="flex items-center gap-4">
                      <h3 className="text-lg font-semibold tracking-tight md:text-xl">
                        {point.title}
                      </h3>

                      <ArrowRight className="hidden h-4 w-4 shrink-0 text-muted-foreground transition-all duration-300 group-hover:translate-x-1 group-hover:text-primary sm:block" />
                    </div>

                    <p className="mt-2 text-sm leading-6 text-muted-foreground md:text-base md:leading-7">
                      {point.description}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Core statement */}
        <div className="mt-16 border-t border-border/70 pt-10 md:mt-20 md:pt-12">
          <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end lg:gap-16">
            <div>
              <p className="text-2xl font-semibold tracking-tight md:text-3xl">
                You choose the vehicle.
                <span className="text-primary">
                  {" "}
                  You choose the contribution.
                </span>
              </p>

              <p className="mt-2 text-lg font-medium tracking-tight">
                Aurora defines the path.
              </p>

              <p className="mt-4 max-w-2xl text-sm leading-7 text-muted-foreground md:text-base">
                See the Aurora Access Price, understand your contribution, and
                know the delivery milestone before moving forward.
              </p>
            </div>

            <div className="inline-flex items-center gap-2 text-sm font-semibold text-primary">
              <span>Start with clarity</span>
              <ArrowRight className="h-4 w-4" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
