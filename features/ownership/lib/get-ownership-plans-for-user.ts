import { createClient } from "@/lib/supabase/server";

export type OwnershipPlanSummary = {
  id: string;
  status: string;
  vehicle: {
    brand: string;
    model: string;
    trim: string | null;
    image_url: string | null;
  } | null;
};

/**
 * Lists every ownership plan belonging to the current user, across all
 * of their applications. Deliberately lightweight (no financing/payment
 * data) — that's fetched per-plan via getOwnershipPlan() on the page
 * that needs it, since it already does the correct field mapping and
 * validation and a customer typically has very few plans.
 */
export async function getOwnershipPlansForUser(): Promise<OwnershipPlanSummary[]> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return [];

  const { data: applications, error: applicationsError } = await supabase
    .from("applications")
    .select("id, vehicle_id")
    .eq("user_id", user.id);

  if (applicationsError || !applications || applications.length === 0) {
    return [];
  }

  const applicationIds = applications.map((application) => application.id);
  const applicationById = new Map(
    applications.map((application) => [application.id, application]),
  );

  const { data: plans, error: plansError } = await supabase
    .from("ownership_plans")
    .select("id, application_id, status, created_at")
    .in("application_id", applicationIds)
    .order("created_at", { ascending: false });

  if (plansError || !plans || plans.length === 0) {
    return [];
  }

  const vehicleIds = [
    ...new Set(
      plans
        .map((plan) => applicationById.get(plan.application_id)?.vehicle_id)
        .filter((id): id is string => Boolean(id)),
    ),
  ];

  const { data: vehicles } =
    vehicleIds.length > 0
      ? await supabase
          .from("vehicles")
          .select("id, brand, model, trim, image_url")
          .in("id", vehicleIds)
      : { data: [] };

  const vehicleById = new Map((vehicles ?? []).map((vehicle) => [vehicle.id, vehicle]));

  return plans.map((plan) => {
    const application = applicationById.get(plan.application_id);
    const vehicle = application?.vehicle_id
      ? (vehicleById.get(application.vehicle_id) ?? null)
      : null;

    return {
      id: plan.id,
      status: plan.status ?? "draft",
      vehicle: vehicle
        ? {
            brand: vehicle.brand,
            model: vehicle.model,
            trim: vehicle.trim,
            image_url: vehicle.image_url,
          }
        : null,
    };
  });
}
