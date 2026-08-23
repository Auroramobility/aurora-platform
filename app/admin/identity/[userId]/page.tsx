import Link from "next/link";
import { notFound } from "next/navigation";

import { IdentityReviewForm } from "@/app/admin/components/admin-action-form";
import { getAdminIdentityDetail } from "@/features/admin/lib/get-admin-identity-detail";

export default async function AdminIdentityReviewPage({
  params,
}: {
  params: Promise<{ userId: string }>;
}) {
  const { userId } = await params;

  const detail = await getAdminIdentityDetail(userId);

  if (!detail) {
    notFound();
  }

  const { profile, identityDocuments } = detail;

  const verified = profile.identity_verified === true;

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 flex items-center justify-between border-b border-border bg-surface/90 px-6 py-4 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <div className="flex h-7 w-7 items-center justify-center rounded-sm bg-primary">
            <span className="text-xs font-bold text-white">A</span>
          </div>

          <div>
            <p className="text-[9px] font-bold uppercase tracking-[.22em] text-primary">
              Aurora Mobility
            </p>

            <p className="text-xs text-muted-foreground">Identity Review</p>
          </div>
        </div>

        <Link
          href="/admin"
          className="text-xs text-muted-foreground transition-colors hover:text-foreground"
        >
          ← Back to operations
        </Link>
      </header>

      <main className="mx-auto max-w-5xl space-y-6 p-6">
        <header>
          <p className="text-sm font-medium text-muted-foreground">
            Identity verification
          </p>

          <h1 className="mt-1 text-3xl font-semibold">
            {profile.full_name || "Unnamed customer"}
          </h1>

          <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
            Review the identity information and uploaded documents before making
            a verification decision.
          </p>
        </header>

        <section className="bg-card rounded-3xl border p-6">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
            <div>
              <p className="text-sm font-semibold">Verification status</p>

              <p className="mt-1 text-sm text-muted-foreground">
                {verified
                  ? "This customer's identity is currently verified."
                  : "This customer's identity has not been verified."}
              </p>
            </div>

            <span className="inline-flex w-fit rounded-full border px-3 py-1 text-sm">
              {verified ? "Verified" : "Pending verification"}
            </span>
          </div>

          {profile.identity_verified_at ? (
            <p className="mt-4 text-xs text-muted-foreground">
              Verified on{" "}
              {new Date(profile.identity_verified_at).toLocaleString()}
            </p>
          ) : null}
        </section>

        <section className="bg-card rounded-3xl border p-6">
          <div>
            <h2 className="text-xl font-semibold">Customer information</h2>

            <p className="mt-1 text-sm text-muted-foreground">
              Information submitted by the customer.
            </p>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div>
              <p className="text-xs text-muted-foreground">Full name</p>

              <p className="mt-1 text-sm font-medium">
                {profile.full_name || "—"}
              </p>
            </div>

            <div>
              <p className="text-xs text-muted-foreground">Phone</p>

              <p className="mt-1 text-sm font-medium">{profile.phone || "—"}</p>
            </div>

            <div>
              <p className="text-xs text-muted-foreground">Date of birth</p>

              <p className="mt-1 text-sm font-medium">
                {profile.date_of_birth || "—"}
              </p>
            </div>

            <div>
              <p className="text-xs text-muted-foreground">Country</p>

              <p className="mt-1 text-sm font-medium">
                {profile.country || "—"}
              </p>
            </div>

            <div>
              <p className="text-xs text-muted-foreground">State</p>

              <p className="mt-1 text-sm font-medium">{profile.state || "—"}</p>
            </div>

            <div>
              <p className="text-xs text-muted-foreground">City</p>

              <p className="mt-1 text-sm font-medium">{profile.city || "—"}</p>
            </div>

            <div className="sm:col-span-2">
              <p className="text-xs text-muted-foreground">Address</p>

              <p className="mt-1 text-sm font-medium">
                {profile.address || "—"}
              </p>
            </div>
          </div>
        </section>

        <section className="bg-card rounded-3xl border p-6">
          <div>
            <h2 className="text-xl font-semibold">Identity documents</h2>

            <p className="mt-1 text-sm text-muted-foreground">
              Review the documents submitted by the customer. Documents are
              served through temporary private access links.
            </p>
          </div>

          <div className="mt-6 grid gap-6 lg:grid-cols-2">
            <div className="overflow-hidden rounded-2xl border bg-background">
              <div className="border-b p-4">
                <p className="font-medium">Driver&apos;s license — Front</p>
              </div>

              {identityDocuments.frontUrl ? (
                <div className="p-4">
                  <img
                    src={identityDocuments.frontUrl}
                    alt="Customer driver's license front"
                    className="max-h-[500px] w-full rounded-xl object-contain"
                  />

                  <a
                    href={identityDocuments.frontUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-4 inline-flex text-sm font-medium text-primary hover:underline"
                  >
                    Open document →
                  </a>
                </div>
              ) : (
                <div className="p-6 text-sm text-muted-foreground">
                  No front document was uploaded.
                </div>
              )}
            </div>

            <div className="overflow-hidden rounded-2xl border bg-background">
              <div className="border-b p-4">
                <p className="font-medium">Driver&apos;s license — Back</p>
              </div>

              {identityDocuments.backUrl ? (
                <div className="p-4">
                  <img
                    src={identityDocuments.backUrl}
                    alt="Customer driver's license back"
                    className="max-h-[500px] w-full rounded-xl object-contain"
                  />

                  <a
                    href={identityDocuments.backUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-4 inline-flex text-sm font-medium text-primary hover:underline"
                  >
                    Open document →
                  </a>
                </div>
              ) : (
                <div className="p-6 text-sm text-muted-foreground">
                  No back document was uploaded.
                </div>
              )}
            </div>
          </div>
        </section>

        <section className="bg-card rounded-3xl border p-6">
          <div>
            <h2 className="text-xl font-semibold">Verification decision</h2>

            <p className="mt-1 text-sm text-muted-foreground">
              Only verify the customer after reviewing the submitted identity
              information and documents.
            </p>
          </div>

          <IdentityReviewForm userId={profile.user_id} verified={verified} />
        </section>
      </main>
    </div>
  );
}
