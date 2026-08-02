"use client";

/**
 * EXAMPLE — not imported anywhere yet.
 *
 * Aurora Mobility does not implement authentication yet. When that
 * work begins, rename this file (drop `.example`) to wire a live
 * Supabase auth session into client components.
 */
import * as React from "react";
import type { Session } from "@supabase/supabase-js";

import { createClient } from "@/lib/supabase/client";

export function useSupabaseSession() {
  const [session, setSession] = React.useState<Session | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    const supabase = createClient();

    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setIsLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
    });

    return () => subscription.unsubscribe();
  }, []);

  return { session, isLoading };
}
