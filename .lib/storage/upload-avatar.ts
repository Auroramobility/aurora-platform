import { createClient } from "../supabase/server";
// Local fallback for STORAGE_BUCKETS to avoid missing-module errors.
// If you have a central constants file, replace this with the appropriate import.
const STORAGE_BUCKETS = {
  avatars: "avatars",
};

export async function uploadAvatar(userId: string, file: File) {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError) {
    throw new Error(
      `Unable to read authenticated user: ${userError.message}`,
    );
  }

  if (!user) {
    throw new Error("No authenticated Supabase user found.");
  }

  console.log("Avatar upload identity:", {
    actionUserId: userId,
    sessionUserId: user.id,
  });

  const extension =
    file.name.split(".").pop()?.toLowerCase() || "jpg";

  const path = `${userId}/avatar.${extension}`;

  console.log("Avatar upload path:", path);

  const { error } = await supabase.storage
    .from(STORAGE_BUCKETS.avatars)
    .upload(path, file, {
      upsert: true,
    });

  if (error) {
    console.error("Avatar storage upload failed:", error);
    throw error;
  }

  const {
    data: { publicUrl },
  } = supabase.storage
    .from(STORAGE_BUCKETS.avatars)
    .getPublicUrl(path);

  return publicUrl;
}