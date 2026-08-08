"use client";

import { useRef, useState } from "react";
import { Camera } from "lucide-react";

type Props = {
  currentUrl?: string | null;
  onFileSelect?: (file: File | null) => void;
};

export function AvatarUpload({ currentUrl, onFileSelect }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(currentUrl ?? null);

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0] ?? null;

    if (!file) {
      return;
    }

    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);
    onFileSelect?.(file);
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
          <Camera size={42} className="text-muted-foreground" />
        )}
      </div>

      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className="rounded-lg bg-primary px-5 py-2 text-primary-foreground"
      >
        Upload Photo
      </button>

      <input
        ref={inputRef}
        hidden
        type="file"
        accept="image/*"
        onChange={handleChange}
      />
    </div>
  );
}
