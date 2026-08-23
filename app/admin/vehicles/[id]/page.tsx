import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { requireAdmin } from "@/features/admin/lib/authorization";
import { VehicleImageManager } from "./image-manager";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function AdminVehicleImagesPage({ params }: Props) {
  const { id } = await params;
  const { supabase, isAdmin } = await requireAdmin();

  if (!isAdmin) redirect("/login");

  const { data: vehicle } = await supabase
    .from("vehicles")
    .select("id, brand, model, trim, year, image_url")
    .eq("id", id)
    .single();

  if (!vehicle) notFound();

  const { data: images } = await supabase
    .from("vehicle_images")
    .select("id, image_url, sort_order")
    .eq("vehicle_id", id)
    .order("sort_order", { ascending: true });

  const bucket = "vehicle-images";
  const mappedImages = (images ?? []).map((img) => {
    const url = new URL(img.image_url);
    const marker = `/object/public/${bucket}/`;
    const storagePath = url.pathname.includes(marker)
      ? url.pathname.split(marker)[1]!
      : img.image_url;
    return { ...img, storagePath };
  });

  const vehicleName = [vehicle.brand, vehicle.model, vehicle.trim, vehicle.year]
    .filter(Boolean)
    .join(" ");

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 flex items-center justify-between border-b border-border bg-surface/90 px-6 py-4 backdrop-blur-sm">
        <div>
          <Link
            href="/admin"
            className="text-xs text-muted-foreground transition-colors hover:text-foreground"
          >
            ← Admin Console
          </Link>
          <h1 className="mt-1 text-xl font-bold">{vehicleName}</h1>
          <p className="text-xs text-muted-foreground">
            Vehicle image management
          </p>
        </div>

        <Link
          href={`/vehicles/${vehicle.id}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-primary hover:underline"
        >
          View on site ↗
        </Link>
      </header>

      <main className="mx-auto max-w-5xl p-8">
        <VehicleImageManager
          vehicleId={vehicle.id}
          vehicleName={vehicleName}
          initialImages={mappedImages}
          primaryImageUrl={vehicle.image_url}
        />
      </main>
    </div>
  );
}
