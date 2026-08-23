"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import { checkRateLimit, RATE_LIMIT_MESSAGE } from "@/lib/rate-limit";
import { getAuroraPricing } from "@/lib/vehicles/aurora-pricing";

export type CreateApplicationState = {
  error?: string;
};

function numberOrNull(value: FormDataEntryValue | null) {
  if (value === null || String(value).trim() === "") {
    return null;
  }

  const parsed = Number(value);

  return Number.isFinite(parsed) ? parsed : null;
}

export async function createApplication(
  _previousState: CreateApplicationState,
  formData: FormData,
): Promise<CreateApplicationState> {
  /*
   * ============================================================
   * AUTHENTICATION
   * ============================================================
   */

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  /*
   * ============================================================
   * INPUT
   * ============================================================
   */

  const vehicleId = String(formData.get("vehicle_id") ?? "").trim();

  if (!vehicleId) {
    return {
      error: "Select a vehicle before applying.",
    };
  }

  /*
   * Only accept the customer's preferences.
   *
   * Monetary values are intentionally NOT accepted from the browser.
   * The server calculates them from the authoritative vehicle price
   * and the existing Aurora pricing model.
   *
   * Customer contribution is a configurable percentage from 10% to
   * 100%.
   *
   * IMPORTANT:
   * The 30% Aurora delivery threshold is a separate ownership rule.
   * It is NOT the minimum customer contribution and is NOT enforced
   * here.
   */

  const downPaymentPercent = numberOrNull(formData.get("down_payment_percent"));

  const requestedTermMonths = numberOrNull(formData.get("term_months"));

  /*
   * ============================================================
   * RATE LIMIT
   * ============================================================
   */

  const allowed = await checkRateLimit({
    action: "create_application",
    maxHits: 10,
    windowSeconds: 60 * 60,
  });

  if (!allowed) {
    return {
      error: RATE_LIMIT_MESSAGE,
    };
  }

  /*
   * ============================================================
   * VERIFY VEHICLE
   * ============================================================
   *
   * The database vehicle price is authoritative.
   *
   * vehicles.price remains the market/reference price.
   * Aurora Access Price is derived from that price using the
   * existing deterministic Aurora pricing helper.
   */

  const { data: vehicle, error: vehicleError } = await supabase
    .from("vehicles")
    .select("id, price, brand, model, trim")
    .eq("id", vehicleId)
    .eq("published", true)
    .eq("availability", "available")
    .maybeSingle();

  if (vehicleError || !vehicle) {
    return {
      error: "This vehicle is no longer available for applications.",
    };
  }

  const authoritativeMarketPrice = Number(vehicle.price ?? 0);

  if (
    !Number.isFinite(authoritativeMarketPrice) ||
    authoritativeMarketPrice <= 0
  ) {
    return {
      error: "This vehicle does not currently have a valid price.",
    };
  }

  /*
   * ============================================================
   * AURORA ACCESS PRICE
   * ============================================================
   *
   * Do not trust a vehicle price supplied by the browser.
   *
   * The authoritative market price comes from the database and
   * the existing Aurora pricing helper derives the customer-facing
   * Aurora Access Price.
   */

  const pricing = getAuroraPricing(authoritativeMarketPrice, vehicle.id);

  const auroraAccessPrice = pricing.auroraAccessPrice;

  if (
    auroraAccessPrice == null ||
    !Number.isFinite(auroraAccessPrice) ||
    auroraAccessPrice <= 0
  ) {
    return {
      error:
        "This vehicle does not currently have a valid Aurora Access Price.",
    };
  }

  /*
   * ============================================================
   * VALIDATE CUSTOMER PREFERENCES
   * ============================================================
   *
   * Customer contribution:
   * 10% minimum
   * 100% maximum
   *
   * This is independent from the 30% vehicle delivery threshold.
   */

  const finalDownPaymentPercent = downPaymentPercent ?? 10;

  const finalTermMonths = requestedTermMonths ?? 24;

  if (
    !Number.isFinite(finalDownPaymentPercent) ||
    finalDownPaymentPercent < 10 ||
    finalDownPaymentPercent > 100
  ) {
    return {
      error: "Contribution must be between 10% and 100%.",
    };
  }

  if (
    !Number.isFinite(finalTermMonths) ||
    !Number.isInteger(finalTermMonths) ||
    finalTermMonths < 1 ||
    finalTermMonths > 48
  ) {
    return {
      error: "Ownership duration must be between 1 and 48 months.",
    };
  }

  /*
   * ============================================================
   * CALCULATE CUSTOMER REQUEST
   * ============================================================
   *
   * These are estimates only.
   *
   * They are NOT approved financing terms.
   *
   * IMPORTANT:
   * All customer ownership calculations use the Aurora Access
   * Price, not the market/reference price.
   *
   * The customer's selected contribution can be anywhere from
   * 10% to 100%.
   *
   * The separate 30% delivery threshold is not calculated here.
   * It will be handled by the ownership/payment workflow.
   */

  const requestedDownPayment =
    auroraAccessPrice * (finalDownPaymentPercent / 100);

  const requestedAmountFinanced = Math.max(
    auroraAccessPrice - requestedDownPayment,
    0,
  );

  const estimatedMonthlyPayment =
    finalTermMonths > 0
      ? requestedAmountFinanced / finalTermMonths
      : requestedAmountFinanced;

  const estimatedTotalPaid =
    requestedDownPayment + estimatedMonthlyPayment * finalTermMonths;

  /*
   * ============================================================
   * PREVENT DUPLICATE ACTIVE APPLICATION
   * ============================================================
   */

  const { data: existing } = await supabase
    .from("applications")
    .select("id")
    .eq("user_id", user.id)
    .eq("vehicle_id", vehicleId)
    .in("status", ["pending", "reviewing", "approved"])
    .maybeSingle();

  if (existing) {
    return {
      error: "You already have an active application for this vehicle.",
    };
  }

  /*
   * ============================================================
   * CREATE APPLICATION
   * ============================================================
   */

  const { data: application, error: applicationError } = await supabase
    .from("applications")
    .insert({
      user_id: user.id,
      vehicle_id: vehicleId,
      status: "pending",
    })
    .select("id")
    .single();

  if (applicationError || !application) {
    return {
      error: "We couldn't submit your application. Please try again.",
    };
  }

  /*
   * ============================================================
   * SAVE CUSTOMER FINANCING REQUEST
   * ============================================================
   *
   * This table stores the customer's calculator request.
   *
   * vehicle_price represents the Aurora Access Price used for
   * the customer's ownership estimate.
   *
   * It does NOT establish:
   *
   * - financing approval
   * - lender selection
   * - payment confirmation
   * - ownership approval
   * - final ownership terms
   *
   * The separate 30% delivery threshold is an ownership/payment
   * milestone and is not stored as the customer's contribution
   * percentage here.
   */

  const { error: financingRequestError } = await supabase
    .from("application_financing_requests")
    .insert({
      application_id: application.id,

      vehicle_price: auroraAccessPrice,

      currency: "USD",

      down_payment_percent: finalDownPaymentPercent,

      requested_down_payment: requestedDownPayment,

      requested_amount_financed: requestedAmountFinanced,

      requested_term_months: finalTermMonths,

      estimated_monthly_payment: estimatedMonthlyPayment,

      estimated_total_paid: estimatedTotalPaid,
    });

  /*
   * ============================================================
   * ROLLBACK APPLICATION IF REQUEST SAVE FAILS
   * ============================================================
   */

  if (financingRequestError) {
    await supabase.from("applications").delete().eq("id", application.id);

    return {
      error: "We couldn't save your ownership preferences. Please try again.",
    };
  }

  /*
   * ============================================================
   * COMPLETE
   * ============================================================
   */

  revalidatePath("/dashboard");
  revalidatePath("/applications");

  redirect("/applications");
}
