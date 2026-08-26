"use client";

import { useActionState } from "react";

import { Button } from "@/components/ui/button";

import {
  deleteIdentity,
  type DeleteIdentityState,
} from "@/features/admin/actions/delete-identity";

const emptyDeleteIdentity: DeleteIdentityState = {};

export function DeleteIdentityButton({
  userId,
  customerName,
}: {
  userId: string;
  customerName: string;
}) {
  const [state, action, pending] = useActionState(
    deleteIdentity,
    emptyDeleteIdentity,
  );

  return (
    <form
      action={action}
      onSubmit={(event) => {
        const confirmed = window.confirm(
          `Delete the identity information for ${customerName}? This will permanently remove the uploaded driver's license documents and identity verification data. The customer account, profile, applications, ownership, payments, and messages will remain.`,
        );

        if (!confirmed) {
          event.preventDefault();
        }
      }}
    >
      <input type="hidden" name="user_id" value={userId} />

      <Button
        type="submit"
        size="sm"
        variant="outline"
        disabled={pending}
        className="border-red-300 text-red-700 hover:bg-red-50 hover:text-red-800 dark:border-red-900 dark:text-red-400 dark:hover:bg-red-950/40 dark:hover:text-red-300"
      >
        {pending ? "Deleting…" : "Delete Identity"}
      </Button>

      {state.error ? (
        <p className="mt-2 text-xs text-red-600 dark:text-red-400">
          {state.error}
        </p>
      ) : null}

      {state.success ? (
        <p className="mt-2 text-xs text-green-600 dark:text-green-400">
          {state.success}
        </p>
      ) : null}
    </form>
  );
}
