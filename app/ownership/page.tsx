import Link from "next/link";

import { Navbar } from "@/components/marketing/navbar";
import { Footer } from "@/components/marketing/footer";
import { OwnershipJourney } from "@/components/marketing/ownership-journey";
import { CTA } from "@/components/marketing/cta";

export default function OwnershipPage() {
  return (
    <>
      <Navbar />

      <main>
        <section className="mx-auto max-w-4xl px-8 py-24">
          <p className="text-sm uppercase tracking-[0.3em] text-muted-foreground">
            How Ownership Works
          </p>

          <h1 className="mt-4 text-4xl font-bold md:text-5xl">
            A transparent path to
            <span className="block text-primary">owning your EV.</span>
          </h1>

          <p className="mt-6 text-lg text-muted-foreground">
            Aurora replaces traditional vehicle financing with an
            ownership model you can actually see. Every stage — your
            application, identity verification, financing terms, and
            payments — is visible from your dashboard, not hidden behind
            a call center.
          </p>
        </section>

        <OwnershipJourney />

        <section className="mx-auto max-w-4xl px-8 py-24">
          <div className="grid gap-10 sm:grid-cols-2">
            <div>
              <h2 className="text-xl font-semibold">
                What you can track
              </h2>
              <p className="mt-3 text-muted-foreground">
                Application status, identity verification, your prepared
                ownership plan and financing terms, your full payment
                history, and remaining balance — all from your Payments
                and dashboard pages once you have an account.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-semibold">
                Questions about your specific plan?
              </h2>
              <p className="mt-3 text-muted-foreground">
                Once you have an active application, message the Aurora
                team directly from your dashboard, or see our{" "}
                <Link href="/faq" className="underline">
                  FAQ
                </Link>{" "}
                for common questions.
              </p>
            </div>
          </div>
        </section>

        <CTA />
      </main>

      <Footer />
    </>
  );
}
