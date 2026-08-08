type ProgressCardProps = {
  progress: number;
};

export function ProgressCard({ progress }: ProgressCardProps) {
  return (
    <div className="rounded-xl border border-border bg-surface p-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Profile Completion</h2>

        <span className="font-bold">{progress}%</span>
      </div>

      <div className="mt-5 h-3 w-full rounded-full bg-muted">
        <div
          className="h-3 rounded-full bg-primary transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>

      <p className="mt-4 text-sm text-muted-foreground">
        Complete your profile to unlock financing and vehicle recommendations.
      </p>
    </div>
  );
}
