import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

const actions = [
  {
    eyebrow: "PROFILE",
    title: "Complete Profile",
    description:
      "Keep your personal information up to date so your Aurora ownership journey stays on track.",
    href: "/profile",
    action: "Complete profile",
    classes: {
      card: "border-emerald-500/40 bg-emerald-100/70 hover:border-emerald-500/55 hover:bg-emerald-100 dark:border-emerald-400/25 dark:bg-emerald-950/30 dark:hover:border-emerald-400/40 dark:hover:bg-emerald-950/40",
      glow: "bg-emerald-400/30 group-hover:bg-emerald-400/40",
      eyebrow: "text-emerald-700 dark:text-emerald-400",
      arrow:
        "border-emerald-500/30 bg-emerald-500/10 text-emerald-700 group-hover:bg-emerald-500/20 dark:border-emerald-400/30 dark:bg-emerald-400/10 dark:text-emerald-400 dark:group-hover:bg-emerald-400/20",
      action: "text-emerald-700 dark:text-emerald-400",
    },
  },
  {
    eyebrow: "EXPLORE",
    title: "Browse Vehicles",
    description:
      "Explore premium electric vehicles and find the model that fits your ownership goals.",
    href: "/vehicles",
    action: "Explore vehicles",
    classes: {
      card: "border-violet-500/40 bg-violet-100/70 hover:border-violet-500/55 hover:bg-violet-100 dark:border-violet-400/25 dark:bg-violet-950/30 dark:hover:border-violet-400/40 dark:hover:bg-violet-950/40",
      glow: "bg-violet-400/30 group-hover:bg-violet-400/40",
      eyebrow: "text-violet-700 dark:text-violet-400",
      arrow:
        "border-violet-500/30 bg-violet-500/10 text-violet-700 group-hover:bg-violet-500/20 dark:border-violet-400/30 dark:bg-violet-400/10 dark:text-violet-400 dark:group-hover:bg-violet-400/20",
      action: "text-violet-700 dark:text-violet-400",
    },
  },
  {
    eyebrow: "APPLICATIONS",
    title: "My Applications",
    description:
      "Review your applications and follow the progress of your Aurora ownership process.",
    href: "/applications",
    action: "View applications",
    classes: {
      card: "border-blue-500/40 bg-blue-100/70 hover:border-blue-500/55 hover:bg-blue-100 dark:border-blue-400/25 dark:bg-blue-950/30 dark:hover:border-blue-400/40 dark:hover:bg-blue-950/40",
      glow: "bg-blue-400/30 group-hover:bg-blue-400/40",
      eyebrow: "text-blue-700 dark:text-blue-400",
      arrow:
        "border-blue-500/30 bg-blue-500/10 text-blue-700 group-hover:bg-blue-500/20 dark:border-blue-400/30 dark:bg-blue-400/10 dark:text-blue-400 dark:group-hover:bg-blue-400/20",
      action: "text-blue-700 dark:text-blue-400",
    },
  },
  {
    eyebrow: "ACCOUNT",
    title: "Account Settings",
    description:
      "Manage your account preferences and keep your Aurora experience configured the way you want.",
    href: "/settings",
    action: "Manage account",
    classes: {
      card: "border-amber-500/40 bg-amber-100/70 hover:border-amber-500/55 hover:bg-amber-100 dark:border-amber-400/25 dark:bg-amber-950/30 dark:hover:border-amber-400/40 dark:hover:bg-amber-950/40",
      glow: "bg-amber-400/30 group-hover:bg-amber-400/40",
      eyebrow: "text-amber-700 dark:text-amber-400",
      arrow:
        "border-amber-500/30 bg-amber-500/10 text-amber-700 group-hover:bg-amber-500/20 dark:border-amber-400/30 dark:bg-amber-400/10 dark:text-amber-400 dark:group-hover:bg-amber-400/20",
      action: "text-amber-700 dark:text-amber-400",
    },
  },
];

export function QuickActions() {
  return (
    <section className="aurora-card overflow-hidden rounded-3xl border border-border bg-surface p-6 shadow-sm sm:p-8">
      <div className="mb-7">
        <p className="eyebrow">Quick Actions</p>

        <h2 className="mt-2 text-2xl font-bold tracking-tight">
          Keep moving forward
        </h2>

        <p className="mt-1 max-w-2xl text-sm leading-6 text-muted-foreground">
          Everything you need to continue your Aurora ownership journey.
        </p>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        {actions.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`group relative min-h-[220px] overflow-hidden rounded-2xl border p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${item.classes.card}`}
          >
            <div
              className={`absolute -right-12 -top-12 h-40 w-40 rounded-full blur-3xl transition-all duration-500 group-hover:scale-125 ${item.classes.glow}`}
            />

            <div
              className={`absolute inset-y-5 left-0 w-1 rounded-r-full opacity-80 ${item.classes.glow}`}
            />

            <div className="relative flex h-full flex-col">
              <div className="flex items-start justify-between gap-4">
                <p
                  className={`text-[10px] font-bold uppercase tracking-[0.22em] ${item.classes.eyebrow}`}
                >
                  {item.eyebrow}
                </p>

                <span
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full border transition-all duration-300 group-hover:rotate-45 ${item.classes.arrow}`}
                >
                  <ArrowUpRight className="h-4 w-4" />
                </span>
              </div>

              <div className="mt-auto pt-12">
                <h3 className="text-xl font-bold tracking-tight text-foreground">
                  {item.title}
                </h3>

                <p className="mt-2 max-w-md text-sm leading-6 text-muted-foreground">
                  {item.description}
                </p>

                <p
                  className={`mt-5 text-xs font-bold transition-transform duration-300 group-hover:translate-x-1 ${item.classes.action}`}
                >
                  {item.action} →
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
