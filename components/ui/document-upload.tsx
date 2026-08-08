"use client";

import { Upload } from "lucide-react";

type Props = {
  label: string;
  name: string;
  accept?: string;
};

export function DocumentUpload({ label, name, accept }: Props) {
  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium">{label}</label>

      <label className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-border bg-surface px-6 py-10 transition hover:border-primary hover:bg-secondary">
        <Upload className="mb-4 text-primary" size={32} />

        <p className="font-medium">{label}</p>

        <p className="mt-1 text-sm text-muted-foreground">
          {accept ?? "PNG, JPG or PDF"}
        </p>

        <input hidden type="file" name={name} accept={accept} />
      </label>
    </div>
  );
}
