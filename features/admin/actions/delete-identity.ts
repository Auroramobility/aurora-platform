"use server";

import { revalidatePath } from "next/cache";

import { requireAdmin } from "@/features/admin/lib/authorization";
import { safeAdminError } from "@/features/admin/lib/errors";

export type DeleteIdentityState = {
  error?: string;
  success?: string;
};

export async function deleteIdentity(
  _previousState: DeleteIdentityState,
  formData: FormData,
): Promise<DeleteIdentityState> {
  try {
    const { supabase, user, isAdmin } = await requireAdmin();

    if (!user || !isAdmin) {
      return { error: "Unauthorized." };
    }

    const userId = String(formData.get("user_id") ?? "").trim();

    if (!userId) {
      return { error: "Missing user." };
    }

    /*
     * ============================================================
     * LOAD EXISTING IDENTITY DOCUMENT PATHS
     * ============================================================
     */

    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select(
        `
            user_id,
            drivers_license_front,
            drivers_license_back
          `,
      )
      .eq("user_id", userId)
      .maybeSingle();

    if (profileError) {
      return {
        error: safeAdminError("Identity could not be loaded.", profileError),
      };
    }

    if (!profile) {
      return { error: "Customer profile not found." };
    }

    /*
     * ============================================================
     * DELETE PRIVATE LICENSE DOCUMENTS
     * ============================================================
     */

    const licensePaths = [
      profile.drivers_license_front,
      profile.drivers_license_back,
    ].filter(
      (path): path is string =>
        typeof path === "string" && path.trim().length > 0,
    );

    if (licensePaths.length > 0) {
      const { error: storageError } = await supabase.storage
        .from("licenses")
        .remove(licensePaths);

      if (storageError) {
        console.error("[deleteIdentity] Storage deletion error:", storageError);

        return {
          error: "Identity documents could not be deleted.",
        };
      }
    }

    /*
     * ============================================================
     * CLEAR IDENTITY DATA
     * ============================================================
     *
     * Keep the customer profile.
     *
     * Remove only the submitted identity material and
     * verification state.
     */

    const { error: updateError } = await supabase
      .from("profiles")
      .update({
        identity_verified: false,
        identity_verified_at: null,
        identity_verified_by: null,
        drivers_license_front: null,
        drivers_license_back: null,
      })
      .eq("user_id", userId);

    if (updateError) {
      console.error("[deleteIdentity] Profile update error:", updateError);

      return {
        error: safeAdminError(
          "Identity information could not be cleared.",
          updateError,
        ),
      };
    }

    /*
     * ============================================================
     * REFRESH
     * ============================================================
     */

    revalidatePath("/admin");
    revalidatePath("/dashboard");
    revalidatePath("/profile");

    return {
      success: "Identity documents and verification were deleted.",
    };
  } catch (error) {
    console.error("[deleteIdentity] Unexpected server error:", error);

    return {
      error: "The identity information could not be deleted.",
    };
  }
}
