import { ArrowDown, CheckCircle2, Circle, Clock3, XCircle } from "lucide-react";

import type { ApplicationStatus } from "@/features/applications/types/application";
import {
  APPLICATION_STATUS_CONFIG,
  APPLICATION_TIMELINE,
} from "@/features/applications/types/status";
import { ContinueToPaymentButton } from "@/components/applications/continue-to-payment-button";

function formatDate(value: string | null) {
  if (!value) return null;

  return new Date(value).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

type Props = {
  applicationId: string;
  status: ApplicationStatus;
  submittedAt: string | null;
  approvedAt: string | null;
};

export function ApplicationStatusTimeline({
  applicationId,
  status,
  submittedAt,
  approvedAt,
}: Props) {
  const config = APPLICATION_STATUS_CONFIG[status];
  const terminal = config.terminal;

  return (
    <section className="bg-card rounded-3xl border p-6 sm:p-8">
      {/* Header */}
      <div className="mb-7">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">
          Application status
        </p>

        <h2 className="mt-2 text-2xl font-bold">
          Where you are in the journey
        </h2>

        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
          {config.description}
        </p>
      </div>

      {/* Timeline */}
      <div className="space-y-6">
        {APPLICATION_TIMELINE.map((step, index) => {
          const stepPosition =
            APPLICATION_STATUS_CONFIG[step.status].timelinePosition;

          const completed = !terminal && config.timelinePosition > stepPosition;

          const current = !terminal && status === step.status;

          const isApprovedStep = step.status === "approved";

          return (
            <div key={step.status} className="flex gap-4">
              {/* Timeline marker */}
              <div className="flex flex-col items-center">
                {completed ? (
                  <CheckCircle2 className="h-6 w-6 shrink-0 text-green-500" />
                ) : current ? (
                  <Clock3 className="h-6 w-6 shrink-0 text-primary" />
                ) : (
                  <Circle className="h-6 w-6 shrink-0 text-muted-foreground" />
                )}

                {index < APPLICATION_TIMELINE.length - 1 ? (
                  <div className="mt-2 h-full min-h-8 w-px bg-border" />
                ) : null}
              </div>

              {/* Timeline content */}
              <div className="pb-2">
                <p className="font-semibold">
                  {isApprovedStep ? "Ownership approved" : step.title}
                </p>

                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                  {isApprovedStep
                    ? "Your application has been approved and can move into ownership planning after your down payment."
                    : step.description}
                </p>

                {step.status === "pending" && submittedAt ? (
                  <p className="mt-2 text-xs text-muted-foreground">
                    Submitted {formatDate(submittedAt)}
                  </p>
                ) : null}

                {isApprovedStep && approvedAt && status === "approved" ? (
                  <p className="mt-2 text-xs text-muted-foreground">
                    Approved {formatDate(approvedAt)}
                  </p>
                ) : null}
              </div>
            </div>
          );
        })}
      </div>

      {/* Down payment transition */}
      {!terminal && status === "approved" ? (
        <div className="mt-7">
          {/* Arrow from approval into payment */}
          <div className="flex justify-center py-2">
            <div className="flex flex-col items-center text-primary">
              <div className="h-6 w-px bg-primary/30" />
              <ArrowDown className="h-5 w-5" />
            </div>
          </div>

          {/* Payment CTA */}
          <div className="mt-4 rounded-2xl border border-primary/20 bg-primary/[0.04] p-5 sm:p-6">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.14em] text-primary">
                Next step
              </p>

              <h3 className="mt-2 text-xl font-bold">
                Message Aurora for your down payment
              </h3>

              <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
                Your application has been approved. When you&apos;re ready to
                arrange your down payment, message Aurora and we&apos;ll guide
                you through the next step.
              </p>
            </div>

            <ContinueToPaymentButton applicationId={applicationId} />
          </div>
        </div>
      ) : null}

      {/* Terminal state */}
      {terminal ? (
        <div className="mt-6 flex gap-3 rounded-2xl border border-rose-500/30 bg-rose-500/10 p-4">
          <XCircle className="h-5 w-5 shrink-0 text-rose-500" />

          <div>
            <p className="font-semibold">{config.label} application</p>

            <p className="mt-1 text-sm text-muted-foreground">
              {status === "rejected"
                ? "Aurora was unable to approve this application. Check your messages or contact the Aurora team for next steps."
                : "This application is no longer active. You can start a new application for an eligible vehicle."}
            </p>
          </div>
        </div>
      ) : null}
    </section>
  );
}
