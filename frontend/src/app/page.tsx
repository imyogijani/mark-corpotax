import { DynamicCTASection } from "@/components/DynamicCTASection";
import { DynamicHeroSection } from "@/components/DynamicHomeHero";
import { DynamicAboutSection } from "@/components/DynamicAboutSection";
import { DynamicFeaturesSection } from "@/components/DynamicFeaturesSection";
import { DynamicServicesSection } from "@/components/DynamicServicesSection";
import { DynamicTestimonialsSection } from "@/components/DynamicTestimonialsSection";
import { DynamicTeamSection } from "@/components/DynamicTeamSection";
import { DynamicBlogSection } from "@/components/DynamicBlogSection";

export default function Home() {
  return (
    <div className="home-page">
      {/* Dynamic Hero Section */}
      <DynamicHeroSection />

      {/* Dynamic About Section */}
      <DynamicAboutSection />

      {/* Dynamic Features Section */}
      <DynamicFeaturesSection />

      {/* Dynamic Services Preview Section */}
      <DynamicServicesSection />

      {/* Dynamic Testimonials Section */}
      <DynamicTestimonialsSection />

      {/* Dynamic Team Section */}
      <DynamicTeamSection />

      {/* Dynamic Blog Section */}
      <DynamicBlogSection />

      {/* Newsletter/CTA Section */}
      <DynamicCTASection />
    </div>
  );
}
