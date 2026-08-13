import { Shield, TrendingUp, Eye } from "lucide-react";

const features = [
  {
    icon: Eye,
    title: "Transparent Ownership",
    description: "No hidden fees. No confusing financing structures. Know exactly what you're building toward with every payment.",
    color: "text-primary",
    glow: "group-hover:shadow-primary/20",
  },
  {
    icon: TrendingUp,
    title: "Equity With Every Payment",
    description: "Your payments are designed to move you closer to legally recognized vehicle ownership — not just a lease you walk away from.",
    color: "text-accent",
    glow: "group-hover:shadow-accent/20",
  },
  {
    icon: Shield,
    title: "Secure & Trusted",
    description: "Bank-grade document security, verified identity checks, and an admin team reviewing every application personally.",
    color: "text-primary",
    glow: "group-hover:shadow-primary/20",
  },
];

export function WhyAurora() {
  return (
    <section className="mx-auto max-w-7xl px-8 py-28">

      <div className="max-w-3xl">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-primary">
          Why Aurora
        </p>
        <h2 className="mt-4 text-4xl font-bold leading-tight md:text-5xl">
          Premium EV ownership,{" "}
          <span className="aurora-gradient-text">redesigned.</span>
        </h2>
        <p className="mt-6 text-lg text-muted-foreground">
          Traditional vehicle financing creates barriers between people and
          the electric vehicles they want. Aurora introduces a transparent
          ownership model where every payment builds recognized equity.
        </p>
      </div>

      <div className="aurora-divider mt-16 mb-12" />

      <div className="grid gap-6 md:grid-cols-3">
        {features.map((feature) => {
          const Icon = feature.icon;
          return (
            <div
              key={feature.title}
              className={`group aurora-card rounded-3xl border border-border bg-surface p-8 shadow-lg ${feature.glow}`}
            >
              <div className={`inline-flex h-12 w-12 items-center justify-center rounded-2xl aurora-stat mb-6`}>
                <Icon className={`h-6 w-6 ${feature.color}`} />
              </div>
              <h3 className="text-xl font-semibold">{feature.title}</h3>
              <p className="mt-4 text-muted-foreground leading-relaxed">{feature.description}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
