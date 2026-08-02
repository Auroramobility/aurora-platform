import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { HeroBackground } from "@/components/sections/hero-background";

export function Hero() {
  return (
    <section
      id="home"
      className="relative flex min-h-dvh items-center justify-center pt-16"
    >
      <HeroBackground />

      <div className="container relative flex flex-col items-center px-6 py-24 text-center">
        <h1 className="max-w-4xl animate-fade-up font-display text-4xl font-semibold leading-[1.1] tracking-tight text-foreground sm:text-6xl md:text-7xl">
          Making EV Ownership{" "}
          <span className="bg-gradient-to-r from-aurora-teal to-aurora-violet bg-clip-text text-transparent">
            Accessible
          </span>
        </h1>

        <p className="mt-6 max-w-xl animate-fade-up text-balance text-lg text-muted-foreground [animation-delay:120ms] sm:text-xl">
          Helping more people access reliable electric vehicles through smarter
          ownership solutions.
        </p>

        <div className="mt-10 flex w-full animate-fade-up flex-col items-center gap-3 [animation-delay:220ms] sm:w-auto sm:flex-row sm:gap-4">
          <Button size="lg" className="w-full sm:w-auto" asChild>
            <Link href="#vehicles">
              Explore EV Opportunities
              <ArrowRight className="h-4 w-4" strokeWidth={2.5} />
            </Link>
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="w-full sm:w-auto"
            asChild
          >
            <Link href="#how-it-works">How It Works</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
