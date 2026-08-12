import { createClient } from "@/lib/supabase/server";
import { STORAGE_BUCKETS } from "./constants";
import { AVATAR_UPLOAD_LIMITS, validateUploadedFile } from "./file-validation";

export async function uploadAvatar(userId: string, file: File) {
  const extension = await validateUploadedFile(file, AVATAR_UPLOAD_LIMITS);
  const path = `${userId}/avatar.${extension}`;

  const supabase = await createClient();
  const { error } = await supabase.storage
    .from(STORAGE_BUCKETS.avatars)
    .upload(path, file, {
      upsert: true,
      contentType: file.type,
    });

  if (error) {
    throw error;
  }

  const {
    data: { publicUrl },
  } = supabase.storage.from(STORAGE_BUCKETS.avatars).getPublicUrl(path);

  return publicUrl;
}
