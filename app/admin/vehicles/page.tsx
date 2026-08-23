import Link from "next/link";
import { redirect } from "next/navigation";
import {
  ImagePlus,
  Search,
  Eye,
  CheckCircle2,
  XCircle,
  Clock,
} from "lucide-react";
import { requireAdmin } from "@/features/admin/lib/authorization";

function money(v: number | null) {
  return v == null
    ? "—"
    : new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        maximumFractionDigits: 0,
      }).format(v);
}

function AvailabilityBadge({ status }: { status: string | null }) {
  const map: Record<string, { label: string; className: string }> = {
    available: {
      label: "Available",
      className: "bg-green-500/10 text-green-600 border-green-500/20",
    },
    reserved: {
      label: "Reserved",
      className: "bg-yellow-500/10 text-yellow-600 border-yellow-500/20",
    },
    sold: {
      label: "Sold",
      className: "bg-red-500/10 text-red-600 border-red-500/20",
    },
    unavailable: {
      label: "Unavailable",
      className: "bg-muted text-muted-foreground border-border",
    },
  };
  const config = map[status ?? "unavailable"] ?? map.unavailable!;
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${config.className}`}
    >
      {config.label}
    </span>
  );
}

type Props = {
  searchParams: Promise<{ q?: string; brand?: string; status?: string }>;
};

export default async function AdminVehiclesPage({ searchParams }: Props) {
  const { supabase, isAdmin } = await requireAdmin();
  if (!isAdmin) redirect("/login");

  const { q, brand, status } = await searchParams;

  // Fetch all vehicles (admin sees all, including unpublished)
  let query = supabase
    .from("vehicles")
    .select(
      "id, brand, model, trim, year, price, image_url, availability, published, featured, range_miles, battery_capacity, drivetrain, created_at",
    )
    .order("brand", { ascending: true })
    .order("model", { ascending: true });

  if (brand && brand !== "all") query = query.eq("brand", brand);
  if (status === "published") query = query.eq("published", true);
  if (status === "unpublished") query = query.eq("published", false);
  if (status === "available") query = query.eq("availability", "available");

  const { data: vehicles } = await query;

  // Fetch image counts per vehicle
  const vehicleIds = (vehicles ?? []).map((v) => v.id);
  const { data: imageCounts } = vehicleIds.length
    ? await supabase
        .from("vehicle_images")
        .select("vehicle_id")
        .in("vehicle_id", vehicleIds)
    : { data: [] };

  const imageCountMap = new Map<string, number>();
  for (const row of imageCounts ?? []) {
    imageCountMap.set(
      row.vehicle_id,
      (imageCountMap.get(row.vehicle_id) ?? 0) + 1,
    );
  }

  // Fetch unique brands for filter
  const { data: brandRows } = await supabase
    .from("vehicles")
    .select("brand")
    .order("brand");
  const brands = [...new Set((brandRows ?? []).map((r) => r.brand))];

  // Client-side text filter (q is a search string)
  const filtered = (vehicles ?? []).filter((v) => {
    if (!q) return true;
    const lower = q.toLowerCase();
    return (
      v.brand.toLowerCase().includes(lower) ||
      v.model.toLowerCase().includes(lower) ||
      (v.trim ?? "").toLowerCase().includes(lower) ||
      String(v.year ?? "").includes(lower)
    );
  });

  const totalPublished = (vehicles ?? []).filter((v) => v.published).length;
  const totalAvailable = (vehicles ?? []).filter(
    (v) => v.availability === "available",
  ).length;
  const missingImages = (vehicles ?? []).filter(
    (v) => (imageCountMap.get(v.id) ?? 0) === 0,
  ).length;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-surface/90 px-6 py-4 backdrop-blur-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div>
            <Link
              href="/admin"
              className="text-xs text-muted-foreground transition hover:text-foreground"
            >
              ← Admin Console
            </Link>
            <h1 className="mt-1 text-2xl font-bold">Vehicle Catalogue</h1>
            <p className="text-xs text-muted-foreground">
              {filtered.length} vehicle{filtered.length !== 1 ? "s" : ""}
              {q ? ` matching "${q}"` : ""}
            </p>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl space-y-6 p-6">
        {/* Stats row */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {[
            {
              label: "Total vehicles",
              value: (vehicles ?? []).length,
              icon: null,
            },
            {
              label: "Published",
              value: totalPublished,
              icon: <CheckCircle2 className="h-4 w-4 text-green-500" />,
            },
            {
              label: "Available",
              value: totalAvailable,
              icon: <Clock className="h-4 w-4 text-primary" />,
            },
            {
              label: "Missing images",
              value: missingImages,
              icon: <XCircle className="text-destructive h-4 w-4" />,
            },
          ].map((stat) => (
            <div
              key={stat.label}
              className="rounded-2xl border border-border bg-surface p-5"
            >
              <div className="flex items-center justify-between">
                <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                  {stat.label}
                </p>
                {stat.icon}
              </div>
              <p className="aurora-gradient-text mt-2 text-3xl font-bold">
                {stat.value}
              </p>
            </div>
          ))}
        </div>

        {/* Filters */}
        <form method="GET" className="flex flex-wrap items-center gap-3">
          {/* Search */}
          <div className="relative min-w-[200px] max-w-sm flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              name="q"
              defaultValue={q ?? ""}
              placeholder="Search brand, model, trim…"
              className="w-full rounded-xl border border-border bg-background py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </div>

          {/* Brand filter */}
          <select
            name="brand"
            defaultValue={brand ?? "all"}
            className="rounded-xl border border-border bg-background px-4 py-2.5 text-sm outline-none focus:border-primary"
          >
            <option value="all">All brands</option>
            {brands.map((b) => (
              <option key={b} value={b}>
                {b}
              </option>
            ))}
          </select>

          {/* Status filter */}
          <select
            name="status"
            defaultValue={status ?? ""}
            className="rounded-xl border border-border bg-background px-4 py-2.5 text-sm outline-none focus:border-primary"
          >
            <option value="">All statuses</option>
            <option value="published">Published only</option>
            <option value="unpublished">Unpublished only</option>
            <option value="available">Available only</option>
          </select>

          <button
            type="submit"
            className="rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition hover:opacity-90"
          >
            Filter
          </button>

          {(q || brand || status) && (
            <Link
              href="/admin/vehicles"
              className="text-sm text-muted-foreground transition hover:text-foreground"
            >
              Clear
            </Link>
          )}
        </form>

        {/* Vehicle table */}
        <div className="overflow-hidden rounded-2xl border border-border bg-surface">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/40">
                {[
                  "Vehicle",
                  "Year",
                  "Price",
                  "Range",
                  "Status",
                  "Images",
                  "Actions",
                ].map((h) => (
                  <th
                    key={h}
                    className="px-5 py-3.5 text-left text-[10px] font-bold uppercase tracking-widest text-muted-foreground"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="py-16 text-center text-muted-foreground"
                  >
                    No vehicles found
                  </td>
                </tr>
              ) : (
                filtered.map((v) => {
                  const imgCount = imageCountMap.get(v.id) ?? 0;
                  const hasImages = imgCount > 0;

                  return (
                    <tr
                      key={v.id}
                      className="border-t border-border transition hover:bg-muted/20"
                    >
                      {/* Vehicle */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          {/* Thumbnail */}
                          <div className="h-12 w-16 shrink-0 overflow-hidden rounded-lg border border-border bg-muted">
                            {v.image_url ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img
                                src={v.image_url}
                                alt={`${v.brand} ${v.model}`}
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <div className="flex h-full w-full items-center justify-center">
                                <ImagePlus className="h-4 w-4 text-muted-foreground/40" />
                              </div>
                            )}
                          </div>
                          <div>
                            <p className="text-[9px] font-bold uppercase tracking-widest text-primary">
                              {v.brand}
                            </p>
                            <p className="font-semibold">{v.model}</p>
                            {v.trim && (
                              <p className="text-xs text-muted-foreground">
                                {v.trim}
                              </p>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Year */}
                      <td className="px-5 py-4 text-muted-foreground">
                        {v.year ?? "—"}
                      </td>

                      {/* Price */}
                      <td className="px-5 py-4 font-semibold">
                        {money(v.price)}
                      </td>

                      {/* Range */}
                      <td className="px-5 py-4 text-muted-foreground">
                        {v.range_miles != null ? `${v.range_miles} mi` : "—"}
                      </td>

                      {/* Status */}
                      <td className="px-5 py-4">
                        <div className="flex flex-col gap-1.5">
                          <AvailabilityBadge status={v.availability} />
                          {!v.published && (
                            <span className="inline-flex items-center rounded-full border border-border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                              Draft
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Images */}
                      <td className="px-5 py-4">
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${
                            hasImages
                              ? "bg-green-500/10 text-green-600"
                              : "bg-destructive/10 text-destructive"
                          }`}
                        >
                          {hasImages ? (
                            <CheckCircle2 className="h-3 w-3" />
                          ) : (
                            <XCircle className="h-3 w-3" />
                          )}
                          {imgCount} image{imgCount !== 1 ? "s" : ""}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <Link
                            href={`/admin/vehicles/${v.id}`}
                            className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs font-semibold transition hover:border-primary hover:text-primary"
                          >
                            <ImagePlus className="h-3.5 w-3.5" />
                            Images
                          </Link>
                          <Link
                            href={`/vehicles/${v.id}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 text-xs text-muted-foreground transition hover:text-foreground"
                          >
                            <Eye className="h-3.5 w-3.5" />
                            View
                          </Link>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
