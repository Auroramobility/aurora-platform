"use client";

import { useEffect } from "react";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Errors here have already been through Next.js's own reporting;
    // this is where an error-tracking service (Sentry, etc.) would be
    // wired in. Digest is safe to log — it doesn't contain error detail,
    // just an id you can cross-reference against server logs.
    console.error("Unhandled route error:", error.digest ?? error.message);
  }, [error]);

  return (
    <main className="mx-auto flex min-h-[60vh] max-w-lg flex-col items-center justify-center p-8 text-center">
      <AlertTriangle className="h-10 w-10 text-destructive" />

      <h1 className="mt-4 text-2xl font-semibold">Something went wrong</h1>

      <p className="mt-2 text-sm text-muted-foreground">
        Aurora hit an unexpected error loading this page. Your data is safe —
        try again, or head back to your dashboard.
      </p>

      <div className="mt-6 flex gap-3">
        <Button onClick={reset}>Try again</Button>
        <Button asChild variant="outline">
          <a href="/dashboard">Go to dashboard</a>
        </Button>
      </div>
    </main>
  );
}
