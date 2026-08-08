"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const slides = [
  {
    image: "/images/hero-1.jpg",
    title: "Own Premium Electric Vehicles",
    subtitle: "A transparent ownership path designed around equity.",
  },
  {
    image: "/images/hero-2.jpg",
    title: "Luxury Without Barriers",
    subtitle: "Access the world's most advanced electric vehicles.",
  },
  {
    image: "/images/hero-3.jpg",
    title: "The Future Of Mobility",
    subtitle: "Build ownership through a smarter EV financing model.",
  },
  {
    image: "/images/hero-4.jpg",
    title: "Drive Electric. Own Smarter.",
    subtitle: "Aurora makes premium EV ownership accessible.",
  },
  {
    image: "/images/hero-5.jpg",
    title: "Your Next Vehicle Awaits",
    subtitle: "Start your Aurora ownership journey today.",
  },
];

export function HeroCarousel() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActive((current) => (current + 1) % slides.length);
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  const slide = slides[active] ?? slides[0];

  if (!slide) {
    return null;
  }

  return (
    <section className="relative min-h-screen overflow-hidden">
      <Image
        src={slide.image}
        alt={slide.title}
        fill
        priority
        className="object-cover transition-all duration-1000"
      />

      <div className="absolute inset-0 bg-black/60" />

      <div className="relative z-10 flex min-h-screen items-center px-8">
        <div className="mx-auto w-full max-w-7xl">
          <div className="max-w-4xl text-white">
            <p className="text-sm uppercase tracking-[0.35em] text-white/70">
              Aurora Mobility
            </p>

            <h1 className="mt-6 text-5xl font-bold leading-tight md:text-7xl">
              {slide.title}
            </h1>

            <p className="mt-6 max-w-2xl text-lg text-white/80">
              {slide.subtitle}
            </p>

            <div className="mt-10 flex gap-4">
              <Button size="lg" asChild>
                <Link href="/vehicles">
                  Explore Vehicles
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>

              <Button
                size="lg"
                variant="outline"
                className="border-white/40 bg-transparent text-white"
                asChild
              >
                <Link href="#how-aurora-works">How Aurora Works</Link>
              </Button>
            </div>

            <div className="mt-12 flex gap-3">
              {slides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActive(index)}
                  className={`h-2 rounded-full transition-all ${
                    active === index ? "w-10 bg-white" : "w-2 bg-white/40"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
