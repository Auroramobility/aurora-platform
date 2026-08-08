"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, XCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { respondToOwnershipPlan } from "@/features/ownership/actions/respond-to-plan";

export function OwnershipPlanActions({ planId }: { planId: string }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function respond(decision: "accept" | "decline") {
    setError(null);
    startTransition(async () => {
      const result = await respondToOwnershipPlan(planId, decision);
      if (!result.ok) {
setError(result.error ?? "The ownership plan could not be updated.");
        return;
      }
      router.refresh();
    });
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-col gap-3 sm:flex-row">
        <Button disabled={isPending} onClick={() => respond("accept")} className="flex-1">
          <CheckCircle2 className="h-4 w-4" />
          {isPending ? "Updating…" : "Accept ownership plan"}
        </Button>
        <Button disabled={isPending} onClick={() => respond("decline")} variant="outline" className="flex-1">
          <XCircle className="h-4 w-4" />
          Decline for now
        </Button>
      </div>
      {error ? <p role="alert" className="text-sm text-destructive">{error}</p> : null}
    </div>
  );
}
