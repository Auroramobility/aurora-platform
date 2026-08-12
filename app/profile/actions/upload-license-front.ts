"use server";

import { revalidatePath } from "next/cache";

import { createClient } from "@/lib/supabase/server";
import { uploadLicense } from "@/lib/storage/upload-license";
import { checkRateLimit, RATE_LIMIT_MESSAGE } from "@/lib/rate-limit";

export async function uploadLicenseFrontAction(file: File) {
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

  const path = await uploadLicense(user.id, file, "front");

  const { error } = await supabase
    .from("profiles")
    .update({
      drivers_license_front: path,
    })
    .eq("user_id", user.id);

  if (error) {
    throw error;
  }

  revalidatePath("/profile");
  revalidatePath("/dashboard");

  return path;
}
