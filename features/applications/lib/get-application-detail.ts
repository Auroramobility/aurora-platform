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

const PROFILE_SELECT = `
  user_id,
  full_name,
  phone,
  country,
  state,
  address,
  city,
  postal_code,
  date_of_birth,
  employment_status,
  monthly_income,
  profile_photo_url,
  identity_verified,
  identity_verified_at
` as const;

type Profile = {
  user_id: string;
  full_name: string | null;
  phone: string | null;
  country: string | null;
  state: string | null;
  address: string | null;
  city: string | null;
  postal_code: string | null;
  date_of_birth: string | null;
  employment_status: string | null;
  monthly_income: number | null;
  profile_photo_url: string | null;
  identity_verified: boolean | null;
  identity_verified_at: string | null;
};

type FinancingRequest = {
  id: string;
  application_id: string;
  vehicle_price: number;
  currency: string;
  down_payment_percent: number;
  requested_down_payment: number;
  requested_amount_financed: number;
  requested_term_months: number;
  estimated_monthly_payment: number;
  estimated_total_paid: number;
  created_at: string;
  updated_at: string;
};

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

  profile: Profile | null;

  identityVerified: boolean;

  profileComplete: boolean;

  /*
   * Customer's submitted ownership/financing calculator request.
   *
   * This is NOT final financing approval.
   */
  financingRequest: FinancingRequest | null;

  /*
   * Operational ownership plan.
   *
   * This is separate from the customer's financing request.
   */
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

  if (
    !["pending", "reviewing", "approved", "rejected", "cancelled"].includes(
      status,
    )
  ) {
    throw new Error("Invalid application status returned by the database.");
  }

  return {
    ...row,
    status: status as Application["status"],
  };
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

export async function getApplicationDetail(
  id: string,
): Promise<ApplicationDetail | null> {
  const supabase = await createClient();

  /*
   * ============================================================
   * AUTHENTICATION
   * ============================================================
   */

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  /*
   * ============================================================
   * APPLICATION
   * ============================================================
   *
   * The user_id restriction ensures customers can only load
   * their own application.
   */

  const { data: applicationRow, error: applicationError } = await supabase
    .from("applications")
    .select(APPLICATION_SELECT)
    .eq("id", id)
    .eq("user_id", user.id)
    .maybeSingle();

  if (applicationError) {
    throw new Error(`Unable to load application: ${applicationError.message}`);
  }

  if (!applicationRow) {
    return null;
  }

  /*
   * ============================================================
   * VEHICLE / PROFILE / FINANCING REQUEST / OWNERSHIP PLAN
   * ============================================================
   */

  const [vehicleResult, profileResult, financingRequestResult, planResult] =
    await Promise.all([
      /*
       * Vehicle
       */
      supabase
        .from("vehicles")
        .select(VEHICLE_SELECT)
        .eq("id", applicationRow.vehicle_id)
        .maybeSingle(),

      /*
       * Customer profile
       */
      supabase
        .from("profiles")
        .select(PROFILE_SELECT)
        .eq("user_id", user.id)
        .maybeSingle(),

      /*
       * Customer's submitted calculator request.
       *
       * This is the data created by create-application.ts.
       *
       * It represents what the customer requested/estimated,
       * not approved financing.
       */
      supabase
        .from("application_financing_requests")
        .select(
          `
          id,
          application_id,
          vehicle_price,
          currency,
          down_payment_percent,
          requested_down_payment,
          requested_amount_financed,
          requested_term_months,
          estimated_monthly_payment,
          estimated_total_paid,
          created_at,
          updated_at
        `,
        )
        .eq("application_id", id)
        .maybeSingle(),

      /*
       * Ownership plan
       */
      supabase
        .from("ownership_plans")
        .select(
          `
          id,
          status,
          accepted_at,
          declined_at,
          created_at
        `,
        )
        .eq("application_id", id)
        .order("created_at", {
          ascending: false,
        })
        .limit(1)
        .maybeSingle(),
    ]);

  /*
   * ============================================================
   * QUERY ERRORS
   * ============================================================
   */

  if (vehicleResult.error) {
    throw new Error(
      `Unable to load application vehicle: ${vehicleResult.error.message}`,
    );
  }

  if (profileResult.error) {
    throw new Error(
      `Unable to load profile status: ${profileResult.error.message}`,
    );
  }

  if (financingRequestResult.error) {
    throw new Error(
      `Unable to load financing request: ${financingRequestResult.error.message}`,
    );
  }

  if (planResult.error) {
    throw new Error(
      `Unable to load ownership plan: ${planResult.error.message}`,
    );
  }

  /*
   * ============================================================
   * PROFILE
   * ============================================================
   */

  const profile = profileResult.data as Profile | null;

  const profileComplete = REQUIRED_PROFILE_FIELDS.every((field) =>
    Boolean(profile?.[field]),
  );

  /*
   * ============================================================
   * CUSTOMER FINANCING REQUEST
   * ============================================================
   */

  const financingRequest =
    financingRequestResult.data as FinancingRequest | null;

  /*
   * ============================================================
   * FINAL FINANCING TERMS
   * ============================================================
   *
   * Only load these when an ownership plan exists.
   *
   * These are different from application_financing_requests.
   */

  let financingTerms: {
    down_payment: number | null;
    monthly_payment: number | null;
    term_months: number | null;
    total_financed_repayment: number | null;
    first_payment_date: string | null;
    payment_frequency: string | null;
  } | null = null;

  if (planResult.data) {
    const { data, error } = await supabase
      .from("financing_terms")
      .select(
        `
          id,
          down_payment,
          monthly_payment,
          term_months,
          total_financed_repayment,
          first_payment_date,
          payment_frequency
        `,
      )
      .eq("plan_id", planResult.data.id)
      .maybeSingle();

    if (error) {
      throw new Error(`Unable to load financing terms: ${error.message}`);
    }

    financingTerms = data
      ? {
          down_payment:
            data.down_payment == null ? null : Number(data.down_payment),

          monthly_payment:
            data.monthly_payment == null ? null : Number(data.monthly_payment),

          term_months:
            data.term_months == null ? null : Number(data.term_months),

          total_financed_repayment:
            data.total_financed_repayment == null
              ? null
              : Number(data.total_financed_repayment),

          first_payment_date:
            data.first_payment_date == null
              ? null
              : String(data.first_payment_date),

          payment_frequency:
            data.payment_frequency == null
              ? null
              : String(data.payment_frequency),
        }
      : null;
  }

  /*
   * ============================================================
   * RETURN
   * ============================================================
   */

  return {
    application: toApplication(applicationRow),

    vehicle: vehicleResult.data ? toVehicle(vehicleResult.data) : null,

    profile,

    identityVerified: Boolean(profile?.identity_verified),

    profileComplete,

    financingRequest,

    ownershipPlan: planResult.data
      ? {
          id: planResult.data.id,

          status: toOwnershipPlanStatus(planResult.data.status),

          financing: financingTerms
            ? {
                down_payment: financingTerms.down_payment,

                monthly_payment: financingTerms.monthly_payment,

                term_months: financingTerms.term_months,

                contract_amount: financingTerms.total_financed_repayment,

                first_payment_date: financingTerms.first_payment_date,

                payment_frequency:
                  financingTerms.payment_frequency ?? "monthly",
              }
            : null,

          accepted_at: planResult.data.accepted_at,

          declined_at: planResult.data.declined_at,
        }
      : null,
  };
}
