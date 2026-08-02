import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

import type { Database } from "@/types/supabase";
import { env } from "@/lib/env";

/**
 * Supabase client for use in Server Components, Route Handlers, and
 * Server Actions. Reads/writes auth cookies via Next.js' `cookies()` API.
 *
 * NOTE: `set`/`remove` will throw when called from a Server Component
 * (Next.js only allows cookie mutation in Server Actions and Route
 * Handlers). The try/catch below lets this client be safely imported
 * from anywhere without callers needing to know the distinction.
 */
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient<Database>(
    env.NEXT_PUBLIC_SUPABASE_URL,
    env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(
          cookiesToSet: {
            name: string;
            value: string;
            options?: Parameters<typeof cookieStore.set>[2];
          }[],
        ) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options);
            });
          } catch {
            // Called from a Server Component with no request context —
            // safe to ignore as long as middleware refreshes sessions.
          }
        },
      },
    },
  );
}
