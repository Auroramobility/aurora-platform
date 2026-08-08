import { createClient } from "@/lib/supabase/server";
import type { FinancingTerms, PaymentScheduleItem, PaymentRecord } from "@/features/financing/types/financing";
import type { OwnershipPlan, OwnershipPlanStatus } from "@/features/ownership/types/ownership-plan";

const PLAN_SELECT = `
  id,
  application_id,
  status,
  created_at,
  accepted_at,
  declined_at,
  activated_at
` as const;

const FINANCING_SELECT = `
  id,
  plan_id,
  currency,
  vehicle_price,
  down_payment,
  amount_financed,
  annual_interest_rate,
  monthly_payment,
  term_months,
  total_financed_repayment,
  first_payment_date,
  payment_frequency,
  created_at,
  updated_at
` as const;

const SCHEDULE_SELECT = `
  id,
  financing_terms_id,
  installment_number,
  due_date,
  amount_due,
  amount_paid,
  status,
  paid_at,
  created_at,
  updated_at
` as const;

export type OwnershipPlanView = {
  ownershipPlan: OwnershipPlan;
  financingTerms: FinancingTerms | null;
  paymentSchedule: PaymentScheduleItem[];
  payments: PaymentRecord[];
  remainingBalance: number | null;
};

function toOwnershipPlan(row: Record<string, unknown>): OwnershipPlan {
  const value = String(row.status ?? "draft");
  const allowed: OwnershipPlanStatus[] = [
    "draft",
    "ready",
    "accepted",
    "declined",
    "active",
    "completed",
    "paused",
    "cancelled",
  ];

  if (!allowed.includes(value as OwnershipPlanStatus)) {
    throw new Error("Invalid ownership plan status returned by the database.");
  }

  const paymentFrequency = String(row.payment_frequency ?? "monthly");
  if (paymentFrequency !== "monthly") {
    throw new Error("Unsupported financing payment frequency returned by the database.");
  }

  return {
    id: String(row.id),
    application_id: String(row.application_id),
    status: value as OwnershipPlanStatus,
    created_at: row.created_at == null ? null : String(row.created_at),
    accepted_at: row.accepted_at == null ? null : String(row.accepted_at),
    declined_at: row.declined_at == null ? null : String(row.declined_at),
    activated_at: row.activated_at == null ? null : String(row.activated_at),
  };
}

function toFinancingTerms(row: Record<string, unknown>): FinancingTerms {
  const paymentFrequency = String(row.payment_frequency ?? "monthly");
  if (paymentFrequency !== "monthly") {
    throw new Error("Unsupported financing payment frequency returned by the database.");
  }

  return {
    id: String(row.id),
    plan_id: String(row.plan_id),
    currency: String(row.currency ?? "USD"),
    vehicle_price: row.vehicle_price == null ? null : Number(row.vehicle_price),
    down_payment: row.down_payment == null ? null : Number(row.down_payment),
    amount_financed: row.amount_financed == null ? null : Number(row.amount_financed),
    annual_interest_rate: row.annual_interest_rate == null ? null : Number(row.annual_interest_rate),
    monthly_payment: row.monthly_payment == null ? null : Number(row.monthly_payment),
    term_months: row.term_months == null ? null : Number(row.term_months),
    total_financed_repayment: row.total_financed_repayment == null ? null : Number(row.total_financed_repayment),
    first_payment_date: row.first_payment_date == null ? null : String(row.first_payment_date),
    payment_frequency: paymentFrequency,
    created_at: String(row.created_at),
    updated_at: String(row.updated_at),
  };
}

function toPaymentScheduleItem(row: Record<string, unknown>): PaymentScheduleItem {
  const paymentFrequency = String(row.payment_frequency ?? "monthly");
  if (paymentFrequency !== "monthly") {
    throw new Error("Unsupported financing payment frequency returned by the database.");
  }

  return {
    id: String(row.id),
    financing_terms_id: String(row.financing_terms_id),
    installment_number: Number(row.installment_number),
    due_date: String(row.due_date),
    amount_due: Number(row.amount_due),
    amount_paid: Number(row.amount_paid),
    status: String(row.status) as PaymentScheduleItem["status"],
    paid_at: row.paid_at == null ? null : String(row.paid_at),
    created_at: String(row.created_at),
    updated_at: String(row.updated_at),
  };
}

export async function getOwnershipPlan(id: string): Promise<OwnershipPlanView | null> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data, error } = await supabase
    .from("ownership_plans")
    .select(PLAN_SELECT)
    .eq("id", id)
    .maybeSingle();

  if (error) throw new Error(`Unable to load ownership plan: ${error.message}`);
  if (!data) return null;

  const ownershipPlan = toOwnershipPlan(data as Record<string, unknown>);

  const { data: termsRow, error: termsError } = await supabase
    .from("financing_terms")
    .select(FINANCING_SELECT)
    .eq("plan_id", id)
    .maybeSingle();

  if (termsError) throw new Error(`Unable to load financing terms: ${termsError.message}`);

  if (!termsRow) {
    return { ownershipPlan, financingTerms: null, paymentSchedule: [], payments: [], remainingBalance: null };
  }

  const financingTerms = toFinancingTerms(termsRow as Record<string, unknown>);
  const { data: scheduleRows, error: scheduleError } = await supabase
    .from("payment_schedule")
    .select(SCHEDULE_SELECT)
    .eq("financing_terms_id", financingTerms.id)
    .order("installment_number", { ascending: true });

  if (scheduleError) throw new Error(`Unable to load payment schedule: ${scheduleError.message}`);

  const paymentSchedule = (scheduleRows ?? []).map((row) => toPaymentScheduleItem(row as Record<string, unknown>));
  const { data: paymentRows, error: paymentsError } = await supabase
    .from("payments")
    .select("id, plan_id, schedule_id, amount, payment_status, payment_date, provider, provider_transaction_id, currency, transaction_reference, payment_type")
    .eq("plan_id", id)
    .order("payment_date", { ascending: false });

  if (paymentsError) throw new Error(`Unable to load payment history: ${paymentsError.message}`);

  const payments = (paymentRows ?? []).map((row) => ({
    id: String(row.id),
    plan_id: String(row.plan_id),
    schedule_id: row.schedule_id == null ? null : String(row.schedule_id),
    amount: Number(row.amount),
    payment_status: String(row.payment_status) as PaymentRecord["payment_status"],
    payment_date: row.payment_date == null ? null : String(row.payment_date),
    provider: row.provider == null ? null : String(row.provider),
    provider_transaction_id: row.provider_transaction_id == null ? null : String(row.provider_transaction_id),
    currency: row.currency == null ? null : String(row.currency),
    transaction_reference: row.transaction_reference == null ? null : String(row.transaction_reference),
    payment_type: String(row.payment_type ?? "installment") as PaymentRecord["payment_type"],
  }));

  const remainingBalance = paymentSchedule.length > 0
    ? Number(paymentSchedule
        .filter((item) => item.status !== "cancelled")
        .reduce((sum, item) => sum + Math.max(0, item.amount_due - item.amount_paid), 0)
        .toFixed(2))
    : financingTerms.total_financed_repayment;

  return { ownershipPlan, financingTerms, paymentSchedule, payments, remainingBalance };
}
