"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/features/admin/lib/authorization";
import { createClient } from "@/lib/supabase/server";
import { STORAGE_BUCKETS } from "@/lib/storage/constants";
import {
  validateUploadedFile,
  DOCUMENT_UPLOAD_LIMITS,
  FileValidationError,
} from "@/lib/storage/file-validation";

const IMAGE_LIMITS = {
  allowedMimeTypes: ["image/jpeg", "image/png", "image/webp"] as const,
  maxSizeBytes: 10 * 1024 * 1024,
};

export type UploadImageState = {
  error?: string;
  success?: boolean;
};

export async function uploadVehicleImageAction(
  vehicleId: string,
  formData: FormData,
): Promise<UploadImageState> {
  const { supabase, isAdmin } = await requireAdmin();
  if (!isAdmin) return { error: "Unauthorized." };

  const file = formData.get("image") as File | null;
  if (!file || file.size === 0) return { error: "No file selected." };

  let extension: string;
  try {
    extension = await validateUploadedFile(file, IMAGE_LIMITS);
  } catch (err) {
    return {
      error: err instanceof FileValidationError ? err.message : "Invalid file.",
    };
  }

  // Get current max sort_order for this vehicle
  const { data: existing } = await supabase
    .from("vehicle_images")
    .select("sort_order")
    .eq("vehicle_id", vehicleId)
    .order("sort_order", { ascending: false })
    .limit(1);

  const nextOrder = (existing?.[0]?.sort_order ?? -1) + 1;

  const path = `${vehicleId}/${Date.now()}-${nextOrder}.${extension}`;

  const { error: uploadError } = await supabase.storage
    .from(STORAGE_BUCKETS.vehicleImages)
    .upload(path, file, { contentType: file.type, upsert: false });

  if (uploadError) {
    console.error("UPLOAD ERROR:", uploadError);
    return { error: uploadError.message };
  }

  const {
    data: { publicUrl },
  } = supabase.storage.from(STORAGE_BUCKETS.vehicleImages).getPublicUrl(path);

  // Insert into vehicle_images
  const { error: insertError } = await supabase.from("vehicle_images").insert({
    vehicle_id: vehicleId,
    image_url: publicUrl,
    sort_order: nextOrder,
  });

  if (insertError) {
    console.error("INSERT ERROR:", insertError);
    return { error: insertError.message };
  }

  // If this is the first image, also set it as the primary image_url
  if (nextOrder === 0) {
    await supabase
      .from("vehicles")
      .update({ image_url: publicUrl })
      .eq("id", vehicleId);
  }

  revalidatePath(`/admin/vehicles/${vehicleId}`);
  revalidatePath(`/vehicles/${vehicleId}`);
  return { success: true };
}

export async function deleteVehicleImageAction(
  imageId: string,
  vehicleId: string,
  storagePath: string,
): Promise<UploadImageState> {
  const { supabase, isAdmin } = await requireAdmin();
  if (!isAdmin) return { error: "Unauthorized." };

  // Delete from storage
  await supabase.storage
    .from(STORAGE_BUCKETS.vehicleImages)
    .remove([storagePath]);

  // Delete record
  const { error } = await supabase
    .from("vehicle_images")
    .delete()
    .eq("id", imageId);

  if (error) return { error: error.message };

  revalidatePath(`/admin/vehicles/${vehicleId}`);
  revalidatePath(`/vehicles/${vehicleId}`);
  return { success: true };
}

export async function setPrimaryImageAction(
  vehicleId: string,
  imageUrl: string,
): Promise<UploadImageState> {
  const { supabase, isAdmin } = await requireAdmin();
  if (!isAdmin) return { error: "Unauthorized." };

  const { error } = await supabase
    .from("vehicles")
    .update({ image_url: imageUrl })
    .eq("id", vehicleId);

  if (error) return { error: error.message };

  revalidatePath(`/admin/vehicles/${vehicleId}`);
  revalidatePath(`/vehicles/${vehicleId}`);
  return { success: true };
}
