"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { ArrowRight, Zap } from "lucide-react";

const slides = [
  { image: "/images/hero-1.jpg", title: "Own Premium Electric Vehicles", subtitle: "A transparent ownership path designed around equity." },
  { image: "/images/hero-2.jpg", title: "Luxury Without Barriers", subtitle: "Access the world's most advanced electric vehicles." },
  { image: "/images/hero-3.jpg", title: "The Future Of Mobility", subtitle: "Build ownership through a smarter EV financing model." },
  { image: "/images/hero-4.jpg", title: "Drive Electric. Own Smarter.", subtitle: "Aurora makes premium EV ownership accessible." },
  { image: "/images/hero-5.jpg", title: "Your Next Vehicle Awaits", subtitle: "Start your Aurora ownership journey today." },
];

export function HeroCarousel() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActive((c) => (c + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const slide = slides[active] ?? slides[0];
  if (!slide) return null;

  return (
    <section className="relative min-h-screen overflow-hidden">
      {/* Background image */}
      <Image
        src={slide.image}
        alt={slide.title}
        fill
        priority
        className="object-cover transition-all duration-1000"
      />

      {/* Deep gradient overlay — bottom-up so image breathes at top */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/55 to-black/20" />

      {/* Ambient teal glow bottom-left */}
      <div className="absolute bottom-0 left-0 h-[50vh] w-[40vw] aurora-glow-teal pointer-events-none" />
      {/* Violet glow top-right */}
      <div className="absolute top-0 right-0 h-[40vh] w-[35vw] aurora-glow-violet pointer-events-none" />

      <div className="relative z-10 flex min-h-screen items-end px-8 pb-24">
        <div className="mx-auto w-full max-w-7xl">

          {/* Badge */}
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-4 py-1.5 backdrop-blur-sm">
            <Zap className="h-3.5 w-3.5 text-primary" />
            <span className="text-xs font-semibold uppercase tracking-widest text-primary">
              Aurora Mobility
            </span>
          </div>

          <div className="max-w-4xl animate-fade-up">
            <h1 className="text-5xl font-bold leading-[1.05] tracking-tight text-white md:text-7xl">
              {slide.title.split(" ").slice(0, -2).join(" ")}{" "}
              <span className="aurora-gradient-text">
                {slide.title.split(" ").slice(-2).join(" ")}
              </span>
            </h1>

            <p className="mt-6 max-w-2xl text-lg text-white/75">
              {slide.subtitle}
            </p>

            <div className="mt-10 flex flex-wrap gap-4">
              <Button size="lg" className="aurora-gradient border-0 text-background font-semibold shadow-lg shadow-primary/30 hover:shadow-primary/50 hover:scale-105 transition-all" asChild>
                <Link href="/vehicles">
                  Explore Vehicles <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="border-white/30 bg-white/5 text-white backdrop-blur-sm hover:bg-white/15 hover:border-white/50" asChild>
                <Link href="/signup">Get Started</Link>
              </Button>
            </div>
          </div>

          {/* Slide indicators */}
          <div className="mt-12 flex gap-2">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => setActive(i)}
                aria-label={`Slide ${i + 1}`}
                className={`h-1 rounded-full transition-all duration-500 ${
                  i === active
                    ? "w-8 bg-primary"
                    : "w-2 bg-white/30 hover:bg-white/50"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
