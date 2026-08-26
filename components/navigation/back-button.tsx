"use client";

import { ArrowLeft } from "lucide-react";

type BackButtonProps = {
  fallback?: string;
  label?: string;
  className?: string;
};

export function BackButton({
  fallback = "/",
  label = "Back",
  className = "",
}: BackButtonProps) {
  function handleBack() {
    if (window.history.length > 1) {
      window.history.back();
      return;
    }

    window.location.href = fallback;
  }

  return (
    <button type="button" onClick={handleBack} className={className}>
      <ArrowLeft size={12} />
      {label}
    </button>
  );
}
