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
  Sparkles,
  CheckCircle,
} from "lucide-react";
import { DynamicCTASection } from "@/components/DynamicCTASection";
import { MotionWrapper } from "@/components/MotionWrapper";
import Counter from "@/components/Counter";
import FloatingGraffiti from "@/components/FloatingGraffiti";
import { motion } from "framer-motion";

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
  Building2: <Building2 className="h-10 w-10 text-blue-600" />,
  TrendingUp: <TrendingUp className="h-10 w-10 text-blue-600" />,
  Landmark: <Landmark className="h-10 w-10 text-blue-600" />,
  Calculator: <Calculator className="h-10 w-10 text-blue-600" />,
  CreditCard: <CreditCard className="h-10 w-10 text-blue-600" />,
  ShieldHalf: <ShieldHalf className="h-10 w-10 text-blue-600" />,
  PiggyBank: <PiggyBank className="h-10 w-10 text-blue-600" />,
  HandCoins: <HandCoins className="h-10 w-10 text-blue-600" />,
  FileText: <FileText className="h-10 w-10 text-blue-600" />,
  University: <University className="h-10 w-10 text-blue-600" />,
  Briefcase: <Briefcase className="h-10 w-10 text-blue-600" />,
};

const largeIconComponents: Record<string, React.ReactNode> = {
  Briefcase: <Briefcase className="text-blue-600" size={48} />,
  HandCoins: <HandCoins className="text-emerald-500" size={48} />,
  ShieldHalf: <ShieldHalf className="text-purple-500" size={48} />,
};

export default function ServicesPage() {
  const [heroContent, setHeroContent] = useState<Record<string, any>>({});
  const [statsContent, setStatsContent] = useState<Record<string, any>>({});
  const [servicesIntro, setServicesIntro] = useState<Record<string, any>>({});
  const [services, setServices] = useState(defaultServices);
  const [whyChooseContent, setWhyChooseContent] = useState<Record<string, any>>(
    {},
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
      <div className="flex items-center justify-center min-h-screen bg-slate-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-500 font-medium">Loading Services...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="services-page-wrapper overflow-hidden bg-slate-50">
      {/* Hero Section */}
      <section
        className="relative min-h-[60vh] flex items-center justify-center overflow-hidden bg-gradient-to-br from-slate-50 via-slate-50/30"
        style={{
          background:
            "linear-gradient(to bottom right, #f8fafc, #f1f5f9, #eff6ff)",
        }}
      >
        {/* Animated Background */}
        <div className="absolute inset-0 overflow-hidden">
          <FloatingGraffiti />
          <div className="absolute top-20 right-10 w-72 h-72 bg-blue-500/5 rounded-full blur-3xl mix-blend-multiply animate-pulse"></div>
          <div className="absolute bottom-20 left-10 w-72 h-72 bg-indigo-500/5 rounded-full blur-3xl mix-blend-multiply animate-pulse delay-700"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10 text-center pt-20 pb-32">
          <MotionWrapper direction="up" delay={0.1}>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-slate-200 text-blue-600 text-sm font-medium mb-6 backdrop-blur-sm shadow-sm">
              <Sparkles className="w-4 h-4" />
              <span>Comprehensive Financial Solutions</span>
            </div>
          </MotionWrapper>

          <MotionWrapper direction="up" delay={0.2}>
            <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold tracking-tight mb-6 leading-tight text-slate-900">
              {heroContent.title || "Our Financial Services"}
            </h1>
          </MotionWrapper>

          <MotionWrapper direction="up" delay={0.3}>
            <p className="max-w-3xl mx-auto text-lg md:text-xl text-slate-600 mb-8 leading-relaxed">
              {heroContent.subtitle ||
                "A complete suite of financial solutions designed to help you achieve your goals at every stage of life."}
            </p>
          </MotionWrapper>
        </div>
      </section>

      {/* Stats as Cards Overlaying Hero */}
      <section className="relative -mt-24 z-20 pb-20">
        <div className="container mx-auto px-4">
          <MotionWrapper direction="up" delay={0.4}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  icon: statsContent.stat_1_icon || "Briefcase",
                  value: statsContent.stat_1_value || "500+",
                  label: statsContent.stat_1_label || "Projects Funded",
                  color: "blue",
                },
                {
                  icon: statsContent.stat_2_icon || "HandCoins",
                  value: statsContent.stat_2_value || "₹50Cr+",
                  label: statsContent.stat_2_label || "Loans Facilitated",
                  color: "emerald",
                },
                {
                  icon: statsContent.stat_3_icon || "ShieldHalf",
                  value: statsContent.stat_3_value || "100%",
                  label: statsContent.stat_3_label || "Client Satisfaction",
                  color: "purple",
                },
              ].map((stat, index) => (
                <div
                  key={index}
                  className="bg-white rounded-2xl p-8 shadow-xl shadow-slate-200/50 border border-slate-100 flex flex-col items-center justify-center text-center group hover:-translate-y-1 transition-transform duration-300"
                >
                  <div
                    className={`mb-4 p-4 rounded-xl bg-${stat.color}-50 group-hover:scale-110 transition-transform duration-300`}
                  >
                    {largeIconComponents[stat.icon]}
                  </div>
                  <h3 className="text-3xl font-bold text-slate-900 mb-2">
                    {stat.value}
                  </h3>
                  <p className="text-slate-500 font-medium">{stat.label}</p>
                </div>
              ))}
            </div>
          </MotionWrapper>
        </div>
      </section>

      {/* Services Introduction */}
      {(servicesIntro.tagline ||
        servicesIntro.title ||
        servicesIntro.description) && (
        <section className="py-12 md:py-20 bg-slate-50">
          <div className="container mx-auto px-4 text-center">
            <MotionWrapper direction="up" delay={0.1}>
              {servicesIntro.tagline && (
                <span className="text-blue-600 font-semibold uppercase tracking-wider text-sm mb-2 block">
                  {servicesIntro.tagline}
                </span>
              )}
              {servicesIntro.title && (
                <h2 className="text-3xl md:text-5xl font-bold mb-6 text-slate-900">
                  {servicesIntro.title}
                </h2>
              )}
              {servicesIntro.description && (
                <p className="max-w-3xl mx-auto text-lg text-slate-600 leading-relaxed">
                  {servicesIntro.description}
                </p>
              )}
            </MotionWrapper>
          </div>
        </section>
      )}

      {/* Services Grid Section */}
      <section className="services-grid-section py-16 md:py-20 bg-white relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent"></div>
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <MotionWrapper
                key={service.slug}
                direction="up"
                delay={0.1 * index}
              >
                <Card className="flex flex-col h-full border-slate-100 shadow-lg shadow-slate-100/50 hover:shadow-xl hover:shadow-blue-500/5 transition-all duration-300 group overflow-hidden bg-white">
                  <div className="h-2 bg-gradient-to-r from-blue-500 to-indigo-500 w-0 group-hover:w-full transition-all duration-500"></div>
                  <CardHeader className="items-center pb-2 pt-8">
                    <div className="w-16 h-16 rounded-2xl bg-slate-50 flex items-center justify-center mb-4 group-hover:bg-blue-50 transition-colors duration-300">
                      <div className="transform group-hover:scale-110 group-hover:-rotate-3 transition-all duration-300">
                        {iconComponents[service.icon] || (
                          <Briefcase className="h-8 w-8 text-blue-600" />
                        )}
                      </div>
                    </div>
                    <CardTitle className="text-xl font-bold text-slate-900 text-center">
                      {service.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="flex-grow flex flex-col items-center text-center">
                    <p className="text-slate-500 mb-6 leading-relaxed line-clamp-3">
                      {service.description}
                    </p>
                    <div className="mt-auto">
                      <Button
                        asChild
                        variant="ghost"
                        className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-full font-medium"
                      >
                        <Link
                          href={`/services/${service.slug}`}
                          className="flex items-center gap-2"
                        >
                          Read More <ArrowRight className="w-4 h-4" />
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </MotionWrapper>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-20 md:py-32 bg-slate-50 relative overflow-hidden">
        {/* Decorative blobs */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-100/30 rounded-full blur-3xl mix-blend-multiply opacity-50"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-100/30 rounded-full blur-3xl mix-blend-multiply opacity-50"></div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <MotionWrapper direction="up" delay={0.1}>
              <span className="text-blue-600 font-semibold uppercase tracking-wider text-sm">
                {whyChooseContent.tagline || "Why Choose Us"}
              </span>
              <h2 className="text-3xl md:text-5xl font-bold mt-2 mb-6 text-slate-900">
                {whyChooseContent.title || "Benefits of Working With Us"}
              </h2>
              <p className="max-w-3xl mx-auto text-lg text-slate-600">
                {whyChooseContent.description ||
                  "We provide exceptional financial services with a commitment to your success."}
              </p>
            </MotionWrapper>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[1, 2, 3, 4].map((i) => (
              <MotionWrapper
                key={i}
                direction="up"
                delay={0.1 * i}
                className="h-full"
              >
                <div className="group bg-white rounded-3xl p-8 shadow-sm border border-slate-100 hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300 h-full text-center hover:-translate-y-1">
                  <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-slate-50 text-blue-600 font-bold text-xl mb-6 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300 shadow-sm">
                    {i}
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-3 group-hover:text-blue-600 transition-colors">
                    {whyChooseContent[`benefit_${i}_title`] || `Benefit ${i}`}
                  </h3>
                  <p className="text-slate-500 text-sm leading-relaxed">
                    {whyChooseContent[`benefit_${i}_description`] ||
                      "Description of this benefit."}
                  </p>
                </div>
              </MotionWrapper>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <DynamicCTASection />
    </div>
  );
}
