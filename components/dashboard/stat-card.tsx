type StatCardProps = {
  title: string;
  value: string;
  description: string;
};

export function StatCard({ title, value, description }: StatCardProps) {
  return (
    <div className="rounded-xl border bg-white p-6 shadow-sm">
      <p className="text-sm text-gray-500">{title}</p>

      <h3 className="mt-2 text-3xl font-bold">{value}</h3>

      <p className="mt-3 text-sm text-gray-600">{description}</p>
    </div>
  );
}
