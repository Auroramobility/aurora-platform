import Link from "next/link";
import { CheckCircle2, Circle, ArrowRight } from "lucide-react";

import type { OwnershipJourneyState } from "@/features/applications/lib/get-ownership-journey";

type Props = {
  state: OwnershipJourneyState;
};

const steps = [
  { key: "profileComplete", title: "Complete Profile", href: "/profile" },
  { key: "identityVerified", title: "Verify Identity", href: "/profile" },
  { key: "vehicleChosen", title: "Choose Vehicle", href: "/vehicles" },
  { key: "applicationSubmitted", title: "Submit Application", href: "/applications" },
  { key: "ownershipApproved", title: "Ownership Approved", href: "/applications" },
  { key: "ownershipActive", title: "Drive Your EV", href: "/applications" },
] as const;

export function OwnershipJourney({ state }: Props) {
  return (
    <section className="rounded-3xl border bg-background p-8">
      <div className="mb-8">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">
          Ownership Journey
        </p>
        <h2 className="mt-3 text-3xl font-bold">Your Progress</h2>
        <p className="mt-2 text-muted-foreground">
          Every completed step moves you closer to owning your electric vehicle.
        </p>
      </div>

      <div className="space-y-5">
        {steps.map((step) => {
          const completed = state[step.key];

          return (
            <Link
              key={step.key}
              href={step.href}
              className="flex items-center justify-between gap-4 rounded-2xl border p-4 transition hover:bg-muted/50"
            >
              <div className="flex items-center gap-4">
                {completed ? (
                  <CheckCircle2 className="h-6 w-6 text-green-500" />
                ) : (
                  <Circle className="h-6 w-6 text-muted-foreground" />
                )}
                <span className="font-medium">{step.title}</span>
              </div>
              {!completed ? <ArrowRight className="h-4 w-4 text-muted-foreground" /> : null}
            </Link>
          );
        })}
      </div>
    </section>
  );
}
