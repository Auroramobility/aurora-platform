"use client";

import { useRef, useState, useTransition } from "react";
import { Camera } from "lucide-react";
import { uploadAvatarAction } from "@/app/profile/actions/upload-avatar-action";

type Props = {
  currentUrl?: string | null;
};

export function AvatarUpload({ currentUrl }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(
    currentUrl ?? null,
  );
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function handleChange(
    event: React.ChangeEvent<HTMLInputElement>,
  ) {
    const file = event.target.files?.[0];

    if (!file) return;

    setError(null);

    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);

    startTransition(async () => {
      try {
        await uploadAvatarAction(file);
      } catch (error) {
        console.error("Avatar upload failed:", error);
        setError(
          error instanceof Error && error.message
            ? error.message
            : "Unable to upload profile photo.",
        );
        setPreview(currentUrl ?? null);
      }
    });
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex h-36 w-36 items-center justify-center overflow-hidden rounded-full border-2 border-dashed border-border bg-surface">
        {preview ? (
          <img
            src={preview}
            alt="Profile preview"
            className="h-full w-full object-cover"
          />
        ) : (
          <Camera
            size={42}
            className="text-muted-foreground"
          />
        )}
      </div>

      <button
        type="button"
        disabled={isPending}
        onClick={() => inputRef.current?.click()}
        className="rounded-lg bg-primary px-5 py-2 text-primary-foreground disabled:opacity-50"
      >
        {isPending ? "Uploading..." : "Upload Photo"}
      </button>

      <input
        ref={inputRef}
        hidden
        type="file"
        accept="image/*"
        onChange={handleChange}
        disabled={isPending}
      />

      {error && (
        <p className="text-sm text-destructive">
          {error}
        </p>
      )}
    </div>
  );
}