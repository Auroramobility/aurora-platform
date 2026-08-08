import { createClient } from "@/lib/supabase/server";
import { toVehicle, type Vehicle } from "@/features/vehicles/types/vehicle";
import type { Application } from "@/features/applications/types/application";
import type { OwnershipPlanStatus } from "@/features/ownership/types/ownership-plan";

const APPLICATION_SELECT = `
  id,
  user_id,
  vehicle_id,
  status,
  application_date,
  approved_date
` as const;

const VEHICLE_SELECT = `
  id,
  brand,
  model,
  trim,
  price,
  image_url,
  year,
  range_miles,
  battery_health,
  availability,
  description,
  mileage,
  color,
  battery_capacity,
  drivetrain,
  charging_time,
  acceleration,
  top_speed,
  featured,
  published,
  created_at,
  updated_at
` as const;

type OwnershipPlanSummary = {
  id: string;
  status: OwnershipPlanStatus;
  financing: {
    down_payment: number | null;
    monthly_payment: number | null;
    term_months: number | null;
    contract_amount: number | null;
    first_payment_date: string | null;
    payment_frequency: string;
  } | null;
  accepted_at: string | null;
  declined_at: string | null;
};

export type ApplicationDetail = {
  application: Application;
  vehicle: Vehicle | null;
  identityVerified: boolean;
  profileComplete: boolean;
  ownershipPlan: OwnershipPlanSummary | null;
};

const REQUIRED_PROFILE_FIELDS = [
  "full_name",
  "phone",
  "country",
  "state",
  "address",
  "city",
  "postal_code",
  "date_of_birth",
  "employment_status",
  "monthly_income",
  "profile_photo_url",
] as const;

function toApplication(row: {
  id: string;
  user_id: string;
  vehicle_id: string;
  status: string | null;
  application_date: string | null;
  approved_date: string | null;
}): Application {
  const status = row.status ?? "pending";
  if (!["pending", "reviewing", "approved", "rejected", "cancelled"].includes(status)) {
    throw new Error("Invalid application status returned by the database.");
  }

  return { ...row, status: status as Application["status"] };
}

function toOwnershipPlanStatus(status: string | null): OwnershipPlanStatus {
  const allowed: OwnershipPlanStatus[] = [
    "draft",
    "ready",
    "accepted",
    "declined",
    "active",
    "completed",
    "paused",
    "cancelled",
  ];
  const value = status ?? "draft";
  if (!allowed.includes(value as OwnershipPlanStatus)) {
    throw new Error("Invalid ownership plan status returned by the database.");
  }
  return value as OwnershipPlanStatus;
}

export async function getApplicationDetail(id: string): Promise<ApplicationDetail | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: applicationRow, error: applicationError } = await supabase
    .from("applications")
    .select(APPLICATION_SELECT)
    .eq("id", id)
    .eq("user_id", user.id)
    .maybeSingle();

  if (applicationError) {
    throw new Error(`Unable to load application: ${applicationError.message}`);
  }
  if (!applicationRow) return null;

  const [vehicleResult, profileResult, planResult] = await Promise.all([
    supabase.from("vehicles").select(VEHICLE_SELECT).eq("id", applicationRow.vehicle_id).maybeSingle(),
    supabase
      .from("profiles")
      .select(REQUIRED_PROFILE_FIELDS.join(", ") + ", identity_verified")
      .eq("user_id", user.id)
      .maybeSingle(),
    supabase
      .from("ownership_plans")
      .select("id, status, accepted_at, declined_at, created_at")
      .eq("application_id", id)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle(),
  ]);

  if (vehicleResult.error) {
    throw new Error(`Unable to load application vehicle: ${vehicleResult.error.message}`);
  }
  if (profileResult.error) {
    throw new Error(`Unable to load profile status: ${profileResult.error.message}`);
  }
  if (planResult.error) {
    throw new Error(`Unable to load ownership plan: ${planResult.error.message}`);
  }

  let financingTerms = null;
  if (planResult.data) {
    const { data, error } = await supabase
      .from("financing_terms")
      .select("id, down_payment, monthly_payment, term_months, total_financed_repayment, first_payment_date, payment_frequency")
      .eq("plan_id", planResult.data.id)
      .maybeSingle();
    if (error) throw new Error(`Unable to load financing terms: ${error.message}`);
    financingTerms = data;
  }

  const profile = profileResult.data as Record<
  (typeof REQUIRED_PROFILE_FIELDS)[number] | "identity_verified",
  unknown
> | null;

const profileComplete = REQUIRED_PROFILE_FIELDS.every((field) =>
  Boolean(profile?.[field]),
);

  return {
    application: toApplication(applicationRow),
    vehicle: vehicleResult.data ? toVehicle(vehicleResult.data) : null,
    identityVerified: Boolean(profile?.identity_verified),
    profileComplete,
    ownershipPlan: planResult.data
      ? {
          id: planResult.data.id,
          status: toOwnershipPlanStatus(planResult.data.status),
          financing: financingTerms
            ? {
                down_payment: financingTerms.down_payment == null ? null : Number(financingTerms.down_payment),
                monthly_payment: financingTerms.monthly_payment == null ? null : Number(financingTerms.monthly_payment),
                term_months: financingTerms.term_months == null ? null : Number(financingTerms.term_months),
                contract_amount: financingTerms.total_financed_repayment == null ? null : Number(financingTerms.total_financed_repayment),
                first_payment_date: financingTerms.first_payment_date == null ? null : String(financingTerms.first_payment_date),
                payment_frequency: financingTerms.payment_frequency ?? "monthly",
              }
            : null,
          accepted_at: planResult.data.accepted_at,
          declined_at: planResult.data.declined_at,
        }
      : null,
  };
}
