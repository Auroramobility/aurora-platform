import { createClient } from "@/lib/supabase/server";

type AdminIdentityProfile = {
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

export type AdminIdentityDetail = {
  profile: AdminIdentityProfile;
  identityDocuments: {
    frontUrl: string | null;
    backUrl: string | null;
  };
};

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

export async function getAdminIdentityDetail(
  userId: string,
): Promise<AdminIdentityDetail | null> {
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
   * CUSTOMER PROFILE
   * ============================================================
   */

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select(
      `
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
        `,
    )
    .eq("user_id", userId)
    .maybeSingle();

  if (profileError) {
    throw new Error(
      `Unable to load customer identity: ${profileError.message}`,
    );
  }

  if (!profile) {
    return null;
  }

  /*
   * ============================================================
   * PRIVATE IDENTITY DOCUMENTS
   * ============================================================
   *
   * The licenses bucket remains private.
   *
   * Signed URLs are generated only after the current user has
   * been authenticated and confirmed as an Aurora administrator.
   *
   * URLs expire after 5 minutes.
   */

  const [frontUrl, backUrl] = await Promise.all([
    createLicenseSignedUrl(supabase, profile.drivers_license_front),
    createLicenseSignedUrl(supabase, profile.drivers_license_back),
  ]);

  return {
    profile: profile as AdminIdentityProfile,
    identityDocuments: {
      frontUrl,
      backUrl,
    },
  };
}
