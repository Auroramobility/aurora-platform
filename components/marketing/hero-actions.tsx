import Link from "next/link";

import { Button } from "@/components/ui/button";

export function HeroActions() {
  return (
    <div className="flex flex-wrap gap-4">
      <Button size="lg" asChild>
        <Link href="/vehicles">Explore Vehicles</Link>
      </Button>

      <Button variant="outline" size="lg" asChild>
        <Link href="#ownership">How Aurora Works</Link>
      </Button>
    </div>
  );
}
