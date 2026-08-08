type Props = {
  title: string;
  description?: string;
};

export function SectionTitle({ title, description }: Props) {
  return (
    <div className="mb-6">
      <h2 className="text-xl font-semibold">{title}</h2>

      {description && (
        <p className="mt-1 text-sm text-muted-foreground">{description}</p>
      )}
    </div>
  );
}
