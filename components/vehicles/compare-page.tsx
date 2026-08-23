"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Battery,
  Check,
  Gauge,
  Search,
  Star,
  X,
  Zap,
} from "lucide-react";

import { useCompareSelection } from "@/features/vehicles/state/use-compare-selection";
import type { Vehicle } from "@/features/vehicles/types/vehicle";

type Props = {
  vehicles: Vehicle[];
};

type Tone = "teal" | "blue" | "violet" | "amber" | "green";

function money(value: number | null) {
  if (value == null) return "—";

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

function formatValue(value: string | number | null | undefined, suffix = "") {
  if (value == null || value === "") return "—";
  return `${value}${suffix}`;
}

function getBestIndexes(
  values: (number | null | undefined)[],
  direction: "high" | "low",
) {
  const valid = values
    .map((value, index) => ({ value, index }))
    .filter(
      (
        item,
      ): item is {
        value: number;
        index: number;
      } => typeof item.value === "number",
    );

  if (valid.length < 2) return [];

  const best =
    direction === "high"
      ? Math.max(...valid.map((item) => item.value))
      : Math.min(...valid.map((item) => item.value));

  return valid.filter((item) => item.value === best).map((item) => item.index);
}

function getTone(tone: Tone) {
  const tones = {
    teal: {
      accent: "hsl(174 82% 42%)",
      soft: "hsl(174 82% 42% / .10)",
      strong: "hsl(174 82% 42% / .18)",
    },
    blue: {
      accent: "hsl(214 92% 58%)",
      soft: "hsl(214 92% 58% / .10)",
      strong: "hsl(214 92% 58% / .18)",
    },
    violet: {
      accent: "hsl(262 82% 66%)",
      soft: "hsl(262 82% 66% / .10)",
      strong: "hsl(262 82% 66% / .18)",
    },
    amber: {
      accent: "hsl(40 92% 55%)",
      soft: "hsl(40 92% 55% / .11)",
      strong: "hsl(40 92% 55% / .20)",
    },
    green: {
      accent: "hsl(151 72% 45%)",
      soft: "hsl(151 72% 45% / .10)",
      strong: "hsl(151 72% 45% / .18)",
    },
  };

  return tones[tone];
}

function SectionHeading({
  icon,
  label,
  count,
  tone = "teal",
}: {
  icon: React.ReactNode;
  label: string;
  count: number;
  tone?: Tone;
}) {
  const selectedTone = getTone(tone);

  return (
    <tr>
      <td
        colSpan={count + 1}
        style={{
          padding: "17px 24px 12px",
          background: `linear-gradient(
            90deg,
            ${selectedTone.strong},
            ${selectedTone.soft},
            transparent
          )`,
          borderTop: `1px solid ${selectedTone.strong}`,
          borderBottom: `1px solid ${selectedTone.strong}`,
        }}
      >
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            fontSize: "9px",
            fontWeight: 800,
            letterSpacing: ".24em",
            textTransform: "uppercase",
            color: selectedTone.accent,
          }}
        >
          {icon}
          {label}
        </span>
      </td>
    </tr>
  );
}

function ComparisonRow({
  label,
  values,
  bestIndexes = [],
  highlight = false,
  tone = "teal",
}: {
  label: string;
  values: string[];
  bestIndexes?: number[];
  highlight?: boolean;
  tone?: Tone;
}) {
  const selectedTone = getTone(tone);

  return (
    <tr
      style={{
        borderTop: "1px solid hsl(var(--border))",
      }}
    >
      <td
        style={{
          padding: "16px 24px",
          fontSize: "10px",
          fontWeight: 800,
          letterSpacing: ".08em",
          color: "hsl(var(--muted-foreground))",
          textTransform: "uppercase",
          whiteSpace: "nowrap",
          background: "hsl(var(--muted) / .22)",
        }}
      >
        {label}
      </td>

      {values.map((value, index) => {
        const isBest = bestIndexes.includes(index);
        const isDash = value === "—";

        return (
          <td
            key={index}
            style={{
              position: "relative",
              padding: highlight ? "20px" : "16px 20px",
              textAlign: "center",
              fontSize: highlight ? "21px" : "14px",
              fontWeight: highlight ? 750 : 500,
              color: isDash
                ? "hsl(var(--muted-foreground) / .55)"
                : "hsl(var(--foreground))",
              background: isBest ? selectedTone.soft : "transparent",
              borderLeft: "1px solid hsl(var(--border))",
              transition: "background .2s ease",
            }}
          >
            {isBest && !isDash && (
              <span
                style={{
                  position: "absolute",
                  top: "6px",
                  right: "8px",
                  fontSize: "7px",
                  fontWeight: 800,
                  letterSpacing: ".1em",
                  textTransform: "uppercase",
                  color: selectedTone.accent,
                }}
              >
                ★ Best
              </span>
            )}

            {value}
          </td>
        );
      })}
    </tr>
  );
}

function VehicleSearchCard({
  vehicle,
  selected,
  disabled,
  onClick,
}: {
  vehicle: Vehicle;
  selected: boolean;
  disabled: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      style={{
        position: "relative",
        width: "100%",
        padding: 0,
        overflow: "hidden",
        textAlign: "left",
        border: selected
          ? "1px solid hsl(174 82% 42% / .75)"
          : "1px solid hsl(var(--border))",
        borderRadius: "18px",
        background: selected
          ? "linear-gradient(145deg, hsl(174 82% 42% / .10), hsl(var(--card)))"
          : "hsl(var(--card))",
        opacity: disabled ? 0.4 : 1,
        cursor: disabled ? "not-allowed" : "pointer",
        color: "hsl(var(--card-foreground))",
        transition:
          "transform .2s ease, border-color .2s ease, box-shadow .2s ease",
        boxShadow: selected
          ? "0 16px 40px hsl(174 82% 30% / .12)"
          : "0 10px 30px hsl(220 30% 10% / .05)",
      }}
    >
      <div
        style={{
          position: "relative",
          width: "100%",
          aspectRatio: "16 / 9",
          background:
            "linear-gradient(135deg, hsl(215 28% 17%), hsl(210 20% 10%))",
        }}
      >
        {vehicle.image_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={vehicle.image_url}
            alt={`${vehicle.brand} ${vehicle.model}`}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />
        ) : (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "100%",
              height: "100%",
              fontSize: "10px",
              color: "hsl(var(--muted-foreground))",
            }}
          >
            No Image
          </div>
        )}

        {selected && (
          <div
            style={{
              position: "absolute",
              top: "10px",
              right: "10px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "30px",
              height: "30px",
              borderRadius: "50%",
              background: "hsl(174 82% 42%)",
              color: "white",
              boxShadow: "0 8px 25px hsl(174 82% 30% / .35)",
            }}
          >
            <Check size={15} />
          </div>
        )}
      </div>

      <div style={{ padding: "16px" }}>
        <p
          style={{
            margin: 0,
            fontSize: "9px",
            fontWeight: 800,
            letterSpacing: ".2em",
            textTransform: "uppercase",
            color: "hsl(174 82% 42%)",
          }}
        >
          {vehicle.brand}
        </p>

        <p
          style={{
            margin: "4px 0 0",
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            fontSize: "23px",
            fontWeight: 600,
            color: "hsl(var(--card-foreground))",
          }}
        >
          {vehicle.model}
        </p>

        <p
          style={{
            margin: "4px 0 0",
            fontSize: "11px",
            color: "hsl(var(--muted-foreground))",
          }}
        >
          {[vehicle.trim, vehicle.year].filter(Boolean).join(" · ") ||
            "Standard"}
        </p>
      </div>
    </button>
  );
}

export function ComparePage({ vehicles }: Props) {
  const [query, setQuery] = useState("");

  const {
    ids: selectedIds,
    toggle: toggleCompareSelection,
    clear: clearCompareSelection,
  } = useCompareSelection();

  const selectedVehicles = useMemo(
    () =>
      selectedIds
        .map((id) => vehicles.find((vehicle) => vehicle.id === id))
        .filter((vehicle): vehicle is Vehicle => Boolean(vehicle)),
    [selectedIds, vehicles],
  );

  const filteredVehicles = useMemo(() => {
    const search = query.trim().toLowerCase();

    if (!search) return [];

    return vehicles.filter((vehicle) =>
      [vehicle.brand, vehicle.model, vehicle.trim, vehicle.year?.toString()]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
        .includes(search),
    );
  }, [query, vehicles]);

  const bestPrice = getBestIndexes(
    selectedVehicles.map((vehicle) => vehicle.price),
    "low",
  );

  const bestRange = getBestIndexes(
    selectedVehicles.map((vehicle) => vehicle.range_miles),
    "high",
  );

  const bestBattery = getBestIndexes(
    selectedVehicles.map((vehicle) => vehicle.battery_capacity),
    "high",
  );

  const bestHealth = getBestIndexes(
    selectedVehicles.map((vehicle) => vehicle.battery_health),
    "high",
  );

  const bestTopSpeed = getBestIndexes(
    selectedVehicles.map((vehicle) => vehicle.top_speed),
    "high",
  );

  const bestMileage = getBestIndexes(
    selectedVehicles.map((vehicle) => vehicle.mileage),
    "low",
  );

  function toggleVehicle(id: string) {
    toggleCompareSelection(id);
  }

  function removeVehicle(id: string) {
    if (selectedIds.includes(id)) {
      toggleCompareSelection(id);
    }
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(180deg, hsl(210 25% 97%), hsl(var(--background)) 35%)",
        color: "hsl(var(--foreground))",
        paddingBottom: "110px",
      }}
    >
      {/* ============================================================
          AURORA COMPARE HERO
      ============================================================ */}

      <section
        style={{
          position: "relative",
          minHeight: "min(760px, 92vh)",
          display: "flex",
          alignItems: "center",
          overflow: "hidden",
          background:
            "radial-gradient(circle at 80% 25%, hsl(190 100% 55% / .22), transparent 28%), radial-gradient(circle at 20% 80%, hsl(262 85% 60% / .16), transparent 30%), linear-gradient(135deg, hsl(222 47% 9%), hsl(214 48% 13%) 48%, hsl(190 38% 11%))",
          color: "white",
        }}
      >
        {/* Ambient light */}
        <div
          style={{
            position: "absolute",
            top: "-220px",
            right: "-120px",
            width: "650px",
            height: "650px",
            borderRadius: "50%",
            background:
              "radial-gradient(circle, hsl(174 100% 60% / .20), transparent 68%)",
            filter: "blur(10px)",
            pointerEvents: "none",
          }}
        />

        <div
          style={{
            position: "absolute",
            bottom: "-280px",
            left: "-180px",
            width: "700px",
            height: "700px",
            borderRadius: "50%",
            background:
              "radial-gradient(circle, hsl(230 100% 65% / .18), transparent 68%)",
            filter: "blur(12px)",
            pointerEvents: "none",
          }}
        />

        {/* Grid */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            opacity: 0.09,
            backgroundImage:
              "linear-gradient(hsl(190 100% 80% / .35) 1px, transparent 1px), linear-gradient(90deg, hsl(190 100% 80% / .35) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
            maskImage: "linear-gradient(to bottom, black, transparent 90%)",
            pointerEvents: "none",
          }}
        />

        <div
          style={{
            position: "relative",
            zIndex: 2,
            width: "100%",
            maxWidth: "1380px",
            margin: "0 auto",
            padding: "48px 32px 70px",
          }}
        >
          <Link
            href="/dashboard"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "7px",
              marginBottom: "50px",
              color: "hsl(190 100% 85% / .75)",
              textDecoration: "none",
              fontSize: "9px",
              fontWeight: 800,
              letterSpacing: ".22em",
              textTransform: "uppercase",
            }}
          >
            <ArrowLeft size={12} />
            Dashboard
          </Link>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "minmax(0, 1.15fr) minmax(320px, .85fr)",
              alignItems: "center",
              gap: "70px",
            }}
          >
            <div>
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "9px",
                  padding: "8px 12px",
                  marginBottom: "22px",
                  border: "1px solid hsl(174 100% 70% / .25)",
                  borderRadius: "999px",
                  background: "hsl(174 100% 60% / .08)",
                  color: "hsl(174 100% 78%)",
                  fontSize: "9px",
                  fontWeight: 800,
                  letterSpacing: ".22em",
                  textTransform: "uppercase",
                }}
              >
                <Zap size={11} />
                Aurora Compare
              </div>

              <h1
                style={{
                  margin: 0,
                  maxWidth: "780px",
                  fontFamily: "'Cormorant Garamond', Georgia, serif",
                  fontSize: "clamp(64px, 9vw, 118px)",
                  lineHeight: ".84",
                  fontWeight: 600,
                  letterSpacing: "-.035em",
                  color: "white",
                }}
              >
                Compare
                <br />
                <span
                  style={{
                    background:
                      "linear-gradient(90deg, hsl(174 100% 70%), hsl(195 100% 78%), hsl(230 100% 80%))",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  EVs.
                </span>
              </h1>

              <p
                style={{
                  maxWidth: "610px",
                  margin: "30px 0 0",
                  fontSize: "17px",
                  lineHeight: 1.75,
                  color: "hsl(210 30% 90% / .72)",
                }}
              >
                Put the vehicles that matter to you side-by-side. See the
                numbers, understand the differences, and find the EV that fits
                your journey.
              </p>

              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "12px",
                  marginTop: "34px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    padding: "12px 16px",
                    borderRadius: "12px",
                    background: "hsl(0 0% 100% / .07)",
                    border: "1px solid hsl(0 0% 100% / .10)",
                    backdropFilter: "blur(12px)",
                  }}
                >
                  <Gauge size={15} color="hsl(174 100% 70%)" />
                  <span
                    style={{
                      fontSize: "11px",
                      fontWeight: 700,
                      color: "hsl(210 30% 95% / .8)",
                    }}
                  >
                    Performance
                  </span>
                </div>

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    padding: "12px 16px",
                    borderRadius: "12px",
                    background: "hsl(0 0% 100% / .07)",
                    border: "1px solid hsl(0 0% 100% / .10)",
                    backdropFilter: "blur(12px)",
                  }}
                >
                  <Battery size={15} color="hsl(210 100% 75%)" />
                  <span
                    style={{
                      fontSize: "11px",
                      fontWeight: 700,
                      color: "hsl(210 30% 95% / .8)",
                    }}
                  >
                    Battery & Range
                  </span>
                </div>

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    padding: "12px 16px",
                    borderRadius: "12px",
                    background: "hsl(0 0% 100% / .07)",
                    border: "1px solid hsl(0 0% 100% / .10)",
                    backdropFilter: "blur(12px)",
                  }}
                >
                  <Star size={15} color="hsl(40 100% 68%)" />
                  <span
                    style={{
                      fontSize: "11px",
                      fontWeight: 700,
                      color: "hsl(210 30% 95% / .8)",
                    }}
                  >
                    Ownership
                  </span>
                </div>
              </div>
            </div>

            {/* Selection status card */}
            <div
              style={{
                position: "relative",
                padding: "34px",
                borderRadius: "28px",
                background:
                  "linear-gradient(145deg, hsl(0 0% 100% / .13), hsl(0 0% 100% / .045))",
                border: "1px solid hsl(174 100% 80% / .18)",
                boxShadow:
                  "0 35px 90px hsl(210 80% 4% / .40), inset 0 1px 0 hsl(0 0% 100% / .10)",
                backdropFilter: "blur(24px)",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  top: "20px",
                  right: "24px",
                  width: "70px",
                  height: "70px",
                  borderRadius: "50%",
                  background:
                    "radial-gradient(circle, hsl(174 100% 65% / .30), transparent 70%)",
                  filter: "blur(4px)",
                }}
              />

              <p
                style={{
                  margin: 0,
                  fontSize: "9px",
                  fontWeight: 800,
                  letterSpacing: ".24em",
                  textTransform: "uppercase",
                  color: "hsl(174 100% 75%)",
                }}
              >
                Your comparison
              </p>

              <div
                style={{
                  display: "flex",
                  alignItems: "baseline",
                  gap: "6px",
                  marginTop: "10px",
                }}
              >
                <span
                  style={{
                    fontFamily: "'Cormorant Garamond', Georgia, serif",
                    fontSize: "76px",
                    lineHeight: 1,
                    fontWeight: 600,
                    color: "white",
                  }}
                >
                  {selectedVehicles.length}
                </span>

                <span
                  style={{
                    fontSize: "17px",
                    color: "hsl(210 30% 90% / .45)",
                  }}
                >
                  / 4 selected
                </span>
              </div>

              <div
                style={{
                  height: "6px",
                  marginTop: "22px",
                  overflow: "hidden",
                  borderRadius: "999px",
                  background: "hsl(0 0% 100% / .10)",
                }}
              >
                <div
                  style={{
                    width: `${Math.min(
                      100,
                      (selectedVehicles.length / 4) * 100,
                    )}%`,
                    height: "100%",
                    borderRadius: "999px",
                    background:
                      "linear-gradient(90deg, hsl(174 100% 60%), hsl(195 100% 72%))",
                    boxShadow: "0 0 18px hsl(174 100% 60% / .55)",
                    transition: "width .3s ease",
                  }}
                />
              </div>

              <p
                style={{
                  margin: "22px 0 0",
                  fontSize: "13px",
                  lineHeight: 1.7,
                  color: "hsl(210 30% 90% / .62)",
                }}
              >
                {selectedVehicles.length === 0
                  ? "Search the Aurora fleet below and select the vehicles you want to compare."
                  : selectedVehicles.length === 1
                    ? "Add another EV to start comparing specifications."
                    : "Your selected EVs are ready for a detailed side-by-side comparison."}
              </p>

              {selectedVehicles.length > 0 && (
                <button
                  type="button"
                  onClick={clearCompareSelection}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "7px",
                    marginTop: "25px",
                    padding: "10px 14px",
                    border: "1px solid hsl(0 0% 100% / .14)",
                    borderRadius: "10px",
                    background: "hsl(0 0% 100% / .06)",
                    color: "hsl(0 0% 100% / .70)",
                    fontSize: "9px",
                    fontWeight: 800,
                    letterSpacing: ".15em",
                    textTransform: "uppercase",
                    cursor: "pointer",
                  }}
                >
                  <X size={12} />
                  Clear selection
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================
          COMPARISON
      ============================================================ */}

      {selectedVehicles.length > 0 && (
        <section
          style={{
            maxWidth: "1280px",
            margin: "0 auto",
            padding: "70px 24px 0",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "flex-end",
              justifyContent: "space-between",
              gap: "20px",
              marginBottom: "20px",
            }}
          >
            <div>
              <p
                style={{
                  margin: 0,
                  fontSize: "9px",
                  fontWeight: 800,
                  letterSpacing: ".22em",
                  textTransform: "uppercase",
                  color: "hsl(174 82% 38%)",
                }}
              >
                Detailed comparison
              </p>

              <h2
                style={{
                  margin: "6px 0 0",
                  fontFamily: "'Cormorant Garamond', Georgia, serif",
                  fontSize: "40px",
                  lineHeight: 1,
                }}
              >
                Your comparison
              </h2>
            </div>

            <span
              style={{
                fontSize: "11px",
                color: "hsl(var(--muted-foreground))",
              }}
            >
              {selectedVehicles.length < 2
                ? "Add another vehicle to compare"
                : "Side-by-side comparison"}
            </span>
          </div>

          <div
            style={{
              overflowX: "auto",
              borderRadius: "22px",
              border: "1px solid hsl(var(--border))",
              background: "hsl(var(--card))",
              boxShadow: "0 25px 70px hsl(220 30% 10% / .08)",
            }}
          >
            <table
              style={{
                width: "100%",
                minWidth: "760px",
                borderCollapse: "collapse",
                tableLayout: "fixed",
              }}
            >
              <colgroup>
                <col style={{ width: "210px" }} />

                {selectedVehicles.map((vehicle) => (
                  <col key={vehicle.id} />
                ))}
              </colgroup>

              <thead>
                <tr>
                  <th
                    style={{
                      padding: "24px",
                      textAlign: "left",
                      verticalAlign: "top",
                      background: "hsl(220 20% 96%)",
                    }}
                  >
                    <span
                      style={{
                        fontSize: "9px",
                        fontWeight: 800,
                        letterSpacing: ".2em",
                        textTransform: "uppercase",
                        color: "hsl(174 82% 38%)",
                      }}
                    >
                      Comparing
                    </span>
                  </th>

                  {selectedVehicles.map((vehicle) => (
                    <th
                      key={vehicle.id}
                      style={{
                        position: "relative",
                        padding: "20px",
                        textAlign: "center",
                        background: "hsl(220 20% 96%)",
                        borderLeft: "1px solid hsl(var(--border))",
                        verticalAlign: "top",
                      }}
                    >
                      <button
                        type="button"
                        onClick={() => removeVehicle(vehicle.id)}
                        aria-label={`Remove ${vehicle.brand} ${vehicle.model}`}
                        style={{
                          position: "absolute",
                          top: "9px",
                          right: "9px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          width: "25px",
                          height: "25px",
                          border: "1px solid hsl(var(--border))",
                          borderRadius: "50%",
                          background: "hsl(var(--background) / .85)",
                          color: "hsl(var(--muted-foreground))",
                          cursor: "pointer",
                        }}
                      >
                        <X size={12} />
                      </button>

                      <div
                        style={{
                          width: "100%",
                          aspectRatio: "16 / 9",
                          marginBottom: "12px",
                          overflow: "hidden",
                          borderRadius: "10px",
                          background: "hsl(220 20% 12%)",
                        }}
                      >
                        {vehicle.image_url ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={vehicle.image_url}
                            alt={`${vehicle.brand} ${vehicle.model}`}
                            style={{
                              width: "100%",
                              height: "100%",
                              objectFit: "cover",
                            }}
                          />
                        ) : null}
                      </div>

                      <p
                        style={{
                          margin: 0,
                          fontSize: "8px",
                          fontWeight: 800,
                          letterSpacing: ".18em",
                          textTransform: "uppercase",
                          color: "hsl(174 82% 38%)",
                        }}
                      >
                        {vehicle.brand}
                      </p>

                      <p
                        style={{
                          margin: "3px 0 0",
                          fontFamily: "'Cormorant Garamond', Georgia, serif",
                          fontSize: "22px",
                          fontWeight: 600,
                        }}
                      >
                        {vehicle.model}
                      </p>
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                <SectionHeading
                  icon={<Star size={11} />}
                  label="Overview"
                  count={selectedVehicles.length}
                  tone="teal"
                />

                <ComparisonRow
                  label="Price"
                  values={selectedVehicles.map((v) => money(v.price))}
                  bestIndexes={bestPrice}
                  highlight
                  tone="teal"
                />

                <ComparisonRow
                  label="Color"
                  values={selectedVehicles.map((v) => formatValue(v.color))}
                  tone="teal"
                />

                <ComparisonRow
                  label="Year"
                  values={selectedVehicles.map((v) => formatValue(v.year))}
                  tone="teal"
                />

                <ComparisonRow
                  label="Trim"
                  values={selectedVehicles.map((v) => formatValue(v.trim))}
                  tone="teal"
                />

                <ComparisonRow
                  label="Mileage"
                  values={selectedVehicles.map((v) =>
                    v.mileage == null
                      ? "—"
                      : `${v.mileage.toLocaleString()} mi`,
                  )}
                  bestIndexes={bestMileage}
                  tone="teal"
                />

                <SectionHeading
                  icon={<Gauge size={11} />}
                  label="Performance"
                  count={selectedVehicles.length}
                  tone="blue"
                />

                <ComparisonRow
                  label="Acceleration 0–60"
                  values={selectedVehicles.map((v) =>
                    formatValue(v.acceleration),
                  )}
                  tone="blue"
                />

                <ComparisonRow
                  label="Top Speed"
                  values={selectedVehicles.map((v) =>
                    formatValue(v.top_speed, " mph"),
                  )}
                  bestIndexes={bestTopSpeed}
                  tone="blue"
                />

                <ComparisonRow
                  label="Drivetrain"
                  values={selectedVehicles.map((v) =>
                    formatValue(v.drivetrain),
                  )}
                  tone="blue"
                />

                <SectionHeading
                  icon={<Zap size={11} />}
                  label="Battery & Range"
                  count={selectedVehicles.length}
                  tone="violet"
                />

                <ComparisonRow
                  label="EPA Range"
                  values={selectedVehicles.map((v) =>
                    formatValue(v.range_miles, " mi"),
                  )}
                  bestIndexes={bestRange}
                  highlight
                  tone="violet"
                />

                <ComparisonRow
                  label="Battery Capacity"
                  values={selectedVehicles.map((v) =>
                    formatValue(v.battery_capacity, " kWh"),
                  )}
                  bestIndexes={bestBattery}
                  tone="violet"
                />

                <ComparisonRow
                  label="Battery Health"
                  values={selectedVehicles.map((v) =>
                    formatValue(v.battery_health, "%"),
                  )}
                  bestIndexes={bestHealth}
                  tone="violet"
                />

                <SectionHeading
                  icon={<Battery size={11} />}
                  label="Charging"
                  count={selectedVehicles.length}
                  tone="amber"
                />

                <ComparisonRow
                  label="Charging Time"
                  values={selectedVehicles.map((v) =>
                    formatValue(v.charging_time),
                  )}
                  tone="amber"
                />

                <SectionHeading
                  icon={<Check size={11} />}
                  label="Ownership"
                  count={selectedVehicles.length}
                  tone="green"
                />

                <ComparisonRow
                  label="Availability"
                  values={selectedVehicles.map((v) =>
                    formatValue(v.availability),
                  )}
                  tone="green"
                />

                <ComparisonRow
                  label="Aurora Plan"
                  values={selectedVehicles.map(() => "Available")}
                  tone="green"
                />

                <tr
                  style={{
                    borderTop: "1px solid hsl(var(--border))",
                  }}
                >
                  <td
                    style={{
                      padding: "24px",
                      fontSize: "10px",
                      fontWeight: 800,
                      color: "hsl(var(--muted-foreground))",
                      textTransform: "uppercase",
                      letterSpacing: ".08em",
                    }}
                  >
                    Ready to own?
                  </td>

                  {selectedVehicles.map((vehicle) => (
                    <td
                      key={vehicle.id}
                      style={{
                        padding: "24px 20px",
                        textAlign: "center",
                        borderLeft: "1px solid hsl(var(--border))",
                      }}
                    >
                      <Link
                        href={`/applications/new?vehicle=${vehicle.id}`}
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: "7px",
                          width: "100%",
                          padding: "13px 18px",
                          background:
                            "linear-gradient(135deg, hsl(174 82% 38%), hsl(190 82% 42%))",
                          color: "white",
                          fontSize: "9px",
                          fontWeight: 800,
                          letterSpacing: ".12em",
                          textTransform: "uppercase",
                          textDecoration: "none",
                          borderRadius: "9px",
                          boxShadow: "0 8px 22px hsl(174 82% 30% / .20)",
                        }}
                      >
                        Apply
                        <ArrowRight size={12} />
                      </Link>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* ============================================================
          SEARCH
      ============================================================ */}

      <section
        style={{
          maxWidth: "1280px",
          margin: "0 auto",
          padding: selectedVehicles.length > 0 ? "70px 24px 0" : "60px 24px 0",
        }}
      >
        <div
          style={{
            maxWidth: "760px",
            margin: "0 auto",
            textAlign: "center",
          }}
        >
          <p
            style={{
              margin: 0,
              fontSize: "9px",
              fontWeight: 800,
              letterSpacing: ".22em",
              textTransform: "uppercase",
              color: "hsl(174 82% 38%)",
            }}
          >
            {selectedVehicles.length > 0
              ? "Add another vehicle"
              : "Find vehicles"}
          </p>

          <h2
            style={{
              margin: "8px 0 0",
              fontFamily: "'Cormorant Garamond', Georgia, serif",
              fontSize: "clamp(34px, 4vw, 46px)",
              lineHeight: 1.05,
            }}
          >
            {selectedVehicles.length > 0
              ? "Want to compare another EV?"
              : "Find an EV to compare"}
          </h2>

          <p
            style={{
              maxWidth: "600px",
              margin: "13px auto 24px",
              fontSize: "13px",
              lineHeight: 1.7,
              color: "hsl(var(--muted-foreground))",
            }}
          >
            Search by brand, model, trim or year. Your selected vehicles will
            stay above while you explore the Aurora fleet.
          </p>
        </div>

        <div
          style={{
            maxWidth: "900px",
            margin: "0 auto",
            display: "flex",
            alignItems: "center",
            gap: "12px",
            border: "1px solid hsl(174 82% 38% / .20)",
            background: "hsl(var(--card))",
            borderRadius: "16px",
            padding: "0 18px",
            boxShadow: "0 14px 45px hsl(174 50% 20% / .07)",
          }}
        >
          <Search
            size={19}
            style={{
              color: "hsl(174 82% 38%)",
              flexShrink: 0,
            }}
          />

          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search by brand, model, trim or year..."
            style={{
              width: "100%",
              border: "none",
              outline: "none",
              background: "transparent",
              color: "hsl(var(--foreground))",
              padding: "18px 0",
              fontSize: "14px",
            }}
          />

          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              aria-label="Clear search"
              style={{
                display: "flex",
                border: "none",
                background: "transparent",
                color: "hsl(var(--muted-foreground))",
                cursor: "pointer",
              }}
            >
              <X size={16} />
            </button>
          )}
        </div>

        <div
          style={{
            maxWidth: "900px",
            margin: "12px auto 0",
            display: "flex",
            justifyContent: "space-between",
            gap: "16px",
            fontSize: "11px",
            color: "hsl(var(--muted-foreground))",
          }}
        >
          <span>
            {query
              ? `${filteredVehicles.length} vehicle${
                  filteredVehicles.length === 1 ? "" : "s"
                } found`
              : "Start typing to search the Aurora fleet"}
          </span>

          <span>
            {selectedVehicles.length >= 4
              ? "Maximum of 4 vehicles selected"
              : "Select up to 4 vehicles"}
          </span>
        </div>

        {query && filteredVehicles.length > 0 && (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(230px, 1fr))",
              gap: "16px",
              marginTop: "25px",
            }}
          >
            {filteredVehicles.map((vehicle) => {
              const selected = selectedIds.includes(vehicle.id);

              const disabled = !selected && selectedVehicles.length >= 4;

              return (
                <VehicleSearchCard
                  key={vehicle.id}
                  vehicle={vehicle}
                  selected={selected}
                  disabled={disabled}
                  onClick={() => toggleVehicle(vehicle.id)}
                />
              );
            })}
          </div>
        )}

        {query && filteredVehicles.length === 0 && (
          <div
            style={{
              maxWidth: "900px",
              margin: "22px auto 0",
              padding: "50px 20px",
              textAlign: "center",
              border: "1px dashed hsl(174 50% 40% / .30)",
              borderRadius: "18px",
              background: "hsl(174 50% 40% / .025)",
            }}
          >
            <Search
              size={28}
              style={{
                margin: "0 auto 12px",
                color: "hsl(174 82% 38%)",
              }}
            />

            <p
              style={{
                margin: 0,
                fontSize: "14px",
                color: "hsl(var(--muted-foreground))",
              }}
            >
              No vehicles match your search.
            </p>

            <p
              style={{
                margin: "7px 0 0",
                fontSize: "12px",
                color: "hsl(var(--muted-foreground) / .75)",
              }}
            >
              Try a different brand, model, trim or year.
            </p>
          </div>
        )}
      </section>

      {/* ============================================================
          WHY COMPARE
      ============================================================ */}

      <section
        style={{
          maxWidth: "1100px",
          margin: "100px auto 0",
          padding: "0 24px",
        }}
      >
        <div
          style={{
            position: "relative",
            overflow: "hidden",
            padding: "65px 34px",
            textAlign: "center",
            borderRadius: "28px",
            background:
              "linear-gradient(135deg, hsl(222 47% 10%), hsl(205 50% 14%), hsl(174 40% 12%))",
            color: "white",
            boxShadow: "0 30px 80px hsl(220 40% 10% / .18)",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: "-120px",
              left: "50%",
              width: "420px",
              height: "300px",
              transform: "translateX(-50%)",
              background:
                "radial-gradient(ellipse, hsl(174 100% 60% / .18), transparent 70%)",
              pointerEvents: "none",
            }}
          />

          <div
            style={{
              position: "relative",
              zIndex: 1,
            }}
          >
            <p
              style={{
                margin: "0 0 10px",
                fontSize: "9px",
                fontWeight: 800,
                letterSpacing: ".24em",
                textTransform: "uppercase",
                color: "hsl(174 100% 72%)",
              }}
            >
              Choose with confidence
            </p>

            <h2
              style={{
                margin: 0,
                fontFamily: "'Cormorant Garamond', Georgia, serif",
                fontSize: "clamp(36px, 4vw, 52px)",
                lineHeight: 1.05,
                fontWeight: 600,
              }}
            >
              Compare what matters.
            </h2>

            <p
              style={{
                maxWidth: "680px",
                margin: "17px auto 0",
                fontSize: "14px",
                lineHeight: 1.8,
                color: "hsl(210 30% 92% / .65)",
              }}
            >
              Every EV is different. Compare range, battery capacity, price,
              performance and more side-by-side so you can understand the
              differences and choose the vehicle that fits your journey.
            </p>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
                gap: "12px",
                marginTop: "34px",
                textAlign: "left",
              }}
            >
              {[
                {
                  number: "01",
                  title: "See the difference",
                  text: "Put the specifications that matter side-by-side.",
                },
                {
                  number: "02",
                  title: "Understand your options",
                  text: "See where each vehicle stands before deciding.",
                },
                {
                  number: "03",
                  title: "Choose with confidence",
                  text: "Make your decision using the numbers that matter.",
                },
              ].map((item) => (
                <div
                  key={item.number}
                  style={{
                    border: "1px solid hsl(0 0% 100% / .10)",
                    borderRadius: "14px",
                    background: "hsl(0 0% 100% / .045)",
                    padding: "21px",
                  }}
                >
                  <p
                    style={{
                      margin: 0,
                      fontSize: "9px",
                      fontWeight: 800,
                      letterSpacing: ".18em",
                      color: "hsl(174 100% 72%)",
                    }}
                  >
                    {item.number}
                  </p>

                  <h3
                    style={{
                      margin: "10px 0 6px",
                      fontSize: "14px",
                      fontWeight: 700,
                    }}
                  >
                    {item.title}
                  </h3>

                  <p
                    style={{
                      margin: 0,
                      fontSize: "12px",
                      lineHeight: 1.6,
                      color: "hsl(210 30% 90% / .55)",
                    }}
                  >
                    {item.text}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================
          NOTHING SELECTED
      ============================================================ */}

      {selectedVehicles.length === 0 && !query && (
        <section
          style={{
            maxWidth: "900px",
            margin: "45px auto 0",
            padding: "0 24px",
          }}
        >
          <div
            style={{
              padding: "42px 24px",
              textAlign: "center",
              border: "1px dashed hsl(174 50% 40% / .30)",
              borderRadius: "18px",
              background: "hsl(174 50% 40% / .025)",
            }}
          >
            <p
              style={{
                margin: 0,
                fontSize: "9px",
                fontWeight: 800,
                letterSpacing: ".25em",
                textTransform: "uppercase",
                color: "hsl(174 82% 38%)",
              }}
            >
              Start comparing
            </p>

            <h2
              style={{
                margin: "10px 0",
                fontFamily: "'Cormorant Garamond', Georgia, serif",
                fontSize: "34px",
              }}
            >
              Select at least two vehicles
            </h2>

            <p
              style={{
                maxWidth: "500px",
                margin: "0 auto",
                fontSize: "14px",
                lineHeight: 1.7,
                color: "hsl(var(--muted-foreground))",
              }}
            >
              Search above to find vehicles, then select the ones you want to
              compare side-by-side.
            </p>
          </div>
        </section>
      )}
    </main>
  );
}
