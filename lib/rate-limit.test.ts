import { describe, expect, it, vi, beforeEach } from "vitest";

const mockRpc = vi.fn();

vi.mock("@/lib/supabase/server", () => ({
  createClient: vi.fn(async () => ({
    rpc: mockRpc,
  })),
}));

const { checkRateLimit } = await import("./rate-limit");

describe("checkRateLimit", () => {
  beforeEach(() => {
    mockRpc.mockReset();
  });

  it("returns true and passes the right arguments when under the limit", async () => {
    mockRpc.mockResolvedValue({ data: true, error: null });

    const allowed = await checkRateLimit({
      action: "send_message",
      maxHits: 30,
      windowSeconds: 60,
    });

    expect(allowed).toBe(true);
    expect(mockRpc).toHaveBeenCalledWith("check_rate_limit", {
      p_action: "send_message",
      p_max_hits: 30,
      p_window_seconds: 60,
    });
  });

  it("returns false when the caller is over the limit", async () => {
    mockRpc.mockResolvedValue({ data: false, error: null });

    const allowed = await checkRateLimit({
      action: "send_message",
      maxHits: 30,
      windowSeconds: 60,
    });

    expect(allowed).toBe(false);
  });

  it("fails OPEN (returns true) if the RPC call itself errors", async () => {
    mockRpc.mockResolvedValue({
      data: null,
      error: { message: "connection reset" },
    });

    const allowed = await checkRateLimit({
      action: "send_message",
      maxHits: 30,
      windowSeconds: 60,
    });

    // Deliberate design choice, see lib/rate-limit.ts — an infra hiccup
    // in the limiter itself shouldn't block real users. This test exists
    // so that choice can't be silently reversed by accident later.
    expect(allowed).toBe(true);
  });
});
