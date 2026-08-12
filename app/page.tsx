import { Navbar } from "@/components/marketing/navbar";
import { HeroCarousel } from "@/components/marketing/hero-carousel";
import { WhyAurora } from "@/components/marketing/why-aurora";
import { HowAuroraWorks } from "@/components/marketing/how-aurora-works";
import { FeaturedVehicles } from "@/components/marketing/featured-vehicles";
import { ComparisonPreview } from "@/components/marketing/comparison-preview";
import { OwnershipJourney } from "@/components/marketing/ownership-journey";
import { BrandShowcase } from "@/components/marketing/brand-showcase";
import { CTA } from "@/components/marketing/cta";
import { Footer } from "@/components/marketing/footer";

export default function HomePage() {
  return (
    <>
      <Navbar />

      <main>
        <HeroCarousel />

        <WhyAurora />

        <HowAuroraWorks />

        <FeaturedVehicles />

        <ComparisonPreview />

        <OwnershipJourney />

        <BrandShowcase />

        <CTA />
      </main>

      <Footer />
    </>
  );
}
