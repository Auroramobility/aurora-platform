"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import {
  deleteApplication,
  type DeleteApplicationState,
} from "@/features/admin/actions/delete-application";

const emptyDeleteApplication: DeleteApplicationState = {};

export function DeleteApplicationButton({
  applicationId,
  customerName,
}: {
  applicationId: string;
  customerName: string;
}) {
  const [state, action, pending] = useActionState(
    deleteApplication,
    emptyDeleteApplication,
  );

  return (
    <form
      action={action}
      onSubmit={(event) => {
        const confirmed = window.confirm(
          `Delete the application for ${customerName}? This will permanently remove the application and its associated ownership and financing records. The customer account, profile, identity information, and messages will remain.`,
        );

        if (!confirmed) {
          event.preventDefault();
        }
      }}
    >
      <input type="hidden" name="application_id" value={applicationId} />

      <Button
        type="submit"
        size="sm"
        variant="outline"
        disabled={pending}
        className="border-red-300 text-red-700 hover:bg-red-50 hover:text-red-800 dark:border-red-900 dark:text-red-400 dark:hover:bg-red-950/40 dark:hover:text-red-300"
      >
        {pending ? "Deleting…" : "Delete"}
      </Button>

      {state.error ? (
        <p className="mt-2 text-xs text-red-600 dark:text-red-400">
          {state.error}
        </p>
      ) : null}
    </form>
  );
}
