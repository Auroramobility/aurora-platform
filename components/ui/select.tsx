type Option = {
  label: string;
  value: string;
};

type SelectProps = {
  name: string;
  defaultValue?: string;
  options: Option[];
};

export function Select({ name, defaultValue, options }: SelectProps) {
  return (
    <select
      name={name}
      defaultValue={defaultValue}
      className="w-full rounded-xl border border-border bg-surface px-4 py-3 text-foreground transition focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
    >
      <option value="">Select an option</option>

      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
}
