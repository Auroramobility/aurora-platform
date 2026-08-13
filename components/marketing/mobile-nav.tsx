"use client";

import * as React from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

type NavLink = { name: string; href: string };

type Props = {
  links: NavLink[];
  isAuthenticated: boolean;
};

export function MobileNav({ links, isAuthenticated }: Props) {
  const [isOpen, setIsOpen] = React.useState(false);

  // Close the mobile menu when the viewport grows back to desktop size.
  React.useEffect(() => {
    const mediaQuery = window.matchMedia("(min-width: 768px)");
    const handleChange = (event: MediaQueryListEvent) => {
      if (event.matches) setIsOpen(false);
    };
    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  return (
    <div className="md:hidden">
      <button
        type="button"
        className="inline-flex h-10 w-10 items-center justify-center rounded-full text-foreground"
        aria-label={isOpen ? "Close menu" : "Open menu"}
        aria-expanded={isOpen}
        aria-controls="mobile-menu"
        onClick={() => setIsOpen((prev) => !prev)}
      >
        {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>

      <div
        id="mobile-menu"
        className={cn(
          "fixed inset-x-0 top-16 grid overflow-hidden border-b border-border bg-background transition-[grid-template-rows] duration-300 ease-out",
          isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
        )}
      >
        <div className="overflow-hidden">
          <ul className="flex flex-col gap-1 px-4 py-4 sm:px-6">
            {links.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="block rounded-md px-2 py-2.5 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                >
                  {link.name}
                </Link>
              </li>
            ))}

            <li className="pt-2">
              {isAuthenticated ? (
                <Button size="sm" className="w-full" asChild>
                  <Link href="/dashboard" onClick={() => setIsOpen(false)}>
                    Dashboard
                  </Link>
                </Button>
              ) : (
                <div className="flex flex-col gap-2">
                  <Button size="sm" variant="ghost" className="w-full" asChild>
                    <Link href="/login" onClick={() => setIsOpen(false)}>
                      Sign In
                    </Link>
                  </Button>
                  <Button size="sm" className="w-full" asChild>
                    <Link href="/signup" onClick={() => setIsOpen(false)}>
                      Get Started
                    </Link>
                  </Button>
                </div>
              )}
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
