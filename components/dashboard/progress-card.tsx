type Props = {
  progress: number;
};

export function ProgressCard({ progress }: Props) {
  return (
    <div className="rounded-2xl border border-border bg-surface p-6">
      <h2 className="text-xl font-semibold">Financing Progress</h2>

      <p className="mt-2 text-muted-foreground">
        You're making great progress.
      </p>

      <div className="mt-6 h-3 overflow-hidden rounded-full bg-secondary">
        <div
          className="h-full rounded-full bg-primary transition-all"
          style={{ width: `${progress}%` }}
        />
      </div>

      <p className="mt-3 text-sm text-muted-foreground">{progress}% Complete</p>
    </div>
  );
}
