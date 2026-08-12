"use client";

import { useState, useTransition } from "react";
import { Upload, CheckCircle2 } from "lucide-react";
import { uploadLicenseFrontAction } from "@/app/profile/actions/upload-license-front";
import { uploadLicenseBackAction } from "@/app/profile/actions/upload-license-back";

type Props = {
  label: string;
  name: "drivers_license_front" | "drivers_license_back";
  accept?: string;
  currentPath?: string | null;
};

export function DocumentUpload({
  label,
  name,
  accept,
  currentPath,
}: Props) {
  const [fileName, setFileName] = useState<string | null>(
    currentPath ? "Document uploaded" : null,
  );

  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleChange(
    event: React.ChangeEvent<HTMLInputElement>,
  ) {
    const file = event.target.files?.[0];

    if (!file) return;

    setError(null);
    setFileName(file.name);

    startTransition(async () => {
      try {
        if (name === "drivers_license_front") {
          await uploadLicenseFrontAction(file);
        } else {
          await uploadLicenseBackAction(file);
        }

        setFileName(file.name);
      } catch (error) {
        console.error(`${label} upload failed:`, error);

        setError(
          `Unable to upload ${label.toLowerCase()}.`,
        );

        setFileName(currentPath ? "Document uploaded" : null);
      }
    });
  }

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium">
        {label}
      </label>

      <label
        className={`flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-border bg-surface px-6 py-10 transition hover:border-primary hover:bg-secondary ${
          isPending
            ? "pointer-events-none opacity-60"
            : ""
        }`}
      >
        {fileName && !isPending ? (
          <CheckCircle2
            className="mb-4 text-primary"
            size={32}
          />
        ) : (
          <Upload
            className="mb-4 text-primary"
            size={32}
          />
        )}

        <p className="font-medium">
          {isPending
            ? "Uploading..."
            : fileName ?? label}
        </p>

        {fileName && !isPending ? (
          <p className="mt-1 max-w-full truncate px-4 text-sm text-muted-foreground">
            {fileName}
          </p>
        ) : (
          <p className="mt-1 text-sm text-muted-foreground">
            {accept ?? "PNG, JPG or PDF"}
          </p>
        )}

        <input
          hidden
          type="file"
          accept={accept}
          onChange={handleChange}
          disabled={isPending}
        />
      </label>

      {error && (
        <p className="text-sm text-destructive">
          {error}
        </p>
      )}
    </div>
  );
}