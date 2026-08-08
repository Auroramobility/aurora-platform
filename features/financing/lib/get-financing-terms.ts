import { createClient } from "@/lib/supabase/server";
import type { FinancingTerms } from "@/features/financing/types/financing";

export async function getFinancingTerms(planId: string): Promise<FinancingTerms | null> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data, error } = await supabase
    .from("financing_terms")
    .select("id, plan_id, currency, vehicle_price, down_payment, amount_financed, annual_interest_rate, monthly_payment, term_months, total_financed_repayment, first_payment_date, payment_frequency, created_at, updated_at")
    .eq("plan_id", planId)
    .maybeSingle();

  if (error) throw new Error(`Unable to load financing terms: ${error.message}`);
  return data as FinancingTerms | null;
}

export async function getPaymentSchedule(planId: string): Promise<import("@/features/financing/types/financing").PaymentScheduleItem[]> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const { data: terms, error: termsError } = await supabase
    .from("financing_terms")
    .select("id")
    .eq("plan_id", planId)
    .maybeSingle();

  if (termsError || !terms) return [];

  const { data, error } = await supabase
    .from("payment_schedule")
    .select("id, financing_terms_id, installment_number, due_date, amount_due, amount_paid, status, paid_at, created_at, updated_at")
    .eq("financing_terms_id", terms.id)
    .order("installment_number", { ascending: true });

  if (error) throw new Error(`Unable to load payment schedule: ${error.message}`);
  return (data ?? []) as import("@/features/financing/types/financing").PaymentScheduleItem[];
}
