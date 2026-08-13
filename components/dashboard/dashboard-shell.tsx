import { Navigation } from "@/components/dashboard/navigation";
import { Topbar } from "@/components/dashboard/topbar";

type Props = {
  title: string;
  email: string;
  children: React.ReactNode;
};

/**
 * Shared shell for every authenticated customer page (dashboard,
 * profile, applications, payments, messages, settings, ownership
 * detail). Previously only app/dashboard/page.tsx had this sidebar —
 * every other authenticated page was a bare <main> with no persistent
 * navigation and no way to sign out.
 *
 * Responsive: the sidebar is desktop-only (md:block); on small screens
 * Topbar renders a MobileSidebar drawer with the same links instead.
 */
export function DashboardShell({ title, email, children }: Props) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="grid min-h-screen md:grid-cols-[260px_1fr]">
        <aside className="hidden border-r border-border bg-surface p-6 md:block">
          <h1 className="mb-10 text-2xl font-bold">Aurora Mobility</h1>
          <Navigation />
        </aside>

        <div className="min-w-0">
          <Topbar title={title} email={email} />
          <main className="space-y-8 p-4 sm:p-8">{children}</main>
        </div>
      </div>
    </div>
  );
}
