import { createClient } from "@/lib/supabase/server";
import { STORAGE_BUCKETS } from "./constants";

export async function uploadLicense(
  userId: string,
  file: File,
  side: "front" | "back",
) {
  const extension = file.name.split(".").pop();
  const path = `${userId}/license-${side}.${extension}`;

  const supabase = await createClient();
  const { error } = await supabase.storage
    .from(STORAGE_BUCKETS.licenses)
    .upload(path, file, {
      upsert: true,
    });

  if (error) {
    throw error;
  }

  return path;
}
