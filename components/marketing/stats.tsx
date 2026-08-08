export function Stats() {
  return (
    <section className="space-y-6 rounded-3xl border border-border bg-background p-8 text-center">
      <p className="text-sm uppercase tracking-[0.24em] text-muted-foreground">
        Trusted by drivers
      </p>
      <h2 className="text-3xl font-semibold">Aurora in numbers</h2>
      <div className="grid gap-6 md:grid-cols-3">
        <div className="rounded-3xl bg-muted p-6">
          <p className="text-4xl font-semibold">100+</p>
          <p className="mt-2 text-sm text-muted-foreground">
            EV models curated
          </p>
        </div>
        <div className="rounded-3xl bg-muted p-6">
          <p className="text-4xl font-semibold">98%</p>
          <p className="mt-2 text-sm text-muted-foreground">
            customer confidence score
          </p>
        </div>
        <div className="rounded-3xl bg-muted p-6">
          <p className="text-4xl font-semibold">24/7</p>
          <p className="mt-2 text-sm text-muted-foreground">
            support for buyers
          </p>
        </div>
      </div>
    </section>
  );
}
