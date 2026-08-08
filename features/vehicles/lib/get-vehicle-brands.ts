import { createClient } from "@/lib/supabase/server";

export async function getVehicleBrands(): Promise<string[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("vehicles")
    .select("brand")
    .eq("published", true)
    .eq("availability", "available")
    .order("brand");

  if (error) {
    throw new Error(`Unable to load vehicle brands: ${error.message}`);
  }

  return [...new Set((data ?? []).map((vehicle) => vehicle.brand))];
}
