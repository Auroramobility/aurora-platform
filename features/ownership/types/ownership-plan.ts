export const OWNERSHIP_PLAN_STATUSES = [
  "draft",
  "ready",
  "accepted",
  "declined",
  "active",
  "completed",
  "paused",
  "cancelled",
] as const;

export type OwnershipPlanStatus = (typeof OWNERSHIP_PLAN_STATUSES)[number];

export type OwnershipPlan = {
  id: string;
  application_id: string;
  status: OwnershipPlanStatus;
  created_at: string | null;
  accepted_at: string | null;
  declined_at: string | null;
  activated_at: string | null;
};

export const OWNERSHIP_PLAN_STATUS_CONFIG: Record<OwnershipPlanStatus, {
  label: string;
  description: string;
  customerAction: "review" | "none";
  terminal: boolean;
}> = {
  draft: {
    label: "Preparing",
    description: "Aurora is preparing your ownership terms.",
    customerAction: "none",
    terminal: false,
  },
  ready: {
    label: "Ready for review",
    description: "Your ownership terms are ready for you to review.",
    customerAction: "review",
    terminal: false,
  },
  accepted: {
    label: "Accepted",
    description: "You accepted the ownership terms. Aurora can now prepare the next ownership step.",
    customerAction: "none",
    terminal: false,
  },
  declined: {
    label: "Declined",
    description: "You declined these ownership terms. Aurora will need to review the next step with you.",
    customerAction: "none",
    terminal: true,
  },
  active: {
    label: "Active",
    description: "Your Aurora ownership plan is active.",
    customerAction: "none",
    terminal: false,
  },
  completed: {
    label: "Completed",
    description: "This ownership plan has been completed.",
    customerAction: "none",
    terminal: true,
  },
  paused: {
    label: "Paused",
    description: "This ownership plan is temporarily paused.",
    customerAction: "none",
    terminal: false,
  },
  cancelled: {
    label: "Cancelled",
    description: "This ownership plan is no longer active.",
    customerAction: "none",
    terminal: true,
  },
};

export function getOwnershipPlanStatusConfig(status: OwnershipPlanStatus) {
  return OWNERSHIP_PLAN_STATUS_CONFIG[status];
}
