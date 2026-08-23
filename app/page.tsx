import { Navbar } from "@/components/marketing/navbar";
import { HeroCarousel } from "@/components/marketing/hero-carousel";
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

export default function HomePage() {
  return (
    <>
      <Navbar />

      <main>
        {/* 01 */}
        <HeroCarousel />

        {/* 02 */}
        <WhyAurora />

        {/* 03 */}
        <DifferentWayToOwn />

        {/* 04 */}
        <FeaturedVehicles />

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
