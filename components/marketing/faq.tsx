export function FAQ() {
  const faqs = [
    {
      question: "What is the Aurora Access Price?",
      answer:
        "The Aurora Access Price is the price Aurora assigns to an eligible vehicle for the Aurora Access Programme. It is the starting vehicle price used to build your ownership plan.",
    },
    {
      question: "Is there interest on an Aurora ownership plan?",
      answer:
        "No. Aurora ownership plans are built with 0% interest. No interest is added to the amount you are required to contribute toward the vehicle.",
    },
    {
      question: "How does the 30% delivery threshold work?",
      answer:
        "You must reach at least 30% of the Aurora Access Price through your approved contribution plan before vehicle delivery can proceed. Once that threshold is reached, Aurora can move forward with delivery while you continue toward completing the remaining balance.",
    },
    {
      question: "Do I need traditional vehicle financing?",
      answer:
        "No. Aurora is not structured as a traditional vehicle loan. Your ownership plan is built around the Aurora Access Price, your initial contribution, and the ownership duration you select.",
    },
    {
      question: "How do I choose my monthly contribution?",
      answer:
        "You choose your initial contribution and ownership duration in the Aurora calculator. The calculator then shows the estimated remaining balance and monthly contribution so you can understand the plan before applying.",
    },
    {
      question: "Does the monthly amount include interest?",
      answer:
        "No. Aurora does not add interest to the ownership plan. Your estimated monthly contribution is based on the remaining balance and the ownership duration selected.",
    },
    {
      question: "When do I become eligible for vehicle delivery?",
      answer:
        "Vehicle delivery becomes eligible after you reach the required 30% contribution threshold based on the Aurora Access Price and your approved ownership plan.",
    },
    {
      question: "Can I see my ownership progress?",
      answer:
        "Yes. Your dashboard is designed to show your contribution, progress toward the delivery threshold, remaining balance, payment activity, and other important ownership-plan information.",
    },
  ];

  return (
    <section className="relative overflow-hidden border-y border-border/60 bg-muted/20">
      {/* Ambient background */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        <div className="absolute -left-32 top-20 h-80 w-80 rounded-full bg-blue-500/[0.06] blur-3xl dark:bg-blue-500/[0.09]" />

        <div className="absolute right-[-8rem] top-1/3 h-96 w-96 rounded-full bg-purple-500/[0.06] blur-3xl dark:bg-purple-500/[0.09]" />

        <div className="absolute bottom-[-8rem] left-[35%] h-80 w-80 rounded-full bg-emerald-500/[0.05] blur-3xl dark:bg-emerald-500/[0.08]" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 md:py-24">
        {/* Header */}
        <div className="mx-auto max-w-3xl text-center">
          <div className="inline-flex items-center rounded-full border border-purple-300/50 bg-purple-100/70 px-4 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-purple-700 dark:border-purple-400/20 dark:bg-purple-500/10 dark:text-purple-400">
            Frequently Asked Questions
          </div>

          <h2 className="mt-6 text-4xl font-bold leading-tight tracking-tight md:text-5xl lg:text-6xl">
            Everything you need to know.
          </h2>

          <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-muted-foreground md:text-lg">
            Clear answers about Aurora pricing, contributions, delivery, and the
            path toward ownership.
          </p>
        </div>

        {/* FAQ grid */}
        <div className="mx-auto mt-14 grid max-w-5xl gap-4 md:grid-cols-2">
          {faqs.map((item, index) => (
            <div
              key={item.question}
              className="group rounded-3xl border border-border/70 bg-background p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg md:p-7"
            >
              <div className="flex items-start gap-4">
                <div
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-sm font-bold ${
                    index % 3 === 0
                      ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                      : index % 3 === 1
                        ? "bg-blue-500/10 text-blue-600 dark:text-blue-400"
                        : "bg-purple-500/10 text-purple-600 dark:text-purple-400"
                  }`}
                >
                  {index + 1}
                </div>

                <div>
                  <h3 className="font-semibold leading-6 tracking-tight">
                    {item.question}
                  </h3>

                  <p className="mt-3 text-sm leading-7 text-muted-foreground">
                    {item.answer}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom note */}
        <div className="mx-auto mt-10 max-w-3xl rounded-2xl border border-border/70 bg-background/80 p-5 text-center shadow-sm">
          <p className="text-sm leading-7 text-muted-foreground">
            Vehicle availability, pricing, approval, delivery requirements, and
            final ownership-plan terms may vary by vehicle and customer. Always
            review your approved plan before proceeding.
          </p>
        </div>
      </div>
    </section>
  );
}
