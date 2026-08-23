import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";

type WelcomeHeroProps = {
  firstName: string;
};

export function WelcomeHero({ firstName }: WelcomeHeroProps) {
  return (
    <section className="relative overflow-hidden rounded-3xl border border-teal-300/70 bg-gradient-to-br from-teal-100 via-blue-100 to-violet-100 p-8 shadow-sm dark:border-teal-500/20 dark:from-teal-950 dark:via-blue-950 dark:to-violet-950 sm:p-10">
      {/* Decorative Aurora glow */}
      <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-violet-400/25 blur-3xl dark:bg-violet-500/10" />

      <div className="pointer-events-none absolute -bottom-32 -left-20 h-72 w-72 rounded-full bg-teal-400/20 blur-3xl dark:bg-teal-500/10" />

      <div className="relative max-w-3xl">
        <p className="text-xs font-bold uppercase tracking-[0.25em] text-teal-800 dark:text-teal-300">
          Aurora Mobility
        </p>

        <h1 className="mt-4 text-4xl font-bold tracking-tight text-slate-950 dark:text-white sm:text-5xl">
          Good to see you,
          <span className="mt-1 block bg-gradient-to-r from-teal-600 via-blue-600 to-violet-600 bg-clip-text text-transparent dark:from-teal-300 dark:via-blue-300 dark:to-violet-300">
            {firstName}
          </span>
        </h1>

        <p className="mt-6 max-w-2xl text-base leading-7 text-slate-700 dark:text-slate-300 sm:text-lg sm:leading-8">
          Continue your journey toward owning a premium electric vehicle.
          Explore new arrivals, compare brands, and track your ownership
          progress — all in one place.
        </p>

        <div className="mt-8 flex flex-wrap gap-3">
          <Button
            asChild
            size="lg"
            className="border-0 bg-teal-600 font-semibold text-white shadow-lg shadow-teal-600/20 transition-all hover:-translate-y-0.5 hover:bg-teal-700 hover:shadow-teal-600/30 dark:bg-teal-500 dark:text-slate-950 dark:hover:bg-teal-400"
          >
            <Link href="/vehicles">
              Browse Vehicles
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>

          <Button
            asChild
            size="lg"
            variant="outline"
            className="border-blue-300 bg-blue-50/70 font-semibold text-blue-800 hover:bg-blue-100 dark:border-blue-500/30 dark:bg-blue-500/10 dark:text-blue-200 dark:hover:bg-blue-500/20"
          >
            <Link href="/profile">Complete Profile</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
