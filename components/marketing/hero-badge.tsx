import { Sparkles } from "lucide-react";

export function HeroBadge() {
  return (
    <div className="inline-flex items-center gap-2 rounded-full border bg-background/70 px-4 py-2 text-sm backdrop-blur">
      <Sparkles className="h-4 w-4 text-primary" />
      <span>The Future of Electric Vehicle Ownership</span>
    </div>
  );
}
