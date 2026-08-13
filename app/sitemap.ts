import type { MetadataRoute } from "next";
import { createClient } from "@/lib/supabase/server";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

const STATIC_ROUTES = [
  "",
  "/vehicles",
  "/compare",
  "/about",
  "/faq",
  "/contact",
  "/ownership",
  "/login",
  "/signup",
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticEntries: MetadataRoute.Sitemap = STATIC_ROUTES.map((route) => ({
    url: `${siteUrl}${route}`,
    lastModified: new Date(),
  }));

  // Best-effort: if this fails (e.g. build-time without a reachable
  // database), the sitemap still ships with the static routes rather
  // than failing the whole build.
  try {
    const supabase = await createClient();
    const { data: vehicles } = await supabase
      .from("vehicles")
      .select("id, updated_at")
      .eq("availability", "available");

    const vehicleEntries: MetadataRoute.Sitemap = (vehicles ?? []).map(
      (vehicle) => ({
        url: `${siteUrl}/vehicles/${vehicle.id}`,
        lastModified: vehicle.updated_at
          ? new Date(vehicle.updated_at)
          : new Date(),
      }),
    );

    return [...staticEntries, ...vehicleEntries];
  } catch (error) {
    console.error("Sitemap: failed to load vehicles, static routes only:", error);
    return staticEntries;
  }
}
