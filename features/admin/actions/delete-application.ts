"use server";

import { revalidatePath } from "next/cache";

import { requireAdmin } from "@/features/admin/lib/authorization";
import { safeAdminError } from "@/features/admin/lib/errors";

export type DeleteApplicationState = {
  error?: string;
  success?: string;
};

export async function deleteApplication(
  _previousState: DeleteApplicationState,
  formData: FormData,
): Promise<DeleteApplicationState> {
  try {
    const { supabase, user, isAdmin } = await requireAdmin();

    if (!user || !isAdmin) {
      return { error: "Unauthorized." };
    }

    const applicationId = String(formData.get("application_id") ?? "").trim();

    if (!applicationId) {
      return { error: "Missing application." };
    }

    /*
     * Verify that the application exists before deleting it.
     */
    const { data: application, error: loadError } = await supabase
      .from("applications")
      .select("id")
      .eq("id", applicationId)
      .maybeSingle();

    if (loadError) {
      return {
        error: safeAdminError(
          "The application could not be loaded.",
          loadError,
        ),
      };
    }

    if (!application) {
      return { error: "Application not found." };
    }

    /*
     * Delete ONLY the application.
     *
     * Existing database foreign keys handle dependent records:
     *
     * application_financing_requests -> CASCADE
     * ownership_plans                -> CASCADE
     * ownership plan payments        -> CASCADE
     * payment allocations            -> CASCADE
     *
     * Messages linked to the application use ON DELETE SET NULL,
     * so the customer's message history is preserved.
     *
     * The customer profile/account is NOT deleted.
     */
    const { data: deletedApplication, error: deleteError } = await supabase
      .from("applications")
      .delete()
      .eq("id", applicationId)
      .select("id")
      .maybeSingle();

    if (deleteError) {
      console.error("[deleteApplication] Delete error:", deleteError);

      return {
        error: safeAdminError(
          "The application could not be deleted.",
          deleteError,
        ),
      };
    }

    if (!deletedApplication) {
      console.error(
        "[deleteApplication] Delete affected no rows:",
        applicationId,
      );

      return {
        error:
          "The application could not be deleted. The database did not remove the application.",
      };
    }

    /*
     * Refresh affected admin/customer views.
     */
    revalidatePath("/admin");
    revalidatePath("/admin/applications");
    revalidatePath("/admin/ownership");
    revalidatePath("/admin/payments");
    revalidatePath("/dashboard");
    revalidatePath("/applications");
    revalidatePath("/payments");

    return {
      success: "Application deleted.",
    };
  } catch (error) {
    console.error("[deleteApplication] Unexpected server error:", error);

    return {
      error: "The application could not be deleted.",
    };
  }
}
