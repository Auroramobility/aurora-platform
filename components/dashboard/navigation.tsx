import Link from "next/link";
import {
  LayoutDashboard,
  User,
  Car,
  FileText,
  CreditCard,
  MessageSquare,
  Settings,
} from "lucide-react";

export const dashboardLinks = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "Profile",
    href: "/profile",
    icon: User,
  },
  {
    name: "Vehicles",
    href: "/vehicles",
    icon: Car,
  },
  {
    name: "Applications",
    href: "/applications",
    icon: FileText,
  },
  {
    name: "Payments",
    href: "/payments",
    icon: CreditCard,
  },
  {
    name: "Messages",
    href: "/messages",
    icon: MessageSquare,
  },
  {
    name: "Settings",
    href: "/settings",
    icon: Settings,
  },
];

export function Navigation() {
  return (
    <nav className="space-y-2">
      {dashboardLinks.map((item) => {
        const Icon = item.icon;

        return (
          <Link
            key={item.name}
            href={item.href}
            className="flex items-center gap-3 rounded-xl px-4 py-3 text-muted-foreground transition hover:bg-secondary hover:text-foreground"
          >
            <Icon size={20} />
            <span>{item.name}</span>
          </Link>
        );
      })}
    </nav>
  );
}
