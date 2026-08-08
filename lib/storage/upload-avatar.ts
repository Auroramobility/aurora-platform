import { createClient } from "@/lib/supabase/server";
import { STORAGE_BUCKETS } from "./constants";

export async function uploadAvatar(userId: string, file: File) {
  const supabase = await createClient();

  const extension = file.name.split(".").pop();

  const path = `${userId}/avatar.${extension}`;

  const { error } = await supabase.storage
    .from(STORAGE_BUCKETS.avatars)
    .upload(path, file, {
      upsert: true,
    });

  if (error) {
    throw error;
  }

  const {
    data: { publicUrl },
  } = supabase.storage.from(STORAGE_BUCKETS.avatars).getPublicUrl(path);

  return publicUrl;
}
