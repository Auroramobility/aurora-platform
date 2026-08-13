import Link from "next/link";
import { ChevronDown } from "lucide-react";

import { Navbar } from "@/components/marketing/navbar";
import { Footer } from "@/components/marketing/footer";

const FAQS = [
  {
    question: "How does Aurora's ownership model work?",
    answer:
      "You apply for a vehicle, Aurora prepares an ownership plan with financing terms specific to that vehicle, and once you accept it, every payment builds recognized equity toward full ownership. You can track every stage — application, identity verification, financing, and payments — from your dashboard.",
  },
  {
    question: "What do I need to apply?",
    answer:
      "Basic personal and address information, employment/income details, and a photo of your driver's license (front and back) for identity verification. Everything is reviewed by an Aurora team member, not an automated system.",
  },
  {
    question: "How long does application review take?",
    answer:
      "This varies by application, but you can always check your current status from your dashboard, and you'll be notified as it moves through review.",
  },
  {
    question: "Can I message Aurora about my application?",
    answer:
      "Yes — every application has a direct messaging thread with the Aurora team, available from your dashboard. Note that messages are for questions and updates; they aren't used as proof of payment or a substitute for your official payment and financing records, which always live in your Payments page.",
  },
  {
    question: "What if I signed up with Google — how do I change my password?",
    answer:
      "Accounts created with Google sign-in don't have an Aurora-managed password — that's handled by your Google account. Everyone else can update their password from Settings.",
  },
  {
    question: "Can I deactivate my account?",
    answer:
      "Yes, from Settings. Deactivating signs you out immediately and blocks future sign-in. Your data isn't deleted automatically — contact support if you'd like your account reactivated or permanently deleted.",
  },
  {
    question: "Is my identity document information secure?",
    answer:
      "Driver's license images are stored in private, access-controlled storage — never publicly accessible — and are only used for identity verification during your application review.",
  },
];

export default function FAQPage() {
  return (
    <>
      <Navbar />

      <main>
        <section className="mx-auto max-w-3xl px-8 py-24">
          <p className="text-sm uppercase tracking-[0.3em] text-muted-foreground">
            FAQ
          </p>

          <h1 className="mt-4 text-4xl font-bold md:text-5xl">
            Frequently asked questions
          </h1>

          <p className="mt-6 text-lg text-muted-foreground">
            Can&apos;t find what you&apos;re looking for?{" "}
            <Link href="/contact" className="underline">
              Get in touch
            </Link>
            .
          </p>

          <div className="mt-12 divide-y divide-border rounded-3xl border">
            {FAQS.map((faq) => (
              <details key={faq.question} className="group p-6">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold marker:content-none">
                  {faq.question}
                  <ChevronDown className="h-5 w-5 shrink-0 text-muted-foreground transition group-open:rotate-180" />
                </summary>

                <p className="mt-3 text-muted-foreground">{faq.answer}</p>
              </details>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
