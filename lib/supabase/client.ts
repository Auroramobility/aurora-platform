import { createBrowserClient } from "@supabase/ssr";

import type { Database } from "@/types/supabase";
import { env } from "@/lib/env";

/**
 * Supabase client for use in Client Components ("use client").
 * Safe to call multiple times — each call returns a lightweight client
 * bound to the public (anon) API key.
 */
export function createClient() {
  return createBrowserClient<Database>(
    env.NEXT_PUBLIC_SUPABASE_URL,
    env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  );
}
