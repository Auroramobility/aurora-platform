import { createClient } from "@/lib/supabase/server";

export type OwnershipJourneyState = {
  profileComplete: boolean;
  identityVerified: boolean;
  vehicleChosen: boolean;
  applicationSubmitted: boolean;
  ownershipApproved: boolean;
  ownershipActive: boolean;
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

export async function getOwnershipJourneyForUser(): Promise<OwnershipJourneyState> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      profileComplete: false,
      identityVerified: false,
      vehicleChosen: false,
      applicationSubmitted: false,
      ownershipApproved: false,
      ownershipActive: false,
    };
  }

  const [profileResult, applicationsResult] = await Promise.all([
    supabase
      .from("profiles")
      .select(REQUIRED_PROFILE_FIELDS.join(", ") + ", drivers_license_front, drivers_license_back, identity_verified")
      .eq("user_id", user.id)
      .maybeSingle(),
    supabase
      .from("applications")
      .select("id, status, vehicle_id")
      .eq("user_id", user.id)
      .order("application_date", { ascending: false }),
  ]);

  const applications = applicationsResult.data ?? [];
  const applicationIds = applications.map((application) => application.id);
  const ownershipPlans = applicationIds.length
    ? (
        (
          await supabase
            .from("ownership_plans")
            .select("id, status, application_id")
            .in("application_id", applicationIds)
        ).data ?? []
      )
    : [];

  const profile = profileResult.data as Record<
  | (typeof REQUIRED_PROFILE_FIELDS)[number]
  | "identity_verified",
  "unknown"
> | null;

const profileComplete = REQUIRED_PROFILE_FIELDS.every((field) =>
  Boolean(profile?.[field]),
);

const identityVerified = Boolean(profile?.identity_verified);
  const activeApplication = applications.find((application) =>
    ["pending", "reviewing", "approved"].includes(application.status ?? ""),
  );
  const approvedApplication = applications.find((application) => application.status === "approved");
  const ownershipActive = ownershipPlans.some((plan) => plan.status === "active");

  return {
    profileComplete,
    identityVerified,
    vehicleChosen: Boolean(activeApplication?.vehicle_id),
    applicationSubmitted: applications.length > 0,
    ownershipApproved: Boolean(approvedApplication),
    ownershipActive,
  };
}
