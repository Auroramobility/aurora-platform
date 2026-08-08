import Link from "next/link";

const brands = [
  "Tesla",
  "BYD",
  "Lucid",
  "Rivian",
  "NIO",
  "Polestar",
  "BMW",
  "Hyundai",
  "Ford",
  "Mercedes-Benz",
  "Kia",
  "Volvo",
];

export function BrandShowcase() {
  return (
    <section className="border-y bg-background py-24">
      <div className="mx-auto max-w-7xl px-8">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm uppercase tracking-[0.3em] text-muted-foreground">
            Explore Brands
          </p>

          <h2 className="mt-4 text-4xl font-bold tracking-tight md:text-5xl">
            The world's leading
            <span className="block text-primary">
              electric manufacturers.
            </span>
          </h2>

          <p className="mt-6 text-lg leading-8 text-muted-foreground">
            Discover electric vehicles from some of the most innovative
            automotive manufacturers around the world.
          </p>
        </div>

        <div className="mt-16 grid grid-cols-2 overflow-hidden rounded-3xl border bg-muted/20 sm:grid-cols-3 lg:grid-cols-4">
          {brands.map((brand, index) => (
            <Link
              key={brand}
              href={`/vehicles?brand=${encodeURIComponent(brand)}`}
              className="group flex min-h-40 flex-col items-center justify-center border-b border-r p-8 transition-all duration-300 hover:bg-muted"
            >
              <span className="text-2xl font-bold tracking-tight transition-transform duration-300 group-hover:scale-105 md:text-3xl">
                {brand}
              </span>

              <span className="mt-4 text-xs uppercase tracking-[0.2em] text-muted-foreground transition-colors group-hover:text-primary">
                Explore vehicles
              </span>
            </Link>
          ))}
        </div>

        <div className="mt-10 text-center">
          <Link
            href="/vehicles"
            className="text-sm font-semibold transition-colors hover:text-primary"
          >
            View all electric vehicles →
          </Link>
        </div>
      </div>
    </section>
  );
}