"use client";

import { Button } from "@/components/ui/button";
import { useCompareSelection } from "@/features/vehicles/state/use-compare-selection";

type Props = {
  vehicleId: string;
};

export function CompareVehicleButton({ vehicleId }: Props) {
  const { count, isFull, isSelected, toggle } = useCompareSelection();
  const selected = isSelected(vehicleId);

  return (
    <Button
      type="button"
      variant="outline"
      disabled={!selected && isFull}
      onClick={(event) => {
        event.preventDefault();
        event.stopPropagation();
        toggle(vehicleId);
      }}
      aria-pressed={selected}
      className={[
        "w-full rounded-xl px-4 py-3 text-sm font-semibold transition-all duration-200",
        selected
          ? "border-primary bg-primary/10 text-primary shadow-sm hover:bg-primary/15 hover:text-primary"
          : isFull
            ? "cursor-not-allowed border-border bg-muted/40 text-muted-foreground opacity-70"
            : "border-primary/20 bg-primary/[0.04] text-primary hover:border-primary/40 hover:bg-primary/10 hover:text-primary",
      ].join(" ")}
    >
      {selected
        ? "✓ Added to compare"
        : isFull
          ? "Compare full"
          : `Compare${count ? ` (${count})` : ""}`}
    </Button>
  );
}
