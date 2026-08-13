import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { getVehicle } from "@/features/vehicles/lib/get-vehicle";
import { ApplicationForm } from "@/components/applications/application-form";

type Props = { searchParams: Promise<{ vehicle?: string }> };

export default async function NewApplicationPage({ searchParams }: Props) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { vehicle: vehicleId } = await searchParams;
  if (!vehicleId) notFound();

  const vehicle = await getVehicle(vehicleId);
  if (!vehicle) notFound();

  return (
    <main className="mx-auto max-w-4xl space-y-8 p-8">
      <Link
        href={`/vehicles/${vehicle.id}`}
        className="inline-flex items-center gap-2 text-sm text-muted-foreground transition hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to vehicle
      </Link>

      <div>
        <p className="text-sm font-semibold uppercase tracking-wider text-primary">Aurora Ownership</p>
        <h1 className="mt-2 text-3xl font-bold">Apply for {vehicle.brand} {vehicle.model}</h1>
        <p className="mt-2 text-muted-foreground">Review your selected vehicle and submit an application for Aurora review.</p>
      </div>

      <div className="rounded-3xl border bg-card p-6">
        <div className="flex flex-col justify-between gap-4 sm:flex-row">
          <div>
            <p className="text-sm text-muted-foreground">Selected vehicle</p>
            <h2 className="mt-1 text-xl font-semibold">{vehicle.brand} {vehicle.model}{vehicle.trim ? ` ${vehicle.trim}` : ""}</h2>
          </div>
          <div className="text-left sm:text-right">
            <p className="text-sm text-muted-foreground">Vehicle price</p>
            <p className="mt-1 text-2xl font-bold">{vehicle.price != null ? `$${vehicle.price.toLocaleString()}` : "Price unavailable"}</p>
          </div>
        </div>
      </div>

      <ApplicationForm vehicleId={vehicle.id} />
    </main>
  );
}
