"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X, ArrowRight, Zap } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme/theme-toggle";

type MobileNavLink = {
  name: string;
  href: string;
};

type MobileNavProps = {
  links: MobileNavLink[];
  isAuthenticated: boolean;
};

export function MobileNav({ links, isAuthenticated }: MobileNavProps) {
  const [open, setOpen] = useState(false);

  function closeMenu() {
    setOpen(false);
  }

  return (
    <div className="md:hidden">
      <Button
        variant="ghost"
        size="icon"
        aria-label={open ? "Close navigation" : "Open navigation"}
        aria-expanded={open}
        onClick={() => setOpen((current) => !current)}
      >
        {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </Button>

      {open ? (
        <div className="fixed inset-x-0 top-16 z-50 border-b border-border bg-background/95 shadow-lg backdrop-blur-xl">
          <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
            <nav className="flex flex-col gap-2" aria-label="Mobile navigation">
              {links.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={closeMenu}
                  className="rounded-xl px-4 py-3 text-base font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                >
                  {link.name}
                </Link>
              ))}
            </nav>

            <div className="mt-5 flex items-center justify-between border-t border-border pt-5">
              <ThemeToggle />

              {isAuthenticated ? (
                <Button
                  className="aurora-gradient border-0 font-semibold text-background"
                  asChild
                >
                  <Link href="/dashboard" onClick={closeMenu}>
                    Dashboard
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              ) : (
                <div className="flex items-center gap-2">
                  <Button variant="ghost" asChild>
                    <Link href="/login" onClick={closeMenu}>
                      Sign In
                    </Link>
                  </Button>

                  <Button
                    className="aurora-gradient border-0 font-semibold text-background"
                    asChild
                  >
                    <Link href="/vehicles" onClick={closeMenu}>
                      Explore Vehicles
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              )}
            </div>

            <div className="mt-6 flex items-center gap-2 text-xs text-muted-foreground">
              <div className="aurora-gradient flex h-6 w-6 items-center justify-center rounded-md">
                <Zap className="h-3 w-3 text-background" />
              </div>

              <span>Aurora Mobility</span>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
