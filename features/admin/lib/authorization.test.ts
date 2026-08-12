import { describe, expect, it, vi, beforeEach } from "vitest";

const mockGetUser = vi.fn();
const mockRpc = vi.fn();

vi.mock("@/lib/supabase/server", () => ({
  createClient: vi.fn(async () => ({
    auth: { getUser: mockGetUser },
    rpc: mockRpc,
  })),
}));

// Imported after the mock so it picks up the mocked module.
const { requireAdmin } = await import("./authorization");

describe("requireAdmin", () => {
  beforeEach(() => {
    mockGetUser.mockReset();
    mockRpc.mockReset();
  });

  it("returns isAdmin: false and no user when there is no session", async () => {
    mockGetUser.mockResolvedValue({ data: { user: null } });

    const result = await requireAdmin();

    expect(result.user).toBeNull();
    expect(result.isAdmin).toBe(false);
    // No session means no RPC call should even be attempted.
    expect(mockRpc).not.toHaveBeenCalled();
  });

  it("returns isAdmin: true when signed in and is_admin() returns true", async () => {
    mockGetUser.mockResolvedValue({ data: { user: { id: "user-1" } } });
    mockRpc.mockResolvedValue({ data: true, error: null });

    const result = await requireAdmin();

    expect(result.user).toEqual({ id: "user-1" });
    expect(result.isAdmin).toBe(true);
    expect(mockRpc).toHaveBeenCalledWith("is_admin");
  });

  it("returns isAdmin: false when signed in but is_admin() returns false", async () => {
    mockGetUser.mockResolvedValue({ data: { user: { id: "user-1" } } });
    mockRpc.mockResolvedValue({ data: false, error: null });

    const result = await requireAdmin();

    expect(result.isAdmin).toBe(false);
  });

  it("fails CLOSED (isAdmin: false) if the is_admin() RPC errors — must not fail open", async () => {
    mockGetUser.mockResolvedValue({ data: { user: { id: "user-1" } } });
    mockRpc.mockResolvedValue({
      data: null,
      error: { message: "connection reset", code: "08006" },
    });

    const result = await requireAdmin();

    // This is the security-critical assertion: an infrastructure error
    // while checking admin status must never be treated as "is admin".
    expect(result.isAdmin).toBe(false);
  });
});
