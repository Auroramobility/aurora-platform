type StatCardProps = {
  title: string;
  value: string | number;
  subtitle?: string;
  tone?: "blue" | "green" | "purple" | "amber";
};

const tones = {
  blue: {
    card: "border-blue-700 bg-blue-100 dark:border-blue-500/20 dark:bg-blue-500/[0.08]",
    accent: "bg-blue-600",
    label: "text-blue-800 dark:text-blue-300",
    value: "text-blue-950 dark:text-blue-100",
    subtitle: "text-blue-800/75 dark:text-blue-300/70",
  },

  green: {
    card: "border-emerald-1000 bg-emerald-100 dark:border-emerald-500/20 dark:bg-emerald-500/[0.08]",
    accent: "bg-emerald-600",
    label: "text-emerald-800 dark:text-emerald-300",
    value: "text-emerald-950 dark:text-emerald-100",
    subtitle: "text-emerald-800/75 dark:text-emerald-300/70",
  },

  purple: {
    card: "border-violet-1000 bg-violet-100 dark:border-violet-500/20 dark:bg-violet-500/[0.08]",
    accent: "bg-violet-600",
    label: "text-violet-800 dark:text-violet-300",
    value: "text-violet-950 dark:text-violet-100",
    subtitle: "text-violet-800/75 dark:text-violet-300/70",
  },

  amber: {
    card: "border-amber-700 bg-amber-100 dark:border-amber-500/20 dark:bg-amber-500/[0.08]",
    accent: "bg-amber-600",
    label: "text-amber-800 dark:text-amber-300",
    value: "text-amber-950 dark:text-amber-100",
    subtitle: "text-amber-800/75 dark:text-amber-300/70",
  },
};

export function StatCard({
  title,
  value,
  subtitle,
  tone = "blue",
}: StatCardProps) {
  const colors = tones[tone];

  return (
    <div
      className={`group relative overflow-hidden rounded-2xl border p-6 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-lg ${colors.card}`}
    >
      <div
        className={`mb-5 h-1 w-12 rounded-full ${colors.accent} transition-all duration-200 group-hover:w-20`}
      />

      <p
        className={`text-xs font-bold uppercase tracking-[0.16em] ${colors.label}`}
      >
        {title}
      </p>

      <p className={`mt-3 text-4xl font-bold tracking-tight ${colors.value}`}>
        {value}
      </p>

      {subtitle ? (
        <p className={`mt-2 text-sm ${colors.subtitle}`}>{subtitle}</p>
      ) : null}
    </div>
  );
}
