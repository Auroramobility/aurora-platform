import { createClient } from "@/lib/supabase/server";

export const RATE_LIMIT_MESSAGE =
  "You're doing that a bit too fast. Please wait a moment and try again.";

type RateLimitOptions = {
  /** A short, stable identifier for what's being limited, e.g. "send_message". */
  action: string;
  maxHits: number;
  windowSeconds: number;
};

/**
 * Per-user sliding-window rate limit, backed by the check_rate_limit
 * Postgres function (see supabase/migrations/20260812000000_rate_limiting.sql).
 *
 * Fails OPEN (returns true / allowed) if the check itself errors — an
 * infrastructure hiccup in the limiter shouldn't block real users from
 * using the product. The failure is still logged loudly so it doesn't
 * go unnoticed.
 */
export async function checkRateLimit({
  action,
  maxHits,
  windowSeconds,
}: RateLimitOptions): Promise<boolean> {
  const supabase = await createClient();

  const { data: allowed, error } = await supabase.rpc("check_rate_limit", {
    p_action: action,
    p_max_hits: maxHits,
    p_window_seconds: windowSeconds,
  });

  if (error) {
    console.error(`Rate limit check failed for "${action}":`, error.message);
    return true;
  }

  return allowed === true;
}
