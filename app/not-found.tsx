import Link from "next/link";
import { Compass } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-[60vh] max-w-lg flex-col items-center justify-center p-8 text-center">
      <Compass className="h-10 w-10 text-muted-foreground" />

      <h1 className="mt-4 text-2xl font-semibold">Page not found</h1>

      <p className="mt-2 text-sm text-muted-foreground">
        The page you're looking for doesn't exist or may have moved.
      </p>

      <div className="mt-6 flex gap-3">
        <Button asChild>
          <Link href="/">Go home</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/vehicles">Browse vehicles</Link>
        </Button>
      </div>
    </main>
  );
}
