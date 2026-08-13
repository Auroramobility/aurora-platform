type StatCardProps = {
  title: string;
  value: string | number;
  subtitle?: string;
};

export function StatCard({ title, value, subtitle }: StatCardProps) {
  return (
    <div className="aurora-card group rounded-2xl border border-border bg-surface p-6 shadow-sm">
      {/* Top accent line */}
      <div className="aurora-gradient h-0.5 w-12 rounded-full mb-4 opacity-80 group-hover:opacity-100 transition-opacity" />

      <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
        {title}
      </p>

      <h2 className="mt-2 text-3xl font-bold aurora-gradient-text">{value}</h2>

      {subtitle && (
        <p className="mt-2 text-sm text-muted-foreground">{subtitle}</p>
      )}
    </div>
  );
}
