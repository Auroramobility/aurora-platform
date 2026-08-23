import {
  CarFront,
  Calculator,
  Zap,
  KeyRound,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";

const steps = [
  {
    number: "01",
    title: "Choose Your EV",
    description:
      "Find the electric vehicle that fits your needs from Aurora's growing collection of leading EV brands.",
    icon: CarFront,
    color: "blue",
  },
  {
    number: "02",
    title: "Choose Your Path",
    description:
      "Use the Aurora calculator to see exactly what 30% means for your vehicle. Pay the threshold in full or choose a monthly plan.",
    icon: Calculator,
    color: "purple",
  },
  {
    number: "03",
    title: "Reach 30% Your Way",
    description:
      "Build toward the 30% threshold through monthly payments or accelerate whenever you want to reach it sooner.",
    icon: Zap,
    color: "amber",
  },
  {
    number: "04",
    title: "Take Delivery",
    description:
      "Once the required 30% threshold is reached, you can move forward with vehicle delivery and continue toward full ownership.",
    icon: KeyRound,
    color: "green",
  },
] as const;

const colorStyles = {
  blue: {
    card: "border-blue-200/80 bg-blue-50/90 hover:border-blue-300 hover:bg-blue-50 dark:border-blue-400/20 dark:bg-blue-500/[0.07] dark:hover:bg-blue-500/[0.12]",
    icon: "bg-blue-500/10 text-blue-600 dark:bg-blue-400/15 dark:text-blue-400",
    number: "text-blue-600/15 dark:text-blue-400/15",
    accent: "bg-blue-500",
    glow: "bg-blue-500/[0.08]",
  },
  purple: {
    card: "border-purple-200/80 bg-purple-50/90 hover:border-purple-300 hover:bg-purple-50 dark:border-purple-400/20 dark:bg-purple-500/[0.07] dark:hover:bg-purple-500/[0.12]",
    icon: "bg-purple-500/10 text-purple-600 dark:bg-purple-400/15 dark:text-purple-400",
    number: "text-purple-600/15 dark:text-purple-400/15",
    accent: "bg-purple-500",
    glow: "bg-purple-500/[0.08]",
  },
  amber: {
    card: "border-amber-200/80 bg-amber-50/90 hover:border-amber-300 hover:bg-amber-50 dark:border-amber-400/20 dark:bg-amber-500/[0.07] dark:hover:bg-amber-500/[0.12]",
    icon: "bg-amber-500/10 text-amber-600 dark:bg-amber-400/15 dark:text-amber-400",
    number: "text-amber-600/15 dark:text-amber-400/15",
    accent: "bg-amber-500",
    glow: "bg-amber-500/[0.08]",
  },
  green: {
    card: "border-emerald-200/80 bg-emerald-50/90 hover:border-emerald-300 hover:bg-emerald-50 dark:border-emerald-400/20 dark:bg-emerald-500/[0.07] dark:hover:bg-emerald-500/[0.12]",
    icon: "bg-emerald-500/10 text-emerald-600 dark:bg-emerald-400/15 dark:text-emerald-400",
    number: "text-emerald-600/15 dark:text-emerald-400/15",
    accent: "bg-emerald-500",
    glow: "bg-emerald-500/[0.08]",
  },
} as const;

export function OwnershipJourney() {
  return (
    <section className="relative overflow-hidden bg-muted/30 py-24 md:py-28">
      {/* Ambient background */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute left-[3%] top-16 h-80 w-80 rounded-full bg-blue-500/[0.06] blur-3xl dark:bg-blue-500/[0.08]" />
        <div className="absolute left-[38%] top-[35%] h-72 w-72 rounded-full bg-purple-500/[0.05] blur-3xl dark:bg-purple-500/[0.08]" />
        <div className="absolute bottom-10 right-[4%] h-96 w-96 rounded-full bg-emerald-500/[0.06] blur-3xl dark:bg-emerald-500/[0.08]" />
      </div>

      <div className="relative mx-auto max-w-7xl px-6 sm:px-8">
        {/* Heading */}
        <div className="mx-auto max-w-4xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/15 bg-primary/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-primary">
            <span className="h-1.5 w-1.5 rounded-full bg-primary" />
            Your Ownership Journey
          </div>

          <h2 className="mt-6 text-4xl font-bold leading-tight tracking-tight md:text-5xl lg:text-6xl">
            You choose the vehicle.
            <span className="aurora-gradient-text block">
              You choose how you reach it.
            </span>
          </h2>

          <p className="mx-auto mt-6 max-w-3xl text-base leading-8 text-muted-foreground md:text-lg">
            Aurora gives you a clear path to your EV without forcing everyone
            into the same payment structure. See the numbers, choose your
            approach, and move at a pace that works for you.
          </p>
        </div>

        {/* Journey steps */}
        <div className="relative mt-16">
          {/* Desktop connecting line */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute left-[12.5%] right-[12.5%] top-[74px] hidden h-px bg-gradient-to-r from-blue-300 via-amber-300 via-purple-300 to-emerald-300 dark:from-blue-500/30 dark:via-amber-500/30 dark:via-purple-500/30 dark:to-emerald-500/30 lg:block"
          />

          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {steps.map((step) => {
              const Icon = step.icon;
              const styles = colorStyles[step.color];

              return (
                <div
                  key={step.number}
                  className={`group relative overflow-hidden rounded-3xl border p-7 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${styles.card}`}
                >
                  {/* Glow */}
                  <div
                    aria-hidden="true"
                    className={`pointer-events-none absolute -right-12 -top-12 h-32 w-32 rounded-full blur-2xl ${styles.glow}`}
                  />

                  <div className="relative">
                    <div className="flex items-start justify-between">
                      <div
                        className={`flex h-14 w-14 items-center justify-center rounded-2xl ${styles.icon}`}
                      >
                        <Icon className="h-6 w-6" />
                      </div>

                      <span
                        className={`text-5xl font-black tracking-tight ${styles.number}`}
                      >
                        {step.number}
                      </span>
                    </div>

                    <h3 className="mt-8 text-xl font-bold tracking-tight">
                      {step.title}
                    </h3>

                    <p className="mt-3 text-sm leading-7 text-muted-foreground">
                      {step.description}
                    </p>

                    <div className="mt-7 flex items-center justify-between">
                      <div
                        className={`h-1 w-10 rounded-full ${styles.accent}`}
                      />

                      <ArrowRight className="h-4 w-4 text-muted-foreground/50 transition-all duration-300 group-hover:translate-x-1 group-hover:text-foreground" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Payment paths */}
        <div className="mt-12 grid gap-6 lg:grid-cols-2">
          {/* Option One */}
          <div className="group relative overflow-hidden rounded-3xl border border-blue-200/70 bg-blue-50/70 p-8 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-blue-300 hover:shadow-xl dark:border-blue-400/20 dark:bg-blue-500/[0.06] md:p-10">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-blue-500/[0.09] blur-3xl"
            />

            <div className="relative">
              <div className="flex items-center justify-between">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-blue-600 dark:text-blue-400">
                  Option One
                </p>

                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10 text-blue-600 dark:bg-blue-400/15 dark:text-blue-400">
                  <CheckCircle2 className="h-5 w-5" />
                </div>
              </div>

              <h3 className="mt-4 text-2xl font-bold tracking-tight md:text-3xl">
                Reach 30% in full
              </h3>

              <p className="mt-4 leading-7 text-muted-foreground">
                If you are ready, you can use the Aurora calculator to see the
                exact 30% amount for your chosen vehicle and pay that threshold
                in full.
              </p>

              <div className="mt-7 rounded-2xl border border-blue-200/70 bg-white/60 p-5 dark:border-blue-400/15 dark:bg-white/[0.04]">
                <p className="text-sm font-semibold">
                  Simple. Clear. No guessing.
                </p>

                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  The calculator shows the vehicle price, the 30% threshold, and
                  what remains after that point.
                </p>
              </div>
            </div>
          </div>

          {/* Option Two */}
          <div className="group relative overflow-hidden rounded-3xl border border-purple-200/70 bg-purple-50/70 p-8 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-purple-300 hover:shadow-xl dark:border-purple-400/20 dark:bg-purple-500/[0.06] md:p-10">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-purple-500/[0.09] blur-3xl"
            />

            <div className="relative">
              <div className="flex items-center justify-between">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-purple-600 dark:text-purple-400">
                  Option Two
                </p>

                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/10 text-purple-600 dark:bg-purple-400/15 dark:text-purple-400">
                  <Calculator className="h-5 w-5" />
                </div>
              </div>

              <h3 className="mt-4 text-2xl font-bold tracking-tight md:text-3xl">
                Build toward 30% monthly
              </h3>

              <p className="mt-4 leading-7 text-muted-foreground">
                Prefer to spread the threshold over time? Choose a monthly
                amount and watch your progress grow. You can increase your
                payments whenever you want.
              </p>

              <div className="mt-7 rounded-2xl border border-purple-200/70 bg-white/60 p-5 dark:border-purple-400/15 dark:bg-white/[0.04]">
                <p className="text-sm font-semibold">
                  Your plan can move faster.
                </p>

                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  There is no reason to wait for the original schedule if you
                  decide to contribute more and reach the 30% threshold sooner.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Calculator message */}
        <div className="relative mt-12 overflow-hidden rounded-[2rem] border border-amber-300/30 bg-gradient-to-br from-amber-500 via-orange-500 to-primary p-8 text-white shadow-xl md:p-12">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-20 -top-24 h-80 w-80 rounded-full bg-white/[0.12] blur-3xl"
          />

          <div
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-24 -left-20 h-72 w-72 rounded-full bg-purple-500/[0.18] blur-3xl"
          />

          <div className="relative mx-auto max-w-4xl text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-white/70">
              The Aurora Calculator
            </p>

            <h3 className="mt-4 text-3xl font-bold tracking-tight md:text-4xl">
              Know your numbers before you commit.
            </h3>

            <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-white/80">
              Select a vehicle, see its Aurora price, calculate the 30%
              threshold, choose your payment approach, and understand exactly
              how quickly you can reach delivery.
            </p>

            <div className="mt-8 grid gap-4 text-left sm:grid-cols-3">
              <div className="rounded-2xl border border-white/15 bg-white/[0.10] p-5 backdrop-blur-sm">
                <p className="text-sm font-semibold">Vehicle Price</p>

                <p className="mt-2 text-sm leading-6 text-white/70">
                  The Aurora price for your chosen EV.
                </p>
              </div>

              <div className="rounded-2xl border border-white/15 bg-white/[0.10] p-5 backdrop-blur-sm">
                <p className="text-sm font-semibold">30% Threshold</p>

                <p className="mt-2 text-sm leading-6 text-white/70">
                  The amount required before delivery.
                </p>
              </div>

              <div className="rounded-2xl border border-white/15 bg-white/[0.10] p-5 backdrop-blur-sm">
                <p className="text-sm font-semibold">Your Timeline</p>

                <p className="mt-2 text-sm leading-6 text-white/70">
                  See how your payment choice changes your timeline.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Final message */}
        <div className="mx-auto mt-12 max-w-3xl text-center">
          <p className="text-xl font-semibold tracking-tight md:text-2xl">
            The goal is not to make you fit our payment plan.
          </p>

          <p className="mt-2 text-xl font-bold text-primary md:text-2xl">
            The goal is to help you build a plan that gets you to ownership.
          </p>
        </div>
      </div>
    </section>
  );
}
