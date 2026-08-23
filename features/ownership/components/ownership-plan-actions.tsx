"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { respondToOwnershipPlan } from "@/features/ownership/actions/respond-to-plan";

export function OwnershipPlanActions({ planId }: { planId: string }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function accept() {
    setError(null);

    startTransition(async () => {
      const result = await respondToOwnershipPlan(planId, "accept");

      if (!result.ok) {
        setError(result.error ?? "The ownership plan could not be accepted.");
        return;
      }

      router.refresh();
    });
  }

  return (
    <div className="space-y-3">
      <Button disabled={isPending} onClick={accept} className="w-full">
        <CheckCircle2 className="h-4 w-4" />
        {isPending ? "Accepting…" : "Accept ownership plan"}
      </Button>

      {error ? (
        <p role="alert" className="text-destructive text-sm">
          {error}
        </p>
      ) : null}
    </div>
  );
}
