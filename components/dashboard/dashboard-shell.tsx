import { Zap } from "lucide-react";

import { Navigation } from "@/components/dashboard/navigation";
import { MobileNavigation } from "@/components/dashboard/mobile-navigation";
import { Topbar } from "@/components/dashboard/topbar";

type Props = {
  title: string;
  email: string;
  backHref?: string;
  backLabel?: string;
  children: React.ReactNode;
};

export function DashboardShell({
  title,
  email,
  backHref,
  backLabel,
  children,
}: Props) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-[270px] md:flex md:flex-col">
        <div className="flex h-full flex-col border-r border-slate-200 bg-slate-50 px-4 py-4 shadow-[4px_0_24px_rgba(15,23,42,0.04)] dark:border-white/10 dark:bg-slate-950/80 dark:shadow-none">
          {/* Brand */}
          <div className="mb-4 rounded-3xl border border-teal-200 bg-gradient-to-br from-teal-50 via-white to-violet-50 p-5 shadow-sm dark:border-white/10 dark:from-teal-950/40 dark:via-slate-900 dark:to-violet-950/30">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-teal-500 via-blue-500 to-violet-500 shadow-md shadow-teal-500/20">
                <Zap className="h-5 w-5 text-white" />
              </div>

              <div>
                <span
                  className="aurora-gradient-text block text-xl font-bold tracking-tight"
                  style={{
                    fontFamily: "'Cormorant Garamond', Georgia, serif",
                  }}
                >
                  Aurora
                </span>

                <p className="mt-0.5 text-[9px] font-bold uppercase tracking-[0.2em] text-teal-700 dark:text-teal-300">
                  Mobility
                </p>
              </div>
            </div>

            <div className="mt-4 h-px bg-gradient-to-r from-teal-200 via-blue-200 to-violet-200 dark:from-teal-500/20 dark:via-blue-500/20 dark:to-violet-500/20" />

            <p className="mt-3 text-[10px] font-medium uppercase tracking-[0.12em] text-slate-500 dark:text-slate-400">
              Your ownership platform
            </p>
          </div>

          {/* Navigation container */}
          <div className="flex-1 overflow-y-auto rounded-3xl border border-slate-200 bg-white/80 p-3 shadow-sm dark:border-white/10 dark:bg-white/[0.025] dark:shadow-none">
            <div className="mb-3 px-2">
              <p className="text-[9px] font-bold uppercase tracking-[0.22em] text-slate-400 dark:text-slate-500">
                My Aurora
              </p>
            </div>

            <Navigation />
          </div>

          {/* Footer */}
          <div className="mt-4 rounded-2xl border border-violet-100 bg-violet-50/80 px-4 py-3 dark:border-violet-500/10 dark:bg-violet-500/[0.05]">
            <p className="text-[9px] font-semibold uppercase tracking-[0.14em] text-violet-600 dark:text-violet-300">
              Aurora Mobility
            </p>

            <p className="mt-1 text-[10px] text-slate-500 dark:text-slate-400">
              Your EV ownership platform
            </p>
          </div>
        </div>
      </aside>

      {/* Mobile navigation */}
      <MobileNavigation />

      {/* Main content */}
      <div className="flex min-h-screen flex-col md:pl-[270px]">
        <Topbar
          title={title}
          email={email}
          backHref={backHref}
          backLabel={backLabel}
        />

        <main className="flex-1 space-y-8 bg-background p-4 sm:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
