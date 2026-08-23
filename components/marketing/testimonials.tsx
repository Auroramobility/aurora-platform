import { BadgeCheck, Quote, Star } from "lucide-react";

const testimonials = [
  {
    vehicle: "Tesla Model 3",
    variant: "Ultra Red",
    location: "Houston, USA 🇺🇸",
    quote:
      "Aurora made the numbers easy to understand from the beginning. I knew the vehicle, the price, my contribution, and what the path toward ownership looked like.",
    initials: "MW",
    name: "Marcus Webb",
    role: "Houston, USA",
    color: "blue",
  },
  {
    vehicle: "BYD Seal",
    variant: "Premium",
    location: "Amsterdam, Netherlands 🇳🇱",
    quote:
      "What stood out to me was the transparency. I could see exactly what I was choosing instead of trying to work through a complicated financing structure.",
    initials: "LV",
    name: "Lucas van der Berg",
    role: "Amsterdam, Netherlands",
    color: "purple",
  },
  {
    vehicle: "Lucid Air Grand Touring",
    variant: "AWD",
    location: "Munich, Germany 🇩🇪",
    quote:
      "The Lucid was the vehicle I wanted, but the numbers had to make sense. Aurora gave me a much clearer way to understand the price and ownership plan.",
    initials: "FK",
    name: "Franz Keller",
    role: "Munich, Germany",
    color: "emerald",
  },
  {
    vehicle: "Audi Q8 e-tron",
    variant: "S line",
    location: "Manchester, UK 🇬🇧",
    quote:
      "I liked knowing what the vehicle cost, what I needed to contribute, and what the next steps were before moving forward.",
    initials: "SB",
    name: "Sophie Barnes",
    role: "Manchester, UK",
    color: "amber",
  },
  {
    vehicle: "Rivian R1S",
    variant: "Dual-Motor",
    location: "Barcelona, Spain 🇪🇸",
    quote:
      "The Rivian felt out of reach at first. Aurora gave me a clearer picture of the actual vehicle price and how I could work toward ownership.",
    initials: "JR",
    name: "Jorge Ruiz",
    role: "Barcelona, Spain",
    color: "orange",
  },
  {
    vehicle: "Kia EV9",
    variant: "AWD",
    location: "Lyon, France 🇫🇷",
    quote:
      "The EV9 was exactly what my family needed. Having the price and ownership path laid out clearly made the decision much easier.",
    initials: "TL",
    name: "Thomas Laurent",
    role: "Lyon, France",
    color: "rose",
  },
] as const;

const colors = {
  blue: {
    card: "border-blue-200 bg-blue-50/70 dark:border-blue-400/20 dark:bg-blue-500/[0.06]",
    icon: "bg-blue-500/15 text-blue-600 ring-1 ring-blue-500/20 dark:text-blue-400",
    initials:
      "bg-blue-500/10 text-blue-700 dark:bg-blue-400/10 dark:text-blue-400",
    accent: "bg-blue-500",
  },
  purple: {
    card: "border-purple-200 bg-purple-50/70 dark:border-purple-400/20 dark:bg-purple-500/[0.06]",
    icon: "bg-purple-500/15 text-purple-600 ring-1 ring-purple-500/20 dark:text-purple-400",
    initials:
      "bg-purple-500/10 text-purple-700 dark:bg-purple-400/10 dark:text-purple-400",
    accent: "bg-purple-500",
  },
  emerald: {
    card: "border-emerald-200 bg-emerald-50/70 dark:border-emerald-400/20 dark:bg-emerald-500/[0.06]",
    icon: "bg-emerald-500/15 text-emerald-600 ring-1 ring-emerald-500/20 dark:text-emerald-400",
    initials:
      "bg-emerald-500/10 text-emerald-700 dark:bg-emerald-400/10 dark:text-emerald-400",
    accent: "bg-emerald-500",
  },
  amber: {
    card: "border-amber-200 bg-amber-50/70 dark:border-amber-400/20 dark:bg-amber-500/[0.06]",
    icon: "bg-amber-500/15 text-amber-600 ring-1 ring-amber-500/20 dark:text-amber-400",
    initials:
      "bg-amber-500/10 text-amber-700 dark:bg-amber-400/10 dark:text-amber-400",
    accent: "bg-amber-500",
  },
  orange: {
    card: "border-orange-200 bg-orange-50/70 dark:border-orange-400/20 dark:bg-orange-500/[0.06]",
    icon: "bg-orange-500/15 text-orange-600 ring-1 ring-orange-500/20 dark:text-orange-400",
    initials:
      "bg-orange-500/10 text-orange-700 dark:bg-orange-400/10 dark:text-orange-400",
    accent: "bg-orange-500",
  },
  rose: {
    card: "border-rose-200 bg-rose-50/70 dark:border-rose-400/20 dark:bg-rose-500/[0.06]",
    icon: "bg-rose-500/15 text-rose-600 ring-1 ring-rose-500/20 dark:text-rose-400",
    initials:
      "bg-rose-500/10 text-rose-700 dark:bg-rose-400/10 dark:text-rose-400",
    accent: "bg-rose-500",
  },
} as const;

export function Testimonials() {
  return (
    <section className="relative overflow-hidden border-y border-border/60 bg-muted/20">
      {/* Ambient background */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        <div className="absolute -left-24 top-20 h-72 w-72 rounded-full bg-blue-500/[0.06] blur-3xl dark:bg-blue-500/[0.09]" />

        <div className="absolute right-[-6rem] top-1/3 h-80 w-80 rounded-full bg-purple-500/[0.06] blur-3xl dark:bg-purple-500/[0.09]" />

        <div className="absolute bottom-[-6rem] left-1/3 h-72 w-72 rounded-full bg-emerald-500/[0.05] blur-3xl dark:bg-emerald-500/[0.08]" />
      </div>

      <div className="relative mx-auto max-w-7xl px-6 py-20 sm:px-8 md:py-24">
        {/* Header */}
        <div className="mx-auto max-w-3xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/20 bg-blue-500/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-blue-700 dark:text-blue-400">
            <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
            Owner Stories
          </div>

          <h2 className="mt-5 text-3xl font-bold leading-tight tracking-tight md:text-4xl lg:text-5xl">
            A clearer way to
            <span className="aurora-gradient-text block">
              move toward ownership.
            </span>
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-muted-foreground md:text-base">
            Different vehicles. Different people. One shared experience: knowing
            the numbers and understanding the path before moving forward.
          </p>
        </div>

        {/* Testimonials */}
        <div className="mx-auto mt-12 grid max-w-6xl gap-4 md:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((testimonial) => {
            const style = colors[testimonial.color];

            return (
              <article
                key={testimonial.name}
                className={`group relative overflow-hidden rounded-3xl border p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg ${style.card}`}
              >
                {/* Top accent */}
                <div
                  aria-hidden="true"
                  className={`absolute inset-x-5 top-0 h-1 rounded-b-full opacity-80 ${style.accent}`}
                />

                <div className="relative">
                  {/* Vehicle */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="truncate text-xs font-bold uppercase tracking-[0.14em] text-foreground">
                        {testimonial.vehicle}
                      </p>

                      <p className="mt-1 text-xs text-muted-foreground">
                        {testimonial.variant} · {testimonial.location}
                      </p>
                    </div>

                    <div
                      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${style.icon}`}
                    >
                      <Quote className="h-4 w-4" />
                    </div>
                  </div>

                  {/* Stars */}
                  <div className="mt-4 flex items-center gap-0.5">
                    {Array.from({ length: 5 }).map((_, index) => (
                      <Star
                        key={index}
                        className="h-3.5 w-3.5 fill-amber-400 text-amber-400"
                      />
                    ))}
                  </div>

                  {/* Quote */}
                  <blockquote className="mt-4 text-sm leading-6 text-foreground/90">
                    “{testimonial.quote}”
                  </blockquote>

                  {/* Owner */}
                  <div className="mt-5 flex items-center gap-3 border-t border-border/60 pt-4">
                    <div
                      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-bold ${style.initials}`}
                    >
                      {testimonial.initials}
                    </div>

                    <div className="min-w-0">
                      <p className="truncate text-sm font-bold tracking-tight">
                        {testimonial.name}
                      </p>

                      <p className="truncate text-xs text-muted-foreground">
                        {testimonial.role}
                      </p>
                    </div>

                    <div className="ml-auto flex shrink-0 items-center gap-1 text-[9px] font-semibold uppercase tracking-wide text-emerald-600 dark:text-emerald-400">
                      <BadgeCheck className="h-3.5 w-3.5" />
                      Owner
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        {/* Closing message */}
        <div className="mx-auto mt-10 max-w-4xl rounded-3xl border border-primary/15 bg-background/80 p-6 text-center shadow-sm backdrop-blur-sm md:p-8">
          <p className="text-lg font-bold tracking-tight md:text-xl">
            The vehicle you want.
            <span className="text-primary"> A plan you understand.</span>
          </p>

          <p className="mx-auto mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
            Aurora keeps the journey focused on the things that matter: the
            vehicle, the price, your contribution, and the path toward
            ownership.
          </p>
        </div>
      </div>
    </section>
  );
}
