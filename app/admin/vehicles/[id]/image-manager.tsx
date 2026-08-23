"use client";

import { useState, useTransition, useRef } from "react";
import {
  Upload,
  Trash2,
  Star,
  StarOff,
  ImagePlus,
  Loader2,
} from "lucide-react";
import {
  uploadVehicleImageAction,
  deleteVehicleImageAction,
  setPrimaryImageAction,
} from "./actions";

type VehicleImage = {
  id: string;
  image_url: string;
  sort_order: number | null;
  storagePath: string;
};

type Props = {
  vehicleId: string;
  vehicleName: string;
  initialImages: VehicleImage[];
  primaryImageUrl: string | null;
};

export function VehicleImageManager({
  vehicleId,
  vehicleName,
  initialImages,
  primaryImageUrl,
}: Props) {
  const [images, setImages] = useState<VehicleImage[]>(initialImages);
  const [primary, setPrimary] = useState(primaryImageUrl);
  const [pending, startTransition] = useTransition();
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return;
    setError(null);
    setUploading(true);

    for (const file of Array.from(files)) {
      const fd = new FormData();
      fd.append("image", file);
      const result = await uploadVehicleImageAction(vehicleId, fd);
      if (result.error) {
        setError(result.error);
        setUploading(false);
        return; // don't reload on error — let us see it
      }
    }

    setUploading(false);
    window.location.reload();
  }

  function handleDelete(imageId: string, storagePath: string) {
    startTransition(async () => {
      const result = await deleteVehicleImageAction(
        imageId,
        vehicleId,
        storagePath,
      );
      if (result.error) {
        setError(result.error);
      } else {
        setImages((prev) => prev.filter((img) => img.id !== imageId));
      }
    });
  }

  function handleSetPrimary(imageUrl: string) {
    startTransition(async () => {
      const result = await setPrimaryImageAction(vehicleId, imageUrl);
      if (result.error) {
        setError(result.error);
      } else {
        setPrimary(imageUrl);
      }
    });
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">Vehicle Images</h2>
          <p className="text-sm text-muted-foreground">
            {images.length} image{images.length !== 1 ? "s" : ""} · First image
            is shown on vehicle cards. Star sets the primary card image.
          </p>
        </div>
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition hover:opacity-90 disabled:opacity-50"
        >
          {uploading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <ImagePlus className="h-4 w-4" />
          )}
          {uploading ? "Uploading…" : "Add Images"}
        </button>
      </div>

      {/* Hidden file input — accepts multiple */}
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        multiple
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />

      {/* Drag-and-drop zone */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          handleFiles(e.dataTransfer.files);
        }}
        onClick={() => inputRef.current?.click()}
        className={`flex cursor-pointer flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed p-10 text-center transition ${
          dragOver
            ? "border-primary bg-primary/5"
            : "border-border hover:border-primary/50 hover:bg-muted/30"
        }`}
      >
        <Upload
          className={`h-8 w-8 ${dragOver ? "text-primary" : "text-muted-foreground"}`}
        />
        <div>
          <p className="text-sm font-medium">
            Drop images here or click to browse
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            JPEG, PNG, WebP · Max 10MB per image · Multiple files allowed
          </p>
        </div>
      </div>

      {/* Error */}
      {error ? (
        <p className="border-destructive/30 bg-destructive/10 text-destructive rounded-xl border p-3 text-sm">
          {error}
        </p>
      ) : null}

      {/* Image grid */}
      {images.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-2 rounded-2xl border bg-muted/20 py-16 text-center">
          <ImagePlus className="h-10 w-10 text-muted-foreground/40" />
          <p className="text-sm text-muted-foreground">
            No images yet for {vehicleName}
          </p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {images.map((img) => {
            const isPrimary = img.image_url === primary;
            return (
              <div
                key={img.id}
                className={`group relative overflow-hidden rounded-2xl border bg-muted transition ${
                  isPrimary ? "ring-2 ring-primary ring-offset-2" : ""
                }`}
              >
                {/* Image */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={img.image_url}
                  alt={vehicleName}
                  className="aspect-[16/10] w-full object-cover"
                />

                {/* Primary badge */}
                {isPrimary && (
                  <div className="absolute left-2 top-2 rounded-full bg-primary px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-primary-foreground">
                    Primary
                  </div>
                )}

                {/* Actions — visible on hover */}
                <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/50 opacity-0 transition group-hover:opacity-100">
                  {!isPrimary && (
                    <button
                      type="button"
                      onClick={() => handleSetPrimary(img.image_url)}
                      disabled={pending}
                      title="Set as primary image"
                      className="flex h-9 w-9 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-sm transition hover:bg-primary disabled:opacity-50"
                    >
                      <Star className="h-4 w-4" />
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => handleDelete(img.id, img.storagePath)}
                    disabled={pending}
                    title="Delete image"
                    className="hover:bg-destructive flex h-9 w-9 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-sm transition disabled:opacity-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>

                {/* Sort order */}
                <div className="absolute bottom-2 right-2 rounded-full bg-black/40 px-2 py-0.5 text-[10px] text-white/70 backdrop-blur-sm">
                  #{(img.sort_order ?? 0) + 1}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
