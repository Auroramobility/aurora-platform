import type { ApplicationStatus } from "./application";

export type ApplicationStatusConfig = {
  label: string;
  description: string;
  timelinePosition: number;
  terminal: boolean;
};

export const APPLICATION_STATUS_CONFIG: Record<
  ApplicationStatus,
  ApplicationStatusConfig
> = {
  pending: {
    label: "Pending",
    description: "Your application is in Aurora's queue for review.",
    timelinePosition: 0,
    terminal: false,
  },

  reviewing: {
    label: "Reviewing",
    description: "Aurora is reviewing your application and documents.",
    timelinePosition: 1,
    terminal: false,
  },

  approved: {
    label: "Approved",
    description:
      "Your application is approved and can move into ownership planning.",
    timelinePosition: 2,
    terminal: false,
  },

  rejected: {
    label: "Rejected",
    description: "Aurora was unable to approve this application.",
    timelinePosition: -1,
    terminal: true,
  },

  cancelled: {
    label: "Cancelled",
    description: "This application is no longer active.",
    timelinePosition: -1,
    terminal: true,
  },
};

export const APPLICATION_TIMELINE = [
  {
    status: "pending" as const,
    title: "Application submitted",
    description: "Your application is in Aurora's queue for review.",
  },

  {
    status: "reviewing" as const,
    title: "Aurora review",
    description: "Our team is reviewing your application and documents.",
  },

  {
    status: "approved" as const,
    title: "Ownership approved",
    description:
      "Your application has been approved and can move into ownership planning.",
  },
];

export function getApplicationStatusConfig(status: ApplicationStatus) {
  return APPLICATION_STATUS_CONFIG[status];
}

export function getApplicationNextAction({
  status,
  profileComplete,
  identityVerified,
  hasOwnershipPlan,
  ownershipPlanId,
  ownershipPlanStatus,
}: {
  status: ApplicationStatus;
  profileComplete: boolean;
  identityVerified: boolean;
  hasOwnershipPlan: boolean;
  ownershipPlanId?: string | null;
  ownershipPlanStatus?: string | null;
}) {
  if (!profileComplete) {
    return {
      title: "Complete your profile",
      description:
        "Add your required profile information so Aurora can continue reviewing your application.",
      href: "/profile",
      actionLabel: "Complete profile",
    };
  }

  if (!identityVerified && (status === "pending" || status === "reviewing")) {
    return {
      title: "Verify your identity",
      description:
        "Complete identity verification before Aurora can finish the ownership review.",
      href: "/profile",
      actionLabel: "Verify identity",
    };
  }

  if (status === "approved" && !hasOwnershipPlan) {
    return {
      title: "Aurora is preparing your ownership plan",
      description:
        "Your application is approved. Aurora will provide the ownership terms before any payment is requested.",
      href: null,
      actionLabel: null,
    };
  }

  if (
    status === "approved" &&
    ownershipPlanId &&
    ownershipPlanStatus === "ready"
  ) {
    return {
      title: "Review your ownership plan",
      description:
        "Your ownership terms are ready. Review them before accepting or declining the plan.",
      href: `/ownership/${ownershipPlanId}`,
      actionLabel: "Review ownership plan",
    };
  }

  if (
    status === "approved" &&
    ownershipPlanId &&
    ownershipPlanStatus === "declined"
  ) {
    return {
      title: "Ownership plan declined",
      description:
        "You declined the current ownership terms. Aurora will need to review the next step with you.",
      href: `/ownership/${ownershipPlanId}`,
      actionLabel: "View ownership plan",
    };
  }

  /*
   * Once the customer has accepted the ownership plan,
   * the next trusted step is to message Aurora about
   * the down payment.
   *
   * The actual payment-intent message is created by
   * continueToPayment(), not by this status function.
   */
  if (
    status === "approved" &&
    ownershipPlanId &&
    ownershipPlanStatus === "accepted"
  ) {
    return {
      title: "Message Aurora for your down payment",
      description:
        "Your ownership plan has been accepted. Message Aurora to confirm you're ready for the down payment and continue to the next step.",
      href: null,
      actionLabel: "Message Aurora",
    };
  }

  if (status === "approved" && ownershipPlanId) {
    return {
      title: "View your ownership plan",
      description: "Review the current ownership plan and its status.",
      href: `/ownership/${ownershipPlanId}`,
      actionLabel: "View ownership plan",
    };
  }

  if (status === "rejected") {
    return {
      title: "Contact Aurora about your application",
      description:
        "Review any available feedback or contact the Aurora team to understand your next options.",
      href: "/messages",
      actionLabel: "View messages",
    };
  }

  if (status === "cancelled") {
    return {
      title: "Start a new ownership journey",
      description:
        "This application is no longer active. You can browse eligible vehicles and apply again.",
      href: "/vehicles",
      actionLabel: "Browse vehicles",
    };
  }

  return {
    title: "Aurora is reviewing your application",
    description:
      "Follow the timeline below. If Aurora needs anything from you, the next action will appear here.",
    href: null,
    actionLabel: null,
  };
}
