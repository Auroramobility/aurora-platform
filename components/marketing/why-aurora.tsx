import {
  Shield,
  TrendingUp,
  ArrowUpRight,
  BadgeDollarSign,
} from "lucide-react";

const features = [
  {
    icon: BadgeDollarSign,
    number: "01",
    title: "Better Access to Better EVs",
    description:
      "Aurora acquires and offers selected premium electric vehicles through the Aurora ownership model, with eligible vehicles typically priced 30% to 40% below comparable market pricing.",
    color: "text-emerald-600 dark:text-emerald-400",
    iconBg:
      "bg-emerald-500/10 text-emerald-600 ring-1 ring-emerald-500/15 dark:bg-emerald-400/10 dark:text-emerald-400 dark:ring-emerald-400/15",
  },
  {
    icon: TrendingUp,
    number: "02",
    title: "Every Contribution Moves You Forward",
    description:
      "Your Aurora plan is built around a clear ownership journey. Every contribution moves you toward the 30% threshold required before vehicle delivery.",
    color: "text-blue-600 dark:text-blue-400",
    iconBg:
      "bg-blue-500/10 text-blue-600 ring-1 ring-blue-500/15 dark:bg-blue-400/10 dark:text-blue-400 dark:ring-blue-400/15",
  },
  {
    icon: Shield,
    number: "03",
    title: "A Clearer Way to Own",
    description:
      "Know the vehicle price, understand your contribution plan, see what remains, and get support from real Aurora administrators throughout the process.",
    color: "text-purple-600 dark:text-purple-400",
    iconBg:
      "bg-purple-500/10 text-purple-600 ring-1 ring-purple-500/15 dark:bg-purple-400/10 dark:text-purple-400 dark:ring-purple-400/15",
  },
];

export function WhyAurora() {
  return (
    <section className="relative overflow-hidden border-y border-border/60 bg-background">
      {/* Ambient color */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute -left-40 top-10 h-96 w-96 rounded-full bg-emerald-500/[0.06] blur-3xl dark:bg-emerald-500/[0.09]" />

        <div className="absolute right-[-10rem] top-1/3 h-[30rem] w-[30rem] rounded-full bg-blue-500/[0.05] blur-3xl dark:bg-blue-500/[0.08]" />

        <div className="absolute bottom-[-10rem] left-1/3 h-80 w-80 rounded-full bg-purple-500/[0.05] blur-3xl dark:bg-purple-500/[0.08]" />
      </div>

      <div className="relative mx-auto max-w-7xl px-6 py-20 sm:px-8 md:py-24">
        {/* Introduction */}
        <div className="mx-auto max-w-4xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/15 bg-primary/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-primary">
            <span
              aria-hidden="true"
              className="h-1.5 w-1.5 rounded-full bg-primary"
            />
            Why Aurora
          </div>

          <h2 className="mt-6 max-w-4xl text-4xl font-bold leading-[1.05] tracking-tight md:text-5xl lg:text-6xl">
            We believe premium EV ownership should{" "}
            <span className="aurora-gradient-text">work differently.</span>
          </h2>

          <div className="mt-7 max-w-2xl space-y-4 text-base leading-7 text-muted-foreground md:text-lg md:leading-8">
            <p>
              Electric vehicles have changed what a car can be.
              <br className="hidden sm:block" />
              Faster. Smarter. Quieter. More efficient.
            </p>

            <p>
              But access to them has not changed enough. The price you see is
              still the price you are expected to accept. Traditional financing
              adds interest. Leasing gives you access without ownership.
            </p>

            <p>
              <span className="font-semibold text-foreground">
                Aurora was built to offer another way.
              </span>
            </p>

            <p>
              We acquire and offer selected premium electric vehicles through
              the{" "}
              <span className="font-semibold text-foreground">
                Aurora ownership model
              </span>
              , with an{" "}
              <span className="font-semibold text-foreground">
                Aurora Access Price typically 30% to 40% below comparable market
                pricing.
              </span>
            </p>

            <p>
              You choose the vehicle you want. You choose your contribution and
              ownership duration. Aurora gives you a clear path from your first
              contribution toward ownership.
            </p>

            <p>
              <span className="font-semibold text-foreground">
                No interest. No hidden pricing. No complicated financing story.
              </span>{" "}
              Just a vehicle you want, a price you can understand, and a defined
              path to ownership.
            </p>
          </div>
        </div>

        {/* Divider */}
        <div className="my-12 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent md:my-14" />

        {/* Aurora difference */}
        <div className="mx-auto max-w-5xl">
          <div className="mb-7">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-primary">
              The Aurora difference
            </p>

            <h3 className="mt-3 text-2xl font-bold tracking-tight md:text-3xl">
              A simpler way to understand the path.
            </h3>

            <p className="mt-3 max-w-2xl text-sm leading-7 text-muted-foreground md:text-base">
              The important numbers stay visible: the vehicle, the price, your
              contribution, and what comes next.
            </p>
          </div>

          {/* Feature list */}
          <div className="border-y border-border/70">
            {features.map((feature) => {
              const Icon = feature.icon;

              return (
                <div
                  key={feature.title}
                  className="group border-b border-border/70 py-7 last:border-b-0 md:py-8"
                >
                  <div className="flex items-start gap-5 md:gap-7">
                    {/* Number */}
                    <div className="w-7 shrink-0 pt-1">
                      <span
                        className={`text-xs font-bold tracking-[0.18em] ${feature.color}`}
                      >
                        {feature.number}
                      </span>
                    </div>

                    {/* Icon */}
                    <div
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${feature.iconBg}`}
                    >
                      <Icon className="h-4 w-4" />
                    </div>

                    {/* Content */}
                    <div className="min-w-0 max-w-3xl">
                      <div className="flex items-center gap-3">
                        <h4 className="text-lg font-semibold tracking-tight md:text-xl">
                          {feature.title}
                        </h4>

                        <ArrowUpRight
                          className={`hidden h-4 w-4 shrink-0 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 sm:block ${feature.color}`}
                        />
                      </div>

                      <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground md:text-base md:leading-7">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Board Message */}
        <div className="mx-auto mt-16 max-w-5xl border-t border-border/70 pt-12 md:mt-20 md:pt-14">
          <div className="grid gap-8 lg:grid-cols-[180px_1fr] lg:gap-14">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-primary">
                A Message from the Aurora Board
              </p>

              <div className="mt-4 h-1 w-10 rounded-full bg-gradient-to-r from-primary to-accent" />
            </div>

            <div>
              <blockquote className="max-w-4xl text-xl font-semibold leading-8 tracking-tight md:text-2xl md:leading-9">
                “Every great technology followed the same arc:{" "}
                <span className="aurora-gradient-text">
                  invented for the few, perfected for the many.
                </span>{" "}
                The telephone. The internet. The smartphone. Now the electric
                vehicle. Aurora is the mechanism that closes that gap.”
              </blockquote>

              <div className="mt-8 max-w-3xl space-y-5 text-sm leading-7 text-muted-foreground md:text-base md:leading-8">
                <p>
                  What separates Aurora from every platform in this space is one
                  word:{" "}
                  <span className="font-semibold text-foreground">equity.</span>{" "}
                  Your Aurora journey is built around measurable progress toward
                  ownership, with your contribution and plan reflected
                  throughout the process.
                </p>

                <p>
                  The traditional automotive model was never designed around
                  ownership clarity. Banks charge interest to borrow money.
                  Dealership pricing can be difficult to understand. Aurora was
                  built to challenge that model with{" "}
                  <span className="font-semibold text-foreground">
                    zero interest, clear pricing, and no unnecessary ambiguity.
                  </span>
                </p>

                <p>
                  The price we show you should be the price you understand. The
                  contribution you choose should be visible. The path forward
                  should be clear.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Closing statement */}
        <div className="mx-auto mt-14 max-w-5xl border-t border-border/70 pt-8 md:mt-16 md:pt-10">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-xl font-semibold tracking-tight md:text-2xl">
                Better access.
                <span className="text-primary"> Clearer numbers.</span>
              </p>

              <p className="mt-1 text-base font-medium tracking-tight">
                A defined path toward ownership.
              </p>
            </div>

            <p className="max-w-lg text-sm leading-6 text-muted-foreground md:text-right">
              Aurora gives you the vehicle options, pricing, calculator, and
              support you need to understand your next step before you commit.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
