import Link from "next/link";
import { CheckCircle2, ArrowRight } from "lucide-react";

import type { OwnershipJourneyState } from "@/features/applications/lib/get-ownership-journey";

type Props = {
  state: OwnershipJourneyState;
};

const steps = [
  {
    key: "profileComplete",
    title: "Complete Profile",
    description: "Add the information needed to begin your journey.",
    href: "/profile",
    tone: "blue",
  },
  {
    key: "identityVerified",
    title: "Verify Identity",
    description: "Confirm your identity securely with Aurora.",
    href: "/profile",
    tone: "purple",
  },
  {
    key: "vehicleChosen",
    title: "Choose Vehicle",
    description: "Find the EV that fits your needs.",
    href: "/vehicles",
    tone: "teal",
  },
  {
    key: "applicationSubmitted",
    title: "Submit Application",
    description: "Send your ownership application for review.",
    href: "/applications",
    tone: "amber",
  },
  {
    key: "ownershipApproved",
    title: "Ownership Approved",
    description: "Aurora confirms your ownership plan.",
    href: "/applications",
    tone: "green",
  },
  {
    key: "ownershipActive",
    title: "Drive Your EV",
    description: "Your ownership journey becomes reality.",
    href: "/applications",
    tone: "violet",
  },
] as const;

const tones = {
  blue: {
    card: "border-blue-200 bg-blue-50/80 hover:bg-blue-100/90 dark:border-blue-500/20 dark:bg-blue-500/[0.07] dark:hover:bg-blue-500/[0.11]",
    number: "bg-blue-500 text-white shadow-blue-500/20",
    title: "text-blue-950 dark:text-blue-100",
    description: "text-blue-800/70 dark:text-blue-200/70",
    arrow: "text-blue-500 dark:text-blue-300",
  },

  purple: {
    card: "border-violet-200 bg-violet-50/80 hover:bg-violet-100/90 dark:border-violet-500/20 dark:bg-violet-500/[0.07] dark:hover:bg-violet-500/[0.11]",
    number: "bg-violet-500 text-white shadow-violet-500/20",
    title: "text-violet-950 dark:text-violet-100",
    description: "text-violet-800/70 dark:text-violet-200/70",
    arrow: "text-violet-500 dark:text-violet-300",
  },

  teal: {
    card: "border-teal-200 bg-teal-50/80 hover:bg-teal-100/90 dark:border-teal-500/20 dark:bg-teal-500/[0.07] dark:hover:bg-teal-500/[0.11]",
    number: "bg-teal-500 text-white shadow-teal-500/20",
    title: "text-teal-950 dark:text-teal-100",
    description: "text-teal-800/70 dark:text-teal-200/70",
    arrow: "text-teal-500 dark:text-teal-300",
  },

  amber: {
    card: "border-amber-200 bg-amber-50/80 hover:bg-amber-100/90 dark:border-amber-500/20 dark:bg-amber-500/[0.07] dark:hover:bg-amber-500/[0.11]",
    number: "bg-amber-500 text-white shadow-amber-500/20",
    title: "text-amber-950 dark:text-amber-100",
    description: "text-amber-800/70 dark:text-amber-200/70",
    arrow: "text-amber-500 dark:text-amber-300",
  },

  green: {
    card: "border-emerald-200 bg-emerald-50/80 hover:bg-emerald-100/90 dark:border-emerald-500/20 dark:bg-emerald-500/[0.07] dark:hover:bg-emerald-500/[0.11]",
    number: "bg-emerald-500 text-white shadow-emerald-500/20",
    title: "text-emerald-950 dark:text-emerald-100",
    description: "text-emerald-800/70 dark:text-emerald-200/70",
    arrow: "text-emerald-500 dark:text-emerald-300",
  },

  violet: {
    card: "border-indigo-200 bg-indigo-50/80 hover:bg-indigo-100/90 dark:border-indigo-500/20 dark:bg-indigo-500/[0.07] dark:hover:bg-indigo-500/[0.11]",
    number: "bg-indigo-500 text-white shadow-indigo-500/20",
    title: "text-indigo-950 dark:text-indigo-100",
    description: "text-indigo-800/70 dark:text-indigo-200/70",
    arrow: "text-indigo-500 dark:text-indigo-300",
  },
};

export function OwnershipJourney({ state }: Props) {
  return (
    <section className="overflow-hidden rounded-3xl border border-border bg-surface p-6 shadow-sm sm:p-8">
      {/* Header */}
      <div className="mb-8">
        <p className="text-xs font-bold uppercase tracking-[0.24em] text-primary">
          Ownership Journey
        </p>

        <h2 className="mt-3 text-3xl font-bold tracking-tight">
          Your Progress
        </h2>

        <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base">
          Every completed step moves you closer to owning your electric vehicle.
        </p>
      </div>

      {/* Journey */}
      <div className="grid gap-4 md:grid-cols-2">
        {steps.map((step, index) => {
          const completed = state[step.key];
          const tone = tones[step.tone];

          return (
            <Link
              key={step.key}
              href={step.href}
              className={`group relative overflow-hidden rounded-2xl border p-5 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md ${tone.card} `}
            >
              {/* Step number / completion */}
              <div className="flex items-start gap-4">
                <div
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-sm font-bold shadow-sm ${tone.number} `}
                >
                  {completed ? (
                    <CheckCircle2 className="h-5 w-5" />
                  ) : (
                    String(index + 1).padStart(2, "0")
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className={`font-bold tracking-tight ${tone.title}`}>
                        {step.title}
                      </h3>

                      <p
                        className={`mt-1 text-sm leading-5 ${tone.description}`}
                      >
                        {step.description}
                      </p>
                    </div>

                    <ArrowRight
                      className={`mt-1 h-4 w-4 shrink-0 transition-transform duration-200 group-hover:translate-x-1 ${tone.arrow} `}
                    />
                  </div>

                  {/* Status */}
                  <div className="mt-4">
                    {completed ? (
                      <span className="inline-flex rounded-full bg-emerald-500/15 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-emerald-700 dark:text-emerald-300">
                        Complete
                      </span>
                    ) : (
                      <span className="inline-flex rounded-full bg-black/5 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-muted-foreground dark:bg-white/5">
                        Next Step
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
