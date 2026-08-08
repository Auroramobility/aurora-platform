import { createClient } from "@/lib/supabase/server";
import type { Application, ApplicationStatus } from "@/features/applications/types/application";

const APPLICATION_SELECT = `
  id,
  user_id,
  vehicle_id,
  status,
  application_date,
  approved_date
` as const;

function toApplication(row: {
  id: string;
  user_id: string;
  vehicle_id: string;
  status: string | null;
  application_date: string | null;
  approved_date: string | null;
}): Application {
  const status = row.status ?? "pending";
  if (!["pending", "reviewing", "approved", "rejected", "cancelled"].includes(status)) {
    throw new Error("Invalid application status returned by the database.");
  }

  return { ...row, status: status as ApplicationStatus };
}

export async function getApplicationsForUser(): Promise<Application[]> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return [];

  const { data, error } = await supabase
    .from("applications")
    .select(APPLICATION_SELECT)
    .eq("user_id", user.id)
    .order("application_date", { ascending: false });

  if (error) throw new Error(`Unable to load applications: ${error.message}`);

  return (data ?? []).map(toApplication);
}

export async function getApplicationForUser(id: string): Promise<Application | null> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return null;

  const { data, error } = await supabase
    .from("applications")
    .select(APPLICATION_SELECT)
    .eq("id", id)
    .eq("user_id", user.id)
    .maybeSingle();

  if (error) throw new Error(`Unable to load application: ${error.message}`);
  return data ? toApplication(data) : null;
}
