import { Zap } from "lucide-react";
import { Navigation } from "@/components/dashboard/navigation";
import { Topbar } from "@/components/dashboard/topbar";

type Props = {
  title: string;
  email: string;
  children: React.ReactNode;
};

export function DashboardShell({ title, email, children }: Props) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="grid min-h-screen md:grid-cols-[260px_1fr]">

        {/* Sidebar */}
        <aside className="hidden border-r border-border bg-surface md:flex md:flex-col">
          {/* Logo area */}
          <div className="flex items-center gap-3 border-b border-border px-6 py-5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg aurora-gradient shadow-sm shadow-primary/30">
              <Zap className="h-4 w-4 text-background" />
            </div>
            <span className="text-lg font-bold tracking-tight aurora-gradient-text">
              Aurora
            </span>
          </div>

          {/* Nav */}
          <div className="flex-1 overflow-y-auto p-4">
            <Navigation />
          </div>

          {/* Footer stripe */}
          <div className="aurora-divider" />
          <p className="px-6 py-4 text-xs text-muted-foreground">
            Aurora Mobility Platform
          </p>
        </aside>

        <div className="min-w-0">
          <Topbar title={title} email={email} />
          <main className="space-y-8 p-4 sm:p-8">{children}</main>
        </div>
      </div>
    </div>
  );
}
