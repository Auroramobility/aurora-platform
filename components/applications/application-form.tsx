"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { createApplication, type CreateApplicationState } from "@/features/applications/actions/create-application";

const initialState: CreateApplicationState = {};

type Props = { vehicleId: string };

export function ApplicationForm({ vehicleId }: Props) {
  const [state, formAction, pending] = useActionState(createApplication, initialState);

  return (
    <form action={formAction} className="space-y-4 rounded-3xl border bg-card p-6 shadow-sm">
      <input type="hidden" name="vehicle_id" value={vehicleId} />
      <div>
        <h2 className="text-xl font-semibold">Start your ownership application</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Submit the vehicle you want to pursue. Aurora will review your application before an ownership plan is created.
        </p>
      </div>

      {state.error ? (
        <p role="alert" className="rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-300">
          {state.error}
        </p>
      ) : null}

      <Button type="submit" className="w-full" size="lg" disabled={pending}>
        {pending ? "Submitting…" : "Submit application"}
      </Button>
    </form>
  );
}
