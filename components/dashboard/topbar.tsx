import { Bell } from "lucide-react";

type Props = {
  email: string;
};

export function Topbar({ email }: Props) {
  return (
    <header className="flex items-center justify-between border-b border-border bg-surface px-8 py-6">
      <div>
        <h2 className="text-2xl font-bold">Dashboard</h2>

        <p className="text-muted-foreground">Welcome back, {email}</p>
      </div>

      <div className="flex items-center gap-6">
        <Bell className="cursor-pointer" />

        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary font-semibold text-primary-foreground">
          A
        </div>
      </div>
    </header>
  );
}
