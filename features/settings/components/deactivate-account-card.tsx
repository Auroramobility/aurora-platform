"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { deactivateAccountAction } from "@/app/settings/actions/deactivate-account";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export function DeactivateAccountCard() {
  const router = useRouter();
  const [confirming, setConfirming] = useState(false);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleDeactivate() {
    setPending(true);
    setError(null);

    try {
      const result = await deactivateAccountAction();

      if (result.error) {
        setError(result.error);
        setPending(false);
        return;
      }

      router.push("/login");
    } catch {
      setError("Something went wrong. Please try again or contact support.");
      setPending(false);
    }
  }

  return (
    <Card className="border-destructive/30">
      <CardHeader>
        <CardTitle className="text-destructive">Deactivate account</CardTitle>
        <CardDescription>
          This signs you out immediately and blocks future sign-in. Your data
          isn&apos;t deleted — contact support to reactivate or to request
          permanent deletion.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {error ? (
          <p role="alert" className="text-sm text-destructive">
            {error}
          </p>
        ) : null}

        {confirming ? (
          <div className="flex flex-wrap items-center gap-3">
            <p className="text-sm font-medium">Are you sure?</p>

            <button
              type="button"
              onClick={handleDeactivate}
              disabled={pending}
              className="rounded bg-destructive px-4 py-2 text-sm font-medium text-destructive-foreground disabled:opacity-50"
            >
              {pending ? "Deactivating…" : "Yes, deactivate my account"}
            </button>

            <button
              type="button"
              onClick={() => setConfirming(false)}
              disabled={pending}
              className="rounded border px-4 py-2 text-sm font-medium hover:bg-muted disabled:opacity-50"
            >
              Cancel
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setConfirming(true)}
            className="rounded border border-destructive/40 px-4 py-2 text-sm font-medium text-destructive hover:bg-destructive/10"
          >
            Deactivate account
          </button>
        )}
      </CardContent>
    </Card>
  );
}
