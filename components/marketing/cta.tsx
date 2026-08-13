import Link from "next/link";
import { ArrowRight, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";

export function CTA() {
  return (
    <section className="mx-auto max-w-7xl px-8 py-24">
      <div className="relative overflow-hidden rounded-[2.5rem] p-px aurora-gradient">
        <div className="relative rounded-[2.4rem] bg-background px-8 py-20 text-center md:px-16 overflow-hidden">

          {/* Ambient glows inside the box */}
          <div className="pointer-events-none absolute -top-20 left-1/4 h-64 w-64 aurora-glow-teal opacity-60" />
          <div className="pointer-events-none absolute -bottom-20 right-1/4 h-64 w-64 aurora-glow-violet opacity-60" />

          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 mb-6">
              <Zap className="h-3.5 w-3.5 text-primary" />
              <span className="text-xs font-semibold uppercase tracking-widest text-primary">
                Start Your Journey
              </span>
            </div>

            <h2 className="text-4xl font-bold tracking-tight md:text-6xl">
              Your next electric vehicle{" "}
              <span className="block aurora-gradient-text">
                is closer than you think.
              </span>
            </h2>

            <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
              Explore premium electric vehicles and discover a smarter path
              toward ownership with Aurora.
            </p>

            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button
                size="lg"
                className="aurora-gradient border-0 text-background font-semibold shadow-lg shadow-primary/25 hover:shadow-primary/40 hover:scale-105 transition-all"
                asChild
              >
                <Link href="/vehicles">
                  Explore Vehicles <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/signup">Create Account</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
