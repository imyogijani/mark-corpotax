"use client";

import { useEffect, useState } from "react";
import { contentService } from "@/lib/content-service";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  Briefcase,
  HandCoins,
  Landmark,
  PiggyBank,
  ShieldHalf,
  University,
  ArrowRight,
  FileText,
  Building2,
  Calculator,
  CreditCard,
  TrendingUp,
} from "lucide-react";
import { DynamicCTASection } from "@/components/DynamicCTASection";

// Default services fallback
const defaultServices = [
  {
    slug: "msme-project-finance",
    icon: "Building2",
    title: "MSME Project Finance",
    description:
      "Complete project financing solutions for small and medium enterprises to fuel business growth and expansion.",
  },
  {
    slug: "working-capital",
    icon: "TrendingUp",
    title: "Working Capital Solutions",
    description:
      "Flexible working capital loans to manage day-to-day operations and maintain healthy cash flow.",
  },
  {
    slug: "home-mortgage-loans",
    icon: "Landmark",
    title: "Home & Mortgage Loans",
    description:
      "Affordable home loans with competitive interest rates to help you realize your dream of owning a home.",
  },
  {
    slug: "tax-planning",
    icon: "Calculator",
    title: "Taxation Services",
    description:
      "Expert tax planning and compliance services to minimize liabilities and maximize savings.",
  },
  {
    slug: "business-loans",
    icon: "CreditCard",
    title: "Business Loans",
    description:
      "Quick and hassle-free business loans to support your entrepreneurial journey and business goals.",
  },
  {
    slug: "government-schemes",
    icon: "ShieldHalf",
    title: "Government Schemes",
    description:
      "Assistance with various government loan schemes and subsidies for eligible businesses and individuals.",
  },
];

// Icon mapping
const iconComponents: Record<string, React.ReactNode> = {
  Building2: <Building2 className="h-10 w-10 text-primary" />,
  TrendingUp: <TrendingUp className="h-10 w-10 text-primary" />,
  Landmark: <Landmark className="h-10 w-10 text-primary" />,
  Calculator: <Calculator className="h-10 w-10 text-primary" />,
  CreditCard: <CreditCard className="h-10 w-10 text-primary" />,
  ShieldHalf: <ShieldHalf className="h-10 w-10 text-primary" />,
  PiggyBank: <PiggyBank className="h-10 w-10 text-primary" />,
  HandCoins: <HandCoins className="h-10 w-10 text-primary" />,
  FileText: <FileText className="h-10 w-10 text-primary" />,
  University: <University className="h-10 w-10 text-primary" />,
  Briefcase: <Briefcase className="h-10 w-10 text-primary" />,
};

const largeIconComponents: Record<string, React.ReactNode> = {
  Briefcase: <Briefcase className="text-primary" size={64} />,
  HandCoins: <HandCoins className="text-primary" size={64} />,
  ShieldHalf: <ShieldHalf className="text-primary" size={64} />,
};

export default function ServicesPage() {
  const [heroContent, setHeroContent] = useState<Record<string, any>>({});
  const [statsContent, setStatsContent] = useState<Record<string, any>>({});
  const [servicesIntro, setServicesIntro] = useState<Record<string, any>>({});
  const [services, setServices] = useState(defaultServices);
  const [whyChooseContent, setWhyChooseContent] = useState<Record<string, any>>(
    {}
  );
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        // Use contentService to fetch from backend API
        const data = await contentService.getPageContent("services");

        if (data.hero) setHeroContent(data.hero);
        if (data.stats) setStatsContent(data.stats);
        if (data.services_intro) setServicesIntro(data.services_intro);
        if (data.why_choose) setWhyChooseContent(data.why_choose);

        // Transform services from flat keys to array
        if (data.services_list) {
          const transformedServices = [];
          for (let i = 1; i <= 6; i++) {
            const service = {
              slug:
                data.services_list[`service_${i}_slug`] ||
                defaultServices[i - 1]?.slug ||
                `service-${i}`,
              icon:
                data.services_list[`service_${i}_icon`] ||
                defaultServices[i - 1]?.icon ||
                "Briefcase",
              title:
                data.services_list[`service_${i}_title`] ||
                defaultServices[i - 1]?.title ||
                `Service ${i}`,
              description:
                data.services_list[`service_${i}_description`] ||
                defaultServices[i - 1]?.description ||
                "",
            };
            if (service.title) transformedServices.push(service);
          }
          if (transformedServices.length > 0) setServices(transformedServices);
        }
      } catch (error) {
        console.error("Error fetching services content:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchContent();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="services-page-container animate-fade-in">
      {/* Hero Section */}
      <section className="relative py-16 md:py-24 bg-gradient-to-br from-[#eaf6fa] via-[#f7fbfd] to-[#f2f8fc] border-b">
        <div className="container mx-auto px-4 flex flex-col items-center text-center gap-4">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-2">
            {heroContent.title || "Our Financial Services"}
          </h1>
          <p className="max-w-2xl text-lg md:text-xl text-muted-foreground mb-6">
            {heroContent.subtitle ||
              "A complete suite of financial solutions designed to help you achieve your goals at every stage of life."}
          </p>
          <div className="flex flex-col md:flex-row items-center gap-8 w-full justify-center">
            <div className="flex flex-col items-center bg-white rounded-xl shadow-lg p-8 gap-4 w-full max-w-xs">
              {largeIconComponents[statsContent.stat_1_icon || "Briefcase"]}
              <div>
                <span className="block text-3xl font-bold text-primary">
                  {statsContent.stat_1_value || "500+"}
                </span>
                <span className="block text-muted-foreground">
                  {statsContent.stat_1_label || "Projects Funded"}
                </span>
              </div>
            </div>
            <div className="flex flex-col items-center bg-white rounded-xl shadow-lg p-8 gap-4 w-full max-w-xs">
              {largeIconComponents[statsContent.stat_2_icon || "HandCoins"]}
              <div>
                <span className="block text-3xl font-bold text-primary">
                  {statsContent.stat_2_value || "₹50Cr+"}
                </span>
                <span className="block text-muted-foreground">
                  {statsContent.stat_2_label || "Loans Facilitated"}
                </span>
              </div>
            </div>
            <div className="flex flex-col items-center bg-white rounded-xl shadow-lg p-8 gap-4 w-full max-w-xs">
              {largeIconComponents[statsContent.stat_3_icon || "ShieldHalf"]}
              <div>
                <span className="block text-3xl font-bold text-primary">
                  {statsContent.stat_3_value || "100%"}
                </span>
                <span className="block text-muted-foreground">
                  {statsContent.stat_3_label || "Client Satisfaction"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Introduction */}
      {(servicesIntro.tagline ||
        servicesIntro.title ||
        servicesIntro.description) && (
        <section className="py-12 md:py-16 bg-background">
          <div className="container mx-auto px-4 text-center">
            {servicesIntro.tagline && (
              <span className="text-primary font-semibold uppercase tracking-wider">
                {servicesIntro.tagline}
              </span>
            )}
            {servicesIntro.title && (
              <h2 className="text-3xl md:text-4xl font-bold mt-2 mb-4">
                {servicesIntro.title}
              </h2>
            )}
            {servicesIntro.description && (
              <p className="max-w-3xl mx-auto text-lg text-muted-foreground">
                {servicesIntro.description}
              </p>
            )}
          </div>
        </section>
      )}

      {/* Services Grid Section */}
      <section className="services-grid-section py-16 md:py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service) => (
              <Card
                key={service.slug}
                className="service-card flex flex-col text-center bg-secondary/20 border-border/40 hover:bg-secondary/40 hover:-translate-y-1 transition-all duration-300 overflow-hidden"
              >
                <div className="flex items-center justify-center h-32 w-full bg-primary/10">
                  {iconComponents[service.icon] || (
                    <Briefcase className="h-10 w-10 text-primary" />
                  )}
                </div>
                <CardHeader className="items-center">
                  <div className="service-icon-wrapper mx-auto p-4 rounded-full w-fit -mt-12 bg-card border-4 border-card z-10">
                    {iconComponents[service.icon] || (
                      <Briefcase className="h-10 w-10 text-primary" />
                    )}
                  </div>
                  <CardTitle>{service.title}</CardTitle>
                </CardHeader>
                <CardContent className="flex-grow">
                  <p className="text-muted-foreground">{service.description}</p>
                </CardContent>
                <div className="p-6 pt-0">
                  <Button
                    asChild
                    className="bg-primary hover:bg-primary/90 text-white rounded-full px-6 py-2 font-medium transition-colors"
                  >
                    <Link href={`/services/${service.slug}`}>
                      Read More <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-16 md:py-20 bg-secondary/10">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <span className="text-primary font-semibold uppercase tracking-wider">
              {whyChooseContent.tagline || "Why Choose Us"}
            </span>
            <h2 className="text-3xl md:text-4xl font-bold mt-2 mb-4">
              {whyChooseContent.title || "Benefits of Working With Us"}
            </h2>
            <p className="max-w-3xl mx-auto text-lg text-muted-foreground">
              {whyChooseContent.description ||
                "We provide exceptional financial services with a commitment to your success."}
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="bg-card rounded-lg p-6 text-center shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-2xl font-bold text-primary">{i}</span>
                </div>
                <h3 className="font-semibold text-lg mb-2">
                  {whyChooseContent[`benefit_${i}_title`] || `Benefit ${i}`}
                </h3>
                <p className="text-muted-foreground text-sm">
                  {whyChooseContent[`benefit_${i}_description`] ||
                    "Description of this benefit."}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <DynamicCTASection />
    </div>
  );
}
