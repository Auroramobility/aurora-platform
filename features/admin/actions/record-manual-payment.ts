"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/features/admin/lib/authorization";
import { safeAdminError } from "@/features/admin/lib/errors";

export type RecordManualPaymentState = { error?: string; success?: string };

export async function recordManualPayment(
  _previousState: RecordManualPaymentState,
  formData: FormData,
): Promise<RecordManualPaymentState> {
  const { supabase, user, isAdmin } = await requireAdmin();
  if (!user || !isAdmin) return { error: "Unauthorized." };

  const planId = String(formData.get("plan_id") ?? "").trim();
  const paymentType = String(formData.get("payment_type") ?? "").trim();
  const scheduleId = String(formData.get("schedule_id") ?? "").trim();
  const amount = Number(formData.get("amount"));
  const paymentDate = String(formData.get("payment_date") ?? "").trim();
  const reference = String(formData.get("transaction_reference") ?? "").trim();

  if (!planId || !["down_payment", "installment"].includes(paymentType)) {
    return { error: "Invalid payment request." };
  }
  if (!Number.isFinite(amount) || amount <= 0)
    return { error: "Enter a valid payment amount." };
  if (!/^\d{4}-\d{2}-\d{2}$/.test(paymentDate))
    return { error: "Enter a valid payment date." };
  if (!reference) return { error: "A payment reference is required." };
  if (paymentType === "installment" && !scheduleId)
    return { error: "Select the payment installment." };

  const paymentDateTime = `${paymentDate}T12:00:00.000Z`;
  const { data, error } = await supabase.rpc("record_manual_payment", {
    p_plan_id: planId,
    p_payment_type: paymentType,
    p_amount: amount,
    p_payment_date: paymentDateTime,
    p_transaction_reference: reference,
    p_schedule_id: paymentType === "installment" ? scheduleId : undefined,
  });

  if (error || !data) {
    return {
      error: safeAdminError("The payment could not be recorded.", error),
    };
  }

  revalidatePath("/admin");
  revalidatePath(`/ownership/${planId}`);
  return {
    success: "Payment recorded and the financial schedule was updated.",
  };
}
