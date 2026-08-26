import Link from "next/link";

import { Navbar } from "@/components/marketing/navbar";
import { Footer } from "@/components/marketing/footer";
import { CTA } from "@/components/marketing/cta";
import { BackButton } from "@/components/ui/back-button";

export default function AboutPage() {
  return (
    <>
      <Navbar />

      <main>
        <BackButton />
        <section className="mx-auto max-w-4xl px-8 py-24">
          <p className="text-sm uppercase tracking-[0.3em] text-muted-foreground">
            About Aurora
          </p>

          <h1 className="mt-4 text-4xl font-bold md:text-5xl">
            Electric vehicle ownership,
            <span className="block text-primary">without the barriers.</span>
          </h1>

          <p className="mt-6 text-lg text-muted-foreground">
            Traditional vehicle financing wasn&apos;t built for how people
            actually want to own an EV today. Aurora exists to close that gap —
            a transparent ownership model where every payment builds recognized
            equity, and every step of the process is something you can actually
            see and track.
          </p>

          <div className="mt-16 grid gap-10 sm:grid-cols-2">
            <div>
              <h2 className="text-xl font-semibold">What we do</h2>
              <p className="mt-3 text-muted-foreground">
                We help people find the right electric vehicle, apply for an
                ownership plan, and track every stage of that journey — from
                application to identity verification to financing to delivery —
                in one place.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-semibold">
                How we&apos;re different
              </h2>
              <p className="mt-3 text-muted-foreground">
                No hidden fees. No confusing financing structures. Your
                application status, your ownership plan, and your payment
                history are always visible to you — not buried in a call center.
              </p>
            </div>
          </div>

          <div className="mt-16 rounded-3xl border p-8">
            <h2 className="text-xl font-semibold">Questions?</h2>
            <p className="mt-3 text-muted-foreground">
              Check our{" "}
              <Link href="/faq" className="underline">
                FAQ
              </Link>
              , or{" "}
              <Link href="/contact" className="underline">
                get in touch
              </Link>{" "}
              directly.
            </p>
          </div>
        </section>

        <CTA />
      </main>

      <Footer />
    </>
  );
}
