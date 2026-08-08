import Link from "next/link";

import { Button } from "@/components/ui/button";

export function CTA() {
  return (
    <section className="mx-auto max-w-7xl px-8 py-24">

      <div className="rounded-[2.5rem] bg-primary px-8 py-16 text-center text-primary-foreground md:px-16">

        <p className="text-sm uppercase tracking-[0.3em] opacity-80">
          Start Your Journey
        </p>


        <h2 className="mt-6 text-4xl font-bold tracking-tight md:text-6xl">
          Your next electric vehicle
          <span className="block">
            is closer than you think.
          </span>
        </h2>


        <p className="mx-auto mt-6 max-w-2xl text-lg opacity-80">
          Explore premium electric vehicles and discover a
          smarter path toward ownership with Aurora.
        </p>



        <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row">


          <Button
            size="lg"
            variant="secondary"
            asChild
          >
            <Link href="/vehicles">
              Explore Vehicles
            </Link>
          </Button>



          <Button
            size="lg"
            variant="outline"
            className="border-white/40 bg-transparent text-white hover:bg-white hover:text-primary"
            asChild
          >
            <Link href="/signup">
              Create Account
            </Link>
          </Button>


        </div>


      </div>

    </section>
  );
}