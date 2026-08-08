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
      variant={selected ? "default" : "outline"}
      disabled={!selected && isFull}
      onClick={(event) => {
        event.preventDefault();
        event.stopPropagation();
        toggle(vehicleId);
      }}
      aria-pressed={selected}
    >
      {selected ? "Added to compare" : isFull ? "Compare full" : `Compare${count ? ` (${count})` : ""}`}
    </Button>
  );
}
