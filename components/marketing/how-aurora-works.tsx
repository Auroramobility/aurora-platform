import {
  CarFront,
  ArrowRight,
  BadgeDollarSign,
  TrendingUp,
  KeyRound,
} from "lucide-react";

const steps = [
  {
    number: "01",
    title: "Choose Your EV",
    description:
      "Browse electric vehicles from leading brands and compare the models, specifications, range, and pricing that matter to you.",
    color: "blue",
    icon: CarFront,
  },
  {
    number: "02",
    title: "Access a Better Price",
    description:
      "Aurora vehicles are typically offered at prices 20% to 30% below the wider market, making premium EV ownership more within reach.",
    color: "green",
    icon: BadgeDollarSign,
  },
  {
    number: "03",
    title: "Build Your Equity",
    description:
      "Your ownership plan turns your payments into progress. As you pay, your recognized equity in the vehicle grows.",
    color: "purple",
    icon: TrendingUp,
  },
  {
    number: "04",
    title: "Complete Your Ownership",
    description:
      "Reach the end of your plan and complete the ownership journey. The goal is simple: the vehicle becomes yours.",
    color: "amber",
    icon: KeyRound,
  },
] as const;

const colorStyles = {
  blue: {
    shell:
      "border-blue-200 bg-blue-50/90 hover:border-blue-300 hover:bg-blue-100/90 dark:border-blue-400/20 dark:bg-blue-500/[0.08] dark:hover:bg-blue-500/[0.14]",
    glow: "bg-blue-400/[0.14] dark:bg-blue-400/[0.10]",
    icon: "bg-blue-500/15 text-blue-600 ring-1 ring-blue-500/20 dark:bg-blue-400/15 dark:text-blue-400 dark:ring-blue-400/20",
    number: "text-blue-600/25 dark:text-blue-400/25",
    label: "text-blue-700 dark:text-blue-400",
    accent: "bg-blue-500",
    arrow:
      "text-blue-500/60 group-hover:text-blue-600 dark:text-blue-400/50 dark:group-hover:text-blue-400",
  },

  green: {
    shell:
      "border-emerald-200 bg-emerald-50/90 hover:border-emerald-300 hover:bg-emerald-100/90 dark:border-emerald-400/20 dark:bg-emerald-500/[0.08] dark:hover:bg-emerald-500/[0.14]",
    glow: "bg-emerald-400/[0.14] dark:bg-emerald-400/[0.10]",
    icon: "bg-emerald-500/15 text-emerald-600 ring-1 ring-emerald-500/20 dark:bg-emerald-400/15 dark:text-emerald-400 dark:ring-emerald-400/20",
    number: "text-emerald-600/25 dark:text-emerald-400/25",
    label: "text-emerald-700 dark:text-emerald-400",
    accent: "bg-emerald-500",
    arrow:
      "text-emerald-500/60 group-hover:text-emerald-600 dark:text-emerald-400/50 dark:group-hover:text-emerald-400",
  },

  purple: {
    shell:
      "border-purple-200 bg-purple-50/90 hover:border-purple-300 hover:bg-purple-100/90 dark:border-purple-400/20 dark:bg-purple-500/[0.08] dark:hover:bg-purple-500/[0.14]",
    glow: "bg-purple-400/[0.14] dark:bg-purple-400/[0.10]",
    icon: "bg-purple-500/15 text-purple-600 ring-1 ring-purple-500/20 dark:bg-purple-400/15 dark:text-purple-400 dark:ring-purple-400/20",
    number: "text-purple-600/25 dark:text-purple-400/25",
    label: "text-purple-700 dark:text-purple-400",
    accent: "bg-purple-500",
    arrow:
      "text-purple-500/60 group-hover:text-purple-600 dark:text-purple-400/50 dark:group-hover:text-purple-400",
  },

  amber: {
    shell:
      "border-amber-200 bg-amber-50/90 hover:border-amber-300 hover:bg-amber-100/90 dark:border-amber-400/20 dark:bg-amber-500/[0.08] dark:hover:bg-amber-500/[0.14]",
    glow: "bg-amber-400/[0.15] dark:bg-amber-400/[0.10]",
    icon: "bg-amber-500/15 text-amber-600 ring-1 ring-amber-500/20 dark:bg-amber-400/15 dark:text-amber-400 dark:ring-amber-400/20",
    number: "text-amber-600/25 dark:text-amber-400/25",
    label: "text-amber-700 dark:text-amber-400",
    accent: "bg-amber-500",
    arrow:
      "text-amber-500/60 group-hover:text-amber-600 dark:text-amber-400/50 dark:group-hover:text-amber-400",
  },
} as const;

export function HowAuroraWorks() {
  return (
    <section
      id="how-aurora-works"
      className="relative overflow-hidden border-y border-border/60 bg-muted/20"
    >
      {/* Ambient background */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute -left-24 top-16 h-80 w-80 rounded-full bg-blue-500/[0.08] blur-3xl dark:bg-blue-500/[0.10]" />
        <div className="absolute left-[38%] top-32 h-72 w-72 rounded-full bg-emerald-500/[0.06] blur-3xl dark:bg-emerald-500/[0.08]" />
        <div className="absolute bottom-20 right-[28%] h-80 w-80 rounded-full bg-purple-500/[0.07] blur-3xl dark:bg-purple-500/[0.09]" />
        <div className="absolute -right-20 bottom-0 h-72 w-72 rounded-full bg-amber-500/[0.08] blur-3xl dark:bg-amber-500/[0.10]" />
      </div>

      <div className="relative mx-auto max-w-7xl px-6 py-24 sm:px-8 md:py-28">
        {/* Heading */}
        <div className="mx-auto max-w-4xl text-center">
          <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/5 px-4 py-2">
            <span className="mr-2 h-1.5 w-1.5 rounded-full bg-primary" />

            <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-primary">
              How Aurora Works
            </span>
          </div>

          <h2 className="mt-5 text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
            From choosing your EV
            <span className="aurora-gradient-text block">
              to making it yours.
            </span>
          </h2>

          <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-muted-foreground">
            Aurora gives you a clearer way to approach electric vehicle
            ownership. Find the vehicle you want, access it at a more accessible
            price, build equity through your plan, and work toward full
            ownership.
          </p>
        </div>

        {/* Steps */}
        <div className="relative mt-16 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {steps.map((step) => {
            const Icon = step.icon;
            const styles = colorStyles[step.color];

            return (
              <div
                key={step.number}
                className={`group relative min-h-[390px] overflow-hidden rounded-[2rem] border p-7 shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-xl ${styles.shell}`}
              >
                {/* Color glow */}
                <div
                  aria-hidden="true"
                  className={`pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full blur-3xl transition-transform duration-500 group-hover:scale-125 ${styles.glow}`}
                />

                {/* Top accent */}
                <div
                  aria-hidden="true"
                  className={`absolute inset-x-7 top-0 h-1 rounded-b-full opacity-80 ${styles.accent}`}
                />

                <div className="relative flex h-full flex-col">
                  {/* Number */}
                  <div className="flex items-start justify-between">
                    <div
                      className={`text-6xl font-black tracking-tight ${styles.number}`}
                    >
                      {step.number}
                    </div>

                    <div
                      className={`mt-1 flex h-8 w-8 items-center justify-center rounded-full bg-background/60 text-xs font-bold ${styles.label}`}
                    >
                      {step.number}
                    </div>
                  </div>

                  {/* Icon */}
                  <div
                    className={`mt-7 flex h-14 w-14 items-center justify-center rounded-2xl ${styles.icon}`}
                  >
                    <Icon className="h-6 w-6" />
                  </div>

                  {/* Content */}
                  <h3 className="mt-7 text-xl font-bold tracking-tight text-foreground">
                    {step.title}
                  </h3>

                  <p className="mt-3 text-sm leading-7 text-muted-foreground">
                    {step.description}
                  </p>

                  {/* Bottom accent */}
                  <div className="mt-auto flex items-center justify-between pt-8">
                    <div
                      className={`h-1.5 w-12 rounded-full opacity-80 transition-all duration-300 group-hover:w-16 ${styles.accent}`}
                    />

                    <ArrowRight
                      className={`h-5 w-5 transition-transform duration-300 group-hover:translate-x-1 ${styles.arrow}`}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Progress message */}
        <div className="mt-10 flex flex-col items-center justify-between gap-5 rounded-3xl border border-border bg-background/80 p-6 shadow-sm backdrop-blur-sm md:flex-row md:px-8">
          <div>
            <p className="text-sm font-semibold">
              One clear journey. Four meaningful steps.
            </p>

            <p className="mt-1 text-sm text-muted-foreground">
              Choose the vehicle, understand the price, build your equity, and
              keep moving toward ownership.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="h-2 w-8 rounded-full bg-blue-500" />
            <span className="h-2 w-8 rounded-full bg-emerald-500" />
            <span className="h-2 w-8 rounded-full bg-purple-500" />
            <span className="h-2 w-8 rounded-full bg-amber-500" />
          </div>
        </div>
      </div>
    </section>
  );
}
