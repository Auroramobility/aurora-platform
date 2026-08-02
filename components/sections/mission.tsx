import { HeartHandshake, ShieldCheck, Sparkles } from "lucide-react";

const PILLARS = [
  {
    icon: ShieldCheck,
    title: "Built on trust",
    description:
      "Every ownership program is transparent from day one — clear terms, clear payments, no fine print surprises.",
  },
  {
    icon: HeartHandshake,
    title: "Designed for accessibility",
    description:
      "We remove the traditional barriers to EV ownership so more people can make the switch, sooner.",
  },
  {
    icon: Sparkles,
    title: "A smarter path to owning",
    description:
      "Reliable vehicles, structured payments, and real ownership at the end — not just a lease.",
  },
] as const;

export function Mission() {
  return (
    <section id="about" className="border-t border-border/60 py-24">
      <div className="container px-6">
        <div className="grid gap-16 lg:grid-cols-2 lg:items-center lg:gap-24">
          <div>
            <span className="text-sm font-medium uppercase tracking-widest text-primary">
              Our mission
            </span>
            <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
              Connecting people with affordable EV ownership
            </h2>
            <p className="mt-5 text-balance text-muted-foreground sm:text-lg">
              Aurora Mobility exists to close the gap between wanting an
              electric vehicle and actually owning one. We connect people with
              affordable ownership opportunities — structured programs that turn
              a reliable EV into a realistic, achievable purchase rather than a
              distant goal.
            </p>
            <p className="mt-4 text-balance text-muted-foreground sm:text-lg">
              No dealership pressure, no confusing financing. Just a clear,
              honest path from application to full ownership.
            </p>
          </div>

          <ul className="grid gap-5">
            {PILLARS.map((pillar) => (
              <li
                key={pillar.title}
                className="flex gap-4 rounded-xl border border-border/60 bg-surface/60 p-6"
              >
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <pillar.icon className="h-5 w-5" strokeWidth={2} />
                </span>
                <div>
                  <h3 className="font-display text-base font-semibold text-foreground">
                    {pillar.title}
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                    {pillar.description}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
