export function OwnershipJourney() {
  const steps = [
    {
      number: "01",
      title: "Select Your EV",
      description:
        "Explore premium electric vehicles and choose the model that fits your lifestyle.",
    },
    {
      number: "02",
      title: "Start Ownership",
      description:
        "Begin with a transparent 30% initial contribution and a clear ownership plan.",
    },
    {
      number: "03",
      title: "Build Equity",
      description:
        "Your monthly payments contribute toward increasing your ownership stake.",
    },
    {
      number: "04",
      title: "Own Your Vehicle",
      description:
        "Complete your ownership journey and transition into full vehicle ownership.",
    },
  ];

  return (
    <section className="bg-muted/30 py-24">

      <div className="mx-auto max-w-7xl px-8">

        <div className="mx-auto max-w-3xl text-center">

          <p className="text-sm uppercase tracking-[0.3em] text-muted-foreground">
            Ownership Journey
          </p>

          <h2 className="mt-4 text-4xl font-bold md:text-5xl">
            From your first payment
            <span className="block text-primary">
              to full ownership.
            </span>
          </h2>

          <p className="mt-6 text-lg text-muted-foreground">
            Aurora creates a transparent path toward owning
            your electric vehicle without traditional barriers.
          </p>

        </div>


        <div className="mt-16 grid gap-8 md:grid-cols-4">

          {steps.map((step) => (

            <div
              key={step.number}
              className="rounded-3xl border bg-background p-8"
            >

              <p className="text-4xl font-bold text-primary">
                {step.number}
              </p>

              <h3 className="mt-6 text-xl font-semibold">
                {step.title}
              </h3>

              <p className="mt-3 text-sm leading-6 text-muted-foreground">
                {step.description}
              </p>

            </div>

          ))}

        </div>

      </div>

    </section>
  );
}