"use server";

import { revalidatePath } from "next/cache";

import { createClient } from "@/lib/supabase/server";
import { uploadLicense } from "@/lib/storage/upload-license";

export async function uploadLicenseBackAction(file: File) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  const path = await uploadLicense(user.id, file, "back");

  const { error } = await supabase
    .from("profiles")
    .update({
      drivers_license_back: path,
    })
    .eq("user_id", user.id);

  if (error) {
    throw error;
  }

  revalidatePath("/profile");
  revalidatePath("/dashboard");

  return path;
}
