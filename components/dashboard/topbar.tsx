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
    <header className="flex items-center justify-between border-b border-border bg-surface px-4 py-6 sm:px-8">
      <div className="flex items-center gap-3">
        <MobileSidebar links={dashboardLinks} />

        <div>
          <h2 className="text-2xl font-bold">{title}</h2>
          <p className="hidden text-muted-foreground sm:block">
            Welcome back, {email}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-4 sm:gap-6">
        <Bell className="h-5 w-5 text-muted-foreground" aria-hidden="true" />

        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary font-semibold text-primary-foreground">
          {initial}
        </div>

        <form action={signOutAction}>
          <button
            type="submit"
            className="text-sm font-medium text-muted-foreground transition hover:text-foreground"
          >
            Sign out
          </button>
        </form>
      </div>
    </header>
  );
}
