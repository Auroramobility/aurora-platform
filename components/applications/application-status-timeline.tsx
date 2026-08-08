import { CheckCircle2, Circle, Clock3, XCircle } from "lucide-react";
import type { ApplicationStatus } from "@/features/applications/types/application";
import {
  APPLICATION_STATUS_CONFIG,
  APPLICATION_TIMELINE,
} from "@/features/applications/types/status";

function formatDate(value: string | null) {
  if (!value) return null;
  return new Date(value).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

type Props = {
  status: ApplicationStatus;
  submittedAt: string | null;
  approvedAt: string | null;
};

export function ApplicationStatusTimeline({ status, submittedAt, approvedAt }: Props) {
  const config = APPLICATION_STATUS_CONFIG[status];
  const terminal = config.terminal;

  return (
    <section className="rounded-3xl border bg-card p-6 sm:p-8">
      <div className="mb-7">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">Application status</p>
        <h2 className="mt-2 text-2xl font-bold">Where you are in the journey</h2>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">{config.description}</p>
      </div>

      <div className="space-y-6">
        {APPLICATION_TIMELINE.map((step, index) => {
          const stepPosition = APPLICATION_STATUS_CONFIG[step.status].timelinePosition;
          const completed = !terminal && config.timelinePosition > stepPosition;
          const current = !terminal && status === step.status;

          return (
            <div key={step.status} className="flex gap-4">
              <div className="flex flex-col items-center">
                {completed ? (
                  <CheckCircle2 className="h-6 w-6 shrink-0 text-green-500" />
                ) : current ? (
                  <Clock3 className="h-6 w-6 shrink-0 text-primary" />
                ) : (
                  <Circle className="h-6 w-6 shrink-0 text-muted-foreground" />
                )}
                {index < APPLICATION_TIMELINE.length - 1 ? <div className="mt-2 h-full min-h-8 w-px bg-border" /> : null}
              </div>
              <div className="pb-2">
                <p className="font-semibold">{step.title}</p>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{step.description}</p>
                {step.status === "pending" && submittedAt ? (
                  <p className="mt-2 text-xs text-muted-foreground">Submitted {formatDate(submittedAt)}</p>
                ) : null}
                {step.status === "approved" && approvedAt && status === "approved" ? (
                  <p className="mt-2 text-xs text-muted-foreground">Approved {formatDate(approvedAt)}</p>
                ) : null}
              </div>
            </div>
          );
        })}
      </div>

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
