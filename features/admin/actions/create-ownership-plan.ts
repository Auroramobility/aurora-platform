"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/features/admin/lib/authorization";
import { safeAdminError } from "@/features/admin/lib/errors";

export type OwnershipPlanState = { error?: string; success?: string };

function numberOrNull(value: FormDataEntryValue | null) {
  if (value === null || String(value).trim() === "") return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

export async function createOwnershipPlan(_previousState: OwnershipPlanState, formData: FormData): Promise<OwnershipPlanState> {
  const { supabase, user, isAdmin } = await requireAdmin();
  if (!user || !isAdmin) return { error: "Unauthorized." };

  const applicationId = String(formData.get("application_id") ?? "");
  const vehiclePrice = numberOrNull(formData.get("vehicle_price"));
  const downPayment = numberOrNull(formData.get("down_payment"));
  const monthlyPayment = numberOrNull(formData.get("monthly_payment"));
  const termMonths = numberOrNull(formData.get("term_months"));
  const totalFinancedRepayment = numberOrNull(formData.get("total_financed_repayment"));
  const firstPaymentDate = String(formData.get("first_payment_date") ?? "").trim();
  const paymentFrequency = String(formData.get("payment_frequency") ?? "monthly").trim().toLowerCase();
  const currency = String(formData.get("currency") ?? "USD").trim().toUpperCase();
  const annualInterestRate = numberOrNull(formData.get("annual_interest_rate"));

  if (!applicationId || vehiclePrice === null || downPayment === null || monthlyPayment === null || termMonths === null || totalFinancedRepayment === null || !firstPaymentDate) {
    return { error: "Complete all financing terms." };
  }

  if (currency.length !== 3 || !/^[A-Z]{3}$/.test(currency)) return { error: "Enter a valid 3-letter currency code." };
  if (paymentFrequency !== "monthly") return { error: "Only monthly financing schedules are currently supported." };
  if (!/^\d{4}-\d{2}-\d{2}$/.test(firstPaymentDate)) return { error: "Enter a valid first payment date." };
  if (
    vehiclePrice < 0 ||
    downPayment < 0 ||
    monthlyPayment <= 0 ||
    totalFinancedRepayment <= 0 ||
    downPayment > vehiclePrice ||
    totalFinancedRepayment < vehiclePrice - downPayment ||
    termMonths <= 0 ||
    !Number.isInteger(termMonths) ||
    (annualInterestRate !== null && annualInterestRate < 0)
  ) {
    return { error: "Enter valid financing terms." };
  }

  const today = new Date().toISOString().slice(0, 10);
  if (firstPaymentDate < today) return { error: "First payment date must be today or later." };

  const finalInstallment = totalFinancedRepayment - monthlyPayment * (termMonths - 1);
  if (finalInstallment <= 0) return { error: "Monthly payment, term, and contract total do not produce a valid schedule." };

  const { data: planId, error } = await supabase.rpc("create_draft_ownership_plan", {
    p_application_id: applicationId,
    p_currency: currency,
    p_vehicle_price: vehiclePrice,
    p_down_payment: downPayment,
    p_monthly_payment: monthlyPayment,
    p_term_months: termMonths,
    p_total_financed_repayment: totalFinancedRepayment,
    p_first_payment_date: firstPaymentDate,
    p_payment_frequency: paymentFrequency,
    p_annual_interest_rate: annualInterestRate,
  });

  if (error || !planId) return { error: safeAdminError("The ownership plan could not be created.", error) };

  revalidatePath("/admin");
  revalidatePath(`/applications/${applicationId}`);
  return { success: "Draft financing terms and payment schedule created." };
}
