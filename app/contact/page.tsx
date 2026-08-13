import { Mail, MessageSquare } from "lucide-react";

import { Navbar } from "@/components/marketing/navbar";
import { Footer } from "@/components/marketing/footer";

const SUPPORT_EMAIL = "Aurora.x.tesla@gmail.com";

const CONTACT_REASONS = [
  { label: "Application status", subject: "Application status question" },
  { label: "Payments & financing", subject: "Payments/financing question" },
  { label: "Identity verification", subject: "Identity verification question" },
  { label: "Something else", subject: "General question" },
];

export default function ContactPage() {
  return (
    <>
      <Navbar />

      <main>
        <section className="mx-auto max-w-3xl px-8 py-24">
          <p className="text-sm uppercase tracking-[0.3em] text-muted-foreground">
            Contact
          </p>

          <h1 className="mt-4 text-4xl font-bold md:text-5xl">
            Get in touch
          </h1>

          <p className="mt-6 text-lg text-muted-foreground">
            Already have an application in progress? The fastest way to
            reach the Aurora team is the messaging thread on your
            application — it's reviewed directly by the people handling
            your case.
          </p>

          <div className="mt-10 flex items-start gap-4 rounded-3xl border p-8">
            <MessageSquare className="mt-1 h-6 w-6 shrink-0 text-primary" />
            <div>
              <h2 className="text-xl font-semibold">
                Have an active application?
              </h2>
              <p className="mt-2 text-muted-foreground">
                Sign in and message us directly from your{" "}
                <a href="/dashboard" className="underline">
                  dashboard
                </a>
                {" "}or{" "}
                <a href="/messages" className="underline">
                  messages
                </a>
                .
              </p>
            </div>
          </div>

          <div className="mt-6 rounded-3xl border p-8">
            <div className="flex items-start gap-4">
              <Mail className="mt-1 h-6 w-6 shrink-0 text-primary" />
              <div>
                <h2 className="text-xl font-semibold">
                  Everything else
                </h2>
                <p className="mt-2 text-muted-foreground">
                  Email us directly and we&apos;ll get back to you.
                </p>
              </div>
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              {CONTACT_REASONS.map((reason) => (
                <a
                  key={reason.label}
                  href={`mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent(reason.subject)}`}
                  className="rounded-full border px-4 py-2 text-sm font-medium transition hover:border-primary hover:text-primary"
                >
                  {reason.label}
                </a>
              ))}
            </div>

            <a
              href={`mailto:${SUPPORT_EMAIL}`}
              className="mt-6 inline-block text-sm font-medium text-primary underline"
            >
              {SUPPORT_EMAIL}
            </a>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
