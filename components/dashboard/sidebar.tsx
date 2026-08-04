import Link from "next/link";

export function Sidebar() {
  return (
    <aside className="flex h-screen w-64 flex-col border-r bg-white">
      <div className="border-b p-6">
        <h1 className="text-2xl font-bold">Aurora Mobility</h1>
      </div>

      <nav className="flex flex-1 flex-col gap-2 p-4">
        <Link
          href="/dashboard"
          className="rounded-lg px-4 py-3 hover:bg-gray-100"
        >
          Dashboard
        </Link>

        <Link
          href="/profile"
          className="rounded-lg px-4 py-3 hover:bg-gray-100"
        >
          Profile
        </Link>

        <Link
          href="/vehicles"
          className="rounded-lg px-4 py-3 hover:bg-gray-100"
        >
          Vehicles
        </Link>

        <Link
          href="/applications"
          className="rounded-lg px-4 py-3 hover:bg-gray-100"
        >
          Applications
        </Link>

        <Link
          href="/settings"
          className="rounded-lg px-4 py-3 hover:bg-gray-100"
        >
          Settings
        </Link>
      </nav>
    </aside>
  );
}
