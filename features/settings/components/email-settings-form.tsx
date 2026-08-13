"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

export function EmailSettingsForm({ currentEmail }: { currentEmail: string }) {
  const [email, setEmail] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setPending(true);
    setError(null);
    setSuccess(false);

    const supabase = createClient();
    // Supabase sends confirmation links to BOTH the old and new address
    // by default and doesn't apply the change until confirmed — no
    // custom confirmation flow needed here.
    const { error: updateError } = await supabase.auth.updateUser({ email });

    setPending(false);

    if (updateError) {
      setError(updateError.message);
      return;
    }

    setSuccess(true);
    setEmail("");
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Email address</CardTitle>
        <CardDescription>
          Currently <span className="font-medium text-foreground">{currentEmail}</span>.
          Changing it sends a confirmation link to your new address — the
          change doesn&apos;t take effect until you click it.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="flex flex-col gap-3 sm:flex-row">
          <Input
            type="email"
            placeholder="new-email@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="sm:flex-1"
          />

          <button
            type="submit"
            disabled={pending || !email}
            className="rounded bg-primary px-6 py-3 text-primary-foreground disabled:opacity-50"
          >
            {pending ? "Sending…" : "Update email"}
          </button>
        </form>

        {error ? (
          <p role="alert" className="mt-3 text-sm text-destructive">
            {error}
          </p>
        ) : null}

        {success ? (
          <p className="mt-3 text-sm text-primary">
            Check your inbox at both your old and new address to confirm the change.
          </p>
        ) : null}
      </CardContent>
    </Card>
  );
}
