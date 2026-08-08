import { CarFront, FileCheck2, Wallet } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const STEPS = [
  {
    number: "01",
    icon: CarFront,
    title: "Choose an EV",
    description:
      "Browse a curated range of reliable electric vehicles and find the one that fits your life and budget.",
  },
  {
    number: "02",
    icon: FileCheck2,
    title: "Apply for ownership",
    description:
      "Complete a straightforward application for an affordable ownership program built around your finances.",
  },
  {
    number: "03",
    icon: Wallet,
    title: "Track payments and own your vehicle",
    description:
      "Follow your progress with clear, transparent payments until the vehicle is fully yours.",
  },
] as const;

export function HowItWorks() {
  return (
    <section id="how-it-works" className="border-t border-border/60 py-24">
      <div className="container px-6">
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-sm font-medium uppercase tracking-widest text-primary">
            How it works
          </span>
          <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            Three steps to ownership
          </h2>
          <p className="mt-4 text-balance text-muted-foreground sm:text-lg">
            A simple, transparent path from browsing to owning — no hidden
            terms, no guesswork.
          </p>
        </div>

        <ol className="mx-auto mt-16 grid max-w-5xl gap-6 sm:grid-cols-3">
          {STEPS.map((step) => (
            <li key={step.number}>
              <Card className="h-full border-border/60 bg-surface/60 transition-colors duration-300 hover:border-primary/40">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <span className="flex h-11 w-11 items-center justify-center rounded-full bg-primary/10 text-primary">
                      <step.icon className="h-5 w-5" strokeWidth={2} />
                    </span>
                    <span className="font-display text-sm text-muted-foreground">
                      {step.number}
                    </span>
                  </div>
                  <CardTitle className="pt-4">{step.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>{step.description}</CardDescription>
                </CardContent>
              </Card>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
