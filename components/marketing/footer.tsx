import Link from "next/link";

export function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-border/60 bg-background">
      {/* Aurora color atmosphere */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute -left-32 top-0 h-96 w-96 rounded-full bg-emerald-500/[0.07] blur-3xl dark:bg-emerald-500/[0.10]" />
        <div className="absolute -top-24 left-[35%] h-80 w-80 rounded-full bg-blue-500/[0.05] blur-3xl dark:bg-blue-500/[0.08]" />
        <div className="absolute -right-32 bottom-0 h-96 w-96 rounded-full bg-violet-500/[0.07] blur-3xl dark:bg-violet-500/[0.10]" />
      </div>

      <div className="relative mx-auto max-w-7xl px-6 py-16 sm:px-8 md:py-20">
        <div className="grid gap-10 md:grid-cols-12">
          {/* Brand */}
          <div className="md:col-span-6">
            <div className="rounded-[2rem] border border-emerald-200/70 bg-emerald-50/80 p-7 shadow-sm dark:border-emerald-400/20 dark:bg-emerald-500/[0.07] md:p-8">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-600 text-sm font-bold text-white shadow-lg shadow-emerald-500/20 dark:bg-emerald-500">
                  A
                </div>

                <div>
                  <h2 className="text-2xl font-bold tracking-tight">
                    Aurora Mobility
                  </h2>

                  <p className="mt-0.5 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-700 dark:text-emerald-400">
                    Premium EV ownership
                  </p>
                </div>
              </div>

              <p className="mt-6 max-w-lg text-sm leading-7 text-muted-foreground md:text-base">
                Aurora is building a more accessible way to own premium electric
                vehicles. We connect people with carefully selected EVs,
                transparent pricing, and a clear path toward ownership.
              </p>

              <p className="mt-4 max-w-lg text-sm leading-7 text-muted-foreground">
                Eligible vehicles may be offered at approximately 20% to 30%
                below comparable market pricing, giving more people the
                opportunity to explore ownership on terms they can understand.
              </p>

              <div className="mt-7 flex flex-wrap gap-2">
                <span className="rounded-full border border-emerald-200 bg-white/70 px-3 py-1.5 text-xs font-semibold text-emerald-700 dark:border-emerald-400/20 dark:bg-emerald-500/10 dark:text-emerald-400">
                  Better Access
                </span>

                <span className="rounded-full border border-blue-200 bg-blue-50/70 px-3 py-1.5 text-xs font-semibold text-blue-700 dark:border-blue-400/20 dark:bg-blue-500/10 dark:text-blue-400">
                  Transparent Plans
                </span>

                <span className="rounded-full border border-violet-200 bg-violet-50/70 px-3 py-1.5 text-xs font-semibold text-violet-700 dark:border-violet-400/20 dark:bg-violet-500/10 dark:text-violet-400">
                  Ownership Focused
                </span>
              </div>
            </div>
          </div>

          {/* Explore */}
          <div className="md:col-span-3">
            <div className="rounded-[1.75rem] border border-blue-200/70 bg-blue-50/70 p-6 dark:border-blue-400/20 dark:bg-blue-500/[0.07]">
              <div className="mb-5 flex items-center gap-3">
                <div className="h-2 w-2 rounded-full bg-blue-500" />

                <h3 className="font-semibold">Explore</h3>
              </div>

              <ul className="space-y-2">
                <li>
                  <Link
                    href="/vehicles"
                    className="group flex items-center justify-between rounded-xl px-3 py-2.5 text-sm text-muted-foreground transition-all hover:bg-blue-100/80 hover:text-blue-700 dark:hover:bg-blue-500/10 dark:hover:text-blue-400"
                  >
                    <span>Vehicles</span>
                    <span className="text-blue-500 opacity-0 transition-opacity group-hover:opacity-100">
                      →
                    </span>
                  </Link>
                </li>

                <li>
                  <Link
                    href="/compare"
                    className="group flex items-center justify-between rounded-xl px-3 py-2.5 text-sm text-muted-foreground transition-all hover:bg-blue-100/80 hover:text-blue-700 dark:hover:bg-blue-500/10 dark:hover:text-blue-400"
                  >
                    <span>Compare</span>
                    <span className="text-blue-500 opacity-0 transition-opacity group-hover:opacity-100">
                      →
                    </span>
                  </Link>
                </li>

                <li>
                  <Link
                    href="/ownership"
                    className="group flex items-center justify-between rounded-xl px-3 py-2.5 text-sm text-muted-foreground transition-all hover:bg-blue-100/80 hover:text-blue-700 dark:hover:bg-blue-500/10 dark:hover:text-blue-400"
                  >
                    <span>Ownership</span>
                    <span className="text-blue-500 opacity-0 transition-opacity group-hover:opacity-100">
                      →
                    </span>
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Company */}
          <div className="md:col-span-3">
            <div className="rounded-[1.75rem] border border-violet-200/70 bg-violet-50/70 p-6 dark:border-violet-400/20 dark:bg-violet-500/[0.07]">
              <div className="mb-5 flex items-center gap-3">
                <div className="h-2 w-2 rounded-full bg-violet-500" />

                <h3 className="font-semibold">Company</h3>
              </div>

              <ul className="space-y-2">
                <li>
                  <Link
                    href="/about"
                    className="group flex items-center justify-between rounded-xl px-3 py-2.5 text-sm text-muted-foreground transition-all hover:bg-violet-100/80 hover:text-violet-700 dark:hover:bg-violet-500/10 dark:hover:text-violet-400"
                  >
                    <span>About Aurora</span>
                    <span className="text-violet-500 opacity-0 transition-opacity group-hover:opacity-100">
                      →
                    </span>
                  </Link>
                </li>

                <li>
                  <Link
                    href="/contact"
                    className="group flex items-center justify-between rounded-xl px-3 py-2.5 text-sm text-muted-foreground transition-all hover:bg-violet-100/80 hover:text-violet-700 dark:hover:bg-violet-500/10 dark:hover:text-violet-400"
                  >
                    <span>Contact</span>
                    <span className="text-violet-500 opacity-0 transition-opacity group-hover:opacity-100">
                      →
                    </span>
                  </Link>
                </li>

                <li>
                  <Link
                    href="/faq"
                    className="group flex items-center justify-between rounded-xl px-3 py-2.5 text-sm text-muted-foreground transition-all hover:bg-violet-100/80 hover:text-violet-700 dark:hover:bg-violet-500/10 dark:hover:text-violet-400"
                  >
                    <span>Frequently Asked Questions</span>
                    <span className="text-violet-500 opacity-0 transition-opacity group-hover:opacity-100">
                      →
                    </span>
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Ownership principle */}
        <div className="mt-10 overflow-hidden rounded-[2rem] border border-yellow-200/70 bg-yellow-50/70 p-6 dark:border-yellow-400/20 dark:bg-yellow-500/[0.07] md:p-7">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-yellow-700 dark:text-yellow-400">
                Aurora Principle
              </p>

              <p className="mt-2 text-base font-semibold tracking-tight">
                Better access. Clearer numbers. A path toward ownership.
              </p>
            </div>

            <Link
              href="/vehicles"
              className="inline-flex shrink-0 items-center justify-center rounded-xl bg-yellow-400 px-5 py-3 text-sm font-bold text-yellow-950 shadow-sm transition-all hover:-translate-y-0.5 hover:bg-yellow-300 hover:shadow-md dark:bg-yellow-500 dark:hover:bg-yellow-400"
            >
              Explore Vehicles
            </Link>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 border-t border-border/70 pt-8">
          <div className="flex flex-col gap-5 text-xs leading-6 text-muted-foreground md:flex-row md:items-start md:justify-between">
            <p>
              © {new Date().getFullYear()} Aurora Mobility. All rights reserved.
            </p>

            <p className="max-w-2xl md:text-right">
              Pricing, vehicle availability, ownership terms, and delivery
              requirements vary by vehicle and customer plan. Review the details
              of your selected vehicle before proceeding.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
