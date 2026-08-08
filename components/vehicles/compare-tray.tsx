"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useCompareSelection } from "@/features/vehicles/state/use-compare-selection";

export function CompareTray() {
  const { ids, count, max, clear } = useCompareSelection();

  if (ids.length === 0) return null;

  const compareHref = `/compare?ids=${ids.join(",")}`;

  return (
    <div className="sticky bottom-4 z-20 mt-8 flex flex-col gap-3 rounded-2xl border bg-background/95 p-4 shadow-xl backdrop-blur md:flex-row md:items-center md:justify-between">
      <div>
        <p className="font-semibold">Compare vehicles</p>
        <p className="text-sm text-muted-foreground">
          {count} of {max} selected. Choose at least two to compare.
        </p>
      </div>

      <div className="flex items-center gap-2">
        <Button type="button" variant="ghost" onClick={clear}>
          Clear
        </Button>

        {count >= 2 ? (
          <Button asChild>
            <Link href={compareHref}>Compare selected</Link>
          </Button>
        ) : (
          <Button disabled>Compare selected</Button>
        )}
      </div>
    </div>
  );
}
