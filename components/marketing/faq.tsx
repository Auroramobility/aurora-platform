export function FAQ() {
  return (
    <section className="space-y-6 rounded-3xl border border-border bg-background p-8">
      <h2 className="text-3xl font-semibold">Frequently Asked Questions</h2>
      <div className="space-y-4">
        {[
          {
            question: "How long does delivery take?",
            answer:
              "Delivery timing varies by model, but Aurora keeps you informed every step of the way.",
          },
          {
            question: "Can I finance my EV through Aurora?",
            answer:
              "Yes, Aurora supports financing options and transparent cost breakdowns.",
          },
          {
            question: "What is the total cost of ownership?",
            answer:
              "Aurora calculates estimated ownership costs including charging, maintenance, and insurance.",
          },
        ].map((item) => (
          <div key={item.question} className="rounded-3xl bg-muted p-6">
            <p className="font-semibold">{item.question}</p>
            <p className="mt-2 text-sm text-muted-foreground">{item.answer}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
