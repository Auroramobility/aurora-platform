/**
 * Hero backdrop for the homepage. Two layers, both purely decorative:
 *
 * 1. A faint technical grid — reads as engineering precision (automotive,
 *    fintech dashboards) rather than decoration.
 * 2. A single, restrained aurora glow (teal → violet) behind the
 *    headline — the brand signature, dialed back so it reads as premium
 *    ambience rather than a loud gradient.
 *
 * Deliberately more subdued than a typical marketing-site hero: the
 * brief calls for Tesla-grade simplicity and fintech trust, so the
 * background stays quiet and lets the type and whitespace carry it.
 */
export function HeroBackground() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 overflow-hidden"
    >
      <div
        className="absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage:
            "linear-gradient(to right, hsl(var(--foreground)) 1px, transparent 1px), linear-gradient(to bottom, hsl(var(--foreground)) 1px, transparent 1px)",
          backgroundSize: "56px 56px",
          maskImage:
            "radial-gradient(ellipse 70% 60% at 50% 30%, black 40%, transparent 100%)",
        }}
      />
      <div
        className="absolute left-1/2 top-[-15%] h-[50rem] w-[50rem] -translate-x-1/2 animate-aurora-drift rounded-full opacity-20 blur-3xl"
        style={{
          background:
            "radial-gradient(circle at center, #2DD4BF 0%, #7C6FF0 45%, transparent 70%)",
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/60 to-background" />
    </div>
  );
}
