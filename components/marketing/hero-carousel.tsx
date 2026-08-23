"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

const slides = [
  {
    image: "/images/hero-1.jpg",
    eyebrow: "The Aurora Access Programme",
    title: "Drive Electric.",
    highlight: "Own Your Way.",
    subtitle: "The EV you want. A smarter way to make it yours.",
    description:
      "Aurora gives you access to eligible EVs at 30–40% below market price, then gives you a clear path toward ownership. Choose your EV. Set your contribution. Build your plan.",
  },
  {
    image: "/images/hero-2.jpg",
    eyebrow: "The Aurora Access Programme",
    title: "Drive Electric.",
    highlight: "Own Your Way.",
    subtitle: "The EV you want. A smarter way to make it yours.",
    description:
      "Aurora gives you access to eligible EVs at 30–40% below market price, then gives you a clear path toward ownership. Choose your EV. Set your contribution. Build your plan.",
  },
  {
    image: "/images/hero-3.jpg",
    eyebrow: "The Aurora Access Programme",
    title: "Drive Electric.",
    highlight: "Own Your Way.",
    subtitle: "The EV you want. A smarter way to make it yours.",
    description:
      "Aurora gives you access to eligible EVs at 30–40% below market price, then gives you a clear path toward ownership. Choose your EV. Set your contribution. Build your plan.",
  },
  {
    image: "/images/hero-4.jpg",
    eyebrow: "The Aurora Access Programme",
    title: "Drive Electric.",
    highlight: "Own Your Way.",
    subtitle: "The EV you want. A smarter way to make it yours.",
    description:
      "Aurora gives you access to eligible EVs at 30–40% below market price, then gives you a clear path toward ownership. Choose your EV. Set your contribution. Build your plan.",
  },
  {
    image: "/images/hero-5.jpg",
    eyebrow: "The Aurora Access Programme",
    title: "Drive Electric.",
    highlight: "Own Your Way.",
    subtitle: "The EV you want. A smarter way to make it yours.",
    description:
      "Aurora gives you access to eligible EVs at 30–40% below market price, then gives you a clear path toward ownership. Choose your EV. Set your contribution. Build your plan.",
  },
  {
    image: "/images/hero-6.jpg",
    eyebrow: "The Aurora Access Programme",
    title: "Drive Electric.",
    highlight: "Own Your Way.",
    subtitle: "The EV you want. A smarter way to make it yours.",
    description:
      "Aurora gives you access to eligible EVs at 30–40% below market price, then gives you a clear path toward ownership. Choose your EV. Set your contribution. Build your plan.",
  },
  {
    image: "/images/hero-7.jpg",
    eyebrow: "The Aurora Access Programme",
    title: "Drive Electric.",
    highlight: "Own Your Way.",
    subtitle: "The EV you want. A smarter way to make it yours.",
    description:
      "Aurora gives you access to eligible EVs at 30–40% below market price, then gives you a clear path toward ownership. Choose your EV. Set your contribution. Build your plan.",
  },
  {
    image: "/images/hero-8.jpg",
    eyebrow: "The Aurora Access Programme",
    title: "Drive Electric.",
    highlight: "Own Your Way.",
    subtitle: "The EV you want. A smarter way to make it yours.",
    description:
      "Aurora gives you access to eligible EVs at 30–40% below market price, then gives you a clear path toward ownership. Choose your EV. Set your contribution. Build your plan.",
  },
];

export function HeroCarousel() {
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

  const slide = slides[active]!;

  return (
    <section
      className="relative h-screen min-h-[600px] overflow-hidden"
      style={{ background: "#0d1710" }}
      aria-label="Aurora Mobility"
    >
      {/* Background slides */}
      {slides.map((item, index) => (
        <div
          key={item.image}
          aria-hidden={index !== active}
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: `url(${item.image})`,
            backgroundSize: "cover",
            backgroundPosition: "center 40%",
            opacity: index === active ? 1 : 0,
            transform: index === active ? "scale(1)" : "scale(1.04)",
            transition:
              "opacity 1.6s cubic-bezier(.4,0,.2,1), transform 8s ease-out",
            willChange: "opacity, transform",
            zIndex: 0,
          }}
        />
      ))}

      {/* Main readability overlay */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 1,
          background:
            "linear-gradient(108deg,rgba(7,15,11,.97) 0%,rgba(7,15,11,.84) 36%,rgba(7,15,11,.34) 64%,rgba(7,15,11,.08) 100%)," +
            "linear-gradient(to top,rgba(7,15,11,.62) 0%,transparent 48%)",
        }}
      />

      {/* Aurora ambient glow */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 2,
          background:
            "radial-gradient(ellipse 50% 45% at 64% 52%,rgba(16,185,129,.09) 0%,transparent 60%)",
        }}
      />

      {/* Subtle grid */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 2,
          backgroundImage:
            "linear-gradient(rgba(255,255,255,.013) 1px,transparent 1px)," +
            "linear-gradient(90deg,rgba(255,255,255,.013) 1px,transparent 1px)",
          backgroundSize: "72px 72px",
          pointerEvents: "none",
        }}
      />

      {/* Hero content */}
      <div
        style={{
          position: "relative",
          zIndex: 10,
          display: "flex",
          height: "100%",
          alignItems: "flex-end",
          paddingBottom: "80px",
          paddingLeft: "clamp(20px, 6vw, 72px)",
          paddingRight: "clamp(20px, 6vw, 72px)",
        }}
      >
        <div
          style={{
            width: "100%",
            maxWidth: "1280px",
            margin: "0 auto",
          }}
        >
          {/* Eyebrow */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "14px",
              marginBottom: "26px",
            }}
          >
            <div
              style={{
                width: "36px",
                height: "2px",
                background: "linear-gradient(90deg,#10b981,#3b82f6)",
              }}
            />

            <span
              style={{
                fontSize: "10px",
                fontWeight: 700,
                letterSpacing: ".28em",
                textTransform: "uppercase",
                color: "#6ee7b7",
                fontFamily: "'DM Sans', sans-serif",
              }}
            >
              {slide.eyebrow}
            </span>
          </div>

          {/* Main copy */}
          <div style={{ maxWidth: "700px" }}>
            <h1
              style={{
                fontFamily: "'Cormorant Garamond', Georgia, serif",
                fontSize: "clamp(48px, 8vw, 76px)",
                fontWeight: 300,
                lineHeight: 1.04,
                letterSpacing: "-.01em",
                color: "#f5f4f0",
                marginBottom: "12px",
              }}
            >
              {slide.title}{" "}
              <strong
                style={{
                  fontWeight: 600,
                  display: "block",
                  background:
                    "linear-gradient(135deg,#6ee7b7 0%,#60a5fa 55%,#a78bfa 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                {slide.highlight}
              </strong>
            </h1>

            {/* Supporting statement */}
            <p
              style={{
                fontSize: "20px",
                color: "#f5f4f0",
                lineHeight: 1.5,
                maxWidth: "600px",
                marginBottom: "16px",
                fontWeight: 400,
              }}
            >
              {slide.subtitle}
            </p>

            {/* Main explanation */}
            <p
              style={{
                fontSize: "15px",
                color: "rgba(232,238,234,.74)",
                lineHeight: 1.8,
                maxWidth: "560px",
                marginBottom: "26px",
                fontWeight: 300,
              }}
            >
              {slide.description}
            </p>

            {/* Pricing */}
            <div
              style={{
                display: "flex",
                alignItems: "flex-end",
                gap: "26px",
                flexWrap: "wrap",
                marginBottom: "26px",
              }}
            >
              {/* Market Price */}
              <div>
                <div
                  style={{
                    fontSize: "10px",
                    fontWeight: 700,
                    letterSpacing: ".18em",
                    textTransform: "uppercase",
                    color: "rgba(255,255,255,.48)",
                    marginBottom: "6px",
                  }}
                >
                  Market Price
                </div>

                <div
                  style={{
                    fontSize: "20px",
                    color: "rgba(255,255,255,.55)",
                    textDecoration: "line-through",
                  }}
                >
                  $XX,XXX
                </div>
              </div>

              {/* Aurora Access Price */}
              <div>
                <div
                  style={{
                    fontSize: "10px",
                    fontWeight: 700,
                    letterSpacing: ".18em",
                    textTransform: "uppercase",
                    color: "#6ee7b7",
                    marginBottom: "6px",
                  }}
                >
                  Aurora Access Price
                </div>

                <div
                  style={{
                    fontSize: "28px",
                    lineHeight: 1,
                    fontWeight: 700,
                    color: "#fff",
                  }}
                >
                  $XX,XXX
                </div>
              </div>

              {/* Savings */}
              <div
                style={{
                  padding: "8px 12px",
                  borderRadius: "5px",
                  background: "rgba(16,185,129,.13)",
                  border: "1px solid rgba(110,231,183,.24)",
                }}
              >
                <span
                  style={{
                    fontSize: "13px",
                    fontWeight: 800,
                    letterSpacing: ".08em",
                    color: "#6ee7b7",
                  }}
                >
                  SAVE 30–40%
                </span>
              </div>
            </div>

            {/* Monthly reference */}
            <div
              style={{
                fontSize: "14px",
                color: "rgba(255,255,255,.65)",
                marginBottom: "30px",
              }}
            >
              As low as{" "}
              <strong
                style={{
                  color: "#fff",
                  fontWeight: 700,
                }}
              >
                $X/month
              </strong>
            </div>

            {/* CTAs */}
            <div
              style={{
                display: "flex",
                gap: "14px",
                flexWrap: "wrap",
              }}
            >
              <Link
                href="/vehicles"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                  background: "linear-gradient(135deg,#10b981,#3b82f6)",
                  color: "#fff",
                  padding: "14px 34px",
                  fontSize: "11px",
                  fontWeight: 700,
                  letterSpacing: ".14em",
                  textTransform: "uppercase",
                  textDecoration: "none",
                  borderRadius: "6px",
                  transition: "transform .2s, box-shadow .2s",
                }}
                onMouseEnter={(event) => {
                  event.currentTarget.style.transform = "translateY(-1px)";
                  event.currentTarget.style.boxShadow =
                    "0 10px 30px rgba(16,185,129,.25)";
                }}
                onMouseLeave={(event) => {
                  event.currentTarget.style.transform = "translateY(0)";
                  event.currentTarget.style.boxShadow = "none";
                }}
              >
                Explore EVs
                <ArrowRight size={14} />
              </Link>

              <Link
                href="#how-aurora-works"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  background: "transparent",
                  color: "rgba(255,255,255,.76)",
                  border: "1px solid rgba(255,255,255,.22)",
                  padding: "14px 28px",
                  fontSize: "11px",
                  fontWeight: 600,
                  letterSpacing: ".12em",
                  textTransform: "uppercase",
                  textDecoration: "none",
                  borderRadius: "6px",
                  transition: "all .2s",
                }}
                onMouseEnter={(event) => {
                  event.currentTarget.style.borderColor =
                    "rgba(255,255,255,.48)";
                  event.currentTarget.style.color = "#fff";
                  event.currentTarget.style.background =
                    "rgba(255,255,255,.06)";
                }}
                onMouseLeave={(event) => {
                  event.currentTarget.style.borderColor =
                    "rgba(255,255,255,.22)";
                  event.currentTarget.style.color = "rgba(255,255,255,.76)";
                  event.currentTarget.style.background = "transparent";
                }}
              >
                How Aurora Works
              </Link>
            </div>
          </div>

          {/* Slide indicators */}
          <div
            style={{
              marginTop: "42px",
              display: "flex",
              gap: "8px",
              alignItems: "center",
            }}
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
                style={{
                  height: "7px",
                  width: index === active ? "22px" : "7px",
                  borderRadius: index === active ? "3px" : "50%",
                  background:
                    index === active ? "#fff" : "rgba(255,255,255,.22)",
                  border: "none",
                  padding: 0,
                  cursor: "pointer",
                  transition: "all .28s",
                  outline: "none",
                }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div
        style={{
          position: "absolute",
          bottom: "36px",
          left: "clamp(20px, 6vw, 72px)",
          zIndex: 10,
          display: "flex",
          alignItems: "center",
          gap: "12px",
          fontSize: "9px",
          letterSpacing: ".22em",
          textTransform: "uppercase",
          color: "rgba(255,255,255,.25)",
        }}
      >
        <div
          style={{
            width: "34px",
            height: "1px",
            background: "rgba(255,255,255,.12)",
          }}
        />
        Scroll
      </div>
    </section>
  );
}
