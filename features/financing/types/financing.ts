export type FinancingTerms = {
  id: string;
  plan_id: string;
  currency: string;
  vehicle_price: number | null;
  down_payment: number | null;
  amount_financed: number | null;
  total_financed_repayment: number | null;
  annual_interest_rate: number | null;
  monthly_payment: number | null;
  term_months: number | null;
  first_payment_date: string | null;
  payment_frequency: "monthly";
  created_at: string;
  updated_at: string;
};

export type PaymentScheduleItem = {
  id: string;
  financing_terms_id: string;
  installment_number: number;
  due_date: string;
  amount_due: number;
  amount_paid: number;
  status: "scheduled" | "partially_paid" | "paid" | "overdue" | "cancelled";
  paid_at: string | null;
  created_at: string;
  updated_at: string;
};

export type PaymentRecord = {
  id: string;
  plan_id: string;
  schedule_id: string | null;
  amount: number;
  payment_status: "pending" | "processing" | "completed" | "failed" | "refunded" | "cancelled";
  payment_date: string | null;
  provider: string | null;
  provider_transaction_id: string | null;
  currency: string | null;
  transaction_reference: string | null;
  payment_type: "down_payment" | "installment";
};

export type PaymentAllocation = {
  payment_id: string;
  schedule_id: string;
  amount: number;
  created_at: string;
};
