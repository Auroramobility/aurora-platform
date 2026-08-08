import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";

export function Hero() {
  return (
    <section className="relative min-h-[90vh] overflow-hidden">
      <Image
        src="/images/hero-ev.jpg"
        alt="Premium electric vehicle"
        fill
        priority
        className="object-cover"
      />

      <div className="absolute inset-0 bg-black/60" />

      <div className="relative z-10 mx-auto flex min-h-[90vh] max-w-7xl items-center px-8">
        <div className="max-w-4xl text-white">

          <p className="text-sm uppercase tracking-[0.3em] text-white/70">
            The Future of Electric Vehicle Ownership
          </p>

          <h1 className="mt-6 text-5xl font-bold leading-tight tracking-tight md:text-7xl">
            Own Premium
            <span className="block text-primary">
              Electric Vehicles
            </span>
            Without Traditional Barriers.
          </h1>

          <p className="mt-8 max-w-2xl text-lg leading-8 text-white/80">
            Aurora creates a transparent ownership path for premium
            electric vehicles. Build equity, avoid hidden fees,
            and move closer to ownership with every payment.
          </p>


          <div className="mt-10 flex flex-col gap-4 sm:flex-row">

            <Button size="lg" asChild>
              <Link href="/vehicles">
                Explore Vehicles
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>


            <Button
              size="lg"
              variant="outline"
              className="border-white/40 bg-transparent text-white hover:bg-white hover:text-black"
              asChild
            ><Link href="#how-aurora-works">
            How Aurora Works
           </Link>
            </Button>

          </div>


          <div className="mt-16 grid grid-cols-2 gap-8 border-t border-white/20 pt-8 md:grid-cols-4">

            <div>
              <p className="text-4xl font-bold">
                100%
              </p>
              <p className="mt-2 text-white/70">
                Transparent
              </p>
            </div>


            <div>
              <p className="text-4xl font-bold">
                12+
              </p>
              <p className="mt-2 text-white/70">
                EV Brands
              </p>
            </div>


            <div>
              <p className="text-4xl font-bold">
                50%
              </p>
              <p className="mt-2 text-white/70">
                Lower Entry Cost
              </p>
            </div>


            <div>
              <p className="text-4xl font-bold">
                Equity
              </p>
              <p className="mt-2 text-white/70">
                Ownership Model
              </p>
            </div>

          </div>


        </div>
      </div>

    </section>
  );
}