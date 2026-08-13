import { Bell } from "lucide-react";
import { signOutAction } from "@/app/settings/actions/sign-out";
import { dashboardLinks } from "@/components/dashboard/navigation";
import { MobileSidebar } from "@/components/dashboard/mobile-sidebar";

type Props = {
  title: string;
  email: string;
};

export function Topbar({ title, email }: Props) {
  const initial = (email[0] ?? "A").toUpperCase();

  return (
    <header className="flex items-center justify-between border-b border-border bg-surface/80 backdrop-blur-sm px-4 py-4 sm:px-8">
      <div className="flex items-center gap-3">
        <MobileSidebar links={dashboardLinks} />
        <div>
          <h2 className="text-xl font-bold aurora-gradient-text">{title}</h2>
          <p className="hidden text-xs text-muted-foreground sm:block">{email}</p>
        </div>
      </div>

      <div className="flex items-center gap-4 sm:gap-5">
        <Bell className="h-5 w-5 text-muted-foreground" aria-hidden="true" />

        {/* Avatar */}
        <div className="flex h-9 w-9 items-center justify-center rounded-full aurora-gradient text-sm font-bold text-background shadow-sm shadow-primary/30">
          {initial}
        </div>

        <form action={signOutAction}>
          <button
            type="submit"
            className="text-sm font-medium text-muted-foreground transition hover:text-primary"
          >
            Sign out
          </button>
        </form>
      </div>
    </header>
  );
}
