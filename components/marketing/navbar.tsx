import Link from "next/link";
import { Button } from "@/components/ui/button";

const links = [
  {
    name: "Vehicles",
    href: "/vehicles",
  },
  {
    name: "Compare",
    href: "/compare",
  },
  {
    name: "Ownership",
    href: "/ownership",
  },
  {
    name: "About",
    href: "/about",
  },
];

export function Navbar() {
  return (
    <header className="border-b bg-background">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="text-xl font-semibold tracking-tight">
          Aurora
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {links.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              {link.name}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <Button variant="ghost" asChild>
            <Link href="/login">Sign In</Link>
          </Button>

          <Button asChild>
            <Link href="/signup">Get Started</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
