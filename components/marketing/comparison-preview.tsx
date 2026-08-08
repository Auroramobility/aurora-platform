export function ComparisonPreview() {
  return (
    <section className="mx-auto max-w-7xl px-8 py-24">

      <div className="mx-auto max-w-3xl text-center">

        <p className="text-sm uppercase tracking-[0.3em] text-muted-foreground">
          The Aurora Difference
        </p>

        <h2 className="mt-4 text-4xl font-bold md:text-5xl">
          A smarter way to
          <span className="block text-primary">
            own an electric vehicle.
          </span>
        </h2>

        <p className="mt-6 text-lg text-muted-foreground">
          Compare traditional purchasing with Aurora's
          transparent ownership model.
        </p>

      </div>


      <div className="mt-16 grid gap-8 md:grid-cols-2">


        <div className="rounded-3xl border p-8">

          <h3 className="text-2xl font-bold">
            Traditional Purchase
          </h3>


          <div className="mt-8 space-y-6">


            <div>
              <p className="font-semibold">
                Large upfront payment
              </p>
              <p className="text-muted-foreground">
                Pay the full vehicle price or take on traditional financing.
              </p>
            </div>


            <div>
              <p className="font-semibold">
                Immediate depreciation
              </p>
              <p className="text-muted-foreground">
                Vehicle value decreases from day one.
              </p>
            </div>


            <div>
              <p className="font-semibold">
                Limited flexibility
              </p>
              <p className="text-muted-foreground">
                Financing options depend heavily on credit and lenders.
              </p>
            </div>


          </div>

        </div>




        <div className="rounded-3xl border bg-primary p-8 text-primary-foreground">

          <h3 className="text-2xl font-bold">
            Aurora Ownership Plan
          </h3>


          <div className="mt-8 space-y-6">


            <div>
              <p className="font-semibold">
                Start with 30% contribution
              </p>
              <p className="opacity-80">
                Begin your ownership journey with a transparent entry point.
              </p>
            </div>


            <div>
              <p className="font-semibold">
                Build equity monthly
              </p>
              <p className="opacity-80">
                Payments contribute toward your vehicle ownership.
              </p>
            </div>


            <div>
              <p className="font-semibold">
                Clear ownership timeline
              </p>
              <p className="opacity-80">
                Know exactly how your path to ownership works.
              </p>
            </div>


          </div>


        </div>


      </div>

    </section>
  );
}