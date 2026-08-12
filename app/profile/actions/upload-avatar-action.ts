"use server";

import type { Database } from "@/types/supabase";
import { revalidatePath } from "next/cache";

import { createClient } from "@/lib/supabase/server";
import { uploadAvatar } from "@/lib/storage/upload-avatar";
import { checkRateLimit, RATE_LIMIT_MESSAGE } from "@/lib/rate-limit";

type ProfileUpdate = Database["public"]["Tables"]["profiles"]["Update"];

export async function uploadAvatarAction(file: File) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  const allowed = await checkRateLimit({
    action: "upload_document",
    maxHits: 10,
    windowSeconds: 5 * 60,
  });

  if (!allowed) {
    throw new Error(RATE_LIMIT_MESSAGE);
  }

  const publicUrl = await uploadAvatar(user.id, file);

  const updates: ProfileUpdate = {
    profile_photo_url: publicUrl,
  };

  const { error } = await supabase
    .from("profiles")
    .update(updates)
    .eq("user_id", user.id);

  if (error) {
    throw error;
  }

  revalidatePath("/profile");
  revalidatePath("/dashboard");

  return publicUrl;
}
