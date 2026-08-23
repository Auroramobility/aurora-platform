import Link from "next/link";
import { notFound, redirect } from "next/navigation";

import { requireAdmin } from "@/features/admin/lib/authorization";
import { getAdminApplicationDetail } from "@/features/admin/lib/get-admin-application-detail";
import { getAuroraPricing } from "@/lib/vehicles/aurora-pricing";

import {
  ApplicationReviewForm,
  CreatePlanForm,
  DeleteApplicationForm,
  IdentityReviewForm,
} from "../../components/admin-action-form";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

function money(
  currency: string | null | undefined,
  value: number | null | undefined,
) {
  if (value == null) return "—";

  return `${currency ?? "USD"} ${Number(value).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

function Detail({
  label,
  value,
}: {
  label: string;
  value: string | number | null | undefined;
}) {
  return (
    <div className="rounded-2xl border bg-muted/20 p-4">
      <p className="text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground">
        {label}
      </p>

      <p className="mt-2 break-words font-semibold">
        {value == null || value === "" ? "—" : value}
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
  signedUrl: string | null;
}) {
  return (
    <div className="rounded-2xl border p-4">
      <p className="text-sm font-semibold">{title}</p>

      {signedUrl ? (
        <div className="mt-4 overflow-hidden rounded-xl border bg-muted">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={signedUrl}
            alt={title}
            className="max-h-[420px] w-full object-contain"
          />
        </div>
      ) : (
        <div className="mt-4 rounded-xl border border-dashed p-8 text-center text-sm text-muted-foreground">
          {value ? "Document unavailable" : "No document uploaded"}
        </div>
      )}
    </div>
  );
}

export default async function AdminApplicationDetailPage({ params }: Props) {
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
    financingRequest,
    ownershipPlan,
    identityDocuments,
  } = detail;

  const currency = financingRequest?.currency ?? "USD";

  /*
   * Aurora pricing
   *
   * vehicles.price remains the market/reference price.
   * The ownership plan uses the calculated Aurora Access Price.
   */
  const auroraPricing = vehicle
    ? getAuroraPricing(vehicle.price, vehicle.id)
    : null;

  return (
    <main className="mx-auto max-w-6xl space-y-8 p-6">
      {/* ============================================================
          HEADER
      ============================================================ */}

      <div>
        <Link
          href="/admin/ownership"
          className="text-sm text-muted-foreground hover:text-foreground"
        >
          ← Back to Ownership
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

      {/* ============================================================
          APPLICATION DECISION
      ============================================================ */}

      <section className="bg-card rounded-3xl border p-6">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
          <div>
            <h2 className="text-xl font-semibold">Application decision</h2>

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

      {/* ============================================================
          IDENTITY VERIFICATION
      ============================================================ */}

      <section className="bg-card rounded-3xl border p-6">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
          <div>
            <h2 className="text-xl font-semibold">Identity verification</h2>

            <p className="mt-1 text-sm text-muted-foreground">
              Review the customer&apos;s identity documents and verification
              status.
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
          <Detail
            label="Verification status"
            value={profile?.identity_verified ? "Verified" : "Not verified"}
          />

          <Detail
            label="Verified at"
            value={
              profile?.identity_verified_at
                ? new Date(profile.identity_verified_at).toLocaleString()
                : "—"
            }
          />
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

      {/* ============================================================
          CUSTOMER + VEHICLE
      ============================================================ */}

      <section className="grid gap-6 lg:grid-cols-2">
        {/* Customer Information */}

        <div className="bg-card rounded-3xl border p-6">
          <h2 className="text-xl font-semibold">Customer information</h2>

          <div className="mt-5 grid gap-3">
            <Detail label="Full name" value={profile?.full_name} />

            <Detail label="Phone" value={profile?.phone} />

            <Detail label="Country" value={profile?.country} />

            <Detail label="State" value={profile?.state} />

            <Detail label="Address" value={profile?.address} />

            <Detail label="City" value={profile?.city} />

            <Detail label="Postal code" value={profile?.postal_code} />

            <Detail label="Date of birth" value={profile?.date_of_birth} />

            <Detail label="Employment" value={profile?.employment_status} />

            <Detail
              label="Monthly income"
              value={
                profile?.monthly_income != null
                  ? money("USD", Number(profile.monthly_income))
                  : null
              }
            />
          </div>
        </div>

        {/* Vehicle */}

        <div className="bg-card rounded-3xl border p-6">
          <h2 className="text-xl font-semibold">Vehicle</h2>

          {vehicle ? (
            <div className="mt-5 grid gap-3">
              <Detail
                label="Vehicle"
                value={`${vehicle.brand} ${vehicle.model}`}
              />

              <Detail label="Trim" value={vehicle.trim} />

              <Detail
                label="Year"
                value={vehicle.year ? String(vehicle.year) : null}
              />

              <Detail
                label="Market Price"
                value={
                  auroraPricing?.marketPrice != null
                    ? money("USD", auroraPricing.marketPrice)
                    : null
                }
              />

              <Detail
                label="Aurora Access Price"
                value={
                  auroraPricing?.auroraAccessPrice != null
                    ? money("USD", auroraPricing.auroraAccessPrice)
                    : null
                }
              />

              <Detail
                label="Aurora Savings"
                value={
                  auroraPricing?.discountPercent != null
                    ? `${auroraPricing.discountPercent}%`
                    : null
                }
              />

              <Detail
                label="Mileage"
                value={
                  vehicle.mileage != null
                    ? `${Number(vehicle.mileage).toLocaleString()} miles`
                    : null
                }
              />

              <Detail label="Color" value={vehicle.color} />

              <Detail label="Drivetrain" value={vehicle.drivetrain} />

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

      {/* ============================================================
          CUSTOMER FINANCING REQUEST
      ============================================================ */}

      <section className="bg-card rounded-3xl border p-6">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
          <div>
            <h2 className="text-xl font-semibold">
              Customer financing request
            </h2>

            <p className="mt-1 text-sm text-muted-foreground">
              This is the financing/ownership estimate submitted by the
              customer.
            </p>
          </div>

          {financingRequest ? (
            <span className="rounded-full border px-3 py-1 text-xs font-medium">
              Customer request
            </span>
          ) : null}
        </div>

        {!financingRequest ? (
          <div className="mt-5 rounded-2xl border border-dashed p-6 text-sm text-muted-foreground">
            No financing request was submitted for this application.
          </div>
        ) : (
          <>
            {/* Main calculated figures */}

            <div className="mt-6 grid gap-4 md:grid-cols-3">
              <div className="rounded-2xl border bg-muted/30 p-5">
                <p className="text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground">
                  Down payment
                </p>

                <p className="mt-2 text-2xl font-bold">
                  {financingRequest.down_payment_percent}%
                </p>

                <p className="mt-1 text-sm text-muted-foreground">
                  {money(
                    currency,
                    Number(financingRequest.requested_down_payment),
                  )}
                </p>
              </div>

              <div className="rounded-2xl border bg-muted/30 p-5">
                <p className="text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground">
                  Amount financed
                </p>

                <p className="mt-2 text-2xl font-bold">
                  {money(
                    currency,
                    Number(financingRequest.requested_amount_financed),
                  )}
                </p>

                <p className="mt-1 text-sm text-muted-foreground">
                  Customer requested
                </p>
              </div>

              <div className="rounded-2xl border bg-muted/30 p-5">
                <p className="text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground">
                  Estimated monthly
                </p>

                <p className="mt-2 text-2xl font-bold">
                  {money(
                    currency,
                    Number(financingRequest.estimated_monthly_payment),
                  )}
                </p>

                <p className="mt-1 text-sm text-muted-foreground">
                  Estimated only
                </p>
              </div>
            </div>

            {/* Full request details */}

            <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <Detail
                label="Vehicle price"
                value={money(currency, Number(financingRequest.vehicle_price))}
              />

              <Detail
                label="Down payment percentage"
                value={`${financingRequest.down_payment_percent}%`}
              />

              <Detail
                label="Requested down payment"
                value={money(
                  currency,
                  Number(financingRequest.requested_down_payment),
                )}
              />

              <Detail
                label="Amount requested"
                value={money(
                  currency,
                  Number(financingRequest.requested_amount_financed),
                )}
              />

              <Detail
                label="Requested term"
                value={`${financingRequest.requested_term_months} months`}
              />

              <Detail
                label="Estimated monthly payment"
                value={money(
                  currency,
                  Number(financingRequest.estimated_monthly_payment),
                )}
              />

              <Detail
                label="Estimated total paid"
                value={money(
                  currency,
                  Number(financingRequest.estimated_total_paid),
                )}
              />

              <Detail
                label="Submitted"
                value={
                  financingRequest.created_at
                    ? new Date(financingRequest.created_at).toLocaleString()
                    : null
                }
              />
            </div>

            {/* Important operational distinction */}

            <div className="mt-6 rounded-2xl border bg-muted/20 p-5">
              <p className="text-sm font-semibold">Operational note</p>

              <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                These figures represent the customer&apos;s requested
                ownership/financing calculation. They are not financing
                approval, lender selection, payment confirmation, or final
                contractual terms.
              </p>
            </div>
          </>
        )}
      </section>

      {/* ============================================================
          OWNERSHIP PLAN
      ============================================================ */}

      <section className="bg-card rounded-3xl border p-6">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
          <div>
            <h2 className="text-xl font-semibold">Ownership plan</h2>

            <p className="mt-1 text-sm text-muted-foreground">
              Operational ownership plan and final financing information.
            </p>
          </div>

          {ownershipPlan ? (
            <span className="rounded-full border px-3 py-1 text-sm capitalize">
              {ownershipPlan.status}
            </span>
          ) : null}
        </div>

        {!ownershipPlan ? (
          <div className="mt-5">
            {!financingRequest || !vehicle ? (
              <div className="rounded-2xl border border-dashed p-6 text-sm text-muted-foreground">
                The ownership plan cannot be created until the vehicle and
                customer financing request are available.
              </div>
            ) : application.status !== "approved" ? (
              <div className="rounded-2xl border border-dashed p-6">
                <p className="text-sm font-semibold">
                  Ownership plan not yet available
                </p>

                <p className="mt-1 text-sm text-muted-foreground">
                  Approve the application first. Once approved, Aurora can
                  verify the customer&apos;s calculated financing terms and
                  create the draft ownership plan.
                </p>
              </div>
            ) : (
              <CreatePlanForm
                applicationId={application.id}
                vehicleId={vehicle.id}
                vehicleMarketPrice={vehicle.price ?? null}
                customerContributionPercent={
                  financingRequest.down_payment_percent != null
                    ? Number(financingRequest.down_payment_percent)
                    : null
                }
                customerTermMonths={
                  financingRequest.requested_term_months != null
                    ? Number(financingRequest.requested_term_months)
                    : null
                }
              />
            )}
          </div>
        ) : (
          <>
            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <Detail label="Status" value={ownershipPlan.status} />

              <Detail
                label="Created"
                value={
                  ownershipPlan.created_at
                    ? new Date(ownershipPlan.created_at).toLocaleString()
                    : null
                }
              />

              <Detail
                label="Accepted"
                value={
                  ownershipPlan.accepted_at
                    ? new Date(ownershipPlan.accepted_at).toLocaleString()
                    : null
                }
              />

              <Detail
                label="Activated"
                value={
                  ownershipPlan.activated_at
                    ? new Date(ownershipPlan.activated_at).toLocaleString()
                    : null
                }
              />
            </div>

            {/* Final financing terms */}

            <div className="mt-6 rounded-2xl border p-5">
              <h3 className="font-semibold">Final financing terms</h3>

              {!ownershipPlan.financingTerms ? (
                <p className="mt-3 text-sm text-muted-foreground">
                  Final financing terms have not been entered.
                </p>
              ) : (
                <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                  <Detail
                    label="Vehicle price"
                    value={money(
                      ownershipPlan.financingTerms.currency,
                      ownershipPlan.financingTerms.vehicle_price,
                    )}
                  />

                  <Detail
                    label="Down payment"
                    value={money(
                      ownershipPlan.financingTerms.currency,
                      ownershipPlan.financingTerms.down_payment,
                    )}
                  />

                  <Detail
                    label="Amount financed"
                    value={money(
                      ownershipPlan.financingTerms.currency,
                      ownershipPlan.financingTerms.amount_financed,
                    )}
                  />

                  <Detail
                    label="Monthly payment"
                    value={money(
                      ownershipPlan.financingTerms.currency,
                      ownershipPlan.financingTerms.monthly_payment,
                    )}
                  />

                  <Detail
                    label="Term"
                    value={
                      ownershipPlan.financingTerms.term_months != null
                        ? `${ownershipPlan.financingTerms.term_months} months`
                        : null
                    }
                  />

                  <Detail
                    label="Interest rate"
                    value={
                      ownershipPlan.financingTerms.annual_interest_rate != null
                        ? `${ownershipPlan.financingTerms.annual_interest_rate}%`
                        : null
                    }
                  />

                  <Detail
                    label="Total repayment"
                    value={money(
                      ownershipPlan.financingTerms.currency,
                      ownershipPlan.financingTerms.total_financed_repayment,
                    )}
                  />

                  <Detail
                    label="Payment frequency"
                    value={ownershipPlan.financingTerms.payment_frequency}
                  />

                  <Detail
                    label="First payment"
                    value={
                      ownershipPlan.financingTerms.first_payment_date
                        ? new Date(
                            ownershipPlan.financingTerms.first_payment_date,
                          ).toLocaleDateString()
                        : null
                    }
                  />
                </div>
              )}
            </div>
          </>
        )}
      </section>

      <section className="bg-card rounded-3xl border border-red-200 p-6 dark:border-red-900/50">
        <div>
          <h2 className="text-xl font-semibold">Application management</h2>

          <p className="mt-1 text-sm text-muted-foreground">
            Destructive administrative actions for this application.
          </p>
        </div>
      </section>
    </main>
  );
}
