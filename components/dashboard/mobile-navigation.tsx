"use client";

import Link from "next/link";
import { useState } from "react";
import {
  ChevronRight,
  Menu,
  X,
  LayoutDashboard,
  User,
  CarFront,
  ClipboardList,
  CreditCard,
  MessageSquare,
  Settings,
  Zap,
} from "lucide-react";

export const mobileDashboardLinks = [
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
    icon: CarFront,
  },
  {
    name: "Applications",
    href: "/applications",
    icon: ClipboardList,
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
] as const;

export function MobileNavigation() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Mobile header */}
      <header className="sticky top-0 z-50 flex items-center justify-between border-b border-slate-200 bg-white/95 px-4 py-3 backdrop-blur dark:border-white/10 dark:bg-slate-950/95 md:hidden">
        <Link
          href="/dashboard"
          className="flex items-center gap-2"
          onClick={() => setOpen(false)}
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-teal-500 via-blue-500 to-violet-500 shadow-sm">
            <Zap className="h-4 w-4 text-white" />
          </div>

          <div>
            <span
              className="aurora-gradient-text block text-lg font-bold leading-none tracking-tight"
              style={{
                fontFamily: "'Cormorant Garamond', Georgia, serif",
              }}
            >
              Aurora
            </span>

            <p className="mt-0.5 text-[8px] font-bold uppercase tracking-[0.18em] text-teal-700 dark:text-teal-300">
              Mobility
            </p>
          </div>
        </Link>

        <button
          type="button"
          onClick={() => setOpen((current) => !current)}
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-slate-700 transition-colors hover:bg-slate-100 dark:border-white/10 dark:bg-white/[0.04] dark:text-slate-200 dark:hover:bg-white/[0.08]"
          aria-label={open ? "Close navigation" : "Open navigation"}
          aria-expanded={open}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </header>

      {/* Mobile navigation panel */}
      {open ? (
        <div className="fixed inset-0 z-40 md:hidden">
          {/* Backdrop */}
          <button
            type="button"
            aria-label="Close navigation"
            onClick={() => setOpen(false)}
            className="absolute inset-0 bg-slate-950/30 backdrop-blur-[2px]"
          />

          {/* Panel */}
          <div className="absolute left-0 right-0 top-[65px] border-b border-slate-200 bg-white p-4 shadow-xl dark:border-white/10 dark:bg-slate-950">
            <div className="mb-4">
              <p className="text-[9px] font-bold uppercase tracking-[0.22em] text-slate-400 dark:text-slate-500">
                My Aurora
              </p>
            </div>

            <nav className="space-y-2">
              {mobileDashboardLinks.map((item) => {
                const Icon = item.icon;

                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-100 dark:border-white/10 dark:bg-white/[0.035] dark:text-slate-200 dark:hover:bg-white/[0.07]"
                  >
                    <span className="flex items-center gap-3">
                      <Icon className="h-4 w-4 text-slate-500 dark:text-slate-400" />
                      {item.name}
                    </span>

                    <ChevronRight className="h-4 w-4 text-slate-400" />
                  </Link>
                );
              })}
            </nav>

            <div className="mt-4 rounded-2xl border border-violet-100 bg-violet-50/80 px-4 py-3 dark:border-violet-500/10 dark:bg-violet-500/[0.05]">
              <p className="text-[9px] font-semibold uppercase tracking-[0.14em] text-violet-600 dark:text-violet-300">
                Aurora Mobility
              </p>

              <p className="mt-1 text-[10px] text-slate-500 dark:text-slate-400">
                Your EV ownership platform
              </p>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
