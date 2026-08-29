"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

const slides = [
  { image: "/images/hero-1.jpg" },
  { image: "/images/hero-2.jpg" },
  { image: "/images/hero-3.jpg" },
  { image: "/images/hero-4.jpg" },
  { image: "/images/hero-5.jpg" },
  { image: "/images/hero-6.jpg" },
  { image: "/images/hero-7.jpg" },
  { image: "/images/hero-8.jpg" },
];

const copy = {
  eyebrow: "The Aurora Access Programme",
  title: "Drive Electric.",
  highlight: "Own Your Way.",
  subtitle: "The EV you want. A smarter way to make it yours.",
  description:
    "Access eligible EVs at 30–40% below market price, with a clear path to ownership.",
};

export type HeroPricing = {
  marketPrice: number | null;
  accessPrice: number | null;
  discountPercent: number | null;
};

function money(value: number | null) {
  if (value == null) return null;
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

export function HeroCarousel({ pricing }: { pricing: HeroPricing }) {
  const [active, setActive] = useState(0);

  const goTo = useCallback((index: number) => {
    setActive(index);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setActive((current) => (current + 1) % slides.length);
    }, 5500);

    return () => clearInterval(timer);
  }, []);

  return (
    <section
      className="relative flex min-h-[100svh] flex-col overflow-hidden bg-[#0d1710] sm:min-h-[680px] lg:h-screen lg:min-h-[680px]"
      aria-label="Aurora Mobility"
    >
      {/* =========================================================
          BACKGROUND SLIDES (next/image: responsive, lazy, one
          real network request per breakpoint instead of 8 full
          -res downloads up front)
          ========================================================= */}

      {slides.map((item, index) => (
        <div
          key={item.image}
          aria-hidden={index !== active}
          className="absolute inset-0"
          style={{
            opacity: index === active ? 1 : 0,
            transition: "opacity 1.6s cubic-bezier(.4,0,.2,1)",
            zIndex: 0,
            pointerEvents: "none",
          }}
        >
          <Image
            src={item.image}
            alt=""
            fill
            priority={index === 0}
            loading={index === 0 ? "eager" : "lazy"}
            sizes="100vw"
            quality={70}
            className="object-cover object-[center_40%] sm:object-[center_35%]"
            style={{
              transform: index === active ? "scale(1)" : "scale(1.04)",
              transition: "transform 8s ease-out",
            }}
          />
        </div>
      ))}

      {/* =========================================================
          MAIN READABILITY OVERLAY
          ========================================================= */}

      <div
        aria-hidden="true"
        className="absolute inset-0 z-[1]"
        style={{
          background:
            "linear-gradient(108deg,rgba(7,15,11,.97) 0%,rgba(7,15,11,.84) 36%,rgba(7,15,11,.34) 64%,rgba(7,15,11,.08) 100%)," +
            "linear-gradient(to top,rgba(7,15,11,.62) 0%,transparent 48%)",
        }}
      />

      {/* Mobile-specific readability layer */}
      <div
        aria-hidden="true"
        className="absolute inset-0 z-[2] sm:hidden"
        style={{
          background:
            "linear-gradient(180deg,rgba(7,15,11,.28) 0%,rgba(7,15,11,.34) 28%,rgba(7,15,11,.74) 56%,rgba(7,15,11,.97) 80%,rgba(7,15,11,1) 100%)",
        }}
      />

      {/* Aurora ambient glow */}
      <div
        aria-hidden="true"
        className="absolute inset-0 z-[2]"
        style={{
          background:
            "radial-gradient(ellipse 50% 45% at 64% 52%,rgba(16,185,129,.09) 0%,transparent 60%)",
        }}
      />

      {/* Subtle grid */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-[2]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,.013) 1px,transparent 1px)," +
            "linear-gradient(90deg,rgba(255,255,255,.013) 1px,transparent 1px)",
          backgroundSize: "72px 72px",
        }}
      />

      {/* =========================================================
          HERO CONTENT
          ========================================================= */}

      <div className="relative z-10 flex flex-1 items-end px-5 pb-8 sm:px-6 sm:pb-20 lg:h-full lg:flex-none lg:px-[clamp(20px,6vw,72px)]">
        <div className="mx-auto w-full max-w-[1280px]">
          {/* Eyebrow */}
          <div className="mb-4 flex items-center gap-3 sm:mb-6 sm:gap-[14px]">
            <div
              className="h-[2px] w-7 sm:w-9"
              style={{ background: "linear-gradient(90deg,#10b981,#3b82f6)" }}
            />
            <span
              className="text-[9px] font-bold uppercase tracking-[.2em] text-[#6ee7b7] sm:text-[10px] sm:tracking-[.28em]"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              {copy.eyebrow}
            </span>
          </div>

          {/* Main copy */}
          <div className="max-w-[700px]">
            <h1
              className="mb-2.5 text-[40px] font-light leading-[1] tracking-[-.01em] sm:mb-3 sm:text-[clamp(48px,8vw,76px)] sm:leading-[1.04]"
              style={{
                fontFamily: "'Cormorant Garamond', Georgia, serif",
                color: "#f5f4f0",
              }}
            >
              {copy.title}{" "}
              <strong
                className="block font-semibold"
                style={{
                  background:
                    "linear-gradient(135deg,#6ee7b7 0%,#60a5fa 55%,#a78bfa 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                {copy.highlight}
              </strong>
            </h1>

            {/* Supporting statement */}
            <p
              className="mb-2.5 max-w-[600px] text-[15px] leading-[1.4] sm:mb-4 sm:text-[20px] sm:leading-[1.5]"
              style={{ color: "#f5f4f0", fontWeight: 400 }}
            >
              {copy.subtitle}
            </p>

            {/* Main explanation — shortened; full version only on sm+ */}
            <p
              className="mb-4 max-w-[560px] text-[13px] leading-[1.5] sm:mb-[26px] sm:text-[15px] sm:leading-[1.8]"
              style={{ color: "rgba(232,238,234,.74)", fontWeight: 300 }}
            >
              {copy.description}
            </p>

            {/* =====================================================
                PRICING — condensed to one row on mobile.
                Real numbers from an actual listed vehicle, computed
                by the same getAuroraPricing() logic used on the
                vehicle pages — not a placeholder.
                ===================================================== */}

            {pricing.marketPrice != null && pricing.accessPrice != null ? (
              <div className="mb-4 flex flex-wrap items-end gap-x-4 gap-y-3 sm:mb-[26px] sm:gap-x-[26px]">
                <div>
                  <div
                    className="mb-1 text-[9px] font-bold uppercase tracking-[.14em] sm:mb-1.5 sm:text-[10px] sm:tracking-[.18em]"
                    style={{ color: "rgba(255,255,255,.48)" }}
                  >
                    Market Price
                  </div>
                  <div
                    className="text-[16px] sm:text-[20px]"
                    style={{
                      color: "rgba(255,255,255,.55)",
                      textDecoration: "line-through",
                    }}
                  >
                    {money(pricing.marketPrice)}
                  </div>
                </div>

                <div>
                  <div
                    className="mb-1 text-[9px] font-bold uppercase tracking-[.14em] sm:mb-1.5 sm:text-[10px] sm:tracking-[.18em]"
                    style={{ color: "#6ee7b7" }}
                  >
                    Aurora Access Price
                  </div>
                  <div
                    className="text-[22px] leading-none sm:text-[28px]"
                    style={{ fontWeight: 700, color: "#fff" }}
                  >
                    {money(pricing.accessPrice)}
                  </div>
                </div>

                {pricing.discountPercent != null ? (
                  <div
                    className="rounded-[5px] px-2.5 py-1.5 sm:py-2"
                    style={{
                      background: "rgba(16,185,129,.13)",
                      border: "1px solid rgba(110,231,183,.24)",
                    }}
                  >
                    <span
                      className="text-[10px] font-extrabold tracking-[.06em] sm:text-[13px] sm:tracking-[.08em]"
                      style={{ color: "#6ee7b7" }}
                    >
                      SAVE {pricing.discountPercent}%
                    </span>
                  </div>
                ) : null}
              </div>
            ) : (
              <div
                className="mb-4 inline-block rounded-[5px] px-2.5 py-1.5 sm:mb-[26px]"
                style={{
                  background: "rgba(16,185,129,.13)",
                  border: "1px solid rgba(110,231,183,.24)",
                }}
              >
                <span
                  className="text-[10px] font-extrabold tracking-[.06em] sm:text-[13px] sm:tracking-[.08em]"
                  style={{ color: "#6ee7b7" }}
                >
                  SAVE 30–40% VS MARKET PRICE
                </span>
              </div>
            )}

            {/* Financing reference */}
            <div
              className="mb-4 text-[13px] sm:mb-[30px] sm:text-[14px]"
              style={{ color: "rgba(255,255,255,.65)" }}
            >
              Flexible monthly ownership plans — no lump-sum required.
            </div>

            {/* =====================================================
                CTAs
                ===================================================== */}

            <div className="flex flex-col gap-2.5 sm:flex-row sm:gap-[14px]">
              <Link
                href="/vehicles"
                className="inline-flex items-center justify-center gap-2 rounded-md px-7 py-3 text-[10px] font-bold uppercase tracking-[.13em] text-white transition-transform duration-200 sm:px-[34px] sm:py-3.5 sm:text-[11px] sm:tracking-[.14em]"
                style={{
                  background: "linear-gradient(135deg,#10b981,#3b82f6)",
                }}
              >
                Explore EVs
                <ArrowRight size={14} />
              </Link>

              <Link
                href="#how-aurora-works"
                className="inline-flex items-center justify-center rounded-md px-7 py-3 text-[10px] font-semibold uppercase tracking-[.11em] transition-all duration-200 sm:py-3.5 sm:text-[11px] sm:tracking-[.12em]"
                style={{
                  background: "transparent",
                  color: "rgba(255,255,255,.76)",
                  border: "1px solid rgba(255,255,255,.22)",
                }}
              >
                How Aurora Works
              </Link>
            </div>
          </div>

          {/* =====================================================
              SLIDE INDICATORS
              ===================================================== */}

          <div
            className="mt-5 flex items-center gap-2 sm:mt-[42px]"
            role="tablist"
            aria-label="Hero slides"
          >
            {slides.map((item, index) => (
              <button
                key={item.image}
                type="button"
                onClick={() => goTo(index)}
                aria-label={`Show slide ${index + 1}`}
                aria-selected={index === active}
                role="tab"
                className="cursor-pointer border-0 p-0 outline-none"
                style={{
                  height: "7px",
                  width: index === active ? "22px" : "7px",
                  borderRadius: index === active ? "3px" : "50%",
                  background:
                    index === active ? "#fff" : "rgba(255,255,255,.22)",
                  transition: "all .28s",
                }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* =========================================================
          SCROLL INDICATOR
          ========================================================= */}

      <div className="absolute bottom-8 left-5 z-10 hidden items-center gap-3 text-[9px] uppercase tracking-[.22em] text-white/25 sm:left-[clamp(20px,6vw,72px)] sm:flex">
        <div
          className="h-px w-[34px]"
          style={{ background: "rgba(255,255,255,.12)" }}
        />
        Scroll
      </div>
    </section>
  );
}
