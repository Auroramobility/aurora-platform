/**
 * EXAMPLE — not wired up to a route or component.
 *
 * Rename to `vehicles.service.ts` (drop `.example`) once the
 * `vehicles` table exists in Supabase, then regenerate
 * `types/supabase.ts` so `Database["public"]["Tables"]["vehicles"]`
 * resolves to a real row type.
 */
import { createClient } from "@/lib/supabase/server";

export async function getVehicles() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("vehicles")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(`Failed to load vehicles: ${error.message}`);
  }

  return data;
}
