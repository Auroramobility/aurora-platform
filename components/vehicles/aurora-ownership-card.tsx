import Link from "next/link";
import { Button } from "@/components/ui/button";

type Props = {
  price: number;
  vehicleId?: string;
};

export function AuroraOwnershipCard({ price, vehicleId }: Props) {
  const upfront = Math.round(price * 0.3);
  const financed = price - upfront;

  // Temporary estimate until we build the calculator
  const monthly = Math.round(financed / 84);

  return (
    <div className="bg-card rounded-3xl border p-8 shadow-sm">
      <p className="text-sm font-semibold uppercase tracking-wider text-primary">
        Aurora Ownership Plan
      </p>

      <h2 className="mt-3 text-3xl font-bold">Own Instead of Finance</h2>

      <div className="mt-8 space-y-5 text-sm">
        <div>
          <p className="font-medium">Vehicle Price</p>
          <p className="mt-2 text-2xl font-bold">${price.toLocaleString()}</p>
        </div>

        <div className="border-t py-5">
          <p className="font-medium">Initial Ownership Contribution (30%)</p>
          <p className="mt-2 text-2xl font-bold">${upfront.toLocaleString()}</p>
        </div>

        <div className="border-t py-5">
          <p className="font-medium">Remaining Ownership Balance</p>
          <p className="mt-2 text-2xl font-bold">
            ${financed.toLocaleString()}
          </p>
        </div>

        <div className="border-t py-5">
          <p className="font-medium">Estimated Monthly Contribution</p>
          <p className="mt-2 text-2xl font-bold">
            ${monthly}
            <span className="text-lg font-normal">/month</span>
          </p>
        </div>

        <div className="border-t py-5">
          <p className="font-medium">Ownership Timeline</p>
          <p className="mt-2 text-2xl font-bold">84 Months</p>
        </div>

        <div className="border-t py-5">
          <p className="font-medium">Ownership Starts At</p>
          <p className="mt-2 text-2xl font-bold">30%</p>
        </div>
      </div>

      {vehicleId ? (
        <Button asChild className="mt-8 w-full" size="lg">
          <Link href={`/applications/new?vehicle=${vehicleId}`}>Start Ownership Journey</Link>
        </Button>
      ) : null}

      <Button variant="outline" className="mt-3 w-full">
        Compare Vehicle
      </Button>

      <p className="mt-6 text-xs leading-6 text-muted-foreground">
        Every monthly contribution increases your ownership equity until the
        vehicle is fully yours.
      </p>
    </div>
  );
}
