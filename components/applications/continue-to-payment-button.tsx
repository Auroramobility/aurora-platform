"use client";

import { useTransition } from "react";
import { ArrowRight, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { continueToPayment } from "@/features/applications/actions/continue-to-payment";

type Props = {
  applicationId: string;
};

export function ContinueToPaymentButton({ applicationId }: Props) {
  const [isPending, startTransition] = useTransition();

  function handleContinue() {
    startTransition(async () => {
      const result = await continueToPayment(applicationId);

      if (!result.ok) {
        window.alert(result.error ?? "Unable to continue.");
      }
    });
  }

  return (
    <Button
      type="button"
      className="mt-6 w-full sm:w-auto"
      onClick={handleContinue}
      disabled={isPending}
    >
      {isPending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Opening conversation...
        </>
      ) : (
        <>
          Message Aurora
          <ArrowRight className="ml-2 h-4 w-4" />
        </>
      )}
    </Button>
  );
}
