import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";

type WelcomeHeroProps = {
  firstName: string;
};

export function WelcomeHero({ firstName }: WelcomeHeroProps) {
  return (
    <section className="overflow-hidden rounded-3xl border bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 p-10 text-white">
      <p className="text-sm uppercase tracking-[0.25em] text-white/70">
        Welcome Back
      </p>

      <h1 className="mt-4 text-4xl font-bold">
        Good to see you,
        <span className="block text-primary">{firstName}</span>
      </h1>

      <p className="mt-6 max-w-2xl text-lg leading-8 text-white/80">
        Continue your journey toward owning a premium electric vehicle. Explore
        new arrivals, compare brands, and track your ownership progress—all in
        one place.
      </p>

      <div className="mt-8 flex flex-wrap gap-4">
        <Button asChild size="lg">
          <Link href="/vehicles">
            Browse Vehicles
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>

        <Button asChild size="lg" variant="secondary">
          <Link href="/profile">Complete Profile</Link>
        </Button>
      </div>
    </section>
  );
}
