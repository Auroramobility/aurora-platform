import Link from "next/link";
import { notFound, redirect } from "next/navigation";

import { requireAdmin } from "@/features/admin/lib/authorization";
import { getAdminApplicationDetail } from "@/features/admin/lib/get-admin-application-detail";
import {
  ApplicationReviewForm,
  IdentityReviewForm,
} from "../../components/admin-action-form";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export default async function AdminApplicationDetailPage({
  params,
}: Props) {
  const { isAdmin } = await requireAdmin();

  if (!isAdmin) {
    redirect("/dashboard");
  }

  const { id } = await params;

  const detail = await getAdminApplicationDetail(id);

  if (!detail) {
    notFound();
  }

  const {
    application,
    profile,
    vehicle,
    ownershipPlan,
    identityDocuments,
  } = detail;

  return (
    <main className="mx-auto max-w-6xl space-y-8 p-6">
      {/* Header */}
      <div>
        <Link
          href="/admin"
          className="text-sm text-muted-foreground hover:text-foreground"
        >
          ← Back to Operations
        </Link>

        <div className="mt-4">
          <p className="text-sm font-medium text-muted-foreground">
            Application Review
          </p>

          <h1 className="mt-1 text-3xl font-semibold">
            {profile?.full_name || "Customer Application"}
          </h1>

          <p className="mt-2 text-sm text-muted-foreground">
            Application ID: {application.id}
          </p>
        </div>
      </div>

      {/* Application Decision */}
      <section className="rounded-3xl border bg-card p-6">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
          <div>
            <h2 className="text-xl font-semibold">
              Application decision
            </h2>

            <p className="mt-1 text-sm text-muted-foreground">
              Review the application and move it through the approved
              operational states.
            </p>
          </div>

          <span className="rounded-full border px-3 py-1 text-sm capitalize">
            {application.status}
          </span>
        </div>

        <div className="mt-6">
          <ApplicationReviewForm
            applicationId={application.id}
            status={application.status}
          />
        </div>
      </section>

      {/* Identity Verification */}
      <section className="rounded-3xl border bg-card p-6">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
          <div>
            <h2 className="text-xl font-semibold">
              Identity verification
            </h2>

            <p className="mt-1 text-sm text-muted-foreground">
              Review the customer&apos;s identity documents and
              verification status.
            </p>
          </div>

          {profile ? (
            <IdentityReviewForm
              userId={profile.user_id}
              verified={profile.identity_verified === true}
            />
          ) : null}
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border p-4">
            <p className="text-sm text-muted-foreground">
              Verification status
            </p>

            <p className="mt-1 font-semibold">
              {profile?.identity_verified
                ? "Verified"
                : "Not verified"}
            </p>
          </div>

          <div className="rounded-2xl border p-4">
            <p className="text-sm text-muted-foreground">
              Verified at
            </p>

            <p className="mt-1 font-semibold">
              {profile?.identity_verified_at
                ? new Date(
                    profile.identity_verified_at,
                  ).toLocaleString()
                : "—"}
            </p>
          </div>
        </div>

        <div className="mt-6 grid gap-6 md:grid-cols-2">
          <DocumentCard
            title="Driver's license — front"
            value={profile?.drivers_license_front}
            signedUrl={identityDocuments.frontUrl}
          />

          <DocumentCard
            title="Driver's license — back"
            value={profile?.drivers_license_back}
            signedUrl={identityDocuments.backUrl}
          />
        </div>
      </section>

      {/* Customer + Vehicle */}
      <section className="grid gap-6 lg:grid-cols-2">
        {/* Customer Information */}
        <div className="rounded-3xl border bg-card p-6">
          <h2 className="text-xl font-semibold">
            Customer information
          </h2>

          <div className="mt-5 space-y-3 text-sm">
            <Detail
              label="Full name"
              value={profile?.full_name}
            />

            <Detail
              label="Phone"
              value={profile?.phone}
            />

            <Detail
              label="Country"
              value={profile?.country}
            />

            <Detail
              label="State"
              value={profile?.state}
            />

            <Detail
              label="Address"
              value={profile?.address}
            />

            <Detail
              label="City"
              value={profile?.city}
            />

            <Detail
              label="Postal code"
              value={profile?.postal_code}
            />

            <Detail
              label="Date of birth"
              value={profile?.date_of_birth}
            />

            <Detail
              label="Employment"
              value={profile?.employment_status}
            />

            <Detail
              label="Monthly income"
              value={
                profile?.monthly_income != null
                  ? `$${Number(
                      profile.monthly_income,
                    ).toLocaleString()}`
                  : null
              }
            />
          </div>
        </div>

        {/* Vehicle */}
        <div className="rounded-3xl border bg-card p-6">
          <h2 className="text-xl font-semibold">
            Vehicle
          </h2>

          {vehicle ? (
            <div className="mt-5 space-y-3 text-sm">
              <Detail
                label="Vehicle"
                value={`${vehicle.brand} ${vehicle.model}`}
              />

              <Detail
                label="Trim"
                value={vehicle.trim}
              />

              <Detail
                label="Year"
                value={
                  vehicle.year
                    ? String(vehicle.year)
                    : null
                }
              />

              <Detail
                label="Price"
                value={
                  vehicle.price != null
                    ? `$${Number(
                        vehicle.price,
                      ).toLocaleString()}`
                    : null
                }
              />

              <Detail
                label="Mileage"
                value={
                  vehicle.mileage != null
                    ? `${Number(
                        vehicle.mileage,
                      ).toLocaleString()} miles`
                    : null
                }
              />

              <Detail
                label="Color"
                value={vehicle.color}
              />

              <Detail
                label="Drivetrain"
                value={vehicle.drivetrain}
              />

              <Detail
                label="Range"
                value={
                  vehicle.range_miles != null
                    ? `${vehicle.range_miles} miles`
                    : null
                }
              />
            </div>
          ) : (
            <p className="mt-4 text-sm text-muted-foreground">
              Vehicle information is unavailable.
            </p>
          )}
        </div>
      </section>

      {/* Ownership Plan */}
      <section className="rounded-3xl border bg-card p-6">
        <h2 className="text-xl font-semibold">
          Ownership plan
        </h2>

        {!ownershipPlan ? (
          <p className="mt-4 text-sm text-muted-foreground">
            No ownership plan has been created yet.
          </p>
        ) : (
          <div className="mt-5 space-y-5">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <Detail
                label="Status"
                value={ownershipPlan.status}
              />

              <Detail
                label="Created"
                value={
                  ownershipPlan.created_at
                    ? new Date(
                        ownershipPlan.created_at,
                      ).toLocaleString()
                    : null
                }
              />

              <Detail
                label="Accepted"
                value={
                  ownershipPlan.accepted_at
                    ? new Date(
                        ownershipPlan.accepted_at,
                      ).toLocaleString()
                    : null
                }
              />

              <Detail
                label="Activated"
                value={
                  ownershipPlan.activated_at
                    ? new Date(
                        ownershipPlan.activated_at,
                      ).toLocaleString()
                    : null
                }
              />
            </div>

            {ownershipPlan.financingTerms ? (
              <div className="rounded-2xl border p-5">
                <h3 className="font-semibold">
                  Financing terms
                </h3>

                <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  <Detail
                    label="Vehicle price"
                    value={
                      ownershipPlan.financingTerms
                        .vehicle_price != null
                        ? `$${Number(
                            ownershipPlan.financingTerms
                              .vehicle_price,
                          ).toLocaleString()}`
                        : null
                    }
                  />

                  <Detail
                    label="Down payment"
                    value={
                      ownershipPlan.financingTerms
                        .down_payment != null
                        ? `$${Number(
                            ownershipPlan.financingTerms
                              .down_payment,
                          ).toLocaleString()}`
                        : null
                    }
                  />

                  <Detail
                    label="Amount financed"
                    value={
                      ownershipPlan.financingTerms
                        .amount_financed != null
                        ? `$${Number(
                            ownershipPlan.financingTerms
                              .amount_financed,
                          ).toLocaleString()}`
                        : null
                    }
                  />

                  <Detail
                    label="Monthly payment"
                    value={
                      ownershipPlan.financingTerms
                        .monthly_payment != null
                        ? `$${Number(
                            ownershipPlan.financingTerms
                              .monthly_payment,
                          ).toLocaleString()}`
                        : null
                    }
                  />

                  <Detail
                    label="Term"
                    value={
                      ownershipPlan.financingTerms
                        .term_months != null
                        ? `${ownershipPlan.financingTerms.term_months} months`
                        : null
                    }
                  />

                  <Detail
                    label="Total repayment"
                    value={
                      ownershipPlan.financingTerms
                        .total_financed_repayment != null
                        ? `$${Number(
                            ownershipPlan.financingTerms
                              .total_financed_repayment,
                          ).toLocaleString()}`
                        : null
                    }
                  />

                  <Detail
                    label="Interest rate"
                    value={
                      ownershipPlan.financingTerms
                        .annual_interest_rate != null
                        ? `${ownershipPlan.financingTerms.annual_interest_rate}%`
                        : null
                    }
                  />

                  <Detail
                    label="First payment"
                    value={
                      ownershipPlan.financingTerms
                        .first_payment_date
                    }
                  />

                  <Detail
                    label="Frequency"
                    value={
                      ownershipPlan.financingTerms
                        .payment_frequency
                    }
                  />
                </div>
              </div>
            ) : null}
          </div>
        )}
      </section>
    </main>
  );
}

function Detail({
  label,
  value,
}: {
  label: string;
  value: string | number | null | undefined;
}) {
  return (
    <div>
      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
        {label}
      </p>

      <p className="mt-1 break-words">
        {value || "—"}
      </p>
    </div>
  );
}

function DocumentCard({
  title,
  value,
  signedUrl,
}: {
  title: string;
  value: string | null | undefined;
  signedUrl: string | null | undefined;
}) {
  const isPdf = value?.toLowerCase().endsWith(".pdf");

  return (
    <div className="rounded-2xl border p-5">
      <h3 className="font-semibold">{title}</h3>

      {!value ? (
        <p className="mt-3 text-sm text-muted-foreground">
          No document uploaded.
        </p>
      ) : !signedUrl ? (
        <p className="mt-3 text-sm text-destructive">
          Document is unavailable.
        </p>
      ) : (
        <div className="mt-4 space-y-4">
          {isPdf ? (
            <div className="flex min-h-48 items-center justify-center rounded-xl border bg-muted p-6">
              <div className="text-center">
                <p className="font-medium">
                  PDF driver&apos;s license
                </p>

                <a
                  href={signedUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 inline-flex rounded-xl border bg-background px-4 py-2 text-sm font-medium hover:bg-muted"
                >
                  Open document
                </a>
              </div>
            </div>
          ) : (
            <a
              href={signedUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="block overflow-hidden rounded-xl border bg-muted"
            >
              <img
                src={signedUrl}
                alt={title}
                className="max-h-[420px] w-full object-contain"
              />
            </a>
          )}

          <a
            href={signedUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex rounded-xl border px-4 py-2 text-sm font-medium hover:bg-muted"
          >
            Open full size
          </a>
        </div>
      )}
    </div>
  );
}