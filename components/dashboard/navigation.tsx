import Link from "next/link";

export const dashboardLinks = [
  {
    name: "Dashboard",
    href: "/dashboard",
    tone: "teal",
  },
  {
    name: "Profile",
    href: "/profile",
    tone: "blue",
  },
  {
    name: "Vehicles",
    href: "/vehicles",
    tone: "violet",
  },
  {
    name: "Applications",
    href: "/applications",
    tone: "amber",
  },
  {
    name: "Payments",
    href: "/payments",
    tone: "green",
  },
  {
    name: "Messages",
    href: "/messages",
    tone: "rose",
  },
  {
    name: "Settings",
    href: "/settings",
    tone: "slate",
  },
] as const;

type Tone = (typeof dashboardLinks)[number]["tone"];

const toneStyles: Record<
  Tone,
  {
    base: string;
    hover: string;
    active: string;
    activeText: string;
    dot: string;
  }
> = {
  teal: {
    base: "bg-teal-50/90 border-teal-100",
    hover: "hover:bg-teal-100 hover:border-teal-200",
    active: "bg-teal-100 border-teal-300 shadow-sm",
    activeText: "text-teal-800",
    dot: "bg-teal-500",
  },
  blue: {
    base: "bg-blue-50/90 border-blue-100",
    hover: "hover:bg-blue-100 hover:border-blue-200",
    active: "bg-blue-100 border-blue-300 shadow-sm",
    activeText: "text-blue-800",
    dot: "bg-blue-500",
  },
  violet: {
    base: "bg-violet-50/90 border-violet-100",
    hover: "hover:bg-violet-100 hover:border-violet-200",
    active: "bg-violet-100 border-violet-300 shadow-sm",
    activeText: "text-violet-800",
    dot: "bg-violet-500",
  },
  amber: {
    base: "bg-amber-50/90 border-amber-100",
    hover: "hover:bg-amber-100 hover:border-amber-200",
    active: "bg-amber-100 border-amber-300 shadow-sm",
    activeText: "text-amber-800",
    dot: "bg-amber-500",
  },
  green: {
    base: "bg-emerald-50/90 border-emerald-100",
    hover: "hover:bg-emerald-100 hover:border-emerald-200",
    active: "bg-emerald-100 border-emerald-300 shadow-sm",
    activeText: "text-emerald-800",
    dot: "bg-emerald-500",
  },
  rose: {
    base: "bg-rose-50/90 border-rose-100",
    hover: "hover:bg-rose-100 hover:border-rose-200",
    active: "bg-rose-100 border-rose-300 shadow-sm",
    activeText: "text-rose-800",
    dot: "bg-rose-500",
  },
  slate: {
    base: "bg-slate-50/90 border-slate-200",
    hover: "hover:bg-slate-100 hover:border-slate-300",
    active: "bg-slate-100 border-slate-300 shadow-sm",
    activeText: "text-slate-800",
    dot: "bg-slate-500",
  },
};

export function Navigation() {
  return (
    <nav className="space-y-2">
      {dashboardLinks.map((item) => {
        const tone = toneStyles[item.tone];

        return (
          <Link
            key={item.name}
            href={item.href}
            className={[
              "group flex items-center justify-between rounded-2xl border px-4 py-3.5",
              "text-sm font-semibold text-slate-600",
              "transition-all duration-200",
              tone.base,
              tone.hover,
              "dark:border-white/10 dark:bg-white/[0.035] dark:text-slate-300",
              "dark:hover:border-white/15 dark:hover:bg-white/[0.07]",
            ].join(" ")}
          >
            <span>{item.name}</span>

            <span
              className={[
                "h-2 w-2 rounded-full opacity-40 transition-all",
                "group-hover:scale-110 group-hover:opacity-100",
                tone.dot,
              ].join(" ")}
            />
          </Link>
        );
      })}
    </nav>
  );
}
