const stats = [
  {
    value: "100+",
    label: "Vehicles",
  },
  {
    value: "25+",
    label: "Global Brands",
  },
  {
    value: "Transparent",
    label: "Ownership",
  },
  {
    value: "AI Powered",
    label: "Guidance",
  },
];

export function HeroStats() {
  return (
    <div className="grid grid-cols-2 gap-8 pt-8 md:grid-cols-4">
      {stats.map((item) => (
        <div key={item.label}>
          <div className="text-2xl font-bold">{item.value}</div>

          <div className="text-sm text-muted-foreground">{item.label}</div>
        </div>
      ))}
    </div>
  );
}
