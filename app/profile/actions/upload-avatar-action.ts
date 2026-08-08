"use server";

import type { Database } from "@/types/supabase";
import { revalidatePath } from "next/cache";

import { createClient } from "@/lib/supabase/server";
import { uploadAvatar } from "@/lib/storage/upload-avatar";

type ProfileUpdate = Database["public"]["Tables"]["profiles"]["Update"];

export async function uploadAvatarAction(file: File) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Unauthorized");
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
