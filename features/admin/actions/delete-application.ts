"use server";

import { revalidatePath } from "next/cache";

import { requireAdmin } from "@/features/admin/lib/authorization";

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
      return {
        error: "Unauthorized.",
      };
    }

    const applicationId = String(formData.get("application_id") ?? "").trim();

    if (!applicationId) {
      return {
        error: "Missing application.",
      };
    }

    /*
     * Verify that the application exists.
     */
    const { data: application, error: loadError } = await supabase
      .from("applications")
      .select("id")
      .eq("id", applicationId)
      .maybeSingle();

    if (loadError) {
      console.error("[deleteApplication] Application load error:", loadError);

      return {
        error: "The application could not be loaded.",
      };
    }

    if (!application) {
      return {
        error: "Application not found.",
      };
    }

    /*
     * The database function performs the complete application
     * cascade deletion.
     *
     * This removes:
     *
     * application
     * ownership plans
     * financing terms
     * payment schedules
     * payments
     * payment allocations
     * application financing requests
     *
     * Conversation records are preserved according to their
     * database foreign-key behavior.
     */
    const { data, error: deleteError } = await supabase.rpc(
      "delete_application_cascade",
      {
        p_application_id: applicationId,
      },
    );

    if (deleteError) {
      console.error("[deleteApplication] Delete error:", deleteError);

      return {
        error: "The application could not be deleted.",
      };
    }

    /*
     * The database function should return true when deletion
     * succeeds.
     */
    if (data !== true) {
      console.error("[deleteApplication] Delete function returned:", data);

      return {
        error:
          "The application could not be deleted. The database did not confirm the deletion.",
      };
    }

    /*
     * Refresh all affected views.
     */
    revalidatePath("/admin");
    revalidatePath("/admin/applications");
    revalidatePath("/admin/ownership");
    revalidatePath("/admin/payments");
    revalidatePath("/admin/messages");
    revalidatePath("/dashboard");
    revalidatePath("/applications");
    revalidatePath("/payments");
    revalidatePath("/messages");

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
