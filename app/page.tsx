import { Navbar } from "@/components/marketing/navbar";
import { HeroCarousel } from "@/components/marketing/hero-carousel";
import { getVehicles } from "@/features/vehicles/lib/get-vehicles";
import { getAuroraPricing } from "@/lib/vehicles/aurora-pricing";
import { WhyAurora } from "@/components/marketing/why-aurora";
import { DifferentWayToOwn } from "@/components/marketing/different-way-to-own";
import { AuroraPromise } from "@/components/marketing/aurora-promise";
import { FeaturedVehicles } from "@/components/marketing/featured-vehicles";
import { BrandShowcase } from "@/components/marketing/brand-showcase";
import { OwnershipJourney } from "@/components/marketing/ownership-journey";
import { Testimonials } from "@/components/marketing/testimonials";
import { ComparisonPreview } from "@/components/marketing/comparison-preview";
import { FAQ } from "@/components/marketing/faq";
import { CTA } from "@/components/marketing/cta";
import { Footer } from "@/components/marketing/footer";

export default async function HomePage() {
  // Show a real, representative vehicle's pricing in the hero instead of
  // a placeholder — same getAuroraPricing() logic used on vehicle pages.
  const vehicles = await getVehicles({ sort: "price-low" });
  const heroVehicle = vehicles.find((vehicle) => vehicle.price != null);
  const heroPricing = heroVehicle
    ? getAuroraPricing(heroVehicle.price, heroVehicle.id)
    : { marketPrice: null, auroraAccessPrice: null, discountPercent: null };

  return (
    <>
      <Navbar />

      <main>
        {/* 01 */}
        <HeroCarousel
          pricing={{
            marketPrice: heroPricing.marketPrice,
            accessPrice: heroPricing.auroraAccessPrice,
            discountPercent: heroPricing.discountPercent,
          }}
        />

        {/* 02 */}
        <WhyAurora />

        {/* 03 */}
        <FeaturedVehicles />

        {/* 04 */}
        <DifferentWayToOwn />
        {/* 05 */}
        <AuroraPromise />

        {/* 06 */}
        <BrandShowcase />

        {/* 08 */}
        <OwnershipJourney />

        {/* 09 */}
        <Testimonials />

        {/* 10 */}
        <ComparisonPreview />

        {/* 11 */}
        <FAQ />

        {/* 12 */}
        <CTA />
      </main>

      {/* 13 */}
      <Footer />
    </>
  );
}
