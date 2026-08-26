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
     * LOAD LICENSE PATHS BEFORE DELETING THE PROFILE
     * ============================================================
     */

    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("user_id, drivers_license_front, drivers_license_back")
      .eq("user_id", userId)
      .maybeSingle();

    if (profileError) {
      console.error("[deleteIdentity] Profile load error:", profileError);

      return {
        error: safeAdminError("Identity could not be loaded.", profileError),
      };
    }

    if (!profile) {
      return {
        error: "Customer profile not found.",
      };
    }

    /*
     * ============================================================
     * DELETE LICENSE FILES FROM SUPABASE STORAGE
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
     * DELETE PROFILE + CASCADE ALL ATTACHED AURORA DATA
     * ============================================================
     */

    const { data: deleted, error: deleteError } = await supabase.rpc(
      "delete_identity_cascade",
      {
        p_user_id: userId,
      },
    );

    if (deleteError) {
      console.error("[deleteIdentity] Cascade deletion error:", deleteError);

      return {
        error: safeAdminError(
          "The identity could not be deleted.",
          deleteError,
        ),
      };
    }

    if (!deleted) {
      console.error("[deleteIdentity] No profile was deleted:", userId);

      return {
        error: "The identity record could not be deleted.",
      };
    }

    /*
     * ============================================================
     * REFRESH ADMIN/CUSTOMER VIEWS
     * ============================================================
     */

    revalidatePath("/admin");
    revalidatePath("/admin/identity");
    revalidatePath(`/admin/identity/${userId}`);
    revalidatePath("/admin/applications");
    revalidatePath("/admin/ownership");
    revalidatePath("/admin/payments");
    revalidatePath("/admin/messages");
    revalidatePath("/dashboard");
    revalidatePath("/applications");
    revalidatePath("/payments");
    revalidatePath("/messages");
    revalidatePath("/profile");

    return {
      success: "Identity deleted.",
    };
  } catch (error) {
    console.error("[deleteIdentity] Unexpected server error:", error);

    return {
      error: "The identity could not be deleted.",
    };
  }
}
