import { createClient } from "@/lib/supabase/server";
import { STORAGE_BUCKETS } from "./constants";
import { DOCUMENT_UPLOAD_LIMITS, validateUploadedFile } from "./file-validation";

export async function uploadLicense(
  userId: string,
  file: File,
  side: "front" | "back",
) {
  const extension = await validateUploadedFile(file, DOCUMENT_UPLOAD_LIMITS);
  const path = `${userId}/license-${side}.${extension}`;

  const supabase = await createClient();
  const { error } = await supabase.storage
    .from(STORAGE_BUCKETS.licenses)
    .upload(path, file, {
      upsert: true,
      contentType: file.type,
    });

  if (error) {
    throw error;
  }

  return path;
}
