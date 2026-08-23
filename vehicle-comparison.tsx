"use client";

import Link from "next/link";
import { Check, ArrowRight, Zap, Battery, Gauge, Star } from "lucide-react";
import type { Vehicle } from "@/features/vehicles/types/vehicle";

type Props = {
  vehicles: Vehicle[];
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function money(v: number | null) {
  return v == null
    ? "—"
    : new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        maximumFractionDigits: 0,
      }).format(v);
}

function fmt(v: string | number | null, suffix = "") {
  return v == null ? "—" : `${v}${suffix}`;
}

// Returns the index (or indices) of the "best" value in a list
// direction: "low" means lower is better (price, charge time), "high" means higher is better
function getBestIndex(
  values: (number | null)[],
  direction: "high" | "low" = "high",
): number[] {
  const nums = values.map((v, i) => ({ v, i })).filter((x) => x.v != null) as {
    v: number;
    i: number;
  }[];
  if (nums.length < 2) return [];
  const best =
    direction === "high"
      ? Math.max(...nums.map((x) => x.v))
      : Math.min(...nums.map((x) => x.v));
  return nums.filter((x) => x.v === best).map((x) => x.i);
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function SectionHeading({
  icon,
  label,
}: {
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <tr>
      <td
        colSpan={99}
        style={{
          padding: "14px 28px 10px",
          background: "rgba(200,16,46,.06)",
          borderTop: "1px solid rgba(200,16,46,.14)",
          borderBottom: "1px solid rgba(200,16,46,.10)",
        }}
      >
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            fontSize: "9px",
            fontWeight: 700,
            letterSpacing: ".24em",
            textTransform: "uppercase",
            color: "#C8102E",
            fontFamily: "'DM Sans', sans-serif",
          }}
        >
          {icon}
          {label}
        </span>
      </td>
    </tr>
  );
}

interface RowProps {
  label: string;
  values: string[];
  bestIndexes?: number[];
  highlight?: boolean;
}

function Row({ label, values, bestIndexes = [], highlight }: RowProps) {
  return (
    <tr style={{ borderTop: "1px solid rgba(255,255,255,.05)" }}>
      <td
        style={{
          padding: "16px 28px",
          fontSize: "12px",
          fontWeight: 600,
          letterSpacing: ".04em",
          color: "rgba(232,228,220,.5)",
          textTransform: "uppercase",
          whiteSpace: "nowrap",
          minWidth: "180px",
          background: "rgba(255,255,255,.012)",
        }}
      >
        {label}
      </td>
      {values.map((value, i) => {
        const isBest = bestIndexes.includes(i);
        const isDash = value === "—";
        return (
          <td
            key={i}
            style={{
              padding: "16px 24px",
              textAlign: "center",
              fontSize: highlight ? "22px" : "15px",
              fontWeight: highlight ? 700 : 500,
              fontFamily: highlight
                ? "'Cormorant Garamond', Georgia, serif"
                : "inherit",
              color:
                isBest && !isDash
                  ? "#fff"
                  : isDash
                    ? "rgba(255,255,255,.2)"
                    : "rgba(232,228,220,.82)",
              background:
                isBest && !isDash ? "rgba(200,16,46,.08)" : "transparent",
              borderLeft: "1px solid rgba(255,255,255,.04)",
              position: "relative",
            }}
          >
            {isBest && !isDash && (
              <span
                style={{
                  position: "absolute",
                  top: "6px",
                  right: "8px",
                  fontSize: "8px",
                  fontWeight: 700,
                  letterSpacing: ".18em",
                  textTransform: "uppercase",
                  color: "#C8102E",
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

// ─── Main Component ────────────────────────────────────────────────────────────

export function VehicleComparison({ vehicles }: Props) {
  const count = vehicles.length;

  // Pre-compute best indexes for numeric comparisons
  const bestPrice = getBestIndex(
    vehicles.map((v) => v.price),
    "low",
  );
  const bestRange = getBestIndex(
    vehicles.map((v) => v.range_miles),
    "high",
  );
  const bestBattery = getBestIndex(
    vehicles.map((v) => v.battery_capacity),
    "high",
  );
  const bestHealth = getBestIndex(
    vehicles.map((v) => v.battery_health),
    "high",
  );
  const bestTopSpeed = getBestIndex(
    vehicles.map((v) => v.top_speed),
    "high",
  );
  const bestMileage = getBestIndex(
    vehicles.map((v) => v.mileage),
    "low",
  );

  const colWidth = `${Math.floor(72 / count)}%`;

  return (
    <div>
      {/* ── Vehicle header cards ── */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: `220px repeat(${count}, 1fr)`,
          gap: "1px",
          background: "rgba(255,255,255,.06)",
          borderRadius: "12px 12px 0 0",
          overflow: "hidden",
          marginBottom: "1px",
        }}
      >
        {/* Label column header */}
        <div style={{ background: "#121e17", padding: "32px 28px" }}>
          <p
            style={{
              fontSize: "9px",
              fontWeight: 700,
              letterSpacing: ".24em",
              textTransform: "uppercase",
              color: "#C8102E",
            }}
          >
            Comparing
          </p>
          <p
            style={{
              fontSize: "22px",
              fontFamily: "'Cormorant Garamond', Georgia, serif",
              fontWeight: 600,
              color: "#f5f4f0",
              marginTop: "6px",
            }}
          >
            {count} Vehicles
          </p>
        </div>

        {vehicles.map((v, i) => (
          <div
            key={v.id}
            style={{
              background: "#121e17",
              padding: "24px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              textAlign: "center",
            }}
          >
            {/* Vehicle image */}
            <div
              style={{
                width: "100%",
                maxWidth: "240px",
                aspectRatio: "16/9",
                borderRadius: "6px",
                overflow: "hidden",
                background: "#1c2e26",
                marginBottom: "16px",
                position: "relative",
              }}
            >
              {v.image_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={v.image_url}
                  alt={`${v.brand} ${v.model}`}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              ) : (
                <div
                  style={{
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "rgba(255,255,255,.18)",
                    fontSize: "11px",
                    letterSpacing: ".08em",
                  }}
                >
                  No Image
                </div>
              )}
            </div>

            {/* Brand */}
            <p
              style={{
                fontSize: "9px",
                fontWeight: 700,
                letterSpacing: ".24em",
                textTransform: "uppercase",
                color: "#C8102E",
                marginBottom: "4px",
              }}
            >
              {v.brand}
            </p>

            {/* Model */}
            <p
              style={{
                fontFamily: "'Cormorant Garamond', Georgia, serif",
                fontSize: "24px",
                fontWeight: 600,
                color: "#f5f4f0",
                lineHeight: 1.1,
                marginBottom: "4px",
              }}
            >
              {v.model}
            </p>

            {/* Trim + Year */}
            <p
              style={{
                fontSize: "12px",
                color: "rgba(232,228,220,.4)",
                marginBottom: "16px",
              }}
            >
              {[v.trim, v.year].filter(Boolean).join(" · ") || "Standard"}
            </p>

            {/* Availability badge */}
            <span
              style={{
                display: "inline-block",
                padding: "3px 12px",
                fontSize: "9px",
                fontWeight: 700,
                letterSpacing: ".18em",
                textTransform: "uppercase",
                borderRadius: "2px",
                background:
                  v.availability === "available"
                    ? "rgba(74,222,128,.12)"
                    : "rgba(255,255,255,.06)",
                color:
                  v.availability === "available"
                    ? "#4ade80"
                    : "rgba(255,255,255,.35)",
                border: `1px solid ${v.availability === "available" ? "rgba(74,222,128,.25)" : "rgba(255,255,255,.08)"}`,
                marginBottom: "16px",
              }}
            >
              {v.availability}
            </span>

            {/* CTA */}
            <Link
              href={`/vehicles/${v.id}`}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                fontSize: "10px",
                fontWeight: 600,
                letterSpacing: ".14em",
                textTransform: "uppercase",
                color: "#C8102E",
                textDecoration: "none",
                borderBottom: "1px solid rgba(200,16,46,.3)",
                paddingBottom: "2px",
              }}
            >
              View Details <ArrowRight size={11} />
            </Link>
          </div>
        ))}
      </div>

      {/* ── Comparison table ── */}
      <div
        style={{
          background: "#0f1a13",
          border: "1px solid rgba(255,255,255,.06)",
          borderTop: "none",
          borderRadius: "0 0 12px 12px",
          overflowX: "auto",
        }}
      >
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            tableLayout: "fixed",
          }}
        >
          <colgroup>
            <col style={{ width: "220px" }} />
            {vehicles.map((_, i) => (
              <col key={i} style={{ width: colWidth }} />
            ))}
          </colgroup>

          <tbody>
            {/* ── OVERVIEW ── */}
            <SectionHeading icon={<Star size={11} />} label="Overview" />

            <Row
              label="Price"
              values={vehicles.map((v) => money(v.price))}
              bestIndexes={bestPrice}
              highlight
            />
            <Row label="Color" values={vehicles.map((v) => fmt(v.color))} />
            <Row label="Year" values={vehicles.map((v) => fmt(v.year))} />
            <Row label="Trim" values={vehicles.map((v) => fmt(v.trim))} />
            <Row
              label="Mileage"
              values={vehicles.map((v) =>
                v.mileage == null ? "—" : `${v.mileage.toLocaleString()} mi`,
              )}
              bestIndexes={bestMileage}
            />

            {/* ── PERFORMANCE ── */}
            <SectionHeading icon={<Gauge size={11} />} label="Performance" />

            <Row
              label="Acceleration (0–60)"
              values={vehicles.map((v) => fmt(v.acceleration))}
            />
            <Row
              label="Top Speed"
              values={vehicles.map((v) =>
                v.top_speed == null ? "—" : `${v.top_speed} mph`,
              )}
              bestIndexes={bestTopSpeed}
            />
            <Row
              label="Drivetrain"
              values={vehicles.map((v) => fmt(v.drivetrain))}
            />

            {/* ── BATTERY & RANGE ── */}
            <SectionHeading icon={<Zap size={11} />} label="Battery & Range" />

            <Row
              label="EPA Range"
              values={vehicles.map((v) =>
                v.range_miles == null ? "—" : `${v.range_miles} mi`,
              )}
              bestIndexes={bestRange}
              highlight
            />
            <Row
              label="Battery Capacity"
              values={vehicles.map((v) =>
                v.battery_capacity == null ? "—" : `${v.battery_capacity} kWh`,
              )}
              bestIndexes={bestBattery}
            />
            <Row
              label="Battery Health"
              values={vehicles.map((v) =>
                v.battery_health == null ? "—" : `${v.battery_health}%`,
              )}
              bestIndexes={bestHealth}
            />

            {/* ── CHARGING ── */}
            <SectionHeading icon={<Battery size={11} />} label="Charging" />

            <Row
              label="Charging Time"
              values={vehicles.map((v) => fmt(v.charging_time))}
            />

            {/* ── OWNERSHIP ── */}
            <SectionHeading icon={<Check size={11} />} label="Ownership" />

            <Row
              label="Availability"
              values={vehicles.map((v) => v.availability)}
            />
            <Row label="Aurora Plan" values={vehicles.map(() => "Available")} />

            {/* ── Apply row ── */}
            <tr style={{ borderTop: "1px solid rgba(255,255,255,.06)" }}>
              <td
                style={{
                  padding: "24px 28px",
                  fontSize: "11px",
                  fontWeight: 600,
                  color: "rgba(232,228,220,.4)",
                  textTransform: "uppercase",
                  letterSpacing: ".08em",
                }}
              >
                Ready to own?
              </td>
              {vehicles.map((v) => (
                <td
                  key={v.id}
                  style={{
                    padding: "24px",
                    textAlign: "center",
                    borderLeft: "1px solid rgba(255,255,255,.04)",
                  }}
                >
                  <Link
                    href={`/applications/new?vehicle=${v.id}`}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "6px",
                      background: "#C8102E",
                      color: "#fff",
                      padding: "12px 24px",
                      fontSize: "10px",
                      fontWeight: 700,
                      letterSpacing: ".14em",
                      textTransform: "uppercase",
                      textDecoration: "none",
                      borderRadius: "2px",
                      width: "100%",
                    }}
                  >
                    Apply <ArrowRight size={12} />
                  </Link>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>

      {/* ── Empty state prompt to add more ── */}
      {count < 4 && (
        <div
          style={{
            marginTop: "24px",
            padding: "20px 28px",
            border: "1px dashed rgba(200,16,46,.2)",
            borderRadius: "8px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "16px",
          }}
        >
          <div>
            <p
              style={{
                fontSize: "13px",
                fontWeight: 600,
                color: "rgba(232,228,220,.7)",
              }}
            >
              Want to compare more?
            </p>
            <p
              style={{
                fontSize: "12px",
                color: "rgba(232,228,220,.35)",
                marginTop: "2px",
              }}
            >
              You can compare up to 4 vehicles side-by-side.
            </p>
          </div>
          <Link
            href="/vehicles"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              border: "1px solid rgba(200,16,46,.35)",
              color: "#C8102E",
              padding: "10px 22px",
              fontSize: "10px",
              fontWeight: 700,
              letterSpacing: ".14em",
              textTransform: "uppercase",
              textDecoration: "none",
              borderRadius: "2px",
              whiteSpace: "nowrap",
            }}
          >
            Browse Fleet <ArrowRight size={12} />
          </Link>
        </div>
      )}
    </div>
  );
}
