type StatCardProps = {
  title: string;
  value: string | number;
  subtitle?: string;
};

export function StatCard({ title, value, subtitle }: StatCardProps) {
  return (
    <div className="rounded-xl border border-border bg-surface p-6">
      <p className="text-sm text-muted-foreground">{title}</p>

      <h2 className="mt-2 text-3xl font-bold">{value}</h2>

      {subtitle && (
        <p className="mt-2 text-sm text-muted-foreground">{subtitle}</p>
      )}
    </div>
  );
}
