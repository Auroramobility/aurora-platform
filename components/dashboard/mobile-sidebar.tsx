"use client";

import * as React from "react";
import Link from "next/link";
import { Menu, X, Zap } from "lucide-react";

const links = [
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

const toneStyles = {
  teal: "bg-teal-50 border-teal-100 hover:bg-teal-100 hover:border-teal-200 dark:bg-teal-500/[0.06] dark:border-teal-500/10 dark:hover:bg-teal-500/[0.12]",
  blue: "bg-blue-50 border-blue-100 hover:bg-blue-100 hover:border-blue-200 dark:bg-blue-500/[0.06] dark:border-blue-500/10 dark:hover:bg-blue-500/[0.12]",
  violet:
    "bg-violet-50 border-violet-100 hover:bg-violet-100 hover:border-violet-200 dark:bg-violet-500/[0.06] dark:border-violet-500/10 dark:hover:bg-violet-500/[0.12]",
  amber:
    "bg-amber-50 border-amber-100 hover:bg-amber-100 hover:border-amber-200 dark:bg-amber-500/[0.06] dark:border-amber-500/10 dark:hover:bg-amber-500/[0.12]",
  green:
    "bg-emerald-50 border-emerald-100 hover:bg-emerald-100 hover:border-emerald-200 dark:bg-emerald-500/[0.06] dark:border-emerald-500/10 dark:hover:bg-emerald-500/[0.12]",
  rose: "bg-rose-50 border-rose-100 hover:bg-rose-100 hover:border-rose-200 dark:bg-rose-500/[0.06] dark:border-rose-500/10 dark:hover:bg-rose-500/[0.12]",
  slate:
    "bg-slate-50 border-slate-200 hover:bg-slate-100 hover:border-slate-300 dark:bg-white/[0.035] dark:border-white/10 dark:hover:bg-white/[0.07]",
};

export function MobileSidebar() {
  const [isOpen, setIsOpen] = React.useState(false);

  React.useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");

    const handler = (event: MediaQueryListEvent) => {
      if (event.matches) setIsOpen(false);
    };

    mq.addEventListener("change", handler);

    return () => mq.removeEventListener("change", handler);
  }, []);

  React.useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <div className="md:hidden">
      {/* Menu button */}
      <button
        type="button"
        aria-label={isOpen ? "Close menu" : "Open menu"}
        aria-expanded={isOpen}
        onClick={() => setIsOpen((value) => !value)}
        className="bg-card flex h-10 w-10 items-center justify-center rounded-xl border border-border text-foreground shadow-sm transition hover:bg-muted"
      >
        {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>

      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-950/60 backdrop-blur-sm"
          aria-hidden="true"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Drawer */}
      <div
        className="fixed inset-y-0 left-0 z-50 flex w-[280px] flex-col border-r border-slate-200 bg-slate-50 shadow-2xl transition-transform duration-300 ease-out dark:border-white/10 dark:bg-slate-950"
        style={{
          transform: isOpen ? "translateX(0)" : "translateX(-100%)",
        }}
        aria-hidden={!isOpen}
      >
        {/* Brand */}
        <div className="shrink-0 border-b border-slate-200 p-5 dark:border-white/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-teal-500 via-blue-500 to-violet-500 shadow-md shadow-teal-500/20">
                <Zap className="h-5 w-5 text-white" />
              </div>

              <div>
                <span
                  className="aurora-gradient-text block text-xl font-bold tracking-tight"
                  style={{
                    fontFamily: "'Cormorant Garamond', Georgia, serif",
                  }}
                >
                  Aurora
                </span>

                <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-teal-700 dark:text-teal-300">
                  Mobility
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition hover:bg-muted hover:text-foreground"
              aria-label="Close menu"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="mt-4 h-px bg-gradient-to-r from-teal-200 via-blue-200 to-violet-200 dark:from-teal-500/20 dark:via-blue-500/20 dark:to-violet-500/20" />
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-4">
          <p className="mb-3 px-2 text-[9px] font-bold uppercase tracking-[0.22em] text-slate-400 dark:text-slate-500">
            My Aurora
          </p>

          <div className="space-y-2">
            {links.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={`flex items-center justify-between rounded-2xl border px-4 py-3.5 text-sm font-semibold text-slate-600 transition-all dark:text-slate-300 ${toneStyles[item.tone]}`}
              >
                <span>{item.name}</span>

                <span className="h-2 w-2 rounded-full bg-current opacity-30" />
              </Link>
            ))}
          </div>
        </nav>

        {/* Footer */}
        <div className="shrink-0 border-t border-slate-200 p-4 dark:border-white/10">
          <div className="rounded-2xl border border-violet-100 bg-violet-50 px-4 py-3 dark:border-violet-500/10 dark:bg-violet-500/[0.05]">
            <p className="text-[9px] font-semibold uppercase tracking-[0.14em] text-violet-600 dark:text-violet-300">
              Aurora Mobility
            </p>

            <p className="mt-1 text-[10px] text-slate-500 dark:text-slate-400">
              Your EV ownership platform
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
