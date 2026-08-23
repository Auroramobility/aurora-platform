import { createClient } from "@/lib/supabase/server";
import type { Application } from "@/features/applications/types/application";
import { toVehicle, type Vehicle } from "@/features/vehicles/types/vehicle";
import type { OwnershipPlanStatus } from "@/features/ownership/types/ownership-plan";

const APPLICATION_SELECT = `
  id,
  user_id,
  vehicle_id,
  status,
  application_date,
  approved_date,
  reviewed_at,
  rejection_reason
`;

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
  identity_verified_at,
  drivers_license_front,
  drivers_license_back
`;

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
`;

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
  drivers_license_front: string | null;
  drivers_license_back: string | null;
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

type FinancingTerms = {
  id: string;
  plan_id: string;
  currency: string | null;
  annual_interest_rate: number | null;
  vehicle_price: number | null;
  down_payment: number | null;
  amount_financed: number | null;
  monthly_payment: number | null;
  term_months: number | null;
  total_financed_repayment: number | null;
  first_payment_date: string | null;
  payment_frequency: string | null;
};

type OwnershipPlan = {
  id: string;
  application_id: string;
  status: string | null;
  accepted_at: string | null;
  declined_at: string | null;
  activated_at: string | null;
  created_at: string | null;
};

export type AdminApplicationDetail = {
  application: Application;
  profile: Profile | null;
  vehicle: Vehicle | null;

  /**
   * Customer's requested calculator values.
   *
   * These are NOT approved financing terms.
   */
  financingRequest: FinancingRequest | null;

  /**
   * Operational ownership plan and any final financing terms.
   */
  ownershipPlan: {
    id: string;
    application_id: string;
    status: OwnershipPlanStatus;
    accepted_at: string | null;
    declined_at: string | null;
    activated_at: string | null;
    created_at: string | null;
    financingTerms: FinancingTerms | null;
  } | null;

  identityDocuments: {
    frontUrl: string | null;
    backUrl: string | null;
  };
};

function toApplication(row: {
  id: string;
  user_id: string;
  vehicle_id: string;
  status: string | null;
  application_date: string | null;
  approved_date: string | null;
  reviewed_at: string | null;
  rejection_reason: string | null;
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

async function createLicenseSignedUrl(
  supabase: Awaited<ReturnType<typeof createClient>>,
  path: string | null,
) {
  if (!path) {
    return null;
  }

  const { data, error } = await supabase.storage
    .from("licenses")
    .createSignedUrl(path, 300);

  if (error) {
    throw new Error(`Unable to access driver's license: ${error.message}`);
  }

  return data.signedUrl;
}

export async function getAdminApplicationDetail(
  id: string,
): Promise<AdminApplicationDetail | null> {
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
   * ADMIN AUTHORIZATION
   * ============================================================
   */

  const { data: isAdmin, error: adminError } = await supabase.rpc("is_admin");

  if (adminError) {
    throw new Error(
      `Unable to verify administrator access: ${adminError.message}`,
    );
  }

  if (!isAdmin) {
    return null;
  }

  /*
   * ============================================================
   * APPLICATION
   * ============================================================
   */

  const { data: applicationRow, error: applicationError } = await supabase
    .from("applications")
    .select(APPLICATION_SELECT)
    .eq("id", id)
    .maybeSingle();

  if (applicationError) {
    throw new Error(`Unable to load application: ${applicationError.message}`);
  }

  if (!applicationRow) {
    return null;
  }

  /*
   * ============================================================
   * CUSTOMER / VEHICLE / FINANCING REQUEST / OWNERSHIP PLAN
   * ============================================================
   */

  const [profileResult, vehicleResult, financingRequestResult, planResult] =
    await Promise.all([
      supabase
        .from("profiles")
        .select(PROFILE_SELECT)
        .eq("user_id", applicationRow.user_id)
        .maybeSingle(),

      supabase
        .from("vehicles")
        .select(VEHICLE_SELECT)
        .eq("id", applicationRow.vehicle_id)
        .maybeSingle(),

      /*
       * Customer's calculator request.
       *
       * This is what the customer submitted.
       *
       * It does NOT represent:
       * - financing approval
       * - lender selection
       * - payment confirmation
       * - final ownership terms
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

      supabase
        .from("ownership_plans")
        .select(
          `
          id,
          application_id,
          status,
          accepted_at,
          declined_at,
          activated_at,
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
   * QUERY ERROR HANDLING
   * ============================================================
   */

  if (profileResult.error) {
    throw new Error(
      `Unable to load customer profile: ${profileResult.error.message}`,
    );
  }

  if (vehicleResult.error) {
    throw new Error(
      `Unable to load application vehicle: ${vehicleResult.error.message}`,
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

  const profile = profileResult.data as Profile | null;

  const financingRequest =
    financingRequestResult.data as FinancingRequest | null;

  /*
   * ============================================================
   * IDENTITY DOCUMENTS
   * ============================================================
   */

  const [frontUrl, backUrl] = await Promise.all([
    createLicenseSignedUrl(supabase, profile?.drivers_license_front ?? null),

    createLicenseSignedUrl(supabase, profile?.drivers_license_back ?? null),
  ]);

  /*
   * ============================================================
   * FINAL FINANCING TERMS
   * ============================================================
   *
   * financing_terms is separate from
   * application_financing_requests.
   *
   * application_financing_requests:
   *   Customer's requested calculator values.
   *
   * financing_terms:
   *   Operational/final financing terms.
   */

  let financingTerms: FinancingTerms | null = null;

  if (planResult.data) {
    const { data, error } = await supabase
      .from("financing_terms")
      .select(
        `
          id,
          plan_id,
          currency,
          annual_interest_rate,
          vehicle_price,
          down_payment,
          amount_financed,
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

    financingTerms = data as FinancingTerms | null;
  }

  /*
   * ============================================================
   * OWNERSHIP PLAN
   * ============================================================
   */

  const plan = planResult.data as OwnershipPlan | null;

  /*
   * ============================================================
   * RETURN
   * ============================================================
   */

  return {
    application: toApplication(applicationRow),

    profile,

    vehicle: vehicleResult.data ? toVehicle(vehicleResult.data) : null,

    financingRequest,

    identityDocuments: {
      frontUrl,
      backUrl,
    },

    ownershipPlan: plan
      ? {
          id: plan.id,
          application_id: plan.application_id,
          status: toOwnershipPlanStatus(plan.status),
          accepted_at: plan.accepted_at,
          declined_at: plan.declined_at,
          activated_at: plan.activated_at,
          created_at: plan.created_at,
          financingTerms,
        }
      : null,
  };
}
