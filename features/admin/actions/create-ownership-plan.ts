"use server";

import { revalidatePath } from "next/cache";

import { requireAdmin } from "@/features/admin/lib/authorization";
import { safeAdminError } from "@/features/admin/lib/errors";

export type OwnershipPlanState = {
  error?: string;
  success?: string;
};

function numberOrNull(value: FormDataEntryValue | null): number | null {
  if (value === null) return null;

  const raw = String(value).trim();

  if (!raw) return null;

  const parsed = Number(raw);

  return Number.isFinite(parsed) ? parsed : null;
}

export async function createOwnershipPlan(
  _previousState: OwnershipPlanState,
  formData: FormData,
): Promise<OwnershipPlanState> {
  try {
    const { supabase, user, isAdmin } = await requireAdmin();

    if (!user || !isAdmin) {
      return { error: "Unauthorized." };
    }

    const applicationId = String(formData.get("application_id") ?? "").trim();

    const currency = String(formData.get("currency") ?? "USD")
      .trim()
      .toUpperCase();

    const vehiclePrice = numberOrNull(formData.get("vehicle_price"));

    const downPayment = numberOrNull(formData.get("down_payment"));

    const monthlyPayment = numberOrNull(formData.get("monthly_payment"));

    const termMonths = numberOrNull(formData.get("term_months"));

    const totalFinancedRepayment = numberOrNull(
      formData.get("total_financed_repayment"),
    );

    const firstPaymentDate = String(
      formData.get("first_payment_date") ?? "",
    ).trim();

    const paymentFrequency = String(
      formData.get("payment_frequency") ?? "monthly",
    )
      .trim()
      .toLowerCase();

    /*
     * ============================================================
     * REQUIRED FIELDS
     * ============================================================
     */

    if (!applicationId) {
      return { error: "Missing application." };
    }

    if (vehiclePrice === null) {
      return { error: "Enter the vehicle price." };
    }

    if (downPayment === null) {
      return { error: "Enter the down payment." };
    }

    if (monthlyPayment === null) {
      return { error: "Enter the monthly payment." };
    }

    if (termMonths === null) {
      return { error: "Enter the financing term." };
    }

    if (totalFinancedRepayment === null) {
      return { error: "Enter the total financed repayment." };
    }

    if (!firstPaymentDate) {
      return { error: "Enter the first payment date." };
    }

    /*
     * ============================================================
     * BASIC VALIDATION
     * ============================================================
     */

    if (!/^[A-Z]{3}$/.test(currency)) {
      return {
        error: "Enter a valid 3-letter currency code.",
      };
    }

    if (paymentFrequency !== "monthly") {
      return {
        error: "Only monthly financing schedules are currently supported.",
      };
    }

    if (!/^\d{4}-\d{2}-\d{2}$/.test(firstPaymentDate)) {
      return {
        error: "Enter a valid first payment date.",
      };
    }

    if (
      vehiclePrice < 0 ||
      downPayment < 0 ||
      monthlyPayment <= 0 ||
      totalFinancedRepayment <= 0 ||
      termMonths <= 0 ||
      !Number.isInteger(termMonths)
    ) {
      return {
        error: "Enter valid financing terms.",
      };
    }

    if (downPayment > vehiclePrice) {
      return {
        error: "Down payment cannot exceed vehicle price.",
      };
    }

    const amountFinanced = vehiclePrice - downPayment;

    if (totalFinancedRepayment < amountFinanced) {
      return {
        error:
          "Total financed repayment cannot be less than the amount financed.",
      };
    }

    /*
     * ============================================================
     * FIRST PAYMENT DATE
     * ============================================================
     */

    const today = new Date();

    const todayString = `${today.getUTCFullYear()}-${String(
      today.getUTCMonth() + 1,
    ).padStart(2, "0")}-${String(today.getUTCDate()).padStart(2, "0")}`;

    if (firstPaymentDate < todayString) {
      return {
        error: "First payment date must be today or later.",
      };
    }

    /*
     * ============================================================
     * PAYMENT SCHEDULE VALIDATION
     * ============================================================
     *
     * The database creates the final installment adjustment.
     * Validate the same rule here so the admin gets a normal
     * form error instead of a server exception.
     */

    const finalInstallment =
      totalFinancedRepayment - monthlyPayment * (termMonths - 1);

    if (finalInstallment <= 0) {
      return {
        error:
          "Monthly payment, term, and total repayment do not produce a valid payment schedule.",
      };
    }

    /*
     * ============================================================
     * CREATE DRAFT OWNERSHIP PLAN
     * ============================================================
     *
     * The database remains the financial source of truth.
     *
     * Interest is always 0 for Aurora's current workflow.
     */

    const rpcParams = {
      p_application_id: applicationId,
      p_currency: currency,
      p_vehicle_price: vehiclePrice,
      p_down_payment: downPayment,
      p_monthly_payment: monthlyPayment,
      p_term_months: termMonths,
      p_total_financed_repayment: totalFinancedRepayment,
      p_first_payment_date: firstPaymentDate,
      p_payment_frequency: paymentFrequency,
      p_annual_interest_rate: 0,
    };

    const { data: planId, error } = await supabase.rpc(
      "create_draft_ownership_plan",
      rpcParams,
    );

    if (error) {
      console.error("[createOwnershipPlan] RPC error:", {
        message: error.message,
        code: error.code,
        details: error.details,
        hint: error.hint,
      });

      return {
        error: safeAdminError(
          "The ownership plan could not be created.",
          error,
        ),
      };
    }

    /*
     * ============================================================
     * VERIFY PLAN ID
     * ============================================================
     */

    if (!planId) {
      console.error("[createOwnershipPlan] RPC returned no plan id.");

      return {
        error: "The ownership plan was not created. No plan ID was returned.",
      };
    }

    /*
     * ============================================================
     * PREPARE FOR CUSTOMER REVIEW
     * ============================================================
     *
     * This immediately moves:
     *
     * draft -> ready
     *
     * after the database verifies that:
     *
     * - application is approved
     * - schedule exists
     * - schedule total reconciles
     * - installment count matches the term
     *
     * This means the admin only has one action:
     *
     * Verify & create
     *
     * The separate "Mark ready for customer" action is no longer
     * required for this workflow.
     */

    const { data: prepared, error: prepareError } = await supabase.rpc(
      "prepare_ownership_plan",
      {
        p_plan_id: planId,
      },
    );

    if (prepareError || prepared !== true) {
      console.error("[createOwnershipPlan] prepare_ownership_plan error:", {
        message: prepareError?.message,
        code: prepareError?.code,
        details: prepareError?.details,
        hint: prepareError?.hint,
      });

      return {
        error: safeAdminError(
          "The ownership plan was created but could not be prepared for customer review.",
          prepareError,
        ),
      };
    }

    /*
     * ============================================================
     * REFRESH RELEVANT PAGES
     * ============================================================
     */

    revalidatePath("/admin");
    revalidatePath(`/admin/applications/${applicationId}`);
    revalidatePath(`/applications/${applicationId}`);
    revalidatePath("/payments");

    /*
     * ============================================================
     * SUCCESS
     * ============================================================
     */

    return {
      success: "Ownership plan created and is ready for customer review.",
    };
  } catch (error) {
    /*
     * Never allow an unexpected server-action exception to reach
     * the Next.js client as:
     *
     * "An unexpected response was received from the server."
     */

    console.error("[createOwnershipPlan] Unexpected server error:", error);

    return {
      error:
        "The ownership plan could not be created. Check the server log for the exact database error.",
    };
  }
}
