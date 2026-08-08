type Props = {
  children: React.ReactNode;
};

export function CardSection({ children }: Props) {
  return (
    <section className="rounded-2xl border border-border bg-surface p-6 shadow-sm">
      {children}
    </section>
  );
}
