import Link from "next/link";
import { ArrowRight, Zap } from "lucide-react";

import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/server";
import { MobileNav } from "@/components/marketing/mobile-nav";
import { ThemeToggle } from "@/components/theme/theme-toggle";

const links = [
  {
    name: "Vehicles",
    href: "/vehicles",
    color:
      "text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300",
    accent: "bg-blue-500",
  },
  {
    name: "Compare",
    href: "/compare",
    color:
      "text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300",
    accent: "bg-emerald-500",
  },
  {
    name: "Ownership",
    href: "/ownership",
    color:
      "text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300",
    accent: "bg-purple-500",
  },
  {
    name: "About",
    href: "/about",
    color:
      "text-amber-600 dark:text-amber-400 hover:text-amber-700 dark:hover:text-amber-300",
    accent: "bg-amber-500",
  },
];

export async function Navbar() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/85 backdrop-blur-xl">
      <div className="mx-auto flex h-[4.5rem] max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link
          href="/"
          className="group flex items-center gap-2.5"
          aria-label="Aurora Mobility home"
        >
          <div className="aurora-gradient flex h-9 w-9 items-center justify-center rounded-xl shadow-sm shadow-primary/30 transition-all duration-200 group-hover:scale-105 group-hover:shadow-primary/40">
            <Zap className="h-4 w-4 text-background" />
          </div>

          <div className="flex flex-col">
            <span className="group-hover:aurora-gradient-text text-lg font-bold leading-none tracking-tight transition-all">
              Aurora
            </span>

            <span className="mt-1 hidden text-[8px] font-semibold uppercase tracking-[0.22em] text-muted-foreground sm:block">
              Mobility
            </span>
          </div>
        </Link>

        {/* Desktop navigation */}
        <nav
          className="hidden items-center gap-8 md:flex"
          aria-label="Main navigation"
        >
          {links.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className={`group relative py-2 text-sm font-semibold transition-colors ${link.color}`}
            >
              {link.name}

              <span
                className={`absolute inset-x-0 -bottom-0.5 h-0.5 origin-center scale-x-0 rounded-full transition-transform duration-200 group-hover:scale-x-100 ${link.accent}`}
              />
            </Link>
          ))}
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-3">
          <div className="hidden items-center gap-3 md:flex">
            <ThemeToggle />

            {user ? (
              <Button
                className="aurora-gradient border-0 font-semibold text-background shadow-sm shadow-primary/20 transition-all hover:scale-[1.02] hover:shadow-primary/40"
                asChild
              >
                <Link href="/dashboard">
                  Dashboard
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            ) : (
              <>
                <Button variant="ghost" className="font-medium" asChild>
                  <Link href="/login">Sign In</Link>
                </Button>

                <Button
                  className="aurora-gradient border-0 font-semibold text-background shadow-sm shadow-primary/20 transition-all hover:scale-[1.02] hover:shadow-primary/40"
                  asChild
                >
                  <Link href="/vehicles">
                    Explore Vehicles
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
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
