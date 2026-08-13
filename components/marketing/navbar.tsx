import Link from "next/link";
import { Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/server";
import { MobileNav } from "@/components/marketing/mobile-nav";

const links = [
  { name: "Vehicles", href: "/vehicles" },
  { name: "Compare", href: "/compare" },
  { name: "Ownership", href: "/ownership" },
  { name: "About", href: "/about" },
];

export async function Navbar() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg aurora-gradient shadow-sm shadow-primary/30">
            <Zap className="h-4 w-4 text-background" />
          </div>
          <span className="text-lg font-bold tracking-tight group-hover:aurora-gradient-text transition-all">
            Aurora
          </span>
        </Link>

        {/* Desktop nav */}
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

        {/* Auth actions */}
        <div className="flex items-center gap-3">
          <div className="hidden md:flex md:items-center md:gap-3">
            {user ? (
              <Button
                className="aurora-gradient border-0 text-background font-semibold shadow-sm shadow-primary/20 hover:shadow-primary/40 hover:scale-105 transition-all"
                asChild
              >
                <Link href="/dashboard">Dashboard</Link>
              </Button>
            ) : (
              <>
                <Button variant="ghost" asChild>
                  <Link href="/login">Sign In</Link>
                </Button>
                <Button
                  className="aurora-gradient border-0 text-background font-semibold shadow-sm shadow-primary/20 hover:shadow-primary/40 transition-all"
                  asChild
                >
                  <Link href="/signup">Get Started</Link>
                </Button>
              </>
            )}
          </div>
          <MobileNav links={links} isAuthenticated={!!user} />
        </div>
      </div>
    </header>
  );
}
