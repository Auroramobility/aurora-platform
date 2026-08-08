export const APPLICATION_STATUSES = [
  "pending",
  "reviewing",
  "approved",
  "rejected",
  "cancelled",
] as const;

export type ApplicationStatus = (typeof APPLICATION_STATUSES)[number];

export type Application = {
  id: string;
  user_id: string;
  vehicle_id: string;
  status: ApplicationStatus;
  application_date: string | null;
  approved_date: string | null;
};
