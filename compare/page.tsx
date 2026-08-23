import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { VehicleComparison } from "@/components/vehicles/vehicle-comparison";
import { getVehicles } from "@/features/vehicles/lib/get-vehicles";

export default async function ComparePage({
  searchParams,
}: {
  searchParams: Promise<{ ids?: string }>;
}) {
  const { ids } = await searchParams;

  const vehicleIds = ids
    ? [
        ...new Set(
          ids
            .split(",")
            .map((id) => id.trim())
            .filter(Boolean),
        ),
      ].slice(0, 4)
    : [];

  const vehicles =
    vehicleIds.length >= 2 ? await getVehicles({ ids: vehicleIds }) : [];

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#0d1710",
        paddingBottom: "80px",
      }}
    >
      {/* ── Page header ── */}
      <div
        style={{
          borderBottom: "1px solid rgba(255,255,255,.06)",
          padding: "28px 40px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          background: "rgba(15,26,19,.8)",
          backdropFilter: "blur(8px)",
          position: "sticky",
          top: 0,
          zIndex: 40,
        }}
      >
        <div>
          <Link
            href="/vehicles"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              fontSize: "9px",
              fontWeight: 700,
              letterSpacing: ".22em",
              textTransform: "uppercase",
              color: "rgba(232,228,220,.35)",
              textDecoration: "none",
              marginBottom: "6px",
            }}
          >
            <ArrowLeft size={11} /> Back to Fleet
          </Link>
          <h1
            style={{
              fontFamily: "'Cormorant Garamond', Georgia, serif",
              fontSize: "clamp(28px, 4vw, 44px)",
              fontWeight: 600,
              color: "#f5f4f0",
              lineHeight: 1.1,
              margin: 0,
            }}
          >
            Vehicle{" "}
            <span
              style={{
                background: "linear-gradient(135deg, #e05068 0%, #c4a96a 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Comparison
            </span>
          </h1>
        </div>

        {vehicles.length >= 2 && (
          <p
            style={{
              fontSize: "12px",
              color: "rgba(232,228,220,.35)",
              textAlign: "right",
            }}
          >
            {vehicles.length} vehicles selected
          </p>
        )}
      </div>

      {/* ── Content ── */}
      <div
        style={{ maxWidth: "1280px", margin: "0 auto", padding: "40px 24px 0" }}
      >
        {vehicles.length >= 2 ? (
          <VehicleComparison vehicles={vehicles} />
        ) : (
          /* ── Empty / insufficient state ── */
          <div
            style={{
              marginTop: "80px",
              textAlign: "center",
              padding: "60px 24px",
              border: "1px dashed rgba(255,255,255,.08)",
              borderRadius: "12px",
            }}
          >
            <p
              style={{
                fontSize: "9px",
                fontWeight: 700,
                letterSpacing: ".26em",
                textTransform: "uppercase",
                color: "#C8102E",
                marginBottom: "16px",
              }}
            >
              Aurora Compare
            </p>
            <h2
              style={{
                fontFamily: "'Cormorant Garamond', Georgia, serif",
                fontSize: "clamp(32px, 5vw, 52px)",
                fontWeight: 600,
                color: "#f5f4f0",
                marginBottom: "16px",
                lineHeight: 1.1,
              }}
            >
              {vehicleIds.length >= 2
                ? "Some vehicles are unavailable"
                : "Select vehicles to compare"}
            </h2>
            <p
              style={{
                fontSize: "15px",
                color: "rgba(232,228,220,.45)",
                maxWidth: "460px",
                margin: "0 auto 32px",
                lineHeight: 1.8,
              }}
            >
              {vehicleIds.length >= 2
                ? "Only available vehicles can be compared. Return to the fleet and choose another vehicle."
                : "Select at least two vehicles from the fleet — you can compare up to four side-by-side."}
            </p>
            <Link
              href="/vehicles"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                background: "#C8102E",
                color: "#fff",
                padding: "14px 36px",
                fontSize: "11px",
                fontWeight: 700,
                letterSpacing: ".14em",
                textTransform: "uppercase",
                textDecoration: "none",
                borderRadius: "2px",
              }}
            >
              Browse Fleet
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}
