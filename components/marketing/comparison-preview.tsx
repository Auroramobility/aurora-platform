export function ComparisonPreview() {
  const rows = [
    {
      feature: "You build toward ownership",
      aurora: "✓",
      auroraText:
        "Every contribution moves you toward completing your ownership plan",
      finance: "✓",
      financeText: "Ownership follows full repayment of the financed purchase",
      lease: "✗",
      leaseText: "You lease the vehicle and return it or purchase separately",
    },
    {
      feature: "Traditional credit-based financing",
      aurora: "✓",
      auroraText: "Aurora does not use traditional loan financing",
      finance: "✗",
      financeText: "Credit approval is typically required",
      lease: "✗",
      leaseText: "Credit approval is typically required",
    },
    {
      feature: "Interest charges",
      aurora: "✓",
      auroraText: "0% interest — no interest is added to your plan",
      finance: "✗",
      financeText: "Interest charges depend on the loan",
      lease: "✗",
      leaseText: "Lease payments include the cost of the lease structure",
    },
    {
      feature: "Vehicle delivery",
      aurora: "✓",
      auroraText:
        "Delivery can proceed after reaching the required 30% contribution threshold",
      finance: "✓",
      financeText: "After purchase and financing approval",
      lease: "✓",
      leaseText: "After lease approval and signing",
    },
    {
      feature: "Traditional mileage restrictions",
      aurora: "✓",
      auroraText: "No traditional lease mileage limit",
      finance: "✓",
      financeText: "No lease mileage restriction",
      lease: "✗",
      leaseText: "Mileage limits typically apply",
    },
    {
      feature: "Early exit structure",
      aurora: "✓",
      auroraText: "Not structured as a traditional lease termination",
      finance: "✓",
      financeText: "Payoff terms depend on the loan agreement",
      lease: "✗",
      leaseText: "Early termination costs may apply",
    },
    {
      feature: "Price transparency",
      aurora: "✓",
      auroraText: "Aurora Access Price is shown upfront",
      finance: "✗",
      financeText: "Final cost depends on rate and financing terms",
      lease: "✗",
      leaseText: "Terms depend on lease pricing and residual value",
    },
    {
      feature: "Ownership progress",
      aurora: "✓",
      auroraText: "Your contribution and remaining balance stay visible",
      finance: "✗",
      financeText: "The loan balance tracks repayment",
      lease: "✗",
      leaseText: "Lease payments do not build vehicle ownership",
    },
  ];

  return (
    <section className="relative overflow-hidden border-y border-border/60 bg-muted/20">
      {/* Ambient background */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        <div className="absolute -left-32 top-16 h-80 w-80 rounded-full bg-emerald-500/[0.06] blur-3xl dark:bg-emerald-500/[0.09]" />

        <div className="absolute right-[-8rem] top-1/3 h-96 w-96 rounded-full bg-blue-500/[0.05] blur-3xl dark:bg-blue-500/[0.08]" />

        <div className="absolute bottom-[-8rem] left-[40%] h-80 w-80 rounded-full bg-purple-500/[0.05] blur-3xl dark:bg-purple-500/[0.08]" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 md:py-24">
        {/* Header */}
        <div className="mx-auto max-w-4xl text-center">
          <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-primary">
            The Aurora Difference
          </div>

          <h2 className="mt-6 text-4xl font-bold leading-[1.05] tracking-tight md:text-5xl lg:text-6xl">
            A different way to
            <span className="aurora-gradient-text block">own your EV.</span>
          </h2>

          <p className="mx-auto mt-6 max-w-3xl text-base leading-8 text-muted-foreground md:text-lg">
            See how Aurora compares with the traditional ways people access
            electric vehicles.
          </p>
        </div>

        {/* Comparison table */}
        <div className="mx-auto mt-14 max-w-6xl overflow-hidden rounded-[1.75rem] border border-border/70 bg-background shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] border-collapse text-left">
              <thead>
                <tr className="border-b border-border/70 bg-muted/40">
                  <th className="w-[28%] px-5 py-5 text-sm font-semibold md:px-7">
                    <span className="sr-only">Comparison</span>
                  </th>

                  <th className="w-[24%] border-l border-border/70 bg-emerald-500/[0.07] px-5 py-5 md:px-7">
                    <div className="text-base font-bold text-emerald-700 dark:text-emerald-400">
                      Aurora
                    </div>

                    <div className="mt-1 text-xs font-medium text-muted-foreground">
                      Aurora ownership model
                    </div>
                  </th>

                  <th className="w-[24%] border-l border-border/70 px-5 py-5 md:px-7">
                    <div className="text-base font-bold">
                      Traditional Finance
                    </div>

                    <div className="mt-1 text-xs font-medium text-muted-foreground">
                      Conventional purchase
                    </div>
                  </th>

                  <th className="w-[24%] border-l border-border/70 px-5 py-5 md:px-7">
                    <div className="text-base font-bold">Traditional Lease</div>

                    <div className="mt-1 text-xs font-medium text-muted-foreground">
                      Lease structure
                    </div>
                  </th>
                </tr>
              </thead>

              <tbody>
                {rows.map((row, index) => (
                  <tr
                    key={row.feature}
                    className={
                      index !== rows.length - 1
                        ? "border-b border-border/60"
                        : ""
                    }
                  >
                    {/* Feature */}
                    <th className="px-5 py-5 align-top text-sm font-semibold leading-6 md:px-7">
                      {row.feature}
                    </th>

                    {/* Aurora */}
                    <td className="border-l border-emerald-500/10 bg-emerald-500/[0.035] px-5 py-5 align-top md:px-7">
                      <div className="flex items-start gap-3">
                        <span className="mt-0.5 shrink-0 text-lg font-bold text-emerald-600 dark:text-emerald-400">
                          {row.aurora}
                        </span>

                        <span className="text-sm leading-6 text-foreground">
                          {row.auroraText}
                        </span>
                      </div>
                    </td>

                    {/* Traditional Finance */}
                    <td className="border-l border-border/60 px-5 py-5 align-top md:px-7">
                      <div className="flex items-start gap-3">
                        <span
                          className={`mt-0.5 shrink-0 text-lg font-bold ${
                            row.finance === "✓"
                              ? "text-emerald-600 dark:text-emerald-400"
                              : "text-muted-foreground"
                          }`}
                        >
                          {row.finance}
                        </span>

                        <span className="text-sm leading-6 text-muted-foreground">
                          {row.financeText}
                        </span>
                      </div>
                    </td>

                    {/* Traditional Lease */}
                    <td className="border-l border-border/60 px-5 py-5 align-top md:px-7">
                      <div className="flex items-start gap-3">
                        <span className="mt-0.5 shrink-0 text-lg font-bold text-muted-foreground">
                          {row.lease}
                        </span>

                        <span className="text-sm leading-6 text-muted-foreground">
                          {row.leaseText}
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Bottom statement */}
        <div className="mx-auto mt-10 max-w-4xl text-center">
          <p className="text-xl font-bold tracking-tight md:text-2xl">
            Not a traditional loan.
            <span className="text-primary"> Not a lease.</span>
            <span className="block md:inline">
              {" "}
              A different path toward ownership.
            </span>
          </p>

          <p className="mx-auto mt-3 max-w-2xl text-sm leading-7 text-muted-foreground md:text-base">
            Aurora owns the vehicles we offer. You choose your vehicle and
            contribution, and your approved plan gives you a clear path toward
            completing ownership.
          </p>
        </div>
      </div>
    </section>
  );
}
