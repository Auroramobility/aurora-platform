import { Navigation } from "./navigation";

export function Sidebar() {
  return (
    <aside className="hidden w-72 border-r border-border bg-surface lg:flex lg:flex-col">
      <div className="border-b border-border p-8">
        <h1 className="text-2xl font-bold">Aurora Mobility</h1>

        <p className="mt-2 text-sm text-muted-foreground">Customer Portal</p>
      </div>

      <div className="flex-1 p-6">
        <Navigation />
      </div>
    </aside>
  );
}
