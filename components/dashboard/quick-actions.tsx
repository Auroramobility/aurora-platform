import Link from "next/link";

export function QuickActions() {
  return (
    <div className="rounded-xl border bg-white p-6 shadow-sm">
      <h2 className="text-xl font-semibold">Quick Actions</h2>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <Link
          href="/profile"
          className="rounded-lg border p-4 hover:bg-gray-50"
        >
          👤 Complete Profile
        </Link>

        <Link
          href="/vehicles"
          className="rounded-lg border p-4 hover:bg-gray-50"
        >
          🚗 Browse Vehicles
        </Link>

        <Link
          href="/applications"
          className="rounded-lg border p-4 hover:bg-gray-50"
        >
          📄 My Applications
        </Link>

        <Link
          href="/settings"
          className="rounded-lg border p-4 hover:bg-gray-50"
        >
          ⚙️ Account Settings
        </Link>
      </div>
    </div>
  );
}
